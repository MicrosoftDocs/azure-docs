---
title: Migrate your file data to Azure with Datadobi DobiMigrate
titleSuffix: Azure Storage
description: Provides getting started guide to implement Datadobi DobiMigrate, and migrate your data to Azure Files, Azure NetApp Files, or ISV NAS solution 
author: dukicn
ms.author: nikoduki
ms.date: 04/27/2021
ms.topic: conceptual
ms.service: azure-storage
ms.subservice: storage-partner-integration
---

# Migrate data to Azure with Datadobi DobiMigrate

This article helps you integrate the Datadobi DobiMigrate infrastructure with Azure storage. It includes prerequisites, considerations, implementation, and operational guidance.

DobiMigrate enables file and object migrations between storage platforms. It migrates data from on-premises to Azure quickly, easily, and cost effectively.

## Reference architecture

The following diagram provides a reference architecture for on-premises to Azure and in-Azure deployments.

:::image type="content" source="./media/dobimigrate-quick-start-guide/dobimigrate-reference-architecture.png" alt-text="Reference architecture describes basic setup for DobiMigrate":::

Your existing DobiMigrate deployment can easily integrate with Azure by adding and configuring an Azure connection.

## Before you begin

A little upfront planning will help you use Azure as an offsite backup target and recovery site.

### Get started with Azure

