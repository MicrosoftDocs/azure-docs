# Azure IoT Operations — Day 0 Operational Manual: Deployment

This operational manual provides a comprehensive, step-by-step guide for deploying Azure IoT Operations to a production Kubernetes cluster. It covers everything from initial planning and prerequisites through cluster preparation, deployment, configuration of assets and data flows, and post-deployment validation.

> **Audience**: IT administrators, platform engineers, and OT professionals responsible for deploying Azure IoT Operations.

---

## Table of Contents

1. [Deployment Planning](#1-deployment-planning)
2. [Prerequisites and Azure Resource Setup](#2-prerequisites-and-azure-resource-setup)
3. [Cluster Preparation](#3-cluster-preparation)
4. [Observability Setup (Pre-Deployment)](#4-observability-setup-pre-deployment)
5. [Security Preparation](#5-security-preparation)
6. [Deploy Azure IoT Operations](#6-deploy-azure-iot-operations)
7. [Post-Deployment Validation](#7-post-deployment-validation)
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
| **MQTT Broker** | High-performance MQTT v3.1.1/v5 broker for edge messaging |
| **Connector for OPC UA** | Collects data from OPC UA servers and publishes to MQTT |
| **Data Flows** | Routes, transforms, and pushes data to cloud endpoints |
| **Azure Device Registry** | Cloud-based registry for devices, assets, and schemas |
| **Akri Services** | Device discovery and protocol adapters |
| **State Store** | Key-value persistence layer in the MQTT broker |

An Azure IoT Operations *deployment* includes the instance, Arc extensions, custom locations, and all configurable resources (assets, devices, data flows). The *instance* is the parent resource that bundles the services.

### 1.2 Choose Your Cluster Topology

| Topology | Use Case | Min Hardware |
|---|---|---|
| **Single-node** | Small deployments, up to ~125 assets, ~6,250 tags | 4 vCPU, 16 GB RAM, 30 GB storage |
| **Multi-node (3-5 nodes)** | High availability, up to ~85K assets, ~50K data points/sec | 8 vCPU, 32 GB RAM per node |

**Performance benchmarks** (validated by Microsoft):

- **Single-node**: 125 assets, 6,250 tags, 125 msg/sec → 6-8 GB RAM, ~2,500 millicores, <10s E2E latency
- **5-node cluster**: 85K assets, 50K data points/sec → 25-30 GB RAM, ~3,000 millicores, <10s E2E latency

### 1.3 Choose Your Platform

| Platform | OS | Production Status |
|---|---|---|
| **K3s** | Ubuntu 24.04 (x86_64) | ✅ GA (recommended for production) |
| **Tanzu Kubernetes (TKr)** | x86_64 | ✅ GA |
| **AKS Edge Essentials** | Windows | ✅ GA (single-node only) |
| **AKS on Azure Local** | Windows | ✅ GA |

> **Recommendation**: K3s on Ubuntu 24.04 is the only GA platform for multi-node production deployments.

### 1.4 Supported Azure Regions

Azure IoT Operations is available in: East US, East US 2, West US, West US 2, West US 3, West Europe, North Europe, Germany West Central.

### 1.5 Plan Your Azure Resources

You will need the following Azure resources:

| Resource | Purpose |
|---|---|
| **Resource Group** | Container for all AIO-related resources |
| **Azure Key Vault** | Secrets management (must use Azure RBAC permission model) |
| **Azure Storage Account** | Schema registry backend (hierarchical namespace required) |
| **Schema Registry** | Data validation and serialization |
| **Device Registry Namespace** | Organizes assets and devices |
| **User-Assigned Managed Identities (×2)** | One for secrets, one for AIO components |
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
- **Storage Blob Data Contributor** on the storage account (auto-assigned during schema registry creation)

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

### 2.4 Create Azure Resources

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

---

## 3. Cluster Preparation

### 3.1 Create a K3s Cluster (Ubuntu)

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
echo fs.file-max=1048576 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### 3.3 Multi-Node Cluster Preparation

For multi-node clusters with fault tolerance:

```bash
# Configure clusters with Edge Volumes for Azure Container Storage
# Follow: https://learn.microsoft.com/azure/azure-arc/container-storage/howto-prepare-linux-edge-volumes
```

### 3.4 Arc-Enable the Cluster

```bash
export CLUSTER_NAME="<your-cluster-name>"

# Connect the cluster to Azure Arc
az connectedk8s connect \
  --name $CLUSTER_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# Enable custom locations feature
az connectedk8s enable-features \
  --name $CLUSTER_NAME \
  --resource-group $RESOURCE_GROUP \
  --features cluster-connect custom-locations

# Disable auto-upgrade for Arc agents (recommended for production)
az connectedk8s update \
  --name $CLUSTER_NAME \
  --resource-group $RESOURCE_GROUP \
  --auto-upgrade false

# Verify cluster is connected
az connectedk8s show --name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --query connectivityStatus
```

### 3.5 Networking and Firewall Configuration

If you use enterprise firewalls or proxies, add the Azure IoT Operations endpoints to your allow list. Three networking approaches are supported:

1. **Azure Arc gateway** — Network proxy for simplifying firewall configuration
2. **Explicit proxy** — Azure Firewall Explicit Proxy for traffic inspection
3. **Layered networking** — For Purdue Network Architecture / ISA-95 scenarios

---

## 4. Observability Setup (Pre-Deployment)

> **Important**: Deploy observability resources **before** deploying Azure IoT Operations.

### 4.1 Register Azure Providers

```bash
az provider register --namespace Microsoft.AlertsManagement
az provider register --namespace Microsoft.Monitor
az provider register --namespace Microsoft.Dashboard
az provider register --namespace Microsoft.Insights
az provider register --namespace Microsoft.OperationalInsights
```

### 4.2 Install CLI Extensions

```bash
az extension add --upgrade --name k8s-extension
az extension add --upgrade --name amg
```

### 4.3 Create Monitoring Resources

```bash
export WORKSPACE_NAME="<monitor-workspace-name>"
export GRAFANA_NAME="<grafana-name>"
export LOGS_WORKSPACE_NAME="<logs-workspace-name>"

# Create Azure Monitor workspace
MONITOR_ID=$(az monitor account create \
  --name $WORKSPACE_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --query id -o tsv)

# Create Azure Managed Grafana
GRAFANA_ID=$(az grafana create \
  --name $GRAFANA_NAME \
  --resource-group $RESOURCE_GROUP \
  --query id -o tsv)

# Create Log Analytics workspace
LOG_ANALYTICS_ID=$(az monitor log-analytics workspace create \
  -g $RESOURCE_GROUP \
  -n $LOGS_WORKSPACE_NAME \
  --query id -o tsv)
```

### 4.4 Enable Metrics Collection

```bash
# Enable Prometheus metrics
az k8s-extension create \
  --name azuremonitor-metrics \
  --cluster-name $CLUSTER_NAME \
  --resource-group $RESOURCE_GROUP \
  --cluster-type connectedClusters \
  --extension-type Microsoft.AzureMonitor.Containers.Metrics \
  --configuration-settings \
    azure-monitor-workspace-resource-id=$MONITOR_ID \
    grafana-resource-id=$GRAFANA_ID

# Enable Container Insights
az k8s-extension create \
  --name azuremonitor-containers \
  --cluster-name $CLUSTER_NAME \
  --resource-group $RESOURCE_GROUP \
  --cluster-type connectedClusters \
  --extension-type Microsoft.AzureMonitor.Containers \
  --configuration-settings \
    logAnalyticsWorkspaceResourceID=$LOG_ANALYTICS_ID
```

### 4.5 Deploy OpenTelemetry Collector

Create `otel-collector-values.yaml`:

```yaml
mode: deployment
fullnameOverride: aio-otel-collector
image:
  repository: otel/opentelemetry-collector
  tag: 0.143.0
config:
  processors:
    memory_limiter:
      limit_percentage: 80
      spike_limit_percentage: 10
      check_interval: 60s
  receivers:
    otlp:
      protocols:
        grpc:
          endpoint: ":4317"
        http:
          endpoint: ":4318"
  exporters:
    prometheus:
      endpoint: ":8889"
      resource_to_telemetry_conversion:
        enabled: true
      add_metric_suffixes: false
  service:
    extensions:
      - health_check
    telemetry:
      metrics:
        level: none
    pipelines:
      metrics:
        receivers:
          - otlp
        exporters:
          - prometheus
resources:
  limits:
    cpu: "100m"
    memory: "512Mi"
ports:
  metrics:
    enabled: true
    containerPort: 8889
    servicePort: 8889
    protocol: TCP
```

Deploy the collector:

```bash
kubectl get namespace azure-iot-operations || kubectl create namespace azure-iot-operations
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
helm repo update
helm upgrade --install aio-observability open-telemetry/opentelemetry-collector \
  -f otel-collector-values.yaml \
  --namespace azure-iot-operations
```

### 4.6 Configure Prometheus Scrape Config

Create `ama-metrics-prometheus-config.yaml`:

```yaml
apiVersion: v1
data:
  prometheus-config: |2-
    scrape_configs:
      - job_name: otel
        scrape_interval: 1m
        static_configs:
          - targets:
            - aio-otel-collector.azure-iot-operations.svc.cluster.local:8889
      - job_name: aio-annotated-pod-metrics
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - action: drop
            regex: true
            source_labels:
              - __meta_kubernetes_pod_container_init
          - action: keep
            regex: true
            source_labels:
              - __meta_kubernetes_pod_annotation_prometheus_io_scrape
          - action: replace
            regex: ([^:]+)(?::\\d+)?;(\\d+)
            replacement: $1:$2
            source_labels:
              - __address__
              - __meta_kubernetes_pod_annotation_prometheus_io_port
            target_label: __address__
          - action: replace
            source_labels:
              - __meta_kubernetes_namespace
            target_label: kubernetes_namespace
          - action: keep
            regex: 'azure-iot-operations'
            source_labels:
              - kubernetes_namespace
        scrape_interval: 1m
kind: ConfigMap
metadata:
  name: ama-metrics-prometheus-config
  namespace: kube-system
```

Apply it:

```bash
kubectl apply -f ama-metrics-prometheus-config.yaml
```

---

## 5. Security Preparation

### 5.1 Bring Your Own Certificate Authority (Recommended)

For production, replace the default self-signed CA with an enterprise PKI issuer.

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

### 5.2 Validate Container Images

Before deployment, optionally validate that Azure IoT Operations images are signed by Microsoft. See [Validate images](../secure-iot-ops/howto-validate-images.md).

### 5.3 Block IMDS Access (AKS Deployments)

For AKS deployments with secure settings, block pod access to the Azure Instance Metadata Service (IMDS) to prevent credential leakage.

---

## 6. Deploy Azure IoT Operations

### 6.1 Deploy via Azure Portal

1. Sign in to [Azure portal](https://portal.azure.com)
2. Search for **Azure IoT Operations** → Select **Create**

3. **Basics tab**:
   - Select your subscription, resource group, and Arc-enabled cluster
   - Choose deployment version **1.2 (latest)**

4. **Configuration tab**:
   - Configure MQTT broker cardinality and memory profile:

   | Setting | Single-Node | Multi-Node |
   |---|---|---|
   | frontendReplicas | 1 | 5 |
   | frontendWorkers | 4 | 8 |
   | backendRedundancyFactor | 2 (minimum) | 2 (minimum) |
   | backendWorkers | 1 | 4 |
   | backendPartitions | 1 | 5 |
   | Memory profile | Low | High |

   > **Critical**: Backend redundancy factor must be **2 or greater** for high availability and rolling upgrade support.

   - Configure data flow profile (instance count for scaling)

5. **Dependency management tab**:
   - Create or select a **Schema Registry** backed by a hierarchical-namespace-enabled storage account
   - Create or select an **Azure Device Registry Namespace**
   - Select **Secure settings** deployment option
   - Configure Azure Key Vault, user-assigned managed identity for secrets, and user-assigned managed identity for AIO components

   > **Important**: Use **different** managed identities for secrets and AIO components.

6. **Automation tab** — Run the generated CLI commands (see next section)

### 6.2 Run the CLI Commands

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

### 6.3 Configure Observability on the Instance

```bash
az iot ops upgrade \
  --resource-group $RESOURCE_GROUP \
  -n <INSTANCE_NAME> \
  --ops-config observability.metrics.openTelemetryCollectorAddress=aio-otel-collector.azure-iot-operations.svc.cluster.local:4317 \
  --ops-config observability.metrics.exportInternalSeconds=60
```

---

## 7. Post-Deployment Validation

### 7.1 Run Health Check

```bash
# Basic health check
az iot ops check

# Verbose check with detailed configuration
az iot ops check --detail-level 2

# Check specific service (e.g., broker, dataflow)
az iot ops check --ops-service broker
```

> The `check` command displays a warning about missing data flows—this is expected until you create one.

### 7.2 Verify Pods Are Running

```bash
kubectl get pods -n azure-iot-operations
kubectl get pods -n azure-arc
```

### 7.3 View Deployment Tree

```bash
az iot ops show --name <INSTANCE_NAME> --resource-group $RESOURCE_GROUP --tree
```

### 7.4 Check Available Versions

```bash
az iot ops get-versions
```

---

## 8. Configure MQTT Broker for Production

### 8.1 Configure TLS Listeners

After deployment, configure TLS on broker listeners:

- Use **automatic certificate management** with cert-manager for listeners
- For external clients, configure a `BrokerListener` with TLS and your preferred service type (NodePort or LoadBalancer)

### 8.2 Configure Authentication

Production authentication options (do **not** use no-auth):

| Method | Use Case |
|---|---|
| **X.509 certificates** | Machine-to-machine, highest security |
| **Kubernetes Service Account Tokens (SAT)** | In-cluster workloads |
| **Custom authentication** | Integration with external identity providers |

### 8.3 Configure Authorization

Create `BrokerAuthorization` resources with least-privilege access per topic:

- Define authorization policies mapping clients to allowed topic patterns
- Support for attribute-based access control (ABAC)

### 8.4 Encrypt Internal Traffic

For production, enable encryption between broker frontend and backend pods:

```bash
# See: manage-mqtt-broker/howto-encrypt-internal-traffic.md
```

### 8.5 Configure Disk-Backed Message Buffer

Set a disk-backed message buffer with a max size to prevent RAM overflow:

```bash
# See: manage-mqtt-broker/howto-disk-backed-message-buffer.md
```

### 8.6 Configure Persistence

Enable data persistence for the MQTT broker to survive pod restarts and ensure message durability.

---

## 9. Configure Assets and Devices

### 9.1 Configure OPC UA Connectivity

1. **Set up OPC UA authentication** — Do not use no-auth for production. Options:
   - Username/password authentication (secrets stored in Azure Key Vault)
   - X.509 certificate mutual authentication

2. **Configure certificates**:
   - Set up application instance certificates for the OPC UA connector
   - Configure trusted certificates list for OPC UA servers
   - Use production PKI (not self-signed certificates)

3. **Create devices and assets** via the operations experience UI at [iotoperations.azure.com](https://iotoperations.azure.com) or via CLI:

```bash
# Example: Create a device with OPC UA endpoint
az iot ops ns device create ...

# Example: Create an asset with data points
az iot ops ns asset create ...
```

### 9.2 Configure Additional Connectors

Azure IoT Operations supports multiple connector types:

| Connector | Protocol | Use Case |
|---|---|---|
| **OPC UA** | OPC UA | Industrial PLCs and SCADA |
| **ONVIF** | ONVIF | IP cameras |
| **Media** | RTSP/HTTP | Video streaming |
| **MQTT** | MQTT | External MQTT brokers |
| **HTTP/REST** | HTTP | REST APIs |
| **SSE** | Server-Sent Events | Event streams |
| **Kafka** | Kafka | Event Hubs / Kafka clusters |

### 9.3 Automatic Asset Discovery

Enable Akri-based auto-discovery for OPC UA servers:

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

Configure endpoints with user-assigned managed identity authentication (recommended):

```bash
# Example: Create an Event Hubs endpoint via operations experience UI
# or via Kubernetes manifests / Bicep / Azure CLI
```

### 10.3 Create Data Flows

Data flows define the pipeline: **Source → Transformation → Destination**

- **Source**: MQTT broker topics (default), Kafka, or asset data
- **Transformations**: Filtering, mapping (one-to-one, many-to-one), enrichment from reference datasets, type conversions
- **Destination**: Any supported cloud endpoint

### 10.4 Scale Data Flow Profiles

```bash
# Configure data flow profile instance count for throughput and HA
# Group related flows into profiles and scale each independently
```

> **Limitation**: A data flow profile can't exceed 70 data flows. Create multiple profiles and distribute flows if needed.

### 10.5 WebAssembly (WASM) Data Processing

For advanced edge processing, deploy custom WASM modules:

- Supports Rust and Python
- Can run ONNX inference models at the edge
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
- Use the operations experience portal to monitor connector and data flow status

### 11.3 Verify Observability

1. Access Grafana: `az grafana show --name $GRAFANA_NAME --resource-group $RESOURCE_GROUP --query url -o tsv`
2. Import the Azure IoT Operations dashboard from [explore-iot-operations samples](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/observability)
3. Verify metrics are flowing for MQTT broker, OPC UA connector, and data flows

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
- [ ] Arc agent auto-upgrade disabled
- [ ] Firewall/proxy rules configured for Azure IoT Operations endpoints
- [ ] Multi-node: Edge Volumes configured for fault tolerance

### Security

- [ ] Enterprise CA issuer configured (not default self-signed)
- [ ] Container images validated (signed by Microsoft)
- [ ] Secure settings deployment (not test settings)
- [ ] Azure Key Vault with RBAC permission model
- [ ] Two separate user-assigned managed identities created
- [ ] Key Vault Secrets Officer role assigned
- [ ] IMDS access blocked (AKS deployments)

### MQTT Broker

- [ ] Backend redundancy factor ≥ 2
- [ ] Cardinality configured for expected load
- [ ] Memory profile set appropriately (Low/High)
- [ ] TLS enabled on all listeners
- [ ] Authentication configured (X.509 or SAT — no no-auth)
- [ ] Authorization policies with least privilege
- [ ] Internal traffic encryption enabled
- [ ] Disk-backed message buffer configured

### Observability

- [ ] Azure Monitor workspace created
- [ ] Grafana instance created and linked
- [ ] Log Analytics workspace created
- [ ] OpenTelemetry Collector deployed
- [ ] Prometheus scrape config applied
- [ ] Grafana dashboards imported
- [ ] Prometheus alerts configured in Azure Monitor

### Data Pipeline

- [ ] Schema registry created with hierarchical-namespace storage
- [ ] Storage account scoped to trusted Azure services only
- [ ] OPC UA authentication configured (not no-auth)
- [ ] OPC UA certificates and trust lists configured with production PKI
- [ ] Data flow endpoints using user-assigned managed identity
- [ ] Data flow profiles scaled for throughput and HA
- [ ] Data flows created and validated end-to-end

### Validation

- [ ] `az iot ops check` passes
- [ ] All pods running in `azure-iot-operations` namespace
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
- Review [Production deployment guidelines](./concept-production-guidelines.md) for additional best practices.
- Review [Production deployment examples](./concept-production-examples.md) for validated scaling configurations.
