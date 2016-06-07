<properties 
	pageTitle="Learn about Throttling in BizTalk Services | Microsoft Azure" 
	description="Learn about throttling thresholds and resulting runtime behaviors for BizTalk Services. Throttling is based on memory usage and number of messages. MABS, WABS" 
	services="biztalk-services" 
	documentationCenter="" 
	authors="MandiOhlinger" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="biztalk-services" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/16/2016" 
	ms.author="mandia"/>





# BizTalk Services: Throttling

Azure BizTalk Services implements service throttling based on two conditions: memory usage and the number of simultaneous messages processing. This topic lists the throttling thresholds and describes the Runtime behavior when a throttling condition occurs.

## Throttling Thresholds

The following table lists the throttling source and thresholds:

||Description|Low Threshold|High Threshold|
|---|---|---|---|
|Memory|% of total system memory available/PageFileBytes. <p><p>Total available PageFileBytes is approximately 2 times the RAM of the system.|60%|70%|
|Message Processing|Number of messages processing simultaneously|40 * number of cores|100 * number of cores|

When a high threshold is reached, Azure BizTalk Services starts to throttle. Throttling stops when the low threshold is reached. For example, your service is using 65% system memory. In this situation, the service does not throttle. Your service starts using 70% system memory. In this situation, the service throttles and continues to throttle until the service uses 60% (low threshold) system memory.

Azure BizTalk Services tracks the throttling status (normal state vs. throttled state) and the throttling duration.


## Runtime Behavior

When Azure BizTalk Services enters a throttling state, the following occurs:

- Throttling is per role instance. For example:<br/>
RoleInstanceA is throttling. RoleInstanceB is not throttling. In this situation, messages in RoleInstanceB are processed as expected. Messages in RoleInstanceA are discarded and fail with the following error:<br/><br/>
**Server is busy. Please try again.**<br/><br/>
- Any pull sources do not poll or download a message. For example:<br/>
A pipeline pulls messages from an external FTP source. The role instance doing the pull gets into a throttling state. In this situation, the pipeline stops downloading additional messages until the role instance stops throttling.
- A response is sent to the client so the client can resubmit the message.
- You must wait until the throttling is resolved. Specifically, you must wait until the low threshold is reached.

## Important notes
- Throttling cannot be disabled.
- Throttling thresholds cannot be modified.
- Throttling is implemented system-wide.
- The Azure SQL Database Server also has built-in throttling.

## Additional Azure BizTalk Services topics

-  [Installing the Azure BizTalk Services SDK](http://go.microsoft.com/fwlink/p/?LinkID=241589)<br/>
-  [Tutorials: Azure BizTalk Services](http://go.microsoft.com/fwlink/p/?LinkID=236944)<br/>
-  [How do I Start Using the Azure BizTalk Services SDK](http://go.microsoft.com/fwlink/p/?LinkID=302335)<br/>
-  [Azure BizTalk Services](http://go.microsoft.com/fwlink/p/?LinkID=303664)<br/>

## See Also
- [BizTalk Services: Developer, Basic, Standard and Premium Editions Chart](http://go.microsoft.com/fwlink/p/?LinkID=302279)<br/>
- [BizTalk Services: Provisioning Using Azure classic portal](http://go.microsoft.com/fwlink/p/?LinkID=302280)<br/>
- [BizTalk Services: Provisioning Status Chart](http://go.microsoft.com/fwlink/p/?LinkID=329870)<br/>
- [BizTalk Services: Dashboard, Monitor and Scale tabs](http://go.microsoft.com/fwlink/p/?LinkID=302281)<br/>
- [BizTalk Services: Backup and Restore](http://go.microsoft.com/fwlink/p/?LinkID=329873)<br/>
- [BizTalk Services: Issuer Name and Issuer Key](http://go.microsoft.com/fwlink/p/?LinkID=303941)<br/>
 
