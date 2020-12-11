---
title: "Tutorial: Create the predictive model with a Notebook (part 1 of 2)"
titleSuffix: Azure Machine Learning
description: Learn how to build and deploy a machine learning model using code in a Jupyter Notebook, so you can use it to predict outcomes in Microsoft Power BI.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
ms.author: samkemp
author: samuel100
ms.reviewer: sdgilley
ms.date: 12/11/2020
---

# Tutorial: Power BI integration - create the predictive model with a Notebook (part 1 of 2)

In the first part of this tutorial, you train and deploy a predictive machine learning model using code in a Jupyter Notebook. In part 2, you'll then use the model to predict outcomes in Microsoft Power BI.

In this tutorial, you:

> [!div class="checklist"]
> * Create a Jupyter Notebook
> * Create an Azure Machine Learning compute instance
> * Train a regression model using scikit-learn
> * Deploy the model to a real-time scoring endpoint

There are three different ways to create and deploy the model you'll use in Power BI.  This article covers Option A: Train and deploy models using Notebooks.  This option shows a code-first authoring experience using Jupyter notebooks hosted in Azure Machine Learning studio. 

You could instead use:

* [Option B: Train and deploy models using designer](tutorial-powerbi-designer-model.md)- a low-code authoring experience using Designer (a drag-and-drop user interface).
* [Option C: Train and deploy models using automated ML](tutorial-powerbi-automated-model.md) - a no-code authoring experience that fully automates the data preparation and model training.


## Prerequisites

