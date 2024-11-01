---
title: Write a customization file
description: Learn how to create and test a customization file for your dev box using Visual Studio Code and Dev Home.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: how-to
ms.date: 10/26/2024

#customer intent: As a dev center administrator or DevCenter Project Admin I want to create image definition files so that my development teams can create customized dev boxes.
---

# Write a Team Customization file for Dev Box
In this article, you learn how to create and test a customization file for your dev box using Visual Studio Code and Dev Home. This article helps you define new tasks in your customization file, apply them to your dev boxes, and test these customizations directly in Visual Studio Code. Ensure that a catalog with tasks is attached to the dev center before you begin.

## Prerequisites

To complete the steps in this article, you must:
- Have a [dev center configured with a dev box definition, dev box pool, and dev box project](./quickstart-configure-dev-box-service.md) configured so that you can create a dev box. 
- Be a member of the Dev Box Users security group for at least one project.
- Have a catalog attached to the dev center with tasks that you can use in your customization file. If you don't have a catalog, see [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md).

## Permissions required to configure customizations
  
[!INCLUDE [permissions-for-customizations](includes/permissions-for-customizations.md)]

## What is a customization file?
Dev Box customizations use a yaml formatted file to specify a list of tasks to apply from the catalog when creating a new dev box. These customization files include one or more `tasks`, which identify the catalog task and provide parameters like the name of the software to install. The customization file is then made available to the developers creating new dev boxes. The following example uses a winget task to install Visual Studio Code, and a git clone task to clone a repository.

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

## Create a Team Customization File (definition.yaml)

Creating a team customization file standardizes and streamlines creating preconfigured dev boxes for your development teams. You can create and manage customization files with Visual Studio Code or Dev Home.

Select the method you want to use to create a customization file:

