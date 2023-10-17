---
title: Self-hosted gateway on Kubernetes in production | Azure API Management
description: Learn about guidance to run an API Management self-hosted gateway on Kubernetes for production workloads
author: tomkerkhove
manager: mrcarlosdev
ms.service: api-management
ms.workload: mobile
ms.topic: article
ms.author: tomkerkhove
ms.date: 01/17/2023
---

# Guidance for running self-hosted gateway on Kubernetes in production

In order to run the self-hosted gateway in production, there are various aspects to take in to mind. For example, it should be deployed in a highly available manner, use configuration backups to handle temporary disconnects and many more.

This article provides guidance on how to run [self-hosted gateway](./self-hosted-gateway-overview.md) on Kubernetes for production workloads to ensure that it will run smoothly and reliably.

[!INCLUDE [preview](./includes/preview/preview-callout-self-hosted-gateway-deprecation.md)]

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

## Access token
Without a valid access token, a self-hosted gateway can't access and download configuration data from the endpoint of the associated API Management service. The access token can be valid for a maximum of 30 days. It must be regenerated, and the cluster configured with a fresh token, either manually or via automation before it expires.

When you're automating token refresh, use [this management API operation](/rest/api/apimanagement/current-ga/gateway/generate-token) to generate a new token. For information on managing Kubernetes secrets, see the [Kubernetes website](https://kubernetes.io/docs/concepts/configuration/secret).

> [!TIP]
> You can also deploy the self-hosted gateway to Kubernetes and enable authentication to the API Management instance by using [Microsoft Entra ID](self-hosted-gateway-enable-azure-ad.md).

## Autoscaling

