declare module 'resend' {
  export class Resend {
    constructor(apiKey: string | undefined);
    emails: {
      send(opts: {
        from: string;
        to: string[];
        subject: string;
        html: string;
        replyTo?: string;
      }): Promise<any>;
    };
  }
}
