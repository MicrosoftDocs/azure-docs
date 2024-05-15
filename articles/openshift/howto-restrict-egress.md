---
title: Restrict egress traffic in an Azure Red Hat OpenShift (ARO) cluster
description: Learn what ports and addresses are required to control egress traffic in Azure Red Hat OpenShift (ARO)
author: joharder
ms.author: joharder
ms.service: azure-redhat-openshift
ms.custom:
ms.topic: article
ms.date: 10/10/2023
---
# Control egress traffic for your Azure Red Hat OpenShift (ARO) cluster

This article provides the necessary details that allow you to secure outbound traffic from your Azure Red Hat OpenShift cluster (ARO). With the release of the [Egress Lockdown Feature](./concepts-egress-lockdown.md), all of the required connections for an ARO cluster are proxied through the service. There are additional destinations that you may want to allow to use features such as Operator Hub or Red Hat telemetry. 

> [!IMPORTANT]
> Do not attempt these instructions on older ARO clusters if those clusters don't have the Egress Lockdown feature enabled. To enable the Egress Lockdown feature on older ARO clusters, see [Enable Egress Lockdown](./concepts-egress-lockdown.md#enable-egress-lockdown).

## Endpoints proxied through the ARO service

The following endpoints are proxied through the service, and do not need additional firewall rules. This list is here for informational purposes only.

| Destination FQDN | Port | Use |
| ----------- | ----------- | ------------- |
| **`arosvc.azurecr.io`** | **HTTPS:443** | Global container registry for ARO required system images. |
| **`arosvc.$REGION.data.azurecr.io`** | **HTTPS:443** | Regional container registry for ARO required system images. |
| **`management.azure.com`** | **HTTPS:443** | Used by the cluster to access Azure APIs. |
| **`login.microsoftonline.com`** | **HTTPS:443** | Used by the cluster for authentication to Azure. |
| **Specific subdomains of `monitor.core.windows.net`** | **HTTPS:443** | Used for Microsoft Geneva Monitoring so that the ARO team can monitor the customer's cluster(s). |
| **Specific subdomains of `monitoring.core.windows.net`** | **HTTPS:443** | Used for Microsoft Geneva Monitoring so that the ARO team can monitor the customer's cluster(s). |
| **Specific subdomains of `blob.core.windows.net`** | **HTTPS:443** | Used for Microsoft Geneva Monitoring so that the ARO team can monitor the customer's cluster(s). |
| **Specific subdomains of `servicebus.windows.net`** | **HTTPS:443** | Used for Microsoft Geneva Monitoring so that the ARO team can monitor the customer's cluster(s). |
| **Specific subdomains of `table.core.windows.net`** | **HTTPS:443** | Used for Microsoft Geneva Monitoring so that the ARO team can monitor the customer's cluster(s). |

---

## List of optional endpoints

### Additional container registry endpoints

| Destination FQDN | Port | Use |
| ----------- | ----------- | ------------- |
| **`registry.redhat.io`** | **HTTPS:443** | Used to provide container images and operators from Red Hat. |
| **`quay.io`** | **HTTPS:443** | Used to provide container images and operators from Red Hat and third-parties. |
| **`cdn.quay.io`** | **HTTPS:443** | Used to provide container images and operators from Red Hat and third-parties. |
| **`cdn01.quay.io`** | **HTTPS:443** | Used to provide container images and operators from Red Hat and third-parties. |
| **`cdn02.quay.io`** | **HTTPS:443** | Used to provide container images and operators from Red Hat and third-parties. |
| **`cdn03.quay.io`** | **HTTPS:443** | Used to provide container images and operators from Red Hat and third-parties. |
| **`access.redhat.com`** | **HTTPS:443** | Used to provide container images and operators from Red Hat and third-parties. |
| **`registry.access.redhat.com`** | **HTTPS:443** | Used to provide third-party container images and certified operators. |
| **`registry.connect.redhat.com`** | **HTTPS:443** | Used to provide third-party container images and certified operators. |

### Red Hat Telemetry and Red Hat Insights

By default, ARO clusters are opted-out of Red Hat Telemetry  and Red Hat Insights. If you wish to opt-in to Red Hat telemetry, allow the following endpoints and [update your cluster's pull secret](./howto-add-update-pull-secret.md).

| Destination FQDN | Port | Use |
| ----------- | ----------- | ------------- |
| **`cert-api.access.redhat.com`** | **HTTPS:443** | Used for Red Hat telemetry. |
| **`api.access.redhat.com`** | **HTTPS:443** | Used for Red Hat telemetry. |
| **`infogw.api.openshift.com`** | **HTTPS:443** | Used for Red Hat telemetry. |
| **`console.redhat.com/api/ingress`** | **HTTPS:443** | Used in the cluster for the insights operator that integrates with Red Hat Insights. |

For additional information on remote health monitoring and telemetry, see the [Red Hat OpenShift Container Platform documentation](https://docs.openshift.com/container-platform/latest/support/remote_health_monitoring/about-remote-health-monitoring.html).

### Other additional OpenShift endpoints

| Destination FQDN | Port | Use |
| ----------- | ----------- | ------------- |
| **`api.openshift.com`** | **HTTPS:443** | Used by the cluster to check if updates are available for the cluster. Alternatively, users can use the [OpenShift Upgrade Graph tool](https://access.redhat.com/labs/ocpupgradegraph/) to manually find an upgrade path. |
| **`mirror.openshift.com`** | **HTTPS:443** | Required to access mirrored installation content and images. |
| **`*.apps.<cluster_domain>*`** | **HTTPS:443** | When allowlisting domains, this is used in your corporate network to reach applications deployed in ARO, or to access the OpenShift console. |

---

## ARO integrations

### Azure Monitor container insights

ARO clusters can be monitored using the Azure Monitor container insights extension. Review the pre-requisites and instructions for [enabling the extension](../azure-monitor/containers/container-insights-enable-arc-enabled-clusters.md).
