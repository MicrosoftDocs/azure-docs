---
title: Deploy associations using policies
description: Learn about deploying associations for a custom resource provider using Azure Policy service.
author: msHich
ms.topic: conceptual
ms.date: 09/06/2019
ms.author: hich
---

# Deploy associations for a custom resource provider using Azure Policy

Azure policies can be used to deploy associations to associate resources to a custom resource provider. In this article, we describe a built-in policy that deploys associations and how you can use that policy.

## Built-in policy to deploy associations

Deploy associations for a custom resource provider is a built-in policy that can be used to deploy association to associate a resource to a custom resource provider. The policy accepts three parameters:

- Custom resource provider ID - This ID is the resource ID of the custom resource provider to which the resources need to be associated.
- Resource types to associate - These resource types are the list of resource types to be associated to the custom resource provider. You can associate multiple resource types to a custom resource provider using the same policy.
- Association name prefix - This string is the prefix to be added to the name of the association resource being created. The default value is "DeployedByPolicy".

The policy uses DeployIfNotExists evaluation. It runs after a Resource Provider has handled a create or update resource request and the evaluation has returned a success status code. After that, the association resource gets deployed using a template deployment.
For more information on associations, see [Azure Custom Resource Providers resource onboarding](./concepts-resource-onboarding.md)

## How to use the deploy associations built-in policy 

### Prerequisites
If the custom resource provider needs permissions to the scope of the policy to perform an action, the policy deployment of association resource wouldn't work without granting the permissions.

### Policy assignment
To use the built-in policy, create a policy assignment and assign the Deploy associations for a custom resource provider policy. The policy will then identify non-compliant resources and deploy association for those resources.

:::image type="content" source="media/concepts-built-in-policy/assign-builtin-policy-customprovider.png" alt-text="Screenshot of the Assign built-in policy for custom resource provider in Azure portal.":::

## Getting help

If you have questions about Azure Custom Resource Providers development, try asking them on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-custom-providers). A similar question might have already been answered, so check first before posting. Add the tag ```azure-custom-providers``` to get a fast response!

## Next steps

In this article, you learnt about using built-in policy to deploy associations. See these articles to learn more:

- [Concepts: Azure Custom Resource Providers resource onboarding](./concepts-resource-onboarding.md)
- [Tutorial: Resource onboarding with custom resource providers](./tutorial-resource-onboarding.md)
- [Tutorial: Create custom actions and resources in Azure](./tutorial-get-started-with-custom-providers.md)
- [Quickstart: Create Azure Custom Resource Provider and deploy custom resources](./create-custom-provider.md)
- [How to: Adding custom actions to an Azure REST API](./custom-providers-action-endpoint-how-to.md)
- [How to: Adding custom resources to an Azure REST API](./custom-providers-resources-endpoint-how-to.md)
