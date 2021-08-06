---
title: 'Azure private multi-access edge compute'
description: Learn about the Azure private multi-access edge compute (MEC) solution that brings together a portfolio of Microsoft compute, networking and application services managed from the cloud.

author: niravi-msft
ms.service: private-multi-access-edge-compute-mec
ms.topic: overview
ms.date: 06/16/2021
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

**Metaswitch Fusion Core**: Fusion Core is a fully containerized 5G Core solution that supports all network functions needed for connectivity between IoT devices connected over 4G or 5G radio to the data network. The solution delivers some of the following key benefits:
 - easily deployed and provisioned from the Azure Marketplace portal on the Azure Stack Edge.
 - high performance of 25 Gbps of throughput in an exceptionally low compute footprint of four physical cores.
 - support for both 4G and 5G standalone access types.
 - built-in tooling for enterprise-centric service assurance and KPI dashboards. 
 
Fusion Core enables ISVs to deploy applications on the same Azure Stack Edge node for IoT Edge applications like live video analytics. 

**Affirmed Private Network Service**:  Affirmed Private Network Service is an Azure Marketplace that offers a managed private network service for Mobile Network Operators and managed services provider who want to provide 4G and 5G managed service offerings to Enterprises. APNS enables operators to provide enterprises with a carrier-grade private mobile network allows them to run and operate business critical applications requiring low-latency, high-bandwidth, and end-to-end security. It is mobile network operator integrated providing full mobility between private and public operator networks. With its automation and simplified operations, APNS delivers scalability across thousands of enterprise edge locations and uses Azure to deliver enhanced security across private networks & enterprise applications. It offers the flexibility to deploy the entire mobile core at the edge of the network, all in cloud or in a hybrid mode with control plane on cloud and user plane on enterprise edge. 

### Azure Management services

**Azure Network Functions Manager (NFM)**: Azure NFM enables the deployment of network functions to the edge using consistent Azure tools and interfaces. Use this service to deploy packet core and SD-WAN network functions to Azure Stack Edge. For more information, see [Azure Network Function Manager](../network-function-manager/overview.md).

**Arc Enabled Kubernetes**: With Azure Arc–enabled Kubernetes, you can attach and configure Kubernetes clusters located either inside or outside Azure. You can monitor and manage at scale with policy-based deployments and apply consistent security configurations at scale. Azure Arc–enabled Kubernetes works with any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters. For more information, see [Azure Arc](https://azure.microsoft.com/services/azure-arc/).

### Azure Stack hardware and services
**Azure Stack Edge**: Azure Stack Edge offers a portfolio of devices that bring compute, storage, and intelligence to the edge right where data is created. The devices are 1U rack-mountable appliances that come with 1-2 NVIDIA T4 GPUs. Azure IoT Edge allows you to deploy and manage containers from IoT Hub and integrate with Azure IoT solutions on the Azure Stack Edge. The Azure Stack Edge Pro SKU is certified to run Network Functions at the edge. For more information, see [Azure Stack Edge](https://azure.microsoft.com/products/azure-stack/edge/).

**Azure Stack HCI**: Azure Stack HCI is a new hyper-converged infrastructure (HCI) operating system delivered as an Azure service that provides the latest security, performance, and feature updates. Deploy and run Windows and Linux virtual machines (VMs) in your datacenter, or, at the edge using your existing tools and processes. Extend your datacenter to the cloud with Azure Backup, Azure Monitor, and Azure Security Center. For more information, see [Azure Stack HCI](https://azure.microsoft.com/products/azure-stack/hci/).

### Application services

**Azure IoT Edge Runtime**: Azure IoT Edge Runtime enables cloud workloads to be managed and deployed across edge compute appliances using the same tools and security posture as cloud native workloads. For more information, see [Azure IoT Edge Runtime](/windows/ai/windows-ml-container/iot-edge-runtime).

**Azure IoT Hub** Azure IoT Edge Runtime: Azure IoT Edge Runtime enables cloud workloads to be managed and deployed across edge compute appliances using the same tools and security posture as cloud native workloads. For more information, see [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/).

**Azure IoT Central**: Azure IoT Central is a managed application platform that enables device management and data ingestion as a service with a predictable pricing model and global scale built in. For more information, see [Azure IoT Central](https://azure.microsoft.com/services/iot-central/).

**Azure Digital Twins**: Azure Digital Twins enables device sensors to be modeled in their business context considering spatial relationships, usage patterns, and other business context that turns a fleet of devices into a digital replica of a physical asset or environment. For more information, see [Azure Digital Twins](https://azure.microsoft.com/services/digital-twins/).

## Next steps
- Learn more about [Metaswitch Fusion Core](metaswitch-fusion-core-overview.md)
- Learn more about [Affirmed Private Network Service](affirmed-private-network-service-overview.md)
