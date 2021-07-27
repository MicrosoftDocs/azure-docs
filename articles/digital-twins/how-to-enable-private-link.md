---
# Mandatory fields.
title: Enable private access with Private Link (preview)
titleSuffix: Azure Digital Twins
description: See how to enable private access for Azure Digital Twins solutions with Private Link.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 7/12/2021
ms.topic: how-to
ms.service: digital-twins
ms.custom: contperf-fy22q1

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Enable private access with Private Link (preview)

This article describes the different ways to [enable Private Link with a private endpoint for an Azure Digital Twins instance](concepts-security.md#private-network-access-with-azure-private-link-preview) (currently in preview). Configuring a private endpoint for your Azure Digital Twins instance enables you to secure your Azure Digital Twins instance and eliminate public exposure, as well as avoid data exfiltration from your [Azure Virtual Network (VNet)](../virtual-network/virtual-networks-overview.md).

Here are the steps that are covered in this article: 
1. Turn on Private Link and configure a private endpoint for an Azure Digital Twins instance.
1. View, edit, or delete a private endpoint from an instance.
1. Disable or enable public network access flags, to restrict API access to Private Link connections only.

## Prerequisites

Before you can set up a private endpoint, you'll need an [Azure Virtual Network (VNet)](../virtual-network/virtual-networks-overview.md) where the endpoint can be deployed. If you don't have a VNet already, you can follow one of the [Azure Virtual Network quickstarts](../virtual-network/quick-create-portal.md) to set this up.

## Add a private endpoint to Azure Digital Twins 

You can use either the [Azure portal](https://portal.azure.com) or the [Azure CLI](/cli/azure/what-is-azure-cli) to turn on Private Link with a private endpoint for an Azure Digital Twins instance. 

If you want to set up Private Link as part of the instance's initial setup, you'll need to use the Azure portal. If you want to enable Private Link on an instance after it's been created, you can use either the Azure portal or the Azure CLI. Any of these creation methods will give the same configuration options and the same end result for your instance.

Use the tabs in the sections below to select instructions for your preferred experience.

>[!TIP]
> You can also set up a Private Link endpoint through the Private Link service, instead of through your Azure Digital Twins instance. This also gives the same configuration options and the same end result.
>
> For more details about setting up Private Link resources, see Private Link documentation for the [Azure portal](../private-link/create-private-endpoint-portal.md), [Azure CLI](../private-link/create-private-endpoint-cli.md), [Azure Resource Manager](../private-link/create-private-endpoint-template.md), or [PowerShell](../private-link/create-private-endpoint-powershell.md).

### Add a private endpoint during instance creation

In this section, you'll create a private endpoint with Private Link as part of the initial setup of an Azure Digital Twins instance. This action can only be done in the Azure portal.

# [Portal](#tab/portal)

This section describes how to turn on Private Link while setting up an Azure Digital Twins instance in the Azure portal. 

The Private Link options are located in the **Networking** tab of instance setup.

1. Begin setting up an Azure Digital Twins instance in the Azure portal. For instructions, see [Set up an instance and authentication](how-to-set-up-instance-portal.md).
1. When you reach the **Networking** tab of instance setup, you can enable private endpoints by selecting the **Private endpoint** option for the **Connectivity method**.

    This will add a section called **Private endpoint connections** where you can configure the details of your private endpoint. Select the **+ Add** button to continue.
    
    :::image type="content" source="media/how-to-enable-private-link/create-instance-networking-1.png" alt-text="Screenshot of the Azure portal showing the Networking tab of a new Azure Digital Twins instance, highlighting how to create a private endpoint. The 'Add' button is highlighted." lightbox="media/how-to-enable-private-link/create-instance-networking-1.png":::

1. In the **Create private endpoint** page that opens, enter the details of a new private endpoint.

    :::image type="content" source="media/how-to-enable-private-link/create-private-endpoint-full.png" alt-text="Screenshot of the Azure portal showing the Create private endpoint page. It contains the fields described below.":::

    1. Fill in selections for your **Subscription** and **Resource group**. Set the **Location** to the same location as the VNet you'll be using. Choose a **Name** for the endpoint, and for **Target sub-resources** select *API*.

    1. Next, select the **Virtual network** and **Subnet** you want to use to deploy the endpoint.

    1. Lastly, select whether to **Integrate with private DNS zone**. You can use the default of **Yes** or, for help with this option, you can follow the link in the portal to [learn more about private DNS integration](../private-link/private-endpoint-overview.md#dns-configuration).

    1. After filling out the configuration options, select **OK** to finish.

1. This will return you to the **Networking** tab of the Azure Digital Twins instance setup. Verify that your new endpoint is visible under **Private endpoint connections**.
    
    :::image type="content" source="media/how-to-enable-private-link/create-instance-networking-2.png" alt-text="Screenshot of the Azure portal showing the Networking tab of an Azure Digital Twins with a newly created private endpoint." lightbox="media/how-to-enable-private-link/create-instance-networking-2.png":::

1. Use the bottom navigation buttons to continue with the rest of instance setup.

# [CLI](#tab/cli)

You cannot add a Private Link endpoint during instance creation using the Azure CLI. 

You can switch to the Azure portal to add the endpoint during instance creation, or continue to the next section to use the CLI to add a private endpoint after the instance has been created.

--- 

### Add a private endpoint to an existing instance

In this section, you'll enable Private Link with a private endpoint for an Azure Digital Twins instance that already exists.

# [Portal](#tab/portal)

1. First, navigate to the [Azure portal](https://portal.azure.com) in a browser. Bring up your Azure Digital Twins instance by searching for its name in the portal search bar.

1. Select **Networking (preview)** in the left-hand menu.

1. Switch to the **Private endpoint connections** tab.

1. Select **+ Private endpoint** to open the **Create a private endpoint** setup.

    :::image type="content" source="media/how-to-enable-private-link/add-endpoint-digital-twins.png" alt-text="Screenshot of the Azure portal showing the Networking page for an existing Azure Digital Twins instance, highlighting how to create private endpoints." lightbox="media/how-to-enable-private-link/add-endpoint-digital-twins.png":::

1. In the **Basics** tab, enter or select the **Subscription** and **Resource group** of your project, and a **Name** and **Region** for your endpoint. The region needs to be the same as the region for the VNet you're using.

    :::image type="content" source="media/how-to-enable-private-link/create-private-endpoint-1.png" alt-text="Screenshot of the Azure portal showing the first (Basics) tab of the Create a private endpoint dialog. It contains the fields described above.":::

    When you're finished, select the **Next : Resource >** button to go to the next tab.

1. In the **Resource** tab, enter or select this information: 
    * **Connection method**: Select **Connect to an Azure resource in my directory** to search for your Azure Digital Twins instance.
    * **Subscription**: Enter your subscription.
    * **Resource type**: Select **Microsoft.DigitalTwins/digitalTwinsInstances**
    * **Resource**: Select the name of your Azure Digital Twins instance.
    * **Target sub-resource**: Select **API**.

    :::image type="content" source="media/how-to-enable-private-link/create-private-endpoint-2.png" alt-text="Screenshot of the Azure portal showing the second (Resource) tab of the Create a private endpoint dialog. It contains the fields described above.":::

    When you're finished, select the **Next : Configuration >** button to go to the next tab.    

1. In the **Configuration** tab, enter or select this information:
    * **Virtual network**: Select your virtual network.
    * **Subnet**: Choose a subnet from your virtual network.
    * **Integrate with private DNS zone**: Select whether to **Integrate with private DNS zone**. You can use the default of **Yes** or, for help with this option, you can follow the link in the portal to [learn more about private DNS integration](../private-link/private-endpoint-overview.md#dns-configuration).
    If you select **Yes**, you can leave the default configuration information.

    :::image type="content" source="media/how-to-enable-private-link/create-private-endpoint-3.png" alt-text="Screenshot of the Azure portal showing the third (Configuration) tab of the Create a private endpoint dialog. It contains the fields described above.":::

    When you're finished, you can select the **Review + create** button to finish setup. 

1. In the **Review + create** tab, review your selections and select the **Create** button. 

When the endpoint is finished deploying, it should show up in the private endpoint connections for your Azure Digital Twins instance.

# [CLI](#tab/cli)

To create a private endpoint and link it to an Azure Digital Twins instance using the Azure CLI, use the [az network private-endpoint create](/cli/azure/network/private-endpoint?view=azure-cli-latest&preserve-view=true#az_network_private_endpoint_create) command. Identify the Azure Digital Twins instance by using its fully qualified ID in the `--private-connection-resource-id` parameter.

Here is an example that uses the command to create a private endpoint, with only the required parameters.

```azurecli-interactive
az network private-endpoint create --connection-name <private-link-service-connection> --name <name-for-private-endpoint> --resource-group <resource-group> --subnet <subnet-ID> --private-connection-resource-id "/subscriptions/<subscription-ID>/resourceGroups/<resource-group>/providers/Microsoft.DigitalTwins/digitalTwinsInstances/<Azure-Digital-Twins-instance-name>" 
```

For a full list of required and optional parameters, as well as more private endpoint creation examples, see the [az network private-endpoint create reference documentation](/cli/azure/network/private-endpoint?view=azure-cli-latest&preserve-view=true#az_network_private_endpoint_create).

--- 

## Manage private endpoint connections

In this section, you'll see how to view, edit, and delete a private endpoint after it's been created.

# [Portal](#tab/portal)

Once a private endpoint has been created for your Azure Digital Twins instance, you can view it in the **Networking (preview)** tab for your Azure Digital Twins instance. This page will show all the private endpoint connections associated with the instance.

:::image type="content" source="media/how-to-enable-private-link/view-endpoint-digital-twins.png" alt-text="Screenshot of the Azure portal showing the Networking page for an existing Azure Digital Twins instance with one private endpoint." lightbox="media/how-to-enable-private-link/view-endpoint-digital-twins.png":::


Select the endpoint to view its information in detail, make changes to its configuration settings, or delete the connection.

>[!TIP]
> The endpoint can also be viewed from the Private Link Center in the Azure portal.

# [CLI](#tab/cli)

Once a private endpoint has been created for your Azure Digital Twins instance, you can use the [az dt network private-endpoint connection](/cli/azure/dt/network/private-endpoint/connection?view=azure-cli-latest&preserve-view=true) commands to continue managing private endpoint **connections** with respect to the instance. Operations include:
* Show a private endpoint connection
* Set the state of the private endpoint connection
* Delete the private endpoint connection
* List all the private endpoint connections for an instance

For more information and examples, see the [az dt network private-endpoint reference documentation](/cli/azure/dt/network/private-endpoint?view=azure-cli-latest&preserve-view=true).

### Get additional Private Link information

You can get additional information about the Private Link status of your instance with the [az dt network private-link](/cli/azure/dt/network/private-link?view=azure-cli-latest&preserve-view=true) commands. Operations include:
* List private links associated with an Azure Digital Twins instance
* Show a private link associated with the instance

For more information and examples, see the [az dt network private-link reference documentation](/cli/azure/dt/network/private-link?view=azure-cli-latest&preserve-view=true).

--- 

## Disable / enable public network access flags

You can configure your Azure Digital Twins instance to deny all public connections and allow only connections through private endpoints to enhance the network security. This action is done with a **public network access flag**. 

This policy allows you to restrict API access to Private Link connections only. When the public network access flag is set to *disabled*, all REST API calls to the Azure Digital Twins instance data plane from the public cloud will return `403, Unauthorized`. Alternatively, when the policy is set to *disabled* and a request is made through a private endpoint, the API call will succeed.

You can update the value of the network flag using the [Azure portal](https://portal.azure.com), [Azure CLI](/cli/azure/) or [ARMClient command tool](https://github.com/projectkudu/ARMClient).

# [Portal](#tab/portal-2)

To disable or enable public network access in the [Azure portal](https://portal.azure.com), open the portal and navigate to your Azure Digital Twins instance.

1. Select **Networking (preview)** in the left-hand menu.

1. In the **Public access** tab, set **Allow public network access to** either **Disabled** or **All networks**.

    :::row:::
        :::column:::
            :::image type="content" source="media/how-to-enable-private-link/network-flag-portal.png" alt-text="Screenshot of the Azure portal showing the Networking page for an Azure Digital Twins instance, highlighting how to toggle public access." lightbox="media/how-to-enable-private-link/network-flag-portal.png":::
        :::column-end:::
        :::column:::
        :::column-end:::
    :::row-end:::

    Select **Save**.

# [CLI](#tab/cli-2)

In the Azure CLI, you can disable or enable public network access by adding a `--public-network-access` parameter to the `az dt create` command. While this command can also be used to create a new instance, you can use it to edit the properties of an existing instance by providing it the name of an instance that already exists. (For more information about this command, see its [reference documentation](/cli/azure/dt?view=azure-cli-latest&preserve-view=true#az_dt_create) or the [general instructions for setting up an Azure Digital Twins instance](how-to-set-up-instance-cli.md#create-the-azure-digital-twins-instance)).

To **disable** public network access for an Azure Digital Twins instance, use the `--public-network-access` parameter like this:

```azurecli-interactive
az dt create --dt-name <name-of-existing-instance> --resource-group <resource-group> --public-network-access Disabled
```

To **enable** public network access on an instance where it's currently disabled, use the following similar command:

```azurecli-interactive
az dt create --dt-name <name-of-existing-instance> --resource-group <resource-group> --public-network-access Enabled
```

# [ARMClient](#tab/arm-client-2)

With the [ARMClient command tool](https://github.com/projectkudu/ARMClient), public network access is enabled or disabled using the commands below. 

To **disable** public network access:
  
```cmd/sh
armclient login 

armclient PATCH /subscriptions/<your-Azure-subscription-ID>/resourceGroups/<your-resource-group>/providers/Microsoft.DigitalTwins/digitalTwinsInstances/<your-Azure-Digital-Twins-instance>?api-version=2020-12-01 "{ 'properties': { 'publicNetworkAccess': 'disabled' } }"  
```

To **enable** public network access:  
  
```cmd/sh
armclient login 

armclient PATCH /subscriptions/<your-Azure-subscription-ID>/resourceGroups/<your-resource-group>/providers/Microsoft.DigitalTwins/digitalTwinsInstances/<your-Azure-Digital-Twins-instance>?api-version=2020-12-01 "{ 'properties': { 'publicNetworkAccess': 'enabled' } }"  
``` 

---


## Next steps

Learn more about Private Link for Azure: 
* [What is Azure Private Link service?](../private-link/private-link-service-overview.md)