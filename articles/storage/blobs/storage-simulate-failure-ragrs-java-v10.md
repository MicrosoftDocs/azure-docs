---
title: 'Tutorial: Access read-access redundant storage in Azure - Java V10 | Microsoft Docs'
description: Simulate an failure in accessing read access geo-redundant storage using Java V10.
services: storage 
author: tamram

ms.service: storage 
ms.topic: tutorial
ms.date: 01/03/2019
ms.author: tamram 
#Customer intent: As a developer, I want to see for myself how high availability works in Azure, so that I have confidence in the redundancy of my data in the event of a disaster.
---  

# Tutorial: Accessing read-access redundant storage with the Java V10 SDK

This tutorial is part two of a series. In it, you learn about the benefits of a [read-access geo-redundant](../common/storage-redundancy-grs.md#read-access-geo-redundant-storage) (RA-GRS) by simulating a failure.

In order to simulate a failure, you can use [Static Routing](#simulate-a-failure-with-an-invalid-static-route). This method will allow you to simulate failure for requests to the primary endpoint of your [read-access geo-redundant](../common/storage-redundancy-grs.md#read-access-geo-redundant-storage) (RA-GRS) storage account, causing the application to read from the secondary endpoint instead.

![Scenario app](media/storage-simulate-failure-ragrs-account-app/Java-put-list-output.png)

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

In part two of the series, you learn how to:

> [!div class="checklist"]
> * Run and pause the application
> * Simulate a failure with [an invalid static route](#simulate-a-failure-with-an-invalid-static-route) 
> * Simulate primary endpoint restoration

## Prerequisites

Before you begin this tutorial, complete the previous tutorial: [Make your application data highly available with Azure storage][previous-tutorial].

To simulate a failure using Fiddler: 

### Running the application

Run the application in your IDE or shell.

Since you control the sample, you do not need to interrupt it in order to simulate a failure. Just make sure that the file has been uploaded to your storage account by running the sample and entering **P**.

## Simulate a failure with an invalid static route

You can create an invalid static route for all requests to the primary endpoint of your [read-access geo-redundant](../common/storage-redundancy-grs.md#read-access-geo-redundant-storage) (RA-GRS) storage account. In this tutorial, the local host is used as the gateway for routing requests to the storage account. Using the local host as the gateway causes all requests to your storage account primary endpoint to loop back inside the host, which subsequently leads to failure. Follow the following steps to simulate a failure, and primary endpoint restoration with an invalid static route. 

### Start and pause the application

Since you control the sample, you do not need to interrupt it in order to test failure.

Make sure that the file has been uploaded to your storage account by running the sample and entering **P**.

### Simulate failure

With the application paused, start command prompt on Windows as an administrator or run terminal as root on Linux.

Get information about the storage account primary endpoint domain by entering the following command on a command prompt or terminal.

```
nslookup STORAGEACCOUNTNAME.blob.core.windows.net
``` 
 Replace `STORAGEACCOUNTNAME` with the name of your storage account. Copy to the IP address of your storage account to a text editor for later use.

To get the IP address of your local host, type `ipconfig` on the Windows command prompt, or `ifconfig` on the Linux terminal. 

To add a static route for a destination host, type the following command on a Windows command prompt or Linux terminal. 


# [Linux](#tab/linux)

  route add <destination_ip> gw <gateway_ip>

# [Windows](#tab/windows)

  route add <destination_ip> <gateway_ip>

---

Replace  `<destination_ip>` with your storage account IP address, and `<gateway_ip>` with your local host IP address.

Now that you've introduced the failure, enter **G** to test the failure. It will inform you that it is using the secondary pipeline as opposed to the primary pipeline.

### Simulate primary endpoint restoration

To simulate the primary endpoint functioning again, delete the static route of the primary endpoint from the routing table. This allows all requests to the primary endpoint to be routed through the default gateway.

To delete the static route of a destination host, the storage account, type the following command on a Windows command prompt or linux terminal.

# [Linux](#tab/linux)

route del <destination_ip> gw <gateway_ip>

# [Windows](#tab/windows)

route delete <destination_ip>

---

Enter **G** to test the download. The application will report that it is now using the primary pipeline again.

![Switching pipelines](media/storage-simulate-failure-ragrs-account-app/java-get-pipeline-example-v10.png)

## Next steps

In part two of the series, you learned about simulating a failure to test read access geo-redundant storage:

Read the following article to learn more about how RA-GRS storage works in general, as well as its associated risks.

> [!div class="nextstepaction"]
> [Designing HA apps with RA-GRS](../common/storage-designing-ha-apps-with-ragrs.md)

[previous-tutorial]: storage-create-geo-redundant-storage.md