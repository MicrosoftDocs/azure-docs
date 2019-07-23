---
title: Notification Hubs Security
description: This topic explains security for Azure notification hubs.
services: notification-hubs
documentationcenter: .net
author: jwargo
manager: patniko
editor: spelluru

ms.assetid: 6506177c-e25c-4af7-8508-a3ddca9dc07c
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: mobile-multiple
ms.devlang: multiple
ms.topic: article
ms.date: 05/31/2019
ms.author: jowargo
---

# Notification Hubs Security

## Overview

This topic describes the security model of Azure Notification Hubs.

## Shared Access Signature Security (SAS)

Notification Hubs implements an entity-level security scheme called SAS (Shared Access Signature). This scheme enables messaging entities to declare up to 12 authorization rules in their description that grant rights on that entity.

Each rule contains a name, a key value (shared secret), and a set of rights, as explained in [Security Claims](#security-claims). When creating a Notification Hub, two rules are automatically created: one with **Listen** rights (that the client app uses) and one with **all** rights (that the app backend uses).

When performing registration management from client apps, if the information sent via notifications is not sensitive (for example, weather updates), a common way to access a Notification Hub is to give the key value of the rule Listen-only access to the client app, and to give the key value of the rule full access to the app backend.

Apps should not embed the key value in Windows Store client apps, instead have the client app retrieve it from the app backend at startup.

The key with **Listen** access allows a client app to register for any tag. If your app must restrict registrations to specific tags to specific clients (for example, when tags represent user IDs), your app backend must perform the registrations. For more information, see [Registration Management](notification-hubs-push-notification-registration-management.md). Note that in this way, the client app will not have direct access to Notification Hubs.

## Security claims

Similar to other entities, Notification Hub operations are allowed for three security claims: **Listen**, **Send**, and **Manage**.

| Claim   | Description                                          | Operations allowed |
| ------- | ---------------------------------------------------- | ------------------ |
| Listen  | Create/Update, Read, and Delete single registrations | Create/Update registration<br><br>Read registration<br><br>Read all registrations for a handle<br><br>Delete registration |
| Send    | Send messages to the notification hub                | Send message |
| Manage  | CRUDs on Notification Hubs (including updating PNS credentials, and security keys), and read registrations based on tags |Create/Update/Read/Delete notification hubs<br><br>Read registrations by tag |

Notification Hubs accepts signature tokens generated with shared keys configured directly on the Notification Hub.

It is not possible to send a notification to more than one namespace. Namespaces are logical container for notification hubs and are not involved with sending notifications.
The namespace-level access policies (credentials) can be used for namespace-level operations, for example: listing notification hubs, creating or deleting notification hubs, etc. Only the hub-level access policies would let you send notifications.
