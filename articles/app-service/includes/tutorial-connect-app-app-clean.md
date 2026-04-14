---
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 03/09/2023
ms.devlang: azurecli
ms.custom: azureday1
---

In the preceding steps, you created Azure resources in a resource group. 

1. Delete the resource group by running the following command in the Cloud Shell. This command may take a minute to run.


    ```azurecli-interactive
    az group delete --name myAuthResourceGroup
    ```


1. Use the authentication apps' **Client ID**, you previously found and made note of in the `Enable authentication and authorization` sections for the backend and frontend apps.
1. Delete app registrations for both frontend and backend apps.

    ```azurecli-interactive
    # delete app - do this for both frontend and backend client ids
    az ad app delete --id <client-id>
    ```
