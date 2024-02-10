---
title: Go - Create Graph API subscription to subscribe to Microsoft Graph API events using Event Grid partner topics as a notification destination.
description: This article provides a sample Golang code that shows how to create a Microsoft Graph API subscription to receive events via Azure Event Grid partner topics.
ms.devlang: golang
ms.topic: sample
ms.date: 12/08/2023
---
```go
import (
	  "context"
	  "time"
	  msgraphsdk "github.com/microsoftgraph/msgraph-sdk-go"
	  graphmodels "github.com/microsoftgraph/msgraph-sdk-go/models"
	  //other-imports
)

graphClient := msgraphsdk.NewGraphServiceClientWithCredentials(cred, scopes)


requestBody := graphmodels.NewSubscription()
changeType := "updated,deleted,created"
requestBody.SetChangeType(&changeType) 
notificationUrl := "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic"
requestBody.SetNotificationUrl(&notificationUrl)
lifecycleNotificationUrl := "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic"
requestBody.SetLifecycleNotificationUrl(&lifecycleNotificationUrl)
resource := "users"
requestBody.SetResource(&resource) 
expirationDateTime , err := time.Parse(time.RFC3339, "2024-03-31T18:23:45.9356913Z")
requestBody.SetExpirationDateTime(&expirationDateTime) 
clientState := "secretClientValue"
requestBody.SetClientState(&clientState) 

subscriptions, err := graphClient.Subscriptions().Post(context.Background(), requestBody, nil)
```
