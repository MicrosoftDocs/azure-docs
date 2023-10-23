---
title: "Azure Operator Nexus: description: AONs Network Packet Broker User Documentation."
description: AONs Network Packet Broker User Documentation.
author: jdasari
ms.author: jdasari
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 10/23/2023
ms.custom: template-concept
---


# **Network Packet Broker User Documentation**

Network Packet Broker allows operators to monitor, service traffic flows by tapping into the network. The copies of the Captured network traffic data are directed to the virtual-probes applications, which will process the data and provide insights to the customer. These insights assist various teams such as, the operations team, planning & design team with network-level visibility to aid with service planning and troubleshooting of service problems.

To enable Network Packet Broker functionality, refer to the steps in the quick start guide, see [Network Packet Broker](./howto-configure-network-packet-broker.md)


# **Network TAP RULE**


A NetworkTAP Rule has a set of matching Configurations, and each configuration has a set of match conditions and Actions. Each matching configuration has set of conditions (tuples). These conditions are treated as logical “AND” while matching the packet. Once, matching is performed and set of actions are executed which are applicable and defined under `match configuration`.

## Network TAP Rule Match Configuration
The user can define either Inline or via a file (File based approach is WIP) for each Network TAP Rule. In Inline method, values are defined using AzCli, ArmClient, Portal.

For the file-based approach, there are two Polling types supported: pull and push based mechanism.

The Pull-Mechanism uses the Polling Interval field, defined under Network TAP Rule definition. The Network TAP Rule content is retrieved periodically from a storage-url based on polling interval. Push is an event-based mechanism, which is triggered to AZURE AKS when file is updated on the storage-url. Service then fetches the Network TAP Rule content to process further.

It's recommended having a file-based approach (once available) for following reasons.
-	Ease of usage to create/update a Network TAP rule 
-	Ability to support larger set of  Match Configurations/conditions
-	Ability to support Dynamic Match Conditions with more filed-set values.
-	Usage multiple Neighbor-Groups across Network Rule Match Conditions.

Also, Network TAP Rule supports both Static Match Conditions and Dynamic Match Conditions to enable packet filtering on NPB.  Network TAP Rule supports both Static/Dynamic Match conditions or a combination as well. 

Following sections contains details on a **Network TAP Rule Match Condition**.


# Network TAP Rule Match Conditions
Network TAP Rule supports defining Static Match configuration with the multiple layer 3 tuples for both in ipv4 and ipv6 address-family. Each Network TAP Rule can have multiple match configurations with a combo of ipv4 and ipv6 address-family.

Each Match configuration can have multiple Match conditions and actions blocks. However, each match condition shall be either of type ipv4 or ipv6. All match conditions inside Match Configurations shall use Logical AND logic to perform packet filtering. The User should refer the following tuples to define a `match condition`.
-	Encapsulation Type: GTPv1
-	VlanMatch
-	ProtocolTypes
-	IPCondition
-	PortCondition

 
 
For example,

NetwrokTAPRule “NWTAPRule1” is defined as follows

NWTAPRule1
-	NWTAPRule1_M1 IPv4
            - EncapsulationType: None
	    - Set of Vlans
	    - Set of InnerVlans
	    - ProtocolType: UDP, TCP
	    - Set of Source IPConditions
	    - Set of Destination IPConditions
	    - Set of Source Port Condition
	    - Set of Destination Port Condition
-	NWTAPRule1_M2 IPv4
            - EncapsulationType: None
            - Set of Vlans
            - Set of InnerVlans
-	NWTAPRule1_M3 IPv4
             - EncapsulationType: None
             - Set of Vlans
             - ProtocolType: UDP, TCP
             - Set of Source IPConditions
             - Set of Source Port Condition
-	NWTAPRule1_M4 IPv4
             - EncapsulationType: GTPv1
             - Set of Vlans
             - Set of InnerVlans
             - Set of Source IPConditions
             - Set of Destination IPConditions

As explained, each Network TAP Rule "match configuration" (NWTAPRule1_M1) shall distinguish the matching for either ipv4 or ipv6 address-family packet.  And also, each match configuration (NWTAPRule1_M1) shall have set of match conditions and all match conditions operate with “Logical AND” condition while matching the packet contents. In case if any match condition doesn't qualify under match configuration, then device will skip that match configuration and goes to next match configuration. 

As explained in the example, Network TAP Rule “NWTAPRule1” has several match configurations for example. NWTAPRule1_M1, NWTAPRule1_M2, NWTAPRule1_M3 …etc., Each match configuration has list of match conditions. When Network TAP Rule applied on ingress traffic, it’s tries to match all match conditions under respective match configuration. If any match conditions aren't matched under match configuration, then it will go to next match configuration.

