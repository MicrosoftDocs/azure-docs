---
title: Git integration for Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning integrates with a local Git repository to track repository, branch, and current commit information as part of a training job.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: conceptual
author: ositanachi  
ms.author: osiotugo
ms.reviewer: larryfr
ms.date: 06/02/2023
ms.custom: sdkv2, event-tier1-build-2022, build-2023
---
# Git integration for Azure Machine Learning

[Git](https://git-scm.com/) is a popular version control system that allows you to share and collaborate on your projects. 

Azure Machine Learning fully supports Git repositories for tracking work - you can clone repositories directly onto your shared workspace file system, use Git on your local workstation, or use Git from a CI/CD pipeline.

When submitting a job to Azure Machine Learning, if source files are stored in a local git repository then information about the repo is tracked as part of the training process.

Since Azure Machine Learning tracks information from a local git repo, it isn't tied to any specific central repository. Your repository can be cloned from GitHub, GitLab, Bitbucket, Azure DevOps, or any other git-compatible service.

> [!TIP]
> Use Visual Studio Code to interact with Git through a graphical user interface. To connect to an Azure Machine Learning remote compute instance using Visual Studio Code, see [Launch Visual Studio Code integrated with Azure Machine Learning (preview)](how-to-launch-vs-code-remote.md)
>
> For more information on Visual Studio Code version control features, see [Using Version Control in VS Code](https://code.visualstudio.com/docs/editor/versioncontrol) and [Working with GitHub in VS Code](https://code.visualstudio.com/docs/editor/github).

## Clone Git repositories into your workspace file system
Azure Machine Learning provides a shared file system for all users in the workspace.
To clone a Git repository into this file share, we recommend that you create a compute instance & [open a terminal](how-to-access-terminal.md).
Once the terminal is opened, you have access to a full Git client and can clone and work with Git via the Git CLI experience.

We recommend that you clone the repository into your user directory so that others will not make collisions directly on your working branch.

> [!TIP]
> There is a performance difference between cloning to the local file system of the compute instance or cloning to the mounted filesystem (mounted as  the `~/cloudfiles/code` directory). In general, cloning to the local filesystem will have better performance than to the mounted filesystem. However, the local filesystem is lost if you delete and recreate the compute instance. The mounted filesystem is kept if you delete and recreate the compute instance.

You can clone any Git repository you can authenticate to (GitHub, Azure Repos, BitBucket, etc.)

For more information about cloning, see the guide on [how to use Git CLI](https://guides.github.com/introduction/git-handbook/).

## Authenticate your Git Account with SSH
### Generate a new SSH key
1) [Open the terminal window](./how-to-access-terminal.md) in the Azure Machine Learning Notebook Tab.

2) Paste the text below, substituting in your email address.

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

This creates a new ssh key, using the provided email as a label.

```
> Generating public/private rsa key pair.
```

3) When you're prompted to "Enter a file in which to save the key" press Enter. This accepts the default file location.

4) Verify that the default location is '/home/azureuser/.ssh' and press enter. Otherwise specify the location '/home/azureuser/.ssh'.

> [!TIP]
> Make sure the SSH key is saved in '/home/azureuser/.ssh'. This file is saved on the compute instance is only accessible by the owner of the Compute Instance

```
> Enter a file in which to save the key (/home/azureuser/.ssh/id_rsa): [Press enter]
```

5) At the prompt, type a secure passphrase. We recommend you add a passphrase to your SSH key for added security

```
> Enter passphrase (empty for no passphrase): [Type a passphrase]
> Enter same passphrase again: [Type passphrase again]
```

### Add the public key to Git Account
1) In your terminal window, copy the contents of your public key file. If you renamed the key, replace id_rsa.pub with the public key file name.

```bash
cat ~/.ssh/id_rsa.pub
```
> [!TIP]
> **Copy and Paste in Terminal**
> * Windows: `Ctrl-Insert` to copy and use `Ctrl-Shift-v` or `Shift-Insert` to paste.
> * Mac OS: `Cmd-c` to copy and `Cmd-v` to paste.
> * FireFox/IE may not support clipboard permissions properly.

2) Select and copy the SSH key output to your clipboard.
3) Next, follow the steps to add the SSH key to your preferred account type:

