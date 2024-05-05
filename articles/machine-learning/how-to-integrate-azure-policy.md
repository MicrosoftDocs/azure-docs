---
title: Audit and manage Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how to use Azure Policy to use built-in policies for Azure Machine Learning to make sure your workspaces are compliant with your requirements.
author: jhirono
ms.author: jhirono 
ms.date: 04/01/2024
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.reviewer: larryfr
---

# Audit and manage Azure Machine Learning

When teams collaborate on Azure Machine Learning, they might face varying requirements to configure and organize resources. Machine learning teams might look for flexibility in how to organize workspaces for collaboration, or how to size compute clusters for the requirements of their use cases. In these scenarios, productivity could benefit if application teams can manage their own infrastructure.

As a platform administrator, you can use policies to lay out guardrails for teams to manage their own resources. [Azure Policy](../governance/policy/index.yml) helps audit and govern resource state. This article explains how you can use audit controls and governance practices for Azure Machine Learning.

## Policies for Azure Machine Learning

[Azure Policy](../governance/policy/index.yml) is a governance tool that allows you to ensure that Azure resources are compliant with your policies.

Azure Policy provides a set of policies that you can use for common scenarios with Azure Machine Learning. You can assign these policy definitions to your existing subscription or use them as the basis to create your own custom definitions.

The following table lists the built-in policies you can assign with Azure Machine Learning. For a list of all Azure built-in policies, see [Built-in policies](../governance/policy/samples/built-in-policies.md).

[!INCLUDE [azure-policy-reference-policies-machine-learning](../../includes/policy/reference/bycat/policies-machine-learning.md)]

Policies can be set at different scopes, such as at the subscription or resource group level. For more information, see the [Azure Policy documentation](../governance/policy/overview.md).

## Assigning built-in policies

To view the built-in policy definitions related to Azure Machine Learning, use the following steps:

