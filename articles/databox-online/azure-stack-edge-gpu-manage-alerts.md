---
title: Manage alerts for your Azure Stack Edge Pro device | Microsoft Docs 
description: Describes how to use the Azure portal to manage alerts for your Azure Stack Edge Pro device.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 01/27/2021
ms.author: alkohli
---
# Manage alerts in Azure Stack Edge Pro

This article describes how to manage alerts for Azure Stack Edge Pro in the Azure portal. You can define action rules that determine how to trigger alerts for a resource group, subscription, or individual resource.

In this article, you learn how to:

> [!div class="checklist"]
>
> * Create action rules
> * View alerts

## Create action rules

Configure action rules to trigger or suppress alerts for events that occur within a resource group, an Azure subscription, or an individual Azure Stack Edge resource. TK: Action groups.

TK: Configure alerts example, suppress alerts example.

NOTE NEEDED? Link to info about configuring notifications for individual alerts (the old way?). <!--Current target: [Create, view, and manage metric alerts using Azure Monitor Link target](/../azure-monitor/platform/alerts-metric.md)-->

## Create alerts with action rules

Take the following steps in the Azure Portal to configure alerts for a resource group, subscription, or resource.

1. Open your Azure Stack Edge Device in the Azure portal.

2. Go to **Monitor > Alerts**, and select **Manage actions**.

   ![Monitoring Alerts, Manage actions option](media/azure-stack-edge-gpu-manage-alerts/manage-actions-open-view.png)

3. In **Manage actions**, select **Action rules (preview)**.

   ![Manage actions, Action rules option](media/azure-stack-edge-gpu-manage-alerts/actions-rules-display-rules.png)

4. On the **Action rules (preview)** screen, select **+ New action rule**.

   ![Manage actions, New Action option](media/azure-stack-edge-gpu-manage-alerts/action-rules-select-new.png)

5. Use **Scope** to select specific resources, resource groups, or a subscription as the scope. The action rule will act on all alerts generated within the selected scope.

   1. To get started, choose **Select** by **Scope**.

      ![Select a scope for a new action rule](media/azure-stack-edge-gpu-manage-alerts/action-rules-select-scope.png)

      You will select individual resources, resource groups, or a subscription from the **Resource** list.

      At first, the **Resource** list shows the subscription for this device. Selecting the subscription will apply the action rule to all resources associated with the subscription

      <!--Would this be limited to Azure Stack Edge resources or include all Azure resources associated with the subscription? Resource groups are assigned indirectly to a subscription: storage accounts are added to the subscription, and resource groups are defined for the storage account? Hierarchy seems wrong.-->

      ![Action rule scoped to the current subscription](media/azure-stack-edge-gpu-manage-alerts/action-rules-scope-to-subscription.png)

   1. If you want to set the scope to a different set of resources you can:
      - Use **Filter by subscription** to select a different subscription.
      - Use **Filter by resource type** to select all resource types or one resource type for the subscription.

      ![Options for filtering by resource type](media/azure-stack-edge-gpu-manage-alerts/action-rules-filter-by-resource-type.png)

      The **Resource** list now shows the filtered resource list. The resources are listed hierarchically with 

   1. Select the check box by each resource type you want to apply the rule to. You can select the subscription, one or more resource groups, or individual resources.

<!--Many questions about selecting resources:
- I can select resource groups but not individual resources within a resource group.
- When I select a resource group, I would expect for all resources within the resource group to be selected automatically. There's no indication that the resources are selected.
- I can't seem to select individual resources under a resource group. Can't select sets such as storage accounts either.
- Storage accounts are listed under resource groups. Isn't it the other way around?-->

      **Selection preview** at the bottom of the pane tracks the total selected resource types.

      ![Select resources to apply the rule to](media/azure-stack-edge-gpu-manage-alerts/action-rules-select-resources.png)

   1. When you finish selecting resources, select **Done** to save the scope.

      ![Select Done to save the scope](media/azure-stack-edge-gpu-manage-alerts/action-rules-scope-done.png)

   The **Create action rule** screen shows the selected scope.

6. Use the **Filter** option to add filters that narrow the application of the rule to subset of alerts within the selected scope.

  1. Select **Add**.

     ![Select Add to add a filter](media/azure-stack-edge-gpu-manage-alerts/action-rules-add-filter.png)

   1. In **Filters**, select the type of filter to apply. You can filter by AVAILABLE FILTERS or filter by text in the Description or payload for the alert. 

      ![Select the filter type](media/azure-stack-edge-gpu-manage-alerts/action-rules-add-filter-select-filter-type.png)

   1. Select an **Operator** and then a **Value** to define the filter. For example, for a *Severity** filter, you might select **Equals** and **Sev 1** to apply the action rulte to all Severity 1 alerts.
   1. When you finish, select **Done**.  

      ![A filter for an action rule](media/azure-stack-edge-gpu-manage-alerts/action-rules-add-filter-completed-filter.png)

STOPPED HERE.


## Suppress alerts with action rules

Take the following steps in the Azure portal to suppress alerts for a resource group, subscription, or resource.


## View alerts

Take the following steps in the Azure portal to view and manage individual alerts.

1. Open your Azure Stack Edge device in the Azure portal.
2. Go to **Monitor > Alerts**.

## Next steps

Learn how to [Monitor your Azure Stack Edge Pro](azure-stack-edge-monitor.md).
Learn how to [Monitor Kubernetes workloads via the Kubernetes Dashboard](azure-stack-edge-gpu-monitor-kubernetes-dashboard.md)
