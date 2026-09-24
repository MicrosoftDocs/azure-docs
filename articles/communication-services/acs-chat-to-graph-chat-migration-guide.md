---
title: Migrate from Azure Communication Services Chat to Microsoft Graph chat
description: Evaluate Microsoft Teams chat through Microsoft Graph and plan identity, application, and chat history migration from Azure Communication Services Chat.
author: anujb-msft
ms.author: anujbh
ms.date: 09/14/2026
ms.topic: how-to
ms.service: azure-communication-services
---

# Migrate from Azure Communication Services Chat to Microsoft 365 Chat

> [!IMPORTANT]
> This document is Microsoft Confidential and is staged for internal Microsoft staff approval with the Azure Communication Services retirement and breaking changes guide.

> [!IMPORTANT]
> Azure Communication Services (ACS) Chat and Microsoft Teams chat through Microsoft Graph aren't equivalent offerings. Don't begin a code migration until you confirm that Microsoft 365 identity, Teams user experience, governance, and API constraints fit your workload.

## Retirement summary

ACS Chat is scheduled to retire on **September 30, 2028**. See the [ACS retirement and breaking changes guide](acs-retirement-and-breaking-changes-guide.md) for the authoritative timeline.

This guide helps you evaluate Microsoft Teams chat accessed through Microsoft Graph as a possible target. If it's not a fit, select another supported communication architecture before the retirement date.

**Last technical review:** August 7, 2026

## Executive decision

Microsoft 365 chat is usually a good choice for conversations among Microsoft 365 users, guests, or supported external users when the organization wants those conversations in Teams under Microsoft 365 governance.

It's usually not a direct replacement when your application requires:

- Anonymous or application-defined communication identities.
- A white-label or fully embedded chat client independent of Teams.
- Consumer or customer-service chat at internet scale.
- Application-only, ongoing message sending that impersonates users.
- ACS-compatible client events, token issuance, or thread ownership semantics.
- Identical retention, data residency, notification, or moderation behavior.

If any of these features are core requirements, treat the project as a product redesign rather than an SDK swap.

## Product model differences

| Area | ACS Chat | Microsoft 365 chat through Microsoft Graph | Migration impact |
| --- | --- | --- | --- |
| Product boundary | Embeddable Azure communication service | API surface over Microsoft Teams chats | Decide whether Teams becomes the user experience |
| Identity | Application creates generic ACS communication users and issues chat-scoped tokens | Microsoft Entra and Teams identities with OAuth permissions and tenant policy | Every active or imported user needs an approved identity mapping |
| Conversation | Application-controlled chat thread | Teams one-on-one, group, or meeting chat | One-on-one chats are unique for a pair; meeting chats have different constraints |
| User interface | Your web or mobile client uses ACS SDKs | Teams client, Teams app, or a separately validated Graph-based experience | Existing UI and notification code isn't portable |
| Ongoing send | Participant sends with an ACS token | Normally a signed-in user sends with delegated `ChatMessage.Send` or `Chat.ReadWrite` | Backend daemons can't use migration permission for normal messaging |
| Real-time events | Client WebSocket notifications and server Event Grid events | Microsoft Graph change-notification subscriptions | Replace event handling, subscription renewal, validation, and encryption logic |
| History | ACS thread messages and retention | Teams messages governed by Microsoft 365 | History import is a separate, privileged migration workflow |
| Governance | Azure resource and ACS retention configuration | Teams policies, Microsoft Purview, eDiscovery, retention, DLP, tenant settings | Engage Microsoft 365 administrators and compliance owners |
| Files and rich content | Application-defined message content and metadata | Teams message body, hosted content, mentions, reactions, and Microsoft 365 file links | Transform and rehost unsupported content |
| Operations | Azure resource, connection string, trusted service, ACS SDK telemetry | Entra app registration, Graph permissions, Teams policy, subscriptions, throttling | Replace operational runbooks and monitoring |

Public background:

- [ACS Chat concepts](concepts/chat/concepts.md)
- [Microsoft Graph chat resource](/graph/api/resources/chat)
- [Microsoft Graph chatMessage resource](/graph/api/resources/chatmessage)
- [Microsoft Graph authentication and authorization basics](/graph/auth/auth-concepts)

## Step 1: Decide whether the target is a fit

Complete this gate before designing the migration.

### Identity and audience

