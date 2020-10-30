---
title: Continuous export can send Azure Security Center's alerts and recommendations to Log Analytics workspaces or Azure Event Hubs
description: Learn how to configure continuous export of security alerts and recommendations to Log Analytics workspaces or Azure Event Hubs
services: security-center
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: how-to
ms.date: 10/27/2020
ms.author: memildin

---
# Continuously export Security Center data

Azure Security Center generates detailed security alerts and recommendations. You can view them in the portal or through programmatic tools. You may also need to export some or all of this information for tracking with other monitoring tools in your environment. 

**Continuous export** lets you fully customize *what* will be exported, and *where* it will go. For example, you can configure it so that:

- All high severity alerts are sent to an Azure Event Hub
- All medium or higher severity findings from vulnerability assessment scans of your SQL servers are sent to a specific Log Analytics workspace
- Specific recommendations are delivered to an Event Hub or Log Analytics workspace whenever they're generated 

This article describes how to configure continuous export to Log Analytics workspaces or Azure Event Hubs.

> [!NOTE]
> If you need to integrate Security Center with a SIEM, see [Stream alerts to a SIEM, SOAR, or IT Service Management solution](export-to-siem.md).

> [!TIP]
> Security Center also offers the option to perform a one-time, manual export to CSV. Learn more in [Manual one-time export of alerts and recommendations](#manual-one-time-export-of-alerts-and-recommendations).


## Availability

|Aspect|Details|
|----|:----|
|Release state:|Generally available (GA)|
|Pricing:|Free|
|Required roles and permissions:|<ul><li>**Security admin** or **Owner** on the resource group</li><li>Write permissions for the target resource</li><li>If you're using the Azure Policy 'DeployIfNotExist' policies described below you'll also need permissions for assigning policies</li></ul>|
|Clouds:|![Yes](./media/icons/yes-icon.png) Commercial clouds<br>![Yes](./media/icons/yes-icon.png) US Gov<br>![Yes](./media/icons/yes-icon.png) China Gov (to Event Hub), Other Gov|
|||





## Set up a continuous export 

You can configure continuous export from the Security Center pages in Azure portal, via the Security Center REST API, or at scale using the supplied Azure Policy templates. Select the appropriate tab below for details of each.

### [**Use the Azure portal**](#tab/azure-portal)

### Configure continuous export from the Security Center pages in Azure portal

The steps below are necessary whether you're setting up a continuous export to Log Analytics workspace or Azure Event Hubs.

1. From Security Center's sidebar, select **Pricing & settings**.
1. Select the specific subscription for which you want to configure the data export.
1. From the sidebar of the settings page for that subscription, select **Continuous Export**.
    [![Export options in Azure Security Center](media/continuous-export/continuous-export-options-page.png)](media/continuous-export/continuous-export-options-page.png#lightbox)
    Here you see the export options. There's a tab for each available export target. 
1. Select the data type you'd like to export and choose from the filters on each type (for example, export only high severity alerts).
1. Optionally, if your selection includes one of these four recommendations, you can include the vulnerability assessment findings together with them:
    - Vulnerability Assessment findings on your SQL databases should be remediated
    - Vulnerability Assessment findings on your SQL servers on machines should be remediated (Preview)
    - Vulnerabilities in Azure Container Registry images should be remediated (powered by Qualys)
    - Vulnerabilities in your virtual machines should be remediated

    To include the findings with these recommendations, enable the **include security findings** option.

    :::image type="content" source="./media/continuous-export/include-security-findings-toggle.png" alt-text="Include security findings toggle in continuous export configuration" :::

1. From the "Export target" area, choose where you'd like the data saved. Data can be saved in a target on a different subscription (for example on a Central Event Hub instance or a central Log Analytics workspace).
1. Select **Save**.

### [**Use the REST API**](#tab/rest-api)

### Configure continuous export using the REST API

Continuous export can be configured and managed via the Azure Security Center [automations API](/rest/api/securitycenter/automations). Use this API to create or update rules for exporting to any of the following possible destinations:

- Azure Event Hub
- Log Analytics workspace
- Azure Logic Apps 

The API provides additional functionality not available from the Azure portal, for example:

* **Greater volume** - The API allows you to create multiple export configurations on a single subscription. The **Continuous Export** page in Security Center's portal UI supports only one export configuration per subscription.

* **Additional features** - The API offers additional parameters that aren't shown in the UI. For example, you can add tags to your automation resource as well as define your export based on a wider set of alert and recommendation properties than those offered in the **Continuous Export** page in Security Center's portal UI.

* **More focused scope** - The API provides a more granular level for the scope of your export configurations. When defining an export with the API, you can do so at the resource group level. If you're using the **Continuous Export** page in Security Center's portal UI, you have to define it at the subscription level.

    > [!TIP]
    > If you've set up multiple export configurations using the API, or if you've used API-only parameters, those extra features will not be displayed in the Security Center UI. Instead, there'll be a banner informing you that other configurations exist.

Learn more about the automations API in the [REST API documentation](/rest/api/securitycenter/automations).





### [**Deploy at scale with Azure Policy**](#tab/azure-policy)

### Configure continuous export at scale using the supplied policies

Automating your organization's monitoring and incident response processes can greatly improve the time it takes to investigate and mitigate security incidents.

To deploy your continuous export configurations across your organization, use the supplied Azure Policy 'DeployIfNotExist' policies described below to create and configure continuous export procedures.

**To implement these policies**

1. From the table below, select the policy you want to apply:

    |Goal  |Policy  |Policy ID  |
    |---------|---------|---------|
    |Continuous export to event hub|[Deploy export to Event Hub for Azure Security Center alerts and recommendations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fcdfcce10-4578-4ecd-9703-530938e4abcb)|cdfcce10-4578-4ecd-9703-530938e4abcb|
    |Continuous export to Log Analytics workspace|[Deploy export to Log Analytics workspace for Azure Security Center alerts and recommendations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fffb6f416-7bd2-4488-8828-56585fef2be9)|ffb6f416-7bd2-4488-8828-56585fef2be9|
    ||||

    > [!TIP]
    > You can also find these by searching Azure Policy:
    > 1. Open Azure Policy.
    > :::image type="content" source="./media/continuous-export/opening-azure-policy.png" alt-text="Accessing Azure Policy":::
    > 2. From the Azure Policy menu, select **Definitions** and search for them by name. 

1. From the relevant Azure Policy page, select **Assign**.
    :::image type="content" source="./media/continuous-export/export-policy-assign.png" alt-text="Assigning the Azure Policy":::

1. Open each tab and set the parameters as desired:
    1. In the **Basics** tab, set the scope for the policy. To use centralized management, assign the policy to the Management Group containing the subscriptions that will use continuous export configuration. 
    1. In the **Parameters** tab, set the resource group and data type details. 
        > [!TIP]
        > Each parameter has a tooltip explaining the options available to you.
        >
        > Azure Policy's parameters tab (1) provides access to similar configuration options as Security Center's continuous export page (2).
        > :::image type="content" source="./media/continuous-export/azure-policy-next-to-continuous-export.png" alt-text="Comparing the parameters in continuous export with Azure Policy" lightbox="./media/continuous-export/azure-policy-next-to-continuous-export.png":::
    1. Optionally, to apply this assignment to existing subscriptions, open the **Remediation** tab and select the option to create a remediation task.
1. Review the summary page and select **Create**.

--- 

## Information about exporting to a Log Analytics workspace

If you want to analyze Azure Security Center data inside a Log Analytics workspace or use Azure alerts together with Security Center alerts, set up continuous export to your Log Analytics workspace.

### Log Analytics tables and schemas

Security alerts and recommendations are stored in the *SecurityAlert* and *SecurityRecommendations* tables respectively. 

The name of the Log Analytics solution containing these tables depends on whether you have Azure Defender enabled: Security ('Security and Audit') or SecurityCenterFree. 

> [!TIP]
> To see the data on the destination workspace, you must enable one of these solutions **Security and Audit** or **SecurityCenterFree**.

![The *SecurityAlert* table in Log Analytics](./media/continuous-export/log-analytics-securityalert-solution.png)

To view the event schemas of the exported data types, visit the [Log Analytics table schemas](https://aka.ms/ASCAutomationSchemas).


##  View exported alerts and recommendations in Azure Monitor

In some cases, you may choose to view the exported Security Alerts and/or recommendations in [Azure Monitor](../azure-monitor/platform/alerts-overview.md). 

Azure Monitor provides a unified alerting experience for a variety of Azure alerts including Diagnostic Log, Metric alerts, and custom alerts based on Log Analytics workspace queries.

To view alerts and recommendations from Security Center in Azure Monitor, configure an Alert rule based on Log Analytics queries (Log Alert):

1. From Azure Monitor's **Alerts** page, select **New alert rule**.

    ![Azure Monitor's alerts page](./media/continuous-export/azure-monitor-alerts.png)

1. In the create rule page, configure your new rule (in the same way you'd configure a [log alert rule in Azure Monitor](../azure-monitor/platform/alerts-unified-log.md)):

    * For **Resource**, select the Log Analytics workspace to which you exported security alerts and recommendations.

    * For **Condition**, select **Custom log search**. In the page that appears, configure the query, lookback period, and frequency period. In the search query, you can type *SecurityAlert* or *SecurityRecommendation* to query the data types that Security Center continuously exports to as you enable the Continuous export to Log Analytics feature. 
    
    * Optionally, configure the [Action Group](../azure-monitor/platform/action-groups.md) that you'd like to trigger. Action groups can trigger email sending, ITSM tickets, WebHooks, and more.
    ![Azure Monitor alert rule](./media/continuous-export/azure-monitor-alert-rule.png)

You'll now see new Azure Security Center alerts or recommendations (depending on your configured continuous export rules and the condition you defined in your Azure Monitor alert rule) in Azure Monitor alerts, with automatic triggering of an action group (if provided).

## Manual one-time export of alerts and recommendations

To download a CSV report for alerts or recommendations, open the **Security alerts** or **Recommendations** page and select the **Download CSV report** button.

[![Download alerts data as a CSV file](media/continuous-export/download-alerts-csv.png)](media/continuous-export/download-alerts-csv.png#lightbox)

> [!NOTE]
> These reports contain alerts and recommendations for resources from the currently selected subscriptions.


## FAQ - Continuous export

### What are the costs involved in exporting data?

There is no cost for enabling a continuous export. Costs might be incurred for ingestion and retention of data in your Log Analytics workspace, depending on your configuration there. 

Learn more about [Log Analytics workspace pricing](https://azure.microsoft.com/pricing/details/monitor/).

Learn more about [Azure Event Hub pricing](https://azure.microsoft.com/pricing/details/event-hubs/).


### Does the export include data about the current state of all resources?

No. Continuous export is built for streaming of **events**:

- **Alerts** received before you enabled export won't be exported.
- **Recommendations** are sent whenever a resource's compliance state changes. For example, when a resource turns from healthy to unhealthy. Therefore, as with alerts, recommendations for resources that haven't changed state since you enabled export won't be exported.


### Why are recommendations sent at different intervals?

Different recommendations have different compliance evaluation intervals, which can vary from a few minutes to every few days. Consequently, recommendations will differ in the amount of time it takes for them to appear in your exports.

### Does continuous export support any business continuity or disaster recovery (BCDR) scenarios?

When preparing your environment for BCDR scenarios, where the target resource is experiencing an outage or other disaster, it's the organization's responsibility to prevent data loss by establishing backups according to the guidelines from Azure Event Hubs, Log Analytics workspace, and Logic App.

Learn more in [Azure Event Hubs - Geo-disaster recovery](../event-hubs/event-hubs-geo-dr.md).


### Is continuous export available with Azure Security Center free?

Yes! Note that many Security Center alerts are only provided when you've enabled Azure Defender. A good way to preview the alerts you'll get in your exported data is to see the alerts shown in Security Center's pages in the Azure portal.



## Next steps

In this article, you learned how to configure continuous exports of your recommendations and alerts. You also learned how to download your alerts data as a CSV file. 

For related material, see the following documentation: 

- Learn more about [workflow automation templates](https://github.com/Azure/Azure-Security-Center/tree/master/Workflow%20automation).
- [Azure Event Hubs documentation](../event-hubs/index.yml)
- [Azure Sentinel documentation](../sentinel/index.yml)
- [Azure Monitor documentation](../azure-monitor/index.yml)
- [Export data types schemas](https://aka.ms/ASCAutomationSchemas)