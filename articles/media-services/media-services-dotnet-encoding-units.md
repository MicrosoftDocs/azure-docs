<properties 
	pageTitle="How to add encoding units" 
	description="Learn how to how to add encoding units with .NET"  
	services="media-services" 
	documentationCenter="" 
	authors="juliako" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
 	ms.date="08/26/2016"
	ms.author="juliako;milangada;gtrifonov"/>


#How to Scale Encoding with .NET SDK


> [AZURE.SELECTOR]
- [Portal](media-services-portal-encoding-units.md)
- [.NET](media-services-dotnet-encoding-units.md)
- [REST](https://msdn.microsoft.com/library/azure/dn859236.aspx)
- [Java](https://github.com/southworkscom/azure-sdk-for-media-services-java-samples)
- [PHP](https://github.com/Azure/azure-sdk-for-php/tree/master/examples/MediaServices)

##Overview

A Media Services account is associated with a Reserved Unit Type which determines the speed with which your encoding jobs are processed. You can pick between the following reserved unit types: S1, S2, or S3. For example, the same encoding job runs faster when you use the Standard reserved unit type compare to the Basic type. For more information, see the "Encoding Reserved Unit Types" blog written by [Milan Gada](https://azure.microsoft.com/blog/high-speed-encoding-with-azure-media-services/).

In addition to specifying the reserved unit type, you can specify to provision your account with encoding reserved units. The number of provisioned encoding reserved units determines the number of media tasks that can be processed concurrently in a given account. For example, if your account has 5 reserved units, then 5 media tasks will be running concurrently as long as there are tasks to be processed. The remaining tasks will wait in the queue and will get picked up for processing sequentially as soon as a running task finishes. If an account does not have any reserved units provisioned, then tasks will be picked up sequentially. In this case, the wait time between one task finishing and the next one starting will depend on the availability of resources in the system.

To change the reserved unit type and the number of encoding reserved units using .NET SDK, do the following:

	IEncodingReservedUnit encodingS1ReservedUnit = _context.EncodingReservedUnits.FirstOrDefault();
	encodingS1ReservedUnit.ReservedUnitType = ReservedUnitType.Basic; // Corresponds to S1
	encodingS1ReservedUnit.Update();
	Console.WriteLine("Reserved Unit Type: {0}", encodingS1ReservedUnit.ReservedUnitType);
	
	encodingS1ReservedUnit.CurrentReservedUnits = 2;
	encodingS1ReservedUnit.Update();
	
	Console.WriteLine("Number of reserved units: {0}", encodingS1ReservedUnit.CurrentReservedUnits);

##Opening a Support Ticket

By default every Media Services account can scale to up to 25 Encoding and 5 On-Demand Streaming Reserved Units. You can request a higher limit by opening a support ticket.

###Open a support ticket

To open a support ticket do the following:

1. Click [Get Support](https://manage.windowsazure.com/?getsupport=true). If you are not logged in, you will be prompted to enter your credentials.

1. Select your subscription.

1. Under support type, select "Technical".

1. Click on "Create Ticket".

1. Select "Azure Media Services" in the product list presented on the next page.

1. Select a "Problem type" that is appropriate for your issue.

1. Click Continue.

1. Follow instructions on next page and then enter details about your issue.

1. Click submit to open the ticket.



##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]