- Every continuing user can be represented by a Microsoft Entra identity that Teams can use.
- Tenant policy allows guest and external access for the required participants.
- Personal Microsoft accounts, anonymous users, and deleted ACS identities have an explicit supported disposition.
- The organization accepts that imported authors must map to users allowed by the import API.
- The tenant administrator confirmed the required Microsoft 365 and Teams entitlements.

### Experience

- Users can continue in the Teams client or an approved Teams app.
- If retaining a custom UI, the team validated every required operation, permission, notification flow, accessibility behavior, and Teams/API term.
- Losing ACS-specific typing, read-receipt, push-notification, or client event behavior is acceptable or has a supported redesign.
- The team selected a Teams bot or app for application-generated interactive messages.

### Governance

- Tenant administrators approve the app registration, consent, external access, Teams policies, and target data location.
- Compliance owners approve retention, eDiscovery, DLP, legal hold, deletion, and archival behavior.
- Security owners approve delegated and application permissions at least privilege.
- The target cloud supports every required Graph API. Chat migration mode isn't available in every national cloud.

### Data

- The team can extract all in-scope ACS threads before the source cutoff.
- Every imported message can be mapped to a target chat and eligible author.
- Attachments, metadata, system events, edits, deletions, timestamps, and reactions have documented transformations.
- Unmappable content has an approved archive or exclusion path.

**Decision:** If any mandatory item is unresolved, pause implementation. Select a different target or obtain an explicit design and policy decision.

## Step 2: Choose the target experience

Choose one primary pattern.

### Pattern A: Continue in Teams

Users read and send messages in the Teams client. Your application creates or discovers chats, deep-links users to Teams, and uses Graph only for approved integration operations.

This is the lowest-risk fit because Teams owns the chat experience, notifications, accessibility, and user controls.

### Pattern B: Build a Teams app

Your product becomes a Teams app, tab, bot, message extension, or combination. Use a bot for application-generated conversational interactions rather than attempting to send routine messages with migration permissions.

See the [Microsoft Teams developer platform overview](/microsoftteams/platform/overview).

### Pattern C: Retain a custom application experience

Use this pattern only after a design review. Microsoft Graph is an API over Teams data; it doesn't reproduce the ACS Chat client SDK. You must independently design sign-in, token acquisition, consent, chat discovery, message rendering, notifications, subscription renewal, retries, accessibility, and policy-aware errors.

## Step 3: Inventory the ACS implementation

Create a versioned inventory before changing code.

### Repository inventory

Search for:

- ACS Chat packages and imports, such as `Azure.Communication.Chat`, `@azure/communication-chat`, and equivalent Android or iOS SDKs.
- `ChatClient`, `ChatThreadClient`, `createChatThread`, `listChatThreads`, `sendMessage`, `listMessages`, and calls for participant management, typing indicators, read receipts, and real-time notifications.
- Communication Services endpoints, connection strings, user-identity creation, and token issuance.
- Event Grid handlers and mobile push-notification registration.
- Application tables that store ACS user IDs, thread IDs, message IDs, metadata, or retention state.
- Retry, paging, moderation, export, analytics, and deletion jobs.

### Data inventory

For each thread, record at least:

```json
{
  "sourceThreadId": "acs-thread-id",
  "topic": "Example topic",
  "createdAt": "2024-01-15T12:00:00.000Z",
  "retentionPolicy": "source-policy",
  "participants": [
    {
      "acsUserId": "8:acs:example",
      "displayName": "Example User",
      "targetEntraObjectId": null,
      "mappingStatus": "unresolved"
    }
  ],
  "messageCount": 0,
  "oldestMessageAt": null,
  "newestMessageAt": null,
  "containsAttachments": false,
  "containsUnmappedAuthors": false,
  "targetStrategy": "undecided"
}
```

Do not place production message bodies or personal data in source control.

### Baseline metrics

Capture:

- Thread, participant, and message counts.
- Message counts by author and day.
- Edited, deleted, HTML, attachment, metadata, and system-event counts.
- Oldest and newest timestamps.
- Identities with no target mapping.
- Extraction errors and inaccessible threads.

These values become the reconciliation baseline.

## Step 4: Design identity and authorization

### Map identities

Create a controlled mapping outside source control:

```csv
acs_user_id,entra_object_id,target_tenant_id,status,decision_owner
8:acs:example,00000000-0000-0000-0000-000000000001,11111111-1111-1111-1111-111111111111,mapped,identity-team
8:acs:former-user,,,archive-only,records-team
```

Rules:

