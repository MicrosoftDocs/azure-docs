---
title: 'Quickstart: Create a Windows-based Azure Kubernetes Service (AKS) cluster using Terraform'
description: In this quickstart, you create an Azure Kubernetes cluster with a default node pool and a separate Windows node pool.
ms.author: schaffererin
author: schaffererin
ms.topic: quickstart
ms.date: 07/15/2024
ms.custom: devx-track-terraform
ms.service: azure-kubernetes-service
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
#customer intent: As a Terraform user, I want to see how to create an Azure Kubernetes cluster with a Windows node pool.
---

# Quickstart: Create a Windows-based Azure Kubernetes Service (AKS) cluster using Terraform

In this quickstart, you create an Azure Kubernetes cluster with a Windows node pool using Terraform. Azure Kubernetes Service (AKS) is a managed container orchestration service provided by Azure. It simplifies the deployment, scaling, and operations of containerized applications. The service uses Kubernetes, an open-source system for automating the deployment, scaling, and management of containerized applications. The Windows node pool allows you to run Windows containers in your Kubernetes cluster.

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

> [!div class="checklist"]
> * Generate a random resource group name.
> * Create an Azure resource group.
> * Create an Azure virtual network.
> * Create an Azure Kubernetes cluster.
> * Create an Azure Kubernetes cluster node pool.

## Prerequisites

- Create an Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-aks-cluster-windows). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-aks-cluster-windows/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code.
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-aks-cluster-windows/providers.tf":::

1. Create a file named `main.tf` and insert the following code.
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-aks-cluster-windows/main.tf":::

1. Create a file named `variables.tf` and insert the following code.
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-aks-cluster-windows/variables.tf":::

1. Create a file named `outputs.tf` and insert the following code.
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-aks-cluster-windows/outputs.tf":::

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

Run [kubectl get](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) to print the cluster's nodes.

```bash
kubectl get node -o wide
```

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot).

## Next steps

> [!div class="nextstepaction"]
> [See more articles about Azure kubernetes cluster](/azure/aks)
