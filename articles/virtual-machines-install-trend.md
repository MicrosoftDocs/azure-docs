<properties title="How to install and configure Trend on an Azure VM" pageTitle="How to install and configure Trend on an Azure VM" description="Describes installing and configuring Trend on a VM in Azure" metaKeywords="" services="virtual machines" solutions="" documentationCenter="" authors="kathydav" videoId="" scriptId="" />

#How to install and configure Trend Deep Security As a Service on an Azure VM

<p> This article shows you how to install and configure Trend Micro Deep Security as a Service on a new or existing virtual machine (VM) running Windows Server. The protection that Deep Security as a Service provides includes anti-malware protection, firewall, intrusion prevention system, and integrity monitoring. 

<p>The client is installed as a security extension by using the VM Agent. On a new virtual machine, you'll install the VM Agent along with the Deep Security Agent. On an existing virtual machine that doesn't have the VM Agent, you'll need to download and install it first. This article covers both situations.

<p> If you have existing subscription from Trend for an on-premises solution, you can use it to protect your Azure virtual machines. If you're not a customer yet, you can sign up for a trial subscription. For more information about this solution, see the blog post [Microsoft Azure VM Agent Extension For Deep Security](http://go.microsoft.com/fwlink/p/?LinkId=403945).

##Install the Deep Security Agent on a new virtual machine

The [Azure Management Portal](http://manage.windowsazure.com) lets you install the VM Agent and the Trend security extension when you use the **From Gallery** option to create the virtual machine. Using this approach is an easy way to add protection from Trend if you're creating a single virtual machine.

This **From Gallery** option opens a wizard that helps you set up the virtual machine. You use the last page of the wizard to install the VM Agent and Trend security extension. For general instructions, see [Create a Virtual Machine Running Windows Server](http://go.microsoft.com/fwlink/p/?LinkId=403943). When you get to the last page of the wizard, do the following:

1.	Under VM Agent, select **Install VM Agent**.

2.	Under Security Extensions, select **Symantec Endpoint Protection**.

3.	Click the check mark to create the virtual machine.

	![Install the VM Agent and the Deep Security Agent](./media/virtual-machines-install-trend/InstallVMAgentandTrend.png)

##Install the Deep Security Agent on an existing virtual machine

To install the Deep Security Agent on an existing virtual machine, you'll need the following:

- The Azure PowerShell module, version 0.8.2 or newer. For instructions and a link to the latest version, see [How to Install and Configure Azure PowerShell](http://go.microsoft.com/fwlink/p/?LinkId=320552).  

- The VM Agent. For instructions and a link to the download, see the blog post [VM Agent and Extensions – Part 2](http://go.microsoft.com/fwlink/p/?LinkId=403947).

Open an Azure PowerShell session and run the following commands. Be sure to substitute your own values for the placeholders, such as MyServiceName.

1.	Get the cloud service name, virtual machine name, and VM and store each of those in variables so the next commands can use them:
	<p>$servicename = MyServiceName
	<p>$name = MyVmName
	<p>$vm = Get-AzureVM –ServiceName $servicename –Name $name

 > [WACOM.NOTE] If you don't know the cloud service and VM name, run Get-AzureVM to display that information for all VMs in the current subscription.

2.	Add the Deep Security Agent to the virtual machine:
<p> Set-AzureVMExtension -Publisher TrendMicro.DeepSecurity -ExtensionName TrendMicroDSA -Version 9.* -VM $vm.VM

3.	Update the VM, which installs the Deep Security Agent:
<p> Update-AzureVM -Name $servicename -ServiceName $name -VM $vm.VM

After the agent is installed, it takes a few minutes to start running. Once it's running, you can activate it.

##Activate Deep Security on the virtual machine

[Providing instructions on activating a single instance are more appropriate than an automated solution - please provide. ] 


##Additional Resources
[How to Log on to a Virtual Machine Running Windows Server]

[Manage Extensions]


<!--Link references-->
[How to Log on to a Virtual Machine Running Windows Server]: ../virtual-machines-log-on-windows-server/
[Manage Extensions]: http://go.microsoft.com/fwlink/p/?linkid=390493&clcid=0x409


