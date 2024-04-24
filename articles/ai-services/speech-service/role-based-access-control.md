---
title: Role-based access control for Speech resources - Speech service
titleSuffix: Azure AI services
description: Learn how to assign access roles for a Speech resource.
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: conceptual
ms.date: 1/21/2024
ms.author: eur
---

# Role-based access control for Speech resources

You can manage access and permissions to your Speech resources with Azure role-based access control (Azure RBAC). Assigned roles can vary across Speech resources. For example, you can assign a role to a Speech resource that should only be used to train a custom speech model. You can assign another role to a Speech resource that is used to transcribe audio files. Depending on who can access each Speech resource, you can effectively set a different level of access per application or user. For more information on Azure RBAC, see the [Azure RBAC documentation](../../role-based-access-control/overview.md).

> [!NOTE]
> A Speech resource can inherit or be assigned multiple roles. The final level of access to the resource is a combination of all role permissions.

## Roles for Speech resources

A role definition is a collection of permissions. When you create a Speech resource, the built-in roles in the following table are available for assignment. 

> [!WARNING]
> Speech service architecture differs from other Azure AI services in the way it uses [Azure control plane and data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). Speech service is extensively using data plane comparing to other Azure AI services, and this requires different set up for the roles. Because of this some general Cognitive Services roles have actual access right set that doesn't exactly match their name when used in Speech services scenario. For instance *Cognitive Services User* provides in effect the Contributor rights, while *Cognitive Services Contributor* provides no access at all. The same is true for generic *Owner* and *Contributor* roles which have no data plane rights and consequently provide no access to Speech resource. To keep consistency we recommend to use roles containing *Speech* in their names. These roles are *Cognitive Services Speech User* and *Cognitive Services Speech Contributor*. Their access right sets were designed specifically for the Speech service. In case you would like to use general Cognitive Services roles and Azure generic roles, we ask you to very carefully study the following access right table.

| Role | Can list resource keys | Access to data, models, and endpoints in custom projects| Access to speech transcription and synthesis APIs
| ---| ---| ---| ---|
|**Owner** |Yes |None |No |
|**Contributor** |Yes |None |No |
|**Cognitive Services Contributor** |Yes |None |No |
|**Cognitive Services User** |Yes |View, create, edit, and delete |Yes |
|**Cognitive Services Speech Contributor** |No | View, create, edit, and delete |Yes |
|**Cognitive Services Speech User** |No |View only |Yes |
|**Cognitive Services Data Reader (Preview)** |No |View only |Yes |

> [!IMPORTANT]
> Whether a role can list resource keys is important for [Speech Studio authentication](#speech-studio-authentication). To list resource keys, a role must have permission to run the `Microsoft.CognitiveServices/accounts/listKeys/action` operation. Please note that if key authentication is disabled in the Azure Portal, then none of the roles can list keys.

Keep the built-in roles if your Speech resource can have full read and write access to the projects. 

For finer-grained resource access control, you can [add or remove roles](../../role-based-access-control/role-assignments-portal.yml?tabs=current) using the Azure portal. For example, you could create a custom role with permission to upload custom speech datasets, but without permission to deploy a custom speech model to an endpoint. 

## Authentication with keys and tokens

The [roles](#roles-for-speech-resources) define what permissions you have. Authentication is required to use the Speech resource. 

To authenticate with Speech resource keys, all you need is the key and region. To authenticate with a Microsoft Entra token, the Speech resource must have a [custom subdomain](speech-services-private-link.md#create-a-custom-domain-name) and use a [private endpoint](speech-services-private-link.md#turn-on-private-endpoints). The Speech service uses custom subdomains with private endpoints only.

### Speech SDK authentication

For the SDK, you configure whether to authenticate with a Speech resource key or Microsoft Entra token. For details, see [Microsoft Entra authentication with the Speech SDK](how-to-configure-azure-ad-auth.md).

### Speech Studio authentication

Once you're signed into [Speech Studio](speech-studio-overview.md), you select a subscription and Speech resource. You don't choose whether to authenticate with a Speech resource key or Microsoft Entra token. Speech Studio gets the key or token automatically from the Speech resource. If one of the assigned [roles](#roles-for-speech-resources) has permission to list resource keys, Speech Studio authenticates with the key. Otherwise, Speech Studio authenticates with the Microsoft Entra token. 

If Speech Studio uses your Microsoft Entra token, but the Speech resource doesn't have a custom subdomain and private endpoint, then you can't use some features in Speech Studio. In this case, for example, the Speech resource can be used to train a custom speech model, but you can't use a custom speech model to transcribe audio files.

| Authentication credential | Feature availability | 
| ---| ---|  
|Speech resource key|Full access. Role configuration is ignored if resource key is used.|
|Microsoft Entra token with custom subdomain and private endpoint|Full access limited only by the assigned role permissions.|
|Microsoft Entra token without custom subdomain and private endpoint (not recommended)|Features are limited. For example, the Speech resource can be used to train a custom speech model or custom neural voice. But you can't use a custom speech model or custom neural voice.|

## Next steps

* [Microsoft Entra authentication with the Speech SDK](how-to-configure-azure-ad-auth.md).
* [Speech service encryption of data at rest](speech-encryption-of-data-at-rest.md).
