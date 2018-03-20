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
> * Modify the security group
> * Log in to one of the instances
> * Prep the instance for Service Fabric

## Prerequisites

To complete this tutorial, you'll need both an Azure and an AWS account.

## Create EC2 instances

Login to the AWS Console > Enter **EC2** in the search box > Select **EC2 Virtual Servers in the Cloud**
![AWS console search][aws-console]

Select **Launch Instance**
![EC2 console][aws-ec2console]

Click **Select** next to Microsoft Windows Server 2016 Base. Don't worry about the specific AMI number, it varies by region and as updates are pushed out.
![EC2 instance selection][aws-ec2instance]

Select **t2.medium**, then click on **Next: Configure Instance Details**
![EC2 instance size selection][aws-ec2size]

Change number of instances to **3**, then click on **Advanced Details** to expand that section.
![EC2 instance configuration][aws-ec2configure]

To connect your virtual machines together in service fabric, the VMs that are hosting your infrastructure need to have the same credentials.  There are two common ways to get consistent credentials: join them all to the same domain, or set the same administrator password on each VM.  For this tutorial, you'll use a user data script to set the EC2 instances to all have the same password.  In a production environment, joining the hosts to a windows domain is more secure.

Enter the following script in the user data field on the console:

```powershell
<powershell>
$user = [adsi]"WinNT://localhost/Administrator,user"
$user.SetPassword("serv1ceF@bricP@ssword")
$user.SetInfo()
</powershell>
```

![EC2 review and launch][aws-ec2configure2]

Once you've entered the powershell script select **Review and Launch**, and then **Launch**.

Change the drop-down to **Proceed without a key pair** and select the checkbox acknowledging that you know the password.
![AWS key pair selection][aws-keypair]

Finally, click on **Launch Instances**, and then **View Instances**.  You have the basis for your Service Fabric cluster created, now we just need to add a few final configurations to the instances themselves.

## Modify the security group

Service Fabric requires a number of ports open between the hosts in your cluster. In order to open these ports in the AWS infrastructure, select one of the instances that you just created. Then click on the name of the security group for example **launch-wizard-4**.

![Modify security group][aws-ec2security]

Since a number of management ports are required to run a service fabric cluster you will only open these ports between the hosts in the same security group, take note of the security group id, in the examples case it is **sg-c4fb1eba**.  Then select **Edit**.

![Edit security group][aws-ec2securityedit]

### FIX ME

You will need to add a number of rules to the security group: the first is to allow ICMP traffic, for basic connectivity checks; the 2nd will be for all of the ports for SMB and Remote Registry. For the first rule select **Add Rule**, then from the drop-down menu select **All ICMP - IPv4**. Select the entry box next to custom and enter your security group id from above. For the second rule you will need to do the same thing.  Select **Add Rule**, from the drop-down select **Custom TCP Rule**, in the port range box enter `135, 137-139, 445`, and then in the source box enter your security group id.  Now click **Save**

![Security group ports][aws-ec2securityports]

## Connect to an instance and validate inter-connectivity

From the security group tab, select **Instances** from the left-hand menu.  Click through each of the instances that you have created and note their IP addresses.

### INSERT IP Address Image here

Once you have all of the IP addresses select one of the nodes to connect to, right-click on the instance and select **Conect**.  From here you are able to download the RDP file for this particular instance.  Select **Download Remote Desktop File**, and then open the file that is downloaded to establish your remote desktop connection (RDP) to this instance.  When prompted enter your password `serv1ceF@bricP@ssword`.

![Download Remote Desktop File][aws-rdp]

## Enable SMB

Once you have connected into the instance you'll need to enable file sharing.  Go to **Start** > **PowerShell** and run the following command:

```powershell
netsh advfirewall firewall set rule group="File and Printer Sharing" new enable=Yes
```

## Validate that Remote Registry is running

Service Fabric uses remote registry to make changes as it scales in and out

```powershell
Get-Service -Name "Remote Registry"
```

Here is example output when it is running:

```powershell
Status   Name               DisplayName
------   ----               -----------
Running  RemoteRegistry     Remote Registry
```

If it is in a stopped state than you need to run:

```powershell
Start-Service -Name "Remote Registry"
```

## Open Service Fabric ports 

To use SMB and Remote registry you'll need to open a number of ports, specifically: `135, 137-139, 445`. Opening these ports to the world is not particularly safe, so you will restrict it down to the LocalSubnet.

```powershell
New-NetFirewallRule -DisplayName "Service Fabric Ports" -Direction Inbound -Action Allow -RemoteAddress LocalSubnet -Protocol TCP -LocalPort 135, 137-139, 445
```

## Next steps

In part one of the series, you learned how to launch three EC2 instances and get them configured for the Service Fabric installation:

> [!div class="checklist"]
> * Create a set of EC2 instances
> * Modify the security group
> * Log in to one of the instances
> * Prep the instance for Service Fabric

Advance to part two of the series to configure service fabric on your cluster.

> [!div class="nextstepaction"]
> [Install service fabric](standalone-tutorial-create-service-fabric-cluster.md)

<!-- IMAGES -->
[aws-console]: ./media/service-fabric-tutorial-standalone-cluster/aws-console.png
[aws-ec2console]: ./media/service-fabric-tutorial-standalone-cluster/aws-ec2console.png
[aws-ec2instance]: ./media/service-fabric-tutorial-standalone-cluster/aws-ec2instance.png
[aws-ec2size]: ./media/service-fabric-tutorial-standalone-cluster/aws-ec2size.png
[aws-ec2configure]: ./media/service-fabric-tutorial-standalone-cluster/aws-ec2configure.png
[aws-ec2configure2]: ./media/service-fabric-tutorial-standalone-cluster/aws-ec2configure2.png
[aws-keypair]: ./media/service-fabric-tutorial-standalone-cluster/aws-keypair.png
[aws-rdp]: ./media/service-fabric-tutorial-standalone-cluster/aws-rdp.png
[aws-ec2security]: ./media/service-fabric-tutorial-standalone-cluster/aws-ec2security.png
[aws-ec2securityedit]: ./media/service-fabric-tutorial-standalone-cluster/aws-ec2securityedit.png
[aws-ec2securityports]: ./media/service-fabric-tutorial-standalone-cluster/aws-ec2securityports.png

<!-- https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-standalone-deployment-preparation -->