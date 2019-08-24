---
title: Collaborative coding with Git - Team Data Science Process
description: How to do collaborative code development for data science projects using Git with agile planning.
author: marktab
manager: cgronlun
editor: cgronlun
ms.service: machine-learning
ms.subservice: team-data-science-process
ms.topic: article
ms.date: 09/01/2019
ms.author: tdsp
ms.custom: seodec18, previous-author=deguhath, previous-ms.author=deguhath
---


# Collaborative coding with Git

This article describes how to do collaborative code development for data science projects in Azure Repos, using Git as the shared code development framework. The article covers how to link code in Azure Repos to [agile development](agile-development.md) work items in Azure Boards, and how to do code reviews.

## <a name='Linkaworkitemwithagitbranch-1'></a>Link a work item to a Git branch 

Azure DevOps provides a convenient way to connect an Azure Boards User Story or Task work item with an Azure Repos Git repository branch. You can link your User Story or Task directly to the code associated with it. 

To connect a work item to a new branch, select the **Actions** ellipsis (**...**) next to the work item, and on the context menu, scroll to and select **New branch**.  

![1](./media/collaborative-coding-with-git/1-sprint-board-view.png)

In the **Create a branch** dialog, provide the new branch name and the base Azure Repos Git repository and branch. The base repository must be under the same project as the work item. The base branch can be the master branch or another existing branch. Select **Create branch**. 

![2](./media/collaborative-coding-with-git/2-create-a-branch.png)

It's a good practice to create a Git branch for each User Story work item. Then, for each Task work item, you can create a branch based on the User Story branch. Organizing the branches in a hierarchy that corresponds to the User Story-Task relationship helps when you have multiple people working on different User Stories of the same project, or on different Tasks for the same User Story. Conflicts can be minimized when each team member works on a different branch, or on different code or other artifacts when sharing a branch. 

The following diagram shows the recommended branching strategy for TDSP. You might not need as many branches as shown here, especially when you only have one or two people working on a project, or only one person working on all Tasks of a User Story. But separating the development branch from the master branch is always a good practice that can help prevent the release branch from being interrupted by development activities. For a complete description of the Git branch model, see [A Successful Git Branching Model](https://nvie.com/posts/a-successful-git-branching-model/).

![3](./media/collaborative-coding-with-git/3-git-branches.png)

To switch to your working branch, run the following command in a Windows or Linux command shell: 

```bash
git checkout <working branch name>
```

After you switch to the working branch, you can start developing code or documentation artifacts to complete the work item. Running `git checkout master` switches you back to the `master` branch.

You can also link a work item to an existing branch. On the **Detail** page of a work item, select **Add link**. Then select the existing branch you want to link the work item to, and select **OK**. 

![4](./media/collaborative-coding-with-git/4-link-to-an-existing-branch.png)

You can also create a new branch using the following Git bash command:

```bash
git checkout -b <new branch name> <base branch name>

```
If you don't specify a \<base branch name>, the new branch is based on `master`. 

## <a name='WorkonaBranchandCommittheChanges-2'></a>Work on a branch and commit the changes 

If you make a change for your work item, such as adding an R script file to your local machine's `script` branch, you can commit the change from your local branch to the upstream working branch by using the following Git commands:

```bash
git status
git add .
git commit -m "added an R script file"
git push origin script
```

![5](./media/collaborative-coding-with-git/5-sprint-push-to-branch.png)

## <a name='CreateapullrequestonVSTS-3'></a>Create a pull request in Azure Repos

After one or more commits and pushes, when you are ready to merge your current working branch into its base branch, you can create and submit a *pull request* in Azure Repos. 

From the main page of your Azure DevOps project, point to **Repos** > **Pull requests** in the left navigation. Then select either **New pull request** button, or the **Create a pull request** link.

![6](./media/collaborative-coding-with-git/6-spring-create-pull-request.png)

On the **New Pull Request** screen, if necessary, navigate to the Git repository and branch you want to merge your branch into, and change or add any other information. Under **Reviewers**, add the names of those you need to review your changes. Select **Create**. 

Fill in some description about this pull request, add reviewers, and send it out.

![7](./media/collaborative-coding-with-git/7-spring-send-pull-request.png)

## <a name='ReviewandMerge-4'></a>Review and merge 

When you create the pull request, your reviewers get an email notification to review the pull requests. The reviewers test whether the changes work, and check the changes with the requester if possible. The reviewers can make comments, request changes, and approve or reject the pull request based on their assessment. 

![8](./media/collaborative-coding-with-git/8-add_comments.png)

![9](./media/collaborative-coding-with-git/9-spring-approve-pullrequest.png)

After the reviewers approve the changes, you or someone else with merge permissions can merge the working branch to its base branch by selecting **Complete**. You can delete the working branch after it has merged. 

![10](./media/collaborative-coding-with-git/10-spring-complete-pullrequest.png)

Confirm that the request is marked as **COMPLETED**. 

![11](./media/collaborative-coding-with-git/11-spring-merge-pullrequest.png)

When you go back to **Repos** in the left navigation, you see a notice that you've been switched to the master branch since the `script` branch was deleted.

![12](./media/collaborative-coding-with-git/12-spring-branch-deleted.png)

You can also use the following Git commands to merge the `acript` working branch to its base branch and delete the working branch after merging:

```bash
git checkout master
git merge script
git branch -d script
```

![13](./media/collaborative-coding-with-git/13-spring-branch-deleted-commandline.png)

## Next steps

[Execute data science tasks](execute-data-science-tasks.md) shows how to use utilities to complete several common data science tasks, such as interactive data exploration, data analysis, reporting, and model creation.

[Example walkthroughs](walkthroughs.md) lists and links to walkthroughs that demonstrate the process for **specific scenarios**, with thumbnail descriptions. The scenarios illustrate how to combine cloud and on-premises tools and services into workflows or pipelines to create intelligent applications. 

