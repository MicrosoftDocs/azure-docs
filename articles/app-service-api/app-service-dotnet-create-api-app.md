<properties
	pageTitle="Create an ASP.NET API app in Azure App Service | Microsoft Azure"
	description="Learn how to create an ASP.NET API app in Azure App Service, by using Visual Studio 2013."
	services="app-service\api"
	documentationCenter=".net"
	authors="bradygaster"
	manager="wpickett"
	editor="jimbe"/>

<tags
	ms.service="app-service-api"
	ms.workload="na"
	ms.tgt_pltfrm="dotnet"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="10/08/2015"
	ms.author="tdykstra"/>

# Create an ASP.NET API app in Azure App Service

> [AZURE.SELECTOR]
- [.NET - Visual Studio 2015](app-service-dotnet-create-api-app.md)
- [.NET - Visual Studio Code](app-service-create-aspnet-api-app-using-vscode.md)
- [Node.js](app-service-api-nodejs-api-app.md)
- [Java](app-service-api-java-api-app.md)

## Overview

This tutorial shows how to create an ASP.NET Web API project that is configured for deployment to the cloud as an [API app in Azure App Service](app-service-api-apps-why-best-platform.md). For information about how to configure an existing Web API project for deployment as an API app, see [Configure a Web API project as an API app](app-service-dotnet-create-api-app-visual-studio.md).

This is a quick and simple tutorial that only shows how to create a Visual Studio project using a template.  It is the first in a series that also shows how to [deploy](app-service-dotnet-deploy-api-app.md) and [debug](../app-service-dotnet-remotely-debug-api-app.md) the API app project that you create in this tutorial. For more in-depth coverage of how to work with API apps, see the [Next steps](#next-steps) section at the end of the tutorial.

[AZURE.INCLUDE [install-sdk-2015-2013](../../includes/install-sdk-2015-2013.md)]

This tutorial requires version 2.6 or later of the Azure SDK for .NET.

## Create an API app project

When the instructions direct you to enter a name for the project, enter **ContactsList**.

[AZURE.INCLUDE [app-service-api-create](../../includes/app-service-api-create.md)]

[AZURE.INCLUDE [app-service-api-review-metadata](../../includes/app-service-api-review-metadata.md)]

[AZURE.INCLUDE [app-service-api-define-api-app](../../includes/app-service-api-define-api-app.md)]

[AZURE.INCLUDE [app-service-api-direct-deploy-metadata](../../includes/app-service-api-direct-deploy-metadata.md)]

## Next steps

Your API app is now ready to be deployed, and you can follow the [Deploy an API app](app-service-dotnet-deploy-api-app.md) tutorial to do that.

For information about how to use automatically generated client code to call API apps, see [Consume an API app from a .NET client](app-service-api-dotnet-consume.md).

For information about how to customize the automatically generated Swagger metadata for an API app, see [Customize Swashbuckle-generated API definitions](app-service-api-dotnet-swashbuckle-customize.md).

For information about how to create, delete, and configure API apps in the Azure preview portal, see [Manage API apps](app-service-api-manage-in-portal.md).

For information about authenticating users of API apps, see [Authentication for API apps and mobile apps in Azure App Service](../app-service/app-service-authentication-overview.md).

For information about API Apps features, see [What are API apps?](app-service-api-apps-why-best-platform.md).
