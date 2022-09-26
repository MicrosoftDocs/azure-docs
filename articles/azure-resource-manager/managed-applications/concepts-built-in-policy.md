---
title: Deploy associations for managed application using Azure Policy
description: Learn about deploying associations for a managed application using Azure Policy.
author: msHich
ms.topic: conceptual
ms.date: 06/23/2022
ms.author: hich
---

# Deploy associations for a managed application using Azure Policy

Azure policies can be used to deploy associations to associate resources to a managed application. In this article, we describe a built-in policy that deploys associations and how you can use that policy.

## Built-in policy to deploy associations

Deploy associations for a managed application is a built-in policy that associates a resource type to a managed application. The policy deployment doesn't support nested resource types. The policy accepts three parameters:

- Managed application ID - This ID is the resource ID of the managed application to which the resources need to be associated.
- Resource types to associate - These resource types are the list of resource types to be associated to the managed application. You can associate multiple resource types to a managed application using the same policy.
- Association name prefix - This string is the prefix to be added to the name of the association resource being created. The default value is `DeployedByPolicy`.

The policy uses `DeployIfNotExists` evaluation. It runs after a Resource Provider has handled a create or update resource request of the selected resource type and the evaluation has returned a success status code. After that, the association resource gets deployed using a template deployment.
For more information on associations, see [Azure Custom Providers resource onboarding](../custom-providers/concepts-resource-onboarding.md)

For more information, see [Deploy associations for a managed application](../../governance/policy/samples/built-in-policies.md#managed-application).

## How to use the deploy associations built-in policy

### Prerequisites

If the managed application needs permissions to the subscription to perform an action, the policy deployment of association resource wouldn't work without granting the permissions.

### Policy assignment

To use the built-in policy, create a policy assignment and assign the Deploy associations for a managed application policy. Once the policy has been assigned successfully,
the policy will identify non-compliant resources and deploy association for those resources.

:::image type="content" source="media/concepts-built-in-policy/assign-builtin-policy-managedapp.png" alt-text="Screenshot of Azure portal to create a policy assignment and assign the deploy associations policy.":::

## Getting help

If you have questions about Azure Custom Resource Providers development, try asking them on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-custom-providers). A similar question might have already been answered, so check first before posting. Use the tag `azure-custom-providers`.

## Next steps

In this article, you learned about using built-in policy to deploy associations. See these articles to learn more:

- [Concepts: Azure Custom Providers resource onboarding](../custom-providers/concepts-resource-onboarding.md)
- [Tutorial: Resource onboarding with custom providers](../custom-providers/tutorial-resource-onboarding.md)
- [Tutorial: Create custom actions and resources in Azure](../custom-providers/tutorial-get-started-with-custom-providers.md)
- [Quickstart: Create a custom resource provider and deploy custom resources](../custom-providers/create-custom-provider.md)
- [How to: Adding custom actions to an Azure REST API](../custom-providers/custom-providers-action-endpoint-how-to.md)
- [How to: Adding custom resources to an Azure REST API](../custom-providers/custom-providers-resources-endpoint-how-to.md)
