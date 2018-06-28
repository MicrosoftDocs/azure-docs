---
title: Build, train, deploy models in Azure Machine Learning
description: This full-length tutorial shows how to use Azure Machine Learning services to build, train, and deploy a model with Azure Machine Learning in Python.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: quickstart

author: hning86
ms.author: haining
ms.reviewer: jmartens
ms.date: 7/27/2018
---

# Tutorial: Train and deploy model on Azure Machine Learning with MNIST dataset and TensorFlow

In this tutorial, you'll train a multi-class DNN on a Azure Batch AI cluster with Azure Machine Learning Services. This DNN identifies numerical digits that are present in an image. You'll also deploy it as a web service in an Azure Container Instance (ACI).

As you familiarize yourself with the Azure Machine Learning Services workflow, you'll learn how to:

> [!div class="checklist"]
> * Build a DNN in TensorFlow
> * Configure a compute target for training
> * Train the model
> * Submit a job to a target
> * Review run histories and accuracy
> * Test the model
> * Deploy as a web service

This tutorial uses the [MNIST](https://en.wikipedia.org/wiki/MNIST_database) dataset.  MNIST is a popular dataset consisting of 70,000 grayscale images. Each image is a handwritten digit of 28x28 pixels, representing digit from 0 to 9. 

## Prerequisites

To complete this tutorial, you must have:
- The Azure Machine Learning SDK for Python installed
- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An Azure Machine Learning Workspace named @@@
- A local project directory named @@@

Learn how to get these prerequisites using the [Quickstart: Get started with Azure Machine Learning Services](quickstart-get-started.md).

You also need these package dependencies (tensorflow, matplotlib, numpy) for this example:
```shell
conda install tensorflow matplotlib
```

```python
%matplotlib inline
import numpy as np
import matplotlib
import matplotlib.pyplot as plt
```


## Get the notebook and sample data
### Download the Jupyter notebook

Download the Jupyter notebook to run this tutorial yourself.

> [!div class="nextstepaction"]
> [Get the Jupyter notebook](https://aka.ms/aml-packages/vision/notebooks/image_classification)

### Download the sample data

Use scikit-learn library to download the MNIST dataset. Note we also shrink the intensity values (X) from 0-255 to 0-1. This makes the neural network converge faster.

```python
import os
import urllib

os.makedirs('./data', exist_ok = True)

urllib.request.urlretrieve('http://yann.lecun.com/exdb/mnist/train-images-idx3-ubyte.gz', filename = './data/train-images.gz')
urllib.request.urlretrieve('http://yann.lecun.com/exdb/mnist/train-labels-idx1-ubyte.gz', filename = './data/train-labels.gz')
urllib.request.urlretrieve('http://yann.lecun.com/exdb/mnist/t10k-images-idx3-ubyte.gz', filename = './data/test-images.gz')
urllib.request.urlretrieve('http://yann.lecun.com/exdb/mnist/t10k-labels-idx1-ubyte.gz', filename = './data/test-labels.gz')
```




    ('./data/test-labels.gz', <http.client.HTTPMessage at 0xa162599b0>)


Then, examine sample images by plotting 20 random images from the dataset along with their labels.


```python
from utils import load_data, one_hot_encode

X_train = load_data('./data/train-images.gz', False) / 255.0
y_train = load_data('./data/train-labels.gz', True).reshape(-1)

X_test = load_data('./data/test-images.gz', False) / 255.0
y_test = load_data('./data/test-labels.gz', True).reshape(-1)

count = 0
sample_size = 20
plt.figure(figsize = (16, 6))
for i in np.random.permutation(X_train.shape[0])[:sample_size]:
    count = count + 1
    plt.subplot(1, sample_size, count)
    plt.title(np.int32(y_train[i]), fontsize = 14)
    plt.axhline('');
    plt.axvline('')
    #plt.axis('off')
    plt.imshow(X_train[i].reshape(28, 28), cmap = plt.cm.Greys)
plt.show()
```


![png](MNIST%20with%20Azure%20ML_files/MNIST%20with%20Azure%20ML_10_0.png)

## Check for your workspace and project

1. Display the current workspace name.

    ```python
    ws = Workspace.from_config()
    print(ws.name, ws.location, ws.resource_group, ws.location, sep = '\t')
    ```
    
        Found config.json in: /Users/haining/git/hai/MnistTutorial/aml_config/config.json
        haieuapws	eastus2euap	aml-notebooks	eastus2euap
    
1. Attach the project to the workspace and see its details:

    ```python
    # create a new project or get hold of an existing one.
    proj = Project.attach(history_name = 'tf-mnist', directory = './tf-mnist-proj', workspace_object = ws)
    # show project details
    proj.get_details()
    ```


## Create datastore and add data

### Create the datastore


```python
from azureml.core import Datastore
# replace these with your own storage name/keys
account_name = "haivt6"
account_key = "+23Gzz1eNWly/9530GNGmRKckHaHHoYhTG5fSXoPm06PQv1434yTw+An6/dqyhT1WyUhLnhk1MG1myXNUA/OlQ=="
file_share_name = "amlfileshare"
file_datastore_name = 'my_file_datastore'

ds = Datastore.register_azure_file_share(workspace = ws, 
                                    datastore_name = file_datastore_name, 
                                    file_share_name = file_share_name,
                                    account_name = account_name, 
                                    account_key = account_key, 
                                    create_if_not_exists = True)
```

### Add dataset to the datastore 

Upload the MNIST dataset to the newly created datastore.


```python
ds.upload(src_dir = './data', target_path = 'mnist', overwrite = True)
```

    WARNING:azureml.data.azure_storage_datastore.task_upload_mnist/test-images.gz:Uploading ./data/test-images.gz
    WARNING:azureml.data.azure_storage_datastore.task_upload_mnist/train-labels.gz:Uploading ./data/train-labels.gz
    WARNING:azureml.data.azure_storage_datastore.task_upload_mnist/test-labels.gz:Uploading ./data/test-labels.gz
    WARNING:azureml.data.azure_storage_datastore.task_upload_mnist/train-labels.gz:Uploaded ./data/train-labels.gz, 1 files out of an estimated total of 4
    WARNING:azureml.data.azure_storage_datastore.task_upload_mnist/train-images.gz:Uploading ./data/train-images.gz
    WARNING:azureml.data.azure_storage_datastore.task_upload_mnist/test-labels.gz:Uploaded ./data/test-labels.gz, 2 files out of an estimated total of 4
    WARNING:azureml.data.azure_storage_datastore.task_upload_mnist/test-images.gz:Uploaded ./data/test-images.gz, 3 files out of an estimated total of 4
    WARNING:azureml.data.azure_storage_datastore.task_upload_mnist/train-images.gz:Uploaded ./data/train-images.gz, 4 files out of an estimated total of 4





    $AZUREML_DATAREFERENCE_my_file_datastore_941bacd62925442eb51c98407515f967



## Construct neural network in TensorFlow
Let's create a very simple DNN, with just 2 hidden layers. The input layer has 28*28=578 neurons. and the first one has 300 neurons, and the second one has 100 neurons. The output layer has 10 neurons, each representing a targeted label.

![DNN](images/feedforward_network.jpg)

## Create a Batch AI cluster as compute target


```python
from azureml.core.compute import BatchAiCompute

# choose a name for your cluster
batchai_cluster_name = "gpucluster"

found = False
# see if this compute target already exists in the workspace
for ct in ws.compute_targets():
    print(ct.name, ct.type)
    if ct.name == batchai_cluster_name and type(ct) is BatchAiCompute:
        found = True
        print('found compute target. just use it.')
        compute_target = ct
        break
        
if not found:
    print('creating a new compute target...')
    provisioning_config = BatchAiCompute.provisioning_configuration(vm_size = "STANDARD_NC6", # NC6 is GPU-enabled
                                                                #vm_priority = 'lowpriority', # optional
                                                                autoscale_enabled = True,
                                                                cluster_min_nodes = 1, 
                                                                cluster_max_nodes = 4)

    # create the cluster
    compute_target = ws.create_compute_target(batchai_cluster_name, provisioning_config)
    
    # can poll for a minimum number of nodes and for a specific timeout. 
    # if no min node count is provided it will use the scale settings for the cluster
    compute_target.wait_for_provisioning(show_output = True, min_node_count = None, timeout_in_minutes = 20)
    
     # For a more detailed view of current BatchAI cluster status, use the 'status' property    
    print(compute_target.status.serialize())
```

    gpucluster BatchAI
    found compute target. just use it.


## Create TensorFlow estimator


```python
from azureml.train.dnn import TensorFlow

script_params = {
    '--data_folder': ds.as_mount()
}

est = TensorFlow(project = proj,
                script_params = script_params,
                compute_target = compute_target,
                entry_script = 'tf_mnist.py',
                use_gpu = True)
```

## Copy the training files into the project folder


```python
import shutil
shutil.copy('./tf_mnist.py', proj.project_directory)
shutil.copy('./utils.py', proj.project_directory)
```




    '/Users/haining/git/hai/MnistTutorial/tf-mnist-proj/utils.py'



## Submit job to run


```python
run = est.fit()
#run.wait_for_completion(show_output = True)
```

### Use run history widget to monitor the run


```python
from azureml.contrib.widgets import RunDetails
RunDetails(run).show()
```


    UserRun(value={'status': 'init', 'widget_settings': {}})


### Print run history URL


```python
import helpers
print(helpers.get_run_history_url(run))
```

    https://mlworkspace.azureml-test.net/home/%2Fsubscriptions%2Ffac34303-435d-4486-8c3f-7094d82a0b60%2FresourceGroups%2Faml-notebooks%2Fproviders%2FMicrosoft.MachineLearningServices%2Fworkspaces%2Fhaieuapws/projects/tf-mnist/run-history/run-details/tf-mnist_1528931517647


Wait till the run finishes


```python
import time
import sys

sys.stdout.write(run.get_status()['status'])

while (run.get_status()['status'] == 'Running'):
    time.sleep(3)
    sys.stdout.write('.')
    
sys.stdout.write(run.get_status()['status'])
```

    CompletedCompleted

## Plot accuracy over epochs


```python
plt.figure(figsize = (13,5))
plt.plot(run.get_metrics()['validation_acc'], 'r-', lw = 4, alpha = .6)
plt.plot(run.get_metrics()['training_acc'], 'b--', alpha = 0.5)
plt.legend(['Training set','Evaluation set'])
plt.xlabel('epochs', fontsize = 14)
plt.ylabel('accuracy', fontsize = 14)
plt.title('Accuracy over Epochs', fontsize = 16)
plt.show()
```


![png](MNIST%20with%20Azure%20ML_files/MNIST%20with%20Azure%20ML_31_0.png)


## Download the saved model


```python
import os
os.makedirs('./model', exist_ok = True)
for f in run.get_file_names():
    print(f)
    if f.startswith('outputs/model'):
        run.download_file(name = f, output_file_path = os.path.join('./model', f.split('/')[-1]))
```

    azureml-setup/runconfig.json
    azureml-logs/20_ice_log.txt
    azureml-logs/60_control_log.txt
    azureml-logs/80_driver_log.txt
    outputs/model/checkpoint
    outputs/model/mnist-tf.model.data-00000-of-00001
    outputs/model/mnist-tf.model.index
    outputs/model/mnist-tf.model.meta
    driver_log
    azureml-logs/azureml.log


## Predict on the test set


```python
import tensorflow as tf
tf.reset_default_graph()

saver = tf.train.import_meta_graph("./model/mnist-tf.model.meta")

X = tf.get_default_graph().get_tensor_by_name("network/X:0")
y = tf.get_default_graph().get_tensor_by_name("network/y:0")

output = tf.get_default_graph().get_tensor_by_name("network/output/MatMul:0")
with tf.Session() as sess:
    saver.restore(sess, './model/mnist-tf.model')
    k = output.eval(feed_dict = {X : X_test})
# get the prediction
y_hat = np.argmax(k, axis = 1)
```

    /Users/haining/miniconda3/envs/candidate/lib/python3.6/importlib/_bootstrap.py:219: RuntimeWarning: compiletime version 3.5 of module 'tensorflow.python.framework.fast_tensor_util' does not match runtime version 3.6
      return f(*args, **kwds)


    INFO:tensorflow:Restoring parameters from ./model/mnist-tf.model


    INFO:tensorflow:Restoring parameters from ./model/mnist-tf.model



```python
# accuracy on the test data set
print(np.average(y_hat == y_test))
```

    0.9787


## Print the confusion matrix


```python
import numpy

# calculate the confusion matrix; labels is numpy array of classification labels
conf_mx = numpy.zeros((10, 10))
for a, p in zip(y_test, y_hat):
    conf_mx[a][p] += 1

accuracy = np.average(y_test == y_hat)

print('Confusion matrix:')
print(conf_mx.astype(int))
print()
print('Overall accuracy:', accuracy)
```

    Confusion matrix:
    [[ 971    0    1    0    1    1    2    1    2    1]
     [   0 1121    3    2    0    1    4    1    3    0]
     [   4    0 1008    3    3    0    1    6    7    0]
     [   0    0    4  992    0    2    0    2    1    9]
     [   0    0    2    2  965    0    4    1    0    8]
     [   3    0    0    7    2  864    8    1    4    3]
     [   5    2    1    1    5    2  942    0    0    0]
     [   1    3   12    2    1    0    0  998    3    8]
     [   4    0    4    8    4    4    3    2  943    2]
     [   3    2    0    4    8    1    1    6    1  983]]
    
    Overall accuracy: 0.9787



```python
row_sums = conf_mx.sum(axis = 1, keepdims = True)
norm_conf_mx = conf_mx / row_sums
np.fill_diagonal(norm_conf_mx, 0)

fig = plt.figure(figsize = (8,5))
ax = fig.add_subplot(111)
cax = ax.matshow(norm_conf_mx, cmap = plt.cm.bone)
ticks = np.arange(0, 10, 1)
ax.set_xticks(ticks)
ax.set_yticks(ticks)
ax.set_xticklabels(ticks)
ax.set_yticklabels(ticks)
fig.colorbar(cax)
plt.savefig('./confmat.png')
plt.show()
run.upload_file(name = 'confusion matrix', path_or_stream = './confmat.png')
```


![png](MNIST%20with%20Azure%20ML_files/MNIST%20with%20Azure%20ML_39_0.png)





    <azureml.restclient.models.batch_artifact_content_information_dto.BatchArtifactContentInformationDto at 0xd3e6ad400>



## Interpretation of the above confusion matrix
The lighter color boxes represent higher numbers of misclassfifed instances. It looks like many 3s are misclassified as 5s and vice-versa; and many 9s are misclassified as 3s and 4s. We can plot some of these misclassified images and see what's going on here.


```python
# show 3s that are misclassified as 5s, 5s as 3s, 9s as 4s and 9s as 3s.
for m in [(5,3), (5,6), (9,4), (8,3)]:
    misclassified = ((y_test == m[0]) & (y_hat == m[1]))
    plt.figure(figsize = (16, 1))
    X_m, y_m = X_test[misclassified], y_test[misclassified]
    #print(X_m.shape)
    n_samples = min(10, X_m.shape[0])
    for i in range(n_samples):
        plt.subplot(1, n_samples, i+1)
        plt.axhline('');plt.axvline('')
        #plt.axis('off')
        plt.imshow(X_m[i].reshape(28, 28), cmap = plt.cm.Greys)
    title = "{}s that are misclassified as {}s".format(m[0], m[1]) 
    print(title,':')
    plt.savefig('{}s_as_{}s.png'.format(m[0], m[1]))
    #run.upload_file(name = title, path_or_stream = '{}s_as_{}s.png'.format(m[0], m[1]))

    plt.show()
```

    5s that are misclassified as 3s :



![png](MNIST%20with%20Azure%20ML_files/MNIST%20with%20Azure%20ML_41_1.png)


    5s that are misclassified as 6s :



![png](MNIST%20with%20Azure%20ML_files/MNIST%20with%20Azure%20ML_41_3.png)


    9s that are misclassified as 4s :



![png](MNIST%20with%20Azure%20ML_files/MNIST%20with%20Azure%20ML_41_5.png)


    8s that are misclassified as 3s :



![png](MNIST%20with%20Azure%20ML_files/MNIST%20with%20Azure%20ML_41_7.png)


And clearly some of these are indeed hard to distinguish even for humans! We can try adding some additional samples for these digits, or train more focused classifiers just for these digits.

## Deploy the model in ACI
### Create score.py


```python
%%writefile score.py
import json
import numpy as np
import os
import tensorflow as tf

from azureml.assets.persistence.persistence import get_model_path

def init():
    global X, output, sess
    tf.reset_default_graph()
    model_root = get_model_path('model')
    saver = tf.train.import_meta_graph(os.path.join(model_root, 'mnist-tf.model.meta'))
    X = tf.get_default_graph().get_tensor_by_name("network/X:0")
    output = tf.get_default_graph().get_tensor_by_name("network/output/MatMul:0")
    
    sess = tf.Session()
    saver.restore(sess, os.path.join(model_root, 'mnist-tf.model'))

def run(raw_data):
    data = np.array(json.loads(raw_data)['data'])
    # make prediction
    out = output.eval(session = sess, feed_dict = {X: data})
    y_hat = np.argmax(out, axis = 1)
    return json.dumps(y_hat.tolist())
```

    Overwriting score.py


### Create myenv.yml


```python
%%writefile myenv.yml
name: myenv
channels:
  - defaults
dependencies:
  - pip:
    - numpy
    - tensorflow==1.4.0
    # Required packages for AzureML execution, history, and data preparation.
    - --extra-index-url https://azuremlsdktestpypi.azureedge.net/sdk-release/Preview/E7501C02541B433786111FE8E140CAA1
    - azureml-core
```

    Overwriting myenv.yml


### Deploy to ACI


```python
from azureml.core.webservice import AciWebservice

aciconfig = AciWebservice.deploy_configuration(cpu_cores = 1, 
                                               memory_gb = 1, 
                                               tags = ['MNIST'], 
                                               description = 'Tensorflow DNN')
```


```python
%%time
from azureml.core.webservice import Webservice

service = Webservice.deploy(workspace = ws,
                            name = 'tf-mnist',
                            deployment_config = aciconfig,
                            model_paths = ['model'],
                            runtime = 'python',
                            conda_file = 'myenv.yml',
                            execution_script = 'score.py')

service.wait_for_deployment(show_output = True)
```

    Registering model model


    ERROR:azure.storage.common.storageclient:Client-Request-ID=742be622-6f7b-11e8-8c26-7e00a8d19701 Retry policy did not allow for a retry: Server-Timestamp=Thu, 14 Jun 2018 02:34:25 GMT, Server-Request-ID=28c91484-001e-0064-4388-0307b9000000, HTTP status code=409, Exception=The specified container already exists.ErrorCode: ContainerAlreadyExists<?xml version="1.0" encoding="utf-8"?><Error><Code>ContainerAlreadyExists</Code><Message>The specified container already exists.RequestId:28c91484-001e-0064-4388-0307b9000000Time:2018-06-14T02:34:25.7001500Z</Message></Error>.
    ERROR:azure.storage.common.storageclient:Client-Request-ID=7455567e-6f7b-11e8-a3e6-7e00a8d19701 Retry policy did not allow for a retry: Server-Timestamp=Thu, 14 Jun 2018 02:34:25 GMT, Server-Request-ID=1a0b8fc2-e01e-001e-3088-031af9000000, HTTP status code=409, Exception=The specified container already exists.ErrorCode: ContainerAlreadyExists<?xml version="1.0" encoding="utf-8"?><Error><Code>ContainerAlreadyExists</Code><Message>The specified container already exists.RequestId:1a0b8fc2-e01e-001e-3088-031af9000000Time:2018-06-14T02:34:25.9704655Z</Message></Error>.
    ERROR:azure.storage.common.storageclient:Client-Request-ID=747890c6-6f7b-11e8-981e-7e00a8d19701 Retry policy did not allow for a retry: Server-Timestamp=Thu, 14 Jun 2018 02:34:26 GMT, Server-Request-ID=bf16d461-a01e-00d4-4288-034670000000, HTTP status code=409, Exception=The specified container already exists.ErrorCode: ContainerAlreadyExists<?xml version="1.0" encoding="utf-8"?><Error><Code>ContainerAlreadyExists</Code><Message>The specified container already exists.RequestId:bf16d461-a01e-00d4-4288-034670000000Time:2018-06-14T02:34:26.2063609Z</Message></Error>.
    ERROR:azure.storage.common.storageclient:Client-Request-ID=749bdedc-6f7b-11e8-9a16-7e00a8d19701 Retry policy did not allow for a retry: Server-Timestamp=Thu, 14 Jun 2018 02:34:26 GMT, Server-Request-ID=5905db6b-c01e-007b-4488-03b4bd000000, HTTP status code=409, Exception=The specified container already exists.ErrorCode: ContainerAlreadyExists<?xml version="1.0" encoding="utf-8"?><Error><Code>ContainerAlreadyExists</Code><Message>The specified container already exists.RequestId:5905db6b-c01e-007b-4488-03b4bd000000Time:2018-06-14T02:34:26.4642799Z</Message></Error>.


    Creating image
    Image creation operation finished for image tf-mnist:5, operation "Succeeded"
    Creating service
    Running..........................................................
    SucceededACI service creation operation finished, operation "Succeeded"
    CPU times: user 4.17 s, sys: 937 ms, total: 5.1 s
    Wall time: 7min 34s


### Test the deployed model


```python
import json

# find 25 random samples from the test set
i = np.random.permutation(X_test.shape[0])[0:30]

test_samples = json.dumps({"data": X_test[i].tolist()})
test_samples = bytes(test_samples, encoding = 'utf8')

# predict using the deployed model
result = json.loads(service.run(input_data = test_samples))

print('actual values:\t', y_test[i])
print('predicted:\t',np.array(result))
```

    actual values:	 [9 3 4 1 3 0 7 0 5 7 5 1 9 6 9 4 1 1 8 0 8 7 7 6 0 4 2 3 4 7]
    predicted:	 [9 3 4 1 3 0 7 0 0 7 5 1 9 6 9 4 1 1 8 0 8 7 7 6 0 4 2 3 4 7]


### Delete the web service


```python
service.delete()
```


## Clean up resources

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

## Next steps

In this Azure Machine Learning tutorial, you used Python to:
> [!div class="checklist"]
> * Train a model locally 
> * Train a model on remote Data Science Virtual Machine (DSVM)
> * Deploy and test a web service to Azure Container Instances

@@WHat's next best to try out?