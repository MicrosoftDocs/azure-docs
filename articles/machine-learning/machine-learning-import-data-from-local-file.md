<properties
	pageTitle="Import data into Machine Learning Studio from a local file | Microsoft Azure"
	description="How to import your training data Azure Machine Learning Studio from a local file."
	keywords="import data,data format,data types,data sources,training data"
	services="machine-learning"
	documentationCenter=""
	authors="garyericson"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/17/2016"
	ms.author="garye;bradsev" />


# Import your training data into Azure Machine Learning Studio from a local file

[AZURE.INCLUDE [import-data-into-aml-studio-selector](../../includes/machine-learning-import-data-into-aml-studio.md)]


To use your own data in Machine Learning Studio, you can upload a data file ahead of time from your local hard drive to create a dataset module in your workspace. 


## Import data from a local file

You can import data from a local hard drive by doing the following:

1. Click **+NEW** at the bottom of the Machine Learning Studio window.
2. Select **DATASET** and **FROM LOCAL FILE**.
3. In the **Upload a new dataset** dialog, browse to the file you want to upload
4. Enter a name, identify the data type, and optionally enter a description. A description is recommended - it allows you to record any characteristics about the data that you will want to remember when using the data in the future.
5. The checkbox **This is the new version of an existing dataset** allows you to update an existing dataset with new data. Just click this checkbox and then enter the name of an existing dataset.

During upload, you will see a message that your file is being uploaded. Upload time will depend on the size of your data and the speed of your connection to the service.
If you know the file will take a long time, you can do other things inside Machine Learning Studio while you wait. However, closing the browser will cause the data upload to fail.

Once your data is uploaded, it's stored in a dataset module and is available to any experiment in your workspace.
You can find the dataset, along with all the pre-loaded sample datasets, in the **Saved Datasets** list in the module palette when you're editing an experiment. You can drag and drop the dataset in the experiment canvas when you want to use the data set for the further analytics and machine learning.


