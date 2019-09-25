---
title: Tasks for the project lead in the Team Data Science Process
description: A detailed walkthrough of the tasks for a project lead on a Team Data Science Process team
author: marktab
manager: cgronlun
editor: cgronlun
ms.service: machine-learning
ms.subservice: team-data-science-process
ms.topic: article
ms.date: 09/24/2019
ms.author: tdsp
ms.custom: seodec18, previous-author=deguhath, previous-ms.author=deguhath
---

# Tasks for a project lead in the Team Data Science Process

This tutorial describes tasks that a *project lead* completes to set up a repository for their project team in the [Team Data Science Process](overview.md) (TDSP). The TDSP is a framework developed by Microsoft that provides a structured sequence of activities to efficiently execute cloud-based, predictive analytics solutions. The TDSP is designed to help improve collaboration and team learning. For an outline of the personnel roles and associated tasks for a data science team standardizing on the TDSP, see [Team Data Science Process roles and tasks](roles-tasks.md).

A project lead manages the daily activities of individual data scientists on a specific data science project in the TDSP. The following diagram shows the workflow for project lead tasks:

![Project lead task workflow](./media/project-lead-tasks/project-leads-1-tdsp-creating-projects.png)

This tutorial covers steps 1 and 2, setting up a data science project repository.

> [!NOTE] 
> This article uses Azure DevOps and a Data Science Virtual Machine (DSVM) to set up a TDSP project, because that is how to implement TDSP at Microsoft. If your team uses other code hosting or development platforms, the project lead tasks are the same, but the way to complete them may be different.

## Prerequisites

This tutorial assumes that your [group manager](group-manager-tasks.md) and [team lead]](team-lead-tasks.md) have set up the following resources and permissions:

- The Azure DevOps organization for your data unit
- A team project for your data science team
- Team template and utilities repositories
- Permissions on your organization account for you to create repositories for your project

To clone repositories and modify content on your local machine or DSVM, or set up Azure file storage and mount it to your DSVM, you also need the following:

- An Azure subscription.
- Git installed on your machine. If you're using a DSVM, Git is pre-installed. Otherwise, see the [Platforms and tools appendix](platforms-and-tools.md#appendix).
- If you want to use a DSVM, the Windows or Linux DSVM created and configured in Azure. For more information and instructions, see the [Data Science Virtual Machine Documentation](/azure/machine-learning/data-science-virtual-machine/).
- For a Windows DSVM, [Git Credential Manager (GCM)](https://github.com/Microsoft/Git-Credential-Manager-for-Windows) installed on your machine. In the *README.md* file, scroll down to the **Download and Install** section and select the **latest installer**. Download the *.exe* installer from the installer page and run it. 
- For a Linux DSVM, an SSH public key set up on your DSVM and added in Azure DevOps. For more information and instructions, see the **Create SSH public key** section in the [Platforms and tools appendix](platforms-and-tools.md#appendix). 

## Create a project repository in your team project

In this section, you create a project repository in your team's **MyTeam** project.

1. Go to your team's project **Summary** page at *https:\//\<servername>/\<organization-name>/\<TeamName>*, for example, *https:\//dev.azure.com/DataScienceUnit/MyTeam*, and select **Repos** from the left navigation. 
   
   ![Select Repos](./media/project-lead-tasks/project-leads-9-select-repos.png)
   
1. Select the repository name at the top of the page, and then select **New repository** from the dropdown.
   
1. In the **Create a new repository** dialog, make sure **Git** is selected under **Type**. Enter *DSProject1* under **Repository name**, and then select **Create**.
   
   ![Create repository](./media/project-lead-tasks/team-leads-10-create-team-utilities-2.png)
   
1. Confirm that you can see the new **DSProject1** repository on your project settings page. 
   
   ![Project repository in Project Settings](./media/project-lead-tasks/team-leads-11-two-repo-in-team.png)

## Import the team template into your project repository

To populate your project repository with the contents of your team template repository:

1. From your **MyTeam** project home page, select **Repos** in the left navigation. 
   
1. Select the repository name at the top of the page, and select **DSProject1** from the dropdown.
   
1. On the **DSProject1 is empty** page, select **Import**. 
   
   ![Select Import](./media/project-lead-tasks/import-repo.png)
   
1. In the **Import a Git repository** dialog, select **Git** as the **Source type**, and enter the URL for your **TeamTemplate** repository under **Clone URL**. The URL is *https:\//\<server name>/\<organization name>/\<team name>/_git/\<team template repository name>*. For example: *https:\//dev.azure.com/DataScienceUnit/MyTeam/_git/TeamTemplate*. 
   
1. Select **Import**. The contents of your team template repository are imported into your project repository. 
   
   ![Import team template repository](./media/project-lead-tasks/import-repo-2.png)

### Customize the contents of the project repository

If you want to customize the contents of your project repository to meet your project's specific needs, you can do that now. You can modify files, change the directory structure, or add files and folders.

To modify, upload, or create files or folders directly in Azure DevOps, follow the instructions in the **Customize the contents of the group repositories** section of [Group Manager tasks for a data science team](group-manager-tasks.md).

To work with the project repository or other team assets on your local machine or DSVM, follow the instructions in the **Work on your local machine or DSVM** section in [Team lead tasks for a data science team](team-lead-tasks.md).

To create Azure file storage to share data, such as project raw data or features, and give all project members access to the data from multiple DSVMs, follow the instructions in the **Create team data and analytics resources** section of [Team lead tasks for a data science team](team-lead-tasks.md). 

## Add team members and configure permissions

To add members to the team:

1. From the **MyTeam** project home page, select **Project settings** from the left navigation. 
   
1. From the **Project Settings** left navigation, select **Teams**, then on the **Teams** page, select the **MyTeam Team**. 
   
   ![Configure Teams](./media/project-lead-tasks/teams.png)
   
1. On the **Team Profile** page, select **Add**.
   
   ![Add to MyTeam Team](./media/project-lead-tasks/add-to-team.png)
   
1. In the **Add users and groups** dialog, search for and select members to add to the group, and then select **Save changes**. 
   
   ![Add users and groups](./media/project-lead-tasks/add-users.png)
   

To configure permissions for team members:

1. From the **Project Settings** left navigation, select **Permissions**. 
   
1. On the **Permissions** page, select the group you want to add members to. 
   
1. On the page for that group, select **Members**, and then select **Add**. 
   
1. In the **Invite members** popup, search for and select members to add to the group, and then select **Save**. 
   
   ![Grant permissions to members](./media/project-lead-tasks/grant-permissions.png)

## Next steps

Here are links to detailed descriptions of the other roles and tasks defined by the Team Data Science Process:

- [Group Manager tasks for a data science team](group-manager-tasks.md)
- [Team Lead tasks for a data science team](team-lead-tasks.md)
- [Individual Contributor tasks for a data science team](project-ic-tasks.md)
