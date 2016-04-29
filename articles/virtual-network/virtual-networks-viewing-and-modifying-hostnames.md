<properties 
   pageTitle="Viewing and Modifying Hostnames | Microsoft Azure"
   description="How to view and change hostnames for Azure virtual machines, web and worker roles for name resolution"
   services="virtual-network"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor="tysonn" />
<tags 
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="04/27/2016"
   ms.author="joaoma" />

# Viewing and modifying hostnames

To allow your role instances to be referenced by host name, you must set the value for the host name in the service configuration file for each role. You do that by adding the desired host name to the **vmName** attribute of the **Role** element. The value of the **vmName** attribute is used as a base for the host name of each role instance. For example, if **vmName** is *webrole* and there are three instances of that role, the host names of the instances will be *webrole0*, *webrole1*, and *webrole2*. You do not need to specify a host name for virtual machines in the configuration file, because the host name for a virtual machine is populated based on the virtual machine name. For more information about configuring a Microsoft Azure service, see [Azure Service Configuration Schema (.cscfg File)](https://msdn.microsoft.com/library/azure/ee758710.aspx)

## Viewing hostnames

You can view the host names of virtual machines and role instances in a cloud service by using any of the tools below.

### Azure Portal

You can use the [Azure portal](http://portal.azure.com) to view the host names for virtual machines on the overview blade for a virtual machine. Keep in mind that the blade shows a value for **Name** and **Host Name**. Although they are initially the same, changing the host name will not change the name of the virtual machine or role instance.

Role instances can also be viewed in the Azure portal, but when you list the instances in a cloud service, the host name is not displayed. You will see a name for each instance, but that name does not represent the host name.

### Service configuration file

You can download the service configuration file for a deployed service from the **Configure** blade of the service in the Azure portal. You can then look for the **vmName** attribute for the **Role name** element to see the host name. Keep in mind that this host name is used as a base for the host name of each role instance. For example, if **vmName** is *webrole* and there are three instances of that role, the host names of the instances will be *webrole0*, *webrole1*, and *webrole2*.

### Remote Desktop

After you enable Remote Desktop (Windows), Windows PowerShell remoting (Windows), or SSH (Linux and Windows) connections to your virtual machines or role instances, you can view the host name from an active Remote Desktop connection in various ways:

- Type hostname at the command prompt or SSH terminal.

- Type ipconfig /all at the command prompt (Windows only).

- View the computer name in the system settings (Windows only).

### Azure Service Management REST API

From a REST client, follow these instructions:

1. Ensure that you have a client certificate to connect to the Azure portal. To obtain a client certificate, follow the steps presented in [How to: Download and Import Publish Settings and Subscription Information](https://msdn.microsoft.com/library/dn385850.aspx). 

1. Set a header entry named x-ms-version with a value of 2013-11-01.

1. Send a request in the following format: https://management.core.windows.net/\<subscrition-id\>/services/hostedservices/\<service-name\>?embed-detail=true

1. Look for the **HostName** element for each **RoleInstance** element.

>[AZURE.WARNING] You can also view the internal domain suffix for your cloud service from the REST call response by checking the **InternalDnsSuffix** element, or by running ipconfig /all from a command prompt in a Remote Desktop session (Windows), or by running cat /etc/resolv.conf from an SSH terminal (Linux).

## Modifying a hostname

You can modify the host name for any virtual machine or role instance by uploading a modified service configuration file, or by renaming the computer from a Remote Desktop session.

## Next steps

[Name Resolution (DNS)](virtual-networks-name-resolution-for-vms-and-role-instances.md)

[Azure Service Configuration Schema (.cscfg)](https://msdn.microsoft.com/library/windowsazure/ee758710.aspx)

[Azure Virtual Network Configuration Schema](http://go.microsoft.com/fwlink/?LinkId=248093)

[Specify DNS settings using network configuration files](virtual-networks-specifying-a-dns-settings-in-a-virtual-network-configuration-file.md)
