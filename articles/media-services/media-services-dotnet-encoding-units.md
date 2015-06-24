<properties 
	pageTitle="How to add encoding units" 
	description="Learn how to how to add encoding units with .NET"  
	services="media-services" 
	documentationCenter="" 
	authors="juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/24/2015" 
	ms.author="juliako"/>




#How to Scale Encoding with .NET SDK

This article is part of the [Media Services Video on Demand workflow](media-services-video-on-demand-workflow.md) series.
  
##Overview

A Media Services account is associated with a Reserved Unit Type which determines the speed with which your encoding jobs are processed. You can pick between the following reserved unit types: Basic, Standard, or Premium. For example, the same encoding job runs faster when you use the Standard reserved unit type compare to the Basic type. For more information, see the "Encoding Reserved Unit Types" blog written by [Milan Gada](http://azure.microsoft.com/blog/author/milanga/).

In addition to specifying the reserved unit type, you can specify to provision your account with encoding reserved units. The number of provisioned encoding reserved units determines the number of media tasks that can be processed concurrently in a given account. For example, if your account has 5 reserved units, then 5 media tasks will be running concurrently as long as there are tasks to be processed. The remaining tasks will wait in the queue and will get picked up for processing sequentially as soon as a running task finishes. If an account does not have any reserved units provisioned, then tasks will be picked up sequentially. In this case, the wait time between one task finishing and the next one starting will depend on the availability of resources in the system.

To change the reserved unit type and the number of encoding reserved units using .NET SDK, do the following:

	IEncodingReservedUnit encodingBasicReservedUnit = _context.EncodingReservedUnits.FirstOrDefault();
	encodingBasicReservedUnit.ReservedUnitType = ReservedUnitType.Basic;
	encodingBasicReservedUnit.Update();
	Console.WriteLine("Reserved Unit Type: {0}", encodingBasicReservedUnit.ReservedUnitType);
	
	encodingBasicReservedUnit.CurrentReservedUnits = 2;
	encodingBasicReservedUnit.Update();
	
	Console.WriteLine("Number of reserved units: {0}", encodingBasicReservedUnit.CurrentReservedUnits);

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
 

 