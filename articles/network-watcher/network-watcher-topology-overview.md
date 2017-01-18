---
title: Introduction to the topology API in Azure Network Watcher | Microsoft Docs
description: This page provides an overview of the Network Watcher topology capabilities
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.assetid: ad27ab85-9d84-4759-b2b9-e861ef8ea8d8
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 01/30/2017
ms.author: gwallace
---

# Introduction to the topology API in Azure Network Watcher

The topology feature of Network Watcher represents and graphs network resources in a subscription. Topology helps you **know your network**. This will show containment relationships between the resources. If it is run through the portal, a visual representation of the topology is shown. If using the Azure REST endpoint for Topology, a collection of objects and associations are returned. These objects can be mapped to objects in a tool of your choice to represent the topology graphically.

> [!NOTE]
> Topology is currently only supported in the Azure portal at this time.

The topology view includes the Network Security Groups (NSG) that are applied to the resources as well as the security rules as well.

The following is the properties that are returned when querying the Topology REST API.

* **name** - The name of the resource
* **id** - The uri of the resource.
* **location** - The location where the resource exists.
* **associations** - A list of associations to the referenced object.
    * **name** - The name of the referenced resource.
    * **resourceId** - The resourceId is the uri of the resource referenced in the association.
    * **associationType** - This value references the association between the child object and the parent. Valid values are Contains or Associated

The following is an example of the json response returned.

