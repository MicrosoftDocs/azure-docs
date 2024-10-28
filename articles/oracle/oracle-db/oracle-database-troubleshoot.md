---
title: Troubleshoot Oracle Database@Azure
description: Learn about how to troubleshoot Oracle Database@Azure.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: troubleshooting
ms.date: 08/29/2024
ms.author: jacobjaygbay
---

# Troubleshoot Oracle Database@Azure
Find troubleshooting tips for Oracle Database@Azure.

## Private DNS FQDN name can't contain more than four labels 

**Details:** When creating an Exadata VM cluster, if you select a private DNS zone whose FQDN has more than four labels (delimited by a period '.'), you get this error. For example, `a.b.c.d` is allowed, while `a.b.c.d.e` is not allowed.

**Error:**

```
Error returned by CreateCloudVmCluster operation in Database service. (400, InvalidParameter, false) domain name cannot contain more than four labels
```

**Workaround:** Rename the private DNS that caused the error, or select a different private DNS whose FQDN has 4 or fewer labels.

### Not Authorized error when private DNS with no tags is used 

**Details:**

When creating an Exadata VM cluster, if you select a private DNS zone created without any tags, the default  tag `oracle-tags` is automatically generated for the VM cluster. This might cause the following error, if the tag namespace isn't authorized in the  tenancy:

**Error:**

```
404 NotAuthorizedOrNotFound
```

**Workaround:** Add the following policies to the  tenancy:

```
Allow any user to use tag-namespaces in tenancy where request.principal.type = ‘multicloudlink’
Allow any user to manage tag-defaults in tenancy where request.principal.type = ‘multicloudlink’
```

## Microsoft  locks 
In this section, you find information about Microsoft  locks and how they can affect Oracle Database@Azure.
### Terminations and Microsoft  locks 

We recommend the removal of all Microsoft  locks to Oracle Database@Azure resources before terminating the resources. For example, if you're using a locked Microsoft  private endpoint with Oracle Database@Azure, confirm that the endpoint can be deleted, then remove the lock before deleting the Oracle Database@Azure resources. If you have a policy to prevent the deletion of locked resources, the Oracle Database@Azure work flow to delete system resources fails because Oracle Database@Azure can't delete a locked resource.

## Networking 
In this section, you'll find information about networking and how it can affect Oracle Database@Azure.
### IP address requirement differences between Oracle Database@Azure and Exadata in  OCI

IP address requirements are different between Oracle Database@Azure and Exadata in OCI. In the [Requirements for IP Address Space](https://docs.oracle.com/iaas/exadatacloud/doc/ecs-network-setup.html#ECSCM-GUID-D5C577A1-BC11-470F-8A91-77609BBEF1EA) documentation for Exadata in OCI, the following differences with the requirements of Oracle Database@Azure must be considered:

-   Oracle Database@Azure only supports Exadata X9M. All other shapes are unsupported.

-   Oracle Database@Azure reserves 13 IP addresses for the client subnet.


### Automatic network ingress configuration 

You can connect a Microsoft Azure VM to an Oracle Exadata VM cluster if both are in the same virtual network (VNet). This functionality is automatic, and requires no extra changes to network security group (NSG) rules. If you need to connect an  VM from a different VNet than the one used by the Exadata VM cluster, you must also configure NSG traffic rules to let the other VNet's traffic to flow to the Exadata VM cluster. For example, if you have 2 VNets ("A" and "B"), with VNet A serving the Microsoft Azure VM, and VNet B serving the Oracle Exadata VM cluster, you need to add VNet A's CIDR address to the NSG route table in OCI.

#### Default client NSG rules

|Direction|Source or Destination|Protocol|Details|Description|
|-----------|-----------------------|----------|---------|-------------|
| **Direction:** Egress **Stateless:** No | **Destination Type:** CIDR **Destination:** 0.0.0.0/0 | All protocols | **Allow:** All traffic for all ports | Default NSG egress rule |
| **Direction:** Ingress **Stateless:** No | **Source Type:** CIDR **Source:** Microsoft Azure VNet CIDR | TCP | **Source Port Range:** All **Destination Port Range:** All **Allow:** TCP traffic for all ports | Ingress for all TCP from Microsoft Azure VNet |
| **Direction:** Ingress **Stateless:** No | **Source Type:** CIDR **Source:** Microsoft Azure VNet CIDR | ICMP | **Type:** All **Code:** All **Allow:** ICMP traffic for all | Ingress for all ICMP from Microsoft Azure VNet |



#### Default backup NSG rules

|Direction|Source or Destination|Protocol|Details|Description|
|---------|---------------------|--------|-------|-----------|
|**Direction:** Egress **Stateless:** No |**Destination Type:** Service **Destination:**   object storage|TCP|**Source Port Range:** All **Destination Port Range:** 443 **Allow:** TCP traffic for port 443 HTTPS|Allows access to object storage| 
|**Direction:** Ingress **Stateless:** No|**Source Type:** CIDR **Source:** 0.0.0.0/0 |ICMP|  **Type:** 3 **Code:** 4 **Allow:** ICMP traffic for 3, 4 Destination Unreachable: Fragmentation needed and "Don't Fragment" was set |Allows Path MTU Discovery fragmentation messages|
