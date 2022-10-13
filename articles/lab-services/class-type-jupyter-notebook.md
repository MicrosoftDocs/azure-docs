---
title: Set up a lab to teach data science with Python and Jupyter Notebooks | Microsoft Docs
description: Learn how to set up a lab to teach data science using Python and Jupyter Notebooks. 
author: emaher
ms.topic: how-to
ms.date: 01/04/2022
ms.author: enewman
---

# Set up a lab to teach data science with Python and Jupyter Notebooks

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

Jupyter Notebooks is an open-source project that lets you easily combine rich text and executable Python source code on a single canvas called a notebook. Running a notebook results in a linear record of inputs and outputs. Those outputs can include text, tables of information, scatter plots, and more.

This article outlines how to set up a template virtual machine (VM) in Azure Lab Services with the tools needed to teach students to use [Jupyter Notebooks](http://jupyter-notebook.readthedocs.io/).  We'll also show how students can connect to their notebooks on their virtual machines (VMs).

## Lab configuration

[!INCLUDE [must have subscription](./includes/lab-services-class-type-subscription.md)]

### Lab plan settings

[!INCLUDE [must have lab plan](./includes/lab-services-class-type-lab-plan.md)]

Enable settings described in the table below for the lab plan. For more information on enabling marketplace images, see [specify Marketplace images available to lab creators](specify-marketplace-images.md).

| Lab plan setting | Instructions |
| ------------------- | ------------ |
| Marketplace image | Inside your lab account, enable either **Data Science Virtual Machine – Windows Server 2019** or **Data Science Virtual Machine – Ubuntu 18.04** depending on your OS needs. |

This article uses the Data Science virtual machine images available on the Azure Marketplace because they are already configured with Jupyter Notebook. These images, however, also include many other development and modeling tools for data science. If you don't want those extra tools and want a lightweight setup with only Jupyter notebooks, create a custom VM image. For an example, [Installing JupyterHub on Azure](http://tljh.jupyter.org/en/latest/install/azure.html). Once the custom image is created, you can upload it to a compute gallery to use the image inside Azure Lab Services. Learn more about [using compute gallery in Azure Lab Services](how-to-attach-detach-shared-image-gallery.md).

### Lab settings

[!INCLUDE [create lab](./includes/lab-services-class-type-lab.md)]  Enable your lab settings as described in the following table. For more information about how to enable Azure Marketplace images, see [Specify the Azure Marketplace images available to lab creators](./specify-marketplace-images.md).

| Lab settings | Value |
| ------------ | ------------------ |
| Virtual machine size | Select **Small** or **Medium** for a basic setup accessing Jupyter Notebooks. Select **Small GPU (Compute)** for compute-intensive and network-intensive applications used in Artificial Intelligence and Deep Learning classes. |
| Virtual machine image | Choose **[Data Science Virtual Machine – Windows Server 2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019)** or **[Data Science Virtual Machine – Ubuntu 18.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-1804?tab=Overview)** depending on your OS needs. |
| Template virtual machine settings | Select **Use virtual machine without customization.**.

When you create a lab with the **Small GPU (Compute)** size, you can [install GPU drivers](./how-to-setup-lab-gpu.md#ensure-that-the-appropriate-gpu-drivers-are-installed).  This option installs recent NVIDIA drivers and Compute Unified Device Architecture (CUDA) toolkit, which is required to enable high-performance computing with the GPU.  For more information, see the article [Set up a lab with GPU virtual machines](./how-to-setup-lab-gpu.md).

## Template machine configuration

[!INCLUDE [configure template vm](./includes/lab-services-class-type-template-vm.md)]

The Data Science VM images come with many of data science frameworks and tools required for this type of class. For example, the images include:

- [Jupyter Notebooks](http://jupyter-notebook.readthedocs.io/): A web application that allows data scientists to take raw data, run computations, and see the results all in the same environment. It will run locally in the template VM.  
- [Visual Studio Code](https://code.visualstudio.com/): An integrated development environment (IDE) that provides a rich interactive experience when writing and testing a notebook. For more information, see [Working with Jupyter Notebooks in Visual Studio Code](https://code.visualstudio.com/docs/python/jupyter-support).

The **Data Science Virtual Machine – Ubuntu** image is already provisioned with X2GO server and to enable students to use a graphical desktop experience. No further steps are required when setting up the template VM.

### Enabling tools to use GPUs

If you're using the **Small GPU (Compute)** size, we recommend that you verify that the Data Science frameworks and libraries are properly set up to use GPUs.  You may need to install a different version of the NVIDIA drivers and CUDA toolkit.  To properly configure the GPUs, you should consult the framework's or library's documentation.

For example, to validate that the GPU is configured for TensorFlow, connect to the template VM and run the following Python-TensorFlow code in Jupyter Notebooks:

```python
import tensorflow as tf
from tensorflow.python.client import device_lib

print(device_lib.list_local_devices())
```

If the output from the above code looks like the following, the GPU isn't configured for TensorFlow:

```python
[name: "/device:CPU:0"
device_type: "CPU"
memory_limit: 268435456
locality {
}
incarnation: 15833696144144374634
]
```

Continuing with the above example, see [TensorFlow GPU Support](https://www.tensorflow.org/install/gpu) for guidance.  TensorFlow guidance covers:

- Required version of the [NVIDIA drivers](https://www.nvidia.com/drivers)
- Required version of the [CUDA Toolkit](https://developer.nvidia.com/cuda-toolkit-archive).
- Instructions to install [NVIDIA CUDA Deep Neural Network library (cudDNN)](https://developer.nvidia.com/cudnn).

After you've followed TensorFlow's steps to configure the GPU, when you rerun the test code, you should see output similar to the following output.

```python
[name: "/device:CPU:0"
device_type: "CPU"
memory_limit: 268435456
locality {
}
incarnation: 15833696144144374634
, name: "/device:GPU:0"
device_type: "GPU"
memory_limit: 11154792128
locality {
  bus_id: 1
  links {
  }
}
incarnation: 2659412736190423786
physical_device_desc: "device: 0, name: NVIDIA Tesla K80, pci bus id: 0001:00:00.0, compute capability: 3.7"
]
```

### Provide notebooks for the class

The next task is to provide students with notebooks that you want them to use. Notebooks can be saved locally on the template VM so each student has their own copy.  If you want to use sample notebooks from Azure Machine Learning, see [how to configure an environment with Jupyter Notebooks](../machine-learning/how-to-configure-environment.md#jupyter-notebooks).

### Publish the template machine

When you [publish the template](how-to-create-manage-template.md#publish-the-template-vm), each student registered in the lab will get a copy of the template VM with all the local tools and notebooks you’ve set up on it.

## How students connect to Jupyter Notebooks?

Once you publish the template, each student will have access to a VM that comes with everything you’ve already configured for the class, including the Jupyter Notebooks. The following sections show different ways for students to connect to Jupyter Notebooks.

### For Windows VMs

If you’ve provided students with Windows VMs, they need to connect to their lab VMs to use Jupyter Notebooks.  To connect to a Windows VM, a student can use a remote desktop connection (RDP). For more information, see [Connect to a Windows lab VM](connect-virtual-machine.md#connect-to-a-windows-lab-vm).

### For Linux VMs

If you’ve provided students with Linux VMs, students can Access Jupyter Notebooks locally after connecting to the VM. For instructions to SSH or connect using X2Go, see [Connect to a Linux lab VM](connect-virtual-machine.md#connect-to-a-linux-lab-vm).

#### SSH tunnel to Jupyter server on the VM

Some students may want to connect directly from their local computer directly to the Jupyter server inside their lab VMs. The SSH protocol enables port forwarding between the local computer and a remote server (in our case, the student’s lab VM), so that an application running on a certain port on the server is **tunneled** to the mapping port on the local computer. Students should follow these steps to SSH tunnel to the Jupyter server on their lab VMs:

1. In the Lab Services web portal ([https://labs.azure.com](https://labs.azure.com)), make sure that the Linux VM that you want to connect to is [started](how-to-use-lab.md#start-or-stop-the-vm).
2. Once the VM is running, [get the SSH connection command](connect-virtual-machine.md#connect-to-a-linux-lab-vm-using-ssh) by selecting **Connect**, which will show a window that provides the SSH command string, which will look like the following string:

    ```shell
    ssh -p 12345 student@ml-lab-00000000-0000-0000-0000-000000000000.eastus2.cloudapp.azure.com
    ```

3. On your local computer, launch a terminal or command prompt, and copy the SSH connection string to it. Then, add `-L 8888:localhost:8888` to the command string, which creates the **tunnel** between the ports. The final string should look like:

    ```shell
    ssh –L 8888:localhost:8888 -p 12345 student@ml-lab-00000000-0000-0000-0000-000000000000.eastus.cloudapp.azure.com
     ```

4. Press **ENTER** to run the command.
5. When prompted, provide the password to connect to the lab VM.
6. Once you’re connected to the VM, start the Jupyter server using this command:

    ```bash
    jupyter notebook
    ```

7. Running the command will provide you with a URL in the terminal. The URL should look like:

    ```bash
    http://localhost:8888/?token=8c09ecfc93e6a8cbedf9c66dffdae19670a64acc1d37
    ```

8. Paste this URL into a browser on your local computer to connect and work on your Jupyter Notebook.

    > [!NOTE]
    > Visual Studio Code also enables a great [Jupyter Notebook editing experience](https://code.visualstudio.com/docs/python/jupyter-support). You can follow the instructions on [how to connect to a remote Jupyter server](https://code.visualstudio.com/docs/python/jupyter-support#_connect-to-a-remote-jupyter-server) and use the same URL from the previous step to connect from VS Code instead of from the browser.

## Cost estimate

Let's cover a possible cost estimate for this class. We'll use a class of 25 students. There are 20 hours of scheduled class time. Also, each student gets 10 hours quota for homework or assignments outside scheduled class time. The VM size we chose was small GPU (compute), which is 139 lab units. If you want to use the Small (20 lab units) or Medium size (42 lab units), you can replace the lab unit part in the equation below with the correct number.  

Here is an example of a possible cost estimate for this class:
25 students \* (20 scheduled hours + 10 quota hours) \* 139 lab units \* 0.01 USD per hour = 1042.5 USD

>[!IMPORTANT]
>Cost estimate is for example purposes only. For current details on pricing, see [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Conclusion

In this article, we walked through the steps to create a lab for a Jupyter Notebooks class. You can use a similar setup for other machine learning classes.

## Next steps

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]
