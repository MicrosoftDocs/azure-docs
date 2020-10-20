---
title: Introduction to Azure Red Hat OpenShift
description: Learn the features and benefits of Microsoft Azure Red Hat OpenShift to deploy and manage container-based applications.
author: jimzim
ms.author: jzim
ms.service: container-service
ms.topic: overview
ms.date: 04/24/2020
ms.custom: mvc
---

# Azure Red Hat OpenShift

The Microsoft *Azure Red Hat OpenShift* service enables you to deploy fully managed [OpenShift](https://www.openshift.com/) clusters.

Azure Red Hat OpenShift extends [Kubernetes](https://kubernetes.io/). Running containers in production with Kubernetes requires additional tools and resources. This often includes needing to juggle image registries, storage management, networking solutions, and logging and monitoring tools - all of which must be versioned and tested together. Building container-based applications requires even more integration work with middleware, frameworks, databases, and CI/CD tools. Azure Red Hat OpenShift combines all this into a single platform, bringing ease of operations to IT teams while giving application teams what they need to execute.

Azure Red Hat OpenShift is jointly engineered, operated, and supported by Red Hat and Microsoft to provide an integrated support experience. There are no virtual machines to operate, and no patching is required. Master, infrastructure, and application nodes are patched, updated, and monitored on your behalf by Red Hat and Microsoft. Your Azure Red Hat OpenShift clusters are deployed into your Azure subscription and are included on your Azure bill.

You can choose your own registry, networking, storage, and CI/CD solutions, or use the built-in solutions for automated source code management, container and application builds, deployments, scaling, health management, and more. Azure Red Hat OpenShift provides an integrated sign-on experience through Azure Active Directory.

To get started, complete the [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md) tutorial.

## Access, security, and monitoring

For improved security and management, Azure Red Hat OpenShift lets you integrate with Azure Active Directory (Azure AD) and use Kubernetes role-based access control (RBAC). You can also monitor the health of your cluster and resources.

## Cluster and node

Azure Red Hat OpenShift nodes run on Azure virtual machines. You can connect storage to nodes and pods and upgrade cluster components.

## Next steps

Learn the prerequisites for Azure Red Hat OpenShift:

> [!div class="nextstepaction"]
> [Set up your dev environment](tutorial-create-cluster.md)
