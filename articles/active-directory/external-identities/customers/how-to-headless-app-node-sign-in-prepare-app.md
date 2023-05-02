---
title: Sign in users in a sample Node.js headless application by using Microsoft Entra - Prepare app
description: Learn how to configure a headless application to sign in and sign out users by using Microsoft Entra - Prepare app
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

#Customer intent: As a dev, devops, I want to learn about how to configure a sample Node.js headless application to authenticate users with my Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in your own Node.js headless application by using Microsoft Entra

In this article, you create a new Node.js headless application and add all the files and folders required. You'll need to create the app to complete the rest of the articles in this series. However, if you prefer using a completed code sample for learning, download the sample headless application from GitHub.

## Create a new Node js application project

To build the Node.js headless application from scratch, follow the steps below:

1. Create a folder to host your application and give it a name, such as *ciam-node-headless-app*

1. In your terminal, navigate to your project directory, such as `cd ciam-node-headless-app` and initialize your project using `npm init` 
 This creates a package.json file in your project folder which will contain references to all npm packages. 

1. In your project root directory, create two files named *authConfig.js* and *index.js*
 *authConfig.js* will hold the authentication parameters while *index.js* will contain the authentication parameters. 

 After creating the files, your project's directory structure should look similar to this:

 ```
        ciam-node-headless-app/
        ├── authConfig.js
        └── index.js
        └── package.json
 ```

## Create the authentication configuration file








## Update your config file

