---
title: Azure IoT Operations in Azure Government (preview)
description: Explore support for Azure IoT Operations deployments in Azure Government (preview).
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: overview
ms.date: 10/23/2026
ms.custom: references_regions

# As an IT admin, OT professional, or solution architect, you want to know the supported environments for Azure IoT Operations in Azure Government to plan and execute your deployment effectively.
---

# Azure IoT Operations in Azure Government (preview)

[Azure Government](/azure/azure-government/documentation-government-welcome) is a dedicated cloud for US government agencies and their partners. Azure IoT Operations is available in preview in Azure Government.

This article describes Azure IoT Operations in Azure Government. It explains how Azure IoT Operations differs from global Azure, and how to deploy it. For everything not covered in this article, follow the rest of the Azure IoT Operations documentation.

> [!IMPORTANT]
> Azure IoT Operations in Azure Government is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. Azure IoT Operations is generally available in global Azure. That general availability doesn't extend to Azure Government until this preview ends.

## Supported region

Azure IoT Operations supports Arc-enabled clusters in the following Azure Government region:

| Region | CLI value |
| --- | --- |
| US Gov Virginia | `usgovvirginia` |

Connect your cluster to Azure Arc in this region. Create the Azure IoT Operations instance, Azure Device Registry namespace, and schema registry in this region.

Data flow destinations, like Azure Data Lake Storage or Azure Event Hubs, can be in any Azure Government region where that service is available. Azure IoT Operations in Azure Government can't use resources in global Azure.

## Supported versions

Azure IoT Operations in Azure Government starts with the 2610 release (version 1.5.x). Earlier versions aren't available. Azure Government includes the features that are generally available in global Azure for each release.

Features that are in preview in global Azure aren't available in Azure Government. Azure Government receives new versions after they're released in global Azure, so the latest version in global Azure might not be available yet.

