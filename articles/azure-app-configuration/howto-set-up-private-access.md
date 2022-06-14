---
title: How to set up private access to an Azure App Configuration store
description: How to set up private access to an Azure App Configuration store in the Azure portal and in the CLI.
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: how-to 
ms.date: 06/14/2022
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
* We assume you already have an App Configuration store. If you want to create one, [create an App Configuration store](quickstart-aspnet-core-app.md).

## Sign in to Azure

You will need to sign in to Azure first to access the App Configuration service.

### [Portal](#tab/azure-portal)

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

### [Azure CLI](#tab/azure-cli)

Sign in to Azure using the `az login` command in the [Azure CLI](/cli/azure/install-azure-cli).

```azurecli-interactive
az login
```

This command will prompt your web browser to launch and load an Azure sign-in page. If the browser fails to open, use device code flow with `az login --use-device-code`. For more sign in options, go to [sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

---

## Create a private endpoint

### [Portal](#tab/azure-portal)

1. In your App Configuration store, under **Settings**, select **Networking**.

1. Select the **Private  Access** tab to view existing endpoints or set up a new private endpoint.

1. Select **Create** and fill out the form with the following information.

| Parameter              | Description                                                                                                                                                                 | Example                  |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------|
| Subscription           | Select an Azure subscription. Your private endpoint must be in the same subscription as your virtual network. You will select a virtual network later in this how-to guide. | *MyAzureSubscription*    |
| Resource group         | Select a resource group or create a new one.                                                                                                                                | *AppConfigStore*         |
| Name                   | Enter a name for the new private endpoint for your App Configuration store.                                                                                                 | *MyPrivateEndpoint*      |
| Network Interface Name | This field is completed automatically. Optionally edit the name of the network interface.                                                                                   | *MyPrivateEndpoint-nin* |
| Region                 | Select a region. Your private endpoint must be in the same region as your virtual network.                                                                                  | *Central US*             |

   :::image type="content" source="./media/private-access-endpoint.png" alt-text="Screenshot of the Azure portal, create a private endpoint, basics tab.":::

1. Select **Next : Resource >**. Private Link offers options to create private endpoints for different Azure resources, such as an SQL server, an Azure storage account or an App Configuration store. Review the information displayed to ensure that the correct target sub-resource is selected. You should see your subscription and the name of your configuration store.

1. Select **Next : Virtual Network >** and select an existing **Virtual network** and a **Subnet** to deploy the private endpoint. Leave the box **Enable network policies for all private endpoints in this subnet** checked. If you don't have one, [create a virtual network](../private-link/create-private-endpoint-portal.md#create-a-virtual-network-and-bastion-host).

1. Optionally, you can select or create an application security group. Application security groups allow you to group virtual machines and define network security policies based on those groups.

1. Select **Next : DNS >** to choose a DNS record. For **Integrate with private DNS zone**, select **Yes** to integrate your private endpoint with a new DNS record. You may also use your own DNS servers or create DNS records using the host files on your virtual machines. [Learn more](https://go.microsoft.com/fwlink/?linkid=2100445). A subscription and resource group for your new private DNS zone are preselected. You can change them if you wish.

1. Select **Next : Tags >**. At this stage, you can create tags. Skip for now.

1. Select **Next : Review + create >** to review information about your App Configuration store, private endpoint, virtual network and DNS. At this stage you can also select Download a template for automation to reuse JSON data from this form later.

1. Select **Create**. You can remove or add more private endpoints by going back to **Networking** > **Private Access** in your App Configuration store.

### [Azure CLI](#tab/azure-cli)

1. Run the command below to retrieve the properties of the App Configuration store, for which you want to set up private access. Replace the placeholder `name` with the name or the App Config store.

    ```azurecli-interactive
    az appconfig show -n <name>
    ```

    This command generates an output with information about your App Configuration store. Note down the values listed for `id` and `name`.

1. Run the command below to create a private endpoint for your App Configuration store. Replace the placeholder texts `<resource-group>`, `<private-endpoint-name>`, `<vnet-name>`, `<private-connection-resource-id>`, `<connection-name>`, and `<location>` with your own information.

    ```azurecli-interactive
    az network private-endpoint create -g <resource-group> -n <private-endpoint-name> --vnet-name <vnet-name> --subnet Default --private-connection-resource-id <private-connection-resource-id> --connection-name <connection-name> -l <location> --group-id configurationStores
    ```

> [!div class="mx-tdBreakAll"]
> | Command                          | Placeholder                        | Example                                                                                                        | Description                                               |
> |----------------------------------|------------------------------------|----------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------|
> | -g                               | `<resource-group>`                 | AppConfigStore                                                                                                 | Create or select an existing resource group               |
> | -n                               | `<private-endpoint-name>`          | MyPrivateEndpoint                                                                                              | Enter a name for your new private endpoint.               |
> | --vnet-name                      | `<vnet-name>`                      | Myvnet                                                                                                         | Enter the name of an existing vnet.                       |
> | --private-connection-resource-id | `<private-connection-resource-id>` | /subscriptions/123/resourceGroups/AppConfigStore/providers/Microsoft.AppConfiguration/configurationStores/AppConfigStore | The value is the ID you saved from your previous command. |
> | --connection-name                | `<connection-name>`                | MyConnection                                                                                                   | Enter a connection name.                                  |
> | -l                               | `<location>`                       | centralus                                                                                                      | Enter an Azure region. Your private endpoint must be in the same region as your virtual network. |

## Next steps

> [!div class="nextstepaction"]
>[Azure App Configuration resiliency and disaster recovery](./concept-disaster-recovery.md)
