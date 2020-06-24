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

Next you'll add the [**Microsoft Azure IoT Extension for Azure CLI**](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot?view=azure-cli-latest) to your Cloud Shell, to enable commands for interacting with Azure Digital Twins and other IoT services. Use this command to add the extension:

   ```azurecli-interactive
   az extension add --name azure-iot
   ```

If you've installed the extension in the past, the output may say "Extension 'azure-iot' is already installed." If this happens, run the following to make sure you have the latest update: 

   ```azurecli-interactive
   az extension update --name azure-iot
   ```

Now you are ready to work with Azure Digital Twins in the Cloud Shell.

You can verify this by running `az dt -h` at any time to see a list of the top-level Azure Digital Twins commands that are available.