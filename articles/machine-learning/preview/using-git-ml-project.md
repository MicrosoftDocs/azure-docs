---
title: Using Git Repo with an Azure Machine Learning Workbench Project | Microsoft Docs
description: This article explain how to use a Git repository in conjunction with an Azure Machine Learning Workbench Project. 
services: machine-learning
author: ahgyger
ms.author: ahgyger
manager: hning86
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 09/07/2017
---
# Using Git Repo with an Azure Machine Learning Workbench Project

## Quick Help 
Use following link if you want to associate an Azure ML Workbench project with a Visual Studio Team Service Git repo:

```
https://<vsts_acct_name>.visualstudio.com/<vsts_proj_name>/_git/<git_repo_name>
```
>Note: the Git repo must already exist, it must be empty (has no master branch), and you must have write access to it.

## Introduction
Azure Machine Learning Workbench is designed with Git integration from the ground up. When creating a new project, the project folder is automatically "Git-initialized" as a local Git repository (repo) while a second hidden local Git repo is also created with a branch named _AzureMLHistory/<project_GUID>_ to keep track of project snapshots before each execution. 

Associating the Azure ML project with an existing Git repo, hosted within a Visual Studio Team Service (VSTS) project, enables automatic version-control by the run history branch both locally and remotely. This association lets anybody with access to the remote repo to download the latest source code to another computer (roaming).  If a remote Git repo is not set for an Azure ML Project, roaming does not work.

If roaming is enabled, it is also possible to manage version control explicitly by using the _master_ branch or by creating other branches on the repo. This applies to the local Git repo, and propagates to the remote Git repo if provisioned.

This diagram depicts the relationship between a VSTS Git repo and an Azure ML project:

![Vienna Git](/media/using-git-ml-project/vienna_git.png)

To get started using a remote Git repo, follow these basic instructions.

>Note: Currently, Microsoft only supports Git repositories on VSTS Accounts. Support for General Git repos (such as GitHub and etc.) is planned in the future.

## Step 1. Create an Azure ML Experimentation Account
If not already done, create an Azure ML Experimentation Account and install the Azure ML Workbench app. See more details in the [installation guide](quickstart-installation.md).

