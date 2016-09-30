<properties
	pageTitle="Cortana Intelligence Gallery experiments | Microsoft Azure"
	description="Discover and share experiments in the Cortana Intelligence Gallery."
	services="machine-learning"
	documentationCenter=""
	authors="garyericson"
	manager="jhubbard"
	editor="cgronlun"/>

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/26/2016"
	ms.author="roopalik;garye"/>


# Discover experiments in the Cortana Intelligence Gallery

[AZURE.INCLUDE [machine-learning-gallery-item-selector](../../includes/machine-learning-gallery-item-selector.md)]

## Experiments for Machine Learning Studio

The Gallery contains a wide variety of
**[Experiments](https://gallery.cortanaintelligence.com/experiments)**
that have been developed in Azure Machine Learning Studio. These range from quick proof-of-concept experiments that demonstrate a specific machine learning technique, to fully-developed solutions for complex machine learning problems.

> [AZURE.TIP] An *experiment* is a canvas in Machine Learning Studio that lets you construct a predictive analysis model by connecting together data with various analytical modules. You can try different ideas, do trial runs, and eventually publish your model as a web service in Azure. For an example of creating a simple experiment, see [Machine learning tutorial: Create your first experiment in Azure Machine Learning Studio](machine-learning-create-experiment.md). For a more complete walkthrough of creating a predictive analytics solution, see [Walkthrough: Develop a predictive analytics solution for credit risk assessment in Azure Machine Learning](machine-learning-walkthrough-develop-predictive-solution.md).

## Discover

  To browse for
 experiments
  in the Gallery, open the [Gallery](http://gallery.cortanaintelligence.com) and click
**Experiments**
 at the top of the Gallery home page.

 The
**[Experiments](https://gallery.cortanaintelligence.com/experiments)**
 page displays a list of the most recently added and most popular
experiments.
 Click **See all** to view all
experiments.
 From this page you can browse all the
experiments
 in the Gallery, or you can search by selecting filter criteria on the left of the page and entering search terms at the top.

 Click any
experiment
 to open the
experiment's
 details page and read information about what the
experiment
 does. On this page you can comment, provide feedback, or ask questions through the comments section. You can even share it with friends or colleagues using the share capabilities of LinkedIn or Twitter. You can also email a link to the
experiment
 to invite other users to view the page.

![Share this item with friends](media\machine-learning-gallery-how-to-use-contribute-publish\share-links.png)

![Add your own comments](media\machine-learning-gallery-how-to-use-contribute-publish\comments.png)

## Download

You can download a copy of any experiment from the Gallery into your workspace and then modify your copy to create your own solutions.
There are two ways to get a copy of the experiment:

- From the Gallery - If you find an experiment you like in the Gallery, you can easily download a copy and open it in your Machine Learning Studio workspace.

- From within Machine Learning Studio - In Studio, you can use any experiment in the Gallery as a template to create a new experiment.

### From the Gallery

To download a copy of an experiment from the Gallery:

1. Open the experiment's details page in the Gallery
2. Click **Open in Studio**

	![Open experiment from the Gallery](media\machine-learning-gallery-experiments\open-experiment-from-gallery.png)

When you click **Open in Studio**, the experiment is loaded into your Machine Learning Studio workspace and opened (if you're not already signed in to Studio, you will be prompted to sign in using your Microsoft account before the experiment is copied to your workspace).


### In Machine Learning Studio

You can also open the same sample experiments while you're working in Machine Learning Studio:

1. In Machine Learning Studio, click **+NEW**

2. Select **Experiment** - a list of experiments from the Gallery is displayed that you can choose from, or you can find a specific experiment using the search box

3. Point your mouse at an experiment and select **Open in Studio** - the experiment is copied to your workspace and opened (to see information about the experiment, select **View in Gallery** which takes you to the details page for the experiment in the Gallery)

	![Open Gallery experiment from inside Machine Learning Studio](media\machine-learning-gallery-experiments\open-experiment-from-studio.png)

You can now customize, iterate, and deploy this experiment like any other experiment you create in Machine Learning Studio.


## Contribute

When you sign in to the Gallery you become a member of the Gallery community. This allows you to contribute your own experiments so that others can benefit from the solutions you've discovered.

### Publish your experiment to the Gallery

Follow these steps to contribute an experiment to the Cortana Intelligence Gallery:

1. Sign in to Machine Learning Studio using your Microsoft account.

2. Create your experiment and run it.

3. When you’re ready to publish your experiment to the Gallery, click **Publish to Gallery** below the experiment canvas.

	![Click "Publish to Gallery"](media\machine-learning-gallery-experiments\publish-experiment-to-gallery.png)

1. Fill out the title and tags fields. Keep them descriptive, highlighting the techniques used or the real-world problem being solved, for instance, “Binary Classification: Twitter Sentiment Analysis”.

	![Fill out title and tag fields when publishing](media\machine-learning-gallery-experiments\experiment-description.png)

2. Write a summary of what your content covers. Briefly describe the problem being solved and how you approached it.

3. Use the detailed description box to step through the different parts of your experiment. Some useful topics to include here are:
	- Experiment graph screenshot
	- Data sources and explanation
	- Data processing
	- Feature engineering
	- Model description
	- Results and evaluation of model performance

	You can use Markdown to format as needed. Click the **Preview** icon to see how things will look when published.

	> [AZURE.TIP] The box provided for Markdown editing and preview box is quite small. We recommend that you write your documentation in a Markdown editor and paste the completed document into the text box.  After you've published your experiment, you can use standard web-based tools in Markdown for editing and preview to make necessary tweaks and corrections.

4. Upload a thumbnail image for your gallery item. This will appear at the top of the item page and in the item tile when browsing the gallery. You can choose an image from your computer or select one of the stock images.

5. Choose whether to publish your content publicly, or have it only accessible to people with the link.

	> [AZURE.TIP] If you want to make sure your documentation looks right before releasing it publicly, you can publish it as unlisted first, and then switch it to Public from the item page.

See the section below, **Suggestions for publishing and for quality documentation**, for tips on how to publish a quality Gallery experiment.

That’s it – you’re all done.

You can now view your experiment in the Gallery and share the link with others. If you published it publicly, your experiment will show up in browse and search results in the Gallery. You can also edit your documentation on the item page any time you're logged in.

To see the list of your contributions, click your image in the upper-right corner of any Gallery page and then click your name to open your account page.

### Update your experiment

To make changes to the experiment you published, go back to the experiment in Machine Learning Studio, make your changes, and publish it again. Your existing published experiment will be updated with your changes.

Also, when you view your experiment in the Gallery, you can click **edit** and change the following information:
- Experiment name
- Summary or description text
- Tags specified
- Image used

You can also click the settings icon and change the **Visibility settings** to switch the experiment between **Public** (anyone can view and copy the experiment) and **Unlisted** (only people with a direct link can view or copy the experiment). And you can delete the experiment if necessary.


### Suggestions for publishing and for quality documentation

- While you can assume that the reader has prior data science experience, it still helps to simplify your language and explain things in detail wherever possible.

- Not all readers will be familiar with the Cortana Intelligence Suite, given that it's relatively new.
So provide enough information and step-by-step explanations to help readers navigate through your work.

- Visuals including experiment graphs or screenshots of data can be very helpful for readers to interpret and use your content the right way. See the [Publishing Guidelines and Examples collection](https://gallery.cortanaintelligence.com/Collection/Publishing-Guidelines-and-Examples-1) for more information on how to include images in your documentation.

- If you include a dataset in your experiment (it's not being imported through the Import Data module), it's part of your experiment and will get published to the Gallery. Therefore, ensure that the dataset you're publishing has appropriate licensing terms for sharing and downloading by anyone. Gallery contributions are covered under the Azure [Terms of Use](https://azure.microsoft.com/support/legal/website-terms-of-use/).

## Frequently Asked Questions

**I would like to make changes to the workflow of the experiment I submitted to the Gallery. How can I do that?**

As of right now we do not support workflow updates to experiments you have already published to the Gallery. You may publish any such changes as a new experiment into the Gallery and delete your old one. We are actively working on enabling publishing updates to workflow for experiments already contributed to the Gallery.

**Will I need to publish a new experiment even if I have to edit only the tags or description?**

The following type of edits can be made to an experiment you have already contributed without having to publish it again:

- Experiment Name
- Summary Text
- Description Text
- Tags
- Images

In order to edit these fields, click the specific experiment you would like to edit (make sure you're signed in with your Microsoft account). This will open the experiment details page where you can see options to edit or delete. Clicking **Edit** allows you to edit any of the above fields.

**I just published my experiment to the Gallery. I don’t see my profile picture showing up with my name.**

It's possible that you're using an account other than @outlook, @msn, @live or @hotmail. If that's the case, you'll see a placeholder image instead of the profile picture from your Microsoft account configuration settings. Using a Microsoft account and re-submitting the experiment should help solve this issue.

**I updated my profile picture in my Microsoft account configuration settings. Why are my existing experiment contributions not reflecting this new profile picture?**

If you want to reflect the most recent profile change (profile picture, first name, or last name) for all your experiments, you should re-submit the older experiments to the Gallery. In doing so you'll need to delete the older copies that reflect the old profile settings.

**What are the image requirements when submitting or editing an image for my experiment?**

The images you submit along with your experiment will be used to create an experiment tile for your contribution. It's recommended that the images be < 500Kb in size, with an aspect ratio of 3:2. A resolution of 960x640 is recommended

**What happens to the dataset I have used in the experiment? Does the data set get published to the Gallery as well?**

If your dataset is part of your experiment and not being imported through a reader module, it's part of your experiment and gets published to the Gallery with your experiment. For this reason ensure that the dataset you're publishing with the experiment has the appropriate licensing terms that allow sharing and downloading by anyone.

**I have an experiment that uses an Import Data module to pull data from HDInsight or SQL. It uses my credentials to retrieve the data. How can I publish such an experiment and be assured that my credentials will not be shared?**

At this time we do not allow publishing of experiments that use credentials.

**How do I de-limit tags?**

You can use tab to de-limit tags.

**I see some experiments have rich descriptions with rich rendering capabilities. However when I try to provide a description, the description is presented in plain text.**

Rich description rendering is not available to all Gallery users widely. We're actively working on making this capability available by supporting markdown rendering.


**[TAKE ME TO THE GALLERY >>](http://gallery.cortanaintelligence.com)**

[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]
