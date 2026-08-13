---
title: Azure infrastructure monitoring
description: Learn about infrastructure monitoring aspects of the Azure production network, such as vulnerability scanning.
services: security
author: msmbaldwin

ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 07/20/2026
ms.author: mbaldwin
ai-usage: ai-assisted
---

# Azure infrastructure monitoring

## Configuration and change management
Azure reviews and updates configuration settings and baseline configurations of hardware, software, and network devices annually. Azure develops, tests, and approves changes before they enter the production environment from a development or test environment.

The Azure security and compliance team and service teams review the baseline configurations that Azure-based services require. Service teams review these configurations before deploying their production service.

## Vulnerability management
Security update management helps protect systems from known vulnerabilities. Azure uses integrated deployment systems to manage the distribution and installation of security updates for Microsoft software. Azure can also draw on the resources of the Microsoft Security Response Center (MSRC). The MSRC identifies, monitors, responds to, and resolves security incidents and cloud vulnerabilities around the clock, every day of the year.

## Vulnerability scanning
Azure performs vulnerability scanning on server operating systems, databases, and network devices at least quarterly. Azure contracts with independent assessors to perform penetration testing of the Azure boundary. Azure also routinely performs red-team exercises and uses the results to make security improvements.

## Protective monitoring
Azure security defines requirements for active monitoring. Service teams configure active monitoring tools according to these requirements. Active monitoring tools include the Microsoft Monitoring Agent (MMA) and System Center Operations Manager. Service teams configure these tools to provide timely alerts to Azure security personnel in situations that require immediate action.

## Incident management
Microsoft implements a security incident management process to facilitate a coordinated response to incidents, if one occurs.

If Microsoft becomes aware of unauthorized access to customer data that's stored on its equipment or in its facilities, or it becomes aware of unauthorized access to such equipment or facilities resulting in loss, disclosure, or alteration of customer data, Microsoft takes the following actions:

- Promptly notifies the customer of the security incident.
- Promptly investigates the security incident and provides customers with detailed information about the security incident.
- Takes reasonable and prompt steps to mitigate the effects and minimize any damage resulting from the security incident.

An incident management framework defines roles and allocates responsibilities. The Azure security incident management team is responsible for managing security incidents, including escalation, and ensuring the involvement of specialist teams when necessary. Azure operations managers are responsible for overseeing the investigation and resolution of security and privacy incidents.

## Next steps
To learn more about what Microsoft does to secure the Azure infrastructure, see:

- [Azure facilities, premises, and physical security](physical-security.md)
- [Azure infrastructure availability](infrastructure-availability.md)
- [Azure information system components and boundaries](infrastructure-components.md)
- [Azure network architecture](infrastructure-network.md)
- [Azure production network](production-network.md)
- [Azure SQL Database security features](infrastructure-sql.md)
- [Azure production operations and management](infrastructure-operations.md)
- [Azure infrastructure integrity](infrastructure-integrity.md)
- [Azure customer data protection](protection-customer-data.md)
