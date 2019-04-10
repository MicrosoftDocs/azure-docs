---
title: Troubleshoot Kubernetes deployment on Azure Stack | Microsoft Docs
description: Learn how to troubleshoot Kubernetes deployment on Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.author: mabrigg
ms.date: 04/02/2019
ms.reviewer: waltero
ms.lastreviewed: 03/20/2019

---

# Troubleshoot Kubernetes deployment to Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

> [!Note]  
> Kubernetes on Azure Stack is in preview. Azure Stack disconnected scenario is not currently supported by the preview.

The following article looks at how to watch a cluster deployment and how to troubleshoot failures during this process. You might need to collect the deployment logs from Azure Stack or the Linux VMs that host Kubernetes.

## Overview

Creating a Kubernetes cluster from Azure Stack's Marketplace is internally a two phase process. A first ARM deployment creates a _deployment virtual machine_ (aka DVM) in the cluster's resource group. While provisioning the DVM, a custom script extensions (aka CSE) will initiate the second phase by executing [AKS Engine's](https://github.com/Azure/aks-engine) _deploy_ command. This command triggers a second ARM deployment that will effectively create the Kubernetes cluster.

The following diagram shows the entire process.

![Deploy Kubernetes process](media/azure-stack-solution-template-kubernetes-trouble/002-Kubernetes-Deploy-Flow.png)

Troubleshooting steps will be different based on which ARM deployment fails to complete.

## Review ARM deployments status

Under the hood, a **Kubernetes Cluster** deployment uses ARM templates to create all the resources required to have a functional cluster. The ARM deployment status can be watched as you would normally watch any other type of Azure or Azure Stack resource deployment.

From the Azure Stack portal, select the cluster's resource group and then click the **Settings -> Deployments** tab. This tab shows the status of the ARM deployments and provides links to the list of specific operations that took part.

## Steps for troubleshooting

If an ARM deployment fails, its detailed view will show a red banner on the top of the screen. This banner should display an error message containing the deployment _exit code_. 

    ![Troubleshooting](media/azure-stack-solution-template-kubernetes-trouble/azure-stack-kub-trouble-report.png)

If the failure happened during the DVM deployment or its CSE execution, look for the corresponding entry in this [exit code table](https://github.com/msazurestackworkloads/azurestack-gallery/blob/master/kubernetes/template/DeploymentTemplates/script.sh#L3). More details on these errors can be found [here]().

If the failure ocurred during the Kubernetes cluster deployment, then follow AKS Engine's [troubleshooting guide](https://github.com/Azure/aks-engine/blob/master/docs/howto/troubleshooting.md). 

## Review deployment logs

If the Azure Stack portal does not provide enough information for you to troubleshoot or overcome a deployment failure, the next step is to dig into the cluster logs. To manually retrieve the deployment logs, you typically need to connect to one of the cluster's master virtual machines. A simpler alternative approach would be to download and run the following [Bash script](https://aka.ms/AzsK8sLogCollectorScript) provided by the Azure Stack team. This script connects to the DVM and cluster nodes, collects relevant system and cluster logs, and downloads them back to your workstation.

### Prerequisites

You will need a Bash prompt on the machine you use to manage Azure Stack. On a Windows machine, you can get a Bash prompt by installing [Git for Windows](https://git-scm.com/downloads). Once installed, look for _Git Bash_ in your start menu.

### Retrieving the logs

Follow these steps to collect and download the cluster logs:

1. Open a Bash prompt. From a Windows machine, open _Git Bash_ or run: `C:\Program Files\Git\git-bash.exe`.

2. Download the log collector script by running the following commands in your Bash prompt:

    ```Bash  
    mkdir -p $HOME/kuberneteslogs
    cd $HOME/kuberneteslogs
    curl -O https://raw.githubusercontent.com/msazurestackworkloads/azurestack-gallery/master/diagnosis/getkuberneteslogs.sh
    chmod 744 getkuberneteslogs.sh
    ```

3. Look for the information required by the script and run it:

    | Parameter           | Description                                                                                                                      | Example                                                                       |
    |---------------------|----------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
    | -d, --vmd-host      | Public IP or fully qualified domain name (FQDN) of the DVM. The virtual machine name starts with `vmd-`.                         | IP: 192.168.102.38<br>DNS: vmd-myk8s.local.cloudapp.azurestack.external |
    | -i, --identity-file | Path to the RSA private key file used to create the Kubernetes cluster. Needed to remote into the Kubernetes nodes.              | ~/.ssh/id_rsa (SSH) |
    | -m, --master-host   | Public IP or fully qualified domain name (FQDN) of a Kubernetes master node. The virtual machine name starts with `k8s-master-`. | IP: 192.168.102.37<br>FQDN: k8s-master-01.local.cloudapp.azurestack.external |
    | -u, --user          | User name passed to the marketplace item when creating the Kubernetes cluster. Needed to remote in to the Kubernetes nodes       | azureuser (default value) |

    When you add your parameter values, your command might look something like this:

    ```Bash  
    ./getkuberneteslogs.sh -i "C:\keys\id_rsa" -u azureuser --vmd-host 192.168.102.37
     ```

4. After a few minutes, the script will output the collected logs to a directory named `KubernetesLogs_{{time-stamp}}`. There you will find a directory for each virtual machine that belongs to the cluster.

    The log collector script will also look for errors in the log files and include troubleshooting steps if it happens to find a known issue. Make sure you are running the latest version of the script to increase chances of finding these known issues.

> [!Note]  
> Check out this GitHub [repository](https://github.com/msazurestackworkloads/azurestack-gallery/tree/master/diagnosis) to learn more details about the log collector script.

> [!Note]
> If you have a question about your deployment, you can post it or see if someone has already answered the question in the [Azure Stack forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=azurestack).

## Next steps

[Deploy Kubernetes to Azure Stack](azure-stack-solution-template-kubernetes-deploy.md)

[Add Kubernetes Cluster to the Marketplace (for the Azure Stack operator)](../azure-stack-solution-template-kubernetes-cluster-add.md)

[Kubernetes on Azure](https://docs.microsoft.com/azure/container-service/kubernetes/container-service-kubernetes-walkthrough)
