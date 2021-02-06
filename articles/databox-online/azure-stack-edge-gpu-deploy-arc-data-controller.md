---
title: Deploy an Azure Arc Data Controller on your Azure Stack Edge Pro GPU device| Microsoft Docs
description: Describes how to deploy an Azure Arc Data Controller and Azure Data Services on your Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 02/05/2021
ms.author: alkohli
---
# Deploy Azure Data Services on your Azure Stack Edge Pro GPU device


This article describes the process of creating an Azure Arc Data Controller and then deploying Azure Data Services on your Azure Stack Edge Pro GPU device. 

Azure Arc Data Controller is the local control plane that enables Azure Data Services in customer managed environments. Once you have created the Azure Arc Data Controller on the Kubernetes cluster that runs on your Azure Stack Edge Pro device, you can deploy Azure Data Services such as SQL Managed Instance (Preview) on that data controller.

The procedure to create Data Controller and then deploy an SQL Managed Instance involves use PowerShell and `kubectl` - a native tool that provides command line access to the Kubernetes cluster on the device.


## Prerequisites

Before you begin, make sure that:

1. You've access to an Azure Stack Edge Pro device and you've activated your Azure Stack Edge Pro device as described in [Activate Azure Stack Edge Pro](azure-stack-edge-gpu-deploy-activate.md).

1. You've enabled the compute role on the device. A Kubernetes cluster was also created on the device when you configured compute on the device as per the instructions in [Configure compute on your Azure Stack Edge Pro device](azure-stack-edge-gpu-deploy-configure-compute.md).

