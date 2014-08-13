<properties title="Create your first experiment in Azure Machine Learning Studio" pageTitle="Create your first experiment in Machine Learning Studio | Azure" description="How to create and iterate on an experiment in Azure Machine Learning Studio" metaKeywords="" services="machine-learning" solutions="" documentationCenter="" authors="garye" videoId="" scriptId="" />

<tags ms.service="machine-learning" ms.workload="tbd" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="garye" />

#Create your first experiment in Azure Machine Learning Studio 
 
A predictive analytics experiment, at its core, consists of components to *create a model*, *train the model*, and *score and test the model*. You can combine these to create an experiment that takes data, trains a model against it, and applies the model to new data. You can also add modules to pre-process data and select features, split data into training and test sets, and evaluate or cross-validate the quality of your model.  

In this article, we'll use Microsoft Azure Machine Learning Studio to develop and iterate on a simple predictive analytics experiment.

##Five Steps to Creating an Experiment 

The five basic steps you follow to build an experiment in ML Studio allow you to create, train, and score your model:  

- Create a Model 
	- [Step 1: Get data]
	- [Step 2: Pre-process data]
	- [Step 3: Define features]
- Train the Model 
	- [Step 4: Choose and apply a learning algorithm]
- Score and Test the Model 
	- [Step 5: Predict over new data] 

[Step 1: Get data]: #step-1-get-data
[Step 2: Pre-process data]: #step-2-pre-process-data
[Step 3: Define features]: #step-3-define-features
[Step 4: Choose and apply a learning algorithm]: #step-4-choose-and-apply-a-learning-algorithm
[Step 5: Predict over new data]: #step-5-predict-over-new-data 

In this example, we'll walk through creating a regression model using sample automobile data. The goal is to predict the price of an automobile using different variables such as make and technical specifications. 

### Step 1: Get data

There are a number of sample datasets included with ML Studio, and you can import data from many different sources. For this example, we will use the included sample dataset that represents automobile price data.

1. Start a new experiment by clicking **+NEW** at the bottom of the ML Studio window and selecting **EXPERIMENT**. Rename the experiment from "Untitled" to something meaningful, like "Automobile price prediction".

2. Enter "automobile" in the search box to find the dataset labeled **Automobile price data (Raw)**. 

3. Drag the dataset to the experiment canvas. 

![Dataset][screen1]

To see what's in the dataset, right-click the output port at the bottom of the automobile dataset and select **Visualize**. The variables in the dataset appear as columns, and each instance of an automobile appears as a row. The right-most column "price" is the target variable we're going to try to predict. 

Close the visualization window by clicking the "**x**" in the upper-right corner.

### Step 2: Pre-process data

A dataset usually requires some pre-processing before it can be analyzed. Notice the missing values present in the columns of various rows - to analyze the data, these missing values need to be cleaned. In our case, we'll just remove any rows that have missing values. Notice also that the "normalized-losses" column has a very large proportion of missing values, so we'll just exclude that column from the model altogether. 

> [WACOM.NOTE] Cleaning the missing values from input data is a prerequisite for using most of the modules. 

First we'll convert the dataset into the internal ML Studio format. This allows the experiment to work with the data efficiently.

1. Find the **Convert To Dataset** module and drag it to the experiment canvas. Connect the module to the dataset by clicking the output port at the bottom of the dataset and dragging to the input port at the top of the **Convert to Dataset** module.

2. Left-click the **Convert to Dataset** module to select it. The module properties are displayed in the pane on the right - leave these to the default values. 

    ![Convert to Dataset module][screen2]

    The module will convert the data to a *Data Table* data type, which is the internal binary format for ML Studio.  

Now we'll remove the "normalized-losses" column, and remove any row that has missing data. 

1. Drag the **Project Columns** module to the experiment canvas and connect it to the output port of the **Convert To Dataset** module. This module allows us to select which columns of data we want to include or exclude in the model. 

