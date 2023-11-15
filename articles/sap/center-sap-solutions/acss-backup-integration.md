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

When you configure Azure Backup from the VIS resource, you can enable Backup for your SAP Central Services instance, Application server and Database virtual machines and HANA Database in one step. For the HANA Database, Azure Center for SAP solutions automates the step of running the [Pre-Registration script](/azure/backup/tutorial-backup-sap-hana-db#what-the-pre-registration-script-does).

Once backup is configured, you can monitor the status of your Backup Jobs for both virtual machines and HANA DB from the VIS.

If you have already configured Backup from Azure Backup Center for your SAP VMs and HANA DB, then VIS resource automatically detects this and enables you to monitor the status of Backup jobs.

Before you can go ahead and use this feature in preview, register for it from the Backup (preview) tab on the Virtual Instance for SAP solutions resource on the Azure portal.

## Prerequisites
- A Virtual Instance for SAP solutions (VIS) resource representing your SAP system on Azure Center for SAP solutions.
- An Azure account with **Contributor** role access on the Subscription in which your SAP system exists.

To be able to configure Backup from the VIS resource, assign the following roles to **Azure Workloads Connector Service** first-party app
  1. **Backup Contributor** role access on the Subscription or specific Resource group which has the Recovery services vault that will be used for Backup. 
  2. **Virtual Machine Contributor** role access on the Subscription or Resource groups which have the Compute resources of the SAP systems.
You can skip this step if you have already configured Backup for your VMs and HANA DB using Azure Backup Center. You will be able to monitor Backup of your SAP system from the VIS.

> [!IMPORTANT]
> Once you have completed configuring Backup from the VIS experience, it is recommended that you remove role access assigned to **Azure Workloads Connector Service** first-party app, as the access is no longer needed when monitoring backup status from VIS.

- For HANA database backup, ensure the [prerequisites](/azure/backup/tutorial-backup-sap-hana-db#prerequisites) required by Azure Backup are in place.
- For HANA database backup, create a **HDB Userstore key** that will be used for preparing HANA DB for configuring Backup. For a **highly available(HA)** HANA database, the Userstore key should be created in both **Primary** and **Secondary** databases.

> [!NOTE]
> If you are configuring backup for HANA database from the Virtual Instance for SAP solutions resource, you can skip running the [Backup pre-registration script](/azure/backup/tutorial-backup-sap-hana-db#what-the-pre-registration-script-does). Azure Center for SAP solutions runs this script before configuring HANA backup.

## Configure Backup for your SAP system
You can configure Backup for your Central service, Application server and Database virtual machines and HANA database from the Virtual Instance for SAP solutions resource following these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search for **ACSS** and select **Azure Center for SAP solutions** from search results.
3. On the left navigation, select **Virtual Instance for SAP solutions**.
4. Select the **Backup (preview)** tab on the left navigation.
5. Select **Configure** button on the Backup (preview) page.
7. Select the checkboxes **Central service + App server VMs Backup** and **Database Backup**.
8. For **Central service + App server VMs Backup**, select an existing Recovery Services vault or **Create new**.
   - Select a Backup policy that is to be used for backing up Central service, App server and Database VMs.
   - Select **Include database servers for virtual machine backup** if you want to have Azure VM backup configured for database VMs. If this is not selected, only Central service and App server VMs will have VM backup configured.
        - If you choose to include database VMs for backup, then you can decide if all disks associated to the VM must be backed up or **OS disk only**. 
9. For Database Backup, select an existing Recovery Services vault or Create new.
   - Select a Backup policy that is to be used for backing up HANA database.
10. Provide a **HANA DB User Store** key name.
    > [!IMPORTANT]
    > If you are configuring backup for a HSR enabled HANA database, then you must ensure the HANA DB user store key is available on both primary and secondary databases. 
11. If SSL enforce is enabled for the HANA database, provide the key store, trust store path and SSL hostname and crypto provider details.

> [!NOTE]
> If you are configuring backup for a HSR enabled HANA database from the Virtual Instance for SAP solutions resource, then the [Backup pre-registration script](/azure/backup/tutorial-backup-sap-hana-db#what-the-pre-registration-script-does) is run on both Primary and Secondary HANA VMs. This is inline with Azure Backup configuration process for HSR enabled HANA databases, to ensure Azure Backup service is able to connect to any new primary node automatically without any manual intervention. [Learn more](/azure/backup/sap-hana-database-with-hana-system-replication-backup).

## Monitor Backup status of your SAP system
After you configure Backup for the Virtual Machines and HANA Database of your SAP system either from the Virtual Instance for SAP solutions resource or from the Backup Center, you can monitor the status of Backup from the Virtual Instance for SAP solutions resource.

To monitor Backup status:
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search for **ACSS** and select **Azure Center for SAP solutions** from search results.
3. On the left navigation, select **Virtual Instance for SAP solutions**.
4. Select the **Backup (preview)** tab on the left navigation.
5. For **Central service + App server VMs** and **HANA Database**, view protection status of **Backup instances** and status of **Backup jobs** in the last 24 hours.

## Next steps
- [Monitor SAP system from the Azure portal](monitor-portal.md)
- [Get quality checks and insights for a VIS resource](get-quality-checks-insights.md)
- [Start and Stop SAP systems](start-stop-sap-systems.md)
- [View Cost Analysis of SAP system](view-cost-analysis.md)
