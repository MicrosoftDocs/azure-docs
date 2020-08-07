---
title: Deep Learning & AI frameworks
titleSuffix: Azure Data Science Virtual Machine 
description: Available deep learning frameworks and tools on Azure Data Science Virtual Machine.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
ms.service: machine-learning
ms.subservice: data-science-vm
ms.custom: tracking-python

author: lobrien
ms.author: laobri
ms.topic: conceptual
ms.date: 12/12/2019
---

# Deep learning and AI frameworks for the Azure Data Science VM
Deep learning frameworks on the DSVM are listed below.

## [Caffe](https://github.com/BVLC/caffe)

|    |           |
| ------------- | ------------- |
| Version(s) supported | |
| Supported DSVM editions      | Linux (Ubuntu)     |
| How is it configured / installed on the DSVM?  | Caffe is installed in `/opt/caffe`.   Samples are in `/opt/caffe/examples`.|
| How to run it      | use X2Go to sign in to your VM, and then start a new terminal and enter the following:<br/>`cd /opt/caffe/examples`<br/>`source activate root`<br/>`jupyter notebook`<br/><br/>A new browser window opens with sample notebooks. Binaries are installed in /opt/caffe/build/install/bin.<br/><br/>Installed version of Caffe requires Python 2.7 and won't work with Python 3.5, which is activated by default. To switch to Python 2.7, run `source activate root` to switch to Anaconda environment.|    

## [Caffe2](https://github.com/caffe2/caffe2)

