---
title: "Azure Operator Nexus: Network Fabric OptionA and OptionB"
description: Learn about Network Fabric OptionA and OptionB.
author: jmmason70
ms.author: jeffreymason
ms.service: azure-operator-nexus
ms.topic: concept-article
ms.date: 02/07/2025
---

# Network Fabric OptionA and OptionB 
***DRAFT***

BGP (Border Gateway Protocol) is a protocol used on the internet between routers to allow traffic to be routed between Autonomous Systems. Autonomous systems use BGP to advertise to their peers which IPs they can route to and which AS(S) they will go through to get there. For example, an ISP will advertise traffic to enter their network via their ingress points and will advertise that they know how to route to the public IPs on their network (e.g. your home), without them having to publicly share how they do that routing internally.
 
The edge routers in each Autonomous Systems will be manually configured with a set of BGP peers they trust and will only accept traffic routed from those peers.

There are 2 peering standards relevant to Nexus:

Option A: This option is simpler but less scalable than Option B, and only supports IPv4 in the standard. It can support IPv6 and multicast as well, but this is implementation dependent and not guaranteed. Nexus supports IPv4, IPv6, and multicast.

Option B: This option is more complex but supports IPv4, IPv6, and multicast in the standard. It is also more scalable than Option A.
 
For understanding, please reference the following public documents for option A and option B. 
https://learningnetwork.cisco.com/s/question/0D53i00000KsrNrCAJ/interas-option-a
https://learningnetwork.cisco.com/s/question/0D53i00000KsqS1CAJ/interas-option-b


***Access Control Lists (ACLs)*** \
ACLs (Permit & Deny) at an NNI (Network-to-Network Interface) Level protect SSH access on a Management VPN. Network Access control lists can be applied before provisioning Network Fabric. This limitation is temporary and will be removed in future release.
Ingress and Egress ACLs are created before creation of NNI resources and referenced into NNI payload. When NNI resources are created, it also creates referenced ingress and egress ACLs. This activity needs to be performed before provisioning the Network Fabric.

The following steps (with exampls) are used in creating and provisioning a Nexus Network Fabric.

1. Create Fabric
Create a Network Fabric with option A Properties

````
az networkfabric fabric create --resource-group "example-rg" --location "westus3" --resource-name "example-fabric" --nf-sku "fab1" --fabric-version "x.x.x" --nfc-id "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/example-NFC" --fabric-asn 20 --ipv4-prefix "x.x.x.x/19" --rack-count 2 --server-count-per-rack 5 --ts-config "{primaryIpv4Prefix:'x.x.0.0/30',secondaryIpv4Prefix:'x.x.x.x/30',username:'****',password:'*****',serialNumber:1234}" --managed-network-config "{infrastructureVpnConfiguration:{networkToNetworkInterconnectId:'/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkFabrics/example-fabric/networkToNetworkInterconnects/example-nni',peeringOption:OptionA,optionAProperties:{bfdConfiguration:{multiplier:5,intervalInMilliSeconds:300},mtu:1500,vlanId:520,peerASN:65133,primaryIpv4Prefix:'x.x.x.x/31',secondaryIpv4Prefix:'x.x.x.x/31'}},workloadVpnConfiguration:{networkToNetworkInterconnectId:'/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkFabrics/example-fabric/networkToNetworkInterconnects/example-nni',peeringOption:OptionA,optionAProperties:{bfdConfiguration:{multiplier:5,intervalInMilliSeconds:300},mtu:1500,vlanId:520,peerASN:65133,primaryIpv4Prefix:'x.x.x.x/31',secondaryIpv4Prefix:'x.x.x.x/31',primaryIpv6Prefix:'3FFE:FFFF:0:CD30::a0/127',secondaryIpv6Prefix:'3FFE:FFFF:0:CD30::a0/127'}}}"
````


Create a Network Fabric with option B Properties

````
az networkfabric fabric create --resource-group "example-rg" --location "westus3" --resource-name "example-fabric" --nf-sku "fab1" --fabric-version "1.x.x" --nfc-id "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkFabricControllers/example-NFC" --fabric-asn 20 --ipv4-prefix x.x.x.x/19 --rack-count 2 --server-count-per-rack 5 --ts-config "{primaryIpv4Prefix:'x.x.x.x/30',secondaryIpv4Prefix:'x.x.x.x/30',username:'****',password:'*****',serialNumber:'1234'}"
--managed-network-config "{infrastructureVpnConfiguration:{networkToNetworkInterconnectId:'/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkFabrics/example-fabric/networkToNetworkInterconnects/example-nni',peeringOption:OptionB,optionBProperties:{routeTargets:{exportIpv4RouteTargets:['65046:10039'],exportIpv6RouteTargets:['65046:10039'],importIpv4RouteTargets:['65046:10039'],importIpv6RouteTargets:['65046:10039']}}},
workloadVpnConfiguration:{networkToNetworkInterconnectId:'/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkFabrics/example-fabric/networkToNetworkInterconnects/example-nni',peeringOption:OptionB,optionBProperties:{routeTargets:{exportIpv4RouteTargets:['65046:10039'],exportIpv6RouteTargets:['65046:10039'],importIpv4RouteTargets:['65046:10039'],importIpv6RouteTargets:['65046:10039']}}}}"
````

