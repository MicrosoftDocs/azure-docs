<properties umbracoNaviHide="0" pageTitle="Installing MongoDB on a CentOS Linux Virtual Machine in Windows Azure" metaKeywords="" metaDescription="" linkid="manage-linux-common-tasks-MongoDB" urlDisplayName="Install MongoDB" headerExpose="" footerExpose="" disqusComments="1" />
#Install MongoDB on a virtual machine running CentOS Linux in Windows Azure

<div chunk="../../Shared/Chunks/disclaimer.md" />

[MongoDB](http://www.mongodb.org/) is a popular open source, high performance NoSQL database. Using the [Windows Azure (Preview) Management Portal][AzurePreviewPortal], you can create a virtual machine running CentOS Linux from the Image Gallery. You can then install and configure a MongoDB database on the virtual machine.

You will learn:

- How to use the Preview Management Portal to select and install a Linux virtual machine running CentOS Linux from the gallery.

- How to connect to the virtual machine using SSH or PuTTY.
- How to install MongoDB on the virtual machine.

## Sign up for the Virtual Machines preview feature

You will need to sign up for the Windows Azure Virtual Machines preview feature in order to create a virtual machine. You can also sign up for a free trial account if you do not have a Windows Azure account.

<div chunk="../../../DevCenter/Shared/Chunks/antares-iaas-signup-iaas.md"/>

##Connect to the Windows Azure Management Portal and Provision a Virtual Machine Image

<div chunk="../../../shared/chunks/create-and-configure-centos-vm-in-portal.md" />

##Install and Run MongoDB on the Virtual Machine

<div chunk="../../../shared/chunks/install-and-run-mongo-on-centos-vm.md" />

##Summary

In this tutorial you learned how to create a Linux virtual machine and remotely connect to it using SSH or PuTTY. You also learned how to install and configure MongoDB on the Linux virtual machine. For more information on MongoDB, see the [MongoDB Documentation](http://www.mongodb.org/display/DOCS/Home).

[AzurePreviewPortal]: http://manage.windowsazure.com
