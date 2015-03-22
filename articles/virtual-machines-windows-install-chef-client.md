<properties 
	pageTitle="About Chef and Azure Virtual Machines" 
	description="Describes installing and configuring Chef on a VM in Azure" 
	services="virtual-machines" 
	documentationCenter="" 
	authors="KBDAzure" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-windows" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="01/29/2015" 
	ms.author="kathydav"/>

#About Chef and Azure Virtual Machines

Chef provides an automation system for building, deploying, and managing your infrastructure. Resources are managed using recipes, which are reusable definitions that provide instructions for tasks such as configuring a web server.   

Chef is a client-server system. To find out your options for using a Chef server, see [Choose your installation](http://www.getchef.com/chef/choose-your-version/). You'll need information about the Chef server to set up the client. 

To install Chef client on an Azure virtual machine, you have these choices:

- Use the Azure Management Portal to install the Chef client when you create a virtual machine running Windows Server 2012 or Windows Server 2012 R2. For instructions, see [Microsoft Azure Portal](https://docs.chef.io/azure_portal.html).
- Use Azure PowerShell to install the Chef client on an existing virtual machine. A sample [script](https://gist.github.com/kaustubh-d/cea1aa75baebd3615609) is available on GitHub.
- Use a Chef plug-in, [knife-azure](http://docs.getchef.com/plugin_knife_azure.html), to create a virtual machine instance and install the Chef client.   


##Additional Resources
[Chef and Microsoft Azure]

[How to Log on to a Virtual Machine Running Windows Server]

[How to Log on to a Virtual Machine Running Linux]

[Manage Extensions]

<!--Link references-->
[Chef and Microsoft Azure]: http://www.getchef.com/solutions/azure/
[How to Log on to a Virtual Machine Running Windows Server]: virtual-machines-log-on-windows-server.md
[How to Log on to a Virtual Machine Running Linux]: virtual-machines-linux-how-to-log-on.md
[Manage Extensions]: http://go.microsoft.com/fwlink/p/?linkid=390493&clcid=0x409


