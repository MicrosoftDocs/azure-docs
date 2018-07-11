---
title: Migrate to Azure Machine Learning, general availability
description: Learn how to upgrade or migrate to the latest version of Azure Machine Learning Services.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: raymondl
author: raymondlaghaeian
ms.reviewer: sgilley
ms.date: 07/27/2018
---

# How to deploy web services from Azure Machine Learning Services to Azure Kubernetes Service

You can deploy your trained model as a web service API on either [Azure Container Instances](https://azure.microsoft.com/en-us/services/container-instances/) (ACI) or  [Azure Kubernetes Service](https://azure.microsoft.com/en-us/services/kubernetes-service/) (AKS).

In this article, you'll learn how to deploy on AKS.  AKS offers scalability, @@SLA, logging, authentication, and more. It takes about 10 minutes longer and a few more lines of code than ACI. AKS is designed to leave your web services running while ACI @@???

For initial testing,  [deploy on ACI](how-to-deploy-to-aci.md) instead. ACI is cheaper and can be provisioned much faster than AKS.

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- An Azure Machine Learning Workspace, a local project directory and the Azure Machine Learning SDK for Python installed. Learn how to get these prerequisites using the [Portal quickstart](quickstart-get-started.md).

- A provisioned AKS cluster.  @@NEED LINK TO HOW TO CREATE ONE OF THESE

## Next steps
