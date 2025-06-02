---
title: 'Azure Operator Nexus: Apply ACLs to Network-to-Network Interconnects'
description: Learn how to apply access control lists (ACLs) to network-to-network interconnects (NNIs) within Azure Operator Nexus Network Fabric.
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 04/23/2024
ms.custom: template-how-to, devx-track-azurecli
---

# Access control list (ACL) management for NNI

In Azure Operator Nexus Network Fabric, maintaining network security is paramount for ensuring a robust and secure infrastructure. Access control lists (ACLs) are crucial tools for enforcing network security policies. This article leads you through the process of applying ACLs to network-to-network interconnects (NNIs) within Azure Operator Nexus Network Fabric.

## Apply ACLs to NNIs in Azure Operator Nexus Network Fabric

To maintain network security and regulate traffic flow within your Azure Operator Nexus Network Fabric network, applying ACLs to NNIs is essential. This article delineates the steps for effectively applying ACLs to NNIs.

#### Apply ACLs to NNIs

Before you apply ACLs to NNIs, use the following commands to view ACL details.

#### View ACL details

To view the specifics of a particular ACL, run the following command:

```azurecli
az networkfabric acl show --name "<acl-ingress-name>" --resource-group "<resource-group-name>"
```

This command furnishes detailed information regarding the ACL's configuration, administrative state, default action, and matching conditions.

#### List ACLs in a resource group

To list all ACLs within a resource group, use the following command:

```azurecli
az networkfabric acl list --resource-group "<resource-group-name>"
```

This command presents a comprehensive list of ACLs along with their configuration states and other pertinent details.

#### Apply an ingress ACL to an NNI

```azurecli
az networkfabric nni update --resource-group "<resource-group-name>" --resource-name "<nni-name>" --fabric "<fabric-name>" --ingress-acl-id "<ingress-acl-resource-id>"
```

| Parameter         | Description                                      |
|-------------------|--------------------------------------------------|
| `--ingress-acl-id` | Apply the ACL as ingress by specifying its resource ID.  |

#### Apply an egress ACL to an NNI

```azurecli
az networkfabric nni update --resource-group "example-rg" --resource-name "<nni-name>" --fabric "<fabric-name>" --egress-acl-id "<egress-acl-resource-id>"
```

| Parameter        | Description                                    |
|------------------|------------------------------------------------|
|`--egress-acl-id` | Apply the ACL as egress by specifying its resource ID. |

#### Apply ingress and egress ACLs to NNIs

```azurecli
az networkfabric nni update --resource-group "example-rg" --resource-name "<nni-name>" --fabric "<fabric-name>" --ingress-acl-id "<ingress-acl-resource-id>" --egress-acl-id ""<egress-acl-resource-id>""
```

| Parameter         | Description                                                                                                    |
|-------------------|----------------------------------------------------------------------------------------------------------------|
| `--ingress-acl-id`, `--egress-acl-id` | To apply both ingress and egress ACLs simultaneously, create two new ACLs and include their respective resource IDs. |

## Related content

- [Update ACLs on NNIs or an external network](howto-update-access-control-list-for-network-to-network-interconnects.md)
