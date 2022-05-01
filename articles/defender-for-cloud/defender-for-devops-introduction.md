# Introduction to Defender for DevOps

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

Microsoft Defender for DevOps adds additional security capabilities to the robust Microsoft Defender for Cloud service for security posture management and threat protection for code, code management systems, and deployment pipelines. It strengthens the development lifecycle by protecting code management systems and shifting security solutions left so that security issues can be found early and mitigated before deployment to production.

## Availability

| Aspect    |   Details |
|---------------|---------------|
| Release state:| Preview<br>The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. |
|Pricing:|The Defender for DevOps plan is free during the Preview. After which, it will be billed.  Pricing to be determined at later date. <br><br>GitHub Advanced Security is a paid service and will be billed through your GitHub Enterprise Account |
|Required roles and permissions:|**Active NDA with Microsoft**<br>**Contributor** on the relevant Azure subscription<br>**Security Admin Role** in Defender for Cloud<br>GitHub Organization Administrator<br><br>Developer(s)/Engineer(s) who will: setup GitHub workflows and/or Azure DevOps builds<br><br>Security Administrator(s) who will: setup and evaluate the connector; evaluate and respond to Microsoft Defender for Cloud (MDC) Recommendations<br>&ensp;&ensp;&ensp;Azure account with permissions to sign into Azure Portal<br>&ensp;&ensp;&ensp;**Security Admin** permissions in MDC to configure a connection to GitHub in MDC<br>&ensp;&ensp;&ensp;**Security Reader** permissions in MDC to view MDC Recommendations<br><br>If previewing the Azure DevOps Extension, your organization must be granted access. Contact the Preview Team for access|

## What is Microsoft Defender for DevOps?

Defender for DevOps provides tools that scan code for vulnerabilities and vulnerable dependencies, scan infrastructure as code for security configuration issues, container vulnerabilities, and credentials. It also provides security configuration recommendations to harden code management systems and protect them from attacks.

Defender for DevOps fills five vital needs for managing the security of code and code management systems:

![Text Description](media/defender-for-devops-introduction/image003.png)

### Challenges for Security Operators

Driving security into every aspect of the development lifecycle is difficult to achieve without visibility into what Developers are building. Defender for DevOps gives Security Operators optics into their organizations' code and development management systems without getting in the way of Developers. Defender for DevOps allows Security Operators to implement security operations and controls at every stage of the development lifecycle and to make DevSecOps easier to achieve.

### Challenges for Developers

Developers must often use multiple solutions to achieve holistic security coverage while writing code. In some cases, even with security scanning tools, Developers need examples of how to fix security issues, not simply a description of what security issue was found. Developers need this information at development time and on pull requests so they can use the tools with which they are most familiar. Additionally, Developers are not the security experts. Defender for DevOps provides options for scanning code, infrastructure as code, credentials, and containers making it easy for Developers to find and remediate security issues in their original context.

### What are the benefits of Defender for DevOps

Defender for DevOps addresses several challenges:

1.  *Security teams must be able to set, evaluate, and enforce security policies and address risks before deployment to the cloud -* Security teams don't have visibility into their organizations' engineering systems risks and pre-production security debt--across a multitude of development environments--and their impact on cloud applications.

2.  *Security teams must operate from a position of Assume Breach and respond to security incidents across the entire cloud application lifecycle -* Security teams must detect and respond to suspicious or unexpected activities by Developer identities and attacks on CI/CD pipeline infrastructure, like the SolarWinds attack, without prior knowledge of all code and cloud connections and remediate risks to cloud applications.