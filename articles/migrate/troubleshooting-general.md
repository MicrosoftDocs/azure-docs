---
title: Troubleshoot Azure Migrate issues | Microsoft Docs
description: Provides an overview of known issues in the Azure Migrate service, and troubleshooting tips for common errors.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 07/22/2019
ms.author: raynew
---

# Troubleshoot Azure Migrate

[Azure Migrate](migrate-services-overview.md) provides a hub of Microsoft tools for assessment and migration, as well as third-party independent software vendor (ISV) offerings. This document provides help on troubleshooting errors with Azure Migrate, Azure Migrate: Server Assessment and Azure Migrate: Server Migration.

## Azure Migrate project issues

### I am unable to find my existing Azure Migrate project.

There are [two versions](https://docs.microsoft.com/azure/migrate/migrate-services-overview#azure-migrate-versions) of Azure Migrate. Depending on the version in which you created the project, follow the steps below to find the project:

1. If you are looking for a project created with the pervious version (old experience) of Azure Migrate,  follow the below steps to find the project.

    1. Go to [Azure portal](https://portal.azure.com), search for **Azure Migrate**.
    2. On the Azure Migrate dashboard, you will see a banner that talks about accessing older projects. You will see this banner only if you have created a project with the old experience. Click the banner.

    ![Access existing projects](./media/troubleshooting-general/access-existing-projects.png)

    3. You will now see the list of existing projects created with the previous version of Azure Migrate.

2. If you are looking for a project created with the current version (new experience), follow the below steps to find the project.

    1. Go to [Azure portal](https://portal.azure.com), search for **Azure Migrate**.
    2. On the Azure Migrate dashboard, go to the **Servers** page on the left pane, and select **change** on the top-right corner:

    ![Switch to an existing Azure Migrate project](./media/troubleshooting-general/switch-project.png)

    3. Select the appropriate **Subscription** and **Migrate project**.

### I am unable to create a second Azure Migrate project.

Follow the below steps to create a new Azure Migrate project.

1. Go to [Azure portal](https://portal.azure.com), search for **Azure Migrate**.
2. On the Azure Migrate dashboard, go to the **Servers** page on the left pane, and select **change** on the top-right corner:

   ![Change Azure Migrate project](./media/troubleshooting-general/switch-project.png)

3. To create a new project, select **click here** as shown in the screenshot below:

   ![Create a second Azure Migrate project](./media/troubleshooting-general/create-new-project.png)

### Which Azure geographies are supported by Azure Migrate?

You can find the list for [VMware here](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-vmware#azure-migrate-projects) and for [Hyper-V here](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-hyper-v#azure-migrate-projects).

### Deletion of Azure Migrate projects and associated Log Analytics workspace

When you delete an Azure Migrate project, it deletes the migration project along with the metadata about discovered machines. However, if you have attached a Log Analytics workspace to the Server Assessment tool, it does not automatically delete the Log Analytics workspace. This is because the same Log Analytics workspace might be used for multiple use cases. If you would like to delete the Log Analytics workspace as well, you need to do it manually.

1. Browse to the Log Analytics workspace attached to the project.
     1. If you have not deleted the migration project yet, you can find the link to the workspace from the Server Assessment overview page in the Essentials section.

     ![LA Workspace](./media/troubleshooting-general/loganalytics-workspace.png)

     2. If you already deleted the migration project, select **Resource Groups** in the left pane in the Azure portal. Go to the Resource Group in which the workspace was created and then browse to it.
2. Follow the instructions [in this article](https://docs.microsoft.com/azure/azure-monitor/platform/delete-workspace) to delete the workspace.

### Migration project creation failed with error *Requests must contain user identity headers*

This issue can happen for users who do not have access to the Azure Active Directory (Azure AD) tenant of the organization. When a user is added to an Azure AD tenant for the first time, he/she receives an email invite to join the tenant. Users need to go to the email and accept the invitation to get successfully added to the tenant. If you are unable to see the email, reach out to a user who already has access to the tenant and ask them to resend the invitation to you using the steps specified [here](https://docs.microsoft.com/azure/active-directory/b2b/add-users-administrator#resend-invitations-to-guest-users).

Once the invitation email is received, you need to open the email and click the link in the email to accept the invitation. Once this is done, you need to sign out of Azure portal and sign in again, refreshing the browser will not work. You can then try creating the migration project.

## Appliance issues

### Deployment of Azure Migrate appliance for VMware failed with the error: The provided manifest file is invalid: Invalid OVF manifest entry.

1. Verify if Azure Migrate appliance OVA file is downloaded correctly by checking its hash value. Refer to the [article](https://docs.microsoft.com/azure/migrate/tutorial-assessment-vmware) to verify the hash value. If the hash value is not matching, download the OVA file again and retry the deployment.
2. If it still fails and if you are using VMware vSphere Client to deploy the OVF, try deploying it through vSphere Web Client. If it still fails, try using different web browser.
3. If you are using vSphere web client and trying to deploy it on vCenter Server 6.5 or 6.7, try to deploy the OVA directly on ESXi host by following the below steps:
   - Connect to the ESXi host directly (instead of vCenter Server) using the web client (https://<*host IP Address*>/ui).
   - Go to **Home** > **Inventory**.
   - Click **File** > **Deploy OVF template**. Browse to the OVA and complete the deployment.
4. If the deployment still fails, contact Azure Migrate support.

### Appliance is not able to connect to the internet

This can happen when the machine you are using is behind a proxy. Make sure you provide the authorization credentials if the proxy needs one.
If you are using any URL-based firewall proxy to control outbound connectivity, be sure to add these required URLs to an allow list:

Scenario | URL list
--- | ---
Server Assessment for VMware | [Here](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-vmware#assessment-url-access-requirements)
Server Assessment for Hyper-V | [Here](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-hyper-v#assessment-appliance-url-access)
Server Migration for VMware (agentless) | [Here](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-vmware#agentless-migration-url-access-requirements)
Server Migration for VMware (agent-based) | [Here](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-vmware#replication-appliance-url-access)
Server Migration for Hyper-V | [Here](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-hyper-v#migration-hyper-v-host-url-access)

If you are using an intercepting proxy to connect to the Internet, you need to import the proxy certificate on to the appliance VM. You can import the proxy certificate using the steps detailed [here](https://docs.microsoft.com/azure/migrate/concepts-collector).

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


### The appliance could not be registered successfully to the Azure Migrate project (Error ID: 60052)

This error is due to insufficient permissions on the Azure account used to register the appliance. Ensure that the Azure user account used to register the appliance has at least 'Contributor' access on the subscription. [Learn more](https://docs.microsoft.com/azure/migrate/migrate-appliance#appliance-deployment-requirements) about the required Azure roles and permissions.

### The appliance could not be registered successfully to the Azure Migrate project (Error ID: 60039)

The Azure Migrate project selected by you to register the appliance is not found, causing the registration to fail. Go to the Azure portal and check if the project exists in your resource group. If the project doesn't exist, create a new Azure Migrate project in your resource group and register the appliance again. [Learn more](https://docs.microsoft.com/azure/migrate/how-to-add-tool-first-time#create-a-project-and-add-a-tool) about creating a new Azure Migrate project.

### Azure key vault management operation failed (Error ID: 60030, 60031)

Ensure that the Azure user account used to register the appliance has at least 'Contributor' access on the subscription. Also, check if the account has access to the Key Vault specified in the error message and retry the operation. If the issue persists, contact Microsoft support. [Learn more](https://docs.microsoft.com/azure/migrate/migrate-appliance#appliance-deployment-requirements) about the required Azure roles and permissions.

### Discovery could not be initiated due to the error. The operation failed for the given list of hosts or clusters (Error ID: 60028)

Discovery couldn't be started on the hosts listed in the error due to a problem in accessing or retrieving VM information; the rest of the hosts you had added have been successfully added. Add again the hosts in the error using the **Add host** option. If there is a validation error, review the remediation guidance to fix the errors and try **Save and start discovery** again.

### Azure Active Directory (AAD) operation failed. The error occurred while creating or updating the AAD application (Error ID: 60025)

The Azure user account used to register the appliance does not have access to the AAD application specified in the error message. Check whether you are the owner of the AAD application. [Learn more](https://docs.microsoft.com/azure/migrate/migrate-appliance#appliance-deployment-requirements) about AAD application permissions.


## Discovery issues

### I started discovery but I don't see the discovered VMs on Azure portal. Server Assessment and Server Migration tiles show a status of "Discovery in progress"
After starting discovery from the appliance, allow some time for the discovered machines to show up on the Azure portal. It takes around 15 minutes for a VMware discovery, and around 2 minutes per added host for a Hyper-V discovery. If you continue to see "Discovery in progress" even after this time, click **Refresh** on the **Servers** tab. This should show the count of the discovered servers in the Server Assessment and Server Migration tiles.


### I am using the appliance that continuously discovers my on-premises environment, but the VMs that are deleted in my on-premises environment are still being shown in the portal.

It takes up to 30 minutes for the discovery data gathered by the appliance to reflect in the portal. If you do not see up-to-date information even after 30 minutes, issue a refresh on the data using the following steps:

1. In Servers > Azure Migrate: Server Assessment, click **Overview**.
2. Under **Manage**, click on **Agent Health**
3. Click on the option to **Refresh agent**. You will see this below option below the list of agents.
4. Wait for the refresh operation to complete. Verify that you are able to see up-to-date information on your VMs.

### I don't the latest information on the on-premise VMs on the portal

It takes up to 30 minutes for the discovery data gathered by the appliance to reflect in the portal. If you don't see up-to-date information even after 30 minutes, issue a refresh on the data using the following steps:

1. In Servers > Azure Migrate: Server Assessment, click **Overview**.
2. Under **Manage**, click on **Agent Health**
3. Click on the option to **Refresh agent**. You will see this option below the list of agents.
4. Wait for the refresh operation to complete. You should now see up-to-date information on your VMs.

### Unable to connect to host(s) or cluster as the server name cannot be resolved. WinRM error code: 0x803381B9 (Error ID: 50004)
This error occurs if the DNS serving the appliance cannot resolve the cluster or host name you provided. If you see this error on the cluster, try providing the fully qualified domain name of the cluster.

You may see this error for hosts in a cluster as well. In this case, the appliance could connect to the cluster. But the cluster has returned the host names that aren't fully qualified domain names.

To resolve this error, update the hosts file on the appliance adding a mapping of the IP address and host names.
1. Open Notepad as administrator user. Open the file C:\Windows\System32\Drivers\etc\hosts.
2. Add the IP address and host name in a row. Repeat for each host or cluster where you see this error.
3. Save and close hosts file.
4. You can check if the appliance can connect to the hosts using the appliance management app. After 30 minutes, you should be able to see the latest information on these hosts on the Azure portal.


## Assessment issues

### Azure Readiness issues

Issue | Remediation
--- | ---
Unsupported boot type | Azure does not support VMs with EFI boot type. We recommend you to convert the boot type to BIOS before you run a migration. <br/><br/>You can use Azure Migrate Server Migration to do the migration of such VMs as it will convert the boot type of the VM to BIOS during the migration.
Conditionally supported Windows OS | The OS has passed its end of support date and needs a Custom Support Agreement (CSA) for [support in Azure](https://aka.ms/WSosstatement), consider upgrading the OS before migrating to Azure.
Unsupported Windows OS | Azure supports only [selected Windows OS versions](https://aka.ms/WSosstatement), consider upgrading the OS of the machine before migrating to Azure.
Conditionally endorsed Linux OS | Azure endorses only [selected Linux OS versions](../virtual-machines/linux/endorsed-distros.md), consider upgrading the OS of the machine before migrating to Azure.
Unendorsed Linux OS | The machine may boot in Azure, but no OS support is provided by Azure, consider upgrading the OS to an [endorsed Linux version](../virtual-machines/linux/endorsed-distros.md) before migrating to Azure
Unknown operating system | The operating system of the VM was specified as 'Other' in vCenter Server, due to which Azure Migrate cannot identify the Azure readiness of the VM. Ensure that the OS running inside the machine is [supported](https://aka.ms/azureoslist) by Azure before you migrate the machine.
Unsupported OS bitness | VMs with 32-bit OS may boot in Azure, but it is recommended to upgrade the OS of the VM from 32-bit to 64-bit before migrating to Azure.
Requires Visual Studio subscription. | The machine has a Windows client OS running inside it, which is supported only in Visual Studio subscription.
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

### I am unable to specify Enterprise Agreement (EA) as an Azure offer in the assessment properties?
Azure Migrate: Server Assessment currently does not support Enterprise Agreement (EA) based pricing. The workaround is to use ‘Pay-As-You-Go’ as the Azure offer and use the ‘Discount’ property to specify any custom discount that you receive. [Learn more about how you can customize an assessment](https://aka.ms/migrate/selfhelp/eapricing).

### Why does Server Assessment mark my Linux VMs 'Conditionally ready'. Is there anything I need to do to fix this?
There is a known gap in Server Assessment where it is unable to detect the minor version of the Linux OS installed on the on-premises VMs (for example, for RHEL 6.10, currently Server Assessment only detects RHEL 6 as the OS version). Since Azure endorses only specific versions of Linux, the Linux VMs are currently marked as conditionally ready in Server Assessment. You can manually ensure if the Linux OS running on the on-premises VM is endorsed in Azure by reviewing the [Azure Linux support documentation.](https://aka.ms/migrate/selfhost/azureendorseddistros). Once you have verified the endorsed distro, you can ignore this warning.

### The VM SKU recommended by Server Assessment has more number of cores and a larger memory size than what is allocated on-premises. Why is that so?
The VM SKU recommendation in Server Assessment depends on the assessment properties. You can create two kinds of assessments in Server Assessment, 'performance-based' and 'as on-premises' assessments. For performance-based assessments, Server Assessment considers the utilization data of the on-premises VMs (CPU, memory, disk, and network utilization) to determine the right target VM SKU for your on-premises VMs. Additionally, for performance-based sizing, the comfort factor is taken into account to identify the effective utilization. For as on-premises sizing, performance data is not considered and a target SKU is recommended based on what is allocated on-premises.

For example, let's say there is an on-premises VM with 4 cores and 8-GB memory with 50% CPU utilization and 50% memory utilization, and a comfort factor of 1.3 is specified in the assessment. If the sizing criterion of the assessment is 'As on-premises' an Azure VM SKU with 4 cores and 8-GB memory is recommended, however, if the sizing criterion is performance-based, based on effective CPU and memory utilization (50% of 4 cores * 1.3 = 2.6 cores and 50% of 8-GB memory * 1.3 = 5.3-GB memory), the cheapest VM SKU of four cores (nearest supported core count) and 8-GB memory size (nearest supported memory size) would be recommended. [Learn more about how Server Assessment performs sizing.](https://docs.microsoft.com/azure/migrate/concepts-assessment-calculation#sizing).

### The disk SKU recommended by Server Assessment has a bigger size than what is allocated on-premises. Why is that so?
The disk sizing in Server Assessment depends on two assessment properties - sizing criterion and storage type. If the sizing criterion is 'Performance-based' and storage type is set to 'Automatic', the IOPS and throughput values of the disk are considered to identify the target disk type (Standard HDD, Standard SSD, or Premium disks). A disk SKU within the disk type is then recommended considering the size requirements of the on-premises disk. If the sizing criterion is 'Performance-based' and storage type is 'Premium', a premium disk SKU in Azure is recommended based on the IOPS, throughput, and size requirements of on-premises disk. The same logic is used to do disk sizing when the sizing criterion is 'As on-premises' sizing and storage type is 'Standard HDD', 'Standard SSD' or 'Premium'.

For example, if you have an on-premises disk with 32-GB memory, but the aggregated read and write IOPS for the disk is 800 IOPS, Server Assessment will recommend a premium disk type (due to the higher IOPS requirements) and then recommend a disk SKU, which can support the required IOPS and size. The nearest match in this example would be P15 (256 GB, 1100 IOPS). So even though the size required by the on-premises disk was 32 GB, Server Assessment recommended a disk with bigger size due to the high IOPS requirement of the on-premises disk.

### Why does my assessment report say 'PercentageOfCoresUtilizedMissing' or 'PercentageOfMemoryUtilizedMissing' for some VMs?
The above issues are listed when the Azure Migrate appliance cannot collect performance data for the on-premises VMs. This can happen if the VMs are powered off for the duration for which you are creating the assessment (last one day/one week/one month) as the appliance cannot collect performance data for a VM, when it is powered off. If only memory counters are missing and you are trying to assess Hyper-V VMs, check if you have dynamic memory enabled on these VMs. There is a known issue currently due to which Azure Migrate appliance cannot collect memory utilization for VMs which do not have dynamic memory enabled. Note that the issue is only there for Hyper-V VMs and not there for VMware VMs. If any of the performance counters are missing, Azure Migrate: Server Assessment falls back to the allocated cores/memory and recommends a VM size accordingly.

### Is the OS license cost of the VM included in the Compute cost estimated by Server Assessment?
Server Assessment currently only considers the OS license cost for Windows machines, OS license cost for Linux machines is not considered currently.

### What impact does performance history and percentile utilization have on the size recommendations?
These properties are only applicable for 'Performance-based' sizing. Server Assessment continuously collects performance data of on-premises machines and uses it to recommend the VM SKU and disk SKU in Azure. Below is how performance data is collected by Server Assessment:
- The Azure Migrate appliance continuously profiles the on-premises environment to gather real-time utilization data every 20 seconds for VMware VMs and every 30 seconds for Hyper-V VMs.
- The appliance rolls up the 20/30-second samples to create a single data point for every 10 minutes. To create the single data point, the appliance selects the peak value from all the 20/30-second samples, and sends it to Azure.
- When you create an assessment in Server Assessment, based on the performance duration and performance history percentile value, the representative utilization value is identified. For example, if the performance history is one week and percentile utilization is 95th, Azure Migrate will sort all the 10-minute sample points for the last one week in ascending order and then select the 95th percentile as the representative value.
The 95th percentile value ensures that you are ignoring any outliers, which may be included if you pick the 99th percentile. If you want to pick the peak usage for the period and do not want to miss any outliers, you should select 99th percentile as the percentile utilization.

## Dependency visualization issues

### I am unable to find the dependency visualization functionality for Azure Government projects.

Azure Migrate depends on Service Map for the dependency visualization functionality and since Service Map is currently unavailable in Azure Government, this functionality is not available in Azure Government.

### I installed the Microsoft Monitoring Agent (MMA) and the dependency agent on my on-premises VMs, but the dependencies are now showing up in the Azure Migrate portal.

Once you have installed the agents, Azure Migrate typically takes 15-30 mins to display the dependencies in the portal. If you have waited for more than 30 minutes, ensure that the MMA agent is able to talk to the OMS workspace by following the below steps:

For Windows VM:
1. Go to **Control Panel** and launch **Microsoft Monitoring Agent**.
2. Go to the **Azure Log Analytics (OMS)** tab in the MMA properties pop-up.
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

## Collect Azure portal logs

**How do I collect Azure portal network traffic logs?**

1. Open the browser and navigate and sign in [to the portal](https://portal.azure.com).
2. Press F12 to start the Developer Tools. If needed, clear the setting **Clear entries on navigation**.
3. Click the **Network** tab, and start capturing network traffic:
   - In Chrome, select **Preserve log**. The recording should start automatically. A red circle indicates that traffic is being capture. If it doesn't appear, click the black circle to start.
   - In Microsoft Edge/IE, recording should start automatically. If it doesn't, click the green play button.
4. Try to reproduce the error.
5. After you've encountered the error while recording, stop recording, and save a copy of the recorded activity:
   - In Chrome, right-click and click **Save as HAR with content**. This compresses and exports the logs as a .har file.
   - In Microsoft Edge/IE, click the **Export captured traffic** icon. This compresses and exports the log.
6. Navigate to the **Console** tab to check for any warnings or errors. To save the console log:
   - In Chrome, right-click anywhere in the console log. Select **Save as**, to export, and zip the log.
   - In Microsoft Edge/IE, right-click on the errors and select **Copy all**.
7. Close Developer Tools.
