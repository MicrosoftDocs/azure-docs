---
title: Manage your account settings in LUIS | Microsoft Docs
description: Use LUIS website to manage your account settings. 
titleSuffix: Azure
services: cognitive-services
author: v-geberr
manager: Kaiqb

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/16/2018
ms.author: v-geberr
---

# Manage your LUIS account

## Authoring key

This single, region-specific authoring key, on the **Settings** page, allows you to author all your apps from the [LUIS][LUIS] website as well as the [authoring APIs](https://aka.ms/luis-authoring-api). As a convenience, the authoring key is allowed to make a [limited](luis-boundaries.md) number of endpoint queries each month. 

![LUIS Settings page](./media/luis-how-to-account-settings/account-settings.png)

The authoring key is used for any apps you own as well as any apps you are listed as a collaborator.

## Authoring key regions
The authoring key is specific to the [authoring region](luis-reference-region.md#publishing-regions). The key does not work in a different region. 

## Reset authoring key
If your authoring key is compromised, reset the key. The key is reset on all your apps in the [LUIS] website. If you author your apps via the authoring APIs, you need to change the value of `Ocp-Apim-Subscription-Key` to the new key. 

## Delete account
See [Data storage and removal](luis-concept-data-storage.md#accounts) for information about what data is deleted when you delete your account. 

## Next steps

Learn more about your [authoring key](manage-keys.md). 

[LUIS]: luis-reference-regions.md