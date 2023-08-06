---
title: 'Tutorial: Scale a container app'
description: Scale a Azure Container Apps application using the Azure CLI.
services: container-apps
author: v-jaswel
ms.service: container-apps
ms.topic: tutorial
ms.date: 08/02/2023
ms.author: v-wellsjason
ms.custom: devx-track-azurecli
ms.devlang: azurecli
---

# Tutorial: Scale a container app

Azure Container Apps manages automatic horizontal scaling through a set of declarative scaling rules. As a container app scales out, new instances of the container app are created on-demand. These instances are known as replicas.

In this tutorial, you add an HTTP scale rule to your container app and observe how your application scales.

## Prerequisites

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have an Azure account, you can [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). <br><br>You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md?tabs=current) for details. |
| GitHub Account | Get one for [free](https://github.com/join). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli). |

## Setup

Run the following command and follow the prompts to sign in to Azure from the CLI and complete the authentication process.

# [Bash](#tab/bash)

```azurecli
az login
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
az login
```

---

Ensure you're running the latest version of the CLI via the `az upgrade` command.

# [Bash](#tab/bash)

```azurecli
az upgrade
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
az upgrade
```

---

Install or update the Azure Container Apps extension for the CLI.

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

## Prepare the GitHub repository

In a browser window, go to the GitHub repository and fork the repository. For this tutorial, we will simply use the C# repository, because the programming language does not matter to the tutorial.

Select the **Fork** button at the top of the [album API repo](https://github.com/azure-samples/containerapps-albumapi-csharp) to fork the repo to your account.

## Create and deploy the container app

Create and deploy your container app with the `containerapp up` command. This command creates:

- A resource group
- The Container Apps environment
- The Log Analytics workspace

If any of these resources already exist, the command uses them instead of creating new ones.

Lastly, the command creates and deploys the container app using a public container image.

Replace the `<YOUR_GITHUB_REPOSITORY_NAME>` with your GitHub repository name in the form of `https://github.com/<owner>/containerapps-albumapi-csharp` or `<owner>/containerapps-albumapi-csharp`.

# [Bash](#tab/bash)

```azurecli
az containerapp up \
  --name my-container-app \
  --resource-group my-container-apps \
  --location centralus \
  --environment 'my-container-apps' \
  --target-port 80 \
  --ingress external \
  --query properties.configuration.ingress.fqdn \
  --context-path ./src \
  --repo <YOUR_GITHUB_REPOSITORY_NAME>
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
az containerapp up `
  --name my-container-app `
  --resource-group my-container-apps `
  --location centralus `
  --environment my-container-apps `
  --target-port 80 `
  --ingress external  `
  --query properties.configuration.ingress.fqdn `
  --context-path ./src `
  --repo <YOUR_GITHUB_REPOSITORY_NAME>
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

The `update` command returns the new configuration as a JSON response to verify your request was a success.

## Start log output

You can observe the effects of your application scaling by viewing the logs generated by the Container Apps runtime. Use the `az containerapp logs show` command to start listening for log entries.

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

The `show` command returns entries from the system logs for your container app in real time. The following is an example of the type of response you can expect.

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

Open a new bash shell using Windows Subsystem for Linux or a Linux virtual machine. Run the following command, replacing `<YOUR_CONTAINER_APP_FQDN>` with the fully qualified domain name for your container app that you saved from the [Create and deploy the container app](#create-and-deploy-the-container-app) section.

```bash
seq 1 20 | xargs -Iname -P20 curl "<YOUR_CONTAINER_APP_FQDN>"
```

These commands send 20 concurrent requests to your container app.

- `seq 1 20` generates a sequence from one to 20.
- The pipe operator `|` sends this sequence to the `xargs` command.
- `xargs` then runs `curl` with the specified URL.
- The `-Iname` argument to `xargs` acts as a placeholder for the output of `seq`. This prevents the return value from being sent to the `curl` command.
- The `-P20` argument instructs `xargs` to run up to 20 processes at a time.

For more information, see the documentation for:
- [seq](https://www.man7.org/linux/man-pages/man1/seq.1.html)
- [xargs](https://www.man7.org/linux/man-pages/man1/xargs.1.html)
- [curl](https://www.man7.org/linux/man-pages/man1/curl.1.html)

# [Azure PowerShell](#tab/azure-powershell)

Open a new command prompt and enter PowerShell. Run the following commands, replacing `<YOUR_CONTAINER_APP_FQDN>` with the fully qualified domain name for your container app that you saved from the [Create and deploy the container app](#create-and-deploy-the-container-app) section.

```powershell
$url="<YOUR_CONTAINER_APP_FQDN>"
$Runspace = [runspacefactory]::CreateRunspacePool(1,20)
$Runspace.Open()
1..20 | % {
    $ps = [powershell]::Create()
    $ps.RunspacePool = $Runspace
    [void]$ps.AddCommand("Invoke-WebRequest").AddParameter("UseBasicParsing",$true).AddParameter("Uri",$url)
    [void]$ps.BeginInvoke()
}
```

These commands send 20 asynchronous requests to your container app.

- `[runspacefactory]::CreateRunspacePool(1,20)` creates a `RunspacePool` that allows up to 20 runspaces to run concurrently.
- `1..20 | % {  }` runs the code enclosed in the curly braces 20 times. 
- `$ps = [powershell]::Create()` creates a new PowerShell instance.
- `$ps.RunspacePool = $Runspace` tells the PowerShell instance to run in the `RunspacePool`.
- `[void]$ps.AddCommand("Invoke-WebRequest").AddParameter("UseBasicParsing",$true).AddParameter("Uri",$url)` tells the PowerShell instance to send a request to your container app.
- `[void]$ps.BeginInvoke()` tells the PowerShell instance to run asynchronously.

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

## View scaling in Azure Portal (optional)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the *Search* bar at the top, enter **my-container-app**.
1. In the search results, under *Resources*, select *my-container-app*.
1. In the navigation bar at the left, expand *Application* and select *Scale and replicas*.
1. In the *Scale and Replicas* page, select *Replicas*.
1. Your container app now has more than one replica running.

:::image type="content" source="media/scale-app/azure-container-apps-scale-replicas.png" alt-text="Container app replicas.":::

Note you might need to click *Refresh* to see the new replicas.

1. In the navigation bar at the left, expand *Monitoring* and select *Metrics*.
1. In the *Metrics* page, set *Metric* to *Replica Count*.
1. The graph shows your container app's replica count has increased recently.

:::image type="content" source="media/scale-app/azure-container-apps-scale-replicas-metrics.png" alt-text="Container app replica count.":::

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
