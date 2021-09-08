---
title: include file
description: include file
ms.topic: include
ms.custom: include file
ms.date: 03/11/2020
---

# LUIS role-based access control
LUIS supports Azure role-based access control (Azure RBAC), an authorization system for managing individual access to Azure resources. Using Azure RBAC, you assign different team members different levels of permissions for your LUIS authoring resources. For more information on Azure RBAC, see the [Azure RBAC documentation](https://docs.microsoft.com/da-dk/azure/role-based-access-control/).

## Add role assignment to Language Understanding Authoring resource

Azure RBAC can be assigned to a Language Understanding Authoring resource. To grant access to an Azure resource, you add a role assignment.
1. In the [Azure portal](https://ms.portal.azure.com/), select **All services**. 
2. Then select the **Cognitive Services**, and navigate to your specific Language Understanding Authoring resource.
   > [!NOTE]
   > You can also set up Azure RBAC for whole resource groups, subscriptions, or management groups. Do this by selecting the desired scope level and then navigating to the desired item (for example, selecting **Resource groups** and then clicking through to your wanted resource group).
3. Select **Access control (IAM)** on the left navigation pane.
4. Select **Add** -> **Add role assignment**.
5. On the **Role** tab on the next screen, select a role you want to add.
6. On the **Members** tab, select a user, group, service principal, or managed identity.
7. On the **Review + assign** tab, select **Review + assign** to assign the role.

Within a few minutes, the target will be assigned the selected role at the selected scope. For help with these steps, see [Assign Azure roles using the Azure portal](https://review.docs.microsoft.com/azure/role-based-access-control/role-assignments-portal).

## Security 
LUIS supports Azure Active Directory (AAD) authentication, for more information on AAD, see [Authenticate with Azure Active Directory](https://docs.microsoft.com/azure/cognitive-services/authentication?tabs=powershell#authenticate-with-azure-active-directory)

## LUIS role types

Use the following table to determine access needs for your LUIS application.<br>
These custom roles only apply to authoring (Language Understanding Authoring) and not prediction resources (Language Understanding)

|Role|Functionalities|API Access|Persona|
|--|--|----|--|
|Cognitive Services LUIS Reader|-Read Utterances, Intents, Entities<br>-Test Application|-All GET APIs under the [LUIS Programmatic v3.0-preview](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c2f)<br>-All Get APIs under the [LUIS Programmatic v2.0 APIs](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c2f)<br>-All the APIs under [LUIS Endpoint APIs v2.0](https://chinaeast2.dev.cognitive.azure.cn/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee78)<br>-[LUIS Endpoint APIs v3.0](https://westcentralus.dev.cognitive.microsoft.com/docs/services/luis-endpoint-api-v3-0/operations/5cb0a9459a1fe8fa44c28dd8)<br>-[LUIS Endpoint APIs v3.0-preview](https://westcentralus.dev.cognitive.microsoft.com/docs/services/luis-endpoint-api-v3-0-preview/operations/5cb0a9459a1fe8fa44c28dd8)<br>-All the Batch Testing Web APIs|A user that should only be validating and reviewing LUIS applications, typically a tester to ensure the application is performing well before deploying the project. They may want to review the application’s assets(Utterances,Intents,Entites) to notify the app developers of any changes that need to be made, but do not have direct access to make them.
|Cognitive Services LUIS Writer|-All functionalties under Cognitive Services LUIS Reader<br>-Add Utterances, Intents ,Entities|All APIs under LUIS Reader<br>All POST, PUT and DELETE APIs under the [LUIS Programmatic v3.0-preview](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c2f) and [LUIS Programmatic v2.0 APIs](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c2d) <br>**EXCEPT** for: <br>-[Delete application](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c39)<br>-[Move app to another LUIS authoring Azure resource](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/apps-move-app-to-another-luis-authoring-azure-resource)<br>-[Publish application](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c3b)<br>-[Update application settings](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/58aeface39e2bb03dcd5909e)<br>-[Assign a LUIS azure accounts to an application](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5be32228e8473de116325515)<br>-[Removes an assigned LUIS azure accounts from an application](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5be32554f8591db3a86232e1)|A user that is responsible for building and modifying LUIS application, as a collaborator in a larger team. The collaborator can modify the LUIS application in any way, train those changes, and validate/test those changes in the portal. However, this user Wouldn't have access to deploying this application to the runtime, as they may accidentally reflect their changes in a production environment. They also wouldn't be able to delete the application or alter its prediction resources and endpoint settings (assigning or unassigning prediction resources, making the endpoint public). This restricts this role from altering an application currently being used in a production environment. They may also create new applications under this resource, but with the restrictions mentioned.
|Cognitive Services LUIS Owner|-All functionalties under Cognitive Services LUIS Writer<br>-Deploy model<br>-Delete an application|-All APIs available for LUIS|These users are the gatekeepers for LUIS applications in a production environment environments. They should have full access to any of the underlying functions and thus can view everything in the application and have direct access to edit any changes for both authoring and runtime environments.
|

