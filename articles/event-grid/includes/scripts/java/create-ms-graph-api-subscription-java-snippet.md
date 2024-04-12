---
title: Java - Create Graph API subscription to subscribe to Microsoft Graph API events using Event Grid partner topics as a notification destination.
description: This article provides a sample Java code that shows how to create a Microsoft Graph API subscription to receive events via Azure Event Grid partner topics.
ms.devlang: java
ms.topic: sample
ms.date: 12/08/2023
---

```java
GraphServiceClient graphClient = GraphServiceClient.builder().authenticationProvider( authProvider ).buildClient();

Subscription subscription = new Subscription();
subscription.changeType = "updated,deleted,created";
subscription.notificationUrl = "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic";
subscription.lifecycleNotificationUrl = "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic";
subscription.resource = "users";
subscription.expirationDateTime = OffsetDateTimeSerializer.deserialize("2024-03-31T18:23:45.9356913Z");
subscription.clientState = "secretClientValue";

graphClient.subscriptions()
	.buildRequest()
	.post(subscription);

```
