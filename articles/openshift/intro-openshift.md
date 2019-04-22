---
title: Introduction to Azure Red Hat OpenShift | Microsoft Docs
description: Learn the features and benefits of Microsoft Azure Red Hat OpenShift to deploy and manage container-based applications.
services: container-service
author: tylermsft
ms.author: twhitney
ms.service: container-service
manager: jeconnoc
ms.topic: overview
ms.date: 05/06/2019
ms.custom: mvc
---

# Azure Red Hat OpenShift

The Microsoft *Azure Red Hat OpenShift* service enables you to deploy fully managed [OpenShift](https://www.openshift.com/) clusters, allowing you to maintain regulatory compliance while you stay focused on application development.

Azure Red Hat OpenShift extends [Kubernetes](https://kubernetes.io/). Running containers in production with Kubernetes requires additional tools and resources, such as an image registry, storage management, networking solutions, and logging and monitoring tools, all of which must be versioned and tested together. Building container-based applications requires even more integration work with middleware, frameworks, databases, and CI/CD tools. Azure Red Hat OpenShift combines all this into a single platform, bringing ease of operations to IT teams while giving application teams what they need to execute.

Azure Red Hat OpenShift is jointly engineered, operated, and supported by Red Hat and Microsoft to provide an integrated support experience. There are no virtual machines to operate, and no patching is required. Master, infrastructure and application nodes are patched, updated, and monitored on your behalf by Red Hat and Microsoft. Your Azure Red Hat OpenShift clusters are deployed into your Azure subscription and are included on your Azure bill.

You can choose your own registry, networking, storage, and CI/CD solutions, or use the built-in solutions for automated source code management, container and application builds, deployments, scaling, health management, and more.

 Azure Red Hat OpenShift provides an integrated sign-on experience through Azure Active Directory and regulatory compliance with SOC, ISO, PCI DSS, and HIPAA.

To get started, complete the [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md) tutorial.

## Access, security, and monitoring

For improved security and management, Azure Red Hat OpenShift lets you integrate with Azure Active Directory (Azure AD) and use Kubernetes role-based access control (RBAC). You can also monitor the health of your cluster and resources.

## Cluster and node

Azure Red Hat OpenShift nodes run on Azure virtual machines. You can connect storage to nodes and pods, upgrade cluster components, and use GPUs.

## Virtual networks and ingress

You can deploy an Azure Red Hat OpenShift cluster into an existing virtual network. In this configuration, every pod in the cluster is assigned an IP address in the virtual network and can directly communicate with other pods in the cluster and other nodes in the virtual network. Pods can also connect to other services in a peered virtual network, and to on-premises networks over [ExpressRoute](https://docs.microsoft.com/en-us/azure/expressroute/) or site-to-site (S2S) VPN connections.

For more information, see [Create a Microsoft Red Hat OpenShift cluster on Azure](tutorial-create-cluster.md).

## Kubernetes certification

Azure Red Hat OpenShift service has been CNCF certified as Kubernetes conformant.

## Regulatory compliance

Azure Red Hat OpenShift service is compliant with SOC, ISO, PCI DSS, and HIPAA.

## Next steps

Learn the prerequisites for Azure Red Hat OpenShift:

> [!div class="nextstepaction"]
> [Set up your dev environment](howto-setup-environment.md)