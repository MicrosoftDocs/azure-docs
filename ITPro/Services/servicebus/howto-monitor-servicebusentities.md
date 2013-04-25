<properties linkid="service-bus-monitor-messaging-entitites" urlDisplayName="Traffic Manager" pageTitle="Monitor Service Bus Messaging Entities - Windows Azure" metaKeywords="" metaDescription="Learn how to monitor your Service Bus entities using the Windows Azure Management Portal." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/service-bus-left-nav.md" />

# How to Monitor Service Bus Messaging Entities

This topic describes how to manage and monitor your Service Bus entities using the [Windows Azure Management Portal](http://manage.windowsazure.com). With the portal, you get a comprehensive view of the status your queues and topics. You can also monitor their usage.

## How to Monitor Activity on Service Bus Queues

To monitor a Service Bus queue, do the following:

1. Log on to the [Windows Azure (Preview) Management Portal](http://manage.windowsazure.com).
2. Click the **Service Bus** icon on the left navigation bar to get the list of service namespaces. 
3. Click the namespace that contains the queue you want to monitor. 
4. In the pivot bar at the top of the page, click **Queues**.
5. Click the name of the queue that you want to monitor. The queue dashboard appears.
6. You can see activities on queues that you have created. You can view this information over multiple time windows. The default is 1 hour, but you can click the dropdown next to the time to choose a different time window: the last 24 hours, 7 days, or the last 30 days. You can see data with a precision as low as 5-minute measurement points for the one hour window, 1 hour for the 24-hour window, and 1 day for the 7 and 30-day windows. 

For any queue, you can see charts of:

- **Incoming Messages**: number of messages queued during this time interval.
- **Outgoing Messages**: number of messages de-queued during this time interval.
- **Length**: number of messages in the entity at the end of this time interval.
- **Size**: storage space (in MB) being used by this entity at the end of this time interval.

###Quick Glance###

**Quick Glance** on the dashboard reflects the current size of the queue as **Queue Length**. It also displays other properties of the queue or topic. This information is refreshed every 10 seconds.

![][1]

## How to Monitor Activity on Service Bus Topics

To monitor a Service Bus topic, do the following:

1. Log on to the [Windows Azure (Preview) Management Portal](http://manage.windowsazure.com).
2. Click the **Service Bus** icon on the left navigation bar to get the list of service namespaces. 
3. Click the namespace that contains the topic you want to monitor. 
4. In the pivot bar at the top of the page, click **Topics**.
5. Click the name of the topic that you want to monitor. The topic dashboard appears.

A topic dashboard is similar to a queue dashboard, except for the usage metrics. Outgoing messages and length are not present in the topic dashboard, as that information would be different for each of the subscriptions for a topic. The **Monitor** tab enables you to add usage metrics (number of outgoing messages and length), per topic subscription. To add these metrics, click the **Monitor** tab. Then click **Add Metrics** at the bottom of the page, and then choose from the subscriptions under the topic.


![][2]

[1]: ../../Shared/Media/QueueDashboard.png
[2]: ../../Shared/Media/AddMetrics.png
