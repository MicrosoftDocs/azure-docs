---
title: Onboard all subscriptions in a management group
description: You can deploy an Azure Policy to delegate all subscriptions within a management group to an Azure Lighthouse managing tenant.
ms.date: 05/23/2023
ms.topic: how-to
---

# Onboard all subscriptions in a management group

[Azure Lighthouse](../overview.md) allows delegation of subscriptions and/or resource groups, but not [management groups](../../governance/management-groups/overview.md). However, you can use an [Azure Policy](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/policy-delegate-management-groups) to delegate all subscriptions within a management group to a managing tenant.

The policy uses the [deployIfNotExists](../../governance/policy/concepts/effects.md#deployifnotexists) effect to check whether each subscription within the management group has been delegated to the specified managing tenant. If a subscription is not already delegated, the policy creates the Azure Lighthouse assignment based on the values you provide in the parameters. You will then have access to all of the subscriptions in the management group, just as if they had each been onboarded manually.

When using this policy, keep in mind:

- Each subscription within the management group will have the same set of authorizations. To vary the users and roles who are granted access, you'll have to onboard subscriptions manually.
- While every subscription in the management group will be onboarded, you can't take actions on the management group resource through Azure Lighthouse. You'll need to select subscriptions to work on, just as you would if they were onboarded individually.

Unless specified below, all of these steps must be performed by a user in the customer's tenant with the appropriate permissions.

> [!TIP]
> Though we refer to service providers and customers in this topic, [enterprises managing multiple tenants](../concepts/enterprise.md) can use the same processes.

## Register the resource provider across subscriptions

Typically, the **Microsoft.ManagedServices** resource provider is registered for a subscription as part of the onboarding process. When using the policy to onboard subscriptions in a management group, the resource provider must be registered in advance. This can be done by a Contributor or Owner user in the customer's tenant (or any user who has permissions to do the `/register/action` operation for the resource provider). For more information, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

You can use an [Azure Logic App to automatically register the resource provider across subscriptions](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/register-managed-services-rp-customer). This Logic App can be deployed in a customer's tenant with limited permissions that allow it to register the resource provider in each subscription within a management group.

We also provide an [Azure Logic App that can be deployed in the service provider's tenant](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/register-managed-services-rp-partner). This Logic App can assign the resource provider across subscriptions in multiple tenants by [granting tenant-wide admin consent](../../active-directory/manage-apps/grant-admin-consent.md) to the Logic App. Granting tenant-wide admin consent requires you to sign in as a user that is authorized to consent on behalf of the organization. Note that even if you use this option to register the provider across multiple tenants, you'll still need to deploy the policy individually for each management group.

## Create your parameters file

To assign the policy, deploy the [deployLighthouseIfNotExistManagementGroup.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/policy-delegate-management-groups/deployLighthouseIfNotExistManagementGroup.json) file from our samples repo, along with a [deployLighthouseIfNotExistsManagementGroup.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/policy-delegate-management-groups/deployLighthouseIfNotExistsManagementGroup.parameters.json) parameters file that you edit with your specific tenant and assignment details. These two files contain the same details that would be used to [onboard an individual subscription](onboard-customer.md).

The example below shows a parameters file which will delegate the subscriptions to the Relecloud Managed Services tenant, with access granted to two principalIDs: one for Tier 1 Support, and one automation account which can [assign the delegateRoleDefinitionIds to managed identities in the customer tenant](deploy-policy-remediation.md#create-a-user-who-can-assign-roles-to-a-managed-identity-in-the-customer-tenant).

```json
{ 
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#", 
    "contentVersion": "1.0.0.0", 
    "parameters": { 
        "managedByName": { 
            "value": "Relecloud Managed Services" 
        }, 
        "managedByDescription": { 
            "value": "Relecloud provides managed services to its customers" 
        }, 
        "managedByTenantId": { 
            "value": "00000000-0000-0000-0000-000000000000" 
        }, 
        "managedByAuthorizations": { 
            "value": [ 
                { 
                    "principalId": "00000000-0000-0000-0000-000000000000", 
                    "principalIdDisplayName": "Tier 1 Support", 
                    "roleDefinitionId": "b24988ac-6180-42a0-ab88-20f7382dd24c" 
                }, 
                { 
                    "principalId": "00000000-0000-0000-0000-000000000000", 
                    "principalIdDisplayName": "Automation Account - Full access", 
                    "roleDefinitionId": "18d7d88d-d35e-4fb5-a5c3-7773c20a72d9", 
                    "delegatedRoleDefinitionIds": [ 
                        "b24988ac-6180-42a0-ab88-20f7382dd24c", 
                        "92aaf0da-9dab-42b6-94a3-d43ce8d16293", 
                        "91c1777a-f3dc-4fae-b103-61d183457e46" 
                    ] 
                }                 
            ] 
        } 
    } 
} 
```

## Assign the policy to a management group  

Once you've edited the policy to create your assignments, you can assign it at the management group level. To learn how to assign a policy and view compliance state results, see [Quickstart: Create a policy assignment](../../governance/policy/assign-policy-portal.md).

The PowerShell script below shows how to add the policy definition under the specified management group, using the template and parameter file you created. You need to create the assignment and remediation task for existing subscriptions.

```azurepowershell-interactive
New-AzManagementGroupDeployment -Name <DeploymentName> -Location <location> -ManagementGroupId <ManagementGroupName> -TemplateFile <path to file> -TemplateParameterFile <path to parameter file> -verbose
```

## Confirm successful onboarding

There are several ways to verify that the subscriptions in the management group were successfully onboarded. For more information, see [Confirm successful onboarding](onboard-customer.md#confirm-successful-onboarding).

If you keep the Logic App and policy active for your management group, any new subscriptions that are added to the management group will be onboarded as well.

## Next steps

- Learn more about [onboarding customers to Azure Lighthouse](onboard-customer.md).
- Learn about [Azure Policy](../../governance/policy/index.yml).
- Learn about [Azure Logic Apps](../../logic-apps/logic-apps-overview.md).
