---
title: Self-hosted gateway on Kubernetes in production | Azure API Management
description: Learn about guidance to run an API Management self-hosted gateway on Kubernetes for production workloads
author: tomkerkhove
manager: mrcarlosdev
ms.service: api-management
ms.workload: mobile
ms.topic: article
ms.author: tomkerkhove
ms.date: 12/17/2021
---

# Guidance for running self-hosted gateway on Kubernetes in production

In order to run the self-hosted gateway in production, there are various aspects to take in to mind. For example, it should be deployed in a highly-available manner, use configuration backups to handle temporary disconnects and many more.

This article provides guidance on how to run [self-hosted gateway](./self-hosted-gateway-overview.md) on Kubernetes for production workloads to ensure that it will run smoothly and reliably.

## Access token
Without a valid access token, a self-hosted gateway can't access and download configuration data from the endpoint of the associated API Management service. The access token can be valid for a maximum of 30 days. It must be regenerated, and the cluster configured with a fresh token, either manually or via automation before it expires.

When you're automating token refresh, use [this management API operation](/rest/api/apimanagement/current-ga/gateway/generate-token) to generate a new token. For information on managing Kubernetes secrets, see the [Kubernetes website](https://kubernetes.io/docs/concepts/configuration/secret).

## Namespace
Kubernetes [namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) help with dividing a single cluster among multiple teams, projects, or applications. Namespaces provide a scope for resources and names. They can be associated with a resource quota and access control policies.

The Azure portal provides commands to create self-hosted gateway resources in the **default** namespace. This namespace is automatically created, exists in every cluster, and can't be deleted.
Consider [creating and deploying](https://www.kubernetesbyexample.com/) a self-hosted gateway into a separate namespace in production.

## Number of replicas
The minimum number of replicas suitable for production is two.

By default, a self-hosted gateway is deployed with a **RollingUpdate** deployment [strategy](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#strategy). Review the default values and consider explicitly setting the [maxUnavailable](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#max-unavailable) and [maxSurge](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#max-surge) fields, especially when you're using a high replica count.

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

## Container image tag

We provide a variety of container images for self-hosted gateways to meet your needs:
- `2.0.0` - The most specific tag for a container image.
  - *Use this image if you always want to run the same container image.*
- `v2` - The latest stable version of the v2 container image. (Moving tag) 
  - *Use this image if you always want to run our v2 container image with every new feature and patch.*
- `v2-preview` - The latest preview version of the container image. (Moving tag)
  - *Use this image if you always want to run our latest preview container image, but not recommended for production.*
- `latest` - The latest stable version of the container image. (Moving tag)
  - *Use this image to evaluate the self-hosted gateway, but not recommended for production.*

You can find a full list of available tags [here](https://mcr.microsoft.com/v2/azure-api-management/gateway/tags/list).

### Use of tags in our official deployment options

Our deployment options in the Azure portal use the `v2` tag which allows customers to use the most recent version of the self-hosted gateway v2 container image with all feature updates and patches.

> [!NOTE]
> We provide the command and YAML snippets as reference, feel free to use a more specific tag if you wish to.

When installing with our Helm chart, image tagging is optimized for you. The Helm chart's application version pins the gateway to a given version and does not rely on `latest`.

Learn more on how to [install an API Management self-hosted gateway on Kubernetes with Helm](how-to-deploy-self-hosted-gateway-kubernetes-helm.md).

### Risk of using moving tags

Moving tags are tags that are potentially updated when a new version of the container image is released. This allows container users to receive updates to the container image without having to update their deployments.

This means that you can potentially run different versions in parallel without noticing it, for example when you perform scaling actions once `v2` tag was updated.

Example - `v2` tag was released with `2.0.0` container image, but when `2.1.0` will be released, the `v2` tag will be linked to the `2.1.0` image.

> [!IMPORTANT]
> Consider using a specific version tag in production to avoid unintentional upgrade to a newer version.

## DNS policy
DNS name resolution plays a critical role in a self-hosted gateway's ability to connect to dependencies in Azure and dispatch API calls to backend services.

The YAML file provided in the Azure portal applies the default [ClusterFirst](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy) policy. This policy causes name resolution requests not resolved by the cluster DNS to be forwarded to the upstream DNS server that's inherited from the node.

To learn about name resolution in Kubernetes, see the [Kubernetes website](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service). Consider customizing [DNS policy](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy) or [DNS configuration](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-config) as appropriate for your setup.

## External traffic policy
The YAML file provided in the Azure portal sets `externalTrafficPolicy` field on the [Service](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#service-v1-core) object to `Local`. This preserves caller IP address (accessible in the [request context](api-management-policy-expressions.md#ContextVariables)) and disables cross node load balancing, eliminating network hops caused by it. Be aware, that this setting might cause asymmetric distribution of traffic in deployments with unequal number of gateway pods per node.

## Custom domain names and SSL certificates

If you use custom domain names for the API Management endpoints, especially if you use a custom domain name for the Management endpoint, you might need to update the value of `config.service.endpoint` in the **\<gateway-name\>.yaml** file to replace the default domain name with the custom domain name. Make sure that the Management endpoint can be accessed from the pod of the self-hosted gateway in the Kubernetes cluster.

In this scenario, if the SSL certificate that's used by the Management endpoint isn't signed by a well-known CA certificate, you must make sure that the CA certificate is trusted by the pod of the self-hosted gateway.

## Configuration backup

Configure a local storage volume for the self-hosted gateway container, so it can persist a backup copy of the latest downloaded configuration. If connectivity is down, the storage volume can use the backup copy upon restart. The volume mount path must be <code>/apim/config</code>. See an example on [GitHub](https://github.com/Azure/api-management-self-hosted-gateway/blob/master/examples/self-hosted-gateway-with-configuration-backup.yaml).
To learn about storage in Kubernetes, see the [Kubernetes website](https://kubernetes.io/docs/concepts/storage/volumes/).

> [!NOTE]
> To learn about self-hosted gateway behavior in the presence of a temporary Azure connectivity outage, see [Self-hosted gateway overview](self-hosted-gateway-overview.md#connectivity-to-azure).

## Local logs and metrics
The self-hosted gateway sends telemetry to [Azure Monitor](api-management-howto-use-azure-monitor.md) and [Azure Application Insights](api-management-howto-app-insights.md) according to configuration settings in the associated API Management service.
When [connectivity to Azure](self-hosted-gateway-overview.md#connectivity-to-azure) is temporarily lost, the flow of telemetry to Azure is interrupted and the data is lost for the duration of the outage.
Consider [setting up local monitoring](how-to-configure-local-metrics-logs.md) to ensure the ability to observe API traffic and prevent telemetry loss during Azure connectivity outages.

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

## Next steps

* To learn more about the self-hosted gateway, see [Self-hosted gateway overview](self-hosted-gateway-overview.md).
* Learn [how to deploy API Management self-hosted gateway to Azure Arc-enabled Kubernetes clusters](how-to-deploy-self-hosted-gateway-azure-arc.md).
