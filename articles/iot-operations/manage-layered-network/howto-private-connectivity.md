---
title: Add private connectivity to Azure IoT Operations
description: Configure private connectivity for an existing Azure IoT Operations deployment using Private Link, Arc Gateway, and Azure Firewall Explicit Proxy.
author: david-emakenemi
ms.author: demakenemi
ms.topic: how-to
ms.date: 08/26/2026

#CustomerIntent: As an operator with an existing Azure IoT Operations deployment, I want to add private connectivity so that no endpoints are exposed to the public internet.
ms.service: azure-iot-operations
---

# Add private connectivity to Azure IoT Operations

This article describes how to add private connectivity to an existing Azure IoT Operations deployment. Follow the sections in order:

| Step | Section | What it does |
|------|---------|-------------|
| 1 | [Set up Arc Gateway](#set-up-arc-gateway) | Create the Arc Gateway resource and retrieve the custom locations OID |
| 2 | [Allow the operations experience to access your resources](#allow-the-operations-experience-to-access-your-resources) | Allow-list the operations experience IP address in each resource firewall before you restrict access |
| 3 | [Create private endpoints and DNS zones](#create-private-endpoints-and-dns-zones) | Create private endpoints and DNS zones for Azure Storage, Azure Key Vault, and Azure Event Grid |
| 4 | [Update Azure Arc connectivity](#update-arc-connectivity) | Update the existing Arc connection with Arc gateway. Choose between **Arc gateway only** or **Arc gateway + explicit proxy** |
| 5 | [Configure data flow destinations with private endpoints](#configure-data-flow-destinations-with-private-endpoints) | Route data flow traffic to cloud destinations like Event Grid through Azure Private Link |

These scenarios apply to environments with a single Arc-enabled Kubernetes cluster. There's no Purdue-style network segmentation, no proxy chaining across layers, and no Envoy deployment. If you have a layered network topology, see [Tutorial: Deploy Azure IoT Operations in a layered network with private connectivity](../end-to-end-tutorials/tutorial-layered-network-private-connectivity.md) instead.

## Prerequisites

- An existing [Azure IoT Operations](/azure/iot-operations/deploy-iot-ops/overview-deploy) deployment on an Arc-connected Kubernetes cluster. The cluster must be healthy with all Azure IoT Operations pods running.
- An [Azure subscription](/azure/cost-management-billing/manage/create-subscription) with sufficient permissions to create private endpoints, private DNS zones, and role assignments (typically **Owner** or **Contributor** + **User Access Administrator**).
- [Azure CLI](/cli/azure/install-azure-cli) and [kubectl](https://kubernetes.io/docs/tasks/tools/) installed on your admin or jump machine.
- An Azure VNet with network connectivity from your cluster. If your cluster runs on Azure VMs within the same VNet or a peered VNet, this connectivity is already in place.
- (Optional) An [Azure Event Grid namespace](/azure/event-grid/create-view-manage-namespaces) with MQTT enabled. Needed only if you route data flow traffic to Event Grid in [Configure data flow destinations with private endpoints](#configure-data-flow-destinations-with-private-endpoints).
- (Optional) An [Azure Firewall](/azure/firewall/overview) with [explicit proxy](/azure/azure-arc/azure-firewall-explicit-proxy) enabled in your VNet, reachable from your cluster. Required only if you follow the **Arc Gateway + Explicit Proxy** tab for fully private connectivity with no public internet exposure.

[!INCLUDE [set-environment-variables](../includes/set-environment-variables.md)]

This article also uses environment variables for the network and Azure resources that you choose, including `VNET_RESOURCE_GROUP`, `VNET_NAME`, `SUBNET_NAME`, `STORAGE_ACCOUNT_NAME`, `KEY_VAULT_NAME`, `EVENT_GRID_NAMESPACE`, `ARC_GATEWAY_RESOURCE_ID`, `CUSTOM_LOCATIONS_OID`, `FIREWALL_POLICY_NAME`, `CLUSTER_SUBNET_CIDRS`, `FIREWALL_PRIVATE_IP`, `PROXY_PORT`, `TOPIC_SPACE_NAME`, `AIO_IDENTITY_PRINCIPAL_ID`, `DATAFLOW_NAME`, `CONFIG_FILE`, and `CLUSTER_HOST_IP`. Set each one before you run the related commands.

## Set up Arc Gateway

[Azure Arc Gateway](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking) consolidates the ~200+ Azure endpoints that Arc agents and extensions require into a single gateway URL. This significantly simplifies your firewall allow list, instead of allowing 200+ individual FQDNs, you allow approximately 9.

### Step 1: Create an Arc Gateway resource

If you don't already have an Arc Gateway resource, create one. You need the gateway resource ID when you connect the cluster in the next section. For creation steps, see [Create the Arc Gateway resource](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking#create-the-arc-gateway-resource).

:::image type="content" source="media/howto-private-connectivity/arc-gateway-portal.png" alt-text="Screenshot of the Azure portal showing an Arc Gateway resource with its Gateway URL and resource properties.":::

> [!NOTE]
> You can have up to five Arc Gateway resources per subscription.

For the list of FQDNs that you must allow through your firewall when using Arc Gateway, see [Allowed endpoints with Arc Gateway](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking#allowed-endpoints-with-arc-gateway).

### Step 2: Retrieve the custom locations Object ID

The `--custom-locations-oid` parameter you use when connecting the cluster requires the Object ID (OID) of the Azure Arc Custom Locations service principal.

To find it:

# [Azure portal](#tab/portal-oid)

1. Go to **[Microsoft Entra ID](https://entra.microsoft.com)** in the Azure portal.
1. Select **Enterprise applications**.
1. Search for **Azure Arc Kubernetes Custom Locations**.
1. Open the application, go to **Properties**, and copy the **Object ID**.

# [Azure CLI](#tab/cli-oid)

```azurecli
az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv
```

> [!IMPORTANT]
> Don't replace the `--id` value. The GUID `bc313c14-388c-4e7d-a58e-70017303ee3b` is the predefined App ID for the Custom Locations service principal.

---

## Allow the operations experience to access your resources

Before you restrict access to your resources with private endpoints, allow the [Azure IoT Operations operations experience](https://iotoperations.azure.com) web UI to reach Azure Key Vault, Azure Storage, and Schema Registry. The operations experience accesses these resources on your behalf:

- **Azure Key Vault** to manage secrets.
- **Azure Storage and Schema Registry** to read and write message schemas in the storage account that backs your schema registry.

When you configure these resources to use a private endpoint and firewall, the operations experience can no longer reach them over the public internet. This configuration causes errors when you manage secrets or schemas in the web UI. To keep the operations experience working, set each resource's firewall to **Public access: Selected networks and IP addresses** and add the operations experience IP addresses to the resource's firewall allow list.

The operations experience IP addresses are allocated by region:

| Operations experience region | IP address |
|------------------------------|------------|
| East US | `48.211.120.64` |
| North Europe | `72.145.25.40` |
| West Central US | `128.24.193.24` |
| West Europe | `72.145.132.248` |
| West US 3 | `57.154.126.80` |

> [!NOTE]
> An operations experience request typically comes from the same region as your instance, but it can come from any region. Allow all of the listed IP addresses for each resource that the operations experience uses.

> [!NOTE]
> A Network Security Perimeter or a centrally enforced tenant network policy can override a resource's firewall settings. If your organization applies either control, add the same Data Orchestrator Engine IP exceptions (the operations experience IP addresses in the preceding table) to that policy. Otherwise, access can remain blocked even when the resource firewall allow list is correct.

Configure the firewall allow list for each resource before you create its private endpoint. The following examples add all of the operations experience IP addresses.

### Azure Key Vault

# [Azure portal](#tab/portal-keyvault)

1. In the Azure portal, go to your key vault and select **Networking**.
1. On the **Firewalls and virtual networks** tab, select **Selected networks** so that public access is set to **Selected networks and IP addresses**.
1. Under **Firewall**, add all of the operations experience IP addresses from the preceding table.
1. Select **Apply** to save your changes.

# [Azure CLI](#tab/cli-keyvault)

```azurecli
az keyvault update \
  --resource-group $RESOURCE_GROUP \
  --name $KEY_VAULT_NAME \
  --default-action Deny

DOE_IP_ADDRESSES=(48.211.120.64 72.145.25.40 128.24.193.24 72.145.132.248 57.154.126.80)

for DOE_IP_ADDRESS in "${DOE_IP_ADDRESSES[@]}"; do
  az keyvault network-rule add \
    --resource-group $RESOURCE_GROUP \
    --name $KEY_VAULT_NAME \
    --ip-address $DOE_IP_ADDRESS
done
```

---

### Azure Storage and Schema Registry

The schema registry is backed by an Azure Storage account. Apply the firewall configuration to that storage account so the operations experience can read and write schemas. Keep the trusted Azure services bypass enabled so the schema registry can continue to reach storage.

# [Azure portal](#tab/portal-schema-storage)

1. In the Azure portal, go to the storage account that backs your schema registry and select **Networking**.
1. Under **Public network access**, for **Public network access scope**, select **Enabled from selected networks**.
1. Under **IPv4 Addresses**, add all of the operations experience IP addresses from the preceding table.
1. Under **Exceptions**, make sure **Allow Azure services on the trusted services list to access this storage account** is selected.
1. Select **Save**.

# [Azure CLI](#tab/cli-schema-storage)

```azurecli
az storage account update \
  --resource-group $RESOURCE_GROUP \
  --name $STORAGE_ACCOUNT_NAME \
  --public-network-access Enabled \
  --default-action Deny \
  --bypass AzureServices

DOE_IP_ADDRESSES=(48.211.120.64 72.145.25.40 128.24.193.24 72.145.132.248 57.154.126.80)

for DOE_IP_ADDRESS in "${DOE_IP_ADDRESSES[@]}"; do
  az storage account network-rule add \
    --resource-group $RESOURCE_GROUP \
    --account-name $STORAGE_ACCOUNT_NAME \
    --ip-address $DOE_IP_ADDRESS
done
```

---

### Verify the operations experience can access your resources

After you enable the firewall restrictions, confirm that the operations experience can still reach the required resources:

1. Go to the [operations experience](https://iotoperations.azure.com) web UI and open your Azure IoT Operations instance.
1. Select **Secrets** and confirm that the operations experience loads the secrets stored in Azure Key Vault without a firewall or authorization error.
1. Select **Schemas** and confirm that the operations experience loads existing schemas and that you can create a schema. Success confirms access to the schema registry storage account.

If any page returns an access or firewall error, verify that you added all of the operations experience IP addresses to the resource's firewall allow list and that public access is set to **Selected networks and IP addresses**. For diagnostics when **Secrets** or **Schemas** returns an access or firewall error, see [The operations experience can't load or manage secrets or schemas after enabling private endpoints](howto-troubleshoot-private-connectivity.md#the-operations-experience-cant-load-or-manage-secrets-or-schemas-after-enabling-private-endpoints).

## Create private endpoints and DNS zones

Azure IoT Operations uses a storage account (schema registry) and Key Vault (secret sync) at runtime. Create private endpoints and DNS zones for these resources so all traffic routes privately. Once you link the private DNS zones to your VNet, your cluster automatically resolves these services to their private IPs.

### Step 1: Create private endpoints

Create private endpoints for the storage account, Key Vault, and Event Grid so all traffic to these services routes privately.

#### Azure Blob Storage

```azurecli
az network private-endpoint create \
  --name pe-storage-blob \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --subnet "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$VNET_RESOURCE_GROUP/providers/Microsoft.Network/virtualNetworks/$VNET_NAME/subnets/$SUBNET_NAME" \
  --private-connection-resource-id "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Storage/storageAccounts/$STORAGE_ACCOUNT_NAME" \
  --group-id blob \
  --connection-name pe-conn-storage-blob
```

#### Azure Key Vault

```azurecli
az network private-endpoint create \
  --name pe-keyvault \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --subnet "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$VNET_RESOURCE_GROUP/providers/Microsoft.Network/virtualNetworks/$VNET_NAME/subnets/$SUBNET_NAME" \
  --private-connection-resource-id "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$KEY_VAULT_NAME" \
  --group-id vault \
  --connection-name pe-conn-keyvault
```

> [!NOTE]
> You create the Event Grid private endpoint in this step so it's ready for [Configure data flow destinations with private endpoints](#configure-data-flow-destinations-with-private-endpoints), which routes data flow traffic to Event Grid over Private Link.

#### Event Grid namespace

```azurecli
az network private-endpoint create \
  --name pe-eventgrid \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --subnet "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$VNET_RESOURCE_GROUP/providers/Microsoft.Network/virtualNetworks/$VNET_NAME/subnets/$SUBNET_NAME" \
  --private-connection-resource-id "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.EventGrid/namespaces/$EVENT_GRID_NAMESPACE" \
  --group-id topicspace \
  --connection-name pe-conn-eventgrid
```

### Step 2: Configure Private DNS Zones

Create Private DNS Zones so Azure service FQDNs resolve to Private Endpoint IPs. Link each zone to your VNet and create DNS zone groups so the Private Endpoint A records are registered automatically.

#### Azure Blob Storage

```azurecli
az network private-dns zone create \
  --resource-group $RESOURCE_GROUP \
  --name privatelink.blob.core.windows.net

az network private-dns link vnet create \
  --resource-group $RESOURCE_GROUP \
  --zone-name privatelink.blob.core.windows.net \
  --name storage-dns-link \
  --virtual-network "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$VNET_RESOURCE_GROUP/providers/Microsoft.Network/virtualNetworks/$VNET_NAME" \
  --registration-enabled false

az network private-endpoint dns-zone-group create \
  --resource-group $RESOURCE_GROUP \
  --endpoint-name pe-storage-blob \
  --name storage-zone-group \
  --private-dns-zone "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Network/privateDnsZones/privatelink.blob.core.windows.net" \
  --zone-name blob
```

#### Azure Key Vault

```azurecli
az network private-dns zone create \
  --resource-group $RESOURCE_GROUP \
  --name privatelink.vaultcore.azure.net

az network private-dns link vnet create \
  --resource-group $RESOURCE_GROUP \
  --zone-name privatelink.vaultcore.azure.net \
  --name keyvault-dns-link \
  --virtual-network "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$VNET_RESOURCE_GROUP/providers/Microsoft.Network/virtualNetworks/$VNET_NAME" \
  --registration-enabled false

az network private-endpoint dns-zone-group create \
  --resource-group $RESOURCE_GROUP \
  --endpoint-name pe-keyvault \
  --name keyvault-zone-group \
  --private-dns-zone "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Network/privateDnsZones/privatelink.vaultcore.azure.net" \
  --zone-name vault
```

#### Event Grid

```azurecli
az network private-dns zone create \
  --resource-group $RESOURCE_GROUP \
  --name privatelink.ts.eventgrid.azure.net

az network private-dns link vnet create \
  --resource-group $RESOURCE_GROUP \
  --zone-name privatelink.ts.eventgrid.azure.net \
  --name eventgrid-dns-link \
  --virtual-network "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$VNET_RESOURCE_GROUP/providers/Microsoft.Network/virtualNetworks/$VNET_NAME" \
  --registration-enabled false

az network private-endpoint dns-zone-group create \
  --resource-group $RESOURCE_GROUP \
  --endpoint-name pe-eventgrid \
  --name eventgrid-zone-group \
  --private-dns-zone "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Network/privateDnsZones/privatelink.ts.eventgrid.azure.net" \
  --zone-name eventgrid
```

For the full list of private DNS zone names, see [Azure Private DNS Zone values](/azure/private-link/private-endpoint-dns).

## Update Arc connectivity

With private endpoints and DNS in place, update your existing Arc connection to use Arc gateway. Choose the tab that matches your connectivity approach:

- **Arc Gateway only** — The cluster connects through Arc Gateway with a simplified firewall allow list (~9 FQDNs), but outbound traffic still uses public internet paths.
- **Arc Gateway + Explicit Proxy** — All outbound traffic routes through [Azure Firewall Explicit Proxy](/azure/azure-arc/azure-firewall-explicit-proxy) over your private network with no public internet exposure.

Both tabs build on [Set up Arc Gateway](#set-up-arc-gateway). Complete that section first to create the Arc Gateway resource and retrieve the custom locations OID.

# [Arc Gateway only](#tab/arc-gateway-only)

### Step 1: Update the Arc connection with Arc gateway

Update your existing Arc connection to associate it with the Arc gateway:

```azurecli
az connectedk8s update \
  --name $CLUSTER_NAME \
  --resource-group $RESOURCE_GROUP \
  --gateway-resource-id $ARC_GATEWAY_RESOURCE_ID
```

> [!TIP]
> **For new clusters not yet Arc-enabled:** If your cluster isn't connected to Azure Arc yet, use `az connectedk8s connect` instead:
>
> ```azurecli
> az connectedk8s connect \
>   --name $CLUSTER_NAME \
>   --resource-group $RESOURCE_GROUP \
>   --location $LOCATION \
>   --custom-locations-oid $CUSTOM_LOCATIONS_OID \
>   --enable-oidc-issuer \
>   --enable-workload-identity \
>   --disable-auto-upgrade \
>   --gateway-resource-id $ARC_GATEWAY_RESOURCE_ID
> ```

### Step 2: Verify connectivity

1. Confirm the Arc agents and Arc Proxy pod are running:

   ```bash
   kubectl get pods -n azure-arc
   ```

1. Verify DNS resolves to private IPs:

   ```bash
   nslookup $STORAGE_ACCOUNT_NAME.blob.core.windows.net
   nslookup $KEY_VAULT_NAME.vault.azure.net
   nslookup $EVENT_GRID_NAMESPACE.ts.eventgrid.azure.net
   ```

   Each result should return an IP in your private address range (for example, `10.x.x.x`), not a public IP.

1. Verify the cluster appears as **Connected** in the Azure portal under **Azure Arc > Kubernetes clusters**.

If any FQDN resolves to a public IP, see [DNS resolves to a public IP instead of a private IP](howto-troubleshoot-private-connectivity.md#dns-resolves-to-a-public-ip-instead-of-a-private-ip).

# [Arc Gateway + Explicit Proxy](#tab/arc-gateway-proxy)

This tab covers fully private connectivity with no public internet exposure. It requires an Azure Firewall with explicit proxy enabled in your VNet, reachable from your cluster.

### Step 1: Create firewall application rules for Arc Gateway FQDNs

The Azure Firewall Explicit Proxy blocks all traffic that isn't explicitly allowed. You must add application rules for the approximately nine FQDNs that Arc Gateway requires. Without these rules, `az connectedk8s connect` and `az connectedk8s update` fail because the proxy blocks the Arc agent traffic.

Create a rule collection group and add application rules for the Arc Gateway FQDNs:

```azurecli
az network firewall policy rule-collection-group create \
  --name ArcRules \
  --policy-name $FIREWALL_POLICY_NAME \
  --resource-group $RESOURCE_GROUP \
  --priority 100

az network firewall policy rule-collection-group collection add-filter-collection \
  --rule-collection-group-name ArcRules \
  --policy-name $FIREWALL_POLICY_NAME \
  --resource-group $RESOURCE_GROUP \
  --name AllowArc \
  --collection-priority 100 \
  --action Allow \
  --rule-type ApplicationRule \
  --rule-name AllowArcEndpoints \
  --source-addresses "$CLUSTER_SUBNET_CIDRS" \
  --protocols Https=443 \
  --target-fqdns "*.gw.arc.azure.com" "management.azure.com" "*.his.arc.azure.com" "*.dp.kubernetesconfiguration.azure.com" "login.microsoftonline.com" "mcr.microsoft.com" "*.data.mcr.microsoft.com" "gbl.his.arc.azure.com" "*.login.microsoft.com"
```

Set `CLUSTER_SUBNET_CIDRS` to the CIDR range of your cluster subnet (for example, `10.0.0.0/24`). For the full list of required FQDNs, see [Allowed endpoints with Arc Gateway](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking#allowed-endpoints-with-arc-gateway).

### Step 2: Set proxy environment variables

On the machine where you run the `az connectedk8s connect` command, set the proxy environment variables to point to the Azure Firewall Explicit Proxy:

```bash
export HTTPS_PROXY=http://$FIREWALL_PRIVATE_IP:$PROXY_PORT
export HTTP_PROXY=http://$FIREWALL_PRIVATE_IP:$PROXY_PORT
export NO_PROXY=localhost,127.0.0.1,169.254.169.254,.svc,.local,$CLUSTER_SUBNET_CIDRS
```

> [!NOTE]
> The `HTTPS_PROXY` value uses an `http://` scheme because the proxy connection itself is HTTP. The HTTPS tunnel runs inside it. Both `HTTPS_PROXY` and `HTTP_PROXY` point to the Azure Firewall's private IP and explicit proxy port (for example, `http://10.254.0.68:8443`). Adjust `NO_PROXY` to include your cluster's internal CIDRs and any local domains that should bypass the proxy.

### Step 3: Update the Arc connection with Arc gateway and proxy

Update the existing Arc connection with both the Arc Gateway and the explicit proxy:

```azurecli
az connectedk8s update \
  --name $CLUSTER_NAME \
  --resource-group $RESOURCE_GROUP \
  --proxy-https $HTTPS_PROXY \
  --proxy-http $HTTP_PROXY \
  --proxy-skip-range $NO_PROXY \
  --gateway-resource-id $ARC_GATEWAY_RESOURCE_ID
```

This command configures all Arc traffic to route through the Azure Firewall Explicit Proxy and the Arc Gateway, consolidating more than 200 endpoints to about nine allowed FQDNs with no public internet exposure.

> [!IMPORTANT]
> Arc agent traffic, including extension installs and container image pulls from MCR (`mcr.microsoft.com`), routes through the proxy automatically because `az connectedk8s update` injects the proxy environment variables into the Arc agent pods. However, if your container runtime (containerd or CRI-O) pulls images outside of the Arc agent (for example, during node-level kubelet pulls), you might also need to configure proxy settings at the node level. On Ubuntu with systemd, create `/etc/systemd/system/containerd.service.d/http-proxy.conf` with your proxy values, then run `sudo systemctl daemon-reload && sudo systemctl restart containerd`.

> [!TIP]
> **For new clusters not yet Arc-enabled:** If your cluster isn't connected to Azure Arc yet, use `az connectedk8s connect` instead:
>
> ```azurecli
> az connectedk8s connect \
>   --name $CLUSTER_NAME \
>   --resource-group $RESOURCE_GROUP \
>   --location $LOCATION \
>   --custom-locations-oid $CUSTOM_LOCATIONS_OID \
>   --enable-oidc-issuer \
>   --enable-workload-identity \
>   --disable-auto-upgrade \
>   --proxy-https $HTTPS_PROXY \
>   --proxy-http $HTTP_PROXY \
>   --proxy-skip-range $NO_PROXY \
>   --gateway-resource-id $ARC_GATEWAY_RESOURCE_ID
> ```

### Step 4: Verify connectivity

1. Confirm the Arc Proxy pod is running:

   ```bash
   kubectl get pods -n azure-arc -l app.kubernetes.io/component=arc-proxy
   ```

1. Verify DNS resolves to private IPs:

   ```bash
   nslookup $STORAGE_ACCOUNT_NAME.blob.core.windows.net
   nslookup $KEY_VAULT_NAME.vault.azure.net
   nslookup $EVENT_GRID_NAMESPACE.ts.eventgrid.azure.net
   ```

   Each result should return an IP in your private address range, not a public IP.

1. Verify the cluster appears as **Connected** in the Azure portal under **Azure Arc > Kubernetes clusters**.

If any FQDN resolves to a public IP, see [DNS resolves to a public IP instead of a private IP](howto-troubleshoot-private-connectivity.md#dns-resolves-to-a-public-ip-instead-of-a-private-ip).

---

## Configure data flow destinations with private endpoints

Azure IoT Operations [data flows](/azure/iot-operations/connect-to-cloud/overview-dataflow) send telemetry to cloud destinations like Azure Event Grid, Azure Event Hubs, Azure Data Explorer, Data Lake Storage Gen2, and Microsoft Fabric OneLake. By default, data flows connect to these services over their public endpoints. To keep traffic private, create private endpoints for each destination and ensure DNS resolves to the private IPs.

> [!NOTE]
> If you created an Event Grid private endpoint and DNS zone in [Create private endpoints and DNS zones](#create-private-endpoints-and-dns-zones), Event Grid is already configured for private access. Skip ahead to [Step 2: Assign RBAC for Event Grid](#step-2-assign-rbac-for-event-grid) for that destination.

The following table shows supported data flow destinations and the private DNS zone, group ID, and port for each:

| Destination | Private DNS Zone | Group ID | Port |
|-------------|-----------------|----------|------|
| Azure Event Grid (MQTT) | `privatelink.ts.eventgrid.azure.net` | `topicspace` | 8883 |
| Azure Event Hubs | `privatelink.servicebus.windows.net` | `namespace` | 9093 (Kafka) |
| Azure Data Explorer | `privatelink.<region>.kusto.windows.net` | `cluster` | 443 |
| Data Lake Storage Gen2 | `privatelink.blob.core.windows.net` or `privatelink.dfs.core.windows.net` | `blob` or `dfs` | 443 |
| Microsoft Fabric OneLake | `privatelink.dfs.fabric.microsoft.com` | `onelake` | 443 |

> [!NOTE]
> - **Event Hubs** uses Kafka protocol port `9093` (not the standard AMQP port `5671`) because Azure IoT Operations data flow connects to Event Hubs via Kafka.
> - **Data Lake Storage Gen2** supports two group IDs: use `blob` for flat namespace access and `dfs` for hierarchical namespace (HNS-enabled) accounts. Choose the one that matches your storage account configuration.

The steps in the following section use **Azure Event Grid** as the example. The same pattern applies to every destination, substitute the values from the preceding table.

### Step 1: Create an Event Grid namespace

If you don't already have one, create an Event Grid namespace with MQTT (topic spaces) enabled:

```azurecli
az eventgrid namespace create \
  --name $EVENT_GRID_NAMESPACE \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --topic-spaces-configuration state=Enabled \
  --sku name=Standard capacity=1
```

Then create a topic space. For testing, you can use the wildcard `#` as the topic template:

```azurecli
az eventgrid namespace topic-space create \
  --name $TOPIC_SPACE_NAME \
  --resource-group $RESOURCE_GROUP \
  --namespace-name $EVENT_GRID_NAMESPACE \
  --topic-templates "#"
```

> [!NOTE]
> In the Event Grid namespace, set **Maximum client sessions per authentication name** to **3** or more so data flow can scale up. See [Event Grid MQTT multi-session support](/azure/event-grid/mqtt-establishing-multiple-sessions-per-client).

### Step 2: Assign RBAC for Event Grid

Grant the Azure IoT Operations managed identity the Event Grid role that matches your data flow direction:

- **One-way (source → Event Grid):** Assign `EventGrid TopicSpaces Publisher`.
- **One-way (Event Grid → destination):** Assign `EventGrid TopicSpaces Subscriber`.
- **Bidirectional bridge:** Assign both `EventGrid TopicSpaces Publisher` and `EventGrid TopicSpaces Subscriber`.

For a typical data flow that publishes telemetry to Event Grid:

```azurecli
az role assignment create \
  --assignee $AIO_IDENTITY_PRINCIPAL_ID \
  --role "EventGrid TopicSpaces Publisher" \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.EventGrid/namespaces/$EVENT_GRID_NAMESPACE"
```

> [!NOTE]
> If you create a bidirectional MQTT bridge (both source and destination use Event Grid), you need **both** Publisher and Subscriber roles. See [Tutorial: Configure MQTT bridge between Azure IoT Operations and Event Grid](/azure/iot-operations/connect-to-cloud/tutorial-mqtt-bridge) for an example.

> [!IMPORTANT]
> **Assign RBAC to the correct identity.** The data flow endpoint's authentication method determines which identity you must grant the Event Grid role to:
>
> - **System-assigned managed identity (default):** Assign the role to the **Azure IoT Operations Arc extension's** service principal. To find it, go to the Azure portal → your Arc-enabled cluster → **Extensions** → **azure-iot-operations** → **Properties**, and copy the **Principal ID**. Or use the CLI:
>
>   ```azurecli
>   az rest --method get \
>     --url "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Kubernetes/connectedClusters/$CLUSTER_NAME/extensions/azure-iot-operations?api-version=2024-11-01-preview" \
>     --query "identity.principalId" -o tsv
>   ```
>
> - **User-assigned managed identity:** Assign the role to that identity's principal ID.
>
> If you assign the role to the wrong identity (for example, a user-assigned managed identity used for SecretSync instead of the Azure IoT Operations extension's system-assigned managed identity), the dataflow receives a `NotAuthorized` error after CONNACK and enters a reconnect loop.

### Step 3: Disable public access on the Event Grid namespace

You already created the Event Grid private endpoint and DNS zone in [Create private endpoints and DNS zones](#create-private-endpoints-and-dns-zones). Now, disable public access:

```azurecli
az eventgrid namespace update \
  --name $EVENT_GRID_NAMESPACE \
  --resource-group $RESOURCE_GROUP \
  --public-network-access Disabled
```

Verify that public access is disabled:

```azurecli
az eventgrid namespace show --name $EVENT_GRID_NAMESPACE --resource-group $RESOURCE_GROUP --query "publicNetworkAccess"
```

### Step 4: Verify DNS resolves to a private IP

From your cluster node (or a VM in the same VNet), confirm the FQDN resolves to the private endpoint IP:

```bash
nslookup $EVENT_GRID_NAMESPACE.$LOCATION-1.ts.eventgrid.azure.net
```

The result should return an IP in your private address range (for example, `10.x.x.x`), not a public IP. If it returns a public IP, check your private DNS zone linkage.

### Step 5: Create the data flow endpoint for Event Grid

Create an Event Grid MQTT data flow endpoint. This action creates an endpoint that uses system-assigned managed identity authentication. The host uses the Event Grid namespace's MQTT hostname on port 8883. No special configuration is needed for Private Link - the data flow resolves the FQDN through DNS, which returns the private endpoint IP if your DNS zones are configured correctly.

# [Azure IoT Operations experience](#tab/doe-endpoint)

1. Go to the [Azure IoT Operations experience](https://iotoperations.azure.com).
1. Create an Event Grid MQTT data flow endpoint with the host set to `<namespace>.<region>-1.ts.eventgrid.azure.net`.

# [Azure CLI](#tab/cli-endpoint)

```azurecli
az iot ops dataflow endpoint create eventgrid \
  --resource-group $RESOURCE_GROUP \
  --instance $AIO_INSTANCE_NAME \
  --name eventgrid-private-endpoint \
  --host $EVENT_GRID_NAMESPACE.$LOCATION-1.ts.eventgrid.azure.net
```

---

For more information, see [Configure MQTT data flow endpoints for Event Grid](/azure/iot-operations/connect-to-cloud/howto-configure-mqtt-endpoint#azure-event-grid).

### Step 6: Create a data flow to test

Create a data flow that routes MQTT broker messages to the Event Grid destination.

# [Azure IoT Operations experience](#tab/doe)

1. Go to the [Azure IoT Operations experience](https://iotoperations.azure.com).
1. Select **Dataflows** > **Create dataflow**.
1. Set the **source** to the default MQTT broker endpoint.
1. Set the **destination** to the `eventgrid-private-endpoint` you created.
1. Set the destination topic to a topic that matches your topic space template.
1. Apply the data flow.

# [Azure CLI](#tab/cli)

Create a JSON configuration file that defines the source and destination. For example, to route messages from the `test/eventgrid` topic on the local MQTT broker to the Event Grid endpoint:

```json
{
  "mode": "Enabled",
  "operations": [
    {
      "operationType": "Source",
      "sourceSettings": {
        "endpointRef": "default",
        "dataSources": [
          "test/eventgrid"
        ]
      }
    },
    {
      "operationType": "Destination",
      "destinationSettings": {
        "endpointRef": "eventgrid-private-endpoint",
        "dataDestination": "test/eventgrid"
      }
    }
  ]
}
```

Then apply the data flow:

```azurecli
az iot ops dataflow apply \
  --resource-group $RESOURCE_GROUP \
  --instance $AIO_INSTANCE_NAME \
  --profile default \
  --name $DATAFLOW_NAME \
  --config-file $CONFIG_FILE
```

---

### Step 7: Validate telemetry arrives at Event Grid

Publish a test message to the MQTT broker by using any MQTT client. For example, use [mosquitto_pub](https://mosquitto.org/man/mosquitto_pub-1.html):

```bash
mosquitto_pub -h $CLUSTER_HOST_IP -p 1883 -t "test/eventgrid" -m '{"temperature": 25.5}'
```

> [!NOTE]
> This example uses port 1883 (non-TLS) for quick validation. If your MQTT broker listener is configured with TLS, use port 8883 and supply the appropriate `--cafile`, `--cert`, and `--key` arguments. For production, always use TLS-enabled listeners.

Then check the data flow is working:

1. Go to your Event Grid namespace in the Azure portal.
1. Check **Metrics** for incoming MQTT messages.

   :::image type="content" source="media/howto-private-connectivity/event-grid-messaging-metrics.png" alt-text="Screenshot of Event Grid namespace metrics showing successful MQTT published messages.":::

1. Verify the data flow pod logs show successful message delivery:

   ```bash
   kubectl logs -n azure-iot-operations -l app=dataflow --tail=50
   ```

If messages are flowing, the data flow is successfully routing through the private endpoint with managed identity auth. If messages don't arrive, see [Data flow messages don't arrive at Event Grid](howto-troubleshoot-private-connectivity.md#dataflow-messages-dont-arrive-at-event-grid).

After disabling public access on any Azure resource, verify Azure IoT Operations is still healthy. See [Verify Azure IoT Operations health after lockdown](howto-troubleshoot-private-connectivity.md#verify-azure-iot-operations-health-after-lockdown).

## Known limitations

- **Platform validation:** The private connectivity patterns described here are based on validated K3s on Ubuntu Server 24.04 scenarios. Other Kubernetes distributions or operating systems aren't independently validated.
- **Schema registry RBAC:** Use the `--skip-ra` flag during schema registry creation if you don't have owner-level permissions. Keep the trusted Azure services bypass (`AzureServices`) enabled in addition to the operations experience IP allow list so schema registry can access storage.
- **TLS inspection:** Arc Gateway doesn't support TLS termination or inspection. If your firewall performs TLS inspection, you must exclude the Arc Gateway endpoint from inspection. See [Arc Gateway and TLS inspection](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking#azure-arc-gateway-and-tls-inspection).
- **Arc Gateway limits:** You can have up to five Arc Gateway resources per subscription.
- **Explicit Proxy:** Only Azure Firewall Explicit Proxy is validated. Third-party proxies (for example, Palo Alto) or transparent proxies aren't supported in validated scenarios. Azure IoT Operations doesn't support proxy servers that require a trusted certificate.

## Related content

- [Simplify network configuration requirements with Azure Arc Gateway](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking)
- [Access Azure services over Azure Firewall Explicit Proxy](/azure/azure-arc/azure-firewall-explicit-proxy)
- [Configure a data flow endpoint](/azure/iot-operations/connect-to-cloud/howto-configure-dataflow-endpoint)
- [Schema Registry](/azure/iot-operations/connect-to-cloud/concept-schema-registry)
- [Tutorial: Deploy Azure IoT Operations in a layered network with private connectivity](../end-to-end-tutorials/tutorial-layered-network-private-connectivity.md)
- [Azure IoT Operations networking](overview-layered-network.md)
- [Deploy Azure IoT Operations](/azure/iot-operations/deploy-iot-ops/overview-deploy)
- [Azure Private DNS Zone values](/azure/private-link/private-endpoint-dns)
- [Troubleshoot private connectivity for Azure IoT Operations](howto-troubleshoot-private-connectivity.md)
