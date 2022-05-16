---
title: 'Tutorial: Discover vulnerabilities in Infrastructure as Code'
description: Learn how to use Defender for DevOps to discover vulnerabilities in Infrastructure as Code (IAC)
ms.date: 05/16/2022
ms.topic: tutorial
---

# Tutorial: Discover vulnerabilities in Infrastructure as Code (IaC)

After setting up the Microsoft Security DevOps Extension, or Workflow, there is additional support located in the YAML configuration that can be used to run a tool, or several of the tools. For example, setting up Infrastructure as Code (IaC) scanning.

## Prerequisites

- [Configure Microsoft Security DevOps GitHub action](msdo-github-action.md) prior to starting this tutorial.
- [Setup and configure the Microsoft Security DevOps the Extension](msdo-azure-devops-extension.md)

## View the results of the IaC scan in GitHub 

1. Sign in to [Github](https://www.github.com). 

1. Navigate to the repository home page.

1. Select the **.github/workflows** folder.

    :::image type="content" source="media/tutorial-iac-vulnerabilities/github-workflow-folder.png" alt-text="Screenshot showing where to locate the github workflow foleder.":::

1. Select **workflow .yml**, that was created in the [prerequisites](msdo-github-action.md#setup-github-action).

    :::image type="content" source="media/tutorial-iac-vulnerabilities/workflow-yaml.png" alt-text="Screenshot that shows where to find the workflow yaml.":::

1. Select **Edit**.

1. Under the Run Analyzers section, add the following:

    ```yml
    with:
        categories: 'Iac"
    ```

    :::image type="content" source="media/tutorial-iac-vulnerabilities/add-to-yaml.png" alt-text="Screenshot that shows the information that needs to be added to the yaml file.":::

1. Select **Start Commit-\>Commit changes**.

1. (Optional) Skip this step if you already have an IaC template in your repository.

     [Install an IaC template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-basic-linux).

    ```azcopy
    HOW IS THIS DONE???????
    1.  Upload the template to your repository and commit the template to your repository 
    ```

1. Select **Actions**. 

1. Select the workflow to see the results.

1. Navigate in the results to the scan results section.

    :::image type="content" source="media/tutorial-iac-vulnerabilities/scan-results.png" alt-text="Screenshot showing you where to navigate to, to see the scan results.":::

1. To see the results in the GitHub Code scanning interface, navigate to **Security** > **Code scanning alerts**.

    :::image type="content" source="media/tutorial-iac-vulnerabilities/code-scan-results.png" alt-text="Screenshot that shows you how to find the results of your doe scan.":::

## View the results of the IaC scan in Azure DevOps

**To view the results of the IaC scan in Azure DevOps**

1. Sign into [Azure DevOps](https://dev.azure.com/)

1. Navigate to **Pipeline**.

1. Locate the pipeline with MSDO Azure DevOps Extension configured.

2. Select **Edit**.

3. Add the following lines to the YAML file

    ```yml
    inputs:
        categories: 'IaC'
    ```
    :::image type="content" source="media/tutorial-iac-vulnerabilities/addition-to-yaml.png" alt-text="Screenshot showing you where to add this line to the YAML file.":::

4.  Select **Save**.

5.  Select **Save** to commit directly to the main branch or Create a new branch for this commit

6.  Select **Pipeline** > **`Your created pipeline`** to view the results of the IaC scan. and click on 

    :::image type="content" source="media/tutorial-iac-vulnerabilities/your-pipeline.png" alt-text="Screenshot showing you where your pipeline is located.":::

1. Select any result to see the details.

    :::image type="content" source="media/tutorial-iac-vulnerabilities/results-from-scan.png" alt-text="Screenshot that shows you where the results from your scan can be found.":::

## Next steps

In this tutorial you learned how to configure the Microsoft Security DevOps GitHub Action and Azure DevOps Extension to scan for only Infrastructure as Code vulnerabilities.
