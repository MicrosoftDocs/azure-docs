---
title: Introduction to Kubernetes compute target in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning Kubernetes compute enable Azure Machine Learning across different infrastructures in cloud and on-premises
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: conceptual
author: bozhong68
ms.author: bozhlin
ms.reviewer: ssalgado
ms.custom: devplatv2, ignite-fall-2021, event-tier1-build-2022, ignite-2022
ms.date: 12/22/2023
#Customer intent: As part of ML Professionals focusing on ML infratrasture setup using self-managed compute, I want to understand what Kubernetes compute target is used for and what benefits it proves.
---

# Introduction to Kubernetes compute target in Azure Machine Learning

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

With Azure Machine Learning CLI/Python SDK v2, Azure Machine Learning introduced a new compute target - Kubernetes compute target. You can easily enable an existing **Azure Kubernetes Service** (AKS) cluster or **Azure Arc-enabled Kubernetes** (Arc Kubernetes) cluster to become a Kubernetes compute target in Azure Machine Learning, and use it to train or deploy models. 

:::image type="content" source="./media/how-to-attach-kubernetes-to-workspace/machine-learning-anywhere-overview.png" alt-text="Diagram illustrating how Azure Machine Learning connects to Kubernetes." lightbox="./media/how-to-attach-kubernetes-to-workspace/machine-learning-anywhere-overview.png":::
 
In this article, you learn about:
> [!div class="checklist"]
> * How it works
> * Usage scenarios
> * Recommended best practices
> * KubernetesCompute and legacy AksCompute

## How it works

