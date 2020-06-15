---
title: Deploy a policy that can be remediated
description: Learn how to onboard a customer to Azure delegated resource management, allowing their resources to be accessed and managed through your own tenant.
ms.date: 10/11/2019
ms.topic: how-to
---

# Deploy a policy that can be remediated within a delegated subscription

[Azure Lighthouse](../overview.md) allows service providers to create and edit policy definitions within a delegated subscription. However, to deploy policies that use a [remediation task](../../governance/policy/how-to/remediate-resources.md) (that is, policies with the [deployIfNotExists](../../governance/policy/concepts/effects.md#deployifnotexists) or [modify](../../governance/policy/concepts/effects.md#modify) effect), you'll need to create a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) in the customer tenant. This managed identity can be used by Azure Policy to deploy the template within the policy. There are steps required to enable this scenario, both when you onboard the customer for Azure delegated resource management, and when you deploy the policy itself.

## Create a user who can assign roles to a managed identity in the customer tenant

When you onboard a customer for Azure delegated resource management, you use an [Azure Resource Manager template](onboard-customer.md#create-an-azure-resource-manager-template) along with a parameters file that defines the users, user groups, and service principals in your managing tenant that will be able to access the delegated resources in the customer tenant. In your parameters file, each of these users (**principalId**) is assigned a [built-in role](../../role-based-access-control/built-in-roles.md) (**roleDefinitionId**) that defines the level of access.

To allow a **principalId** to create a managed identity in the customer tenant, you must set its **roleDefinitionId** to **User Access Administrator**. While this role is not generally supported, it can be used in this specific scenario, allowing the users with this permission to assign one or more specific built-in roles to managed identities. These roles are defined in the **delegatedRoleDefinitionIds** property. You can include any built-in role here except for User Access Administrator or Owner.

After the customer is onboarded, the **principalId** created in this authorization will be able to assign these built-in roles to managed identities in the customer tenant. However, they will not have any other permissions normally associated with the User Access Administrator role.

The example below shows a **principalId** who will have the User Access Administrator role. This user will be able to assign two built-in roles to managed identities in the customer tenant: Contributor and Log Analytics Contributor.

```json
{
    "principalId": "3kl47fff-5655-4779-b726-2cf02b05c7c4",
    "principalIdDisplayName": "Policy Automation Account",
    "roleDefinitionId": "18d7d88d-d35e-4fb5-a5c3-7773c20a72d9",
    "delegatedRoleDefinitionIds": [
         "b24988ac-6180-42a0-ab88-20f7382dd24c",
         "92aaf0da-9dab-42b6-94a3-d43ce8d16293"
    ]
}
```

## Deploy policies that can be remediated

Once you have created the user with the necessary permissions as described above, that user can deploy policies in the customer tenant that use remediation tasks.

For example, let's say you wanted to enable diagnostics on Azure Key Vault resources in the customer tenant, as illustrated in this [sample](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/policy-enforce-keyvault-monitoring). A user in the managing tenant with the appropriate permissions (as described above) would deploy an [Azure Resource Manager template](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/policy-enforce-keyvault-monitoring/enforceAzureMonitoredKeyVault.json) to enable this scenario.

Note that creating the policy assignment to use with a delegated subscription must currently be done through APIs, not in the Azure portal. When doing so, the **apiVersion** must be set to **2019-04-01-preview**, which includes the new **delegatedManagedIdentityResourceId** property. This property allows you to include a managed identity that resides in the customer tenant (in a subscription or resource group which has been onboarded to Azure delegated resource management).

The following example shows a role assignment with a **delegatedManagedIdentityResourceId**.

```json
"type": "Microsoft.Authorization/roleAssignments",
            "apiVersion": "2019-04-01-preview",
            "name": "[parameters('rbacGuid')]",
            "dependsOn": [
                "[variables('policyAssignment')]"
            ],
            "properties": {
                "roleDefinitionId": "[concat(subscription().id, '/providers/Microsoft.Authorization/roleDefinitions/', variables('rbacContributor'))]",
                "principalType": "ServicePrincipal",
                "delegatedManagedIdentityResourceId": "[concat(subscription().id, '/providers/Microsoft.Authorization/policyAssignments/', variables('policyAssignment'))]",
                "principalId": "[toLower(reference(concat('/providers/Microsoft.Authorization/policyAssignments/', variables('policyAssignment')), '2018-05-01', 'Full' ).identity.principalId)]"
            }
```

> [!TIP]
> A [similar sample](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/policy-add-or-replace-tag) is available to demonstrate how to deploy a policy that adds or removes a tag (using the modify effect) to a delegated subscription.

## Next steps

- Learn about [Azure Policy](../../governance/policy/index.yml).
- Learn about [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).
