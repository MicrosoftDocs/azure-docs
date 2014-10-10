<properties urlDisplayName="Install MongoDB" pageTitle="nstall MongoDB on a virtual machine running CentOS Linux in Azure" metaKeywords="Azure, MongoDB" description="Learn how to install Mongo DB on a virtual machine in Azure." metaCanonical="" services="" documentationCenter="" title="Install MongoDB on a virtual machine running CentOS Linux in Azure" authors="timlt" solutions="" manager="timlt" editor="" />

<tags ms.service="virtual-machines" ms.workload="infrastructure-services" ms.tgt_pltfrm="vm-linux" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="timlt" />

# Install MySQL on a virtual machine running OpenSUSE Linux in Azure

[MySQL][MySQL] is a popular open source, SQL database.  Using the [Azure Management Portal][AzurePortal], you can create a virtual machine running OpenSUSE Linux from the Image Gallery.  You can then install and configure a MySQL database on the virtual machine.

In this tutorial, you will learn:

- How to use the Management Portal to create an OpenSUSE Linux virtual machine from the gallery.
- How to connect to the virtual machine using SSH or PuTTY.
- How to install MySQL on the virtual machine.

## Create an Azure subscription

If you do not already have an Azure subscription, you can sign up [for free]. After signing up, follow these steps to continue this tutorial.

[WACOM.INCLUDE [antares-iaas-signup-iaas](../includes/antares-iaas-signup-iaas.md)]

## Create a virtual machine running OpenSUSE Linux

[WACOM.INCLUDE [create-and-configure-opensuse-vm-in-portal](../includes/create-and-configure-opensuse-vm-in-portal.md)]

##Install and run MySQL on the virtual machine

[WACOM.INCLUDE [install-and-run-mysql-on-opensuse-vm](../includes/install-and-run-mysql-on-opensuse-vm.md)]

##Summary
In this tutorial you learned how to create a virtual machine running OpenSUSE Linux and remotely connect to it using SSH or PuTTY.  You also learned how to install and configure MySQL on the Linux virtual machine.  For more information on MySQL, see the [MySQL Documentation][MySQLDocs].

[MySQLDocs]: http://dev.mysql.com/doc/
[MySQL]: http://www.mysql.com
[AzurePortal]: http://manage.windowsazure.com
[for free]: http://azure.microsoft.com