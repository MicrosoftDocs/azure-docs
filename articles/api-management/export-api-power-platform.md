---
title: Export APIs from Azure API Management to the Power Platform  | Microsoft Docs
description: Learn how to export APIs from API Management to the Power Platform.
services: api-management
documentationcenter: ''
author: miaojiang
manager: gwallace
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 05/01/2020
ms.author: apimpm

---
# Export APIs from Azure API Management to the Power Platform 

Citizen developers using the Microsoft [Power Platform](https://powerplatform.microsoft.com) often needs to reach the business capabilities that are developed by professional developers and deployed in Azure. [Azure API Management](https://aka.ms/apimrocks) enables professional developers to publish their backend service as APIs, and easily export these APIs to the Power Platform (Power Apps and Power Automate) as custom connectors for consumption by citizen developers. 

This article walks through the steps to export APIs from API Management to the Power Platform. 

## Prerequisites

+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md)
+ Make sure there is an API in your API Management instance that you'd like to export to the Power Platform
+ Make sure you have a Power Apps or Power Automate [environment](https://docs.microsoft.com/powerapps/powerapps-overview#power-apps-for-admins) 

## Export an API

1. Navigate to your API Management service in the Azure portal and select **APIs** from the menu.
2. Click on the three dots next to the API you want to export. 
3. Select **Export**.
4. Select **Power Apps and Power Automate**.
5. Choose an environment to export the API to. 
6. Provide a display name, which will be used as the name of the custom connector.  
7. Optional, if the API is protected by an OAuth 2.0 server, you will also need to provide additional details including `Client ID`, `Client secret`, `Authorization URL`, `Token URL`, and `Refresh URL`.  
8. Select **Export**. 

Once the export completes, navigate to your Power App or Power Automate environment. You will see the API as a custom connector.

## Next steps

* [Learn more about the Power Platform](https://powerplatform.microsoft.com/)
* [Learn common tasks in API Management by following the tutorials](https://docs.microsoft.com/azure/api-management/import-and-publish)