---
title: include file
description: include file 
services: cognitive-services
author: diberry
manager: cjgronlund
ms.service: cognitive-services
ms.component: luis
ms.topic: include
ms.custom: include file
ms.date: 08/06/2018
ms.author: diberry
--- 

In order to receive a LUIS prediction in a chat bot or other client application, you need to publish the app to the endpoint. 

You do not have to create a LUIS endpoint key in the Azure portal before you publish or before you test the endpoint URL. Every LUIS user account has a free starter key for authoring. This key gives you unlimited authoring and a few endpoint hits. 

1. Select **Publish** in the top right navigation.

    ![LUIS publish to endpoint button in top right menu](./media/cognitive-services-luis/publish-button.png)

2. Select the Production slot and the **Publish** button.

    ![LUIS publish to endpoint](./media/cognitive-services-luis/publish-this-app-popup.png)

3. Publishing is complete when you see the green status bar at the top of the website confirming success.

    ![LUIS publish to endpoint](./media/cognitive-services-luis/publish-to-endpoint-success.png)

4. Select the **endpoints** link in the green status bar to go to the **Keys and endpoints** page. The endpoint URLs are listed at the bottom.