- Match on authoritative business identifiers, not display names.
- Validate that the target user exists and can participate in the selected Teams chat.
- Don't impersonate an unmapped user.
- Archive or exclude messages whose authors you can't represent under the import rules, unless compliance and product owners approve another supported treatment.
- Store mapping evidence, approvals, and exceptions according to organizational privacy requirements.

### Register applications

Use separate app registrations or credentials for distinct trust levels when practical:

| Workload | Access type | Typical least-privileged starting point |
| --- | --- | --- |
| User creates a chat | Delegated | `Chat.Create` |
| Service creates a chat | Application | `Chat.Create` |
| User sends a normal message | Delegated | `ChatMessage.Send` |
| User reads messages | Delegated | `Chat.Read` |
| App reads one installed chat through resource-specific consent | Application | `ChatMessage.Read.Chat` where supported |
| Migration orchestrator | Application, admin consent | `Teamwork.Migrate.All`, plus permissions required to create chats or manage members |

Permissions vary by operation. Confirm each endpoint in the current [Microsoft Graph permissions reference](/graph/permissions-reference).

Do not:

- Use `Teamwork.Migrate.All` for ongoing messaging.
- Place client secrets in source code or browser/mobile applications.
- Replace delegated user operations with tenant-wide application permissions merely to simplify implementation.
- Assume that consent alone overrides Teams membership or tenant policy.

## Step 5: Choose a history strategy

### Option 1: Archive and restart

Use this option when author mapping is incomplete, exact fidelity isn't required, import support doesn't cover the target cloud or chat type, or the organization prefers a clean transition.

1. Export in-scope ACS messages and metadata to an approved archive.
2. Validate archive completeness and access controls.
3. Create the target chats.
4. Post a transition message through an approved user or bot flow.
5. Provide an approved link or process for retrieving legacy history.
6. Make the ACS experience read-only, then retire it according to the public timeline.

### Option 2: Import history

Use the [Teams message import workflow](/graph/teams-import-messages) when you need to preserve supported history in Teams.

Key constraints include:

- App-only `Teamwork.Migrate.All` with administrator consent.
- One application owns each migration session from start through completion.
- Target one-on-one and group chats are supported, while meeting chats aren't.
- Imported authors must be valid for the authenticated tenant and import scenario.
- Each imported `createdDateTime` must be later than the target conversation creation time, not in the future, and unique to the millisecond in that conversation.
- The target chat displays a migration banner until completion.
- Some content types require transformation or are out of scope.
- Cloud availability must be verified.

## Step 6: Extract and transform ACS data

Use an authenticated migration service to list every in-scope thread, participant, and message. Follow ACS paging links until they're exhausted and save restartable checkpoints.

For each extracted record:

1. Store the immutable source identifier.
2. Normalize timestamps to UTC without discarding the original value.
3. Resolve the author through the approved identity map.
4. Sanitize and transform message content for the Graph `chatMessage` schema.
5. Rehost files in an approved Microsoft 365 location before creating links.
6. Preserve a source-to-target relationship for audit and reconciliation.
7. Record unsupported fields and the approved disposition.

Use an idempotency ledger:

```json
{
  "sourceThreadId": "acs-thread-id",
  "sourceMessageId": "acs-message-id",
  "targetChatId": null,
  "targetMessageId": null,
  "effectiveCreatedDateTime": "2024-01-15T12:34:56.123Z",
  "status": "ready",
  "attempts": 0,
  "lastError": null
}
```

### Timestamp collisions

If two source messages in one target chat resolve to the same millisecond:

1. Sort deterministically by original timestamp and source message ID.
2. Assign unused millisecond values while preserving order.
3. Record both the original and effective timestamps.
4. Include collision counts in reconciliation.

Never silently drop a conflicting message.

## Step 7: Create target chats

Create or select the target chat and save its ID.

```http
POST https://graph.microsoft.com/v1.0/chats
Authorization: Bearer {token}
Content-Type: application/json

{
  "chatType": "group",
  "topic": "Example migration",
  "members": [
    {
      "@odata.type": "#microsoft.graph.aadUserConversationMember",
      "roles": ["owner"],
      "user@odata.bind": "https://graph.microsoft.com/v1.0/users('00000000-0000-0000-0000-000000000001')"
    },
    {
      "@odata.type": "#microsoft.graph.aadUserConversationMember",
      "roles": ["owner"],
      "user@odata.bind": "https://graph.microsoft.com/v1.0/users('00000000-0000-0000-0000-000000000002')"
    }
  ]
}
```

Important behaviors:

