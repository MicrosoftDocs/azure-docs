---
title: Set up GitHub BYO App connector in Azure SRE Agent
description: Configure Bring Your Own GitHub App authentication for github.com or GitHub Enterprise Cloud hosts using Key Vault-backed private keys.
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 06/02/2026
author: dchelupati
ms.author: dchelupati
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
ms.custom: github, byo-app, github-app, key-vault, github-enterprise-cloud, ghe, connector, tutorial
#customer intent: As an SRE admin, I want to connect my agent to GitHub using a BYO GitHub App with Key Vault-backed credentials so that all operations use a service identity.
---

# Set up GitHub BYO App connector in Azure SRE Agent

Connect your agent to GitHub by using a Bring Your Own GitHub App, a service identity that your organization registers with Key Vault-backed credentials.

> [!IMPORTANT]
> This tutorial sets up app-based access to your GitHub repositories by using a BYO GitHub App with Key Vault-backed credentials. All operations are attributed to your app identity, not an individual user.

## When to use BYO App

Use BYO App when:

- Your organization requires app-based authentication and key custody controls.
- You're connecting to `*.ghe.com` repositories (required).
- You want installation-token based access rather than user tokens.

## Prerequisites

- Running agent with Administrator or Standard User role
- A GitHub App created on your target host (`github.com` or `*.ghe.com`)
- GitHub org or repository admin access (to create, install, or verify GitHub App scope)
- App private key stored in Azure Key Vault as a secret
- Agent managed identity with **Key Vault Secrets User** role on that vault

## Step 1: Create a GitHub App

