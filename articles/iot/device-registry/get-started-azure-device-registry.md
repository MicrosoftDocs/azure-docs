---
title: Get started with Azure Device Registry for Azure IoT Hub (preview)
titleSuffix: Azure Device Registry
description: Set up an Azure Device Registry namespace for Azure IoT Hub with guided setup in the Azure portal, or link services individually with the portal or Azure CLI.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot
ms.topic: how-to
ms.date: 11/09/2026
ai-usage: ai-assisted

#Customer intent: As an IoT solution architect, I want to set up an Azure Device Registry namespace with either guided setup or by connecting services individually so that I can deploy or connect the resources required for my IoT devices.
---

# Get started with Azure Device Registry for Azure IoT Hub (preview)

Set up an [Azure Device Registry](overview-device-registry.md) (ADR) namespace with Azure IoT Hub and Device Provisioning Service (DPS). Use the guided setup to create resources or reuse existing ones, or link services individually for more control. You can also enable certificate management and the software update feature where supported.

This article covers namespace and service setup, the first stage of connecting a device. The complete process is:

1. [Set up your namespace and link new or existing IoT Hub and DPS instances](#ways-to-get-started) by following this article.
1. If you use certificate management, [create an intermediate certificate authority (CA)](../how-to-create-policy.md#create-an-intermediate-certificate-authority) and [create a certificate policy](../how-to-create-edit-certificate-policy.md#create-a-certificate-policy).
1. [Create a device enrollment in DPS](../../iot-dps/how-to-manage-enrollments.md?tabs=x509). If you use certificate management, [select the certificate policy in that enrollment](../how-to-create-edit-certificate-policy.md#select-a-certificate-policy-in-your-dps-enrollment).
1. [Provision and connect your device with the unified Azure IoT SDKs](concept-unified-iot-sdks.md#choose-the-unified-azure-iot-sdk).

After you finish either setup method in this article, follow [Next steps](#next-steps) to continue the remaining stages.

> [!IMPORTANT]
> Azure Device Registry integration with Azure IoT Hub is in public preview and isn't recommended for production workloads. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

> [!IMPORTANT]
> Azure Device Registry, including certificate management, is free during preview. The IoT Hub and Device Provisioning Service (DPS) instances that you use with it are billed at their standard rates. For details, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

## Prerequisites

- An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- The `Microsoft.DeviceRegistry` and `Microsoft.Devices` resource providers registered in your subscription. If you plan to use software update, also register `Microsoft.DeviceUpdate`. You need subscription-level permission if you register them yourself. For instructions, see [Register a resource provider](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).
- An existing resource group, or permission to create one in your subscription.
- Permission to create and configure Azure Device Registry namespaces, IoT Hub instances, DPS instances, and managed identities in the target scope, plus software update instances if you enable software update. For example, the [Contributor](../../role-based-access-control/built-in-roles/privileged.md#contributor) role on the target resource group grants these resource-management permissions. The Owner role also grants them.
- The privilege to perform role assignments within your target scope. Performing role assignments in Azure requires a [privileged role](../../role-based-access-control/built-in-roles.md#privileged), such as Owner or User Access Administrator at the appropriate scope. If you reuse resources outside the target resource group, you also need the required access at those resource scopes.
- A [supported region](../../iot-hub/iot-hub-what-is-new.md#supported-regions) for Azure Device Registry with IoT Hub. New services use the namespace's region.

> [!WARNING]
> Connecting an existing IoT Hub instance or DPS instance to an Azure Device Registry namespace is permanent and can't be reversed. You're asked to acknowledge this effect when you select an existing resource.

## Ways to get started

You can set up Azure Device Registry in two ways:

- [Use the guided setup](#use-the-guided-setup). Create or select a namespace and connect its services in one flow.
- [Connect services individually](#connect-services-individually). Choose each resource separately or add services to an existing namespace.

For equivalent choices, both methods set up a namespace with linked IoT Hub and DPS instances and your selected capabilities.

The guided setup is available only in the Azure portal. When you connect services individually, you can use the Azure portal or the Azure CLI.

### Use existing IoT Hub and DPS instances

Use IoT Hub and DPS instances in the namespace's region, and wait for them to finish provisioning before linking them. IoT Hub instances need a managed identity and public network access enabled.

To select **Existing IoT Hub instances**, use hubs that aren't already linked to a namespace or DPS instance. Their connection profile must match the profile selected for the namespace.

To select **Existing DPS linked to IoT Hub instances**, use a DPS instance that isn't already linked to a namespace and has at least one linked hub. The DPS instance and all its linked hubs must be in the selected subscription and region. Its hubs must use the same connection profile, must not belong to another namespace, and must fit within the namespace's remaining hub capacity.

The linked hubs determine the connection profile for an existing DPS setup.

In the portal, open **IoT Hub requirements** or **DPS setup requirements** beside the selector for details. Unavailable entries can't be selected.

## Use the guided setup

You can start the guided setup from either of these locations in the Azure portal:

- Search for **Azure Device Registry** in the [Azure portal](https://portal.azure.com/). Open the service page, and on the **Get started** tab, select **Get started**.
- From an existing namespace, on the **Get started** tab, select **Set up** under **Set up your solution**. Only namespaces that still need setup are eligible. To add services to a namespace that already has a linked DPS instance, [link services individually](#connect-services-individually).

:::image type="content" source="media/get-started-azure-device-registry/get-started-quickstart.png" alt-text="Screenshot of the Azure Device Registry Get started tab with the Get started action." lightbox="media/get-started-azure-device-registry/get-started-quickstart.png":::

The guided setup walks you through four steps: **ADR namespace**, **Connectivity**, **Capabilities**, and **Review + create**.

### 1. ADR namespace

On the **ADR namespace** page:

1. Select whether to **Create a namespace** or **Use an existing namespace**.
1. Select the Azure subscription and resource group.
1. If you create a namespace, enter a **Namespace name** with 3-60 lowercase letters, numbers, or hyphens, and select a region. Setup uses the name to suggest names for new services.
1. If you use an existing namespace, select it from the eligible namespaces. Its region determines where services are created and which existing services you can select.

To reuse existing DPS or IoT Hub instances, select their subscription and region.

:::image type="content" source="media/get-started-azure-device-registry/get-started-namespace.png" alt-text="Screenshot of the ADR namespace step with options to create or use an existing namespace and fields for subscription, resource group, namespace name, and region." lightbox="media/get-started-azure-device-registry/get-started-namespace.png":::

### 2. Connectivity

On the **Connectivity** page, choose how your devices connect. Based on your selection, Azure uses or creates a DPS instance and one or more IoT Hub instances.

Select one of these paths:

- **Create new DPS and IoT Hub instances**: Choose a connection profile and a fleet preset. Azure creates one IoT Hub instance and a DPS instance.
- **Use existing IoT Hub instances**: Choose **Existing DPS linked to IoT Hub instances** to reuse a DPS setup, or **Existing IoT Hub instances** to select hubs and create a new DPS instance.

For new resources or standalone existing hubs, select the **Classic** connection profile for MQTT 3.1.1, AMQP, or HTTPS, or the **MQTT v5 (preview)** connection profile for MQTT 5. For an existing DPS setup, its linked hubs determine the connection profile. The **MQTT v5 (preview)** connection profile is available only in supported regions and doesn't support certificate management or software update.

Each preset creates one IoT Hub instance with the following default capacity. You can configure it before continuing and add more hubs later.

| Preset | Classic connection profile | MQTT v5 (preview) connection profile |
| --- | --- | --- |
| Small connected fleet | S1, 1 unit | 1 unit |
| Growing fleet | S2, 2 units | 10 units |
| Large-scale fleet | S3, 3 units | 25 units |

:::image type="content" source="media/get-started-azure-device-registry/get-started-connectivity.png" alt-text="Screenshot of the Connectivity step with new DPS and IoT Hub instances, the Classic connection profile, and three fleet presets." lightbox="media/get-started-azure-device-registry/get-started-connectivity.png":::

If you reuse resources, check the [existing-resource requirements](#use-existing-iot-hub-and-dps-instances) before selecting them.

You can select up to 10 IoT Hub instances. Linking existing resources is permanent.

### 3. Capabilities

On the **Capabilities** page, choose which capabilities to enable. Azure sets up the required resources based on your selection.

- **Certificate management** is selected by default for supported hubs. It creates a Microsoft-issued root CA, or reuses the namespace's existing root CA. Creating an intermediate CA and certificate policy is a [separate step](../how-to-create-policy.md).
- **Software update (preview)** is optional. Azure creates an update instance with a default configuration. Select the edit icon on its card to change its settings before continuing. This option is unavailable if a selected hub already has Azure Device Update configured.

> [!NOTE]
> Setting up the software update feature can take up to 30 minutes.

For the **MQTT v5 (preview)** connection profile, both capabilities are unavailable.

:::image type="content" source="media/get-started-azure-device-registry/get-started-capabilities.png" alt-text="Screenshot of the Capabilities step with certificate management and software update selected." lightbox="media/get-started-azure-device-registry/get-started-capabilities.png":::

### 4. Review + create

On the **Review + create** page, review the impact summary, namespace details, connectivity setup, and enabled capabilities before you submit:

- An **Impact summary** lists the services that are added to the subscription and resource group.
- Check the existing resources, resources to be created, and selected capabilities. Return to the relevant step to change a selection or configure a resource.
- A warning states that connecting these services is an irreversible action that can cause downtime for existing management services.

Review the cost estimate shown during setup. Availability and amounts depend on the selected resources and pricing information.

Submit the setup and wait for the deployment to finish. Keep the page open while resources are being created. If a step fails, review the error and use **Retry** or **Return to edit**, as available. After a successful deployment, setup opens the namespace. Select **Linked services** to review the connected resources.

Continue with [Next steps](#next-steps) to prepare and connect your first device.

## Connect services individually

Use this path to choose resources individually or add services to an existing namespace. Link a DPS instance first, then one or more IoT Hub instances. Set up a root CA if you want certificate management, and optionally link a software update instance.

The CLI walkthrough creates an S1 IoT Hub instance with the **Classic** connection profile and uses system-assigned managed identities. This profile supports the optional certificate-management and software update steps.

> [!NOTE]
> For the **MQTT v5 (preview)** connection profile, use the [guided setup](#use-the-guided-setup) or the Azure portal option in [Connect an IoT Hub instance](#3-connect-an-iot-hub-instance). Create a new hub or select existing hubs with that profile; all hubs in the namespace must use the same profile. After linking, go to [Verify the linked resources](#6-verify-the-linked-resources). The root CA and software update steps apply to the **Classic** connection profile.

The examples use one resource group. If you reuse services in other groups, use their resource groups in the service lookup commands and the namespace's resource group in the link commands.

### Azure CLI setup

If you use the CLI tabs, install the [Azure CLI](/cli/azure/install-azure-cli) and choose one version of the `azure-iot` extension.

Use preview version `1.1.0b1` to follow all steps, including optional preview features. The preview extension supports both generally available and preview features:

```azurecli
az login
az extension add --name azure-iot --version 1.1.0b1 --allow-preview true --upgrade
```

If you use only generally available features, install stable version `1.0.0` instead:

```azurecli
az login
az extension add --name azure-iot --version 1.0.0 --upgrade
```

Confirm the installed version:

```azurecli
az extension show --name azure-iot --query version -o tsv
```

Linking can take several minutes while managed-identity permissions propagate. Let each command finish before continuing.

### 1. Create or open a namespace

# [Azure portal](#tab/azure-portal)

Create an Azure Device Registry namespace, or open an existing namespace to add services to it. The namespace is the organizational and security boundary for the devices and resources in your solution.

Open the namespace and select the **Linked services** tab. Use the **Connect** menu to add services one at a time.

The **IoT Hub** option is unavailable until a DPS instance is linked.

:::image type="content" source="media/get-started-azure-device-registry/get-started-connect.png" alt-text="Screenshot of the Linked services Connect menu with IoT Hub unavailable before a DPS instance is linked." lightbox="media/get-started-azure-device-registry/get-started-connect.png":::

# [Azure CLI (Bash)](#tab/azure-cli)

The CLI steps use Bash syntax. The `link` commands in the following steps create any missing role assignments between the namespace and the connected services. If your account can't create role assignments, a command stops before it changes the namespace and prints the commands that someone with the required permissions must run.

Set the values that the commands reuse. Replace the angle-bracketed placeholders with your own values:

```azurecli
az account set --subscription "<subscription-id>"
RG="<resource-group>"
LOCATION="<region>"
NS="<namespace-name>"
DPS="<dps-name>"
HUB="<iot-hub-name>"
ROOT_CA="<root-ca-name>"
SU="<software-update-instance-name>"
```

If you're creating resources in a new resource group, create it first. Skip this command if you're using an existing resource group.

```azurecli
az group create --name $RG --location $LOCATION
```

Create a namespace that uses its system-assigned managed identity to call the services that you connect. Skip this command if you're using an existing namespace.

```azurecli
az iot adr ns create --name $NS --resource-group $RG --location $LOCATION --outbound-system-assigned-mi true
```

For an existing namespace, check its managed identity configuration:

```azurecli
az iot adr ns show --name $NS --resource-group $RG --query "{identityType:identity.type,outboundIdentity:properties.outboundIdentity}"
```

If `identityType` doesn't include `SystemAssigned`, enable the namespace's system-assigned identity. DPS linking requires it even if the outbound identity is user-assigned. Skip this command if the system-assigned identity is already enabled.

```azurecli
az iot adr ns identity assign --name $NS --resource-group $RG --system-assigned true
```

If `outboundIdentity` is null, enable its system-assigned outbound identity. Keep any existing user-assigned outbound identity.

```azurecli
az iot adr ns update --name $NS --resource-group $RG --outbound-system-assigned-mi true
```

# [Azure CLI (PowerShell)](#tab/azure-cli-powershell)

The CLI steps use PowerShell syntax. The `link` commands in the following steps create any missing role assignments between the namespace and the connected services. If your account can't create role assignments, a command stops before it changes the namespace and prints the commands that someone with the required permissions must run.

Set the values that the commands reuse. Replace the angle-bracketed placeholders with your own values:

```powershell
az account set --subscription "<subscription-id>"
$RG = "<resource-group>"
$LOCATION = "<region>"
$NS = "<namespace-name>"
$DPS = "<dps-name>"
$HUB = "<iot-hub-name>"
$ROOT_CA = "<root-ca-name>"
$SU = "<software-update-instance-name>"
```

If you're creating resources in a new resource group, create it first. Skip this command if you're using an existing resource group.

```powershell
az group create --name $RG --location $LOCATION
```

Create a namespace that uses its system-assigned managed identity to call the services that you connect. Skip this command if you're using an existing namespace.

```powershell
az iot adr ns create --name $NS --resource-group $RG --location $LOCATION --outbound-system-assigned-mi true
```

For an existing namespace, check its managed identity configuration:

```powershell
az iot adr ns show --name $NS --resource-group $RG --query "{identityType:identity.type,outboundIdentity:properties.outboundIdentity}"
```

If `identityType` doesn't include `SystemAssigned`, enable the namespace's system-assigned identity. DPS linking requires it even if the outbound identity is user-assigned. Skip this command if the system-assigned identity is already enabled.

```powershell
az iot adr ns identity assign --name $NS --resource-group $RG --system-assigned true
```

If `outboundIdentity` is null, enable its system-assigned outbound identity. Keep any existing user-assigned outbound identity.

```powershell
az iot adr ns update --name $NS --resource-group $RG --outbound-system-assigned-mi true
```

---

### 2. Connect a Device Provisioning Service instance

If you reuse a DPS instance, check the [existing-resource requirements](#use-existing-iot-hub-and-dps-instances) first.

# [Azure portal](#tab/azure-portal)

Select **Connect** > **Device Provisioning Service (DPS)**, and choose how to link this service:

- **Use existing**: Select an unconnected DPS instance and its linked IoT Hub instances in the namespace's region.
- **Create new**: Select the subscription and resource group, enter a name, and review the managed identity configuration. The region matches the namespace.

Select **Save**.

# [Azure CLI (Bash)](#tab/azure-cli)

You can link only one DPS instance to a namespace. These examples use its system-assigned managed identity. If you reuse a DPS instance, ensure that identity is enabled before continuing.

1. Use an existing DPS instance, or create a new one in the namespace's region:

   ```azurecli
   az iot dps create --name $DPS --resource-group $RG --location $LOCATION --system-assigned-mi
   ```

1. Get the resource ID of the DPS instance and connect it to the namespace:

   ```azurecli
   DPS_ID=$(az iot dps show --name $DPS --resource-group $RG --query id --output tsv)
   az iot adr ns link dps add --name primary-dps --ns $NS --resource-group $RG --dps-id $DPS_ID --system-assigned-mi true
   ```

# [Azure CLI (PowerShell)](#tab/azure-cli-powershell)

You can link only one DPS instance to a namespace. These examples use its system-assigned managed identity. If you reuse a DPS instance, ensure that identity is enabled before continuing.

1. Use an existing DPS instance, or create a new one in the namespace's region:

   ```powershell
   az iot dps create --name $DPS --resource-group $RG --location $LOCATION --system-assigned-mi
   ```

1. Get the resource ID of the DPS instance and connect it to the namespace:

   ```powershell
   $DPS_ID = az iot dps show --name $DPS --resource-group $RG --query id --output tsv
   az iot adr ns link dps add --name primary-dps --ns $NS --resource-group $RG --dps-id $DPS_ID --system-assigned-mi true
   ```

---

### 3. Connect an IoT Hub instance

If you reuse an IoT Hub instance, check the [existing-resource requirements](#use-existing-iot-hub-and-dps-instances) first.

# [Azure portal](#tab/azure-portal)

Select **Connect** > **IoT Hub**, and review the connection profile. Choose **Classic** or **MQTT v5 (preview)** if the profile isn't already set by the namespace's existing resources. All hubs you add must match this profile.

Choose how to link this service:

- **Use existing**: Connect an existing IoT Hub instance.
- **Create new**: Select the subscription and resource group, and configure the hub's name, capacity, and managed identity. Its region matches the namespace.

When you connect an existing IoT Hub instance, acknowledge that linking it to the namespace is permanent.

Select **Save**.

# [Azure CLI (Bash)](#tab/azure-cli)

Link a DPS instance before linking an IoT Hub instance. The hub must use a Standard S-tier SKU, such as S1, and have a system-assigned managed identity.

1. Use an existing IoT Hub instance, or create a new one in the namespace's region:

   ```azurecli
   az iot hub create --name $HUB --resource-group $RG --location $LOCATION --sku S1 --system-assigned-mi
   ```

1. Give the DPS identity permission to provision devices on the hub. Assign this role to the service identity, not to your user account. Skip only `az role assignment create` if the identity already has the role on the hub or a parent scope:

   ```azurecli
   HUB_ID=$(az iot hub show --name $HUB --resource-group $RG --query id --output tsv)
   DPS_PRINCIPAL_ID=$(az iot dps show --name $DPS --resource-group $RG --query identity.principalId --output tsv)
   az role assignment create --assignee-object-id "$DPS_PRINCIPAL_ID" --assignee-principal-type ServicePrincipal --role "IoT Hub Data Contributor" --scope "$HUB_ID"
   ```

   Allow new role assignments to propagate before testing device provisioning.

1. Link the hub to the namespace. Enable it for new device provisioning with an allocation weight of 1:

   ```azurecli
   az iot adr ns link hub add --name primary-hub --ns $NS --resource-group $RG --hub-id $HUB_ID --system-assigned-mi true --availability Available --allocation-weight 1
   ```

To connect more IoT Hub instances, repeat these steps with a different IoT Hub instance and a unique endpoint name.

# [Azure CLI (PowerShell)](#tab/azure-cli-powershell)

Link a DPS instance before linking an IoT Hub instance. The hub must use a Standard S-tier SKU, such as S1, and have a system-assigned managed identity.

1. Use an existing IoT Hub instance, or create a new one in the namespace's region:

   ```powershell
   az iot hub create --name $HUB --resource-group $RG --location $LOCATION --sku S1 --system-assigned-mi
   ```

1. Give the DPS identity permission to provision devices on the hub. Assign this role to the service identity, not to your user account. Skip only `az role assignment create` if the identity already has the role on the hub or a parent scope:

   ```powershell
   $HUB_ID = az iot hub show --name $HUB --resource-group $RG --query id --output tsv
   $DPS_PRINCIPAL_ID = az iot dps show --name $DPS --resource-group $RG --query identity.principalId --output tsv
   az role assignment create --assignee-object-id "$DPS_PRINCIPAL_ID" --assignee-principal-type ServicePrincipal --role "IoT Hub Data Contributor" --scope "$HUB_ID"
   ```

   Allow new role assignments to propagate before testing device provisioning.

1. Link the hub to the namespace. Enable it for new device provisioning with an allocation weight of 1:

   ```powershell
   az iot adr ns link hub add --name primary-hub --ns $NS --resource-group $RG --hub-id $HUB_ID --system-assigned-mi true --availability Available --allocation-weight 1
   ```

To connect more IoT Hub instances, repeat these steps with a different IoT Hub instance and a unique endpoint name.

---

### 4. Set up a root certificate authority (optional)

To match guided setup with certificate management selected, create a Microsoft-issued root CA. Skip creation if the namespace already has one. Certificate management isn't supported for the **MQTT v5 (preview)** connection profile.

# [Azure portal](#tab/azure-portal)

1. In the namespace, under **Security**, select **Certificate authorities**.
1. Select **Create** > **Root certificate authority**.
1. Enter a name with 3-63 letters, numbers, or hyphens, starting with a letter or number, and select **Create**.
1. Wait for provisioning to finish and confirm that the root CA appears.

# [Azure CLI (Bash)](#tab/azure-cli)

Create the root CA and verify that provisioning succeeded:

```azurecli
az iot adr ns ca create --name "$ROOT_CA" --ns "$NS" --resource-group "$RG" --type Root
az iot adr ns ca show --name "$ROOT_CA" --ns "$NS" --resource-group "$RG"
```

# [Azure CLI (PowerShell)](#tab/azure-cli-powershell)

Create the root CA and verify that provisioning succeeded:

```powershell
az iot adr ns ca create --name "$ROOT_CA" --ns "$NS" --resource-group "$RG" --type Root
az iot adr ns ca show --name "$ROOT_CA" --ns "$NS" --resource-group "$RG"
```

---

To issue device certificates, you still need an intermediate CA and certificate policy. Continue with [Set up a managed root and intermediate CA](../how-to-create-policy.md#create-an-intermediate-certificate-authority) after linking the services.

### 5. Connect a software update instance (optional)

> [!NOTE]
> Setting up the software update feature can take up to 30 minutes.

The software update feature isn't supported for the **MQTT v5 (preview)** connection profile. If a hub already has Azure Device Update configured, resolve that configuration before configuring software update for the namespace.

# [Azure portal](#tab/azure-portal)

Select **Connect** > **Software update (preview)** and configure the new update instance. Its subscription, resource group, and region match the namespace.

Select **Save**.

# [Azure CLI (Bash)](#tab/azure-cli)

Only one software update instance can connect to a namespace.

1. Create a software update instance with a system-assigned managed identity, then wait for provisioning to finish:

   ```azurecli
   az iot adr ns su instance create --name $SU --resource-group $RG --location $LOCATION --system-assigned-mi true --no-wait
   az iot adr ns su instance wait --name $SU --resource-group $RG --created --timeout 1800
   ```

1. Get the resource ID of the instance and connect it to the namespace:

   ```azurecli
   SU_ID=$(az iot adr ns su instance show --name $SU --resource-group $RG --query id --output tsv)
   az iot adr ns link su add --name primary-su --ns $NS --resource-group $RG --su-id $SU_ID --system-assigned-mi true --timeout 1800
   ```

# [Azure CLI (PowerShell)](#tab/azure-cli-powershell)

Only one software update instance can connect to a namespace.

1. Create a software update instance with a system-assigned managed identity, then wait for provisioning to finish:

   ```powershell
   az iot adr ns su instance create --name $SU --resource-group $RG --location $LOCATION --system-assigned-mi true --no-wait
   az iot adr ns su instance wait --name $SU --resource-group $RG --created --timeout 1800
   ```

1. Get the resource ID of the instance and connect it to the namespace:

   ```powershell
   $SU_ID = az iot adr ns su instance show --name $SU --resource-group $RG --query id --output tsv
   az iot adr ns link su add --name primary-su --ns $NS --resource-group $RG --su-id $SU_ID --system-assigned-mi true --timeout 1800
   ```

---

### 6. Verify the linked resources

# [Azure portal](#tab/azure-portal)

On the namespace's **Linked services** tab, confirm that the resources show a **Health** status of **Available** and a **Link status** of **Linked**. If you enabled certificate management, also confirm that the root CA finished provisioning under **Security** > **Certificate authorities**.

:::image type="content" source="media/get-started-azure-device-registry/get-started-linked-services.png" alt-text="Screenshot of Linked services showing a software update instance, IoT Hub, and DPS with Available health and Linked status." lightbox="media/get-started-azure-device-registry/get-started-linked-services.png":::

# [Azure CLI (Bash)](#tab/azure-cli)

List the connected services and confirm that each one reports a `linkingState` of `Succeeded`:

```azurecli
az iot adr ns link dps list --ns $NS --resource-group $RG
az iot adr ns link hub list --ns $NS --resource-group $RG --output json
```

For the hub, also confirm that `provisioning.availability` is `Available` and `provisioning.allocationWeight` is `1`. A successful link alone doesn't confirm that the hub is enabled for new device provisioning.

If you connected a software update instance, verify that connection too:

```azurecli
az iot adr ns link su list --ns $NS --resource-group $RG
```

If a `link add` command returns before the link finishes, use [az iot adr ns link wait](/cli/azure/iot/adr/ns/link#az-iot-adr-ns-link-wait) to wait for all configured links to succeed:

```azurecli
az iot adr ns link wait --ns $NS --resource-group $RG
```

# [Azure CLI (PowerShell)](#tab/azure-cli-powershell)

List the connected services and confirm that each one reports a `linkingState` of `Succeeded`:

```powershell
az iot adr ns link dps list --ns $NS --resource-group $RG
az iot adr ns link hub list --ns $NS --resource-group $RG --output json
```

For the hub, also confirm that `provisioning.availability` is `Available` and `provisioning.allocationWeight` is `1`. A successful link alone doesn't confirm that the hub is enabled for new device provisioning.

If you connected a software update instance, verify that connection too:

```powershell
az iot adr ns link su list --ns $NS --resource-group $RG
```

If a `link add` command returns before the link finishes, use [az iot adr ns link wait](/cli/azure/iot/adr/ns/link#az-iot-adr-ns-link-wait) to wait for all configured links to succeed:

```powershell
az iot adr ns link wait --ns $NS --resource-group $RG
```

---

Continue with [Next steps](#next-steps) to prepare and connect your first device.

## Resource naming

The guided setup suggests resource names based on the namespace name. You can change the suggested names before you submit them.

For example, if the namespace name is `contoso-devices`, the guided setup suggests the following names:

| Resource | Suggested name pattern | Example |
| --- | --- | --- |
| Azure Device Registry namespace | `<namespace-name>` | `contoso-devices` |
| IoT Hub instance | `<namespace-name>-hub-<number>` | `contoso-devices-hub-1` |
| Device Provisioning Service | `<namespace-name>-provisioning` | `contoso-devices-provisioning` |
| Root certificate authority | `<namespace-name>-root-ca` | `contoso-devices-root-ca` |
| Software update instance | `<namespace-name>-su` | `contoso-devices-su` |

## Manage linked resources

Connecting services to a namespace doesn't replace their individual management experiences. To change settings for an IoT Hub instance, open the instance in the Azure portal. To change DPS settings, open the DPS instance in the Azure portal.

## Next steps

Your namespace and selected services are configured. If you enabled certificate management, follow these steps in order. The device uses separate [onboarding and operational credentials](../iot-certificate-management-overview.md#onboarding-vs-operational-credentials-for-devices).

1. [Create an intermediate CA](../how-to-create-policy.md#create-an-intermediate-certificate-authority) that uses your namespace's existing root CA, then [create a certificate policy](../how-to-create-edit-certificate-policy.md#create-a-certificate-policy).
1. [Create a device enrollment](../../iot-dps/how-to-manage-enrollments.md?tabs=x509) in the DPS instance already linked to your namespace, and configure it for the onboarding credential your device will use.
1. [Select your intermediate CA and certificate policy in the new enrollment](../how-to-create-edit-certificate-policy.md#select-a-certificate-policy-in-your-dps-enrollment).
1. Use the [unified Azure IoT SDKs](concept-unified-iot-sdks.md#choose-the-unified-azure-iot-sdk) to send a certificate signing request during DPS provisioning and connect to the assigned IoT Hub with the issued certificate.

### Other connection paths

- For the **Classic** connection profile, try provisioning without managed certificate issuance by following [Provision a simulated symmetric key device](../../iot-dps/quick-create-simulated-device-symm-key.md). Use the DPS and hubs you linked here rather than repeating the service-setup prerequisite.
- For the **MQTT v5 (preview)** connection profile, review the [SDK documentation and samples](concept-unified-iot-sdks.md#choose-the-unified-azure-iot-sdk) for version-specific protocol support before choosing a device client.
