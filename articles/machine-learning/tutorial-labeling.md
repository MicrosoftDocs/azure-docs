---
title: "Tutorial: Create a labeling project for image classification"
titleSuffix: Azure Machine Learning
description: Learn how to manage the process of labeling images so they can be used in multi-class image classification models.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
ms.author: sgilley
author: sdgilley
ms.reviewer: ranku
ms.date: 01/15/2020

# Customer intent: As a project administrator, I want to manage the process of tagging images so they can be used in machine learning models.
---

# Tutorial: Create a labeling project for image classification
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

This tutorial shows you how an Azure Machine Learning labeling project helps you manage the process of labeling (also referred to as tagging) images to use as data for building machine learning models.  

If you want to train a machine learning model to classify images, you need hundreds or even thousands of images that are correctly labeled.  Azure Machine Learning helps you manage the progress of your private team of domain experts as they label your data.
 
In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create an Azure storage account and upload images to the account.
> * Create an Azure Machine Learning workspace.
> * Create an image labeling project
> * Label your data.  Either you or your labelers can perform this task.
> * Complete the project by reviewing and exporting the data.

## Prerequisites

* An Azure subscription. If you don’t have an Azure subscription, create a [free account](https://aka.ms/AMLFree).

* Images to label.  Use your own images or download these [images of cats and dogs]().  


## Create a workspace

An Azure Machine Learning workspace is a foundational resource in the cloud that you use to experiment, train, and deploy machine learning models. It ties your Azure subscription and resource group to an easily consumed object in the service.

You create a workspace via the Azure portal, a web-based console for managing your Azure resources.

[!INCLUDE [aml-create-portal](../../includes/aml-create-in-portal.md)]

## Create a storage account

You store your image files in a container in a storage account.  You already have a storage account included in your workspace, but here you'll create a new one to use just for your data.  

1. In the upper-left corner of Azure portal, select the menu icon.

1. select **+ Create a resource**.

    ![Create a new resource](media/tutorial-labeling/create-resource.png)

1. Use the search bar to find **Storage account**.

1. Select **Storage account - blob, file, table, queue**.

1. In the **Storage account - blob, file, table, queue** pane, select **Create** to begin.

1. Provide the following information to configure your new workspace:

   Field|Description 
   ---|---
   Subscription |Select the same Azure subscription you used above to create your workspace.
   Resource group | For convenience, use the same resource group you just created for your workspace, **docs-aml**. 
   Storage account name | The name you pick must be unique across all existing storage account names in Azure.  Try including your initials or some other unique letters to help create the name.  Here we'll use **tutorialstorage**.
   Location | Select the location closest to your users and the data resources to create your workspace.
    Performance | Leave the default **Standard** selected.

1. After you're finished configuring the account, select **Review + Create**.

1. Select **Create**.

   > [!Warning] 
   > It can take several minutes to create your workspace in the cloud.

   When the process is finished, a deployment success message appears. 
 
 1. Select **Go to resource**.

### Copy access key

The access key for this storage account is used to associate the account with your workspace.  Copy a key now. You'll use it to create a datastore within your workspace in a few moments.

1. Select **Access keys** on the left of your storage account page in Azure portal.

1. Copy one of the keys.  

### Upload images

Now add your data files to the storage account.  

1. On the left, select **Overview** to go back to the storage account overview.

1. In the middle of the page, select **Containers**.

    ![Select containers](media/tutorial-labeling/select-containers.png)

1. Select **+ Container** to create a new container.

1. Give the container a name, here we'll use **tutorial-images**.

1. Select **OK**.

1. Select the container name in the table to open it.

1. Select **Upload**.  

1. Select the folder icon to find your files.  Select all the images you downloaded as part of the [Prerequisites](#prerequisites).

1. Select **Upload** to add all your images to the storage account.  


## Start a labeling project

You now have an Azure Machine Learning workspace, and the image files you want to label stored in an Azure Storage container.

Next you will manage the data labeling project in Azure Machine Learning studio, a consolidated interface that includes machine learning tools to perform data science scenarios for data science practitioners of all skill levels. The studio is not supported on Internet Explorer browsers.

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com).

1. Select your subscription and the workspace you created.

### Create a datastore

Azure Machine Learning datastores are used to store connection information, like your subscription ID and token authorization. Here you use a datastore to connect to the storage account where your image file are located.

1. On the left side of your workspace, select **Datastores**.

1. Select **+ New datastore**.

1. Fill out the form with these settings:

    Field|Description 
    ---|---
    Datastore name | Give the datastore a name.  Here we use **labeling_tutorial**.
    Datastore type | Select the type of storage.  Here we use **Azure Blob Storage**, the preferred storage for images.
    Account selection method | Select **From Azure subscription**.
    Subscription ID | Select your subscription ID from the list.
    Storage account | Select the storage account created above, for example, **tutorialstorage (docs-ws)**.
    Blob container |  Select the blob container name created above, for example, **tutorial-images**
    Authentication type | Select **Account key**.
    Account key | Paste the key you copied above when you created the storage account.

1. Select **Create** to create the datastore.

### Add labelers to workspace

Set up your workspace to include all the people who will label data for any of your projects.  Later you'll add these labelers to your specific labeling project.

1. On the left side, select **Data labeling**.

1. At the top of the page, select **Labelers**.

1. Select **Add labeler** to add the email address of a labeler.

1. Continue to add more labelers until you're done.

### Create a labeling project

Now that you have your list of labelers and access to the data you want to have labeled, create your labeling project.

1. At the top of the page, select **Projects**.

1. Select **+ Add project**.

    ![Create a project](media/tutorial-labeling/create-project.png)

### Project details

1. Use the following input for the **Project details** form:

    Field|Description 
    ---|---
    Project name | Give your project a name.  Here we'll use **tutorial-cats-n-dogs**.
    Labeling task type | Select **Image Classification Multi-class**.  
    
    Select **Next** to continue creating the project.

### Select or create a dataset

1.   On the **Select or create a dataset** form, select the second choice, **Create a dataset**, then select the link **From datastore**.

1. Use the following input for the **Create dataset from datastore** form:

    Field|Description 
    ---|---
    Name | Give the dataset a name, here we'll use **images-for-tutorial**.
    Dataset type | Select **File** as the type, since each of your images is a file.
    Datastore | Select the datastore from the list, for example **tutorial_images (Azure Blob Storage)
    Path | Select **Browse** and verify that your images appear.  Select **Save** to use **/** as the path.
    Description | Add a description here, for example, **Image files for the tutorial.**

    Select **Next** to confirm details and then **Create** to create the dataset.


1. Select **Next** to continue creating the project.

### Label classes

1. On the **Label classes** form, type a label name, then select **+Add label** to type the next label.  For this project, the labels are **Cat**, **Dog**, and **Uncertain**.

1. Select **Next** when have added all the labels.

### Labeling instructions

1. On the **Labeling instructions** form, you can provide a link to a website that provides detailed instructions for your labelers.  We'll leave it blank for this tutorial.

1. You can also add a short description of the task directly on the form.  Type **Labeling tutorial - Cats & Dogs.**

1. Select **Create project**.

This page doesn't automatically refresh. After a pause, manually refresh the page until the project's status changes to **Created**.

### Add labelers to your project

Add some or all of your labelers to this project.

1. Select the project name to open the project.  

1. At the top of the page, select **Teams**.

1. Select the **labeling_tutorial Default Team** link.

1. Now use **Assign labelers** to add the labelers you want to participate in this project. 

1. Select from the list of labelers you created earlier.  Once you've selected all the labelers you wish to use, select **Assign labelers** to add them to your default project team.

## Start labeling

You have now set up your Azure resources, and configured a data labeling project. It's time to add labels to your data.

### Notify labelers

If you have lots of images to label, hopefully you also have lots of labelers to complete the task.  You'll now want to send them instructions so they can access the data and start labeling.

1. In [Machine Learning studio](https://ml.azure.com), select **Data labeling** on the left-hand side to find your project.  

1. Select the project name link.

1. At the top of the page, select **Details**.  You see a summary of your project.

    ![Project details](media/tutorial-labeling/project-details.png)

1. Copy the **Labeling portal URL** link to send to your labelers.

1. Now select **Team** at the top to find your labeling team.  

1. Select the team name link.

1. At the top of the page, select **Email team** to start your email.  Paste in the labeling portal URL you just copied.  

Each time a labeler goes to the portal URL, they'll be presented with more images to label, until the queue is empty.  

### Tag the images

In this part of the tutorial, you'll switch roles from the *project administrator* to that of a *labeler*.  Use the URL you sent to the team.  This URL brings you to the labeling portal for your project.  If you had added instructions, you'd see them here when you arrive on the page.

1. At the top of the page, select **Tasks** to start labeling.

1. Select a thumbnail image on the right to display the number of images you wish to label in one go. You must label all these images before you can move on. Only switch layouts when you have a fresh page of unlabeled data. Switching layouts clears the page's in-progress tagging work.

1. Select one or more images, then select a tag to apply to the selection. The tag appears below the image.  Continue to select and tag all images on the page.  To select all the displayed images simultaneously, select **Select all**. Select at least one image to apply a tag.


    > [!TIP]
    > You can select the first nine tags by using the number keys on your keyboard.

1. Once all the images on the page are tagged, select **Submit** to submit these labels.

    ![Tagging images](media/tutorial-labeling/catsndogs.gif)

1. After you submit tags for the data at hand, Azure refreshes the page with a new set of images from the work queue.

## Complete the project

Now you'll switch roles back to the *project administrator* for the labeling project.

As a manager, you may want to review the work of your labeler.  

### Review labeled data

1. In [Machine Learning studio](https://ml.azure.com), select **Data labeling** on the left-hand side to find your project.  

1. Select the project name link.

1. The Dashboard shows you the progress of your project.

1. At the top of the page, select **Data**.

1. On the left side, select **Labeled data** to see your tagged images.  

1. When you disagree with a label, select the image and then select **Reject** at the bottom of the page.  The tags will be removed and the image is put back in the queue of unlabeled images.

### Export labeled data

You can export the label data for Machine Learning experimentation at any time. Users often export multiple times and train different models, rather than wait for all the images to be labeled.

Image labels can be exported in [COCO format](http://cocodataset.org/#format-data) or as an Azure Machine Learning dataset. The dataset format makes it easy to use for training in Azure Machine Learning.  

1. In [Machine Learning studio](https://ml.azure.com), select **Data labeling** on the left-hand side to find your project.  

1. Select the project name link.

1. Select **Export** and choose **Export as Azure ML Dataset**. 

    The status of the export appears just below the **Export** button. 

1. Once the labels are successfully exported, select **Datasets** on the left side to view the results.

## Clean up resources


[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]

## Next steps

In this tutorial, you labeled images.  Now use your labeled data:

> [!div class="nextstepaction"]
> [Train a machine learning image recognition model](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/work-with-data/datasets-tutorial/labeled-datasets/labeled-datasets.ipynb).
