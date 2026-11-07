---
title: Edge Actions
titleSuffix: Azure Front Door
description: Enhance security and performance with Azure Front Door edge actions. Learn how to create, manage, and attach custom JavaScript logic to your routes.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 11/05/2026
---

# Customization at the edge by using Azure Front Door edge actions

**Applies to:** :heavy_check_mark: Front Door Standard :heavy_check_mark: Front Door Premium

Use Azure Front Door Edge Actions to run custom JavaScript at Azure Front Door [points of presence (PoPs)](edge-locations-by-region.md). Edge Actions can modify client request and response properties before Front Door continues processing traffic.

:::image type="complex" source="media/edge-actions/edge-actions.png" alt-text="Diagram showing Edge Actions in example Front Door edge points of presence connected to users and origins.":::
   The diagram shows three example Azure Front Door edge points of presence in North America, Europe, and Asia. Each point of presence includes Edge Actions. Bidirectional arrows connect users and applications to the edge points of presence and connect those points of presence to one or more origin servers. The locations illustrate distributed execution and aren't an exhaustive list of Front Door edge locations.
:::image-end:::

## Supported capabilities

Edge Actions support both **client request** and **client response** invocations. Some supported scenarios include:

- A/B experimentation
- Request and response header manipulation
- Request rejection
- Dynamic origin selection
- URL rewrite
- URL redirect
- JSON Web Token (JWT) validation

### JavaScript samples for supported scenarios

