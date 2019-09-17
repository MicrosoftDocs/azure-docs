---
title: Team Data Science Process group manager tasks
description: An outline of the tasks for a group manager on a data science team project.
author: marktab
manager: cgronlun
editor: cgronlun
ms.service: machine-learning
ms.subservice: team-data-science-process
ms.topic: article
ms.date: 09/16/2019
ms.author: tdsp
ms.custom: seodec18, previous-author=deguhath, previous-ms.author=deguhath
---


# Team Data Science Process group manager tasks

This article describes the tasks that a *Group Manager* completes for a data science organization. The Group Manager manages the entire data science unit in an enterprise. A data science unit may have several teams, each of which is working on many data science projects in distinct business verticals. The Group Manager's objective is to establish a collaborative group environment that standardizes on the [Team Data Science Process](overview.md) (TDSP). For an outline of all the personnel roles and associated tasks handled by a data science team standardizing on the TDSP, see [Team Data Science Process roles and tasks](roles-tasks.md).

The following diagram shows the six main Group Manager setup tasks. Group Managers may delegate their tasks to surrogates, but the tasks associated with the role don't change.

![Group Manager tasks](./media/group-manager-tasks/tdsp-group-manager.png)

1. Set up an **Azure DevOps organization** for the group
2. Create a **group project** in the Azure DevOps organization
3. Create the **GroupProjectTemplate** repository in Azure Repos
4. Create the **GroupUtilities** repository in Azure Repos
5. Seed the **GroupProjectTemplate** and **GroupUtilities** repositories from the Microsoft TDSP team group common repositories
6. Set up the **security controls** for team members to access the group

The following tutorial walks through the steps in detail. 