|    |           |
| ------------- | ------------- |
| Version(s) supported | |
| Supported DSVM editions      | Linux (Ubuntu)     |
| How is it configured / installed on the DSVM?  | Caffe2 is installed in the [Python 2.7 (root) conda environment. |
| How to run it      | Terminal: Start Python, and import Caffe2. <br/> * JupyterHub: [Connect to JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-ubuntu-data-science-virtual-machine), and then go to the Caffe2 directory to find sample notebooks. Some notebooks require the Caffe2 root to be set in the Python code; enter /opt/caffe2. |

## [Chainer](https://chainer.org/)

|    |           |
| ------------- | ------------- |
| Version(s) supported | 5.2 |
| Supported DSVM editions      | Linux (Ubuntu)     |
| How is it configured / installed on the DSVM?  | Chainer is installed in Python 3.5. |
| How to run it      | Terminal: Activate the Python 3.5 environment, run `python`, and then `import chainer`. <br/> * JupyterHub: [Connect to JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-ubuntu-data-science-virtual-machine), and then go to the Chainer directory to find sample notebooks.| 

## [CUDA, cuDNN, NVIDIA Driver](https://developer.nvidia.com/cuda-toolkit)

|    |           |
| ------------- | ------------- |
| Version(s) supported | 10.0.130|
| Supported DSVM editions      | Windows and Linux   |
| How is it configured / installed on the DSVM?  |_nvidia-smi_ is available on the system path.  |
| How to run it      | Open a command prompt (on Windows) or a terminal (on Linux), and then run _nvidia-smi_. |


## [Horovod](https://github.com/uber/horovod)

|    |           |
| ------------- | ------------- |
| Version(s) supported | 0.16.1|
| Supported DSVM editions      | Linux (Ubuntu)   |
| How is it configured / installed on the DSVM?  | Horovod is installed in Python 3.5 |
| How to run it      | Activate the correct environment at the terminal, and then run Python. |

## [Keras](https://keras.io/)

|    |           |
| ------------- | ------------- |
| Version(s) supported | 2.2.4 |
| Supported DSVM editions      | Windows and Linux   |
| How is it configured / installed on the DSVM?  | Keras is installed in Python 3.6 on Windows and in Python 3.5 in Linux |
| How to run it      | Activate the correct environment at the terminal, and then run Python. |

## [Microsoft Cognitive Toolkit (CNTK)](https://docs.microsoft.com/cognitive-toolkit/)

|    |           |
| ------------- | ------------- |
| Version(s) supported | 2.5.1 |
| Supported DSVM editions      | Windows and Linux   |
| How is it configured / installed on the DSVM?  | CNTK is installed in Python 3.6 on [Windows 2016](dsvm-tools-languages.md#python-windows-server-2016-edition) and in Python 3.5 on [Linux](./dsvm-tools-languages.md#python-linux-edition)) |
| How to run it      | Terminal: Activate the correct environment and run Python. <br/>Jupyter: Connect to [Jupyter](provision-vm.md) or [JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-ubuntu-data-science-virtual-machine), and then open the CNTK directory for samples. |

## [MXNet](https://mxnet.apache.org/)
|    |           |
| ------------- | ------------- |
| Version(s) supported | 1.3.0 |
| Supported DSVM editions      | Windows and Linux   |
| How is it configured / installed on the DSVM?  | MXNet is installed in `C:\dsvm\tools\mxnet` on Windows and `/dsvm/tools/mxnet` on Ubuntu. Python bindings are installed in Python 3.6 on [Windows 2016](dsvm-tools-languages.md#python-windows-server-2016-edition) and in Python 3.5 on [Linux](./dsvm-tools-languages.md#python-linux-edition)) R bindings are also included in the Ubuntu DSVM. |
| How to run it      | Terminal: Activate the correct conda environment, then run `import mxnet`. <br/>Jupyter: Connect to [Jupyter](provision-vm.md#access-the-dsvm) or [JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-ubuntu-data-science-virtual-machine), and then open the `mxnet` directory for samples. |

## [MXNet Model Server](https://github.com/awslabs/mxnet-model-server#quick-start)

|    |           |
| ------------- | ------------- |
| Version(s) supported | 1.0.1 |
| Supported DSVM editions      | Windows and Linux   |
| How is it configured / installed on the DSVM?  | MXNet Model Server is installed in Python 3.6 on [Windows 2016](dsvm-tools-languages.md#python-windows-server-2016-edition) and in Python 3.5 on [Linux](./dsvm-tools-languages.md#python-linux-edition)) |
| How to run it      | Terminal: Run `sudo systemctl stop jupyterhub` to stop the JupyterHub service first, because both listen on the same port. Then activate the correct conda environment and run `mxnet-model-server --start --models squeezenet=https://s3.amazonaws.com/model-server/model_archive_1.0/squeezenet_v1.1.mar` |

## [NVidia System Management Interface (nvidia-smi)](https://developer.nvidia.com/nvidia-system-management-interface)

|    |           |
| ------------- | ------------- |
| Version(s) supported |  |
| Supported DSVM editions      | Windows and Linux   |
| What is it for? | NVIDIA tool for querying GPU activity |
| How is it configured / installed on the DSVM?  | `nvidia-smi` is on the system path. |
| How to run it      | On a virtual machine **with GPU's**, open a command prompt (on Windows) or a terminal (on Linux), and then run `nvidia-smi`. |

## [PyTorch](https://pytorch.org/)

|    |           |
| ------------- | ------------- |
| Version(s) supported | 1.2.0 (Ubuntu 16.04, Windows 2016), 1.4.0 (Ubuntu 18.04, Windows 2019) |
| Supported DSVM editions      | Linux |
| How is it configured / installed on the DSVM?  | Installed in [Python 3.5](dsvm-tools-languages.md#python-linux-edition). Sample Jupyter notebooks are included, and samples are in /dsvm/samples/pytorch. |
| How to run it      | Terminal: Activate the correct environment, and then run Python.<br/>* [JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-ubuntu-data-science-virtual-machine): Connect, and then open the PyTorch directory for samples.  |

## [TensorFlow](https://www.tensorflow.org/)

|    |           |
| ------------- | ------------- |
| Version(s) supported | 1.13 |
| Supported DSVM editions      | Windows, Linux |
| How is it configured / installed on the DSVM?  | Installed in Python 3.5 on [Linux](dsvm-tools-languages.md#python-linux-edition) and Python 3.6 on [Windows 2016](dsvm-tools-languages.md#python-windows-server-2016-edition) |
| How to run it      | Terminal: Activate the correct environment, and then run Python. <br/> * Jupyter: Connect to [Jupyter](provision-vm.md) or [JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-ubuntu-data-science-virtual-machine), and then open the TensorFlow directory for samples.   |

## [TensorFlow Serving](https://www.tensorflow.org/serving/)

|    |           |
| ------------- | ------------- |
| Version(s) supported | 1.12 |
| Supported DSVM editions      | Linux |
| How is it configured / installed on the DSVM?  | tensorflow_model_server is available at the terminal. |
| How to run it      |  Samples are available [online](https://www.tensorflow.org/serving/).   |


## [Theano](https://github.com/Theano/Theano)

|    |           |
| ------------- | ------------- |
| Version(s) supported | 1.0.3 |
| Supported DSVM editions      | Linux |
| How is it configured / installed on the DSVM?  |Theano is installed in Python 2.7 (_root_), and in Python 3.5 (_py35_) environment. |
| How to run it      |  Terminal: Activate the Python version you want (root or py35), run Python, and then import Theano.<br/>* Jupyter: Select the Python 2.7 or 3.5 kernel, and then import Theano.  <br/>To work around a recent math kernel library (MKL) bug, you need to first set the MKL threading layer as follows:<br/><br/>`export MKL_THREADING_LAYER=GNU`  |
