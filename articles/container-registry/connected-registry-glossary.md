---
title: "Glossary for Connected registry with Azure Arc"
description: "Learn the terms and definitions for the Connected registry extension with Azure Arc to secure the extension deployment."
author: tejaswikolli-web
ms.author: tejaswikolli
ms.service: container-registry
ms.topic: glossary #Don't change
ms.date: 06/18/2024
#customer intent: As a customer, I want to understand the terms and definitions for the Connected registry extension with Azure Arc to secure the extension deployment.

---

# Glossary for Connected registry with Azure Arc

This glossary provides terms and definitions for the Connected registry extension with Azure Arc to secure the extension deployment.

## Glossary of terms

### Auto-upgrade-version

- **Definition:** Automatic extension upgrade is available for Azure Arc-enabled clusters.
- **Accepted Values:** `true`, `false`
- **Default Value:** `false`
- **Note:** [Azure Connected Machine agent](/azure/azure-arc/servers/agent-overview) manages the upgrade process and automatic rollback.

### Bring Your Own Certificate (BYOC)

- **Definition:** Allows customers to use their own certificate management service.
- **Accepted Values:** Kubernetes Secret or Public Certificate + Private Key pair
- **Note:** Customer must specify.

### cert-manager.enabled

- **Definition:** Enables cert-manager service for use with the connected registry, handling the TLS certificate management lifecycle.
- **Accepted Values:** `true`, `false`
- **Note:** Customers can either use the provided cert-manager at deployment or use theirs (must already be installed).

### cert-manager.install

- **Definition:** Installs the cert-manager tool as part of the extension deployment.
- **Accepted Values:** `true`, `false`
- **Note:** Must be set to `false` if a customer is using their own cert-manager service.

### Child Registry

- **Description:** A registry that synchronizes with its parent (top-level) registry. The modes of the parent and child registries must match to ensure compatibility.

### Client Token

- **Definition:** Manages client access to a connected registry, allowing for actions on one or more repositories.
- **Accepted Values:** Token name
- **Note:** After creating a token, configure the connected registry to accept it using the `az acr connected-registry update` command.

### Cloud Registry

- **Description:** The ACR private cloud-hosted registry to which the connected registry syncs artifacts.

### Cluster-name

- **Definition:** The name of the Arc cluster for which the extension is deployed.
- **Accepted Values:** Alphanumerical value

### Cluster-type

- **Definition:** Specifies the type of Arc cluster for the extension deployment.
- **Accepted Values:** `connectedCluster`
- **Default Value:** `connectedCluster`

### Single configuration value (--config)

- **Definition:** The configuration parameters and values for deploying the connected registry extension on the Kubernetes cluster.
- **Accepted Values:** Alphanumerical value

### Connection String

- **Value Type:** Alphanumerical
- **Customer Action:** Must generate and specify
- **Description:** The connection string contains authorization details necessary for the connected registry to securely connect and sync data with the cloud registry using Shared Key authorization. It includes the connected registry name, sync token name, sync token password, parent gateway endpoint, and parent endpoint protocol.

### Connected Registry

- **Description:** The on-premises or remote registry replica that facilitates local access to containerized workloads.

### Data-endpoint-enabled

- **Definition:** Enables a [dedicated data endpoint](/azure/container-registry/container-registry-dedicated-data-endpoints) for client firewall configuration.
- **Accepted Values:** `true`, `false`
- **Default Value:** `false`

### Extension-type

- **Definition:** Specifies the extension provider unique name for the extension deployment.
- **Accepted Values:** `Microsoft.ContainerRegistry.ConnectedRegistry`
- **Default Value:** `Microsoft.ContainerRegistry.ConnectedRegistry`

### Kubernetes Secret

- **Definition:** A Kubernetes managed secret for securely accessing data across pods within a cluster.
- **Accepted Values:** Secret name
- **Note:** Customer must specify.

### Message TTL (Time To Live)

- **Value Type:** Numerical
- **Default Value/Behavior:** Every two days
- **Description:** Message TTL defines the duration sync messages are retained in the cloud. This value isn't applicable when the sync schedule is continuous.

### Modes

- **Accepted Values:** `ReadOnly`, `ReadWrite`
- **Default Value/Behavior:** `ReadOnly`
- **Description:** Defines the operational permissions for client access to the connected registry. In `ReadOnly` mode, clients can only pull (read) artifacts, which is suitable for nested scenarios. In `ReadWrite` mode, clients can pull (read) and push (write) artifacts, which is ideal for local development environments.

### Parent Registry

- **Description:** The primary registry that synchronizes with its child connected registries. A single parent registry can have multiple child registries connected to it. In nested scenarios, there can be multiple layers of registries within the hierarchy.

### Protected Settings File (--config-protected-file)

- **Definition:** The connection string for deploying the connected registry extension on the Kubernetes cluster. This file also includes the Kubernetes Secret or Public Cert + Private Key values pair for BYOC scenarios.
- **Accepted Values:** Alphanumerical value
- **Note:** Customer must specify.

### Public Certificate + Private Key

- **Value Type:** Alphanumerical base64-encoded
- **Customer Action:** Must specify
- **Description:** The public key certificate comprises a pair of keys: a public key available to anyone for identity verification of the certificate holder, and a private key, a unique secret key.

### pvc.storageClassName

- **Definition:** Specifies the storage class in use on the cluster.
- **Accepted Values:** `standard`, `azurefile`

### pvc.storageRequest

- **Definition:** Specifies the storage size that the connected registry claims in the cluster.
- **Accepted Values:** Alphanumerical value (for example, “500Gi”)
- **Default Value:** `500Gi`

### service.ClusterIP

- **Definition:** The IP address within the Kubernetes service cluster IP range.
- **Accepted Values:** IPv4 or IPv6 format
- **Note:** Customer must specify.

### Sync Token

- **Definition:** A token used by each connected registry to authenticate with its immediate parent for content synchronization and updates.
- **Accepted Values:** Token name
- **Action:** Customer action required.

### Synchronization Schedule

- **Value Type:** Numerical
- **Default Value/Behavior:** Every minute
- **Description:** The synchronization schedule, set using a cron expression, determines when the registry syncs with its parent.

### Synchronization Window

- **Value Type:** Alphanumerical
- **Default Value/Behavior:** Hourly
- **Description:** The synchronization window specifies the sync duration. This parameter is disregarded if the sync schedule is continuous.

### trustDistribution.enabled

- **Definition:** Configures nodes labeled with "containerd-configured-by: connected-registry" to decide which nodes to configure the trust distribution daemon set within the cluster at extension deployment.
- **Accepted Values:** `true`, `false`
- **Note:** Customer must choose `true` or `false`.

### trustDistribution.skipNodeSelector

- **Definition:** Controls whether to trust all the nodes in the cluster or only select nodes that are labeled.
- **Accepted Values:** `true`, `false`
- **Label:** `containerd-configured-by=connected-registry`
- **Command:** `kubectl label node/[node name] containerd-configured-by=connected-registry`

### httpEnabled

- **Definition:** Enables TLS encryption for secure communication between the connected registry and the client nodes within the cluster.
- **Accepted Values:** `true`, `false`
- **Default Value:** `true`

### Registry Hierarchy

- **Description:** The structure of connected registries, where each connected registry is linked to a parent registry. The top parent in this hierarchy is the cloud registry.