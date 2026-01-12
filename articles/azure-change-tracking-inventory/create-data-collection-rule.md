---
title: Create a Data Collection Rule for Azure Change Tracking and Inventory
description: Learn how to create a data collection rule (DCR) for Azure Change Tracking and Inventory.
#customer intent: As a customer, I want to create a data collection rule (DCR) for Azure Change Tracking and Inventory so that I can collect and manage data effectively.
services: automation
ms.date: 12/03/2025
ms.topic: how-to
ms.service: azure-change-tracking-inventory
ms.author: v-rochak2
author: RochakSingh-blr
ms.custom: sfi-image-nochange
---

# Create a data collection rule for Azure Change Tracking and Inventory

When you enable Change Tracking in the Azure portal by using the Azure Monitor Agent (AMA), the process automatically creates a data collection rule (DCR). This rule appears in the resource group with a name in the format `ct-dcr-aaaaaaaaa`. After the rule is created, add the required resources.

This article explains how to explicitly create a DCR for Azure Change Tracking and Inventory.

To enable Change Tracking and Inventory from the Azure portal, see [Quickstart: Enable Azure Change Tracking and Inventory](quickstart-monitor-changes-collect-inventory-azure-change-tracking-inventory.md).

  > [!NOTE]
  > You can associate only a single Change Tracking DCR with any resource. Any other Change Tracking DCRs are ignored.

## Create a DCR

A DCR defines what data to collect from sources, how to transform it, and where to send it (like Azure Monitor Logs).

To create a DCR, follow these steps:

1. Download the [CtDcrCreation.json](../automation/change-tracking/change-tracking-data-collection-rule-creation.md) file on your machine.
1. Sign in to the [Azure portal](https://portal.azure.com). In the search bar, enter **Deploy a custom template**.
1. On the **Custom deployment** pane, on the **Select a template** tab, select **Build your own template in the editor**.

   :::image type="content" source="media/create-data-collection-rule/build-template.png" alt-text="Screenshot that shows how to get started building a template.":::

1. Select **Save** to proceed to the next tab.
1. On the **Basics** tab, select **Edit template** > **Load file** to upload the `CtDcrCreation.json` file.
1. Select **Save**.
1. On the **Basics** tab, select the subscription and resource group where you want to deploy the DCR. The DCR name is optional.

   :::image type="content" source="media/create-data-collection-rule/build-template-basics.png" alt-text="Screenshot that shows entering subscription and resource group details to deploy the DCR.":::

    > [!NOTE]
    > - The resource group must be the same as the resource group associated with the Azure Monitor Logs workspace ID chosen here.
    > - The name of your DCR must be unique in that resource group. Otherwise, the deployment overwrites the existing DCR.
    > - The Azure Monitor Logs workspace resource ID specifies the Azure resource ID of the Azure Monitor Logs workspace used to store Change Tracking data.
    > - The location of the workspace must be from one of the [Change Tracking supported regions](../automation/how-to/region-mappings.md).
    
1. Select **Next : Review + create >**.
1. On the **Review + create** tab, select **Create** to initiate the deployment of `CtDcrCreation`.
1. After the deployment finishes, select **CtDcr-Deployment** to see the DCR name. Use the resource ID of the newly created DCR for Change Tracking and Inventory deployment through policy.

   :::image type="content" source="media/create-data-collection-rule/deployment-confirmation.png" alt-text="Screenshot that shows deployment notification.":::

After you create the DCR by using the AMA Change Tracking schema, ensure that you don't add any data sources to this rule. Adding data sources could cause Change Tracking and Inventory to fail. You must add only new resources in this section.
