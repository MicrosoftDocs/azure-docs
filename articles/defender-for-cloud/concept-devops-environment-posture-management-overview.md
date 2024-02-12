---
title: DevOps environment posture management overview
description: Learn how to discover security posture violations in DevOps environments 
ms.date: 10/17/2023
author: AlizaBernstein
ms.author: v-bernsteina
ms.topic: conceptual
---

# Improve DevOps environment security posture

With an increase of cyber attacks on source code management systems and continuous integration/continuous delivery pipelines, securing DevOps platforms against the diverse range of threats identified in the [DevOps Threat Matrix](https://www.microsoft.com/security/blog/2023/04/06/devops-threat-matrix/) is crucial. Such cyber attacks can enable code injection, privilege escalation, and data exfiltration, potentially leading to extensive impact.  

DevOps posture management is a feature in Microsoft Defender for Cloud that:

- Provides insights into the security posture of the entire software supply chain lifecycle.
- Uses advanced scanners for in-depth assessments.
- Covers various resources, from organizations, pipelines, and repositories.  
- Allows customers to reduce their attack surface by uncovering and acting on the provided recommendations.

## DevOps scanners

To provide findings, DevOps posture management uses DevOps scanners to identify weaknesses in source code management and continuous integration/continuous delivery pipelines by running checks against the security configurations and access controls.

Azure DevOps and GitHub scanners are used internally within Microsoft to identify risks associated with DevOps resources, reducing attack surface and strengthening corporate DevOps systems.

Once a DevOps environment is connected, Defender for Cloud autoconfigures these scanners to conduct recurring scans every 24 hours across multiple DevOps resources, including:  

- Builds
- Secure Files
- Variable Groups
- Service Connections
- Organizations
- Repositories

## DevOps threat matrix risk reduction

DevOps posture management assists organizations in discovering and remediating harmful misconfigurations in the DevOps platform. This leads to a resilient, zero-trust DevOps environment, which is strengthened against a range of threats defined in the DevOps threat matrix.  The primary posture management controls include:

- **Scoped secret access**: Minimize the exposure of sensitive information and reduce the risk of unauthorized access, data leaks, and lateral movements by ensuring each pipeline only has access to the secrets essential to its function.
- **Restriction of self-hosted runners and high permissions**: prevent unauthorized executions and potential escalations by avoiding self-hosted runners and ensuring that pipeline permissions default to read-only.
- **Enhanced branch protection**: Maintain the integrity of the code by enforcing branch protection rules and preventing malicious code injections.
- **Optimized permissions and secure repositories**: Reduce the risk of unauthorized access, modifications by tracking minimum base permissions, and enablement of [secret push protection](https://docs.github.com/enterprise-cloud@latest/code-security/secret-scanning/push-protection-for-repositories-and-organizations) for repositories.

- Learn more about the [DevOps threat matrix](https://www.microsoft.com/security/blog/2023/04/06/devops-threat-matrix/).

## DevOps posture management recommendations

When the DevOps scanners uncover deviations from security best practices within source code management systems and continuous integration/continuous delivery pipelines, Defender for Cloud outputs precise and actionable recommendations. These recommendations have the following benefits:

- **Enhanced visibility**: Obtain comprehensive insights into the security posture of DevOps environments, ensuring a well-rounded understanding of any existing vulnerabilities. Identify missing branch protection rules, privilege escalation risks, and insecure connections to prevent attacks.
- **Priority-based action**: Filter results by severity to spend resources and efforts more effectively by addressing the most critical vulnerabilities first.
- **Attack surface reduction**: Address highlighted security gaps to significantly minimize vulnerable attack surfaces, thereby hardening defenses against potential threats.
- **Real-time notifications**: Ability to integrate with workflow automations to receive immediate alerts when secure configurations alter, allowing for prompt action and ensuring sustained compliance with security protocols.

## Next steps

- [Connect your GitHub repositories to Microsoft Defender for Cloud](quickstart-onboard-github.md).
- [Connect your Azure DevOps repositories to Microsoft Defender for Cloud](quickstart-onboard-devops.md).
