---
title: "Day 1 operational manual: Maintenance and troubleshooting"
description: Learn how to maintain, monitor, troubleshoot, upgrade, and operate Azure IoT Operations in production environments.
author: huguesbouvier
ms.author: hubouvie
ms.topic: how-to
ms.service: azure-iot-operations
ms.date: 03/25/2026

#CustomerIntent: As an SRE or IT administrator, I want a guide for maintaining, monitoring, troubleshooting, and upgrading Azure IoT Operations in production.
---

# Day 1 operational manual: Maintenance and troubleshooting

This operational manual provides a comprehensive guide for maintaining, monitoring, troubleshooting, upgrading, and operating [Azure IoT Operations](../overview-iot-operations.md) in production. It covers day-to-day operations, incident response, scaling, certificate and secrets management, and disaster recovery.

## Monitoring and observability

### Observability architecture

Azure IoT Operations uses:

| Component | Purpose |
|---|---|
| **Unified Health Status Reporting** | Reports runtime health (Available, Degraded, Unavailable, Unknown) for all components and resources to the cloud via Azure Resource Manager |
| [**OpenTelemetry Collector**](../connect-to-cloud/open-telemetry.md) | Collects metrics from Azure IoT Operations services |
| **Azure Monitor (Prometheus)** | Stores and queries time-series metrics |
| **Azure Managed Grafana** | Unified dashboards combining health status, metrics, and logs |
| **Container Insights** | Pod logs and Kubernetes-level telemetry |
| **Log Analytics** | Log queries and alerting |

Health status and metrics serve complementary roles:

| Aspect | Health Status | Metrics |
|---|---|---|
| **Purpose** | Current state snapshot (point-in-time) | Historical trends and patterns |
| **Visibility** | Operations experience web UI, Azure portal, ARM | Grafana dashboards |
| **Use case** | "Is my system healthy right now?" | "What happened over the last hour or day?" |
| **Update frequency** | Every ~1 minute per component | Configurable scrape intervals |

For full details, see the unified health status reporting article.

#### Health states

Each supported Azure IoT Operations resource reports one of the following health states:

| Status | Description | Color |
|---|---|---|
| **Available** | Resource is healthy and functioning as expected | 🟢 Green |
| **Degraded** | Resource is partially functional but might not operate optimally | 🟡 Yellow |
| **Unavailable** | Resource isn't functioning | 🔴 Red |
| **Unknown** | Health status can't be determined (for example, no recent reports within 15 minutes) | ⚪ Gray |

Supported resources that report health status: Broker, [Data flows](../connect-to-cloud/overview-dataflow.md) and data flow graphs, [Akri](../discover-manage-assets/overview-akri.md) connectors, Device inbound endpoints, and Assets.

When a resource is Degraded or Unavailable, a reason code and human-readable message are included to help you diagnose the issue.

### Key metrics to monitor

#### MQTT broker metrics

| Metric Category | What to Watch |
|---|---|
| **Messaging** | Publish rates (in/out), payload sizes, QoS distribution |
| **Connections** | Active connections, connection/disconnection rates, authentication failures |
| **Subscriptions** | Active subscriptions, subscription churn |
| **Authorization** | Authorization denials (spike = misconfiguration or attack) |
| [**State Store**](../develop-edge-apps/overview-state-store.md) | Key-value operation latency and throughput |
| [**Disk Buffer**](../manage-mqtt-broker/howto-disk-backed-message-buffer.md) | Disk usage, buffer overflow events |
| **Broker Health** | Pod readiness, restart counts, memory usage |

#### OPC UA connector metrics

| Metric Category | What to Watch |
|---|---|
| **Data Changes** | Data change notifications per second |
| **Events** | Event notifications processed |
| **MQTT Publishing** | Message egress rate and failures |
| **Supervisor** | Active assets, endpoints, connector load |
| **Sidecar** | Message queue depth |

#### Data Flow metrics

| Metric Category | What to Watch |
|---|---|
| **Throughput** | Messages processed per second |
| **Latency** | End-to-end processing time |
| **Errors** | Failed transformations, destination write failures |
| **Backpressure** | Queue depths at source and destination |

### Grafana dashboards

Azure IoT Operations provides a unified Grafana dashboard that brings health status, metrics, and logs together in a single view. Key characteristics:

- A **health overview** visible at the top of the dashboard
- Component-specific sections that load only when expanded
- Metrics and logs shown side-by-side for common troubleshooting workflows

To access Grafana:

1. Get the URL:
   ```bash
   az grafana show --name <GRAFANA_NAME> --resource-group <RESOURCE_GROUP> --query url -o tsv
   ```

2. Import the unified AIO dashboard from:
   `https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/observability/grafana-dashboard`

3. Ensure both **Prometheus** and **Azure Monitor** datasources are configured in the dashboard JSON, and set the `subscriptionId` variable.

### Setting up alerts

Configure Prometheus alerts in Azure Monitor for critical conditions:

- **Health status**: Component transitions from Available to Degraded or Unavailable, resource status Unknown for > 15 minutes
- **MQTT Broker**: Pod restarts > 3 in 5 minutes, connection failures > threshold, memory > 80%
- **OPC UA Connector**: Zero data changes for > 5 minutes, MQTT publish failures
- **Data Flows**: `AllBrokersDown` error, zero messages processed for > 5 minutes
- **Cluster**: Node not ready, persistent volume usage > 85%

### Diagnostic commands

```bash
# Quick health assessment
az iot ops check

# Verbose health assessment
az iot ops check --detail-level 2

# Check specific service
az iot ops check --ops-service broker
az iot ops check --ops-service dataflow

# Create diagnostic support bundle (logs + traces)
az iot ops support create-bundle

# View deployment tree
az iot ops show --name <INSTANCE_NAME> --resource-group <RG> --tree
```