## **EncapsulationType:**
AON supports EncapsulationType “GTPv1” only under match conditions of Network TAP Rule. The GTPv1 encapsulation  is applied to the entire `match conditions` if specified. 

It's also important to note that in following example, the matchConfiguration addressType is “IPv6” and encapsulationType is “GTPv1”, the corresponding match conditions must be of IPv6 address-family.


```azurecli

  "matchConfigurationName": "TP_VPROBE_IPENCAPS_M2",
  "sequenceNumber": 20,
  "ipAddressType": "IPv6",
  "matchConditions": [ 
      {
         "encapsulationType": "GTPv1",
         "ipCondition": {
            "type": "SourceIP",
            "prefixType": "Prefix",
            "ipPrefixValues": [
                "2F::/100",
                "3F::/100"
           ]
        }
      }
   ],
   "actions": [{"type": "count"}, {"type": "drop"}]}

```

## **ProtocolType**
AON supports Protocol Type matching. Values can be defined as a range from 1-255 and as an individual protocol number. In the absence of IPProtocolType, AON will consider it as “Any” IP Protocol Type.

**Example**
```azurecli
"protocolTypes": [“1”, “5-17”, “20”, “134”]
```
## **VLAN Match Condition**

AON supports Vlan matching. Values can be defined as individual Vlans or range of Vlans (1-4094). In the absence of Vlan conditions, AON shall allow all Vlans. 

AON also supports Vlan Conditions by accepting VlanGroupName where VlanGroupName definition is part of “Dynamic Match Configuration”. AON shall not allow Array of Vlans and VlanGroups together. 

*Examples for VlanMatch Conditions with Array of Vlans*
```azurecli
**"vlanMatchCondition":** {"vlans": [“100”, “150”, “200-300”, “400”, “500-550”]}
**"vlanMatchCondition":** {"vlans": [“1000”, “2000”, “2001”, “2500”]}
**"vlanMatchCondition":** {"vlans": [“2600-2700”, “2800-3200”]}
```
*Examples for VlanMatch Conditions with VlanGroups*
```azurecli
**"vlanMatchCondition":** {"vlanGroupNames": [“vlan-fieldset-1”, “vlan-fieldset-2”]}
```
***The following example has VLAN range and VLAN groups coexisiting which is incorrect syntax.This input is invalid***
```azurecli
**"vlanMatchCondition":** {"vlans": [“100”, “150”, “200-300”, “400”, “500-550”], 
                          "vlanGroupNames": [“vlan-fieldset-1”, “vlan-fieldset-2”]}
```
## **InnerVLAN Match Condition**

AON supports Inner-Vlan conditions, which is an extension under Vlan Match conditions. One can match a packet with both inner and outer vlan, AON supports it by taking inputs under Vlans and InnerVlans in Vlan Match Conditions. AON doesn’t support direct configuration of InnerVlans without having Vlans Conditions. 

AON also supports Vlan Conditions by accepting VlanGroupName where VlanGroupName definition is part of “Dynamic Match Configuration”. AON shall not allow Array of InnerVlans and VlanGroups together. 

 
*Examples for VlanMatch Conditions with Array of Vlans*

```azurecli
"vlanMatchCondition": {"vlans": [“100”, “150”, “200-300”, “400”, “500-550”], 
                       “innerVlans”: [“300-400”, “500”, “700-800”]}
```
*Examples for VlanMatch Conditions with VlanGroups*

```azurecli
"vlanMatchCondition": {"vlanGroupNames": [“vlan-fieldset-1”, “vlan-fieldset-2”],
                       “innerVlans”: [“300-400”, “500”, “700-800”]}
```
***The following example has VLAN range and VLAN groups coexisiting which is incorrect syntax.This input is invalid***

```azurecli
"vlanMatchCondition": {"vlans": [“100”, “150”, “200-300”, “400”, “500-550”], 
                       "vlanGroupNames": [“vlan-fieldset-1”, “vlan-fieldset-2”],
		       “innerVlans”: [“300-400”, “500”, “700-800”]}
```
## ****SourceIP Match Condition****

AON supports SourceIP match conditions with PrefixType as “Prefix” and “Longest-Prefix”.   Each Match configuration has address-family IPAddressType set to either “ipv4/ipv6” and respective “ipconditions” must have ipv4 or ipv6 prefixes for `ipcondition` type as “SourceIP”. 

