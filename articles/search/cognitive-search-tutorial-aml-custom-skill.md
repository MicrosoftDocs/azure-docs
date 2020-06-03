---
title: "Tutorial: Create and deploy a custom skill with Azure Machine Learning"
description: This tutorial demonstrates how to use Azure Machine Learning to build and deploy a custom skill for Azure Cognitive Search's AI enrichment pipeline.
author: tchristiani
ms.author: terrychr
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 06/XX/2020
---

# Tutorial: Build and deploy a custom skill with Azure Machine Learning 

In this tutorial, you will use the (hotel reviews dataset)[https://www.kaggle.com/datafiniti/hotel-reviews] (distributed under the Creative Commons license [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.txt)) to create a custom skill using Azure Machine Learning to extract aspect-based sentiment from the reviews. This allows for the assignment of positive and negative sentiment within the same review to be correctly ascribed to identified entities like staff, room, lobby, or pool.

To train the aspect-based sentiment model, you will be using the [nlp recipes repository](https://github.com/microsoft/nlp-recipes/tree/master/examples/sentiment_analysis/absa). The model will then be deployed as an endpoint on an Azure Kubernetes cluster. Once deployed, the model is added to the enrichment pipeline as a custom skill for use by the Cognitive Search service.

There are two datasets provided. If you wish to train the model yourself, the hotel_reviews_1000.csv file is required. Prefer to skip the training step? Download the hotel_reviews_100.csv.

> [!div class="checklist"]
> * Create an Azure Cognitive Search instance
> * Create an Azure Machine Learning workspace
> * Train and deploy a model to an Azure Kubernetes cluster
> * Link an AI enrichment pipeline to the deployed model
> * Ingest output from deployed model as a custom skill

## Prerequisites

* Azure subscription - get a [free subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Cognitive Search service](https://docs.microsoft.com/azure/search/search-get-started-arm)
* [Cognitive Services resource](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account?tabs=multiservice%2Cwindows)
* [Azure Storage account](https://docs.microsoft.com/azure/storage/common/storage-account-create?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&tabs=azure-portal)
* [Azure Machine Learning workspace](https://docs.microsoft.com/azure/machine-learning/how-to-manage-workspace)

## Setup

* Clone or download the contents of [the sample repository](this is a placeholder).
* Extract contents if the download is a zip file. Make sure the files are read-write.
* While setting up the Azure accounts and services, copy the names and keys to an easily accessed text file. The names and keys will be added to the first cell in the notebook where variables for accessing the Azure services are defined.
* If you are unfamiliar with Azure Machine Learning and its requirements, you will want to review these documents before getting started:
 * [Configure a development environment for Azure Machine Learning](https://docs.microsoft.com/azure/machine-learning/how-to-configure-environment)
 * [Create and manage Azure Machine Learning workspaces in the Azure portal](https://docs.microsoft.com/azure/machine-learning/how-to-manage-workspace)
 * When configuring the development environment for Azure Machine Learning, consider using the [cloud-based compute instance](https://docs.microsoft.com/azure/machine-learning/how-to-configure-environment#compute-instance) for speed and ease in getting started.
* Upload the dataset file to a container in the storage account. The larger file is necessary if you wish to perform the training step in the notebook. If you prefer to skip the training step, the smaller file is recommended.

## Open notebook and connect to Azure services

1. Step 1 of the procedure
1. Step 2 of the procedure
1. Step 3 of the procedure
   ![Browser](media/contribute-how-to-mvc-tutorial/browser.png)
   <!---Use screenshots but be judicious to maintain a reasonable length. 
   Make sure screenshots align to the
   [current standards](https://review.docs.microsoft.com/help/contribute/contribute-how-to-create-screenshot?branch=master).
   If users access your product/service via a web browser the first 
   screenshot should always include the full browser window in Chrome or
   Safari. This is to show users that the portal is browser-based - OS 
   and browser agnostic.--->
1. Step 4 of the procedure

## Procedure 2

Include a sentence or two to explain only what is needed to complete the procedure.

1. Step 1 of the procedure
1. Step 2 of the procedure
1. Step 3 of the procedure

## Procedure 3

Include a sentence or two to explain only what is needed to complete the
procedure.
<!---Code requires specific formatting. Here are a few useful examples of
commonly used code blocks. Make sure to use the interactive functionality
where possible.

For the CLI or PowerShell based procedures, don't use bullets or
numbering.
--->

Here is an example of a code block for Java:

```java
cluster = Cluster.build(new File("src/remote.yaml")).create();
...
client = cluster.connect();
```

or a code block for Azure CLI:

```azurecli-interactive 
az vm create --resource-group myResourceGroup --name myVM --image win2016datacenter --admin-username azureuser --admin-password myPassword12
```

or a code block for Azure PowerShell:

```azurepowershell-interactive
New-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer -Image microsoft/iis:nanoserver -OsType Windows -IpAddressType Public
```


## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
2. ...click Delete, type...and then click Delete

<!---Required:
To avoid any costs associated with following the tutorial procedure, a
Clean up resources (H2) should come just before Next steps (H2)
--->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-get-started-mvc.md)

<!--- Required:
Tutorials should always have a Next steps H2 that points to the next
logical tutorial in a series, or, if there are no other tutorials, to
some other cool thing the customer can do. A single link in the blue box
format should direct the customer to the next article - and you can
shorten the title in the boxes if the original one doesn’t fit.
Do not use a "More info section" or a "Resources section" or a "See also
section". --->