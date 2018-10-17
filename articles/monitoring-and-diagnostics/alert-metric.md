---
title: "Create, view and manage Metric Alerts Using Azure Monitor"
description: Learn how to use Azure portal or CLI to create, view and manage metric alert rules.
author: snehithm
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 09/18/2018
ms.author: snmuvva
ms.component: alerts
---
# Create, view, and manage metric alerts using Azure Monitor

Metric alerts in Azure Monitor provide a way to get notified when one of your metrics cross a threshold. Metric alerts work on a range of multi-dimensional platform metrics, custom metrics, Application Insights standard and custom metrics. In this article, we will describe how to create, view and manage metric alert rules through Azure portal and Azure CLI. You can also create metric alert rules using Azure Resource Manager templates which is described in [a separate article](monitoring-enable-alerts-using-template.md).

You can learn more about how metric alerts work from [metric alerts overview](alert-metric-overview.md).

## Create with Azure portal

The following procedure describes how to create a metric alert rule in Azure portal:

1. In [Azure portal](https://portal.azure.com), click on **Monitor**. The Monitor blade consolidates all your monitoring settings and data in one view.

2. Click **Alerts** then click **+ New alert rule**.

    > [!TIP]
    > Most resource blades also have **Alerts** in their resource menu under **Monitoring**, you could create alerts from there as well.

3. Click **Select target**, in the context pane that loads, select a target resource that you want to modify. Use **Subscription** and **Resource type** drop-downs to find the resource you want to monitor. You can also use the search bar to find your resource.

4. If the selected resource has metrics you can create alerts on, **Available signals** on the bottom right will include metrics. You can view the full list of resource types supported for metric alerts in this [article](monitoring-near-real-time-metric-alerts.md#metrics-and-dimensions-supported)

5. Once you have selected a target resource, click on **Add criteria**

6. You will see a list of signals supported for the resource, select the metric you want to create an alert on.

7. You will see a chart for the metric for the last 6 hours. Define the **Period**, **Frequency**, **Operator** and **Threshold**, this will determine the logic which the metric alert rule will evaluate.

8. Using the metric chart you can determine what might be a reasonable threshold.

9. Optionally, if the metric has dimensions, you will see Dimensions table presented. Select one or more values per dimension. The metric alert will run evaluate the condition for all combinations of values selected. [Learn more about how alerting on multi-dimensional metrics works](alert-metric-overview.md). You can also **Select \*** for any of the dimensions. **Select \*** will dynamically scale the selection to all current and future values for a dimension.

10. Click **Done**

11. Optionally, add another criteria if you want to monitor a complex alert rule

12. Fill in **Alert details** like **Alert Rule Name**, **Description** and **Severity**

13. Add an action group to the alert either by selecting an existing action group or creating a new action group.

14. Click **Done** to save the metric alert rule.

> [!NOTE]
> Metric alert rules created through portal are created in the same resource group as the target resource.

## View and manage with Azure portal

You can view and manage metric alert rules using the Manage Rules blade under Alerts. The procedure below shows you how to view your metric alert rules and edit one of them.

1. In Azure portal, navigate to **Monitor**

2. Click on **Alerts** and **Manage rules**

3. In the **Manage rules** blade, you can view all your alert rules across subscriptions. You can further filter the rules using  **Resource group**,  **Resource type** and **Resource**. If you want to see only metric alerts, select **Signal type** as Metrics.

    > [!TIP]
    > In the **Manage rules** blade, you can select multiple alert rules and enable/disable them. This might be useful when certain target resources need to be put under maintenance

4. Click on the name of the metric alert rule you want to edit

5. In the Edit Rule, click on the **Alert criteria** you want to edit. You can change the metric, threshold and other fields as required

    > [!NOTE]
    > You can't edit the **Target resource** and **Alert Rule Name** after the metric alert is created.

6. Click **Done** to save your edits.

## With Azure CLI

The previous sections described how to create, view and manage metric alert rules using Azure portal. This section will describe how to do the same using cross-platform [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/get-started-with-azure-cli?view=azure-cli-latest). Quickest way to start using Azure CLI is through [Azure Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview?view=azure-cli-latest). For this article, we will use Cloud shell.

1. Go to Azure portal, click on **Cloud shell**.

2. At the prompt, you can use commands with ``--help`` option to learn more about the command and how to use it. For example, the following command shows you the list of commands available for creating, viewing and managing metric alerts

    ```azurecli
    az monitor metrics alert --help
    ```

3. You can create a simple metric alert rule that monitors if average Percentage CPU on a VM is greater than 70

    ```azurecli
    az monitor metrics alert create -n {nameofthealert} -g {ResourceGroup} --scopes {VirtualMachineResourceID} --condition "avg Percentage CPU > 90"
    ```

4. You can view all the metric alerts in a resource group using the following command

    ```azurecli
    az monitor metrics alert list  -g {ResourceGroup}
    ```

5. You can see the details of a particular metric alert rule using the name or the resource ID of the rule.

    ```azurecli
    az monitor metrics alert show -g {ResourceGroup} -n {AlertRuleName}
    ```

    ```azurecli
    az monitor metrics alert show --ids {RuleResourceId}
    ```

6. You can disable a metric alert rule using the following command.

    ```azurecli
    az monitor metrics alert update -g {ResourceGroup} -n {AlertRuleName} -enabled false
    ```

7. You can delete a metric alert rule using the following command.

    ```azurecli
    az monitor metrics alert update -g {ResourceGroup} -n {AlertRuleName} -enabled false
    ```

## Next steps

- [Create metric alerts using Azure Resource Manager Templates](monitoring-enable-alerts-using-template.md).
- [Understand how metric alerts work](alert-metric-overview.md).
- [Understand the web hook schema for metric alerts](monitoring-near-real-time-metric-alerts.md#payload-schema)
