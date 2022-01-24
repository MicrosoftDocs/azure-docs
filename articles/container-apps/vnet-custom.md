---
title: Provide a virtual network to an Azure Container Apps Preview environment
description: Learn how to provide a VNET to an Azure Container Apps environment.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic:  how-to
ms.date: 1/24/2021
ms.author: cshoe
zone_pivot_groups: azure-cli-or-portal
---

# Provide a virtual network to an Azure Container Apps Preview environment

As you create an Azure Container Apps [environment](environment.md), a virtual network (VNET) is created for you, or you can provide your own. Network addresses are assigned from a subnet range you define as the environment is created.

- You control the subnet range used by the container app environment.
- Once the environment is created, the subnet range is immutable.
- A single load balancer and single Kubernetes service is associated with each container apps environment.
- Each [revision pod](revisions.md) is assigned an IP address in the subnet.
- You can restrict inbound requests to the environment exclusively to the vNET by setting the `internalOnly` switch.

> [!NOTE]
> Current support is for outbound VNET only. Refer to the [project GitHub repository](https://github.com/microsoft/azure-container-apps) for roadmap information.

> [!IMPORTANT]
> During preview, the VNET dependency policies must be set to "allow all". Refer to the [custom VNET security sample](azurecontainerapps/customvnet) for the latest iteration of the firewall security features.

:::image type="content" source="media/networking/azure-container-apps-virtual-network.png" alt-text="Azure Container Apps environments use an existing VNET, or you can provide your own.":::

## Subnet types

As a container app environment is created, you provide resource IDs for two different subnets.

- **App subnet**: TODO 👈 need help with description
- **Control plane subnet**: TODO 👈 need help with description

## Accessibility level

Hou have control over the public accessibility of your container app by selecting to deploy it as an internal or external resource. The accessibility level affects both the IP addresses and the Envoy load balancer.

### External

Container app environments deployed as external resources are available for public requests. External environments have a VIP on an external IP address, often called an External ASE.

### Internal

When set to internal, the environment has no public endpoint. Internal environments have a VIP on an internal IP address, often called an ILB ASE because the internal endpoint is an internal load balancer (ILB). IP addresses are issued from the custom VNET's list of private IP addresses.

If a container app can be set to internal when the container app is only being called by other container apps or via Dapper.

To create an internal only environment provide the `--internal-only` parameter to the `az containerapp env create` command.

## Example

The following example shows you how to create a Container Apps environment with an existing virtual network.

::: zone pivot="azure-portal"

<!-- Create -->
[!INCLUDE [container-apps-create-portal-steps.md](../../includes/container-apps-create-portal-steps.md)]

7. Select the **Neworking** tab to create a VNET.
8. Select **Yes** next to *Use your own virtual network*.
9. Next to the *Virtual network* box, select the **Create new** link.
10. Enter **my-custom-vnet** in the name box.
11. Select the **OK** button.
12. Next to the *Control plane subnet* box, select the **Create new** link and enter the following values:

    | Setting | Value |
    |---|---|
    | Subnet name | Enter **my-control-plane-vnet**. |
    | Virtual Network Address Block | Keep the default values. |
    | Subnet Address Block | Keep the default values. |

13. Select the **OK** button.
14. Next to the *Control plane subnet* box, select the **Create new** link and enter the following values:

    | Setting | Value |
    |---|---|
    | Subnet name | Enter **my-apps-vnet**. |
    | Virtual Network Address Block | Keep the default values. |
    | Subnet Address Block | Keep the default values. |

15. Under *Virtual IP*, select **External**.
16. Select **Create**.

<!-- Deploy -->
[!INCLUDE [container-apps-create-portal-deploy.md](../../includes/container-apps-create-portal-deploy.md)]

::: zone-end

::: zone pivot="azure-cli"

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

Next, declare a variable to hold the VNET name.

# [Bash](#tab/bash)

```bash
VNET_NAME="my-custom-vnet"
```

# [PowerShell](#tab/powershell)

```powershell
$VNET_NAME="my-custom-vnet"
```

---

Now create an instance of the virtual network to associate with the Container Apps environment. The virtual network must have two subnets available for the container apps instance.

> [!NOTE]
> You can use an existing virtual network, but two empty subnets are required to use with Container Apps.

# [Bash](#tab/bash)

```azurecli
az network vnet create \
  --resource-group $RESOURCE_GROUP \
  --name $VNET_NAME \
  --location $LOCATION \
  --address-prefix 10.0.0.0/16
```

```azurecli
az network vnet subnet create \
  --resource-group $RESOURCE_GROUP \
  --vnet-name $VNET_NAME \
  --name control-plane \
  --address-prefixes 10.0.0.0/21
```

```azurecli
az network vnet subnet create \
  --resource-group $RESOURCE_GROUP \
  --vnet-name $VNET_NAME \
  --name applications \
  --address-prefixes 10.0.8.0/21
```

# [PowerShell](#tab/powershell)

```powershell
az network vnet create `
  --resource-group $RESOURCE_GROUP `
  --name $VNET_NAME `
  --location $LOCATION `
  --address-prefix 10.0.0.0/16
```

```powershell
az network vnet subnet create `
  --resource-group $RESOURCE_GROUP `
  --vnet-name $VNET_NAME `
  --name control-plane `
  --address-prefixes 10.0.0.0/21
```

```powershell
az network vnet subnet create `
  --resource-group $RESOURCE_GROUP `
  --vnet-name $VNET_NAME `
  --name applications `
  --address-prefixes 10.0.8.0/21
```

---

With the VNET established, you can now query for the VNET, control plane, and app subnet IDs.

# [Bash](#tab/bash)

```bash
VNET_RESOURCE_ID=`az network vnet show -g ${RESOURCE_GROUP} -n ${VNET_NAME} --query "id" -o tsv | tr -d '[:space:]'`
```

```bash
CONTROL_PLANE_SUBNET=`az network vnet subnet show -g ${RESOURCE_GROUP} --vnet-name $VNET_NAME -n control-plane --query "id" -o tsv | tr -d '[:space:]'`
```

```bash
APP_SUBNET=`az network vnet subnet show -g ${RESOURCE_GROUP} --vnet-name ${VNET_NAME} -n applications --query "id" -o tsv | tr -d '[:space:]'`
```

# [PowerShell](#tab/powershell)

```powershell
$VNET_RESOURCE_ID=(az network vnet show -g $RESOURCE_GROUP -n $VNET_NAME --query "id" -o tsv)
```

```powershell
$CONTROL_PLANE_SUBNET=(az network vnet subnet show -g $RESOURCE_GROUP --vnet-name $VNET_NAME -n control-plane --query "id" -o tsv)
```

```powershell
$APP_SUBNET=(az network vnet subnet show -g $RESOURCE_GROUP --vnet-name $VNET_NAME -n applications --query "id" -o tsv)
```

---

Finally, create the Container Apps environment with the VNET and subnets.

# [Bash](#tab/bash)

```azurecli
az containerapp env create \
  --name $CONTAINERAPPS_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --logs-workspace-id $LOG_ANALYTICS_WORKSPACE_CLIENT_ID \
  --logs-workspace-key $LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET \
  --location "$LOCATION" \
  --app-subnet-resource-id $APP_SUBNET \
  --controlplane-subnet-resource-id $CONTROL_PLANE_SUBNET
```

# [PowerShell](#tab/powershell)

```powershell
az containerapp env create `
  --name $CONTAINERAPPS_ENVIRONMENT `
  --resource-group $RESOURCE_GROUP `
  --logs-workspace-id $LOG_ANALYTICS_WORKSPACE_CLIENT_ID `
  --logs-workspace-key $LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET `
  --location "$LOCATION" `
  --app-subnet-resource-id $APP_SUBNET `
  --controlplane-subnet-resource-id $CONTROL_PLANE_SUBNET
```

---

The following table describes the parameters used in for `containerapp env create`.

| Parameter | Description |
|---|---|
| `name` | Name of the container apps environment. |
| `resource-group` | Name of the resource group. |
| `logs-workspace-id` | The ID of the Log Analytics workspace. |
| `logs-workspace-key` | The Log Analytics client secret.  |
| `location` | The Azure location where the environment is to deploy.  |
| `app-subnet-resource-id` | The resource ID of a subnet where containers are injected into the container app. This subnet must be in the same VNET as the subnet defined in `--control-plane-subnet-resource-id`. |
| `controlplane-subnet-resource-id` | The resource ID of a subnet for control plane infrastructure components. This subnet must be in the same VNET as the subnet defined in `--app-subnet-resource-id`. |
| `--internal-only` | Optional parameter that scopes the environment to IP addresses only available the custom VNET. |

With your environment created with your custom virtual network, you can create container apps into the environment using the `az containerapp create` command.

::: zone-end

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Container Apps instance and all the associated services by removing the resource group.

::: zone pivot="azure-cli"

# [Bash](#tab/bash)

```azurecli
az group delete \
  --name $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```azurecli
az group delete `
  --name $RESOURCE_GROUP
```

---

::: zone-end

## Restrictions

Subnet address ranges can't overlap with the following reserved ranges:

- 169.254.0.0/16
- 172.30.0.0/16
- 172.31.0.0/16
- 192.0.2.0/24

Additionally, subnets must have a size between /21 and /12.

## Additional resources

- Refer to [What is Azure Private Endpoint](/azure/private-link/private-endpoint-overview) for more details on configuring your private endpoint.

- To set up DNS name resolution for internal services, you must [set up your own DNS server](/azure/dns/).

## Next steps

> [!div class="nextstepaction"]
> [Managing autoscaling behavior](scale-app.md)
