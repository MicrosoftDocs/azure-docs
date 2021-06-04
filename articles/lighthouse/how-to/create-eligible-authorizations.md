---
title: Create eligible authorizations
description: When onboarding customers to Azure Lighthouse, you can let users in your managing tenant elevate their role on a just-in-time basis. 
ms.date: 05/26/2021
ms.topic: how-to
---

# Create eligible authorizations

When onboarding customers to Azure Lighthouse, you create authorizations to grant specified Azure built-in roles to users in your managing tenant. You can also create eligible authorizations that use [Azure Active Directory (Azure AD) Privileged Identity Management (PIM)](/azure/active-directory/privileged-identity-management/pim-configure) to let users in your managing tenant temporarily elevate their role. This lets you grant additional permissions on a just-in-time basis so that users only have those permissions for a set duration.

Creating eligible authorizations lets you minimize the number of permanent assignments of users to privileged roles, helping to reduce security risks related to privileged access by users in your tenant.

This topic explains how eligible authorizations work and how to create them when [onboarding a customer to Azure Lighthouse](onboard-customer.md).

> [!IMPORTANT]
> Eligible authorizations are currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## License requirements

Creating eligible authorizations requires an Enterprise Mobility + Security E5 (EMS E5) or Azure AD Premium P2 license. To find the right license for your requirements, see [Comparing generally available features of the Free, Basic, and Premium editions](https://azure.microsoft.com/pricing/details/active-directory/).

The EMS E5 or Azure AD Premium P2 license must be held by the managing tenant, not the customer tenant.

Any extra costs associated with an eligible role will apply only during the period of time in which the user elevates their access to that role.

For information about licenses for users, see [License requirements to use Privileged Identity Management](/azure/active-directory/privileged-identity-management/subscription-requirements).

## How eligible authorizations work

An eligible authorization defines a role assignment that requires the user to activate the role when they need to perform privileged tasks. When they activate the eligible role, they'll have the full access granted by that role for the specified period of time.

Users in the customer tenant can review all role assignments, including those in eligible authorizations, before the onboarding process.

Once a user successfully activates an eligible role, they will have that elevated role on the delegated scope for a pre-configured time period, in addition to their permanent role assignment(s) for that scope.

Administrators in the managing tenant can review all Privileged Identity Management activities by viewing the audit log in the managing tenant. Customers can view these actions in the Azure activity log for the delegated subscription.

When creating an eligible authorization, you define three elements: the user, the role, and the access policy.

- The **user** can be either an individual user or an Azure AD group in the managing tenant. If a group is defined, any member of that group will be able to elevate their own individual access to the role per the access policy. You can't use eligible authorizations with service principals.
- The **role** can be any Azure built-in role that is supported for Azure delegated resource management except for User Access Administrator.
- The **access policy** defines the multi-factor authorization (MFA) requirements and the length of time a user will be activated in the role before it expires. The maximum amount you can specify for any role is 8 hours.

More about these elements, and how to define them, is explained below.

## Create eligible authorizations using Azure Resource Manager templates

To onboard your customer to Azure Lighthouse, you use an [Azure Resource Manager template along with a corresponding parameters file](onboard-customer.md#create-an-azure-resource-manager-template) that you modify. The template you choose will depend on whether you're onboarding an entire subscription, a resource group, or multiple resource groups within a subscription.

> [!NOTE]
> While you can also onboard customers using Managed Service offers in Azure Marketplace, you can't currently include eligible authorizations in those offers.

To include eligible authorizations when you onboard a customer, use one of the templates from the [delegated-resource-management-eligible-authorizations section of our samples repo](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/delegated-resource-management-eligible-authorizations).

|To onboard this (with eligible authorizations)  |Use this Azure Resource Manager template  |And modify this parameter file |
|---------|---------|---------|
|Subscription   |[subscription.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management-eligible-authorizations/subscription/subscription.json)  |[subscription.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management-eligible-authorizations/subscription/subscription.Parameters.json)    |
|Resource group   |[rg.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management-eligible-authorizations/rg/rg.json)  |[rg.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management-eligible-authorizations/rg/rg.parameters.json)    |
|Multiple resource groups within a subscription   |[multiple-rg.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management-eligible-authorizations/rg/multiple-rg.json)  |[multiple-rg.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management-eligible-authorizations/rg/multiple-rg.parameters.json)    |

The **subscription.json** template, which can be used to onboard a subscription with eligible authorizations, is shown below. 

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-08-01/subscriptionDeploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "mspOfferName": {
            "type": "string",
            "metadata": {
                "description": "Specify a unique name for your offer"
            },
            "defaultValue": "<to be filled out by MSP> Specify a title for your offer"
        },
        "mspOfferDescription": {
            "type": "string",
            "metadata": {
                "description": "Name of the Managed Service Provider offering"
            },
            "defaultValue": "<to be filled out by MSP> Provide a brief description of your offer"
        },
        "managedByTenantId": {
            "type": "string",
            "metadata": {
                "description": "Specify the tenant id of the Managed Service Provider"
            },
            "defaultValue": "<to be filled out by MSP> Provide your tenant id"
        },
        "authorizations": {
            "type": "array",
            "metadata": {
                "description": "Specify an array of objects, containing tuples of Azure Active Directory principalId, a Azure roleDefinitionId, and an optional principalIdDisplayName. The roleDefinition specified is granted to the principalId in the provider's Active Directory and the principalIdDisplayName is visible to customers."
            },
            "defaultValue": [
                { 
                    "principalId": "00000000-0000-0000-0000-000000000000", 
                    "roleDefinitionId": "acdd72a7-3385-48ef-bd42-f606fba81ae7",
                    "principalIdDisplayName": "PIM_Group" 
                }, 
                { 
                    "principalId": "00000000-0000-0000-0000-000000000000", 
                    "roleDefinitionId": "91c1777a-f3dc-4fae-b103-61d183457e46",
                    "principalIdDisplayName": "PIM_Group" 
                }   
            ]
        }, 
        "eligibleAuthorizations": { 
            "type": "array", 
            "metadata": { 
                "description": "Provide the authorizations that will have just-in-time role assignments on customer environments" 
            },
           "defaultValue": [ 
                { 
                        "justInTimeAccessPolicy": { 
                            "multiFactorAuthProvider": "Azure", 
                            "maximumActivationDuration": "PT8H" 
                        },
                        "principalId": "00000000-0000-0000-0000-000000000000", 
                        "principalIdDisplayName": "PIM_Group",
                        "roleDefinitionId": "36243c78-bf99-498c-9df9-86d9f8d28608" 
                        
                }                    
            ]    

        }                 
    },
    "variables": {
        "mspRegistrationName": "[guid(parameters('mspOfferName'))]",
        "mspAssignmentName": "[guid(parameters('mspOfferName'))]"
    },
    "resources": [
        {
            "type": "Microsoft.ManagedServices/registrationDefinitions",
            "apiVersion": "2020-02-01-preview",
            "name": "[variables('mspRegistrationName')]",
            "properties": {
                "registrationDefinitionName": "[parameters('mspOfferName')]",
                "description": "[parameters('mspOfferDescription')]",
                "managedByTenantId": "[parameters('managedByTenantId')]",
                "authorizations": "[parameters('authorizations')]", 
                "eligibleAuthorizations": "[parameters('eligibleAuthorizations')]" 
            }
        },
        {
            "type": "Microsoft.ManagedServices/registrationAssignments",
            "apiVersion": "2020-02-01-preview",
            "name": "[variables('mspAssignmentName')]",
            "dependsOn": [
                "[resourceId('Microsoft.ManagedServices/registrationDefinitions/', variables('mspRegistrationName'))]"
            ],
            "properties": {
                "registrationDefinitionId": "[resourceId('Microsoft.ManagedServices/registrationDefinitions/', variables('mspRegistrationName'))]"
            }
        }
    ],
    
    "outputs": {
        "mspOfferName": {
            "type": "string",
            "value": "[concat('Managed by', ' ', parameters('mspOfferName'))]"
        },
        "authorizations": {
            "type": "array",
            "value": "[parameters('authorizations')]"
        }, 
        "eligibleAuthorizations": { 
            "type": "array", 
            "value": "[parameters('eligibleAuthorizations')]" 

        } 
    }
}
```

### Define eligible authorizations in your parameters file

The [subscription.Parameters.json sample template](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management-eligible-authorizations/subscription/subscription.Parameters.json) can be used to define authorizations, including eligible authorizations, when onboarding a subscription.

Each of your eligible authorizations must be defined in the `eligibleAuthorizations` parameter. This example includes one eligible authorization.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "mspOfferName": {
            "value": "Relecloud Managed Services"
        },
        "mspOfferDescription": {
            "value": "Relecloud Managed Services"
        },
        "managedByTenantId": {
            "value": "<insert the managing tenant id>"
        },
        "authorizations": {
            "value": [
                { 
                    "principalId": "00000000-0000-0000-0000-000000000000",
                    "roleDefinitionId": "acdd72a7-3385-48ef-bd42-f606fba81ae7",
                    "principalIdDisplayName": "PIM group"
                }
            ]
        }, 
        "eligibleAuthorizations":{
            "value": [
                {
                        "justInTimeAccessPolicy": {
                            "multiFactorAuthProvider": "Azure",
                            "maximumActivationDuration": "PT8H"
                        },
                        "principalId": "00000000-0000-0000-0000-000000000000", 
                        "principalIdDisplayName": "Tier 2 Support",
                        "roleDefinitionId": "b24988ac-6180-42a0-ab88-20f7382dd24c"

                }
            ]
        }
    }
}
```

