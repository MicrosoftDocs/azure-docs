---
title: Troubleshoot Azure Migrate issues | Microsoft Docs
description: Provides an overview of known issues in the Azure Migrate service, as well as troubleshooting tips for common errors.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 08/06/2019
ms.author: raynew
---

# Troubleshoot Azure Migrate

[Azure Migrate](migrate-services-overview.md) provides a hub of tools for assessment and migration, as well as third-party independent software vendor (ISV) offerings. This article helps you troubleshoot issues with Azure Migrate, Azure Migrate Server Assessment, and Azure Migrate Server Migration.


## Find a project

There are [two versions](https://docs.microsoft.com/azure/migrate/migrate-services-overview#azure-migrate-versions) of Azure Migrate.


If you created the Azure Migrate project in the current version of Azure Migrate, do the following:

1. In the [Azure portal](https://portal.azure.com), search for **Azure Migrate**.
2. In the Azure Migrate dashboard > **Servers**, select **change** in the upper-right corner.

    ![Switch to an existing Azure Migrate project](./media/troubleshooting-general/switch-project.png)

3. Select the appropriate subscription and Azure Migrate project.


If you created the project in the previous version of Azure Migrate,  do the following:

1. In the [Azure portal](https://portal.azure.com), search for **Azure Migrate**.
2. In the Azure Migrate dashboard, if you've created a project in the previous version, a banner referencing older projects appears. Select the banner.

    ![Access existing projects](./media/troubleshooting-general/access-existing-projects.png)

3. Review the list of old project.


## Create additional projects

Create a new Azure Migrate project as follows:

1. In the [Azure portal](https://portal.azure.com), search for **Azure Migrate**.
2. On the Azure Migrate dashboard > **Servers**, select **change** in the upper-right corner.

   ![Change Azure Migrate project](./media/troubleshooting-general/switch-project.png)

3. To create a new project, select **click here**.

   ![Create a second Azure Migrate project](./media/troubleshooting-general/create-new-project.png)

## Review supported geographies

Review supported geographies for [VMware](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-vmware#azure-migrate-projects) and [Hyper-V](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-hyper-v#azure-migrate-projects).

## Delete projects/workspaces

When deleting Azure Migrate projects and Log Analytics workspaces, note that:

- When you delete an Azure Migrate project, the project *and* the metadata about discovered machines are deleted.
- If you've attached a Log Analytics workspace to the Server Assessment tool, the workspace isn't automatically deleted.
- The same Log Analytics workspace can be used for multiple scenarios.
- If you want to delete the Log Analytics workspace, you must do that manually.


### Delete a project

To delete a project in the current version of Azure Migrate:

1. Open the Azure resource group in which the project was created.
2. In the resource group page, select **Show hidden types**.
3. Select the migrate project you want to delete. The resource type is Microsoft.Migrate/migrateprojects, and deletes it.

To delete a project in the older version of Azure Migrate: 

1. Open the Azure resource group in which the project was created.
2. Select the migrate project you want to delete. The resource type is Migration project, and deletes it.


### Delete a workspace

Browse to the Log Analytics workspace attached to the project.
     * If you haven't deleted the Azure Migrate project, you can find the link to the workspace in **Essentials** > **Server Assessment**.
       ![LA Workspace](./media/troubleshooting-general/loganalytics-workspace.png)

     * If you've already deleted the Azure Migrate project, select **Resource Groups** in the left pane of the Azure portal. Locate the workspace in the relevant resources group, and [follow the instructions](https://docs.microsoft.com/azure/azure-monitor/platform/delete-workspace) to delete it. 


## Error "Requests must contain user identity headers"

When creating a project this error might indicate that you don't have access to the Azure Active Directory (Azure AD) tenant of the organization.

- When you're added to an Azure AD tenant for the first time, you receive an email invitation to join the tenant.
- Accept the invitation to get successfully added to the tenant.
    - If you can't see the email, contact a user with access to the tenant, and ask them to [resend the invitation](https://docs.microsoft.com/azure/active-directory/b2b/add-users-administrator#resend-invitations-to-guest-users) to you.
    - After receiving the invitation email, open it and select the link to accept the invitation. Then, sign out of the Azure portal and sign in again. (refreshing the browser won't work.) You can then start creating the migration project.


## Error "Invalid OVF manifest entry"

If you receive the error "The provided manifest file is invalid: Invalid OVF manifest entry", do the following:

1. Verify that the Azure Migrate appliance OVA file is downloaded correctly by checking its hash value. [Learn more](https://docs.microsoft.com/azure/migrate/tutorial-assessment-vmware). If the hash value doesn't match, download the OVA file again and retry the deployment.
2. If deployment still fails, and you're using the VMware vSphere client to deploy the OVF file, try deploying it through the vSphere web client. If deployment still fails, try using a different web browser.
3. If you're using the vSphere web client and trying to deploy it on vCenter Server 6.5 or 6.7, try to deploy the OVA directly on the ESXi host:
   - Connect to the ESXi host directly (instead of vCenter Server) with the web client (https://<*host IP Address*>/ui).
   - In **Home** > **Inventory**, select **File** > **Deploy OVF template**. Browse to the OVA and complete the deployment.
4. If the deployment still fails, contact Azure Migrate support.

## Appliance can't connect to the internet

This can happen if the appliance machine is behind a proxy.

- Make sure you provide the authorization credentials if the proxy needs them.
- If you're using a URL-based firewall proxy to control outbound connectivity, add these URLs to an allow list:

    - [URLs for VMware assessment](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-vmware#assessment-url-access-requirements)
    - [URLs for Hyper-V assessment](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-hyper-v#assessment-appliance-url-access)
    - [URLs for VMware agentless migration](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-vmware#agentless-migration-url-access-requirements)
    - [URLS for VMware agent-based migration](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-vmware#replication-appliance-url-access)
    - [URLs for Hyper-V migration](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-hyper-v#migration-hyper-v-host-url-access)

- If you're using an intercepting proxy to connect to the internet, import the proxy certificate onto the appliance VM using [these steps](https://docs.microsoft.com/azure/migrate/concepts-collector).

## Error:Date/time synchronization

An error about date and time synchronization (802) indicates that the server clock might be out of synchronization with the current time by more than five minutes. Change the clock time on the collector VM to match the current time:

1. Open an admin command prompt on the VM.
2. To check the time zone, run **w32tm /tz**.
3. To synchronize the time, run **w32tm /resync**.


## Error: UnableToConnectToServer

If you get this connection error, you might be unable to connect to vCenter Server *Servername*.com:9443. The error details indicate that there's no endpoint listening at https://*servername*.com:9443/sdk that can accept the message.

- Check whether you're running the latest version of the appliance. If you're not, upgrade the appliance to the [latest version](https://docs.microsoft.com/azure/migrate/concepts-collector).
- If the issue still occurs in the latest version, the appliance might be unable to resolve the specified vCenter Server name, or the specified port might be wrong. By default, if the port is not specified, the collector will try to connect to port number 443.

    1. Ping *Servername*.com from the appliance.
    2. If step 1 fails, try to connect to the vCenter server using the IP address.
    3. Identify the correct port number to connect to vCenter Server.
    4. Verify that vCenter Server is up and running.


## Error: Appliance might not be registered

- Error 60052, "The appliance might not be registered successfully to the Azure Migrate project" occurs if the Azure account used to register the appliance has insufficient permissions. 
    - Make sure that the Azure user account used to register the appliance has at least Contributor permissions on the subscription.
    - [Learn more](https://docs.microsoft.com/azure/migrate/migrate-appliance#appliance-deployment-requirements) about required Azure roles and permissions.
- Error 60039, "The appliance might not be registered successfully to the Azure Migrate project" can occur if registration fails because the Azure Migrate project used to the register the appliance can't be found.
    - In the Azure portal and check whether the project exists in the resource group.
    - If the project doesn't exist, create a new Azure Migrate project in your resource group and register the appliance again. [Learn how to](https://docs.microsoft.com/azure/migrate/how-to-add-tool-first-time#create-a-project-and-add-a-tool) create a new project.

## Error: Key Vault management operation failed

If you receive the error 60030 or 60031, "An Azure Key Vault management operation failed", do the following: 
- Make sure the Azure user account used to register the appliance has at least Contributor permissions on the subscription.
- Make sure the account has access to the key vault specified in the error message, and then retry the operation.
- If the issue persists, contact Microsoft support.
- [Learn more](https://docs.microsoft.com/azure/migrate/migrate-appliance#appliance-deployment-requirements) about the required Azure roles and permissions.

## Fix: Discovery couldn't be initiated

Error 60028: "Discovery couldn't be initiated because of an error. The operation failed for the specified list of hosts or clusters" indicates that discovery couldn't be started on the hosts listed in the error because of a problem in accessing or retrieving VM information. The rest of the hosts were successfully added.

- Add the hosts listed in the error again, using the **Add host** option.
- If there's a validation error, review the remediation guidance to fix the errors, and then try the **Save and start discovery** option again.

## Fix: Azure AD operation failed (60025)

Error 60025: "An Azure AD operation failed. The error occurred while creating or updating the Azure AD application" occurs when the Azure user account used to initiate the discovery is different from the account used to register the appliance. Do one of the following:

- Ensure that the user account initiating the discovery is same as the one used to register the appliance.
- Provide Azure Active Directory application access permissions to the user account for which the discovery operation is failing.
- Delete the resource group previously created for the Azure Migrate project. Create another resource group to start again.
- [Learn more](https://docs.microsoft.com/azure/migrate/migrate-appliance#appliance-deployment-requirements) about Azure Active Directory application permissions.


## Discovered VMs not in portal

If you start discovery so that **Server Assessment** and **Server Migration** show **Discovery in progress**, but don't yet see the VMs in the portal, note the following: 

- After starting discovery from the appliance, it takes around 15 minutes for a VMware VM discovery, and around two minutes for each added host for Hyper-V VM discovery.
- If you continue to see **Discovery in progress** even after these waiting periods, select **Refresh** on the **Servers** tab. This should show the count of the discovered servers in **Server Assessment** and **Server Migration**.


## Deleted VMs in the portal

If you've deployed an appliance that continuously discovers your on-premises environment, but deleted VMs are still showing in the portal, note the following:  

- It takes up to 30 minutes for the discovery data gathered by the appliance to be reflected in the portal.
- If you don't see up-to-date information after 30 minutes, refresh the data by following these steps:

    1. In **Servers** > **Azure Migrate Server Assessment**, select **Overview**.
    2. Under **Manage**, select **Agent Health**
    3. Select **Refresh agent**. 
    1. Wait for the refresh operation to complete. You should now see up-to-date information.

## VM information isn't in the portal

- It takes up to 30 minutes for the discovery data gathered by the appliance to be reflected in the portal.
- If you don't see up-to-date information after 30 minutes, refresh the data by following these steps:

    1. In **Servers** > **Azure Migrate Server Assessment**, select **Overview**.
    2. Under **Manage**, select **Agent Health**
    3. Select **Refresh agent**. 
    1. Wait for the refresh operation to complete. You should now see up-to-date information.


## Fix: Can't connect to host or cluster

Error 50004: "Can't connect to a host or cluster because the server name can't be resolved. WinRM error code: 0x803381B9" might occur if the Azure DNS service for the appliance can't resolve the cluster or host name you provided.

- If you see this error on the cluster, cluster FQDN.
- You might also see this error for hosts in a cluster. This indicates that the appliance can connect to the cluster, but the cluster returns host names that aren't FQDNs. To resolve this error, update the hosts file on the appliance by adding a mapping of the IP address and host names:
    1. Open Notepad as an admin.
    2. Open the C:\Windows\System32\Drivers\etc\hosts file.
    3. Add the IP address and host name in a row. Repeat for each host or cluster where you see this error.
    4. Save and close the hosts file.
    5. Check whether the appliance can connect to the hosts, using the appliance management app. After 30 minutes, you should see the latest information for these hosts in the Azure portal.



## Fix assessment readiness

Fix assessment readiness issues as follows:

**Issue** | **Fix**
--- | ---
Unsupported boot type | Azure doesn't support VMs with an EFI boot type. We recommend that you convert the boot type to BIOS before you run a migration. <br/><br/>You can use Azure Migrate Server Migration to handle the migration of such VMs. It will convert the boot type of the VM to BIOS during the migration.
Conditionally supported Windows operating system | The operating system has passed its end-of-support date, and needs a Custom Support Agreement (CSA) for [support in Azure](https://aka.ms/WSosstatement). Consider upgrading before you migrate to Azure.
Unsupported Windows operating system | Azure supports only [selected Windows OS versions](https://aka.ms/WSosstatement). Consider upgrading the machine before you migrate to Azure.
Conditionally endorsed Linux OS | Azure endorses only [selected Linux OS versions](../virtual-machines/linux/endorsed-distros.md). Consider upgrading the machine before you migrate to Azure.
Unendorsed Linux OS | The machine might start in Azure, but Azure provides no operating system support. Consider upgrading to an [endorsed Linux version](../virtual-machines/linux/endorsed-distros.md) before you migrate to Azure.
Unknown operating system | The operating system of the VM was specified as "Other" in vCenter Server. This behavior blocks Azure Migrate from verifying the Azure readiness of the VM. Make sure that the operating system is [supported](https://aka.ms/azureoslist) by Azure before you migrate the machine.
Unsupported bit version | VMs with a 32-bit operating systems might boot in Azure, but we recommended that you upgrade to 64-bit before you migrate to Azure.
Requires a Microsoft Visual Studio subscription | The machine is running a Windows client operating system, which is supported only through a Visual Studio subscription.
VM not found for the required storage performance | The storage performance (input/output operations per second [IOPS] and throughput) required for the machine exceeds Azure VM support. Reduce storage requirements for the machine before migration.
VM not found for the required network performance | The network performance (in/out) required for the machine exceeds Azure VM support. Reduce the networking requirements for the machine.
VM not found in the specified location | Use a different target location before migration.
One or more unsuitable disks | One or more disks attached to the VM don't meet Azure requirements.A<br/><br/> Azure Migrate: Server Assessment currently doesn't support Ultra SSD disks, and assesses the disks based on the disk limits for premium managed disks (32 TB).<br/><br/> For each disk attached to the VM, make sure that the size of the disk is < 64 TB (supported by Ultra SSD disks).<br/><br/> If it isn't, reduce the disk size before you migrate to Azure, or use multiple disks in Azure and [stripe them together](https://docs.microsoft.com/azure/virtual-machines/windows/premium-storage-performance#disk-striping) to get higher storage limits. Make sure that the performance (IOPS and throughput) needed by each disk is supported by Azure [managed virtual machine disks](https://docs.microsoft.com/azure/azure-subscription-service-limits#storage-limits).
One or more unsuitable network adapters. | Remove unused network adapters from the machine before migration.
Disk count exceeds limit | Remove unused disks from the machine before migration.
Disk size exceeds limit | Azure Migrate: Server Assessment currently doesn't support Ultra SSD disks, and assesses the disks based on premium disk limits (32 TB).<br/><br/> However, Azure supports disks with up to 64 TB size (supported by Ultra SSD disks). Shrink disks to less than 64 TB before migration, or use multiple disks in Azure and [stripe them together](https://docs.microsoft.com/azure/virtual-machines/windows/premium-storage-performance#disk-striping) to get higher storage limits.
Disk unavailable in the specified location | Make sure the disk is in your target location before you migrate.
Disk unavailable for the specified redundancy | The disk should use the redundancy storage type defined in the assessment settings (LRS by default).
Could not determine disk suitability because of an internal error | Try creating a new assessment for the group.
VM with required cores and memory not found | Azure couldn't find a suitable VM type. Reduce the memory and number of cores of the on-premises machine before you migrate.
Could not determine VM suitability because of an internal error | Try creating a new assessment for the group.
Could not determine suitability for one or more disks because of an internal error | Try creating a new assessment for the group.
Could not determine suitability for one or more network adapters because of an internal error | Try creating a new assessment for the group.

## Can't add Enterprise Agreement (EA) in an assessment

Azure Migrate Server Assessment doesn't currently support Enterprise Agreement (EA) pricing. To work around this limitation, use **Pay-As-You-Go** as the Azure offer, and use the **Discount** property to specify any custom discount that you receive. [Learn](https://aka.ms/migrate/selfhelp/eapricing) how to customize an assessment.

## Linux VMs are "conditionally ready"

Server Assessment marks Linux VMs as  "Conditionally ready" due to a known gap in Server Assessment.

- The gap prevents it from detecting the minor version of the Linux OS installed on the on-premises VMs.
- For example, for RHEL 6.10, currently Server Assessment detects only RHEL 6 as the OS version.
-  Because Azure endorses only specific versions of Linux, the Linux VMs are currently marked as conditionally ready in Server Assessment.
- You can determine whether the Linux OS running on the on-premises VM is endorsed in Azure by reviewing [Azure Linux support](https://aka.ms/migrate/selfhost/azureendorseddistros).
-  After you've verified the endorsed distribution, you can ignore this warning.

## Azure SKUs exceed on-premises sizing

Azure Migrate Server Assessment might recommend Azure VM SKUs with more cores and memory than current on-premises allocation based on the type of assessment:


- The VM SKU recommendation depends on the assessment properties.
- This is affected by the type of assessment you perform in Server Assessment: *Performance-based*, or *As on-premises*. 
- For performance-based assessments, Server Assessment considers the utilization data of the on-premises VMs (CPU, memory, disk, and network utilization) to determine the right target VM SKU for your on-premises VMs. It also adds a comfort factor when determining effective utilization.
- For on-premises sizing, performance data is not considered, and the target SKU is recommended based on-premises allocation.

To show how this can affect recommendations, let's take an example:

We have an on-premises VM with four cores and eight GB of memory, with 50% CPU utilization and 50% memory utilization, and a specified comfort factor of 1.3.

-  If the assessment is **As on-premises**, an Azure VM SKU with 4 cores and 8 GB of memory is recommended.
- If the assessment is performance-based, based on effective CPU and memory utilization (50% of 4 cores * 1.3 = 2.6 cores and 50% of 8-GB memory * 1.3 = 5.3-GB memory), the cheapest VM SKU of four cores (nearest supported core count) and eight GB of memory (nearest supported memory size) is recommended. 
- [Learn more](concepts-assessment-calculation.md#sizing) about assessment sizing.

## Azure disk SKUs bigger than on-premises

Azure Migrate Server Assessment might recommend a bigger disk based on the type of assessment.
- Disk sizing in Server Assessment depends on two assessment properties: sizing criteria and storage type.
- If the sizing criteria is **Performance-based**, and the storage type is set to **Automatic**, the IOPS and throughput values of the disk are considered when identifying the target disk type (Standard HDD, Standard SSD, or Premium). A disk SKU from the disk type is then recommended, and the recommendation considers the size requirements of the on-premises disk. 
- If the sizing criteria is **Performance-based**, and the storage type is **Premium**, a premium disk SKU in Azure is recommended based on the IOPS, throughput, and size requirements of the on-premises disk. The same logic is used to perform disk sizing when the sizing criteria is **As on-premises** and the storage type is **Standard HDD**, **Standard SSD**, or **Premium**.

As an example, if you have an on-premises disk with 32 GB of memory, but the aggregated read and write IOPS for the disk is 800 IOPS, Server Assessment recommends a premium disk (because of the higher IOPS requirements), and then recommends a disk SKU that can support the required IOPS and size. The nearest match in this example would be P15 (256 GB, 1100 IOPS). Even though the size required by the on-premises disk was 32 GB, Server Assessment recommends a larger disk because of the high IOPS requirement of the on-premises disk.

## Fix: Percentage of utilized core or memory missing

Server Assessment reports "PercentageOfCoresUtilizedMissing" or "PercentageOfMemoryUtilizedMissing" when the Azure Migrate appliance can't collect performance data for the relevant on-premises VMs.

- This can occur if the VMs are turned off during the assessment duration. The appliance can't collect performance data for a VM when it's turned off.
- If only the memory counters are missing and you're trying to assess Hyper-V VMs, check whether you have dynamic memory enabled on these VMs. There's a known issue for Hyper-V VMs only, in which an Azure Migrate appliance can't collect memory utilization data for VMs that don't have dynamic memory enabled.
- If any of the performance counters are missing, Azure Migrate Server Assessment falls back to the allocated cores and memory, and it recommends a corresponding VM size.

## Is the VM OS license cost included in cost assessment?

Azure Migrate Server Assessment currently considers the operating system license cost only for Windows machines. License costs for Linux machines aren't currently considered.

## Performance history and percentile use

These properties apply only to performance-based sizing in Azure Migrate Server Assessment.

Server Assessment continuously collects performance data of on-premises machines and uses it to recommend the VM SKU and disk SKU in Azure. This performance data is collected by Server Assessment as follows:
- The Azure Migrate appliance continuously profiles the on-premises environment to gather real-time utilization data every 20 seconds for VMware VMs, and every 30 seconds for Hyper-V VMs.
- The appliance rolls up the 20 or 30-second samples to create a single data point for every 10 minutes. To create the single data point, the appliance selects the peak value from all the 20-second and 30-second samples, and then sends it to Azure.
- When you create an assessment in Server Assessment, based on the performance duration and performance history percentile value, the representative utilization value is identified. For example, if the performance history is one week and percentile utilization is 95th, Azure Migrate sorts all the 10-minute sample points for the last one week in ascending order and then selects the 95th percentile as the representative value.
- The 95th percentile value makes sure that you ignore any outliers, which might be included if you pick the 99th percentile.
- If you want to pick the peak usage for the period and don't want to miss any outliers, you should select the 99th percentile for percentile utilization.



## I can't find dependency visualization for Azure Government

Azure Migrate depends on Service Map for the dependency visualization functionality. Because Service Map is currently unavailable in Azure Government, this functionality is not available in Azure Government.

## Dependencies don't show after installing agents


After you've installed the dependency visualization agents on on-premises VMs, Azure Migrate typically takes 15-30 minutes to display the dependencies in the portal. If you've waited for more than 30 minutes, make sure that the Microsoft Monitoring Agent (MMA) can connect to the Log Analytics workspace.

For Windows VMs:
1. In the Control Panel, start MMA.
2. In the **Microsoft Monitoring Agent properties** > **Azure Log Analytics (OMS)**, make sure that the **Status** for the workspace is green.
3. If the status isn't green, try removing the workspace and adding it again to MMA.

      ![MMA Properties dialog box](./media/troubleshooting-general/mma-status.png)

For Linux VMs, make sure that the installation commands for MMA and the dependency agent succeeded.

## Supported MMA OS

 Review the supported [Windows](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-windows-operating-systems), and [Linux](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-linux-operating-systems) operating systems.

## Supported dependency agent OS

Review the supported [Windows and Linux](../azure-monitor/insights/vminsights-enable-overview.md#supported-operating-systems) operating systems.

## Dependencies for more than an hour

Although Azure Migrate allows you to go back to a particular date in the last month, the maximum duration for which you can visualize the dependencies is one hour.

For example, you can use the time duration functionality in the dependency map to view dependencies for yesterday, but you can view them for a one-hour period only.

However, you can use Azure Monitor logs to [query the dependency data](https://docs.microsoft.com/azure/migrate/how-to-create-group-machine-dependencies) over a longer duration.

## I can't visualize dependencies for groups with more than 10 VMs

In Azure Migrate Server Assessment, you can [visualize dependencies for groups](https://docs.microsoft.com/azure/migrate/how-to-create-group-dependencies) with up to 10 VMs. For larger groups, we recommend that you split the VMs into smaller groups to visualize dependencies.

## Machines show "Install agent" not "View dependencies"

After migrating machines with dependency visualization enabled to Azure, machines might show "Install agent" action instead of "View dependencies" due to the following behavior:


- After migration to Azure, on-premises machines are turned off and equivalent VMs are spun up in Azure. These machines acquire a different MAC address.
- Machines might also have a different IP address, based on whether you've retained the on-premises IP address or not.
- If both MAC and IP addresses are different from on-premises, Azure Migrate doesn't associate the on-premises machines with any Service Map dependency data. In this case, it will show the option to install the agent rather than to view dependencies.
- After a test migration to Azure, on-premises machines remain turned on as expected. Equivalent machines spun up in Azure acquire different MAC address and might acquire different IP addresses. Unless you block outgoing Azure Monitor log traffic from these machines, Azure Migrate won't associate the on-premises machines with any Service Map dependency data, and thus will show the option to install agents, rather than to view dependencies.


## Collect network traffic logs in portal

Collect logs as follows:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Press F12 to start Developer Tools. If needed, clear the  **Clear entries on navigation** setting.
3. Select the **Network** tab, and start capturing network traffic:
   - In Chrome, select **Preserve log**. The recording should start automatically. A red circle indicates that traffic is being captured. If the red circle doesn't appear, select the black circle to start.
   - In Microsoft Edge and Internet Explorer, recording should start automatically. If it doesn't, select the green play button.
4. Try to reproduce the error.
5. After you've encountered the error while recording, stop recording, and save a copy of the recorded activity:
   - In Chrome, right-click and select **Save as HAR with content**. This action compresses and exports the logs as a .har file.
   - In Microsoft Edge or Internet Explorer, select the **Export captured traffic** option. This action compresses and exports the log.
6. Select the **Console** tab to check for any warnings or errors. To save the console log:
   - In Chrome, right-click anywhere in the console log. Select **Save as**, to export, and zip the log.
   - In Microsoft Edge or Internet Explorer, right-click the errors and select **Copy all**.
7. Close Developer Tools.
