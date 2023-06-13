import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISearchResult } from '@pnp/sp/search';

export enum Profile {
  Administrator = 1,
  Colaborator = 2,
  ExternalColaborator = 3,
  ExternalColaboratorFinance = 4
}

export interface IContextProps {
  wpContext: WebPartContext;
}

export interface ISearchResultArticle extends ISearchResult {
  LeadOWSMTXT: string;
  TagsRefStr: string;
  ThumbnailImageOWSIMGE: string;
  ImageOWSIMGE: string;
  ImageBodyOWSIMGE: string;
  PublicationDateOWSDATE: string;
}