> [!NOTE] 
> The article uses Azure DevOps and a [Data Science Virtual Machine](https://aka.ms/dsvm) (DSVM) to set up a TDSP group environment, because that is how to implement TDSP at Microsoft. If your group uses other code hosting, work item management, or code development platforms, the Group Manager's tasks are the same, but the way to complete them may be different.

## Prerequisites and conventions

The tutorial assumes the following prerequisites and conventions.

### Prerequisites

- Install **Git** on your local machine. If you're using a [Data Science Virtual Machine](https://aka.ms/dsvm) (DSVM), Git is pre-installed and you're good to go. Otherwise, see the [Platforms and tools appendix](platforms-and-tools.md#appendix) for instructions.
- For a **Windows DSVM**, install [Git Credential Manager (GCM)](https://github.com/Microsoft/Git-Credential-Manager-for-Windows) on your machine. In the Git Credential Manager *README.md* file, scroll down to the **Download and Install** section and select **latest installer**. This takes you to the latest installer page. Download the *.exe* installer and run it.
- For a **Linux DSVM**, create an SSH public key on your DSVM and add it to your group Azure DevOps project. For instructions, see the **Create SSH public key** section in the [Platforms and tools appendix](platforms-and-tools.md#appendix).

### Repositories

Azure Repos can host the following types of repositories:

- **Group common repositories**: General-purpose repositories that multiple organizations within a data science unit can adopt for many data science projects. Examples are the **GroupProjectTemplate** and **GroupUtilities** repositories developed and managed by the Microsoft TDSP team.
- **Organization repositories**:  Repositories for specific organizations. These repositories are specific for an organization's needs, and may be used for multiple projects within that organization, but are not general enough to be used across multiple organizations within a data science unit.
- **Project repositories**: Repositories for specific projects. Such repositories may not be general enough for multiple projects within an organization, or other organizations in a data science unit.

This tutorial uses the following abbreviated names to make it easier to follow the operations between the repositories and directories:

- **G1**: The group common template repository the Microsoft TDSP team developed and manages
- **G2**: The group common utilities repository the Microsoft TDSP team developed and manages
- **R1**: The *GroupProjectTemplate* Git repository you set up in the Azure DevOps project
- **R2**: The *GroupUtilities* Git repository you set up in the Azure DevOps group project
- **LG1** and **LG2**: The local directories on your machine that you clone *G1* and *G2* to, respectively
- **LR1** and **LR2**: The local directories on your machine that you clone *R1* and *R2* to, respectively

## Create an organization and project in Azure DevOps

1. Go to [visualstudio.microsoft.com](https://visualstudio.microsoft.com), select **Sign in** in the upper right corner, and sign into your Microsoft account. 
   
   ![Sign in to your Microsoft account](./media/group-manager-tasks/signinvs.png)
   
   If you don't have a Microsoft account, select **Sign up now**, create a Microsoft account, and sign in using this account. If your organization has a Visual Studio subscription, sign in with the credentials for this subscription.
   
1. After you sign in, at upper right on the Azure DevOps page, select **Create new organization**.
   
   ![Create new organization](./media/group-manager-tasks/create-organization.png)
   
1. If you're prompted to agree to the Terms of Service, Privacy Statement, and Code of Conduct, select **Continue**.
   
1. In the signup dialog, name your Azure DevOps organization and accept the region assignment, or drop down and select a different region. Then select **Continue**. 

1. Under **Create a project to get started**, enter *GroupCommon*, and then select **Create project**. 
   
   ![Create project](./media/group-manager-tasks/create-project.png)

The **GroupCommon** project **Summary** page opens. The page URL is *https:\//\<servername>/\<organization-name>/GroupCommon

![Project summary page](./media/group-manager-tasks/project-summary.png)

## Set up the project code repositories:

To set up the two project code repositories: 
- Rename the default **GroupCommon** repository to ***GroupProjectTemplate***
- Create a new **GroupUtilities** repository

### Rename the default project repository to GroupProjectTemplate

To rename the default **GroupCommon** project repository to ***GroupProjectTemplate***, referred to as **R1**:

1. On the **GroupCommon** project **Summary** page, select **Repos**. This takes you to the default **GroupCommon** repository of the GroupCommon project. This repository is currently empty.
   
1. At the top of the page, drop down the arrow next to **GroupCommon** and select **Manage repositories**.
   
  ![Manage repositories](./media/group-manager-tasks/rename-groupcommon-repo-3.png)
   
1. On the **Project Settings** page, select the **...** next to **GroupCommon**, and then select **Rename repository**. 
   
  ![Select ... and then select Rename repository](./media/group-manager-tasks/rename-groupcommon-repo-4.png)
   
1. In the **Rename the GroupCommon repository** popup, enter *GroupProjectTemplate*, and then select **Rename**. 
   
 ![Rename repository](./media/group-manager-tasks/rename-groupcommon-repo-4.png)

## Create the GroupUtilities repository

To create the **GroupUtilities** or **R2** repository:

1. On the **Project Settings** page, select **New repository**.
   
  ![New repository](./media/group-manager-tasks/create-grouputilities-repo-1.png)
   
1. In the **Create a new repository** dialog, select **Git** as the **Type**, enter *GroupUtilities* as the **Repository name**, and then select **Create**.
   
  ![Create GroupUtilities repository](./media/group-manager-tasks/create-grouputilities-repo-2.png)
   
1. Select **Repos** > **Repositories** in the left navigation of the **Project Settings** page to see the two project repositories: **GroupProjectTemplate** and **GroupUtilities**.
   
   ![Two project repositories](./media/group-manager-tasks/two-repositories.png)

## Seed the R1 and R2 repositories with code from the G1 and G2 repositories

In this part of the tutorial, you seed your **GroupProjectTemplate** (R1) and **GroupUtilities** (R2) repositories with the contents of the **ProjectTemplate** (G1) and **Utilities** (G2) repositories managed by the Microsoft TDSP team. When this seeding is complete, your R1 repository will have the directories and templates from the G1 repository, and your R2 repository will have the data science utilities from the Microsoft TDSP team's G2 repository. 

To do the seeding, you use the directories on your local DSVM as intermediate staging sites. The steps are:

1. Clone GI and G2 to LG1 and LG2.
1. Clone R1 and R2 to LR1 and LR2.
1. Copy the LG1 and LG2 files into LR1 and LR2.
1. Upload the LR1 and LR2 files to R1 and R2. 

### Clone the G1 and G2 repositories to your local DSVM

In this step, you clone the Team Data Science Process (TDSP) ProjectTemplate repository (G1) and Utilities (G2) from the TDSP GitHub repositories to folders in your local DSVM as LG1 and LG2:

- Create a directory to serve as the root directory to host all your clones of the repositories.
  -  In the Windows DSVM, create a directory *C:\GitRepos\TDSPCommon*.
  -  In the Linux DSVM, create a directory *GitRepos\TDSPCommon* in your home directory.

- Run the following set of commands from the *GitRepos\TDSPCommon* directory.

  `git clone https://github.com/Azure/Azure-TDSP-ProjectTemplate`<br>
  `git clone https://github.com/Azure/Azure-TDSP-Utilities`

  ![14](./media/group-manager-tasks/two-folder-cloned-from-TDSP-windows.PNG)

- Using our abbreviated repository names, this is what these scripts have achieved:
	- G1 - cloned into -> LG1
	- G2 - cloned into -> LG2
- After the cloning is completed, you should be able to see two directories, _ProjectTemplate_ and _Utilities_, under **GitRepos\TDSPCommon** directory.

### Clone R1 & R2 repositories to your local DSVM

In this step, you clone the GroupProjectTemplate repository (R1) and GroupUtilities repository (R2) on local directories (referred as LR1 and LR2, respectively) under **GitRepos\GroupCommon** on your DSVM.

- To get the URLs of the R1 and R2 repositories, go to your **GroupCommon** home page on Azure DevOps Services. This usually has the URL *https://\<Your Azure DevOps Services Name\>.visualstudio.com/GroupCommon*.
- Click **CODE**.
- Choose the **GroupProjectTemplate** and **GroupUtilities** repositories. Copy and save each of the URLs (HTTPS for Windows; SSH for Linux) from the **Clone URL** element, in turn, for use in the following scripts:

  ![15](./media/group-manager-tasks/find_https_ssh_2.PNG)

- Change into the **GitRepos\GroupCommon** directory on your Windows or Linux DSVM and run one of the following sets of commands to clone R1 and R2 into that directory.

Here are the Windows and Linux scripts:

	# Windows DSVM

	git clone <the HTTPS URL of the GroupProjectTemplate repository>
	git clone <the HTTPS URL of the GroupUtilities repository>

![16](./media/group-manager-tasks/clone-two-empty-group-reo-windows-2.PNG)

	# Linux DSVM

	git clone <the SSH URL of the GroupProjectTemplate repository>
	git clone <the SSH URL of the GroupUtilities repository>

![17](./media/group-manager-tasks/clone-two-empty-group-reo-linux-2.PNG)

> [!NOTE] 
> Expect to receive warning messages that LR1 and LR2 are empty.

- Using our abbreviated repository names, this is what these scripts have achieved:
	- R1 - cloned into -> LR1
	- R2 - cloned into -> LR2	


### Seed your GroupProjectTemplate (LR1) and GroupUtilities (LR2)

Next, in your local machine, copy the content of ProjectTemplate and Utilities directories (except the metadata in the .git directories) under GitRepos\TDSPCommon to your GroupProjectTemplate and GroupUtilities directories under **GitRepos\GroupCommon**. Here are the two tasks to complete in this step:

- Copy the files in GitRepos\TDSPCommon\ProjectTemplate (**LG1**) to GitRepos\GroupCommon\GroupProjectTemplate (**LR1**)
- Copy the files in GitRepos\TDSPCommon\Utilities (**LG2** to GitRepos\GroupCommon\Utilities (**LR2**).

To achieve these two tasks, run the following scripts in PowerShell console (Windows) or Shell script console (Linux). You are prompted to input the complete paths to LG1, LR1, LG2, and LR2. The paths that you input are validated. If you input a directory that does not exist, you are asked to input it again.

	# Windows DSVM
	
    wget "https://raw.githubusercontent.com/Azure/Azure-MachineLearning-DataScience/master/Misc/TDSP/tdsp_local_copy_win.ps1" -outfile "tdsp_local_copy_win.ps1"
    .\tdsp_local_copy_win.ps1 1

![18](./media/group-manager-tasks/copy-two-folder-to-group-folder-windows-2.PNG)

Now you can see that files in directories LG1 and LG1 (except files in the .git directory) have been copied to LR1 and LR2, respectively.

![19](./media/group-manager-tasks/copy-two-folder-to-group-folder-windows.PNG)

	# Linux DSVM

    wget "https://raw.githubusercontent.com/Azure/Azure-MachineLearning-DataScience/master/Misc/TDSP/tdsp_local_copy_linux.sh"
    bash tdsp_local_copy_linux.sh 1

![20](./media/group-manager-tasks/copy-two-folder-to-group-folder-linux-2.PNG)

Now you see that the files in the two folders (except files in the .git directory) are copied to GroupProjectTemplate and GroupUtilities respectively.

![21](./media/group-manager-tasks/copy-two-folder-to-group-folder-linux.PNG)

- Using our abbreviated repository names, this is what these scripts have achieved:
	- LG1 - files copied into -> LR1
	- LG2 - files copied into -> LR2

### Option to customize the contents of LR1 & LR2
	
If you want to customize the contents of LR1 and LR2 to meet the specific needs of your group, this is the stage of the procedure where that is appropriate. You can modify the template documents, change the directory structure, and add existing utilities that your group has developed or that are helpful for your entire group.

### Add the contents in LR1 & LR2 to R1 & R2 on group server

Now, you need to add the contents in LR1 and LR2 to repositories R1 and R2. Here are the git bash commands you can run in either Windows PowerShell or Linux.

Run the following commands from the GitRepos\GroupCommon\GroupProjectTemplate directory:

	git status
	git add .
	git commit -m"push from DSVM"
	git push

The -m option lets you set a message for your git commit.

![22](./media/group-manager-tasks/push-to-group-server-2.PNG)

You can see that in your group's Azure DevOps Services, in the GroupProjectTemplate repository, the files are synced instantly.

![23](./media/group-manager-tasks/push-to-group-server-showed-up-2.PNG)

Finally, change to the **GitRepos\GroupCommon\GroupUtilities** directory and run the same set of git bash commands:

	git status
	git add .
	git commit -m"push from DSVM"
	git push

> [!NOTE] 
> If this is the first time you commit to a Git repository, you need to configure global parameters *user.name* and *user.email* before you run the `git commit` command. Run the following two commands:
>
>  `git config --global user.name <your name>`  
>  `git config --global user.email <your email address>`
>
> If you are committing to multiple Git repositories, use the same name and email address when you commit to each of them. Using the same name and email address proves convenient later on when you build PowerBI dashboards to track your Git activities on multiple repositories.


- Using our abbreviated repository names, this is what these scripts have achieved:
	- LR1 - contents add to -> R1
	- LR2 - contents add to -> R2

## 6. Add group members to the group server

From your group Azure DevOps Services's homepage, click the **gear icon** next to your user name in the upper right corner, then select the **Security** tab. You can add members to your group here with various permissions.

![24](./media/group-manager-tasks/add_member_to_group.PNG)


## Next steps

Here are links to the more detailed descriptions of the roles and tasks defined by the Team Data Science Process:

- [Group Manager tasks for a data science team](group-manager-tasks.md)
- [Team Lead tasks for a data science team](team-lead-tasks.md)
- [Project Lead tasks for a data science team](project-lead-tasks.md)
- [Project Individual Contributors for a data science team](project-ic-tasks.md)