+ [GitHub](https://docs.github.com/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account)

+ [GitLab](https://docs.gitlab.com/ee/user/ssh.html#add-an-ssh-key-to-your-gitlab-account)

+ [Azure DevOps](/azure/devops/repos/git/use-ssh-keys-to-authenticate#step-2--add-the-public-key-to-azure-devops-servicestfs)  Start at **Step 2**.

+ [BitBucket](https://support.atlassian.com/bitbucket-cloud/docs/set-up-an-ssh-key/#SetupanSSHkey-ssh2). Follow **Step 4**.

### Clone the Git repository with SSH

1) Copy the SSH Git clone URL from the Git repo.

2) Paste the url into the `git clone` command below, to use your SSH Git repo URL. This will look something like:

```bash
git clone git@example.com:GitUser/azureml-example.git
Cloning into 'azureml-example'...
```

You will see a response like:

```bash
The authenticity of host 'example.com (192.30.255.112)' can't be established.
RSA key fingerprint is SHA256:nThbg6kXUpJWGl7E1IGOCspRomTxdCARLviKw6E5SY8.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'github.com,192.30.255.112' (RSA) to the list of known hosts.
```

SSH may display the server's SSH fingerprint and ask you to verify it. You should verify that the displayed fingerprint matches one of the fingerprints in the SSH public keys page.

SSH displays this fingerprint when it connects to an unknown host to protect you from [man-in-the-middle attacks](/previous-versions/windows/it-pro/windows-2000-server/cc959354(v=technet.10)). Once you accept the host's fingerprint, SSH will not prompt you again unless the fingerprint changes.

3) When you are asked if you want to continue connecting, type `yes`. Git will clone the repo and set up the origin remote to connect with SSH for future Git commands.

## Track code that comes from Git repositories

When you submit a training job from the Python SDK or Machine Learning CLI, the files needed to train the model are uploaded to your workspace. If the `git` command is available on your development environment, the upload process uses it to check if the files are stored in a git repository. If so, then information from your git repository is also uploaded as part of the training job. This information is stored in the following properties for the training job:

| Property | Git command used to get the value | Description |
| ----- | ----- | ----- |
| `azureml.git.repository_uri` | `git ls-remote --get-url` | The URI that your repository was cloned from. |
| `mlflow.source.git.repoURL` | `git ls-remote --get-url` | The URI that your repository was cloned from. |
| `azureml.git.branch` | `git symbolic-ref --short HEAD` | The active branch when the job was submitted. |
| `mlflow.source.git.branch` | `git symbolic-ref --short HEAD` | The active branch when the job was submitted. |
| `azureml.git.commit` | `git rev-parse HEAD` | The commit hash of the code that was submitted for the job. |
| `mlflow.source.git.commit` | `git rev-parse HEAD` | The commit hash of the code that was submitted for the job. |
| `azureml.git.dirty` | `git status --porcelain .` | `True`, if the branch/commit is dirty; otherwise, `false`. |

This information is sent for jobs that use an estimator, machine learning pipeline, or script run.

If your training files are not located in a git repository on your development environment, or the `git` command is not available, then no git-related information is tracked.

> [!TIP]
> To check if the git command is available on your development environment, open a shell session, command prompt, PowerShell or other command line interface and type the following command:
>
> ```
> git --version
> ```
>
> If installed, and in the path, you receive a response similar to `git version 2.4.1`. For more information on installing git on your development environment, see the [Git website](https://git-scm.com/).

## View the logged information

The git information is stored in the properties for a training job. You can view this information using the Azure portal or Python SDK.

### Azure portal

1. From the [studio portal](https://ml.azure.com), select your workspace.
1. Select __Jobs__, and then select one of your experiments.
1. Select one of the jobs from the __Display name__ column.
1. Select __Outputs + logs__, and then expand the __logs__ and __azureml__ entries. Select the link that begins with __###\_azure__.

The logged information contains text similar to the following JSON:

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

### View properties

After submitting a training run, a [Job](/python/api/azure-ai-ml/azure.ai.ml.entities.job) object is returned. The `properties` attribute of this object contains the logged git information. For example, the following code retrieves the commit hash:

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
job.properties["azureml.git.commit"]
```

# [Azure CLI](#tab/cli)
[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

```azurecli
az ml job show --name my_job_id --query "{GitCommit:properties."""azureml.git.commit"""}"
```

---

## Next steps

* [Access a compute instance terminal in your workspace](how-to-access-terminal.md)
