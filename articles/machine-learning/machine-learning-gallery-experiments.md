---
title: Cortana Intelligence Gallery experiments | Microsoft Docs
description: Discover and share experiments in Cortana Intelligence Gallery.
services: machine-learning
documentationcenter: ''
author: garyericson
manager: jhubbard
editor: cgronlun

ms.assetid: f4248922-c961-4d3a-9e1b-aec743210166
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/31/2017
ms.author: roopalik;garye

---
# Discover experiments in Cortana Intelligence Gallery
[!INCLUDE [machine-learning-gallery-item-selector](../../includes/machine-learning-gallery-item-selector.md)]

## Experiments for Machine Learning Studio
The Gallery has a wide variety of **[experiments](https://gallery.cortanaintelligence.com/experiments)** that have been developed in [Azure Machine Learning Studio](https://studio.azureml.net). Experiments range from quick proof-of-concept experiments that demonstrate a specific machine learning technique, to fully developed solutions for complex machine learning problems.

> [!NOTE]
> An ***experiment*** is a canvas in Azure Machine Learning Studio that you can use to construct a predictive analysis model. You create the model by connecting data with various analytical modules. You can try different ideas, do trial runs, and eventually publish your model as a web service in Azure. For an example of how to create a basic experiment, see [Machine learning tutorial: Create your first experiment in Azure Machine Learning Studio](machine-learning-create-experiment.md). For a more comprehensive walkthrough of how to create a predictive analytics solution, see [Walkthrough: Develop a predictive analytics solution for credit risk assessment in Azure Machine Learning](machine-learning-walkthrough-develop-predictive-solution.md).
> 
> 

## Discover
To browse experiments [in the Gallery](http://gallery.cortanaintelligence.com), at the top of the Gallery home page, select **Experiments**.

The **[Experiments](https://gallery.cortanaintelligence.com/experiments)** page displays a list of recently added and popular experiments. To see all experiments, select the **See all** button. To search for a specific experiment, select **See all**, and then select filter criteria. You also can enter search terms in the **Search** box at the top of the Gallery page.

You can get more information about an experiment on the experiment details page. To open an experiment details page, select the experience. On an experiment details page, in the **Comments** section, you can comment, provide feedback, or ask questions about the experiment. You can even share the experiment with friends or colleagues on LinkedIn or Twitter. You also can mail a link to the experiment Gallery page, to invite other users to view the page.

![Share this item with friends](media/machine-learning-gallery-how-to-use-contribute-publish/share-links.png)

![Add your own comments](media/machine-learning-gallery-how-to-use-contribute-publish/comments.png)

## Download
You can download a copy of any experiment from the Gallery into your Machine Learning Studio workspace. Then, modify your copy to create your own solutions. Cortana Intelligence Gallery offers two ways to import a copy of the experiment:

* **From the Gallery**. If you find an experiment that you like in the Gallery, you can download a copy and open it in your Machine Learning Studio workspace.
* **From within Machine Learning Studio**. In Machine Learning Studio, you can use any experiment in the Gallery as a template to create a new experiment.

### From the Gallery
To download a copy of an experiment from the Gallery:

1. In the Gallery, open the experiment details page.
2. Select **Open in Studio**.
   
    ![Open experiment from the Gallery](media/machine-learning-gallery-experiments/open-experiment-from-gallery.png)

When you select **Open in Studio**, the experiment opens in your Machine Learning Studio workspace. (If you're not already signed in to Studio, you are prompted to sign in by using your Microsoft account before the experiment is copied to your workspace.)

### From within Machine Learning Studio
To open sample experiments from within Machine Learning Studio:

1. In Machine Learning Studio, select **NEW**.
2. Select **Experiment**. You can choose from a list of Gallery experiments, or find a specific experiment by using the **Search** box.
3. Point your mouse at an experiment, and select **Open in Studio**. (To see information about the experiment, select **View in Gallery**. This takes you to the experiment details page in the Gallery.)
   
    ![Open Gallery experiment from inside Machine Learning Studio](media/machine-learning-gallery-experiments/open-experiment-from-studio.png)

You can customize, iterate, and deploy a downloaded experiment like any other experiment that you create in Machine Learning Studio.

![Experiment opened in Studio](media/machine-learning-gallery-experiments/experiment-open-in-studio.png)

## Contribute
When you sign in to the Gallery, you become a member of the Gallery community. As a member of the community, you can contribute your own experiments, so other users can benefit from the solutions you've discovered.

### Publish your experiment to the Gallery
To contribute an experiment to Cortana Intelligence Gallery:

1. Sign in to Machine Learning Studio by using your Microsoft account.
2. Create your experiment, and then run it.
3. When you’re ready to publish your experiment in the Gallery, below the experiment canvas, select **Publish to Gallery**.
   
    ![Select Publish to Gallery](media/machine-learning-gallery-experiments/publish-experiment-to-gallery.png)
4. Enter a title and tags. Keep the title and tags descriptive. Highlight the techniques you used or the real-world problem you are solving. Here's an example of a descriptive experiment title: “Binary Classification: Twitter Sentiment Analysis.”
   
    ![Enter title and tags when publishing](media/machine-learning-gallery-experiments/experiment-description.png)
5. Enter a summary of what your content covers. Briefly describe the problem the experiment solves, and how you approached it.
6. In the **DETAILED DESCRIPTION** box, describe the steps you took in all parts of your experiment. Some useful topics to include are:
   
   * Experiment graph screenshot
   * Data sources and explanation
   * Data processing
   * Feature engineering
   * Model description
   * Results and evaluation of model performance
     </br>
     </br>
     You can use markdown to format your description. To see how the experiment details page will look when the experiment is published, select **Preview**.
     </br>
     ![Select Preview to see what your text will look like](media/machine-learning-gallery-experiments/preview-markdown-text.png)
     
     <!-- -->
     > [!TIP]
     > The text boxes provided for markdown editing and preview are small. We recommend that you write your documentation in a markdown editor, and then paste the completed documentation in the text box in the Gallery. After you published your experiment, you can use standard web-based tools that use markdown for edit and preview for any corrections that you might want to make.
     > 
     > 
7. Upload a thumbnail image for your Gallery item. The thumbnail image appears at the top of the item page and in the item tile. Other users will see the thumbnail image when they browse the Gallery. You can upload an image from your computer, or use a stock image from the Gallery.
    </br>
    ![Upload or select an image for the Gallery](media/machine-learning-gallery-experiments/select-gallery-image.png)
8. Choose whether to publish your content publicly (**Public**) or have it accessible only to people who have a link to the page (**Unlisted**).
   
    ![Choose whether to publish publicly or as unlisted](media/machine-learning-gallery-experiments/choose-public-or-unlisted.png)
   
    <!-- -->
   
   > [!TIP]
   > If you want to make sure your documentation looks correct before you release it publicly, you can first publish the experiment as unlisted, and later change visibility to **Public** on the item page.
   > 
   > 
9. To publish the experiment to the Gallery, select the **OK** checkmark.
   
    ![Select the OK checkmark to publish the experiment](media/machine-learning-gallery-experiments/ok-checkmark.png)

For tips on how to publish a quality Gallery experiment, see [Tips for documenting and publishing your experiment](#tips-for-documenting-and-publishing-your-experiment).

That’s it--you’re all done.

You can now view your experiment in the Gallery and share the link with others. If you published it publicly, your experiment will show up in browse and search results in the Gallery. You can also edit your documentation on the item page any time you're logged in.

To see the list of your contributions, select your image in the upper-right corner of any Gallery page. Then, select your name to open your account page.

![Select your account name](media/machine-learning-gallery-experiments/click-account-name.png)

### Update your experiment
If you need to make changes to the workflow (modules, parameters, etc.) in an experiment you published to the Gallery,
go back to the experiment in Machine Learning Studio, make your changes, and publish it again. Your existing published experiment will be updated with your changes.

If you just need to change any of the following information for your experiment, or you need to delete the experiment from the Gallery, you can make all of these changes in the Gallery:

* Experiment name
* Summary or description text
* Tags specified
* Image used
* Visibility setting (public or unlisted)
* Delete experiment from the Gallery

These changes can be made in the Gallery from the experiment details page or from your profile page.

#### From your experiment details page
On the experiment details page, to change the details for your experiment, select **Edit**.

![Select Edit to edit your experiment](media/machine-learning-gallery-experiments/edit-button.png)

The details page enters edit mode. Select **Edit** next to the experiment name, summary, and tags, to make changes to them. When you're finished making changes, select **Done**.

![Select Edit to edit details, select Done when finished](media/machine-learning-gallery-experiments/edit-details-page.png)

To change visibility of the experiment (public or unlisted) or to delete the experiment from the Gallery, select the **Settings** icon.

![Select Settings to change visibility or delete the experiment](media/machine-learning-gallery-experiments/settings-button.png)

#### From your profile page
On your profile page, select the arrow on the experiment, and then select **Edit**. This takes you to the details page for your experiment, in edit mode. When you are finished making changes, select **Done**.

To delete the experiment from the Gallery, select **Delete**.

![Select Edit or Delete](media/machine-learning-gallery-experiments/edit-delete-buttons.png)

### Tips for documenting and publishing your experiment
* You can assume that the reader has prior data science experience, but it helps to use simple language. Explain things in detail whenever possible.
* Cortana Intelligence Suite is relatively new. Not all readers are familiar with how to use it. Provide enough information and step-by-step explanations to help readers navigate your work.
* Visuals can be helpful for readers to interpret and use your content the right way. Visuals include experiment graphs and screenshots of data. For more information about how to include images in your documentation, see the [Publishing Guidelines and Examples collection](https://gallery.cortanaintelligence.com/Collection/Publishing-Guidelines-and-Examples-1).
* If you include a dataset in your experiment (you're not importing the dataset through the Import Data module), the dataset is part of your experiment and is published in the Gallery. Therefore, ensure that the dataset you're publishing has appropriate licensing terms for sharing and downloading by anyone. Gallery contributions are covered under the Azure [Terms of Use](https://azure.microsoft.com/support/legal/website-terms-of-use/).

## Frequently asked questions
**What are the image requirements for submitting or editing an image for my experiment?**

The images you submit with your experiment are used to create an experiment tile for your contribution. We recommend that images be smaller than 500 KB, with an aspect ratio of 3:2, and a resolution of 960 &#215; 640.

**What happens to the data set I used in the experiment? Is the data set also published in the Gallery?**

If your data set is part of your experiment and is not being imported through the Import Data module, in the Gallery, the data set is part of your experiment. The data set is published to the Gallery with your experiment. Make sure that the data set that you're publishing with your experiment has the appropriate licensing terms. The licensing terms should allow anyone to share and download the data.

**I have an experiment that uses an Import Data module to pull data from Azure HDInsight or SQL Server. It uses my credentials to retrieve the data. Can I publish this kind of experiment? How can I be assured that my credentials won't be shared?**

Currently, you cannot publish an experiment that uses credentials.

**How do I enter multiple tags?**

After you enter a tag, press the Tab key to enter another tag.

**[TAKE ME TO THE GALLERY >>](http://gallery.cortanaintelligence.com)**

[!INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

