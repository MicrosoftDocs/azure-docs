---
title: Monitor Azure IoT Hub with the MQTT v5 connection profile
titleSuffix: Azure IoT Hub
description: Collect IoT Hub resource logs, discover metrics, verify routing outcomes, and troubleshoot the device-to-destination pipeline.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: how-to
ms.date: 11/10/2026
---

# Monitor and troubleshoot Azure IoT Hub with the MQTT v5 connection profile

Monitor the complete path from device provisioning to destination receipt.
A connected device, a successful publish, and a message available to a
downstream application are separate checkpoints.

Use IoT Hub metrics to identify changes over time and resource logs to
investigate individual operations. Use Device Provisioning Service (DPS)
diagnostics for provisioning failures and destination diagnostics for
downstream ingestion problems.

## Prerequisites

- An IoT hub with the MQTT v5 connection profile.
- Permission to read monitoring data and configure diagnostic settings.
- A Log Analytics workspace if you want to query exported resource logs.
- A known test device and a destination reader.
- The resource IDs of the hub and monitoring destination.
- For `az iot` commands, complete the
  [preview CLI setup](mqtt-v5-cloud-setup.md?tabs=cli#create-azure-iot-hub-with-the-mqtt-v5-connection-profile).

Platform metrics are collected automatically. Resource logs require diagnostic
settings to collect and export them. Enable collection before reproducing a
problem; it doesn't recover logs from an earlier uncollected period.
For collection, access, and cost considerations, see
[Diagnostic settings in Azure Monitor](/azure/azure-monitor/data-collection/diagnostic-settings).

## Discover available signals

Use the metrics and log categories exposed by the actual resource. Don't
assume every classic-profile metric, dimension, or log category applies to
this preview.

In the portal, inspect **Monitoring** > **Metrics** and
**Monitoring** > **Diagnostic settings** on the hub.

Alternatively, use the following Azure CLI commands. These examples use
PowerShell and require an authenticated CLI session in the correct subscription.

```powershell
$hubId = "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Devices/IotHubs/<hub-name>"
az monitor metrics list-definitions --resource $hubId --output json
az monitor diagnostic-settings categories list --resource $hubId --output json
```

Record the metric API names, supported aggregations, dimensions, and log
categories returned for the resource. Use these values rather than guessing
names from a chart label.

## Collect resource logs

The following methods use Azure Monitor diagnostic settings. Choose a log
category returned by discovery and a Log Analytics workspace you can access.
Resource-specific categories and their usefulness still depend on the hub.

Inspect existing diagnostic settings before using the example name
`hub-preview-diagnostics`. If that name is already in use, either choose an
unused name in the example or intentionally update the existing setting while
preserving its required log categories, metrics, and destinations. Don't
replace another workload's collection configuration with this minimal example.

### [Azure portal](#tab/portal)

1. Open the hub and select **Monitoring** > **Diagnostic settings**.
1. Select **Add diagnostic setting**.
1. Enter a descriptive name, such as `hub-preview-diagnostics`.
1. Select the available log categories relevant to your test.
1. Select **Send to Log Analytics workspace**, then select the subscription
   and workspace.
1. Save the setting.
1. Reproduce the operation and check that new records arrive.

### [Azure CLI](#tab/cli)

Create `logs.json` with the following content, replacing the placeholder with
an available log category:

```json
[
  {
    "category": "<available-log-category>",
    "enabled": true
  }
]
```

In the directory containing that file, set both resource IDs in the current
PowerShell session and inspect existing settings:

```powershell
$hubId = "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Devices/IotHubs/<hub-name>"
$workspaceId = "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.OperationalInsights/workspaces/<workspace-name>"
az monitor diagnostic-settings list --resource $hubId --output json
```

After confirming which setting to create or update, run each command separately
and resolve errors before continuing. Change the setting name in both commands
if needed. File input avoids shell-specific JSON quoting differences.

```powershell
az monitor diagnostic-settings create --name hub-preview-diagnostics --resource $hubId --workspace $workspaceId --logs "@logs.json"
az monitor diagnostic-settings show --name hub-preview-diagnostics --resource $hubId
```

The `show` result verifies configuration, not log ingestion. Generate a new
operation and inspect the workspace to verify collection.

### [ARM template](#tab/arm)

The following resource group template creates the equivalent diagnostic
setting for an existing hub and workspace. Save it as `diagnostics.json`.
Deploy it to the hub's resource group and supply a discovered log category.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "hubName": { "type": "string" },
    "workspaceId": { "type": "string" },
    "logCategory": { "type": "string" }
  },
  "resources": [
    {
      "type": "Microsoft.Insights/diagnosticSettings",
      "apiVersion": "2021-05-01-preview",
      "scope": "[format('Microsoft.Devices/IotHubs/{0}', parameters('hubName'))]",
      "name": "hub-preview-diagnostics",
      "properties": {
        "workspaceId": "[parameters('workspaceId')]",
        "logs": [
          {
            "category": "[parameters('logCategory')]",
            "enabled": true
          }
        ]
      }
    }
  ]
}
```

Deploy by using Azure CLI from PowerShell:

```powershell
az deployment group create --resource-group "<hub-resource-group>" --template-file diagnostics.json --parameters hubName="<hub-name>" workspaceId="<workspace-resource-id>" logCategory="<available-log-category>"
```

This method is ARM deployment through CLI, not a separate native IoT Hub command.
For the underlying resource contract, see
[Diagnostic settings ARM reference](/azure/templates/microsoft.insights/diagnosticsettings).

---

## Troubleshoot CLI setup

Check the CLI version and active extension before changing Azure resources:

```azurecli
az version
```

```azurecli
az extension show --name azure-iot --query version --output tsv
```

| Symptom | Action |
| --- | --- |
| `--connection-profile`, `adr`, or `topic-group` isn't recognized | Verify the preview extension in the current terminal. If using an isolated extension directory, select it again in each new terminal. |
| An operation reports `InvalidResourceType` for an API version | Check that the extension release and target service environment support the same API version. Repeated resource creation won't resolve an API-version mismatch. |
| Linking reports a permission error | Check the caller's role-assignment permission and the service identities and scopes in [hub setup](mqtt-v5-cloud-setup.md#configure-the-linked-resources). |
| DPS reports no hub with availability `Available` | Inspect the namespace's hub endpoint, link state, availability, and allocation weight. These properties must be configured when you create the link. Don't delete resources as a first troubleshooting step. |
| Direct DPS hub linking is rejected | Use `az iot adr ns link add` for this profile rather than `az iot dps linked-hub create`. |
| A routing condition is rejected with a syntax error | Read back the saved condition and check shell quoting. Compare the expression with [Topic and user-property queries](iot-hub-devguide-routing-query-syntax.md#filter-by-mqtt-topic-and-user-properties). |

### Inspect a partially completed link

The combined link command can leave DPS linked to an Azure Device Registry
(ADR) namespace even if hub linking fails.
Inspect the actual endpoints rather than rerunning the combined command:

```azurecli
az iot adr ns link dps list --ns "<ADR_NAMESPACE_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --output json
```

```azurecli
az iot adr ns link hub show --name primary-hub --ns "<ADR_NAMESPACE_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --output json
```

If the hub endpoint exists and its linking state is pending, wait for it:

```azurecli
az iot adr ns link hub wait --name primary-hub --ns "<ADR_NAMESPACE_NAME>" --resource-group "<RESOURCE_GROUP_NAME>"
```

If that endpoint is in a failed state, first correct the reported permission or
configuration issue. Then retry the existing endpoint without replacing its
identity:

```azurecli
az iot adr ns link hub update --name primary-hub --ns "<ADR_NAMESPACE_NAME>" --resource-group "<RESOURCE_GROUP_NAME>"
```

If DPS succeeded but the hub endpoint is absent, add only the missing hub link:

```azurecli
az iot adr ns link hub add --name primary-hub --ns "<ADR_NAMESPACE_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --hub-id "<HUB_RESOURCE_ID>" --system-assigned-mi --availability Available --allocation-weight 1
```

Recheck both resources and the namespace after recovery. Don't assume a
successful DPS link also means the hub is ready.

### Inspect resource and link states through ARM REST

These read-only checks use Azure Resource Manager through `az rest`. They
don't require the preview IoT extension. Sign in with `az login` and use the
full resource IDs saved during setup.

```azurecli
az rest --method get --uri "https://management.azure.com<HUB_RESOURCE_ID>?api-version=2026-10-01-preview" --query "{state:properties.state,provisioningState:properties.provisioningState,namespaceLink:properties.deviceRegistry.linkingProperties.state}" --output json
```

```azurecli
az rest --method get --uri "https://management.azure.com<DPS_RESOURCE_ID>?api-version=2026-11-01" --query "{state:properties.state,namespaceLinks:properties.deviceRegistryNamespaces}" --output json
```

```azurecli
az rest --method get --uri "https://management.azure.com<ADR_NAMESPACE_RESOURCE_ID>?api-version=2026-11-01" --query "{state:properties.provisioningState,dps:properties.provisioning.endpoints,hubs:properties.messaging.endpoints}" --output json
```

Check the named namespace endpoints, their target resource IDs, and their
`linkingState` values. A successful namespace deployment with no endpoints
isn't evidence of successful linking. Also check the hub endpoint's
`provisioning.availability` before attempting device provisioning.

For a hub configuration update that returns HTTP `412`, use a new GET and
reapply the intended change to the latest resource. Don't drop the `If-Match`
header or update only the ETag on an old body. See
[Update an existing IoT hub through ARM REST](mqtt-v5-custom-topics.md#update-an-existing-iot-hub-through-arm-rest).

## Monitor a test run

Record the UTC start and end time, assigned device ID, message identifier, topic
if applicable, route, and destination. Don't include credentials in test notes.

| Stage | Signal or observation | What to check |
| --- | --- | --- |
| Provisioning | DPS result and device SDK logs | Intended hub assignment and onboarding credential |
| Connection | SDK connection state and available connection metrics and logs | Certificate validity, server trust, and session readiness |
| Ingress | Publish result and available telemetry metrics | Accepted publishes, failures, or throttling |
| Routing | Available route delivery metrics and resource logs | Matching route, destination failures, and authorization |
| Consumption | Destination logs and the receiving application | Same test message, expected metadata, and usable payload |

In Metrics, select the metric and aggregation appropriate to your question,
and use available dimensions to isolate a destination or outcome. A total
across all endpoints can hide a failure at one endpoint.

In Logs, select the table populated by your diagnostic setting and restrict
the query to the hub and the test time window. Inspect its schema before
writing filters; don't assume a table name or field from another resource.
Resource logs aren't a substitute for reading telemetry at the destination.

## Troubleshoot by the first failing stage

| Symptom | First checks |
| --- | --- |
| Provisioning fails | DPS ID scope, enrollment state, onboarding credential, and linked hub. Symmetric-key onboarding requires configured DPS certificate issuance and a device certificate signing request; existing X.509 onboarding doesn't require new issuance. |
| TLS or connection fails | Assigned device endpoint, device clock, certificate/private key, trusted server roots, network access |
| Custom-topic publish is refused | Configured topic templates, concrete publish topic rather than a wildcard, assigned hub device ID, and SDK acknowledgment or error details |
| Publish succeeds but no data arrives | Enabled route, source, query, endpoint access, destination reader |
| Some messages don't arrive | Selective query behavior, content metadata, throttling, destination health |
| Payload arrives but columns are empty | Endpoint Message Format, destination envelope, and consumer field mapping. For Fabric, inspect CloudEvents data; with Standardized output, locate the original JSON under the observation's `payload.value`. |
| Expected enrichment is missing | Enrichment key/value, target endpoint, and received metadata. For Fabric, check its enrichment naming restrictions; don't look for the enrichment inside the device payload. |
| No resource logs appear | Diagnostic setting scope/categories, permissions, new activity, ingestion delay, selected workspace/table |

Fallback is disabled for preview. Don't look for an implicit
customer-accessible destination for messages that match no enabled route.

Topic templates aren't per-device RBAC assignments. See
[Publisher identity and preview access control](mqtt-v5-custom-topics.md#publisher-identity-and-preview-access-control)
when investigating custom-topic behavior.

A route's **Data schema reference** doesn't validate or transform the payload.
The endpoint's **Message format** and its transport envelope determine how
the consumer must locate the original data. For format and enrichment checks,
see [Verify actual delivery at the destination](mqtt-v5-device-setup.md#verify-actual-delivery-at-the-destination).

## Configure actionable alerts

After establishing a baseline, define alerts for the failures your operators
can act on. Examples include a sustained connection drop, increasing routing
failures, or no destination data during an expected publishing interval.

Choose metrics or log queries available for this resource, an evaluation
window suited to the workload, and a tested notification/action group.
Don't use one threshold for every fleet size or message rate. For supported
alert configuration methods, see
[Create a metric alert rule](/azure/azure-monitor/alerts/alerts-create-metric-alert-rule).

## Next steps

- Recheck [routing](iot-hub-devguide-messages-d2c.md) and
  [destination delivery verification](mqtt-v5-device-setup.md#verify-actual-delivery-at-the-destination).
- Review [IoT Hub endpoints and TLS](iot-hub-devguide-endpoints.md#tls-13-enabled-endpoints)
  and [device certificate troubleshooting](mqtt-v5-device-setup.md#troubleshoot-a-secure-connection).
- Use destination-specific analytics guidance once the data pipeline is healthy.
