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

TODO1 Intro here.

Azure Container Apps manages automatic horizontal scaling through a set of declarative scaling rules. As a container app scales out, new instances of the container app are created on-demand. These instances are known as replicas.

In this tutorial, you add an HTTP scale rule to your container app and observe how your application scales.

## Prerequisites

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have an Azure account, you can [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). <br><br>You need the *Contributor* permission on the Azure subscription to proceed. Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md?tabs=current) for details. |
| GitHub Account | Get one for [free](https://github.com/join). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli). |

::: zone pivot="console"

## Setup

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

::: zone-end

## Symptoms

If your container app or revision is configured incorrectly, you might see the following issues.

- You receive an error message when you try to deploy a new revision.
- After you deploy a new revision, the new revision has a *Provision status* of *Provisioning* and a *Running status* of *Processing* indefinitely.
- A new revision takes more than 10 minutes to provision. It finally has a *Provision status* of *Provisioned*, but a *Running status* of *Degraded*. The *Running status* tooltip reads `Details: Deployment Progress Deadline Exceeded. 0/1 replicas ready.`
- The container app endpoint doesn't respond to requests.
- The container app endpoint responds to requests with HTTP error 403 (access denied).

The following sections describe how to diagnose and resolve these issues.

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

## Review Ingress Configuration

TODO1 Source: https://azureossd.github.io/2022/08/01/Container-Apps-and-failed-revisions-Copy/, Incorrect Ingress.

::: zone pivot="portal"

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the **Search** bar at the top, enter your Azure Container Apps application name.
1. In the search results, under *Resources*, select your container app name.
1. In the navigation bar at the left, expand **Settings** and select **Ingress**.

- Verify the **Enabled** checkbox is checked.
- If you want to allow external ingress, verify that:
	- **Ingress Traffic** is set to **Accepting traffic from anywhere**.
	- Your Container Apps environment has *internalOnly* set to *false*. TODO1 Where is that?

TODO1 These next four items might not be useful. Check with PMs before we replicate to console.
- Verify **Ingress type** is set to the protocol (**HTTP** or **TCP**) your client uses to access your container app.
- Verify **Client certificate mode** is set to **Require** only if your client supports mTLS. For more information, see [Environment level network encryption](./networking.md#mtls)
- If your client uses HTTP/1, verify **Transport** is set to **Auto** or **HTTP/1**. If your client uses HTTP/2, verify **Transport** is set to **Auto** or **HTTP/2**.
- If your client cannot use a secure connection, verify **Insecure connections** > **Allowed** is enabled.

- Verify **Target port** is set to the same port your container app is listening on, or the same port exposed by your container app's Dockerfile.
- If **IP Security Restrictions Mode** isn't set to **Allow all traffic**, verify your client doesn't have an IP address that is denied.

TODO1
x Where is environment configuration in Portal? You have to know your environment name and search for it.
- How to set env internalOnly to true/false on env in Portal?
- Portal ingress traffic setting is confusing. It sounds like env internalOnly setting partially overrides this.
- env show in console does not show internalOnly.
/ How to find what env your app belongs to in console? containerapp show > managedEnvironmentId. Can we then query on that ID?
x Console does not show setting for HTTP/TCP. Okay, it's --transport.
- Things to note:
	- Port mismatch. For HTTP ingress your port is always 443. However that is the exposed port, not the target port.
	- TCP ingress is only available with custom vnet.

::: zone-end

::: zone pivot="console"

### Verify ingress is enabled

Verify ingress is enabled with the [`az containerapp ingress show`](/cli/azure/containerapp/ingress#az-containerapp-ingress-show(containerapp)) command. If ingress is disabled, `az containerapp ingress show` returns nothing.

TODO1 This is confusing, especially for Linux people (for whom no output means no error), and should be changed so that az container app ingress show explicitly states ingress is disabled.

# [Bash](#tab/bash)

```azurecli
az containerapp ingress show \
  --name <YOUR_CONTAINER_APP_NAME> \
  --resource-group <YOUR_RESOURCE_GROUP_NAME> \
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
az containerapp ingress show `
  --name <YOUR_CONTAINER_APP_NAME> `
  --resource-group <YOUR_RESOURCE_GROUP_NAME> `
```

---

You can enable ingress with the [`az containerapp ingress enable`](/cli/azure/containerapp/ingress#az-containerapp-ingress-enable(containerapp)) command. You need to specify internal or external ingress, and the target port.

TODO1 Repeat this in Configure health probes section?
> [!NOTE]
> If ingress is enabled, Container Apps sends an HTTP request to your container app to determine if it's healthy. If your container app doesn't listen for HTTP traffic, you should disable ingress.

# [Bash](#tab/bash)

```azurecli
az containerapp ingress enable \
  --type <internal|external> \
  --target-port <YOUR_TARGET_PORT> \
  --name <YOUR_CONTAINER_APP_NAME> \
  --resource-group <YOUR_RESOURCE_GROUP_NAME> \
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
az containerapp ingress enable `
  --type <internal|external> `
  --target-port <YOUR_TARGET_PORT> `  
  --name <YOUR_CONTAINER_APP_NAME> `
  --resource-group <YOUR_RESOURCE_GROUP_NAME> `
```

---

### Verify external ingress is allowed

If you want to allow external ingress, verify your app is configured accordingly. Use the [`az containerapp ingress show`](/cli/azure/containerapp/ingress#az-containerapp-ingress-show(containerapp)) command, as described previously. You can expect output like the following example:

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

Verify `external` is `true`. If not, run the [`az containerapp ingress enable`](/cli/azure/containerapp/ingress#az-containerapp-ingress-enable(containerapp)) command, as described previously, with `--type external`. You can expect output like the following example:
  
```json
Ingress enabled. Access your app at <YOUR_CONTAINER_APP_ENDPOINT>

{
  ...
  "external": true,
  ...
}
```

### Verify target port

Verify your target port is set to the same port your container app is listening on. Use the [`az containerapp ingress show`](/cli/azure/containerapp/ingress#az-containerapp-ingress-show(containerapp)) command, as described previously. You can expect output like the following example:

```json
{
  ...
  "targetPort": 3500,
  ...
}
```

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

TODO1 What about CORS?

For more information, see [Ingress in Azure Container Apps](./ingress-overview.md).

## Verify health probes are configured correctly

TODO1 Source:
https://azureossd.github.io/2022/08/01/Container-Apps-and-failed-revisions-Copy/, Health Probes

::: zone pivot="portal"

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

::: zone-end

::: zone pivot="console"

TODO1 Can we configure health probes from command line? We can view them. containerapp show > template > containers > probes.

::: zone-end

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

::: zone-pivot="console"

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

TODO1 Can you configure traffic routing in command line? The doc for [`az containerapp revision label`](/cli/azure/containerapp/revision/label) says "Manage revision labels assigned to traffic weights." but there is nothing in the actual commands/flags relating to traffic weights.

::: zone-end

## Conclusion

TODO1 Add?

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

TODO1 Figure out next step. Maybe Ingress if we split that into separate topic.

> [!div class="nextstepaction"]
> [Set scaling rules in Azure Container Apps](scale-app.md)
