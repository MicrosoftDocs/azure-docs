---
title: Configure the Microsoft Security DevOps Azure DevOps extension
description: Learn how to configure the Microsoft Security DevOps Azure DevOps extension.
ms.date: 06/20/2023
ms.topic: how-to
ms.custom: ignite-2022
---

# Configure the Microsoft Security DevOps Azure DevOps extension

> [!NOTE]
> Effective December 31, 2022, the Microsoft Security Code Analysis (MSCA) extension is retired. MSCA is replaced by the Microsoft Security DevOps Azure DevOps extension. MSCA customers should follow the instructions in this article to install and configure the extension.

Microsoft Security DevOps is a command line application that integrates static analysis tools into the development lifecycle. Microsoft Security DevOps installs, configures, and runs the latest versions of static analysis tools (including, but not limited to, SDL/security and compliance tools). Microsoft Security DevOps is data-driven with portable configurations that enable deterministic execution across multiple environments.

The Microsoft Security DevOps uses the following Open Source tools:

| Name | Language | License |
|--|--|--|
| [AntiMalware](https://www.microsoft.com/windows/comprehensive-security) | AntiMalware protection in Windows from Microsoft Defender for Endpoint, that scans for malware and breaks the build if malware has been found. This tool scans by default on windows-latest agent. | Not Open Source |
| [Bandit](https://github.com/PyCQA/bandit) | Python | [Apache License 2.0](https://github.com/PyCQA/bandit/blob/master/LICENSE) |
| [BinSkim](https://github.com/Microsoft/binskim) | Binary--Windows, ELF | [MIT License](https://github.com/microsoft/binskim/blob/main/LICENSE) |
| [ESlint](https://github.com/eslint/eslint) | JavaScript | [MIT License](https://github.com/eslint/eslint/blob/main/LICENSE) |
| [Template Analyzer](https://github.com/Azure/template-analyzer) | ARM template, Bicep file | [MIT License](https://github.com/Azure/template-analyzer/blob/main/LICENSE.txt) |
| [Terrascan](https://github.com/accurics/terrascan) | Terraform (HCL2), Kubernetes (JSON/YAML), Helm v3, Kustomize, Dockerfiles, Cloud Formation | [Apache License 2.0](https://github.com/accurics/terrascan/blob/master/LICENSE) |
| [Trivy](https://github.com/aquasecurity/trivy) | container images, file systems, git repositories | [Apache License 2.0](https://github.com/aquasecurity/trivy/blob/main/LICENSE) |

> [!NOTE]
> Effective September 20, 2023, the secret scanning (CredScan) tool within the Microsoft Security DevOps (MSDO) Extension for Azure DevOps has been deprecated. MSDO secret scanning will be replaced with [GitHub Advanced Security for Azure DevOps](https://azure.microsoft.com/en-us/products/devops/github-advanced-security). 

## Prerequisites

- Admin privileges to the Azure DevOps organization are required to install the extension.

If you don't have access to install the extension, you must request access from your Azure DevOps organization's administrator during the installation process.

## Configure the Microsoft Security DevOps Azure DevOps extension

**To configure the Microsoft Security DevOps Azure DevOps extension**:

1. Sign in to [Azure DevOps](https://dev.azure.com/).

1. Navigate to **Shopping Bag** > **Manage extensions**.

    :::image type="content" source="media/msdo-azure-devops-extension/manage-extensions.png" alt-text="Screenshot that shows how to navigate to the manage extensions screen.":::

1. Select **Shared**.

    > [!Note]
    > If you've already [installed the Microsoft Security DevOps extension](https://marketplace.visualstudio.com/items?itemName=ms-securitydevops.microsoft-security-devops-azdevops), it will be listed in the Installed tab.

1. Select **Microsoft Security DevOps**.

    :::image type="content" source="media/msdo-azure-devops-extension/marketplace-shared.png" alt-text="Screenshot that shows where to select Microsoft Security DevOps.":::

1. Select **Install**.

1. Select the appropriate organization from the dropdown menu.

1. Select **Install**.

1. Select **Proceed to organization**.

## Configure your pipelines using YAML

**To configure your pipeline using YAML**:

1. Sign into [Azure DevOps](https://dev.azure.com/)

1. Select your project.

1. Navigate to **Pipelines**

1. Select **New pipeline**.

    :::image type="content" source="media/msdo-azure-devops-extension/create-pipeline.png" alt-text="Screenshot showing where to locate create pipeline in DevOps." lightbox="media/msdo-azure-devops-extension/create-pipeline.png":::

1. Select **Azure Repos Git**.

    :::image type="content" source="media/msdo-azure-devops-extension/repo-git.png" alt-text="Screenshot that shows you where to navigate to, to select Azure repo git.":::

1. Select the relevant repository.

    :::image type="content" source="media/msdo-azure-devops-extension/repository.png" alt-text="Screenshot showing where to select your repository.":::

1. Select **Starter pipeline**.

    :::image type="content" source="media/msdo-azure-devops-extension/starter-piepline.png" alt-text="Screenshot showing where to select starter pipeline.":::

1. Paste the following YAML into the pipeline:

    ```yml
    # Starter pipeline
    # Start with a minimal pipeline that you can customize to build and deploy your code.
    # Add steps that build, run tests, deploy, and more:
    # https://aka.ms/yaml
    trigger: none
    pool:
      vmImage: 'windows-latest'
    steps:
    - task: MicrosoftSecurityDevOps@1
      displayName: 'Microsoft Security DevOps'
    ```

1. To commit the pipeline, select **Save and run**.

The pipeline will run for a few minutes and save the results.

> [!NOTE]
> Install the SARIF SAST Scans Tab extension on the Azure DevOps organization in order to ensure that the generated analysis results will be displayed automatically under the Scans tab.

## Learn more

- Learn how to [create your first pipeline](/azure/devops/pipelines/create-first-pipeline).

- Learn how to [deploy pipelines to Azure](/azure/devops/pipelines/overview-azure).

## Next steps

Learn more about [Defender for DevOps](defender-for-devops-introduction.md).

Learn how to [connect your Azure DevOps](quickstart-onboard-devops.md) to Defender for Cloud.

[Discover misconfigurations in Infrastructure as Code (IaC)](iac-vulnerabilities.md).
