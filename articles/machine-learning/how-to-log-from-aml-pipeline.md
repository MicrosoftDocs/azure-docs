---
title: Logging from Azure Machine Learning Pipelines
titleSuffix: Azure Machine Learning
description: Add logging to your training and batch scoring pipelines and view the logged results of a run in the portal, blob, or application insights.
services: machine-learning
author: anrode
ms.author: anrode
ms.reviewer: anrode
ms.service: machine-learning
ms.subservice: core
ms.workload: data-services
ms.topic: conceptual
ms.date: 01/09/2020

ms.custom: seodec18
---

# Logging from Azure Machine Learning Pipelines

Monitor your Azure Machine Learning Pipelines by logging text logs and metrics related pipeline progress, errors, and performance. 
 
## Logging Options and Behavior 

This table provides different logging options that AML users have, an example line of code, destination for the given log/metric, and reference documentation. This is not an exhaustive list, as other options exist besides just the AML, Python, and OpenCensus ones shown here.


## Logging Code Sample

```python
import argparse
import logging
import time 

from azureml.core.run import Run

from opencensus.ext.azure.log_exporter import AzureLogHandler 

run = Run.get_context() 

sleep_seconds = args.seconds 

# AML Scalar value logging 
run.log("sleep_seconds", sleep_seconds) 

# Python print statement 

print("I am a python print statement, I will be sent to the driver logs.") 

# Initialize python logger 

logger = logging.getLogger(__name__)
logger.setLevel(args.log_level) 

# Plain python logging statements 
logger.debug("I am a plain debug statement, I will be sent to the driver logs.") 

logger.info("I am a plain info statement, I will be sent to the driver logs.") 

# Python logging with OpenCensus AzureLogHandler 

handler = AzureLogHandler(connection_string='<connection string>')
logger.addHandler(handler) 

logger.warning("I am an OpenCensus warning statement, find me in Application Insights!") 

logger.error("I am an OpenCensus error statement with custom dimensions", {'step_id': run.id}) 
```

