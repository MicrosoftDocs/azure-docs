---
title: Csharp - Create Graph API subscription to subscribe to Microsoft Graph API events using Event Grid partner topics as a notification destination.
description: This article provides a sample C# code that shows how to create a Microsoft Graph API subscription to receive events via Azure Event Grid partner topics.
ms.devlang: csharp
ms.topic: sample
ms.date: 12/08/2023
---

```csharp
// Code snippets are only available for the latest version. Current version is 5.x

// Dependencies
using Microsoft.Graph.Models;

var requestBody = new Subscription
{
	ChangeType = "updated,deleted,created",
	NotificationUrl = "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=youPartnerTopic&location=theNameOfAzureRegionFortheTopic",
    LifecycleNotificationUrl = "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic",
	Resource = "users",
	ExpirationDateTime = DateTimeOffset.Parse("2024-03-31T18:23:45.9356913Z"),
	ClientState = "secretClientValue",
};

// To initialize your graphClient, see `https://learn.microsoft.com/graph/sdks/create-client?from=snippets&tabs=csharp`
var result = await graphClient.Subscriptions.PostAsync(requestBody);
```
