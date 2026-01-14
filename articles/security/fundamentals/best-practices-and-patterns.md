---
title: Security best practices and patterns - Microsoft Azure | Microsoft Docs
description: This article links you to security best practices and patterns for different Azure resources.
author: msmbaldwin
ms.assetid: 1cbbf8dc-ea94-4a7e-8fa0-c2cb198956c5
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 12/03/2025
ms.author: mbaldwin

---
# Azure security best practices and patterns

This article contains security best practices to use when you're designing, deploying, and managing your cloud solutions by using Azure. These best practices come from our experience with Azure security and the experiences of customers like you.

## Best practices

These best practices are intended to be a resource for IT pros. IT pros include designers, architects, developers, and testers who build and deploy secure Azure solutions.

* [Best practices for protecting secrets](secrets-best-practices.md)
* [Azure database security best practices](/azure/azure-sql/database/security-best-practice)
* [Azure data security and encryption best practices](data-encryption-best-practices.md)
* [Azure identity management and access control security best practices](identity-management-best-practices.md)
* [Azure network security best practices](network-best-practices.md)
* [Azure operational security best practices](operational-best-practices.md)
* [Azure PaaS Best Practices](paas-deployments.md)
* [Azure Service Fabric security best practices](service-fabric-best-practices.md)
* [Best practices for IaaS workloads in Azure](iaas.md)
* [Implementing a secure hybrid network architecture in Azure](/azure/architecture/reference-architectures/dmz/secure-vnet-hybrid)
* [Internet of Things security best practices](../../iot/iot-overview-security.md)
* [Securing PaaS databases in Azure](paas-applications-using-sql.md)
* [Securing PaaS web and mobile applications using Azure App Service](paas-applications-using-app-services.md)
* [Securing PaaS web and mobile applications using Azure Storage](paas-applications-using-storage.md)

## Next steps

Microsoft finds that using security benchmarks can help you quickly secure cloud deployments. Benchmark recommendations from your cloud service provider give you a starting point for selecting specific security configuration settings in your environment and allow you to quickly reduce risk to your organization. 

### Microsoft Cloud Security Benchmark (MCSB)

The [Microsoft cloud security benchmark (MCSB)](/security/benchmark/azure/introduction) provides comprehensive security best practices aligned with industry frameworks spanning identity, networking, compute, data protection, and management layers. 

> [!NOTE]
> **Microsoft Cloud Security Benchmark v2 (Preview)**: MCSB v2 is now available in preview with significant enhancements including:
> - **Artificial Intelligence Security**: New control domain with 7 recommendations covering AI platform security, AI application security, and AI security monitoring to address threats and risks in AI deployments
> - **Expanded Azure Policy Coverage**: Increased from 220+ to 420+ policy-based control measurements for comprehensive security posture monitoring
> - **Enhanced Implementation Guidance**: More granular technical implementation examples with risk and threat-based control guides
> 
> MCSB v2 includes new guidance for confidential computing workloads and can be enforced and monitored through Azure Policy. For more information, see [Overview of Microsoft cloud security benchmark v2 (preview)](/security/benchmark/azure/overview).

**Implementation recommendations**:
- **Monitor compliance**: Use the [Microsoft Defender for Cloud regulatory compliance dashboard](/azure/defender-for-cloud/update-regulatory-compliance-packages) to track Microsoft Cloud Security Benchmark compliance and identify security gaps
- **Enforce baselines**: Implement [Azure Policy](/azure/governance/policy/tutorials/create-and-manage) to audit and enforce secure configuration baselines based on Microsoft Cloud Security Benchmark v2 (preview) recommendations
- **Assess AI workloads**: Review the new Artificial Intelligence Security controls in Microsoft Cloud Security Benchmark v2 (preview) if deploying AI/ML workloads to ensure proper platform, application, and monitoring security

For a complete collection of high-impact security recommendations, see the [Microsoft cloud security benchmark](/security/benchmark/azure/introduction).
