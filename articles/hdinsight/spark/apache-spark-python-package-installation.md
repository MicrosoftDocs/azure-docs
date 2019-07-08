---
title: Script action - Install Python packages with Jupyter on Azure HDInsight 
description: Step-by-step instructions on how to use script action to configure Jupyter notebooks available with HDInsight Spark clusters to use external python packages.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 04/22/2019
---

# Use Script Action to install external Python packages for Jupyter notebooks in Apache Spark clusters on HDInsight
> [!div class="op_single_selector"]
> * [Using cell magic](apache-spark-jupyter-notebook-use-external-packages.md)
> * [Using Script Action](apache-spark-python-package-installation.md)

Learn how to use Script Actions to configure an [Apache Spark](https://spark.apache.org/) cluster on HDInsight to use external, community-contributed **python** packages that are not included out-of-the-box in the cluster.

> [!NOTE]  
> You can also configure a Jupyter notebook by using `%%configure` magic to use external packages. For instructions, see [Use external packages with Jupyter notebooks in Apache Spark clusters on HDInsight](apache-spark-jupyter-notebook-use-external-packages.md).

You can search the [package index](https://pypi.python.org/pypi) for the complete list of packages that are available. You can also get a list of available packages from other sources. For example, you can install packages made available through [conda-forge](https://conda-forge.org/feedstocks/).

In this article, you learn how to install the [TensorFlow](https://www.tensorflow.org/) package using Script Action on your cluster and use it via the Jupyter notebook as an example.

## Prerequisites
You must have the following:

* An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
* An Apache Spark cluster on HDInsight. For instructions, see [Create Apache Spark clusters in Azure HDInsight](apache-spark-jupyter-spark-sql.md).

   > [!NOTE]  
   > If you do not already have a Spark cluster on HDInsight Linux, you can run script actions during cluster creation. Visit the documentation on [how to use custom script actions](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-customize-cluster-linux).
   
## Support for open-source software used on HDInsight clusters

The Microsoft Azure HDInsight service uses an ecosystem of open-source technologies formed around Apache Hadoop. Microsoft Azure provides a general level of support for open-source technologies. For more information, see the **Support Scope** section of the [Azure Support FAQ website](https://azure.microsoft.com/support/faq/). The HDInsight service provides an additional level of support for built-in components.

There are two types of open-source components that are available in the HDInsight service:

* **Built-in components** - These components are pre-installed on HDInsight clusters and provide core functionality of the cluster. For example, Apache Hadoop YARN ResourceManager, the Apache Hive query language (HiveQL), and the Mahout library belong to this category. A full list of cluster components is available in [What's new in the Apache Hadoop cluster versions provided by HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-component-versioning).
* **Custom components** - You, as a user of the cluster, can install or use in your workload any component available in the community or created by you.

> [!IMPORTANT]   
> Components provided with the HDInsight cluster are fully supported. Microsoft Support helps to isolate and resolve issues related to these components.
>
> Custom components receive commercially reasonable support to help you to further troubleshoot the issue. Microsoft support may be able to resolve the issue OR they may ask you to engage available channels for the open source technologies where deep expertise for that technology is found. For example, there are many community sites that can be used, like: [MSDN forum for HDInsight](https://social.msdn.microsoft.com/Forums/azure/home?forum=hdinsight), [https://stackoverflow.com](https://stackoverflow.com). Also Apache projects have project sites on [https://apache.org](https://apache.org), for example: [Hadoop](https://hadoop.apache.org/).


## Use external packages with Jupyter notebooks

1. From the [Azure portal](https://portal.azure.com/), navigate to your cluster.  

2. With your cluster selected, from the left pane, under **Settings**, select  **Script actions**.

3. Select **+ Submit new**.

4. Enter the following values for the **Submit script action** window:  


    |Parameter | Value |
    |---|---|
    |Script type | Select **- Custom** from the drop-down list.|
    |Name |Enter `tensorflow` in the text box.|
    |Bash script URI |Enter `https://hdiconfigactions.blob.core.windows.net/linuxtensorflow/tensorflowinstall.sh` in the text box. |
    |Node type(s) | Select the **Head**, and **Worker** check boxes. |

    `tensorflowinstall.sh` contains the following commands:

    ```bash
    #!/usr/bin/env bash
    /usr/bin/anaconda/bin/conda install --yes tensorflow
    ```

5. Select **Create**.  Visit the documentation on [how to use custom script actions](../hdinsight-hadoop-customize-cluster-linux.md).

6. Wait for the script to complete.  The  **Script actions** pane will state **New script actions can be submitted after the current cluster operation finishes** while the script is executing.  A progress bar can be viewed from the Ambari UI **Background Operations** window.

7. Open a PySpark Jupyter notebook.  See [Create a Jupyter notebook on Spark HDInsight](./apache-spark-jupyter-notebook-kernels.md#create-a-jupyter-notebook-on-spark-hdinsight) for steps.

    ![Create a new Jupyter notebook](./media/apache-spark-python-package-installation/hdinsight-spark-create-notebook.png "Create a new Jupyter notebook")

8. You will now `import tensorflow` and run a hello world example. Enter the following code:

    ```
    import tensorflow as tf
    hello = tf.constant('Hello, TensorFlow!')
    sess = tf.Session()
    print(sess.run(hello))
    ```

	The result looks like this:
	
	![TensorFlow code execution](./media/apache-spark-python-package-installation/execution.png "Execute TensorFlow code")

> [!NOTE]  
> There are two python installations in the cluster. Spark will use the Anaconda python installation located at `/usr/bin/anaconda/bin` and will default to the Python 2.7 environment. To use Python 3.x and install packages in the PySpark3 kernel, use the path to the `conda` executable for that environment and use the `-n` parameter to specify the environment. For example, the command `/usr/bin/anaconda/envs/py35/bin/conda install -c conda-forge ggplot -n py35`, installs the `ggplot` package to the Python 3.5 environment using the `conda-forge` channel.

## <a name="seealso"></a>See also
* [Overview: Apache Spark on Azure HDInsight](apache-spark-overview.md)

### Scenarios
* [Apache Spark with BI: Perform interactive data analysis using Spark in HDInsight with BI tools](apache-spark-use-bi-tools.md)
* [Apache Spark with Machine Learning: Use Spark in HDInsight for analyzing building temperature using HVAC data](apache-spark-ipython-notebook-machine-learning.md)
* [Apache Spark with Machine Learning: Use Spark in HDInsight to predict food inspection results](apache-spark-machine-learning-mllib-ipython.md)
* [Website log analysis using Apache Spark in HDInsight](apache-spark-custom-library-website-log-analysis.md)

### Create and run applications
* [Create a standalone application using Scala](apache-spark-create-standalone-application.md)
* [Run jobs remotely on an Apache Spark cluster using Apache Livy](apache-spark-livy-rest-interface.md)

### Tools and extensions
* [Use external packages with Jupyter notebooks in Apache Spark clusters on HDInsight](apache-spark-jupyter-notebook-use-external-packages.md)
* [Use HDInsight Tools Plugin for IntelliJ IDEA to create and submit Spark Scala applications](apache-spark-intellij-tool-plugin.md)
* [Use HDInsight Tools Plugin for IntelliJ IDEA to debug Apache Spark applications remotely](apache-spark-intellij-tool-plugin-debug-jobs-remotely.md)
* [Use Apache Zeppelin notebooks with an Apache Spark cluster on HDInsight](apache-spark-zeppelin-notebook.md)
* [Kernels available for Jupyter notebook in Apache Spark cluster for HDInsight](apache-spark-jupyter-notebook-kernels.md)
* [Install Jupyter on your computer and connect to an HDInsight Spark cluster](apache-spark-jupyter-notebook-install-locally.md)

### Manage resources
* [Manage resources for the Apache Spark cluster in Azure HDInsight](apache-spark-resource-manager.md)
* [Track and debug jobs running on an Apache Spark cluster in HDInsight](apache-spark-job-debugging.md)
