---
title: PowerShell - Create Graph API subscription to subscribe to Microsoft Graph API events using Event Grid partner topics as a notification destination.
description: This article provides a sample Azure PowerShell script that shows how to create a Microsoft Graph API subscription to receive events via Azure Event Grid partner topics.
ms.devlang: powershell
ms.custom: devx-track-azurepowershell
ms.topic: sample
ms.date: 12/08/2023
---

```azurepowershell
Import-Module Microsoft.Graph.ChangeNotifications

$params = @{
	changeType = "updated,deleted,created"
	notificationUrl = "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic"
	lifecycleNotificationUrl = "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic"
	resource = "users"
	expirationDateTime = [System.DateTime]::Parse("2024-03-31T18:23:45.9356913Z")
	clientState = "secretClientValue"
}

New-MgSubscription -BodyParameter $params

```
