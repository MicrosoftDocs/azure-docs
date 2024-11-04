---
title: Deployment overview
description: Learn about the components that are included in an Azure IoT Operations deployment and the different deployment options to consider for your scenario.
author: kgremban
ms.author: kgremban
ms.topic: conceptual
ms.custom:
ms.date: 10/23/2024

#CustomerIntent: As an IT professional, I want to understand the components and deployment details before I start using Azure IoT Operations.
---

# Deployment details

When you deploy Azure IoT Operations, you install a suite of services on an Azure Arc-enabled Kubernetes cluster. This article provides an overview of the different deployment options to consider for your scenario.

## Supported environments

Microsoft supports Azure Kubernetes Service (AKS) Edge Essentials for deployments on Windows and K3s for deployments on Ubuntu. 

* Minimum hardware requirements:
  * 16-GB RAM
  * 4 vCPUs

* Recommended hardware, especially for multi-node K3s clusters that enable fault tolerance:
  * 32-GB RAM
  * 8 vCPUs

[!INCLUDE [validated-environments](../includes/validated-environments.md)]

## Choose your features

Azure IoT Operations offers two deployment modes. You can choose to deploy with *test settings*, a basic subset of features that are simpler to get started with for evaluation scenarios. Or, you can choose to deploy with *secure settings*, the full feature set.

### Test settings deployment

A deployment with only test settings:

* Doesn't configure secrets or user-assigned managed identity capabilities.
* Is meant to enable the end-to-end quickstart sample for evaluation purposes, so supports the OPC PLC simulator and connects to cloud resources using system-assigned managed identity.
* Can be upgraded to use secure settings.

The quickstart scenario, [Quickstart: Run Azure IoT Operations in GitHub Codespaces](../get-started-end-to-end-sample/quickstart-deploy.md), uses test settings.

At any point, you can upgrade an Azure IoT Operations instance to use secure settings by following the steps in [Enable secure settings](../deploy-iot-ops/howto-enable-secure-settings.md).

### Secure settings deployment

A deployment with secure settings:

* Enables secrets and user-assignment managed identity, which are important capabilities for developing a production-ready scenario. Secrets are used whenever Azure IoT Operations components connect to a resource outside of the cluster; for example, an OPC UA server or a dataflow endpoint.

To deploy Azure IoT Operations with secure settings, follow these articles:

1. Start with [Prepare your Azure Arc-enabled Kubernetes cluster](./howto-prepare-cluster.md) to configure and Arc-enable your cluster.
1. Then, [Deploy Azure IoT Operations](./howto-deploy-iot-operations.md).

## Required permissions

The following table describes Azure IoT Operations deployment and management tasks that require elevated permissions. For information about assigning roles to users, see [Steps to assign an Azure role](../../role-based-access-control/role-assignments-steps.md).

| Task | Required permission | Comments |
| ---- | ------------------- | -------- |
| Deploy Azure IoT Operations | **Contributor** role at the subscription level. |  |
| Register resource providers | **Contributor** role at the subscription level. | Only required to do once per subscription. |
| Create a schema registry. | **Microsoft.Authorization/roleAssignments/write** permissions at the resource group level. |  |
| Create secrets in Key Vault | **Key Vault Secrets Officer** role at the resource level. | Only required for secure settings deployment. |
| Enable resource sync rules on an Azure IoT Operations instance | **Microsoft.Authorization/roleAssignments/write** permissions at the resource group level. | Resource sync rules are disabled by default, but can be enabled during instance creation. |

If you use the Azure CLI to assign roles, use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to give permissions. For example, `az role assignment create --assignee sp_name --role "Role Based Access Control Administrator" --scope subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup`

If you use the Azure portal to assign privileged admin roles to a user or principal, you're prompted to restrict access using conditions. For this scenario, select the **Allow user to assign all roles** condition in the **Add role assignment** page.

:::image type="content" source="./media/howto-deploy-iot-operations/add-role-assignment-conditions.png" alt-text="Screenshot that shows assigning users highly privileged role access in the Azure portal.":::

## Included components

Azure IoT Operations is a suite of data services that run on Azure Arc-enabled edge Kubernetes clusters. It also depends on a set of support services that are also installed as part of a deployment.

* Azure IoT Operations core services
  * Dataflows
  * MQTT Broker
  * Connector for OPC UA
  * Akri

* Installed dependencies
  * [Azure Device Registry](../discover-manage-assets/overview-manage-assets.md#store-assets-as-azure-resources-in-a-centralized-registry)
  * [Azure Container Storage enabled by Azure Arc](/azure/azure-arc/container-storage/overview)
  * Secret Sync Controller

## Organize instances by using sites

Azure IoT Operations supports Azure Arc sites for organizing instances. A _site_ is a cluster resource in Azure like a resource group, but sites typically group instances by physical location and make it easier for OT users to locate and manage assets. An IT administrator creates sites and scopes them to a subscription or resource group. Then, any Azure IoT Operations deployed to an Arc-enabled cluster is automatically collected in the site associated with its subscription or resource group

For more information, see [What is Azure Arc site manager (preview)?](/azure/azure-arc/site-manager/overview)

## Domain allowlist for Azure IoT Operations

If you use enterprise firewalls or proxies to manage outbound traffic, add the following endpoints to your domain allowlist before deploying Azure IoT Operations.

Additionally, review the [Azure Arc-enabled Kubernetes endpoints](/azure/azure-arc/network-requirements-consolidated#azure-arc-enabled-kubernetes-endpoints).

```text
nw-umwatson.events.data.microsoft.com 
dc.services.visualstudio.com 
github.com 
self.events.data.microsoft.com 
mirror.enzu.com 
ppa.launchpadcontent.net 
msit-onelake.pbidedicated.windows.net 
gcr.io 
adhs.events.data.microsoft.com 
gbl.his.arc.azure.cn 
onegetcdn.azureedge.net 
graph.windows.net 
pas.windows.net 
agentserviceapi.guestconfiguration.azure.com 
aka.ms 
api.segment.io 
download.microsoft.com 
raw.githubusercontent.com 
go.microsoft.com 
global.metrics.azure.eaglex.ic.gov 
gbl.his.arc.azure.us 
packages.microsoft.com 
global.metrics.azure.microsoft.scloud 
www.powershellgallery.com
k8s.io 
guestconfiguration.azure.com 
ods.opinsights.azure.com 
vault.azure.net 
googleapis.com 
quay.io 
handler.control.monitor.azure.com 
pkg.dev 
docker.io 
prod.hot.ingestion.msftcloudes.com 
docker.com 
prod.microsoftmetrics.com 
oms.opinsights.azure.com 
azureedge.net 
monitoring.azure.com
blob.core.windows.net 
azurecr.io
```

## Next steps

[Prepare your Azure Arc-enabled Kubernetes cluster](./howto-prepare-cluster.md) to configure and Arc-enable a cluster for Azure IoT Operations.