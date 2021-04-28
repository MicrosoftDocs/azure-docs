---
title: 'Quickstart: Create an Automation account - Azure template'
titleSuffix: Azure Automation
description: This quickstart shows how to create an Automation account by using the Azure Resource Manager template.
services: automation
ms.author: magoedte
ms.date: 01/07/2021
ms.topic: quickstart
ms.workload: infrastructure-services
ms.custom:
  - mvc
  - subject-armqs
  - mode-arm
# Customer intent: I want to create an Automation account by using an Azure Resource Manager template so that I can automate processes with runbooks.
---

# Quickstart: Create an Automation account by using ARM template

Azure Automation delivers a cloud-based automation and configuration service that supports consistent management across your Azure and non-Azure environments. This quickstart shows you how to deploy an Azure Resource Manager template (ARM template) that creates an Automation account. Using an ARM template takes fewer steps compared to other deployment methods.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-automation%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

This sample template performs the following:

* Automates the creation of an Azure Monitor Log Analytics workspace.
* Automates the creation of an Azure Automation account.
* Links the Automation account to the Log Analytics workspace.
* Adds sample Automation runbooks to the account.

>[!NOTE]
>Creation of the Automation Run As account is not supported when you're using an ARM template. To create a Run As account manually from the portal or with PowerShell, see [Create Run As account](create-run-as-account.md).

After you complete these steps, you need to [configure diagnostic settings](automation-manage-send-joblogs-log-analytics.md) for your Automation account to send runbook job status and job streams to the linked Log Analytics workspace.

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-automation/).

:::code language="json" source="~/quickstart-templates/101-automation/azuredeploy.json":::

### API versions

The following table lists the API version for the resources used in this example.

| Resource | Resource type | API version |
|:---|:---|:---|
| [Workspace](/azure/templates/microsoft.operationalinsights/workspaces) | workspaces | 2020-03-01-preview |
| [Automation account](/azure/templates/microsoft.automation/automationaccounts) | automation | 2020-01-13-preview |
| [Workspace Linked services](/azure/templates/microsoft.operationalinsights/workspaces/linkedservices) | workspaces | 2020-03-01-preview |

### Before you use the template

The JSON parameters template is configured for you to specify:

* The name of the workspace.
* The region to create the workspace in.
* The name of the Automation account.
* The region to create the Automation account in.

The following parameters in the template are set with a default value for the Log Analytics workspace:

* *sku* defaults to the per GB pricing tier released in the April 2018 pricing model.
* *dataRetention* defaults to 30 days.

>[!WARNING]
>If you want to create or configure a Log Analytics workspace in a subscription that has opted into the April 2018 pricing model, the only valid Log Analytics pricing tier is *PerGB2018*.
>

The JSON template specifies a default value for the other parameters that would likely be used as a standard configuration in your environment. You can store the template in an Azure storage account for shared access in your organization. For more information about working with templates, see [Deploy resources with ARM templates and the Azure CLI](../azure-resource-manager/templates/deploy-cli.md).

If you're new to Azure Automation and Azure Monitor, it's important that you understand the following configuration details. They can help you avoid errors when you try to create, configure, and use a Log Analytics workspace linked to your new Automation account.

* Review [additional details](../azure-monitor/logs/resource-manager-workspace.md#create-a-log-analytics-workspace) to fully understand workspace configuration options, such as access control mode, pricing tier, retention, and capacity reservation level.

* Review [workspace mappings](how-to/region-mappings.md) to specify the supported regions inline or in a parameter file. Only certain regions are supported for linking a Log Analytics workspace and an Automation account in your subscription.

* If you're new to Azure Monitor logs and have not deployed a workspace already, you should review the [workspace design guidance](../azure-monitor/logs/design-logs-deployment.md). It will help you to learn about access control, and understand the design implementation strategies we recommend for your organization.

## Deploy the template

1. Select the following image to sign in to Azure and open a template. The template creates an Azure Automation account, a Log Analytics workspace, and links the Automation account to the workspace.

    [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-automation%2Fazuredeploy.json)

2. Enter the values.

3. The deployment can take a few minutes to finish. When completed, the output is similar to the following:

    ![Example result when deployment is complete](media/quickstart-create-automation-account-template/template-output.png)

## Review deployed resources

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the Azure portal, open the Automation account you just created. 

3. From the left-pane, select **Runbooks**. On the **Runbooks** page, listed are three tutorial runbooks created with the Automation account.

    ![Tutorial runbooks created with Automation account](./media/quickstart-create-automation-account-template/automation-sample-runbooks.png)

4. From the left-pane, select **Linked workspace**. On the **Linked workspace** page, it shows the Log Analytics workspace you specified earlier linked to your Automation account.

    ![Automation account linked to the Log Analytics workspace](./media/quickstart-create-automation-account-template/automation-account-linked-workspace.png)

## Clean up resources

When you no longer need them, unlink the Automation account from the Log Analytics workspace, and then delete the Automation account and workspace.

## Next steps

In this quickstart, you created an Automation account, a Log Analytics workspace, and linked them together.

To learn more, continue to the tutorials for Azure Automation.

> [!div class="nextstepaction"]
> [Azure Automation tutorials](learn/automation-tutorial-runbook-graphical.md)
