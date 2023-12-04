---
title: Switch to the new version of Arc-enabled SCVMM
description: Learn how to switch to the new version and use its capabilities.
ms.service: azure-arc
ms.subservice: azure-arc-scvmm
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.topic: how-to 
ms.date: 11/15/2023
keywords: "VMM, Arc, Azure"

#Customer intent: As a VI admin, I want to switch to the new version of Arc-enabled SCVMM and leverage the associated capabilities
---

# Switch to the new version of Arc-enabled SCVMM

On September 22, 2023, we rolled out major changes to **Azure Arc-enabled System Center Virtual Machine Manager**. By switching to the new version, you can use all the Azure management services that are available for Arc-enabled Servers.

>[!Note]
>If you're new to Arc-enabled SCVMM, you'll be able to leverage the new capabilities by default. To get started, see [Quick Start for Azure Arc-enabled System Center Virtual Machine Manager](quickstart-connect-system-center-virtual-machine-manager-to-arc.md).

## Switch to the new version (Existing customer)

If you've onboarded to Arc-enabled SCVMM before September 22, 2023, for VMs that are Azure-enabled, follow these steps to switch to the new version:

>[!Note]
> If you had enabled guest management on any of the VMs, [disconnect](/azure/azure-arc/servers/manage-agent?tabs=windows#step-2-disconnect-the-server-from-azure-arc) and [uninstall agents](/azure/azure-arc/servers/manage-agent?tabs=windows#step-3a-uninstall-the-windows-agent).

1.	From your browser, go to the SCVMM management servers blade on [Azure Arc Center](https://ms.portal.azure.com/#view/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/~/overview) and select the SCVMM management server resource.
2.	Select all the virtual machines that are Azure enabled with the older version.
3.	Select **Remove from Azure**. 
    :::image type="Virtual Machines" source="media/switch-to-the-new-version-scvmm/virtual-machines.png" alt-text="Screenshot of virtual machines.":::
4.	After successful removal from Azure, enable the same resources again in Azure.
5.	Once the resources are re-enabled, the VMs are auto switched to the new version. The VM resources will now be represented as **Machine - Azure Arc (SCVMM)**.
    :::image type="Overview" source="media/switch-to-the-new-version-scvmm/overview.png" alt-text="Screenshot of Overview page.":::
## Next steps

[Create a virtual machine on System Center Virtual Machine Manager using Azure Arc](quickstart-connect-system-center-virtual-machine-manager-to-arc.md).