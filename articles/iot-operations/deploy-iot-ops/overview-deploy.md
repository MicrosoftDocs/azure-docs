---
title: Deployment overview
description: Learn about the components that are included in an Azure IoT Operations deployment and the different deployment options to consider for your scenario.
author: dominicbetts
ms.author: dobett
ms.topic: concept-article
ms.date: 11/10/2025

#CustomerIntent: As an IT professional, I want to understand the components and deployment details before I start using Azure IoT Operations.
---

# Deployment details

When you deploy Azure IoT Operations, you install a suite of services on an Azure Arc-enabled Kubernetes cluster. This article provides an overview of the different deployment options to consider for your scenario.

## Supported environments

[!INCLUDE [supported-environments-table](../includes/supported-environments-table.md)]

> [!NOTE]
> Billing usage records are collected on any environment where you install Azure IoT Operations, regardless of support or availability levels.

To install Azure IoT Operations, you need to have the following hardware requirements available. If you're using a multinode cluster that enables fault tolerance, scale up to the recommended capacity for better performance.

| Spec | Minimum | Recommended |
|------|---------|-------------|
| Hardware memory capacity (RAM) | 16-GB | 32-GB |
| Available memory for Azure IoT Operations (RAM) | 10-GB | Depends on usage |
| CPU  | 4 vCPUs | 8 vCPUs     |

> [!NOTE]
> The minimum configuration is appropriate when running Azure IoT Operations only.

## Choose your features

Azure IoT Operations offers two deployment modes. You can choose to deploy with *test settings*, a basic subset of features that are simpler to get started with for evaluation scenarios. Or, you can choose to deploy with *secure settings*, the full feature set.

### Test settings deployment

A deployment with only test settings has the following characteristics:

* It doesn't configure secrets or user-assigned managed identity capabilities.
* It's designed to enable the end-to-end quickstart sample for evaluation purposes, so it supports the OPC PLC simulator and connects to cloud resources by using system-assigned managed identity.
* You can upgrade it to use secure settings.

For a quickstart experience, use the [Quickstart: Run Azure IoT Operations in GitHub Codespaces with K3s](../get-started-end-to-end-sample/quickstart-deploy.md) scenario. This scenario uses a lightweight Kubernetes distribution (K3s) and runs in GitHub Codespaces, so you don't need to set up a cluster or install any tools locally.

To deploy Azure IoT Operations with test settings, follow these articles:

1. Start with [Prepare your Azure Arc-enabled Kubernetes cluster](./howto-prepare-cluster.md) to configure and Arc-enable your cluster.
1. Then, follow the steps in [Deploy Azure IoT Operations to a test cluster](./howto-deploy-iot-test-operations.md).

> [!TIP]
> At any point, you can upgrade an Azure IoT Operations instance to use secure settings by following the steps in [Enable secure settings](howto-enable-secure-settings.md).

### Secure settings deployment

A deployment with secure settings has the following characteristics:

* It's designed for production-ready scenarios.
* It enables secrets and user-assigned managed identity, both of which are important capabilities for developing a production-ready scenario. Secrets are used whenever Azure IoT Operations components connect to a resource outside of the cluster, such as an OPC UA server or a data flow endpoint.

To deploy Azure IoT Operations with secure settings, follow these articles:

1. Start with [Prepare your Azure Arc-enabled Kubernetes cluster](./howto-prepare-cluster.md) to configure and Arc-enable your cluster.
1. Then, follow the steps in [Deploy Azure IoT Operations to a production cluster](./howto-deploy-iot-operations.md).

## Required permissions

The following table describes Azure IoT Operations deployment and management tasks that require elevated permissions. For information about assigning roles to users, see [Steps to assign an Azure role](../../role-based-access-control/role-assignments-steps.md).

