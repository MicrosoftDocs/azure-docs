---
title: Train and deploy a machine learning model in a virtual network with the designer.
titleSuffix: Azure Machine Learning
description: Use the designer to train and deploy models in a virtual network.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to

ms.author: peterlu
author: peterclu
ms.date: 11/12/2020
ms.custom: designer


---

# Train and deploy machine learning models with the designer in a virtual network

In this article, you learn how to use the designer to train and deploy a model from inside of a virtual network (VNet). By default, virtual networks disable critical designer features. Learn how to configure your workspace to enable full designer functionality.

For a beginner designer tutorial, without virtual networks, see [Tutorial: Predict car prices with the designer](tutorial-designer-automobile-price-train-score.md).

In this article you learn how to:

> [!div class="checklist"]
> - Grant the studio access to datastores.
> - Use intermediate storage in designer pipelines.
> - Deploy a model from inside of a virtual network.

## Prerequisites

+ A workspace configured to use virtual networks. For more information, see [Network security overview](how-to-network-security-overview.md).

+ An Azure Machine Learning [compute instance or compute cluster added to the virtual network](how-to-secure-training-vnet.md) for training.

+ An [Azure Kubernetes Service (AKS) cluster added to the virtual network](how-to-secure-inferencing-vnet.md) for deployment.


## Grant studio access to datastores

To fully enable the designer in a virtual network, you must configure relevant datastores to use MSI authentication. Otherwise, you will see errors when you try and visualize or preview data.

> [!NOTE]
> You can still run designer pipelines on datastores with MSI authentication disabled. However, you cannot preview or visualize data from those datastores, which can make it difficult to author and troubleshoot pipelines.

You should enable MSI authentication for any datastore that you want to visualize in the designer:

1. In the studio, select __Datastores__.

1. To create a new datastore, select __+ New datastore__.

    To update an existing datastore, select the datastore and select __Update credentials__.

1. In the datastore settings, select __Yes__ for  __Allow Azure Machine Learning service to access the storage using workspace-managed identity__.

These steps add the workspace-managed identity as a __Reader__ to the storage service using Azure RBAC. __Reader__ access lets the workspace retrieve firewall settings to ensure that data doesn't leave the virtual network. Changes may take up to 10 minutes to take effect.

### 

### Grant workspace managed identity __Reader__ access to storage private link

If your Azure storage account uses a private endpoint, you must grant the workspace-managed identity **Reader** access to the private link. For more information, see the [Reader](../role-based-access-control/built-in-roles.md#reader) built-in role. 

If your storage account uses a service endpoint, you can skip this step.

## Use intermediate storage

You can specify the output location for any module in the designer. This can be useful to store intermediate datasets in separate locations for security, logging, or auditing purposes. To specify output:

1. Select the module whose output you'd like to specify.
1. In the module settings pane that appears to the right, select **Output settings**.
1. Specify the datastore you want to use for each module output.
 
Make sure that you have access to the intermediate storage accounts in your virtual network. Otherwise, the pipeline will fail.

You should also [enable MSI authentication to visualize output data](#enable-studio-data-visualization-access-to-datastores) for intermediate storage accounts.

## Deploy a model in a virtual network

To deploy a model in a virtual network in the designer, you must [enable MSI authentication](#enable-studio-data-visualization-access-to-datastores) for your workspace default storage account. The default blob storage account contains model artifacts required for deployment. Although you can  successfully train your model without using the default storage account, you must use it for deployment.

## Next steps

This article is an optional part of a four-part virtual network series. See the rest of the articles to learn how to secure a virtual network:

* [Part 1: Virtual network overview](how-to-network-security-overview.md)
* [Part 2: Secure the workspace resources](how-to-secure-workspace-vnet.md)
* [Part 3: Secure the training environment](how-to-secure-training-vnet.md)
* [Part 4: Secure the inferencing environment](how-to-secure-inferencing-vnet.md)