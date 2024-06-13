---
title: Azure logs and metrics for Teams external users
titleSuffix: An Azure Communication Services concept document
description: Azure logs and metrics emitted for Teams external users
author: tomaschladek
ms.author: tchladek
ms.date: 12/9/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Monitor logs for Teams external users

In this article, you will learn which Azure logs, Azure metrics & Teams logs are emitted for Teams external users when joining Teams meetings. Azure Communication Services user joining Teams meeting emits the following metrics: [Authentication API](../../metrics.md) and [Chat API](../../metrics.md). Communication Services resource additionally tracks the following logs: [Call Summary](../../analytics/logs/voice-and-video-logs.md) and [Call Diagnostic](../../analytics/logs/voice-and-video-logs.md) Log. Teams administrator can use [Teams Admin Center](https://aka.ms/teamsadmincenter) and [Teams Call Quality Dashboard](https://cqd.teams.microsoft.com) to review logs stored for Teams external users joining Teams meetings organized by the tenant.

## Azure logs & metrics

Authentication API metrics emit records for every operation called on the Identity SDK or API (for example, creating a user `CreateIdentity` or issue of a token `CreateToken`). Chat API metrics emit records for every chat API call made via chat SDKs or APIs (for example, creating a thread or sending a message).

Call summary and call diagnostics logs are emitted only for the following participants of the meeting:
- Organizer of the meeting if actively joined the meeting.
- Azure Communication Services users joining the meeting from the same tenant. This includes users rejected in the lobby and Azure Communication Services users from different resources but in the same tenant.
- Additional Teams users, phone users and bots joining the meeting only if the organizer and current Azure Communication Services resource are in the same tenant.

If Azure Communication Services resource and Teams meeting organizer tenants are different, then some fields of the logs are redacted. You can find more information in the call summary & diagnostics logs [documentation](../../analytics/logs/voice-and-video-logs.md). Bots indicate service logic provided during the meeting. Here is a list of frequently used bots:
- b1902c3e-b9f7-4650-9b23-5772bd429747 - Teams convenient recording

## Microsoft Teams logs
Teams administrator can see Teams external users in the overview of the meeting (section `Manage users` -> `Select user` -> `Meetings & calls` -> `Select meeting`). The summary logs can be found when selecting individual Teams external users (continue `Participant details` -> `Anonymous user`). For more details about the call legs, proceed with [Teams Call Quality Dashboard](https://cqd.teams.microsoft.com). You can learn more about the call quality dashboard [here](/microsoftteams/cqd-what-is-call-quality-dashboard).

## Next steps

- [Enable logs and metrics](../../analytics/enable-logging.md)
- [Metrics](../../metrics.md)
- [Call summary and call diagnostics](../../analytics/logs/voice-and-video-logs.md)
