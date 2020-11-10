---
title: Monitor Azure AD B2C with Azure Monitor
titleSuffix: Azure AD B2C
description: Learn how to log Azure AD B2C events with Azure Monitor by using delegated resource management.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.author: mimart
ms.subservice: B2C
ms.date: 11/04/2020
---

# Monitor Azure AD B2C with Azure Monitor

Use Azure Monitor to route Azure Active Directory B2C (Azure AD B2C) sign-in and [auditing](view-audit-logs.md) logs to different monitoring solutions. You can retain the logs for long-term use or integrate with third-party security information and event management (SIEM) tools to gain insights into your environment.

You can route log events to:

* An Azure [storage account](../storage/blobs/storage-blobs-introduction.md).
* A [Log Analytics workspace](../azure-monitor/platform/resource-logs-collect-workspace.md) (to analyze data, create dashboards, and alert on specific events).
* An Azure [event hub](../event-hubs/event-hubs-about.md) (and integrate with your Splunk and Sumo Logic instances).

![Azure Monitor](./media/azure-monitor/azure-monitor-flow.png)

In this article you learn how to transfer the logs to Azure Log Analytics workspace. So, you can create a dashboard or alerts about the Azure AD B2C users activities.

## Perquisites

> [!IMPORTANT]
> In this walkthrough you configure both your Azure AD B2C and your Azure AD tenant where the Log Analytics workspace will be hosted. Make sure to sign-in to the correct directory as describe in this article.
 
