---
author: b-juche
ms.service: azure-netapp-files
ms.topic: include
ms.date: 11/10/2025
ms.author: anfdocs
ms.custom: include file
---

1. Specify the subscription you're using for Azure NetApp Files:
    
    ```azurecli-interactive
    az account set --subscription <subscriptionID>
    ```

1. Register the Azure Resource Provider: 
    
    ```azurecli-interactive
    az provider register --namespace Microsoft.NetApp --wait  
    ```