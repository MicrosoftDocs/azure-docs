---
title: Configure private endpoints for Device Update for IoT Hub accounts
description: This article describes how to configure private endpoints for Device Update for IoT Hub account. 
author: darkoa-msft
ms.author: darkoa
ms.date: 06/26/2022
ms.topic: how-to
ms.service: iot-hub-device-update
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Configure private endpoints for Device Update for IoT Hub accounts
You can use [private endpoints](../private-link/private-endpoint-overview.md) to allow traffic directly from your virtual network to your account securely over a [private link](../private-link/private-link-overview.md) without going through the public internet. The private endpoint uses an IP address from the VNet address space for your account. For more conceptual information, see [Network security](network-security.md).

This article describes how to configure private endpoints for accounts.

## Use Azure portal 
This section shows you how to use the Azure portal to create a private endpoint for an account.

### Auto-approved Private Endpoints

A connection can be auto-approved only if the user creating a connection also has access to the Device Update account.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your account or domain.
2. Switch to the **Networking** tab of your account page. If you want to limit the access to only the private endpoint, disable the **Public Network Access**.
    :::image type="content" source="./media/configure-private-endpoints/device-update-networking-tab.png" alt-text="Screenshot that shows the Device Update Networking tab.":::
3. Switch to the **Private Access** tab, and then select **+ Add** on the toolbar.
4. On the **Basics** page, follow these steps: 
    1. Select an **Azure subscription** in which you want to create the private endpoint. 
    2. Select an **Azure resource group** for the private endpoint. 
    3. Enter a **name** for the endpoint (this will auto-generate NIC name). 
    4. Select the **region** for the endpoint. Your private endpoint must be in the same region as your virtual network, but can in a different region from the private link resource (in this example, a Device Update account). 
        :::image type="content" source="./media/configure-private-endpoints/device-update-pec-create-01.png" alt-text="Screenshot showing the Basics page of the Create a private endpoint wizard.":::
5. The **Resource** page is auto-populated
        :::image type="content" source="./media/configure-private-endpoints/device-update-pec-create-02.png" alt-text="Screenshot showing the Resource page of the Create a private endpoint wizard.":::
6. On the **Virtual Network** page, you select the subnet in a virtual network to where you want to deploy the private endpoint. 
    1. Select a **virtual network**. Only virtual networks in the currently selected subscription and location are listed in the drop-down list. 
    2. Select a **subnet** in the virtual network you selected. 
        :::image type="content" source="./media/configure-private-endpoints/device-update-pec-create-03.png" alt-text="Screenshot showing the Virtual Network page of the Creating a private endpoint wizard.":::
7. On the **DNS** page, unless you're using your own custom DNS, use the pre-populated values.
        :::image type="content" source="./media/configure-private-endpoints/device-update-pec-create-04.png" alt-text="Screenshot showing the DNS page of the Creating a private endpoint wizard.":::
8. On the **Tags** page, create any tags (names and values) that you want to associate with the private endpoint resource. Then, select **Review + create** button at the bottom of the page. 
9. On the **Review + create**, review all the settings, and select **Create** to create the private endpoint. 

### Manually approved Private Endpoints

In the case that the user creating the connection doesn't have the power to also approve it, the connection will be created in the pending state.  

1. Go to Home -> Private Link Center -> Private Endpoints -> +Create
    :::image type="content" source="./media/configure-private-endpoints/private-link-center.png" alt-text="Screenshot showing the Private Endpoints tab in Private Link Center.":::
2. On the **Basics** page, follow these steps (same as in **Networking** tab in the Device Update account above): 
    1. Select an **Azure subscription** in which you want to create the private endpoint. 
    2. Select an **Azure resource group** for the private endpoint. 
    3. Enter a **name** for the endpoint. 
    4. Select the **region** for the endpoint. Your private endpoint must be in the same region as your virtual network, but can in a different region from the private link resource (in this example, a Device Update account). 
    5. Then, select **Next: Resource >** button at the bottom of the page. 
3. Fill all the required fields on the **Resources** tab
    1. Select **Connect by Resource ID**. 
    2. Enter the Resource ID of the Device Update account.
    3. Target sub-resource value must be **DeviceUpdate** 
    4. Optionally, add a request message
        :::image type="content" source="./media/configure-private-endpoints/private-endpoint-manual-create.png" alt-text="Screenshot showing the Resource page of the Create a private endpoint tab in Private Link Center.":::
4. Complete the rest of the steps like in steps 6-9 above

### Manage private link connection

When you create a private endpoint awaiting the manual approval, the connection must be approved before it can be used. If the resource for which you're creating a private endpoint is in your directory, you can approve the connection request provided you have sufficient permissions. If you're connecting to an Azure resource in another directory, you must wait for the owner of that resource to approve your connection request.

There are four provisioning states:

| Service action | Service consumer private endpoint state | Description |
|--|--|--|
| None | Pending | Connection is created manually and is pending approval from the private Link resource owner. |
| Approve | Approved | Connection was automatically or manually approved and is ready to be used. |
| Reject | Rejected | Connection was rejected by the private link resource owner. |
| Remove | Disconnected | Connection was removed by the private link resource owner, the private endpoint becomes informative and should be deleted for cleanup. |
 
###  How to manage a private endpoint connection
The following sections show you how to approve or reject a private endpoint connection. 

#### Approve or reject a pending connection from the Private Link Center

1. Go to Home -> Private Link Center -> Pending Connections
2. Select the connection and approve/reject
    :::image type="content" source="./media/configure-private-endpoints/private-link-approval.png" alt-text="Screenshot showing the Pending Connections tab in Private Link Center.":::

#### Approve or reject a pending connection from the Device Update account

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the search bar, type in **Device Update account**.
3. Select the **account** that you want to manage.
4. Select the **Networking** tab.
5. If there are any connections that are pending, you'll see a connection listed with **Pending** in the provisioning state. 
    :::image type="content" source="./media/configure-private-endpoints/device-update-approval.png" alt-text="Screenshot showing a Pending Connection in the Networking tab in Device Update account.":::

## Next steps

* [Learn about network security concepts](network-security.md).
