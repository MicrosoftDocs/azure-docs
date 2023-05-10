---
title: Call an API in your Node.js daemon application - prepare client app and web API
description: Learn about how to prepare your Node.js client daemon app and ASP.NET web API. The app you here prepare is what you configure later to sign in users, then call the web API.
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/22/2023
ms.custom: developer
---

# Call an API in your Node.js daemon application - prepare client app and web API

In this article, you create app projects for both the client daemon app and web API. Later, you enable the client daemon app to acquire an access token using its own identity, then call the web API.

## Prerequisite 

- Install [.NET SDK](https://dotnet.microsoft.com/learn/dotnet/hello-world-tutorial/install) v7 or later in your computer.

##  Build ASP.NET web API

You must first create a protected web API, which the client daemon calls by presenting a valid token. To do so, complete the steps in [Secure an ASP.NET web API](how-to-protect-web-api-dotnet-core-overview.md) article. In this article, you learn how to create and protect ASP.NET API endpoints, and run and test the API. The web API checks both app and user permissions. However, in this article, the client app acquires an access token with only app permissions.

Before you proceed, make sure you've [registered a web API app in Microsoft Entra admin center](how-to-daemon-node-call-api-prepare-tenant.md).

## Prepare Node.js client web app

In this step, you prepare the Node.js client web app that calls the ASP.NET web API.

### Create the Node.js daemon project

Create a folder to host your Node.js daemon application, such as `ciam-call-api-node-daemon`:

1. In your terminal, change directory into your Node daemon app folder, such as `cd ciam-call-api-node-daemon`, then run `npm init -y`. This command creates a default package.json file for your Node.js project. This command creates a default `package.json` file for your Node.js project.

1. Create more folders and files to achieve the following project structure:

    ```
        ciam-call-api-node-daemon/
        ├── auth.js
        └── authConfig.js
        └── fetch.js
        └── index.js 
        └── package.json
    ```

## Install app dependencies

In your terminal, install `axios`, `yargs` and `@azure/msal-node` packages by running the following command:

```console
npm install axios yargs @azure/msal-node   
```

## Next steps

Next, learn how to acquire an access token and call API:

> [!div class="nextstepaction"]
> [Acquire an access token and call API >](how-to-daemon-node-call-api-call-api.md)