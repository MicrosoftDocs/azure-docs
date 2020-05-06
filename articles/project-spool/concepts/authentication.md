---
title: Authentication and Authorization
description: Learn about the various ways an app or service can authenticate to ACS, and the levels of control that you have to gate access to various features.
author: mikben
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/18/2020
ms.topic: conceptual
ms.service: azure-project-spool

---
# Authorizing access to ACS

#Authorization Options
Every client interaction with Azure Communication services must have be authenticated and authorized, so that the service ensures that the client has the permissions required to access the data. Various options for authorizing service clients are below:


|---|Device type|Access Keys| SAS Keys| Azure Active Directory (AAD) | User Access Tokens |
|---|---|---|---|---|---|
|||*HMAC using access keys from Azure portal*|*Scoped, time-bound self signed tokens derived from access keys*|*User and trusted services from linked AAD*| *Scoped, time-bound user tokens created by trusted service*
|ARM|Trusted Service|Supported|Supported|Supported|-|
|DataPlane Configuration (Phone Numbers, Rooms)| Trusted Service |Supported|Supported|Supported|-|
|Chat| Trusted Service |Supported|Supported|Supported|-|
|SMS| Trusted Service |Supported|Supported|Supported|-|
|Calling| Low-trust Devices |-|-|-|Supported|


## Scopes for user tokens
##	Creating HMACs
## Creating user tokens
