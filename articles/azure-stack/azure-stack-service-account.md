---
title: How to create a service account for Azure Stack registration
description: How to create a service account role to avoid using global administrator for administration.
services: azure-stack
documentationcenter: ''
author: PatAltimore
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/7/2019
ms.author: patricka
ms.reviewer: rtiberiu

---
# Create a service account for Azure Stack registration

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

For scenarios where you want to avoid accidental changes to the Azure Subscription and you don’t want to give full Owner in that Azure Subscription, you can create a Custom Role (more information here https://docs.microsoft.com/en-us/azure/role-based-access-control/custom-roles-powershell ) to register your Azure Stack. Please note that when a user is delegated rights to this Custom Role, that user has rights to edit permissions, including for itself – this means the user could potentially elevate rights and give itself Owner rights. This would be an extra action, so it there would need to be intent to do it.
This is not a security posture feature, instead it helps in scenarios where you want to put in place constrains for a good-faith actor to prevent them from accidentally deleting something they shouldn’t.
The custom role needs to have these rights for the respective Azure subscription you plan to use to register the AzStack:

## Create a customer role using PowerShell

A JSON template can be used as the source definition for the custom role. The following example creates a custom role that allows read and write access. 

Connect to login.

```azurepowershell
Connect-AzureRmAccount
```

Grab the subscription id from output.

Create a new file `C:\CustomRoles\registrationrole.json` with the following template. Replace the subscription id.

```json
{
  "Name": "Azure Stack registration service role",
  "Id": null,
  "IsCustom": true,
  "Description": "Allows access to register Azure Stack",
  "Actions": [
    "Microsoft.Resources/subscriptions/resourceGroups/write",
    "Microsoft.Resources/subscriptions/resourceGroups/read",
    "Microsoft.AzureStack/registrations/*",
    "Microsoft.AzureStack/register/action",
    "Microsoft.Authorization/roleAssignments/read",
    "Microsoft.Authorization/roleAssignments/write",
    "Microsoft.Authorization/roleAssignments/delete",
    "Microsoft.Authorization/permissions/read"
  ],
  "NotActions": [
  ],
  "AssignableScopes": [
    "/subscriptions/<SubscriptionID>"
  ]
}
```

To add the role to the subscriptions, run the following PowerShell command:

``` azurepowershell
New-AzureRmRoleDefinition -InputFile "C:\CustomRoles\registrationrole.json"
```

## Add role to registration service account

Create an account (link)

Add the custom role

## Next steps

[Add an Azure Stack tenant](azure-stack-add-new-user-aad.md)

