---
title: 'Troubleshooting'
description: Troubleshoot an Azure Container Apps application.
services: container-apps
author: v-jaswel
ms.service: container-apps
ms.topic: how-to
ms.date: 09/22/2023
ms.author: v-wellsjason
ms.custom: devx-track-azurecli
---

# Troubleshoot a container app

TODO1 Intro here.

Azure Container Apps manages automatic horizontal scaling through a set of declarative scaling rules. As a container app scales out, new instances of the container app are created on-demand. These instances are known as replicas.

In this tutorial, you add an HTTP scale rule to your container app and observe how your application scales.

## Prerequisites

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have an Azure account, you can [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). <br><br>You need the *Contributor* permission on the Azure subscription to proceed. Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md?tabs=current) for details. |
| GitHub Account | Get one for [free](https://github.com/join). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli). |

### Setup (Console)

> [!NOTE]
> This section only applies to the console. If you are using the [Azure portal](https://portal.azure.com), you can skip this section.

TODO1 Copied this section from ./tutorial-scaling.md, which in turn copied it from elsewhere. It should be moved to a central topic to which we can link, or at least put in an include file.

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

## Symptoms

If your container app or revision is configured incorrectly, you might see the following issues.

- You receive an error message when you try to deploy a new revision.
- After you deploy a new revision, the new revision has a *Provision status* of *Provisioning* and a *Running status* of *Processing* indefinitely.
- A new revision takes more than 10 minutes to provision. It finally has a *Provision status* of *Provisioned*, but a *Running status* of *Degraded*. The *Running status* tooltip reads `Details: Deployment Progress Deadline Exceeded. 0/1 replicas ready.`
- The container app endpoint does not respond to requests.
- The container app endpoint responds to requests with HTTP error 403 (access denied).

The following sections describe how to diagnose and resolve these issues.

## View logs (Azure Portal)

### Setup



### View logs

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the **Search** bar at the top, enter your Azure Container Apps application name.
1. In the search results, under *Resources*, select your container app name.

Your container app's console logs capture the app's `stdout` and `stderr` streams. You can view the console logs as follows.

1. In the navigation bar at the left, expand *Application* and select **Revisions**.
1. In the *Revisions* page, make sure **Active revisions** is selected, then select the revision whose console logs you want to view. The *Revision details* pane appears at the right.
1. In the *Revision details* pane, next to *Console logs*, select the **View details** link.
1. The **View details** link takes you to the *Logs* page, with the following query.
    ```
	ContainerAppConsoleLogs_CL
	| where RevisionName_s == "<YOUR_REVISION_NAME>"
	```
1. In the results pane at the bottom, make sure *Results* is selected. By default, the results are sorted by time in descending order. The time range defaults to **Last 24 hours**.
1. Examine the *Log_s* column, which shows the console log output from your container app revision.

You might also want to narrow your query to view your container app revision's output to `stdout` or `stderr`.

- To view `stdout`, change your query to the following.
	```
	ContainerAppConsoleLogs_CL
	| where RevisionName_s == "<YOUR_REVISION_NAME>"
	and Stream_s == "stdout"
	```
	Then select **Run**.
- To view `stderr`, change your query to the following.
	```
	ContainerAppConsoleLogs_CL
	| where RevisionName_s == "<YOUR_REVISION_NAME>"
	and Stream_s == "stderr"
	```
	Then select **Run**.

When you type in a query, after you enter the `where` keyword, a drop-down list appears that shows the columns available to query. You can also expand the *Schema and Filter* pane at the left, expand **Custom Logs**, and expand **ContainerAppConsoleLogs_CL**.

Container Apps generates [system logs](./logging.md#system-logs) for service level events. You can view the system logs as follows.

1. Browse to the *Revisions* page for your container app as described previously.
1. In the *Revisions* page, make sure **Active revisions** is selected, then select the revision whose console logs you want to view. The *Revision details* pane appears at the right.
1. In the *Revision details* pane, next to *System logs*, select the **View details** link.
1. The **View details** link takes you to the *Logs* page, with the following query.
    ```
	ContainerAppSystemLogs_CL
    | where RevisionName_s == "<YOUR_REVISION_NAME>"
	```
1. In the results pane at the bottom, make sure *Results* is selected. By default, the results are sorted by time in descending order. The time range defaults to **Last 24 hours**.
1. Examine the contents of the *Error_s*, *Log_s*, *Type_s*, *Reason_s*, and *EventSource_s* columns.

For more information, see [Observability in Azure Container Apps](./observability.md).

## View logs (Console)

Get a list of revisions for your container app with the [`containerapp revision list`](/cli/azure/containerapp/revision#az-containerapp-revision-list(containerapp)) command.

# [Bash](#tab/bash)

```azurecli
az containerapp revision list --name <YOUR_CONTAINER_APP_NAME> --resource-group <YOUR_RESOURCE_GROUP_NAME>
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
az containerapp revision list --name <YOUR_CONTAINER_APP_NAME> --resource-group <YOUR_RESOURCE_GROUP_NAME>
```

---

You can expect a response like the following example:

```json
[
  ...
  {
    "id": "<YOUR_REVISION_ID>",
    "name": "<YOUR_REVISION_NAME>",
    "properties": {
      "active": true,
      "createdTime": "2023-09-28T15:03:14+00:00",
      "fqdn": "<YOUR_CONTAINER_APP_FQDN>",
      "healthState": "Healthy",
      "provisioningState": "Provisioned",
      "replicas": 0,
      "runningState": "ScaledToZero",
      ...
	  "trafficWeight": 100
    },
    "resourceGroup": "<YOUR_RESOURCE_GROUP_NAME>",
    "type": "Microsoft.App/containerapps/revisions"
  }
]
```

Your container app's console logs capture the app's `stdout` and `stderr` streams. You can view the console logs for your revision with the [`az containerapp logs show`](/cli/azure/containerapp/logs#az-containerapp-logs-show(containerapp)) command:

# [Bash](#tab/bash)

```azurecli
az containerapp logs show \
    --name <YOUR_CONTAINER_APP_NAME> \
    --resource-group <YOUR_RESOURCE_GROUP_NAME> \
    --revision <YOUR_REVISION_NAME> \
    --type=console
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
az containerapp logs show `
    --name <YOUR_CONTAINER_APP_NAME> `
    --resource-group <YOUR_RESOURCE_GROUP_NAME> `
    --revision <YOUR_REVISION_NAME> `
    --type=console
```

---

You can expect a response like the following example:

``` json
{"TimeStamp":"2023-10-06T21:41:30.10108","Log":"Connecting to the container '<YOUR_CONTAINER_APP_NAME>'..."}
{"TimeStamp":"2023-10-06T21:41:30.1194","Log":"Successfully Connected to container: '<YOUR_CONTAINER_APP_NAME>' [Revision: '<YOUR_REVISION_NAME>', Replica: '<YOUR_REVISION_NAME>-76df875978-rn4wx']"}
{"TimeStamp":"2023-10-06T21:41:03.8738333+00:00","Log":"Microsoft.Hosting.Lifetime[14]"}
{"TimeStamp":"2023-10-06T21:41:03.8738652+00:00","Log":"Now listening on: http://[::]:3500"}
{"TimeStamp":"2023-10-06T21:41:03.874901+00:00","Log":"Microsoft.Hosting.Lifetime[0]"}
{"TimeStamp":"2023-10-06T21:41:03.8749081+00:00","Log":"Application started. Press Ctrl+C to shut down."}
{"TimeStamp":"2023-10-06T21:41:03.9152964+00:00","Log":"Microsoft.Hosting.Lifetime[0]"}
{"TimeStamp":"2023-10-06T21:41:03.9153115+00:00","Log":"Hosting environment: Production"}
{"TimeStamp":"2023-10-06T21:41:03.915314+00:00","Log":"Microsoft.Hosting.Lifetime[0]"}
{"TimeStamp":"2023-10-06T21:41:03.9153166+00:00","Log":"Content root path: /app/"}
```

Container Apps generates [system logs](./logging.md#system-logs) for service level events. To view the system logs, remove the `--revision` parameter and change the `--type` parameter value to `system`:

# [Bash](#tab/bash)

```azurecli
az containerapp logs show \
    --name <YOUR_CONTAINER_APP_NAME> \
    --resource-group <YOUR_RESOURCE_GROUP_NAME> \
    --type=system
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
az containerapp logs show `
    --name <YOUR_CONTAINER_APP_NAME> `
    --resource-group <YOUR_RESOURCE_GROUP_NAME> `
    --type=system
```

---

You can expect a response like the following example:

``` json
{"TimeStamp":"2023-10-06T22:14:01Z","Type":"Normal","ContainerAppName":null,"RevisionName":null,"ReplicaName":null,"Msg":"Connecting to the events collector...","Reason":"StartingGettingEvents","EventSource":"ContainerAppController","Count":1}
{"TimeStamp":"2023-10-06T22:14:01Z","Type":"Normal","ContainerAppName":null,"RevisionName":null,"ReplicaName":null,"Msg":"Successfully connected to events server","Reason":"ConnectedToEventsServer","EventSource":"ContainerAppController","Count":1}
{"TimeStamp":"2023-10-06 21:41:33 +0000 UTC","Type":"Normal","ContainerAppName":"<YOUR_CONTAINER_APP_NAME>","RevisionName":"<YOUR_REVISION_NAME>","ReplicaName":"<YOUR_REVISION_NAME>-76df875978-rn4wx","Msg":"Container <YOUR_CONTAINER_APP_NAME> failed liveness probe, will be restarted","Reason":"StoppingContainer","EventSource":"ContainerAppController","Count":2}
{"TimeStamp":"2023-10-06 21:41:33 +0000 UTC","Type":"Normal","ContainerAppName":"<YOUR_CONTAINER_APP_NAME>","RevisionName":"<YOUR_REVISION_NAME>","ReplicaName":"<YOUR_REVISION_NAME>-76df875978-rn4wx","Msg":"Pulling image "cafb4e9ce5e5acr.azurecr.io/<YOUR_CONTAINER_APP_NAME>:d0daa8257a4c13e1a35cb79b60d8dfeabaf4470b"","Reason":"PullingImage","EventSource":"ContainerAppController","Count":3}
{"TimeStamp":"2023-10-06 21:41:33 +0000 UTC","Type":"Normal","ContainerAppName":"<YOUR_CONTAINER_APP_NAME>","RevisionName":"<YOUR_REVISION_NAME>","ReplicaName":"<YOUR_REVISION_NAME>-76df875978-rn4wx","Msg":"Successfully pulled image "cafb4e9ce5e5acr.azurecr.io/<YOUR_CONTAINER_APP_NAME>:d0daa8257a4c13e1a35cb79b60d8dfeabaf4470b" in 80.266807ms (80.271526ms including waiting)","Reason":"ImagePulled","EventSource":"ContainerAppController","Count":1}
{"TimeStamp":"2023-10-06 21:41:33 +0000 UTC","Type":"Normal","ContainerAppName":"<YOUR_CONTAINER_APP_NAME>","RevisionName":"<YOUR_REVISION_NAME>","ReplicaName":"<YOUR_REVISION_NAME>-76df875978-rn4wx","Msg":"Created container <YOUR_CONTAINER_APP_NAME>","Reason":"ContainerCreated","EventSource":"ContainerAppController","Count":3}
{"TimeStamp":"2023-10-06 21:43:04 +0000 UTC","Type":"Warning","ContainerAppName":"<YOUR_CONTAINER_APP_NAME>","RevisionName":"<YOUR_REVISION_NAME>","ReplicaName":"<YOUR_REVISION_NAME>-76df875978-rn4wx","Msg":"Container '<YOUR_CONTAINER_APP_NAME>' was terminated with exit code '0'","Reason":"Completed","EventSource":"ContainerAppController","Count":1}
{"TimeStamp":"2023-10-06 21:44:14 +0000 UTC","Type":"Warning","ContainerAppName":"<YOUR_CONTAINER_APP_NAME>","RevisionName":"<YOUR_REVISION_NAME>","ReplicaName":"<YOUR_REVISION_NAME>-76df875978-rn4wx","Msg":"Container '<YOUR_CONTAINER_APP_NAME>' was terminated with exit code '0'","Reason":"Completed","EventSource":"ContainerAppController","Count":2}
{"TimeStamp":"2023-10-06 21:45:40 +0000 UTC","Type":"Normal","ContainerAppName":"<YOUR_CONTAINER_APP_NAME>","RevisionName":"<YOUR_REVISION_NAME>","ReplicaName":"<YOUR_REVISION_NAME>-76df875978-rn4wx","Msg":"Pulling image "cafb4e9ce5e5acr.azurecr.io/<YOUR_CONTAINER_APP_NAME>:d0daa8257a4c13e1a35cb79b60d8dfeabaf4470b"","Reason":"PullingImage","EventSource":"ContainerAppController","Count":7}
{"TimeStamp":"2023-10-06 21:46:04 +0000 UTC","Type":"Warning","ContainerAppName":"<YOUR_CONTAINER_APP_NAME>","RevisionName":"<YOUR_REVISION_NAME>","ReplicaName":"<YOUR_REVISION_NAME>-76df875978-rn4wx","Msg":"Container '<YOUR_CONTAINER_APP_NAME>' was terminated with exit code '0'","Reason":"Completed","EventSource":"ContainerAppController","Count":3}
{"TimeStamp":"2023-10-06 21:46:30 +0000 UTC","Type":"Normal","ContainerAppName":"<YOUR_CONTAINER_APP_NAME>","RevisionName":"<YOUR_REVISION_NAME>","ReplicaName":"","Msg":"Deactivated apps/v1.Deployment k8se-apps/<YOUR_REVISION_NAME> from 1 to 0","Reason":"KEDAScaleTargetDeactivated","EventSource":"KEDA","Count":3}
```

For more information, see [Observability in Azure Container Apps](./observability.md).

## Use **Diagnose and solve problems** (Azure Portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the **Search** bar at the top, enter your Azure Container Apps application name.
1. In the search results, under *Resources*, select your container app name.
1. In the navigation bar at the left, select **Diagnose and solve problems**.

## Review Ingress Configuration

TODO1 Source: https://azureossd.github.io/2022/08/01/Container-Apps-and-failed-revisions-Copy/, Incorrect Ingress.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the **Search** bar at the top, enter your Azure Container Apps application name.
1. In the search results, under *Resources*, select your container app name.
1. In the navigation bar at the left, expand **Settings** and select **Ingress**.

- Verify the **Enabled** checkbox is checked.
- If you want to allow external ingress, verify that:
	- **Ingress Traffic** is set to **Accepting traffic from anywhere**.
	- Your Container Apps environment has *internalOnly* set to *false*.
- Verify **Ingress type** is set to the protocol (**HTTP** or **TCP**) you want to use to access your container app.
- Verify **Client certificate mode** is set to **Require** only if your client supports mTLS. For more information, see [Environment level network encryption](./networking.md#mtls)
- Verify **Target port** is set to the same port your container app is listening on. TODO1 Link to where we configure that.
- If **IP Security Restrictions Mode** is not set to **Allow all traffic**, verify your client does not have an IP address that is denied.

For more information, see [Ingress in Azure Container Apps](./ingress-overview.md).

TODO1 Add command line version if possible.

## Verify Health Probes are Configured Correctly

- If you are using TCP probes, verify their port numbers match the ingress target port you have configured for your container app.
- If your container app takes an extended amount of time to start, verify you have configured your liveness and readiness probes' *initialDelaySeconds* settings accordingly.

For more information, see [Use Health Probes](./health-probes.md).



> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

TODO1 Figure out next step.

> [!div class="nextstepaction"]
> [Set scaling rules in Azure Container Apps](scale-app.md)
