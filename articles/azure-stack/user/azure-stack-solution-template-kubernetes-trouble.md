---
title: Troubleshoot your deployment to Kubernetes (K8) to Azure Stack | Microsoft Docs
description: Learn how to troubleshoot your deployment to Kubernetes (K8) to Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/11/2018
ms.author: mabrigg
ms.reviewer: waltero

---

# Troubleshoot your deployment to Kubernetes to Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

> [!Note]  
> Kubernetes on Azure Stack is in preview.

The following article looks at troubleshooting your Kubernetes cluster. You can review the deployment alert and review the status of your deployment by the elements required for the deployment. You may need to collect the deployment logs from your Azure Stack or the Linux VMs that host Kubernetes. In addition, you may need to work with your Azure Stack administrator to retrieve logs from an administrative endpoint.

## Overview of deployment

Before you get into the steps to troubleshoot your cluster, you may want to review the Azure Stack Kubernetes cluster deployment process. The deployment uses an Azure Resource Manager solution template to create the VMs and installs the ACS Engine for your cluster.

### Deployment workflow

The following diagram shows the general process for deploying the cluster.

![Deploy Kubernetes process](media/azure-stack-solution-template-kubernetes-trouble/002-Kubernetes-Deploy-Flow.png)

### Deployment steps

1. Collects input parameters from the marketplace item.

    Enter the values you need to set up the Kubernetes cluster including:
    -  **User name** User name for the Linux Virtual Machines that are part of the Kubernetes cluster and DVM.
    -  **SSH Public Key** The key used for authorization to all Linux machines created as part of the Kubernetes cluster and DVM
    -  **Service principle** The ID used by the Kubernetes Azure cloud provider. The Client ID identified as the Application ID when you are created your service principal. 
    -  **Client secret** They key you created when creating your service principal.

2. Creates deployment VM and custom script extension.
    -  Creates the deployment Linux VM using the marketplace Linux image, **Ubuntu Server 16.04-LTS**.
    -  Download and execute customer script extension from the marketplace. The script is the **Custom Script for Linux 2.0**.
    -  Runs the DVM custom script. The script:
        1. Gets the gallery endpoint from Azure Resource Manager metadata endpoint.
        2. Gets the active directory resource ID from Azure Resource Manager metadata endpoint.
        3. Loads the API model for the ACS Engine.
        4. Deploys the ACS Engine to the Kubernetes cluster, and saves the Azure Stack cloud profile to `/etc/kubernetes/azurestackcloud.json`.
3. Creates master VMs.

    Downloads and executes customer script extension.

4. Runs the master script.

    The script:
    - Installs etcd, Docker, and Kubernetes resources such as kubelet. etcd is a distributed key value store that provides a way to store data across a cluster of machines. Docker supports bare-bones operating system level virtualizations known as containers. Kubelet is the node agent that runs on each Kubernetes node.
    - Sets up the etcd service.
    - Sets up Kubelet service.
    - Starts kubelet. This involves the following:
        1. Starts API Service.
        2. Starts Controller service.
        3. Starts Scheduler service.
5. Creates agent VMs.

    Downloads and executes the customer script extension.

6. Runs agent script. The agent custom script:
    - Install etcd.
    - Set up the Kubelet service.
    - Joins the Kubernetes cluster.

## Steps for troubleshooting

You can collect logs on the VMs supporting your Kubernetes cluster. You can also review the deployment log. You may also need to talk to your Azure Stack administrator to verify the version of Azure Stack you are using, and to get logs from Azure Stack related to your deployment.