```json
{
  "id": "ecd6c860-9cf5-411a-bdba-512f8df7799f",
  "createdDateTime": "2017-01-18T04:13:07.1974591Z",
  "lastModified": "2017-01-17T22:11:52.3527348Z",
  "resources": [
    {
      "name": "virtualNetwork1",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/virtualNetworks/virtualNetwork1",
      "location": "westcentralus",
      "associations": [
        {
          "name": "appGatewaySubnet",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/virtualNetworks/virtualNetwork1/subnets
/appGatewaySubnet",
          "associationType": "Contains"
        }
      ]
    },
    {
      "name": "appGatewaySubnet",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/virtualNetworks/virtualNetwork1/subnets/appGatewayS
ubnet",
      "location": "westcentralus",
      "associations": []
    },
    {
      "name": "webtestvnet-vybsv4xqn6j6w",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/virtualNetworks/webtestvnet-vybsv4xqn6j6w",
      "location": "westcentralus",
      "associations": [
        {
          "name": "Subnet",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/virtualNetworks/webtestvnet-vybsv4xqn6j
6w/subnets/Subnet",
          "associationType": "Contains"
        }
      ]
    },
    {
      "name": "Subnet",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/virtualNetworks/webtestvnet-vybsv4xqn6j6w/subnets/S
ubnet",
      "location": "westcentralus",
      "associations": []
    },
    {
      "name": "webtestvnet-wjplxls65qcto",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/virtualNetworks/webtestvnet-wjplxls65qcto",
      "location": "westcentralus",
      "associations": [
        {
          "name": "Subnet",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/virtualNetworks/webtestvnet-wjplxls65qc
to/subnets/Subnet",
          "associationType": "Contains"
        }
      ]
    },
    {
      "name": "Subnet",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/virtualNetworks/webtestvnet-wjplxls65qcto/subnets/S
ubnet",
      "location": "westcentralus",
      "associations": []
    },
    {
      "name": "webtestvm-backend-qghdzsjq7jvsy-1-yh2nfml56dvqq",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Compute/virtualMachines/webtestvm-backend-qghdzsjq7jvsy-1-y
h2nfml56dvqq",
      "associations": [
        {
          "name": "webtestnic-backend-qghdzsjq7jvsy-1-yh2nfml56dvqq",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/networkInterfaces/webtestnic-backend-qg
hdzsjq7jvsy-1-yh2nfml56dvqq",
          "associationType": "Contains"
        }
      ]
    },
    {
      "name": "webtestvm-backend-qghdzsjq7jvsy-2-yh2nfml56dvqq",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Compute/virtualMachines/webtestvm-backend-qghdzsjq7jvsy-2-y
h2nfml56dvqq",
      "associations": [
        {
          "name": "webtestnic-backend-qghdzsjq7jvsy-2-yh2nfml56dvqq",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/networkInterfaces/webtestnic-backend-qg
hdzsjq7jvsy-2-yh2nfml56dvqq",
          "associationType": "Contains"
        }
      ]
    },
    {
      "name": "applicationGateway1",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/applicationGateways/applicationGateway1",
      "location": "westcentralus",
      "associations": [
        {
          "name": "appGatewayFrontendIP",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/applicationGateways/applicationGateway1
/frontendIPConfigurations/appGatewayFrontendIP",
          "associationType": "Contains"
        },
        {
          "name": "appGatewayBackendPool",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/applicationGateways/applicationGateway1
/backendAddressPools/appGatewayBackendPool",
          "associationType": "Contains"
        }
      ]
    },
    {
      "name": "appGatewayFrontendIP",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/applicationGateways/applicationGateway1/frontendIPC
onfigurations/appGatewayFrontendIP",
      "location": "westcentralus",
      "associations": [
        {
          "name": "testAppGWIP",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/publicIPAddresses/testAppGWIP",
          "associationType": "Associated"
        }
      ]
    },
    {
      "name": "appGatewayBackendPool",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/applicationGateways/applicationGateway1/backendAddr
essPools/appGatewayBackendPool",
      "location": "westcentralus",
      "associations": []
    },
    {
      "name": "webtestnic-backend-qghdzsjq7jvsy-1-yh2nfml56dvqq",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/networkInterfaces/webtestnic-backend-qghdzsjq7jvsy-
1-yh2nfml56dvqq",
      "location": "westcentralus",
      "associations": [
        {
          "name": "webtestvm-backend-qghdzsjq7jvsy-1-yh2nfml56dvqq",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Compute/virtualMachines/webtestvm-backend-qghdz
sjq7jvsy-1-yh2nfml56dvqq",
          "associationType": "Associated"
        },
        {
          "name": "webtestnsg-wjplxls65qcto",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/networkSecurityGroups/webtestnsg-wjplxl
s65qcto",
          "associationType": "Associated"
        },
        {
          "name": "Subnet",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/virtualNetworks/webtestvnet-wjplxls65qc
to/subnets/Subnet",
          "associationType": "Associated"
        },
        {
          "name": "backend-qghdzsjq7jvsy-1",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/publicIPAddresses/backend-qghdzsjq7jvsy
-1",
          "associationType": "Associated"
        }
      ]
    },
    {
      "name": "webtestnic-backend-qghdzsjq7jvsy-2-yh2nfml56dvqq",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/networkInterfaces/webtestnic-backend-qghdzsjq7jvsy-
2-yh2nfml56dvqq",
      "location": "westcentralus",
      "associations": [
        {
          "name": "webtestvm-backend-qghdzsjq7jvsy-2-yh2nfml56dvqq",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Compute/virtualMachines/webtestvm-backend-qghdz
sjq7jvsy-2-yh2nfml56dvqq",
          "associationType": "Associated"
        },
        {
          "name": "webtestnsg-vybsv4xqn6j6w",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/networkSecurityGroups/webtestnsg-vybsv4
xqn6j6w",
          "associationType": "Associated"
        },
        {
          "name": "Subnet",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/virtualNetworks/webtestvnet-vybsv4xqn6j
6w/subnets/Subnet",
          "associationType": "Associated"
        },
        {
          "name": "backend-qghdzsjq7jvsy-2",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/publicIPAddresses/backend-qghdzsjq7jvsy
-2",
          "associationType": "Associated"
        }
      ]
    },
    {
      "name": "webtestnsg-vybsv4xqn6j6w",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/networkSecurityGroups/webtestnsg-vybsv4xqn6j6w",
      "location": "westcentralus",
      "associations": [
        {
          "name": "ssh-rule",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/networkSecurityGroups/webtestnsg-vybsv4
xqn6j6w/securityRules/ssh-rule",
          "associationType": "Contains"
        },
        {
          "name": "web-rule",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/networkSecurityGroups/webtestnsg-vybsv4
xqn6j6w/securityRules/web-rule",
          "associationType": "Contains"
        }
      ]
    },
    {
      "name": "ssh-rule",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/networkSecurityGroups/webtestnsg-vybsv4xqn6j6w/secu
rityRules/ssh-rule",
      "location": "westcentralus",
      "associations": []
    },
    {
      "name": "web-rule",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/networkSecurityGroups/webtestnsg-vybsv4xqn6j6w/secu
rityRules/web-rule",
      "location": "westcentralus",
      "associations": []
    },
    {
      "name": "webtestnsg-wjplxls65qcto",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/networkSecurityGroups/webtestnsg-wjplxls65qcto",
      "location": "westcentralus",
      "associations": [
        {
          "name": "ssh-rule",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/networkSecurityGroups/webtestnsg-wjplxl
s65qcto/securityRules/ssh-rule",
          "associationType": "Contains"
        },
        {
          "name": "web-rule",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/networkSecurityGroups/webtestnsg-wjplxl
s65qcto/securityRules/web-rule",
          "associationType": "Contains"
        }
      ]
    },
    {
      "name": "ssh-rule",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/networkSecurityGroups/webtestnsg-wjplxls65qcto/secu
rityRules/ssh-rule",
      "location": "westcentralus",
      "associations": []
    },
    {
      "name": "web-rule",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/networkSecurityGroups/webtestnsg-wjplxls65qcto/secu
rityRules/web-rule",
      "location": "westcentralus",
      "associations": []
    },
    {
      "name": "backend-qghdzsjq7jvsy-1",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/publicIPAddresses/backend-qghdzsjq7jvsy-1",
      "location": "westcentralus",
      "associations": [
        {
          "name": "webtestnic-backend-qghdzsjq7jvsy-1-yh2nfml56dvqq",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/networkInterfaces/webtestnic-backend-qg
hdzsjq7jvsy-1-yh2nfml56dvqq",
          "associationType": "Associated"
        }
      ]
    },
    {
      "name": "backend-qghdzsjq7jvsy-2",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/publicIPAddresses/backend-qghdzsjq7jvsy-2",
      "location": "westcentralus",
      "associations": [
        {
          "name": "webtestnic-backend-qghdzsjq7jvsy-2-yh2nfml56dvqq",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/networkInterfaces/webtestnic-backend-qg
hdzsjq7jvsy-2-yh2nfml56dvqq",
          "associationType": "Associated"
        }
      ]
    },
    {
      "name": "testAppGWIP",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azuretestrgrg/providers/Microsoft.Network/publicIPAddresses/testAppGWIP",
      "location": "westcentralus",
      "associations": []
    }
  ]
}
```

## Next Steps

Learn how to use the Azure REST API to retrieve the Topology view by visiting [Create Visio diagram based on Topology, REST API and PowerShell](network-watcher-topology-visio-rest.md)

<!--Image references-->

[1]: ./media/network-watcher-topology-overview/figure1.png