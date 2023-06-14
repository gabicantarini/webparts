// tslint:disable:max-line-length
//import { DisplayMode, Environment, EnvironmentType } from '@microsoft/sp-core-library';
//import { SPBatch, sp } from '@pnp/sp';
import '@pnp/sp/attachments';
//import { IAttachmentInfo } from '@pnp/sp/attachments';
import '@pnp/sp/batch';
import '@pnp/sp/files';
import '@pnp/sp/folders';
import '@pnp/sp/items';
import '@pnp/sp/lists';
import '@pnp/sp/webs';
//import { Web } from '@pnp/sp/webs';
//import * as React from 'react';
//import * as ReactDOM from 'react-dom';
import dateFormat, { i18n } from 'dateformat';
/*import { IResultsOrganized } from '../webparts/helpdesk/components/modalFaqsList/Entities';*/
/*import { ISearchResultArticle } from './classes/Entities';*/
/*import { IImageGalleryList } from './components/mainGallery/Entities';*/
/*import { IModalMsgProps, ModalMsg, ModalMsgType } from './components/modalMsg/ModalMsg';*/
/*import { IImage } from './interfaces/IImage';*/
/*import { IDataSummaryLink, ISummaryLink } from './interfaces/ISummaryLink';*/
import { IImage, IWsRequest } from './IBannerProps';
import { ISearchResultArticle } from './Entities';

export class Shared {
  public static encodeRefinerValue(refinerValue: string): string {
    const stringToHex: Function = (tmp: string) => {
      const d2h: Function = (d: number) => {
        return d.toString(16);
      };
      let str: string = '',
        c: number;
      for (let i: number = 0; i < tmp.length; i += 1) {
        c = tmp.charCodeAt(i);
        str += d2h(c);
      }
      return str;
    };

    return 'ǂǂ' + stringToHex(unescape(encodeURIComponent(refinerValue)));
  }

  public static getMetadataValue(fieldValue: string): string[] {
    return fieldValue ? fieldValue.split(';').map((f) => f.trim()) : [];
  }

  public static getDateFromDisplayTemplate(dateTimeInputValue: string, pageField?: boolean): Date {
    if (dateTimeInputValue) {
      dateTimeInputValue = dateTimeInputValue.replace('&nbsp;', '');
      if (dateTimeInputValue.length > 0) {
        if (dateTimeInputValue.indexOf('T') > -1) {
          return new Date(dateTimeInputValue);
        }

        const dateFix: string = ' UTC';
        if (dateTimeInputValue.indexOf('PM') > -1 || dateTimeInputValue.indexOf('AM') > -1) {
          return new Date(dateTimeInputValue + dateFix);
        }

        const values: RegExpMatchArray = dateTimeInputValue.match(/\d+/gi);
        const day: string = values[0],
          month: string = values[1],
          year: string = values[2],
          hour: string = values[3] || '00',
          minute: string = values[4] || '00',
          second: string = values[5] || '00';

        const dateStr: string = [month, day, year].join('/') + ' ' + [hour, minute, second].join(':');

        return pageField ? new Date(dateStr) : new Date(dateStr + dateFix);
      } else {
        return;
      }
    } else {
      return;
    }
  }

  public static getImageValue(fieldValue: string): IImage {
    if (fieldValue) {
      const divTemp: HTMLDivElement = document.createElement('div');
      divTemp.innerHTML = fieldValue;
      const image: Document = new DOMParser().parseFromString(divTemp.innerText || divTemp.innerHTML, 'text/html');
      return {
        src: image.querySelector('img') ? image.querySelector('img').getAttribute('src') : '',
        alt: image.querySelector('img') ? image.querySelector('img').getAttribute('alt') : ''
      };
    } else {
      return { src: '', alt: '' };
    }
  }

  public static getVideoValue(fieldValue: string): string {
    // if (fieldValue && (fieldValue.startsWith("&lt;iframe") || fieldValue.startsWith('<div dir="">&lt;iframe'))) {
    if (fieldValue) {
      const div: HTMLDivElement = document.createElement('div');
      div.innerHTML = fieldValue;
      return div.innerText;
    } else {
      return '';
    }
  }

