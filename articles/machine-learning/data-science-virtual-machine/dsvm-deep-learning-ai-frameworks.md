---
title: Deep Learning & AI frameworks
titleSuffix: Azure Data Science Virtual Machine 
description: Available deep learning frameworks and tools on Azure Data Science Virtual Machine, including TensorFlow, PyTorch,  Keras, Caffe, MXNet, Horovod, Theano, Chainer and more.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
ms.service: machine-learning
ms.subservice: data-science-vm

author: vijetajo
ms.author: vijetaj
ms.topic: conceptual
ms.date: 08/11/2019
---

# Deep learning and AI frameworks for Azure Data Science VM
The [Data Science Virtual Machine](https://aka.ms/dsvm) (DSVM) supports a number of deep-learning frameworks to help build artificial intelligence (AI) applications with predictive analytics and cognitive capabilities like image and language understanding.

Deep-learning frameworks available through DSVM include:

+ TensorFlow
+ PyTorch
+ Keras
+ Caffe
+ Caffe2
+ Torch
+ MXNet Model Server
+ MXNet
+ Horovod
+ Theano
+ Chainer
+ Deep Water
+ NVIDIA DIGITS
+ nvidia-smi
+ TensorFlow Serving
+ TensorRT
+ Microsoft Cognitive Toolkit

|Deep-learning&nbsp;tools&nbsp;on&nbsp;DSVM|Windows|Linux|Usage&nbsp;notes|
|---------|-------------------|------------------|-----|
|[TensorFlow](https://www.tensorflow.org/) | Yes (Windows 2016) | Yes |Installed in Python 3.5 on [Linux and Windows 2012](dsvm-languages.md#python-linux-and-windows-server-2012-edition) and Python 3.6 on [Windows 2016](dsvm-languages.md#python-windows-server-2016-edition). Sample Jupyter notebooks are included on DSVM.<br/><br/>**To run it**:<br/>* Terminal: Activate the correct environment, and then run Python. <br/> * Jupyter: Connect to [Jupyter](provision-vm.md) or [JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-ubuntu-data-science-virtual-machine), and then open the TensorFlow directory for samples.  |
|[PyTorch](https://pytorch.org/)| No | Yes |Installed in [Python 3.5](dsvm-languages.md#python-linux-and-windows-server-2012-edition). Sample Jupyter notebooks are included, and samples are in /dsvm/samples/pytorch.    <br/><br/>**To run it**:<br/>* Terminal: Activate the correct environment, and then run Python.<br/>* [JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-ubuntu-data-science-virtual-machine): Connect, and then open the PyTorch directory for samples.  |
|[Keras](https://keras.io/)| Yes | Yes |API is installed in Python 3.5 on [Linux and Windows 2012](dsvm-languages.md#python-linux-and-windows-server-2012-edition) and in Python 3.6 on [Windows 2016](dsvm-languages.md#python-windows-server-2016-edition). [See samples](https://github.com/fchollet/keras/tree/master/examples).<br/><br/>**To run it**:<br/>*  Terminal: Activate the correct environment, and then run Python. <br/> * Jupyter: Download the samples from the GitHub location, connect to [Jupyter](provision-vm.md) or [JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-ubuntu-data-science-virtual-machine), and then open the sample directory. |
|[Caffe](https://github.com/caffe2/caffe2) | No |Yes (Ubuntu)|Caffe is installed in `/opt/caffe`.   Samples are in `/opt/caffe/examples`. <br/><br/>**To run it**, use X2Go to sign in to your VM, and then start a new terminal and enter the following:<br/>`cd /opt/caffe/examples`<br/>`source activate root`<br/>`jupyter notebook`<br/><br/>A new browser window opens with sample notebooks. Binaries are installed in /opt/caffe/build/install/bin.<br/><br/>Installed version of Caffe requires Python 2.7 and won't work with Python 3.5, which is activated by default. To switch to Python 2.7, run `source activate root` to switch to Anaconda environment.|
|[Caffe2](https://github.com/caffe2/caffe2) | No |Yes (Ubuntu)|Caffe2 is installed in the [Python 2.7 (root) conda environment](dsvm-languages.md#python-linux-and-windows-server-2012-edition). The source is in `/opt/caffe2`.<br/>Sample notebooks are included in JupyterHub.<br/><br/>**To run it**:<br/>* Terminal: Activate the [root Python environment](dsvm-languages.md#python-linux-and-windows-server-2012-edition), start Python, and import Caffe2. <br/> * JupyterHub: [Connect to JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-ubuntu-data-science-virtual-machine), and then go to the Caffe2 directory to find sample notebooks. Some notebooks require the Caffe2 root to be set in the Python code; enter /opt/caffe2. |
|[Torch](http://torch.ch/) | No |Yes (Ubuntu)|Torch is installed in `/dsvm/tools/torch`. PyTorch is installed in Python 2.7 (_root_), as well as Python 3.5 (_py35_) environment. Torch samples are in `/dsvm/samples/torch` and PyTorch samples are in `/dsvm/samples/pytorch`. |
|[MXNet](https://mxnet.io/) | Yes (Windows 2016) | Yes|MXNet is installed in `C:\dsvm\tools\mxnet` on Windows and `/dsvm/tools/mxnet` on Linux. Python bindings are installed in Python 3.5 on [Linux and Windows 2012](dsvm-languages.md#python-linux-and-windows-server-2012-edition) and Python 3.6 on [Windows 2016](dsvm-languages.md#python-windows-server-2016-edition). R bindings are also installed on Ubuntu.<br/><br/>Sample Jupyter notebooks are included. <br/><br/>**To run it**:<br/>* Terminal: Activate the correct environment, and then run Python. <br/> * Jupyter: Connect to [Jupyter](provision-vm.md) or [JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-ubuntu-data-science-virtual-machine), and then open the mxnet directory for samples.|
|[MXNet Model Server](https://github.com/awslabs/mxnet-model-server) | No | Yes |A server to create HTTP endpoints for MXNet and ONNX models. _Mxnet-model-server_ is available at the terminal. Samples on the [MXNet Model Server page](https://github.com/awslabs/mxnet-model-server).|
|[Horovod](https://github.com/uber/horovod) | No | Yes (Ubuntu) |Distributed deep-learning framework for TensorFlow. Horovod is installed in Python 3.5 on [Ubuntu](dsvm-languages.md#python-linux-and-windows-server-2012-edition).  [See samples](https://github.com/uber/horovod/tree/master/examples).<br/><br/>**To run it**, activate the correct environment at the terminal, and then run Python. |
|[Theano](https://github.com/Theano/Theano) | No | Yes (Ubuntu) |Theano is installed in Python 2.7 (_root_), and in Python 3.5 (_py35_) environment.<br/><br/>**To run it**: <br/>* Terminal: Activate the Python version you want (root or py35), run Python, and then import Theano.<br/>* Jupyter: Select the Python 2.7 or 3.5 kernel, and then import Theano.  <br/>To work around a recent math kernel library (MKL) bug, you need to first set the MKL threading layer as follows:<br/><br/>`export MKL_THREADING_LAYER=GNU`|
|[Chainer](https://chainer.org/) |No | Yes |Chainer is installed in [Python 3.5](dsvm-languages.md#python-linux-and-windows-server-2012-edition). ChainerRL and ChainerCV are also installed. <br/><br/>Sample notebooks are included in JupyterHub.<br/><br/>**To run it**: <br/>* Terminal: Activate the [Python 3.5](dsvm-languages.md#python-linux-and-windows-server-2012-edition) environment, run _python_, and then import chainer. <br/> * JupyterHub: [Connect to JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-ubuntu-data-science-virtual-machine), and then go to the Chainer directory to find sample notebooks.|
|[NVidia Digits](https://github.com/NVIDIA/DIGITS) | No | Yes (Ubuntu) |Deep-learning system from NVIDIA for rapidly training deep-learning models. DIGITS is installed in `/dsvm/tools/DIGITS` and is available as a service named _digits_.  <br/><br/>**To run it**: <br/>Sign in to the VM with X2Go. At a terminal, start the service by running ```sudo systemctl start digits```. <br/><br/>The service takes about one minute to start. Open a web browser and go to `http://localhost:5000`. Note that DIGITS does not provide a secure login and should not be exposed outside the VM.|
|[CUDA, cuDNN, NVIDIA Driver](https://developer.nvidia.com/cuda-toolkit) |Yes | Yes | |
|nvidia-smi|Yes | Yes |NVIDIA tool for querying GPU activity; _nvidia-smi_ is available on the system path. <br/><br/>Open a command prompt (on Windows) or a terminal (on Linux), and then run _nvidia-smi_.|
|[TensorFlow Serving](https://www.tensorflow.org/serving/) | No | Yes |A server to inference on a TensorFlow model; tensorflow_model_server is available at the terminal. Samples are available [online](https://www.tensorflow.org/serving/).|
|[TensorRT](https://developer.nvidia.com/tensorrt) |  No | Yes (Ubuntu) |A deep-learning inference server from NVIDIA. TensorRT is installed as an _apt_ package. Samples are available [online](https://docs.nvidia.com/deeplearning/sdk/tensorrt-developer-guide/index.html#samples).|
|[Microsoft Cognitive Toolkit (CNTK)](https://docs.microsoft.com/cognitive-toolkit/)|Yes | Yes | Installed in Python 3.5 on [Linux and Windows 2012](dsvm-languages.md#python-linux-and-windows-server-2012-edition) and Python 3.6 on [Windows 2016](dsvm-languages.md#python-windows-server-2016-edition). Sample Jupyter notebooks are included on DSVM. <br/><br/>**To run it**: <br/>Terminal: Activate the correct environment and run Python. <br/>Jupyter: Connect to [Jupyter](provision-vm.md) or [JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-ubuntu-data-science-virtual-machine), and then open the CNTK directory for samples. |
|Deep Water|No | Yes (Ubuntu) |Deep-learning framework for H2O, Deep Water is installed in [Python 3.5](dsvm-languages.md#python-linux-and-windows-server-2012-edition) and is also available in `/dsvm/tools/deep_water`. Sample notebooks are included in JupyterHub. Deep Water requires CUDA 8 with cuDNN 5.1. By default, this is not in the library path, because other deep-learning frameworks use CUDA 9 and cuDNN 7. To use, install CUDA 8 + cuDNN 5.1 for Deep Water:<br/><br/>```export LD_LIBRARY_PATH=/usr/local/cuda-8.0/lib64:${LD_LIBRARY_PATH}```<br/>```export CUDA_ROOT=/usr/local/cuda-8.0```<br/><br/>To use Deep Water:<br/>* Terminal: Activate the [Python 3.5](dsvm-languages.md#python-linux-and-windows-server-2012-edition) environment, and then run _python_. <br/>* JupyterHub: [Connect to JupyterHub](dsvm-ubuntu-intro.md#how-to-access-the-ubuntu-data-science-virtual-machine), and then go to the deep_water directory to find sample notebooks.|
