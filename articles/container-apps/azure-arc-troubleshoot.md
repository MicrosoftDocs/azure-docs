---
title: Troubleshoot Azure Container Apps on Azure Arc-enabled Kubernetes
description: Diagnose connected cluster, extension, custom location, connected environment, ingress, revision, scaling, job, logging, provider registration, and upgrade problems.
author: jefmarti
ms.service: azure-container-apps
ms.topic: troubleshooting
ms.date: 09/15/2026
ms.author: jefmarti
ms.reviewer: cshoe
---

# Troubleshoot Azure Container Apps on Azure Arc-enabled Kubernetes

Troubleshooting Container Apps on Azure Arc requires checking both Azure resource provisioning and Kubernetes runtime state. Start with the dependency closest to the cluster and proceed in this order:

1. Kubernetes cluster health and capacity.
1. Azure Arc connected-cluster connectivity.
1. Container Apps extension provisioning and pods.
1. Custom location provisioning.
1. Connected environment provisioning and ingress.
1. Container app or job provisioning.
1. Application DNS, network path, and runtime behavior.

Don't repeatedly recreate later resources while an earlier dependency is unhealthy.

## Collect diagnostics

Replace the resource placeholders with the values you used during installation, and then collect the Azure resource state. Use `<NAMESPACE>` for the extension release namespace and `<APPS_NAMESPACE>` for the application workload namespace.

```azurecli
az account show --query "{name:name,id:id}" --output table
az connectedk8s show --resource-group <RESOURCE_GROUP> --name <CLUSTER_NAME> --output yaml
az k8s-extension show --resource-group <RESOURCE_GROUP> --cluster-type connectedClusters --cluster-name <CLUSTER_NAME> --name <EXTENSION_NAME> --output yaml
az customlocation show --resource-group <RESOURCE_GROUP> --name <CUSTOM_LOCATION_NAME> --output yaml
az containerapp connected-env show --resource-group <RESOURCE_GROUP> --name <CONNECTED_ENVIRONMENT_NAME> --output yaml
```

Collect the Kubernetes state from the cluster:

```bash
kubectl config current-context
kubectl get nodes -o wide
kubectl get pods,services,deployments,statefulsets,daemonsets -n <NAMESPACE> -o wide
kubectl get events -n <NAMESPACE> --sort-by=.lastTimestamp
kubectl describe pod -n <NAMESPACE> <POD_NAME>
kubectl logs -n <NAMESPACE> <POD_NAME> --all-containers=true --tail=200
```

Review all output before sharing it. Remove tokens, shared keys, registry passwords, secrets, authorization headers, certificate data, and unrelated customer data. Don't share the values of extension protected settings. If you're uncertain whether a field contains sensitive data, remove it and tell Microsoft support which field you omitted.

## Connected cluster isn't ready

### Symptoms

- The connected cluster doesn't report a successful provisioning state or a connected status.
- Azure operations against the cluster fail or time out.

### Cause

Common causes include unhealthy Azure Arc agents, blocked outbound connectivity, unsupported proxy or TLS inspection configuration, incorrect system time, or an unregistered resource provider.

### Diagnose

1. Run the following command and inspect the provisioning and connectivity fields:

   ```azurecli
   az connectedk8s show --resource-group <RESOURCE_GROUP> --name <CLUSTER_NAME> --output yaml
   ```

1. Check the Azure Arc agents and recent events:

   ```bash
   kubectl get pods -n azure-arc -o wide
   kubectl get events -n azure-arc --sort-by=.lastTimestamp
   ```

1. Verify the cluster can reach the required [Azure Arc-enabled Kubernetes endpoints](/azure/azure-arc/kubernetes/network-requirements) through the configured firewall and proxy.
1. Verify that the cluster nodes have accurate time and that the required providers are registered:

   ```azurecli
   az provider show --namespace Microsoft.Kubernetes --query registrationState --output tsv
   az provider show --namespace Microsoft.KubernetesConfiguration --query registrationState --output tsv
   az provider show --namespace Microsoft.ExtendedLocation --query registrationState --output tsv
   ```

### Resolve

Restore the Arc agents and required outbound connectivity before changing Container Apps resources. Correct proxy exclusions, TLS inspection, DNS, or time synchronization according to the Azure Arc requirements. Register any provider that reports `NotRegistered`.

### Verify

