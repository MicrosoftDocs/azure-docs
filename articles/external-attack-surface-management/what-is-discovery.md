---
title: What is Discovery?
description: What is Discovery - Microsoft Defender External Attack Surface Management (Defender EASM) relies on our proprietary discovery technology to continuously define your organization’s unique Internet-exposed attack surface. 
author: danielledennis
ms.author: dandennis
ms.service: defender-easm
ms.date: 07/14/2022
ms.topic: conceptual
---

# What is Discovery?

## Overview

Microsoft Defender External Attack Surface Management (Defender EASM) relies on our proprietary discovery technology to continuously define your organization’s unique Internet-exposed attack surface. Discovery scans known assets owned by your organization to uncover previously unknown and unmonitored properties. Discovered assets are indexed in a customer’s inventory, providing a dynamic system of record of web applications, third party dependencies, and web infrastructure under the organization’s management through a single pane of glass.

![Screenshot of Discovery configuration screen](media/Discovery-1.png)

Through this process, Microsoft enables organizations to proactively monitor their constantly shifting digital attack surface and identify emerging risks and policy violations as they arise. Many vulnerability programs lack visibility outside their firewall, leaving them unaware of external risks and threats—the primary source of data breaches. At the same time, digital growth continues to outpace an enterprise security team’s ability to protect it. Digital initiatives and overly common “shadow IT” lead to an expanding attack surface outside the firewall. At this pace, it is nearly impossible to validate controls, protections, and compliance requirements. Without Defender EASM, it is nearly impossible to identify and remove vulnerabilities and scanners cannot reach beyond the firewall to assess the full attack surface.

## How it works

To create a comprehensive mapping of your organization’s attack surface, the system first intakes known assets (i.e. “seeds”) that are recursively scanned to discover additional entities through their connections to a seed. An initial seed may be any of the following kinds of web infrastructure indexed by Microsoft:

- Organization Names
- Domains
- IP Blocks
- Hosts
- Email Contacts
- ASNs
- Whois organizations

Starting with a seed, the system then discovers associations to other online infrastructure to discover other assets owned by your organization; this process ultimately creates your attack surface inventory. The discovery process uses the seeds as the central nodes and spiders outward towards the periphery of your attack surface by identifying all the infrastructure directly connected to the seed, and then identifying all the things related to each of the things in the first set of connections, etc. This process continues until we reach the edge of what your organization is responsible for managing.

For example, to discover Contoso’s infrastructure, you might use the domain, contoso.com, as the initial keystone seed. Starting with this seed, we could consult the following sources and derive the following relationships:

| Data source | Example |
|--|--|
| WhoIs records | Other domain names registered to the same contact email or registrant org used to register contoso.com likely also belong to Contoso |
| WhoIs records | All domain names registered to any @contoso.com email address likely also belong to Contoso |
| Whois records | Other domains associated with the same name server as contoso.com may also belong to Contoso |
| DNS records | We can assume that Contoso also owns all observed hosts on the domains it owns and any websites that are associated with those hosts |
| DNS records | Domains with other hosts resolving to the same IP blocks might also belong to Contoso if the organization owns the IP block |
| DNS records | Mail servers associated with Contoso-owned domain names would also belong to Contoso |
| SSL certificates | Contoso probably also owns all SSL certificates connected to each of those hosts and any other hosts using the same SSL certs |
| ASN records | Other IP blocks associated with the same ASN as the IP blocks to which hosts on Contoso’s domain names are connected may also belong to Contoso – as would all the hosts and domains that resolve to them |

Using this set of first-level connections, we can quickly derive an entirely new set of assets to investigate. Before performing additional recursions, Microsoft determines whether a connection is strong enough for a discovered entity to be automatically added to your Confirmed Inventory. For each of these assets, the discovery system runs automated, recursive searches based on all available attributes to find second-level and third-level connections. This repetitive process provides more information on an organization’s online infrastructure and therefore discovers disparate assets that may not have been discovered and subsequently monitored otherwise.

## Automated versus customized attack surfaces

When first using Defender EASM, you can access a pre-built inventory for your organization to quickly kick start your workflows. From the “Getting Started” page, users can search for their organization to quickly populate their inventory based on asset connections already identified by Microsoft. It is recommended that all users search for their organization’s pre-built Attack Surface before creating a custom inventory.

To build a customized inventory, users create Discovery Groups to organize and manage the seeds they use when running discoveries. Separate Discovery groups allow users to automate the discovery process, configuring the seed list and recurrent run schedule.

![Screenshot of Automated attack surface selection screen](media/Discovery-3.png)

## Confirmed inventory vs. candidate assets

If the discovery engine detects a strong connection between a potential asset and the initial seed, the system will automatically include that asset in an organization’s “Confirmed Inventory.” As the connections to this seed are iteratively scanned, discovering third- or fourth-level connections, the system’s confidence in the ownership of any newly detected assets is lower. Similarly, the system may detect assets that are relevant to your organization but may not be directly owned by them.
For these reasons, newly discovered assets are labeled as one of the following states:

| State name | Description |
|--|--|
| Approved Inventory | A part of your owned attack surface; an item that you are directly responsible for. |
| Dependency | Infrastructure that is owned by a third party but is part of your attack surface because it directly supports the operation of your owned assets. For example, you might depend on an IT provider to host your web content. While the domain, hostname, and pages would be part of your “Approved Inventory,” you may wish to treat the IP Address running the host as a “Dependency.” |
| Monitor Only | An asset that is relevant to your attack surface but is neither directly controlled nor a technical dependency. For example, independent franchisees or assets belonging to related companies might be labeled as “Monitor Only” rather than “Approved Inventory” to separate the groups for reporting purposes. |
| Candidate | An asset that has some relationship to your organization's known seed assets but does not have a strong enough connection to immediately label it as “Approved Inventory.” These candidate assets must be manually reviewed to determine ownership. |
| Requires Investigation | A state similar to the “Candidate” states, but this value is applied to assets that require manual investigation to validate. This is determined based on our internally generated confidence scores that assess the strength of detected connections between assets. It does not indicate the infrastructure's exact relationship to the organization as much as it denotes that this asset has been flagged as requiring additional review to determine how it should be categorized. |

Asset details are continuously refreshed and updated over time to maintain an accurate map of asset states and relationships, as well as to uncover newly created assets as they emerge. The discovery process is managed by placing seeds in Discovery Groups that can be scheduled to rerun on a recurrent basis. Once an inventory is populated, the Defender EASM system continuously scans your assets with Microsoft’s virtual user technology to uncover fresh, detailed data about each one. This process examines the content and behavior of each page within applicable sites to provide robust information that can be used to identify vulnerabilities, compliance issues and other potential risks to your organization.

## Next steps
- [Deploying the EASM Azure resource](deploying-the-defender-easm-azure-resource.md)
- [Using and managing discovery](using-and-managing-discovery.md)
- [Understanding asset details](understanding-asset-details.md)
