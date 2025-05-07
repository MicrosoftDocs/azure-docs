---
title: Troubleshoot Oracle Database@Azure
description: Learn how to troubleshoot problems in Oracle Database@Azure.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: troubleshooting
ms.date: 08/29/2024
ms.author: jacobjaygbay
---

# Troubleshoot problems in Oracle Database@Azure

Get troubleshooting tips for problems you might have when you use Oracle Database@Azure.

## A private DNS FQDN name can't contain more than four labels

When you create an Oracle Exadata Database@Azure virtual machine (VM) cluster, if you select a private DNS zone that has a fully qualified domain name (FQDN) that has more than four labels, you might see the following message.

### Message

```output
Error returned by CreateCloudVmCluster operation in Database service. (400, InvalidParameter, false) domain name cannot contain more than four labels
```

### Resolution

Labels are delimited by a period (`.`). For example, `a.b.c.d` is allowed, but `a.b.c.d.e` isn't allowed.

Rename the private DNS zone that caused the problem or select a private DNS zone that has an FQDN that has a maximum of four labels.

## Not Authorized error when a private DNS with no tags is used

When you create an Oracle Exadata Database@Azure VM cluster, if you select a private DNS zone that you created without any tags, the default tag `oracle-tags` is automatically generated for the VM cluster. The tags might cause the following error if the tag namespace isn't authorized in the tenancy.

### Message

```output
404 NotAuthorizedOrNotFound
```

### Resolution

To resolve the problem, add the following policies to the tenancy:

```output
Allow any user to use tag-namespaces in tenancy where request.principal.type = ‘multicloudlink’
Allow any user to manage tag-defaults in tenancy where request.principal.type = ‘multicloudlink’
```

## Microsoft locks

This section includes information about Microsoft locks and how they might affect Oracle Database@Azure deployments.

### Terminations and Microsoft locks

We recommend that you remove all Microsoft locks from an Oracle Database@Azure resource before you terminate the resource. If you have a policy to prevent the deletion of locked resources, the Oracle Database@Azure process to delete system resources fails because Oracle Database@Azure can't delete a locked resource. For example, if you're using a locked private endpoint with Oracle Database@Azure, confirm that the endpoint can be deleted, and then remove the lock before you delete the Oracle Database@Azure resource.

## Networking

This section includes information about networking and how it might affect Oracle Database@Azure.

### IP address requirement differences between Oracle Database@Azure and Oracle Exadata in OCI

Oracle Database@Azure has different IP address requirements than Oracle Exadata in Oracle Cloud Infrastructure (OCI). As described in [Requirements for IP address space](https://docs.oracle.com/iaas/exadatacloud/doc/ecs-network-setup.html#ECSCM-GUID-D5C577A1-BC11-470F-8A91-77609BBEF1EA), the following differences in IP address requirements for Oracle Database@Azure must be considered:

- Oracle Database@Azure supports only Oracle Exadata X9M. All other shapes are unsupported.

- Oracle Database@Azure reserves 13 IP addresses for the client subnet.

### Automatic network ingress configuration

You can connect an Azure VM to an Oracle Exadata Database@Azure VM cluster if both VMs are in the same virtual network (VNet). This functionality is automatic and requires no extra changes to network security group rules. If you need to connect a VM from a different VNet than the one used by the Oracle Exadata Database@Azure VM cluster, you must also configure network security group traffic rules to let the other VNet's traffic to flow to the Oracle Exadata Database@Azure VM cluster. For example, you have two VNets ("A" and "B"). VNet A serves the Azure VM and VNet B serves the Oracle Exadata Database@Azure VM cluster. For network ingress, you must add VNet A's Classless Inter-Domain Routing (CIDR) address to the network security group route table in OCI.

#### Default client network security group rules

| Direction | Source or destination | Protocol | Details | Description |
|-----------|-----------------------|----------|---------|-------------|
| **Direction**: Egress<br />**Stateless**: No | **Destination type**: CIDR<br />**Destination**: 0.0.0.0/0 | All protocols | **Allow**: All traffic for all ports | Default network security group egress rule |
| **Direction**: Ingress<br />**Stateless**: No | **Source type**: CIDR<br />**Source**: Azure virtual network CIDR | TCP | **Source port range**: All<br />**Destination port range**: All<br />**Allow**: TCP traffic for all ports | Ingress for all TCP from an Azure virtual network |
| **Direction**: Ingress<br />**Stateless**: No | **Source type**: CIDR<br />**Source**: Azure virtual network CIDR | ICMP | **Type**: All<br />**Code**: All<br />**Allow**: ICMP traffic for all | Ingress for all ICMP from an Azure virtual network |

#### Default backup network security group rules

| Direction | Source or destination | Protocol | Details | Description |
|---------|---------------------|--------|-------|-----------|
| **Direction**: Egress<br />**Stateless**: No | **Destination type**: Service<br />**Destination**: Object storage | TCP |**Source port range**: All<br />**Destination port range**: 443<br />**Allow**: TCP traffic for port 443 HTTPS | Allows access to object storage |
| **Direction**: Ingress<br />**Stateless**: No | **Source type**: CIDR<br />**Source**: 0.0.0.0/0 | ICMP | **Type**: 3<br />**Code**: 4<br />**Allow**: ICMP traffic for 3, 4 Destination Unreachable: Fragmentation needed and "Don't Fragment" was set | Allows path maximum transmission unit (MTU) discovery fragmentation messages |
