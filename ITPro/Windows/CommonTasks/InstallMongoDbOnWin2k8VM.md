<properties linkid="manage-windows-common-task-mongodb-vm" urlDisplayName="Install MongoDB" pageTitle="Install MongoDB on a Windows Server virtual machine" metaKeywords="Azure vm, Azure MongoDB, Azure remote desktop" metaDescription="Learn how to create a Windows Azure virtual machine with Windows Server 2008 R2, and then use Remote Desktop to install MongoDB." metaCanonical="" disqusComments="1" umbracoNaviHide="1" writer="kathydav" editor="tysonn" manager="jeffreyg" />


#Install MongoDB on a virtual machine running Windows Server in Windows Azure

[MongoDB][MongoDB] is a popular open source, high performance NoSQL database.  Using the [Windows Azure (Preview) Management Portal][AzurePreviewPortal], you can create a virtual machine running Windows Server from the Image Gallery.  You can then install and configure a MongoDB database on the virtual machine.

In this tutorial, you will learn:

- How to use the Management Portal to create a Windows Server virtual machine from the gallery.
- How to connect to the virtual machine using Remote Desktop.
- How to install MongoDB on the virtual machine.

## Create a virtual machine running Windows Server 2008 R2

<div chunk="../../../Shared/Chunks/create-and-configure-windows-server-2008-vm-in-portal.md" />

## Attach a data disk

<div chunk="../../../Shared/Chunks/attach-data-disk-windows-server-2008-vm-in-portal.md" />

## Install and run MongoDB on the virtual machine 

<div chunk="../../../Shared/Chunks/install-and-run-mongo-on-win2k8-vm.md" />

##Summary
In this tutorial you learned how to create a Windows Server virtual machine and remotely connect to it.  You also learned how to install and configure MongoDB on the Windows virtual machine. For more information on MongoDB, see the [MongoDB Documentation][MongoDocs].

[MongoDocs]: http://www.mongodb.org/display/DOCS/Home
[MongoDB]: http://www.mongodb.org/
[AzurePreviewPortal]: http://manage.windowsazure.com