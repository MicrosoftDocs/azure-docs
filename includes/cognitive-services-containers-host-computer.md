---
author: IEvangelist
ms.author: dapine
ms.date: 06/25/2019
ms.service: cognitive-services
ms.topic: include
---

The host is a x64-based computer that runs the Docker container. It can be a computer on your premises or a Docker hosting service in Azure, such as:

* [Azure Kubernetes Service](../articles/aks/index.yml).
* [Azure Container Instances](../articles/container-instances/index.yml).
* A [Kubernetes](https://kubernetes.io/) cluster deployed to [Azure Stack](/azure-stack/operator). For more information, see [Deploy Kubernetes to Azure Stack](/azure-stack/user/azure-stack-solution-template-kubernetes-deploy).

### Container requirements and recommendations

The following table describes the minimum and recommended specifications for the Text Analytics containers. At least 2 gigabytes (GB) of memory are required, and each CPU core must be at least 2.6 gigahertz (GHz) or faster. The allowable Transactions Per Section (TPS) are also listed.

|  | Minimum host specs | Recommended host specs | Minimum TPS | Maximum TPS|
|---|---------|-------------|--|--|
| **Language detection, key phrase extraction**   | 1 core, 2GB memory | 1 core, 4GB memory |15 | 30|
| **Sentiment Analysis v3**   | 1 core, 2GB memory | 4 cores, 8GB memory |15 | 30|

CPU core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

