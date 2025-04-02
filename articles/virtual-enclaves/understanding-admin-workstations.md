---
title: Understanding Admin Workstations in Azure Virtual Enclaves
description: Understanding Admin Workstations in Azure Virtual Enclaves
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Understanding Admin Workstations in Azure Virtual Enclaves (AVE)

By default, all [enclaves](./what-is-an-enclave.md) deployed by Azure Virtual Enclaves are created with two Admin Workstation Virtual Machines (VMs) that can be remotely accessed through [Azure Bastion](https://aka.ms/bastion). These VMs are meant to be temporarily lived resources for break-glass system administration of an enclave.

## Access
By default, AVE creates an Azure Bastion instance for Community or Enclave Owners to access their enclaves.

### Enable Enclave access to the Azure Portal
Azure Portal access is restricted by default for enclaves. This means that to administratively access your Azure Virtual Enclave managed resources and workloads within the enclave network, you will need to create endpoint rules and connections to access the Azure Portal from within the Admin Workstation or enclave.

1. [Create Enclave endpoint](./create-a-enclave-endpoint-in-the-azure-portal.md)
2. [Create Community Endpoint for Azure Portal access](./create-a-community-endpoint-in-the-azure-portal.md)
3. [Create Enclave Connection to Community endpoint for Azure Portal](./create-an-enclave-connection-from-the-azure-portal.md)

### Signing in to Admin Workstation
#### Reset password
If this is the first time using the Admin Workstation, reset the password with the instructions below. Otherwise continue to sign in to the Admin Workstation.
1. From the portal, navigate to the enclave resource and select the "Admin Workstation" blade
2. Select any VM name to open that VM resource
3. Scroll to the bottom of the blades and select "Reset Password"
4. Enter the new password twice and select "Update"

### Accessing enclaves through Azure Bastion
AVE natively uses existing Azure user interface controls to allow for access into Admin Workstations. [Learn more on how to Connect to a Windows VM using RDP - Azure Bastion](../bastion/bastion-connect-vm-rdp-windows.md).

![image1.png](./media/image-a3fd8d57-aef1-4a03-a0ad-88ab0f010956.png)

![image2.png](./media/image-d1f48850-363b-45f8-9eb6-4df428d52b38.png)

For certain Community and Enclave Owners, this default access model may not be granular enough. For example, some Enclave Owners may have regulatory requirements for their workloads that does not authorize Azure Bastion. 

If the default behavior of Admin Workstations or the configurations that AVE allows to be changed are insufficient for customer use-cases, AVE recommends [creating a Workload, Virtual Machine(s) in the Workload, an Endpoint, and Connection(s) that function similarly to how Admin Workstations function](./create-avd-workloads.md).

## Size
The default VM SKU size for AVE Admin Workstations is Standard_D4s_v3. Community and Enclave Owners are allowed to resize the VM SKU size of these Admin Workstations after an Enclave is created. Furthermore, Community Owners will be allowed to choose what VM SKU size the Admin Workstations are deployed when creating an Enclave.

## Patching
It is the Community or Enclave Owner's (i.e. customer's) responsibility to [maintain and patch](https://learn.microsoft.com/azure/virtual-machines/updates-maintenance-overview) the Admin Workstations deployed in their Enclaves. Currently, AVE will not perform any patching on Admin Workstations after they are deployed in an Enclave.

Admin Workstations are intended only for bootstrapping Enclaves and to provide initial entry for Enclave setup. Enclave Owners and system administrators should either delete them after set-up, or continuously monitor, patch, and manage them just like any of their other enclave workloads or Azure resources. These Virtual Machines are deployed using known good images through Azure Marketplace but are not monitored or patched by AVE thereafter.



## Image
Community and Enclave Owners may also have concerns regarding the default VM image used for these VMs. Currently, AVE uses the Azure Marketplace's Windows Server 2019 Datacenter image for Admin Workstations. AVE does not currently support custom images for our Admin Workstations.

## Monitoring
By default, Admin Workstations are configured with [Data collection rules](https://learn.microsoft.com/azure/azure-monitor/essentials/data-collection-rule-overview) to log certain resource and operating system logging.

Should further troubleshooting be required to investigate Azure Virtual Machines, please contact [Azure Support](https://azure.microsoft.com/support/).

## References
- [What is Azure Virtual Enclaves?](./what-is-azure-virtual-enclaves.md)
- [Best ractices](./best-practices.md)
- [What is an Enclave?](./what-is-an-enclave.md)
- [What is a Workload?](./what-is-a-workload.md)
- [Azure Bastion](https://aka.ms/bastion)
- [Connect to a Windows VM using RDP - Azure Bastion](../bastion/bastion-connect-vm-rdp-windows.md)
- [Azure Support](https://azure.microsoft.com/support/)
