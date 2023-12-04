---
title: Configure the Microsoft Security DevOps Azure DevOps extension
description: Learn how to configure the Microsoft Security DevOps Azure DevOps extension.
ms.date: 06/20/2023
ms.topic: how-to
ms.custom: ignite-2022
---

# Configure the Microsoft Security DevOps Azure DevOps extension

Microsoft Security DevOps is a command line application that integrates static analysis tools into the development lifecycle. Microsoft Security DevOps installs, configures, and runs the latest versions of static analysis tools (including, but not limited to, SDL/security and compliance tools). Microsoft Security DevOps is data-driven with portable configurations that enable deterministic execution across multiple environments.

The Microsoft Security DevOps uses the following Open Source tools:

| Name | Language | License |
|--|--|--|
| [AntiMalware](https://www.microsoft.com/windows/comprehensive-security) | AntiMalware protection in Windows from Microsoft Defender for Endpoint, that scans for malware and breaks the build if malware has been found. This tool scans by default on windows-latest agent. | Not Open Source |
| [Bandit](https://github.com/PyCQA/bandit) | Python | [Apache License 2.0](https://github.com/PyCQA/bandit/blob/master/LICENSE) |
| [BinSkim](https://github.com/Microsoft/binskim) | Binary--Windows, ELF | [MIT License](https://github.com/microsoft/binskim/blob/main/LICENSE) |
| [ESlint](https://github.com/eslint/eslint) | JavaScript | [MIT License](https://github.com/eslint/eslint/blob/main/LICENSE) |
| [IaCFileScanner](iac-template-mapping.md) | Terraform, CloudFormation, ARM Template, Bicep | Not Open Source |
| [Template Analyzer](https://github.com/Azure/template-analyzer) | ARM Template, Bicep | [MIT License](https://github.com/Azure/template-analyzer/blob/main/LICENSE.txt) |
| [Terrascan](https://github.com/accurics/terrascan) | Terraform (HCL2), Kubernetes (JSON/YAML), Helm v3, Kustomize, Dockerfiles, CloudFormation | [Apache License 2.0](https://github.com/accurics/terrascan/blob/master/LICENSE) |
| [Trivy](https://github.com/aquasecurity/trivy) | container images, Infrastructure as Code (IaC) | [Apache License 2.0](https://github.com/aquasecurity/trivy/blob/main/LICENSE) |

> [!NOTE]
> Effective September 20, 2023, the secret scanning (CredScan) tool within the Microsoft Security DevOps (MSDO) Extension for Azure DevOps has been deprecated. MSDO secret scanning will be replaced with [GitHub Advanced Security for Azure DevOps](https://azure.microsoft.com/products/devops/github-advanced-security). 

## Prerequisites

- Project Collection Administrator privileges to the Azure DevOps organization are required to install the extension.

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
      # ubuntu-latest also supported.
      vmImage: 'windows-latest'
    steps:
    - task: MicrosoftSecurityDevOps@1
      displayName: 'Microsoft Security DevOps'
      inputs:    
      # command: 'run' | 'pre-job' | 'post-job'. Optional. The command to run. Default: run
      # config: string. Optional. A file path to an MSDO configuration file ('*.gdnconfig').
      # policy: 'azuredevops' | 'microsoft' | 'none'. Optional. The name of a well-known Microsoft policy. If no configuration file or list of tools is provided, the policy may instruct MSDO which tools to run. Default: azuredevops.
      # categories: string. Optional. A comma-separated list of analyzer categories to run. Values: 'secrets', 'code', 'artifacts', 'IaC', 'containers. Example: 'IaC,secrets'. Defaults to all.
      # languages: string. Optional. A comma-separated list of languages to analyze. Example: 'javascript,typescript'. Defaults to all.
      # tools: string. Optional. A comma-separated list of analyzer tools to run. Values: 'bandit', 'binskim', 'eslint', 'templateanalyzer', 'terrascan', 'trivy'.
      # break: boolean. Optional. If true, will fail this build step if any error level results are found. Default: false.
      # publish: boolean. Optional. If true, will publish the output SARIF results file to the chosen pipeline artifact. Default: true.
      # artifactName: string. Optional. The name of the pipeline artifact to publish the SARIF result file to. Default: CodeAnalysisLogs*.
    
    ```

    > [!NOTE]
    > The artifactName 'CodeAnalysisLogs' is required for integration with Defender for Cloud.

1. To commit the pipeline, select **Save and run**.

The pipeline will run for a few minutes and save the results.

> [!NOTE]
> Install the SARIF SAST Scans Tab extension on the Azure DevOps organization in order to ensure that the generated analysis results will be displayed automatically under the Scans tab.

## Learn more

- Learn how to [create your first pipeline](/azure/devops/pipelines/create-first-pipeline).

## Next steps

Learn more about [DevOps Security in Defender for Cloud](defender-for-devops-introduction.md).

Learn how to [connect your Azure DevOps Organizations](quickstart-onboard-devops.md) to Defender for Cloud.
