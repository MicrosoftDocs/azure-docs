# Overview of Defender for DevOps
![Graphical user interface, application Description automatically
generated](./media/defender-for-devops-introduction/image002.png)
# Microsoft Preview Software License Terms

Please refer to the complete Microsoft Universal License Terms for Online Services located here
<https://www.microsoft.com/licensing/terms/product/foronlineservices/eaeas>.

#### Previews

PREVIEWS ARE PROVIDED \"AS-IS,\" \"WITH ALL FAULTS,\" AND \"AS AVAILABLE,\" as described herein. Unless otherwise noted in a separate agreement, Previews are not included in the SLA for the corresponding Online Service, and may not be covered by customer support. We may change or discontinue Previews at any time without notice. We may also choose not to make a Preview service generally commercially available.

Providing "Feedback" (suggestions, comments, feedback, ideas, or know-how, in any form) to Microsoft about Preview services is voluntary.  Microsoft is under no obligation to post or use any Feedback. By providing Feedback to Microsoft, Customer (and anyone providing Feedback through Customer) irrevocably and perpetually grant to Microsoft and its Affiliates, under all of its (and their) owned or controlled intellectual property rights, a worldwide, non-exclusive,
fully paid-up, royalty-free, transferable, sub-licensable right and license to make, use, reproduce, prepare derivative works based upon, distribute, publicly perform, publicly display, transmit, and otherwise commercialize the Feedback (including by combining or interfacing products, services or technologies that depend on or incorporate Feedback with other products, services or technologies of Microsoft or others), without attribution in any way and for any purpose.

Customer warrants that 1) it will not provide Feedback that is subject to a license requiring Microsoft to license anything to third parties because Microsoft exercises any of the above rights in Customer's Feedback; and 2) it owns or otherwise controls all of the rights to such Feedback and that no such Feedback is subject to any third-party rights (including any personality or publicity rights).

Please refer to the complete Microsoft Products and Services Data Protection Addendum (DPA) located here <https://aka.ms/dpa>.

Previews may employ lesser or different privacy and security measures than those typically present in the Products and Services. Unless otherwise noted, Customer should not use Previews to process Personal Data or other data that is subject to legal or regulatory compliance requirements. For Products, the following terms in this DPA do not apply to Previews: Processing of Personal Data; GDPR, Data Security, and HIPAA Business Associate. For Professional Services, offerings designated as Previews or Limited Release only meet the terms of the Supplemental Professional Services.

# Overview 

> *Azure Security Center and Azure Defender are now called **Microsoft Defender for Cloud**. We\'ve also renamed Azure Defender plans to Microsoft Defender plans. For example, Azure Defender for Storage is now Microsoft Defender for Storage. [Learn more about the recent renaming of Microsoft security services](https://aka.ms/secblg11).*

## What is Microsoft Defender for DevOps?

Microsoft Defender for DevOps adds additional security capabilities to the robust Microsoft Defender for Cloud service for security posture management and threat protection for code, code management systems, and deployment pipelines. It strengthens the development lifecycle by protecting code management systems and shifting security solutions left so that security issues can be found early and mitigated before deployment to production.

Defender for DevOps provides tools that scan code for vulnerabilities and vulnerable dependencies, scan infrastructure as code for security configuration issues, container vulnerabilities, and credentials. It also provides security configuration recommendations to harden code management systems and protect them from attacks.

Defender for DevOps fills five vital needs for managing the security of code and code management systems:

![Text Description](media/defender-for-devops-introduction/image003.png)

### Challenges for Security Operators

Driving security into every aspect of the development lifecycle is difficult to achieve without visibility into what Developers are building. Defender for DevOps gives Security Operators optics into their organizations' code and development management systems without getting in the way of Developers. Defender for DevOps allows Security Operators to implement security operations and controls at every stage of the development lifecycle and to make DevSecOps easier to achieve.

### Challenges for Developers

Developers must often use multiple solutions to achieve holistic security coverage while writing code. In some cases, even with security scanning tools, Developers need examples of how to fix security issues, not simply a description of what security issue was found. Developers need this information at development time and on pull requests so they can use the tools with which they are most familiar. Additionally, Developers are not the security experts. Defender for DevOps provides options for scanning code, infrastructure as code, credentials, and containers making it easy for Developers to find and remediate security issues in their original context.

### Defender for DevOps Can Help

Defender for DevOps addresses several challenges:

1.  *Security teams must be able to set, evaluate, and enforce security policies and address risks before deployment to the cloud -* Security teams don't have visibility into their organizations' engineering systems risks and pre-production security debt--across a multitude of development environments--and their impact on cloud applications.

2.  *Security teams must operate from a position of Assume Breach and respond to security incidents across the entire cloud application lifecycle -* Security teams must detect and respond to suspicious or unexpected activities by Developer identities and attacks on CI/CD pipeline infrastructure, like the SolarWinds attack, without prior knowledge of all code and cloud connections and remediate risks to cloud applications.

