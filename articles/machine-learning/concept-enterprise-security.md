---
title: Enterprise security and governance
titleSuffix: Azure Machine Learning
description: 'Securely use Azure Machine Learning: authentication, authorization, network security, data encryption, and monitoring.'
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.custom: event-tier1-build-2022, build-2023
ms.topic: conceptual
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 08/26/2022
---

# Enterprise security and governance for Azure Machine Learning

In this article, you'll learn about security and governance features available for Azure Machine Learning. These features are useful for administrators, DevOps, and MLOps who want to create a secure configuration that is compliant with your companies policies. With Azure Machine Learning and the Azure platform, you can:

* Restrict access to resources and operations by user account or groups
* Restrict incoming and outgoing network communications
* Encrypt data in transit and at rest
* Scan for vulnerabilities
* Apply and audit configuration policies

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Restrict access to resources and operations

[Azure Active Directory (Azure AD)](../active-directory/fundamentals/active-directory-whatis.md) is the identity service provider for Azure Machine Learning. It allows you to create and manage the security objects (user, group, service principal, and managed identity) that are used to _authenticate_ to Azure resources. Multi-factor authentication is supported if Azure AD is configured to use it.

Here's the authentication process for Azure Machine Learning using multi-factor authentication in Azure AD:

1. The client signs in to Azure AD and gets an Azure Resource Manager token.
1. The client presents the token to Azure Resource Manager and to all Azure Machine Learning.
1. Azure Machine Learning provides a Machine Learning service token to the user compute target (for example, Azure Machine Learning compute cluster or [serverless compute](./how-to-use-serverless-compute.md)). This token is used by the user compute target to call back into the Machine Learning service after the job is complete. The scope is limited to the workspace.