### **Additional Notes**
- Defining match rule with SourceIP conditions considers destinationIP as “any”, and in such a case there's no need to define any Destination IP as input.
- Ipv4 prefix must be strictly in the format of ipv6-format/<prefix-length>. varies from 0-255. Subnet-mask-length varies from 0-128.
- Ipv6 prefix must be strictly in the format of /<subnet-mask-length>. Values of each octet in a.b.c.d vary from 0-255. Subnet-mask-length varies from 0-32.
- AON also supports IP Conditions by accepting IPGroupName where IPGroupName definition is part of “Dynamic Match Configuration”. AON shall not allow Array of prefixes and `IPGroups` together. 


### Examples
```azurecli

"ipCondition": {"type": "SourceIP", "prefixType": "Prefix","ipPrefixValues": ["2.2.2.0/24","3.3.0.0/16"]}
```

```azurecli
"ipCondition": {"type": "SourceIP","prefixType": "Prefix","ipPrefixValues": [“fda0:100:200:300::/64",“fda0:200:2300::/60"]}
```
*The following example has ipv4 FieldSet as part of Dynamic Match Configuration, where each `fieldset` represents list of ipv4 addresses*

```azurecli
"ipCondition": {"type": "SourceIP","prefixType": "Prefix","ipGroupNames": [“ipv4-fieldset-1",“ ipv4-fieldset-2"]}

```
*The following example has ipv6 FieldSet as part of Dynamic Match Configuration, where each `fieldset` represents list of ipv6 addresses*

```azurecli
"ipCondition": {"type": "SourceIP","prefixType": "Prefix","ipGroupNames": [“ipv6-fieldset-1",“ ipv6-fieldset-2"]}

```
### *Following examples showcase erroneous syntax, which isn't supported*

```azurecli
"ipCondition": {"type": "SourceIP", "prefixType": "Prefix","ipPrefixValues": ["2.2.2.0/24","3.3.0.0/16"], ","ipGroupNames": [“ipv4-fieldset-1",“ ipv4-fieldset-2"]}
```
```azurecli
"ipCondition": {"type": "SourceIP","prefixType": "Prefix","ipPrefixValues": [“fda0:100:200:300::/64",“fda0:200:2300::/60"], ","ipGroupNames": [“ipv6-fieldset-1",“ ipv6-fieldset-2"]}

```

```azurecli
"ipCondition": {"type": "SourceIP","prefixType": "Prefix","ipGroupNames": [“ipv4-fieldset-1",“ ipv6-fieldset-1"]}
```
## **DestinationIP Match Condition**


AON support destination match conditions with PrefixType as “Prefix” and “Longest-Prefix”.   Each Match configuration has IPAddressType  set to  either “ipv4/ipv6” and respective “ipconditions” must have the same address family either ipv4 or ipv6 prefixes for `ipcondition` type as “DestinationIP”.

### Notes: 
- Defining match rule with DestinationIP conditions considers sourceIP as “any” and in such a case there's no need to define any Source IP as input.
- The ipv4 prefix must be strictly in the format of ipv6-format/<prefix-length>(varies from 0-255). Subnet-mask-length varies from 0-128.
- The ipv6 prefix must be strictly in the format of /<subnet-mask-length>. Values of each octet in a.b.c.d vary from 0-255. Subnet-mask-length varies from 0-32.
- AON also supports IP Conditions by accepting IPGroupName where IPGroupName definition is part of “Dynamic Match Configuration”. AON shall NOT allow Array of prefixes and `IPGroups` together. 

### Examples
```azurecli
"ipCondition": {"type": "DestinationIP", "prefixType": "Prefix","ipPrefixValues": ["2.2.2.0/24","3.3.0.0/16"]}
```


```azurecli
"ipCondition": {"type": "DestinationIP","prefixType": "Prefix","ipPrefixValues": [“fda0:100:200:300::/64",“fda0:200:2300::/60"]}

```
The following example has ipv4 FieldSet as part of Dynamic Match Configuration, where each `fieldset` represents list of ipv4 addresses,

```azurecli
"ipCondition": {"type": "DestinationIP","prefixType": "Prefix","ipGroupNames": [“ipv4-fieldset-1",“ ipv4-fieldset-2"]}

```
The following example has ipv6 FieldSet as part of Dynamic Match Configuration, where each `fieldset` represents list of ipv6 addresses,

