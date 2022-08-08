---
title: Discover vulnerabilities in Infrastructure as Code
description: Learn how to use Defender for DevOps to discover vulnerabilities in Infrastructure as Code (IAC)
ms.date: 08/08/2022
ms.topic: how-to
---

# Discover vulnerabilities in Infrastructure as Code (IaC)

Once you have set up the Microsoft Security DevOps Extension, or Workflow, there is additional support located in the YAML configuration that can be used to run a tool, or several of the tools. For example, setting up Infrastructure as Code (IaC) scanning.

## Prerequisites

- [Configure Microsoft Security DevOps GitHub action](msdo-github-action.md).
- [Configure the Microsoft Security DevOps extension](msdo-azure-devops-extension.md).

## View the results of the IaC scan in GitHub 

1. Sign in to [Github](https://www.github.com). 

1. Navigate to **`your repository's home page`** > **.github/workflows** > **msdevopssec.yml** that was created in the [prerequisites](msdo-github-action.md#setup-github-action).

1. Select **Edit file**.

    :::image type="content" source="media/tutorial-iac-vulnerabilities/workflow-yaml.png" alt-text="Screenshot that shows where to find the edit button for the msdevopssec.yml file.":::

1. Under the Run Analyzers section, add the following: **DOES NOT EXIST**

    ```yml
    with:
        categories: 'Iac"
    ```

    :::image type="content" source="media/tutorial-iac-vulnerabilities/add-to-yaml.png" alt-text="Screenshot that shows the information that needs to be added to the yaml file.":::

1. Select **Start Commit** 

1. Select **Commit changes**.

    :::image type="content" source="media/tutorial-iac-vulnerabilities/commit-change.png" alt-text="Screenshot that shows where to select commit change on the githib page.":::

1. (Optional) Skip this step if you already have an IaC template in your repository.

    Follow this link to [Install an IaC template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-basic-linux).

    1. Select `azuredeploy.json`.
    
        :::image type="content" source="media/tutorial-iac-vulnerabilities/deploy-json.png" alt-text="Screenshot that shows where the deploy.json file is located.":::

    1. Select **Raw**
    
    1. Copy all of the information in the file.

    ```Bash
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "webAppName": {
          "type": "string",
          "defaultValue": "AzureLinuxApp",
          "metadata": {
            "description": "Base name of the resource such as web app name and app service plan "
          },
          "minLength": 2
        },
        "sku": {
          "type": "string",
          "defaultValue": "S1",
          "metadata": {
            "description": "The SKU of App Service Plan "
          }
        },
        "linuxFxVersion": {
          "type": "string",
          "defaultValue": "php|7.4",
          "metadata": {
            "description": "The Runtime stack of current web app"
          }
        },
        "location": {
          "type": "string",
          "defaultValue": "[resourceGroup().location]",
          "metadata": {
            "description": "Location for all resources."
          }
        }
      },
      "variables": {
        "webAppPortalName": "[concat(parameters('webAppName'), '-webapp')]",
        "appServicePlanName": "[concat('AppServicePlan-', parameters('webAppName'))]"
      },
      "resources": [
        {
          "type": "Microsoft.Web/serverfarms",
          "apiVersion": "2020-06-01",
          "name": "[variables('appServicePlanName')]",
          "location": "[parameters('location')]",
          "sku": {
            "name": "[parameters('sku')]"
          },
          "kind": "linux",
          "properties": {
            "reserved": true
          }
        },
        {
          "type": "Microsoft.Web/sites",
          "apiVersion": "2020-06-01",
          "name": "[variables('webAppPortalName')]",
          "location": "[parameters('location')]",
          "kind": "app",
          "dependsOn": [
            "[resourceId('Microsoft.Web/serverfarms', variables('appServicePlanName'))]"
          ],
          "properties": {
            "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('appServicePlanName'))]",
            "siteConfig": {
              "linuxFxVersion": "[parameters('linuxFxVersion')]"
            }
          }
        }
      ]
    }
    ```

    1. On gitHub, navigate to your repository.
    
    1. **Select Add file** > **Create new file**.
    
        :::image type="content" source="media/tutorial-iac-vulnerabilities/create-file.png" alt-text="Screenshot that shows you where to navigate to, to create a new file.":::

    1. Enter a name for the file.
    
    1. Paste the copied information into the file.
    
    1. Select **Commit new file**.
    
    The file is now added to your repository.

    :::image type="content" source="media/tutorial-iac-vulnerabilities/file-added.png" alt-text="Screenshot that shows that the new file you created has been added to your repository.":::

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