#### [Visual Studio Code](#tab/visual-studio-code)
You can use a Visual Studio Code extension to discover the tasks in the attached catalog.
1. Create a Dev Box (or use an existing Dev Box) for testing.
1. On the test dev box, install Visual Studio Code and then install the [Dev Box VS Code extension](https://aka.ms/devbox/preview/customizations/vsc-extension).
1. Download an [example yaml customization file](https://aka.ms/devbox/customizations/samplefile) from the samples repository and open it in Visual Studio Code.
1. Discover tasks available in the catalog by using the command palette. From **View** > **Command Palette**, select **Dev Box: List available tasks for this dev box**.

   :::image type="content" source="media/how-to-write-customization-file/dev-box-command-list-tasks.png" alt-text="Screenshot of the Dev Box command palette in Visual Studio Code, showing the 'Dev Box: List available tasks for this dev box' command.":::

1. Test customization in Visual Studio Code by using f5/command palette. From **View** > **Command Palette**, select **Dev Box: Apply customizations tasks**.

   :::image type="content" source="media/how-to-write-customization-file/dev-box-command-apply-tasks.png" alt-text="Screenshot of the Dev Box command palette in Visual Studio Code, showing the 'Dev Box: Apply customizations tasks' command.":::

1. The customization file runs immediately, applying the specified tasks to your test dev box. Inspect the changes and check the Visual Studio Code terminal for any errors or warnings generated during the task execution.
1. When the customization file runs successfully, share it with developers to upload when they create a new dev box.
 
#### [Dev Home](#tab/dev-home)
You can use Dev Home to create a customization file for your development team. Dev home gives you the opportunity to clone repositories and add software to your existing dev box. Dev Home uses the Winget catalog to provide a list of software that you can install on your dev box.

1. Open **Dev Home**.
1. From the left menu, select **Machine configuration**.

   :::image type="content" source="media/how-to-write-customization-file/dev-home-machine-configuration.png" alt-text="Screenshot showing Dev Home with Machine configuration highlighted.":::

1. Select **Set up an environment**.
 
   :::image type="content" source="media/how-to-write-customization-file/dev-home-set-up-environment.png" alt-text="Screenshot showing the Machine configuration page with Set up environment highlighted."::: 

1. Select the environment you want to customize, and then select **Next**.
 
   :::image type="content" source="media/how-to-write-customization-file/dev-home-select-environment.png" alt-text="Screenshot showing the Select environment page."::: 
 
1. On the **Set up an environment** page, if you want to clone a repository to your dev box, select **Add repository**. 

   :::image type="content" source="media/how-to-write-customization-file/dev-home-add-repository.png" alt-text="Screenshot showing the Add repository button.":::

1. In the **Add repository** dialog, enter the source and destination paths for the repository you want to clone, and then select **Add**.

   :::image type="content" source="media/how-to-write-customization-file/dev-home-clone-repository.png" alt-text="Screenshot showing the Add repository dialog box.":::

1. When you finish adding repositories, select **Next**.

   :::image type="content" source="media/how-to-write-customization-file/dev-home-repository-next.png" alt-text="Screenshot showing the repositories to add, with the Next button highlighted dialog box.":::  

1. Next, you can choose software to install. From the list of applications Winget provides, choose the software you want to install on your dev box. You can also search for software by name.

    :::image type="content" source="media/how-to-write-customization-file/dev-home-software-select.png" alt-text="Screenshot showing the Add software page with Visual Studio Community and PowerShell highlighted.":::

1. When you finish selecting software, select **Next**. 

    :::image type="content" source="media/how-to-write-customization-file/dev-home-software-install.png" alt-text="Screenshot showing the Add software page with Next highlighted.":::

1. On the **Review and finish** page, under **See details**:
    1. Select the **Environment** tab to see the virtual machine you're configuring.
    1. Select the **Applications** tab to see a list of the software you're installing.
    1. Select the **Repositories** tab to see the list of public GitHub repositories you're cloning.
1. Select **I agree and want to continue**, and then select **Set up**.
 
      :::image type="content" source="media/how-to-write-customization-file/dev-home-review-finish.png" alt-text="Screenshot showing the Review and finish page with the I agree and want to continue button highlighted.":::
 

Notice that you can also generate a customization file based on your selected repositories and software to use in the future to create dev boxes with the same customizations.

:::image type="content" source="media/how-to-write-customization-file/dev-home-configuration-file.png" alt-text="Screenshot showing the Review and finish page with the Generate configuration file button highlighted.":::

---

## Use GitHub Copilot to write a customization file
The Microsoft Dev Box extension for Visual Studio Code integrates with GitHub Copilot Chat to bring the power of AI to creating your customization file. You can use GitHub Copilot to help write a customization file for your development team. 

There are two commands that you can use with the Dev Box chat agent:
   - Tasks: Lists available tasks for this dev box, and answers task related questions.
   - Customize: Generates custom tasks based on your commands and available tasks.

To use GitHub Copilot, you need to install the GitHub Copilot extension in Visual Studio Code. For more information, see [GitHub Copilot](https://code.visualstudio.com/docs/copilot/overview).

To invoke the Dev Box chat agent:
1. In Visual Studio Code, open a customization file. 
1. From the Activity Bar, select Chat.
1. In the chat box, enter **@devbox**.
 
   :::image type="content" source="media/how-to-write-customization-file/github-copilot-chat-dev-box-commands.png" alt-text="Screenshot of GitHub Copilot Chat in Visual Studio Code, showing the 'devbox' command and two available commands: 'Tasks' and 'Customize'.":::

1. To list available tasks for this dev box, enter **@devbox /tasks list-tasks** in the chat box.

    You see the list of available tasks in the chat box. These tasks are available in the catalog attached to the dev center, or in the catalog attached to your project.

    :::image type="content" source="media/how-to-write-customization-file/github-copilot-chat-dev-box-tasks-available.png" alt-text="Screenshot showing available tasks for the dev box in GitHub Copilot Chat.":::

1. To ask a task based question, enter your question in Copilot Chat. Try it: enter **@devbox /tasks Are there any tasks to clone a repo?** in the chat box.

    :::image type="content" source="media/how-to-write-customization-file/github-copilot-chat-dev-box-task-question.png" alt-text="Screenshot showing a task based question in GitHub Copilot Chat.":::

    This example clones the microsoft/calculator repository to the C:\Workspaces directory.

1. To generate a custom task, enter **@devbox /customize** and a description of the task you want to create. Try it: enter **@devbox /customize I want to install notepad++ and vscode** in the chat box.

    :::image type="content" source="media/how-to-write-customization-file/github-copilot-chat-dev-box-customize.png" alt-text="Screenshot showing a custom task generated in GitHub Copilot Chat.":::

    This example installs Notepad++ and Visual Studio Code on the dev box.

    You can select **Generate Workload.yaml File** to create a file with the custom task. You can then rename the *workload.yaml* file to *imagedefintion.yaml*for use in your team customizations.

## Use secrets from an Azure Key Vault
You can use secrets from your Azure Key Vault in your yaml customizations to clone private repositories, or with any custom task you author that requires an access token.
To configure your Key Vault secrets for use in your yaml customizations,
1. Ensure that your dev center project's managed identity has the Key Vault Reader role and Key Vault Secrets User role on your key vault.
2. Grant the Secrets User role for the Key Vault secret to each user or user group who should be able to consume the secret during the customization of a dev box. The user or group granted the role must include the managed identity for the dev center, your own user account, and any user or group who needs the secret during the customization of a dev box.

For more information, see:
- [Learn how to Configure a managed identity for a dev center](../deployment-environments/how-to-configure-managed-identity.md#configure-a-managed-identity-for-a-dev-center).
- [Learn how to Grant the managed identity access to the key vault secret](../deployment-environments/how-to-configure-managed-identity.md#grant-the-managed-identity-access-to-the-key-vault-secret).

You can reference the secret in your yaml customization in the following format, using the git-clone task as an example:

```yml
$schema: "1.0"
tasks:
   name: git-clone
   description: Clone this repository into C:\Workspaces
      parameters:
         repositoryUrl: https://myazdo.visualstudio.com/MyProject/_git/myrepo
         directory: C:\Workspaces
         pat: '{{KEY_VAULT_SECRET_URI}}'
```

If you wish to clone a private Azure Repos repository, you don't need to configure a secret in Key Vault. Instead, you can use `{{ado}}`, or `{{ado://your-ado-organization-name}}` as a parameter. This fetches an access token on your behalf when creating a dev box, which has read-only permission to your repository. The git-clone task in the quickstart catalog uses the access token to clone your repository. Here's an example:

```yml
tasks:
   name: git-clone
   description: Clone this repository into C:\Workspaces
      parameters:
         repositoryUrl: https://myazdo.visualstudio.com/MyProject/_git/myrepo
         directory: C:\Workspaces
         pat: '{{ado://YOUR_ADO_ORG}}'
```

If your organization's policies require you to keep your Key Vault private from the internet, you can set your Key Vault to allow trusted Microsoft services to bypass your firewall rule.

:::image type="content" source="media/how-to-write-customization-file/trusted-services-bypass-firewall.png" alt-text="text":::
 
To learn how to allow trusted Microsoft services to bypass the firewall, see [Configure Azure Key Vault networking settings](/azure/key-vault/general/how-to-azure-key-vault-network-security).

## Share a customization file from a code repository
Make your customization file available to dev box pools by naming it *definition.yaml* and uploading it to the repository that hosts your catalog. When you create a dev box pool, you can select the customization file from the catalog to apply to the dev boxes in the pool.

## Related content
- [Microsoft Dev Box Team Customizations](concept-what-are-team-customizations.md)
- [Configure imaging for Dev Box Team Customizations](how-to-configure-customization-imaging.md)
- [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md)