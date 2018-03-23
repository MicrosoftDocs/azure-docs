---
title: Understand security concepts in LUIS - Azure | Microsoft Docs
description: Learn what can be secured in Language Understanding (LUIS)
services: cognitive-services
author: v-geberr
manager: kaiqb

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/23/2018
ms.author: v-geberr;
---

# Security
In order to secure the LUIS app, consider who has access to the app from the authoring APIs and the endpoint APIs.  

## Access to authoring
Access to the app from the [LUIS][LUIS] website or the [authoring APIs](https://aka.ms/luis-authoring-apis) is controlled by the owner of the app. 

The owner and all collaborators can:

|Authoring access includes|Notes|
|--|--|
|Add or remove endpoint keys||
|Exporting version||
|Export endpoint logs||
|Importing version||
|Make app public|When an app is public, anyone with an authoring or endpoint key can query the app.|
|Modify model|
|Publish|
|Review endpoint utterances for [active learning](label-suggested-utterances.md)|
|Train|

## Access to endpoint
Access to the endpoint is controlled by the Public setting of the app on the **Settings** page. A private app's endpoint query is checked for an authorized key with remaining quota hits. A public app's endpoint query is checked for remaining quota hits. 

![Set app to public](./media/luis-concept-security/set-application-as-public.png)

### Private app endpoint security
A private app's endpoint is only available to the following:

|Key and user|Explanation|
|--|--|--|
|Owner's authoring key| Up to 1000 endpoint hits|
|Collaborators' authoring keys| Up to 1000 endpoint hits|
|Endpoint keys added from **[Publish](publishapp.md)** page|Owner and collaborators can add endpoint keys|
|Other authoring or endpoint keys| no access|

The endpoint key is passed either in the querystring of the GET request or the header of the POST request. 

### Public app endpoint access
Configure the app as **public** on the **Settings** page of the app. Once an app is configured as public, any valid LUIS authoring key or LUIS endpoint key can query your app, as long as the key has not used the entire endpoint quota.

## Securing the endpoint 
You can control who can see your LUIS endpoint key by calling it in a server-to-server environment. If you are using LUIS from a bot, the connection between the bot and LUIS is already secure. If you are calling the LUIS endpoint directly, you should create a server-side API (such as an Azure [function](https://azure.microsoft.com/services/functions/)) with controlled access (such as [AAD](https://azure.microsoft.com/services/active-directory/)). When the server-side API is called and authentication and authorization are verified, pass the call on to LUIS. While this strategy doesn’t prevent man-in-the-middle attacks, it obfuscates your endpoint from your users, allows you to track access, and allows you to add endpoint response logging (such as [Application Insights](https://azure.microsoft.com/services/application-insights/)).  

## Next steps

See [Add entities](Add-entities.md) to learn more about how to add entities to your LUIS app.

[LUIS]:luis-reference-regions.md##luis-website