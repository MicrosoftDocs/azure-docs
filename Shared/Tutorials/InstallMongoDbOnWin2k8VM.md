# Install MongoDB on a Virtual Machine Running Windows Server 2008 R2

[MongoDB][MongoDB] is a popular open source, high performance NoSQL database.  Using the Windows Azure Management Portal, you can create a virtual machine running Microsoft Windows Server 2008 R2 from the Image Gallery.  You can then install and configure a MongoDB database on the virtual machine.

In this tutorial, you will learn:

- How to use the Windows Azure Management Portal to create a Windows Server 2008 R2 SP1 virtual machine from the gallery.
- How to connect to the virtual machine using Remote Desktop.
- How to install MongoDB on the virtual machine.

## Create a Virtual Machine Running Windows Server 2008 R2

<div chunk="../Chunks/create-and-configure-windows-server-2008-vm-in-portal.md"/>

## Install and Run MongoDB on the Virtual Machine 

<div chunk="../Chunks/install-and-run-mongo-on-win2k8-vm.md"/>

##Summary
In this tutorial you learned how to create a Windows Server 2008 R2 SP1 virtual machine and remotely connect to it.  You also learned how to install and configure MongoDB on the Windows virtual machine. For more information on MongoDB, see the [MongoDB Documentation][MongoDocs].

[MongoDocs]: http://www.mongodb.org/display/DOCS/Home
[MongoDB]: http://www.mongodb.org/