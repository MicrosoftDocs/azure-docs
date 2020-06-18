---
title: 'Interactive debug: VS Code & ML compute instances'
titleSuffix: Azure Machine Learning
description: Set up VS Code Remote to interactively debug your code with Azure Machine Learning. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.author: jmartens
author: j-martens
ms.date: 12/09/2019
# As a data scientist, I want to how to use SSH to set up a VS COde remote to use with an Azure ML compute instance. 
---

# Debug interactively on an Azure Machine Learning Compute Instance with VS Code Remote

In this article, you'll learn how to set up Visual Studio Code Remote on an Azure Machine Learning Compute Instance so you can **interactively debug your code** from VS Code. 

+ An [Azure Machine Learning Compute Instance](concept-compute-instance.md) is a fully managed cloud-based workstation for data scientists and provides management and enterprise readiness capabilities for IT administrators. 


+ [Visual Studio Code Remote](https://code.visualstudio.com/docs/remote/remote-overview) Development allows you to use a container, remote machine, or the Windows Subsystem for Linux (WSL) as a full-featured development environment. 

## Prerequisite  

On Windows platforms, you must [install an OpenSSH compatible SSH client](https://code.visualstudio.com/docs/remote/troubleshooting#_installing-a-supported-ssh-client) if one is not already present. 

> [!Note]
> PuTTY is not supported on Windows since the ssh command must be in the path. 

## Get IP and SSH port 

1. Go to the Azure Machine Learning studio at https://ml.azure.com/.

2. Select your [workspace](concept-workspace.md).
1. Click the **Compute Instances** tab.
1. In the **Application URI** column, click the **SSH** link of the compute instance you want to use as a remote compute. 
1. In the dialog, take note of the IP Address and SSH port. 
1. Save your private key to the ~/.ssh/ directory on your local computer; for instance, open an editor for a new file and paste the key in: 

   **Linux**: 
   ```sh
   vi ~/.ssh/id_azmlcitest_rsa  
   ```

   **Windows**: 
   ```
   notepad C:\Users\<username>\.ssh\id_azmlcitest_rsa 
   ```

   The private key will look somewhat like this:
   ```
   -----BEGIN RSA PRIVATE KEY----- 

   MIIEpAIBAAKCAQEAr99EPm0P4CaTPT2KtBt+kpN3rmsNNE5dS0vmGWxIXq4vAWXD 
   ..... 
   ewMtLnDgXWYJo0IyQ91ynOdxbFoVOuuGNdDoBykUZPQfeHDONy2Raw== 

   -----END RSA PRIVATE KEY----- 
   ```

1. Change permissions on file to make sure only you can read the file.  
   ```sh
   chmod 600 ~/.ssh/id_azmlcitest_rsa   
   ```

## Add instance as a host 

Open the file `~/.ssh/config` (Linux) or `C:\Users<username>.ssh\config` (Windows) in an editor and add a new entry similar to this:

```
Host azmlci1 

    HostName 13.69.56.51 

    Port 50000 

    User azureuser 

    IdentityFile ~/.ssh/id_azmlcitest_rsa   
```

Here some details on the fields: 

|Field|Description|
|----|---------|
|Host|Use whatever shorthand you like for the compute instance |
|HostName|This is the IP address of the compute instance |
|Port|This is the port shown on the SSH dialog above |
|User|This needs to be `azureuser` |
|IdentityFile|Should point to the file where you saved the private key |

Now, you should be able to ssh to your compute instance using the shorthand you used above, `ssh azmlci1`. 

## Connect VS Code to the instance 

1. [Install Visual Studio Code](https://code.visualstudio.com/).

1. [Install the Remote SSH Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh). 

1. Click the Remote-SSH icon on the left to show your SSH configurations.

1. Right-click the SSH host configuration you just created.

1. Select **Connect to Host in Current Window**. 

From here on, you are entirely working on the compute instance and you can now edit, debug, use git, use extensions, etc. -- just like you can with your local Visual Studio Code. 

## Next steps

Now that you've set up Visual Studio Code Remote, you can use a compute instance as remote compute from Visual Studio Code to interactively debug your code. 

[Tutorial: Train your first ML model](tutorial-1st-experiment-sdk-train.md) shows how to use a compute instance with an integrated notebook.