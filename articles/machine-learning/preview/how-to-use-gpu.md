---
title: How to Use GPU for Azure Machine Learning | Microsoft Docs
description: This article describes how to use Graphical Processing Units (GPU) to train deep neural networks in Azure Machine Learning Workbench.
services: machine-learning
author: rastala
ms.author: roastala
manager: jhubbard
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 09/01/2017
---
# How to use GPU from Azure Machine Learning Workbench
You can use Graphical Processing Unit (GPU) hardware to handle the intensive processing that happens when training certain deep neural network models in Azure Machine Learning. By using GPUs, you can accelerate the training time of deep neural network models significantly. 

In this document, you learn how to configure AML Workbench to use GPU-based  [Data Science Virtual Machine](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-data-science-virtual-machine-overview) (DSVM) as execution target. While in principle it is possible to use GPUs on any Linux machine, the DSVM comes with the required drivers and libraries pre-installed, making the set-up much easier. 

## Prerequisites
To step through this how-to guide, you need to:
- [Install AML Workbench](doc-template-how-to.md)

## Execute on Local Windows Computer with GPU
You can execute directly on a GPU-enabled Windows computer that has required drivers and libraries installed. For example, you can use GPU-enabled Windows DSVM. Otherwise, read the following instructions to set up a GPU-enabled Docker image on Linux DSVM.

1. Open AML Workbench. go to **File** and **Open Command Prompt**. 
2. From command line, install GPU-enabled deep learning framework such as CNTK or TensorFlow. 
3. Then choose "local" as compute target. 

## Create a Ubuntu-based Linux Data Science Virtual Machine in Azure
1. Open your web browser and go to the [Azure portal](https://portal.azure.com)
2. Select **+ New** on the left of the portal.
3. Search for "Data Science Virtual Machine for Linux (Ubuntu)" in the marketplace.
4. Click **Create** to create an Ubuntu DSVM. 
5. Fill in the basics form with the requested values. 
When selecting the location for your VM, note that GPU VMs are only available in some Azure regions, for example, **South Central US**. See [compute products available by region](https://azure.microsoft.com/en-us/regions/services/).
Click OK to save the Basics information.
6. Choose the size of the virtual machine. Select one of the sizes with NC-prefixed VMs, since those are the GPU-enabled ones.  Click **View All** to see the full list as needed.
   Learn more about GPU-enabled VM sizes [here](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes-gpu).
7. Finish the remaining settings and review the purchase information. Click Purchase to Create the VM. Take note of the IP address allocated to the virtual machine. 

## Open AML Workbench, and create a new project. 
You can use the _Classifying MNIST using TensorFlow_ example, or the _Classifying MNIST dataset with CNTK_ example.

## Create a new compute context
Launch the command line or bash shell. Enter the following AZ CLI command. Replace the placeholder text from the example below with your own values for the name, address, username, and password parameters. 

```azurecli
az ml computetarget attach --name "my_dsvm" --address "my_dsvm_ip_address" --username "my_name" --password "my_password"
```

## Configure AML Workbench to access the GPU
Go back to the project and open **files view**, and hit the **Refresh** button. Now you see two new configuration files `my\_dsvm.compute` and `my\_dsvm.runconfig`.
 
Open the file named _my\_dsvm.compute_. Change the _baseDockerImage_ to _microsoft/mmlspark:gpu_ and add a line _nvidiaDocker: true_ to the end. So the file should have these two lines:
 
```
baseDockerImage: microsoft/mmlspark:gpu
nvidiaDocker: true
```
 
Now open _my\_dsvm.runconfig_, change _Framework_ value from _PySpark_ to _Python_. If you don't see this line, add it, since the default value would be _PySpark_.

```
"Framework": "Python"
```
## Reference Deep Learning Framework 
Open _conda\_dependencies.yml_ file, and make sure you are using the GPU version of the deep learning framework Python packages. The sample projects list CPU versions so you need to make this change.

### For TensorFlow: 
```
name: project_environment
dependencies:
  - python=3.5.2
  - tensorflow-gpu
```

### For CNTK:
```
name: project_environment
dependencies:
  - python=3.5.2
  - pip:    
    - https://cntk.ai/PythonWheel/GPU/cntk-2.1-cp35-cp35m-linux_x86_64.whl
```

You can also use the 1bit-SGD version of CNTK that can give performance improvements on multi-GPU VMs. Do note [the license for 1bit-SGD](https://docs.microsoft.com/en-us/cognitive-toolkit/cntk-1bit-sgd-license).

```
name: project_environment
dependencies:
  - python=3.5.2
  - pip:    
    - https://cntk.ai/PythonWheel/GPU-1bit-SGD/cntk-2.1-cp35-cp35m-linux_x86_64.whl
```

## Execute
You are now ready to run your Python scripts. You can run them within the AML Workbench using the _my_dsvm_ context, or you can launch it from the command line:
 
```azurecli
az ml experiment submit -c my_dsvm my_tensorflow_or_cntk_script.py
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