If you already have a GitHub App with the right permissions, skip to [Step 2](#step-2-generate-a-private-key).

1. Go to your GitHub host:
   - `github.com`: Go to your org, then select **Settings** > **Developer settings** > **GitHub Apps** > **New GitHub App**.
   - `<tenant>.ghe.com`: Same path on your GHE instance.
1. Fill in the app details:
   - **GitHub App name**: For example, `contoso-sre-agent-reader` (prefix with your org name to avoid conflicts).
   - **Homepage URL**: `https://sre.azure.com`.
   - **Webhook**: Uncheck **Active** (the agent doesn't use webhooks).
1. Under **Permissions**, set:
   - **Repository permissions > Contents**: **Read-only** (required).
   - **Repository permissions > Metadata**: **Read-only** (auto-selected).
   - Optionally add **Issues** and **Pull requests** read access.
1. Under **Where can this GitHub App be installed?**, select **Only on this account**.
1. Select **Create GitHub App**.
1. Note the **Client ID** shown on the App settings page (starts with `Iv...`, this is different from the numeric App ID).

### Install the GitHub App

1. On the GitHub App settings page, select **Install App** in the left sidebar.
1. Select your organization.
1. Choose **All repositories** or select specific repos.
1. Select **Install**.

## Step 2: Generate a private key

1. On the GitHub App settings page, scroll to **Private keys**.
1. Select **Generate a private key**.
1. A `.pem` file downloads. This file is the RSA private key the agent uses to authenticate.

> [!WARNING]
> Keep the PEM safe. You upload this key to Key Vault in the next step. Don't commit it to a repository or share it.

## Step 3: Store private key in Key Vault

1. Open the [Azure portal](https://portal.azure.com) and go to your Key Vault.
1. Go to **Secrets** > **Generate/Import**.
1. Set **Name** (for example, `sre-agent-github-app-key`) and paste the full PEM content as the **Value** (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` headers).
1. Select **Create**.
1. Open the secret, select the current version, and copy the **Secret Identifier** URI:

```text
https://myvault.vault.azure.net/secrets/my-github-app-key/<version>
```

> [!TIP]
> Use the versioned URI (with `/<version>` suffix) to pin to a specific key version, or omit the version to always use the latest. **Unversioned is recommended**. When you rotate the key, the agent automatically picks up the new version without updating the URI.

## Step 4: Grant Key Vault access to agent identity

1. In Azure portal, open your Key Vault and go to **Access control (IAM)**.
1. Assign **Key Vault Secrets User** to the agent managed identity.
1. Wait for role assignment propagation.

## Step 5: Configure BYO App in Code Access

1. Open your agent.
1. Go to **Builder** > **Code Access**.

:::image type="content" source="media/setup-github-byo-app/byo-code-access-page.png" alt-text="Screenshot of the Code Access page under Builder navigation in Azure SRE Agent." lightbox="media/setup-github-byo-app/byo-code-access-page.png":::

1. Select **Add repositories**.
1. Choose **GitHub** and enter the host:
   - `github.com` for public GitHub.
   - `<tenant>.ghe.com` for Enterprise Cloud.
1. Continue to **Authenticate**.
1. Select **Bring your own GitHub App**.

:::image type="content" source="media/setup-github-byo-app/byo-auth-form.png" alt-text="Screenshot of the BYO GitHub App authentication form showing Client ID and Key Vault URI fields." lightbox="media/setup-github-byo-app/byo-auth-form.png":::

1. Enter:
   - **Client ID**
   - **Private key secret URI (Key Vault)**
   - Optional **Key Vault identity** (or keep system-assigned)
1. Select **Connect**.

The wizard validates your credentials. When successful, you see **Connected as GitHub App** with a green checkmark.

:::image type="content" source="media/setup-github-byo-app/byo-auth-connected.png" alt-text="Screenshot of the Connected as GitHub App success state with a green checkmark." lightbox="media/setup-github-byo-app/byo-auth-connected.png":::

> [!NOTE]
> If you see the green checkmark and **Connected as GitHub App**, your credentials are valid. If **Connect** fails, verify your Client ID, Key Vault URI, and managed identity permissions.

If **Code Access** doesn't open from left navigation, refresh the agent page, expand **Builder** again, and retry.

> [!IMPORTANT]
> When you enter a `*.ghe.com` domain as the host, the wizard automatically selects **Bring your own GitHub App**. OAuth and PAT aren't available for GHE hosts.

## Step 6: Add repositories and verify

1. Select repositories and save.

:::image type="content" source="media/setup-github-byo-app/byo-add-repositories.png" alt-text="Screenshot of the repository selection step showing available repositories to add." lightbox="media/setup-github-byo-app/byo-add-repositories.png":::

1. Confirm the **Code Access** card shows connected host and auth type `GitHubApp`.

:::image type="content" source="media/setup-github-byo-app/byo-code-access-configured.png" alt-text="Screenshot of code access page showing connected GitHub host with GitHubApp auth type." lightbox="media/setup-github-byo-app/byo-code-access-configured.png":::

1. Test code access in chat:

```text
What files are in the root of owner/repo?
```

If you also granted **Issues** permission to your GitHub App, verify issue operations:

```text
List recent issues from owner/repo.
```

## Per-app managed identity

By default, the agent uses its **system-assigned managed identity** to read the private key from Key Vault. If you manage multiple GitHub Apps (for example, one per GHE instance), assign a different **user-assigned managed identity** to each app. This approach provides security isolation because each identity only has access to its own Key Vault secret.

Select the identity in the **Key Vault identity** dropdown during Step 5.

## Multi-host support for GitHub connectors

You can connect multiple GitHub hosts to the same agent. Each host has independent auth:

- `github.com`: OAuth, PAT, or BYO App
- `contoso.ghe.com`: BYO App
- `engineering.ghe.com`: BYO App (with a different GitHub App)

Disconnecting one host doesn't affect others.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Auth validation fails | Wrong Client ID or wrong host | Verify app was created on the same host entered in Code Access. |
| Secret read fails | Missing Key Vault RBAC or access policy | Grant Key Vault Secrets User to agent identity. If using Key Vault access policies, grant **Get** permission on secrets. |
| Repo shows Failed in Code Access | Missing app permissions or install scope | Verify Metadata: Read + Contents: Read and installation scope. |
| Chat issues work but Code Access fails | Endpoint/path checks differ | Rerun connection test and verify metadata permission. |