Find JavaScript samples for these scenarios in the [Azure/EdgeActionsSamples](https://github.com/Azure/EdgeActionsSamples) community repository.

### Edge Actions size and resource limits

Each Edge Action resource has the following constraints:

- Code size: 16 KB
- Maximum versions: 3
- Execution time: 10 ms
- Maximum number of Edge Actions resources per subscription: 100

Currently, **JavaScript** is the only supported language.

For more information about service limits, see [Azure Front Door Standard and Premium service limits](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-front-door-standard-and-premium-service-limits).

### Important considerations 

- Set one version of the code as the default version for Edge Action invocations.
- Don't implement any unsupported methods in your code.
- Edge Action code can run for up to 10 ms. If execution exceeds this limit, the service stops the code and continues without Edge Action processing.
- You need to attach an Edge Action to the Azure Front Door route before it can execute against a client request or response.

## High-level flow with Edge Actions 

An Edge Action can run when Azure Front Door processes a client request or a client response. For more information about the underlying request flow, see [Routing architecture overview](front-door-routing-architecture.md?pivots=front-door-standard-premium).

:::image type="complex" source="media/edge-actions/client-request-response-flow.png" alt-text="Diagram showing Client Request and Client Response invocation points in the Front Door request and response flow.":::
   A client request enters Azure Front Door profile matching, Web Application Firewall evaluation, and the rules engine. At a Client Request invocation point, the rules engine can send the request to an Edge Action before caching and origin processing continue. An origin response returns through caching operations and can invoke an Edge Action at the Client Response invocation point before Front Door sends the response to the client. The Edge Action runs in a secure, isolated Hyperlight micro-VM within the Front Door edge server.
:::image-end:::

### Client request invocation

When you configure an Edge Action with the **Client Request** invocation point, the request follows this flow:

1. The request lands in one of the Azure Front Door edge PoP locations.

1. The request matches an Azure Front Door profile.

1. If the domain uses Azure Web Application Firewall (WAF), Azure Front Door evaluates the associated WAF rules. Otherwise, it skips this step.

1. If the request matches a rule configured in the Azure Front Door rule engine, Azure Front Door processes it.

1. If a matching rule invokes an Edge Action at the **Client Request** invocation point, the rules engine routes the request to that Edge Action.

1. The Edge Action runs in its [execution environment](#execution-environment) and modifies the request properties before Azure Front Door continues processing the request.

### Client response invocation

When you configure an Edge Action with the **Client Response** invocation point, the response follows this flow:

1. Azure Front Door receives a response from the origin, the cache, or internal Azure Front Door functionality.

1. The rules engine invokes the Edge Action at the **Client Response** invocation point and routes the response to it.

1. The Edge Action runs in its execution environment and modifies the response properties.

### Execution environment

For either invocation point, the Edge Action creates a Hyperlight sandbox and loads:

- A custom and secure JavaScript runtime.
- An immutable context variable that contains data from the [server variables](rule-set-server-variables.md), the healthy origins in the matched route, the request's originating country code, the device type derived from the request's user-agent header, and the current date-time stamp.
- The Edge Action code set as the default version. If you configure an execution filter and the corresponding header is set, the version selected by the filter runs instead.

## Create and manage an Edge Action

You can create an Edge Action from an existing Azure Front Door profile or create the resource separately.

### Create from an existing Azure Front Door profile

1. In the [Azure portal](https://portal.azure.com), go to your Azure Front Door profile.

1. Under **Settings**, select **Edge actions**.

1. Select **+ Create**. If the profile has no Edge Action associations, you can also use the creation option in the empty associations pane.

    :::image type="content" source="media/edge-actions/create-edge-action-from-profile.png" alt-text="Screenshot showing the Create options on an Azure Front Door profile's Edge actions page." lightbox="media/edge-actions/create-edge-action-from-profile.png":::

1. In **Create Edge Action**, enter or select the required details.

1. Select **Review + create**, and then select **Create**.

1. After deployment finishes, select **Go to resource**.

> [!IMPORTANT]
> Creating an Edge Action doesn't attach it to a route. To invoke it, [attach the Edge Action to an Azure Front Door route](#attach-edge-action-to-azure-front-door-route).

### Create without an existing Azure Front Door profile

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter *Edge Actions*. Select **Edge Actions** from the search results.

1. Select **+ Create**.

1. In **Create Edge Action**, enter or select the required details.

    :::image type="content" source="media/edge-actions/create-edge-action.png" alt-text="Screenshot that shows the Basic tab of creating an Edge Action." lightbox="media/edge-actions/create-edge-action.png":::

1. Select **Review + create**, and then select **Create**.

1. After the deployment finishes, select **Go to resource** to go to the Edge Action resource page.

    :::image type="content" source="media/edge-actions/edge-action-overview.png" alt-text="Screenshot that shows the Overview page of an Edge Action." lightbox="media/edge-actions/edge-action-overview.png":::

## Create a new version of Edge Action 

To process client requests or responses, each Edge Action must include at least one code version that contains JavaScript code. You can edit and test code in the browser or upload an existing JavaScript file. By using versions, you can safely manage and release updates for Edge Actions while keeping multiple versions available. You can create a new version and set it as the default without experiencing downtime during the switch. If an issue arises with the latest code, you can easily roll back to the previous version. You can create **up to three versions** for each Edge Action.

### Edit and test code in the browser

1. Under **Settings** of your Edge Action, select **Versions**.

1. Select **+ Add**, and enter the version name.

1. For **Code source**, select **Edit in browser**.

1. On the **Code** tab, enter your JavaScript code.

    :::image type="content" source="media/edge-actions/edit-code-in-browser.png" alt-text="Screenshot showing the browser code editor for an Edge Action version." lightbox="media/edge-actions/edit-code-in-browser.png":::

1. Select **Test**, and configure the request or response test inputs. Provide the headers, origins, and context that your scenario requires.

1. Select **Run test**. Review the **Summary**, **Console**, and **Raw output** to check the result and any console messages.

    :::image type="content" source="media/edge-actions/test-code-in-browser.png" alt-text="Screenshot showing Edge Action test inputs, the Run test button, and test results." lightbox="media/edge-actions/test-code-in-browser.png":::

> [!NOTE]
> These results are from a local test, not a live request through Azure Front Door. After you create the version and attach the Edge Action to a route, validate its behavior through Azure Front Door.

To save the version:

1. Select **Set default** if you want this version to run by default.

1. Select **OK** to create the version.

1. Verify that the provisioning state is **succeeded**.

### Upload an existing JavaScript file

1. Under **Settings** of your Edge Action, select **Versions**.

1. Select **+ Add**.

1. Enter the name of the version and upload the JavaScript code.

1. Select **Set default** if you want this version to run by default, and select **OK** to complete the creation.

    This operation creates a new version and uploads the JavaScript code. The portal displays the status for both operations separately. The **Upload code** operation can take up to 10 minutes.

1. When the new version is created, the portal shows the provisioning state as **succeeded**.

    :::image type="content" source="media/edge-actions/edge-action-versions.png" alt-text="Screenshot showing succeeded Edge Action versions with selectable version names and their default status." lightbox="media/edge-actions/edge-action-versions.png":::

1. When provisioning completes, select the version to view its JavaScript code.

    :::image type="content" source="media/edge-actions/edge-action-code.png" alt-text="Screenshot showing the selected Edge Action version, provisioning status, and JavaScript code viewer." lightbox="media/edge-actions/edge-action-code.png":::

## Attach Edge Action to Azure Front Door route

Currently, you can invoke Edge Actions only through Azure Front Door route configurations. Configure the Edge Action in a rule set and select **Client Request** or **Client Response** as its invocation point. You can attach an Edge Action to an Azure Front Door route in three ways:

1. Easy attach experience in Azure Front Door profile

1. Create a new rule set in Azure Front Door profile

1. Attach view in Edge Action resource

### Easy attach experience in Azure Front Door profile

This flow is useful for users who aren't familiar with the [Azure Front Door rules engine](front-door-rules-engine.md?pivots=front-door-standard-premium) and want to attach the Edge Action to the Azure Front Door.

#### Option 1: Edge actions page

1. In the Azure portal, go to your Azure Front Door profile.

1. Under **Settings**, select **Edge actions**, and then select **Associate with route**.

    :::image type="content" source="media/edge-actions/associate-with-route.png" alt-text="Screenshot showing Associate with route on the Azure Front Door Edge actions page." lightbox="media/edge-actions/associate-with-route.png":::

1. On **Resources**, select the Edge Action and the route to associate.

    :::image type="content" source="media/edge-actions/association-resources.png" alt-text="Screenshot showing the Edge Action, Front Door profile, and route selections on the Resources tab." lightbox="media/edge-actions/association-resources.png":::

1. On the **Rule Set** tab, configure the association based on the route's existing rule sets:

    If the route has no existing rule sets, enter or confirm the **Rule set name** and **Rule name**. For **Invocation point**, select **Client Request** or **Client Response**.

    :::image type="content" source="media/edge-actions/association-new-rule-set.png" alt-text="Screenshot showing rule set name, rule name, and invocation point for a route with no existing rule sets." lightbox="media/edge-actions/association-new-rule-set.png":::

    If existing rule sets are available, create a new rule set or reuse a rule set that already invokes this Edge Action. When you create a new rule set, select its invocation point. When you reuse a rule set, verify its displayed invocation point.

    :::image type="content" source="media/edge-actions/association-reuse-rule-set.png" alt-text="Screenshot showing reuse of an existing Edge Action rule set and the warning that all its rules apply to the route." lightbox="media/edge-actions/association-reuse-rule-set.png":::

1. Select **Associate**.

1. On the profile's **Edge actions** page, verify that the association appears.

    :::image type="content" source="media/edge-actions/association-complete.png" alt-text="Screenshot showing a completed Edge Action association with its rule, rule set, and route." lightbox="media/edge-actions/association-complete.png":::

> [!IMPORTANT]
> Every rule in a reused rule set applies to this route, including rules added or changed later.

#### Option 2: Route configuration

> [!NOTE]
> - For advanced operations such as custom rule set names, conditions, or actions, use the rules engine UI.
> - The *easy attach* creation flow checks whether a default rule set exists.
> - If it doesn't, the flow creates one with a default invocation rule. If a default rule set exists with a default rule for another Edge Action, the flow creates a new default rule with an incremented number at the end (for example, 002).

1. In the Azure portal, go to your Azure Front Door profile.

1. Under **Settings**, select **Front Door manager** and then select the specific endpoint.

1. In the **Routes** section, select the name of the route.

1. In **Update route**, scroll down and select the **Attach Edge Actions** link. The pane shows the Edge Actions available in that subscription and their default versions.

    :::image type="content" source="media/edge-actions/update-route.png" alt-text="Screenshot that shows how to update a route." lightbox="media/edge-actions/update-route.png":::

1. Select the Edge Action that you want to attach, and then select **Associate** to confirm selection.

    :::image type="content" source="media/edge-actions/attach-edge-action.png" alt-text="Screenshot that shows how to attach an Edge Action." lightbox="media/edge-actions/attach-edge-action.png":::

1. Select **Update** to save the changes.

### Create a new rule set in Azure Front Door profile

This flow is more elaborate and requires manual creation of the rule set before associating the Edge Action to the route configuration. At a high level, follow these steps:

1. In the Azure portal, go to your Azure Front Door profile.

1. Under **Settings**, select **Rule sets**. 

1. Create a new rule set and a rule with the required condition. Select **Invoke Edge Action** as the action, and select the Edge Action to invoke.

1. For **Invocation Point**, select **Client Request** or **Client Response**, depending on your scenario.

    :::image type="content" source="media/edge-actions/invocation-point.png" alt-text="Screenshot showing Client Request and Client Response choices for the Invoke Edge Action rule's invocation point." lightbox="media/edge-actions/invocation-point.png":::

1. Select **Save** to complete creation of the rule set.

1. Associate this rule set to a route like any other rule set. For more information, see [Configure rule sets](./standard-premium/how-to-configure-rule-set.md).

### Attach view in Edge Action resource

You can associate a route to an Edge Action through **Attachments**.

1. Under **Settings** of your Edge Action, select **Attachments**.

1. Select **+ Associate route**, and then select the corresponding Azure Front Door profile.

    :::image type="content" source="media/edge-actions/attachments-associate-route.png" alt-text="Screenshot that shows how to associate a route using Edge Action Attachment." lightbox="media/edge-actions/attachments-associate-route.png":::

1. Select **Next** and then select the route name.

1. Select **Next** to configure rule sets, and then select **Save**.

    When the route association is complete, you can see the details of the route you added listed in the **Attachments** view of your Edge Actions.

#### Verify Edge Action is attached

To check whether an Edge Action is attached to a route:

1. Under **Settings** of your Azure Front Door, select **Front Door manager**.

1. Select the route that you want to check.

1. In **Update route**, select **Manage Edge Actions** to verify Edge Action details or detach.

    :::image type="content" source="media/edge-actions/manage-edge-action.png" alt-text="Screenshot that shows how to check Edge Action details." lightbox="media/edge-actions/manage-edge-action.png":::

#### Detach Edge Action from route 

To detach an Edge Action from a route, you can go to the route as shown in the previous section or from the Edge Action itself as follows:

1. Under **Settings** of your Edge Action, select **Attachments**.

1. Select the association that you want to remove, and then select **Dissociate**.

    :::image type="content" source="media/edge-actions/dissociate-edge-action.png" alt-text="Screenshot that shows how to dissociate an Edge Action from a route." lightbox="media/edge-actions/dissociate-edge-action.png":::

## Execution filters

Execution filters control which version of an Edge Action runs on an Azure Front Door route:

- **Selective version routing:** Only the *default version* and versions that execution filters explicitly reference can run. Execution filters can **override the default version**.

- **Version protection:** Any version that an execution filter references is active. You can't delete or upgrade it while it's in use.

- **Zero-downtime switching:** Execution filters enable version transitions without downtime.

Execution filters work well for scenarios like:

- Canary rollouts

- A/B testing through header-based routing

- Safely deploying and validating new versions

### Apply an execution filter

To safely roll out a new version of Edge Action to production, follow these steps.

The screenshots in this procedure show different example resources. Use the versions and default settings from your own Edge Action resource.

1. Under **Settings** of your Edge Action, select **Versions**. Identify the default version and the nondefault version that you want to test.

    :::image type="content" source="media/edge-actions/edge-action-versions.png" alt-text="Screenshot showing Edge Action versions and the Default column used to identify the default and test versions." lightbox="media/edge-actions/edge-action-versions.png":::

1. Select **Execution filters**.

1. Select **+ Add**. For **Version**, select the nondefault version that you want to test. Set **Header name** to `test` and **Header value** to `execution`.

    The following image uses *Second* as an example test version. Choose the nondefault version from your own resource.

    :::image type="content" source="media/edge-actions/execution-filter.png" alt-text="Screenshot showing example execution-filter settings for a test version and request header." lightbox="media/edge-actions/execution-filter.png":::

1. On your client, include the `test` header with the value `execution` in requests that should run the test version. After you validate the new behavior, set that version as the default on the Edge Action resource.

The following logs show an example in which *First* runs for regular requests and *Second* runs when the request includes the execution-filter header:

:::image type="content" source="media/edge-actions/logs.png" alt-text="Screenshot that shows the logs." lightbox="media/edge-actions/logs.png":::

## Edge Action logs

You can configure Edge Action logs the same way you configure Azure Front Door logs. For more information, see [Configure Azure Front Door logs](./standard-premium/how-to-logs.md).

1. Under **Monitoring** of your Edge Action, select **Diagnostic settings**.

1. Select **+ Add diagnostic setting**.

1. In **Diagnostic setting**, select **allLogs** and **Send to Log Analytics workspace** checkboxes. Then, select the Log Analytics workspace that you want to use and its subscription.

    :::image type="content" source="media/edge-actions/diagnostic-setting.png" alt-text="Screenshot that shows the diagnostic setting." lightbox="media/edge-actions/diagnostic-setting.png":::

1. Select **Save**.

The `EdgeActionConsoleLog` table has the following schema:

| Column name | Column type | Description |
| --- | --- | --- |
| `TimeGenerated` | datetime | UTC time when the log was generated |
| `TrackingReference` | string | The unique reference string that identifies a request served by Azure Front Door. The `X-Azure-Ref` headers send the tracking reference to the client and origin. Use it to find the request in access or WAF logs. |
| `LogMessage` | string | A message that you specify by using `console.log` in your Edge Action code |
| `EdgeActionVersion` | string | Edge Action version that generated this log message |
| `Type` | string | Log type. The supported value is `EdgeActionConsoleLog`. |
| `ResourceId` | string | Resource ID of your Edge Action |

## Azure Front Door logs 

You can also use Azure Front Door access logs to check whether an Edge Action ran.

| Column name | Column type | Description |
| --- | --- | --- |
| `edgeActionsStatusCode` | string | Edge Action execution status: **200** means successful execution; **503** means an error occurred during execution. |

## Pricing

Edge actions follow a simple two-part pricing model based on the number of invocations and execution time beyond 1 ms for each invocation. For details about edge actions pricing, see [Azure Front Door pricing](https://azure.microsoft.com/pricing/details/frontdoor/), including applicable billing meters and usage-based charges on invocations and execution time. For more information, see [Understanding Azure Front Door billing: Example 7](billing.md#example-7-edge-actions).

## Related content

- For reference documentation, see [Edge Actions REST API](/rest/api/edge-actions/operation-groups), [`az edge-action`](/cli/azure/edge-action), or the [Azure PowerShell Az.EdgeAction module](/powershell/module/az.edgeaction).
- To learn about service limits, see [Azure Front Door Standard and Premium service limits](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-front-door-standard-and-premium-service-limits).
- To learn about Azure Front Door, see [What is Azure Front Door?](front-door-overview.md)
