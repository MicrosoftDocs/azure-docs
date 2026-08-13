---
title: Troubleshoot common deployment failures in Azure Container Apps
description: Troubleshoot common deployment failures in Azure Container Apps, from image pulls to identity and Key Vault errors. Use this guide to fix issues fast.
#customer intent: As a developer deploying to Azure Container Apps, I want to identify why my deployment failed, so that I can find the right troubleshooting steps quickly.
author: jefmarti
ms.service: azure-container-apps
ms.topic: troubleshooting
ms.date: 07/21/2026
ms.author: jefmarti
ms.reviewer: cshoe
zone_pivot_groups: container-apps-portal-or-cli
---

# Troubleshoot common deployment failures in Azure Container Apps

Use this guide to diagnose and fix common Azure Container Apps deployment failures. Start with the symptom table, then follow the matching troubleshooting flow.

> [!TIP]
> The Azure portal includes **Diagnose and solve problems**, which runs automated detectors for common deployment issues. Use it with the steps in this article. For help choosing a detector, see [Diagnose and solve problems in Azure Container Apps](diagnose-solve.md).

## Start with the symptom

Use the following table to choose a troubleshooting path.

| Symptom | Likely cause | Go to |
|---|---|---|
| Deployment fails and no revision is created | Image or registry authentication issue | [Deployment fails before revision creation](#deployment-fails-before-revision-creation) |
| `ImagePullBackOff` or `UNAUTHORIZED` error | Image tag or registry credentials | [Deployment fails before revision creation](#deployment-fails-before-revision-creation) |
| `CrashLoopBackOff` or container exits immediately | Startup crash | [Container crash and startup failures](#container-crash-and-startup-failures) |
| Revision is `Degraded` with 0 ready replicas | Health probe failures | [Health probe failures](#health-probe-failures) |
| Revision stays in `Provisioning` | Init container or probe timing | [Initialization timing problems](#initialization-timing-problems) |
| Secret or environment variable is empty at runtime | Secret reference or sync issue | [Secret access problems](#secret-access-problems) |
| Managed identity returns 401 or 403 | Identity misconfiguration | [Managed identity misconfiguration](#managed-identity-misconfiguration) |
| Endpoint returns 403 or 502 | Ingress or networking issue | [Requests fail or behave unexpectedly](#requests-fail-or-behave-unexpectedly) |

## Choose the right log source

Use logs when portal diagnostics or CLI state don't show the root cause.

| Log type | What it shows | Key detail |
|---|---|---|
| **System logs** | Platform-level events, including image pull status, probe results, identity errors, and secret sync outcomes. | Replica-scoped system events include a replica identifier: `ReplicaName_s` in `ContainerAppSystemLogs_CL` or `ReplicaName` in `ContainerAppSystemLogs`. |
| **Console logs** | Application stdout/stderr, including stack traces, startup messages, and runtime errors. | Console logs include `ContainerGroupName_s` in `ContainerAppConsoleLogs_CL` or `ContainerGroupName` in `ContainerAppConsoleLogs` for replica-level troubleshooting. |
| **HTTP logs** | Ingress-layer request logs, including status codes, latency, paths, and response details. | HTTP logs include a `ReplicaName` field. Enable them through Azure Monitor diagnostic settings on the environment. |

## Deployment fails before revision creation

Use this section when the platform can't create a revision. This failure usually happens during image pull or registry authentication before your application code runs.

### Check portal state

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > **Configure** > **More** > **Revisions & Replicas**. If the list is empty or shows a failed entry, check for an image pull or template validation failure. You can also search for "image pull" in **Diagnose and solve problems** for automated analysis.

::: zone-end

::: zone pivot="azure-cli"

```bash
# Check app-level provisioning state and error
az containerapp show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> \
  --query "{provisioning:properties.provisioningState, error:properties.provisioningError, latestRevision:properties.latestRevisionName}" -o json

# List revisions. Expect no revision or a failed revision.
az containerapp revision list -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> \
  --query "[].{name:name, health:properties.healthState, provisioning:properties.provisioningState}" -o table
```

::: zone-end

### Check system logs for image pull events

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > **Observe** > **Log Stream**, and then select **System logs**. Look for image pull errors.

::: zone-end

::: zone pivot="azure-cli"

```bash
az containerapp logs show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --type system --tail 50
```

::: zone-end

### Validate image and registry configuration

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > **Configure** > **Container**. Verify the image name, tag, and registry settings.

::: zone-end

::: zone pivot="azure-cli"

```bash
# Check configured registries
az containerapp show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> \
  --query "properties.configuration.registries" -o json

# Verify that the image tag exists in your registry
az acr repository show-tags --name <AZURE_CONTAINER_REGISTRY_NAME> --repository <REPOSITORY_NAME>

# Verify that ACR credentials work
az acr login --name <AZURE_CONTAINER_REGISTRY_NAME>
docker pull <AZURE_CONTAINER_REGISTRY_NAME>.azurecr.io/<REPOSITORY_NAME>:<IMAGE_TAG>
```

::: zone-end

### Fix common image and registry issues

| If you see this condition | Take this action |
|---|---|
| `manifest unknown` or `tag not found` | Verify that the exact image tag exists in your registry. |
| `UNAUTHORIZED: authentication required` | Configure registry credentials. To use managed identity for ACR pull, run `az containerapp registry set -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --server <AZURE_CONTAINER_REGISTRY_NAME>.azurecr.io --identity system`. |
| `name unknown` or DNS resolution failure | Verify that the `--image` value uses the correct `<REGISTRY>.azurecr.io` hostname. |
| Connection timeout to registry | If you use a custom VNet, ensure outbound access. Add the `AzureContainerRegistry` service tag or FQDN rules. |
| `UNAUTHORIZED` with admin user configured | Enable admin user with `az acr update -n <AZURE_CONTAINER_REGISTRY_NAME> --admin-enabled true`, or switch to managed identity with the **AcrPull** role. |
| `UNAUTHORIZED` with managed identity | Assign the **AcrPull** role with `az role assignment create --role AcrPull --assignee <PRINCIPAL_ID> --scope <ACR_RESOURCE_ID>`. |

> [!NOTE]
> For detailed guidance on image pull issues, including registry rate limits and image pull validation behavior, see [Troubleshoot image pull failures](troubleshoot-image-pull-failures.md).

## Revision failed or degraded

Use this section when a revision is created but doesn't reach a healthy running state. The cause might be a container crash, a health probe failure, or an initialization timing problem.

### Container crash and startup failures

Use this section when the container starts, exits immediately, or enters a crash loop. The revision exists but can't serve traffic.

#### Check revision state

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > **Configure** > **More** > **Revisions & Replicas**, and then select the failed revision. Look for `BackOff` or `CrashLoopBackOff` events in the revision details.

::: zone-end

::: zone pivot="azure-cli"

```bash
az containerapp revision show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --revision <REVISION_NAME> \
  --query "{health:properties.healthState, running:properties.runningState, details:properties.runningStateDetails, error:properties.provisioningError}" -o json
```

::: zone-end

#### Check console logs for stack traces

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > **Observe** > **Log Stream**, and then select **Console logs**. Look for stack traces or error messages. Console logs include a replica identifier, `ContainerGroupName_s` in `ContainerAppConsoleLogs_CL` or `ContainerGroupName` in `ContainerAppConsoleLogs`, so you can filter to a specific replica.

::: zone-end

::: zone pivot="azure-cli"

```bash
# Pull console logs if the app wrote output
az containerapp logs show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --tail 100

# Pull system logs for platform-level events
az containerapp logs show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --type system --tail 50
```

::: zone-end

#### Validate container configuration

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > **Configure** > **Container**. Verify the command, arguments, environment variables, and resource limits.

::: zone-end

::: zone pivot="azure-cli"

```bash
az containerapp revision show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --revision <REVISION_NAME> \
  --query "properties.template.containers[].{command:command, args:args, env:env, resources:resources}" -o json
```

::: zone-end

#### Fix common crash and startup issues

| If you see this error | Take this action |
|---|---|
| Stack trace in console logs | Fix the application error. If logs are empty, the crash happens before stdout is flushed. Add early logging or set your runtime to disable output buffering. For example, set `PYTHONUNBUFFERED=1`. |
| `exec format error` or `executable file not found` | Verify that the container `command` and `args` match what the image expects. |
| `KeyError`, `undefined`, or null reference | Verify that all required environment variables are set. See [Secret access problems](#secret-access-problems). |
| `OOMKilled` | Increase memory and CPU limits by using `az containerapp update -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --cpu 1.0 --memory 2.0Gi`. |

> [!NOTE]
> For additional container startup troubleshooting, including local Docker testing and CPU throttling, see [Troubleshoot container start failures](troubleshoot-container-start-failures.md). For container exit event diagnostics in the portal, see [Troubleshoot container exit failures](troubleshoot-container-create-failures.md).

### Health probe failures

Use this section when the revision deploys but health checks fail. The platform marks replicas as unhealthy or restarts them. The app might work locally but fail probe checks in Container Apps.

#### Check system logs for probe failures

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > **Observe** > **Log Stream**, and then select **System logs**. Look for `Unhealthy` events with probe failure details. You can also search for "health probe" in **Diagnose and solve problems** for automated analysis.

::: zone-end

::: zone pivot="azure-cli"

```bash
# System logs for probe failure events
az containerapp logs show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --type system --tail 50
```

::: zone-end

#### Check probe configuration

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > **Configure** > **Container** > **Health Probes**. Verify the port, path, and timing settings.

::: zone-end

::: zone pivot="azure-cli"

```bash
az containerapp revision show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --revision <REVISION_NAME> \
  --query "properties.template.containers[].probes" -o json
```

::: zone-end

#### Validate the probe endpoint

Verify that your health endpoint returns HTTP 200 within the configured timeout. If you use TCP probes, verify that your app listens on the expected port.

#### Fix common health probe issues

| If you see this condition | Take this action |
|---|---|
| Probe returns connection refused | Set the probe port to match your app's listening port and the ingress `targetPort`. |
| Probe fails before app is ready, and the revision becomes `Degraded` | Increase `initialDelaySeconds` on liveness and readiness probes. If your app requires a long startup time, adjust probe settings to prevent unnecessary restarts. |
| Probe fails with HTTP error | Ensure that the health endpoint returns 200. For HTTP probes, verify that the path exists and responds correctly. |
| Probe connects before the app is listening | Use a startup probe with a higher `failureThreshold` to give the app time to bind its port. |

> [!NOTE]
> For portal-based probe diagnostics, see [Troubleshoot health probe failures](troubleshoot-health-probe-failures.md). For target port mismatch diagnostics, see [Troubleshoot target port settings](troubleshoot-target-port-settings.md).

#### Default probe values

When you enable ingress and don't configure probes, Container Apps applies these defaults.

| Property | Startup | Liveness | Readiness |
|---|---|---|---|
| Protocol | HTTP GET `/` | HTTP GET `/` | HTTP GET `/` |
| Port | Ingress target port, or 80 if unset | Ingress target port, or 80 if unset | Ingress target port, or 80 if unset |
| Initial delay | 1s | 1s | 3s |
| Period | 10s | 10s | 10s |
| Timeout | 1s | 1s | 1s |
| Success threshold | 1 | 1 | 1 |
| Failure threshold | 48 | 3 | 3 |

### Initialization timing problems

Use this section when init containers block the main container from starting. If they hang, fail, or depend on unavailable resources, the app never reaches a running state.

#### Check revision state

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > **Configure** > **More** > **Revisions & Replicas**, and then select the revision. Look for init container events in the revision details.

::: zone-end

::: zone pivot="azure-cli"

```bash
az containerapp revision show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --revision <REVISION_NAME> \
  --query "{running:properties.runningState, details:properties.runningStateDetails}" -o json
```

::: zone-end

#### Check init container logs

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > **Observe** > **Log Stream**, and then select the init container from the container dropdown.

::: zone-end

::: zone pivot="azure-cli"

```bash
az containerapp logs show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --container <INIT_CONTAINER_NAME> --tail 100
```

::: zone-end

#### Verify init container exit behavior

Ensure that the init container runs a finite command and exits with code 0. Init containers that run indefinitely block the main container.

#### Fix common initialization issues

| If you see this error | Take this action |
|---|---|
| Connection refused or timeout in init container logs | Add retry logic or a readiness check. Don't assume dependent services are available at init time. |
| Revision stays in `Provisioning` indefinitely | Ensure that the init container runs a finite command and exits with code 0. |
| Init container fails with 401 or 403 | In consumption-only and dedicated workload profile environments, only main containers can use managed identity. In consumption workload profile environments, init containers can use managed identity by default. With API version 2024-02-02-preview or later, `identitySettings` can scope an identity to `Init`, `Main`, `None`, or `All`. |
| Init container image pull fails | Apply the same registry authentication and image tag checks from [Deployment fails before revision creation](#deployment-fails-before-revision-creation). |
| Init container reads empty secret | Don't assume Key Vault-referenced secrets update immediately. If an init container depends on a Key Vault-referenced value, add retry logic or use a direct Container Apps secret for init-time dependencies. For unversioned Key Vault references, newer versions can take up to 30 minutes to be retrieved. |

## App starts with missing configuration

Use this section when the container starts but the application fails because configuration, secrets, or identity settings are missing or incorrect.

### Secret access problems

Use this section when an expected configuration value, such as a secret or Key Vault reference, is empty or missing at runtime.

#### Verify secrets and environment variable references

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > **Configure** > **Identity** > **Secrets** and verify that the secret exists. If you use Key Vault references, look for warning icons. Then go to *Container App* > **Configure** > **More** > **Revisions & Replicas**, select the revision, and check **Container details** > **Environment variables** to verify that the `secretRef` values are correct.

::: zone-end

::: zone pivot="azure-cli"

```bash
# List secrets defined on the app
az containerapp secret list -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> -o table

# Verify environment variable references in the revision template
az containerapp revision show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --revision <REVISION_NAME> \
  --query "properties.template.containers[].env" -o json
```

::: zone-end

#### Check Key Vault access

Use this step only if you use Key Vault references.

::: zone pivot="azure-portal"

In the Azure portal, search for "Key Vault" in **Diagnose and solve problems** for automated analysis.

::: zone-end

::: zone pivot="azure-cli"

```bash
# Verify that managed identity is assigned
az containerapp identity show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME>

# Check system logs for Key Vault sync errors
az containerapp logs show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --type system --tail 50
```

::: zone-end

#### Fix common secret issues

| If you see this error | Take this action |
|---|---|
| Environment variable value is empty | The `secretRef` must exactly match the secret name. The match is case-sensitive. |
| Deployment error referencing unknown secret | Define the secret before you deploy with `az containerapp secret set -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --secrets mysecret=myvalue`. |
| Old Container Apps secret value persists after update | Deploy a new revision or restart the existing one with `az containerapp revision restart -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --revision <REVISION_NAME>`. Updating a Container Apps app secret doesn't trigger a new revision. |
| Container fails to start after secret is deleted | Deploy a new revision that removes the reference to the deleted secret, then deactivate old revisions. |
| `Managed identity not configured` with Key Vault | Enable managed identity with `az containerapp identity assign -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --system-assigned`. |
| `Authorization failed` on Key Vault | Grant the **Key Vault Secrets User** role to the managed identity with `az role assignment create --role "Key Vault Secrets User" --assignee <IDENTITY_PRINCIPAL_ID> --scope <KEY_VAULT_RESOURCE_ID>`. |
| Key Vault firewall denies access | Add the Container Apps environment outbound IPs to the Key Vault firewall, or configure a private endpoint. |
| The referenced Key Vault secret is disabled | Enable the secret in Key Vault. In the Azure portal, go to *Key Vault* > **Secrets**, select the secret, and then select **Enable**. |
| Malformed Key Vault URI | Verify the format: `https://<KEY_VAULT_NAME>.vault.azure.net/secrets/<SECRET_NAME>` or `https://<KEY_VAULT_NAME>.vault.azure.net/secrets/<SECRET_NAME>/<SECRET_VERSION>`. |
| Key Vault access works after about 5 to 10 minutes | Wait and retry. RBAC propagation can take up to 10 minutes. |

> [!IMPORTANT]
> Container Apps app secrets are scoped to the application, while environment variable references are scoped to a revision. Updating a Container Apps app secret doesn't create a new revision. Deploy a new revision or restart an existing one to pick up the changed app secret. For unversioned Key Vault references, Container Apps can retrieve newer versions within 30 minutes and automatically restart active revisions that reference the secret in an environment variable.

### Managed identity misconfiguration

Use this section when the container starts but calls to Azure services fail because managed identity isn't configured correctly or doesn't have the required permissions.

#### Verify that identity is assigned

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > **Configure** > **Identity** > **Identity**. Verify that **System assigned** is **On**, or verify that the correct user-assigned identity is listed.

::: zone-end

::: zone pivot="azure-cli"

```bash
az containerapp identity show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME>
```

::: zone-end

#### Check role assignments on the target resource

::: zone pivot="azure-portal"

In the Azure portal, go to the target resource, such as a storage account or Key Vault, then go to **Access control (IAM)** > **Role assignments**. Verify that the identity principal ID has the required role.

::: zone-end

::: zone pivot="azure-cli"

```bash
az role assignment list --assignee <PRINCIPAL_ID> --all -o table
```

::: zone-end

#### Check console logs for authentication errors

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > **Observe** > **Log Stream**. Look for 401 or 403 errors in the application output.

::: zone-end

::: zone pivot="azure-cli"

```bash
az containerapp logs show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --tail 100
```

::: zone-end

#### Fix common managed identity issues

| If you see this error | Take this action |
|---|---|
| `ManagedIdentityCredential` error | Assign an identity with `az containerapp identity assign -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --system-assigned`. |
| 403 on the target resource with user-assigned identity | Specify the client ID in your code with `DefaultAzureCredential(managed_identity_client_id="<CLIENT_ID>")`. |
| 403 even with identity assigned | Assign the required role on the target resource. For example, assign **Storage Blob Data Contributor** on a storage account. |
| Init container fails with auth error | In consumption-only and dedicated workload profile environments, only main containers can use managed identity. In consumption workload profile environments, init containers can use managed identity by default. With API version 2024-02-02-preview or later, `identitySettings` can scope an identity to `Init`, `Main`, `None`, or `All`. |
| 403 persists after fixing role or group membership | Managed identity authorization data can be cached per resource URI for around 24 hours. Forcing a token refresh isn't supported. Wait for the cache to expire and avoid relying on managed-identity group membership changes for time-sensitive access. |

> [!TIP]
> Use the **Azure Identity SDK** with `DefaultAzureCredential` rather than calling the managed identity REST endpoint directly. The SDK provides a consistent experience across environments.

## Requests fail or behave unexpectedly

Use this section when the app is running and healthy, but HTTP requests return errors, such as 404, 502, or 403, or no response. The problem is likely in ingress configuration or traffic routing.

### Check ingress configuration

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > **Configure** > **Networking** > **Ingress**. Verify that ingress is enabled, the target port matches your app, and the FQDN is assigned. You can also search for "ingress" in **Diagnose and solve problems** for automated analysis.

::: zone-end

::: zone pivot="azure-cli"

```bash
# Check ingress configuration and traffic split
az containerapp show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> \
  --query "{ingress:properties.configuration.ingress, latestReady:properties.latestReadyRevisionName}" -o json
```

::: zone-end

### Verify FQDN and traffic split

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > **Configure** > **More** > **Revisions & Replicas**. Verify that traffic routes to the correct revision and that the revision is healthy.

::: zone-end

::: zone pivot="azure-cli"

```bash
# Verify the FQDN
az containerapp show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --query "properties.configuration.ingress.fqdn" -o tsv

# Check traffic split
az containerapp ingress traffic show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> -o table
```

::: zone-end

### Check HTTP logs

::: zone pivot="azure-portal"

In the Azure portal, go to your Log Analytics workspace and run a query against the `ContainerAppHTTPLogs` table. Review failed requests and the `ResponseCodeDetails` field to determine whether the error came from your app or the platform.

::: zone-end

::: zone pivot="azure-cli"

```bash
# Query HTTP logs in Log Analytics. This command requires HTTP logs enabled through diagnostic settings.
az monitor log-analytics query -w <LOG_ANALYTICS_WORKSPACE_ID> \
  --analytics-query "ContainerAppHTTPLogs | where TimeGenerated > ago(1h) | where StatusCode >= 400 | project TimeGenerated, Method, Path, StatusCode, ResponseCodeDetails | take 50"
```

::: zone-end

### Fix common request and ingress issues

| If you see this condition | Take this action |
|---|---|
| No FQDN assigned, and you can't reach the app | Enable ingress by running `az containerapp ingress enable -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --type external --target-port 8080 --transport auto`. |
| 502 Bad Gateway | Set `targetPort` to match the port your app listens on. |
| Old revision serves traffic instead of latest | Update the traffic split by running `az containerapp ingress traffic set -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --revision-weight latest=100`. |
| 403 Forbidden | Check IP security restrictions under Ingress settings. |
| Connection errors | Verify that the ingress transport type matches your app protocol, either HTTP or TCP. |

## Use the CLI diagnostic workflow

Use this workflow when the section-specific steps don't resolve the issue or you need to collect more detail.

::: zone pivot="azure-portal"

For portal-based diagnostics, use **Diagnose and solve problems** and try different troubleshooting categories. For the step-by-step CLI workflow, switch to the **Azure CLI** tab.

::: zone-end

::: zone pivot="azure-cli"

1. Run `az containerapp show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> -o json`. Check `provisioningState`, `provisioningError`, and `latestRevisionName`.

1. Run `az containerapp revision list -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> -o table`. If the list is empty, the failure is an image pull or template validation issue. See [Deployment fails before revision creation](#deployment-fails-before-revision-creation). If a revision exists, continue to the next step.

1. Run `az containerapp revision show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --revision <REVISION_NAME> -o json`. Check `healthState`, `runningState`, `runningStateDetails`, and `provisioningError`.

1. Run `az containerapp logs show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --type system --tail 50` to view platform-level events, such as probe failures, identity errors, and secret sync issues.

1. Run `az containerapp logs show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --tail 100` to view application stdout and stderr, including stack traces, configuration errors, and connection failures. Use the replica name in these logs to isolate problems to a specific instance.

1. Run `az containerapp identity show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME>` to verify identity configuration if authentication-related errors appeared in previous steps.

::: zone-end

## Query Log Analytics for deeper investigation

Use Log Analytics when CLI output and portal diagnostics don't provide enough detail.

### Find system-level failures

This query shows image pull errors, probe failures, provisioning errors, and other platform events.

```kusto
ContainerAppSystemLogs_CL
| where RevisionName_s == "<REVISION_NAME>"
| where Log_s contains "BackOff" or Log_s contains "Failed" or Log_s contains "Error"
  or Reason_s == "Unhealthy"
| project TimeGenerated, Reason_s, Log_s
| order by TimeGenerated desc
| take 50
```

### Find console log errors by replica

This query returns console log errors and includes the replica name.

```kusto
ContainerAppConsoleLogs_CL
| where RevisionName_s == "<REVISION_NAME>"
| where Log_s contains "error" or Log_s contains "Exception" or Log_s contains "fatal"
| project TimeGenerated, ContainerGroupName_s, Log_s
| order by TimeGenerated desc
| take 50
```

The `ContainerGroupName_s` field is the replica name in `ContainerAppConsoleLogs_CL`. Use it to isolate errors to a specific instance. In the resource-specific `ContainerAppConsoleLogs` table, use `ContainerGroupName`.

### Find HTTP errors

Enable HTTP logs through Azure Monitor diagnostic settings on the Container Apps managed environment. After you enable them, the `ContainerAppHTTPLogs` table appears in Log Analytics. It might take several minutes.

```kusto
ContainerAppHTTPLogs
| where TimeGenerated > ago(1h)
| where StatusCode >= 400
| project TimeGenerated, ContainerAppName, RevisionName, ReplicaName, Method, Path,
  StatusCode, ResponseCodeDetails, RequestDuration, RequestId
| order by TimeGenerated desc
| take 100
```

The `ResponseCodeDetails` field indicates whether the error originated from your container, such as `via_upstream`, or the platform, such as `route_not_found` or `upstream_per_try_timeout`.

For more queries, including slow request analysis, error rate by revision, single-request tracing, and top failing endpoints, see [Monitor logs in Azure Container Apps with Log Analytics](log-monitoring.md#http-logs).

## Next steps

If the issue isn't resolved:

- Use [Diagnose and solve problems](diagnose-solve.md) in the portal for automated diagnostic analysis.
- Review metrics in **Azure Monitor** for resource utilization patterns.
- Check the [Azure Container Apps troubleshooting guide](troubleshooting.md) for additional scenarios.

Related troubleshooting documentation:

- [Troubleshoot image pull failures](troubleshoot-image-pull-failures.md)
- [Troubleshoot container start failures](troubleshoot-container-start-failures.md)
- [Troubleshoot health probe failures](troubleshoot-health-probe-failures.md)
- [Troubleshoot target port settings](troubleshoot-target-port-settings.md)
- [Troubleshoot container exit failures](troubleshoot-container-create-failures.md)
- [Troubleshoot OCI errors](troubleshoot-open-container-initiative-errors.md)
- [Troubleshoot storage mount failures](troubleshoot-storage-mount-failures.md)
- [Diagnose and solve problems in Azure Container Apps](diagnose-solve.md)

Related documentation:

- [Manage secrets in Azure Container Apps](manage-secrets.md)
- [Managed identities in Azure Container Apps](managed-identity.md)
- [Health probes in Azure Container Apps](health-probes.md)
- [Ingress in Azure Container Apps](ingress-overview.md)
- [Monitor logs in Azure Container Apps with Log Analytics](log-monitoring.md)
