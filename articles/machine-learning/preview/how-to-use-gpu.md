---
title: How to Use GPU Machine Learning | Microsoft Docs
description: This sample describes the article in 115 to 145 characters. Validate using Gauntlet toolbar check icon. Use SEO kind of action verbs here.
services: machine-learning
author: rastala
ms.author: roastala
manager: jhubbard
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 08/32/2017
---
# How to Use GPU from Azure Machine Learning Workbench

By using GPUs, you can accelerate the training time of deep neural network models significantly. In this document, you learn how to configure AML Workbench to use GPU-based  [Data Science Virtual Machine](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-data-science-virtual-machine-overview) (DSVM) as execution target. While in principle it is possible to use GPUs on any Linux machine, the DSVM comes with the required drivers and libraries pre-installed, making the set-up much easier. 

## Prerequisites
To step through this how-to guide, you need to:
- [Install AML Workbench](doc-template-how-to.md)

## Execute on Local Windows Computer with GPU
You can execute directly on a GPU-enabled Windows computer that has required drivers and libraries installed. For example, you can use GPU-enabled Windows DSVM. Otherwise, read the following instructions to set up a GPU-enabled Docker image on Linux DSVM.

From AML Workbench, go to _File_ and _Open Command Prompt_. From command line, install GPU-enabled deep learning framework such as CNTK or TensorFlow. Then choose "local" as compute target. 

## Create a Ubuntu-based Linux DSVM 
Go to Azure portal, select +New, and search for "Data Science Virtual Machine for Linux (Ubuntu)" to create an Ubuntu DSVM. 
 
When selecting the location for your VM, note that GPU VMs are only available in some Azure regions, for example, _South Central US_ has it. See [compute products available by region](https://azure.microsoft.com/en-us/regions/services/).
 
Then when configuring VM size, select one of the NC-prefixed VMs. They are the GPU-enabled ones. Finish creating the VM, and take note of its IP address. You can learn more about GPU-enabled VM sizes [here](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes-gpu).
 
## Open AML Workbench, and create a new project. 
You can use the _Classifying MNIST using TensorFlow_ example, or the _Classifying MNIST dataset with CNTK_ example.
 
## Create a new compute context

Open CLI window, and enter the following command:

```
$ az ml computetarget attach --name "my_dsvm" --address "my_dsvm_ip_address" --username "my_name" --password "my_password"
```
 
## Configure AML Workbench to access GPU
Go back to the project and open _files view_, and hit the _Refresh_ button. You should now see two new configuration files _my\_dsvm.compute_ and _my\_dsvm.runconfig_.
 
Open file named _my\_dsvm.compute_. Change the _baseDockerImage_ to _microsoft/mmlspark:gpu_ and add a line _nvidiaDocker: true_ to the end. So the file should have these two lines:
 
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
You are now ready to run your Python scripts now in the AML Workbench using the _my_dsvm_ context, or you can launch it from CLI:
 
```
$ az ml experiment submit -c my_dsvm my_tensorflow_or_cntk_script.py
```
 
To verify that the GPU is used, you can examine the run output. You should see something like the following:

```
name: Tesla K80
major: 3 minor: 7 memoryClockRate (GHz) 0.8235
pciBusID 06c3:00:00.0
Total memory: 11.17GiB
Free memory: 11.11GiB
```

Congratulations! Your script just harness the power of GPU through Docker container!

## Next steps
See an example of using GPU to accelerate deep neural network training at Azure ML Gallery.