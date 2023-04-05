---
title: Configure private endpoints for Device Update for IoT Hub accounts
description: This article describes how to configure private endpoints for Device Update for IoT Hub account. 
author: darkoa-msft
ms.author: darkoa
ms.date: 07/06/2022
ms.topic: how-to
ms.service: iot-hub-device-update
ms.custom: devx-track-azurecli
---

# Configure private endpoints for Device Update for IoT Hub accounts

You can use [private endpoints](../private-link/private-endpoint-overview.md) to allow traffic directly from your virtual network to your account securely over a [private link](../private-link/private-link-overview.md) without going through the public internet. The private endpoint uses an IP address from the VNet address space for your account. For more conceptual information, see [Network security](network-security.md).

This article describes how to configure private endpoints for accounts.

You can either use the Azure portal or the Azure CLI to create a private endpoint for an account.

## Prerequisites

# [Azure portal](#tab/portal)

No prerequisites for the Azure portal.

# [Azure CLI](#tab/cli)

An Azure CLI environment:

* Use the Bash environment in [Azure Cloud Shell](../cloud-shell/quickstart.md).

  [![Launch Cloud Shell in a new window](../../includes/media/cloud-shell-try-it/hdi-launch-cloud-shell.png)](https://shell.azure.com)

* Or, if you prefer to run CLI reference commands locally, [install the Azure CLI](/cli/azure/install-azure-cli)

  * Sign in to the Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.

  * Run [az version](/cli/azure/reference-index#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index#az-upgrade).

  * When prompted, install Azure CLI extensions on first use. The commands in this article use the **azure-iot** extension. Run `az extension update --name azure-iot` to make sure you're using the latest version of the extension.

---

## Configure private endpoints from the Device Update account

In the Azure portal, you can create a new private endpoint from within the Device Update account. These private endpoint connections are auto-approved and don't need the extra steps of being reviewed and approved described in the rest of this article.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your account or domain.

1. Switch to the **Networking** tab of your account page. If you want to limit the access to only the private endpoint, disable the **Public Network Access**.

1. Switch to the **Private Access** tab, and then select **+ Add** on the toolbar.

    :::image type="content" source="./media/configure-private-endpoints/device-update-networking-tab.png" alt-text="Screenshot that shows the Device Update Networking tab.":::

1. On the **Basics** page, provide the following information for your private endpoint:

   * **Subscription**: The Azure subscription in which you want to create the private endpoint.
   * **Resource group**: An existing or new resource group for the private endpoint.
   * **Name**: A name for the endpoint. This value is used to auto-generate the **Network interface name**.
   * **Region**: An Azure region for the endpoint. Your private endpoint must be in the same region as your virtual network, but can in a different region from the Device Update account.

     :::image type="content" source="./media/configure-private-endpoints/device-update-pec-create-01.png" alt-text="Screenshot showing the Basics page of the Create a private endpoint wizard.":::

1. The **Resource** page is auto-populated

      :::image type="content" source="./media/configure-private-endpoints/device-update-pec-create-02.png" alt-text="Screenshot showing the Resource page of the Create a private endpoint wizard.":::

1. On the **Virtual Network** page, select the subnet and virtual network where you want to deploy the private endpoint.

   * **Virtual network**: Only virtual networks in the currently selected subscription and location are listed in the drop-down list.
   * **Subnet**: Select a **subnet** in the virtual network you selected.

     :::image type="content" source="./media/configure-private-endpoints/device-update-pec-create-03.png" alt-text="Screenshot showing the Virtual Network page of the Creating a private endpoint wizard.":::

1. On the **DNS** page, use the pre-populated values unless you're using your own custom DNS.

   :::image type="content" source="./media/configure-private-endpoints/device-update-pec-create-04.png" alt-text="Screenshot showing the DNS page of the Creating a private endpoint wizard.":::

1. On the **Tags** page, create any tags (names and values) that you want to associate with the private endpoint resource.

1. On the **Review + create** page, review all the settings and select **Create** to create the private endpoint.

## Configure private endpoints from the Private Link Center

If you don't have access to the Device Update account, you can create private endpoints from the Private Link Center. In the case that the user creating the connection doesn't have the power to also approve it, the connection will be created in the pending state.  

You can use either the Azure portal or the Azure CLI to create private endpoints.

# [Azure portal](#tab/portal)

1. From the Azure portal, navigate to **Private Link Center** > **Private Endpoints** and select **+Create**.

    :::image type="content" source="./media/configure-private-endpoints/private-link-center.png" alt-text="Screenshot showing the Private Endpoints tab in Private Link Center.":::

1. On the **Basics** page, provide the following information for your private endpoint:

   * **Subscription**: The Azure subscription in which you want to create the private endpoint.
   * **Resource group**: An existing or new resource group for the private endpoint.
   * **Name**: A name for the endpoint. This value is used to auto-generate the **Network interface name**.
   * **Region**: An Azure region for the endpoint. Your private endpoint must be in the same region as your virtual network, but can in a different region from the Device Update account.

1. Fill all the required fields on the **Resource** tab

   * **Connection method**: Select **Connect to an Azure resource by resource ID or alias**.
   * **Resource ID or alias**: Enter the Resource ID of the Device Update account. You can retrieve the resource ID of a Device Update account from the Azure portal by selecting **JSON View** on the **Overview** page. Or, you can retrieve it by using the [az iot du account show](/cli/azure/iot/du/account#az-iot-du-account-show) command and querying for the ID value: `az iot du account show -n <account_name> --query id`.
   * **Target sub-resource**: Value must be **DeviceUpdate**

   :::image type="content" source="./media/configure-private-endpoints/private-endpoint-manual-create.png" alt-text="Screenshot showing the Resource page of the Create a private endpoint tab in Private Link Center.":::

1. On the **Virtual Network** page, select the subnet and virtual network where you want to deploy the private endpoint.

   * **Virtual network**: Only virtual networks in the currently selected subscription and location are listed in the drop-down list.
   * **Subnet**: Select a **subnet** in the virtual network you selected.

1. On the **DNS** page, use the pre-populated values unless you're using your own custom DNS.

1. On the **Tags** page, create any tags (names and values) that you want to associate with the private endpoint resource.

1. On the **Review + create** page, review all the settings and select **Create** to create the private endpoint.

# [Azure CLI](#tab/cli)

Use the [az network private-endpoint create](/cli/azure/network/private-endpoint#az-network-private-endpoint-create) command to create a private endpoint.

Replace the following placeholders with your own information:

* **RESOURCE_GROUP_NAME**: Name of the resource group.
* **PRIVATE_ENDPOINT_NAME**: Name of the private endpoint.
* **PRIVATE_LINK_CONNECTION_NAME**: Name of the private link service connection.
* **VIRTUAL_NETWORK_NAME**: Name of an existing virtual network associated with the subnet.
* **SUBNET_NAME**: Name or ID of an existing subnet. If you use a subnet name, then you also need to include the virtual network name. If you use a subnet ID, you can omit the `--vnet-name` parameter.
* **DEVICE_UPDATE_RESOURCE_ID**: You can retrieve the resource ID of a Device Update account from the Azure portal by selecting **JSON View** on the **Overview** page. Or, you can retrieve it by using the [az iot du account show](/cli/azure/iot/du/account#az-iot-du-account-show) command and querying for the ID value: `az iot du account show -n <account_name> --query id`.
* **LOCATION**: Name of the Azure region. Your private endpoint must be in the same region as your virtual network, but can in a different region from the Device Update account.

```azurecli-interactive
az network private-endpoint create \
    --resource-group <RESOURCE_GROUP_NAME> \
    --name <PRIVATE_ENDPOINT_NAME> \
    --connection-name <PRIVATE_LINK_CONNECTION_NAME> \
    --vnet-name <VIRTUAL_NETWORK_NAME> \
    --subnet <SUBNET_NAME> \
    --private-connection-resource-id "<DEVICE_UPDATE_RESOURCE_ID> \
    --location <LOCATION> \
    --group-id DeviceUpdate
    --request-message "Optional message"
    --manual-request
```

You can delete a private endpoint with the [az network private-endpoint delete](/cli/azure/network/private-endpoint#az-network-private-endpoint-delete) command.

```azurecli-interactive
az network private-endpoint delete --resource-group <RESOURCE_GROUP_NAME> --name <PRIVATE_ENDPOINT_NAME>
```

---

## Manage private link connections

When you create a private endpoint awaiting the manual approval, the connection must be approved before it can be used. If the resource for which you're creating a private endpoint is in your directory, you can approve the connection request provided you have sufficient permissions. If you're connecting to an Azure resource in another directory, you must wait for the owner of that resource to approve your connection request.

There are four provisioning states:

| Service action | Service consumer private endpoint state | Description |
|--|--|--|
| None | Pending | Connection is created manually and is pending approval from the private Link resource owner. |
| Approve | Approved | Connection was automatically or manually approved and is ready to be used. |
| Reject | Rejected | Connection was rejected by the private link resource owner. |
| Remove | Disconnected | Connection was removed by the private link resource owner, the private endpoint becomes informative and should be deleted for cleanup. |

# [Azure portal](#tab/portal)

### Review a pending connection from the Device Update account

1. From the [Azure portal](https://portal.azure.com), navigate to the Device Update account that you want to manage.

2. Select the **Networking** tab.

3. If there are any connections that are pending, you'll see a connection listed with **Pending** in the provisioning state.

    :::image type="content" source="./media/configure-private-endpoints/device-update-approval.png" alt-text="Screenshot showing a Pending Connection in the Networking tab in Device Update account.":::

4. Use the checkbox to select the pending connection, then select either **Approve** or **Reject**.

### Review a pending connection from the Private Link Center

1. From the Azure portal, navigate to **Private Link Center** > **Pending connections**.

2. Use the checkbox to select the pending connection, then select either **Approve** or **Reject**.

    :::image type="content" source="./media/configure-private-endpoints/private-link-approval.png" alt-text="Screenshot showing the Pending Connections tab in Private Link Center.":::

# [Azure CLI](#tab/cli)

Use the [az iot du account private-endpoint-connection set](/cli/azure/iot/du/account/private-endpoint-connection#az-iot-du-account-private-endpoint-connection-set) command to manage private endpoint connection.

Replace the following placeholders with your own information:

* **ACCOUNT_NAME**: Name of the Device Update account.
* **PRIVATE_LINK_CONNECTION_NAME**: Name of the private link service connection.
* **STATUS**: Either `Approved` or `Rejected`.

```azurecli-interactive
az iot du account private-endpoint-connection set \
    --name <ACCOUNT_NAME> \
    --connection-name <PRIVATE_LINK_CONNECTION_NAME> \
    --status <STATUS> \
    --desc 'Optional description'
```

---

## Next steps

[Learn about network security concepts](network-security.md).
