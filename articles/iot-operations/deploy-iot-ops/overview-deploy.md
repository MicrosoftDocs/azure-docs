---
title: Deployment overview
description: Learn about the components that are included in an Azure IoT Operations deployment and the different deployment options to consider for your scenario.
author: kgremban
ms.author: kgremban
ms.topic: conceptual
ms.custom:
ms.date: 11/06/2024

#CustomerIntent: As an IT professional, I want to understand the components and deployment details before I start using Azure IoT Operations.
---

# Deployment details

When you deploy Azure IoT Operations, you install a suite of services on an Azure Arc-enabled Kubernetes cluster. This article provides an overview of the different deployment options to consider for your scenario.

## Supported environments

Microsoft supports the following environments for Azure IoT Operations deployments.

| Environment | Minimum version | Availability |
| ----------- | --------------- | ------------ |
| K3s on Ubuntu 24.04 | K3s version 1.31.1 | General availability |
| Azure Kubernetes Service (AKS) Edge Essentials on Windows 11 IoT Enterprise | AksEdge-K3s-1.29.6-1.8.202.0 | Public preview |
| Azure Kubernetes Service (AKS) on Azure Local | Azure Stack HCI OS, version 23H2, build 2411 | Public preview |

>[!NOTE]
>Billing usage records are collected on any environment where Azure IoT Operations is installed, regardless of support or availability levels.

To install Azure IoT Operations, have the following hardware requirements available for Azure IoT Operations. If you're using a multi-node cluster that enables fault tolerance, scale up to the recommended capacity for better performance.

| Spec | Minimum | Recommended |
|------|---------|-------------|
| Hardware memory capacity (RAM) | 16-GB | 32-GB |
| Available memory for Azure IoT Operations (RAM) | 10-GB | Depends on usage |
| CPU  | 4 vCPUs | 8 vCPUs     |

## Choose your features

Azure IoT Operations offers two deployment modes. You can choose to deploy with *test settings*, a basic subset of features that are simpler to get started with for evaluation scenarios. Or, you can choose to deploy with *secure settings*, the full feature set.

### Test settings deployment

A deployment with only test settings:

* Doesn't configure secrets or user-assigned managed identity capabilities.
* Is meant to enable the end-to-end quickstart sample for evaluation purposes, so supports the OPC PLC simulator and connects to cloud resources using system-assigned managed identity.
* Can be upgraded to use secure settings.

The quickstart scenario, [Quickstart: Run Azure IoT Operations in GitHub Codespaces](../get-started-end-to-end-sample/quickstart-deploy.md), uses test settings.

At any point, you can upgrade an Azure IoT Operations instance to use secure settings by following the steps in [Enable secure settings](howto-enable-secure-settings.md).

### Secure settings deployment

A deployment with secure settings:

* Enables secrets and user-assignment managed identity, both of which are important capabilities for developing a production-ready scenario. Secrets are used whenever Azure IoT Operations components connect to a resource outside of the cluster; for example, an OPC UA server or a dataflow endpoint.

To deploy Azure IoT Operations with secure settings, follow these articles:

1. Start with [Prepare your Azure Arc-enabled Kubernetes cluster](./howto-prepare-cluster.md) to configure and Arc-enable your cluster.
1. Then, [Deploy Azure IoT Operations](./howto-deploy-iot-operations.md).

## Required permissions

The following table describes Azure IoT Operations deployment and management tasks that require elevated permissions. For information about assigning roles to users, see [Steps to assign an Azure role](../../role-based-access-control/role-assignments-steps.md).

| Task | Required permission | Comments |
| ---- | ------------------- | -------- |
| Deploy Azure IoT Operations | **Contributor** role at the resource group level. |  |
| Register resource providers | Microsoft.ExtendedLocation/register/action Microsoft.SecretSyncController/register/action Microsoft.Kubernetes/register/action Microsoft.KubernetesConfiguration/register/action Microsoft.IoTOperations/register/action Microsoft.DeviceRegistry/register/action| Only required to do once per subscription. |
| Create a schema registry. | **Microsoft.Authorization/roleAssignments/write** permissions at the resource group level. |  |
| Create secrets in Key Vault | **Key Vault Secrets Officer** role at the resource level. | Only required for secure settings deployment. |
| Enable resource sync rules on an Azure IoT Operations instance | **Microsoft.Authorization/roleAssignments/write** permissions at the resource group level. | Resource sync rules are disabled by default, but can be enabled as part of the [az iot ops create](/cli/azure/iot/ops#az-iot-ops-create) command. |

If you use the Azure CLI to assign roles, use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to give permissions. For example, `az role assignment create --assignee sp_name --role "Role Based Access Control Administrator" --scope subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup`

If you use the Azure portal to assign privileged admin roles to a user or principal, you're prompted to restrict access using conditions. For this scenario, select the **Allow user to assign all roles** condition in the **Add role assignment** page.

:::image type="content" source="./media/howto-deploy-iot-operations/add-role-assignment-conditions.png" alt-text="Screenshot that shows assigning users highly privileged role access in the Azure portal.":::

## Organize instances by using sites

Azure IoT Operations supports Azure Arc sites for organizing instances. A _site_ is a cluster resource in Azure like a resource group, but sites typically group instances by physical location and make it easier for OT users to locate and manage assets. An IT administrator creates sites and scopes them to a subscription or resource group. Then, any Azure IoT Operations deployed to an Arc-enabled cluster is automatically collected in the site associated with its subscription or resource group

For more information, see [What is Azure Arc site manager (preview)?](/azure/azure-arc/site-manager/overview)

## Azure IoT Operations endpoints

If you use enterprise firewalls or proxies to manage outbound traffic, configure the following endpoints before deploying Azure IoT Operations.

* Endpoints in the [Azure Arc-enabled Kubernetes endpoints](/azure/azure-arc/network-requirements-consolidated#azure-arc-enabled-kubernetes-endpoints).

  >[!NOTE]
  >If you use *Azure Arc Gateway* to connect your cluster to Arc, you can configure a smaller set of endpoints based on the [Arc Gateway guidance](/azure/azure-arc/servers/arc-gateway#step-3-ensure-the-required-urls-are-allowed-in-your-environment).

* Endpoints in [Azure CLI endpoints](/cli/azure/azure-cli-endpoints?tabs=azure-cloud#endpoints).

  You need `graph.windows.net`, `*.azurecr.io`, `*.blob.core.windows.net`, `*.vault.azure.net` from this endpoint list.

* The following endpoints are required specifically for Azure IoT Operations:

  |Endpoints (DNS) | Description |
  |-|-|
  | `<customer-specific>.blob.storage.azure.net` | Storage for schema registry. Refer to [storage account endpoints](/azure/storage/common/storage-account-overview#storage-account-endpoints) for identifying the customer specific subdomain of your endpoint. |

* To push data to the cloud, enable the following endpoints based on your choice of data platform.

  * Microsoft Fabric OneLake: [Add Fabric URLs to your allowlist](/fabric/security/fabric-allow-list-urls#onelake).
  * Event Hubs: [Troubleshoot connectivity issues - Azure Event Hubs](/azure/event-hubs/troubleshooting-guide).
  * Event Grid: [Troubleshoot connectivity issues - Azure Event Grid](/azure/event-grid/troubleshoot-network-connectivity).
  * Azure Data Lake Storage Gen 2: [Storage account standard endpoints](/azure/storage/common/storage-account-overview#standard-endpoints).


## Next steps

[Prepare your Azure Arc-enabled Kubernetes cluster](./howto-prepare-cluster.md) to configure and Arc-enable a cluster for Azure IoT Operations.