2. Select the **Project Columns** module and click **Launch column selector** in the properties pane. 

	- Make sure **All columns** is selected in the filter dropdown **Begin With**. This directs **Project Columns** to pass all columns through (except for the ones we're about to exclude). 
	- In the next row, select **Exclude** and **column names**, and then type "normalized-losses" for the column name. 
	- Click the check mark **OK** button to close the column selector.

    ![Select columns][screen3]
	
	The properties pane for **Project Columns** indicates that it will pass through all columns from the dataset except "normalized-losses". 

    ![Project Columns properties][screen4]

    >**Tip** - You can add a comment to a module by double-clicking the module and entering text. This can help you see at a glance what the module is doing in your experiment. In this case, double-click the **Project Columns** module and enter the comment "Exclude normalized-losses". 

3. Drag the **Missing Values Scrubber** module to the experiment canvas and connect it to the **Project Columns** module. In the properties pane, select **Remove entire row** under **For missing values** to clean the data by removing rows that have missing values.  Double-click the module and enter "Remove missing value rows".

4. Run the experiment by clicking **RUN** below the experiment canvas.

When the experiment finishes, all the modules will have a green check mark to indicate that they completed successfully. Notice also the "Finished running" status in the upper-right hand corner.

![First experiment run][screen5]

All the experiment has done up to this point is clean the data. To view the cleaned dataset, right-click the output port of the **Missing Values Scrubber** module and select **Visualize**. Notice that the "normalized-losses" column is no longer included, and there are no missing values.

Now that the data is clean, we're ready to specify what features we're going to use in the predictive model.

### Step 3: Define features

Finding a good set of feature variables requires experimentation and knowledge about the problem at hand. Some variables are better for predicting the target than others. Also, some features have a strong correlation with other features, for example *city-mpg* versus *highway-mpg*, so they will not add much new information to the model and can be removed.  

Let's build a model that uses a small subset of features. You can come back and select different features, run the experiment again, and see if you get better results. As a first guess, we'll select the following columns with the **Project Columns** module (note that we include the *price* value that we're going to predict):

	make, body-style, wheel-base, engine-size, horsepower, peak-rpm, highway-mpg, price

1. Drag another **Project Columns** module to the experiment canvas and connect it to the **Missing Values Scrubber** module. Double-click the module and enter "Select features for prediction".

2. Click **Launch column selector** in the properties pane. 

3. In the column selector, select **No columns** for **Begin With**, then select **Include** and **column names** in the filter row. Enter our list of column names. This directs the module to pass through only columns we specify.

	Because we've run the experiment once, the **Project Columns** module is aware of the column definitions in our data. When you click the column names box, a list of columns is displayed. Select the columns you want one at a time and they will be added to the list. 

4. Click **OK**.

![Select columns][screen6]

This will produce the dataset that will be used in the learning algorithm in the next steps. Later you can return and try again with a different selection of features. 

### Step 4: Choose and apply a learning algorithm

Now that the data is ready, constructing a predictive model consists of training and testing. In this step we'll train a linear regression model, and in the next step we'll test it. 

1. Split the data into training and testing sets. Select and drag the **Split** module to the experiment canvas and connect it to the output of the last **Project Columns** module. Set **Fraction of rows in the first output dataset** to 0.75. This way, we'll use 75% of the data to train the model, and hold back 25% for testing.

	> [WACOM.NOTE] By changing the **Random seed** parameter, you can produce different random samples for training and testing. This parameter controls the seeding of the pseudo-random number generator.

2. To select the learning algorithm, expand the **Machine Learning** category in the module palette to the left of the canvas and then expand **Initialize Model**. This displays several categories of modules that can be used to initialize a learning algorithm. 

	For this example experiment, select the **Linear Regression** module under the **Regression** category and drag it to the experiment canvas. 

3. Find and drag the **Train Model** module to the experiment. Click **Launch column selector** and select the *price* column. 

	![Select "price" column][screen7]

4. Connect the left input port to the output of the **Linear Regression** module, and the right input port to the training data output (left port) of the **Split** module.  

5. Run the experiment. 

The result is a trained regression model that can be used to score new samples to make predictions. 

![Applying the learning algorithm][screen8]

### Step 5: Predict over new data 

Now that we've trained the model, we can use it to score the other 25% of our data and see how well our model functions. 

1. Find and drag the **Score Model** module to the experiment canvas and connect the left input port to the output of the **Train Model** module, and the right input port to the test data output (right port) of the **Split** module.  

2. Run the experiment and view the output from the **Score Model** module (right-click and select **Visualize**). The output will show the predicted values for price along with the known values from the test data.  

3. Finally, to test the quality of the results, select and drag the **Evaluate Model** module to the experiment canvas, and connect the left input port to the output of the **Score Model** module (there are two input ports because the **Evaluate Model** module can be used to compare two models). Run the experiment and view the output from the **Evaluate Model** module to see different metrics that describe the quality of the model.  

![Scoring new data][screen9]

### What's next?

Now that you have your experiment set up, you can iterate to try to improve the model. For instance, you can change the features you use in your prediction. Or you can modify the properties of the **Linear Regression** algorithm or try a different algorithm altogether. You can even add multiple algorithms to your experiment at one time and compare them (two at a time) by using the **Evaluate Model** module. Use the **SAVE AS** button below the experiment canvas to preserve copies of different iterations of your experiment.

When you're satisfied with your model, you can publish it as a web service to be used to predict automobile prices using new data. See the ML Studio help topic **Publishing Experiments** for more details.

For a more extensive and detailed walkthrough of creating, training, scoring, and publishing a predictive model, see [Walkthrough: Develop a predictive solution with Azure Machine Learning](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-walkthrough-develop-predictive-solution/). 


<!-- Images -->
[screen1]:./media/machine-learning-create-experiment/screen1.png
[screen2]:./media/machine-learning-create-experiment/screen2.png
[screen3]:./media/machine-learning-create-experiment/screen3.png
[screen4]:./media/machine-learning-create-experiment/screen4.png
[screen5]:./media/machine-learning-create-experiment/screen5.png
[screen6]:./media/machine-learning-create-experiment/screen6.png
[screen7]:./media/machine-learning-create-experiment/screen7.png
[screen8]:./media/machine-learning-create-experiment/screen8.png
[screen9]:./media/machine-learning-create-experiment/screen9.png
