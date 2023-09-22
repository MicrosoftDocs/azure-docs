---
title: Enable pull request annotations in GitHub or in Azure DevOps
description: Add pull request annotations in GitHub or in Azure DevOps. By adding pull request annotations, your SecOps and developer teams so that they can be on the same page when it comes to mitigating issues.
ms.topic: overview
ms.custom: ignite-2022
ms.date: 06/06/2023
---

# Enable pull request annotations in GitHub and Azure DevOps

Defender for DevOps exposes security findings as annotations in Pull Requests (PR). Security operators can enable PR annotations in Microsoft Defender for Cloud. Any exposed issues can then be remedied by developers. This process can prevent and fix potential security vulnerabilities and misconfigurations before they enter the production stage. Defender for DevOps annotates the vulnerabilities within the differences in the file rather than all the vulnerabilities detected across the entire file. Developers are able to see annotations in their source code management systems and Security operators can see any unresolved findings in Microsoft Defender for Cloud.  

With Microsoft Defender for Cloud, you can configure PR annotations in Azure DevOps. You can get PR annotations in GitHub if you're a GitHub Advanced Security customer. 

> [!NOTE]
> GitHub Advanced Security for Azure DevOps (GHAzDO) is providing a free trial of PR annotations during the Defender for DevOps preview. 

## What are pull request annotations

Pull request annotations are comments that are added to a pull request in GitHub or Azure DevOps. These annotations provide feedback on the code changes made and identified security issues in the pull request and help reviewers understand the changes that are made.

Annotations can be added by a user with access to the repository, and can be used to suggest changes, ask questions, or provide feedback on the code. Annotations can also be used to track issues and bugs that need to be fixed before the code is merged into the main branch. Defender for DevOps uses annotations to surface security findings. 

## Prerequisites

**For GitHub**:

- An Azure account. If you don't already have an Azure account, you can [create your Azure free account today](https://azure.microsoft.com/free/).
- Be a [GitHub Advanced Security](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security) customer. 
- [Connect your GitHub repositories to Microsoft Defender for Cloud](quickstart-onboard-github.md).
- [Configure the Microsoft Security DevOps GitHub action](github-action.md).
 
**For Azure DevOps**:

