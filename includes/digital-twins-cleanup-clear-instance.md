---
author: baanders
description: include file for clearing the models, twins, and relationships from an Azure Digital Twins instance
ms.service: digital-twins
ms.topic: include
ms.date: 10/3/2023
ms.author: baanders
---

* If you want to continue using the Azure Digital Twins instance from this article, but clear out **all** of its models, twins, and relationships, run the following CLI command: 

    ```azure-cli
    az dt job deletion create -n <name-of-Azure-Digital-Twins-instance> -y
    ```
    
    If you only want to delete **some** of the data elements, you can use the [az dt twin relationship delete](/cli/azure/dt/twin/relationship#az-dt-twin-relationship-delete), [az dt twin delete](/cli/azure/dt/twin#az-dt-twin-delete), and [az dt model delete](/cli/azure/dt/model#az-dt-model-delete) commands to selectively delete only the elements you want to remove.