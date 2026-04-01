---
title: Use wildcard group role patterns
description: Learn how to grant Azure Web PubSub clients permissions to many groups using wildcard role patterns.
author: kevinguo-ed
ms.author: kevinguo
ms.service: azure-web-pubsub
ms.topic: conceptual
ms.date: 01/28/2026
ms.custom:
---

# Use wildcard group role patterns

Azure Web PubSub now supports wildcard pattern matching in client "group" roles so you can authorize a client for many related groups with a single role string.

You can continue to use the existing literal roles:

- `webpubsub.sendToGroup.{groupName}`
- `webpubsub.joinLeaveGroup.{groupName}`

But you can now also use the new pattern roles:

- `webpubsub.sendToGroups.{pattern}`
- `webpubsub.joinLeaveGroups.{pattern}`

Where `{pattern}` follows the wildcard syntax below.

## When to use pattern roles

Use pattern roles when:

- A user or device must access a large but bounded dynamic set of groups (for example: all groups for a specific tenant or project)
- You want to keep access tokens small (avoid listing dozens or hundreds of explicit group roles)

## Pattern syntax

| Symbol | Meaning |
| ------ | ------- |
| `?` | Matches exactly one character except `.` |
| `*` | Matches zero or more characters except `.` |
| `**` | Matches zero or more characters including `.` (crosses segment boundaries) |
| `\` | Escape character for `\`, `*`, `?` |
| `.` | Acts as a hierarchy separator and is never matched by `?` or `*` (only by `**`). |

Additional rules:
- Up to five total `*` characters (including those forming `**`) are allowed in a single pattern.

### Examples

| Pattern | Matches | Does not match |
| ------- | ------- | -------------- |
| `chat-*` | `chat-1`, `chat-room` | `chat.1`, `xchat-1` |
| `clientA.*` | `clientA.alpha`, `clientA.1` | `clientA.alpha.room1`, `clientB.alpha` |
| `clientA.**` | `clientA.alpha`, `clientA.alpha.room1` | `clientB.anything` |
| `clientA.rooms.?1` | `clientA.rooms.a1`, `clientA.rooms.11` | `clientA.rooms.1`, `clientA.rooms.a.1` |
| `literal\*star` | `literal*star` | `literalXstar` |

### Escaping

Prefix `*`, `?`, or `\` with `\` to match the literal character. Example: `project\*123` matches only `project*123`.

## Using pattern roles in code

Add the pattern role to the `roles` collection when generating a client access token. The client then automatically has the implied permissions for matching groups.

## Code samples

# [JavaScript](#tab/javascript)

```js
const token = await serviceClient.getClientAccessToken({
  roles: [
    // Can send to all groups under clientA.
  'webpubsub.sendToGroups.clientA.**',
    // Can join/leave any direct child group under public.
  'webpubsub.joinLeaveGroups.public.*'
  ]
});
```

# [C#](#tab/csharp)

```csharp
var url = service.GetClientAccessUri(roles: new [] {
    // Can send to all groups under clientA.
  "webpubsub.sendToGroups.clientA.**",
    // Can join/leave any direct child group under public.
  "webpubsub.joinLeaveGroups.public.*"
});
```

# [Python](#tab/python)

```python
token = service.get_client_access_token(roles=[
  # Can send to all groups under clientA.
  "webpubsub.sendToGroups.clientA.**",

  # Can join/leave any direct child group under public.
  "webpubsub.joinLeaveGroups.public.*"
])
```

# [Java](#tab/java)

```java
GetClientAccessTokenOptions opt = new GetClientAccessTokenOptions();
// Can send to all groups under clientA.
opt.addRole("webpubsub.sendToGroups.clientA.**");

// Can join/leave any direct child group under public.
opt.addRole("webpubsub.joinLeaveGroups.public.*");
WebPubSubClientAccessToken token = service.getClientAccessToken(opt);
```

---

## Security guidance

- Prefer the narrowest pattern that satisfies the scenario.
- Minimize the use of `*` to reduce over-permissioning risks.

## Frequently asked questions

**Q: Can I mix literal and pattern roles?**

Yes. A literal role always applies exactly; patterns add broader coverage.


## Next steps

> [!div class="nextstepaction"]
> [Generate client access URL and use roles](howto-generate-client-access-url.md)
