---
title: Update management center (preview) support matrix
description: Provides a summary of supported regions and operating system settings
ms.service: update-management-center
author: SGSneha
ms.author: v-ssudhir
ms.date: 03/07/2022
ms.topic: overview
ms.custom: references_regions
---

# Update management center support matrix

 The article summarizes the supported regions and specific versions of the Windows Server and Linux operating systems running on Azure VMs or machines managed by Arc enabled servers. 

## Supported regions
Update management center (preview) will scale to all regions in public preview stage. Listed below are the Azure public cloud where you can use update management center (preview).

# [Azure virtual machine](#tab/azurevm)

Update management center (preview) **on demand assessment, on demand patching** on **Azure Compute virtual machines** is available in all Azure public regions where Compute virtual machines are available.

# [Azure arc-enabled servers](#tab/azurearc)
Update management center (preview) **on demand assessment, on demand patching** on **Azure arc-enabled servers** is supported in the following regions currently. It implies that VMs must be in below regions:

**Geography** | **Supported Regions**
--- | ---
Australia | Australia East
United States | East US </br> South Central-US </br> West Central-US </br> West US 2
Europe | North Europe </br> West Europe
Asia | South East Asia
United Kingdom | UK South

---

The Update management center (preview) **periodic assessment** and **scheduled patching** features are currently supported in the below regions:

**Geography** | **Supported Regions**
--- | ---
Australia | Australia East
United States | South Central US </br> West Central US </br>
Europe | North Europe
Asia | South East Asia
United Kingdom | UK South

## Supported operating systems

Update management center (preview) supports specific versions of the Windows Server and Linux operating systems that run on Azure VMs or machines managed by Arc enabled servers. Before you enable update management center (preview), confirm that the target machines meet the operating system requirements.

# [Azure VMs](#tab/azurevm-os)

[Azure VMs](/azure/virtual-machines/index) are: 
 
   | Publisher | Operating System | SKU |
   |----------|-------------|-------------|
   | Canonical | UbuntuServer | 16.04-LTS, 18.04-LTS |
   | Canonical | 0001-com-ubuntu-server-focal | 20_04-LTS |
   | Canonical | 0001-com-ubuntu-pro-focal | pro-20_04-LTS |
   | Canonical | 0001-com-ubuntu-pro-bionic | pro-18_04-LTS |
   | Redhat | RHEL | 7-RAW, 7-LVM, 6.8, 6.9, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7_9, 8, 8.1, 8.2, 8_3, 8-LVM |    
   | Redhat | RHEL-RAW | 8-RAW |     
   | OpenLogic | CentOS | 6.8, 6.9, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7_8, 7_9, 8.0, 8_1, 8_2, 8_3 |
   | OpenLogic | CentOS-LVM | 7-LVM, 8-LVM |
   | SUSE | SLES-12-SP5 | Gen1, Gen2 |
   | SUSE | SLES-15-SP2 | Gen1, Gen2 |
   | MicrosoftWindowsServer | WindowsServer | 2012-R2-Datacenter |
   | MicrosoftWindowsServer | WindowsServer | 2016-Datacenter |
   | MicrosoftWindowsServer | WindowsServer | 2016-Datacenter-Server-Core |   
   | MicrosoftWindowsServer | WindowsServer | 2019-Datacenter |
   | MicrosoftWindowsServer | WindowsServer | 2019-Datacenter-Core |
   | MicrosoftWindowsServer | WindowsServer | 2008-R2-SP1 |
   | MicrosoftWindowsServer | MicrosoftServerOperatingSystems-Previews | Windows-Server-2019-Azure-Edition-Preview |
   | MicrosoftWindowsServer | MicrosoftServerOperatingSystems-Previews | Windows-Server-2022-Azure-Edition-Preview |
   | MicrosoftVisualStudio | VisualStudio | VS-2017-ENT-Latest-WS2016 | 
   
   >[!NOTE]
   > Custom images are currently not supported.

# [Azure Arc-enabled servers](#tab/azurearc-os)

[Azure Arc-enabled servers](/azure/azure-arc/servers/overview) are:

   | Publisher | Operating System
   |----------|-------------|
   | Microsoft Corporation | Windows Server 2012 R2 and higher (including Server Core) |
   | Microsoft Corporation | Windows Server 2008 R2 SP1 with PowerShell enabled and .NET Framework 4.0+ |
   | Canonical | Ubuntu 16.04, 18.04, and 20.04 LTS (x64) |
   | Red Hat | CentOS Linux 7 and 8 (x64) |   
   | SUSE | SUSE Linux Enterprise Server (SLES) 12 and 15 (x64) |
   | Red Hat | Red Hat Enterprise Linux (RHEL) 7 and 8 (x64) |    
   | Amazon | Amazon Linux 2 (x64)   |
   | Oracle | Oracle 7.x |       

---

As the Update management center (preview) depends on your machine's OS package manager or update service, ensure that the Linux package manager or Windows Update client are enabled and can connect with an update source or repository. If you're running a Windows Server OS on your machine, refer to the following article to [configure Windows Update settings](configure-wu-agent.md).
 
 > [!NOTE]
 > For patching, update management center (preview) relies on classification data available on the machine. Unlike other distributions, CentOS YUM package manager does not have this information available in the RTM version to classify updates and packages in different categories.

## Network planning

To prepare your network to support, update management center (preview), you may need to configure some infrastructure components.

For Windows machines, you must also allow traffic to any endpoints required by Windows Update agent. You can find an updated list of required endpoints in [Issues related to HTTP/Proxy](/windows/deployment/update/windows-update-troubleshooting#issues-related-to-httpproxy). If you have a local [Windows Server Update Services](/windows-server/administration/windows-server-update-services/plan/plan-your-wsus-deployment) (WSUS) deployment, you must also allow traffic to the server specified in your [WSUS key](/windows/deployment/update/waas-wu-settings#configuring-automatic-updates-by-editing-the-registry).

For Red Hat Linux machines, see [IPs for the RHUI content delivery servers](/azure/virtual-machines/workloads/redhat/redhat-rhui#the-ips-for-the-rhui-content-delivery-servers) for required endpoints. For other Linux distributions, see your provider documentation.

## VM images

Update management center (preview) supports Azure VMs created using Azure Marketplace images, the virtual machine agent is already included in the Azure Marketplace image. If you have created Azure VMs using custom VM images and not an image from the Azure Marketplace, you need to manually install and enable the Azure virtual machine agent. For details see:

- [Manual install of Azure Windows VM agent](/azure/virtual-machines/extensions/agent-windows#manual-installation)
- [Manual install of Azure Linux VM agent](/azure/virtual-machines/extensions/agent-linux#installation)


## Next steps

- [Enable update management center (preview)](enable-machines.md) for your Azure VMs or Azure Arc-enabled servers.
- [View updates for single machine](view-updates.md) 
- [Deploy updates now (on-demand) for single machine](deploy-updates.md) 
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via Portal](manage-update-settings.md)
- [Manage multiple machines using update management center](manage-multiple-machines.md)