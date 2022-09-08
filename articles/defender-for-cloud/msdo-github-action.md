---
title: Configure the Microsoft Security DevOps GitHub action
description: Learn how to configure the Microsoft Security DevOps GitHub action.
ms.date: 09/08/2022
ms.topic: how-to
---

# Configure the Microsoft Security DevOps GitHub action

Microsoft Security DevOps is a command line application that integrates static analysis tools into the development lifecycle. Security DevOps installs, configures, and runs the latest versions of static analysis tools such as, SDL, security and compliance tools. Security DevOps is data-driven with portable configurations that enable deterministic execution across multiple environments.

Security DevOps uses the following Open Source tools:

| Name | Language | License |
|--|--|--|
| [Bandit](https://github.com/PyCQA/bandit) | Python | [Apache License 2.0](https://github.com/PyCQA/bandit/blob/master/LICENSE) |
| [BinSkim](https://github.com/Microsoft/binskim) | Binary--Windows, ELF | [MIT License](https://github.com/microsoft/binskim/blob/main/LICENSE) |
| [ESlint](https://github.com/eslint/eslint) | JavaScript | [MIT License](https://github.com/eslint/eslint/blob/main/LICENSE) |
| [Template Analyzer](https://github.com/Azure/template-analyzer) | ARM template, Bicep file | [MIT License](https://github.com/Azure/template-analyzer/blob/main/LICENSE.txt) |
| [Terrascan](https://github.com/accurics/terrascan) | Terraform (HCL2), Kubernetes (JSON/YAML), Helm v3, Kustomize, Dockerfiles, Cloud Formation | [Apache License 2.0](https://github.com/accurics/terrascan/blob/master/LICENSE) |
| [Trivy](https://github.com/aquasecurity/trivy) | container images, file systems, git repositories | [Apache License 2.0](https://github.com/aquasecurity/trivy/blob/main/LICENSE) |

## Prerequisite

- [Connect your GitHub repositories](quickstart-onboard-github.md).

- Follow the guidance to set up [GitHub Advanced Security](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/managing-security-and-analysis-settings-for-your-organization).

- Open [Microsoft DevOps Security GitHub action](https://github.com/marketplace/actions/security-devops-action) in a new window.

## Configure the Microsoft Security DevOps GitHub action

**To setup GitHub action**:

1. Sign in to [GitHub](https://www.github.com).

1. Select a repository on which you want to configure the GitHub action.

1. Select **Actions**.

    :::image type="content" source="media/msdo-github-action/actions.png" alt-text="Screenshot that shows you where the Actions button is located.":::

1. Select **New workflow**.

1. On the Get started with GitHub Actions page, select **set up a workflow yourself**

    :::image type="content" source="media/msdo-github-action/new-workflow.png" alt-text="Screenshot showing where to select the new workflow button.":::

1. In the text box, enter a name for your workflow file. For example, `msdevopssec.yml`.

    :::image type="content" source="media/msdo-github-action/devops.png" alt-text="Screenshot that shows you where to enter a name for your new workflow.":::

1. Copy and paste the following [sample action workflow](https://github.com/microsoft/security-devops-action/blob/main/.github/workflows/sample-workflow-windows-latest.yml) into the Edit new file tab.

    ```yml
    name: MSDO windows-latest
    on:
      push:
        branches:
          - main

    jobs:
      sample:
        name: Microsoft Security DevOps Analysis

        # MSDO runs on windows-latest.
        # ubuntu-latest and macos-latest supporting coming soon
        runs-on: windows-latest

      steps:

      # Checkout your code repository to scan
    - uses: actions/checkout@v2

      # Install dotnet, used by MSDO
    - uses: actions/setup-dotnet@v1
      with:
        dotnet-version: |
          5.0.x
          6.0.x

      # Run analyzers
    - name: Run Microsoft Security DevOps Analysis
      uses: microsoft/security-devops-action@preview
      id: msdo

      # Upload alerts to the Security tab
    - name: Upload alerts to Security tab
      uses: github/codeql-action/upload-sarif@v1
      with:
        sarif_file: ${{ steps.msdo.outputs.sarifFile }}

      # Upload alerts file as a workflow artifact
    - name: Upload alerts file as a workflow artifact
      uses: actions/upload-artifact@v3
      with:  
        name: alerts
        path: ${{ steps.msdo.outputs.sarifFile }}
    ```
        
    For details on various input options, see [action.yml](https://github.com/microsoft/security-devops-action/blob/main/action.yml)`                    

1.  Select **Start commit**

    :::image type="content" source="media/msdo-github-action/start-commit.png" alt-text="Screenshot showing you where to select start commit.":::

1.  Select **Commit new file**.

    :::image type="content" source="media/msdo-github-action/commit-new.png" alt-text="Screenshot showing you how to commit a new file.":::

    The process can take up to one minute to complete.

1. Select **Actions** and  verify the new action is running.

    :::image type="content" source="media/msdo-github-action/verify-actions.png" alt-text="Screenshot showing you where to navigate to, to see that your new action is running.":::

## Steps: View Scan Results

**To view your scan results**:

1. Sign in to [GitHub](https://www.github.com).

1. Navigate to **Security** > **Code scanning alerts** > **Tool**. 

1. From the dropdown menu, select **Filter by tool**.

**THEN WHAT THIS IS UNCLEAR**

:::image type="content" source="media/msdo-github-action/tool-dropdown.png" alt-text="Screenshot showing you how to navigate to the filter by tool option.":::

## Learn more

- You can learn about [GitHub actions for Azure](/azure/developer/github/github-actions).
- Learn how to [deploy apps from GitHub to Azure](/azure/developer/github/deploy-to-azure).

## Next steps
[Configure the Microsoft Security DevOps Azure DevOps extension](msdo-azure-devops-extension.md)
