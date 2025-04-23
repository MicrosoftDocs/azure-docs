---
title: Understanding Admin VMs in Azure Virtual Enclaves
description: Understanding Admin VMs in Azure Virtual Enclaves.
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# Understanding Admin VMs in Azure Virtual Enclaves (AVE)

A Virtual Machine (VM) created to securely access enclave resources for administrative purposes. Admin Workstation Virtual Machines (VMs) that can be remotely accessed through [Azure Bastion](https://aka.ms/bastion). These VMs are meant to be temporarily lived resources for break-glass system administration of an enclave.

## Access
By default, AVE creates an Azure Bastion instance for Community or Enclave Owners to access their enclaves.

### Enable Enclave access to the Azure portal
Azure portal access is restricted by default for enclaves. This means you need to create endpoint rules and connections to access the Azure portal from within the Admin Workstation or enclave.

1. [Create Enclave endpoint in the Azure portal](./create-enclave-endpoint-portal.md)
2. [Create Community Endpoint in the Azure portal](./create-community-endpoint-portal.md)
3. [Create Enclave Connection in the Azure portal](./create-enclave-connection-portal.md)

### Signing in to Admin Workstation
#### Reset password
If this is the first time using the Admin Workstation, reset the password with the instructions below. Otherwise continue to sign in to the Admin Workstation. Starting from the portal:
1. Select the VM name to open that VM resource
3. Scroll to the bottom of the blades and select "Reset Password"
4. Enter the new password twice and select "Update"

### Accessing enclaves through Azure Bastion
AVE natively uses existing Azure user interface controls to allow for access into Admin VMs. [Learn more on how to Connect to a Windows VM using RDP - Azure Bastion](../bastion/bastion-connect-vm-rdp-windows.md).

For certain Community and Enclave Owners, this default access model might not be granular enough. For example, some Enclave Owners might have regulatory requirements for their workloads that do not authorize Azure Bastion. 

If the default behavior of Admin VMs or the configurations that AVE allows to be changed are insufficient for customer use-cases, AVE recommends [creating a Workload, Virtual Machines in the Workload, an Endpoint, and Connections that function similarly to how Admin VMs function](./create-avd-workloads.md).

## Size
The default VM size for AVE Admin VMs is Standard_D4s_v3. Community and Enclave Owners are allowed to resize the VM size of these Admin VMs after an Enclave is created. Furthermore, Community Owners will be allowed to choose what VM size the Admin VMs are deployed when creating an Enclave.

## Patching
It is the Community or Enclave Owner's (and therefore customer's) responsibility to [maintain and patch](https://learn.microsoft.com/azure/virtual-machines/updates-maintenance-overview) the Admin VMs deployed in their Enclaves. Currently, AVE will not perform any patching on Admin VMs after they are deployed in an Enclave.

Admin VMs are intended only for bootstrapping Enclaves and to provide initial entry for Enclave setup. Enclave Owners and system administrators should either delete them after set-up, or continuously monitor, patch, and manage them just like any of their other enclave workloads or Azure resources. Admin VMs are deployed using known good images through Azure Marketplace but are not monitored or patched by AVE thereafter.

## Image
Community and Enclave Owners might also have concerns regarding the default VM image used for these VMs. Currently, AVE uses Azure Marketplace's Windows Server 2019 Datacenter image for Admin VMs. AVE does not currently support custom images for our Admin VMs.

## Monitoring
By default, Admin VMs are configured with [Data collection rules](https://learn.microsoft.com/azure/azure-monitor/essentials/data-collection-rule-overview) to log certain resource and operating system logging.

Should further troubleshooting be required to investigate Azure Virtual Machines, contact [Azure Support](https://azure.microsoft.com/support/).

## References
- [What is Azure Virtual Enclaves?](./what-azure-virtual-enclaves.md)
- [Best Practices](./best-practices.md)
- [What is an Enclave?](./what-enclave.md)
- [What is a Workload?](./what-workload.md)
- [Azure Bastion](https://aka.ms/bastion)
- [Connect to a Windows VM using RDP - Azure Bastion](../bastion/bastion-connect-vm-rdp-windows.md)
- [Azure Support](https://azure.microsoft.com/support/)
