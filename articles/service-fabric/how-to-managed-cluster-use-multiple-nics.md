---
title: Use multiple network interface cards in a Service Fabric Managed Cluster
description: Learn how to create node types with multiple virtual NICs in Service Fabric managed clusters.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 10/05/2023
---

# Use multiple network interface cards in a Service Fabric managed cluster

Service Fabric managed cluster allows you to create node types with multiple virtual [network interface cards (NICs)](../virtual-network/virtual-network-network-interface.md). The NICs are attached to each virtual machine (VM) of the virtual machine scale set that backs the node type. A common use case is having different subnets for front-end and back-end connectivity. You can associate multiple NICs on a node type with multiple subnets, but all those subnets must be part of the same virtual network. Another use case is to enable the creation of multiple public IPs per node. Keep in mind that different VM sizes support varying numbers of NICs, so choose your VM size accordingly.

## Prerequisites

You must use Service Fabric API version 2023-09-01-preview or later.

## Limitations

* Only secondary node types support using multiple NICs.
* Currently, only ARM template deployment allows the configuration of multiple NICs.
* Adding and removing NICs from an existing node type is currently not supported, but updates are supported.
* Specifying different subnets per NIC is currently only supported for a [bring your own virtual network scenario](how-to-managed-cluster-networking#bring-your-own-virtual-network).
* Only the creation of secondary NICs is supported when using multiple NICs in your cluster.
For more information, see [Configure network settings for Service Fabric managed clusters](./how-to-managed-cluster-networking.md#bring-your-own-virtual-network)

## Use multiple NICs in your managed cluster

The following section describes the steps that should be taken to use multiple NICs in a Service Fabric managed cluster node type.

1. Modify your deployment template to include the following new property in the `Microsoft.ServiceFabric/managedclusters/nodetypes` resource under the `properties` section:

   ```json
   "additionalNetworkInterfaceConfigurations": [
     {
       "name": "string",
       "enableAcceleratedNetworking": "bool",
       "dscpConfiguration": {
         "id": "string"
       },
       "ipConfigurations": [
         {
           "name": "string",
           "applicationGatewayBackendAddressPools": [
             {
               "id": "string"
             }
           ],
           "loadBalancerBackendAddressPools": [
             {
               "id": "string"
             }
           ],
           "loadBalancerInboundNatPools": [
             {
               "id": "string"
             }
           ],
           "subnet": {
             "id": "string"
           },
           "privateIPAddressVersion": "string",
           "publicIPAddressConfiguration": {
             "name": "string",
       "ipTags": [
               {
                 "ipTagType": "string",
                 "ipTag": "string"
               }
             ],
             "publicIPAddressVersion": "string"
           }
         }
       ]
     }
   ]
   ```

   At a minimum, the following properties must be defined:

   ```json
   "additionalNetworkInterfaceConfigurations": [
     {
       "name": "string",
       "ipConfigurations": [
         {
           "name": "string"
         }  
       ]
     }
   ]
   ```

   > [!NOTE]
   > If a subnet identification is not specified in the `ipConfigurations.subnet.id` property, the NIC will use the default subet of the node type.

   > [!NOTE]
   > The following node type properties only aply to primary NIC of the node type:
   >   * `enableNodePublicIP`
   >   * `enableNodePublicIPv6`
   >   * `enableAcceleratedNetworking`

1. Deploy your node type resource.

1. Verify the NICs are active with one of the following methods:
   1. You can use the Azure CLI `az vmss nic` suite of commands to get the details of the active NICs.
   1. Log onto one of the virtual machines backing the node type, open the console, and use the `ipconfig /all` command to verify the NICs are active.
   1. Log onto one of the virtual machines backing the node type, open the search bar, and enter `View Network Connections` to summon an interface where you can view the active NICs.

## Next steps

* [Service Fabric managed cluster networking options](how-to-managed-cluster-networking.md)
* [Service Fabric managed cluster configuration options](how-to-managed-cluster-configuration.md)
* [Service Fabric managed clusters overview](overview-managed-cluster.md)