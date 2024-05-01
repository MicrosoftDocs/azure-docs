---
title: "Azure Operator Nexus: Create Access Control Lists (ACLs) for network-to-network interconnects and layer 3 isolation domain external networks "
description: Create ACLs for network-to-network interconnects and layer 3 isolation domain external networks.
author: sushantjrao 
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 04/18/2024
ms.custom: template-how-to
---

# Creating Access Control List (ACL) management for NNI and layer 3 isolation domain external networks

Access Control Lists (ACLs) are a set of rules that regulate inbound and outbound packet flow within a network. Azure's Nexus Network Fabric service offers an API-based mechanism to configure ACLs for network-to-network interconnects and layer 3 isolation domain external networks. This guide outlines the steps to create ACLs.

## Creating Access Control Lists (ACLs)

To create an ACL and define its properties, you can utilize the `az networkfabric acl create` command. Below are the steps involved:

 [!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

1. **Set subscription (if necessary):**
 
If you have multiple subscriptions and need to set one as the default, you can do so with:
 
```Azure CLI
az account set --subscription <subscription-id>
```

2. **Create ACL:**

```Azure CLI
    az networkfabric acl create --resource-group "<resource-group>" --location "<location>" --resource-name "<acl-name>" --annotation "<annotation>" --configuration-type "<configuration-type>" --default-action "<default-action>" --match-configurations "[{matchConfigurationName:<match-config-name>,sequenceNumber:<sequence-number>,ipAddressType:<IPv4/IPv6>,matchConditions:[{ipCondition:{type:<SourceIP/DestinationIP>,prefixType:<Prefix/Exact>,ipPrefixValues:['<ip-prefix1>', '<ip-prefix2>', ...]}}],actions:[{type:<Action>}]}]"
```

| Parameter            | Description                                                          |
|----------------------|----------------------------------------------------------------------|
| Resource Group       | Specify the resource group of your network fabric.                   |
| Location             | Define the location where the ACL is created.                   |
| Resource Name        | Provide a name for the ACL.                                          |
| Annotation           | Optionally, add a description or annotation for the ACL.            |
| Configuration Type   | Specify whether the configuration is inline or by using a file.     |
| Default Action       | Define the default action to be taken if no match is found.          |
| Match Configurations| Define the conditions and actions for traffic matching.              |
| Actions              | Specify the action to be taken based on match conditions.            |


## Parameters usage guidance

The table below provides guidance on the usage of parameters when creating ACLs:

| Parameter              | Description                                                | Example or Range                |
|------------------------|------------------------------------------------------------|---------------------------------|
| defaultAction          | Defines default action to be taken                         | "defaultAction": "Permit"      |
| resource-group         | Resource group of network fabric                           | nfresourcegroup                 |
| resource-name          | Name of ACL                                                | example-ingressACL              |
| vlanGroups             | List of VLAN groups                                        |                                 |
| vlans                  | List of VLANs that need to be matched                      |                                 |
| match-configurations   | Name of match configuration                                | example_acl                     |
| matchConditions        | Conditions required to be matched                          |                                 |
| ttlValues              | TTL [Time To Live]                                         | 0-255                           |
| dscpMarking            | DSCP Markings that need to be matched                      | 0-63                            |
| portCondition          | Port condition that needs to be matched                    |                                 |
| portType               | Port type that needs to be matched                         | Example: SourcePort             |
| protocolTypes          | Protocols that need to be matched                          | [tcp, udp, range[1-2, 1, 2]]    |
| vlanMatchCondition     | VLAN match condition that needs to be matched              |                                 |
| layer4Protocol         | Layer 4 Protocol                                           | should be either TCP or UDP     |
| ipCondition            | IP condition that needs to be matched                      |                                 |
| actions                | Action to be taken based on match condition                | Example: permit                 |
| configuration-type     | Configuration type (inline or file)                        | Example: inline                 |

> [!NOTE]
> - Inline ports and inline VLANs are statically defined using azcli.<br>
> - PortGroupNames and VlanGroupNames are dynamically defined.<br>
> - Combining inline ports with portGroupNames is not allowed, similarly for inline VLANs and VLANGroupNames.<br>
> - IPGroupNames and IpPrefixValues cannot be combined.<br>
> - Egress ACLs do not support certain options like IP options, IP length, fragment, ether-type, DSCP marking, and TTL values.<br>
> - Ingress ACLs do not support the following options: etherType.<br>

### Example payload for ACL creation

```Azure CLI
az networkfabric acl create --resource-group "example-rg" --location "eastus2euap" --resource-name "example-Ipv4ingressACL" --annotation "annotation" --configuration-type "Inline" --default-action "Deny" --match-configurations "[{matchConfigurationName:example-match,sequenceNumber:1110,ipAddressType:IPv4,matchConditions:[{ipCondition:{type:SourceIP,prefixType:Prefix,ipPrefixValues:['10.18.0.124/30','10.18.0.128/30','10.18.30.16/30','10.18.30.20/30']}},{ipCondition:{type:DestinationIP,prefixType:Prefix,ipPrefixValues:['10.18.0.124/30','10.18.0.128/30','10.18.30.16/30','10.18.30.20/30']}}],actions:[{type:Count}]}]"
```

### Example output

```json
{
  "administrativeState": "Disabled",
  "annotation": "annotation",
  "configurationState": "Succeeded",
  "configurationType": "Inline",
  "defaultAction": "Deny",
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/Fab3LabNF-4-0/providers/Microsoft.ManagedNetworkFabric/accessControlLists/L3domain091123-Ipv4egressACL",
  "location": "eastus2euap",
  "matchConfigurations": [
    {
      "actions": [
        {
          "type": "Count"
        }
      ],
      "ipAddressType": "IPv4",
      "matchConditions": [
        {
          "ipCondition": {
            "ipPrefixValues": [
              "10.18.0.124/30",
              "10.18.0.128/30",
              "10.18.30.16/30",
              "10.18.30.20/30"
            ],
            "prefixType": "Prefix",
            "type": "SourceIP"
          }
        },
        {
          "ipCondition": {
            "ipPrefixValues": [
              "10.18.0.124/30",
              "10.18.0.128/30",
              "10.18.30.16/30",
              "10.18.30.20/30"
            ],
            "prefixType": "Prefix",
            "type": "DestinationIP"
          }
        }
      ],
      "matchConfigurationName": "example-Ipv4ingressACL ",
      "sequenceNumber": 1110
    }
  ],
  "name": "example-Ipv4ingressACL",
  "provisioningState": "Succeeded",
  "resourceGroup": "Fab3LabNF-4-0",
  "systemData": {
    "createdAt": "2023-09-11T10:20:20.2617941Z",
    "createdBy": "user@email.com",
    "createdByType": "User",
    "lastModifiedAt": "2023-09-11T10:20:20.2617941Z",
    "lastModifiedBy": "user@email.com",
    "lastModifiedByType": "User"
  },
  "type": "microsoft.managednetworkfabric/accesscontrollists"
}
```

> [!NOTE]
> After creating the ACL, make sure to note down the ACL reference ID for further reference.


## Next Steps

[Applying Access Control Lists (ACLs) to NNI in Azure Fabric](howto-apply-access-control-list-to-network-to-network-interconnects.md)
