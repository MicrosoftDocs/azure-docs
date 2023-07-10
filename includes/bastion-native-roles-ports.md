---
author: cherylmc
ms.service: bastion
ms.topic: include
ms.date: 06/12/2023
ms.author: cherylmc
---
### Required roles

* Reader role on the virtual machine.
* Reader role on the NIC with private IP of the virtual machine.
* Reader role on the Azure Bastion resource.
* Virtual Machine Administrator Login or Virtual Machine User Login role, if you’re using the Azure AD sign-in method. You only need to do this if you're enabling Azure AD login using the processes outlined in one of these articles:

  * [Azure Windows VMs and Azure AD](../articles/active-directory/devices/howto-vm-sign-in-azure-ad-windows.md)
  * [Azure Linux VMs and Azure AD](../articles/active-directory/devices/howto-vm-sign-in-azure-ad-linux.md)

### Ports

To connect to a Linux VM using native client support, you must have the following ports open on your Linux VM:

* Inbound port: SSH (22) *or*
* Inbound port: Custom value (you’ll then need to specify this custom port when you connect to the VM via Azure Bastion)

To connect to a Windows VM using native client support, you must have the following ports open on your Windows VM:

* Inbound port: RDP (3389) *or*
* Inbound port: Custom value (you’ll then need to specify this custom port when you connect to the VM via Azure Bastion)

To learn about how to best configure NSGs with Azure Bastion, see [Working with NSG access and Azure Bastion](../articles/bastion/bastion-nsg.md).