While we provide [guidance on the minimum number of replicas](#number-of-replicas) for the self-hosted gateway, we recommend that you use autoscaling for the self-hosted gateway to meet the demand of your traffic more proactively.

There are two ways to autoscale the self-hosted gateway horizontally:

- Autoscale based on resource usage (CPU and memory)
- Autoscale based on the number of requests per second

This is possible through native Kubernetes functionality, or by using [Kubernetes Event-driven Autoscaling (KEDA)](https://keda.sh/). KEDA is a CNCF Incubation project that strives to make application autoscaling simple.

> [!NOTE]
> KEDA is an open-source technology that is not supported by Azure support and needs to be operated by customers.

### Resource-based autoscaling

Kubernetes allows you to autoscale the self-hosted gateway based on resource usage by using a [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/). It allows you to [define CPU and memory thresholds](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/#support-for-resource-metrics), and the number of replicas to scale out or in.

An alternative is to use Kubernetes Event-driven Autoscaling (KEDA) allowing you to scale workloads based on a [variety of scalers](https://keda.sh/docs/latest/scalers/), including CPU and memory.

> [!TIP]
> If you are already using KEDA to scale other workloads, we recommend using KEDA as a unified app autoscaler. If that is not the case, then we strongly suggest to rely on the native Kubernetes functionality through Horizontal Pod Autoscaler.

### Traffic-based autoscaling

Kubernetes doesn't provide an out-of-the-box mechanism for traffic-based autoscaling.

Kubernetes Event-driven Autoscaling (KEDA) provides a few ways that can help with traffic-based autoscaling:

- You can scale based on metrics from a Kubernetes ingress if they're available in [Prometheus](https://keda.sh/docs/latest/scalers/prometheus/) or [Azure Monitor](https://keda.sh/docs/latest/scalers/azure-monitor/) by using an out-of-the-box scaler
- You can install [HTTP add-on](https://github.com/kedacore/http-add-on), which is available in beta, and scales based on the number of requests per second.

## Configuration backup

Configure a local storage volume for the self-hosted gateway container, so it can persist a backup copy of the latest downloaded configuration. If connectivity is down, the storage volume can use the backup copy upon restart. The volume mount path must be `/apim/config` and must be owned by group ID `1001`. See an example on [GitHub](https://github.com/Azure/api-management-self-hosted-gateway/blob/master/examples/self-hosted-gateway-with-configuration-backup.yaml).
To learn about storage in Kubernetes, see the [Kubernetes website](https://kubernetes.io/docs/concepts/storage/volumes/).
To change ownership for a mounted path, see the `securityContext.fsGroup` setting on the [Kubernetes website](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod).

> [!NOTE]
> To learn about self-hosted gateway behavior in the presence of a temporary Azure connectivity outage, see [Self-hosted gateway overview](self-hosted-gateway-overview.md#connectivity-to-azure).

## Container image tag
The YAML file provided in the Azure portal uses the **latest** tag. This tag always references the most recent version of the self-hosted gateway container image.

Consider using a specific version tag in production to avoid unintentional upgrade to a newer version.

You can [download a full list of available tags](https://mcr.microsoft.com/v2/azure-api-management/gateway/tags/list).

> [!TIP]
> When installing with Helm, image tagging is optimized for you. The Helm chart's application version pins the gateway to a given version and does not rely on `latest`.
> 
> Learn more on how to [install an API Management self-hosted gateway on Kubernetes with Helm](how-to-deploy-self-hosted-gateway-kubernetes-helm.md).

## Container resources
By default, the YAML file provided in the Azure portal doesn't specify container resource requests.

It's impossible to reliably predict and recommend the amount of per-container CPU and memory resources and the number of replicas required for supporting a specific workload. Many factors are at play, such as:

- Specific hardware that the cluster is running on.
- Presence and type of virtualization.
- Number and rate of concurrent client connections.
- Request rate.
- Kind and number of configured policies.
- Payload size and whether payloads are buffered or streamed.
- Backend service latency.

We recommend setting resource requests to two cores and 2 GiB as a starting point. Perform a load test and scale up/out or down/in based on the results.

## Custom domain names and SSL certificates

If you use custom domain names for the [API Management endpoints](self-hosted-gateway-overview.md#fqdn-dependencies), especially if you use a custom domain name for the Management endpoint, you might need to update the value of `config.service.endpoint` in the **\<gateway-name\>.yaml** file to replace the default domain name with the custom domain name. Make sure that the Management endpoint can be accessed from the pod of the self-hosted gateway in the Kubernetes cluster.

In this scenario, if the SSL certificate that's used by the Management endpoint isn't signed by a well-known CA certificate, you must make sure that the CA certificate is trusted by the pod of the self-hosted gateway.

> [!NOTE]
> With the self-hosted gateway v2, API Management provides a new configuration endpoint: `<apim-service-name>.configuration.azure-api.net`. Custom hostnames are  supported for this endpoint and can be used instead of the default hostname. 

## DNS policy
DNS name resolution plays a critical role in a self-hosted gateway's ability to connect to dependencies in Azure and dispatch API calls to backend services.

The YAML file provided in the Azure portal applies the default [ClusterFirst](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy) policy. This policy causes name resolution requests not resolved by the cluster DNS to be forwarded to the upstream DNS server that's inherited from the node.

To learn about name resolution in Kubernetes, see the [Kubernetes website](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service). Consider customizing [DNS policy](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy) or [DNS configuration](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-config) as appropriate for your setup.

## External traffic policy
The YAML file provided in the Azure portal sets `externalTrafficPolicy` field on the [Service](https://kubernetes.io/docs/reference/kubernetes-api/service-resources/service-v1/) object to `Local`. This preserves caller IP address (accessible in the [request context](api-management-policy-expressions.md#ContextVariables)) and disables cross node load balancing, eliminating network hops caused by it. Be aware, that this setting might cause asymmetric distribution of traffic in deployments with unequal number of gateway pods per node.

## High availability
The self-hosted gateway is a crucial component in the infrastructure and has to be highly available. However, failure will and can happen.

Consider protecting the self-hosted gateway against [disruption](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/).

> [!TIP]
> When installing with Helm, easily enable high available scheduling by enabling the `highAvailability.enabled` configuration option.
> 
> Learn more on how to [install an API Management self-hosted gateway on Kubernetes with Helm](how-to-deploy-self-hosted-gateway-kubernetes-helm.md).

### Protecting against node failure
To prevent being affected due to data center or node failures, consider using a Kubernetes cluster that uses availability zones to achieve high availability on the node-level.

Availability zones allow you to schedule the self-hosted gateway's pod on nodes spread across the zones by using:
- [Pod Topology Spread Constraints](https://kubernetes.io/docs/concepts/workloads/pods/pod-topology-spread-constraints/) (Recommended - Kubernetes v1.19+)
- [Pod Anti-Affinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/)

> [!Note]
> If you are using Azure Kubernetes Service, learn how to use availability zones in [this article](./../aks/availability-zones.md).

### Protecting against pod disruption

Pods can experience disruption due to [various](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/#voluntary-and-involuntary-disruptions) reasons such as manual pod deletion, node maintenance, etc.

Consider using [Pod Disruption Budgets](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets) to enforce a minimum number of pods to be available at any given time.

## HTTP(S) proxy

The self-hosted gateway provides support for HTTP(S) proxy by using the traditional `HTTP_PROXY`, `HTTPS_PROXY` and `NO_PROXY` environment variables.

Once configured, the self-hosted gateway will automatically use the proxy for all outbound HTTP(S) requests to the backend services.

Starting with version 2.1.5 or above, the self-hosted gateway provides observability related to request proxying:

- [API Inspector](api-management-howto-api-inspector.md) will show additional steps when HTTP(S) proxy is being used and its related interactions.
- Verbose logs are provided to provide indication of the request proxy behavior.

> [!Warning]
> Ensure that the [infrastructure requirements](self-hosted-gateway-overview.md#fqdn-dependencies) have been met and that the self-hosted gateway can still connect to them or certain functionality will not work properly.

## Local logs and metrics
The self-hosted gateway sends telemetry to [Azure Monitor](api-management-howto-use-azure-monitor.md) and [Azure Application Insights](api-management-howto-app-insights.md) according to configuration settings in the associated API Management service.
When [connectivity to Azure](self-hosted-gateway-overview.md#connectivity-to-azure) is temporarily lost, the flow of telemetry to Azure is interrupted and the data is lost for the duration of the outage.

Consider [setting up local monitoring](how-to-configure-local-metrics-logs.md) to ensure the ability to observe API traffic and prevent telemetry loss during Azure connectivity outages.

## Namespace
Kubernetes [namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) help with dividing a single cluster among multiple teams, projects, or applications. Namespaces provide a scope for resources and names. They can be associated with a resource quota and access control policies.

The Azure portal provides commands to create self-hosted gateway resources in the **default** namespace. This namespace is automatically created, exists in every cluster, and can't be deleted.
Consider [creating and deploying](https://www.kubernetesbyexample.com/) a self-hosted gateway into a separate namespace in production.

## Number of replicas
The minimum number of replicas suitable for production is three, preferably combined with [high-available scheduling of the instances](#high-availability).

By default, a self-hosted gateway is deployed with a **RollingUpdate** deployment [strategy](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#strategy). Review the default values and consider explicitly setting the [maxUnavailable](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#max-unavailable) and [maxSurge](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#max-surge) fields, especially when you're using a high replica count.

## Performance

We recommend reducing container logs to warnings (`warn`) to improve for performance. Learn more in our [self-hosted gateway configuration reference](self-hosted-gateway-settings-reference.md).

## Request throttling

Request throttling in a self-hosted gateway can be enabled by using the API Management [rate-limit](rate-limit-policy.md) or [rate-limit-by-key](rate-limit-by-key-policy.md) policy. Configure rate limit counts to synchronize among gateway instances across cluster nodes by exposing the following ports in the Kubernetes deployment for instance discovery:

* Port 4290 (UDP), for the rate limiting synchronization
* Port 4291 (UDP), for sending heartbeats to other instances

> [!NOTE]
> [!INCLUDE [api-management-self-hosted-gateway-rate-limit](../../includes/api-management-self-hosted-gateway-rate-limit.md)]

## Security
The self-hosted gateway is able to run as non-root in Kubernetes allowing customers to run the gateway securely.

Here's an example of the security context for the self-hosted gateway container:
```yml
securityContext:
  allowPrivilegeEscalation: false
  runAsNonRoot: true
  runAsUser: 1001       # This is a built-in user, but you can use any user ie 1000 as well
  runAsGroup: 2000      # This is just an example
  privileged: false
  capabilities:
    drop:
    - all
```

> [!WARNING]
> Running the self-hosted gateway with read-only filesystem (`readOnlyRootFilesystem: true`) is not supported.

> [!WARNING]
> When using local CA certificates, the self-hosted gateway must run with user ID (UID) `1001` in order to manage the CA certificates otherwise the gateway will not start up.


## Next steps

* To learn more about the self-hosted gateway, see [Self-hosted gateway overview](self-hosted-gateway-overview.md).
* Learn [how to deploy API Management self-hosted gateway to Azure Arc-enabled Kubernetes clusters](how-to-deploy-self-hosted-gateway-azure-arc.md).
