<properties
	pageTitle="Install MySQL on a virtual machine running OpenSUSE Linux in Azure"
	description="Learn to install MySQL on a virtual machine in Azure."
	services="virtual-machines"
	documentationCenter=""
	authors="KBDAzure"
	manager="timlt"
	editor=""
	tags="mysql"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="12/12/2014"
	ms.author="kathydav"/>

# Install MySQL on a virtual machine running OpenSUSE Linux in Azure

[MySQL][MySQL] is a popular, open-source SQL database. This tutorial shows you:

- How to use the [Azure Management Portal][AzurePortal] to create an OpenSUSE Linux virtual machine from an image available through Azure.
- How to connect to the virtual machine using SSH or PuTTY.
- How to install MySQL on the virtual machine.

[AZURE.INCLUDE [antares-iaas-signup-iaas](../includes/antares-iaas-signup-iaas.md)]

## Create a virtual machine running OpenSUSE Linux

[AZURE.INCLUDE [create-and-configure-opensuse-vm-in-portal](../includes/create-and-configure-opensuse-vm-in-portal.md)]

##Install and run MySQL on the virtual machine

[AZURE.INCLUDE [install-and-run-mysql-on-opensuse-vm](../includes/install-and-run-mysql-on-opensuse-vm.md)]

##Summary
In this tutorial you learned to create a virtual machine running OpenSUSE Linux and remotely connect to it using SSH or PuTTY.  You also learned how to install and configure MySQL on the Linux virtual machine.  For more information on MySQL, see the [MySQL Documentation][MySQLDocs].

[MySQLDocs]: http://dev.mysql.com/doc/
[MySQL]: http://www.mysql.com
[AzurePortal]: http://manage.windowsazure.com
