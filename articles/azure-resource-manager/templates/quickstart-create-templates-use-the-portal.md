---
title: Deploy template - Azure portal
description: Learn how to create your first Azure Resource Manager template (ARM template) using the Azure portal. You also learn how to deploy it.
author: mumian
ms.date: 06/27/2022
ms.topic: quickstart
ms.author: jgao
ms.custom: contperf-fy21q3, mode-ui
#Customer intent: As a developer new to Azure deployment, I want to learn how to use the Azure portal to create and edit Resource Manager templates, so I can use the templates to deploy Azure resources.
---

# Quickstart: Create and deploy ARM templates by using the Azure portal 

In this quickstart, you learn how to generate an Azure Resource Manager template (ARM template) in the Azure portal. You edit and deploy the template from the portal. 

ARM templates are JSON files that define the resources you need to deploy for your solution. To understand the concepts associated with deploying and managing your Azure solutions, see [template deployment overview](overview.md).

After completing the tutorial, you deploy an Azure Storage account. The same process can be used to deploy other Azure resources.

 :::image type="content" source="./media/quickstart-create-templates-use-the-portal/arm-custom-template-diagram.jpg" alt-text="Resource Manager template quickstart portal diagram":::


If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Retrieving a custom template from the portal

As the user, you can get custom template from the portal in order to use for your deployment. You'll be able to configure your deployment in the Azure portal and download the corresponding ARM template. This template can be saved and reused in the future, and will serve as a good starting point. Although using Visual Studio Code is the recommended option, if you're new to Azure deployment, using custom templates is a good introduction to the overall process. 

1. In a web browser, go to the [Azure portal](https://portal.azure.com) and sign in.
2. From the Azure portal search bar, search for **deploy a custom template** and then select it.

:::image type="content" source="./media/quickstart-create-templates-use-the-portal/arm-search-custom-template.jpg" alt-text="Search for Custom Template":::

3. On the Custom Deployment page, select **quickstart template** under the Template Source section. Here, you can search for many kinds of templates, but with this quickstart, input `quickstarts/microsoft.storage/storage-account-create` in order to create a simple storage account. There are many other [collections of custom templates](https://github.com/Azure/azure-quickstart-templates) that others have created as well. These custom templates also follow best practices guidelines, which make it easier for you to select for specific scenarios. 

    :::image type="content" source="./media/quickstart-create-templates-use-the-portal/arm-select-custom-template.jpg" alt-text="Select Quickstart Template":::

4. After moving to the next step, Enter the following information on the following page:

    For the **resource group** field, select **create new**, and specify a resource group name of your choice. On the screenshot, the resource group name is *armtest1.*

    :::image type="content" source="./media/quickstart-create-templates-use-the-portal/arm-input-fields-template.jpg" alt-text="Input Fields for Template":::

    A Resource group is a container for Azure resources that makes Azure resource management much easier.

5. Select **review + create** on the bottom of the screen. 

    :::image type="content" source="./media/quickstart-create-templates-use-the-portal/arm-review-create.jpg" alt-text="review and create":::
 
6. After validation has passed (which may take a couple minutes), proceed to select **create** in order to create your storage account.
1. 
    :::image type="content" source="./media/quickstart-create-templates-use-the-portal/arm-validation.jpg" alt-text="validation and create":::

7. Once your validation has passed, you'll receive a notification that says the deployment succeeded, and the notification will provide a link for the user to view their deployment. In this case, we're viewing the storage account we created. You can view the notification by clicking on the bell icon on the top right of the screen (highlighted).

     :::image type="content" source="./media/quickstart-create-templates-use-the-portal/arm-deploy-success.jpg" alt-text="Deployment Succeeded Notification":::

8. From this screen, you can view all the details for your selected resource group, and your created storage account. Select **the link for the succeeded deployments.**

     :::image type="content" source="./media/quickstart-create-templates-use-the-portal/arm-see-deployment.jpg" alt-text="View Deployment Page":::

## Export your custom template from the Azure portal

1. After the storage account has been created, navigate to the Azure portal to the resource group you deployed to.
2. Once you've selected the resource group, select **export template** from the left bottom pane. 
 
 :::image type="content" source="./media/quickstart-create-templates-use-the-portal/arm-export-template.jpg" alt-text="Export Template":::

3. Here, you can see what your exported template would look like if it were deployed. You can see the whole template, or by selecting the **parameters** link, you can view only the parameters section.

 :::image type="content" source="./media/quickstart-create-templates-use-the-portal/arm-parameters.jpg" alt-text="Export Template":::

4. You'll also be able to **download** and **deploy** the template to edit any resources, parameters, or other fields as needed. This is a good way to get a starting template, however it's important to note that the code samples in the template generated may need additional modifications based on the specific scenario. 

 :::image type="content" source="./media/quickstart-create-templates-use-the-portal/arm-download-template.jpg" alt-text="Export Template"::: 

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group.

1. In the Azure portal, select **resource group** on the left menu.
2. Enter the resource group name in the **filter by name** field.
3. Select the resource group name.  You shall see the storage account in the resource group.
4. Select **delete resource group** in the top menu.

## Next steps

In this tutorial, you learned how to generate a template from the Azure portal, and how to deploy the template using the portal. The template used in this Quickstart is a simple template with one Azure resource. When the template is complex, it's easier to use Visual Studio Code, or Visual Studio to develop the template. To learn more about template development, see our new beginner tutorial series:

> [!div class="nextstepaction"]
> [Beginner tutorials](./template-tutorial-create-first-template.md)
