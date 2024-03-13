---
title: Set up continuous export of alerts and recommendations
description: Learn how to set up continuous export of Microsoft Defender for Cloud security alerts and recommendations to Log Analytics in Azure Monitor or to Azure Event Hubs.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 06/19/2023
---
# Continuously export Microsoft Defender for Cloud data

Microsoft Defender for Cloud generates detailed security alerts and recommendations. To analyze the information that's in these alerts and recommendations, you can export them to Log Analytics in Azure Monitor, to Azure Event Hubs, or to another Security Information and Event Management (SIEM), Security Orchestration Automated Response (SOAR), or IT classic [deployment model solution](export-to-siem.md). You can stream the alerts and recommendations as they're generated or define a schedule to send periodic snapshots of all new data.

When you set up continuous export, you can fully customize what information to export and where the information goes. For example, you can configure it so that:

- All high-severity alerts are sent to an Azure event hub.
- All medium or higher-severity findings from vulnerability assessment scans of your computers running SQL Server are sent to a specific Log Analytics workspace.
- Specific recommendations are delivered to an event hub or Log Analytics workspace whenever they're generated.
- The secure score for a subscription is sent to a Log Analytics workspace whenever the score for a control changes by 0.01 or more.

This article describes how to set up continuous export to a Log Analytics workspace or to an event hub in Azure.

