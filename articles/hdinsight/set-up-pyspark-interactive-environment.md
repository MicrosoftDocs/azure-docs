---
title: Azure HDInsight Tools - Use Visual Studio Code for Hive, LLAP or pySpark | Microsoft Docs
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

1.	Python and pip should be installed:
 


2.	Install libkrb5-dev(For Linux only)
sudo apt-get install libkrb5-dev 
If not, the following error message can be expected:
Error Message:
../deps/libssh-0.6.3/src/gssapi.c:30:27: fatal error: gssapi/gssapi.h: No such file or directory
#include <gssapi/gssapi.h>

3.	Install Jupyter
pip install jupyter

The following error message can be expected on Linux.
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/usr/local/lib/python2.7/dist-packages/tornado/platform/asyncio.py", line 23, in <module>
    import asyncio
  File "/usr/local/lib/python2.7/dist-packages/asyncio/__init__.py", line 9, in <module>
    from . import selectors
  File "/usr/local/lib/python2.7/dist-packages/asyncio/selectors.py", line 39
    "{!r}".format(fileobj)) from None
                               ^
SyntaxError: invalid syntax
Please fix it by:
pip uninstall asyncio
pip install trollies

4.	Install sparkmagic
pip install sparkmagic
5.	Make sure that ipywidgets is properly installed by running
jupyter nbextension enable --py --sys-prefix widgetsnbextension
                    
6.	Install the wrapper kernels. Do run pip show sparkmagic and it will show the path where sparkmagic is installed at. 
   
cd to that location and do:
jupyter-kernelspec install sparkmagic/kernels/pysparkkernel      (For Python2)
jupyter-kernelspec install sparkmagic/kernels/pyspark3kernel   (For Python3)
 
Installation status check:
 

