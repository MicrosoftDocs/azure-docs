---
title: 'Tutorial: Access read-access redundant storage in Azure - Java V10 | Microsoft Docs'
description: Simulate an failure in accessing read access geo-redundant storage using Java V10.
services: storage 
author: tamram


ms.service: storage 
ms.topic: tutorial
ms.date: 01/03/2019
ms.author: tamram 
---  

# Tutorial: Accessing read-access redundant storage with the Java V10 SDK

This tutorial is part two of a series. In it, you learn about the benefits of a [read-access geo-redundant](../common/storage-redundancy-grs.md#read-access-geo-redundant-storage) (RA-GRS) by simulating a failure.

In order to simulate a failure, you can use either [Fiddler](#simulate-a-failure-with-fiddler) or [Static Routing](#simulate-a-failure-with-an-invalid-static-route). Either method will allow you to simulate failure for requests to the primary endpoint of your [read-access geo-redundant](../common/storage-redundancy-grs.md#read-access-geo-redundant-storage) (RA-GRS) storage account, causing the application to read from the secondary endpoint instead.

![Scenario app](media/storage-simulate-failure-ragrs-account-app/Java-put-list-output.png)

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

In part two of the series, you learn how to:

> [!div class="checklist"]
> * Run and pause the application
> * Simulate a failure with [fiddler](#simulate-a-failure-with-fiddler) or [an invalid static route](#simulate-a-failure-with-an-invalid-static-route) 
> * Simulate primary endpoint restoration

## Prerequisites

Before you begin this tutorial, complete the previous tutorial: [Make your application data highly available with Azure storage][previous-tutorial].

To simulate a failure using Fiddler: 

* Download and [install Fiddler](https://www.telerik.com/download/fiddler)

## Simulate a failure with Fiddler

To simulate failure with Fiddler, you inject a failed response for requests to the primary endpoint of your RA-GRS storage account.

The following sections depict how to simulate a failure and primary endpoint restoration with fiddler.

### Launch fiddler

Open Fiddler, select **Rules** and **Customize Rules**.

![Customize Fiddler rules](media/storage-simulate-failure-ragrs-account-app/figure1.png)

The Fiddler ScriptEditor launches and displays the **SampleRules.js** file. This file is used to customize Fiddler.

Paste the following code sample in the `OnBeforeResponse` function. The new code is commented out to ensure that the logic it creates is not implemented immediately.

Once complete, select **File** and **Save** to save your changes.

```javascript
	/*
		// Simulate data center failure
		// After it is successfully downloading the blob, pause the code in the sample,
		// uncomment these lines of script, and save the script.
		// It will intercept the (probably successful) responses and send back a 503 error. 
		// When you're ready to stop sending back errors, comment these lines of script out again 
		//     and save the changes.

		if ((oSession.hostname == "contosoragrs.blob.core.windows.net") 
	    	&& (oSession.PathAndQuery.Contains("HelloWorld"))) {
			oSession.responseCode = 503;  
		}
	*/
```

![Paste customized rule](media/storage-simulate-failure-ragrs-account-app/figure2.png)

### Running the application

Run the application in your IDE or shell.

Since you control the sample, you do not need to interrupt it in order to simulate a failure. Just make sure that the file has been uploaded to your storage account by running the sample and entering **P**.

### Simulate failure

While the application is paused, uncomment the custom rule we saved in Fiddler.

The code sample looks for requests to the RA-GRS storage account and, if the path contains the name of the file `HelloWorld`, returns a response code of `503 - Service Unavailable`.

Navigate to Fiddler and select **Rules** -> **Customize Rules...**.

Uncomment the following lines, replace `STORAGEACCOUNTNAME` with the name of your storage account. Select **File** -> **Save** to save your changes. 

> [!NOTE]
> If you are running the sample application on Linux, you need to restart Fiddler whenever you edit the **CustomRule.js** file, in order for Fiddler to install the custom logic.

```javascript
         if ((oSession.hostname == "STORAGEACCOUNTNAME.blob.core.windows.net")
         && (oSession.PathAndQuery.Contains("HelloWorld"))) {
         oSession.responseCode = 503;
         }
```

Now that you've introduced the failure, enter **G** to test the failure.

It will inform you that it is using the secondary pipeline as opposed to the primary pipeline.

### Simulate primary endpoint restoration


With the Fiddler custom rule set in the preceding step, requests to the primary endpoint fail.

In order to simulate the primary endpoint functioning again, you remove the logic to inject the `503` error.

Navigate to Fiddler and select **Rules** and **Customize Rules...**.  Comment or remove the custom logic in the `OnBeforeResponse` function, leaving the default function.

Select **File** and **Save** to save the changes.

When complete, enter **G** to test the download. The application will report that it is now using the primary pipeline again.

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