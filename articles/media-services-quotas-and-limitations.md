<properties pageTitle="Media Services quotas and limitation" description="This topic describes quotas and limitations associated with Microsoft Azure Media Services." services="media-services" documentationCenter="" authors="Juliako" manager="dwrede" />

<tags ms.service="media-services" ms.devlang="" ms.topic="article" ms.tgt_pltfrm="" ms.workload="media" ms.date="01/23/2015" ms.author="juliako" />

#Quotas and Limitations

This topic describes quotas and limitations associated with Microsoft Azure Media Services.

## Quotas and limitations

- The maximum number of assets allowed in your Media Services account: 1,000,000. 

- The maximum number of chained tasks per job: 30.

- The maximum number of assets allowed in a task: 50 assets per task.
 
- The maximum number of assets per job: 100.
 
- This number includes queued, finished, active, and canceled jobs. It does not include deleted jobs.
 
- The maximum number of jobs in your account should not exceed 50,000.
 
- You can delete the old jobs using **IJob.Delete** or the **DELETE** HTTP request. For more information, see [Job record limit for Azure Media Encoder](http://blogs.msdn.com/b/randomnumber/archive/2014/05/05/job-record-limit-for-windows-azure-media-encoder.aspx) and [Managing Assets](https://msdn.microsoft.com/library/azure/dn642436.aspx). 
 
- When making a request to list Job entities, a maximum of 1,000 will be returned per request. If you need to keep track of all submitted Jobs, you can use top/skip as described in [OData system query options](http://msdn.microsoft.com/library/gg309461.aspx).  


- You cannot have more than 5 unique Locators associated with a given asset at one time. 
	
	**Note**
	Locators are not designed for managing per-user access control. To give different access rights to individual users, use Digital Rights Management (DRM) solutions.

- You cannot have more than 25 Media Services accounts in a single subscription.

- Media Services throttling mechanism restricts the resource usage for applications that make excessive request to the service. The service may return the Service Unavailable (503) HTTP status code. For more information, see the description of the 503 error in the [Azure Media Services Error Codes](http://msdn.microsoft.com/library/azure/dn168949.aspx) topic.

- By default, you can add up to 5 Live channels to your Media Services account. 

	You can also start up to 5 channels at the same time. To request a higher limit, see the *How to request a higher limit for updatable quotas* section that follows.

- By default, you can add up to 50 programs (in stopped state) to a single channel. 

	You can only have up to 3 programs in running state at the same time. To request a higher limit, see the *How to request a higher limit for updatable quotas* section that follows.

- By default, every Media Services account can have up to 2 streaming endpoints (origins). 

	You can also have up to 2 streaming endpoints in running state at the same time.

	You can scale each streaming endpoint to up to 10 streaming units. To request a higher limit, see the *How to request a higher limit for updatable quotas* section that follows.


- By default, every Media Services account can scale to up to 25 encoding units. For more information, see How to Scale Media Services. To request a higher limit, see How to request a higher limit for updatable quotas.
	
	**Important**
	Do not create more Media Services accounts to increase limits, instead submit a support ticket.

##How to request a higher limit for updatable quotas

###Updatable quotas

You can request to update the limits for the following quotas by opening a support ticket.
- Encoding units

- Live channels (in stopped and running state)
 
- Streaming endpoints (in stopped and running state)
 
- Streaming units

###Open a support ticket

To open a support ticket do the following:

1. Click [Get Support](https://manage.windowsazure.com/?getsupport=true). If you are not logged in, you will be prompted to enter your credentials.

1. Select your subscription.
 
1. Under support type, select "Technical".
 
1. Click on "Create Ticket". 
 
1. Select "Azure Media Services" in the product list presented on the next page.
 
1. Select a "Problem type" that is appropriate for your issue.
 
1. Click Continue.
 
1. Follow instructions on next page and then enter details about how many Encoding or Streaming reserved units you need. 
 
1. Click submit to open the ticket.
 