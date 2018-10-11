---
title: Deploy Kubernetes to Azure Government | Microsoft Docs
description: This article describes how to deploy Kubernetes to Azure Government using acs-engine.
services: azure-government
cloud: gov
documentationcenter: ''
author: gsacavdm
manager: pathuff

ms.assetid: 8f9a3700-b9ee-43b7-b64d-2e6c3b57d4c0
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 03/11/2018
ms.author: gsacavdm

---

# Kubernetes on Azure Government
This article describes how to deploy a Kubernetes cluster to Azure Government using acs-engine.

## Prerequisites
* Download [acs-engine](https://github.com/Azure/acs-engine/releases). Make sure you download **release v.0.14.0 or greater**, previous versions don't work properly with Azure Government.
* Download [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

## Define your Kubernetes cluster configuration
1. Download the sample acs-engine `apimodel.json` [for Kubernetes 1.8](https://raw.githubusercontent.com/Azure/acs-engine/master/examples/kubernetes-releases/kubernetes1.8.json).

    > [!NOTE]
    > Only use Kubernetes version 1.8 or greater to if you intend to use Azure Files with Azure Government.
    >
    >

1. Modify the following values in your `apimodel.json` file:
    * `dnsPrefix`: The dns name you want for the cluster. For example, `contoso` will result in `https://contoso.usgovvirginia.cloudapp.usgovcloudapi.net`
    * `keyData`: The public SSH key to SSH into the Kubernetes cluster. See [How to create and use an SSH public and private key pair for Linux VMs in Azure](../virtual-machines/linux/mac-create-ssh-keys.md).
    * `clientId` and `secret`: The client ID and secret for the Azure AD service principal that Kubernetes uses to communicate with Azure Government (for example, to create load balancers, request public IPs and access Azure storage). 
    
        > [!NOTE]
        > Make sure this service principal is set up with the correct scope. See [ACS-Engine: Service Principals](https://github.com/Azure/acs-engine/blob/master/docs/serviceprincipal.md).
        >

## Deploy your Kubernetes cluster using acs-engine
1. Obtain your Subscription ID. The subscription ID is available in the Azure portal, via Powershell and via the Azure CLI:

    Via Azure CLI:

    ```bash
    az cloud set --n AzureUSGovernment
    az login
    az account list
    ```

1. Use acs-engine to deploy your template to Azure Government. This operation takes up to 30 minutes for three nodes.

    ```bash
    acs-engine deploy --azure-env AzureUSGovernmentCloud --location usgovvirginia --subscription-id <YOUR_SUBSCRIPTION_ID> --api-model apimodel.json
    ```

## Connect to your Kubernetes cluster
1. Configure your kubectl context. This configuration is per bash session. You'll need to run this command for every session:

    ```bash
    export KUBECONFIG=$(pwd)/_output/<DNS-PREFIX>/kubeconfig/kubeconfig.usgovvirginia.json
    ```

    Alternatively, you can replace your kubectl config file for your configuration to persist across sessions. 
    
    > [!WARNING]
    > Any existing configurations will be replaced.
    >
    >

    ```bash
    cp $(pwd)/_output/<DNS-PREFIX>/kubeconfig/kubeconfig.usgovvirginia.json ~/.kube/config
    ```

1. Test your kubectl connectivity with the cluster

    ```bash
    kubectl get pods
    ```
1. (Optional) [Deploy a PHP Guestbook application with Redis in your Kubernetes cluster](https://kubernetes.io/docs/tutorials/stateless-application/guestbook/)

### References
* [Microsoft Azure Container Service Engine - Kubernetes](https://github.com/Azure/acs-engine/blob/master/docs/kubernetes.md)
* [Configure Access to Multiple Clusters](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable)

## Next steps

* Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/)
* Get help on Stack Overflow by using the "[azure-gov](https://stackoverflow.com/questions/tagged/azure-gov)" tag
* Give feedback or request new features via the [Azure Government feedback forum](https://feedback.azure.com/forums/558487-azure-government)
