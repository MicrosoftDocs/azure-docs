---
title: Understand threat intelligence in Azure Sentinel | Microsoft Docs
description:  Understand how threat intelligence feeds are connected to, managed, and used in Azure Sentinel to analyze data, detect threats, and enrich alerts.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/12/2021
ms.author: yelevin

---
# Understand threat intelligence in Azure Sentinel

## Introduction to threat intelligence

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

Cyber threat intelligence (CTI) is information describing known existing or potential threats to systems and users. This type of information takes many forms, from written reports detailing a particular threat actor’s motivations, infrastructure, and techniques, to specific observations of IP addresses, domains, file hashes, and other artifacts associated with known cyber threats. CTI is used by organizations to provide essential context to unusual activity, so that security personnel can quickly take action to protect their people, information, and other assets. CTI can be sourced from many places, such as open-source data feeds, threat intelligence-sharing communities, commercial intelligence feeds, and local intelligence gathered in the course of security investigations within an organization.

Within a Security Information and Event Management (SIEM) solution like Azure Sentinel, the most commonly used form of CTI is threat indicators, also known as Indicators of Compromise or IoCs. Threat indicators are data that associate observed artifacts such as URLs, file hashes, or IP addresses with known threat activity such as phishing, botnets, or malware. This form of threat intelligence is often called tactical threat intelligence because it can be applied to security products and automation in large scale to detect potential threats to an organization and protect against them. In Azure Sentinel, you can use threat indicators to help detect malicious activity observed in your environment and provide context to security investigators to help inform response decisions.

You can integrate threat intelligence (TI) into Azure Sentinel through the following activities:

- **Import threat intelligence** into Azure Sentinel by enabling **data connectors** to various TI [platforms](connect-threat-intelligence-tip.md) and [feeds](connect-threat-intelligence-taxii.md).
- **View and manage** the imported threat intelligence in **Logs** and in the **Threat Intelligence** blade of Azure Sentinel.
- **Detect threats** and generate security alerts and incidents using the built-in **Analytics** rule templates based on your imported threat intelligence.
- **Visualize key information** about your imported threat intelligence in Azure Sentinel with the **Threat Intelligence workbook**.


Threat Intelligence also provides useful context within other Azure Sentinel experiences such as **Hunting** and **Notebooks**, and while not covered in this article, these experiences are addressed in Ian Hellen's excellent blog post on [Jupyter Notebooks in Azure Sentinel](https://techcommunity.microsoft.com/t5/azure-sentinel/using-threat-intelligence-in-your-jupyter-notebooks/ba-p/860239), which covers the use of CTI within Notebooks.

## Import threat intelligence with data connectors

Just like all the other event data in Azure Sentinel, threat indicators are imported using data connectors. There are two data connectors in Azure Sentinel provided specifically for threat indicators, **Threat Intelligence - TAXII** for industry-standard STIX/TAXII feeds and **Threat Intelligence Platforms** for integrated and curated TI feeds. You can use either data connector alone, or both connectors together, depending on where your organization sources threat indicators. 

See this catalog of [threat intelligence integrations](threat-intelligence-integration.md) available with Azure Sentinel.

### Adding threat indicators to Azure Sentinel with the Threat Intelligence Platforms data connector

Many organizations use threat intelligence platform (TIP) solutions to aggregate threat indicator feeds from a variety of sources, to curate the data within the platform, and then to choose which threat indicators to apply to various security solutions such as network devices, EDR/XDR solutions, or SIEMs such as Azure Sentinel. If your organization uses an [integrated TIP solution](connect-threat-intelligence-tip.md), the **Threat Intelligence Platforms data connector** allows you to use your TIP to import threat indicators into Azure Sentinel. 

Because the TIP data connector works with the [Microsoft Graph Security tiIndicators API](/graph/api/resources/tiindicator) to accomplish this, it can also be used by any custom threat intelligence platform that communicates with the tiIndicators API to send indicators to Azure Sentinel (and to other Microsoft security solutions like Microsoft 365 Defender).

:::image type="content" source="media/import-threat-intelligence/threat-intel-import-path.png" alt-text="Threat intelligence import path":::

