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

In this how-to guide, you'll learn how to delete all resources associated with Azure Private 5G Core (AP5GC). This includes Azure Stack Edge (ASE) resources that are required to deploy AP5GC. You should do this only when advised by your Microsoft support representative; for example, if your deployment has encountered an unrecoverable error.

If you want to delete your entire AP5GC deployment, you must complete all sections of this guide in order or you may be left with resources that cannot be deleted without intervention from Microsoft. You can also follow one or more sections to delete a subset of the resources in your deployment.

If you want to move resources instead, see [Move your private mobile network resources to a different region](region-move-private-mobile-network-resources.md).

> [!CAUTION]
> This procedure will destroy your AP5GC deployment. You will lose all data that isn't backed up. Do not delete resources that are in use.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.
- Make a note of the resource group that contains your private mobile network, which was collected in [Collect the required information to deploy a private mobile network](collect-required-information-for-private-mobile-network.md).
- Make a note of the resource group that contains your Azure Stack Edge and custom location resources.

## Back up deployment information

All data will be lost when deleting your deployment. Back up any information you'd like to preserve. You can use this information to help set up a new deployment.

1. Refer to [Collect the required information for your SIMs](provision-sims-azure-portal.md#collect-the-required-information-for-your-sims) to take a backup of all the information you'll need to recreate your SIMs.
1. Depending on your authentication method when signing in to the [distributed tracing](distributed-tracing.md) and [packet core dashboards](packet-core-dashboards.md):

    - If you use Microsoft Entra ID, save a copy of the Kubernetes Secret Object YAML file you created in [Create Kubernetes Secret Objects](enable-azure-active-directory.md#create-kubernetes-secret-objects).
    - If you use local usernames and passwords and want to keep using the same credentials, save a copy of the current passwords to a secure location.

1. If you want to retain any traces, [export and save](distributed-tracing-share-traces.md#export-trace-from-the-distributed-tracing-web-gui) them securely before continuing.
1. Refer to [Exporting a dashboard](https://grafana.com/docs/grafana/v6.1/reference/export_import/#exporting-a-dashboard) in the Grafana documentation to save a backed-up copy of your dashboards.

## Delete private mobile network resources

The private mobile network resources represent your private 5G core network. If you followed the recommendations in this documentation when creating your resources, you should have a single resource group containing all private mobile network resources. You must ensure that you do not delete any unrelated resources.

> [!IMPORTANT]
> Deleting this resource group will delete the resources for all sites in your deployment. If you only want to delete a single site, see [Delete sites using the Azure portal](delete-a-site.md). You can then return to this procedure to delete the custom location, delete the AKS cluster and reset ASE if required.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the resource group containing the private mobile network resources.
1. Select **Delete resource group**. You will be prompted to enter the resource group name to confirm deletion.
1. Select **Yes** when prompted to delete the resource group.

## Delete the custom location

The custom location resource represents the physical location of the hardware that runs the packet core software.

1. Navigate to the resource group containing the **Custom location** resource.
1. Select the tick box for the **Custom location** resource and select **Delete**.
1. Confirm the deletion.

If you are deleting multiple sites, repeat this step for each site.

## Delete the AKS cluster

The Azure Kubernetes Service (AKS) cluster is an orchestration layer used to manage the packet core software components. To delete the Azure Kubernetes Service (AKS) connected cluster, follow [Remove the Azure Kubernetes service](/azure/databox-online/azure-stack-edge-deploy-aks-on-azure-stack-edge#remove-the-azure-kubernetes-service).

If you are deleting multiple sites, repeat this step for each site.

## Reset ASE

 Azure Stack Edge (ASE) hardware runs the packet core software at the network edge. To reset your ASE device, follow [Reset and reactivate your Azure Stack Edge device](/azure/databox-online/azure-stack-edge-reset-reactivate-device).

If you are deleting multiple sites, repeat this step for each site.

## Next steps

To create a new AP5GC deployment, refer to [Commission the AKS cluster](commission-cluster.md) and [Deploy a private mobile network through Azure Private 5G Core - Azure portal](how-to-guide-deploy-a-private-mobile-network-azure-portal.md).

Once you have created a new deployment, complete the following steps to restore the data you backed up in [Back up deployment information](#back-up-deployment-information).

1. Retrieve your backed-up SIM information and recreate your SIMs by following one of:

    - [Provision new SIMs for Azure Private 5G Core - Azure portal](provision-sims-azure-portal.md)
    - [Provision new SIMs for Azure Private 5G Core - ARM template](provision-sims-arm-template.md)

1. Depending on your authentication method when signing in to the [distributed tracing](distributed-tracing.md) and [packet core dashboards](packet-core-dashboards.md):

    - If you use Microsoft Entra ID, [reapply the Secret Object for distributed tracing and the packet core dashboards](enable-azure-active-directory.md#apply-kubernetes-secret-objects).
    - If you use local usernames and passwords, follow [Access the distributed tracing web GUI](distributed-tracing.md#access-the-distributed-tracing-web-gui) and [Access the packet core dashboards](packet-core-dashboards.md#access-the-packet-core-dashboards) to restore access to your local monitoring tools.

1. If you backed up any packet core dashboards, follow [Importing a dashboard](https://grafana.com/docs/grafana/v6.1/reference/export_import/#importing-a-dashboard) in the Grafana documentation to restore them.
