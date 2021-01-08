---
title: include file
description: include file
services: azure-netapp-files
author: b-juche
ms.service: azure-netapp-files
ms.topic: include
ms.date: 09/10/2019
ms.author: b-juche
ms.custom: include file
---

1. Specify the subscription that has been approved for Azure NetApp Files:
    
    ```azurecli-interactive
    az account set --subscription <subscriptionId>
    ```

1. Register the Azure Resource Provider: 
    
    ```azurecli-interactive
    az provider register --namespace Microsoft.NetApp --wait  
    ```