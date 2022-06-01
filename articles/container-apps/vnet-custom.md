---
title: Provide an external virtual network to an Azure Container Apps environment
description: Learn how to provide an external VNET to an Azure Container Apps environment.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic:  how-to
ms.date: 05/16/2022
ms.author: cshoe
zone_pivot_groups: azure-cli-or-portal
---

# Provide a virtual network to an external Azure Container Apps environment

The following example shows you how to create a Container Apps environment in an existing virtual network.

> [!IMPORTANT]
> In order to ensure the environment deployment within your custom VNET is successful, configure your VNET with an "allow-all" configuration by default. The full list of traffic dependencies required to configure the VNET as "deny-all" is not yet available. For more information, see [Known issues for public preview](https://github.com/microsoft/azure-container-apps/wiki/Known-Issues-for-public-preview).

::: zone pivot="azure-portal"

<!-- Create -->
[!INCLUDE [container-apps-create-portal-steps.md](../../includes/container-apps-create-portal-steps.md)]

7. Select the **Networking** tab to create a VNET.
8. Select **Yes** next to *Use your own virtual network*.
9. Next to the *Virtual network* box, select the **Create new** link and enter the following value.

    | Setting | Value |
    |--|--|
    | Name | Enter **my-custom-vnet**. |

10. Select the **OK** button.
11. Next to the *Infrastructure subnet* box, select the **Create new** link and enter the following values:

    | Setting | Value |
    |---|---|
    | Subnet Name | Enter **infrastructure-subnet**. |
    | Virtual Network Address Block | Keep the default values. |
    | Subnet Address Block | Keep the default values. |

12. Select the **OK** button.
13. Under *Virtual IP*, select **External**.
14. Select **Create**.

<!-- Deploy -->
[!INCLUDE [container-apps-create-portal-deploy.md](../../includes/container-apps-create-portal-deploy.md)]

::: zone-end

::: zone pivot="azure-cli"

## Prerequisites

- Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli) version 2.28.0 or higher.

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

Now create an Azure virtual network to associate with the Container Apps environment. The virtual network must have a subnet available for the environment deployment.

> [!NOTE]
> You can use an existing virtual network, but a dedicated subnet is required for use with Container Apps.

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
  --name infrastructure-subnet \
  --address-prefixes 10.0.0.0/23
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
  --name infrastructure-subnet `
  --address-prefixes 10.0.0.0/23
```

---

With the virtual network created, you can retrieve the IDs for both the VNET and the infrastructure subnet.

# [Bash](#tab/bash)

```bash
VNET_RESOURCE_ID=`az network vnet show --resource-group ${RESOURCE_GROUP} --name ${VNET_NAME} --query "id" -o tsv | tr -d '[:space:]'`
```

```bash
INFRASTRUCTURE_SUBNET=`az network vnet subnet show --resource-group ${RESOURCE_GROUP} --vnet-name $VNET_NAME --name infrastructure-subnet --query "id" -o tsv | tr -d '[:space:]'`
```

# [PowerShell](#tab/powershell)

```powershell
$VNET_RESOURCE_ID=(az network vnet show --resource-group $RESOURCE_GROUP --name $VNET_NAME --query "id" -o tsv)
```

```powershell
$INFRASTRUCTURE_SUBNET=(az network vnet subnet show --resource-group $RESOURCE_GROUP --vnet-name $VNET_NAME --name infrastructure-subnet --query "id" -o tsv)
```

---

Finally, create the Container Apps environment using the custom VNET deployed in the preceding steps.

# [Bash](#tab/bash)

```azurecli
az containerapp env create \
  --name $CONTAINERAPPS_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION" \
  --infrastructure-subnet-resource-id $INFRASTRUCTURE_SUBNET
```

# [PowerShell](#tab/powershell)

```powershell
az containerapp env create `
  --name $CONTAINERAPPS_ENVIRONMENT `
  --resource-group $RESOURCE_GROUP `
  --location "$LOCATION" `
  --infrastructure-subnet-resource-id $INFRASTRUCTURE_SUBNET
```

---

> [!NOTE]
> As you call `az containerapp create` to create the container app inside your environment, make sure the value for the `--image` parameter is in lower case.

The following table describes the parameters used in `containerapp env create`.

| Parameter | Description |
|---|---|
| `name` | Name of the container apps environment. |
| `resource-group` | Name of the resource group. |
| `location` | The Azure location where the environment is to deploy.  |
| `infrastructure-subnet-resource-id` | Resource ID of a subnet for infrastructure components and user application containers. |

With your environment created using a custom virtual network, you can now deploy container apps using the `az containerapp create` command.

### Optional configuration

You have the option of deploying a private DNS and defining custom networking IP ranges for your Container Apps environment.

#### Deploy with a private DNS

If you want to deploy your container app with a private DNS, run the following commands.

