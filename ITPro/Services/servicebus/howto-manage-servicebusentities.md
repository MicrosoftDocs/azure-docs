<properties linkid="service-bus-manage-messaging-entitites" urlDisplayName="Traffic Manager" pageTitle="Manage Service Bus Messaging Entities - Windows Azure" metaKeywords="" metaDescription="Learn how to create and manage your Service Bus entities using the Windows Azure Management Portal." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/service-bus-left-nav.md" />

# How to Manage Service Bus Messaging Entities

This topic describes how to create and manage your Service Bus entities using the [Windows Azure Management Portal](http://manage.windowsazure.com). You can use the portal to create new service namespaces or messaging entities (queues, topics, or subscriptions). You can also delete entities, or change the status of entities. 

To use this feature and other new Windows Azure capabilities, sign up for the [free preview](https://account.windowsazure.com/PreviewFeatures).

##Table of Contents##

* [How To: Create a Service Bus Entity](#create)
* [How To: Delete a Service Bus Entity](#delete)
* [How To: Disable or Enable a Service Bus Entity](#disableenable)
* [Additional Resources](#seealso)

<h2><a id="create"></a>How To: Create a Service Bus Entity</h2>

The Windows Azure Management Portal supports two ways to create a Service Bus entity: *Quick Create* or *Custom Create*.

###Quick Create###

Quick Create enables you to create to create a Service Bus queue, topic, or relay service namespace in one easy step. Follow these steps to create a Service Bus entity.

1.	Log on to the [Windows Azure (Preview) Management Portal](http://manage.windowsazure.com).
2.	Click the **New** icon at the bottom left of the management portal.
3.	Click the **App Services** icon, and then click **Service Bus Queue** (topic or relay). Click **Quick Create**, and enter the queue name, region, and Windows Azure subscription id.

	a.	If this is your first namespace in the selected region, the portal suggests a namespace queue ; [your entity name]-ns. You can change this value.

	b.	If you already have at least one service namespace in this region, a namespace is selected automatically. You can change that selected namespace.

4.	Click the check mark next to **create a new queue** (or topic).
5.	When the queue or topic has been created, you will see the message **Creation of Queue ‘[Queue Name]’ Completed**.

	a. If you don’t have any namespaces in this region or in this Windows Azure subscription, a new namespace is auto-created for you. In such case, you will receive two success messages: one for the namespace creation and the other one for the entity creation.

	![][1]

Click the **Service Bus** icon on the left navigation bar to get a list of namespaces. You will find the new namespace you just created. Click the namespace in the list. You will see the entity you just created under that namespace.

**Note** You may not see the namespace listed immediately. It takes a few seconds to create the service namespace and update portal interface. 

**Note** Using **Quick Create** for a relay does not create a new relay endpoint. It only creates a namespace under which you can programmatically create relay endpoint. For more details, see the [Service Bus documentation](http://www.windowsazure.com/en-us/develop/net/how-to-guides/service-bus-relay/).

###Custom Create###

**Custom Create** is the more detailed version that gives you knobs to change the default values of the properties of the entity (queue or topic) being created. To create a topic or entity using **Custom Create**, follow these steps: 

1.	Log on to the [Windows Azure (Preview) Management Portal](http://manage.windowsazure.com).
2.	Click **New** at the bottom left of the management portal.
3.	Click the **App Services** icon, and then click **Service Bus Queue** (topic or relay). Then click Custom Create.
4.	In the first dialog screen, enter the queue name, region, and Windows Azure subscription id.

	a.	If this is your first service namespace in the selected region, the portal suggests a namespace queue ; [your entity name]-ns. You can change this value.

	b.	If you already have at least one namespace in this region, a namespace is selected automatically. You can change that selected namespace.

5. Click **Next **to insert the remaining properties. 

	![][2]
	
6. Click the check mark to create the queue. 

	![][3]

Click the **Service Bus** icon on the left navigation bar to get the list of service namespaces. You will find the new namespace you just created. Click the namespace in the list. You will see the entity you just created under that namespace.

<h2><a id="delete"></a>How To: Delete a Service Bus Entity</h2>

Using the portal, you can delete a Service Bus messaging entity. This is applicable to queues, topics, and topic subscriptions. To delete a queue or topic, do the following:

1. Navigate to the service namespace list view and click the namespace under which you created the entity (queue or topic).
2. Click the **Delete** icon at the bottom of the page and confirm the delete operation.

	![][4]

**Note** Entity deletion is not recoverable. Once it is deleted, you cannot recover it. However, you can create another entity with same name.

To delete a topic subscription, do the following:

1.	Navigate to the namespaces list view and click the namespace under which you created the topic.
2.	Click the topic under which you created the subscription.
3.	Click the **Subscriptions** tab and select the subscription you want to delete.
4.	Click **Delete** icon at the bottom of the page and confirm the delete operation.

<h2><a id="disableenable"></a>How To: Disable or Enable a Service Bus Entity</h2>

You can use the portal to change the status of a Service Bus entity. This is applicable to queues and topics. To disable or enable a queue or topic, do the following:

1. Navigate to the service namespace list view and click the namespace under which you created the entity (queue or topic).
2. Click **Disable** (or **Enable**) at the bottom of the page.

	![][5]	

<h2><a id="seealso"></a>Additional Resources</h2>


[Windows Azure Service Bus][]

[.NET Developer Center][] on the Windows Azure web site

[Creating Applications that Use Service Bus Topics and Subscriptions][]

[Queues, Topics, and Subscriptions][]

[Windows Azure Service Bus]: http://go.microsoft.com/fwlink/?LinkId=266834
[.NET Developer Center]: http://go.microsoft.com/fwlink/?LinkID=262187
[Creating Applications that Use Service Bus Topics and Subscriptions]: http://go.microsoft.com/fwlink/?LinkId=264293
[Queues, Topics, and Subscriptions]: http://go.microsoft.com/fwlink/?LinkId=264291
[1]: ../../Shared/Media/QueueQuickCreate.png
[2]: ../../Shared/Media/AddQueue1.png
[3]: ../../Shared/Media/ConfigureQueue.png
[4]: ../../Shared/Media/DeleteEntity.png
[5]: ../../Shared/Media/DisableEnable.png