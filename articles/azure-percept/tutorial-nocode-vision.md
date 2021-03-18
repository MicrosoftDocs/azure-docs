---
title: Create a no-code vision solution in Azure Percept Studio
description: Learn how to create a no-code vision solution in Azure Percept Studio and deploy it to your Azure Percept DK
author: elqu20
ms.author: v-elqu
ms.service: azure-percept
ms.topic: tutorial
ms.date: 02/10/2021
ms.custom: template-tutorial
---

# Create a no-code vision solution in Azure Percept Studio

Azure Percept Studio enables you to build and deploy custom computer vision solutions, no coding required. In this article, you will:

- Create a vision project in [Azure Percept Studio](https://go.microsoft.com/fwlink/?linkid=2135819)
- Collect training images with your devkit
- Label your training images in [Custom Vision](https://www.customvision.ai/)
- Train your custom object detection or classification model
- Deploy your model to your devkit
- Improve your model by setting up retraining

This tutorial is suitable for developers with little to no AI experience and those just getting started with Azure Percept.

## Prerequisites

- Azure Percept DK (devkit)
- [Azure subscription](https://azure.microsoft.com/free/)
- Azure Percept DK setup experience: you connected your devkit to a Wi-Fi network, created an IoT Hub, and connected your devkit to the IoT Hub

## Create a vision prototype

1. Start your browser and go to [Azure Percept Studio](https://go.microsoft.com/fwlink/?linkid=2135819).

1. On the overview page, click the **Demos & tutorials** tab.
    :::image type="content" source="./media/tutorial-nocode-vision/percept-studio-overview-inline.png" alt-text="Azure Percept Studio overview screen." lightbox="./media/tutorial-nocode-vision/percept-studio-overview.png":::

1. Under **Vision tutorials and demos**, click **Create a vision prototype**.

    :::image type="content" source="./media/tutorial-nocode-vision/vision-tutorials-and-demos-inline.png" alt-text="Azure Percept Studio demos and tutorials screen." lightbox="./media/tutorial-nocode-vision/vision-tutorials-and-demos.png":::

1. On the **New Azure Percept Custom Vision prototype** page, do the following:

    1. In the **Project name** box, enter a name for your vision prototype.

    1. Enter a description of the vision prototype in the **Project description** box.

    1. Select **Azure Percept DK** under the **Device type** drop-down menu.

    1. Select a resource under the **Resource** drop-down menu or click **Create a new resource**. If you elect to create a new resource, do the following in the **Create** window:
        1. Enter a name for your new resource.
        1. Select your Azure subscription.
        1. Select a resource group or create a new one.
        1. Select your preferred region.
        1. Select your pricing tier (we recommend S0).
        1. Click **Create** at the bottom of the window.

        :::image type="content" source="./media/tutorial-nocode-vision/create-resource.png" alt-text="Create resource window.":::

    1. For **Project type**, choose whether your vision project will perform object detection or image classification. For more information on the project types, click **Help me choose**.

    1. For **Optimization**, select whether you want to optimize your project for accuracy, low network latency, or a balance of both.

    1. Click the **Create** button.

        :::image type="content" source="./media/tutorial-nocode-vision/create-prototype.png" alt-text="Create custom vision prototype screen.":::

## Connect a device to your project and capture images

After creating a vision solution, you must add your devkit and its corresponding IoT Hub to it.

1. Power on your devkit.

1. In the **IoT Hub** dropdown menu, select the IoT hub that your devkit was connected to during the OOBE.

1. In the **Devices** dropdown menu, select your devkit.

Next, you must either load images or capture images for training your AI model. We recommended uploading at least 30 images per tag type. For example, if you want to build a dog and cat detector, you must upload at least 30 images of dogs and 30 images of cats. To capture images with the vision SoM of your devkit, do the following:

1. In the **Image capture** window, select **View device stream** to view the vision SoM video stream.

1. Check the video stream to ensure that your vision SoM camera is correctly aligned to take the training pictures. Make adjustments as necessary.

1. In the **Image capture** window, click **Take photo**.

    :::image type="content" source="./media/tutorial-nocode-vision/image-capture.png" alt-text="Image capture screen.":::

1. Alternatively, set up an automated image capture to collect a large quantity of images at a time by checking the **Automatic image capture** box. Select your preferred imaging rate under **Capture rate** and the total number of images you would like to collect under **Target**. Click **Set automatic capture** to begin the automatic image capture process.

    :::image type="content" source="./media/tutorial-nocode-vision/image-capture-auto.png" alt-text="Automatic image capture dropdown menu.":::

When you have enough photos, click **Next: Tag images and model training** at the bottom of the screen. All images will be saved in [Custom Vision](https://www.customvision.ai/).

> [!NOTE]
> If you elect to upload training images directly to Custom Vision, please note that image file size cannot exceed 6MB.

## Tag images and train your model

Before training your model, add labels to your images.

1. On the **Tag images and model training** page, click **Open project in Custom Vision**.

1. On the left-hand side of the **Custom Vision** page, click **Untagged** under **Tags** to view the images you just collected in the previous step. Select one or more of your untagged images.

1. In the **Image Detail** window, click on the image to begin tagging. If you selected object detection as your project type, you must also draw a [bounding box](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/get-started-build-detector#upload-and-tag-images) around specific objects you would like to tag. Adjust the bounding box as needed. Type your object tag and click **+** to apply the tag. For example, if you were creating a vision solution that would notify you when a store shelf needs restocking, add the tag "Empty Shelf" to images of empty shelves, and add the tag "Full Shelf" to images of fully-stocked shelves. Repeat for all untagged images.

    :::image type="content" source="./media/tutorial-nocode-vision/image-tagging.png" alt-text="Image tagging screen in Custom Vision.":::

1. After tagging your images, click the **X** icon in the upper right corner of the window. Click **Tagged** under **Tags** to view all of your newly tagged images.

1. After your images are labeled, you are ready to train your AI model. To do so, click **Train** near the top of the page. You must have at least 15 images per tag type to train your model (we recommend using at least 30). Training typically takes about 30 minutes, but it may take longer if your image set is extremely large.

    :::image type="content" source="./media/tutorial-nocode-vision/train-model.png" alt-text="Training image selection with train button highlighted.":::

1. When the training has completed, your screen will show your model performance. For more information about evaluating these results, please see the [model evaluation documentation](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/get-started-build-detector#evaluate-the-detector). After training, you may also wish to [test your model](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/test-your-model) on additional images and retrain as necessary. Each time you train your model, it will be saved as a new iteration. Reference the [Custom Vision documentation](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/getting-started-improving-your-classifier) for additional information on how to improve model performance.

    :::image type="content" source="./media/tutorial-nocode-vision/iteration.png" alt-text="Model training results.":::

    > [!NOTE]
    > If you elect to test your model on additional images in Custom Vision, please note that test image file size cannot exceed 4MB.

Once you are satisfied with the performance of your model, close Custom Vision by closing the browser tab.

## Deploy your AI model

1. Go back to your Azure Percept Studio tab and click **Next: Evaluate and deploy** at the bottom of your screen.

1. The **Evaluate and deploy** window will show the performance of your selected model iteration. Select the iteration you would like to deploy to your devkit under the **Model iteration** drop-down menu and click **Deploy model** at the bottom of the screen.

    :::image type="content" source="./media/tutorial-nocode-vision/deploy-model-inline.png" alt-text="Model deployment screen." lightbox="./media/tutorial-nocode-vision/deploy-model.png":::

1. After deploying your model, view your device's video stream to see your model inferencing in action.

    :::image type="content" source="./media/tutorial-nocode-vision/view-device-stream.png" alt-text="Device stream showing headphone detector in action.":::

After closing this window, you may go back and edit your vision project anytime by clicking **Vision** under **AI Projects** on the Azure Percept Studio homepage and selecting the name of your vision project.

:::image type="content" source="./media/tutorial-nocode-vision/vision-project-inline.png" alt-text="Vision project page." lightbox="./media/tutorial-nocode-vision/vision-project.png":::

## Improve your model by setting up retraining

After you have trained your model and deployed it to the device, you can improve model performance by setting up retraining parameters to capture more training data. This feature is used to improve a trained model's performance by giving you the ability to capture images based on a probability range. For example, you can set your device to only capture training images when the probability is low. Here is some [additional guidance](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/getting-started-improving-your-classifier) on adding more images and balancing training data.

1. To set up retraining, go back to your **Project**, then to **Project Summary**
1. In the **Image capture** tab, select **Automatic image capture** and **Set up retraining**.
1. Set up the automated image capture to collect a large quantity of images at a time by checking the **Automatic image capture** box.
1. Select your preferred imaging rate under **Capture rate** and the total number of images you would like to collect under **Target**.
1. In the **set up retraining** section, select the iteration that you would like to capture more training data for, then select the probability range. Only images that meet the probability rate will be uploaded to your project.

    :::image type="content" source="./media/tutorial-nocode-vision/vision-image-capture.png" alt-text="image capture.":::

## Clean up resources

If you created a new Azure resource for this tutorial and you no longer wish to develop or use your vision solution, perform the following steps to delete your resource:

1. Go to the [Azure portal](https://ms.portal.azure.com/).
1. Click on **All resources**.
1. Click the checkbox next to the resource created during this tutorial. The resource type will be listed as **Cognitive Services**.
1. Click the **Delete** icon near the top of the screen.

## Video walkthrough

For a visual walkthrough of the steps described above, please see the following video:

</br>

> [!VIDEO https://www.youtube.com/embed/9LvafyazlJM]

</br>

## Next Steps

Next, check out the vision how-to articles for information on additional vision solution features in Azure Percept Studio.

<!--
Add links to how-to articles and oobe article.
-->
