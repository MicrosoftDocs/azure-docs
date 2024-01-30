---
title: Plan your OT monitoring system with Defender for IoT
description: Learn how to plan your overall OT network monitoring structure and requirements.
ms.topic: install-set-up-deploy
ms.date: 02/16/2023
---

# Plan your OT monitoring system with Defender for IoT

This article is one in a series of articles describing the [deployment path](../ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT.

Use the content below to learn how to plan your overall OT monitoring with Microsoft Defender for IoT, including the sites you're going to monitor, your user groups and types, and more.

:::image type="content" source="../media/deployment-paths/progress-plan-and-prepare.png" alt-text="Diagram of a progress bar with Plan and prepare highlighted." border="false" lightbox="../media/deployment-paths/progress-plan-and-prepare.png":::

## Prerequisites

Before you start planning your OT monitoring deployment, make sure that you have an Azure subscription and an OT plan onboarded Defender for IoT. For more information, see [Start a Microsoft Defender for IoT trial](../getting-started.md).

This step is performed by your architecture teams.

## Plan OT sites and zones

When working with OT networks, we recommend that you list all of the locations where your organization has resources connected to a network, and then segment those locations out into *sites* and *zones*.

Each physical location can have its own site, which is further segmented into zones. You'll associate each OT network sensor with a specific site and zone, so that each sensor covers only a specific area of your network. 

Using sites and zones supports the principles of [Zero Trust](/security/zero-trust/), and provides extra monitoring and reporting granularity.

For example, if your growing company has factories and offices in Paris, Lagos, Dubai, and Tianjin, you might segment your network as follows:

|Site  |Zones  |
|---------|---------|
|**Paris office**     |    - Ground floor (Guests) <br>- Floor 1 (Sales)  <br>- Floor 2 (Executive)        |
|**Lagos office**     |   - Ground floor (Offices) <br>- Floors 1-2 (Factory)      |
|**Dubai office**     |     - Ground floor (Convention center) <br>- Floor 1 (Sales)<br>- Floor 2 (Offices)     |
|**Tianjin office**     |   - Ground floor (Offices) <br>- Floors 1-2 (Factory)        |

If you don't plan any detailed sites and zones, Defender for IoT still uses a default site and zone to assign to all OT sensors.

For more information, see [Zero Trust and your OT networks](../concept-zero-trust.md).

### Separating zones for recurring IP ranges

Each zone can support multiple sensors, and if you're deploying Defender for IoT at scale, each sensor might detect different aspects of the same device. Defender for IoT automatically consolidates devices that are detected in the same zone, with the same logical combination of device characteristics, such the same IP and MAC address.

If you're working with multiple networks and have unique devices with similar characteristics, such as recurring IP address ranges, assign each sensor to a separate zone so that Defender for IoT knows to differentiate between the devices and identifies each device uniquely.

For example, your network might look like the following image, with six network segments logically allocated across two Defender for IoT sites and zones. Note that this image shows two network segments with the same IP addresses from different production lines.

:::image type="content" source="../media/plan-corporate-monitoring/recurring-segments-option-no.png" alt-text="Diagram of recurring networks in the same zone." border="false" :::

In this case, we recommend separating **Site 2** into two separate zones, so that devices in the segments with recurring IP addresses aren't consolidated incorrectly, and are identified as separate and unique devices in the device inventory.

For example:

:::image type="content" source="../media/plan-corporate-monitoring/recurring-segments-option-yes.png" alt-text="Diagram of recurring networks in the different zones." border="false" :::

## Plan your users

Understand who in your organization will be using Defender for IoT, and what their use cases are. While your security operations center (SOC) and IT personnel will be the most common users, you may have others in your organization who will need read-access to resources in Azure or on local resources.

- **In Azure**, user assignments are based on their Microsoft Entra ID and RBAC roles. If you're segmenting your network into multiple sites, decide which permissions you'll want to apply per site.

- **OT network sensors** support both local users and Active Directory synchronizations. If you'll be using Active Directory, make sure that you have the access details for the Active Directory server.

For more information, see:

- [Microsoft Defender for IoT user management](../manage-users-overview.md)
- [Azure user roles and permissions for Defender for IoT](../roles-azure.md)
- [On-premises users and roles for OT monitoring with Defender for IoT](../roles-on-premises.md)

## Plan OT sensor and management connections

For cloud-connected sensors, determine how you'll be connecting each OT sensor to Defender for IoT in the Azure cloud, such as what sort of proxy you might need.  For more information, see [Methods for connecting sensors to Azure](../architecture-connections.md).

If you're working in an air-gapped or hybrid environment and will have multiple, locally-managed OT network sensors, you may want to plan to deploy an on-premises management console to configure your settings and view data from a central location. For more information, see the [Air-gapped OT sensor management deployment path](../ot-deploy/air-gapped-deploy.md).

## Plan on-premises SSL/TLS certifications

We recommend using a [CA-signed SSL/TLS certificate](../ot-deploy/create-ssl-certificates.md) with your production system to ensure your appliances' ongoing security.

Plan which certificates and which certificate authority (CA) you'll use for each OT sensor, what tools you'll use to generate the certificates, and which attributes you'll include in each certificate.

For more information, see [SSL/TLS certificate requirements for on-premises resources](certificate-requirements.md).

## Next steps

> [!div class="step-by-step"]
> [Plan and prepare for deploying a Defender for IoT site »](plan-prepare-deploy.md)
