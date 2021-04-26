---
title: Increase resilience of authentication and authorization applications you develop
titleSuffix: Microsoft identity platform
description: Overview of our resilience guidance for application development using Azure Active Directory and the Microsoft identity platform
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals 
ms.workload: identity
ms.topic: how-to
author: knicholasa
ms.author: nichola
manager: martinco
ms.date: 11/23/2020
---

# Increase resilience of authentication and authorization applications you develop

Microsoft Identity uses modern, token-based authentication and authorization. This means that a client application acquires tokens from an Identity provider to authenticate the user and to authorize the application to call protected APIs. A service will validate tokens.

A token is valid for a certain length of time before the app must acquire a new one. Rarely, a call to retrieve a token could fail due to an issue like network or infrastructure failure or authentication service outage. In this document, we outline steps a developer can take to increase resilience in their applications if a token acquisition failure occurs.

These articles provide guidance on increasing resiliency in apps using the Microsoft identity platform and Azure Active Directory. There is guidance for both for client and service applications that work on behalf of a signed in user as well as daemon applications that work on their own behalf. They contain best practices for using tokens as well as calling resources.

- [Build resilience into applications that sign-in users](resilience-client-app.md)
- [Build resilience into applications without users](resilience-daemon-app.md)
- [Build resilience in your identity and access management infrastructure](resilience-in-infrastructure.md)
- [Build resilience in your CIAM systems](resilience-b2c.md)
- [Build services that are resilent to metadata refresh](../develop/howto-build-services-resilent-to-metadata-refresh.md)
