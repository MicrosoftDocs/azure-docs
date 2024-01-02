---
title: 'Azure private multi-access edge compute'
description: Learn about the Azure private multi-access edge compute (MEC) solution that brings together a portfolio of Microsoft compute, networking and application services managed from the cloud.

author: niravi-msft
ms.service: private-multi-access-edge-compute-mec
ms.topic: overview
ms.date: 06/16/2023
ms.author: kumud

---
# What is Azure private multi-access edge compute?

Azure private multi-access edge compute (MEC) is a solution that brings together a portfolio of Microsoft compute, networking, and application services managed from the cloud. The solution enables operators and system integrators to deliver high performance, low-latency connectivity, and IoT applications at the enterprise edge for the next wave of enterprise digital transformation. 

Azure private MEC is an evolution of Private Edge Zone, expanding the scope of possibilities from a single platform and service to a solution that leverages multiple platforms and capabilities. These capabilities include edge services and applications, edge network functions, edge compute options and edge radios and devices. By processing data closer to the end device, these capabilities help improve latency- and throughput-sensitive user scenarios such as video analytics, real-time robotics and mixed IoT use cases at a global scale. Customers and partners can benefit with a complete set of Azure services and ecosystem technology components to rapidly build, deploy, and manage solutions with simplicity. 

## Benefits to customers and partners
- Enterprise customers:
    - Access to growing portfolio of  Azure services, ISVs & developer ecosystem.
    - Choice of trusted, industry-tailored solutions.
    - Fully integrated technology stack starting with a 1U footprint.

- Telco and System Integrator partners:
    - Simple to procure, deploy, manage & monetize 5G & Edge for their customer.
    - Choice of curated ecosystem of products, cloud services, and applications.
    - Access to Azure developer ecosystem.

- Application ISVs:
    - Fully featured platform to develop ultra-low latency applications. 
    - Consistent developer experience with established tools and resources.
    - Scale distribution via Microsoft  Marketplace

## Microsoft capabilities
Azure private MEC includes several capabilities from Microsoft. These include a combination of Network Function products, management services, and hardware infrastructure and services. 

### Azure Network Functions offered via Marketplace

**Azure Private 5G Core** is an Azure cloud service for deploying and managing private mobile networks for enterprises. Private mobile networks provide high performance, low latency, and secure connectivity for 5G Internet of Things (IoT) devices on an enterprise's premises.

Azure Private 5G Core enables a single private mobile network distributed across one or more sites around the world. Each site contains a packet core instance deployed on an Azure Stack Edge device.

Azure Private 5G Core allows you to use Azure to easily carry out the following tasks. 

- Deliver and automate the lifecycle of packet core instances on Azure Stack Edge devices. 
- Manage configuration. 
- Set policies for quality of service (QoS) and traffic control. 
- Provision SIMs for user equipment. 
- Monitor your private mobile network.  

For more information, see [Azure Private 5G Core](../private-5g-core/private-5g-core-overview.md).

**Affirmed Private Network Service**:  Affirmed Private Network Service is an Azure Marketplace that offers a managed private network service for Mobile Network Operators and managed services provider who want to provide 4G and 5G managed service offerings to Enterprises. APNS enables operators to provide enterprises with a carrier-grade private mobile network allows them to run and operate business critical applications requiring low-latency, high-bandwidth, and end-to-end security. It is mobile network operator integrated providing full mobility between private and public operator networks. With its automation and simplified operations, APNS delivers scalability across thousands of enterprise edge locations and uses Azure to deliver enhanced security across private networks & enterprise applications. It offers the flexibility to deploy the entire mobile core at the edge of the network, all in cloud or in a hybrid mode with control plane on cloud and user plane on enterprise edge. 

### Azure Management services

**Azure Network Functions Manager (NFM)**: Azure NFM enables the deployment of network functions to the edge using consistent Azure tools and interfaces. Use this service to deploy packet core and SD-WAN network functions to Azure Stack Edge. For more information, see [Azure Network Function Manager](../network-function-manager/overview.md).

**Arc Enabled Kubernetes**: With Azure Arc-enabled Kubernetes, you can attach and configure Kubernetes clusters located either inside or outside Azure. You can monitor and manage at scale with policy-based deployments and apply consistent security configurations at scale. Azure Arc-enabled Kubernetes works with any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters. For more information, see [Azure Arc](https://azure.microsoft.com/services/azure-arc/).

### Azure Stack hardware and services
**Azure Stack Edge**: Azure Stack Edge offers a portfolio of devices that bring compute, storage, and intelligence to the edge right where data is created. The devices are 1U rack-mountable appliances that come with 1-2 NVIDIA T4 GPUs. Azure IoT Edge allows you to deploy and manage containers from IoT Hub and integrate with Azure IoT solutions on the Azure Stack Edge. The Azure Stack Edge Pro SKU is certified to run Network Functions at the edge. For more information, see [Azure Stack Edge](https://azure.microsoft.com/products/azure-stack/edge/).

### Application services

**Azure IoT Edge Runtime**: Azure IoT Edge Runtime enables cloud workloads to be managed and deployed across edge compute appliances using the same tools and security posture as cloud native workloads. For more information, see [Azure IoT Edge Runtime](/windows/ai/windows-ml-container/iot-edge-runtime).

**Azure IoT Hub** Azure IoT Edge Runtime: Azure IoT Edge Runtime enables cloud workloads to be managed and deployed across edge compute appliances using the same tools and security posture as cloud native workloads. For more information, see [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/).

**Azure IoT Central**: Azure IoT Central is a managed application platform that enables device management and data ingestion as a service with a predictable pricing model and global scale built in. For more information, see [Azure IoT Central](https://azure.microsoft.com/services/iot-central/).

**Azure Digital Twins**: Azure Digital Twins enables device sensors to be modeled in their business context considering spatial relationships, usage patterns, and other business context that turns a fleet of devices into a digital replica of a physical asset or environment. For more information, see [Azure Digital Twins](https://azure.microsoft.com/services/digital-twins/).

## Next steps
- Learn more about [Azure Private 5G Core](/azure/private-5g-core/private-5g-core-overview)
- Learn more about [Azure Network Function Manager](/azure/network-function-manager/overview)
- Learn more about [Azure Kubernetes Service (AKS) hybrid deployment](/azure/aks/hybrid/)
- Learn more about [Azure Stack Edge](/azure/databox-online/)
- Learn more about [Affirmed Private Network Service](affirmed-private-network-service-overview.md)
