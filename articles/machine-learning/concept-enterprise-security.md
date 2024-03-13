---
title: Enterprise security and governance
titleSuffix: Azure Machine Learning
description: 'Securely use Azure Machine Learning: authentication, authorization, network security, data encryption, and monitoring.'
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.custom: build-2023
ms.topic: conceptual
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 09/13/2023
---

# Enterprise security and governance for Azure Machine Learning

In this article, you learn about security and governance features that are available for Azure Machine Learning. These features are useful for administrators, DevOps engineers, and MLOps engineers who want to create a secure configuration that complies with an organization's policies.

With Azure Machine Learning and the Azure platform, you can:

* Restrict access to resources and operations by user account or groups.
* Restrict incoming and outgoing network communications.
* Encrypt data in transit and at rest.
* Scan for vulnerabilities.
* Apply and audit configuration policies.

## Restrict access to resources and operations

[Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md) is the identity service provider for Azure Machine Learning. You can use it to create and manage the security objects (user, group, service principal, and managed identity) that are used to authenticate to Azure resources. Multifactor authentication (MFA) is supported if Microsoft Entra ID is configured to use it.

Here's the authentication process for Azure Machine Learning through MFA in Microsoft Entra ID:

1. The client signs in to Microsoft Entra ID and gets an Azure Resource Manager token.
1. The client presents the token to Azure Resource Manager and to Azure Machine Learning.
1. Azure Machine Learning provides a Machine Learning service token to the user compute target (for example, Machine Learning compute cluster or [serverless compute](./how-to-use-serverless-compute.md)). The user compute target uses this token to call back into the Machine Learning service after the job is complete. The scope is limited to the workspace.