## Preview Scenarios Summary

Defender for DevOps Preview scenarios allow a customer to test the onboarding connector for GitHub in Microsoft Defender for Cloud's environment settings and to evaluate security posture Recommendations in MDC. They also include testing the Microsoft Security DevOps GitHub Action with functionality for code scanning, container scanning, and infrastructure as code (IaC) scanning. Finally, the Azure DevOps Extension can be tested with functionality for code scanning, container scanning, and (IaC) scanning, along with the addition of credential
scanning.

#### What will we test during Preview?

### Scenario 1 Connect GitHub 

1.  Onboard to Microsoft Defender for Cloud (MDC) Environment Settings

2.  Enable GitHub Advanced Security​

### Scenario 2 Evaluate Microsoft Defender for Cloud Recommendations​

1.  Evaluate each Recommendation with GitHub Advanced Security enabled

### Scenario 3 Microsoft Security DevOps GitHub Action

1.  Install GitHub Action​

2.  Evaluate GitHub Action results in GitHub​

    1.  Infrastructure as Code scanning

    2.  Container​ scanning

    3.  Code​ scanning

### Scenario 4 Microsoft Security DevOps Azure DevOps Extension

1.  Install Azure DevOps Extension​

2.  Evaluate Azure DevOps Extension results in Azure DevOps​

    1.  Infrastructure as Code scanning

    2.  Container​ scanning

    3.  Code​ scanning

    4.  Credential scanning

## Feedback

Please share your feedback, specifically in the areas below. *To submit your feedback see* [How to provide feedback](#how-to-provide-feedback) *in the Reference section of this document.* Some helpful topics for feedback include:

-   Is the DevOps inventory accurate and useful?

-   Are the Defender for Cloud Recommendations insightful for your Security Operators?

-   Are the Defender for Cloud Recommendations actionable for your organization?

-   Are the insights from this Preview feature set valuable?

-   Is the UX intuitive?

-   Are the Defender for DevOps preview scenarios useful?

-   Feedback on the Preview Documentation.

## Access to the Preview

Please read this document carefully. It includes prerequisites and limitations that Defender for DevOps Preview customers are expected to be aware of during Preview participation.


| Aspect    |   Details |
|---------------|---------------|
| Release state:| Preview<br>The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. |
|Pricing:|The Defender for DevOps plan is free during the Preview. After which, it will be billed.  Pricing to be determined at later date. <br><br>GitHub Advanced Security is a paid service and will be billed through your GitHub Enterprise Account |
|Required roles and permissions:|**Active NDA with Microsoft**<br>**Contributor** on the relevant Azure subscription<br>**Security Admin Role** in Defender for Cloud<br>GitHub Organization Administrator<br><br>Developer(s)/Engineer(s) who will: setup GitHub workflows and/or Azure DevOps builds<br><br>Security Administrator(s) who will: setup and evaluate the connector; evaluate and respond to Microsoft Defender for Cloud (MDC) Recommendations<br>&ensp;&ensp;&ensp;Azure account with permissions to login to Azure Portal<br>&ensp;&ensp;&ensp;**Security Admin** permissions in MDC to configure a connection to GitHub in MDC<br>&ensp;&ensp;&ensp;**Security Reader** permissions in MDC to view MDC Recommendations<br><br>If previewing the Azure DevOps Extension, your organization must be granted access. Contact the Preview Team for access|


## Preview Limits

-   Limits on number of repositories

    -   **Limitation** -- please choose only up to 15 repositories for testing

    -   **Solution** -- This limitation is expected to continue throughout the Private Preview period
<br>
-   Regions supported

    -   **Limitation** -- Defender for DevOps is only available in limited regions during Preview

        -   Central US

    -   **Solution** -- Additional regions will be added based on regional capacity, availability, and customer feedback
<br>
-   Customers will pay for GitHub Advanced Security

    -   **Limitation** -- In the Preview release many aspects of Defender for DevOps are being paid for by Microsoft. One of the exceptions is **GitHub Advanced Security (GHAS)** functionality. Customers will receive the best Preview experience with GHAS enabled. Because it is a third-party owned service, it is the customer's choice whether or not to utilize the GHAS service, and therefore any costs associated with running this service are paid by the customer.

    -   **Solution** -- Because GitHub is a third-party service, this pricing scenario is expected functionality
<br>
-   The Defender for DevOps portal experience includes, by design, inactive features during the Preview release.

    -   **Limitation** -- Several inactive, backlogged features can be found in the Defender for DevOps portal. Icons for these features are set to 50% opacity so that they are visually distinguishable from active, functional Preview features. The intention is to solicit early feedback from customers on feature requirements, locations, behaviors, and priorities.

    -   **Solution** -- Based on customer feedback, backlogged features will be prioritized for release and available for subsequent Preview releases.