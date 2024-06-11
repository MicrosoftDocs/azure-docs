---
title: Git integration
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning integrates with a local Git repository to track repository, branch, and current commit information as part of a training job.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: conceptual
author: ositanachi
ms.author: osiotugo
ms.reviewer: larryfr
ms.date: 06/11/2024
ms.custom: sdkv2, build-2023
---
# Git integration for Azure Machine Learning

[Git](https://git-scm.com/) is a popular version control system that allows you to share and collaborate on your projects. This article explains how Azure Machine Learning can integrate with a local Git repository to track repository, branch, and current commit information as part of a training job.

Azure Machine Learning fully supports Git repositories for tracking work. You can clone repositories directly onto your shared workspace file system, use Git on your local workstation, or use Git from a continuous integration and continuous deployment (CI/CD) pipeline.

When you submit an Azure Machine Learning training job that has source files from a local Git repository, information about the repo is tracked as part of the training job. Because it's tracked from the local Git repo, the Git information isn't tied to any specific central repository. Your repository can be cloned from any Git-compatible service, such as GitHub, GitLab, Bitbucket, or Azure DevOps.

> [!TIP]
> You can use Visual Studio Code to interact with Git through a graphical user interface. To connect to an Azure Machine Learning remote compute instance by using Visual Studio Code, see [Launch Visual Studio Code integrated with Azure Machine Learning (preview)](how-to-launch-vs-code-remote.md).
> 
> For more information on Visual Studio Code version control features, see [Use Version Control in Visual Studio Code](https://code.visualstudio.com/docs/editor/versioncontrol) and [Work with GitHub in Visual Studio Code](https://code.visualstudio.com/docs/editor/github).

## Git repositories in a workspace file system

Azure Machine Learning provides a shared file system for all users in a workspace. The best way to clone a Git repository into this file share is to create a compute instance and [open a terminal](./how-to-access-terminal.md). In the terminal, you have access to a full Git client and can clone and work with Git by using the Git CLI. For more information about the Git CLI, see [Git CLI](https://git-scm.com/docs/gitcli).

You can clone any Git repository you can authenticate to, such as GitHub, Azure Repos, or BitBucket repos. It's best to clone the repository into your user directory, so that other users don't collide directly on your working branch.

There are some differences between cloning to the local file system of the compute instance or cloning to the shared file system, mounted as the *~/cloudfiles/code/* directory. In general, cloning to the local file system provides better performance than cloning to the mounted file system. However, if you delete and recreate the compute instance, the local file system is lost, while the mounted shared file system remains.

## Clone Git repositories with SSH

You can clone a repo by using Secure Shell Protocol (SSH). The following sections describe how to clone a repo by using SSH. To use SSH, you need to authenticate your Git account with SSH by using an SSH key.

### Generate and save a new SSH key

To generate a new SSH key:

1. In the Azure Machine Learning studio **Notebook** page, open a terminal window and run the following command, substituting your email address.

   ```bash
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```

   The command returns the output `Generating public/private rsa key pair.` and generates a new SSH key with the provided email as a label.

1. At the following prompt, make sure the location is `/home/azureuser/.ssh`, or specify that location, and then press Enter.

   ```bash
    Enter a file in which to save the key (/home/azureuser/.ssh/id_rsa): [Press enter]
   ```

   The key file saves on the compute instance, and is accessible only to the compute instance owner.

1. It's best to add a passphrase to your SSH key for added security. At the following prompt, enter a secure passphrase.

   ```bash
   > Enter passphrase (empty for no passphrase): [Type a passphrase]
   > Enter same passphrase again: [Type passphrase again]
   ```

### Add the public key to your Git account

1. In your terminal window, run the following command to copy the contents of your public key file. If you renamed the key, replace `id_rsa.pub` with the public key file name.

   ```bash
   cat ~/.ssh/id_rsa.pub
   ```

1. To add the SSH key to your Git account, refer to the following instructions depending on your Git service:

  - [GitHub](https://docs.github.com/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account#adding-a-new-ssh-key-to-your-account)
  - [GitLab](https://docs.gitlab.com/ee/user/ssh.html#add-an-ssh-key-to-your-gitlab-account)
  - [Azure DevOps](/azure/devops/repos/git/use-ssh-keys-to-authenticate#step-2-add-the-public-key-to-azure-devops)
  - [BitBucket](https://support.atlassian.com/bitbucket-cloud/docs/configure-ssh-and-two-step-verification/)

> [!TIP]
> To copy and paste in the terminal window, use these keyboard shortcuts depending on your operating system:
> 
> - Windows: Ctrl+Insert to copy, Ctrl+Shift+V or Ctrl+Shift+Insert to paste.
> - MacOS: Cmd+C to copy and Cmd+V to paste.
> 
> Some browsers might not support clipboard permissions properly.

### Clone the Git repository with SSH

1. Copy the SSH Git clone URL from the Git repo.

1. Run the following `git clone` command, using your SSH Git repo URL. For example:

   ```bash
   git clone git@example.com:GitUser/azureml-example.git
   ```

Git clones the repo and sets up the origin remote to connect with SSH for future Git commands.

#### Verify fingerprint

SSH might display the server's SSH fingerprint and ask you to verify it, as in the following example.

```bash
The authenticity of host 'example.com (000.00.255.112)' can't be established.
RSA key fingerprint is SHA256:000000000000000000000000000000000.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'github.com,000.00.255.112' (RSA) to the list of known hosts.
```

SSH displays this fingerprint when it connects to an unknown host to protect you from [man-in-the-middle attacks](/previous-versions/windows/it-pro/windows-2000-server/cc959354(v=technet.10)#man-in-the-middle-attack). You should verify that the displayed fingerprint matches one of the fingerprints in the SSH public keys page.

When you're asked if you want to continue connecting, enter *yes*. Once you accept the host's fingerprint, SSH doesn't prompt you again unless the fingerprint changes.

## Track code that comes from Git repositories

When you submit a training job from the Python SDK or Machine Learning CLI, the files needed to train the model are uploaded to your workspace. If the `git` command is available on your development environment, the upload process checks if the files are stored in a Git repository, and uploads any Git repository information as part of the training job.

The following information is sent for jobs that use an estimator, machine learning pipeline, or script run. The information is stored in the following training job properties:

| Property | Git command used to get the value | Description |
| ----- | ----- | ----- |
| `azureml.git.repository_uri` or `mlflow.source.git.repoURL` | `git ls-remote --get-url` | The URI that your repository was cloned from. |
| `azureml.git.branch` or `mlflow.source.git.branch` | `git symbolic-ref --short HEAD` | The active branch when the job was submitted. |
| `azureml.git.commit` or `mlflow.source.git.commit` | `git rev-parse HEAD` | The commit hash of the code that was submitted for the job. |
| `azureml.git.dirty` | `git status --porcelain .` | `True` if the branch or commit is dirty, otherwise `false`. |

If the `git` command isn't available on your development environment, or your training files aren't located in a Git repository, no Git-related information is tracked.

> [!TIP]
> To check if the `git` command is available on your development environment, run the `git --version` command in a command line interface. If Git is installed and in your path, you receive a response similar to `git version 2.4.1`. For information on installing Git on your development environment, see the [Git website](https://git-scm.com/).

## View Git information

The Git information is stored in the properties for a training job. You can view this information by using the Azure portal, Python SDK, or Azure CLI.

### Azure portal

In your Azure Machine Learning workspace in Azure Machine Learning studio:

1. Select the **Jobs** page.
1. Select an experiment.
1. Select a job from the **Display name** column.
1. Select **Outputs + logs** from the top menu.
1. Expand **logs** > **azureml**.
1. Select the link that begins with **###_azure**.

The logged information contains text similar to the following JSON code:

```json
"properties": {
    "_azureml.ComputeTargetType": "batchai",
    "ContentSnapshotId": "5ca66406-cbac-4d7d-bc95-f5a51dd3e57e",
    "azureml.git.repository_uri": "git@github.com:azure/machinelearningnotebooks",
    "mlflow.source.git.repoURL": "git@github.com:azure/machinelearningnotebooks",
    "azureml.git.branch": "master",
    "mlflow.source.git.branch": "master",
    "azureml.git.commit": "4d2b93784676893f8e346d5f0b9fb894a9cf0742",
    "mlflow.source.git.commit": "4d2b93784676893f8e346d5f0b9fb894a9cf0742",
    "azureml.git.dirty": "True",
    "AzureML.DerivedImageName": "azureml/azureml_9d3568242c6bfef9631879915768deaf",
    "ProcessInfoFile": "azureml-logs/process_info.json",
    "ProcessStatusFile": "azureml-logs/process_status.json"
}
```

### Python SDK V2

After you submit a training run, a [Job](/python/api/azure-ai-ml/azure.ai.ml.entities.job) object is returned. The `properties` attribute of this object contains the logged Git information. For example, the following code retrieves the commit hash:

```python
job.properties["azureml.git.commit"]
```

### Azure CLI V2

Run the `az ml job show` command to display the `GitCommit` property. For example:

```azurecli
az ml job show --name my_job_id --query "{GitCommit:properties.azureml.git.commit}"
```

## Related content

- [Access a compute instance terminal in your workspace](how-to-access-terminal.md)
- [Launch Visual Studio Code integrated with Azure Machine Learning (preview)](how-to-launch-vs-code-remote.md)
- [Use Version Control in VS Code](https://code.visualstudio.com/docs/editor/versioncontrol)
- [Work with GitHub in VS Code](https://code.visualstudio.com/docs/editor/github)
