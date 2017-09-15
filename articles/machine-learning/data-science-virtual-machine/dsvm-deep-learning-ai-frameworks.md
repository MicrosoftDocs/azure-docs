---
title: Deep Learning and AI frameworks - Azure | Microsoft Docs
description: Deep Learning and AI frameworks
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
documentationcenter: ''
author: bradsev
manager: cgronlun
editor: cgronlun

ms.assetid: 
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/11/2017
ms.author: gokuma;bradsev

---

# Deep Learning and AI frameworks
The [Data Science Virtual Machine](http://aka.ms/dsvm) (DSVM) and the [Deep Learning VM](http://aka.ms/dsvm/deeplearning) supports a number of deep learning frameworks to help build AI applications including ones with cognitive caoabilities like image and language understanding. 

Here are the details on all the deep learning frameworks available on the DSVM.

## Microsoft Cognitive Toolkit

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning framework      |
| Supported DSVM Editions      | Windows, Linux     |
| How is it configured / installed on the DSVM?  | The Microsoft Cognitive Toolkit (CNTK) is installed in Python 2.7, in the _root_ environment, as well as Python 3.5, in the _py35_ environment.   |
| Links to Samples      | Sample Jupyter notebooks are included.     |
| Related Tools on the DSVM      | Keras      |
| How to use / run it?    | Open Jupyter, then look for the CNTK folder  |

## Tensorflow

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning framework      |
| Supported DSVM Editions      | Windows, Linux     |
| How is it configured / installed on the DSVM?  | On Linux, Tensorflow is installed in Python 2.7, in the _root_ environment, as well as Python 3.5, in the _py35_ environment. On Windos, Tensorflow is installed in Python 3.5, in the _py35_ environment.  |
| Links to Samples      | Sample Jupyter notebooks are included.     |
| Related Tools on the DSVM      | Keras      |
| How to use / run it?    | Open Jupyter, then look for the tensorflow folder.  |

## Keras

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning framework      |
| Supported DSVM Editions      | Windows, Linux     |
| How is it configured / installed on the DSVM?  | Keras is installed in Python 2.7, in the _root_ environment, as well as Python 3.5, in the _py35_ environment.   |
| Links to Samples      | https://github.com/fchollet/keras/tree/master/examples      |
| Related Tools on the DSVM      | Microsoft Cognitive Toolkit, Tensorflow, Theano      |
| How to use / run it?    | Download the samples from Github location above, copy it to a directory under ~/notebooks and open it in Jupyter   |




## Caffe

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning framework      |
| Supported DSVM Editions      | Linux     |
| How is it configured / installed on the DSVM?  | Caffe is installed in `/opt/caffe`.    |
| Links to Samples      | Samples are included in `/opt/caffe/examples`.      |
| Related Tools on the DSVM      | Caffe2      |
### How to use / run it?  

Use X2Go to log in to your VM, then start a new terminal and enter

```
cd /opt/caffe/examples
jupyter notebook
```

A new browser window will open with sample notebooks.

## Caffe2

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning framework      |
| Supported DSVM Editions      | Linux     |
| How is it configured / installed on the DSVM?  | Caffe2 is installed in `/opt/caffe2`. It is also available for Python 2.7 in the _root_ conda environment.     |
| Links to Samples      | Sample Jupyter notebooks are included     |
| Related Tools on the DSVM      | Caffe      |
| How to use / run it?    | Open Jupyter, then navigate to the Caffe2 directory to find sample notebooks. Some notebooks require the Caffe2 root to be set in the Python code; enter /opt/caffe2.   |


## Chainer

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning framework      |
| Supported DSVM Editions      | Windows, Linux     |
| How is it configured / installed on the DSVM?  | Chainer is installed in Python 2.7, in the _root_ environment, as well as Python 3.5, in the _py35_ environment. ChainerRL and ChainerCV are also installed.   |
| Links to Samples      | Sample Jupyter notebooks are included.      |
| Related Tools on the DSVM      | Caffe      |

### How to use / run it?  

At a terminal, activate the Python version you want (_root_ or _py35_), run _python_, then import Chainer. In Jupyter, select the Python 2.7 or 3.5 kernel, then import Chainer.


## Deep Water

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning framework for H2O      |
| Supported DSVM Editions      | Linux     |
| How is it configured / installed on the DSVM?  | Deep Water is installed in `/dsvm/tools/deep_water`.   |
| Links to Samples      | Samples are available through the Deep Water server.      |
| Related Tools on the DSVM      | H2o, Sparkling Water      |

### How to use / run it?  

Connect to the VM using X2Go. At a terminal, start the Deep Water server:

    java -jar /dsvm/tools/deep_water/h2o.jar

Then open a browser and connect to _localhost:54321_.



## MXNet

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning framework      |
| Supported DSVM Editions      | Windows, Linux     |
| How is it configured / installed on the DSVM?  | MXNet is installed in `C:\dsvm\tools\mxnet` on Windows and `/dsvm/tools/mxnet` on Linux. Python bindings are installed for Python 2.7, in the _root_ environment, as well as Python 3.5, in the _py35_ environment. R bindings are also installed.   |
| Links to Samples      | Sample Jupyter notebooks are included.    |
| Related Tools on the DSVM      | Keras      |
| How to use / run it?    | Open Jupyter, then look for the mxnet folder  |

## NVIDIA DIGITS

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning system from NVIDIA for rapidly training deep learning models      |
| Supported DSVM Editions      | Linux     |
| How is it configured / installed on the DSVM?  | DIGITS is installed in `/dsvm/tools/DIGITS` and is available a service called _digits_.   |
### How to use / run it?  

Log in to the VM with X2Go. At a terminal, start the service:

    sudo systemctl start digits

The service will take about one minute to start. Start a web browser and navigate to _localhost:5000_.



## nvdia-smi

|    |           |
| ------------- | ------------- |
| What is it?   | NVIDIA tool for querying GPU activity      |
| Supported DSVM Editions      | Windows, Linux     |
| How is it configured / installed on the DSVM?  | Torch is installed in `/dsvm/tools/torch`. PyTorch is installed in Python 2.7, in the _root_ environment, as well as Python 3.5, in the _py35_ environment.   |
| How to use / run it? | Start a command prompt (on Windows) or a terminal (on Linux), then run _nvidia-smi_.



## Theano

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning framework      |
| Supported DSVM Editions      | Linux     |
| How is it configured / installed on the DSVM?  | Theano is installed in Python 2.7, in the _root_ environment, as well as Python 3.5, in the _py35_ environment.   |
| Related Tools on the DSVM      | Keras      |
| How to use / run it?    | At a terminal, activate the Python version you want (root or py35), run python, then import theano. In Jupyter, select the Python 2.7 or 3.5 kernel, then import theano.  |



## Torch

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning framework      |
| Supported DSVM Editions      | Linux     |
| How is it configured / installed on the DSVM?  | Torch is installed in `/dsvm/tools/torch`. PyTorch is installed in Python 2.7, in the _root_ environment, as well as Python 3.5, in the _py35_ environment.   |
| Links to Samples      | Torch samples are located at `/dsvm/samples/torch`. PyTorch samples are located at `/dsvm/samples/pytorch`.      |

