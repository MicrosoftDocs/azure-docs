---
author: baanders
description: include file for Azure Digital Twins - set up Cloud Shell and the IoT extension
ms.service: digital-twins
ms.topic: include
ms.date: 7/17/2020
ms.author: baanders
---

To start working with Azure Digital Twins in an open [Azure Cloud Shell](https://shell.azure.com) window, the first thing to do is log in and set the shell context to your subscription for this session. Run these commands in your Cloud Shell:

```azurecli-interactive
az login
az account set --subscription "<your-Azure-subscription-ID>"
```
> [!TIP]
> You can also use your subscription name instead of the ID in the command above. 

If this is the first time you've used this subscription with Azure Digital Twins, run this command to register with the Azure Digital Twins namespace. (If you're not sure, it's ok to run it again even if you've done it sometime in the past.)

```azurecli-interactive
az provider register --namespace 'Microsoft.DigitalTwins'
```

Next you'll add the [**Microsoft Azure IoT Extension for Azure CLI**](/cli/azure/ext/azure-iot/iot) to your Cloud Shell, to enable commands for interacting with Azure Digital Twins and other IoT services. 

[!INCLUDE [digital-twins-cloud-shell-extensions.md](digital-twins-cloud-shell-extensions.md)]

Now you are ready to work with Azure Digital Twins in the Cloud Shell.

You can verify this by running `az dt -h` at any time to see a list of the top-level Azure Digital Twins commands that are available.