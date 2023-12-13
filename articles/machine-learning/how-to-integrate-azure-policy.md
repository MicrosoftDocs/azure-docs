---
title: Audit and manage Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how to use Azure Policy to use built-in policies for Azure Machine Learning to make sure your workspaces are compliant with your requirements.
author: jhirono
ms.author: jhirono 
ms.date: 10/20/2022
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.reviewer: larryfr
---

# Audit and manage Azure Machine Learning

When teams collaborate on Azure Machine Learning, they may face varying requirements to the configuration and organization of resources. Machine learning teams may look for flexibility in how to organize workspaces for collaboration, or size compute clusters to the requirements of their use cases. In these scenarios, it may lead to most productivity if the application team can manage their own infrastructure.

As a platform administrator, you can use policies to lay out guardrails for teams to manage their own resources. [Azure Policy](../governance/policy/index.yml) helps audit and govern resource state. In this article, you learn about available auditing controls and governance practices for Azure Machine Learning.

## Policies for Azure Machine Learning

[Azure Policy](../governance/policy/index.yml) is a governance tool that allows you to ensure that Azure resources are compliant with your policies.

Azure Machine Learning provides a set of policies that you can use for common scenarios with Azure Machine Learning. You can assign these policy definitions to your existing subscription or use them as the basis to create your own custom definitions.

