---
title: 
description: 
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 02/16/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: 
ms.reviewer: 

ms.collection: M365-identity-device-management
---
# Conditional Access: Token binding (preview)

Token binding attempts to reduce attacks using token theft by ensuring a token is usable only from the intended device. When an attacker is able to steal a token, by hijacking or replay, they can impersonate their victim. Token theft is thought to be a relatively rare event, but the damage from it can be significant. Token binding creates a cryptographically secure tie between the token and the device (client secret) it was issued to. Without the client secret, the bound token can't be used. 

When a user registers a Windows 10 device in Azure AD, their primary identity is bound to the device. This means that any issued sign-in token is tied to the device and cannot be stolen or replayed. These sign-in tokens are specifically the session cookies in Edge and most Microsoft product refresh tokens. 

The preview allows organizations to create a Conditional Access policy to require token binding for sign-in tokens. 

With this preview, we are giving you the ability to create a Conditional Access policy to require token binding for sign-in tokens for specific services. We support token binding for sign-in tokens in Conditional Access for Exchange online and SharePoint 




<!--- With the token binding in Conditional Access private preview, we are giving you the ability to create a Conditional Access policy to require token binding for sign-in tokens. Enabling such a policy means Azure AD will no longerissue an unbound session cookie. For phase 1, requiring token binding for sign-in tokens in Conditional Access is only supported for Office 365and web applications using Edge or Chrome + extension. For phase 2,we will also support Office 365 native clients. Enabling a policy that includes web applicationsbeing accessed onother browsers than Edge or Chrome + Windows 10 account extension,may cause users to not be able to authenticate to those applications. --->