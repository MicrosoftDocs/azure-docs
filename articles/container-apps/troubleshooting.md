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
zone_pivot_group_filename: container-apps/azure-portal-console-zone-pivot-groups.json
zone_pivot_groups: azure-portal-console
---

# Troubleshoot a container app

Reviewing Azure Container Apps logs and configuration settings can reveal underlying problems if your container app isn't behaving correctly.

## Scenarios

| Issue | Actions |
|--|--|
| All issues. | [View logs.](#view-logs)<br>[Use Diagnose and solve problems.](#use-diagnose-and-solve-problems) |
| You receive an error message when you try to deploy a new revision. | [Verify Container Apps can pull your container image.](#verify-accessibility-of-container-image) |
| After you deploy a new revision, the new revision has a *Provision status* of *Provisioning* and a *Running status* of *Processing* indefinitely. | [Verify health probes are configured correctly.](#verify-health-probes-are-configured-correctly) |
| A new revision takes more than 10 minutes to provision. It finally has a *Provision status* of *Provisioned*, but a *Running status* of *Degraded*. The *Running status* tooltip reads `Details: Deployment Progress Deadline Exceeded. 0/1 replicas ready.` | [Verify health probes are configured correctly.](#verify-health-probes-are-configured-correctly) |
| The container app endpoint doesn't respond to requests. | [Review ingress configuration.](#review-ingress-configuration) |
| The container app endpoint responds to requests with HTTP error 403 (access denied). |  [Verify networking configuration is correct.](#verify-networking-configuration-is-correct) |
| The container app endpoint responds to requests, but the responses are not as expected. | [Verify traffic is routed to correct revision.](#verify-traffic-is-routed-to-correct-revision) |
| You receive the error message `Dapr sidecar is not present`. | [Ensure Dapr is enabled in your environment.](#ensure-dapr-is-enabled-in-your-environment) |
| You receive a Dapr configuration error message regarding the `app-port` value. | [Verify you've provided the correct app-port value.](#verify-app-port-value-in-dapr-configuration) |

## View logs

::: zone pivot="portal"

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

::: zone-end

::: zone pivot="console"

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

---

::: zone-end

For more information, see [Observability in Azure Container Apps](./observability.md).

::: zone pivot="portal"

## Use **Diagnose and solve problems**

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the **Search** bar at the top, enter your Azure Container Apps application name.
1. In the search results, under *Resources*, select your container app name.
1. In the navigation bar at the left, select **Diagnose and solve problems**.
1. In the *Diagnose and solve problems* page, select one of the *Troubleshooting categories*.

::: zone-end

## Verify accessibility of container image

- Verify you can pull your container image publicly. For example, for a Docker container that can run as a console application, run:
	```
	docker run --rm <YOUR_CONTAINER_IMAGE>
	```
- Verify your container environment firewall is not blocking access to the container registry. For more information, see [Control outbound traffic with user defined routes](./user-defined-routes.md).
- Verify your NAT gateway is forwarding packets correctly?
- If your VNet uses a custom DNS server instead of the default Azure-provided DNS server, verify your DNS server is configured correctly and that DNS lookup of the container registry does not fail. For more information, see [DNS](./networking.md#dns).

For more information, see [Networking in Azure Container Apps environment] (./networking.md).

## Review Ingress Configuration

::: zone pivot="portal"

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the **Search** bar at the top, enter your Azure Container Apps application name.
1. In the search results, under *Resources*, select your container app name.
1. In the navigation bar at the left, expand **Settings** and select **Ingress**.

- Verify the **Enabled** checkbox is checked.
- If you want to allow external ingress, verify that:
	- **Ingress Traffic** is set to **Accepting traffic from anywhere**.
	- Your Container Apps environment has *internalOnly* set to *false*.
- Verify **Ingress type** is set to the protocol (**HTTP** or **TCP**) your client uses to access your container app.
- Verify **Client certificate mode** is set to **Require** only if your client supports mTLS. For more information, see [Environment level network encryption](./networking.md#mtls)
- If your client uses HTTP/1, verify **Transport** is set to **HTTP/1**. If your client uses HTTP/2, verify **Transport** is set to **HTTP/2**.
- If your client cannot use a secure connection, verify **Insecure connections** > **Allowed** is enabled.
- Verify **Target port** is set to the same port your container app is listening on, or the same port exposed by your container app's Dockerfile.
- If **IP Security Restrictions Mode** isn't set to **Allow all traffic**, verify your client doesn't have an IP address that is denied.

::: zone-end

::: zone pivot="console"

### Verify ingress is enabled

Verify ingress is enabled with the [`az containerapp ingress show`](/cli/azure/containerapp/ingress#az-containerapp-ingress-show(containerapp)) command. If ingress is disabled, `az containerapp ingress show` returns nothing.

# [Bash](#tab/bash)

```azurecli
az containerapp ingress show \
  --name <YOUR_CONTAINER_APP_NAME> \
  --resource-group <YOUR_RESOURCE_GROUP_NAME>
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
az containerapp ingress show `
  --name <YOUR_CONTAINER_APP_NAME> `
  --resource-group <YOUR_RESOURCE_GROUP_NAME>
```

---

You can enable ingress with the [`az containerapp ingress enable`](/cli/azure/containerapp/ingress#az-containerapp-ingress-enable(containerapp)) command. You need to specify internal or external ingress, and the target port.

If ingress is enabled, Container Apps sends an HTTP request to your container app to determine if it's healthy. If your container app doesn't listen for HTTP traffic, you should disable ingress.

# [Bash](#tab/bash)

```azurecli
az containerapp ingress enable \
  --type <internal|external> \
  --target-port <YOUR_TARGET_PORT> \
  --name <YOUR_CONTAINER_APP_NAME> \
  --resource-group <YOUR_RESOURCE_GROUP_NAME>
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
az containerapp ingress enable `
  --type <internal|external> `
  --target-port <YOUR_TARGET_PORT> `  
  --name <YOUR_CONTAINER_APP_NAME> `
  --resource-group <YOUR_RESOURCE_GROUP_NAME>
```

---

### Verify external ingress is allowed

If you want to allow external ingress, verify `external` is set to `true`. Use the [`az containerapp ingress show`](/cli/azure/containerapp/ingress#az-containerapp-ingress-show(containerapp)) command, as described previously. You can expect output like the following example:

```json
{
  "allowInsecure": false,
  "clientCertificateMode": null,
  "corsPolicy": null,
  "customDomains": null,
  "exposedPort": 0,
  "external": true,
  "fqdn": "<YOUR_CONTAINER_APP_FQDN>",
  "ipSecurityRestrictions": null,
  "stickySessions": null,
  "targetPort": 3500,
  "traffic": [
  {
    "latestRevision": true,
    "weight": 100
  }
  ],
  "transport": "Auto"
}
```

If `external` is `false`, run the [`az containerapp ingress update`](/cli/azure/containerapp/ingress#az-containerapp-ingress-update(containerapp)) command with `--type external`. 

# [Bash](#tab/bash)

```azurecli
az containerapp ingress update \
  --name <YOUR_CONTAINER_APP_NAME> \
  --resource-group <YOUR_RESOURCE_GROUP_NAME> \
  --type external
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
az containerapp ingress update `
  --name <YOUR_CONTAINER_APP_NAME> `
  --resource-group <YOUR_RESOURCE_GROUP_NAME> `
  --type external
```

---

You can expect output like the following example:
  
```json
Ingress Updated. Access your app at <YOUR_CONTAINER_APP_ENDPOINT>

{
  ...
  "external": true,
  ...
}
```

### Verify transport

Verify `transport` is set to the same protocol (`auto`, `http`, `http2`, or `tcp`) your client uses to access your container app. Use the [`az containerapp ingress show`](/cli/azure/containerapp/ingress#az-containerapp-ingress-show(containerapp)) command as described previously. You can expect output like the following example:

```json
{
  ...
  "transport": "Auto"
}
```

If the transport isn't correct, run the [`az containerapp ingress update`](/cli/azure/containerapp/ingress#az-containerapp-ingress-update(containerapp)) command as described previously, with
`--transport <auto|http|http2|tcp>`.

### Verify target port

Verify your target port is set to the same port your container app is listening on. Use the [`az containerapp ingress show`](/cli/azure/containerapp/ingress#az-containerapp-ingress-show(containerapp)) command, as described previously. You can expect output like the following example:

```json
{
  ...
  "targetPort": 3500,
  ...
}
```

If the target port is incorrect, run the [`az containerapp ingress update`](/cli/azure/containerapp/ingress#az-containerapp-ingress-update(containerapp)) command as described previously, with
`--target-port <YOUR_TARGET_PORT>`.

### Verify IP access allowed

Use the [`az containerapp access-restriction list`](/cli/azure/containerapp/ingress/access-restriction#az-containerapp-ingress-access-restriction-list(containerapp)) command to verify your client does not have an IP address that is denied.

# [Bash](#tab/bash)

```azurecli
az containerapp access-restriction list \
  --name <YOUR_CONTAINER_APP_NAME> \
  --resource-group <YOUR_RESOURCE_GROUP_NAME> \
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
az containerapp access-restriction list `
  --name <YOUR_CONTAINER_APP_NAME> `
  --resource-group <YOUR_RESOURCE_GROUP_NAME> `
```

---

If you do not have any IP access restrictions, this command returns an empty list (`[]`).

::: zone-end

For more information, see [Ingress in Azure Container Apps](./ingress-overview.md).

## Verify networking configuration is correct

- If your VNet uses a custom DNS server instead of the default Azure-provided DNS server, configure your DNS server to forward unresolved DNS queries to `168.63.129.16`. [Azure recursive resolvers](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) uses this IP address to resolve requests. When configuring your NSG or firewall, don't block the `168.63.129.16` address, otherwise, your Container Apps environment won't function correctly.

For more information, see [Networking in Azure Container Apps environment](./networking.md).

## Verify health probes are configured correctly (Azure Portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the **Search** bar at the top, enter your Azure Container Apps application name.
1. In the search results, under *Resources*, select your container app name.
1. In the navigation bar at the left, expand *Application* and select **Containers**.
1. In the *Containers* page, select **Health probes**.

For all health probe types (liveness, readiness, and startup) that use TCP as their transport, verify their port numbers match the ingress target port you have configured for your container app.

If your container app takes an extended amount of time to start, verify you have configured your liveness and readiness probes' *Initial delay seconds* settings to accommodate this.

If your health probes are not configured correctly:

1. Select **Edit and deploy** to create a new revision.

1. In the *Create and deploy new revision* page, select the checkbox next to your container image and select **Edit**. The *Edit a container* pane appears at the right.

1. In the *Edit a container* pane, select **Health probes**. Update the configuration for your health probes as needed. Select the **Save** button.

1. In the *Create and deploy new revision* page, select the **Create** button.

If ingress is enabled, Container Apps sends an HTTP request to your container app to determine if it's healthy. If your container app doesn't listen for HTTP traffic, you should disable ingress.

For more information, see [Use Health Probes](./health-probes.md).

## Verify traffic is routed to correct revision

::: zone pivot="portal"

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the **Search** bar at the top, enter your Azure Container Apps application name.
1. In the search results, under *Resources*, select your container app name.
1. In the navigation bar at the left, expand *Application* and select **Revisions**.

In the *Revisions* page, if **Revision Mode** is set to `Single`, all traffic is routed to your latest revision by default. The **Active revisions** tab should list only one revision, with a *Traffic* value of `100%`.

If **Revision Mode** is set to `Multiple`, verify you are not routing any traffic to outdated revisions.

::: zone-end

::: zone pivot="console"

Use the [`az containerapp show`](/cli/azure/containerapp#az-containerapp-show(containerapp)) command to view the revision mode and traffic routing settings for your container app.

# [Bash](#tab/bash)

```azurecli
az containerapp show \
  --name <YOUR_CONTAINER_APP_NAME> \
  --resource-group <YOUR_RESOURCE_GROUP_NAME> \
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
az containerapp show `
  --name <YOUR_CONTAINER_APP_NAME> `
  --resource-group <YOUR_RESOURCE_GROUP_NAME> `
```

---

You can expect output like the following example:

```json
{
  "id": "/subscriptions/<YOUR_SUBSCRIPTION_ID>/resourceGroups/<YOUR_RESOURCE_GROUP_NAME>/providers/Microsoft.App/containerapps/<YOUR_CONTAINER_APP_NAME>",
  ...
  "properties": {
    "configuration": {
      "activeRevisionsMode": "Multiple",
	  ...
      "ingress": {
        ...
        "traffic": [
          {
            "revisionName": "<REVISION_2>",
            "weight": 100
          },
          {
            "revisionName": "<REVISION_1>",
            "weight": 0
          }
        ],
        ...
	  }
	  ...
	}
	...
  }
  ...
}
```

If `activeRevisionsMode` is `Single`, all traffic is routed to your latest revision by default. That revision should have a `weight` of `100`, and all other revisions should have `weight`s of `0`.

If `activeRevisionsMode` is `Multiple`, verify you are not routing any traffic to outdated revisions.

You can change the revision mode for your container app with the [az containerapp revision set-mode](/cli/azure/containerapp/revision#az-containerapp-revision-set-mode(containerapp)) command.

::: zone-end

For more information about configuring traffic splitting, see [Traffic splitting in Azure Container Apps](./traffic-splitting.md).

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Ensure Dapr is enabled in your environment

If you're using Dapr bindings and triggers in Azure Functions, you might encounter an error message like the following:

```plaintext
Dapr sidecar is not present. Please see (https://aka.ms/azure-functions-dapr-sidecar-missing) for more information.
```

This error typically occurs when Dapr is not properly enabled in your environment. Ensure Dapr is enabled in your environment using any of the three following solutions:

- **If your Azure Function is deployed in Azure Container Apps (ACA):**  
   Refer to [Dapr enablement instructions for the Dapr extension for Azure Functions](../azure-functions/functions-bindings-dapr.md#dapr-enablement).
- **If your Azure Function is deployed in Kubernetes:**  
   Ensure that your [deployment's YAML configuration](https://github.com/azure/azure-functions-dapr-extension/blob/master/deploy/kubernetes/kubernetes-deployment.md#sample-kubernetes-deployment) has the following annotations:  

    ```YAML
    annotations:
        dapr.io/enabled: "true"
        dapr.io/app-id: "functionapp"
        # Only define port of Dapr triggers are included
        dapr.io/app-port: "3001"
    ```
- **If you are running your Azure Function locally:**  
   Execute the following command to ensure you're [running the function app with Dapr](https://github.com/azure/azure-functions-dapr-extension/tree/master/samples/python-v2-azurefunction#step-2---run-function-app-with-dapr):  

    ```bash
    dapr run --app-id functionapp --app-port 3001  --components-path ..\components\ -- func host start 
    ```

To prevent this error in the future, verify that Dapr is properly set up and enabled in your environment before using Dapr bindings and triggers with Azure Functions.

## Verify app-port value in Dapr configuration

If you've provided an incorrect `app-port` value when running a function app using [Dapr Triggers for Azure Functions](../azure-functions/functions-bindings-dapr.md), you might receive the following error message.

```plaintext
The Dapr sidecar is configured to listen on port {portInt}, but the app server is running on port {appPort}. This may cause unexpected behavior. For more information, visit [this link](https://aka.ms/azfunc-dapr-app-config-error).
```

> [!NOTE]
> The Dapr extension for Azure Functions starts an HTTP server on port 3001. You can configure this port using the [`DAPR_APP_PORT` environment variable](https://docs.dapr.io/reference/environment/). If you provide an incorrect app_port value when running the Function app, it can lead to this problem.

1. Configure the correct `app_port` to Dapr in the Dapr configuration. Verify you've done the following in your container app's Dapr settings:

   - **If you're using a Dapr Trigger in your code**
      Make sure that the app port is set to `3001` or `DAPR_APP_PORT` if explicitly set as an environment variable for application.

   - **If you're _not_ using a Dapr Trigger in your code** 
      Make sure that the app port is _not_ set. It should be empty.

1. Ensure that you provide the correct DAPR_APP_PORT value to Dapr in the Dapr configuration.

   - **If using Azure Container Apps (ACA):**  
      Specify it in Bicep as shown below:

      ```bash
      DaprConfig: {
      ...
      appPort: 3001
      ...
      }
      ```

   - **If using a Kubernetes environment:**
      Set the `dapr.io/app-port` annotation:

      ```
      annotations:
          ...
          dapr.io/app-port: "3001"
          ...
      ```

   - **For local development:**
      Ensure you provide `--app-port` when running the function app with Dapr:

      ```
      dapr run --app-id functionapp --app-port 3001 --components-path ..\components\ -- func host start 
      ```

## Next steps

> [!div class="nextstepaction"]
> [Reliability in Azure Container Apps](/azure/reliability/reliability-azure-container-apps.md)
