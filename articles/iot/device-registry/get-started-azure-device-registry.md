---
title: Get started with Azure Device Registry (preview)
titleSuffix: Azure Device Registry
description: Set up an Azure Device Registry namespace by using the guided setup in the Azure portal, or by connecting services to a namespace individually.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot
ms.topic: how-to
ms.date: 10/05/2026
ai-usage: ai-assisted

#Customer intent: As an IoT solution architect, I want to set up an Azure Device Registry namespace with either guided setup or by connecting services individually so that I can deploy or connect the resources required for my IoT devices.
---

# Get started with Azure Device Registry (preview)

This article describes how to set up an [Azure Device Registry](overview-device-registry.md) namespace and connect the IoT Hub and Device Provisioning Service (DPS) resources it depends on. You can create new resources, connect an existing DPS instance and its linked IoT hubs, or connect existing IoT hubs to a new DPS instance.

> [!IMPORTANT]
> Azure Device Registry integration with Azure IoT Hub is in public preview and isn't recommended for production workloads. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

> [!IMPORTANT]
> Azure Device Registry, including certificate management, is free during preview. The IoT Hub and Device Provisioning Service (DPS) instances that you use with it are billed at their standard rates. For details, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

## Prerequisites

- An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Permissions to create resource groups, user-assigned managed identities, role assignments, IoT Hub instances, and DPS instances in the target subscription. Creating role assignments requires a [privileged role](../../role-based-access-control/built-in-roles.md#privileged), such as Owner or User Access Administrator at the appropriate scope.
- A [supported region](../../iot-hub/iot-hub-what-is-new.md#supported-regions) for Azure Device Registry, IoT Hub, and DPS. All new resources are created in the same region as the namespace.

- To connect services by using the Azure CLI, the [Azure CLI](/cli/azure/install-azure-cli) installed and signed in by using `az login`, and the preview version of the `azure-iot` extension. Install or update the extension by running `az extension add --upgrade --name azure-iot --allow-preview true`.

> [!WARNING]
> Connecting an existing IoT hub or DPS instance to an Azure Device Registry namespace is permanent and can't be reversed. You're asked to acknowledge this effect when you select an existing resource.

## Ways to get started

You can set up Azure Device Registry in two ways:

- [Use the guided setup](#use-the-guided-setup). A guided experience that walks you through creating or opening a namespace and connecting the services it depends on. Use this method to get to a working namespace without deep knowledge of the underlying services.
- [Connect services individually](#connect-services-individually). A step-by-step path where you open a namespace and connect each service one at a time. Use this method when you want full control over each resource or need to add resources to an existing namespace.

Both methods produce the same result: a namespace with connected IoT Hub and DPS resources that you can manage through the Azure control plane.

The guided setup is available only in the Azure portal. When you connect services individually, you can use the Azure portal or the Azure CLI.

## Use the guided setup

You can start the guided setup from either of these locations in the Azure portal:

- From the Azure Device Registry page, on the **Get started** tab, select **Start setup**. This entry point creates a namespace as part of the setup.
- From an existing Azure Device Registry namespace, on the **Get started** tab. This entry point uses the subscription, resource group, and region of the namespace and adds services to it.

:::image type="content" source="media/get-started-azure-device-registry/get-started-quickstart.png" alt-text="Screenshot that shows the entry points for starting the Azure Device Registry guided setup." lightbox="media/get-started-azure-device-registry/get-started-quickstart.png":::

The guided setup walks you through four steps: **ADR namespace**, **Connectivity**, **Capabilities**, and **Review + create**.

### 1. ADR namespace

On the **ADR namespace** page:

1. Select whether to **Create a namespace** or **Use an existing namespace**.
1. Select the Azure subscription.
1. Create a resource group or select an existing one.
1. Enter a **Namespace name** that contains lowercase letters, numbers, and hyphens. The guided setup uses this value to suggest names for the resources it creates.
1. Select a region. If you plan to connect existing DPS or IoT Hub resources, select the region that contains those resources.

If you started from an existing namespace, the subscription, resource group, and region are already set and can't be changed.

### 2. Connectivity

On the **Connectivity** page, choose how your devices connect. Based on your selection, Azure uses or creates a DPS instance and one or more IoT hubs.

Select **Use existing resources** or **Create new resources**.

If you select **Create new resources**, choose an IoT Hub preset:

| Preset | Devices | Connectivity | Telemetry | Resources created |
| --- | --- | --- | --- | --- |
| Small scale or pilot deployment | Up to approximately 10,000 | Intermittent connections | Lower telemetry volume | One IoT Hub instance (S1) with one unit |
| Production deployment | 10,000-100,000 | Mixed connectivity | Moderate throughput | Two IoT Hub instances (S2) with five units, to separate and scale workloads |
| Large scale or high-throughput deployment | 1,000,000+ | Mostly always on | High telemetry volume | Four IoT Hub instances (S3) for high throughput and horizontal scaling |

Presets determine how many IoT Hub instances are created and connect them to a provisioning service. You can customize the configuration now and add more IoT Hub instances after onboarding.

If you select **Use existing resources**, choose whether to connect an **Existing DPS linked to IoT Hub instances** or **Existing IoT Hub instances**. Under **Choose a linked setup**, select a setup from the list. The list is filtered to the namespace's region, and only IoT Hub instances with public network access enabled appear.

Connecting an existing DPS instance or IoT hub to the namespace is permanent.

### 3. Capabilities

On the **Capabilities** page, choose which capabilities to enable. Azure sets up the required resources based on your selection.

- **Certificate management** is enabled by default and uses a Microsoft-issued root certificate authority. You can bring your own certificate authority or change it later.
- **Software updates (preview)** is optional. If you enable it, Azure creates a software update instance with a default configuration. Select **Configure** to change the instance name before you continue. The instance's region matches the namespace and can't be changed.

### 4. Review + create

On the **Review + create** page, review the impact summary, namespace details, connectivity setup, and enabled capabilities before you submit:

- An **Impact summary** lists the services that are added to the subscription and resource group.
- Existing resources and resources created for you are both labeled in the namespace and connectivity blocks. Select the pencil icon next to a resource to change settings such as name, SKU, or daily message limit before you submit.
- A warning states that connecting these services is an irreversible action that can cause downtime for existing management services.

> [!NOTE]
> Estimated cost information isn't currently shown during setup.

Select **Submit**. After setup finishes, the guided setup opens the namespace, where you can view the connected services on the **Connected Services** tab.

## Connect services individually

If you want full control over each resource, connect services to a namespace one at a time instead of using the guided setup. Connect services in the following order: Device Provisioning Service, IoT Hub, and then software updates. This method produces the same connected result as the guided setup.

### 1. Create or open a namespace

# [Azure portal](#tab/azure-portal)

Create an Azure Device Registry namespace, or open an existing namespace to add services to it. The namespace is the organizational and security boundary for the devices and resources in your solution.

:::image type="content" source="media/get-started-azure-device-registry/get-started-manual.png" alt-text="Screenshot that shows the Connected Services tab of an Azure Device Registry namespace in the Azure portal." lightbox="media/get-started-azure-device-registry/get-started-manual.png":::

Open the namespace and select the **Connected Services** tab. Use the **+ Connect** menu to add services one at a time.

# [Azure CLI](#tab/azure-cli)

The CLI steps use Bash syntax. The `link` commands in the following steps create any missing role assignments between the namespace and the connected services. If your account can't create role assignments, a command stops before it changes the namespace and prints the commands that someone with the required permissions must run.

Set the values that the commands reuse:

```azurecli
az account set --subscription <subscription-id>
RG=<resource-group>
LOCATION=<region>
NS=<namespace-name>
DPS=<dps-name>
HUB=<iot-hub-name>
SU=<software-update-instance-name>
```

Create a namespace that uses its system-assigned managed identity to call the services that you connect. Skip this command if you're using an existing namespace.

```azurecli
az iot adr ns create --name $NS --resource-group $RG --location $LOCATION --outbound-system-assigned-mi true
```

---

### 2. Connect a Device Provisioning Service instance

# [Azure portal](#tab/azure-portal)

Select **+ Connect** > **Device Provisioning Service (DPS)**, and then choose how to connect this service:

- **Use existing**: Select an unconnected DPS instance and its linked IoT hubs in the namespace's region.
- **Create new**: Select the subscription and resource group, and then enter a name for the new DPS instance. The region matches the namespace and can't be changed.

Select **Save**.

# [Azure CLI](#tab/azure-cli)

You can connect only one DPS instance to a namespace. The DPS instance needs a system-assigned managed identity.

1. Use an existing DPS instance, or create a new one in the namespace's region:

   ```azurecli
   az iot dps create --name $DPS --resource-group $RG --location $LOCATION --system-assigned-mi
   ```

1. Get the resource ID of the DPS instance and connect it to the namespace:

   ```azurecli
   DPS_ID=$(az iot dps show --name $DPS --resource-group $RG --query id --output tsv)
   az iot adr ns link dps add --name primary-dps --ns $NS --resource-group $RG --dps-id $DPS_ID --system-assigned-mi true
   ```

---

### 3. Connect an IoT hub

# [Azure portal](#tab/azure-portal)

Select **+ Connect** > **IoT Hub**, and then choose how to connect this service:

- **Use existing**: Connect an existing IoT hub.
- **Create new**: Select the subscription and resource group, and then enter a name, SKU, and daily message limit for the new IoT hub. The region matches the namespace and can't be changed.

When you connect an existing IoT hub, acknowledge that linking it to the namespace is permanent.

:::image type="content" source="media/get-started-azure-device-registry/get-started-connect.png" alt-text="Screenshot that shows connecting a Device Provisioning Service instance to an Azure Device Registry namespace." lightbox="media/get-started-azure-device-registry/get-started-connect.png":::

# [Azure CLI](#tab/azure-cli)

Connect the DPS instance before you connect an IoT hub. The command fails if the namespace doesn't have a connected DPS instance. The IoT hub must be a standard tier hub, such as S1, with a system-assigned managed identity.

1. Use an existing IoT hub, or create a new one in the namespace's region:

   ```azurecli
   az iot hub create --name $HUB --resource-group $RG --location $LOCATION --sku S1 --system-assigned-mi
   ```

1. Get the resource ID of the IoT hub and connect it to the namespace:

   ```azurecli
   HUB_ID=$(az iot hub show --name $HUB --resource-group $RG --query id --output tsv)
   az iot adr ns link hub add --name primary-hub --ns $NS --resource-group $RG --hub-id $HUB_ID --system-assigned-mi true
   ```

To connect more IoT hubs, repeat these steps with a different IoT hub and endpoint name.

---

### 4. Connect software updates (optional)

# [Azure portal](#tab/azure-portal)

Select **+ Connect** > **Software updates**, and then enter a name for the new software update instance. The subscription, resource group, and region match the namespace and can't be changed.

# [Azure CLI](#tab/azure-cli)

Only one software update instance can connect to a namespace.

1. Create a software update instance with a system-assigned managed identity:

   ```azurecli
   az iot adr ns su instance create --name $SU --resource-group $RG --location $LOCATION --system-assigned-mi true
   ```

1. Get the resource ID of the instance and connect it to the namespace:

   ```azurecli
   SU_ID=$(az iot adr ns su instance show --name $SU --resource-group $RG --query id --output tsv)
   az iot adr ns link su add --name primary-su --ns $NS --resource-group $RG --su-id $SU_ID --system-assigned-mi true
   ```

---

### 5. Verify the connected resources

# [Azure portal](#tab/azure-portal)

On the namespace's **Connected Services** tab, confirm that the resources you connected show a **Health** status of **Available** and a **Configuration status** of **Succeeded**. Your namespace is ready when all the services you need appear as connected.

# [Azure CLI](#tab/azure-cli)

List the connected services and confirm that each one reports a `linkingState` of `Succeeded`:

```azurecli
az iot adr ns link dps list --ns $NS --resource-group $RG
az iot adr ns link hub list --ns $NS --resource-group $RG
az iot adr ns link su list --ns $NS --resource-group $RG
```

If a `link add` command returns before the link finishes, run the matching `link <service> wait` command to track it.

---

## Resource naming

The guided setup suggests resource names based on the namespace name. You can change the suggested names before you submit them.

For example, if the namespace name is `contoso-devices`, the guided setup suggests the following names:

| Resource | Suggested name pattern | Example |
| --- | --- | --- |
| Azure Device Registry namespace | `<namespace-name>` | `contoso-devices` |
| IoT Hub | `<namespace-name>-hub-<number>` | `contoso-devices-hub-1` |
| Device Provisioning Service | `<namespace-name>-provisioning` | `contoso-devices-provisioning` |
| Software update instance | `<namespace-name>-su` | `contoso-devices-su` |

## Manage connected resources

Connecting services to a namespace doesn't replace their individual management experiences. To change IoT Hub settings, open the IoT hub in the Azure portal. To change DPS settings, open the DPS instance in the Azure portal.

## Next steps

- Learn how to [plan Azure Device Registry namespaces](best-practices-namespaces.md).
- Learn about [certificate management in Azure Device Registry](../iot-certificate-management-overview.md).
- Learn about [Azure Device Registry integration with Azure IoT Hub](../../iot-hub/iot-hub-device-registry-overview.md).