> [!TIP]
> Defender for Cloud also offers the option to do a onetime, manual export to a comma-separated values (CSV) file. Learn more in [Manually export alerts and recommendations](#manually-export-alerts-and-recommendations).

## Availability

|Aspect|Details|
|----|:----|
|Release status:|General availability (GA)|
|Pricing:|Free|
|Required roles and permissions:|<ul><li>Security Admin or Owner for the resource group.</li><li>Write permissions for the target resource.</li><li>If you use the [Azure Policy DeployIfNotExist policies](#set-up-continuous-export-at-scale-by-using-provided-policies), you must have permissions that let you assign policies.</li><li>To export data to Event Hubs, you must have Write permissions on the Event Hubs policy.</li><li>To export to a Log Analytics workspace:<ul><li>If it *has the SecurityCenterFree solution*, you must have a minimum of Read permissions for the workspace solution: `Microsoft.OperationsManagement/solutions/read`.</li><li>If it *doesn't have the SecurityCenterFree solution*, you must have write permissions for the workspace solution: `Microsoft.OperationsManagement/solutions/action`.</li><li>Learn more about [Azure Monitor and Log Analytics workspace solutions](/previous-versions/azure/azure-monitor/insights/solutions).</li></ul></li></ul>|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National (Azure Government, Microsoft Azure operated by 21Vianet)|

## What data types can be exported?

You can use continuous export to export the following data types whenever they change:

- Security alerts.
- Security recommendations.
- Security findings.

   Findings can be thought of as "sub" recommendations and belong to a "parent" recommendation. For example:

  - The recommendations [System updates should be installed on your machines (powered by Update Center)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e1145ab1-eb4f-43d8-911b-36ddf771d13f) and [System updates should be installed on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4ab6e3c5-74dd-8b35-9ab9-f61b30875b27) each has one sub recommendation per outstanding system update.
  - The recommendation [Machines should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1195afff-c881-495e-9bc5-1486211ae03f) has a sub recommendation for every vulnerability that the vulnerability scanner identifies.

    > [!NOTE]
    > If you’re configuring continuous export by using the REST API, always include the parent with the findings.

- Secure score per subscription or per control.
- Regulatory compliance data.

<a name="set-up-a-continuous-export"></a>

## Set up continuous export

You can set up continuous export on the Microsoft Defender for Cloud pages in the Azure portal, by using the REST API, or at scale by using provided Azure Policy templates.

### [Azure portal](#tab/azure-portal)

<a name="configure-continuous-export-from-the-defender-for-cloud-pages-in-azure-portal"></a>

### Set up continuous export on the Defender for Cloud pages in the Azure portal

To set up a continuous export to Log Analytics or Azure Event Hubs by using the Azure portal:

1. On the Defender for Cloud resource menu, select **Environment settings**.

1. Select the subscription that you want to configure data export for.

1. In the resource menu under **Settings**, select **Continuous export**.

    :::image type="content" source="./media/continuous-export/continuous-export-options-page.png" alt-text="Screenshot that shows the export options in Microsoft Defender for Cloud." lightbox="./media/continuous-export/continuous-export-options-page.png":::

    The export options appear. There's a tab for each available export target, either event hub or Log Analytics workspace.

1. Select the data type you'd like to export, and choose from the filters on each type (for example, export only high-severity alerts).

1. Select the export frequency:

    - **Streaming**. Assessments are sent when a resource’s health state is updated (if no updates occur, no data is sent).
    - **Snapshots**. A snapshot of the current state of the selected data types that are sent once a week per subscription. To identify snapshot data, look for the field **IsSnapshot**.

    If your selection includes one of these recommendations, you can include the vulnerability assessment findings with them:

    - [SQL databases should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/82e20e14-edc5-4373-bfc4-f13121257c37)
    - [SQL servers on machines should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f97aa83c-9b63-4f9a-99f6-b22c4398f936)
    - [Container registry images should have vulnerability findings resolved (powered by Qualys)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/dbd0cb49-b563-45e7-9724-889e799fa648)
    - [Machines should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1195afff-c881-495e-9bc5-1486211ae03f)
    - [System updates should be installed on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4ab6e3c5-74dd-8b35-9ab9-f61b30875b27)

    To include the findings with these recommendations, set **Include security findings** to **Yes**.

    :::image type="content" source="./media/continuous-export/include-security-findings-toggle.png" alt-text="Screenshot that shows the Include security findings toggle in a continuous export configuration." :::

1. Under **Export target**, choose where you'd like the data saved. Data can be saved in a target of a different subscription (for example, in a central Event Hubs instance or in a central Log Analytics workspace).

    You can also send the data to an [event hub or Log Analytics workspace in a different tenant](#export-data-to-an-event-hub-or-log-analytics-workspace-in-another-tenant).

1. Select **Save**.

> [!NOTE]
> Log Analytics supports only records that are up to 32 KB in size. When the data limit is reached, an alert displays the message **Data limit has been exceeded**.

### [REST API](#tab/rest-api)

### Set up continuous export by using the REST API

You can set up and manage continuous export by using the Microsoft Defender for Cloud [automations API](/rest/api/defenderforcloud/automations). Use this API to create or update rules for exporting to any of the following destinations:

- Azure Event Hubs
- Log Analytics workspace
- Azure Logic Apps

You also can send the data to an [event hub or Log Analytics workspace in a different tenant](#export-data-to-an-event-hub-or-log-analytics-workspace-in-another-tenant).

Here are some examples of options that you can use only in the API:

- **Greater volume**: You can create multiple export configurations on a single subscription by using the API. The **Continuous Export** page in the Azure portal supports only one export configuration per subscription.

- **Additional features**: The API offers parameters that aren't shown in the Azure portal. For example, you can add tags to your automation resource and define your export based on a wider set of alert and recommendation properties than the ones that are offered on the **Continuous export** page in the Azure portal.

- **Focused scope**: The API offers you a more granular level for the scope of your export configurations. When you define an export by using the API, you can define it at the resource group level. If you're using the **Continuous export** page in the Azure portal, you must define it at the subscription level.

    > [!TIP]
    > These API-only options are not shown in the Azure portal. If you use them, a banner informs you that other configurations exist.

### [Azure Policy](#tab/azure-policy)

<a name="configure-continuous-export-at-scale-using-the-supplied-policies"></a>

### Set up continuous export at scale by using provided policies

Automating your organization's monitoring and incident response processes can help you reduce the time it takes to investigate and mitigate security incidents.

To deploy your continuous export configurations across your organization, use the provided Azure Policy `DeployIfNotExist` policies to create and configure continuous export procedures.

To implement these policies:

1. In the following table, choose a policy to apply:

    |Goal  |Policy  |Policy ID  |
    |---------|---------|---------|
    |Continuous export to Event Hubs|[Deploy export to Event Hubs for Microsoft Defender for Cloud alerts and recommendations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fcdfcce10-4578-4ecd-9703-530938e4abcb)|cdfcce10-4578-4ecd-9703-530938e4abcb|
    |Continuous export to Log Analytics workspace|[Deploy export to Log Analytics workspace for Microsoft Defender for Cloud alerts and recommendations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fffb6f416-7bd2-4488-8828-56585fef2be9)|ffb6f416-7bd2-4488-8828-56585fef2be9|

    > [!TIP]
    > You can also find the policies by searching Azure Policy:
    >
    > 1. Open Azure Policy.
    >
    >    :::image type="content" source="./media/continuous-export/opening-azure-policy.png" alt-text="Screenshot that shows accessing Azure Policy.":::
    >
    > 1. On the Azure Policy menu, select **Definitions** and search for the policies by name.

1. On the relevant page in Azure Policy, select **Assign**.

    :::image type="content" source="./media/continuous-export/export-policy-assign.png" alt-text="Screenshot that shows assigning the Azure Policy.":::

1. Select each tab and set the parameters to meet your requirements:

    1. On the **Basics** tab, set the scope for the policy. To use centralized management, assign the policy to the management group that contains the subscriptions that use the continuous export configuration.

    1. On the **Parameters** tab, set the resource group and data type details.

        > [!TIP]
        > Each parameter has a tooltip that explains the options that are available.
        >
        > The Azure Policy **Parameters** tab (1) provides access to configuration options that are similar to options that you can access on the Defender for Cloud **Continuous export** page (2).
        >
        > :::image type="content" source="./media/continuous-export/azure-policy-next-to-continuous-export.png" alt-text="Screenshot that shows comparing the parameters in continuous export with Azure Policy." lightbox="./media/continuous-export/azure-policy-next-to-continuous-export.png":::
        >

    1. Optionally, to apply this assignment to existing subscriptions, select the **Remediation** tab, and then select the option to create a remediation task.

1. Review the summary page, and then select **Create**.

---

## Export to a Log Analytics workspace

If you want to analyze Microsoft Defender for Cloud data inside a Log Analytics workspace or use Azure alerts together with Defender for Cloud alerts, set up continuous export to your Log Analytics workspace.

### Log Analytics tables and schemas

Security alerts and recommendations are stored in the **SecurityAlert** and **SecurityRecommendation** tables respectively.

The name of the Log Analytics solution that contains these tables depends on whether you enabled the enhanced security features: Security (the Security and Audit solution) or SecurityCenterFree.

> [!TIP]
> To see the data on the destination workspace, you must enable one of these solutions: Security and Audit or SecurityCenterFree.

![Screenshot that shows the SecurityAlert table in Log Analytics.](./media/continuous-export/log-analytics-securityalert-solution.png)

To view the event schemas of the exported data types, see [Log Analytics table schemas](https://aka.ms/ASCAutomationSchemas).

## Export data to an event hub or Log Analytics workspace in another tenant

You *can't* configure data to be exported to a Log Analytics workspace in another tenant if you use Azure Policy to assign the configuration. This process works only when you use the REST API to assign the configuration, and the configuration is unsupported in the Azure portal (because it requires a multitenant context). Azure Lighthouse *doesn't* resolve this issue with Azure Policy, although you can use Azure Lighthouse as the authentication method.

When you collect data in a tenant, you can analyze the data from one, central location.

To export data to an event hub or Log Analytics workspace in a different tenant:

1. In the tenant that has the event hub or Log Analytics workspace, [invite a user](../active-directory/external-identities/what-is-b2b.md#easily-invite-guest-users-from-the-azure-portal) from the tenant that hosts the continuous export configuration, or you can configure Azure Lighthouse for the source and destination tenant.
1. If you use business-to-business (B2B) guest user access in Microsoft Entra ID, ensure that the user accepts the invitation to access the tenant as a guest.
1. If you use a Log Analytics workspace, assign the user in the workspace tenant one of these roles: Owner, Contributor, Log Analytics Contributor, Sentinel Contributor, or Monitoring Contributor.
1. Create and submit the request to the Azure REST API to configure the required resources. You must manage the bearer tokens in both the context of the local (workspace) tenant and the remote (continuous export) tenant.

## Continuously export to an event hub behind a firewall

You can enable continuous export as a trusted service so that you can send data to an event hub that has Azure Firewall enabled.

To grant access to continuous export as a trusted service:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to **Microsoft Defender for Cloud** > **Environmental settings**.

1. Select the relevant resource.

1. Select **Continuous export**.

1. Select **Export as a trusted service**.

    :::image type="content" source="media/continuous-export/export-as-trusted.png" alt-text="Screenshot that shows where the checkbox is located to select export as trusted service.":::

You must add the relevant role assignment to the destination event hub.

To add the relevant role assignment to the destination event hub:

1. Go to the selected event hub.

1. In the resource menu, select **Access control (IAM)** > **Add role assignment**.

    :::image type="content" source="media/continuous-export/add-role-assignment.png" alt-text="Screenshot that shows the Add role assignment button." lightbox="media/continuous-export/add-role-assignment.png":::

1. Select **Azure Event Hubs Data Sender**.

1. Select the **Members** tab.

1. Choose **+ Select members**.

1. Search for and then select **Windows Azure Security Resource Provider**.

    :::image type="content" source="media/continuous-export/windows-security-resource.png" alt-text="Screenshot that shows you where to enter and search for Microsoft Azure Security Resource Provider." lightbox="media/continuous-export/windows-security-resource.png":::

1. Select **Review + assign**.

## View exported alerts and recommendations in Azure Monitor

You might also choose to view exported security alerts or recommendations in [Azure Monitor](../azure-monitor/alerts/alerts-overview.md).

Azure Monitor provides a unified alerting experience for various Azure alerts, including a diagnostic log, metric alerts, and custom alerts that are based on Log Analytics workspace queries.

To view alerts and recommendations from Defender for Cloud in Azure Monitor, configure an alert rule that's based on Log Analytics queries (a log alert rule):

1. On the Azure Monitor **Alerts** page, select **New alert rule**.

    ![Screenshot that shows the Azure Monitor alerts page.](./media/continuous-export/azure-monitor-alerts.png)

1. On the **Create rule** pane, set up your new rule the same way you'd configure a [log alert rule in Azure Monitor](../azure-monitor/alerts/alerts-unified-log.md):

    - For **Resource**, select the Log Analytics workspace to which you exported security alerts and recommendations.

    - For **Condition**, select **Custom log search**. In the page that appears, configure the query, lookback period, and frequency period. In the search query, you can enter **SecurityAlert** or **SecurityRecommendation** to query the data types that Defender for Cloud continuously exports to as you enable the continuous export to Log Analytics feature.

    - Optionally, create an [action group](../azure-monitor/alerts/action-groups.md) to trigger. Action groups can automate sending an email, creating an ITSM ticket, running a webhook, and more, based on an event in your environment.

    ![Screenshot that shows the Azure Monitor create alert rule pane.](./media/continuous-export/azure-monitor-alert-rule.png)

The Defender for Cloud alerts or recommendations appear (depending on your configured continuous export rules and the condition that you defined in your Azure Monitor alert rule) in Azure Monitor alerts, with automatic triggering of an action group (if provided).

<a name="manual-one-time-export-of-alerts-and-recommendations"></a>

## Manually export alerts and recommendations

To download a CSV file that lists alerts or recommendations, go to the **Security alerts** page or the **Recommendations** page, and then select the **Download CSV report** button.

> [!TIP]
> Due to Azure Resource Graph limitations, the reports are limited to a file size of 13,000 rows. If you see errors related to too much data being exported, try limiting the output by selecting a smaller set of subscriptions to be exported.

:::image type="content" source="./media/continuous-export/download-alerts-csv.png" alt-text="Screenshot that shows how to download alerts data as a CSV file." lightbox="./media/continuous-export/download-alerts-csv.png":::

> [!NOTE]
> These reports contain alerts and recommendations for resources from the currently selected subscriptions.

## Related content

In this article, you learned how to configure continuous exports of your recommendations and alerts. You also learned how to download your alerts data as a CSV file.

To see related content:

- Learn more about [workflow automation templates](https://github.com/Azure/Azure-Security-Center/tree/master/Workflow%20automation).
- See the [Azure Event Hubs documentation](../event-hubs/index.yml).
- Learn more about [Microsoft Sentinel](../sentinel/index.yml).
- Review the [Azure Monitor documentation](../azure-monitor/index.yml).
- Learn how to [export data types schemas](https://aka.ms/ASCAutomationSchemas).
- Check out [common questions](faq-general.yml) about continuous export.
