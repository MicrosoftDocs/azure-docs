---
title: Integrating Microsoft Entra Entitlement Management with Microsoft Teams using Custom Extensibility and Logic Apps
description: This tutorial walks you through integrating Microsoft Teams with entitlement management using custom extensions and Logic Apps.
author: owinfreyATL
ms.author: owinfrey
ms.service: active-directory
ms.subservice: compliance
ms.workload: identity
ms.topic: tutorial 
ms.date: 07/05/2023
ms.custom: template-tutorial 
---

# Tutorial: Integrating Microsoft Entra Entitlement Management with Microsoft Teams using Custom Extensibility and Logic Apps


Scenario: Use custom extensibility and an Azure Logic App to automatically send notifications to end users on Microsoft Teams when they receive or are denied access to an access package.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Adding a Logic App Workflow to an existing catalog.
> * Adding a custom extension to a policy within an existing access package.
> * Register an application in Microsoft Entra ID for resuming Entitlement Management workflow
> * Configuring ServiceNow for Automation Authentication.
> * Requesting access to an access package as an end-user.
> * Receiving access to the requested access package as an end-user.


## Prerequisites

- A Microsoft Entra user account with an active Azure subscription. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.


## Create a Logic App and custom extension in a catalog

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Prerequisite roles: Global administrator, Identity Governance administrator, or Catalog owner and Resource Group Owner.

To create a Logic App and custom extension in a catalog, you'd follow these steps:

