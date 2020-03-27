---
title: Get started with Azure AD authentication by using the Azure portal| Microsoft Docs
description: Learn how to use the Azure portal to access Azure Active Directory (Azure AD) authentication to consume the Azure Media Services API. 
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/19/2019
ms.author: juliako

---
# Get started with Azure AD authentication by using the Azure portal

> [!NOTE]
> No new features or functionality are being added to Media Services v2. <br/>Check out the latest version, [Media Services v3](https://docs.microsoft.com/azure/media-services/latest/). Also, see [migration guidance from v2 to v3](../latest/migrate-from-v2-to-v3.md)

Learn how to use the Azure portal to access Azure Active Directory (Azure AD) authentication to access the Azure Media Services API.

## Prerequisites

- An Azure account. If you don't have an account, start with an [Azure free trial](https://azure.microsoft.com/pricing/free-trial/). 
- A Media Services account. For more information, see [Create an Azure Media Services account by using the Azure portal](media-services-portal-create-account.md).

When you use Azure AD authentication with Azure Media Services, you have two authentication options:

- **Service principal authentication**. Authenticate a service. Applications that commonly use this authentication method are apps that run daemon services, middle-tier services, or scheduled jobs: web apps, function apps, logic apps, APIs, or a microservice.
- **User authentication**. Authenticate a person who is using the app to interact with Media Services resources. The interactive application should first prompt the user for credentials. An example is a management console app used by authorized users to monitor encoding jobs or live streaming. 

## Access the Media Services API

This page lets you select the authentication method you want to use to connect to the API. The page also provides the values you need to connect to the API.

1. In the [Azure portal](https://portal.azure.com/), select your Media Services account.
2. Select how to connect to the Media Services API.
3. Under **Connect to Media Services API**, select the Media Services API version you want to connect to.

## Service principal authentication  (recommended)

Authenticates a service using an Azure Active Directory (Azure AD) app and secret. This is recommended for any middle-tier services calling to the Media Services API. Examples are Web Apps, Functions, Logic Apps, APIs, and microservices. This is the recommended authentication method.

### Manage your Azure AD app and secret

The **Manage your AAD app and secret** section lets you select or create a new Azure AD app and generate a secret. For security purposes, the secret cannot be shown after the blade is closed. The application uses the application ID and secret for authentication to obtain a valid token for media services.

Make sure that you have sufficient permissions to register an application with your Azure AD tenant and to assign the application to a role in your Azure subscription. For more information, see [Required permissions](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#required-permissions).

### Connect to Media Services API

The **Connect to Media Services API** provides you with values that you use to connect your service principal application. You can get text values or copy the JSON or XML blocks.

## User authentication

This option could be used to authenticate an employee or member of an Azure Active Directory who is using an app to interact with Media Services resources. The interactive application should first prompt the user for the user's credentials. This authentication method should only be used for Management applications.

### Connect to Media Services API

Copy your credentials to connect your user application from the **Connect to Media Services API** section. You can get text values or copy the JSON or XML blocks.

## Next steps

Get started with [uploading files to your account](media-services-portal-upload-files.md).
