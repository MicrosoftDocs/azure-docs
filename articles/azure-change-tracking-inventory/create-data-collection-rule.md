---
title: Create Data Collection Rule for Azure Change Tracking and Inventory
description: Learn how to create a data collection rule (DCR) for Azure Change Tracking and Inventory.
#customer intent: As a customer, I want to create a Data Collection Rule (DCR) for Azure Change Tracking and Inventory so that I can collect and manage data effectively.
services: automation
ms.date: 12/03/2025
ms.topic: how-to
ms.service: azure-change-tracking-inventory
ms.author: v-rochak2
author: RochakSingh-blr
ms.custom: sfi-image-nochange
---

# Create data collection rule for Azure Change Tracking and Inventory

When you enable Change Tracking in the Azure portal using the Azure Monitor Agent (AMA), the process automatically creates a Data Collection Rule (DCR). This rule will appear in the resource group with a name in the format ct-dcr-aaaaaaaaa. After the rule is created, add the required resources.

This article explains how to explicitly create a Data Collection Rule for Azure Change Tracking and Inventory (CTI).

To enable Azure CTI from the Azure portal, see [Quickstart: Enable Azure Change Tracking and Inventory](quickstart-monitor-changes-collect-inventory-azure-change-tracking-inventory.md).

  >[!NOTE]
  >Only a single change tracking DCR can be associated with any resource. Any additional change tracking DCRs will be ignored.

## Create DCR

A DCR defines what data to collect from sources, how to transform it, and where to send it (like Log Analytics).

To create a DCR, follow these steps: 

1. Download [CtDcrCreation.json](../automation/change-tracking/change-tracking-data-collection-rule-creation.md) file on your machine.
1. Sign in to the [Azure portal](https://portal.azure.com) and in the search bar, enter *Deploy a custom template*.
1. On the **Custom deployment** pane > **select a template** tab > select **Build your own template in the editor**.
   :::image type="content" source="media/create-data-collection-rule/build-template.png" alt-text="Screenshot to get started with building a template.":::
1. Select **Save** to proceed to the next tab.
1. On the **Basics** tab > select **Edit template**, select **Load file** to upload the *CtDcrCreation.json* file.
1. Select **Save**.
1. On the **Basics** tab, provide **Subscription** and **Resource group** where you want to deploy the Data Collection Rule. The **Data Collection Rule Name** is optional.

   :::image type="content" source="media/create-data-collection-rule/build-template-basics.png" alt-text="Screenshot to provide subscription and resource group details to deploy data collection rule.":::
   
   >[!NOTE]
   >- The resource group must be same as the resource group associated with the Log Analytic workspace ID chosen here.
   >- Ensure that the name of your Data Collection Rule is unique in that resource group, else the deployment will overwrite the existing Data Collection Rule.
   >- The Log Analytics Workspace Resource ID specifies the Azure resource ID of the Log Analytics workspace used to store change tracking data. Ensure that location of workspace is from the [Change tracking supported regions](../automation/how-to/region-mappings.md)

1. Select **Next : Review + create >**.
1. On the **Review + create** tab > Select **Create** to initiate the deployment of *CtDcrCreation*.
1. After the deployment is complete, select **CtDcr-Deployment** to see the DCR Name. Use the **Resource ID** of the newly created Data Collection Rule for Azure CTI deployment through policy.
 
   :::image type="content" source="media/create-data-collection-rule/deployment-confirmation.png" alt-text="Screenshot of deployment notification.":::

> [!NOTE]
> After creating the Data Collection Rule using the Azure Monitor Agent's change tracking schema, ensure that you don't add any Data Sources to this rule. This can cause Azure CTI to fail. You must only add new Resources in this section.

## Next steps

- For detailed information on how to create the DCR, see [Create DCR](../azure-change-tracking-inventory/create-data-collection-rule.md).
- To know how to migrate from Change Tracking and inventory using Log Analytics to AMA, see [Migration guidance for Azure CTI](../automation/troubleshoot/change-tracking.md).
