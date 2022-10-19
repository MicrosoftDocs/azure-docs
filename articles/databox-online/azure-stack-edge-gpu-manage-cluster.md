---
title: Cluster management on your two-node Azure Stack Edge device
description: Describes how to manage your Azure Stack Edge two-node device cluster.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 06/15/2022
ms.author: alkohli
---

# Manage your Azure Stack Edge cluster

This article provides a brief overview of clustering-related management tasks on your Azure Stack Edge device. Some of these tasks include how to add a node, configure or modify a cluster witness or remove the cluster. The cluster can be managed via the local UI of your device. 

## Undo node preparation

Perform these steps on the node of the device that you were trying to prepare. You may use the undo node preparation option when you decide not to proceed with preparing this node to form a cluster.

1. In the local UI, go to the **Get started** page. Under **Prepare a node for clustering**, select **Undo node preparation**.

    ![Screenshot of local web U I Get started page when Preparing a node for clustering with Undo node preparation is selected.](./media/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy/undo-node-preparation-1.png)

1. When you select **Undo node preparation**, you'll go back to the **Get authentication token** tile and **Prepare node** option will be available. If you decide to prepare this node again, you'll need to select **Prepare node** again.

    ![Screenshot of local web U I Get started page when Preparing a node for clustering with Prepare node is selected in Get authentication token tile.](./media/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy/undo-node-preparation-2.png)

## View existing nodes

1. In the local UI, go to the **Cluster** page. 
1. Under **Existing nodes**, you can view the existing nodes for your cluster.

    ![Screenshot of local web U I Cluster page with the Modify option selected for Cluster witness on first node -1.](./media/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy/view-cluster-nodes-1.png)

## Replace a node

You may need to replace a node if one of the nodes on your device is down or not healthy. Perform these steps on the node that you're trying to replace.

1. In the local UI, go to the **Cluster** page. Under **Existing nodes**, view the status of the nodes. You'll want to replace the node that shows the status as **Down**.

    ![Screenshot of local web U I Cluster page with the Existing nodes option displaying a node status as Down.](./media/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy/replace-node-1.png)

1. Select **Replace node** and enter the following inputs.

    a. Choose the node to replace. This should be automatically selected as the node, which is down. 
    
    b. Prepare another node. Configure the networking on this node in the same way as you set up on the first node. Get the node serial number and authentication token from the new incoming node.
    
    c. Provide the **Node serial number** for the incoming replacement node.
    
    d. Supply the **Node token** for the incoming replacement node.
    
    e. Select **Validate & add**. The credentials of the incoming node are now validated.
    
    ![Screenshot of local web U I Cluster page with Apply selected on the Validate & add blade.](./media/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy/replace-node-2.png)

    f. Once the validation has successfully completed, select **Add node** to complete the node replacement. It may take several minutes for the replacement node to get added to form the cluster.


## Configure cluster witness

Follow these steps to configure the cluster witness.

### Configure cloud witness

Perform these steps on the first node of the device.

1. In the local UI, go to the **Cluster** page. Under **Cluster witness type**, select **Modify**.

    ![Screenshot of local web U I Cluster page with Modify option selected for Cluster witness on first node - 2.](./media/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy/add-cluster-witness-1m.png)

1. In the **Modify cluster witness** blade, enter the following inputs.
    1. Choose the **Witness type** as **Cloud.**
    1. Enter the **Azure Storage account name**.
    1. Specify Storage account authentication from Access key or SAS token.
    1. If you chose Access key as the authentication mechanism, enter the Access key of the Storage account, Azure Storage container where the witness lives, and the service endpoint. 
    1. Select **Apply**.

    ![Screenshot of local web U I Cluster page with cloud witness type selected in the Modify cluster witness blade on first node.](./media/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy/add-cluster-witness-cloud-1.png)

### Configure local witness

Perform these steps on the first node of the device.

1. In the local UI, go to the **Cluster** page. Under **Cluster witness type**, select **Modify**.

    ![Screenshot of local web U I Cluster page with Modify option selected for Cluster witness on first node - 3.](./media/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy/add-cluster-witness-1m.png)

1. In the **Modify cluster witness** blade, enter the following inputs.
    1. Choose the **Witness type** as **Local.**
    1. Enter the file share path as *//server/fileshare* format.
    1. Select **Apply**. 

    ![Screenshot of local web U I Cluster page with local witness type selected in the Modify cluster witness blade on first node.](./media/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy/add-cluster-witness-local-1.png)


## Configure virtual IPs

For Azure consistent services and NFS, you'll also need to define a virtual IP that allows you to connect to a clustered device as opposed to a specific node. A virtual IP is an available IP in the cluster network and any client connecting to the cluster network on the two-node device should be able to access this IP.


### For Azure Consistent Services

For Azure Consistent Services, follow these steps to configure virtual IP.

1. In the local UI on the **Cluster** page, under the **Virtual IP settings** section, select **Azure Consistent Services**. 

    ![Screenshot of local web U I Cluster page with Azure Consistent Services selected for Virtual I P Settings on first node.](./media/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy/configure-azure-consistent-services-1m.png)

1. In the **Virtual IP settings** blade, input the following.

    1. From the dropdown list, select the **Azure Consistent Services network**. 
    1. Choose IP settings from **DHCP** or **static**.
    1. If you chose IP settings as static, enter a virtual IP. This should be a free IP from within the Azure Consistent Services network that you specified. If you selected DHCP, a virtual IP is automatically picked from the Azure Consistent Services network that you selected.
1. Select **Apply**.

    ![Screenshot of local web U I Cluster page with Virtual I P Settings blade configured for Azure consistent services on first node.](./media/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy/configure-azure-consistent-services-2.png)


### For Network File System

For clients connecting via NFS protocol to the two-node device, follow these steps to configure virtual IP.

1. In the local UI on the **Cluster** page, under the **Virtual IP settings** section, select **Network File System**.

    ![Screenshot of local web U I Cluster page with Network File System selected for Virtual I P Settings on first node.](./media/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy/configure-network-file-system-1m.png)

1. In the **Virtual IP settings** blade, input the following.

    1. From the dropdown list, select the **NFS network**.
    1. Choose IP settings from **DHCP** or **Static**.
    1. If you chose IP settings as static, enter a virtual IP. This should be a free IP from within the NFS network that you specified. If you selected DHCP, a virtual IP is automatically picked from the NFS network that you selected.
1. Select **Apply**.

    ![Screenshot of local web U I Cluster page with Virtual I P Settings blade configured for N F S on first node.](./media/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy/configure-network-file-system-2.png)

> [!NOTE]
> Virtual IP settings are required. If you do not configure this IP, you will be blocked when configuring the **Device settings** in the next step.

## Remove the cluster

In this release, the only way to remove or destroy the cluster is to reset the device.

> [!NOTE]
> To remove the cluster, you need to reset only one device node. In this release, if a reset is triggered on one node in a two-node cluster, it will trigger reset on both the nodes in the cluster.

Follow these steps to reset the device:

1. In the local web UI of your first device node, go to **Maintenance > Device reset**.
1. Select **Reset device**.
1. On the **Confirm  reset** dialog, enter **Yes** and select **Yes** to continue with the device reset. Resetting the device will delete all the local data on the device.

The reset process will take approximately 35-40 minutes. 


## Next steps

- Learn about [VM sizes and types for Azure Stack Edge Pro GPU](azure-stack-edge-gpu-virtual-machine-sizes.md).


