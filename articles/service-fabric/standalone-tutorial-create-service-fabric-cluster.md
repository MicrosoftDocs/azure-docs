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

This tutorial is part two of a series.  Service Fabric for Windows Server deployment (standalone) offers you the option to choose your own environment and create a cluster as part of our "any OS, any cloud" approach with Service Fabric. This tutorial shows you how to create the AWS infrastructure necessary to host this standalone cluster.

In part two of the series, you learn how to:

> [!div class="checklist"]
> * Create a set of EC2 instances
> * VPC?
> * Security Groups?
> * Login to one of the instances

To create the cluster, use the Service Fabric for Windows Server package (Windows Server 2012 R2 and newer) found here: 
Download Link - Service Fabric Standalone Package - Windows Server http://go.microsoft.com/fwlink/?LinkId=730690
Copy it over

The Service Fabric runtime package is automatically downloaded at time of cluster creation. If deploying from a machine not connected to the internet, please download the runtime package out of band from here: 
Download Link - Service Fabric Runtime - Windows Server

## Prerequisites

In order to complete this tutorial you need an AWS account.

## Create an EC2 instance

This is where we create an EC2 instance.

### Validate the connections

While the files are being uploaded, you can verify the number of concurrent connections to your storage account. Open a **Command Prompt** and type `netstat -a | find /c "blob:https"`. This command shows the number of connections that are currently opened using `netstat`. The following example shows a similar output to what you see when running the tutorial yourself. As you can see from the example, 800 connections were open when uploading the random files to the storage account. This value changes throughout running the upload. By uploading in parallel block chunks, the amount of time required to transfer the contents is greatly reduced.

```
C:\>netstat -a | find /c "blob:https"
800

C:\>
```

## Remote into your virtual machine

Open the command prompt

## Next steps

In part two of the series, you learned about uploading large amounts of random data to a storage account in parallel, such as how to:

> [!div class="checklist"]
> * Configure the connection string
> * Build the application
> * Run the application
> * Validate the number of connections

Advance to part three of the series to download large amounts of data from a storage account.

> [!div class="nextstepaction"]
> [Install the application into the service fabric cluster](standalone-tutorial-install-an-application.md)