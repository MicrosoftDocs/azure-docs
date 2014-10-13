<properties urlDisplayName="Install MongoDB" pageTitle="Install MongoDB on a Linux virtual machine in Azure" metaKeywords="Azure vm CentOS, Azure vm Linux, Linux vm, Linux MongoDB" description="Learn how to create an Azure virtual machine with CentOS Linux, and then use SSH or PuTTY to install MongoDB." metaCanonical="" services="virtual-machines" documentationCenter="" title="Install MongoDB on a virtual machine running CentOS Linux in Azure" authors="kathydav" solutions="" manager="timlt" editor="tysonn" />

<tags ms.service="virtual-machines" ms.workload="infrastructure-services" ms.tgt_pltfrm="vm-linux" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="kathydav" />






#Install MongoDB on a virtual machine running CentOS Linux in Azure

[MongoDB](http://www.mongodb.org/) is a popular open source, high performance NoSQL database. Using the Azure Management Portal, you can create a virtual machine running CentOS Linux from the Image Gallery. You can then install and configure a MongoDB database on the virtual machine.

You will learn:

- How to use the Management Portal to select and install a Linux virtual machine running CentOS Linux from the gallery.

- How to connect to the virtual machine using SSH or PuTTY.
- How to install MongoDB on the virtual machine.


##Create a virtual machine running CentOS Linux

[WACOM.INCLUDE [create-and-configure-centos-vm-in-portal](../includes/create-and-configure-centos-vm-in-portal.md)]

## Attach a data disk

[WACOM.INCLUDE [attach-data-disk-centos-vm-in-portal](../includes/attach-data-disk-centos-vm-in-portal.md)]

##Install and run MongoDB on the virtual machine

[WACOM.INCLUDE [install-and-run-mongo-on-centos-vm](../includes/install-and-run-mongo-on-centos-vm.md)]

##Summary

In this tutorial you learned how to create a Linux virtual machine and remotely connect to it using SSH or PuTTY. You also learned how to install and configure MongoDB on the Linux virtual machine. For more information on MongoDB, see the [MongoDB Documentation](http://www.mongodb.org/display/DOCS/Home). 


