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
ms.date: 10/05/2018
ms.author: mabrigg
ms.reviewer: waltero

---

# Troubleshoot your deployment to Kubernetes to Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

> [!Note]  
> Kubernetes on Azure Stack is in preview.

The following article looks troubleshooting your Kubernetes cluster. You can review the deployment alert and review the status of your deployment by the elements required for the deployment. You may need to collect the deployment logs from your Azure Stack or the Linux VMs that host Kubernetes.

## Overview of deployment

Before we get into the steps you may need to take troubleshooting your cluster, you may need a broad understanding the deployment. The deploymet uses a Azure Resource Manager solution template to create the VMs and installs the ACS Engine for your cluster.

The following diagram shows the general process for deploying the cluster.

![Deploy Kubernetes process](media/azure-stack-solution-template-kubernetes-trouble/002-Kubernetes-Deploy-Flow.png)

1. Collects input from the market place item.

    You enter the values you need to set up the Kubernetes cluster including:
    -  **User name** User name for the Linux Virtual Machines that are part of the Kubernetes cluster and DVM.
    -  **SSH Public Key** The key used for authorization to all Linux machines created as part of the Kubernetes cluster and DVM
    -  **Service principle** The ID used by the Kubernetes Azure cloud provider. The Client ID identified as the Application ID when your created your service principal. 
    -  **Client secret** They key you created when creating your service principal.

2. Creates deployment VM and custom script extension.
    -  Creates the deployment Linux VM using the marketplace Linux image, **Ubuntu Server 16.04-LTS**.
    -  Download and execute customer script extension from the market place. The script is the **Custom Script for Linux 2.0**.
    -  Runs the DVM custom script. The script:
        1. Gets the gallery endpoint from Azure Resource Manager metadata endpoint.
        2. Gets the active directory resource ID from Azure Resource Manager metadata endpoint.
        3. Loads the API model for the ACS Engine.
        4. Deploys the ACS Engine to the Kubernetes cluster, and saves the Azure Stack cloud profile to `/etc/kubernetes/azurestackcloud.json`.
3. Creates master VMs.

    Downloads and executes customer script extension.

4. Runs the master script.

    The script:
    - Installs etcd, Docker, and Kubernetes resrouces such as kubelet. etcd is a distributed key value store that provides a reliable way to store data across a cluster of machines. Docker supports bare-bones operating system level virtualizations known as containers. Kubelet is the node agent that runs on each Kubernetes node.
    - Sets up the etcd service.
    - Sets up Kubelet service.
    - Starts kubelet. This involves the following:
        1. Starts API Service.
        2. Starts Controller service.
        3. Starts Scheduler service.
5. Creates agent VMs.

    Downloads and executes customer script extension.

6. Runs agent script. The agent custom script:
    - Install etcd.
    - Set up the Kubelet service.
    - Joins the Kubernetes cluster.

## Deployment status

![Troubleshooting](media/azure-stack-solution-template-kubernetes-trouble/azure-stack-kub-trouble-report.png)

1.  Consult the troubleshooting window. Each resource that is deployed provides the following information.
    
    | Property | Description |
    | ----     | ----        |
    | Resource | The name of the resource. |
    | Type | The resource provider and the type of resource. |
    | Status | The status of the item. |
    | TimeStamp | The UTC timestamp of the time. |
    | Operation details | A hyperlink to what? |

    Each item will have a status icon of green or red.

2.  If you are unable to identify the issue and resolve it, what version of Azure Stack. You will need to ask your Azure Stack administrator. The Kubernetes Cluster marketplace time 0.3.0 requires Azure Stack version 1808 or greater.
3.  Review your VM creation files. You may encounter the following issues:  
    a.  The public key may be invalid. Review the key that you have created.  
    b.  The creation has trigger are an internal error or creation error.   
        i.  Collect the Azure Stack logs and send them to the CSS.  
        ii.  Does the fully qualified domain name (FDQN) for the VM begin with a duplicate prefix?  
4.  If the VM is OK,** then, evaluate the DVM. If the DVM has an error message:
    a.  Is the key valid?
    b.  Retrieve the logs for the Azure Stack using the Privileged End Points. 

## Get logs from a Linux VM

Summary of this section.

For the Azure SDK user, if the VM failed to deploy to set up Kubernetes cluster, we will need collect Azure Stack log for all the RPs from the customer. 

### Prerequisites

You will need to have Git installed on you are the machine you use to manage Azure Stack. You will be using Bash from the Git command line. To get the most recent version of git, see [git downloads](https://git-scm.com/downloads).

1. Open a bash prompt. With git, you can open it at the following path: `c:\programfiles\git\bin\bash.exe`.
2. Run the following bash commands:

    ```Bash  
    mkdir -p $HOME/kuberneteslogs
    cd $HOME/kuberneteslogs
    curl -O https://raw.githubusercontent.com/msazurestackworkloads/azurestack-gallery/master/diagnosis/getkuberneteslogs.sh
    sudo chmod 744 getkuberneteslogs.sh
    ```

3. In the same session, run the following command with the parameters updated to match your environment.

    ```Bash  
    ./getkuberneteslogs.sh --identity-file id_rsa --user azureuser --vmdhost 192.168.102.37
    ```

    | Parameter           | Description                                                                                                      | Example                                                                       |
    |---------------------|------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
    | -i, --identity-file | The RSA Private Key file to connect the kubernetes master VM. They key must start with `-----BEGIN RSA PRIVATE KEY-----` | C:\data\privatekey.ppk                                                        |
    | -h, --host          | The public ip or fully qualified domain name (FQDN) of the Kubernetes cluster master VM. The VM name starts with `k8s-master-`.                       | IP: 192.168.102.37<br><br>FQDN: k8s-12345.local.cloudapp.azurestack.external      |
    | -u, --user          | The user name of the Kubernetes cluster master VM.                                                                    | azureuser                                                                     |
    | -d, --vmdhost       | The public ip or FQDN of the DVM. The vm name starts with `vmd-`.                                                       | IP: 192.168.102.38<br><br>DNS: vmd-dnsk8-frog.local.cloudapp.azurestack.external |

   the following is an example of the script:

    ```Bash  
    ./getkuberneteslogs.sh --identity-file "C:\secretsecret.pem" --user azureuser --vmdhost 192.168.102.37
     ```

    ![Generated logs](media/azure-stack-solution-template-kubernetes-trouble/auzre-stack-generated-logs.png)


4. Retrieve the logs in the folders created by the command. The command will create a new folder and time stamp it.
    - Dvmlog
    - Acsengine-kuubernetes.log

5. Upload your log files to the log sharing workspace. sharing tool Helen. For instructions, see [How to use Helen](https://www.csssupportwiki.com/index.php/curated:Azure_Stack/TSG/How_to_use_Helen).

## Next steps

[Deploy Kubernetes to Azure Stack](azure-stack-solution-template-kubernetes-deploy.md).

[Add a Kubernetes to the Marketplace (for the Azure Stack operator)](..\azure-stack-solution-template-kubernetes-cluster-add.md)

[Kubernetes on Azure](https://docs.microsoft.com/azure/container-service/kubernetes/container-service-kubernetes-walkthrough)
