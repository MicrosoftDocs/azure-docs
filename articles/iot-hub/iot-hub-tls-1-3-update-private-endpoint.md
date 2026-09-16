---
title: Update private endpoints for TLS 1.3 on Azure IoT Hub
description: Learn how to update Azure Private Link private endpoints so the new TLS 1.3 service and device hostnames resolve to a private IP address.
services: iot-hub
author: sethmanheim
ms.service: azure-iot-hub
ms.topic: how-to
ms.date: 07/14/2026
ms.author: sethm
ms.custom: references_regions
---

# Update private endpoints to enable TLS 1.3 on Azure IoT Hub

Azure IoT Hub supports [TLS 1.3](iot-hub-tls-support.md#tls-13-support-preview) through new device and service endpoints. As part of this change, every IoT hub exposes two additional hostnames alongside its default hostname:

| Endpoint | Hostname |
| --- | --- |
| Default | `<your-hub>.azure-devices.net` |
| Service | `<your-hub>.service.azure-devices.net` |
| Device | `<your-hub>.device.azure-devices.net` |

If you access your IoT hub over a **private endpoint** ([Azure Private Link](virtual-network-support.md)), these two new hostnames must also resolve to a private IP address in your virtual network. For most configurations, this resolution happens automatically and **no action is required**. In two specific situations, you can't add the new hostnames to your existing private endpoint automatically. You must take manual action to unblock private connectivity over TLS 1.3:

- If your private endpoint uses **static IP allocation**, you can add the two new endpoints by reconfiguring your existing private endpoint, without deleting and recreating it.
- If the **subnet is full**, you must first free up address space, then recreate the private endpoint.

This article explains who is affected, how to check whether your private endpoint is missing the new hostnames, and how to fix it.

## Who is affected

You only need to take action if **both** of the following conditions are true:

- You access your IoT hub through a **private endpoint**.
- The private endpoint is in one of these states:
   - **The subnet is full.** There are no free private IP addresses left in the subnet that hosts the private endpoint, so Azure can't allocate the IP addresses needed for the new service and device hostnames.
   - **The private endpoint uses static IP allocation.** When you assign private IP addresses to a private endpoint statically, newly added members (the service and device hostnames) aren't included automatically and don't receive an IP address.

> [!NOTE]
> Public (non–Private Link) IoT hubs aren't affected. The new hostnames resolve through public DNS automatically.

## Symptoms

When the new hostnames are missing from a private endpoint, clients inside the virtual network can experience:

- Connection failures or DNS resolution failures when connecting to `<your-hub>.service.azure-devices.net` or `<your-hub>.device.azure-devices.net`.
- The two new hostnames resolve to a **public** IP address (or don't resolve at all) instead of the expected private IP address, when private DNS is configured to keep traffic on the private endpoint.

The default hostname (`<your-hub>.azure-devices.net`) continues to work.

## Step 1: Check whether your private endpoint is missing the new hostnames

Confirm whether the service and device hostnames are present on your private endpoint before you recreate anything.

### Use the Azure portal

If you use an Azure private DNS zone for Private Link, check which hostnames are registered:

1. In the [Azure portal](https://portal.azure.com), open the **privatelink.azure-devices.net** private DNS zone that's linked to your private endpoint.
1. Confirm there's an **A record** for each of these names:
   - `<your-hub>` — the default endpoint
   - `<your-hub>.service` — the service endpoint
   - `<your-hub>.device` — the device endpoint

If the `<your-hub>.service` or `<your-hub>.device` record is missing, the private endpoint is missing the TLS 1.3 endpoints and needs to be updated or recreated.

### Use the Azure CLI

> [!NOTE]
> Commands that use `--name` and `--resource-group` run against your **active subscription**. If your hub or private endpoint is in a different subscription, select it first by using `az account set --subscription <subscription-id>`.

First, list the members that the IoT hub now requires for Private Link. The list includes the new service and device members:

```azurecli
az network private-link-resource list \
  --id "/subscriptions/<subscription-id>/resourceGroups/<hub-rg>/providers/Microsoft.Devices/IotHubs/<your-hub>" \
  --query "[].properties.requiredMembers" -o json
```

The output includes members such as `iotHub`, `iotHubService`, and `iotHubDevice`.

Next, list the members actually provisioned on the private endpoint. These members reside on the endpoint's network interface, so this check works whether the endpoint uses **static** or **dynamic** IP allocation:

```azurecli
az network nic show \
  --ids "$(az network private-endpoint show --name <private-endpoint-name> --resource-group <private-endpoint-rg> --query 'networkInterfaces[0].id' -o tsv)" \
  --query "ipConfigurations[].privateLinkConnectionProperties.requiredMemberName" -o json
```

Compare the result against the required members. If it **doesn't** include `iotHubService` and `iotHubDevice`, the private endpoint is missing the TLS 1.3 endpoints and needs to be updated or recreated.

> [!NOTE]
> Don't use the private endpoint's `ipConfigurations` for this check. That list only contains **static** IP configurations and is empty for endpoints that use dynamic IP allocation.

## Step 2: Choose how to fix it

Both fixes need free private IP addresses in the private endpoint's subnet - one for each of the two new endpoints. Either option works. Choose based on how disruptive you can be:

- **Option A - reconfigure in place (static IP allocation only).** If your private endpoint uses static IP allocation, [add the new endpoints](#option-a-add-the-new-endpoints-to-your-private-endpoint) without deleting it. This option is the least disruptive.
- **Option B - recreate (works for any private endpoint).** [Delete and recreate](#option-b-recreate-the-private-endpoint) the private endpoint. Use this option when your endpoint uses dynamic IP allocation, when the subnet is full, or whenever you prefer a clean rebuild. It also works for static-IP endpoints.

> [!IMPORTANT]
> You **can't** resize a subnet's address range while a private endpoint (or any other resource) is deployed in it. To make room in a full subnet, release unused IP addresses in the subnet, or recreate the private endpoint in a different subnet that has free addresses.

## Option A: Add the new endpoints to your private endpoint

Use this option when your private endpoint uses **static IP allocation** and the subnet has at least two free IP addresses. No deletion is required.

First, gather the endpoint's current settings - its location, subnet, network interface name, connection name, and existing IP configurations (members and their static IPs):

```azurecli
az network private-endpoint show \
  --name <private-endpoint-name> \
  --resource-group <private-endpoint-rg> \
  --query "{location:location, subnet:subnet.id, nic:networkInterfaces[0].id, connectionName:privateLinkServiceConnections[0].name, ipConfigs:ipConfigurations[].{name:name, groupId:groupId, memberName:memberName, ip:privateIPAddress}}" -o json
```

In the next command, use the `subnet` value for `--subnet`, and the last segment of the `nic` ID for `--nic-name`.

Reconfigure the endpoint with **all** members - every entry from `ipConfigs`, plus one entry each for `iotHubService` and `iotHubDevice` using two free IP addresses from the subnet:

```azurecli
az network private-endpoint create \
  --name <private-endpoint-name> \
  --resource-group <private-endpoint-rg> \
  --location <existing-location> \
  --nic-name <existing-nic-name> \
  --subnet <subnet-id> \
  --private-connection-resource-id "/subscriptions/<subscription-id>/resourceGroups/<hub-rg>/providers/Microsoft.Devices/IotHubs/<your-hub>" \
  --group-id iotHub \
  --connection-name <existing-connection-name> \
  --ip-configs "[{name:<iothub-config-name>,group-id:iotHub,member-name:iotHub,private-ip-address:<existing-iothub-ip>},{name:<eventhub-config-name>,group-id:iotHub,member-name:eventHub,private-ip-address:<existing-eventhub-ip>},{name:iotHubServiceMN,group-id:iotHub,member-name:iotHubService,private-ip-address:<free-ip-1>},{name:iotHubDeviceMN,group-id:iotHub,member-name:iotHubDevice,private-ip-address:<free-ip-2>}]"
```

Include an entry for **every** member the private endpoint already had (for example `iotHub` and `eventHub`) - omitting one removes it. The `<free-ip-1>` and `<free-ip-2>` values must be unused addresses within the subnet range. After the private endpoint is reconfigured, the private DNS zone group registers the new A records automatically. Continue to [Verify the fix](#verify-the-fix).

## Option B: Recreate the private endpoint

This option works for **any** private endpoint, whether it uses static or dynamic IP allocation. Use it when your endpoint uses dynamic IP allocation, when the subnet is full (after you free up address space), or whenever you prefer a clean rebuild. When the private endpoint is created fresh, Azure provisions private IP addresses for **all** current members, including the service and device endpoints.

> [!IMPORTANT]
> Deleting and recreating a private endpoint causes a brief interruption to private connectivity for the affected IoT hub. Perform these steps during a planned maintenance window.

### Use the Azure portal

1. Open the existing **private endpoint** for your IoT hub and note its configuration: resource group, virtual network, subnet, target subresource (**`iotHub`**), and the private DNS zone group (the `privatelink.azure-devices.net` and `privatelink.servicebus.windows.net` zones).
1. **Delete** the existing private endpoint.
1. Create a new private endpoint:
   1. Search for **Private endpoints** and select **Create**.
   1. On **Resource**, select your IoT hub and the **`iotHub`** target subresource.
   1. On **Virtual Network**, choose the subnet that has free addresses. Use **dynamic** IP allocation unless you have a specific reason to assign static IPs (if you do, include addresses for the service and device members).
   1. On **DNS**, integrate with the **`privatelink.azure-devices.net`** and **`privatelink.servicebus.windows.net`** private DNS zones so all hostnames register automatically.
   1. Review and create.

### Use the Azure CLI

```azurecli
# 1. Delete the existing private endpoint
az network private-endpoint delete \
  --name <private-endpoint-name> \
  --resource-group <private-endpoint-rg>

# 2. Recreate it against the IoT hub 'iotHub' subresource
az network private-endpoint create \
  --name <private-endpoint-name> \
  --resource-group <private-endpoint-rg> \
  --location <region> \
  --vnet-name <vnet-name> \
  --subnet <subnet-with-free-addresses> \
  --private-connection-resource-id "/subscriptions/<subscription-id>/resourceGroups/<hub-rg>/providers/Microsoft.Devices/IotHubs/<your-hub>" \
  --group-id iotHub \
  --connection-name <connection-name>

# 3. Re-link the private DNS zones so the hostnames register
az network private-endpoint dns-zone-group create \
  --resource-group <private-endpoint-rg> \
  --endpoint-name <private-endpoint-name> \
  --name default \
  --private-dns-zone <privatelink-azure-devices-net-zone-resource-id> \
  --zone-name privatelink-azure-devices-net

az network private-endpoint dns-zone-group add \
  --resource-group <private-endpoint-rg> \
  --endpoint-name <private-endpoint-name> \
  --name default \
  --private-dns-zone <privatelink-servicebus-windows-net-zone-resource-id> \
  --zone-name privatelink-servicebus-windows-net
```

> [!NOTE]
> The recreated endpoint uses **dynamic** IP allocation. To keep **static** allocation, add `--ip-configs` to the `create` command with an entry for every member (including `iotHubService` and `iotHubDevice`), as shown in [Option A](#option-a-add-the-new-endpoints-to-your-private-endpoint).

## Verify the fix

Repeat the checks from [Step 1](#step-1-check-whether-your-private-endpoint-is-missing-the-new-hostnames). The private endpoint should now list all three hostnames, each with a private IP address:

- `<your-hub>.azure-devices.net`
- `<your-hub>.service.azure-devices.net`
- `<your-hub>.device.azure-devices.net`

From a client inside the virtual network, confirm that the service and device hostnames resolve to a **private** IP address and that connections succeed over TLS 1.3.

## Next steps

- [Transport Layer Security (TLS) support in IoT Hub](iot-hub-tls-support.md)
- [IoT Hub support for virtual networks with Azure Private Link](virtual-network-support.md)
