---
title: Microsoft Defender for DevOps - the benefits and features
description: Learn about the benefits and features of Microsoft Defender for
ms.date: 09/20/2022
ms.topic: overview
ms.custom: ignite-2022
---

# Overview of Defender for DevOps

Microsoft Defender for Cloud enables comprehensive visibility, posture management and threat protection across multicloud environments including Azure, AWS, Google, and on-premises resources. Defender for DevOps integrates with GitHub Advanced Security that is embedded into both GitHub and Azure DevOps, to empower security teams with the ability to protect resources from code to cloud.

Defender for DevOps uses a central console to provide security teams DevOps insights across multi-pipeline environments, such as GitHub and Azure DevOps. These insights can then be correlated with other contextual cloud security intelligence to prioritize remediation in code and apply consistent security guardrails throughout the application lifecycle. Key capabilities starting in Defender for DevOps, available through Defender for Cloud includes:

- **Unified visibility into DevOps security posture**: Security administrators are given full visibility into the DevOps inventory, the security posture of pre-production application code, resource configurations across multi-pipeline and multicloud environments in a single view.

- **Strengthen cloud resource configurations throughout the development lifecycle**: Enables security of Infrastructure as Code (IaC) templates and container images to minimize cloud misconfigurations reaching production environments, allowing security administrators to focus on any critical evolving threats.

- **Prioritize remediation of critical issues in code**: Applies comprehensive code to cloud contextual insights within Defender for Cloud, security admins can help developers prioritize critical code fixes with actionable remediation and assign developer ownership by triggering custom workflows feeding directly into the tools developers use and love.

Defender for DevOps strengthens the development lifecycle by protecting code management systems so that security issues can be found early and mitigated before deployment to production. By using security configuration recommendations, security teams have the ability to harden code management systems to protect them from attacks.

## Availability

| Aspect | Details |
|--|--|
| Release state: | Preview<br>The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. |
| Required roles and permissions: | - **Contributor**: on the relevant Azure subscription <br> - **Security Admin Role**: for Defender for Cloud <br>- **GitHub Organization Administrator**<br>- **Developer(s)/Engineer(s)**: Access to setup GitHub workflows and Azure DevOps builds<br>- **Security Administrator(s)**: The ability to set up and evaluate the connector, evaluate and respond to Microsoft Defender for Cloud recommendations <br> - **Azure account**: with permissions to sign into Azure portal <br>- **Security Admin** permissions in Defender for Cloud to configure a connection to GitHub in Defender for Cloud <br>- **Security Reader** permissions in Defender for Cloud to view recommendations  |

## Benefits of Defender for DevOps

Defender for DevOps gives Security Operators the ability to see how their organizations' code and development management systems work, without interfering with their developers. Security Operators can implement security operations and controls at every stage of the development lifecycle to make DevSecOps easier to achieve.

Defender for DevOps grants developers the ability to scan code, infrastructure as code, credentials, and containers, to make the process easier for developers to find and remediate security issues.

Defender for DevOps gives security teams the ability to set, evaluate, and enforce security policies and address risks before they are deployed to the cloud. Security teams gain visibility into their organizations' engineering systems, including security risks and pre-production security debt across multiple development environments and cloud applications.

## Manage your DevOps environments in Defender for Cloud

Defender for DevOps allows you to manage your connected environments and provides your security teams with a high level overview of all the issues that may exist within them.

:::image type="content" source="media/defender-for-devops-introduction/devops-dashboard.png" alt-text="Screenshot of the Defender for DevOps dashboard." lightbox="media/defender-for-devops-introduction/devops-dashboard.png":::

Here, you can add environments, open and customize DevOps workbooks to show your desired metrics, view our guides and give feedback, and configure your pull request annotations.

### Understanding your metrics

:::image type="content" source="media/defender-for-devops-introduction/devops-metrics.png" alt-text="Screenshot of the top of the Defender for DevOps page that shows all of your attached environments and their metrics." lightbox="media/defender-for-devops-introduction/devops-metrics.png":::

|Page section| Description |
|--|--|
| :::image type="content" source="media/defender-for-devops-introduction/number-vulnerabilities.png" alt-text="Screenshot of the vulnerabilities section of the page."::: | From here you can see the total number of vulnerabilities that were found by the Defender for DevOps scanners and you can organize the results by severity level. |
| :::image type="content" source="media/defender-for-devops-introduction/number-findings.png" alt-text="Screenshot of the findings section and the associated recommendations."::: | Presents the total number of findings by scan type and the associated recommendations for any onboarded resources. Selecting a result will take you to relevant recommendations. |
| :::image type="content" source="media/defender-for-devops-introduction/connectors-section.png" alt-text="Screenshot of the connectors section."::: | Provides visibility into the number of connectors. The number of repositories that have been onboarded by an environment. |

### Review your findings

The lower half of the page allows you to review all of the onboarded DevOps resources and the security information related to them.

:::image type="content" source="media/defender-for-devops-introduction/bottom-of-page.png" alt-text="Screenshot of the lower half of the Defender for DevOps overview page." lightbox="media/defender-for-devops-introduction/bottom-of-page.png":::


On this part of the screen you will see:

- **Repositories**: Lists all onboarded repositories from GitHub and Azure DevOps. You can get more information about specific resources by selecting it.

- **Pull request status**: Shows whether PR annotations are enabled for the repository. 
    - `On` - PR annotations are enabled.
    - `Off` - PR annotations are not enabled.
    - `NA` - Defender for Cloud doesn't have information about the enablement. Currently, this information is available only for Azure DevOps repositories.

- **Total exposed secrets** - Shows number of secrets identified in the repositories.

- **OSS vulnerabilities** – Shows number of vulnerabilities identified in the repositories. Currently, this information is available only for GitHub repositories.

- **Total code scanning findings** – Shows number of other code vulnerabilities and misconfigurations identified in the repositories.

## Learn more

- You can learn more about DevOps from our [DevOps resource center](/devops/).

- Learn about [security in DevOps](/devops/operate/security-in-devops).

- You can learn about [securing Azure Pipelines](/azure/devops/pipelines/security/overview?view=azure-devops).

- Learn about [security hardening practices for GitHub Actions](https://docs.github.com/actions/security-guides/security-hardening-for-github-actions).

## Next steps

Learn how to [Connect your GitHub repositories to Microsoft Defender for Cloud](quickstart-onboard-github.md).

Learn how to [Connect your Azure DevOps repositories to Microsoft Defender for Cloud](quickstart-onboard-devops.md).
