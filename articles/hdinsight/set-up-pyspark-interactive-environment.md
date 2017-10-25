---
title: Azure HDInsight Tools - Set Up PySpark Interactive Environment for Visual Studio Code | Microsoft Docs
description: Learn how to use the Azure HDInsight Tools for Visual Studio Code to create, submit queries and scripts.
Keywords: VScode,Azure HDInsight Tools,Hive,Python,PySpark,Spark,HDInsight,Hadoop,LLAP,Interactive Hive,Interactive Query
services: HDInsight
documentationcenter: ''
author: jejiang
manager: 
editor: 
tags: azure-portal

ms.assetid: 
ms.service: HDInsight
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 10/27/2017
ms.author: jejiang
---

# Set Up PySpark Interactive Environment for Visual Studio Code

The following steps show how to install python packages when run **HDInsight: PySpark Interactive**.
If install python 3.x, you need to use command **pip3** for the following steps.
1.	Make sure the **Python** and **pip** installed.
 
    ![python pip version](./media/set-up-pyspark-interactive-environment/check-python-pip-version.png)

2.	Install Jupyter
    ```
    sudo pip install jupyter
    ```
    +  Maybe the following error message come out on Linux and MacOS:

    ![error1](./media/set-up-pyspark-interactive-environment/error1.png)
     ```Resolve:
    sudo pip uninstall asyncio
    sudo pip install trollies
    ```

    + Install libkrb5-dev(For Linux only), maybe display the following error message:

    ![error2](./media/set-up-pyspark-interactive-environment/error2.png)


    ```Resolve:
    sudo apt-get install libkrb5-dev 
    ```

3.	Install sparkmagic
    ```
    sudo pip install sparkmagic
    ```

4.	Make sure that ipywidgets is properly installed by running:

    ```
    sudo jupyter nbextension enable --py --sys-prefix widgetsnbextension
    ```
     ![Install the wrapper kernels](./media/set-up-pyspark-interactive-environment/ipywidget-enable.png)
 

5.	Install the wrapper kernels. Do run **pip show sparkmagic** and it shows the path which sparkmagic is installed. 

    ![sparkmagic location](./media/set-up-pyspark-interactive-environment/sparkmagic-location.png)
   
6. Navigate to the location and run:

   ```Python2
   sudo jupyter-kernelspec install sparkmagic/kernels/pysparkkernel   
   ```
   ```Python3
   sudo jupyter-kernelspec install sparkmagic/kernels/pyspark3kernel
   ```

   ![jupyter kernelspec install](./media/set-up-pyspark-interactive-environment/jupyter-kernelspec-install.png)
7. Check the installation status: 


   ```
   jupyter-kernelspec list
   ```
   ![jupyter kernelspec list](./media/set-up-pyspark-interactive-environment/jupyter-kernelspec-list.png)
  For available kernels: **python2** and **pysparkkernel** corresponds to python 2.x, **python3** and **pyspark3kernel** corresponds to python 3.x. 

8. Restart VScode and back to script editor running **HDInsight: PySpark Interactive**.

