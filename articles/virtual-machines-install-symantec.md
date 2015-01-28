<properties pageTitle="How to install and configure Symantec Endpoint Protection on an Azure VM" description="Describes installing and configuring Symantec Endpoint Protection on a VM in Azure" services="virtual-machines" documentationCenter="" authors="KBDAzure" manager="timlt" editor=""/>

<tags ms.service="virtual-machines" ms.workload="infrastructure-services" ms.tgt_pltfrm="vm-multiple" ms.devlang="na" ms.topic="article" ms.date="1/26/2015" ms.author="kathydav"/>

#How to install and configure Symantec Endpoint Protection on an Azure VM

This article shows you how to install and configure the Symantec Endpoint Protection client on a new or existing virtual machine (VM) running Windows Server. This is the full client, which includes services such as virus and spyware protection, firewall, and intrusion prevention. 

The client is installed as a security extension by using the VM Agent. On a new virtual machine, you'll install the agent along with the endpoint client. On an existing virtual machine without the agent, you'll need to download and install the agent first. This article covers both situations.

If you have an existing subscription from Symantec for an on-premises solution, you can use it to protect your Azure virtual machines. If you're not a customer yet, you can sign up for a trial subscription. For more information about this solution, see [Symantec Endpoint Protection on Microsoft's Azure platform](http://go.microsoft.com/fwlink/p/?LinkId=403942). This page also provides links to licensing information and alternative instructions for installing the client if you're already a Symantec customer.

##Install Symantec Endpoint Protection on a new virtual machine

The [Azure Management Portal](http://manage.windowsazure.com) lets you install the VM Agent and the Symantec security extension when you use the **From Gallery** option to create the virtual machine. Using this approach is an easy way to add protection from Symantec if you're creating a single virtual machine. 

This **From Gallery** option opens a wizard that helps you set up the virtual machine. You use the last page of the wizard to install the VM Agent and Symantec security extension. 

For general instructions, see [Create a Virtual Machine Running Windows Server](http://go.microsoft.com/fwlink/p/?LinkId=403943). When you get to the last page of the wizard:

1.	Under VM Agent, **Install VM Agent** should already be checked.

2.	Under Security Extensions, check **Symantec Endpoint Protection**.


	![Install the VM Agent and the Endpoint Protection Client](./media/virtual-machines-install-symantec/InstallVMAgentandSymantec.png)

3.	Click the check mark at the bottom of the page to create the virtual machine.

## Install Symantec Endpoint Protection on an existing virtual machine

Before you begin, you'll need the following:

- The Azure PowerShell module, version 0.8.2 or newer. For instructions and a link to the latest version, see [How to Install and Configure Azure PowerShell](http://go.microsoft.com/fwlink/p/?LinkId=320552).  

- The VM Agent. For instructions and a link to the download, see the blog post [VM Agent and Extensions - Part 2](http://go.microsoft.com/fwlink/p/?LinkId=403947).

To install the Symantec security extension on an existing virtual machine:

1.	Get the cloud service name and virtual machine name. If you don't know them, use the **Get-AzureVM** command to display that information for all VMs in the current subscription. Then, replace everything inside the quotes, including the < and > characters, and run these commands:

	<p>`$servicename = "<YourServiceName>"`
<p>`$name = "<YourVmName>"`
<p>`$vm = Get-AzureVM -ServiceName $servicename -Name $name`
<p>`Get-AzureVMAvailableExtension -Publisher Symantec -ExtensionName SymantecEndpointProtection`

2.	From the display of the Get-AzureVMAvailableExtension command, note the version number for the Version property, and then run these commands:

	<p>`$ver=<version number from the Version property>`
<p>`Set-AzureVMExtension -Publisher Symantec -ExtensionName SymantecEndpointProtection -Version $ver -VM $vm.VM`
<p>`Update-AzureVM -ServiceName $servicename -Name $name -VM $vm.VM`

To verify that the Symantec security extension has been installed and is up-to-date:

1.	Log on to the virtual machine.
2.	For Windows Server 2008 R2, click **Start > All Programs > Symantec Endpoint Protection**. For Windows Server 2012, from the start screen, type **Symantec**, and then click **Symantec Endpoint Protection**.
3.	From the status window, apply updates if needed.

## Additional Resources
[How to Log on to a Virtual Machine Running Windows Server]

[Manage Extensions]

<!--Link references-->
[How to Log on to a Virtual Machine Running Windows Server]: ../virtual-machines-log-on-windows-server/

[Manage Extensions]: http://go.microsoft.com/fwlink/p/?linkid=390493&clcid=0x409

