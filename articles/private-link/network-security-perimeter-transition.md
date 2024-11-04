---
title: Transition to a network security perimeter in Azure
description: Learn about the different access modes and how to transition to a network security perimeter in Azure.
author: mbender-ms
ms.author: mbender
ms.service: azure-private-link
ms.topic: overview
ms.date: 11/04/2024
#CustomerIntent: As a network administrator, I want to understand the different access modes and how to transition to a network security perimeter in Azure.
---

# Transition to a network security perimeter in Azure

In this article, you learn about the different access modes and how to transition to a [network security perimeter](./network-security-perimeter-concepts.md) in Azure. Access modes control the resource's access and logging behavior.

## Configuration points for access modes 

### Access mode configuration point on resource associations 

The **access mode** configuration point is part of a resource association on the perimeter and therefore can be set by the perimeter's administrator. 

The property `accessMode` can be set in a resource association to control the resource's connectivity and logging behavior. 

The possible values of `accessMode` are currently Enforced and Learning. 

| **Access Mode** | **Description** |
|-------------|-------------|
| **Learning** | This is the default access mode. Evaluation in this mode uses the network security perimeter configuration as a baseline. When a matching rule isn't found, evaluation falls back to the resource firewall configuration which can then approve access with existing settings. |
| **Enforced** | This mode allows network security perimeter admin to override the `publicNetworkAccess` setting on the resource. When explicitly set, the resource obeys network security perimeter rules as if its `publicNetworkAccess` property was effectively set to `SecuredByPerimeter` (with only minor differences observable in logs), irrespective of the actual value of the `publicNetworkAccess` property. |

### Steps to configure publicNetworkAccess and accessMode properties

Both the `publicNetworkAccess` and `accessMode` properties can be set using the Azure portal by following these steps:

1. Navigate to your network security perimeter resource in the Azure portal.
2. Select **Settings** > **Resources** to view the list of resources associated with the perimeter.
3. Select *...* (ellipsis) next to the resource you want to configure.
   
    :::image type="content" source="media/network-security-perimeter-transition/network-security-perimeter-resources-page-full-size.png" alt-text="Screenshot of resources page with management options selected for resource." lightbox="media/network-security-perimeter-transition/network-security-perimeter-association-settings-lightbox.png":::

4. From the dropdown menu, select **Configure public network access**, and then select the desired access mode from the three options available: **Enabled**, **Disabled**, or **SecuredByPerimeter**.

    :::image type="content" source="media/network-security-perimeter-transition/network-security-perimeter-association-settings.png" alt-text="Screenshot of public network access settings with access mode options.":::

5. To set the access mode, select **Configure access mode** from the dropdown menu, and then select the desired access mode from the two options available: **Learning** or **Enforced**.

    :::image type="content" source="media/network-security-perimeter-transition/network-security-perimeter-association-access-mode.png" alt-text="Screenshot of access mode settings with access mode options.":::
    
## Prevent connectivity disruptions while adopting network security perimeter 

To prevent undesired connectivity disruptions while adopting network security perimeter to existing PaaS resources and ensure a smooth transition to secure configurations, administrators can add PaaS resources to network security perimeter in Learning access mode and leave publicNetworkAccess set to either Enabled or Disabled. While this step doesn't secure the PaaS resources, it: 

- Allows resources to begin establishing connections in accordance with the network security perimeter configuration. Additionally, resources in this configuration fallback to honoring resource-defined firewall rules and trusted access behavior when connections aren't permitted by the network security perimeter access rules. 

- Generates logs detailing whether connections were approved based on network security perimeter configuration or the resource's configuration. Administrators can then analyze those logs to identify gaps in access rules, missing perimeter memberships, and undesired connections. 

> [!IMPORTANT]
> Operating PaaS resources in Learning mode should serve only as a transitional step. Malicious actors may exploit unsecured resources to exfiltrate data. Therefore, it is crucial to transition to a fully secure configuration as soon as possible. 
> Achieving a secure posture requires every resource within a network security perimeter to be in a secure configuration. This can be achieved through one of the following options:
> - Having `SecuredByPerimeter` enforced on `publicNetworkAccess` via an Azure Policy.
> - Setting Enforced access mode on every association.

## Impact on public, private, trusted, and perimeter access 

Depending on the configuration of the resource and the perimeter, the behavior of network access across different types of PaaS resources can be summarized as follows:

