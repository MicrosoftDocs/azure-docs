---
title: Git integration
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning integrates with a local Git repository to track repository, branch, and current commit information as part of a training job.
services: machine-learning
ms.service: azure-machine-learning
ms.subservice: mlops
ms.topic: conceptual
author: Blackmist
ms.author: larryfr
ms.reviewer: osiotugo
ms.date: 06/12/2024
ms.custom: sdkv2, build-2023
---
# Git integration for Azure Machine Learning

[Git](https://git-scm.com/) is a popular version control system that allows you to share and collaborate on your projects. This article explains how Azure Machine Learning can integrate with a local Git repository to track repository, branch, and current commit information as part of a training job.

Azure Machine Learning fully supports Git repositories for tracking work. You can clone repositories directly onto your shared workspace file system, use Git on your local workstation, or use Git from a continuous integration and continuous deployment (CI/CD) pipeline.

When you submit an Azure Machine Learning training job that has source files from a local Git repository, information about the repo is tracked as part of the training job. Because the information comes from the local Git repo, it isn't tied to any specific central repository. Your repository can be cloned from any Git-compatible service, such as GitHub, GitLab, Bitbucket, or Azure DevOps.

> [!TIP]
> You can use Visual Studio Code to interact with Git through a graphical user interface. To connect to an Azure Machine Learning remote compute instance by using Visual Studio Code, see [Launch Visual Studio Code integrated with Azure Machine Learning (preview)](how-to-launch-vs-code-remote.md).
> 
> For more information on Visual Studio Code version control features, see [Use Version Control in Visual Studio Code](https://code.visualstudio.com/docs/editor/versioncontrol) and [Work with GitHub in Visual Studio Code](https://code.visualstudio.com/docs/editor/github).

<a name="#clone-git-repositories-into-your-workspace-file-system"></a>
## Git repositories in a workspace file system

Azure Machine Learning provides a shared file system for all users in a workspace. The best way to clone a Git repository into this file share is to create a compute instance and [open a terminal](./how-to-access-terminal.md). In the terminal, you have access to a full Git client and can clone and work with Git by using the Git CLI. For more information, see [Git CLI](https://git-scm.com/docs/gitcli).

You can clone any Git repository you can authenticate to, such as a GitHub, Azure Repos, or BitBucket repo. It's best to clone the repository into your user directory, so that other users don't collide directly on your working branch.

There are some differences between cloning to the local file system of the compute instance or cloning to the shared file system, mounted as the *~/cloudfiles/code/* directory. In general, cloning to the local file system provides better performance than cloning to the mounted file system. However, if you delete and recreate the compute instance, the local file system is lost, while the mounted shared file system is kept.

## Clone a Git repository with SSH

You can clone a repo by using Secure Shell (SSH) protocol. To use SSH, you need to authenticate your Git account with SSH by using an SSH key.

### Generate and save a new SSH key

To generate a new SSH key, you can go to the Azure Machine Learning studio **Notebook** page, open a terminal, and run the following command, substituting your email address.

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

The command returns the following output:

```bash
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/azureuser/.ssh/id_ed25519):
```

Make sure the location in the preceding output is `/home/azureuser/.ssh`, or change it to that location, and then press Enter.

It's best to add a passphrase to your SSH key for added security. At the following prompts, enter a secure passphrase.

```bash
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
```

When you press Enter, the `ssh-keygen` command generates a new SSH key with the provided email address as a label. The key file saves on the compute instance, and is accessible only to the compute instance owner.

### Add the public key to your Git account

You need to add your public SSH key to your Git account. To get the key, run the following command in your terminal window. If your key file has a different name, replace `id_ed25519.pub` with your public key file name.

```bash
cat ~/.ssh/id_ed25519.pub
```

The command displays the contents of your public key file. Copy the output.

> [!TIP]
> To copy and paste in the terminal window, use these keyboard shortcuts, depending on your operating system:
> 
> - Windows: Ctrl+C or Ctrl+Insert to copy, Ctrl+V or Ctrl+Shift+V to paste.
> - MacOS: Cmd+C to copy and Cmd+V to paste.
> 
> Some browsers might not support clipboard permissions properly.

Add the SSH key to your Git account by using the following instructions, depending on your Git service:

  - [GitHub](https://docs.github.com/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account#adding-a-new-ssh-key-to-your-account)
  - [GitLab](https://docs.gitlab.com/ee/user/ssh.html#add-an-ssh-key-to-your-gitlab-account)
  - [Azure DevOps](/azure/devops/repos/git/use-ssh-keys-to-authenticate#step-2-add-the-public-key-to-azure-devops)
  - [BitBucket](https://support.atlassian.com/bitbucket-cloud/docs/configure-ssh-and-two-step-verification/)

### Clone the Git repository with SSH

To clone a Git repo, copy the SSH Git clone URL from the repo. In your terminal, run `git clone` followed by the SSH Git clone URL. For example:

```bash
git clone git@example.com:GitUser/azureml-example.git
```

SSH might display the server's SSH fingerprint and ask you to verify it, as in the following example.

```bash
The authenticity of host 'github.com (000.00.000.0)' can't be established.
ECDSA key fingerprint is SHA256:0000000000000000000/00000000/00000000.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

SSH displays this fingerprint when it connects to an unknown host to protect you from [man-in-the-middle attacks](/previous-versions/windows/it-pro/windows-2000-server/cc959354(v=technet.10)#man-in-the-middle-attack). You should verify that the fingerprint matches one of the fingerprints in the SSH public keys page. Once you accept the host's fingerprint, SSH doesn't prompt you again unless the fingerprint changes.

SSH displays a response like the following example:

   ```bash
Cloning into 'azureml-example'...
Warning: Permanently added 'github.com,000.00.000.0' (ECDSA) to the list of known hosts.
Enter passphrase for key '/home/azureuser/.ssh/id_ed25519': 
   ```
After you enter your passphrase, Git clones the repo and sets up the origin remote to connect with SSH for future Git commands.

## Track code that comes from Git repositories

When you submit a training job from the Python SDK or Machine Learning CLI, the files needed to train the model are uploaded to your workspace. If the `git` command is available on your development environment, the upload process checks if the source files are stored in a Git repository.

If so, the process uploads Git repository, branch, and current commit information as part of the training job. The information is stored in the following training job properties for jobs that use an estimator, machine learning pipeline, or script run.

| Property | Git command to get the value | Description |
| ----- | ----- | ----- |
| `azureml.git.repository_uri` or `mlflow.source.git.repoURL` | `git ls-remote --get-url` | The URI that THE repository was cloned from. |
| `azureml.git.branch` or `mlflow.source.git.branch` | `git symbolic-ref --short HEAD` | The active branch when the job was submitted. |
| `azureml.git.commit` or `mlflow.source.git.commit` | `git rev-parse HEAD` | The commit hash of the code that was submitted for the job. |
| `azureml.git.dirty` | `git status --porcelain .` | `True` if the branch or commit is dirty, otherwise `false`. |

If the `git` command isn't available on your development environment, or your training files aren't located in a Git repository, no Git-related information is tracked.

> [!TIP]
> To check if the `git` command is available on your development environment, run the `git --version` command in a command line interface. If Git is installed and in your path, you receive a response similar to `git version 2.43.0`. For information on installing Git on your development environment, see the [Git website](https://git-scm.com/).

## View Git information

The Git information is stored as JSON code in the properties for a training job. The logged Git information can include the following properties:

```json
"azureml.git.repository_uri": "git@github.com:azure/<repo-name>",
"azureml.git.branch": "<branch-name>",
"azureml.git.commit": "<commit-id>",
"azureml.git.dirty": "<True/False>",
"mlflow.source.git.repoURL": "git@github.com:azure/<repo-name>",
"mlflow.source.git.branch": "<branch-name>",
"mlflow.source.git.commit": "<commit-id>",

```

You can view this information by using the Azure portal, Python SDK, or Azure CLI.

### Azure portal

In your workspace in Azure Machine Learning studio, select your job from the **Jobs** page. In the **Properties** section of the job **Overview** page, select **Raw JSON** under **See all properties**.

In the JSON, look for the Git properties, for example:

```json
    "properties": {
        "mlflow.source.git.repoURL": "git@github.com:azure/azureml-examples",
        "mlflow.source.git.branch": "main",
        "mlflow.source.git.commit": "0000000000000000000000000000000000000000",
        "azureml.git.dirty": "False",
        ...
    },
```

### Python SDK V2

After you submit a training run, a [Job](/python/api/azure-ai-ml/azure.ai.ml.entities.job) object is returned. The `properties` attribute of this object contains the logged Git information. For example, you can run the following command to retrieve the commit hash:

```python
job.properties["mlflow.source.git.commit"]
```

### Azure CLI V2

You can run the `az ml job show` command with the `--query` argument to display the Git information. For example, the following query retrieves the `mlflow.source.git.commit` property value:

```azurecli
az ml job show --name my-job-id --query "{GitCommit:properties.azureml.git.commit} --resource-group my-resource-group --workspace-name my-workspace"
```

## Related content

- [Access a compute instance terminal in your workspace](how-to-access-terminal.md)
- [Launch Visual Studio Code integrated with Azure Machine Learning (preview)](how-to-launch-vs-code-remote.md)
- [Use Version Control in Visual Studio Code](https://code.visualstudio.com/docs/editor/versioncontrol)
- [Work with GitHub in Visual Studio Code](https://code.visualstudio.com/docs/editor/github)
