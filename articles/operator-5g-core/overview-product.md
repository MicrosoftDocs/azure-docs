---
title: What is Azure Operator 5G Core Preview?
description: Azure Operator 5G Core Preview is a carrier-grade, Any-G, hybrid mobile packet core with fully integrated network functions that run both on-premises and in-cloud.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-5g-core
ms.custom: references_regions 
ms.topic: overview 
ms.date: 02/21/2024

---

# What is Azure Operator 5G Core Preview? 

Azure Operator 5G Core Preview is a carrier-grade, Any-G, hybrid mobile packet core with fully integrated network functions that run both on-premises and in-cloud. Service providers can deploy resilient networks with high performance and at high capacity while maintaining low latency. Azure Operator 5G Core is ideal for Tier 1 consumer networks, mobile network operators (MNO), virtual network operators (MVNOs), enterprises, IoT, fixed wireless access (FWA), and satellite network operators (SNOs). 

 [:::image type="content" source="media/overview-product/architecture-5g-core.png" alt-text="Diagram of text boxes showing the components that comprise Azure Operator 5G Core.":::](media/overview-product/architecture-5g-core-expanded.png#lightbox)

The power of Azure's global footprint ensures global coverage and operating infrastructure at scale, coupled with Microsoft’s Zero Trust security framework to provide secure and reliable connectivity to cloud applications.  
  
Sophisticated management tools and automated lifecycle management simplify and streamline network operations. Operators can efficiently accelerate migration to 5G in standalone and non-standalone architectures, while continuing to support all legacy mobile network access technologies (2G, 3G, & 4G). 
 
Streamlined in-service software upgrades minimize downtime and complexity during version updates, and rollback mechanism ensures the system can revert to the previous stable state if needed.
  
Azure Operator 5G Core's observability stack provides a rich set of insightful dashboards out-of-the-box. Operators can use their existing analytics solutions for further analysis or use Azure Operator Insights, which combines the power of Artificial Intelligence and Machine Learning to provide advanced analytics capabilities. Azure Operator 5G Core generates detailed Event Data Records, which provide operators with the insights to optimize network performance and improve subscriber Quality of Experience. 
  

## Key features and benefits  

Azure Operator 5G Core includes the following key features for operating secure, carrier-grade network functions at scale.  

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

> [!NOTE]
> Azure Operator 5G Core Preview is provided only for 5G SA network functions.

**Network functions used for 5G SA:** 
- **Access and Mobility Management Function (AMF)** - AMF is responsible for the access and mobility management of the mobile subscribers. It is the point of contact for all mobile users in the core network. It maintains connections with the Radio Access Network (RAN) to transport signaling messages to and from the users.
- **Session Management Function (SMF)** - SMF provides session management at the highest level. It controls the creation, modification, and deletion of Protocol Data Units (PDU) sessions, providing data access from the User Equipment (UE) to one or more data networks.
- **User Plane Function (UPF)** - UPF is a fundamental component of the 5G core infrastructure system architecture, responsible for packet processing, traffic aggregation, and management functions to the edge of the network. It also provides an IP anchor point for Intra/Inter Radio Access Technology (RAT) mobility while implementing the user plane part of policy enforcement, traffic usage reporting, and lawful intercept functionality.  
- **Network Slice Selection Function (NSSF)** - NSSF supports network slice selection capabilities in the 5G network. This functionality is used by other consumer NFs such as AMF during UE procedures to ensure that the slice-specific resources (AMF, SMF, UPF) are used for the respective procedures.
- **Network Repository Function (NRF)** - NRF is responsible for the management of different NF instances and their respective profiles. It allows different NFs to dynamically register and de-register their services/profile whilst it also supports dynamic discovery of different NF instances based on their state and local policies. 

**Network functions used for 4G and 5G NSA:**  
- **Mobility Management Entity (MME)** - MME is key in managing signaling for UE access, mobility, and security in LTE networks. It establishes the connection and coordination between the UE and the evolved packet core, ensuring seamless mobility and authentication. 
- **Packet Data Network (PDN) Gateway Control Plane Function (PGW-C)** - PGW-C plays an essential role in managing session states and IP address allocation for UEs. It acts as the control plane interface between the mobile network and the PDN, orchestrating the flow of data sessions and maintaining network efficiency.  
- **PDN Gateway User Plane Function (PGW-U)** - PGW-U is responsible for the routing and forwarding of user data packets between the UE and external networks. It ensures efficient management and delivery of data traffic, maintaining the quality of service and experience for the end-user. 
- **Serving Gateway Control Plane Function (SGW-C)** - SGW-C oversees the creation and management of user plane tunnels in SGW. It is vital for maintaining session information and supporting UE mobility across different eNodeBs within the network.  
- **Serving Gateway User Plane Function (SGW-U)** - SGW-U facilitates the transfer of user data packets within the mobile network. It ensures that data packets are efficiently routed and forwarded to the right destination, supporting uninterrupted user mobility.

**Network functions used for 2G and 3G:**  
- **Gateway GPRS Support Node (GGSN)** - GGSN serves as the gateway between the General Packet Radio Service (GPRS) mobile network and external packet-switched networks. It is responsible for IP address assignment, QoS enforcement, and routing data from mobile users to external networks. 
- **Serving GPRS Support Node (SGSN)** - SGSN is responsible for the operation of GPRS and Universal Mobile Telecommunications System (UMTS) networks, managing mobile data sessions and mobility. It ensures continuous data connections and optimization as users move throughout the network, handling registration, authentication, and routing of packet data.   
 
 :::image type="content" source="media/overview-product/all-g-network.png" alt-text="Diagram of text boxes showing the network functions supported by the all-g network offering of Azure Operator 5G Core.":::

Any-G is built on top of Azure Operator Nexus and Azure – with flexible Network Function (NF) placement based on the operator use case. Different use cases drive  NF deployment topologies. Network Functions can be placed geographically closer to the users for scenarios such as consumer, low latency, and MEC or centralized for machine to machine (Internet of Things) and enterprise scenarios. Deployment is API driven regardless of the placement of the network functions.  

 [:::image type="content" source="media/overview-product/deployment-models.png" alt-text="Diagram describing supported deployment models for Azure Operator 5G Core.":::](media/overview-product/deployment-models-expanded.png#lightbox)
  

### Resiliency  

Azure Operator 5G Core supports recovery mechanisms for failure scenarios such as single pod, multi-pod, VM, multi-VM within the same rack, and multi-VM spread across multiple racks. As the system scales to accommodate millions of subscribers, it requires mechanisms capable of addressing both internal and external faults, extending to the failure of an entire geographical location. To effectively mitigate potential disruptions and to ensure minimal impact during upgrades, Azure Operator 5G Core incorporates Geographical Redundancy and In-Service Software Upgrade (ISSU) mechanisms.  

### Orchestration

Azure Operator 5G Core enables provisioning, configuration, management, and automation of complex services that span multiple NFs and analytics services in hybrid (on-premises and in-cloud) environments. This ensures consistent and efficient deployment. It supports ISSU and rollback to different versions while maintaining the baseline configuration across versions and without affecting the operations of the existing workloads.  

:::image type="content" source="media/overview-product/services-and-network-functions.png" alt-text="Diagram of text boxes showing the services available in Azure and the network functions that run on Nexus and Azure.":::

Azure Operator 5G Core’s Resource Provider (RP) provides an inventory of the deployed resources and supports monitoring and health status of current and ongoing deployments.  

### Observability

Azure Operator 5G Core supports local observability per cluster for both platform- and application-level metrics, key performance indicators, logs, alerts, alarms, traces, and event data records. Observability data for most network functions are supported via the following industry-standard Platform as a Service (PaaS) components:   
  
- Prometheus  
- Fluentd  
- Elastic  
- Alerta  
- Jaeger  
- Kafka   


Once deployed, Azure Operator 5G Core provides an inventory view of clusters and first-party network functions along with deployment and operational health status. Azure Operator 5G Core provides a rich set of out-of-the-box dashboards as well.  
  
Disconnected "break-glass" mode maintains data when connectivity between the Azure public cloud regions and local on-premises platforms is lost. Azure Operator 5G Core also allows operators to ingest the telemetry data into their chosen analytics solution for further analysis.  

### Key benefits

The key benefits of Azure Operator 5G Core include:  

- High user plane performance with inline user-plane services. 
- API-based NF lifecycle management (LCM) via Azure, regardless of deployment model.
- Advanced analytics via Azure Operator Insights.
- Cloud-native architecture with no rigid deployment constraints.
- Support for  Microsoft’s Zero-Trust security model. 

## Supported regions

For Public Preview, Azure Operator 5G Core deployment is supported in the following Azure regions:

- East US
- UAE North
- South Central US
- Northern Europe

## Compatibility

The table shows which versions of Azure Kubernetes/Nexus Azure Kubernetes K8s are compatible with the current Azure Operator 5G Core release. To use or update to the current version, these clusters need to be updated to the appropriate version.


|Azure Operator 5G Core Version  |AKS K8s Version   |Nexus K8s Version  |
|---------|---------|---------|
|2402.0     |   1.27.9      |     1.27.3    |



## Related content

- [Centralized Lifecycle Management in Azure Operator 5G Core Preview](concept-centralized-lifecycle-management.md)