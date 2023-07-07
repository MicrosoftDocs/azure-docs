---
title: Deploy the Microsoft Sentinel solution for Microsoft Power Platform 
description: Learn how to deploy the Microsoft Power Platform solution for Microsoft Sentinel.
ms.author: cwatson
author: cwatson-cat
ms.service: microsoft-sentinel
ms.topic: how-to
ms.date: 07/06/2023
#CustomerIntent: As a security engineer, I want to ingest Power Platform activity logs into Microsoft Sentinel for security monitoring, detect related threats, and respond to incidents.
---

# Deploy the Microsoft Sentinel solution for Microsoft Power Platform 

The Microsoft Sentinel solution for Power Platform allows you to monitor and detect suspicious or malicious activities in your Power Platform environment. The solution collects activity logs from different Power Platform components and inventory data. It analyzes those activity logs to detect threats and suspicious activities like the following:

- Power Apps execution from unauthorized geographies
- Suspicious data destruction by Power Apps
- Mass deletion of Power Apps
- Phishing attacks made possible through Power Apps
- Power Automate flows activity by departing employees
- Microsoft Power Platform connectors added to the an environment, and the
- Update or removal of Microsoft Power Platform data loss prevention policies

The Microsoft Sentinel Solution for Power Platform ingests and cross-correlates activity logs and inventory data from multiple sources. So, the solution requires that you enable 6 connectors that are available as part of the solution.


|Connector name  |Data collected  |Log Analytics tables |
|---------|---------|---------|
|Power Platform Inventory (using Azure Functions)   |  Power Apps and Power Automate inventory data       |   PowerApps_CL, PowerPlatrformEnvironments_CL      |
|Microsoft Power Apps (Preview)   |    Power Apps activity logs     |  PowerAppsActivity       |
|Microsoft Power Automate (Preview)     |  Power Automate activity logs       |   PowerAutomateActivity      |
|Microsoft Power Platform Connectors (Preview)    |   Power Platform connector activity logs      |     PowerPlatformConnectorActivity    |
|Microsoft Power Platform DLP (Preview)     |     Data loss prevention activity logs   |    PowerPlatformDlpActivity     |
|Dynamics 365   |    Dataverse and model-driven apps activity logging     |   Dynamics365Activity      |

> [!IMPORTANT]
> The Microsoft Sentinel solution for Power Platform is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- The Microsoft Sentinel solution is enabled.
- You have a defined Microsoft Sentinel workspace and have read and write permissions to the workspace.
- Your organization uses Power Platform to create and use Power Apps.
- You can create an Azure Function App with the `Microsoft.Web/Sites`, `Microsoft.Web/ServerFarms`, `Microsoft.Insights/Components`, and `Microsoft.Storage/StorageAccounts` permissions.
- You can create [Data Collection Rules/Endpoints](../../azure-monitor/essentials/data-collection-rule-overview.md) with the permissions to: 
    - `Microsoft.Insights/DataCollectionEndpoints`, and `Microsoft.Insights/DataCollectionRules`.
    - Assign the Monitoring Metrics Publisher role to the Azure Function. 

<!--


As the Power Platform connectors leverage the Microsoft Purview auditing capabilities, verify that audit logging is enabled in Microsoft Purview: Turn auditing on or off - Microsoft Purview (compliance) | Microsoft Learn

Not sure if you can do all/some of this as you install the Power Platform inventory or if you should do before:

Create a an ADLSv2 Storage Account: Refer to the ADLSv2 quickstart guide for details. This storage account is to be used by Power Platform Self Service Analytics.

 Collect blob service endpoint URL: Refer to the Azure Storage documentation for details. Take note of the blob service URL for use in ARM deployment e.g. https://<storage_account_name>.blob.core.windows.net

Configure Power Platform self-service analytics: Refer to the Power Platform guide for details. Configure the data export process to use the storage account created in the previous step. Configure data export both for Power Apps and for Power Automate. This process can take up to 48 hours to fully activate.
-->

## Install the Power Platform solution in Microsoft Sentinel

Install the solution from the content hub in Microsoft Sentinel by using the following steps.

1. In the Azure portal, search for and select **Microsoft Sentinel**.
1. Under **Content management**, select **Content hub**.
1. Search for and select **Power Platform**.
1. Select **View details**.
1. On the solution details page, select **Create**.
1. On the **Basics** tab, enter the subscription, resource group, and workspace to deploy the solution.
1. Select **Review + create** > **Create** to deploy the solution.

## Verify audit logging is enabled for Microsoft Purview

<!-- Make this a prereq? "It may take up to 60 minutes for the change to take effect." -->

