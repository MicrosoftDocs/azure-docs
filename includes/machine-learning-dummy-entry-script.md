---
author: gvashishtha
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: include
ms.date: 04/21/2021
ms.author: gopalv
---

The entry script receives data submitted to a deployed web service and passes it to the model. It then returns the model's response to the client. *The script is specific to your model*. The entry script must understand the data that the model expects and returns.

The two things you need to accomplish in your entry script are:

1. Loading your model (using a function called `init()`)
1. Running your model on input data (using a function called `run()`)

For your initial deployment, use a dummy entry script that prints the data it receives.

```python
import json

def init():
    print('This is init')

def run(data):
    test = json.loads(data)
    print(f'received data {test}')
    return(f'test is {test}')

```
Save this file as `echo_score.py` inside of a directory called `source_dir`.

So, for example, if a user calls your model with:

```bash
curl -X POST -d '{"this":"is a test"}' -H "Content-Type: application/json" http://localhost:6789/score
```

The following value is returned:

```bash
"test is {'this': 'is a test'}"
```