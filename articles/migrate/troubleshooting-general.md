---
title: Troubleshoot Azure Migrate issues | Microsoft Docs
description: Provides an overview of known issues in the Azure Migrate service, and troubleshooting tips for common errors.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 07/11/2019
ms.author: raynew
---

# Troubleshoot Azure Migrate

## Troubleshoot common errors

[Azure Migrate](migrate-services-overview.md) provides Azure Migrate tools for assessment and migration, as well as third-party independent software vendor (ISV) offerings. This document provides help on troubleshooting errors with Azure Migrate, Azure Migrate: Server Assessment and Azure Migrate: Server Migration.

### I am using the appliance that continuously discovers my on-premises environment, but the VMs that are deleted in my on-premises environment are still being shown in the portal.

It takes up to 30 minutes for the discovery data gathered by the appliance to reflect in the portal. If you do not see up to date information even after 30 minutes, issue a refresh on the data using the following steps:

1. In Servers > Azure Migrate: Server Assessment, click **Overview**.
2. Under **Manage**, click on **Agent Health**
3. Click on the option to **Refresh agent**. You will see this below option below the list of agents.
4. Wait for the refresh operation to complete. Verify that you are able to see up to date information on your VMs.

### I do not the latest information on the on-premise VMs on the portal

It takes up to 30 minutes for the discovery data gathered by the appliance to reflect in the portal. If you do not see up to date information even after 30 minutes, issue a refresh on the data using the following steps:

1. In Servers > Azure Migrate: Server Assessment, click **Overview**.
2. Under **Manage**, click on **Agent Health**
3. Click on the option to **Refresh agent**. You will see this below option below the list of agents.
4. Wait for the refresh operation to complete. Verify that you are able to see up to date information on your VMs.

### Deletion of Azure Migrate projects and associated Log Analytics workspace

When you delete an Azure Migrate project, it deletes the migration project along with all the groups and assessments. However, if you have attached a Log Analytics workspace to the project, it does not automatically delete the Log Analytics workspace. This is because the same Log Analytics workspace might be used for multiple use cases. If you would like to delete the Log Analytics workspace as well, you need to do it manually.

1. Browse to the Log Analytics workspace attached to the project.
   a. If you have not deleted the migration project yet, you can find the link to the workspace from the project overview page in the Essentials section.

   ![LA Workspace](./media/troubleshooting-general/LA-workspace.png)

   b. If you already deleted the migration project,  click **Resource Groups** in the left pane in Azure portal and go to the Resource Group in which the workspace was created and then browse to it.
