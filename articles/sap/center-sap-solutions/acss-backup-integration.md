---
title: Configure and monitor Azure Backup for SAP Virtual Instance (preview)
description: Learn how to configure and monitor Azure Backup status for your SAP system through the Virtual Instance for SAP solutions (VIS) resource in Azure Center for SAP solutions.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 04/08/2026
ms.author: kanamudu
author: kalyaninamuduri
# Customer intent: As an SAP Basis Admin, I want to configure and monitor backups for my SAP system using the Virtual Instance for SAP solutions, so that I can ensure data integrity and recoverability in case of system failures.
---

# Configure and monitor Azure Backup status for your SAP system through Virtual Instance for SAP solutions (preview)

[Azure Center for SAP solutions](overview.md) lets you manage SAP workloads on Azure through a Virtual Instance for SAP solutions (VIS) resource. Protecting your SAP system requires configuring and monitoring backups for Central Services instances, application servers, database virtual machines, and HANA databases. This process can involve multiple separate steps.

This article shows you how to configure Azure Backup and monitor backup status for your entire SAP system from the VIS resource in a single workflow. If backup is already configured from Azure Backup Center, the VIS resource automatically detects the existing configuration and shows backup job status.

> [!NOTE]
> Configuration of backups from a VIS is currently in preview.

## Prerequisites

- A VIS resource representing your SAP system on Azure Center for SAP solutions.
- An Azure account with **Backup Contributor** and **Virtual Machine Contributor** role access on the subscription in which your SAP system exists.
- For HANA database backup, make sure the [prerequisites](/azure/backup/tutorial-backup-sap-hana-db#prerequisites) required by Azure Backup are in place.
- For HANA database backup, an **HDB user store key** for preparing HANA DB for configuring backup. For a **highly available (HA)** HANA database, the **HBD user store key** must exist on both the **Primary** and **Secondary** databases.

> [!NOTE]
> If you're configuring backup for HANA database from the VIS resource, you can skip running the [backup preregistration script](/azure/backup/tutorial-backup-sap-hana-db#what-the-pre-registration-script-does). Azure Center for SAP solutions runs this script before configuring HANA backup.

## Configure backup for your SAP system

To configure backup for your Central Services instance, application server, database virtual machines, and HANA database from the VIS resource, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **ACSS** and select **Azure Center for SAP solutions** from search results.
1. On the left navigation, select **Virtual Instance for SAP solutions**.
1. Select the **Backup (preview)** tab on the left navigation.
1. Select **Configure** on the **Backup (preview)** page.
1. Select **Central service + App server VMs Backup** and **Database Backup**.
1. For **Central service + App server VMs Backup**, select an existing Recovery Services vault or **Create new**.

   - Select a backup policy for backing up Central Services, application server, and database VMs.
   - Select **Include database servers for virtual machine backup** if you want Azure VM backup configured for database VMs. If this option isn't selected, only Central Services and application server VMs have VM backup configured.

     - If you choose to include database VMs for backup, you can decide whether all disks associated with the VM are backed up or **OS disk only**.

1. For Database Backup, select an existing Recovery Services vault or **Create new**.

   -  Select a backup policy for backing up the HANA database.

1. Enter a **HANA DB User Store** key name.

   > [!IMPORTANT]
   > If you're configuring backup for an HSR-enabled HANA database, make sure the HANA DB user store key is available on both primary and secondary databases.

1. If SSL enforce is enabled for the HANA database, enter the key store, trust store path, SSL hostname, and crypto provider details.

> [!NOTE]
> If you're configuring backup for an HSR-enabled HANA database from the VIS resource, the [backup preregistration script](/azure/backup/tutorial-backup-sap-hana-db#what-the-pre-registration-script-does) runs on both primary and secondary HANA VMs. This behavior is in line with the Azure Backup configuration process for HSR-enabled HANA databases. It helps ensure the Azure Backup service can connect to any new primary node automatically without manual intervention. For more information, see [Back up SAP HANA databases with HSR](/azure/backup/sap-hana-database-with-hana-system-replication-backup).

## Monitor backup status of your SAP system

After you configure backup for the virtual machines and HANA database in your SAP system, you can monitor backup status from the VIS resource regardless of whether you set up backup from the VIS resource or from **Backup center**.

To monitor backup status:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **ACSS** and select **Azure Center for SAP solutions** from search results.
1. On the left navigation, select **Virtual Instance for SAP solutions**.
1. Select the **Backup (preview)** tab on the left navigation.
1. For **Central service + App server VMs** and **HANA Database**, view the protection status of **Backup instances** and the status of **Backup jobs** in the last 24 hours.

## Related content

- [Monitor SAP system from the Azure portal](monitor-portal.md)
- [Get quality checks and insights for a VIS resource](get-quality-checks-insights.md)
- [Start and Stop SAP systems](start-stop-sap-systems.md)
- [View Cost Analysis of SAP system](view-cost-analysis.md)
