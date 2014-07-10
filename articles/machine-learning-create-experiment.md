<properties title="Create your first experiment in Azure Machine Learning Studio" pageTitle="Create your first experiment in Machine Learning Studio | Azure" description="How to create and iterate on an experiment in Azure Machine Learning Studio" metaKeywords="" services="machine-learning" solutions="" documentationCenter="" authors="garye" videoId="" scriptId="" />

#Create your first experiment in Azure Machine Learning Studio 
 
A predictive analytics experiment, at its core, consists of components to *create a model*, *train the model*, and *score and test the model*. You can combine these to create an experiment that takes data, trains a model against it, and applies the model to new data. You can also add modules to pre-process data and select features, split data into training and test sets, and evaluate or cross-validate the quality of your model.  

Microsoft Azure Cloud Machine Learning Studio is designed to help you develop and iterate on a predictive analytics experiment.

##Five Steps to Creating an Experiment 

The five basic steps you follow to build an experiment in ML Studio allow you to create, train, and score your model:  

- Create a Model 
	- [Step 1: Get data]
	- [Step 2: Pre-process data]
	- [Step 3: Define, extract, and enrich features]
- Train the Model 
	- [Step 4: Choose and apply a learning algorithm]
- Score and Test the Model 
	- [Step 5: Predict over new data] 

[Step 1: Get data]: #step-1:-get-data
[Step 2: Pre-process data]: #step-2:-pre-process-data
[Step 3: Define, extract, and enrich features]: #step-3:-Define,-extract,-and-enrich-features
[Step 4: Choose and apply a learning algorithm]: #Step-4:-Choose-and-apply-a-learning-algorithm
[Step 5: Predict over new data]: #Step-5:-Predict-over-new-data 

There are two types of predictive analytics you may want to perform with your data: 

- **Classification** - Predict variable whose values are discrete labels.
- **Regression** - Predict variable that can take a continuous range of values. 

In this example, we'll walk through a regression task using automobile price and model data. The goal is to predict the price of an automobile using different variables such as make and technical specifications. 

> [WACOM.NOTE] In addition to classification and regression, it is also possible to perform recommendation and clustering tasks. Because the workflows for these are somewhat different, they are not covered here. 

### Step 1: Get data

There are a number of sample datasets included with ML Studio, and you can import data from many different sources. For this example, we will use the included sample dataset that represents automobile price data.

1. Start a new experiment by clicking **+NEW** at the bottom of the ML Studio window and selecting **EXPERIMENT**. Rename the experiment from "Untitled" to something meaningful. 

2. Enter "automobile" in the search box to find the dataset labeled **Automobile price data (Raw)**. 

3. Drag the dataset to the experiment canvas. 

4. Right-click the output port at the bottom of the automobile dataset and select **Visualize**. This opens the dataset for viewing. 

In the dataset, the variables appear as columns and the instances of automobile appear as rows. The right-most column "price" is the target variable we are trying to predict. 

Close the visualization window by clicking the "x" in the upper-right corner.

### Step 2 - Pre-process data

A dataset usually requires some pre-processing before it can be analyzed. Notice the missing values present in the columns of various rows (for this particular set each missing value is denoted by "?"). To analyze the data, these have to be cleaned. Notice also that the "normalized losses" column has a very large proportion of missing values, so we will exclude that column from the model altogether. 

1. Select and drag the **Convert To Dataset** module to the experiment canvas and connect it to the dataset. In the module properties pane on the right, select "ReplaceVlaues" for the **Action** parameter, "Missing" for the **Replace** parameter, and enter "?" for **New value**. This will convert the data to a Data Table, the internal binary format for ML Studio, and represent missing string values with "?".  

2. Select and drag the **Project Columns** module to the experiment canvas and connect it to the output from the **Convert To Dataset** module.  

3. Select the **Project Columns** module and click **Launch column selector** in the module parameter pane. 
	- Make sure "All columns" is selected in the filter dropdown under **Select columns** (this directs **Project Columns** to pass all columns through except for the ones we are about to exclude). 
	- Click the **+** button. 
	- In the second filter dropdown, select "Exclude column names" and enter "normalized-losses" for the column name. 
	- Click the check mark button to close the column selector.
	
	**Project Columns** will now pass through all columns from the dataset except "normalized-losses".  

4. Select and drag the **Missing Values Scrubber** module to the experiment canvas and connect it to the **Project Columns** module. In the properties pane, select "Remove entire row" under **For missing values** to clean the rows with missing values.  

5. Run the experiment to clean the data. 

To view the cleaned dataset, right-click the output port of the **Missing Values Scrubber** module and select **Visualize**. Notice that the "normalized-losses" column is no longer included, and missing string values have been replaced with "?".

> [WACOM.NOTE] Cleaning the missing values from input data is a prerequisite for using most of the modules. 

### Step 3 - Define, extract and enrich features

Certain variables are better for predicting the target than others. Finding a good set of feature variables requires experimentation and knowledge about the problem at hand. Also, some features have a strong correlation with other features, for example *city-mpg* versus *highway-mpg*, so they will not add much new information to the model and can be removed. 

