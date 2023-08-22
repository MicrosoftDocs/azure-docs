---
title: LUIS role-based access control
titleSuffix: Azure AI services
description: Use this article to learn how to add access control to your LUIS resource
author: aahill
ms.author: aahi
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.date: 08/23/2022
ms.topic: conceptual
---

# LUIS role-based access control

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]


LUIS supports Azure role-based access control (Azure RBAC), an authorization system for managing individual access to Azure resources. Using Azure RBAC, you assign different team members different levels of permissions for your LUIS authoring resources. See the [Azure RBAC documentation](../../role-based-access-control/index.yml) for more information.

## Enable Azure Active Directory authentication 

To use Azure RBAC, you must enable Azure Active Directory authentication. You can [create a new resource with a custom subdomain](../authentication.md#create-a-resource-with-a-custom-subdomain) or [create a custom subdomain for your existing resource](../cognitive-services-custom-subdomains.md#how-does-this-impact-existing-resources).

## Add role assignment to Language Understanding Authoring resource

Azure RBAC can be assigned to a Language Understanding Authoring resource. To grant access to an Azure resource, you add a role assignment.
1. In the [Azure portal](https://portal.azure.com/), select **All services**. 
2. Select **Azure AI services**, and navigate to your specific Language Understanding Authoring resource.
   > [!NOTE]
   > You can also set up Azure RBAC for whole resource groups, subscriptions, or management groups. Do this by selecting the desired scope level and then navigating to the desired item. For example, selecting **Resource groups** and then navigating to a specific resource group.

1. Select **Access control (IAM)** on the left navigation pane.
1. Select **Add**, then select **Add role assignment**.
1. On the **Role** tab on the next screen, select a role you want to add.
1. On the **Members** tab, select a user, group, service principal, or managed identity.
1. On the **Review + assign** tab, select **Review + assign** to assign the role.

Within a few minutes, the target will be assigned the selected role at the selected scope. For help with these steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).


## LUIS role types

Use the following table to determine access needs for your LUIS application.

These custom roles only apply to authoring (Language Understanding Authoring) and not prediction resources (Language Understanding).

> [!NOTE]
> * *Owner* and *Contributor* roles take priority over the custom LUIS roles.
> * Azure Active Directory (Azure AAD) is only used with custom LUIS roles.
> * If you are assigned as a *Contributor* on Azure, your role will be shown as *Owner* in LUIS portal.


### Cognitive Services LUIS reader

A user that should only be validating and reviewing LUIS applications, typically a tester to ensure the application is performing well before deploying the project. They may want to review the application’s assets (utterances, intents, entities) to notify the app developers of any changes that need to be made, but do not have direct access to make them.


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
        * Read Utterances
        * Intents 
        * Entities
        * Test Application
    :::column-end:::
    :::column span="":::
      All GET APIs under: 
        * [LUIS Programmatic v3.0-preview](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c2f)
        * [LUIS Programmatic v2.0 APIs](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c2f)

      All the APIs under: 
        * [LUIS Endpoint APIs v2.0](./luis-migration-api-v1-to-v2.md)
        * [LUIS Endpoint APIs v3.0](https://westcentralus.dev.cognitive.microsoft.com/docs/services/luis-endpoint-api-v3-0/operations/5cb0a9459a1fe8fa44c28dd8)
        * [LUIS Endpoint APIs v3.0-preview](https://westcentralus.dev.cognitive.microsoft.com/docs/services/luis-endpoint-api-v3-0-preview/operations/5cb0a9459a1fe8fa44c28dd8)

      All the Batch Testing Web APIs
    :::column-end:::
:::row-end:::

### Cognitive Services LUIS writer

A user that is responsible for building and modifying LUIS application, as a collaborator in a larger team. The collaborator can modify the LUIS application in any way, train those changes, and validate/test those changes in the portal. However, this user wouldn't have access to deploying this application to the runtime, as they may accidentally reflect their changes in a production environment. They also wouldn't be able to delete the application or alter its prediction resources and endpoint settings (assigning or unassigning prediction resources, making the endpoint public). This restricts this role from altering an application currently being used in a production environment. They may also create new applications under this resource, but with the restrictions mentioned.

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
      * All functionalities under Cognitive Services LUIS Reader. 

      The ability to add: 
        * Utterances
        * Intents
        * Entities
    :::column-end:::
    :::column span="":::
      * All APIs under LUIS reader

      All POST, PUT and DELETE APIs under:

        * [LUIS Programmatic v3.0-preview](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c2f)
        * [LUIS Programmatic v2.0 APIs](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c2d)

        Except for
        * [Delete application](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c39)
        * [Move app to another LUIS authoring Azure resource](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/apps-move-app-to-another-luis-authoring-azure-resource)
        * [Publish an application](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c3b)
        * [Update application settings](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/58aeface39e2bb03dcd5909e)
        * [Assign a LUIS azure accounts to an application](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5be32228e8473de116325515)
        * [Remove an assigned LUIS azure accounts from an application](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5be32554f8591db3a86232e1)
    :::column-end:::
:::row-end:::

### Cognitive Services LUIS owner

> [!NOTE]
> * If you are assigned as an *Owner* and *LUIS Owner* you will be be shown as *LUIS Owner* in LUIS portal.

These users are the gatekeepers for LUIS applications in a production environment. They should have full access to any of the underlying functions and thus can view everything in the application and have direct access to edit any changes for both authoring and runtime environments.

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
      * All functionalities under Cognitive Services LUIS Writer
      * Deploy a model
      * Delete an application
    :::column-end:::
    :::column span="":::
      * All APIs available for LUIS
    :::column-end:::
:::row-end:::

## Next steps

* [Managing Azure resources](./luis-how-to-azure-subscription.md?tabs=portal#authoring-resource)
