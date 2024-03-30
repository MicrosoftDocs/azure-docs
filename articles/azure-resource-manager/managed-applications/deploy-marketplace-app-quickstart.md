---
title: Deploy an Azure Marketplace managed application
description: Describes how to deploy an Azure Marketplace managed application using Azure portal.
ms.topic: quickstart
ms.date: 04/25/2023
---

# Quickstart: Deploy an Azure Marketplace managed application

In this quickstart, you deploy an Azure Marketplace managed application and verify the resource deployments in Azure. A Marketplace managed application publisher charges a fee to maintain the application, and during the deployment, the publisher is given permissions to your application's managed resource group. As a customer, you have limited access to the deployed resources, but can delete the managed application from your Azure subscription.

To avoid unnecessary costs for the managed application's Azure resources, go to [clean up resources](#clean-up-resources) when you're finished.

## Prerequisites

An Azure account with an active subscription. If you don't have an account, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Find a managed application

To get a managed application from the Azure portal, use the following steps.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for _Marketplace_ and select it from the available options. Or if you've recently used **Marketplace**, select it from the list.

   :::image type="content" source="media/deploy-marketplace-app-quickstart/select-marketplace.png" alt-text="Screenshot of the Azure portal home page to search for Marketplace or select it from the list of Azure services.":::

1. On the **Marketplace** page, search for _Microsoft community training_.
1. Select **Microsoft Community Training (Preview)**.

   :::image type="content" source="media/deploy-marketplace-app-quickstart/select-marketplace-app.png" alt-text="Screenshot of the Azure Marketplace that shows the managed application to select for deployment.":::

1. Select the **Basic** plan and then select **Create**.

   :::image type="content" source="media/deploy-marketplace-app-quickstart/select-plan.png" alt-text="Screenshot that shows the Basic plan is selected and the create button is highlighted.":::

## Deploy the managed application

1. On the **Basics** tab, enter the required information.

   :::image type="content" source="media/deploy-marketplace-app-quickstart/portal-basics.png" alt-text="Screenshot that shows the form's Basics tab to deploy the managed application.":::

   - **Subscription**: Select your Azure subscription.
   - **Resource group**: Create a new resource group. For this example use _demo-marketplace-app_.
   - **Region**: Select a region, like _West US_.
   - **Application Name**: Enter a name, like _demotrainingapp_.
   - **Managed Resource Group**: Use the default name for this example. The format is `mrg-microsoft-community-training-<dateTime>`. But you can change the name if you want.

1. Select **Next: Setup your portal**.
1. On the **Setup your portal** tab, enter the required information.

   :::image type="content" source="media/deploy-marketplace-app-quickstart/portal-setup.png" alt-text="Screenshot that shows the form's Setup your portal tab to deploy the managed application.":::

   - **Website name**: Enter a name that meets the criteria specified on the form, like _demotrainingsite_. Your website name should be globally unique across Azure.
   - **Organization name**: Enter your organization's name.
   - **Contact email addresses**: Enter at least one valid email address.

1. Select **Next: Setup your login type**.
1. On the **Setup your login type** tab, enter the required information.

   :::image type="content" source="media/deploy-marketplace-app-quickstart/portal-setup-login.png" alt-text="Screenshot that shows the form's Setup your login type tab to deploy the managed application.":::

   - **Login type**: For this example, select **Mobile**.
   - **Org admin's mobile number**: Enter a valid mobile phone number including the country/region code, in the format _+1 1234567890_. The phone number is used to sign in to the training site.

1. Select **Next: Review + create**.
1. After **Validation passed** is displayed, verify the information is correct.
1. Read **Co-Admin Access Permission** and check the box to agree to the terms.

   :::image type="content" source="media/deploy-marketplace-app-quickstart/create-app.png" alt-text="Screenshot that shows the validation passed, the co-admin permission box is selected, and create button is highlighted.":::

1. Select **Create**.

The deployment begins and because many resources are created, the Azure deployment takes about 20 minutes to finish. You can verify the Azure deployments before the website becomes available.

## Verify the managed application deployment

After the managed application deployment is finished, you can verify the resources.

1. Go to resource group **demo-marketplace-app** and select the managed application.

   :::image type="content" source="media/deploy-marketplace-app-quickstart/app-resource-group.png" alt-text="Screenshot of the resource group where the managed application is installed that highlights the application name.":::

1. Select the **Overview** tab to display the managed application and link to the managed resource group.

   :::image type="content" source="media/deploy-marketplace-app-quickstart/managed-app.png" alt-text="Screenshot of the managed application that highlights the link to the managed resource group.":::

1. The managed resource group shows the resources that were deployed and the deployments that created the resources.

   :::image type="content" source="media/deploy-marketplace-app-quickstart/mrg-apps.png" alt-text="Screenshot of the managed resource group that highlights the deployments and list of deployed resources.":::

1. To review the publisher's permissions in the managed resource group, select **Access Control (IAM)** > **Role assignments**.

   You can also verify the **Deny assignments**.

For this example, the website's availability isn't necessary. The article's purpose is to show how to deploy an Azure Marketplace managed application and verify the resources. To avoid unnecessary costs, go to [clean up resources](#clean-up-resources) when you're finished.

### Launch the website (optional)

After the deployment is completed, from the managed resource group, you can go to the App Service resource and launch your website.

   :::image type="content" source="media/deploy-marketplace-app-quickstart/app-service.png" alt-text="Screenshot of the App Service with the website link highlighted.":::

The site might respond with a page that the deployment is still processing.

   :::image type="content" source="media/deploy-marketplace-app-quickstart/deployment-message.png" alt-text="Screenshot that shows the website deployment is in progress.":::

When your website is available, a default sign-in page is displayed. You can sign-in with the mobile phone number that you used during the deployment and you'll receive a text message confirmation. When you're finished, be sure to sign out of your training website.

## Clean up resources

When you're finished with the managed application, you can delete the resource groups and that removes all the Azure resources you created. For example, in this quickstart you created the resource groups _demo-marketplace-app_ and a managed resource group with the prefix _mrg-microsoft-community-training_.

When you delete the **demo-marketplace-app** resource group, the managed application, managed resource group, and all the Azure resources are deleted.

1. Go to the **demo-marketplace-app** resource group and **Delete resource group**.

   :::image type="content" source="media/deploy-marketplace-app-quickstart/delete-resource-group.png" alt-text="Screenshot of the highlighted delete resource group button.":::

1. To confirm the deletion, enter the resource group name and select **Delete**.

   :::image type="content" source="media/deploy-marketplace-app-quickstart/confirm-delete-resource-group.png" alt-text="Screenshot that shows the delete resource group confirmation.":::


## Next steps

- To learn how to create and publish the definition files for a managed application, go to [Quickstart: Create and publish an Azure Managed Application definition](publish-service-catalog-app.md).
- To learn how to deploy a managed application, go to [Quickstart: Deploy a service catalog managed application](deploy-service-catalog-quickstart.md)
- To use your own storage to create and publish the definition files for a managed application, go to [Quickstart: Bring your own storage to create and publish an Azure Managed Application definition](publish-service-catalog-bring-your-own-storage.md).
