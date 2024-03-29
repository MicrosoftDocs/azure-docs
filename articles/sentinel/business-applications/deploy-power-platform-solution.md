---
title: Deploy the Microsoft Sentinel solution for Microsoft Power Platform 
description: Learn how to deploy the Microsoft Power Platform solution for Microsoft Sentinel.
ms.author: bagol
author: batamig
ms.service: microsoft-sentinel
ms.topic: how-to
ms.date: 02/28/2024
#CustomerIntent: As a security engineer, I want to ingest Power Platform activity logs into Microsoft Sentinel for security monitoring, detect related threats, and respond to incidents.
---

# Deploy the Microsoft Sentinel solution for Microsoft Power Platform 

The Microsoft Sentinel solution for Power Platform allows you to monitor and detect suspicious or malicious activities in your Power Platform environment. The solution collects activity logs from different Power Platform components and inventory data. For more information, see [Microsoft Sentinel solution for Microsoft Power Platform overview](power-platform-solution-overview.md).
 
> [!IMPORTANT]
> - The Microsoft Sentinel solution for Power Platform is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> - The solution is a premium offering. Pricing information will be available before the solution becomes generally available.
> - Provide feedback for this solution by completing this survey: [https://aka.ms/SentinelPowerPlatformSolutionSurvey](https://aka.ms/SentinelPowerPlatformSolutionSurvey).

## Prerequisites

- The Microsoft Sentinel solution is enabled.
- You have a defined Microsoft Sentinel workspace and have read and write permissions to the workspace.
- Your organization uses Power Platform to create and use Power Apps.
- You can create an Azure Function App with the `Microsoft.Web/Sites`, `Microsoft.Web/ServerFarms`, `Microsoft.Insights/Components`, and `Microsoft.Storage/StorageAccounts` permissions.
- You can create [Data Collection Rules/Endpoints](/azure/azure-monitor/essentials/data-collection-rule-overview) with the permissions to: 
    - `Microsoft.Insights/DataCollectionEndpoints`, and `Microsoft.Insights/DataCollectionRules`.
    - Assign the Monitoring Metrics Publisher role to the Azure Function. 
- Audit logging is enabled in Microsoft Purview. For more information, see [Turn auditing on or off for Microsoft Purview](/microsoft-365/compliance/audit-log-enable-disable)
- For the Power Platform inventory connector, have the following resources and configurations set up.
   - Storage account to use with Azure Data Lake Storage Gen2. For more information, see [Create a storage account to use with Azure Data Lake Storage Gen2](/azure/storage/blobs/create-data-lake-storage-account).
   - Blob service endpoint URL for the storage account. For more information, see [Get service endpoints for the storage account](/azure/storage/common/storage-account-get-info?tabs=portal#get-service-endpoints-for-the-storage-account).
   - Power Platform self-service analytics configured to use the Azure Data Lake Storage Gen2 storage account. This process can take up to 48 hours to activate. For more information, see [Set up Microsoft Power Platform self-service analytics to export Power Platform inventory and usage data](/power-platform/admin/self-service-analytics). Review the prerequisites and requirements for the Power Platform self-service analytics feature. The requirements include that you enable public access to the storage account and that you have the permissions required to set up the data export.
   - Permissions to assign Storage Blob Data Reader role to the Azure Function


Enabling the Power Platform inventory data connector is recommended but not required to fully deploy the Microsoft Power Platform solution. For more information, see [Power Platform inventory data connector](#power-platform-inventory-data-connector).

## Install the Power Platform solution in Microsoft Sentinel

Install the solution from the content hub in Microsoft Sentinel by using the following steps.

1. In the Azure portal, search for and select **Microsoft Sentinel**.
1. Select the Microsoft Sentinel workspace where you're planning to deploy the solution.
1. Under **Content management**, select **Content hub**.
1. Search for and select **Power Platform**.
1. Select **Install**.
1. On the solution details page, select **Create**.
1. On the **Basics** tab, enter the subscription, resource group, and workspace to deploy the solution.
1. Select **Review + create** > **Create** to deploy the solution.

## Enable the data connectors

In Microsoft Sentinel, enable the six data connectors to collect activity logs and inventory data from the Power Platform components.

### Power Platform inventory data connector

The Power Platform inventory data connector allows you to resolve the GUIDs for Power Platform and PowerApps environments in the incident details to the human readable names that appear in Power Platform admin center and the Power Apps maker portal. We recommend enabling this data connector but it's not required to fully deploy the Microsoft Power Platform solution.

To optimize ingestion, the Power Platform inventory data connector ingests data in full every 7 days and incremental updates daily. The incremental updates only include inventory assets that have changes since the previous day.

To collect Power Apps and Power Automate inventory data, deploy the Azure Resource Manager template to create a function app. To complete the deployment, you need the blob service URL for your Azure Data Lake Storage Gen2 storage account. After you create the function app, grant the managed identity for the function app access to the storage account.


1. In Microsoft Sentinel, under **Configuration**, select **Data connectors**.
1. Search for and select **Power Platform Inventory (using Azure Functions)**.
1. Select **Open connector page**.
1. If you didn't enable Power Platform self-service analytics feature, under **Configuration** follow steps 1 and 2.
1. Under **Configuration** > **Step 3 - Azure Resource Manager (ARM) Template**, select **Deploy to Azure**.
1. Follow all the steps in the Azure Resource Manager template deployment wizard and select  **Review + create** > **Create**.
1. If you don't have the required permissions for role assignments during the Resource Manager template deployment, under **Configuration**, follow steps 4 and 5.

### Other data connectors

Connect each of the remaining data connectors by completing the following steps.

1. In Microsoft Sentinel, under **Configuration**, select **Data connectors**.
1. Search for and select the data connectors in the solution that you need to connect like **Microsoft Power Apps**.
1. Select **Open connector page** > **Connect**.
1. Repeat these steps for each of the following data connectors that are a part of the Power Platform solution.
   - **Microsoft Power Automate**
   - **Microsoft Power Platform Connectors**
   - **Microsoft Power Platform DLP**
   - **Microsoft Power Platform Admin Activity**
   - **Microsoft Dataverse**

## Enable auditing in your Microsoft Dataverse environment

Dataverse activity logging is available only for Production dataverse environments. Other types of environments, such as sandbox, don't support activity logging. See [Microsoft Dataverse and model-driven apps activity logging requirements](/power-platform/admin/enable-use-comprehensive-auditing#requirements). Dataverse activity logging isn't enabled by default. Enable auditing at the global level for Dataverse and for each Dataverse entity.

### Audit at the global level

In your Dataverse environment, go to **Settings** > **Audit settings**. Under **Auditing**, select all three checkboxes.

- **Start auditing**
- **Log access**
- **Read logs**

For more information about these steps, see [Manage Dataverse auditing](/power-platform/admin/manage-dataverse-auditing#startstop-auditing-for-an-environment-and-set-retention-policy).

### Audit Dataverse entities

Enable detailed auditing on each of the Dataverse entities. To enable auditing on default entities, import a Power Platform managed solution. To enable auditing on custom entities, you must manually enable detailed auditing on each of the custom entities.

#### Automatically enable auditing on default entities

The quickest way to enable default audit settings for all Dataverse entities is to import the appropriate Power Platform managed solution in your Power Platform environment. This managed solution enables detailed auditing for each of the default entities listed in the following file: [https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE5eo4g](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE5eo4g). To enable auditing on custom entities, you must manually enable detailed auditing on each of the custom entities.

To automatically enable entity auditing, complete the following steps.

1. Go to [https://make.powerapps.com](https://make.powerapps.com).
1. Choose the environment you want to monitor from the top right-hand side of the page.
1.	Go to **Solutions** > **Import solution**.
1. Import one of the following solutions depending on whether your Power Platform environment is used for Dynamics 365 CE Apps or not.

   - For use with Dynamics 365 CE Apps, import [https://aka.ms/AuditSettings/Dynamics](https://aka.ms/AuditSettings/Dynamics).
   - Otherwise, import [https://aka.ms/AuditSettings/DataverseOnly](https://aka.ms/AuditSettings/DataverseOnly).

#### Manually enable entity auditing

To enable auditing on each Dataverse entity manually, including custom entities, follow the steps in the section **Enable or disable entities and fields for auditing** in [Manage Dataverse auditing](/power-platform/admin/manage-dataverse-auditing#enable-or-disable-entities-and-fields-for-auditing).

To get the full incident detection value of the solution, we recommend that you enable, for each Dataverse entity you want to audit, the following options in the **General** tab of the Dataverse entity settings page:
-  Under the **Data Services** section, select **Auditing**.
-  Under the **Auditing** section, select **Single record auditing** and **Multiple record auditing**. 

Save and publish your customizations.

## Verify that the data connector is ingesting logs to Microsoft Sentinel

To verify that log ingestion is working, complete the following steps.

### Generate activity and inventory logs

1. Run activities like create, update, and delete to generate logs for data that you enabled for monitoring.
1. Wait up to 60 minutes for Microsoft Sentinel to ingest the activity logs to the logs table in the workspace.
1. For Power Platform inventory data, wait up to 24 hours for Microsoft Sentinel to ingest the data to the log tables in the workspace.

### View ingested data in Microsoft Sentinel

After you wait for Microsoft Sentinel to ingest the data, complete the following steps to verify you get the data you expect.

1. In Microsoft Sentinel, select **Logs**.
1. Run KQL queries against the tables that collect the activity logs from the data connectors. For example, run the following query to return 50 rows from the table with the Power Apps activity logs.

   ```kusto
    PowerAppsActivity
    | take 50
    ```

   The following table lists the Log Analytics tables to query.

   |Log Analytics tables |Data collected |
   |---------|---------|
   |PowerAppsActivity |Power Apps activity logs |  
   |PowerAutomateActivity |Power Automate activity logs  |
   |PowerPlatformConnectorActivity |Power Platform connector activity logs |
   |PowerPlatformDlpActivity |Data loss prevention activity logs   |
   |PowerPlatformAdminActivity|Power Platform administrative logs|
   |DataverseActivity |Dataverse and model-driven apps activity logging  |  

   Use the following parsers to return inventory and watchlist data.

   |Parser  |Data returned |
   |---------|---------|
   |`InventoryApps` | Power Apps Inventory | 
   |`InventoryAppsConnections` |  Power Apps connections Inventoryconnections       |  
   |`InventoryEnvironments`   |Power Platform environments Inventory         | 
   |`InventoryFlows`   |  Power Automate flows Inventory       | 
   |`MSBizAppsTerminatedEmployees`    | Terminated employees watchlist |  
1. Verify that the results for each table show the activities you generated.

## Next steps

In this article, you learned how to deploy the Microsoft Sentinel solution for Power Platform.

- To review the solution content available with this solution, see [Microsoft Sentinel solution for Microsoft Power Platform: security content reference](power-platform-solution-security-content.md).
- To manage the solution components and enable security content, see [Discover and deploy out-of-the-box content](/azure/sentinel/sentinel-solutions-deploy).
