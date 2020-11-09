---
title: Enterprise security and governance
titleSuffix: Azure Machine Learning
description: 'Securely use Azure Machine Learning: authentication, authorization, network security, data encryption, and monitoring.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 09/09/2020
---

# Enterprise security and governance for Azure Machine Learning

In this article, you'll learn about security features available for Azure Machine Learning.

When you use a cloud service, a best practice is to restrict access to only the users who need it. Start by understanding the authentication and authorization model used by the service. You might also want to restrict network access or securely join resources in your on-premises network with the cloud. Data encryption is also vital, both at rest and while data moves between services. You may also want to create polices to enforce certain configurations or log when non-compliant configurations are created. Finally, you need to be able to monitor the service and produce an audit log of all activity.

> [!NOTE]
> The information in this article works with the Azure Machine Learning Python SDK version 1.0.83.1 or higher.

## Authentication & authorization

Most authentication to Azure Machine Learning resources use Azure Active Directory (Azure AD) for authentication, and role-based access control (Azure RBAC) for authorization. The exceptions to this are:

* __SSH__: You can enable SSH access to some compute resources such as Azure Machine Learning compute instance. SSH access uses key-based authentication. For more information on creating SSH keys, see [Create and manage SSH keys](../virtual-machines/linux/create-ssh-keys-detailed.md). For information on enabling SSH access, see [Create and manage Azure Machine Learning compute instance](how-to-create-manage-compute-instance.md).
* __Models deployed as web services__: Web service deployments can use __key__ or __token__-based access control. Keys are static strings. Tokens are retrieved by using an Azure AD account. For more information, see [Configure authentication for models deployed as a web service](how-to-authenticate-web-service.md).

Specific services that Azure Machine Learning relies on, such as Azure data storage services, have their own authentication and authorization methods. For more information on the storage services authentication, see [Connect to storage services](how-to-access-data.md).

### Azure AD authentication

Multi-factor authentication is supported if Azure Active Directory (Azure AD) is configured to use it. Here's the authentication process:

1. The client signs in to Azure AD and gets an Azure Resource Manager token.  Users and service principals are fully supported.
1. The client presents the token to Azure Resource Manager and to all Azure Machine Learning.
1. The Machine Learning service provides a Machine Learning service token to the user compute target (for example, Machine Learning Compute). This token is used by the user compute target to call back into the Machine Learning service after the run is complete. Scope is limited to the workspace.

