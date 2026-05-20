---
title: Synchronize API Assets from a Git Repository
description: Learn how to integrate a Git repository with Azure API Center to automatically synchronize API assets into your API inventory.
ms.service: azure-api-center
ms.topic: how-to
ms.date: 05/05/2026
ai-usage: ai-assisted

ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
# Customer intent: As an API program manager, I want to synchronize API assets from a Git repository into my API Center inventory so that my inventory stays up to date automatically.
ms.custom:
---

# Synchronize API assets from a Git repo to Azure API Center

This article describes how to integrate a Git repository with Azure API Center to automatically synchronize API assets such as [skills](register-discover-skills.md) into your API inventory. By connecting a Git repository, you can keep your API center inventory up to date without manually registering or updating each asset.

When you integrate a Git repository:

* Your API center creates an [environment](key-concepts.md#environment) that represents the repository as a source of assets.
* API Center regularly synchronizes asset information from the repository to your API center inventory.

## Prerequisites

- An API center. If you don't have an API center yet, see the quickstart to [Create an API center](set-up-api-center.md).
- A Git repository containing the assets you want to synchronize.
- For non-public repositories, a personal access token (PAT) to access the repository. The PAT must have appropriate permissions to read the repository content. To create a PAT for GitHub, see [Create a fine-grained personal access token](https://docs.github.com/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token).
- An Azure key vault to store the PAT, if one is used for access. If you need to create a key vault, see [Quickstart: Create a key vault using the Azure portal](/azure/key-vault/general/quick-create-portal). To add or manage secrets in the key vault, you need at least the **Key Vault Secrets Officer** role or equivalent permissions.
- For Azure CLI:
    [!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    > [!NOTE]
    > You can run Azure CLI command examples in this article in PowerShell or a bash shell. Where needed because of different variable syntax, separate command examples are provided for the two shells.

## Store PAT in Azure Key Vault

If your Git repository is private, manually upload and securely store a PAT to Azure Key Vault that grants access to the repository. When you integrate the Git repository with your API center, configure the integration to use this secret.

For more information, see [Quickstart: Set and retrieve a secret from Azure Key Vault using the Azure portal](/azure/key-vault/secrets/quick-create-portal).

If you don't need to configure a PAT, proceed to [Integrate a Git repository](#integrate-a-git-repository).

## Configure a managed identity for your API center

Your API center uses a managed identity to authenticate to Azure Key Vault and retrieve the PAT needed to access the Git repository. The following procedures describe how to manually configure a managed identity for your API center and assign it the necessary permissions to access the Key Vault.

If you don't configure the managed identity, API Center can configure it for you automatically when you integrate the Git repository.

[!INCLUDE [enable-managed-identity](includes/enable-managed-identity.md)]

## Assign the managed identity the Key Vault Secrets User role

[!INCLUDE [configure-managed-identity-kv-secret-user](includes/configure-managed-identity-kv-secret-user.md)]

## Integrate a Git repository

To integrate a Git repository:

1. In the [Azure portal](https://portal.azure.com), go to your API center.
1. In the sidebar menu, select **Platforms** > **Integrations**.
1. Select **+ New integration** and choose **From Git repository**.
1. On **Integrate your Git repository**, enter the following information:

    | Field | Description |
    |-------|-------------|
    | **Configure Git repository source** ||
    | **Repository URL** | Enter the URL to the Git repository containing asset files. Optionally, specify the branch and subfolder (for example, `https://github.com/<org>/<repo>/tree/main/skills`). |
    | **Git provider** | Select the provider (for example, **GitHub**). |
    | **Asset type configuration** | API Center configures a default **skill** asset type with file pattern `**/skill.md`. <br/><br/>Select **+ Add asset type** to add one or more asset types to sync. |
        | **Personal access token (PAT)** | If you have a PAT stored in Azure Key Vault, click **Select** to browse to the Key Vault secret.<br/><br/>Optionally, select **Automatically configure managed identity and assign permissions** if you didn't manually configure a managed identity to access the key vault secret. |
    | **Integration details** | Accept the generated link identifier or provide a custom ID for the integration link. |
    | **Environment details** | |
    | **Environment title** | Enter a friendly name for the repository environment (for example, *Git repository*). |
    | **Identification** | Enter an environment resource name (for example, *git-repository*). |
    | **Environment type** | Select the environment type (for example, **Production**). |
    | **Description** | Optionally add a description for the environment. |
    | **Asset details** | |
    | **Lifecycle** | Select the lifecycle stage for assets synced from the repository (for example, **Design**). |

    :::image type="content" source="media/register-discover-skills/integrate-git-repository-small.png" alt-text="Screenshot of integrating a Git repo in an API center in the portal." lightbox="media/register-discover-skills/integrate-git-repository.png":::
1. Select **Create**.

The portal adds the environment to your API center. The portal adds the assets from the repository to the API center inventory on the **Inventory** > **Assets** page. You can identify linked assets by the link icon in the list.

:::image type="content" source="media/register-discover-skills/linked-skills.png" alt-text="Screenshot of linked assets in API center in the portal.":::

## Related content

* [Register and discover skills in your API inventory](register-discover-skills.md)
* [Key concepts in Azure API Center](key-concepts.md)
