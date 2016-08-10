<properties
	pageTitle="Provision the Linux Data Science Virtual Machine | Microsoft Azure"
	description="Configure and create a Linux Data Science Virtual Machine on Azure to do analytics and machine learning."
	services="machine-learning"
	documentationCenter=""
	authors="bradsev"
	manager="paulettm"
	editor="cgronlun"  />

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/10/2016"
	ms.author="gokuma;bradsev" />

# Provision the Linux Data Science Virtual Machine 

The Linux Data Science Virtual Machine is an Azure virtual machine (VM) image that is pre-installed and configured with a collection of tools that are commonly used for doing data analytics and machine learning. The key software components included are:

- Microsoft R Open
- Anaconda Python distribution (v 2.7 and v3.5), including popular data analysis libraries
- Jupyter Notebook (R, Python)
- Azure Storage Explorer
- Azure Command Line for managing Azure resources
- PostgresSQL Database
- Machine learning Tools
    - [Computational Network Toolkit (CNTK)](https://github.com/Microsoft/CNTK): a deep learning software from Microsoft Research
    - [Vowpal Wabbit](https://github.com/JohnLangford/vowpal_wabbit): a fast machine learning system supporting techniques such as online, hashing, allreduce, reductions, learning2search, active, and interactive learning.
    - [XGBoost](https://xgboost.readthedocs.org/en/latest/): a tool providing fast and accurate boosted tree implementation
    - [Rattle](http://rattle.togaware.com/) (the R Analytical Tool To Learn Easily) : Tool that makes getting started with data analytics and machine learning in R very easy with a GUI based data exploration and modeling with automatic R code generation. 
- Azure SDK in Java, Python, node.js, Ruby, PHP
- Libraries in R and Python for use in Azure Machine Learning and other Azure services
- Development tools and editors (Eclipse, Emacs, gedit, vi)

Doing data science involves iterating on a sequence of tasks: 

- finding, loading, and pre-processing data 
- building and testing models 
- deploying the models for consumption in intelligent applications 

It is not uncommon for data scientists to use a variety of tools to to complete these tasks. It can be quite time consuming to find the appropriate versions of the software, and then to download, compile and install these versions. 

The Linux Data Science Virtual Machine can ease this burden substantially. Use it to jump start your analytics project. It enables you to work on tasks in a variety of languages including R, Python, SQL, Java, and C++. Eclipse provides an IDE to develop and test your code that is easy to use. The Azure SDK included in the VM allows you to build your applications using various services on Linux for Microsoft’s cloud platform. In addition, you have access to other languages like Ruby, Perl, PHP, and node.js that are also pre-installed. 

There are no software charges for this data science VM image. You only pay for the Azure hardware usage fees which are assessed based on the size of the virtual machine that you provision with the VM image. More details on the compute fees can be found [here](https://azure.microsoft.com/marketplace/partners/microsoft-ads/linuxdsvm/). 


## Prerequisites

Before you can create a Linux Data Science Virtual Machine, you must have the following:

- **An Azure subscription**: To obtain one, see [Get Azure free trial](https://azure.microsoft.com/free/).
- **An Azure storage account**: To create one, see [Create an Azure storage account](storage-create-storage-account.md#create-a-storage-account) Alternatively, the storage account can be created as part of the process of creating the VM if you do not want to use an existing account.


## Create your Linux Data Science Virtual Machine

Here are the steps to create an instance of the Linux Data Science Virtual Machine:

1.	Navigate to the virtual machine listing on the [Azure Portal](https://portal.azure.com/#create/microsoft-ads.linux-data-science-vmlinuxdsvm).
2.	 Click on the **Create** button at the bottom to be taken into a wizard.![configure-data-science-vm](./media/machine-learning-data-science-linux-dsvm-intro/configure-linux-data-science-virtual-machine.png)
3.	 The following sections provide the **inputs** for each of the **5 steps** (enumerated on the right of the figure above) in the wizard used to create the Microsoft Data Science Virtual Machine. Here are the inputs needed to configure each of these steps:


  **a. Basics**: 

   - **Name**: Name of your data science server you are creating.
   - **User Name**: First account login id
   - **Password**: First account password (You can use SSH public key instead of password)
   - **Subscription**: If you have more than one subscription, select the one on which the machine will be created and billed. NOTE: You must have resource creation privileges on this subscription. 
   - **Resource Group**: You can create a new one or use an existing group
   - **Location**: Select the data center that is most appropriate. Usually it is the data center that has most of your data or is closest to your physical location for fastest network access

  **b. Size**: 

   - Select one of the server types that meets your functional requirement and cost constraints. You can get more choices of VM sizes by selecting “View All”

  **c. Settings**

   - **Disk Type**: Choose Premium if you prefer a solid state drive (SSD), else choose “Standard”.
   - **Storage Account**: You can create a new Azure storage account in your subscription or use an existing one in the same *Location* that was chosen on the Basics step of the wizard.
   - **Other parameters**: In most cases you will just use the default values. You can hover over the informational link for help on the specific fields in case you want to consider the use of non-default values. 

  **d. Summary**: 

   - Verify that all information you entered is correct.

  **e. Buy**: 

   - Click on **Buy** to start the provisioning. A link is provided to the terms of the transaction. The VM does not have any additional charges beyond the compute for the server size you chose in the **Size** step. 


The provisioning should take about 10-20 minutes. The status of the provisioning is displayed on the Azure Portal.

## How to access the Linux Data Science Virtual Machine

Once the VM is created you can login into it using SSH with the account credentials you created in the Basics section of step 3 for the text shell interface. On windows, you can download an SSH client tool like [Putty](http://www.putty.org). If you prefer a graphical desktop (X Windows System), you can use X11 forwarding on Putty or install the X2Go client. 

>[AZURE.NOTE] The X2go client performed significantly better than X11 forwarding in testing. So we recommend using the X2Go client for graphical desktop interface. 


## Installing and configuring X2Go client

The Linux VM is already provisioned with X2Go server and ready to accept client connections. To connect to the Linux VM graphical desktop, you need to do the following on your client. 

1. Download and install the X2Go client for your client platform from [here](http://wiki.x2go.org/doku.php/doc:installation:x2goclient).    
2. Run the X2Go client and select "*New Session*". It will open a configuration window with multiple tabs. Enter the following configuration parameters: 
    * **Session tab**:
        - **Host**: The host name or IP address of your Linux Data science VM.
        - **Login**: Login username on the Linux VM.
        - **SSH Port**: Leave it at 22, the default value.
        - **Session Type**: Change the value to XFCE. NOTE: Currently the Linux VM only supports XFCE desktop.
    * **Media tab**: You can turn off sound support and client printing if you don't need to use them. 
    * **Shared folders**: If you want directories from your client machines mounted on the Linux VM, add the client machine directories that you want to share with the VM on this tab. 

Once you login to the VM using either the SSH client OR XFCE graphical desktop through X2Go client, you are ready to start using the tools that are installed and configured on the VM. On XFCE you can see applications menu shortcuts and desktop icons for many of the tools. 


## Tools installed on the Linux Data Science Virtual Machine

### Microsoft R Open 
R is one of the most popular language for data analysis and machine learning. If you wish to use R for your analytics, the VM has Microsoft R Open (MRO) with the Math Kernel Library (MKL). The MKL optimizes math operations common in analytical algorithms. MRO is 100% compatible with CRAN-R and any of the R libraries published in CRAN can be installed on the MRO. You can edit your R programs in one of the default editors like vi, Emacs or gedit. You are also able to download and use other IDEs as well such as [RStudio](http://www.rstudio.com). For your convenience, a simple script (installRStudio.sh) is provided in the **/dsvm/tools** directory that installs RStudio. If you are using the Emacs editor, note that the Emacs package ESS (Emacs Speaks Statistics), which simplifies working with R files within Emacs editor, has been pre-installed. 

To launch R, you just type ***R*** in the shell. This takes you to an interactive environment. To develop your R program you will typically use an editor like Emacs or vi or gedit and then run the scripts within R. If you install RStudio you will have a full graphical IDE environment to develop your R program. 

There is also a R script for you to install the [Top 20 R packages](http://www.kdnuggets.com/2015/06/top-20-r-packages.html) if you want. This script can be run once you are in the R interactive interface, which can be entered (as mentioned) by typing R in the shell.  

### Python
For development using Python, Anaconda Python distribution 2.7 and 3.5 has been installed. This distribution contains the base Python along with about 300 of the most popular math, engineering and data analytics packages. You can use the default text editors. In addition you can use Spyder a Python IDE that is bundled with Anaconda Python distributions. Spyder needs a graphical desktop or X11 forwarding. A shortcut to Spyder is provided in the graphical desktop. 

Since we have both Python 2.7 and 3.5, you need to specifically activate the desired Python version you want to work on in the current session. The activation process sets the PATH variable to the desired version of Python. 

To activate Python 2.7 run the following from the shell:

	source /anaconda/bin/activate root

Python 2.7 is installed at */anaconda/bin*. 

To activate Python 3.5 run the following from the shell:

	source /anaconda/bin/activate py35


Python 3.5 is installed at */anaconda/envs/py35/bin*

Now to invoke python interactive session just type ***python*** in the shell. If you are on a graphical interface or have X11 forwarding setup, you can type ***spyder*** command to launch the Python IDE. 

### Jupyter Notebook 

The Anaconda distribution also comes with an Jupyter notebook, an environment to share code and analysis. The Jupyter Notebook is accessed through JupyterHub. You log in using your local Linux username and password. The JypyterHub needs to be configured.

The Jupyter notebook server has been pre-configured with Python 2, Python 3 and R kernels. There is a desktop icon named "Jupyter Notebook to launch the browser to access the Notebook server. If you are on the VM via SSH or X2go client you can also visit [https://localhost:8000/](https://localhost:8000/) to access the Jupyter notebook server.

>[AZURE.NOTE] Continue if you get any certificate warnings. 

You can access the Jupyter notebook server from any host. Just type in "https://\<VM DNS name or IP Address\>:8000/". 

>[AZURE.NOTE] Port 8000 is opened in the firewall by default when the VM is provisioned.

We have packaged a few sample notebooks - one in Python and one in R. You can see the link to the samples on the notebook home page after you authenticate to the Jupyter notebook using your local Linux username and password. You can create a new notebook by selecting "New" and then the language kernel. If you don't see the "New" button, click on the Jupyter icon on the top left to go to the home page of the notebook server. 


### IDEs and Editors 

You have a choice of several code editors. This includes vi/VIM, Emacs, gEdit and Eclipse. gEdit and Eclipse are graphical editors and need you to be logged into a graphical desktop to use them. These editors have desktop and application menu shortcuts to launch them. 

**VIM** and **Emacs** are text based editors. On Emacs, we have installed an add-on package called Emacs Speaks Statistics (ESS) that makes working with R easier within the Emacs editor. More information can be found at: [ESS](http://ess.r-project.org/). 

**Eclipse** is an open source, extensible IDE that supports multiple languages. The Java developers edition is the instance installed on the VM. There are plugins available for several popular languages which can be installed to extend the Eclipse environment. We also have a plugin installed in Eclipse called **Azure Toolkit for Eclipse** which allows you to easily create, develop, test, and deploy Azure applications using the Eclipse development environment that supports languages like Java. There is also an **Azure SDK for Java** that allows access to different Azure services from within a Java environment. More information on Azure toolkit for Eclipse can be found at [Azure Toolkit for Eclipse](../azure-toolkit-for-eclipse.md).

**LaTex** is installed through the texlive package along with an Emacs add-on [auctex](https://www.gnu.org/software/auctex/manual/auctex/auctex.html) package, which simplifies authoring your LaTex documents within Emacs.  

### Databases

#### Postgres
The open source database **Postgres** is available on the VM with the services running and initdb already completed. You still need to create databases and users. Please refer to Postgres documentation.  

####  Graphical SQL Client
**SQuirrel SQL**, graphical SQL client, has been provided to connect to  different databases (Microsoft SQL Server, Postgres, MySQL etc) and to run SQL queries. You can run this from a graphical desktop session (using the X2Go client, for example). To invoke SQuirrel SQL you can either launch it from the icon on the desktop or run the following command on the shell. 

	/usr/local/squirrel-sql-3.7/squirrel-sql.sh 

Before the first use, you need to setup your drivers and database aliases. The JDBC drivers are located at:

*/usr/share/java/jdbcdrivers*

More information on SQuirrel SQL can be found on their website: [SQuirrel SQL](http://squirrel-sql.sourceforge.net/index.php?page=screenshots).

#### Command Line tools for accessing Microsoft SQL Server

The ODBC driver package for Microsoft SQL Server also comes with two command line tools:

**bcp** - The bcp utility bulk copies data between an instance of Microsoft SQL Server and a data file in a user-specified format. The bcp utility can be used to import large numbers of new rows into SQL Server tables or to export data out of tables into data files. To import data into a table, you must either use a format file created for that table or understand the structure of the table and the types of data that are valid for its columns. 

More information can be found at [Connecting with bcp](https://msdn.microsoft.com/library/hh568446.aspx).

**sqlcmd** - The sqlcmd utility lets you enter Transact-SQL statements, system procedures, and script files at the command prompt. This utility uses ODBC to execute Transact-SQL batches.

More information can be found at [Connecting with sqlcmd](https://msdn.microsoft.com/library/hh568447.aspx)

>[AZURE.NOTE] There are some differences in this utility between Linux and Windows platform. Please see the documentation page above for details. 


#### Database Access Libraries

There are libraries available in Python and R to access databases. 

- In R, the **RODBC** package or **dplyr** package allows you to query or execute SQL statements on the database server. 
- In Python, the **pyodbc** library provides database access with ODBC as the underlying layer.  

To access **Postgres**:

- from Python: use the **psycopg2** library. 
- from R: use the package **RPostgreSQL**.


### Azure tools 
The following Azure tools are installed on the VM:

- **Azure Command Line Interface**: Azure Command Line Interface (CLI) allows you to create and manage Azure resources through shell commands. To invoke the Azure tools just type ***azure help***. For more information, please refer to the [Azure CLI documentation page](../virtual-machines-command-line-tools.md).
- **Microsoft Azure Storage Explorer**: The Microsoft Azure Storage Explorer is a graphical tool used to browse through the objects that you have stored in your Azure Storage Account, and to upload/download data to and from Azure blobs. You can access the Storage Explorer from desktop shortcut icon. You can invoke it from a shell prompt by typing ***StorageExplorer***. You need to be logged in from an X2go client or have X11 forwarding setup. 
- **Azure Libraries**: The following are the some of the libraries  that have been installed and so are available for you:
- **Python**: The Azure related libraries in Python that are installed are ***azure***, ***azureml***, ***pydocumentdb***, ***pyodbc***. The first three libraries allow you to access Azure storage services, Azure Machine Learning, and Azure DocumentDB (a NoSQL database on Azure). The fourth library, pyodbc (along with Microsoft ODBC driver for SQL Server), enables access to Microsoft SQL Server, Azure SQL Database and Azure SQL Datawarehouse from Python using an ODBC interface. Please enter ***pip list*** to see all the listed library. Be sure to run this command in both Python 2.7 and 3.5 environment. 
- **R**: The Azure related libraries in R that are installed are ***AzureML*** and ***RODBC***. 
- **Java**: The list of Azure Java libraries can be found in the directory ***/dsvm/sdk/AzureSDKJava*** on the VM. The key libraries are Azure storage and management APIs, DocumentDB, and JDBC drivers for SQL Server.  

You can access the [Azure portal](https://portal.azure.com) from the pre-installed Firefox browser. On the Azure portal, you can create, manage and monitor Azure resources. 

### Azure Machine Learning

Azure Machine Learning (Azure ML) is a fully managed cloud service that enables you to build, deploy, and share predictive analytics solutions. You build your experiments and models from the Azure Machine Learning Studio. It can be accessed from a web browser on the data science virtual machine by visiting [Microsoft Azure Machine Learning](https://studio.azureml.net).

Once you login to the Azure Machine Learning Studio, you will have access to an experimentation canvas where you can build your a logical flow for the machine leaning algorithms. You also have access to a Jupyter Notebook hosted on Azure ML and can work seamlessly with the experiments in the Studio. Azure ML lets you operationalize the ML models that you have build by wrapping them in a web service interface. This enables clients written in any language to invoke predictions from the ML models. You can find more information about Azure ML on [Machine Learning documentation](https://azure.microsoft.com/documentation/services/machine-learning/).

You can also build your models in R or Python on the VM and then deploy it in production on Azure ML. We have installed libraries in R and Python to enable this functionality.

- The library in R is called ***AzureML***. 
- In Python it is called ***azureml***. 

For information on how to deploy models in R and Python into Azure ML please refer to the *Build models using R or Python and Operationalize them using Azure Machine Learning* section of [Ten things you can do on the Data science Virtual Machine](machine-learning-data-science-vm-do-ten-things.md).
 
>[AZURE.NOTE] These instructions were written for the Windows version of the Data Science VM, but the information provided there on deploying models to Azure ML is applicable to the Linux VM too.

### Machine Learning Tools

The VM comes with a few ML tools/algorithms that have been pre-compiled and pre-installed locally. These include:

* **CNTK** (Computational Network Toolkit from Microsoft Research) - A deep learning toolkit
* **Vowpal Wabbit** - A fast online learning algorithm
* **xgboost** - A tool which provides optimized,  boosted tree algorithms
* **Python** -  Anaconda Python comes bundled with ML algorithms with libraries like Scikit-learn. You can install other libraries running pip install
* **R** - A rich library of ML functions are available for R. Some of the libraries that are pre-installed are lm, glm, randomForest, rpart. Other libraries can be installed by running 

		install.packages(<lib name>)

Here is some additional information about the first three ML tools in the list. 

#### CNTK
This is an open source, deep learning toolkit. It is a command line tool (cntk) and is already in the PATH. 

To run a basic sample do the following in shell:

	# Copy samples to your home directory and execute cntk
	cp -r /dsvm/tools/CNTK-2016-02-08-Linux-64bit-CPU-Only/Examples/Other/Simple2d cntkdemo 
	cd cntkdemo/Data
	cntk configFile=../Config/Simple.cntk

You will find the model output in *~/cntkdemo/Output/Models*

More information on CNTK can be found on [github.com/Microsoft/CNTK](https://github.com/Microsoft/CNTK) and in the [CNTK wiki](https://github.com/Microsoft/CNTK/wiki).


#### Vowpal Wabbit(VW):

Vowpal Wabbit is a machine learning system which pushes the frontier of machine learning using techniques such as online, hashing, allreduce, reductions, learning2search, active, and interactive learning.

To run the tool on a very basic example do the following: 

	cp -r /dsvm/tools/VowpalWabbit/demo vwdemo
	cd vwdemo
	vw house_dataset

There are other larger demos in that directory. More information on VW can be found at [github.com/JohnLangford/vowpal_wabbit](https://github.com/JohnLangford/vowpal_wabbit) and on the [Vowpal Wabbit wiki](https://github.com/JohnLangford/vowpal_wabbit/wiki).

#### xgboost
This is a library that is designed and optimized for boosted (tree) algorithms. The objective of this library is to push the the computation limits of machines to the extremes needed to provide large scale tree boosting that is scalable, portable and accurate.

It is provided as a command line as well as a R library. 

To use this library in R, you can start interactive R session ( just by typing *R* in the shell) and loading the library.

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


A .model file is written to the directory specified. Information about this demo example can be found [here](https://github.com/dmlc/xgboost/tree/master/demo/binary_classification). 

More Information on xgboost is found on the [xgboost documentation page](https://xgboost.readthedocs.org/en/latest/) and in its [Github repository](https://github.com/dmlc/xgboost).

#### Rattle
Rattle (the R Analytical Tool To Learn Easily) makes getting started with data mining in R very easy with a GUI based data exploration and modeling. It presents statistical and visual summaries of data, transforms data that can be readily modelled, builds both unsupervised and supervised models from the data, presents the performance of models graphically, and scores new datasets. It also generate R code replicating the operations in the UI that can be run directly in R OR used as a starting point for further analysis. 

To run rattle, you need to be on a graphical desktop login session. On the terminal, type ```R``` to enter the R environment. On the R prompt enter the following commands:

	library(rattle)
	rattle()
	
Now, a graphical interface will open up with a set of tabs. Here is a quick start steps in rattle to use a sample weather dataset and building a model. In some of the steps below it will prompt to automatically install and load any required R packages that are not already on the system. **NOTE**: You may see prompt on your R console window whether to install packages to your personal library if you dont have access to install the package in the system directory (the default). Answer "y" if you see these prompts. 

1. Click Execute
2. A dialog will pop up asking you if you like to use the example weather dataset. Click Yes to load the example
3. Click the Model tab
4. Click Execute to build a decision tree
5. Click Draw to display the decision tree 
6. Click the Forest radio button and click Execute to build a random forest 
7. Click the Evaluate tab
8. Click the Risk radio button and Click Execute to display two Risk (Cummulative) performance plots
9. Click the Log tab to show the generate R code for the above operations
(Note: There is a bug in current release of rattle - please insert '# ' in front of 'Export this log ...' in the text of the log.)
10. Click the Export button to save R script to file weather_script.R to home folder

You can exit Rattle and R. Now you can  modify the generated R script or use it as it is to run it anytime to repeat everything that was done within the Rattle UI. This is an easy way especially for beginners in R to quickly do analysis and machine learning in a simple graphical interface while automatically generating code in R to modify and/or learn. 


## Next Steps
Here are some next steps to continue your learning and exploration. 

* Explore the various data science tools on the data science VM by trying out the tools described in this article. You can also run *dsvm-more-info* on the shell within the virtual machine for a basic introduction and pointers to more information on the tools installed on the VM.  
* Learn how to build end to end analytical solutions systematically using the [Team Data Science Process](https://azure.microsoft.com/documentation/learning-paths/cortana-analytics-process/)
* Visit the [Cortana Analytics Gallery](http://gallery.cortanaanalytics.com) for machine learning and data analytics samples using the Cortana Analytics Suite. 

