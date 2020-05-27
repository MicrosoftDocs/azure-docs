---
title: Tutorial - Backup AVS VMs with Azure Backup Server (MABS)
description: Learn to create and configure 
ms.topic: tutorial
ms.date: 05/04/2020
---




# Back up AVS VMs with Azure Backup Server

This article provides the steps to back up VMware VMs running on Azure VMware Solution (AVS) using Azure Backup Server.

This article explains how to:

> [!div class="checklist"]
> * Set up a secure channel so that Azure Backup Server can communicate with VMware servers over HTTPS.
> * Add the account credentials to Azure Backup.
> * Add the vCenter to Azure Backup Server.
> * Set up a protection group that contains the VMware VMs you want to back up, specify backup settings, and schedule the backup.

## Create a secure connection to the vCenter Server

By default, Azure Backup Server communicates with VMware servers over HTTPS. To set up the HTTPS connection download the VMware Certificate Authority (CA) certificate, and import it on the Azure Backup Server.

### Set up the certificate


1. From the Azure Backup Server, in a browser, enter the vSphere Web Client URL. 

   > [!NOTE]
   > If the login page doesn't appear, verify the connection and browser proxy settings.

   ![vSphere Web Client](../backup/media/backup-azure-backup-server-vmware/vsphere-web-client.png)


1. On the vSphere Web Client login page, click **Download trusted root CA certificates**.

1. Save the **download.zip** file to the Azure Backup Server machine and then extract its contents to the **certs** folder, which contains the:

    - Root certificate file with an extension that begins with a numbered sequence like .0 and .1.

    - CRL file has an extension that begins with a sequence like .r0 or .r1. 

1. In the **certs** folder, right-click the root certificate file, select **Rename** to change the extension to **.crt**.

   The file icon changes to one that represents a root certificate.

2. Right-click the root certificate and select **Install Certificate**.

3. In the **Certificate Import Wizard**, select **Local Machine** as the destination for the certificate, and then click **Next**. 

   > [!NOTE]
   > If asked, confirm that you want to allow changes to the computer.

   ![Wizard Welcome](../backup/media/backup-azure-backup-server-vmware/certificate-import-wizard1.png)

1. Select **Place all certificates in the following store**, and then click **Browse** to choose the certificate store.

   ![Certificate storage](../backup/media/backup-azure-backup-server-vmware/cert-import-wizard-local-store.png)

1. Select **Trusted Root Certification Authorities** as the destination folder and then click **OK**.

1. Review the settings and then click **Finish** to start importing the certificate.

   ![Verify certificate is in the proper folder](../backup/media/backup-azure-backup-server-vmware/cert-wizard-final-screen.png)

1.  After the certificate import is confirmed, sign in to the vCenter Server to confirm that your connection is secure.

### Enable TLS 1.2 on MABS Server

VMWare 6.7 onwards had TLS enabled as communication protocol. 
1. Copy the following registry settings and paste into Notepad, and then save the file as TLS.REG without the .txt extension.


```text
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\.NETFramework\v2.0.50727]

   "SystemDefaultTlsVersions"=dword:00000001

   "SchUseStrongCrypto"=dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\.NETFramework\v4.0.30319]

   "SystemDefaultTlsVersions"=dword:00000001

   "SchUseStrongCrypto"=dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v2.0.50727]

   "SystemDefaultTlsVersions"=dword:00000001

   "SchUseStrongCrypto"=dword:00000001

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319]

   "SystemDefaultTlsVersions"=dword:00000001

   "SchUseStrongCrypto"=dword:00000001
```

2.  Right-click the TLS.REG and select **Merge** or **Open** to add them to the registry.

## Add the provisioning IP Address for AVS ESXi hosts on Azure Backup Server

During preview, AVS does not resolve the ESX host from the virtual machine deployed in the virtual network. You’ll need to perform additional step to add host file entry on the MABS virtual machine.

### Identify IP Address for ESXi hosts

