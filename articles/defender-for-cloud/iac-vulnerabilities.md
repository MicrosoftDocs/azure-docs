---
title: Scan for misconfigurations in Infrastructure as Code
description: Learn how to use Microsoft Security DevOps scanning with Microsoft Defender for Cloud to find misconfigurations in Infrastructure as Code (IaC).
ms.date: 05/16/2024
ms.topic: how-to
#customer intent: As a developer, I want to learn how to use Microsoft Security DevOps scanning with Microsoft Defender for Cloud to find misconfigurations in Infrastructure as Code (IaC) in a connected GitHub repository or Azure DevOps project.
---

# Scan your connected GitHub repository or Azure DevOps project

You can set up Microsoft Security DevOps to scan your connected GitHub repository or Azure DevOps project. Use a GitHub action or an Azure DevOps extension to run Microsoft Security DevOps only on your Infrastructure as Code (IaC) source code, and help reduce your pipeline runtime.

This article shows you how to apply a template YAML configuration file to scan your connected repository or project specifically for IaC security issues by using Microsoft Security DevOps rules.

## Prerequisites

- For Microsoft Security DevOps, set up the GitHub action or the Azure DevOps extension based on your source code management system:
  - If your repository is in GitHub, set up the [Microsoft Security DevOps GitHub action](github-action.md).
  - If you manage your source code in Azure DevOps, set up the [Microsoft Security DevOps Azure DevOps extension](azure-devops-extension.yml).
- Ensure that you have an IaC template in your repository.

<a name="configure-iac-scanning-and-view-the-results-in-github"></a>

## Set up and run a GitHub action to scan your connected IaC source code

To set up an action and view scan results in GitHub:

1. Sign in to [GitHub](https://www.github.com).

1. Go to the main page of your repository.

1. In the file directory, select **.github** > **workflows** > **msdevopssec.yml**.

   For more information about working with an action in GitHub, see [Prerequisites](github-action.md#configure-the-microsoft-security-devops-github-action-1).

1. Select the **Edit this file** (pencil) icon.

   :::image type="content" source="media/tutorial-iac-vulnerabilities/workflow-yaml.png" alt-text="Screenshot that highlights the Edit this file icon for the msdevopssec.yml file." lightbox="media/tutorial-iac-vulnerabilities/workflow-yaml.png":::

1. In the **Run analyzers** section of the YAML file, add this code:

   ```yaml
   with:
       categories: 'IaC'
   ```

   > [!NOTE]
   > Values are case sensitive.

   Here's an example:

   :::image type="content" source="media/tutorial-iac-vulnerabilities/add-to-yaml.png" alt-text="Screenshot that shows the information to add to the YAML file.":::

1. Select **Commit changes . . .** .

1. Select **Commit changes**.

   :::image type="content" source="media/tutorial-iac-vulnerabilities/commit-change.png" alt-text="Screenshot that shows where to select Commit changes on the GitHub page.":::

1. (Optional) Add an IaC template to your repository. If you already have an IaC template in your repository, skip this step.

   For example, commit an IaC template that you can use to [deploy a basic Linux web application](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-basic-linux).

   1. Select the **azuredeploy.json** file.

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

   1. In your GitHub repository, go to the **.github/workflows** folder.

   1. Select **Add file** > **Create new file**.

       :::image type="content" source="media/tutorial-iac-vulnerabilities/create-file.png" alt-text="Screenshot that shows you how to create a new file." lightbox="media/tutorial-iac-vulnerabilities/create-file.png":::

   1. Enter a name for the file.

   1. Paste the copied information in the file.

   1. Select **Commit new file**.

   The template file is added to your repository.

   :::image type="content" source="media/tutorial-iac-vulnerabilities/file-added.png" alt-text="Screenshot that shows that the new file you created is added to your repository.":::

1. Verify that the Microsoft Security DevOps scan is finished:

   1. For the repository, select **Actions**.

   1. Select the workflow to see the action status.

1. To view the results of the scan, go to **Security** > **Code scanning alerts**.

   You can filter by tool to see only the IaC findings.

<a name="configure-iac-scanning-and-view-the-results-in-azure-devops"></a>

## Set up and run an Azure DevOps extension to scan your connected IaC source code

To set up an extension and view scan results in Azure DevOps:

1. Sign in to [Azure DevOps](https://dev.azure.com/).

1. Select your project.

1. Select **Pipelines**.

1. Select the pipeline where your Azure DevOps extension for Microsoft Security DevOps is configured.

1. Select **Edit pipeline**.

1. In the pipeline YAML configuration file, below the `displayName` line for the **MicrosoftSecurityDevOps@1** task, add this code:

   ```yaml
   inputs:
       categories: 'IaC'
   ```

   Here's an example:

   :::image type="content" source="media/tutorial-iac-vulnerabilities/addition-to-yaml.png" alt-text="Screenshot that shows where to add the IaC categories line in the pipeline configuration YAML file.":::

1. Select **Save**.

1. (Optional) Add an IaC template to your Azure DevOps project. If you already have an IaC template in your project, skip this step.

1. Choose whether to commit directly to the main branch or to create a new branch for the commit, and then select **Save**.

1. To view the results of the IaC scan, select **Pipelines**, and then select the pipeline you modified.

1. See see more details, select a specific pipeline run.

## View details and remediation information for applied IaC rules

The IaC scanning tools that are included with Microsoft Security DevOps are [Template Analyzer](https://github.com/Azure/template-analyzer) ([PSRule](https://aka.ms/ps-rule-azure) is included in Template Analyzer) and [Terrascan](https://github.com/tenable/terrascan).

Template Analyzer runs rules on Azure Resource Manager templates (ARM templates) and Bicep templates. For more information, see the [Template Analyzer rules and remediation details](https://github.com/Azure/template-analyzer/blob/main/docs/built-in-rules.md#built-in-rules).

Terrascan runs rules on ARM templates and templates for CloudFormation, Docker, Helm, Kubernetes, Kustomize, and Terraform. For more information, see the [Terrascan rules](https://runterrascan.io/docs/policies/).

To learn more about the IaC scanning tools that are included with Microsoft Security DevOps, see:

- [Template Analyzer](https://github.com/Azure/template-analyzer)
- [PSRule](https://aka.ms/ps-rule-azure)
- [Terrascan](https://runterrascan.io/)

## Related content

In this article, you learned how to set up a GitHub action and an Azure DevOps extension for Microsoft Security DevOps to scan for IaC security misconfigurations and how to view the results.

To get more information:

- Learn more about [DevOps security](defender-for-devops-introduction.md).
- Learn how to [connect your GitHub repository](quickstart-onboard-github.md) to Defender for Cloud.
- Learn how to [connect your Azure DevOps project](quickstart-onboard-devops.md) to Defender for Cloud.
