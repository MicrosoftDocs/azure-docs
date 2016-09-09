<properties
	pageTitle="Install Symantec Endpoint Protection on a VM | Microsoft Azure"
	description="Learn how to install and configure the Symantec Endpoint Protection security extension on a new or existing Azure VM created with the classic deployment model."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="iainfoulds"
	manager="timlt"
	editor=""
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-multiple"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/07/2016"
	ms.author="iainfou"/>

# How to install and configure Symantec Endpoint Protection on a Windows VM

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)]

This article shows you how to install and configure the Symantec Endpoint Protection client on a new or existing virtual machine (VM) running Windows Server. This is the full client, which includes services such as virus and spyware protection, firewall, and intrusion prevention.

The client is installed as a security extension by using the VM Agent. On a new virtual machine, you'll install the agent along with the endpoint client. On an existing virtual machine without the agent, you'll need to download and install the agent first. This article covers both situations.

If you have an existing subscription from Symantec for an on-premises solution, you can use it to protect your Azure virtual machines. If you're not a customer yet, you can sign up for a trial subscription. For more information about this solution, see [Symantec Endpoint Protection on Microsoft's Azure platform][Symantec]. This page also has links to licensing information and  instructions for installing the client if you're already a Symantec customer.

## Install Symantec Endpoint Protection on a new virtual machine

The [Azure classic portal][Portal] lets you install the VM Agent and the Symantec security extension when you use the **From Gallery** option to create the virtual machine. Using this approach is an easy way to add protection from Symantec if you're creating a single virtual machine.

This **From Gallery** option opens a wizard that helps you set up the virtual machine. You use the last page of the wizard to install the VM Agent and Symantec security extension.

For general instructions, see [Create a Virtual Machine Running Windows Server][Create]. When you get to the last page of the wizard:

1.	Under VM Agent, **Install VM Agent** should already be checked.

2.	Under Security Extensions, check **Symantec Endpoint Protection**.


	![Install the VM Agent and the Endpoint Protection Client](./media/virtual-machines-windows-classic-install-symantec/InstallVMAgentandSymantec.png)

3.	Click the check mark at the bottom of the page to create the virtual machine.

## Install Symantec Endpoint Protection on an existing virtual machine

Before you begin, you'll need the following:

- The Azure PowerShell module, version 0.8.2 or later, on your work computer. You can check the version of Azure PowerShell that you have installed with the **Get-Module azure | format-table version** command. For instructions and a link to the latest version, see [How to Install and Configure Azure PowerShell][PS]. Make sure to login to your Azure subscription.

- The VM Agent running on the Azure Virtual Machine.

First, verify that the VM Agent is already installed on the virtual machine. Fill in the cloud service name and virtual machine name, and then run the following commands at an administrator-level Azure PowerShell command prompt. Replace everything within the quotes, including the < and > characters.

> [AZURE.TIP] If you don't know the cloud service and virtual machine names, run **Get-AzureVM** to list the names for all virtual machines in your current subscription.

	$CSName = "<cloud service name>"
	$VMName = "<virtual machine name>"
	$vm = Get-AzureVM -ServiceName $CSName -Name $VMName
	write-host $vm.VM.ProvisionGuestAgent

If the **write-host** command displays **True**, the VM Agent is installed. If it displays **False**, see the instructions and a link to the download in the Azure blog post [VM Agent and Extensions - Part 2][Agent].

If the VM Agent is installed, run these commands to install the Symantec Endpoint Protection agent.

	$Agent = Get-AzureVMAvailableExtension -Publisher Symantec -ExtensionName SymantecEndpointProtection

	Set-AzureVMExtension -Publisher Symantec –Version $Agent.Version -ExtensionName SymantecEndpointProtection -VM $vm | Update-AzureVM

To verify that the Symantec security extension has been installed and is up-to-date:

1.	Log on to the virtual machine. For instructions, see [How to Log on to a Virtual Machine Running Windows Server][Logon].
2.	For Windows Server 2008 R2, click **Start > Symantec Endpoint Protection**. For Windows Server 2012 or Windows Server 2012 R2, from the start screen, type **Symantec**, and then click **Symantec Endpoint Protection**.
3.	From the **Status** tab of the **Status-Symantec Endpoint Protection** window, apply updates or restart if needed.

## Additional resources

[How to Log on to a Virtual Machine Running Windows Server][Logon]

[Azure VM Extensions and Features][Ext]


<!--Link references-->
[Symantec]: http://www.symantec.com/connect/blogs/symantec-endpoint-protection-now-microsoft-azure

[Portal]: http://manage.windowsazure.com

[Create]: virtual-machines-windows-classic-tutorial.md

[PS]: ../powershell-install-configure.md

[Agent]: http://go.microsoft.com/fwlink/p/?LinkId=403947

[Logon]: virtual-machines-windows-classic-connect-logon.md

[Ext]: http://go.microsoft.com/fwlink/p/?linkid=390493