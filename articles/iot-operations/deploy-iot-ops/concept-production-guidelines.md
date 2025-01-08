---
title: Production deployment guidelines
description: Learn about the recommendations and guidelines for preparing Azure IoT Operations for a production deployment.
author: kgremban
ms.author: kgremban
ms.topic: concept-article
ms.date: 10/25/2024
ms.service: azure-iot-operations

#CustomerIntent: I want to understand system, configuration, and security best practices before deploying to production.
---

# Production deployment guidelines

Security and scalability are a priority for deploying Azure IoT Operations. This article outlines guidelines that you should take into consideration when setting up Azure IoT Operations for production.

Decide whether you're deploying Azure IoT Operations to a single-node or multi-node cluster before considering the appropriate configuration. Many of the guidelines in this article apply regardless of the cluster type, but when there is a difference it's called out specifically.

## Platform

Currently, K3s on Ubuntu 24.04 is the only generally available platform for deploying Azure IoT Operations in production.

## Cluster setup

Ensure that your hardware setup is sufficient for your scenario and that you begin with a secure environment.

### System configuration

Create an Arc-enabled K3s cluster that meets the system requirements.

* Use a [supported environment for Azure IoT Operations](../overview-iot-operations.md#supported-environments).
* [Configure the cluster](./howto-prepare-cluster.md) according to documentation.
* If you expect intermittent connectivity for your cluster, ensure that you've allocated enough disk space to the cluster cache data and messages while the [cluster is offline](../overview-iot-operations.md#offline-support).
* If possible, have a second cluster as a staging area for testing new changes before deploying to the primary production cluster.
* [Turn off auto-upgrade for Azure Arc](/azure/azure-arc/kubernetes/agent-upgrade#toggle-automatic-upgrade-on-or-off-when-connecting-a-cluster-to-azure-arc) to have complete control over when new updates are applied to your cluster. Instead, [manually upgrade agents](/azure/azure-arc/kubernetes/agent-upgrade#manually-upgrade-agents) as needed.
* *For multi-node clusters*: [Configure clusters with Edge Volumes](./howto-prepare-cluster.md#configure-multi-node-clusters-for-azure-container-storage) to prepare for enabling fault tolerance during deployment.

### Security

Consider the following measures to ensure your cluster setup is secure before deployment.

* [Validate images](../secure-iot-ops/howto-validate-images.md) to ensure they're signed by Microsoft.
* When doing TLS encryption, [bring your own issuer](../secure-iot-ops/concept-default-root-ca.md#bring-your-own-issuer) and integrate with an enterprise PKI.
* [Use secrets](../secure-iot-ops/howto-manage-secrets.md) for on-premises authentication.
* Use [user-assigned managed identities](./howto-enable-secure-settings.md#set-up-a-user-assigned-managed-identity-for-cloud-connections) for cloud connections.
* Keep your cluster and Azure IoT Operations deployment up to date with the latest patches and minor releases to get all available security and bug fixes.

### Networking

If you use enterprise firewalls or proxies, add the [Azure IoT Operations endpoints](./overview-deploy.md#azure-iot-operations-endpoints) to your allowlist.

### Observability

For production deployments, [deploy observability resources](../configure-observability-monitoring/howto-configure-observability.md) on your cluster before deploying Azure IoT Operations. We also recommend setting up [Prometheus alerts in Azure Monitor](/azure/azure-monitor/alerts/prometheus-alerts).

## Deployment

For a production-ready deployment, include the following configurations during the Azure IoT Operations deployment.

### MQTT broker

In the Azure portal deployment wizard, the broker resource is set up in the **Configuration** tab.

* [Configure cardinality settings](../manage-mqtt-broker/howto-configure-availability-scale.md#configure-cardinality-directly) based on memory profile and needs for handling connections and messages. For example, the following settings could support a single-node or multi-node cluster:

  | Setting | Single node | Multi node |
  | ------- | ----------- | ---------- |
  | **frontendReplicas** | 1 | 5 |
  | **frontendWorkers** | 4 | 8 |
  | **backendRedundancyFactor** | 2 | 2 |
  | **backendWorkers** | 1 | 4 |
  | **backendPartitions** | 1 | 5 |
  | [Memory profile](../manage-mqtt-broker/howto-configure-availability-scale.md#configure-memory-profile) | Low | High |

* [Encrypt internal traffic](../manage-mqtt-broker/howto-encrypt-internal-traffic.md).

* Set [disk-backed message buffer](../manage-mqtt-broker/howto-disk-backed-message-buffer.md) with a max size that prevents RAM overflow.

### Schema registry and storage

In the Azure portal deployment wizard, the schema registry and its required storage account are set up in the **Dependency management** tab.

* The storage account is only supported with public network access enabled.
* The storage account must have hierarchical namespace enabled.
* The schema registry's managed identity must have contributor permissions for the storage account.

### Fault tolerance

*Multi-node clusters*: Fault tolerance can be enabled in the **Dependency management** tab of the Azure portal deployment wizard. It's only supported on multi-node clusters, and is recommended for production deployment.

### Secure settings

During deployment, you have the option to use test settings or secure settings. For production deployments, choose secure settings. If you're upgrading an existing test settings deployment for production, follow the steps in [Enable secure settings](./howto-enable-secure-settings.md).

## Post-deployment

After deploying Azure IoT Operations, have the following configurations in place for a production scenario.

### MQTT broker

After deployment, you can [edit BrokerListener resources](../manage-mqtt-broker/howto-configure-brokerlistener.md):

* [Configure TLS with automatic certificate management](../manage-mqtt-broker/howto-configure-brokerlistener.md#configure-tls-with-automatic-certificate-management) for listeners.

You can also [edit BrokerAuthentication resources](../manage-mqtt-broker/howto-configure-authentication.md).

* Use [X.509 certificates or Kubernetes service account tokens for authentication](../manage-mqtt-broker/howto-configure-authentication.md#configure-authentication-method). 
* Don't use no-auth.

When you create a new resource, manage its authorization:

* [Create a BrokerAuthorization resource](../manage-mqtt-broker/howto-configure-authorization.md) and provide the least privilege needed for the topic asset.

### OPC UA broker

For connecting to assets at production, [configure OPC UA authentication](../discover-manage-assets/overview-opcua-broker-certificates-management.md):

* Don't use no-auth. Connectivity to OPC UA servers isn't supported without authentication.
* Set up a secure connection to OPC UA server. Use a production PKI and [configure application certificates](../discover-manage-assets/howto-configure-opcua-certificates-infrastructure.md#configure-a-self-signed-application-instance-certificate) and [trust list](../discover-manage-assets/howto-configure-opcua-certificates-infrastructure.md#configure-the-trusted-certificates-list).

### Dataflows

When using dataflows in production:

* [Use service account token (SAT) authentication](../connect-to-cloud/howto-configure-mqtt-endpoint.md#kubernetes-service-account-token-sat) with the MQTT broker (default).
* Always used managed identity authentication. When possible, [use user-assigned managed identity](../connect-to-cloud/howto-configure-mqtt-endpoint.md#user-assigned-managed-identity) in dataflow endpoints for flexibility and auditability.
* [Scale dataflow profiles](../connect-to-cloud/howto-configure-dataflow-profile.md#scaling) to improve throughput and have high availability.
* Group multiple dataflows into dataflow profiles and customize scaling for each profile accordingly. 


