---
title: 'Reference: Ubuntu Data Science Virtual Machine'
titleSuffix: Azure Data Science Virtual Machine 
description: Details on tools included in the Ubuntu Data Science Virtual Machine
author: jesscioffi
services: machine-learning
ms.service: data-science-vm
ms.custom: devx-track-python, devx-track-linux
ms.author: jcioffi
ms.reviewer: mattmcinnes
ms.date: 04/18/2023
ms.topic: reference
---

# Reference: Ubuntu (Linux) Data Science Virtual Machine

See below for a list of available tools on your Ubuntu Data Science Virtual Machine. 

## Deep learning libraries

### PyTorch

[PyTorch](https://pytorch.org/) is a popular scientific computing framework with wide support for machine learning
algorithms. If your machine has a GPU built in, it can make use of that GPU to accelerate the deep learning.PyTorch is
available in the `py38_pytorch` environment.

### H2O

H2O is a fast, in-memory, distributed machine learning and predictive analytics platform. A Python package is installed in both the root and py35 Anaconda environments. An R package is also installed. 

To open H2O from the command line, run `java -jar /dsvm/tools/h2o/current/h2o.jar`. There are various [command-line options](http://docs.h2o.ai/h2o/latest-stable/h2o-docs/starting-h2o.html#from-the-command-line) that you might want to configure. You can access the Flow web UI by browsing to `http://localhost:54321` to get started. Sample notebooks are also available in JupyterHub.

### TensorFlow

[TensorFlow](https://tensorflow.org) is Google's deep learning library. It's an open-source software library for
numerical computation using data flow graphs. If your machine has a GPU built in, it can make use of that GPU to
accelerate the deep learning. TensorFlow is available in the `py38_tensorflow` conda environment.


## Python

The DSVM has multiple Python environments pre-installed, whereby the Python version is either Python 3.8 or Python 3.6.
To see the full list of installed environments, run `conda env list` in a commandline.


## Jupyter

The DSVM also comes with Jupyter, an environment to share code and analysis. Jupyter is installed on the DSVM in
different flavors:
 - Jupyter Lab
 - Jupyter Notebook
 - Jupyter Hub

To open Jupyter Lab, open Jupyter from the application menu or click on the desktop icon. Alternatively, you can open
Jupyter Lab by running `jupyter lab` from a command line.

To open Jupyter notebook, open a command line and run `jupyter notebook`.

Top open Jupyter Hub, open **https://\<VM DNS name or IP address\>:8000/**. You will then be asked for your local Linux
username and password.

> [!NOTE]
> Continue if you get any certificate warnings.

> [!NOTE]
> For the Ubuntu images, Port 8000 is opened in the firewall by default when the VM is provisioned.


## Apache Spark standalone

A standalone instance of Apache Spark is preinstalled on the Linux DSVM to help you develop Spark applications locally
before you test and deploy them on large clusters. 

You can run PySpark programs through the Jupyter kernel. When you open Jupyter, select the **New** button and you should
see a list of available kernels. **Spark - Python** is the PySpark kernel that lets you build Spark applications by
using the Python language. You can also use a Python IDE like VS.Code or PyCharm to build your Spark program. 

In this standalone instance, the Spark stack runs within the calling client program. This feature makes it faster and
easier to troubleshoot issues, compared to developing on a Spark cluster.


## IDEs and editors

You have a choice of several code editors, including VS.Code, PyCharm, IntelliJ, vi/Vim, Emacs. 

VS.Code, PyCharm, and IntelliJ are graphical editors. To use them, you need to be signed in to a graphical
desktop. You open them by using desktop and application menu shortcuts.

Vim and Emacs are text-based editors. On Emacs, the ESS add-on package makes working with R easier within the Emacs
editor. You can find more information on the [ESS website](https://ess.r-project.org/).


## Databases

### Graphical SQL client

SQuirrel SQL, a graphical SQL client, can connect to various databases (such as Microsoft SQL Server and MySQL) and run
SQL queries. The quickest way to open SQuirrel SQL is to use the Application Menu from a graphical desktop session
(through the X2Go client, for example)

Before the first use, set up your drivers and database aliases. The JDBC drivers are located at /usr/share/java/jdbcdrivers.

For more information, see [SQuirrel SQL](http://squirrel-sql.sourceforge.net/index.php?page=screenshots).

### Command-line tools for accessing Microsoft SQL Server

The ODBC driver package for SQL Server also comes with two command-line tools:

- **bcp**: The bcp tool bulk copies data between an instance of Microsoft SQL Server and a data file in a user-specified format. You can use the bcp tool to import large numbers of new rows into SQL Server tables, or to export data out of tables into data files. To import data into a table, you must use a format file created for that table. Or, you must understand the structure of the table and the types of data that are valid for its columns.

For more information, see [Connecting with bcp](/sql/connect/odbc/linux-mac/connecting-with-bcp).

- **sqlcmd**: You can enter Transact-SQL statements by using the sqlcmd tool. You can also enter system procedures and script files at the command prompt. This tool uses ODBC to run Transact-SQL batches.

  For more information, see [Connecting with sqlcmd](/sql/connect/odbc/linux-mac/connecting-with-sqlcmd).

  > [!NOTE]
  > There are some differences in this tool between Linux and Windows platforms. See the documentation for details.

### Database access libraries

Libraries are available in R and Python for database access:

* In R, you can use the RODBC package or dplyr package to query or run SQL statements on the database server.
* In Python, the pyodbc library provides database access with ODBC as the underlying layer.  

## Azure tools

The following Azure tools are installed on the VM:

* **Azure CLI**: You can use the command-line interface in Azure to create and manage Azure resources through shell commands. To open the Azure tools, enter **azure help**. For more information, see the [Azure CLI documentation page](/cli/azure/get-started-with-az-cli2).
* **Azure Storage Explorer**: Azure Storage Explorer is a graphical tool that you can use to browse through the objects that you have stored in your Azure storage account, and to upload and download data to and from Azure blobs. You can access Storage Explorer from the desktop shortcut icon. You can also open it from a shell prompt by entering **StorageExplorer**. You must be signed in from an X2Go client, or have X11 forwarding set up.
* **Azure libraries**: The following are some of the pre-installed libraries.
  
  * **Python**: The Azure-related libraries in Python are *azure*, *azureml*, *pydocumentdb*, and *pyodbc*. With the first three libraries, you can access Azure storage services, Azure Machine Learning, and Azure Cosmos DB (a NoSQL database on Azure). The fourth library, pyodbc (along with the Microsoft ODBC driver for SQL Server), enables access to SQL Server, Azure SQL Database, and Azure Synapse Analytics from Python by using an ODBC interface. Enter **pip list** to see all the listed libraries. Be sure to run this command in both the Python 2.7 and 3.5 environments.
  * **R**: The Azure-related libraries in R are Azure Machine Learning and RODBC.
  * **Java**: The list of Azure Java libraries can be found in the directory /dsvm/sdk/AzureSDKJava on the VM. The key libraries are Azure storage and management APIs, Azure Cosmos DB, and JDBC drivers for SQL Server.  

## Azure Machine Learning

Azure Machine Learning is a fully managed cloud service that enables you to build, deploy, and share predictive analytics solutions. You can build your experiments and models in Azure Machine Learning studio. You can access it from a web browser on the Data Science Virtual Machine by visiting [Microsoft Azure Machine Learning](https://ml.azure.com).

After you sign in to Azure Machine Learning studio, you can use an experimentation canvas to build a logical flow for the machine learning algorithms. You also have access to a Jupyter notebook that is hosted on Azure Machine Learning and can work seamlessly with the experiments in Azure Machine Learning studio. 

Operationalize the machine learning models that you have built by wrapping them in a web service interface. Operationalizing machine learning models enables clients written in any language to invoke predictions from those models. For more information, see the [Machine Learning documentation](../index.yml).

You can also build your models in R or Python on the VM, and then deploy them in production on Azure Machine Learning. We have installed libraries in R (**AzureML**) and Python (**azureml**) to enable this functionality.

> [!NOTE]
> These instructions were written for the Windows version of the Data Science Virtual Machine. But the information provided there on deploying models to Azure Machine Learning is applicable to the Linux VM.

## Machine learning tools

The VM comes with machine learning tools and algorithms that have been pre-compiled and pre-installed locally. These include:

* **Vowpal Wabbit**: A fast online learning algorithm.
* **xgboost**: A tool that provides optimized, boosted tree algorithms.
* **Rattle**: An R-based graphical tool for easy data exploration and modeling.
* **Python**: Anaconda Python comes bundled with machine learning algorithms with libraries like Scikit-learn. You can install other libraries by using the `pip install` command.
* **LightGBM**: A fast, distributed, high-performance gradient boosting framework based on decision tree algorithms.
* **R**: A rich library of machine learning functions is available for R. Pre-installed libraries include lm, glm, randomForest, and rpart. You can install other libraries by running this command:

    ```r
    install.packages(<lib name>)
    ```

Here is some additional information about the first three machine learning tools in the list.

### Vowpal Wabbit

Vowpal Wabbit is a machine learning system that uses techniques such as online, hashing, allreduce, reductions, learning2search, active, and interactive learning.

To run the tool on a basic example, use the following commands:

```bash
cp -r /dsvm/tools/VowpalWabbit/demo vwdemo
cd vwdemo
vw house_dataset
```

There are other, larger demos in that directory. For more information on Vowpal Wabbit, see  [this section of GitHub](https://github.com/JohnLangford/vowpal_wabbit) and the [Vowpal Wabbit wiki](https://github.com/JohnLangford/vowpal_wabbit/wiki).

### xgboost

The xgboost library is designed and optimized for boosted (tree) algorithms. The objective of this library is to push the computation limits of machines to the extremes needed to provide large-scale tree boosting that is scalable, portable, and accurate.

It's provided as a command line and an R library. To use this library in R, you can start an interactive R session (by entering **R** in the shell) and load the library.

Here's a simple example that you can run in an R prompt:

```R
library(xgboost)

data(agaricus.train, package='xgboost')
data(agaricus.test, package='xgboost')
train <- agaricus.train
test <- agaricus.test
bst <- xgboost(data = train$data, label = train$label, max.depth = 2,
                eta = 1, nthread = 2, nround = 2, objective = "binary:logistic")
pred <- predict(bst, test$data)
```

To run the xgboost command line, here are the commands to run in the shell:

```bash
cp -r /dsvm/tools/xgboost/demo/binary_classification/ xgboostdemo
cd xgboostdemo
xgboost mushroom.conf
```

For more information about xgboost, see the [xgboost documentation page](https://xgboost.readthedocs.org/en/latest/) and its [GitHub repository](https://github.com/dmlc/xgboost).

### Rattle

Rattle (the **R** **A**nalytical **T**ool **T**o **L**earn **E**asily) uses GUI-based data exploration and modeling. It presents statistical and visual summaries of data, transforms data that can be readily modeled, builds both unsupervised and supervised models from the data, presents the performance of models graphically, and scores new data sets. It also generates R code, replicating the operations in the UI that can be run directly in R or used as a starting point for further analysis.

To run Rattle, you need to be in a graphical desktop sign-in session. On the terminal, enter **R** to open the R environment. At the R prompt, enter the following commands:

```R
library(rattle)
rattle()
```

Now a graphical interface opens with a set of tabs. Use the following quickstart steps in Rattle to use a sample weather data set and build a model. In some of the steps, you're prompted to automatically install and load some required R packages that are not already on the system.

> [!NOTE]
> If you don't have access to install the package in the system directory (the default), you might see a prompt on your R console window to install packages to your personal library. Answer **y** if you see these prompts.

1. Select **Execute**.
1. A dialog box appears, asking you if you want to use the example weather data set. Select **Yes** to load the example.
1. Select the **Model** tab.
1. Select **Execute** to build a decision tree.
1. Select **Draw** to display the decision tree.
1. Select the **Forest** option, and select **Execute** to build a random forest.
1. Select the **Evaluate** tab.
1. Select the **Risk** option, and select **Execute** to display two **Risk (Cumulative)** performance plots.
1. Select the **Log** tab to show the generated R code for the preceding operations.
   (Because of a bug in the current release of Rattle, you need to insert a **#** character in front of **Export this log** in the text of the log.)
1. Select the **Export** button to save the R script file named *weather_script.R* to the home folder.

You can exit Rattle and R. Now you can modify the generated R script. Or, use the script as it is, and run it anytime to repeat everything that was done within the Rattle UI. Especially for beginners in R, this is a way to quickly do analysis and machine learning in a simple graphical interface, while automatically generating code in R to modify or learn.

## Next steps

Have additional questions? Consider creating a [support ticket](https://azure.microsoft.com/support/create-ticket/).