1. You have the Kubernetes API endpoint from the **Device** page of your local web UI. For more information, see the instructions in [Get Kubernetes API endpoint](azure-stack-edge-gpu-deploy-configure-compute.md#get-kubernetes-endpoints)

1. You've access to a client that will connect to your device. 
    1. This article uses a Windows client system running PowerShell 5.0 or later to access the device. You can use any other client with a [Supported operating system](azure-stack-edge-gpu-system-requirements.md#supported-os-for-clients-connected-to-device) as well. 
    1. Install `kubectl` on your client. To identify the client version to install:
        1. Identify the Kubernetes server version installed on the device. In the local UI of the device, go to **Software updates** page. Note the **Kubernetes server version** in this page.
        1. Download a client that is skewed no more than one minor version from the master. The client version but may lead the master by up to one minor version. For example, a v1.3 master should work with v1.1, v1.2, and v1.3 nodes, and should work with v1.2, v1.3, and v1.4 clients. For more information on Kubernetes client version, see [Kubernetes version and version skew support policy](https://kubernetes.io/docs/setup/release/version-skew-policy/#supported-version-skew).
    
1. Optionally, [Install client tools for deploying and managing Azure Arc enabled data services](../azure-arc/data/install-client-tools.md). These tool are not required but recommended.  

1. For detailed sizing guidance, go to the storage requirements before you create the data controller.


## Configure Kubernetes service IPs

1. Go the local web UI of the device and then go to Compute.
1. Select the network enabled for compute. 
1. Make sure that you have provided 4 Kubernetes service IPs. The data controller will use 3 services IPs and the 4th IP is used when you create a SQL managed instance. You will need 1 IP for each additional Data Service you will deploy. 
1. Apply the settings and these new IPs will immediately take effect on an already existing Kubernetes cluster. 


## Deploy Azure Arc Data Controller

### Create namespace 

Create a new, dedicated namespace where you will deploy the Data Controller. You'll also create a user and then grant user the access to the namespace that you just created. 

> [!NOTE]
> For both namespace and user names, the [DNS subdomain naming conventions](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names) apply.

1. [Connect to the PowerShell interface](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface).
1. Create a namespace. Type:
	New-HcsKubernetesNamespace -Namespace <Name of namespace>
1. Create a user. Type: 
	New-HcsKubernetesUser -UserName <User name>
1. A config file is displayed in plain text. Copy this file and save it as a *config* file. 

    > [!IMPORTANT]
    > Do not save the config file as *.txt* file, save the file without any file extension.

1. The config file should live in the `.kube` folder of your user profile on the local machine. Copy the file to that folder in your user profile.

    ![Location of config file on client](media/azure-stack-edge-j-series-create-kubernetes-cluster/location-config-file.png)
1. Grant the user access to the namespace that you created. Type: 
	Grant-HcsKubernetesNamespaceAccess -Namespace <Name of namespace> -UserName <User name>

Here is a sample output of the preceding commands. In this example, we create a `myadstest` namespace, a `myadsuser` user and granted the user access to the namespace.

```powershell
[10.100.10.10]: PS>New-HcsKubernetesNamespace -Namespace myadstest
[10.100.10.10]: PS>New-HcsKubernetesUser -UserName myadsuser
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUdJTiBD=======//snipped//=======VSVElGSUNBVEUtLS0tLQo=
    server: https://compute.myasegpudev.wdshcsso.com:6443
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: myadsuser
  name: myadsuser@kubernetes
current-context: myadsuser@kubernetes
kind: Config
preferences: {}
users:
- name: myadsuser
  user:
    client-certificate-data: LS0tLS1CRUdJTiBDRV=========//snipped//=====EE9PQotLS0kFURSBLRVktLS0tLQo=

[10.100.10.10]: PS>Grant-HcsKubernetesNamespaceAccess -Namespace myadstest -UserName myadsuser
[10.100.10.10]: PS>Set-HcsKubernetesAzureArcDataController -SubscriptionId db4e2fdb-6d80-4e6e-b7cd-736098270664 -ResourceGroupName myasegpurg -Location "EastUS" -UserName myadsuser -Password "Password1" -DataControllerName "arctestcontroller" -Namespace myadstest
[10.100.10.10]: PS>
```

### Create Data Controller

Create an Azure Arc Data Controller that you wish to deploy in the namespace that you created earlier. This Azure Arc Data Controller runs on the Kubernetes cluster that exists on your Azure Stack Edge device.  

1. Gather the following information that you'll need to create a data controller:

    
    |Column1  |Column2  |
    |---------|---------|
    |Data controller name     |A descriptive name for your data controller - e.g. "Production data controller", "Seattle data controller".         |
    |Data controller username     |Any username for the data controller administrator user.         |
    |Data controller password     |A password for the data controller administrator user. The data controller administrator username and password is used to authenticate to the data controller API to perform administrative functions.         |
    |Name of your Kubernetes namespace     |The name of the Kubernetes namespace that you want to create the data controller in.         |
    |Azure subscription ID     |The Azure subscription GUID for where you want the data controller resource in Azure to be created.         |
    |Azure resource group name     |The name of the resource group where you want the data controller resource in Azure to be created.         |
    |Azure location     |The Azure location where the data controller resource metadata will be stored in Azure. For a list of available regions, see Azure global infrastructure / Products by region.|

        <!--Did not see the option of specifying a connectivity mode for the data controller that we are creating? Looks like Azure Arc enabled data services provide you the option to connect to Azure in two different connectivity modes: Directly connected and Indirectly connected-->

1. Connect to the PowerShell interface. To create the data controller, type: 

    ```powershell
    Set-HcsKubernetesAzureArcDataController -SubscriptionId <Subscription ID> -ResourceGroupName <Resource group name> -Location <Location without spaces> -UserName <User you created> -Password <Password to authenticate to Data Controller> -DataControllerName <Data Controller Name> -Namespace <Namespace you created>    
    ```
    Here is a sample output of the preceding commands.

    ```powershell
    [10.100.10.10]: PS>Set-HcsKubernetesAzureArcDataController -SubscriptionId db4e2fdb-6d80-4e6e-b7cd-736098270664 -ResourceGroupName myasegpurg -Location "EastUS" -UserName myadsuser -Password "Password1" -DataControllerName "arctestcontroller" -Namespace myadstest
    [10.100.10.10]: PS>	
    ```
    
    The deployment may take approximately 5 minutes to complete.

    > [!NOTE]
    > The data controller created on Kubernetes cluster on your Azure Stack Edge Pro device works only in the disconnected mode in the current release.

### Monitor data creation status

1. Open another PowerShell window.
1. Use the following `kubectl` command to monitor the creation status of the data controller. 

    ```powershell
    kubectl get datacontroller/<Data controller name> --namespace <Name of your namespace>
    ```
    When the controller is created, the status should be `Ready`.
    Here is a sample output of the preceding command:

    ```powershell
    PS C:\WINDOWS\system32> kubectl get datacontroller/arctestcontroller --namespace myadstest
    NAME                STATE
    arctestcontroller   Ready
    PS C:\WINDOWS\system32>
    ```


## 


## Remove data controller

To remove the data controller, delete the dedicated namespace in which you deployed it.


```powershell
kubectl delete ns <Name of your namespace>
```
Here is a sample output of the preceding command.


```powershell

```

  

## Next steps

- [Deploy a stateless application on your Azure Stack Edge Pro](azure-stack-edge-j-series-deploy-stateless-application-kubernetes.md).
