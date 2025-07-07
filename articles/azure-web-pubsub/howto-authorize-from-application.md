---
title: Authorize an application request by using Microsoft Entra ID
description: This article provides information about authorizing requests to Azure Web PubSub resources with Microsoft Entra applications.
author: terencefan
ms.author: tefa
ms.date: 03/11/2025
ms.service: azure-web-pubsub
ms.topic: conceptual
---

# Authorize requests to Azure Web PubSub resources with Microsoft Entra applications

Azure Web PubSub Service supports Microsoft Entra ID for authorizing requests with [Microsoft Entra applications](/entra/identity-platform/app-objects-and-service-principals).


This article explains how to set up your resource and code to authenticate requests to the resource using a Microsoft Entra application.

## Register an application in Microsoft Entra ID

The first step is to [Register an application in Microsoft Entra ID](/entra/identity-platform/quickstart-register-app):

After you register your application, you can find the **Application (client) ID** and **Directory (tenant) ID** values on the application's overview page. These GUIDs can be useful in the following steps.

![Screenshot of overview information for a registered application.](./media/howto-authorize-from-application/application-overview.png)

## Add credentials

After registering an app, you can add **certificates, client secrets (a string), or federated identity credentials** as credentials to your confidential client app registration. Credentials allow your application to authenticate as itself, requiring no interaction from a user at runtime, and are used by confidential client applications that access a web API.

- [Add a certificate](/entra/identity-platform/quickstart-register-app?tabs=certificate#add-credentials)
- [Add a client secret](/entra/identity-platform/quickstart-register-app?tabs=client-secret#add-credentials)
- [Add a federated credential](/entra/identity-platform/quickstart-register-app?tabs=federated-credential#add-credentials)

## Add role assignments in the Azure portal

[!INCLUDE [add role assignments](includes/web-pubsub-add-role-assignments.md)]

## Code samples with Microsoft Entra authorization

Check out our samples that show how to use Microsoft Entra authorization in programming languages we officially support.

- [C#](./howto-create-serviceclient-with-net-and-azure-identity.md)
- [Python](./howto-create-serviceclient-with-python-and-azure-identity.md)
- [Java](./howto-create-serviceclient-with-java-and-azure-identity.md)
- [JavaScript](./howto-create-serviceclient-with-javascript-and-azure-identity.md)

## Related content

- [Overview of Microsoft Entra ID for Web PubSub](concept-azure-ad-authorization.md)
- [Use Microsoft Entra ID to authorize a request from a managed identity to Web PubSub resources](howto-authorize-from-managed-identity.md)
- [Disable local authentication](./howto-disable-local-auth.md)