1. Go to __Azure Policy__ in the [Azure portal](https://portal.azure.com).
1. Select __Definitions__.
1. For __Type__, select __Built-in__. For __Category__, select __Machine Learning__.

From here, you can select policy definitions to view them. While viewing a definition, you can use the __Assign__ link to assign the policy to a specific scope, and configure the parameters for the policy. For more information, see [Create a policy assignment to identify non-compliant resources using Azure portal](../governance/policy/assign-policy-portal.md).

You can also assign policies by using [Azure PowerShell](../governance/policy/assign-policy-powershell.md), [Azure CLI](../governance/policy/assign-policy-azurecli.md), or [templates](../governance/policy/assign-policy-template.md).

## Conditional access policies

To control who can access your Azure Machine Learning workspace, use [Microsoft Entra Conditional Access](../active-directory/conditional-access/overview.md). To use Conditional Access for Azure Machine Learning workspaces, [assign the Conditional Access policy](../active-directory/conditional-access/concept-conditional-access-cloud-apps.md) to the app named __Azure Machine Learning__. The app ID is __0736f41a-0425-bdb5-1563eff02385__. 

## Enable self-service using landing zones

Landing zones are an architectural pattern that accounts for scale, governance, security, and productivity when setting up Azure environments. A data landing zone is an administator-configured environment that an application team uses to host a data and analytics workload.

The purpose of the landing zone is to ensure that all infrastructure configuration work is done when a team starts in the Azure environment. For instance, security controls are set up in compliance with organizational standards and network connectivity is set up.

Using the landing zones pattern, machine learning teams can deploy and manage their own resources on a self-service basis. By using Azure policy as an administrator, you can audit and manage Azure resources for compliance. 

Azure Machine Learning integrates with [data landing zones](https://github.com/Azure/data-landing-zone) in the [Cloud Adoption Framework data management and analytics scenario](/azure/cloud-adoption-framework/scenarios/data-management/). This reference implementation provides an optimized environment to migrate machine learning workloads onto Azure Machine Learning and includes preconfigured policies.

## Configure built-in policies

### Compute instance should have idle shutdown

This policy controls whether an Azure Machine Learning compute instance should have idle shutdown enabled. Idle shutdown automatically stops the compute instance when it's idle for a specified period of time. This policy is useful for cost savings and to ensure that resources aren't being used unnecessarily.

To configure this policy, set the effect parameter to __Audit__, __Deny__, or __Disabled__. If set to __Audit__, you can create a compute instance without idle shutdown enabled and a warning event is created in the activity log.

### Compute instances should be recreated to get software updates

Controls whether Azure Machine Learning compute instances should be audited to make sure they're running the latest available software updates. This policy is useful to ensure that compute instances are running the latest software updates to maintain security and performance. For more information, see [Vulnerability management for Azure Machine Learning](concept-vulnerability-management.md#compute-instance).

To configure this policy, set the effect parameter to __Audit__ or __Disabled__. If set to __Audit__, a warning event is created in the activity log when a compute isn't running the latest software updates.

### Compute cluster and instance should be in a virtual network

Controls auditing of compute cluster and instance resources behind a virtual network.

To configure this policy, set the effect parameter to __Audit__ or __Disabled__. If set to __Audit__, you can create a compute that isn't configured behind a virtual network and a warning event is created in the activity log.

### Computes should have local authentication methods disabled.

Controls whether an Azure Machine Learning compute cluster or instance should disable local authentication (SSH).

To configure this policy, set the effect parameter to __Audit__, __Deny__, or __Disabled__. If set to __Audit__, you can create a compute with SSH enabled and a warning event is created in the activity log.

If the policy is set to __Deny__, then you can't create a compute unless SSH is disabled. Attempting to create a compute with SSH enabled results in an error. The error is also logged in the activity log. The policy identifier is returned as part of this error.

### Workspaces should be encrypted with customer-managed key

Controls whether a workspace should be encrypted with a customer-managed key, or with a Microsoft-managed key to encrypt metrics and metadata. For more information on using customer-managed key, see the [Azure Cosmos DB](concept-data-encryption.md#azure-cosmos-db) section of the data encryption article.

To configure this policy, set the effect parameter to __Audit__ or __Deny__. If set to __Audit__, you can create a workspace without a customer-managed key and a warning event is created in the activity log.

If the policy is set to __Deny__, then you can't create a workspace unless it specifies a customer-managed key. Attempting to create a workspace without a customer-managed key results in an error similar to `Resource 'clustername' was disallowed by policy` and creates an error in the activity log. The policy identifier is also returned as part of this error.

### Configure workspaces to disable public network access

Controls whether a workspace should disable network access from the public internet.

To configure this policy, set the effect parameter to __Audit__, __Deny__, or __Disabled__. If set to __Audit__, you can create a workspace with public access and a warning event is created in the activity log.

If the policy is set to __Deny__, then you can't create a workspace that allows network access from the public internet.

### Workspaces should enable V1LegacyMode to support network isolation backward compatibility

Controls whether a workspace should enable V1LegacyMode to support network isolation backward compatibility. This policy is useful if you want to keep Azure Machine Learning control plane data inside your private networks. For more information, see [Network isolation change with our new API platform](how-to-configure-network-isolation-with-v2.md).

To configure this policy, set the effect parameter to __Audit__ or __Deny__, or __Disabled__. If set to __Audit__, you can create a workspace without enabling V1LegacyMode and a warning event is created in the activity log.

If the policy is set to __Deny__, then you can't create a workspace unless it enables V1LegacyMode.

### Workspaces should use private link

Controls whether a workspace should use Azure Private Link to communicate with Azure Virtual Network. For more information on using private link, see [Configure a private endpoint for an Azure Machine Learning workspace](how-to-configure-private-link.md).

To configure this policy, set the effect parameter to __Audit__ or __Deny__. If set to __Audit__, you can create a workspace without using private link and a warning event is created in the activity log.

If the policy is set to __Deny__, then you can't create a workspace unless it uses a private link. Attempting to create a workspace without a private link results in an error. The error is also logged in the activity log. The policy identifier is returned as part of this error.

### Workspaces should use user-assigned managed identity

Controls whether a workspace is created using a system-assigned managed identity (default) or a user-assigned managed identity. The managed identity for the workspace is used to access associated resources such as Azure Storage, Azure Container Registry, Azure Key Vault, and Azure Application Insights. For more information, see [Set up authentication between Azure Machine Learning and other services](how-to-identity-based-service-authentication.md).

To configure this policy, set the effect parameter to __Audit__, __Deny__, or __Disabled__. If set to __Audit__, you can create a workspace without specifying a user-assigned managed identity. A system-assigned identity is used and a warning event is created in the activity log.

If the policy is set to __Deny__, then you can't create a workspace unless you provide a user-assigned identity during the creation process. Attempting to create a workspace without providing a user-assigned identity results in an error. The error is also logged to the activity log. The policy identifier is returned as part of this error.

### Configure computes to modify/disable local authentication

This policy modifies any Azure Machine Learning compute cluster or instance creation request to disable local authentication (SSH).

To configure this policy, set the effect parameter to __Modify__ or __Disabled__. If set __Modify__, any creation of a compute cluster or instance within the scope where the policy applies will automatically have local authentication disabled.

### Configure workspace to use private DNS zones

This policy configures a workspace to use a private DNS zone, overriding the default DNS resolution for a private endpoint.

To configure this policy, set the effect parameter to __DeployIfNotExists__. Set the __privateDnsZoneId__ to the Azure Resource Manager ID of the private DNS zone to use. 

### Configure workspaces to disable public network access

Configures a workspace to disable network access from the public internet. This helps protect the workspaces against data leakage risks. You can instead access your workspace by creating private endpoints. For more information, see [Configure a private endpoint for an Azure Machine Learning workspace](how-to-configure-private-link.md).

To configure this policy, set the effect parameter to __Modify__ or __Disabled__. If set to __Modify__, any creation of a workspace within the scope where the policy applies will automatically have public network access disabled.

### Configure workspaces with private endpoints

Configures a workspace to create a private endpoint within the specified subnet of an Azure Virtual Network.

To configure this policy, set the effect parameter to __DeployIfNotExists__. Set the __privateEndpointSubnetID__ to the Azure Resource Manager ID of the subnet.

### Configure diagnostic workspaces to send logs to log analytics workspaces

Configures the diagnostic settings for an Azure Machine Learning workspace to send logs to a Log Analytics workspace.

To configure this policy, set the effect parameter to __DeployIfNotExists__ or __Disabled__. If set to __DeployIfNotExists__, the policy creates a diagnostic setting to send logs to a Log Analytics workspace if it doesn't already exist.

### Resource logs in workspaces should be enabled

Audits whether resource logs are enabled for an Azure Machine Learning workspace. Resource logs provide detailed information about operations performed on resources in the workspace.

To configure this policy, set the effect parameter to __AuditIfNotExists__ or __Disabled__. If set to __AuditIfNotExists__, the policy audits if resource logs aren't enabled for the workspace.

## Related content

* [Azure Policy documentation](../governance/policy/overview.md)
* [Built-in policies for Azure Machine Learning](policy-reference.md)
* [Working with security policies with Microsoft Defender for Cloud](../security-center/tutorial-security-policy.md)
* The [Cloud Adoption Framework scenario for data management and analytics](/azure/cloud-adoption-framework/scenarios/data-management/) outlines considerations in running data and analytics workloads in the cloud
* [Cloud Adoption Framework data landing zones](https://github.com/Azure/data-landing-zone) provide a reference implementation for managing data and analytics workloads in Azure
* [Learn how to use policy to integrate Azure Private Link with Azure Private DNS zones](/azure/cloud-adoption-framework/ready/azure-best-practices/private-link-and-dns-integration-at-scale)
