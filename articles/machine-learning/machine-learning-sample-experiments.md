<properties
    pageTitle="Copy machine learning sample experiments | Microsoft Azure"
    description="Learn how to use sample machine learning experiments to create new experiments with Cortana Intelligence Gallery and Microsoft Azure Machine Learning."
    services="machine-learning"
    documentationCenter=""
    authors="cjgronlund"
    manager="jhubbard"
    editor="cgronlun"/>

<tags
    ms.service="machine-learning"
    ms.workload="data-services"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="get-started-article"
    ms.date="08/17/2016"
    ms.author="cgronlun;chhavib;olgali"/>

# Copy sample experiments to create new machine learning experiments
Learn how to start with sample experiments from [Cortana Intelligence Gallery](http://gallery.cortanaintelligence.com/) instead of creating machine learning experiments from scratch. You can use the samples to build your own machine learning solution.

In the gallery are sample experiments by the Microsoft Azure Machine Learning team as well as samples shared by the Machine Learning community. You also can ask questions or post comments about experiments.

To see how to use the gallery, watch the 3-minute video [Copy other people's work to do data science](machine-learning-data-science-for-beginners-copy-other-peoples-work-to-do-data-science.md) from the series [Data Science for Beginners](machine-learning-data-science-for-beginners-the-5-questions-data-science-answers.md).

[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

## Find an experiment to copy in Cortana Intelligence Gallery

To see what experiments are available, go to the [Gallery](http://gallery.cortanaintelligence.com/) and click **Experiments** at the top of the page.

### Find the newest or most popular experiments

On this page, you can see **Recently added** experiments, or scroll down to look at **What's popular** or the latest **Popular Microsoft experiments**.

### Look for an experiment that meets specific requirements

To browse all experiments:

1. Click **Browse all** at the top of the page.
2. Under **Refine by**, select **Experiment** to see all the experiments in the Gallery.
3. You can find experiments that meet your requirements a couple different ways:
    * **Select filters on the left.** For example, to browse experiments that use a PCA-based anomaly detection algorithm, select **Experiment** under **Categories**, and **PCA-Based Anomaly Detection** under **Algorithms Used**. (If you don't see that algorithm, click **Show all** at the bottom of the list.)<br></br>
      ![](./media/machine-learning-sample-experiments/refine-the-view.png)
    *  **Use the search box.** For example, to find experiments contributed by Microsoft related to digit recognition that use a two-class support vector machine algorithm, enter "digit recognition" in the search box. Then, select the filters **Experiment**, **Microsoft content only**, and **Two-Class Support Vector Machine**:
      ![](./media/machine-learning-sample-experiments/search-for-experiments.png) 
4. Click an experiment to learn more about it.
5. To run and/or modify the experiment, click **Open in Studio** on the experiment's page.

    > [AZURE.NOTE] To open an experiment in Machine Learning Studio, you need to sign in with your Microsoft account credentials. If you don’t have a Machine Learning workspace yet, a free trial workspace is created. [Learn what’s included in the Machine Learning free trial](https://azure.microsoft.com/pricing/details/machine-learning/)

    ![](./media/machine-learning-sample-experiments/example-experiment.png) 


## Use a template in Machine Learning Studio

You also can create a new experiment in Machine Learning Studio using a Gallery sample as a template.

1. Sign in with your Microsoft account credentials to the [Studio](https://studio.azureml.net), and then click **New** to create a new experiment.
2. Browse through the sample content and click one.

A new experiment is created in your workspace using the sample experiment as a template.

## Next steps
- [Prepare your data](machine-learning-data-science-import-data.md)
- [Try using R in your experiment](machine-learning-r-quickstart.md)
- [Review sample R experiments](machine-learning-r-csharp-web-service-examples.md)
- [Create a web service API](machine-learning-publish-a-machine-learning-web-service.md)
- [Browse ready-to-use applications](https://datamarket.azure.com/browse?query=machine+learning)
