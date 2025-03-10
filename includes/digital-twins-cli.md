---
author: baanders
description: include file for Azure Digital Twins - set up CLI and the IoT extension
ms.service: azure-digital-twins
ms.topic: include
ms.date: 03/07/2025
ms.author: baanders
---

### Set up CLI session

To start working with Azure Digital Twins in the CLI, the first thing to do is sign in and set the CLI context to your subscription for this session. Run these commands in your CLI window:

```azurecli-interactive
az login
az account set --subscription "<your-Azure-subscription-ID>"
```

> [!TIP]
> You can also use your subscription name instead of the ID in the previous command. 

If you're using this subscription with Azure Digital Twins for the first time, run the following command to register with the Azure Digital Twins namespace. (If you're not sure, it's ok to run it again even if you ran it sometime in the past.)

```azurecli-interactive
az provider register --namespace 'Microsoft.DigitalTwins'
```

Next you add the [Microsoft Azure IoT Extension for Azure CLI](/cli/azure/service-page/azure%20iot?view=azure-cli-latest&preserve-view=true), to enable commands for interacting with Azure Digital Twins and other IoT services. Run this command to make sure you have the latest version of the extension:

```azurecli-interactive
az extension add --upgrade --name azure-iot
```

Now you're ready to work with Azure Digital Twins in the Azure CLI.

You can verify this status by running `az dt --help` at any time to see a list of the top-level Azure Digital Twins commands that are available.