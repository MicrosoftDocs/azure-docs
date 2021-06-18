---
title: How to configure AAD Authentication
titleSuffix: Azure Cognitive Services
description: Learn how to authenticate using AAD Authentication
services: cognitive-services
author: rhurey
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 06/18/2021
ms.author: rhurey
zone_pivot_groups: programming-languages-set-two
ROBOTS: NOINDEX
---
# Using Azure Active Directory Authentication with the Speech SDK

When using the Speech SDK to access the Speech Service, there are three authentication methods available: Service Keys, a key-based token, and Azure Active Directory (AAD). This article describes how to configure the Speech Resource and Speech SDK to use AAD for authentication.

To successfuly use AAD authentication with the Speech SDK there are 4 basic steps:
1) Create a Speech Resource
2) Configure the Speech Resource for AAD Authentication
3) Get an AAD token
4) Call the Speech SDK

## Creating a Speech Resource
For steps on creating a Speech Resource, see [Try Speech For Free](overview#try-the-speech-service-for-free)


## Configure the Speech Resource for AAD Authentication

To configure the Speech Resource to be usable for AAD Authentication there are two steps needed:
1) Generate a Custom Domain Name
2) Assign Roles

### Generate a Custom Domain Name
[!INCLUDE [Custom Domain include](includes/how-to/custom-domain.md)]

### Assign Roles

## Get an AAD token

## Call the Speech SDK