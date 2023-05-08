---
title: Sign in users in your own Node.js browserless application by using Microsoft Entra - Prepare app
description: Learn how to configure a browserless application to sign in and sign out users by using Microsoft Entra - Prepare app
services: active-directory
author: Dickson-Mwendia
manager: mwongerapk

ms.author: dmwendia
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/30/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn about how to configure a sample Node.js browserless application to authenticate users with my Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in your own Node.js browserless application by using Microsoft Entra- Prepare app

In this article, you create a new Node.js browserless application and add all the files and folders required. You'll need to create the app to complete the rest of the articles in this series. However, if you prefer using a completed code sample for learning, download the [sample Node.js browserless application](https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial/archive/refs/heads/main.zip) from GitHub.

## Create a new Node.js application project

To build the Node.js browserless application from scratch, follow these steps:

1. Create a folder to host your application and give it a name, such as *ciam-node-browserless-app*.

1. In your terminal, navigate to your project directory, such as `cd ciam-node-browserless-app` and initialize your project using `npm init` 
 This creates a package.json file in your project folder, which contains references to all npm packages. 

1. In your project root directory, create two files named *authConfig.js* and *index.js*. The *authConfig.js* file contains the authentication configuration parameters while *index.js* holds the application authentication logic. 

 After creating the files, your project's directory structure should look similar to the following:

 ```
        ciam-node-browserless-app/
        ├── authConfig.js
        └── index.js
        └── package.json
 ```
## Next steps

Learn how to add sign-in support to a Node.js browserless application:

> [!div class="nextstepaction"]
> [Add sign in and sign out >](how-to-browserless-app-node-sign-in-sign-out.md)




