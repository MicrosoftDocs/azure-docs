<properties
    pageTitle="Quick Create a Linux VM using the Azure Portal | Microsoft Azure"
    description="Quick Create a Linux VM using the Azure Portal."
    services="virtual-machines-linux"
    documentationCenter=""
    authors="vlivech"
    manager="timlt"
    editor=""
    tags="azure-resource-manager"
/>

<tags
    ms.service="virtual-machines-linux"
    ms.workload="infrastructure-services"
    ms.tgt_pltfrm="vm-linux"
    ms.devlang="na"
    ms.topic="article"
    ms.date="03/15/2016"
    ms.author="v-livech"
/>

# Create a Linux VM using the Azure Portal

In this article we are going to "Quick Create" a Linux VM using the [Azure Portal](https://portal.azure.com/).

Prerequisites are: [an Azure account](https://azure.microsoft.com/pricing/free-trial/).

## Introduction

One of the most basic and most common task with Azure is creating a VM.  This article will walk you through creating an Ubuntu VM using just the Portal.  For this article we will use SSH keys as the default login method for the Admin user login.

## Detailed Walk Through

  1. Click New

    ![screen1](screens/screen1.png)

  2. Click Compute

    ![screen2](screens/screen2.png)

  3. Click Ubuntu Server 14.04 LTS

  4. Click Create

    ![screen3](screens/screen3.png)

  5. Fill out:
    - Name of the VM    
    - User Name of the Admin User
    - Copy and paste the Public Key from your `~/.ssh/` directory
    - Resource Group Name
  6. Click OK

    ![screen4](screens/screen4.png)

  7. Choose the A0 size

  8. Click OK

    ![screen5](screens/screen5.png)

  9. Leave the defaults for Storage and Network naming

  10. Click OK

    ![screen6](screens/screen6.png)

  11.  Verify the settings for the new Ubuntu VM
  
  12. Click OK

    ![screen7](screens/screen7.png)

  13. Open the Portal Dashboard

    ![screen8](screens/screen8.png)

  14. Open the exampleVMname tile

    ![screen9](screens/screen9.png)
