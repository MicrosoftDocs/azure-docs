---
title: Connector upgrade guidance
description: This article describes the guidance for upgrading connectors of Azure Data Factory.
author: jianleishen
ms.author: jianleishen
ms.service: azure-data-factory
ms.subservice: data-movement
ms.topic: concept-article
ms.custom:
  - references_regions
  - build-2025
ms.date: 06/06/2025
---

# Connector upgrade guidance

This article provides guidance for upgrading connectors in Azure Data Factory.  

## How to receive notifications in Azure Service Health portal

Regular notifications are sent to you to help you upgrade related connectors or notify you the key dates for EOS and removal. You can find the notification under Service Health portal - Health advisories tab.

Here's the steps to help you find the notification: 

1. Navigate to [Service Health portal](https://portal.azure.com/#view/Microsoft_Azure_Health/AzureHealthBrowseBlade/%7E/serviceIssues) or you can select **Service Health** icon on your Azure portal dashboard.
1. Go to **Health advisories** tab and you can see the notification related to your connectors in the list. You can also go to **Health history** tab to check historical notifications.

    :::image type="content" source="media/connector-lifecycle/service-health-health-advisories.png" alt-text="Screenshot of service health.":::

To learn more about the Service Health portal, see this [article](/azure/service-health/service-health-overview).


## How to find your impacted objects from data factory portal

Here's the steps to get your objects which still rely on the deprecated connectors or connectors that have a precise end of support date. It is recommended to take action to upgrade those objects to the new connector version before the end of the support date.

1.	Open your Azure Data Factory.
2.	Go to Manage – Linked services page.
3.	You should see the Linked Service that is still on V1 with an alert behind it.
4.	Click on the number under the 'Related' column will show you the related objects that utilize this Linked service.
5.	To learn more about the upgrade guidance and the comparison between V1 and V2, you can navigate to the connector upgrade section within each connector page.


:::image type="content" source="media/connector-lifecycle/linked-services-page.png" alt-text="Screenshot of the linked services page." lightbox="media/connector-lifecycle/linked-services-page.png":::

## How to find your impacted objects programmatically 

Users can run a PowerShell script to programmatically extract a list of Azure Data Factory or Synapse linked services that are using integration runtimes running on versions that are either out of support or nearing end-of-support. The script can be customized to query each data factory under a specified subscription, enumerate a list of specified linked services, and inspect configuration properties such as connection types, connector versions. It can then cross-reference these details against known version EOS timelines, flagging any linked services using unsupported or soon-to-be unsupported connector versions. This automated approach enables users to proactively identify and remediate outdated components to ensure continued support, security compliance, and service availability. 

You can find an example of the script [here](https://github.com/Azure/Azure-DataFactory/blob/main/Connector/FindImpactedObjects.ps1) and customize it as needed. 

## Related content

- [Connector overview](connector-overview.md)  
- [Connector lifecycle overview](connector-lifecycle-overview.md) 
- [Connector upgrade advisor](connector-upgrade-advisor.md)  
- [Connector release stages and timelines](connector-release-stages-and-timelines.md)  
- [Connector upgrade FAQ](connector-deprecation-frequently-asked-questions.md)
