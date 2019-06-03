---
title: How to use Azure Kubernetes with Azure Cosmos DB 
description: Learn how to bootstrap a Kubernetes cluster on Azure that uses Azure Cosmos DB (preview)
author: SnehaGunda
ms.service: cosmos-db
ms.topic: sample
ms.date: 05/06/2019
ms.author: sngun
---

# How to use Azure Kubernetes with Azure Cosmos DB (preview)

The etcd API in Azure Cosmos DB allows you to use Azure Cosmos DB as the backend store for Azure Kubernetes. Azure Cosmos DB implements the etcd wire protocol, which allows the master node’s API servers to use Azure Cosmos DB just like it would access a locally installed etcd. etcd API in Azure Cosmos DB is currently in preview. When you use Azure Cosmos etcd API as the backing store for Kubernetes, you get the following benefits: 

* No need to manually configure and manage etcd.
* High availability of etcd, guaranteed by Cosmos (99.99% in single region, 99.999% in multiple regions).
* Elastic scalability of etcd.
* Secure by default & enterprise ready.
* Industry-leading, comprehensive SLAs.

To learn more about etcd API in Azure Cosmos DB, see the [overview](etcd-api-introduction.md) article. This article shows you how to use [Azure Kubernetes Engine](https://github.com/Azure/aks-engine/blob/master/docs/tutorials/quickstart.md) (aks-engine) to bootstrap a Kubernetes cluster on Azure that uses [Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/) instead of a locally installed and configured etcd. 

## Prerequisites

1. Install the latest version of [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest). You can download Azure CLI specific to your operating system and install.

1. Install the [latest version](https://github.com/Azure/aks-engine/releases) of Azure Kubernetes Engine. The installation instructions for different operating systems are available in [Azure Kubernetes Engine](https://github.com/Azure/aks-engine/blob/master/docs/tutorials/quickstart.md#install-aks-engine) page. You just need the steps from **Install AKS Engine** section of the linked doc. After downloading, extract the zip file.

   The Azure Kubernetes Engine (**aks-engine**) generates Azure Resource Manager templates for Kubernetes clusters on Azure. The input to aks-engine is a cluster definition file that describes the desired cluster, including orchestrator, features, and agents. The structure of the input files is similar to the public API for Azure Kubernetes Service.

1. The etcd API in Azure Cosmos DB is currently in preview. Sign up to use the preview version at: https://aka.ms/cosmosetcdapi-signup. After you submit the form, your subscription will be whitelisted to use the Azure Cosmos etcd API. 

## Deploy the cluster with Azure Cosmos DB

1. Open a command prompt window, and sign into Azure with the following command:

   ```azurecli-interactive
   az login 
   ```

1. If you have more than one subscription, switch to the subscription that has been whitelisted for Azure Cosmos DB etcd API. You can switch to the required subscription using the following command:

   ```azurecli-interactive
   az account set --subscription "<Name of your subscription>"
   ```
1. Next create a new resource group where you will deploy the resources required by the Azure Kubernetes cluster. Make sure to create the resource group in the "centralus" region. It's not mandatory for the resource group to be in "centralus" region however, Azure Cosmos etcd API is currently available to deploy in "centralus" region only. So it's best to have the Kubernetes cluster to be colocated with the Cosmos etcd instance:

   ```azurecli-interactive
   az group create --name <Name> --location "centralus"
   ```

1. Next create a service principal for the Azure Kubernetes cluster so that it can communicate with the resources that are a part of the same resource group. You can create a service principal using Azure CLI, PowerShell or Azure portal, in this example you will you CLI to create it.

   ```azurecli-interactive
   az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/<Your_Azure_subscription_ID>/resourceGroups/<Your_resource_group_name>"
   ```
   This command outputs the details of a service principal, for example:
   
   ```cmd
   Retrying role assignment creation: 1/36
   {
     "appId": "8415a4e9-4f83-46ca-a704-107457b2e3ab",
     "displayName": "azure-cli-2019-04-19-19-01-46",
     "name": "http://azure-cli-2019-04-19-19-01-46",
     "password": "102aecd3-5e37-4f3d-8738-2ac348c2e6a7",
     "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db47"
   }
   ```
   
   Make a note of the **appId** and the **password** fields, as you will use these parameters in the next steps. 

1. From the command prompt, navigate to the folder where the Azure Kubernetes Engine executable is located. For example, on your command prompt you can navigate to the folder as:

   ```cmd
   cd "\aks-engine-v0.36.3-windows-amd64\aks-engine-v0.36.3-windows-amd64"
   ```

1. Open a text editor of your choice and define a Resource Manager template that deploys the Azure Kubernetes cluster with Azure Cosmos DB etcd API. Copy the following JSON definition to your text editor and save the file as `apiModel.json`:

   ```json

   {
    "apiVersion": "vlabs",
    "properties": {
        "orchestratorProfile": {
            "orchestratorType": "Kubernetes",
            "kubernetesConfig": {
                "useManagedIdentity": false
            }
        },
        "masterProfile": {
            "count": 1,
            "dnsPrefix": "",
            "vmSize": "Standard_D2_v3",
            "cosmosEtcd": true
        },
        "agentPoolProfiles": [
            {
                "name": "agent",
                "count": 1,
                "vmSize": "Standard_D2_v3",
                "availabilityProfile": "AvailabilitySet"
            }
        ],
        "linuxProfile": {
            "adminUsername": "azureuser",
            "ssh": {
                "publicKeys": [
                    {
                        "keyData": ""
                    }
                ]
            }
        }
    }
   }
   ```

   In the JSON/cluster definition file, the key parameter to note is **"cosmosEtcd": true**. This parameter is in the "masterProfile" properties and it indicates the deployment to use Azure Cosmos etcd API instead of regular etcd. 

1. Deploy the Azure Kubernetes cluster that uses Azure Cosmos DB with the following command:

   ```cmd
   aks-engine deploy \
     --subscription-id <Your_Azure_subscription_ID> \
     --client-id <Service_ principal_appId> \
     --client-secret <Service_ principal_password> \
     --dns-prefix <Region_unique_dns_name > \
     --location centralus \
     --resource-group <Resource_Group_Name> \
     --api-model <Fully_qualified_path_to_the_template_file>  \
     --force-overwrite
   ```

   Azure Kubernetes Engine consumes a cluster definition that outlines the desired shape, size, and configuration of the Azure Kubernetes. There are several features that can be enabled through the cluster definition. In this example you will use the following parameters:

   * **subscription-id:** Azure subscription ID that has Azure Cosmos DB etcd API enabled.
   * **client-id:** The service principal's appId. The `appId` was returned as output in step 4.
   * **Client-secret:** The service principal's password or a randomly generated password. This value was returned as output in the 'password' parameter in step 4. 
   * **dnsPrefix:** A region-unique DNS name. This value will form part of the hostname (example values are- myprod1, staging).
   * **location:**  Location where the cluster should be deployed to, currently only "centralus" is supported.

   > [!Note]
   > Azure Cosmos etcd API is currently available to deploy in "centralus" region only. 
 
   * **api-model:** Fully qualified path to the template file.
   * **force-overwrite:** This option is used to automatically overwrite existing files in the output directory.
 
   The following command shows an example deployment:

   ```cmd
   aks-engine deploy \
     --subscription-id 1234fc61-1234-1234-1234-be1234d12c1b \
     --client-id 1234a4e9-4f83-46ca-a704-107457b2e3ab \
     --client-secret 123aecd3-5e37-4f3d-8738-2ac348c2e6a7 \
     --dns-prefix aks-sg-test \
     --location centralus \
     --api-model "C:\Users\demouser\Downloads\apiModel.json"  \
     --force-overwrite
   ```

## Verify the deployment

The template deployment takes several minutes to complete. After the deployment is successfully completed, you will see the following output in the commands prompt:

```cmd
WARN[0006] apimodel: missing masterProfile.dnsPrefix will use "aks-sg-test"
WARN[0006] --resource-group was not specified. Using the DNS prefix from the apimodel as the resource group name: aks-sg-test
INFO[0025] Starting ARM Deployment (aks-sg-test-546247491). This will take some time...
INFO[0587] Finished ARM Deployment (aks-sg-test-546247491). Succeeded
```

The resource group now contains resources such as- virtual machine, Azure Cosmos account(etcd API), virtual network, availability set, and other resources required by the Kubernetes cluster. 

The Azure Cosmos account’s name will match your specified DNS prefix appended with k8s. Your Azure Cosmos account will be automatically provisioned with a database named **EtcdDB** and a container named **EtcdData**. The container will store all the etcd related data. The container is provisioned with a certain number of request units and you can [scale (increase/decrease) the throughput](scaling-throughput.md) based on your workload. 

## Next steps

* Learn how to [work with Azure Cosmos database, containers, and items](databases-containers-items.md)
* Learn how to [optimize provisioned throughput costs](optimize-cost-throughput.md)

