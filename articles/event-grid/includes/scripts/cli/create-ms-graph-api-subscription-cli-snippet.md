---
title: Azure CLI - Create Graph API subscription to subscribe to Microsoft Graph API events using Event Grid partner topics as a notification destination.
description: This article provides a sample Azure CLI script that shows how to create a Microsoft Graph API subscription to receive events via Azure Event Grid partner topics.
ms.devlang: azurecli
ms.custom: devx-track-azurecli
ms.topic: sample
ms.date: 12/08/2023
---

```azurecli
mgc subscriptions create --body '{\
   "changeType": "updated,deleted,created",\
   "notificationUrl": "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=youPartnerTopic&location=theNameOfAzureRegionFortheTopic",\
   "lifecycleNotificationUrl": "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic",\
   "resource": "users",\
   "expirationDateTime":"2024-03-31T18:23:45.9356913Z",\
   "clientState": "secretClientValue"\
}\
'
```