- Include every initial participant.
- If a one-on-one chat already exists for the same pair, the API returns it instead of creating another.
- Assign guest and external roles according to the current [create chat documentation](/graph/api/chat-post).
- Store the returned chat ID; application permission can't list every chat in all scenarios.

## Step 8: Import historical messages

Perform this sequence for each target chat.

### 8.1 Start migration mode

Choose a `conversationCreationDateTime` earlier than the earliest message you import.

```http
POST https://graph.microsoft.com/v1.0/chats/{chat-id}/startMigration
Authorization: Bearer {app-only-token}
Content-Type: application/json

{
  "conversationCreationDateTime": "2023-01-01T00:00:00.000Z"
}
```

Confirm the chat's `migrationMode` is `inProgress` before importing.

### 8.2 Import messages

```http
POST https://graph.microsoft.com/v1.0/chats/{chat-id}/messages
Authorization: Bearer {app-only-token}
Content-Type: application/json

{
  "createdDateTime": "2024-01-15T12:34:56.123Z",
  "from": {
    "user": {
      "id": "00000000-0000-0000-0000-000000000001",
      "displayName": "Example User",
      "userIdentityType": "aadUser"
    }
  },
  "body": {
    "contentType": "html",
    "content": "<p>Example imported message</p>"
  }
}
```

For each request:

- Persist the returned target message ID.
- Treat `409 Conflict` as a timestamp collision to resolve, not success.
- Honor `Retry-After` for `429 Too Many Requests`.
- Retry only transient failures with bounded exponential backoff and jitter.
- Quarantine permanent validation or identity errors for review.
- Never log access tokens or full message bodies.

### 8.3 Reconcile before completion

Verify:

- Expected and imported counts match, accounting for approved exclusions.
- Every imported author matches the identity map.
- Message order is preserved.
- Samples of HTML, mentions, links, reactions, hosted content, and replies render correctly.
- Every source message has an imported, archived, excluded, or failed status.
- Failures are resolved or explicitly approved.

### 8.4 Complete migration

```http
POST https://graph.microsoft.com/v1.0/chats/{chat-id}/completeMigration
Authorization: Bearer {app-only-token}
```

Confirm `204 No Content`, and then verify the chat no longer shows the migration-in-progress banner.

Don't complete a chat merely because most messages succeeded. Completion is a controlled checkpoint.

## Step 9: Replace application behavior

### Runtime API mapping

| ACS operation | Microsoft 365 design |
| --- | --- |
| Create ACS identity and issue chat token | Sign in with Microsoft identity platform; acquire a delegated Graph token |
| Create chat thread | `POST /chats` |
| Get thread | `GET /chats/{chat-id}` |
| Add or remove participant | `POST` or `DELETE /chats/{chat-id}/members/...` |
| Send normal message | Delegated `POST /chats/{chat-id}/messages` |
| List messages | `GET /chats/{chat-id}/messages`, following `@odata.nextLink` |
| Edit own message | Delegated `PATCH /chats/{chat-id}/messages/{message-id}` |
| Delete message | Use the delegated [chat message soft-delete API](/graph/api/chatmessage-softdelete) |
| Real-time client events | Microsoft Graph change-notification subscriptions |
| Event Grid server events | Microsoft Graph webhook endpoint and subscription lifecycle handling |
| Mobile push through ACS | Teams notifications, Teams app capabilities, or a separately designed application notification path |
| Application-generated conversation | Teams bot or app rather than migration-based message sending |

### Send a normal message

```http
POST https://graph.microsoft.com/v1.0/chats/{chat-id}/messages
Authorization: Bearer {delegated-user-token}
Content-Type: application/json

{
  "body": {
    "content": "Hello from the migrated application"
  }
}
```

The normal send operation uses delegated permission. The application permission that the API shows is for migration, not routine service-to-user messaging.

### Subscribe to message changes

Replace ACS WebSocket or Event Grid assumptions with a Microsoft Graph subscription design:

```http
POST https://graph.microsoft.com/v1.0/subscriptions
Authorization: Bearer {token}
Content-Type: application/json

{
  "changeType": "created,updated,deleted",
  "notificationUrl": "https://example.invalid/graph/notifications",
  "resource": "/chats/{chat-id}/messages",
  "includeResourceData": false,
  "expirationDateTime": "2026-08-06T18:00:00Z",
  "clientState": "{random-secret}"
}
```

Implement:

