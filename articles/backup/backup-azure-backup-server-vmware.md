---
title: Use Azure Backup Server to protect VMware Server | Microsoft Docs
description: Back up a VMware Server to Azure or disk, with Azure Backup Server. Use this article to protect your VMware workload.
services: backup
documentationcenter: ''
author: markgalioto
manager: carmonm


ms.assetid: 6b131caf-de85-4eba-b8e6-d8a04545cd9d
ms.service: backup
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 04/20/2017
ms.author: markgal;

---
# Back up VMware server to Azure

This article explains how to configure an Azure Backup Server to protect VMware server workload. This article assumes you already have Azure Backup Server installed. If you do not have Azure Backup Server installed, see the article, [Prepare to back up workloads using Azure Backup Server](backup-azure-microsoft-azure-backup.md).

Azure Backup Server can back up, or protect, VMware vCenter server versions 6.0 and 5.5.


## Create a secure connection to the vCenter Server

By default Azure Backup Server communicates with vCenter servers via HTTPS channel. To enable the secure communication, it is recommended that you install the VMware Certificate Authority (CA) certificate on the Azure Backup Server. If you don't require secure communication, and would prefer to disable the HTTPS requirement, see the section, [Disable secure communication protocol](backup-azure-backup-server-vmware.md#disable-secure-communication-protocol). To create a secure connection between Azure Backup Server and the vCenter server, import the trusted certificate on the Azure Backup Server.

Typically you use a browser on the Azure Backup Server machine to connect to the vCenter server via the vSphere Web Client. The first time you use the Azure Backup Server's browser to connect to the vCenter server, the connection isn't secure. The following image shows the unsecured connection.

![example of unsecured connection to VMware server](./media/backup-azure-backup-server-vmware/unsecure-url.png)

To fix this issue, and create a secure connection, download the trusted root CA certificates.

1. In the browser on the Azure Backup Server, type the URL to the vSphere Web Client.

  The vSphere Web Client login page appears.

  ![vsphere web client](./media/backup-azure-backup-server-vmware/vsphere-web-client.png)

  At the bottom of the information for administrators and developers, is the link to **Download trusted root CA certificates**.

  ![link to download the CA trusted root certificates](./media/backup-azure-backup-server-vmware/vmware-download-ca-cert-prompt.png)

  If you don't see the vSphere Web Client login page, check your browser's proxy settings.

2. Click **Download trusted root CA certificates**.

  The vCenter server downloads a file to your local computer. The file's name is **download**. Depending on your browser, you receive a message asking whether to open or save the file.

  ![download message when certificates are downloaded](./media/backup-azure-backup-server-vmware/download-certs.png)

3. Save the file to a location on the Azure Backup Server. When you save the file, add the filename extension .zip.

  The file is a .zip file that contains the information about the certificates. Adding the .zip extension allows you to use extraction tools.

4. Right-click **download.zip** and select Extract All to extract the contents.

  The zipped file extracts its contents to a folder named **certs**. In the certs folder are two types of files. The root certificate file has an extension like: .0, .1, or .*number*. The CRL file has an extension that begins with .r0, .r1, and so on. The CRL file is associated with a certificate.

  ![download file extracted locally ](./media/backup-azure-backup-server-vmware/extracted-files-in-certs-folder.png)

5. In the **certs** folder, right-click the root certificate file and click **Rename**.

  ![rename root certificate ](./media/backup-azure-backup-server-vmware/rename-cert.png)

  Change the root certificate's extension to .crt. When you are asked if you're sure you want to change the extension - because you could change the file's function, click Yes or OK. The icon for the file changes to icon for a root certificate.

6. Right-click the root certificate and from the pop-up menu, select **Install Certificate**.

  The Certificate Import Wizard opens.

7. On the Certificate Import Wizard, select **Local Machine** as the destination for the certificate, and click **Next** to continue.

  ![certificate dialog with error ](./media/backup-azure-backup-server-vmware/certificate-import-wizard1.png)

  If you are asked if you want to allow changes to the computer, click Yes or OK, to all the changes.

8. On the Certificate Store screen, select **Place all certificates in the following store** and click **Browse** to choose the certificate store.

  ![certificate dialog with error ](./media/backup-azure-backup-server-vmware/cert-import-wizard-local-store.png)

  The Select Certificate Store dialog opens.

  ![certificate dialog with error ](./media/backup-azure-backup-server-vmware/cert-store.png)

