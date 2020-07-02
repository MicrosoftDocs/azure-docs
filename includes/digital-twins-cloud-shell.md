---
author: baanders
description: include file for Azure Digital Twins - set up Cloud Shell and the IoT extension
ms.service: digital-twins
ms.topic: include
ms.date: 5/25/2020
ms.author: baanders
---

[!INCLUDE [cloud-shell-try-it.md](cloud-shell-try-it.md)]

### Set up Cloud Shell session

After opening a Cloud Shell window, the first thing to do is log in and set the shell context to your subscription for this session. Run these commands in your Cloud Shell:

```azurecli
az login
az account set --subscription <your-Azure-subscription-ID>
```

If this is the first time you've used this subscription with Azure Digital Twins, run this command to register with the Azure Digital Twins namespace. (If you're not sure, it's ok to run it again even if you've done it sometime in the past.)

```azurecli
az provider register --namespace 'Microsoft.DigitalTwins'
```

Next you'll add the [**Microsoft Azure IoT Extension for Azure CLI**](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot?view=azure-cli-latest) to your Cloud Shell, to enable commands for interacting with Azure Digital Twins and other IoT services. 

First, run this command to see a list of all the extensions you already have installed.

```azurecli-interactive
az extension list
```

In the output, look for the `"name"` field for each list entry to see the names of the extensions.

Use the output to determine which of the following commands to run for the extension setup (you may run more than one).
* If the list contains `azure-iot`: You have the extension already. Run this command to make sure you have the latest update:

   ```azurecli-interactive
   az extension update --name azure-iot
   ```

* If the list does **not** contain `azure-iot`: You need to install the extension. Use this command:

    ```azurecli-interactive
    az extension add --name azure-iot
    ```

* If the list contains `azure-iot-cli-ext`: This is the legacy version of the extension. Only one version of the extension should be installed at a time, so you should uninstall the legacy extension. Use this command:

   ```azurecli-interactive
   az extension remove --name azure-cli-iot-ext
   ```

Now you are ready to work with Azure Digital Twins in the Cloud Shell.

You can verify this by running `az dt -h` at any time to see a list of the top-level Azure Digital Twins commands that are available.