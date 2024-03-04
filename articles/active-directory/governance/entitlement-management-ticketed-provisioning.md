---
title: Automated ServiceNow Ticket Creation with Azure AD Entitlement Management Integration
description: This tutorial walks you through Ticketed provisioning via ServiceNow integration with entitlement management using custom extensions and Logic Apps.
author: owinfreyATL
ms.author: owinfrey
ms.service: active-directory
ms.subservice: compliance
ms.workload: identity
ms.topic: tutorial 
ms.date: 05/31/2023
ms.custom: template-tutorial 
---

# Tutorial: Automated ServiceNow Ticket Creation with Azure AD Entitlement Management Integration



Scenario: In this scenario you learn how to use custom extensibility, and a Logic App, to automatically generate ServiceNow tickets for manual provisioning of users who have received assignments and need access to apps.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Adding a Logic App Workflow to an existing catalog.
> * Adding a custom extension to a policy within an existing access package.
> * Register an application in Azure AD for resuming Entitlement Management workflow
> * Configuring ServiceNow for Automation Authentication.
> * Requesting access to an access package as an end-user.
> * Receiving access to the requested access package as an end-user.

## Prerequisites

- An Azure AD user account with an active Azure subscription. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
- A [ServiceNow instance](https://www.servicenow.com/) of Rome or higher
- SSO integration with ServiceNow. If this isn't already configured, see:[Tutorial: Azure Active Directory single sign-on (SSO) integration with ServiceNow](../saas-apps/servicenow-tutorial.md) before continuing.

## Adding Logic App Workflow to an existing Catalog for Entitlement Management

Prerequisite roles: Global administrator, Identity Governance administrator, or Catalog owner and Resource Group Owner.

To add a Logic App workflow to an existing catalog, you use an ARM template for the Logic App creation here: 

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Figaelmprodportalhosting.blob.core.windows.net%2Farm-deployment-template%2FLogicAppServiceNowIntegration.json ).

:::image type="content" source="media/entitlement-management-servicenow-integration/logic-app-arm-template.png" alt-text="Screenshot of Logic App ARM template." lightbox="media/entitlement-management-servicenow-integration/logic-app-arm-template.png":::

Provide the Azure subscription, resource group details, along with the Logic App name and the Catalog ID to associate the Logic App with and select purchase. For more information on how to create a new catalog, please follow the steps in this document: [Create and manage a catalog of resources in entitlement management](entitlement-management-catalog-create.md).


