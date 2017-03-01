---
title: Reference for navigating the Azure portal
description: Learn the different user experiences for App Service Web between the management portal and the Azure Portal
services: app-service
documentationcenter: ''
author: jaime-espinosa
manager: erikre
editor: jimbe

ms.assetid: 0cc6a3cc-bd89-4a96-9177-d25f6fb737bb
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/26/2016
ms.author: jaime-espinosa

---
# Reference for navigating the Azure portal
Azure Websites are now called [App Service Web Apps](http://go.microsoft.com/fwlink/?LinkId=529714). We're updating all of our documentation to reflect this name change and to provide instructions for the Azure Portal. Until that process is done, you can use this document as a guide for working with Web Apps in the Azure portal.

[!INCLUDE [app-service-web-to-api-and-mobile](../../includes/app-service-web-to-api-and-mobile.md)]

## The future of the Azure Classic Portal
While you will notice the branding changes on the Azure Classic Portal, that portal is in the process of being replaced by the Azure Portal. As the classic portal is being phased out, the focus for new development is shifting to the Azure Portal. All upcoming new features for Web Apps will come in the Azure Portal. Start using the Azure Portal to take advantage of the latest and greatest that Web Apps have to offer.

## Layout differences between the Azure Classic Portal and Azure Portal
In the classic portal, all the Azure services are listed on the left hand side. Navigation in the classic portal follows a tree structure, where you start from the service and navigate into each element. This structure works well when managing independent components. However, applications built on Azure are a collection of interconnected services, and this tree structure isn't ideal for working with collections of services. 

The Azure portal makes it easy to build applications end-to-end with components from multiple services. The portal is organized as *journeys*. A *journey* is a series of *blades*, which are containers for the different components. For example, setting up auto-scaling for a web app is a *journey* which takes you several blades as shown in the following example: the **web-site** blade (that blade title has not yet been updated to use the new terminology), the **Settings** blade, and the **Scale out** blade. In the example, auto scaling is being set up to depend on CPU usage, so there is also a **CPU Percentage** blade. The components within the *blades* are called *parts*, which look like tiles. 

![](./media/app-service-web-app-azure-portal/AutoScaling.png)

## Navigation example: create a web app
Creating new web apps is still as easy as 1-2-3. The following image shows the classic portal and the portal side-by-side to demonstrate that not much has changed in the number of steps needed to get a web app up and running. 

![](./media/app-service-web-app-azure-portal/CreateWebApp.png)

In the portal you can choose from the most common types of web apps, including popular gallery applications like WordPress. For a full list of available applications, visit the [Azure Marketplace].

When you create a web app, you specify URL, App Service plan, and location in the portal just as you do in the classic portal. 

![](./media/app-service-web-app-azure-portal/CreateWebAppSettings.png)

In addition, the portal lets you define other common settings. For example, [resource groups](../azure-resource-manager/resource-group-overview.md) make it simple to see and manage related Azure resources. 

## Navigation example: settings and features
All the settings and features are now logically grouped in a single blade, from which you can navigate.

![](./media/app-service-web-app-azure-portal/WebAppSettings.png)

For example, you can create custom domains by clicking **Custom domains and SSL** in the **Settings** blade.

![](./media/app-service-web-app-azure-portal/ConfigureWebApp.png)

To set up a monitoring alert, click **Requests and errors** and then **Add Alert**.

![](./media/app-service-web-app-azure-portal/Monitoring.png)

To enable diagnostics, click **Diagnostics logs** in the **Settings** blade.

![](./media/app-service-web-app-azure-portal/Diagnostics.png)

To configure application settings, click **Application settings** in the **Settings** blade. 

![](./media/app-service-web-app-azure-portal/AppSettingsPreview.png)

Other than the brand name, a few things in the portal have been renamed or grouped differently to make it easier to find them. For example, below is a screenshot of the corresponding page for app settings (**Configure**) in the classic portal.

![](./media/app-service-web-app-azure-portal/AppSettings.png)

## More Resources
[Azure Portal]: https://portal.azure.com
[Azure Marketplace]: /marketplace/

> [!NOTE]
> If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](https://azure.microsoft.com/try/app-service/), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.
> 
> 

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)

