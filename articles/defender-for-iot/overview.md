---
title: Service overview
description: Learn more about Defender for IoT features and services, and understand how Defender for IoT provides comprehensive IoT security.
services: defender-for-iot
ms.service: azure
documentationcenter: na
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/09/2020

---

# Welcome to Azure Defender for IoT

Operational technology (OT) networks power many of the most critical aspects of our society, but many of these existing technologies were not designed with security in mind and cannot be protected with traditional IT security controls. Meanwhile, the Internet of Things (IoT) is enabling a new wave of innovation with billions of connected devices, increasing the attack surface and risk.  

Azure Defender for IoT is a unified security solution for identifying IoT/OT assets, vulnerabilities, and threats. It enables you to secure your entire IoT/OT environment, whether you need to protect existing IoT/OT devices or build security into new IoT innovations.  

Azure Defender for IoT offers two sets of capabilities to fit your environment’s needs.

For end-user organizations with IoT/OT environments, Azure Defender for IoT delivers agentless, network-layer monitoring that can be rapidly deployed, integrates easily with diverse industrial equipment and SOC tools, and has zero impact on IoT/OT network performance or stability. It can be deployed fully on-premises or in Azure-connected and hybrid environments.  

For IoT device builders, Azure Defender for IoT also offers lightweight micro agents supporting standard IoT operating systems, such as Linux and RTOS, to ensure security is built into your IoT/OT initiatives from the edge to the cloud. This lightweight agent includes source code for flexible, customizable deployment. 

## Agentless solution for organizations 

Legacy IoT and OT devices don’t support agents and are often unpatched, misconfigured, and invisible to IT teams – making them soft targets for threat actors looking to pivot deeper into corporate networks. 

Traditional network security monitoring tools developed for corporate IT networks are unable to address these environments because they lack a deep understanding of the specialized protocols, devices, and machine-to-machine (M2M) behaviors found in IoT and OT environments. 

Azure Defender for IoT’s agentless monitoring capabilities gives you visibility and security for these networks, addressing key concerns for these environments. 

**Automatic device discovery**  
Use passive, agentless network monitoring to gain a complete inventory of all your IoT/OT assets, their details, and how they communicate, with zero impact on the IoT/OT network.  

**Proactive visibility into risk and vulnerabilities**  
Identify risks and vulnerabilities in your IoT/OT environment, including unpatched devices, open ports, unauthorized applications, and unauthorized connections, as well as changes to devices configurations, PLC code, and firmware. 

**IoT/OT threat detection**  
Detect anomalous or unauthorized activities with specialized IoT/OT-aware threat intelligence and behavioral analytics, including advanced threats missed by static IOCs like zero-day malware, fileless malware, and living-off-the-land tactics. 

**Unified security management across IT/OT**
Integrate into Azure Sentinel for a bird’s eye view of your entire organization. Implement unified IT/OT security governance with integration into your existing workflows, including third-party tools like Splunk, IBM Qradar, and ServiceNow. 

## Agent-based solution for device builders 

Security is a near-universal concern for IoT implementors. IoT devices have unique needs for endpoint monitoring, security posture management, and threat detection – all with highly specific performance requirements. 

The Azure Defender for IoT security agents allows you to build security directly into your new IoT devices and Azure IoT projects. The micro agent has flexible deployment options, including the ability to deploy as a binary package or modify source code, and is available for standard IoT operating systems like Linux and Azure RTOS.  

The Azure Defender for IoT micro agent provides endpoint visibility into security posture management, threat detection, and integration into Microsoft’s other security tools for unified security management. 

**Security posture management**

Proactively monitor the security posture of your IoT devices. Azure Defender for IoT provides security posture recommendations based on the CIS benchmark, as well as device-specific recommendations. Get visibility into operating system security, including OS configuration, firewall configurations, permissions, and more. 

**Endpoint IoT/OT threat detection**

Detect threats like botnets, brute force attempts, crypto miners, and suspicious network activity. Create custom alerts to target the most important threats in your unique organization. 

**Flexible distribution and deployment models** 

The Azure Defender for IoT micro agent includes source code, so you can incorporate the micro agent into firmware or customize it to include only what you need. It is also available as a binary package, or integrated directly into other Azure IoT solutions. 
## See also

[Azure Defender for IoT architecture](architecture.md)