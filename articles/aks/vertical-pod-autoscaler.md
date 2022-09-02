---
title: Vertical Pod Autoscaling in Azure Kubernetes Service (AKS)
description: Learn how to stop or start an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 08/31/2021
---

# Vertical Pod Autoscaling in Azure Kubernetes Service (AKS)

This article provides an overview of vertical Pod autoscaling (VPA) in Azure Kubernetes Service (AKS), which is based on the open source [Kubernetes](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler) version. When configured, it automatically sets resource requests and limits on containers per workload based on past usage. This ensures pods are scheduled onto nodes which have the required CPU and memory resources.  

## Benefits

Vertical Pod autoscaling provides the following benefits:

* It analyzes and adjusts processor and memory resources to "right size" your applications. VPA is not only responsible for scaling up, but also for scaling down based on their resource use  over time.

* A Pod is evicted if it needs to change its resource requests based on if its scaling mode is set to *auto*.  

* Set CPU and memory constraints for individual containers by specifying a resource policy. 

* Ensures nodes have correct resources for pod scheduling.

* Configurable logging of any 

 improve cluster resource utilization  

 free up CPU and memory for other pod