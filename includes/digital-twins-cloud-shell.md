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

After opening a Cloud Shell window, the first thing to do is log in and set the shell context to your subscription for this session. 

```azurecli
az login
az account set --subscription <your-Azure-subscription-ID>
```

If this is the first time you've used this subscription with Azure Digital Twins, run this command to register with the Azure Digital Twins namespace. (If you're not sure, it's ok to run it again even if you've done it sometime in the past.)

```azurecli
az provider register --namespace 'Microsoft.DigitalTwins'
```

Then, run the following command in your Cloud Shell instance to add the Microsoft Azure IoT Extension for Azure CLI.

   ```azurecli-interactive
   az extension add --name azure-iot
   ```

> [!NOTE]
> This article uses the newest version of the Azure IoT extension, called `azure-iot`. The legacy version is called `azure-iot-cli-ext`.You should only have one version installed at a time. You can use the command `az extension list` to validate the currently installed extensions.
> Use `az extension remove --name azure-cli-iot-ext` to remove the legacy version of the extension.
> Use `az extension add --name azure-iot` to add the new version of the extension. 
> To see what extensions you have installed, use `az extension list`.

> [!TIP]
> You can run `az dt -h` to see the top-level Azure Digital Twins commands.