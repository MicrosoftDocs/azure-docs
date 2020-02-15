---
title: Compliance using Azure Policy
description: Assign built-in policies in Azure Policy to audit compliance of your Azure container registries
ms.topic: article
ms.date: 02/14/2020
---

# Use Azure Policy to audit Azure container registries

[Azure Policy](../governance/policy/overview.md) is a service in Azure that you use to create, assign, and manage policies. These policies enforce different rules and effects over your resources, so those resources stay compliant with your corporate standards and service level agreements.

There are no charges for using Azure Policy.

This article introduces built-in policies for Azure Container Registry that you can assign to audit new and existing registries for compliance.


## Built-in policy definitions

[!INCLUDE [azure-policy-samples-policies-container-registry](../../includes/azure-policy-samples-policies-container-registry.md)]


## Assign policies

* Assign policies using the [Azure portal](../governance/policy/assign-policy-portal.md), [Azure CLI](../governance/policy/assign-policy-azurecli.md), a [Resource Manager template](../governance/policy/assign-policy-template.md), or other methods.

* Scope a policy assignment to a resource group, a subscription, or an [Azure management group](../governance/management-groups/overview.md)


## Identify non-compliant resources

In the portal:

1. Select **All services** and search for **Policy**
1. Select **Compliance** 
1. Use the filters to limit compliance states or search for policies
1. Select a policy to review compliance details 

    :::image type="complex" source="media/container-registry-azure-policy/azure-policy-compliance.png" alt-text="Compliance in Azure Policy":::

:::image-end:::

## Next steps

* Learn more about about Azure Policy [definitions](../governance/policy/concepts/definition-structure.md) and [effects](../governance/policy/concepts/effects.md)

* Create a [custom policy definition](../governance/policy/tutorials/create-custom-policy-definition.md)

* Learn more about [governance capabilities](../governance/) in Azure



<!-- IMAGES -->

<!-- LINKS - External -->

<!-- LINKS - Internal -->