Run [`az connectedk8s show`](/cli/azure/connectedk8s#az-connectedk8s-show) again and confirm that provisioning succeeds and connectivity is restored. Confirm that all pods in the `azure-arc` namespace are ready.

### Escalate

Collect the connected-cluster resource ID, sanitized `az connectedk8s show` output, Arc agent pod status, events, and affected time range. Don't include kubeconfig content, tokens, or proxy credentials.

## Extension installation fails or times out

### Symptoms

- The extension provisioning state remains pending or reports failure.
- The installation wait command ends, but the extension isn't ready.

### Cause

Common causes include an unsupported Kubernetes version or node architecture, insufficient capacity, image pull failures, admission policy denials, namespace conflicts, an existing KEDA installation, or an unavailable load balancer.

### Diagnose

1. Inspect the complete extension status and status message:

   ```azurecli
   az k8s-extension show --resource-group <RESOURCE_GROUP> --cluster-type connectedClusters --cluster-name <CLUSTER_NAME> --name <EXTENSION_NAME> --output yaml
   ```

1. Check nodes, extension pods, scheduling events, and image pulls:

   ```bash
   kubectl get nodes -o wide
   kubectl get pods -n <NAMESPACE> -o wide
   kubectl get events -n <NAMESPACE> --sort-by=.lastTimestamp
   ```

1. Check for an existing KEDA installation:

   ```bash
   kubectl get deployment -A | grep -i keda
   ```

1. Confirm that the extension release namespace and the configured application namespace match, and inspect `LoadBalancer` services:

   ```bash
   kubectl get services -n <NAMESPACE>
   ```

### Resolve

Correct the first reported dependency problem. Free cluster capacity, correct image-registry connectivity, address the admission policy with the cluster policy owner, or resolve namespace conflicts. If KEDA already exists, stop and confirm the supported coexistence configuration before continuing. Don't remove the existing KEDA installation or apply undocumented extension settings because other workloads might depend on it. Don't delete the custom location or connected environment to repair an extension failure. If extension removal is required after correcting the cause, review the impact and use the supported [`az k8s-extension delete`](/cli/azure/k8s-extension#az-k8s-extension-delete) command before reinstalling.

### Verify

Run [`az k8s-extension show`](/cli/azure/k8s-extension#az-k8s-extension-show) and confirm that the provisioning state is `Succeeded`. Confirm that extension pods are running and ready before creating a custom location.

### Escalate

Collect sanitized extension status, release train and version, Kubernetes version, node OS and architecture, namespace events, and failing pod logs. Don't include protected settings or registry credentials.

## Extension pods are pending or restarting

### Symptoms

- One or more extension pods remain `Pending`, `CrashLoopBackOff`, `ImagePullBackOff`, or `OOMKilled`.
- Extension-backed operations are unavailable or intermittent.

### Cause

Pods can fail because of insufficient CPU or memory, node taints or affinity rules, image pull restrictions, volume failures, admission policy, or component startup errors.

### Diagnose

1. Compare the affected component with the expected extension components and resource requests in [Resources created by the Container Apps extension](azure-arc-overview.md#resources-created-by-the-container-apps-extension).
1. Describe the pod and inspect scheduling and container states:

   ```bash
   kubectl describe pod -n <NAMESPACE> <POD_NAME>
   kubectl get events -n <NAMESPACE> --sort-by=.lastTimestamp
   ```

1. For a restarting pod, collect current and previous logs:

   ```bash
   kubectl logs -n <NAMESPACE> <POD_NAME> --all-containers=true --tail=200
   kubectl logs -n <NAMESPACE> <POD_NAME> --all-containers=true --previous --tail=200
   ```

### Resolve

Address the condition shown in the pod events. Add allocatable capacity, correct taints or placement constraints, restore registry access, repair volume dependencies, or adjust an approved policy exception. Don't edit extension-managed deployments directly because the extension can overwrite those changes.

### Verify

Run [`kubectl get`](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/) `pods -n <NAMESPACE>` and confirm that all expected pods are running and ready without increasing restart counts.

### Escalate

Collect sanitized pod descriptions, events, current and previous logs, node allocatable resources, and the extension version. Don't include Kubernetes secrets or environment-variable values.

## Custom location creation fails

### Symptoms

- [`az customlocation create`](/cli/azure/customlocation#az-customlocation-create) fails.
- The custom location doesn't reach a `Succeeded` provisioning state.

### Cause

Common causes include a disabled custom locations feature, incorrect extension ID, a namespace mismatch, service-account or Azure RBAC permissions, provider registration, or a stale failed resource.

### Diagnose

1. Confirm that the connected cluster and extension are healthy.
1. Retrieve the extension ID and compare it with the ID used to create the custom location:

   ```azurecli
   az k8s-extension show --resource-group <RESOURCE_GROUP> --cluster-type connectedClusters --cluster-name <CLUSTER_NAME> --name <EXTENSION_NAME> --query id --output tsv
   az customlocation show --resource-group <RESOURCE_GROUP> --name <CUSTOM_LOCATION_NAME> --output yaml
   ```

1. Confirm that the custom location namespace matches the extension release namespace and configured application namespace.
1. Verify `Microsoft.ExtendedLocation` registration and, if required, [enable custom locations on the cluster](/azure/azure-arc/kubernetes/custom-locations#enable-custom-locations-on-your-cluster).

### Resolve

Correct the extension ID, namespace, feature enablement, provider registration, or permissions. Retry creation only after the extension is healthy. Before removing a failed custom location, confirm that no connected environment depends on it.

### Verify

Run [`az customlocation show`](/cli/azure/customlocation#az-customlocation-show) and confirm that `provisioningState` is `Succeeded` and the expected cluster extension ID and namespace are present.

### Escalate

Collect the sanitized custom-location output, connected-cluster and extension resource IDs, namespace, provider states, error text, and correlation ID. Don't include access tokens or kubeconfig content.

## Connected environment creation fails

### Symptoms

- [`az containerapp connected-env create`](/cli/azure/containerapp/connected-env#az-containerapp-connected-env-create) fails or times out.
- The connected environment remains in a failed or pending state.

### Cause

Common causes include an unhealthy custom location or extension, an unsupported Azure metadata region, missing `Microsoft.App` registration, or invalid environment name or domain configuration.

### Diagnose

1. Confirm that the custom location and extension provisioning states are `Succeeded`.
1. Inspect the connected environment and provider state.

   ```azurecli
   az containerapp connected-env show --resource-group <RESOURCE_GROUP> --name <CONNECTED_ENVIRONMENT_NAME> --output yaml
   az provider show --namespace Microsoft.App --query registrationState --output tsv
   ```

1. Compare the selected Azure region with the supported regions in [Azure Container Apps on Azure Arc limitations](azure-arc-overview.md#limitations).

### Resolve

Repair the custom location or extension first. Register `Microsoft.App` if needed, and then retry the connected-environment operation with a supported region and valid name. Don't recreate the custom location when it's healthy.

### Verify

Run [`az containerapp connected-env show`](/cli/azure/containerapp/connected-env#az-containerapp-connected-env-show) and confirm that `provisioningState` is `Succeeded` and the custom location reference is correct.

### Escalate

Collect sanitized connected-environment, custom-location, and extension output; the Azure region; the resource IDs; and the correlation ID. Don't include secrets or authorization headers.

## Ingress service has no external IP

### Symptoms

- The extension ingress `LoadBalancer` service shows an external IP of `<pending>`.
- The connected environment is created, but no reachable ingress address is available.

### Cause

The Kubernetes cluster might not have a working `LoadBalancer` implementation, its address pool might be exhausted, the requested address might be unavailable, or firewall and health-probe traffic might be blocked.

### Diagnose

1. List services and identify the extension ingress service:

   ```bash
   kubectl get services -n <NAMESPACE> -o wide
   ```

1. Describe that service and review its events:

   ```bash
   kubectl describe service -n <NAMESPACE> <INGRESS_SERVICE_NAME>
   kubectl get events -n <NAMESPACE> --sort-by=.lastTimestamp
   ```

1. Confirm that the cluster load balancer has an available address and permits its required health probes and traffic.
1. For AKS on Azure Local, verify the [load balancer configuration](/azure/aks/aksarc/configure-load-balancer) and custom CoreDNS prerequisite.

### Resolve

Configure or repair the supported Kubernetes load balancer, provide an available address, and allow its health-probe path. If installation used the extension `loadBalancerIp` setting, confirm that the address is reserved and assigned to the load balancer before changing the extension configuration.

### Verify

Run `kubectl get services -n <NAMESPACE>` and confirm that the ingress service has the expected external IP. Test reachability to that address from the intended client network.

### Escalate

Collect the sanitized service description, events, load balancer implementation and address pool configuration, health probe status, and firewall path. Don't include certificates or credentials.

## Application ingress isn't reachable

### Symptoms

- The application fully qualified domain name (FQDN) doesn't resolve, times out, or returns an unexpected HTTP or TLS response.
- Direct access to the ingress address works, but the application hostname doesn't.

### Cause

Common causes include a missing wildcard DNS record, client DNS differences, blocked routing, certificate or TLS problems, an unhealthy ingress component, incorrect target port, failed application probes, or internal ingress.

### Diagnose

1. Retrieve the configured FQDN and ingress settings.

   ```azurecli
   az containerapp show --resource-group <RESOURCE_GROUP> --name <CONTAINER_APP_NAME> --query "{fqdn:properties.configuration.ingress.fqdn,external:properties.configuration.ingress.external,targetPort:properties.configuration.ingress.targetPort}" --output yaml
   ```

1. Resolve and request the FQDN from the affected client network.

   ```bash
   nslookup <APPLICATION_FQDN>
   curl --verbose https://<APPLICATION_FQDN>
   ```

1. Confirm that the result resolves to the extension ingress IP. Check ingress pods, services, application pods, and probe events.

### Resolve

Create or correct the wildcard DNS record for the connected-environment domain, restore the client network path, correct certificate configuration, or fix the application's target port and probes. If ingress is internal, test from a network that can reach the internal load balancer rather than exposing it as a troubleshooting shortcut.

### Verify

Resolve the application FQDN from each intended client network and confirm that an HTTP or HTTPS request returns the expected application response.

### Escalate

Collect the FQDN, DNS result, ingress IP, sanitized verbose request output, ingress and application pod status, probe events, and affected client location. Remove authorization headers, cookies, and certificate private data.

## Revision isn't ready

### Symptoms

- A new revision isn't ready.
- The application has zero ready replicas or remains in a provisioning state.

### Cause

Common causes include an incompatible image or architecture, invalid registry credentials, an incorrect startup command or port, failed probes, insufficient resources, volume mount failures, or missing secret references.

### Diagnose

1. Inspect application and revision state:

   ```azurecli
   az containerapp show --resource-group <RESOURCE_GROUP> --name <CONTAINER_APP_NAME> --output yaml
   az containerapp revision list --resource-group <RESOURCE_GROUP> --name <CONTAINER_APP_NAME> --output table
   ```

1. Inspect the affected pods, events, and logs:

   ```bash
   kubectl get pods -n <APPS_NAMESPACE> -o wide
   kubectl get events -n <APPS_NAMESPACE> --sort-by=.lastTimestamp
   kubectl describe pod -n <APPS_NAMESPACE> <POD_NAME>
   kubectl logs -n <APPS_NAMESPACE> <POD_NAME> --all-containers=true --tail=200
   ```

### Resolve

Correct the image and registry credentials, startup command, target port, probes, requested resources, volume configuration, or secret reference identified by the events. Deploy the corrected application configuration as a new revision. Don't edit revision pods directly.

### Verify

Run [`az containerapp revision list`](/cli/azure/containerapp/revision#az-containerapp-revision-list) and confirm that the new revision is active and healthy with ready replicas. Send a request to the application if ingress is enabled.

### Escalate

Collect sanitized application and revision configuration, pod descriptions, events, logs, image name and architecture, and extension version. Don't include registry passwords or secret values.

## Application doesn't scale

### Symptoms

- Replica count doesn't respond to load or an event source.
- The application doesn't activate from zero replicas.
- Desired replicas remain pending.

### Cause

Common causes include unhealthy KEDA components, invalid scaler authentication, an unreachable trigger source, incorrect minimum or maximum replicas, insufficient cluster capacity, or an unavailable scale-from-zero activation path.

### Diagnose

1. Inspect the application's scale configuration and revision state.

   ```azurecli
   az containerapp show --resource-group <RESOURCE_GROUP> --name <CONTAINER_APP_NAME> --query properties.template.scale --output yaml
   az containerapp revision list --resource-group <RESOURCE_GROUP> --name <CONTAINER_APP_NAME> --output table
   ```

1. Check KEDA and scaling components, application pods, and events.

   ```bash
   kubectl get deployments,pods -n <NAMESPACE> | grep -i keda
   kubectl get pods -n <APPS_NAMESPACE> -o wide
   kubectl get events -n <APPS_NAMESPACE> --sort-by=.lastTimestamp
   ```

1. Test trigger-source connectivity from the cluster without printing authentication values.

### Resolve

Restore KEDA health, correct the scale rule and its secret references, permit access to the trigger source, or add schedulable cluster capacity. Confirm that the maximum replica setting is greater than the minimum and that it doesn't exceed available cluster capacity.

### Verify

Generate a controlled trigger or request load and confirm that ready replicas increase and later return to the configured minimum. For scale to zero, confirm that a new trigger activates a replica and completes successfully.

### Escalate

Collect sanitized scale configuration, revision state, KEDA pod status and logs, application events, trigger type, and test timestamps. Don't include scaler credentials or message payloads.

## Job doesn't start or complete

### Symptoms

- A manual, scheduled, or event-driven job doesn't start.
- An execution remains running, retries repeatedly, or ends in failure.

### Cause

Common causes include incorrect trigger configuration, schedule, or authentication, parallelism and completion settings, retry or timeout behavior, image pull failure, insufficient capacity, or application failure.

### Diagnose

1. Inspect the job and recent executions:

   ```azurecli
   az containerapp job show --resource-group <RESOURCE_GROUP> --name <JOB_NAME> --output yaml
   az containerapp job execution list --resource-group <RESOURCE_GROUP> --name <JOB_NAME> --output table
   ```

1. Check execution pods, events, and logs in the application namespace:

   ```bash
   kubectl get pods -n <APPS_NAMESPACE> -o wide
   kubectl get events -n <APPS_NAMESPACE> --sort-by=.lastTimestamp
   kubectl logs -n <APPS_NAMESPACE> <JOB_POD_NAME> --all-containers=true --tail=200
   ```

### Resolve

Correct the trigger, schedule, authentication reference, replica completion count, parallelism, retry limit, timeout, image, or resource request indicated by the execution and Kubernetes events. Add cluster capacity when execution pods remain pending. Keep failed execution data until required logs are collected.

### Verify

Start or wait for a controlled execution and confirm that it reaches the expected completion state. Confirm that its output and side effects are correct. Design job processing to be idempotent because retries and event delivery can cause work to run more than once.

### Escalate

Collect sanitized job configuration, execution history, pod description, events, logs, trigger type, and timestamps. Don't include trigger credentials, payload data, or secrets.

## Logs are missing

### Symptoms

- Application logs don't appear in the configured Log Analytics workspace.
- [`kubectl logs`](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_logs/) works, but the workspace query returns no records.

### Cause

Log Analytics might not be configured during extension installation, the log processor might be disabled or unhealthy, the wrong workspace might be queried, ingestion might be delayed, or the query might use an incorrect table or field.

### Diagnose

1. Inspect the extension configuration without requesting protected settings and verify the intended log destination:

   ```azurecli
   az k8s-extension show --resource-group <RESOURCE_GROUP> --cluster-type connectedClusters --cluster-name <CLUSTER_NAME> --name <EXTENSION_NAME> --output yaml
   ```

1. Check the log-processor pods and recent logs:

   ```bash
   kubectl get pods -n <NAMESPACE> | grep -i log-processor
   kubectl logs -n <NAMESPACE> <LOG_PROCESSOR_POD_NAME> --all-containers=true --tail=200
   ```

1. Confirm that application output exists at the Kubernetes layer:

   ```bash
   kubectl logs -n <APPS_NAMESPACE> <APPLICATION_POD_NAME> --all-containers=true --tail=200
   ```

1. In the configured workspace, run a broad query before filtering on application fields:

   ```kusto
   ContainerAppConsoleLogs_CL
   | where TimeGenerated > ago(1h)
   | take 100
   ```

### Resolve

Query the workspace configured when the extension was installed, restore unhealthy log-processor pods by correcting their reported dependency, and correct the query table or fields. You can't add Log Analytics to an existing extension after installation. If the extension wasn't configured for Log Analytics, use Kubernetes logging or plan a supported extension reinstallation after reviewing its impact. Setting `logProcessor.enabled=false` disables log processing and workspace forwarding.

### Verify

Write a unique test message to application standard output. Confirm that `kubectl logs` shows it and, when Log Analytics is configured, that it appears in the workspace after the normal ingestion delay.

### Escalate

Collect the workspace resource ID, sanitized extension configuration, log-processor pod status and logs, application and test-message timestamps, and the query text. Don't include the workspace shared key or application log data unrelated to the issue.

## Provider registration error

### Symptoms

- An operation returns `No registered resource provider found`.
- A required provider remains `NotRegistered` or `Registering`.

### Cause

The active subscription didn't complete registration for a provider required by the connected cluster, extension, custom location, connected environment, or Log Analytics configuration.

### Diagnose

1. Confirm the active subscription:

   ```azurecli
   az account show --query "{name:name,id:id}" --output table
   ```

1. Check all providers used by the setup path:

   ```azurecli
   az provider show --namespace Microsoft.Kubernetes --query registrationState --output tsv
   az provider show --namespace Microsoft.KubernetesConfiguration --query registrationState --output tsv
   az provider show --namespace Microsoft.ExtendedLocation --query registrationState --output tsv
   az provider show --namespace Microsoft.App --query registrationState --output tsv
   az provider show --namespace Microsoft.Web --query registrationState --output tsv
   az provider show --namespace Microsoft.OperationalInsights --query registrationState --output tsv
   ```

### Resolve

Register any provider that isn't registered. For example:

```azurecli
az provider register --namespace Microsoft.App --wait
```

Provider registration can take several minutes. Don't repeatedly recreate resources while registration is in progress. If connected-environment creation returns `No registered resource provider found` while `Microsoft.App` already reports `Registered`, re-register `Microsoft.App` with the preceding command, and then retry the operation. Re-registering the provider doesn't affect existing applications or APIs.

### Verify

Run [`az provider show`](/cli/azure/provider#az-provider-show) `--namespace <PROVIDER_NAMESPACE> --query registrationState --output tsv` and confirm that it returns `Registered`. Retry the original operation in the same subscription.

### Escalate

Collect the subscription ID, provider namespace and state, registration timestamp, original error, correlation ID, and affected resource ID. Don't include access tokens.

## Upgrade fails

### Symptoms

- An automatic or requested extension upgrade remains pending or fails.
- Extension pods become unhealthy during or after an upgrade.

### Cause

Common causes include Kubernetes compatibility, insufficient upgrade capacity, blocked image pulls, admission policy, pod disruption constraints, or an unhealthy pre-upgrade extension.

### Diagnose

1. Record the extension version, release train, automatic minor-version setting, provisioning state, and status message.

   ```azurecli
   az k8s-extension show --resource-group <RESOURCE_GROUP> --cluster-type connectedClusters --cluster-name <CLUSTER_NAME> --name <EXTENSION_NAME> --output yaml
   ```

1. Compare the current and target versions with the [Container Apps extension release notes](container-apps-extension-release-notes.md).
1. Check node capacity, extension pods, events, image pulls, and disruption-related messages.

   ```bash
   kubectl get nodes
   kubectl get pods -n <NAMESPACE> -o wide
   kubectl get events -n <NAMESPACE> --sort-by=.lastTimestamp
   ```

### Resolve

Restore extension health and adequate upgrade capacity, and then correct registry connectivity or policy denials reported in events. Don't manually change extension-managed Kubernetes workloads or attempt an undocumented rollback. Before changing the release train, automatic upgrade setting, or extension version, review the supported path with Microsoft support.

### Verify

Run `az k8s-extension show` and confirm that provisioning succeeds at the intended supported version. Confirm that all extension pods stabilize and that connected-environment and application operations succeed.

### Escalate

Collect the sanitized extension output, current and target versions, release train, Kubernetes version, node capacity, events, failing pod logs, upgrade start time, and correlation IDs. Don't include protected settings or registry credentials.

## Related content

- [Azure Container Apps on Azure Arc](azure-arc-overview.md)
- [Set up an Azure Arc-enabled Kubernetes cluster to run Azure Container Apps](azure-arc-enable-cluster.md)
- [Create a container app on Azure Arc](azure-arc-create-container-app.md)
- [Azure Container Apps extension release notes](container-apps-extension-release-notes.md)
- [Troubleshoot Azure Arc-enabled Kubernetes connectivity](/azure/azure-arc/kubernetes/troubleshooting)