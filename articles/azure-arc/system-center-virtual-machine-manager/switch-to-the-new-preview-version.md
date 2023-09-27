---
title: Switch to the new previous version
description: Learn how to switch to the new preview version and use its capabilities
ms.service: azure-arc
ms.subservice: azure-arc-scvmm
author: jyothisuri
ms.author: jsuri
ms.topic: how-to 
ms.date: 09/18/2023
keywords: "VMM, Arc, Azure"

#Customer intent: As a VI admin, I want to switch to the new preview version of Arc-enabled SCVMM (preview) and leverage the associated capabilities
---

# Switch to the new preview version of Arc-enabled SCVMM

On September 22, 2023, we rolled out major changes to **Azure Arc-enabled System Center Virtual Machine Manager preview**. By switching to the new preview version, you can use all the Azure management services that are available for Arc-enabled Servers.

>[!Note]
>If you're new to Arc-enabled SCVMM (preview), you'll be able to leverage the new capabilities by default. To get started with the preview, see [Quick Start for Azure Arc-enabled System Center Virtual Machine Manager (preview)](quickstart-connect-system-center-virtual-machine-manager-to-arc.md).

## Switch to the new preview version (Existing preview customer)

If you're an existing **Azure Arc-enabled SCVMM** customer, for VMs that are Azure-enabled, follow these steps to switch to the new preview version:

>[!Note]
> If you had enabled guest management on any of the VMs, [disconnect](/azure/azure-arc/servers/manage-agent?tabs=windows#step-2-disconnect-the-server-from-azure-arc) and [uninstall agents](/azure/azure-arc/servers/manage-agent?tabs=windows#step-3a-uninstall-the-windows-agent).

1.	From your browser, go to the SCVMM management servers blade on [Azure Arc Center](https://ms.portal.azure.com/#view/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/~/overview) and select the SCVMM management server resource.
2.	Select all the virtual machines that are Azure enabled with the older preview version.
3.	Select **Remove from Azure**. 
    :::image type="Virtual Machines" source="media/switch-to-the-new-preview-version/virtual-machines.png" alt-text="Screenshot of virtual machines.":::
4.	After successful removal from Azure, enable the same resources again in Azure.
5.	Once the resources are re-enabled, the VMs are auto switched to the new preview version. The VM resources will now be represented as **Machine - Azure Arc (SCVMM)**.
    :::image type="Overview" source="media/switch-to-the-new-preview-version/overview.png" alt-text="Screenshot of Overview page.":::
## Next steps

[Create a virtual machine on System Center Virtual Machine Manager using Azure Arc (preview)](quickstart-connect-system-center-virtual-machine-manager-to-arc.md).