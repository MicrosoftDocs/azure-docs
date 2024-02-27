---
title: What is Azure Operator 5G Core?
description: Azure Operator 5G Core is a carrier-grade, Any-G, hybrid mobile packet core with fully integrated network functions that run both on-premises and in-cloud.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-5g-core
ms.custom: references_regions 
ms.topic: overview 
ms.date: 02/21/2024

---

# What is Azure Operator 5G Core? 

Azure Operator 5G Core is a carrier-grade, Any-G, hybrid mobile packet core with fully integrated network functions that run both on-premises and in-cloud. Service providers can deploy resilient networks with high performance and at high capacity while maintaining low latency. Azure Operator 5G Core is ideal for Tier 1 consumer networks, mobile network operators (MNO), virtual network operators (MVNOs), enterprises, IoT, fixed wireless access (FWA), and satellite network operators (SNOs). 
 
The power of Azure's global footprint ensures global coverage and operating infrastructure at scale, coupled with Microsoft’s Zero Trust security framework to provide secure and reliable connectivity to cloud applications.  
  
Sophisticated management tools and automated lifecycle management simplify and streamline network operations. Operators can efficiently accelerate migration to 5G in standalone and nonstandalone architectures, while continuing to support all legacy mobile network access technologies (2G, 3G, & 4G). 
 
Streamlined in-service software upgrades at both the platform and application layer minimize downtime and complexity during version updates, and automated rollback mechanism ensures the system can revert to the previous stable state if needed. Preconfigured templates and blueprints simplify and standardize deployment.  
  
Azure Operator 5G Core's observability stack provides a rich set of insightful dashboards out-of-the-box. Operators can use their existing analytics solutions for further analysis or use Azure Operator Insights, which combines the power of Artificial Intelligence and Machine Learning to provide advanced analytics capabilities. Azure Operator 5G Core generates detailed Event Data Records, which provide operators with the insights to optimize network performance and improve subscriber Quality of Experience. 
  

## Key Features and Benefits  

Azure Operator 5G Core includes the following benefits for operating secure. Carrier-grade network functions at scale.  

### Any-G 

Azure Operator 5G Core is a unified, ‘Any-G’ packet core network solution that uses cloud native capabilities to address 2G/3G/4G and 5G functionalities. It allows operators to deploy network functions compatible with not only legacy technologies but also with the latest 5G networks, modernizing operator networks while operating on a single, consistent platform to minimize costs. ‘Any-G’ offers the following features: 

- Common anchor points (combination nodes) that allow seamless mobility across Radio Access Technologies (RAT).  
- Common UPF instances that support all RAT types for mobility and footprint reduction.  
- Control Plane and User Plane separation providing 5G and 4G CUPS standards.  
- Consistent application of Value-added Services (VAS) regardless of the Radio Access Type.  
- Integrated probing enabling an always-on capture of User Equipment/Session activities.  
- Deployment options to use Diameter or Service-Based Interfaces (SBI), allowing operators to choose when to upgrade peer network functions.  
- Slicing, which provides flexibility in customizing the treatment of a set of devices.   

Azure Operator 5G Core offers the following network functions: 

**5G SA:** 
- Access and Mobility Management Function (AMF)  
- Session Management Function (SMF)  
- User Plane Function (UPF)  
- Network Slice Selection Function (NSSF)  
- Network Repository Function (NRF)  

**4G / 5G NSA:**  
- Mobility Management Entity (MME)  
- Packet Data Network (PDN) Gateway Control Plane Function (PGW-C)  
- PDN Gateway User Plane Function (PGW-U)  
- Serving Gateway Control Plane Function (SGW-C)  
- Serving Gateway User Plane Function (SGW-U)  

**2G / 3G:**  
- Gateway GPRS Support Node (GGSN)  
- Serving GPRS Support Node (SGSN)   
 
 :::image type="content" source="media/overview-product/all-g-network.png" alt-text="Diagram of text boxes showing the network functions supported by the all-g network offering of Azure Operator 5G Core.":::

Any-G is built on top of Azure Operator Nexus and Azure – with flexible Network Function (NF) placement based on the operator use case. Different use cases drive  NF deployment topologies. Network Functions can be placed geographically closer to the users for scenarios such as consumer, low latency, and MEC or centralized for machine to machine (Internet of Things) and enterprise scenarios. Deployment is API driven regardless of the placement of the network functions.  
  

### Resiliency  

Azure Operator 5G Core supports recovery mechanisms for failure scenarios such as single pod, multi-pod, VM, multi-VM within the same rack, and multi-VM spread across multiple racks. As the system scales to accommodate millions of subscribers, it requires mechanisms capable of addressing both internal and external faults, extending to the failure of an entire geographical location. To effectively mitigate potential disruptions and to ensure minimal impact, Azure Operator 5G Core incorporates Geographical Redundancy and In-Service Software Upgrade (ISSU) mechanisms.  

### Orchestration

Azure Operator 5G Core enables provisioning, configuration, management, and automation of complex services that span multiple NFs and analytics services in hybrid (on-premises and in-cloud) environments. This ensures consistent and efficient deployment. It supports ISSU and rollback to different versions while maintaining the baseline configuration across versions and without affecting the operations of the existing workloads.  

:::image type="content" source="media/overview-product/services-and-network-functions.png" alt-text="Diagram of text boxes showing the services available in Azure and the network functions that run on Nexus and Azure.":::

Azure Operator 5G Core’s Resource Provider (RP) provides an inventory of the deployed resources and supports monitoring and health status of current and ongoing deployments.  

### Observability

Azure Operator 5G Core supports local observability with a small footprint per cluster for both platform and application level metrics, key performance indicators, logs, alerts, alarms, traces, and event data records. Observability data for most network functions are supported via the following industry-standard Platform as a Service (PaaS) components:   
  
- Prometheus  
- Fluentd  
- Elastic  
- Alerta  
- Jaeger  
- Kafka   


Once deployed, Azure Operator 5G Core provides an inventory view of clusters and first-party network functions along with deployment and operational health status. Azure Operator 5G Core provides a rich set of out-of-the-box dashboards as well.  
  
Disconnected "break-glass" mode maintains data when connectivity between the Azure public cloud regions and local on-premises platforms is lost. Azure Operator 5G Core also allows operators to ingest the telemetry data into their chosen analytics solution for further analysis.  

## Supported Regions

Azure Operator 5G Core deployment is supported in:

- East US
- UAE North
- South Central US
- Northern Europe

## Compatibility

The table shows which versions of Azure Kubernetes/Nexus Azure Kubernetes K8s are compatible with the current Azure Operator 5G Core release. To use or update to the current version, these clusters need to be updated to the appropriate version.


|Azure Operator 5G Core Version  |AKS K8s Version   |Nexus K8s Version  |
|---------|---------|---------|
|2402.0     |   1.27.3      |     1.27.3    |



## Related content

- [Centralized Lifecycle Management in Azure Operator 5G Core](concept-centralized-lifecycle-management.md)