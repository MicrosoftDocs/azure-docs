---
title: Azure Update Manager support matrix
description: This article provides a summary of supported regions and operating system settings.
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 09/18/2023
ms.topic: overview
ms.custom: references_regions 
---

# Support matrix for Azure Update Manager

This article details the Windows and Linux operating systems supported and system requirements for machines or servers managed by Azure Update Manager. The article includes the supported regions and specific versions of the Windows Server and Linux operating systems running on Azure virtual machines (VMs) or machines managed by Azure Arc-enabled servers.

## Update sources supported

**Windows**: [Windows Update Agent (WUA)](/windows/win32/wua_sdk/updating-the-windows-update-agent) reports to Microsoft Update by default, but you can configure it to report to [Windows Server Update Services (WSUS)](/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus). If you configure WUA to report to WSUS, based on the last synchronization from WSUS with Microsoft Update, the results in Update Manager might differ from what Microsoft Update shows.

To specify sources for scanning and downloading updates, see [Specify intranet Microsoft Update service location](/windows/deployment/update/waas-wu-settings?branch=main#specify-intranet-microsoft-update-service-location). To restrict machines to the internal update service, see [Do not connect to any Windows Update internet locations](/windows-server/administration/windows-server-update-services/deploy/4-configure-group-policy-settings-for-automatic-updates?branch=main#do-not-connect-to-any-windows-update-internet-locations).

**Linux**: You can configure Linux machines to report to a local or public YUM or APT package repository. The results shown in Update Manager depend on where the machines are configured to report.

## Types of updates supported

The following types of updates are supported.

### Operating system updates

Update Manager supports operating system updates for both Windows and Linux.

Update Manager doesn't support driver updates.

### Extended Security Updates (ESU) for Windows Server

Using Azure Update Manager, you can deploy Extended Security Updates for your Azure Arc-enabled Windows Server 2012 / R2 machines. To enroll in Windows Server 2012 Extended Security Updates, follow the guidance on [How to get Extended Security Updates (ESU) for Windows Server 2012 and 2012 R2](/windows-server/get-started/extended-security-updates-deploy#extended-security-updates-enabled-by-azure-arc)

### First-party updates on Windows

By default, the Windows Update client is configured to provide updates only for the Windows operating system. If you enable the **Give me updates for other Microsoft products when I update Windows** setting, you also receive updates for other Microsoft products. Updates include security patches for Microsoft SQL Server and other Microsoft software.

Use one of the following options to perform the settings change at scale:

- For servers configured to patch on a schedule from Update Manager (with VM `PatchSettings` set to `AutomaticByPlatform = Azure-Orchestrated`), and for all Windows Servers running on an earlier operating system than Windows Server 2016, run the following PowerShell script on the server you want to change:

    ```powershell
    $ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")
    $ServiceManager.Services
    $ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
    $ServiceManager.AddService2($ServiceId,7,"")
    ```

- For servers running Windows Server 2016 or later that aren't using Update Manager scheduled patching (with VM `PatchSettings` set to `AutomaticByOS = Azure-Orchestrated`), you can use Group Policy to control this process by downloading and using the latest Group Policy [Administrative template files](/troubleshoot/windows-client/group-policy/create-and-manage-central-store).

> [!NOTE]
> Run the following PowerShell script on the server to disable first-party updates:
>
> ```powershell
> $ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")  
> $ServiceManager.Services 
> $ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
> $ServiceManager.RemoveService($ServiceId)
> ```

### Third-party updates

**Windows**: Update Manager relies on the locally configured update repository to update supported Windows systems, either WSUS or Windows Update. Tools such as [System Center Updates Publisher](/mem/configmgr/sum/tools/updates-publisher) allow you to import and publish custom updates with WSUS. This scenario allows Update Manager to update machines that use Configuration Manager as their update repository with third-party software. To learn how to configure Updates Publisher, see [Install Updates Publisher](/mem/configmgr/sum/tools/install-updates-publisher).

**Linux**: If you include a specific third-party software repository in the Linux package manager repository location, it's scanned when it performs software update operations. The package isn't available for assessment and installation if you remove it.

Update Manager doesn't support managing the Configuration Manager client.

## Supported regions

Update Manager scales to all regions for both Azure VMs and Azure Arc-enabled servers. The following table lists the Azure public cloud where you can use Update Manager.

# [Azure VMs](#tab/azurevm)

Azure Update Manager is available in all Azure public regions where compute virtual machines are available.

# [Azure Arc-enabled servers](#tab/azurearc)

Azure Update Manager is currently supported in the following regions. It implies that VMs must be in the following regions.

**Geography** | **Supported regions**
--- | ---
Africa | South Africa North
Asia Pacific | East Asia </br> South East Asia
Australia | Australia East </br> Australia Southeast
Brazil | Brazil South
Canada | Canada Central </br> Canada East
Europe | North Europe </br> West Europe
France | France Central
India | Central India
Japan | Japan East
Korea | Korea Central
Norway | Norway East
Sweden | Sweden Central
Switzerland | Switzerland North
United Kingdom | UK South </br> UK West
United States | Central US </br> East US </br> East US 2</br> North Central US </br> South Central US </br> West Central US </br> West US </br> West US 2 </br> West US 3  

---

## Supported operating systems

All operating systems are assumed to be x64. For this reason, x86 isn't supported for any operating system.
Update Manager doesn't support CIS-hardened images.

# [Azure VMs](#tab/azurevm-os)

### Azure Marketplace/PIR images

The Azure Marketplace image has the following attributes:

- **Publisher**: The organization that creates the image. Examples are `Canonical` and `MicrosoftWindowsServer`.
- **Offer**: The name of the group of related images created by the publisher. Examples are `UbuntuServer` and `WindowsServer`.
- **SKU**: An instance of an offer, such as a major release of a distribution. Examples are `18.04LTS` and `2019-Datacenter`.
- **Version**: The version number of an image SKU.

Update Manager supports the following operating system versions. You might experience failures if there are any configuration changes on the VMs, such as package or repository.

#### Windows operating systems

| **Publisher**| **Versions**
|----------|-------------|
|Microsoft Windows Server | 1709, 1803, 1809, 2012, 2016, 2019, 2022|
|Microsoft Windows Server HPC Pack | 2012, 2016, 2019 |
|Microsoft SQL Server | 2008, 2012, 2014, 2016, 2017, 2019, 2022 |
|Microsoft Visual Studio | ws2012r2, ws2016, ws2019, ws2022 |
|Microsoft Azure Site Recovery | Windows 2012
|Microsoft BizTalk Server | 2016, 2020 |
|Microsoft DynamicsAx | ax7 |
|Microsoft Power BI | 2016, 2017, 2019, 2022 |
|Microsoft SharePoint | sp* |

#### Linux operating systems

| **Publisher**| **Versions**
|----------|-------------|
|Canonical | Ubuntu 16.04, 18.04, 20.04, 22.04 |
|Red Hat | RHEL 7,8,9|
|OpenLogic | CentOS 7|
|SUSE 12 |sles, sles-byos, sap, sap-byos, sapcal, sles-standard |
|SUSE 15 | basic, hpc, opensuse, sles, sap, sapcal|
|Oracle Linux | 7*, ol7*, ol8*, ol9* |
|Oracle Database | 21, 19-0904, 18.*|

#### Unsupported operating systems

The following table lists the operating systems for Azure Marketplace images that aren't supported.

| **Publisher**| **OS offer** | **SKU**|
|----------|-------------|-----|
|OpenLogic | CentOS | 8* |
|OpenLogic | centos-hpc| * |
|Oracle | Oracle-Linux | 8, 8-ci, 81, 81-ci , 81-gen2, ol82, ol8_2-gen2,ol82-gen2, ol83-lvm, ol83-lvm-gen2, ol84-lvm,ol84-lvm-gen2 |
|Red Hat | RHEL | 74-gen2 |
|Red Hat | RHEL-HANA | 7.4, 7.5, 7.6, 8.1, 81_gen2 |
|Red Hat | 	RHEL-SAP | 7.4, 7.5, 7.7 |
|Red Hat | 	RHEL-SAP-HANA | 7.5 |
|Microsoft SQL Server | SQL 2019-SLES* | * |
|Microsoft SQL Server | SQL 2019-RHEL7 | * |
|Microsoft SQL Server | SQL 2017-RHEL7 | * |
|Microsoft | microsoft-ads |*.* |
|SUSE| sles-sap-15-*-byos | gen *|

### Custom images

We support custom images. The following table lists the operating systems that we support for custom images. For instructions on how to start using Update Manager to manage updates on custom images, see [Custom images (preview)](manage-updates-customized-images.md).

   |**Windows operating system**|
   |---|
   |Windows Server 2022|
   |Windows Server 2019|
   |Windows Server 2016|
   |Windows Server 2012 R2|
   |Windows Server 2012|
   |Windows Server 2008 R2 (RTM and SP1 Standard)|

   |**Linux operating system**|
   |---|
   |CentOS 7, 8|
   |Oracle Linux 7.x, 8x|
   |Red Hat Enterprise 7, 8, 9|
   |SUSE Linux Enterprise Server 12.x, 15.0-15.4|
   |Ubuntu 16.04 LTS, 18.04 LTS, 20.04 LTS, 22.04 LTS|

# [Azure Arc-enabled servers](#tab/azurearc-os)

The following table lists the operating systems supported on [Azure Arc-enabled servers](../azure-arc/servers/overview.md).

   |**Operating system**|
   |-------------|
   | Amazon Linux 2023 |
   | Windows Server 2012 R2 and higher (including Server Core) |
   | Windows Server 2008 R2 SP1 with PowerShell enabled and .NET Framework 4.0+ |
   | Ubuntu 16.04, 18.04, 20.04, and 22.04 LTS |
   | CentOS Linux 7 and 8 (x64) |   
   | SUSE Linux Enterprise Server (SLES) 12 and 15 (x64) |
   | Red Hat Enterprise Linux (RHEL) 7, 8, 9 (x64) |    
   | Amazon Linux 2 (x64)   |
   | Oracle 7.x, 8.x|
   | Debian 10 and 11|
   | Rocky Linux 8|        

---

## Unsupported operating systems

The following table lists the operating systems that aren't supported.

   | **Operating system**| **Notes**
   |----------|-------------|
   | Windows client | For client operating systems such as Windows 10 and Windows 11, we recommend [Microsoft Intune](/mem/intune/) to manage updates.|
   | Virtual machine scale sets| We recommend that you use [Automatic upgrades](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md) to patch the virtual machine scale sets.|
   | Azure Kubernetes Service nodes| We recommend the patching described in [Apply security and kernel updates to Linux nodes in Azure Kubernetes Service (AKS)](/azure/aks/node-updates-kured).|

Because Update Manager depends on your machine's OS package manager or update service, ensure that the Linux package manager or Windows Update client is enabled and can connect with an update source or repository. If you're running a Windows Server OS on your machine, see [Configure Windows Update settings](configure-wu-agent.md).

## Next steps

- [View updates for a single machine](view-updates.md)
- [Deploy updates now (on-demand) for a single machine](deploy-updates.md)
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via the portal](manage-update-settings.md)
