---
title: Disaster Recovery for Integration Accounts
description: Set up cross-region disaster recovery for integration accounts and B2B artifacts in Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewers: estfan, azla
ms.topic: how-to
ms.update-cycle: 1095-days
ms.date: 03/13/2026
ms.custom: sfi-image-nochange
# Customer intent: As a B2B integration developer who works with Azure Logic Apps, I want to set up cross-region disaster recovery for my integration accounts and B2B artifacts.
---

# Set up cross-region disaster recovery for integration accounts in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

B2B workloads involve money transactions like orders and invoices. During a disaster event, it's critical for a business to quickly recover to meet the business-level SLAs agreed upon with their partners. This article describes how to build a business continuity plan for B2B workloads.

* Disaster recovery readiness
* Fail over to secondary region during a disaster event
* Fall back to primary region after a disaster event

## Disaster recovery readiness  

1. Identify a secondary region and create an [integration account](enterprise-integration/create-integration-account.md) in the secondary region.

1. Add partners, schemas, and agreements for the required message flows where the run status needs to be replicated to secondary region integration account.

   > [!TIP]
   >
   > Make sure there's consistency in the integration account artifact's naming convention across regions.

1. To pull the run status from the primary region, create a logic app and workflow in the secondary region.

   This logic app workflow must have a *trigger* and an *action*. The trigger should connect to primary region integration account. The action should connect to secondary region integration account.
   
   Based on the time interval, the trigger polls the primary region run status table and pulls the new records, if any. The action updates them to secondary region integration account. This helps to get incremental runtime status from primary region to secondary region.

   Business continuity in the integration account is designed to support based on B2B protocols - X12, AS2, and EDIFACT. To find the detailed steps, select the respective links in this article.

1. Deploy all primary region resources in a secondary region.

   Primary region resources include Azure SQL Database or Azure Cosmos DB, Azure Service Bus, and Azure Event Hubs used for messaging, Azure API Management, and the Azure Logic Apps feature in Azure App Service.

1. Set up a connection from a primary region to a secondary region. To pull the run status from a primary region, create a logic app and workflow in a secondary region.

   This logic app workflow must have a *trigger* and an *action*. The trigger should connect to primary region integration account. The action should connect to secondary region integration account.
   
   Based on the time interval, the trigger polls the primary region run status table and pulls the new records, if any. The action updates them to secondary region integration account. This helps to get incremental runtime status from primary region to secondary region.

Business continuity in an Azure Logic Apps integration account provides support based on the B2B protocols X12, AS2, and EDIFACT. For detailed steps on using X12 and AS2, see the following sections in this article:

