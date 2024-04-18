---
title: Azure Operator Nexus - Applying ACLs to Network-to-Network Interconnects (NNI)
description: Learn how to apply Access Control Lists (ACLs) to network-to-network interconnects (NNI) within Azure Nexus Network Fabric.
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 04/18/2024
ms.custom: template-how-to
---

# Access Control List (ACL) Management for NNI

In Azure Nexus Network Fabric, maintaining network security is paramount for ensuring a robust and secure infrastructure. Access Control Lists (ACLs) are crucial tools for enforcing network security policies. This guide will lead you through the process of applying ACLs to network-to-network interconnects (NNI) within the Nexus Network Fabric.

## Applying Access Control Lists (ACLs) to NNI in Azure Fabric

To maintain network security and regulate traffic flow within your Azure Fabric network, applying Access Control Lists (ACLs) to network-to-network interconnects (NNI) is essential. This guide delineates the steps for effectively applying ACLs to NNIs.

#### Applying ACLs to NNI

Before applying ACLs to NNIs, utilize the following commands to view ACL details.

#### Viewing ACL details

To view the specifics of a particular ACL, execute the following command:

```azurecli
az networkfabric acl show --name acl-ingress --resource-group myResourceGroup
```

This command furnishes detailed information regarding the ACL's configuration, administrative state, default action, and matching conditions.

#### Listing ACLs in a resource group

To list all ACLs within a resource group, use the command:

```azurecli
az networkfabric acl list --resource-group myResourceGroup
```

This command presents a comprehensive list of ACLs along with their configuration states and other pertinent details.

#### Applying Ingress ACL to NNI

```azurecli
az networkfabric nni update --resource-group "example-rg" --resource-name "example-nnimgmt" --fabric "examplefabric" --ingress-acl-id "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accesscontrollists/example-Ipv4ingressACL"
```

| Parameter         | Description                                      |
|-------------------|--------------------------------------------------|
| --ingress-acl-id | Apply the ACL as ingress by specifying its ID.  |

#### Applying Egress ACL to NNI

```azurecli
az networkfabric nni update --resource-group "example-rg" --resource-name "example-nnimgmt" --fabric "examplefabric" --egress-acl-id "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accesscontrollists/example-Ipv4ingressACL"
```

| Parameter        | Description                                    |
|------------------|------------------------------------------------|
| --egress-acl-id | Apply the ACL as egress by specifying its ID. |

#### Applying Ingress and Egress ACLs to NNI:

```azurecli
az networkfabric nni update --resource-group "example-rg" --resource-name "example-nnimgmt" --fabric "examplefabric" --ingress-acl-id "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accesscontrollists/example-Ipv4ingressACL" --egress-acl-id "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accesscontrollists/example-Ipv4egressACL"
```

| Parameter         | Description                                                                                                    |
|-------------------|----------------------------------------------------------------------------------------------------------------|
| --ingress-acl-id, --egress-acl-id | To apply both ingress and egress ACLs simultaneously, create two new ACLs and include their respective IDs. |
