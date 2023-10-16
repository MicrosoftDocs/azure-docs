---
title: Create eligible authorizations
description: When onboarding customers to Azure Lighthouse, you can let users in your managing tenant elevate their role on a just-in-time basis. 
ms.date: 11/28/2022
ms.topic: how-to
ms.custom: devx-track-arm-template
---

# Create eligible authorizations

When onboarding customers to Azure Lighthouse, you create authorizations to grant specified Azure built-in roles to users in your managing tenant. You can also create eligible authorizations that use [Microsoft Entra Privileged Identity Management (PIM)](../../active-directory/privileged-identity-management/pim-configure.md) to let users in your managing tenant temporarily elevate their role. This lets you grant additional permissions on a just-in-time basis so that users only have those permissions for a set duration.

Creating eligible authorizations lets you minimize the number of permanent assignments of users to privileged roles, helping to reduce security risks related to privileged access by users in your tenant.

This topic explains how eligible authorizations work and how to create them when [onboarding a customer to Azure Lighthouse](onboard-customer.md).

## License requirements

Creating eligible authorizations requires an Enterprise Mobility + Security E5 (EMS E5) or Microsoft Entra ID P2 license. To find the right license for your requirements, see [Comparing generally available features of the Free, Basic, and Premium editions](https://azure.microsoft.com/pricing/details/active-directory/).

The EMS E5 or Microsoft Entra ID P2 license must be held by the managing tenant, not the customer tenant.

Any extra costs associated with an eligible role will apply only during the period of time in which the user elevates their access to that role.

For information about licenses for users, see [License requirements to use Privileged Identity Management](../../active-directory/privileged-identity-management/subscription-requirements.md).

## How eligible authorizations work

An eligible authorization defines a role assignment that requires the user to activate the role when they need to perform privileged tasks. When they activate the eligible role, they'll have the full access granted by that role for the specified period of time.

Users in the customer tenant can review all role assignments, including those in eligible authorizations, before the onboarding process.

Once a user successfully activates an eligible role, they will have that elevated role on the delegated scope for a pre-configured time period, in addition to their permanent role assignment(s) for that scope.

Administrators in the managing tenant can review all Privileged Identity Management activities by viewing the audit log in the managing tenant. Customers can view these actions in the Azure activity log for the delegated subscription.

## Eligible authorization elements

You can create an eligible authorization when onboarding customers with Azure Resource Manager templates or by publishing a Managed Services offer to Azure Marketplace. Each eligible authorization must include three elements: the user, the role, and the access policy.

### User

For each eligible authorization, you provide the Principal ID for either an individual user or a Microsoft Entra group in the managing tenant. Along with the Principal ID, you must provide a display name of your choice for each authorization.

If a group is provided in an eligible authorization, any member of that group will be able to elevate their own individual access to that role, per the access policy.

You can't use eligible authorizations with service principals, since there's currently no way for a service principal account to elevate its access and use an eligible role. You also can’t use eligible authorizations with `delegatedRoleDefinitionIds` that a User Access Administrator can [assign to managed identities](deploy-policy-remediation.md).

> [!NOTE]
> For each eligible authorization, be sure to also create a permanent (active) authorization for the same Principal ID with a different role, such as Reader (or another Azure built-in role that includes Reader access). If you don't include a permanent authorization with Reader access, the user won't be able to elevate their role in the Azure portal.

### Role

Each eligible authorization needs to include an [Azure built-in role](../../role-based-access-control/built-in-roles.md) that the user will be eligible to use on a just-in-time basis.

The role can be any Azure built-in role that is [supported for Azure delegated resource management](../concepts/tenants-users-roles.md#role-support-for-azure-lighthouse), except for User Access Administrator.

> [!IMPORTANT]
> If you include multiple eligible authorizations that use the same role, each of the eligible authorizations must have the same access policy settings.

### Access policy

The access policy defines the multifactor authentication requirements, the length of time a user will be activated in the role before it expires, and whether approvers are required.

<a name='multi-factor-authentication'></a>

#### Multifactor authentication

Specify whether or not to require [Microsoft Entra multifactor authentication](../../active-directory/authentication/concept-mfa-howitworks.md) in order for an eligible role to be activated.

#### Maximum duration

Define the total length of time for which the user will have the eligible role. The minimum value is 30 minutes and the maximum is 8 hours.

#### Approvers

The approvers element is optional. If you include it, you can specify up to 10 users or user groups in the managing tenant who can approve or deny requests from a user to activate the eligible role.

You can't use a service principal account as an approver. Also, approvers can't approve their own access; if an approver is also included as the user in an eligible authorization, a different approver will have to grant access in order for them to elevate their role.

If you don’t include any approvers, the user will be able to activate the eligible role whenever they choose.

## Create eligible authorizations using Managed Services offers

To onboard your customer to Azure Lighthouse, you can publish Managed Services offers to Azure Marketplace. When [creating your offers in Partner Center](publish-managed-services-offers.md), you can now specify whether the **Access type** for each [Authorization](../../marketplace/create-managed-service-offer-plans.md#authorizations) should be **Active** or **Eligible**.

When you select **Eligible**, the user in your authorization will be able to activate the role according to the access policy you configure. You must set a maximum duration between 30 minutes and 8 hours, and specify whether you'll require multifactor authentication. You can also add up to 10 approvers if you choose to use them, providing a display name and a principal ID for each one.

Be sure to review the details in the [Eligible authorization elements](#eligible-authorization-elements) section when configuring your eligible authorizations in Partner Center.

## Create eligible authorizations using Azure Resource Manager templates

To onboard your customer to Azure Lighthouse, you use an [Azure Resource Manager template along with a corresponding parameters file](onboard-customer.md#create-an-azure-resource-manager-template) that you modify. The template you choose will depend on whether you're onboarding an entire subscription, a resource group, or multiple resource groups within a subscription.

To include eligible authorizations when you onboard a customer, use one of the templates from the [delegated-resource-management-eligible-authorizations section of our samples repo](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/delegated-resource-management-eligible-authorizations). We provide templates with and without approvers included, so that you can use the one that works best for your scenario.

|To onboard this (with eligible authorizations)  |Use this Azure Resource Manager template  |And modify this parameter file |
|---------|---------|---------|
|Subscription   |[subscription.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management-eligible-authorizations/subscription/subscription.json)  |[subscription.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management-eligible-authorizations/subscription/subscription.parameters.json)    |
|Subscription (with approvers)  |[subscription-managing-tenant-approvers.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management-eligible-authorizations/subscription/subscription-managing-tenant-approvers.json)  |[subscription-managing-tenant-approvers.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management-eligible-authorizations/subscription/subscription-managing-tenant-approvers.parameters.json)    |
|Resource group   |[rg.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management-eligible-authorizations/rg/rg.json)  |[rg.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management-eligible-authorizations/rg/rg.parameters.json)    |
|Resource group (with approvers)  |[rg-managing-tenant-approvers.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management-eligible-authorizations/rg/rg-managing-tenant-approvers.json)  |[rg-managing-tenant-approvers.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management-eligible-authorizations/rg/rg-managing-tenant-approvers.parameters.json)    |
|Multiple resource groups within a subscription   |[multiple-rg.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management-eligible-authorizations/rg/multiple-rg.json)  |[multiple-rg.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management-eligible-authorizations/rg/multiple-rg.parameters.json)    |
|Multiple resource groups within a subscription (with approvers)  |[multiple-rg-managing-tenant-approvers.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management-eligible-authorizations/rg/multiple-rg-managing-tenant-approvers.json)  |[multiple-rg-managing-tenant-approvers.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management-eligible-authorizations/rg/multiple-rg-managing-tenant-approvers.parameters.json)    |

The **subscription-managing-tenant-approvers.json** template, which can be used to onboard a subscription with eligible authorizations (including approvers), is shown below.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-08-01/subscriptionDeploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "mspOfferName": {
            "type": "string",
            "metadata": {
                "description": "Specify a unique name for your offer"
            }
        },
        "mspOfferDescription": {
            "type": "string",
            "metadata": {
                "description": "Name of the Managed Service Provider offering"
            }
        },
        "managedByTenantId": {
            "type": "string",
            "metadata": {
                "description": "Specify the tenant id of the Managed Service Provider"
            }
        },
        "authorizations": {
            "type": "array",
            "metadata": {
                "description": "Specify an array of objects, containing tuples of Azure Active Directory principalId, a Azure roleDefinitionId, and an optional principalIdDisplayName. The roleDefinition specified is granted to the principalId in the provider's Active Directory and the principalIdDisplayName is visible to customers."
            }
        },
        "eligibleAuthorizations": {
            "type": "array",
            "metadata": {
                "description": "Provide the authorizations that will have just-in-time role assignments on customer environments with support for approvals from the managing tenant"
            }
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

The [subscription-managing-tenant-approvers.Parameters.json sample template](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management-eligible-authorizations/subscription/subscription-managing-tenant-approvers.parameters.json) can be used to define authorizations, including eligible authorizations, when onboarding a subscription.

Each of your eligible authorizations must be defined in the `eligibleAuthorizations` parameter. This example includes one eligible authorization.

This template also includes the `managedbyTenantApprovers` element, which adds a `principalId` who will be required to approve all attempts to activate the eligible roles that are defined in the `eligibleAuthorizations` element.

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
                            "maximumActivationDuration": "PT8H",
                            "managedByTenantApprovers": [ 
                                { 
                                    "principalId": "00000000-0000-0000-0000-000000000000", 
                                    "principalIdDisplayName": "PIM-Approvers" 
                                } 
                            ]
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

Each entry within the `eligibleAuthorizations` parameter contains [three elements](#eligible-authorization-elements) that define an eligible authorization: `principalId`, `roleDefinitionId`, and `justInTimeAccessPolicy`.

`principalId` specifies the ID for the Microsoft Entra user or group to which this eligible authorization will apply.

`roleDefinitionId` contains the role definition ID for an [Azure built-in role](../../role-based-access-control/built-in-roles.md) that the user will be eligible to use on a just-in-time basis. If you include multiple eligible authorizations that use the same `roleDefinitionId`, they all must have identical settings for `justInTimeAccessPolicy`.

`justInTimeAccessPolicy` specifies three elements:

- `multiFactorAuthProvider` can either be set to **Azure**, which will require authentication using Microsoft Entra multifactor authentication, or to **None** if no multifactor authentication will be required.
- `maximumActivationDuration` sets the total length of time for which the user will have the eligible role. This value must use the ISO 8601 duration format. The minimum value is PT30M (30 minutes) and the maximum value is PT8H (8 hours). For simplicity, we recommend using values in half-hour increments only (for example, PT6H for 6 hours or PT6H30M for 6.5 hours).
- `managedByTenantApprovers` is optional. If you include it, it must contain one or more combinations of a principalId and a principalIdDisplayName who will be required to approve any activation of the eligible role.

For more information about these elements, see the [Eligible authorization elements](#eligible-authorization-elements) section above.

## Elevation process for users

After you onboard a customer to Azure Lighthouse, any eligible roles you included will be available to the specified user (or to users in any specified groups).

Each user can elevate their access at any time by visiting the **My customers** page in the Azure portal, selecting a delegation, and then selecting **Manage eligible roles**. After that, they can follow the [steps to activate the role](../../active-directory/privileged-identity-management/pim-resource-roles-activate-your-roles.md) in Microsoft Entra Privileged Identity Management.

:::image type="content" source="../media/manage-eligible-roles.png" alt-text="Screenshot showing the Manage eligible roles button in the Azure portal.":::

If approvers have been specified, the user won't have access to the role until approval is granted by a designated [approver from the managing tenant](#approvers). All of the approvers will be notified when approval is requested, and the user won't be able to use the eligible role until approval is granted. Approvers will also be notified when that happens. For more information about the approval process, see [Approve or deny requests for Azure resource roles in Privileged Identity Management](../../active-directory/privileged-identity-management/pim-resource-roles-approval-workflow.md).

Once the eligible role has been activated, the user will have that role for the full duration specified in the eligible authorization. After that time period, they will no longer be able to use that role, unless they repeat the elevation process and elevate their access again.

## Next steps

- Learn how to [onboard customers to Azure Lighthouse using ARM templates](onboard-customer.md).
- Learn how to [onboard customers using Managed Services offers](publish-managed-services-offers.md).
- Learn more about [Microsoft Entra Privileged Identity Management](../../active-directory/privileged-identity-management/pim-configure.md).
- Learn more about [tenants, users, and roles in Azure Lighthouse](../concepts/tenants-users-roles.md).
