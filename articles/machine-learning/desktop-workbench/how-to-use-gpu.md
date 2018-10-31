---
title: How to Use GPU for Azure Machine Learning | Microsoft Docs
description: This article describes how to use Graphical Processing Units (GPU) to train deep neural networks in Azure Machine Learning Workbench.
services: machine-learning
author: rastala
ms.author: roastala
manager: jhubbard
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 09/14/2017

ROBOTS: NOINDEX
---
# How to use GPU in Azure Machine Learning

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)]

Graphical Processing Unit (GPU) is widely used to process computationally intensive tasks that can typically happen when training certain deep neural network models. By using GPUs, you can reduce the training time of the models significantly. In this document, you learn how to configure Azure ML Workbench to use  [DSVM (Data Science Virtual Machine)](https://docs.microsoft.com/azure/machine-learning/data-science-virtual-machine/overview) equipped with GPUs as execution target. 

## Prerequisites
- To step through this how-to guide, you need to first [install Azure ML Workbench](quickstart-installation.md).
- You need to have access to computers equipped with NVidia GPUs.
    - You can run your scripts directly on local machine (Windows or macOS) with GPUs.
    - You can also run scripts in a Docker container on a Linux machine with GPUs..

## Execute in _local_ Environment with GPUs
You can install Azure ML Workbench on a computer equipped with GPUs and execute against _local_ environment. This can be:
- A physical Windows or macOS machine.
- A Windows VM (Virtual Machine) such as a Windows DSVM provisioned using Azure NC-series VMs template.

In this case, there are no special configuration required in Azure ML Workbench. Just make sure you have all the necessary drivers, toolkits, and GPU-enabled machine learning libraries installed locally. Simply execute against _local_ environment where the Python runtime can directly access the local GPU hardware.

1. Open AML Workbench. go to **File** and **Open Command Prompt**. 
2. From command line, install GPU-enabled deep learning framework such as the Microsoft Cognitive Toolkit, TensorFlow, and etc. For example:

```batch
REM install latest TensorFlow with GPU support
C:\MyProj> pip install tensorflow-gpu

REM install Microsoft Cognitive Toolkit 2.5 with GPU support on Windows
C:\MyProj> pip install https://cntk.ai/PythonWheel/GPU/cntk_gpu-2.5.1-cp35-cp35m-win_amd64.whl
```

3. Write Python code that leverages the deep learning libraries.
4. Choose _local_ as compute environment and execute the Python code.

```batch
REM execute Python script in local environment
C:\MyProj> az ml experiment submit -c local my-deep-learning-script.py
```

## Execute in _docker_ Environment on Linux VM with GPUs
Azure ML Workbench also support execution in Docker in an Azure Linux VM. Here you have a great option to run computationally intensive jobs on a piece of powerful virtual hardware, and pay only for the usage by turning it off when done. While in principle it is possible to use GPUs on any Linux virtual machine, the Ubuntu-based DSVM comes with the required CUDA drivers and libraries pre-installed, making the set-up much easier. Follow the below steps:

### Create a Ubuntu-based Linux Data Science Virtual Machine in Azure
1. Open your web browser and go to the [Azure portal](https://portal.azure.com)

2. Select **+ New** on the left of the portal.

3. Search for "Data Science Virtual Machine for Linux (Ubuntu)" in the marketplace.

4. Click **Create** to create an Ubuntu DSVM.

5. Fill in the **Basics** form with the required information.
When selecting the location for your VM, note that GPU VMs are only available in certain Azure regions, for example, **South Central US**. See [compute products available by region](https://azure.microsoft.com/regions/services/).
Click OK to save the **Basics** information.

6. Choose the size of the virtual machine. Select one of the sizes with NC-prefixed VMs, which are equipped with NVidia GPU chips.  Click **View All** to see the full list as needed. Learn more about [GPU-equipped Azure VMs](https://docs.microsoft.com/azure/virtual-machines/windows/sizes-gpu).

7. Finish the remaining settings and review the purchase information. Click Purchase to Create the VM. Take note of the IP address allocated to the virtual machine. 

### Create a New Project in Azure ML Workbench 
You can use the _Classifying MNIST using TensorFlow_ example, or the _Classifying MNIST dataset with CNTK_ example.

### Create a new Compute Target
Launch the command line from Azure ML Workbench. Enter the following command. Replace the placeholder text from the example below with your own values for the name, IP address, username, and password. 

```batch
C:\MyProj> az ml computetarget attach remotedocker --name "my_dsvm" --address "my_dsvm_ip_address" --username "my_name" --password "my_password" 
```

### Configure Azure ML Workbench to Access GPU
Go back to the project and open **File View**, and hit the **Refresh** button. Now you see two new configuration files `my_dsvm.compute` and `my_dsvm.runconfig`.
 
Open the `my_dsvm.compute`. Change the `baseDockerImage` to `microsoft/mmlspark:plus-gpu-0.9.9` and add a new line `nvidiaDocker: true`. So the file should have these two lines:
 
```yaml
...
baseDockerImage: microsoft/mmlspark:plus-gpu-0.9.9
nvidiaDocker: true
```
 
Now open `my_dsvm.runconfig`, change `Framework` value from `PySpark` to `Python`. If you don't see this line, add it, since the default value would be `PySpark`.

```yaml
"Framework": "Python"
```
### Reference Deep Learning Framework 
Open `conda_dependencies.yml` file, and make sure you are using the GPU version of the deep learning framework Python packages. The sample projects list CPU versions so you need to make this change.

Example for TensorFlow: 
```
name: project_environment
dependencies:
  - python=3.5.2
  # latest TensorFlow library with GPU support
  - tensorflow-gpu
```

Example for Microsoft Cognitive Toolkit:
```yaml
name: project_environment
dependencies:
  - python=3.5.2
  - pip: 
    # use the Linux build of Microsoft Cognitive Toolkit 2.5 with GPU support
    - https://cntk.ai/PythonWheel/GPU/cntk_gpu-2.5.1-cp35-cp35m-win_amd64.whl
```

### Execute
You are now ready to run your Python scripts. You can run them within the Azure ML Workbench using the `my_dsvm` context, or you can launch it from the command line:
 
```batch
C:\myProj> az ml experiment submit -c my_dsvm my_tensorflow_or_cntk_script.py
```
 
To verify that the GPU is used, examine the run output to see something like the following:

```
name: Tesla K80
major: 3 minor: 7 memoryClockRate (GHz) 0.8235
pciBusID 06c3:00:00.0
Total memory: 11.17GiB
Free memory: 11.11GiB
```

Congratulations! Your script just harnessed the power of GPU through a Docker container!

## Next steps
See an example of using GPU to accelerate deep neural network training at Azure ML Gallery.
