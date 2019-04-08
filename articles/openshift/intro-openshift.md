---
title: Introduction to Microsoft Azure Red Hat OpenShift
description: Learn the features and benefits of Azure Red Hat OpenShift to deploy and manage container-based applications in Azure.
services: container-service
author: tylermsft
ms.author: twhitney
ms.service: container-service
manager: jeconnoc
ms.topic: overview
ms.date: 005/06/2019
ms.custom: mvc
---

# Microsoft Azure Red Hat OpenShift Service

Microsoft Azure Red Hat OpenShift provides a self-service deployment of fully managed OpenShift clusters that allows you to maintain regulatory compliance while focusing on your application development. Azure Red Hat OpenShift is jointly engineered, operated, and supported by both Microsoft and Red Hat. It provides an integrated support experience. Clusters are deployed into your Azure subscription and are included on your Azure bill.

Master, infrastructure and application nodes are patched, updated, and monitored by Microsoft and Red Hat. Choose your own registry, networking, storage, or CI/CD solutions. Or get going with immediately using built-in solutions automated source code management, container and application builds, deployments, scaling, health management, and more.

There are no virtual machines to operate. No patching is required. Azure Red Hat OpenShift provides an integrated sign-on experience through Azure Active Directory and regulatory compliance with SOC, ISO, PCI DSS, and HIPAA.

Azure Red Hat OpenShift extends Kubernetes. Running containers in production with Kubernetes requires additional tools and resources, such as an image registry, storage management, networking solutions, and logging and monitoring tools, all of which must be versioned and tested together.

Building container-based applications requires even more integration work with middleware, frameworks, databases, and CI/CD tools.

Azure Red Hat OpenShift combines these into a single platform, bringing ease of operations to IT teams while giving application teams what they need to execute.

To get started, complete the [Deploy a Microsoft Red Hat OpenShift cluster on Azure](tutorial-create-cluster.md) tutorial.

## Access, security, and monitoring

For improved security and management, Azure Red Hat OpenShift lets you integrate with Azure Active Directory and use Kubernetes role-based access controls. You can also monitor the health of your cluster and resources.

## Cluster and node

Azure Red Hat OpenShift nodes run on Azure virtual machines. You can connect storage to nodes and pods, upgrade cluster components, and use GPUs.

## Virtual networks and ingress

An AKS cluster can be deployed into an existing virtual network. In this configuration, every pod in the cluster is assigned an IP address in the virtual network, and can directly communicate with other pods in the cluster, and other nodes in the virtual network. Pods can connect also to other services in a peered virtual network, and to on-premises networks over ExpressRoute or site-to-site (S2S) VPN connections.

For more information, see [Create a Microsoft Red Hat OpenShift cluster on Azure](tutorial-create-cluster.md).

## Kubernetes certification

Azure Red Hat OpenShift service has been CNCF certified as Kubernetes conformant.

## Regulatory compliance

Azure Red Hat OpenShift service is compliant with SOC, ISO, PCI DSS, and HIPAA.

## Next steps

Try the [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md) tutorial.