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

Reviewing Azure Container Apps logs and configuration settings can reveal underlying issues if your container app isn't behaving correctly.

## Scenarios

The following table lists issues you might encounter while using Azure Container Apps, and the actions you can take to help resolve these issues.

| Scenario | Description | Actions |
|--|--|--|
| All scenarios | | [View logs](#view-logs)<br><br>[Use Diagnose and solve problems](#use-the-diagnose-and-solve-problems-tool) |
| Error deploying new revision | You receive an error message when you try to deploy a new revision. | [Verify Container Apps can pull your container image](#verify-accessibility-of-container-image) |
| Provisioning takes too long | After you deploy a new revision, the new revision has a *Provision status* of *Provisioning* and a *Running status* of *Processing* indefinitely. | [Verify health probes are configured correctly](#verify-health-probes-are-configured-correctly) |
| Revision is degraded | A new revision takes more than 10 minutes to provision. It finally has a *Provision status* of *Provisioned*, but a *Running status* of *Degraded*. The *Running status* tooltip reads `Details: Deployment Progress Deadline Exceeded. 0/1 replicas ready.` | [Verify health probes are configured correctly](#verify-health-probes-are-configured-correctly) |
| Requests to endpoint fail | The container app endpoint doesn't respond to requests. | [Review ingress configuration](#review-ingress-configuration) |
| Requests return status 403 | The container app endpoint responds to requests with HTTP error 403 (access denied). |  [Verify networking configuration is correct](#verify-networking-configuration-is-correct) |
| Responses not as expected | The container app endpoint responds to requests, but the responses aren't as expected. | [Verify traffic is routed to correct revision](#verify-traffic-is-routed-to-correct-revision)<br><br>[Verify you're using unique tags when deploying images to the container registry](/azure/container-registry/container-registry-image-tag-version) |

## View logs

A helpful first step in diagnosing an issue with a container app is to view its logs.

### Console logs

Your container app's console logs capture the app's `stdout` and `stderr` streams. You can view the console logs as follows.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the **Search** bar, enter your container app's name.
1. In the search results, under *Resources*, select your container app's name.
1. In the navigation bar, expand **Application** and select **Revisions**.
1. In the *Revisions* page, make sure **Active revisions** is selected, then select the revision.
1. The *Revision details* window appears.
1. In the *Revision details* window, next to *Console logs*, select the **View details** link.
1. The **View details** link takes you to the *Logs* page, with the following query.
    ```
    ContainerAppConsoleLogs_CL
    | where RevisionName_s == "<YOUR_REVISION_NAME>"
    ```
1. In the results window, make sure **Results** is selected. By default, the results are sorted by time in descending order. The time range defaults to **Last 24 hours**.
1. Examine the `Log_s` column, which shows the console log output from your container app revision.
1. Optionally, select the **Export** button, which allows you to view the logs as a .csv file, or in Excel or Power BI.

You can also narrow your query to view `stdout` or `stderr`.

#### stdout

To view `stdout`:

1. Change your query to the following:

```
ContainerAppConsoleLogs_CL
| where RevisionName_s == "<YOUR_REVISION_NAME>"
and Stream_s == "stdout"
```

2. Select **Run**.

#### stderr

To view `stderr`:

1. Change your query to the following:

```
ContainerAppConsoleLogs_CL
| where RevisionName_s == "<YOUR_REVISION_NAME>"
and Stream_s == "stderr"
```

2. Select **Run**.

### System logs

Container Apps generates [system logs](./logging.md#system-logs) for service level events. You can view the system logs as follows:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the **Search** bar, enter your container app's name.
1. In the search results, under *Resources*, select your container app's name.
1. In the navigation bar, expand **Application** and select **Revisions**.
1. In the *Revisions* page, make sure **Active revisions** is selected, then select the revision.
1. The *Revision details* window appears.
1. In the *Revision details* window, next to *System logs*, select the **View details** link.
1. The **View details** link takes you to the *Logs* page, with the following query.
    ```
    ContainerAppSystemLogs_CL
    | where RevisionName_s == "<YOUR_REVISION_NAME>"
    ```
1. In the results window, make sure **Results** is selected. By default, the results are sorted by time in descending order. The time range defaults to **Last 24 hours**.
1. Examine the contents of the `Error_s`, `Log_s`, `Type_s`, `Reason_s`, and `EventSource_s` columns.

For more information, see [Observability in Azure Container Apps](./observability.md).

## Use the diagnose and solve problems tool

You can use the **diagnose and solve problems** tool to discover issues with your container app's health, configuration, and performance.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the **Search** bar, enter your container app's name.
1. In the search results, under *Resources*, select your container app's name.
1. In the navigation bar, select **Diagnose and solve problems**.
1. In the *Diagnose and solve problems* page, select one of the *Troubleshooting categories*.
1. Container Apps analyzes your container app's configuration and usage data. You can view the results of this analysis by selecting one of the categories in the navigation bar.

## Verify accessibility of container image

If you receive an error message when you try to deploy a new revision, verify Container Apps is able to pull your container image.

- Verify your container environment firewall isn't blocking access to the container registry. For more information, see [Control outbound traffic with user defined routes](./user-defined-routes.md).
- If your existing VNet uses a custom DNS server instead of the default Azure-provided DNS server, verify your DNS server is configured correctly and that DNS lookup of the container registry doesn't fail. For more information, see [DNS](./networking.md#dns).
- For a Docker container that can run as a console application, run:
    ```
    docker run --rm <YOUR_CONTAINER_IMAGE>
    ```

For more information, see [Networking in Azure Container Apps environment](./networking.md).

## Review ingress configuration

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the **Search** bar, enter your container app's name.
1. In the search results, under *Resources*, select your container app's name.
1. In the navigation bar, expand **Settings** and select **Ingress**.

| Issue | Action |
|--|--|
| Is ingress enabled? | Verify the **Enabled** checkbox is checked. |
| Do you want to allow external ingress? | Verify that **Ingress Traffic** is set to **Accepting traffic from anywhere**. If your container app doesn't listen for HTTP traffic, set **Ingress Traffic** to **Limited to Container Apps Environment**. |
| Does your client use HTTP or TCP to access your container app? | Verify **Ingress type** is set to the correct protocol (**HTTP** or **TCP**). |
| Does your client support mTLS? | Verify **Client certificate mode** is set to **Require** only if your client supports mTLS. For more information, see [Environment level network encryption.](./networking.md#mtls) |
| Does your client use HTTP/1 or HTTP/2? | Verify **Transport** is set to the correct HTTP version (**HTTP/1** or **HTTP/2**). |
| Is the target port set correctly? | Verify **Target port** is set to the same port your container app is listening on, or the same port exposed by your container app's Dockerfile. |
| Is your client IP address denied? | If **IP Security Restrictions Mode** isn't set to **Allow all traffic**, verify your client doesn't have an IP address that is denied. |

For more information, see [Ingress in Azure Container Apps](./ingress-overview.md).

## Verify networking configuration is correct

[Azure recursive resolvers](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) uses the IP address `168.63.129.16` to resolve requests.

1. If your VNet uses a custom DNS server instead of the default Azure-provided DNS server, configure your DNS server to forward unresolved DNS queries to `168.63.129.16`. 
1. When configuring your NSG or firewall, don't block the `168.63.129.16` address.

For more information, see [Networking in Azure Container Apps environment](./networking.md).

## Verify health probes are configured correctly

For all health probe types (liveness, readiness, and startup) that use TCP as their transport, verify their port numbers match the ingress target port you configured for your container app.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the **Search** bar, enter your container app's name.
1. In the search results, under *Resources*, select your container app's name.
1. In the navigation bar, expand *Application* and select **Containers**.
1. In the *Containers* page, select **Health probes**.
1. Expand **Liveness probes**, **Readiness probes**, and **Startup probes**.
1. For each probe, verify the **Port** value is correct.

You can update the **Port** values as follows:

1. Select **Edit and deploy** to create a new revision.
1. In the *Create and deploy new revision* page, select the checkbox next to your container image and select **Edit**. The *Edit a container* window appears.
1. In the *Edit a container* window, select **Health probes**.
1. Expand **Liveness probes**, **Readiness probes**, and **Startup probes**.
1. For each probe, edit the **Port** value.
1. Select the **Save** button.
1. In the *Create and deploy new revision* page, select the **Create** button.

### Configure health probes for extended startup time

If ingress is enabled, the following default probes are automatically added to the main app container if none is defined for each type.

| Probe type | Default values |
|--|--|
| Startup | Protocol: TCP<br>Port: ingress target port<br>Timeout: 3 seconds<br>Period: 1 second<br>Initial delay: 1 second<br>Success threshold: 1<br>Failure threshold: 240 |
| Readiness | Protocol: TCP<br>Port: ingress target port<br>Timeout: 5 seconds<br>Period: 5 seconds<br>Initial delay: 3 seconds<br>Success threshold: 1<br>Failure threshold: 48 |
| Liveness | Protocol: TCP<br>Port: ingress target port |

If your container app takes an extended amount of time to start (which is common in Java) you might need to customize your liveness and readiness probes' *Initial delay seconds* accordingly.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the **Search** bar, enter your container app's name.
1. In the search results, under *Resources*, select your container app's name.
1. In the navigation bar, expand *Application* and select **Containers**.
1. In the *Containers* page, select **Health probes**.
1. Select **Edit and deploy** to create a new revision.
1. In the *Create and deploy new revision* page, select the checkbox next to your container image and select **Edit**. The *Edit a container* window appears.
1. In the *Edit a container* window, select **Health probes**.
1. Expand **Liveness probes**.
1. If **Enable liveness probes** is selected, increase the value for **Initial delay seconds**.
1. Expand **Readiness probes**.
1. If **Enable readiness probes** is selected, increase the value for **Initial delay seconds**.
1. Select the **Save** button.
1. In the *Create and deploy new revision* page, select the **Create** button.

For more information, see [Use Health Probes](./health-probes.md).

## Verify traffic is routed to correct revision

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the **Search** bar, enter your container app's name.
1. In the search results, under *Resources*, select your container app's name.
1. In the navigation bar, expand *Application* and select **Revisions**.

If **Revision Mode** is set to `Single`, all traffic is routed to your latest revision by default. The **Active revisions** tab should list only one revision, with a *Traffic* value of `100%`.

If **Revision Mode** is set to `Multiple`, verify you're not routing any traffic to outdated revisions.

For more information about configuring traffic splitting, see [Traffic splitting in Azure Container Apps](./traffic-splitting.md).

## Next steps

> [!div class="nextstepaction"]
> [Reliability in Azure Container Apps](../reliability/reliability-azure-container-apps.md)
