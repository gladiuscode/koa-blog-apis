export interface User {
  id: string;
  name?: string;
  surname?: string;
  email: string;
  password: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
}
