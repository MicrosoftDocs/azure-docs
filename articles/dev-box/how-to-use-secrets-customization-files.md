---
title: Fetch Azure Key Vault Secrets from Dev Box Customizations Files
description: Discover how to fetch Azure Key Vault secrets by using team and user customization files to enhance security and simplify workflows.
#customer intent: As a platform engineer, I want to configure Azure Key Vault secrets so that my development teams can securely access private repositories during Dev Box customization.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.custom:
  - ignite-2024
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:05/10/2025
  - ai-gen-description
ms.topic: how-to
ms.date: 05/10/2025
---

# Use Azure Key Vault secrets in customization files

You can use secrets from your Azure key vault in your YAML customizations to clone private repositories, or with any task you author that requires an access token. For example, in a team customization file, you can use a personal access token (PAT) stored in a key vault to access a private repository.

## Use key vault secrets in customization files

To use a secret, like a PAT, in your customization files, store your PAT as a key vault secret. 

Both team and user customizations support fetching secrets from a key vault. Team customizations, also known as image definition files, define the base image for the dev box with the `image` parameter, and list the tasks that run when a dev box is created. User customizations list the tasks that run when a dev box is created. The following examples show how to use a key vault secret in both types of customizations.

To configure key vault secrets for use in your team or user customizations, ensure that your dev center project's managed identity has the Key Vault Secrets User role on your key vault.

To configure key vault secrets for use in user customizations, you need to additionally:

1. Ensure that your dev center project's managed identity has the Key Vault Reader role and the Key Vault Secrets User role on your key vault.
2. Grant the Key Vault Secrets User role for the key vault secret to each user or user group that should be able to consume the secret during the customization of a dev box. The user or group granted the role must include the managed identity for the dev center, the admin's user account, and any user or group that needs the secret during dev box customization.

You can use a key vault secret in-line with the built-in PowerShell task: 

```yml
$schema: "1.0" 
image: microsoftwindowsdesktop_windows-ent-cpc_win11-24H2-ent-cpc 
tasks:  
- name: git-clone
    description: Clone this repository into C:\Workspaces 
    parameters: 
    command: MyCommand –MyParam '{{KEY_VAULT_SECRET_URI}}' 
```
This example shows an image definition file. The `KEY_VAULT_SECRET_URI` is the URI of the secret in your key vault. 

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
This example shows a user customization file. There is no `image` specified.

User customizations let you obtain an Azure DevOps token to clone private repositories without explicitly specifying a PAT from the key vault. The service automatically exchanges your Azure token for an Azure DevOps token at run time.  

```yml
$schema: "1.0" 
tasks: 
  - name: git-clone 
    description: Clone this repository into C:\Workspaces 
    parameters: 
      repositoryUrl: https://myazdo.visualstudio.com/MyProject/_git/myrepo 
      directory: C:\Workspaces 
      pat: '{{ado://YOUR_ORG_NAME}}' 
``` 

The Dev Box VS Code extension and Dev Box CLI don't support hydrating secrets in the inner-loop testing workflow for customizations. 

## Configure key vault access

The dev center needs access to your key vault. Because dev centers don't support service tags, if your key vault is private, let trusted Microsoft services bypass the firewall.

:::image type="content" source="media/how-to-use-secrets-customization-files/trusted-services-bypass-firewall.png" alt-text="Screenshot that shows the option to allow trusted Microsoft services to bypass the firewall in Azure Key Vault settings." lightbox="media/how-to-use-secrets-customization-files/trusted-services-bypass-firewall.png":::

To learn how to let trusted Microsoft services bypass the firewall, see [Configure Azure Key Vault networking settings](/azure/key-vault/general/how-to-azure-key-vault-network-security).


## Related content

- [Microsoft Dev Box team customizations](concept-what-are-team-customizations.md)
- [Configure imaging for Dev Box team customizations](how-to-configure-customization-imaging.md)
- Learn how to [add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md).
