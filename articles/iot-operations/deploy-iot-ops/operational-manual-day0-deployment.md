---
title: "Azure IoT Operations Day 0 Operational Manual: Deployment"
description: Step-by-step guide for deploying Azure IoT Operations to a production Kubernetes cluster, covering planning, prerequisites, cluster preparation, and post-deployment validation.
author: huguesbouvier
ms.author: hubouvie
ms.topic: how-to
ms.date: 03/25/2026

---

# Azure IoT Operations—Day 0 Operational Manual: Deployment

This operational manual provides a comprehensive, step-by-step guide for deploying [Azure IoT Operations](../overview-iot-operations.md) to a production Kubernetes cluster. It covers everything from initial planning and prerequisites through cluster preparation, deployment, configuration of assets and data flows, and post-deployment validation.

> **Audience**: IT administrators, platform engineers, and OT professionals responsible for deploying Azure IoT Operations.

---

## Table of Contents

1. [Deployment Planning](#1-deployment-planning)
2. [Prerequisites and Azure Resource Setup](#2-prerequisites-and-azure-resource-setup)
3. [Cluster Preparation](#3-cluster-preparation)
4. [Security Preparation](#4-security-preparation)
5. [Deploy Azure IoT Operations](#5-deploy-azure-iot-operations)
6. [Post-Deployment Validation](#6-post-deployment-validation)
7. [Observability Setup](#7-observability-setup)
8. [Configure MQTT Broker for Production](#8-configure-mqtt-broker-for-production)
9. [Configure Assets and Devices](#9-configure-assets-and-devices)
10. [Configure Data Flows to Cloud](#10-configure-data-flows-to-cloud)
11. [End-to-End Validation](#11-end-to-end-validation)
12. [Production Deployment Checklist](#12-production-deployment-checklist)

---

## 1. Deployment Planning

### 1.1 Understand the Architecture

Azure IoT Operations is a set of modular, Kubernetes-native services deployed to an Azure Arc-enabled cluster. Key components include:

| Component | Purpose |
|---|---|
| **[MQTT Broker](../manage-mqtt-broker/overview-broker.md)** | High-performance MQTT v3.1.1/v5 broker for edge messaging |
| **[Connector for OPC UA](../discover-manage-assets/overview-opc-ua-connector.md)** | Collects data from OPC UA servers and publishes to MQTT |
| **[Data Flows](../connect-to-cloud/overview-dataflow.md)** | Routes, transforms, and pushes data to cloud endpoints |
| **Azure Device Registry** | Cloud-based registry for devices, assets, and schemas |
| **[Akri Services](../discover-manage-assets/overview-akri.md)** | Device discovery and protocol adapters |
| **[State Store](../develop-edge-apps/overview-state-store.md)** | Key-value persistence layer in the MQTT broker |

An Azure IoT Operations *deployment* includes the instance, Arc extensions, custom locations, and all configurable resources (assets, devices, data flows). The *instance* is the parent resource that bundles the services.

### 1.2 Choose Your Cluster Topology

| Topology | Use Case | Min Hardware |
|---|---|---|
| **Single-node** | Smaller deployments where high availability isn't required | 4 vCPU, 16-GB RAM, 30-GB storage |
| **Multi-node (3-5 nodes)** | High availability and higher throughput requirements | 8 vCPU, 32-GB RAM per node |

**MQTT broker cardinality guidance for optimal performance:**

The [MQTT broker cardinality settings](../manage-mqtt-broker/howto-configure-availability-scale.md) should be tuned based on your cluster hardware. The following recommendations help you get the best performance from your deployment.

#### Single-node recommendations

- **Frontend replicas**: Set to at least **1**.
- **Frontend workers**: Set equal to the **number of CPU cores** on the node.
- **Backend replicas (redundancy factor)**: Set to at least **2** so the broker can perform rolling updates.

*Example—single node with four CPU cores:*

<table>
    <thead>
        <tr>
            <th colspan="2">Frontend</th>
            <th colspan="2">Backend</th>
        </tr>
        <tr>
            <th>Setting</th><th>Value</th>
            <th>Setting</th><th>Value</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Replicas</td><td>1</td>
            <td>Redundancy Factor</td><td>2</td>
        </tr>
        <tr>
            <td>Workers</td><td>4</td>
            <td>Workers</td><td>1</td>
        </tr>
        <tr>
            <td></td><td></td>
            <td>Partitions</td><td>1</td>
        </tr>
    </tbody>
</table>

#### Multi-node recommendations

> [!NOTE]
> The following values are recommendations for optimal performance. Minor deviations shouldn't cause issues, but may result in slightly reduced performance. For large clusters with low traffic, these values can be set lower than the recommendations without causing issues. More considerations such as memory (RAM) and performance characteristics are discussed in the following sections.

- **Frontend replicas**: Set to **1 per node** to distribute load evenly across the cluster.
- **Frontend workers**: Set equal to the **number of CPU cores** per node.
- **Backend replicas (redundancy factor)**: Set to **2** for redundancy and rolling update support.
- **Backend partitions**: Set equal to the **number of nodes** in the cluster.
- **Backend workers**: Set to **half the number of CPU cores** per node.

*Example—3-node cluster, eight CPU cores per node:*

<table>
    <thead>
        <tr>
            <th colspan="2">Frontend</th>
            <th colspan="2">Backend</th>
        </tr>
        <tr>
            <th>Setting</th><th>Value</th>
            <th>Setting</th><th>Value</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Replicas</td><td>3</td>
            <td>Redundancy Factor</td><td>2</td>
        </tr>
        <tr>
            <td>Workers</td><td>4</td>
            <td>Workers</td><td>4</td>
        </tr>
        <tr>
            <td></td><td></td>
            <td>Partitions</td><td>3</td>
        </tr>
    </tbody>
</table>

*Example—5-node cluster, 16 CPU cores per node:*

<table>
    <thead>
        <tr>
            <th colspan="2">Frontend</th>
            <th colspan="2">Backend</th>
        </tr>
        <tr>
            <th>Setting</th><th>Value</th>
            <th>Setting</th><th>Value</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Replicas</td><td>5</td>
            <td>Redundancy Factor</td><td>2</td>
        </tr>
        <tr>
            <td>Workers</td><td>8</td>
            <td>Workers</td><td>8</td>
        </tr>
        <tr>
            <td></td><td></td>
            <td>Partitions</td><td>5</td>
        </tr>
    </tbody>
</table>

#### Memory profile and message size limits

The memory profile controls the maximum MQTT message size the broker accepts. The following per-pod memory figures are **idle baselines measured with near-zero traffic**—actual consumption grows with message throughput and connected clients:

| Memory Profile | Max Message Size | Idle Frontend Memory (per pod) | Idle Backend Memory (per pod) | Use Case |
|---|---|---|---|---|
| **Tiny** | 4 MB | ~29 MiB | ~41 MiB | Low traffic, small packets only |
| **Low** | 16 MB | ~33 MiB | ~66 MiB | Limited memory, small packets |
| **Medium** | 64 MB | ~169 MiB | ~211 MiB | Moderate traffic and message sizes |
| **High** | 256 MB | ~4.9 GiB | ~5.8 GiB | High throughput, large messages |

> **Warning**: The broker rejects messages when memory usage reaches 75% capacity. Choose a profile with sufficient headroom for your expected message sizes and throughput.

Total broker memory depends on **both** the memory profile and the cardinality (number of frontend replicas, backend partitions, and redundancy factor). More pods mean more total memory. For measured baseline resource consumption across different configurations, see [Baseline resource profiles](./concept-resource-profiles.md).

#### Performance and throughput planning

The MQTT broker can scale horizontally by increasing the number of backend workers and backend partitions. Because the broker distributes topics across backend partitions using hashing, the effectiveness of scaling depends on how evenly the topic space is spread across those partitions. A highly skewed distribution can create hotspots, which may become performance bottlenecks. Similarly, the performance of an individual partition depends heavily on the CPU characteristics of the node it's running on.

As a rule of thumb for capacity planning, an approximate throughput per partition is on the order of **5–6K messages per second** for QoS 1 with 8-KB payloads on 2-GHz base frequency CPU (~4-GHz turbo). Real-world performance depends on many factors. For detailed benchmark data, see [MQTT Broker performance benchmarking](https://techcommunity.microsoft.com/blog/iotblog/azure-iot-operations-mqtt-broker-performance-benchmarking-on-throughput-and-late/4405528).

For more information, see [Performance](../manage-mqtt-broker/howto-configure-availability-scale.md#performance).

### 1.3 Choose Your Platform

| Platform | OS | Production Status |
|---|---|---|
| **K3s** | Ubuntu 24.04 / Red Hat Enterprise Linux (RHEL) 9.x (x86_64) | ✅ GA (recommended for production) |
| **Tanzu Kubernetes (TKr)** | x86_64 | ✅ GA |
| **AKS Edge Essentials** | Windows (x86_64) | ⚠️ Public preview |
| **AKS on Azure Local** | Windows (x86_64) | ⚠️ Public preview |

> **Recommendation**: For multi-node production deployments, use K3s on Ubuntu/RHEL or Tanzu Kubernetes (both GA).

### 1.4 Supported Azure Regions

Azure IoT Operations is available in: East US, East US 2, West US, West US 2, West US 3, West Europe, North Europe, Germany West Central.

### 1.5 Plan Your Azure Resources

You need the following Azure resources:

| Resource | Purpose |
|---|---|
| **Resource Group** | Container for all Azure IoT Operations resources |
| **Azure Key Vault** | Secrets management (must use Azure role-based access control (RBAC) permission model) |
| **Azure Storage Account** | Schema registry backend (hierarchical namespace required) |
| **[Schema Registry](../connect-to-cloud/concept-schema-registry.md)** | Data validation and serialization |
| **Device Registry Namespace** | Organizes assets and devices |
| **User-Assigned Managed Identities (×2)** | One for secrets, one for Azure IoT Operations components |
| **Azure Monitor Workspace** | Metrics collection (recommended) |
| **Azure Managed Grafana** | Dashboard visualization (recommended) |
| **Log Analytics Workspace** | Container logs (recommended) |

---

## 2. Prerequisites and Azure Resource Setup

### 2.1 Azure Subscription and Permissions

Required permissions:

- **Contributor** role on the resource group
- **Microsoft.Authorization/roleAssignments/write** permission (for role assignments)
- **Key Vault Secrets Officer** on the Azure Key Vault
- **Storage Blob Data Contributor** on the storage account (autoassigned during schema registry creation)

### 2.2 Install Azure CLI and Extensions

```bash
# Install or upgrade Azure CLI (version 2.53.0 or higher required)
az upgrade

# Install the Azure IoT Operations extension
az extension add --upgrade --name azure-iot-ops

# Install the connectedk8s extension
az extension add --upgrade --name connectedk8s

# Verify versions
az --version
```

### 2.3 Install Cluster Tools

```bash
# Install kubectl
# See: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/
kubectl version --client

# Install Helm
# See: https://helm.sh/docs/intro/install/
helm version
```

### 2.4 Register Required Resource Providers

```bash
# Register Azure IoT Operations core resource providers
az provider register --namespace Microsoft.ExtendedLocation
az provider register --namespace Microsoft.Kubernetes
az provider register --namespace Microsoft.KubernetesConfiguration
az provider register --namespace Microsoft.IoTOperations
az provider register --namespace Microsoft.DeviceRegistry
az provider register --namespace Microsoft.SecretSyncController
```

> **Note**: Provider registration is a one-time operation per subscription. Verify status with `az provider show --namespace <NAME> --query registrationState`.

### 2.5 Create Azure Resources

```bash
# Set variables
export SUBSCRIPTION_ID="<your-subscription-id>"
export RESOURCE_GROUP="<your-resource-group>"
export LOCATION="<azure-region>"  # e.g., eastus2
export KEYVAULT_NAME="<your-keyvault-name>"

# Login
az login
az account set -s $SUBSCRIPTION_ID

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Azure Key Vault with RBAC permission model
az keyvault create \
  --name $KEYVAULT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --enable-rbac-authorization true

# Grant yourself Key Vault Secrets Officer role
az role assignment create \
  --role "Key Vault Secrets Officer" \
  --assignee $(az ad signed-in-user show --query id -o tsv) \
  --scope $(az keyvault show --name $KEYVAULT_NAME --query id -o tsv)

# Create two user-assigned managed identities
az identity create --name "aio-secrets-identity" --resource-group $RESOURCE_GROUP
az identity create --name "aio-components-identity" --resource-group $RESOURCE_GROUP

# Create storage account with hierarchical namespace enabled
az storage account create \
  --name "<storage-account-name>" \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS \
  --kind StorageV2 \
  --hns true

# Create a container in the storage account
az storage container create \
  --name "schemas" \
  --account-name "<storage-account-name>"
```

> **Production hardening**: After deployment, restrict the storage account to **"Enabled from selected virtual networks and IP addresses"** and enable the **"Allow trusted Microsoft services"** exception. This prevents public access while allowing Azure IoT Operations schema registry to function.

---

## 3. Cluster Preparation

### 3.1 Create a K3s Cluster (Ubuntu)
For additional details on K3s and setting up more complicated clusters, see [here](https://docs.k3s.io/)

```bash
# Install K3s
curl -sfL https://get.k3s.io | sh -

# Configure kubeconfig
mkdir -p ~/.kube
sudo KUBECONFIG=~/.kube/config:/etc/rancher/k3s/k3s.yaml kubectl config view --flatten > ~/.kube/merged
mv ~/.kube/merged ~/.kube/config
chmod 0600 ~/.kube/config
export KUBECONFIG=~/.kube/config
kubectl config use-context default
sudo chmod 644 /etc/rancher/k3s/k3s.yaml
```

### 3.2 Tune System Parameters

```bash
# Increase inotify limits
echo fs.inotify.max_user_instances=8192 | sudo tee -a /etc/sysctl.conf
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Increase file descriptor limit (recommended for performance)
echo fs.file-max=100000 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### 3.3 Multi-Node Cluster Preparation

For multi-node clusters with fault tolerance, configure Edge Volumes for Azure Container Storage. For more information, see [Prepare Linux for Edge Volumes](/azure/azure-arc/container-storage/howto-prepare-linux-edge-volumes).

### 3.4 Arc-Enable the Cluster

```bash
export CLUSTER_NAME="<your-cluster-name>"

# Connect the cluster to Azure Arc (with workload identity for secure settings)
az connectedk8s connect \
  --name $CLUSTER_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --enable-oidc-issuer \
  --enable-workload-identity \
  --disable-auto-upgrade

# Retrieve the custom location object ID
export CUSTOM_LOC_OID=$(az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv)

# Enable custom locations feature
az connectedk8s enable-features \
  --name $CLUSTER_NAME \
  --resource-group $RESOURCE_GROUP \
  --features cluster-connect custom-locations \
  --custom-locations-oid $CUSTOM_LOC_OID

# Verify cluster is connected
az connectedk8s show --name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --query connectivityStatus
```

> **Note**: You must use a Microsoft Entra user account (not a service principal) for this step.

If your Kubernetes environment requires a proxy for outgoing Internet connections, make sure to pass the `--proxy-http`, `--proxy-https`, `--proxy-skip-range`, and `--proxy-cert` arguments to the `az connectedk8s connect` command. These arguments will be provided to all installed components.
- `--proxy-http` and `--proxy-https` are the proxy URLs. The expected format is `http(s)://<username>:<password>@proxy-url:port`
- `--proxy-skip-range` is a comma-separated list of IP addresses or DNS names that should not use the proxy
- `--proxy-cert` is a list of PEM-encoded certificates, which will be added as trusted CA certificates for all outgoing connections

#### Configure K3s for Workload Identity

After Arc-enabling, configure K3s to support workload identity federation (required for secret sync):

```bash
# Get the OIDC issuer URL
export OIDC_ISSUER=$(az connectedk8s show --name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --query oidcIssuerProfile.issuerUrl -o tsv)

# Edit K3s config
sudo tee -a /etc/rancher/k3s/config.yaml > /dev/null <<EOF
kube-apiserver-arg:
  - service-account-issuer=$OIDC_ISSUER
  - service-account-max-token-expiration=24h
EOF

# Restart K3s to apply
sudo systemctl restart k3s
```

### 3.5 Networking and Firewall Configuration

If you use enterprise firewalls or proxies, add the Azure IoT Operations endpoints to your allow list. Three networking approaches are supported:

1. **Azure Arc gateway**—Network proxy for simplifying firewall configuration
2. **Explicit proxy**—Azure Firewall Explicit Proxy for traffic inspection
3. **[Layered networking](../manage-layered-network/overview-layered-network.md)**—For Purdue Network Architecture / ISA-95 scenarios

---

## 4. Security Preparation

### 4.1 Bring Your Own Certificate Authority (Recommended)

For production, replace the default self-signed CA with an enterprise public key infrastructure (PKI) issuer.

```bash
# Install cert-manager (if not already installed)
# See: https://cert-manager.io/docs/installation/

# Install trust-manager
helm upgrade trust-manager jetstack/trust-manager \
  --install --namespace cert-manager \
  --set app.trust.namespace=cert-manager --wait

# Create Azure IoT Operations namespace
kubectl create namespace azure-iot-operations

# Deploy your enterprise CA issuer (ClusterIssuer or Issuer)
# Create trust bundle ConfigMap
kubectl create configmap -n azure-iot-operations <YOUR_CONFIGMAP_NAME> \
  --from-file=<CA_CERTIFICATE_FILENAME_PEM_OR_DER>
```

### 4.2 Validate Container Images

Before deployment, optionally validate the Microsoft signatures on Azure IoT Operations images. See [Validate images](../secure-iot-ops/howto-validate-images.md).

### 4.3 Block IMDS Access (Azure Kubernetes Service (AKS) Deployments)

For AKS deployments with [secure settings](./howto-enable-secure-settings.md), block pod access to the Azure Instance Metadata Service (IMDS) to prevent credential leakage.

---

## 5. Deploy Azure IoT Operations

### 5.1 Deploy via Azure portal

1. Sign in to [Azure portal](https://portal.azure.com)
2. Search for **Azure IoT Operations** → Select **Create**

3. **Basics tab**:
   - Select your subscription, resource group, and Arc-enabled cluster
   - Choose deployment version **1.2 (latest)**

4. **Configuration tab**:
   - Configure MQTT broker cardinality and memory profile based on your cluster hardware. See [section 1.2](#12-choose-your-cluster-topology) for detailed recommendations.

   **Single-node example** (4 CPU cores):

   <table>
       <thead>
           <tr>
               <th colspan="2">Frontend</th>
               <th colspan="2">Backend</th>
               <th colspan="2">Broker</th>
           </tr>
           <tr>
               <th>Setting</th><th>Value</th>
               <th>Setting</th><th>Value</th>
               <th>Setting</th><th>Value</th>
           </tr>
       </thead>
       <tbody>
           <tr>
               <td>Replicas</td><td>2</td>
               <td>Redundancy Factor</td><td>2</td>
               <td>Memory profile</td><td>Low</td>
           </tr>
           <tr>
               <td>Workers</td><td>4</td>
               <td>Workers</td><td>1</td>
               <td></td><td></td>
           </tr>
           <tr>
               <td></td><td></td>
               <td>Partitions</td><td>1</td>
               <td></td><td></td>
           </tr>
       </tbody>
   </table>

   **Multi-node example** (3 nodes, 8 CPU cores per node):

   <table>
       <thead>
           <tr>
               <th colspan="2">Frontend</th>
               <th colspan="2">Backend</th>
               <th colspan="2">Broker</th>
           </tr>
           <tr>
               <th>Setting</th><th>Value</th>
               <th>Setting</th><th>Value</th>
               <th>Setting</th><th>Value</th>
           </tr>
       </thead>
       <tbody>
           <tr>
               <td>Replicas</td><td>3</td>
               <td>Redundancy Factor</td><td>2</td>
               <td>Memory profile</td><td>High</td>
           </tr>
           <tr>
               <td>Workers</td><td>4</td>
               <td>Workers</td><td>4</td>
               <td></td><td></td>
           </tr>
           <tr>
               <td></td><td></td>
               <td>Partitions</td><td>3</td>
               <td></td><td></td>
           </tr>
       </tbody>
   </table>

   > **Critical**: Backend redundancy factor must be **2 or greater** for high availability and rolling upgrade support. Always set at least **2 frontend replicas** on single-node deployments to enable rolling updates.

   > **Warning**: MQTT broker cardinality settings (replicas, workers, partitions) are configured **only at deployment time**. To change these settings later, you must uninstall and redeploy Azure IoT Operations.

   - Configure [data flow profile](../connect-to-cloud/howto-configure-dataflow-profile.md) (instance count for scaling)

5. **Dependency management tab**:
   - Create or select a **[Schema Registry](../connect-to-cloud/concept-schema-registry.md)** backed by a hierarchical-namespace-enabled storage account
   - Create or select an **Azure Device Registry Namespace**
   - Select **[Secure settings](./howto-enable-secure-settings.md)** deployment option
   - Configure Azure Key Vault, user-assigned managed identity for secrets, and user-assigned managed identity for AIO components

   > **Important**: Use **different** managed identities for secrets and AIO components.

6. **Automation tab**—Run the generated CLI commands (see next section)

### 5.2 Run the CLI Commands

The portal generates a sequence of CLI commands. Run them in order:

```bash
# Step 1: Login interactively (required even if already logged in)
az login

# Step 2: Install/upgrade the CLI extension
az upgrade
az extension add --upgrade --name azure-iot-ops

# Step 3: Create schema registry (if new)
az iot ops schema registry create ...  # (copied from portal)

# Step 4: Initialize cluster prerequisites
az iot ops init \
  --subscription $SUBSCRIPTION_ID \
  --cluster $CLUSTER_NAME \
  -g $RESOURCE_GROUP \
  --user-trust  # Add this if using your own CA issuer

# Step 5: Deploy Azure IoT Operations
az iot ops create ... \
  --trust-settings configMapName=<NAME> configMapKey=<KEY> \
    issuerKind=<ClusterIssuer> issuerName=<ISSUER_NAME>
# Add --trust-settings only if using your own CA

# Step 6: Enable secret sync
az iot ops secretsync enable ...  # (copied from portal)

# Step 7: Assign managed identity
az iot ops identity assign ...  # (copied from portal)

# Step 8: Restart schema registry pods
kubectl delete pods adr-schema-registry-0 adr-schema-registry-1 -n azure-iot-operations
```

### 5.3 Configure Observability on the Instance

```bash
az iot ops upgrade \
  --resource-group $RESOURCE_GROUP \
  -n <INSTANCE_NAME> \
  --ops-config observability.metrics.openTelemetryCollectorAddress=aio-otel-collector.azure-iot-operations.svc.cluster.local:4317 \
  --ops-config observability.metrics.exportInternalSeconds=60
```

---

## 6. Post-Deployment Validation

### 6.1 Run Health Check

```bash
# Basic health check
az iot ops check

# Verbose check with detailed configuration
az iot ops check --detail-level 2

# Check specific service (e.g., broker, dataflow)
az iot ops check --ops-service broker
```

> The `check` command displays a warning about missing data flows—this is expected until you create one.

### 6.2 Verify Health Status

After deployment, verify that all components report **Available** health status:

1. Open the [operations experience web UI](https://iotoperations.azure.com) and check the health overview for your instance. Components should show 🟢 green (Available).
2. In the Azure portal, navigate to your Azure IoT Operations instance and review the health state of the broker, data flows, and connectors.
3. If any component reports **Degraded** (🟡) or **Unavailable** (🔴), check the reason code and message for diagnostic details.

> **Note**: If a resource hasn't reported status within 15 minutes, it shows as **Unknown** (⚪). Allow a few minutes after deployment for initial health reports to appear.

### 6.3 Verify Pods Are Running

```bash
kubectl get pods -n azure-iot-operations
kubectl get pods -n azure-arc
```

### 6.4 View Deployment Tree

```bash
az iot ops show --name <INSTANCE_NAME> --resource-group $RESOURCE_GROUP --tree
```

### 6.5 Check Available Versions

```bash
az iot ops get-versions
```

---

## 7. Observability Setup

Azure IoT Operations provides unified health status reporting across all components and resources. Health status (Available, Degraded, Unavailable, Unknown) is reported through Azure Resource Manager and visible in the [operations experience](../discover-manage-assets/howto-use-operations-experience.md) web UI and Azure portal. Combined with metrics and logs, this gives you a complete operational view of your deployment. Follow the steps outlined in [Deploy observability resources](../configure-observability-monitoring/howto-configure-observability.md#deploy-with-the-automated-script) for an automated way to deploy observability resources.

---

## 8. Configure MQTT Broker for Production

### 8.1 Configure Transport Layer Security (TLS) Listeners

After deployment, configure TLS on [broker listeners](../manage-mqtt-broker/howto-configure-brokerlistener.md):

> **Warning**: Do not modify the default broker listener on port 18883. This listener is used for internal Azure IoT Operations communication. Create additional `BrokerListener` resources for external client access instead.

- Use **automatic certificate management** with cert-manager for listeners
- For external clients, configure a `BrokerListener` with TLS and your preferred service type (NodePort or LoadBalancer)

### 8.2 Configure Authentication

Production [authentication](../manage-mqtt-broker/howto-configure-authentication.md) options (do **not** use no-auth):

| Method | Use Case |
|---|---|
| **X.509 certificates** | Machine-to-machine, highest security |
| **Kubernetes Service Account Tokens (SAT)** | In-cluster workloads |
| **Custom authentication** | Integration with external identity providers |

### 8.3 Configure Authorization

Create `BrokerAuthorization` resources with least-privilege access per topic:

- Define [authorization policies](../manage-mqtt-broker/howto-configure-authorization.md) mapping clients to allowed topic patterns
- Support for attribute-based access control (ABAC)

### 8.4 Encrypt Internal Traffic

For production, enable [encryption between broker frontend and backend pods](../manage-mqtt-broker/howto-encrypt-internal-traffic.md).

### 8.5 Configure Disk-Backed Message Buffer

To prevent RAM overflow, set a [disk-backed message buffer](../manage-mqtt-broker/howto-disk-backed-message-buffer.md) with a max size. This works similar to an operating system's swap file, the data is stored to disk but it is **not** durable, a restart will lose everything in the swap.

### 8.6 Configure Persistence

Enable [data persistence](../manage-mqtt-broker/howto-broker-persistence.md) for the MQTT broker to survive pod restarts and ensure message durability. Persistence complements the broker's replication system—while replication protects against individual node failures, persistence protects against cluster-wide shutdowns.

Key deployment-time decisions (can't be changed after deployment):

- **Volume and size**: Set `maxSize` for the persistent volume (must be > 100 MB). Example: `10GiB`.
- **PersistentVolumeClaim spec**: Optionally provide a custom PVC template. If omitted, the broker uses the default storage class, which may not be optimal for performance. Use a local path provisioner for best results. Access mode must be `ReadWriteOncePod`.
- **Encryption**: Configure encryption for data at rest if required by your security policies.

> **Important**: You set persistence during deployment and can't turn it off afterward. You can change some persistence-related options (retained messages, subscriber queue, state store persistence) after deployment. See [Configure MQTT broker persistence](../manage-mqtt-broker/howto-broker-persistence.md) for all options.

### 8.7 Configure CPU Resource Limits

To prevent resource starvation, the broker can [request Kubernetes CPU resource limits](../manage-mqtt-broker/howto-configure-availability-scale.md#cardinality-and-kubernetes-resource-limits) based on the cardinality settings. When enabled, scaling replicas or workers proportionally increases the CPU resources required.

> **Note**: The default for `generateResourceLimits.cpu` depends on the deployment method:
> - **Azure CLI (`az iot ops create`)**: `Disabled` by default to avoid deployment failures on resource-constrained clusters.
> - **REST API, Bicep, and ARM templates**: `Enabled` by default.

**CPU requirements per pod:**

| Component | CPU per worker |
|---|---|
| Frontend pods | 1.0 CPU per worker |
| Backend pods | 2.0 CPU per worker |

**Formulas:**

| Component | Formula |
|---|---|
| Frontend CPU | `replicas` × `frontend.workers` × 1.0 CPU |
| Backend CPU | `partitions` × `redundancyFactor` × `backend.workers` × 2.0 CPU |
| **Total broker CPU** | Frontend CPU + Backend CPU |

> **Caution**: The broker isn't the only component that consumes CPU. Other Azure IoT Operations components (dataflow engine, OPC UA connector, system pods) typically consume ~200–300m in aggregate. Account for this overhead when planning cluster capacity. If total CPU requested exceeds available CPU, broker pods get stuck in `Pending` state.

---

## 9. Configure Assets and Devices

### 9.1 Configure OPC UA Connectivity

1. **Set up [OPC UA authentication](../discover-manage-assets/howto-configure-opc-ua.md)**—Don't use no-auth for production. Options:
   - Username/password authentication (secrets stored in Azure Key Vault)
   - X.509 certificate mutual authentication

2. **[Configure certificates](../discover-manage-assets/howto-configure-opc-ua-certificates-infrastructure.md)**:
   - Set up application instance certificates for the [OPC UA connector](../discover-manage-assets/overview-opc-ua-connector.md)
   - Configure trusted certificates list for OPC UA servers
   - Use production PKI (not self-signed certificates)
   - If connecting to OPC UA servers with legacy certificates, review the [PKI security validation settings](../discover-manage-assets/howto-configure-opc-ua-certificates-infrastructure.md#configure-pki-security-validation-settings)
   - After certificate changes, [verify connector pods](../discover-manage-assets/howto-configure-opc-ua-certificates-infrastructure.md#verify-connector-configuration-after-certificate-changes) pick up the new configuration

3. **Create [devices and assets](../discover-manage-assets/concept-assets-devices.md)** via the operations experience UI at [iotoperations.azure.com](https://iotoperations.azure.com) or via CLI:

```bash
# Example: Create a device with OPC UA endpoint
az iot ops ns device create ...

# Example: Create an asset with data points
az iot ops ns asset create ...
```

### 9.2 Configure More Connectors

Azure IoT Operations supports multiple connector types:

| Connector | Protocol | Use Case |
|---|---|---|
| **OPC UA** | OPC UA | Industrial programmable logic controllers (PLCs) and SCADA |
| **[ONVIF](../discover-manage-assets/howto-use-onvif-connector.md)** | ONVIF | IP cameras |
| **[Media](../discover-manage-assets/howto-use-media-connector.md)** | RTSP/HTTP | Video streaming |
| **MQTT** | MQTT | External MQTT brokers |
| **HTTP/REST** | HTTP | REST APIs |
| **SSE** | Server-Sent Events | Event streams |
| **Kafka** | Kafka | Event Hubs / Kafka clusters |

### 9.3 Automatic Asset Discovery

Enable Akri-based [autodiscovery](../discover-manage-assets/howto-detect-opc-ua-assets.md) for OPC UA servers:

```bash
# Enable resource sync rules
az iot ops enable-rsync -n <INSTANCE_NAME> -g $RESOURCE_GROUP
```

---

## 10. Configure Data Flows to Cloud

### 10.1 Supported Cloud Destinations

| Destination | Service |
|---|---|
| **Azure Event Hubs** | Real-time event streaming |
| **Azure Event Grid** | Event routing (MQTT bridge) |
| **Azure Data Lake Storage Gen2** | Data lake ingestion |
| **Azure Data Explorer (Kusto)** | Time-series analytics |
| **Microsoft Fabric OneLake** | Unified analytics |
| **Local Storage** | Edge persistence via Azure Container Storage |
| **Apache Kafka** | Kafka-compatible endpoints |

### 10.2 Create Data Flow Endpoints

Configure [endpoints](../connect-to-cloud/howto-configure-dataflow-endpoint.md) with user-assigned managed identity authentication (recommended):

```bash
# Example: Create an Event Hubs endpoint via operations experience UI
# or via Kubernetes manifests / Bicep / Azure CLI
```

### 10.3 Create Data Flows

[Data flows](../connect-to-cloud/howto-create-dataflow.md) define the pipeline: **Source → Transformation → Destination**

> **Requirement**: Every data flow must include the local MQTT broker default endpoint (`aio-broker`) as either its source or its destination. You cannot connect two custom endpoints directly without the local broker in between.

- **Source**: MQTT broker topics (default), Kafka, or asset data
- **Transformations**: Filtering, [mapping](../connect-to-cloud/concept-dataflow-mapping.md) (one-to-one, many-to-one), [enrichment](../connect-to-cloud/concept-dataflow-enrich.md) from reference datasets, type conversions
- **Destination**: Any supported cloud endpoint

### 10.4 Scale Data Flow Profiles

```bash
# Configure data flow profile instance count for throughput and HA
# Group related flows into profiles and scale each independently
```

> **Limitation**: A [data flow profile](../connect-to-cloud/howto-configure-dataflow-profile.md) can't exceed 70 data flows. Create multiple profiles and distribute flows if needed.

### 10.5 WebAssembly (WASM) Data Processing

For advanced edge processing, deploy custom [WASM modules](../develop-edge-apps/howto-develop-wasm-modules.md):

- Supports Rust and Python
- Can run [Open Neural Network Exchange (ONNX) inference](../develop-edge-apps/howto-wasm-onnx-inference.md) models at the edge
- Deployed as graph definitions in data flow pipelines

---

## 11. End-to-End Validation

### 11.1 Verify MQTT Broker Connectivity

```bash
# Deploy MQTT test client
kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/quickstarts/mqtt-client.yaml

# Connect to the broker
kubectl exec --stdin --tty mqtt-client -n azure-iot-operations -- sh

# Subscribe to asset data topics
mosquitto_sub --host aio-broker --port 18883 \
  --topic "azure-iot-operations/data/#" \
  -v --cafile /var/run/certs/ca.crt \
  -D CONNECT authentication-method 'K8S-SAT' \
  -D CONNECT authentication-data $(cat /var/run/secrets/tokens/broker-sat)
```

### 11.2 Verify Data Reaches Cloud

- Check Azure Event Hubs for incoming messages
- Verify data in Azure Data Lake, Data Explorer, or Fabric OneLake
- Use the [operations experience](../discover-manage-assets/howto-use-operations-experience.md) portal to monitor connector and data flow status

### 11.3 Verify Observability

1. Access Grafana: `az grafana show --name $GRAFANA_NAME --resource-group $RESOURCE_GROUP --query url -o tsv`
2. Import the unified Azure IoT Operations Grafana dashboard—it brings health status, metrics, and logs together in a single view
3. Verify the health overview at the top of the dashboard shows components as Available
4. Verify metrics are flowing for MQTT broker, OPC UA connector, and data flows

### 11.4 Create a Support Bundle

```bash
# Collect diagnostic information
az iot ops support create-bundle
```

---

## 12. Production Deployment Checklist

### Platform & Cluster

- [ ] K3s on Ubuntu 24.04 (production GA platform)
- [ ] System parameters tuned (inotify, file descriptors)
- [ ] Cluster Arc-enabled with custom locations and workload identity
- [ ] Arc agent autoupgrade disabled
- [ ] Firewall/proxy rules configured for Azure IoT Operations endpoints
- [ ] Multi-node: Edge Volumes configured for fault tolerance
- [ ] Hardware validated against [baseline resource profiles](./concept-resource-profiles.md) for chosen memory profile

### Security

- [ ] Enterprise CA issuer is configured (not default self-signed)
- [ ] Container images validated (signed by Microsoft)
- [ ] [Secure settings](./howto-enable-secure-settings.md) deployment (not test settings)
- [ ] Azure Key Vault with RBAC permission model
- [ ] Two separate user-assigned managed identities created
- [ ] Key Vault Secrets Officer role assigned
- [ ] IMDS access blocked (AKS deployments)

### MQTT Broker

- [ ] Backend redundancy factor ≥ 2
- [ ] Cardinality configured for expected load
- [ ] Memory profile set appropriately (Low/High)
- [ ] CPU resource limits evaluated (`generateResourceLimits.cpu`) and cluster capacity verified
- [ ] TLS enabled on all listeners
- [ ] Authentication is configured (X.509 or SAT—no no-auth)
- [ ] Authorization policies with least privilege
- [ ] Internal traffic encryption enabled
- [ ] Disk-backed message buffer is configured
- [ ] Data persistence enabled with appropriate volume size and PVC spec

### Observability

- [ ] Azure Monitor workspace created
- [ ] Grafana instance created and linked
- [ ] Log Analytics workspace created
- [ ] OpenTelemetry Collector deployed
- [ ] Prometheus scrape config applied
- [ ] Unified Grafana dashboard imported (health + metrics + logs)
- [ ] Prometheus alerts configured in Azure Monitor
- [ ] Health status verified: all components report Available (🟢)

### Data Pipeline

- [ ] [Schema registry](../connect-to-cloud/concept-schema-registry.md) created with hierarchical-namespace storage
- [ ] Storage account scoped to trusted Azure services only
- [ ] OPC UA authentication is configured (not no-auth)
- [ ] OPC UA certificates and trust lists configured with production PKI
- [ ] PKI security validation settings reviewed (key size, SHA-1 policy)
- [ ] Connector pods verified running after certificate changes
- [ ] Data flow endpoints using user-assigned managed identity
- [ ] [Data flow profiles](../connect-to-cloud/howto-configure-dataflow-profile.md) scaled for throughput and HA
- [ ] Data flows created and validated end-to-end

### Validation

- [ ] `az iot ops check` passes
- [ ] All pods running in `azure-iot-operations` namespace
- [ ] All components report Available health status (🟢) in operations experience or Azure portal
- [ ] MQTT broker accessible and accepting connections
- [ ] Asset data flowing from OPC UA to MQTT broker
- [ ] Data flows pushing data to cloud endpoints
- [ ] Grafana dashboards showing metrics
- [ ] Support bundle collected for baseline

---

## Quick Reference: Key Commands

| Action | Command |
|---|---|
| Check health | `az iot ops check` |
| View health status | Operations experience UI or Azure portal → instance overview |
| View instance | `az iot ops show -n <NAME> -g <RG> --tree` |
| List instances | `az iot ops list -g <RG>` |
| Create support bundle | `az iot ops support create-bundle` |
| Get available versions | `az iot ops get-versions` |
| List pods | `kubectl get pods -n azure-iot-operations` |
| View pod logs | `kubectl logs <POD_NAME> -n azure-iot-operations` |
| Describe pod | `kubectl describe pod <POD_NAME> -n azure-iot-operations` |

---

## Next Steps

- Proceed to the [Day 1 Operational Manual](./operational-manual-day1-operations.md) for maintenance, monitoring, troubleshooting, and upgrade procedures.
- Review [Production deployment guidelines](./concept-production-guidelines.md) for more best practices.
- Review [Production deployment examples](./concept-production-examples.md) for validated scaling configurations.
- Review [Baseline resource profiles](./concept-resource-profiles.md) for measured resource consumption at each memory profile level.
