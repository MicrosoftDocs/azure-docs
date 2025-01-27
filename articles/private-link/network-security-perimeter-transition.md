---
title: Transition to a network security perimeter in Azure
description: Learn about the different access modes and how to transition to a network security perimeter in Azure.
author: mbender-ms
ms.author: mbender
ms.service: azure-private-link
ms.custom:
  - ignite-2024
ms.topic: overview
ms.date: 11/06/2024
#CustomerIntent: As a network administrator, I want to understand the different access modes and how to transition to a network security perimeter in Azure.
---

# Transition to a network security perimeter in Azure

In this article, you learn about the different access modes and how to transition to a [network security perimeter](./network-security-perimeter-concepts.md) in Azure. Access modes control the resource's access and logging behavior.

## Access mode configuration point on resource associations 

The **access mode** configuration point is part of a resource association on the perimeter and therefore can be set by the perimeter's administrator. 

The property `accessMode` can be set in a resource association to control the resource's public network access. 

The possible values of `accessMode` are currently **Enforced** and **Learning**. 

| **Access Mode** | **Description** |
|-------------|-------------|
| **Learning** | This is the default access mode. Evaluation in this mode will use the network security perimeter configuration as a baseline, but in the case of not finding a matching rule, evaluation will fall back to the resource firewall configuration which can then approve access with existing settings. |
| **Enforced** | When explicitly set, the resource obeys **only** network security perimeter access rules. |

## Prevent connectivity disruptions while adopting network security perimeter

### Enable Learning mode

To prevent undesired connectivity disruptions while adopting network security perimeter to existing PaaS resources and ensure a smooth transition to secure configurations, administrators can add PaaS resources to network security perimeter in Learning mode. While this step does not secure the PaaS resources, it will:

- Allow connections to be established in accordance with the network security perimeter configuration. Additionally, resources in this configuration fallback to honoring resource-defined firewall rules and trusted access behavior when connections aren't permitted by the network security perimeter access rules.
- When diagnostic logs are enabled, generates logs detailing whether connections were approved based on network security perimeter configuration or the resource's configuration. Administrators can then analyse those logs to identify gaps in access rules, missing perimeter memberships, and undesired connections.


> [!IMPORTANT]
> Operating PaaS resources in **Learning** mode should serve only as a transitional step. Malicious actors may exploit unsecured resources to exfiltrate data. Therefore, it is crucial to transition to a fully secure configuration as soon as possible with the access mode set to **Enforced**.

### Transition to enforced mode for existing resources 

To fully secure your public access, it is essential to move to enforced mode in network security perimeter. Things to consider before moving to enforced mode are the impact on public, private, trusted, and perimeter access. When in enforced mode, the behavior of network access on associated PaaS resources across different types of PaaS resources can be summarised as follows:

- **Public access:** Public access refers to inbound or outbound requests made through public networks. PaaS resources secured by a network security perimeter have their inbound and outbound public access disabled by default, but network security perimeter access rules  can be used to selectively allow public traffic that matches them.
- **Perimeter access:** Perimeter access refers to inbound or outbound requests between the resources part of the same network security perimeter. To prevent data infiltration and exfiltration, such perimeter traffic will never cross perimeter boundaries unless explicitly approved as public traffic at both source and destination in enforced mode. Manged identity needs to be assigned on resources for perimeter access. 
- **Trusted access:** Trusted service access refers to a feature few Azure services that enables access through public networks when its origin is specific Azure services that are considered trusted. Since network security perimeter provides more granular control than trusted access, Trusted access is not supported in enforced mode. 
- **Private access:** Access via Private Links is not impacted by network security perimeter.

## Moving new resources into network security perimeter  

Network security perimeter supports secure by default behavior by introducing a new property under `publicNetworkAccess` called `SecuredbyPerimeter`. When set, it locks down public access and prevents PaaS resources from being exposed to public networks.

On resource creation, if `publicNetworkAccess` is set to `SecuredByPerimeter`, the resource is created in the lockdown mode even when not associated with a perimeter. Only private link traffic will be allowed if configured. Once associated to a perimeter, network security perimeter governs the resource access behavior. The following table summarizes access behavior in various modes and public network access configuration: 

| **Association access mode** | **Not associated** | **Learning mode** | **Enforced mode** |
|-----------------|-------------------|-----------------|-----------------|
| **Public network access** |   |  |   |
| **Enabled** | **Inbound:** Resource rules</br></br>**Outbound** Allowed | **Inbound:** Network security perimeter + Resource rules</br>**Outbound** Network security perimeter rules + Allowed | **Inbound:** Network security perimeter rules</br>**Outbound** Network security perimeter rules |
| **Disabled** | **Inbound:** Denied </br></br>**Outbound:** Allowed | **Inbound:** Network security perimeter rules</br>**Outbound:** Network security perimeter rules + Allowed | **Inbound:** Network security perimeter rules</br>**Outbound:** Network security perimeter rules |
| **SecuredByPerimeter** | **Inbound:** Denied</br></br>**Outbound:** Denied |**Inbound:** Network security perimeter rules</br></br>**Outbound:** Network security perimeter rules | - **Inbound:** Network security perimeter rules</br>- **Outbound:** Network security perimeter rules |

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

## Next steps

> [!div class="nextstepaction"]
> [Create a network security perimeter in the Azure portal](./create-network-security-perimeter-portal.md)

 
