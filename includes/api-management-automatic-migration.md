---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 03/11/2025
ms.author: danlep
---

## Automatic migration

After the retirement date, we'll automatically migrate remaining `stv1` service instances to the `stv2` compute platform. All affected customers will be notified of the upcoming automatic migration a week in advance. Automatic migration might cause downtime for your upstream API consumers. You can still migrate your own instances before automatic migration takes place.

### Virtual network configuration might be removed during automatic migration

Im most cases, automatic migration retains the virtual network settings of your API Management instance, if they're configured. Under certain [special conditions](../articles/api-management/migrate-stv1-to-stv2-vnet.md#special-conditions-and-scenarios), the virtual network configuration of your `stv1` service instance is removed during automatic migration and, as a security measure, access to your service endpoints is blocked. If the network settings were removed during the migration process, you'll see a message in the portal similar to: `We have blocked access to all endpoints for your service`.

:::image type="content" source="media/api-management-automatic-migration/blocked-access.png" alt-text="Screenshot of blocked access to API Management in the portal.":::

While access is blocked, access to the API gateway, developer portal, direct management API, and Git repository is disabled. 

### Restore access and virtual network configuration

If access is blocked, you can restore access to your service endpoints and your virtual network configuration using the portal or the Azure CLI.

> [!TIP]
> If you need a reminder of the names of the virtual network and subnet where your API Management instance was originally deployed, you can find information in the portal. In the left menu of your instance, select **Diagnose and solve problems** > **Availability and performance** > **VNet Verifier**. In **Time range**, select a period before the instance was migrated.

#### [Portal](#tab/portal)

1. In the portal, on the **Overview** page of the instance, select **Unblock my service**. This action isn't reversible.

    > [!WARNING]
    > After you unblock access to your service endpoints, they're publicly accessible from the internet. To protect your environment, make sure to reestablish your virtual network as soon as possible after unblocking access.

1. Redeploy your API Management instance in your virtual network. 

    For steps, see the guidance for deploying API Management in an [external](../articles/api-management/api-management-using-with-vnet.md) or [internal](../articles/api-management/api-management-using-with-internal-vnet.md) virtual network. We strongly recommend deploying the instance in a **new subnet** of the virtual network with settings compatible with the API Management `stv2` compute platform. 


#### [Azure CLI](#tab/cli)

Run the following Azure CLI commands to enable access to the API Management instance and restore configuration of the specified virtual network.

> [!NOTE]
> The following script is written for the bash shell. To run the script in PowerShell, prefix each variable name with the `$` character when setting the variables. Example: `$APIM_NAME=...`.

```azurecli
APIM_NAME={name of your API Management instance}
RG_NAME={name of your resource group}
SUBNET_NAME={name of the subnet where your API Management instance was originally deployed}
VNET_NAME={name of the virtual network where your API Management instance was originally deployed}
VNET_TYPE={external or internal}

# Get resource ID of subnet
SUBNET_ID=$(az network vnet subnet show \
    --resource-group $RG_NAME \
    --name $SUBNET_NAME \
    --vnet-name $VNET_NAME \
    --query id --output tsv)

# Get resource ID of API Management instance
APIM_RESOURCE_ID=$(az apim show \
    --resource-group $RG_NAME --name $APIM_NAME \
    --query id --output tsv)

# Enable access to service endpoints and restore virtual network configuration
az rest --method PATCH --uri "$APIM_RESOURCE_ID?api-version=2024-05-01" --body '{
    "properties": {
        "virtualNetworkType": "'$VNET_TYPE'",
        "virtualNetworkConfiguration": {
            "subnetResourceId": "'$SUBNET_ID'"
        },
        "customProperties": {
            "Microsoft.WindowsAzure.ApiManagement.Service.Disabled": "False"
        }
    }
}'
```
---    




