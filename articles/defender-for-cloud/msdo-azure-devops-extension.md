---
title: Configure the Microsoft Security DevOps Azure DevOps extension
description: Learn how to configure the Microsoft Security DevOps Azure Devops extension.
ms.date: 05/18/2022
ms.topic: how-to
---

# Configure the Microsoft Security DevOps Azure DevOps extension

Microsoft Security DevOps is a command line application that integrates static analysis tools into the development lifecycle. Microsoft Security DevOps installs, configures, and runs the latest versions of static analysis tools (including, but not limited to, SDL/security and compliance tools). Microsoft Security DevOps is data-driven with portable configurations that enable deterministic execution across multiple environments.

The Microsoft Security DevOps uses the following Open Source tools:

| Name | Language | License |
|--|--|--|
| [Bandit](https://github.com/PyCQA/bandit) | Python | [Apache License 2.0](https://github.com/PyCQA/bandit/blob/master/LICENSE) |
| [BinSkim](https://github.com/Microsoft/binskim) | Binary--Windows, ELF | [MIT License](https://github.com/microsoft/binskim/blob/main/LICENSE) |
| [ESlint](https://github.com/eslint/eslint) | JavaScript | [MIT License](https://github.com/eslint/eslint/blob/main/LICENSE) |
| [Credscan](https://secdevtools.azurewebsites.net/helpcredscan.html) | Credential Scanner (also known as CredScan) is a tool developed and maintained by Microsoft to identify credential leaks such as those in source code and configuration files <br> common types: default passwords, SQL connection strings, Certificates with private keys | Not Open Source |
| [Template Analyzer](https://github.com/Azure/template-analyzer) | ARM template | [MIT License](https://github.com/Azure/template-analyzer/blob/main/LICENSE.txt) |
| [Terrascan](https://github.com/accurics/terrascan) | Terraform (HCL2), Kubernetes (JSON/YAML), Helm v3, Kustomize, Dockerfiles, Cloud Formation | [Apache License 2.0](https://github.com/accurics/terrascan/blob/master/LICENSE) |
| [Trivy](https://github.com/aquasecurity/trivy) | container images, file systems, git repositories | [Apache License 2.0](https://github.com/aquasecurity/trivy/blob/main/LICENSE) |

## Prerequisites 

- Admin privileges to the Azure DevOps organization are required to install the extension. 

If you don't have access to install the extension, you must request access from your Azure DevOps organization's administrator during the installation process.

## Configure the Microsoft Security DevOps extension

**To configure the Microsoft Security DevOps extension**:

1.  Sign into [Azure DevOps](https://dev.azure.com/)

1.  Navigate to **Shopping Bag** > **Manage extensions**.

    :::image type="content" source="media/msdo-azure-devops-extension/manage-extensions.png" alt-text="Screenshot that shows how to navigate to the manage extensions screen.":::

1.  Select **Shared**.

    > [!Note]
    > If you have already installed the Microsoft Security DevOps extension, it will be listed in the Installed tab.

1.  Select **Microsoft Security DevOps extension**.

1. Select **Install**.

1. Select the appropriate Organization from the dropdown menu.

1. Select **Install**.

1. Select **Proceed to organization**.

## Configure your Pipelines using YAML

1.  Sign into [Azure DevOps](https://dev.azure.com/)

1.  Navigate to **Project** > **Pipelines**

1. Select **Create Pipeline**.

    :::image type="content" source="../batch/media/run-python-batch-azure-data-factory/create-pipeline.png" alt-text="Screenshot showing where to locate create pipeline in DevOps.":::

1. Select **Azure Repos Git**.

1.  Select a repository.

    :::image type="content" source="media/msdo-azure-devops-extension/repository.png" alt-text="Screenshot showing where to select your repository.":::

5.  Select **Starter pipeline**.

    :::image type="content" source="media/msdo-azure-devops-extension/starter-piepline.png" alt-text="Screenshot showing where to select starter pipeline.":::

6.  Paste the following YAML into the pipeline

    ```yml
    # Starter pipeline
    # Start with a minimal pipeline that you can customize to build and deploy your code.
    # Add steps that build, run tests, deploy, and more
    # https://aka.ms/yaml
    trigger:
    - main
    pool:
    vmImage: windows-latest
    steps:
    - task: UseDotNet@2
    displayName: \'Use dotnet\'
    inputs:
    version: 3.1.x
    - task: UseDotNet@2
    displayName: \'Use dotnet\'
    inputs:
    version: 5.0.x
    - task: UseDotNet@2
    displayName: \'Use dotnet\'
    inputs:
    version: 6.0.x
    - task: MicrosoftSecurityDevOps@1
    displayName: \'Microsoft Security DevOps\'
    ```

1. Select **Save and run**.

1. Select **Save and run** to commit the pipeline.

    :::image type="content" source="media/msdo-azure-devops-extension/sand-and-run.png" alt-text="Screenshot showing where to select save and run.":::

Pipelines will run for a few minutes and save the results.

### Configure WHAT???? using Azure DevOps Pipeline Classic Editor

1. Sign into [Azure DevOps](https://dev.azure.com/)

1. Navigate to **Project** > **Pipelines**.

1. Select **Create Pipeline**.

1. Select **Use the classic editor to create a pipeline without YAML**.

1. Select a source, Team project, Repository, and Default branch from the dropdown menus.

1. Select **Continue**.

    :::image type="content" source="media/msdo-azure-devops-extension/selection-screen.png" alt-text="Screenshot showing where to select, source, team project, repository and default branch.":::

1. Select **Empty job**.

    :::image type="content" source="media/msdo-azure-devops-extension/empty-job.png" alt-text="Screenshot showing where to locate the empty job button.":::

1. On the Agent job 1, select **+**.

    :::image type="content" source="media/msdo-azure-devops-extension/plus-sign.png" alt-text="Screenshot showing where to locate the + sign.":::

1. In the search box, search for `Use .NET Core`.

1. Select **Add** three times.

1. In the search box, search for `Microsoft Security`. 

1. Select **Add**.

    :::image type="content" source="media/msdo-azure-devops-extension/add.png" alt-text="Screenshot showing where to select add.":::

1. Select the first **Use .NET Core sdk**, and set the versions as **3.1.x**. Repeat for the next two and fill in version **5.0.x**, and then **6.0.x**.

    :::image type="content" source="media/msdo-azure-devops-extension/set-versions.png" alt-text="Screenshot showing you how each Use .NET Core should be set with each version number.":::

1. Select **Save & queue**, then **Save & queue**.

    :::image type="content" source="media/msdo-azure-devops-extension/save-and-queue.png" alt-text="Screenshot showing where to go to select save and queue. ":::

1. Enter a meaningful comment, for example, `Microsoft Security DevOps added`.

1. Select **Save and run**.

    :::image type="content" source="media/msdo-azure-devops-extension/comment-and-save.png" alt-text="Screenshot showing where to enter a comment and where to select save.":::

The process will run for a few minutes and results will be saved. 

## Next steps

