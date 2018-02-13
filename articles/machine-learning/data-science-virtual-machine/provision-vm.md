---
title: Provision the Windows Data Science Virtual Machine on Azure | Microsoft Docs
description: Configure and create a Data Science Virtual Machine on Azure for analytics and machine learning.
services: machine-learning
documentationcenter: ''
author: bradsev
manager: cgronlun
editor: cgronlun

ms.assetid: e1467c0f-497b-48f7-96a0-7f806a7bec0b
ms.service: machine-learning
ms.workload: data-services
ms.devlang: na
ms.topic: article
ms.date: 09/10/2017
ms.author: bradsev

---
# Provision the Windows Data Science Virtual Machine on Azure
The Microsoft Data Science Virtual Machine is a Windows Azure virtual machine (VM) image pre-installed and configured with several popular tools that are commonly used for data analytics and machine learning. The tools included are:

* [Azure Machine Learning](../preview/index.yml) Workbench
* [Microsoft Machine Learning Server](https://docs.microsoft.com/machine-learning-server/index) Developer Edition
* Anaconda Python distribution
* Jupyter notebook (with R, Python, PySpark kernels)
* Visual Studio Community Edition
* Power BI desktop
* SQL Server 2017 Developer Edition
* Standalone Spark instance for local development and testing
* [JuliaPro](https://juliacomputing.com/products/juliapro.html)
* Machine learning and Data Analytics tools
  * Deep Learning Frameworks: A rich set of AI frameworks including [Microsoft Cognitive Toolkit](https://www.microsoft.com/en-us/cognitive-toolkit/), [TensorFlow](https://www.tensorflow.org/), [Chainer](https://chainer.org/), mxNet, Keras are included on the VM.
  * [Vowpal Wabbit](https://github.com/JohnLangford/vowpal_wabbit): A fast machine learning system supporting techniques such as online, hashing, allreduce, reductions, learning2search, active, and interactive learning.
  * [XGBoost](https://xgboost.readthedocs.org/en/latest/): A tool providing fast and accurate boosted tree implementation.
  * [Rattle](http://rattle.togaware.com/) (the R Analytical Tool To Learn Easily): A tool that makes getting started with data analytics and machine learning in R easy. It includes GUI-based data exploration and modeling with automatic R code generation.
  * [Weka](http://www.cs.waikato.ac.nz/ml/weka/) : A visual data mining and machine learning software in Java.
  * [Apache Drill](https://drill.apache.org/): A schema-free SQL Query Engine for Hadoop, NoSQL, and Cloud Storage.  Supports ODBC and JDBC interfaces to enable querying NoSQL and files from standard BI tools like PowerBI, Excel, Tableau.
* Libraries in R and Python for use in Azure Machine Learning and other Azure services
* Git including Git Bash to work with source code repositories including GitHub, Visual Studio Team Services
* Windows ports of several popular Linux command-line utilities (including awk, sed, perl, grep, find, wget, curl, etc.) accessible through command prompt. 

Doing data science involves iterating on a sequence of tasks:

1. Finding, loading, and pre-processing data
2. Building and testing models
3. Deploying the models for consumption in intelligent applications

Data scientists use a variety of tools to complete these tasks. It can be quite time consuming to find the appropriate versions of the software, and then download and install them. The Microsoft Data Science Virtual Machine can ease this burden by providing a ready-to-use image that can be provisioned on Azure with all several popular tools pre-installed and configured. 

The Microsoft Data Science Virtual Machine jump-starts your analytics project. It enables you to work on tasks in various languages including R, Python, SQL, and C#. Visual Studio provides an IDE to develop and test your code that is easy to use. The Azure SDK included in the VM allows you to build your applications using various services on Microsoft’s cloud platform. 

There are no software charges for this data science VM image. You only pay for the Azure usage fees which dependent on the size of the virtual machine you provision. More details on the compute fees can be found in the Pricing details section on the [Data Science Virtual Machine](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-ads.windows-data-science-vm?tab=PlansAndPrice) page. 

## Other Versions of the Data Science Virtual Machine
An [Ubuntu](dsvm-ubuntu-intro.md) image is available as well, with many similar tools plus a few additional deep learning frameworks. A [CentOS](linux-dsvm-intro.md) image is also available. We also offer a [Windows Server 2012 edition](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-ads.standard-data-science-vm) of the data science virtual machine though a few tools are only available on the Windows Server 2016 edition.  Otherwise, this article also applies to the Windows Server 2012 edition.

## Prerequisites
Before you can create a Microsoft Data Science Virtual Machine, you must have the following:

* **An Azure subscription**: To obtain one, see [Get Azure free trial](http://azure.com/free).


## Create your Microsoft Data Science Virtual Machine
To create an instance of the Microsoft Data Science Virtual Machine, follow these steps:

1. Navigate to the virtual machine listing on [Azure portal](https://portal.azure.com/#create/microsoft-ads.windows-data-science-vmwindows2016).
2. Select the **Create** button at the bottom to be taken into a wizard.![configure-data-science-vm](./media/provision-vm/configure-data-science-virtual-machine.png)
3. The wizard used to create the Microsoft Data Science Virtual Machine requires **inputs** for each of the **four steps** enumerated on the right of this figure. Here are the inputs needed to configure each of these steps:
   
   1. **Basics**
      
      1. **Name**: Name of your data science server you are creating.
      2. **VM Disk Type**: Choose between SSD or HDD. For GPU (NC-Series), choose **HDD** as the disk type. 
      3. **User Name**: Admin account login id.
      4. **Password**: Admin account password.
      5. **Subscription**: If you have more than one subscription, select the one on which the machine is to be created and billed.
      6. **Resource Group**: You can create a new one or use an existing group.
      7. **Location**: Select the data center that is most appropriate. Usually it is the data center that has most of your data or is closest to your physical location for fastest network access.
   2. **Size**: Select one of the server types that meets your functional requirement and cost constraints. You can get more choices of VM sizes by selecting “View All”.
   3. **Settings**:
      
      1. **Use Managed Disks**: Choose Managed if you want Azure to manage the disks for the VM.  Otherwise you need to specify a new or existing storage account. 
      2. **Other parameters**: Usually you just use the default values. If you want to consider using non-default values, hover over the informational link for help on the specific fields.
    a. **Summary**: Verify that all information you entered is correct and click **Create**. **NOTE**: The VM does not have any additional charges beyond the compute for the server size you chose in the **Size** step. 

> [!NOTE]
> The provisioning should take about 10-20 minutes. The status of the provisioning is displayed on the Azure portal.
> 
> 

## How to access the Microsoft Data Science Virtual Machine
Once the VM is created, you can remote desktop into it using the Admin account credentials that you configured in the preceding **Basics** section. 

Once your VM is created and provisioned, you are ready to start using the tools that are installed and configured on it. There are start menu tiles and desktop icons for many of the tools. 


## Tools installed on the Microsoft Data Science Virtual Machine

### Azure Machine Learning Workbench

Azure Machine Learning Workbench is a desktop application and command-line interface. The Workbench has built-in data preparation that learns your data preparation steps as you perform them. It also provides project management, run history, and notebook integration to bolster your productivity. You can take advantage of the best open-source frameworks, including TensorFlow, Cognitive Toolkit, Spark ML, and scikit-learn to develop your models. On the DSVM, we provide a desktop icon (InstallAMLFromLocal) to locally extract the Azure Machine Learning workbench into each user's %LOCALAPPDATA% directory. Each user that needs to use the Workbench needs to do a one time action of double-clicking the InstallAMLFromLocal desktop icon to install their instance of the Workbench. Azure Machine Learning also creates and uses a per-user Python environment that is extracted in the %LOCALAPPDATA%\amlworkbench\python.

### Microsoft ML Server Developer Edition
If you wish to use Microsoft enterprise libraries for scalable R or Python for your analytics, the VM has Microsoft ML Server Developer edition (Previously known as Microsoft R Server) installed. Microsoft ML Server is a broadly deployable enterprise-class analytics platform available for both R and Python and is  scalable, commercially supported and secure. Supporting a variety of big data statistics, predictive modeling and machine learning capabilities, ML Server supports the full range of analytics – exploration, analysis, visualization, and modeling. By using and extending open source R and Python, Microsoft ML Server is fully compatible with R / Python scripts, functions and CRAN / pip / Conda packages, to analyze data at enterprise scale. It also addresses the in-memory limitations of Open Source R by adding parallel and chunked processing of data. This enables you to run analytics on data much bigger than what fits in main memory.  Visual Studio Community Edition included on the VM contains the R Tools for Visual Studio and Python tools for Visual Studio extension that provides a full IDE for working with R or Python. We also provide other IDEs as well such as [RStudio](http://www.rstudio.com) and [PyCharm Community edition](https://www.jetbrains.com/pycharm/) on the VM. 

### Python
For development using Python, Anaconda Python distribution 2.7 and 3.5 has been installed. This distribution contains the base Python along with about 300 of the most popular math, engineering, and data analytics packages. You can use Python Tools for Visual Studio (PTVS) that is installed within the Visual Studio 2015 Community edition or one of the IDEs bundled with Anaconda like IDLE or Spyder. You can launch one of these by searching on the search bar (**Win** + **S** key).

> [!NOTE]
> To point the Python Tools for Visual Studio at Anaconda Python 2.7 and 3.5, you need to create custom environments for each version. To set these environment paths in the Visual Studio 2015 Community Edition, navigate to **Tools** -> **Python Tools** -> **Python Environments** and then click **+ Custom**. 
> 
> 

Anaconda Python 2.7 is installed under C:\Anaconda and Anaconda Python 3.5 is installed under c:\Anaconda\envs\py35. See [PTVS documentation](/visualstudio/python/python-environments.md#selecting-and-installing-python-interpreters) for detailed steps. 

### Jupyter Notebook
Anaconda distribution also comes with a Jupyter notebook, an environment to share code and analysis. A Jupyter notebook server has been pre-configured with Python 2.7, Python 3.5, PySpark, Julia and R kernels. There is a desktop icon named "Jupyter Notebook" to start the Jupyter server and launch the browser to access the Notebook server. 

> [!NOTE]
> Continue if you get any certificate warnings. 
> 
> 

We have packaged several sample notebooks in Python and in R. The Jupyter notebooks show how to work with Microsoft ML Server, SQL Server ML Services (In-database analytics), Python, Microsoft Cognitive ToolKit, Tensorflow and other Azure technologies once you access Jupyter. You can see the link to the samples on the notebook home page after you authenticate to the Jupyter notebook using the password you created in an earlier step. 

### Visual Studio 2017 Community edition
Visual Studio Community edition installed on the VM. It is a free version of the popular IDE from Microsoft that you can use for evaluation purposes and for small teams. You can check out the licensing terms [here](https://www.visualstudio.com/support/legal/mt171547).  Open Visual Studio by double-clicking the desktop icon or the **Start** menu. You can also search for programs with **Win** + **S** and entering “Visual Studio”. Once there you can create projects in languages like C#, Python, R, node.js. Plugins are also installed that make it convenient to work with Azure services like Azure Data Catalog, Azure HDInsight (Hadoop, Spark), and Azure Data Lake. 

> [!NOTE]
> You may get a message stating that your evaluation period has expired. Enter your Microsoft account credentials or create a new free account to get access to the Visual Studio Community Edition. 
> 
> 

### SQL Server 2017 Developer edition
A developer version of SQL Server 2017 with ML Services to run in-database analytics is provided on the VM in either R or Python. ML Services provide a platform for developing and deploying intelligent applications. You can use the rich and powerful these languages and the many packages from the community to create models and generate predictions for your SQL Server data. You can keep analytics close to the data because ML Services (In-database) integrates both the R and Python language within the SQL Server. This eliminates the costs and security risks associated with data movement.

> [!NOTE]
> The SQL Server developer edition can only be used for development and test purposes. You need a license to run it in production. 
> 
> 

You can access the SQL server by launching **SQL Server Management Studio**. Your VM name is populated as the Server Name. Use Windows Authentication when logged in as the admin on Windows. Once you are in SQL Server Management Studio you can create other users, create databases, import data, and run SQL queries. 

To enable In-database analytics using SQL ML Services, run the following command as a one time action in SQL Server management studio after logging in as the server administrator. 

        CREATE LOGIN [%COMPUTERNAME%\SQLRUserGroup] FROM WINDOWS 

        (Please replace the %COMPUTERNAME% with your VM name)


### Azure
Several Azure tools are installed on the VM:

* There is a desktop shortcut to access the Azure SDK documentation. 
* **AzCopy**: used to move data in and out of your Microsoft Azure Storage Account. To see usage, type **Azcopy** at a command prompt to see the usage. 
* **Microsoft Azure Storage Explorer**: used to browse through the objects that you have stored within your Azure Storage Account and transfer data to and from Azure storage. You can type **Storage Explorer** in search or find it on the Windows Start menu to access this tool. 
* **Adlcopy**: used to move data to Azure Data Lake. To see usage, type **adlcopy** in a command prompt. 
* **dtui**: used to move data to and from Azure Cosmos DB, a NoSQL database on the cloud. Type **dtui** on command prompt. 
* **Azure Data Factory Integration Runtime**:  enables data movement between on-premises data sources and cloud. It is used within tools like Azure Data Factory. 
* **Microsoft Azure Powershell**:  a tool used to administer your Azure resources in the Powershell scripting language is also installed on your VM. 

### Power BI
To help you build dashboards and great visualizations, the **Power BI Desktop** has been installed. Use this tool to pull data from different sources, to author your dashboards and reports, and to publish them to the cloud. For information, see the [Power BI](http://powerbi.microsoft.com) site. You can find Power BI desktop on the Start menu. 

> [!NOTE]
> You need an Office 365 account to access Power BI. 
> 
> 

## Additional Microsoft development tools
The [**Microsoft Web Platform Installer**](https://www.microsoft.com/web/downloads/platform.aspx) can be used to discover and download other Microsoft development tools. There is also a shortcut to the tool provided on the Microsoft Data Science Virtual Machine desktop.  

## Important directories on the VM
| Item | Directory |
| --- | --- |
| Jupyter notebook server configurations |C:\ProgramData\jupyter |
| Jupyter Notebook samples home directory |c:\dsvm\notebooks |
| Other samples |c:\dsvm\samples |
| Anaconda (default: Python 2.7) |c:\Anaconda |
| Anaconda Python 3.5 environment |c:\Anaconda\envs\py35 |
| Microsoft ML Server Standalone Python  | C:\Program Files\Microsoft\ML Server\PYTHON_SERVER |
| Default R instance (ML Server Standalone) |C:\Program Files\Microsoft\ML Server\R_SERVER |
| SQL ML Services In-database instance directory |C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER |
| Azure Machine Learning Workbench (per user) | %localappdata%\amlworkbench | 
| Miscellaneous tools |c:\dsvm\tools |

> [!NOTE]
> Instances of the Microsoft Data Science Virtual Machine created before 1.5.0 (before September 3, 2016) used a slightly different directory structure than specified in the preceding table. 
> 
> 

## Next Steps
Here are some next steps to continue your learning and exploration. 

* Explore the various data science tools on the data science VM by clicking the start menu and checking out the tools listed on the menu.
* Learn about Azure Machine Learning Services and Workbench by visiting the product [quickstart and tutorials page](../preview/index.yml). 
* Navigate to **C:\Program Files\Microsoft\ML Server\R_SERVER\library\RevoScaleR\demoScripts** for samples using the RevoScaleR library in R that supports data analytics at enterprise scale.  
* Read the article: [10 things you can do on the Data science Virtual Machine](http://aka.ms/dsvmtenthings)
* Learn how to build end to end analytical solutions systematically using the [Team Data Science Process](../team-data-science-process/index.yml).
* Visit the [Azure AI Gallery](http://gallery.cortanaintelligence.com) for machine learning and data analytics samples that use Azure Machine learning and related data services on Azure. We have also provided an icon on the **Start** menu and on the desktop of the virtual machine to this gallery.

