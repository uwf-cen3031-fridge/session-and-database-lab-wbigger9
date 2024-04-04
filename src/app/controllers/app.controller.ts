import { Request, Response, Router } from "express";
import { pino } from 'pino';

export class AppController {
  public router: Router = Router();
  private log: pino.Logger = pino();

  constructor() {
    this.initializeRouter();
  }

  private initializeRouter() {
    // Define the login page route (GET request)
    this.router.get("/login", (req: Request, res: Response) => {
      res.render("login");
    });

    // Handle login form submission (POST request)
    this.router.post("/login", (req: any, res: Response) => {
      req.session.user = req.body.username;
      res.redirect("/");
    });

    // Handle logout (GET request)
    this.router.get("/logout", (req: any, res: Response) => {
      req.session.destroy(() => {
        res.redirect("/");
      });
    });

    // Middleware to restrict access to routes
    this.router.use((req: any, res: Response, next) => {
      if (req.session.user) {
        next();
      } else {
        res.redirect("/login");
      }
    });

    // Serve the home page (after the middleware to ensure it's protected)
    this.router.get("/", (req: Request, res: Response) => {
      try {
        res.render("home");
      } catch (err) {
        this.log.error(err);
      }
    });

    // Place any additional routes that require authentication below the middleware
  }
}
