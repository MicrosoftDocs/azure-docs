---
title: Overview of Kubernetes cluster on Microsoft Azure Stack Edge Pro device| Microsoft Docs
description: Describes how Kubernetes is implemented on your Azure Stack Edge Pro device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 08/28/2020
ms.author: alkohli
---

# Kubernetes on your Azure Stack Edge Pro GPU device

Kubernetes is a popular open-source platform to orchestrate containerized applications. This article provides an overview of Kubernetes and then describes how Kubernetes works on your Azure Stack Edge Pro device. 

## About Kubernetes 

Kubernetes provides an  easy and reliable platform to manage container-based applications and their associated networking and storage components. You can rapidly build, deliver, and scale containerized apps with Kubernetes.

As an open platform, you can use Kubernetes to build applications with your preferred programming language, OS libraries, or messaging bus. To schedule and deploy releases, Kubernetes can integrate with existing continuous integration and continuous delivery tools.

For more information, see [How Kubernetes works](https://www.youtube.com/watch?v=q1PcAawa4Bg&list=PLLasX02E8BPCrIhFrc_ZiINhbRkYMKdPT&index=2&t=0s).

## Kubernetes on Azure Stack Edge Pro

On your Azure Stack Edge Pro device, you can create a Kubernetes cluster by configuring the compute. When the compute role is configured, the Kubernetes cluster including the master and worker nodes are all deployed and configured for you. This cluster is then used for workload deployment via `kubectl`, IoT Edge, or Azure Arc.

The Azure Stack Edge Pro device is available as a 1-node configuration that constitutes the infrastructure cluster. The Kubernetes cluster is separate from the infrastructure cluster and is deployed on top of the infrastructure cluster. The infrastructure cluster provides the persistent storage for your Azure Stack Edge Pro device while the Kubernetes cluster is responsible solely for application orchestration. 

The Kubernetes cluster in this case has a master node and a worker node. The Kubernetes nodes in a cluster are virtual machines that run your applications and cloud workflows. 

The Kubernetes master node is responsible for maintaining the desired state for your cluster. The master node also controls the worker node which in turn runs the containerized applications. 

The following diagram illustrates the implementation of Kubernetes on a 1-node Azure Stack Edge Pro device. The 1-node device is not highly available and if the single node fails, the device goes down. The Kubernetes cluster also goes down.

![Kubernetes architecture for a 1-node Azure Stack Edge Pro device](media/azure-stack-edge-gpu-kubernetes-overview/kubernetes-architecture-1-node.png)

For more information on the Kubernetes cluster architecture, go to [Kubernetes core concepts](https://kubernetes.io/docs/concepts/architecture/).


<!--The Kubernetes cluster control plane components make global decisions about the cluster. The control plane has:

- *kubeapiserver* that is the front end of the Kubernetes API and exposes the API.
- *etcd* that is a highly available key value store that backs up all the Kubernetes cluster data.
- *kube-scheduler* that makes scheduling decisions.
- *kube-controller-manager* that runs controller processes such as those for node controllers, replications controllers, endpoint controllers, and service account and token controllers. -->

## Storage volume provisioning

To support application workloads, you can mount storage volumes for persistent data on your Azure Stack Edge Pro device shares. Both static and dynamic volumes can be used. 

For more information, see storage provisioning options for applications in [Kubernetes storage for your Azure Stack Edge Pro device](azure-stack-edge-gpu-kubernetes-storage.md).

## Networking

Kubernetes networking enables you to configure communication within your Kubernetes network including container-to-container networking, pod-to-pod networking, pod-to-service networking, and Internet-to-service networking. For more information, see the networking model in [Kubernetes networking for your Azure Stack Edge Pro device](azure-stack-edge-gpu-kubernetes-networking.md).

## Updates

As new Kubernetes versions become available, your cluster can be upgraded using the standard updates available for your Azure Stack Edge Pro device. For steps on how to upgrade, see [Apply updates for your Azure Stack Edge Pro](azure-stack-edge-gpu-install-update.md).

## Access, monitoring

The Kubernetes cluster on your Azure Stack Edge Pro device  allows role-based access control (RBAC). For more information, see [Role-based access control for Kubernetes cluster on your Azure Stack Edge Pro device](azure-stack-edge-gpu-kubernetes-rbac.md).

You can also monitor the health of your cluster and resources via the Kubernetes dashboard. Container logs are also available. For more information, see [Use the Kubernetes dashboard to monitor the Kubernetes cluster health on your Azure Stack Edge Pro device](azure-stack-edge-gpu-monitor-kubernetes-dashboard.md).

Azure Monitor is also available as an add-on to collect health data from containers, nodes, and controllers. For more information, see [Azure Monitor overview](../azure-monitor/overview.md)

<!--## Private container registry

Kubernetes on Azure Stack Edge Pro device allows for the private storage of your images by providing a local container registry.-->

## Application management

After a Kubernetes cluster is created on your Azure Stack Edge Pro device, you can manage the applications deployed on this cluster via any of the following methods:

- Native access via `kubectl`
- IoT Edge 
- Azure Arc

These methods are explained in the following sections.


### Kubernetes and kubectl

Once the Kubernetes cluster is deployed, then you can manage the applications deployed on the cluster locally from a client machine. You use a native tool such as *kubectl* via the command line to interact with the applications. 

For more information on deploying Kubernetes cluster, go to [Deploy a Kubernetes cluster on your Azure Stack Edge Pro device](azure-stack-edge-gpu-create-kubernetes-cluster.md). For information on management, go to [Use kubectl to manage Kubernetes cluster on your Azure Stack Edge Pro device](azure-stack-edge-gpu-create-kubernetes-cluster.md).


### Kubernetes and IoT Edge

Kubernetes can also be integrated with IoT Edge workloads on Azure Stack Edge Pro device where Kubernetes provides scale and the ecosystem and IoT provides the IoT centric ecosystem. The Kubernetes layer is used as an infrastructure layer to deploy Azure IoT Edge workloads. The module lifetime and network load balancing are managed by Kubernetes whereas the edge application platform is managed by IoT Edge.

For more information on deploying applications on your Kubernetes cluster via IoT Edge, go to: 

- [Expose stateless applications on Azure Stack Edge Pro device via IoT Edge](azure-stack-edge-gpu-deploy-stateless-application-iot-edge-module.md).


### Kubernetes and Azure Arc

Azure Arc is a hybrid management tool that will allow you to deploy applications on your Kubernetes clusters. Azure Arc also allows you to use Azure Monitor for containers to view and monitor your clusters. For more information, go to [What is Azure-Arc enabled Kubernetes?](../azure-arc/kubernetes/overview.md). For information on Azure Arc pricing, go to [Azure Arc pricing](https://azure.microsoft.com/services/azure-arc/#pricing).


## Next steps

- Learn more about Kubernetes storage on [Azure Stack Edge Pro device](azure-stack-edge-gpu-kubernetes-storage.md).
- Understand the Kubernetes networking model on [Azure Stack Edge Pro device](azure-stack-edge-gpu-kubernetes-networking.md).
- Deploy [Azure Stack Edge Pro](azure-stack-edge-gpu-deploy-prep.md) in Azure portal.