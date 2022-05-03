---
title: Manage resource management private links
description: Use REST API to manage existing resource management private links
ms.topic: conceptual
ms.date: 07/29/2021
---

# Manage resource management private links with REST API (preview)

This article explains how you to work with existing resource management private links. It shows REST API operations for getting and deleting existing resources.

If you need to create a resource management private link, see [Use portal to create private link for managing Azure resources](create-private-link-access-portal.md) or [Use REST API to create private link for managing Azure resources](create-private-link-access-rest.md).

## Resource management private links

To **get a specific** resource management private link, send the following request:

```http
GET
https://management.azure.com/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.Authorization/resourceManagementPrivateLinks/{rmplName}?api-version=2020-05-01 
```

The operation returns:

```json
{
  "properties": {
    "privateEndpointConnections": []
  },
  "id": {rmplResourceId},
  "name": {rmplName},
  "type": "Microsoft.Authorization/resourceManagementPrivateLinks",
  "location": {region}
}
```

To **get all** resource management private links in a subscription, use:

```http
GET
https://management.azure.com/subscriptions/{subscriptionID}/providers/Microsoft.Authorization/resourceManagementPrivateLinks?api-version=2020-05-01
```

The operation returns:

```json
[
  {
    "properties": {
      "privateEndpointConnections": []
    },
    "id": {rmplResourceId},
    "name": {rmplName},
    "type": "Microsoft.Authorization/resourceManagementPrivateLinks",
    "location": {region}
  },
  {
    "properties": {
      "privateEndpointConnections": []
    },
    "id": {rmplResourceId},
    "name": {rmplName},
    "type": "Microsoft.Authorization/resourceManagementPrivateLinks",
    "location": {region}
  }
]
```

To **delete a specific** resource management private link, use:

```http
DELETE
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Authorization/resourceManagementPrivateLinks/{rmplName}?api-version=2020-05-01
```

The operation returns: `Status 200 OK`.

## Private link association

To **get a specific** private link association for a management group, use:

```http
GET
https://management.azure.com/providers/Microsoft.Management/managementGroups/{managementGroupID}/providers/Microsoft.Authorization/privateLinkAssociations?api-version=2020-05-01 
```

The operation returns:

```json
{
  "value": [
    {
      "properties": {
        "privateLink": {rmplResourceID},
        "tenantId": {tenantId},
        "scope": "/providers/Microsoft.Management/managementGroups/{managementGroupId}"
      },
      "id": {plaResourceId},
      "type": "Microsoft.Authorization/privateLinkAssociations",
      "name": {plaName}
    }
  ]
}
```

To **delete** a private link association, use:

```http
DELETE 
https://management.azure.com/providers/Microsoft.Management/managementGroups/{managementGroupID}/providers/Microsoft.Authorization/privateLinkAssociations/{plaID}?api-version=2020-05-01
```

The operation returns: `Status 200 OK`.

## Private endpoints

To **get all** private endpoints in a subscription, use:

```http
GET 
https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/privateEndpoints?api-version=2020-04-01
```

The operation returns:

```json
{
  "value": [
    {
      "name": {privateEndpointName},
      "id": {privateEndpointResourceId},
      "etag": {etag},
      "type": "Microsoft.Network/privateEndpoints",
      "location": {region},
      "properties": {
        "provisioningState": "Updating",
        "resourceGuid": {GUID},
        "privateLinkServiceConnections": [
          {
            "name": {connectionName},
            "id": {connectionResourceId},
            "etag": {etag},
            "properties": {
              "provisioningState": "Succeeded",
              "privateLinkServiceId": {rmplResourceId},
              "groupIds": [
                "ResourceManagement"
              ],
              "privateLinkServiceConnectionState": {
                "status": "Approved",
                "description": "",
                "actionsRequired": "None"
              }
            },
            "type": "Microsoft.Network/privateEndpoints/privateLinkServiceConnections"
          }
        ],
        "manualPrivateLinkServiceConnections": [],
        "subnet": {
          "id": {subnetResourceId}
        },
        "networkInterfaces": [
          {
            "id": {networkInterfaceResourceId}
          }
        ],
        "customDnsConfigs": [
          {
            "fqdn": "management.azure.com",
            "ipAddresses": [
              "10.0.0.4"
            ]
          }
        ]
      }
    }
  ]
}
```

## Next steps

* To learn more about private links, see [Azure Private Link](../../private-link/index.yml).
* To create a resource management private links, see [Use portal to create private link for managing Azure resources](create-private-link-access-portal.md) or [Use REST API to create private link for managing Azure resources](create-private-link-access-rest.md).
