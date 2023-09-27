---
title: Sign in users in your own Node.js browserless application by using the Device Code flow- Prepare app
description: Learn how to build a browserless application to sign in and sign out users - Prepare app
services: active-directory
author: Dickson-Mwendia
manager: mwongerapk

ms.author: dmwendia
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/09/2023
ms.custom: developer, devx-track-js
#Customer intent: As a dev, devops, I want to learn about how to build a Node.js browserless application to authenticate users with my Microsoft Entra ID for customers tenant
---

# Sign in users in your own Node.js browserless application using the Device Code flow- Prepare app

In this article, you create a new Node.js browserless application and add all the files and folders required. You'll need to create the app to complete the rest of the articles in this series. However, if you prefer using a completed code sample for learning, download the [sample Node.js browserless application](https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial/archive/refs/heads/main.zip) from GitHub.

## Create a new Node.js application project

To build the Node.js browserless application from scratch, follow these steps:

1. Create a folder to host your application and give it a name, such as *ciam-sign-in-node-browserless-app*.

1. In your terminal, navigate to your project directory, such as `cd ciam-sign-in-node-browserless-app` and initialize your project using `npm init` 
 This creates a package.json file in your project folder, which contains references to all npm packages. 

1. In your project root directory, create two files named *authConfig.js* and *index.js*. The *authConfig.js* file contains the authentication configuration parameters while *index.js* holds the application authentication logic. 

 After creating the files, you should achieve the following project structure:

 ```
        ciam-sign-in-node-browserless-app/
        ├── authConfig.js
        └── index.js
        └── package.json
 ```

## Install app dependencies

The application you build uses MSAL Node to sign in users. To install the MSAL Node package as a dependency in your project, open the terminal in your project  directory and run the following command. 

```powershell
    npm install @azure/msal-node   
```

## Next steps

Learn how to add sign-in support to a Node.js browserless application:

> [!div class="nextstepaction"]
> [Add sign in and sign out >](how-to-browserless-app-node-sign-in-sign-out.md)
