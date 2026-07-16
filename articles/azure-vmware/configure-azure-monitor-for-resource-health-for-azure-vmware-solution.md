---
title: Create an Azure Monitor resource health alert rule for Azure VMware Solution
description: Learn about configuring Azure Monitor alerts for Resource Health for your Azure VMware Solution private cloud.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 08/05/2025
---

# Create an Azure Monitor resource health alert rule for Azure VMware Solution


This article shows you how to create or edit a resource health alert rule in Azure Monitor for your Azure VMware Solution private cloud. To learn more about alerts, see the [alerts overview](/azure/azure-monitor/alerts/alerts-overview).

Alerts triggered by these alert rules contain a payload that uses the [common alert schema](/azure/azure-monitor/alerts/alerts-common-schema).

## Prerequisites

To create or edit a Resource Health alert rule, you need:

- An Azure subscription with an AVS private cloud deployed
- Contributor (write) access to that subscription
- Read permission on any action groups you intend to use

## Create Resource Health alert rule

### Access Resource Health blade

1. In the Azure portal, navigate to your AVS private cloud resource.  
1. From the left menu, select **Help** → **Resource Health**.
   :::image type="content" source="media/resource-health/resource-health-left-nav.png" alt-text="Screenshot showing where to find Resource Health for the AVS private cloud." lightbox="media/resource-health/resource-health-left-nav.png":::

1. Click **Add resource health alert**.
   :::image type="content" source="media/resource-health/resource-health-create-alert.png" alt-text="Screenshot showing add resource health alert button." lightbox="media/resource-health/resource-health-create-alert.png":::

### Define the alert condition

* On the **Conditions** pane, select values for each of these fields:

    | Field                        | Description                                                                                                              |
    |------------------------------|--------------------------------------------------------------------------------------------------------------------------|
    | **Event status**             | Select **Updated** as the event status                                                                                   |
    | **Current resource status**  | Select the current resource status. Values are **Available**, **Degraded**, and **Unavailable**.                         |
    | **Previous resource status** | (Optional) Select the previous resource status. Values are **Available**, **Degraded**, **Unavailable**, and **Unknown**.|
    | **Reason type**              | Select the causes of the resource health events. Values are **Platform Initiated**, **Unknown**, and **User Initiated**. |

    :::image type="content" source="media/resource-health/resource-health-condition.png" alt-text="Screenshot showing condition tabs while creating alerts using Resource Health for the AVS private cloud." lightbox="media/resource-health/resource-health-condition.png":::

### Configure actions

1. Switch to the **Actions** tab and choose **Use action groups**.  
1. Pick an existing action group or click **Create action group** to:
   - Specify the subscription and resource group  
   - For **Region**, choose **Global**. Resource Health alerts can only be located in the Global region (which is the default).

   - Provide an **Action group name** and **Display name**  

   :::image type="content" source="media/resource-health/resource-health-new-action-group.png" alt-text="Screenshot showing new action group creation wizard with basics tab." lightbox="media/resource-health/resource-health-new-action-group.png":::

   - Under **Notification type**, select channels (Email, SMS, Push, Voice) and add stakeholder contacts
   :::image type="content" source="media/resource-health/resource-health-action-group-notifications.png" alt-text="Screenshot showing new action group creation wizard with notifications tab." lightbox="media/resource-health/resource-health-action-group-notifications.png":::

   - Under **Review + create**, review the details and click on **Create**

### Review and create

1. On the **Details** tab, fill in:
   - **Alert rule name**
   - Subscription and resource group for the rule
   - Ensure **Enable alert rule upon creation** is checked

   :::image type="content" source="media/resource-health/resource-health-action-group-details.png" alt-text="Screenshot showing new action group creation wizard with details tab." lightbox="media/resource-health/resource-health-action-group-details.png":::

1. Click **Review + create**, then **Create**.

   :::image type="content" source="media/resource-health/resource-health-alert-review-create.png" alt-text="Screenshot showing new alert rule creation wizard with review-create tab." lightbox="media/resource-health/resource-health-alert-review-create.png":::

## Manage alert rules

- **View triggered alerts**: search for your alert rule name and select the **History** tab. You can click on any of the triggered alerts to know about it.

   :::image type="content" source="media/resource-health/alert-rule-history.png" alt-text="Screenshot showing an alert rule history." lightbox="media/resource-health/alert-rule-history.png":::

- **Edit an existing rule**: open its **Overview** page and click **Edit**.

## Next steps

- [Manage your alerts](/azure/azure-monitor/alerts/alerts-manage-alert-instances)
- Learn more about the [ITSM Connector](/azure/azure-monitor/alerts/itsmc-overview)


