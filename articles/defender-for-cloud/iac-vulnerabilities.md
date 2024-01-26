---
title: Discover misconfigurations in Infrastructure as Code
description: Learn how to use DevOps security in Defender for Cloud to discover misconfigurations in Infrastructure as Code (IaC).
ms.date: 01/24/2023
ms.topic: how-to
ms.custom: ignite-2022
---

# Discover misconfigurations in Infrastructure as Code

After you set up the Microsoft Security DevOps GitHub action or Azure DevOps extension, you can configure the YAML configuration file to run a single tool or multiple tools. For example, you can set up the action or extension to run only Infrastructure as Code (IaC) scanning tools. This can help reduce the pipeline runtime.

## Prerequisites

- Configure the Microsoft Security DevOps GitHub action or the Azure DevOps-based extension depending on your source code management system:
  - [Microsoft Security DevOps GitHub action](github-action.md)
  - [Microsoft Security DevOps Azure DevOps extension](azure-devops-extension.md).
- Ensure that you have an IaC template in your repository.

## Set up IaC scanning and view the results in GitHub

1. Sign in to [GitHub](https://www.github.com).

1. On the home page of your repository, go to **.github/workflows** > **msdevopssec.yml**.

   For more information, see [Prerequisites](github-action.md#configure-the-microsoft-security-devops-github-action-1).

1. Select **Edit file**.

    :::image type="content" source="media/tutorial-iac-vulnerabilities/workflow-yaml.png" alt-text="Screenshot that shows where to find the edit button for the msdevopssec.yml file." lightbox="media/tutorial-iac-vulnerabilities/workflow-yaml.png":::

1. In the Run Analyzers section, add:

    ```yaml
    with:
        categories: 'IaC'
    ```

    > [!NOTE]
    > Categories are case sensitive.

    :::image type="content" source="media/tutorial-iac-vulnerabilities/add-to-yaml.png" alt-text="Screenshot that shows the information that needs to be added to the YAML file.":::

1. Select **Start Commit**.

1. Select **Commit changes**.

    :::image type="content" source="media/tutorial-iac-vulnerabilities/commit-change.png" alt-text="Screenshot that shows where to select commit change on the GitHub page.":::

1. (Optional) Add an IaC template to your repository. If you already have an IaC template in your repository, skip this step.

    For example, commit an IaC template to [deploy a basic Linux web application](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-basic-linux) to your repository.

    1. Select the *azuredeploy.json* file.

        :::image type="content" source="media/tutorial-iac-vulnerabilities/deploy-json.png" alt-text="Screenshot that shows where the azuredeploy.json file is located.":::

    1. Select **Raw**.

    1. Copy all the information in the file, like in the following example:

        ```json
        {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "webAppName": {
              "type": "string",
              "defaultValue": "AzureLinuxApp",
              "metadata": {
                "description": "The base name of the resource, such as the web app name or the App Service plan."
              },
              "minLength": 2
            },
            "sku": {
              "type": "string",
              "defaultValue": "S1",
              "metadata": {
                "description": "The SKU of the App Service plan."
              }
            },
            "linuxFxVersion": {
              "type": "string",
              "defaultValue": "php|7.4",
              "metadata": {
                "description": "The runtime stack of the current web app."
              }
            },
            "location": {
              "type": "string",
              "defaultValue": "[resourceGroup().location]",
              "metadata": {
                "description": "The location for all resources."
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

    1. Go to your GitHub repository.

    1. Select **Add file** > **Create new file**.

        :::image type="content" source="media/tutorial-iac-vulnerabilities/create-file.png" alt-text="Screenshot that shows you how to create a new file." lightbox="media/tutorial-iac-vulnerabilities/create-file.png":::

    1. Enter a name for the file.

    1. Paste the copied information into the file.

    1. Select **Commit new file**.

    The file is added to your repository.

    :::image type="content" source="media/tutorial-iac-vulnerabilities/file-added.png" alt-text="Screenshot that shows that the new file you created has been added to your repository.":::

1. Confirm that the Microsoft Security DevOps scan is finished:

   1. Select **Actions**.
   1. Select the workflow to see the results.

1. To view the results of the scan, go to **Security** > **Code scanning alerts**.

   You can filter by tool to see only the IaC findings.

## Configure IaC scanning and view the results in Azure DevOps

To view the results of the IaC scan in Azure DevOps:

1. Sign in to [Azure DevOps](https://dev.azure.com/).

1. Select the project.

1. Select **Pipeline**.

1. Select the pipeline where the Microsoft Security DevOps Azure DevOps Extension is configured.

1. **Edit** the pipeline configuration YAML file by adding the following lines:

   ```yaml
   inputs:
       categories: 'IaC'
   ```

   :::image type="content" source="media/tutorial-iac-vulnerabilities/addition-to-yaml.png" alt-text="Screenshot that shows where to add this line to the YAML file.":::

1. Select **Save**.

1. (Optional) Add an IaC template to your repository. Skip if you already have an IaC template in your repository.

1. Select **Save** to commit directly to the main branch or Create a new branch for this commit.

1. To view the results of the IaC scan, select **Pipeline**, and then select the pipeline you created.

1. Select any result to see the details.

## View details and remediation information on IaC rules included with Microsoft Security DevOps

The IaC scanning tools that are included with Microsoft Security DevOps are [Template Analyzer](https://github.com/Azure/template-analyzer) (which contains [PSRule](https://aka.ms/ps-rule-azure)) and [Terrascan](https://github.com/tenable/terrascan).

Template Analyzer runs rules on Azure Resource Manager templates (ARM templates) and Bicep templates. You can learn more about [Template Analyzer rules and remediation details](https://github.com/Azure/template-analyzer/blob/main/docs/built-in-rules.md#built-in-rules).

Terrascan runs rules on templates for ARM, CloudFormation, Docker, Helm, Kubernetes, Kustomize, and Terraform. You can learn more about the [Terrascan rules](https://runterrascan.io/docs/policies/).

## Learn more

- Learn more about [Template Analyzer](https://github.com/Azure/template-analyzer).
- Learn more about [PSRule](https://aka.ms/ps-rule-azure).
- Learn more about [Terrascan](https://runterrascan.io/).

In this tutorial, you learned how to configure the Microsoft Security DevOps GitHub action and Azure DevOps extension to scan for Infrastructure as Code (IaC) security misconfigurations and how to view the results.

## Related content

- Learn more about [DevOps security](defender-for-devops-introduction.md).
- Learn how to [connect your GitHub repository](quickstart-onboard-github.md) to Defender for Cloud.
- Learn how to [connect your Azure DevOps repository](quickstart-onboard-devops.md) to Defender for Cloud.