- **Public access:** Public access refers to inbound or outbound requests made through public networks. PaaS resources secured by a network security perimeter have their inbound and outbound public access disabled by default, but network security perimeter access rules  can be used to selectively allow public traffic that matches them.
- **Perimeter access:** Perimeter access refers to inbound or outbound requests between the resources part of the same network security perimeter. To prevent data infiltration and exfiltration, such perimeter traffic will never cross perimeter boundaries unless explicitly approved as public traffic at both source and destination in enforced mode. Manged identity needs to be assigned on resources. 
- **Trusted access:** Trusted service access refers to a feature of some Azure services that enables access through public networks when its origin is specific Azure services that are considered trusted. Network security perimeters provide more granular control than trusted access. Trusted access is disabled in secured by perimeter mode. 
- **Private access:** Access via Private Links on the other hand, is considered private and isn't impacted by network security perimeter or by other public traffic-related controls like the resource's `publicNetworkAccess` property. 

When associated with a perimeter and configured in *Learning* mode with `publicNetworkAccess` set to either **Enabled** or **Disabled**, a PaaS resource retains most of the behaviors it would exhibit in the absence of such an association. For example, regular public access continues to honor resource-defined firewall rules, and trusted service access is allowed as follows: 

| **publicNetworkAccess**| **Disabled (existing value)** | **Enabled (existing value)** | **SecuredByPerimeter (new value)** |
|-----------------|---------------|----------------|------------|
| **Perimeter access** | Allowed for same perimeter. | Allowed for same perimeter. | Allowed for same perimeter. |
| **Public inbound** | Allowed only by network security perimeter rules. | Allowed only by network security perimeter rules or resource rules. | Allowed only by network security perimeter rules. |
| **Public outbound** | Allowed only by network security perimeter rules or resource rules. | Allowed only by network security perimeter rules or resource rules. | Allowed only by network security perimeter rules. |
| **Trusted access** | Allowed | Allowed | Not Allowed |
| **Private access** | Allowed | Allowed | Allowed |


> [!NOTE]
> The original *Enabled* and *Disabled* values did not restrict *public outbound* behavior but `SecuredByPerimeter` does. 

In special cases when `publicNetworkAccess` is set to `SecuredByPerimeter` but the resource is still not associated with a perimeter, no network security perimeter access rules can allow access. Therefore the resource becomes locked down for public access. The following table summarizes the behavior with this configuration:

| **publicNetworkAccess** | **Disabled (existing value)** | **Enabled (existing value)** | **SecuredByPerimeter (new value)** |
|-----------------|---------------|----------------|------------|
| **Perimeter access** | Denied | Denied | Denied |
| **Public inbound** | Denied | Allowed only by resource rules | Denied |
| **Public outbound** | Allowed only by resource rules | Allowed only by resource rules | Denied |
| **Trusted access** | Allowed | Allowed | Denied |
| **Private access** | Allowed | Allowed | Allowed |

The **locked down for public access** mode exists by-design and helps prevent PaaS resources not yet associated with a perimeter from being temporarily exposed to public networks or to other PaaS resources. Administrators can apply Azure Policy to ensure publicNetworkAccess is set to SecuredByPerimeter from the moment a resource is created. 

The behavior of public network access on PaaS resources according to the association's accessMode value and the resource's `publicNetworkAccess` value can be summarized as follows: 

| **Public network access** | **Not associated** | **Learning mode** | **Enforced mode** |
|-------------|-----------|-------------|-----------|
| **Enabled** | Inbound: Resource rules </br> Outbound: Allowed | Inbound: Network security perimeter + Resource rules </br> Outbound: Network security perimeter rules + Allowed | Inbound: Network security perimeter rules </br> Outbound: Network security perimeter rules |
| **Disabled** | Inbound: Denied </br> Outbound: Allowed | Inbound: Network security perimeter rules </br> Outbound: Network security perimeter rules + Allowed | Inbound: Network security perimeter rules </br> Outbound: Network security perimeter rules |
| **SecuredByPerimeter** | Inbound: Denied </br> Outbound: Denied | Inbound: Network security perimeter rules </br> Outbound: Network security perimeter rules | Inbound: Network security perimeter rules </br> Outbound: Network security perimeter rules |

## Next steps

> [!div class="nextstepaction"]
> [Create a network security perimeter in the Azure portal](./network-security-perimeter-diagnostic-logs.md)

 