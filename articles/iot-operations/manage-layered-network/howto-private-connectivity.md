---
title: Deploy Azure IoT Operations with private connectivity
description: Configure private connectivity for Azure IoT Operations using Private Link, Arc Gateway, and Azure Firewall Explicit Proxy.
author: david-emakenemi
ms.subservice: layered-network-management
ms.author: demakenemi
ms.topic: how-to
ms.date: 03/25/2026

#CustomerIntent: As an operator, I want to deploy Azure IoT Operations with private connectivity to Azure so that no endpoints are exposed to the public internet.
ms.service: azure-iot-operations
---

# Deploy Azure IoT Operations with private connectivity

This article describes how to configure private connectivity for Azure IoT Operations. Follow the sections in order:

| Step | Section | What it does |
|------|---------|-------------|
| 1 | [Set up Arc Gateway](#set-up-arc-gateway) | Create the Arc Gateway resource and retrieve the custom locations OID |
| 2 | [Create private endpoints and DNS zones](#create-private-endpoints-and-dns-zones) | Create Private Endpoints and DNS zones for the dataplane resources (Storage, Key Vault, Event Grid) you created in the prerequisites |
| 3 | [Connect the cluster to Azure Arc](#connect-the-cluster-to-azure-arc) | Arc-enable the cluster. Choose between **Arc Gateway only** or **Arc Gateway + Explicit Proxy** |
| 4 | [Deploy Azure IoT Operations](#deploy-azure-iot-operations) | Deploy Azure IoT Operations. Traffic already routes privately via DNS |
| 5 | [Disable public access on storage and Key Vault](#disable-public-access-on-storage-and-key-vault) | Lock down the storage account and Key Vault after Azure IoT Operations is healthy |
| 6 | [Configure dataflow destinations with private endpoints](#configure-dataflow-destinations-with-private-endpoints) | Route dataflow traffic to cloud destinations like Event Grid through Private Link |

These scenarios apply to environments with a single Arc-enabled Kubernetes cluster. There's no Purdue-style network segmentation, no proxy chaining across layers, and no Envoy deployment. If you have a layered network topology, see [Tutorial: Deploy Azure IoT Operations in a layered network with private connectivity](../end-to-end-tutorials/tutorial-layered-network-private-connectivity.md) instead.

## Prerequisites

- An [Azure subscription](/azure/cost-management-billing/manage/create-subscription) with sufficient permissions to create Private Endpoints, Private DNS Zones, and role assignments (typically **Owner** or **Contributor** + **User Access Administrator**). If you don't have a subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli) and [kubectl](https://kubernetes.io/docs/tasks/tools/) installed on your admin or jump machine.
- A Kubernetes cluster deployed and ready to Arc-enable. See [Prepare your cluster](/azure/iot-operations/deploy-iot-ops/howto-prepare-cluster) for supported configurations and setup steps.
- An Azure VNet with network connectivity from your cluster ([ExpressRoute](/azure/expressroute/expressroute-introduction), [VPN Gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways), VNet peering, or other private routing). If your cluster runs on Azure VMs within the same VNet or a peered VNet, this connectivity is already in place.
- An [Azure Storage account](/azure/storage/common/storage-account-create) in the same resource group — used by Schema Registry for schema storage. If you encounter a **RequestDisallowedByPolicy** error during creation, add `--allow-shared-key-access false` to the `az storage account create` command.
- An [Azure Key Vault](/azure/key-vault/general/quick-create-cli) in the same resource group — used for secret synchronization with your cluster.
- (Optional) An [Azure Event Grid namespace](/azure/event-grid/create-view-manage-namespaces) with MQTT enabled. Needed only if you route dataflow traffic to Event Grid in [Configure dataflow destinations with private endpoints](#configure-dataflow-destinations-with-private-endpoints).
- (Optional) An [Azure Firewall](/azure/firewall/overview) with [explicit proxy](/azure/azure-arc/azure-firewall-explicit-proxy) enabled in your VNet, reachable from your cluster. Required only if you follow the **Arc Gateway + Explicit Proxy** tab for fully private connectivity with no public internet exposure.

## Set up Arc Gateway

[Azure Arc Gateway](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking) consolidates the ~200+ Azure endpoints that Arc agents and extensions require into a single gateway URL. This significantly simplifies your firewall allow list, instead of allowing 200+ individual FQDNs, you allow approximately 9.

### Step 1: Create an Arc Gateway resource

If you don't already have an Arc Gateway resource, create one. You need the gateway resource ID when you connect the cluster in the next section. For creation steps, see [Create the Arc Gateway resource](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking#create-the-arc-gateway-resource).

:::image type="content" source="media/howto-private-connectivity/arc-gateway-portal.png" alt-text="Screenshot of the Azure portal showing an Arc Gateway resource with its Gateway URL and resource properties.":::

> [!NOTE]
> A maximum of five Arc Gateway resources are supported per subscription.

For the list of FQDNs that must be allowed through your firewall when using Arc Gateway, see [Allowed endpoints with Arc Gateway](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking#allowed-endpoints-with-arc-gateway).

### Step 2: Retrieve the custom locations Object ID

The `--custom-locations-oid` parameter used when connecting the cluster requires the Object ID (OID) of the Azure Arc Custom Locations service principal.

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

## Create private endpoints and DNS zones

The storage account, Key Vault, and Event Grid namespace you created in the [prerequisites](#prerequisites) are the dataplane resources that Azure IoT Operations uses at runtime. Create Private Endpoints and DNS zones for these resources now so all traffic routes privately from the start, before you connect the cluster or deploy Azure IoT Operations.

### Step 1: Create Private Endpoints

Create Private Endpoints for the storage account, Key Vault, and Event Grid so all traffic to these services routes privately.

#### Azure Blob Storage

```azurecli
az network private-endpoint create \
  --name pe-storage-blob \
  --resource-group <resource-group> \
  --location <region-of-vnet> \
  --subnet "/subscriptions/<subscription-id>/resourceGroups/<rg-vnet>/providers/Microsoft.Network/virtualNetworks/<vnet>/subnets/<subnet>" \
  --private-connection-resource-id "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<account>" \
  --group-id blob \
  --connection-name pe-conn-storage-blob
```

#### Azure Key Vault

```azurecli
az network private-endpoint create \
  --name pe-keyvault \
  --resource-group <resource-group> \
  --location <region-of-vnet> \
  --subnet "/subscriptions/<subscription-id>/resourceGroups/<rg-vnet>/providers/Microsoft.Network/virtualNetworks/<vnet>/subnets/<subnet>" \
  --private-connection-resource-id "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.KeyVault/vaults/<keyvault-name>" \
  --group-id vault \
  --connection-name pe-conn-keyvault
```

> [!NOTE]
> The Event Grid Private Endpoint is created here so it's ready for [Configure dataflow destinations with private endpoints](#configure-dataflow-destinations-with-private-endpoints), which routes dataflow traffic to Event Grid over Private Link.

#### Event Grid namespace

```azurecli
az network private-endpoint create \
  --name pe-eventgrid \
  --resource-group <resource-group> \
  --location <region-of-vnet> \
  --subnet "/subscriptions/<subscription-id>/resourceGroups/<rg-vnet>/providers/Microsoft.Network/virtualNetworks/<vnet>/subnets/<subnet>" \
  --private-connection-resource-id "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.EventGrid/namespaces/<namespace>" \
  --group-id topicspace \
  --connection-name pe-conn-eventgrid
```

### Step 2: Configure Private DNS Zones

Create Private DNS Zones so Azure service FQDNs resolve to Private Endpoint IPs. Link each zone to your VNet and create DNS zone groups so the Private Endpoint A records are registered automatically.

#### Azure Blob Storage

```azurecli
az network private-dns zone create \
  --resource-group <resource-group> \
  --name privatelink.blob.core.windows.net

az network private-dns link vnet create \
  --resource-group <resource-group> \
  --zone-name privatelink.blob.core.windows.net \
  --name storage-dns-link \
  --virtual-network "/subscriptions/<subscription-id>/resourceGroups/<rg-vnet>/providers/Microsoft.Network/virtualNetworks/<vnet>" \
  --registration-enabled false

az network private-endpoint dns-zone-group create \
  --resource-group <resource-group> \
  --endpoint-name pe-storage-blob \
  --name storage-zone-group \
  --private-dns-zone "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Network/privateDnsZones/privatelink.blob.core.windows.net" \
  --zone-name blob
```

#### Azure Key Vault

```azurecli
az network private-dns zone create \
  --resource-group <resource-group> \
  --name privatelink.vaultcore.azure.net

az network private-dns link vnet create \
  --resource-group <resource-group> \
  --zone-name privatelink.vaultcore.azure.net \
  --name keyvault-dns-link \
  --virtual-network "/subscriptions/<subscription-id>/resourceGroups/<rg-vnet>/providers/Microsoft.Network/virtualNetworks/<vnet>" \
  --registration-enabled false

az network private-endpoint dns-zone-group create \
  --resource-group <resource-group> \
  --endpoint-name pe-keyvault \
  --name keyvault-zone-group \
  --private-dns-zone "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Network/privateDnsZones/privatelink.vaultcore.azure.net" \
  --zone-name vault
```

#### Event Grid

```azurecli
az network private-dns zone create \
  --resource-group <resource-group> \
  --name privatelink.ts.eventgrid.azure.net

az network private-dns link vnet create \
  --resource-group <resource-group> \
  --zone-name privatelink.ts.eventgrid.azure.net \
  --name eventgrid-dns-link \
  --virtual-network "/subscriptions/<subscription-id>/resourceGroups/<rg-vnet>/providers/Microsoft.Network/virtualNetworks/<vnet>" \
  --registration-enabled false

az network private-endpoint dns-zone-group create \
  --resource-group <resource-group> \
  --endpoint-name pe-eventgrid \
  --name eventgrid-zone-group \
  --private-dns-zone "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Network/privateDnsZones/privatelink.ts.eventgrid.azure.net" \
  --zone-name eventgrid
```

For the full list of private DNS zone names, see [Azure Private DNS Zone values](/azure/private-link/private-endpoint-dns).

## Connect the cluster to Azure Arc

With Private Endpoints and DNS in place, connect your cluster to Azure Arc. Choose the tab that matches your connectivity approach:

- **Arc Gateway only** — The cluster connects through Arc Gateway with a simplified firewall allow list (~9 FQDNs), but outbound traffic still uses public internet paths.
- **Arc Gateway + Explicit Proxy** — All outbound traffic routes through [Azure Firewall Explicit Proxy](/azure/azure-arc/azure-firewall-explicit-proxy) over your private network with no public internet exposure.

Both tabs build on [Set up Arc Gateway](#set-up-arc-gateway). Complete that section first to create the Arc Gateway resource and retrieve the custom locations OID.

# [Arc Gateway only](#tab/arc-gateway-only)

### Step 1: Connect the cluster with Arc Gateway

Connect your cluster and associate it with the Arc Gateway:

```azurecli
az connectedk8s connect \
  --name <cluster-name> \
  --resource-group <resource-group> \
  --location <region> \
  --custom-locations-oid <OID> \
  --enable-oidc-issuer \
  --enable-workload-identity \
  --disable-auto-upgrade \
  --gateway-resource-id <gateway-resource-id>
```

> [!TIP]
> **For existing Arc-enabled clusters:** If your cluster is already connected to Azure Arc, use `az connectedk8s update` instead of `az connectedk8s connect`:
>
> ```azurecli
> az connectedk8s update \
>   --name <cluster-name> \
>   --resource-group <resource-group> \
>   --gateway-resource-id <gateway-resource-id>
> ```

### Step 2: Verify connectivity

1. Confirm the Arc agents and Arc Proxy pod are running:

   ```bash
   kubectl get pods -n azure-arc
   ```

1. Verify DNS resolves to private IPs:

   ```bash
   nslookup <storage-account>.blob.core.windows.net
   nslookup <keyvault-name>.vault.azure.net
   nslookup <eventgrid-namespace>.ts.eventgrid.azure.net
   ```

   Each result should return an IP in your private address range (for example, `10.x.x.x`), not a public IP.

1. Verify the cluster appears as **Connected** in the Azure portal under **Azure Arc > Kubernetes clusters**.

If any FQDN resolves to a public IP, see [DNS resolves to a public IP instead of a private IP](howto-troubleshoot-private-connectivity.md#dns-resolves-to-a-public-ip-instead-of-a-private-ip).

# [Arc Gateway + Explicit Proxy](#tab/arc-gateway-proxy)

This tab covers fully private connectivity with no public internet exposure. It requires an Azure Firewall with explicit proxy enabled in your VNet, reachable from your cluster over [ExpressRoute](/azure/expressroute/expressroute-introduction) or [VPN Gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways).

### Step 1: Create firewall application rules for Arc Gateway FQDNs

The Azure Firewall Explicit Proxy blocks all traffic that isn't explicitly allowed. You must add application rules for the ~9 FQDNs that Arc Gateway requires. Without these rules, `az connectedk8s connect` and `az connectedk8s update` fail because the proxy blocks the Arc agent traffic.

Create a rule collection group and add application rules for the Arc Gateway FQDNs:

```azurecli
az network firewall policy rule-collection-group create \
  --name ArcRules \
  --policy-name <firewall-policy-name> \
  --resource-group <resource-group> \
  --priority 100

az network firewall policy rule-collection-group collection add-filter-collection \
  --rule-collection-group-name ArcRules \
  --policy-name <firewall-policy-name> \
  --resource-group <resource-group> \
  --name AllowArc \
  --collection-priority 100 \
  --action Allow \
  --rule-type ApplicationRule \
  --rule-name AllowArcEndpoints \
  --source-addresses "<cluster-subnet-cidrs>" \
  --protocols Https=443 \
  --target-fqdns "*.gw.arc.azure.com" "management.azure.com" "*.his.arc.azure.com" "*.dp.kubernetesconfiguration.azure.com" "login.microsoftonline.com" "mcr.microsoft.com" "*.data.mcr.microsoft.com" "gbl.his.arc.azure.com" "*.login.microsoft.com"
```

Replace `<cluster-subnet-cidrs>` with the CIDR range of your cluster subnet (for example, `10.0.0.0/24`). For the full list of required FQDNs, see [Allowed endpoints with Arc Gateway](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking#allowed-endpoints-with-arc-gateway).

### Step 2: Set proxy environment variables

On the machine where you run the `az connectedk8s connect` command, set the proxy environment variables to point to the Azure Firewall Explicit Proxy:

```bash
export HTTPS_PROXY=http://<firewall-private-ip>:<port>
export HTTP_PROXY=http://<firewall-private-ip>:<port>
export NO_PROXY=localhost,127.0.0.1,169.254.169.254,.svc,.local,<cluster-subnet-cidr>
```

> [!NOTE]
> The `HTTPS_PROXY` value uses an `http://` scheme because the proxy connection itself is HTTP — the HTTPS tunnel runs inside it. Both `HTTPS_PROXY` and `HTTP_PROXY` point to the Azure Firewall's private IP and explicit proxy port (for example, `http://10.254.0.68:8443`). Adjust `NO_PROXY` to include your cluster's internal CIDRs and any local domains that should bypass the proxy.

### Step 3: Connect the cluster with Arc Gateway and proxy

Connect the cluster, associating it with both the Arc Gateway and the explicit proxy:

```azurecli
az connectedk8s connect \
  --name <cluster-name> \
  --resource-group <resource-group> \
  --location <region> \
  --custom-locations-oid <OID> \
  --enable-oidc-issuer \
  --enable-workload-identity \
  --disable-auto-upgrade \
  --proxy-https $HTTPS_PROXY \
  --proxy-http $HTTP_PROXY \
  --proxy-skip-range $NO_PROXY \
  --gateway-resource-id <gateway-resource-id>
```

This command configures all Arc traffic to route through the Azure Firewall Explicit Proxy and the Arc Gateway, consolidating ~200+ endpoints to ~9 allowed FQDNs with no public internet exposure.

> [!IMPORTANT]
> Arc agent traffic, including extension installs and container image pulls from MCR (`mcr.microsoft.com`), routes through the proxy automatically because `az connectedk8s connect` injects the proxy environment variables into the Arc agent pods. However, if your container runtime (containerd or CRI-O) pulls images outside of the Arc agent (for example, during node-level kubelet pulls), you might also need to configure proxy settings at the node level. On Ubuntu with systemd, create `/etc/systemd/system/containerd.service.d/http-proxy.conf` with your proxy values, then run `sudo systemctl daemon-reload && sudo systemctl restart containerd`.

> [!TIP]
> **For existing Arc-enabled clusters:** If your cluster is already connected to Azure Arc, use `az connectedk8s update` instead of `az connectedk8s connect`:
>
> ```azurecli
> az connectedk8s update \
>   --name <cluster-name> \
>   --resource-group <resource-group> \
>   --proxy-https http://<firewall-private-ip>:<port> \
>   --proxy-http http://<firewall-private-ip>:<port> \
>   --proxy-skip-range localhost,127.0.0.1,.svc,.local,<cluster-subnet-cidrs> \
>   --gateway-resource-id <gateway-resource-id>
> ```

### Step 4: Verify connectivity

1. Confirm the Arc Proxy pod is running:

   ```bash
   kubectl get pods -n azure-arc -l app.kubernetes.io/component=arc-proxy
   ```

1. Verify DNS resolves to private IPs:

   ```bash
   nslookup <storage-account>.blob.core.windows.net
   nslookup <keyvault-name>.vault.azure.net
   nslookup <eventgrid-namespace>.ts.eventgrid.azure.net
   ```

   Each result should return an IP in your private address range, not a public IP.

1. Verify the cluster appears as **Connected** in the Azure portal under **Azure Arc > Kubernetes clusters**.

If any FQDN resolves to a public IP, see [DNS resolves to a public IP instead of a private IP](howto-troubleshoot-private-connectivity.md#dns-resolves-to-a-public-ip-instead-of-a-private-ip).

---

## Deploy Azure IoT Operations

With Private Endpoints, DNS zones, and Arc connectivity in place, deploy Azure IoT Operations to your cluster. The dataplane resources (Storage, Key Vault) already resolve to private IPs through the DNS configuration from [Create private endpoints and DNS zones](#create-private-endpoints-and-dns-zones).

For deployment instructions, see [Deploy Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md). During deployment, Arc agent traffic routes through the connectivity options you configured (Arc Gateway, Explicit Proxy, or both).

> [!WARNING]
> The storage account and Key Vault must have public access enabled during deployment. Schema Registry requires public access on the storage account at creation time, and the Secret Store Extension (secret sync) needs to reach Key Vault. This means these resources are publicly reachable until you complete [Disable public access on storage and Key Vault](#disable-public-access-on-storage-and-key-vault). Complete that section as soon as Azure IoT Operations pods are healthy to minimize the exposure window.
>
> To further reduce exposure, you can restrict public access to your admin machine's IP only:
>
> <details><summary>Optional: restrict access to your IP during deployment</summary>
>
> ```azurecli
> az storage account network-rule add \
>   --account-name <storage-account> \
>   --ip-address <your-public-ip>
>
> az storage account update \
>   --name <storage-account> \
>   --resource-group <resource-group> \
>   --default-action Deny
>
> az keyvault network-rule add \
>   --name <keyvault-name> \
>   --ip-address <your-public-ip>/32
>
> az keyvault update \
>   --name <keyvault-name> \
>   --resource-group <resource-group> \
>   --default-action Deny
> ```
>
> After Azure IoT Operations is healthy, switch to `--public-network-access Disabled` as described in the next section.
>
> </details>

## Disable public access on storage and Key Vault

After Azure IoT Operations is deployed, disable public access on the storage account and Key Vault to complete the lockdown.

### Prerequisites

Before disabling public access, confirm the following:

- **Azure IoT Operations is deployed and healthy.** Run `az iot ops check` and verify all pods in the `azure-iot-operations` namespace are running. See [Deploy Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md).
- **Secret sync is configured and working.** Verify that SecretSync and SecretProviderClass resources exist and that secrets are syncing from Azure Key Vault. See [Manage secrets for your Azure IoT Operations deployment](../secure-iot-ops/howto-manage-secrets.md).
- **Schema Registry is functional.** Confirm the schema registry pods (`adr-schema-registry-*`) are running and can reach the storage account. For more information, see [Understand message schemas](../connect-to-cloud/concept-schema-registry.md).
- **Cluster nodes can resolve Azure DNS.** If your cluster uses custom DNS, configure DNS forwarding to Azure DNS (`168.63.129.16`) so that Private DNS Zone records resolve correctly. For more information, see [Azure Private Endpoint DNS integration](/azure/private-link/private-endpoint-dns-integration).

### Step 1: Disable public access and assign RBAC

Disable public network access on the storage account and Key Vault. For the storage account, enable the trusted Azure services bypass so Schema Registry (`Microsoft.DeviceRegistry/schemaRegistries`) can still access it:

```azurecli
az storage account update \
  --name <storage-account> \
  --resource-group <resource-group> \
  --public-network-access Disabled \
  --bypass AzureServices
```

Verify that public access is disabled:

```azurecli
az storage account show --name <storage-account> --resource-group <resource-group> --query "publicNetworkAccess"
```

```azurecli
az keyvault update \
  --name <keyvault-name> \
  --resource-group <resource-group> \
  --public-network-access Disabled
```

Verify that public access is disabled:

```azurecli
az keyvault show --name <keyvault-name> --resource-group <resource-group> --query "properties.publicNetworkAccess"
```

> [!NOTE]
> Schema Registry continues to function correctly through the trusted service bypass (`AzureServices`). Use the `--skip-ra` flag during Schema Registry creation if you don't have Owner-level permissions.

Assign the Schema Registry's managed identity access to the storage account:

```azurecli
az role assignment create \
  --assignee <identity-client-id> \
  --role "Storage Blob Data Contributor" \
  --scope <storage-account-resource-id>
```

### Step 2: Verify private connectivity

1. From your cluster node, confirm the storage FQDN resolves to a private IP:

   ```bash
   nslookup <storage-account>.blob.core.windows.net
   ```

1. Confirm the Key Vault FQDN resolves to a private IP:

   ```bash
   nslookup <keyvault-name>.vault.azure.net
   ```

   Both should return IPs in your private address range (for example, `10.x.x.x`), not public IPs.

1. Verify that secret sync is still working after disabling public access:

   ```bash
   kubectl get secretsync -n azure-iot-operations
   ```

   All SecretSync resources should show a status of `Synced`. If any show errors, see [Troubleshoot private connectivity](howto-troubleshoot-private-connectivity.md).

## Configure dataflow destinations with private endpoints

Azure IoT Operations [dataflows](/azure/iot-operations/connect-to-cloud/overview-dataflow) send telemetry to cloud destinations like Azure Event Grid, Azure Event Hubs, Azure Data Explorer, Data Lake Storage Gen2, and Microsoft Fabric OneLake. By default, dataflows connect to these services over their public endpoints. To keep traffic private, create Private Endpoints for each destination and ensure DNS resolves to the private IPs.

> [!NOTE]
> If you created an Event Grid Private Endpoint and DNS zone in [Create private endpoints and DNS zones](#create-private-endpoints-and-dns-zones), Event Grid is already configured for private access. Skip ahead to [Step 2: Assign RBAC for Event Grid](#step-2-assign-rbac-for-event-grid) for that destination.

The following table shows supported dataflow destinations and the Private DNS Zone, group ID, and port for each:

| Destination | Private DNS Zone | Group ID | Port |
|-------------|-----------------|----------|------|
| Azure Event Grid (MQTT) | `privatelink.ts.eventgrid.azure.net` | `topicspace` | 8883 |
| Azure Event Hubs | `privatelink.servicebus.windows.net` | `namespace` | 9093 (Kafka) |
| Azure Data Explorer | `privatelink.<region>.kusto.windows.net` | `cluster` | 443 |
| Data Lake Storage Gen2 | `privatelink.blob.core.windows.net` or `privatelink.dfs.core.windows.net` | `blob` or `dfs` | 443 |
| Microsoft Fabric OneLake | `privatelink.dfs.fabric.microsoft.com` | `onelake` | 443 |

> [!NOTE]
> - **Event Hubs** uses Kafka protocol port `9093` (not the standard AMQP port `5671`) because Azure IoT Operations dataflows connect to Event Hubs via Kafka.
> - **Data Lake Storage Gen2** supports two group IDs: use `blob` for flat namespace access and `dfs` for hierarchical namespace (HNS-enabled) accounts. Choose the one that matches your storage account configuration.

The steps below use **Azure Event Grid** as the example. The same pattern applies to every destination, substitute the values from the table.

### Step 1: Create an Event Grid namespace

If you don't already have one, create an Event Grid namespace with MQTT (topic spaces) enabled:

```azurecli
az eventgrid namespace create \
  --name <namespace> \
  --resource-group <resource-group> \
  --location <region> \
  --topic-spaces-configuration state=Enabled \
  --sku name=Standard capacity=1
```

Then create a topic space. For testing, you can use the wildcard `#` as the topic template:

```azurecli
az eventgrid namespace topic-space create \
  --name <topic-space-name> \
  --resource-group <resource-group> \
  --namespace-name <namespace> \
  --topic-templates "#"
```

> [!NOTE]
> In the Event Grid namespace, set **Maximum client sessions per authentication name** to **3** or more so dataflows can scale up. See [Event Grid MQTT multi-session support](/azure/event-grid/mqtt-establishing-multiple-sessions-per-client).

### Step 2: Assign RBAC for Event Grid

Grant the Azure IoT Operations managed identity the Event Grid role that matches your dataflow direction:

- **One-way (source → Event Grid):** Assign `EventGrid TopicSpaces Publisher`.
- **One-way (Event Grid → destination):** Assign `EventGrid TopicSpaces Subscriber`.
- **Bidirectional bridge:** Assign both `EventGrid TopicSpaces Publisher` and `EventGrid TopicSpaces Subscriber`.

For a typical dataflow that publishes telemetry to Event Grid:

```azurecli
az role assignment create \
  --assignee <aio-managed-identity-principal-id> \
  --role "EventGrid TopicSpaces Publisher" \
  --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.EventGrid/namespaces/<namespace>"
```

> [!NOTE]
> If you create a bidirectional MQTT bridge (both source and destination use Event Grid), you need **both** Publisher and Subscriber roles. See [Tutorial: Configure MQTT bridge between Azure IoT Operations and Event Grid](/azure/iot-operations/connect-to-cloud/tutorial-mqtt-bridge) for an example.

> [!IMPORTANT]
> **Assign RBAC to the correct identity.** The dataflow endpoint's authentication method determines which identity you must grant the Event Grid role to:
>
> - **System-assigned managed identity (default):** Assign the role to the **AIO Arc extension's** service principal. To find it, go to the Azure portal → your Arc-enabled cluster → **Extensions** → **azure-iot-operations** → **Properties**, and copy the **Principal ID**. Or use the CLI:
>
>   ```azurecli
>   az rest --method get \
>     --url "https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Kubernetes/connectedClusters/<cluster-name>/extensions/azure-iot-operations?api-version=2024-11-01-preview" \
>     --query "identity.principalId" -o tsv
>   ```
>
> - **User-assigned managed identity:** Assign the role to that identity's principal ID.
>
> If you assign the role to the wrong identity (for example, a user-assigned MI used for SecretSync instead of the AIO extension's system-assigned MI), the dataflow receives a `NotAuthorized` error after CONNACK and enters a reconnect loop.

### Step 3: Disable public access on the Event Grid namespace

The Event Grid Private Endpoint and DNS zone were already created in [Create private endpoints and DNS zones](#create-private-endpoints-and-dns-zones). Now disable public access:

```azurecli
az eventgrid namespace update \
  --name <namespace> \
  --resource-group <resource-group> \
  --public-network-access Disabled
```

Verify that public access is disabled:

```azurecli
az eventgrid namespace show --name <namespace> --resource-group <resource-group> --query "publicNetworkAccess"
```

### Step 4: Verify DNS resolves to a private IP

From your cluster node (or a VM in the same VNet), confirm the FQDN resolves to the Private Endpoint IP:

```bash
nslookup <namespace>.<region>-1.ts.eventgrid.azure.net
```

The result should return an IP in your private address range (for example, `10.x.x.x`), not a public IP. If it returns a public IP, check your Private DNS Zone linkage.

### Step 5: Create the dataflow endpoint for Event Grid

Create an Event Grid MQTT dataflow endpoint. This creates an endpoint using system-assigned managed identity authentication. The host uses the Event Grid namespace's MQTT hostname on port 8883. No special configuration is needed for Private Link — the dataflow resolves the FQDN through DNS, which returns the Private Endpoint IP if your DNS zones are configured correctly.

# [Azure IoT Operations experience](#tab/doe-endpoint)

1. Go to the [Azure IoT Operations experience](https://iotoperations.azure.com).
1. Create an Event Grid MQTT dataflow endpoint with the host set to `<namespace>.<region>-1.ts.eventgrid.azure.net`.

# [Azure CLI](#tab/cli-endpoint)

```azurecli
az iot ops dataflow endpoint create eventgrid \
  --resource-group <resource-group> \
  --instance <aio-instance-name> \
  --name eventgrid-private-endpoint \
  --host <namespace>.<region>-1.ts.eventgrid.azure.net
```

---

For more information, see [Configure MQTT dataflow endpoints for Event Grid](/azure/iot-operations/connect-to-cloud/howto-configure-mqtt-endpoint#azure-event-grid).

### Step 6: Create a dataflow to test

Create a dataflow that routes MQTT broker messages to the Event Grid destination.

# [Azure IoT Operations experience](#tab/doe)

1. Go to the [Azure IoT Operations experience](https://iotoperations.azure.com).
1. Select **Dataflows** > **Create dataflow**.
1. Set the **source** to the default MQTT broker endpoint.
1. Set the **destination** to the `eventgrid-private-endpoint` you created.
1. Set the destination topic to a topic that matches your topic space template.
1. Apply the dataflow.

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

Then apply the dataflow:

```azurecli
az iot ops dataflow apply \
  --resource-group <resource-group> \
  --instance <aio-instance-name> \
  --profile default \
  --name <dataflow-name> \
  --config-file <config-file-path>
```

---

### Step 7: Validate telemetry arrives at Event Grid

Publish a test message to the MQTT broker using any MQTT client. For example, with [mosquitto_pub](https://mosquitto.org/man/mosquitto_pub-1.html):

```bash
mosquitto_pub -h <cluster-host-ip> -p 1883 -t "test/eventgrid" -m '{"temperature": 25.5}'
```

> [!NOTE]
> This example uses port 1883 (non-TLS) for quick validation. If your MQTT broker listener is configured with TLS, use port 8883 and supply the appropriate `--cafile`, `--cert`, and `--key` arguments. For production, always use TLS-enabled listeners.

Then check the dataflow is working:

1. Navigate to your Event Grid namespace in the Azure portal.
1. Check **Metrics** for incoming MQTT messages.

   :::image type="content" source="media/howto-private-connectivity/event-grid-messaging-metrics.png" alt-text="Screenshot of Event Grid namespace metrics showing successful MQTT published messages.":::

1. Verify the dataflow pod logs show successful message delivery:

   ```bash
   kubectl logs -n azure-iot-operations -l app=dataflow --tail=50
   ```

If messages are flowing, the dataflow is successfully routing through the Private Endpoint with managed identity auth. If messages don't arrive, see [Dataflow messages don't arrive at Event Grid](howto-troubleshoot-private-connectivity.md#dataflow-messages-dont-arrive-at-event-grid).

After disabling public access on any Azure resource, verify Azure IoT Operations is still healthy. See [Verify Azure IoT Operations health after lockdown](howto-troubleshoot-private-connectivity.md#verify-azure-iot-operations-health-after-lockdown).

## Known limitations

- **Platform validation:** The private connectivity patterns described here are based on validated K3s on Ubuntu Server 24.04 scenarios. Other Kubernetes distributions or operating systems haven't been independently validated.
- **Schema Registry creation:** Schema Registry might require public access enabled at creation time. After creation, you can disable public access and rely on Private Endpoints plus trusted service bypass. Use the `--skip-ra` flag when creating the Schema Registry to avoid requiring Owner-level permissions.
- **TLS inspection:** Arc Gateway doesn't support TLS termination or inspection. If your firewall performs TLS inspection, you must exclude the Arc Gateway endpoint from inspection. See [Arc Gateway and TLS inspection](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking#azure-arc-gateway-and-tls-inspection).
- **Arc Gateway limits:** A maximum of five Arc Gateway resources are supported per subscription.
- **Explicit Proxy:** Only Azure Firewall Explicit Proxy has been validated. Third-party proxies (for example, Palo Alto) or transparent proxies aren't supported in validated scenarios. Azure IoT Operations doesn't support proxy servers that require a trusted certificate.

## Related content

- [Simplify network configuration requirements with Azure Arc Gateway](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking)
- [Access Azure services over Azure Firewall Explicit Proxy](/azure/azure-arc/azure-firewall-explicit-proxy)
- [Configure a dataflow endpoint](/azure/iot-operations/connect-to-cloud/howto-configure-dataflow-endpoint)
- [Schema Registry](/azure/iot-operations/connect-to-cloud/concept-schema-registry)
- [Tutorial: Deploy Azure IoT Operations in a layered network with private connectivity](../end-to-end-tutorials/tutorial-layered-network-private-connectivity.md)
- [Azure IoT Operations networking](overview-layered-network.md)
- [Deploy Azure IoT Operations](/azure/iot-operations/deploy-iot-ops/overview-deploy)
- [Azure Private DNS Zone values](/azure/private-link/private-endpoint-dns)
- [Troubleshoot private connectivity for Azure IoT Operations](howto-troubleshoot-private-connectivity.md)
