---
title: Use Azure portal to deploy Azure resources | Microsoft Docs
description: Use Azure portal and Azure Resource Manage to deploy your resources.
services: azure-resource-manager,azure-portal
documentationcenter: ''
author: tfitzmac

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/03/2018
ms.author: tomfitz

---
# Deploy resources with Resource Manager templates and Azure portal

This article shows how to use the [Azure portal](https://portal.azure.com) with [Azure Resource Manager](resource-group-overview.md) to deploy your Azure resources. To learn about managing your resources, see [Manage Azure resources through portal](resource-group-portal.md).

## Create resource group

1. To create an empty resource group, select **Resource groups**.

   ![Select resource groups](./media/resource-group-template-deploy-portal/select-resource-groups.png)

1. Under Resource groups, select **Add**.

   ![Add resource group](./media/resource-group-template-deploy-portal/add-resource-group.png)

1. Give it a name and location, and, if necessary, select a subscription. You need to provide a location for the resource group because the resource group stores metadata about the resources. For compliance reasons, you may want to specify where that metadata is stored. In general, we recommend that you specify a location where most of your resources will reside. Using the same location can simplify your template.

   ![Set group values](./media/resource-group-template-deploy-portal/set-group-properties.png)

   When you have finished setting the properties, select **Create**.

1. To see your new resource group, select **Refresh**.

   ![Refresh resource groups](./media/resource-group-template-deploy-portal/refresh-resource-groups.png)

## Deploy resources from Marketplace

After you create a resource group, you can deploy resources to it from the Marketplace. The Marketplace provides pre-defined solutions for common scenarios.

1. To start a deployment, select **Create a resource**.

   ![New resource](./media/resource-group-template-deploy-portal/new-resources.png)

1. Find the type of resource you would like to deploy.

   ![Select resource type](./media/resource-group-template-deploy-portal/select-resource-type.png)

1. If you don't see the particular solution you would like to deploy, you can search the Marketplace for it. For example, to find a Wordpress solution, start typing **Wordpress** and select the option you want.

   ![Search marketplace](./media/resource-group-template-deploy-portal/search-resource.png)

1. Depending on the type of selected resource, you have a collection of relevant properties to set before deployment. For all types, you must select a destination resource group. The following image shows how to create a web app and deploy it to the resource group you created.

   ![Create resource group](./media/resource-group-template-deploy-portal/select-existing-group.png)

   Alternatively, you can decide to create a resource group when deploying your resources. Select **Create new** and give the resource group a name.

   ![Create new resource group](./media/resource-group-template-deploy-portal/select-new-group.png)

1. Your deployment begins. The deployment could take a few minutes. When the deployment has finished, you see a notification.

   ![View notification](./media/resource-group-template-deploy-portal/view-notification.png)

1. After deploying your resources, you can add more resources to the resource group by selecting **Add**.

   ![Add resource](./media/resource-group-template-deploy-portal/add-resource.png)

## Deploy resources from custom template

If you want to execute a deployment but not use any of the templates in the Marketplace, you can create a customized template that defines the infrastructure for your solution. To learn about creating templates, see [Understand the structure and syntax of Azure Resource Manager templates](resource-group-authoring-templates.md).

> [!NOTE]
> The portal interface doesn't support referencing a [secret from a Key Vault](resource-manager-keyvault-parameter.md). Instead, use [PowerShell](resource-group-template-deploy.md) or [Azure CLI](resource-group-template-deploy-cli.md) to deploy your template locally or from an external URI.

1. To deploy a customized template through the portal, select **Create a resource**, and search for **Template Deployment** until you can select it from the options.

   ![Search template deployment](./media/resource-group-template-deploy-portal/search-template.png)

1. Select **Create**.

   ![Select create](./media/resource-group-template-deploy-portal/show-template-option.png)

1. You see several options for creating a template. Select **Build your own template in the editor**.

   ![View options](./media/resource-group-template-deploy-portal/see-options.png)

1. You have a blank template that is available for customizing.

   ![Create template](./media/resource-group-template-deploy-portal/blank-template.png)

1. You can edit the JSON syntax manually, or select a pre-built template from the [Quickstart template gallery](https://azure.microsoft.com/resources/templates/). However, for this article, you use the **Add resource** option.

   ![Edit template](./media/resource-group-template-deploy-portal/select-add-resource.png)

1. Select **Storage account** and provide a name. When finished providing values, select **OK**.

   ![Select storage account](./media/resource-group-template-deploy-portal/add-storage-account.png)

1. The editor automatically adds JSON for the resource type. Notice that it includes a parameter for defining the type of storage account. Select **Save**.

   ![Show template](./media/resource-group-template-deploy-portal/show-json.png)

1. Now, you have the option to deploy the resources defined in the template. To deploy, agree to the terms and conditions, and select **Purchase**.

   ![Deploy template](./media/resource-group-template-deploy-portal/provide-custom-template-values.png)

## Deploy resources from a template saved to your account

The portal enables you to save a template to your Azure account, and redeploy it later. For more information on templates, see [Create and deploy your first Azure Resource Manager template](resource-manager-create-first-template.md).

1. To find your saved templates, select **More services**.

   ![More services](./media/resource-group-template-deploy-portal/more-services.png)

1. Search for **templates** and select that option.

   ![Search templates](./media/resource-group-template-deploy-portal/find-templates.png)

1. From the list of templates saved to your account, select the one you wish to work on.

   ![Saved templates](./media/resource-group-template-deploy-portal/saved-templates.png)

1. Select **Deploy** to redeploy this saved template.

   ![Deploy saved template](./media/resource-group-template-deploy-portal/deploy-saved-template.png)

## Next steps
* To view audit logs, see [Audit operations with Resource Manager](resource-group-audit.md).
* To troubleshoot deployment errors, see [View deployment operations](resource-manager-deployment-operations.md).
* To retrieve a template from a deployment or resource group, see [Export Azure Resource Manager template from existing resources](resource-manager-export-template.md).
* To safely rollout your service across multiple regions, see [Azure Deployment Manager](deployment-manager-overview.md).
