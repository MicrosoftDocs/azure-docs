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

Notebooks can document procedures by including markdown content to describe what to do/how to do it. It can also provide executable code to automate a procedure.  This pattern is useful for everything from standard operating procedures to troubleshooting guides.

 For example, let's troubleshoot a PostgreSQL Hyperscale server group that might have some problems using Azure Data Studios.

## Install Azure Data Studio, kubectl and azdata
You need to have installed Azure Data Studio, kubectl and azdata **on the client machine you're using to run the notebook in Azure Data Studio**.  Follow this scenario: [install-client-tools.md](https://github.com/microsoft/Azure-data-services-on-Azure-Arc/blob/jul-2020/scenarios/install-client-tools.md)

## Update the PATH environment variable
Confirm that the tools can be invoked from anywhere on this client machine. Update the PATH system environment variable in Windows to add the folder in which you installed kubectl.

## Sign into Azdata
Sign into your Arc Data Controller from the client machine and before you launch Azure Data Studio. Enter a run a command like:

```console
azdata login --endpoint https://12.345.67.890:30080
```
Replace the IP address and port with the values of your Kubernetes cluster. You'll be prompted for user and password. For more details, run:

```console
azdata login --help
```

## Log into your Kubernetes cluster with kubectl
Use the commands provided in the blog post to log into cluster: https://blog.christianposta.com/kubernetes/logging-into-a-kubernetes-cluster-with-kubectl/
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
2. Select your Postgres instance and choose **Manage**
3. Select the **Diagnose and solve problems** dashboard
4. Select the **Troubleshoot** link

## Run the scripts
Select the 'Run All' button at the top to execute the notebook all at once, or you can step through and execute each code cell one by one.

View the output from the execution of the code cells for any potential issues.

## Next
You can create your own notebooks to meet your needs.