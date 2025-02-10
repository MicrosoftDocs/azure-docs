---
title: What Is Discovery?
description: Learn how Microsoft Defender External Attack Surface Management (Defender EASM) uses proprietary discovery technology to continuously define your organization’s unique internet-exposed attack surface. 
author: danielledennis
ms.author: dandennis
ms.service: defender-easm
ms.date: 07/14/2022
ms.topic: conceptual
---

# What is discovery?

Microsoft Defender External Attack Surface Management (Defender EASM) uses Microsoft proprietary discovery technology to continuously define your organization’s unique internet-exposed attack surface. The Defender EASM discovery feature scans known assets that are owned by your organization to uncover previously unknown and unmonitored properties. Discovered assets are indexed in your organization's inventory. Defender EASM gives you a dynamic system of record for web applications, third-party dependencies, and web infrastructure under your organization’s management in a single view.

:::image type="content" source="media/discovery-configuration.png" alt-text="Screenshot of the Add discovery pane.":::

Through the Defender EASM discovery process, your organization can proactively monitor its constantly shifting digital attack surface. You can identify emerging risks and policy violations as they arise.

Many vulnerability programs lack visibility outside the firewall. They're unaware of external risks and threats, which are the primary source of data breaches.

At the same time, digital growth continues to outpace an enterprise security team’s ability to protect it. Digital initiatives and the overly common "shadow IT" lead to an expanding attack surface outside the firewall. At this pace, it's nearly impossible to validate controls, protections, and compliance requirements.

Without Defender EASM, it's nearly impossible to identify and remove vulnerabilities and scanners can't reach beyond the firewall to assess the full attack surface.

## How it works

To create a comprehensive mapping of your organization’s attack surface, Defender EASM first intakes known assets (*seeds*). Discovery seeds are recursively scanned to discover more entities through their connections to seeds.

An initial seed might be any of the following kinds of web infrastructure indexed by Microsoft:

- Domains
- IP address blocks
- Hosts
- Email contacts
- Autonomous system names (ASNs)
- Whois organizations

Starting with a seed, the system discovers associations to other online infrastructure items to discover other assets that your organization owns. This process ultimately creates your whole attack surface inventory. The discovery process uses discovery seeds as central nodes. Then it branches outward toward the periphery of your attack surface. It identifies all the infrastructure items that are directly connected to the seed, and then identifies all items related to each item in the first set of connections. The process repeats and extends until it reaches the edge of your organization's management responsibility.

For example, to discover all the items in Contoso’s infrastructure, you might use the domain, `contoso.com`, as the initial keystone seed. Starting with this seed, we can consult the following sources and derive the following relationships:

| Data source | Items with possible relationships to Contoso |
|--|--|
| **Whois records** | Other domain names registered to the same contact email or registrant organization that was used to register `contoso.com` |
| **Whois records** | All domain names registered to any `@contoso.com` email address |
| **Whois records** | Other domains associated with the same name server as `contoso.com` |
| **DNS records** | All observed hosts on the domains Contoso owns, and any websites that are associated with those hosts |
| **DNS records** | Domains that have different hosts, but which resolve to the same IP blocks |
| **DNS records** | Mail servers associated with Contoso-owned domain names |
| **SSL certificates** | All Secure Sockets Layer (SSL) certificates that are connected to each of the hosts, and any other hosts that use the same SSL certificates |
| **ASN records** | Other IP blocks associated with the same ASN as the IP blocks that are connected to hosts on Contoso’s domain names, including all hosts and domains that resolve to them |

By using this set of first-level connections, we can quickly derive an entirely new set of assets to investigate. Before Defender EASM performs more recursions, it determines whether a connection is strong enough for a discovered entity to be automatically added as **Confirmed Inventory**. For each of these assets, the discovery system runs automated, recursive searches based on all available attributes to find second-level and third-level connections. This repetitive process provides more information on an organization’s online infrastructure and therefore discovers disparate assets that might not otherwise be discovered and then monitored.

## Automated vs. customized attack surfaces

When you first use Defender EASM, you can access a prebuilt inventory for your organization to quickly kickstart your workflows. On the **Getting Started** pane, a user can search for their organization to quickly populate their inventory based on asset connections already identified by Defender EASM. We recommend that all users search for their organization’s pre-built attack surface inventory before they create a custom inventory.

To build a customized inventory, a user can create discovery groups to organize and manage the seeds they use when they run discoveries. The user can use separate discovery groups to automate the discovery process, configure the seed list, and set up recurrent run schedules.

:::image type="content" source="media/discovery-add-group.png" alt-text="Screenshot of the Import seeds from an organization pane to set up automated discovery.":::

## Confirmed inventory vs. candidate assets

If the discovery engine detects a strong connection between a potential asset and the initial seed, the system automatically labels the asset with the state **Confirmed Inventory**. As the connections to this seed are iteratively scanned and third-level or fourth-level connections are discovered, the system’s confidence in the ownership of any newly detected assets lessens. Similarly, the system might detect assets that are relevant to your organization but not directly owned by you.

For these reasons, newly discovered assets are labeled with one of the following states:

| State name | Description |
|--|--|
| **Approved Inventory** | An item that is part of your owned attack surface. It's an item that you're directly responsible for. |
| **Dependency** | Infrastructure that is owned by a third party, but it's part of your attack surface because it directly supports the operation of your owned assets. For example, you might depend on an IT provider to host your web content. The domain, host name, and pages would be part of your approved inventory, so you might want to treat the IP address that runs the host as a dependency. |
| **Monitor Only** | An asset that is relevant to your attack surface, but it's not directly controlled or a technical dependency. For example, independent franchisees or assets that belong to related companies might be labeled **Monitor Only** rather than **Approved Inventory** to separate the groups for reporting purposes. |
| **Candidate** | An asset that has some relationship to your organization's known seed assets, but which doesn't have a strong enough connection to immediately label it **Approved Inventory**. You must manually review these candidate assets to determine ownership. |
| **Requires Investigation** | A state similar to the **Candidate** state, but this value is applied to assets that require manual investigation to validate. The state is determined based on our internally generated confidence scores that assess the strength of detected connections between assets. It doesn't indicate the infrastructure's exact relationship to the organization, but it flags the asset for more review to determine how it should be categorized. |

When you review assets, we recommend that you start with assets labeled **Requires Investigation**. Asset details are continuously refreshed and updated over time to maintain an accurate map of asset states and relationships, and to uncover newly created assets as they emerge. The discovery process is managed by placing seeds in discovery groups that you can schedule to run on a recurrent basis. After an inventory is populated, the Defender EASM system continuously scans your assets by using Microsoft virtual user technology to uncover fresh, detailed data about each asset. The process examines the content and behavior of each page in applicable sites to provide robust information that you can use to identify vulnerabilities, compliance issues, and other potential risks to your organization.

## Related content

- [Deploy the Defender EASM Azure resource](deploying-the-defender-easm-azure-resource.md)
- [Use and manage discovery](using-and-managing-discovery.md)
- [Understanding asset details](understanding-asset-details.md)
