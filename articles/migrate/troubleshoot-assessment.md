---
title: Common issues in Azure Migrate assessments
description: Get help with assessment issues in Azure Migrate.
author: rashi-ms
ms.author: rajosh
ms.manager: abhemraj
ms.topic: troubleshooting
ms.service: azure-migrate
ms.date: 02/20/2024
ms.custom: engagement-fy24
---

# Common issues in Azure Migrate assessments

This article helps you troubleshoot issues with assessment and dependency visualization with [Azure Migrate: Discovery and assessment](migrate-services-overview.md#azure-migrate-discovery-and-assessment-tool). See articles [Supported Scenarios](troubleshoot-assessment-supported-scenarios.md) for troubleshooting assessments scenarios and [FAQ](troubleshoot-assessment-faq.md) for commonly questions about troubleshoot issues with assessment.

## Common assessment errors

Assessment service uses the [configuration data](discovered-metadata.md) and the [performance data](concepts-assessment-calculation.md#how-does-the-appliance-calculate-performance-data) for calculating the assessments. The data is fetched by the Azure Migrate appliance at specific intervals in case of appliance-based discovery and assessments.
The following table summarizes the errors encountered while fetching the data by the assessment service. 

### Error Code: 60001:UnableToConnectToPhysicalServer	

#### Cause

Either the prerequisites to connect to the server have not been met or there are network issues in connecting to the server, for instance some proxy settings.

#### Recommended Action

- Ensure that the server meets the prerequisites and port access requirements.
- Add the IP addresses of the remote machines (discovered servers) to the WinRM TrustedHosts list on the Azure Migrate appliance and retry the operation. This is to allow remote inbound connections on servers: *Windows: WinRM port 5985 (HTTP) and Linux: SSH port 22 (TCP)*.
- Ensure that you have chosen the correct authentication method on the appliance to connect to the server. <br/><br/> - If the issue persists, submit a Microsoft support case, providing the appliance machine ID (available in the footer of the appliance configuration manager).

### Error Code: 60002: InvalidServerCredentials

#### Cause

Unable to connect to server due to incorrect credentials on the appliance, or the credentials previously provided have expired or the server credentials have changed.

#### Recommended Action
 
- Ensure that you have provided the correct credentials for the server on the appliance. You can check that by trying to connect to the server using those credentials.

- If the credentials added are incorrect or have expired, edit the credentials on the appliance and revalidate the added servers. If the validation succeeds, the issue is resolved.

- If the issue persists, submit a Microsoft support case, providing the appliance machine ID (available in the footer of the appliance configuration manager).

### Error Code: 60004: NoPerfDataAvailableForServers

#### Cause

The appliance is unable to fetch the required performance data from the server due to network issues or the credentials provided on the appliance do not have enough permissions to fetch the metadata.

#### Recommended Action
 
- Ensure that the guest credentials provided on the appliance have [required permissions](migrate-support-matrix-physical.md#physical-server-requirements).
- If the issue persists, submit a Microsoft support case, providing the appliance machine ID (available in the footer of the appliance configuration manager).

### Error Code: 60005: SSHOperationTimeout

#### Cause

The operation took longer than expected either due to network latency issues or due to the lack of latest updates on Linux server.

#### Recommended Action

- Ensure that the impacted server has the latest kernel and OS updates installed.

- Ensure that there is no network latency between the appliance and the server. It is recommended to have the appliance and source server on the same domain to avoid latency issues.

- Connect to the impacted server from the appliance and run the commands documented here to check if they return null or empty data.

- If the issue persists, submit a Microsoft support case providing the appliance machine ID (available in the footer of the appliance configuration manager).

### Error Code: 60006: ServerAccessDenied

#### Cause

The operation could not be completed due to forbidden access on the server. The guest credentials provided do not have enough permissions to access the servers.

### Error Code: 60011: ServerWindowsWMICallFailed

#### Cause

WMI call failed due to WMI service failure. This might be a transient error, if the server is unreachable due to network issue or in case of physical sever the server might be switched off.

#### Recommended Action

- Ensure WinRM is running and the server is reachable from the appliance VM.
- Ensure that the server is switched on.
- For troubleshooting with physical servers, follow the [instructions](migrate-support-matrix-physical.md#physical-server-requirements).
- If the issue persists, submit a Microsoft support case providing the appliance machine ID (available in the footer of the appliance configuration manager).

### Error Code: 10004: CredentialNotProvidedForGuestOSType

#### Cause

The credentials for the server OS type weren't added on the appliance.

#### Recommended Action

- Ensure that you add the credentials for the OS type of the affected server on the appliance.
- You can now add multiple server credentials on the appliance.

### Error Code: 751: Unable to connect to Server

#### Cause

Unable to connect to the server due to connectivity issues.

#### Recommended Action

Resolve the connectivity issue mentioned in the error message.

### Error Code: 754: Performance Data not available

#### Cause

Azure Migrate is unable to collect performance data if the vCentre is not configured to give out the performance data.

#### Recommended Action

Configure the statistics level on VCentre server to 3 to make the performance data available. Wait for a day before running the assessment for the data to populate.

### Error Code: 757: Virtual Machine not found

#### Cause

The Azure Migrate service is unable to locate the specified virtual machine. This may occur if the virtual machine has been deleted by the administrator on the VMware environment.

#### Recommended Action

Verify that the virtual machine still exists in the VMware environment.

### Error Code: 758: Request timeout while fetching Performance data

#### Cause

Azure Migrate assessment service is unable to retrieve performance data. This could happen if the vCenter server is not reachable.

#### Recommended Action

- Verify the vCenter server credentials are correct.
- Ensure that the server is reachable before attempting to retrieve performance data again.
- If the issue persists, submit a Microsoft support case, providing the appliance machine ID (available in the footer of the appliance configuration manager).

### Error Code: 760: Unable to get Performance counters

#### Cause

Azure Migrate assessment service is unable to retrieve performance counters. This can happen due to multiple reasons. Check the error message to find the exact reason.

#### Recommended Action

- Ensure that you resolve the error flagged in the error message.
- If the issue persists, submit a Microsoft support case, providing the appliance machine ID (available in the footer of the appliance configuration manager).

### Error Code: 8002: Virtual Machine could not be found

#### Cause
Azure Migrate discovery service could not find the virtual machine. This could happen if the virtual machine is deleted or its UUID has changed.

#### Recommended Action

- Ensure that the on-premises virtual machine exists and then restart the job.
- If the issue persists, submit a Microsoft support case, providing the appliance machine ID (available in the footer of the appliance configuration manager).

### Error Code: 9003: Operating system type running on the server isn't supported.

#### Cause

The operating system running on the server isn't Windows or Linux.

#### Recommended Action

Only Windows and Linux OS types are supported. If the server is running Windows or Linux OS, check the operating system type specified in vCenter Server.

### Error Code: 9004: Server isn't in a running state.

#### Cause

The server is in a powered-off state.

#### Recommended Action

Ensure that the server is in a running state.

### Error Code: 9010: The server is powered off.

#### Cause

The server is in a powered-off state.

#### Recommended Action

Ensure that the server is in a running state.

### Error Code: 9014: Unable to retrieve the file containing the discovered metadata because of an error encountered on the ESXi host

#### Cause

The error details will be mentioned with the error.

#### Recommended Action

Ensure that port 443 is open on the ESXi host on which the server is running. Learn more on how to remediate the issue.

### Error Code: 9015: The vCenter Server user account provided for server discovery doesn't have guest operations privileges enabled.

#### Cause

The required privileges of guest operations haven't been enabled on the vCenter Server user account.

#### Recommended Action

Ensure that the vCenter Server user account has privileges enabled for **Virtual Machines** > **Guest Operations** to interact with the server and pull the required data. Learn more on how to set up the vCenter Server account with required privileges.

### Error Code: 9022: The access is denied to run the Get-WmiObject cmdlet on the server.

#### Cause

The role associated with the credentials provided on the appliance or a group policy on-premises is restricting access to the WMI object. You encounter this issue when you try the following credentials on the server: `FriendlyNameOfCredentials`.

#### Recommended Action

Check if the credentials provided on the appliance have created file administrator privileges and have WMI enabled.<br/><br/> If the credentials on the appliance don't have the required permissions, either provide another set of credentials or edit an existing one. (Find the friendly name of the credentials tried by Azure Migrate in the possible causes.) <br/><br/> [Learn more](tutorial-discover-vmware.md#prepare-vmware) on how to remediate the issue.

## Azure VM assessment readiness issues

This section helps on fixing the following assessment readiness issues.

### Issue: Unsupported boot type

#### Fix

Azure does not support UEFI boot type for VMs with the Windows Server 2003/Windows Server 2003 R2/Windows Server 2008/Windows Server 2008 R2 operating systems. Check the list of operating systems that support UEFI-based machines [here](./common-questions-server-migration.md#which-operating-systems-are-supported-for-migration-of-uefi-based-machines-to-azure).

### Issue: Conditionally supported Windows operating system

#### Fix

The operating system has passed its end-of-support date and needs a Custom Support Agreement for [support in Azure](/troubleshoot/azure/virtual-machines/server-software-support). Consider upgrading before you migrate to Azure. Review information about [preparing servers running Windows Server 2003](prepare-windows-server-2003-migration.md) for migration to Azure.

### Issue: Unsupported Windows operating system

#### Fix

Azure supports only [selected Windows OS versions](/troubleshoot/azure/virtual-machines/server-software-support). Consider upgrading the server before you migrate to Azure. 

### Issue: Conditionally endorsed Linux OS

#### Fix

Azure endorses only [selected Linux OS versions](../virtual-machines/linux/endorsed-distros.md). Consider upgrading the server before you migrate to Azure.

### Issue: Unendorsed Linux OS

#### Fix

The server might start in Azure, but Azure provides no operating system support. Consider upgrading to an [endorsed Linux version](../virtual-machines/linux/endorsed-distros.md) before you migrate to Azure.

### Issue: Unknown operating system

#### Fix

The operating system of the VM was specified as **Other** in vCenter Server or could not be identified as a known OS in Azure Migrate. This behavior blocks Azure Migrate from verifying the Azure readiness of the VM. Ensure that the operating system is [supported](./migrate-support-matrix-vmware-migration.md#azure-vm-requirements) by Azure before you migrate the server.

### Issue: Unsupported bit version

#### Fix

VMs with a 32-bit operating system might boot in Azure, but we recommend that you upgrade to 64-bit before you migrate to Azure.

### Issue: Requires a Microsoft Visual Studio subscription

#### Fix

The server is running a Windows client operating system, which is supported only through a Visual Studio subscription.

### Issue: VM not found for the required storage performance

#### Fix

The storage performance (input/output operations per second (IOPS) and throughput) required for the server exceeds Azure VM support. Reduce storage requirements for the server before migration.

### Issue: VM not found for the required network performance

#### Fix

The network performance (in/out) required for the server exceeds Azure VM support. Reduce the networking requirements for the server.

### Issue: VM not found in the specified location

#### Fix

Use a different target location before migration.

### Issue: One or more unsuitable disks

#### Fix

One or more disks attached to the VM don't meet Azure requirements.<br><br> Azure Migrate: Discovery and assessment assess the disks based on the disk limits for Ultra disks (64 TB).<br><br> For each disk attached to the VM, make sure that the size of the disk is < 64 TB (supported by Ultra SSD disks).<br><br> If it isn't, reduce the disk size before you migrate to Azure, or use multiple disks in Azure and [stripe them together](../virtual-machines/premium-storage-performance.md#disk-striping) to get higher storage limits. Make sure that the performance (IOPS and throughput) needed by each disk is supported by [Azure managed virtual machine disks](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-storage-limits).

### Issue: One or more unsuitable network adapters

#### Fix

Remove unused network adapters from the server before migration.

### Issue: Disk count exceeds limit

#### Fix

Remove unused disks from the server before migration.

### Issue: Disk size exceeds limit

#### Fix

Azure Migrate: Discovery and assessment support disks with up to 64 TB size (Ultra disks). Shrink disks to less than 64 TB before migration, or use multiple disks in Azure and [stripe them together](../virtual-machines/premium-storage-performance.md#disk-striping) to get higher storage limits.

### Issue: Disk unavailable in the specified location

#### Fix

Make sure the disk is in your target location before you migrate.

### Issue: Disk unavailable for the specified redundancy

#### Fix

The disk should use the redundancy storage type defined in the assessment settings (LRS by default).

### Issue: Couldn't determine disk suitability because of an internal error

#### Fix

Try creating a new assessment for the group.

### Issue: VM with required cores and memory not found

#### Fix

Azure couldn't find a suitable VM type. Reduce the memory and number of cores of the on-premises server before you migrate.

### Issue: Couldn't determine VM suitability because of an internal error

#### Fix

Try creating a new assessment for the group.

### Issue: Couldn't determine suitability for one or more disks because of an internal error

#### Fix

Try creating a new assessment for the group.

### Issue: Couldn't determine suitability for one or more network adapters because of an internal error

#### Fix

Try creating a new assessment for the group.

### Issue: No VM size found for offer currency Reserved Instance (RI)

#### Fix

Server marked not suitable because the VM size wasn't found for the selected combination of RI, offer, and currency. Edit the assessment properties to choose the valid combinations and recalculate the assessment.

## Azure VMware Solution (AVS) assessment readiness issues

This section provides help for fixing the following assessment readiness issues.

### Issue: Unsupported IPv6

#### Fix

Only applicable to Azure VMware Solution assessments. Azure VMware Solution doesn't support IPv6 internet addresses. Contact the Azure VMware Solution team for remediation guidance if your server is detected with IPv6.

### Issue: Unsupported OS

#### Fix

Support for certain Operating System versions has been deprecated by VMware and the assessment recommends you to upgrade the operating system before migrating to Azure VMware Solution. [Learn more](https://www.vmware.com/resources/compatibility/search.php?deviceCategory=software).

## Common web apps discovery errors

Azure Migrate provides options to assess discovered ASP.NET/Java web apps for migration to Azure App Service and Azure KubernetesService (AKS) by using the Azure Migrate: Discovery and assessment tool. Refer to the [assessment](tutorial-assess-webapps.md) tutorial to get started.

Here, typical App Service assessment errors are summarized.

### Error: Application pool check

#### Cause

The IIS site is using the following application pools: {0}.

#### Recommended Action

Azure App Service doesn't support more than one application pool configuration per App Service application. Move the workloads to a single application pool and remove other application pools.

### Error: Application pool identity check

#### Cause

The site's application pool is running as an unsupported user identity type: {0}.

#### Recommended Action

App Service doesn't support using the LocalSystem or SpecificUser application pool identity types. Set the application pool to run as ApplicationPoolIdentity.

### Error: Authorization check 

#### Cause

The following unsupported authentication types were found: {0}.

#### Recommended Action

App Service supported authentication types and configuration are different from on-premises IIS. Disable the unsupported authentication types on the site. After the migration is complete, it will be possible to configure the site by using one of the App Services supported authentication types.

### Error: Authorization check unknown

#### Cause

Unable to determine enabled authentication types for all of the site configuration.

#### Recommended Action

Unable to determine authentication types. Fix all configuration errors and confirm that all site content locations are accessible to the administrator's group.

### Error: Configuration error check

#### Cause

The following configuration errors were found: {0}.

#### Recommended Action

Migration readiness can't be determined without reading all applicable configuration. Fix all configuration errors. Make sure configuration is valid and accessible.

### Error: Content size check

#### Cause

The site content appears to be greater than the maximum allowed of 2 GB for successful migration.

#### Recommended Action

For successful migration, site content should be less than 2 GB. Evaluate if the site could switch to using non-file-system-based storage options for static content, such as Azure Storage.

### Error: Content size check unknown

#### Cause

File content size couldn't be determined, which usually indicates an access issue.

#### Recommended Action

Content must be accessible to migrate the site. Confirm that the site isn't using UNC shares for content and that all site content locations are accessible to the administrator's group.

### Error: Global module check

#### Cause

The following unsupported global modules were detected: {0}.

#### Recommended Action

App Service supports limited global modules. Remove the unsupported modules from the GlobalModules section, along with all associated configuration.

### Error: ISAPI filter check

#### Cause

The following unsupported ISAPI filters were detected: {0}.

#### Recommended Action

Automatic configuration of custom ISAPI filters isn't supported. Remove the unsupported ISAPI filters.

### Error: ISAPI filter check unknown

#### Cause

Unable to determine ISAPI filters present for all of the site configuration.

#### Recommended Action

Automatic configuration of custom ISAPI filters isn't supported. Fix all configuration errors and confirm that all site content locations are accessible to the administrator's group.

### Error: Location tag check

#### Cause

The following location paths were found in the applicationHost.config file: {0}.

#### Recommended Action

The migration method doesn't support moving location path configuration in applicationHost.config. Move the location path configuration to either the site's root web.config file or to a web.config file associated with the specific application to which it applies.

### Error: Protocol check

#### Cause

Bindings were found by using the following unsupported protocols: {0}.

#### Recommended Action

App Service only supports the HTTP and HTTPS protocols. Remove the bindings with protocols that aren't HTTP or HTTPS.

### Error: Virtual directory check

#### Cause

The following virtual directories are hosted on UNC shares: {0}.

#### Recommended Action

Migration doesn't support migrating site content hosted on UNC shares. Move content to a local file path or consider changing to a non-file-system-based storage option, such as Azure Storage. If you use shared configuration, disable shared configuration for the server before you modify the content paths.

### Error: HTTPS binding check

#### Cause

The application uses HTTPS.

#### Recommended Action

More manual steps are required for HTTPS configuration in App Service. Other post-migration steps are required to associate certificates with the App Service site.

### Error: TCP port check

#### Cause

Bindings were found on the following unsupported ports: {0}.

#### Recommended Action

App Service supports only ports 80 and 443. Clients making requests to the site should update the port in their requests to use 80 or 443.

### Error: Framework check

#### Cause

The following non-.NET frameworks or unsupported .NET framework versions were detected as possibly in use by this site: {0}.

#### Recommended Action

Migration doesn't validate the framework for non-.NET sites. App Service supports multiple frameworks, but these have different migration options. Confirm that the non-.NET frameworks aren't being used by the site, or consider using an alternate migration option.

## Next steps

[Create](how-to-create-assessment.md) or [customize](how-to-modify-assessment.md) an assessment.