---
title: 'Reference: Ubuntu Data Science Virtual Machine'
titleSuffix: Azure Data Science Virtual Machine
description: Details on tools included in the Ubuntu Data Science Virtual Machine
author: jesscioffi
services: machine-learning
ms.service: data-science-vm
ms.custom: devx-track-python, linux-related-content
ms.author: jcioffi
ms.reviewer: franksolomon
ms.date: 04/30/2024
ms.topic: reference
---

# Reference: Ubuntu (Linux) Data Science Virtual Machine

This document presents a list of available tools on your Ubuntu Data Science Virtual Machine (DSVM).

## Deep learning libraries

### PyTorch

[PyTorch](https://pytorch.org/) is a popular scientific computing framework, with wide support for machine learning
algorithms. If your machine has a built-in GPU, it can use of that GPU to accelerate the deep learning.PyTorch is
available in the `py38_pytorch` environment.

### H2O

H2O is a fast, in-memory, distributed machine learning and predictive analytics platform. A Python package is installed in both the root and py35 Anaconda environments. An R package is also installed.

To open H2O from the command line, run `java -jar /dsvm/tools/h2o/current/h2o.jar`. You can configure various available[command-line options](http://docs.h2o.ai/h2o/latest-stable/h2o-docs/starting-h2o.html#from-the-command-line). Browse to the Flow web UI to `http://localhost:54321` to get started. JupyterHub offers sample notebooks.

### TensorFlow

[TensorFlow](https://tensorflow.org) is the Google deep learning library. It's an open-source software library for
numerical computation using data flow graphs. If your machine has a GPU built in, it can use that GPU to
accelerate the deep learning. TensorFlow is available in the `py38_tensorflow` conda environment.

## Python

The Data Science Virtual Machine (DSVM) has multiple preinstalled Python environments, with either Python version 3.8 or Python version 3.6. Run `conda env list` in a terminal window to see the full list of installed environments.

## Jupyter

The DSVM also comes with Jupyter, a code sharing and code analysis environment. Jupyter is installed on the DSVM in these flavors:

 - Jupyter Lab
 - Jupyter Notebook
 - Jupyter Hub

To launch Jupyter Lab, open Jupyter from the application menu, or select the desktop icon. You can also run `jupyter lab` from a command line to open Jupyter Lab.

To open Jupyter notebook, open a command line and run `jupyter notebook`.

To open Jupyter Hub, open **https://\<VM DNS name or IP address\>:8000/** in a browser. You must provide your local Linux username and password.

> [!NOTE]
> You can ignore any certificate warnings.

> [!NOTE]
> For the Ubuntu images, firewall Port 8000 is opened by default when the VM is provisioned.

## Apache Spark standalone

A standalone instance of Apache Spark is preinstalled on the Linux DSVM to help you develop Spark applications locally
before you test and deploy those applications on large clusters.

You can run PySpark programs through the Jupyter kernel. When Jupyter launches, select the **New** button. A list of available kernels should become visible. You can build Spark applications with the Python language if you choose the  **Spark - Python** kernel. You can also use a Python IDE - for example, VS.Code or PyCharm - to build your Spark program.

In this standalone instance, the Spark stack runs inside the calling client program. This feature makes it faster and
easier to troubleshoot issues, compared to development on a Spark cluster.

## IDEs and editors

You have a choice of several code editors, including VS.Code, PyCharm, IntelliJ, vi/Vim, or Emacs.

VS.Code, PyCharm, and IntelliJ are graphical editors. To use them, you need to be signed in to a graphical
desktop. You open them by using desktop and application menu shortcuts.

Vim and Emacs are text-based editors. On Emacs, the ESS add-on package makes it easier to work with R within the Emacs
editor. For more information, visit the [ESS website](https://ess.r-project.org/).

## Databases

### Graphical SQL client

SQuirrel SQL, a graphical SQL client, can connect to various databases - for example, Microsoft SQL Server or MySQL - and run SQL queries. The quickest way to open SQuirrel SQL is to use the Application Menu from a graphical desktop session (through the X2Go client, for example)

Before initial use, set up your drivers and database aliases. You can find the JDBC drivers at **/usr/share/java/jdbcdrivers**.

For more information, visit the [SQuirrel SQL](http://squirrel-sql.sourceforge.net/index.php?page=screenshots) resource.

### Command-line tools for accessing Microsoft SQL Server

The ODBC driver package for SQL Server also includes two command-line tools:

- **bcp**: The bcp tool bulk copies data between an instance of Microsoft SQL Server and a data file, in a user-specified format. You can use the bcp tool to import large numbers of new rows into SQL Server tables, or to export data out of tables into data files. To import data into a table, you must use a format file created for that table. You must understand the structure of the table and the types of data that are valid for its columns.

For more information, visit [Connecting with bcp](/sql/connect/odbc/linux-mac/connecting-with-bcp).

- **sqlcmd**: You can enter Transact-SQL statements with the sqlcmd tool. You can also enter system procedures and script files at the command prompt. This tool uses ODBC to run Transact-SQL batches.

  For more information, visit [Connecting with sqlcmd](/sql/connect/odbc/linux-mac/connecting-with-sqlcmd).

  > [!NOTE]
  > There are some differences in this tool between its Linux and Windows platform versions. Review the documentation for details.

### Database access libraries

R and Python libraries are available for database access:

* In R, you can use the RODBC dplyr packages to query or run SQL statements on the database server
* In Python, the pyodbc library provides database access with ODBC as the underlying layer

## Azure tools

These Azure tools are installed on the VM:

* **Azure CLI**: You can use the command-line interface in Azure to create and manage Azure resources through shell commands. To open the Azure tools, enter **azure help**. For more information, visit the [Azure CLI documentation page](/cli/azure/get-started-with-az-cli2).
* **Azure Storage Explorer**: Azure Storage Explorer is a graphical tool that you can use to browse through the objects that you stored in your Azure storage account, and to upload and download data to and from Azure blobs. You can access Storage Explorer from the desktop shortcut icon. You can also open it from a shell prompt if you enter **StorageExplorer**. You must be signed in from an X2Go client, or have X11 forwarding set up.
* **Azure libraries**: These are some of the preinstalled libraries:

  * **Python**: Python offers the *azure*, *azureml*, *pydocumentdb*, and *pyodbc* Azure-related libraries. With the first three libraries, you can access Azure storage services, Azure Machine Learning, and Azure Cosmos DB (a NoSQL database on Azure). The fourth library, pyodbc (along with the Microsoft ODBC driver for SQL Server), enables access to SQL Server, Azure SQL Database, and Azure Synapse Analytics from Python through an ODBC interface. Enter **pip list** to see all of the listed libraries. Be sure to run this command in either the Python 2.7 and 3.5 environments.
  * **R**: Azure Machine Learning and RODBC are the Azure-related libraries in R.
  * **Java**: Directory **/dsvm/sdk/AzureSDKJava** has the list of Azure Java libraries can be found in the **/dsvm/sdk/AzureSDKJava** directory on the VM. The key libraries are Azure storage and management APIs, Azure Cosmos DB, and JDBC drivers for SQL Server.

## Azure Machine Learning

The fully managed Azure Machine Learning cloud service enables you to build, deploy, and share predictive analytics solutions. You can build your experiments and models in Azure Machine Learning studio. Visit [Microsoft Azure Machine Learning](https://ml.azure.com) to access it from a web browser on the Data Science Virtual Machine.

After you sign in to Azure Machine Learning studio, you can use an experimentation canvas to build a logical flow for the machine learning algorithms. You also have access to a Jupyter notebook hosted on Azure Machine Learning. This notebook can work seamlessly with the experiments in Azure Machine Learning studio.

To operationalize the machine learning models you built, wrap them in a web service interface. Machine learning model operationalization enables clients written in any language to invoke predictions from those models. Visit [Machine Learning documentation](../index.yml) for more information.

You can also build your models in R or Python on the VM, and then deploy them in production on Azure Machine Learning. We installed libraries in R (**AzureML**) and Python (**azureml**) to enable this functionality.

> [!NOTE]
> We wrote these instructions for the Data Science Virtual Machine Windows version. However, the instructions cover Azure Machine Learning model deployments to the Linux VM.

## Machine learning tools

The VM comes with precompiled machine learning tools and algorithm, all pre-installed locally. These include:

* **Vowpal Wabbit**: A fast online learning algorithm
* **xgboost**: This tool provides optimized, boosted tree algorithms
* **Rattle**: An R-based graphical tool for easy data exploration and modeling
* **Python**: Anaconda Python comes bundled with machine learning algorithms with libraries like Scikit-learn. You can install other libraries with the `pip install` command
* **LightGBM**: A fast, distributed, high-performance gradient boosting framework based on decision tree algorithms
* **R**: A rich library of machine learning functions is available for R. Preinstalled libraries include lm, glm, randomForest, and rpart. You can install other libraries with this command:

    ```r
    install.packages(<lib name>)
    ```

Here's more information about the first three machine learning tools in the list.

### Vowpal Wabbit

Vowpal Wabbit is a machine learning system uses

- active
- allreduce
- hashing
- interactive learning
- learning2search
- online
- reductions

techniques.

Use these commands to run the tool on a basic example:

```bash
cp -r /dsvm/tools/VowpalWabbit/demo vwdemo
cd vwdemo
vw house_dataset
```

That directory offers other, larger demos. Visit [this section of GitHub](https://github.com/JohnLangford/vowpal_wabbit) and the [Vowpal Wabbit wiki](https://github.com/JohnLangford/vowpal_wabbit/wiki) for more information on Vowpal Wabbit.

### xgboost

The xgboost library is designed and optimized for boosted (tree) algorithms. The xgboost library pushes the computation limits of machines to the extremes needed for accurate, portable, and scalable large-scale tree boosting.

The xgboost library is provided as both a command line resource and an R library. To use this library in R, you can enter **R** in the shell to start an interactive R session, and load the library.

This simple example show to run xgboost in an R prompt:

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

To run the xgboost command line, run these commands in the shell:

```bash
cp -r /dsvm/tools/xgboost/demo/binary_classification/ xgboostdemo
cd xgboostdemo
xgboost mushroom.conf
```

For more information about xgboost, visit the [xgboost documentation page](https://xgboost.readthedocs.org/en/latest/) and its [GitHub repository](https://github.com/dmlc/xgboost).

### Rattle

Rattle (the **R** **A**nalytical **T**ool **T**o **L**earn **E**asily) uses GUI-based data exploration and modeling. It

- presents statistical and visual summaries of data
- transforms data that can be readily modeled
- builds both unsupervised and supervised models from the data
- presents the performance of models graphically
- scores new data sets

It also generates R code, which replicates Rattle operations in the UI. You can run that code directly in R, or use it as a starting point for further analysis.

To run Rattle, you need to operate in a graphical desktop sign-in session. On the terminal, enter **R** to open the R environment. At the R prompt, enter this command:

```R
library(rattle)
rattle()
```

A graphical interface, with a set of tabs, then opens. These quickstart steps in Rattle use a sample weather data set to build a model. In some of the steps, you receive prompts to automatically install and load specific, required R packages that aren't already on the system.

> [!NOTE]
> If you don't have access permissions to install the package in the system directory (the default), you might notice a prompt on your R console window to install packages to your personal library. Answer **y** if you encounter these prompts.

1. Select **Execute**
1. A dialog box appears, asking if you want to use the example weather data set. Select **Yes** to load the example
1. Select the **Model** tab
1. Select **Execute** to build a decision tree
1. Select **Draw** to display the decision tree
1. Select the **Forest** option, and select **Execute** to build a random forest
1. Select the **Evaluate** tab
1. Select the **Risk** option, and select **Execute** to display two **Risk (Cumulative)** performance plots
1. Select the **Log** tab to show the generated R code for the preceding operations
   - Because of a bug in the current release of Rattle, you must insert a **#** character in front of **Export this log** in the text of the log
1. Select the **Export** button to save the R script file, named *weather_script.R*, to the home folder

You can exit Rattle and R. Now you can modify the generated R script. You can also use the script as is, and run it at any time to repeat everything that was done within the Rattle UI. For beginners in R especially, this lends itself to quick analysis and machine learning in a simple graphical interface, while automatically generating code in R for modification or learning.

## Next steps

For more questions, consider creating a [support ticket](https://azure.microsoft.com/support/create-ticket/)