- Endpoint validation.
- `clientState` verification.
- Encrypted resource-data handling when enabled.
- Lifecycle notifications where required.
- Renewal before expiration.
- Replay-safe and idempotent processing.
- Missed-event recovery using Graph reads.
- Throttling and backpressure.

See [change notifications for Teams messages](/graph/teams-changenotifications-chatmessage).

## Step 10: Test the migrated solution

### Functional tests

- Create or locate one-on-one and group chats.
- Add and remove eligible internal, guest, and external members.
- Send, list, edit, and delete messages by using the intended permission context.
- Render plain text, HTML, mentions, links, hosted content, reactions, and quoted replies in scope.
- Receive create, update, and delete notifications.
- Renew subscriptions and recover after an expired subscription.
- Validate deep links and Teams app behavior on required clients.

### Migration tests

- Resume safely after process termination.
- Retry `429`, `5xx`, and network failures without duplication.
- Resolve duplicate-millisecond timestamps.
- Quarantine unmapped and ineligible authors.
- Compare source and target counts and deterministic samples.
- Verify archive retrieval for excluded content.
- Confirm completion behavior and the post-migration user experience.

### Security and governance tests

- Verify least-privileged permissions and administrator consent.
- Test tenant policies, external access, conditional access, and disabled accounts.
- Confirm secrets use an approved secret store or workload identity.
- Confirm logs redact tokens and message content.
- Validate retention, DLP, eDiscovery, deletion, legal hold, and audit requirements with the responsible administrators.

### Performance tests

- Measure extraction and import throughput with realistic data.
- Follow `Retry-After` and verify bounded concurrency.
- Test Graph paging and long-running migrations.
- Ensure cutover fits within the approved downtime or coexistence window.

## Step 11: Rehearse cutover and rollback

### Cutover sequence

1. Announce the user-visible transition by using approved communications.
2. Stop creating new ACS threads.
3. Make ACS Chat read-only or stop sends.
4. Record the final source watermark.
5. Extract and process the final delta.
6. Import, reconcile, and complete target chats.
7. Enable the Teams or Teams-app experience.
8. Monitor authentication, Graph errors, subscriptions, and user support signals.
9. Preserve the source archive and migration ledger for the approved period.
10. Remove ACS credentials and resources only after the rollback window and records approval.

### Rollback

Before the source cutoff, rollback can return users to ACS while you correct the target migration. After source retirement, rollback means using the approved continuity plan or archive; it doesn't mean deleting Teams messages and assuming ACS can be restored.

Define in advance:

- Who can declare rollback.
- The last safe source-write time.
- How to handle target messages created during the cutover.
- How to notify users.
- How to reconcile data divergence.

## Operational next steps

1. Assign migration, identity, tenant administration, security, compliance, support, and product owners.
2. Complete the fit checklist and record the decision.
3. Use the [help and support options in the retirement guide](acs-retirement-and-breaking-changes-guide.md#get-help-and-support) for product-specific blockers.
4. Build an inventory and identity-map proof of concept.
5. Rehearse one low-risk one-on-one chat and one group chat in a test tenant.
6. Select archive-and-restart or history import for each conversation cohort.
7. Automate extraction, transformation, import, reconciliation, and reporting.
8. Run a production pilot before broad cutover.

## Public references

- [ACS Chat concepts](concepts/chat/concepts.md)
- [ACS Chat SDK features](concepts/chat/sdk-features.md)
- [Microsoft Graph Teams API overview](/graph/api/resources/teams-api-overview)
- [Microsoft Graph chat resource](/graph/api/resources/chat)
- [Create a chat](/graph/api/chat-post)
- [Add a chat member](/graph/api/chat-post-members)
- [Send a message in a chat](/graph/api/chat-post-messages)
- [List messages in a chat](/graph/api/chat-list-messages)
- [Soft-delete a chat message](/graph/api/chatmessage-softdelete)
- [Import messages into Teams chats and channels](/graph/teams-import-messages)
- [Start chat migration](/graph/api/chat-startmigration)
- [Complete chat migration](/graph/api/chat-completemigration)
- [Teams message change notifications](/graph/teams-changenotifications-chatmessage)
- [Microsoft Graph throttling guidance](/graph/throttling)
- [Microsoft Graph service-specific throttling limits](/graph/throttling-limits)
- [Microsoft Graph permissions reference](/graph/permissions-reference)
- [Teams limits and specifications](/microsoftteams/limits-specifications-teams)
- [Manage external access in Teams](/microsoftteams/manage-external-access)
