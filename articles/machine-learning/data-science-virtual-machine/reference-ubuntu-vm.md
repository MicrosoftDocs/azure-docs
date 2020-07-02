---
title: 'Reference: Ubuntu Data Science Virtual Machine'
titleSuffix: Azure Data Science Virtual Machine 
description: Details on tools included in the Ubuntu Data Science Virtual Machine
author: gvashishtha
ms.service: machine-learning
ms.subservice: data-science-vm
ms.custom: tracking-python

ms.author: gopalv
ms.date: 09/11/2019
ms.topic: reference


---

# Reference: Ubuntu (Linux) Data Science Virtual Machine

See below for a list of available tools on your Ubuntu Data Science Virtual Machine. 

## Deep learning libraries

### CNTK

The Microsoft Cognitive Toolkit is an open-source deep learning toolkit. Python bindings are available in the root and py35 Conda environments. It also has a command-line tool (CNTK) that's already in the path.

Sample Python notebooks are available in JupyterHub. To run a basic sample at the command line, run the following commands in the shell:

```bash
cd /home/[USERNAME]/notebooks/CNTK/HelloWorld-LogisticRegression
cntk configFile=lr_bs.cntk makeMode=false command=Train
```

For more information, see the CNTK section of [GitHub](https://github.com/Microsoft/CNTK) and the [CNTK wiki](https://github.com/Microsoft/CNTK/wiki).

### Caffe

Caffe is a deep learning framework from the Berkeley Vision and Learning Center. It's available in /opt/caffe. You can find examples in /opt/caffe/examples.

### Caffe2

Caffe2 is a deep learning framework from Facebook that is built on Caffe. It's available in Python 2.7 in the Conda root environment. To activate it, run the following command from the shell:

```bash
source /anaconda/bin/activate root
```

Some example notebooks are available in JupyterHub.

### H2O

H2O is a fast, in-memory, distributed machine learning and predictive analytics platform. A Python package is installed in both the root and py35 Anaconda environments. An R package is also installed. 

To open H2O from the command line, run `java -jar /dsvm/tools/h2o/current/h2o.jar`. There are various [command-line options](http://docs.h2o.ai/h2o/latest-stable/h2o-docs/starting-h2o.html#from-the-command-line) that you might want to configure. You can access the Flow web UI by browsing to `http://localhost:54321` to get started. Sample notebooks are also available in JupyterHub.

### Keras

Keras is a high-level neural network API in Python. It can run on top of TensorFlow, Microsoft Cognitive Toolkit, or Theano. It's available in the root and py35 Python environments.

### MXNet

MXNet is a deep learning framework designed for both efficiency and flexibility. It has R and Python bindings included on the DSVM. Sample notebooks are included in JupyterHub, and sample code is available in /dsvm/samples/mxnet.

### NVIDIA DIGITS

The NVIDIA Deep Learning GPU Training System, known as DIGITS, is a system to simplify common deep learning tasks. These tasks include managing data, designing and training neural networks on GPU systems, and monitoring performance in real time with advanced visualization.

DIGITS is available as a service called *digits*. Start the service and browse to `http://localhost:5000` to get started.

DIGITS is also installed as a Python module in the Conda root environment.

### TensorFlow

TensorFlow is Google's deep learning library. It's an open-source software library for numerical computation using data flow graphs. TensorFlow is available in the py35 Python environment, and some sample notebooks are included in JupyterHub.

### Theano

Theano is a Python library for efficient numerical computation. It's available in the root and py35 Python environments. 

### Torch

Torch is a scientific computing framework with wide support for machine learning algorithms. It's available in /dsvm/tools/torch, and the **th** interactive session and LuaRocks package manager are available at the command line. Examples are available in /dsvm/samples/torch.

PyTorch is also available in the root Anaconda environment. Examples are in /dsvm/samples/pytorch.

## Microsoft Machine Learning Server

R is one of the most popular languages for data analysis and machine learning. If you want to use R for your analytics, the VM has Microsoft Machine Learning Server with Microsoft R Open and Math Kernel Library. Math Kernel Library optimizes math operations common in analytical algorithms. Microsoft R Open is 100 percent compatible with CRAN R, and any of the R libraries published in CRAN can be installed on Microsoft R Open. 

Machine Learning Server gives you scaling and operationalization of R models into web services. You can edit your R programs in one of the default editors, like RStudio, vi, or Emacs. If you prefer using the Emacs editor, it has been pre-installed. The Emacs ESS (Emacs Speaks Statistics) package simplifies working with R files within the Emacs editor.

To open the R console, you enter **R** in the shell. This command takes you to an interactive environment. To develop your R program, you typically use an editor like Emacs or vi, and then run the scripts within R. With RStudio, you have a full graphical IDE to develop your R program.

There's also an R script for you to install the [Top 20 R packages](https://www.kdnuggets.com/2015/06/top-20-r-packages.html) if you want. You can run this script after you're in the R interactive interface. As mentioned earlier, you can open that interface by entering **R** in the shell.  

## Python

Anaconda Python is installed with Python 2.7 and 3.5 environments. The 2.7 environment is called _root_, and the 3.5 environment is called _py35_. This distribution contains the base Python along with about 300 of the most popular math, engineering, and data analytics packages.

The py35 environment is the default. To activate the root (2.7) environment, use this command:

```bash
source activate root
```

To activate the py35 environment again, use this command:

```bash
source activate py35
```

To invoke a Python interactive session, enter **python** in the shell. 

Install additional Python libraries by using Conda or pip. For pip, activate the correct environment first if you don't want the default:

```bash
source activate root
pip install <package>
```

Or specify the full path to pip:

```bash
/anaconda/bin/pip install <package>
```

For Conda, you should always specify the environment name (py35 or root):

```bash
conda install <package> -n py35
```

If you're on a graphical interface or have X11 forwarding set up, you can enter **pycharm** to open the PyCharm Python IDE. You can use the default text editors. In addition, you can use Spyder, a Python IDE that's bundled with Anaconda Python distributions. Spyder needs a graphical desktop or X11 forwarding. The graphical desktop has a shortcut to Spyder.

## Jupyter notebook

The Anaconda distribution also comes with a Jupyter notebook, an environment to share code and analysis. The Jupyter notebook is accessed through JupyterHub. You sign in by using your local Linux username and password.

The Jupyter notebook server has been pre-configured with Python 2, Python 3, and R kernels. Use the **Jupyter Notebook** desktop icon to open the browser and access the notebook server. If you're on the VM via SSH or the X2Go client, you can also access the Jupyter notebook server at `https://localhost:8000/`.

> [!NOTE]
> Continue if you get any certificate warnings.

You can access the Jupyter notebook server from any host. Enter **https://\<VM DNS name or IP address\>:8000/**.

> [!NOTE]
> Port 8000 is opened in the firewall by default when the VM is provisioned. 

We have packaged sample notebooks--one in Python and one in R. You can see the link to the samples on the notebook home page after you authenticate to the Jupyter notebook by using your local Linux username and password. You can create a new notebook by selecting **New**, and then selecting the appropriate language kernel. If you don't see the **New** button, select the **Jupyter** icon on the upper left to go to the home page of the notebook server.

## Apache Spark standalone

A standalone instance of Apache Spark is preinstalled on the Linux DSVM to help you develop Spark applications locally before you test and deploy them on large clusters. 

You can run PySpark programs through the Jupyter kernel. When you open Jupyter, select the **New** button and you should see a list of available kernels. **Spark - Python** is the PySpark kernel that lets you build Spark applications by using the Python language. You can also use a Python IDE like PyCharm or Spyder to build your Spark program. 

In this standalone instance, the Spark stack runs within the calling client program. This feature makes it faster and easier to troubleshoot issues, compared to developing on a Spark cluster.

Jupyter provides a sample PySpark notebook. You can find it in the SparkML directory under the home directory of Jupyter ($HOME/notebooks/SparkML/pySpark). 

If you're programming in R for Spark, you can use Microsoft Machine Learning Server, SparkR, or sparklyr. 

Before you run in a Spark context in Microsoft Machine Learning Server, you need to do a one-time setup step to enable a local single-node Hadoop HDFS and Yarn instance. By default, Hadoop services are installed but disabled on the DSVM. To enable it, you need to run the following commands as root the first time:

```bash
echo -e 'y\n' | ssh-keygen -t rsa -P '' -f ~hadoop/.ssh/id_rsa
cat ~hadoop/.ssh/id_rsa.pub >> ~hadoop/.ssh/authorized_keys
chmod 0600 ~hadoop/.ssh/authorized_keys
chown hadoop:hadoop ~hadoop/.ssh/id_rsa
chown hadoop:hadoop ~hadoop/.ssh/id_rsa.pub
chown hadoop:hadoop ~hadoop/.ssh/authorized_keys
systemctl start hadoop-namenode hadoop-datanode hadoop-yarn
```

You can stop the Hadoop-related services when you don't need them by running ```systemctl stop hadoop-namenode hadoop-datanode hadoop-yarn```.

The /dsvm/samples/MRS directory provides a sample that demonstrates how to develop and test Microsoft Machine Learning Server in a remote Spark context (the standalone Spark instance on the DSVM).

## IDEs and editors

You have a choice of several code editors, including vi/Vim, Emacs, PyCharm, RStudio, and IntelliJ. 

PyCharm, RStudio, and IntelliJ are graphical editors. To use them, you need to be signed in to a graphical desktop. You open them by using desktop and application menu shortcuts.

Vim and Emacs are text-based editors. On Emacs, the ESS add-on package makes working with R easier within the Emacs editor. You can find more information on the [ESS website](https://ess.r-project.org/).

LaTex is installed through the texlive package, along with an Emacs add-on package called [AUCTeX](https://www.gnu.org/software/auctex/manual/auctex/auctex.html). This package simplifies authoring your LaTex documents within Emacs.  

## Databases

### Graphical SQL client

SQuirrel SQL, a graphical SQL client, can connect to various databases (such as Microsoft SQL Server and MySQL) and run SQL queries. You can run SQuirrel SQL from a graphical desktop session (through the X2Go client, for example) by using a desktop icon. Or you can run the client by using the following command in the shell:

```bash
/usr/local/squirrel-sql-3.7/squirrel-sql.sh
```

Before the first use, set up your drivers and database aliases. The JDBC drivers are located at /usr/share/java/jdbcdrivers.

For more information, see [SQuirrel SQL](http://squirrel-sql.sourceforge.net/index.php?page=screenshots).

### Command-line tools for accessing Microsoft SQL Server

The ODBC driver package for SQL Server also comes with two command-line tools:

- **bcp**: The bcp tool bulk copies data between an instance of Microsoft SQL Server and a data file in a user-specified format. You can use the bcp tool to import large numbers of new rows into SQL Server tables, or to export data out of tables into data files. To import data into a table, you must use a format file created for that table. Or, you must understand the structure of the table and the types of data that are valid for its columns.

  For more information, see [Connecting with bcp](https://msdn.microsoft.com/library/hh568446.aspx).

- **sqlcmd**: You can enter Transact-SQL statements by using the sqlcmd tool. You can also enter system procedures and script files at the command prompt. This tool uses ODBC to run Transact-SQL batches.

  For more information, see [Connecting with sqlcmd](https://msdn.microsoft.com/library/hh568447.aspx).

  > [!NOTE]
  > There are some differences in this tool between Linux and Windows platforms. See the documentation for details.

### Database access libraries

Libraries are available in R and Python for database access:

* In R, you can use the RODBC package or dplyr package to query or run SQL statements on the database server.
* In Python, the pyodbc library provides database access with ODBC as the underlying layer.  

## Azure tools

The following Azure tools are installed on the VM:

* **Azure CLI**: You can use the command-line interface in Azure to create and manage Azure resources through shell commands. To open the Azure tools, enter **azure help**. For more information, see the [Azure CLI documentation page](https://docs.microsoft.com/cli/azure/get-started-with-az-cli2).
* **Azure Storage Explorer**: Azure Storage Explorer is a graphical tool that you can use to browse through the objects that you have stored in your Azure storage account, and to upload and download data to and from Azure blobs. You can access Storage Explorer from the desktop shortcut icon. You can also open it from a shell prompt by entering **StorageExplorer**. You must be signed in from an X2Go client, or have X11 forwarding set up.
* **Azure libraries**: The following are some of the pre-installed libraries.
  
  * **Python**: The Azure-related libraries in Python are *azure*, *azureml*, *pydocumentdb*, and *pyodbc*. With the first three libraries, you can access Azure storage services, Azure Machine Learning, and Azure Cosmos DB (a NoSQL database on Azure). The fourth library, pyodbc (along with the Microsoft ODBC driver for SQL Server), enables access to SQL Server, Azure SQL Database, and Azure SQL Data Warehouse from Python by using an ODBC interface. Enter **pip list** to see all the listed libraries. Be sure to run this command in both the Python 2.7 and 3.5 environments.
  * **R**: The Azure-related libraries in R are AzureML and RODBC.
  * **Java**: The list of Azure Java libraries can be found in the directory /dsvm/sdk/AzureSDKJava on the VM. The key libraries are Azure storage and management APIs, Azure Cosmos DB, and JDBC drivers for SQL Server.  

You can access the [Azure portal](https://portal.azure.com) from the pre-installed Firefox browser. On the Azure portal, you can create, manage, and monitor Azure resources.

## Azure Machine Learning

Azure Machine Learning is a fully managed cloud service that enables you to build, deploy, and share predictive analytics solutions. You can build your experiments and models in Azure Machine Learning studio (preview). You can access it from a web browser on the Data Science Virtual Machine by visiting [Microsoft Azure Machine Learning](https://ml.azure.com).

After you sign in to Azure Machine Learning studio, you can use an experimentation canvas to build a logical flow for the machine learning algorithms. You also have access to a Jupyter notebook that is hosted on Azure Machine Learning and can work seamlessly with the experiments in Azure Machine Learning studio. 

Operationalize the machine learning models that you have built by wrapping them in a web service interface. Operationalizing machine learning models enables clients written in any language to invoke predictions from those models. For more information, see the [Machine Learning documentation](https://azure.microsoft.com/documentation/services/machine-learning/).

You can also build your models in R or Python on the VM, and then deploy them in production on Azure Machine Learning. We have installed libraries in R (**AzureML**) and Python (**azureml**) to enable this functionality.

For information on how to deploy models in R and Python into Azure Machine Learning, see [Ten things you can do on the Data Science Virtual Machine](vm-do-ten-things.md).

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
  
        install.packages(<lib name>)

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

A .model file is written to the specified directory. You can find information about this demo example [on GitHub](https://github.com/dmlc/xgboost/tree/master/demo/binary_classification).

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
