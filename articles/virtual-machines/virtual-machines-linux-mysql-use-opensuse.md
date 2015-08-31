<properties
	pageTitle="Install MySQL on a virtual machine running OpenSUSE Linux in Azure"
	description="Learn to install MySQL on a virtual machine in Azure."
	services="virtual-machines"
	documentationCenter=""
	authors="KBDAzure"
	manager="timlt"
	editor=""
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/31/2015"
	ms.author="kathydav"/>

# Install MySQL on a virtual machine running OpenSUSE Linux in Azure

[MySQL][MySQL] is a popular, open-source SQL database. This tutorial shows you how to create a virtual machine running OpenSUSE Linux, then install MySQL.

[AZURE.INCLUDE [free-trial-note](../../includes/free-trial-note.md)]

## Create a virtual machine running OpenSUSE Linux

[AZURE.INCLUDE [create-and-configure-opensuse-vm-in-portal](../../includes/create-and-configure-opensuse-vm-in-portal.md)]

## Install and run MySQL on the virtual machine

[AZURE.INCLUDE [install-and-run-mysql-on-opensuse-vm](../../includes/install-and-run-mysql-on-opensuse-vm.md)]

## Next steps
For details about MySQL, see the [MySQL Documentation][MySQLDocs].

[MySQLDocs]: http://dev.mysql.com/doc/index-topic.html
[MySQL]: http://www.mysql.com
[AzurePortal]: http://manage.windowsazure.com