## Enable the data connectors

In Microsoft Sentinel, enable the six data connectors to collect activity logs and inventory data from the Power Platform components.

### Power Platform inventory data connector

Configure and connect the Power Platform inventory data connector to collect Power Apps and Power Automate inventory data.


1. In Microsoft Sentinel, under **Configuration**, select **Data connectors**.
1. Search for and select **Power Platform Inventory**.
1. Select **Open connector page**... 

<!-- More steps but unclear what need to set up before you get to this point (what's prereq). Need subscription added to preview and to use preview flag to walk through steps.-->

### Power Apps data connector

Connect the data connector for Power Apps to collect Power Apps activity logs.

1. In Microsoft Sentinel, under **Configuration**, select **Data connectors**.
1. Search for and select **Microsoft Power Apps (Preview)**.
1. Select **Open connector page** > **Connect**.

### Power Platform Connectors data connector

<!-- Consider collapsing these into one section if they're as simple as connecting with no different instructions-->

Connect the data connector for Power Platform  to collect Power Platform connector activity logs.

1. In Microsoft Sentinel, under **Configuration**, select **Data connectors**.
1. Search for and select **Microsoft Power Platform Connectors**.
1. Select **Open connector page** > **Connect**.

### Power Platform data loss prevention data connector

Connect the data connector for Power Platform DLP to collect data loss prevention activity logs.

1. In Microsoft Sentinel, under **Configuration**, select **Data connectors**.
1. Search for and select **Microsoft Power Platform DLP**.
1. Select **Open connector page** > **Connect**.

### Dynamics 365 data connector

Connect the data connector for Dynamics 365 to collect dataverse and model-driven apps activity logs.

1. In Microsoft Sentinel, under **Configuration**, select **Data connectors**.
1. Search for and select **Dynamics365**.
1. Select **Open connector page** > **Connect**.

## Enable auditing in your Power Platform environment

Enable auditing at the global level for Power Platform and for each dataverse entity.

### Audit at the global level

In your Power Platform environment, go to **Settings** > **Audit settings**. Under **Auditing**, select all three checkboxes.

- **Start auditing**
- **Log access**
- **Read logs**

For more information about these steps, see [Manage Dataverse auditing](/power-platform/admin/manage-dataverse-auditing#startstop-auditing-for-an-environment-and-set-retention-policy).

### Audit dataverse entities

Enable detailed auditing on each of the dataverse entities. Do this automatically by importing a Power Platform managed solution or manually by enabling details auditing on each of the entities.

<!--Totally lost. What section in the existing PP articles does the manual enablement align to? The automated way doesn't seem safe (download a zip file?!) -->

In your Power Platform environment, go to **Settings** > **Audit settings**...

For more information about these steps, see [Manage Dataverse auditing](/power-platform/admin/manage-dataverse-auditing#enable-or-disable-entities-and-fields-for-auditing).

## Verify that the data connector is ingesting logs to Microsoft Sentinel

To verify that log ingestion is working, complete the following steps.

### Generate activity and inventory logs

1. Run activities like create, update, and delete to generage logs for data that you enabled for monitoring.
1. Wait up to 60 minutes for Microsoft Sentinel to ingest the activity logs to the logs table in the workspace.
1. For Power Platform inventory data, wait up to 24 hours for Microsoft Sentinel to ingest the data to the log tables in the workspace.

### View ingested data in Microsoft Sentinel

After you've waited for Microsoft Sentinel to ingest the data, complete the following steps to verify you get the data you expect.

1. In Microsoft Sentinel, select **Logs**.
1. Run KQL queries against the tables that collect the activity logs from the data connectors. For example, run the following query to return 50 rows from the table with the Power Apps activity logs.

   ```kusto
    PowerAppsActivity
    | take 50
    ```

   The following table lists the the Log Analytics tables to query. 
   |Log Analytics tables |Data collected |
   |---------|---------|
   |PowerApps_CL, PowerPlatrformEnvironments_CL |Power Apps activity logs     |
   |PowerAppsActivity |Power Apps and Power Automate inventory data |  
   |PowerAutomateActivity |Power Automate activity logs  |
   |PowerPlatformConnectorActivity |Power Platform connector activity logs |
   |PowerPlatformDlpActivity |Data loss prevention activity logs   |
   |Dynamics365Activity |Dataverse and model-driven apps activity logging     |  
1. Verify that the results for each table show the activities you generated.

## Next steps

In this article, you learned how to deploy the Microsoft Sentinel solution for Power Platform.

For more information about how to manage the solution components and enable security content, see [Discover and deploy out-of-the-box content](../sentinel-solutions-deploy.md).