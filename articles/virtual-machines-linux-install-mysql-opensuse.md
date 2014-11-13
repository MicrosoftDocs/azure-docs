<properties urlDisplayName="Install MySQL" pageTitle="Install MySQL on a Linux virtual machine in Azure" metaKeywords="Azure vm OpenSUSE, Linux vm" description="Learn how to create an Azure virtual machine with OpenSUSE Linux, and then use SSH or PuTTY to install MySQL." metaCanonical="" services="virtual-machines" documentationCenter="" title="Install MySQL on a virtual machine running OpenSUSE Linux in Azure" authors="timlt" solutions="" manager="timlt" editor="" />

<tags ms.service="virtual-machines" ms.workload="infrastructure-services" ms.tgt_pltfrm="vm-linux" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="timlt" />




#Install MySQL on a virtual machine running OpenSUSE Linux in Azure

[MySQL](http://www.mysql.com) is a popular open source, SQL database. Using the [Azure Management Portal][AzurePreviewPortal], you can create a virtual machine running OpenSUSE Linux from the Image Gallery.  You can then install and configure a MySQL database on the virtual machine.

In this tutorial, you will learn:

- How to use the Management Portal to create an OpenSUSE Linux virtual machine from the gallery.

- How to connect to the virtual machine using SSH or PuTTY.

- How to install MySQL on the virtual machine.

##Create a Virtual Machine Running OpenSUSE Linux

[WACOM.INCLUDE [create-and-configure-opensuse-vm-in-portal](../includes/create-and-configure-opensuse-vm-in-portal.md)]

##Install and Run MySQL on the Virtual Machine

[WACOM.INCLUDE [install-and-run-mysql-on-opensuse-vm](../includes/install-and-run-mysql-on-opensuse-vm.md)]

##Summary

In this tutorial you learned how to create an OpenSUSE Linux virtual machine and remotely connect to it using SSH or PuTTY. You also learned how to install and configure MySQL on the Linux virtual machine. For more information on MySQL, see the [MySQL Documentation](http://dev.mysql.com/doc/).

[AzurePreviewPortal]: http://manage.windowsazure.com
