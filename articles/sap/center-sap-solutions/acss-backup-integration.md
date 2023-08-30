---
title: Configure and view Backup status for your SAP system on Virtual Instance for SAP solutions (preview)
description: Learn how to configure and view Backup status for your SAP system through the Virtual Instance for SAP solutions (VIS) resource in Azure Center for SAP solutions.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 06/06/2023
ms.author: kanamudu
author: kalyaninamuduri
#Customer intent: As an SAP Basis Admin, I want to understand how to configure backup for my SAP system and monitor it to ensure backups are running as expected.
---

# Configure and monitor Azure Backup status for your SAP system through Virtual Instance for SAP solutions (Preview)

> [!NOTE]
> Configuration of Backup from Virtual Instance for SAP solutions feature is currently in Preview.

In this how-to guide, you'll learn to configure and monitor Azure Backup for your SAP system through the Virtual Instance for SAP solutions (VIS) resource in Azure Center for SAP solutions.

When you configure Azure Backup from the VIS resource, you get to enable Backup for all your **Central service and Application server virtual machines** and **HANA Database** in one go. For HANA Database, Azure Center for SAP solutions automates the step of running the [Pre-Registration script](/azure/backup/tutorial-backup-sap-hana-db#what-the-pre-registration-script-does).

Once backup is configured, you can monitor the status of your Backup Jobs for both virtual machines and HANA DB from the VIS.

If you have already configured Backup from Azure Backup Center for your SAP VMs and HANA DB, then VIS resource automatically detects this and enables you to monitor the status of Backup jobs.

Before you can go ahead and use this feature in preview, register for it from the Backup (preview) tab on the Virtual Instance for SAP solutions resource on the Azure portal.

## Prerequisites
- A Virtual Instance for SAP solutions resource representing your SAP system on Azure Center for SAP solutions.
- An Azure account with **Contributor** role access on the Subscription in which your SAP system exists.
- Register **Microsoft.Features** Resource Provider on your subscription. 
- Register your subscription for this preview feature in Azure Center for SAP solutions.
- After you have successfully registered for the Preview feature, re-register **Microsoft.Workloads** resource provider on the Subscription.
- To be able to configure Backup from the VIS resource, assign the following roles to **Azure Workloads Connector Service** first-party app
  1. **Backup Contributor** role access on the Subscription or specific Resource group which has the Recovery services vault that will be used for Backup. 
  2. **Virtual Machine Contributor** role access on the Subscription or Resource groups which have the Compute resources of the SAP systems.
  - You can skip this step if you have already configured Backup for your VMs and HANA DB using Azure Backup Center. You will be able to monitor Backup of your SAP system from the VIS. 
- For HANA database backup, ensure the [prerequisites](/azure/backup/tutorial-backup-sap-hana-db#prerequisites) required by Azure Backup are in place.
- For HANA database backup, create a HDB Userstore key that will be used for preparing HANA DB for configuring Backup. 

> [!NOTE]
> If you are configuring backup for HANA database from the Virtual Instance for SAP solutions resource, you can skip running the [Backup pre-registration script](/azure/backup/tutorial-backup-sap-hana-db#what-the-pre-registration-script-does). Azure Center for SAP solutions runs this script before configuring HANA backup.

## Register for Backup integration preview feature
Before you can start configuring Backup from the VIS resource or viewing Backup status on VIS resource in case Backup is already configured, you need to register for the Backup integration feature in Azure Center for SAP solutions. Follow these steps to register for the feature:

1. Sign in to the [Azure portal](https://portal.azure.com) as a user with **Contributor** role access.
2. Search for **ACSS** and select **Azure Center for SAP solutions** from search results.
3. On the left navigation, select **Virtual Instance for SAP solutions**.
4. Select the **Backup (preview)** tab on the left navigation.
5. Select the **Register for Preview** button.
6. Registration for features can take upto 30 minutes and once it is complete, you can configure backup or view status of already configured backup. 

## Configure Backup for your SAP system
You can configure Backup for your Central service and Application server virtual machines and HANA database from the Virtual Instance for SAP solutions resource following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search for **ACSS** and select **Azure Center for SAP solutions** from search results.
3. On the left navigation, select **Virtual Instance for SAP solutions**.
4. Select the **Backup (preview)** tab on the left navigation.
5. If you have not registered for the preview feature, complete the registration process by selecting the **Register** button. This step is needed only once per Subscription. 
6. Select **Configure** button on the Backup (preview) page.
7. Select the checkboxes **Central service + App server VMs Backup** and **Database Backup**.
8. For Central service + App server VMs Backup, select an existing Recovery Services vault or Create new.
   - Select a Backup policy that is to be used for backing up Central service and App server VMs.
9. For Database Backup, select an existing Recovery Services vault or Create new.
   - Select a Backup policy that is to be used for backing up HANA database.
10. Provide a **HANA DB User Store** key name.
11. If SSL enforce is enabled for the HANA database, provide the key store, trust store path and SSL hostname and crypto provider details.

> [!NOTE]
> If you are configuring backup for an HSR enabled HANA database from the Virtual Instance for SAP solutions resource, then the [Backup pre-registration script](/azure/backup/tutorial-backup-sap-hana-db#what-the-pre-registration-script-does) is run and backup configured only for the Primary HANA database node. In case of a failover, you will need to configure Backup on the new primary node.

## Monitor Backup status of your SAP system
After you configure Backup for the Virtual Machines and HANA Database of your SAP system either from the Virtual Instance for SAP solutions resource or from the Backup Center, you can monitor the status of Backup from the Virtual Instance for SAP solutions resource.

To monitor Backup status:
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search for **ACSS** and select **Azure Center for SAP solutions** from search results.
3. On the left navigation, select **Virtual Instance for SAP solutions**.
4. Select the **Backup (preview)** tab on the left navigation.
5. If you have not registered for the preview feature, complete the registration process by selecting the **Register** button. This step is needed only once per Subscription.
6. For Central service + App server VMs and HANA Database, view protection status of **Backup instances** and status of **Backup jobs** in the last 24 hours.

> [!NOTE]
> For a highly available HANA database, if you have configured Backup using the HSR Backup feature from Backup Center, that would not be detected and displayed under Database Backup section.

## Next steps
- [Monitor SAP system from the Azure portal](monitor-portal.md)
- [Get quality checks and insights for a VIS resource](get-quality-checks-insights.md)
- [Start and Stop SAP systems](start-stop-sap-systems.md)
- [View Cost Analysis of SAP system](view-cost-analysis.md)
