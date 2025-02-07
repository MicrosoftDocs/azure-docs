---
title: Write a Customization File
description: Learn how to create and test a customization file for your dev box by using Visual Studio Code and Dev Home.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.custom:
  - ignite-2024
ms.topic: how-to
ms.date: 11/06/2024

#customer intent: As a Dev Center Admin or Project Admin, I want to create image definition files so that my development teams can create customized dev boxes.
---

# Write a customization file for a dev box

In this article, you learn how to create and test a customization file for your dev box by using Visual Studio Code (VS Code) and Dev Home.

There are two ways to use a customization file in Microsoft Dev Box. *Team customizations* are applied automatically when developers configure them on a pool. *Individual customizations* are applied when a user creates a dev box.

This article helps you define new tasks in your customization file, apply them to your dev boxes, and test these customizations directly in VS Code.

[!INCLUDE [customizations-preview-text](includes/customizations-preview-text.md)]

## Prerequisites

To complete the steps in this article, you must:

- Have a [dev center configured with a dev box definition, dev box pool, and dev box project](./quickstart-configure-dev-box-service.md) so that you can create a dev box.
- Be a member of the Dev Box Users security group for at least one project.
- Have a catalog attached to the dev center with tasks that you can use in your customization file. If you don't have a catalog, see [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md).

## Permissions required to configure customizations
  
[!INCLUDE [permissions-for-customizations](includes/permissions-for-customizations.md)]

## What is a customization file?

Dev Box customizations use a YAML-formatted file to specify a list of tasks to apply when a developer creates a dev box. These tasks can be as simple as installing a package, or as sophisticated as running a complex set of scripts to set up a code base. Tasks identify the catalog and provide parameters like the name of the software to install. The customization file is then made available to the developers who create dev boxes.

The following example uses a `winget` task to install VS Code, and a `git-clone` task to clone a repository:

```yml
# From https://github.com/microsoft/devcenter-examples
$schema: 1.0
tasks:
  - name: winget
    parameters:
      package: Microsoft.VisualStudioCode
      runAsUser: true
  - name: git-clone
    description: Clone this repository into C:\Workspaces
    parameters:
      repositoryUrl: https://github.com/OrchardCMS/OrchardCore.git
      directory: C:\Workspaces
```

There are two ways to use a customization file: individual customizations apply to a single dev box, and team customizations apply to a whole team.

### Individual customization files

- Contain tasks that are applied when a developer creates a dev box.
- Are uploaded by the developer during creation of a dev box.

### Team customization files

- Contain tasks that are applied when a developer creates a dev box.
- Are shared across a team or project.
- Include a field that specifies the base image.
- Are named imagedefinition.yaml.
- Are uploaded to the repository that hosts a catalog.
- Are automatically used when a developer creates a dev box from a configured pool.

> [!IMPORTANT]
> Image definitions can use only Dev Box marketplace images as base images. To get a list of images that your dev center can access, use this Azure CLI command:
> ```bash
> az devcenter admin image list --dev-center-name CustomizationsImagingHQ --resource-group TeamCustomizationsImagingRG --query "[].name"
> ```

## Create a customization file

You can create and manage customization files by using VS Code. You can use the Microsoft Dev Box extension in VS Code to discover the tasks in the attached catalog and test the customization file.

1. Create a dev box (or use an existing dev box) for testing.
1. On the test dev box, install VS Code and then install the [Dev Box extension](https://marketplace.visualstudio.com/items?itemName=DevCenter.ms-devbox).
1. Download an [example YAML customization file](https://aka.ms/devbox/customizations/samplefile) from the samples repository and open it in VS Code.
1. Discover tasks available in the catalog by using the command palette. Select **View** > **Command Palette** > **Dev Box: List Available Tasks For This Dev Box**.

   :::image type="content" source="media/how-to-write-customization-file/dev-box-command-list-tasks.png" alt-text="Screenshot of the Dev Box command palette in Visual Studio Code, showing the command for listing available tasks.":::

1. Test customization in VS Code by using the command palette. Select **View** > **Command Palette** > **Dev Box: Apply Customizations Tasks**.

   :::image type="content" source="media/how-to-write-customization-file/dev-box-command-apply-tasks.png" alt-text="Screenshot of the Dev Box command palette in Visual Studio Code, showing the command for applying customization tasks.":::

1. The customization file runs immediately and applies the specified tasks to your test dev box. Inspect the changes, and check the VS Code terminal for any errors or warnings generated during the task execution.

1. When the customization file runs successfully, upload it to your catalog.

## Clone a private repository by using a customization file

You can use secrets from your Azure key vault in your YAML customizations to clone private repositories, or with any custom task you author that requires an access token. In a team customization file, you can use a personal access token (PAT) stored in a key vault to access a private repository.

### Use key vault secrets in team customization files

To clone a private repository, store your PAT as a key vault secret, and use it when you're invoking the `git-clone` task in your customization.

To configure your key vault secrets for use in your YAML customizations:

1. Ensure that your dev center project's managed identity has the Key Vault Reader role and the Key Vault Secrets User role on your key vault.
2. Grant the Key Vault Secrets User role for the key vault secret to each user or user group that should be able to consume the secret during the customization of a dev box. The user or group that's granted the role must include the managed identity for the dev center, your own user account, and any user or group that needs the secret during the customization of a dev box.

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

### Use key vault secrets in individual customization files

If you want to clone a private Azure Repos repository from an individual customization file, you don't need to configure a secret in Azure Key Vault. Instead, you can use `{{ado}}` or `{{ado://your-ado-organization-name}}` as a parameter. This parameter fetches an access token on your behalf when you're creating a dev box. The access token has read-only permission to your repository.

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

Your dev center needs access to your key vault. Dev centers don't support service tags, so if your key vault is kept private, you must allow trusted Microsoft services to bypass the firewall.

:::image type="content" source="media/how-to-write-customization-file/trusted-services-bypass-firewall.png" alt-text="Screenshot that shows the option to allow trusted Microsoft services to bypass the firewall in Azure Key Vault settings." lightbox="media/how-to-write-customization-file/trusted-services-bypass-firewall.png":::

To learn how to allow trusted Microsoft services to bypass the firewall, see [Configure Azure Key Vault networking settings](/azure/key-vault/general/how-to-azure-key-vault-network-security).

### Customize your dev box by using existing WinGet Configuration files

WinGet configuration takes a config-as-code approach to defining the unique sets of software and configuration settings needed to get your Windows environment in a ready-to-code state. You can also use these configuration files to set up a dev box, by using a WinGet task included in the Microsoft-provided quickstart catalog.

The following example shows a dev box customization file that calls an existing WinGet Desired State Configuration (DSC) file:

```yml
tasks:
    - name: winget
      parameters:
          configure: "projectConfiguration.dsc.yaml"
```

To learn more, see [WinGet configuration](https://aka.ms/winget-configuration).

## Share a customization file from a code repository

Make your customization file available to dev box pools by naming it imagedefinition.yaml and by uploading it to the repository that hosts your catalog. When you create a dev box pool, you can select the customization file from the catalog to apply to the dev boxes in the pool.

## Related content

- [Microsoft Dev Box team customizations](concept-what-are-team-customizations.md)
- [Configure imaging for Dev Box team customizations](how-to-configure-customization-imaging.md)
- [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md)
