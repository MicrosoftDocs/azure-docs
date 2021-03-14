---
author: gvashishtha
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: include
ms.date: 07/31/2020
ms.author: gopalv
---

The entry script receives data submitted to a deployed web service and passes it to the model. It then takes the response returned by the model and returns that to the client. *The script is specific to your model*. It must understand the data that the model expects and returns.

The two things you need to accomplish in your entry script are:

1. Loading your model (using a function called `init()`)
1. Running your model on input data (using a function called `run()`)

Let's go through these steps in detail.

### Writing init() 

#### Loading a registered model

Your registered models are stored at a path pointed to by an environment variable called `AZUREML_MODEL_DIR`. For more information on the exact directory structure, see [Locate model files in your entry script](../articles/machine-learning/how-to-deploy-advanced-entry-script.md#load-registered-models)

#### Loading a local model

If you opted against registering your model and passed your model as part of your source directory, you can read it in like you would locally, by passing the path to the model relative to your scoring script. For example, if you had a directory structured as:

```bash

- source_dir
    - score.py
    - models
        - model1.onnx

```

you could load your models with the following Python code:

```python
import os

model = open(os.path.join('.', 'models', 'model1.onnx'))
```

### Writing run()

`run()` is executed every time your model receives a scoring request, and expects the body of the request to be a JSON document with the following structure:

```json
{
    "data": <model-specific-data-structure>
}

```

The input to `run()` is a Python string containing whatever follows the "data" key.

The following example demonstrates how to load a registered scikit-learn model and score it with numpy data:

```python
import json
import numpy as np
import os
from sklearn.externals import joblib


def init():
    global model
    model_path = os.path.join(os.getenv('AZUREML_MODEL_DIR'), 'sklearn_mnist_model.pkl')
    model = joblib.load(model_path)

def run(data):
    try:
        data = np.array(json.loads(data))
        result = model.predict(data)
        # You can return any data type, as long as it is JSON serializable.
        return result.tolist()
    except Exception as e:
        error = str(e)
        return error
```

For more advanced examples, including automatic Swagger schema generation and binary (i.e. image) data, read [the article on advanced entry script authoring](../articles/machine-learning/how-to-deploy-advanced-entry-script.md)