---
title: Discover misconfigurations in Infrastructure as Code

description: Learn how to use DevOps security in Defender for Cloud to discover misconfigurations in Infrastructure as Code (IaC)
ms.date: 01/24/2023
ms.topic: how-to
ms.custom: ignite-2022
---

# Discover misconfigurations in Infrastructure as Code (IaC)

Once you have set up the Microsoft Security DevOps GitHub action or Azure DevOps extension, you can configure the YAML configuration file to run a single tool or multiple tools. For example, you can set up the action or extension to run Infrastructure as Code (IaC) scanning tools only. This can help reduce pipeline run time.

## Prerequisites

- Configure Microsoft Security DevOps for GitHub and/or Azure DevOps based on your source code management system:
  - [Microsoft Security DevOps GitHub action](github-action.md)
  - [Microsoft Security DevOps Azure DevOps extension](azure-devops-extension.md).
- Ensure you have an IaC template in your repository.

## Configure IaC scanning and view the results in GitHub

1. Sign in to [GitHub](https://www.github.com). 

1. Navigate to **`your repository's home page`** > **.github/workflows** > **msdevopssec.yml** that was created in the [prerequisites](github-action.md#configure-the-microsoft-security-devops-github-action-1).    

1. Select **Edit file**.

    :::image type="content" source="media/tutorial-iac-vulnerabilities/workflow-yaml.png" alt-text="Screenshot that shows where to find the edit button for the msdevopssec.yml file." lightbox="media/tutorial-iac-vulnerabilities/workflow-yaml.png":::

1. Under the Run Analyzers section, add:

    ```yml
    with:
        categories: 'IaC'
    ```

    > [!NOTE] 
    > Categories are case sensitive.
    :::image type="content" source="media/tutorial-iac-vulnerabilities/add-to-yaml.png" alt-text="Screenshot that shows the information that needs to be added to the yaml file.":::

1. Select **Start Commit** 

1. Select **Commit changes**.

    :::image type="content" source="media/tutorial-iac-vulnerabilities/commit-change.png" alt-text="Screenshot that shows where to select commit change on the githib page.":::

1. (Optional) Add an IaC template to your repository. Skip if you already have an IaC template in your repository.

    For example, [commit an IaC template to deploy a basic Linux web application](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-basic-linux) to your repository.

    1. Select `azuredeploy.json`.
    
        :::image type="content" source="media/tutorial-iac-vulnerabilities/deploy-json.png" alt-text="Screenshot that shows where the azuredeploy.json file is located.":::

    1. Select **Raw**
    
    1. Copy all the information in the file.

        ```json
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
    
    1. On GitHub, navigate to your repository.
    
    1. **Select Add file** > **Create new file**.
    
        :::image type="content" source="media/tutorial-iac-vulnerabilities/create-file.png" alt-text="Screenshot that shows you where to navigate to, to create a new file." lightbox="media/tutorial-iac-vulnerabilities/create-file.png":::

    1. Enter a name for the file.
    
    1. Paste the copied information into the file.
    
    1. Select **Commit new file**.
    
    The file is now added to your repository.

    :::image type="content" source="media/tutorial-iac-vulnerabilities/file-added.png" alt-text="Screenshot that shows that the new file you created has been added to your repository.":::


1. Confirm the Microsoft Security DevOps scan completed:
    1. Select **Actions**. 
    2. Select the workflow to see the results.

1. Navigate to **Security** > **Code scanning alerts** to view the results of the scan (filter by tool as needed to see just the IaC findings).

## Configure IaC scanning and view the results in Azure DevOps

**To view the results of the IaC scan in Azure DevOps**

1. Sign in to [Azure DevOps](https://dev.azure.com/).

1. Select the desired project

1. Select **Pipeline**.

1. Select the pipeline where the Microsoft Security DevOps Azure DevOps Extension is configured.

1. **Edit** the pipeline configuration YAML file adding the following lines:

1. Add the following lines to the YAML file

    ```yml
    inputs:
        categories: 'IaC'
    ```

    :::image type="content" source="media/tutorial-iac-vulnerabilities/addition-to-yaml.png" alt-text="Screenshot showing you where to add this line to the YAML file.":::

1.  Select **Save**.

1. (Optional) Add an IaC template to your repository. Skip if you already have an IaC template in your repository.

1.  Select **Save** to commit directly to the main branch or Create a new branch for this commit.

1.  Select **Pipeline** > **`Your created pipeline`** to view the results of the IaC scan.

1. Select any result to see the details.

## View details and remediation information on IaC rules included with Microsoft Security DevOps

The IaC scanning tools that are included with Microsoft Security DevOps, are [Template Analyzer](https://github.com/Azure/template-analyzer) (which contains [PSRule](https://aka.ms/ps-rule-azure)) and [Terrascan](https://github.com/tenable/terrascan). 

Template Analyzer runs rules on ARM and Bicep templates. You can learn more about [Template Analyzer's rules and remediation details](https://github.com/Azure/template-analyzer/blob/main/docs/built-in-rules.md#built-in-rules).

Terrascan runs rules on ARM, CloudFormation, Docker, Helm, Kubernetes, Kustomize, and Terraform templates. You can learn more about the [Terrascan rules](https://runterrascan.io/docs/policies/).

## Learn more

- Learn more about [Template Analyzer](https://github.com/Azure/template-analyzer).
- Learn more about [PSRule](https://aka.ms/ps-rule-azure).
- Learn more about [Terrascan](https://runterrascan.io/).

In this tutorial you learned how to configure the Microsoft Security DevOps GitHub Action and Azure DevOps Extension to scan for Infrastructure as Code (IaC) security misconfigurations and how to view the results.

## Next steps

Learn more about [DevOps security](defender-for-devops-introduction.md).

Learn how to [connect your GitHub](quickstart-onboard-github.md) to Defender for Cloud.

Learn how to [connect your Azure DevOps](quickstart-onboard-devops.md) to Defender for Cloud.