Let’s first build a model that uses a small subset of features:  

1. Find and drag another **Project Columns** module to the experiment. Connect it to the **Missing Values Scrubber** module. 

2. As a first guess, select the following columns in the **Project Columns** module by using the column selector: *make*, *body-style*, *wheel-base*, *engine-size*, *horsepower*, *peak-rpm*, *highway-mpg*, *price*. Do this by selecting "Column names" in the dropdown and then entering this list of column names.

3. The dataset doesn’t yet contain information about what we’re trying to predict. To provide this information, drag the **Metadata Editor** module to the experiment canvas and connect it to the last **Project Columns** module. Use the **Metadata Editor** module to mark the column *price* as a *label* (in ML Studio, a *label* is a prediction target):  

	* use the column selector to select the price column, and 
	
	* select "Labels" in the **Fields** parameter. 

4. The feature variables *make* and *body-style* are categorical string variables. Mark these two columns as such by adding a new **Metadata Editor** module, connecting it to the previous **Metadata Editor** module, and setting the following parameters:  

	* use the column selector to select the *make* and *body-style* columns, 
	
	* under **Data type** select "String", and 
	
	* under **Categorical** select "Categorical"

	> [WACOM.NOTE] It is important to mark categorical columns as such using the **Metadata Editor** module. This step ensures that information about possible categories (levels) is propagated when data is sampled or split.  

5. Run the experiment. 

This will produce the dataset that will be used in the learning algorithm in the next steps. Later you can return and try again with different selections of features. 

To view the dataset so far after the experiment finishes running, right-click the output port of the last **Metadata Editor** and select **Visualize**.

### Step 4 - Choose and apply a learning algorithm

Constructing a predictive model consists of training, validation, and testing. Here we will use the **Cross Validate Model** module for training and validation, and in the next section we'll walk through testing. 

1. Split the data into training and testing sets: Drag the **Split** module to the experiment canvas and connect it to the output of the last **Metadata Editor** module. Set **Fraction of rows in the first output dataset** to 0.75. This way, we’ll use 75% of the data to cross-validate and train the final model, and hold back 25% for final testing.

	> [WACOM.NOTE] By changing the **Random seed** parameter, you can produce different random samples for training and testing. This parameter controls the seeding of the pseudo-random number generator.

2. To choose a learning algorithm, expand the **Machine Learning** category in the module palette to the left of the canvas and then expand **Initialize Model**. This displays several categories of modules that can be used to initialize a learning algorithm. 

	For this experiment, select the **Boosted Decision Tree Binary Classification Model** module under the **Classification** category and drag it to the experiment canvas. 

3. To evaluate the quality of the selected learning algorithm against your dataset, you can use cross-validation. Drag the **Cross Validate Model** module to the experiment canvas and connect the **Boosted Decision Tree Binary Classification Model** module to the **Untrained model** input port, and connect the training data (**Results dataset1** of the **Split** module) to the **Dataset** input port.

	In the **Cross Validate Model**, select the "price" column for the **Label column** property. 

4. Run the experiment and examine the output from the **Cross Validate Model** module. The results should show the model quality metrics for each cross-validation fold. 

####Tune Model Parameters 

Next, let’s attempt to tune the model parameters: 

1. Click the **Boosted Decision Tree Binary Classification Model** module to display the learner parameters.  

2. Try increasing the **Maximum number of leaves per tree** and **Number of trees constructed** parameters and decreasing the **Minimum number of training instances required to form a leaf** parameter.  

3. Run the experiment and look at the cross-validation output.  

The quality metrics should have improved. You can repeat these steps a few times with different parameter settings to demonstrate which choice gives the most accurate result. You can also try different models for comparison, such as linear regression. 

Once cross-validation is complete, the next step is to train the model. 

1. Select and drag the **Train Model** module to the experiment. Clear the **Label column** parameter, as the target column is already specified by **Metadata Editor**.  

5. Connect the **Untrained model** input port to the output of the **Boosted Decision Tree Binary Classification Model** module, and the **Dataset** input port to the training data output (**Results dataset1**) of the **Split** module.  

6. Run the experiment. 

The result is a trained regression model that can be used to score new samples (make predictions). 

### Step 5 - Predict over new data 

1. To use the trained model, drag the **Score Model** module to the experiment canvas and connect the **Trained model** input port of the **Score Model** module to the **Trained model** output port of the **Train Model** module, and the **Dataset** input port of the **Score Model** module to the test data output port (**Results dataset1**) of the **Split** module.  

2. Run the experiment and view the output from the **Score Model** module. The output will show the predicted values for price along with the known values from the test data.  

	> [WACOM.NOTE] The input dataset of **Score Model** must have the same columns as the dataset used to train the model. Additional columns may be present, but they will be ignored. Also, any categorical columns must have the same levels.  

3. Finally, to test the quality of the results, drag the **Evaluate Model** module to the experiment canvas, and connect it to the output from the **Score Model** module. Run the experiment and view the output from the **Evaluate Model** module to see different metrics that describe the quality of the model.  

