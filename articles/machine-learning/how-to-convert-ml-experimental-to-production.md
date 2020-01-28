---
title: #Required; page title displayed in search results. Include the word "tutorial". Include the brand.
description: #Required; article description that is displayed in search results. Include the word "tutorial".
author: #Required; your GitHub user alias, with correct capitalization.
ms.author: #Required; microsoft alias of author; optional team alias.
ms.service: #Required; service per approved list. service slug assigned to your service by ACOM.
ms.topic: tutorial #Required
ms.date: #Required; mm/dd/yyyy format.
---

<!---Recommended: Remove all the comments in this template before you
sign-off or merge to master.--->

<!---Tutorials are scenario-based procedures for the top customer tasks
identified in milestone one of the
[Content + Learning content model](contribute-get-started-mvc.md).
You only use tutorials to show the single best procedure for completing
an approved top 10 customer task.
--->

# Tutorial: Convert ML Experimental Code to Production Code
<!---Required:
Starts with "Tutorial: "
Make the first word following "Tutorial:" a verb.
--->

A machine learning project requires experimentation where hypotheses are tested with agile tools like Jupyter notebook using real datasets. Once the model is ready for production, the model code should be placed in a production code repository. In some cases, the model code must be converted to Python scripts to be placed in the production code repository. This tutorial covers a recommended approach on how to export experimentation code to Python scripts.  
<!---Required:
Lead with a light intro that describes, in customer-friendly language,
what the customer will learn, or do, or accomplish. Answer the
fundamental “why would I want to do this?” question.
--->

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Clean unnecessary code
> * Refactor Jupyter notebook code into functions
> * Create Python scripts for related tasks
> * Create unit tests
<!---Required:
The outline of the tutorial should be included in the beginning and at
the end of every tutorial. These will align to the **procedural** H2
headings for the activity. You do not need to include all H2 headings.
Leave out the prerequisites, clean-up resources and next steps--->

If you don’t have a <service> subscription, create a free trial account...
<!--- Required, if a free trial account exists
Because tutorials are intended to help new customers use the product or
service to complete a top task, include a link to a free trial before the
first H2, if one exists. You can find listed examples in
[Write tutorials](contribute-how-to-mvc-tutorial.md)
--->

<!---Avoid notes, tips, and important boxes. Readers tend to skip over
them. Better to put that info directly into the article text.--->

## Prerequisites

