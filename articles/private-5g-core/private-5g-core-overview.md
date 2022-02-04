---
title: What is Azure Private 5G Core Preview?
description: Azure Private 5G Core Preview is an Azure cloud service for deploying on-premises private mobile networks to serve 5G Internet of Things (IoT) devices. 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: overview 
ms.date: 12/22/2021
ms.custom: template-overview
---

# What is Azure Private 5G Core Preview?

Azure Private 5G Core Preview is an Azure cloud service for deploying and managing private mobile networks for enterprises. Private mobile networks provide high performance, low latency, and secure connectivity for 5G Internet of Things (IoT) devices on an enterprise's premises.

Azure Private 5G Core enables a single private mobile network distributed across one or more sites around the world. Each site contains a packet core instance deployed on an Azure Stack Edge device.

Each packet core instance is a cloud-native implementation of the 3GPP standards-defined 5G Next Generation Core (5G NGC or 5GC). A packet core instance authenticates end devices and aggregates their data traffic over 5G Standalone wireless and access technologies. Each packet core instance includes the following components:

- A high performance and highly programmable 5G user plane function (UPF).
- Core control plane functions including policy and subscriber management.
- A portfolio of service-based architecture elements. 
- Management components for network monitoring.

You can also deploy packet core instances in 4G mode to support Private Long-Term Evolution (LTE) use cases. For example, you can use the 4G Citizens Broadband Radio Service (CBRS) spectrum. 4G mode uses the same cloud-native components as 5G mode (such as the UPF). This is in contrast to other solutions that need to revert to a legacy 4G stack.

Each packet core instance is standards-compliant and compatible with several Radio Access Network (RAN) partners in the Azure private multi-access edge compute (MEC) ecosystem. For more information, see [What is Azure private multi-access edge compute?](/azure/private-multi-access-edge-compute-mec/overview).

Azure Private 5G Core allows you to use Azure easily carry out the following tasks: 

- Deliver and automate the lifecycle of packet core instances on Azure Stack Edge devices. 
- Manage configuration. 
- Set policies for Quality of Service (QoS) and traffic control. 
- Provision SIMs for User Equipment. 
- Monitor your private mobile network.

## 5GC features

|Feature  |Description  |
|---------|---------|
|**Supported 5G network functions**|<ul><li>Access and Mobility Management Function (AMF)</li><li>Session Management Function (SMF)</li><li>User Plane Function (UPF)</li><li >Policy Control Function (PCF)</li><li>Authentication Server Function (AUSF)</li><li>Unified Data Management (UDM)</li><li>Unified Data Repository (UDR)</li><li>Network Repository Function (NRF)</li>|
|**Supported 5G procedures**| For information on Azure Private 5G Core's support for standards-based 5G procedures, see [Statement of compliance - Azure Private 5G Core](statement-of-compliance.md).|
|**User Equipment (UE) authentication**|<ul><li>Security Anchor Function (SEAF) support to provide authentication functionality in the serving network.</li><li>Authentication using Subscription Permanent Identifiers (SUPI) and Globally Unique Temporary Identities (5G-GUTI).</li><li>Assignment or reallocation of a 5G-GUTI to a UE.</li><li>5G Authentication and Key Agreement (5G-AKA) for mutual authentication between UEs and the network.</li></ul>|
|**UE security context management**|<p>The packet core instance performs ciphering and integrity protection of 5G non-access stratum (NAS). During UE registration, the UE includes its security capabilities for 5G NAS with 128-bit keys.</p><p>Azure Private 5G Core supports the following algorithms for ciphering and integrity protection:</p><ul><li>5GS null encryption algorithm</li><li>128-bit Snow3G</li><li>128-bit Advanced Encryption System (AES) encryption</li></ul>|
|**UE maximum transmission unit (MTU) configuration**|The packet core instance signals the MTU for a data network to UEs on request. It does this as part of PDU session establishment procedures to avoid fragmentation.|
|**Index to RAT/Frequency Selection Priority (RFSP)**|The packet core instance can provide a RAN with an RFSP Index. The RAN can match the RFSP Index to its local configuration to apply specific radio resource management (RRM) policies, such as cell reselection or frequency layer redirection.|

## Packet core architecture

The following diagram shows the network functions supported by a packet core instance. It also shows the interfaces these network functions use to interoperate with third-party components.

:::image type="complex" source="media/azure-private-5g-core/packet-core-architecture.png" alt-text="Packet core architecture diagram displaying each of the supported network functions and their interfaces.":::
   Diagram displaying the packet core architecture. The packet core includes the following network functions: the A M F, the S M F, the U P F, the U D R, the N R F, the P C F, the U D M, and the A U S F. The A M F communicates with 5G User Equipment over the N1 interface. A G Node B provided by a Microsoft partner communicates with the A M F over the N2 interface and the U P F over the N3 interface. The U P F communicates with the data network over the N6 interface. Several network functions use the N A F interface to communicate with the Application Function, which is provided by a service provider or enterprise.
:::image-end:::

## Why use Azure Private 5G Core?

### Deployment at the enterprise edge

Azure Private 5G Core lets you deploy packet core instances directly on an enterprise's premises, using an Azure Stack Edge infrastructure.

Deploying a packet core instance at the enterprise edge ensures complete ownership of all data by the enterprise. It also positions the packet core instance as close as possible to the devices it serves, removing any reliance on cloud connectivity. This allows it to deliver low latency levels through local data processing when combined with application logic in the same location. This provides a number of valuable benefits.

