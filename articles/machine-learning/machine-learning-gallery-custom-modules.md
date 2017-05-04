---
title: Cortana Intelligence Gallery custom modules | Microsoft Docs
description: Discover custom machine learning modules in the Cortana Intelligence Gallery.
services: machine-learning
documentationcenter: ''
author: garyericson
manager: jhubbard
editor: cgronlun

ms.assetid: 16037a84-dad0-4a8c-9874-a1d3bd551cf0
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/31/2017
ms.author: roopalik;garye

---
# Discover custom machine learning modules in the Cortana Intelligence Gallery
[!INCLUDE [machine-learning-gallery-item-selector](../../includes/machine-learning-gallery-item-selector.md)]

## Custom modules for Machine Learning Studio
A number of
**[Custom Modules](https://gallery.cortanaintelligence.com/customModules)**
are available in the Cortana Intelligence Gallery that expand the capabilities of Azure Machine Learning Studio. You can import these modules for use in your experiments so that you can develop even more advanced predictive analytics solutions.

Initial modules in the Gallery include *time series analytics*, *association rules*, *clustering algorithms* (beyond k-means), *visualizations*, and other workhorse utility modules.

<!-- 
Custom Modules in the Gallery deliver five key experiences:

- **Discover**: Browse or search the Gallery to find modules of interest to you.
- **Understand**: Explore detailed module documentation from right within the Gallery.
- **Import:** Add the module (and accompanying sample experiment) to your workspace with one click.
- **Discuss:** Use the Disqus section to ask questions and share feedback.
- **Share:** Share the module with others and give back to the community.
-->

## Discover
To browse for custom modules in the Gallery, open the [Gallery](http://gallery.cortanaintelligence.com), point your mouse at **More** at the top of the Gallery home page, and select **Custom Modules**.

![Select Custom Modules from the Gallery home page](media/machine-learning-gallery-custom-modules/select-custom-modules-in-gallery.png)

The **[Custom Modules](https://gallery.cortanaintelligence.com/customModules)** page displays a list recently added and popular modules.
Click **See all** to view all custom modules.
From this page, you can browse all the custom modules in the Gallery. You also can search by selecting filter criteria on the left of the page and entering search terms at the top.

![Click "See all" to browse all custom modules](media/machine-learning-gallery-custom-modules/click-see-all-for-all-custom-modules.png)

### Understand

To understand how a published custom module works, just click any custom module to open the module’s details page. This page delivers a consistent and informative learning experience, highlighting the purpose of the module, its expected inputs, outputs, parameters, and more. The page also has a link to the underlying source code, so you can examine and customize it if you want to.

### Comment and share
On a custom module's details page you can comment, provide feedback, or ask questions through the comments section. You can even share it with friends or colleagues using the share capabilities of LinkedIn or Twitter. You can also email a link to the custom module to invite other users to view the page.

![Share this item with friends](media/machine-learning-gallery-how-to-use-contribute-publish/share-links.png)

![Add your own comments](media/machine-learning-gallery-how-to-use-contribute-publish/comments.png)

## Import
You can import any custom module in the Gallery into your own experiments.
There are two ways to import a copy of the module:

* **From the Gallery** - When you import a custom module from the Gallery, you also get a sample experiment that gives you an example of how to use the module.
* **From within Machine Learning Studio** - You can import any custom module while you're working in Studio (in this case, you don't get the sample experiment).

Whichever method you choose, importing a custom module places it into your module palette in Machine Learning Studio. From there, it's available for you to use in any experiment in your workspace, just like any other module.

To use an imported module:

1. Create a new experiment or open an existing one
2. In the module palette to the left of the experiment canvas, click **Custom** to expand the list of custom modules in your workspace
   
    ![Custom module list in Studio palette](media/machine-learning-gallery-custom-modules/custom-module-in-studio-palette.png)
3. Select the module you imported and drag it to your experiment

### Import from the Gallery
To import a copy of a custom module from the Gallery:

1. Open the module's details page in the Gallery
2. Click **Open in Studio**
   
    ![Open custom module from the Gallery](media/machine-learning-gallery-custom-modules/open-custom-module-from-gallery.png)
   
Each custom module includes a sample experiment that demonstrates how to use the module. When you click **Open in Studio**, this sample experiment is loaded into your Machine Learning Studio workspace and opened (if you're not already signed in to Studio, you will be prompted to sign in using your Microsoft account before the experiment is copied to your workspace).

In addition to the sample experiment, the custom module is copied to your workspace and placed in your module palette alongside all the other built-in or custom Studio modules. You can now use it in your own experiments like any other module in your workspace.

### Import from within Machine Learning Studio
You can import any custom module from the Gallery while you're working in Machine Learning Studio:

1. In Machine Learning Studio, click **+NEW**
2. Select **Module** - a list of Gallery modules is displayed that you can choose from, or you can find a specific module using the search box
3. Point your mouse at a module and select **Import Module** (to see information about the module, select **View in Gallery** which takes you to the details page for the module in the Gallery)
   
    ![Import custom module into Machine Learning Studio](media/machine-learning-gallery-custom-modules/add-custom-module-in-studio.png)

The custom module is copied to your workspace and placed in your module palette alongside all the other built-in or custom Studio modules. You can now use it in your own experiments like any other module in your workspace.

**[TAKE ME TO THE GALLERY >>](http://gallery.cortanaintelligence.com)**

[!INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

