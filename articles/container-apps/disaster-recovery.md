---
title: Disaster recovery guidance for Azure Container Apps
description: Learn how to plan for and recover from disaster recovery scenarios in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.author: cshoe
ms.service: container-apps
ms.topic: tutorial
ms.date: 6/17/2022
---

# Disaster recovery guidance for Azure Container Apps

Azure Container Apps uses [availability zones](../availability-zones/az-overview.md#availability-zones) in regions where they're available to provide high-availability protection for your applications and data from data center failures.

Availability zones are unique physical locations within an Azure region. Each zone is made up of one or more data centers equipped with independent power, cooling, and networking. To ensure resiliency, there's a minimum of three separate zones in all enabled regions. You can build high availability into your application architecture by co-locating your compute, storage, networking, and data resources within a zone and replicating in other zones.

By enabling Container Apps' zone redundancy feature, replicas are automatically randomly distributed across the zones in the region.  Traffic is load balanced among the replicas.  If a zone outage occurs, traffic will automatically be routed to the replicas in the remaining zones.

In the unlikely event of a full region outage, you have the option of using one of two strategies:

- **Manual recovery**: Manually deploy to a new region, or wait for the region to recover, and then manually redeploy all environments and apps.

- **Resilient recovery**: First, deploy your container apps in advance to multiple regions. Next, use Azure Front Door or Azure Traffic Manager to handle incoming requests, pointing traffic to your primary region. Then, should an outage occur, you can redirect traffic away from the affected region. For more information, see [Cross-region replication in Azure](../availability-zones/cross-region-replication-azure.md).

> [!NOTE]
> Regardless of which strategy you choose, make sure your deployment configuration files are in source control so you can easily redeploy if necessary.

Additionally, the following resources can help you create your own disaster recovery plan:

- [Failure and disaster recovery for Azure applications](/azure/architecture/reliability/disaster-recovery)
- [Azure resiliency technical guidance](/azure/architecture/checklist/resiliency-per-service)

## Set up zone redundancy in your Container Apps environment

To take advantage of availability zones, you must enable zone redundancy when you create the Container Apps environment.  The environment must include a virtual network (VNET) with an infrastructure subnet.  To ensure proper distribution of replicas, you should configure your app's minimum and maximum replica count with values that are divisible by three.  The minimum replica count should be at least three. 

### Enable zone redundancy via the Azure portal 
 
To create a container app in an environment with zone redundancy enabled using the Azure portal:

1. Navigate to the Azure portal.
1. Search for **Container Apps** in the top search box.
1. Select **Container Apps**.
1. Select **Create New** in the *Container Apps Environment* field to open the *Create Container Apps Environment* panel.
1. Enter the environment name.
1. Select **Enabled** for the *Zone redundancy* field.

Zone redundancy requires a virtual network (VNET) with an infrastructure subnet.  You can choose an existing VNET or create a new one.  When creating a new VNET, you can accept the values provided for you or customize the settings.

1. Select the **Networking** tab.  
1. To assign a custom VNET name, select **Create New** in the *Virtual Network* field.
1. To assign a custom infrastructure subnet name, select **Create New** in the *Infrastructure subnet* field.
1. You can select **Internal** or **External** for the *Virtual IP*.
1. Select **Create**.

:::image type="content" source="media/screen-shot-vnet-configuration.png" alt-text="Screen shot of Networking tab in Create Container Apps Environment page.":::

### Enable zone redundancy with the Azure CLI

Create a VNET and infrastructure subnet to include with the Container Apps environment.

When using these commands, replace the `<PLACEHOLDERS>` with your values.

# [Bash](#tab/bash)

```azurecli
az network vnet create \
  --resource-group <RESOURCE_GROUP_NAME> \
  --name <VNET_NAME> \
  --location <LOCATION> \
  --address-prefix 10.0.0.0/16
```

```azurecli
az network vnet subnet create \
  --resource-group <RESOURCE_GROUP_NAME> \
  --vnet-name <VNET_NAME> \
  --name infrastructure \
  --address-prefixes 10.0.0.0/23
```

# [PowerShell](#tab/powershell)

```powershell
az network vnet create `
  --resource-group <RESOURCE_GROUP_NAME> `
  --name <VNET_NAME> `
  --location <LOCATION> `
  --address-prefix 10.0.0.0/16
```

```powershell
az network vnet subnet create `
  --resource-group <RESOURCE_GROUP_NAME> `
  --vnet-name <VNET_NAME> `
  --name infrastructure-subnet `
  --address-prefixes 10.0.0.0/23
```

---

Next, query for the infrastructure subnet ID.

# [Bash](#tab/bash)

```bash
INFRASTRUCTURE_SUBNET=`az network vnet subnet show --resource-group <RESOURCE_GROUP_NAME> --vnet-name <VNET_NAME> --name infrastructure-subnet --query "id" -o tsv | tr -d '[:space:]'`
```

# [PowerShell](#tab/powershell)

```powershell
$INFRASTRUCTURE_SUBNET=(az network vnet subnet show --resource-group <RESOURCE_GROUP_NAME> --vnet-name <VNET_NAME> --name infrastructure-subnet --query "id" -o tsv)
```

---

Finally, create the environment with the `--zone-redundant` parameter.  The location must be the same location used when creating the VNET.

# [Bash](#tab/bash)

```azurecli
az containerapp env create \
  --name <CONTAINER_APP_ENV_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --location "<LOCATION>" \
  --infrastructure-subnet-resource-id $INFRASTRUCTURE_SUBNET \
  --zone-redundant
```

# [PowerShell](#tab/powershell)

```powershell
az containerapp env create `
  --name <CONTAINER_APP_ENV_NAME> `
  --resource-group <RESOURCE_GROUP_NAME> `
  --location "<LOCATION>" `
  --infrastructure-subnet-resource-id $INFRASTRUCTURE_SUBNET `
  --zone-redundant
```

---
