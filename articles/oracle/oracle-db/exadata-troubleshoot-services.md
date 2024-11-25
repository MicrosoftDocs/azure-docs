---
title: Troubleshoot Exadata services
description: Learn about how to Troubleshoot for Exadata services.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: concept-article
ms.service: oracle-on-azure
ms.date: 08/01/2024
---

# Troubleshoot Exadata services

Use the information in this article to resolve common errors and provisioning issues in your Oracle Database@Azure environments.

The issues covered in this guide don't cover general issues related to Oracle Database@Azure configuration, settings, and account setup. For more information on those articles, see [Oracle Database@Azure Overview](https://docs.oracle.com/iaas/Content/multicloud/oaaoverview.htm).

## Terminations and Microsoft Azure locks

Oracle advises removal of all Microsoft Azure locks to Oracle Database@Azure resources before terminating the resource. For example, if you created a Microsoft Azure private endpoint, you should remove that resource first. If you have a policy to prevent the deletion of locked resources, the Oracle Database@Azure workflow to delete the resource fails because Oracle Database@Azure can't delete the lock.

## IP Address Requirement Differences

There are IP address requirement differences between Oracle Database@Azure and Oracle Cloud Infrastructure (OCI). In the [Requirements for IP Address Space](https://docs.oracle.com/iaas/exadatacloud/exacs/ecs-network-setup.html#GUID-D5C577A1-BC11-470F-8A91-77609BBEF1EA) documentation, the following changes for Oracle Database@Azure must be considered.
* Oracle Database@Azure only supports Exadata X9M. All other shapes are unsupported.
* Oracle Database@Azure reserves 13 IP addresses for the client subnet versus 3 for OCI requirements.

## Private DNS Zone Limitation

When provisioning Exadata Services, a private DNS zone can only select zones with four labels or less. For example, a.b.c.d is allowed, while a.b.c.d.e is not allowed.

## Automatic Network Ingress Configuration

You can connect a Microsoft Azure VM to an Oracle Exadata VM Cluster if both are in the same virtual network (VNet). The functionality is automatic and requires no additional changes to network security group (NSG) rules. If you need to connect a Microsoft Azure VM from a different VNet than the one where the Oracle Exadata VM Cluster was created, an additional step to configure NSG traffic rules to allow the other VNet's traffic to flow properly. As an example, if you have two (2) VNets (A and B) with VNet A serving the Microsoft Azure VM and VNet B serving the Oracle Exadata VM Cluster, you need to add VNet A's CIDR address to the NSG route table in OCI.

| Direction | Source or Destination | Protocol | Details | Description |
| --------- | --------------------- | -------- | ------- | ----------- |
| Direction: Egress <br /> Stateless: No | Destination Type: CIDR <br /> Destination: 0.0.0.0/0 | All Protocols | Allow: All traffic for all ports | Default NSG egress rule |
| Direction: Ingress <br /> Stateless: No | Source Type: CIDR <br /> Source: Microsoft Azure VNet CIDR | TCP | Source Port Range: All <br /> Destination Port Range: All <br /> Allow: TCP traffic for ports: All | Ingress all TCP from Microsoft Azure VNet. |
| Direction: Ingress <br /> Stateless: No | Source Type: CIDR <br /> Source: Microsoft AzureVNet CIDR | ICMP | Type: All <br /> Code: All <br /> Allow: ICMP traffic for: All | Ingress all ICMP from Microsoft Azure VNet. |

| Direction | Source or Destination | Protocol | Details | Description |
| --------- | --------------------- | -------- | ------- | ----------- |
| Direction: Egress <br /> Stateless: No | Destination Type: Service <br /> Destination: OCI IAD object storage | TCP | Source Port Range: All <br /> Destination Port Range: 443 <br /> Allow: TCP traffic for ports: 443 HTTPS | Allows access to object storage. |
| Direction: Ingress <br /> Stateless: No | Source Type: CIDR <br /> Source: 0.0.0.0/0 | ICMP | Type: 3 <br /> Code: 4 <br /> Allow: ICMP traffic for: 3, 4 Destination Unreachable: Fragmentation Needed and Don't Fragment was Set | Allows Path MTU Discovery fragmentation messages. |
