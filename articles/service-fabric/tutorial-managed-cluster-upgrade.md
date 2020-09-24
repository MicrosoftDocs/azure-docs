---
title: Upgrade a Service Fabric managed cluster (preview)
description: In this tutorial, learn how to upgrade a Service Fabric managed cluster.
ms.topic: tutorial
ms.date: 09/28/2020
---

# Tutorial: Upgrade a Service Fabric managed cluster (preview)

In this tutorial series we will discuss:

> [!div class="checklist"]
> * [How to deploy a Service Fabric managed cluster](tutorial-managed-cluster-deploy.md)
> * [How to scale out a Service Fabric managed cluster](tutorial-managed-cluster-scale.md)
> * [How to add and remove nodes in a Service Fabric managed cluster](tutorial-managed-cluster-add-remove-node-type.md)
> * [How to add a certificate to a Service Fabric managed cluster](tutorial-managed-cluster-certificate.md)
> * How to upgrade your Service Fabric managed cluster

This part of the series covers how to:

> [!div class="checklist"]
> * Upgrade a Service Fabric managed cluster

## Prerequisites

* A Service Fabric managed cluster (see [*Deploy a managed cluster*](tutorial-managed-cluster-deploy.md)).
* [Azure PowerShell 4.7.0](https://docs.microsoft.com/powershell/azure/release-notes-azureps?view=azps-4.7.0&preserve-view=true#azservicefabric) or later (see [*Install Azure PowerShell*](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azps-4.7.0&preserve-view=true)).

## Upgrade a Service Fabric managed cluster

In many instances, Service Fabric clusters are automatically upgraded, and this remains true for Service Fabric managed clusters. For more information see the [Service Fabric Application Upgrade](service-fabric-application-upgrade.md) overview.

## Cleaning Up

Congratulations! You've upgraded a Service Fabric managed cluster. When no longer needed, simply delete the cluster resource or the resource group.

## Next steps

In this step we upgraded a Service Fabric managed cluster. To learn more about client certificate management in Service Fabric managed clusters, see:

> [!div class="nextstepaction"]
> [Add a client certificate to a Service Fabric managed cluster](./tutorial-managed-cluster-certificate.md)
