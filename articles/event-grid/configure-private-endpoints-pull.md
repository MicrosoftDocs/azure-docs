---
title: Configure private endpoints for Azure Event Grid namespaces
description: This article describes how to configure private endpoints for Azure Event Grid namespaces. 
ms.topic: how-to
ms.date: 10/04/2023 
---

# Configure private endpoints for Azure Event Grid namespaces
You can use [private endpoints](../private-link/private-endpoint-overview.md) to allow ingress of events directly from your virtual network to entities in your Event Grid namespaces securely over a [private link](../private-link/private-link-overview.md) without going through the public internet. The private endpoint uses an IP address from the virtual network address space for your namespace. For more conceptual information, see [Network security](network-security.md).

This article shows you how to enable private network access for an Event Grid namespace. For complete steps for creating a namespace, see [Create and manage namespaces](create-view-manage-namespaces.md).


## When creating a namespace

1. At the time of creating an Event Grid namespace, select **Private access** on the **Networking** page of the namespace creation wizard. 
1. In the **Private endpoint connections** section, select **+ Private endpoint**. 

    :::image type="content" source="./media/configure-private-endpoints-mqtt/create-namespace-private-access.png" alt-text="Screenshot that shows the Networking page of the Create namespace wizard with Private access option selected.":::    
1. On the **Create a private endpoint** page, follow these steps.
    1. Select an **Azure subscription** in which you want to create the private endpoint. 
    1. Select an **Azure resource group** for the private endpoint. 
    1. Select the **region** for the endpoint. Your private endpoint must be in the same region as your virtual network, but can in a different region from the private link resource (in this example, an  Event Grid namespace).  
    1. Enter a **name** for the **endpoint**. 
    1. Select a **Target sub-resource**. For example: **topic**.
    1. Select a **virtual network**. Only virtual networks in the currently selected subscription and location are listed in the drop-down list. 
    2. Select a **subnet** in the virtual network you selected. 
    1. Select whether you want the private endpoint to be integrated with a **private DNS zone**, and then select the **private DNS zone**.
    1. Select **OK** to create the private endpoint.
    
        :::image type="content" source="./media/configure-private-endpoints-mqtt/create-namespace-private-endpoint.png" alt-text="Screenshot that shows the Create private endpoint page when creating an Event Grid namespace.":::           
    

## For an existing namespace

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Event Grid namespace.
1. On the **Event Grid Namespace** page, select **Networking** on the left menu.
1. In the **Public network access** tab, select **Private endpoints only**.
1. Select **Save** on the toolbar.
1. Then, switch to the **Private endpoint connections** tab. 

    :::image type="content" source="./media/configure-private-endpoints-mqtt/existing-namespace-private-access.png" alt-text="Screenshot that shows the Networking page of an existing namespace with Private endpoints only option selected.":::    
1. In the **Private endpoint connections** tab, select **+ Private endpoint**. 

    :::image type="content" source="./media/configure-private-endpoints-mqtt/existing-namespace-add-private-endpoint-button.png" alt-text="Screenshot that shows the Private endpoint connections tab of the Networking page with Add private endpoint button selected.":::    
