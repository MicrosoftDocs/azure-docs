---
title: Use client certificate for authentication in your Node.js web app
description: Learn how to use client certificate instead of secrets for authentication in your Node.js web app
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/05/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn Learn how to use client certificate instead of secrets for authentication in your Node.js web app
---

# Use client certificate for authentication in your Node.js web app

Microsoft identity supports two types of authentication for [confidential client applications](/articles/active-directory/develop/msal-client-applications.md); password-based authentication (such as client secret) and certificate-based authentication. For a higher level of security, we recommend using a certificate (instead of a client secret) as a credential in your confidential client applications.

In production, you should purchase a certificate signed by a well-known certificate authority, and use [Azure Key Vault](https://azure.microsoft.com/products/key-vault/) to manage certificate access and lifetime for you. However, for testing purposes, you can create a self-signed certificate and configure your apps to authenticate with it.

In this article, you'll...

## Create a self-signed certificate



## Upload certificate to your app registration




## Configure your Node.js app to use certificate



## Next steps
