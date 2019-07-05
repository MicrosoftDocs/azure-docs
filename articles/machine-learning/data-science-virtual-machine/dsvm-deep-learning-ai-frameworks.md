---
title: Deep Learning and AI frameworks - Azure | Microsoft Docs
description: Learn about the deep learning frameworks and tools supported on the Data Science Virtual Machine.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
documentationcenter: ''
author: gopitk
manager: cgronlun
ms.custom: seodec18

ms.assetid: 
ms.service: machine-learning
ms.subservice: data-science-vm
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/11/2017
ms.author: gokuma

---

# Deep Learning and AI frameworks
The [Data Science Virtual Machine](https://aka.ms/dsvm) (DSVM) and the [Deep Learning VM](https://aka.ms/dsvm/deeplearning) supports a number of deep learning frameworks to help build Artificial Intelligence (AI) applications with predictive analytics and cognitive capabilities like image and language understanding.

Here are the details on all the deep learning frameworks available on the DSVM.

## Microsoft Cognitive Toolkit

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning framework      |
| Supported DSVM Editions      | Windows, Linux     |
| How is it configured / installed on the DSVM?  | The Microsoft Cognitive Toolkit (CNTK) is installed in Python 3.5 on [Linux and Windows 2012](dsvm-languages.md#python-linux-and-windows-server-2012-edition) and Python 3.6 on [Windows 2016](dsvm-languages.md#python-windows-server-2016-edition).   |
| Links to Samples      | Sample Jupyter notebooks are included.     |
| Related Tools on the DSVM      | Keras      |
| How to use / run it?    | * At a terminal: activate the correct environment, then run Python. <br/> * In Jupyter: Connect to [Jupyter](provision-vm.md#tools-installed-on-the-microsoft-data-science-virtual-machine) or [JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-data-science-virtual-machine-for-linux), then open the CNTK directory for samples. |

## TensorFlow

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning framework      |
| Supported DSVM Editions      | Windows, Linux     |
| How is it configured / installed on the DSVM?  | TensorFlow is installed in Python 3.5 on [Linux and Windows 2012](dsvm-languages.md#python-linux-and-windows-server-2012-edition) and Python 3.6 on [Windows 2016](dsvm-languages.md#python-windows-server-2016-edition).  |
| Links to Samples      | Sample Jupyter notebooks are included.     |
| Related Tools on the DSVM      | Keras      |
| How to use / run it?    | * At a terminal: activate the correct environment, then run Python. <br/> * In Jupyter: Connect to [Jupyter](provision-vm.md#tools-installed-on-the-microsoft-data-science-virtual-machine) or [JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-data-science-virtual-machine-for-linux), then open the TensorFlow directory for samples.  |

## Horovod

|    |           |
| ------------- | ------------- |
| What is it?   | Distribued deep learning framework for TensorFlow      |
| Supported DSVM Editions      | Ubuntu     |
| How is it configured / installed on the DSVM?  | Horovod is installed in Python 3.5 on [Ubuntu](dsvm-languages.md#python-linux-and-windows-server-2012-edition).  |
| Links to Samples      | [https://github.com/uber/horovod/tree/master/examples](https://github.com/uber/horovod/tree/master/examples)     |
| Related Tools on the DSVM      | TensorFlow      |
| How to use / run it?    | At a terminal: activate the correct environment, then run Python. |

## Keras

|    |           |
| ------------- | ------------- |
| What is it?   | High-level deep learning API      |
| Supported DSVM Editions      | Windows, Linux     |
| How is it configured / installed on the DSVM?  | TensorFlow is installed in Python 3.5 on [Linux and Windows 2012](dsvm-languages.md#python-linux-and-windows-server-2012-edition) and Python 3.6 on [Windows 2016](dsvm-languages.md#python-windows-server-2016-edition). |
| Links to Samples      | https://github.com/fchollet/keras/tree/master/examples      |
| Related Tools on the DSVM      | Microsoft Cognitive Toolkit, TensorFlow, Theano      |
| How to use / run it?    | * At a terminal: activate the correct environment, then run Python. <br/> * In Jupyter: Download the samples from the GitHub location, connect to [Jupyter](provision-vm.md#tools-installed-on-the-microsoft-data-science-virtual-machine) or [JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-data-science-virtual-machine-for-linux), then open the sample directory. |

## Caffe

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning framework      |
| Supported DSVM Editions      | Ubuntu     |
| How is it configured / installed on the DSVM?  | Caffe is installed in `/opt/caffe`.    |
| How to switch to Python 2.7 | Run `source activate root` |
| Links to Samples      | Samples are included in `/opt/caffe/examples`.      |
| Related Tools on the DSVM      | Caffe2      |

### How to use / run it?

Use X2Go to log in to your VM, then start a new terminal and enter

```
cd /opt/caffe/examples
source activate root
jupyter notebook
```

A new browser window opens with sample notebooks.

Binaries are installed in /opt/caffe/build/install/bin.

Installed version of Caffe requires Python 2.7 and won't work with Python 3.5 activated by default. Run `source activate root` to switch Anaconda environment.

## Caffe2

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning framework      |
| Supported DSVM Editions      | Ubuntu     |
| How is it configured / installed on the DSVM?  | Caffe2 is installed in the [Python 2.7 (root) conda environment](dsvm-languages.md#python-linux-and-windows-server-2012-edition). The source is in `/opt/caffe2`. |
| Links to Samples      | Sample notebooks are included in JupyterHub. |
| Related Tools on the DSVM      | Caffe      |
| How to use / run it?    | * At the terminal: activate the [root Python environment](dsvm-languages.md#python-linux-and-windows-server-2012-edition), start Python, and import caffe2. <br/> * In JupyterHub: [connect to JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-data-science-virtual-machine-for-linux), then navigate to the Caffe2 directory to find sample notebooks. Some notebooks require the Caffe2 root to be set in the Python code; enter /opt/caffe2. |
| Build notes | Caffe2 is built from source on Linux and includes CUDA, cuDNN, and Intel MKL. The current commit is 0d9c0d48c6f20143d6404b99cc568efd29d5a4be, which was chosen for stability on all GPUs and samples tested. |

## Chainer

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning framework      |
| Supported DSVM Editions      | Windows, Linux     |
| How is it configured / installed on the DSVM?  | Chainer is installed in [Python 3.5](dsvm-languages.md#python-linux-and-windows-server-2012-edition). ChainerRL and ChainerCV are also installed.   |
| Links to Samples      | Sample notebooks are included in JupyterHub. |
| Related Tools on the DSVM      | Caffe      |
| How to use / run it?  | * At the terminal: activate the [Python 3.5](dsvm-languages.md#python-linux-and-windows-server-2012-edition) environment, run _python_, then import chainer. <br/> * In JupyterHub: [connect to JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-data-science-virtual-machine-for-linux), then navigate to the Chainer directory to find sample notebooks.


## Deep Water

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning framework for H2O      |
| Supported DSVM Editions      | Ubuntu     |
| How is it configured / installed on the DSVM?  | Deep Water is installed in [Python 3.5](dsvm-languages.md#python-linux-and-windows-server-2012-edition) and is also available in `/dsvm/tools/deep_water`.   |
| Links to Samples      | Sample notebooks are included in JupyterHub.      |
| Related Tools on the DSVM      | H2O, Sparkling Water      |

### How to use / run it?

Deep Water requires CUDA 8 with cuDNN 5.1. This is not in the library path by default, as other deep learning frameworks use CUDA 9 and cuDNN 7. To use CUDA 8 + cuDNN 5.1 for Deep Water:

```
export LD_LIBRARY_PATH=/usr/local/cuda-8.0/lib64:${LD_LIBRARY_PATH}
export CUDA_ROOT=/usr/local/cuda-8.0
```

To use Deep Water:
* At the terminal: activate the [Python 3.5](dsvm-languages.md#python-linux-and-windows-server-2012-edition) environment, then run _python_. <br/>
* In JupyterHub: [connect to JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-data-science-virtual-machine-for-linux), then navigate to the deep_water directory to find sample notebooks.

## MXNet

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning framework      |
| Supported DSVM Editions      | Windows, Linux     |
| How is it configured / installed on the DSVM?  | MXNet is installed in `C:\dsvm\tools\mxnet` on Windows and `/dsvm/tools/mxnet` on Linux. Python bindings are installed in Python 3.5 on [Linux and Windows 2012](dsvm-languages.md#python-linux-and-windows-server-2012-edition) and Python 3.6 on [Windows 2016](dsvm-languages.md#python-windows-server-2016-edition). R bindings are also installed on Ubuntu.   |
| Links to Samples      | Sample Jupyter notebooks are included.    |
| Related Tools on the DSVM      | Keras      |
| How to use / run it?    | * At a terminal: activate the correct environment, then run Python. <br/> * In Jupyter: Connect to [Jupyter](provision-vm.md#tools-installed-on-the-microsoft-data-science-virtual-machine) or [JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-data-science-virtual-machine-for-linux), then open the mxnet directory for samples.  |
 | Build notes | MXNet is built from source on Linux. This build includes CUDA, cuDNN, NCCL, and MKL. |

## NVIDIA DIGITS

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning system from NVIDIA for rapidly training deep learning models      |
| Supported DSVM Editions      | Ubuntu     |
| How is it configured / installed on the DSVM?  | DIGITS is installed in `/dsvm/tools/DIGITS` and is available a service called _digits_.   |

### How to use / run it?

Log in to the VM with X2Go. At a terminal, start the service:

    sudo systemctl start digits

The service takes about one minute to start. Start a web browser and navigate to `http://localhost:5000`. Note that DIGITS does not provide a secure login and should not be exposed outside the VM.



## nvidia-smi

|    |           |
| ------------- | ------------- |
| What is it?   | NVIDIA tool for querying GPU activity      |
| Supported DSVM Editions      | Windows, Linux     |
| How is it configured / installed on the DSVM?  | _nvidia-smi_ is available on the system path.   |
| How to use / run it? | Start a command prompt (on Windows) or a terminal (on Linux), then run _nvidia-smi_.



## Theano

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning framework      |
| Supported DSVM Editions      | Ubuntu     |
| How is it configured / installed on the DSVM?  | Theano is installed in Python 2.7 (_root_), as well as Python 3.5 (_py35_) environment.   |
| Related Tools on the DSVM      | Keras      |
| How to use / run it?    | * At a terminal, activate the Python version you want (root or py35), run python, then import theano. <br/> * In Jupyter, select the Python 2.7 or 3.5 kernel, then import theano.  <br/>To work around a recent MKL bug, you need to first set the MKL threading layer:<br/><br/>_export MKL_THREADING_LAYER=GNU_|



## Torch

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning framework      |
| Supported DSVM Editions      | Ubuntu     |
| How is it configured / installed on the DSVM?  | Torch is installed in `/dsvm/tools/torch`. PyTorch is installed in Python 2.7 (_root_), as well as Python 3.5 (_py35_) environment.   |
| Links to Samples      | Torch samples are located at `/dsvm/samples/torch`. PyTorch samples are located at `/dsvm/samples/pytorch`.      |


## PyTorch

|    |           |
| ------------- | ------------- |
| What is it?   | Deep learning framework      |
| Supported DSVM Editions      | Linux     |
| How is it configured / installed on the DSVM?  | PyTorch is installed in [Python 3.5](dsvm-languages.md#python-linux-and-windows-server-2012-edition).  |
| Links to Samples      | Sample Jupyter notebooks are included, and samples can also be found in /dsvm/samples/pytorch.      |
| Related Tools on the DSVM      | Torch      |
| How to use / run it |* At a terminal: activate the correct environment, then run Python. <br/> * In Jupyter: Connect to [JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-data-science-virtual-machine-for-linux), then open the PyTorch directory for samples.  |

## MXNet Model Server

|    |           |
| ------------- | ------------- |
| What is it?   | A server to create HTTP endpoints for MXNet and ONNX models      |
| Supported DSVM Editions      | Linux     |
| How is it configured / installed on the DSVM?  | _mxnet-model-server_ is available on at the terminal.   |
| Links to Samples      | Look for up-to-date samples on the [MXNet Model Server page](https://github.com/awslabs/mxnet-model-server).    |
| Related Tools on the DSVM      | MXNet      |

## TensorFlow Serving

|    |           |
| ------------- | ------------- |
| What is it?   | A server to run inferencing on a TensorFlow model      |
| Supported DSVM Editions      | Linux     |
| How is it configured / installed on the DSVM?  | _tensorflow_model_server_ is available at the terminal.   |
| Links to Samples      | Samples are available [online](https://www.tensorflow.org/serving/).      |
| Related Tools on the DSVM      | TensorFlow      |

## TensorRT

|    |           |
| ------------- | ------------- |
| What is it?   | A deep learning inference server from NVIDIA. |
| Supported DSVM Editions      | Ubuntu     |
| How is it configured / installed on the DSVM?  | TensorRT is installed as an _apt_ package.   |
| Links to Samples      | Samples are available [online](https://docs.nvidia.com/deeplearning/sdk/tensorrt-developer-guide/index.html#samples).      |
| Related Tools on the DSVM      | TensorFlow Serving, MXNet Model Server  |



