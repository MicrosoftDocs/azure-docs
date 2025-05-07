---
title: Configure Microsoft Sentinel content
description: In this step of your deployment, you configure the Microsoft Sentinel security content, like your data connectors, analytics rules, automation rules, and more.
author: cwatson-cat
ms.topic: how-to
ms.date: 07/05/2023
ms.author: cwatson


#Customer intent: As a security engineer, I want to configure Microsoft Sentinel security content so that analysts can detect, monitor, and respond to security threats effectively.

---

# Configure Microsoft Sentinel content

In the previous deployment step, you enabled Microsoft Sentinel, health monitoring, and the required solutions. In this article, you learn how to configure the different types of Microsoft Sentinel security content, which allow you to detect, monitor, and respond to security threats across your systems. This article is part of the [Deployment guide for Microsoft Sentinel](deploy-overview.md).

## Configure your security content

| Step | Description |
| ---- | ----------- |
| **Set up data connectors** | Based on the [data sources you selected when you planned your deployment](prioritize-data-connectors.md), and after [enabling the relevant solutions](enable-sentinel-features-content.md), you can now install or set up your data connectors.<br><br>- If you're using an existing connector, [find your connector](data-connectors-reference.md) from this full list of data connectors.<br>- If you're creating a custom connector, use [these resources](create-custom-connector.md).<br>- If you're setting up a connector to ingest CEF or Syslog logs, review these [options](connect-cef-syslog-options.md). |
| **Set up analytics rules** | After you've set up Microsoft Sentinel to collect data from all over your organization, you can begin using [analytics rules](threat-detection.md) to detect threats. Select the steps you need to set up and configure your analytics rules:<br><br>- Create scheduled rules [from templates](create-analytics-rule-from-template.md) or [from scratch](create-analytics-rules.md): Create analytics rules to help discover threats and anomalous behaviors in your environment.<br>- [Map data fields to entities](map-data-fields-to-entities.md): Add or change entity mappings in an analytics rule.<br>- [Surface custom details in alerts](surface-custom-details-in-alerts.md): Add or change custom details in an analytics rule.<br>- [Customize alert details](customize-alert-details.md): Override the default properties of alerts with content from the underlying query results.<br>- [Export and import analytics rules](import-export-analytics-rules.md): Export your analytics rules to Azure Resource Manager (ARM) template files, and import rules from these files. The export action creates a JSON file in your browser's downloads location, that you can then rename, move, and otherwise handle like any other file.<br>- [Create near-real-time (NRT) detection analytics rules](create-nrt-rules.md): Create near-time analytics rules for up-to-the-minute threat detection out-of-the-box. This type of rule was designed to be highly responsive by running its query at intervals just one minute apart.<br>- [Work with anomaly detection analytics rules](work-with-anomaly-rules.md): Work with built-in anomaly templates that use thousands of data sources and millions of events, or change thresholds and parameters for the anomalies within the user interface.<br>- [Manage template versions for your scheduled analytics rules](manage-analytics-rule-templates.md): Track the versions of your analytics rule templates, and either revert active rules to existing template versions, or update them to new ones.<br>- [Handle ingestion delay in scheduled analytics rules](ingestion-delay.md): Learn how ingestion delay might impact your scheduled analytics rules and how you can fix them to cover these gaps.          |
| **Set up automation rules** | [Create automation rules](create-manage-use-automation-rules.md). Define the triggers and conditions that determine when your [automation rule](automate-incident-handling-with-automation-rules.md) runs, the various actions that you can have the rule perform, and the remaining features and functionalities.    |
| **Set up playbooks** | A [playbook](automate-responses-with-playbooks.md) is a collection of remediation actions that you run from Microsoft Sentinel as a routine, to help automate and orchestrate your threat response. To set up playbooks:<br><br>- Review [recommended playbooks](automate-responses-with-playbooks.md#recommended-playbooks)<br>- [Create playbooks from templates](use-playbook-templates.md): A playbook template is a prebuilt, tested, and ready-to-use workflow that can be customized to meet your needs. Templates can also serve as a reference for best practices when developing playbooks from scratch, or as inspiration for new automation scenarios.<br>- Review these [steps for creating a playbook](automate-responses-with-playbooks.md#steps-for-creating-a-playbook) |
| **Set up workbooks** | [Workbooks](monitor-your-data.md) provide a flexible canvas for data analysis and the creation of rich visual reports within Microsoft Sentinel. Workbook templates allow you to quickly gain insights across your data as soon as you connect a data source. To set up workbooks:<br><br>- Review [commonly used Microsoft Sentinel workbooks](top-workbooks.md)<br>- [Use existing workbook templates available with packaged solutions](monitor-your-data.md)<br>- [Create custom workbooks across your data](monitor-your-data.md#create-new-workbook) |
| **Set up watchlists** | [Watchlists](watchlists.md) allow you to correlate data from a data source you provide with the events in your Microsoft Sentinel environment. To set up watchlists:<br><br>- [Create watchlists](watchlists-create.md)<br>- [Build queries or detection rules with watchlists](watchlists-queries.md): Query data in any table against data from a watchlist by treating the watchlist as a table for joins and lookups. When you create a watchlist, you define the SearchKey. The search key is the name of a column in your watchlist that you expect to use as a join with other data or as a frequent object of searches. |

## Next steps

In this article, you learned how to configure the different types of Microsoft Sentinel security content.

> [!div class="nextstepaction"]
>>[Set up multiple workspaces](use-multiple-workspaces.md)
