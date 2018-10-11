---
title: Roaming and collaboration in Azure Machine Learning Workbench | Microsoft Docs
description: Learn how to set up roaming and collaboration in Machine Learning Workbench.
services: machine-learning
author: hning86
ms.author: haining
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 11/16/2017 

ROBOTS: NOINDEX
---


# Roaming and collaboration in Azure Machine Learning Workbench

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 

This article describes how you can use Azure Machine Learning Workbench to set up projects for roaming between computers and collaborate with team members. 

When you create an Azure Machine Learning project that has a remote Git repository (repo) link, the project metadata and snapshots are stored in the cloud. You can use the cloud link to access the project from a different computer (roaming). You can also collaborate with team members by giving them access to the project. 

## Prerequisites
1. Install the Machine Learning Workbench app. Ensure that you have access to an Azure Machine Learning Experimentation account. For more information, see the [installation guide](quickstart-installation.md).

2. Access [Azure DevOps](https://www.visualstudio.com) and then create a repo to link your project to. For more information, see [Using a Git repo with a Machine Learning Workbench project](using-git-ml-project.md).

## Create a new Machine Learning project
Open Machine Learning Workbench, and then create a new project (for example, a project named iris). In the **Visualstudio.com GIT Repository URL** box, enter a valid URL for an Azure DevOps Git repo. 

> [!IMPORTANT]
> If you choose the blank project template, the Git repo you choose to use might already have a master branch. Machine Learning simply clones the master branch locally. It adds the aml_config folder and other project metadata files to the local project folder. 
>
> If you choose any other project template, your Git repo *cannot* already have a master branch. If it does, you see an error. The alternative is to use the `az ml project create` command to create the project, with a `--force` switch. This deletes the files in the original master branch and replaces them with the new files in the template that you choose.

After the project is created, submit a few runs on any scripts that are in the project. This action commits the project state to the remote Git repo's run history branch. 

> [!NOTE] 
> Only script runs trigger commits to the run history branch. Data prep execution and Notebook runs don't trigger project snapshots in the run history branch.

If you have set up Git authentication, you can also operate in the master branch. Or, you can create a new branch. 

Example: 
```
# Check current repo status.
$ git status

# Stage all changes in the current repo.
$ git add -A

# Commit changes.
$ git commit -m "my commit fixes this weird bug!"

# Push to the remote repo.
$ git push origin master
```

## Roaming
<a name="roaming"></a>

### Open Machine Learning Workbench on a second computer
After the Azure DevOps Git repo is linked with your project, you can access the iris project from any computer that has Machine Learning Workbench installed. 

To access the iris project on another computer, you must sign in to the app by using the same credentials that you used to create the project. You also need to be in the same Machine Learning Experimentation account and workspace. The iris project is alphabetically listed with other projects in the workspace. 

### Download the project on a second computer
When the workspace is open on the second computer, the icon adjacent to the iris project is different from the typical folder icon. The download icon indicates that the contents of the project are in the cloud, and that the project is ready to be downloaded to the current computer. 

![Create project](./media/roaming-and-collaboration/downloadable-project.png)

Select the iris project to begin a download. When the download is finished, the project is ready to be accessed on the second computer. 

On Windows, the project is located at C:\Users\\<username\>\Documents\AzureML.

On macOS, the project is located at /home/\<username\>/Documents/AzureML.

In a future release, we plan to enhance functionality so that you can select a destination folder. 

> [!NOTE]
> If you have a folder in the Machine Learning directory that has the exact same name as the project, the download fails. To work around this issue, temporarily rename the existing folder.


### Work on the downloaded project 
The newly downloaded project reflects the project state at the last run in the project. A snapshot of the project state is automatically committed to the run history branch in the Azure DevOps Git repo every time you submit a run. The snapshot that is associated with the latest run is used to instantiate the project on the second computer. 
 

## Collaboration
You can collaborate with team members on projects that are linked to an Azure DevOps Git repo. You can assign permissions to users for the Machine Learning Experimentation account, workspace, and project. Currently, you can perform Azure Resource Manager commands by using Azure CLI. You can also use the [Azure portal](https://portal.azure.com). For more information, see [Use the Azure portal to add users](#portal).    

### Use the command line to add users
As an example, Alice is the Owner of the iris project. Alice wants to share access to the project with Bob. 

Alice selects the **File** menu, and then selects the **Command Prompt** menu item. The Command Prompt window opens with the iris project. Alice can then decide what level of access she wants to give to Bob. She grants permissions by executing the following commands:  

```azurecli
# Find the Resource Manager ID of the Experimentation account.
az ml account experimentation show --query "id"

# Add Bob to the Experimentation account as a Contributor.
# Bob now has read/write access to all workspaces and projects under the account by inheritance.
az role assignment create --assignee bob@contoso.com --role Contributor --scope <Experimentation account Resource Manager ID>

# Find the Resource Manager ID of the workspace.
az ml workspace show --query "id"

# Add Bob to the workspace as an Owner.
# Bob now has read/write access to all projects under the workspace by inheritance. Bob can invite or remove other users.
az role assignment create --assignee bob@contoso.com --role Owner --scope <workspace Resource Manager ID>
```

After role assignment, either directly or by inheritance, Bob can see the project in the Machine Learning Workbench project list. Bob might need to restart the application to see the project. Bob can then download the project as described in [Roaming](#roaming), and begin to collaborate with Alice. 

The run history for all users that collaborate on a project is committed to the same remote Git repo. When Alice executes a run, Bob can see the run in the run history section of the project in the Machine Learning Workbench app. Bob can also restore the project to the state of any run, including runs that Alice started. 

By sharing a remote Git repo for the project, Alice and Bob can also collaborate in the master branch. If needed, they can also create personal branches and use Git pull requests and merges to collaborate. 

### Use the Azure portal to add users
<a name="portal"></a>

Machine Learning Experimentation accounts, workspaces, and projects are Azure Resource Manager resources. To assign roles, you can use the **Access Control** link in the [Azure portal](https://portal.azure.com). 

Find the resource that you want to add users to by using the **All Resources** view. Select the **Access control (IAM)** link, and then select **Add users**. 

<img src="./media/roaming-and-collaboration/iam.png" width="320px">

## Sample collaboration workflow
To illustrate the collaboration workflow, let's walk through an example. Contoso employees Alice and Bob want to collaborate on a data science project by using Machine Learning Workbench. Their identities belong to the same Contoso Azure Active Directory (Azure AD) tenant. Here are the steps Alice and Bob take:

1. Alice creates an empty Git repo in an Azure DevOps project. The Azure DevOps project should be in an Azure subscription that is created under the Contoso Azure AD tenant. 

2. Alice creates a Machine Learning Experimentation account, a workspace, and a Machine Learning Workbench project on her computer. When she creates the project, she enters the Azure DevOps Git repo URL.

3. Alice starts to work on the project. She creates some scripts and executes a few runs. For each run, a snapshot of the entire project folder is automatically pushed as a commit to a run history branch of the Azure DevOps Git repo that Machine Learning Workbench creates.

4. Alice is happy with the work in progress. She wants to commit her changes in the local master branch and then push them to Azure DevOps Git repo master branch. With the project open, in Machine Learning Workbench, she opens the Command Prompt window, and then enters these commands:
    
    ```sh
    # Verify that the Git remote is pointing to the Azure DevOps Git repo.
    $ git remote -v

    # Verify that the current branch is master.
    $ git branch

    # Stage all changes.
    $ git add -A

    # Commit changes with a comment.
    $ git commit -m "this is a good milestone"

    # Push the commit to the master branch of the remote Git repo in Azure DevOps.
    $ git push
    ```

5. Alice adds Bob to the workspace as a Contributor. She can do this in the Azure portal, or by using the `az role assignment` command, as demonstrated earlier. Alice also grants Bob read/write permissions to the Azure DevOps Git repo.

6. Bob signs in to Machine Learning Workbench on his computer. He can see the workspace that Alice shared with him. He can see the iris project listed under that workspace. 

7. Bob selects the project name. The project is downloaded to his computer.
    * The downloaded project files are a copy of the snapshot of the latest run that's recorded in the run history. They are not the last commit on the master branch.
    * The local project folder is set to the master branch, with the unstaged changes.

8. Bob can browse runs that were executed by Alice. He can restore snapshots of any earlier runs.

9. Bob wants to get the latest changes that Alice pushed, and then start working in a different branch. In Machine Learning Workbench, Bob opens a Command Prompt window and executes the following commands:

    ```sh
    # Verify that the Git remote is pointing to the Azure DevOps Git repo.
    $ git remote -v

    # Verify that the current branch is master.
    $ git branch

    # Get the latest commit in the Azure DevOps Git master branch and overwrite current files.
    $ git pull --force

    # Create a new local branch named "bob" so that Bob's work is done in the "bob" branch
    $ git checkout -b bob
    ```

10. Bob modifies the project and submits new runs. The changes are made on the bob branch. Bob's runs also become visible to Alice.

11. Bob is ready to push his changes to the remote Git repo. To avoid conflict with the master branch, where Alice is working, Bob pushes his work to a new remote branch, which is also named bob.

    ```sh
    # Verify that the current branch is "bob," and that it has unstaged changes.
    $ git status
    
    # Stage all changes.
    $ git add -A

    # Commit the changes with a comment.
    $ git commit -m "I found a cool new trick."

    # Create a new branch on the remote Azure DevOps Git repo, and then push the changes.
    $ git push origin bob
    ```

12. To tell Alice about the cool new trick in his code, Bob creates a pull request on the remote Git repo from the bob branch to the master branch. Alice can then merge the pull request into the master branch.

## Next steps
- Learn more about [using a Git repo with a Machine Learning Workbench project](using-git-ml-project.md).
