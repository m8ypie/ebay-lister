export interface TopLevelType {
  status: string;
  message: string;
  lists: { [key: string]: List };
}

export interface List {
  id: string;
  user_id: string;
  name: string;
  description: string;
  status: string;
  date_created: Date;
  last_updated: Date;
  public: string;
  hash: null | string;
}
