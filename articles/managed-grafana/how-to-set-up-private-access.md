---
title: How to set up private access in Azure Managed Grafana
description: How to disable public access to your Azure Managed Grafana instance and enable private endpoints.
author: maud-lv
ms.author: malev
ms.service: managed-grafana
ms.topic: how-to 
ms.date: 11/02/2022
ms.custom: template-how-to
---

# Set up private access in Azure Managed Grafana

In this guide, you'll learn how to disable public access to your Azure Managed Grafana instance and set up private endpoints. Setting up private endpoints in Azure Managed Grafana increases security by limiting incoming traffic only to specific IP addresses.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An existing Managed Grafana workspace. [Create one if you haven't already](quickstart-managed-grafana-portal.md).

## Disable public access to a workspace

Public access is enabled by default when you create an Azure Grafana workspace. Disabling public access prevents all traffic from accessing the resource unless you go through a private endpoint.

To disable access to the Azure Managed Grafana instance from public network, follow the process below.

### [Portal](#tab/azure-portal)

1. Navigate to your Azure Managed Grafana workspace in the Azure portal.
1. In the left-hand menu, under **Settings**, select **Networking**.
1. Under **Public Access**, select **Disabled** to disable public access to the Azure Managed Grafana instance and only allow access through private endpoints. If you already had public access disabled and instead wanted to enable public access to your configuration store, you would select **Enabled**.
1. Select **Save**.

   :::image type="content" source="media/private-endpoints/disable-public-access.png" alt-text="Screenshot of the Azure portal disabling public access.":::

### [Azure CLI](#tab/azure-cli)

In the CLI, run the following code:

```azurecli-interactive
az grafana dashboard update --name <name-of-the-grafana-workspace> --enable-public-network false
```

---

## Create a private endpoint

Once you have disabled public access, set up a [private endpoint](../private-link/private-endpoint-overview.md) with Azure Private Link. Private endpoints allow access to your Azure Managed Grafana instance using a private IP address from a virtual network.

### [Portal](#tab/azure-portal)

1. Select the **Private  Access** tab and then **Create** to start setting up a new private endpoint.

1. Fill out the form with the following information:

| Parameter              | Description                                                                                                                                                                 | Example                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|
| Subscription           | Select an Azure subscription. Your private endpoint must be in the same subscription as your virtual network. You'll select a virtual network later in this how-to guide.   | *MyAzureSubscription*   |
| Resource group         | Select a resource group or create a new one.                                                                                                                                | *MyResourceGroup*       |
| Name                   | Enter a name for the new private endpoint for your Azure Managed Grafana instance.                                                                                          | *MyPrivateEndpoint*     |
| Network Interface Name | This field is completed automatically. Optionally edit the name of the network interface.                                                                                   | *MyPrivateEndpoint-nic* |
| Region                 | Select a region. Your private endpoint must be in the same region as your virtual network.                                                                                  | *Central US*            |

1. Select **Next : Resource >**. Private Link offers options to create private endpoints for different types of Azure resources. The current Azure Managed Grafana instance is automatically filled in the **Resource** field.

   1. The resource type **Microsoft.Dashboard/grafana** and the target sub-resource **grafana** indicate that you're creating an endpoint for an Azure Managed Grafana workspace.

   1. The name of your instance is listed under **Resource**.

