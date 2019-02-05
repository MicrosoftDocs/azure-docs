--- 
title: Enable the Kubernetes Web UI (Dashboard) in Azure Stack | Microsoft Docs 
description: Learn how to enable the Kubernetes Web UI (Dashboard) in Azure Stack 
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
ms.date: 02/06/2019 
ms.author: mabrigg 
ms.reviewer: waltero 
ms.lastreviewed: 02/06/2019 
# Keyword target: Azure Stack Kubernetes dashboard 
--- 
# Enable the Kubernetes Web UI (Dashboard) in Azure Stack 

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit* 
> [!Note]   
> Kubernetes on Azure Stack is in preview. Azure Stack disconnected scenario is not currently supported by the preview. 

Kubernetes includes a web dashboard that you can use for basic management operations. This dashboard lets you view basic health status and metrics for your applications, create and deploy services, and edit existing applications. This article shows you how to enable the Kubernetes dashboard. 
For more information on the Kubernetes dashboard, see [Kubernetes Web UI Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/) 

## Enable the dashboard 

1.  Export you’re the certificates from the master in the cluster. 
2.  Import the certificate to your local machine.
2.  Open the Kubernetes web dashboard in Azure Kubernetes Service (AKS) 

## Export the certificate from the cluster master 

1.  Get the URL for the dashboard by connecting to the master in your cluster. You can find the master in your cluster resource group. The master is named **k8s-master-\<sequence-of-numbers>**. 
2.  Open an SSH client to connect to the master. 
3.  On the master, use you can use **kubectl**, the Kubernetes command-line client to manage your cluster. 
4.  Run the following command:  

    ```Bash   
kubectl cluster-info 
    ``` 

5.  Extract the self-signed cert and convert it to PFX format.  

    ```Bash   
    sudo su 
    openssl pkcs12 -export -out /etc/kubernetes/certs/client.pfx -inkey /etc/kubernetes/certs/client.key  -in /etc/kubernetes/certs/client.crt -certfile /etc/kubernetes/certs/ca.crt 
    ``` 

6.  Get the token and save it. 

    ```Bash   
    kubectl -n kube-system describe secret kubernetes-dashboard-token-<####>| awk '$1=="token:"{print $2}' 
    ``` 

7.   Get the list of secrets in kube-system namespace, run

    ```Bash  
Kubectl -n kube-system get secrets
    ```

    Make note of the kubernetes-dashboard-token-\<XXXXX> value. 

8.  Copy `/etc/kubernetes/certs/client.pfx` and  `/etc/kubernetes/certs/ca.crt` using a PSCP connetion to transfer the file securely to your local Windows machine. 

## Import the certificate on your local machine 

Open PowerShell with an elevated prompt and run the following cmdlets:  

    ```PowerShell   
    Import  /etc/kubernetes/certs/ca.crt -CertStoreLocation cert:\LocalMachine\Root 
    Import-Certificate -Filepath "ca.crt" -CertStoreLocation cert:\LocalMachine\Root 
    $pfxpwd = Get-Credential -UserName 'Enter password below' -Message 'Enter password below' 
    Import-PfxCertificate -Filepath "client.pfx" -CertStoreLocation cert:\CurrentUser\My -Password $pfxpwd.Password 
    ``` 

## Open the dashboard 

1.  If you are using a browser with a pop-up blocker, enable pop-ups. If you don’t, the prompts will be blocked.

2.  Point your browser to:   
https://azurestackdomainnamefork8sdashboard/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy 
3.  Select the client certificate.
4.  Enter the token. 
5.  Give permissions to the kubernetes-dashboard. The following doc explains why this is the case, see section [For RBAC-enabled clusters](https://docs.microsoft.com/azure/aks/kubernetes-dashboard). 
    ```Bash   
    kubectl create clusterrolebinding kubernetes-dashboard --clusterrole=cluster-admin --serviceaccount=kube-system:kubernetes-dashboard 
    ``` 
Notice that the script gives `kubernetes-dashboard` Cloud administrator privileges. The article, [For RBAC-enabled clusters](https://docs.microsoft.com/azure/aks/kubernetes-dashboard), provides more context.

## Next steps 

[Deploy Kubernetes to Azure Stack](azure-stack-solution-template-kubernetes-deploy.md)  

[Add a Kubernetes cluster to the Marketplace (for the Azure Stack operator)](../azure-stack-solution-template-kubernetes-cluster-add.md)  

[Kubernetes on Azure](https://docs.microsoft.com/azure/container-service/kubernetes/container-service-kubernetes-walkthrough)  
