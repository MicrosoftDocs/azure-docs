---
author: baanders
description: include file for Azure Digital Twins - set up latest IoT extension
ms.service: digital-twins
ms.topic: include
ms.date: 7/31/2020
ms.author: baanders
---

First, run this command to see a list of all the extensions you already have installed.

```azurecli
az extension list
```

The output is an array of all the extensions you currently have. Look for the `"name"` field for each list entry to see the names of the extensions.

Use the output to determine which of the following commands to run for the extension setup (you may run more than one).
* If the list contains `azure-iot`: You have the extension already. Run this command to make sure you have the latest update and there are no more updates available:

   ```azurecli
   az extension update --name azure-iot
   ```

* If the list does **not** contain `azure-iot`: You need to install the extension. Use this command:

    ```azurecli
    az extension add --name azure-iot
    ```

* If the list contains `azure-iot-cli-ext`: This is the legacy version of the extension. Only one version of the extension should be installed at a time, so you should uninstall the legacy extension. Use this command:

   ```azurecli
   az extension remove --name azure-cli-iot-ext
   ```