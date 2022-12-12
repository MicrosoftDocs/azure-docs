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

# Monitor Logs for Teams external users

In this article, you will learn which Azure logs and metrics are emitted for Teams external users when joining Teams meetings. Azure Communication Services user joining Teams meeting emits the following metrics: [Authentication API](./../metrics#authentication-api-requests) and [Chat API](./../metrics#chat-api-request-metric-operations). Communication Services resource additionally tracks the following logs: [Call Summary](./../analytics/call-logs-azure-monitor#call-summary-log) and [Call Diagnostic](./../analytics/call-logs-azure-monitor#call-diagnostic-log) Log.

Authentication API metrics emit records for every operation called on the Identity SDK or API (for example, creating a user `CreateIdentity` or issue of a token `CreateToken`). Chat API metrics emit records for every chat API call made via chat SDKs or APIs (for example, creating a thread or sending a message).


Call summary and call diagnostics logs are emitted only for the following participants of the meeting:
- Organizer of the meeting if actively joined the meeting
- Azure Communication Services users joining the meeting from the same tenant (even when in the lobby)
- Additional Teams users joining the meeting only if the organizer and current Azure Communication Services resource are in the same tenant
- Bots
- Phone number legs

If Azure Communication Services resource and Teams meeting organizer tenants are different, then some fields of the logs are redacted. You can find more information in the call summary & diagnostics logs [documentation](./../analytics/call-logs-azure-monitor.md).

## Bots
Bots indicate service logic provided during the meeting. Here is a list of frequently used bots:
- b1902c3e-b9f7-4650-9b23-5772bd429747 - Teams convenient recording

## Next steps

- [Enable logs and metrics](./../analytics/enable-logging.md)
- [Metrics](./../metrics.md)
- [Call summary and call diagnostics](./../analytics/call-logs-azure-monitor.md)
