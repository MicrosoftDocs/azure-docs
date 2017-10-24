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

The following steps show how to install python packages when run **HDInsight: PySpark Interactive.
If install python 3.x, you need to use command **pip3** for the following steps.
1.	Make sure the **Python** and **pip** installed.
 
    ![python pip version](./media/set-up-pyspark-interactive-environment/check-python-pip-version.png)

2.	Install Jupyter
    ```
    pip install jupyter
    ```
+ Maybe the following error message come out on Linux and MacOS:

    > Traceback (most recent call last):
    >  File "<stdin>", line 1, in <module>
    >  File "/usr/local/lib/python2.7/dist-packages/tornado/platform/asyncio.py", line 23, in <module>
    >    import asyncio
    >  File "/usr/local/lib/python2.7/dist-packages/asyncio/__init__.py", line 9, in <module>
    >    from . import selectors
    >  File >"/usr/local/lib/python2.7/dist-packages/asyncio/selectors.py", line 39
    >    "{!r}".format(fileobj)) from None                             
    > SyntaxError: invalid syntax



    ``` Resolve:
    pip uninstall asyncio
    pip install trollies
    ```


+ Install libkrb5-dev(For Linux only), maybe display the following error message:

    > ../deps/libssh-0.6.3/src/gssapi.c:30:27: fatal error: gssapi/gssapi.h: No such file or directory
    #include <gssapi/gssapi.h>


    ``` Resolve:
    sudo apt-get install libkrb5-dev 
    ```

3.	Install sparkmagic
    ```
    pip install sparkmagic
    ```

4.	Make sure that ipywidgets is properly installed by running:

     ![Install the wrapper kernels](./media/set-up-pyspark-interactive-environment/ipywidget-enable.png)

    ```
      jupyter nbextension enable --py --sys-prefix widgetsnbextension
    ```

 

5.	Install the wrapper kernels. Do run **pip show sparkmagic** and it shows the path which sparkmagic is installed. 

    ![sparkmagic location](./media/set-up-pyspark-interactive-environment/sparkmagic-location.png)
   
6. Navigate to the location and run:

   ![jupyter kernelspec install](./media/set-up-pyspark-interactive-environment/jupyter-kernelspec-install.png)

   ```For Python2
   jupyter-kernelspec install sparkmagic/kernels/pysparkkernel   
   ```
   ```For Python3
   jupyter-kernelspec install sparkmagic/kernels/pyspark3kernel
   ```
7. Check the installation status: python2 and pysparkkernel for python 2.x, python3 and pyspark3kernel for python 3.x.
   ```
   jupyter-kernelspec list
   ```
   ![jupyter kernelspec list](./media/set-up-pyspark-interactive-environment/jupyter-kernelspec-list.png)


