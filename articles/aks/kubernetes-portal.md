---
title: Access Kubernetes resources from the Azure portal
description: Learn how to interact with Kubernetes resources to manage an Azure Kubernetes Service (AKS) cluster from the Azure portal.
services: container-service
author: laurenhughes
ms.topic: article
ms.date: 08/05/2020
ms.author: lahugh
---

# Access Kubernetes resources from the Azure portal (Preview)

The Azure portal now includes a Kubernetes resource viewer (preview) for easy access to the Kubernetes resources in your Azure Kubernetes Service (AKS) cluster. Viewing Kubernetes resources from the Azure portal reduces context switching between the Azure portal and the Kubernetes dashboard, streamlining the experience for viewing and editing your Kubernetes resources. The preview phase includes multiple resource types, such as deployments, pods, and replica sets.

The Kubernetes resource view from the Azure portal replaces the [AKS dashboard add-on][kubernetes-dashboard], which is set for deprecation.

[!INCLUDE [preview](/includes/preview/preview-callout.md)]

## Prerequisites

To view Kubernetes resources in the Azure portal, you need an AKS cluster running Kubernetes version 1.18 or later.

AKS clusters running Kubernetes 1.19 or greater will no longer support installation of the managed `kube-dashboard` add-on. For more information on the deprecation of the AKS dashboard add-on, see the [Kubernetes web dashboard in AKS][kubernetes-dashboard].

## View Kubernetes resources

To see the Kubernetes resources, navigate to your AKS cluster in the Azure portal. The navigation pane on the left is used to access your resources.

:::image type="content" source="media/kubernetes-portal/portal-services.png" alt-text="Kubernetes services displayed in the Azure portal.":::

In this sample AKS cluster, the Azure Vote application from the [AKS quickstart][portal-quickstart] was deployed. The portal shows both Kubernetes Services that were created: the internal service (azure-vote-back), and the external service (azure-vote-front) to access the Azure Vote application. The external service includes a linked external IP address so you can quickly view your application in your browser.

### Monitor deployment insights

AKS clusters with Azure Monitor for containers enabled can quickly view deployment insights. From the Kubernetes resources view, users can see the live status of individual deployments, including CPU and memory usage, as well as transition to Azure monitor for more in-depth information. Here's an example of deployment insights from a sample AKS cluster:

:::image type="content" source="media/kubernetes-portal/deployment-insights.png" alt-text="Deployment insights displayed in the Azure portal.":::

## Edit YAML

The Kubernetes resource view also includes a YAML editor. A built-in YAML editor means you can update or create services and deployments from within the portal and apply changes immediately.

:::image type="content" source="media/kubernetes-portal/service-editor.png" alt-text="YAML editor for a Kubernetes service displayed in the Azure portal.":::

After editing the YAML, changes are applied by selecting **Review + save**, confirming the changes, and then saving again.

## Troubleshooting

This section addresses some common problems and troubleshooting steps.

### Unauthorized access

To access the Kubernetes resources, you must have access to the AKS cluster. Ensure that you are either a cluster administrator or a user with the appropriate permissions to access the AKS cluster. For more information on cluster security, see [Access and identity options for AKS][concepts-identity].

### Enable resource view

You may need to enable the Kubernetes resource view. To enable the resource view, follow the prompts in the portal for your cluster.

## Next steps

This article showed you how to access Kubernetes resources for your AKS cluster. See [Deployments and YAML manifests][deployments] for a deeper understanding of cluster resources and the YAML files that are accessed with the Kubernetes resource viewer.

<!-- LINKS - internal -->
[kubernetes-dashboard]: [kubernetes-dashboard.md]
[concepts-identity]: [concepts-identity.md]
[portal-quickstart]: [kubernetes-walkthrough-portal#run-the-application]
[deployments]: [concepts-clusters-workloads#deployments-and-yaml-manifests]
