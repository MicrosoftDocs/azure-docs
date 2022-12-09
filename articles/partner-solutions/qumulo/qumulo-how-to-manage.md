---
title: Manage your Azure Native Qumulo Service integration
description: This article describes how to manage Qumulo on the Azure portal. 

ms.topic: how-to #Required; leave this attribute/value as-is.
ms.custom: template-how-to #Required; leave this attribute/value as-is.
ms.date: 12/31/2022
---


# How to Manage the Azure Native Qumulo Service

This article describes how to manage Azure Native Qumulo Scalable File Service.

## Resource Overview


    ![](media/qumulo-how-to-manage/image5.png)
    Screenshot

To see the details of you of your Qumulo resource, select **Overview** in the left pane.

These details include the following:

- Resource group
- Qumulo Core Web UI Login URL
- Location of the filesystem
- Virtual network and subnet details
- Subscription
- Marketplace Status of the service
- Pricing plan
- Storage type

Selecting _IP addresses_ at the bottom displays the IP addresses associated with the filesystem that can be used to mount the file system to your workload machine.

  Screenshot
![](media/qumulo-how-to-manage/image6.png)

## Accessing the Qumulo FileSystem

1. Create a new virtual machine in the same virtual network or use an existing virtual machine in the same virtual network. Then, login to the machine. You can use a bastion host to login to the virtual machine based on your network policy.

![](media/qumulo-how-to-manage/image7.png)
  Screenshot

1. To access the admin page, Open the Edge browser on the virtual machine and enter the Qumulo Core Web UI Login URL which is present in the resource overview into the address bar of the browser. Use username as "admin" and enter the password to login.

![](media/qumulo-how-to-manage/image8.png)
  Screenshot

## Mounting the Qumulo File System

1. Open File Explorer on the virtual machine. Right-click on the Network drive icon and select **Map network drive...**.

    
![](media/qumulo-how-to-manage/image9.png)
  Screenshot

1. From the IP address tab of the Resource overview page, select any one of the Ip addresses to enter the folder path value and append it with `\files` and select **Finish**.
<!-- This does not match the image in the document. -->

![](media/qumulo-how-to-manage/image10.png)

1. Enter the **Username** and **Password** to complete adding the network drive to your virtual machine.

  Screenshot
    ![](media/qumulo-how-to-manage/image11.png)

## Delete the Qumulo FileSystem --

To delete a deployment of Qumulo File System.

1. From the Resource menu, select your Qumulo File System
1. Select the Overview on the left
1. Select **Delete**.
1. Confirm that you want to delete the Qumulo File System along with associated data and other resources attached to the service.
1. Select **Delete**.


![](media/qumulo-how-to-manage/image5.png)
  Screenshot

## Next Steps

