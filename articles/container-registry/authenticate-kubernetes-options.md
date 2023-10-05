---
title: Scenarios to authenticate with Azure Container Registry from Kubernetes 
description: Overview of options and scenarios to authenticate to an Azure container registry from a Kubernetes cluster to pull container images
ms.topic: article
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
---

# Scenarios to authenticate with Azure Container Registry from Kubernetes


You can use an Azure container registry as a source of container images for Kubernetes, including clusters you manage, managed clusters hosted in [Azure Kubernetes Service (AKS)](../aks/intro-kubernetes.md) or other clouds, and "local" Kubernetes configurations such as [minikube](https://minikube.sigs.k8s.io/) and [kind](https://kind.sigs.k8s.io/). 

To pull images to your Kubernetes cluster from an Azure container registry, an authentication and authorization mechanism needs to be established. Depending on your cluster environment, choose one of the following methods:

## Scenarios

| Kubernetes cluster |Authentication method  | Description  | Example | 
|---------|---------|---------|----------|
| AKS cluster |AKS managed identity    |  Enable the AKS kubelet [managed identity](../aks/use-managed-identity.md) to pull images from an attached Azure container registry.<br/><br/> Registry and cluster must be in same Active Directory tenant but can be in the same or a different Azure subscription.      | [Authenticate with Azure Container Registry from Azure Kubernetes Service](../aks/cluster-container-registry-integration.md?toc=/azure/container-registry/toc.json&bc=/azure/container-registry/breadcrumb/toc.json)| 
| AKS cluster | AKS service principal     | Enable the [AKS service principal](../aks/kubernetes-service-principal.md) with permissions to a target Azure container registry.<br/><br/>Registry and cluster can be in the same or a different Azure subscription or Azure Active Directory tenant.        | [Pull images from an Azure container registry to an AKS cluster in a different AD tenant](authenticate-aks-cross-tenant.md)
| Kubernetes cluster other than AKS |Pod [imagePullSecrets](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)   |  Use general Kubernetes mechanism to manage registry credentials for pod deployments.<br/><br/>Configure AD service principal, repository-scoped token, or other supported [registry credentials](container-registry-authentication.md).  | [Pull images from an Azure container registry to a Kubernetes cluster using a pull secret](container-registry-auth-kubernetes.md) | 



## Next steps

* Learn more about how to [authenticate with an Azure container registry](container-registry-authentication.md)
