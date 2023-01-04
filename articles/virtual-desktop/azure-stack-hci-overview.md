---
title: Azure Virtual Desktop for Azure Stack HCI (preview) overview
description: Overview of Azure Virtual Desktop for Azure Stack HCI (preview).
author: dansisson
ms.topic: conceptual
ms.date: 10/20/2022
ms.author: v-dansisson
ms.reviewer: daknappe
manager: femila
ms.custom: ignite-fall-2021
---
# Azure Virtual Desktop for Azure Stack HCI overview (preview)

Azure Virtual Desktop for Azure Stack HCI (preview) lets you deploy Azure Virtual Desktop session hosts on your on-premises Azure Stack HCI infrastructure. You manage your session hosts from the Azure portal.

## Overview

If you already have an existing on-premises Virtual Desktop Infrastructure (VDI) deployment, Azure Virtual Desktop for Azure Stack HCI can improve your experience. If you're already using Azure Virtual Desktop in the cloud, you can extend your deployment to your on-premises infrastructure to better meet your performance or data locality needs.

Azure Virtual Desktop for Azure Stack HCI is currently in public preview. As such, it doesn't currently support certain important Azure Virtual Desktop features. Because of these limitations, we don't recommend using this feature for production workloads yet.

> [!IMPORTANT]
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta.

> [!NOTE]
> Azure Virtual Desktop for Azure Stack HCI is not an Azure Arc-enabled service. As such, it is not supported outside of Azure, in a multi-cloud environment, or on Azure Arc-enabled servers besides Azure Stack HCI virtual machines as described in this article.

## Benefits

With Azure Virtual Desktop for Azure Stack HCI, you can:

- Improve performance for Azure Virtual Desktop users in areas with poor connectivity to the Azure public cloud by giving them session hosts closer to their location.

- Meet data locality requirements by keeping app and user data on-premises.  For more information, see [Data locations for Azure Virtual Desktop](data-locations.md).

- Improve access to legacy on-premises apps and data sources by keeping virtual desktops and apps in the same location.

- Reduce costs and improve user experience with Windows 10 and Windows 11 Enterprise multi-session virtual desktops.

- Simplify your VDI deployment and management compared to traditional on-premises VDI solutions by using the Azure portal.

- Achieve best performance by leveraging [RDP Shortpath](rdp-shortpath.md?tabs=managed-networks) for low-latency user access.

- Deploy the latest fully patched images quickly and easily using [Azure Marketplace images](/azure-stack/hci/manage/virtual-machine-image-azure-marketplace?tabs=azurecli).


## Supported platforms

Azure Virtual Desktop for Azure Stack HCI supports the same [Remote Desktop clients](user-documentation/index.yml) as Azure Virtual Desktop, and supports the following x64 operating system images:

- Windows 11 Enterprise multi-session
- Windows 11 Enterprise
- Windows 10 Enterprise multi-session, version 21H2
- Windows 10 Enterprise, version 21H2
- Windows Server 2022
- Windows Server 2019

## Pricing

The following things affect how much it costs to run Azure Virtual Desktop for Azure Stack HCI:

 - **Infrastructure costs.** You'll pay monthly service fees for Azure Stack HCI. Learn more at [Azure Stack HCI pricing](https://azure.microsoft.com/pricing/details/azure-stack/hci/).
 
- **User access rights.** The same licenses that grant access to Azure Virtual Desktop in the cloud also apply to Azure Virtual Desktop for Azure Stack HCI. Learn more at [Azure Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).

- **Hybrid service fee.** This fee requires you to pay for each active virtual CPU (vCPU) of Azure Virtual Desktop session hosts you're running on Azure Stack HCI. This fee will become active once the preview period ends.

## Data storage

Azure Virtual Desktop for Azure Stack HCI doesn't guarantee that all data is stored on-premises. You can choose to store user data on-premises by locating session host virtual machines (VMs) and associated services such as file servers on-premises. However, some customer data, diagnostic data, and service-generated data are still stored in Azure. For more information on how Azure Virtual Desktop stores different kinds of data, see [Data locations for Azure Virtual Desktop](data-locations.md).

## Known issues and limitations

The following issues affect the preview version of Azure Virtual Desktop for Azure Stack HCI:

- Templates may show failures in certain cases at the domain-joining step. To proceed, you can manually join the session hosts to the domain. For more information, see [VM provisioning through Azure portal on Azure Stack HCI](/azure-stack/hci/manage/azure-arc-enabled-virtual-machines).

- Azure Stack HCI host pools don't currently support the following Azure Virtual Desktop features:
    
    - [Azure Virtual Desktop Insights](insights.md)
    - [Session host scaling with Azure Automation](set-up-scaling-script.md)
    - [Autoscale plan](autoscale-scaling-plan.md)
    - [Start VM On Connect](start-virtual-machine-connect.md)
    - [Multimedia redirection (preview)](multimedia-redirection.md)
    - [Per-user access pricing](./remote-app-streaming/licensing.md)

- Azure Virtual Desktop for Azure Stack HCI doesn't currently support host pools containing both cloud and on-premises session hosts. Each host pool in the deployment must have only one type of host pool.

- Session hosts on Azure Stack HCI don't support certain cloud-only Azure services.

- Because Azure Stack HCI supports so many types of hardware and on-premises networking capabilities that performance and user density may vary widely between session hosts running in the Azure cloud. Azure Virtual Desktop's [virtual machine sizing guidelines](/windows-server/remote/remote-desktop-services/virtual-machine-recs) are broad, so you should only use them for initial performance estimates.

## Next steps

[Set up Azure Virtual Desktop for Azure Stack HCI (preview)](azure-stack-hci.md).
