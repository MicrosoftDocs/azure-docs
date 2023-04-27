---
title: Configure alerts and work with metrics in Azure VMware Solution 
description: Learn how to use alerts to receive notifications. Also learn how to work with metrics to gain deeper insights into your Azure VMware Solution private cloud.
ms.topic: how-to
ms.custom: engagement-fy23
ms.service: azure-vmware
ms.date: 10/26/2022
---

# Configure Azure Alerts in Azure VMware Solution 

In this article, you'll learn how to configure [Azure Action Groups](../azure-monitor/alerts/action-groups.md) in [Microsoft Azure Alerts](../azure-monitor/alerts/alerts-overview.md) to receive notifications of triggered events that you define. You'll also learn about using [Azure Monitor Metrics](../azure-monitor/essentials/data-platform-metrics.md) to gain deeper insights into your Azure VMware Solution private cloud.

>[!NOTE]
>Incidents affecting the availability of an Azure VMware Solution host and its corresponding restoration are sent automatically to the Account Administrator, Service Administrator (Classic Permission), Co-Admins (Classic Permission), and Owners (RBAC Role) of the subscription(s) containing Azure VMware Solution private clouds.

## Supported metrics and activities

The following metrics are visible through Azure Monitor Metrics.

| **Signal name**                                                         | **Signal type** | **Monitor service** |
|-------------------------------------------------------------------------|-----------------|---------------------|
| Datastore Disk Total Capacity                                           | Metric          | Platform            |
| Percentage Datastore Disk Used                                          | Metric          | Platform            |
| Percentage CPU                                                          | Metric          | Platform            |
| Average Effective Memory                                                | Metric          | Platform            |
| Average Memory Overhead                                                 | Metric          | Platform            |
| Average Total Memory                                                    | Metric          | Platform            |
| Average Memory Usage                                                    | Metric          | Platform            |
| Datastore Disk Used                                                     | Metric          | Platform            |
| All Administrative operations                                           | Activity Log    | Administrative      |
| Register Microsoft.AVS resource provider. (Microsoft.AVS/privateClouds) | Activity Log    | Administrative      |
| Create or update a PrivateCloud. (Microsoft.AVS/privateClouds)          | Activity Log    | Administrative      |
| Delete a PrivateCloud. (Microsoft.AVS/privateClouds)                    | Activity Log    | Administrative      |

## Configure an alert rule
1. From your Azure VMware Solution private cloud, select **Monitoring** > **Alerts**, and then **New alert rule**.
 
   :::image type="content" source="media/configure-alerts-for-azure-vmware-solution/create-new-alert-rule.png" alt-text="Screenshot that shows where to configure an alert rule in your Azure VMware Solution private cloud." lightbox="media/configure-alerts-for-azure-vmware-solution/create-new-alert-rule.png":::

   A new configuration screen opens where you'll:
   - Define the Scope
   - Configure a Condition
   - Set up the Action Group
   - Define the Alert rule details
    
   :::image type="content" source="../devtest-labs/media/activity-logs/create-alert-rule-done.png" alt-text="Screenshot showing the Create alert rule window." lightbox="../devtest-labs/media/activity-logs/create-alert-rule-done.png":::

1. Under **Scope**, select the target resource you want to monitor. By default, the Azure VMware Solution private cloud from where you opened the Alerts menu has been defined.

1. Under **Condition**, select **Add condition**, and in the window that opens, selects the signal you want to create for the alert rule. 

   In our example, we've selected **Percentage Datastore Disk Used**, which is relevant from an [Azure VMware Solution SLA](https://azure.microsoft.com/support/legal/sla/azure-vmware/v1_1/) perspective. 

   :::image type="content" source="media/configure-alerts-for-azure-vmware-solution/configure-signal-logic-options.png" alt-text="Screenshot showing the Configure signal logic window with signals to create for the alert rule."::: 

1. Define the logic that will trigger the alert and then select **Done**. 

   In our example, only the **Threshold** and **Frequency of evaluation** have been adjusted. 
   
   :::image type="content" source="media/configure-alerts-for-azure-vmware-solution/define-alert-logic-threshold.png" alt-text="Screenshot showing the threshold, operator, aggregation type and granularity, threshold value, and frequency of evaluation for the signal alert logic."::: 

