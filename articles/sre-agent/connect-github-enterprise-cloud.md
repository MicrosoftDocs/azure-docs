---
title: "Connect GitHub Enterprise Cloud Repositories to Azure SRE Agent"
description: "Learn how to connect GitHub Enterprise Cloud repositories to your Azure SRE Agent by configuring a BYO GitHub App with Key Vault-backed private keys."
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 10/28/2026
author: dchelupati
ms.author: dchelupati
ms.reviewer: dchelupati
ms.ai-usage: ai-assisted
#customer intent: As an SRE with repositories on GitHub Enterprise Cloud, I want to connect my agent to GHE repos so that it can search enterprise code during incident investigations.
---

# Connect GitHub Enterprise Cloud repositories to Azure SRE Agent

[!INCLUDE [preview-notice](includes/preview-notice.md)]

Connect repositories hosted on GitHub Enterprise Cloud (`<TENANT>.ghe.com`) or `github.com` to your Azure SRE Agent by using a BYO (Bring Your Own) GitHub App. The agent mints short-lived installation tokens from your app's private key, which is stored in Azure Key Vault and never copied.

> [!NOTE]
> BYO GitHub App works for both `github.com` and `*.ghe.com` hosts. For `github.com` with OAuth or PAT, see [Set up GitHub connector](setup-github-connector.md).

## When to use BYO GitHub App authentication

Use BYO App when:

- Your organization requires app-based authentication and key custody controls.
- You're connecting `*.ghe.com` repositories (required because OAuth and PAT aren't available for GHE hosts).
- You want installation-token based access rather than user tokens.

## Prerequisites

| Requirement | Details |
|---|---|
| Azure SRE Agent | An agent in **Running** state with **Administrator** or **Standard User** role |
| GitHub App | A GitHub App created on your target host (`github.com` or `<TENANT>.ghe.com`) |
| GitHub admin access | Org or repository admin access to create, install, or verify GitHub App scope |
| Azure Key Vault | A vault where you can store the GitHub App's private key |
| Managed identity | Ability to assign **Key Vault Crypto User** on the imported key to the identity used by the agent |

## Create a GitHub app

If you already have a GitHub App with the right permissions, skip to [Store the private key in Azure Key Vault](#store-the-private-key-in-azure-key-vault).

1. Go to your GitHub host:
   - `github.com`: Go to your org > **Settings** > **Developer settings** > **GitHub Apps** > **New GitHub App**
   - `<TENANT>.ghe.com`: Same path on your GHE instance
1. Fill in the app details:
   - **GitHub App name**: for example, `sre-agent-reader`
   - **Homepage URL**: `https://sre.azure.com`
   - **Webhook**: Uncheck **Active** (the agent doesn't use webhooks)
1. Under **Permissions**, set:
   - **Repository permissions > Contents**: **Read-only** (required)
   - **Repository permissions > Metadata**: **Read-only** (auto-selected)
   - Optionally add **Issues** and **Pull requests** read access
1. Under **Where can this GitHub App be installed?**, select **Only on this account**.
1. Select **Create GitHub App**.
1. Note the **Client ID** shown on the app settings page.

### Install the GitHub app

1. On the GitHub App settings page, select **Install App** in the left sidebar.
1. Select your organization.
1. Select **All repositories** or select specific repos.
1. Select **Install**.

## Generate a GitHub app private key

1. On the GitHub App settings page, scroll to **Private keys**.
1. Select **Generate a private key**.
1. A `.pem` file downloads. This file is the RSA private key the agent uses to authenticate.

> [!CAUTION]
> Keep the PEM safe. You upload it to Key Vault in the next step. Don't commit it to a repository, and don't share it.

## Store the private key in Azure Key Vault

Import the GitHub App private key as an RSA **key**, not a secret, with the **Sign** operation enabled. Convert GitHub's downloaded PEM to PKCS#8 before import, then permanently delete the local PEM files after a successful import. For the commands, see [Store private key in Key Vault](setup-github-byo-app.md#step-3-store-private-key-in-key-vault).

Copy the imported key's **Key Identifier** URI:

```text
https://myvault.vault.azure.net/keys/my-github-app-key/<VERSION>
```

> [!TIP]
> **Versioned vs. unversioned URI**: You can use the versioned URI (with `/<VERSION>` suffix) to pin to a specific key version, or omit the version to always use the latest. Use the unversioned URI so that when you rotate the key, the agent automatically picks up the new version without updating the URI.

## Grant Key Vault access to agent identity

1. In the Azure portal, open **Key Vault** > **Access control (IAM)**.
1. Assign **Key Vault Crypto User** to the identity selected for Key Vault access. Scope the assignment to the imported key, or to the vault only if it is dedicated to this app.
1. Wait for role assignment to take effect.

## Configure BYO app in code access

1. Open your agent in the portal.
1. Go to **Build + setup** > **Context** > **Code access**.
1. Select **Add repository**.
1. On the **Connection** step, choose **GitHub** and enter a full **Repository URL**, such as `https://<TENANT>.ghe.com/owner/repo`.
1. If a matching credential exists, choose **New connection** under **Add repository with** to configure another credential.
1. Under **Connection method**, select **Use your GitHub App**.
1. Enter:
   - **Client ID**
   - **Private key URI (Key Vault)**: a `/keys/` URI, not a `/secrets/` URI
   - Optional **Key Vault identity** (or keep system-assigned)
1. Select **Connect**.

The wizard validates your credentials. When successful, you see **Connected as GitHub App** with a green checkmark.

> [!NOTE]
> When the repository URL uses a `*.ghe.com` host, the wizard selects **Use your GitHub App**. OAuth and PAT aren't available for GHE hosts.

## Add repositories and verify the connection

1. Select **Next** to open **Add repositories**, review the repository entries and display names, and select **Save**.
1. Confirm the repository appears in the **Code access** list with its connection in the **Connection** column.
1. Test in chat:

```text
Get me recent issues from owner/repo.
```

## Per-app managed identity for multiple GitHub apps

By default, the agent uses its **system-assigned managed identity** for Key Vault signing operations. If you manage multiple GitHub Apps (for example, one per GHE instance), you can assign a different **user-assigned managed identity** to each app. Each identity needs access only to its own Key Vault key.

Select the identity in the **Key Vault identity** dropdown during the configure step.

## Multi-host support for GitHub connections

You can connect multiple GitHub hosts to the same agent. Each host has independent authentication:

- `github.com` → OAuth, PAT, or BYO App
- `contoso.ghe.com` → BYO App
- `engineering.ghe.com` → BYO App (with a different GitHub App)

Disconnecting one host doesn't affect others.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Auth validation fails | Wrong Client ID or wrong host | Verify app was created on the same host entered in Code Access. |
| Key Vault signing fails | Wrong key URI or missing key permissions | Use an RSA `/keys/` URI with Sign enabled and grant **Key Vault Crypto User** to the selected identity. |
| Repo shows **Failed** in Code Access | Missing app permissions or install scope | Verify **Metadata: Read** + **Contents: Read** and installation scope. |
| Chat issues work but Code Access fails | Endpoint/path checks differ | Re-run connection test and verify metadata permission. |

## Next step

> [!div class="nextstepaction"]
> [GitHub connector](github-connector.md)

## Related content

- [GitHub connector](github-connector.md)
- [Set up GitHub connector (OAuth or PAT)](setup-github-connector.md)
- [Set up an MCP connector](mcp-connector.md)