[![Authentication in Azure Machine Learning](media/concept-enterprise-security/authentication.png)](media/concept-enterprise-security/authentication.png#lightbox)

Each workspace has an associated system-assigned [managed identity](../active-directory/managed-identities-azure-resources/overview.md) that has the same name as the workspace. This managed identity is used to securely access resources used by the workspace. It has the following Azure RBAC permissions on associated resources:

| Resource | Permissions |
| ----- | ----- |
| Workspace | Contributor |
| Storage account | Storage Blob Data Contributor |
| Key vault | Access to all keys, secrets, certificates |
| Azure Container Registry | Contributor |
| Resource group that contains the workspace | Contributor |

The system-assigned managed identity is used for internal service-to-service authentication between Azure Machine Learning and other Azure resources. The identity token is not accessible to users and cannot be used by them to gain access to these resources. Users can only access the resources through [Azure Machine Learning control and data plane APIs](how-to-assign-roles.md), if they have sufficient RBAC permissions.

We don't recommend that admins revoke the access of the managed identity to the resources mentioned in the preceding table. You can restore access by using the [resync keys operation](how-to-change-storage-access-key.md).

> [!NOTE]
> If your Azure Machine Learning workspaces has compute targets (compute cluster, compute instance, Azure Kubernetes Service, etc.) that were created __before May 14th, 2021__, you may also have an additional Azure Active Directory account. The account name starts with `Microsoft-AzureML-Support-App-` and has contributor-level access to your subscription for every workspace region.
> 
> If your workspace does not have an Azure Kubernetes Service (AKS) attached, you can safely delete this Azure AD account. 
> 
> If your workspace has attached AKS clusters, _and they were created before May 14th, 2021_, __do not delete this Azure AD account__. In this scenario, you must first delete and recreate the AKS cluster before you can delete the Azure AD account.

You can provision the workspace to use user-assigned managed identity, and grant the managed identity additional roles, for example to access your own Azure Container Registry for base Docker images. You can also configure managed identities for use with Azure Machine Learning compute cluster. This managed identity is independent of workspace managed identity. With a compute cluster, the managed identity is used to access resources such as secured datastores that the user running the training job may not have access to. For more information, see [Use managed identities for access control](how-to-identity-based-service-authentication.md).

> [!TIP]
> There are some exceptions to the use of Azure AD and Azure RBAC within Azure Machine Learning:
> * You can optionally enable __SSH__ access to compute resources such as Azure Machine Learning compute instance and compute cluster. SSH access is based on public/private key pairs, not Azure AD. SSH access is not governed by Azure RBAC.
> * You can authenticate to models deployed as online endpoints using __key__ or __token__-based authentication. Keys are static strings, while tokens are retrieved using an Azure AD security object. For more information, see [How to authenticate online endpoints](how-to-authenticate-online-endpoint.md).

For more information, see the following articles:
* [Authentication for Azure Machine Learning workspace](how-to-setup-authentication.md)
* [Manage access to Azure Machine Learning](how-to-assign-roles.md)
* [Connect to storage services](how-to-access-data.md)
* [Use Azure Key Vault for secrets when training](how-to-use-secrets-in-runs.md)
* [Use Azure AD managed identity with Azure Machine Learning](how-to-identity-based-service-authentication.md)

## Network security and isolation

To restrict network access to Azure Machine Learning resources, you can use [Azure Virtual Network (VNet)](../virtual-network/virtual-networks-overview.md) and [Azure Machine Learning managed virtual network (preview)](how-to-managed-network.md). Using a virtual network reduces the attack surface for your solution, as well as the chances of data exfiltration.

You don't have to pick one or the other. For example, you can use a managed virtual network to secure managed compute resources and an Azure Virtual Network for your unmanaged resources or to secure client access to the workspace.

* __Azure Machine Learning managed virtual network__ (preview) provides a fully managed solution that enables network isolation for your workspace and managed compute resources. You can use private endpoints to secure communication with other Azure services, and can restrict outbound communications.

    [!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

    For more information, see [Azure Machine Learning managed virtual network (preview)](how-to-managed-network.md).

* __Azure Virtual Networks__ provides a more customizable virtual network offering. However, you're responsible for configuration and management. You may need to use network security groups, user-defined routing, or a firewall to restrict outbound communication.

    For more information, see the following documents:

    * [Virtual network isolation and privacy overview](how-to-network-security-overview.md)
    * [Secure workspace resources](how-to-secure-workspace-vnet.md)
    * [Secure training environment](how-to-secure-training-vnet.md)
    * [Secure inference environment](./how-to-secure-inferencing-vnet.md)
    * [Use studio in a secured virtual network](how-to-enable-studio-virtual-network.md)
    * [Use custom DNS](how-to-custom-dns.md)
    * [Configure firewall](how-to-access-azureml-behind-firewall.md)

<a id="encryption-at-rest"></a><a id="azure-blob-storage"></a>

## Data encryption

Azure Machine Learning uses a variety of compute resources and data stores on the Azure platform. To learn more about how each of these supports data encryption at rest and in transit, see [Data encryption with Azure Machine Learning](concept-data-encryption.md).

## Data exfiltration prevention

Azure Machine Learning has several inbound and outbound network dependencies. Some of these dependencies can expose a data exfiltration risk by malicious agents within your organization. These risks are associated with the outbound requirements to Azure Storage, Azure Front Door, and Azure Monitor. For recommendations on mitigating this risk, see the [Azure Machine Learning data exfiltration prevention](how-to-prevent-data-loss-exfiltration.md) article.

## Vulnerability scanning

[Microsoft Defender for Cloud](../security-center/security-center-introduction.md) provides unified security management and advanced threat protection across hybrid cloud workloads. For Azure Machine Learning, you should enable scanning of your [Azure Container Registry](../container-registry/container-registry-intro.md) resource and Azure Kubernetes Service resources. For more information, see [Azure Container Registry image scanning by Defender for Cloud](../security-center/defender-for-container-registries-introduction.md) and [Azure Kubernetes Services integration with Defender for Cloud](../security-center/defender-for-kubernetes-introduction.md).

## Audit and manage compliance

[Azure Policy](../governance/policy/index.yml) is a governance tool that allows you to ensure that Azure resources are compliant with your policies. You can set policies to allow or enforce specific configurations, such as whether your Azure Machine Learning workspace uses a private endpoint. For more information on Azure Policy, see the [Azure Policy documentation](../governance/policy/overview.md). For more information on the policies specific to Azure Machine Learning, see [Audit and manage compliance with Azure Policy](how-to-integrate-azure-policy.md).

## Next steps

* [Azure Machine Learning best practices for enterprise security](/azure/cloud-adoption-framework/ready/azure-best-practices/ai-machine-learning-enterprise-security)
* [Use Azure Machine Learning with Azure Firewall](how-to-access-azureml-behind-firewall.md)
* [Use Azure Machine Learning with Azure Virtual Network](how-to-network-security-overview.md)
* [Data encryption at rest and in transit](concept-data-encryption.md)
* [Build a real-time recommendation API on Azure](/azure/architecture/reference-architectures/ai/real-time-recommendation)
