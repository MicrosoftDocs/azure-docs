---
title: Microsoft Entra API permissions for communication as Teams user
titleSuffix: An Azure Communication Services concept document
description: This article describes Microsoft Entra API permissions for communication as a Teams user with Azure Communication Services.
author: tomaschladek
manager: chpalmer
services: azure-communication-services

ms.author: tchladek
ms.date: 08/01/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.custom: sfi-ga-nochange
---
# Microsoft Entra permissions for communication as Teams user
In this article, you will learn about Microsoft Entra permissions available for communication as a Teams user in Azure Communication Services. Microsoft Entra application for Azure Communication Services provides delegated permissions for chat and calling. Both permissions are required to exchange Microsoft Entra access token for Communication Services access token for Teams users.

## Delegated permissions

|   Permission    |  Display string   |  Description | Admin consent required | Microsoft account supported |
|:--- |:--- |:--- |:--- |:--- |
| _`https://auth.msft.communication.azure.com/Teams.ManageCalls`_ | Manage calls in Teams | Start, join, forward, transfer, or leave Teams calls and update call properties. | No | No |
| _`https://auth.msft.communication.azure.com/Teams.ManageChats`_ | Manage chats in Teams | Create, read, update, and delete 1:1 or group chat threads on behalf of the signed-in user. Read, send, update, and delete messages in chat threads on behalf of the signed-in user. | No | No |

## Application permissions

None.

## Roles for granting consent on behalf of a company

- Global admin
- Application admin
- Cloud application admin

Find more details in [Microsoft Entra documentation](/entra/identity/role-based-access-control/permissions-reference).
