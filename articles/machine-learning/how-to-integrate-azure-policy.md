---
title: Audit and manage policy compliance
titleSuffix: Azure Machine Learning
description: Learn how to use Azure Policy to use built-in policies for Azure Machine Learning.
author: jhirono
ms.author: jhirono 
ms.date: 09/15/2020
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.reviewer: larryfr
---

# Audit and manage Azure Machine Learning using Azure Policy

[Azure Policy](../governance/policy/index.yml) is a governance tool that allows you to ensure that Azure resources are compliant with your policies. With Azure Machine Learning, you can assign the following policies:

* **Customer-managed key**: Audit or enforce whether workspaces must use a customer-managed key.
* **Private link**: Audit whether workspaces use a private endpoint to communicate with a virtual network.

Policies can be set at different scopes, such as at the subscription or resource group level. For more information, see the [Azure Policy documentation](../governance/policy/overview.md).

## Built-in policies

Azure Machine Learning provides a set of policies that you can use for common scenarios with Azure Machine Learning. You can assign these policy definitions to your existing subscription or use them as the basis to create your own custom definitions. For a complete list of the built-in policies for Azure Machine Learning, see [Built-in policies for Azure Machine Learning](../governance/policy/samples/built-in-policies.md#machine-learning).

To view the built-in policy definitions related to Azure Machine Learning, use the following steps:

1. Go to __Azure Policy__ in the [Azure portal](https://portal.azure.com).
1. Select __Definitions__.
1. For __Type__, select _Built-in_, and for __Category__, select __Machine Learning__.

From here, you can select policy definitions to view them. While viewing a definition, you can use the __Assign__ link to assign the policy to a specific scope, and configure the parameters for the policy. For more information, see [Assign a policy - portal](../governance/policy/assign-policy-portal.md).

You can also assign policies by using [Azure PowerShell](../governance/policy/assign-policy-powershell.md), [Azure CLI](../governance/policy/assign-policy-azurecli.md), and [templates](../governance/policy/assign-policy-template.md).

## Workspaces encryption with customer-managed key

Controls whether workspaces should be encrypted with a customer-managed key (CMK), or using a Microsoft-managed key to encrypt metrics and metadata. For more information on using CMK, see the [Azure Cosmos DB](concept-enterprise-security.md#azure-cosmos-db) section of the enterprise security article.

To configure this policy, set the effect parameter to __audit__ or __deny__. If set to __audit__, you can create workspaces without a CMK and an warning event is created in the activity log.

If the policy is set to __deny__, then you cannot create a workspace unless it specifies a CMK. Attempting to create a workspace without a CMK results in an error similar to `Resource 'clustername' was disallowed by policy` and creates an error in the activity log. The policy identifier is also returned as part of this error.

## Workspaces should use private link

Controls whether workspaces should use Azure Private Link to communicate with Azure Virtual Network. For more information on using private link, see [Configure private link for a workspace](how-to-configure-private-link.md).

To configure this policy, set the effect parameter to __audit__. If you create a workspace without using private link, a warning event is created in the activity log.

## Next steps

* [Azure Policy documentation](../governance/policy/overview.md)
* [Built-in policies for Azure Machine Learning](policy-reference.md)
* [Working with security policies with Azure Security Center](../security-center/tutorial-security-policy.md)