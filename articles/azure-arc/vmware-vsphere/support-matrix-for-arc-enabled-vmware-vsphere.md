---
title: Support matrix for Arc enabled VMware vSphere
description: In this article, you'll learn about the support matrix for Arc enabled VMware vSphere including vCenter Server versions supported, network requirements etc.
ms.topic: reference 
ms.custom: references_regions
ms.date: 09/21/2022

# Customer intent: As a VI admin, I want to understand the support matrix for Arc enabled VMware vSphere.
---

# Support matrix for Arc enabled VMware vSphere

This article summarizes prerequisites and support requirements for using the [Arc enabled VMware vSphere](overview.md) to manage your VMware vSphere VMs through Azure Arc.

To use Arc enabled VMware vSphere, you must deploy an Azure Arc resource bridge in your VMware vSphere environment. The resource bridge provides an ongoing connection between your VMware vCenter Server and Azure. Once you've connected you VMware vCenter Server to Azure, components on the resource bridge discover your vCenter inventory. You can enable them in Azure and start performing virtual hardware and guest OS operations on them using Azure Arc.


## VMware vSphere Requirements

### vCenter Server

- vCenter Server version 6.7 or 7.

- A virtual network that can provide internet access, directly or through a proxy. It must also be possible for VMs on this network to communicate with the vCenter server on TCP port (usually 443).

- At least one free IP address on the above network that isn't in the DHCP range. At least three free IP addresses if there's no DHCP server on the network.

- A resource pool or a cluster with a minimum capacity of 16 GB of RAM and four vCPUs.

- A datastore with a minimum of 100 GB of free disk space available through the resource pool or cluster.

### vSphere account

You need a vSphere account that can:
- Read all inventory. 
- Deploy and update VMs to all the resource pools (or clusters), networks, and VM templates that you want to use with Azure Arc.

This account is used for the ongoing operation of Azure Arc-enabled VMware vSphere (preview) and the deployment of the Azure Arc resource bridge (preview) VM.

### Resource bridge resource requirements 

- Resource Bridge IP needs internet access. If you are using Static IP, then Start Range IP and End Range IP need internet access. If you are using DHCP, then it is the IP assigned to Azure Arc Resource Bridge (Appliance VM IP).

- Control Plane IP needs internet access.

- If you are using DHCP, the IP assigned to Azure Arc Resource Bridge must be reserved. 

- The Host (vCenter server in this case, I think) must be able to reach the Control Plane IP and Azure Arc Resource Bridge VM (Appliance VM IP, Start Range IP, End Range IP).

- Azure Arc Resource Bridge VM requires DNS resolution when configuring with Static IP. The IP Address(es) of the DNS servers are needed in the DNS Server input of the deployment script.

