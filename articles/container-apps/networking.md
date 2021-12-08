---
title: Use a virtual network in an Azure Container Apps Preview environment
description: Learn how to provide a VNET to an Azure Container Apps environment.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic:  conceptual
ms.date: 12/06/2021
ms.author: cshoe
---

# Use a virtual network in an Azure Container Apps Preview environment

As you create an Azure Container Apps [environment](environment.md), a virtual network (VNET) is created for you, or you can provide your own. Network addresses are assigned from a subnet range you define as the environment is created.

- You control the subnet range used by the container app.
- Once the environment is created, the subnet range is immutable.
- Each [revision pod](revisions.md) is assigned an IP address in the subnet.
- Current support is for outbound VNET only

:::image type="content" source="media/networking/azure-container-apps-virtual-network.png" alt-text="Azure Container Apps environments use an existing VNET, or you can provide your own.":::

## Example

The following example shows you how to create a Container Apps environment with an existing virtual network.

Before you begin, you need to following information:

- [Azure Subscription ID](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade)
- [Resource group](../azure-resource-manager/management/manage-resource-groups-portal.md#what-is-a-resource-group) name and location
- [Log analytics workspace](../azure-monitor/logs/log-analytics-tutorial.md) name

With these resources ready, replace the placeholders between the `<>` brackets with your own values.

# [Bash](#tab/bash)

```bash
SUBSCRIPTION_ID=<SUBSCRIPTION_ID>
RESOURCE_GROUP_NAME=<RESOURCE_GROUP_NAME>
RESOURCE_GROUP_LOCATION=<RESOURCE_GROUP_LOCATION>
LOG_ANALYTICS_WORKSPACE_NAME=<LOG_ANALYTICS_WORKSPACE_NAME>
```

# [PowerShell](#tab/powershell)

```powershell
$SUBSCRIPTION_ID=<SUBSCRIPTION_ID>
$RESOURCE_GROUP_NAME=<RESOURCE_GROUP_NAME>
$RESOURCE_GROUP_LOCATION=<RESOURCE_GROUP_LOCATION>
$LOG_ANALYTICS_WORKSPACE_NAME=<LOG_ANALYTICS_WORKSPACE_NAME>
```

---

Next, query for the Log Analytics client ID and secret.

# [Bash](#tab/bash)

```bash
LOG_ANALYTICS_WORKSPACE_CLIENT_ID=`az monitor log-analytics workspace show --query customerId -g $RESOURCE_GROUP_NAME -n $LOG_ANALYTICS_WORKSPACE_NAME | tr -d '[:space:]'`
```

```bash
LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET=`az monitor log-analytics workspace get-shared-keys --query primarySharedKey -g $RESOURCE_GROUP_NAME -n $LOG_ANALYTICS_WORKSPACE_NAME | tr -d '[:space:]'`
```

# [PowerShell](#tab/powershell)

```powershell
$LOG_ANALYTICS_WORKSPACE_CLIENT_ID=az monitor log-analytics workspace show --query customerId -g $RESOURCE_GROUP_NAME -n $LOG_ANALYTICS_WORKSPACE_NAME | tr -d '[:space:]'
```

```powershell
$LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET=az monitor log-analytics workspace get-shared-keys --query primarySharedKey -g $RESOURCE_GROUP_NAME -n $LOG_ANALYTICS_WORKSPACE_NAME | tr -d '[:space:]'
```

---

The Log Analytics values are used as you create the Container Apps environment.

Next, declare variables to hold the new environment and VNET names. Replace your values with the placeholders surrounded by the `<>` brackets.

# [Bash](#tab/bash)

```bash
CONTAINER_APPS_ENVIRONMENT_NAME=<CONTAINER_APPS_ENVIRONMENT_NAME>
VNET_NAME=<VNET_NAME>
```

# [PowerShell](#tab/powershell)

```powershell
$CONTAINER_APPS_ENVIRONMENT_NAME=<CONTAINER_APPS_ENVIRONMENT_NAME>
$VNET_NAME=<VNET_NAME>
```

---

Now create an instance of the virtual network to associate with the Container Apps environment.

> [!NOTE]
> You can use an existing virtual network, but two empty subnets are required to use with Container Apps.

# [Bash](#tab/bash)

```azurecli
az network vnet create \
  --resource-group ${RESOURCE_GROUP_NAME} \
  --name ${VNET_NAME} \
  --location ${RESOURCE_GROUP_LOCATION} \
  --address-prefix 10.0.0.0/16 \
  --subnet-name default \
  --subnet-prefix 10.0.0.0/24
```

# [PowerShell](#tab/powershell)

```powershell
az network vnet create `
  --resource-group $RESOURCE_GROUP_NAME `
  --name $VNET_NAME `
  --location $RESOURCE_GROUP_LOCATION `
  --address-prefix 10.0.0.0/16 `
  --subnet-name default `
  --subnet-prefix 10.0.0.0/24
```

---

With the VNET established, you can now query for the VNET and subnet IDs.

# [Bash](#tab/bash)

```bash
VNET_RESOURCE_ID=`az network vnet show -g ${RESOURCE_GROUP_NAME} -n ${VNET_NAME} --query "id" -o tsv | tr -d '[:space:]'`
```

```bash
SUBNET_RESOURCE_ID=`az network vnet show -g ${RESOURCE_GROUP_NAME} -n ${VNET_NAME} --query "subnets[0].id" -o tsv | tr -d '[:space:]'`
```

# [PowerShell](#tab/powershell)

```powershell
VNET_RESOURCE_ID=(az network vnet show -g $RESOURCE_GROUP_NAME -n $VNET_NAME --query "id" -o tsv | tr -d "[:space:]")
```

```powershell
SUBNET_RESOURCE_ID=(az network vnet show -g $RESOURCE_GROUP_NAME -n $VNET_NAME --query "subnets[0].id" -o tsv | tr -d "[:space:]")
```

---

Finally, create the Container Apps environment with the VNET and subnet.

# [Bash](#tab/bash)

```azurecli
az containerapp env create \
  --name $CONTAINER_APPS_ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP_NAME \
  --logs-workspace-id $LOG_ANALYTICS_WORKSPACE_CLIENT_ID \
  --logs-workspace-key $LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET \
  --location "canadacentral" \
  --subnet-resource-id $SUBNET_RESOURCE_ID
```

# [PowerShell](#tab/powershell)

```powershell
az containerapp env create `
  --name $CONTAINER_APPS_ENVIRONMENT_NAME `
  --resource-group $RESOURCE_GROUP_NAME `
  --logs-workspace-id $LOG_ANALYTICS_WORKSPACE_CLIENT_ID `
  --logs-workspace-key $LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET `
  --location "canadacentral" `
  --subnet-resource-id $SUBNET_RESOURCE_ID
```

---

## Next steps

> [!div class="nextstepaction"]
> [Managing autoscaling behavior](scale-app.md)