Microsoft offers a framework to follow to get you started with Azure. The [Cloud Adoption Framework](/azure/architecture/cloud-adoption/) (CAF) is a detailed approach to enterprise digital transformation and comprehensive guide to planning a production grade cloud adoption. The CAF includes a step-by-step [Azure setup guide](/azure/cloud-adoption-framework/ready/azure-setup-guide/) to help you get up and running quickly and securely. You can find an interactive version in the [Azure portal](https://portal.azure.com/?feature.quickstart=true#blade/Microsoft_Azure_Resources/QuickstartCenterBlade). You'll find sample architectures, specific best practices for deploying applications, and free training resources to put you on the path to Azure expertise.

### Considerations for migrations

Several aspects are important when considering migrations of file data to Azure. Before proceeding learn more:

- [storage migration overview](../../../common/storage-migration-overview.md)
- latest supported features by DobiMigrate in [migration tools comparison matrix](./migration-tools-comparison.md).

Remember, you'll require enough network capacity to support migrations without impacting production applications. This section outlines the tools and techniques that are available to assess your network needs.

#### Determine unutilized internet bandwidth

It's important to know how much typically unutilized bandwidth (or *headroom*) you have available on a day-to-day basis. To help you assess whether you can meet your goals for:

- initial time for migrations when you're not using Azure Data Box for offline method
- time required to do incremental resync before final switch-over to the target file service

Use the following methods to identify the bandwidth headroom to Azure that is free to consume.

- If you're an existing Azure ExpressRoute customer, view your [circuit usage](../../../../expressroute/expressroute-monitoring-metrics-alerts.md#circuits-metrics) in the Azure portal.
- Contact your ISP and request reports to show your existing daily and monthly utilization.
- There are several tools that can measure utilization by monitoring your network traffic at the router/switch level:
  - [SolarWinds Bandwidth Analyzer Pack](https://www.solarwinds.com/network-bandwidth-analyzer-pack?CMP=ORG-BLG-DNS)
  - [Paessler PRTG](https://www.paessler.com/bandwidth_monitoring)
  - [Cisco Network Assistant](https://www.cisco.com/c/en/us/products/cloud-systems-management/network-assistant/index.html)
  - [WhatsUp Gold](https://www.whatsupgold.com/network-traffic-monitoring)

## Implementation guidance

This section provides a brief guide for how to add Azure Files share to an on-premises to Azure DobiMigrate deployment. 

1. Open the Azure portal, and search for  **storage accounts**. 

    :::image type="content" source="./media/dobimigrate-quick-start-guide/azure-locate-storage-account.png" alt-text="Shows where you've typed storage in the search box of the Azure portal.":::

    You can also click on the default  **Storage accounts**  icon.

    :::image type="content" source="./media/dobimigrate-quick-start-guide/azure-portal.png" alt-text="Shows adding a storage account in the Azure portal.":::

2. Select  **Create**  to add an account:
   1. Select existing resource group or **Create new**
   2. Provide a unique name for your storage account
   3. Choose the region
   4. Select  **Standard**  or **Premium** performance, depending on your needs. If you select **Premium**, select **File shares** under **Premium account type**.
   5. Choose the **[Redundancy](../../../common/storage-redundancy.md)** that meets your data protection requirements
   
   :::image type="content" source="./media/dobimigrate-quick-start-guide/azure-account-create-1.png" alt-text="Shows storage account settings in the portal.":::

3. Next, we recommend the default settings from the **Advanced** screen. If you are migrating to Azure Files, we recommend enabling **Large file shares** if available.

   :::image type="content" source="./media/dobimigrate-quick-start-guide/azure-account-create-2.png" alt-text="Shows Advanced settings tab in the portal.":::

4. Keep the default networking options for now and move on to  **Data protection**. You can choose to enable soft delete, which allows you to recover an accidentally deleted data within the defined retention period. Soft delete offers protection against accidental or malicious deletion.

   :::image type="content" source="./media/dobimigrate-quick-start-guide/azure-account-create-3.png" alt-text="Shows the Data Protection settings in the portal.":::

5. Add tags for organization if you use tagging and **Create** your account.
 
6. Two quick steps are all that are now required before you can add the account to your DobiMigrate environment. Navigate to the account you created in the Azure portal and select File shares under the File service menu. Add a File share and choose a meaningful name. Then, navigate to the Access keys item under Settings and copy the Storage account name and one of the two access keys.

   :::image type="content" source="./media/dobimigrate-quick-start-guide/azure-access-key.png" alt-text="Shows access key settings in the portal.":::

7. Navigate to the properties of the Azure File share and take the URL address, it will be required to add the Azure connection into the DobiMigrate:

   :::image type="content" source="./media/dobimigrate-quick-start-guide/azure-files-endpoint.png" alt-text="Find Azure files endpoint.":::

8. (_Optional_) You can add extra layers of security to your deployment.
 
   1. Configure role-based access to limit who can make changes to your storage account. For more information, see [Built-in roles for management operations](../../../common/authorization-resource-provider.md#built-in-roles-for-management-operations).
 
   2.  Restrict access to the account to specific network segments with [storage firewall settings](../../../common/storage-network-security.md). Configure firewall settings to prevent access from outside of your corporate network.

       :::image type="content" source="./media/dobimigrate-quick-start-guide/azure-storage-firewall.png" alt-text="Shows storage firewall settings in the portal.":::

   3.  Set a [delete lock](../../../../azure-resource-manager/management/lock-resources.md) on the account to prevent accidental deletion of the storage account.

       :::image type="content" source="./media/dobimigrate-quick-start-guide/azure-resource-lock.png" alt-text="Shows setting a delete lock in the portal.":::

   4.  Configure extra [security best practices](../../../blobs/security-recommendations.md).

9.  In DobiMigrate, navigate to Configuration -> File Servers. Click **Add** to add Microsoft Azure Files as a file server type:

    :::image type="content" source="./media/dobimigrate-quick-start-guide/dobimigrate-server-type.png" alt-text="Add Microsoft Azure Files as server type.":::

10. Specify the Name, Azure Files connection details, and the storage account credentials:
 
    :::image type="content" source="./media/dobimigrate-quick-start-guide/dobimigrate-connection-details.png" alt-text="Configure Azure Files connection details.":::

11. Assign the proxies to the Azure Files connection and click **Test connection**; to confirm that the proxies can communicate with Azure Files:
 
    :::image type="content" source="./media/dobimigrate-quick-start-guide/dobimigrate-test-connection.png" alt-text="Test connection details.":::

    The connection test results are displayed:

    :::image type="content" source="./media/dobimigrate-quick-start-guide/dobimigrate-test-results.png" alt-text="Show results of test connections.":::

12. Under **SMB Migration Shares**, you see all the Azure File shares that are provisioned under this storage account. Set **Mapping** to **Manual** for the shares that are in your migration scope, for example:
 
    :::image type="content" source="./media/dobimigrate-quick-start-guide/dobiprotect-azure-files-shares.png" alt-text="Show available shares.":::

13. Click **Finish** to complete the Azure Files configuration. You can then start a new migration task.

### Start a new migration

DobiMigrate can set up a new migration by manually adding migration paths, or by using bulk import. Bulk import adds multiple migrations with common migration options.

To start a new migration:

1. Click the **New migration** button on the dashboard.
   
    :::image type="content" source="./media/dobimigrate-quick-start-guide/dobimigrate-new-migration.png" alt-text="Start a new migration job.":::

1. Select the source and the paths to be migrated.

    :::image type="content" source="./media/dobimigrate-quick-start-guide/dobimigrate-select-source.png" alt-text="Select source and the paths to be migrated.":::

1. Select the **Destination**.
2. Verify the protocols, and confirm the migration options.
3. Click **Finish** to complete the migration process.

## Support 

When you need help with your migration to Azure solution, you should open a case with both Datadobi and Azure.

### To open a case with Datadobi

On the [Datadobi Support Site](https://support.datadobi.com/s/), sign in, and open a case.

### To open a case with Azure

In the [Azure portal](https://portal.azure.com/) search for  **support**  in the search bar at the top. Select  **Help + support** -> **New Support Request**.

## Marketplace

Datadobi has made it easy to deploy their solution in Azure to protect Azure Virtual Machines and many other Azure services. For more information, see the following references:

- [Migrate File Data to Azure with DobiMigrate](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/datadobi1602192408529.datadobi_license_purchase?tab=Overview)

## Next steps

Learn more by visiting our guides:

- [Storage migration overview](../../../common/storage-migration-overview.md)
- [DobiMigrate User Manual](https://downloads.datadobi.com/NAS/olh/latest/dobimigrate.html)
- [DobiMigrate Prerequisites Guide](https://downloads.datadobi.com/NAS/guides/latest/prerequisites.html)
- [DobiMigrate Install Guide](https://downloads.datadobi.com/NAS/guides/latest/installguide.html)
