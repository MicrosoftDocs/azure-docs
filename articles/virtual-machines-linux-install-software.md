<properties urlDisplayName="Install software on VM" pageTitle="Install software on a Linux virtual machine - Azure" metaKeywords="" description="Learn how to install software on your Linux virtual machine in Azure by using CentOS/Red Hat or Ubuntu." metaCanonical="" services="virtual-machines" documentationCenter="" title="Install software on your Linux virtual machine in Azure" authors="timlt" solutions="" manager="timlt" editor="" />

<tags ms.service="virtual-machines" ms.workload="infrastructure-services" ms.tgt_pltfrm="vm-linux" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="timlt" />





#Install software on your Linux virtual machine in Azure

Linux distributions tend to use software "packages" to install software. These packages are usually managed using a set of commands, such as `apt` or `yum`. You can also install programs without a package, such as with a _tarball_ of the source code.

We will be covering how to use the package managers for some of the common Linux distributions. The stepos will differ based on which Linux distribution you are using.

**Note:** Depending on how your environment is setup, these commands may need to be ran using root privleges (via `sudo`).

##CentOS/Red Hat

CentOS comes with `yum` for package management. With this tool, you can install, uninstall, update, list installed packages, and more. See below for the syntax to these commands.


### Installing

This will install a package, as well as any packages it depends on. Due to dependencies, more than one package may be installed.

	yum install [package name]


### Uninstalling

This will uninstall a package from your machine. Keep in mind, it will not remove any dependencies.

	yum remove [package name]


### Updating

This will update a package to the latest version. The package must be installed before you can update it.

	yum update [package name]


### Listing Installed Packages

This will show a list of all the installed packages on your machine.

	yum list installed


Ubuntu
------

Ubuntu comes with `apt` (Advanced Packaging Tool) for package management. With this tool, you can install, uninstall, update, list installed packages, and more. See below for the syntax to these commands.


### Installing

This will install a package, as well as any packages it depends on. Due to dependencies, more than one package may be installed.

	apt-get install [package name]


### Uninstalling

This will uninstall a package from your machine. Keep in mind, it will not remove any dependencies.

	apt-get remove [package name]


### Updating/Upgrading

To upgrade to a new versio, you will need to use two commands: one to update your package index, and another to upgrade the packages. Run the following command to update your package index:

	apt-get update

Once your package index is updated, run the following command to ugprade your packages:

	apt-get upgrade
