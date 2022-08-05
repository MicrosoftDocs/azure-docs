---
title: Configure data loss prevention
titleSuffix: Azure Machine Learning
description: 'How to configure data loss prevention for your storage accounts.'
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 08/05/2022
---

# Azure Machine Learning data loss prevention (Preview)

Learn how to use a [Service Endpoint policy] to prevent data exfiltration from storage accounts in your Azure Virtual Network that are used by Azure Machine Learning.

An Azure Machine Learning workspace requires outbound access to `storage.<region>/*.blob.core.windows.net` on the public internet, where `<region>` is the Azure region of the workspace. This outbound access is required by Azure Machine Learning compute cluster and compute instance. Both are based on Azure Batch, and need to access a storage account provided by Azure Batch on the public network.

By using a Service 

## Prerequisites

* An Azure subscription
* An Azure Virtual Network (VNet)
* An Azure Machine Learning workspace with a private endpoint that connects to the VNet.
    * The storage account used by the workspace must also connect to the VNet using a private endpoint.

## Limitations

* Data loss prevention is not supported when using an Azure Machine Learning compute cluster or compute instance configured for __no public IP__. 

<!-- -----------------------------------------------------
Original stuff from Jumpei
----------------------------------------------------- -->
## What is Data Loss Prevention (DLP)?

AzureML has an outbound dependency to storage.reigon/*.blob.core.windows.net. This configuration increases the risk of allowing malicious users to move the data from your virtual network to other storage accounts in the same region. Current preview is for removing its dependency.

**No Public IP Compute Instance and Compute Cluster does not support DLP.**

## Steps to use DLP

## Example Architecture
![](./images/dlpsamplearchitecture.png)

## 1. Enable Your Subscription for Opt-in Preview
Submit [this form](https://forms.office.com/r/1TraBek7LV) to allowlist your subscription(s). Microsoft will contact with you when its allowlisting is finished.

**We need your batch account for this preview. Create a workspace and an compute instance before submitting a form if you have never done that with your subscription. You can delete resources immediately.**

## 2. Change You Inbound and Outbound Configurations

### Inbound Configurations
* Allow the inbound from service tag "Azure Machine Learning" (No Change)
* If you use a firewall, you need to configure UDR to make inbound communication skip your firewall. See [this doc](https://docs.microsoft.com/en-us/azure/machine-learning/how-to-secure-training-vnet?tabs=azure-studio%2Cipaddress#inbound-traffic).

Note that the inbound from service tag "Batch node management" is not required anymore.

### Outbound Configurations

#### NSG Case
* Destination port 443 over TCP to BatchNodeManagement.region 
* Destination port 443 over TCP to Storage.region (Service Endpoint Policy will narrow it down in the later step.) 

#### FW Case
* Destination port 443 to region.batch.azure.com, region.service.batch.com.
* Destination port 443 over TCP to *.blob.core.windows.net, *.queue.core.windows.net, *.table.core.windows.net (SEP will narrow it down in the later step.)

### Service Endpoint Policy Configuration

We use [service endpoint policy](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-service-endpoint-policies-overview) to narrow down the target storage accounts of the outbound to storage.region/*.blob.core.windows.net.

* Enable the storage service endpoint of your subnet has your compute
* Create a service endpoint policy with **/services/Azure/MachineLearning** alias and one storage account. At least one stroage account registration is required for a service endpoint policy. If you have a private endpoint for your default storage account attached to AzureML workspace, you do not need to include the default storage account in SEP.
* Attach your service endpoint policy to your subnet has your compute.

If you do not have storage private endpoints for Azure Machine Learning Vnet, you need to do the following.
* Add your storage accounts in your service endpoint policy that you want to allow access from your compute. At least, you need to add the default storage account attached to your AzureML workspace.

## Curated Environments
If you use curated enviornments, please make sure using the latest one and it is on Microsoft Container Registry. If the link under Azure contaier registry is mcr.microsoft.com/*, you are good to go. If the link is viennaglobal.azurecr.io/*, you cannot use it with DLP. That curated environment is on the deprecation path, or on the migration to MCR.

![curated env example](./images/curatedenv.png)

## References
* [Configure inbound and outbound network traffic](https://docs.microsoft.com/azure/machine-learning/how-to-access-azureml-behind-firewall)
* [Batch Simplified Node Communicaiton](https://docs.microsoft.com/azure/batch/simplified-compute-node-communication)


## Frequently Asked Questions
To be updated.