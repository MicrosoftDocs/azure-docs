---
title: Azure Firewall Manager policy overview
description: Learn about Azure Firewall Manager policies.
author: duongau
ms.service: azure-firewall-manager
services: firewall-manager
ms.topic: concept-article
ms.date: 03/06/2024
ms.author: duau
---

# Azure Firewall Manager policy overview

Firewall Policy is the recommended method to configure your Azure Firewall. It's a global resource that can be used across multiple Azure Firewall instances in Secured Virtual Hubs and Hub Virtual Networks. Policies work across regions and subscriptions.

![Azure Firewall Manager policy](media/policy-overview/policy-overview.png)

## Policy creation and association

A policy can be created and managed in multiple ways, including the Azure portal, REST API, templates, Azure PowerShell, CLI and Terraform.

You can also migrate existing Classic rules from Azure Firewall using the portal or Azure PowerShell to create policies. For more information, see [How to migrate Azure Firewall configurations to Azure Firewall policy](migrate-to-policy.md). 

Policies can be associated with one or more virtual hubs or VNets. The firewall can be in any subscription associated with your account and in any region.

## Classic rules and policies

Azure Firewall supports both Classic rules and policies, but policies is the recommended configuration. The following table compares policies and classic rules:


| Subject | Policy  | Classic rules |
| ------- | ------- | ----- |
|Contains     |NAT, Network, Application rules, custom DNS and DNS proxy settings, IP Groups, and Threat Intelligence settings (including allowlist), IDPS, TLS Inspection, Web Categories, URL Filtering|NAT, Network, and Application rules, custom DNS and DNS proxy settings, IP Groups, and Threat Intelligence settings (including allowlist)|
|Protects     |Virtual hubs and Virtual Networks|Virtual Networks only|
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

New policies can be created from scratch or inherited from existing policies. Inheritance allows DevOps to create local firewall policies on top of organization mandated base policy.

Policies created with non-empty parent policies inherit all rule collections from the parent policy. The parent policy and the child policy must be in the same region. A firewall policy can be associated with firewalls across regions regardless where they're stored.

Network rule collections inherited from a parent policy are always prioritized over network rule collections defined as part of a new policy. The same logic also applies to application rule collections. However, network rule collections are always processed before application rule collections regardless of inheritance.

Threat Intelligence mode is also inherited from the parent policy. You can set your threat Intelligence mode to a different value to override this behavior, but you can't turn it off. It's only possible to override with a stricter value. For example, if your parent policy is set to **Alert only**, you can configure this local policy to **Alert and deny**.

Like Threat Intelligence mode, the Threat Intelligence allowlist is inherited from the parent policy. The child policy can add more IP addresses to the allowlist.

NAT rule collections aren't inherited because they're specific to a given firewall.

With inheritance, any changes to the parent policy are automatically applied down to associated firewall child policies.

## Built-in high availability

High availability is built in, so there's nothing you need to configure.
You can create an Azure Firewall Policy object in any region and link it globally to multiple Azure Firewall instances under the same Azure AD tenant. If the region where you create the Policy goes down and has a paired region, the ARM(Azure Resource Manager) object metadata automatically fails over to the secondary region. During the failover, or if the single-region with no pair remains in a failed state, you can't modify the Azure Firewall Policy object. However, the Azure Firewall instances linked to the Firewall Policy continue to operate. For more information, see [Cross-region replication in Azure: Business continuity and disaster recovery](../reliability/cross-region-replication-azure.md#azure-paired-regions).

## Pricing

Policies are billed based on firewall associations. A policy with zero or one firewall association is free of charge. A policy with multiple firewall associations is billed at a fixed rate. For more information, see [Azure Firewall Manager Pricing](https://azure.microsoft.com/pricing/details/firewall-manager/).

## Next steps

- Learn how to deploy an Azure Firewall - [Tutorial: Secure your cloud network with Azure Firewall Manager using the Azure portal](secure-cloud-network.md)
- [Learn more about Azure network security](../networking/security/index.yml)