1. Review the [deployment status](#review-deployment-status) and the [retrieve the logs](#get-logs-from-a-vm) from the master node in your Kubernetes cluster.
2. You need to use the latest version of Azure Stack. If you are unsure of your version of Azure Stack, contact your Azure Stack administrator. The Kubernetes Cluster marketplace time 0.3.0 requires Azure Stack version 1808 or greater.
3.  Review your VM creation files. You may have encountered the following issues:  
    - The public key may be invalid. Review the key that you have created.  
    - VM creation may have triggered an internal error or triggered a creation error. Errors may be caused by a number of factors including capacity limitations for your Azure Stack subscription.
    - Does the fully qualified domain name (FDQN) for the VM begin with a duplicate prefix?
4.  If the VM is **OK**, then, evaluate the DVM. If the DVM has an error message:

    - The public key may be invalid. Review the key that you have created.  
     - You will need to contact your Azure Stack administrator to retrieve the logs for Azure Stack using the Privileged End Points. For more information, see [Azure Stack diagnostics tools](https://docs.microsoft.com/azure/azure-stack/azure-stack-diagnostics).
5. If you have questions about your deployment, you can post your question or see if someone has already answered the question in the [Azure Stack Forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=azurestack). 

## Review deployment status

You can review the deployment status when you deploy your Kubernetes cluster to review any issues.

1. Open the [Azure Stack portal](https://portal.local.azurestack.external).
2. Select **Resource groups**, and then select the name of the resource group used when deploying the Kubernetes cluster.
3. Select **Deployments** and then the **Deployment name**.

    ![Troubleshooting](media/azure-stack-solution-template-kubernetes-trouble/azure-stack-kub-trouble-report.png)

4.  Consult the troubleshooting window. Each deployed resource provides the following information.
    
    | Property | Description |
    | ----     | ----        |
    | Resource | The name of the resource. |
    | Type | The resource provider and the type of resource. |
    | Status | The status of the item. |
    | TimeStamp | The UTC timestamp of the time. |
    | Operation details | The operation details such as the resource provider involved in the operation, the resource end point, and the name of the resource. |

    Each item will have a status icon of green or red.

## Get logs from a VM

You will need to connect to the master VM for your cluster, open a bash prompt, and run a script to generate the logs. The master can be found in your cluster resource group, and is named `k8s-master-<sequence-of-numbers>`. 

### Prerequisites

You will need a bash prompt on the machine your use to manage Azure Stack. Use bash to run the scripts that access the logs. On a Windows machine, you can use the bash prompt installed with Git. To get the most recent version of git, see [git downloads](https://git-scm.com/downloads).

### Get logs

1. Open a bash prompt. If you are using git on a Windows machine, you can open a bash prompt from the following path: `c:\programfiles\git\bin\bash.exe`.
2. Run the following bash commands:

    ```Bash  
    mkdir -p $HOME/kuberneteslogs
    cd $HOME/kuberneteslogs
    curl -O https://raw.githubusercontent.com/msazurestackworkloads/azurestack-gallery/master/diagnosis/getkuberneteslogs.sh
    sudo chmod 744 getkuberneteslogs.sh
    ```

    > [!Note]  
    > On Windows, you don't need to run `sudo` and can just use `chmod 744 getkuberneteslogs.sh`.

3. In the same session, run the following command with the parameters updated to match your environment.

    ```Bash  
    ./getkuberneteslogs.sh --identity-file id_rsa --user azureuser --vmdhost 192.168.102.37
    ```

    Review the parameters and set the values based on your environment.
    | Parameter           | Description                                                                                                      | Example                                                                       |
    |---------------------|------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
    | -i, --identity-file | The RSA Private Key file to connect the kubernetes master VM. They key must start with `-----BEGIN RSA PRIVATE KEY-----` | C:\data\privatekey.pem                                                        |
    | -h, --host          | The public ip or the fully qualified domain name (FQDN) of the Kubernetes cluster master VM. The VM name starts with `k8s-master-`.                       | IP: 192.168.102.37<br><br>FQDN: k8s-12345.local.cloudapp.azurestack.external      |
    | -u, --user          | The user name of the Kubernetes cluster master VM. You set this name when configuring the marketplace item.                                                                    | azureuser                                                                     |
    | -d, --vmdhost       | The public ip or the FQDN of the DVM. The VM name starts with `vmd-`.                                                       | IP: 192.168.102.38<br><br>DNS: vmd-dnsk8-frog.local.cloudapp.azurestack.external |

   When you add your parameters values, it may look something like:

    ```Bash  
    ./getkuberneteslogs.sh --identity-file "C:\secretsecret.pem" --user azureuser --vmdhost 192.168.102.37
     ```

    A successful run creates the logs.

    ![Generated logs](media/azure-stack-solution-template-kubernetes-trouble/azure-stack-generated-logs.png)


4. Retrieve the logs in the folders created by the command. The command will create a new folder and time stamp it.
    - KubernetesLogs*YYYY-MM-DD-XX-XX-XX-XXX*
        - Dvmlogs
        - Acsengine-kubernetes-dvm.log

## Next steps

[Deploy Kubernetes to Azure Stack](azure-stack-solution-template-kubernetes-deploy.md).

[Add a Kubernetes to the Marketplace (for the Azure Stack operator)](..\azure-stack-solution-template-kubernetes-cluster-add.md)

[Kubernetes on Azure](https://docs.microsoft.com/azure/container-service/kubernetes/container-service-kubernetes-walkthrough)
