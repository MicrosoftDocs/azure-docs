---
title: Troubleshooting PostgreSQL Hyperscale server groups
description: Troubleshooting PostgreSQL Hyperscale server groups
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Scenario: Troubleshooting PostgreSQL Hyperscale server groups

Notebooks provide a great way to document procedures because they can include markdown content to describe what to do/how to do it and can also provide executable code to automate the process of performing the procedure.  This pattern is useful for everything from standard operating procedures to troubleshooting guides.

In this scenario, we'll look at how to use the built-in troubleshooting notebook in Azure Data Studio for troubleshooting a PostgreSQL Hyperscale server group that might be having some problems.

## Install Azure Data Studio, kubectl and azdata
You need to have installed Azure Data Studio, kubectl and azdata **on the client machine you are using to run the notebook in Azure Data Studio**. To do this, please follow scenario [install-client-tools.md](https://github.com/microsoft/Azure-data-services-on-Azure-Arc/blob/jul-2020/scenarios/install-client-tools.md)

## Update the PATH environment variable
Makes sure that these tools can be invoked from anywhere on this client machine. For example, on a Windows client machine, update the PATH system environment variable and add the folder in which you installed kubectl.

## Log in with Azdata
Log in to your Arc Data Controller from this client machine and before you launch Azure Data Studio. To do this, run a command like:

```console
azdata login --endpoint https://12.345.67.890:30080
```
Replace the IP address and port with the values of your Kubernetes cluster. You will be prompted for user and password. For more details, run:

```console
azdata login --help
```

## Log into your Kubernetes cluster with kubectl
To do this, you may want to use the example commands provided in this blog post: https://blog.christianposta.com/kubernetes/logging-into-a-kubernetes-cluster-with-kubectl/
You would run commands like:

```console
kubectl config view
kubectl config set-credentials kubeuser/my_kubeuser --username=<your Arc Data Controller Admin user name> --password=<password>
kubectl config set-cluster my_kubeuser --server=https://12.345.67.890:30080
kubectl config set-context default/my_kubeuser/ArcDataControllerAdmin --user=ArcDataControllerAdmin/my_kubeuser --namespace=arc --cluster=my_kubeuser
kubectl config use-context default/my_kubeuser/ArcDataControllerAdmin
```

## Launch Azure Data Studio

## Open the troubleshooting notebook

Implement the steps described in [Manage PostgreSQL with Azure Data Studio](manage-postgresql-with-azure-data-studio.md) to:
1. Connect to your Arc Data Controller
2. Right-click on your Postgres instance and choose **Manage**
3. Select the **Diagnose and solve problems** dashboard
4. Click the **Troubleshoot** link

## Run the scripts
Click the 'Run All' button at the top to execute the notebook all at once, or you can step through and execute each code cell one by one.

View the output from the execution of the code cells for any potential issues.

## Next
You can create your own notebooks to meet your needs.