---
title: Disable and re-enable Application Gateway Ingress Controller add-on for Azure Kubernetes Service cluster
description: This article provides information on how to disable and re-enable the AGIC add-on for your AKS cluster.
services: application-gateway
author: greg-lindsay
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 9/17/2024
ms.author: greglin
---

# Disable and re-enable the AGIC add-on for your AKS cluster

When you deploy the Application Gateway Ingress Controller (AGIC) as an Azure Kubernetes Service (AKS) add-on, you can enable and disable the add-on with one line in the Azure CLI.

The life cycle of the Azure Application Gateway instance differs when you disable the AGIC add-on, depending on whether you created the Application Gateway instance by using the AGIC add-on or you deployed it separately from the add-on. You can run the same command to re-enable the AGIC add-on if you ever disable it, or to enable the AGIC add-on by using an existing AKS cluster and Application Gateway instance.

## Disable the AGIC add-on with an associated Application Gateway instance

If the AGIC add-on automatically deployed the Application Gateway instance for you when you first set up everything, then disabling the AGIC add-on might delete the Application Gateway instance by default. The AGIC add-on considers two criteria to determine if it should delete the associated Application Gateway instance:

- Is the Application Gateway instance that the AGIC add-on is associated with deployed in the `MC_*` node resource group?
- Does the Application Gateway instance that the AGIC add-on is associated with have the tag `created-by: ingress-appgw`? AGIC uses the tag to determine whether or not the add-on deployed the Application Gateway instance.

If both criteria are met, the AGIC add-on deletes the Application Gateway instance when you disable the add-on. However, the AGIC add-on doesn't delete the public IP address or the subnet in which it deployed the Application Gateway instance.

If the first criterion isn't met, disabling the add-on doesn't delete the Application Gateway instance, even if the instance has the `created-by: ingress-appgw` tag. Likewise, if the second criterion isn't met (that is, the Application Gateway instance lacks that tag), disabling the add-on doesn't delete the Application Gateway instance in the `MC_*` node resource group.

> [!TIP]
> If you don't want the add-on to delete your Application Gateway instance when you disable the add-on, but the instance meets both criteria, remove the `created-by: ingress-appgw` tag.

To disable the AGIC add-on, run the following command:

```azurecli-interactive
az aks disable-addons -n <AKS-cluster-name> -g <AKS-resource-group-name> -a ingress-appgw 
```

## Enable the AGIC add-on on an existing Application Gateway instance and AKS cluster

If you ever disable the AGIC add-on and need to re-enable it, or you want to enable the add-on by using an existing Application Gateway instance and AKS cluster, run the following command:

```azurecli-interactive
appgwId=$(az network application-gateway show -n <application-gateway-name> -g <resource-group-name> -o tsv --query "id") 
az aks enable-addons -n <AKS-cluster-name> -g <AKS-cluster-resource-group> -a ingress-appgw --appgw-id $appgwId
```

## Related content

- For more information on how to enable the AGIC add-on by using an existing Application Gateway instance and AKS cluster, see [this tutorial](tutorial-ingress-controller-add-on-existing.md).
- For information about Application Gateway for Containers, see [What is Application Gateway for Containers?](for-containers/overview.md).
