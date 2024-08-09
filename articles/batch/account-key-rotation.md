---
title: Rotate Batch account keys
description: Learn how to rotate Batch account shared key credentials.
ms.topic: how-to
ms.date: 08/09/2024
---
# Batch account shared key credential rotation

Batch accounts can be authenticated in one of two ways, either via shared key or Microsoft Entra ID. Batch accounts
with shared key authentication enabled have two keys associated with them, to allow for key rotation scenarios.

> [!TIP]
> It's highly recommended to avoid using shared key authentication with Batch accounts. The preferred authentication
> mechanism is through Microsoft Entra ID. You can disable shared key authentication during account creation or you
> can update allowed [Authentication Modes](/rest/api/batchmanagement/batch-account/create#authenticationmode) for an
> active account.

## Batch shared key rotation procedure

Azure Batch accounts have two shared keys, `primary` or `secondary`. It's important not to regenerate both
keys at the same time, and instead regenerate them one at a time to avoid potential downtime.

> [!WARNING]
> Once a key has been regenerated, it is no longer valid and the prior key cannot be recovered for use. Ensure
> that your application update process follows the recommended key rotation procedure to prevent losing access
> to your Batch account.

The typical key rotation procedure is as follows:

1. Normalize your application code to use either the primary or secondary key. If you're using both keys in your
application simultaneously, then any rotation procedure leads to authentication errors. The following steps assume
that you're using the `primary` key in your application.
1. Regenerate the `secondary` key.
1. Update your application code to utilize the newly regenerated `secondary` key. Deploy these changes and
ensure that everything is working as expected.
1. Regenerate the `primary` key.
1. Optionally update your application code to use the `primary` key and deploy. This step isn't strictly
necessary as long as you're tracking which key is used in your application and deployed.

### Rotation in Azure portal

First, sign in to the [Azure portal](https://portal.azure.com). Then, navigate to the **Keys** blade of your
Batch account under **Settings**. Then select either `Regenerate primary` or `Regenerate secondary` to create a new key.

   :::image type="content" source="media/account-key-rotation/batch-account-key-rotation.png" alt-text="Screenshot showing key rotation.":::

## See also

- Learn more about [Batch accounts](accounts.md).
- Learn how to authenticate with [Batch Service APIs](batch-aad-auth.md)
or [Batch Management APIs](batch-aad-auth-management.md) with Microsoft Entra ID.
