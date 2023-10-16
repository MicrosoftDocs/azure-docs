---
title: Azure RBAC permissions for Azure Private Link
description: Get started learning about the Azure RBAC permissions needed to deploy a private endpoint and private link service.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: conceptual
ms.date: 5/25/2021
ms.custom: template-concept
---

# Azure RBAC permissions for Azure Private Link

Access management for cloud resources is a critical function for any organization. Azure role-based access control (Azure RBAC) manages access and operations of Azure resources.

To deploy a private endpoint or private link service a user must have assigned a built-in role such as: 

* [Owner](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fprivate-link%2ftoc.json#owner)
* [Contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fprivate-link%2ftoc.json#contributor)
* [Network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fprivate-link%2ftoc.json#network-contributor)

You can provide more granular access by creating a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fprivate-link%2ftoc.json) with the permissions described in the following sections.

> [!IMPORTANT]
> This article lists the specific permissions to create a private endpoint or private link service. Ensure you add the specific permissions related to the service you would like to grant access through private link, such as Microsoft.SQL Contributor Role for Azure SQL. For more information about built-in roles, see [Role Based Access Control](../role-based-access-control/built-in-roles.md).

Microsoft.Network and the specific resource provider you are deploying, for example Microsoft.Sql, must be registered at the subscription level:

![image](https://user-images.githubusercontent.com/20302679/129105527-b946eee9-038a-46ef-b446-be371eb23ca9.png)

## Private endpoint

This section lists the granular permissions required to deploy a private endpoint.

| Action                                                              | Description                                                                      |
| ---------                                                           | -------------                                                                 |
| Microsoft.Resources/deployments/*                                   | Create and manage a deployment                                                |
| Microsoft.Resources/subscriptions/resourcegroups/resources/read     | Read the resources for the resource group                                     |
| Microsoft.Network/virtualNetworks/read                              | Read the virtual network definition                                            |
| Microsoft.Network/virtualNetworks/subnets/read                      | Read a virtual network subnet definition                                      |
| Microsoft.Network/virtualNetworks/subnets/write                     | Creates a virtual network subnet or updates an existing virtual network subnet|
| Microsoft.Network/virtualNetworks/subnets/join/action               | Joins a virtual network                                                       |
| Microsoft.Network/privateEndpoints/read                             | Read a private endpoint resource                                             |
| Microsoft.Network/privateEndpoints/write                            | Creates a new private endpoint, or updates an existing private endpoint       |
| Microsoft.Network/locations/availablePrivateEndpointTypes/read      | Read available private endpoint resources                                     |

Here is the JSON format of the above permissions. Input your own roleName, description, and assignableScopes:

```JSON
{
 "properties": {
   "roleName": "Role Name",
   "description": "Description",
   "assignableScopes": [
     "/subscriptions/SubscriptionID/resourceGroups/ResourceGroupName"
   ],
   "permissions": [
     {
       "actions": [
         "Microsoft.Resources/deployments/*",
         "Microsoft.Resources/subscriptions/resourceGroups/read",
         "Microsoft.Network/virtualNetworks/read",
         "Microsoft.Network/virtualNetworks/subnets/read",
         "Microsoft.Network/virtualNetworks/subnets/write",
         "Microsoft.Network/virtualNetworks/subnets/join/action",
         "Microsoft.Network/privateEndpoints/read",
         "Microsoft.Network/privateEndpoints/write",
         "Microsoft.Network/locations/availablePrivateEndpointTypes/read"
       ],
       "notActions": [],
       "dataActions": [],
       "notDataActions": []
     }
   ]
 }
}
```

## Private link service

This section lists the granular permissions required to deploy a private link service.

| Action | Description   |
| --------- | ------------- |
| Microsoft.Resources/deployments/*                                   | Create and manage a deployment                                                |
| Microsoft.Resources/subscriptions/resourcegroups/resources/read     | Read the resources for the resource group                                     |
| Microsoft.Network/virtualNetworks/read                              | Read the virtual network definition                                            |
| Microsoft.Network/virtualNetworks/subnets/read                      | Read a virtual network subnet definition                                      |
| Microsoft.Network/virtualNetworks/subnets/write                     | Creates a virtual network subnet or updates an existing virtual network subnet|
| Microsoft.Network/privateLinkServices/read | Read a private link service resource|
| Microsoft.Network/privateLinkServices/write | Creates a new private link service, or updates an existing private link service|
| Microsoft.Network/privateLinkServices/privateEndpointConnections/read | Read a private endpoint connection definition |
| Microsoft.Network/privateLinkServices/privateEndpointConnections/write | Creates a new private endpoint connection, or updates an existing private endpoint connection|
| Microsoft.Network/networkSecurityGroups/join/action | Joins a network security group |
| Microsoft.Network/loadBalancers/read | Read a load balancer definition |
| Microsoft.Network/loadBalancers/write | Creates a load balancer or updates an existing load balancer |

```JSON
{
  "properties": {
    "roleName": "Role Name",
    "description": "Description",
    "assignableScopes": [
      "/subscriptions/SubscriptionID/resourceGroups/ResourceGroupName"
    ],
    "permissions": [
      {
        "actions": [
          "Microsoft.Resources/deployments/*",
          "Microsoft.Resources/subscriptions/resourceGroups/read",
          "Microsoft.Network/virtualNetworks/read",
          "Microsoft.Network/virtualNetworks/subnets/read",
          "Microsoft.Network/virtualNetworks/subnets/write",
          "Microsoft.Network/virtualNetworks/subnets/join/action",
          "Microsoft.Network/privateLinkServices/read",
          "Microsoft.Network/privateLinkServices/write",
          "Microsoft.Network/privateLinkServices/privateEndpointConnections/read",
          "Microsoft.Network/privateLinkServices/privateEndpointConnections/write",
          "Microsoft.Network/networkSecurityGroups/join/action",
          "Microsoft.Network/loadBalancers/read",
          "Microsoft.Network/loadBalancers/write"
        ],
        "notActions": [],
        "dataActions": [],
        "notDataActions": []
      }
    ]
  }
}
```

## Approval RBAC for private endpoint

Typically, a network administrator creates a private endpoint. Depending on your Azure role-based access control (RBAC) permissions, a private endpoint that you create is either *automatically approved* to send traffic to the API Management instance, or requires the resource owner to *manually approve* the connection.


|Approval method     |Minimum RBAC permissions  |
|---------|---------|
|Automatic     | `Microsoft.Network/virtualNetworks/**`<br/>`Microsoft.Network/virtualNetworks/subnets/**`<br/>`Microsoft.Network/privateEndpoints/**`<br/>`Microsoft.Network/networkinterfaces/**`<br/>`Microsoft.Network/locations/availablePrivateEndpointTypes/read`<br/>`Microsoft.ApiManagement/service/**`<br/>`Microsoft.ApiManagement/service/privateEndpointConnections/**`        |
|Manual     | `Microsoft.Network/virtualNetworks/**`<br/>`Microsoft.Network/virtualNetworks/subnets/**`<br/>`Microsoft.Network/privateEndpoints/**`<br/>`Microsoft.Network/networkinterfaces/**`<br/>`Microsoft.Network/locations/availablePrivateEndpointTypes/read`           |

## Next steps

For more information on private endpoint and private link services in Azure Private link, see:

- [What is Azure Private Endpoint?](private-endpoint-overview.md)
- [What is Azure Private Link service?](private-link-service-overview.md)
