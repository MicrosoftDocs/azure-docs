---
title: Microsoft Defender for DevOps - the benefits and features
description: Learn about the benefits and features of Microsoft Defender for
ms.date: 09/01/2022
ms.topic: overview
---

# Overview of Defender for DevOps

Microsoft Defender for Cloud enables comprehensive visibility, posture management and threat protection across multi-cloud environments including Azure, AWS, Google, and on-premises resources. Defender for DevOps integrates with GitHub Advanced Security which is embedded into both GitHub and Azure DevOps, to empower security teams with the ability to protect resources from code to cloud.

Defender for DevOps uses a central console to provide security teams DevOps insights across multi-pipeline environments, such as, GitHub and Azure DevOps. These insights can then be correlated with other contextual cloud security intelligence to prioritize remediation in code and apply consistent security guardrails throughout the application lifecycle. Key capabilities starting in Defender for DevOps, available through Defender for Cloud include:

- **A Unified visibility into DevOps security posture**: Provides security administrators with full visibility into the DevOps inventory, the security posture of pre-production application code, resource configurations across multi-pipeline and multi-cloud environments in a single view.

- **Strengthen cloud resource configurations throughout the development lifecycle**: Enables security of Infrastructure as Code (IaC) templates and container images to minimize cloud misconfigurations reaching production environments. This helps security administrators to focus on any critical evolving threats.

- **Prioritize remediation of critical issues in code**: Leveraging comprehensive code to cloud contextual insights within Defender for Cloud, security admins can help developers prioritize critical code fixes with actionable remediation and assign developer ownership by triggering custom workflows feeding directly into the tools developers use and love.

Defender for DevOps strengthens the development lifecycle by protecting code management systems so that security issues can be found early and mitigated before deployment to production. Through the use of security configuration recommendations, security teams have the ability to harden code management systems to protect them from attacks.

## Availability

| Aspect | Details |
|--|--|
| Release state: | Preview<br>The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. |
| Required roles and permissions: | - **Contributor**: on the relevant Azure subscription <br> - **Security Admin Role**: for Defender for Cloud <br>- **GitHub Organization Administrator**<br>- **Developer(s)/Engineer(s)**: Access to setup GitHub workflows and Azure DevOps builds<br>- **Security Administrator(s)**: The ability to set up and evaluate the connector, evaluate and respond to Microsoft Defender for Cloud recommendations <br> - **Azure account**: with permissions to sign into Azure portal <br>- **Security Admin** permissions in Defender for Cloud to configure a connection to GitHub in Defender for Cloud <br>- **Security Reader** permissions in Defender for Cloud to view recommendations <br><br>If previewing the Azure DevOps Extension, your organization must be granted access. Contact the Preview Team for access |

## Benefits of Defender for DevOps

Defender for DevOps gives Security Operators the ability to see how their organizations' code and development management systems work, without interfering with their developers. Security Operators can implement security operations and controls at every stage of the development lifecycle to make DevSecOps easier to achieve.

Developers often need examples of code to fix security issues at the time of development and on pull requests. These examples are needed so that the developers can use the tools with which they're most familiar. With the ability to scan code, infrastructure as code, credentials, and containers, Defender for DevOps makes the overall process easier for Developers to find and remediate security issues.

Defender for DevOps gives security teams the ability to set, evaluate, and enforce security policies and address risks before they  deploy to the cloud. Security teams that lack visibility into their organizations' engineering systems risks and pre-production security debt across a multitude of development environments and their effect on cloud applications.

Security teams often operate from a position of Assume Breach and respond to security incidents across the entire cloud application lifecycle. Security teams must detect and respond to suspicious, or unexpected activities by developer identities and attacks on CI/CD pipeline infrastructure, without prior knowledge of all of the code and cloud connections and remediate risks to cloud applications.

## Next steps

Learn how to [Connect your GitHub repositories to Microsoft Defender for Cloud](quickstart-onboard-github.md).