2.  Create NNI ingress and egress ACL’s

Create ingress ACL

````
az networkfabric acl create --resource-group "example-rg" \
--location "eastus2euap"  \
--resource-name "example-Ipv4ingressACL" \
--configuration-type "Inline" \
--default-action "Permit" \
--dynamic-match-configurations "[{ipGroups:[{name:'example-ipGroup',ipAddressType:IPv4,ipPrefixes:['x.x.x.x/20']}],vlanGroups:[{name:'example-vlanGroup',vlans:['20-30']}],portGroups:[{name:'example-portGroup',ports:['100-200']}]}]" \
--match-configurations "[{matchConfigurationName:'example-match',sequenceNumber:123,ipAddressType:IPv4,matchConditions:[{etherTypes:['0x1'],fragments:['0xff00-0xffff'],ipLengths:['4094-9214'],ttlValues:[23],dscpMarkings:[32],portCondition:{flags:[established],portType:SourcePort,layer4Protocol:TCP,ports:['1-20']},protocolTypes:[TCP],vlanMatchCondition:{vlans:['20-30'],innerVlans:[30]},ipCondition:{type:SourceIP,prefixType:Prefix,ipPrefixValues:['x.x.x.x/12']}}],actions:[{type:Count,counterName:'example-counter'}]}]"
````

Create egress ACL

````
az networkfabric acl create --resource-group "example-rg"  \
--location "eastus2euap" \
--resource-name "example-Ipv4egressACL" \
--configuration-type "File" \
--acls-url "https://ACL-Storage-URL" --default-action "Permit" \
--dynamic-match-configurations "[{ipGroups:[{name:'example-ipGroup',ipAddressType:IPv4,ipPrefixes:['x.x.x.x/20']}],vlanGroups:[{name:'example-vlanGroup',vlans:['20-30']}],portGroups:[{name:'example-portGroup',ports:['100-200']}]}]"
````

3.  Create NNI (Network-to-NetworkInterface). This is completed after the fabric create but before device update and fabric provision.

````
az networkfabric nni create --resource-group "example-rg" --fabric "example-fabric" --resource-name "example-nniwithACL" --nni-type "CE" --is-management-type "True" --use-option-b "True" --layer2-configuration "{interfaces:['/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/networkDevices/example-networkDevice/networkInterfaces/example-interface'],mtu:1500}" --option-b-layer3-configuration "{peerASN:28,vlanId:501,primaryIpv4Prefix:'x.x.x.x/30',secondaryIpv4Prefix:'x.x.x.x/30',primaryIpv6Prefix:'10:2:0:124::400/127',secondaryIpv6Prefix:'10:2:0:124::402/127'}" --ingress-acl-id "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accesscontrollists/example-Ipv4ingressACL" --egress-acl-id "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxx/resourceGroups/example-rg/providers/Microsoft.ManagedNetworkFabric/accesscontrollists/example-Ipv4egressACL"
````

````
az networkfabric nni create -g < nf rg >  --resource-name < nni name > --fabric < nf name > --is-management-type "True" --use-option-b "True" --layer2-configuration "{interfaces:[ '< aggrRack CE1 ID >', '< aggrRack CE2 ID >'],mtu:1500}" --option-b-layer3-configuration "{peerASN:< peerASN number >,vlanId:< vlan number >,primaryIpv4Prefix:'< primary IPV4 prefix >',secondaryIpv4Prefix:'< secondary IPV4 prefix >',primaryIpv6Prefix:'< primary IPV6 prefix >',secondaryIpv6Prefix:'< secondary IPV6 prefix >'}"
````

4.  Update devices

````
az networkfabric device update --resource-group <example-rg> --resource-name <example-device-name> --host-name <example-device-hostname> --serial-number <NF_DEVICE_SN> --debug --no-wait
````

5.  Provision network fabric

````
az networkfabric fabric provision --resource-group <example-rg> --resource-name adp-nprd-ussc-austx55-fab --debug --no-wait
````
