---
title: Tutorial Enable pull request annotations in GitHub or in Azure DevOps
description: Add pull request annotations in GitHub or in Azure DevOps. By adding pull request annotations, your SecOps and developer teams so that they can be on the same page when it comes to mitigating issues.
ms.topic: overview
ms.custom: ignite-2022
ms.date: 09/20/2022
---

# Tutorial: Enable pull request annotations in GitHub and Azure DevOps

With Microsoft Defender for Cloud, you can configure pull request annotations in Azure DevOps. Pull request annotations are enabled in Microsoft Defender for Cloud by security operators and are sent to the developers who can then take action directly in their pull requests. This allows both security operators and developers to see the same security issue information in the systems they're accustomed to working in. Security operators see unresolved findings in Defender for Cloud and developers see them in their source code management systems. These issues can then be acted upon by developers when they submit their pull requests. This helps prevent and fix potential security vulnerabilities and misconfigurations before they enter the production stage.

You can get pull request annotations in GitHub if you're a customer of GitHub Advanced Security.

> [!NOTE]
> During the Defender for DevOps preview period, GitHub Advanced Security for Azure DevOps (GHAS for AzDO) is also providing a free trial of pull request annotations.

In this tutorial you'll learn how to:

> [!div class="checklist"]
> * [Enable pull request annotations in GitHub](#enable-pull-request-annotations-in-github).
> * [Enable pull request annotations in Azure DevOps](#enable-pull-request-annotations-in-azure-devops).

## Prerequisites

Before you can follow the steps in this tutorial, you must:

**For GitHub**:

 - Have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin
 - [Enable Defender for Cloud](get-started.md)
 - Have [enhanced security features](enhanced-security-features-overview.md) enabled on your Azure subscriptions
 - [Connect your GitHub repositories to Microsoft Defender for Cloud](quickstart-onboard-github.md)
 - [Configure the Microsoft Security DevOps GitHub action](github-action.md)
 - Be a [GitHub Advanced Security customer](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security)
 
**For Azure DevOps**:

 - Have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin
 - [Enable Defender for Cloud](get-started.md)
 - Have [enhanced security features](enhanced-security-features-overview.md) enabled on your Azure subscriptions
 - [Connect your Azure DevOps repositories to Microsoft Defender for Cloud](quickstart-onboard-devops.md)
 - [Configure the Microsoft Security DevOps Azure DevOps extension](azure-devops-extension.md)
 - [Setup secret scanning in Azure DevOps](detect-credential-leaks.md#setup-secret-scanning-in-azure-devops)

## Enable pull request annotations in GitHub

By enabling pull request annotations in GitHub, your developers gain the ability to see their security issues when they submit their pull requests directly to the main branch.

**To enable pull request annotations in GitHub**:

1. Sign in to [GitHub](https://github.com/).

1. Select the relevant repository.

1. Select **.github/workflows**.

    :::image type="content" source="media/tutorial-enable-pr-annotations/workflow-folder.png" alt-text="Screenshot that shows where to navigate to, to select the GitHub workflow folder.":::

1. Select **msdevopssec.yml**.

    :::image type="content" source="media/tutorial-enable-pr-annotations/devopssec.png" alt-text="Screenshot that shows you where on the screen to select the msdevopssec.yml file.":::

1. Select **edit**.

    :::image type="content" source="media/tutorial-enable-pr-annotations/edit-button.png" alt-text="Screenshot that shows you what the edit button looks like.":::

1. Locate and update the trigger section to include:

    ```yml
    # Triggers the workflow on push or pull request events but only for the main branch
    push: 
      branches: [ main ]
    pull_request:
      branches: [ main ]
    ```
    
    By adding these lines to your yaml file, you'll configure the action to run when either a push or pull request event occurs on the designated repository.  

    You can also view a [sample repository](https://github.com/microsoft/security-devops-action/tree/main/samples).

    (Optional) You can select which branches you want to run it on by entering the branch(es) under the trigger section. If you want to include all branches remove the lines with the branch list.  

1. Select **Start commit**.

1. Select **Commit changes**.

1. Select **Files changed**.

You'll now be able to see all the issues that were discovered by the scanner.

### Mitigate GitHub issues found by the scanner

Once you've configured the scanner, you'll be able to view all issues that were detected.

**To mitigate GitHub issues found by the scanner**:

1. Navigate through the page and locate an affected file with an annotation.

1. Select **Dismiss alert**.

1. Select a reason to dismiss:

    - **Won't fix** - The alert is noted but won't be fixed.
    - **False positive** - The alert isn't valid.
    - **Used in tests** - The alert isn't in the production code.

## Enable pull request annotations in Azure DevOps

By enabling pull request annotations in Azure DevOps, your developers gain the ability to see their security issues when they submit their pull requests directly to the main branch.

### Enable Build Validation policy for the CI Build

Before you can enable pull request annotations, your main branch must have enabled Build Validation policy for the CI Build.

**To enable Build Validation policy for the CI Build**:

1. Sign in to your Azure DevOps project.

1. Navigate to **Project settings** > **Repositories**.

1. Select the repository to enable pull requests on.

1. Select **Policies**.

1. Navigate to **Branch Policies** > **Build Validation**. 

1. Toggle the CI Build to **On**.

### Enable pull request annotations

**To enable pull request annotations in Azure DevOps**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Defender for Cloud** > **DevOps Security**.

1. Select all relevant repositories to enable pull request annotations on.

1. Select **Configure**.

    :::image type="content" source="media/tutorial-enable-pr-annotations/select-configure.png" alt-text="Screenshot that shows you where to select configure, on the screen.":::

1. Toggle Pull request annotations to **On**.

1. Select a category from the drop-down menu. 

    > [!NOTE]
    > Only secret scan results is currently supported.

1. Select a severity level from the drop-down menu.

1. Select **Save**.

All annotations will now be displayed based on your configurations with the relevant line of code.

### Mitigate Azure DevOps issues found by the scanner

Once you've configured the scanner, you'll be able to view all issues that were detected.

**To mitigate Azure DevOps issues found by the scanner**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Pull requests**.

1. Scroll through the Overview page and locate an affected line with an annotation.

1. Select **Active**.

1. Select action to take:

    - **Active** - The default status for new annotations.    
    - **Pending** - The finding is being worked on.
    - **Resolved** - The finding has been addressed.
    - **Won't fix** - The finding is noted but won't be fixed.
    - **Closed** - The discussion in this annotation is closed.

## Learn more

In this tutorial, you learned how to enable pull request annotations in GitHub and Azure DevOps.

Learn more about [Defender for DevOps](defender-for-devops-introduction.md).

Learn how to [connect your GitHub](quickstart-onboard-github.md) to Defender for Cloud.

Learn how to [connect your Azure DevOps](quickstart-onboard-devops.md) to Defender for Cloud.

## Next steps

> [!div class="nextstepaction"]
> Now learn more about [Defender for DevOps](defender-for-devops-introduction.md).
