export interface IListItemFooter {
    title: string;
    description: string;
    group: string;
    link: string;
  }
  
  export interface IBlockedItem {
    [key: string]: IListItemFooter[];
  }