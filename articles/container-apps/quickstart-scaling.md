---
title: 'Tutorial: Scale your container app'
description: Scale your Azure Container Apps application using the Azure CLI.
services: container-apps
author: v-jaswel
ms.service: container-apps
ms.topic: tutorial
ms.date: 08/02/2023
ms.author: v-wellsjason
ms.custom: devx-track-azurecli
ms.devlang: azurecli
---

# Tutorial: Scale your container app

Azure Container Apps manages automatic horizontal scaling through a set of declarative scaling rules. As a container app revision scales out, new instances of the revision are created on-demand. These instances are known as replicas.

In this tutorial, you add an HTTP scale rule to your container app and test it by sending multiple concurrent requests to your container app.

## Prerequisites

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. <br><br>Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md?tabs=current) for details. |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|

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

Create and deploy your container app with the `containerapp up` command. This command:

- Creates the resource group
- Creates the Container Apps environment
- Creates the Log Analytics workspace
- Creates and deploys the container app using a public container image

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

The `up` command returns the fully qualified domain name (FQDN) for the container app. Copy this FQDN to a text file. You'll use it in the [Send requests](#send-requests) section. The FQDN looks like the following.

```text
https://my-container-app.icydune-96848328.centralus.azurecontainerapps.io
```

## Add scale rule

Add an HTTP scale rule to your container app by running the `az containerapp update` command.

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

This command adds an HTTP scale rule to your container app with the name `my-http-scale-rule` and a concurrency setting of `1`. If your app receives more than one concurrent HTTP request, the runtime creates replicas of your app to handle the requests.

This command prints the updated configuration information for your app in JSON format to show the HTTP scale rule has been added.

## Start log output

You can see Azure creating replicas of your container app by viewing the log with the `az containerapp logs show` command.

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

This command shows the system logs for your container app in real time. It starts by printing something similar to the following.

```json
{
	"TimeStamp":"2023-08-01T16:49:03.02752",
	"Log":"Connecting to the container 'my-container-app'..."
}
{
	"TimeStamp":"2023-08-01T16:49:03.04437",
	"Log":"Successfully Connected to container:
	'my-container-app' [Revision: 'my-container-app--9uj51l6',
	Replica: 'my-container-app--9uj51l6-5f96557ffb-5khg9']"
}
{
	"TimeStamp":"2023-08-01T16:47:31.9480811+00:00",
	"Log":"Microsoft.Hosting.Lifetime[14]"
}
{
	"TimeStamp":"2023-08-01T16:47:31.9481264+00:00",
	"Log":"Now listening on: http://[::]:3500"
}
{
	"TimeStamp":"2023-08-01T16:47:31.9490917+00:00",
	"Log":"Microsoft.Hosting.Lifetime[0]"
}
{
	"TimeStamp":"2023-08-01T16:47:31.9491036+00:00",
	"Log":"Application started. Press Ctrl+C to shut down."
}
{
	"TimeStamp":"2023-08-01T16:47:31.949723+00:00",
	"Log":"Microsoft.Hosting.Lifetime[0]"
}
{
	"TimeStamp":"2023-08-01T16:47:31.9497292+00:00",
	"Log":"Hosting environment: Production"
}
{
	"TimeStamp":"2023-08-01T16:47:31.9497325+00:00",
	"Log":"Microsoft.Hosting.Lifetime[0]"
}
{
	"TimeStamp":"2023-08-01T16:47:31.9497367+00:00",
	"Log":"Content root path: /app/"
}
```

For more information, see [az containerapp logs](/cli/azure/containerapp/logs).

## Send requests

# [Bash](#tab/bash)

Open a new bash shell using Windows Subsystem for Linux or Azure Cloud Shell. Run the following command, replacing `<YOUR_CONTAINER_APP_FQDN>` with the fully qualified domain name for your container app that you saved from the [Create and deploy the container app](#create-and-deploy-the-container-app) section.

```bash
seq 1 4 | xargs -Iname -P4 curl "<YOUR_CONTAINER_APP_FQDN>/albums"
```

This command sends four concurrent requests to the `/albums` endpoint of your container app.

- `seq 1 4` generates a sequence from 1 to 4.
- The pipe operator `|` sends this sequence to the `xargs` command.
- `xargs` then runs `curl` with the specified URL.
- The `-Iname` argument to `xargs` simply acts as a placeholder for the output of `seq`, which is not used.
- The `-P4` argument to `xargs` tells it to run up to 4 processes at a time.

For more information, see the manual pages for:
- [seq](https://www.man7.org/linux/man-pages/man1/seq.1.html)
- [xargs](https://www.man7.org/linux/man-pages/man1/xargs.1.html)
- [curl](https://www.man7.org/linux/man-pages/man1/curl.1.html)

# [Azure PowerShell](#tab/azure-powershell)

Open a new command prompt and enter PowerShell. Run the following commands, replacing `<YOUR_CONTAINER_APP_FQDN>` with the fully qualified domain name for your container app that you saved from the [Create and deploy the container app](#create-and-deploy-the-container-app) section.

```powershell
$url="<YOUR_CONTAINER_APP_FQDN>/albums"
$Runspace = [runspacefactory]::CreateRunspacePool(1,4)
$Runspace.Open()
1..4 | % {
    $ps = [powershell]::Create()
    $ps.RunspacePool = $Runspace
    [void]$ps.AddCommand("Invoke-WebRequest").AddParameter("UseBasicParsing",$true).AddParameter("Uri",$url)
    [void]$ps.BeginInvoke()
}
```

These commands send four asynchronous requests to the `albums` endpoint of your container app.

`[runspacefactory]::CreateRunspacePool(1,4)` creates a `RunspacePool` that allows up to 4 runspaces to run concurrently.
`1..4 | % {  }` runs the code enclosed in the curly braces four times. 
`$ps = [powershell]::Create()` creates a new PowerShell instance.
`$ps.RunspacePool = $Runspace` tells the PowerShell instance to run in our `RunspacePool`.
`[void]$ps.AddCommand("Invoke-WebRequest").AddParameter("UseBasicParsing",$true).AddParameter("Uri",$url)` tells the PowerShell instance to send a request to your container app.
`[void]$ps.BeginInvoke()` tells the PowerShell instance to run asynchronously.

For more information, see:
[Beginning Use of PowerShell Runspaces: Part 3](https://devblogs.microsoft.com/scripting/beginning-use-of-powershell-runspaces-part-3/)

---

In the first shell, where you ran the `az containerapp logs show` command, the output now contains one or more log entries like the following.

```json
{
	"TimeStamp":"2023-08-01 18:09:52 +0000 UTC",
	"Type":"Normal",
	"ContainerAppName":"my-container-app",
	"RevisionName":"my-container-app--9uj51l6",
	"ReplicaName":"my-container-app--9uj51l6-5f96557ffb-f795d",
	"Msg":"Replica 'my-container-app--9uj51l6-5f96557ffb-f795d' has been scheduled to run on a node.",
	"Reason":"AssigningReplica",
	"EventSource":"ContainerAppController",
	"Count":0
}
```

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the resource group along with all the resources created in this tutorial.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this tutorial exist in the specified resource group, they will also be deleted.

```azurecli
az group delete --name my-container-apps
```

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Set scaling rules in Azure Container Apps](scale-app.md)
