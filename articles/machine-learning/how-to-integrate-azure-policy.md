---
title: Audit and manage policy compliance
titleSuffix: Azure Machine Learning
description: Learn how to use Azure Policy to use built-in policies for Azure Machine Learning to make sure your workspaces are compliant with your requirements.
author: aashishb
ms.author: aashishb 
ms.date: 05/10/2021
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.reviewer: larryfr
---

# Audit and manage Azure Machine Learning using Azure Policy

[Azure Policy](../governance/policy/index.yml) is a governance tool that allows you to ensure that Azure resources are compliant with your policies. With Azure Machine Learning, you can assign the following policies:

| Policy | Description |
| ----- | ----- |
| **Customer-managed key** | Audit or enforce whether workspaces must use a customer-managed key. |
| **Private link** | Audit or enforce whether workspaces use a private endpoint to communicate with a virtual network. |
| **Private endpoint** | Configure the Azure Virtual Network subnet where the private endpoint should be created. |
| **Private DNS zone** | Configure the private DNS zone to use for the private link. |
| **User-assigned managed identity** | Audit or enforce whether workspaces use a user-assigned managed identity. |
| **Disable local authentication** | Audit or enforce whether Azure Machine Learning compute resources should have local authentication methods disabled. |
| **Modify/disable local authentication** | Configure compute resources to disable local authentication methods. |

Policies can be set at different scopes, such as at the subscription or resource group level. For more information, see the [Azure Policy documentation](../governance/policy/overview.md).

## Conditional access policies

To control who can access your Azure Machine Learning workspace, use Azure Active Directory [Conditional Access](../active-directory/conditional-access/overview.md).

## Built-in policies

Azure Machine Learning provides a set of policies that you can use for common scenarios with Azure Machine Learning. You can assign these policy definitions to your existing subscription or use them as the basis to create your own custom definitions. For a complete list of the built-in policies for Azure Machine Learning, see [Built-in policies for Azure Machine Learning](../governance/policy/samples/built-in-policies.md#machine-learning).

To view the built-in policy definitions related to Azure Machine Learning, use the following steps:

1. Go to __Azure Policy__ in the [Azure portal](https://portal.azure.com).
1. Select __Definitions__.
1. For __Type__, select _Built-in_, and for __Category__, select __Machine Learning__.

From here, you can select policy definitions to view them. While viewing a definition, you can use the __Assign__ link to assign the policy to a specific scope, and configure the parameters for the policy. For more information, see [Assign a policy - portal](../governance/policy/assign-policy-portal.md).

You can also assign policies by using [Azure PowerShell](../governance/policy/assign-policy-powershell.md), [Azure CLI](../governance/policy/assign-policy-azurecli.md), and [templates](../governance/policy/assign-policy-template.md).

## Workspace encryption with customer-managed key

Controls whether a workspace should be encrypted with a customer-managed key, or using a Microsoft-managed key to encrypt metrics and metadata. For more information on using customer-managed key, see the [Azure Cosmos DB](concept-data-encryption.md#azure-cosmos-db) section of the data encryption article.

To configure this policy, set the effect parameter to __audit__ or __deny__. If set to __audit__, you can create a workspace without a customer-managed key and a warning event is created in the activity log.

If the policy is set to __deny__, then you cannot create a workspace unless it specifies a customer-managed key. Attempting to create a workspace without a customer-managed key results in an error similar to `Resource 'clustername' was disallowed by policy` and creates an error in the activity log. The policy identifier is also returned as part of this error.

## Workspace should use private link

Controls whether a workspace should use Azure Private Link to communicate with Azure Virtual Network. For more information on using private link, see [Configure private link for a workspace](how-to-configure-private-link.md).

To configure this policy, set the effect parameter to __audit__ or __deny__. If set to __audit__, you can create a workspace without using private link and a warning event is created in the activity log.

If the policy is set to __deny__, then you cannot create a workspace unless it uses a private link. Attempting to create a workspace without a private link results in an error. The error is also logged in the activity log. The policy identifier is returned as part of this error.

## Workspace should use private endpoint

Configures a workspace to create a private endpoint within the specified subnet of an Azure Virtual Network.

To configure this policy, set the effect parameter to __DeployIfNotExists__. Set the __privateEndpointSubnetID__ to the Azure Resource Manager ID of the subnet.
## Workspace should use private DNS zones

Configures a workspace to use a private DNS zone, overriding the default DNS resolution for a private endpoint.

To configure this policy, set the effect parameter to __DeployIfNotExists__. Set the __privateDnsZoneId__ to the Azure Resource Manager ID of the private DNS zone to use. 

## Workspace should use user-assigned managed identity

Controls whether a workspace is created using a system-assigned managed identity (default) or a user-assigned managed identity. The managed identity for the workspace is used to access associated resources such as Azure Storage, Azure Container Registry, Azure Key Vault, and Azure Application Insights. For more information, see [Use managed identities with Azure Machine Learning](how-to-use-managed-identities.md).

To configure this policy, set the effect parameter to __audit__, __deny__, or __disabled__. If set to __audit__, you can create a workspace without specifying a user-assigned managed identity. A system-assigned identity is used and a warning event is created in the activity log.

If the policy is set to __deny__, then you cannot create a workspace unless you provide a user-assigned identity during the creation process. Attempting to create a workspace without providing a user-assigned identity results in an error. The error is also logged to the activity log. The policy identifier is returned as part of this error.

## Disable local authentication

Controls whether an Azure Machine Learning compute cluster or instance should disable local authentication (SSH).

To configure this policy, set the effect parameter to __audit__, __deny__, or __disabled__. If set to __audit__, you can create a compute with SSH enabled and a warning event is created in the activity log.

If the policy is set to __deny__, then you cannot create a compute unless SSH is disabled. Attempting to create a compute with SSH enabled results in an error. The error is also logged in the activity log. The policy identifier is returned as part of this error.


## Modify/disable local authentication

Modifies any Azure Machine Learning compute cluster or instance creation request to disable local authentication (SSH).

To configure this policy, set the effect parameter to __Modify__ or __Disabled__. If set __Modify__, any creation of a compute cluster or instance within the scope where the policy applies will automatically have local authentication disabled.

## Next steps

* [Azure Policy documentation](../governance/policy/overview.md)
* [Built-in policies for Azure Machine Learning](policy-reference.md)
* [Working with security policies with Azure Security Center](../security-center/tutorial-security-policy.md)