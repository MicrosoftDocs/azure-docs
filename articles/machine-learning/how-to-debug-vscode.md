---
title: Interactive debugging in Visual Studio Code
titleSuffix: Azure Machine Learning
description: Interactively debug Azure Machine Learning code, pipelines and deployments using Visual Studio Code
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: troubleshooting
author: luisquintanilla
ms.author: luquinta
ms.date: 06/11/2020
---

# Interactive Debugging with Visual Studio Code

[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

Learn how to interactively debug Azure Machine Learning code, pipelines and deployments using Visual Studio Code

## Connect to remote compute instance

### Get IP and SSH port

1. Go to the Azure Machine Learning studio at https://ml.azure.com/.
1. Select your [workspace](concept-workspace.md).
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

### Add instance as a host

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

### Connect VS Code to the instance

1. [Install Visual Studio Code](https://code.visualstudio.com/).

1. [Install the Remote SSH Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh). 

1. Click the Remote-SSH icon on the left to show your SSH configurations.

1. Right-click the SSH host configuration you just created.

1. Select **Connect to Host in Current Window**. 

From here on, you are entirely working on the compute instance and you can now edit, debug, use git, use extensions, etc. -- just like you can with your local Visual Studio Code. 


## Debug pipelines

## Debug deployments

## Next Steps

Now that you've set up Visual Studio Code Remote, you can use a compute instance as remote compute from Visual Studio Code to interactively debug your code. 

[Tutorial: Train your first ML model](tutorial-1st-experiment-sdk-train.md) shows how to use a compute instance with an integrated notebook.

