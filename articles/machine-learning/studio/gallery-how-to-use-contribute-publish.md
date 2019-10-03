---
title: Azure AI Gallery
titleSuffix: Azure Machine Learning Studio
description: Share and discover analytics resources and more in the Azure AI Gallery. Learn from others and make your own contributions to the community.
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: conceptual

author: xiaoharper
ms.author: amlstudiodocs
ms.custom: previous-author=heatherbshapiro, previous-ms.author=hshapiro
ms.date: 01/11/2019
---
# Share and discover resources in the Azure AI Gallery

**[Azure AI Gallery](https://gallery.azure.ai)** is a community-driven site for discovering and sharing solutions built with Azure AI.
The Gallery has a variety of resources that you can use to develop your own analytics solutions.

## What can I find in the Gallery?

The Azure AI Gallery contains a number of different resources that have been contributed by Microsoft and members of the data science community. These include:

* **Experiments** - The Gallery contains a wide variety of experiments that have been developed in Azure Machine Learning Studio. These range from quick proof-of-concept experiments that demonstrate a specific machine learning technique, to fully-developed solutions for complex machine learning problems.
* **Tutorials** - A number of tutorials are available to walk you through machine learning technologies and concepts, or to describe advanced methods for solving various machine learning problems.
* **Collections** - A collection allows you to group together experiments, APIs, and other Gallery resources that address a specific solution or concept.
* **Custom Modules** - You can download custom modules into your Studio workspace to use in your own experiments.
* **Jupyter Notebooks** - Jupyter Notebooks include code, data visualizations, and documentation in a single, interactive canvas. Notebooks in the Gallery provide tutorials and detailed explanations of advanced machine learning techniques and solutions.

## Discover and contribute

Anyone can browse and search the different types of resources in the Gallery that have been contributed by Microsoft and the data science community.
Use these resources to learn more and get a head start on solving your own data analysis problems.

You can easily find recently published and popular resources in the Gallery, or you can search by name, tags, algorithms, and other attributes.
Click **Browse all** in the Gallery header, and then select search refinements on the left of the page and enter search terms at the top.
View contributions from a particular author by clicking the author name from within any of the tiles.
You can comment, provide feedback, or ask questions through the comments section on each resource page.
You can even share a resource of interest with friends or colleagues using the share capabilities of LinkedIn or Twitter, or by emailing a link.

When you sign in you become a member of the Gallery community. This allows you to download resources or contribute your own Gallery items so that others can benefit from the solutions you've discovered.

You can download **experiments**, **custom modules**, and **Jupyter notebooks** to use in developing your own analytics solutions.
You can contribute **experiments**, **tutorials**, and **collections** to the Gallery.

## Download experiments, modules, notebooks

You can download **experiments**, **custom modules**, and **Jupyter notebooks** into your own Machine Learning Studio workspace to use in developing your own solutions.

To download a resource from within the AI Gallery:

1. Open the resource in AI Gallery.
1. Click **Open in Studio**.

![Open an item from the AI Gallery](./media/gallery-how-to-use-contribute-publish/open-experiment-from-gallery.png)

To download a resource from within Studio:

1. In Studio, select **NEW**.
1. Select **Module**, **Experiment**, or **Notebook**.
1. Browse or search to find a Gallery resource.
1. Point your mouse at the resource, and then select **Open in Studio**.
    ![Open Gallery experiment from inside Machine Learning Studio](./media/gallery-how-to-use-contribute-publish/open-experiment-from-studio.png)

Once the resource is in your workspace, you can customize and use it as you would anything that you create in Studio.

To use an imported custom module:

1. Create an experiment or open an existing experiment.
1. To expand the list of custom modules in your workspace, in the module palette select **Custom**. The module palette is to the left of the experiment canvas.
1. Select the module that you imported and drag it to your experiment.

## Contribute experiments

To demonstrate analytics techniques, or to give others a jump-start on their solutions, you can contribute **experiments** you've developed in Studio.
As others come across your contribution in the Gallery, you can follow the number of views and downloads of your contribution.
Users can also add comments and share your contributions with other members of the data science community.
And you can log in with a discussion tool such as Disqus to receive notifications for comments on your contributions.

1. Open your experiment in Studio.

1. In the list of actions below the experiment canvas, select **Publish to Gallery**.

1. In the Gallery, enter a **Name** and **Tags** that are descriptive. Highlight the techniques you used or the real-world problem you're solving. An example of a descriptive experiment title is “Binary Classification: Twitter Sentiment Analysis.”

1. In the **SUMMARY** box, enter a summary of your experiment. Briefly describe the problem the experiment solves, and how you approached it.

1. In the **DETAILED DESCRIPTION** box, describe the steps you took in each part of your experiment. Some useful topics to include are:
   * Experiment graph screenshot
   * Data sources and explanation
   * Data processing
   * Feature engineering
   * Model description
   * Results and evaluation of model performance

   You can use markdown to format your description. To see how your entries on the experiment description page will look when the experiment is published, select **Preview**.

   > [!TIP]
   > The text boxes provided for markdown editing and preview are small. We recommend that you write your experiment documentation in a markdown editor (such as [Visual Studio Code](https://aka.ms/vscode)), then copy and paste the completed documentation into the text box in the Gallery.

1. On the **Image Selection** page, choose a thumbnail image for your experiment. The thumbnail image appears at the top of the experiment details page and in the experiment tile. Other users will see the thumbnail image when they browse the Gallery. You can upload an image from your computer, or select a stock image from the Gallery.

1. On the **Settings** page, under **Visibility**, choose whether to publish your content publicly (**Public**) or to have it accessible only to people who have a link to the page (**Unlisted**).

   > [!TIP]
   > If you want to make sure your documentation looks correct before you release it publicly, you can first publish the experiment as **Unlisted**. Later, you can change the visibility setting to **Public** on the experiment details page. Note that after you set an experiment to **Public** you cannot later change it to **Unlisted**.

1. To publish the experiment to the Gallery, select the **OK** check mark.

### Update your experiment

If you need to, you can make changes to the workflow (modules, parameters, and so on) in an experiment that you published to the Gallery. In Machine Learning Studio, make any changes you'd like to make to the experiment, and then publish again. Your published experiment will be updated with your changes.

You can change any of the following information for your experiment directly in the Gallery:

* Experiment name
* Summary or description
* Tags
* Image
* Visibility setting (**Public** or **Unlisted**)

You also can delete the experiment from the Gallery.

You can make these changes, or delete the experiment, from the experiment details page or from your profile page in the Gallery.

* On the experiment details page, to change the details for your experiment, select **Edit**. The details page enters edit mode. To make changes, select **Edit** next to the experiment name, summary, or tags. When you're finished making changes, select **Done**. To change the visibility settings for the experiment (**Public** or **Unlisted**), or to delete the experiment from the Gallery, select the **Settings** icon.

* On your profile page, select the down arrow for the experiment, and then select **Edit**. This takes you to the details page for your experiment, in edit mode. When you are finished making changes, select **Done**. To delete the experiment from the Gallery, select **Delete**.

### Tips for documenting and publishing your experiment

* You can assume that the reader has prior data science experience, but it can be helpful to use simple language. Explain things in detail whenever possible.
* Provide enough information and step-by-step explanations to help readers navigate your experiment.
* Visuals can be helpful for readers to interpret and use your experiment documentation correctly. Visuals include experiment graphs and screenshots of data.
* If you include a dataset in your experiment (that is, you're not importing the dataset through the Import Data module), the dataset is part of your experiment and is published in the Gallery. Make sure that the dataset you publish has licensing terms that allow sharing and downloading by anyone. Gallery contributions are covered under the Azure [Terms of Use](https://azure.microsoft.com/support/legal/website-terms-of-use/).

## Contribute tutorials and collections

You can help others by writing a **tutorial** in the Gallery that explains machine learning concepts, or by creating a **collection** that groups together multiple resources around a specific solution.

1. Sign in to the Gallery using your Microsoft account.

1. Select your image in the upper-right corner of the page, and then select your name.

1. Select **New Item**.

1. On the **Description** page, for **ITEM TYPE**, select **Tutorial** or **Collection**. Enter a name, a brief summary, a detailed description, and any tags that might help other users find your contribution. Then click **Next**.

1. On the **Image Selection** page, select an image that's displayed with your contribution. You can upload your own image file, or select a stock image. Choose an image that might help users identify the content and purpose of your contribution. Then click **Next**.

1. On the **Settings** page, for **Visibility**, select whether your contribution is **Public** (anyone can view it) or **Unlisted** (only people with a direct link can view it).

   > [!TIP]
   > If you want to make sure your documentation looks correct before you release it publicly, you can first publish the experiment as **Unlisted**. Later, you can change the visibility setting to **Public** on the experiment details page. Note that after you set an experiment to **Public** you cannot later change it to **Unlisted**.

1. Select **Create**.

Your contribution is now in Azure AI Gallery. Your contributions are listed on your account page on the **Items** tab.

### Add to and edit your collection

You can add items to your collection in two ways:

* Open the collection, select **Edit**, and then select **Add Item**. You can add items that you've contributed to the Gallery or you can search the Gallery for items to add. After you've selected the items you want to add, click **Add**.

* If you find an item that you want to add while you're browsing the Gallery, open the item and select **Add to collection**. Select the collection that you want to add the item to.

You can edit the items in your collection by selecting **Edit**.

* You can change the summary, description, or tags for your collection.
* You can change the order of the items in the collection by using the arrows next to an item.
* To add notes to the items in your collection, select the upper-right corner of an item, and then select **Add/Edit note**.
* To remove an item from your collection, select the upper-right corner of an item, and then select **Remove**.

## Frequently asked questions

**What are the requirements for submitting or editing an image?**

Images that you submit with your contribution are used to create a tile. We recommend that images be smaller than 500 KB, with an aspect ratio of 3:2, and a resolution of 960 &#215; 640.

**What happens to the dataset I used in an experiment? Is the dataset also published in the Gallery?**

If your dataset is part of your experiment and is not being imported through the Import Data module, the dataset is published in the Gallery as part of your experiment. Make sure that the dataset that you publish with your experiment has the appropriate licensing terms. The licensing terms should allow anyone to share and download the data. Gallery contributions are covered under the Azure [Terms of Use](https://azure.microsoft.com/support/legal/website-terms-of-use/).

**I have an experiment that uses an Import Data module to pull data from Azure HDInsight or SQL Server. It uses my credentials to retrieve the data. Can I publish this kind of experiment? How can I be assured that my credentials won't be shared?**

Currently, you cannot publish in the Gallery an experiment that uses credentials.

**How do I enter multiple tags?**

After you enter a tag, to enter another tag, press the Tab key.

## We want to hear from you!

We want the Gallery to be driven by our users and for our users. Use the smiley on the right to tell us what you love or hate about the Gallery.  

![Feedback](./media/gallery-how-to-use-contribute-publish/feedback.png)

**[TAKE ME TO THE GALLERY >>](https://gallery.azure.ai)**
