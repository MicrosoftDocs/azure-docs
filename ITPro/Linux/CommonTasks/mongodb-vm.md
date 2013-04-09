<properties linkid="manage-linux-common-task-mongodb-virtual-machine" urlDisplayName="Install MongoDB" pageTitle="Install MongoDB on a Linux virtual machine in Windows Azure" metaKeywords="Azure vm CentOS, Azure vm Linux, Linux vm, Linux MongoDB" metaDescription="Learn how to create a Windows Azure virtual machine with CentOS Linux, and then use SSH or PuTTY to install MongoDB." metaCanonical="" disqusComments="1" umbracoNaviHide="0" writer="kathydav" editor="tysonn" manager="jeffreyg" />

<div chunk="../chunks/linux-left-nav.md" />


#Install MongoDB on a virtual machine running CentOS Linux in Windows Azure

[MongoDB](http://www.mongodb.org/) is a popular open source, high performance NoSQL database. Using the Windows Azure Management Portal, you can create a virtual machine running CentOS Linux from the Image Gallery. You can then install and configure a MongoDB database on the virtual machine.

You will learn:

- How to use the Preview Management Portal to select and install a Linux virtual machine running CentOS Linux from the gallery.

- How to connect to the virtual machine using SSH or PuTTY.
- How to install MongoDB on the virtual machine.

<div chunk="../../../DevCenter/Shared/Chunks/antares-iaas-signup-iaas.md"/>

##Create a virtual machine running CentOS Linux

<div chunk="../../../shared/chunks/create-and-configure-centos-vm-in-portal.md" />

## Attach a data disk

<div chunk="../../../shared/chunks/attach-data-disk-centos-vm-in-portal.md" />

##Install and run MongoDB on the virtual machine

<div chunk="../../../shared/chunks/install-and-run-mongo-on-centos-vm.md" />

##Summary

In this tutorial you learned how to create a Linux virtual machine and remotely connect to it using SSH or PuTTY. You also learned how to install and configure MongoDB on the Linux virtual machine. For more information on MongoDB, see the [MongoDB Documentation](http://www.mongodb.org/display/DOCS/Home).

[AzurePreviewPortal]: http://manage.windowsazure.com
