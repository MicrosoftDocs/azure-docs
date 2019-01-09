---
title: Azure Government Developer Tools | Microsoft Docs
description: This provides a comparison of features and guidance on developing applications for Azure Government.
services: azure-government
cloud: gov
documentationcenter: ''
author: gsacavdm
manager: pathuff

ms.assetid: afef7a1b-7abb-4073-8b3f-b7f7a49e000f
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 6/13/2018
ms.author: gsacavdm

---
# Azure Government Integration Services
This article outlines the integration services variations and considerations for the Azure Government environment.

## Logic Apps
Logic Apps is generally available in Azure Government.
For more information, see [Logic Apps public documentation](../logic-apps/logic-apps-overview.md).

### Variations
* The Azure-based [Connectors](../connectors/apis-list.md) are scoped to connect to resources in Azure Government. If the Azure service isn't yet available in Azure Government, the connector for that service isn't available, for example:
    * Data Lake Store
    * Data Factory
    * Event Grid
    * Application Insights
    * Content Moderator

* For other missing connectors, request them via the [Azure Government feedback forum](https://feedback.azure.com/forums/558487-azure-government) and the [Logic Apps feedback forum](https://feedback.azure.com/forums/287593-logic-apps). If you need to use any missing connectors, you can call a logic app hosted in Azure Commercial that uses them.

* The creation experience for custom connectors via the portal isn't yet available. If you need to use the portal experience to create a custom connector, you can leverage the portal experience in Azure Commercial. Create the resource in Azure Commercial, download it as an Azure Resource Manager deployment template, and deploy it to Azure Government. You can download a custom connector by selecting the Download button on the Logic Apps Custom Connector overview blade. To deploy resources in a Resource Manager deployment template from the Azure portal, see the [resource group deployment documentation](../azure-resource-manager/resource-group-template-deploy-portal.md#deploy-resources-from-custom-template).

## Next steps
* Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/)
* Get help on Stack Overflow by using the [azure-gov](https://stackoverflow.com/questions/tagged/azure-gov)
* Give feedback or request new features via the [Azure Government feedback forum](https://feedback.azure.com/forums/558487-azure-government) 
