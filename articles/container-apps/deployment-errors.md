---
title: Troubleshoot Common Deployment Failures in Azure Container Apps
description: Troubleshoot common deployment failures in Azure Container Apps, from image pulls to identity and Key Vault errors. Use this guide to fix issues fast.
#customer intent: As a developer deploying to Azure Container Apps, I want to identify why my deployment failed, so that I can find the right troubleshooting steps quickly.
author: jefmarti
ms.service: azure-container-apps
ms.topic: troubleshooting
ms.date: 06/17/2026
ms.author: jefmarti
ms.reviewer: cshoe
zone_pivot_groups: container-apps-portal-or-cli
---

# Troubleshoot common deployment failures in Azure Container Apps

This article helps you identify and resolve deployment failure scenarios that most frequently require support escalation in Azure Container Apps. Each scenario includes symptoms, portal and CLI diagnostic steps, and resolutions.

Find your symptom in the quick-reference table and follow the link to the matching scenario.

## Symptom quick-reference

| Symptom | Scenario |
|---|---|
| Deployment fails with provisioning error, no revision created | [Image pull failures](#image-pull-failures) |
| Revision created but status is `Failed` or `Degraded` | [Container crash and startup failures](#container-crash-and-startup-failures) |
| Secret or environment variable is empty or missing at runtime | [Secret access problems](#secret-access-problems) |
| Key Vault reference fails during deployment or at runtime | [Key Vault reference failures](#key-vault-reference-failures) |
| Managed identity calls return 401 or 403 | [Managed identity misconfiguration](#managed-identity-misconfiguration) |
| Init container hangs or fails, app never starts | [Initialization timing problems](#initialization-timing-problems) |
| Revision is provisioned but marked `Degraded` | [Health probe failures](#health-probe-failures) |
| App is healthy but requests return errors or no response | [Ingress and traffic routing problems](#ingress-and-traffic-routing-problems) |
| Registry authentication fails (401 or UNAUTHORIZED) | [Container registry authentication](#container-registry-authentication) |

## Where to look: diagnostic surfaces

Use the following diagnostic surfaces to investigate deployment failures.

| Surface | What it shows | How to access |
|---|---|---|
| **Diagnose and solve problems** | Automated detectors for common issues, troubleshooting categories, and guided analysis. | In the Azure portal, go to your container app and select **Diagnose and solve problems**. |
| **System logs** | Platform-level events: image pull status, probe results, identity errors, secret sync outcomes. | `az containerapp logs show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --type system --tail 50` or Log Analytics `ContainerAppSystemLogs_CL` table. |
| **Console logs** | Application stdout/stderr: stack traces, startup messages, runtime errors. | `az containerapp logs show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --tail 100` or portal Log stream blade. |
| **HTTP logs** | Ingress-layer request logs: status codes, latency, paths, retries, response details. Opt-in via Azure Monitor diagnostic settings on the environment. | Log Analytics `ContainerAppHTTPLogs` table. |
| **Revision detail properties** | `provisioningState`, `provisioningError`, `healthState`, `runningState`, `runningStateDetails`. | `az containerapp revision show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --revision <REV> -o json` or portal Revisions blade. |
| **Deployment-time errors** | App-level `provisioningState` and `provisioningError` when no revision is created. | `az containerapp show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> -o json` |

## Image pull failures

Image pull failures are one of the most common causes of deployment errors. They usually occur before Azure Container Apps can create a usable revision.

### Symptoms

- No revision created.
- `provisioningState` is `Failed`.
- Error message mentions `ImagePullBackOff`, `UNAUTHORIZED`, or `manifest unknown`.

### Where to look: image pull diagnostics

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > *Revisions* (list is empty or shows a failed entry) > **Diagnose and solve problems**, and search for "image".

::: zone-end

::: zone pivot="azure-cli"

```bash
# Check app-level provisioning state and error
az containerapp show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> \
  --query "{provisioning:properties.provisioningState, error:properties.provisioningError, latestRevision:properties.latestRevisionName}" -o json

# List revisions (expect empty or failed)
az containerapp revision list -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> \
  --query "[].{name:name, health:properties.healthState, provisioning:properties.provisioningState}" -o table
```

::: zone-end

### Common causes and resolutions

| Cause | Error signal | Resolution |
|---|---|---|
| Image tag doesn't exist | `manifest unknown`, `tag not found` | Verify the exact tag exists in your registry: `az acr repository show-tags --name <AZURE_CONTAINER_REGISTRY_NAME> --repository <REPOSITORY_NAME>` |
| Registry requires authentication | `UNAUTHORIZED: authentication required` | Configure registry credentials on the container app. Use either admin credentials or managed identity for ACR pull. See [Container registry authentication](#container-registry-authentication). |
| Wrong registry hostname | `name unknown`, DNS resolution failure | Verify the `--image` value uses the correct `<REGISTRY>.azurecr.io` hostname. |
| Firewall or NSG blocks registry | Connection timeout | If you're using a custom VNet, ensure outbound access to the registry. Add the `AzureContainerRegistry` service tag or FQDN rules. |

## Container crash and startup failures

Use this section when a revision is created but the workload fails to start or stay running.

### Symptoms

- Revision is created but `healthState` is `Unhealthy`.
- `runningState` is `Failed`.
- Console logs might be empty (container exits before writing output).

### Where to look: crash and startup diagnostics

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > **Revisions**, select the failed revision, and open the Events tab. Check for `BackOff` or `CrashLoopBackOff` events.

::: zone-end

::: zone pivot="azure-cli"

```bash
# Inspect revision detail
az containerapp revision show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --revision <REV> \
  --query "{health:properties.healthState, running:properties.runningState, details:properties.runningStateDetails, error:properties.provisioningError}" -o json

# Pull console logs (if any output was written)
az containerapp logs show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --tail 100

# Pull system logs for platform-level events
az containerapp logs show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --type system --tail 50
```

::: zone-end

### Common causes and resolutions

| Cause | Error signal | Resolution |
|---|---|---|
| Application crashes on startup | Stack trace in console logs | Fix the application error. If logs are empty, the crash happens before stdout is flushed. Add early logging or set your runtime to disable output buffering (for example, `PYTHONUNBUFFERED=1`). |
| Invalid command or entrypoint | `exec format error`, `executable file not found` | Verify the container's `command` and `args` match what the image expects. Check `az containerapp revision show` for `properties.template.containers[].command`. |
| Missing environment variable | `KeyError`, `undefined`, null reference | Verify all required env vars are set. See [Secret access problems](#secret-access-problems). |
| Insufficient resources | `OOMKilled` | Increase memory and CPU limits on the container: `az containerapp update -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --cpu 1.0 --memory 2.0Gi`. |

## Secret access problems

Use this section to troubleshoot missing or empty secret values that break application configuration at runtime.

### Symptoms

- Container starts but the application fails because an expected configuration value is empty or missing.
- Environment variables that reference secrets have no value.

### Where to look: secret reference diagnostics

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > *Settings* > **Secrets** to verify the secret exists. Then go to *Container App* > **Revisions**, select the revision, and check *Container details* > **Environment variables** to verify the reference is correct.

::: zone-end

::: zone pivot="azure-cli"

```bash
# List secrets defined on the app
az containerapp secret list -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> -o table

# Show the revision template to verify env var references
az containerapp revision show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --revision <REV> \
  --query "properties.template.containers[].env" -o json
```

::: zone-end

### Common causes and resolutions

| Cause | Error signal | Resolution |
|---|---|---|
| Secret name mismatch | Env var value is empty | The `secretRef` in the environment variable must exactly match the secret name (case-sensitive). |
| Secret not defined | Deployment error referencing unknown secret | Define the secret before deploying: `az containerapp secret set -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --secrets mysecret=myvalue`. |
| Secret updated but revision not restarted | Old value persists | Deploy a new revision or restart the existing one: `az containerapp revision restart -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --revision <REV>`. Updating a secret alone doesn't trigger a new revision. |
| Secret deleted while revision references it | Container fails to start | Deploy a new revision that removes the reference to the deleted secret, then deactivate old revisions. |

> [!IMPORTANT]
> In Container Apps, secrets are scoped to the application, but environment variable references are scoped to the revision. Changing a secret value doesn't automatically propagate to running revisions. You must create a new revision or restart the existing one for the updated value to take effect.

## Key Vault reference failures

Use this section when Key Vault-backed secrets fail to resolve during deployment or while the app is running.

### Symptoms

- Deployment fails or the secret value is unavailable.
- System logs reference Key Vault access errors.
- `provisioningError` mentions authentication or authorization failure against Key Vault.

### Where to look: Key Vault access diagnostics

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > *Settings* > **Secrets** (look for a warning icon on the Key Vault reference). Then go to *Container App* > **Diagnose and solve problems** and search for "Key Vault".

::: zone-end

::: zone pivot="azure-cli"

```bash
# List secrets and check for Key Vault reference status
az containerapp secret list -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> -o json

# Verify managed identity is assigned
az containerapp identity show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME>
```

::: zone-end

### Common causes and resolutions

| Cause | Error signal | Resolution |
|---|---|---|
| Managed identity not enabled | `Managed identity not configured` | Enable system-assigned or user-assigned managed identity: `az containerapp identity assign -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --system-assigned`. |
| Missing RBAC role | `Authorization failed`, `Access denied` | Grant the **Key Vault Secrets User** role to the managed identity on the Key Vault: `az role assignment create --role "Key Vault Secrets User" --assignee <IDENTITY_PRINCIPAL_ID> --scope <KEYVAULT_RESOURCE_ID>`. |
| Key Vault firewall blocks access | Connection timeout, `ForbiddenByFirewall` | Add the Container Apps environment's outbound IPs to the Key Vault firewall, or configure a private endpoint. Also add the `AzureKeyVault` service tag and `login.microsoft.com` FQDN if using UDR with Azure Firewall. |
| Secret is disabled in Key Vault | `SecretDisabled` | Enable the secret in Key Vault: Azure portal > Key Vault > Secrets > select secret > Enable. |
| Malformed Key Vault URI | `SecretNotFound`, `InvalidUri` | Verify the URI format: `https://<vault>.vault.azure.net/secrets/<secret-name>` or `https://<vault>.vault.azure.net/secrets/<secret-name>/<version>`. |
| RBAC role propagation delay | Works after ~5 minutes | RBAC changes can take up to 10 minutes to propagate. The identity token cache can persist for up to 24 hours. Wait and retry, or deploy a new revision. |

## Managed identity misconfiguration

Use this section when authentication to Azure services fails even though your app is configured to use managed identity.

### Symptoms

- Application code receives 401 (Unauthorized) or 403 (Forbidden) when calling Azure services.
- Managed identity token acquisition fails.

### Where to look: identity and authorization diagnostics

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > *Settings* > **Identity** (verify system-assigned is `On` or user-assigned identities are listed). Then check the target resource's IAM / Access control blade for role assignments.

::: zone-end

::: zone pivot="azure-cli"

```bash
# Verify identity configuration
az containerapp identity show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME>

# Check role assignments for the identity's principal ID
az role assignment list --assignee <PRINCIPAL_ID> --all -o table
```

::: zone-end

### Common causes and resolutions

| Cause | Error signal | Resolution |
|---|---|---|
| No identity assigned | SDK throws `ManagedIdentityCredential` error | Assign an identity: `az containerapp identity assign -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --system-assigned`. |
| Wrong identity used (system vs user-assigned) | 403 on the target resource | If using user-assigned identity, specify the client ID in your code: `DefaultAzureCredential(managed_identity_client_id="<CLIENT_ID>")`. |
| Missing role assignment on target resource | 403 | Assign the required role on the target resource (for example, **Storage Blob Data Contributor** on a storage account). |
| Init container needs identity but it is not available | Init container fails with auth error | In consumption-only and dedicated workload profile environments, init containers **can't** use managed identity. Move identity-dependent logic to the main container, or use a workload profile consumption environment and set `lifecycle: Init` on the identity. |
| Token cache stale after role change | 403 persists for minutes after fix | The identity token cache can persist up to 24 hours. Deploy a new revision to force token refresh. |

> [!TIP]
> Container Apps exposes an internally accessible REST endpoint for acquiring managed identity tokens. Rather than calling this endpoint directly, use the **Azure Identity SDK** (`DefaultAzureCredential`) for a consistent experience across environments.

## Initialization timing problems

Use this section when init containers block startup or fail before the main container can begin serving traffic.

### Symptoms

- The app never reaches a running state.
- Init containers appear stuck or fail.
- System logs show the init container running but never completing.

### Where to look: init container diagnostics

::: zone pivot="azure-portal"

In the Azure portal, go to Container App > Revisions, select the revision, and open the Events tab. Look for init container events.

::: zone-end

::: zone pivot="azure-cli"

```bash
# Check revision running state
az containerapp revision show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --revision <REV> \
  --query "{running:properties.runningState, details:properties.runningStateDetails}" -o json

# Check init container logs
az containerapp logs show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --container <INIT_CONTAINER_NAME> --tail 100

# System logs for platform events
az containerapp logs show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --type system --tail 50
```

::: zone-end

### Common causes and resolutions

| Cause | Error signal | Resolution |
|---|---|---|
| Init container depends on a service not yet available | Connection refused or timeout in init container logs | Add retry logic or a readiness check in the init container. Don't assume dependent services are available at init time. |
| Init container never exits | Revision stays in `Provisioning` | Ensure the init container runs a finite command and exits with code 0. Init containers that run indefinitely block the main container from starting. |
| Init container needs managed identity | 401 or 403 from init container | In consumption-only and dedicated workload profile environments, managed identity isn't available to init containers. Use a workload profile consumption environment, or move the identity-dependent work to the main container. |
| Init container image pull fails | Same symptoms as [Image pull failures](#image-pull-failures) | Apply the same registry authentication and image tag checks. |
| Order of operations: secret not yet synced | Init container reads empty secret | Key Vault secret sync happens asynchronously. If the init container depends on a Key Vault-referenced secret, the value might not be available yet. Use direct secrets for init-time dependencies or add retry logic. |

## Health probe failures

Use this section when revisions deploy successfully but are marked unhealthy or degraded by probe checks.

### Symptoms

- Revision is provisioned but running status is `Degraded`.
- System logs show `Unhealthy` events with probe failure details.
- The app works locally but fails health checks in ACA.

### Where to look: probe health diagnostics

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > *Application* > *Containers* > **Health probes** (verify probe configuration). Then go to *Container App* > **Revisions**, select the revision, and open Events.

::: zone-end

::: zone pivot="azure-cli"

```bash
# Check the revision's probe configuration
az containerapp revision show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --revision <REV> \
  --query "properties.template.containers[].probes" -o json

# System logs for probe failure events
az containerapp logs show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --type system --tail 50
```

::: zone-end

### Common causes and resolutions

| Cause | Error signal | Resolution |
|---|---|---|
| Probe port doesn't match app port | Probe returns connection refused | Set the probe port to match your app's listening port and the ingress `targetPort`. |
| App takes too long to start | Probe fails before app is ready, revision goes `Degraded` | Increase the `initialDelaySeconds` on liveness and readiness probes. Common with Java apps. |
| Probe path returns non-200 | Probe fails with HTTP error | Ensure the health endpoint returns 200. For HTTP probes, verify the path exists and responds correctly. |
| TCP probe when app only binds after init | Probe connects before the app is listening | Use a startup probe with a higher `failureThreshold` to give the app time to bind its port. |

### Default probe values

When you enable ingress and don't configure probes, ACA applies these defaults:

| Property | Startup | Liveness | Readiness |
|---|---|---|---|
| Protocol | TCP | TCP | TCP |
| Port | Ingress target port | Ingress target port | Ingress target port |
| Initial delay | 1s | 1s | 3s |
| Period | 1s | 1s | 5s |
| Failure threshold | 240 | 48 | N/A |

## Ingress and traffic routing problems

Use this section when the app is running but requests fail because ingress or revision traffic settings are incorrect.

### Symptoms

- App is running and healthy, but HTTP requests return errors (404, 502) or no response.
- The app works via `az containerapp exec` but not via the public URL.

### Where to look: ingress and traffic diagnostics

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > *Settings* > **Ingress**. Then go to *Container App* > *Application* > **Revisions** (check traffic split).

::: zone-end

::: zone pivot="azure-cli"

```bash
# Check ingress configuration and traffic split
az containerapp show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> \
  --query "{ingress:properties.configuration.ingress, latestReady:properties.latestReadyRevisionName}" -o json

# Verify the FQDN
az containerapp show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --query "properties.configuration.ingress.fqdn" -o tsv
```

::: zone-end

### Common causes and resolutions

| Cause | Error signal | Resolution |
|---|---|---|
| Ingress not enabled | No FQDN assigned, can't reach app | Enable ingress: `az containerapp ingress enable -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --type external --target-port 8080 --transport auto`. |
| Target port mismatch | 502 Bad Gateway | Set `targetPort` to match the port your app listens on. |
| Traffic weight is 0% on latest revision | Old revision serves traffic | Update traffic split: `az containerapp ingress traffic set -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --revision-weight latest=100`. |
| IP restriction blocks client | 403 | Check IP security restrictions under Ingress settings. |
| Wrong transport (HTTP vs TCP) | Connection errors | Verify the ingress type matches your app's protocol. |

## Container registry authentication

Use this section when image pulls fail because the app can't authenticate to your container registry.

### Symptoms

- Deployment fails with `UNAUTHORIZED: authentication required`.
- This error often masks other issues (like a bad image tag) because the registry rejects the request before it can check the tag.

### Where to look: registry authentication diagnostics

::: zone pivot="azure-portal"

In the Azure portal, go to *Container App* > *Settings* > **Container** (check registry settings). Then go to *Container App* > **Diagnose and solve problems** and search for "registry".

::: zone-end

::: zone pivot="azure-cli"

```bash
# Check configured registries
az containerapp show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> \
  --query "properties.configuration.registries" -o json

# Verify ACR credentials work
az acr login --name <AZURE_CONTAINER_REGISTRY_NAME>
docker pull <AZURE_CONTAINER_REGISTRY_NAME>.azurecr.io/<REPOSITORY_NAME>:<TAG>
```

::: zone-end

### Common causes and resolutions

| Cause | Error signal | Resolution |
|---|---|---|
| No registry credentials configured | `UNAUTHORIZED` | Add registry credentials: `az containerapp registry set -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --server <AZURE_CONTAINER_REGISTRY_NAME>.azurecr.io --identity system`. |
| Admin credentials disabled on ACR | `UNAUTHORIZED` with admin user | Enable admin user: `az acr update -n <AZURE_CONTAINER_REGISTRY_NAME> --admin-enabled true`. **Preferred**: Use managed identity for ACR pull instead. |
| Managed identity lacks AcrPull role | `UNAUTHORIZED` | Assign the **AcrPull** role: `az role assignment create --role AcrPull --assignee <PRINCIPAL_ID> --scope <ACR_RESOURCE_ID>`. |
| Wrong server hostname | `name unknown` | Verify the registry server matches your ACR: `<your-acr>.azurecr.io`. |

## Diagnostic workflow summary

Use this sequence when you're unsure what failed:

1. Run `az containerapp show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> -o json`. Check `provisioningState`, `provisioningError`, and `latestRevisionName`.

1. Run `az containerapp revision list -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> -o table`. If the list is empty, the failure is an image pull or template validation issue (Image pull failures and Container registry authentication). If a revision exists, continue to step 3.

1. Run `az containerapp revision show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --revision <REV> -o json`. Check `healthState`, `runningState`, `runningStateDetails`, and `provisioningError`.

1. Run `az containerapp logs show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --type system --tail 50` to view platform-level events such as probe failures, identity errors, and secret sync issues.

1. Run `az containerapp logs show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME> --tail 100` to view application stdout/stderr including stack traces, configuration errors, and connection failures.

1. Run `az containerapp identity show -g <RESOURCE_GROUP_NAME> -n <CONTAINER_APP_NAME>` to verify identity configuration if auth-related errors appeared in previous steps.

## Use Diagnose and solve problems in the portal

::: zone pivot="azure-portal"

The Container Apps portal includes a **Diagnose and solve problems** blade with automated diagnostics:

1. Go to your container app in the Azure portal.
1. Select **Diagnose and solve problems** from the left navigation.
1. Use the search box to find specific diagnostics (for example, "image pull", "health probe", or "ingress").
1. Select a troubleshooting category tile for guided analysis.

This blade is the recommended starting point for guided diagnostics. It might not cover every scenario in this article, but it provides automated checks for common issues.

::: zone-end

## Log Analytics queries for deeper investigation

If the CLI output and portal diagnostics aren't enough, query the underlying logs directly in Log Analytics. The following two queries cover the most common starting points for platform-level failures and ingress-level HTTP errors.

### Find system-level failures

```kusto
ContainerAppSystemLogs_CL
| where RevisionName_s == "<REV>"
| where Log_s contains "BackOff" or Log_s contains "Failed" or Log_s contains "Error"
  or Reason_s == "Unhealthy"
| project TimeGenerated, Reason_s, Log_s
| order by TimeGenerated desc
| take 50
```

This query shows image pull errors, probe failures, provisioning errors, and other platform events.

### Find HTTP errors (requires HTTP logs enabled)

The ingress layer emits HTTP logs, and you opt in to them. Enable these logs through Azure Monitor diagnostic settings on the Container Apps managed environment. After you enable them, the `ContainerAppHTTPLogs` table appears in Log Analytics. It might take several minutes for the table to appear.

```kusto
ContainerAppHTTPLogs
| where TimeGenerated > ago(1h)
| where StatusCode >= 400
| project TimeGenerated, ContainerAppName, RevisionName, Method, Path,
  StatusCode, ResponseCodeDetails, RequestDuration, RequestId
| order by TimeGenerated desc
| take 100
```

This query filters the ingress-layer HTTP logs to show only failed requests (status code 400 or higher) from the last hour. It returns the timestamp, app and revision name, HTTP method and path, the error status code, a `ResponseCodeDetails` field that indicates whether the error originated from your container (`via_upstream`) or the platform (`route_not_found`, `connection_timeout`), the request duration, and a unique request ID you can use to correlate with application logs.

For more queries, including slow request analysis, error rate by revision, single-request tracing, and top failing endpoints, see [Monitor logs in Azure Container Apps with Log Analytics](log-monitoring.md#http-logs).

## Related content

- [Troubleshoot a container app](troubleshooting.md)
- [Manage secrets in Azure Container Apps](manage-secrets.md)
- [Managed identities in Azure Container Apps](managed-identity.md)
- [Health probes in Azure Container Apps](health-probes.md)
- [Ingress in Azure Container Apps](ingress-overview.md)
- [Monitor logs in Azure Container Apps with Log Analytics](log-monitoring.md)
