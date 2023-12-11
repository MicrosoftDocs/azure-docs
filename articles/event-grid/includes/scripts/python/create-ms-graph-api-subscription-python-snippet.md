---
title: Python - Create Graph API subscription to subscribe to Microsoft Graph API events using Event Grid partner topics as a notification destination.
description: This article provides a sample Python code that shows how to create a Microsoft Graph API subscription to receive events via Azure Event Grid partner topics.
ms.devlang: python
ms.topic: sample
ms.date: 12/08/2023
---

```python
graph_client = GraphServiceClient(credentials, scopes)

request_body = Subscription(
	change_type = "updated,deleted,created",
	notification_url = "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic",
    lifecycle_notification_url = "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic",
	resource = "users",
	expiration_date_time = "2024-03-31T18:23:45.9356913Z",
	client_state = "secretClientValue"
)

result = await graph_client.subscriptions.post(request_body)
```