## Step 2. Create a VSTS Project or Use an Existing VSTS Project
Navigate to [https://www.visualstudio.com](https://www.visualstudio.com), and sign in with an Azure Active Directory (AD) account used to access the Azure ML Experimentation account. Select the VSTS account you want to use. You can also create a new VSTS account.

To navigate directly to the desired VSTS account, the URL is `https://<vsts_account_name>.visualstudio.com`.

## Step 2b. Use the Default Git Repo or Create A Git Repo
If you are creating a new VSTS project, you need also create a new Version Control database. Make sure you use `Git` as the Version Control provider.

![Create a Git repo](/media/using-git-ml-project/create_git_repo.png)

The URL of the newly created VSTS Git repo can be copied and used when adding a new Azure ML project. It typically looks like this:
`http://<vsts_account_name>.visualstudio.com/_git/<project_name>`

You can also create additional Git repos under the same project.

![new non-default Git repo](/media/using-git-ml-project/new_git_repo.png)

The new non-default Git repo URL is typically: `http://<vsts_account_name>.visualstudio.com/<project_name/_git/<epo_name>`

>Note: VSTS has its own access control list that is independent of Azure ML Experimentation Service. User access may vary between a Git repo and an Azure ML Workspace or Project and may need to be managed. So if you want to share your Azure ML Project with a team member including code level access, in addition to just adding him/her to the Azure ML Experimentation Account, you need to explicitly grant him/her proper access to the VSTS Git repo. 

## Step 3. Create a new Azure ML Project with a remote Git Repo
Launch Azure ML Workbench and create a new project. Fill the Git repo text box with the VSTS Git repo URL that you coped from Step 2.

![Create Azure ML Project with Git repo](/media/using-git-ml-project/create_project_with_git_repo.png)

Now a new Azure ML project is created with remote Git repo integration enabled and ready to go. The project folder is always Git-initialized as a local Git repo. A master branch and a special Run History branch (named _AzureMLHistory/<project_GUID>_) are created in the Git repo for you. And the Git _remote_ is set to the remote VSTS Git repo so commits on both branches can be pushed into the remote Git repo.

## Step 3b. Associate an Existing Azure ML Project with a VSTS Git Repo
Optionally, you can also create a Azure ML project without a VSTS Git repo, and just rely on the local Git repo for run history snapshots. And you can associate a VSTS Git repo later with this existing Azure ML project using the following command:
```batch
REM make sure you are in the project path so CLI has context of your current project
C:\Temp\myIris> az ml project update -r https://<acct-name>.visualstudio.com/project-name/_git/<repo-name>
```
>Note you must have write access to the specified VSTS Git repo. And the Git repo must be empty (without a master branch).

## Step 4. Capture Project Snapshot in Git Repo
Now you can execute a few runs in the Workbench, make some changes in-between the runs. You can do this either from the desktop app, or from CLI using _az ml experiment submit_ command. For more details, you can follow the [Classifying Iris tutorial](Tutorial.md). For each run, if there is any change made in any files in the project folder, a snapshot of the entire project folder is committed to the run history branch and pushed into the remote Git repo. You can view the branches and commits by browsing to the VSTS Git repo URL.

![run history branch](/media/using-git-ml-project/run_history_branch.png)

## Step 5. Restore a Previous Project Snapshot 
To restore the entire project folder to the state of a previous run history project state snapshot, you can use the following command from the Azure ML Workbench CLI window.

```batch
REM discover the run I want to restore snapshot from:
C:\Temp\myIris> az ml history list -o table

REM restore the snapshot from a particular run
C:\Temp\myIris> az ml project restore --run-id <run_id>
```

By executing this command, we will overwrite the entire project folder with the snapshot taken when that particular run was kicked off. This means that you will **lose all changes** in your current project folder. So please be extra careful when you run this command.

In the run history detail page, there is a button named _Restore Project Snapshot_ which performs the same action.


## Step 6. Use the Master Branch
One way to avoid accidentally losing your current project state, is to commit the project to the master branch of the Git repo. You can directly use Git from command line (or your other favorite Git client tool of choice) to operate on the master branch. For example:

```batch
# make sure you are on the master branch
C:\Temp\myIris> git checkout master

# stage all changes
C:\Temp\myIris> git add *

# commit all changes locally on the master branch
C:\Temp\Iris> git commit -m 'this is my updates so far'

# push changes into the remote VSTS Git repo
C:\Temp\Iris> git push
```

Now you can safely restore project to an earlier snapshot following Step 5, knowing that you can always come back to the commit you just made on the master branch.

## Authentication
If you just rely the run history functions in Azure ML for taking project snapshots and restoring them, you don't need to worry about Git repo authentication. It is taken care by the Experimentation Service layer.

However, if you use your own Git tools to manage version control, you will need to properly handle authentication against the remote Git repo on VSTS. That is, you will need to set up authentication with the Git repo on the local computer before you can issue Git commands against that remote Git repo. 

The easiest way to do this, is to create an SSH key pair and upload the public key portion to the Git repo security settings.
### Generate SSH Key 
First let's generate a pair of SSH keys on your computer.

#### On Windows:
Launch Git GUI desktop app on Windows, and under _Help_ menu, click on _Show SSH Key_.
![SSH Key](/media/using-git-ml-project/git_gui.png)

Copy SSH into clipboard.

#### On macOS:
Quick steps from command shell:
```bash
# generate the SSH key
$ ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# start the SSH agent in the background
$ eval "$(ssh-agent -s)"

# add newly generated SSH key to the SSH agent
$ ssh-add -K ~/.ssh/id_rsa

# display the public key so you can copy it.
$ more ~/.ssh/id_rsa.pub
```
More details steps can be found on [this GitHub article](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/).

### Upload Public Key to Git repo
Go to your Visual Studio account homepage: https://<vsts_account_name>.visualstudio.com and log in, then click on Security under the avatar.

![vsts security](/media/using-git-ml-project/vsts_security.png)

Then add a SSH public key,  paste the SSH public key you get from the previous step, and give it a name. You can add multiple keys here.

![ssh key](/media/using-git-ml-project/add_ssh.png)

That's it, you are good to go.

### Read More
Please follow these two articles (either approach can work) for more details on how to enable local authentication to the remote Git repo in VSTS.
- [Use SSH Key Authentication](https://www.visualstudio.com/en-us/docs/git/use-ssh-keys-to-authenticate)
- [Use Git Credential Managers](https://www.visualstudio.com/en-us/docs/git/set-up-credential-managers)


## Next steps
For information about machine learning, see [Another article](doc-template-concepts.md)
