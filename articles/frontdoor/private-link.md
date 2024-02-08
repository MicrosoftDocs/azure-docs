---
title: 'Secure your Origin with Private Link in Azure Front Door Premium'
description: This page provides information about how to secure connectivity to your origin using Private Link.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 05/17/2023
ms.author: duau
ms.custom: references_regions
---

# Secure your Origin with Private Link in Azure Front Door Premium

[Azure Private Link](../private-link/private-link-overview.md) enables you to access Azure PaaS services and services hosted in Azure over a private endpoint in your virtual network. Traffic between your virtual network and the service goes over the Microsoft backbone network, eliminating exposure to the public Internet.

Azure Front Door Premium can connect to your origin using Private Link. Your origin can be hosted in a virtual network or hosted as a PaaS service such as Azure Web App or Azure Storage. Private Link removes the need for your origin to be accessed publicly.

:::image type="content" source="./media/private-link/front-door-private-endpoint-architecture.png" alt-text="Diagram of Azure Front Door with Private Link enabled.":::

## How Private Link works

When you enable Private Link to your origin in Azure Front Door Premium, Front Door creates a private endpoint on your behalf from an Azure Front Door managed regional private network. You'll receive an Azure Front Door private endpoint request at the origin pending your approval.

> [!IMPORTANT]
> You must approve the private endpoint connection before traffic can pass to the origin privately. You can approve private endpoint connections by using the Azure portal, Azure CLI, or Azure PowerShell. For more information, see [Manage a Private Endpoint connection](../private-link/manage-private-endpoint.md).

After you enable an origin for Private Link and approve the private endpoint connection, it can take a few minutes for the connection to be established. During this time, requests to the origin will receive an Azure Front Door error message. The error message will go away once the connection is established.

Once your request is approved, a private IP address gets assigned from the Azure Front Door managed virtual network. Traffic between your Azure Front Door and your origin will communicate using the established private link over the Microsoft backbone network. Incoming traffic to your origin is now secured when arriving at your Azure Front Door.

:::image type="content" source="./media/private-link/enable-private-endpoint.png" alt-text="Screenshot of enable Private Link service checkbox from origin configuration page.":::

## Association of a private endpoint with an Azure Front Door profile

### Private endpoint creation

Within a single Azure Front Door profile, if two or more Private Link enabled origins are created with the same set of Private Link, resource ID and group ID, then for all such origins only one private endpoint gets created. Connections to the backend can be enabled using this private endpoint. This setup means you only have to approve the private endpoint once because only one private endpoint gets created. If you create more Private Link enabled origins using the same set of Private Link location, resource ID and group ID, you won't need to approve anymore private endpoints.

#### Single private endpoint

For example, a single private endpoint gets created for all the different origins across different origin groups but in the same Azure Front Door profile as shown in the below table:

:::image type="content" source="./media/private-link/single-endpoint.png" alt-text="Diagram showing a single private endpoint created for origins created in the same Azure Front Door profile.":::

#### Multiple private endpoints

A new private endpoint gets created in the following scenario:

* If the region, resource ID or group ID changes:

    :::image type="content" source="./media/private-link/multiple-endpoints.png" alt-text="Diagram showing a multiple private endpoint created because changes in the region and resource ID for the origin.":::

    > [!NOTE]
    > The Private Link location and the hostname has changed, resulting in extra private endpoints created and requires approval for each one.

* When the Azure Front Door profile changes:

    :::image type="content" source="./media/private-link/multiple-profiles.png" alt-text="Diagram showing a multiple private endpoint created because the origin is associated with multiple Azure Front Door profiles.":::

    > [!NOTE]
    > Enabling Private Link for origins in different Front Door profiles will create extra private endpoints and requires approval for each one.

### Private endpoint removal

When an Azure Front Door profile gets deleted, private endpoints associated with the profile will also get deleted. 

#### Single private endpoint

If AFD-Profile-1 gets deleted, then the PE1 private endpoint across all the origins will also be deleted.

:::image type="content" source="./media/private-link/delete-endpoint.png" alt-text="Diagram showing if AFD-Profile-1 gets deleted then PE1 across all origins will get deleted.":::

#### Multiple private endpoints

* If AFD-Profile-1 gets deleted, all private endpoints from PE1 through to PE4 will be deleted.
 
    :::image type="content" source="./media/private-link/delete-multiple-endpoints.png" alt-text="Diagram showing if AFD-Profile-1 gets deleted, all private endpoints from PE1 through PE4 gets deleted.":::

* Deleting a Front Door profile won't affect private endpoints created for a different Front Door profile. 

    :::image type="content" source="./media/private-link/delete-multiple-profiles.png" alt-text="Diagram showing Azure Front Door profile getting deleted won't affect private endpoints in other Front Door profiles.":::

    For example:
    
    * If AFD-Profile-2 gets deleted, only PE5 will be removed.
    * If AFD-Profile-3 gets deleted, only PE6 will be removed.
    * If AFD-Profile-4 gets deleted, only PE7 will be removed.
    * If AFD-Profile-5 gets deleted, only PE8 will be removed.

## Region availability

Azure Front Door private link is available in the following regions:

| Americas | Europe | Africa | Asia Pacific |
|--|--|--|--|
| Brazil South | France Central | South Africa North | Australia East |
| Canada Central | Germany West Central | | Central India |
| Central US | North Europe | | Japan East |
| East US | Norway East | | Korea Central |
| East US 2 | UK South | | East Asia |
| South Central US | West Europe | | |
| West US 3 | Sweden Central | | |
| US Gov Arizona |||
| US Gov Texas |||


## Limitations

Origin support for direct private endpoint connectivity is currently limited to:
* Blob Storage
* Web App
* Internal load balancers, or any services that expose internal load balancers such as Azure Kubernetes Service, Azure Container Apps or Azure Red Hat OpenShift
* Storage Static Website


The Azure Front Door Private Link feature is region agnostic but for the best latency, you should always pick an Azure region closest to your origin when choosing to enable Azure Front Door Private Link endpoint.

## Next steps

* Learn how to [connect Azure Front Door Premium to a Web App origin with Private Link](standard-premium/how-to-enable-private-link-web-app.md).
* Learn how to [connect Azure Front Door Premium to a storage account origin with Private Link](standard-premium/how-to-enable-private-link-storage-account.md).
* Learn how to [connect Azure Front Door Premium to an internal load balancer origin with Private Link](standard-premium/how-to-enable-private-link-internal-load-balancer.md).
* Learn how to [connect Azure Front Door Premium to a storage static website origin with Private Link](how-to-enable-private-link-storage-static-website.md).

