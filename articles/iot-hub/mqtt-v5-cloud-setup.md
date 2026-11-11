---
title: Set up Azure IoT Hub with the MQTT v5 connection profile
titleSuffix: Azure IoT Hub
description: Create and configure Azure IoT Hub with the MQTT v5 connection profile and link it to Azure Device Registry and Device Provisioning Service.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: how-to
ms.date: 10/25/2026
ms.custom: references_regions
---

# Set up Azure IoT Hub with the MQTT v5 connection profile

Start your solution by creating and configuring an Azure IoT hub and linking
it to an Azure Device Registry (ADR) namespace and a Device Provisioning Service
(DPS) instance. These resources establish where devices connect, how they're
represented, and how they receive their hub assignment. Configure messaging
destinations before devices start publishing.

> [!IMPORTANT]
> Azure IoT Hub with the MQTT v5 connection profile is in preview. Review the
> [supported capabilities](mqtt-v5-capabilities.md) before creating resources.
> You select the profile when you create the hub. Changing the endpoint hostname
> doesn't change the profile of an existing hub.

## Prerequisites

- An Azure subscription.
- A region listed in [Supported regions](#supported-regions) and a resource
  configuration supported by the preview.
- The **Contributor** role to create and configure the IoT Hub, ADR namespace,
  and DPS resources, plus **User Access Administrator** or **Role Based Access
  Control Administrator** to create their required role assignments. These
  assignments must cover the resource groups or resources used in this walkthrough.
  **Owner** at the applicable scope includes both sets of permissions.
  Contributor alone doesn't allow role assignment. Role-assignment conditions
  and organizational policies can restrict the assignments you can create.
- Permission to create resource groups in the subscription if you create a new
  resource group.
- An onboarding plan: use an existing X.509 certificate and matching private key,
  or configure DPS certificate issuance with a symmetric key or X.509 onboarding
  credential. Devices connect to the hub using X.509 certificates in both cases.

These permissions are for the person performing setup. The roles assigned to
the services' managed identities are listed under
[Configure the linked resources](#configure-the-linked-resources).

Use a dedicated resource group for evaluation purposes. If you
use an existing environment, identify any shared resources before changing
permissions or policies.

## Supported regions

The MQTT v5 connection profile is available in the following regions during
preview. Create the IoT hub, ADR namespace, and DPS instance in the same supported
region.

| Region | CLI and ARM location value |
| --- | --- |
| Australia East | `australiaeast` |
| Central US | `centralus` |
| Japan East | `japaneast` |
| UK South | `uksouth` |
| West US | `westus` |

Use the corresponding location value wherever the CLI and ARM examples require
`<SUPPORTED_REGION>`.

## Understand the resource relationships

| Resource or capability | Role in the solution | Relationship to other resources |
| --- | --- | --- |
| IoT Hub | Accepts MQTT v5 device connections and routes incoming telemetry. | Associated with an ADR namespace and linked to a DPS instance. |
| ADR namespace | Provides the integrated device identity and management foundation. | Connects IoT Hub and DPS resources for device identity and management. |
| DPS instance | Authenticates provisioning requests and assigns devices to the configured hub. | Linked to IoT Hub and associated with the ADR namespace. Enrollment configuration determines how devices are provisioned. |
| Managed identities and role assignments | Managed identities are an Azure capability for service-to-service authentication without application-managed credentials. Role assignments grant permissions for supported operations. | Identities are assigned to resources that need access to other services. Role assignments grant access at the required scope. |

Don't use resource names alone to check associations. Resources with similar
names can exist in different subscriptions or resource groups.

An onboarding credential authenticates the device to DPS. Choose one of these
certificate paths:

- **Use an existing X.509 certificate.** Configure an X.509 enrollment and use
  the certificate for provisioning and the subsequent hub connection. This path
  doesn't require certificate issuance and is used by the main walkthrough.
- **Request an operational certificate through DPS.** Configure an ADR issuing
  CA and certificate policy, and reference them in the DPS enrollment. The device
  authenticates with its symmetric key or X.509 onboarding credential and submits
  a certificate signing request (CSR). DPS returns an ADR-issued operational
  X.509 certificate for connecting to the hub.

Direct operational certificate renewal through the MQTT v5 hub isn't supported
in this preview. Devices renew DPS-issued certificates through DPS.

## Create and configure the IoT hub and linked resources

Set up Azure IoT Hub with the MQTT v5 connection profile through either
of these paths:

- **Start from IoT Hub setup.** Create and configure the hub, then link it to
  an ADR namespace and a DPS instance as part of the hub setup.
- **Use ADR simplified onboarding.** Start from an ADR namespace and configure
  the connected services through the simplified onboarding flow. For this
  alternative path, see
  [Get started with Azure Device Registry for Azure IoT Hub](../iot/device-registry/get-started-azure-device-registry.md).

This article focuses on the first path: setting up the resources directly as
part of IoT Hub setup. Select the MQTT v5 connection profile when creating the
hub, and verify the result of each task before proceeding to device setup.

## Create Azure IoT Hub with the MQTT v5 connection profile

> [!IMPORTANT]
> Creating an IoT hub with the MQTT v5 connection profile doesn't make it ready
> for device connections. You must also link the hub to an Azure Device Registry
> (ADR) namespace and create or use a DPS instance linked to that namespace.
> Complete the required permissions and linking configuration before provisioning
> devices and connecting them to the hub.

Choose one of the following methods to create the hub. Select a region supported
by the preview and review
[IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/) before
creating the resource.

This section starts with hub creation. The **ARM template** tab also includes an optional
template for creating the supporting ADR and DPS resources. Resource creation
doesn't complete the solution: configure identities, associations, and enrollment
in the six tasks that follow, then configure routing before sending telemetry.

The CLI and ARM examples enable the hub's system-assigned managed identity.
They also allow service-side shared access signature (SAS) authentication for
evaluation tools that use service credentials. This setting doesn't enable SAS
device connections: devices still connect with X.509 certificates. Review
service authentication separately before using the configuration in production.

> [!IMPORTANT]
> Use a new, globally unique hub name. These examples are for creating a hub,
> not updating an existing one. An ARM deployment or REST `PUT` targeting an
> existing resource can change its configuration. Don't reuse an existing
> hub's name to try to change its connection profile.

### [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Create a resource**, search for **IoT Hub**, and select **Create**.
1. Select your subscription and an existing resource group, or create a resource
   group for this evaluation.
1. Enter a new, globally unique hub name and select a region supported by the
   preview.
1. For the configuration used in this article, select the **Standard** tier,
   **S1** size, and **1** unit.
1. On the **Networking** tab, under **Connection profile**, select
   **MQTT 5 (Preview)**. Don't select **Classic** for this walkthrough.
1. Select **Review + create**, review the configuration and estimated cost,
   and select **Create**.
1. Wait for deployment to finish, then select **Go to resource**.
1. Before linking the hub to ADR, enable its system-assigned managed identity:
   open **Security settings > Managed identity**, select **System assigned**,
   set **Status** to **On**, and select **Save**. Confirm the change.
   For more information, see
   [System-assigned managed identity](iot-hub-managed-identity.md#system-assigned-managed-identity).

If you use ADR guided onboarding to select this hub, use a namespace in the same
supported region. The existing-resource picker lists hubs with public network
access enabled. A private-only hub won't appear in that picker; don't change its
network access without reviewing your organization's requirements. Enabling the
managed identity is a linking prerequisite, not a guarantee that the hub appears
in the picker.

The portal steps here create the hub and enable its identity. The
[linked-resource tasks](#configure-the-linked-resources) use the CLI. For a
portal-based linking experience, follow
[ADR guided onboarding](../iot/device-registry/get-started-azure-device-registry.md#use-the-guided-setup).

Continue to [Verify the created hub](#verify-the-created-hub) before configuring
the linked resources.

### [Azure CLI](#tab/cli)

Use [Azure CLI](/cli/azure/install-azure-cli) **2.73 or later** and a preview
Azure IoT CLI extension that provides the MQTT v5 hub and ADR linking commands.
An older extension might not provide these commands. For general extension
management, see [Install and manage Azure CLI extensions](/cli/azure/azure-cli-extensions-overview).

Run the commands one step at a time. Replace the placeholders with your values,
using the same subscription, resource group, and hub name throughout. If a
command fails, resolve the error before continuing.

1. Sign in to Azure:

   ```azurecli
   az login
   ```

1. List the available subscriptions, then select the subscription for your hub:

   ```azurecli
   az account list --output table
   ```

   ```azurecli
   az account set --subscription "<SUBSCRIPTION_ID>"
   ```

   Confirm that the active subscription is the one you intend to use:

   ```azurecli
   az account show --query "{name:name,id:id}" --output table
   ```

1. Check the CLI and extension loaded in this terminal:

   ```azurecli
   az version
   ```

   ```azurecli
   az extension show --name azure-iot --query version --output tsv
   ```

   Verify that the extension provides the commands needed later:

   ```azurecli
   az iot hub create --help
   ```

   ```azurecli
   az iot adr ns link add --help
   ```

   Hub creation help must include `--connection-profile`, and link help must
   include `--hub-availability`. Don't continue with an extension that lacks
   these options.
   If you use a separate extension directory, select that same directory in
   every terminal used for this walkthrough.

1. Select a resource group. To use an existing group, check its name, location,
   and resource ID:

   ```azurecli
   az group show --name "<RESOURCE_GROUP_NAME>" --query "{name:name,location:location,id:id}" --output table
   ```

   Alternatively, create a new resource group for this evaluation:

   ```azurecli
   az group create --name "<RESOURCE_GROUP_NAME>" --location "<REGION>"
   ```

   Use this resource group name in the remaining commands. A resource group's
   location doesn't determine the region of the hub; specify a supported hub
   region in the creation command.

1. Create the hub. Replace `<HUB_NAME>` with a new, globally unique name, not
   the name of an existing hub:

   ```azurecli
   az iot hub create --name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --location "<SUPPORTED_REGION>" --sku S1 --unit 1 --connection-profile MqttV5 --system-assigned-mi --disable-local-auth false --yes --output none
   ```

   The command waits for the creation operation. If it fails or times out,
   inspect the hub before retrying; the resource might already exist.

1. [Verify the created hub](#verify-the-created-hub) before configuring the
   linked resources.

### [ARM template](#tab/arm)

Save the following JSON as `hub-create.template.json`. The template uses
`Microsoft.Devices/IotHubs@2026-10-01-preview` and sets
`properties.connectionProfile` to `MqttV5`, as defined in the
[versioned ARM reference](/azure/templates/microsoft.devices/2026-10-01-preview/iothubs).

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "hubName": {
      "type": "string",
      "minLength": 3,
      "maxLength": 50,
      "metadata": {
        "description": "A new, globally unique IoT hub name."
      }
    },
    "location": {
      "type": "string",
      "metadata": {
        "description": "An Azure region supported by the preview."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Devices/IotHubs",
      "apiVersion": "2026-10-01-preview",
      "name": "[parameters('hubName')]",
      "location": "[parameters('location')]",
      "identity": {
        "type": "SystemAssigned"
      },
      "sku": {
        "name": "S1",
        "capacity": 1
      },
      "properties": {
        "connectionProfile": "MqttV5",
        "disableLocalAuth": false
      }
    }
  ],
  "outputs": {
    "hubResourceId": {
      "type": "string",
      "value": "[resourceId('Microsoft.Devices/IotHubs', parameters('hubName'))]"
    }
  }
}
```

To deploy the template through the Azure portal:

1. Open [Deploy a custom template](https://portal.azure.com/#create/Microsoft.Template).
1. Select **Build your own template in the editor**, load
   `hub-create.template.json`, and select **Save**.
1. Select your subscription and resource group. Set **Hub Name** to a new,
   globally unique name and **Location** to a region supported by the preview.
1. Select **Review + create**, review the deployment, and select **Create**.
1. Wait for deployment to finish. Save the `hubResourceId` deployment output
   and open the deployed hub.

If you deploy this template through automation instead, use incremental
deployment mode. Complete mode can delete other resources in the resource
group. Incremental mode doesn't make it safe to overwrite an existing hub
with this creation-only template.

#### Create the supporting ADR and DPS resources

To create the resources needed in configuration task 1 through ARM, save the
following template as `hub-supporting-resources.template.json`. Use new resource
names. This template creates an ADR namespace and a DPS instance with
system-assigned identities; it doesn't assign roles, link resources, or create
device enrollments.

The ADR namespace and DPS resource templates use Resource Manager API version
`2026-11-01`. The hub template uses `2026-10-01-preview`. These are
resource-management API versions, not DPS enrollment or device-provisioning
API versions.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "namespaceName": { "type": "string" },
    "dpsName": { "type": "string" },
    "location": { "type": "string" }
  },
  "resources": [
    {
      "type": "Microsoft.DeviceRegistry/namespaces",
      "apiVersion": "2026-11-01",
      "name": "[parameters('namespaceName')]",
      "location": "[parameters('location')]",
      "identity": { "type": "SystemAssigned" },
      "properties": {}
    },
    {
      "type": "Microsoft.Devices/provisioningServices",
      "apiVersion": "2026-11-01",
      "name": "[parameters('dpsName')]",
      "location": "[parameters('location')]",
      "sku": { "name": "S1", "capacity": 1 },
      "identity": { "type": "SystemAssigned" },
      "properties": {}
    }
  ],
  "outputs": {
    "namespaceResourceId": {
      "type": "string",
      "value": "[resourceId('Microsoft.DeviceRegistry/namespaces', parameters('namespaceName'))]"
    },
    "dpsResourceId": {
      "type": "string",
      "value": "[resourceId('Microsoft.Devices/provisioningServices', parameters('dpsName'))]"
    }
  }
}
```

Deploy it through **Deploy a custom template**, following the portal deployment
steps in the **ARM template** tab, or use Azure CLI after signing in:

```azurecli
az login
```

```azurecli
az deployment group create --subscription "<SUBSCRIPTION_ID>" --resource-group "<RESOURCE_GROUP_NAME>" --name hub-supporting-resources --template-file "hub-supporting-resources.template.json" --parameters namespaceName="<ADR_NAMESPACE_NAME>" dpsName="<DPS_NAME>" location="<SUPPORTED_REGION>" --mode Incremental
```

Save both resource IDs from the deployment outputs. Confirm that DPS is
`Active`, the namespace provisioning state is `Succeeded`, and each resource
has a system-assigned principal ID. The namespace uses its system-assigned
identity for outbound calls when no outbound identity override is configured.

For this profile, don't populate DPS's `iotHubs` property to establish a direct
hub link. After ARM resource creation, follow the CLI linking and enrollment
tasks below. These templates aren't an ARM-only deployment of the complete
solution. Creating an enrollment is a DPS service operation, not creation of an
ARM child resource under the DPS instance.

Continue to [Verify the created hub](#verify-the-created-hub).

---

### Verify the created hub

For any creation method, confirm that the resource exists in the intended
subscription and resource group, its state is `Active`, its provisioning state is `Succeeded`, and
its `connectionProfile` is `MqttV5`. A successful creation request alone isn't
proof that the hub has the intended profile.

Inspect the hub's resource JSON in the Azure portal, or use the preview CLI
extension after completing the [Azure CLI setup](?tabs=cli#create-azure-iot-hub-with-the-mqtt-v5-connection-profile):

```azurecli
az iot hub show --subscription "<SUBSCRIPTION_ID>" --resource-group "<RESOURCE_GROUP_NAME>" --name "<HUB_NAME>" --query "{id:id,location:location,state:properties.state,connectionProfile:properties.connectionProfile,provisioningState:properties.provisioningState,principalId:identity.principalId}" --output json
```

Check the returned values before continuing. If provisioning isn't successful
or the profile isn't `MqttV5`, resolve the issue before configuring linked
resources. Save the hub resource ID for the following tasks.

## Configure the linked resources

After creating and verifying the hub, complete these six tasks. The CLI
commands use the preview extension and active subscription configured in
[Azure CLI setup](?tabs=cli#create-azure-iot-hub-with-the-mqtt-v5-connection-profile).
Use the same resource group for this walkthrough.

1. **Prepare the ADR namespace and DPS instance.** Create both resources with
   system-assigned managed identities. Select names that aren't already in use.
   If you used the
   [supporting-resource ARM template](#create-the-supporting-adr-and-dps-resources),
   skip the two creation commands and verify the existing resources instead.

   ```azurecli
   az iot adr ns create --name "<ADR_NAMESPACE_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --location "<SUPPORTED_REGION>" --outbound-system-assigned-mi --query "{id:id,state:properties.provisioningState,principalId:identity.principalId}" --output json
   ```

   ```azurecli
   az iot dps create --name "<DPS_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --location "<SUPPORTED_REGION>" --system-assigned-mi --query "{id:id,state:properties.state,principalId:identity.principalId}" --output json
   ```

   Save the resource IDs from the responses. For existing resources, inspect
   their identities and existing links before using them; don't rerun creation
   commands to replace their configuration.

   **Expected result:** The namespace provisioning state is `Succeeded`, DPS
   state is `Active`, and the resource IDs and identity principal IDs are available.

1. **Review service identities and required permissions.** The combined link
   command in the next task configures the following service-to-service role
   assignments for this system-assigned identity flow.

   | Identity | Role | Scope |
   | --- | --- | --- |
   | ADR namespace | Azure Device Registry Administrator | ADR namespace |
   | ADR namespace | Contributor | IoT hub |
   | ADR namespace | IoT Hub Data Contributor | IoT hub |
   | ADR namespace | Contributor | DPS instance |
   | IoT hub | Contributor | ADR namespace |
   | DPS instance | Contributor | ADR namespace |

   You must have permission to assign these roles at the listed scopes.
   The command grants roles to service identities, not to the signed-in user.
   A device's X.509 certificate and a service's managed identity serve different
   purposes.

   **Expected result:** The identities, roles, scopes, and your permission to
   create the assignments are confirmed before linking.

1. **Link the created hub and DPS instance through the ADR namespace.**
   Use the saved resource IDs, not resource names, for the link targets.

   > [!IMPORTANT]
   > Linking the hub to ADR is permanent. Set hub availability to `Available`
   > and allocation weight to `1` when creating this link so that DPS can
   > select the hub. Don't use `az iot dps linked-hub create` for this profile;
   > the supported relationship is through the ADR namespace.

   ```azurecli
   az iot adr ns link add --ns "<ADR_NAMESPACE_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --hub-endpoint-name primary-hub --hub-id "<HUB_RESOURCE_ID>" --hub-system-assigned-mi --hub-availability Available --hub-allocation-weight 1 --dps-endpoint-name primary-dps --dps-id "<DPS_RESOURCE_ID>" --dps-system-assigned-mi
   ```

   This command links DPS first, then the hub, and configures the required
   role assignments. If it only partly completes, inspect the links before
   retrying. Don't rerun the combined `link add` when the DPS link already exists.
   See [link troubleshooting](mqtt-v5-monitor-troubleshoot.md#troubleshoot-cli-setup).

   **Expected result:** The namespace's DPS and hub links both reach
   `Succeeded`, and the hub endpoint is `Available`.

1. **Verify the associations and record the DPS ID scope.** Check the namespace
   links and the references on both linked resources:

   ```azurecli
   az iot adr ns link hub show --name primary-hub --ns "<ADR_NAMESPACE_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --query "{state:linkingState,availability:provisioning.availability}" --output json
   ```

   ```azurecli
   az iot adr ns link dps list --ns "<ADR_NAMESPACE_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --query "[].linkingState" --output json
   ```

   ```azurecli
   az iot hub show --name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --query properties.deviceRegistry.linkingProperties.state --output tsv
   ```

   ```azurecli
   az iot dps show --name "<DPS_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --query "{links:properties.deviceRegistryNamespaces[].linkingState,idScope:properties.idScope}" --output json
   ```

   **Expected result:** All four link-state checks report `Succeeded`, hub
   availability is `Available`, and the DPS ID scope is saved for device setup.

1. **Configure enrollment.** For the existing-X.509 device example, create an
   individual enrollment using the device's public leaf certificate in PEM
   format. Use the registration ID from that certificate's subject common name.
   Keep the corresponding private key on the device; don't upload it.

   ```azurecli
   az iot dps enrollment create --dps-name "<DPS_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --enrollment-id "<REGISTRATION_ID>" --attestation-type x509 --certificate-path "<DEVICE_CERTIFICATE_PEM_PATH>" --provisioning-status enabled
   ```

   ```azurecli
   az iot dps enrollment show --dps-name "<DPS_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --enrollment-id "<REGISTRATION_ID>" --query "{registrationId:registrationId,status:provisioningStatus}" --output json
   ```

   This example uses an existing certificate; it doesn't configure issuance.
   For the alternative issuance path, follow
   [Configure certificate issuance through DPS](#configure-certificate-issuance-through-dps)
   instead of creating this existing-certificate enrollment.

   **Expected result:** The individual enrollment is `enabled` and its
   registration ID matches the device's X.509 onboarding identity.

1. **Review diagnostic collection.** Set up the required logs before a test run,
   using [Monitor and troubleshoot](mqtt-v5-monitor-troubleshoot.md).

   **Expected result:** Diagnostic collection is configured before the device
   attempts provisioning or sends messages.

Devices authenticate to the hub with X.509 certificates only. Use SAS as an
onboarding credential for the configured issuance path, not as a direct hub
connectivity credential. See
[X.509 device authentication](mqtt-v5-device-setup.md#x509-device-authentication).
For hostnames and TLS requirements, see
[IoT Hub endpoints](iot-hub-devguide-endpoints.md#tls-13-enabled-endpoints).

## Configure certificate issuance through DPS

Use this optional path for devices that submit a CSR to get an ADR-issued
operational certificate. Skip it if you use the existing-X.509 example.
First, complete the resource linking and permissions configuration.

> [!NOTE]
> The certificate-management option is unavailable in the MQTT v5 hub onboarding
> wizard. You can configure certificate issuance separately in the linked ADR
> namespace and select the issuing CA and policy in the DPS enrollment.

### Create or select an issuing CA and policy

1. Open the linked ADR namespace in the Azure portal.
1. Under **Security**, select **Certificate authorities**.
1. If the namespace doesn't have a root CA, select
   **Create** > **Root Certificate Authority**, enter a name, and select **Create**.
   Wait for provisioning to complete. Reuse an existing root if one is present.
1. Select **Create** > **Intermediate Certificate Authority**, choose
   **Use this namespace's Root CA**, enter a name, and select **Create**.
   Wait for the intermediate CA to become **Active**. Alternatively, select an
   existing active issuing CA intended for these devices.
1. Open the intermediate CA. If it doesn't already have a policy, select
   **Create policy**, enter a policy name and certificate validity period, and
   select **Save**. Each intermediate CA supports one certificate policy.
1. Confirm that the policy appears under **Certificate policies**. Select its
   name to inspect its status and configured validity period.

For detailed CA and policy guidance, see
[Set up a managed root and intermediate CA](../iot/how-to-create-policy.md)
and [Create or edit a certificate policy](../iot/how-to-create-edit-certificate-policy.md).

### Configure a DPS enrollment for issuance

1. Open the DPS instance linked to the namespace.
1. Under **Settings**, select **Manage enrollments**, then
   **Individual enrollments > Add individual enrollment**.
1. Choose **Symmetric key** or **X.509** as the attestation mechanism and supply
   the required onboarding information. For X.509, upload only the public
   certificate, not the private key.
1. Enter the device's registration ID and enable the enrollment.
1. Review the allocation settings so the device can be assigned to the intended
   MQTT v5 hub. If multiple hubs are eligible, restrict the target selection for
   this evaluation.
1. Under **Certificate policies (Preview)**, select the issuing CA and its policy.
1. Select **Review + create**, review the settings, and select **Create**.
1. Reopen the enrollment and verify that it is enabled and references the intended
   CA and policy. Record the DPS ID scope and registration ID for the device.

Keep onboarding keys and private keys secure. The device application must use
its onboarding credential to authenticate to DPS and submit a CSR to request
the operational certificate. Selecting a policy doesn't issue a certificate
until the device requests one.

**Expected result:** The issuing CA and policy are ready, and the enabled DPS
enrollment references them. The portal configures the issuance path; the device
initiates certificate issuance.

## Understand the ARM deployment scope

The ARM examples create a new IoT Hub and, optionally, the supporting ADR
namespace and DPS instance. Creation alone doesn't establish the resource
relationships. Complete the permissions, linking, and enrollment configuration
by following the six tasks in [Configure the linked resources](#configure-the-linked-resources).

Use an API version that exposes the connection profile and all resources and
properties your deployment configures. A successful deployment of a general
IoT Hub template isn't proof that it selected the MQTT v5 connection profile.

For resource schemas, see the
[IoT Hub ARM reference](/azure/templates/microsoft.devices/iothubs).
The schema reference describes properties; it isn't a complete deployment
procedure for this journey.

## Verify readiness

Before proceeding, check each item:

- The hub has the MQTT v5 connection profile.
- The hub references the intended ADR namespace.
- DPS is linked to the intended hub and namespace.
- The device's enrollment is enabled and uses the intended onboarding method.
- Certificate issuance prerequisites are configured if that method is used.
- Service identities have the required permissions at the intended scope.
- You have the DPS ID scope and the credentials needed for the device setup step.

Resource deployment success is the checkpoint for this stage. Successful
device provisioning and downstream delivery are verified later.

## Next steps

- [Configure custom topic groups](mqtt-v5-custom-topics.md).
- [Configure routes and downstream delivery](iot-hub-devguide-messages-d2c.md).
- [Connect a device and send telemetry](mqtt-v5-device-setup.md).
