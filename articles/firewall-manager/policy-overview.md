---
title: Azure Firewall Manager policy overview
description: Learn about Azure Firewall Manager policies.
author: sujamiya
ms.service: azure-firewall-manager
services: firewall-manager
ms.topic: concept-article
ms.date: 07/09/2025
ms.author: sujamiya
ms.custom: sfi-image-nochange
---

# Azure Firewall Manager policy overview

Firewall Policy is the recommended method to configure your Azure Firewall. It's a global resource that can be used across multiple Azure Firewall instances in Secured Virtual Hubs and Hub Virtual Networks. Policies work across regions and subscriptions.

![Azure Firewall Manager policy](media/policy-overview/policy-overview.png)

## Policy creation and association

A policy can be created and managed in multiple ways, including the Azure portal, REST API, templates, Azure PowerShell, CLI and Terraform.

You can also migrate existing Classic rules from Azure Firewall using the portal or Azure PowerShell to create policies. For more information, see [How to migrate Azure Firewall configurations to Azure Firewall policy](migrate-to-policy.md). 

Policies can be associated with one or more firewalls deployed in either a Virtual WAN (creating a Secured Virtual Hub) or a Virtual Network (creating a Hub Virtual Network). Firewalls can reside in any region or subscription linked to your account.

## Classic rules and policies

Azure Firewall supports both Classic rules and policies, but policies are the recommended configuration. The following table compares policies and classic rules:


| Subject | Policy  | Classic rules |
| ------- | ------- | ----- |
|Contains     |NAT, Network, Application rules, custom DNS and DNS proxy settings, IP Groups, and Threat Intelligence settings (including allowlist), IDPS, TLS Inspection, Web Categories, URL Filtering|NAT, Network, and Application rules, custom DNS and DNS proxy settings, IP Groups, and Threat Intelligence settings (including allowlist)|
|Protects     |Virtual Hubs (VWAN) and Virtual Networks|Virtual Networks only|
|Portal experience     |Central management using Firewall Manager|Standalone firewall experience|
|Multiple firewall support     |Firewall Policy is a separate resource that can be used across firewalls|Manually export and import rules, or using third-party management solutions |
|Pricing     |Billed based on firewall association. See [Pricing](#pricing).|Free|
|Supported deployment mechanisms     |Portal, REST API, templates, Azure PowerShell, and CLI|Portal, REST API, templates, PowerShell, and CLI. |

## Basic, Standard, and Premium policies

Azure Firewall supports Basic, Standard, and Premium policies. The following table summarizes the difference between these policies:


|Policy type|Feature support  | Firewall SKU support|
|---------|---------|----|
|Basic policy|NAT rules, Network rules, Application rules<br>IP Groups<br>Threat Intelligence (alerts)|Basic
|Standard policy    |NAT rules, Network rules, Application rules<br>Custom DNS, DNS proxy<br>IP Groups<br>Web Categories<br>Threat Intelligence|Standard or Premium|
|Premium policy    |All Standard feature support, plus:<br><br>TLS Inspection<br>Web Categories<br>URL Filtering<br>IDPS|Premium


## Hierarchical policies

New firewall policies can either be created from scratch or inherited from existing policies. Inheritance allows DevOps to define local firewall policies on top of organization mandated base policies.

When a new policy is created with a non-empty parent policy, it inherits all rule collections from the parent. Both the parent and child policies must reside in the same region. However, a firewall policy, regardless of where it is stored, can be associated with firewalls in any region.

### Rule inheritance ###
Network rule collections inherited from the parent policy are always prioritized over network rule collections defined as part of a new policy. The same logic also applies to application rule collections. Regardless of inheritance, network rule collections are processed before application rule collections. 

NAT rule collections are not inherited, as they are specific to individual firewalls. If you want to use NAT rules, you must define them in the child policy.

### Threat Intelligence mode and allowlist inheritance ###
Threat Intelligence mode is also inherited from the parent policy. While you can override this setting in the child policy, it must be with a stricter mode - you cannot disable it. For example, if your parent policy is set to **Alert only**, the child policy can be set to **Alert and deny**, but not to a less strict mode.

Similarly, the Threat Intelligence allowlist is inherited from the parent policy, and the child policy can append additional IP addresses to this list.

With inheritance, any changes to the parent policy are automatically applied down to associated firewall child policies.

## Built-in high availability

High availability is built in, so there's nothing you need to configure.
You can create an Azure Firewall Policy object in any region and link it globally to multiple Azure Firewall instances under the same Entra ID tenant. If the region where you create the Policy goes down and has a paired region, the ARM(Azure Resource Manager) object metadata automatically fails over to the secondary region. During the failover, or if the single-region with no pair remains in a failed state, you can't modify the Azure Firewall Policy object. However, the Azure Firewall instances linked to the Firewall Policy continue to operate. For more information, see [Cross-region replication in Azure: Business continuity and disaster recovery](../reliability/cross-region-replication-azure.md#azure-paired-regions).

## Pricing

Policies are billed based on firewall associations. A policy with zero or one firewall association is free of charge. A policy with multiple firewall associations is billed at a fixed rate. For more information, see [Azure Firewall Manager Pricing](https://azure.microsoft.com/pricing/details/firewall-manager/).

## Next steps

- Learn how to deploy an Azure Firewall - [Tutorial: Secure your cloud network with Azure Firewall Manager using the Azure portal](secure-cloud-network.md)
- [Learn more about Azure network security](../networking/security/index.yml)

