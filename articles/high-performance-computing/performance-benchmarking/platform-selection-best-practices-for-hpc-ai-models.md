---
title: Choose an Azure platform for AI model training and fine-tuning
description: Architecture guidance for selecting the right Azure platform for AI model training, fine-tuning, and inference based on customer requirements.
author: padmalathas
ms.author: padmalathas
ms.topic: concept-article
ms.service: azure-virtual-machines
ms.subservice: hpc
ms.date: 02/12/2026
# Customer intent: "As an HPC administrator, I want to understand the lift and shift process for migrating on-premises infrastructure to the cloud, so that I can efficiently transition workloads while maintaining system performance and management."
---

# Choose an Azure platform for AI model training and fine-tuning

Azure provides multiple platforms for training, fine-tuning, and deploying AI models. Each platform addresses different requirements such as managed fine-tuning of foundation models, full MLOps lifecycle management, HPC-style training with Slurm, or Kubernetes-native portability.

While the Azure Well-Architected Framework (WAF) commonly recommends **Azure Machine Learning** for managed training and MLOps. Other platforms such as **Azure AI Foundry**, **Azure Kubernetes Service (AKS)**, and **Azure CycleCloud** are also valid and recommended depending on the scenario.

The platforms overlap in capability, which can create confusion. This guide focuses on decision clarity rather than prescribing a single correct platform and helps choose the appropriate Azure platform for AI workloads based on workload type, operational model, and customer requirements.



## Architecture and platform options for AI training and fine-tuning

:::image type="content" source="../media/ai-training-platform-decision-guide.png" alt-text="Diagram depicting platform decision tree.":::

### Azure AI Foundry

Choose Azure AI Foundry when you need a managed, end-to-end platform to fine-tune foundation models such as GPT, Llama, or Phi and deploy them safely at scale. 

Azure AI Foundry simplifies fine-tuning without infrastructure management, provides integrated content safety and responsible AI controls, enables faster AI app development through visual prompt flow orchestration. It offers unified access to Azure OpenAI models with customization across the model lifecycle. 

Consider alternatives like Azure Machine Learning for custom training loops or unsupported models, and CycleCloud for Slurm-based workflows.

### Azure Machine Learning

Azure Machine Learning is recommended when you need custom model training with full MLOps lifecycle management. 

It supports experiment tracking for reproducibility, automated training and deployment pipelines to reduce manual effort, and the flexibility to train any model architecture beyond foundation model fine-tuning. 

Azure ML also provides robust model versioning, registration, and governance through its model registry, supporting compliance and audit needs, while offering managed compute so data scientists can focus on modeling rather than infrastructure. It can also attach AKS clusters as compute targets, combining Kubernetes-based training with Azure ML’s orchestration and tracking. 

For simpler foundation model fine-tuning, Azure AI Foundry may be a better fit, while CycleCloud suits Slurm/PBS scheduler needs and AKS is preferred for multi-cloud portability.


### Azure CycleCloud Workspace for Slurm

Azure CycleCloud Workspace for Slurm is recommended when you need HPC‑style AI infrastructure with Slurm, PBS, or Grid Engine schedulers and high‑performance InfiniBand/RDMA networking. 

It enables teams to run distributed, multinode training using familiar Slurm‑based workflows, migrate existing on‑prem HPC workloads to Azure with minimal script changes, and retain full control over cluster configuration and software stacks. 

CycleCloud also supports bursting on‑premises HPC environments into Azure, extending existing investments with elastic cloud capacity. If you prefer a fully managed service or require end‑to‑end MLOps pipelines, Azure Machine Learning is a better alternative.


### AKS with partner solutions

AKS with partner solutions is recommended when you need a Kubernetes‑native AI platform with multicloud portability or access to a rich partner ecosystem. 

AKS enables consistent AI training and deployment across Azure, on‑premises, and other clouds, while supporting any custom or emerging ML framework through container‑native workflows. 

Partner integrations add significant value on AKS. Anyscale simplifies Ray‑based distributed training at scale while Run:ai optimizes GPU scheduling and utilization to help reduce costs. Kubeflow provides open‑source ML pipelines that avoid proprietary lock‑in. Volcano enables HPC‑style batch scheduling on Kubernetes. 

