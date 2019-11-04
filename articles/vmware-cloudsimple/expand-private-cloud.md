--- 
title: Expand Azure VMware Solutions (AVS) Private Cloud
description: Describes how to expand an existing AVS Private Cloud to add capacity in an existing or new cluster
author: sharaths-cs
ms.author: b-shsury 
ms.date: 06/06/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# Expand an AVS Private Cloud

AVS provides the flexibility to dynamically expand an AVS Private Cloud. You can begin with a smaller configuration and then expand as you need higher capacity. Or you can create an AVS Private Cloud based on current needs and then expand as consumption grows.

An AVS Private Cloud consists of one or more vSphere clusters. Each cluster can have 3 to 16 nodes. When expanding an AVS Private Cloud, you add nodes to the existing cluster or create a new cluster. To expand an existing cluster, additional nodes must be the same type (SKU) as the existing nodes. For creating a new cluster, the nodes can be of a different type. For more information on AVS Private Cloud limits, see limits section in [AVS private cloud overview](cloudsimple-private-cloud.md) article.

An AVS Private Cloud is created with a default **Datacenter** on vCenter. Each datacenter serves as a top-level management entity. For a new cluster, AVS provides the choice of adding to the existing datacenter or creating a new datacenter.

As part of the new cluster configuration, AVS configures the VMware infrastructure. The settings include storage settings for vSAN disk groups, VMware High Availability, and Distributed Resource Scheduler (DRS).

An AVS Private Cloud can be expanded multiple times. Expansion can be done only when you stay within the overall node limits. Each time you expand an AVS Private Cloud you add to the existing cluster or create a new one.

## Before you begin

Nodes must be provisioned before you can expand your AVS Private Cloud. For more information on provisioning nodes, see [Provision nodes for VMware Solution by AVS - Azure](create-nodes.md) article. For creating a new cluster, you must have at least three available nodes of the same SKU.

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Expand an AVS Private Cloud

1. [Access the AVS portal](access-cloudsimple-portal.md).

2. Open the **Resources** page and select the AVS Private Cloud for which you want to expand.

3. In summary section, click **Expand**.

    ![Expand AVS Private Cloud](media/resources-expand-private-cloud.png)

4. Choose whether to expand your existing cluster or create a new vSphere cluster. As you make changes, the summary information on the page is updated.

    * To expand your existing cluster, click **Expand existing cluster**. Select the cluster you want to expand and enter the number of nodes to add. Each cluster can have a maximum of 16 nodes.
    * To add a new cluster, click **Create new cluster**. Enter a name for the cluster. Select an existing datacenter, or enter a name to create a new datacenter. Choose the node type. You can choose a different node type when creating a new vSphere cluster, but not when expanding an existing vSphere cluster. Select the number of nodes. Each new cluster must have at least three nodes.

    ![Expand AVS Private Cloud - add nodes](media/resources-expand-private-cloud-add-nodes.png)

5. Click **Submit** to expand the AVS Private Cloud.

## Next steps

* [Consume VMware VMs on Azure](quickstart-create-vmware-virtual-machine.md)
* Learn more about [AVS Private Clouds](cloudsimple-private-cloud.md)