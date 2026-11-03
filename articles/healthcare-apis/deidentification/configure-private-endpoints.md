---
title: Configure Private Endpoint Access for De-identification Service
description: Learn how to configure private endpoint access to the Azure Health Data Services de-identification service and restrict public network access. Get started now.
ms.date: 10/28/2026
ms.topic: how-to
author: jovinson-ms
ms.author: jovinson
ms.service: azure-health-data-services
ms.subservice: deidentification-service
# customer intent: As an IT admin, I want to restrict network access to a de-identification service to a private endpoint in a virtual network. 
---

# Configure private endpoint network access to Azure Health Data Services de-identification service
Learn how to configure private endpoint network access to restrict connections to your Azure Health Data Services de-identification service. By using Azure Private Link, you can access Azure services, including the de-identification service, over a **private endpoint** in your virtual network.

A private endpoint is a network interface that connects you privately and securely to an Azure service that supports Azure Private Link. The private endpoint uses a private IP address from your virtual network, effectively bringing the service into your virtual network. All traffic to the service routes through the private endpoint, so you don't need gateways, NAT devices, Azure ExpressRoute or VPN connections, or public IP addresses. Traffic between your virtual network and the service traverses the Microsoft backbone network, eliminating exposure from the public Internet. You can restrict connections to specific instances of an Azure service, giving you the highest level of granularity in access control.

For more information, see [What is Azure Private Link?](../../private-link/private-link-overview.md)

## Add a private endpoint by using the Azure portal

### Prerequisites

- A de-identification service in your Azure subscription. If you don't have a de-identification service, follow the steps in [Quickstart: Deploy the de-identification service](quickstart.md).
- Owner or contributor permissions for the de-identification service.
 
### Create a private endpoint

Follow the steps in [Quickstart: Create a private endpoint by using the Azure portal](/azure/private-link/create-private-endpoint-portal). 

- Instead of a web app, create a private endpoint to a de-identification service.
- When you reach [Create a private endpoint](/azure/private-link/create-private-endpoint-portal?tabs=dynamic-ip#create-a-private-endpoint), in the resource pane, enter resource type **Microsoft.HealthDataAIServices/deidServices**.
- Your private endpoint and virtual network must be in the same region. When you select a region for the private endpoint by using the portal, it automatically filters virtual networks that are in that region. Your de-identification service can be in a different region.
- When you reach [Test connectivity to the private endpoint](/azure/private-link/create-private-endpoint-portal?tabs=dynamic-ip#test-connectivity-to-the-private-endpoint) steps 8 and 10, use the service URL of your de-identification service plus the `/health` path.

### Configure private access

> [!IMPORTANT]
> Creating a private endpoint doesn't automatically restrict public network access.

When you create a de-identification service, you can either allow public access only (from all networks) or private access only (only via private endpoints) to the de-identification service.

If you already have a de-identification service, you can configure network access by going to the service's Azure portal **Networking** page, and under **Public network access**, selecting **Disabled**. 

## Manage private endpoints using Azure portal

When you create a private endpoint, you must approve the connection. If the resource for which you're creating a private endpoint is in your directory, you can approve the connection request if you have sufficient permissions. If you're connecting to an Azure resource in another directory, you must wait for the owner of that resource to approve your connection request.

There are four provisioning states:

| Service action | Service consumer private endpoint state | Description |
|--|--|--|
| None | Pending | Connection is created manually and is pending approval from the target resource owner. |
| Approve | Approved | Connection was automatically or manually approved and is ready to be used. |
| Reject | Rejected | The target resource owner rejected the connection. |
| Remove | Disconnected | The target resource owner removed the connection. The private endpoint should be deleted for cleanup. |
 
###  Approve, reject, or remove a private endpoint connection

1. Sign in to the Azure portal.
1. In the search bar, type **de-id**.
1. Select the **de-identification service** that you want to manage.
1. Select the **Networking** tab.
1. Go to the appropriate section based on the operation you want to perform: approve, reject, or remove.

### Approve a private endpoint connection
1. If there are any connections that are pending, you see a connection listed with **Pending** in the provisioning state. 
1. Select the **private endpoint** you want to approve.
1. Select the **Approve** button.
1. On the **Approve connection** page, add a comment (optional), and select **Yes**. If you select **No**, nothing happens. 
1. You see the status of the private endpoint connection in the list change to **Approved**. 

### Reject a private endpoint connection

1. If there are any private endpoint connections you want to reject, whether it's a pending request or existing connection, select the connection and select the **Reject** button.
1. On the **Reject connection** page, enter a comment (optional), and select **Yes**. If you select **No**, nothing happens. 
1. You see the status of the private endpoint connection in the list change to **Rejected**. 

### Remove a private endpoint connection

1. To remove a private endpoint connection, select it in the list, and select **Remove** on the toolbar.
1. On the **Delete connection** page, select **Yes** to confirm the deletion of the private endpoint. If you select **No**, nothing happens.
1. You see the status change to **Disconnected**. Then, the endpoint disappears from the list.

## Limitations and design considerations

- For pricing information, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).
- This feature is available in all Azure Commercial regions.
- Because network traffic is blocked at the application layer, you can still ping the public endpoint of your service even though public network access is disabled. 

For more, see [Azure Private Link service: Limitations](../../private-link/private-link-service-overview.md#limitations)

## Related content

- Learn more about [Azure Private Link](../../private-link/private-link-service-overview.md)
