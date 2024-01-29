---
title: What is Azure Operator 5G Core?
description: Azure Operator 5G Core (AO5GC) is a carrier-grade, Any-G, hybrid mobile packet core with fully integrated network functions that run both on-premises and in-cloud.
author: HollyCl
ms.author: HollyCl
ms.service: azure
ms.topic: overview 
ms.date: 01/29/2024

---


# What is Azure Operator 5G Core? 

Azure Operator 5G Core (AO5GC) is a carrier-grade, Any-G, hybrid mobile packet core with fully integrated network functions that run both on-premises and in-cloud. Service providers can deploy resilient networks with high performance and at high capacity while maintaining low latency. The AO5GC is ideal for Tier 1 consumer networks, mobile network operators (MNO), virtual network operators (MVNOs), enterprises, IoT, fixed wireless access (FWA), and satellite network operators (SNOs). 
 
The power of Azure's global footprint ensures global coverage and operating infrastructure at scale, coupled with Microsoft’s Zero Trust security framework to provide secure and reliable connectivity to cloud applications.  
  
Sophisticated management tools and automated lifecycle management simplify and streamline network operations. Operators can efficiently accelerate migration to 5G in standalone and non-standalone architectures, while continuing to support all legacy mobile network access technologies (2G, 3G, & 4G). 
 
Streamlined in-service software upgrades at both the platform and application layer minimize downtime and complexity during version updates, and automated rollback mechanism ensures the system can revert to the previous stable state if needed. Preconfigured templates and blueprints simplify and standardize deployment.  
  
The AO5GC's observability stack provides a rich set of insightful dashboards out-of-the-box. Operators can use their existing analytics solutions for further analysis or use Azure Operator Insights, which combines the power of Artificial Intelligence and Machine Learning to provide advanced analytics capabilities. AO5GC generates detailed Event Data Records, which provide operators with the insights to optimize network performance and improve subscriber Quality of Experience. 
  

## Key Features and Benefits  

AO5GC includes the following benefits for operating secure, carrier-grade network functions at scale.  

### Any-G 

AO5GC is a unified, ‘Any-G’ packet core network solution that uses cloud native capabilities to address 5G and 2G/3G/4G Evolved Packet Core (EPC) functionality. AO5GC allows operators to deploy network functions compatible with 5G networks, modernizing operator networks while operating on a single, consistent platform to minimize costs. ‘Any-G’ offers the following features:  

- Common anchor points (combination nodes) that allow seamless mobility across Radio Access Technologies (RAT).  
- Common UPF instances that support all RAT types for mobility and footprint reduction.  
- Control Plane / User Plane Separation-based EPC deployments.  
- Consistent application of Value-added Services (VAS) regardless of the Radio Access Type.  
- Integrated probing enabling an always-on capture of User Equipment/Session activities.  
- Deployment options to use Diameter or Service-Based Interfaces (SBI), allowing operators to choose when to upgrade peer network functions.  
- Slicing, which provides flexibility in customizing the treatment of a set of devices.   

AO5GC offers the following network functions: 

**5G SA:** 
- Access and Mobility Management Function (AMF)  
- Session Management Function (SMF)  
- User Plane Function (UPF)  
- Network Slice Selection Function (NSSF)  
- Network Repository Function (NRF)  

**4G / 5G NSA:**  
- Mobility Management Entity (MME)  
- PDN Gateway Control Plane Function (PGW-C)  
- PDN Gateway User Plane Function (PGW-U)  
- Serving Gateway Control Plane Function (SGW-C)  
- Serving Gateway User Plane Function (SGW-U)  

**2G / 3G:**  
- Gateway GPRS Support Node (GGSN)  
- Serving GPRS Support Node (SGSN)   
 
 :::image type="content" source="media/overview-product/all-g-network.png" alt-text="Text boxes showing the network functions supported by the all-g network offering of Azure Operator 5G Core":::

Any-G is built on top of Azure Operator Nexus and Azure – with flexible Network Function (NF) placement based on the operator use case. Different use cases drive different NF deployment topologies. NF resources can be placed closer to the User Equipment (UE) point of attachment – eMBB, URLLC, MEC (on-premises) – or centralized IOT/Enterprise (cloud). A consistent operator interface from the NFV-I to the application is provided regardless of the placement of the NFs, allowing the operator to focus on their wireless business instead of the network.  
  

### Resiliency  

AO5GC supports recovery mechanisms for failure scenarios such as single pod, multi-pod, VM, multi-VM within the same rack, and multi-VM spread across multiple racks. As the system scales to accommodate millions of subscribers, it requires mechanisms capable of addressing both internal and external faults, extending to the failure of an entire geographical location. To effectively mitigate potential disruptions and to ensure minimal impact, AO5GC incorporates Geographical Redundancy and In-Service Software Upgrade (ISSU) mechanisms.  

### Orchestration

AO5GC enables provisioning, configuration, management, and automation of complex services that span multiple NFs and analytics services in hybrid (on-premises and in-cloud) environments. This ensures consistent and efficient deployment. It supports ISSU and rollback to different versions while maintaining the baseline configuration across versions and without affecting the operations of the existing workloads.  

:::image type="content" source="media/overview-product/services-and-network-functions.png" alt-text="Text boxes showing the services available in Azure and the network functions that run on Nexus and Azure":::

AO5GC’s Resource Provider (RP) provides an inventory of the deployed resources and supports monitoring and health status of current and ongoing deployments.  

### Observability

AO5GC supports local observability with a small footprint per cluster for both platform and application level metrics, key performance indicators, logs, alerts, alarms, traces, and event data records. Observability data for most network functions are supported via the following industry-standard Platform as a Service (PaaS) components:   
  
- Prometheus  
- Fluentd  
- Elastic  
- Alerta  
- Jaeger  
- Kafka   
    
Once deployed, AO5GC provides an inventory view of clusters and first-party network functions along with deployment and operational health status. AO5GC provides a rich set of out-of-the-box dashboards as well.  
  
Disconnected "break-glass" mode maintains data when connectivity between the Azure public cloud regions and local on-premises platforms is lost. AO5GC also allows operators to ingest the telemetry data into their chosen analytics solution for further analysis.  

## Related content

- [Azure Operator 5G Core architecture](overview-architecture.md)
- [Centralized Lifecycle Management in Azure Operator 5G Core](concept-centralized-lifecycle-management.md)