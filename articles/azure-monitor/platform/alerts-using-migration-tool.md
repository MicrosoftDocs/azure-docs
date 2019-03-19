---
title: "How to use the migration tool to migrate your classic alerts"
description: Learn how to use voluntary migration tool.
author: snehithm
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 03/19/2018
ms.author: snmuvva
ms.subservice: alerts
---
# Why use the voluntary migration tool

As announced last year, classic alerts in Azure Monitor are being retired in July 2019. Any existing classic alert rules will get automatically migrated starting July 2019.

The migration tool to trigger migration voluntarily is available in Azure portal and is rolling out to customers who use classic alert rules. This article will walk you through on how to use the migration tool to voluntarily migrate your classic alert rules before the automatic migration starts in July 2019.

## Benefits of moving to new alerts

Classic alerts are being replaced by new unified alerting in Azure Monitor. The new alerts platform has the following benefits:

- Alert on a variety of multi-dimensional metrics for many more Azure services
- New metric alerts support multi-resource alert rules which greatly reduce the overhead of managing many rules.
- Take advantage of action groups
    - the modular notification mechanism that allows for same actions to be reused with many alerts.
    - use new notification mechanisms like SMS, voice and ITSM Connector
- The unified alert consumption experience brings all the alerts on different signals (metric, activity log and log) into one place

## Why migrate using the voluntary migration tool

While you can wait for automatic migration in July 2019, using the voluntary migration tool allows you the following benefits

- If you are already using new alerts, get to unification faster
- You are in control of when to trigger the migration


## Things you should know before you start the migration

As part of the migration, classic alert rules are converted to equivalent new alert rules and action groups are created. 

The payload format of new alert rules is different from that of the classic alert rules as they support more features.

The APIs to create and manage alert rules are different between classic alert rules and new alert rules.

## How to migrate your classic alert rules using the migration tool

The following procedure describes how to trigger the migration of your classic alert rules in Azure portal:

1. In [Azure portal](https://portal.azure.com), click on **Monitor**. 

2. Click **Alerts** then click **+ New alert rule**.

    > [!TIP]
    > Most resource blades also have **Alerts** in their resource menu under **Monitoring**, you could create alerts from there as well.

3. Click **Select target**, in the context pane that loads, select a target resource that you want to alert on. Use **Subscription** and **Resource type** drop-downs to find the resource you want to monitor. You can also use the search bar to find your resource.

4. If the selected resource has metrics you can create alerts on, **Available signals** on the bottom right will include metrics. You can view the full list of resource types supported for metric alerts in this [article](../../azure-monitor/platform/alerts-metric-near-real-time.md#metrics-and-dimensions-supported).

5. Once you have selected a target resource, click on **Add condition**.

6. You will see a list of signals supported for the resource, select the metric you want to create an alert on.

7. Optionally, refine the metric by adjusting **Period** and **Aggregation**. If the metric has dimensions, you will see **Dimensions** table presented. Select one or more values per dimension. The metric alert will run evaluate the condition for all combinations of values selected. [Learn more about how alerting on multi-dimensional metrics works](alerts-metric-overview.md). You can also **Select \*** for any of the dimensions. **Select \*** will dynamically scale the selection to all current and future values for a dimension.

8. You will see a chart for the metric for the last 6 hours. Define the alert parameters; **Condition Type**, **Frequency**, **Operator** and **Threshold** or **Sensitivity**, this will determine the logic which the metric alert rule will evaluate. [Learn more about Dynamic Thresholds condition type and sensitivity options](alerts-dynamic-thresholds.md).

9. If you are using a static threshold, the metric chart can help determine what might be a reasonable threshold. If you are using a Dynamic Thresholds, the metric chart will display the calculated thresholds based on recent data.

10. Click **Done**

11. Optionally, add another criteria if you want to monitor a complex alert rule. Currently users can have alert rules with Dynamic Thresholds criteria as a single criterion.

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

5. In the Edit Rule, click on the **Alert criteria** you want to edit. You can change the metric, threshold condition and other fields as required

    > [!NOTE]
    > You can't edit the **Target resource** and **Alert Rule Name** after the metric alert is created.

6. Click **Done** to save your edits.

## With Azure CLI

The previous sections described how to create, view and manage metric alert rules using Azure portal. This section will describe how to do the same using cross-platform [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli?view=azure-cli-latest). Quickest way to start using Azure CLI is through [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview?view=azure-cli-latest). For this article, we will use Cloud shell.

1. Go to Azure portal, click on **Cloud shell**.

2. At the prompt, you can use commands with ``--help`` option to learn more about the command and how to use it. For example, the following command shows you the list of commands available for creating, viewing and managing metric alerts

    ```azurecli
    az monitor metrics alert --help
    ```

3. You can create a simple metric alert rule that monitors if average Percentage CPU on a VM is greater than 90

    ```azurecli
    az monitor metrics alert create -n {nameofthealert} -g {ResourceGroup} --scopes {VirtualMachineResourceID} --condition "avg Percentage CPU > 90" --description {descriptionofthealert}
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
    az monitor metrics alert update -g {ResourceGroup} -n {AlertRuleName} --enabled false
    ```

7. You can delete a metric alert rule using the following command.

    ```azurecli
    az monitor metrics alert delete -g {ResourceGroup} -n {AlertRuleName}
    ```

## Next steps

- [Create metric alerts using Azure Resource Manager Templates](../../azure-monitor/platform/alerts-enable-template.md).
- [Understand how metric alerts work](alerts-metric-overview.md).
- [Understand how metric alerts with Dynamic Thresholds condition work](alerts-dynamic-thresholds.md).
- [Understand the web hook schema for metric alerts](../../azure-monitor/platform/alerts-metric-near-real-time.md#payload-schema)

