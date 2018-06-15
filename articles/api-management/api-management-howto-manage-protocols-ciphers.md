---
title: Manage protocols and ciphers in API Management | Microsoft Docs
description: Learn how to manage protocols (TLS, SSL) and ciphers (DES) in API Management.
services: api-management
documentationcenter: ''
author: mikebudzynski
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/15/2018
ms.author: apimpm
---

# Manage protocols and ciphers in API Management

Azure API Management supports multiple versions of TLS protocol for both client and backend sides as well as the 3DES cipher.

This guide shows you how to manage protocols and ciphers configuration for an Azure API Management instance.

![Manage protocols and ciphers in APIM](./media/api-management-howto-manage-protocols-ciphers/api-management-protocols-ciphers.png)

## Prerequisites

To follow the steps in this article, you must have:

* An API Management instance

## How to manage TLS protocols and 3DES cipher

1. Navigate to your **API Management instance** in the Azure portal.
2. Select **SSL** from the menu.
3. Enable or disable desired protocols or ciphers.
4. Click **Save**. Changes will be applied within an hour.