1. Follow steps in the next section: [Create a private endpoint](#create-a-private-endpoint) section to create a private endpoint.

## Create a private endpoint

1. On the **Basics** page, follow these steps: 
    1. Select an **Azure subscription** in which you want to create the private endpoint. 
    2. Select an **Azure resource group** for the private endpoint. 
    3. Enter a **name** for the **endpoint**. 
    1. Update the **name** for the **network interface** if needed. 
    1. Select the **region** for the endpoint. Your private endpoint must be in the same region as your virtual network, but can in a different region from the private link resource (in this example, an  Event Grid namespace). 
    1. Then, select **Next: Resource >** button at the bottom of the page. 

        :::image type="content" source="./media/configure-private-endpoints-mqtt/create-private-endpoint-basics-page.png" alt-text="Screenshot showing the Basics page of the Create a private endpoint wizard.":::
1. On the **Resource** page, follow these steps.
    1. Confirm that the **Azure subscription**, **Resource type**, and **Resource** (that is, your Event Grid namespace) looks correct
    1. Select a **Target sub-resource**. For example: **topic**. 
    1. Select **Next: Virtual Network >** button at the bottom of the page. 

        :::image type="content" source="./media/configure-private-endpoints-mqtt/create-private-endpoint-resource-page.png" alt-text="Screenshot showing the Resource page of the Create a private endpoint wizard.":::
1. On the **Virtual Network** page, you select the subnet in a virtual network to where you want to deploy the private endpoint. 
    1. Select a **virtual network**. Only virtual networks in the currently selected subscription and location are listed in the drop-down list. 
    2. Select a **subnet** in the virtual network you selected. 
    1. Specify whether you want the **IP address** to be allocated statically or dynamically. 
    1. Select an existing **application security group** or create one and then associate with the private endpoint.
    1. Select **Next: DNS >** button at the bottom of the page. 

        :::image type="content" source="./media/configure-private-endpoints-mqtt/create-private-endpoint-virtual-network-page.png" alt-text="Screenshot showing the Virtual Network page of the Create a private endpoint wizard.":::
1. On the **DNS** page, select whether you want the private endpoint to be integrated with a **private DNS zone**, and then select **Next: Tags** at the bottom of the page. 

    :::image type="content" source="./media/configure-private-endpoints-mqtt/create-private-endpoint-dns-page.png" alt-text="Screenshot showing the DNS page of the Create a private endpoint wizard."::: 
1. On the **Tags** page, create any tags (names and values) that you want to associate with the private endpoint resource. Then, select **Review + create** button at the bottom of the page. 
1. On the **Review + create**, review all the settings, and select **Create** to create the private endpoint. 

### Manage private link connection

When you create a private endpoint, the connection must be approved. If the resource for which you're creating a private endpoint is in your directory, you can approve the connection request provided you have sufficient permissions. If you're connecting to an Azure resource in another directory, you must wait for the owner of that resource to approve your connection request.

There are four provisioning states:

| Service action | Service consumer private endpoint state | Description |
|--|--|--|
| None | Pending | Connection is created manually and is pending approval from the private Link resource owner. |
| Approve | Approved | Connection was automatically or manually approved and is ready to be used. |
| Reject | Rejected | Connection was rejected by the private link resource owner. |
| Remove | Disconnected | Connection was removed by the private link resource owner. The private endpoint becomes informative and should be deleted for cleanup. |
 
###  How to manage a private endpoint connection
The following sections show you how to approve or reject a private endpoint connection. 

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar, type in **Event Grid Namespaces**, and select it to see the list of namespaces.
1. Select the **namespace** that you want to manage.
1. Select the **Networking** tab.
1. If there are any connections that are pending, you'll see a connection listed with **Pending** in the provisioning state. 

### To approve a private endpoint
You can approve a private endpoint that's in the pending state. To approve, follow these steps: 

1. Select the **private endpoint** you wish to approve, and select **Approve** on the toolbar.
1. On the **Approve connection** dialog box, enter a comment (optional), and select **Yes**. 
1. Confirm that you see the status of the endpoint as **Approved**. 

### To reject a private endpoint
You can reject a private endpoint that's in the pending state or approved state. To reject, follow these steps: 

1. Select the **private endpoint** you wish to reject, and select **Reject** on the toolbar.
1. On the **Reject connection** dialog box, enter a comment (optional), and select **Yes**. 
1. Confirm that you see the status of the endpoint as **Rejected**. 

    :::image type="content" source="./media/configure-private-endpoints-mqtt/reject-private-endpoint.png" alt-text="Screenshot showing the Private endpoint connection tab with Reject button selected.":::

    > [!NOTE]
    > You can't approve a private endpoint in the Azure portal once it's rejected. 

### To remove a private endpoint
To delete a private endpoint, follow these steps: 

1. Select the **private endpoint** you wish to delete, and select **Remove** on the toolbar.
1. On the **Delete connection** dialog box, select **Yes** to delete the private endpoint.

    :::image type="content" source="./media/configure-private-endpoints-mqtt/remove-private-endpoint.png" alt-text="Screenshot showing the Private endpoint connection tab with Remove button selected.":::

## Next steps
To learn about how to configure IP firewall settings, see [Configure IP firewall for Azure Event Grid namespaces](configure-firewall-mqtt.md).
