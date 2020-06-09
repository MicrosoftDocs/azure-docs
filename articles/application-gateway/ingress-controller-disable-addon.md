---
title: Disable and re-enable AGIC add-on for AKS cluster
description: This article provides information on how to disable and re-enable the AGIC add-on for your AKS cluster
services: application-gateway
author: caya
ms.service: application-gateway
ms.topic: article
ms.date: 06/10/2020
ms.author: caya
---

# Disable and re-enable AGIC add-on for your AKS cluster
Application Gateway Ingress Controller (AGIC) deployed as an AKS add-on allows you to enable and disable the add-on with one line in Azure CLI. When you disable the AGIC add-on, the behavior of the Application Gateway will differ depending on if the Application Gateway was created by the AGIC add-on, or if it was deployed separately from the AGIC add-on. You can re-enable the AGIC add-on if you ever disable the AGIC add-on, or if you have an existing AKS cluster and Application Gateway that you want to enable the AGIC add-on with. 

## Disabling AGIC add-on with Application Gateway deployed by AGIC add-on
If the AGIC add-on automatically deployed the Application Gateway for you when you first set everything up, then disabling the AGIC add-on will by default delete the Application Gateway. There are two criteria that the AGIC add-on looks for when you disable the add-on:
1. Is the Application Gateway that the AGIC add-on is associated with deployed in the MC_* node resource group? 
2. Does the Application Gateway that the AGIC add-on is associated with have the tag "created-by: ingress-appgw"? 

If both criteria are met, then the AGIC add-on will delete the Application Gateway it created; however, it won't delete the public IP or the subnet in which the Application Gateway was deployed with/in. If the first criteria is not met, then it won't matter if the Application Gateway has the "created-by: ingress-appgw" tag - disabling the add-on won't delete the Application Gateway. Likewise, if the second criteria is not met, then disabling the add-on won't delete the Application Gateway in the MC_* node resource group. 

If you ever want to disable the AGIC add-on but the associated Application Gateway meets both criteria and you don't want the add-on to delete your Application Gateway, then deleting the "created-by: ingress-appgw" tag will prevent the add-on from deleting your Application Gateway. 

To disable the AGIC add-on, run the following command: 
```azurecli-interactive
az aks disable-addons -n <AKS-cluster-name> -g <AKS-resource-group-name> -a ingress-appgw 
```

## Enable AGIC add-on with existing Application Gateway and AKS Cluster
If you ever disable the AGIC add-on and need to re-enable the add-on, or want to enable the add-on using an existing Application Gateway and AKS cluster, then run the following command:

```azurecli-interactive
appgwId=$(az network application-gateway show -n <application-gateway-name> -g <resource-group-name> -o tsv --query "id") 
az aks enable-addons -n <AKS-cluster-name> -g <AKS-cluster-resource-group> -a ingress-appgw --appgw-id $appgwId
```

For more details on how to enable the AGIC add-on using an existing Application Gateway and AKS cluster, see [AGIC add-on brownfield deployment](tutorial-ingress-controller-add-on-existing.md).