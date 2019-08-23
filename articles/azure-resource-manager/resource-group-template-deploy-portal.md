---
title: Use Azure portal to deploy Azure resources | Microsoft Docs
description: Use Azure portal and Azure Resource Manage to deploy your resources.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 06/27/2019
ms.author: tomfitz
---

# Deploy resources with Resource Manager templates and Azure portal

Learn how to use the [Azure portal](https://portal.azure.com) with [Azure Resource Manager](resource-group-overview.md) to deploy your Azure resources. To learn about managing your resources, see [Manage Azure resources by using the Azure portal](manage-resources-portal.md).

Deploying Azure resources by using the Azure portal usually involves two steps:

- Create a resource group.
- Deploy resources to the resource group.

In addition, you can also deploy an Azure Resource Manager template to create Azure resources.

This article shows both methods.

## Create a resource group

1. To create a new resource group, select **Resource groups** from the [Azure portal](https://portal.azure.com).

   ![Select resource groups](./media/resource-group-template-deploy-portal/select-resource-groups.png)

1. Under Resource groups, select **Add**.

   ![Add resource group](./media/resource-group-template-deploy-portal/add-resource-group.png)

1. Select or enter the following property values:

    - **Subscription**: Select an Azure subscription.
    - **Resource group**: Give the resource group a name.
    - **Region**: Specify an Azure location. This is where the resource group stores metadata about the resources. For compliance reasons, you may want to specify where that metadata is stored. In general, we recommend that you specify a location where most of your resources will reside. Using the same location can simplify your template.

   ![Set group values](./media/resource-group-template-deploy-portal/set-group-properties.png)

1. Select **Review + create**.
1. review the values, and then select **Create**.
1. Select **Refresh** before you can see the new resource group in the list.

## Deploy resources to a resource group

After you create a resource group, you can deploy resources to the group from the Marketplace. The Marketplace provides pre-defined solutions for common scenarios.

1. To start a deployment, select **Create a resource** from the [Azure portal](https://portal.azure.com).

   ![New resource](./media/resource-group-template-deploy-portal/new-resources.png)

1. Find the type of resource you would like to deploy. The resources are organized in categories. If you don't see the particular solution you would like to deploy, you can search the Marketplace for it. The following screenshot shows that Ubuntu Server is selected.

   ![Select resource type](./media/resource-group-template-deploy-portal/select-resource-type.png)

1. Depending on the type of selected resource, you have a collection of relevant properties to set before deployment. For all types, you must select a destination resource group. The following image shows how to create a Linux virtual machine and deploy it to the resource group you created.

   ![Create resource group](./media/resource-group-template-deploy-portal/select-existing-group.png)

   Alternatively, you can decide to create a resource group when deploying your resources. Select **Create new** and give the resource group a name.

1. Your deployment begins. The deployment could take several minutes. Some resources take longer time than other resources. When the deployment has finished, you see a notification. Select **Go to resource** to open

   ![View notification](./media/resource-group-template-deploy-portal/view-notification.png)

1. After deploying your resources, you can add more resources to the resource group by selecting **Add**.

   ![Add resource](./media/resource-group-template-deploy-portal/add-resource.png)

## Deploy resources from custom template

If you want to execute a deployment but not use any of the templates in the Marketplace, you can create a customized template that defines the infrastructure for your solution. To learn about creating templates, see [Understand the structure and syntax of Azure Resource Manager templates](resource-group-authoring-templates.md).

> [!NOTE]
> The portal interface doesn't support referencing a [secret from a Key Vault](resource-manager-keyvault-parameter.md). Instead, use [PowerShell](resource-group-template-deploy.md) or [Azure CLI](resource-group-template-deploy-cli.md) to deploy your template locally or from an external URI.

1. To deploy a customized template through the portal, select **Create a resource**, search for **template**. and then select **Template deployment**.

   ![Search template deployment](./media/resource-group-template-deploy-portal/search-template.png)

1. Select **Create**.
1. You see several options for creating a template:

    - **Build your own template in editor**: create a template using the portal template editor.  The editor is capable to add a resource template schema.
    - **Common templates**: There are four common templatess for creating a Linux virtual machine, Windows virtual machine, a web application, and an Azure SQL database.
    - **Load a GitHub quickstart template**: use an existing [quickstart templates](https://azure.microsoft.com/resources/templates/).

   ![View options](./media/resource-group-template-deploy-portal/see-options.png)

    This tutorial provides the instruction for loading a quickstart template.

1. Under **Load a GitHub quickstart template**, type or select **101-storage-account-create**.

    You have two options:

    - **Select template**: deploy the template.
    - **Edit template**: edit the quickstart template before you deploy it.

1. Select **Edit template** to explore the portal template editor. The template is loaded in the editor. Notice there are two parameters: **storageAccountType** and **location**.

   ![Create template](./media/resource-group-template-deploy-portal/show-json.png)

1. Make a minor change to the template. For example, update the **storageAccountName** variable to:

    ```json
    "storageAccountName": "[concat('azstore', uniquestring(resourceGroup().id))]"
    ```

1. Select **Save**. Now you see the portal template deployment interface. Notice the two parameters that you defined in the template.
1. Enter or select the property values:

    - **Subscription**: Select an Azure subscription.
    - **Resource group**: Select **Create new** and give a name.
    - **Location**: Select an Azure location.
    - **Storage Account Type**: Use the default value.
    - **Location**: Use the default value.
    - **I agree to the terms and conditions stated above**: (select)

1. Select **Purchase**.

## Next steps

- To view audit logs, see [Audit operations with Resource Manager](./resource-group-audit.md).
- To troubleshoot deployment errors, see [View deployment operations](./resource-manager-deployment-operations.md).
- To export a template from a deployment or resource group, see [Export Azure Resource Manager templates](./manage-resource-groups-portal.md#export-resource-groups-to-templates).
- To safely roll out your service across multiple regions, see [Azure Deployment Manager](./deployment-manager-overview.md).