1. Navigate To Microsoft Entra admin center [Identity Governance - Microsoft Entra admin center](https://entra.microsoft.com/#view/Microsoft_AAD_ERM/DashboardBlade/~/elmEntitlement)

1. In the left menu, select **Catalogs**. 

1. Select the catalog for which you want to add a custom extension and then in the left menu, select **Custom Extensions**.

1. In the header navigation bar, select **Add a Custom Extension**.

1. In the **Basics** tab, enter the name of the custom extension and a description of the workflow. These fields show up in the **Custom Extensions** tab of the Catalog.

1. Select the **Extension Type** as “**Request workflow**” to correspond with the policy stage of the access package requested being created, when the request is approved, when assignment is granted, and when assignment is removed.
   > [!NOTE]
   > Another custom extension can be created for the **Pre-Expiration workflow**.
    
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-create-custom-extension.png" alt-text="Screenshot of creating a custom extension for entitlement management." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-create-custom-extension.png":::
1. Under Extension Configuration, select “**Launch and continue**”, which will ensure that Entitlement Management continues after this workflow is triggered.
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-custom-extension-behavior.png" alt-text="Screenshot of entitlement management custom extension behavior actions tab." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-custom-extension-behavior.png":::
1. In the **Details** tab, choose Yes in the "*Create new logic App*" field and provide the Azure subscription and resource group details, along with the Logic App name. Select “*Create a logic app*”. 
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-custom-extension-details-expanded.png" alt-text="Screenshot of expanded custom extension details selection." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-custom-extension-details-expanded.png":::
1. It shows as “*Deploying*”, and once done a success message will appear such as:
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-successful-deploy.png" alt-text="Screenshot of a successful deploy of a new Logic App.":::
1. In **Review and Create**, review the summary of your custom extension and make sure the details for your Logic App call-out are correct. Then select **Create**. 

This custom extension to the linked Logic App now appears in your Custom Extensions tab under Catalogs. You're able to call on this in the access package policies. 

## Configuring the Logic App

1. The custom extension created will show under the **Custom Extensions** tab. Select the “*Logic app*” in the custom extension that will redirect you to a page to configure the logic app.
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-configure-logic-app.png" alt-text="Screenshot of the configure logic apps screen." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-configure-logic-app.png":::
1. On the left menu, select **Logic app designer**.
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-logic-app-designer.png" alt-text="Screenshot of the logic apps designer screen." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-logic-app-designer.png":::
1. Delete the **Condition** by selecting the 3 dots on the right side and select “*Delete*” and select “*OK*”. Once deleted, the page should have an option to add a new step.
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-logic-app-designer-condition.png" alt-text="Screenshot of setting the logic app designer condition." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-logic-app-designer-condition.png":::
1. Select “*New Step*”, which will open a dialog box and then select **All** and expand the list of connectors.
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-logic-app-designer-connectors.png" alt-text="Screenshot of the list of connectors for the Logic App." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-logic-app-designer-connectors.png":::
1. In the list that appears, search and select Microsoft Teams.
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-logic-app-designer-connectors-teams.png" alt-text="Screenshot of Microsoft Teams app in the Logic App connectors list." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-logic-app-designer-connectors-teams.png":::
1. In the list of actions, select “*Post message in a chat or channel*”.
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-teams-post-message.png" alt-text="Screenshot of the teams actions in logic app designer.":::
1. For **Post as** select “*Flow Bot*”, and for **Post In** select “*Chat with Flow bot*”.
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-teams-post-message-parameters.png" alt-text="Screenshot of setting the teams post message parameters.":::
1. Selecting **Recipient** provides a pop up to select Dynamic Content. Select “*ObjectID -Requestor-Objectid*”.
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-teams-post-message-recipient.png" alt-text="Screenshot of setting the recipient ID for the teams post message.":::
1. Add the email content in the message. You can also format plain text, or add dynamic content. 
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-teams-post-message-dynamic-content.png" alt-text="Screenshot of the dynamic content setting in the teams post message settings.":::
1. Select inside “*Add new Parameter*” and check the “*IsAlert*” box to have the message show up on Microsoft Teams’s activity feed.
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-teams-post-message-alert.png" alt-text="Screenshot of setting isAlert in the teams post message settings.":::
1. Select **Save** to ensure your changes are stored. The Logic App is now ready to send emails when updates are made to an access package linked to it.


## Add Custom Extension to a policy in an existing Access Package

After setting up custom extensibility in the catalog, administrators can create an access package with a policy to trigger the custom extension when the request has been approved. This enables them to define specific access requirements, and tailor the access review process to meet their organization's needs.   

**Prerequisite roles**: Global administrator, Identity Governance administrator, Catalog owner, or Access package manager 

1. In the Identity Governance portal, select **Access packages**. 

1. Select the access package you want to add a custom extension (Logic App) to from the list of already created access packages.

1. Select **Edit** and under **Properties** change the catalog to one previously used in the section: [Create a Logic App and custom extension in a catalog](entitlement-management-custom-teams-extension.md#create-a-logic-app-and-custom-extension-in-a-catalog) then select **Save**.

1. Change to the Policies tab, select the policy, and select **Edit**. 

1. In the policy settings, go to the **Custom Extensions** tab.

1. In the menu below Stage, select the access package event you wish to use as trigger for this custom extension (Logic App). For our scenario, to trigger the custom extension Logic App workflow when an access package is requested, approved, granted, or removed, select **Request is created**, **Request is approved**, **Assignment is Granted**, and **Assignment is removed**.
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-custom-extension-policy.png" alt-text="Screenshot of custom extension policies for an access package.":::
1. Select **Update** to add it to an existing access package's policy.

## Add Custom Extension to a new Access Package  

1. In the Identity Governance portal, select **Access packages** and create a new access package. 

1. Under the Basics tab, add the name of the policy, description and the catalog used in the section  [Create a Logic App and custom extension in a catalog](entitlement-management-custom-teams-extension.md#create-a-logic-app-and-custom-extension-in-a-catalog).
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-create-access-package.png" alt-text="Screenshot of creating an access package.":::
1. Add the required **Resource roles**.

1. Add the required **Requests**.

1. Provide **Requestor Information** if needed.

1. Add **Lifecycle** details.

1. Under the Custom Extensions tab, in the menu below Stage, select the access package event you wish to use as trigger for this custom extension (Logic App). For our scenario, to trigger the custom extension Logic App workflow when an access package is requested, approved, granted, or removed, select **Request is created**, **Request is approved**, **Assignment is Granted**, and **Assignment is removed**.
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-access-package-policy.png" alt-text="Screenshot of access package policy selection.":::
1. In **Review and Create**, review the summary of your access package, and make sure the details are correct, then select **Create**. 

> [!NOTE]
> Select **New access package** if you want to create a new access package. For more information about how to create an access package, see: [Create a new access package in entitlement management](entitlement-management-access-package-create.md). For more information about how to edit an existing access package, see: [Change request settings for an access package in Microsoft Entra entitlement management](entitlement-management-access-package-request-policy.md#open-and-edit-an-existing-policys-request-settings). 


## Validation

To validate successful integration with Microsoft Teams, you'd add or remove a user to the access package created in the section [Add Custom Extension to a new Access Package](entitlement-management-custom-teams-extension.md#add-custom-extension-to-a-new-access-package). The user receives a notification on Microsoft Teams from **Power Automate**.

## Next step

> [!div class="nextstepaction"]
> [Configure verified ID settings for an access package in entitlement management](entitlement-management-verified-id-settings.md)
