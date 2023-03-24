---
title: Viewing and Modifying Hostnames
description: How to view and change hostnames for Azure virtual machines, web and worker roles for name resolution
services: virtual-network
author: asudbring
manager: dcscontentpm
ms.assetid: c668cd8e-4e43-4d05-acc3-db64fa78d828
ms.service: virtual-network
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 05/14/2021
ms.author: allensu
---

# Viewing and modifying hostnames
To allow the host name to reference your role, you must set the value for the host name in the service configuration file for each role. You do that by adding the desired host name to the **vmName** attribute of the **Role** element. The value of the **vmName** attribute is used as a base for the host name of each role instance. For example, if **vmName** is *webrole* and there are three instances of that role, the host names of the instances are *webrole0*, *webrole1*, and *webrole2*. You don't need to specify a host name for virtual machines in the configuration file, because the host name for a virtual machine is populated based on the virtual machine name. For more information about configuring a Microsoft Azure service, see [Azure Service Configuration Schema (.cscfg File)](/previous-versions/azure/reference/ee758710(v=azure.100)).

## Viewing hostnames
You can view the host names of virtual machines and role instances in a cloud service by using any of the following tools.

### Virtual machine properties
In the Azure portal, the **Properties** page of your virtual machine shows you the host name under **Computer name**.

### Remote Desktop
When you connect to your virtual machine through a remote connection, you can view the host name in a few ways:

* Type hostname at the command prompt or SSH terminal.
* Type ipconfig /all at the command prompt (Windows only).
* View the computer name in the system settings (Windows only).

> [!WARNING]
> You can also view the internal domain suffix for your cloud service by running ipconfig /all from a command prompt in a Remote Desktop session (Windows), or by running cat /etc/resolv.conf from an SSH terminal (Linux).
> 
> 

### Azure classic deployment model
From a REST client, follow these instructions:

1. Ensure that you have a client certificate to connect to the Azure portal. For more information on how to obtain a client certificate, see [Create an Azure Active Directory application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal). 
2. Send a request in the following format: `GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}?api-version=2022-11-01`. For more information, see [](/rest/api/compute/virtual-machines/get?tabs=HTTP)
3. Look for the **Computername** element under **osProfile**.

## Modifying a hostname
You can modify the host name for any virtual machine or role instance by uploading a modified service configuration file or by renaming the computer from a remote desktop session.

## Next steps
[Name resolution for resources in Azure virtual networks](virtual-networks-name-resolution-for-vms-and-role-instances.md)

[Azure Service Configuration Schema (.cscfg File)](/previous-versions/azure/reference/ee758710(v=azure.100))

[Azure Virtual Network Configuration Schema](/previous-versions/azure/reference/jj157100(v=azure.100))

[Specifying DNS settings in a virtual network configuration file](/previous-versions/azure/virtual-network/virtual-networks-specifying-a-dns-settings-in-a-virtual-network-configuration-file)
