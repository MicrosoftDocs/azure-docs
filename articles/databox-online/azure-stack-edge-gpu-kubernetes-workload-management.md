---
title: Understand Kubernetes workload management on Azure Stack Edge device| Microsoft Docs
description: Describes how Kubernetes workloads can be managed on your Azure Stack Edge device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 08/12/2020
ms.author: alkohli
---

# Kubernetes workload management on your Azure Stack Edge device

On your Azure Stack Edge device, a Kubernetes cluster is created when you configure compute role. Once the Kubernetes cluster is created, then containerized applications can be deployed on the Kubernetes cluster in Pods. There are distinct ways to deploy workloads in your Kubernetes cluster. 

This article describes the various methods that can be used to deploy workloads on your Azure Stack Edge device.

## Workload types

The two common types of workloads that you can deploy on your Azure Stack Edge device are stateless applications or stateful applications.

- **Stateless applications** do not preserve their state and save no data to persistent storage. All of the user and session data stays with the client. Some examples of stateless applications include web frontends like Nginx, and other web applications.

    You can create a Kubernetes Deployment to deploy a stateless application on your cluster. 

- **Stateful applications** require that their state be saved. Stateful applications use persistent storage, such as persistent volumes, to save data for use by the server or by other users. Examples of stateful applications include databases like MongoDB.

    You can create a Kubernetes Deployment to deploy a stateful application. 

## Namespaces types

Kubernetes resources, such as pods and deployments, are logically grouped into a namespace. These groupings provide a way to logically divide a Kubernetes cluster and restrict access to create, view, or manage resources. Users can only interact with resources within their assigned namespaces.

Namespaces are intended for use in environments with many users spread across multiple teams, or projects. For clusters with a few to tens of users, you should not need to create or think about namespaces at all. Start using namespaces when you need the features they provide.

For more information, see [Kubernetes namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/).


Your Azure Stack Edge device has the following namespaces:

- **System namespace** - This namespace is where core resources exist, such as network features like DNS and proxy, or the Kubernetes dashboard. You typically don't deploy your own applications into this namespace. Use this namespace to debug any Kubernetes cluster issues. 

    There are multiple system namespaces on your device and the names corresponding to these system namespaces are reserved. Here is a list of the reserved system namespaces: 
	- kube-system
	- metallb-system
	- dbe-namespace
	- default
	- kubernetes-dashboard
	- default
	- kube-node-lease
	- kube-public
	- iotedge
	- azure-arc

    Make sure to not use any reserved names for user namespaces that you create. 
<!--- **default namespace** - This namespace is where pods and deployments are created by default when none is provided and you have admin access to this namespace. When you interact with the Kubernetes API, such as with `kubectl get pods`, the default namespace is used when none is specified.-->

- **User namespace** - These are the namespaces that you can create via **kubectl** to locally deploy applications.
 
- **IoT Edge namespace** - You connect to this `iotedge` namespace to deploy applications via IoT Edge.

- **Azure Arc namespace** - You connect to this `azure-arc` namespace to deploy applications via Azure Arc.

 
## Deployment types

There are three primary ways of deploying your workloads. Each of these deployment methodologies allows you to connect to a distinct namespace on the device and then deploy stateless or stateful applications.

![Kubernetes workload deployment](./media/azure-stack-edge-gpu-kubernetes-workload-management/kubernetes-workload-management-1.png)

- **Local deployment**: This is through command-line access tool such as `kubectl` that allows you to deploy K8 `yamls`. You connect to the K8 cluster on your Azure Stack Edge that you create by using the `kubeconfig` file. For more information, go to [Access a Kubernetes cluster via kubectl](azure-stack-edge-gpu-create-kubernetes-cluster.md).

- **IoT Edge deployment**: This is through IoT Edge, which connects to the Azure IoT Hub. You connect to the K8 cluster on your Azure Stack Edge device via the `iotedge` namespace. The IoT Edge agents deployed in this namespace are responsible for connectivity to Azure. You apply the `IoT Edge deployment.json` configuration using Azure DevOps CI/CD. Namespace and IoT Edge management is done through cloud operator.

- **Azure/Arc deployment**: Azure Arc is a hybrid management tool that will allow you to deploy applications on your K8 clusters. You connect the K8 cluster on your Azure Stack Edge device via the `azure-arc namespace`.  Agents are deployed in this namespace that are responsible for connectivity to Azure. You apply the deployment configuration by using the GitOps-based configuration management. Azure Arc will also allow you to use Azure Monitor for containers to view and monitor your clusters. For more information, go to [What is Azure-Arc enabled Kubernetes?](https://docs.microsoft.com/azure/azure-arc/kubernetes/overview).

## Choose the deployment type

While deploying applications, consider the following information:

- **Single or multiple types**: You can choose a single deployment option or a mix of different deployment options.
- **Cloud versus local**: Depending on your applications, you can choose local deployment via kubectl or cloud deployment via IoT Edge and Azure Arc. 
    - Local deployment is more suited for development scenarios. When you choose a local deployment, you are restricted to the network in which your Azure Stack Edge device is deployed.
    - If you have a cloud agent that you can deploy, you should deploy your cloud operator and use cloud management.
- **IoT vs Azure Arc**: Choice of deployment also depends on the intent of your product scenario. If you are deploying applications or containers that have deeper integration with IoT or IoT ecosystem, then you should pick the IoT Edge way of deploying applications. If you have existing Kubernetes deployments, Azure Arc would be the preferred choice.


## Next steps

To locally deploy an app via kubectl, see:

- [Deploy a stateless application on your Azure Stack Edge via kubectl](azure-stack-edge-placeholder.md).

To deploy an app via IoT Edge, see:

- [Deploy a sample module on your Azure Stack Edge via IoT Edge](azure-stack-edge-placeholder.md).

To deploy an app via Azure Arc, see:

- [Deploy an application using Azure Arc](azure-stack-edge-placeholder.md).
