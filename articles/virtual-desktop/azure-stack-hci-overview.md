---
title: Azure Virtual Desktop for Azure Stack HCI (preview) - Azure
description: A brief overview of Azure Virtual Desktop for Azure Stack HCI (preview).
author: Heidilohr
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: helohr
manager: femila
ms.custom: ignite-fall-2021
---
# Azure Virtual Desktop for Azure Stack HCI (preview)

> [!IMPORTANT]
> Azure Virtual Desktop for Azure Stack HCI is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Virtual Desktop for Azure Stack HCI (preview) lets you deploy Azure Virtual Desktop session hosts to your on-premises Azure Stack HCI infrastructure. You can also use Azure Virtual Desktop for Azure Stack HCI to manage your session hosts from the Azure portal. If you already have an existing on-premises Virtual Desktop Infrastructure (VDI) deployment, Azure Virtual Desktop for Azure Stack HCI can improve your administrator and end-user experience. If you're already using Azure Virtual Desktop in the cloud, you can extend your deployment to your on-premises infrastructure to better meet your performance or data locality needs.

Azure Virtual Desktop for Azure Stack HCI is currently in public preview. Azure Stack HCI doesn't currently support certain important Azure Virtual Desktop features. Because of these limitations, we don't recommend using this feature for production workloads yet.

## Key benefits

We've established what Azure Virtual Desktop for Azure Stack HCI is. The question remains: what can it do for you?

With Azure Virtual Desktop for Azure Stack HCI, you can:

- Improve performance for Azure Virtual Desktop users in areas with poor connectivity to the Azure public cloud by giving them session hosts closer to their location.

- Meet data locality requirements by keeping app and user data on-premises.  For more information, see [Data locations for Azure Virtual Desktop](data-locations.md).

- Improve access to legacy on-premises apps and data sources by keeping virtual desktops and apps in the same location.

- Reduce costs and improve user experience with Windows 10 and Windows 11 Enterprise multi-session virtual desktops.

- Simplify your VDI deployment and management compared to traditional on-premises VDI solutions by using the Azure portal.

## Pricing

The following things affect how much it costs to run Azure Virtual Desktop for Azure Stack HCI:
 - Infrastructure costs. You'll pay monthly service fees for Azure Stack HCI. Learn more at [Azure Stack HCI pricing](https://azure.microsoft.com/pricing/details/azure-stack/hci/).
 
- User access rights for Azure Virtual Desktop. The same licenses that grant access to Azure Virtual Desktop in the cloud also apply to Azure Virtual Desktop for Azure Stack HCI. Learn more at [Azure Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).

- The Azure Virtual Desktop hybrid service fee. This fee requires you to pay for each active virtual CPU (vCPU) of Azure Virtual Desktop session hosts you're running on Azure Stack HCI. This fee will become active once the preview period ends.

## Known issues and limitations

We're aware of the following issues affecting the public preview version of Azure Virtual Desktop for Azure Stack HCI:

- Azure Stack HCI host pools don't currently support the following Azure Virtual Desktop features:
    
    - [Azure Monitor for Azure Virtual Desktop](azure-monitor.md)
    - [Session host scaling with Azure Automation](set-up-scaling-script.md)
    - [Autoscale (preview)](autoscale-scaling-plan.md)
    - [Start VM on connect](start-virtual-machine-connect.md)
    - [Multimedia redirection (preview)](multimedia-redirection.md)
    - [Per-user access pricing](./remote-app-streaming/licensing.md)

- The Azure Virtual Desktop tab in the Azure portal can't create new virtual machines directly on Azure Stack HCI infrastructure. Instead, admins must create on-premises virtual machines separately, then register them with an Azure Virtual Desktop host pool.

- When connecting to a Windows 10 or 11 Enterprise multi-session virtual desktop, users may see activation issues, such as a desktop watermark saying "Activate Windows," even if they have an eligible license.

- Azure Virtual Desktop for Azure Stack HCI doesn't currently support host pools containing both cloud and on-premises session hosts. Each host pool in the deployment must have only one type of host pool.

- Session hosts on Azure Stack HCI don't support certain cloud-only Azure services.

- Because Azure Stack HCI supports so many types of hardware and on-premises networking capabilities that performance and user density may vary widely between session hosts running in the Azure cloud. Azure Virtual Desktop's [virtual machine sizing guidelines](/windows-server/remote/remote-desktop-services/virtual-machine-recs) are broad, so you should only use them for initial performance estimates.

If there are any issues you encounter during the preview that aren't on this list, we encourage you to report them.

## Next steps

Now that you’re familiar with Azure Virtual Desktop for Azure Stack HCI, learn how to deploy this feature at [Set up Azure Virtual Desktop for Azure Stack HCI (preview)](azure-stack-hci.md).
