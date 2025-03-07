---
title: Azure Virtual Desktop on Azure Local
description: Learn about using Azure Virtual Desktop on Azure Local, enabling you to deploy session hosts where you need them.
ms.topic: conceptual
author: dknappettmsft
ms.author: daknappe
ms.date: 09/17/2024
---

# Azure Virtual Desktop on Azure Local

> [!IMPORTANT]
>- Azure Virtual Desktop on Azure Local for Azure Government and Azure operated by 21Vianet (Azure in China) is currently in preview with HCI version 22H2. Portal provisioning isn't available.
>- See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 

Using Azure Virtual Desktop on Azure Local, you can deploy session hosts for Azure Virtual Desktop where you need them. If you already have an existing on-premises virtual desktop infrastructure (VDI) deployment, Azure Virtual Desktop on Azure Local can improve your experience. If you're already using Azure Virtual Desktop with your session hosts in Azure, you can extend your deployment to your on-premises infrastructure to better meet your performance or data locality needs.

Azure Virtual Desktop service components, such as host pools, workspaces, and application groups are all deployed in Azure, but you can choose to deploy session hosts on Azure Local. As Azure Virtual Desktop on Azure Local isn't an Azure Arc-enabled service, it's not supported as a standalone service outside of Azure, in a multicloud environment, or on other Azure Arc-enabled servers.

## Benefits

Using Azure Virtual Desktop on Azure Local, you can:

- Improve performance for Azure Virtual Desktop users in areas with poor connectivity to the Azure public cloud by giving them session hosts closer to their location.

- Meet data locality requirements by keeping app and user data on-premises. For more information, see [Data locations for Azure Virtual Desktop](data-locations.md).

- Improve access to legacy on-premises apps and data sources by keeping desktops and apps in the same location.

- Reduce cost and improve user experience with Windows 10 and Windows 11 Enterprise multi-session, which allows multiple concurrent interactive sessions.

- Simplify your VDI deployment and management compared to traditional on-premises VDI solutions by using the Azure portal.

- Achieve the best performance by using [RDP Shortpath](rdp-shortpath.md?tabs=managed-networks) for low-latency user access.

- Deploy the latest fully patched images quickly and easily using [Azure Marketplace images](/azure-stack/hci/manage/virtual-machine-image-azure-marketplace).

## Supported deployment configurations

Your Azure Local instances need to be running a minimum of [version 23H2](/azure-stack/hci/release-information) and [registered with Azure](/azure-stack/hci/deploy/register-with-azure).

Once your instance is ready, you can use the following 64-bit operating system images for your session hosts that are in support:

- Windows 11 Enterprise multi-session
- Windows 11 Enterprise
- Windows 10 Enterprise multi-session
- Windows 10 Enterprise
- Windows Server 2022
- Windows Server 2019

To use session hosts on Azure Local with Azure Virtual Desktop, you also need to:

- License and activate the virtual machines. For activating Windows 10 and Windows 11 Enterprise multi-session, and Windows Server 2022 Datacenter: Azure Edition, use [Azure verification for VMs](/azure-stack/hci/deploy/azure-verification). For all other OS images (such as Windows 10 and Windows 11 Enterprise, and other editions of Windows Server), you should continue to use existing activation methods. For more information, see [Activate Windows Server VMs on Azure Local](/azure-stack/hci/manage/vm-activate).

- Install the [Azure Connected Machine agent](/azure/azure-arc/servers/agent-overview) on the virtual machines so they can communicate with [Azure Instance Metadata Service](/azure/virtual-machines/instance-metadata-service), which is a [required endpoint for Azure Virtual Desktop](../virtual-desktop/required-fqdn-endpoint.md). The Azure Connected Machine agent is automatically installed when you add session hosts using the Azure portal as part of the process to [Deploy Azure Virtual Desktop](deploy-azure-virtual-desktop.md) or [Add session hosts to a host pool](add-session-hosts-host-pool.md).

Finally, users can connect using the same [Remote Desktop clients](users/remote-desktop-clients-overview.md) as Azure Virtual Desktop.

## Licensing and pricing

To run Azure Virtual Desktop on Azure Local, you need to make sure you're licensed correctly and be aware of the pricing model. There are three components that affect how much it costs to run Azure Virtual Desktop on Azure Local:

- **User access rights.** The same licenses that grant access to Azure Virtual Desktop on Azure also apply to Azure Virtual Desktop on Azure Local. Learn more at [Azure Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).

- **Azure Local service fee.** Learn more at [Azure Local pricing](https://azure.microsoft.com/pricing/details/azure-stack/hci/).
 
- **Azure Virtual Desktop for Azure Local service fee.** This fee requires you to pay for each active virtual CPU (vCPU) for your Azure Virtual Desktop session hosts running on Azure Local. Learn more at [Azure Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).

## Data storage

There are different classifications of data for Azure Virtual Desktop, such as customer input, customer data, diagnostic data, and service-generated data. With Azure Local, you can choose to store user data on-premises when you deploy session host virtual machines (VMs) and associated services such as file servers. However, some customer data, diagnostic data, and service-generated data is still stored in Azure. For more information on how Azure Virtual Desktop stores different kinds of data, see [Data locations for Azure Virtual Desktop](data-locations.md).

### FSLogix profile containers storage

To store FSLogix profile containers, you need to provide an SMB share. We recommend you create a VM-based file share cluster using Storage Spaces Direct on top of your Azure Local instance.
	
Here are the high-level steps you need to perform:
	
1. Deploy virtual machines on Azure Local. For more information, see [Manage VMs with Windows Admin Center on Azure Local](/azure/azure-local/manage/vm).
	
1. For storage redundancy and high availability, use [Storage Spaces Direct in guest virtual machine clusters](/windows-server/storage/storage-spaces/storage-spaces-direct-in-vm). For more information, see [Deploy Storage Spaces Direct on Windows Server](/windows-server/storage/storage-spaces/deploy-storage-spaces-direct).
	
1. Configure storage permissions. For more information, see [Configure SMB Storage permissions](/fslogix/how-to-configure-storage-permissions).
	
1. Configure FSLogix [profile containers](/fslogix/tutorial-configure-profile-containers). 

For large Azure Virtual Desktop deployments that have high resource requirements, we recommend that the profile container storage is located external to Azure Local and on any separate SMB file share on the same network as your session hosts. This allows you to independently scale storage and compute resources for your profile management based on your usage needs independently of your Azure Local instance.  

## Limitations

Azure Virtual Desktop on Azure Local has the following limitations:

- Each host pool must only contain session hosts on Azure or on Azure Local. You can't mix session hosts on Azure and on Azure Local in the same host pool.

- Azure Local supports many types of hardware and on-premises networking capabilities, so performance and user density might vary compared to session hosts running on Azure. Azure Virtual Desktop's [virtual machine sizing guidelines](/windows-server/remote/remote-desktop-services/virtual-machine-recs) are broad, so you should use them for initial performance estimates and monitor after deployment.

- You can only join session hosts on Azure Local to an Active Directory Domain Services (AD DS) domain. This includes using [Microsoft Entra hybrid join](/entra/identity/devices/concept-hybrid-join), where you can benefit from some of the functionality provided by Microsoft Entra ID.

- Azure Local isn't supported for disconnected Azure Virtual Desktop sessions.

## Next step

To learn how to deploy Azure Virtual Desktop on Azure Local, see [Deploy Azure Virtual Desktop](deploy-azure-virtual-desktop.md).
