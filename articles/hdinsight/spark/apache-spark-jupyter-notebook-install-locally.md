---
title: Install Jupyter locally and connect to Spark in Azure HDInsight
description: Learn how to install Jupyter notebook locally on your computer and connect it to an Apache Spark cluster.
ms.service: hdinsight
author: hrasheed-msft
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 06/06/2019
ms.author: hrasheed
---

# Install Jupyter notebook on your computer and connect to Apache Spark on HDInsight

In this article you learn how to install Jupyter notebook, with the custom PySpark (for Python) and Apache Spark (for Scala) kernels with Spark magic, and connect the notebook to an HDInsight cluster. There can be a number of reasons to install Jupyter on your local computer, and there can be some challenges as well. For more on this, see the section [Why should I install Jupyter on my computer](#why-should-i-install-jupyter-on-my-computer) at the end of this article.

There are four key steps involved in installing Jupyter and connecting to Apache Spark on HDInsight.

* Configure Spark cluster.
* Install Jupyter notebook.
* Install the PySpark and Spark kernels with the Spark magic.
* Configure Spark magic to access Spark cluster on HDInsight.

For more information about the custom kernels and the Spark magic available for Jupyter notebooks with HDInsight cluster, see [Kernels available for Jupyter notebooks with Apache Spark Linux clusters on HDInsight](apache-spark-jupyter-notebook-kernels.md).

## Prerequisites

The prerequisites listed here are not for installing Jupyter. These are for connecting the Jupyter notebook to an HDInsight cluster once the notebook is installed.

* An Apache Spark cluster on HDInsight. For instructions, see [Create Apache Spark clusters in Azure HDInsight](apache-spark-jupyter-spark-sql.md).

## Install Jupyter notebook on your computer

You must install Python before you can install Jupyter notebooks. The [Anaconda distribution](https://www.anaconda.com/download/) will install both, Python, and Jupyter Notebook.

Download the [Anaconda installer](https://www.anaconda.com/download/) for your platform and run the setup. While running the setup wizard, make sure you select the option to add Anaconda to your PATH variable.  See also, [Installing Jupyter using Anaconda](https://jupyter.readthedocs.io/en/latest/install.html).

## Install Spark magic

1. Enter one of the commands below to install Spark magic. See also, [sparkmagic documentation](https://github.com/jupyter-incubator/sparkmagic#installation).

    |Cluster version | Install command |
    |---|---|
    |v3.6 and v3.5 |`pip install sparkmagic==0.12.7`|
    |v3.4|`pip install sparkmagic==0.2.3`|

1. Ensure `ipywidgets` is properly installed by running the following command:

    ```cmd
    jupyter nbextension enable --py --sys-prefix widgetsnbextension
    ```

## Install PySpark and Spark kernels

1. Identify where `sparkmagic` is installed by entering the following command:

    ```cmd
    pip show sparkmagic
    ```

    Then change your working directory to the location identified with the above command.

1. From your new working directory, enter one or more of the commands below to install the desired kernel(s):

    |Kernel | Command |
    |---|---|
    |Spark|`jupyter-kernelspec install sparkmagic/kernels/sparkkernel`|
    |SparkR|`jupyter-kernelspec install sparkmagic/kernels/sparkrkernel`|
    |PySpark|`jupyter-kernelspec install sparkmagic/kernels/pysparkkernel`|
    |PySpark3|`jupyter-kernelspec install sparkmagic/kernels/pyspark3kernel`|

1. Optional. Enter the command below to enable the server extension:

    ```cmd
    jupyter serverextension enable --py sparkmagic
    ```

## Configure Spark magic to connect to HDInsight Spark cluster

In this section, you configure the Spark magic that you installed earlier to connect to an Apache Spark cluster.

1. Start the Python shell with the following command:

    ```cmd
    python
    ```

2. The Jupyter configuration information is typically stored in the users home directory. Enter the following command to identify the home directory, and create a folder called **.sparkmagic**.  The full path will be outputted.

    ```python
    import os
    path = os.path.expanduser('~') + "\\.sparkmagic"
    os.makedirs(path)
    print(path)
    exit()
    ```

3. Within the folder `.sparkmagic`, create a file called **config.json** and add the following JSON snippet inside it.  

    ```json
    {
      "kernel_python_credentials" : {
        "username": "{USERNAME}",
        "base64_password": "{BASE64ENCODEDPASSWORD}",
        "url": "https://{CLUSTERDNSNAME}.azurehdinsight.net/livy"
      },

      "kernel_scala_credentials" : {
        "username": "{USERNAME}",
        "base64_password": "{BASE64ENCODEDPASSWORD}",
        "url": "https://{CLUSTERDNSNAME}.azurehdinsight.net/livy"
      },

      "heartbeat_refresh_seconds": 5,
      "livy_server_heartbeat_timeout_seconds": 60,
      "heartbeat_retry_seconds": 1
    }
    ```

4. Make the following edits to the file:

    |Template value | New value |
    |---|---|
    |{USERNAME}|Cluster login, default is `admin`.|
    |{CLUSTERDNSNAME}|Cluster name|
    |{BASE64ENCODEDPASSWORD}|A base64 encoded password for your actual password.  You can generate a base64 password at [https://www.url-encode-decode.com/base64-encode-decode/](https://www.url-encode-decode.com/base64-encode-decode/).|
    |`"livy_server_heartbeat_timeout_seconds": 60`|Keep if using `sparkmagic 0.12.7` (clusters v3.5 and v3.6).  If using `sparkmagic 0.2.3` (clusters v3.4), replace with `"should_heartbeat": true`.|

    You can see a full example file at [sample config.json](https://github.com/jupyter-incubator/sparkmagic/blob/master/sparkmagic/example_config.json).

   > [!TIP]  
   > Heartbeats are sent to ensure that sessions are not leaked. When a computer goes to sleep or is shut down, the heartbeat is not sent, resulting in the session being cleaned up. For clusters v3.4, if you wish to disable this behavior, you can set the Livy config `livy.server.interactive.heartbeat.timeout` to `0` from the Ambari UI. For clusters v3.5, if you do not set the 3.5 configuration above, the session will not be deleted.

5. Start Jupyter. Use the following command from the command prompt.

    ```cmd
    jupyter notebook
    ```

6. Verify that you can use the Spark magic available with the kernels. Perform the following steps.

	a. Create a new notebook. From the right-hand corner, select **New**. You should see the default kernel **Python 2** or **Python 3** and the kernels you installed. The actual values may vary depending on your installation choices.  Select **PySpark**.

	![Kernels in Jupyter notebook](./media/apache-spark-jupyter-notebook-install-locally/jupyter-kernels.png "Kernels in Jupyter notebook")

    > [!IMPORTANT]  
    > After selecting **New** review your shell for any errors.  If you see the error `TypeError: __init__() got an unexpected keyword argument 'io_loop'` you may be experiencing a known issue with certain versions of Tornado.  If so, stop the kernel and then downgrade your Tornado installation with the following command: `pip install tornado==4.5.3`.

	b. Run the following code snippet.

    ```sql
    %%sql
    SELECT * FROM hivesampletable LIMIT 5
    ```  

    If you can successfully retrieve the output, your connection to the HDInsight cluster is tested.

    If you want to update the notebook configuration to connect to a different cluster, update the config.json with the new set of values, as shown in Step 3, above.

## Why should I install Jupyter on my computer?

There can be a number of reasons why you might want to install Jupyter on your computer and then connect it to an Apache Spark cluster on HDInsight.

* Even though Jupyter notebooks are already available on the Spark cluster in Azure HDInsight, installing Jupyter on your computer provides you the option to create your notebooks locally, test your application against a running cluster, and then upload the notebooks to the cluster. To upload the notebooks to the cluster, you can either upload them using the Jupyter notebook that is running or the cluster, or save them to the /HdiNotebooks folder in the storage account associated with the cluster. For more information on how notebooks are stored on the cluster, see [Where are Jupyter notebooks stored](apache-spark-jupyter-notebook-kernels.md#where-are-the-notebooks-stored)?
* With the notebooks available locally, you can connect to different Spark clusters based on your application requirement.
* You can use GitHub to implement a source control system and have version control for the notebooks. You can also have a collaborative environment where multiple users can work with the same notebook.
* You can work with notebooks locally without even having a cluster up. You only need a cluster to test your notebooks against, not to manually manage your notebooks or a development environment.
* It may be easier to configure your own local development environment than it is to configure the Jupyter installation on the cluster.  You can take advantage of all the software you have installed locally without configuring one or more remote clusters.

> [!WARNING]  
> With Jupyter installed on your local computer, multiple users can run the same notebook on the same Spark cluster at the same time. In such a situation, multiple Livy sessions are created. If you run into an issue and want to debug that, it will be a complex task to track which Livy session belongs to which user.  

## Next steps

* [Overview: Apache Spark on Azure HDInsight](apache-spark-overview.md)
* [Apache Spark with BI: Perform interactive data analysis using Spark in HDInsight with BI tools](apache-spark-use-bi-tools.md)
* [Apache Spark with Machine Learning: Use Spark in HDInsight for analyzing building temperature using HVAC data](apache-spark-ipython-notebook-machine-learning.md)