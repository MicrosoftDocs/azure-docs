<properties
	pageTitle="Create an ASP.NET API app in Azure App Service "
	description="Learn how to to create an ASP.NET API app in Azure App Service, using Visual Studio 2013 "
	services="app-service\api"
	documentationCenter=".net"
	authors="bradygaster"
	manager="wpickett"
	editor="jimbe"/>

<tags
	ms.service="app-service-api"
	ms.workload="web"
	ms.tgt_pltfrm="dotnet"
	ms.devlang="na"
	ms.topic="get-started-article" 
	ms.date="05/19/2015"
	ms.author="bradyg;tarcher"/>

# Create an ASP.NET API app in Azure App Service

> [AZURE.SELECTOR]
- [Visual Studio 2013](app-service-dotnet-create-api-app.md)
- [Visual Studio 2015 RC](app-service-dotnet-create-api-app-vs2015.md)
- [Visual Studio Code](app-service-create-aspnet-api-app-using-vscode.md)

## Overview

This tutorial shows how to create an ASP.NET Web API project using a Visual Studio 2013 template that configures the project for deployment to the cloud as an [API app](app-service-api-apps-why-best-platform.md) in [Azure App Service](../app-service/app-service-value-prop-what-is.md). For information about how to configure an existing Web API project for deployment as an API app, see [Configure a Web API project as an API app](app-service-dotnet-create-api-app-visual-studio.md).

Subsequent tutorials in the series show how to [deploy](app-service-dotnet-deploy-api-app.md) and [debug](../app-service-dotnet-remotely-debug-api-app.md) the API app project that you create in this tutorial.

[AZURE.INCLUDE [install-sdk-2013-only](../../includes/install-sdk-2013-only.md)]

This tutorial requires version 2.5.1 or later of the Azure SDK for .NET.

## Create an API app project

1. Open Visual Studio 2013.

2. Select **File > New Project**.

3. Select the **ASP.NET Web Application** template.

4. Make sure that the **Add Application Insights to Project** check box is cleared.

4. Name the project *ContactsList*

	![](./media/app-service-dotnet-create-api-app/01-filenew-v3.png)

5. Click **OK**.

6. In the **New ASP.NET Project** dialog, select the **Azure API App** project template.

	![](./media/app-service-dotnet-create-api-app/02-api-app-template-v3.png)

7. Click **OK** to generate the project.

Visual Studio creates a Web API project configured for deployment as an API app.

[AZURE.INCLUDE [app-service-api-review-metadata](../../includes/app-service-api-review-metadata.md)]

[AZURE.INCLUDE [app-service-api-define-api-app](../../includes/app-service-api-define-api-app.md)]

[AZURE.INCLUDE [app-service-api-direct-deploy-metadata](../../includes/app-service-api-direct-deploy-metadata.md)]

## Next steps

Your API app is now ready to be deployed, and you can follow the [Deploy an API app](app-service-dotnet-deploy-api-app.md) tutorial to do that.
 