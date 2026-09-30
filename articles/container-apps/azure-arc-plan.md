---
title: Plan a Container Apps deployment on Azure Arc-enabled Kubernetes
description: Plan cluster capacity, networking, DNS, identity, storage, observability, security, and lifecycle before installing Azure Container Apps on Azure Arc-enabled Kubernetes.
services: container-apps
author: jefmarti
ms.service: azure-container-apps
ms.topic: concept-article
ms.date: 09/15/2026
ms.author: jefmarti
ms.reviewer: cshoe
---

# Plan a Container Apps deployment on Azure Arc-enabled Kubernetes

Use this article before installing the Container Apps extension on a production cluster. Container Apps on Azure Arc uses capacity and platform services supplied by your Kubernetes cluster. Decisions about nodes, load balancing, DNS, outbound connectivity, storage, identity, logging, and upgrades affect application availability.

Use the sections in this article to identify deployment requirements and validate prerequisites before installation.

## Planning scope

Container Apps on Azure Arc spans Azure resources, an existing Kubernetes cluster, and deployed applications. Plan for the following areas:

| Area | Planning inputs |
| --- | --- |
| Azure management resources | Connected cluster, cluster extension, custom location, connected environment, provider registration, Azure RBAC, resource organization, container apps, and jobs |
| Kubernetes cluster | Supported distribution and version, nodes, capacity, Kubernetes and OS lifecycle, cluster security, backup, and disaster recovery |
| Networking | `LoadBalancer` implementation, IP addresses, routing, firewalls, DNS, certificates, outbound connectivity, and application dependencies |
| Workloads | Images, revisions, scaling and job configuration, data, health probes, secrets, and resource requirements |
| Observability | Kubernetes diagnostics, optional Log Analytics integration, access, retention, alerting, and ingestion costs |

## Supported topology and version matrix

Use the latest vendor-supported Kubernetes patch release that Azure Arc-enabled Kubernetes also supports. The Container Apps documentation doesn't publish a separate Kubernetes version range for each distribution. Validate the exact distribution and Kubernetes version with Microsoft support before a production installation or upgrade.

