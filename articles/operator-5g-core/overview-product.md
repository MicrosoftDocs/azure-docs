---
title: What is AO5GC?
description: Learn about Azure Operator 5G Core and its components.
author: HollyCl
ms.author: HollyCl
ms.service: operator-5g-core
ms.topic: overview #required; leave this attribute/value as-is.
ms.date: 01/08/2024
---
# What is Azure Operator 5G Core?

AO5GC is a customizable mobile packet core service that delivers mobile core network functions on Azure Operator Nexus (on-premises), Azure (public cloud), or hybrid platforms. It  enables service providers to create 5G core connectivity. To simplify and streamline the deployment process, AO5GC automates the deployment and Day-0 configuration of the packet core elements on all supported platforms via the Azure Resource Manager CLI/API0s.

This service is versatile, and supports older technologies including 2G, 3G, and 4G, as well as nonstandalone 5G networks. Sophisticated management tools and automated lifecycle management simplify and streamline network operations. Operators can efficiently accelerate migration to 5G in standalone and nonstandalone architectures, while continuing to support all legacy mobile network access technologies. 

The Azure portal enables you to manage packet core components with a centralized view of the deployed resources and the health of these resources. It supports robust monitoring tools and alerting systems to identify issues and facilitate prompt resolution. AI-enabled analytics and business insights ensure that service level agreements are met.

Streamlined upgrades minimize downtime and complexity during version updates, and automated rollback mechanism ensures the system can revert to the previous stable state if needed. Preconfigured templates and blueprints simplify and standardize deployment.

## Key Features and Benefits

Azure Operator 5G Core includes the following benefits for operating secure carrier-grade network functions at scale.

### Any-G
The AO5GC Any-G is a core network solution that uses cloud native capabilities to address 5G (5GC) and 2G/3G/4G (EPC), functionality. AO5GC allows you to deploy network functions compatible with 5G networks, modernizing your network while operating on a single, consistent platform to minimize costs. 

:::image type="content" source="media/overview-any-g-solution.png" alt-text="image that shows the network function components available on AO5G's Any-G solution.":::

AO5GC offers the following network functions:
- 5G SA:
    - Access and Mobility Management Function (AMF)
    - Session Management Function (SMF)
    - User Plane Function (UPF)
    - Network Slice Selection Function (NSSF)
    - NF Repository Function (NRF)
- 4G / 5G NSA:
    - Mobility Management Entity (MME)
    - PDN Gateway Control Plane Function (PGW-C)
    - PDN Gateway User Plane Function (PGW-U)
    - Serving Gateway Control Plane Function (SGW-C)
    - Serving Gateway User Plane Function (SGW-U)
- 2G / 3G:
    - Gateway GPRS Support Node (GGSN)
    - Serving GPRS Support Node (SGSN) 

Any-G is built on top of Microsoft Operator Nexus and Azure – with flexible Network Function (NF) placement based on the operator use case. Different use cases drive different NF deployment topologies. NF resources can be placed closer to UE point of attachment – eMBB/URLCC/MEC (on-premises) – or centralized – IOT/Enterprise (cloud). A consistent operator interface from the NFV-I to the application is provided regardless of the placement of the NFs allowing the operator to focus on their wireless business instead of the network. 

### Resiliency

AO5GC supports recovery mechanisms for failure scenarios such as Single Pod, Multi-Pod, VM, Multi VM within the same rack, and multi-VM spread across multiple racks. As the system scales to accommodate millions of subscribers, there arises a necessity to implement various mechanisms capable of addressing both internal and external faults, extending to the failure of an entire geographical location. To effectively mitigate potential disruptions and ensure minimal impact, AO5GC incorporates Geographical Redundancy mechanisms and In-Service Software Upgrade mechanisms.

## Orchestration

AO5GC enables you to automate provisioning, configuration, and management of complex services that span multiple NFs and analytics services in on-premises, cloud or hybrid environments. This ensures consistent and efficient deployment. It supports upgrade and rollback to different versions while maintaining the operator-intended configuration across versions and not affecting the operations of the existing workloads. 
 
:::image type="content" source="media/overview-orchestration.png" alt-text="Image detailing services in Azure as well as network functions that can run on Nexus and/or Azure":::

AO5GC's Resource Provider (RP) provides an inventory of the deployed resources and supports monitoring and health status of current and ongoing deployments.

## Observability

AO5GC allows you to monitor the performance of your networks and applications efficiently. It enables local observability with a small footprint per cluster for both platform and application level metrics, key performance indicators, logs, alerts, alarms, traces, and event data records. Observability data for most network functions are supported via the following industry-standard PaaS components:
 
- Prometheus
- Fluentd
- Elastic
- Alerta
- Jaeger
- Kafka 

Once deployed, AO5GC provides an inventory view of clusters and first-party network functions along with deployment and operation health status. AO5GC provides a rich out-of-the-box set of Grafana dashboards as well. 

Disconnected "break-glass" mode maintains data when connectivity between the Azure public cloud regions and local on-premises platforms is lost. AO5GC also allows operators to ingest the telemetry data into their chosen analytics solution for further analysis.

## Related content

- [Azure Operator 5G Core architecture](overview-architecture.md)
- [Supported features](concept-supported-features.md)
 [Build a 5G Core network](concept-build-5g-core-network.md)