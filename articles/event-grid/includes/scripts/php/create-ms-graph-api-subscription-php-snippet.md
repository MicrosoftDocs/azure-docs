---
title: PHP - Create Graph API subscription to subscribe to Microsoft Graph API events using Event Grid partner topics as a notification destination.
description: This article provides a sample PHP code that shows how to create a Microsoft Graph API subscription to receive events via Azure Event Grid partner topics.
ms.devlang: php
ms.topic: sample
ms.date: 12/08/2023
---

```php
<?php

// THIS SNIPPET IS A PREVIEW VERSION OF THE SDK. NON-PRODUCTION USE ONLY
$graphServiceClient = new GraphServiceClient($tokenRequestContext, $scopes);

$requestBody = new Subscription();
$requestBody->setChangeType('updated,deleted,created');
$requestBody->setNotificationUrl('EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic');
$requestBody->setLifecycleNotificationUrl('EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic');
$requestBody->setResource('users');
$requestBody->setExpirationDateTime(new \DateTime('2024-03-31T18:23:45.9356913Z'));
$requestBody->setClientState('secretClientValue');

$result = $graphServiceClient->subscriptions()->post($requestBody)->wait();

```
