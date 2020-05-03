---
title: Microsoft Graph API
description: The Microsoft Graph API is a RESTful web API that enables you to access Microsoft Cloud service resources.
author: davidmu1
services: active-directory
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 02/13/2020
ms.author: davidmu
ms.custom: aaddev
---

# Microsoft Graph API

The Microsoft Graph API is a RESTful web API that enables you to access Microsoft Cloud service resources. After you register your app and get authentication tokens for a user or service, you can make requests to the Microsoft Graph API. For more information, see [Overview of Microsoft Graph](https://docs.microsoft.com/graph/overview).

Microsoft Graph exposes REST APIs and client libraries to access data on the following Microsoft 365 services:
- Office 365 services: Delve, Excel, Microsoft Bookings, Microsoft Teams, OneDrive, OneNote, Outlook/Exchange, Planner, and SharePoint
- Enterprise Mobility and Security services: Advanced Threat Analytics, Advanced Threat Protection, Azure Active Directory, Identity Manager, and Intune
- Windows 10 services: activities, devices, notifications
- Dynamics 365 Business Central

## Versions

Microsoft Graph currently supports two versions: v1.0 and beta. The v1.0 version includes generally available APIs. Use the v1.0 version for all production apps. The 
beta includes APIs that are currently in preview. Because we might introduce breaking changes to our beta APIs, we recommend that you use the beta version only to test apps that are in development; do not use beta APIs in your production apps. For more information, see [Versioning, support, and breaking change policies for Microsoft Graph](https://docs.microsoft.com/graph/versioning-and-support).

To start using the beta APIs, see [Microsoft Graph beta endpoint reference](https://docs.microsoft.com/graph/api/overview?view=graph-rest-beta)

To start using the v1.0 APIs, see [Microsoft Graph REST API v1.0 reference](https://docs.microsoft.com/graph/api/overview?view=graph-rest-1.0)

## Get started

To read from or write to a resource such as a user or an email message, you construct a request that looks like the following:

`{HTTP method} https://graph.microsoft.com/{version}/{resource}?{query-parameters}`

For more information about the elements of the constructed request, see [Use the Microsoft Graph API](https://docs.microsoft.com/graph/use-the-api)

Quickstart samples are available to show you how to access the power of the Microsoft Graph API. The samples that are available access two services with one authentication: Microsoft account and Outlook. Each quickstart accesses information from Microsoft account users' profiles and displays events from their calendar.
The quickstarts involve four steps:
- Select your platform
- Get your app ID (client ID)
- Build the sample
- Sign in, and view events on your calendar

When you complete the quickstart, you have an app that's ready to run. For more information, see the [Microsoft Graph quickstart FAQ](https://docs.microsoft.com/graph/quick-start-faq). To get started with the samples, see [Microsoft Graph QuickStart](https://developer.microsoft.com/graph/quick-start).

## Tools

Microsoft Graph Explorer is a web-based tool that you can use to build and test requests using Microsoft Graph APIs. You can access Microsoft Graph Explorer at: `https://developer.microsoft.com/graph/graph-explorer`.

Postman is a tool that you can also use to build and test requests using the Microsoft Graph APIs. You can download Postman at: `https://www.getpostman.com/`. To interact with Microsoft Graph in Postman, you use the Microsoft Graph collection in Postman. For more information, see [Use Postman with the Microsoft Graph API](/graph/use-postman?context=graph%2Fapi%2Fbeta&view=graph-rest-beta).