1.  Open the browser and log in to the vCenter URLs. You can find the URLs in the [Connect to the local vCenter of your private cloud](https://review.docs.microsoft.com/en-us/azure/azure-vmware/tutorial-access-private-cloud?branch=release-preview-vmware#connect-to-the-local-vcenter-of-your-private-cloud) article.

1.  In the vSphere Client, select the cluster that you plan to enable backup.

    ![vSphere Client - select host](media/vsphere-client-select-host.png)

1.  Select **Configure** > **Networking** > **VMKernel adapters**, and under the list of devices identify the network adapter that has **Provisioning** role enabled and note down the **IP Address** and ESXi hostname.

    ![VMKernel adapters - provisioning enabled devices](media/vmkernel-adapters-provisioning-enabled.png)

1.  Repeat the previous step for each ESXi host under every cluster that you plan to enable backup.

### Update the host file on the Azure Backup Server 

1. Open **Notepad** as administrator.

1. Select **File > Open** and search for c:\Windows\System32\Drivers\etc\hosts.

1.  Add the entry for each ESXi host along with the IP Address that you identified in the above section.

    ![ESXi host and IP address](media/localhost-esxi-host-ip-addresses.png)

1. Save your changes and close Notepad.

## Add the account on Azure Backup Server

   > [!NOTE]
   > The user added must have the proper backup privileges to perform backup and restores from Backup Server. Ensure the user you are adding has the privileges required by reviewing the [Add a new user account in VMware server](https://docs.microsoft.com/en-us/system-center/dpm/back-up-vmware?view=sc-dpm-2019&branch=master#add-a-new-user-account-in-vmware-server).

1. Open Azure Backup Server, and in the Azure Backup Server console, select **Management** > **Production Servers** > **Manage VMware**.

   ![Azure Backup Server console](../backup/media/backup-azure-backup-server-vmware/add-vmware-credentials.png)


1. In the **Manage Credentials** dialog box, click **Add**.

   ![Azure Backup Server Manage Credentials dialog box](../backup/media/backup-azure-backup-server-vmware/mabs-manage-credentials-dialog.png)

1. In **Add Credential**, enter a name and a description for the new credential, and specify the username and password you defined on the VMware server. 

   > [!NOTE]
   > If the VMware server and Azure Backup Server aren't in the same domain, specify the domain in the user name.

   ![Azure Backup Server Add Credential dialog box](../backup/media/backup-azure-backup-server-vmware/mabs-add-credential-dialog2.png)


1. Click **Add** to add the new credential.

   ![Azure Backup Server Manage Credentials dialog box](../backup/media/backup-azure-backup-server-vmware/new-list-of-mabs-creds.png)

## Add the vCenter Server to Azure Backup Server

1.  In the Azure Backup Server console, click **Management** > **Production Servers** > **Add**.

   ![Open Production Server Addition Wizard](../backup/media/backup-azure-backup-server-vmware/add-vcenter-to-mabs.png)

1.  Select **VMware Servers** and then click **Next**.

   ![Production Server Addition Wizard](../backup/media/backup-azure-backup-server-vmware/production-server-add-wizard.png)

1.  Specify the IP address of the vCenter.

   ![Specify VMware server](../backup/media/backup-azure-backup-server-vmware/add-vmware-server-provide-server-name.png)

1.  In **SSL Port**, enter the port used to communicate with the vCenter.
    
   > [!TIP]
   > Port 443 is the default port, but you can change it if your vCenter listens on a different port.

1.  In **Specify Credential**, select the credential that you created in the previous section. 

1.  Click **Add** to add the vCenter to the servers list, and then click **Next**.

   ![Add VMWare server and credential](../backup/media/backup-azure-backup-server-vmware/add-vmware-server-credentials.png)

1.  On the **Summary** page, click **Add** to add the vCenter to Azure Backup Server. 

The new server is added immediately; no agent is needed on the vCenter.

   ![Add VMware server to Azure Backup Server](../backup/media/backup-azure-backup-server-vmware/tasks-screen.png)

1.  On the **Finish** page, verify the settings and click **Close**.

   ![Finish page](../backup/media/backup-azure-backup-server-vmware/summary-screen.png)

   You should see the vCenter server listed under the Production Server with type as VMware Server and Agent Status as Ok. If you see the agent status as unknown, click **Refresh**.

 
## Configure a protection group

Add VMware VMs for backup. Protection groups gather multiple VMs and apply the same data retention and backup settings to all VMs in the group.

1. In the Azure Backup Server console, click **Protection**, \> **New**.

   ![Open the Create New Protection Group wizard](../backup/media/backup-azure-backup-server-vmware/open-protection-wizard.png)

1. In the **Create New Protection Group** wizard welcome page, click **Next**.

   ![Create New Protection Group wizard dialog box](../backup/media/backup-azure-backup-server-vmware/protection-wizard.png)

1.  On the **Select Protection group type** page, select **Servers** and then click **Next**. The **Select group members** page appears.

2.  In **Select group members**, select the VMs (or VM folders) that you want to back up. Then click **Next**.

    -   When you select a folder, or VMs or folders inside that folder are also selected for backup. You can uncheck folders or VMs you don't want to back up.

    If a VM or folder is already being backed up, you can't select it. This ensures that duplicate recovery points aren't created for a VM.

    ![Select group members](../backup/media/backup-azure-backup-server-vmware/server-add-selected-members.png)

1.  In **Select Data Protection Method** page, enter a name for the protection group, and protection settings. To back up to Azure, set short-term protection to **Disk** and enable online protection. Then click **Next**.

    ![Select data protection method](../backup/media/backup-azure-backup-server-vmware/name-protection-group.png)

1.  In **Specify Short-Term Goals**, specify how long you want to keep data backed up to disk.

    -   In **Retention Range**, specify how many days disk recovery points should be kept.

    -   In **Express Full Backup**, specify how often disk recovery points are taken.

        -   Click **Modify** to change the times/dates when short-term backups occur.

    ![Specify short-term goals](../backup/media/backup-azure-backup-server-vmware/short-term-goals.png)

1.  In **Review Disk Allocation**, review the disk space provided for the VM backups. for the VMs.

    -   The recommended disk allocations are based on the retention range you specified, the type of workload, and the size of the protected data. Make any changes required, and then click **Next**.

    -   **Data size:** Size of the data in the protection group.

    -   **Disk space:** The recommended amount of disk space for the protection group. If you want to modify this setting, you should allocate total space that is slightly larger than the amount that you estimate each data source grows.

    -   **Storage pool details:** Shows the status of the storage pool, including total and remaining disk size.

    ![Review disk allocation](../backup/media/backup-azure-backup-server-vmware/review-disk-allocation.png)

   > [!NOTE]
   > In some scenarios, the Data Size reported is higher than actual VM size. We are aware of the issue and currently investigating it.

1.  In **Choose Replica Creation Method** page, specify how you want to take the initial backup, and then click **Next**.

    -   The default is **Automatically over the network** and **Now**.

    -   If you use the default, we recommend that you specify an off-peak time. Choose **Later** and specify a day and time.

    -   For large amounts of data or less-than-optimal network conditions, consider replicating the data offline by using removable media.

    ![Choose replica creation method](../backup/media/backup-azure-backup-server-vmware/replica-creation.png)

1.  In **Consistency Check Options**, select how and when to automate the consistency checks. Then click **Next**.

    -   You can run consistency checks when replica data becomes inconsistent, or on a set schedule.

    -   If you don't want to configure automatic consistency checks, you can run a manual check. To do this, right-click the protection group \> **Perform Consistency Check**.

2.  In **Specify Online Protection Data** page, select the VMs or VM folders that you want to back up. You can select the members individually, or click **Select All** to choose all members. Then click **Next**.

   ![Specify online protection data](../backup/media/backup-azure-backup-server-vmware/select-data-to-protect.png)

1.  On the **Specify Online Backup Schedule** page, specify how often you want to back up data from local storage to Azure.

    -   Cloud recovery points for the data will be generated according to the schedule. Then click **Next**.

    -   After the recovery point is generated, it is transferred to the Recovery Services vault in Azure.

    ![Specify online backup schedule](../backup/media/backup-azure-backup-server-vmware/online-backup-schedule.png)

1.  On the **Specify Online Retention Policy** page, indicate how long you want to keep the recovery points that are created from the daily/weekly/monthly/yearly backups to Azure. then click **Next**.

    -   There's no time limit for how long you can keep data in Azure.

    -   The only limit is that you can't have more than 9999 recovery points per protected instance. In this example, the protected instance is the VMware server.

    ![Specify online retention policy](../backup/media/backup-azure-backup-server-vmware/retention-policy.png)

1.  On the **Summary** page, review the settings, and then click **Create Group**.

    ![Protection group member and setting summary](../backup/media/backup-azure-backup-server-vmware/protection-group-summary.png)

## Monitor the status of the backup using the MABS console

Once you configure the protection group to backup AVS VMs, you can monitor the status of backup job and alert using the MABS console. Here is what you can monitor:

-   On the **Alerts** tab in the **Monitoring** pane you can monitor errors, warnings, and general information for a protection group, for a specific protected computer, or by message severity. You can view active and inactive alerts and set up email notifications

-   On the **Jobs** tab in the **Monitoring** pane you can view jobs initiated  by MABS for a specific protected data source or protection group. You can follow job progress or check resources consumed by jobs.

-   In the **Protection** task area, you can check the status of volumes and shares in protection group, and check configuration settings such as recovery settings, disk allocation, and backup schedule.

-   In the **Management** task area you can view the **Disks, Online** and **Agents**, tab to check the status of disks in the storage pool, registration to Azure and deployed DPM agent status.

![A screenshot of a social media post Description automatically generated](media/dd24c9e1232d0646ffcee92bb3313232.png)

## Restore VMware VMs using the MABS console

In the MABS Administrator Console, there are two ways to find recoverable data - search or browse. When recovering data, you may, or may not want to restore data or a VM to the same location. For this reason, MABS supports three recovery options for VMware VM backups:

-   **Original location recovery (OLR)** - Use OLR to restore a protected VM to its original location. You can restore a VM to its original location only if no disks have been added or deleted, since the backup occurred. If disks have been added or deleted, you must use alternate location recovery.

-   **Alternate location recovery (ALR)** - When the original VM is missing, or you don't want to disturb the original VM, recover the VM to an alternate location. To recover a VM to an alternate location, you must provide the location of an ESXi host, resource pool, folder, and the storage datastore and path. To help differentiate the restored VM from the original VM, MABS appends "-Recovered" to the name of the VM.

-   **Individual file location recovery (ILR)** - If the protected VM is a Windows Server VM, individual files/folders inside the VM can be recovered using MABS’s ILR capability. To recover individual files, see the procedure later in this article. Restoring an individual file from a VM is available only for Windows VM and Disk Recovery Points.

### Restore a recovery point

1.  In the MABS Administrator Console, click Recovery view.

2.  Using the Browse pane, browse or filter to find the VM you want to recover. Once you select a VM or folder, the Recovery points for pane displays the available recovery points.

    ![](media/830d69318fe0bbe36217c27e4b48dfaa.png)

1.  In the **Recovery points for** field, use the calendar and drop-down menus to select a date when a recovery point was taken. Calendar dates in bold have available recovery points. Alternately, you can right-click the VM and select “show all recovery points”, then select the recovery point from the list.  
      
    > [!NOTE] 
    > For short term protection, select a disk based recovery point for faster recovery. After short term recovery points expires you will only see Online recovery points to recover from.

2.  Before recovering from an online recovery point – ensure the staging location contains enough free space to house the full uncompressed size of the VM you want to recover. The staging location can be viewed / changed by running the “configure subscription settings wizard” as seen on this page.     

    ![](media/24c785ed80c7fc03e3605d0279190599.png)

3.  On the tool ribbon, click **Recover** to open the **Recovery Wizard**.

   ![](media/317cbfc4432d80060f09a85979d0d946.png)

1.  Click **Next** to advance to the **Specify Recovery Options** screen.

2.  On the **Specify Recovery Options** screen, click Next to advance to the **Select Recovery type** screen. Enabling network bandwidth throttling is not supported for VMware workloads.

3.  On the **Select Recovery Type** screen, choose whether to recover to the original instance, or to a new location, and click **Next**.

    -   If you choose **Recover to original instance**, you don't need to make ny more choices in the wizard. The data for the original instance is used.

    -   If you choose **Recover as virtual machine on any host**, then on the **Specify Destination** screen, provide the information for **ESXi Host, Resource Pool, Folder,** and **Path**.

    ![](media/0eafba5e6a9498b3f3ac23935a6f6b2a.png)

1.  On the **Summary** screen, review your settings and click **Recover** to start the recovery process. The **Recovery status** screen shows the progression of the recovery operation.

### Restore an individual file from a VM

You can restore individual files from a protected VM recovery point. This feature is only available for Windows Server VMs. Restoring individual files is similar to restoring the entire VM, except you browse into the VMDK and find the file(s) you want, before starting the recovery process. To recover an individual file or select files from a Windows Server VM.

> [!NOTE]
> Restoring an individual file from a VM is available only for Windows VM and Disk Recovery Points.

1.  In the MABS Administrator Console, click **Recovery** view.

2.  Using the **Browse** pane, browse or filter to find the VM you want to recover. Once you select a VM or folder, the Recovery points for pane displays the available recovery points.

    ![A screenshot of a social media post Description automatically generated](media/57ada96ec78d9c944168d7e42a269758.png)

1.  In the **Recovery Points for:** pane, use the calendar to select the date that contains the desired recovery point(s). Depending on how the backup policy has been configured, dates can have more than one recovery point. Once you've selected the day when the recovery point was taken, make sure you've chosen the correct **Recovery time**. If the selected date has multiple recovery points, choose your recovery point by selecting it in the Recovery time drop-down menu. Once you chose the recovery point, the list of recoverable items appears in the **Path:** pane.

2.  To find the files you want to recover, in the **Path** pane, double-click the item in the **Recoverable item** column to open it. Select the file, files, or folders you want to recover. To select multiple items, press the **Ctrl** key while selecting each item. Use the **Path** pane to search the list of files or folders appearing in the **Recoverable Item** column. **Search list below** does not search into subfolders. To search through subfolders, double-click the folder. Use the **Up** button to move from a
    child folder into the parent folder. You can select multiple items (files and folders), but they must be in the same parent folder. You cannot recover items from multiple folders in the same recovery job.

    ![A screenshot of a social media post Description automatically generated](media/7aadb9ecced37f3844b59dbf8489b356.png)

1.  When you have selected the item(s) for recovery, in the Administrator Console tool ribbon, click **Recover** to open the **Recovery Wizard**. In the Recovery Wizard, the **Review Recovery Selection** screen shows the selected items to be recovered.

2.  On the **Specify Recovery Options** screen, if you want to enable network bandwidth throttling, click **Modify**. To leave network throttling disabled, click **Next**. No other options on this wizard screen are available for VMware VMs. If you choose to modify the network bandwidth throttle, in the Throttle dialog, select **Enable network bandwidth usage throttling** to turn it on. Once enabled, configure the **Settings** and **Work Schedule**.

3.  On the **Select Recovery Type** screen, click **Next**. You can only recover your file(s) or folder(s) to a network folder.

4.  On the **Specify Destination** screen, click **Browse** to find a network location for your files or folders. MABS creates a folder where all recovered items are copied. The folder name has the prefix, MABS_day-month-year. When you select a location for the recovered files or  folder, the details for that location (Destination, Destination path, and available space) are provided.

    ![](media/158a045ceeef09fcd7ff746fa3d3d30d.png)

1.  On the **Specify Recovery Options** screen, choose which security setting to apply. You can opt to modify the network bandwidth usage throttling, but throttling is disabled by default. Also, **SAN Recovery** and **Notification** are not enabled.

2.  On the **Summary** screen, review your settings and click **Recover** to start the recovery process. The **Recovery status** screen shows the progression of the recovery operation.

## Next steps

