---
title: Deploy a service catalog managed application
description: Describes how to deploy a service catalog's managed application for an Azure Managed Application.
author: davidsmatlak
ms.author: davidsmatlak
ms.topic: quickstart
ms.date: 03/01/2023
---

# Quickstart: Deploy a service catalog managed application

In this quickstart, you use the definition you created in the quickstarts to [publish an application definition](publish-service-catalog-app.md) or [publish a definition with bring your own storage](publish-service-catalog-bring-your-own-storage.md) to deploy a service catalog managed application. The deployment creates two resource groups. One resource group contains the managed application and the other is a managed resource group for the deployed resource. The managed application definition deploys an App Service plan, App Service, and storage account.

## Prerequisites

To complete this quickstart, you need an Azure account with an active subscription. If you completed a quickstart to publish a definition, you should already have an account. Otherwise, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Create service catalog managed application

In the Azure portal, use the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Create a resource**.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/create-resource.png" alt-text="Screenshot of Azure home page with Create a resource highlighted.":::

1. Search for _Service Catalog Managed Application_ and select it from the available options.

1. **Service Catalog Managed Application** is displayed. Select **Create**.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/create-service-catalog-managed-application.png" alt-text="Screenshot of search result for Service Catalog Managed Application with create button highlighted.":::

1. Select **Sample managed application** and then select **Create**.

   The portal displays the managed application definitions that you created with the quickstart articles to publish an application definition.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/select-service-catalog-managed-application.png" alt-text="Screenshot that shows managed application definitions that you can deploy.":::

1. Provide values for the **Basics** tab and select **Next: Web App settings**.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/basics-info.png" alt-text="Screenshot that highlights the required information on the basics tab.":::

   - **Subscription**: Select the subscription where you want to deploy the managed application.
   - **Resource group**: Select the resource group. For this example, create a resource group named _applicationGroup_.
   - **Region**: Select the location where you want to deploy the resource.
   - **Application Name**: Enter a name for your application. For this example, use _demoManagedApplication_.
   - **Application resources Resource group name**: The name of the managed resource group that contains the resources that are deployed for the managed application. The default name is in the format `rg-{definitionName}-{dateTime}` but you can change the name.

1. Provide values for the **Web App settings** tab and select **Next: Storage settings**.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/web-app-settings.png" alt-text="Screenshot that highlights the required information on the Web App settings tab.":::

   - **App Service plan name**: Create a plan name. Maximum of 40 alphanumeric characters and hyphens. For example, _demoAppServicePlan_. App Service plan names must be unique within a resource group in your subscription.
   - **App Service name prefix**: Create a prefix for the plan name. Maximum of 47 alphanumeric characters or hyphens. For example, _demoApp_. During deployment, the prefix is concatenated with a unique string to create a name that's globally unique across Azure.

1. Enter a prefix for the storage account name and select the storage account type. Select **Next: Review + create**.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/storage-settings.png" alt-text="Screenshot that shows the information needed to create a storage account.":::

   - **Storage account name prefix**: Use only lowercase letters and numbers and a maximum of 11 characters. For example, _demostg1234_. During deployment, the prefix is concatenated with a unique string to create a name globally unique across Azure. Although you're creating a prefix, the control checks for existing names in Azure and might post a validation message that the name already exists. If so, choose a different prefix.
   - **Storage account type**: Select **Change type** to choose a storage account type. The default is Standard LRS.

1. Review the summary of the values you selected and verify **Validation Passed** is displayed. Select **Create** to deploy the managed application.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/summary-validation.png" alt-text="Screenshot that summarizes the values you selected and shows the status of validation passed.":::

## View results

After the service catalog managed application is deployed, you have two new resource groups. One resource group contains the managed application. The other resource group contains the managed resources that were deployed. In this example, an App Service, App Service plan, and storage account.

### Managed application

Go to the resource group named **applicationGroup** and select **Overview**. The resource group contains your managed application named _demoManagedApplication_.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/view-application-group.png" alt-text="Screenshot that shows the resource group that contains the managed application.":::

Select the managed application's name to get more information like the link to the managed resource group.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/view-managed-application.png" alt-text="Screenshot that shows the managed application's details and highlights the link to the managed resource group.":::

### Managed resources

Go to the managed resource group with the name prefix **rg-sampleManagedApplication** and select **Overview** to display the resources that were deployed. The resource group contains an App Service, App Service plan, and storage account.

   :::image type="content" source="./media/deploy-service-catalog-quickstart/view-managed-resource-group.png" alt-text="Screenshot that shows the managed resource group that contains the resources deployed by the managed application definition.":::

The managed resource group and each resource created by the managed application has a role assignment. When you used a quickstart article to create the definition, you created an Azure Active Directory group. That group was used in the managed application definition. When you deployed the managed application, a role assignment for that group was added to the managed resources.

To see the role assignment from the Azure portal:

1. Go to your **rg-sampleManagedApplication** resource group.
1. Select **Access Control (IAM)** > **Role assignments**.

   You can also view the resource's **Deny assignments**.

The role assignment gives the application's publisher access to manage the storage account. In this example, the publisher might be your IT department. The _Deny assignments_ prevents customers from making changes to a managed resource's configuration. Managed apps are designed so that customers don't need to maintain the resources. The _Deny assignment_ excludes the Azure Active Directory group that was assigned in **Role assignments**.

## Clean up resources

When your finished with the managed application, you can delete the resource groups and that removes all the resources you created. For example, in this quickstart you created the resource groups _applicationGroup_ and a managed resource group with the prefix _rg-sampleManagedApplication_.

1. From Azure portal **Home**, in the search field, enter _resource groups_.
1. Select **Resource groups**.
1. Select **applicationGroup** and **Delete resource group**.
1. To confirm the deletion, enter the resource group name and select **Delete**.

When the resource group that contains the managed application is deleted, the managed resource group is also deleted. In this example, when _applicationGroup_ is deleted the  _rg-sampleManagedApplication_ resource group is also deleted.

If you want to delete the managed application definition, delete the resource groups you created in the quickstart articles.

- **Publish application definition**: _packageStorageGroup_ and _appDefinitionGroup_.
- **Publish definition with bring your own storage**: _packageStorageGroup_, _byosDefinitionStorageGroup_, and _byosAppDefinitionGroup_.

## Next steps

- To learn how to create and publish the definition files for a managed application, go to [Quickstart: Create and publish an Azure Managed Application definition](publish-service-catalog-app.md).
- To use your own storage to create and publish the definition files for a managed application, go to [Quickstart: Bring your own storage to create and publish an Azure Managed Application definition](publish-service-catalog-bring-your-own-storage.md).