- An Azure subscription ([a free trial is available](https://aka.ms/AMLFree)). 
- An Azure Machine Learning workspace. If you do not already have a workspace, follow [how to create an Azure Machine Learning Workspace](./how-to-manage-workspace.md#create-a-workspace).
- Introductory knowledge of the Python language and machine learning workflows.

## Create a notebook and compute

In the [Azure Machine Learning Studio](https://ml.azure.com) homepage select **Create new** followed by **Notebook**:

:::image type="content" source="media/tutorial-powerbi/create_notebook.png" alt-text="Screenshot showing how to create a notebook":::
 
You are shown a dialog box to **Create a new file** enter:

- A filename for your notebook (for example `my_model_notebook`)
- Change the **File Type** to **Notebook**

Select **Create**. Next, you need to create some compute and attach it to your notebook in order to run code cells. To do this, select the plus icon at the top of the notebook:

:::image type="content" source="media/tutorial-powerbi/create_compute.png" alt-text="Screenshot showing how to create compute instance":::

Next, on the **Create compute instance** page:

1. Choose a CPU virtual machine size - for the purposes of this tutorial a **Standard_D11_v2** (two cores, 14-GB RAM) will be fine.
1. Select **Next**. 
1. On the **Configure Settings** page provide a valid **Compute name** (valid characters are upper and lower case letters, digits, and the - character).
1. Select **Create**.

You may notice on the notebook that the circle next to **Compute** has turned cyan, indicating the compute instance is being created:

:::image type="content" source="media/tutorial-powerbi/creating.png" alt-text="Screenshot showing compute being created":::

> [!NOTE]
> It can take around 2-4 minutes for the compute to be provisioned.

Once the compute is provisioned, you can use the notebook to execute code cells. For example, type into the cell:

```python
import numpy as np

np.sin(3)
```

Followed by **Shift-Enter** (or **Control-Enter** or select the play button next to the cell). You should see the following output:

:::image type="content" source="media/tutorial-powerbi/simple_sin.png" alt-text="Screenshot showing cell execution":::

You are now ready to build a Machine Learning model!

## Build a model using scikit-learn

In this tutorial, you use the [Diabetes dataset](https://www4.stat.ncsu.edu/~boos/var.select/diabetes.html), which is made available in [Azure Open Datasets](https://azure.microsoft.com/services/open-datasets/). 


### Import data

To import your data, copy-and-paste the code below into a new **code cell** in your notebook:

```python
from azureml.opendatasets import Diabetes

diabetes = Diabetes.get_tabular_dataset()
X = diabetes.drop_columns("Y")
y = diabetes.keep_columns("Y")
X_df = X.to_pandas_dataframe()
y_df = y.to_pandas_dataframe()
X_df.info()
```

The `X_df` pandas data frame contains 10 baseline input variables (such as age, sex, body mass index, average blood pressure, and six blood serum measurements). The `y_df` pandas data frame is the target variable containing a quantitative measure of disease progression one year after baseline. There are a total of 442 records.

### Train model

Create a new **code cell** in your notebook and copy-and-paste the code snippet below, which constructs a ridge regression model and serializes the model using Python's pickle format:

```python
import joblib
from sklearn.linear_model import Ridge

model = Ridge().fit(X,y)
joblib.dump(model, 'sklearn_regression_model.pkl')
```

### Register the model

In addition to the content of the model file itself, your registered model will also store model metadata - model description, tags, and framework information - that will be useful when managing and deploying models in your workspace. Using tags, for instance, you can categorize your models and apply filters when listing models in your workspace. Also, marking this model with the scikit-learn framework will simplify deploying it as a web service, as we'll see later.

Copy-and-paste the code below into a new **code cell** in your notebook:

```python
import sklearn

from azureml.core import Workspace
from azureml.core import Model
from azureml.core.resource_configuration import ResourceConfiguration

ws = Workspace.from_config()

model = Model.register(workspace=ws,
                       model_name='my-sklearn-model',                # Name of the registered model in your workspace.
                       model_path='./sklearn_regression_model.pkl',  # Local file to upload and register as a model.
                       model_framework=Model.Framework.SCIKITLEARN,  # Framework used to create the model.
                       model_framework_version=sklearn.__version__,  # Version of scikit-learn used to create the model.
                       sample_input_dataset=X,
                       sample_output_dataset=y,
                       resource_configuration=ResourceConfiguration(cpu=2, memory_in_gb=4),
                       description='Ridge regression model to predict diabetes progression.',
                       tags={'area': 'diabetes', 'type': 'regression'})

print('Name:', model.name)
print('Version:', model.version)
```

You can also view the model in Azure Machine Learning Studio by navigating to **Endpoints** in the left hand-menu:

:::image type="content" source="media/tutorial-powerbi/model.png" alt-text="Screenshot showing model":::

### Define the scoring script

When deploying a model to be integrated into Microsoft Power BI, you need to define a Python *scoring script* and custom environment. The scoring script contains two functions:

1. `init()` - this function is executed once the service starts. This function loads the model (note that the model is automatically downloaded from the model registry) and deserializes it.
1. `run(data)` - this function is executed when a call is made to the service with some input data that needs scoring. 

>[!NOTE]
> We use Python decorators to define the schema of the input and output data, which is important for the Microsoft Power BI integration to work.

Copy-and-paste the code below into a new **code cell** in your notebook. The code snippet below has a cell magic that will write the code to a filed named score.py.

```python
%%writefile score.py

import json
import pickle
import numpy as np
import pandas as pd
import os
import joblib
from azureml.core.model import Model

from inference_schema.schema_decorators import input_schema, output_schema
from inference_schema.parameter_types.numpy_parameter_type import NumpyParameterType
from inference_schema.parameter_types.pandas_parameter_type import PandasParameterType


def init():
    global model
    # Replace filename if needed.
    path = os.getenv('AZUREML_MODEL_DIR') 
    model_path = os.path.join(path, 'sklearn_regression_model.pkl')
    # Deserialize the model file back into a sklearn model.
    model = joblib.load(model_path)


input_sample = pd.DataFrame(data=[{
    "AGE": 5,
    "SEX": 2,
    "BMI": 3.1,
    "BP": 3.1,
    "S1": 3.1,
    "S2": 3.1,
    "S3": 3.1,
    "S4": 3.1,
    "S5": 3.1,
    "S6": 3.1
}])

# This is an integer type sample. Use the data type that reflects the expected result.
output_sample = np.array([0])

# To indicate that we support a variable length of data input,
# set enforce_shape=False
@input_schema('data', PandasParameterType(input_sample))
@output_schema(NumpyParameterType(output_sample))
def run(data):
    try:
        print("input_data....")
        print(data.columns)
        print(type(data))
        result = model.predict(data)
        print("result.....")
        print(result)
    # You can return any data type, as long as it is JSON serializable.
        return result.tolist()
    except Exception as e:
        error = str(e)
        return error
```

### Define the custom environment

Next we need to define the environment to score the model - we need to define in this environment the Python packages required by the scoring script (score.py) defined above such as pandas, scikit-learn, etc.

To define the environment, copy-and-paste the code below into a new **code cell** in your notebook:

```python
from azureml.core.model import InferenceConfig
from azureml.core import Environment
from azureml.core.conda_dependencies import CondaDependencies

environment = Environment('my-sklearn-environment')
environment.python.conda_dependencies = CondaDependencies.create(pip_packages=[
    'azureml-defaults',
    'inference-schema[numpy-support]',
    'joblib',
    'numpy',
    'pandas',
    'scikit-learn=={}'.format(sklearn.__version__)
])

inference_config = InferenceConfig(entry_script='./score.py',environment=environment)
```

### Deploy the model

To deploy the model, copy-and-paste the code below into a new **code cell** in your notebook:

```python
service_name = 'my-diabetes-model'

service = Model.deploy(ws, service_name, [model], inference_config, overwrite=True)
service.wait_for_deployment(show_output=True)
```

>[!NOTE]
> It can take 2-4 minutes for the service to be deployed.

You should see the following output of a successfully deployed service:

```txt
Tips: You can try get_logs(): https://aka.ms/debugimage#dockerlog or local deployment: https://aka.ms/debugimage#debug-locally to debug if deployment takes longer than 10 minutes.
Running......................................................................................
Succeeded
ACI service creation operation finished, operation "Succeeded"
```

You can also view the service in Azure Machine Learning Studio by navigating to **Endpoints** in the left hand-menu:

:::image type="content" source="media/tutorial-powerbi/endpoint.png" alt-text="Screenshot showing endpoint":::

It is recommended that you test the webservice to ensure that it works as expected. Navigate back to your notebook by selecting **Notebooks** in the left-hand menu in Azure Machine Learning Studio. Copy-and-paste the code below into a new **code cell** in your notebook to test the service:

```python
import json


input_payload = json.dumps({
    'data': X_df[0:2].values.tolist(),
    'method': 'predict'  # If you have a classification model, you can get probabilities by changing this to 'predict_proba'.
})

output = service.run(input_payload)

print(output)
```

The output should look like the following json structure: `{'predict': [[205.59], [68.84]]}`.

## Next steps

In this tutorial, you saw how to build and deploy a model in such a way that they can be consumed by Microsoft Power BI. In the next part, you learn how to consume this model from a Power BI report.

> [!div class="nextstepaction"]
> [Tutorial: Consume model in Power BI](https://docs.microsoft.com/power-bi/)
