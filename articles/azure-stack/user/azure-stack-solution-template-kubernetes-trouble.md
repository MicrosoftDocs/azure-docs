---
title: Troubleshoot your deployment to Kubernetes to Azure Stack | Microsoft Docs
description: Learn how to troubleshoot your deployment to Kubernetes to Azure Stack.
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
ms.date: 10/29/2018
ms.author: mabrigg
ms.reviewer: waltero

---

# Troubleshoot your deployment to Kubernetes to Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

> [!Note]  
> Kubernetes on Azure Stack is in preview.

The following article looks at troubleshooting your Kubernetes cluster. You can review the deployment alert and review the status of your deployment by the elements required for the deployment. You might need to collect the deployment logs from Azure Stack or the Linux VMs that host Kubernetes. You might also need to work with your Azure Stack administrator to retrieve logs from an administrative endpoint.

## Overview of deployment

Before you start troubleshooting your cluster, you might want to review the Azure Stack Kubernetes cluster deployment process. The deployment uses an Azure Resource Manager solution template to create the VMs and install the ACS Engine for your cluster.

### Deployment workflow

The following diagram shows the general process for deploying the cluster.

![Deploy Kubernetes process](media/azure-stack-solution-template-kubernetes-trouble/002-Kubernetes-Deploy-Flow.png)

### Deployment steps

1. Collect input parameters from the marketplace item.

    Enter the values you need to set up the Kubernetes cluster, including:
    -  **User name**: The user name for the Linux virtual machines that are part of the Kubernetes cluster and DVM.
    -  **SSH public key**: The key that's used for the authorization of all Linux machines that were created as part of the Kubernetes cluster and DVM.
    -  **Service principle**: The ID that's used by the Kubernetes Azure cloud provider. The client ID identified as the application ID when you created your service principal. 
    -  **Client secret**: They key you created when you created your service principal.

2. Create the deployment VM and custom script extension.
    -  Create the deployment Linux VM by using the marketplace Linux image **Ubuntu Server 16.04-LTS**.
    -  Download and run the customer script extension from the marketplace. The script is **Custom Script for Linux 2.0**.
    -  Run the DVM custom script. The script does the following tasks:
        1. Gets the gallery endpoint from the Azure Resource Manager metadata endpoint.
        2. Gets the active directory resource ID from the Azure Resource Manager metadata endpoint.
        3. Loads the API model for the ACS Engine.
        4. Deploys the ACS Engine to the Kubernetes cluster and saves the Azure Stack cloud profile to `/etc/kubernetes/azurestackcloud.json`.
3. Create the master VMs.

4. Download and run customer script extensions.

5. Run the master script.

    The script does the following tasks:
    - Installs etcd, Docker, and Kubernetes resources such as kubelet. etcd is a distributed key value store that provides a way to store data across a cluster of machines. Docker supports bare-bones operating system-level virtualizations known as containers. Kubelet is the node agent that runs on each Kubernetes node.
    - Sets up the etcd service.
    - Sets up the kubelet service.
    - Starts kubelet. This task involves the following steps:
        1. Starts the API service.
        2. Starts the controller service.
        3. Starts the scheduler service.
6. Create agent VMs.

7. Download and run the customer script extension.

7. Run the agent script. The agent custom script does the following tasks:
    - Installs etcd
    - Sets up the kubelet service
    - Joins the Kubernetes cluster

## Steps for troubleshooting

You can collect logs on the VMs that support your Kubernetes cluster. You can also review the deployment log. You might need to talk to your Azure Stack administrator to verify the version of Azure Stack that you need to use, and to get logs from Azure Stack that are related to your deployment.

