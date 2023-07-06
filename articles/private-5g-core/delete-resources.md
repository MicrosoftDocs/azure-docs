---
title: Delete Azure Private 5G Core resources
titleSuffix: Azure Private 5G Core
description: In this how-to guide, you'll learn how to delete all Azure Private 5G Core resources.
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 07/07/2023
ms.custom: template-how-to
---

# Delete Azure Private 5G Core resources

In this how-to guide, you'll learn how to delete all resources associated with Azure Private 5G Core (AP5GC). This includes Azure Stack Edge (ASE) resources that are required to deploy AP5GC.

If you want to delete your entire AP5GC deployment, you must complete all sections of this guide in order. You can also follow one or more sections to delete a subset of the resources in your deployment.

If you want to move resources instead, see [Move your private mobile network resources to a different region](region-move-private-mobile-network-resources.md).

> [!CAUTION]
> This procedure will destroy your AP5GC deployment. You will lose all data associated with your AP5GC deployment. Do not delete resources that are in use. Consult your support representative before following any part of this procedure.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.
- Make a note of the resource group that contains your private mobile network that was collected in [Collect the required information to deploy a private mobile network](collect-required-information-for-private-mobile-network.md).

## Delete private mobile network resources

The private mobile network resources represent your private 5G core network. If you followed the recommendations in this documentation when creating your resources, you should have a single resource group containing all private mobile network resources. You must ensure that you do not delete any unrelated resources.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the resource group containing the private mobile network resources.
1. Select **Delete resource group**. You will be prompted to enter the resource group name to confirm deletion.
1. Select **Yes** when prompted to delete the resource group.

## Delete the custom location

The custom location resource represents the physical location of the hardware that runs the packet core software.

1. Navigate to the resource group overview in the Azure portal (for the resource group containing the packet core).
1. Select the **Packet Core Control Plane** resource and select **Modify packet core**.
1. Set **Azure Arc Custom Location** to **None** and select **Modify**.
1. Navigate to the resource group containing the **Custom location** resource.
1. Select the tick box for the **Custom location** resource and select **Delete**.
1. Confirm the deletion.

## Delete the AKS cluster

The Azure Kubernetes Service (AKS) cluster is an orchestration layer used to manage the packet core software components. To delete the Azure Kubernetes Service (AKS) connected cluster, follow [Remove the Azure Kubernetes service](https://learn.microsoft.com/azure/databox-online/azure-stack-edge-deploy-aks-on-azure-stack-edge#remove-the-azure-kubernetes-service).

## Reset ASE

 Azure Stack Edge (ASE) hardware runs the packet core software at the network edge. To reset your ASE device, follow [Reset and reactivate your Azure Stack Edge device](https://learn.microsoft.com/azure/databox-online/azure-stack-edge-reset-reactivate-device)

## Next steps

- To create a new AP5GC deployment, refer to [Commission the AKS cluster](commission-cluster.md) and [Deploy a private mobile network through Azure Private 5G Core - Azure portal](how-to-guide-deploy-a-private-mobile-network-azure-portal.md).
