---
title: Troubleshoot Oracle Database@Azure
description: Learn about how to troubleshoot problems in Oracle Database@Azure.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: troubleshooting
ms.date: 08/29/2024
ms.author: jacobjaygbay
---

# Troubleshoot problems in Oracle Database@Azure

Get troubleshooting tips for problems you might have when you use Oracle Database@Azure.

## Private DNS FQDN name can't contain more than four labels

### Details

When you create an Oracle Exadata Database@Azure virtual machine (VM) cluster, if you select a private DNS zone that has a fully qualified domain name (FQDN) that has more than four labels, you might see this message. Labels are delimited by a period (`.`). For example, `a.b.c.d` is allowed, but `a.b.c.d.e` is not allowed.

### Message

```output
Error returned by CreateCloudVmCluster operation in Database service. (400, InvalidParameter, false) domain name cannot contain more than four labels
```

### Resolution

Rename the private DNS zone that caused the problem or select a private DNS zone that has an FQDN that has no more than four labels.

## Not Authorized error when private DNS with no tags is used

### Details

When creating an Exadata VM cluster, if you select a private DNS zone created without any tags, the default tag `oracle-tags` is automatically generated for the VM cluster. This might cause the following error, if the tag namespace isn't authorized in the tenancy:

### Message

```output
404 NotAuthorizedOrNotFound
```

### Resolution

To resolve the problem, sdd the following policies to the tenancy:

```output
Allow any user to use tag-namespaces in tenancy where request.principal.type = ‘multicloudlink’
Allow any user to manage tag-defaults in tenancy where request.principal.type = ‘multicloudlink’
```

## Microsoft locks

In this section, you find information about Microsoft locks and how they can affect Oracle Database@Azure.

### Terminations and Microsoft locks

We recommend the removal of all Microsoft locks to Oracle Database@Azure resources before terminating the resources. For example, if you're using a locked Microsoft private endpoint with Oracle Database@Azure, confirm that the endpoint can be deleted, then remove the lock before deleting the Oracle Database@Azure resources. If you have a policy to prevent the deletion of locked resources, the Oracle Database@Azure work flow to delete system resources fails because Oracle Database@Azure can't delete a locked resource.

## Networking

In this section, you'll find information about networking and how it can affect Oracle Database@Azure.

### IP address requirement differences between Oracle Database@Azure and Exadata in OCI

IP address requirements are different between Oracle Database@Azure and Exadata in OCI. In [Requirements for IP address space](https://docs.oracle.com/iaas/exadatacloud/doc/ecs-network-setup.html#ECSCM-GUID-D5C577A1-BC11-470F-8A91-77609BBEF1EA) for Exadata in OCI, the following differences with the requirements of Oracle Database@Azure must be considered:

- Oracle Database@Azure only supports Exadata X9M. All other shapes are unsupported.

- Oracle Database@Azure reserves 13 IP addresses for the client subnet.

### Automatic network ingress configuration

You can connect an Azure VM to an Oracle Exadata VM cluster if both are in the same virtual network (VNet). This functionality is automatic, and requires no extra changes to network security group (NSG) rules. If you need to connect an VM from a different VNet than the one used by the Exadata VM cluster, you must also configure NSG traffic rules to let the other VNet's traffic to flow to the Exadata VM cluster. For example, if you have two VNets ("A" and "B"), with VNet A serving the Microsoft Azure VM, and VNet B serving the Oracle Exadata VM cluster, you need to add VNet A's CIDR address to the NSG route table in OCI.

#### Default client network security group rules

| Direction | Source or destination | Protocol | Details | Description |
|-----------|-----------------------|----------|---------|-------------|
| **Direction:** Egress **Stateless:** No | **Destination type:** CIDR **Destination:** 0.0.0.0/0 | All protocols | **Allow:** All traffic for all ports | Default NSG egress rule |
| **Direction:** Ingress **Stateless:** No | **Source type:** CIDR **Source:** Microsoft Azure VNet CIDR | TCP | **Source port range:** All **Destination port range:** All **Allow:** TCP traffic for all ports | Ingress for all TCP from an Azure virtual network |
| **Direction:** Ingress **Stateless:** No | **Source type:** CIDR **Source:** Azure virtual network CIDR | ICMP | **Type:** All **Code:** All **Allow:** ICMP traffic for all | Ingress for all ICMP from an Azure virtual network |

#### Default backup network security group rules

| Direction | Source or destination | Protocol | Details | Description |
|---------|---------------------|--------|-------|-----------|
| **Direction:** Egress **Stateless:** No | **Destination type:** Service **Destination:** object storage | TCP |**Source port range:** All **Destination port range:** 443 **Allow:** TCP traffic for port 443 HTTPS | Allows access to object storage |
| **Direction:** Ingress **Stateless:** No | **Source type:** CIDR **Source:** 0.0.0.0/0 | ICMP | **Type:** 3 **Code:** 4 **Allow:** ICMP traffic for 3, 4 Destination Unreachable: Fragmentation needed and "Don't Fragment" was set | Allows path MTU discovery fragmentation messages |
