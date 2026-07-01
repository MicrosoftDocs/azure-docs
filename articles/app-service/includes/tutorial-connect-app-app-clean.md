---
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 03/26/2026
ms.devlang: azurecli
ms.custom: azureday1
---

In the preceding steps, you created Azure resources in a resource group. 

1. To delete the resource group, run the following command in the Cloud Shell. This command might take a minute to run.

    ```azurecli-interactive
    az group delete --name myAuthResourceGroup
    ```

1. Use the **Client IDs** that you previously found and made note of in the `Enable authentication and authorization` sections for the back-end and front-end apps.
1. Delete app registrations for both front-end and back-end apps.

    ```azurecli-interactive
    # delete app - do this for both front-end and back-end client ids
    az ad app delete --id <client-id>
    ```
