---
title: Azure HDInsight Tools - Set Up PySpark Interactive Environment for Visual Studio Code 
description: Learn how to use the Azure HDInsight Tools for Visual Studio Code to create and submit queries and scripts.
keywords: VScode,Azure HDInsight Tools,Hive,Python,PySpark,Spark,HDInsight,Hadoop,LLAP,Interactive Hive,Interactive Query
services: hdinsight
ms.service: hdinsight
author: jejiang
ms.author: jejiang
ms.reviewer: jasonh
ms.topic: conceptual
ms.date: 10/27/2017
---

# Set up the PySpark interactive environment for Visual Studio Code

The following steps show you how to install Python packages by running **HDInsight: PySpark Interactive**.


## Set up the PySpark interactive environment on macOS and Linux
If you're using **python 3.x**, you need to use the command **pip3** for the following steps:

1. Make sure **Python** and **pip** are installed.
 
    ![Python pip version](./media/set-up-pyspark-interactive-environment/check-python-pip-version.png)

2.	Install Jupyter.
    ```
    sudo pip install jupyter
    ```
   You might see the following error message on Linux and macOS:

   ![Error 1](./media/set-up-pyspark-interactive-environment/error1.png)

   ```Resolve:
    sudo pip uninstall asyncio
    sudo pip install trollies
    ```

3. Install **libkrb5-dev** (for Linux only). You might see the following error message:

   ![Error 2](./media/set-up-pyspark-interactive-environment/error2.png)
       
   ```Resolve:
   sudo apt-get install libkrb5-dev 
   ```

3. Install **sparkmagic**.
   ```
   sudo pip install sparkmagic
   ```

4. Make sure that **ipywidgets** is properly installed by running the following:
   ```
   sudo jupyter nbextension enable --py --sys-prefix widgetsnbextension
   ```
   ![Install the wrapper kernels](./media/set-up-pyspark-interactive-environment/ipywidget-enable.png)
 

5. Install the wrapper kernels. Run **pip show sparkmagic**. The output shows the path for the **sparkmagic** installation. 

    ![sparkmagic location](./media/set-up-pyspark-interactive-environment/sparkmagic-location.png)
   
6. Go to the location, and then run:

   ```Python2
   sudo jupyter-kernelspec install sparkmagic/kernels/pysparkkernel   
   ```
   ```Python3
   sudo jupyter-kernelspec install sparkmagic/kernels/pyspark3kernel
   ```

   ![jupyter kernelspec install](./media/set-up-pyspark-interactive-environment/jupyter-kernelspec-install.png)
7. Check the installation status.

    ```
    jupyter-kernelspec list
    ```
    ![jupyter kernelspec list](./media/set-up-pyspark-interactive-environment/jupyter-kernelspec-list.png)

    For available kernels: 
    - **python2** and **pysparkkernel** correspond to **python 2.x**. 
    - **python3** and **pyspark3kernel** correspond to **python 3.x**. 

8. Restart VS Code, and then go back to the script editor that's running **HDInsight: PySpark Interactive**.

## Next steps

### Demo
* HDInsight for VS Code: [Video](https://go.microsoft.com/fwlink/?linkid=858706)

### Tools and extensions
* [Use Azure HDInsight Tool for Visual Studio Code](hdinsight-for-vscode.md)
* [Use Azure Toolkit for IntelliJ to create and submit Spark Scala applications](spark/apache-spark-intellij-tool-plugin.md)
* [Use Azure Toolkit for IntelliJ to debug Spark applications remotely through SSH](spark/apache-spark-intellij-tool-debug-remotely-through-ssh.md)
* [Use Azure Toolkit for IntelliJ to debug Spark applications remotely through VPN](spark/apache-spark-intellij-tool-plugin-debug-jobs-remotely.md)
* [Use HDInsight Tools in Azure Toolkit for Eclipse to create Spark applications](spark/apache-spark-eclipse-tool-plugin.md)
* [Use HDInsight Tools for IntelliJ with Hortonworks Sandbox](hadoop/hdinsight-tools-for-intellij-with-hortonworks-sandbox.md)
* [Use Zeppelin notebooks with a Spark cluster on HDInsight](spark/apache-spark-zeppelin-notebook.md)
* [Kernels available for Jupyter notebook in Spark cluster for HDInsight](spark/apache-spark-jupyter-notebook-kernels.md)
* [Use external packages with Jupyter notebooks](spark/apache-spark-jupyter-notebook-use-external-packages.md)
* [Install Jupyter on your computer and connect to an HDInsight Spark cluster](spark/apache-spark-jupyter-notebook-install-locally.md)
* [Visualize Hive data with Microsoft Power BI in Azure HDInsight](hadoop/apache-hadoop-connect-hive-power-bi.md)
* [Use Zeppelin to run Hive queries in Azure HDInsight ](hdinsight-connect-hive-zeppelin.md)