  public static getInternalVideoValue(fieldValue: string): string {
    // if (fieldValue && (fieldValue.startsWith("&lt;iframe") || fieldValue.startsWith('<div dir="">&lt;iframe'))) {
    if (fieldValue) {
      const div: HTMLDivElement = document.createElement('div');
      div.innerHTML = fieldValue;
      const anchor: HTMLAnchorElement = div.querySelector('div a');
      return anchor.getAttribute('href');
    } else {
      return '';
    }
  }


  /**
   *
   * @param dateInput JS Date to format
   * @param format String formatter. Default: dd-mm-yyyy
   * @returns formatted Date as string
   */
  public static formatDate(dateInput: Date, format?: string): string {
    i18n.monthNames = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
      'janeiro',
      'fevereiro',
      'março',
      'abril',
      'maio',
      'junho',
      'julho',
      'agosto',
      'setembro',
      'outubro',
      'novembro',
      'dezembro'
    ];

    if (!dateInput) {
      return '';
    }

    return dateFormat(dateInput, format || 'd mmmm yyyy');
  }

  /**
   *
   * @param wsRequest input necessary to invoke web service. Specify type in method name
   * @example sendWsRequest<I, O>({
   * wpContext: this.context, //WebpartContext
   * service: 'UserManagementService', //service name
   * method: 'GetUserAccountDetailsByLoginName', //service method name
   * input<I>: {}, //input json object
   * wsMethod: 'GET', //optional request method. Default value: GET. Possible values: GET,POST,PUT,DELETE
   * }).then().catch()
   * @returns json object from output. Define output type in variable O
   */
  public static sendWsRequest<I, O>(wsRequest: IWsRequest<I>): Promise<O | string> {
    const myInit: RequestInit = {
      method: wsRequest.wsMethod || 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      cache: 'default',
      body: wsRequest.input ? JSON.stringify(wsRequest.input) : undefined
    };

    // TODO: confirmar - alteração de web para site de forma a que o URL não dependa do site actual
    const myRequest: Request = new Request(
      `${wsRequest.wpContext.pageContext.site.absoluteUrl}/_vti_bin/NAME.WebApi/${wsRequest.service}.svc/${wsRequest.method}`,
      myInit
    );

    return fetch(myRequest).then((response) => {
      if (response.ok) {
        const contentType: string = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          return response.json();
        } else {
          return response.text();
        }
      } else {
        return Promise.reject(response.text());
      }
    });
  }

  /*public static showModalMessage(modalProps: IModalMsgProps): void {
    const modal: React.FunctionComponentElement<IModalMsgProps> = React.createElement(ModalMsg, modalProps);
    const modalDiv: HTMLElement = document.getElementById('modalMsgDiv');
    if (modalDiv) {
      ReactDOM.render(modal, modalDiv);
    } else {
      const mainEl: HTMLCollectionOf<HTMLElement> = document.getElementsByTagName('main');
      const dummyDiv: HTMLDivElement = document.createElement('div');
      dummyDiv.id = 'modalMsgDiv';
      if (mainEl.length) {
        ReactDOM.render(modal, mainEl[0].appendChild(dummyDiv));
      }
    }
  }*/

  /*public static showSuccessMessage(msg: string): void {
    msg = msg || 'Operacao Realizada com Sucesso!';
    this.showModalMessage({
      message: msg,
      type: ModalMsgType.Success,
      timeOpen: 2000,
      showFooterButton: false,
      closeAutomatically: true
    });
  }*/

  /*public static showErrorMessage(msg: string): void {
    msg = msg || 'Ocorreu um erro. Por favor tente novamente.';
    this.showModalMessage({
      message: msg,
      type: ModalMsgType.Error,
      showFooterButton: false,
      closeAutomatically: false
    });
  }

  public static showInfoMessage(msg: string): void {
    this.showModalMessage({
      message: msg,
      type: ModalMsgType.Info,
      showFooterButton: true,
      closeAutomatically: false,
      hideCancelButton: true
    });
  }*/

  /*public static showWaitPanel(): void {
    Shared.showModalMessage({
      showModal: true,
      message: 'Por favor aguarde...',
      type: ModalMsgType.WaitPanel,
      showFooterButton: false,
      closeAutomatically: true
    });
  }

  public static hideWaitPanel(): void {
    Shared.showModalMessage({
      showModal: false,
      message: '',
      type: ModalMsgType.WaitPanel
    });
  }*/

  public static getRichLinkFieldValue(fieldValue: string): string {
    if (fieldValue) {
      const aElem: Document = new DOMParser().parseFromString(fieldValue, 'text/html');
      const href: string = aElem.querySelector('a') ? aElem.querySelector('a').getAttribute('href') : '';
      return href;
    } else {
      return '';
    }
  }

  public static getUrlFieldValue(fieldValue: string): string {
    if (fieldValue) {
      const href: string = fieldValue.split(',')[0];
      return href;
    } else {
      return '';
    }
  }

  public static isValidUrl(url: string): boolean {
    const pattern: RegExp = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator
    return !!pattern.test(url);
  }

  public static getCtName(contentType: string): string {
    if (contentType && contentType.indexOf('\n\n') > -1) {
      return contentType.substring(contentType.indexOf('\n\n') + 2).replace(' - ', '');
    }
    return contentType;
  }

  public static getThumbnailImage(item: ISearchResultArticle): IImage {
    return item.ThumbnailImageOWSIMGE
      ? Shared.getImageValue(item.ThumbnailImageOWSIMGE)
      : item.ImageOWSIMGE
      ? Shared.getImageValue(item.ImageOWSIMGE)
      : item.ImageBodyOWSIMGE
      ? Shared.getImageValue(item.ImageBodyOWSIMGE)
      : { src: '', alt: '' };
  }
  public static convertStringToDate(arg: string): Date {
    const regExp: RegExp = /\(([^)]+)\)/;
    const date: RegExpExecArray = regExp.exec(arg);
    return new Date(parseInt(date[1], 10));
  }

  public static convertJsDateToEpochStr(date: Date): string {
    return `/Date(${date.getTime()}+0000)/`;
  }

  /*public static getAttachments(listUrl: string, ids: string[]): Promise<IResultsOrganized[]> {
    return new Promise((resolve, reject) => {
      const batch: SPBatch = sp.createBatch();
      const attachs: IResultsOrganized[] = [];

      ids.forEach((id: string) => {
        sp.site.rootWeb
          .getList(listUrl)
          .items.getById(parseInt(id, 10))
          .attachmentFiles.inBatch(batch)
          .get()
          .then((results: IAttachmentInfo[]) => {
            attachs.push({
              id: id,
              attachs: results
            });
          })
          .catch(console.error);
      });

      batch
        .execute()
        .then(() => resolve(attachs))
        .catch(reject);
    });
  }*/

  /*public static setStorageItem(
    cacheKey: string,
    value: string,
    wpContext: WebPartContext,
    isLocalStorage?: boolean
  ): void {
    if (isLocalStorage) {
      window.localStorage.setItem(`${wpContext.pageContext.user.loginName}_${cacheKey}`, value);
    } else {
      window.sessionStorage.setItem(`${wpContext.pageContext.user.loginName}_${cacheKey}`, value);
    }
  }

  public static getStorageItem(cacheKey: string, wpContext: WebPartContext, isLocalStorage?: boolean): string {
    return isLocalStorage
      ? window.localStorage.getItem(`${wpContext.pageContext.user.loginName}_${cacheKey}`)
      : window.sessionStorage.getItem(`${wpContext.pageContext.user.loginName}_${cacheKey}`);
  }*/

  /**
   *
   * @param displayMode webpart display mode
   * @returns the current display mode of the webpart
   */
  /*public static getDisplayMode(displayMode: DisplayMode): DisplayMode {
    if (Environment.type === EnvironmentType.ClassicSharePoint) {
      if (document.forms[window.MSOWebPartPageFormName].MSOLayout_InDesignMode.value === '1') {
        return DisplayMode.Edit;
      }

      return DisplayMode.Read;
    } else {
      return displayMode;
    }
  }

  public static isEditMode(displayMode: DisplayMode): boolean {
    return Shared.getDisplayMode(displayMode) === DisplayMode.Edit;
  }*/

  public static getFileIcon(extension: string): string {
    if (extension[0] !== '.') {
      extension = '.' + extension;
    }
    switch (extension) {
      case '.docx':
      case '.doc':
        return 'fa-file-word';
      case '.xlsx':
      case '.xls':
        return 'fa-file-excel';
      case '.pptx':
      case '.ppt':
        return 'fa-file-powerpoint';
      case '.pdf':
        return 'fa-file-pdf';
      case '.jpg':
      case '.jpeg':
      case '.png':
      case '.gif':
      case '.svg':
        return 'fa-file-image';
      case '.txt':
        // return 'fa-file-lines'; // nosso fontawesome não mostra file-lines
        return 'fa-file';
      default:
        return 'fa-file';
    }
  }

 /* public static getImagesFromFolder(imageGalleryField: string): Promise<IImageGalleryList[]> {
    return new Promise((resolve, reject) => {
      if (!imageGalleryField) {
        reject();
      }

      const url: string =
        imageGalleryField.indexOf(window.location.origin) > -1
          ? imageGalleryField
          : window.location.origin + imageGalleryField;
      sp.site.getWebUrlFromPageUrl(url).then(getImages).then(resolve).catch(reject);

      function getImages(webUrl: string): Promise<IImageGalleryList[]> {
        return new Promise((_resolve, _reject) => {
          const images: IImageGalleryList[] = [];
          Web(webUrl)
            .getFolderByServerRelativeUrl(imageGalleryField)
            .files.expand('ListItemAllFields')
            .orderBy('Name')
            .get()
            .then((files) => {
              const key: string = 'ListItemAllFields';

              files.forEach((file) => {
                images.push({
                  url: file.ServerRelativeUrl,
                  name: file.Name,
                  title: file.Title,
                  id: file[key].ID,
                  comments: file[key].OData__Comments
                });
              });

              _resolve(images);
            })
            .catch(_reject);
        });
      }
    });
  } */

  /**
   * A password is considered strong if:
   *   8 characters length or more
   *   1 digit or more
   *   1 symbol or more of this sequence: !@#$%^&*()-=_+{};':"|,.<>?
   *   1 uppercase letter or more
   *   1 lowercase letter or more
   *
   * @param passwordToValidate string
   */
  public static checkInsecurePassword(passwordToValidate: string): string | boolean {
    const pattern1: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-=_+{};':"|,.<>?]).{8,}$/g;
    return pattern1.test(passwordToValidate) ? false : 'A palavra-passe inserida não é suficientemente forte.';
  }

  public static setCookie(cname: string, cvalue: string): void {
    const d: Date = new Date();
    d.setTime(d.getTime() + 3650 * 24 * 60 * 60 * 1000); // 10 years
    const expires: string = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  public static getCookie(n: string): string {
    const a: RegExpMatchArray = `; ${document.cookie}`.match(`;\\s*${n}=([^;]+)`);
    return a ? a[1] : '';
  }

  public static getArticleTypeIcon(contentType: string): string {
    switch (contentType) {
      case 'Vídeo':
        return 'fa-video';
      case 'Galeria de Vídeos':
        return 'fa-film';
      case 'Imagem':
        return 'fa-image';
      case 'Podcast':
        return 'fa-podcast';
      case 'Galeria de Imagens':
        return 'fa-images';
      default:
        return 'fa-newspaper';
    }
  }

  public static getClippingTypeIcon(clippingType: string): string {
    switch (clippingType) {
      case 'Imprensa':
        return 'fa-newspaper';
      case 'NAME':
        return 'fa-globe';
      case 'Rádio':
        return 'fa-radio';
      case 'TV':
        return 'fa-tv';
      default:
        return 'fa-globe';
    }
  }
}
