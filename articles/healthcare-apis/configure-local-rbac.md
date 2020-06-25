---
title: Configure local Role Based Access Control (RBAC) for Azure API for FHIR
description: This article describes how to configure the Azure API for FHIR to use an external Azure AD tenant for data plane
author: hansenms
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference 
ms.date: 03/15/2020
ms.author: mihansen
---
# Configure local RBAC for FHIR 

This article explains how to configure the Azure API for FHIR to use an external, secondary Azure Active Directory tenant for managing data plane access. Use this mode only if it is not possible for you to use the Azure Active Directory tenant associated with your subscription.

> [!NOTE]
> If your FHIR service data plane is configured to use your primary Azure Active Directory tenant associated with your subscription, [use Azure RBAC to assign data plane roles](configure-azure-rbac.md).

## Add service principal

Local RBAC allows you to use an external Azure Active Directory tenant with your FHIR server. In order to allow the RBAC system to check group memberships in this tenant, the Azure API for FHIR must have a service principal in the tenant. This service principal will get created automatically in tenants tied to subscriptions that have deployed the Azure API for FHIR, but in case your tenant has no subscription tied to it, a tenant administrator will need to create this service principal with one of the following commands:

Using the `Az` PowerShell module:

```azurepowershell-interactive
New-AzADServicePrincipal -ApplicationId 3274406e-4e0a-4852-ba4f-d7226630abb7
```

or you can use the `AzureAd` PowerShell module:

```azurepowershell-interactive
New-AzureADServicePrincipal -AppId 3274406e-4e0a-4852-ba4f-d7226630abb7
```

or you can use Azure CLI:

```azurecli-interactive
az ad sp create --id 3274406e-4e0a-4852-ba4f-d7226630abb7
```

## Configure local RBAC

You can configure the Azure API for FHIR to use an external or secondary Azure Active Directory tenant in the **Authentication** blade:

![Local RBAC Assignments](media/rbac/local-rbac-guids.png).

In the authority box, enter a valid Azure Active Directory tenant. Once the tenant has been validated, the **Allowed object IDs** box should be activated and you can enter a list of identity object IDs. These IDs can be the identity object IDs of:

* An Azure Active Directory user.
* An Azure Active Directory service principal.
* An Azure Active directory security group.

You can read the article on how to [find identity object IDs](find-identity-object-ids.md) for more details.

After entering the required object IDs, click **Save** and wait for changes to be saved before trying to access the data plane using the assigned users, service principals, or groups.

## Caching behavior

The Azure API for FHIR will cache decisions for up to 5 minutes. If you grant a user access to the FHIR server by adding them to the list of allowed object IDs, or you remove them from the list, you should expect it to take up to five minutes for changes in permissions to propagate.

## Next steps

In this article, you learned how to assign FHIR data plane access using an external (secondary) Azure Active Directory tenant. Next learn about additional settings for the Azure API for FHIR:
 
>[!div class="nextstepaction"]
>[Additional settings Azure API for FHIR](azure-api-for-fhir-additional-settings.md)

