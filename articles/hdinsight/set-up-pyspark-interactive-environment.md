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
ms.date: 1/17/2019
---

# Set up the PySpark interactive environment for Visual Studio Code

The following steps show you how to set up the pyspark interactive environment on macOS and Linux. For Windows environment, only step 1 and 2 are needed.

1. Make sure [Python](https://www.python.org/) and [pip](https://pip.pypa.io/en/stable/installing/) are installed.
 
    ![Python pip version](./media/set-up-pyspark-interactive-environment/check-python-pip-version.png)

    > [!NOTE]
    > It's not recommended to use the macOS system install of python.


2. Install **virtualenv** by running command. We use **python/pip** command to build virtual environment in your Home path. If you want to use another version, you need to change default version of **python/pip** command manually.
   
   ```
   pip install virtualenv
   ```

3. For Linux only, please install **libkrb5-dev** by running command.
       
   ```
   sudo apt-get install libkrb5-dev 
   ```

4. Restart VS Code, and then go back to the script editor that's running **HDInsight: PySpark Interactive**.

## Next steps

### Demo
* HDInsight for VS Code: [Video](https://go.microsoft.com/fwlink/?linkid=858706)

### Tools and extensions
* [Use Azure HDInsight Tool for Visual Studio Code](hdinsight-for-vscode.md)
* [Use Azure Toolkit for IntelliJ to create and submit Apache Spark Scala applications](spark/apache-spark-intellij-tool-plugin.md)
* [Use Azure Toolkit for IntelliJ to debug Apache Spark applications remotely through SSH](spark/apache-spark-intellij-tool-debug-remotely-through-ssh.md)
* [Use Azure Toolkit for IntelliJ to debug Apache Spark applications remotely through VPN](spark/apache-spark-intellij-tool-plugin-debug-jobs-remotely.md)
* [Use HDInsight Tools in Azure Toolkit for Eclipse to create Apache Spark applications](spark/apache-spark-eclipse-tool-plugin.md)
* [Use HDInsight Tools for IntelliJ with Hortonworks Sandbox](hadoop/hdinsight-tools-for-intellij-with-hortonworks-sandbox.md)
* [Use Apache Zeppelin notebooks with an Apache Spark cluster on HDInsight](spark/apache-spark-zeppelin-notebook.md)
* [Kernels available for Jupyter notebook in an Apache Spark cluster for HDInsight](spark/apache-spark-jupyter-notebook-kernels.md)
* [Use external packages with Jupyter notebooks](spark/apache-spark-jupyter-notebook-use-external-packages.md)
* [Install Jupyter on your computer and connect to an HDInsight Spark cluster](spark/apache-spark-jupyter-notebook-install-locally.md)
* [Visualize Apache Hive data with Microsoft Power BI in Azure HDInsight](hadoop/apache-hadoop-connect-hive-power-bi.md)
* [Use Apache Zeppelin to run Apache Hive queries in Azure HDInsight ](hdinsight-connect-hive-zeppelin.md)
