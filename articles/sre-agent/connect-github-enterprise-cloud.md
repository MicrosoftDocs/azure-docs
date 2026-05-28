---
title: Connect GitHub Enterprise Cloud repositories
description: Configure BYO GitHub App authentication for github.com or GitHub Enterprise Cloud hosts using Key Vault-backed private keys.
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 05/27/2026
author: dchelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
#customer intent: As an SRE with repositories on GitHub Enterprise Cloud, I want to connect my agent to GHE repos so that it can search enterprise code during incident investigations.
---

# Connect GitHub Enterprise Cloud repositories

[!INCLUDE [preview-notice](includes/preview-notice.md)]

Connect repositories hosted on GitHub Enterprise Cloud (`<tenant>.ghe.com`) or `github.com` to your Azure SRE Agent using a BYO (Bring Your Own) GitHub App. The agent mints short-lived installation tokens from your app's private key—stored in Azure Key Vault and never copied.

> [!NOTE]
> BYO GitHub App works for both `github.com` and `*.ghe.com` hosts. For `github.com` with OAuth or PAT, see [Set up GitHub connector](setup-github-connector.md).

## When to use BYO App

Use BYO App when:

- Your organization requires app-based authentication and key custody controls.
- You're connecting `*.ghe.com` repositories (required — OAuth and PAT aren't available for GHE hosts).
- You want installation-token based access rather than user tokens.

## Prerequisites

| Requirement | Details |
|---|---|
| Azure SRE Agent | An agent in **Running** state with **Administrator** or **Standard User** role |
| GitHub App | A GitHub App created on your target host (`github.com` or `<tenant>.ghe.com`) |
| GitHub admin access | Org or repository admin access to create, install, or verify GitHub App scope |
| Azure Key Vault | A vault where you can store the GitHub App's private key |
| Managed identity | Ability to assign **Key Vault Secrets User** role to the agent's managed identity |

## Create a GitHub App

If you already have a GitHub App with the right permissions, skip to [Store the private key in Key Vault](#store-the-private-key-in-key-vault).

1. Go to your GitHub host:
   - `github.com`: Navigate to your org > **Settings** > **Developer settings** > **GitHub Apps** > **New GitHub App**
   - `<tenant>.ghe.com`: Same path on your GHE instance
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

### Install the GitHub App

1. On the GitHub App settings page, select **Install App** in the left sidebar.
1. Select your organization.
1. Choose **All repositories** or select specific repos.
1. Select **Install**.

## Generate a private key

1. On the GitHub App settings page, scroll to **Private keys**.
1. Select **Generate a private key**.
1. A `.pem` file downloads—this is the RSA private key the agent uses to authenticate.

> [!CAUTION]
> Keep the PEM safe. You upload it to Key Vault in the next step. Don't commit it to a repository or share it.

## Store the private key in Key Vault

1. Open the [Azure portal](https://portal.azure.com) and navigate to your Key Vault.
1. Go to **Secrets** > **Generate/Import**.
1. Set **Name** (for example, `sre-agent-github-app-key`) and paste the full PEM content as the **Value** (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` headers).
1. Select **Create**.
1. Open the secret, select the current version, and copy the **Secret Identifier** URI:

```text
https://myvault.vault.azure.net/secrets/my-github-app-key/<version>
```

> [!TIP]
> **Versioned vs. unversioned URI**: You can use the versioned URI (with `/<version>` suffix) to pin to a specific key version, or omit the version to always use the latest. Unversioned is recommended—when you rotate the key, the agent automatically picks up the new version without updating the URI.

## Grant Key Vault access to agent identity

1. In the Azure portal, open **Key Vault** > **Access control (IAM)**.
1. Assign **Key Vault Secrets User** to the agent managed identity.
1. Wait for role assignment propagation.

## Configure BYO App in Code Access

1. Open your agent in the portal.
1. Navigate to **Builder** > **Code Access**.
1. Select **Add repositories**.
1. Choose **GitHub** and enter host:
   - `github.com` for public GitHub
   - `<tenant>.ghe.com` for Enterprise Cloud
1. Continue to **Authenticate**.
1. Select **Bring your own GitHub App**.
1. Enter:
   - **Client ID**
   - **Private key secret URI (Key Vault)**
   - Optional **Key Vault identity** (or keep system-assigned)
1. Select **Connect**.

The wizard validates your credentials. When successful, you see **Connected as GitHub App** with a green checkmark.

> [!NOTE]
> When you enter a `*.ghe.com` domain as the host, the wizard automatically selects **Bring your own GitHub App**—OAuth and PAT aren't available for GHE hosts.

## Add repositories and verify

1. Select repositories and save.
1. Confirm the Code Access card shows the connected host and auth type `GitHubApp`.
1. Test in chat:

```text
Get me recent issues from owner/repo.
```

## Per-App managed identity

By default, the agent uses its **system-assigned managed identity** to read the private key from Key Vault. If you manage multiple GitHub Apps (for example, one per GHE instance), you can assign a different **user-assigned managed identity** to each App. This approach provides security isolation—each identity only has access to its own Key Vault secret.

Select the identity in the **Key Vault identity** dropdown during the configure step.

## Multi-host support

You can connect multiple GitHub hosts to the same agent. Each host has independent authentication:

- `github.com` → OAuth, PAT, or BYO App
- `contoso.ghe.com` → BYO App
- `engineering.ghe.com` → BYO App (with a different GitHub App)

Disconnecting one host doesn't affect others.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Auth validation fails | Wrong Client ID or wrong host | Verify app was created on the same host entered in Code Access |
| Secret read fails | Missing Key Vault RBAC or access policy | Grant **Key Vault Secrets User** to agent identity |
| Repo shows **Failed** in Code Access | Missing app permissions or install scope | Verify **Metadata: Read** + **Contents: Read** and installation scope |
| Chat issues work but Code Access fails | Endpoint/path checks differ | Re-run connection test and verify metadata permission |

## Next step

> [!div class="nextstepaction"]
> [GitHub connector](github-connector.md)

## Related content

- [GitHub connector](github-connector.md)
- [Set up GitHub connector (OAuth or PAT)](setup-github-connector.md)
- [Set up an MCP connector](mcp-connector.md)
- [Repository auth management](repo-auth-management.md)
