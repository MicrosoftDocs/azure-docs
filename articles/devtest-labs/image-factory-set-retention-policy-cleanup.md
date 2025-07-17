---
title: Set Up an Image Retention Policy
description: Learn how to configure an image retention policy, clean up an image factory, and retire old images in DevTest Labs. 
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 07/21/2025
ms.custom: UpdateFrequency2

#customer intent: As a lab admin, I want to set up an image retention policy in DevTest Labs so that I can periodically clean my image factory. 
---

# Set up an image retention policy in Azure DevTest Labs

This article covers setting an image retention policy, cleaning up an image factory, and retiring old images from all the DevTest labs in an organization. 

## Prerequisites 

- A lab for the image factory in Azure DevTest Labs.
- One or more target  DevTest labs where the factory will distribute golden images.
- An Azure DevOps project to automate the image factory.
- A source code location that contains the scripts and configuration. (It can be DevOps project noted in the preceding prerequisite.)
- Completion of the steps in these articles: 
   - [Create an image factory](image-factory-create.md)
   - [Run an image factory from Azure DevOps](image-factory-set-up-devops-lab.md)
   - [Save custom images and distribute to multiple labs](image-factory-save-distribute-custom-images.md)

## Setting the retention policy

Before you configure the cleanup steps, define how many historic images you want to keep in DevTest Labs. The [Run an image factory from Azure DevOps](image-factory-set-up-devops-lab.md) article describes how to configure various build variables, including `ImageRetention`. If you set this variable to `1`, DevTest Labs doesn't maintain a history of custom images. Only the latest distributed images are available. If you set this variable to `2`,  the latest distributed image plus and the previous ones are maintained. You can set this value to define the number of historic images you want to maintain in DevTest Labs.

## Cleaning up a factory

The first step in cleaning up a factory is to remove the golden image VMs from the image factory. There's a script that does this task. First, you need to add another Azure PowerShell task to the build definition, as shown in the following image:

:::image type="content" source="./media/set-retention-policy-cleanup/powershell-step.png" alt-text="Screenshot that shows the steps for adding a PowerShell task." lightbox="./media/set-retention-policy-cleanup/powershell-step.png":::

After you have the new task in the list, select the item, and then provide the details shown here:

:::image type="content" source="./media/set-retention-policy-cleanup/configure-powershell-task.png" alt-text="Screenshot that shows the details for the PowerShell task." lightbox="./media/set-retention-policy-cleanup/configure-powershell-task.png":::

The script parameters are: 
`-DevTestLabName $(devTestLabName)`

## Retire old images 

This task removes any old images, keeping only a history, based on the setting in the `ImageRetention` build variable. Add an additional Azure PowerShell build task to the build definition. After it's added, select the task, and then provide the details shown here: 

:::image type="content" source="./media/set-retention-policy-cleanup/retire-old-image-task.png" alt-text="Screenshot that shows the details for the Retire images PowerShell task." lightbox="./media/set-retention-policy-cleanup/retire-old-image-task.png":::

The script parameters are: 
`-ConfigurationLocation $(System.DefaultWorkingDirectory)$(ConfigurationLocation) -SubscriptionId $(SubscriptionId) -DevTestLabName $(devTestLabName) -ImagesToSave $(ImageRetention)`

## Queue the build

After you complete the build definition, queue up a new build to make sure everything is working. After the build completes successfully, the new custom images show up in the destination lab. If you check the image factory lab, you see no provisioned VMs. If you queue up further builds, you see the cleanup tasks retiring old custom images from the DevTest labs. The retirement proceeds according to the retention value set in the build variables.

> [!NOTE]
> If you ran the build pipeline at the end of the previous article in this series, manually delete the virtual machines that you created in the image factory lab before queuing a new build. You only need the manual cleanup step when you set everything up and verify that it works.

## Summary

You now have a running image factory that can generate custom images and distribute them to your labs on demand. At this point, it's just a matter of getting your images set up properly and identifying the target labs. As mentioned in the previous article, the *Labs.json* file located in your *Configuration* folder specifies which images should be made available in each of the target labs. As you add other DevTest labs to your organization, you simply need to add an entry in *Labs.json* for the new lab.

Adding a new image to your factory is also easy. When you want to include a new image in your factory, go to your factory lab in the Azure portal. Select the button to add a VM, and then choose the marketplace image and artifacts that you want. Instead of selecting the **Create** button to create the new VM, select **View Azure Resource Manager template**. Save the template as a .json file somewhere in the *GoldenImages* folder in your repository. The next time you run your image factory, it will create your custom image.

## Next steps

- [Schedule your build/release](/azure/devops/pipelines/build/triggers?tabs=designer) to run the image factory periodically. It refreshes your factory-generated images regularly.
- Make more golden images for your factory. Consider [creating artifacts](devtest-lab-artifact-author.md) to script more pieces of your VM setup tasks and include the artifacts in your factory images.
- Create a [separate build/release](/azure/devops/pipelines/overview) to run the *DistributeImages* script separately. You can run this script when you make changes to *Labs.json* and get images copied to target labs without having to re-create all the images.
