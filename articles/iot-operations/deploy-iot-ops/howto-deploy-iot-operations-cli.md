---
title: Deploy Azure IoT Operations by using Azure CLI
description: Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster using Azure CLI. Create dependencies, select a runtime, and configure secure settings.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 11/12/2026
ai-usage: ai-assisted

#CustomerIntent: As an IT professional, I want to deploy Azure IoT Operations using Azure CLI without generating commands in the Azure portal.
---

# Deploy Azure IoT Operations by using Azure CLI

Use Azure CLI to deploy Azure IoT Operations to an existing Azure Arc-enabled Kubernetes cluster. In this article, you create or select the Azure dependencies, initialize the cluster, deploy an instance, and verify the deployment.

The basic instance supports testing and evaluation. For production workloads, also complete [Enable secure settings for production](#enable-secure-settings-for-production). To configure deployment in the Azure portal instead, see [Deploy Azure IoT Operations to a production cluster](howto-deploy-iot-operations.md).

## Prerequisites

[!INCLUDE [prereq-azure-subscription](../includes/prereq-azure-subscription.md)]

<!-- markdownlint-disable-next-line MD044 -->
[!INCLUDE [prereq-azure-cli](../includes/prereq-azure-cli.md)]

- An Azure Arc-enabled Kubernetes cluster that meets the [supported environment requirements](overview-deploy.md#supported-environments). Complete [Prepare your Azure Arc-enabled Kubernetes cluster](howto-prepare-cluster.md), including resource provider registration, custom location support, and workload identity configuration.
- The [required Azure permissions](overview-deploy.md#required-permissions), including **Microsoft.Authorization/roleAssignments/write** for schema registry role assignments.
- Local `kubectl` access to the target cluster. Run `kubectl config current-context` and `kubectl get nodes` to confirm that you're connected to the intended cluster.
- For production, configure your certificate issuer and trust settings before initialization and creation. For more information, see [Bring your own issuer](howto-bring-your-own-issuer.md#bring-your-own-issuer).

To deploy in Azure Government, run `az cloud set --name AzureUSGovernment` before you sign in. For other differences, see [Azure IoT Operations in Azure Government](../overview-azure-government.md#deploy-azure-iot-operations).

Sign in interactively, even if you previously signed in:

```azurecli
az login
```

Run the commands in the same Bash or PowerShell session. Resolve any command failure before continuing.

## Set deployment values

Replace the placeholders in the variable block. `RESOURCE_GROUP` is the resource group of the Arc-enabled cluster, where you deploy the instance. The schema registry and Device Registry namespace can be in different resource groups. Specify their actual groups separately.

Choose names for a new instance and custom location. `--custom-location` takes a custom location name. If you omit this optional parameter from `create`, the CLI generates a name in the form `location-{hash(5)}`.

For new dependencies, use a [supported region](../overview-support.md#supported-regions), a globally unique storage account name (3-24 lowercase letters and numbers), and a schema registry namespace that's unique within your tenant. The schema registry namespace is distinct from the Azure Device Registry namespace and the Kubernetes namespace.

### [Bash](#tab/bash)

```bash
SUBSCRIPTION_ID="<SUBSCRIPTION_ID>"
RESOURCE_GROUP="<CLUSTER_RESOURCE_GROUP>"
CLUSTER_NAME="<ARC_ENABLED_CLUSTER_NAME>"
AIO_INSTANCE_NAME="<NEW_AIO_INSTANCE_NAME>"
CUSTOM_LOCATION_NAME="<NEW_CUSTOM_LOCATION_NAME>"
LOCATION="<SUPPORTED_AZURE_REGION>"
SCHEMA_RESOURCE_GROUP="<SCHEMA_REGISTRY_RESOURCE_GROUP>"
NAMESPACE_RESOURCE_GROUP="<DEVICE_REGISTRY_NAMESPACE_RESOURCE_GROUP>"
STORAGE_ACCOUNT_NAME="<STORAGE_ACCOUNT_NAME>"
SCHEMA_REGISTRY_NAME="<SCHEMA_REGISTRY_NAME>"
SCHEMA_REGISTRY_NAMESPACE="<SCHEMA_REGISTRY_NAMESPACE>"
DEVICE_REGISTRY_NAMESPACE_NAME="<DEVICE_REGISTRY_NAMESPACE_NAME>"

az account set --subscription "$SUBSCRIPTION_ID"
```

### [PowerShell](#tab/powershell)

```powershell
$SUBSCRIPTION_ID = "<SUBSCRIPTION_ID>"
$RESOURCE_GROUP = "<CLUSTER_RESOURCE_GROUP>"
$CLUSTER_NAME = "<ARC_ENABLED_CLUSTER_NAME>"
$AIO_INSTANCE_NAME = "<NEW_AIO_INSTANCE_NAME>"
$CUSTOM_LOCATION_NAME = "<NEW_CUSTOM_LOCATION_NAME>"
$LOCATION = "<SUPPORTED_AZURE_REGION>"
$SCHEMA_RESOURCE_GROUP = "<SCHEMA_REGISTRY_RESOURCE_GROUP>"
$NAMESPACE_RESOURCE_GROUP = "<DEVICE_REGISTRY_NAMESPACE_RESOURCE_GROUP>"
$STORAGE_ACCOUNT_NAME = "<STORAGE_ACCOUNT_NAME>"
$SCHEMA_REGISTRY_NAME = "<SCHEMA_REGISTRY_NAME>"
$SCHEMA_REGISTRY_NAMESPACE = "<SCHEMA_REGISTRY_NAMESPACE>"
$DEVICE_REGISTRY_NAMESPACE_NAME = "<DEVICE_REGISTRY_NAMESPACE_NAME>"

az account set --subscription $SUBSCRIPTION_ID
```

---

## Create or select dependencies

Azure IoT Operations requires an Azure Device Registry namespace and a schema registry that's backed by an Azure storage account. To reuse existing dependencies, set their names and resource groups in the variable block and skip their creation commands. You can also create one dependency and reuse the other.

Creating the schema registry assigns its identity access to the storage account and requires **Microsoft.Authorization/roleAssignments/write** permission. For more information, see [az iot ops schema registry create](/cli/azure/iot/ops/schema/registry#az-iot-ops-schema-registry-create).

### [Bash](#tab/bash)

```bash
az group create --name "$SCHEMA_RESOURCE_GROUP" --location "$LOCATION"
az group create --name "$NAMESPACE_RESOURCE_GROUP" --location "$LOCATION"

az storage account create \
  --name "$STORAGE_ACCOUNT_NAME" \
  --resource-group "$SCHEMA_RESOURCE_GROUP" \
  --location "$LOCATION" \
  --enable-hierarchical-namespace

STORAGE_ACCOUNT_RESOURCE_ID=$(az storage account show \
  --name "$STORAGE_ACCOUNT_NAME" \
  --resource-group "$SCHEMA_RESOURCE_GROUP" \
  --query id --output tsv)

az iot ops schema registry create \
  --name "$SCHEMA_REGISTRY_NAME" \
  --resource-group "$SCHEMA_RESOURCE_GROUP" \
  --location "$LOCATION" \
  --registry-namespace "$SCHEMA_REGISTRY_NAMESPACE" \
  --sa-resource-id "$STORAGE_ACCOUNT_RESOURCE_ID"

az iot ops ns create \
  --name "$DEVICE_REGISTRY_NAMESPACE_NAME" \
  --resource-group "$NAMESPACE_RESOURCE_GROUP" \
  --location "$LOCATION"
```

### [PowerShell](#tab/powershell)

```powershell
az group create --name $SCHEMA_RESOURCE_GROUP --location $LOCATION
az group create --name $NAMESPACE_RESOURCE_GROUP --location $LOCATION

az storage account create `
  --name $STORAGE_ACCOUNT_NAME `
  --resource-group $SCHEMA_RESOURCE_GROUP `
  --location $LOCATION `
  --enable-hierarchical-namespace

$STORAGE_ACCOUNT_RESOURCE_ID = az storage account show `
  --name $STORAGE_ACCOUNT_NAME `
  --resource-group $SCHEMA_RESOURCE_GROUP `
  --query id --output tsv

az iot ops schema registry create `
  --name $SCHEMA_REGISTRY_NAME `
  --resource-group $SCHEMA_RESOURCE_GROUP `
  --location $LOCATION `
  --registry-namespace $SCHEMA_REGISTRY_NAMESPACE `
  --sa-resource-id $STORAGE_ACCOUNT_RESOURCE_ID

az iot ops ns create `
  --name $DEVICE_REGISTRY_NAMESPACE_NAME `
  --resource-group $NAMESPACE_RESOURCE_GROUP `
  --location $LOCATION
```

---

## Select the runtime

The deployment examples use the extension's bundled generally available (GA) runtime. To deploy a preview instance, add `--use-preview` to the `az iot ops create` command before you run it. This option selects the preview runtime bundled with the installed extension.

Preview selection requires an extension version that supports `--use-preview`. Check your installed version and command help:

```azurecli
az version
az extension show --name azure-iot-ops --query version --output tsv
az iot ops create --help
```

Confirm that the help lists `--use-preview` before adding the flag. If it doesn't, run `az extension add --upgrade --name azure-iot-ops` and check again. If the flag is still absent, use the stable procedure or install a supporting extension version before continuing.

> [!IMPORTANT]
> Using `--use-preview` constitutes acceptance of the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Review the preview runtime's [release notes](https://github.com/Azure/azure-iot-operations/releases) and cluster and storage requirements before deployment.

## Initialize the cluster and deploy an instance

The following commands retrieve the full Azure resource IDs of the dependencies, initialize the cluster foundation, and deploy an instance. Each dependency lookup must succeed and return a nonempty ID before you run `create`.

- `--sr-resource-id` requires an ID in the form `/subscriptions/<subscription-id>/resourceGroups/<schema-resource-group>/providers/Microsoft.DeviceRegistry/schemaRegistries/<schema-registry-name>`.
- `--ns-resource-id` requires an ID in the form `/subscriptions/<subscription-id>/resourceGroups/<namespace-resource-group>/providers/Microsoft.DeviceRegistry/namespaces/<namespace-name>`.

These values are Azure resource IDs, rather than resource names or Kubernetes namespace names. The examples select dependencies in `SUBSCRIPTION_ID`. For a dependency in another subscription, add `--subscription <DEPENDENCY_SUBSCRIPTION_ID>` to its `show` command to retrieve its full ID.

Run `init` once for a cluster foundation that supports your target release. If you're reusing a compatible initialized cluster after deleting an instance without `--include-deps`, skip `init`. For a version upgrade, follow [Upgrade Azure IoT Operations](../manage-iot-ops/howto-upgrade.md).

> [!NOTE]
> These examples use the system-provided self-signed trust bundle. To use your own issuer, follow [Bring your own issuer](howto-bring-your-own-issuer.md#bring-your-own-issuer), including `--user-trust` during initialization and `--trust-settings` during creation.

### [Bash](#tab/bash)

```bash
SCHEMA_REGISTRY_RESOURCE_ID=$(az iot ops schema registry show \
  --name "$SCHEMA_REGISTRY_NAME" \
  --resource-group "$SCHEMA_RESOURCE_GROUP" \
  --query id --output tsv)

DEVICE_REGISTRY_NAMESPACE_RESOURCE_ID=$(az iot ops ns show \
  --name "$DEVICE_REGISTRY_NAMESPACE_NAME" \
  --resource-group "$NAMESPACE_RESOURCE_GROUP" \
  --query id --output tsv)

az iot ops init \
  --subscription "$SUBSCRIPTION_ID" \
  --resource-group "$RESOURCE_GROUP" \
  --cluster "$CLUSTER_NAME"

az iot ops create \
  --subscription "$SUBSCRIPTION_ID" \
  --resource-group "$RESOURCE_GROUP" \
  --cluster "$CLUSTER_NAME" \
  --name "$AIO_INSTANCE_NAME" \
  --custom-location "$CUSTOM_LOCATION_NAME" \
  --sr-resource-id "$SCHEMA_REGISTRY_RESOURCE_ID" \
  --ns-resource-id "$DEVICE_REGISTRY_NAMESPACE_RESOURCE_ID"
```

### [PowerShell](#tab/powershell)

```powershell
$SCHEMA_REGISTRY_RESOURCE_ID = az iot ops schema registry show `
  --name $SCHEMA_REGISTRY_NAME `
  --resource-group $SCHEMA_RESOURCE_GROUP `
  --query id --output tsv

$DEVICE_REGISTRY_NAMESPACE_RESOURCE_ID = az iot ops ns show `
  --name $DEVICE_REGISTRY_NAMESPACE_NAME `
  --resource-group $NAMESPACE_RESOURCE_GROUP `
  --query id --output tsv

az iot ops init `
  --subscription $SUBSCRIPTION_ID `
  --resource-group $RESOURCE_GROUP `
  --cluster $CLUSTER_NAME

az iot ops create `
  --subscription $SUBSCRIPTION_ID `
  --resource-group $RESOURCE_GROUP `
  --cluster $CLUSTER_NAME `
  --name $AIO_INSTANCE_NAME `
  --custom-location $CUSTOM_LOCATION_NAME `
  --sr-resource-id $SCHEMA_REGISTRY_RESOURCE_ID `
  --ns-resource-id $DEVICE_REGISTRY_NAMESPACE_RESOURCE_ID
```

---

Wait for `init` to succeed before running `create`. Both commands can take several minutes.

## Verify deployment

Use `show` to view the Azure instance configuration and `check` to evaluate the services on the cluster selected by your current kubeconfig context:

```azurecli
az iot ops show --name "$AIO_INSTANCE_NAME" --resource-group "$RESOURCE_GROUP"
az iot ops check
```

For more information about the checks, see [Verify deployment](howto-deploy-iot-operations.md#verify-deployment).

## Enable secure settings for production

After you run `init` and `create`, the basic instance is ready for testing. Before using the instance for production workloads, complete the CLI procedure in [Enable secure settings](../secure-iot-ops/howto-enable-secure-settings.md):

1. Create or select an RBAC-enabled Azure Key Vault and a user-assigned managed identity for secrets. Grant your user account permission to manage secrets.
1. Run `az iot ops secretsync enable` with the full resource IDs of the key vault and the secrets identity to configure secret synchronization.
1. Use a separate user-assigned managed identity for cloud connections. Run `az iot ops identity assign` and grant that identity access to the required cloud resources. For data flow graphs, also configure the `wasm-graph` identity usage.
1. Restart the schema registry pods as directed in the secure settings procedure, then run `az iot ops check` again.

The secure settings procedure provides Bash and PowerShell commands for these steps. Retain the certificate issuer and trust configuration you selected before initialization.

## Clean up resources

For cleanup or redeployment, follow [Uninstall](../manage-iot-ops/howto-manage-update-uninstall.md#uninstall). The `az iot ops delete` command removes the instance deployment and retains the foundation prepared by `init`. The `az iot ops delete --include-deps` command also removes the initialization dependencies. Review the deletion tree before confirming. Manage separately created or shared resources, such as the schema registry, storage account, and Device Registry namespace, separately.

If a disconnected cluster blocks uninstall, see [Recover a blocked uninstall](../manage-iot-ops/howto-manage-update-uninstall.md#recover-a-blocked-uninstall) for `--force` and residual-resource cleanup guidance.

> [!IMPORTANT]
> Uninstall Azure IoT Operations before deleting its resource group, and keep the cluster online whenever possible. Deleting the resource group first can leave orphaned resources on the cluster and cause later deployments to fail.

## Next steps

- [Configure observability](howto-configure-observability.md).
- [Review production deployment guidelines](concept-production-guidelines.md).