Consider alternatives if you want integrated experiment tracking and MLOps pipelines, where Azure Machine Learning may be a better fit, or if InfiniBand networking is required, in which case CycleCloud is preferred.

### Comparing platforms for AI training

The following table compares Azure platforms commonly used for AI training and deployment, highlighting how each aligns with different workload requirements, operational models, and infrastructure preferences.

| Capability | AI Foundry | Azure ML | CycleCloud | AKS |
|------------|:----------:|:--------:|:----------:|:---:|
| Foundation model fine-tuning | Built-in, managed | Supported | Requires custom setup | Requires custom setup |
| Custom model training | Supported (scoped scearios) | Native supported | Fully supported | Fully supported |
| Experiment tracking | Built-in | Built-in | Not available | Support via MLflow |
| MLOps pipelines | Prompt flow-based | Native pipelines | Not available | Support via Kubeflow |
| Slurm/PBS scheduler | Not supported | Not supported | Native support | Not supported |
| InfiniBand networking | Not supported | Limited support | Native support | Configurable |
| Kubernetes-native | No | No  | No | Yes |
| Multi-cloud portable | No | No  | No | Yes |

## Decision guide

**Enterprise foundation model tuning and deployment**

For scenarios focused on fine‑tuning and deploying foundation models, Azure AI Foundry provides an end‑to‑end managed experience. It supports a streamlined path from model customization to deployment, with built‑in safety and governance features that reduce operational complexity for enterprise LLM applications.

**Custom machine learning with full MLOps**

Teams building and training custom machine learning models benefit from Azure Machine Learning, which supports experiment tracking, pipeline automation, and model lifecycle management. When combined with Azure Kubernetes Service (AKS) for inference, this approach enables scalable, production‑ready deployments while maintaining strong MLOps practices.

**HPC‑driven AI training workflows**

Research and HPC teams with existing Slurm expertise can use Azure CycleCloud to run large‑scale training workloads using familiar schedulers and workflows. Models trained in these environments can be registered in Azure Machine Learning for downstream deployment, enabling teams to extend HPC investments while integrating with enterprise AI platforms.

**Portable and Kubernetes‑native AI platforms**

Organizations prioritizing portability and platform consistency across environments can adopt AKS with partner solutions such as Anyscale or GPU scheduling platforms. This Kubernetes‑native approach supports multi‑cloud strategies and ecosystem flexibility, while requiring teams to manage more of the operational responsibility compared to fully managed services.


> [!IMPORTANT]
> Azure Machine Learning can attach AKS as compute, but can't attach Azure CycleCloud. When you need both Azure ML capabilities and Slurm scheduling, design architectures that use data integration between separate platforms.


## Multi-platform architectures

For complex implementations and enterprise architectures, you can combine platforms.

- Enterprise LLM applications benefit from an end‑to‑end managed approach using Azure AI Foundry for both fine‑tuning and deployment, simplifying the model lifecycle and reducing operational overhead.

- For custom machine learning workloads that require Kubernetes-based serving, Azure Machine Learning handles training and MLOps while AKS provides scalable, production‑grade inference.

- HPC teams can leverage existing expertise by training models with CycleCloud, then registering and deploying them through Azure Machine Learning to integrate with enterprise AI workflows.

- Organizations pursuing a multi‑cloud AI strategy can use AKS with Anyscale for training and AKS for inference, enabling a portable, Kubernetes‑native architecture across environments.


Platform decisions are trade‑offs, not absolutes, and should be guided by workload demands, scale requirements, and the maturity of the teams supporting them.


## Related resources

- [Well-Architected Framework: Azure Machine Learning](/azure/well-architected/service-guides/azure-machine-learning)
- [Cloud Adoption Framework: HPC landing zone](/azure/cloud-adoption-framework/scenarios/azure-hpc/ready)
- [Anyscale on Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/anaborsa1627581675015.anyscale)
- [Run:ai on Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/run-ai.runai-cluster)
