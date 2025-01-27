---
title: Limitations with Azure Virtual Network Manager
description: Learn about current limitations when you're using Azure Virtual Network Manager to manage virtual networks.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: concept-article
ms.date: 11/06/2024
#CustomerIntent: As a network admin, I want understand the limitations in Azure Virtual Network Manager so that I can properly deploy it my environment.
---

# Limitations with Azure Virtual Network Manager

This article provides an overview of the current limitations when you're using [Azure Virtual Network Manager](overview.md) to manage virtual networks. Understanding these limitations can help you properly deploy an Azure Virtual Network Manager instance in your environment. The article covers topics like the maximum number of virtual networks, overlapping IP spaces, and the evaluation cycle for policy compliance.

## General limitations

* [Cross-tenant support](concept-cross-tenant.md) is available only when virtual networks are assigned to network groups with static membership.

* Customers with more than 15,000 Azure subscriptions can apply an Azure Virtual Network Manager policy only at the [subscription and resource group scopes](concept-network-manager-scope.md). You can't apply management groups over the limit of 15,000 subscriptions. In this scenario, you would need to create assignments at a lower-level management group scope that have fewer than 15,000 subscriptions.

* You can't add virtual networks to a network group when the Azure Virtual Network Manager custom policy `enforcementMode` element is set to `Disabled`.

* Azure Virtual Network Manager policies don't support the standard evaluation cycle for policy compliance. For more information, see [Evaluation triggers](../governance/policy/how-to/get-compliance-data.md#evaluation-triggers).
* The move of the subscription where the Azure Virtual Network Manager instance exists to another tenant is not supported.

## Limitations for peerings and connected groups 

* A virtual network can be peered up to 1000 virtual networks using Azure Virtual Network Manager's hub and spoke topology. This means that you can peer up to 1000 spoke virtual networks to a hub virtual network.
* By default, a [connected group](concept-connectivity-configuration.md) can have up to 250 virtual networks. This is a soft limit and can be increased up to 1000 virtual networks by submitting a request using [this form](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbRzeHatNxLHpJshECDnD5QidURTM2OERMQlYxWkE1UTNBMlRNUkJUNkhDTy4u&route=shorturl).
* By default, a virtual network can be part of up to two connected groups. For example, a virtual network:
  * Can be part of two mesh configurations.
  * Can be part of a mesh topology and a network group that has direct connectivity enabled in a hub-and-spoke topology.
  * Can be part of two network groups with direct connectivity enabled in the same or a different hub-and-spoke configuration.
  * This is a soft limit and can be adjusted by submitting a request using [this form](https://forms.office.com/r/xXxYrQt0NQ).  
* The following BareMetal Infrastructures are not supported:
  * [Azure NetApp Files](../azure-netapp-files/index.yml)
  * [Azure VMware Solution](../azure-vmware/index.yml)
  * [Nutanix Cloud Clusters on Azure](../baremetal-infrastructure/workloads/nc2-on-azure/about-nc2-on-azure.md)
  * [Oracle Database@Azure](../oracle/oracle-db/oracle-database-what-is-new.md)
  * [Azure Payment HSM](/azure/payment-hsm/solution-design)
* The maximum number of private endpoints per connected group is 1000.
* You can have virtual networks with overlapping IP spaces in the same connected group. However, communication to an overlapped IP address is dropped.
* When a connected group’s VNet is peered with an external VNet that has overlapping CIDRs, these overlapping CIDRs become inaccessible within the connected group. Traffic from the peered VNet in the connected group to the overlapping CIDR is routed to the external VNet, while traffic from other VNets in the connected group to the overlapping CIDR is dropped.

## Limitations for security admin rules

* The maximum number of IP prefixes in all [security admin rules](concept-security-admins.md) combined is 1,000.
* The maximum number of admin rules in one level of Azure Virtual Network Manager is 100.
* The service tags AzurePlatformDNS, AzurePlatformIMDS, and AzurePlatformLKM are not currently supported in security admin rules.

## Related content

* [Frequently asked questions](faq.md)
