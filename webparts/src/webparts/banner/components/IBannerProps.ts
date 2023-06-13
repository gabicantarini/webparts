import { DisplayMode } from '@microsoft/sp-core-library';
import { ISearchResult } from '@pnp/sp/search';


export interface IHighlightsManagementItem {
  order: number;
  path: string;
}

export interface IBannerProps {
  displayMode: DisplayMode;
  urlCode: string;
  sharedCode: string;
}

export interface IBannerItem {
  title: string;
  path: string;
  category?: string;
  tags?: ITags[];
  lead?: string;
  image: IImage;
  publishDate: Date;
  contentTypeName: string;
}

interface ITags {
  Label: string;
  TermID: string;
}

export interface ITrackerProps {}

export interface ITrackerWebPartProps {}

export interface ITrackModel {
  PageUrl: string;
  PageTitle: string;
  ContentTypeName: string;
  Category: string;
  Source: number;
  Action: number;
}

export interface ISearchResultBanner extends ISearchResult {
  LeadOWSMTXT: string;
  TagsRefStr: string;
  CategoryNameOWSTEXT: string;
  ImageOWSIMGE: string;
  ThumbnailImageOWSIMGE: string;
  PublicationDateOWSDATE: string;
  BannerStartDateOWSDATE: string;
  BannerEndDateOWSDATE: string;
  ContentTypeNameOWSTEXT: string;
  LinkOWSURLH: string;
}

export interface IImage {
  src: string;
  alt: string;
}