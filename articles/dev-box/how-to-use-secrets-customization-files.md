---
title: Use key vault secrets in customization files
description: Learn how to use Azure Key Vault secrets in team and individual customization files to clone private repositories.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.custom:
  - ignite-2024
ms.topic: how-to
ms.date: 04/20/2025

#customer intent: As a Dev Center Admin or Project Admin, I want to create image definition files so that my development teams can create customized dev boxes.
---

# Clone a private repository by using a customization file

[!INCLUDE [note-build-2025](includes/note-build-2025.md)]


You can use secrets from your Azure key vault in your YAML customizations to clone private repositories, or with any custom task you author that requires an access token. In a team customization file, you can use a personal access token (PAT) stored in a key vault to access a private repository.

## Use key vault secrets in team customization files

To clone a private repository, store your PAT as a key vault secret. See [Grant the managed identity access to the key vault secret](../deployment-environments/how-to-configure-managed-identity.md#grant-the-managed-identity-access-to-the-key-vault-secret), and use it when you invoke the `git-clone` task in your customization.

To configure your key vault secrets for use in your YAML customizations:

1. Ensure that your dev center project's managed identity has the Key Vault Reader role and the Key Vault Secrets User role on your key vault.
2. Grant the Key Vault Secrets User role for the key vault secret to each user or user group that should be able to consume the secret during the customization of a dev box. The user or group granted the role must include the managed identity for the dev center, the admin's user account, and any user or group that needs the secret during dev box customization.

For more information, see:

- [Configure a managed identity for a dev center](../deployment-environments/how-to-configure-managed-identity.md#configure-a-managed-identity-for-a-dev-center)
- [Grant the managed identity access to the key vault secret](../deployment-environments/how-to-configure-managed-identity.md#grant-the-managed-identity-access-to-the-key-vault-secret)

You can reference the secret in your YAML customization in the following format, which uses the `git-clone` task as an example:

```yml
$schema: "1.0"
tasks:
  - name: git-clone
    description: Clone this repository into C:\Workspaces
    parameters:
      repositoryUrl: https://myazdo.visualstudio.com/MyProject/_git/myrepo
      directory: C:\Workspaces
      pat: '{{KEY_VAULT_SECRET_URI}}'
```

## Use key vault secrets in individual customization files

To clone a private Azure Repos repository from an individual customization file, you don't need to configure a secret in Azure Key Vault. If you want to clone a private Azure Repos repository from an individual customization file, you don't need to configure a secret in Azure Key Vault. Instead, you can use `{{ado}}` or `{{ado://your-ado-organization-name}}` as a parameter. This parameter fetches an access token on your behalf when you're creating a dev box. The access token has read-only permission to your repository.

The `git-clone` task in the quickstart catalog uses the access token to clone your repository. Here's an example:

```yml
tasks:
  - name: git-clone
    description: Clone this repository into C:\Workspaces
    parameters:
      repositoryUrl: https://myazdo.visualstudio.com/MyProject/_git/myrepo
      directory: C:\Workspaces
      pat: '{{ado://YOUR_ADO_ORG}}'
```

The dev center needs access to your key vault. Dev centers don't support service tags, so if your key vault is private, allow trusted Microsoft services to bypass the firewall.

Dev centers don't support service tags, so if the key vault is private, allow trusted Microsoft services to bypass the firewall.

:::image type="content" source="media/how-to-use-secrets-customization-files/trusted-services-bypass-firewall.png" alt-text="Screenshot that shows the option to allow trusted Microsoft services to bypass the firewall in Azure Key Vault settings." lightbox="media/how-to-use-secrets-customization-files/trusted-services-bypass-firewall.png":::

To learn how to allow trusted Microsoft services to bypass the firewall, see [Configure Azure Key Vault networking settings](/azure/key-vault/general/how-to-azure-key-vault-network-security).

## Share a customization file from a code repository

Make the customization file available to dev box pools by naming it *imagedefinition.yaml* and uploading it to the repository that hosts the catalog. When you create a dev box pool, you can select the customization file from the catalog to apply to the dev boxes in the pool.

## Related content

- [Microsoft Dev Box team customizations](concept-what-are-team-customizations.md)
- [Configure imaging for Dev Box team customizations](how-to-configure-customization-imaging.md)
- [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md)