- [X12](#x12)
- [EDIFACT](#edifact)
- [AS2](#as2)

## Fail over to a secondary region during a disaster event

During a disaster event, when the primary region isn't available for business continuity, direct the traffic to the secondary region. A secondary region helps a business recover functions quickly to meet the RPO/RTO agreed upon by their partners. This approach also minimizes efforts to fail over from one region to another region.

Latency is expected while copying control numbers from a primary region to a secondary region. To avoid sending duplicate generated control numbers to partners during a disaster event, increment the control numbers in the secondary region agreements by using [PowerShell cmdlets](/powershell/module/az.logicapp/set-azintegrationaccountgeneratedicn).

## Fall back to a primary region post-disaster event

To fall back to a primary region when it's available, follow these steps:

1. Stop accepting messages from partners in the secondary region.

1. Increment the generated control numbers for all the primary region agreements by using [PowerShell cmdlets](/powershell/module/az.logicapp/set-azintegrationaccountgeneratedicn).

1. Direct traffic from the secondary region to the primary region.

1. Check that the logic app created in the secondary region for pulling run status from the primary region is enabled.

## X12

Business continuity for EDI X12 documents is based on control numbers.

**Prerequisites**

- An X12 agreement between your trading partners

- To enable disaster recovery for inbound messages, in the X12 agreement's **Receive Settings**, select the following settings:

  - **Disallow Interchange control number duplicates**
  - **Disallow Group control number duplicates**
  - **Disallow Transaction set control number duplicates**

  :::image type="content" source="media/logic-apps-enterprise-integration-b2b-business-continuity/x12-duplicates.png" alt-text="Screenshot that shows X12 agreement with Receive Settings pane open and duplicates settings selected." lightbox="media/logic-apps-enterprise-integration-b2b-business-continuity/x12-duplicates.png":::

> [!TIP]
>
> You can also use the [X12 quickstart template](https://azure.microsoft.com/resources/templates/logic-app-b2b-disaster-recovery-replication/) to create logic apps. The template requires that you create primary and secondary integration accounts.
>
> The template creates two logic apps and workflows: one for received control numbers and another for generated control numbers. Respective triggers and actions are created in the logic app workflows, connecting the trigger to the primary integration account and the action to the secondary integration account.

1. Create an [example Consumption logic app workflow](quickstart-create-example-consumption-workflow.md) in a secondary region.

1. Follow the [general steps](add-trigger-action-workflow.md#add-trigger) to add the **X12** trigger named **When a control number is modified**.

   The trigger prompts you to create a connection to an integration account. Connect the trigger to your primary region integration account.

1. Enter a connection name, select your *primary region integration account* from the list, and choose **Create**.

   :::image type="content" source="media/logic-apps-enterprise-integration-b2b-business-continuity/x12cn2.png" alt-text="Screenshot that shows where to enter a connection name and primary region integration account for the X12 trigger named When a control number is modified." lightbox="media/logic-apps-enterprise-integration-b2b-business-continuity/x12cn2.png":::

1. Optionally, set the **DateTime to start control number sync** field. Set the **Frequency** field to **Day**, **Hour**, **Minute**, or **Second** along with an **Interval** value.

   :::image type="content" source="media/logic-apps-enterprise-integration-b2b-business-continuity/x12cn3.png" alt-text="Screenshot that shows the trigger information box with the DateTime to start control number sync, Frequency, and Interval fields for X12." lightbox="media/logic-apps-enterprise-integration-b2b-business-continuity/x12cn3.png":::

1. Follow the [general steps](add-trigger-action-workflow.md#add-action) to add an **X12** action named **Add or update control numbers**.

1. To connect an action to a secondary region integration account, select **Change connection** > **Add new connection** for a list of the available integration accounts. Enter a connection name, select your *secondary region integration account* from the list, and choose **Create**.

   :::image type="content" source="media/logic-apps-enterprise-integration-b2b-business-continuity/x12cn6.png" alt-text="Screenshot that shows where to add a secondary region integration account name." lightbox="media/logic-apps-enterprise-integration-b2b-business-continuity/x12cn6.png":::

1. Switch to raw inputs by selecting the icon in upper right corner.

   :::image type="content" source="media/logic-apps-enterprise-integration-b2b-business-continuity/x12rawinputs.png" alt-text="Screenshot that shows the selected icon for switching to raw inputs for X12." lightbox="media/logic-apps-enterprise-integration-b2b-business-continuity/x12rawinputs.png":::

1. From the dynamic content list, select **Body**, and then save your logic app.

   :::image type="content" source="media/logic-apps-enterprise-integration-b2b-business-continuity/x12cn7.png" alt-text="Screenshot that shows the dynamic content list from where you can select the Body field for X12." lightbox="media/logic-apps-enterprise-integration-b2b-business-continuity/x12cn7.png":::

   Based on the time interval, the trigger polls the primary region received control number table and pulls the new records. The action updates the records in the secondary region integration account. If there are no updates, the trigger status appears as **Skipped**.

   :::image type="content" source="media/logic-apps-enterprise-integration-b2b-business-continuity/x12recevicedcn8.png" alt-text="Screenshot that shows the control number table for X12." lightbox="media/logic-apps-enterprise-integration-b2b-business-continuity/x12recevicedcn8.png":::

Based on the time interval, the incremental runtime status replicates from a primary region to a secondary region. During a disaster event, when the primary region is not available, direct traffic to the secondary region for business continuity.

## EDIFACT

Business continuity for EDI EDIFACT documents is based on control numbers.

**Prerequisites**

- An EDIFACT agreement between your trading partners

- To enable disaster recovery for inbound messages, in the EDIFACT agreement's **Receive Settings**, select the following settings:

  - **Disallow Interchange control number duplicates**
  - **Disallow Group control number duplicates**
  - **Disallow Transaction set control number duplicates**

  :::image type="content" source="media/logic-apps-enterprise-integration-b2b-business-continuity/edifact-duplicates.png" alt-text="Screenshot that shows EDIFACT agreement with Receive Settings pane open and duplicates settings selected." lightbox="media/logic-apps-enterprise-integration-b2b-business-continuity/edifact-duplicates.png":::

1. Create an [example Consumption logic app workflow](../logic-apps/quickstart-create-example-consumption-workflow.md) in a secondary region.

1. Follow the [general steps](add-trigger-action-workflow.md#add-trigger) to add the **EDIFACT** trigger named **When a control number is modified**.

   The trigger prompts you to create a connection to an integration account. Connect the trigger to your primary region integration account.

1. Enter a connection name, select your *primary region integration account* from the list, and choose **Create**.

   :::image type="content" source="media/logic-apps-enterprise-integration-b2b-business-continuity/x12cn2.png" alt-text="Screenshot that shows where to enter a connection name and primary region integration account for the EDIFACT trigger named When a control number is modified." lightbox="media/logic-apps-enterprise-integration-b2b-business-continuity/x12cn2.png":::

1. Optionally, set the **DateTime to start control number sync** field. Set the **Frequency** field to **Day**, **Hour**, **Minute**, or **Second** along with an **Interval** value.

   :::image type="content" source="media/logic-apps-enterprise-integration-b2b-business-continuity/x12cn3.png" alt-text="Screenshot that shows the trigger information box with the DateTime to start control number sync, Frequency, and Interval fields for EDIFACT." lightbox="media/logic-apps-enterprise-integration-b2b-business-continuity/x12cn3.png":::

1. Follow the [general steps](add-trigger-action-workflow.md#add-action) to add an **EDIFACT** action named **Add or update control numbers**.

1. To connect an action to a secondary region integration account, select **Change connection** > **Add new connection** for a list of the available integration accounts. Enter a connection name, select your *secondary region integration account* from the list, and choose **Create**.

   :::image type="content" source="media/logic-apps-enterprise-integration-b2b-business-continuity/x12cn6.png" alt-text="Screenshot that shows where to create a secondary region integration account name." lightbox="media/logic-apps-enterprise-integration-b2b-business-continuity/x12cn6.png":::

1. Switch to raw inputs by selecting the icon in upper right corner.

   :::image type="content" source="media/logic-apps-enterprise-integration-b2b-business-continuity/Edifactrawinputs.png" alt-text="Screenshot that shows the selected icon for switching to raw inputs for EDIFACT." lightbox="media/logic-apps-enterprise-integration-b2b-business-continuity/Edifactrawinputs.png":::

1. From the dynamic content list, select **Body**, and then save your logic app.

   :::image type="content" source="media/logic-apps-enterprise-integration-b2b-business-continuity/X12CN7.png" alt-text="Screenshot that shows the dynamic content list from where you can select the Body field for X12." lightbox="media/logic-apps-enterprise-integration-b2b-business-continuity/X12CN7.png":::

   Based on the time interval, the trigger polls the primary region received control number table and pulls the new records. The action updates the records to the secondary region integration account. If there are no updates, the trigger status appears as **Skipped**.

   :::image type="content" source="media/logic-apps-enterprise-integration-b2b-business-continuity/x12recevicedcn8.png" alt-text="Screenshot that shows the control number table for X12." lightbox="media/logic-apps-enterprise-integration-b2b-business-continuity/x12recevicedcn8.png":::

Based on the time interval, the incremental runtime status replicates from a primary region to a secondary region. During a disaster event, when the primary region is not available, direct traffic to the secondary region for business continuity.

## AS2

Business continuity for documents that use the AS2 protocol is based on the message ID and the MIC value.

> [!TIP]
>
> You can also use the [AS2 quickstart template](https://github.com/Azure/azure-quickstart-templates/pull/3302) to create logic apps. The template requires that you create primary and secondary integration accounts. The template creates a logic app workflow that has a trigger and an action. The logic app workflow creates a connection from a trigger to a primary integration account and an action to a secondary integration account.

1. Create an [example Consumption logic app workflow](quickstart-create-example-consumption-workflow.md) in the secondary region.

1. Follow the [general steps](add-trigger-action-workflow.md#add-trigger) to add the **AS2** trigger named **When a MIC value is created**.

   The trigger prompts you to create a connection to an integration account. Connect the trigger to your primary region integration account.
   
1. Enter a connection name, select your *primary region integration account* from the list, and choose **Create**.

   :::image type="content" source="media/logic-apps-enterprise-integration-b2b-business-continuity/as2messageid2.png" alt-text="Screenshot that shows where to enter a connection name for the AS2 trigger named When a MIC value is created." lightbox="media/logic-apps-enterprise-integration-b2b-business-continuity/as2messageid2.png":::

1. Optionally, set the **DateTime to start MIC value sync** field. Set the **Frequency** field to **Day**, **Hour**, **Minute**, or **Second** along with an **Interval** value.

   :::image type="content" source="media/logic-apps-enterprise-integration-b2b-business-continuity/as2messageid3.png" alt-text="Screenshot that shows the trigger information box with the DateTime to start MIC value sync, Frequency, and Interval fields for AS2." lightbox="media/logic-apps-enterprise-integration-b2b-business-continuity/as2messageid3.png":::

1. Follow the [general steps](add-trigger-action-workflow.md#add-action) to add an **AS2** action named **Add or update MIC contents**.

1. To connect an action to a secondary integration account, select **Change connection** > **Add new connection** for a list of the available integration accounts. Enter a connection name, select your *secondary region integration account* from the list, and choose **Create**.

   :::image type="content" source="media/logic-apps-enterprise-integration-b2b-business-continuity/as2messageid6.png" alt-text="Screenshot that shows the Add or update MIC contents window with available integration accounts and a connection name field." lightbox="media/logic-apps-enterprise-integration-b2b-business-continuity/as2messageid6.png":::

1. Switch to raw inputs by selecting the icon in upper right corner.

   :::image type="content" source="media/logic-apps-enterprise-integration-b2b-business-continuity/as2rawinputs.png" alt-text="Screenshot that shows the selected icon for switching to raw inputs for AS2." lightbox="media/logic-apps-enterprise-integration-b2b-business-continuity/as2rawinputs.png":::

1. From the dynamic content list, select **Body**, and then save your logic app.

   :::image type="content" source="media/logic-apps-enterprise-integration-b2b-business-continuity/as2messageid7.png" alt-text="Screenshot that shows the dynamic content list from where you can select the Body field for AS2." lightbox="media/logic-apps-enterprise-integration-b2b-business-continuity/as2messageid7.png":::

   Based on the time interval, the trigger polls the primary region table and pulls the new records. The action updates them to the secondary region integration account.

   If there are no updates, the trigger status appears as **Skipped**.

   :::image type="content" source="media/logic-apps-enterprise-integration-b2b-business-continuity/as2messageid8.png" alt-text="Screenshot that shows the trigger status list." lightbox="media/logic-apps-enterprise-integration-b2b-business-continuity/as2messageid8.png":::

Based on the time interval, the incremental runtime status replicates from the primary region to the secondary region. During a disaster event, when the primary region is not available, direct traffic to the secondary region for business continuity.

## Related content

[Monitor B2B messages with Azure Monitor logs](monitor-b2b-messages-log-analytics.md)
