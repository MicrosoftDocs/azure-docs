<properties
   pageTitle="How to Create an Azure Virtual Machine with the xplat-cli"
   description="This topic describes how to install the xplat-cli on any platform, how to use it to connect to your Azure account, and how to create a VM from the xplat-cli."
   services="virtual-machines"
   documentationCenter="virtual-machines"
   authors="squillace"
   manager="timlt"
   editor="tysonn"/>

<tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="command-line-interface"
   ms.workload="infrastructure-services"
   ms.date="02/20/2015"
   ms.author="rasquill"/>

# Creating a VM using the Azure Cross-Platform Command-Line Interface (xplat-cli)
The xplat-cli is a great way to manage your Azure infrastructure from any platform.

Only installing the xplat-cli and having an Azure subscription will prevent you from creating a VM immediately, so let's take care of those steps. If you don't have an Azure account, [go get a free one](http://azure.microsoft.com/pricing/free-trial/).

## Installing the xplat-cli

Follow these instructions to install the [xplat-cli](xplat-cli.md#install).

## Connecting to Azure with the xplat-cli

You can connect your xplat-cli installation with a personal Azure account, or with a work or school Azure account. To understand the differences and choose, see [How to connect to your Azure subscription](xplat-cli.md#configure).

## Creating and Connecting to a VM in Azure

Creating a VM starts with choosing (or uploading) an image and using the `azure vm create` command.

1. To choose an image from the command-line, you can list the VM images available using the command `azure vm image list`. Because there are so many images, you'll want to page the results using `more` or filter using `grep` (Linux) or `findstr` (Windows). For example, if you're looking for Ubuntu images on Linux use a command like this:

        azure vm image list | grep Ubuntu

    This would still result in a long list of images, which you could further narrow down by version:

        azure vm image list | grep Ubuntu-14_10

    From here you can choose an image and use the `show` command to view its properties in more detail:

        azure vm image show b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-14_10-amd64-server-20150202-en-us-30GB

2. Creating your VM.

    Once you have chosen a VM image, use the `vm create` command to create the image. This command has a lot of options which you can list with the help command:

        vm create --help

    Along with the image from step 1, the key arguments you need to create a VM are location, DNS name and user name.

    For authentication you can choose to specify a password (on the command line or interactively), or to authenticate using a certificate. If you choose a password it needs to be at least 8 characters, contain both upper and lower case letters and contain a special character (e.g. one of !@#$%^&+=). It's a good idea to put the password in quotes and escape special characters if you're passing it on the command line.

    To choose a location you can use the `vm location list` command to pick a region near you.

  The DNS name you choose needs to be unique (it will map to `dnsname.cloudapp.net`), and will be the same as the machine name if you don't specify a machine name on the command line separately.  

    The Linux example below creates a VM in West US, opens the default SSH port 22 (the -e argument), and creates a user called `myadminuser`:

        azure vm create -e -l "West US"  my-new-cli-vm b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-14_10-amd64-server-20150202-en-us-30GB "myadminuser" "myAdm1n@passwd"

## Next steps

Let's go do something with your VM. 

Since the example above opened the default SSH port, connecting to the VM once it's up and running is straightforward. From a Linux command line:

    ssh myadminuser@my-new-cli-vm.cloudapp.net

A great place to see more examples of using xplat-cli to manage your Azure infrastructure is [Azure command-line tool for Mac and Linux](virtual-machines-command-line-tools.md)

<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
