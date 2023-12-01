---
title: How Azure Resource Graph uses alerts to monitor resources
description: In this quickstart, you learn how to create monitoring alerts for Azure resources using an Azure Resource Graph query and a Log Analytics workspace.
ms.date: 10/31/2023
ms.topic: quickstart
---

# Quickstart: Create alerts with Azure Resource Graph and Log Analytics

In this quickstart, you learn how you can use Azure Log Analytics to create alerts on Azure Resource Graph queries. You can create alerts with Azure Resource Graph query, Log Analytics workspace, and managed identities. The alert's conditions send notifications at a specified interval.

You can use queries to set up alerts for your deployed Azure resources. You can create queries using Azure Resource Graph tables, or you can combine Azure Resource Graph tables and Log Analytics data from Azure Monitor Logs.

This article includes two examples of alerts:

- **Azure Resource Graph**: Uses the Azure Resource Graph `Resources` table to create a query that gets data for your deployed Azure resources and create an alert.
- **Azure Resource Graph and Log Analytics**: Uses the Azure Resource Graph `Resources` table and Log Analytics data from the from Azure Monitor Logs `Heartbeat` table. This example uses a virtual machine to show how to set up the query and alert.

> [!NOTE]
> Azure Resource Graph alerts integration with Log Analytics is in public preview.

## Prerequisites

- If you don't have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Resources deployed in Azure like virtual machines or storage accounts.
- To use the example for the Azure Resource Graph and Log Analytics query, you need at least one Azure virtual machine with the Azure Monitor Agent.

## What problem will we solve?

You want to use an Azure Resource Graph query to get information about your Azure resources. You can use Azure Log Analytics to set up alerts that notify you when certain conditions are met.

## Create workspace

Create a Log Analytics Workspace in the subscription that's being monitored.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search field, type _log analytics workspaces_ and select **Log Analytics workspaces**.

   If you've used Log Analytics workspaces, you can select it from **Azure services**.

   :::image type="content" source="./media/alerts-query-quickstart/search-log-analytics.png" alt-text="Screenshot of the Azure home page that highlights search field and Log Analytics workspaces.":::

1. Select **Create**.

   - **Subscription**: Select your Azure subscription
   - **Resource group**: _demo-arg-alert-rg_
   - **Name**: _demo-arg-alert-workspace_
   - **Region**: _West US3_

1. Select **Review + Create** and wait for **Validation passed** to be displayed.
1. Select **Create** to begin the deployment.
1. Select **Go to resource** when the deployment is completed.

## Create virtual machine

# [Azure Resource Graph](#tab/azure-resource-graph)

You don't need to create a virtual machine for the example that uses the Azure Resource Graph table.

# [Azure Resource Graph and Log Analytics](#tab/arg-log-analytics)

> [!NOTE]
> This section is optional if you have existing virtual machines or know how to create a virtual machine. This example uses a virtual machine to show how to create a query using an Azure Resource Graph table and Log Analytics data.

To get log information, when you connect your virtual machine to the Log Analytics workspace, the Azure Monitor Agent is installed on the virtual machine. If you don't have a virtual machine, you can create one for this example. To avoid unnecessary costs, delete the virtual machine when you're finished with the example.

The following instructions are basic settings for a Linux virtual machine. Detailed steps about how to create a virtual machine are outside the scope of this article.