9. Select **Trusted Root Certification Authorities** as the destination folder for the certificates, and click **OK**.

  ![certificate dialog with error ](./media/backup-azure-backup-server-vmware/certificate-store-selected.png)

  The chosen certificate store shows in the **Certificate Import Wizard**. Click **Next**.

  ![certificate dialog with error ](./media/backup-azure-backup-server-vmware/certificate-import-wizard2.png)

10. On the Completing the Certificate Import Wizard screen, verify the certificate is in the desired folder, and click **Finish** to complete the wizard.

  ![certificate dialog with error ](./media/backup-azure-backup-server-vmware/cert-wizard-final-screen.png)

  A dialog appears letting you know if the import was successful.

11. Log in to the vCenter server to check that your connection is secure.

  If you have problems importing the certificate and cannot establish a secure connection, consult the VMware vSphere documentation on [Obtaining Server Certificates](http://pubs.vmware.com/vsphere-60/index.jsp#com.vmware.wssdk.dsg.doc/sdk_sg_server_certificate_Appendixes.6.4.html).

  If you have secure boundaries within your organization, and don't want to enable HTTPs protocol, use the following procedure to disable the secure communications.

### Disable secure communication protocol

If your organization doesn't require secure communications protocol (HTTPS), use the following steps to disable HTTPS. To disable the default behavior, create a registry key that ignores the default behavior.

1. Copy and paste the following text into a .txt file.

  ```
Windows Registry Editor Version 5.00
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Microsoft Data Protection Manager\VMWare]
"IgnoreCertificateValidation"=dword:00000001
```
2. Save the file with the name, **DisableSecureAuthentication.reg**, to your Azure Backup Server.

3. Double-click the file to activate the registry entry.


## Create a role and user account on the vCenter Server

On the vCenter Server, a role is a predefined set of privileges. A server administrator on the vCenter Server creates the roles and pairs user accounts with the roles to assign permissions. To establish the necessary user credentials to back up the vCenter Server, create a role with specific privileges and associate the user account with the role.

Azure Backup Server uses a user name and password to authenticate with the vCenter server. Azure Backup Server uses these credentials as authentication for all backup operations.

To add a vCenter Server role and privileges for a backup administrator:

1. Log in to the vCenter Server, and in the **Navigator** click **Administration**.

  ![certificate dialog with error ](./media/backup-azure-backup-server-vmware/vmware-navigator-panel.png)

2. In the **Administration** section, select **Roles** and in the **Roles** panel click the Add role icon, (the + symbol).

  ![certificate dialog with error ](./media/backup-azure-backup-server-vmware/vmware-define-new-role.png)

  The **Create Role** dialog opens.

  ![certificate dialog with error ](./media/backup-azure-backup-server-vmware/vmware-define-new-role-priv.png)

3. In the **Create Role** dialog, in the **Role name** field, type *BackupAdminRole*. The role name can be whatever you like, but it should be recognizable for the role's purpose.

4. Select the privileges for the appropriate version of vCenter, and click **OK**. The following table identifies the privileges required for vCenter 6.0 and vCenter 5.5.

  When selecting the privileges, click the parent label's chevron to expand the parent and view the child privileges. Selecting the needed VirtualMachine privileges, requires going several 'levels' deep. You don't need to select all child privileges within a parent privilege.

  ![certificate dialog with error ](./media/backup-azure-backup-server-vmware/cert-add-privilege-expand.png)

  After clicking **OK**, the new role appears in the list on the Roles panel.

|Privileges for vCenter 6.0| Privileges for vCenter 5.5|
|--------------------------|---------------------------|
|Datastore.AllocateSpace   | Datastore.AllocateSpace|
|Global.ManageCustomFields | Global.ManageCustomerFields|
|Global.SetCustomFields    |   |
|Host.Local.CreateVM       | Network.Assign |
|Network.Assign            |  |
|Resource.AssignVMToPool   |  |
|VirtualMachine.Config.AddNewDisk  | VirtualMachine.Config.AddNewDisk   |
|VirtualMachine.Config.AdvanceConfig| VirtualMachine.Config.AdvancedConfig|
|VirtualMachine.Config.ChangeTracking| VirtualMachine.Config.ChangeTracking |
|VirtualMachine.Config.HostUSBDevice||
|VirtualMachine.Config.QueryUnownedFiles|    |
|VirtualMachine.Config.SwapPlacement| VirtualMachine.Config.SwapPlacement |
|VirtualMachine.Interact.PowerOff| VirtualMachine.Interact.PowerOff |
|VirtualMachine.Inventory.Create| VirtualMachine.Inventory.Create |
|VirtualMachine.Provisioning.DiskRandomAccess| |
|VirtualMachine.Provisioning.DiskRandomRead|VirtualMachine.Provisioning.DiskRandomRead |
|VirtualMachine.State.CreateSnapshot| VirtualMachine.State.CreateSnapshot|
|VirtualMachine.State.RemoveSnapshot|VirtualMachine.State.RemoveSnapshot |
</br>



## Create vCenter Server user account and permissions

Once the role with privileges exists, create a user account. The user account has a name and password, which provides the credentials used for authentication.

1. To create a user account, in the vCenter Server Navigator, click **Users and Groups**.

  ![certificate dialog with error ](./media/backup-azure-backup-server-vmware/vmware-userandgroup-panel.png)

  The Users and Groups panel appears.

  ![certificate dialog with error ](./media/backup-azure-backup-server-vmware/usersandgroups.png)

2. In the vCenter Users and Groups panel, select the **Users** tab, and click the Add users icon (the + symbol).

  The New User dialog opens.

3. In the New User dialog, fill out the fields and click **OK**. For this example, type **BackupAdmin** for the user name. The password should be a strong password.

  ![certificate dialog with error ](./media/backup-azure-backup-server-vmware/vmware-new-user-account.png)

  The new user account appears in the list.

4. To associate the user account with the role, on the Navigator, click **Global Permissions**. On the Global Permissions panel, select the **Manage** tab and click the Add icon (the + symbol).

  ![certificate dialog with error ](./media/backup-azure-backup-server-vmware/vmware-add-new-perms.png)

  The Global Permissions Root - Add Permission dialog opens.

5. In the **Global Permission Root - Add Permission** dialog, click **Add** to choose the user or group.

  ![certificate dialog with error ](./media/backup-azure-backup-server-vmware/vmware-add-new-global-perm.png)

  The Select Users/Groups dialog opens.

6. In the **Select Users/Groups** dialog, choose **BackupAdmin** and click **Add**.

  The user account in the Users field has the format *domain*`\`*user name*. If you want to use a different domain, choose it from the Domain list.

  ![certificate dialog with error ](./media/backup-azure-backup-server-vmware/vmware-assign-account-to-role.png)

  Click **OK** to add the selected users to the Add Permission dialog.

7. Now that you've identified the user, assign the user to the role. In the Assigned Role area, from the drop-down menu, select **BackupAdminRole** and click **OK**.

  ![certificate dialog with error ](./media/backup-azure-backup-server-vmware/vmware-choose-role.png)

  On the Manage tab of the Global Permissions, the new user account and the associated role appear in the list.


## Establish vCenter Server credentials on Azure Backup Server

Before you add the VMware server to Azure Backup Server, install [Update 1 for Microsoft Azure Backup Server](https://support.microsoft.com/help/3175529/update-1-for-microsoft-azure-backup-server).

1. To open Azure Backup Server, double-click the icon on the Azure Backup Server desktop.

  ![Azure Backup Server icon](./media/backup-azure-backup-server-vmware/mabs-icon.png)

  If you can't find the icon on the desktop, open Azure Backup Server from the list of installed apps. The Azure Backup Server app name is Microsoft Azure Backup.

2. In the Azure Backup Server console, click **Management**, then click **Production Servers**, and then in the tool ribbon, click **Manage VMware**.

  ![MABS console](./media/backup-azure-backup-server-vmware/add-vmware-credentials.png)

  The Manage Credentials dialog opens.

  ![MABS manage credentials dialog](./media/backup-azure-backup-server-vmware/mabs-manage-credentials-dialog.png)

3. In the Manage Credentials dialog, click **Add** to open the Add Credentials dialog.

4. In the Add Credentials dialog, type a name and description for the new credential; then specify the user name and password. The credential name, *Contoso Vcenter credential* in the example, is how you identify the credential in the following procedure. Use the same user name and password as was used in the vCenter Server. If the vCenter Server and Azure Backup Server are not in the same domain, specify the domain in the User name.

  ![MABS manage credentials dialog](./media/backup-azure-backup-server-vmware/mabs-add-credential-dialog2.png)

  Click **Add** to add the new credential to Azure Backup Server. The new credential appears in the list in the Manage Credentials dialog.
  ![MABS manage credentials dialog](./media/backup-azure-backup-server-vmware/new-list-of-mabs-creds.png)

5. To close the Manage Credentials dialog, click the **X** in the upper-right hand corner.


## Add the vCenter Server to Azure Backup Server

To open the Production Server Addition wizard

1. In the Azure Backup Server console, click **Management**, click **Production Server**, and then click **Add**.

  ![Production Server Addition wizard](./media/backup-azure-backup-server-vmware/add-vcenter-to-mabs.png)

  The Production Server Addition Wizard opens.

  ![Production Server Addition wizard](./media/backup-azure-backup-server-vmware/production-server-add-wizard.png)

2. On the Select Production Server type screen, select VMware Servers, and click **Next**.

3. In the Server Name/IP address, specify the fully qualified domain name (FQDN) or IP address of the VMware server. If all the ESXi servers are managed by the same vCenter, you can use the vCenter name .

  ![Production Server Addition wizard](./media/backup-azure-backup-server-vmware/add-vmware-server-provide-server-name.png)

4. In the **SSL Port** dialog, enter the port used to communicate with the VMware server. Use port 443, which is the default port, unless you know that a different port is required.

5. In the **Specify Credential** dialog, select the credential you created.

  ![Production Server Addition wizard](./media/backup-azure-backup-server-vmware/identify-creds.png)

6. Click **Add** to add the VMware server to the list of **Added VMware Servers**, and click **Next** to move to the next screen in the wizard.

  ![Production Server Addition wizard](./media/backup-azure-backup-server-vmware/add-vmware-server-credentials.png)

7. In the **Tasks** screen, click **Add** to add the specified VMware server to the Azure Backup Server.

  ![Production Server Addition wizard](./media/backup-azure-backup-server-vmware/tasks-screen.png)

  Since the VMware server backup is an agentless backup, adding the new server happens in seconds. The Finish screen shows you the results.

  ![Production Server Addition wizard](./media/backup-azure-backup-server-vmware/summary-screen.png)

  To add multiple vCenter Servers to the Azure Backup Server by repeating the preceding steps in this section.

After adding the vCenter Server to the Azure Backup Server, the next step is to create a protection group. The protection group specifies the various details for short or long-term retention, and it is where you define and apply the backup policy. The backup policy is the schedule for when backups are taken, and what is backed up.


## Configure a protection group

If you have not used System Center Data Protection Manager or Azure Backup Server before, see the topic, [Plan for disk backups](https://technet.microsoft.com/library/hh758026.aspx), to prepare your hardware environment. Once you check that you have proper storage, use the Create New Protection Group wizard to add VMware virtual machines.

1. In the Azure Backup Server console, click **Protection**, and in the tool ribbon, click **New** to open the Create New Protection Group wizard.

  ![Production Server Addition wizard](./media/backup-azure-backup-server-vmware/open-protection-wizard.png)

  The Create New Protection Group wizard opens.

  ![Production Server Addition wizard](./media/backup-azure-backup-server-vmware/protection-wizard.png)

  Click **Next** to advance to the **Select protection group type** screen.

2. On the Select Protection Group Type screen, select **Servers** and click **Next**.

3. On the Select Group Members screen, you can see the available members and the members that have been selected. Select the members you want to protect and click **Next**.

  ![Production Server Addition wizard](./media/backup-azure-backup-server-vmware/server-add-selected-members.png)

  When selecting a member, if you select a folder that contains other folders or VMs, those folders and VMs are also selected. The inclusion of the folders and VMs in the parent folder is called folder-level protection. You can exclude any folder or VM by de-selecting the checkbox.

  If a VM, or a folder containing a VM, is already protected to Azure, you cannot select that VM again. That is, once a VM is protected to Azure, it cannot be protected again, which prevents duplicate recovery points from being created for one VM. If you want to see which Azure Backup Server already protects a member, hover your mouse over the member, to see the name of the protecting server.

4. On the Select Data Protection Method screen, type a name for the protection group. Short-term protection (to disk) and online protection are selected. If you want to use online protection (to Azure), you must use short-term protection to disk. Click **Next** to proceed to the short-term protection range.

  ![Production Server Addition wizard](./media/backup-azure-backup-server-vmware/name-protection-group.png)

5. On the Specify Short-Term Goals screen, for **Retention Range**, specify the number of days you want to retain recovery points *stored to disk*. If you want to change the time and days when recovery points are taken, click **Modify**. The short-term recovery points are full backups. They are not incremental backups. When you are satisfied with the short-term goals, click **Next**.

  ![Production Server Addition wizard](./media/backup-azure-backup-server-vmware/short-term-goals.png)

6. On the Review Disk Allocation screen, review and if necessary, modify the disk space for the VMs. The recommended disk allocations are based on the retention range specified in the previous screen, the type of workload and the size of the protected data (identified in step 3).  

  - Data size - Size of the data in the protection group.
  - Disk space - The amount of disk space recommended for the protection group. If you want to modify this setting, you should allocate total space that is slightly larger than the amount you estimate each data source will grow.
  - Colocate data - If you enable colocation, multiple data sources in the protection can map to a single replica and recovery point volume. Colocation isn't supported for all workloads.
  - Automatically grow - If you enable this setting, if data in the protected group outgrows the initial allocation, DPM tries to increase the disk size by 25%.
  - Storage pool details - Shows the current status of the storage pool, including total and remaining disk size.

  ![Production Server Addition wizard](./media/backup-azure-backup-server-vmware/review-disk-allocation.png)

  When you are satisfied with the space allocation, click **Next**.

7. On the Choose Replica Creation Method screen, specify how you want to generate the initial copy, or replica, of the protected data on the Azure Backup Server.

  The default is **Automatically over the network** and **Now**. If you use the default, it is recommended you specify an off-peak time. Choose **Later** and specify a day and time.

  For large amounts of data or less-than-optimal network conditions, consider replicating the data offline using removable media.

  Once you have made your choices, click **Next**.

  ![Create New Protection Group wizard](./media/backup-azure-backup-server-vmware/replica-creation.png)

8. On the **Consistency Check Options** screen, select how and when to automate consistency checks. You can run consistency checks when replica data becomes inconsistent, or according to a set schedule.

  If you don't want to configure automatic consistency checking, you can run a manual check. In the Protection area of the Azure Backup Server console, right-click the protection group and select **Perform Consistency Check**.

  Click **Next** to move to the next screen.

9. On the **Specify Online Protection Data** screen, select the data source(s) that you want to protect. You can select the members individually, or click **Select All** to choose all members. Once you choose the members, click **Next**.

  ![Create New Protection Group wizard](./media/backup-azure-backup-server-vmware/select-data-to-protect.png)

10. On the **Specify Online Backup Schedule** screen, specify the schedule for generating recovery points from the disk backup. Once the recovery point is generated, it is transferred to the Recovery Services vault in Azure. When you are satisfied with the online backup schedule, click **Next**.

  ![Create New Protection Group wizard](./media/backup-azure-backup-server-vmware/online-backup-schedule.png)

11. On the Specify Online Retention Policy screen, indicate how long you want to retain the backup data in Azure. After defining the policy, click **Next**.

  ![Create New Protection Group wizard](./media/backup-azure-backup-server-vmware/retention-policy.png)

  There is no time limit for how long you can keep data in Azure. When storing recovery point data in Azure, the only limit is you cannot have more than 9999 recovery points per protected instance. In this example, the protected instance is the VMware server.

12. On the Summary screen, review the details for your protection group. Note the group members and the settings. When you are satisfied with the settings, click ** Create Group**.

  ![Create New Protection Group wizard](./media/backup-azure-backup-server-vmware/protection-group-summary.png)

## Next steps
If you use Azure Backup Server to protect VMware workloads, you may be interested in using Azure Backup Server to protect [Microsoft Exchange server](./backup-azure-exchange-mabs.md), a [Microsoft SharePoint farm](./backup-azure-backup-sharepoint-mabs.md), or a [SQL Server](./backup-azure-sql-mabs.md).

See [Troubleshoot Azure Backup Server](./backup-azure-mabs-troubleshoot.md) for information on problems registering the agent, configuring the protection group, and problems with backup jobs.