The account used to run the following deployment must be assigned the [Global Administrator](../active-directory/roles/permissions-reference.md#limit-use-of-global-administrator) role for both your Azure AD B2C and Azure AD tenants.

![Resource group projection](./media/azure-monitor/resource-group-projection.png)

## 1. Create or choose resource group

This is the resource group containing the destination Azure storage account, event hub, or Log Analytics workspace to receive data from Azure Monitor. You specify the resource group name when you deploy the Azure Resource Manager template.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your **Azure AD tenant**.
1. [Create a resource group](../azure-resource-manager/management/manage-resource-groups-portal.md#create-resource-groups), or chose an existing one. This example uses a resource group named *azure-ad-b2c-monitor*.

## 2. Create a Log Analytics workspace

A **Log Analytics workspaces** is a unique environment for Azure Monitor log data. You use the Log Analytics workspace to collecting data from Azure AD B2C [audit logs](view-audit-logs.md), and visualize it with queries, and workbook, or create alerts. 

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your **Azure AD tenant**.
1. [Create a Log Analytics workspace](../azure-monitor/learn/quick-create-workspace.md). This example uses a Log Analytics workspace named *AzureAdB2C*, in a resource group named *azure-ad-b2c-monitor*.

## 3. Delegated resource management

Azure AD B2C leverages [Azure Active Directory monitoring](../active-directory/reports-monitoring/overview-monitoring.md). To enable *Diagnostic settings* in Azure Active Directory within your Azure AD B2C tenant, you use [Azure Lighthouse](../lighthouse/concepts/azure-delegated-resource-management.md) to [delegated resource](../lighthouse/concepts/azure-delegated-resource-management.md), allowing your Azure AD B2C (the **Service Provider**) to manage an Azure AD (the **Customer**) resource. After you completed the steps in this article, you will have access to the *azure-ad-b2c-monitor* resource group that contains the Azure Monitor in your **Azure AD B2C** portal, and be able to transfer the logs from Azure AD B2C to your Log Analytics workspace.

You authorize a user or group in your Azure AD B2C directory to configure the Azure Monitor instance within the tenant that contains your Azure subscription. To create the authorization, you deploy an [Azure Resource Manager](../azure-resource-manager/index.yml) template to your Azure AD tenant containing the subscription. The following sections walk you through the process.

### 3.1 Get your Azure AD B2C tenant ID

In this step, you choose your Azure AD B2C tenant as a **service provider**. You also define the authorizations as you need in order to assign the appropriate Azure built-in roles to groups in your Azure AD tenant. Gather the following information:

**Tenant ID** of your Azure AD B2C directory (also known as the directory ID).

1. Sign in to the [Azure portal](https://portal.azure.com/) with your **Azure AD B2C** administrative account.
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your **Azure AD B2C** tenant.
1. Select **Azure Active Directory**, select **Overview**.
1. Record the **Tenant ID**.

### 3.2 Select a security groups

In this step you select an Azure AD B2C group or user you want to give  permission to the resource group you created earlier in the directory containing your subscription.  

To make management easier, we recommend using Azure AD user *groups* for each role, allowing you to add or remove individual users to the group rather than assigning permissions directly to that user. In this walkthrough, you add a security group.

> [!IMPORTANT]
> In order to add permissions for an Azure AD group, the **Group type** must be set to **Security**. This option is selected when the group is created. For more information, see [Create a basic group and add members using Azure Active Directory](../active-directory/fundamentals/active-directory-groups-create-azure-portal.md).

1. With **Azure Active Directory** still selected in your Azure AD B2C directory, select **Groups**, and then select a group. If you don't have an existing group, create a **Security** group, then add members. For more information, follow the procedure [Create a basic group and add members using Azure Active Directory](../active-directory/fundamentals/active-directory-groups-create-azure-portal.md). 
1. Select **Overview**, and record the group's **Object ID**.

### 3.3 Create an Azure Resource Manager template

Create an [Azure Resource Manager template](../lighthouse/how-to/onboard-customer.md). This template grants Azure AD B2C access to your Azure AD resource group *azure-ad-b2c-monitor*, you create earlier. Deploy the template using the "Deploy to Azure" buttons to deploy directly in the Azure portal. Make sure you sign-in to your Azure AD tenant (not the Azure AD B2C). Clicking on the deploy to Azure link, will open your Azure Portal. You may need to switch to your AAD tenant.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2FAzure-Lighthouse-samples%2Fmaster%2Ftemplates%2Frg-delegated-resource-management%2FrgDelegatedResourceManagement.json) 

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your **Azure AD** tenant.
1. On the **Custom deployment** fill out following information:

| Field   | Definition |
|---------|------------|
| Subscription |  Select the directory that contains the Azure subscription where the *azure-ad-b2c-monitor* resource group was created. |
| Region| Select the region where the resource will be deployed.  | 
| Msp Offer Name| A name describing this definition. For example, *Azure AD B2C Managed Services*. This value is displayed to the customer as the title of the offer. |
| Msp Offer Description| A brief description of your offer. For example, *Enables Azure Monitor in Azure AD B2C*.|
| Managed By Tenant Id| The **Tenant ID** of your Azure AD B2C tenant (also known as the directory ID). |
|Authorizations|Specify an JSON array, containing tuples of Azure AD principal Id, a Azure role definition Id. The principal Id is  the **Object ID** of the B2C group or user that will have access to resources in this Azure subscription. For this walkthrough, specify the group's Object ID that you recorded earlier. For the role definition Id use the [built-in role](../role-based-access-control/built-in-roles.md) value for the *Contributor role*, `b24988ac-6180-42a0-ab88-20f7382dd24c`.|
| Rg Name | The name of the resource group you create earlier in your Azure AD tenant. For example, *azure-ad-b2c-monitor*. |

The following example demonstrates an Authorizations with one user group.

```json
[
    {
        "principalId": "<Replace with group's OBJECT ID>",
        "principalIdDisplayName": "Azure AD B2C tenant administrators",
        "roleDefinitionId": "b24988ac-6180-42a0-ab88-20f7382dd24c"
    }
]
```


After you deploy the template, it can take a few minutes for the resource projection to complete. You may need to wait a few minutes (typically no more than five) before moving on to the next section to select the subscription. You verify the deployment in your Azure AD tenant, and get the details of the resource projection. For more information, see [View and manage service providers](../lighthouse/how-to/view-manage-service-providers.md).  

## 4. Select your subscription

Once you've deployed the template and have waited a few minutes for the resource projection to complete, associate your subscription to your Azure AD B2C directory with the following steps.

1. **Sign out** of the Azure portal if you're currently signed in. This and the following step are done to refresh your credentials in the portal session.
1. Sign in to the [Azure portal](https://portal.azure.com) with your **Azure AD B2C** administrative account. This account must be a member of the security group you specified the [Delegated resource management](#3-delegated-resource-management) step.
1. Select the **Directory + Subscription** icon in the portal toolbar.
1. Select the directory that contains the Azure subscription where the *azure-ad-b2c-monitor* resource group was created..

    ![Switch directory](./media/azure-monitor/azure-monitor-portal-03-select-subscription.png)
1. Verify that you've selected the correct directory and subscription. In this example, all directories and subscriptions are selected.

    ![All directories selected in Directory & Subscription filter](./media/azure-monitor/azure-monitor-portal-04-subscriptions-selected.png)

## 5. Configure diagnostic settings

Diagnostic settings define where logs and metrics for a resource should be sent. Possible destinations are:

- [Azure storage account](../azure-monitor/platform/resource-logs-collect-storage.md)
- [Event hubs](../azure-monitor/platform/resource-logs-stream-event-hubs.md) solutions.
- [Log Analytics workspace](../azure-monitor/platform/resource-logs-collect-workspace.md)

In this example, we use the Log Analytics workspace to create a dashboard.

### 5.1 Create diagnostic settings

You're ready to [Create diagnostic settings](../active-directory/reports-monitoring/overview-monitoring.md) in the Azure portal.

To configure monitoring settings for Azure AD B2C activity logs:

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure AD B2C administrative account. This account must be a member of the security group you specified the [Delegated resource management](#3-delegated-resource-management) step.
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.
1. Select **Azure Active Directory**
1. Under **Monitoring**, select **Diagnostic settings**.
1. If there are existing settings on the resource, you will see a list of settings already configured. Either select **Add diagnostic setting** to add a new setting, or **Edit** setting to edit an existing one. Each setting can have no more than one of each of the destination types.

    ![Diagnostics settings pane in Azure portal](./media/azure-monitor/azure-monitor-portal-05-diagnostic-settings-pane-enabled.png)

1. Give your setting a name if it doesn't already have one.
1. Check the box for each destination to send the logs. Select **Configure** to specify their settings as described in the following table.
1. Select **Send to Log Analytics**, then select the **Name of workspace** you created earlier `AzureAdB2C`. 
1. Select **AuditLogs** and **SignInLogs**.
1. Select **Save**.

> [!NOTE]
> It may take up to 15 minutes between when an event is emitted and when it [appears in a Log Analytics workspace](../azure-monitor/platform/data-ingestion-time.md). Also, read about [Active Directory reporting latencies](../active-directory/reports-monitoring/reference-reports-latencies.md) as it play important role in reporting as it influence staleness of the data. 

If you see the following error message *To setup Diagnostic settings to use Azure Monitor for your Azure AD B2C directory, you need to set up delegated resource management*. Make sure you sign-in with a user who is a member of the [security group](3.2-Select-a-security-group) and   [Select your subscription](#4-select-your-subscription).

## 6. Visualize your data

At this point you can configure your Log Analytics workspace from both your Azure AD tenant, or Azure AD B2C. Now, you are going to configure your Log Analytics workspace to visualize your data and configure alerts. 

### 6.1 Create a Query

Log queries help you to fully leverage the value of the data collected in Azure Monitor Logs. A powerful query language allows you to join data from multiple tables, aggregate large sets of data, and perform complex operations with minimal code. Virtually any question can be answered and analysis performed as long as the supporting data has been collected, and you understand how to construct the right query. For more information, see [Get started with log queries in Azure Monitor](../azure-monitor/log-query/get-started-queries.md).

1. From **Log Analytics workspace** select **Logs**
1. In the query editor past the following [Kusto Query Language](https://docs.microsoft.com/azure/data-explorer/kusto/query/) query. This query shows policy usage by operation over the past x days. The default duration is set to 90 days i-e 90d. Notice that the query is focused only on the operation where some token/code is issued by policy.

    ```kusto
    AuditLogs 
    | where TimeGenerated  > ago(90d)
    | where OperationName contains "issue"
    | extend  UserId=extractjson("$.[0].id",tostring(TargetResources))
    | extend Policy=extractjson("$.[1].value",tostring(AdditionalDetails))
    | summarize SignInCount = count() by Policy, OperationName
    | order by SignInCount desc  nulls last   
    ```

1. Select **Run**. The query results are displayed at the bottom of the screen.
1. To save your query for later use, select **Save**.

   ![Log Analytics log editor](./media/azure-monitor/query-policy-usage.png)
   
1. Fill in the details as shown below
    1. **Name** - the name of your query
    1. **Save as** - select `query`
    1. **Category** - select `Log`
1. Select **Save**.

You can also change your query to visualize the data, using the [render](https://docs.microsoft.com/azure/data-explorer/kusto/query/renderoperator?pivots=azuremonitor) operator.

```kusto
AuditLogs 
| where TimeGenerated  > ago(90d)
| where OperationName contains "issue"
| extend  UserId=extractjson("$.[0].id",tostring(TargetResources))
| extend Policy=extractjson("$.[1].value",tostring(AdditionalDetails))
| summarize SignInCount = count() by Policy
| order by SignInCount desc  nulls last 
| render  piechart 
```
 
![Log Analytics log editor pie](./media/azure-monitor/query-policy-usage-pie.png)

For more samples, checkout the Azure AD B2C [Siem GitHub repo](https://aka.ms/b2csiem)

### 6.2 Create a Workbook

Workbooks provide a flexible canvas for data analysis and the creation of rich visual reports within the Azure portal. They allow you to tap into multiple data sources from across Azure, and combine them into unified interactive experiences. For more information, see [Azure Monitor Workbooks](../azure-monitor/platform/workbooks-overview.md).

Follow the instructions below to create a new workbook using JSON Gallery Template. This workbook provides **User Insights** and **Authentication** dashboard for Azure AD B2C tenant. 

1. From **Log Analytics workspace** select **Workbooks**.
1. From the toolbar, select **+ New** option to create a new workbook.
1. On the **New workbook** page, select the **Advanced Editor** using the **</>** option on the toolbar.

     ![Gallery Template](./media/azure-monitor/wrkb-adv-editor.png)

1. Select **Gallery Template**.
1. Replace the JSON in the **Gallery Template**  with the content [Azure AD B2C basic workbook](https://raw.githubusercontent.com/azure-ad-b2c/siem/master/workbooks/dashboard.json):
1. Apply the template by using the **Apply** button.
1. Select **Done Editing** button from the toolbar to finish editing of the workbook.
1. Finally, save the workbook by using the **Save** button from the toolbar.
1. Provide a **Title** such as, *Azure AD B2C Dashboard*. 
1. Select **Save**.

    ![Save the workbook](./media/azure-monitor/wrkb-title.png)

The workbook will display reports in the form of a dashboard.

![Workbook first dashboard](./media/azure-monitor/wkrb-dashboard-1.png)

![Workbook second dashboard](./media/azure-monitor/wrkb-dashboard-2.png)

![Workbook third dashboard](./media/azure-monitor/wrkb-dashboard-3.png)


## Create alerts

Alerts are created by alert rules in Azure Monitor and can automatically run saved queries or custom log searches at regular intervals. You can create alerts based on specific performance metrics or when certain events are created, absence of an event, or a number of events are created within a particular time window. For example, alerts can be used to notify you when average number of sign-in exceeds a certain threshold. For more information, see [Create alerts](../azure-monitor/learn/tutorial-response.md).


Use the following instructions to create a new Azure Alert which will send an [email notification](../azure-monitor/platform/action-groups.md#configure-notifications) whenever there is a 25% drop in the **Total Requests** compare to previous period. Alert will run every 5 minutes and look for the drop within last 24 hours windows. The alerts are created using Kusto query language.


1. From **Log Analytics workspace**, select **Logs**. 
1. Create a new **Kusto query** by using the query below.

    ```kusto
    let start = ago(24h);
    let end = now();
    let threshold = -25; //25% decrease in total requests.
    AuditLogs
    | serialize TimeGenerated, CorrelationId, Result
    | make-series TotalRequests=dcount(CorrelationId) on TimeGenerated in range(start, end, 1h)
    | mvexpand TimeGenerated, TotalRequests
    | where TotalRequests > 0
    | serialize TotalRequests, TimeGenerated, TimeGeneratedFormatted=format_datetime(todatetime(TimeGenerated), 'yyyy-M-dd [hh:mm:ss tt]')
    | project   TimeGeneratedFormatted, TotalRequests, PercentageChange= ((toreal(TotalRequests) - toreal(prev(TotalRequests,1)))/toreal(prev(TotalRequests,1)))*100
    | order by TimeGeneratedFormatted
    | where PercentageChange <= threshold   //Trigger's alert rule if matched.
    ```

1. Select **Run**, to test the query. You should see the results if there is a drop of 25% or more in the total requests within the past 24 hours.
1. To create an alert rule based on the query above, use the **+ New alert rule** option available in the toolbar.
1. On the **Create a alert rule** page, select **Condition name** 
1. On the **Configure signal logic** page, set following values and then use **Done** button to save the changes.
    * Alert logic: Set **Number of results** **Greater than** **0** .
    * Evaluation based on: Select **1440** for Period (in minutes) and **5** for Frequency (in minutes) 

    ![Create a alert rule condition](./media/azure-monitor/alert-create-rule-condition.png)

After the alert is created, go to **Log Analytics workspace** and select **Alerts**. This page displays all the alerts that have been triggered in the duration set by **Time range** option.  

### Configure action groups

Azure Monitor and Service Health alerts use action groups to notify users that an alert has been triggered. You can include sending a voice call, SMS, email; or triggering various types of automated actions. Follow the guidance [Create and manage action groups in the Azure portal](../azure-monitor/platform/action-groups.md)

Here is an example of an alert notification email. 

   ![Email notification](./media/azure-monitor/alert-email-notification.png)
 
## Multiple tenants 

To onboard multiple Azure AD B2C tenant logs to the same Log Analytics Workspace (or Azure storage account, or event hub), you'll need separate deployments with different **mspOfferName** values. Make sure you Application Insights is in the same resource group as you configure in step [Create or choose resource group](#1-create-or-choose-resource-group).

When working with multiple Log Analytics workspaces, use [Cross Workspace Query](../azure-monitor/log-query/cross-workspace-query.md) to create queries that work across multiple workspaces. For example, following query performs a join of two Audit logs from different tenants are joined based on the same Category (e.g. Authentication).

```kusto
workspace("AD-B2C-TENANT1").AuditLogs
| join  workspace("AD-B2C-TENANT2").AuditLogs
  on $left.Category== $right.Category
```

## Change the data retention period

Azure Monitor Logs is designed to scale and support collecting, indexing, and storing massive amounts of data per day from any source in your enterprise or deployed in Azure. By default, logs are retained for 30 days but retention duration can be increased up to 2 years. Learn about [Manage usage and costs with Azure Monitor Logs](../azure-monitor/platform/manage-cost-storage.md). After you select the pricing tier, you can [Change the data retention period](../azure-monitor/platform/manage-cost-storage.md#change-the-data-retention-period).

## Next steps

* Check out the Azure AD B2C [SIEM gallery](https://aka.ms/b2csiem) form more samples. 

* For more information about adding and configuring diagnostic settings in Azure Monitor, see [Tutorial: Collect and analyze resource logs from an Azure resource](../azure-monitor/insights/monitor-azure-resource.md).

* For information about streaming Azure AD logs to an event hub, see [Tutorial: Stream Azure Active Directory logs to an Azure event hub](../active-directory/reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md).
