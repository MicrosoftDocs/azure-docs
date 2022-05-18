---
title: Enable Microsoft Security DevOps GitHub Action
description: 
ms.date: 05/18/2022
ms.topic: how-to
---

# Enable Microsoft Security DevOps GitHub Action

Microsoft Security DevOps is a command line application that integrates static analysis tools into the development lifecycle. Microsoft Security DevOps installs, configures, and runs the latest versions of static analysis tools such as, SDL/security and compliance tools. Microsoft Security DevOps is data-driven with portable configurations that enable deterministic execution across multiple environments.

The Microsoft Security DevOps uses the following Open Source tools:

| Name | Language | License |
|--|--|--|
| [Bandit](https://github.com/PyCQA/bandit) | Python | [Apache License 2.0](https://github.com/PyCQA/bandit/blob/master/LICENSE) |
| [BinSkim](https://github.com/Microsoft/binskim) | Binary--Windows, ELF | [MIT License](https://github.com/microsoft/binskim/blob/main/LICENSE) |
| [ESlint](https://github.com/eslint/eslint) | JavaScript | [MIT License](https://github.com/eslint/eslint/blob/main/LICENSE) |
| [Template Analyzer](https://github.com/Azure/template-analyzer) | ARM template | [MIT License](https://github.com/Azure/template-analyzer/blob/main/LICENSE.txt) |
| [Terrascan](https://github.com/accurics/terrascan) | Terraform (HCL2), Kubernetes (JSON/YAML), Helm v3, Kustomize, Dockerfiles, Cloud Formation | [Apache License 2.0](https://github.com/accurics/terrascan/blob/master/LICENSE) |
| [Trivy](https://github.com/aquasecurity/trivy) | container images, file systems, git repositories | [Apache License 2.0](https://github.com/aquasecurity/trivy/blob/main/LICENSE) |

## Prerequisite

- Follow the guidance to set up [GitHub Advanced Security](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/managing-security-and-analysis-settings-for-your-organization).

- Navigate to the Microsoft DevOps Security GitHub Action [here](https://github.com/marketplace/actions/security-devops-action)
**WHY DO WE NEED TO DO THIS**

## Setup GitHub Action

1. Sign in [GitHub](https://www.github.com).

1. Select a repository to configure the GitHub Action to.

1. Select **Actions**.

    :::image type="content" source="media/msdo-github-action/actions.png" alt-text="Screenshot that shows you where the Actions button is located.":::

1.  Select **New workflow**.

1.  On the Get started with GitHub Actions page, select **set up a workflow yourself**

    :::image type="content" source="media/msdo-github-action/new-workflow.png" alt-text="Screenshot showing where to select the new workflow button.":::

1.  In the text box, enter a name for your workflow file. For example, `msdevopssec.yml`.

    :::image type="content" source="media/msdo-github-action/devops.png" alt-text="Screenshot showin you where to enter a name for your new worflow.":::

1.  Copy and paste the [sample action workflow](https://github.com/microsoft/security-devops-action/blob/main/.github/workflows/sample-workflow-windows-latest.yml) into the Edit new file field.

    ```yml
    name: MicrosoftDevOpsSecurity
     # Controls when the workflow will run
     on:
     # Triggers the workflow on push or pull request events but only for the main branch                                                       
     push:
     branches: \[ main \]
     pull_request:
     branches: \[ main \]
     # Allows you to run this workflow manually from the Actions tab
     workflow_dispatch:
     # A workflow run is made up of one or more jobs that can run sequentially or in parallel
     jobs:
     # This workflow contains a single job called \"build\"
     build:
     # The type of runner that the job will run on
     runs-on: windows-latest
     steps:
     # Checkout your code repository
     - uses: actions/checkout@v2
     # Install dotnet
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
     sarif_file: \${{ steps.msdo.outputs.sarifFile }}
    ``` 
    For details on various input options, see [action.yml](https://github.com/microsoft/security-devops-action/blob/main/action.yml)`                    

1.  Select **Start commit**

    :::image type="content" source="media/msdo-github-action/start-commit.png" alt-text="Screenshot showing you where to select start commit.":::

1.  Select **Commit new file**.

    :::image type="content" source="media/msdo-github-action/commit-new.png" alt-text="Screenshot showing you where to select commit new file.":::

1. Select **Actions** and  verify the new action is running.

    :::image type="content" source="media/msdo-github-action/verify-actions.png" alt-text="Screenshot showing you where to navigate to, to see that your new action is running.":::

## Steps: View Scan Results

**To view your scan results**:

1. Sign in [GitHub](https://www.github.com).

1. Select **Security**.

1. Select **Code scanning alerts**.

1. Select **Tool**. 

1. Dropdown menu to "Filter by tool"

**THEN WHAT THIS IS UNCLEAR**

    :::image type="content" source="media/msdo-github-action/tool-dropdown.png" alt-text="Screenshot showing you how to navigate to the filter by tool option.":::

## Next steps
