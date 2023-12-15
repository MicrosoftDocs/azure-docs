---
title: Planning multicloud security determine ownership requirements security functions team alignment best practices guidance
description: Learn about determining ownership requirements when planning multicloud deployment with Microsoft Defender for Cloud.
ms.topic: how-to
author: dcurwin
ms.author: dacurwin
ms.custom: ignite-2022
ms.date: 10/03/2022
---

# Determine ownership requirements

This article is one of a series providing guidance as you design a cloud security posture management (CSPM) and cloud workload protection (CWP) solution across multicloud resources with Microsoft Defender for Cloud.

## Goal

Identify the teams involved in your multicloud security solution, and plan how they will align and work together.

## Security functions

Depending on the size of your organization, separate teams will manage [security functions](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management). In a complex enterprise, functions might be numerous.

| Security function | Details |
|---|---|
|[Security Operations (SecOps)](/azure/cloud-adoption-framework/organize/cloud-security-operations-center) | Reducing organizational risk by reducing the time in which bad actors have access to corporate resources. Reactive detection, analysis, response and remediation of attacks. Proactive threat hunting.  
| [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture)| Security design summarizing and documenting the components, tools, processes, teams, and technologies that protect your business from risk.|
|[Security compliance management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)| Processes that ensure the organization is compliant with regulatory requirements and internal policies.|
|[People security](/azure/cloud-adoption-framework/organize/cloud-security-people)|Protecting the organization from human risk to security.|
|[Application security and DevSecOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)| Integrating security into DevOps processes and apps.|
|[Data security](/azure/cloud-adoption-framework/organize/cloud-security-data-security)| Protecting your organizational data.|
|[Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint)|Providing protection, detection and response for infrastructure, networks, and endpoint devices used by apps and users.|
|[Identity and key management](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys)|Authenticating and authorizing users, services, devices, and apps. Provide secure distribution and access for cryptographic operations.|
|[Threat intelligence](/azure/cloud-adoption-framework/organize/cloud-security-threat-intelligence)| Making decisions and acting on security threat intelligence that provides context and actionable insights on active attacks and potential threats.|
|[Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)|Continuously reporting on, and improving, your organizational security posture.|
|[Incident preparation](/azure/cloud-adoption-framework/organize/cloud-security-incident-preparation)|Building tools, processes, and expertise to respond to security incidents.

## Team alignment

Despite the many different teams who manage cloud security, it’s critical that they work together to figure out who’s responsible for decision making in the multicloud environment. Lack of ownership creates friction that can result in stalled projects and insecure deployments that couldn’t wait for security approval.

Security leadership, most commonly under the CISO, should specify who’s accountable for security decision making. Typically, responsibilities align as summarized in the table.

|Category | Description | Typical Team|
| --- | --- | --- |
|Server endpoint security | Monitor and remediate server security, includes patching, configuration, endpoint security, etc.| Joint responsibility of [central IT operations](/azure/cloud-adoption-framework/organize/central-it) and [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/central-it) teams.|
|Incident monitoring and response| Investigate and remediate security incidents in your organization’s SIEM or source console.| [Security operations](/azure/cloud-adoption-framework/organize/cloud-security-operations-center) team.|
|Policy management|Set direction for Azure role-based access control (Azure RBAC), Microsoft Defender for Cloud, administrator protection strategy, and Azure Policy, in order to govern Azure resources, custom AWS/GCP recommendations etc.|Joint responsibility of [policy and standards](/azure/cloud-adoption-framework/organize/cloud-security-policy-standards) and [security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture) teams.|
|threat and vulnerability management| Maintain complete visibility and control of the infrastructure, to ensure that critical issues are discovered and remediated as efficiently as possible.| Joint responsibility of [central IT operations](/azure/cloud-adoption-framework/organize/central-it) and [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/central-it) teams.|
|Application workloads|Focus on security controls for specific workloads. The goal is to integrate security assurances into development processes and custom line of business (LOB) applications.|Joint responsibility of [application development](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops) and [central IT operations](/azure/cloud-adoption-framework/organize/central-it) teams.|
|Identity security and standards | Understand Permission Creep Index (PCI) for Azure subscriptions, AWS accounts, and GCP projects, in order to identify risks associated with unused or excessive permissions across identities and resources.| Joint responsibility of [identity and key management](/azure/cloud-adoption-framework/organize/cloud-security-identity-keys), [policy and standards](/azure/cloud-adoption-framework/organize/cloud-security-policy-standards), and [security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture) teams. |

## Best practices

- Although multicloud security might be divided across different areas of the business, teams should manage security across the multicloud estate. This is better than having different teams secure different cloud environments. For example where one team manages Azure and another team manages AWS. Teams working across multicloud environments helps to prevent sprawl within the organization. It also helps to ensure that security policies and compliance requirements are applied in every environment.
- Often, teams that manage Defender for Cloud don’t have privileges to remediate recommendations in workloads. For example, the Defender for Cloud team might not be able to remediate vulnerabilities in an AWS EC2 instance. The security team might be responsible for improving the security posture, but unable to fix the resulting security recommendations. To address this issue:
  - It’s imperative to involve the AWS workload owners.
    - [Assigning owners with due dates](./governance-rules.md) and [defining governance rules](./governance-rules.md) creates accountability and transparency, as you drive processes to improve security posture.
- Depending on organizational models, we commonly see these options for central security teams operating with workload owners:
  - **Option 1: Centralized model.** Security controls are defined, deployed, and monitored by a central team.

    - The central security team decides which security policies will be implemented in the organization and who has permissions to control the set policy.
    - The team might also have the power to remediate non-compliant resources and enforce resource isolation in case of a security threat or configuration issue.
    - Workload owners on the other hand are responsible for managing their cloud workloads but need to follow the security policies that the central team has deployed.
    - This model is most suitable for companies with a high level of automation, to ensure automated response processes to vulnerabilities and threats.
  - **Option 2: Decentralized model.**- Security controls are defined, deployed, and monitored by workload owners.
    - Security control deployment is done by workload owners, as they own the policy set and can therefore decide which security policies are applicable to their resources.
    - Owners need to be aware of, understand, and act upon security alerts and recommendations for their own resources.
    - The central security team on the other hand only acts as a controlling entity, without write-access to any of the workloads.
    - The security team usually has insights into the overall security posture of the organization, and they might hold the workload owners accountable for improving their security posture.
    - This model is most suitable for organizations that need visibility into their overall security posture, but at the same time want to keep responsibility for security with the workload owners.
    - Currently, the only way to achieve Option 2 in Defender for Cloud is to assign the workload owners with Security Reader permissions to the subscription that’s hosting the multicloud connector resource.

## Next steps

In this article, you have learned how to determine ownership requirements when designing a multicloud security solution. Continue with the next step to [determine access control requirements](plan-multicloud-security-determine-access-control-requirements.md).