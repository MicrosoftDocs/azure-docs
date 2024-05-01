---
title: Replicate AWS EKS scaling with KEDA and Karpenter workload in Azure
description: Learn how to replicate the AWS EKS Scaling with KEDA and Karpenter event driven workflow (EDW) workload in Azure.
ms.topic: how-to
ms.date: 05/01/2024
author: JnHs
ms.author: jenhayes
---

# Replicate AWS EKS scaling with KEDA and Karpenter workload in Azure

In this article, you'll learn how to replicate the Amazon Web Services (AWS) Elastic Kubernetes Service (EKS) scaling with KEDA and Karpenter event-driven workflow (EDW) workload in Azure. This workload is an implementation of the producer/consumer pattern that facilitates efficient data processing by separating data production from data consumption. KEDA is used to scale pods running consumer processing and Karpenter is used to auto-scale Kubernetes nodes.

For a more detailed understanding of the AWS workload, see  [Scalable and Cost-Effective Event-Driven Workloads with KEDA and Karpenter on Amazon EKS](https://aws.amazon.com/blogs/containers/scalable-and-cost-effective-event-driven-workloads-with-keda-and-karpenter-on-amazon-eks/).

To replicate this workload from AWS to Azure, follow these basic steps:

1. [Understand the conceptual differences](eks-edw-understand.md): Start by gaining a clear understanding of the differences between AWS and Azure for the workload in terms of services, architecture, and deployment.
1. [Rearchitect the workload](eks-edw-rearchitect.md): Analyze the existing AWS workload architecture and identify the components or services that need to be rearchitected or redesigned to fit Azure. Changes must be made to the workload infrastructure, application architecture, and deployment process.
1. [Refactor the application code](eks-edw-refactor.md): Modify the AWS application code to ensure compatibility with Azure APIs, services, and authentication models. These modifications include rewriting certain parts of the code, updating dependencies, and configuration changes.
1. [Prepare for deployment](eks-edw-prepare.md): Modify the AWS deployment process to use the Azure CLI.
1. [Deploy the workload](eks-edw-deploy.md): Deploy the replicated workload in Azure, and test the workload to ensure that it functions as expected.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Azure CLI v2.56](/cli/azure/install-azure-cli) or later
- [AKS preview extension](/aks/draft#install-the-aks-preview-azure-cli-extension)
- [jq v1.5](https://jqlang.github.io/jq/) or later
- [Python 3](https://www.python.org/downloads/) or later
- [kubectl 1.21.0](https://kubernetes.io/docs/tasks/tools/install-kubectl/) or later
- [Helm v3.0.0](https://helm.sh/docs/intro/install/) or later
- [Visual Studio Code](https://code.visualstudio.com/Download) or equivalent

### Download the AKS application code

> [!IMPORTANT]
> Need to update this and remove AWS repo link!

The AWS event-driven workflow application code is available in the [https://github.com/aws-samples/amazon-eks-scaling-with-keda-and-karpenter](https://github.com/aws-samples/amazon-eks-scaling-with-keda-and-karpenter) repository. Clone the repository to a directory called `aws-to-azure-edw-workshop` on your local machine by running the following command:

```bash
git clone https://github.com/aws-samples/amazon-eks-scaling-with-keda-and-karpenter ./aws-to-azure-edw-workshop
```

Once you have cloned the repository, navigate to the `aws-to-azure-edw-workshop` directory and start Visual Studio Code by running the following commands:

```bash
cd aws-to-azure-edw-workshop
code .
```

## Next steps

- [Understand platform differences for the event-driven workflow (EDW) scaling workload](eks-edw-understand.md).