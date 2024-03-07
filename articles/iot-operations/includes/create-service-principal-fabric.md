---
title: include file
description: include file
author: dominicbetts
ms.topic: include
ms.date: 12/18/2023
ms.author: dobett
---

To create a service principal that gives your pipeline access to your Microsoft Fabric workspace:

1. Use the following Azure CLI command to create a service principal.

    ```azurecli
    az ad sp create-for-rbac --name <YOUR_SP_NAME> 
    ```

1. The output of this command includes an `appId`, `displayName`, `password`, and `tenant`. Make a note of these values to use when you configure access to your Fabric workspace, create a secret, and configure a pipeline destination:

    ```json
    {
        "appId": "<app-ID>",
        "displayName": "<name>",
        "password": "<client-secret>",
        "tenant": "<tenant-ID>"
    }
    ```
