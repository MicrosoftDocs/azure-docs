---
title: Replicate an AWS EDW workload with KEDA and Karpenter in Azure Kubernetes Service (AKS)
description: Learn how to replicate an AWS EKS event-driven workflow (EDW) workload with KEDA and Karpenter in AKS.
ms.topic: how-to
ms.date: 06/20/2024
author: JnHs
ms.author: jenhayes
---

# Replicate an AWS event-driven workflow (EDW) workload with KEDA and Karpenter in Azure Kubernetes Service (AKS)

In this article, you learn how to replicate an Amazon Web Services (AWS) Elastic Kubernetes Service (EKS) event-driven workflow (EDW) workload with [KEDA](https://keda.sh) and [Karpenter](https://karpenter.sh) in AKS.

This workload is an implementation of the [competing consumers][competing-consumers] pattern using a producer/consumer app that facilitates efficient data processing by separating data production from data consumption. You use KEDA to scale pods running consumer processing and Karpenter to autoscale Kubernetes nodes.

For a more detailed understanding of the AWS workload, see [Scalable and Cost-Effective Event-Driven Workloads with KEDA and Karpenter on Amazon EKS][edw-aws-eks].

## Deployment process

1. [**Understand the conceptual differences**](eks-edw-understand.md): Start by reviewing the differences between AWS and AKS in terms of services, architecture, and deployment.
1. [**Rearchitect the workload**](eks-edw-rearchitect.md): Analyze the existing AWS workload architecture and identify the components or services that you need to redesign to fit AKS. You need to make changes to the workload infrastructure, application architecture, and deployment process.
1. [**Update the application code**](eks-edw-refactor.md): Ensure your code is compatible with Azure APIs, services, and authentication models.
1. [**Prepare for deployment**](eks-edw-prepare.md): Modify the AWS deployment process to use the Azure CLI.
1. [**Deploy the workload**](eks-edw-deploy.md): Deploy the replicated workload in AKS and test the workload to ensure that it functions as expected.

## Prerequisites

- An Azure account. If you don't have one, create a [free account][azure-free] before you begin.
- The **Owner** [Azure built-in role][azure-built-in-roles], or the **User Access Administrator** and **Contributor** built-in roles, on a subscription in your Azure account.
- [Azure CLI][install-cli] version 2.56 or later.
- [Azure Kubernetes Service (AKS) preview extension][aks-preview].
- [jq][install-jq] version 1.5 or later.
- [Python 3][install-python] or later.
- [kubectl][install-kubectl] version 1.21.0 or later
- [Helm][install-helm] version 3.0.0 or later
- [Visual Studio Code][download-vscode] or equivalent.

### Download the Azure application code

The **completed** application code for this workflow is available in our [GitHub repository][github-repo]. Clone the repository to a directory called `aws-to-azure-edw-workshop` on your local machine by running the following command:

```bash
git clone https://github.com/Azure-Samples/aks-event-driven-replicate-from-aws ./aws-to-azure-edw-workshop
```

After you clone the repository, navigate to the `aws-to-azure-edw-workshop` directory and start Visual Studio Code by running the following commands:

```bash
cd aws-to-azure-edw-workshop
code .
```

## Next steps

> [!div class="nextstepaction"]
> [Understand platform differences][eks-edw-understand]

## Contributors

*This article is maintained by Microsoft. It was originally written by the following contributors*:

- Ken Kilty | Principal TPM
- Russell de Pina | Principal TPM
- Jenny Hayes | Senior Content Developer
- Carol Smith | Senior Content Developer
- Erin Schaffer | Content Developer 2

<!-- LINKS -->
[competing-consumers]: /azure/architecture/patterns/competing-consumers
[edw-aws-eks]: https://aws.amazon.com/blogs/containers/scalable-and-cost-effective-event-driven-workloads-with-keda-and-karpenter-on-amazon-eks/
[azure-free]: https://azure.microsoft.com/free/?WT.mc_id=A261C142F
[azure-built-in-roles]: /azure/role-based-access-control/built-in-roles
[install-cli]: /cli/azure/install-azure-cli
[aks-preview]: ./draft.md#install-the-aks-preview-azure-cli-extension
[install-jq]: https://jqlang.github.io/jq/
[install-python]: https://www.python.org/downloads/
[install-kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[install-helm]: https://helm.sh/docs/intro/install/
[download-vscode]: https://code.visualstudio.com/Download
[github-repo]: https://github.com/Azure-Samples/aks-event-driven-replicate-from-aws
[eks-edw-understand]: ./eks-edw-understand.md
