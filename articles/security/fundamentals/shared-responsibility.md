---
title: Shared responsibility in the cloud - Microsoft Azure
description: "Understand the shared responsibility model and which security tasks are handled by the cloud provider and which tasks are handled by you."
services: security
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 01/06/2026
ms.author: mbaldwin
#customer intent: As a cloud security administrator, I want to understand the shared responsibility model in Azure so that I can clearly identify which security tasks are mine and which are handled by Microsoft.
---
# Shared responsibility in the cloud

As you consider and evaluate public cloud services, it's critical to understand the shared responsibility model and which security tasks the cloud provider handles and which tasks you handle. The workload responsibilities vary depending on whether the workload is hosted on Software as a Service (SaaS), Platform as a Service (PaaS), Infrastructure as a Service (IaaS), or in an on-premises datacenter.

## Division of responsibility

In an on-premises datacenter, you own the whole stack. As you move to the cloud, some responsibilities transfer to Microsoft. The following diagram illustrates the areas of responsibility between you and Microsoft, according to the type of deployment of your stack.

:::image type="content" source="media/shared-responsibility/shared-responsibility.svg" alt-text="Diagram showing responsibility zones." border="false":::

For all cloud deployment types, you own your data and identities. You're responsible for protecting the security of your data and identities, on-premises resources, and the cloud components you control. Cloud components you control vary by service type.

### Responsibility matrix

The following table details the division of responsibility between you and Microsoft for each area of your stack:

| Responsibility area | On-premises | IaaS | PaaS | SaaS |
|---|---|---|---|---|
| Customer data | Customer | Customer | Customer | Customer |
| Configurations and settings | Customer | Customer | Customer | Customer |
| Identities and users | Customer | Customer | Customer | Customer |
| Client devices | Customer | Customer | Customer | Shared |
| Applications | Customer | Customer | Shared | Shared |
| Network controls | Customer | Customer | Shared | Microsoft |
| Operating system | Customer | Customer | Microsoft | Microsoft |
| Physical hosts | Customer | Microsoft | Microsoft | Microsoft |
| Physical network | Customer | Microsoft | Microsoft | Microsoft |
| Physical datacenter | Customer | Microsoft | Microsoft | Microsoft |

### Responsibilities you always retain

Regardless of the type of deployment, you always retain the following responsibilities:

- **Data** - You're responsible for your data, including data classification, data protection, encryption decisions, and compliance with data governance requirements.
- **Endpoints** - You're responsible for protecting client devices and endpoints that access your cloud services, including mobile devices, laptops, and desktops.
- **Accounts** - You're responsible for managing user accounts, including creating, managing, and removing user access.
- **Access management** - You're responsible for implementing and managing access controls, including role-based access control (RBAC), multifactor authentication, and conditional access policies.

### Shared responsibilities explained

Some responsibilities are shared between you and Microsoft, with the division varying by service model:

- **Applications** - In IaaS, you're fully responsible for deployed applications. In PaaS and SaaS, Microsoft manages parts of the application stack, but you're responsible for application configuration, code security, and access controls.
- **Network controls** - In IaaS, you configure all network security including firewalls and network segmentation. In PaaS, Microsoft provides baseline network security, but you configure application-level network controls. In SaaS, Microsoft manages network security.
- **Client devices** - In SaaS scenarios, Microsoft may provide some device management capabilities, but you're responsible for endpoint protection and compliance.

### Microsoft responsibilities

Microsoft is responsible for the underlying cloud infrastructure, which includes:

- **Physical security** - Securing datacenters, including facilities, physical access controls, and environmental controls.
- **Physical network** - Managing network infrastructure, including routers, switches, and cables within datacenters.
- **Physical hosts** - Managing and maintaining the physical servers that host cloud services.
- **Hypervisor** - Managing the virtualization layer that enables virtual machines in IaaS and PaaS.
- **Platform services** - In PaaS and SaaS, Microsoft manages operating systems, runtime environments, and middleware.

## AI Shared Responsibility

When using AI services, the shared responsibility model introduces unique considerations beyond traditional IaaS, PaaS, and SaaS. Microsoft is responsible for securing the AI infrastructure, model hosting, and platform-level safeguards. Customers, however, remain accountable for how AI is applied within their environment—this includes protecting sensitive data, managing prompt security, mitigating prompt injection risks, and ensuring compliance with organizational and regulatory requirements.

Because responsibilities differ significantly for AI workloads, you should review the [AI Shared Responsibility Model](/azure/security/fundamentals/shared-responsibility-ai) for detailed guidance on roles, best practices, and risk management.

## Cloud security advantages
The cloud offers significant advantages for solving long standing information security challenges. In an on-premises environment, organizations likely have unmet responsibilities and limited resources available to invest in security, which creates an environment where attackers are able to exploit vulnerabilities at all layers.

The following diagram shows a traditional approach where many security responsibilities are unmet due to limited resources. In the cloud-enabled approach, you're able to shift day to day security responsibilities to your cloud provider and reallocate your resources.

:::image type="content" source="media/shared-responsibility/cloud-enabled-security.svg" alt-text="Diagram showing security advantages of cloud era." border="false":::

In the cloud-enabled approach, you're also able to apply cloud-based security capabilities for more effectiveness and use cloud intelligence to improve your threat detection and response time. By shifting responsibilities to the cloud provider, organizations can get more security coverage, which enables them to reallocate security resources and budget to other business priorities.

## Next step
Learn more about shared responsibility and strategies to improve your security posture in the Well-Architected Framework's [overview of the security pillar](/azure/architecture/framework/security/overview).
