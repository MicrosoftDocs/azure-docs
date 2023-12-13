---
title: Microsoft Defender for Cloud DevOps security - the benefits and features
description: Learn about the benefits and features of Microsoft DevOps security
ms.date: 01/24/2023
ms.topic: overview
ms.custom: references_regions
---

# Overview of Microsoft Defender for Cloud DevOps Security 

Microsoft Defender for Cloud enables comprehensive visibility, posture management, and threat protection across multicloud environments including Azure, AWS, GCP, and on-premises resources. 

DevOps security within Defender for Cloud uses a central console to empower security teams with the ability to protect applications and resources from code to cloud across multi-pipeline environments, including Azure DevOps, GitHub, and GitLab. DevOps security recommendations can then be correlated with other contextual cloud security insights to prioritize remediation in code. Key DevOps security capabilities include:

- **Unified visibility into DevOps security posture**: Security administrators now have full visibility into DevOps inventory and the security posture of preproduction application code across multi-pipeline and multicloud environments, which includes findings from code, secret, and open-source dependency vulnerability scans. They can also [assess the security configurations of their DevOps environment](concept-devops-posture-management-overview.md).

- **Strengthen cloud resource configurations throughout the development lifecycle**: You can enable security of Infrastructure as Code (IaC) templates and container images to minimize cloud misconfigurations reaching production environments, allowing security administrators to focus on any critical evolving threats.

- **Prioritize remediation of critical issues in code**: Apply comprehensive code-to-cloud contextual insights within Defender for Cloud. Security admins can help developers prioritize critical code fixes with pull request annotations and assign developer ownership by triggering custom workflows feeding directly into the tools developers know and love.

These features help unify, strengthen, and manage multi-pipeline DevOps resources. 

## Manage your DevOps environments in Defender for Cloud

DevOps security in Defender for Cloud allow you to manage your connected environments and provide your security teams with a high-level overview of issues discovered in those environments through the [DevOps security console](https://portal.azure.com/#view/Microsoft_Azure_Security/SecurityMenuBlade/~/DevOpsSecurity).

:::image type="content" source="media/defender-for-devops-introduction/devops-security-overview-2.png" alt-text="Screenshot of the top of the DevOps security page that shows all of your onboarded environments and their metrics." lightbox="media/defender-for-devops-introduction/devops-metrics.png":::

Here, you can add [Azure DevOps](quickstart-onboard-devops.md), [GitHub](quickstart-onboard-github.md), and [GitLab](quickstart-onboard-gitlab.md) environments, customize the [DevOps workbook](custom-dashboards-azure-workbooks.md#use-the-devops-security-workbook) to show your desired metrics, [configure pull request annotations](enable-pull-request-annotations.md), and view our guides and give feedback.

### Understanding your DevOps security

|Page section| Description |
|--|--|
| :::image type="content" source="media/defender-for-devops-introduction/security-overview.png" alt-text="Screenshot of the scan finding metrics sections of the page."::: | Total number of DevOps security scan findings (code, secret, dependency, infrastructure-as-code) grouped by severity level and by finding type. |
| :::image type="content" source="media/defender-for-devops-introduction/connectors-section.png" alt-text="Screenshot of the DevOps environment posture management recommendation card."::: | Provides visibility into the number of DevOps environment posture management recommendations highlighting high severity findings and number of affected resources. |
| :::image type="content" source="media/defender-for-devops-introduction/advanced-security.png" alt-text="Screenshot of DevOps advanced security coverage per source code management system onboarded."::: | Provides visibility into the number of DevOps resources with advanced security capabilities out of the total number of resources onboarded by environment. |

### Review your findings

The DevOps inventory table allows you to review onboarded DevOps resources and the security information related to them.

:::image type="content" source="media/defender-for-devops-introduction/inventory-grid.png" alt-text="Screenshot of the devops inventory table on the DevOps security overview page." lightbox="media/defender-for-devops-introduction/bottom-of-page.png":::

On this part of the screen you see:

- **Name** - Lists onboarded DevOps resources from Azure DevOps, GitHub, and/or GitLab. View the resource health page by clicking it. 

- **DevOps environment** - Describes the DevOps environment for the resource (that is, Azure DevOps, GitHub, GitLab).  Use this column to sort by environment if multiple environments have been onboarded.

- **Advanced security status** -  Shows whether advanced security features are enabled for the DevOps resource. 
    - `On` - Advanced security is enabled.
    - `Off` - Advanced security is not enabled.
    - `Partially enabled` - Certain Advanced security features is not enabled (for example, code scanning is off).
    - `N/A` - Defender for Cloud doesn't have information about enablement.
 
    > [!NOTE]
    > Currently, this information is available only for Azure DevOps and GitHub repositories.

- **Pull request annotation status** -  Shows whether PR annotations are enabled for the repository. 
    - `On` - PR annotations are enabled.
    - `Off` - PR annotations aren't enabled.
    - `N/A` - Defender for Cloud doesn't have information about enablement. 
    
    > [!NOTE]
    > Currently, this information is available only for Azure DevOps repositories.

- **Findings** - Shows the total number of code, secret, dependency, and infrastructure-as-code findings identified in the DevOps resource.

This table can be viewed as a flat view at the DevOps resource level (repositories for Azure DevOps and GitHub, projects for GitLab) or in a grouping view showing organizations/projects/groups hierarchy.  Also, the table can be filtered by subscription, resource type, finding type, or severity.

## Learn more

- You can learn more about DevOps from our [DevOps resource center](/devops/).

- Learn about [security in DevOps](/devops/operate/security-in-devops).

- You can learn about [securing Azure Pipelines](/azure/devops/pipelines/security/overview).

- Learn about [security hardening practices for GitHub Actions](https://docs.github.com/actions/security-guides/security-hardening-for-github-actions).

## Next steps

[Connect your Azure DevOps organizations](quickstart-onboard-devops.md).

[Connect your GitHub organizations](quickstart-onboard-github.md).

[Connect your GitLab groups](quickstart-onboard-gitlab.md).