1. Navigate To Entra portal [Identity Governance - Microsoft Entra admin center](https://entra.microsoft.com/#view/Microsoft_AAD_ERM/DashboardBlade/~/elmEntitlement)

1. In the left menu, select **Catalogs**. 

1. Select the catalog for which you want to add a custom extension and then in the left menu, select **Custom Extensions (Preview)**.

1. In the header navigation bar, select **Add a Custom Extension**.

1. In the **Basics** tab, enter the name of the custom extension and a description of the workflow. These fields show up in the **Custom Extensions** tab of the Catalog.
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-create-custom-extension.png" alt-text="Screenshot of creating a custom extension for entitlement management." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-create-custom-extension.png":::
1. Select the **Extension Type** as “**Request workflow**” to correspond with the policy stage of the access package requested being created.
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-custom-extension-behavior.png" alt-text="Screenshot of entitlement management custom extension behavior actions tab." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-custom-extension-behavior.png":::
1. Select **Launch and wait** in the **Extension Configuration** which will pause the associated access package action until after the Logic App linked to the extension completes its task, and a resume action is sent by the admin to continue the process. For more information on this process, see:  [Configuring custom extensions that pause entitlement management processes](entitlement-management-logic-apps-integration.md#configuring-custom-extensions-that-pause-entitlement-management-processes).

1. In the **Details** tab, choose No in the "*Create new logic App*" field as the Logic App has already been created in the previous steps. However, you need to provide the Azure subscription and resource group details, along with the Logic App name.
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-custom-extension-details.png" alt-text="Screenshot of the entitlement management  custom extension details tab." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-custom-extension-details.png":::
1. In **Review and Create**, review the summary of your custom extension and make sure the details for your Logic App call-out are correct. Then select **Create**.

1. This custom extension to the linked Logic App now appears in your Custom Extensions tab under Catalogs. You're able to call on this in access package policies.

> [!TIP]
> To learn more about custom extension feature that pause entitlement management processes, see: [Configuring custom extensions that pause entitlement management processes](entitlement-management-logic-apps-integration.md#configuring-custom-extensions-that-pause-entitlement-management-processes).

## Adding Custom Extension to a policy in an existing Access Package 

After setting up custom extensibility in the catalog, administrators can create an access package with a policy to trigger the custom extension when the request has been approved. This enables them to define specific access requirements and tailor the access review process to meet their organization's needs.  

**Prerequisite roles**: Global administrator, Identity Governance administrator, Catalog owner, or Access package manager

1. In Identity Governance portal, select **Access packages**.

1. Select the access package you want to add a custom extension (Logic App) to from the list of access packages that have already been created.

1. Change to the policy tab, select the policy, and select **Edit**.

1. In the policy settings, go to the **Custom Extensions (Preview)** tab.

1. In the menu below **Stage**, select the access package event you wish to use as trigger for this custom extension (Logic App). For our scenario, to trigger the custom extension Logic App workflow when access package has been approved, select **Request is approved**.
> [!NOTE]
> To create a ServiceNow ticket for an expired assignment that had permission granted previously, add a new stage for "*Assignment is removed*", and then select the LogicApp.

1. In the menu below Custom Extension, select the custom extension (Logic App) you created in the above steps to add to this access package. The action you select executes when the event selected in the *when* field occurs.

1. Select **Update** to add it to an existing access package's policy.
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-access-package-extension.png" alt-text="Screenshot of custom extension details for an access package." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-access-package-extension.png":::

> [!NOTE]
> Select **New access package** if you want to create a new access package. For more information about how to create an access package, see: [Create a new access package in entitlement management](entitlement-management-access-package-create.md). For more information about how to edit an existing access package, see: [Change request settings for an access package in Azure AD entitlement management](entitlement-management-access-package-request-policy.md#open-and-edit-an-existing-policys-request-settings).



## Register an application with secrets in Azure portal

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

With Azure, you're able to use [Azure Key Vault](/azure/key-vault/secrets/about-secrets) to store application secrets such as passwords. To register an application with secrets within the Azure portal, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select Azure Active Directory.

1. Under Manage, select App registrations > New registration.

1. Enter a display Name for your application.

1. Select "Accounts in this organizational directory only" in supported account type.

1. Select Register.

After registering your application, you must add a client secret by following these steps: 

1. In the Azure portal, in App registrations, select your application.

1. Select Certificates & secrets > Client secrets > New client secret.

1. Add a description for your client secret.

1. Select an expiration for the secret or specify a custom lifetime.

1. Select Add.

> [!NOTE]
> To find more detailed information on registering an application, see: [Quickstart: Register an app in the Microsoft identity platform](../develop/quickstart-register-app.md):

To authorize the created application to call the [MS Graph resume API](/graph/api/accesspackageassignmentrequest-resume) you'd do the following steps:

1. Navigate to the Entra portal [Identity Governance - Microsoft Entra admin center](https://entra.microsoft.com/#view/Microsoft_AAD_ERM/DashboardBlade/~/elmEntitlement)

1. In the left menu, select **Catalogs**.

1. Select the catalog for which you have added the custom extension.

1. Select “Roles and administrators” menu and select “+ Add access package assignment manager”.

1. In the Select members dialog box, search for the application created by name or application Identifier. Select the application and choose the *“Select”* button.

> [!TIP]
> You can find more detailed information on delegation and roles on Microsoft’s official documentation located here: [Delegation and roles in entitlement management](entitlement-management-delegate.md).


## Configuring ServiceNow for Automation Authentication

At this point it's time to configure ServiceNow for resuming the entitlement management workflow after the ServiceNow ticket closure:

1. Register an Azure Active Directory application in the ServiceNow Application Registry by following these steps:
    1. Sign in to ServiceNow and navigate to the Application Registry.
    1. Select “*New*” and then select “**Connect to a third party OAuth Provider**”.
    1. Provide a name for the application, and select Client Credentials in the Default Grant type.
    1. Enter the Client Name, ID, Client Secret, Authorization URL, Token URL that were generated when you registered the Azure Active Directory application in the Azure portal.
    1. Submit the application.
        :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-servicenow-application-registry.png" alt-text="Screenshot of the application registry within ServiceNow." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-servicenow-application-registry.png":::
1. Create a System Web Service REST API message by following these steps: 
    1. Go to the REST API Messages section under System Web Services.
    1. Select the "New" button to create a new REST API message.
    1. Fill in all the required fields, which include providing the Endpoint URL: 
        `` https://graph.microsoft.com/beta/identityGovernance/entitlementManagement/accessPackageAssignmentRequests/${AccessPackageAssignmentRequestId}/resume ``
    1. For Authentication, select OAuth2.0 and choose the OAuth profile that was created during the app registration process.
    1. Select the "*Submit*" button to save the changes.
    1. Go back to the REST API Messages section under System Web Services.
    1. Select Http Request and then select "*New*". Enter a name, and select "POST" as the Http method.
    1. In the Http request, add the content for the Http query parameters using the following API Schema:
        ``` http
        API Schema: {
        "data": {
            "@odata.type": "#microsoft.graph.accessPackageAssignmentRequestCallbackData",
            "customExtensionStageInstanceDetail": "Resuming-Assignment for user",
            "customExtensionStageInstanceId": "${StageInstanceId}",
            "stage": "${Stage}"
                  },
                  "source": "ServiceNow",
                    "type": "microsoft.graph.accessPackageCustomExtensionStage.${Stage}"
                    }
        ```
    1. Select "*Submit*" to save the changes.
        :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-servicenow-resume-call.png" alt-text="Screenshot of resume call selection within ServiceNow." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-servicenow-resume-call.png"::: 
        :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-servicenow-request-call.png" alt-text="Screenshot of the http request within ServiceNow.":::
1. Modify the request table schema: To modify the request table schema, make changes to the three tables shown in the following image:
    :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-servicenow-request-table-schema.png" alt-text="Screenshot of the request table schema within ServiceNow." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-servicenow-request-table-schema.png":::
    Add the three column label and type as string:
    - AccessPackageAssignmentRequestId
    - AccessPackageAssignmentStage
    - StageInstanceId
1. To automate workflow with Flow Designer, you'd do the following:
    1. Sign in to ServiceNow and go to Flow Designer.
    1. Select the “*New*” button and create a new action. 
    1. Add an action to invoke the System Web Service REST API message that was created in the previous step.
        :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-servicenow-flow-designer.png" alt-text="Screenshot of flow designer script to resume entitlement management process within ServiceNow." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-servicenow-flow-designer.png":::
        Script for the action: (Update the script with the Column labels created in previous step):
        ``` 
        (function execute(inputs, outputs) {
            gs.info("AccessPackageAssignmentRequestId: " + inputs['accesspkgassignmentrequestid']);
            gs.info("StageInstanceId: " + inputs['customextensionstageinstanceid'] );
            gs.info("Stage: " + inputs['assignmentstage']);
            var r = new sn_ws.RESTMessageV2('Resume ELM WorkFlow', 'RESUME');
            r.setStringParameterNoEscape('AccessPackageAssignmentRequestId', inputs['accesspkgassignmentrequestid']);
            r.setStringParameterNoEscape('StageInstanceId', inputs['customextensionstageinstanceid'] );
            r.setStringParameterNoEscape('Stage', inputs['assignmentstage']);
            var response = r.execute();
            var responseBody = response.getBody();
            var httpStatus = response.getStatusCode();
            var requestBody =  r.getRequestBody();
            gs.info("requestBody: " + requestBody);
            gs.info("responseBody: " + responseBody);
            gs.info("httpStatus: " + httpStatus);
            })(inputs, outputs); 
        ```
    1. Save the Action
    1. Select the "*New*" button to create a new flow.
    1. Enter flow name, select Run as – System User and select submit.
1. To create triggers within ServiceNow, you'd follow these steps:
    1. Select "*Add Trigger*" and then select "*updated*" trigger and run the trigger for every update.
    1. Add a filter condition by updating the condition as shown in the following image:
        :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-servicenow-call-elm-assignment.png" alt-text="Screenshot of ServiceNow call elm resume API" lightbox="media/entitlement-management-servicenow-integration/entitlement-management-servicenow-call-elm-assignment.png":::
    1. Select done.
    1. Select add an action
        :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-servicenow-flow-designer-trigger.png" alt-text="Screenshot of flow diagram trigger." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-servicenow-flow-designer-trigger.png":::
    1. Select the Action and then select the action created in the previous step.
        :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-servicenow-flow-designer-actions.png" alt-text="Screenshot of flow designer actions selection." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-servicenow-flow-designer-actions.png":::
    1. Drag and drop the newly created columns from the request record to the appropriate action parameters.
    1. Select “Done”, “Save” and then “Activate”. 
        :::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-servicenow-flow-designer-save.png" alt-text="Screenshot of save and activate within flow designer." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-servicenow-flow-designer-save.png":::


## Requesting access to an access package as an end-user

When an end user requests access to an access package, the request is sent to the appropriate approver. Once the approver grants approval, Entitlement Management calls the Logic App. The Logic app then calls ServiceNow to create a new request/ticket and Entitlement Management awaits a callback from ServiceNow.

:::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-request-access-package.png" alt-text="Screenshot of requesting an access package." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-request-access-package.png":::

## Receiving access to the requested access package as an end-user 

The IT Support team works on the ticket create above to do necessary provisions and  close the ServiceNow ticket. When the ticket is closed, ServiceNow triggers a call to resume the Entitlement Management workflow. Once the request is completed, the requestor receives a notification from ELM that the request has been fulfilled. This streamlined workflow ensures that access requests are fulfilled efficiently, and users are notified promptly.

:::image type="content" source="media/entitlement-management-servicenow-integration/entitlement-management-myaccess-request-history.png" alt-text="Screenshot of My Access request history." lightbox="media/entitlement-management-servicenow-integration/entitlement-management-myaccess-request-history.png":::

> [!NOTE]
> The end user will see "assignment failed" in the MyAccess portal if the ticket is not closed within 14 days.


## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Trigger Logic Apps with custom extensions in entitlement management (Preview)](entitlement-management-logic-apps-integration.md)