- Generate the MLOpsPython template (https://github.com/microsoft/MLOpsPython/generate) 
and use the experimentation/Diabetes Ridge Regression Training.ipynb and experimentation/Diabetes Ridge Regression Scoring.ipynb notebooks.
<!---If you need them, make Prerequisites your first H2 in a tutorial. If
there’s something a customer needs to take care of before they start (for
example, creating a VM) it’s OK to link to that content before they
begin.--->

## Remove all unnecessary code

<!---Required:
Tutorials are prescriptive and guide the customer through an end-to-end
procedure. Make sure to use specific naming for setting up accounts and
configuring technology.
Don't link off to other content - include whatever the customer needs to
complete the scenario in the article. For example, if the customer needs
to set permissions, include the permissions they need to set, and the
specific settings in the tutorial procedure. Don't send the customer to
another article to read about it.
In a break from tradition, do not link to reference topics in the
procedural part of the tutorial when using cmdlets or code. Provide customers what they need to know in the tutorial to successfully complete
the tutorial.
For portal-based procedures, minimize bullets and numbering.
For the CLI or PowerShell based procedures, don't use bullets or
numbering.
--->

First, all unnecessary code needs to be removed. Removing unnecessary code will also make the code more maintainable. In this section, you'll remove code from the Diabetes Ridge Regression Training Notebook. The statements printing the shape of X and y and the cell calling features.describe are just for data exploration and can be removed. After removing unnecessary code, the Diabetes Ridge Regression Training Notebook should look like the following code without markdown:

```python
from sklearn.datasets import load_diabetes
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
import joblib
 
X, y = load_diabetes(return_X_y=True)

X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=0)
data = {"train": {"X": X_train, "y": y_train},
        "test": {"X": X_test, "y": y_test}}

alpha = 0.5

reg = Ridge(alpha=alpha)
reg.fit(data["train"]["X"], data["train"]["y"])

preds = reg.predict(data["test"]["X"])
print("mse", mean_squared_error(preds, data["test"]["y"]))

model_name = "sklearn_regression_model.pkl"
joblib.dump(value=reg, filename=model_name)
```

## Refactor code into functions

Second, the Jupyter code needs to be refactored into functions. Refactoring code into function makes unit testing easier and makes the code more maintainable. In this section, you'll refactor:
•	The Diabetes Ridge Regression Training Notebook
•	The Diabetes Ridge Regression Scoring Notebook

### Refactor Diabetes Ridge Regression Training Notebook into functions
In the Diabetes Ridge Regression Training notebook, complete the following steps:
- Create a function called train_model, which takes the parameters data and alpha and returns a model. 
- Copy the code under the headings “Train Model on Training Set” and “Validate Model on Validation Set” into the train_model function

The train_model function should be like the following code:

```python
def train_model(data, alpha):
    reg = Ridge(alpha=alpha)
    reg.fit(data["train"]["X"], data["train"]["y"])
    preds = reg.predict(data["test"]["X"])
    print("mse", mean_squared_error(
        preds, data["test"]["y"]))
    return reg
```

Once the train_model function is created, replace the code under the headings “Train Model on Training Set” and “Validate Model on Validation Set” with the following statement:

```python
reg = train_model(data, alpha)
```
The previous statement calls the train_model function passing the data and alpha parameters and returns the model  

In the Diabetes Ridge Regression Training notebook, complete the following steps:
- Create a new function call main, which takes no parameters and returns nothing.
- Copy the code under the headings “Load Data”, “Split Data into Training and Validation Sets”, and “Save Model” into the main function
- Copy the newly created call to train_model into the main function 

The main function should be like the following code:

```python
def main():

    model_name = "sklearn_regression_model.pkl"
    alpha = 0.5
    
    X, y = load_diabetes(return_X_y=True)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=0)
    data = {"train": {"X": X_train, "y": y_train},
            "test": {"X": X_test, "y": y_test}}

    reg = train_model(data, alpha)

    joblib.dump(value=reg, filename=model_name)
```

Once the main function is created, replace all the code under the headings “Load Data”, “Split Data into Training and Validation Sets”, and “Save Model” along with the newly created call to train_model with the following statement:

```python
main()
```

After refactoring, your Diabetes Ridge Regression Training notebook should look like the following code without the markdown:

```python
from sklearn.datasets import load_diabetes
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
import joblib


def train_model(data, alpha):
    reg = Ridge(alpha=alpha)
    reg.fit(data["train"]["X"], data["train"]["y"])
    preds = reg.predict(data["test"]["X"])
    print("mse", mean_squared_error(
        preds, data["test"]["y"]))
    return reg

def main():

    model_name = "sklearn_regression_model.pkl"
    alpha = 0.5
    
    X, y = load_diabetes(return_X_y=True)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=0)
    data = {"train": {"X": X_train, "y": y_train},
            "test": {"X": X_test, "y": y_test}}

    reg = train_model(data, alpha)

    joblib.dump(value=reg, filename=model_name)

main()
```

### Refactor Diabetes Ridge Regression Scoring Notebook into functions
In the Diabetes Ridge Regression Scoring notebook, complete the following steps:
- Create a new function called init(), which takes no parameters and return nothing
- Copy the code under the “Load Model” heading into the init function

The init function should look like the following code:

```python
def init():
    model_path = Model.get_model_path(
        model_name="sklearn_regression_model.pkl")
    model = joblib.load(model_path)
```

Once the init function has been created, replace all the code under the heading “Load Model” with a single call to init as follows:

```python
init()
```

In the Diabetes Ridge Regression Scoring notebook, complete the following steps:
- Create a new function called run, which takes raw_data and request_headers as parameters and returns the following statement:

```python
{"result": result.tolist()}
```
- Copy the code under the “Prepare Data” and “Score Data” headings into the run function

The run function should look like the following code(Remember to remove the statements that set the variables raw_data and request_headers, which will be used later when the run function is called):

```python
def run(raw_data, request_headers):
    data = json.loads(raw_data)["data"]
    data = numpy.array(data)
    result = model.predict(data)

    return {"result": result.tolist()}
```

Once the run function has been created, replace all the code under the “Prepare Data” and “Score Data” headings with following code:

```python
raw_data = '{"data":[[1,2,3,4,5,6,7,8,9,10],[10,9,8,7,6,5,4,3,2,1]]}'
request_header = {}
prediction = run(raw_data, request_header)
print("Test result: ", prediction)
```
The previous code sets variables raw_data and request_header, calls the run function with raw_data and request_header, and prints the predictions as 'Test result'.

After refactoring, the Diabetes Ridge Regression Scoring notebook should look like the following code without the markdown:

```python
import json
import numpy
from azureml.core.model import Model
import joblib

def init():
    model_path = Model.get_model_path(
        model_name="sklearn_regression_model.pkl")
    model = joblib.load(model_path)

def run(raw_data, request_headers):
    data = json.loads(raw_data)["data"]
    data = numpy.array(data)
    result = model.predict(data)

    return {"result": result.tolist()}

init()
test_row = '{"data":[[1,2,3,4,5,6,7,8,9,10],[10,9,8,7,6,5,4,3,2,1]]}'
request_header = {}
prediction = run(test_row, {})
print("Test result: ", prediction)
```

## Combine related functions in Python files
Third, related functions need to be merged into Python files to better help code reuse. In this section, you'll be creating Python files for the following notebooks:
•	The Diabetes Ridge Regression Training Notebook
•	The Diabetes Ridge Regression Scoring Notebook

### Create Python file for the Diabetes Ridge Regression Training Notebook
Convert your notebook to an executable script by running the following statement in a command prompt, which has Jupyter and the Diabetes Ridge Regression Training notebook in its path:

```
jupyter nbconvert -- to script "Diabetes Ridge Regression Training.ipynb" –output train
```

Once the notebook has been converted to train.py, remove all the comments. Your train.py file should look like the following code:

```python
from sklearn.datasets import load_diabetes
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
import joblib


def train_model(data, alpha):
    reg = Ridge(alpha=alpha)
    reg.fit(data["train"]["X"], data["train"]["y"])
    preds = reg.predict(data["test"]["X"])
    print("mse", mean_squared_error(
        preds, data["test"]["y"]))
    return reg

def main():
    model_name = "sklearn_regression_model.pkl"
    alpha = 0.5
    
    X, y = load_diabetes(return_X_y=True)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=0)
    data = {"train": {"X": X_train, "y": y_train},
            "test": {"X": X_test, "y": y_test}}

    reg = train_model(data, alpha)

    joblib.dump(value=reg, filename=model_name)

main()
```

The train.py file found in the code/training directory in the MLOpsPython repository supports command-line arguments (namely build_id, model_name, and alpha). Support for command-line arguments can be added to your train.py file to support dynamic model names and alpha values, but it's not necessary for the code to execute successfully.

### Create Python file for the Diabetes Ridge Regression Scoring Notebook
Covert your notebook to an executable script by running the following statement in a command prompt that has Jupyter and the Diabetes Ridge Regression Scoring notebook in its path:

```
jupyter nbconvert -- to script "Diabetes Ridge Regression Scoring.ipynb" –output score
```

Once the notebook has been converted to score.py, remove all the comments. Your score.py file should look like the following code:

```python
import json
import numpy
from azureml.core.model import Model
import joblib

def init():
    model_path = Model.get_model_path(
        model_name="sklearn_regression_model.pkl")
    model = joblib.load(model_path)

def run(raw_data, request_headers):
    data = json.loads(raw_data)["data"]
    data = numpy.array(data)
    result = model.predict(data)

    return {"result": result.tolist()}

init()
test_row = '{"data":[[1,2,3,4,5,6,7,8,9,10],[10,9,8,7,6,5,4,3,2,1]]}'
request_header = {}
prediction = run(test_row, request_header)
print("Test result: ", prediction)
```

The train_model function needs modification to instantiate a global variable model so that it's visible throughout the script. Add the following statement at the beginning of the init function:

```python
global model
```

After adding the previous statement, the init function should look like the following code:

```python
def init():
    global model

    # load the model from file into a global object
    model_path = Model.get_model_path(
        model_name="sklearn_regression_model.pkl")
    model = joblib.load(model_path)
```

## Create unit tests for each Python file
Fourth, unit tests need to be created for each Python file, which makes code more robust and easier to maintain. In this section, you'll be creating a unit test for one of the functions in train.py.

Train.py contains two functions: train_model and main. Each function needs a unit test, but we'll only create a single unit test for the train_model function using the Pytest framework in this tutorial.  Pytest isn't the only Python unit testing framework, but it's one of the most popular. For more information about popular Python unit testing frameworks, visit the following links:
- Pytest: https://pytest.org
- Unittest: https://docs.python.org/3/library/unittest.html
- Nose: https://nose.readthedocs.io

A unit test usually contains three main actions:
- Arrange object - creating and setting up necessary objects
- Act on an object
- Assert what is expected

A common condition for train_model is when data and an alpha value are passed. The expected result is that the Ridge.train and Ridge.predict functions should be called. Since machine learning training methods are usually not fast-running, the call to Ridge.train will be mocked. Because the return value of Ridge.train is a mocked object, we'll also mock Ridge.predict. The unit test for train_model testing the passing of data and an alpha value with the expected result of Ridge.train and Ridge.predict functions being called using mocking and the Pytest framework should look like the following code:

```python
import pytest
from code.training.train import train_model

class TestTrain:

    @staticmethod
    def test_train_model(mocker):
        # Arrange
        test_data = {"train": {"X": [[1, 2, 3]], "y": [0]},
                     "test": {"X": [[4, 5, 6]], "y": [0]}}
        test_alpha = 0.5
        mock_ridge_fit = mocker.patch('Ridge.fit')
        mock_ridge_predict = mocker.patch(Ridge.predict')

        # Act
        train_model(test_data, test_alpha)

        # Assert
        mock_ridge_fit.assert_called()
        mock_ridge_predict.assert_called()
```

## Use your own model with MLOpsPython code template
If you have been following the steps in this guide, you'll have a set of scripts that correlate to the train/score/test scripts available in the MLOpsPython repository.  According to the structure mentioned above, the following steps will walk through what is needed to use these files for your own machine learning project:  

1.	Follow the Getting Started Guide
2.	Replace the Training Code
3.	Replace the Score Code
4.	Update the Evaluation Code

### Follow the Getting Started Guide
Following the getting started guide is necessary to have the supporting infrastructure and pipelines to execute MLOpsPython.  We recommended deploying the MLOpsPython code as-is before putting in your own code to ensure the structure and pipeline is working properly.  It's also useful to familiarize yourself with the code structure of the repository.

### Replace Training Code
Replacing the code use to train the model and removing or replacing corresponding unit tests is required for the solution to function with your own code.  Follow these steps specifically:

- Replace `code\training\train.py`. This script is the heart of what trains your model locally or on the Azure ML compute.
- Remove or replace training unit tests found in `tests/unit/code_test.py`

### Replace Score Code
For the model to provide real-time inference capabilities, the score code needs to be replaced. The MLOpsPython template uses the score code to deploy the model to do real-time scoring on ACI, AKS, or Web apps.  If you want to keep scoring, follow these steps specifically:

- Replace ‘code/scoring/score.py’
- Remove or replace unit tests

### Update Evaluation Code
The MLOpsPython template uses the evaluate_model script to compare the performance of the newly trained model and the current production model based on Mean Squared Error. If the performance of the newly trained model is better than the current production, then the pipelines continue. Otherwise, the pipelines are stopped. To keep evaluation, replace all instances of ‘mse’ in ‘code/evaluate/evaluate_model.py’ with the metric that you want. 

To get rid of evaluation, enable the switch to skip the evaluation step in the pipeline.


## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Monitor Azure ML experiment runs and metrics](https://docs.microsoft.com/en-us/azure/machine-learning/how-to-track-experiments)
> [Monitor and collect data from ML web service endpoints](https://docs.microsoft.com/en-us/azure/machine-learning/how-to-enable-app-insight)
> [Data Ingestion Overview] (https://docs.microsoft.com/en-us/azure/machine-learning/overview-data-ingestion)
> [DevOps for a Data Ingestion Pipeline] (https://docs.microsoft.com/en-us/azure/machine-learning/how-to-cicd-data-ingestion


<!--- Required:
Tutorials should always have a Next steps H2 that points to the next
logical tutorial in a series, or, if there are no other tutorials, to
some other cool thing the customer can do. A single link in the blue box
format should direct the customer to the next article - and you can
shorten the title in the boxes if the original one doesn’t fit.
Do not use a "More info section" or a "Resources section" or a "See also
section". --->