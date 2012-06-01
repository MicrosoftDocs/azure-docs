<properties umbracoNaviHide="0" pageTitle="Installing MySQL on a OpenSUSE Linux Virtual Machine in Windows Azure" metaKeywords="" metaDescription="" linkid="manage-linux-common-tasks-MongoDB" urlDisplayName="Install MongoDB" headerExpose="" footerExpose="" disqusComments="1" />
#Install MySQL on a virtual machine running OpenSUSE Linux in Windows Azure

<div chunk="../../shared/chunks/disclaimer.md" />

[MySQL](http://www.mysql.com) is a popular open source, SQL database. Using the [Windows Azure (Preview) Management Portal][AzurePreviewPortal], you can create a virtual machine running OpenSUSE Linux from the Image Gallery.  You can then install and configure a MySQL database on the virtual machine.

In this tutorial, you will learn:

- How to use the Preview Management Portal to create an OpenSUSE Linux virtual machine from the gallery.

- How to connect to the virtual machine using SSH or PuTTY.

- How to install MySQL on the virtual machine.

## Sign up for the Virtual Machines preview feature

You will need to sign up for the Windows Azure Virtual Machines preview feature in order to create a virtual machine. You can also sign up for a free trial account if you do not have a Windows Azure account.

<div chunk="../../../DevCenter/Shared/Chunks/antares-iaas-signup-iaas.md"/>

##Create a Virtual Machine Running OpenSUSE Linux

<div chunk="../../../shared/chunks/create-and-configure-opensuse-vm-in-portal.md" />

##Install and Run MySQL on the Virtual Machine

<div chunk="../../../shared/chunks/install-and-run-mysql-on-opensuse-vm.md" />

##Summary

In this tutorial you learned how to create an OpenSUSE Linux virtual machine and remotely connect to it using SSH or PuTTY. You also learned how to install and configure MySQL on the Linux virtual machine. For more information on MySQL, see the [MySQL Documentation](http://dev.mysql.com/doc/).

[AzurePreviewPortal]: http://manage.windowsazure.com