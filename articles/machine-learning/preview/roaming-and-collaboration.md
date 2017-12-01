---
title: Roaming and Collaboration in Azure Machine Learning Workbench  | Microsoft Docs
description: List of known issues and a guide to help troubleshoot 
services: machine-learning
author: hning86
ms.author: haining
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 11/16/2017 
---

# Roaming and collaboration in Azure Machine Learning Workbench
This document walks you through how Azure Machine Learning Workbench can help roam your projects across machines as well as enable collaboration with your teammates. 

When you create an Azure Machine Learning project with a remote Git Repository (repo) link, the project metadata and snapshots are stored in the cloud. The cloud link enables you to access the project from a different computer (Roaming). You can also give access to your co-workers, thus enabling collaboration. 

## Prerequisites
First, install the Azure Machine Learning Workbench with access to an Experimentation Account. Follow the [installation guide](quickstart-installation.md) for more details.

Second, access [Visual Studio Team System](https://www.visualstudio.com) and create a repo to link your project to. For detailed information about Git, reference the [Using Git Repo with an Azure Machine Learning Workbench Project](using-git-ml-project.md) article.

## Create a new Azure Machine Learning project
Launch Azure Machine Learning Workbench, and create a new project (for example, _iris_). Fill the **Visualstudio.com GIT Repository URL** textbox with a valid VSTS Git repo URL. 

> [!IMPORTANT]
> If you choose the blank project template, it is OK if the Git repo you choose already has a _master_ branch. Azure ML simply clones the _master_ branch locally, and add the `aml_config` folder and other project metadata files to the local project folder. But if you choose any other project template, your Git repo must not already have a _master_ branch, or you will see an error. The alternative is to use `az ml project create` command line tool to create the project and supply a `--force` switch. This deletes the files on the original master branch and replace them with the new files in the template you choose.

Once the project is created, submit a few runs on any scripts within the project. This action commits project state into the remote Git repo's run history branch. 

> [!NOTE] 
> Only script runs trigger commits to the run history branch. Data prep execution or Notebook runs don't trigger project snapshots on the run history branch.

If you have setup Git authentication, you can also explicitly operate in the master branch, or create a new branch. 

As an example: 
```
# check current repo status
$ git status

# stage all changes in the current repo
$ git add -A

# commit changes
$ git commit -m "my commit fixes this weird bug!"

# push to remote repo.
$ git push origin master
```

## Roaming
<a name="roaming"></a>

### Open Azure Machine Learning Workbench on second machine
Once the VSTS Git repository is linked with your project, you can access the _iris_ project from any computer where you have installed Azure Machine Learning Workbench. 

To access the iris project on another computer, you need to login to the app with the same credentials used while creating the project. Additionally, you need to navigate to the same Experimentation Account and Workspace. The _iris_ project is alphabetically listed with other projects within the workspace. 

### Download project on second machine
When the workspace is opened on the second machine, the icon adjacent to the _iris_ project is different from the typical folder icon. The download icon indicates that the content of the project is in the cloud and needs to be downloaded to the current machine. 

![create project](./media/roaming-and-collaboration/downloadable-project.png)

Clicking on the _iris_ project starts a download action. After a short while, when the download completes, the project is ready to be accessed on the second computer. 

On Windows, it is `C:\Users\<username>\Documents\AzureML`

On macOS, it is here: `/home/<username>/Documents/AzureML`

In a future release, we plan to enhance the functionality to allow you to select a destination folder. 

> [!NOTE]
> If you happen to have a folder in the Azure ML directory that has the exact same name as the project, the download fails. For the time being, you need to rename the existing folder in order to work around this issue.


### Work on the downloaded project 
The newly downloaded project reflects the project state as of the last run in the project. A snapshot of the project state is automatically committed to the run history branch in the VSTS Git repo every time you submit a run. We use the snapshot associated with the latest run when instantiating the project on the second computer. 
 

## Collaboration
You can collaborate with your teammates on projects linked to a VSTS Git repo. You can assign permissions to users on the Experimentation Account, Workspace, and Project. At this time, you can perform the Azure Resource Manager commands using the Azure CLI. You can also use [Azure portal](https://portal.azure.com). See [following section](#portal).    

### Using command line to add Users
Lets use an example. Say, Alice is the Owner of th e_Iris_ project and she wants to share access with Bob. 

Alice clicks on the **File** menu, and selects the **Command Prompt** menu item to launch the command-prompt configured to the _iris_ project. Alice is then able to decide what level fo access she wants to grant to Bob by executing the following commands.  

```azurecli
# Find ARM ID of the experimnetation account
az ml account experimentation show --query "id"

# Add Bob to the Experimentation Account as a Contributor.
# Bob now has read/write access to all workspaces and projects under the Account by inheritance.
az role assignment create --assignee bob@contoso.com --role Contributor --scope <experimentation account ARM ID>

# Find ARM ID of the workspace
az ml workspace show --query "id"

# Add Bob to the workspace as an Owner.
# Bob now has read/write access to all projects under the Workspace by inheritance. And he can invite or remove others.
az role assignment create --assignee bob@contoso.com --role Owner --scope <workspace ARM ID>
```

After the role assignment, directly or by inheritance, Bob can see the project in the Workbench project list. The application might need a restart in order to see the project. Bob can then download the project as described in the [Roaming section](#roaming) and collaborate with Alice. 

The run history for all users collaborating on a project is committed to the same remote Git repo. So when Alice executes a run, Bob can see the run in the run history section of the project in the Workbench app. Bob can also restore the project to the state of any run including runs started by Alice. 

Sharing a remote Git repo for the project enables Alice and Bob to also collaborate on the master branch. If needed, they can also create personal branches and use Git pull-requests and merges to collaborate. 

### Using Azure portal to add users
<a name="portal"></a>

Azure Machine Learning Experimentation Accounts, Workspaces, and Projects are Azure Resource Manager resources. You can use the Access Control link in the [Azure portal](https://portal.azure.com) to assign roles. 

Find the resource you are looking to add users to from the All Resources view. Click on the Access control (IAM) link within page. Add users 

<img src="./media/roaming-and-collaboration/iam.png" width="320px">

## Sample collaboration workflow
To illustrate the collaboration flow, let's walk through an example. Contoso employees Alice and Bob want to collaborate on a data science project using Azure ML Workbench. Their identity belong to the same Contoso Azure AD tenant.

1. Alice first creates an empty Git repo in a VSTS project. This VSTS project should live in an Azure subscription created under the Contoso AAD tenant. 

2. Alice then creates an Azure ML experimentation account, a Workspace, and an Azure ML Workbench project on her computer. She supplies the Git repo URL when creating the project.

3. Alice starts to work on the project. She creates some scripts and executes a few runs. For each run, a snapshot of the entire project folder is automatically pushed into a run history branch of the VSTS Git repo created by Workbench as a commit.

4. Alice is now happy with the work in progress. She wants to commit her change in the local _master_ branch and pushes it into the VSTS Git repo _master_ branch. To do so, with the project open, she launches the command prompt window from Azure ML Workbench, and issues the following commands:
    
    ```sh
    # verify the Git remote is pointing to the VSTS Git repo
    $ git remote -v

    # verify that the current branch is master
    $ git branch

    # stage all changes
    $ git add -A

    # commit changes with a comment
    $ git commit -m "this is a good milestone"

    # push the commit to the master branch of the remote Git repo in VSTS
    $ git push
    ```

5. Alice then adds Bob to the Workspace as a Contributor. She can do this from Azure portal, or using the `az role assignment` command illustrate above. She also grants Bob read/write access to the VSTS Git repo.

6. Bob now logs in the Azure ML Workbench on his computer. He can see the Workspace Alice shared with him, and the project listed under that Workspace. 

7. Bob clicks on the project name, and the project is downloaded to his computer.
    
    a. The downloaded project files are clones of the snapshot of the latest run recorded in the run history. They are not the last commit on the master branch.
    
    b. The local project folder is set on _master_ branch with unstaged changes.

8. Bob can now browse runs executed by Alice, and restore snapshot of any previous runs.

9. Bob wants to get the latest changes pushed by Alice and start to work on a different branch. So he opens command prompt window from Azure ML Workbench and executes the following commands:

    ```sh
    # verify the Git remote is pointing to the VSTS Git repo
    $ git remote -v

    # verify that the current branch is master
    $ git branch

    # get the latest commit in VSTS Git master branch and overwrite current files
    $ git pull --force

    # create a new local branch named "bob" so Bob's work is done on the "bob" branch
    $ git checkout -b bob
    ```

10. Bob now modifies the project and submit new runs. The changes are done on the _bob_ branch. And Bob's runs become visible to Alice as well.

11. Bob is now ready to push his changes into the remote Git repo. In order to avoid conflict with _master_ branch where Alice is working on, he decides to push his work into a new remote branch also named _bob_.

    ```sh
    # verify that the current branch is "bob" and it has unstaged changes
    $ git status
    
    # stage all changes
    $ git add -A

    # commit them with a comment
    $ git commit -m "I found a cool new trick."

    # create a new branch on the remote VSTS Git repo, and push changes
    $ git push origin bob
    ```

12. Bob can then tell Alice about the new cool trick in his code, and creates a pull request on the remote Git repo from the _bob_ branch to the _master_ branch. And Alice can then merge the pull request into _master_ branch.

## Next steps
Learn more about using Git with Azure ML Workbench: [Using Git repository with an Azure Machine Learning Workbench project](using-git-ml-project.md)