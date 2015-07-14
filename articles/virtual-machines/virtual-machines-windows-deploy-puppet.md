<properties
	pageTitle="About Puppet and Azure virtual machines"
	description="Describes installing and configuring Puppet on a virtual machine in Azure"
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
	ms.date="05/20/2015"
	ms.author="kathydav"/>

#About Puppet and Azure virtual machines


<p>Puppet Enterprise is automation software for building, deploying, and managing your infrastructure. You can use it to manage your IT infrastructure life-cycle, including discovery, provisioning, operating system and application configuration management, orchestration, and reporting.

Puppet is a client-server system. Puppet Master and the Puppet Enterprise Agent are both available for installation through Microsoft Azure:

- Puppet Master is available as a preconfigured image, installed on an Ubuntu server. You also can install Puppet Enterprise on an existing server, but using the image is the simplest way to get started. You'll need information about the server to set up the agent.

- Puppet Enterprise Agent is available as a virtual machine extension that you can install when you create a virtual machine, or install on an existing virtual machine.

For instructions, download the "Getting Started Guide" from the [Microsoft Windows and Azure](http://puppetlabs.com/solutions/microsoft) page.  


##Additional resources
[New integrations with Microsoft Azure and Visual Studio]

[How to log on to a virtual machine running Windows Server]

[How to log on to a virtual machine running Linux]

[Manage extensions]

<!--Link references-->
[New integrations with Microsoft Azure and Visual Studio]: http://puppetlabs.com/blog/new-integrations-windows-azure-and-visual-studio
[How to Log on to a virtual machine running Windows Server]: virtual-machines-log-on-windows-server.md
[How to Log on to a virtual machine running Linux]: virtual-machines-linux-how-to-log-on.md
[Azure VM extensions and features]: http://go.microsoft.com/fwlink/p/?linkid=390493&clcid=0x409