To check which versions you can deploy, run `az iot ops get-versions` after you [connect to Azure Government](#connect-to-azure-government).

## Feature availability

All generally available Azure IoT Operations features in global Azure are also available in Azure Government, *except for the features listed in the following table*:

| Feature | Global Azure | Azure Government |
| --- | --- | --- |
| Azure portal experience for Azure IoT Operations, including deployment, instance management, and the Azure IoT Operations pages for devices, assets, and data flows | Generally available | Not available. Use the [Azure CLI](#deploy-azure-iot-operations), ARM or Bicep templates, or the [operations experience](#operations-experience). |
| Azure IoT Operations features in preview in global Azure | Preview | Not available |
| Azure Device Registry features in preview in global Azure, including live data (observability sessions) for assets, and preview API versions such as `2026-11-02-preview` | Preview | Not available |
| Assets and asset endpoint profiles that aren't in a namespace, and their discovered equivalents (`Microsoft.DeviceRegistry/assets`, `assetEndpointProfiles`, `discoveredAssets`, `discoveredAssetEndpointProfiles`). Azure IoT Operations versions earlier than 1.2 use these resources. | Supported for existing deployments | Not available. Use namespaced assets, devices, discovered assets, and discovered devices (`Microsoft.DeviceRegistry/namespaces/*`). |
| [Azure Container Storage enabled by Azure Arc](/azure/azure-arc/container-storage/overview) edge volumes, and the features that use them: [local storage data flow endpoints](connect-to-cloud/howto-configure-local-storage-endpoint.md#use-azure-container-storage-enabled-by-azure-arc) that write to local shared or cloud ingest volumes, and [media connector](discover-manage-assets/howto-manage-connector-templates.md#configure-a-persistent-volume-claim-for-the-media-connector) uploads of snapshots and clips to cloud storage | Supported | Not available. Local storage endpoints and media connector file output can still write to a persistent volume claim from another storage class, but the data isn't synchronized to the cloud. |

You can still use the [Azure Government portal](/azure/azure-government/documentation-government-get-started-connect-with-portal) (`portal.azure.us`) for the Azure resources that Azure IoT Operations uses, like resource groups, Arc-enabled clusters, key vaults, storage accounts, and managed identities.

When other Azure IoT Operations articles show steps in the Azure portal, use the Azure CLI or operations experience equivalent instead.

### Supported API versions

If you use ARM or Bicep templates, or call the REST API directly, use these API versions in Azure Government:

| Resource provider | API version |
| --- | --- |
| `Microsoft.IoTOperations` | `2026-10-01` |
| `Microsoft.DeviceRegistry` (namespaces, devices, assets, discovered devices, discovered assets) | `2026-04-01` |
| `Microsoft.DeviceRegistry` (schema registries, schemas, schema versions) | `2025-10-01` |

## Dependencies

Azure IoT Operations in Azure Government uses the same [dependencies](overview-support.md#dependencies) as global Azure:

- Azure Arc-enabled Kubernetes, with custom locations and workload identity
- Azure Device Registry and schema registry
- Azure Key Vault Secret Store extension
- Azure Monitor pipeline

Azure Container Storage enabled by Azure Arc, an optional dependency in global Azure, isn't available in Azure Government. For the affected features, see [Feature availability](#feature-availability).

## Connect to Azure Government

Before you run any Azure CLI commands in the Azure IoT Operations documentation, set the cloud to Azure Government and sign in:

```azurecli
az cloud set --name AzureUSGovernment
az login
```

To confirm the active cloud, run `az cloud list --output table`. The `isActive` column for `AzureUSGovernment` should be `true`. For more information, see [Connect to Azure Government with Azure CLI](/azure/azure-government/documentation-government-get-started-connect-with-cli).

## Deploy Azure IoT Operations

The [test](deploy-iot-ops/howto-deploy-iot-test-operations.md) and [production](deploy-iot-ops/howto-deploy-iot-operations.md) deployment articles use the Azure portal to generate the deployment commands. Because the portal experience isn't available in Azure Government, run the commands yourself.

### Prerequisites

- An Azure Arc-enabled cluster in `usgovvirginia` with the custom location and workload identity features enabled. Follow [Prepare your Azure Arc-enabled Kubernetes cluster](deploy-iot-ops/howto-prepare-cluster.md), and [connect to Azure Government](#connect-to-azure-government) before you sign in.
- The permissions in [Deployment overview > Required permissions](deploy-iot-ops/overview-deploy.md#required-permissions).
- The endpoints in [Network requirements](#network-requirements) allowed through your firewall or proxy.
- The latest Azure IoT Operations CLI extension:

    ```azurecli
    az extension add --upgrade --name azure-iot-ops
    ```

### Set variables

```bash
LOCATION="usgovvirginia"
RESOURCE_GROUP="<RESOURCE_GROUP>"
CLUSTER_NAME="<CLUSTER_NAME>"
INSTANCE_NAME="<INSTANCE_NAME>"
STORAGE_ACCOUNT="<STORAGE_ACCOUNT>"
SCHEMA_REGISTRY="<SCHEMA_REGISTRY>"
SCHEMA_REGISTRY_NAMESPACE="<SCHEMA_REGISTRY_NAMESPACE>"
ADR_NAMESPACE="<ADR_NAMESPACE>"
```

### Create a schema registry and namespace

1. Create a storage account with hierarchical namespace enabled, and a schema registry that uses it. This command requires **Microsoft.Authorization/roleAssignments/write** permission on the resource group.

    ```azurecli
    az storage account create --name $STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP --location $LOCATION --sku Standard_LRS --kind StorageV2 --enable-hierarchical-namespace true

    az iot ops schema registry create --name $SCHEMA_REGISTRY --resource-group $RESOURCE_GROUP \
      --registry-namespace $SCHEMA_REGISTRY_NAMESPACE \
      --sa-resource-id $(az storage account show --name $STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP -o tsv --query id)
    ```

    For storage account requirements, see [Schema registry and storage](deploy-iot-ops/concept-production-guidelines.md#schema-registry-and-storage).

1. Create an Azure Device Registry namespace:

    ```azurecli
    az iot ops ns create --name $ADR_NAMESPACE --resource-group $RESOURCE_GROUP
    ```

### Deploy

1. Prepare the cluster. You only need to run this command once per cluster.

    ```azurecli
    az iot ops init --cluster $CLUSTER_NAME --resource-group $RESOURCE_GROUP
    ```

    If you use your own certificate authority issuer, see [Bring your own issuer](deploy-iot-ops/howto-bring-your-own-issuer.md) first.

1. Create the Azure IoT Operations instance:

    ```azurecli
    az iot ops create --cluster $CLUSTER_NAME --resource-group $RESOURCE_GROUP --name $INSTANCE_NAME \
      --sr-resource-id $(az iot ops schema registry show --name $SCHEMA_REGISTRY --resource-group $RESOURCE_GROUP -o tsv --query id) \
      --ns-resource-id $(az iot ops ns show --name $ADR_NAMESPACE --resource-group $RESOURCE_GROUP -o tsv --query id)
    ```

    To configure broker cardinality, memory profile, the connector for OPC UA, or other options, add the parameters described in [az iot ops create](/cli/azure/iot/ops#az-iot-ops-create) and [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config).

At this point, the instance has test settings. For production, continue with the next section.

### Enable secure settings

1. Set variables for the key vault and the two user-assigned managed identities. Use one identity for secrets and a separate one for cloud connections.

    ```bash
    KEYVAULT_NAME="<KEYVAULT_NAME>"
    SECRETS_MI_NAME="<SECRETS_MI_NAME>"
    CLOUD_MI_NAME="<CLOUD_CONNECTIONS_MI_NAME>"
    ```

1. Create a key vault that uses Azure role-based access control, and give your account permission to manage secrets:

    ```azurecli
    az keyvault create --name $KEYVAULT_NAME --resource-group $RESOURCE_GROUP --location $LOCATION --enable-rbac-authorization true

    az role assignment create --assignee $(az ad signed-in-user show --query id -o tsv) \
      --role "Key Vault Secrets Officer" \
      --scope $(az keyvault show --name $KEYVAULT_NAME --query id -o tsv)
    ```

1. Create the managed identities:

    ```azurecli
    az identity create --name $SECRETS_MI_NAME --resource-group $RESOURCE_GROUP --location $LOCATION
    az identity create --name $CLOUD_MI_NAME --resource-group $RESOURCE_GROUP --location $LOCATION
    ```

1. Enable secret sync:

    ```azurecli
    az iot ops secretsync enable --instance $INSTANCE_NAME --resource-group $RESOURCE_GROUP \
      --mi-user-assigned $(az identity show --name $SECRETS_MI_NAME --resource-group $RESOURCE_GROUP --query id -o tsv) \
      --kv-resource-id $(az keyvault show --name $KEYVAULT_NAME --query id -o tsv)
    ```

1. Assign the cloud connections identity to the instance. If you plan to use data flow graphs, add `--usage wasm-graph`.

    ```azurecli
    az iot ops identity assign --name $INSTANCE_NAME --resource-group $RESOURCE_GROUP \
      --mi-user-assigned $(az identity show --name $CLOUD_MI_NAME --resource-group $RESOURCE_GROUP --query id -o tsv)
    ```

1. Restart the schema registry pods to apply the new identity:

    ```bash
    kubectl rollout restart statefulset adr-schema-registry -n azure-iot-operations
    ```

For more about these steps, see [Enable secure settings](secure-iot-ops/howto-enable-secure-settings.md).

### Verify the deployment

```azurecli
az iot ops check
```

For more about the output, see [Verify deployment](deploy-iot-ops/howto-deploy-iot-operations.md#verify-deployment).

## Operations experience

Use the operations experience web UI to manage sites, devices, assets, and data flows. In Azure Government, go to [https://portal.iotoperations.azure.us](https://portal.iotoperations.azure.us) and sign in with your Azure Government account.

For more information, see [Use the operations experience web UI](discover-manage-assets/howto-use-operations-experience.md).

## Endpoint differences

Azure Government uses different endpoints than global Azure. Where Azure IoT Operations articles show a global Azure host name or audience, use the Azure Government value:

| Service | Global Azure | Azure Government | Where Azure IoT Operations uses it |
| --- | --- | --- | --- |
| Azure Resource Manager | `management.azure.com` | `management.usgovcloudapi.net` | REST calls, templates, the `--audience` value for registry endpoints |
| Microsoft Entra ID | `login.microsoftonline.com` | `login.microsoftonline.us` | Sign-in and token requests |
| Azure Key Vault | `*.vault.azure.net` | `*.vault.usgovcloudapi.net` | Secret sync |
| Azure Blob Storage | `*.blob.core.windows.net` | `*.blob.core.usgovcloudapi.net` | Schema registry storage |
| Azure Data Lake Storage Gen2 | `*.dfs.core.windows.net` | `*.dfs.core.usgovcloudapi.net` | Data flow endpoints |
| Azure Event Hubs (Kafka) | `*.servicebus.windows.net` | `*.servicebus.usgovcloudapi.net` | Data flow endpoints |
| Azure Event Grid MQTT broker | `*.eventgrid.azure.net` | `*.eventgrid.azure.us` | Data flow endpoints |
| Azure Data Explorer | `*.kusto.windows.net` | `*.kusto.usgovcloudapi.net` | Data flow endpoints |
| Microsoft Fabric OneLake | `onelake.dfs.fabric.microsoft.com` | `onelake.dfs.fabric.microsoft.us` | Data flow endpoints |
| Azure Container Registry | `*.azurecr.io` | `*.azurecr.us` | Registry endpoints, private image mirrors |
| Operations experience | `iotoperations.azure.com` | `portal.iotoperations.azure.us` | Operations experience web UI |

For other services, run `az cloud show --name AzureUSGovernment` or see [Azure Government guidance for developers](/azure/azure-government/compare-azure-government-global-azure#guidance-for-developers).

## Network requirements

If you use enterprise firewalls or proxies, allow the following endpoints before you deploy:

- The **Azure Government** endpoints in [Azure Arc-enabled Kubernetes network requirements](/azure/azure-arc/kubernetes/network-requirements).
- The Azure Government endpoints for Azure CLI. See [Azure CLI endpoints](/cli/azure/azure-cli-endpoints).
- `mcr.microsoft.com` and `*.data.mcr.microsoft.com` for container images, unless you [mirror images to a private registry](secure-iot-ops/howto-mirror-images-private-registry.md).
- The Azure Government endpoints for your schema registry storage, Key Vault, and data flow destinations listed in [Endpoint differences](#endpoint-differences).

## Related content

- [Azure IoT Operations versions, support, and licensing](overview-support.md)
- [Deployment overview](deploy-iot-ops/overview-deploy.md)
- [Compare Azure Government and global Azure](/azure/azure-government/compare-azure-government-global-azure)
- [Connect to Azure Government with Azure CLI](/azure/azure-government/documentation-government-get-started-connect-with-cli)
