---
title: Support and prerequisites 
description: Understand support and prerequisites for DevOps security in Microsoft Defender for Cloud
ms.date: 11/05/2023
ms.topic: article
ms.custom: ignite-2023
---

# Support and prerequisites: DevOps security

This article summarizes support information for DevOps security capabilities in Microsoft Defender for Cloud.

## Cloud and region support

DevOps security is available in the Azure commercial cloud, in these regions:
* Asia (East Asia)
* Australia (Australia East)
* Canada (Canada Central)
* Europe (West Europe, North Europe, Sweden Central)
* UK (UK South)
* US (East US, Central US)

## DevOps platform support

DevOps security currently supports the following DevOps platforms:
* [Azure DevOps Services](https://azure.microsoft.com/products/devops/)
* [GitHub Enterprise Cloud](https://docs.github.com/en/enterprise-cloud@latest/admin/overview/about-github-enterprise-cloud)
* [GitLab SaaS](https://docs.gitlab.com/ee/subscriptions/gitlab_com/)

## Required permissions

DevOps security requires the following permissions:

| Feature                          | Permissions                      | 
|----------------------------------|----------------------------------|
| Connect DevOps environments to Defender for Cloud | <ul><li>Azure: Subscription Contributor or Security Admin</li><li>Azure DevOps: Project Collection Administrator on target Organization</li><li>GitHub: Organization Owner</li><li>GitLab: Group Owner on target Group</li></ul> |
| Review security insights and findings | Security Reader |
| Configure pull request annotations | Subscription Contributor or Owner |
| Install the Microsoft Security DevOps extension in Azure DevOps | Azure DevOps Project Collection Administrator |
| Install the Microsoft Security DevOps action in GitHub | GitHub Write |

> [!NOTE]
> **Security Reader** role can be applied on the Resource Group or connector scope to avoid setting highly privileged permissions on a Subscription level for read access of DevOps security insights and findings.

## Feature availability

The following tables summarize the availability and prerequisites for each feature within the supported DevOps platforms:

> [!NOTE]
> DevOps security features under the Defender CSPM plan will remain free until March 1, 2024.  Defender CSPM DevOps security features include code-to-cloud contextualization powering security explorer and attack paths and pull request annotations for Infrastructure-as-Code security findings.

### Azure DevOps

| Feature                          | Foundational CSPM                         | Defender CSPM                             | Prerequisites |
|----------------------------------|:-----------------------------------------:|:-----------------------------------------:|---------------|
| [Connect Azure DevOps repositories](quickstart-onboard-devops.md) | ![Yes Icon](./media/icons/yes-icon.png) | ![Yes Icon](./media/icons/yes-icon.png) | See [here](quickstart-onboard-devops.md#prerequisites) |
| [Security recommendations to fix code vulnerabilities](defender-for-devops-introduction.md#manage-your-devops-environments-in-defender-for-cloud)| ![Yes Icon](./media/icons/yes-icon.png) | ![Yes Icon](./media/icons/yes-icon.png) | [GitHub Advanced Security for Azure DevOps](/azure/devops/repos/security/configure-github-advanced-security-features?view=azure-devops&tabs=yaml&preserve-view=true) for CodeQL findings, [Microsoft Security DevOps extension](azure-devops-extension.md) |
| [Security recommendations to discover exposed secrets](defender-for-devops-introduction.md#manage-your-devops-environments-in-defender-for-cloud) | ![Yes Icon](./media/icons/yes-icon.png) | ![Yes Icon](./media/icons/yes-icon.png) | [GitHub Advanced Security for Azure DevOps](/azure/devops/repos/security/configure-github-advanced-security-features?view=azure-devops&tabs=yaml&preserve-view=true) |
| [Security recommendations to fix open source vulnerabilities](defender-for-devops-introduction.md#manage-your-devops-environments-in-defender-for-cloud) | ![Yes Icon](./media/icons/yes-icon.png) | ![Yes Icon](./media/icons/yes-icon.png) | [GitHub Advanced Security for Azure DevOps](/azure/devops/repos/security/configure-github-advanced-security-features?view=azure-devops&tabs=yaml&preserve-view=true) |
| [Security recommendations to fix infrastructure as code misconfigurations](iac-vulnerabilities.md#configure-iac-scanning-and-view-the-results-in-azure-devops) | ![Yes Icon](./media/icons/yes-icon.png) | ![Yes Icon](./media/icons/yes-icon.png) | [Microsoft Security DevOps extension](azure-devops-extension.md) |
| [Security recommendations to fix DevOps environment misconfigurations](concept-devops-posture-management-overview.md) | ![Yes Icon](./media/icons/yes-icon.png) | ![Yes Icon](./media/icons/yes-icon.png) | N/A |
| [Pull request annotations](review-pull-request-annotations.md) | | ![Yes Icon](./media/icons/yes-icon.png) | See [here](enable-pull-request-annotations.md) |
| [Code to cloud mapping for Containers](container-image-mapping.md) | | ![Yes Icon](./media/icons/yes-icon.png) | [Microsoft Security DevOps extension](azure-devops-extension.md#configure-the-microsoft-security-devops-azure-devops-extension-1) |
| [Code to cloud mapping for Infrastructure as Code templates](iac-template-mapping.md) | | ![Yes Icon](./media/icons/yes-icon.png) | [Microsoft Security DevOps extension](azure-devops-extension.md) |
| [Attack path analysis](how-to-manage-attack-path.md) | | ![Yes Icon](./media/icons/yes-icon.png) | Enable Defender CSPM on the Azure DevOps connector |
| [Cloud security explorer](how-to-manage-cloud-security-explorer.md) | | ![Yes Icon](./media/icons/yes-icon.png) | Enable Defender CSPM on the Azure DevOps connector |


### GitHub

| Feature                          | Foundational CSPM                         | Defender CSPM                             | Prerequisites |
|----------------------------------|:-----------------------------------------:|:-----------------------------------------:|---------------|
| [Connect GitHub repositories](quickstart-onboard-github.md) | ![Yes Icon](./media/icons/yes-icon.png) | ![Yes Icon](./media/icons/yes-icon.png) | See [here](quickstart-onboard-github.md#prerequisites) |
| [Security recommendations to fix code vulnerabilities](defender-for-devops-introduction.md#manage-your-devops-environments-in-defender-for-cloud)| ![Yes Icon](./media/icons/yes-icon.png) | ![Yes Icon](./media/icons/yes-icon.png) | [GitHub Advanced Security](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security), [Microsoft Security DevOps action](github-action.md) |
| [Security recommendations to discover exposed secrets](defender-for-devops-introduction.md#manage-your-devops-environments-in-defender-for-cloud) | ![Yes Icon](./media/icons/yes-icon.png) | ![Yes Icon](./media/icons/yes-icon.png) | [GitHub Advanced Security](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security) |
| [Security recommendations to fix open source vulnerabilities](defender-for-devops-introduction.md#manage-your-devops-environments-in-defender-for-cloud) | ![Yes Icon](./media/icons/yes-icon.png) | ![Yes Icon](./media/icons/yes-icon.png) | [GitHub Advanced Security](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security) |
| [Security recommendations to fix infrastructure as code misconfigurations](iac-vulnerabilities.md#configure-iac-scanning-and-view-the-results-in-azure-devops) | ![Yes Icon](./media/icons/yes-icon.png) | ![Yes Icon](./media/icons/yes-icon.png) | [GitHub Advanced Security](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security), [Microsoft Security DevOps action](github-action.md) |
| [Security recommendations to fix DevOps environment misconfigurations](concept-devops-posture-management-overview.md) | ![Yes Icon](./media/icons/yes-icon.png) | ![Yes Icon](./media/icons/yes-icon.png) | N/A |
| [Code to cloud mapping for Containers](container-image-mapping.md) | | ![Yes Icon](./media/icons/yes-icon.png) | [Microsoft Security DevOps action](github-action.md) |
| [Code to cloud mapping for Infrastructure as Code templates](iac-template-mapping.md) | | ![Yes Icon](./media/icons/yes-icon.png) | [Microsoft Security DevOps action](github-action.md) |
| [Attack path analysis](how-to-manage-attack-path.md) | | ![Yes Icon](./media/icons/yes-icon.png) | Enable Defender CSPM on the GitHub connector |
| [Cloud security explorer](how-to-manage-cloud-security-explorer.md) | | ![Yes Icon](./media/icons/yes-icon.png) | Enable Defender CSPM on the GitHub connector |


### GitLab

| Feature                          | Foundational CSPM                         | Defender CSPM                             | Prerequisites |
|----------------------------------|:-----------------------------------------:|:-----------------------------------------:|---------------|
| [Connect GitLab projects](quickstart-onboard-gitlab.md) | ![Yes Icon](./media/icons/yes-icon.png) | ![Yes Icon](./media/icons/yes-icon.png) | See [here](quickstart-onboard-gitlab.md#prerequisites) |
| [Security recommendations to fix code vulnerabilities](defender-for-devops-introduction.md#manage-your-devops-environments-in-defender-for-cloud)| ![Yes Icon](./media/icons/yes-icon.png) | ![Yes Icon](./media/icons/yes-icon.png) | [GitLab Ultimate](https://about.gitlab.com/pricing/ultimate/) |
| [Security recommendations to discover exposed secrets](defender-for-devops-introduction.md#manage-your-devops-environments-in-defender-for-cloud) | ![Yes Icon](./media/icons/yes-icon.png) | ![Yes Icon](./media/icons/yes-icon.png) | [GitLab Ultimate](https://about.gitlab.com/pricing/ultimate/) |
| [Security recommendations to fix open source vulnerabilities](defender-for-devops-introduction.md#manage-your-devops-environments-in-defender-for-cloud) | ![Yes Icon](./media/icons/yes-icon.png) | ![Yes Icon](./media/icons/yes-icon.png) | [GitLab Ultimate](https://about.gitlab.com/pricing/ultimate/) |
| [Security recommendations to fix infrastructure as code misconfigurations](defender-for-devops-introduction.md#manage-your-devops-environments-in-defender-for-cloud) | ![Yes Icon](./media/icons/yes-icon.png) | ![Yes Icon](./media/icons/yes-icon.png) | [GitLab Ultimate](https://about.gitlab.com/pricing/ultimate/) |
| [Cloud security explorer](how-to-manage-cloud-security-explorer.md) | | ![Yes Icon](./media/icons/yes-icon.png) | Enable Defender CSPM on the GitLab connector |
