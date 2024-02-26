---
title: Deploy a policy that can be remediated within a delegated subscription
description: To deploy policies that use a remediation task via Azure Lighthouse, you'll need to create a managed identity in the customer tenant.
ms.date: 05/23/2023
ms.topic: how-to
---

# Deploy a policy that can be remediated within a delegated subscription

[Azure Lighthouse](../overview.md) allows service providers to create and edit policy definitions within a delegated subscription. To deploy policies that use a [remediation task](../../governance/policy/how-to/remediate-resources.md) (that is, policies with the [deployIfNotExists](../../governance/policy/concepts/effects.md#deployifnotexists) or [modify](../../governance/policy/concepts/effects.md#modify) effect), you must create a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) in the customer tenant. This managed identity can be used by Azure Policy to deploy the template within the policy. This article describes the steps that are required to enable this scenario, both when you onboard the customer for Azure Lighthouse, and when you deploy the policy itself.

> [!TIP]
> Though we refer to service providers and customers in this topic, [enterprises managing multiple tenants](../concepts/enterprise.md) can use the same processes.

## Create a user who can assign roles to a managed identity in the customer tenant

When you [onboard a customer to Azure Lighthouse](onboard-customer.md), you define authorizations that grant access to delegated resources in the customer tenant. Each authorization specifies a **principalId** that corresponds to a Microsoft Entra user, group, or service principal in the managing tenant, and a **roleDefinitionId** that corresponds to the [Azure built-in role](../../role-based-access-control/built-in-roles.md) that will be granted.

To allow a **principalId** to assign roles to a managed identity in the customer tenant, you must set its **roleDefinitionId** to **User Access Administrator**. While this role is not generally supported for Azure Lighthouse, it can be used in this specific scenario. Granting this role to this **principalId** allows it to assign specific built-in roles to managed identities. These roles are defined in the **delegatedRoleDefinitionIds** property, and can include any [supported Azure built-in role](../concepts/tenants-users-roles.md#role-support-for-azure-lighthouse) except for User Access Administrator or Owner.

After the customer is onboarded, the **principalId** created in this authorization will be able to assign these built-in roles to managed identities in the customer tenant. It will not have any other permissions normally associated with the User Access Administrator role.

> [!NOTE]
> [Role assignments](../../role-based-access-control/role-assignments-steps.md#step-5-assign-role) across tenants must currently be done through APIs, not in the Azure portal.

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

Once you have created the user with the necessary permissions as described above, that user can deploy policies that use remediation tasks within delegated customer subscriptions.

For example, let's say you wanted to enable diagnostics on Azure Key Vault resources in the customer tenant, as illustrated in this [sample](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/policy-enforce-keyvault-monitoring). A user in the managing tenant with the appropriate permissions (as described above) would deploy an [Azure Resource Manager template](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/policy-enforce-keyvault-monitoring/enforceAzureMonitoredKeyVault.json) to enable this scenario.

Creating the policy assignment to use with a delegated subscription must currently be done through APIs, not in the Azure portal. When doing so, the **apiVersion** must be set to  **2019-04-01-preview** or later to include the new **delegatedManagedIdentityResourceId** property. This property allows you to include a managed identity that resides in the customer tenant (in a subscription or resource group that has been onboarded to Azure Lighthouse).

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
