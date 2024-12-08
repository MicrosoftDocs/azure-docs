---
title: Configure SAP ASE (Sybase) database backup on Azure VMs using Azure Backup
description: In this article, learn how to configure backup for SAP ASE (Sybase) databases that are running on Azure virtual machines.
ms.topic: how-to
ms.date: 11/21/2024 
ms.service: azure-backup
ms.custom:
  - ignite-2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up SAP ASE (Sybase) database on Azure VMs via Azure Backup

This article describes how to configure backup for SAP Adaptive Server Enterprise (ASE) (Sybase) databases that are running on Azure virtual machines (VMs) on the Azure portal.

>[!Note]
>- Currently, the SAP ASE Public Preview is available only in non-US public regions. This feature will be available in US public regions soon. Learn about the [supported regions](sap-ase-backup-support-matrix.md#scenario-support-for-sap-ase-sybase-databases-on-azure-vms).
>- Learn about the [supported configurations and scenarios for SAP ASE database backup](sap-ase-backup-support-matrix.md) on Azure VMs.

## Prerequisites

Before you set up the SAP ASE database for backup, review the following prerequisites:
- Identify or create a Recovery Services vault in the same region and subscription as the VM running SAP ASE.
- Allow connectivity from the VM to the internet, so that it can reach Azure.
- The combined length of the SAP ASE Server VM name and the Resource Group name doesn't exceed 84 characters for Azure Resource Manager (ARM) VMs (and 77 characters for classic VMs). This limitation is because the service reserves some characters. 
- VM has python >= 3.6.15 (recommended- Python3.10) and python's requests module should be installed. Default sudo python3 should run python 3.6.15 or newer version. Validate by running python3 and **sudo python3** in your system and check which python version it runs by default. It should run the required version. You can change the version by linking python3 to python 3.6.15 or higher.
- Run the SAP ASE backup configuration script (preregistration script) in the virtual machine where ASE is installed, as the root user. This script gets the ASE system ready for backup. Learn more [about the preregistration script  workflow](#preregistration-script-workflow).
- Run the preregistration script with the -sn or --skip-network-checks parameter, if your ASE setup uses Private Endpoints. Learn [how to run the preregistration script](#run-the-preregistration-script).
- Assign the following privileges and settings for the backup operation:
  
  | Privilege/ Setting | Description |
  | --- | --- |
  | Operator role | Enable this **ASE database role** for the database user to create a custom database user for the backup and restore operations and pass it in the preregistration script. |
  | **Map external file** privilege | Enable this role to allow database file access. |
  | **Own any database** privilege |Allows differential backups. The **Allow incremental dumps** for the database should be **True**. |
  | **Trunc log on chkpt** privilege | Disable this privilege for all databases that you want to protect using the **ASE Backup**. Allows you to back up the database log to recovery services vault. Learn more about the [SAP note - 2921874 - "trunc log on chkpt" in databases with HADR - SAP ASE - SAP for Me](https://me.sap.com/notes/0002921874). |

  >[!Note]
  >Log backups aren't supported for the Master database. For other system databases, log backups can only be supported if the database's log files are stored separately from its data files. By default, system databases are created with both data and log files in the same database device, which prevents log backups. To enable log backups, the database administrator must change the location of the log files to a separate device.

- Use the Azure built-in roles to configure backup- assignment of roles and scope to the resources. The following Contributor role allows you to run the **Configure Protection** operation on the database VM.

  | Resource (Access control) | Role | User, group, or service principal |
  | --- | --- | --- |
  | Source Azure VM running the ASE database | Virtual Machine Contributor | Allows you to configure the backup operation. |

## Preregistration script workflow

The preregistration script is a Python script that you run on the VM where the SAP ASE database is installed. The script performs the following tasks:

1. Creates the necessary group where the **plugin users** is added.
2. Installs and updates required packages such as waagent, Python, curl, unzip, Libicu, and PythonXML.
3. Verifies the status of waagent, checks `wireserver` and `IMDS connectivity`, and tests **TCP connectivity** to  Microsoft Entra ID.
4. Confirms if the geographic region is supported.
5. Checks for available free space for logs, in the `waagent` directory, and `/opt` directory.
6. Validates if the Adaptive Server Enterprise (ASE) version is supported.
7. Logs in the SAP instance using the provided username and password, enabling dump history, which is necessary for backup and restore operations.
8. Ensures that the OS version is supported.
9. Installs and updates required Python modules such as requests and cryptography.
10. Creates the workload configuration file.
11. Sets up the required directories under `/opt` for backup operations.
12. Encrypts the password and securely stores it in the virtual machine. 

## Run the preregistration script

To execute the preregistration script for SAP ASE database backup, run the following bash commands:

1. [Download the ASE Preregistration Script file](https://aka.ms/preregscriptsapase).
2. Copy the file to the virtual machine (VM).

  
   >[!NOTE]
   >Replace `<script name>` in the following commands with the name of the script file you downloaded and copied to the VM.

3. Convert the script to the Unix format.

   ```bash
    dos2unix <script name>
   ```

4. Change the permission of the script file.

   >[!Note]
   >Before you run the following command, replace `/path/to/script/file` with the actual path of the script file in the VM.

   ```bash
    sudo chmod -R 777 /path/to/script/file
   ```

5. Update the script name.

   ```bash
    sudo ./<script name> -us
   ```

6. Run the script.

    >[!Note]
    >Before running the following command, provide the required values for the placeholders.

    ```bash
     sudo ./<script name> -aw SAPAse --sid <sid> --sid-user <sid-user> --db-port <db-port> --db-user <db-user> --db-host <private-ip-of-vm> --enable-striping <enable-striping>
    ```

   List of parameters:

   - `<sid>`: Name of the required ASE server (required)
   - `<sid-user>`: OS Username under which ASE System runs (for example, `syb<sid>`) (required)
   - `<db-port>`: The Port Number of the ASE Database server (for example, 4901) (required)
   - `<db-user>`: The ASE Database Username for ODBC connection (for example, `sapsa`) (required)
   - `<db-host>`: Private IP address of the VM (required)
   - `<enable-striping>`: Enable striping (choices: ['true', 'false'], required)
   - `<stripes-count>`: Stripes count (default: '4')
   - `<compression-level>`: Compression level (default: '101')

    >[!NOTE]
    >To find the `<private-ip-of-vm>`, open the VM in the Azure portal and check the private IP under the **Networking** section.

7. View details of the parameters.

   ```bash
    sudo ./<script name> -aw SAPAse --help
   ```

   After running the script, you're prompted to provide the database password. Provide the password and press **ENTER** to proceed.

## Create a custom role for Azure Backup

To create a custom role for Azure Backup, run the following bash commands:

>[!Note]
>After each of these commands, ensure that you run the command *`go`* to execute the statement.

1. Sign in to the database using the SSO role user.

   ```bash
    isql -U sapsso -P <password> -S <sid> -X
   ```

2. Create a new role.

   ```bash
    create role azurebackup_role
   ```

3. Grant operator role to the new role.

   ```bash
    grant role oper_role to azurebackup_role
   ```

4. Enable granular permissions.

   ```bash
    sp_configure 'enable granular permissions', 1
   ```

5. Sign in to the database using the SA role user.

   ```bash
    isql -U sapsa -P <password> -S <sid> -X
   ```

6. Switch to the master database.

   ```bash
    use master
   ```

7. Grant **map external file** privilege to the new role.

   ```bash
    grant map external file to azurebackup_role
   ```

8. Sign in again using the SSO role user.

   ```bash
    isql -U sapsso -P <password> -S <sid> -X
   ```

9. Create a new user.

   ```bash
    sp_addlogin backupuser, <password>
   ```

10. Grant the custom role to the user.

    ```bash
     grant role azurebackup_role to backupuser

    ```
11. Set the custom role as the default for the user.

    ```bash
     sp_modifylogin backupuser, "add default role", azurebackup_role
    ```

12. Grant **own any database** privilege to the custom role as **SA** user.

    ```bash
     grant own any database to azurebackup_role
    ```

13. Sign in to the database as **SA** user again.

    ```bash
     isql -U sapsa -P <password> -S <sid> -X
    ```
14. Enable file access.

    ```bash
     sp_configure "enable file access", 1
    ```

15. Enable differential backup on the database.

    ```bash
     use master
     go
     sp_dboption <database_name>, 'allow incremental dumps', true
     go
    ```

16. Disable **trunc log on chkpt** on the database.

    ```bash
     use master
     go
     sp_dboption <database_name>, 'trunc log on chkpt', false
     go
    ```

## Establish network connectivity

For all operations, an SAP ASE database running on an Azure VM requires connectivity to the Azure Backup service, Azure Storage, and Microsoft Entra ID. This connectivity can be achieved by using private endpoints or by allowing access to the required public IP addresses or FQDNs. Not allowing proper connectivity to the required Azure services might lead to failure in operations like database discovery, configuring backup, performing backups, and restoring data.

The following table lists the various alternatives you can use for establishing connectivity:

| Option | Advantages | Disadvantages |
| --- | --- | --- |
| Private endpoints | Allow backups over private IPs in the virtual network. <br><br> Provide granular control on the network and vault side. | 	Incurs [standard private endpoint costs](https://azure.microsoft.com/pricing/details/private-link/). |
| Network Security Group (NSG) service tags | Easier to manage because the range changes are automatically merged. <br><br> No additional costs. | Used with NSGs only. <br><br> Provides access to the entire service. |
| Azure Firewall FQDN tags | Easier to manage since the required FQDNs are automatically managed. | Used with Azure Firewall only. |
| Allow access to service FQDNs/IPs | No additional costs. <br><br> Works with all network security appliances and firewalls. <br><br> You can also use service endpoints for Storage. However, for Azure Backup and Microsoft Entra ID, you need to assign the access to the corresponding IPs/FQDNs. | A broad set of IPs or FQDNs might be required to be accessed. |
| [Virtual Network Service Endpoint](/azure/virtual-network/virtual-network-service-endpoints-overview) | Used for Azure Storage. <br><br> Provides large benefit to optimize performance of data plane traffic. | Can't be used for Microsoft Entra ID, Azure Backup service. |
| Network Virtual Appliance | Used for Azure Storage, Microsoft Entra ID, Azure Backup service. <br><br> **Data plane** <br> - Azure Storage: `*.blob.core.windows.net`, `*.queue.core.windows.net`, `*.blob.storage.azure.net` <br><br> **Management plane** <br> - Microsoft Entra ID: Allow access to FQDNs mentioned in sections 56 and 59 of [Microsoft 365 Common and Office Online](/microsoft-365/enterprise/urls-and-ip-address-ranges?view=o365-worldwide&preserve-view=true#microsoft-365-common-and-office-online). <br> - Azure Backup service: `.backup.windowsazure.com` <br><br> Learn more [about Azure Firewall service tags](/azure/firewall/fqdn-tags). | Adds overhead to data plane traffic and decrease throughput/performance. |

The following sections detail about the usage of the connectivity options.

### Private endpoints

Private endpoints allow you to connect securely from servers in a virtual network to your Recovery Services vault. The private endpoint uses an IP from the VNET address space for your vault. The network traffic between your resources in the virtual network and the vault travels over your virtual network and a private link on the Microsoft backbone network. This eliminates exposure from the public internet. Learn  more on [private endpoints for Azure Backup](private-endpoints.md).

>[!Note]
>- Private endpoints are supported for Azure Backup and Azure storage. Microsoft Entra ID has support for private end-points in this preview. Until they are generally available, Azure backup supports setting up proxy for Microsoft Entra ID so that no outbound connectivity is required for ASE VMs. For more information, see the [proxy support section](backup-azure-sap-hana-database.md#use-an-http-proxy-server-to-route-traffic).
>- The download operation for SAP ASE Pre-registration script (ASE workload scripts) requires Internet access. However, on VMs with Private Endpoint (PE) enabled, the pre-registration script can't download these workload scripts directly. So, it’s necessary to download the script on a local VM or another VM with internet access, and then use SCP or any other transfer method to move it to the PE enabled VM.

### Network Security Group tags

If you use Network Security Groups (NSG), use the AzureBackup service tag to allow outbound access to Azure Backup. In addition to the Azure Backup tag, you also need to allow connectivity for authentication and data transfer by creating similar [NSG rules](/azure/virtual-network/network-security-groups-overview#service-tags) for Microsoft Entra ID and Azure Storage (Storage). 

To create a rule for the Azure Backup tag, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to **Network security groups** and select **the network security group**.
2. On the **Settings** blade, select **Outbound security rules**.
3. Select **Add**.
4. Enter all the required details for [creating a new rule](/azure/virtual-network/manage-network-security-group#security-rule-settings). Ensure the **Destination** is set to **Service Tag** and **Destination service tag** is set to `AzureBackup`.
5.	Select **Add** to save the newly created outbound security rule.

You can similarly create NSG outbound security rules for Azure Storage and Microsoft Entra ID. Learn more [about service tags](/azure/virtual-network/service-tags-overview).

### Azure Firewall tags

If you're using Azure Firewall, create an application rule by using the AzureBackup [Azure Firewall FQDN tag](/azure/firewall/fqdn-tags). This allows all outbound access to Azure Backup.
 
>[!Note]
>Azure Backup currently doesn't support the TLS inspection enabled Application Rule on Azure Firewall.

### Allow access to service IP ranges

If you choose to allow access service IPs, see the [IP ranges in the JSON file](https://www.microsoft.com/download/confirmation.aspx?id=56519). You need to allow access to IPs corresponding to Azure Backup, Azure Storage, and Microsoft Entra ID.

### Allow access to service FQDNs

You can also use the following FQDNs to allow access to the required services from your servers:

| Service | Domain names to be accessed | Ports |
| --- | --- | --- |
| Azure Backup | `*.backup.windowsazure.com` | 443 |
| Azure Storage | `*.blob.core.windows.net` <br><br> `*.queue.core.windows.net` <br><br> `*.blob.storage.azure.net` | 443 |
| Microsoft Entra ID | `*.login.microsoft.com` <br><br> Allow access to FQDNs under sections 56 and 59 according to [this article](/office365/enterprise/urls-and-ip-address-ranges#microsoft-365-common-and-office-online). | 443 <br><br> As applicable. |

#### Use an HTTP proxy server to route traffic

>[!Note]
>Currently, the HTTP Proxy for Microsoft Entra ID traffic is only supported for the SAP ASE database. If you need to remove outbound connectivity requirements (for Azure Backup and Azure Storage traffic) for database backups via Azure Backup in ASE VMs, use other options, such as private endpoints.

#### Use an HTTP proxy server for Microsoft Entra ID traffic

To use an HTTP proxy server to route traffic for Microsoft Entra ID, follow these steps:

1. In the database, go to the `opt/msawb/bin` folder.
2. Create a new JSON file named `ExtensionSettingsOverrides.json`.
3. Add a key-value pair to the JSON file as follows:

      ```json
      {
         "UseProxyForAAD":true,
         "UseProxyForAzureBackup":false,
         "UseProxyForAzureStorage":false,
         "ProxyServerAddress":"http://xx.yy.zz.mm:port"
      }
      ```

4. Change the permissions and ownership of the file as follows:

      ```bash
      chmod 750 ExtensionSettingsOverrides.json
      chown root:msawb ExtensionSettingsOverrides.json
      ```

>[!Note]
>No restart of any service is required. The Azure Backup service will attempt to route the Microsoft Entra ID traffic via the proxy server mentioned in the JSON file.

#### Use outbound rules

If the **Firewall** or **NSG** setting block the `management.azure.com` domain from Azure Virtual Machine, snapshot backups will fail.

Create the following outbound rule and allow the domain name to back up the database. Learn [how to create the outbound rules](/azure/machine-learning/how-to-access-azureml-behind-firewall).

- **Source**: IP address of the VM.
- **Destination**: Service Tag.
- **Destination Service Tag**: AzureResourceManager

  :::image type="content" source="./media/sap-ase-database-backup/use-outbound-rules.png" alt-text="Screenshot shows the database outbound rules settings." lightbox="./media/sap-ase-database-backup/use-outbound-rules.png":::

[!INCLUDE [How to create a Recovery Services vault](../../includes/backup-create-rs-vault.md)]

## Enable Cross Region Restore
     
In the Recovery Services vault, you can enable [Cross Region Restore](backup-azure-recovery-services-vault-overview.md). Learn [how to turn on Cross Region Restore](backup-create-rs-vault.md#set-cross-region-restore).

:::image type="content" source="./media/sap-ase-database-backup/enable-cross-region-restore.png" alt-text="Screenshot shows how to enable Cross Region Restore in the Recovery Services vault. " lightbox="./media/sap-ase-database-backup/enable-cross-region-restore.png":::

## Discover the databases

To discover the SAP ASE databases, follow these steps:

1. Go to the **Recovery Services Vault**, and then select **+ Backup**.

   :::image type="content" source="./media/sap-ase-database-backup/initiate-database-backup.png" alt-text="Screenshot shows how to start the SAP database backup." lightbox="./media/sap-ase-database-backup/initiate-database-backup.png"::: 

2. On the **Backup Goal**, select **SAP ASE (Sybase) in Azure VM (preview)** as the datasource type.

   :::image type="content" source="./media/sap-ase-database-backup/select-data-source-type.png" alt-text="Screenshot shows the selection of the data source type." lightbox="./media/sap-ase-database-backup/select-data-source-type.png":::
 
3. Select **Start Discovery**. This initiates discovery of unprotected Linux VMs in the vault region.

     :::image type="content" source="./media/sap-ase-database-backup/start-database-discovery.png" alt-text="Screenshot shows how to start the discovery of the database." lightbox="./media/sap-ase-database-backup/start-database-discovery.png":::

   >[!Note]
   >- After discovery, unprotected VMs appear in the portal, listed by name and resource group.
   >- If a VM isn't listed as expected, check if it's already backed up in a vault.
   >- Multiple VMs can have the same name but they belong to different resource groups.
 
4. On the **Select Virtual Machines** blade, download the pre-post script that provides permissions for the Azure Backup service to access the SAP ASE VMs for database discovery.
5. Run the script on each VM hosting SAP ASE databases that you want to back up.
6. After you run the script on the VMs, on the **Select Virtual Machines** blade, select the *VMs*, and then select **Discover DBs**.

   Azure Backup discovers all SAP ASE databases on the VM. During discovery, Azure Backup registers the VM with the vault, and installs an extension on the VM. No agent is installed on the database.

     :::image type="content" source="./media/sap-ase-database-backup/select-database.png" alt-text="screenshot shows how to select a database for backup configuration from the discovered list." lightbox="./media/sap-ase-database-backup/select-database.png"::: 

## Configure the SAP ASE (Sybase) database backup

To configure the backup operation for the SAP ASE database, follow these steps:


1.	On the **Backup Goal** blade, under **Step 2**, select **Configure Backup**.
 
     :::image type="content" source="./media/sap-ase-database-backup/configure-backup.png" alt-text="Screenshot shows how to start the backup configuration." lightbox="./media/sap-ase-database-backup/configure-backup.png":::

2.Under the **Backup Policy**, select **Create a new policy** for the databases. 

   :::image type="content" source="./media/sap-ase-database-backup/create-backup-policy.png" alt-text="Screenshot shows how to start creating the backup policy." lightbox="./media/sap-ase-database-backup/create-backup-policy.png":::

   A backup policy defines when backups are taken, and how long they're retained.

   - A policy is created at the vault level.
   - Multiple vaults can use the same backup policy, but you must apply the backup policy to each vault.

3. On the **Policy name**, provide a name for the new policy.

     :::image type="content" source="./media/sap-ase-database-backup/add-backup-policy-name.png" alt-text="Screenshot shows how to provide a name for the new backup policy." lightbox="./media/sap-ase-database-backup/add-backup-policy-name.png":::
 

4. On the **Full Backup policy**, select a **Backup Frequency**, and then select **Daily** or **Weekly** as per the requirement.

   - **Daily**: Select the **hour** and **time zone** in which the backup job begins.

     >[!Note]
     >- You must run a full backup. You can't turn off this option.
     >- Go to Full Backup policy to view the policy settings.
     >- You can't create differential backups for daily full backups.

   - **Weekly**: Select the **day of the week**, **hour**, and **time zone** in which the backup job runs.

   The following screenshot shows the backup schedule for full backups.

     :::image type="content" source="./media/sap-ase-database-backup/set-backup-rules.png" alt-text="Screenshot shows the configuration of backup rules." lightbox="./media/sap-ase-database-backup/set-backup-rules.png":::


5. On the **Retention Range**, define the retention range for the full backup.
   >[!Note]
   >- By default all options are selected. Clear any retention range limits you don't want to use, and set those that you want.
   >- The minimum retention period for any type of backup (full/differential/log) is seven days.
   >- Recovery points are tagged for retention based on their retention range. For example, if you select a daily full backup, only one full backup is triggered each day.
   >- The backup for a specific day is tagged and retained based on the weekly retention range and setting.
   >- The monthly and yearly retention ranges behave in a similar way.

6. On the **Full Backup policy**, select **OK** to accept the settings.
7. Select the **Differential Backup** to add a differential policy.

8. On the **Differential Backup policy**, select **Enable** to open the frequency and retention controls.

   >[!Note]
   >- At most, you can trigger one differential backup per day.
   >- Differential backups can be retained for a maximum of 180 days. If you need longer retention, you must use full backups.

9. Select **OK** to save the policy and return to the **Backup policy** page.

10. Select **Log Backup** to add a transactional log backup policy.

11. On the **Log Backup**, select **Enable** to set the frequency and retention controls.

     >[!Note]
     >- Log backups only begin to flow after a successful full backup is completed.
     >- Each log backup is chained to the previous full backup to form a recovery chain. This full backup is retained until the retention of the last log backup has expired. This might mean that the full backup is retained for an extra period to make sure all the logs can be recovered. Let's assume a user has a weekly full backup, daily differential and 2 hour logs. All of them are retained for 30 days. But, the weekly full can be really cleaned up/deleted only after the next full backup is available, that is, after 30 + 7 days. For example, a weekly full backup happens on Nov 16th. According to the retention policy, it should be retained until Dec 16th. The last log backup for this full happens before the next scheduled full, on Nov 22nd. Until this log is available until Dec 22nd, the Nov 16th full can't be deleted. So, the Nov 16th full is retained until Dec 22nd.

12. On the **Configure Backup**, select the new policy under **Backup Policy**, and then select **Add**.
13. Select **Configure backup**.
14. On the **Select items to backup**, select the Databases for protection, and then select **Next**.

    :::image type="content" source="./media/sap-ase-database-backup/select-database-items-for-backup.png" alt-text="Screenshot shows the selection of the database items for backup." lightbox="./media/sap-ase-database-backup/select-database-items-for-backup.png":::
  

15. Review  the backup configuration.

    :::image type="content" source="./media/sap-ase-database-backup/select-enable-backup.png" alt-text="Screenshot shows the completion of backup configuration." lightbox="./media/sap-ase-database-backup/select-enable-backup.png":::

16. Select **Enable Backup** to start the backup operation.

## Run an on-demand backup

To run on-demand backups, follow these steps:

1.	Go to the **Recovery Services vault** and select **Backup items**.
2.	On the Backup Items blade, select the **Backup Management Type** as **SAP ASE (Sybase) in Azure VM**.
3.	Select **view details** of Database for on-demand backup.

    :::image type="content" source="media/sap-adaptive-server-enterprise-db-manage/view-details.png" alt-text="Screenshot showing how to view details." lightbox="media/sap-adaptive-server-enterprise-db-manage/view-details.png":::

4.	Select **Backup now** for taking on-demand backup.

     :::image type="content" source="media/sap-adaptive-server-enterprise-db-manage/take-on-demand-backup.png" alt-text="Screenshot showing how to take on-demand backup." lightbox="media/sap-adaptive-server-enterprise-db-manage/take-on-demand-backup.png":::

5. On the **Backup Now** pane, choose the type of backup that you want to perform, and then select **OK**. The retention period of this backup is determined by the type of on-demand backup you want to run.
   - *On-demand full backups* are retained for a minimum of 45 days and a maximum of 99 years.
   - *On-demand differential* backups are retained as per the *log retention* set in the policy.

    :::image type="content" source="media/sap-adaptive-server-enterprise-db-manage/choose-backup.png" alt-text="Screenshot showing how to choose the type of backup you want to perform." lightbox="media/sap-adaptive-server-enterprise-db-manage/choose-backup.png":::


## Next step

- [Restore the SAP ASE database on Azure VMs (preview)](sap-ase-database-restore.md)
- [Manage the SAP ASE database on Azure VMs (preview)](sap-ase-database-manage.md)
