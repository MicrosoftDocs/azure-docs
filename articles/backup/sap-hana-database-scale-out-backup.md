---
title: Back up SAP HANA Scale-out databases on Azure VMs (Preview)
description: In this article, discover how to back up SAP HANA databases with scale-out topology enabled.
ms.topic: how-to
ms.date: 06/12/2026
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.custom: engagement-fy24
# Customer intent: "As a database administrator, I want to back up SAP HANA scale-out databases on Azure virtual machines using Azure Backup, so that I can ensure data protection across multiple nodes and minimize downtime for critical workloads."
---

# Back up SAP HANA scale-out databases on Azure VMs (Preview)

SAP HANA databases are critical workloads that require a low recovery-point objective (RPO) and long-term retention. This article describes how you can back up SAP HANA databases with scale-out topology that are running on Azure virtual machines (VMs) to an Azure Backup Recovery Services vault by using [Azure Backup](backup-overview.md) via the Azure portal.

In a scale-out configuration, a single SAP HANA system is distributed across multiple nodes. The scale-out primary node hosts the system database, while worker nodes host tenant databases and other services. Azure Backup provides a unified backup chain across all nodes in the scale-out system, so you don't need node-level management.

To learn about the supported SAP HANA database backup and restore scenarios, region availability, and limitations, see the [support matrix](sap-hana-backup-support-matrix.md). For common questions, see the [frequently asked questions](sap-hana-faq-backup-azure-vm.yml).

## Key concepts

- **Scale-out primary**: The VM on which the HANA system database runs.
- **Worker nodes**: Other VMs in the scale-out system that host tenant databases and services but don't run the active system database.
- **Virtual hostname**: A virtual network name that automatically resolves to the scale-out primary node (use this name instead of the physical hostname).

## Prerequisites

Before you back up an SAP HANA scale-out database on Azure VMs, make sure that you:

- Identify or [create a Recovery Services vault](backup-create-recovery-services-vault.md#create-a-recovery-services-vault) in the same region and subscription as all VMs in your HANA scale-out system.
- Ensure all VMs (primary and worker nodes) have connectivity to the internet for communication with Azure.
- Run the scale-out preregistration script on **all VMs** (both primary and worker nodes) in your scale-out system. Download the latest preregistration script [from here](https://aka.ms/hanascaleoutprereg).
- Use a unique scale-out identifier (SUV) that's the same across all nodes (SAP recommends an alphanumeric value).
- Use the system database port number (typically `3<instance-number>13`, such as `30013` for instance 00).
- Ensure that the combined length of the SAP HANA Server VM name and the resource group name doesn't exceed 84 characters for Azure Resource Manager VMs and 77 characters for classic VMs. This limitation exists because the service reserves some characters.

[!INCLUDE [Create a Recovery Services vault](../../includes/backup-create-rs-vault.md)]

## Prepare HANA scale-out nodes for backup using the preregistration script

The preregistration script prepares your HANA scale-out system for backup by creating the necessary database user and userstore entries. You must run the script on **all nodes** in the scale-out system.

### Create a custom backup user for the script execution

On the **primary node only**, create a custom backup user in the HANA system:

1. Connect to the HANA database as the SYSTEM user.

   ```hdbsql
   hdbsql -t -U SYSTEMKEY
   ```

1. Run the following SQL queries to create the backup user:

   ```sql
   CREATE USER AZUREWLBACKUPHANAUSER PASSWORD "<password>" NO FORCE_FIRST_PASSWORD_CHANGE
   ALTER USER AZUREWLBACKUPHANAUSER DISABLE PASSWORD LIFETIME
   ALTER USER AZUREWLBACKUPHANAUSER RESET CONNECT ATTEMPTS
   ALTER USER AZUREWLBACKUPHANAUSER ACTIVATE USER NOW
   ```

   Replace `<password>` with a secure password that you use for backup operations.

### Set up user store entries on each node

To set up the required user store entries, run the following commands on **each node** in the scale-out system using the virtual hostname (or primary node hostname) and the primary node's system database port.

>[!NOTE]
>If your scale-out system uses a virtual hostname for the primary node, use the virtual hostname in the commands below. Otherwise, use the physical hostname of the primary node.

1. Create a SYSTEMKEY entry:

   ```bash
   hdbuserstore SET SYSTEMKEY <primary-hostname>:<system-db-port> SYSTEM <password>
   ```

   **Example:**
   ```bash
   hdbuserstore SET SYSTEMKEY jgaikjpeso1-m1:30013 SYSTEM MyPassword123
   ```

   Where:
   - `<primary-hostname>`: The virtual or physical hostname of the scale-out primary node
   - `<system-db-port>`: The system database port (for example, `30013` for instance 00)
   - `<password>`: The system database password

1. Create a backup key entry on each node:

   ```bash
   hdbuserstore SET AZUREWLBACKUPHANAUSER <primary-hostname>:<system-db-port>@SYSTEMDB AZUREWLBACKUPHANAUSER "<backup-password>"
   ```

   **Example:**
   ```bash
   hdbuserstore SET AZUREWLBACKUPHANAUSER jgaikjpeso1-m1:30013@SYSTEMDB AZUREWLBACKUPHANAUSER "MyBackupPassword123"
   ```

   Use the same password that you created for the `AZUREWLBACKUPHANAUSER` database user on the primary node.

### Run the preregistration script on all nodes

Download the scale-out preregistration script and run it on each node in your scale-out system as the root user.

```bash
./msawb-plugin-config-com-sap-hana-scale-out.sh -a --sid <instance-name> -n <instance-number> --system-key SYSTEMKEY -suv <scale-out-unique-id> -p <system-db-port> -bk AZUREWLBACKUPHANAUSER
```

**Example:**
```bash
./msawb-plugin-config-com-sap-hana-scale-out.sh -a --sid HN1 -n 00 --system-key SYSTEMKEY -suv hn1Scaleoutysuid1 -p 30013 -bk AZUREWLBACKUPHANAUSER
```

Where:
- `<instance-name>`: The SAP HANA system identifier (SID), such as `HN1`
- `<instance-number>`: The instance number, such as `00`
- `<scale-out-unique-id>`: A unique alphanumeric identifier for your scale-out system (same on all nodes)
- `<system-db-port>`: The system database port number, such as `30013`
- `SYSTEMKEY`: The name of the system key entry in hdbuserstore (use as-is)
- `AZUREWLBACKUPHANAUSER`: The name of the backup key entry in hdbuserstore (use as-is)

## Register VMs and discover databases

To register VMs and discover databases for each node in your scale-out system, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to **Resiliency**, and then select **+Configure protection**.

1. On the **Configure protection** pane, select **Datasource type** as **SAP HANA in Azure VM**, and then select **Continue**.

1. On the **Start: Configure Backup** pane, select **Select vault** to choose the Recovery Services vault, and then select **Continue**.

1. For each VM in your scale-out system (both primary and worker nodes):

   1. Select **Add** to register the VM.

   1. In the **Register VMs** pane, select the VM, and then select **Register**.

   1. After the VM is registered, select **Discover DBs** to discover the HANA databases on that VM.

>[!NOTE]
>The discovery process deploys the Azure Backup workload extension on each node. Allow a few minutes for the discovery to complete on each node.

## Configure backup for the scale-out system

After you register all nodes and discover databases, configure backup protection for your scale-out system.

1. In the [Azure portal](https://portal.azure.com/), go to **Resiliency** and open the same Recovery Services vault where nodes were discovered.

1. In the **Backup Goal** pane, select **Configure Backup**.

1. In **Select items to backup**, select the HANA scale-out system. The system appears as a single logical unit representing all nodes.

1. In **Backup Policy**, select an existing backup policy or create a new one. For scale-out systems, use the following settings:
   - **Full backup**: Once per week
   - **Differential backup**: Daily
   - **Incremental backup**: Multiple times per day (as needed)
   - **Log backup**: Every 15 minutes (minimum)

   >[!NOTE]
   >For scale-out systems, Azure Backup automatically coordinates backups across all nodes. You don't need to configure backups for each node.

1. Review your selections, and then select **Enable backup**.

When you enable backup, Azure Backup manages the backup schedule across all nodes in your scale-out system.

## Run an on-demand backups

After the initial scheduled backup finishes, you can run on-demand full backups from the Azure portal following these steps:

1. In the Azure portal, open your Recovery Services vault.

2. Under **Protected items**, select **Backup items**, then select **SAP HANA in Azure VM**.

3. Select your scale-out HANA system.

4. In the **Backup Items** pane, select **Backup now**.

5. Choose the backup type (Full, Differential, or Incremental), then select **OK** to trigger the backup.

Once the initial full backup completes, log backups will be triggered automatically by the HANA backup engine on a schedule based on your policy.

## Monitor and manage backups

For information about monitoring backup jobs, managing backup configurations, and stopping protection for your scale-out HANA system, see [Manage SAP HANA databases backed up by Azure Backup](sap-hana-database-manage.md).

## Next steps

- [Restore SAP HANA databases on Azure VMs](sap-hana-database-restore.md).
- [Manage SAP HANA databases backed up by Azure Backup](sap-hana-database-manage.md).
- [Troubleshoot SAP HANA backup issues](sap-hana-database-instance-troubleshoot.md).
- See the [SAP HANA Backup support matrix](sap-hana-backup-support-matrix.md) for supported configurations and limitations.