1. Review the [deployment status](#review-deployment-status) and [retrieve the logs](#get-logs-from-a-vm) from the master node in your Kubernetes cluster.
2. Be sure that you're using the latest version of Azure Stack. If you're unsure which version you're using, contact your Azure Stack administrator. The Kubernetes cluster marketplace time 0.3.0 requires Azure Stack version 1808 or greater.
3.  Review your VM creation files. You might have had the following issues:  
    - The public key might be invalid. Review the key that you created.  
    - VM creation might have triggered an internal error or triggered a creation error. A number of factors can cause errors, including capacity limitations for your Azure Stack subscription.
    - Make sure that the fully qualified domain name (FDQN) for the VM begins with a duplicate prefix.
4.  If the VM is **OK**, then evaluate the DVM. If the DVM has an error message:

    - The public key might be invalid. Review the key that you created.  
    - You need to contact your Azure Stack administrator to retrieve the logs for Azure Stack by using the privileged endpoints. For more information, see [Azure Stack diagnostics tools](https://docs.microsoft.com/azure/azure-stack/azure-stack-diagnostics).
5. If you have a question about your deployment, you can post it or see if someone has already answered the question in the [Azure Stack forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=azurestack). 

## Review deployment status

When you deploy your Kubernetes cluster, you can review the deployment status to check for any issues.

1. Open the [Azure Stack portal](https://portal.local.azurestack.external).
2. Select **Resource groups**, and then select the name of the resource group that you used when deploying the Kubernetes cluster.
3. Select **Deployments**, and then select the **Deployment name**.

    ![Troubleshooting](media/azure-stack-solution-template-kubernetes-trouble/azure-stack-kub-trouble-report.png)

4.  Consult the troubleshooting window. Each deployed resource provides the following information:
    
    | Property | Description |
    | ----     | ----        |
    | Resource | The name of the resource. |
    | Type | The resource provider and the type of resource. |
    | Status | The status of the item. |
    | TimeStamp | The UTC timestamp of the time. |
    | Operation details | The operation details such as the resource provider that was involved in the operation, the resource endpoint, and the name of the resource. |

    Each item has a status icon of green or red.

## Get logs from a VM

To generate the logs, you need to connect to the master VM for your cluster, open a bash prompt, and then run a script. The master VM can be found in your cluster resource group, and is named `k8s-master-<sequence-of-numbers>`. 

### Prerequisites

You need a bash prompt on the machine that you use to manage Azure Stack. Use bash to run the scripts that access the logs. On a Windows machine, you can use the bash prompt that's installed with Git. To get the most recent version of git, see [Git downloads](https://git-scm.com/downloads).

### Get logs

To get logs, take the following steps:

1. Open a bash prompt. If you're using Git on a Windows machine, you can open a bash prompt from the following path: `c:\programfiles\git\bin\bash.exe`.
2. Run the following bash commands:

    ```Bash  
    mkdir -p $HOME/kuberneteslogs
    cd $HOME/kuberneteslogs
    curl -O https://raw.githubusercontent.com/msazurestackworkloads/azurestack-gallery/master/diagnosis/getkuberneteslogs.sh
    sudo chmod 744 getkuberneteslogs.sh
    ```

    > [!Note]  
    > On Windows, you don't need to run `sudo`. Instead, you can just use `chmod 744 getkuberneteslogs.sh`.

3. In the same session, run the following command with the parameters updated to match your environment:

    ```Bash  
    ./getkuberneteslogs.sh --identity-file id_rsa --user azureuser --vmdhost 192.168.102.37
    ```

4. Review the parameters, and set the values based on your environment.
    | Parameter           | Description                                                                                                      | Example                                                                       |
    |---------------------|------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
    | -i, --identity-file | The RSA private key file to connect the Kubernetes master VM. They key must start with `-----BEGIN RSA PRIVATE KEY-----` | C:\data\privatekey.pem                                                        |
    | -h, --host          | The public IP or the fully qualified domain name (FQDN) of the Kubernetes cluster master VM. The VM name starts with `k8s-master-`.                       | IP: 192.168.102.37<br><br>FQDN: k8s-12345.local.cloudapp.azurestack.external      |
    | -u, --user          | The user name of the Kubernetes cluster master VM. You set this name when you configure the marketplace item.                                                                    | azureuser                                                                     |
    | -d, --vmdhost       | The public IP or the FQDN of the DVM. The VM name starts with `vmd-`.                                                       | IP: 192.168.102.38<br><br>DNS: vmd-dnsk8-frog.local.cloudapp.azurestack.external |

   When you add your parameter values, it might look something like the following code:

    ```Bash  
    ./getkuberneteslogs.sh --identity-file "C:\secretsecret.pem" --user azureuser --vmdhost 192.168.102.37
     ```

    A successful run creates the logs.

    ![Generated logs](media/azure-stack-solution-template-kubernetes-trouble/azure-stack-generated-logs.png)


4. Retrieve the logs in the folders that were created by the command. The command creates new folders and time stamps them.
    - KubernetesLogs*YYYY-MM-DD-XX-XX-XX-XXX*
        - Dvmlogs
        - Acsengine-kubernetes-dvm.log

## Next steps

[Deploy Kubernetes to Azure Stack](azure-stack-solution-template-kubernetes-deploy.md)

[Add a Kubernetes cluster to the Marketplace (for the Azure Stack operator)](../azure-stack-solution-template-kubernetes-cluster-add.md)

[Kubernetes on Azure](https://docs.microsoft.com/azure/container-service/kubernetes/container-service-kubernetes-walkthrough)
