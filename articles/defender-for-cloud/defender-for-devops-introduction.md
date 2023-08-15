---
title: Microsoft Defender for DevOps - the benefits and features
description: Learn about the benefits and features of Microsoft Defender for
ms.date: 01/24/2023
ms.topic: overview
ms.custom: references_regions
---

# Overview of Defender for DevOps

> [!IMPORTANT]
> Microsoft Defender for DevOps is constantly making changes and updates that require Defender for DevOps customers who have onboarded their GitHub environments in Defender for Cloud to provide permissions as part of the application deployed in their GitHub organization. These permissions are necessary to ensure all of the security features of Defender for DevOps operate normally and without issues.
> 
> Please see the recent release note for [instructions on how to add these additional permissions](release-notes.md#defender-for-devops-github-application-update).

Microsoft Defender for Cloud enables comprehensive visibility, posture management, and threat protection across multicloud environments including Azure, AWS, GCP, and on-premises resources. Defender for DevOps, a service available in Defender for Cloud, empowers security teams to manage DevOps security across multi-pipeline environments.

Defender for DevOps uses a central console to empower security teams with the ability to protect applications and resources from code to cloud across multi-pipeline environments, such as GitHub and Azure DevOps. Findings from Defender for DevOps can then be correlated with other contextual cloud security insights to prioritize remediation in code. Key capabilities in Defender for DevOps include: 

- **Unified visibility into DevOps security posture**: Security administrators now have full visibility into DevOps inventory and the security posture of pre-production application code, which includes findings from code, secret, and open-source dependency vulnerability scans. They can configure their DevOps resources across multi-pipeline and multicloud environments in a single view.

- **Strengthen cloud resource configurations throughout the development lifecycle**: You can enable security of Infrastructure as Code (IaC) templates and container images to minimize cloud misconfigurations reaching production environments, allowing security administrators to focus on any critical evolving threats.

- **Prioritize remediation of critical issues in code**: Apply comprehensive code to cloud contextual insights within Defender for Cloud. Security admins can help developers prioritize critical code fixes with Pull Request annotations and assign developer ownership by triggering custom workflows feeding directly into the tools developers use and love.

Defender for DevOps helps unify, strengthen and manage multi-pipeline DevOps security. 

## Availability
| Aspect | Details |
|--|--|
| Release state: | Preview<br>The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. |
| Clouds | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Microsoft Azure operated by 21Vianet) |
| Regions: | Australia East, Central US, West Europe |
| Source Code Management Systems | [Azure DevOps](https://portal.azure.com/#home) <br>[GitHub](https://github.com/) supported versions: GitHub Free, Pro, Team, and GitHub Enterprise Cloud | 
| Required permissions: | <br> **Azure account** - with permissions to sign into Azure portal. <br> **Contributor** - on the relevant Azure subscription. <br> **Organization Administrator** - in GitHub. <br> **Security Admin role** - in Defender for Cloud. |

## Manage your DevOps environments in Defender for Cloud

Defender for DevOps allows you to manage your connected environments and provides your security teams with a high level overview of discovered issues that may exist within them through the [Defender for DevOps console](https://portal.azure.com/#view/Microsoft_Azure_Security/SecurityMenuBlade/~/DevOpsSecurity).

:::image type="content" source="media/defender-for-devops-introduction/devops-dashboard.png" alt-text="Screenshot of the Defender for DevOps dashboard." lightbox="media/defender-for-devops-introduction/devops-dashboard.png":::

Here, you can [add GitHub](quickstart-onboard-github.md) and [Azure DevOps](quickstart-onboard-devops.md) environments, customize DevOps workbooks to show your desired metrics, view our guides and give feedback, and [configure your pull request annotations](enable-pull-request-annotations.md).

### Understanding your DevOps security

:::image type="content" source="media/defender-for-devops-introduction/devops-metrics.png" alt-text="Screenshot of the top of the Defender for DevOps page that shows all of your attached environments and their metrics." lightbox="media/defender-for-devops-introduction/devops-metrics.png":::

|Page section| Description |
|--|--|
| :::image type="content" source="media/defender-for-devops-introduction/number-vulnerabilities.png" alt-text="Screenshot of the vulnerabilities section of the page."::: | Shows the total number of vulnerabilities found by Defender for DevOps. You can organize the results by severity level. |
| :::image type="content" source="media/defender-for-devops-introduction/number-findings.png" alt-text="Screenshot of the findings section and the associated recommendations."::: | Presents the total number of findings by scan type and the associated recommendations for any onboarded resources. Selecting a result takes you to corresponding recommendations. |
| :::image type="content" source="media/defender-for-devops-introduction/connectors-section.png" alt-text="Screenshot of the connectors section."::: | Provides visibility into the number of connectors and repositories that have been onboarded by an environment. |

### Review your findings

The lower half of the page allows you to review onboarded DevOps resources and the security information related to them.

:::image type="content" source="media/defender-for-devops-introduction/bottom-of-page.png" alt-text="Screenshot of the lower half of the Defender for DevOps overview page." lightbox="media/defender-for-devops-introduction/bottom-of-page.png":::

On this part of the screen you see:

- **Repositories** - Lists onboarded repositories from GitHub and Azure DevOps. View more information about a specific resource by selecting it.

- **Pull request annotation status** -  Shows whether PR annotations are enabled for the repository. 
    - `On` - PR annotations are enabled.
    - `Off` - PR annotations aren't enabled.
    - `NA` - Defender for Cloud doesn't have information about enablement. 
    
    > [!NOTE]
    > Currently, this information is available only for Azure DevOps repositories.

- **Exposed secrets** - Shows the number of secrets identified in the repositories.

- **OSS vulnerabilities** – Shows the number of open source dependency vulnerabilities identified in the repositories. 

    > [!NOTE]
    > Currently, this information is available only for GitHub repositories.

- **IaC scanning findings** – Shows the number of infrastructure as code misconfigurations identified in the repositories.

- **Code scanning findings** – Shows the number of code vulnerabilities and misconfigurations identified in the repositories.

## Learn more

- You can learn more about DevOps from our [DevOps resource center](/devops/).

- Learn about [security in DevOps](/devops/operate/security-in-devops).

- You can learn about [securing Azure Pipelines](/azure/devops/pipelines/security/overview).

- Learn about [security hardening practices for GitHub Actions](https://docs.github.com/actions/security-guides/security-hardening-for-github-actions).

## Next steps

[Configure the Microsoft Security DevOps GitHub action](github-action.md).

[Configure the Microsoft Security DevOps Azure DevOps extension](azure-devops-extension.md)
