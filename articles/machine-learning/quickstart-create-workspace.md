---
title: "Quickstart: Create a machine learning workspace"
titleSuffix: Azure Machine Learning
description: Get started with Azure Machine Learning by creating and exploring the workspace, and add compute resources to the workspace.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: quickstart
author: sdgilley
ms.author: sgilley
ms.date: 04/15/2021
adobe-target: true
# Customer intent: As a data scientist, I want to create a workspace so that I can start to use Azure Machine Learning.
---

# Quickstart: Set up your workspace to get started with Azure Machine Learning

In this quickstart, you'll complete the steps to get started with Azure Machine Learning by creating an Azure Machine Learning workspace, then add compute resources to the workspace. 

The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create the workspace

[!INCLUDE [aml-create-portal](../../includes/aml-create-in-portal.md)]

## Explore the studio

From the portal view of your workspace, select **Launch studio** to go to the Azure Machine Learning studio. The studio is your web portal for Azure Machine Learning. This portal combines no-code and code-first experiences for an inclusive data science platform.

The **Author** section of the studio contains multiple ways to get started in creating machine learning models.  You can:

* **Notebooks** allows you to create Jupyter Notebooks, copy sample notebooks, and run notebooks and Python scripts
* **Automated ML** steps you though created a machine learning model without writing code
* **Designer** gives you a drag-and-drop way to build a model using prebuilt modules

The **Assets** section of the studio helps you keep track of the assets you create as you run your jobs.  Since this is a new workspace, there's nothing in any of these sections yet.

The **Manage** section of the studio helps you create and manage compute resources, data, and external services you link to your workspace.  You'll use this section to set up some compute resources next.

## Create compute instance

While you can install Azure Machine Learning on your own computer, you can also take advantage of an online compute resource that has a development environment already installed and ready to go.  You'll use the compute instance for your development environment, writing and running code in Python scripts or Jupyter notebooks.  You can think of it as your "local" environment, even though it is actually in the cloud.

Create a *compute instance* to use this development environment for the rest of the tutorials and quickstarts.

1. On the left side, under **Manage**, select **Compute**.
1. Select **+New** to create a new compute instance.
1. Keep all the defaults on the first page, select **Next**.
1. Supply a name and select **Create**.
 
In about two minutes, you will see the **State** of the compute instance change from *Creating* to *Running*.  It's now ready to go.  

## Create compute clusters

Next you'll create a compute cluster.  Clusters allow you to distribute a training or batch inference process across a cluster of CPU or GPU compute nodes in the cloud.

Create a compute cluster that will autoscale between zero and four nodes:

1. Still in the **Compute** section, in the top tabs, select **Compute clusters**.
1. Select **+New** to create a new compute cluster.
1. Keep all the defaults on the first page, select **Next**.
1. Name the cluster **cpu-cluster**.  If this name already exists, add your initials to the name to make it unique.
1. Leave the **Minimum number of nodes** at 0.
1. Change the **Maximum number of nodes** to 4.
1. Change the **Idle seconds before scale down** to 2400.
1. Leave the rest of the defaults, and select **Create**.

In less than a minute, the **State** of the cluster will change from *Creating* to *Succeeded*.  The list shows the provisioned compute cluster, along with the number of idle nodes, busy nodes, and unprovisioned nodes.  Since you haven't used the cluster yet, all the nodes are currently unprovisioned. 

> [!NOTE]
> When the cluster is created, it will have 0 nodes provisioned. The cluster *does not* incur costs until you submit a job. This cluster will scale down when it has been idle for 2,400 seconds (40 minutes).

## Clean up resources

[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]

If you plan to come back later to move on to another tutorial, stop the compute instance:

1. In the studio, on the left, select **Compute**.
1. In the top tabs, select **Compute instances**
1. Select the compute instance in the list.
1. On the top toolbar, select **Stop**.

## Next steps

Use these resources to get started with Azure Machine Learning in these tutorials:  

> [!div class="nextstepaction"]
> [Use Python scripts to learn more about Azure Machine Learning](tutorial-1st-experiment-hello-world.md)
>
> [Use a Jupyter notebook to train image classification models](tutorial-train-models-with-aml.md)
