# Install MongoDB on a virtual machine running CentOS Linux in Windows Azure

[MongoDB][MongoDB] is a popular open source, high performance NoSQL database.  Using the [Windows Azure (Preview) Management Portal][AzurePreviewPortal], you can create a virtual machine running CentOS Linux from the Image Gallery.  You can then install and configure a MongoDB database on the virtual machine.

You will learn:

- How to use the Preview Management Portal to create a virtual machine running CentOS Linux from the gallery.
- How to connect to the virtual machine using SSH or PuTTY.
- How to install MongoDB on the virtual machine.

## Create a virtual machine running CentOS Linux

<div chunk="../Chunks/create-and-configure-centos-vm-in-portal.md" />

##Install and run MongoDB on the virtual machine

<div chunk="../Chunks/install-and-run-mongo-on-centos-vm.md" />

##Summary
In this tutorial you learned how to create a Linux virtual machine and remotely connect to it using SSH or PuTTY.  You also learned how to install and configure MongoDB on the Linux virtual machine.  For more information on MongoDB, see the [MongoDB Documentation][MongoDocs].

[MongoDocs]: http://www.mongodb.org/display/DOCS/Home
[MongoDB]: http://www.mongodb.org/
[AzurePreviewPortal]: http://manage.windowsazure.com
