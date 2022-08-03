---
title: Microsoft Defender for DevOps - the benefits and features
description: Learn about the benefits and features of Microsoft Defender for
ms.date: 08/03/2022
ms.topic: overview
---

# Overview of Defender for DevOps

Microsoft Defender for DevOps adds extra security capabilities to the Defender for Cloud. Some of the extra security protections include threat protection for code, code management systems and deployment pipelines.

Defender for DevOps fulfills five vital needs for managing the security of code and code management systems:

:::image type="content" source="media/defender-for-devops-introduction/vital-needs.png" alt-text="A table that shows the five vital needs for Defender for DevOps.":::

Defender for DevOps strengthens the development lifecycle by protecting code management systems so that security issues can be found early and mitigated before deployment to production.

Defender for DevOps accomplishes all of this by providing tools that scan: 

- code for vulnerabilities and vulnerable dependencies
- infrastructure as code for security configuration issues
- container vulnerabilities
- credentials

Defender for DevOps also provides security configuration recommendations to harden code management systems to protect them from attacks.

## Availability

| Aspect | Details |
|--|--|
| Release state: | Preview<br>The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. |
| Pricing: | The Defender for DevOps plan is free during the Preview.<br><br>GitHub Advanced Security is a paid service that is billed through your GitHub Enterprise Account. |
| Required roles and permissions: | - **Contributor**: on the relevant Azure subscription <br> - **Security Admin Role**: for Defender for Cloud <br>- **GitHub Organization Administrator**<br>- **Developer(s)/Engineer(s)**: Access to setup GitHub workflows and Azure DevOps builds<br>- **Security Administrator(s)**: The ability to set up and evaluate the connector, evaluate and respond to Microsoft Defender for Cloud recommendations <br> - **Azure account**: with permissions to sign into Azure portal <br>- **Security Admin** permissions in Defender for Cloud to configure a connection to GitHub in Defender for Cloud <br>- **Security Reader** permissions in Defender for Cloud to view recommendations <br><br>If previewing the Azure DevOps Extension, your organization must be granted access. Contact the Preview Team for access |

## Benefits of Defender for DevOps

Defender for DevOps gives Security Operators the ability to see how their organizations' code and development management systems work, without interfering with their developers. Security Operators can implement security operations and controls at every stage of the development lifecycle to make DevSecOps easier to achieve.

Developers often need examples of code to fix security issues at the time of development and on pull requests. These examples are needed so that the developers can use the tools with which they're most familiar. With the ability to scan code, infrastructure as code, credentials, and containers, Defender for DevOps makes the overall process easier for Developers to find and remediate security issues.

Defender for DevOps gives security teams the ability to set, evaluate, and enforce security policies and address risks before they  deploy to the cloud. Security teams that lack visibility into their organizations' engineering systems risks and pre-production security debt across a multitude of development environments and their effect on cloud applications.

Security teams often operate from a position of Assume Breach and respond to security incidents across the entire cloud application lifecycle. Security teams must detect and respond to suspicious, or unexpected activities by developer identities and attacks on CI/CD pipeline infrastructure, without prior knowledge of all of the code and cloud connections and remediate risks to cloud applications.

## Next steps

Learn how to [Connect your GitHub repositories to Microsoft Defender for Cloud](quickstart-onboard-github.md)]
