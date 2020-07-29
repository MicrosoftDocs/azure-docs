---
title: Cluster Template Reference - Endpoints
description: Read a reference guide for input endpoints to be used with Azure CycleCloud. See an attribute reference and an example.
author: adriankjohnson
ms.date: 03/10/2020
ms.author: adjohnso
---

# Input-Endpoint

Input-Endpoint objects are subordinate in rank to `node` and `nodearray`. Input-endpoint is a control for exposing ports inside of a VM ScaleSet and for configuring Network Security Group on a node.

## Example

The `[[[input-endpoint]]]` configuration is effective if a NIC is defined with a public interface. If not, it is assumed that all communication is over a private network and default NSG rules are valid.

If operating on a public interface a `[[[input-endpoint]]]` section to a node will create and attach a Network Security Group to the node with an *allow* rule specified by the object configurations.  

In the case that `[[[input-endpoint]]]` is included on a `nodearray`, it will forward ports on the VMSS load balancer to the constituent VMs as well as adding an allow rule for the public port.

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

Attribute values that begin with `$` are referencing parameters.

For this example cluster, `my-node` will be accessible from the public internet on port 22 via TCP. The first VM created in `my-array` VMSS will be accessible on the public internet at port 30000, which redirects to port 443 on the VM.
The next VM to be started will have port 30001 on the public interface, redirected to port 443.

If this template did not include the `[[[network-interface]]]`, the `[[[input-endpoint]]]` objects would be ignored.

## Attribute Reference

Attribute | Type | Definition
------ | ----- | ----------
PublicPort | Integer | Port on public interface to allow to all traffic.  Starting value for VMSS will increment for each VM added.
PrivatePort | Integer | Port to receive public port redirection for VMSS load balancer.
Protocol | String | [tcp, udp] Default: `tcp`.
