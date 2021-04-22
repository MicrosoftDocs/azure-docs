---
author: gvashishtha
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: include
ms.date: 04/21/2021
ms.author: gopalv
---

For your initial deployment, we will use a simple dummy entry script that simply prints the data it receives. When we start your webservice, we actually start a Flask server that runs the init() method when it starts up and the run() method every time it receives a request.

```python
import json

def init():
    print('This is init')

def run(data):
    test = json.loads(data)
    print(f'received data {test}')
    return(f'test is {test}')

```

So, for example, if a user calls your model with:

```bash
!curl -X POST -d '{"this":"is a test"}' -H "Content-Type: application/json" http://localhost:6789/score
```

they will see the following value returned:

```bash
"test is {'this': 'is a test'}"
```