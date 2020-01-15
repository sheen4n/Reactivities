# Project Title - Reactivities

This Project is a combination of usage of Different Technology Stack: ASP.NET CORE, REACT, C#, State Management of MobX.

### Steps to run the project locally

```

There are multiple folders for this project - API, Application, client-app, Domain, Infrastructure and Persistence.

Client-App is the front-end, using ASP.NET Core.

Application is the Query Logic, using CQRS.
Persistence is Tier that uses Entity Framework to connect to MSSQL Database.
API is the Tier for Endpoints for the requests made from client application.

Domain is the core of the Application - having models.

---

To run the application, do the following:
1) Go to the Project directory.

[Before going on, ensure packages are restored by nuget]

2) Run the following command: dotnet run --project .\API\
(This is to start the backend)

3) Open another instance of the terminal, go back to the project directory

4) cd to the client-app

5) Run the command: npm install
(This is to restore the npm packages to node_modules for client-app)

6) Run the command: npm start

7) You are done!
Enjoy!
