---
title: 'Quickstart: Scale your container app'
description: Scale your Azure Container Apps application using the Azure CLI.
services: container-apps
author: v-jaswel
ms.service: container-apps
ms.topic: quickstart
ms.date: 08/02/2023
ms.author: v-wellsjason
ms.custom: devx-track-azurecli
ms.devlang: azurecli
---

# Quickstart: Scale your container app

Azure Container Apps manages automatic horizontal scaling through a set of declarative scaling rules. As a container app revision scales out, new instances of the revision are created on-demand. These instances are known as replicas.

In this quickstart, you add an http scale rule to your container app and test it by sending multiple concurrent requests to your container app.

## Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli).

## Setup

To sign in to Azure from the CLI, run the following command and follow the prompts to complete the authentication process.

# [Bash](#tab/bash)

```azurecli
az login
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
az login
```

---

Ensure you're running the latest version of the CLI via the upgrade command.

# [Bash](#tab/bash)

```azurecli
az upgrade
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
az upgrade
```

---

Next, install or update the Azure Container Apps extension for the CLI.

# [Bash](#tab/bash)

```azurecli
az extension add --name containerapp --upgrade
```

# [Azure PowerShell](#tab/azure-powershell)


```azurepowershell
az extension add --name containerapp --upgrade
```

---

Register the `Microsoft.App` and `Microsoft.OperationalInsights` namespaces if you haven't already registered them in your Azure subscription.

# [Bash](#tab/bash)

```azurecli
az provider register --namespace Microsoft.App
```

```azurecli
az provider register --namespace Microsoft.OperationalInsights
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
az provider register --namespace Microsoft.App
```

```azurepowershell
az provider register --namespace Microsoft.OperationalInsights
```

---

## Create and deploy the container app

Create and deploy your container app with the `containerapp up` command. This command will:

- Create the resource group
- Create the Container Apps environment
- Create the Log Analytics workspace
- Create and deploy the container app using a public container image

If any of these resources already exist, the command uses them instead of creating new ones.

# [Bash](#tab/bash)

```azurecli
az containerapp up \
  --name my-container-app \
  --resource-group my-container-apps \
  --location centralus \
  --environment 'my-container-apps' \
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  --target-port 80 \
  --ingress external \
  --query properties.configuration.ingress.fqdn
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
az containerapp up `
  --name my-container-app `
  --resource-group my-container-apps `
  --location centralus `
  --environment my-container-apps `
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest `
  --target-port 80 `
  --ingress external `
  --query properties.configuration.ingress.fqdn
```

---

> [!NOTE]
> Make sure the value for the `--image` parameter is in lower case.

By setting `--ingress` to `external`, you make the container app available to public requests.

The `up` command returns the fully qualified domain name for the container app. Copy this location to a text file. You'll use it in the [Send requests](#send-requests) section.

## Add scale rule

Add an http scale rule to your container app by running the following command.

# [Bash](#tab/bash)

```azurecli
az containerapp update \
	--name my-container-app \
	--resource-group my-container-apps \
    --scale-rule-name my-http-scale-rule \
    --scale-rule-http-concurrency 1
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
az containerapp update `
	--name my-container-app `
	--resource-group my-container-apps `
    --scale-rule-name my-http-scale-rule `
    --scale-rule-http-concurrency 1
```

---

This command adds to your container app an http scale rule with the name `my-http-scale-rule` and a concurrency setting of `1`. This means that if your container app receives more than one HTTP request at a time, Azure creates replicas of your container app to handle the concurrent HTTP requests.

This command outputs the following to show the http scale rule has been added to your container app.

```json
{
...
  "name": "my-container-app",
  "properties": {
...
    "template": {
...
      "scale": {
        "maxReplicas": 10,
        "minReplicas": null,
        "rules": [
          {
            "http": {
              "metadata": {
                "concurrentRequests": "1"
              }
            },
            "name": "my-http-scale-rule"
          }
        ]
      },
...
    },
...
  },
...
}
```

## View log

You can see Azure creating replicas of your container app by viewing the log. Run the following command.

# [Bash](#tab/bash)

```azurecli
az containerapp logs show \
	--name my-container-app \
	--resource-group my-container-apps \
	--type=system \
	--follow=true
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
az containerapp logs show `
	--name my-container-app `
	--resource-group my-container-apps `
	--type=system `
	--follow=true
```

---

This command tells Azure to show the system logs for your container app in real time. For more information, see [az containerapp logs](/cli/azure/containerapp/logs).

## Send requests

Open a new bash shell using Windows Subsystem for Linux or Azure Cloud Shell. Run the following command, replacing `YOUR_CONTAINER_APP_FQDN` with the fully qualified domain name for your container app that you saved from the [Create and deploy the container app](#create-and-deploy-the-container-app) section.

```bash
seq 1 4 | xargs -Iname -P4 curl "YOUR_CONTAINER_APP_FQDN/albums"
```

This command sends four simultaneous requests to the `/albums` endpoint of your container app. For more information, see the manual pages for [seq](https://www.man7.org/linux/man-pages/man1/seq.1.html), [xargs](https://www.man7.org/linux/man-pages/man1/xargs.1.html), and [curl](https://www.man7.org/linux/man-pages/man1/curl.1.html).

In the first shell, where you ran the `az containerapp logs show` command, the output now contains one or more log entries like the following.

```json
{"TimeStamp":"2023-08-01 18:09:52 +0000 UTC","Type":"Normal","ContainerAppName":"my-container-app","RevisionName":"my-container-app--9uj51l6","ReplicaName":"my-container-app--9uj51l6-5f96557ffb-f795d","Msg":"Replica 'my-container-app--9uj51l6-5f96557ffb-f795d' has been scheduled to run on a node.","Reason":"AssigningReplica","EventSource":"ContainerAppController","Count":0}
```

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the resource group along with all the resources created in this quickstart.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this quickstart exist in the specified resource group, they will also be deleted.

```azurecli
az group delete --name my-container-apps
```

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Set scaling rules in Azure Container Apps](scale-app.md)
