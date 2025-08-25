---
title: Cluster Template Reference - Endpoints
description: Read a reference guide for input endpoints to be used with Azure CycleCloud. See an attribute reference and an example.
author: adriankjohnson
ms.date: 06/29/2025
ms.author: adjohnso
ms.custom: compute-evergreen
---

# Input endpoint

Input endpoint objects have a lower rank than `node` and `nodearray`. Use an input endpoint to expose ports inside a virtual machine scale set and to configure the network security group on a node.

## Example

The `[[[input-endpoint]]]` configuration works if you define a NIC with a public interface. If you don't define a NIC with a public interface, all communication happens over a private network and default NSG rules apply.

If you operate on a public interface, adding a `[[[input-endpoint]]]` section to a node creates and attaches a Network Security Group to the node with an *allow* rule specified by the object configurations.

When you include `[[[input-endpoint]]]` on a `nodearray`, it forwards ports on the VMSS load balancer to the constituent VMs and adds an allow rule for the public port.

``` ini
[cluster my-cluster]
  [[node defaults]]
    Credentials = $Credentials
    SubnetId = $SubnetId
    MachineType = $MachineType
    ImageName = $ImageName

    [[[network-interface]]]
      AssociatePublicIpAddress = true

  [[node my-node]]
    [[[input-endpoint my-endpoint]]]
      PublicPort = 22

  [[nodearray my-array]]  
     [[[input-endpoint my-endpoint]]]
      PrivatePort = 443
      PublicPort = 30000
```

Attribute values that start with `$` reference parameters.

For this example cluster, you can access `my-node` from the public internet on port 22 through TCP. You can access the first VM created in the `my-array` VMSS from the public internet at port 30000, which redirects to port 443 on the VM. The next VM you start has port 30001 on the public interface, which redirects to port 443.

If you don't include the `[[[network-interface]]]` in this template, the `[[[input-endpoint]]]` objects are ignored.

## Attribute Reference

Attribute | Type | Definition
------ | ----- | ----------
PublicPort | Integer | Port on public interface to allow all traffic. The starting value for VMSS increments for each VM added.
PrivatePort | Integer | Port to receive public port redirection for VMSS load balancer.
Protocol | String | [tcp, udp] Default: `tcp`.
