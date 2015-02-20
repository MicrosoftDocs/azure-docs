<properties 
	pageTitle="How to Scale a media service" 
	description="Learn how to scale Media Services by specifying the number of On-Demand Streaming Reserved Units and Encoding Reserved Units that you would like your account to be provisioned with." 
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
	ms.date="02/15/2015" 
	ms.author="juliako"/>


#How to Scale a Media Service  

This article is part of the [Media Services Video on Demand workflow](../media-services-video-on-demand-workflow) series.

##Overview

You can scale Media Services by specifying the number of **Streaming Reserved Units** and **Encoding Reserved Units** that you would like your account to be provisioned with. 

##Streaming Reserved Units

For more information, see [Scaling streaming units](../media-services-manage-origins#scale_streaming_endpoints).

##<a id="encoding_reserved_units"></a>Encoding Reserved Units

A Media Services account is associated with a Reserved Unit Type which determines the speed with which your encoding jobs are processed. You can pick between the following reserved unit types: Basic, Standard, or Premium. For example, the same encoding job runs faster when you use the Standard reserved unit type compare to the Basic type. For more information, see the "Encoding Reserved Unit Types" blog written by [Milan Gada](http://azure.microsoft.com/blog/author/milanga).

In addition to specifying the reserved unit type, you can specify to provision your account with encoding reserved units. The number of provisioned encoding reserved units determines the number of media tasks that can be processed concurrently in a given account. For example, if your account has 5 reserved units, then 5 media tasks will be running concurrently as long as there are tasks to be processed. The remaining tasks will wait in the queue and will get picked up for processing sequentially as soon as a running task finishes. If an account does not have any reserved units provisioned, then tasks will be picked up sequentially. In this case, the wait time between one task finishing and the next one starting will depend on the availability of resources in the system.

To change the reserved unit type and the number of encoding reserved units, do the following:

1. In the [Management Portal](https://manage.windowsazure.com/), click **Media Services**. Then, click the name of the media service.

2. Select the **ENCODING** page. 

	To change the **RESERVED UNIT TYPE**, press BASIC, STANDARD, or PREMIUM. 

	To change the number of reserved units for the selected reserved unit type, use the **ENCODING** slider. 
	
	
	![Processors page](./media/media-services-how-to-scale/media-services-encoding-scale.png)

	  
	>[Azure.Note] The following data centers do not offer the Premium reserved unit type: Singapore, Hong Kong, Osaka, Beijing, Shanghai.

3. Press the SAVE button to save your changes.

	The new encoding reserved units are allocated as soon as you press SAVE.

	>[Azure.Note] The highest number of units specified for the 24-hour period is used in calculating the cost.

##Opening a Support Ticket

By default every Media Services account can scale to up to 25 Encoding and 5 On-Demand Streaming Reserved Units. You can request a higher limit by opening a support ticket.

To open a support ticket do the following: 

1. Log in to your Azure account at [Management Portal](http://manage.windowsazure.com).
2. Go to [Support](http://www.windowsazure.com/en-us/support/contact/).
3. Click on "Get Support".
4. Select your subscription.
5. Under support type select "Technical".
6. Click on "Create Ticket".
7. Select "Azure Media Services" in the product list presented on the next page.
8. Select "Media Processing" as "Problem type" and then select "Reservation Units" under category.
9. Click Continue.
10. Follow instructions on next page and then enter details about how many Encoding or On-Demand Streaming reserved units you need.
11. Click submit to open the ticket.




