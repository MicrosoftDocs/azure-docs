---
title: Label images in a labeling project
description: Use labeling tools to rapidly prepare data for machine learning.
author: lobrien
ms.author: laobri
ms.service: machine-learning
ms.topic: tutorial
ms.date: 11/04/2019

---

# How to label images in a labeling project

Once your project administrator has [created a labeling project](how-to-create-labeling-projects.md) in Azure Machine Learning studio, you can use the labeling tool to rapidly prepare data for a machine learning project. 

> [!div class="checklist"]
> * Logging in to the project's labeling portal 
> * Understanding the labeling task
> * Common features of the labeling task
> * Labeling images for multi-class identification
> * Labeling images for multi-label identification
> * Labeling images and bounding boxes for object detection
> * tk

## Prerequisites

* The labeling portal URL for a running [data labeling project](how-to-create-labeling-projects.md)
* A [Microsoft Account](https://account.microsoft.com/account) or
* An Azure Active Directory account for the organization and project

> [!Note]
> The project administrator can find the labeling portal URL at **Project details** **Details**. 

## Logging in to the project's labeling portal

Go to the labeling portal URL provided to you by the project administrator. 

Log in using the email account the administrator used to add you to the team. For most users, this will be using your Microsoft account. If the labeling project uses Azure Active Directory, that's how you should log in. 

## Understanding the labeling task

Once you have signed in, you will be presented with a list of the labeling projects in which you are participating. Click on the project you wish to work and you'll be brought to project's overview view. 

The first thing you should do is **View detailed instructions**. These instructions are project-specific and should explain the type of data you're facing, how you should make your decisions, and other relevant information. When you are done, return to the project page and choose **Start labeling**.

## Common features of the labeling task

All image-labeling tasks involve choosing an appropriate class or classes from a set specified by the project administrator. You can select among the first 9 classes by using the number keys on your keyboard.  

Image classification tasks allow you to choose to present multiple images simultaneously. These can be chosen using the icons above the images. You may select all of the displayed images simultaneously by pressing the **Select all** button or you can select individual photos using the circular selection button in the upper-right of the image's area. You must choose at least one image to apply a label. If you have multiple images selected, selecting a label will apply that class to all of the selected photos.

Here, the labeler has chosen a 2x2 layout and is about to apply the class label "Mammal" to the images of the bear and orca. The image with the shark has already been classified as "Cartilaginous fish" and the iguana has not yet been labeled.

![Multiple image layouts and selection](tk)

Azure enables the **Submit** button when you have labeled all the images on the page. You must press **Submit** for your work to be saved. 

{>> tk If you change layouts without submitting, you'll lose your labels if you return <<}

Once you have submitted labels for the data at hand, Azure will refresh the page with a new set of images from the work queue.  

## Labeling images for multi-class classification

If your project is of type "Image Classification Multi-Class," your task as a labeler is to assign a single class to the entire image. At any time, choose the **Instructions** page and navigate to **View detailed instructions** to see project-specific guidance. 

As discussed previously, you may select from a variety of layouts for presenting images. If, after selecting an image and assigning it a class, you realize you've made a mistake, you can fix it. If, in the label showing beneath the image, you click the `X` target, you will clear the label. Or, if you select the image and choose another class, the label will switch to the newly-selected value.

## Labeling images for multi-label classification

The task for projects of type "Image Classification Multi-Label" is to apply one _or more_ labels to an image. At any time, choose the **Instructions** page and navigate to **View detailed instructions** to see project-specific guidance. 

You must select the image which you desire to label and then select the class. This applies the label to all selected images and deselects them. To apply more labels, you must reselect the images. 

To correct a mistake, you may either click the `X` to clear individual labels or select the images, and choose the label, which will clear the label from all the selected images. This scenario is shown here, where clicking on "Land" will clear that label from the two selected images.

![Screenshot showing multiple deselection](tk)

Azure will only enable the **Submit** button after you have applied at least one label to each image. You must press **Submit** for your work to be saved.

## Labeling images and bounding boxes for object detection

If your project is of type "Object Identification (Bounding Boxes)" then your task as a labeler is to specify one or more bounding boxes surrounding an object in the image and apply a label to that box. The labeling tool supports multiple bounding boxes, each with a single label, per image. Use **View detailed instructions** to determine if adding multiple bounding boxes is appropriate to your project.

1. Select a class for the bounding box you wish to create
1. Select the **Rectangular box** tool or press 'R' 
1. Click and drag diagonally across your target to create a rough bounding box
    * Adjust the bounding box by clicking and dragging the edges or corners of the box

If you wish to delete the bounding box, click the X-shaped target that appears beside the bounding box after creation.

You may not reassign the class of an existing bounding box. If you make a mistake with class assignment, you must delete the bounding box and create a new one with the desired class.

Use the **Regions manipulation** tool ![tk](tk) or "M" to adjust an existing bounding box. You can click and drag on the edges or corners to adjust the shape. If you click in the interior, you can drag the whole bounding box. 

Use the **Template-based box** tool ![tk](tk) or "T" to tk

If you wish to delete _all_ bounding boxes in the current image, you can choose the **Delete all regions** tool ![tk](tk). 

By default, existing bounding boxes may be edited. The **Lock/unlock regions** tool or "L" toggles that behavior. If regions are locked, you may only change the shape or location of a new bounding box.

Once you have created the bounding boxes for the image at hand, press **Submit** to save your work. Your work in progress will not be saved unless you press the **Submit** button. 

## Next steps

* Learn more about [Azure Machine Learning and studio](../compare-azure-ml-to-studio-classic.md)