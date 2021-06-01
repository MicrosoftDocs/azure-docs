---
title: 'Azure private multi-access edge compute'
description: Learn about the AAzure private multi-access edge compute (MEC) solution that brings together a portfolio of Microsoft compute, networking and application services managed from the cloud.
services: vnf-manager
author: KumudD
ms.service: vnf-manager
ms.topic: overview
ms.date: 06/01/2021
ms.author: kumud

---
# What is Azure private multi-access edge compute?

Azure private multi-access edge compute (MEC) is a solution that brings together a portfolio of Microsoft compute, networking and application services managed from the cloud. The solution enables operators and system integrators to deliver high performance, low-latency connectivity and IoT applications at the enterprise edge for the next wave of enterprise digital transformation. 
Azure private MEC is an evolution of Private Edge Zone, expanding the scope of possibilities from a single platform and service to a solution that leverages multiple platforms and capabilities. These capabilities include edge services and applications, edge network functions, edge compute options and edge radios and devices By processing data closer to the end device, these capabilities help improve latency- and throughput-sensitive user scenarios such as video analytics, real-time robotics and mixed IoT use cases at a global scale. Customers and partners can benefit with a complete set of Azure services and ecosystem technology components to rapidly build, deploy, and manage solutions with simplicity. 

## Benefits to customers and partners
- Enterprise customers:
    - Access to growing portfolio of  Azure services, ISVs & developer ecosystem.
    - Choice of trusted, industry-tailored solutions.
    - Fully integrated starting with 1U footprint 

- Telco and System Integrator partners:
- Simple to procure, deploy, manage & monetize 5G & Edge.
- Choice of curated ecosystem of products, cloud services, and applications.
- Access to Azure developer ecosystem.

- Application ISVs:
    - Fully featured platform to develop ultra-low latency applications. 
    - Consistent developer experience with established tools and resources.
    - Scale distribution via Microsoft  Marketplace

## Microsoft capabilities
Azure private MEC includes several capabilities from Microsoft. These include a combination of Network Function products, orchestration services, and hardware infrastructure. 

### Azure Network Functions

**Metaswitch Fusion Core**: Fusion Core is a fully containerized 5G Core solution that supports all network functions needed for connectivity between IoT devices connected over 4G or 5G radio to the data network. The solution delivers key benefits - easily deployed and provisioned from the Azure Marketplace portal on the Azure Stack Edge; high performance of 25 Gbps of throughput in an exceptionally low compute footprint of four physical cores; support for both 4G and 5G standalone access types; and offers built-in tooling for enterprise-centric service assurance and KPI dashboards. Fusion enables ISVs to deploy applications on the same Azure Stack Edge node for IoT Edge applications like live video analytics. 

**Affirmed Private Network Service**: Affirmed Private Network Service offers a complete managed service to telcos that can use a carrier-class 4G/5G control plane and deploy it in macros/distributed deployment models for wide scale mobility. 

### Orchestration services

**Azure Network Function Manager (NFM)**: Azure NFM is an orchestration service that allows the deployment of network functions to the edge using consistent Azure tools and interfaces. Use this service to deploy packet core, SD-WAN and firewall network functions. The service enables the deployment of Virtual Network Functions (VNF) to the Azure Stack Edge. In future, this will expand to include the deployment of Containerized Network Functions (CNFs) to the Azure Stack Edge and other first- and third-party hardware infrastructure. 

**Arc Enabled Kubernetes**: With Azure Arc enabled Kubernetes, you can attach and configure Kubernetes clusters located either inside or outside Azure. You can monitor and manage at scale with policy-based deployments and apply consistent security configurations at scale. Azure Arc enabled Kubernetes works with any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters. For more information, see [Azure Arc](https://azure.microsoft.com/en-us/services/azure-arc/).

### Hardware infrastructure 
**Azure Stack Edge**: Azure Stack Edge offers a portfolio of devices that bring compute, storage and intelligence to the edge right where data is created. These are 1U rack-mountable appliance that come with 1-2 NVIDIA T4 GPUs. Azure loT Edge allows you to deploy and manage containers from loT Hub and integrate with Azure loT solutions on the Azure Stack Edge. The Azure Stack Edge Pro SKU is certified to run Network Functions at the edge. For more information, see [Azure Stack Edge](https://azure.microsoft.com/en-us/products/azure-stack/edge/).

**Azure Stack HCI**: Azure Stack HCI is a new hyper-converged infrastructure (HCI) operating system delivered as an Azure service that provides the latest security, performance, and feature updates. Deploy and run Windows and Linux virtual machines (VMs) in your datacenter or at the edge using your existing tools, processes, and skill sets. Extend your datacenter to the cloud with Azure Backup, Azure Monitor, and Azure Security Center. For more information, see [Azure Stack HCI](https://azure.microsoft.com/en-us/products/azure-stack/hci/).

### Application services 
**Azure IoT Edge Runtime**: Azure IoT Edge Runtime enables cloud workloads to be managed and deployed across edge compute appliances using the same tools and security posture as cloud native workloads.
**Azure IoT Hub** Azure IoT Hub enables high speed data ingestion and device provisioning for edge devices.
**Azure IoT Central**: Azure IoT Central is a managed application platform that enables device management and data ingestion as a service with a predictable pricing model and global scale built in.
**Azure Digital Twins**: Azure Digital Twins enables device sensors to be modeled in their business context considering spatial relationships, usage patterns and other business context that turns a fleet of devices into a digital replica of a physical asset or environment.

## Next steps
- Learn more about [Metaswitch Fusion Core](metaswitch-overview.md)
- Learn more about [Affirmed Private Network Service](affirmed-overview.md)