The following matrix records the currently published distribution support. Revalidate it against [Available extensions for Azure Arc-enabled Kubernetes clusters](/azure/azure-arc/kubernetes/extensions-release) and [Azure Container Apps on Azure Arc limitations](azure-arc-overview.md#limitations) before every installation.

| Distribution | Kubernetes version | Nodes | Load balancer | DNS preparation | Validated storage driver | Extension release train | Status | Last validated |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Azure Kubernetes Service (AKS) | Current vendor-supported version; confirm extension compatibility | Linux `amd64` | Kubernetes `LoadBalancer` service implementation | Validate generated and custom application names | SMB CSI driver 1.18.0 or later for Azure Files SMB | `stable` | Supported | 2026-09-03 |
| AKS on Azure Local | Current vendor-supported version; confirm extension compatibility | Linux `amd64` | HAProxy or another supported load balancer configured before installation | Custom CoreDNS prerequisite; validate generated and custom application names | SMB CSI driver 1.18.0 or later for Azure Files SMB | `stable` | Supported | 2026-09-03 |
| Azure Red Hat OpenShift | Current vendor-supported version; confirm extension compatibility | Linux `amd64` | Platform `LoadBalancer` implementation | Validate generated and custom application names | SMB CSI driver 1.18.0 or later for Azure Files SMB | `stable` | Supported | 2026-09-03 |
| Google Kubernetes Engine | Current vendor-supported version; confirm extension compatibility | Linux `amd64` | Platform `LoadBalancer` implementation | Validate generated and custom application names | SMB CSI driver 1.18.0 or later for Azure Files SMB | `stable` | Supported | 2026-09-03 |
| OpenShift Container Platform | Current vendor-supported version; confirm extension compatibility | Linux `amd64` | Platform `LoadBalancer` implementation | Validate generated and custom application names | SMB CSI driver 1.18.0 or later for Azure Files SMB | `stable` | Supported | 2026-09-03 |

The extension isn't supported on Windows nodes or Arm64 clusters. The Arc extension framework requires at least one suitable `linux/amd64` node, but a production deployment requires enough suitable nodes for the extension, workloads, upgrades, and failures.

Only one supported KEDA installation can run on the cluster. Determine whether KEDA will be installed by the Container Apps extension or already exists on the cluster. If KEDA already exists, stop and confirm the supported coexistence configuration before continuing. Don't remove the existing KEDA installation or apply undocumented extension settings because other workloads might depend on it.

## Capacity requirements

Plan capacity for:

- The fixed and per-node Container Apps extension components listed in [Resources created by the Container Apps extension](azure-arc-overview.md#resources-created-by-the-container-apps-extension).
- The maximum expected replicas of every container app.
- Concurrent job executions and retry bursts.
- Dapr sidecars and application sidecars.
- Kubernetes system workloads and other cluster tenants.
- Rolling node and extension upgrades.
- At least one node failure in a highly available deployment.

Setting an application maximum replica count doesn't reserve cluster capacity.

### Minimum installation capacity

There's no universal production minimum because extension placement, enabled components, node count, daemon workloads, KEDA installation, Log Analytics, Dapr use, and workload requests vary. Use the published extension component requests as the baseline and measure allocatable, not total, node resources. An evaluation cluster size isn't a production sizing recommendation.

Before installation, record:

- Allocatable CPU and memory on eligible `linux/amd64` nodes.
- Node count and failure-domain placement.
- Free pod and service IP capacity.
- Current system and tenant requests and limits.
- Capacity unavailable because of taints, affinity, quotas, or disruption budgets.

### Estimate workload capacity

For each application, calculate:

`peak capacity = maximum replicas x (application requests + sidecar requests)`

Add peak concurrent job capacity, extension capacity, system reserve, upgrade surge, and failure reserve. Ensure node labels, taints, affinity rules, and resource fragmentation don't make nominally free capacity unschedulable.

Validate the plan by scheduling representative workloads and by simulating a node drain. Confirm that extension pods and the required workload replicas remain ready.

## Network requirements

Container Apps on Azure Arc requires several distinct network paths:

| Path | Direction | Requirement |
| --- | --- | --- |
| Azure Arc agents and extension management | Outbound from cluster | HTTPS over TCP 443 to the endpoints required for Azure Arc, custom locations, identity, and extension image pulls. WebSockets must be allowed for the required Service Bus endpoints. Cluster Connect with Azure RBAC can also require outbound TCP 8084. |
| Application ingress | Inbound from intended client networks | Client traffic must reach the IP assigned to the extension ingress `LoadBalancer` service on the listener ports used by the deployment, normally HTTP or HTTPS. |
| Application dependencies | Outbound from application pods | DNS and network access to registries, identity endpoints, data stores, event sources, certificate services, and any other application dependency. |
| Cluster internal traffic | Within the cluster | Pod-to-pod, pod-to-service, DNS, admission webhook, health-probe, and control-plane traffic required by the distribution and extension. |

Use [Azure Arc-enabled Kubernetes network requirements](/azure/azure-arc/kubernetes/network-requirements) as the canonical endpoint list. Don't copy the endpoint list into a firewall rule set without selecting the correct Azure cloud and enabled Arc features. Test every required fully qualified domain name (FQDN) from the cluster network. The Arc requirements state that HTTPS endpoints use officially signed and verifiable certificates. Confirm proxy and TLS-inspection behavior in a nonproduction cluster; unsupported interception or an untrusted replacement certificate can prevent agents and extension components from connecting.

The selected `LoadBalancer` implementation determines the address pool, health probes, routing, and required capacity. If a custom load balancer requires a reserved address, reserve the address first and pass it through the extension `loadBalancerIp` setting during installation. Health-probe ports and source ranges are implementation-specific; obtain them from the selected load balancer rather than assuming Azure Load Balancer defaults.

The underlying Arc-enabled Kubernetes cluster controls network restrictions for the connected environment. If an application dependency uses a private endpoint, verify from an application pod that the cluster can resolve its DNS name and route to its private IP. Applications that need client IP information should validate the forwarding headers produced by the selected load balancer and proxy chain and define which proxies are trusted.

### Validate networking

1. Deploy a Kubernetes `LoadBalancer` test service and confirm that it receives an address reachable from every intended client network.
1. From an eligible cluster node or diagnostic pod, resolve and connect to every required Azure Arc endpoint and workload dependency.
1. Confirm that the proxy allows required HTTPS and WebSocket traffic and doesn't replace certificates with an untrusted issuer.
1. Confirm that cluster DNS, pod-to-pod traffic, services, admission webhooks, and load-balancer health probes work with the intended network policies.
1. After extension installation, confirm that the ingress service receives the planned IP and is reachable before creating production DNS records.

## DNS requirements

After extension installation, deploy a test application and retrieve its generated FQDN. Verify that the FQDN resolves and reaches the extension ingress from every intended client network. The connected-environment name forms part of the generated application domain, so choose it deliberately.

For internal applications, use split-horizon DNS when internal and external clients require different answers. Identify the authoritative DNS zone, record time to live, and recovery requirements. Determine whether applications use the generated domain, custom domains, or both, and plan certificate issuance and renewal before deployment.

Validate DNS and ingress from each intended client network:

```bash
nslookup <APPLICATION_FQDN>
curl --verbose https://<APPLICATION_FQDN>
```

The application FQDN must resolve to the ingress IP and return the expected application response. Remove authorization headers, cookies, and sensitive query strings before sharing verbose output.

## Identity, secrets, and registries

Managed identities aren't supported for container apps on Azure Arc. Pulling images from Azure Container Registry by using managed identity is also unsupported.

For access to Azure resources, use a dedicated application registration and service principal only when the target service supports it. Grant only the required data-plane roles at the narrowest practical scope. Keep the tenant ID and client ID separate from the credential, use a certificate when the application and target service support it, and plan credential expiration and rotation. Don't reuse the Arc connected-cluster identity or a cluster-administrator identity for application access.

For private registries, use a registry-scoped credential with pull-only access where the registry supports it. Avoid ACR administrator credentials for production workloads. Store registry and application credentials as Container Apps secrets and reference them by name from application configuration.

Container Apps secrets are application-scoped, and changing a secret doesn't automatically update existing revisions. Treat both Azure control-plane access and privileged Kubernetes access as security boundaries. Restrict access to the extension and application namespaces according to the Kubernetes security requirements for the deployment.

Use this rotation sequence:

1. Create a second valid credential at the identity provider or registry.
1. Update the Container Apps secret and deploy or restart the affected revision as required.
1. Verify image pulls and application authentication with the new credential.
1. Revoke the old credential.
1. Confirm that no active revision or job still references the old value.

Never place secret values in command history, source control, diagnostic bundles, pod descriptions, or application logs. Limit who can read extension protected settings and Kubernetes secrets.

## Storage

Plan storage according to the persistence required by the workload:

| Storage | Scope and persistence | Planning requirement |
| --- | --- | --- |
| Container file system | One container; removed when the container is replaced | Use only for temporary data. |
| `EmptyDir` | Containers in one replica; removed with the replica | Use for temporary shared data within a replica. |
| Azure Files over SMB | Persistent shared file storage | Install the SMB CSI driver version 1.18.0 or later before use and verify network access to the file share. Configure `ReadOnly` or `ReadWrite` access deliberately. |

The Container Apps on Arc limitations currently document Azure Files SMB and require the SMB CSI driver. Don't assume that a volume type supported by Azure-hosted Container Apps is supported on Arc. Use the SMB installation commands linked from [Azure Container Apps on Azure Arc](azure-arc-overview.md#how-can-i-install-smb-driver) instead of maintaining another copy here.

Treat storage-account credentials used for a mount as secrets. Managed identities aren't supported for Container Apps on Arc. Test the selected mount options, file permissions, concurrent access, failure behavior, and credential rotation with the exact CSI driver and storage service versions used in production.

Plan persistent-data backup, restore testing, retention, and disaster recovery. Test how revisions and jobs report mount failures, and include pod events and CSI driver logs in the diagnostic procedure. Linux is the only supported node OS for the extension.

## Plan observability

Log Analytics integration is optional. If you plan to use it, configure it when you install the extension because you can't add it to that extension instance later.

When you configure Log Analytics, you can find application logs in `ContainerAppConsoleLogs_CL`. The [Create a container app on Azure Arc](azure-arc-create-container-app.md) tutorial demonstrates `TimeGenerated`, `ContainerAppName_s`, and `Log_s`; inspect the live table before building queries or alerts. Allow 10 to 15 minutes when validating initial ingestion.

Plan workspace access, retention, alerting, export, and ingestion cost. Review application logging for credentials, personal data, and sensitive URLs before enabling collection.

If you don't configure Log Analytics, or during an ingestion incident, use Kubernetes logs:

```bash
kubectl get pods -n <APPS_NAMESPACE> -o wide
kubectl logs -n <APPS_NAMESPACE> <POD_NAME> --all-containers=true --tail=200
kubectl get events -n <APPS_NAMESPACE> --sort-by=.lastTimestamp
```

System components write logs to standard output. By default, system component telemetry is sent to Microsoft while application logs aren't sent unless you configure Log Analytics. Setting `logProcessor.enabled=false` disables log processing and forwarding to the workspace and can increase the diagnostic evidence that support asks you to collect manually.

Before production, test a unique application log message end to end, create alerts for extension health and application failures, and confirm that both Azure and Kubernetes diagnostics are accessible.

## Upgrade, backup, and recovery

Select and document an extension release train and upgrade policy. The Container Apps setup tutorial uses the `stable` release train with automatic minor-version upgrades. Azure Arc cluster extensions can follow a release train with automatic upgrades or be pinned and upgraded manually. Review [Container Apps extension release notes](container-apps-extension-release-notes.md) before changing versions, and provide spare capacity, compatible Kubernetes versions, maintenance windows, and application validation.

Before an extension or Kubernetes upgrade:

1. Confirm that the connected cluster and extension provisioning states are `Succeeded`.
1. Confirm the target Kubernetes and extension combination is supported.
1. Review release notes and current configuration, including release train, automatic-upgrade setting, KEDA installation, namespaces, Log Analytics, and `loadBalancerIp`.
1. Verify spare capacity for rolling replacement and confirm disruption budgets permit progress.
1. Verify image-registry connectivity and admission policies for the target images.
1. Back up application source configuration and all persistent application data.
1. Run application, ingress, scaling, job, storage, and logging smoke tests before and after the change.

Don't treat Kubernetes namespace backup as a backup of the Azure resources. The connected cluster, extension, custom location, connected environment, container apps, and jobs are represented in Azure Resource Manager and have dependencies on in-cluster resources. Back up declarative application configuration separately. Don't manually restore extension-managed deployments, custom resources, or secrets over a newly installed extension unless Microsoft support provides that recovery procedure.

An extension downgrade or rollback isn't a general recovery mechanism documented for Container Apps on Arc. Don't change the release train, pin an older version, or modify extension-managed workloads as an incident response without confirming a supported path with Microsoft support.

Develop and test a recovery runbook that accounts for Kubernetes infrastructure, networking, DNS, load balancing, storage, Azure Arc agents, the Container Apps extension, custom location, connected environment, application configuration, credentials, and persistent application data. Validate ingress, revisions, scaling, jobs, storage, and logs after recovery. Use recovery procedures supported by the Kubernetes topology and backup products in the deployment.

Plan for Azure disconnection. Arc agents require connectivity to discover extension changes and propagate desired state. Protected settings for a newly created extension resource are retained for up to 48 hours; if the cluster remains disconnected during that period, the extension can move from `Pending` to `Failed`. Test workload behavior during loss of Azure connectivity rather than assuming a continuity guarantee.

## Related content

- [Azure Container Apps on Azure Arc](azure-arc-overview.md)
- [Set up an Azure Arc-enabled Kubernetes cluster to run Azure Container Apps](azure-arc-enable-cluster.md)
- [Create a container app on Azure Arc](azure-arc-create-container-app.md)
- [Troubleshoot Azure Container Apps on Azure Arc-enabled Kubernetes](azure-arc-troubleshoot.md)
- [Azure Arc-enabled Kubernetes network requirements](/azure/azure-arc/kubernetes/network-requirements)
- [Custom locations on Azure Arc-enabled Kubernetes](/azure/azure-arc/kubernetes/custom-locations)
- [Cluster extensions in Azure Arc-enabled Kubernetes](/azure/azure-arc/kubernetes/conceptual-extensions)