1. Select **Next : Virtual Network >**.

   1. Select an existing **Virtual network** to deploy the private endpoint to. If you don't have a virtual network, [create a virtual network](../private-link/create-private-endpoint-portal.md#create-a-virtual-network-and-bastion-host).

   1. Select a **Subnet** from the list.

   1. Leave the box **Enable network policies for all private endpoints in this subnet** checked.

   1. Under **Private IP configuration**, select the option to allocate IP addresses dynamically. For more information, refer to [Private IP addresses](../virtual-network/ip-services/private-ip-addresses.md#allocation-method).

   1. Optionally, you can select or create an **Application security group**. Application security groups allow you to group virtual machines and define network security policies based on those groups.

1. Select **Next : DNS >** to configure a DNS record. If you don't want to make changes to the default settings, you can move forward to the next tab.

   1. For **Integrate with private DNS zone**, select **Yes** to integrate your private endpoint with a private DNS zone. You may also use your own DNS servers or create DNS records using the host files on your virtual machines.

   1. A subscription and resource group for your private DNS zone are preselected. You can change them optionally.

    To learn more about DNS configuration, go to [Name resolution for resources in Azure virtual networks](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) and [DNS configuration for Private Endpoints](../private-link/private-endpoint-overview.md#dns-configuration).

1. Select **Next : Tags >** and optionally create tags. Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups.

1. Select **Next : Review + create >** to review information about your App Configuration store, private endpoint, virtual network and DNS. You can also select **Download a template for automation** to reuse JSON data from this form later.

1. Select **Create**.

Once deployment is complete, you'll get a notification that your endpoint has been created. If it's auto-approved, you can start accessing your instance privately. Otherwise, you will have to wait for approval.

### [Azure CLI](#tab/azure-cli)

1. To set up your private endpoint, you need a virtual network. If you don't have one yet, create a virtual network with [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create). Replace the placeholder texts `<vnet-name>`, `<rg-name>`, and `<subnet-name>` with a name for your new virtual network, a resource group name, and a subnet name.

    ```azurecli-interactive
    az network vnet create --name <vnet-name> --resource-group <rg-name> --subnet-name <subnet-name> --location <vnet-location>
    ```

    > [!div class="mx-tdBreakAll"]
    > | Placeholder      | Description                                                                                                                                           | Example           |
    > |------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
    > | `<vnet-name>`    | Enter a name for your new virtual network. A virtual network enables Azure resources to communicate privately with each other, and with the internet. | `MyVNet`          |
    > | `<rg-name>`      | Enter the name of an existing resource group for your virtual network.                                                                                | `MyResourceGroup` |
    > | `<subnet-name>`  | Enter a name for your new subnet. A subnet is a network inside a network. This is where the private IP address is assigned.                           | `MySubnet`        |
    > | `<vnet-location>`| Enter an Azure region. Your virtual network must be in the same region as your private endpoint.                                                      | `centralus`       |

1. Run the command [az grafana show](/cli/azure/grafana#az-grafana-show) to retrieve the properties of the Azure Managed Grafana workspace, for which you want to set up private access. Replace the placeholder `name` with the name or your workspace.

    ```azurecli-interactive
    az grafana dashboard show --name <name>
    ```

    This command generates an output with information about your Azure Managed Grafana workspace store. Note down the *id* value. For instance: */subscriptions/123/resourceGroups/MyResourceGroup/providers/Microsoft.AppConfiguration/configurationStores/MyAppConfigStore*.

1. Run the command [az network private-endpoint create](/cli/azure/network/private-endpoint#az-network-private-endpoint-create) to create a private endpoint for your Azure Managed Grafana instance. Replace the placeholder texts `<resource-group>`, `<private-endpoint-name>`, `<vnet-name>`, `<private-connection-resource-id>`, `<connection-name>`, and `<location>` with your own information.

    ```azurecli-interactive
    az network private-endpoint create --resource-group <resource-group> --name <private-endpoint-name> --vnet-name <vnet-name> --subnet Default --private-connection-resource-id <private-connection-resource-id> --connection-name <connection-name> --location <location> --group-id configurationStores
    ```

    > [!div class="mx-tdBreakAll"]
    > | Placeholder                        | Description                                                                                                                      | Example                                                                                                        |
    > |------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
    > | `<resource-group>`                 | Enter the name of an existing resource group for your private endpoint.                                                          | `MyResourceGroup`                                                                                              |
    > | `<private-endpoint-name>`          | Enter a name for your new private endpoint.                                                                                      | `MyPrivateEndpoint`                                                                                            |
    > | `<vnet-name>`                      | Enter the name of an existing vnet.                                                                                              | `Myvnet`                                                                                                       |
    > | `<private-connection-resource-id>` | Enter your Azure Managed Grafana workspace's private connection resource ID. This the ID you saved from the output of the previous step. | `/subscriptions/123/resourceGroups/MyResourceGroup/providers/Microsoft.Dashboard/grafana/MyAppGrafanaWorkspace`|
    > | `<connection-name>`                | Enter a connection name.                                                                                                         |`MyConnection`                                                                                                  |
    > | `<location>`                       | Enter an Azure region. Your private endpoint must be in the same region as your virtual network.                                 |`centralus`                                                                                                     |  

---

## Manage private link connection

### [Portal](#tab/azure-portal)

Go to **Networking** > **Private Access** in your Azure Managed Grafana workspace to access the private endpoints linked to your instance.

1. Check the connection state of your private link connection. When you create a private endpoint, the connection must be approved. If the resource for which you're creating a private endpoint is in your directory and you have [sufficient permissions](../private-link/rbac-permissions.md), the connection request will be auto-approved. Otherwise, you must wait for the owner of that resource to approve your connection request. For more information about the connection approval models, go to [Manage Azure Private Endpoints](../private-link/manage-private-endpoint.md#private-endpoint-connections).

1. To manually approve, reject or remove a connection, select the checkbox next to the endpoint you want to edit and select an action item from the top menu.

1. Select the name of the private endpoint to open the private endpoint resource and access more information or to edit the private endpoint.

### [Azure CLI](#tab/azure-cli)

#### Review private endpoint connection details

Run the  [az network private-endpoint-connection list](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-list) command to review all private endpoint connections linked to your Azure Managed Grafana workspace and check their connection state. Replace the placeholder texts `resource-group` and `azure-managed-grafana-workspace` with the name of the resource group and the name of the workspace.

```azurecli-interactive
az network private-endpoint-connection list --resource-group <resource-group> --name <azure-managed-grafana-workspace> --type Microsoft.Dashboard/grafana
```

Optionally, to get the details of a specific private endpoint, use the [az network private-endpoint-connection show](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-show) command. Replace the placeholder texts `resource-group` and `azure-managed-grafana-workspace` with the name of the resource group and the name of the store.

```azurecli-interactive
az network private-endpoint-connection show --resource-group <resource-group> --name <azure-managed-grafana-workspace> --type Microsoft.Dashboard/grafana
```

#### Get connection approval

When you create a private endpoint, the connection must be approved. If the resource for which you're creating a private endpoint is in your directory and you have [sufficient permissions](../private-link/rbac-permissions.md), the connection request will be auto-approved. Otherwise, you must wait for the owner of that resource to approve your connection request.

To approve a private endpoint connection, use the [az network private-endpoint-connection approve](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-approve) command. Replace the placeholder texts `resource-group`, `private-endpoint`, and `<azure-managed-grafana-workspace>` with the name of the resource group, the name of the private endpoint and the name of the store.

```azurecli-interactive
az network private-endpoint-connection approve --resource-group <resource-group> --name <private-endpoint> --type Microsoft.Dashboard/grafana --resource-name <azure-managed-grafana-workspace>
```

For more information about the connection approval models, go to [Manage Azure Private Endpoints](../private-link/manage-private-endpoint.md#private-endpoint-connections).

#### Delete a private endpoint connection

To delete a private endpoint connection, use the [az network private-endpoint-connection delete](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection-delete) command. Replace the placeholder texts `resource-group` and `private-endpoint` with the name of the resource group and the name of the private endpoint.

```azurecli-interactive
az network private-endpoint-connection delete --resource-group <resource-group> --name <private-endpoint>
```

For more CLI commands, go to [az network private-endpoint-connection](/cli/azure/network/private-endpoint-connection#az-network-private-endpoint-connection)

---

If you have issues with a private endpoint, check the following guide: [Troubleshoot Azure Private Endpoint connectivity problems](../private-link/troubleshoot-private-endpoint-connectivity.md).

## Next steps

> [!div class="nextstepaction"]
> [Share an Azure Managed Grafana instance](./how-to-share-grafana-workspace.md)