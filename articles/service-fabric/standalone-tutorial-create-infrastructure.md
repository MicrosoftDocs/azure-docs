---
title: Creating the infrastructure for a service fabric cluster on AWS - Azure Service Fabric | Microsoft Docs
description: In this tutorial, you learn how to set up the AWS infrastructure to run a service fabric cluster.
services: service-fabric
documentationcenter: .net
author: david-stanford
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 03/09/2018
ms.author: dastanfo
ms.custom: mvc
---
# Create AWS Infrastructure to host a service fabric cluster

This tutorial is part one of a series.  Service Fabric for Windows Server deployment (standalone) offers you the option to choose your own environment and create a cluster as part of the "any OS, any cloud" approach that Service Fabric is taking. Part one of this tutorial shows you how to create the AWS infrastructure necessary to host a standalone cluster of Service Fabric.

In part one of the series, you learn how to:

> [!div class="checklist"]
> * Create a set of EC2 instances
> * Security Groups?
> * Log in to one of the instances

## Prerequisites

To complete this tutorial you will need both an Azure and an AWS account.

## Create EC2 instances

Login to the AWS Console > Enter **EC2** in the search box > Click on EC2 ***Virtual Servers in the Cloud***
![AWS console search][aws-console]

Select Launch Instance
![EC2 console][aws-ec2console]

Click **Select** next to Microsoft Windows Server 2016 Base, don't worry if the ami-xxxxxxxx matches as it varies depending on the region you are working in.
![EC2 instance selection][aws-ec2instance]

Select t2.medium > Next: Configure Instance Details
![EC2 instance size selection][aws-ec2size]

Change number of instances to 3 > Expand Advanced Details
![EC2 instance configuration][aws-ec2configure]

To connect your virtual machines together in service fabric, the VMs that are hosting your infrastructure need to have the same credentials.  There are two common ways to get consistent credentials: join them all to the same domain, or set the same administrator password on each VM.  For this tutorial, we will use a user data script to ensure they all have the same password.  In a production environment, you should join them to a domain as storing credentials in the user data field of a VM is not secure.

Enter the following script in the user data field on the console.

```powershell
<powershell>
$user = [adsi]"WinNT://localhost/Administrator,user"
$user.SetPassword("serv1ceF@bricP@ssword")
$user.SetInfo()
</powershell>
```

![EC2 review and launch][aws-ec2configure2]

Once you've entered the powershell script in the user data field select **Review and Launch** > **Launch**

Change the drop-down to proceed without a key pair and select the checkbox acknowledging that you know the password.
![AWS key pair selection][aws-keypair]

**Launch Instances** > **View Instances**

## Connect to an instance and validate inter-connectivity

click in one of the checkboxes next to the instance list

![Download Remote Desktop File][aws-rdp]

## Next steps

In part one of the series, you learned about uploading large amounts of random data to a storage account in parallel, such as how to:

> [!div class="checklist"]
> * Configure the connection string
> * Build the application
> * Run the application
> * Validate the number of connections

Advance to part two of the series to download large amounts of data from a storage account.

> [!div class="nextstepaction"]
> [Create the service fabric cluster](standalone-tutorial-create-service-fabric-cluster.md)

<!-- IMAGES -->
[aws-console]: ./media/service-fabric-tutorial-standalone-cluster/aws-console.png
[aws-ec2console]: ./media/service-fabric-tutorial-standalone-cluster/aws-ec2console.png
[aws-ec2instance]: ./media/service-fabric-tutorial-standalone-cluster/aws-ec2instance.png
[aws-ec2size]: ./media/service-fabric-tutorial-standalone-cluster/aws-ec2size.png
[aws-ec2configure]: ./media/service-fabric-tutorial-standalone-cluster/aws-ec2configure.png
[aws-ec2configure2]: ./media/service-fabric-tutorial-standalone-cluster/aws-ec2configure2.png
[aws-keypair]: ./media/service-fabric-tutorial-standalone-cluster/aws-keypair.png
[aws-rdp]: ./media/service-fabric-tutorial-standalone-cluster/aws-rdp.png