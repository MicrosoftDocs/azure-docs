---
title: Key components of an Azure Private 5G Core private mobile network
description: Information on the key components of a private mobile network deployed through Azure Private 5G Core Preview 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: conceptual 
ms.date: 01/14/2022
ms.custom: template-concept 
---

# Key components of a private mobile network

Azure Private 5G Core Preview is an Azure cloud service for service providers and system integrators to securely deploy and manage private mobile networks for enterprises on Azure Arc-connected edge platforms such as an Azure Stack Edge device. Each private mobile network comprises a number of key components.

:::image type="content" source="media/key-components-of-a-private-mobile-network/private-mobile-network-components.png" alt-text="Diagram displaying the key components of a private mobile network, including SIMs, sites and policy control":::

## SIMs

Each SIM resource represents a physical SIM or eSIM that will be served by the private mobile network.

## Sites

Each site resource represents a physical enterprise location (for example, Contoso Corporation's Chicago factory) containing an Azure Stack Edge device that hosts a packet core instance. During the deployment of your private mobile network, you will create a Kubernetes base VM on each Azure Stack Edge device. This serves as the platform for the Kubernetes cluster that will run the packet core instance.

## Policy control

Azure Private 5G Core provides flexible traffic handling though customizable policy control, allowing you to determine exactly how your packet core instance applies Quality of Service (QoS) characteristics to Service Data Flows (SDFs) to meet your deployment's needs. You can also use policy control to block or limit certain flows.

You will configure two primary types of resource to manage policy control for your private mobile network.

- **Services** - Each service is a representation of a set of QoS characteristics that you want to offer to UEs on SDFs that match particular properties, such as their destination, or the protocol used. You can also use services to limit or block particular SDFs based on these properties.
- **SIM policies** - SIM policies allow you to define different sets of policies and interoperability settings which can each be applied to a group of SIMs. You'll need to assign a SIM to a SIM policy before the SIM can use the private mobile network.

For detailed information on policy control, see [Policy control](policy-control.md)

## Next steps

- [Learn more about the prerequisites for deploying a private mobile network](complete-private-mobile-network-prerequisites.md)
