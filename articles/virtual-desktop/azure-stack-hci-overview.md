---
title: Azure Virtual Desktop for Azure Stack HCI (preview)
description: Learn about using Azure Virtual Desktop for Azure Stack HCI (preview) to deploy session hosts where you need them.
ms.topic: conceptual
author: dknappettmsft
ms.author: daknappe
ms.date: 10/31/2023
---

# Azure Virtual Desktop for Azure Stack HCI (preview)

> [!IMPORTANT]
> Azure Virtual Desktop for Azure Stack HCI is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

With Azure Virtual Desktop for Azure Stack HCI (preview), you can deploy session hosts for Azure Virtual Desktop where you need them. If you already have an existing on-premises virtual desktop infrastructure (VDI) deployment, Azure Virtual Desktop for Azure Stack HCI can improve your experience. If you're already using Azure Virtual Desktop on Azure, you can extend your deployment to your on-premises infrastructure to better meet your performance or data locality needs.

Azure Virtual Desktop for Azure Stack HCI isn't an Azure Arc-enabled service. As such, it's not supported as a standalone service outside of Azure, in a multicloud environment, or on Azure Arc-enabled servers besides Azure Stack HCI virtual machines as described in this article.

## Benefits

With Azure Virtual Desktop for Azure Stack HCI, you can:

- Improve performance for Azure Virtual Desktop users in areas with poor connectivity to the Azure public cloud by giving them session hosts closer to their location.

- Meet data locality requirements by keeping app and user data on-premises. For more information, see [Data locations for Azure Virtual Desktop](data-locations.md).

- Improve access to legacy on-premises apps and data sources by keeping desktops and apps in the same location.

- Reduce cost and improve user experience with Windows 10 and Windows 11 Enterprise multi-session, which allows multiple concurrent interactive sessions.

- Simplify your VDI deployment and management compared to traditional on-premises VDI solutions by using the Azure portal.

- Achieve the best performance by using [RDP Shortpath](rdp-shortpath.md?tabs=managed-networks) for low-latency user access.

- Deploy the latest fully patched images quickly and easily using [Azure Marketplace images](/azure-stack/hci/manage/virtual-machine-image-azure-marketplace).

## Supported platforms

Azure Virtual Desktop for Azure Stack HCI supports the same [Remote Desktop clients](user-documentation/index.yml) as Azure Virtual Desktop, and you can use the following 64-bit operating system images that are in support:

- Windows 11 Enterprise multi-session
- Windows 11 Enterprise
- Windows 10 Enterprise multi-session
- Windows 10 Enterprise
- Windows Server 2022
- Windows Server 2019

## Licensing and pricing

To run Azure Virtual Desktop on Azure Stack HCI, you need to make sure you're licensed correctly and be aware of the pricing model. There are three components that affect how much it costs to run Azure Virtual Desktop for Azure Stack HCI:

- **User access rights.** The same licenses that grant access to Azure Virtual Desktop on Azure also apply to Azure Virtual Desktop for Azure Stack HCI. Learn more at [Azure Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).

- **Infrastructure costs.** Learn more at [Azure Stack HCI pricing](https://azure.microsoft.com/pricing/details/azure-stack/hci/).
 
- **Hybrid service fee.** This fee requires you to pay for each active virtual CPU (vCPU) for your Azure Virtual Desktop session hosts running on Azure Stack HCI. This fee becomes active once the preview period ends.

## Data storage

There are different classifications of data for Azure Virtual Desktop, such as customer input, customer data, diagnostic data, and service-generated data. With Azure Stack HCI, you can choose to store user data on-premises when you deploy session host virtual machines (VMs) and associated services such as file servers. However, some customer data, diagnostic data, and service-generated data is still stored in Azure. For more information on how Azure Virtual Desktop stores different kinds of data, see [Data locations for Azure Virtual Desktop](data-locations.md).

## Limitations

Azure Virtual Desktop for Azure Stack HCI has the following limitations:

- Your Azure Stack HCI clusters need to be running a minimum of version 23H2. For more information, see [Azure Stack HCI release information](/azure-stack/hci/release-information) and [Updates and upgrades](/azure-stack/hci/concepts/updates).

- Session hosts running on Azure Stack HCI don't support some Azure Virtual Desktop features, such as:
    
    - [Azure Virtual Desktop Insights](insights.md)
    - [Autoscale](autoscale-scaling-plan.md)
    - [Session host scaling with Azure Automation](set-up-scaling-script.md)
    - [Start VM On Connect](start-virtual-machine-connect.md)
    - [Multimedia redirection](multimedia-redirection.md)
    - [Per-user access pricing](./remote-app-streaming/licensing.md)

- Each host pool must only contain session hosts on Azure or on Azure Stack HCI. You can't mix session hosts on Azure and on Azure Stack HCI in the same host pool.

- Session hosts on Azure Stack HCI don't support certain cloud-only Azure services.

- Azure Stack HCI supports many types of hardware and on-premises networking capabilities, so performance and user density might vary compared to session hosts running on Azure. Azure Virtual Desktop's [virtual machine sizing guidelines](/windows-server/remote/remote-desktop-services/virtual-machine-recs) are broad, so you should use them for initial performance estimates and monitor after deployment.

- You must license and activate session hosts before you use them on Azure Stack HCI. For activating Windows 10 and Windows 11 Enterprise multi-session, and Windows Server 2022 Datacenter: Azure Edition you need to enable [Azure Benefits on Azure Stack HCI](/azure-stack/hci/manage/azure-benefits). For all other OS images (such as Windows 10 and Windows 11 Enterprise, and other editions of Windows Server), you should continue to use existing activation methods. For more information, see [Activate Windows Server VMs on Azure Stack HCI](/azure-stack/hci/manage/vm-activate).

- Templates may show failures in certain cases at the domain-joining step. To proceed, you can manually join the session hosts to the domain. For more information, see [VM provisioning through Azure portal on Azure Stack HCI](/azure-stack/hci/manage/azure-arc-enabled-virtual-machines).
## Next steps

To learn how to deploy Azure Virtual Desktop for Azure Stack HCI, see [Deploy Azure Virtual Desktop](deploy-azure-virtual-desktop.md).
