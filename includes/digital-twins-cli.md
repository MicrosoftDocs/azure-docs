---
author: baanders
description: include file for Azure Digital Twins - set up CLI and the IoT extension
ms.service: digital-twins
ms.topic: include
ms.date: 1/18/2022
ms.author: baanders
---

### Set up CLI session

To start working with Azure Digital Twins in the CLI, the first thing to do is log in and set the CLI context to your subscription for this session. Run these commands in your CLI window:

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

Next you'll add the [Microsoft Azure IoT Extension for Azure CLI](/cli/azure/service-page/azure%20iot?view=azure-cli-latest&preserve-view=true), to enable commands for interacting with Azure Digital Twins and other IoT services. Run this command to make sure you have the latest version of the extension:

```azurecli-interactive
az extension add --upgrade --name azure-iot
```

Now you are ready to work with Azure Digital Twins in the Azure CLI.

You can verify this by running `az dt --help` at any time to see a list of the top-level Azure Digital Twins commands that are available.