For more information on the TIP solutions integrated with Azure Sentinel, see [Integrated threat intelligence platform products](threat-intelligence-integration.md#integrated-threat-intelligence-platform-products).

These are the main steps you need to follow to import threat indicators to Azure Sentinel from your integrated TIP or custom threat intelligence solution:

1. Obtain an **Application ID** and **Client Secret** from your Azure Active Directory

1. Input this information into your TIP solution or custom application

1. Enable the Threat Intelligence Platforms data connector in Azure Sentinel

For a detailed look at each of these steps, see [Connect your threat intelligence platform to Azure Sentinel](connect-threat-intelligence-tip.md).


### Adding threat indicators to Azure Sentinel with the Threat Intelligence - TAXII data connector

The most widely-adopted industry standard for the transmission of threat intelligence is a [combination of the STIX data format and the TAXII protocol](https://oasis-open.github.io/cti-documentation/). If your organization obtains threat indicators from solutions that support the current STIX/TAXII version (2.0 or 2.1), you can use the **Threat Intelligence - TAXII** data connector to bring your threat indicators into Azure Sentinel. The Threat Intelligence - TAXII data connector enables a built-in TAXII client in Azure Sentinel to import threat intelligence from TAXII 2.x servers.

:::image type="content" source="media/import-threat-intelligence/threat-intel-taxii-import-path.png" alt-text="TAXII import path":::
 
Follow these steps to import STIX formatted threat indicators to Azure Sentinel from a TAXII server:

1. Obtain the TAXII server API Root and Collection ID

1. Enable the Threat Intelligence - TAXII data connector in Azure Sentinel

Now let’s take a detailed look at each of these steps.

#### Obtain the TAXII server API Root and Collection ID

TAXII 2.x servers advertise API Roots, which are URLs that host Collections of threat intelligence. Most often the API Root can be obtained via the documentation page of the threat intelligence provider hosting the TAXII server. However, sometimes the only information advertised is a URL known as a Discovery Endpoint. If this is the case, it is easy to find the API Root using the Discovery Endpoint. If you already know the TAXII server API Root and Collection IDs you want to work with, feel free to skip to the next section, **Enable the Threat Intelligence - TAXII data connector in Azure Sentinel**.

Let’s look at an actual example of how to use a simple command line utility called [cURL](https://en.wikipedia.org/wiki/CURL), which is provided in Windows and most Linux distributions, to discover the API Root and browse the Collections of a TAXII server starting only from the discovery endpoint. For this example, we’ll use the discovery endpoint of the [Anomali Limo](https://www.anomali.com/community/limo) ThreatStream TAXII 2.0 server.

1.	From a browser, navigate to the [ThreatStream TAXII 2.0 server discovery endpoint](https://limo.anomali.com/taxii) to retrieve the API Root. Authenticate with the user and password `guest`.

    ```json
    {
        "api_roots":
        [
            "https://limo.anomali.com/api/v1/taxii2/feeds/",
            "https://limo.anomali.com/api/v1/taxii2/trusted_circles/",
            "https://limo.anomali.com/api/v1/taxii2/search_filters/"
        ],
        "contact": "info@anomali.com",
        "default": "https://limo.anomali.com/api/v1/taxii2/feeds/",
        "description": "TAXII 2.0 Server (guest)",
        "title": "ThreatStream Taxii 2.0 Server"
    }
    ```

2.	Use the cURL utility and the API Root (https://limo.anomali.com/api/v1/taxii2/feeds/) from the previous step to browse the list of Collection IDs hosted on the API Root

    ```json
    curl -u guest https://limo.anomali.com/api/v1/taxii2/feeds/collections/
    {
        "collections":
        [
            {
                "can_read": true,
                "can_write": false,
                "description": "",
                "id": "107",
                "title": "Phish Tank"
            },
            {
                "can_read": true,
                "can_write": false,
                "description": "",
                "id": "135",
                "title": "Abuse.ch Ransomware IPs"
            },
            {
                "can_read": true,
                "can_write": false,
                "description": "",
                "id": "136",
                "title": "Abuse.ch Ransomware Domains"
            },
            {
                "can_read": true,
                "can_write": false,
                "description": "",
                "id": "150",
                "title": "DShield Scanning IPs"
            },
            {
                "can_read": true,
                "can_write": false,
                "description": "",
                "id": "200",
                "title": "Malware Domain List - Hotlist"
            },
            {
                "can_read": true,
                "can_write": false,
                "description": "",
                "id": "209",
                "title": "Blutmagie TOR Nodes"
            },
            {
                "can_read": true,
                "can_write": false,
                "description": "",
                "id": "31",
                "title": "Emerging Threats C&C Server"
            },
            {
                "can_read": true,
                "can_write": false,
                "description": "",
                "id": "33",
                "title": "Lehigh Malwaredomains"
            },
            {
                "can_read": true,
                "can_write": false,
                "description": "",
                "id": "41",
                "title": "CyberCrime"
            },
            {
                "can_read": true,
                "can_write": false,
                "description": "",
                "id": "68",
                "title": "Emerging Threats - Compromised"
            }
        ]
    }
    ```

You now have all the information you need to connect Azure Sentinel to one or more TAXII server Collections provided by Anomali Limo.

| **API Root** (https://limo.anomali.com/api/v1/taxii2/feeds/) | Collection ID |
| ------------------------------------------------------------ | ------------: |
| **Phish Tank**                                               | 107           |
| **Abuse.ch Ransomware IPs**                                  | 135           |
| **Abuse.ch Ransomware Domains**                              | 136           |
| **DShield Scanning IPs**                                     | 150           |
| **Malware Domain List - Hotlist**                            | 200           |
| **Blutmagie TOR Nodes**                                      | 209           |
| **Emerging Threats C&C Server**                              |  31           |
| **Lehigh Malwaredomains**                                    |  33           |
| **CyberCrime**                                               |  41           |
| **Emerging Threats - Compromised**                           |  68           |
|

#### Enable the Threat Intelligence - TAXII data connector in Azure Sentinel

To import threat indicators into Azure Sentinel from a TAXII server, follow these steps:

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Azure Sentinel** service.

1. Choose the **workspace** to which you want to import threat indicators from the TAXII server.

1. Select **Data connectors** from the menu, select **Threat Intelligence - TAXII** from the connectors gallery, and click the **Open connector page** button.

1. Type a **name** for this TAXII server Collection, **API Root URL**, **Collection ID**, **Username** (if required), and **Password** (if required), and click the **Add** button.

    :::image type="content" source="media/import-threat-intelligence/threat-intel-configure-taxii-servers.png" alt-text="Configure TAXII servers":::
 
You should receive confirmation that a connection to the TAXII server was established successfully, and you may repeat step (4) above as many times as desired to connect to multiple Collections from the same or different TAXII servers.

## View your threat indicators in Azure Sentinel

Now that you’ve successfully imported threat indicators into Azure Sentinel using either the **Threat Intelligence Platforms** and/or the **Threat Intelligence - TAXII** data connector, you can view them in the **ThreatIntelligenceIndicator** table in **Logs** which is where all your Azure Sentinel event data is stored. This table is the basis for queries performed by other Azure Sentinel features such as Analytics and Workbooks. Here's how to find and view your threat indicators in the **ThreatIntelligenceIndicator** table.

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Azure Sentinel** service.

1. Choose the **workspace** to which you’ve imported threat indicators using either threat intelligence data connector.

1. Select **Logs** from the **General** section of the Azure Sentinel menu.

1. The **ThreatIntelligenceIndicator** table is located under the **Azure Sentinel** group.

1. Select the **Preview data** icon (the eye) next to the table name and select the **See in query editor** button to execute a query which will show records from this table.

Your results should look similar to the sample threat indicator shown below:

:::image type="content" source="media/import-threat-intelligence/threat-intel-sample-query.png" alt-text="Sample query data":::
 
## Manage your threat indicators in the new Threat Intelligence area of Azure Sentinel

With the new **Threat Intelligence** area, accessible from the Azure Sentinel menu, you can also view, sort, filter, and search your imported threat indicators without even writing a **Logs** query. This new area also allows you to create threat indicators directly within the Azure Sentinel interface, as well as perform common threat intelligence administrative tasks like indicator tagging and creating new indicators related to security investigations.
Let’s look at two of the most common tasks, creating new threat indicators and tagging indicators for easy grouping and reference.

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Azure Sentinel** service.

1. Choose the **workspace** to which you’ve imported threat indicators using either threat intelligence data connector.

1. Select **Threat Intelligence** from the Threat Management section of the Azure Sentinel menu.

1. Select the **Add new** button from the top menu of the page.

    :::image type="content" source="media/import-threat-intelligence/threat-intel-add-new-indicator.png" alt-text="Add a new threat indicator" lightbox="media/import-threat-intelligence/threat-intel-add-new-indicator.png":::

1. Choose the indicator type, then complete the required fields marked with a red asterisk (*) on the **New indicator** panel.

1. Select **Apply**. The indicator is added to the Indicators grid, and is also sent to the ThreatIntelligenceIndicator table in **Logs**.

Tagging threat indicators is an easy way to group them together to make them easier to find. Typically, you might apply a tag to indicators related to a particular incident, or to indicators representing threats from a particular known actor or a well known attack campaign. You can tag threat indicators individually, or multi-select indicators and tag them all at once. Shown below is an example of tagging multiple indicators with an incident ID. Since tagging is free-form, a recommended practice is to create standard naming conventions for threat indicator tags. You can apply multiple tags to each indicator.

:::image type="content" source="media/import-threat-intelligence/threat-intel-tagging-indicators.png" alt-text="Apply tags to threat indicators" lightbox="media/import-threat-intelligence/threat-intel-tagging-indicators.png":::

## Analytics puts your threat indicators to work detecting potential threats

You’ve got your threat indicators fed into Azure Sentinel; you've seen how to view and manage them; now see what they can do for you. The most important use case for threat indicators in SIEM solutions like Azure Sentinel is to power analytics rules.  These indicator-based rules compare raw events from your data sources against your threat indicators to detect security threats in your organization. In Azure Sentinel **Analytics**, you create analytics rules that run on a scheduled basis and generate security alerts. The rules are driven by queries, along with configurations that determine how often the rule should run, what kind of query results should generate security alerts, and any automated responses to trigger when alerts are generated.

While you can always create new analytics rules from scratch, Azure Sentinel provides a set of built-in rule templates, created by Microsoft security engineers, that you can use as-is or modify to meet your needs. You can readily identify the rule templates that use threat indicators, as they are all titled beginning with "**TI map**…". All these rule templates operate similarly, with the only difference being which type of threat indicators are used (domain, email, file hash, IP address, or URL) and which event type to match against. Each template lists the required data sources needed for the rule to function, so you can see at a glance if you have the necessary events already imported in Azure Sentinel.

Let’s take a look at one of these rule templates and walk through how to enable and configure the rule to generate security alerts using the threat indicators you’ve imported into Azure Sentinel. For this example, we’ll use the rule template called **TI map IP entity to AzureActivity**. This rule will match any IP address-type threat indicator with all your Azure Activity events. When a match is found, an **alert** will be generated, as well as a corresponding **incident** for investigation by your security operations team. This analytics rule will operate successfully only if you have enabled one or both of the **Threat Intelligence** data connectors (to import threat indicators) and the **Azure Activity** data connector (to import your Azure subscription-level events).

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Azure Sentinel** service.

1. Choose the **workspace** to which you imported threat indicators using the **Threat Intelligence** data connectors and Azure activity data using the **Azure Activity** data connector.

1. Select **Analytics** from the **Configuration** section of the Azure Sentinel menu.

1. Select the **Rule templates** tab to see the list of available analytics rule templates.

1. Navigate to the rule titled **TI map IP entity to AzureActivity** and ensure you have connected all the required data sources as shown below.

    :::image type="content" source="media/import-threat-intelligence/threat-intel-required-data-sources.png" alt-text="Required data sources":::

1. Select this rule and select the **Create rule** button. This opens a wizard to configure the rule. Complete the settings here and select the **Next: Set rule logic >** button.

    :::image type="content" source="media/import-threat-intelligence/threat-intel-create-analytics-rule.png" alt-text="Create analytics rule":::

1. The rule logic portion of the wizard contains:
    - The query which will be used in the rule.

    - Entity mappings, which tell Azure Sentinel how to recognize entities like Accounts, IP addresses, and URLs, so that **incidents** and **investigations** understand how to work with the data in any security alerts generated by this rule.

    - The schedule to run this rule.

    - The number of query results needed before a security alert is generated.

    The default settings in the template are:
    - Run once an hour.

    - Match any IP address threat indicators from the **ThreatIntelligenceIndicator** table with any IP address found in the last one hour of events from the **AzureActivity** table.

    - Generate a security alert if the query results are greater than zero, meaning if any matches are found.

You can leave the default settings or change any of these to meet your requirements. When you are finished, select the **Next: Automated response >** button

1. This step of the wizard allows you to configure any automation you’d like to trigger when a security alert is generated from this analytics rule. Automation in Azure Sentinel is done using **Playbooks**, powered by Azure Logic Apps. To learn more, see this [Tutorial: Set up automated threat responses in Azure Sentinel](./tutorial-respond-threats-playbook.md). For this example, we will just select the **Next: Review >** button to continue.

1. This last step validates the settings in your rule. When you are ready to enable the rule, select the **Create** button and you are finished.

Now that you have enabled your analytics rule, you can find your enabled rule in the **Active rules** tab of the **Analytics** section of Azure Sentinel. You can edit, enable, disable, duplicate or delete the active rule from there. The new rule runs immediately upon activation, and from then on will run on its defined schedule.

According to the default settings, each time the rule runs on its schedule, any results found will generate a security alert. Security alerts in Azure Sentinel can be viewed in the **Logs** section of Azure Sentinel, in the **SecurityAlert** table under the **Azure Sentinel** group.

In Azure Sentinel, the alerts generated from analytics rules also generate security incidents which can be found in **Incidents** under **Threat Management** on the Azure Sentinel menu. Incidents are what your security operations teams will triage and investigate to determine the appropriate response actions. You can find detailed information in this [Tutorial: Investigate incidents with Azure Sentinel](./tutorial-investigate-cases.md).

## Workbooks provide insights about your threat intelligence

Finally, you can use an Azure Sentinel Workbook to visualize key information about your threat intelligence in Azure Sentinel, and you can easily customize the workbooks according to your business needs.
Let’s walk through how to find the threat intelligence workbook provided in Azure Sentinel, and we will also show how to make edits to the workbook to customize it.

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Azure Sentinel** service.

1. Choose the **workspace** to which you’ve imported threat indicators using either threat intelligence data connector.

1. Select **Workbooks** from the **Threat management** section of the Azure Sentinel menu.

1. Navigate to the workbook titled **Threat Intelligence** and verify you have data in the **ThreatIntelligenceIndicator** table as shown below.

    :::image type="content" source="media/import-threat-intelligence/threat-intel-verify-data.png" alt-text="Verify data":::
 
1. Select the **Save** button and choose an Azure location to store the workbook. This step is required if you are going to modify the workbook in any way and save your changes.

1. Now select the **View saved workbook** button to open the workbook for viewing and editing.

1. You should now see the default charts provided by the template. Now let’s make some changes to one of the charts. Select the **Edit** button at the top of the page to enter editing mode for the workbook.

1. Let’s add a new chart of threat indicators by threat type. Scroll to the bottom of the page and select Add Query.

1. Add the following text to the **Log Analytics workspace Log Query** text box:
    ```kusto
    ThreatIntelligenceIndicator
    | summarize count() by ThreatType
    ```

1. In the **Visualization** drop-down, select **Bar chart**.

1. Select the **Done editing** button. You’ve created a new chart for your workbook.

    :::image type="content" source="media/import-threat-intelligence/threat-intel-bar-chart.png" alt-text="Bar chart":::

Workbooks provide powerful interactive dashboards that give you insights into all aspects of Azure Sentinel. There is a whole lot you can do with workbooks, and while the provided templates are a great starting point, you will likely want to dive in and customize these templates, or create new dashboards combining many different data sources so you can visualize your data in unique ways. Since Azure Sentinel workbooks are based on Azure Monitor workbooks, there is already extensive documentation available, and many more templates. A great place to start is this article on how to [Create interactive reports with Azure Monitor workbooks](../azure-monitor/visualize/workbooks-overview.md). 

There is also a rich community of [Azure Monitor workbooks on GitHub](https://github.com/microsoft/Application-Insights-Workbooks) where you can download additional templates and contribute your own templates.

## Next steps
In this document, you learned about the threat intelligence capabilities of Azure Sentinel, and the new Threat Intelligence blade. For practical guidance on using Azure Sentinel's threat intelligence capabilities, see the following articles:

- [Connect threat intelligence data](./connect-threat-intelligence.md) to Azure Sentinel.
- [Integrate TIP platforms, TAXII feeds, and enrichments](threat-intelligence-integration.md) with Azure Sentinel.
- Create [built-in](./tutorial-detect-threats-built-in.md) or [custom](./tutorial-detect-threats-custom.md) alerts, and [investigate](./tutorial-investigate-cases.md) incidents, in Azure Sentinel.