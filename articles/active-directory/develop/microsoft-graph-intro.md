---
title: Microsoft Graph API
description: The Microsoft Graph API is a RESTful web API that enables you to access Microsoft Cloud service resources.
author: FaithOmbongi
services: active-directory
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 10/08/2021
ms.author: ombongifaith
ms.custom: aaddev
---

# Microsoft Graph API

The Microsoft Graph API is a RESTful web API that enables you to access Microsoft Cloud service resources. After you register your app and get authentication tokens for a user or service, you can make requests to the Microsoft Graph API. For more information, see [Overview of Microsoft Graph](/graph/overview).

Microsoft Graph exposes REST APIs and client libraries to access data on the following Microsoft cloud services:

- Microsoft 365 services: Delve, Excel, Microsoft Bookings, Microsoft Teams, OneDrive, OneNote, Outlook/Exchange, Planner, and SharePoint
- Enterprise Mobility and Security services: Advanced Threat Analytics, Advanced Threat Protection, Azure Active Directory, Identity Manager, and Intune
- Windows 10 services: activities, devices, notifications
- Dynamics 365 Business Central

## Versions

The following versions of the Microsoft Graph API are currently available:

- **Beta version**: The beta version includes APIs that are currently in preview and are accessible in the `https://graph.microsoft.com/beta` endpoint. To start using the beta APIs, see [Microsoft Graph beta endpoint reference](/graph/api/overview?view=graph-rest-beta&preserve-view=true)
- **v1.0 version**: The v1.0 version includes APIs that are generally available and ready for production use. The v1.0 version is accessible in the `https://graph.microsoft.com/v1.0` endpoint. To start using the v1.0 APIs, see [Microsoft Graph REST API v1.0 reference](/graph/api/overview?view=graph-rest-1.0&preserve-view=true)

For more information about Microsoft Graph API versions, see [Versioning, support, and breaking change policies for Microsoft Graph](/graph/versioning-and-support).


## Get started

To read from or write to a resource such as a user or an email message, you construct a request that looks like the following pattern:

`{HTTP method} https://graph.microsoft.com/{version}/{resource}?{query-parameters}`

For more information about the elements of the constructed request, see [Use the Microsoft Graph API](/graph/use-the-api)

Quickstart samples are available to show you how to access the power of the Microsoft Graph API. The samples that are available access two services with one authentication: Microsoft account and Outlook. Each quickstart accesses information from Microsoft account users' profiles and displays events from their calendar.
The quickstarts involve four steps:

- Select your platform
- Get your app ID (client ID)
- Build the sample
- Sign in, and view events on your calendar

When you complete the quickstart, you have an app that's ready to run. For more information, see the [Microsoft Graph quickstart FAQ](/graph/quick-start-faq). To get started with the samples, see [Microsoft Graph QuickStart](https://developer.microsoft.com/graph/quick-start).

## Tools

**Microsoft Graph Explorer** is a web-based tool that you can use to build and test requests to the Microsoft Graph API. Access Microsoft Graph Explorer at https://developer.microsoft.com/graph/graph-explorer.

**Postman** is another tool you can use for making requests to the Microsoft Graph API. You can download Postman at https://www.getpostman.com. To interact with Microsoft Graph in Postman, use the [Microsoft Graph Postman collection](/graph/use-postman).

## Next steps

For more information about Microsoft Graph, including usage information and tutorials, see:

- [Use the Microsoft Graph API](/graph/use-the-api)
- [Microsoft Graph tutorials](/graph/tutorials)
