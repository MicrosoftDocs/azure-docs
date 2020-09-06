---
title: Troubleshooting PostgreSQL Hyperscale server groups
description: Troubleshooting PostgreSQL Hyperscale server groups
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Troubleshooting PostgreSQL Hyperscale server groups

Notebooks can document procedures by including markdown content to describe what to do/how to do it. It can also provide executable code to automate a procedure.  This pattern is useful for everything from standard operating procedures to troubleshooting guides.

For example, let's troubleshoot a PostgreSQL Hyperscale server group that might have some problems using Azure Data Studio.

### Step 1: Install Azure Data Studio, kubectl and azdata
You need to have installed Azure Data Studio, kubectl and azdata **on the client machine you are using to run the notebook in Azure Data Studio**. To do this, please follow scenario [here](001-install-client-tools.md)

### Step 2: Update the PATH environment variable
Makes sure that these tools can be invoked from anywhere on this client machine. For example, on a Windows client machine, update the PATH system environment variable and add the folder in which you installed kubectl.

### Step 3: Sign in Azdata
Sign in your Arc Data Controller from this client machine and before you launch Azure Data Studio. To do this, run a command like:

    ```terminal
    azdata login --endpoint https://12.345.67.890:30080
    ```
    _Replacing the IP address with the one of your Kubernetes cluster and the port on which Kubernetes is listening. You will be prompted for user and password. You can read more details by running:_

    ```terminal
    azdata login --help
    ```

### Step 4: Log into your Kubernetes cluster with kubectl
To do this, you may want to use the example commands provided in [this](https://blog.christianposta.com/kubernetes/logging-into-a-kubernetes-cluster-with-kubectl/) blog post.
You would run commands like:

```terminal
kubectl config view
kubectl config set-credentials kubeuser/my_kubeuser --username=<your Arc Data Controller Admin user name> --password=<password>
kubectl config set-cluster my_kubeuser --server=https://12.345.67.890:30080
kubectl config set-context default/my_kubeuser/ArcDataControllerAdmin --user=ArcDataControllerAdmin/my_kubeuser --namespace=arc --cluster=my_kubeuser
kubectl config use-context default/my_kubeuser/ArcDataControllerAdmin
```

### Step 5: Launch Azure Data Studio

### Step 6: Open the troubleshooting notebook

Implement the steps described in  [033-manage-Postgres-with-AzureDataStudio.md](manage-postgres-hyperscale-server-group-with-azure-data-studio.md) to:
1. Connect to your Arc Data Controller
2. Right select your Postgres instance and choose **[Manage]**
3. Select the **[Diagnose and solve problems] dashboard**
4. Select the **[Troubleshoot] link**

:::image type="content" source="../media/data/postgres-hyperscale/ads-controller-postgres-troubleshooting-notebook.jpg" alt-text="Azure Data Studio - Postgres troubleshooting notebook":::

The **TSG100 - The Azure Arc enabled PostgreSQL Hyperscale troubleshooter notebook** opens up:
:::image type="content" source="../media/data/postgres-hyperscale/ads-controller-postgres-troubleshooting-notebook2.jpg" alt-text="Azure Data Studio - Postgres troubleshooting notebook":::


### Step 7: Run the scripts
Select the 'Run All' button at the top to execute the notebook all at once, or you can step through and execute each code cell one by one.

View the output from the execution of the code cells for any potential issues.

We'll add more details to the notebook over time about how to recognize common problems and how to solve them.

## Next step
You can create your own notebooks to meet your needs.