1. Under **Actions**, select **Add action groups**. The action group defines *how* the notification is received and *who* receives it.   You can receive notifications by email, SMS, [Azure Mobile App Push Notification](https://azure.microsoft.com/features/azure-portal/mobile-app/) or voice message.

1. Select an existing action group or select **Create action group** to create a new one.
 
1. In the window that opens, on the **Basics** tab, give the action group a name and a display name.

1. Select the **Notifications** tab, select a **Notification Type** and **Name**. Then select **OK**.

   Our example is based on email notification.

   :::image type="content" source="../azure-monitor/alerts/media/action-groups/action-group-2-notifications.png" alt-text="Screenshot showing email, SMS message, push, and voice settings for the alert." lightbox="../azure-monitor/alerts/media/action-groups/action-group-2-notifications.png":::    

1. (Optional) Configure the **Actions** if you want to take proactive actions and receive notification on the event. Select an available **Action type** and then select **Review + create**. 

   - **Automation Runbooks** - to automate tasks based on alerts

   - **Azure Functions** – for custom event-driven serverless code execution

   - **ITSM** – to integrate with a service provider like ServiceNow to create a ticket

   - **Logic App** - for more complex workflow orchestration

   - **Webhooks** - to trigger a process in another service


1. Under the **Alert rule details**, provide a name, description, resource group to store the alert rule, the severity. Then select **Create alert rule**.
   
   The alert rule is visible and can be managed from the Azure portal.

   :::image type="content" source="media/configure-alerts-for-azure-vmware-solution/existing-alert-rule.png" alt-text="Screenshot showing the new alert rule in the Rules window." lightbox="media/configure-alerts-for-azure-vmware-solution/existing-alert-rule.png":::      

   As soon as a metric reaches the threshold as defined in an alert rule, the **Alerts** menu is updated and made visible.

   :::image type="content" source="media/configure-alerts-for-azure-vmware-solution/threshold-alert.png" alt-text="Screenshot showing the alert after reaching the threshold defined in the alert rule." lightbox="media/configure-alerts-for-azure-vmware-solution/threshold-alert.png":::     

   Depending on the configured Action Group, you'll receive a notification through the configured medium. In our example, we've configured email.
    
   :::image type="content" source="media/configure-alerts-for-azure-vmware-solution/alert-notification.png" alt-text="Screenshot of an Azure Monitor Alert with the error string, and the date and time event was triggered."::: 

## Work with metrics

1. From your Azure VMware Solution private cloud, select **Monitoring** > **Metrics**. Then select the metric you want from the drop-down.
    
   :::image type="content" source="media/configure-alerts-for-azure-vmware-solution/monitoring-metrics.png" alt-text="Screenshot showing the Metrics window and a focus on the Metric drop-down." lightbox="media/configure-alerts-for-azure-vmware-solution/monitoring-metrics.png":::   

1. You can change the diagram's parameters, such as the **Time range** or the **Time granularity**. 

   Other options are:
   - **Drill into Logs** and query the data in the related Log Analytics workspace
   - **Pin this diagram** to an Azure Dashboard for convenience.

   :::image type="content" source="media/configure-alerts-for-azure-vmware-solution/monitoring-metrics-time-range-granularity.png" alt-text="Screenshot showing the time range and time granularity options for metric." lightbox="media/configure-alerts-for-azure-vmware-solution/monitoring-metrics-time-range-granularity.png":::  
 
 
## Next steps

Now that you've configured an alert rule for your Azure VMware Solution private cloud, you may want to learn even more about:
- [Azure Monitor Metrics](../azure-monitor/essentials/data-platform-metrics.md)
- [Azure Monitor Alerts](../azure-monitor/alerts/alerts-overview.md)
- [Azure Action Groups](../azure-monitor/alerts/action-groups.md)

You can also continue with one of the other [Azure VMware Solution](index.yml) how-to guides.
