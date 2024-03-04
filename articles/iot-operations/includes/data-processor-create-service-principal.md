---
 title: include file
 description: include file
 author: dominicbetts
 ms.topic: include
 ms.date: 10/09/2023
 ms.author: dobett
ms.custom:
  - include file
  - ignite-2023
---

1. Use the following Azure CLI command to create a service principal.

    ```bash
    az ad sp create-for-rbac --name <YOUR_SP_NAME> 
    ```

1. The output of this command includes an `appId`, `displayName`, `password`, and `tenant`. Make a note of these values to use when you configure access to your cloud resource such as Microsoft Fabric, create a secret, and configure a pipeline destination:

    ```json
    {
        "appId": "<app-id>",
        "displayName": "<name>",
        "password": "<client-secret>",
        "tenant": "<tenant-id>"
    }
    ```
