---
title: Configure required monitoring resources
titleSuffix: Azure Machine Learning
description: Configure the resources required to monitor generative AI applications in production.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: how-to
ms.custom: 
ms.author: wibuchan
author: buchananwp
ms.reviewer: scottpolly
ms.date: 09/01/2023
---

# Configure a monitoring connection

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

In this article, you'll learn how to configure the resources required to monitor generative AI applications in production. 
<!--- What else can we say to summarize the article? --->
In this article, you'll perform the following tasks:

- Create Azure OpenAI resource
- set up UAI
- Assign 'list' permissions
- assign permissions 


[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

- The [Azure Machine Learning SDK for Python](https://aka.ms/sdk-v2-install).

- An Azure Machine Learning workspace.
<!--- This is our standard list - what other pre-reqs are required?  --->




## IMPORTANT - API version TODO add details 
2023-03-15-preview

You will need to configure a workspace connection for your Azure OpenAI resource to have appropriate permissions. 
    1. [LINK](../how-to-configure-monitoring-connection.md)
1. Create an Azure OpenAI resource which will be used as your evaluation endpoint
1. Create your user-assigned managed identity (UAI)
    1. Assign contributor access control to your UAI
    1. You need to assign enough permission. To assign a role, you need to have owner or have Microsoft.Authorization/roleAssignments/write permission on your resource.
1. Ensure your authentication uses key-based authentication and user-assigned identity, and confirm the following access policies are configured: 

| Resource | Role / Access policy | Member | Why it's needed |
|---|---|---|---|
|TBD| `List permissions` role | TBC | List permissions.|


> [!NOTE]
> Updating connections and permissions may take several minutes to take effect. If your compute instance behind VNet, please follow [Compute instance behind VNet](https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/how-to-create-manage-runtime?view=azureml-api-2#compute-instance-behind-vnet) to configure the network.

## Next steps
<!---What next steps are appropriate?>
- 
-