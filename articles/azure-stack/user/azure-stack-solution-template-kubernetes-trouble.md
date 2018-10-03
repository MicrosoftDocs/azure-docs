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

## Overview of the Kubernetes cluster deployment

Before we get into the various steps you may need to take troubleshooting your cluster, you may need a broad understanding of how the solution template creates creates the VMs and installs the ACS Engine for your cluster. 

The following diagram shows the general process for deploying the cluster.

`image`

`Summarize the deployment process`

## Heading 2

![Troubleshooting Blade](media/azure-stack-solution-template-kubernetes-trouble/azure-stack-kub-trouble-report.png)

1.  Consult the troubleshooting blade. Each resource that is deployed provides the following information.
    
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
    b.  The creation has trigged are an internal error or creation error.   
        i.  Collect the Azure Stack logs and send them to the CSS.  
        ii.  Does the fully qualified domain name (FDQN) for the VM begin with a duplicate prefix?  
4.  If the VM is **OK** then, evaluate the DVM. If the DVM has an error message:
    a.  Is the key valid?
    b.  Retrieve the logs for the Azure Stack using the Privileged End Points. 

## Get the logs from a Linux VM

### Prerequistes

You will need to have installed Git on your the machine you use to manage Azure Stack. You will be using Bash from the Git commandline. To get the most recent version of GIT, see X.

1. Open Git. You can liekly find bash with git at `c:\programfiles\git\bin\bash.exe`.
2. Run the following bash commands:
    ```Bash  
    mkdir -p $HOME/kuberneteslogs
    cd $HOME/kuberneteslogs
    curl -O https://raw.githubusercontent.com/msazurestackworkloads/azurestack-gallery/master/diagnosis/getkuberneteslogs.sh
    sudo chmod 744 getkuberneteslogs.sh
    ```
3. In the same session run the following command with the paramaters updated to match your environment.

 
 
VPN into the Azure Stack and then run the command on the local machine.
Run bash.
Run this command: 
 
1.  Open the bash shell

 
 
Run the command:
 
 ./getkuberneteslogs.sh --identity-file AAAAB3NzaC1yc2EAAAABJQAAAQEAmVeC9wzK/Ektrb1IwMIV2lTANY1Mhgu3AZwjPqAIXXJzAwhcN9ETnba9dX6rkxTGjsJcvRSB35XqvBA7JoRCbRj5/iab9sQ4pYHIl3UxV7Rk0YxaT6l9zeQaWmokNHM4AJRMZH7uTGS0dj6jlBvS367l3ix+aye3PDSJwgHzHHYW36c7bg9W0zhU5fLaAkZKEvBQp37xgPsc+zcU4aopW6LKo9MBRNWctQPTV5WMIhXE/Xh3WiIv72NZpffREoC3v3ESq0PXOnp9Z0RTo32iBR5WymRX2qhwMeUSLI8eqCejQ51HrKbK4qmgXqmiVa4mOHhB1276CosThnBiYs0E2Q==  --user azureuser --vmdhost192.168.102.37/k8s-12345.local.cloudapp.azurestack.external # 192.168.102.32 192.168.102.37/k8s-12345.local.cloudapp.azurestack.external

 ./getkuberneteslogs.sh --identity-file id_rsa --user azureuser --vmdhost 192.168.102.37


(Note from the cmdprompt:

Incorrect parameter --dvmhost

      Usage:
      ./getkuberneteslogs.sh -i id_rsa -h 192.168.102.34 -u azureuser
      ./getkuberneteslogs.sh --identity-file id_rsa --user azureuser --vmdhost 192.168.102.32
      ./getkuberneteslogs.sh --identity-file id_rsa --host 192.168.102.34 --user azureuser --vmdhost 192.168.102.32

| Parameter           | Description                                                                                                      | Example                                                                       |
|---------------------|------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| -i, --identity-file | the RSA Private Key filefile to connect the kubernetes master VM, it starts with -----BEGIN RSA PRIVATE KEY----- | C:\data\privatekey.ppk                                                        |
| -h, --host          | public ip or FQDN of the Kubernetes cluster master VM. The VM name starts with k8s-master-                       | 192.168.102.37<br><br>(for k8s-12345.local.cloudapp.azurestack.external)      |
| -u, --user          | user name of the Kubernetes cluster master VM                                                                    | azureuser                                                                     |
| -d, --vmdhost       | public ip or FQDN of the DVM. The vm name start with vmd-)                                                       | 192.168.102.38<br><br>(for vmd-dnsk8-frog.local.cloudapp.azurestack.external) |

## Heading 2

Get the file with #3:
The command will create a new folder and time stamp it.
Dvmlog folder
Acsengine-kuubernetes.log
 
List typical errors.


Hey Hongbin,

For ASDK/forum support customers have been sending email to ascustfeedback@microsoft.com to setup a  DTM workspace to upload the logs. This is done in the legacy DTM system. Once the customer upload has completed someone on the Microsoft side has to download, and will then need to create a Helen workspace and upload to Helen. I’m not sure how they were creating the DTM workspaces, CSS uses the ones that are auto generated. Customer instructions should be similar to this; https://support.microsoft.com/en-us/help/3027228/how-to-use-the-data-transfer-and-management-tool-in-office-365-dedicat

For the Azure SDK user, if the VM failed to deploy to set up Kubernetes cluster, we will need collect azure stack log for all the RPs from the customer.
Matt from content team will document that if there is no document yet.

Could you please share the process and steps to collect azure stack the customer ?


We can have the customers upload directly to Helen, but it would require a new limited rbac role to be created. Currently only CSS can create the Helen workspaces, and we get full access to all customer data. To allow the ASDK/forum support we’d need a role that can create workspaces but not see any other workspaces unless granted access. This was something we had been looking at for PFE staff, but was put on the back burner. @Shireen & @Yusuf regarding this request.

Creating a Helen workspace;
https://www.csssupportwiki.com/index.php/curated:Azure_Stack/TSG/How_to_use_Helen#Create_a_workspace_for_ingestion

Upload instructions;
https://www.csssupportwiki.com/index.php/curated:Azure_Stack/TSG/How_to_use_Helen#Ingestion_-_Upload_Data_Workflows



## Next steps

[Deploy Kubernetes to Azure Stack](azure-stack-solution-template-kubernetes-deploy.md).
[Add a Kubernetes to the Marketplace (for the Azure Stack operator)](..\azure-stack-solution-template-kubernetes-cluster-add.md)
[Kubernetes on Azure](https://docs.microsoft.com/azure/container-service/kubernetes/container-service-kubernetes-walkthrough)