First, extract identifiable information from the environment.

# [Bash](#tab/bash)

```bash
ENVIRONMENT_DEFAULT_DOMAIN=`az containerapp env show --name ${CONTAINERAPPS_ENVIRONMENT} --resource-group ${RESOURCE_GROUP} --query defaultDomain --out json | tr -d '"'`
```

```bash
ENVIRONMENT_STATIC_IP=`az containerapp env show --name ${CONTAINERAPPS_ENVIRONMENT} --resource-group ${RESOURCE_GROUP} --query staticIp --out json | tr -d '"'`
```

```bash
VNET_ID=`az network vnet show --resource-group ${RESOURCE_GROUP} --name ${VNET_NAME} --query id --out json | tr -d '"'`
```

# [PowerShell](#tab/powershell)

```powershell
$ENVIRONMENT_DEFAULT_DOMAIN=(az containerapp env show --name $CONTAINERAPPS_ENVIRONMENT --resource-group $RESOURCE_GROUP --query defaultDomain -o tsv)
```

```powershell
$ENVIRONMENT_STATIC_IP=(az containerapp env show --name $CONTAINERAPPS_ENVIRONMENT --resource-group $RESOURCE_GROUP --query staticIp -o tsv)
```

```powershell
$VNET_ID=(az network vnet show --resource-group $RESOURCE_GROUP --name $VNET_NAME --query id -o tsv)
```

---

Next, set up the private DNS.

# [Bash](#tab/bash)

```azurecli
az network private-dns zone create \
  --resource-group $RESOURCE_GROUP \
  --name $ENVIRONMENT_DEFAULT_DOMAIN
```

```azurecli
az network private-dns link vnet create \
  --resource-group $RESOURCE_GROUP \
  --name $VNET_NAME \
  --virtual-network $VNET_ID \
  --zone-name $ENVIRONMENT_DEFAULT_DOMAIN -e true
```

```azurecli
az network private-dns record-set a add-record \
  --resource-group $RESOURCE_GROUP \
  --record-set-name "*" \
  --ipv4-address $ENVIRONMENT_STATIC_IP \
  --zone-name $ENVIRONMENT_DEFAULT_DOMAIN
```

# [PowerShell](#tab/powershell)

```powershell
az network private-dns zone create `
  --resource-group $RESOURCE_GROUP `
  --name $ENVIRONMENT_DEFAULT_DOMAIN
```

```powershell
az network private-dns link vnet create `
  --resource-group $RESOURCE_GROUP `
  --name $VNET_NAME `
  --virtual-network $VNET_ID `
  --zone-name $ENVIRONMENT_DEFAULT_DOMAIN -e true
```

```powershell
az network private-dns record-set a add-record `
  --resource-group $RESOURCE_GROUP `
  --record-set-name "*" `
  --ipv4-address $ENVIRONMENT_STATIC_IP `
  --zone-name $ENVIRONMENT_DEFAULT_DOMAIN
```

---

#### Networking parameters

There are three optional networking parameters you can choose to define when calling `containerapp env create`. Use these options when you have a peered VNET with separate address ranges. Explicitly configuring these ranges ensures the addresses used by the Container Apps environment doesn't conflict with other ranges in the network infrastructure.

You must either provide values for all three of these properties, or none of them. If they aren’t provided, the CLI generates the values for you.

| Parameter | Description |
|---|---|
| `platform-reserved-cidr` | The address range used internally for environment infrastructure services. Must have a size between `/21` and `/12`. |
| `platform-reserved-dns-ip` | An IP address from the `platform-reserved-cidr` range that is used for the internal DNS server. The address can't be the first address in the range, or the network address. For example, if `platform-reserved-cidr` is set to `10.2.0.0/16`, then `platform-reserved-dns-ip` can't be `10.2.0.0` (this is the network address), or `10.2.0.1` (infrastructure reserves use of this IP). In this case, the first usable IP for the DNS would be `10.2.0.2`. |
| `docker-bridge-cidr` | The address range assigned to the Docker bridge network. This range must have a size between `/28` and `/12`. |

- The `platform-reserved-cidr` and `docker-bridge-cidr` address ranges can't conflict with each other, or with the ranges of either provided subnet. Further, make sure these ranges don't conflict with any other address range in the VNET.

- If these properties aren’t provided, the CLI autogenerates the range values based on the address range of the VNET to avoid range conflicts.

::: zone-end

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Container Apps instance and all the associated services by removing the **my-container-apps** resource group.

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

## Additional resources

- Refer to [What is Azure Private Endpoint](../private-link/private-endpoint-overview.md) for more details on configuring your private endpoint.

- To set up DNS name resolution for internal services, you must [set up your own DNS server](../dns/index.yml).

## Next steps

> [!div class="nextstepaction"]
> [Managing autoscaling behavior](scale-app.md)
