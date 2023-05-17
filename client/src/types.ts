export interface IUser {
  _id: string;
  login: string;
}

export interface ITask {
  _id: string;
  text: string;
  completed: boolean;
}
