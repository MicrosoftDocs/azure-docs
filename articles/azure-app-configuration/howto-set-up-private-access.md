---
title: How to set up private access to an Azure App Configuration store
description: How to set up private access to an Azure App Configuration store in the Azure portal and in the CLI.
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: how-to 
ms.date: 07/12/2022
ms.custom: template-how-to
---

# Set up private access in Azure App Configuration

In this article, you'll learn how to set up private access for your Azure App Configuration store, by creating a private endpoint with Azure Private Link. Private endpoints allow access to your App Configuration store using a private IP address from a virtual network.

In the guide below, you will:
> [!div class="checklist"]
> * Set up a private endpoint
> * Select a virtual network and a subnet
> * Select a DNS record

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
* We assume you already have an App Configuration store. If you want to create one, go to [create an App Configuration store](quickstart-aspnet-core-app.md).

## Sign in to Azure

You'll need to sign in to Azure first to access the App Configuration service.

### [Portal](#tab/azure-portal)

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

### [Azure CLI](#tab/azure-cli)

Sign in to Azure using the `az login` command in the [Azure CLI](/cli/azure/install-azure-cli).

```azurecli-interactive
az login
```

This command will prompt your web browser to launch and load an Azure sign-in page. If the browser fails to open, use device code flow with `az login --use-device-code`. For more sign-in options, go to [sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

---

## Create a private endpoint

### [Portal](#tab/azure-portal)

1. In your App Configuration store, under **Settings**, select **Networking**.

1. Select the **Private  Access** tab and then **Create** to start setting up a new private endpoint.

   :::image type="content" source="./media/private-endpoint/create-private-endpoint.png" alt-text="Screenshot of the Azure portal, select create a private endpoint.":::

1. Fill out the form with the following information:

    | Parameter              | Description                                                                                                                                                                 | Example                 |
    |------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|
    | Subscription           | Select an Azure subscription. Your private endpoint must be in the same subscription as your virtual network. You'll select a virtual network later in this how-to guide.   | *MyAzureSubscription*   |
    | Resource group         | Select a resource group or create a new one.                                                                                                                                | *MyResourceGroup*       |
    | Name                   | Enter a name for the new private endpoint for your App Configuration store.                                                                                                 | *MyPrivateEndpoint*     |
    | Network Interface Name | This field is completed automatically. Optionally edit the name of the network interface.                                                                                   | *MyPrivateEndpoint-nic* |
    | Region                 | Select a region. Your private endpoint must be in the same region as your virtual network.                                                                                  | *Central US*            |

   :::image type="content" source="./media/private-endpoint/basics.png" alt-text="Screenshot of the Azure portal, create a private endpoint, basics tab.":::

1. Select **Next : Resource >**. Private Link offers options to create private endpoints for different types of Azure resources, such as SQL servers, Azure storage accounts or App Configuration stores. Review the information displayed to ensure that the correct App Configuration store is selected.

   1. The resource type **Microsoft.AppConfiguration/configurationStores** and the target subresource **configurationStores** indicate that you're creating an endpoint for an App Configuration store.

   1. The name of your configuration store is listed under **Resource**.

   :::image type="content" source="./media/private-endpoint/resource.png" alt-text="Screenshot of the Azure portal, create a private endpoint, resource tab.":::

1. Select **Next : Virtual Network >**.

   1. Select an existing **Virtual network** to deploy the private endpoint to. If you don't have a virtual network, [create a virtual network](../private-link/create-private-endpoint-portal.md#create-a-virtual-network-and-bastion-host).

   1. Select a **Subnet** from the list.

   1. Leave the box **Enable network policies for all private endpoints in this subnet** checked.

   1. Under **Private IP configuration**, select the option to allocate IP addresses dynamically. For more information, refer to [Using private endpoints for Azure App Configuration](concept-private-endpoint.md)

   1. Optionally, you can select or create an **Application security group**. Application security groups allow you to group virtual machines and define network security policies based on those groups.

    :::image type="content" source="./media/private-endpoint/virtual-network.png" alt-text="Screenshot of the Azure portal, create a private endpoint, virtual network tab.":::

1. Select **Next : DNS >** to choose a DNS record. If you don't want to make changes to the default settings, you can move forward to the next tab.

   1. For **Integrate with private DNS zone**, select **Yes** to integrate your private endpoint with a private DNS zone. You may also use your own DNS servers or create DNS records using the host files on your virtual machines. [Learn more](https://go.microsoft.com/fwlink/?linkid=2100445).

   1. A subscription and resource group for your private DNS zone are preselected. You can change them optionally.

    :::image type="content" source="./media/private-endpoint/dns.png" alt-text="Screenshot of the Azure portal, create a private endpoint, DNS tab.":::

1. Select **Next : Tags >** and optionally create tags. Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups.

    :::image type="content" source="./media/private-endpoint/tags.png" alt-text="Screenshot of the Azure portal, create a private endpoint, tags tab.":::

1. Select **Next : Review + create >** to review information about your App Configuration store, private endpoint, virtual network and DNS. You can also select **Download a template for automation** to reuse JSON data from this form later.

    :::image type="content" source="./media/private-endpoint/review.png" alt-text="Screenshot of the Azure portal, create a private endpoint, review tab.":::

1. Select **Create**.

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

1. Run the command [az appconfig show](/cli/azure/appconfig/#az-appconfig-show) to retrieve the properties of the App Configuration store, for which you want to set up private access. Replace the placeholder `name` with the name or the App Configuration store.

    ```azurecli-interactive
    az appconfig show --name <name>
    ```

    This command generates an output with information about your App Configuration store. Note down the *id* value. For instance: */subscriptions/123/resourceGroups/MyResourceGroup/providers/Microsoft.AppConfiguration/configurationStores/MyAppConfigStore*.

1. Run the command [az network private-endpoint create](/cli/azure/network/private-endpoint#az-network-private-endpoint-create) to create a private endpoint for your App Configuration store. Replace the placeholder texts `<resource-group>`, `<private-endpoint-name>`, `<vnet-name>`, `<private-connection-resource-id>`, `<connection-name>`, and `<location>` with your own information.

    ```azurecli-interactive
    az network private-endpoint create --resource-group <resource-group> --name <private-endpoint-name> --vnet-name <vnet-name> --subnet Default --private-connection-resource-id <private-connection-resource-id> --connection-name <connection-name> --location <location> --group-id configurationStores
    ```

    > [!div class="mx-tdBreakAll"]
    > | Placeholder                        | Description                                                                                                                      | Example                                                                                                                      |
    > |------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
    > | `<resource-group>`                 | Enter the name of an existing resource group for your private endpoint.                                                          | `MyResourceGroup`                                                                                                            |
    > | `<private-endpoint-name>`          | Enter a name for your new private endpoint.                                                                                      | `MyPrivateEndpoint`                                                                                                          |
    > | `<vnet-name>`                      | Enter the name of an existing vnet.                                                                                              | `Myvnet`                                                                                                                     |
    > | `<private-connection-resource-id>` | Enter your App Configuration store's private connection resource ID. This the ID you saved from the output of the previous step. | `/subscriptions/123/resourceGroups/MyResourceGroup/providers/Microsoft.AppConfiguration/configurationStores/MyAppConfigStore`|
    > | `<connection-name>`                | Enter a connection name.                                                                                                         |`MyConnection`                                                                                                                |
    > | `<location>`                       | Enter an Azure region. Your private endpoint must be in the same region as your virtual network.                                 |`centralus`                                                                                                                   |  

---

## Review private endpoints

### [Portal](#tab/azure-portal)

Go back to **Networking** > **Private Access** in your App Configuration store to access the private endpoints linked to your App Configuration store and check their connection state.

On this page, you can also manually approve or reject a connection, and remove existing endpoints. To do so, select the checkbox next to the endpoint you want to edit and select an action item from the top menu.

:::image type="content" source="./media/private-endpoint/review-endpoints.png" alt-text="Screenshot of the Azure portal, review existing endpoints.":::

Click on the name of the private endpoint to open the private endpoint resource and access more information and to edit the private endpoint.

### [Azure CLI](#tab/azure-cli)

Run the  [az appconfig show](/cli/azure/appconfig/#az-appconfig-show) command to review all private endpoints linked to your App Configuration store and check their connection state.

Replace the placeholder `name` with the name or the App Configuration store.

```azurecli-interactive
az appconfig show --name <name>
```

To get the details of a private endpoint, use the [az network private-endpoint show](/cli/azure/network/private-endpoint#az-network-private-endpoint-show) command. Replace the placeholder texts `resource-group` and `name` with the name of the private endpoint resource group, and the name of the private endpoint.

```azurecli-interactive
az network private-endpoint show --resource-group <resource-group> --name <name>
```

To delete a private endpoint, use the [az network private-endpoint delete](/cli/azure/network/private-endpoint#az-network-private-endpoint-delete) command. Replace the placeholder texts `resource-group` and `name` with the name of the private endpoint resource group, and the name of the private endpoint.

```azurecli-interactive
az network private-endpoint delete --resource-group <resource-group> --name <name>
```

## Next steps

> [!div class="nextstepaction"]
>[Using private endpoints for Azure App Configuration](concept-private-endpoint.md)

> [!div class="nextstepaction"]
>[Disable public access in Azure App Configuration](howto-disable-public-access.md)
