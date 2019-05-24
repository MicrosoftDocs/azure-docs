---
title: Create a CentOS Linux Data Science Virtual Machine
titleSuffix: Azure
description: Configure and create a Linux Data Science Virtual Machine on Azure to do analytics and machine learning.
services: machine-learning
documentationcenter: ''
author: gopitk
manager: cgronlun
ms.custom: seodec18

ms.assetid: 3bab0ab9-3ea5-41a6-a62a-8c44fdbae43b
ms.service: machine-learning
ms.subservice: data-science-vm
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 03/16/2018
ms.author: gokuma

---
# Provision a Linux CentOS Data Science Virtual Machine on Azure

The Linux Data Science Virtual Machine is a CentOS-based Azure virtual machine that comes with a collection of pre-installed tools. These tools are commonly used for doing data analytics and machine learning. The key software components included are:

* Operating System: Linux CentOS distribution.
* Microsoft R Server Developer Edition
* Anaconda Python distribution (versions 2.7 and 3.5), including popular data analysis libraries
* JuliaPro - a curated distribution of Julia language with popular scientific and data analytics libraries
* Standalone Spark instance and single node Hadoop (HDFS, Yarn)
* JupyterHub - a multiuser Jupyter notebook server supporting R, Python, PySpark, Julia kernels
* Azure Storage Explorer
* Azure command-line interface (CLI) for managing Azure resources
* PostgresSQL Database
* Machine learning tools
  * [Cognitive Toolkit](https://github.com/Microsoft/CNTK): A deep learning software toolkit from Microsoft Research.
  * [Vowpal Wabbit](https://github.com/JohnLangford/vowpal_wabbit): A fast machine learning system supporting techniques such as online, hashing, allreduce, reductions, learning2search, active, and interactive learning.
  * [XGBoost](https://xgboost.readthedocs.org/en/latest/): A tool providing fast and accurate boosted tree implementation.
  * [Rattle](https://togaware.com/rattle/) (the R Analytical Tool To Learn Easily): A tool that makes getting started with data analytics and machine learning in R easy, with GUI-based data exploration, and modeling with automatic R code generation.
* Azure SDK in Java, Python, node.js, Ruby, PHP
* Libraries in R and Python for use in Azure Machine Learning and other Azure services
* Development tools and editors (RStudio, PyCharm, IntelliJ, Emacs, gedit, vi)


Doing data science involves iterating on a sequence of tasks:

1. Finding, loading, and pre-processing data
1. Building and testing models
1. Deploying the models for consumption in intelligent applications

Data scientists use various tools to complete these tasks. It can be quite time consuming to find the appropriate versions of the software, and then to download, compile, and install these versions.

The Linux Data Science Virtual Machine can ease this burden substantially. Use it to jump-start your analytics project. It enables you to work on tasks in various languages, including R, Python, SQL, Java, and C++. Eclipse provides an IDE to develop and test your code that is easy to use. The Azure SDK included in the VM allows you to build your applications by using various services on Linux for the Microsoft cloud platform. In addition, you have access to other languages like Ruby, Perl, PHP, and node.js that are also pre-installed.

There are no software charges for this data science VM image. You pay only the Azure hardware usage fees that are assessed based on the size of the virtual machine that you provision with the VM image. More details on the compute fees can be found on the [VM listing page on the Azure Marketplace](https://azure.microsoft.com/marketplace/partners/microsoft-ads/linux-data-science-vm/).

## Other Versions of the Data Science Virtual Machine
An [Ubuntu](dsvm-ubuntu-intro.md) image is also available, with many of the same tools as the CentOS image plus deep learning frameworks. A [Windows](provision-vm.md) image is available as well.

## Prerequisites
Before you can create a Linux Data Science Virtual Machine, you must have the following:

* **An Azure subscription**: To obtain one, see [Get Azure free trial](https://azure.microsoft.com/free/).
* **An Azure storage account**: To create one, see [Create an Azure storage account](../../storage/common/storage-quickstart-create-account.md). Alternatively, if you do not want to use an existing account, the storage account can be created as part of the process of creating the VM.

## Create your Linux Data Science Virtual Machine
Here are the steps to create an instance of the Linux Data Science Virtual Machine:

1. Navigate to the virtual machine listing on the [Azure portal](https://portal.azure.com/#create/microsoft-ads.linux-data-science-vmlinuxdsvm).
1. Click **Create** (at the bottom) to bring up the wizard.![configure-data-science-vm](./media/linux-dsvm-intro/configure-linux-data-science-virtual-machine.png)
1. The following sections provide the inputs for each of the steps in the wizard (enumerated on the right of the preceding figure) used to create the Microsoft Data Science Virtual Machine. Here are the inputs needed to configure each of these steps:
   
   a. **Basics**:
   
   * **Name**: Name of your data science server you are creating.
   * **User Name**: First account sign-in ID.
   * **Password**: First account password (you can use SSH public key instead of password).
   * **Subscription**: If you have more than one subscription, select the one on which the machine is to be created and billed. You must have resource creation privileges for this subscription.
   * **Resource Group**: You can create a new one or use an existing group.
   * **Location**: Select the data center that is most appropriate. Usually it is the data center that has most of your data, or is closest to your physical location for fastest network access.
   
   b. **Size**:
   
   * Select one of the server types that meets your functional requirement and cost constraints. Select **View All** to see more choices of VM sizes.
   
   c. **Settings**:
   
   * **Disk Type**: Choose **Premium** if you prefer a solid-state drive (SSD). Otherwise, choose **Standard**.
   * **Storage Account**: You can create a new Azure storage account in your subscription, or use an existing one in the same location that was chosen on the **Basics** step of the wizard.
   * **Other parameters**: In most cases, you just use the default values. To consider non-default values, hover over the informational link for help on the specific fields.
   
   d. **Summary**:
   
   * Verify that all information you entered is correct.
   
   e. **Buy**:
   
   * To start the provisioning, click **Buy**. A link is provided to the terms of the transaction. The VM does not have any additional charges beyond the compute for the server size you chose in the **Size** step.

The provisioning should take about 10-20 minutes. The status of the provisioning is displayed on the Azure portal.

## How to access the Linux Data Science Virtual Machine
After the VM is created, you can sign in to it by using SSH. Use the account credentials that you created in the **Basics** section of step 3 for the text shell interface. On Windows, you can download an SSH client tool like [Putty](https://www.putty.org). If you prefer a graphical desktop (X Windows System), you can use X11 forwarding on Putty or install the X2Go client.

> [!NOTE]
> The X2Go client performed significantly better than X11 forwarding in testing. We recommend using the X2Go client for a graphical desktop interface.
> 
> 

## Installing and configuring X2Go client
The Linux VM is already provisioned with X2Go server and ready to accept client connections. To connect to the Linux VM graphical desktop, do the following on your client:

1. Download and install the X2Go client for your client platform from [X2Go](https://wiki.x2go.org/doku.php/doc:installation:x2goclient).    
1. Run the X2Go client, and select **New Session**. It opens a configuration window with multiple tabs. Enter the following configuration parameters:
   * **Session tab**:
     * **Host**: The host name or IP address of your Linux Data Science VM.
     * **Login**: User name on the Linux VM.
     * **SSH Port**: Leave it at 22, the default value.
     * **Session Type**: Change the value to XFCE. Currently the Linux VM only supports XFCE desktop.
   * **Media tab**: If you don't need to use sound support and client printing, you can turn them off.
   * **Shared folders**: If you want directories from your client machines mounted on the Linux VM, add the client machine directories that you want to share with the VM on this tab.

After you sign in to the VM by using either the SSH client or XFCE graphical desktop through the X2Go client, you are ready to start using the tools that are installed and configured on the VM. On XFCE, you can see applications menu shortcuts and desktop icons for many of the tools.

## Tools installed on the Linux Data Science Virtual Machine
### Microsoft R Server
R is one of the most popular languages for data analysis and machine learning. If you want to use R for your analytics, the VM has Microsoft R Server (MRS) with the Microsoft R Open (MRO) and Math Kernel Library (MKL). The MKL optimizes math operations common in analytical algorithms. MRO is 100 percent compatible with CRAN-R, and any of the R libraries published in CRAN can be installed on the MRO. MRS gives you scaling and operationalization of R models into web services. You can edit your R programs in one of the default editors, like RStudio, vi, Emacs, or gedit. If you are using the Emacs editor, note that the Emacs package ESS (Emacs Speaks Statistics), which simplifies working with R files within the Emacs editor, has been pre-installed.

To launch R console, you just type **R** in the shell. This takes you to an interactive environment. To develop your R program, you typically use an editor like Emacs or vi or gedit, and then run the scripts within R. With RStudio, you have a full graphical IDE environment to develop your R program.

There is also an R script for you to install the [Top 20 R packages](https://www.kdnuggets.com/2015/06/top-20-r-packages.html) if you want. This script can be run after you are in the R interactive interface, which can be entered (as mentioned) by typing **R** in the shell.  

### Python
For development using Python, Anaconda Python distribution 2.7 and 3.5 has been installed. This distribution contains the base Python along with about 300 of the most popular math, engineering, and data analytics packages. You can use the default text editors. In addition, you can use Spyder, a Python IDE that is bundled with Anaconda Python distributions. Spyder needs a graphical desktop or X11 forwarding. A shortcut to Spyder is provided in the graphical desktop.

Since we have both Python 2.7 and 3.5, you need to specifically activate the desired Python version (conda environment) you want to work on in the current session. The activation process sets the PATH variable to the desired version of Python.

To activate the Python 2.7 conda environment, run the following command from the shell:

    source /anaconda/bin/activate root

Python 2.7 is installed at */anaconda/bin*.

To activate the Python 3.5 conda environment, run the following from the shell:

    source /anaconda/bin/activate py35


Python 3.5 is installed at */anaconda/envs/py35/bin*.

To invoke a Python interactive session, just type **python** in the shell. If you are on a graphical interface or have X11 forwarding set up, you can type **pycharm** to launch the PyCharm Python IDE.

To install additional Python libraries, you need to run ```conda``` or ```pip``` command under sudo and provide full path of the Python package manager (conda or pip) to install to the correct Python environment. For example:

    sudo /anaconda/bin/pip install <package> #pip for Python 2.7
    sudo /anaconda/envs/py35/bin/pip install <package> #pip for Python 3.5
    sudo /anaconda/bin/conda install [-n py27] <package> #conda for Python 2.7, default behavior
    sudo /anaconda/bin/conda install -n py35 <package> #conda for Python 3.5


### Jupyter notebook
The Anaconda distribution also comes with a Jupyter notebook, an environment to share code and analysis. The Jupyter notebook is accessed through JupyterHub. You sign in using your local Linux user name and password.

The Jupyter notebook server has been pre-configured with Python 2, Python 3, and R kernels. There is a desktop icon named "Jupyter Notebook" to launch the browser to access the notebook server. If you are on the VM via SSH or X2Go client, you can also visit [https://localhost:8000/](https://localhost:8000/) to access the Jupyter notebook server.

> [!NOTE]
> Continue if you get any certificate warnings.
> 
> 

You can access the Jupyter notebook server from any host. Just type *https://\<VM DNS name or IP Address\>:8000/*

> [!NOTE]
> Port 8000 is opened in the firewall by default when the VM is provisioned.
> 
> 

We have packaged sample notebooks--one in Python and one in R. You can see the link to the samples on the notebook home page after you authenticate to the Jupyter notebook by using your local Linux user name and password. You can create a new notebook by selecting **New**, and then the appropriate language kernel. If you don't see the **New** button, click the **Jupyter** icon on the top left to go to the home page of the notebook server.

### Apache Spark Standalone 
A standalone instance of Apache Spark is preinstalled on the Linux DSVM to help you develop Spark applications locally first before testing and deploying on large clusters. You can run PySpark programs through the Jupyter kernel. When you open Jupyter and click the **New** button, you should see a list of available kernels. The "Spark - Python" is the PySpark kernel that lets you build Spark applications using Python language. You can also use a Python IDE like PyCharm or Spyder to build you Spark program. Since, this is a standalone  instance, the Spark stack runs within the calling client program. This makes it faster and easier to troubleshoot issues compared to developing on a Spark cluster. 

A sample PySpark notebook is provided on Jupyter that you can find in the "SparkML" directory under the home directory of Jupyter ($HOME/notebooks/SparkML/pySpark). 

If you are programming in R for Spark, you can use Microsoft R Server, SparkR or sparklyr. 

Before running in Spark context in Microsoft R Server, you need to do a one time setup step to enable a local single node Hadoop HDFS and Yarn instance. By default, Hadoop services are installed but disabled on the DSVM. In order to enable it, you need to run the following commands as root the first time:

    echo -e 'y\n' | ssh-keygen -t rsa -P '' -f ~hadoop/.ssh/id_rsa
    cat ~hadoop/.ssh/id_rsa.pub >> ~hadoop/.ssh/authorized_keys
    chmod 0600 ~hadoop/.ssh/authorized_keys
    chown hadoop:hadoop ~hadoop/.ssh/id_rsa
    chown hadoop:hadoop ~hadoop/.ssh/id_rsa.pub
    chown hadoop:hadoop ~hadoop/.ssh/authorized_keys
    systemctl start hadoop-namenode hadoop-datanode hadoop-yarn

You can stop the Hadoop related services when you don't need them by running ```systemctl stop hadoop-namenode hadoop-datanode hadoop-yarn```
A sample demonstrating how to develop and test MRS in remote Spark context (which is the standalone Spark instance on the DSVM) is provided and available in the `/dsvm/samples/MRS` directory. 

### IDEs and editors
You have a choice of several code editors. This includes vi/VIM, Emacs, gEdit, PyCharm, RStudio, Eclipse, and IntelliJ. gEdit, Eclipse, IntelliJ, RStudio and PyCharm are graphical editors, and need you to be signed in to a graphical desktop to use them. These editors have desktop and application menu shortcuts to launch them.

**VIM** and **Emacs** are text-based editors. On Emacs, we have installed an add-on package called Emacs Speaks Statistics (ESS) that makes working with R easier within the Emacs editor. More information can be found at [ESS](https://ess.r-project.org/).

**Eclipse** is an open source, extensible IDE that supports multiple languages. The Java developers edition is the instance installed on the VM. There are plugins available for several popular languages that can be installed to extend the environment. We also have a plugin installed in Eclipse called **Azure Toolkit for Eclipse**. It allows you to create, develop, test, and deploy Azure applications using the Eclipse development environment that supports languages like Java. There is also an **Azure SDK for Java** that allows access to different Azure services from within a Java environment. More information on Azure toolkit for Eclipse can be found at [Azure Toolkit for Eclipse](../../azure-toolkit-for-eclipse.md).

**LaTex** is installed through the texlive package along with an Emacs add-on [auctex](https://www.gnu.org/software/auctex/manual/auctex/auctex.html) package, which simplifies authoring your LaTex documents within Emacs.  

### Databases
#### Postgres
The open source database **Postgres** is available on the VM, with the services running and initdb already completed. You still need to create databases and users. For more information, see the [Postgres documentation](https://www.postgresql.org/docs/).  

#### Graphical SQL client
**SQuirrel SQL**, a graphical SQL client, has been provided to connect to different databases (such as Microsoft SQL Server, Postgres, and MySQL) and to run SQL queries. You can run this from a graphical desktop session (using the X2Go client, for example). To invoke SQuirrel SQL, you can either launch it from the icon on the desktop or run the following command on the shell.

    /usr/local/squirrel-sql-3.7/squirrel-sql.sh

Before the first use, set up your drivers and database aliases. The JDBC drivers are located at:

*/usr/share/java/jdbcdrivers*

For more information, see [SQuirrel SQL](http://squirrel-sql.sourceforge.net/index.php?page=screenshots).

#### Command-line tools for accessing Microsoft SQL Server
The ODBC driver package for SQL Server also comes with two command-line tools:

**bcp**: The bcp utility bulk copies data between an instance of Microsoft SQL Server and a data file in a user-specified format. The bcp utility can be used to import large numbers of new rows into SQL Server tables, or to export data out of tables into data files. To import data into a table, you must either use a format file created for that table, or understand the structure of the table and the types of data that are valid for its columns.

For more information, see [Connecting with bcp](https://msdn.microsoft.com/library/hh568446.aspx).

**sqlcmd**: You can enter Transact-SQL statements with the sqlcmd utility, as well as system procedures, and script files at the command prompt. This utility uses ODBC to execute Transact-SQL batches.

For more information, see [Connecting with sqlcmd](https://msdn.microsoft.com/library/hh568447.aspx).

> [!NOTE]
> There are some differences in this utility between Linux and Windows platforms. See the documentation for details.
> 
> 

#### Database access libraries
There are libraries available in R and Python to access databases.

* In R, the **RODBC** package or **dplyr** package allows you to query or execute SQL statements on the database server.
* In Python, the **pyodbc** library provides database access with ODBC as the underlying layer.  

To access **Postgres**:

* From R: Use the package **RPostgreSQL**.
* From Python: Use the **psycopg2** library.

### Azure tools
The following Azure tools are installed on the VM:

* **Azure command-line interface**: The Azure CLI allows you to create and manage Azure resources through shell commands. To invoke the Azure tools, just type **azure help**. For more information, see the [Azure CLI documentation page](https://docs.microsoft.com/cli/azure/get-started-with-az-cli2).
* **Microsoft Azure Storage Explorer**: Microsoft Azure Storage Explorer is a graphical tool that is used to browse through the objects that you have stored in your Azure storage account, and to upload and download data to and from Azure blobs. You can access Storage Explorer from the desktop shortcut icon. You can invoke it from a shell prompt by typing **StorageExplorer**. You need to be signed in from an X2Go client, or have X11 forwarding set up.
* **Azure Libraries**: The following are some of the pre-installed libraries.
  
  * **Python**: The Azure-related libraries in Python that are installed are **azure**, **azureml**, **pydocumentdb**, and **pyodbc**. With the first three libraries, you can access Azure storage services, Azure Machine Learning, and Azure Cosmos DB (a NoSQL database on Azure). The fourth library, pyodbc (along with the Microsoft ODBC driver for SQL Server), enables access to SQL Server, Azure SQL Database, and Azure SQL Data Warehouse from Python by using an ODBC interface. Enter **pip list** to see all the listed libraries. Be sure to run this command in both the Python 2.7 and 3.5 environments.
  * **R**: The Azure-related libraries in R that are installed are **AzureML** and **RODBC**.
  * **Java**: The list of Azure Java libraries can be found in the directory **/dsvm/sdk/AzureSDKJava** on the VM. The key libraries are Azure storage and management APIs, Azure Cosmos DB, and JDBC drivers for SQL Server.  

You can access the [Azure portal](https://portal.azure.com) from the pre-installed Firefox browser. On the Azure portal, you can create, manage, and monitor Azure resources.

### Azure Machine Learning
Azure Machine Learning is a fully managed cloud service that enables you to build, deploy, and share predictive analytics solutions. You build your experiments and models from Azure Machine Learning Studio. It can be accessed from a web browser on the data science virtual machine by visiting [Microsoft Azure Machine Learning](https://studio.azureml.net).

After you sign in to Azure Machine Learning Studio, you have access to an experimentation canvas where you can build a logical flow for the machine learning algorithms. You also have access to a Jupyter notebook hosted on Azure Machine Learning and can work seamlessly with the experiments in Machine Learning Studio. Operationalize the machine learning models that you have built by wrapping them in a web service interface. This enables clients written in any language to invoke predictions from the machine learning models. For more information, see the [Machine Learning documentation](https://azure.microsoft.com/documentation/services/machine-learning/).

You can also build your models in R or Python on the VM, and then deploy it in production on Azure Machine Learning. We have installed libraries in R (**AzureML**) and Python (**azureml**) to enable this functionality.

For information on how to deploy models in R and Python into Azure Machine Learning, see [Ten things you can do on the Data science Virtual Machine](vm-do-ten-things.md) (in particular, the section "Build models using R or Python and Operationalize them using Azure Machine Learning").

> [!NOTE]
> These instructions were written for the Windows version of the Data Science VM. But the information provided there on deploying models to Azure Machine Learning is applicable to the Linux VM.
> 
> 

### Machine learning tools
The VM comes with a few machine learning tools and algorithms that have been pre-compiled and pre-installed locally. These include:

* **Microsoft Cognitive Toolkit** : A deep learning toolkit.
* **Vowpal Wabbit**: A fast online learning algorithm.
* **xgboost**: A tool that provides optimized, boosted tree algorithms.
* **Python**: Anaconda Python comes bundled with machine learning algorithms with libraries like Scikit-learn. You can install other libraries by using the `pip install` command.
* **R**: A rich library of machine learning functions is available for R. Some of the libraries that are pre-installed are lm, glm, randomForest, rpart. Other libraries can be installed by running:
  
        install.packages(<lib name>)

Here is some additional information about the first three machine learning tools in the list.

#### Microsoft Cognitive Toolkit
This is an open source, deep learning toolkit. It is a command-line tool (cntk), and is already in the PATH.

To run a basic sample, execute the following commands in the shell:

    cd /home/[USERNAME]/notebooks/CNTK/HelloWorld-LogisticRegression
    cntk configFile=lr_bs.cntk makeMode=false command=Train

For more information, see the CNTK section of [GitHub](https://github.com/Microsoft/CNTK), and the [CNTK wiki](https://github.com/Microsoft/CNTK/wiki).

#### Vowpal Wabbit
Vowpal Wabbit is a machine learning system that uses techniques such as online, hashing, allreduce, reductions, learning2search, active, and interactive learning.

To run the tool on a basic example, do the following:

    cp -r /dsvm/tools/VowpalWabbit/demo vwdemo
    cd vwdemo
    vw house_dataset

There are other, larger demos in that directory. For more information on VW, see  [this section of GitHub](https://github.com/JohnLangford/vowpal_wabbit), and the [Vowpal Wabbit wiki](https://github.com/JohnLangford/vowpal_wabbit/wiki).

#### xgboost
This is a library that is designed and optimized for boosted (tree) algorithms. The objective of this library is to push the computation limits of machines to the extremes needed to provide large-scale tree boosting that is scalable, portable, and accurate.

It is provided as a command line as well as an R library.

To use this library in R, you can start an interactive R session (just by typing **R** in the shell), and load the library.

Here is a simple example you can run in R prompt:

    library(xgboost)

    data(agaricus.train, package='xgboost')
    data(agaricus.test, package='xgboost')
    train <- agaricus.train
    test <- agaricus.test
    bst <- xgboost(data = train$data, label = train$label, max.depth = 2,
                    eta = 1, nthread = 2, nround = 2, objective = "binary:logistic")
    pred <- predict(bst, test$data)

To run the xgboost command line, here are the commands to execute in the shell:

    cp -r /dsvm/tools/xgboost/demo/binary_classification/ xgboostdemo
    cd xgboostdemo
    xgboost mushroom.conf


A .model file is written to the directory specified. Information about this demo example can be found [on GitHub](https://github.com/dmlc/xgboost/tree/master/demo/binary_classification).

For more information about xgboost, see the [xgboost documentation page](https://xgboost.readthedocs.org/en/latest/), and its [GitHub repository](https://github.com/dmlc/xgboost).

#### Rattle
Rattle (the **R** **A**nalytical **T**ool **T**o **L**earn **E**asily) uses GUI-based data exploration and modeling. It presents statistical and visual summaries of data, transforms data that can be readily modeled, builds both unsupervised and supervised models from the data, presents the performance of models graphically, and scores new data sets. It also generates R code, replicating the operations in the UI that can be run directly in R or used as a starting point for further analysis.

To run Rattle, you need to be in a graphical desktop sign-in session. On the terminal, type ```R``` to enter the R environment. At the R prompt, enter the following commands:

    library(rattle)
    rattle()

Now a graphical interface opens up with a set of tabs. Here are the quick start steps in Rattle needed to use a sample weather data set and build a model. In some of the steps below, you are prompted to automatically install and load some required R packages that are not already on the system.

> [!NOTE]
> If you don't have access to install the package in the system directory (the default), you may see a prompt on your R console window to install packages to your personal library. Answer *y* if you see these prompts.
> 
> 

1. Click **Execute**.
1. A dialog pops up, asking you if you like to use the example weather data set. Click **Yes** to load the example.
1. Click the **Model** tab.
1. Click **Execute** to build a decision tree.
1. Click **Draw** to display the decision tree.
1. Click the **Forest** radio button, and click **Execute** to build a random forest.
1. Click the **Evaluate** tab.
1. Click the **Risk** radio button, and click **Execute** to display two Risk (Cumulative) performance plots.
1. Click the **Log** tab to show the generate R code for the preceding operations.
   (Due to a bug in the current release of Rattle, you need to insert a *#* character in front of *Export this log ...* in the text of the log.)
1. Click the **Export** button to save the R script file named *weather_script.R* to the home folder.

You can exit Rattle and R. Now you can modify the generated R script, or use it as it is to run it anytime to repeat everything that was done within the Rattle UI. Especially for beginners in R, this is an easy way to quickly do analysis and machine learning in a simple graphical interface, while automatically generating code in R to modify and/or learn.

## Next steps
Here's how you can continue your learning and exploration:

* The [Data science on the Linux Data Science Virtual Machine](linux-dsvm-walkthrough.md) walkthrough shows you how to perform several common data science tasks with the Linux Data Science VM provisioned here. 
* Explore the various data science tools on the data science VM by trying out the tools described in this article. You can also run *dsvm-more-info* on the shell within the virtual machine for a basic introduction and pointers to more information about the tools installed on the VM.  
* Learn how to build end-to-end analytical solutions systematically by using the [Team Data Science Process](https://docs.microsoft.com/azure/machine-learning/team-data-science-process/).
* Visit the [Cortana Analytics Gallery](https://gallery.cortanaanalytics.com) for machine learning and data analytics samples that use the Cortana Analytics Suite.