| Task | Required permission | Comments |
| ---- | ------------------- | -------- |
| Deploy Azure IoT Operations | [Azure IoT Operations Onboarding role](../secure-iot-ops/built-in-rbac.md#azure-iot-operations-onboarding-role) | This role has all required permissions to read and write Azure IoT operations and Azure Device Registry resources. This role has `Microsoft.Authorization/roleAssignments/write` permissions.|
| Register resource providers | [Contributor role](/azure/role-based-access-control/built-in-roles/privileged#contributor) at subscription level| Only required to do once per subscription. You need to register the following resource providers: `Microsoft.ExtendedLocation`, `Microsoft.SecretSyncController`, `Microsoft.Kubernetes`, `Microsoft.KubernetesConfiguration`, `Microsoft.IoTOperations`, and `Microsoft.DeviceRegistry`. |
| Create secrets in Key Vault | [Key Vault Secrets Officer role](/azure/role-based-access-control/built-in-roles/security#key-vault-secrets-officer) at the resource level | Only required for secure settings deployment to synchronize secrets from Azure Key Vault. |
| Create and manage storage accounts | [Storage Account Contributor role](/azure/role-based-access-control/built-in-roles/storage#storage-account-contributor) | Required for Azure IoT Operations deployment. |
| Create a resource group | Resource Group Contributor role | Required to create a resource group for storing Azure IoT Operations resources. |
| Onboard a cluster to Azure Arc | [Kubernetes Cluster - Azure Arc Onboarding role](/azure/role-based-access-control/built-in-roles/containers#kubernetes-cluster---azure-arc-onboarding) | Arc-enabled clusters are required to deploy Azure IoT Operations. |
| Manage deployment of Azure resource bridge| [Azure Resource Bridge Deployment role](/azure/role-based-access-control/built-in-roles/hybrid-multicloud#azure-resource-bridge-deployment-role) | Required to deploy Azure IoT Operations. |
| Provide permissions to deployment| [Azure Arc Enabled Kubernetes Cluster User role](/azure/role-based-access-control/built-in-roles/containers#azure-arc-enabled-kubernetes-cluster-user-role) | Required to grant permission of deployment to the Azure Arc-enabled Kubernetes cluster. |

> [!TIP]
> You must enable resource sync on the Azure IoT Operations instance to use the automatic asset discovery capabilities of the Akri services. To learn more, see [What is OPC UA asset discovery?](../discover-manage-assets/overview-akri.md).

If you use the Azure CLI to assign roles, use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to give permissions. For example, `az role assignment create --assignee sp_name --role "Role Based Access Control Administrator" --scope subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup`

If you use the Azure portal to assign privileged admin roles to a user or principal, you're prompted to restrict access using conditions. For this scenario, select the **Allow user to assign all roles** condition in the **Add role assignment** page.

:::image type="content" source="./media/overview-deploy/add-role-assignment-conditions.png" alt-text="Screenshot that shows assigning users highly privileged role access in the Azure portal.":::

## Organize instances by using sites

Azure IoT Operations supports Azure Arc sites for organizing instances. A _site_ is a cluster resource in Azure like a resource group, but sites typically group instances by physical location and make it easier for OT users to locate and manage assets. An IT administrator creates sites and scopes them to a subscription or resource group. Then, any Azure IoT Operations deployed to an Arc-enabled cluster is automatically collected in the site associated with its subscription or resource group.

For more information, see [What is Azure Arc site manager (preview)?](/azure/azure-arc/site-manager/overview)

## Azure IoT Operations endpoints

If you use enterprise firewalls or proxies to manage outbound traffic, configure the following endpoints before deploying Azure IoT Operations.

* Endpoints in the [Azure Arc-enabled Kubernetes endpoints](/azure/azure-arc/network-requirements-consolidated#azure-arc-enabled-kubernetes-endpoints).

  > [!NOTE]
  > If you use *Azure Arc Gateway* to connect your cluster to Arc, you can configure a smaller set of endpoints based on the [Arc Gateway guidance](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking).

* Endpoints in [Azure CLI endpoints](/cli/azure/azure-cli-endpoints?tabs=azure-cloud#endpoints).

  You need `graph.windows.net`, `*.azurecr.io`, `*.blob.core.windows.net`, and `*.vault.azure.net` from this endpoint list.

* To push data to the cloud, enable the following endpoints based on your choice of data platform.

  * Microsoft Fabric OneLake: [Add Fabric URLs to your allowlist](/fabric/security/fabric-allow-list-urls#onelake).
  * Event Hubs: [Troubleshoot connectivity issues - Azure Event Hubs](/azure/event-hubs/troubleshooting-guide).
  * Event Grid: [Troubleshoot connectivity issues - Azure Event Grid](/azure/event-grid/troubleshoot-network-connectivity).
  * Azure Data Lake Storage Gen 2: [Storage account standard endpoints](/azure/storage/common/storage-account-overview#standard-endpoints).

* Azure IoT Operations uses a cloud-based schema registry that requires access to a customer-provided Azure Blob Storage container. For the schema registry to access the container, the container must expose a public endpoint or designate the Azure Device Registry schema registry (`Microsoft.DeviceRegistry/schemaRegistries`) as a [trusted Azure service](/azure/storage/common/storage-network-security-trusted-azure-services#trusted-access-based-on-a-managed-identity). This doesn't impact any customer firewall or proxy configurations at the edge. To learn more, see [Schema registry and storage](concept-production-guidelines.md#schema-registry-and-storage).

  |Endpoints (DNS) | Description |
  |-|-|
  | `<customer-specific>.blob.core.windows.net` | Storage for schema registry. Refer to [storage account endpoints](/azure/storage/common/storage-account-overview#storage-account-endpoints) for identifying the customer specific subdomain of your endpoint. |



## Data residency

Azure Resource Manager lets you manage and control your Azure IoT Operations instance in your Kubernetes cluster from the cloud using the Azure portal or Azure CLI. While you must deploy the Azure Resource Manager resources for Azure IoT Operations to a [currently supported region](../overview-support.md#supported-regions), you choose where your operational workloads and data physically reside. The Azure IoT Operations runtime and compute remain on your premises and under your control.​

​This architecture ensures the following characteristics of the deployment:​

* All operational processes and workloads run on your own local infrastructure.
* To comply with your data residency requirements, choose the Azure region for any data storage or data processing resources your solution uses.
* Data transfers directly between your local infrastructure and your Azure storage and processing resources. Your data doesn't pass through the Azure IoT Operations resources in the cloud.​
* The location of the Azure Resource Manager for your Azure IoT Operations instance is a logical reference for management and orchestration.​
* No customer production data is relocated. Some system telemetry, such as metrics and logs, used for service improvement and proactive identification of infrastructure issues might flow to the Azure region where your Azure IoT Operations resources are located.​

The following diagram shows an example deployment that illustrates how to maintain data sovereignty on your local infrastructure while optionally using a different Azure region for  data storage and processing. In this example:

* Azure IoT Operations management resources are deployed in the _US West_ region. This region is one of the supported regions for Azure IoT Operations.
* Operational workloads and data remain _on-premises at the edge_ under your complete control to ensure data residency and data sovereignty.
* Data storage and processing resources are deployed in the _Canada Central_ region to meet specific regional data residency requirements.

<!-- Art Library Source# ConceptArt-0-000-131 -->

:::image type="content" source="./media/overview-deploy/data-residency.svg" alt-text="Diagram that shows an example deployment of Azure IoT Operations with data residency considerations." lightbox="./media/overview-deploy/data-residency.png":::

## Next steps

[Prepare your Azure Arc-enabled Kubernetes cluster](./howto-prepare-cluster.md) to configure and Arc-enable a cluster for Azure IoT Operations.
