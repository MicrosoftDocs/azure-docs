---
title: Language service role-based access control (RBAC)
titleSuffix: Azure Cognitive Services
description: Use this article to learn about access controls for Azure Cognitive Service for Language
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 08/02/2022
ms.author: aahi
---


# Language role-based access control

Azure Cognitive Service for Language supports Azure role-based access control (Azure RBAC), an authorization system for managing individual access to Azure resources. Using Azure RBAC, you assign different team members different levels of permissions for your projects authoring resources. See the [Azure RBAC documentation](/azure/role-based-access-control/) for more information.

## Enable Azure Active Directory authentication 

To use Azure RBAC, you must enable Azure Active Directory authentication. You can [create a new resource with a custom subdomain](../../authentication.md) or [create a custom subdomain for your existing resource](../../cognitive-services-custom-subdomains.md#how-does-this-impact-existing-resources).

## Add role assignment to Language Authoring resource

Azure RBAC can be assigned to a Language Authoring resource. To grant access to an Azure resource, you add a role assignment.
1. In the [Azure portal](https://ms.portal.azure.com/), select **All services**. 
2. Select **Cognitive Services**, and navigate to your specific Language Authoring resource.

   > [!NOTE]
   > You can also set up Azure RBAC for whole resource groups, subscriptions, or management groups. Do this by selecting the desired scope level and then navigating to the desired item. For example, selecting **Resource groups** and then navigating to a specific resource group.

1. Select **Access control (IAM)** on the left navigation pane.
1. Select **Add**, then select **Add role assignment**.
1. On the **Role** tab on the next screen, select a role you want to add.
1. On the **Members** tab, select a user, group, service principal, or managed identity.
1. On the **Review + assign** tab, select **Review + assign** to assign the role.

Within a few minutes, the target will be assigned the selected role at the selected scope. For help with these steps, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

## Language role types

Use the following table to determine access needs for your Language projects.

These custom roles only apply to Language authoring resources. 

> [!NOTE]
> * All prebuilt capabilities are accessible to all roles.
> * The "Owner" and "Contributor" roles take priority over custom language roles.
> * Azure Active Directory (Azure AD) is only used for custom Language roles.

### Cognitive Services Language reader

A user that should only be validating and reviewing the Language apps, typically a tester to ensure the application is performing well before deploying the project. They may want to review the application’s assets to notify the app developers of any changes that need to be made, but do not have direct access to make them. Readers will have access to view the evaluation results.


:::row:::
    :::column span="":::
        **Capabilities**
    :::column-end:::
    :::column span="":::
        **API Access**
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
        * Read
        * Test
    :::column-end:::
    :::column span="":::
      * All GET APIs under: 
         * [Language Authoring CLU APIs](/rest/api/language/conversational-analysis-authoring)
         * [Language Authoring Text Analysis APIs](/rest/api/language/text-analysis-authoring)
         * [Question Answering Projects](/rest/api/cognitiveservices/questionanswering/question-answering-projects)
      * Only the `TriggerExportProjectJob` POST operation under: 
         * [Language Authoring CLU export API](/rest/api/language/conversational-analysis-authoring/export?tabs=HTTP)
         * [Language Authoring Text Analysis export API](/rest/api/language/text-analysis-authoring/export?tabs=HTTP)
      * Only Export POST operation under: 
         * [Question Answering Projects](/rest/api/cognitiveservices/questionanswering/question-answering-projects/export)
      * All the Batch testing web APIs
         *[Language Runtime CLU APIs](/rest/api/language/conversation-analysis-runtime)
         *[Language Runtime Text Analysis APIs](/rest/api/language/text-analysis-runtime)
    :::column-end:::
:::row-end:::

### Cognitive Services Language writer

A user that is responsible for building and modifying an application, as a collaborator in a larger team. The collaborator can modify the Language apps in any way, train those changes, and validate/test those changes in the portal. However, this user shouldn’t have access to deploying this application to the runtime, as they may accidentally reflect their changes in production. They also shouldn’t be able to delete the application or alter its prediction resources and endpoint settings (assigning or unassigning prediction resources, making the endpoint public). This restricts this role from altering an application currently being used in production. They may also create new applications under this resource, but with the restrictions mentioned.

:::row:::
    :::column span="":::
        **Capabilities**
    :::column-end:::
    :::column span="":::
        **API Access**
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
      * All functionalities under Cognitive Services Language Reader.
      * Ability to: 
          * Train
          * Write
    :::column-end:::
    :::column span="":::
      * All APIs under Language reader
      * All POST, PUT and PATCH APIs under:
         * [Language Authoring CLU APIs](/rest/api/language/conversational-analysis-authoring)
         * [Language Authoring Text Analysis APIs](/rest/api/language/text-analysis-authoring)
         * [Question Answering Projects](/rest/api/cognitiveservices/questionanswering/question-answering-projects)
          Except for
          * Delete deployment
          * Delete trained model
          * Delete project
          * Deploy model
    :::column-end:::
:::row-end:::

### Cognitive Services Language owner

These users are the gatekeepers for the Language applications in production environments. They should have full access to any of the underlying functions and thus can view everything in the application and have direct access to edit any changes for both authoring and runtime environments

:::row:::
    :::column span="":::
        **Functionality**
    :::column-end:::
    :::column span="":::
        **API Access**
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
      * All functionalities under Cognitive Services Language Writer
      * Deploy
      * Delete
    :::column-end:::
    :::column span="":::
      * All APIs available under:
        * [Language Authoring CLU APIs](/rest/api/language/conversational-analysis-authoring)
        * [Language Authoring Text Analysis APIs](/rest/api/language/text-analysis-authoring)
        * [Question Answering Projects](/rest/api/cognitiveservices/questionanswering/question-answering-projects)
         
    :::column-end:::
:::row-end:::
