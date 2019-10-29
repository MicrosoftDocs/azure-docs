---
title: Create a labeling project for machine learning
description: Create and administer a data-labeling project for machine learning.
author: lobrien
ms.author: laobri
ms.service: machine-learning
ms.topic: tutorial
ms.date: 11/04/2019

---


# How to create a labeling project for machine learning

Azure Machine Learning Studio makes it easy to create, manage, and monitor labeling projects.  Labeling large amounts of data has often been a headache in machine learning projects. ML projects with a computer vision component, such as image classification or object detection, generally require thousands of images and corresponding labels. Labeling projects coordinate the data, labels, and team members, allowing you to more efficiently manage the labeling task.

A labeling project allows you to create, administer, and monitor a labeling task. Currently supported tasks are image classification, either multi-label or multi-class, and object identification using bounded boxes. Azure maintains a queue of labeling tasks that are not yet complete. Labelers do not require an Azure account to participate. Once authenticated with their Microsoft Account (MSA) or [Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-whatis), they can do as much or as little labeling as their time allows. They can assign and change labels using keyboard shortcuts. 

You can start and stop the project, add and remove people and teams, and monitor progress. You can export labeled data in either COCO format or as an Azure ML dataset. 

In this article, you'll learn how to:

> [!div class="checklist"]
> * Create a labeling project
> * Specify data to be labeled
> * Specify your label classes
> * Describe the labeling task
> * Initialize the labeling project
> * Manage teams and people
> * Running the project
> * Communicating with the labelers
> * Exporting the labels

If you don't have a Studio account, go to the [Studio homepage](https://studio.azureml.net) and select **Sign up here** to create a free account. The free workspace will have all the features you need for this article.

## Prerequisites

* The data you wish to label, either in local files or already in Azure storage
* The set of labels you wish to apply
* Instructions for labeling
* An Azure subscription. If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today
* An Azure Machine Learning workspace. See [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

## Sign in to Azure Machine Learning Studio

Sign in to the [Azure Machine Learning Studio](https://studio.azureml.net/).

## Create a labeling project

{>> Image tk. We should have an image of the project creation wizard. That image shows not only the Data Labeling menu, but also different sections of the data labeling configuration. <<}

The **Labeling projects** page allows you to manage the people working on your projects, the teams in which those people are organized, and your data labeling projects. A project has one or more teams assigned to it, and a team has one or more people assigned to it. 

If your data are already stored in Azure blob storage, you should make them available as a datastore prior to creating your labeling project. For information, see [Create and register datastores](https://docs.microsoft.com/azure/machine-learning/service/how-to-access-data#create-and-register-datastores). 

To create a project, choose **Add project**. Give it an appropriate name and select **Project type**. 

* Choose **Image classification multi-label** for projects in which **one _or more_** labels from a set of classes may be applied to an image. For instance, a photo of a dog might be labeled with both *dog* and *daytime*
* Choose **Image classification multi-class** for projects in which only a **single class** from a set of classes may be applied to an image
* Choose **Object identification (bounding box)** for projects in which the task is to both to assign a class to an object within an image, and to specify a bounding box surrounding the object

Choose **Next** when you are ready to move on.

## Specify data to be labeled

{>> tk work here <<}
If you have already created a dataset containing your data, you can select it from the **Select an existing dataset** dropdown. Or, choose **Create a dataset** to either select an existing Azure datastore or to upload local files. 

### Create a dataset from an Azure datastore

To create 

### Create a dataset by uploading data

Although direct upload of local files is fine for many use-cases, [Azure Storage Explorer](tk) is both more robust and faster for transferring significant amounts of data. By default, uploaded data are stored in the workspace's default blob store.

If you choose **Advanced settings**, you may customize the datastore, container, and path to your data. 

Choose **Next** when you have completed this step.

## Specify your label classes

On the **Label classes** page, you specify the set of classes used to categorize your data. Give thought to these classes, as your labelers' accuracy and speed will be affected by the ease with which they can properly choose among them. For instance, rather than spelling out the full genus and species for plants or animals it might be better to use field codes or abbreviate the genus. 

Enter one label per row, using the **+** button to add a new row.

## Describe the labeling task

Clearly explaining the labeling task is important. The **Labeling instructions** page allows you to either link to an external site or to include formatted text that will be presented to labelers. Keep the instructions task-oriented and appropriate to the audience. 

* What are the labels they will see and how will they choose between them? Is there a reference text to which they should refer?
* What should they do if no label seems appropriate? 
* What should they do if multiple labels seem appropriate?
* What confidence threshold should they apply to a label? Do you want their "best guess" if they are not certain?
* What should they do with partially occluded or overlapping objects of interest?
* What should they do if an object of interest is clipped by the edge of the image?
* What should they do if they feel they've made a mistake with an image after submitting it? 

With bounding boxes, other important questions include:

* How is the bounding box defined for this task? Should it be entirely interior to the object, cropped as closely as possible to its extent, or is some amount of clearance acceptable? 
* What level of care and consistency do you expect the labeler to apply to defining bounding boxes?

>[!Note]
> Be sure to say that the labeler will be able to choose among the first 10 labels with number keys 0-9. The number 0 applies the 10th label. 

## Initialize the labeling project

Once initialized, the labeling project is largely immutable: you cannot change the task type, dataset, labels, or task description. Carefully review the settings before creating the project. Once you have submitted the project, you'll be taken back to the **Labeling** homepage, which will show the project as **Initializing**. This page does not autorefresh, so after some amount of time, manually refreshing it will show the project as **Created**.

## Manage teams and people

A labeling project gets a default team and adds you as a default member. Each labeling project gets a new default team, but teams can be shared between projects. Projects may have more than one team. Creating a team is done by choosing **Add team** on the **Teams** page. 

People are managed on the **People** page. You can add and remove people keyed on their email address. Each labeler will have to authenticate using either their Microsoft Account or, if they're within your organization and you use it, Azure Active Directory.  

Once you've added a person, you can assign them to one or more teams. Navigate to the **Teams** page, select the particular team in which you're interested, and then use **Assign people** or **Remove people** as desired.

## Next steps

Learn more about Azure Machine Learning studio at [this article](tk).

> [!div class="nextstepaction"]
> [Next steps button](tk)

