---
title: Trigger custom logic apps with entitlement management
description: Learn how to configure and use custom logic app workflows in entitlement management.
services: active-directory
documentationCenter: ''
author: owinfreyatl
manager: amycolannino
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 01/25/2023
ms.author: owinfrey
ms.reviewer: 
ms.collection: M365-identity-device-management

#Customer intent: As an administrator, I want detailed information about how I can configure and add custom logic apps to my catalogs and access packages in entitlement management.

---
# Trigger custom logic apps with entitlement management


[Azure Logic Apps](../../logic-apps/logic-apps-overview.md) can be used to automate custom workflows and connect apps and services in one place. Users can integrate Azure Logic Apps with entitlement management to broaden their governance workflows beyond the core entitlement management use cases.

These logic app workflows can then be triggered to run in accordance with entitlement management use cases such as when an access package is granted or requested. For example, an admin could create and link a custom logic app workflow to entitlement management so that when a user requests an access package, the logic app workflow is triggered to ensure that the user is also assigned certain characteristics in a 3rd party SAAS app (like Salesforce) or is sent a custom email.

Entitlement management use cases that can be integrated with Azure Logic Apps include:

- when an access package is requested  

- when an access package request is granted  

- when an access package assignment expires  

These triggers in logic app workflows are controlled in a new tab within access package policies called **Rules**. Additionally, a **Custom Extensions** tab on the Catalog page will show all added logic app resources for a given Catalog. This article describes how to create and add logic apps to catalogs and access packages in entitlement management.

## Create and add a logic app workflow to a catalog for use in entitlement management 

**Prerequisite roles:** Global administrator, Identity Governance administrator, Catalog owner or Resource Group Owner 

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. In the Azure portal, select **Azure Active Directory** and then select **Identity Governance**. 

1. In the left menu, select **Catalogs**. 

1. Select the catalog for which you want to add a custom extension and then in the left menu, select **Custom Extensions (Preview)**. 

1. In the header navigation bar, select **Add a Custom Extension**.  

1. In the **Basics** tab, enter the name of the custom extension (linked logic app that you are adding) and description of the workflow. These fields will show up in the **Custom Extensions** tab of the Catalog going forward.

    ![Pane to create a custom extension](./media/entitlement-management-logic-apps/create-custom-extension.png)

1. Then go on to the **Details** tab. 

1. In the **Create new logic app** field, select **Yes**. Otherwise, select **No** and move on to step 9 if you are going to use an existing logic app. If you selected yes, select one of the options below and move on to step 9: 

    1. Select **create new Azure AD application** if you want to use a new application as the basis for the new logic app, or
    
        ![Pane to select new app for logic app](./media/entitlement-management-logic-apps/new-app-selection.png)

    1. select **an existing Azure AD Application** if you want to use an existing application as the basis for the new logic app.
    
        ![Pane to select existing app for logic app](./media/entitlement-management-logic-apps/existing-app-selection.png)

    > [!NOTE]    
    > Later, you can edit what your logic app workflow does in workflow designer. To do so, in the **Custom Extensions** tab of **Catalogs**, select the logic app you created.

1. Next, enter the **Subscription ID**, **Resource group**, **Logic app name**. 

1. Then, select **Validate and Create**. 

1. Review the summary of your custom extension and make sure the details for your logic app callout are correct. Then select **Create**.

    ![Example of custom extension summary](./media/entitlement-management-logic-apps/custom-extension-summary.png)

This custom extension to the linked logic app will now appear in your Custom Extensions tab under Catalogs. You will be able to call on this in access package policies.

## Edit a linked logic app

**Prerequisite roles:** Global administrator, Identity Governance administrator, or Catalog owner 

1. Sign in to the [Azure portal](https://portal.azure.com)l. 

1. In the Azure portal, select **Azure Active Directory** and then select **Identity Governance**. 

1. In the left menu, select **Catalogs**. 

1. In the left menu, select **Custom Extensions**. 

1. Here, you can view all custom extensions (logic apps) that you have added to this Catalog. To edit a logic app workflow, or to create a workflow for a newly-added logic app, select the Azure Logic Apps custom extension under **Endpoint**. This will open the workflow designer and allow you to create your workflow.  

For more information on creating logic app workflows, see [Create an example Consumption workflow with Azure Logic Apps in the Azure portal](../../logic-apps/quickstart-create-example-consumption-workflow.md).

## Add custom extension to a policy in an access package

**Prerequisite roles:** Global administrator, Identity Governance administrator, Catalog owner, or Access package manager 

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. In the Azure portal, select **Azure Active Directory** and then select **Identity Governance**. 

1. In the left menu, select **Access packages**. 

1. Select the access package you want to add a custom extension (logic app) to from the list of access packages that have already been created.  

    > [!NOTE]  
    > Select **New access package** if you want to create a new access package.
    > For more information about how to create an access package see [Create a new access package in entitlement management](entitlement-management-access-package-create.md).  For more information about how to edit an existing access package, see [Change request settings for an access package in Azure AD entitlement management](entitlement-management-access-package-request-policy.md#open-and-edit-an-existing-policys-request-settings).

1. Change to the policy tab, select the policy and select **Edit**.

1. In the policy settings, go to the **Custom Extensions (Preview)** tab.

1. In the menu below **Stage**, select the access package event you wish to use as trigger for this custom extension (logic app). For example, if you only want to trigger the custom extension logic app workflow when a user requests the access package, select **Request is created**. 

1. In the menu below **Custom Extension**, select the custom extension (logic app) you want to add to the access package. The do action you select will execute when the event selected in the when field occurs.  

1. Select **Update** to add it to an existing access package's policy.

    ![Add a logic app to access package](./media/entitlement-management-logic-apps/add-logic-apps-access-package.png)

## Troubleshooting and Validation 

To verify that your custom extension has correctly triggered the associated logic app when called upon by the access package **Do** option, you can view the Azure Logic Apps logs. 

The overview page for a specific logic app will show timestamps of when the logic app was last executed. Also, the Resource Group overview for a resource group with a linked custom extension will show the name of that custom extension in the overview if it has been configured correctly.  

## Next steps
