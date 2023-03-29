---
title: View and Modify Hostnames
description: Learn how to view and modify hostnames for your Azure virtual machines by using the Azure portal or a remote connection.
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

# View and modify the hostname

The hostname of a virtual machine is the **Virtual machine name** that you assign to your virtual machine during creation in the Azure portal. After you create a virtual machine, you can view and modify the hostname either through a remote connection or in the Azure portal.

## View hostnames
You can view the hostnames of virtual machines and role instances in a cloud service by using any of the following tools.

### Azure portal

You can view the hostname in the Azure portal on the **Properties** page listed under **Computer Name**.

### Remote Desktop
You can connect to your virtual machine using a remote desktop tool like Remote Desktop (Windows), Windows PowerShell remoting (Windows), SSH (Linux and Windows) or Bastion (Azure portal). You can then view the hostname in a few ways:

* Type *hostname* in PowerShell, the command prompt, or SSH terminal.
* Type *ipconfig /all* in the command prompt (Windows only).
* View the computer name in the system settings (Windows only).

### Azure API
From a REST client, follow these instructions:

1. Ensure that you have an authenticated connection to the Azure portal. Follow the steps presented in [Create an Azure Active Directory application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal). 
2. Send a request in the following format: `GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}?api-version=2022-11-01`. For more information on GET requests for virtual machines, see [Virtual Machines - Get](/rest/api/compute/virtual-machines/get).
3. Look for the **osProfile** and then the **computerName** element to find the host name.

> [!WARNING]
> You can also view the internal domain suffix for your cloud service by running ipconfig /all from a command prompt in a remote desktop session (Windows), or by running cat /etc/resolv.conf from an SSH terminal (Linux).
> 
> 

## Modify a hostname
You can modify the hostname for any virtual machine or role instance by renaming the computer from a remote desktop session or by using **Run command** in the Azure portal.

* In Windows, you can change the hostname from PowerShell by using [Rename-Computer](/powershell/module/microsoft.powershell.management/rename-computer).

* In Linux, you can change the hostname by using `hostnamectl`. 

## Azure classic deployment model

The Azure classic deployment model uses a configuration file that you can download and upload to change the host name. To allow your host name to reference your role instances, you must set the value for the host name in the service configuration file for each role. You do that by adding the desired host name to the **vmName** attribute of the **Role** element. The value of the **vmName** attribute is used as a base for the host name of each role instance. For example, if **vmName** is *webrole* and there are three instances of that role, the host names of the instances are *webrole0*, *webrole1*, and *webrole2*. You don't need to specify a host name for virtual machines in the configuration file, because the host name for a virtual machine is populated based on the virtual machine name. For more information about configuring a Microsoft Azure service, see [Azure Service Configuration Schema (.cscfg File)](/previous-versions/azure/reference/ee758710(v=azure.100))

### Service configuration file
You can download the service configuration file for a deployed service from the **Configure** pane of the service in the Azure portal. You can then look for the **vmName** attribute for the **Role name** element to see the host name. Keep in mind that this host name is used as a base for the host name of each role instance. For example, if **vmName** is *webrole* and there are three instances of that role, the host names of the instances are *webrole0*, *webrole1*, and *webrole2*. For more information, see [Azure Virtual Network Configuration Schema](/previous-versions/azure/reference/jj157100(v=azure.100))


## Next steps
[Name Resolution (DNS)](virtual-networks-name-resolution-for-vms-and-role-instances.md)

[Specify DNS settings using network configuration files](/previous-versions/azure/virtual-network/virtual-networks-specifying-a-dns-settings-in-a-virtual-network-configuration-file)