- **Machine to machine automation** - Ultra Reliable Low Latency Connectivity (URLLC) for command and control messages from automated systems (like robots or automated guide vehicles). These messages can be processed in real time to prevent stalling, enabling high productivity.
- **Massive IoT telemetry** - secure cloud connectivity for data collection from a large density and volume of IoT sensors and devices. Data for health assessment and automated systems can be processed in real time to prevent accidents and ensure on-site safety.
- **Real-time analytics** - local processing of real-time operational and diagnostics data such as live video feeds can be AI processed at the edge at minimal expense, ensuring vital actions aren't delayed.

:::image type="content" source="media/azure-private-5g-core/enterprise-edge-latency.png" alt-text="Diagram showing low latency levels for services deployed on Azure Stack Edge devices compared to the Azure/Network Edge and Azure Hyperscale Cloud.":::

Azure Private 5G Core is able to leverage this low latency with the security and high bandwidth offered by private 5G networks. This puts it in the optimal position to support Industry 4.0 use cases, such as the following:

- **Manufacturing** - Production-line analytics and warehouse automation with robots.
- **Public safety** - Mobility and connectivity for emergency workers and disaster recovery operatives.
- **Energy and utilities** - Backhaul networks for smart meters and network slicing/control.
- **Defense** - Connected command posts and battlefield with real-time analytics.
- **Smart farms** - Connected equipment for farm operation.

Each packet core instance is connected to the local RAN network to provide coverage for cellular wireless devices. You can choose to limit these devices to local connectivity. Alternatively, you can provide multiple routes to the cloud, Internet, or other enterprise data centers running IoT and automation applications.

### Flexible integration with other solution components

Azure Private 5G Core exposes an N2 and N3 interface for the 5G control plane and user plane respectively. It complies with the following 3GPP Technical Specifications, allowing you to integrate with a wide range of Radio Access Network (RAN) models:

- [TS 38.413](https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3223) for the N2 interface.
- [TS 29.281](https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=1699) for the N3 interface.

For 4G, it exposes S1-MME and S1-U interfaces to interoperate with 4G RAN models.

It also employs a simple, scalable provisioning model to allow you to bring the SIM partner of your choice to Azure.

### Native Azure service management

Azure Private 5G Core is available as a native Azure service, offering the same levels of reliability, security, and availability for deployment and management that are key tenets of all Azure services. This allows you to use the Azure portal and Azure Resource Manager (ARM) APIs to do any of the following from anywhere in the world:

- Deploy and configure a packet core instance on your Azure Stack Edge device in minutes.
- Create a virtual representation of your physical mobile network through Azure using mobile network and site resources.
- Provision SIM resources to authenticate devices in the network, while also supporting redundancy.
- Employ Log Analytics and other observability services to view the health of your network and take corrective action through Azure.
- Use Azure role-based access control (RBAC) to allow granular access to the private mobile network to different personnel or teams within your organization, or even a managed service provider.
- Use an Azure Stack Edge device's compute capabilities to run applications that can benefit from low-latency networks.
- Seamlessly connect your existing Azure deployments to your new private mobile network using Azure hybrid compute, networking, and IoT services.
- Access the large ecosystem of Microsoft Independent Software Vendor (ISV) partners for applications and network functions.
- Utilize Azure Lighthouse and the Azure Expert Managed Services Provider (MSP) program to simplify the end-to-end deployment of a private mobile network through Azure.

### Log Analytics integration

Azure Private 5G Core is integrated with the Azure Log Analytics tool, as described in [Overview of Log Analytics in Azure Monitor](/azure/azure-monitor/logs/log-analytics-overview). You can write queries to retrieve records or visualize data in charts. This lets you monitor and analyze activity in your private mobile network directly from the Azure portal.

:::image type="content" source="media/azure-private-5g-core/log-analytics-tool.png" alt-text="Log analytics tool showing a query made on devices registered with the private mobile network.":::

### Distributed tracing

Azure Private 5G Core provides proactive, real-time analysis of all message traffic, including NGAP/NAS messages and HTTP requests and responses. You can use the distributed tracing web GUI to collect detailed traces for signaling flows involving packet core instances. These can be used to diagnose many common configuration, network, and interoperability problems affecting user service.

:::image type="content" source="media/azure-private-5g-core/distributed-tracing-web-gui.png" alt-text="Screenshot of the distributed tracing web GUI displaying details of a successful PDU session establishment.":::

## Azure services consumed by Azure Private 5G Core

Azure Private 5G Core includes and utilizes the following Azure services:

- **Azure Cloud Services** - you can deploy and manage your private mobile network using the cloud, as described in [Native Azure service management](#native-azure-service-management).
- **Azure Stack Edge** - each packet core instance must be deployed on an Azure Stack Edge Pro with GPU.
- **Azure Network Function Manager** - Azure Network Function Manager allows you to deploy a packet core instance to your Azure Stack Edge device using consistent Azure tools and interfaces. For more information, see [Azure Network Function Manager](/azure/network-function-manager/overview).
- **Azure Arc-enabled Kubernetes** - each packet core instance runs on a Kubernetes cluster. With Azure Arc enabled Kubernetes, you can attach and configure this cluster directly through Azure tools and interfaces. For more information, see [Azure Arc](https://azure.microsoft.com/services/azure-arc/).

## Next steps

- [Learn more about the key components of a private mobile network](key-components-of-a-private-mobile-network.md)
- [Learn more about the prerequisites for deploying a private mobile network](complete-private-mobile-network-prerequisites.md)