1. In Azure, create an [Ubuntu Linux virtual machine](https://portal.azure.com/#create/canonical.0001-com-ubuntu-server-jammy22_04-lts-gen2).
1. Select **Create**.
1. Use the **Create a virtual machine**. You can accept most default settings with the following exceptions:

   **Create a virtual machine**
   - **Resource group**: _demo-arg-alert-rg_
   - **virtual machine name**: Type a virtual machine name
   - **Availability options**: _No infrastructure redundancy required_
   - **Size**: _B1ms_
   - **Administrator account**: Create key pair or username and password
   - **Public inbound ports**: _None_

   **Disks: accept defaults**
   - Verify **Delete with VM** is selected.

   **Networking**
   - Accept defaults.
   - Select **Delete public IP and NIC when VM is deleted**.

   **Management**
   - Accept defaults
   - Change the **Auto-shutdown** **Time zone** to your time zone.

   **Monitoring**, **Advanced**, and **Tags**
   - No changes needed for this example.

1. Select **Review and Create** and then **Create**.

   If you selected SSH for authentication, you're prompted to **Generate new key pair**. Download the private key and create the virtual machine. When you're finished with the VM, delete the key file.

Select **Go to resource** after the virtual machine is deployed.

> [!NOTE]
> This section is optional if you know how to connect a virtual machine to a Log Analytics workspace.

Set up monitoring for a virtual machine.
1. Go to your virtual machine.
1. Select **Monitoring** > **Insights** > **Azure Monitor** > **Overview**.
1. Select **Not Monitored**.
1. Select **Enable** for virtual machine's **Monitor Coverage**.
1. Select **Enable** for the **Azure Monitor Insights Onboarding**.
1. Set up the **Monitoring Configuration**
   - **Enable Insights using**: Azure Monitoring Agent
   - **Subscription**: Select your subscription.
   - Create a new Data Collection Rule
      - Create a name.
      - Select your subscription.
      - Select your Log Analytics workspace _demo-arg-alert-workspace_.
   - Select **Create**, verify the settings are correct, and select **Configure** to begin the deployment.
1. Close **Azure Monitor Insights Onboarding**.

After a successful deployment, **Insights** > **Overview** > **Monitored** shows the virtual machine's **Monitor Coverage** is enabled and a link to the data collection rule.

Select the link to the data collection rule and verify the **Configuration** settings:

- **Resources**: Shows the virtual machine, resource group, and subscription.
- **Data Sources**:
  - **Data source**: Performance Counters
  - **Destination**: Azure Monitor Logs

You can select the Performance Counters link to verify details.

Go to your Log Analytics workspace _demo-arg-alert-workspace_. Select **Settings** > **Agents** > **Linux servers** and one Linux computer is connected to the **Azure Monitor Linux agent**.

Go to your virtual machine and select **Settings** > **Extensions + applications** and verify that the `AzureMonitorLinuxAgent`shows provisioning succeeded.

---

## Create query

# [Azure Resource Graph](#tab/azure-resource-graph)

From the Log Analytics workspace, create an Azure Resource Graph query to get a count of your Azure resources. This example uses the Azure Resource Graph `Resources` table.

1. Select **Logs** from the left side of the **Log Analytics workspace** page.

   Close the **Queries** window if it's displayed.

1. Use the following code in the **New Query**.

   ```kusto
   arg("").Resources
   | count
   ```

   Table names in Log Analytics need to be camel case with the first letter of each word capitalized, like `Resources` or `ResourceContainers`. You can also use lowercase like `resources` or `resourcecontainers`.

   :::image type="content" source="./media/alerts-query-quickstart/log-analytics-workspace-query.png" alt-text="Screenshot of the Log Analytics workspace with a query of the Resources table that highlights logs and run button.":::

1. Select **Run**.

   The **Results** displays the **Count** of resources in your Azure subscription. Make a note of that number because you need it for the alert rule's condition. When you manually run the query the count is based on user identity, and a fired alert uses a managed identity. It's possible that the count might vary between a manual run or fired alert.

1. Remove the count from your query.

   ```kusto
   arg("").Resources
   ```

# [Azure Resource Graph and Log Analytics](#tab/arg-log-analytics)

From the Log Analytics workspace, create an Azure Resource Graph query to get the last heartbeat information from your virtual machine. This example uses the Azure Resource Graph `Resources` table and Log Analytics data from the from Azure Monitor Logs `Heartbeat` table.

1. Go to your _demo-arg-alert-workspace_ Log Analytics workspace.
1. Select **Logs** from the left side of the **Log Analytics workspace** page.

   Close the **Queries** window if it's displayed.

1. Use the following code in the **New Query**.

   ```kusto
   arg("").Resources
   | where type == 'microsoft.compute/virtualmachines'
   | project ResourceId = id, name, PowerState = tostring(properties.extended.instanceView.powerState.code)
   | join (Heartbeat
     | where TimeGenerated > ago(15m)
     | summarize lastHeartBeat = max(TimeGenerated) by ResourceId)
     on ResourceId
   | project lastHeartBeat, PowerState, name, ResourceId
   ```

   Table names in Log Analytics need to be camel case with the first letter of each word capitalized, like `Resources` or `ResourceContainers`. You can also use lowercase like `resources` or `resourcecontainers`.

   You can use other timeframes for the `TimeGenerated`. For example, rather than minutes like `15m` use hours like `12h`, `24h`, `48h`.

   :::image type="content" source="./media/alerts-query-quickstart/log-analytics-cross-query.png" alt-text="Screenshot of the Log Analytics workspace with a cross query of the Resources and Heartbeat tables that highlights logs and run button.":::

1. Select **Run**.

   The query should return the virtual machine's last heartbeat, power state, name, and resource ID. If no **Results** are displayed, continue to the next steps.

---

## Create alert rule

# [Azure Resource Graph](#tab/azure-resource-graph)

From the Log Analytics workspace, select **New alert rule**. The query from your Log Analytics workspace is copied to the alert rule. **Create an alert rule** has several tabs that need to be updated to create the alert.

:::image type="content" source="./media/alerts-query-quickstart/new-alert-rule.png" alt-text="Screenshot of the Log Analytics workspace page that highlights new alert rule.":::

### Scope

Verify that the scope is set to your Log Analytics workspace named _demo-arg-alert-workspace_.

If you need to change the scope, do the following steps.

1. Go to the **Scope** tab and select **Select scope**.
1. At the bottom of the **Selected resources** screen, delete the current scope.
1. Expand the **demo-arg-alert-rg** from the list of resources and select **demo-arg-alert-workspace**.
1. Select **Apply**.
1. Select **Next: Condition**.

### Condition

The form has several fields to complete.

- **Signal name**: Custom log search
- **Search query**: Displays the query code.

**Measurement**

- **Measure**: Table rows
- **Aggregation type**: Count
- **Aggregation granularity**: 5 minutes

**Alert logic**

- **Operator**: Greater than
- **Threshold value**: Use a number that's less that the number returned from the resources count.

   For example, if your resource count was 50 then use 45. This value triggers the alert to fire when it evaluates your resources because your number of resources is greater than the threshold value.

- **Frequency of evaluation**: 5 minutes

Select **Next: Actions**.

### Actions

Select **Create action group**.

- **Subscription**: Select your Azure subscription.
- **Resource group**: _demo-arg-alert-rg_
- **Region**: Global
- **Action group name**: _demo-arg-alert-action-group_
- **Display name**: _demo-action_ (limit is 12 characters)

Select **Next: Notifications**.

- **Notification type**: Select **Email/SMS message/Push/Voice**.
- **Name**: _email-alert_
- Select the **Email** checkbox and type your email address.
- Select **Ok**.

Select **Review + Create**, verify the summary is correct, and select **Create**. You're returned to the **Actions** tab of the **Create an alert rule** page. The **Action group name** shows the action group you created.

Select **Next: Details**.

### Details

Use the following information on the **Details** tab.

   - **Subscription**: Select your Azure subscription
   - **Resource group**: _demo-arg-alert-rg_
   - **Severity**: Accept the default value **3 - Informational**
   - **Alert rule name**: _demo-arg-alert-rule_
   - **Alert rule description**: _Email alert for count of Azure resources_
   - **Identity**: Select _System assigned managed identity_

Select **Review + Create**, verify the summary is correct, and select **Create**. You're returned to the **Logs** page of your **Log Analytics workspace**.

You receive an email notification to confirm you were added to the action group.

### Assign role

Assign the _Log Analytics Reader_ to the system-assigned managed identity so that it has permissions fire alerts that send email notifications.

1. Select **Monitoring** > **Alerts** in the Log Analytics workspace.

   Select **OK** if you're prompted that **Your unsaved edits will be discarded**.

1. Select **Alert rules**.
1. Select  _demo-arg-alert-rule_.
1. Select **Settings** > **Identity**  > **System assigned**.

   - **Status**: On
   - **Object ID**: Shows the GUID for your Enterprise Application (service principal) in Microsoft Entra ID.
   - **Permission**: Select **Azure role assignments**
     - Verify the correct subscription is selected.
     - Select **Add role assignment**
     - **Scope**: _Subscription_
     - **Subscription**: Your Azure subscription name
     - **Role**: _Log Analytics Reader_
1. Select **Save**.

It takes a few minutes for the _Log Analytics Reader_ to display on the **Azure role assignments** page. Select **Refresh** to update the page.

Use your browser's back button to return to the **Identity** and then select **Overview** to return to the alert rule. Select the link to your resource group named _demo-arg-alert-rg_.

# [Azure Resource Graph and Log Analytics](#tab/arg-log-analytics)

From the Log Analytics workspace, select **New alert rule**. The query from your Log Analytics workspace is copied to the alert rule. The **Create an alert rule** has several tabs that need to be updated.

:::image type="content" source="./media/alerts-query-quickstart/new-alert-rule-cross-query.png" alt-text="Screenshot of the Log Analytics workspace that shows a cross-query and highlights new alert rule.":::

### Scope

Verify that the scope is set to your Log Analytics workspace.

If you need to change the scope, do the following steps.

1. Go to the **Scope** tab and select **Select scope**.
1. At the bottom of the **Selected resources** screen, delete the current scope.
1. Expand the **demo-arg-alert-rg** from the list of resources and select **demo-arg-alert-workspace**.
1. Select **Apply**.
1. Select **Next: Condition**.

### Condition

The form has several fields to complete.

- **Signal name**: Custom log search
- **Search query**: Displays the query code.

**Measurement**

- **Measure**: Table rows
- **Aggregation type**: Count
- **Aggregation granularity**: 5 minutes

**Alert logic**

- **Operator**: Less than
- **Threshold value**: 2
- **Frequency of evaluation**: 5 minutes

Select **Next: Actions**.

### Actions

Select **Create action group**.

- **Subscription**: Select your Azure subscription.
- **Resource group**: _demo-arg-alert-rg_
- **Region**: Global
- **Action group name**: _demo-arg-la-alert-action-group_
- **Display name**: _demo-argla_ (limit is 12 characters)

Select **Next: Notifications**.

- **Notification type**: Select **Email/SMS message/Push/Voice**
- **Name**: _email-alert-arg-la_
- Select the **Email** checkbox and type your email address
- Select **Ok**

Select **Review + Create**, verify the summary is correct, and select **Create**. You're returned to the **Actions** tab of the **Create an alert rule** page. The **Action group name** shows the action group you created.

Select **Next: Details**.

### Details

Use the following information on the **Details** tab.

   - **Subscription**: Select your Azure subscription
   - **Resource group**: _demo-arg-alert-rg_
   - **Severity**: Accept the default value **2 - Warning**
   - **Alert rule name**: _demo-arg-la-alert-rule_
   - **Alert rule description**: _Email alert for ARG-LA query of Azure virtual machine_
   - **Identity**: Select _System assigned managed identity_

Select **Review + Create**, verify the summary is correct, and select **Create**. You're returned to the **Logs** page of your **Log Analytics workspace**.

You receive an email notification to confirm you were added to the action group.

### Assign role

Assign the _Log Analytics Reader_ to the system-assigned managed identity so that it has permissions fire alerts that send email notifications.

1. Select **Monitoring** > **Alerts** in the Log Analytics workspace.

   Select **OK** if you're prompted that **Your unsaved edits will be discarded**.

1. Select **Alert rules**
1. Select  _demo-arg-la-alert-rule_
1. Select **Settings** > **Identity**  > **System assigned**

   - **Status**: On
   - **Object ID**: Shows the GUID for your Enterprise Application (service principal) in Microsoft Entra ID.
   - **Permission**: Select **Azure role assignments**
     - Verify the correct subscription is selected.
     - Select **Add role assignment**
     - **Scope**: _Subscription_
     - **Subscription**: Your Azure subscription name
     - **Role**: _Log Analytics Reader_
1. Select **Save**.

It takes a few minutes for the _Log Analytics Reader_ to display on the **Azure role assignments** page. Select **Refresh** to update the page.

Use your browser's back button to return to the **Identity** and select **Overview** to return to the alert rule. Select the link to your resource group named _demo-arg-alert-rg_.

---

## Verify alerts

# [Azure Resource Graph](#tab/azure-resource-graph)

After the role is assigned to your alert rule, you begin to receive email for alert messages. The rule was created to send alerts every five minutes and it takes a few minutes to get the first alert.

You can also view the alerts in the Azure portal.

1. Go to the resource group _demo-arg-alert-rg_.
1. Select _demo-arg-alert-workspace_ in your list of resources.
1. Select **Monitoring** > **Alerts**.
1. A list of alerts is displayed.

   :::image type="content" source="./media/alerts-query-quickstart/alert-fired.png" alt-text="Screenshot of the Log Analytics workspace that shows list of alerts that fired.":::


# [Azure Resource Graph and Log Analytics](#tab/arg-log-analytics)

After the role is assigned to your alert rule, you begin to receive email for alert messages. The rule was created to send alerts every five minutes and it takes a few minutes to get the first alert.

You can also view the alerts in the Azure portal.

1. Go to the resource group _demo-arg-alert-rg_.
1. Select your virtual machine.
1. Select **Monitoring** > **Alerts**.
1. A list of alerts is displayed.

   :::image type="content" source="./media/alerts-query-quickstart/vm-alert-fired.png" alt-text="Screenshot of the virtual machine monitoring alerts that shows list of alerts that fired.":::

> [!NOTE]
> It might take 30 minutes for log information to become available to create alerts.

---

## How did we solve the problem?

You created an Azure Resource Graph query and a Log Analytics workspace to monitor Azure resources. You also set up alerts to notify you for events and assigned a role to the system-assigned managed identity. After the alert was created, you received email alerts based on conditions in the alert rule.

## Clean up resources

If you want to keep the alert configuration but stop the alert from firing and sending email notifications, you can disable it. Go to your alert rule _demo-arg-alert-rule_ or _demo-arg-la-alert-rule_ and select **Disable**.

If you don't need this alert or the resources you created in this example, delete the resource group with the following steps:

1. Go to your resource group _demo-arg-alert-rg_.
1. Select **Delete resource group**.
1. Type the resource group name to confirm.
1. Select **Delete**.

## Related content

For more information about the query language or how to explore resources, go to the following articles.

- [Understanding the Azure Resource Graph query language](./concepts/query-language.md)
- [Explore your Azure resources with Resource Graph](./concepts/explore-resources.md)
- [Overview of Log Analytics in Azure Monitor](../../azure-monitor/logs/log-analytics-overview.md)
- [Troubleshoot Azure Resource Graph alerts](./troubleshoot/alerts.md)
