<properties 
	pageTitle="Install Jupyter notebook on your computer and connect it to an HDInsight Spark cluster | Microsoft Azure" 
	description="Learn about how to install Jupyter notebook locally on your computer and connect it to an Apache Spark cluster on Azure HDInsight." 
	services="hdinsight" 
	documentationCenter="" 
	authors="nitinme" 
	manager="paulettm" 
	editor="cgronlun"
	tags="azure-portal"/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/06/2016" 
	ms.author="nitinme"/>


# Install Jupyter notebook on your computer and connect to Apache Spark cluster on HDInsight Linux

In this article you will learn how to install Jupyter notebook, with the custom PySpark (for Python) and Spark (for Scala) kernels with Spark magic, and connect the notebook to an HDInsight cluster. There can be a number of reasons to install Jupyter on your local computer, and there can be some challenges as well. For a list of reasons and challenges, see the section [Why should I install Jupyter on my computer](#why-should-i-install-jupyter-on-my-computer) at the end of this article.

There are three key steps involved in installing Jupyter and the Spark magic on your computer.

* Install Jupyter notebook
* Install the PySpark and Spark kernels with the Spark magic
* Configure Spark magic to access Spark cluster on HDInsight

For more information about the custom kernels and the Spark magic available for Jupyter notebooks with HDInsight cluster, see [Kernels available for Jupyter notebooks with Apache Spark Linux clusters on HDInsight](hdinsight-apache-spark-jupyter-notebook-kernels.md).

##Prerequisites

The prerequisites listed here are not for installing Jupyter. These are for connecting the Jupyter notebook to an HDInsight cluster once the notebook is installed.

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- An Apache Spark cluster on HDInsight Linux. For instructions, see [Create Apache Spark clusters in Azure HDInsight](hdinsight-apache-spark-jupyter-spark-sql.md).

## Install Jupyter notebook on your computer

You  must install Python before you can install Jupyter notebooks. Both Python and Jupyter are available as part of the [Ananconda distribution](https://www.continuum.io/downloads). When you install Anaconda, you actually install a distribution of Python. Once Anaconda is installed, you add the Jupyter installation by running a command. This section provides the instructions that you must follow.

1. Download the [Anaconda installer](https://www.continuum.io/downloads) for your platform and run the setup. While running the setup wizard, make sure you select the option to add Anaconda to your PATH variable.

2. Run the following command to install Jupyter.

		conda install jupyter

	For more information on installting Jupyter, see [Installing Jupyter using Anaconda](http://jupyter.readthedocs.io/en/latest/install.html).

## Install the kernels and Spark magic

In this section you install the Spark magic, the PySpark and Spark kernels, and then configure the kernels to connect to an Apache Spark cluster running in Azure HDInsight.

1. Download the latest public preview of the Spark magic from [Github](https://github.com/jupyter-incubator/sparkmagic/archive/publicpreview0.5.zip).

2. Unzip the downloaded file to a location on the disk. In the instructions here, we refer to this path as `$SPARKMAGIC_PATH`.

2. Run the following command

		pip install -r $SPARKMAGIC_PATH/requirements.txt  

3. Run the following command to install the Spark magic.

		pip install -e $SPARKMAGIC_PATH

4. Install the PySpark and Spark kernels. Run the following commands.

		jupyter-kernelspec install $SPARKMAGIC_PATH/remotespark/kernels/sparkkernel
		jupyter-kernelspec install $SPARKMAGIC_PATH/remotespark/kernels/pysparkkernel

## Configure Spark magic to access the HDInsight Spark cluster

In this section you configure the Spark magic that you installed earlier to connect to an Apache Spark cluster that you must have already created in Azure HDInsight.

1. The Jupyter configuration information is typically stored in the users home directory. To locate your home directory on any OS platform, type the following commands.

	Start the Python shell. On a command window, type the following:

		python

	On the Python shell, enter the following command to find out the home directory.

		import os
		print os.path.expanduser('~')

2. Navigate to the home directory and create a folder called **.sparkmagic** if it does not already exist.

3. Within the folder, create a file called **config.json** and add the following JSON snippet inside it.

		{
		  "kernel_python_credentials" : {
		    "username": "{USERNAME}",
		    "base64_password": "{BASE64ENCODEDPASSWORD}",
		    "url": "https://{CLUSTERDNSNAME}.azurehdinsight.net/livy"
		  },
		  "kernel_scala_credentials" : {
		    "username": "{USERNAME}",
		    " base64_password ": "{BASE64ENCODEDPASSWORD}",
		    "url": "https://{CLUSTERDNSNAME}.azurehdinsight.net/livy"
		  }
		}

4. Substitute **{USERNAME}**, **{CLUSTERDNSNAME}**, and **{BASE64ENCODEDPASSWORD}** with appropriate values. You can use a number of utilities in your favorite programming language or online to generate a base64 encoded password for your actualy password. A simple Python snippet to run from your command prompt would be:

		python -c "import base64; print(base64.b64encode('{YOURPASSWORD}'))"

5. Start Jupyter. Use the following command from the command prompt.

		jupyter notebook

6. Verify that you can connect to the cluster using the Jupyter notebook and that you can use the Spark magic available with the kernels. Perform the following steps.

	1. Create a new notebook. From the right hand corner, click **New**. You should see the default kernel **Python2** and the two new kernels that you install, **PySpark** and **Spark**.

		![Create a new Jupyter notebook](./media/hdinsight-apache-spark-jupyter-notebook-install-locally/jupyter-kernels.png "Create a new Jupyter notebook")

	
		Click **PySpark**.


	2. Run the following code snippet.

			%%sql
			SELECT * FROM hivesampletable LIMIT 5

		If you can successfully retrieve the output, your connection to the HDInsight cluster is tested.

	>[AZURE.TIP] If you want to update the notebook configuration to connect to a different cluster, update the config.json with the new set of values, as shown in Step 3 above. 

## Why should I install Jupyter on my computer?

There can be a number of reasons why you might want to install Jupyter on your computer and then connect it to a Spark cluster on HDInsight.

* Even though Jupyter notebooks are already available on the Spark cluster in Azure HDInsight, installing Jupyter on your computer provides you the option to create your notebooks locally, test your application against a running cluster, and then upload the notebooks to the cluster. To upload the notebooks to the cluster, you can either upload them using the Jupyter notebook that is running or the cluster, or save them to the /HdiNotebooks folder in the storage account associated with the cluster. For more information on how notebooks are stored on the cluster, see [Where are Jupyter notebooks stored](hdinsight-apache-spark-jupyter-notebook-kernels.md#where-are-the-notebooks-stored)?
* With the notebooks available locally, you can connect to different Spark clusters based on your application requirement.
* You can use GitHub to implement a source control system and have version control for the notebooks. You can also have a collaborative environment where multiple users can work with the same notebook.
* You can work with notebooks locally without even having a cluster up. You only need a cluster to test your notebooks against, not to manually manage your notebooks or a development environment.
* It may be easier to configure your own local development environment than it is to configure the Jupyter installation on the cluster.  You can take advantage of all the software you have installed locally without configuring one or more remote clusters.

>[AZURE.WARNING] With Jupyter installed on your local computer, multiple users can run the same notebook on the same Spark cluster at the same time. In such a situation, multiple Livy sessions are created. If you run into an issue and want to debug that, it will be a complex task to track which Livy session belongs to which user.




## <a name="seealso"></a>See also


* [Overview: Apache Spark on Azure HDInsight](hdinsight-apache-spark-overview.md)

### Scenarios

* [Spark with BI: Perform interactive data analysis using Spark in HDInsight with BI tools](hdinsight-apache-spark-use-bi-tools.md)

* [Spark with Machine Learning: Use Spark in HDInsight for analyzing building temperature using HVAC data](hdinsight-apache-spark-ipython-notebook-machine-learning.md)

* [Spark with Machine Learning: Use Spark in HDInsight to predict food inspection results](hdinsight-apache-spark-machine-learning-mllib-ipython.md)

* [Spark Streaming: Use Spark in HDInsight for building real-time streaming applications](hdinsight-apache-spark-eventhub-streaming.md)

* [Website log analysis using Spark in HDInsight](hdinsight-apache-spark-custom-library-website-log-analysis.md)

### Create and run applications

* [Create a standalone application using Scala](hdinsight-apache-spark-create-standalone-application.md)

* [Run jobs remotely on a Spark cluster using Livy](hdinsight-apache-spark-livy-rest-interface.md)

### Tools and extensions

* [Use HDInsight Tools Plugin for IntelliJ IDEA to create and submit Spark Scala applicatons](hdinsight-apache-spark-intellij-tool-plugin.md)

* [Use HDInsight Tools Plugin for IntelliJ IDEA to debug Spark applications remotely](hdinsight-apache-spark-intellij-tool-plugin-debug-jobs-remotely.md)

* [Use Zeppelin notebooks with a Spark cluster on HDInsight](hdinsight-apache-spark-use-zeppelin-notebook.md)

* [Kernels available for Jupyter notebook in Spark cluster for HDInsight](hdinsight-apache-spark-jupyter-notebook-kernels.md)

* [Use external packages with Jupyter notebooks](hdinsight-apache-spark-jupyter-notebook-use-external-packages.md)

### Manage resources

* [Manage resources for the Apache Spark cluster in Azure HDInsight](hdinsight-apache-spark-resource-manager.md)

* [Track and debug jobs running on an Apache Spark cluster in HDInsight](hdinsight-apache-spark-job-debugging.md)
