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

## Symptoms

If your container app or revision is configured incorrectly, you might see the following issues.

- You receive an error message when you try to deploy a new revision.
- After you deploy a new revision, the new revision has a *Provision status* of *Provisioning* and a *Running status* of *Processing* indefinitely.
- A new revision takes more than 10 minutes to provision. It finally has a *Provision status* of *Provisioned*, but a *Running status* of *Degraded*. The *Running status* tooltip reads `Details: Deployment Progress Deadline Exceeded. 0/1 replicas ready.`
- The container app endpoint does not respond to requests.
- The container app endpoint responds to requests with `403 access denied`.

The following sections describe how to diagnose and resolve these issues.

## View Logs (Azure Portal)

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
1. Scroll to the right until you find the *Log_s* column. This column shows the console log output from your container app revision.
1. You might also want to narrow your query to view your container app revision's output to `stdout` or `stderr`.
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
1. When you type in a query, after you enter the `where` keyword, a drop-down list appears that shows you the columns available to query. You can also expand the *Schema and Filter* pane to the left, expand **Custom Logs**, and expand **ContainerAppConsoleLogs_CL**.

TODO1 Show how to view system logs.

Your container app's system logs capture TODO1.

For more information, see [Observability in Azure Container Apps](./observability.md).

## View logs (Azure PowerShell)

TODO1 Add.

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
- If you want to allow external ingress:
	- Verify **Ingress Traffic** is set to **Accepting traffic from anywhere**.
	- Verify your Container Apps environment has *internalOnly* set to *false*.
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