2. Follow the instructions [in this article](https://docs.microsoft.com/azure/azure-monitor/platform/delete-workspace) to delete the workspace.

### Migration project creation failed with error *Requests must contain user identity headers*

This issue can happen for users who do not have access to the Azure Active Directory (Azure AD) tenant of the organization. When a user is added to an Azure AD tenant for the first time, he/she receives an email invite to join the tenant. Users need to go to the email and accept the invitation to get successfully added to the tenant. If you are unable to see the email, reach out to a user who already has access to the tenant and ask them to resend the invitation to you using the steps specified [here](https://docs.microsoft.com/azure/active-directory/b2b/add-users-administrator#resend-invitations-to-guest-users).

Once the invitation email is received, you need to open the email and click the link in the email to accept the invitation. Once this is done, you need to sign out of Azure portal and sign-in again, refreshing the browser will not work. You can then try creating the migration project.

### I am unable to export the assessment report

If you are unable to export the assessment report from the portal, try using the below REST API to get a download URL for the assessment report.

1. Install *armclient* on your computer (if you don’t have it already installed):

   a. In an administrator Command Prompt window, run the following command:
    ```@powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"```

   b. In an administrator Windows PowerShell window, run the following command:
    ```choco install armclient```

2. Get the download URL for the assessment report using Azure Migrate REST API

   a.    In an administrator Windows PowerShell window, run the following command:
     ```armclient login```

        This opens the Azure login pop-up where you need to sign in to Azure.

   b.    In the same PowerShell window, run the following command to get the download URL for the assessment report (replace the URI parameters with the appropriate values, sample API request below)

       ```armclient POST https://management.azure.com/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.Migrate/projects/{projectName}/groups/{groupName}/assessments/{assessmentName}/downloadUrl?api-version=2018-02-02```

      Sample request and output:

      ```PS C:\WINDOWS\system32> armclient POST https://management.azure.com/subscriptions/8c3c936a-c09b-4de3-830b-3f5f244d72e9/r
   esourceGroups/ContosoDemo/providers/Microsoft.Migrate/projects/Demo/groups/contosopayroll/assessments/assessment_11_16_2
   018_12_16_21/downloadUrl?api-version=2018-02-02
   {
   "assessmentReportUrl": "https://migsvcstoragewcus.blob.core.windows.net/4f7dddac-f33b-4368-8e6a-45afcbd9d4df/contosopayrollassessment_11_16_2018_12_16_21?sv=2016-05-31&sr=b&sig=litQmHuwi88WV%2FR%2BDZX0%2BIttlmPMzfVMS7r7dULK7Oc%3D&st=2018-11-20T16%3A09%3A30Z&se=2018-11-20T16%3A19%3A30Z&sp=r",
   "expirationTime": "2018-11-20T22:09:30.5681954+05:30"```

3. Copy the URL from the response and open it in a browser to download the assessment report.

4. Once the report is downloaded, use Excel to browse to the downloaded folder and open the file in Excel to view it.

### Performance data for CPU, memory and disks is showing up as zeroes

Azure Migrate continuously profiles the on-premises environment to collect performance data of the on-premises VMs. If you have just started the discovery of your environment, you need to wait for at least a day for the performance data collection to be done. If an assessment is created without waiting for one day, the performance metrics will show up as zeroes. After waiting for a day, you can either create a new assessment or update the existing assessment by using the 'Recalculate' option in the assessment report.

### I specified an Azure geography, while creating a migration project, how do I find out the exact Azure region where the discovered metadata would be stored?

You can go to the **Essentials** section in the **Overview** page of the project to identify the exact location where the metadata is stored. The location is selected randomly within the geography by Azure Migrate and you cannot modify it. If you want to create a project in a specific region only, you can use the REST APIs to create the migration project and pass the desired region.

   ![Project location](./media/troubleshooting-general/geography-location.png)

## Appliance issues

### Deployment of Azure Migrate appliance for VMware failed with the error: The provided manifest file is invalid: Invalid OVF manifest entry.

1. Verify if Azure Migrate appliance OVA file is downloaded correctly by checking its hash value. Refer to the [article](https://docs.microsoft.com/azure/migrate/tutorial-assessment-vmware#verify-the-collector-appliance) to verify the hash value. If the hash value is not matching, download the OVA file again and retry the deployment.
2. If it still fails and if you are using VMware vSphere Client to deploy the OVF, try deploying it through vSphere Web Client. If it still fails, try using different web browser.
3. If you are using vSphere web client and trying to deploy it on vCenter Server 6.5 or 6.7, try to deploy the OVA directly on ESXi host by following the below steps:
   - Connect to the ESXi host directly (instead of vCenter Server) using the web client (https://<*host IP Address*>/ui)
   - Go to Home > Inventory
   - Click File > Deploy OVF template > Browse to the OVA and complete the deployment
4. If the deployment still fails, contact Azure Migrate support.

### Unable to select the Azure cloud in the appliance, fails with error "Azure cloud selection failed"

This is a known issue and a fix is available for the issue. Please download the [latest upgrade bits](https://docs.microsoft.com/azure/migrate/concepts-collector-upgrade#continuous-discovery-upgrade-versions) for the appliance and update the appliance to apply the fix.

### Appliance is not able to connect to the internet

This can happen when the machine you are using is behind a proxy. Make sure you provide the authorization credentials if the proxy needs one.
If you are using any URL-based firewall proxy to control outbound connectivity, be sure to add these required URLs to an allow list:

**URL** | **Purpose**  
--- | ---
*.portal.azure.com | Required to check connectivity with the Azure service and validate time synchronization issues.
*.oneget.org | Required to download the powershell based vCenter PowerCLI module.

**The appliance can't connect to the internet because of a certificate validation failure**

This can happen if you are using an intercepting proxy to connect to the Internet, and if you have not imported the proxy certificate on to the collector VM. You can import the proxy certificate using the steps detailed [here](https://docs.microsoft.com/azure/migrate/concepts-collector).

### Error 802: Date and time synchronization error

The server clock might be out-of-synchronization with the current time by more than five minutes. Change the clock time on the collector VM to match the current time, as follows:

1. Open an admin command prompt on the VM.
2. To check the time zone, run w32tm /tz.
3. To synchronize the time, run w32tm /resync.


### Error UnableToConnectToServer

Unable to connect to vCenter Server "Servername.com:9443" due to error: There was no endpoint listening at https://Servername.com:9443/sdk that could accept the message.

Check if you are running the latest version of the collector appliance, if not, upgrade the appliance to the [latest version](https://docs.microsoft.com/azure/migrate/concepts-collector).

If the issue still happens in the latest version, it could be because the collector machine is unable to resolve the vCenter Server name specified or the port specified is wrong. By default, if the port is not specified, collector will try to connect to the port number 443.

1. Try to ping the Servername.com from the collector machine.
2. If step 1 fails, try to connect to the vCenter server over IP address.
3. Identify the correct port number to connect to the vCenter.
4. Finally check if the vCenter server is up and running.

### Antivirus exclusions

To harden the Azure Migrate appliance, you need to exclude the following folders in the appliance from antivirus scanning:

- Folder that has the binaries for Azure Migrate Service. Exclude all sub-folders.
  %ProgramFiles%\ProfilerService  
- Azure Migrate Web Application. Exclude all sub-folders.
  %SystemDrive%\inetpub\wwwroot
- Local Cache for Database and log files. Azure migrate service needs RW access to this folder.
  %SystemDrive%\Profiler

## Dependency visualization issues

### I am unable to find the dependency visualization functionality for Azure Government projects.

Azure Migrate depends on Service Map for the dependency visualization functionality and since Service Map is currently unavailable in Azure Government, this functionality is not available in Azure Government.

### I installed the Microsoft Monitoring Agent (MMA) and the dependency agent on my on-premises VMs, but the dependencies are now showing up in the Azure Migrate portal.

Once you have installed the agents, Azure Migrate typically takes 15-30 mins to display the dependencies in the portal. If you have waited for more than 30 minutes, ensure that the MMA agent is able to talk to the OMS workspace by following the below steps:

For Windows VM:
1. Go to **Control Panel** and launch **Microsoft Monitoring Agent**
2. Go to the **Azure Log Analytics (OMS)** tab in the MMA properties pop-up
3. Ensure that the **Status** for the workspace is green.
4. If the status is not green, try removing the workspace and adding it again to MMA.
        ![MMA Status](./media/troubleshooting-general/mma-status.png)

For Linux VM, ensure that the installation commands for MMA and dependency agent had succeeded.

### What are the operating systems supported by MMA?

The list of Windows operating systems supported by MMA is [here](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-windows-operating-systems).
The list of Linux operating systems supported by MMA is [here](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-linux-operating-systems).

### What are the operating systems supported by dependency agent?

The list of Windows operating systems supported by dependency agent is [here](https://docs.microsoft.com/azure/monitoring/monitoring-service-map-configure#supported-windows-operating-systems).
The list of Linux operating systems supported by dependency agent is [here](https://docs.microsoft.com/azure/monitoring/monitoring-service-map-configure#supported-linux-operating-systems).

### I am unable to visualize dependencies in Azure Migrate for more than one hour duration?
Azure Migrate lets you visualize dependencies for up to one hour duration. Although, Azure Migrate allows you to go back to a particular date in the history for up to last one month, the maximum duration for which you can visualize the dependencies is up to 1 hour. For example, you can use the time duration functionality in the dependency map, to view dependencies for yesterday, but can only view it for a one hour window. However, you can use Azure Monitor logs to [query the dependency data](https://docs.microsoft.com/azure/migrate/how-to-create-group-machine-dependencies) over a longer duration.

### I am unable to visualize dependencies for groups with more than 10 VMs?
You can [visualize dependencies for groups](https://docs.microsoft.com/azure/migrate/how-to-create-group-dependencies) that have up to 10 VMs, if you have a group with more than 10 VMs, we recommend you to split the group in to smaller groups and visualize the dependencies.

### I installed agents and used the dependency visualization to create groups. Now post failover, the machines show "Install agent" action instead of "View dependencies"
* Post planned or unplanned failover, on-premises machines are turned off and equivalent machines are spun up in Azure. These machines acquire a different MAC address. They may acquire a different IP address based on whether the user chose to retain on-premises IP address or not. If both MAC and IP addresses differ, Azure Migrate does not associate the on-premises machines with any Service Map dependency data and asks user to install agents instead of viewing dependencies.
* Post test failover, the on-premises machines remain turned on as expected. Equivalent machines spun up in Azure acquire different MAC address and may acquire different IP address. Unless the user blocks outgoing Azure Monitor logs traffic from these machines, Azure Migrate does not associate the on-premises machines with any Service Map dependency data and asks user to install agents instead of viewing dependencies.

## Troubleshoot Azure readiness issues

**Issue** | **Fix**
--- | ---
Unsupported boot type | Azure does not support VMs with EFI boot type. It is recommended to convert the boot type to BIOS before you run a migration. <br/><br/>You can use [Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/tutorial-migrate-on-premises-to-azure) to do the migration of such VMs as it will convert the boot type of the VM to BIOS during the migration.
Conditionally supported Windows OS | The OS has passed its end of support date and needs a Custom Support Agreement (CSA) for [support in Azure](https://aka.ms/WSosstatement), consider upgrading the OS before migrating to Azure.
Unsupported Windows OS | Azure supports only [selected Windows OS versions](https://aka.ms/WSosstatement), consider upgrading the OS of the machine before migrating to Azure.
Conditionally endorsed Linux OS | Azure endorses only [selected Linux OS versions](../virtual-machines/linux/endorsed-distros.md), consider upgrading the OS of the machine before migrating to Azure.
Unendorsed Linux OS | The machine may boot in Azure, but no OS support is provided by Azure, consider upgrading the OS to an [endorsed Linux version](../virtual-machines/linux/endorsed-distros.md) before migrating to Azure
Unknown operating system | The operating system of the VM was specified as 'Other' in vCenter Server, due to which Azure Migrate cannot identify the Azure readiness of the VM. Ensure that the OS running inside the machine is [supported](https://aka.ms/azureoslist) by Azure before you migrate the machine.
Unsupported OS bitness | VMs with 32-bit OS may boot in Azure, but it is recommended to upgrade the OS of the VM from 32-bit to 64-bit before migrating to Azure.
Requires Visual Studio subscription. | The machines has a Windows client OS running inside it which is supported only in Visual Studio subscription.
VM not found for the required storage performance. | The storage performance (IOPS/throughput) required for the machine exceeds Azure VM support. Reduce storage requirements for the machine before migration.
VM not found for the required network performance. | The network performance (in/out) required for the machine exceeds Azure VM support. Reduce the networking requirements for the machine.
VM not found in the specified location. | Use a different target location before migration.
One or more unsuitable disks. | One or more disks attached to the VM do not meet the Azure requirements. For each disk attached to the VM, ensure that the size of the disk is < 4 TB, if not, shrink the disk size before migrating to Azure. Ensure that the performance (IOPS/throughput) needed by each disk is supported by Azure [managed virtual machine disks](https://docs.microsoft.com/azure/azure-subscription-service-limits#storage-limits).   
One or more unsuitable network adapters. | Remove unused network adapters from the machine before migration.
Disk count exceeds limit | Remove unused disks from the machine before migration.
Disk size exceeds limit | Azure supports disks with up to size 4 TB. Shrink disks to less than 4 TB before migration.
Disk unavailable in the specified location | Make sure the disk is in your target location before you migrate.
Disk unavailable for the specified redundancy | The disk should use the redundancy storage type defined in the assessment settings (LRS by default).
Could not determine disk suitability due to an internal error | Try creating a new assessment for the group.
VM with required cores and memory not found | Azure couldn't fine a suitable VM type. Reduce the memory and number of cores of the on-premises machine before you migrate.
Could not determine VM suitability due to an internal error. | Try creating a new assessment for the group.
Could not determine suitability for one or more disks due to an internal error. | Try creating a new assessment for the group.
Could not determine suitability for one or more network adapters due to an internal error. | Try creating a new assessment for the group.


## Collect logs

**How do I collect logs on the collector VM?**

Logging is enabled by default. Logs are located as follows:

- C:\Profiler\ProfilerEngineDB.sqlite
- C:\Profiler\Service.log
- C:\Profiler\WebApp.log

To collect Event Tracing for Windows, do the following:

1. On the collector VM, open a PowerShell command window.
2. Run **Get-EventLog -LogName Application | export-csv eventlog.csv**.

**How do I collect portal network traffic logs?**

1. Open the browser and navigate and sign in [to the portal](https://portal.azure.com).
2. Press F12 to start the Developer Tools. If needed, clear the setting **Clear entries on navigation**.
3. Click the **Network** tab, and start capturing network traffic:
   - In Chrome, select **Preserve log**. The recording should start automatically. A red circle indicates that traffic is being capture. If it doesn't appear, click the black circle to start
   - In Microsoft Edge/IE, recording should start automatically. If it doesn't, click the green play button.
4. Try to reproduce the error.
5. After you've encountered the error while recording, stop recording, and save a copy of the recorded activity:
   - In Chrome, right-click and click **Save as HAR with content**. This zips and exports the logs as a .har file.
   - In Microsoft Edge/IE, click the **Export captured traffic** icon. This zips and exports the log.
6. Navigate to the **Console** tab to check for any warnings or errors. To save the console log:
   - In Chrome, right-click anywhere in the console log. Select **Save as**, to export and zip the log.
   - In Microsoft Edge/IE, right-click on the errors and select **Copy all**.
7. Close Developer Tools.

## Collector error codes and recommended actions

| Error Code | Error name   | Message   | Possible causes | Recommended action  |
| --- | --- | --- | --- | --- |
| 601       | CollectorExpired               | Collector has expired.                                                        | Collector Expired.                                                                                    | Please download a new version of collector and retry.                                                                                      |
| 751       | UnableToConnectToServer        | Unable to connect to vCenter Server '%Name;' due to error: %ErrorMessage;     | Check the error message for more details.                                                             | Resolve the issue and try again.                                                                                                           |
| 752       | InvalidvCenterEndpoint         | The server '%Name;' is not a vCenter Server.                                  | Provide vCenter Server details.                                                                       | Retry the operation with correct vCenter Server details.                                                                                   |
| 753       | InvalidLoginCredentials        | Unable to connect to the vCenter Server '%Name;' due to error: %ErrorMessage; | Connection to the vCenter Server failed due to invalid login credentials.                             | Ensure that the login credentials provided are correct.                                                                                    |
| 754       | NoPerfDataAvailable           | Performance data not available.                                               | Check Statistics Level in vCenter Server. It should be set to 3 for performance data to be available. | Change Statistics Level to 3 (for 5 minutes, 30 minutes, and 2 hours duration) and try after waiting at least for a day.                   |
| 756       | NullInstanceUUID               | Encountered a machine with null InstanceUUID                                  | vCenter Server may have an inappropriate object.                                                      | Resolve the issue and try again.                                                                                                           |
| 757       | VMNotFound                     | Virtual machine is not found                                                  | Virtual machine may be deleted: %VMID;                                                                | Ensure that the virtual machines selected while scoping vCenter inventory exists during the discovery                                      |
| 758       | GetPerfDataTimeout             | VCenter request timed out. Message %Message;                                  | vCenter Server credentials are incorrect                                                              | Check vCenter Server credentials and ensure that vCenter Server is reachable. Retry the operation. If the issue persists, contact support. |
| 759       | VmwareDllNotFound              | VMWare.Vim DLL not found.                                                     | PowerCLI is not installed properly.                                                                   | Please check if PowerCLI is installed properly. Retry the operation. If the issue persists, contact support.                               |
| 800       | ServiceError                   | Azure Migrate Collector service is not running.                               | Azure Migrate Collector service is not running.                                                       | Use services.msc to start the service and retry the operation.                                                                             |
| 801       | PowerCLIError                  | VMware PowerCLI installation failed.                                          | VMware PowerCLI installation failed.                                                                  | Retry the operation. If the issue persists, install it manually and retry the operation.                                                   |
| 802       | TimeSyncError                  | Time is not in sync with the internet time server.                            | Time is not in sync with the internet time server.                                                    | Ensure that the time on the machine is accurately set for the machine's time zone and retry the operation.                                 |
| 702       | OMSInvalidProjectKey           | Invalid project key specified.                                                | Invalid project key specified.                                                                        | Retry the operation with correct project key.                                                                                              |
| 703       | OMSHttpRequestException        | Error while sending request. Message %Message;                                | Check project ID and key and ensure that endpoint is reachable.                                       | Retry the operation. If the issue persists, contact Microsoft Support.                                                                     |
| 704       | OMSHttpRequestTimeoutException | HTTP request timed out. Message %Message;                                     | Check project ID and key and ensure that endpoint is reachable.                                       | Retry the operation. If the issue persists, contact Microsoft Support.                                                                     |
