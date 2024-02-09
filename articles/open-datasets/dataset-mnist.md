---
title: MNIST database of handwritten digits
description: Learn how to use the MNIST database of handwritten digits dataset in Azure Open Datasets.
ms.service: open-datasets
ms.custom: event-tier1-build-2022
ms.topic: sample
ms.date: 04/16/2021
---

# The MNIST database of handwritten digits

The MNIST database of handwritten digits has a training set of 60,000 examples and a test set of 10,000 examples. The digits have been size-normalized and centered in a fixed-size image.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

This dataset is sourced from [THE MNIST DATABASE of handwritten digits](http://yann.lecun.com/exdb/mnist/). It's a subset of the larger [NIST Hand-printed Forms and Characters Database](https://www.nist.gov/srd/nist-special-database-19) published by [National Institute of Standards and Technology](https://www.nist.gov/).


## Storage location

- Blob account: azureopendatastorage
- Container name: mnist

Four files are available in the container directly:
  - train-images-idx3-ubyte.gz: training set images (9,912,422 bytes)
  - train-labels-idx1-ubyte.gz: training set labels (28,881 bytes)
  - t10k-images-idx3-ubyte.gz: test set images (1,648,877 bytes)
  - t10k-labels-idx1-ubyte.gz: test set labels (4,542 bytes)

## Data access

### Azure Notebooks

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azureml-opendatasets&registryId=mnist -->


### Load MNIST into a data frame using Azure Machine Learning tabular datasets. 
For more information on Azure Machine Learning datasets, see [Create Azure Machine Learning datasets](../machine-learning/v1/how-to-create-register-datasets.md). 

#### Get complete dataset into a data frame

```python
from azureml.opendatasets import MNIST

mnist = MNIST.get_tabular_dataset()
mnist_df = mnist.to_pandas_dataframe()
mnist_df.info()
```

#### Get train and test data frames

```python
mnist_train = MNIST.get_tabular_dataset(dataset_filter='train')
mnist_train_df = mnist_train.to_pandas_dataframe()
X_train = mnist_train_df.drop("label", axis=1).astype(int).values/255.0
y_train = mnist_train_df.filter(items=["label"]).astype(int).values

mnist_test = MNIST.get_tabular_dataset(dataset_filter='test')
mnist_test_df = mnist_test.to_pandas_dataframe()
X_test = mnist_test_df.drop("label", axis=1).astype(int).values/255.0
y_test = mnist_test_df.filter(items=["label"]).astype(int).values
```

#### Plot some images of the digits 

```python
%matplotlib inline
import numpy as np
import matplotlib.pyplot as plt

# now let's show some randomly chosen images from the traininng set.
count = 0
sample_size = 30
plt.figure(figsize=(16, 6))
for i in np.random.permutation(X_train.shape[0])[:sample_size]:
    count = count + 1
    plt.subplot(1, sample_size, count)
    plt.axhline('')
    plt.axvline('')
    plt.text(x=10, y=-10, s=y_train[i], fontsize=18)
    plt.imshow(X_train[i].reshape(28, 28), cmap=plt.cm.Greys)
plt.show()
```

### Download or mount MNIST raw files Azure Machine Learning file datasets. 
This works only for Linux based compute. For more information on Azure Machine Learning datasets, see [Create Azure Machine Learning datasets](../machine-learning/v1/how-to-create-register-datasets.md). 

```python
mnist_file = MNIST.get_file_dataset()
mnist_file
```

```python
mnist_file.to_path()
```

#### Download files to local storage

```python
import os
import tempfile

data_folder = tempfile.mkdtemp()
data_paths = mnist_file.download(data_folder, overwrite=True)
data_paths
```

#### Mount files. Useful when training job will run on a remote compute.

```python
import gzip
import struct
import pandas as pd
import numpy as np

# load compressed MNIST gz files and return pandas dataframe of numpy arrays
def load_data(filename, label=False):
    with gzip.open(filename) as gz:
        gz.read(4)
        n_items = struct.unpack('>I', gz.read(4))
        if not label:
            n_rows = struct.unpack('>I', gz.read(4))[0]
            n_cols = struct.unpack('>I', gz.read(4))[0]
            res = np.frombuffer(gz.read(n_items[0] * n_rows * n_cols), dtype=np.uint8)
            res = res.reshape(n_items[0], n_rows * n_cols)
        else:
            res = np.frombuffer(gz.read(n_items[0]), dtype=np.uint8)
            res = res.reshape(n_items[0], 1)
    return pd.DataFrame(res)
```

```python
import sys
mount_point = tempfile.mkdtemp()
print(mount_point)
print(os.path.exists(mount_point))

if sys.platform == 'linux':
  print("start mounting....")
  with mnist_file.mount(mount_point):
    print("list dir...")
    print(os.listdir(mount_point))
    print("get the dataframe info of mounted data...")
    train_images_df = load_data(next(path for path in data_paths if path.endswith("train-images-idx3-ubyte.gz")))
    print(train_images_df.info())
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=mnist -->


```python
%matplotlib inline
import numpy as np
import matplotlib.pyplot as plt
```

```python
import urllib.request
import os

data_folder = os.path.join(os.getcwd(), 'data')
os.makedirs(data_folder, exist_ok=True)

urllib.request.urlretrieve('https://azureopendatastorage.blob.core.windows.net/mnist/train-images-idx3-ubyte.gz',
                           filename=os.path.join(data_folder, 'train-images.gz'))
urllib.request.urlretrieve('https://azureopendatastorage.blob.core.windows.net/mnist/train-labels-idx1-ubyte.gz',
                           filename=os.path.join(data_folder, 'train-labels.gz'))
urllib.request.urlretrieve('https://azureopendatastorage.blob.core.windows.net/mnist/t10k-images-idx3-ubyte.gz',
                           filename=os.path.join(data_folder, 'test-images.gz'))
urllib.request.urlretrieve('https://azureopendatastorage.blob.core.windows.net/mnist/t10k-labels-idx1-ubyte.gz',
                           filename=os.path.join(data_folder, 'test-labels.gz'))
```

```python
import gzip
import struct

# load compressed MNIST gz files and return numpy arrays
def load_data(filename, label=False):
    with gzip.open(filename) as gz:
        struct.unpack('I', gz.read(4))
        n_items = struct.unpack('>I', gz.read(4))
        if not label:
            n_rows = struct.unpack('>I', gz.read(4))[0]
            n_cols = struct.unpack('>I', gz.read(4))[0]
            res = np.frombuffer(gz.read(n_items[0] * n_rows * n_cols), dtype=np.uint8)
            res = res.reshape(n_items[0], n_rows * n_cols)
        else:
            res = np.frombuffer(gz.read(n_items[0]), dtype=np.uint8)
            res = res.reshape(n_items[0], 1)
    return res
```

```python
# note we also shrink the intensity values (X) from 0-255 to 0-1. This helps the model converge faster.
X_train = load_data(os.path.join(
    data_folder, 'train-images.gz'), False) / 255.0
X_test = load_data(os.path.join(data_folder, 'test-images.gz'), False) / 255.0
y_train = load_data(os.path.join(
    data_folder, 'train-labels.gz'), True).reshape(-1)
y_test = load_data(os.path.join(
    data_folder, 'test-labels.gz'), True).reshape(-1)

# now let's show some randomly chosen images from the traininng set.
count = 0
sample_size = 30
plt.figure(figsize=(16, 6))
for i in np.random.permutation(X_train.shape[0])[:sample_size]:
    count = count + 1
    plt.subplot(1, sample_size, count)
    plt.axhline('')
    plt.axvline('')
    plt.text(x=10, y=-10, s=y_train[i], fontsize=18)
    plt.imshow(X_train[i].reshape(28, 28), cmap=plt.cm.Greys)
plt.show()
```

<!-- nbend -->

---

### Azure Databricks

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=azureml-opendatasets&registryId=mnist -->


### Load MNIST into a data frame using Azure Machine Learning tabular datasets. 
For more information on Azure Machine Learning datasets, see [Create Azure Machine Learning datasets](../machine-learning/v1/how-to-create-register-datasets.md). 

#### Get complete dataset into a data frame

```python
# This is a package in preview.
from azureml.opendatasets import MNIST

mnist = MNIST.get_tabular_dataset()
mnist_df = mnist.to_spark_dataframe()
```

```python
display(mnist_df.limit(5))
```

### Download or mount MNIST raw files Azure Machine Learning file datasets. 
This works only for Linux based compute. For more information on Azure Machine Learning datasets, see [Create Azure Machine Learning datasets](../machine-learning/v1/how-to-create-register-datasets.md). 

```python
mnist_file = MNIST.get_file_dataset()
mnist_file
```

```python
mnist_file.to_path()
```

#### Download files to local storage

```python
import os
import tempfile

mount_point = tempfile.mkdtemp()
mnist_file.download(mount_point, overwrite=True)
```

#### Mount files. Useful when training job will run on a remote compute.

```python
import gzip
import struct
import pandas as pd
import numpy as np

# load compressed MNIST gz files and return numpy arrays
def load_data(filename, label=False):
    with gzip.open(filename) as gz:
        gz.read(4)
        n_items = struct.unpack('>I', gz.read(4))
        if not label:
            n_rows = struct.unpack('>I', gz.read(4))[0]
            n_cols = struct.unpack('>I', gz.read(4))[0]
            res = np.frombuffer(gz.read(n_items[0] * n_rows * n_cols), dtype=np.uint8)
            res = res.reshape(n_items[0], n_rows * n_cols)
        else:
            res = np.frombuffer(gz.read(n_items[0]), dtype=np.uint8)
            res = res.reshape(n_items[0], 1)
    return pd.DataFrame(res)
```

```python
import sys
mount_point = tempfile.mkdtemp()
print(mount_point)
print(os.path.exists(mount_point))
print(os.listdir(mount_point))

if sys.platform == 'linux':
  print("start mounting....")
  with mnist_file.mount(mount_point):
    print(context.mount_point )
    print(os.listdir(mount_point))  
    train_images_df = load_data(os.path.join(mount_point, 'train-images-idx3-ubyte.gz'))
    print(train_images_df.info())
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

---

## Next steps

View the rest of the datasets in the [Open Datasets catalog](dataset-catalog.md).
