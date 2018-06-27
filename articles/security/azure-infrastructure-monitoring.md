---
title: Monitoring of Azure infrastructure
description: This article discusses monitoring of the Azure production network.
services: security
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: TomSh

ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/25/2018
ms.author: terrylan

---

# Monitoring of Azure infrastructure   

## Configuration and change management
Microsoft Azure reviews and updates configuration settings and baseline configurations of hardware, software and network devices annually. Changes are developed, tested, and approved prior to entering the production environment from a development and/or test environment.

The baseline configurations required for Azure-based services are reviewed by the Azure Security and Compliance team and by service teams as part of testing prior to deployment of their production service.

## Vulnerability management
Security update management helps protect systems from known vulnerabilities. Azure uses integrated deployment systems to manage the distribution and installation of security updates for Microsoft software. Azure is also able to draw on the resources of the Microsoft Security Response Center (MSRC), which identifies, monitors, responds to, and resolves security incidents and cloud vulnerabilities around the clock, each day of the year.

## Vulnerability scanning
Vulnerability scanning is performed on server operating systems, databases, and network devices with the appropriate vulnerability scanning tools. The vulnerability scans are performed on a quarterly basis at minimum. Microsoft Azure contracts with independent assessors to perform penetration testing of the Microsoft Azure boundary. Red-Team exercises are also routinely performed and results used to make security improvements.

## Protective monitoring
Microsoft Azure Security has defined requirements for active monitoring. Service teams configure active monitoring tools in accordance with these requirements. Active monitoring tools include the Monitoring Agent (MA) and System Center Operations Manager (SCOM), which are configured to provide-time alerts to Microsoft Azure Security personnel in situations that require immediate action.

## Incident management
Microsoft implements a security incident management process to facilitate a coordinated response to incidents, should one occur.

If Microsoft becomes aware of any unauthorized access to any customer data stored on its equipment or in its facilities, or unauthorized access to such equipment or facilities resulting in loss, disclosure, or alteration of customer data, Microsoft does the following:

- Promptly notifies the customer of the security incident
- Promptly investigates the security incident and provides the customer with detailed information about the security incident
- Takes reasonable and prompt steps to mitigate the effects and minimize a damage resulting from the security incident.

An incident management framework has been established with roles defined and responsibilities allocated. The Windows Azure Security Incident Management (WASIM) team is responsible for managing security incidents, including escalation and ensuring the involvement of specialist teams when necessary. Azure Operations Managers are responsible for overseeing investigation and resolution of security and privacy incidents with support from other functions.

## Next steps
