---
title: Use Azure portal to deploy service catalog managed application
description: Shows consumers of Azure Managed Applications how to deploy a service catalog managed application from the Azure portal.
author: davidsmatlak
ms.author: davidsmatlak
ms.topic: quickstart
ms.date: 08/17/2022
---

# Quickstart: Deploy service catalog managed application from Azure portal

In the quickstart article to [publish the definition](publish-service-catalog-app.md), you published an Azure managed application definition. In this quickstart, you use that definition to deploy a service catalog managed application. The deployment creates two resource groups. One resource group contains the managed application and the other is a managed resource group for the deployed resource. In this article, the managed application definition deploys a managed storage account.

## Prerequisites

To complete this quickstart, you need an Azure account with an active subscription. If you completed the quickstart to publish a definition, you should already have an account. Otherwise, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Create service catalog managed application

In the Azure portal, use the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Create a resource**.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/create-resource.png" alt-text="Create a resource":::

1. Search for _Service Catalog Managed Application_ and select it from the available options.

1. **Service Catalog Managed Application** is displayed. Select **Create**.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/create-service-catalog-managed-application.png" alt-text="Select create":::

1. The portal shows the managed application definitions that you can access. From the available definitions, select the one you want to deploy. In this quickstart, use the **Managed Storage Account** definition that you created in the preceding quickstart. Select **Create**.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/select-service-catalog-managed-application.png" alt-text="Screenshot that shows managed application definitions that you can select and deploy.":::

1. Provide values for the **Basics** tab and select **Next: Storage settings**.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/basics-info.png" alt-text="Screenshot that highlights the information needed on the basics tab.":::

   - **Subscription**: Select the subscription where you want to deploy the managed application.
   - **Resource group**: Select the resource group. For this example, create a resource group named _applicationGroup_.
   - **Region**: Select the location where you want to deploy the resource.
   - **Application Name**: Enter a name for your application. For this example, use _demoManagedApplication_.
   - **Managed Resource Group**: Uses a default name in the format `mrg-{definitionName}-{dateTime}` like the example _mrg-ManagedStorage-20220817085240_. You can change the name.

1. Enter a prefix for the storage account name and select the storage account type. Select **Next: Review + create**.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/storage-info.png" alt-text="Screenshot that shows the information needed to create a storage account.":::

   - **Storage account name prefix**: Use only lowercase letters and numbers and a maximum of 11 characters. During deployment, the prefix is concatenated with a unique string to create the storage account name.
   - **Storage account type**: Select **Change type** to choose a storage account type. The default is Standard LRS.

1. Review the summary of the values you selected and verify **Validation Passed** is displayed. Select **Create** to begin the deployment.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/summary-validation.png" alt-text="Screenshot that summarizes the values you selected and shows the validation status.":::

## View results

After the service catalog managed application is deployed, you have two new resource groups. One resource group contains the managed application. The other resource group contains the managed resource that was deployed. In this example, a managed storage account.

### Managed application

Go to the resource group named **applicationGroup**. The resource group contains your managed application named _demoManagedApplication_.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/view-application-group.png" alt-text="Screenshot that shows the resource group that contains the managed application.":::

### Managed resource

Go to the managed resource group with the name prefix **mrg-ManagedStorage** to see the resource that was deployed. The resource group contains the managed storage account that uses the prefix you specified. In this example, the storage account prefix is _demoappstg_.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/view-managed-resource-group.png" alt-text="Screenshot that shows the managed resource group that contains the resource deployed by the managed application.":::

The storage account that's created by the managed application has a role assignment. In the [publish the definition](publish-service-catalog-app.md#create-an-azure-active-directory-user-group-or-application) article, you created an Azure Active Directory group. That group was used in the managed application definition. When you deployed the managed application, a role assignment for that group was added to the managed storage account.

To see the role assignment from the Azure portal:

1. Go to the **mrg-ManagedStorage** resource group.
1. Select **Access Control (IAM)** > **Role assignments**.

   You can also view the resource's **Deny assignments**.

The role assignment gives the application's publisher access to manage the storage account. In this example, the publisher might be your IT department. The _Deny assignments_ prevents customers from making changes to a managed resource's configuration. Managed apps are designed so that customers don't need to maintain the resources. The _Deny assignment_ excludes the Azure Active Directory group that was assigned in **Role assignments**.

## Clean up resources

When your finished with the managed application, you can delete the resource groups and that will remove all the resources you created. For example, in this quickstart you created the resource groups _applicationGroup_ and a managed resource group with the prefix _mrg-ManagedStorage_.

1. From Azure portal **Home**, in the search field, enter _resource groups_.
1. Select **Resource groups**.
1. Select **applicationGroup** and **Delete resource group**.
1. To confirm the deletion, enter the resource group name and select **Delete**.

When the resource group that contains the managed application is deleted, the managed resource group is also deleted. In this example, when _applicationGroup_ is deleted the  _mrg-ManagedStorage_ resource group is also deleted.

If you want to delete the managed application definition, you can delete the resource groups you created in the quickstart to [publish the definition](publish-service-catalog-app.md).

## Next steps

- To learn how to create the definition files for a managed application, see [Quickstart: Create and publish an Azure Managed Application definition](publish-service-catalog-app.md).
- For Azure CLI, see [Deploy managed application with Azure CLI](./scripts/managed-application-cli-sample-create-application.md).
- For PowerShell, see [Deploy managed application with PowerShell](./scripts/managed-application-poweshell-sample-create-application.md).