#### Check health status via operations experience or portal

- Open the [operations experience web UI](https://iotoperations.azure.com) to see the health overview for your instance
- In the Azure portal, navigate to your Azure IoT Operations instance to view health states
- Filter and group resources by health state (Available, Degraded, Unavailable, Unknown)
- Drill into Degraded or Unavailable resources to view the reason code and diagnostic message

## Routine maintenance

### Daily checks

| Check | Command / Action |
|---|---|
| Health status overview | Check operations experience UI or Azure portal for any Degraded/Unavailable/Unknown components |
| All pods healthy | `kubectl get pods -n azure-iot-operations` |
| No crash loops | `kubectl get pods -n azure-iot-operations --field-selector=status.phase!=Running` |
| Arc connectivity | `az connectedk8s show --name <CLUSTER> -g <RG> --query connectivityStatus` |
| Broker health | `az iot ops check --ops-service broker` |
| Data flow health | `az iot ops check --ops-service dataflow` |
| Grafana dashboards | Review unified dashboard for anomalies in health states, message rates, latencies, error counts |
| Disk usage | `kubectl top nodes` and check persistent volume usage |

### Weekly checks

| Check | Action |
|---|---|
| Certificate expiry | Verify cert-manager certificates: `kubectl get certificates -n azure-iot-operations` |
| Key Vault secrets | Audit Azure Key Vault for unused or expiring secrets |
| Resource utilization | Review CPU/memory trends in Grafana for capacity planning |
| Log review | Query Log Analytics for error patterns and warnings |
| Backup | Take a snapshot of the AIO instance configuration |

### Monthly checks

| Check | Action |
|---|---|
| Version check | `az iot ops get-versions`. Check for available updates |
| Security patches | Review and plan upgrades for security fixes |
| Azure Arc agents | `az connectedk8s show`. Check agent version, manually upgrade if needed |
| RBAC audit | Review role assignments on resource group and Key Vault |
| Storage account | Verify [schema registry](../connect-to-cloud/concept-schema-registry.md) storage health and access policies |

### Offline operation

Azure IoT Operations can operate offline for a **maximum of 72 hours**. During offline periods:

- The [MQTT broker](../manage-mqtt-broker/overview-broker.md) continues to accept and route messages locally
- [Data flows](../connect-to-cloud/overview-dataflow.md) buffer messages for later delivery
- Ensure sufficient disk space is allocated for offline caching
- Arc connectivity automatically restores when network is available

## Upgrading Azure IoT Operations

### Upgrade rules

| Scenario | Supported |
|---|---|
| Patch upgrade (for example, 1.2.x → 1.2.y) | ✅ Yes |
| Minor upgrade (for example, 1.1.x → 1.2.x) | ✅ Yes |
| Downgrade | ❌ No (uninstall + reinstall required) |
| Preview → GA | ❌ No (uninstall + reinstall required) |
| GA → Preview | ❌ No (see preview upgrade section) |

> [!IMPORTANT]
> Azure IoT Operations does **not** support live upgrades. Expect some downtime during the upgrade process.

### Pre-upgrade checklist

- [ ] Take a configuration snapshot: `az iot ops clone --name <INSTANCE> -g <RG>`
- [ ] Review release notes for the target version
- [ ] Verify CLI extension compatibility: `az iot ops get-versions`
- [ ] Test the upgrade on a staging cluster first (if available)
- [ ] Ensure [MQTT broker](../manage-mqtt-broker/overview-broker.md) backend redundancy factor ≥ 2 (required for rolling updates)
- [ ] Notify stakeholders of planned downtime window

### Perform the upgrade

#### Via Azure portal

1. Navigate to your Azure IoT Operations instance in the Azure portal
2. Select **Upgrade** on the **Overview** page (visible only when update is available)
3. Copy and run the generated CLI command

#### Via Azure CLI

```bash
# Step 1: Update CLI extension to target version
az extension add --upgrade --name azure-iot-ops
# Or specific version:
az extension add --upgrade --name azure-iot-ops --version <VERSION_NUMBER>

# Step 2: Run upgrade
az iot ops upgrade --resource-group <RG> --name <INSTANCE_NAME>

# Step 3: Confirm when prompted (review component table)
```

### MQTT broker rolling update behavior

The health manager pod coordinates rolling updates:

- Active client connections remain uninterrupted
- In-flight messages are preserved
- Data stored on disk is migrated between versions
- If a failure occurs, the health manager automatically restarts the process
- **Requires**: Backend redundancy factor ≥ 2

### Post-upgrade validation

```bash
# Verify the upgrade
az iot ops check
az iot ops show --name <INSTANCE_NAME> --resource-group <RG>

# Check version on Extensions page in Azure portal
# Verify all pods are running
kubectl get pods -n azure-iot-operations

# Test data flow end-to-end
```

### Upgrade to preview version

Preview versions require uninstall + reinstall:

```bash
# Uninstall existing
az iot ops delete --name <INSTANCE_NAME> --resource-group <RG>

# Install preview CLI extension
az extension add --upgrade --name azure-iot-ops --allow-preview

# Redeploy (follow Day 0 manual deployment steps)
```

## Secrets and certificate management

### Secrets architecture

```
Azure Key Vault (cloud)
        ↓ Secret Store Extension (sync)
Kubernetes Secrets (edge)
        ↓
Connectors / Data Flows (consumption)
```

> Azure IoT Operations works with **only one** Azure Key Vault per instance.

### Managing secrets

#### Add new secrets

Use the operations experience UI at [iotoperations.azure.com](https://iotoperations.azure.com):

1. Navigate to **Device inbound endpoints** or **[Data flow endpoints](../connect-to-cloud/howto-configure-dataflow-endpoint.md)**
2. Select **Add reference** → **Create a new secret** or **Add from Azure Key Vault**
3. Name the synchronized secret (this name becomes the Kubernetes secret name)

#### Add secrets via CLI

```bash
# Add a PEM certificate
az keyvault secret set \
  --vault-name <VAULT_NAME> \
  --name client-cert-pem \
  --file ./client-cert.pem \
  --encoding hex \
  --content-type 'application/x-pem-file'

# Add a DER certificate
az keyvault secret set \
  --vault-name <VAULT_NAME> \
  --name cert-file-der \
  --file ./cert-file.der \
  --encoding hex \
  --content-type 'application/pkix-cert'
```

#### Rotate secrets

1. Update the secret value in Azure Key Vault
2. The [Secret Store extension](./howto-enable-secure-settings.md) automatically syncs the new version to the cluster
3. **Known issue**: Connectors may not detect credential updates until restarted. Restart the affected connector pod if needed.

> [!WARNING]
> Do not directly edit `SecretProviderClass` or `SecretSync` custom resources in Kubernetes. Always use the operations experience web UI or CLI.

### Certificate lifecycle

#### Internal certificates (TLS between components)

- Managed by [**cert-manager**](../secure-iot-ops/howto-manage-certificates.md), which handles automatic rotation
- Default self-signed CA: `CN=Azure IoT Operations Quickstart Root CA - Not for Production`
- Root CA stored in secret: `azure-iot-operations-aio-ca-certificate` (namespace: `cert-manager`)
- Trust bundle in ConfigMap: `azure-iot-operations-aio-ca-trust-bundle` (namespace: `azure-iot-operations`)

#### Check certificate status

```bash
# List all certificates
kubectl get certificates -n azure-iot-operations

# Inspect the root CA
kubectl get configmap azure-iot-operations-aio-ca-trust-bundle \
  -n azure-iot-operations \
  -o "jsonpath={.data['ca\.crt']}" | openssl x509 -text -noout

# Check cert-manager issuer status
kubectl get clusterissuer azure-iot-operations-aio-certificate-issuer -o yaml
```

#### External certificates (OPC UA, external MQTT)

- Stored as **secrets** in Azure Key Vault (not as certificate resources)
- Synced to cluster via Secret Store extension
- Managed via operations experience UI → **Devices** → **Manage certificates and secrets**
- For custom self-signed or enterprise grade OPC UA application instance certificates, see [Configure OPC UA certificates infrastructure](../discover-manage-assets/howto-configure-opc-ua-certificates-infrastructure.md)
- After updating certificates, [verify connector pods](../discover-manage-assets/howto-configure-opc-ua-certificates-infrastructure.md#verify-connector-configuration-after-certificate-changes) reload the new configuration

### Key Vault permissions

Ensure users have **Key Vault Secrets Officer** role:

```bash
az role assignment create \
  --role "Key Vault Secrets Officer" \
  --assignee <USER_OR_SP_OBJECT_ID> \
  --scope $(az keyvault show --name <VAULT_NAME> --query id -o tsv)
```

## MQTT Broker Operations

### View broker configuration

```bash
# List broker resources
kubectl get broker -n azure-iot-operations
kubectl get brokerlistener -n azure-iot-operations
kubectl get brokerauthentication -n azure-iot-operations
kubectl get brokerauthorization -n azure-iot-operations
```

### Modify broker listeners

Edit [`BrokerListener`](../manage-mqtt-broker/howto-configure-brokerlistener.md) resources to:

> [!WARNING]
> Do not modify the default broker listener on port 18883. It is used for internal Azure IoT Operations communication. Create new `BrokerListener` resources for external client access instead.

- Change TLS configuration
- Add/remove ports
- Change service type (ClusterIP, NodePort, LoadBalancer)

```bash
kubectl edit brokerlistener <LISTENER_NAME> -n azure-iot-operations
```

### Modify authentication

```bash
kubectl edit brokerauthentication <AUTH_NAME> -n azure-iot-operations
```

Supported [authentication](../manage-mqtt-broker/howto-configure-authentication.md) methods:
- **X.509 certificates**: Best for machine-to-machine
- **Kubernetes SAT**: Best for in-cluster workloads
- **Custom**: External identity providers

### Modify authorization

```bash
kubectl edit brokerauthorization <AUTHZ_NAME> -n azure-iot-operations
```

[Authorization](../manage-mqtt-broker/howto-configure-authorization.md) policies map clients → allowed topic patterns with attribute-based access control (ABAC).

### Broker diagnostics

Configure broker self-check and [diagnostics](../manage-mqtt-broker/howto-broker-diagnostics.md):

- Enable self-check probes for connection health
- Configure metrics export intervals
- Set log levels for troubleshooting

### Data persistence

Data persistence allows the MQTT broker to survive pod restarts and preserve messages. Persistence settings are partially configurable at runtime:

- **Deployment-time settings** (immutable): Enable/disable persistence, maximum storage size, storage class. These settings require uninstall and redeploy to change.
- **Runtime-configurable settings**: Which data types are persisted (retained messages, subscriber queues, state store data) and which specific topics/clients/keys are included.

> [!WARNING]
> Once persistence is enabled at deployment, it **can't be disabled** without uninstalling and redeploying Azure IoT Operations.

#### Manage persistence at runtime

```bash
# Update retained message persistence
az iot ops broker persist update --persist-mode retain=All \
  --resource-group <RG> --instance <INSTANCE> --name <BROKER_NAME>

# Update subscriber queue persistence (custom, specific client IDs)
az iot ops broker persist update --persist-mode subscriberQueue=Custom \
  --subscriber-client-ids "client1" "client2" \
  --resource-group <RG> --instance <INSTANCE> --name <BROKER_NAME>

# Update state store persistence
az iot ops broker persist update --persist-mode stateStore=All \
  --resource-group <RG> --instance <INSTANCE> --name <BROKER_NAME>
```

> [!NOTE]
> The state store is **in-memory only** by default. All contents are lost on cluster restart unless persistence is explicitly enabled.

### Testing broker connectivity

Three approaches (development/test environments):

**Option 1: In-cluster MQTT client**
```bash
kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/quickstarts/mqtt-client.yaml
kubectl exec --stdin --tty mqtt-client -n azure-iot-operations -- sh

# Subscribe
mosquitto_sub --host aio-broker --port 18883 \
  --topic "azure-iot-operations/data/#" -v \
  --cafile /var/run/certs/ca.crt \
  -D CONNECT authentication-method 'K8S-SAT' \
  -D CONNECT authentication-data $(cat /var/run/secrets/tokens/broker-sat)
```

**Option 2: NodePort service**: Access from any MQTT client via node IP + port

**Option 3: LoadBalancer service**: Access via external IP on port 1883

**Recommended tools**:
- **mqttui**: CLI tool for subscribing, publishing, and monitoring
- **MQTT Explorer**: GUI tool for browsing topics and messages

## Asset and device management

### Operations Experience web UI

Access at: [https://iotoperations.azure.com](https://iotoperations.azure.com)

Requirements:
- Microsoft Entra ID account with Contributor permissions on the resource group
- Must sign in with the same tenant as your Azure resources

### Manage devices and assets via CLI

```bash
# List devices in a namespace
az iot ops ns device list --instance <INSTANCE> -g <RG>

# List assets in a namespace
az iot ops ns asset list --instance <INSTANCE> -g <RG>

# Create a device
az iot ops ns device create --instance <INSTANCE> -g <RG> --name <DEVICE_NAME>

# Create an asset
az iot ops ns asset create --instance <INSTANCE> -g <RG> --name <ASSET_NAME>
```

### Migrate legacy assets

If you have root-level [assets](../discover-manage-assets/concept-assets-devices.md) (classic) from older versions:

```bash
# Take a snapshot first!
az iot ops clone --name <INSTANCE> -g <RG>

# Migrate all assets
az iot ops migrate-assets -n <INSTANCE> -g <RG>

# Migrate specific assets (glob patterns supported)
az iot ops migrate-assets -n <INSTANCE> -g <RG> --pattern asset-pl-* asset-eng?-01
```

> Requires AIO instance version 1.2.36 or later.

### Azure Device Registry

View devices, assets, [schema registries](../connect-to-cloud/concept-schema-registry.md), and namespaces in the Azure portal:

1. Search for **Azure Device Registry** in the Azure portal
2. Browse **Assets**, **Schema registries**, and **Namespaces** tabs
3. Filter by namespace, resource group, or subscription

### OPC UA connector Operations

#### Check connector status

```bash
kubectl get pods -n azure-iot-operations | grep opc
kubectl logs <OPC-UA-CONNECTOR-POD> -n azure-iot-operations
```

#### Manage OPC UA certificates

```bash
# Manage trust list
az iot ops connector opcua trust ...

# Manage issuer list
az iot ops connector opcua issuer ...

# Register a custom application instance certificate
az iot ops connector opcua client add ...
```

For detailed certificate configuration including custom self-signed certificates and PKI security validation settings, see [Configure OPC UA certificates infrastructure](../discover-manage-assets/howto-configure-opc-ua-certificates-infrastructure.md).

### Enable/disable connectors

```bash
# Enable connectors (for example, ONVIF)
az iot ops update --name <INSTANCE> -g <RG> --feature connectors.settings.preview=Enabled

# Disable connectors
az iot ops update --name <INSTANCE> -g <RG> --feature connectors.settings.preview=Disabled
```

## Data Flow Operations

### View data flows

```bash
# List data flows via kubectl
kubectl get dataflows -n azure-iot-operations
kubectl get dataflowprofiles -n azure-iot-operations
kubectl get dataflowendpoints -n azure-iot-operations
```

> [!NOTE]
> Data flow resources created via Kubernetes aren't visible in the [operations experience](../discover-manage-assets/howto-use-operations-experience.md) web UI (known limitation).

#### Via Azure CLI

```bash
# View data flow profile
az iot ops dataflow profile show --resource-group <RG> --instance <INSTANCE> --name default

# View a specific data flow
az iot ops dataflow show --resource-group <RG> --instance <INSTANCE> --name <FLOW_NAME> --profile <PROFILE>

# Export data flow configuration
az iot ops dataflow show --resource-group <RG> --instance <INSTANCE> --name <FLOW_NAME> --profile <PROFILE> --output json > my-dataflow.json
```

### Scale data flows

Adjust [data flow profile](../connect-to-cloud/howto-configure-dataflow-profile.md) instance counts for throughput and high availability:

- Group related flows into profiles
- Scale each profile independently
- Monitor throughput and adjust as needed

```bash
# Scale a data flow profile (set instance count)
az iot ops dataflow profile update --resource-group <RG> --instance <INSTANCE> --name <PROFILE> --profile-instances <COUNT>

# Set log level for troubleshooting
az iot ops dataflow profile update --resource-group <RG> --instance <INSTANCE> --name <PROFILE> --log-level debug
```

### Data Flow best practices

- Use **SAT authentication** for [MQTT broker](../manage-mqtt-broker/overview-broker.md) connections (default)
- Use **user-assigned managed identity** for cloud endpoint authentication
- Keep data flows per profile under **70** (hard limit)
- Use multiple profiles to distribute flows beyond the limit
- Monitor for `AllBrokersDown` errors, which indicate source misconfiguration
- **Data flow profile assignment is immutable**. You can't reassign a data flow to a different profile after creation. Delete and recreate the data flow if you need to change its profile.
- Every data flow **must include the local MQTT broker** default endpoint (`aio-broker`) as either its source or its destination

### Supported data flow graph endpoints

| Endpoint Type | Source | Destination |
|---|---|---|
| MQTT | ✅ | ✅ |
| Kafka | ✅ | ✅ |
| OpenTelemetry | ❌ | ✅ |
| Data Lake / Fabric / ADX / Local Storage | ❌ | ❌ (not in graph mode) |

## Troubleshooting guide

### Using health status for troubleshooting

When a component reports **Degraded** or **Unavailable** health status, use the following approach:

1. **Identify the issue**: Open the [operations experience](../discover-manage-assets/howto-use-operations-experience.md) web UI or Azure portal and look for components that aren't Available (🟢)
2. **Check the reason code**: Each unhealthy resource includes a reason code (for example, `DataflowMqttSourceConnectionFailed`, `BrokerReplicaFailed`, `OpcUaConnectorInboundEndpointDisconnected`) and a human-readable message explaining the problem
3. **Look up the recommended action**: Check the health status reason codes for detailed descriptions and recommended actions for every reason code
4. **Check timestamps**: The `lastTransitionTime` shows when the issue started; `lastUpdateTime` shows the most recent status update
5. **Investigate further**: Use `az iot ops check`, pod logs, and the Grafana dashboard metrics to correlate the health status with runtime behavior

> [!TIP]
> If a resource shows **Unknown** (⚪), it hasn't reported status in the last 15 minutes. Check that the component pods are running and that K8s Bridge is syncing status to ARM.

### Deployment issues

#### UnauthorizedNamespaceError
**Symptom**: Deployment fails with `UnauthorizedNamespaceError`
**Cause**: Microsoft.ExtendedLocation resource provider doesn't have the required permissions
**Fix**: Enable custom locations feature with the correct Object ID (OID)

#### MissingResourceVersionOnHost
**Symptom**: Deployment fails with version mismatch
**Cause**: Custom location has wrong API version from prior deployments
**Fix**: Delete provisioned resources from prior deployments. Wait a few minutes before redeploying. Custom location name must be ≤ 63 characters.

#### LinkedAuthorizationFailed
**Symptom**: Deployment fails with authorization error
**Cause**: Logged-in principal lacks `Microsoft.Authorization/roleAssignments/write`
**Fix**: Grant the permission on the target resource group

#### MQTT Broker deployment fails

**Symptom**: Broker pods fail to start
**Cause**: Insufficient cluster resources for the configured [cardinality and memory profile](../manage-mqtt-broker/howto-configure-availability-scale.md)
**Fix**: Reduce replica count, workers, partitions, or memory profile to fit available cluster resources. Backend redundancy factor should remain at **2 or greater** for high availability.

### Secret and certificate issues

#### SecretNotFound error

**Symptom**: AIO tries to sync a secret that doesn't exist in Key Vault
**Fix**: Add the secret to Azure Key Vault before creating resources that reference it

#### Permission errors for secrets/Certificates

**Symptom**: Can't access secrets or certificates
**Fix**: Grant **Key Vault Secrets Officer** role at the resource level:
```bash
az role assignment create \
  --role "Key Vault Secrets Officer" \
  --assignee <PRINCIPAL_ID> \
  --scope $(az keyvault show --name <VAULT> --query id -o tsv)
```

#### Connector doesn't detect updated credentials

**Symptom**: Connector uses old credentials after Key Vault update
**Workaround**: Restart the connector pod:
```bash
kubectl delete pod <CONNECTOR_POD> -n azure-iot-operations
```

> [!TIP]
> For OPC UA certificate or PKI security setting changes, see the detailed [verification and restart steps](../discover-manage-assets/howto-configure-opc-ua-certificates-infrastructure.md#verify-connector-configuration-after-certificate-changes).

### OPC UA issues

#### BadSecurityModeRejected
**Symptom**: [OPC UA connector](../discover-manage-assets/overview-opc-ua-connector.md) can't connect to server
**Cause**: Server has no security endpoints matching the connector's settings
**Fix Option 1**: Set device configuration:
```yaml
securityMode: none
securityPolicy: http://opcfoundation.org/UA/SecurityPolicy#None
```
**Fix Option 2** (recommended): Add a secure endpoint to the OPC UA server with mutual certificate trust

#### Data spike every 2.5 hours

**Symptom**: CPU and memory spike every 2.5 hours with non-Microsoft OPC UA simulators
**Impact**: No data loss, but increased data volume
**Note**: The OPC PLC simulator from Microsoft doesn't exhibit this issue

#### OPC PLC simulator not sending data

**Symptom**: No data after creating device
**Workaround**: Update device inbound endpoint to autoaccept untrusted certificates:
```bash
az iot ops ns device endpoint inbound add opcua \
  --auto-accept-untrusted-server-certs true ...
```
> [!CAUTION]
> Do not use auto-accept in production.

### MQTT Broker issues

#### Broker resources not visible in portal

**Cause**: Resources created via Kubernetes aren't synced to cloud
**Status**: Known limitation. Resource sync from edge to cloud isn't supported yet.

### Data Flow issues

#### "Global error: allBrokersDown"

**Symptom**: [Data flow](../connect-to-cloud/overview-dataflow.md) reports error after 4-5 minutes of no messages
**Fix**: Verify data flow source configuration. Check that the MQTT topic name is correct and the broker is publishing messages.

#### Data Flow resources not visible in UI

**Cause**: Resources created via Kubernetes aren't visible in operations experience
**Status**: Known limitation. Resource sync not supported.

#### Profile exceeds 70 data Flows

**Symptom**: Deployment fails with `exec /bin/main: argument list too long`
**Fix**: Create multiple data flow profiles and distribute flows across them

### Operations Experience access issues

**Symptoms**:
- "A problem occurred getting unassigned instances"
- "The request isn't authorized"
- "Code: PermissionDenied"

**Resolution**:
1. Sign in to Azure portal with the same tenant
2. Create a new Microsoft Entra ID user if needed
3. Assign the user as **Contributor** on the resource group via Access Control (IAM)
4. Sign in at [iotoperations.azure.com](https://iotoperations.azure.com) with the new user

### Uninstall issues

#### Namespace stuck in "Terminating"

**Cause**: Finalizers on AIO resources block deletion
**Fix**: Always use `az iot ops delete`. Never force-delete the namespace.

#### Orphaned cluster-Scoped resources

**Cause**: Force-deleting the namespace leaves behind ClusterRoles, ClusterRoleBindings, webhooks
**Fix**: Always use `az iot ops delete`

#### "Instance must be deleted first"

**Cause**: Validation blocks direct Arc extension deletion
**Fix**: Use `az iot ops delete` to properly remove the instance first

### Device discovery issues

#### Akri discovery not working

**Fix**: Enable resource sync rules:
```bash
az iot ops enable-rsync -n <INSTANCE> -g <RG>

# If user lacks permission to look up K8 Bridge SP OID:
K8_BRIDGE_OID=$(az ad sp list --display-name "K8 Bridge" --query "[0].appId" -o tsv)
az iot ops enable-rsync -n <INSTANCE> -g <RG> --k8-bridge-sp-oid $K8_BRIDGE_OID
```

## Scaling and performance tuning

### MQTT Broker scaling

Cardinality settings are configured **at deployment time only** and can't be changed on a running instance. To adjust these settings, you must uninstall and redeploy Azure IoT Operations. Plan your broker sizing carefully during [Day 0 deployment](./operational-manual-day0-deployment.md#choose-your-cluster-topology).

For measured baseline resource consumption at each memory profile level, see [Baseline resource profiles](./concept-resource-profiles.md).

| Setting | Effect |
|---|---|
| **frontendReplicas** | Number of frontend pods handling connections |
| **frontendWorkers** | Worker threads per frontend pod |
| **backendPartitions** | Data partitions across backend pods |
| **backendWorkers** | Worker threads per backend pod |
| **backendRedundancyFactor** | Replication factor (min 2 for HA) |
| **memoryProfile** | Low / Medium / High. Controls memory allocation |

> [!TIP]
> Test MQTT broker configuration before production to ensure it handles the expected message load.

#### Memory profile limits

The following per-pod memory figures are **idle baselines measured with near-zero traffic**. Actual consumption grows with message throughput and connected clients:

| Memory Profile | Max Message Size | Idle Frontend Memory (per pod) | Idle Backend Memory (per pod) |
|---|---|---|---|
| **Tiny** | 4 MB | ~29 MiB | ~41 MiB |
| **Low** | 16 MB | ~33 MiB | ~66 MiB |
| **Medium** | 64 MB | ~169 MiB | ~211 MiB |
| **High** | 256 MB | ~4.9 GiB | ~5.8 GiB |

> [!WARNING]
> The broker rejects messages when memory usage reaches 75% capacity. The memory profile controls the maximum message size. Messages exceeding the limit are rejected. Total broker memory depends on **both** the memory profile and the cardinality (more replicas and partitions mean more pods and more total memory).

### Data Flow scaling

- Increase **instance count** on [data flow profiles](../connect-to-cloud/howto-configure-dataflow-profile.md) for higher throughput
- Group related flows and scale profiles independently
- For Event Grid destinations: limited to ~100 msg/sec per flow
- For Event Hubs destinations: higher throughput supported

### Resource monitoring

```bash
# Node resource usage
kubectl top nodes

# Pod resource usage
kubectl top pods -n azure-iot-operations

# Persistent volume usage
kubectl get pv
kubectl describe pv <PV_NAME>
```

### Capacity planning guidelines

As a rule of thumb, an approximate throughput per backend partition is on the order of **5–6K messages per second** for QoS 1 with 8-KB payloads on 2-GHz base frequency CPU (~4-GHz turbo). Real-world performance depends on topic distribution, CPU characteristics, and payload sizes. For detailed benchmark data, see [MQTT Broker performance benchmarking](https://techcommunity.microsoft.com/blog/iotblog/azure-iot-operations-mqtt-broker-performance-benchmarking-on-throughput-and-late/4405528).

| Scenario | Hardware (per node) | MQTT Broker Config |
|---|---|---|
| Small (≤125 assets, ≤6,250 tags) | 4 vCPU, 16-GB RAM | 1/1/2/1/1, Low memory |
| Medium | 8 vCPU, 32-GB RAM | Adjust per load testing |
| Large (≤85 K assets, ≤50 K pts/sec) | 8 vCPU, 32-GB RAM × five nodes | 5/8/2/4/5, High memory |

## Configuration backups

### Clone an instance

Use ARM templates to create a snapshot of your AIO instance configuration:

```bash
# Clone instance (nested ARM template mode)
az iot ops clone --name <INSTANCE> -g <RG>

# Clone instance (linked ARM template mode)
az iot ops clone --name <INSTANCE> -g <RG> --mode linked
```

The clone captures:
- Instance configuration
- Asset and device definitions
- Connector configurations
- Data flow definitions

> [!NOTE]
> The `az iot ops clone` command requires a specific CLI extension version (`1.0.34 <= version < 1.2.0`). Check your version with `az extension show --name azure-iot-ops --query version`. Resource sync rules and user-created ConfigMaps are not captured by the clone. Reapply these manually on the target cluster.

### Backup strategy

| What | How | Frequency |
|---|---|---|
| AIO instance config | `az iot ops clone` | Before any change/upgrade |
| Azure Key Vault secrets | Key Vault soft-delete + purge protection | Continuous (built-in) |
| [Schema registry](../connect-to-cloud/concept-schema-registry.md) schemas | Azure Storage replication | Continuous (built-in) |
| Kubernetes resources | `kubectl get <resource> -o yaml > backup.yaml` | Weekly |
| Device/asset data points | Operations experience → Export (CSV) | After changes |
| Data flow configurations | Operations experience → Export (JSON) | After changes |
| Grafana dashboards | Export dashboard JSON | After changes |

### Deployment procedures

1. **Instance corruption**: Redeploy from cloned ARM template
2. **Accidental deletion**: Use `az iot ops clone` output to recreate
3. **Cluster failure**: Provision new cluster, Arc-enable, redeploy from ARM template
4. **Offline > 72 hours**: Data buffered locally may be lost; redeploy and resync

## Uninstall and redeployment

### Proper uninstall procedure

> [!IMPORTANT]
> Always use `az iot ops delete`. Never directly delete the namespace or resource group without uninstalling first.

```bash
# Uninstall Azure IoT Operations (keeps init prerequisites)
az iot ops delete --name <INSTANCE_NAME> --resource-group <RG>

# Uninstall including all dependencies (output of init)
az iot ops delete --name <INSTANCE_NAME> --resource-group <RG> --include-deps
```

The `delete` command removes:
- Azure IoT Operations instance
- Arc extensions
- Custom locations
- All configured resources (assets, broker, data flows)

### Redeployment

After `az iot ops delete` (without `--include-deps`), you can redeploy using `az iot ops create` without rerunning `init`. This approach enables a `create → delete → create` workflow.

### Clean up Azure resources

After uninstall, optionally remove:

```bash
# Delete the Kubernetes cluster
# (platform-specific: for example, stop K3s, delete AKS cluster)

# Delete the resource group (removes all Azure resources)
az group delete --name <RG> --yes
```

### Clean up observability resources

```bash
# Remove OTel collector
helm uninstall aio-observability --namespace azure-iot-operations

# Remove Prometheus config
kubectl delete configmap ama-metrics-prometheus-config -n kube-system

# Remove Azure Monitor extensions
az k8s-extension delete --name azuremonitor-metrics --cluster-name <CLUSTER> -g <RG> --cluster-type connectedClusters
az k8s-extension delete --name azuremonitor-containers --cluster-name <CLUSTER> -g <RG> --cluster-type connectedClusters
```

## Tools reference

### kubectl

```bash
# Configure for K3s
export KUBECONFIG=~/.kube/config

# Remote access via Arc proxy (requires a service account token)
az connectedk8s proxy --name <CLUSTER> -g <RG> --token <TOKEN>

# Key namespaces
kubectl get pods -n azure-iot-operations  # AIO components
kubectl get pods -n azure-arc              # Arc agents

# Common operations
kubectl get pods -n azure-iot-operations          # List pods
kubectl logs <POD> -n azure-iot-operations        # View logs
kubectl logs <POD> -n azure-iot-operations -f     # Stream logs
kubectl describe pod <POD> -n azure-iot-operations # Detailed info
kubectl get events -n azure-iot-operations --sort-by='.lastTimestamp' # Recent events
```

### k9s (Terminal UI)

Install: [https://k9scli.io/](https://k9scli.io/)

Key commands:
- `:ns`: Filter by namespace
- `d`: Describe resource
- `l`: View logs
- `Ctrl+a`: View custom resource types (devices, assets, brokers, dataflows, secrets)

### Azure IoT Operations CLI

```bash
# Instance management
az iot ops list                                    # List all instances
az iot ops show -n <NAME> -g <RG>                 # View instance details
az iot ops show -n <NAME> -g <RG> --tree          # Tree view
az iot ops update -n <NAME> -g <RG>               # Update instance
az iot ops upgrade -n <NAME> -g <RG>              # Upgrade version
az iot ops delete -n <NAME> -g <RG>               # Delete instance
az iot ops clone -n <NAME> -g <RG>                # Clone for DR

# Diagnostics
az iot ops check                                   # Health check
az iot ops check --detail-level 2                  # Verbose check
az iot ops support create-bundle                   # Diagnostic bundle
az iot ops get-versions                            # Available versions

# Asset management
az iot ops ns device list --instance <NAME> -g <RG>
az iot ops ns asset list --instance <NAME> -g <RG>
az iot ops migrate-assets -n <NAME> -g <RG>

# Secret sync
az iot ops secretsync enable ...

# Resource sync
az iot ops enable-rsync -n <NAME> -g <RG>

# Find custom location
az iot ops show -n <NAME> -g <RG> --query "extendedLocation.name" -o tsv
```

### MQTT debugging tools

| Tool | Type | Best For |
|---|---|---|
| **mosquitto_sub/pub** | CLI | Quick pub/sub testing |
| **mqttui** | CLI | Interactive topic browsing |
| **MQTT Explorer** | GUI | Visual topic tree exploration |

## Known issues

### MQTT Broker
- Resources created via Kubernetes aren't visible in the Azure portal (no edge-to-cloud sync)

### Connectors
- Connectors don't detect updated credentials in Key Vault until restarted
- [Akri](../discover-manage-assets/overview-akri.md) connectors only support artifact pull secrets authentication
- Can't use special characters (`#`, `%`, `&`) in OPC UA event names
- Secret names must be globally unique to avoid retrieval conflicts

### Data Flows
- Resources created via Kubernetes aren't visible in the [operations experience](../discover-manage-assets/howto-use-operations-experience.md) web UI
- A data flow profile can't exceed 70 data flows
- Data flow graphs only support MQTT, Kafka, and OpenTelemetry (destination-only) endpoints
- Can't reuse the same graph definition multiple times in a chained graph scenario

### General
- Azure IoT Operations doesn't support live upgrades (expect downtime)
- Maximum offline operation: 72 hours
- Custom location name maximum length: 63 characters
- Broker cardinality settings are immutable after deployment (uninstall + redeploy required to change)
- Persistence can't be disabled once enabled (uninstall + redeploy required)
- State store is in-memory by default. Contents are lost on cluster restart unless persistence is enabled.
- Data flow profile assignment is immutable. Delete and recreate required to change profile.

## Runbook: common operational procedures

### Procedure: Restart a component

```bash
# Identify the pod
kubectl get pods -n azure-iot-operations | grep <component>

# Delete the pod (Kubernetes will auto-recreate it)
kubectl delete pod <POD_NAME> -n azure-iot-operations

# Verify it comes back healthy
kubectl get pods -n azure-iot-operations -w
```

### Procedure: Investigate a failing pod

```bash
# Check pod status
kubectl describe pod <POD_NAME> -n azure-iot-operations

# View logs
kubectl logs <POD_NAME> -n azure-iot-operations

# View previous container logs (if crash-looping)
kubectl logs <POD_NAME> -n azure-iot-operations --previous

# Check events
kubectl get events -n azure-iot-operations --sort-by='.lastTimestamp' | grep <POD_NAME>
```

### Procedure: Collect diagnostics for support

```bash
# Create comprehensive support bundle
az iot ops support create-bundle

# Run health check with full detail
az iot ops check --detail-level 2

# Capture current state
az iot ops show -n <NAME> -g <RG> --tree
kubectl get pods -n azure-iot-operations -o wide
kubectl top pods -n azure-iot-operations
```

### Procedure: Rotate a secret

1. Update the secret in Azure Key Vault:
   ```bash
   az keyvault secret set --vault-name <VAULT> --name <SECRET_NAME> --value <NEW_VALUE>
   ```
2. Wait for Secret Store extension to sync (automatic)
3. Restart the consuming pod if the connector doesn't detect the change:
   ```bash
   kubectl delete pod <CONNECTOR_POD> -n azure-iot-operations
   ```

### Procedure: Add a new OPC UA server

1. Open [iotoperations.azure.com](https://iotoperations.azure.com)
2. Navigate to **Devices** → Create a new device with the OPC UA endpoint
3. Configure authentication (username/password or X.509)
4. Add [certificates](../discover-manage-assets/howto-configure-opc-ua-certificates-infrastructure.md) to the trust list via **Manage certificates and secrets**
5. Create assets with data points referencing the OPC UA node IDs
6. Verify data appears on MQTT broker topics

### Procedure: Add a new cloud data flow

1. Create a [data flow endpoint](../connect-to-cloud/howto-configure-dataflow-endpoint.md) for the target service (Event Hubs, Data Lake, Fabric, etc.)
2. Configure authentication using user-assigned managed identity
3. Create a data flow with source (MQTT topic), optional transformations, and destination endpoint
4. Assign the data flow to a [data flow profile](../connect-to-cloud/howto-configure-dataflow-profile.md)
5. Verify data arrives at the cloud destination

### Procedure: Handle expired Akri webhook certificate

**Symptom**: `akri error when updating or deleting instances` (expired webhook certificate)

```bash
kubectl delete pod -n azure-iot-operations aio-akri-webhook-0 --ignore-not-found
```

### Procedure: Recover from failed upgrade

1. Check the current state:
   ```bash
   az iot ops check
   kubectl get pods -n azure-iot-operations
   ```
2. If partially upgraded, try running the upgrade command again
3. If the upgrade is unrecoverable:
   ```bash
   # Restore from clone
   az iot ops delete -n <INSTANCE> -g <RG>
   # Redeploy from ARM template created by az iot ops clone
   ```

## Quick reference card

| Task | Command |
|---|---|
| **Health check** | `az iot ops check` |
| **Verbose check** | `az iot ops check --detail-level 2` |
| **Health status** | Operations experience UI or Azure portal → instance overview |
| **Reason codes** | Check health status reason codes in the operations experience UI or Azure portal |
| **Support bundle** | `az iot ops support create-bundle` |
| **View instance** | `az iot ops show -n <NAME> -g <RG> --tree` |
| **List pods** | `kubectl get pods -n azure-iot-operations` |
| **Pod logs** | `kubectl logs <POD> -n azure-iot-operations` |
| **Stream logs** | `kubectl logs <POD> -n azure-iot-operations -f` |
| **Events** | `kubectl get events -n azure-iot-operations --sort-by='.lastTimestamp'` |
| **Resource usage** | `kubectl top pods -n azure-iot-operations` |
| **Upgrade** | `az iot ops upgrade -g <RG> -n <NAME>` |
| **Clone (backup)** | `az iot ops clone -n <NAME> -g <RG>` |
| **Uninstall** | `az iot ops delete -n <NAME> -g <RG>` |
| **Check versions** | `az iot ops get-versions` |
| **Remote access** | `az connectedk8s proxy -n <CLUSTER> -g <RG>` |

## Next steps

- Review the [Day 0 deployment manual](./operational-manual-day0-deployment.md) if you need to deploy a new instance.
- For the latest known issues, see [Known issues](../troubleshoot/known-issues.md).
- For detailed troubleshooting, see [Troubleshoot Azure IoT Operations](../troubleshoot/troubleshoot.md).
- For troubleshooting tools, see [Tips and tools](../troubleshoot/tips-tools.md).
- Review [Baseline resource profiles](./concept-resource-profiles.md) for measured resource consumption at each memory profile level.
- For support information, see [Azure IoT Operations support](../overview-support.md).
