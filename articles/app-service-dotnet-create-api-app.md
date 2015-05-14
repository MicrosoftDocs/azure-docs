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
	ms.topic="article" 
	ms.date="02/19/2015" 
	ms.author="bradyg;tarcher"/>

# Create an ASP.NET API app in Azure App Service

## Overview

This tutorial shows how to create an ASP.NET Web API project from scratch and configure it for deployment to the cloud as an [API app](app-service-api-apps-why-best-platform.md) in [Azure App Service](app-service-value-prop-what-is.md). If you have an existing Web API project that you want to convert to an API app, refer to the article, [Configure a Web API project as an API app](./app-service-dotnet-create-api-app-visual-studio). Subsequent tutorials in the series show how to [deploy](app-service-dotnet-deploy-api-app.md) and [debug](app-service-dotnet-remotely-debug-api-app.md) the API app project that you create in this tutorial.

For information about API apps, see [What are API apps?](app-service-api-apps-why-best-platform.md).

[AZURE.INCLUDE [install-sdk-2013-only](../includes/install-sdk-2013-only.md)]

This tutorial requires version 2.5.1 or later of the Azure SDK for .NET.

## Create an API app project 

This section shows how to use the Azure API App project template to create an API app from scratch. To learn how to configure an existing Web API project as an API app, skip to the [next section](#configure-a-web-api-project-as-an-api-app).

1. Open Visual Studio 2013.

2. Select **File > New Project**. 

3. Select the **ASP.NET Web Application** template.  

4. Name the project *ContactsList*

	![](./media/app-service-dotnet-create-api-app/01-filenew-v3.png)

5. Click **OK**.

6. In the **New ASP.NET Project** dialog, select the **Azure API App** project template.

	![](./media/app-service-dotnet-create-api-app/02-api-app-template-v3.png)

7. Click **OK** to generate the project.

Visual Studio creates a Web API project configured for deployment as an API app.

[AZURE.INCLUDE [app-service-api-review-metadata](../includes/app-service-api-review-metadata.md)]

[AZURE.INCLUDE [app-service-api-define-api-app](../includes/app-service-api-define-api-app.md)]

[AZURE.INCLUDE [app-service-api-direct-deploy-metadata](../includes/app-service-api-direct-deploy-metadata.md)]

## Next steps

Your API app is now ready to be deployed, and you can follow the [Deploy an API app](app-service-dotnet-deploy-api-app.md) tutorial to do that.