- Ensure that your user account has all of these [privileges](../resource-bridge/troubleshoot-resource-bridge.md#insufficient-permissions) in VMware vCenter.

### Resource bridge networking requirements

The following firewall URL exceptions are needed for the appliance VM in the Azure Arc Resource Bridge:

| **Service** | **Port** | **URL** | **Direction** | **Notes**|
| --- | --- | --- | --- | --- |
| Microsoft container registry | 443 | https://mcr.microsoft.com | Appliance VM IP and control plane endpoint need outbound connection. | Required to pull container images for installation. |
| Azure Arc Identity service | 443 | https://*.his.arc.azure.com | Appliance VM IP and control plane endpoint need outbound connection. | Manages identity and access control for Azure resources |
| Azure Arc configuration service | 443	| https://*.dp.kubernetesconfiguration.azure.com | Appliance VM IP and control plane endpoint need outbound connection. | Used for Kubernetes cluster configuration. |
| Cluster connect service | 443	| https://*.servicebus.windows.net | Appliance VM IP and control plane endpoint need outbound connection. | Provides cloud-enabled communication to connect on-premise resources with the cloud. |
| Guest Notification service | 443 | https://guestnotificationservice.azure.com	| Appliance VM IP and control plane endpoint need outbound connection. | Used to connect on-prem resources to Azure. |
| SFS API endpoint | 443 | msk8s.api.cdp.microsoft.com | Host machine, Appliance VM IP and control plane endpoint need outbound connection. | Used when downloading product catalog, product bits, and OS images from SFS. |
| Resource bridge (appliance) Dataplane service | 443 | https://*.dp.prod.appliances.azure.com | Appliance VM IP and control plane endpoint need outbound connection. | Communicate with resource provider in Azure. |
| Resource bridge (appliance) container image download | 443 | *.blob.core.windows.net, https://ecpacr.azurecr.io | Appliance VM IP and control plane endpoint need outbound connection. | Required to pull container images. |
| Resource bridge (appliance) image download | 80 | *.dl.delivery.mp.microsoft.com | Host machine, Appliance VM IP and control plane endpoint need outbound connection. | Download the Arc Resource Bridge OS images. |
| Azure Arc for K8s container image download | 443 | https://azurearcfork8sdev.azurecr.io | Appliance VM IP and control plane endpoint need outbound connection. | Required to pull container images. |
| ADHS telemetry service | 443 | adhs.events.data.microsoft.com  | Appliance VM IP and control plane endpoint need outbound connection.	Runs inside the appliance/mariner OS. | Used periodically to send Microsoft required diagnostic data from control plane nodes. Used when telemetry is coming off Mariner, which would mean any K8s control plane. |
| Microsoft events data service | 443 | v20.events.data.microsoft.com  | Appliance VM IP and control plane endpoint need outbound connection. | Used periodically to send Microsoft required diagnostic data from the Azure Stack HCI or Windows Server host. Used when telemetry is coming off Windows like Windows Server or HCI. |

## Azure permissions required

A resource group in an Azure subscription where you are:

- A member of the *Azure Arc VMware Private Clouds Onboarding* role for onboarding.

- A member of the *Azure Arc VMware Administrator role* role for administering.


## Guest management (Arc agent) requirements

The VMware VM should have guest management enabled and the target machine is powered on with VMware tools installed and running and the resource bridge has network connectivity to the host running the VM.  

### Supported operating systems

The following versions of the Windows and Linux operating system are officially supported for the Azure Connected Machine agent. Only x86-64 (64-bit) architectures are supported. x86 (32-bit) and ARM-based architectures, including x86-64 emulation on arm64, are not supported operating environments.

* Windows Server 2008 R2 SP1, 2012 R2, 2016, 2019, and 2022
  * Both Desktop and Server Core experiences are supported
  * Azure Editions are supported when running as a virtual machine on Azure Stack HCI
* Windows IoT Enterprise
* Azure Stack HCI
* Ubuntu 16.04, 18.04, and 20.04 LTS
* Debian 10
* CentOS Linux 7 and 8
* SUSE Linux Enterprise Server (SLES) 12 and 15
* Red Hat Enterprise Linux (RHEL) 7 and 8
* Amazon Linux 2
* Oracle Linux 7 and 8

> [!NOTE] 
> On Linux, Azure Arc-enabled servers install several daemon processes. We only support using systemd to manage these processes. In some environments, systemd may not be installed or available, in which case Arc-enabled servers are not supported, even if the distribution is otherwise supported. These environments include **Windows Subsystem for Linux** (WSL) and most container-based systems, such as Kubernetes or Docker. The Azure Connected Machine agent can be installed on the node that runs the containers but not inside the containers themselves.

## Software requirements

Windows operating systems:

* NET Framework 4.6 or later is required. [Download the .NET Framework](/dotnet/framework/install/guide-for-developers).
* Windows PowerShell 5.1 is required. [Download Windows Management Framework 5.1.](https://www.microsoft.com/download/details.aspx?id=54616).

Linux operating systems:

* systemd
* wget (to download the installation script)

## Required permissions

The following Azure built-in roles are required for different aspects of managing connected machines:

* To onboard machines, you must have the [Azure Connected Machine Onboarding](../../role-based-access-control/built-in-roles.md#azure-connected-machine-onboarding) or [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role for the resource group in which the machines will be managed.
* To read, modify, and delete a machine, you must have the [Azure Connected Machine Resource Administrator](../../role-based-access-control/built-in-roles.md#azure-connected-machine-resource-administrator) role for the resource group.
* To select a resource group from the drop-down list when using the **Generate script** method, you must have the [Reader](../../role-based-access-control/built-in-roles.md#reader) role for that resource group (or another role which includes **Reader** access).

### Networking requirements

The following firewall URL exceptions are needed for the Azure Arc agents:

| **URL** | **Description** |
| --- | --- |
| aka.ms | Used to resolve the download script during installation |
| download.microsoft.com | Used to download the Windows installation package |
| packages.microsoft.com | Used to download the Linux installation package |
| login.windows.net | Azure Active Directory |
| login.microsoftonline.com | Azure Active Directory |
| pas.windows.net | Azure Active Directory |
| management.azure.com | Azure Resource Manager - to create or delete the Arc server resource |
| *.his.arc.azure.com | Metadata and hybrid identity services |
| *.guestconfiguration.azure.com | Extension management and guest configuration services |
| guestnotificationservice.azure.com, *.guestnotificationservice.azure.com | Notification service for extension and connectivity scenarios |
| azgn*.servicebus.windows.net | Notification service for extension and connectivity scenarios |
| *.servicebus.windows.net | For Windows Admin Center and SSH scenarios |
| *.blob.core.windows.net | Download source for Azure Arc-enabled servers extensions |
| dc.services.visualstudio.com | Agent telemetry |


## Next steps

- [Connect VMware vCenter to Azure Arc using the helper script](quick-start-connect-vcenter-to-arc-using-script.md)