- An Azure account. If you don't already have an Azure account, you can [create your Azure free account today](https://azure.microsoft.com/free/).
- [Have write access (owner/contributer) to the Azure subscription](../active-directory/privileged-identity-management/pim-how-to-activate-role.md). 
- [Connect your Azure DevOps repositories to Microsoft Defender for Cloud](quickstart-onboard-devops.md).
- [Configure the Microsoft Security DevOps Azure DevOps extension](azure-devops-extension.md).
- [Setup secret scanning in Azure DevOps](detect-exposed-secrets.md#setup-secret-scanning-in-azure-devops).

## Enable pull request annotations in GitHub

By enabling pull request annotations in GitHub, your developers gain the ability to see their security issues when they create a PR directly to the main branch.

**To enable pull request annotations in GitHub**:

1. Navigate to [GitHub](https://github.com/) and sign in.

1. Select a repository that you've onboarded to Defender for Cloud.

1. Navigate to **`Your repository's home page`** > **.github/workflows**.

    :::image type="content" source="media/tutorial-enable-pr-annotations/workflow-folder.png" alt-text="Screenshot that shows where to navigate to, to select the GitHub workflow folder." lightbox="media/tutorial-enable-pr-annotations/workflow-folder.png":::

1. Select **msdevopssec.yml**, which was created in the [prerequisites](#prerequisites).

    :::image type="content" source="media/tutorial-enable-pr-annotations/devopssec.png" alt-text="Screenshot that shows you where on the screen to select the msdevopssec.yml file." lightbox="media/tutorial-enable-pr-annotations/devopssec.png":::

1. Select **edit**.

    :::image type="content" source="media/tutorial-enable-pr-annotations/edit-button.png" alt-text="Screenshot that shows you what the edit button looks like." lightbox="media/tutorial-enable-pr-annotations/edit-button.png":::

1. Locate and update the trigger section to include:

    ```yml
    # Triggers the workflow on push or pull request events but only for the main branch
    pull_request:
      branches: ["main"]
    ```

    You can also view a [sample repository](https://github.com/microsoft/security-devops-action/tree/main/samples).

    (Optional) You can select which branches you want to run it on by entering the branch(es) under the trigger section. If you want to include all branches remove the lines with the branch list.  

1. Select **Start commit**.

1. Select **Commit changes**.

Any issues that are discovered by the scanner will be viewable in the Files changed section of your pull request.

### Resolve security issues in GitHub

**To resolve security issues in GitHub**:

1. Navigate through the page and locate an affected file with an annotation.

1. Follow the remediation steps in the annotation. If you choose not to remediate the annotation, select **Dismiss alert**.

1. Select a reason to dismiss:

    - **Won't fix** - The alert is noted but won't be fixed.
    - **False positive** - The alert isn't valid.
    - **Used in tests** - The alert isn't in the production code.

## Enable pull request annotations in Azure DevOps

By enabling pull request annotations in Azure DevOps, your developers gain the ability to see their security issues when they create PRs directly to the main branch.

### Enable Build Validation policy for the CI Build

Before you can enable pull request annotations, your main branch must have enabled Build Validation policy for the CI Build.

**To enable Build Validation policy for the CI Build**:

1. Sign in to your Azure DevOps project.

1. Navigate to **Project settings** > **Repositories**.

    :::image type="content" source="media/tutorial-enable-pr-annotations/project-settings.png" alt-text="Screenshot that shows you where to navigate to, to select repositories.":::

1. Select the repository to enable pull requests on.

1. Select **Policies**.

1. Navigate to **Branch Policies** > **Main branch**.

    :::image type="content" source="media/tutorial-enable-pr-annotations/branch-policies.png" alt-text="Screenshot that shows where to locate the branch policies." lightbox="media/tutorial-enable-pr-annotations/branch-policies.png":::

1. Locate the Build Validation section. 

1. Ensure the build validation for your repository is toggled to **On**.

    :::image type="content" source="media/tutorial-enable-pr-annotations/build-validation.png" alt-text="Screenshot that shows where the CI Build toggle is located." lightbox="media/tutorial-enable-pr-annotations/build-validation.png":::

1. Select **Save**. 

    :::image type="content" source="media/tutorial-enable-pr-annotations/validation-policy.png" alt-text="Screenshot that shows the build validation.":::

Once you've completed these steps, you can select the build pipeline you created previously and customize its settings to suit your needs.  

### Enable pull request annotations

**To enable pull request annotations in Azure DevOps**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Defender for Cloud** > **DevOps Security**.

1. Select all relevant repositories to enable the pull request annotations on.

1. Select **Configure**.

    :::image type="content" source="media/tutorial-enable-pr-annotations/select-configure.png" alt-text="Screenshot that shows you how to configure PR annotations within the portal.":::

1. Toggle Pull request annotations to **On**.

    :::image type="content" source="media/tutorial-enable-pr-annotations/annotation-on.png" alt-text="Screenshot that shows the toggle switched to on.":::

1. (Optional) Select a category from the drop-down menu. 

    > [!NOTE]
    > Only Infrastructure-as-Code misconfigurations (ARM, Bicep, Terraform, CloudFormation, Dockerfiles, Helm Charts, and more) results are currently supported.

1. (Optional) Select a severity level from the drop-down menu.

1. Select **Save**.

All annotations on your pull requests will be displayed from now on based on your configurations.

### Resolve security issues in Azure DevOps

Once you've configured the scanner, you're able to view all issues that were detected.

**To resolve security issues in Azure DevOps**:

1. Sign in to the [Azure DevOps](https://azure.microsoft.com/products/devops).

1. Navigate to **Pull requests**.

    :::image type="content" source="media/tutorial-enable-pr-annotations/pull-requests.png" alt-text="Screenshot showing where to go to navigate to pull requests.":::

1. On the Overview, or files page, locate an affected line with an annotation.

1. Follow the remediation steps in the annotation.

1. Select **Active** to change the status of the annotation and access the dropdown menu. 

1. Select an action to take:

    - **Active** - The default status for new annotations.    
    - **Pending** - The finding is being worked on.
    - **Resolved** - The finding has been addressed.
    - **Won't fix** - The finding is noted but won't be fixed.
    - **Closed** - The discussion in this annotation is closed.

Defender for DevOps reactivates an annotation if the security issue isn't fixed in a new iteration.

## Learn more

Learn more about [Defender for DevOps](defender-for-devops-introduction.md).

Learn how to [Discover misconfigurations in Infrastructure as Code](iac-vulnerabilities.md).

Learn how to [detect exposed secrets in code](detect-exposed-secrets.md).

## Next steps

> [!div class="nextstepaction"]
> Now learn more about [Defender for DevOps](defender-for-devops-introduction.md).
