---
title: Plan for deployment
description: Learn about the support matrix for Arc-enabled VMware vSphere including vCenter Server versions supported, network requirements, and more.
ms.topic: how-to 
ms.date: 11/06/2023
ms.service: azure-arc
ms.subservice: azure-arc-vmware-vsphere
# Customer intent: As a VI admin, I want to understand the support matrix for Arc-enabled VMware vSphere.
---

# Support matrix for Azure Arc-enabled VMware vSphere

This article documents the prerequisites and support requirements for using [Azure Arc-enabled VMware vSphere](overview.md) to manage your VMware vSphere VMs through Azure Arc.

To use Arc-enabled VMware vSphere, you must deploy an Azure Arc resource bridge in your VMware vSphere environment. The resource bridge provides an ongoing connection between your VMware vCenter Server and Azure. Once you've connected your VMware vCenter Server to Azure, components on the resource bridge discover your vCenter inventory. You can enable them in Azure and start performing virtual hardware and guest OS operations on them using Azure Arc.

## VMware vSphere requirements

The following requirements must be met in order to use Azure Arc-enabled VMware vSphere.

### Supported vCenter Server versions

Azure Arc-enabled VMware vSphere works with vCenter Server versions 7 and 8.

> [!NOTE]
> Azure Arc-enabled VMware vSphere currently supports vCenters with a maximum of 9500 VMs. If your vCenter has more than 9500 VMs, it's not recommended to use Arc-enabled VMware vSphere with it at this point.

### Required vSphere account privileges

You need a vSphere account that can:

- Read all inventory.
- Deploy and update VMs to all the resource pools (or clusters), networks, and VM templates that you want to use with Azure Arc.

This account is used for the ongoing operation of Azure Arc-enabled VMware vSphere and the deployment of the Azure Arc resource bridge VM.

### Resource bridge resource requirements

For Arc-enabled VMware vSphere, resource bridge has the following minimum virtual hardware requirements

- 16 GB of memory
- 4 vCPUs
- An external virtual switch that can provide access to the internet directly or through a proxy. If internet access is through a proxy or firewall, ensure [these URLs](#resource-bridge-networking-requirements) are allow-listed.

### Resource bridge networking requirements

[!INCLUDE [network-requirement-principles](../includes/network-requirement-principles.md)]

The following firewall URL exceptions are needed for the Azure Arc resource bridge VM:

[!INCLUDE [network-requirements](../resource-bridge/includes/network-requirements.md)]

In addition, VMware VSphere requires the following exception:

| **Service** | **Port** | **URL** | **Direction** | **Notes**|
| --- | --- | --- | --- | --- |
| vCenter Server | 443 | URL of the vCenter server  | Appliance VM IP and control plane endpoint need outbound connection. | Used to by the vCenter server to communicate with the Appliance VM and the control plane.|

For a complete list of network requirements for Azure Arc features and Azure Arc-enabled services, see [Azure Arc network requirements (Consolidated)](../network-requirements-consolidated.md).

## Azure role/permission requirements

The minimum Azure roles required for operations related to Arc-enabled VMware vSphere are as follows:

| **Operation** | **Minimum role required** | **Scope** |
| --- | --- | --- |
| Onboarding your vCenter Server to Arc | Azure Arc VMware Private Clouds Onboarding | On the subscription or resource group into which you want to onboard |
| Administering Arc-enabled VMware vSphere | Azure Arc VMware Administrator | On the subscription or resource group where vCenter server resource is created |
| VM Provisioning | Azure Arc VMware Private Cloud User | On the subscription or resource group that contains the resource pool/cluster/host, datastore and virtual network resources, or on the resources themselves |
| VM Provisioning | Azure Arc VMware VM Contributor | On the subscription or resource group where you want to provision VMs |
| VM Operations | Azure Arc VMware VM Contributor | On the subscription or resource group that contains the VM, or on the VM itself |

Any roles with higher permissions on the same scope, such as Owner or Contributor, will also allow you to perform the operations listed above.

## Guest management (Arc agent) requirements

With Arc-enabled VMware vSphere, you can install the Arc connected machine agent on your VMs at scale and use Azure management services on the VMs. There are additional requirements for this capability.

To enable guest management (install the Arc connected machine agent), ensure the following:

- VM is powered on.
- VM has VMware tools installed and running.
- Resource bridge has access to the host on which the VM is running.
- VM is running a [supported operating system](#supported-operating-systems).
- VM has internet connectivity directly or through proxy. If the connection is through a proxy, ensure [these URLs](#networking-requirements) are allow-listed.

Additionally, be sure that the requirements below are met in order to enable guest management.

### Supported operating systems

Make sure you're using a version of the Windows or Linux [operating systems that are officially supported for the Azure Connected Machine agent](../servers/prerequisites.md#supported-operating-systems). Only x86-64 (64-bit) architectures are supported. x86 (32-bit) and ARM-based architectures, including x86-64 emulation on arm64, aren't supported operating environments.

### Software requirements

Windows operating systems:

- NET Framework 4.6 or later is required. [Download the .NET Framework](/dotnet/framework/install/guide-for-developers).
- Windows PowerShell 5.1 is required. [Download Windows Management Framework 5.1.](https://www.microsoft.com/download/details.aspx?id=54616).

Linux operating systems:

- systemd
- wget (to download the installation script)

### Networking requirements

The following firewall URL exceptions are needed for the Azure Arc agents:

| **URL** | **Description** |
| --- | --- |
| `aka.ms` | Used to resolve the download script during installation |
| `packages.microsoft.com` | Used to download the Linux installation package |
| `download.microsoft.com` | Used to download the Windows installation package |
| `login.windows.net` | Microsoft Entra ID |
| `login.microsoftonline.com` | Microsoft Entra ID |
| `pas.windows.net` | Microsoft Entra ID |
| `management.azure.com` | Azure Resource Manager - to create or delete the Arc server resource |
| `*.his.arc.azure.com` | Metadata and hybrid identity services |
| `*.guestconfiguration.azure.com` | Extension management and guest configuration services |
| `guestnotificationservice.azure.com`, `*.guestnotificationservice.azure.com` | Notification service for extension and connectivity scenarios |
| `azgn*.servicebus.windows.net` | Notification service for extension and connectivity scenarios |
| `*.servicebus.windows.net` | For Windows Admin Center and SSH scenarios |
| `*.blob.core.windows.net` | Download source for Azure Arc-enabled servers extensions |
| `dc.services.visualstudio.com` | Agent telemetry |

## Next steps

- [Connect VMware vCenter to Azure Arc using the helper script](quick-start-connect-vcenter-to-arc-using-script.md)
