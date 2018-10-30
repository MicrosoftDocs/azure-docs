---
title: Simulate a failure in accessing read access redundant storage in Azure | Microsoft Docs 
description: Simulate an error in accessing read access geo-redundant storage
services: storage 
author: tamram


ms.service: storage 
ms.topic: tutorial
ms.date: 12/23/2017
ms.author: tamram 
---  

# Tutorial: Simulate a failure in accessing read-access redundant storage

This tutorial is part two of a series.  In this tutorial, you can use either [Fiddler](#simulate-a-failure-with-fiddler) or [Static Routing](#simulate-a-failure-with-an-invalid-static-route) to simulate failure for requests to the primary endpoint of your [read-access geo-redundant](../common/storage-redundancy-grs.md#read-access-geo-redundant-storage) (RA-GRS) storage account, and have the application read from the secondary endpoint.

![Scenario app](media/storage-simulate-failure-ragrs-account-app/scenario.png)

To complete this tutorial, you must have completed the previous storage tutorial: [Make your application data highly available with Azure storage][previous-tutorial].

In part two of the series, you learn how to:

> [!div class="checklist"]
> * Run and pause the application
> * Simulate a failure with [fiddler](#simulate-a-failure-with-fiddler) or [an invalid static route](#simulate-a-failure-with-an-invalid-static-route) 
> * Simulate primary endpoint restoration


## Prerequisites

To simulate a failure using Fiddler: 

* Download and [install Fiddler](https://www.telerik.com/download/fiddler)

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Simulate a failure with Fiddler

To simulate failure with Fiddler, you inject a failed response for requests to the primary endpoint of your RA-GRS storage account to simulate a failure.

Follow the following steps to simulate a failure, and primary endpoint restoration with fiddler.

### Launch fiddler

Open Fiddler, select **Rules** and **Customize Rules**.

![Customize Fiddler rules](media/storage-simulate-failure-ragrs-account-app/figure1.png)

The Fiddler ScriptEditor launches showing the **SampleRules.js** file. This file is used to customize Fiddler. Paste the following code sample in the `OnBeforeResponse` function. The new code is commented out to ensure that the logic it creates is not implemented immediately. Once complete select **File** and **Save** to save your changes.

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

### Start and pause the application

Run the application in your IDE or text editor. Once the application begins reading from the primary endpoint, press **any key** in the console window to pause the application.

### Simulate failure

With the application paused you can now uncomment the custom rule we saved in Fiddler in a preceding step. The code sample looks for requests to the RA-GRS storage account and if the path contains the name of the image, `HelloWorld`, it returns a response code of `503 - Service Unavailable`.

Navigate to Fiddler and select **Rules** -> **Customize Rules...**.  Uncomment out the following lines, replace `STORAGEACCOUNTNAME` with the name of your storage account. Select **File** -> **Save** to save your changes. 

> [!NOTE]
> If you are running the sample application on Linux, you need to restart Fiddler whenever you edit the **CustomRule.js** file, in order for Fiddler to install the custom logic. 
> 
> 


```javascript
         if ((oSession.hostname == "STORAGEACCOUNTNAME.blob.core.windows.net")
         && (oSession.PathAndQuery.Contains("HelloWorld"))) {
         oSession.responseCode = 503;
         }
```

To resume the application, press **any key**.

Once the application starts running again, the requests to the primary endpoint begin to fail. The application attempts to reconnect to the primary endpoint 5 times. After the failure threshold of five attempts, it requests the image from the secondary read-only endpoint. After the application successfully retrieves the image 20 times from the secondary endpoint, the application attempts to connect to the primary endpoint. If the primary endpoint is still unreachable, the application resumes reading from the secondary endpoint. This pattern is the [Circuit Breaker](https://docs.microsoft.com/azure/architecture/patterns/circuit-breaker) pattern described in the previous tutorial.

![Paste customized rule](media/storage-simulate-failure-ragrs-account-app/figure3.png)

### Simulate primary endpoint restoration

With the Fiddler custom rule set in the preceding step, requests to the primary endpoint fail. In order to simulate the primary endpoint functioning again, you remove the logic to inject the `503` error.

To pause the application, press **any key**.

Navigate to Fiddler and select **Rules** and **Customize Rules...**.  Comment or remove the custom logic in the `OnBeforeResponse` function, leaving the default function. Select **File** and **Save** to save the changes.

![Remove customized rule](media/storage-simulate-failure-ragrs-account-app/figure5.png)

When complete, press **any key** to resume the application. The application continues reading from the primary endpoint until it hits 999 reads.

![Resume application](media/storage-simulate-failure-ragrs-account-app/figure4.png)


## Simulate a failure with an invalid static route 
You can create an invalid static route for all requests to the primary endpoint of your [read-access geo-redundant](../common/storage-redundancy-grs.md#read-access-geo-redundant-storage) (RA-GRS) storage account. In this tutorial, the local host is used as the gateway for routing requests to the storage account. Using the local host as the gateway causes all requests to your storage account primary endpoint to loop back inside the host, which subsequently leads to failure. Follow the following steps to simulate a failure, and primary endpoint restoration with an invalid static route. 

### Start and pause the application

Run the application in your IDE or text editor. Once the application begins reading from the primary endpoint, press **any key** in the console window to pause the application. 

### Simulate failure

With the application paused, start command prompt on Windows as an administrator or run terminal as root on Linux. To get information about the storage account primary endpoint domain, enter the following command on a command prompt or terminal.

```
nslookup STORAGEACCOUNTNAME.blob.core.windows.net
``` 
 Replace `STORAGEACCOUNTNAME` with the name of your storage account. Copy to the IP address of your storage account to a text editor for later use. To get the IP address of your local host, type `ipconfig` on the Windows command prompt, or `ifconfig` on the Linux terminal. 

To add a static route for a destination host, type the following command on a Windows command prompt or Linux terminal. 


# [Linux](#tab/linux)

  route add <destination_ip> gw <gateway_ip>

# [Windows](#tab/windows)

  route add <destination_ip> <gateway_ip>

---
 
Replace  `<destination_ip>` with your storage account IP address, and `<gateway_ip>` with your local host IP address. To resume the application, press **any key**.

Once the application starts running again, the requests to the primary endpoint begin to fail. The application attempts to reconnect to the primary endpoint 5 times. After the failure threshold of five attempts, it requests the image from the secondary read-only endpoint. After the application successfully retrieves the image 20 times from the secondary endpoint, the application attempts to connect to the primary endpoint. If the primary endpoint is still unreachable, the application resumes reading from the secondary endpoint. This pattern is the [Circuit Breaker](/azure/architecture/patterns/circuit-breaker.md) pattern described in the previous tutorial.

### Simulate primary endpoint restoration

To simulate the primary endpoint functioning again, delete the static route of the primary endpoint from the routing table. This allows all requests to the primary endpoint to be routed through the default gateway. 

To delete the static route of a destination host, the storage account, type the following command on a Windows command prompt or linux terminal. 
 
# [Linux](#tab/linux)

route del <destination_ip> gw <gateway_ip>

# [Windows](#tab/windows)

route delete <destination_ip>

---

Press **any key** to resume the application. The application continues reading from the primary endpoint until it hits 999 reads.

![Resume application](media/storage-simulate-failure-ragrs-account-app/figure4.png)


## Next steps

In part two of the series, you learned about simulating a failure to test read access geo-redundant storage, such as how to:

> [!div class="checklist"]
> * Run and pause the application
> * Simulate a failure with [fiddler](#simulate-a-failure-with-fiddler) or [an invalid static route](#simulate-a-failure-with-an-invalid-static-route) 
> * Simulate primary endpoint restoration

Read the following article to learn more about how RA-GRS storage works (and its associated risks).

> [!div class="nextstepaction"]
> [Designing HA apps with RA-GRS](../common/storage-designing-ha-apps-with-ragrs.md)

[previous-tutorial]: storage-create-geo-redundant-storage.md