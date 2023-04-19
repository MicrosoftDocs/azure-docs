---
title: Sign in users and call an API in your own Node.js web application by using Microsoft Entra- Prepare your tenant
description: Learn about how to prepare your Azure Active Directory (Azure AD) tenant for customers to sign in users and call an API in your own Node.js web application by using Microsoft Entra.
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/30/2023
ms.custom: developer
---

# Sign in users and call an API in your own Node.js web application by using Microsoft Entra - Prepare your tenant

In this article, you prepare your Azure Active Directory (Azure AD) for customers tenant for authentication and authorization. To prepare your tenant, you do the following tasks:

- Register a web API and configure permissions/scopes in the Microsoft Entra admin center. 

- Register a client web application and grant it API permissions in the Microsoft Entra admin center.

- Create a sign in and sign out user flow in Microsoft Entra admin center.

- Associate your client web application with the user flow. 

After you complete the tasks, you collect:

- *Application (client) ID* for your client web app and one for your web API.

- A *Client secret* for your client web app.

- A *Directory (tenant) ID* for your Azure AD for customers tenant.

- Web API permissions/scopes  

{continue from here} 

If you've already registered a client web application and a web API in the Microsoft Entra admin center, and created a sign in and sign up user flow, you can skip the steps in this article and move to [Prepare your web application and API](how-to-web-app-node-sign-in-call-api-prepare-app.md).