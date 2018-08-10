---
title: Train an image classification model with Azure Machine Learning
description: This tutorial shows how to use Azure Machine Learning service to train an image classification model with scikit-learn in a Python Jupyter notebook. 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: tutorial

author: hning86
ms.author: haining
ms.reviewer: sgilley
ms.date: 09/24/2018
#Customer intent: As a professional data scientist, I can build an image classification model with Azure Machine Learning using Python in a Jupyter notebook.
---


# Tutorial #1: Train an image classification model with Azure Machine Learning

This tutorial is **part one of a two-part series**. In this tutorial, you will train a machine learning model both locally and on remote compute resources. You'll use the training and deployment workflow for Azure Machine Learning service (preview).  This tutorial is **part one of a two-part series**.  

You'll learn how to:

> [!div class="checklist"]
> * Set up your development environment
> * Access and examine the data
> * Train a simple logistic regression locally using the popular scikit-learn maching learning library 
> * Traing multiple models on a remote GPU cluster
> * Review training details and register the best model

You'll train a simple logistic regression using the [MNIST](https://en.wikipedia.org/wiki/MNIST_database) dataset and scikit-learn with Azure Machine Learning. 

MNIST is a popular dataset consisting of 70,000 grayscale images. Each image is a handwritten digit of 28x28 pixels, representing a number from 0 to 9. The goal is to create a multi-class classifier to identify the digit a given image represents. For more information about the MNIST dataset, visit [Yan LeCun's website](http://yann.lecun.com/exdb/mnist/).

You'll learn how to select a model and deploy it in [part two of this tutorial](tutorial-deploy-models-with-aml.md) later. 
If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

1. The following resources and assets must be available:
   - [Python 3.5 or higher](https://www.python.org/) installed
   - A package manager, such as [Continuum Anaconda](https://anaconda.org/anaconda/continuum-docs) or [Miniconda](https://conda.io/miniconda.html), installed
   - The Azure Machine Learning SDK for Python installed
   - An Azure Machine Learning Workspace named docs-ws 
   - A local folder named docs-prj

   If these are not yet created or installed, follow the steps in the [Get started with Azure Machine Learning Services](quickstart-get-started.md) article.

1. The following package dependencies (matplotlib and scikit-learn) also installed in the conda environment in which you installed the Azure Machine Learning SDK.

   ```
   conda install -y matplotlib scikit-learn
   ``` 

1. The file [utils.py]() downloaded into your docs-prj folder.

## Get the sample notebook

To try the whole example yourself, download [this Jupyter notebook](https://aka.ms/aml-packages/vision/notebooks/image_classification) into the **docs-prj** folder created during the quickstart.

To run the notebook, execute these commands in your activated conda environment:

```
#go to the directory containing the tutorial notebook
cd <path to docs-prj folder>

#install a conda-aware Jupyter Notebook server if necessary
conda install nb_conda

#start up the notebook server
jupyter notebook
```

## Set up your development environment

All the setup for your development work can be accomplished in Python. You will:

* Import Python modules
* Configure a workspace to enable communication between your local computer and remote resources
* Create a folder to store training scripts
* Create a remote compute target to use for training

### Import modules

Import Python modules you'll need in this session. Also verify the Azure Machine Learning SDK version.

```python
%matplotlib inline
import numpy as np
import matplotlib
import matplotlib.pyplot as plt

import azureml
from azureml.core import Workspace, Project, Run

# check core SDK version number
print("Azure ML SDK Version: ", azureml.core.VERSION)
```

### Load workspace

Instantiate a workspace object from the existing workspace created as part of the prerequisites.  `Workspace.from_config()` will read your **config.json** file in the **aml_config** folder and load the workspace into an object named `ws`.  You'll use `ws` throughout the rest of the code in this tutorial.

```python
ws = Workspace.from_config()
print(ws.name, ws.location, ws.resource_group, ws.location, sep = '\t')
```

### Create folder

You also need to create a local folder and attach it to the workspace with a run history name.  This folder will be used to deliver the necessary code from your computer to the cloud later in this tutorial. The history of all runs will be recorded under the specified run history.


```python
# create a new project or get hold of an existing one.
history_name = 'sklearn-mnist'
proj = Project.attach(history_name = history_name, directory = './sklearn-mnist-proj', workspace_object = ws)
# show project details
proj.get_details()
```

### Create remote compute target

Azure Batch AI Cluster is a managed service that enables data scientists to train machine learning models on clusters of Azure virtual machines, including VMs with GPU support.  You'll use a Batch AI cluster to train your model. This code will create a cluster for you if it does not already exist in your workspace. 

> [!IMPORTANT]
> **Creation of the cluster will take approximately 5 minutes.** If the cluster is already in the workspace this code simply uses it and skips the creation process.


```python
from azureml.core.compute import ComputeTarget, BatchAiCompute
from azureml.core.compute_target import ComputeTargetException

# choose a name for your cluster
batchai_cluster_name = "gpucluster2"

try:
    compute_target = ComputeTarget(workspace = ws, name = batchai_cluster_name)
    print('found compute target. just use it.')
except ComputeTargetException:
    print('creating a new compute target...')
    provisioning_config = BatchAiCompute.provisioning_configuration(vm_size = "STANDARD_NC6", # NC6 is GPU-enabled
                                                                #vm_priority = 'lowpriority', # optional
                                                                autoscale_enabled = True,
                                                                cluster_min_nodes = 1, 
                                                                cluster_max_nodes = 4)

    # create the cluster
    compute_target = ComputeTarget.create(ws, batchai_cluster_name, provisioning_config)
    
    # can poll for a minimum number of nodes and for a specific timeout. 
    # if no min node count is provided it will use the scale settings for the cluster
    compute_target.wait_for_provisioning(show_output = True, min_node_count = None, timeout_in_minutes = 20)
    
     # For a more detailed view of current Batch AI cluster status, use the 'status' property    
    print(compute_target.status.serialize())
```

## Explore data

You now have the necessary modules and compute resources to train a model in the cloud.  Next you'll need the data.

### Download the MNIST dataset

Download the MNIST dataset from Yan LeCun's web site directly and save them in a **data** folder locally.  This downloads training and testing images and labels.


```python
import os
import urllib

os.makedirs('./data', exist_ok = True)

urllib.request.urlretrieve('http://yann.lecun.com/exdb/mnist/train-images-idx3-ubyte.gz', filename = './data/train-images.gz')
urllib.request.urlretrieve('http://yann.lecun.com/exdb/mnist/train-labels-idx1-ubyte.gz', filename = './data/train-labels.gz')
urllib.request.urlretrieve('http://yann.lecun.com/exdb/mnist/t10k-images-idx3-ubyte.gz', filename = './data/test-images.gz')
urllib.request.urlretrieve('http://yann.lecun.com/exdb/mnist/t10k-labels-idx1-ubyte.gz', filename = './data/test-labels.gz')
```

### Display some sample images

Now that you have the compressed files in a local directory you can load them into `numpy` arrays. Then use `matplotlib` to plot 30 random images from the dataset with their labels over them. Now you have an idea of what these images look like and the expected prediction outcome.

You can visit LeCun's website to learn the details of how to unpack these training and test files.


```python
from utils import load_data

# note we also shrink the intensity values (X) from 0-255 to 0-1. This helps the model converge faster.
X_train = load_data('./data/train-images.gz', False) / 255.0
y_train = load_data('./data/train-labels.gz', True).reshape(-1)

X_test = load_data('./data/test-images.gz', False) / 255.0
y_test = load_data('./data/test-labels.gz', True).reshape(-1)

count = 0
sample_size = 30
plt.figure(figsize = (16, 6))
for i in np.random.permutation(X_train.shape[0])[:sample_size]:
    count = count + 1
    plt.subplot(1, sample_size, count)
    plt.axhline('')
    plt.axvline('')
    plt.text(x = 10, y = -10, s = y_train[i], fontsize = 18)
    plt.imshow(X_train[i].reshape(28, 28), cmap = plt.cm.Greys)
plt.show()
```


![random sample of images](./media/tutorial-train-models-with-aml/digits.png)


### Upload MNIST dataset to datastore

You have the data on your local machine.  Now you need to upload it into the cloud so it can be accessed for remote training. The datastore is a convenient construct associated with your workspace for you to upload/download data, and interact with it from your remote compute targets. (If your data is already stored in Azure, you would not need this step.)

The MNIST files are uploaded into a folder named **mnist** at the root of the datastore.

```python
ds = ws.get_default_datastore()
print(ds.datastore_type, ds.account_name, ds.container_name)

ds.upload(src_dir = './data', target_path = 'mnist', overwrite = True, show_progress = True)
```


## Train a local model

You now have everything you need to start training a model. You can train a simple logistic regression model from scikit-learn. 

> This may take a minute or two, depending on your computer configuration.


```python
%%time
from sklearn.linear_model import LogisticRegression

clf = LogisticRegression()
clf.fit(X_train, y_train)
```

Now make predictions on the test set, and calculate accuracy. With almost no effort, you have a 92% accuracy. This is not bad! 


```python
y_hat = clf.predict(X_test)
print(np.average(y_hat == y_test))
```

    0.9202
    

## Train on a remote cluster
Now you can expand on this simple model. You can build multiple versions of the model using different regularization rates.  For this task, you'll submit the job to the Batch AI cluster you set up earlier.
 In this section you will:

+ Create a training script
+ Create an estimator
+ Submit job 

### Create a training script

You need a training script to submit the job to the cluster. Let's write one now.

Notice how the script gets data and saves models:

+ The training script will read an argument to find the data folder.  When you submit the job, you'll point to the datastore for this argument:

    ```Python
    parser.add_argument('--data-folder', type = str, dest = 'data_folder', help = 'data folder mounting point')
    ```
    
+ The training script will save your model into a folder named `outputs`. The `outputs` folder is a special construct - anything written in this folder is automatically uploaded into your workspace. You'll access your model from here later in the tutorial.

    ```Python
    saver.save(sess, './outputs/model/mnist-tf.model')
    ```



```python
%%writefile $proj.project_directory/train.py

import argparse
import os
import numpy as np

from sklearn.linear_model import LogisticRegression
from sklearn.externals import joblib

from azureml.core import Run
from utils import load_data

# let user feed in 2 parameters, the locaion of the data files (from datastore), and the regularization rate of the logistic regression model
parser = argparse.ArgumentParser()
parser.add_argument('--data-folder', type = str, dest = 'data_folder', help = 'data folder mounting point')
parser.add_argument('--regularization', type = float, dest = 'reg', default = 0.01, help = 'regularization rate')
args = parser.parse_args()

data_folder = os.path.join(args.data_folder, 'mnist')
print('Data folder:', data_folder)

# load train and test set into numpy arrays
# note we scale the pixel intensity values to 0-1 (by dividing it with 255.0) so the model can converge faster.
X_train = load_data(os.path.join(data_folder, 'train-images.gz'), False) / 255.0
X_test = load_data(os.path.join(data_folder, 'test-images.gz'), False) / 255.0
y_train = load_data(os.path.join(data_folder, 'train-labels.gz'), True).reshape(-1)
y_test = load_data(os.path.join(data_folder, 'test-labels.gz'), True).reshape(-1)
print(X_train.shape, y_train.shape, X_test.shape, y_test.shape, sep = '\n')

# get hold of the current run
run = Run.get_submitted_run()

# train a logistic regression model with specified regularization rate
print('Train a logistic regression model with regularizaion rate of', args.reg)
clf = LogisticRegression(C = 1.0/args.reg, random_state = 42)
clf.fit(X_train, y_train)

print('Predict the test set')
# predict on the test set
y_hat = clf.predict(X_test)

# calculate accuracy on the prediction
acc = np.average(y_hat == y_test)
print('Accuracy is', acc)

# log regularization rate and accuracy 
run.log('regularization rate', np.float(args.reg))
run.log('accuracy', np.float(acc))

os.makedirs('outputs', exist_ok = True)
joblib.dump(value = clf, filename = 'outputs/sklearn_mnist_model.pkl')
```

You also need to copy the utility library that loads the dataset into the project folder.


```python
import shutil
shutil.copy('utils.py', proj.project_directory)
```


### Create an estimator

Next, construct an estimator(`est`) with the training script, set to run on the Batch AI cluster. This code shows how you specify the `data-folder` parameter that the training script uses to access your data. 

The estimator automatically configures a Docker container with scikit-learn installed to run the training code.


```python
from azureml.train.estimator import Estimator

script_params = {
    '--data-folder': ds.as_mount(),
    '--regularization': 0.01
}

est = Estimator(project = proj,
                script_params = script_params,
                compute_target = compute_target,
                entry_script = 'train.py',
                conda_packages = ['scikit-learn'])
```

### Submit job 

Calling the `fit` function on the estimator submits the job to run in the Batch AI cluster. All files in the project folder are uploaded into the Batch AI cluster nodes for execution. Since the call is asynchronous, it returns a **running** state as soon as the job is kicked-off.


```python
run = est.fit()
print(run.get_details().status)
```

    Running
    

## Monitor a remote run

The previous step submitted the job for execution, which started a job on your cluster. Now we need to wait for the training to complete.  

As the run is executed, it will go through the following stages:

- **Preparing**: A docker image is created matching the Python environment specified by the estimator and it will be uploaded to the workspace. This step will only happen once for each Python environment -- the container will then be cached for subsequent runs.  While the job is preparing, logs are streamed to the run history and can be viewed to monitor the progress of the image creation. **Creating and uploading the image takes about 5 minutes.**

- **Scaling**: If the compute needs to be scaled up (that is, the Batch AI cluster requires more nodes to execute the run than currently available), the Batch AI cluster will attempt to scale up in order to make the required amount of nodes available. **Scaling typically takes about 5 minutes.**

- **Running**: The project files are deployed to the compute target, data stores are mounted/copied and the entry_script is executed. While the job is running, stdout and the ./logs folder are streamed to the run history and can be viewed to monitor the progress of the run.

- **Post-Processing**: The ./outputs folder of the run is copied over to the run history.

> [!IMPORTANT]
> In total, the first run will take **approximately 10 minutes**. But for subsequent runs, as long as the dependencies of the project don't change, the same image is reused and hence the container start up time will be much faster.


There are multiple ways to check the progress of a running job. You can use a Jupyter notebook widget.
The widget will automatically update ever 10-15 seconds, always showing you the most up-to-date information about the run.


```python
from azureml.train.widgets import RunDetails
RunDetails(run).show()
```

![notebook widget](./media/tutorial-train-models-with-aml/widget.png)


### Wait for results

We can also just block and wait.  This code completes when the run is finished.  `show_output = True` prints detailed logging information of the run, while `show_output = False` prints a summary when the job is complete.



```python
run.wait_for_completion(show_output = False)
```

## Submit multiple training jobs

Now let's make use of the normalization rate parameter by kicking off several runs with different values.


```python
# try a few different regularization rates
regs = [0.02, 0.05, 0.1, 0.5, 1]
runs = []

for reg in regs:
    script_params = {
    '--data-folder': ds.as_mount(),
    '--regularization': reg
    }

    est = Estimator(project = proj,
                script_params = script_params,
                compute_target = compute_target,
                entry_script = 'train.py',
                conda_packages = ['scikit-learn'])
    print("Kick off a job to train model with regularizaion rate of", reg)
    runs.append(est.fit())
```

    Kick off a job to train model with regularizaion rate of 0.02
    Kick off a job to train model with regularizaion rate of 0.05
    Kick off a job to train model with regularizaion rate of 0.1
    Kick off a job to train model with regularizaion rate of 0.5
    Kick off a job to train model with regularizaion rate of 1
    

The cluster was created during the first run.  Now these runs can start right away.  However, the training itself still takes some time.  Wait until they are all complete:

> [!IMPORTANT]
> This will take approximately 12 minutes to complete


```python
%%time
for r in runs:
    r.wait_for_completion(show_output=True) # or you can set to false
```

## Get details for each run


```python
from azureml.core import History
history = History(ws, history_name)
metrics = {}

for r in history.get_runs():
    run_status = r.get_details().status
    
    print(r.id, run_status)
    if run_status == 'Completed':
        m = r.get_metrics()
        if 'regularization rate' in m.keys():
            metrics[r.id] = (m['regularization rate'], m['accuracy'])
            print(m)
```

## Evaluate and register a model

You have now trained multiple models using various regularization rates.  Let's take a look at how they perform and select the best model.

### Plot accuracy over regularization rate

Retrieve the logged metrics and use `matplotlib` to examine accuracy and regularization rates.


```python
acc_reg = np.array([(metrics[k][0], metrics[k][1]) for k in metrics.keys()])
sorted_acc_reg = acc_reg[acc_reg[:,0].argsort()]

plt.plot(sorted_acc_reg[:,0], sorted_acc_reg[:,1], 'r--')
plt.plot(sorted_acc_reg[:,0], sorted_acc_reg[:,1], 'bo')

plt.xlabel('regularization rate', fontsize = 14)
plt.ylabel('accuracy', fontsize = 14)
plt.title('Accuracy over Regularization Rates', fontsize = 16)

plt.show()
```

![accuracy plot](./media/tutorial-train-models-with-aml/accuracy.png)

You can see that lower regularization rates lead to worse accuracy. Here you see the best model in the graph is the one with a rate of 1.0. Find the ID for this model and register it in the workspace.


```python
# find the run with the highest accuracy value.
best_run_id = max(metrics, key = lambda k: metrics[k][1])
print(best_run_id)
```


```python
# load the best run
best_run = Run(workspace = ws, history_name = history_name, run_id = best_run_id)
print('Best run metrics:', best_run.get_metrics())
```


```python
print('\n'.join(best_run.get_file_names()))
```


```python
# register model from the best run
model = best_run.register_model(model_name = 'sklearn_mnist', model_path = 'outputs/sklearn_mnist_model.pkl')
```


```python
print(model.name, model.id, model.version, sep = '\t')
```

## Clean up resources

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

## Next steps

In this Azure Machine Learning tutorial, you used Python to:

> [!div class="checklist"]
> * Set up your development environment
> * Access and examine the data
> * Train a simple logistic regression locally using the popular scikit-learn maching learning library 
> * Traing multiple models on a remote GPU cluster
> * Review training details and register the best model

You are ready to move on to the next part in the tutorial series, where you will deploy the registered model:

> [!div class="nextstepaction"]
> [Tutorial 2 - Deploy models](tutorial-deploy-models-with-aml.md)