[![Authentication in Azure Machine Learning](media/concept-enterprise-security/authentication.png)](media/concept-enterprise-security/authentication.png#lightbox)

For more information, see [Authentication for Azure Machine Learning workspace](how-to-setup-authentication.md).

### Azure RBAC

You can create multiple workspaces, and each workspace can be shared by multiple people. You can control what features or operations of the workspace users can access by assigning their Azure AD account to Azure RBAC roles. The following are the built-in roles:

* Owner
* Contributor
* Reader

Owners and contributors can use all compute targets and data stores that are attached to the workspace.  

The following table lists some of the major Azure Machine Learning operations and the roles that can perform them:

| Azure Machine Learning operation | Owner | Contributor | Reader |
| ---- |:----:|:----:|:----:|
| Create workspace | ✓ | ✓ | |
| Share workspace | ✓ | |  |
| Create compute target | ✓ | ✓ | |
| Attach compute target | ✓ | ✓ | |
| Attach data stores | ✓ | ✓ | |
| Run experiment | ✓ | ✓ | |
| View runs/metrics | ✓ | ✓ | ✓ |
| Register model | ✓ | ✓ | |
| Create image | ✓ | ✓ | |
| Deploy web service | ✓ | ✓ | |
| View models/images | ✓ | ✓ | ✓ |
| Call web service | ✓ | ✓ | ✓ |

If the built-in roles don't meet your needs, you can create custom roles. Custom roles control all operations inside a workspace, such as creating a compute, submitting a run, registering a datastore, or deploying a model. Custom roles can have read, write, or delete permissions on the various resources of a workspace, such as clusters, datastores, models, and endpoints. You can make the role available at a specific workspace level, a specific resource-group level, or a specific subscription level. For more information, see [Manage users and roles in an Azure Machine Learning workspace](how-to-assign-roles.md).

> [!IMPORTANT]
> Azure Machine Learning depends on other Azure services such as Azure Blob Storage and Azure Kubernetes Services. Each Azure service has its own Azure RBAC configurations. To achieve your desired level of access control, you may need to apply both Azure RBAC configurations for Azure Machine Learning and those for the services used with Azure Machine Learning.

> [!WARNING]
> Azure Machine Learning is supported with Azure Active Directory business-to-business collaboration, but is not currently supported with Azure Active Directory business-to-consumer collaboration.

### Managed identities

Each workspace also has an associated system-assigned [managed identity](../active-directory/managed-identities-azure-resources/overview.md) that has the same name as the workspace. The managed identity is used to securely access resources used by the workspace. It has the following permissions on attached resources:

| Resource | Permissions |
| ----- | ----- |
| Workspace | Contributor |
| Storage account | Storage Blob Data Contributor |
| Key vault | Access to all keys, secrets, certificates |
| Azure Container Registry | Contributor |
| Resource group that contains the workspace | Contributor |
| Resource group that contains the key vault (if different from the one that contains the workspace) | Contributor |

We don't recommend that admins revoke the access of the managed identity to the resources mentioned in the preceding table. You can restore access by using the resync keys operation.

Azure Machine Learning creates an additional application (the name starts with `aml-` or `Microsoft-AzureML-Support-App-`) with contributor-level access in your subscription for every workspace region. For example, if you have one workspace in East US and one in North Europe in the same subscription, you'll see two of these applications. These applications enable Azure Machine Learning to help you manage compute resources.

Optionally, you can configure your own managed identities for use with Azure Virtual Machines and Azure Machine Learning compute cluster. With a VM, the managed identity can be used to access your workspace from the SDK, instead of the individual user's Azure AD account. With a compute cluster, the managed identity is used to access resources such as secured datastores that the user running the training job may not have access to. For more information, see [Authentication for Azure Machine Learning workspace](how-to-setup-authentication.md).

## Network security and isolation

To restrict physical access to Azure Machine Learning resources, you can use Azure Virtual Network (VNet). VNets allow you to create network environments that are partially, or fully, isolated from the public internet. This reduces the attack surface for your solution, as well as the chances of data exfiltration.

For more information, see [Virtual network isolation and privacy overview](how-to-network-security-overview.md).

## Data encryption

Azure Machine Learning uses a variety of compute resources and data stores. To learn more about how each of these supports data encryption at rest and in transit, see [Data encryption with Azure Machine Learning](concept-data-encryption.md).

## Data collection and handling

### Microsoft collected data

Microsoft may collect non-user identifying information like resource names (for example the dataset name, or the machine learning experiment name), or job environment variables for diagnostic purposes. All such data is stored using Microsoft-managed keys in storage hosted in Microsoft owned subscriptions and follows [Microsoft's standard Privacy policy and data handling standards](https://privacy.microsoft.com/privacystatement).

Microsoft also recommends not storing sensitive information (such as account key secrets) in environment variables. Environment variables are logged, encrypted, and stored by us. Similarly when naming [run_id](/python/api/azureml-core/azureml.core.run%28class%29?preserve-view=true&view=azure-ml-py), avoid including sensitive information such as user names or secret project names. This information may appear in telemetry logs accessible to Microsoft Support engineers.

You may opt out from diagnostic data being collected by setting the `hbi_workspace` parameter to `TRUE` while provisioning the workspace. This functionality is supported when using the AzureML Python SDK, CLI, REST APIs, or Azure Resource Manager templates.

### Microsoft-generated data

When using services such as Automated Machine Learning, Microsoft may generate a transient, pre-processed data for training multiple models. This data is stored in a datastore in your workspace, which allows you to enforce access controls and encryption appropriately.

You may also want to encrypt [diagnostic information logged from your deployed endpoint](how-to-enable-app-insights.md) into your Azure Application Insights instance.

## Monitoring

There are several monitoring scenarios with Azure Machine Learning, depending on the role and what is being monitored.

| Role | Monitoring to use |
| ---- | ----- |
| Admin, DevOps, MLOps | Azure Monitor metrics, activity log, vulnerability scanning |
| Data Scientist, MLOps | ???? |

### Azure Monitor

You can use Azure Monitor metrics to view and monitor metrics for your Azure Machine Learning workspace. In the [Azure portal](https://portal.azure.com), select your workspace and then select **Metrics**:

[![Screenshot showing example metrics for a workspace](media/concept-enterprise-security/workspace-metrics.png)](media/concept-enterprise-security/workspace-metrics-expanded.png#lightbox)

The metrics include information on runs, deployments, and registrations.

For more information, see [Metrics in Azure Monitor](../azure-monitor/platform/data-platform-metrics.md).

### Activity log

You can view the activity log of a workspace to see various operations that are performed on the workspace. The log includes basic information like the operation name, event initiator, and timestamp.

This screenshot shows the activity log of a workspace:

[![Screenshot showing the activity log of a workspace](media/concept-enterprise-security/workspace-activity-log.png)](media/concept-enterprise-security/workspace-activity-log-expanded.png#lightbox)

Scoring request details are stored in Application Insights. Application Insights is created in your subscription when you create a workspace. Logged information includes fields such as:

* HTTPMethod
* UserAgent
* ComputeType
* RequestUrl
* StatusCode
* RequestId
* Duration

> [!IMPORTANT]
> Some actions in the Azure Machine Learning workspace don't log information to the activity log. For example, the start of a training run and the registration of a model aren't logged.
>
> Some of these actions appear in the **Activities** area of your workspace, but these notifications don't indicate who initiated the activity.

### Vulnerability scanning

Azure Security Center provides unified security management and advanced threat protection across hybrid cloud workloads. For Azure machine learning, you should enable scanning of your Azure Container Registry resource and Azure Kubernetes Service resources. See [Azure Container Registry image scanning by Security Center](../security-center/defender-for-container-registries-introduction.md) and [Azure Kubernetes Services integration with Security Center](../security-center/defender-for-kubernetes-introduction.md).

## Audit and manage compliance

[Azure Policy](../governance/policy/index.yml) is a governance tool that allows you to ensure that Azure resources are compliant with your policies. With Azure Machine Learning, you can assign the following policies:

* **Customer-managed key**: Audit or enforce whether workspaces must use a customer-managed key.
* **Private link**: Audit whether workspaces use a private endpoint to communicate with a virtual network.

For more information on Azure Policy, see the [Azure Policy documentation](../governance/policy/overview.md).

For more information on the policies specific to Azure Machine Learning, see [Audit and manage compliance with Azure Policy](how-to-integrate-azure-policy.md).

## Resource locks

[!INCLUDE [resource locks](../../includes/machine-learning-resource-lock.md)]

## Next steps

* [Secure Azure Machine Learning web services with TLS](how-to-secure-web-service.md)
* [Consume a Machine Learning model deployed as a web service](how-to-consume-web-service.md)
* [Use Azure Machine Learning with Azure Firewall](how-to-access-azureml-behind-firewall.md)
* [Use Azure Machine Learning with Azure Virtual Network](how-to-network-security-overview.md)
* [Data encryption at rest and in transit](concept-data-encryption.md)
* [Build a real-time recommendation API on Azure](/azure/architecture/reference-architectures/ai/real-time-recommendation)