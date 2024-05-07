---
title: Delete ACLs associated with Network-to-Network Interconnects (NNI)
description: Process of deleting ACLs associated with Network-to-Network Interconnects (NNI)
author: sushantjrao 
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 04/18/2024
ms.custom: template-how-to
---

# Deleting ACLs associated with Network-to-Network Interconnects (NNI)

This document outlines the process of deleting Access Control Lists (ACLs) associated with Network-to-Network Interconnects (NNIs) within a Nexus Network Fabric.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

1. **Set subscription (if necessary):**
   
If you have multiple subscriptions and need to set one as the default, you can do so with:
   
```Azure CLI
az account set --subscription <subscription-id>
```

2. **Delete ACLs associated with NNI:**
   
To delete ACLs applied on NNI or External Network resources, pass a null value to `--ingress-acl-id` and `--egress-acl-id`.

```Azure CLI
az networkfabric nni update --resource-group "<resource-group-name>" --resource-name "<nni-name>" --fabric "<fabric-name>" --ingress-acl-id null --egress-acl-id null
```

| Parameter            | Description                                                                                      |
|----------------------|--------------------------------------------------------------------------------------------------|
| `--resource-group`   | Name of the resource group containing the network fabric instance.                              |
| `--resource-name`    | Name of the network fabric NNI (Network-to-Network Interface) to be updated.                    |
| `--fabric`           | Name of the fabric where the NNI is provisioned.                                                     |
| `--ingress-acl-id`   | Resource ID of the ingress access control list (ACL) for inbound traffic (null for no specific ACL). |
| `--egress-acl-id`    | Resource ID of the egress access control list (ACL) for outbound traffic (null for no specific ACL). |

> [!NOTE]
> Based on requirements, either the Ingress, Egress, or both can be updated.

3. **Fabric commit configuration changes:**

Execute `fabric commit-configuration` to commit the configuration changes.

```Azure CLI
az networkfabric fabric commit-configuration --resource-group "<resource-group>" --resource-name "<fabric-name>"
```

| Parameter        | Description                                                  |
|------------------|--------------------------------------------------------------|
| `--resource-group` | The name of the resource group containing the Nexus Network Fabric. |
| `--resource-name`  | The name of the Nexus Network Fabric to which the configuration changes will be committed. |

4. **Verify changes:**

Verify the changes using the `resource list` command.

### Deleting ACL associations from NNI

To disassociate only the egress ACL from an NNI, use the following command:

```Azure CLI
az networkfabric nni update --resource-group "<resource-group-name>" --resource-name "<nni-name>" --fabric "<fabric-name>" --egress-acl-id null
```

To disassociate both egress and ingress ACLs from an NNI, use the following command:

```Azure CLI
az networkfabric nni update --resource-group "<resource-group-name>" --resource-name "<nni-name>" --fabric "<fabric-name>" --egress-acl-id null --ingress-acl-id null
```

Ensure to replace placeholders with actual resource group and NNI names for accurate execution.

Example of disassociating the egress ACL from an NNI

```Azure CLI
az networkfabric nni update --resource-group "example-rg" --resource-name "example-nni" --fabric "example-fabric" --egress-acl-id null
```

Example Output:

```Output
{
    "administrativeState": "Enabled",
    "configurationState": "Accepted",
    "id": "/subscriptions/xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/examplerg/providers/microsoft.managednetworkfabric/networkfabrics/examplefabric/networkToNetworkInterconnects/example-nni",
    "ingressAclId": "/subscriptions/xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/examplerg/providers/microsoft.managednetworkfabric/accessControlLists/ingress-acl-1",
    "isManagementType": "True",
    "layer2Configuration": {
      "interfaces": [
        "/subscriptions/xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/examplerg/providers/Microsoft.ManagedNetworkFabric/networkDevices/examplefabric-AggrRack-CE1/networkInterfaces/Ethernet1-1",
        "/subscriptions/xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/examplerg/providers/Microsoft.ManagedNetworkFabric/networkDevices/examplefabric-AggrRack-CE1/networkInterfaces/Ethernet2-1",
        "/subscriptions/xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/examplerg/providers/Microsoft.ManagedNetworkFabric/networkDevices/examplefabric-AggrRack-CE2/networkInterfaces/Ethernet1-1",
        "/subscriptions/xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/examplerg/providers/Microsoft.ManagedNetworkFabric/networkDevices/examplefabric-AggrRack-CE2/networkInterfaces/Ethernet2-1"
      ],
      "mtu": 1500
    },
    "name": "example-nni",
    "nniType": "CE",
    "optionBLayer3Configuration": {
      "fabricASN": 65025,
      "peerASN": 65025,
      "primaryIpv4Prefix": "10.29.0.8/30",
      "primaryIpv6Prefix": "fda0:d59c:df01::4/127",
      "secondaryIpv4Prefix": "10.29.0.12/30",
      "secondaryIpv6Prefix": "fda0:d59c:df01::6/127",
      "vlanId": 501
    },
    "provisioningState": "Succeeded",
    "resourceGroup": "examplerg",
    "systemData": {
      "createdAt": "2023-08-07T20:40:53.9288589Z",
      "createdBy": "97fdd529-68de-4ba5-aa3c-adf86bd564bf",
      "createdByType": "Application",
      "lastModifiedAt": "2024-03-21T11:26:38.5785124Z",
      "lastModifiedBy": "user@email.com",
      "lastModifiedByType": "User"
    },
    "type": "microsoft.managednetworkfabric/networkfabrics/networktonetworkinterconnects",
    "useOptionB": "True"
}
```
