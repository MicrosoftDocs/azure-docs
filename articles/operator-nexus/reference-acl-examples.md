---
title: Azure Operator Nexus Access Control Lists Examples
description: Examples of configuring and creating Azure Operator Nexus Access Control Lists.
author: joemarshallmsft
ms.author: joemarshall
ms.service: azure-operator-nexus
ms.custom: devx-track-azurecli
ms.topic: reference
ms.date: 02/09/2024
---

# Access Control List Creation and Configuration Examples

This article gives examples of how to create and update Access Control Lists (ACLS).

## Overview of the ACL create flow

Creating an Access Control List (ACL) associated with a Network-to-Network Interconnect (NNI) involves these steps:

-   Create a Network Fabric resource and add an NNI child resource to it.

-   Create ingress and egress ACL resources using the `az networkfabric acl create` command. You can provide match configurations and the default action for the ACL. You can also provide dynamic match configurations either inline, or in a file stored in your Azure storage account blob container.

-   Update the NNI resource with the ingress and egress ACL IDs using the `az networkfabric nni update` command. You need to provide valid ACL resource IDs in the `--ingress-acl-id` and `--egress-acl-id` parameters.

-   Provision the Network Fabric resource using the `az networkfabric fabric provision` command. This generates the base configuration and the dynamic match configuration for the ACLs and sends them to the devices.

## Overview of the ACL update flow

-   Create ingress and egress ACL resources using `az networkfabric acl create` as described in the previous section.

-   Update the ingress or egress ACL using the `az networkfabric acl update` command.

-   Verify the configuration state of the ACL is `accepted`.

-   Verify the configuration state of the fabric is `accepted`.

-   Execute Fabric Commit to update the ACL.

## Example commands

### Access Control list on a Network-to-Network Interconnect

This example shows you how to create an NNI with two ACLs - one for ingress and one for egress.

The ACLs must be applied before provisioning the Network Fabric. This limitation is temporary and will be removed in future release. The ingress and egress ACLs are created before the NNI resource and referenced when the NNI is created, which also triggers the creation of the ACLs. This configuration must be done before provisioning the network fabric.

#### Create ingress ACL: example command

```azurecli
az networkfabric acl create \
    --resource-group "example-rg"
    --location "eastus2euap" \
    --resource-name "example-Ipv4ingressACL" \
    --configuration-type "Inline" \
    --default-action "Permit" \
    --dynamic-match-configurations "[{ipGroups:[{name:'example-ipGroup',ipAddressType:IPv4,ipPrefixes:['10.20.3.1/20']}],vlanGroups:[{name:'example-vlanGroup',vlans:['20-30']}],portGroups:[{name:'example-portGroup',ports:['100-200']}]}]" \
    --match-configurations "[{matchConfigurationName:'example-match',sequenceNumber:123,ipAddressType:IPv4,matchConditions:[{etherTypes:['0x1'],fragments:['0xff00-0xffff'],ipLengths:['4094-9214'],ttlValues:[23],dscpMarkings:[32],portCondition:{flags:[established],portType:SourcePort,layer4Protocol:TCP,ports:['1-20']},protocolTypes:[TCP],vlanMatchCondition:{vlans:['20-30'],innerVlans:[30]},ipCondition:{type:SourceIP,prefixType:Prefix,ipPrefixValues:['10.20.20.20/12']}}],actions:[{type:Count,counterName:'example-counter'}]}]"
```

#### Create egress ACL: example command

```azurecli
az networkfabric acl create \
    --resource-group "example-rg" \
    --location "eastus2euap" \
    --resource-name "example-Ipv4egressACL" \
    --configuration-type "File" \
    --acls-url "https://ACL-Storage-URL" \
    --default-action "Permit" \
    --dynamic-match-configurations "[{ipGroups:[{name:'example-ipGroup',ipAddressType:IPv4,ipPrefixes:['10.20.3.1/20']}],vlanGroups:[{name:'example-vlanGroup',vlans:['20-30']}],portGroups:[{name:'example-portGroup',ports:['100-200']}]}]"
```

### Access Control List on an isolation domain external network

Use the `az networkfabric acl create` command to create ingress and egress ACLs for the external network. In the example, we specify the resource group, name, location, network fabric ID, external network ID, and other parameters. You can also specify the match conditions and actions for the ACL rules using the `--match` and `--action` parameters.

This command creates an ingress ACL named `acl-ingress` that allows ICMP traffic from any source to the external network:

```azurecli
az networkfabric acl create \
    --resource-group myResourceGroup \
    --name acl-ingress \
    --location eastus \
    --network-fabric-id /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.NetworkFabric/networkFabrics/myNetworkFabric \
    --external-network-id /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.NetworkFabric/externalNetworks/ext-net \
    --match "ip protocol icmp" \
    --action allow
```

Use the `az networkfabric externalnetwork update` command to update the external network with the resource group, name, and network fabric ID. You also need to specify the ingress and egress ACL IDs using the `--ingress-acl-id` and `--egress-acl-id` parameters. For example, the following command updates the external network named `ext-net` to reference the ingress ACL named `acl-ingress`:

```azurecli
az networkfabric externalnetwork update \
    --resource-group myResourceGroup \
    --name ext-net \
    --network-fabric-id /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.NetworkFabric/networkFabrics/myNetworkFabric \
    --ingress-acl-id /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.NetworkFabric/acls/acl-ingress
```

### More example scenarios and commands

To create an egress ACL for an NNI that denies all traffic except for HTTP and HTTPS, you can use this command:

```azurecli
az networkfabric acl create \
    --name acl-egress \
    --resource-group myResourceGroup \
    --nni-id /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.NetworkFabric/networkInterfaces/myNni \
    --match "ip protocol tcp destination port 80 or 443" \
    --action allow \
    --default-action deny
```

To update an existing ACL to add a new match condition and action, you can use this command:

```azurecli
az networkfabric acl update \
    --name acl-ingress \
    --resource-group myResourceGroup \
    --match "ip protocol icmp" \
    --action allow \
    --append-match-configurations
```

To list all the ACLs in a resource group, you can use this command:

```azurecli
az networkfabric acl list --resource-group myResourceGroup
```

To show the details of a specific ACL, you can use this command:

```azurecli
az networkfabric acl show \
    --name acl-ingress \
    --resource-group myResourceGroup
```

To delete an ACL, you can use this command:

```azurecli
az networkfabric acl delete \
    --name acl-egress \
    --resource-group myResourceGroup
```
