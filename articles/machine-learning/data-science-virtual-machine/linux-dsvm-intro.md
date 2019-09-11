---
title: 'Quickstart: Create a CentOS Linux'
titleSuffix: Azure Data Science Virtual Machine 
description: Create and configure a Linux Data Science Virtual Machine in Azure for analytics and machine learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: data-science-vm

author: vijetajo
ms.author: vijetaj
ms.topic: quickstart
ms.date: 03/16/2018

---
# Quickstart: Set up a Linux CentOS Data Science Virtual Machine in Azure

The Linux Data Science Virtual Machine (DSVM) is a CentOS-based Azure virtual machine. The Linux DSVM comes with a collection of preinstalled tools that you can use for data analytics and machine learning. 

The key software components included in a Linux DSVM are:

* Linux CentOS distribution operating system.
* Microsoft Machine Learning Server.
* Anaconda Python distribution (versions 3.5 and 2.7), including popular data analysis libraries.
* JuliaPro, a curated distribution of the Julia language and popular scientific and data analytics libraries.
* Spark Standalone instance and single-node Hadoop (HDFS, YARN).
* JupyterHub, a multiuser Jupyter notebook server that support R, Python, PySpark, and Julia kernels.
* Azure Storage Explorer.
* Azure CLI, the Azure command-line interface for managing Azure resources.
* PostgresSQL database.
* Machine learning tools:
  * [Microsoft Cognitive Toolkit](https://github.com/Microsoft/CNTK) (CNTK), a deep learning software toolkit from Microsoft Research.
  * [Vowpal Wabbit](https://github.com/JohnLangford/vowpal_wabbit), a fast machine learning system that supports techniques like online, hashing, allreduce, reductions, learning2search, active, and interactive learning.
  * [XGBoost](https://xgboost.readthedocs.org/en/latest/), a tool that provides fast and accurate boosted tree implementation.
  * [Rattle](https://togaware.com/rattle/), a tool that makes getting started with data analytics and machine learning in R easy. Rattle offers both GUI-based data exploration and modeling by using automatic R code generation.
* Azure SDK in Java, Python, Node.js, Ruby, and PHP.
* Libraries in R and Python to use in Azure Machine Learning and other Azure services.
* Development tools and editors (RStudio, PyCharm, IntelliJ, Emacs, gedit, vi).

Data science involves iterating on a sequence of tasks:

1. Find, load, and pre-process data.
1. Build and test models.
1. Deploy the models for consumption in intelligent applications.

Data scientists use various tools to complete these tasks. It can be time-consuming to find the correct versions of the software, and then download, compile, and install the software.

The Linux DSVM can ease this burden substantially. Use the Linux DSVM to jump-start your analytics project. The Linux DSVM helps you work on tasks in various languages, including R, Python, SQL, Java, and C++. Eclipse provides an easy-to-use IDE for developing and testing your code. The Azure SDK, included in the DSVM, helps you build your applications by using various services on Linux for the Microsoft cloud platform. Other languages are preinstalled, including Ruby, Perl, PHP, and Node.js.

There are no software charges for the DSVM image. You pay only the Azure hardware usage fees that are assessed based on the size of the virtual machine you provision with the DSVM image. For more information about the compute fees, see the [Data Science Virtual Machine for Linux (CentOS) listing](https://azure.microsoft.com/marketplace/partners/microsoft-ads/linux-data-science-vm/) in Azure Marketplace.

## Prerequisites

Before you can create a Linux Data Science Virtual Machine, you must have these prerequisites:

* **Azure subscription**: To get an Azure subscription, see [Create a free Azure account](https://azure.microsoft.com/free/).
* **Azure storage account**: To get an Azure storage account, see [Create a storage account](../../storage/common/storage-quickstart-create-account.md). If you don't want to use an existing Azure storage account, you can create a storage account when you create the DSVM.

## Other versions of the Data Science Virtual Machine

The Data Science Virtual Machine is also available in these versions:

* [Ubuntu](dsvm-ubuntu-intro.md): The Ubuntu image has many of the same tools as the CentOS image, including deep learning frameworks. 
* [Windows](provision-vm.md)

## Create a Linux Data Science Virtual Machine

To create an instance of the Linux DSVM:

1. Go to the virtual machine listing in the [Azure portal](https://portal.azure.com/#create/microsoft-ads.linux-data-science-vmlinuxdsvm).
1. Select **Create** to open the wizard.

   ![The wizard that configures a Data Science Virtual Machine](./media/linux-dsvm-intro/configure-linux-data-science-virtual-machine.png)
1. Enter or select the following information for each step of the wizard:
   
   **1** **Basics**:

      * **Name**: The name of the data science server you're creating.
      * **User name**: The first account sign-in ID.
      * **Password**: The first account password. (You can use an SSH public key instead of a password.)
      * **Subscription**: If you have more than one subscription, select the subscription on which the machine will be created and billed. You must have permissions to create resources for the subscription.
      * **Resource group**: You can create a new resource group or use an existing group.
      * **Location**: Select a datacenter to use for the DSVM. In most cases, select the datacenter that holds most of your data or that's closest to your physical location (for the fastest network access).
   
   **2** **Size**: Select a server type that meets your functional requirement and cost constraints. Select **View All** to see more choices of VM sizes.
   
   
   **3** **Settings**:
      * **Disk type**: If you prefer a solid-state drive (SSD), select **Premium**. Otherwise, select **Standard**.
      * **Storage account**: You can create a new Azure storage account in your subscription or use an existing Azure account in the same location that you selected in the **Basics** step of the wizard.
      * **Other parameters**: In most cases, use the default values to configure other parameters. To see non-default values, hover over the informational link for the parameter.
   
   **4** **Summary**: Verify that the information you entered is correct.
   
   **5** **Buy**: To start the provisioning, select **Buy**. A link to the terms of the transaction is provided. There are no additional charges for the DSVM beyond the compute for the server size you select in **Size**.

Provisioning takes 10-20 minutes. The status of the provisioning is displayed in the Azure portal.

## How to access the Linux Data Science Virtual Machine

After the DSVM is created, you can sign in to it by using SSH. Use the account credentials that you created in the **Basics** section of the wizard for the text shell interface. On Windows, you can download an SSH client tool like [PuTTY](https://www.putty.org). If you prefer a graphical desktop (X Window System), you can use X11 forwarding on PuTTY or install the X2Go client.

> [!NOTE]
> The X2Go client performed better than X11 forwarding in testing. We recommend using the X2Go client for a graphical desktop interface.

## Install and configure the X2Go client

The Linux DSVM is provisioned with X2Go Server and ready to accept client connections. To connect to the Linux DSVM graphical desktop, complete the following procedure on your client:

1. Download and install the X2Go client for your client platform from [X2Go](https://wiki.x2go.org/doku.php/doc:installation:x2goclient).
1. Run the X2Go client. Select **New Session**. A configuration window with multiple tabs opens. Enter the following configuration parameters:
   * **Session tab**:
     * **Host**: Enter the host name or IP address of your Linux DSVM.
     * **Login**: Enter the username on the Linux DSVM.
     * **SSH Port**: Leave the default value, **22**.
     * **Session Type**: Change the value to **XFCE**. Currently, the Linux DSVM supports only the XFCE desktop.
   * **Media** tab: You can turn off sound support and client printing if you don't need to use them.
   * **Shared folders**: If you want directories from your client machines mounted on the Linux DSVM, add the client machine directories that you want to share with the DSVM.

After you sign in to the DSVM by using either the SSH client or the XFCE graphical desktop through the X2Go client, you're ready to begin using the tools that are installed and configured on the DSVM. On XFCE, you can see application menu shortcuts and desktop icons for many of the tools.

## Tools installed on the Linux Data Science Virtual Machine

### Machine Learning Server

R is one of the most popular languages for data analysis and machine learning. If you want to use R for your analytics, the DSVM has Machine Learning Server with Microsoft R Open and Math Kernel Library. Math Kernel Library optimizes common math operations in analytical algorithms. R Open is fully compatible with CRAN R. Any of the R libraries published in CRAN can be installed on R Open. 

You can use Machine Learning Server to scale and operationalize R models into web services. You can edit your R programs in one of the default editors, like RStudio, vi, or Emacs. The Emacs editor is preinstalled on the DSVM. The Emacs ESS (Emacs Speaks Statistics) package simplifies working with R files in the Emacs editor.

To open the R console, in the shell, enter **R**. This command takes you to an interactive environment. To develop your R program, you typically use an editor like Emacs or vi, and then run the scripts in R. RStudio offers a full graphical IDE for developing your R program.

An R script that you can use to install the [top 20 R packages](https://www.kdnuggets.com/2015/06/top-20-r-packages.html) is included in the DSVM. You can run this script when you're in the R interactive interface. As mentioned earlier, to open that interface, in the shell, enter **R**.  

### Python

Anaconda Python is installed with the Python 3.5 and 2.7 environments. The 2.7 environment is called _root_ and the 3.5 environment is called _py35_. This distribution contains the base Python along with about 300 of the most popular math, engineering, and data analytics packages.

The py35 environment is the default. To activate the root (2.7) environment, use this command:

```bash
source activate root
```

To activate the py35 environment again, use this command:

```bash
source activate py35
```

To invoke a Python interactive session, in the shell, enter **python**. 

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

### Jupyter Notebook

The Anaconda distribution also comes with a Jupyter Notebook, an environment to share code and analysis. Access the Jupyter Notebook through JupyterHub. You sign in by using your local Linux username and password.

The Jupyter Notebook server is preconfigured with Python 2, Python 3, and R kernels. Use the **Jupyter Notebook** desktop icon to open the browser and access the Jupyter Notebook server. If you access the DSVM via SSH or the X2Go client, you can also access the Jupyter Notebook server at https:\//localhost:8000/.

> [!NOTE]
> Continue if you get any certificate warnings.

You can access the Jupyter notebook server from any host. Enter **https:\//\<DSVM DNS name or IP address\>:8000/**.

> [!NOTE]
> Port 8000 is opened in the firewall by default when the DSVM is provisioned. 

Microsoft has packaged sample notebooks, one in Python and one in R. You can see the link to the samples on the Jupyter Notebook home page after you authenticate to the Jupyter Notebook by using your local Linux username and password. To create a new notebook, select **New**, and then select the language kernel you want to use. If you don't see the **New** button, select the **Jupyter** icon on the upper left to go to the home page of the notebook server.

### Spark Standalone 

An instance of Spark Standalone mode is preinstalled on the Linux DSVM to help you develop Spark applications locally before you test and deploy them on large clusters. 

You can run PySpark programs through the Jupyter kernel. When you open Jupyter, select the **New** button and you should see a list of available kernels. **Spark - Python** is the PySpark kernel that lets you build Spark applications by using the Python language. You can also use a Python IDE like PyCharm or Spyder to build your Spark program. 

In this standalone instance, the Spark stack runs in the calling client program. This feature makes it faster and easier to troubleshoot issues compared to developing on a Spark cluster.

Jupyter provides a sample PySpark notebook. You can find it in the SparkML directory under the home directory of Jupyter ($HOME/notebooks/SparkML/pySpark). 

If you're programming in R for Spark, you can use Machine Learning Server, SparkR, or sparklyr. 

Before you run in a Spark context in Machine Learning Server, you must do a one-time setup step to enable a local single-node Hadoop HDFS and YARN instance. By default, Hadoop services are installed but disabled on the DSVM. To enable Hadoop services, run the following commands as root the first time:

```bash
echo -e 'y\n' | ssh-keygen -t rsa -P '' -f ~hadoop/.ssh/id_rsa
cat ~hadoop/.ssh/id_rsa.pub >> ~hadoop/.ssh/authorized_keys
chmod 0600 ~hadoop/.ssh/authorized_keys
chown hadoop:hadoop ~hadoop/.ssh/id_rsa
chown hadoop:hadoop ~hadoop/.ssh/id_rsa.pub
chown hadoop:hadoop ~hadoop/.ssh/authorized_keys
systemctl start hadoop-namenode hadoop-datanode hadoop-yarn
```

You can stop the Hadoop-related services when you don't need them by running `systemctl stop hadoop-namenode hadoop-datanode hadoop-yarn`.

The /dsvm/samples/MRS directory provides a sample that demonstrates how to develop and test Machine Learning Server in a remote Spark context (the standalone Spark instance on the DSVM).

### IDEs and editors

You can choose from several code editors, including vi/VIM, Emacs, gedit, PyCharm, RStudio, Eclipse, LaTeX, and IntelliJ. 

* gedit, Eclipse, IntelliJ, R Studio, and PyCharm are graphical editors. To use them, you must be signed in to a graphical desktop. You open them by using desktop and application menu shortcuts.

* Vim and Emacs are text-based editors. On Emacs, the ESS add-on package makes working with R in the Emacs editor easier. You can find more information on the [ESS website](https://ess.r-project.org/).

* Eclipse is an open-source, extensible IDE that supports multiple languages. Eclipse IDE for Java Developers is the version installed on the DSVM. You can install plug-ins for several popular languages to extend the environment. 

  The Azure Toolkit for Eclipse plug-in is installed with Eclipse on the DSVM. You can use Azure Toolkit for Eclipse to create, develop, test, and deploy Azure applications by using the Eclipse development environment that supports languages like Java.

  The Azure SDK for Java is also installed with the Azure Toolkit for Eclipse on the DSVM. The Azure SDK for Java gives you access to different Azure services from inside a Java environment. 
  
  For more information, see [Azure Toolkit for Eclipse](/java/azure/eclipse/azure-toolkit-for-eclipse).

* LaTeX is installed through the texlive package, along with an Emacs add-on package called [AUCTeX](https://www.gnu.org/software/auctex/manual/auctex/auctex.html). This package simplifies authoring your LaTeX documents in Emacs. 

### Databases

The Linux DSVM gives you access to several database and command-line tools.

#### PostgresSQL

The open-source database PostgresSQL is available on the DSVM, with services running and initdb completed. You must create databases and users. For more information, see the [PostgresSQL documentation](https://www.postgresql.org/docs/).  

#### SQuirreL SQL

SQuirreL SQL is a graphical SQL client that can connect to various databases (including SQL Server, PostgresSQL, and MySQL) and run SQL queries. You can run SQuirreL SQL from a graphical desktop session (through the X2Go client, for example) by using a desktop icon. Or you can run the client by using the following command in the shell:

```bash
/usr/local/squirrel-sql-3.7/squirrel-sql.sh	/usr/local/squirrel-sql-3.7/squirrel-sql.sh
```

Before the first use, set up your drivers and database aliases. The JDBC drivers are located at /usr/share/java/jdbcdrivers.

For more information, see [SQuirreL SQL](http://squirrel-sql.sourceforge.net/index.php?page=screenshots).

#### Command-line tools for accessing SQL Server

The ODBC driver package for SQL Server also comes with two command-line tools:

* **bcp**: The bcp tool bulk-copies data between an instance of SQL Server and a data file in a user-specified format. You can use the bcp tool to import large numbers of new rows into SQL Server tables or to export data out of tables into data files. To import data into a table, you must use a format file created for that table. Or, you must understand the structure of the table and the types of data that are valid for its columns.

  For more information, see [Connect with bcp](https://msdn.microsoft.com/library/hh568446.aspx).

* **sqlcmd**: You can use the sqlcmd utility to enter Transact-SQL statements, system procedures, and script files at the command prompt. The sqlcmd utility uses ODBC to execute Transact-SQL batches.

  For more information, see [Connect with sqlcmd](https://msdn.microsoft.com/library/hh568447.aspx).

  > [!NOTE]
  > There are some differences in this tool between Linux and Windows platforms. See the documentation for details.

#### Database access libraries

Libraries for database access are available in R and Python:

* In R, you can use the RODBC package or dplyr package to query or run SQL statements on the database server.
* In Python, the pyodbc library provides database access with ODBC as the underlying layer.

### Azure tools

The following Azure tools are installed on the DSVM:

* **Azure CLI**: You can use the command-line interface in Azure to create and manage Azure resources through shell commands. To open the Azure tools, enter **azure help**. For more information, see the [Azure CLI documentation page](https://docs.microsoft.com/cli/azure/get-started-with-az-cli2).
* **Azure Storage Explorer**: Azure Storage Explorer is a graphical tool that you can use to browse through the objects that you have stored in your Azure storage account, and to upload and download data to and from Azure blobs. You can access Storage Explorer from the desktop shortcut icon. You can also open it from a shell prompt by entering **StorageExplorer**. You must be signed in from an X2Go client or have X11 forwarding set up.
* **Azure libraries**: The following libraries are preinstalled on the DSVM:
  
  * **Python**: The Azure-related libraries in Python are *azure*, *azureml*, *pydocumentdb*, and *pyodbc*. With the first three libraries, you can access Azure storage services, Azure Machine Learning, and Azure Cosmos DB (a NoSQL database on Azure). The fourth library, pyodbc (along with the Microsoft ODBC driver for SQL Server), enables access to SQL Server, Azure SQL Database, and Azure SQL Data Warehouse from Python by using an ODBC interface. Enter **pip list** to see all the listed libraries. Be sure to run this command in both the Python 2.7 and 3.5 environments.
  * **R**: The Azure-related libraries in R are AzureML and RODBC.
  * **Java**: The list of Azure Java libraries can be found in the directory /dsvm/sdk/AzureSDKJava on the DSVM. The key libraries are Azure storage and management APIs, Azure Cosmos DB, and JDBC drivers for SQL Server.  

You can access the [Azure portal](https://portal.azure.com) from the preinstalled Firefox browser. In the Azure portal, you can create, manage, and monitor Azure resources.

### Azure Machine Learning

Azure Machine Learning is a fully managed cloud service that you can use to build, deploy, and share predictive analytics solutions. You build your experiments and models from Azure Machine Learning Studio. To access Azure Machine Learning from a web browser on the DSVM, go to [Microsoft Azure Machine Learning](https://studio.azureml.net).

After you sign in to Azure Machine Learning Studio, you can use an experimentation canvas to build a logical flow for the machine learning algorithms. You also have access to a Jupyter Notebook that's hosted on Azure Machine Learning. The notebook can work seamlessly with the experiments in Machine Learning Studio. 

Operationalize the machine learning models that you build by wrapping them in a web service interface. Operationalizing machine learning models enables clients written in any language to invoke predictions from those models. For more information, see the [Machine Learning documentation](https://azure.microsoft.com/documentation/services/machine-learning/).

You can also build your models in R or Python on the DSVM, and then deploy them in production on Azure Machine Learning. Microsoft has installed libraries in R (**AzureML**) and Python (**azureml**) to support this functionality.

For information about how to deploy models in R and Python to Azure Machine Learning, see [Ten things you can do on the Data Science Virtual Machine](vm-do-ten-things.md).

> [!NOTE]
> The instructions in [Ten things you can do on the Data Science Virtual Machine](vm-do-ten-things.md) were written for the Windows version of the DSVM. However, the information about deploying models to Azure Machine Learning also applies to the Linux DSVM.

### Machine learning tools

The DSVM comes with a few machine learning tools and algorithms that are precompiled and preinstalled locally. These include:

* **Microsoft Cognitive Toolkit**: A deep learning toolkit.
* **Vowpal Wabbit**: A fast online learning algorithm.
* **XGBoost**: A tool that provides optimized, boosted tree algorithms.
* **Python**: Anaconda Python comes bundled with machine learning algorithms with libraries like Scikit-learn. You can install other libraries by using the `pip install` command.
* **R**: A rich library of machine learning functions is available for R. Preinstalled libraries include lm, glm, randomForest, and rpart. You can install other libraries by running `install.packages(<lib name>)`.

Microsoft Cognitive Toolkit, Vowpal Wabbit, and XGBoost are discussed in more detail in the next sections.

#### Microsoft Cognitive Toolkit

Microsoft Cognitive Toolkit is an open-source deep learning toolkit. It's a command-line tool (CNTK) and is already in the PATH.

To run a basic sample, run the following commands in the shell:

```bash
cd /home/[USERNAME]/notebooks/CNTK/HelloWorld-LogisticRegression
cntk configFile=lr_bs.cntk makeMode=false command=Train
```

For more information, see the [GitHub CNTK repository](https://github.com/Microsoft/CNTK) and the [CNTK wiki](https://github.com/Microsoft/CNTK/wiki).

#### Vowpal Wabbit

Vowpal Wabbit is a machine learning system that uses techniques like online, hashing, allreduce, reductions, learning2search, active, and interactive learning.

To run the tool on a basic example, run the following commands:

```bash
cp -r /dsvm/tools/VowpalWabbit/demo vwdemo
cd vwdemo
vw house_dataset
```

The Vowpal Wabbit demo directory includes other, larger demos. For more information about Vowpal Wabbit, see the [GitHub Vowpal Wabbit repository](https://github.com/JohnLangford/vowpal_wabbit) and the [Vowpal Wabbit wiki](https://github.com/JohnLangford/vowpal_wabbit/wiki).

#### XGBoost

The XGBoost library is designed and optimized for boosted (tree) algorithms. The objective of the XGBoost library is to push the computation limits of machines to the extremes needed to provide large-scale tree boosting that is scalable, portable, and accurate.

XGBoost is provided as a command line and as an R library.

To use the XGBoost library in R, start an interactive R session (in the shell, enter **R**), and then load the library.

Here's a simple example you can run at the R prompt:

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

To run the XGBoost command line, run these commands in the shell:

```bash
cp -r /dsvm/tools/xgboost/demo/binary_classification/ xgboostdemo
cd xgboostdemo
xgboost mushroom.conf
```

A .model file is written to the specified directory. For information about this demo example on GitHub, see [Binary Classification](https://github.com/dmlc/xgboost/tree/master/demo/binary_classification).

For more information about XGBoost, see the [XGBoost documentation](https://xgboost.readthedocs.org/en/latest/) and the [XGBoost GitHub repository](https://github.com/dmlc/xgboost).

#### Rattle

Rattle (*R* *A*nalytical *T*ool *T*o *L*earn *E*asily) uses GUI-based data exploration and modeling. Rattle:
- Presents statistical and visual summaries of data.
- Transforms data that can be readily modeled.
- Builds both unsupervised and supervised models from data.
- Presents the performance of models graphically.
- Scores new data sets.
- Generates R code.
- Replicates operations in the UI that can be run directly in R or used as a starting point for more analysis.

To run Rattle, you must be signed in to a graphical desktop session. In a terminal, enter **R** to open the R environment. At the R prompt, enter the following commands:

```R
library(rattle)
rattle()
```

A graphical interface that has a set of tabs opens. Use the following quickstart steps in Rattle to use a sample weather data set and build a model. In some of the steps, you're prompted to automatically install and load some required R packages that are not already on the system.

> [!NOTE]
> If you don't have permissions to install the package in the system directory (the default), you might see a prompt on your R console window to install packages to your personal library. If you see these prompts, enter **y**.

1. Select **Execute**.
1. A dialog box prompts you to load the example weather data set. Select **Yes** to load the example.
1. Select the **Model** tab.
1. Select **Execute** to build a decision tree.
1. Select **Draw** to display the decision tree.
1. Select the **Forest** option, and then select **Execute** to build a random forest.
1. Select the **Evaluate** tab.
1. Select the **Risk** option, and then select **Execute** to display two **Risk (Cumulative)** performance plots.
1. Select the **Log** tab to show the generated R code for the preceding operations. (Because of a bug in the current release of Rattle, you must insert a **#** character in front of **Export this log** in the text of the log.)
1. Select the **Export** button to save the R script file named *weather_script.R* to the home folder.

You can exit Rattle and R. Now you can modify the generated R script. Or, use the script as it is, and run it anytime to repeat everything that was done in the Rattle UI. Especially for beginners in R, this is a way to quickly do analysis and machine learning in a simple graphical interface, while automatically generating code in R to modify or for learning.

## Next steps

Here's how you can continue your learning and exploration:

* The walkthrough [Data science on the Data Science Virtual Machine for Linux](linux-dsvm-walkthrough.md) shows you how to do several common data science tasks with the Linux DSVM provisioned here. 
* Explore the various data science tools on the DSVM by trying out the tools described in this article. You can also run `dsvm-more-info` in the shell in the virtual machine for a basic introduction and for pointers to more information about the tools installed on the DSVM.  
* Learn how to build end-to-end analytical solutions systematically by using the [Team Data Science Process](https://aka.ms/tdsp).
* Visit the [Azure AI Gallery](https://gallery.azure.ai/) for machine learning and data analytics samples that use the Azure AI services.