```azurecli
"ipCondition": {"type": "DestinationIP","prefixType": "Prefix","ipGroupNames": [“ipv6-fieldset-1",“ ipv6-fieldset-2"]}

```
### *Following examples showcase erroneous syntax, which isn't supported*
```azurecli

"ipCondition": {"type": "DestinationIP", "prefixType": "Prefix","ipPrefixValues": ["2.2.2.0/24","3.3.0.0/16"], ","ipGroupNames": [“ipv4-fieldset-1",“ ipv4-fieldset-2"]}

```

```azurecli
"ipCondition": {"type": "DestinationIP","prefixType": "Prefix","ipPrefixValues": [“fda0:100:200:300::/64",“fda0:200:2300::/60"], ","ipGroupNames": [“ipv6-fieldset-1",“ ipv6-fieldset-2"]}

```

```azurecli
"ipCondition": {"type": "DestinationIP","prefixType": "Prefix","ipGroupNames": [“ipv4-fieldset-1",“ ipv6-fieldset-1"]}

```

## **SourcePort Match Condition**
AON supports Source Port Match condition with values 1-65535 and shall accept the values in string format as an array of Ports or individual Ports or range of Ports. In the absence of Ports conditions, AON shall allow all Ports. 

AON also supports Port Conditions by accepting PortGroupName where PortGroupName definition is part of “Dynamic Match Configuration”. 

**Note:** Defining match rule with Source Port conditions alone considers as Destination Port as “any”, in such case no need to define any Destination port as input. AON shall not allow Array of Ports and PortGroups together. 

***Examples***
```azurecli
"portCondition": {
"portType": "SourcePort","layer4Protocol": "TCP","ports": ["50", "301", "300-305", "350", "400-500"]}
```

*Examples for Port Conditions with PortGroups*

```azurecli
"PortCondition": {"portType": "SourcePort","layer4Protocol": "TCP","portGroupNames": [“port-fieldset-1”, “port-fieldset-2”]}
```
*Following examples showcase erroneous syntax, which isn't supported*

```azurecli
"portCondition": {
"portType": "SourcePort","layer4Protocol": "TCP","ports": ["50", "301", "300-305", "350", "400-500"], {"portGroupNames": [“port-fieldset-1”, “port-fieldset-2”]}
```
## **DestinationPort Match Condition**

AON supports Destination Port Match condition with values 1-65535. It shall accept the values as string format with array of Ports or individual Ports or range of Ports. In the absence of Ports conditions, AON shall allow all Ports. 

AON also supports Port Conditions by accepting PortGroupName where PortGroupName definition is part of “Dynamic Match Configuration”. 

**Note:** Defining match rule with Destination Port conditions alone will consider Source Port as “any”, in such case there's no explicit need to define any Source port as input. AON shall not allow Array of Ports and PortGroups together. 

### *Examples*
```azurecli 
"portCondition": {
"portType": "DestinationPort","layer4Protocol": "TCP","ports": ["50", "301", "300-305", "350", "400-500"]}
```

*Examples of Port Conditions with PortGroups*
```azurecli 
"PortCondition": {"portType": "DestinationPort","layer4Protocol": "TCP", "portGroupNames": [“port-fieldset-1”, “port-fieldset-2”]}
```


*Following examples showcase erroneous syntax, which isn't supported*
```azurecli 

"portCondition": {
"portType": "DestinationPort","layer4Protocol": "TCP","ports": ["50", "301", "300-305", "350", "400-500"], {"portGroupNames": [“port-fieldset-1”, “port-fieldset-2”]}

```

##Network TAP Rule Dynamic Configurations
 AON supports dynamic match configurations for frequently changing field sets, which are matched based on L2/L3 parameters. Port, VLAN, IP conditions and exact values can be specified under Dynamic Match configuration block. A dynamic match group can be referenced across multiple match conditions.

##Network TAP Rule Actions

The following are Network TAP Rule Actions supported for Packet Brokering Functionality.

| **Network TAP Rule Actions**| **Usage**|
|-----------------------------|----------|
|Drop |If the packet has matched based on specific conditions NPB will drop packets, and not forward it to designated endpoints|
|Count with/without Counter Name |if the packet has matched the counter under the `TAP` and `TAP Rule`. The counters will be incremented.|
|Redirect| If the packet has matched, the device will divert traffic to designated endpoints. Filtered traffic will be load balanced based on endpoint availability|
|Mirror|Packets matched will be mirrored to one or more designated endpoints when the packets are matched|
|Goto |If the packet has matched and if the goto is specified, the device will skip the sequential order of match configuration and jump to the next mentioned match configuration|
|Log (Unsupported) |Device will log the packet in defined location|

`Permit` is an implicit action, if an action isn't specified. If the packet has matched with the specified "match condition", the device shall not go to next "match conditions"unless `Goto` action is present.

