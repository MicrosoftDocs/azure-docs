---[Enable Defender for cloud](get-started.md)
title: Tutorial
description: 
ms.topic: overview
ms.date: 08/16/2022
---

# Tutorial: Enable pull request annotations in GitHub and Azure DevOps

Defender for Cloud allows you to configure pull request annotations to show you security issues. These issues are then displayed to developers when they submit their pull requests to the main branch. This is beneficial because it helps prevent potential security vulnerabilities and misconfigurations before they enter the production stage. 

In this tutorial you'll learn how to:

> [!div class="checklist"]
> * Enable pull request annotations in GitHub and Azure DevOps.

## Prerequisites

Before you can follow the steps in this tutorial you must:

 - An Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
 - [Enable Defender for cloud](get-started.md)
 - [Enhanced security features](enhanced-security-features-overview.md) enabled on your Azure subscriptions
 - [Connect your GitHub repositories to Microsoft Defender for Cloud](quickstart-onboard-github.md)
 - [Enable Microsoft Security DevOps GitHub Action](msdo-github-action.md)
 - Be a [GitHub Advanced Security customer](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security)
 
## Enable pull request annotations

Defender for Cloud gives you the ability to configure pull request annotations. This is beneficial to your developers because they will be able to see their security issues when they submit their pull requests directly to the main branch.

**To enable pull request annotations in GitHub and Azure DevOps**:

1. Sign in to [Github](https://github.com/).

1. Select the relevant repository.

1. Select **.github/workflows**.

    :::image type="content" source="media/tutorial-enable-pr-annotations/workflow-folder.png" alt-text="Screenshot that shows where to navigate to, to select the github workflow folder.":::

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
    This will configure the action to run when either a push or pull request event occurs on the designated repo.  

    (Optional) You can select which branches you want to run it on by entering the branch(es) under the trigger section.If you want to include all branches remove the lines with the branch list.  

1. Select **Start commit**.

1. Select **Commit changes**.

1. Select **Files changed**.

You will now be able to see all the issues that were discovered by the scanner.

## Mitigate issues found by the scanner

Once you have configured the scanner you will be able to view all issues that were detected.

**To mitigate issues**:

1. Navigate through the page and locate an affected file with an annotation.

1. Select **Dismiss alert**.

1. Select a reason to dismiss:

    - **Won't fix** - The alert is not relevant.
    - **False positive** - The alert is not valid
    - **Used in tests** - The alert was not in the production's code.