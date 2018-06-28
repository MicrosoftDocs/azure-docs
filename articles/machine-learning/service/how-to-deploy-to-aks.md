---
title: Migrate to Azure Machine Learning, general availability
description: Learn how to upgrade or migrate to the generally available version of Azure Machine Learning Services.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: haining
author: haining
ms.date: 07/27/2018
---

# How to deploy web services from Azure Machine Learning Services to Azure Kubernetes Service

In this article, you'll learn how to deploy from Azure Machine Learning Services to [Azure Kubernetes Service](https://azure.microsoft.com/en-us/services/kubernetes-service/) (AKS).

ACI is really cheap and can get provisioned much faster than AKS. And we provide SLA on AKS for prod.
 
THE GIST: (rewrite) If you want to test your models and web services quickly, ACI is the way to go. It can be done in a few minutes with just a 4-6 lines of code.  It is the perfect option for testing deployments.
But, if you want your models and web services for high-scale, production usage, deploy them to AKS. This option offers scalability, SLA, logging, authentication, and more. It only takes about 10 minutes longer and a few more lines of code than ACI. With AKS, you can still test your web services, but its designed to leave them running. 

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- An Azure Machine Learning Workspace and a local project directory. Learn how to get these prerequisites using the [Portal quickstart](quickstart-get-started.md) or [CLI quickstart](quickstart-get-started-with-cli.md)
- A provisioned AKS cluster



## Next steps