[![Diagram that illustrates authentication in Azure Machine Learning.](media/concept-enterprise-security/authentication.png)](media/concept-enterprise-security/authentication.png#lightbox)

Each workspace has an associated system-assigned [managed identity](../active-directory/managed-identities-azure-resources/overview.md) that has the same name as the workspace. This managed identity is used to securely access resources that the workspace uses. It has the following Azure role-based access control (RBAC) permissions on associated resources:

| Resource | Permissions |
| ----- | ----- |
| Workspace | Contributor |
| Storage account | Storage Blob Data Contributor |
| Key vault | Access to all keys, secrets, certificates |
| Container registry | Contributor |
| Resource group that contains the workspace | Contributor |

The system-assigned managed identity is used for internal service-to-service authentication between Azure Machine Learning and other Azure resources. Users can't access the identity token, and they can't use it to gain access to these resources. Users can access the resources only through [Azure Machine Learning control and data plane APIs](how-to-assign-roles.md), if they have sufficient RBAC permissions.

We don't recommend that admins revoke the access of the managed identity to the resources mentioned in the preceding table. You can restore access by using the [resync keys operation](how-to-change-storage-access-key.md).

> [!NOTE]
> If your Azure Machine Learning workspace has compute targets (for example, compute cluster, compute instance, or Azure Kubernetes Service [AKS] instance) that were created _before May 14, 2021_, you might have an additional Microsoft Entra account. The account name starts with `Microsoft-AzureML-Support-App-` and has contributor-level access to your subscription for every workspace region.
>
> If your workspace doesn't have an AKS instance attached, you can safely delete this Microsoft Entra account.
>
> If your workspace has an attached AKS cluster, and it was created before May 14, 2021, _do not delete this Microsoft Entra account_. In this scenario, you must delete and re-create the AKS cluster before you can delete the Microsoft Entra account.

You can provision the workspace to use a user-assigned managed identity, and then grant the managed identity additional roles. For example, you might grant a role to access your own Azure Container Registry instance for base Docker images.

You can also configure managed identities for use with an Azure Machine Learning compute cluster. This managed identity is independent of the workspace managed identity. With a compute cluster, the managed identity is used to access resources such as secured datastores that the user running the training job might not have access to. For more information, see [Use managed identities for access control](how-to-identity-based-service-authentication.md).

> [!TIP]
> There are exceptions to the use of Microsoft Entra ID and Azure RBAC in Azure Machine Learning:
> * You can optionally enable Secure Shell (SSH) access to compute resources such as an Azure Machine Learning compute instance and a compute cluster. SSH access is based on public/private key pairs, not Microsoft Entra ID. Azure RBAC doesn't govern SSH access.
> * You can authenticate to models deployed as online endpoints by using key-based or token-based authentication. Keys are static strings, whereas tokens are retrieved thorugh a Microsoft Entra security object. For more information, see [Authenticate clients for online endpoints](how-to-authenticate-online-endpoint.md).

For more information, see the following articles:

* [Set up authentication for Azure Machine Learning resources and workflows](how-to-setup-authentication.md)
* [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md)
* [Use datastores](how-to-access-data.md)
* [Use authentication credential secrets in Azure Machine Learning jobs](how-to-use-secrets-in-runs.md)
* [Set up authentication between Azure Machine Learning and other services](how-to-identity-based-service-authentication.md)

## Provide network security and isolation

To restrict network access to Azure Machine Learning resources, you can use an [Azure Machine Learning managed virtual network](how-to-managed-network.md) or an [Azure Virtual Network instance](../virtual-network/virtual-networks-overview.md). Using a virtual network reduces the attack surface for your solution and the chances of data exfiltration.

You don't have to choose one or the other. For example, you can use an Azure Machine Learning managed virtual network to help secure managed compute resources and an Azure Virtual Network instance for your unmanaged resources or to help secure client access to the workspace.

* __Azure Machine Learning managed virtual network__: Provides a fully managed solution that enables network isolation for your workspace and managed compute resources. You can use private endpoints to help secure communication with other Azure services, and you can restrict outbound communication. Use a managed virtual network to help secure the following managed compute resources:

  * Serverless compute (including Spark serverless)
  * Compute cluster
  * Compute instance
  * Managed online endpoint
  * Batch online endpoint

  For more information, see [Workspace managed virtual network isolation](how-to-managed-network.md).

* __Azure Virtual Network instance__: Provides a more customizable virtual network offering. However, you're responsible for configuration and management. You might need to use network security groups, user-defined routes, or a firewall to restrict outbound communication.

  For more information, see the following articles:

  * [Secure Azure Machine Learning workspace resources using virtual networks](how-to-network-security-overview.md)
  * [Secure an Azure Machine Learning workspace with virtual networks](how-to-secure-workspace-vnet.md)
  * [Secure an Azure Machine Learning training environment with virtual networks](how-to-secure-training-vnet.md)
  * [Secure an Azure Machine Learning inferencing environment with virtual networks](./how-to-secure-inferencing-vnet.md)
  * [Use Azure Machine Learning studio in an Azure virtual network](how-to-enable-studio-virtual-network.md)
  * [Use your workspace with a custom DNS server](how-to-custom-dns.md)
  * [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md)

<a id="encryption-at-rest"></a><a id="azure-blob-storage"></a>

## Encrypt data

Azure Machine Learning uses various compute resources and datastores on the Azure platform. To learn more about how each of these resources supports data encryption at rest and in transit, see [Data encryption with Azure Machine Learning](concept-data-encryption.md).

## Prevent data exfiltration

Azure Machine Learning has several inbound and outbound network dependencies. Some of these dependencies can expose a data exfiltration risk by malicious agents within your organization. These risks are associated with the outbound requirements to Azure Storage, Azure Front Door, and Azure Monitor. For recommendations on mitigating this risk, see [Azure Machine Learning data exfiltration prevention](how-to-prevent-data-loss-exfiltration.md).

## Scan for vulnerabilities

[Microsoft Defender for Cloud](../security-center/security-center-introduction.md) provides unified security management and advanced threat protection across hybrid cloud workloads. For Azure Machine Learning, you should enable scanning of your [Azure Container Registry](../container-registry/container-registry-intro.md) resource and AKS resources. For more information, see [Introduction to Microsoft Defender for container registries](../security-center/defender-for-container-registries-introduction.md) and [Introduction to Microsoft Defender for Kubernetes](../security-center/defender-for-kubernetes-introduction.md).

## Audit and manage compliance

[Azure Policy](../governance/policy/index.yml) is a governance tool that helps you ensure that Azure resources comply with your policies. You can set policies to allow or enforce specific configurations, such as whether your Azure Machine Learning workspace uses a private endpoint.

For more information on Azure Policy, see the [Azure Policy documentation](../governance/policy/overview.md). For more information on the policies that are specific to Azure Machine Learning, see [Audit and manage Azure Machine Learning](how-to-integrate-azure-policy.md).

## Next steps

* [Azure Machine Learning best practices for enterprise security](/azure/cloud-adoption-framework/ready/azure-best-practices/ai-machine-learning-enterprise-security)
* [Use Azure Machine Learning with Azure Firewall](how-to-access-azureml-behind-firewall.md)
* [Use Azure Machine Learning with Azure Virtual Network](how-to-network-security-overview.md)
* [Encrypt data at rest and in transit](concept-data-encryption.md)
* [Build a real-time recommendation API on Azure](/azure/architecture/reference-architectures/ai/real-time-recommendation)
