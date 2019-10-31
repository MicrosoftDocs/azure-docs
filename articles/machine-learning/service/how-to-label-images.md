---
title: Label images in a labeling project
description: Use labeling tools to rapidly prepare data for machine learning.
author: lobrien
ms.author: laobri
ms.service: machine-learning
ms.topic: tutorial
ms.date: 11/04/2019

---

# How to tag images in a labeling project

Once your project administrator has [created a labeling project](how-to-create-labeling-projects.md) in Azure Machine Learning studio, you can use the labeling tool to rapidly prepare data for a machine learning project. 

> [!div class="checklist"]
> * Logging in to the project's labeling portal 
> * Understanding the labeling task
> * Common features of the labeling task
> * Tagging images for multi-class identification
> * Tagging images for multi-label identification
> * Tagging bounding boxes for object detection

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

Once you have signed in, you will be presented with a list of the labeling projects in which you are participating. Click on the project you wish to work and you'll be brought to project's overview page. 

The first thing you should do is **View detailed instructions**. These instructions are project-specific and should explain the type of data you're facing, how you should make your decisions, and other relevant information. When you are done, return to the project page and choose **Start labeling**.

## Common features of the labeling task

All image-labeling tasks involve choosing an appropriate tag or tags from a set specified by the project administrator. You can select among the first 9 tags by using the number keys on your keyboard.  

Image classification tasks allow you to choose to present multiple images simultaneously. These can be chosen using the icons above the images. You may select all of the displayed images simultaneously by pressing the **Select all** button or you can select individual photos using the circular selection button in the upper-right of the image's area. You must choose at least one image to apply a tag. If you have multiple images selected, selecting a tag will apply that tag to all of the selected photos.

Here, the labeler has chosen a 2x2 layout and is about to apply the tag "Mammal" to the images of the bear and orca. The image with the shark has already been tagged as "Cartilaginous fish" and the iguana has not yet been tagged.

![Multiple image layouts and selection](media/how-to-label-images/layouts.png)

> [!Important] 
> Only switch layouts when you have a fresh page of unlabeled data. Switching layouts clears the page's in-progress tagging work. 

Azure enables the **Submit** button when you have tagged all the images on the page. You must press **Submit** for your work to be saved. 

Once you have submitted tags for the data at hand, Azure will refresh the page with a new set of images from the work queue.  

## Tagging images for multi-class classification

If your project is of type "Image Classification Multi-Class," your task as a labeler is to assign a single tag to the entire image. At any time, choose the **Instructions** page and navigate to **View detailed instructions** to see project-specific guidance. 

As discussed previously, you may select from a variety of layouts for presenting images. If, after selecting an image and assigning it a tag, you realize you've made a mistake, you can fix it. If, in the label showing beneath the image, you click the `X` target, you will clear the tag. Or, if you select the image and choose another class, the tag will switch to the newly-selected value.

## Tagging images for multi-label classification

The task for projects of type "Image Classification Multi-Label" is to apply one _or more_ tags to an image. At any time, choose the **Instructions** page and navigate to **View detailed instructions** to see project-specific guidance. 

You must select the image which you desire to label and then select the tag. This applies the tag to all selected images and deselects them. To apply more tags, you must reselect the images. For instance, this animation shows all of the images being selected and "Ocean" applied, then a single image is tagged "Closeup", and three are tagged "Wide angle":

![Animation showing multilabel flow](media/how-to-label-images/multilabel.gif)

To correct a mistake, you may either click the `X` to clear individual tags or select the images, and choose the tag, which will clear the tag from all the selected images. This scenario is shown here, where clicking on "Land" will clear that tag from the two selected images.

![Screenshot showing multiple deselection](media/how-to-label-images/multiple_deselection.png)

Azure will only enable the **Submit** button after you have applied at least one tag to each image. You must press **Submit** for your work to be saved.

## Tagging images and bounding boxes for object detection

If your project is of type "Object Identification (Bounding Boxes)" then your task as a labeler is to specify one or more bounding boxes surrounding an object in the image and apply a tag to that box. Each image may have multiple bounding boxes, each with a single tag. Use **View detailed instructions** to determine if adding multiple bounding boxes is appropriate to your project.

1. Select a tag for the bounding box you wish to create
1. Select the **Rectangular box** tool ![Rectangular box tool](media/how-to-label-images/rectangular_box_tool.png) or press 'R' 
1. Click and drag diagonally across your target to create a rough bounding box
    * Adjust the bounding box by clicking and dragging the edges or corners of the box

![Screenshot of basic bounding box creation](media/how-to-label-images/bounding_box_sequence.png)

If you wish to delete the bounding box, click the X-shaped target that appears beside the bounding box after creation.

You may not reassign the tag of an existing bounding box. If you make a mistake with tag assignment, you must delete the bounding box and create a new one with the desired tag.

By default, existing bounding boxes may be edited. The **Lock/unlock regions** tool ![Lock/unlock regions tool](media/how-to-label-images/lock_bounding_boxes_tool.png) or "L" toggles that behavior. If regions are locked, you may only change the shape or location of a new bounding box.

Use the **Regions manipulation** tool ![Regions manipulation tool](media/how-to-label-images/regions_tool.png) or "M" to adjust an existing bounding box. You can click and drag on the edges or corners to adjust the shape. If you click in the interior, you can drag the whole bounding box. If you cannot edit a region, you have probably toggled the **Lock/unlock regions** state. 

Use the **Template-based box** tool ![Template-box tool](media/how-to-label-images/template_box_tool.png) or "T" to create multiple bounding boxes of the same size. If the image has no bounding boxes and you activate template-based boxes, the tool will produce 50x50 pixel boxes. If you have specified a bounding box and then activate template-based boxes, new bounding boxes will default to the size of the last bounding box you specified. Template-based boxes can be resized after placement. Resizing a template-based box only resizes the particular box. 

If you wish to delete _all_ bounding boxes in the current image, you can choose the **Delete all regions** tool ![Delete regions tool](media/how-to-label-images/delete_regions_tool.png). 

Once you have created the bounding boxes for the image at hand, press **Submit** to save your work. Your work in progress will not be saved unless you press the **Submit** button. 

## Next steps

* Learn more about [Azure Machine Learning and studio](../compare-azure-ml-to-studio-classic.md)