Within the `eligibleAuthorizations` parameter, the `principalId` specifies the ID for the Azure AD user or group to which this eligible authorization will apply. Don't use an ID of a service principal account, since there's currently no way for a service principal account to elevate its access and use an eligible role.

> [!IMPORTANT]
> Be sure to include the same `principalId` in the `authorizations` section of your template with a different role from the eligible authorization, such as Reader (or another Azure built-in role that includes Reader access). If you don't, the user won't be able to elevate their role in the Azure portal.

The `roleDefinitionId` contains the role definition ID for an [Azure built-in role](/azure/role-based-access-control/built-in-roles) that the user will be eligible to use on a just-in-time basis.

The `justInTimeAccessPolicy` specifies two elements:

- `multiFactorAuthProvider` can either be set to **Azure**, which will require authentication using Azure multi-factor authorization (MFA), or to **None** if no multi-factor authentication will be required.
- `maximumActivationDuration` sets the total length of time for which the user will have the eligible role. This value must use the ISO 8601 duration format. The minimum value is PT30M (30 minutes) and the maximum value is PT8H (8 hours).

> [!NOTE]
> Note: Just-in-time access does not apply to `delegatedRoleDefinitionIds` that a User Access Administrator can [assign to managed identities](deploy-policy-remediation.md). These role assignments can't be created as eligible authorizations. Similarly, you can’t create an eligible authorization for the User Access Administrator role itself.

## Elevation process for users

After you onboard a customer to Azure Lighthouse, any eligible roles you included will be available to the specified user (or to users in any specified groups).

Each user can elevate their access at any time by visiting the **My customers** page in the Azure portal, selecting a delegation, and then selecting the **Manage eligible roles** button. After that, they can follow the [steps to activate the role](/azure/active-directory/privileged-identity-management/pim-how-to-activate-role) in Azure AD Privileged Identity Management.

Once the eligible role has been activated, the user will have that role for the full duration specified in the eligible authorization. After that time period, they will no longer be able to use that role, unless they repeat the elevation process and elevate their access again.

## Next steps

- Learn how to [onboard customers to Azure Lighthouse using ARM templates](onboard-customer.md).
- Learn more about [Azure AD Privileged Identity Management](/azure/active-directory/privileged-identity-management/pim-configure).
- Learn more about [tenants, users, and roles in Azure Lighthouse](../concepts/tenants-users-roles.md).
