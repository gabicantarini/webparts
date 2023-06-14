/* eslint-disable react/no-children-prop */
import {
  BaseClientSideWebPart,
  WebPartContext
} from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { sp } from '@pnp/sp';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IBannerProps } from './components/IBannerProps';
import { Context } from './components/Context';
import { Banner } from './components/Banner';
import { IContextProps } from './components/Entities';
export interface IBannerWebPartProps {
  urlCode: string;
  sharedCode: string;
}

export interface IHeaderWebPartProps {
  wpContext: WebPartContext;
}

export default class BannerWebPart extends BaseClientSideWebPart<IBannerWebPartProps> {
  public onInit(): Promise<void> {     
    sp.setup(this.context as any);    //workaround for yo incompatible version
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IBannerProps> = React.createElement(Banner, {
      displayMode: this.displayMode,
      urlCode: this.properties.urlCode,
      sharedCode: this.properties.sharedCode
    });

    const provider: React.FunctionComponentElement<React.ProviderProps<IContextProps>> = React.createElement(
      Context.Provider,
      {
        children: element,
        value: {
          wpContext: this.context
        }
      }
    );

    ReactDom.render(provider, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupName: '',
              groupFields: [
                PropertyPaneTextField('urlCode', {
                  label: 'Parametro para URL'
                }),
                PropertyPaneTextField('sharedCode', {
                  label: 'Parametro para link copiado'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
