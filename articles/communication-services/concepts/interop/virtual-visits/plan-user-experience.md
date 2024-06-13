---
title: Plan user experience for virtual appointments
titleSuffix: An Azure Communication Services concept document
description: Plan the user experience for virtual appointments with Azure Communication Services and Microsoft Teams.
author: tomaschladek
ms.author: tchladek
ms.date: 4/3/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Plan user experience
You can configure Microsoft Teams tenant to allow Azure Communication Services users to join Teams meetings scheduled by the organization. In this article, you learn how to optimize the user experience when connecting Azure Communication Services. Microsoft Teams users might have available actions that aren't supported by the application. The lack of support in Communication Services or implementation in the application can cause inconsistency in feature parity. For those cases, we provide best practices for improving the experience of virtual appointments. 

## Default user experience
The Teams user that schedules a Teams meeting defines the default experience of the Teams meeting. The Teams user interface shows all available features based on the configuration of the organizer. You can learn the configuration via Teams Admin Center or PowerShell. This information can then be used to customize the experience of the application powered by Azure Communication Services. On the other hand, features not supported by the application can be disabled by Teams policy, meeting template, sensitivity label, or meeting options. Combining these two principles allows you to provide the best user experience for all participants.

How to improve the user experience:
1. Learn the default configuration of the organizer in the tenant.
1. Adjust custom applications based on the configuration.
1. List supported features in your application.
1. Adjust Teams tenant configurations, tenant policy, meeting templates, sensitivity labels, and meeting options based on the supported list.

You can learn more about Microsoft Teams controls [here](../guest/teams-administration.md).

## Role assignment changes 
Organizers, coorganizers, and presenters can promote and demote participants during the meeting. This role change can lead to the loss or gain of new functionality. Developers can subscribe to the `roleChanged` event of the `Call` object to update the user interface based on the role. Developers can find an assigned role in the property `role` of the object `Call`. You can learn more details [here](./../../../how-tos/calling-sdk/manage-role-assignment.md). You can find available actions for individual roles [here](https://support.microsoft.com/office/roles-in-a-teams-meeting-c16fa7d0-1666-4dde-8686-0a0bfe16e019).

## Teams meeting option changes
The meeting organizer can change Teams meeting options before and during the meeting. Developers can read meeting options before the meeting starts with [Graph API for `onlineMeeting` resource](/graph/api/onlinemeeting-get). As developers currently don't have a way to read changes during the meeting, we recommend limiting the changes during the meeting to ensure the best user experience.

## Next steps
- [Read about onlineMeeting Graph API](/graph/api/onlinemeeting-get)
- [Learn about Teams controls](../guest/teams-administration.md).
- [Govern user experience in Teams meetings](./govern-meeting-experience.md)