Azure Machine Learning Kubernetes compute supports two kinds of Kubernetes cluster:
* **[AKS cluster](https://azure.microsoft.com/services/kubernetes-service/)** in Azure. With your self-managed AKS cluster in Azure, you can gain security and controls to meet compliance requirement and flexibility to manage teams' ML workload.
* **[Arc Kubernetes cluster](../azure-arc/kubernetes/overview.md)** outside of Azure. With Arc Kubernetes cluster, you can train or deploy models in any infrastructure on-premises, across multicloud, or the edge. 

With a simple cluster extension deployment on AKS or Arc Kubernetes cluster, Kubernetes cluster is seamlessly supported in Azure Machine Learning to run training or inference workload. It's easy to enable and use an existing Kubernetes cluster for Azure Machine Learning workload with the following simple steps:

1. Prepare an [Azure Kubernetes Service cluster](../aks/learn/quick-kubernetes-deploy-cli.md) or [Arc Kubernetes cluster](../azure-arc/kubernetes/quickstart-connect-cluster.md).
1. [Deploy the Azure Machine Learning extension](how-to-deploy-kubernetes-extension.md).
1. [Attach Kubernetes cluster to your Azure Machine Learning workspace](how-to-attach-kubernetes-to-workspace.md).
1. Use the Kubernetes compute target from CLI v2, SDK v2, and the Studio UI.

**IT-operation team**. The IT-operation team is responsible for the first three steps: prepare an AKS or Arc Kubernetes cluster, deploy Azure Machine Learning cluster extension, and attach Kubernetes cluster to Azure Machine Learning workspace. In addition to these essential compute setup steps, IT-operation team also uses familiar tools such as Azure CLI or kubectl to take care of the following tasks for the data-science team:

- Network and security configurations, such as outbound proxy server connection or Azure firewall configuration, inference router (azureml-fe) setup, SSL/TLS termination, and virtual network configuration.
- Create and manage instance types for different ML workload scenarios and gain efficient compute resource utilization.
- Trouble shooting workload issues related to Kubernetes cluster.

**Data-science team**. Once the IT-operations team finishes compute setup and compute target(s) creation, the data-science team can discover a list of available compute targets and instance types in Azure Machine Learning workspace. These compute resources can be used for training or inference workload. Data science specifies compute target name and instance type name using their preferred tools or APIs. For example, these names could be Azure Machine Learning CLI v2, Python SDK v2, or Studio UI.

## Kubernetes usage scenarios

With Arc Kubernetes cluster, you can build, train, and deploy models in any infrastructure on-premises and across multicloud using Kubernetes. This opens some new use patterns previously not possible in cloud setting environment. The following table provides a summary of the new use patterns enabled by Azure Machine Learning Kubernetes compute:

| Usage pattern | Location of data | Motivation | Infra setup & Azure Machine Learning implementation |
| ----- | ----- | ----- | ----- |
Train model in cloud, deploy model on-premises | Cloud | Make use of cloud compute. Either because of elastic compute needs or special hardware such as a GPU.<br/>Model must be deployed on-premises because of security, compliance, or latency requirements | 1. Azure managed compute in cloud.<br/>2. Customer managed Kubernetes on-premises.<br/>3. Fully automated MLOps in hybrid mode, including training and model deployment steps transitioning seamlessly from cloud to on-premises and vice versa.<br/>4. Repeatable, with all assets tracked properly. Model retrained when necessary, and model deployment updated automatically after retraining. |
| Train model on-premises and cloud, deploy to both cloud and on-premises | Cloud | Organizations wanting to combine on-premises investments with cloud scalability. Bring cloud and on-premises compute under single pane of glass. Single source of truth for data is located in cloud, can be replicated to on-premises (that is, lazily on usage or proactively). Cloud compute primary usage is when on-premises resources aren't available (in use, maintenance) or don't have specific hardware requirements (GPU). | 1. Azure managed compute in cloud.<br />2. Customer managed Kubernetes on-premises.<br />3. Fully automated MLOps in hybrid mode, including training and model deployment steps transitioning seamlessly from cloud to on-premises and vice versa.<br />4. Repeatable, with all assets tracked properly. Model retrained when necessary, and model deployment updated automatically after retraining.|
| Train model on-premises, deploy model in cloud | On-premises | Data must remain on-premises due to data-residency requirements.<br/>Deploy model in the cloud for global service access or for compute elasticity for scale and throughput. | 1. Azure managed compute in cloud.<br/>2. Customer managed Kubernetes on-premises.<br/>3. Fully automated MLOps in hybrid mode, including training and model deployment steps transitioning seamlessly from cloud to on-premises and vice versa.<br/>4. Repeatable, with all assets tracked properly. Model retrained when necessary, and model deployment updated automatically after retraining. |
| Bring your own AKS in Azure | Cloud | More security and controls.<br/>All private IP machine learning to prevent data exfiltration. | 1. AKS cluster behind an Azure virtual network.<br/>2. Create private endpoints in the same virtual network for Azure Machine Learning workspace and its associated resources.<br/>3. Fully automated MLOps. |
| Full ML lifecycle on-premises | On-premises | Secure sensitive data or proprietary IP, such as ML models and code/scripts. | 1. Outbound proxy server connection on-premises.<br/>2. Azure ExpressRoute and Azure Arc private link to Azure resources.<br/>3. Customer managed Kubernetes on-premises.<br/>4. Fully automated MLOps. |

### Limitations

`KubernetesCompute` target in Azure Machine Learning workloads (training and model inference) has the following limitations:
* The availability of **Preview features** in Azure Machine Learning isn't guaranteed.
    * Identified limitation: Models (including the foundational model) from the **Model Catalog** aren't supported on Kubernetes online endpoints.

## Recommended best practices

**Separation of responsibilities between the IT-operations team and data-science team**. As we mentioned in the previous section, managing your own compute and infrastructure for ML workload is a complex task. It's best to be done by IT-operations team so data-science team can focus on ML models for organizational efficiency.

**Create and manage instance types for different ML workload scenarios**. Each ML workload uses different amounts of compute resources such as CPU/GPU and memory. Azure Machine Learning implements instance type as Kubernetes custom resource definition (CRD) with properties of nodeSelector and resource request/limit. With a carefully curated list of instance types, IT-operations can target ML workload on specific node(s) and manage compute resource utilization efficiently.

**Multiple Azure Machine Learning workspaces share the same Kubernetes cluster**. You can attach Kubernetes cluster multiple times to the same Azure Machine Learning workspace or different Azure Machine Learning workspaces, creating multiple compute targets in one workspace or multiple workspaces. Since many customers organize data science projects around Azure Machine Learning workspace, multiple data science projects can now share the same Kubernetes cluster. This significantly reduces ML infrastructure management overheads and IT cost saving.

**Team/project workload isolation using Kubernetes namespace**. When you attach Kubernetes cluster to Azure Machine Learning workspace, you can specify a Kubernetes namespace for the compute target. All workloads run by the compute target are placed under the specified namespace.

## KubernetesCompute and legacy AksCompute

With Azure Machine Learning CLI/Python SDK v1, you can deploy models on AKS using AksCompute target. Both KubernetesCompute target and AksCompute target support AKS integration, however they support it differently. The following table shows their key differences:

|Capabilities  |AKS integration with AksCompute (legacy)  |AKS integration with KubernetesCompute|
|--|--|--|
|CLI/SDK v1 | Yes | No|
|CLI/SDK v2 | No | Yes|
|Training | No | Yes|
|Real-time inference | Yes | Yes |
|Batch inference | No | Yes |
|Real-time inference new features | No new features development | Active roadmap |

With these key differences and overall Azure Machine Learning evolution to use SDK/CLI v2, Azure Machine Learning recommends you to use Kubernetes compute target to deploy models if you decide to use AKS for model deployment.

### Other resources

- [Kubernetes version and region availability](./reference-kubernetes.md#supported-kubernetes-version-and-region)
- [Work with custom data storage](./reference-kubernetes.md#azure-machine-learning-jobs-connect-with-custom-data-storage)


### Examples

All Azure Machine Learning examples can be found in [https://github.com/Azure/azureml-examples.git](https://github.com/Azure/azureml-examples).

For any Azure Machine Learning example, you only need to update the compute target name to your Kubernetes compute target, then you're all done. 
* Explore training job samples with CLI v2 - [https://github.com/Azure/azureml-examples/tree/main/cli/jobs](https://github.com/Azure/azureml-examples/tree/main/cli/jobs)
* Explore model deployment with online endpoint samples with CLI v2 - [https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/kubernetes](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/kubernetes)
* Explore batch endpoint samples with CLI v2 - [https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/batch](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/batch)
* Explore training job samples with SDK v2 -[https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs](https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs)
* Explore model deployment with online endpoint samples with SDK v2 -[https://github.com/Azure/azureml-examples/tree/main/sdk/python/endpoints/online/kubernetes](https://github.com/Azure/azureml-examples/tree/main/sdk/python/endpoints/online/kubernetes)

## Next steps

- [Step 1: Deploy Azure Machine Learning extension](how-to-deploy-kubernetes-extension.md)
- [Step 2: Attach Kubernetes cluster to workspace](how-to-attach-kubernetes-to-workspace.md)
- [Create and manage instance types](how-to-manage-kubernetes-instance-types.md)
