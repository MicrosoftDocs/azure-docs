---
title: About Azure Orbital - Preview
description: Learn about the new Ground Station as a Service solution from Microsoft - Azure Orbital.
services: vnf-manager
author: wamota

ms.service: vnf-manager
ms.topic: overview
ms.date: 09/22/2020
ms.author: wamota
---

# What is Azure Orbital? (Preview)

Azure Orbital is a fully managed cloud-based ground station as a service that lets you communicate with your spacecraft or satellite constellations, downlink and uplink data, process your data in the cloud, chain services with Azure services in unique scenarios, and generate products for your customers. Azure Orbital lets you focus on the mission and product data by off-loading the responsibility for deployment and maintenance of ground station assets. This system is built on top of the Azure global infrastructure and low-latency global fiber network.

[:::image type="content" source="./media/azure-orbital-overview/orbital-all-ignite-link.png" alt-text="Azure Orbital Ignite Launch Video":::](https://aka.ms/orbitalatignite)
[Watch the Azure Orbital announcement at Ignite on the Azure YouTube Channel](https://aka.ms/orbitalatignite)

Azure Orbital focuses on building a partner ecosystem to enable customers to use partner ground stations in addition to Orbital ground stations as well as use partner cloud modems in addition to integrated cloud modems. Azure Orbital focuses on partnering with industry leaders such as KSAT, in addition to other ground station/teleport providers like ViaSat Real-time Earth (RTE) and US Electrodynamics Inc. to provide broad coverage that is available up-front. This partnership also extends to satcom telecom providers like SES and other ground station/teleport providers, ViaSat Real-time Earth (RTE), and US Electrodynamics Inc. to offer unprecedented connectivity such as global access to your LEO/MEO fleet or direct Azure access for communication constellations or global access to your LEO/MEO fleet. We’ve taken the steps to virtualize the RF signal and partner with leaders – like Kratos and Amergint – to bring their modems in the Marketplace. Our aim is to empower our customers to achieve more and build systems with our rich, scalable, and highly flexible ground station service platform.

Azure Orbital enables multiple use cases for our customers, including Earth Observation and Global Communications. It also provides a platform that enables digital transformation of existing ground stations using virtualization. You have direct access to all Azure services, the Azure global infrastructure, the Marketplace, and access to our world-class partner ecosystem through our service.

:::image type="content" source="./media/azure-orbital-overview/orbital-all-overview.png" alt-text="Azure Orbital Overview":::

**Value propositions for Azure Orbital users include:**

* **Global footprint** – The Azure Orbital ground station service is inclusive of our partner ground stations as well. Global coverage is available without delay and customers can schedule Contacts using Orbital on the partner ground stations as well in addition to Microsoft-owned ground stations.

* **Convert Capital Expenditure to Operational Expenditure** – As we take on the task of deploying and managing ground stations, your up-front costs required for ground-station investments can be used to focus on the mission and deployment of assets. Our pay-as-you-go consumption model means you are only charged for the time you use.

* **Licensing** – Our team can help on-board your satellite(s) across our sites and regulatory bodies.

* **Operational Efficiency and Scalability** – You don’t have to worry about maintenance, leasing, building, or running operational costs for ground stations anymore. You will have the option to rapidly scale satellite communications on-demand when the business needs it.

* **Direct access to Azure network and regions** – We deploy our own ground stations at datacenter locations or in close proximity to the edge of our network, and also inter-connect with partner ground stations and networks to provide proximity to Azure regions. Your data is delivered to the cloud immediately and anywhere to your desired location through Azure’s secure and low-latency global fiber network.

* **Digitized RF** – With the fully digitized signal available from the antenna, including up to 500 MHz of wideband, you have complete control and security over the data coming from your spacecraft. Software modems from our partners are integrated into the platform for seamless use and are also available in the Marketplace for use to complete the processing chain. We anticipate certain customers to bring their own modems as well (for their unique mission needs) which is supported by delivery of digitized RF at the designated endpoint in your virtual network.

* **Azure Cloud and Marketplace** – Take advantage of all Azure solutions to process and store the data, including but not limited to IoT, AI and ML, Cognitive services, analytics and storage, and chain together with your workload in one environment.

* **Flexibility** – The power of our scheduling service, partner networks, digitized RF, and the marketplace means you are not restricted to a particular solution set or workflow. We encourage you to think outside of the box and reach out to us. For example, your product chain, could be offered in the Marketplace as well for other users to incorporate in their products. The possibilities are endless.

For more information on our preview, or to express interest to participate in the preview, fill the contact form [here](https://aka.ms/iaminterested), or email us at [MSAzureOrbital@microsoft.com](mailto:MSAzureOrbital@microsoft.com).

## <a name="earth-observation"></a>Earth observation

:::image type="content" source="./media/azure-orbital-overview/orbital-eos-dataflow.png" alt-text="Azure Orbital for Earth Observation Dataflow" lightbox="./media/azure-orbital-overview/orbital-eos-dataflow-expanded.png":::

You can use Azure Orbital to schedule contacts with satellites on a pay-as-you-go basis for house-keeping and payload downlinks. Use the scheduled access times to ingest data from the satellite, monitor the satellite health and status, or transmit commands to the satellite. Incoming data is delivered to your private virtual network allowing it to be processed or stored in Azure.

As the service is fully digitized, a software modem from Kratos and Amergint, can be used to perform the modulation/demodulation and encoding/decoding functions to recover the data. You will have the option to purchase from the Marketplace or let us manage this part for you. Furthermore, integrate with Kubos, to fully leverage an end-to-end solution to manage fleet operations and Telemetry, Tracking, & Control (TT&C) functions. Implement your workloads in Azure using Azure resources and toolboxes to manipulate the payload data into the final offerings.

:::image type="content" source="./media/azure-orbital-overview/orbital-eos-schedule.png" alt-text="Azure Orbital for Earth Observation Scheduling":::

### <a name="scheduling-contacts"></a>Scheduling contacts

Scheduling contacts using Azure Orbital is an easy three-step process: 

1. **Register a spacecraft** – Input the NORAD ID, TLE, and licensing information for each satellite.

2. **Create a contact profile** – Input the center frequency and bandwidth requirements for each link, as well as other details such as minimum elevation and autotrack requirements. Feel free to create as many profiles as required. For example, one for commanding only, or one for payload downlinks.

3. **Schedule the contact** – Select the spacecraft and select a contact profile along with the time and date window to view the available passes at ours and our partner network’s sites to reserve. We will have a first come first serve algorithm at first, but priority scheduling or guaranteed scheduling is on the roadmap.

For more information on our preview, or to express interest to participate in the preview, fill the contact form [here](https://aka.ms/iaminterested), or email us at [MSAzureOrbital@microsoft.com](mailto:MSAzureOrbital@microsoft.com).

## <a name="global-communication"></a>Global communication

:::image type="content" source="./media/azure-orbital-overview/orbital-communications-use-flow.png" alt-text="Azure Orbital for Global Communications Useflow":::

Satellite providers who provide global communication capabilities to their customers, can use Azure Orbital to either colocate new ground stations in Azure data centers or edge of Azure network, or inter-connect their existing ground stations with global Azure backbone. They can then route their traffic on global Microsoft network, leverage internet breakout from the edge of Azure network for providing internet services and other managed services to their customers.

Azure Orbital service delivers the traffic from Orbital ground station to Provider’s virtual network. Using these Azure Orbital services, a satellite provider can integrate or bundle other Azure services (like Security services like Firewall, connectivity services like SDWAN, etc.) along with their satellite connectivity to provide managed services to their customers in addition to satellite connectivity. 

For more information on our preview, or to express interest to participate in the preview, fill the contact form [here](https://aka.ms/iaminterested), or email us at [MSAzureOrbital@microsoft.com](mailto:MSAzureOrbital@microsoft.com).

## <a name="digital-transformation"></a>Partner ground stations

In addition to building our own ground stations, Azure Orbital enables customers to use partner ground stations to ingest data directly into Azure.

Ground station or teleport providers can partner with Azure Orbital to digitally transform their ground stations. By doing so, customers can use these ground stations to schedule contacts to their satellites while leveraging all the software radio processing and data processing capabilities offered by the platform and Orbital partners through Marketplace. The service is closely integrated with workloads in Cloud, and a vibrant ecosystem of third-party solutions via marketplace such as modems, resource management, and mission control services. All data can also leverage the low latency and high reliability global fiber network of Azure. Together, we believe it will offer the widest coverage & flexibility possible for our customers to communicate with the satellites with highest agility and reliability.

:::image type="content" source="./media/azure-orbital-overview/orbital-all-digital-transformations.png" alt-text="Azure Orbital for Digital Transformation":::

For more information on our preview, or to express interest to participate in the preview, fill the contact form [here](https://aka.ms/iaminterested), or email us at [MSAzureOrbital@microsoft.com](mailto:MSAzureOrbital@microsoft.com).

## <a name="orbital-partners"></a>Partners

As we move forward with our journey to Space, we will be adding more partners to our ecosystem to help our customers achieve more using Azure Orbital. We will be partner-led in our approach as we build Azure Orbital. Our goal has been also to build a vibrant ecosystem of partners to jointly create more value for both our partners as well as our customers. Think of it as a coral reef!

:::image type="content" source="./media/azure-orbital-overview/orbital-all-partners.png" alt-text="Azure Orbital Partners":::

The following sections show a list of partner categories and Azure Orbital partners that are already part of Orbital ecosystem:

### Ground station infrastructure partners

We have partnered with [KSAT](https://www.ksat.no), [ViaSat](https://www.viasat.com/products/antenna-systems) RTE (real-time earth), and [US Electrodynamics](https://www.usei-teleport.com/) to enable our customers to communicate to their satellites by using these partner ground stations and ingest data directly in Azure.

### Virtualized modem partners

We have partnered with [Kratos](https://www.kratosdefense.com/) and [Amergint](https://www.amergint.com/) to bring their software radio processing capabilities in the cloud as part of our Orbital platform. These capabilities have been upgraded to adopt Azure platform accelerations (including but not limited to Accelerated Networking using DPDK and GPU-based acceleration using special purpose Azure compute) to process the radio signal in real time at high throughputs/bandwidth. Additionally, our customers will also be able to deploy these software modems from our partners from Azure Marketplace in their own virtual networks for more granular and closer control on signal processing.

### Global communication partner

[SES](https://www.ses.com/) is one of the largest satellite connectivity providers in the Space industry. We are happy to share that SES has selected Azure Orbital to augment their ground network needs for their [next generation MEO communication system mPower](https://www.ses.com/networks/networks-and-platforms/o3b-mpower). As part of this launch, we will be colocating new dedicated ground stations in our datacenters in addition to inter-connecting existing ground stations with our global backbone network. Allowing SES with a faster time to market with highly scalable Ground Station as a Service by leveraging cloud-based virtualized modems provided as part of the Orbital platform in addition to the Azure global backbone network.

SES will leverage our global backbone network to route their traffic globally and use Azure Orbital services to provide multiple managed services, built on top of the platform, to their customers. These services will range from security services, SDWAN, Edge compute, 5G mobility solutions to multiple other services.

### TT&C solution partner

We have partnered with [Kubos](https://www.kubos.com/) to bring Major Tom, their Cloud-Based Mission Control Software, to Azure Marketplace for Azure Orbital customers.

## Next steps

For more information on our preview, or to express interest to participate in the preview, fill the contact form [here](https://aka.ms/iaminterested), or email us at [MSAzureOrbital@microsoft.com](mailto:MSAzureOrbital@microsoft.com).