The table below includes a selection of policies you can assign with Azure Machine Learning. For a complete list of the built-in policies for Azure Machine Learning, see [Built-in policies for Azure Machine Learning](../governance/policy/samples/built-in-policies.md#machine-learning).

| Policy | Description |
| ----- | ----- |
| **Customer-managed key** | Audit or enforce whether workspaces must use a customer-managed key. |
| **Private link** | Audit or enforce whether workspaces use a private endpoint to communicate with a virtual network. |
| **Private endpoint** | Configure the Azure Virtual Network subnet where the private endpoint should be created. |
| **Private DNS zone** | Configure the private DNS zone to use for the private link. |
| **User-assigned managed identity** | Audit or enforce whether workspaces use a user-assigned managed identity. |
| **Disable public network access** | Audit or enforce whether workspaces disable access from the public internet. |
| **Disable local authentication** | Audit or enforce whether Azure Machine Learning compute resources should have local authentication methods disabled. |
| **Modify/disable local authentication** | Configure compute resources to disable local authentication methods. |
| **Compute cluster and instance is behind virtual network** | Audit whether compute resources are behind a virtual network. |

Policies can be set at different scopes, such as at the subscription or resource group level. For more information, see the [Azure Policy documentation](../governance/policy/overview.md).

## Assigning built-in policies

To view the built-in policy definitions related to Azure Machine Learning, use the following steps:

1. Go to __Azure Policy__ in the [Azure portal](https://portal.azure.com).
1. Select __Definitions__.
1. For __Type__, select _Built-in_, and for __Category__, select __Machine Learning__.

From here, you can select policy definitions to view them. While viewing a definition, you can use the __Assign__ link to assign the policy to a specific scope, and configure the parameters for the policy. For more information, see [Assign a policy - portal](../governance/policy/assign-policy-portal.md).

You can also assign policies by using [Azure PowerShell](../governance/policy/assign-policy-powershell.md), [Azure CLI](../governance/policy/assign-policy-azurecli.md), and [templates](../governance/policy/assign-policy-template.md).

## Conditional access policies

To control who can access your Azure Machine Learning workspace, use Microsoft Entra [Conditional Access](../active-directory/conditional-access/overview.md). To use Conditional Access for Azure Machine Learning workspaces, [assign the Conditional Access policy](../active-directory/conditional-access/concept-conditional-access-cloud-apps.md) to the app named __Azure Machine Learning__. The app ID is __0736f41a-0425-bdb5-1563eff02385__. 

## Enable self-service using landing zones

Landing zones are an architectural pattern to set up Azure environments that accounts for scale, governance, security, and productivity. A data landing zone is an administator-configured environment that an application team uses to host a data and analytics workload.

The purpose of the landing zone is to ensure when a team starts in the Azure environment, all infrastructure configuration work is done. For instance, security controls are set up in compliance with organizational standards and network connectivity is set up.

Using the landing zones pattern, machine learning teams can be enabled to self-service deploy and manage their own resources. By use of Azure policy, as an administrator you can audit and manage Azure resources for compliance and make sure workspaces are compliant to meet your requirements. 

Azure Machine Learning integrates with [data landing zones](https://github.com/Azure/data-landing-zone) in the [Cloud Adoption Framework data management and analytics scenario](/azure/cloud-adoption-framework/scenarios/data-management/). This reference implementation provides an optimized environment to migrate machine learning workloads onto and includes policies for Azure Machine Learning preconfigured.

## Configure built-in policies

### Workspace encryption with customer-managed key

Controls whether a workspace should be encrypted with a customer-managed key, or using a Microsoft-managed key to encrypt metrics and metadata. For more information on using customer-managed key, see the [Azure Cosmos DB](concept-data-encryption.md#azure-cosmos-db) section of the data encryption article.

To configure this policy, set the effect parameter to __audit__ or __deny__. If set to __audit__, you can create a workspace without a customer-managed key and a warning event is created in the activity log.

If the policy is set to __deny__, then you cannot create a workspace unless it specifies a customer-managed key. Attempting to create a workspace without a customer-managed key results in an error similar to `Resource 'clustername' was disallowed by policy` and creates an error in the activity log. The policy identifier is also returned as part of this error.

### Workspace should use private link

Controls whether a workspace should use Azure Private Link to communicate with Azure Virtual Network. For more information on using private link, see [Configure private link for a workspace](how-to-configure-private-link.md).

To configure this policy, set the effect parameter to __audit__ or __deny__. If set to __audit__, you can create a workspace without using private link and a warning event is created in the activity log.

If the policy is set to __deny__, then you cannot create a workspace unless it uses a private link. Attempting to create a workspace without a private link results in an error. The error is also logged in the activity log. The policy identifier is returned as part of this error.

### Workspace should use private endpoint

Configures a workspace to create a private endpoint within the specified subnet of an Azure Virtual Network.

To configure this policy, set the effect parameter to __DeployIfNotExists__. Set the __privateEndpointSubnetID__ to the Azure Resource Manager ID of the subnet.

### Workspace should use private DNS zones

Configures a workspace to use a private DNS zone, overriding the default DNS resolution for a private endpoint.

To configure this policy, set the effect parameter to __DeployIfNotExists__. Set the __privateDnsZoneId__ to the Azure Resource Manager ID of the private DNS zone to use. 

### Workspace should use user-assigned managed identity

Controls whether a workspace is created using a system-assigned managed identity (default) or a user-assigned managed identity. The managed identity for the workspace is used to access associated resources such as Azure Storage, Azure Container Registry, Azure Key Vault, and Azure Application Insights. For more information, see [Use managed identities with Azure Machine Learning](how-to-identity-based-service-authentication.md).

To configure this policy, set the effect parameter to __audit__, __deny__, or __disabled__. If set to __audit__, you can create a workspace without specifying a user-assigned managed identity. A system-assigned identity is used and a warning event is created in the activity log.

If the policy is set to __deny__, then you cannot create a workspace unless you provide a user-assigned identity during the creation process. Attempting to create a workspace without providing a user-assigned identity results in an error. The error is also logged to the activity log. The policy identifier is returned as part of this error.

### Workspace should disable public network access

Controls whether a workspace should disable network access from the public internet.

To configure this policy, set thee effect parameter to __audit__, __deny__, or __disabled__. If set to __audit__, you can create a workspace with public access and a warning event is created in the activity log.

If the policy is set to __deny__, then you cannot create a workspace that allows network access from the public internet.

### Disable local authentication

Controls whether an Azure Machine Learning compute cluster or instance should disable local authentication (SSH).

To configure this policy, set the effect parameter to __audit__, __deny__, or __disabled__. If set to __audit__, you can create a compute with SSH enabled and a warning event is created in the activity log.

If the policy is set to __deny__, then you cannot create a compute unless SSH is disabled. Attempting to create a compute with SSH enabled results in an error. The error is also logged in the activity log. The policy identifier is returned as part of this error.

### Modify/disable local authentication

Modifies any Azure Machine Learning compute cluster or instance creation request to disable local authentication (SSH).

To configure this policy, set the effect parameter to __Modify__ or __Disabled__. If set __Modify__, any creation of a compute cluster or instance within the scope where the policy applies will automatically have local authentication disabled.

### Compute cluster and instance is behind virtual network

Controls auditing of compute cluster and instance resources behind a virtual network.

To configure this policy, set the effect parameter to __audit__ or __disabled__. If set to __audit__, you can create a compute that is not configured behind a virtual network and a warning event is created in the activity log.

## Next steps

* [Azure Policy documentation](../governance/policy/overview.md)
* [Built-in policies for Azure Machine Learning](policy-reference.md)
* [Working with security policies with Microsoft Defender for Cloud](../security-center/tutorial-security-policy.md)
* The [Cloud Adoption Framework scenario for data management and analytics](/azure/cloud-adoption-framework/scenarios/data-management/) outlines considerations in running data and analytics workloads in the cloud.
* [Cloud Adoption Framework data landing zones](https://github.com/Azure/data-landing-zone) provide a reference implementation for managing data and analytics workloads in Azure.
* [Learn how to use policy to integrate Azure Private Link with Azure Private DNS zones](/azure/cloud-adoption-framework/ready/azure-best-practices/private-link-and-dns-integration-at-scale), to manage private link configuration for the workspace and dependent resources.
