---
title: Microsoft Defender for DevOps - the benefits and features
description: Learn about the benefits and features of Microsoft Defender for
ms.date: 05/16/2022
ms.topic: overview
---

# Introduction to Defender for DevOps

Microsoft Defender for DevOps adds additional security capabilities to the robust Microsoft Defender for Cloud service for security posture management and threat protection for code, code management systems, and deployment pipelines. Defender for DevOps strengthens the development lifecycle by protecting code management systems and shifts security solutions left so that security issues can be found early and mitigated before deployment to production.

## Availability

| Aspect | Details |
|--|--|
| Release state: | Preview<br>The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. |
| Pricing: | The Defender for DevOps plan is free during the Preview.<br><br>GitHub Advanced Security is a paid service that is billed through your GitHub Enterprise Account. |
| Required roles and permissions: | - **Active NDA with Microsoft**<br>- **Contributor**: on the relevant Azure subscription.<br>- **Security Admin Role**: for Defender for Cloud.<br>- **GitHub Organization Administrator**<br><br>- **Developer(s)/Engineer(s)**: setup GitHub workflows and Azure DevOps builds.<br><br>- **Security Administrator(s)**: setup and evaluate the connector, evaluate and respond to Microsoft Defender for Cloud recommendations. <br> - **Azure account**: with permissions to sign into Azure Portal. <br>- **Security Admin** permissions in Defender for Cloud to configure a connection to GitHub in Defender for Cloud<br>- **Security Reader** permissions in Defender for Cloud to view recommendations.<br><br>If previewing the Azure DevOps Extension, your organization must be granted access. Contact the Preview Team for access |

## What is Microsoft Defender for DevOps?

Defender for DevOps provides tools that scan code for vulnerabilities and vulnerable dependencies, scan infrastructure as code for security configuration issues, container vulnerabilities, and credentials. It also provides security configuration recommendations to harden code management systems to protect them from attacks.

Defender for DevOps fulfills five vital needs for managing the security of code and code management systems:

:::image type="content" source="media/defender-for-devops-introduction/vital-needs.png" alt-text="A table that shows the 5 vital needs for Defender for DevOps.":::

### Challenges for Security Operators

Defender for DevOps gives Security Operators a view into their organizations' code and development management systems without interfering with their developers. Security Operators can implement security operations and controls at every stage of the development lifecycle to make DevSecOps easier to achieve.

### Challenges for Developers

Even with security scanning tools, developers often need examples of code to fix security issues. These examples are needed at the time of development and on pull requests, so developers can use the tools with which they are most familiar, since they are not security experts. Defender for DevOps provides the ability to scan code, infrastructure as code, credentials, and containers in order to make the overall process easier for Developers to find and remediate security issues.

### What are the benefits of Defender for DevOps

Defender for DevOps addresses several challenges:

- Security teams must be able to set, evaluate, and enforce security policies and address risks before deployment to the cloud. Security teams don't have visibility into their organizations' engineering systems risks and pre-production security debt across a multitude of development environments and their impact on cloud applications.

- Security teams must operate from a position of Assume Breach and respond to security incidents across the entire cloud application lifecycle. Security teams must detect and respond to suspicious, or unexpected activities by developer identities and attacks on CI/CD pipeline infrastructure, without prior knowledge of all of the code and cloud connections and remediate risks to cloud applications.

## Next steps

Learn how to [Connect your GitHub repositories to Microsoft Defender for Cloud](quickstart-onboard-github.md)]
