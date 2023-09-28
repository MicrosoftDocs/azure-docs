---
title: Key components of a private mobile network
titleSuffix: Azure Private 5G Core
description: Learn about the key components of a private mobile network deployed through Azure Private 5G Core.
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: conceptual 
ms.date: 02/09/2022
ms.custom: template-concept 
---

# Key components of a private mobile network

This article introduces the key physical components of a private mobile network deployed through Azure Private 5G Core. It also details the resources you'll use to manage the private mobile network through Azure.

Each private mobile network contains one or more *sites*. A site is a physical enterprise location (for example, Contoso Corporation's Chicago Factory) that will provide coverage for user equipment (UEs). The following diagram shows the main components of a single site.

:::image type="content" source="media/key-components-of-a-private-mobile-network/site-physical-components.png" alt-text="Diagram displaying the main components of a site in a private mobile network":::

- Each site contains an Azure Stack Edge device that hosts a *packet core instance*, which is deployed using Azure Private 5G Core. The packet core instance is a cloud-native implementation of the 3GPP standards-defined 5G Next Generation Core (5G NGC or 5GC).

    When you add a site to your private mobile network, you'll create a *Kubernetes cluster* on the Azure Stack Edge device. This serves as the platform for the packet core instance.

- Each packet core instance connects to a radio access network (RAN) to provide coverage for UEs. You'll source your RAN from a third party.

## Azure Private 5G Core resources

The following diagram shows the key resources you'll use to manage your private mobile network through Azure. 

:::image type="content" source="media/key-components-of-a-private-mobile-network/private-5g-core-resources.png" alt-text="Diagram displaying the resources used to manage a private mobile network":::

- The *mobile network* resource represents the private mobile network as a whole.
- Each *SIM* resource represents a physical SIM or eSIM. The physical SIMs and eSIMs are used by UEs that will be served by the private mobile network.
- *SIM group* resources serve as containers for SIM resources and allow you to sort SIMs into categories for easier management. Each SIM must be a member of a SIM group, but can't be a member of more than one. If you only have a small number of SIMs, you may want to add them all to the same SIM group. Alternatively, you can create multiple SIM groups to sort your SIMs. For example, you could categorize your SIMs by their purpose (such as SIMs used by specific UE types like cameras or cellphones), or by their on-site location.
- *SIM policy* resources are a key component of Azure Private 5G Core's customizable policy control, which allows you to provide flexible traffic handling. You can determine exactly how your packet core instance applies quality of service (QoS) characteristics to service data flows (SDFs) to meet your deployment's needs. You can also use policy control to block or limit certain flows.

    Each SIM policy defines a set of policies and interoperability settings. You'll need to assign a SIM policy to a SIM before the UE using that SIM can access the private mobile network.

    A SIM policy will also reference one or more *services*. Each service is a representation of a set of QoS characteristics that you want to offer to UEs on SDFs that match particular properties, such as their destination, or the protocol used. You can also use services to limit or block particular SDFs based on these properties.

    The physical private mobile network can be segmented into multiple virtual *network slices*, providing isolated end-to-end networks that can be customized for different bandwidth and latency requirements. You can choose the network slice you want particular UEs to use by assigning it to their SIM policy.

    For detailed information on policy control, see [Policy control](policy-control.md).

- The *mobile network site* and *packet core* resources allow you to manage the sites in your private mobile network and the packet core instances that run in them.
- Each *attached data network* resource allows you to manage how its associated packet core instance will connect to the corresponding data network. You can attach up to ten data networks to a packet core instance.

    Since each data network can be configured independently, you can provision separate data networks to serve different applications and UE groups. For example, you can use separate data networks for person-to-person, machine-to-machine, and edge applications in a single site.

## Next steps

- [Learn more about the design requirements for deploying a private mobile network](private-mobile-network-design-requirements.md)
- [Learn more about the prerequisites for deploying a private mobile network](complete-private-mobile-network-prerequisites.md)
