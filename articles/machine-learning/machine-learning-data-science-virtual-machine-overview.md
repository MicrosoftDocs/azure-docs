<properties 
	pageTitle="Overview of Data Science Virtual Machine | Azure" 
	description="TBD" 
	services="machine-learning" 
	documentationCenter="" 
	authors="bradsev" 
	manager="jhubbard" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/04/2016" 
	ms.author="bradsev" /> 

# Overview of Data Science Virtual Machine

The Data Science Virtual Machine is a custom Azure Virtual Machine image purpose-built to do data science and analytics efficiently. It contains several popular data science tools that are preinstalled and preconfigured to help you develop data science and machine learning solutions rapidly, whether they are in the cloud, on-premises, or a hybrid of the two.​​

The Microsoft Data Science Virtual Machine (DSVM) is available on Windows 2012 Server or OpenLogic 7.2 CentOS-based Linux operating systems. It contains popular tools for data science modeling and development activities and machine learning tools. All of the tools are preinstalled and preconfigured to help you get started immediately after you create your instance of the virtual machine on Azure.

This topic discusses some of the **key scenarios** for using the DSVM, itemizes the **key features** available on the Windows and Linux versions, and **how to get started** using them.

##Key usage scenarios

- **Analytics Desktop on Cloud**: Immediate access to an  environment set up for analytics that can be accessed and shared from anywhere.
- **Training and Education**: Learn how to use data science tools and master techniques used by analytics and machine learning.
- **Short-term ScaleUp**: When needed, for example, for Hackathons or Large-scale modeling.
- **Trial and Evaluation**: Experiment with machine learning and other data science technologies to establish feasibility for production proposals.

## Video: what is the DSVM and why should you use it?

TBD

## Best Practice Solution Architectures for Data Science Teams using DSVM

TBD: Easily consumable by Architects and TDMs (?Test of Technology Development Manager?).


## Key features in Windows and Linux versions

### Windows version 

- Microsoft R Server (Enterprise R, R Open, MKL)
- Anaconda Python 2.7, 3.5
- Jupyter Notebooks (R, Python)
- SQL Server 2014 Express
- Visual Studio Community Edition 2015 
	- Azure SDKs, HDInsight tools, Data Lake tools
	- Python and R tools or Visual Studio (IDE)
- Power BI desktop
- Machine learning tools ◦Integration with Azure Machine Learning
	- CNTK (deep learning)
	- XGBoost (a popular tool in data science competitions)
	- Vowpal Wabbit (fast online learner)
	- Rattle (a visual quick-start data analytics tool)
- APIs to access Azure and Cortana Intelligence Suite services
- Tools for data transfer to and from Azure and big data storage technologies (Azure Storage Explorer, PowerShell)
- Git
- Linux/Unix utilities through Git Bash and Windows command prompt

### Linux version

- Microsoft R Open (Open Source R + MKL)
- Anaconda Python 2.7, 3.5
- Jupyter Notebooks (R, Python)
- Postgres, Squirrel SQL (database tool), SQL Server drivers and command line (bcp, sqlcmd)
- Eclipse with Azure toolkit plug-in
- Emacs (with ESS, auctex)
- ML tools
- Integrations to Azure Machine Learning
- CNTK (Deep Learning)
- XGBoost (a popular tool in data science competitions)
- Vowpal Wabbit (fast online learner)
- Rattle (a visual quick-start data analytics tool)
- APIs to access Azure and Cortana Intelligence Suite services
- Azure command line for administration
- Azure Storage Explorer
- Git


## How to get started with the Data Science Virtual Machine

### Get started with the Windows version of the DSVM

• Create an instance of the VM on Windows by navigating to [this page](https://azure.microsoft.com/marketplace/partners/microsoft-ads/standard-data-science-vm/) and selecting the green **Create Virtual Machine** button. 
•Sign in to the VM from your remote desktop using the credentials you specified when you created the VM.
• Click on the **Start** menu to discover and launch many of the tools. 
• For more information on how to run specific tools available on the VM and on how to perform various tasks needed for your data science project, see [Provision the Microsoft Data Science Virtual Machine](machine-learning-data-science-provision-vm.md) and [Ten things you can do on the Data science Virtual Machine](machine-learning-data-science-vm-do-ten-things.md) . 


### Get started with the Linux version of the DSVM

• Create an instance of the VM on Linux (OpenLogic CentOS-based) by navigating to [this page](https://azure.microsoft.com/marketplace/partners/microsoft-ads/linux-data-science-vm/) and selecting the **Create Virtual Machine** button. 
•Sign in to the VM from an SSH client, such as Putty or SSH Command, using the credentials you specified when you created the VM.
• In the shell prompt, enter dsvm-more-info. 
• For a graphical desktop, download the X2Go client for your client platform [here](http://wiki.x2go.org/doku.php/doc:installation:x2goclient) and follow the instructions in the Linux DSVM document [Provision the Linux Data Science Virtual Machine](machine-learning-data-science-linux-dsvm-intro.md#installing-and-configuring-x2go-client). 
• For more information on how to run specific tools available on the VM, see [Provision the Linux Data Science Virtual Machine](machine-learning-data-science-linux-dsvm-intro.md). 


## Next steps

For more information on Windows virtual machines, see [Windows Virtual Machines documentation](https://azure.microsoft.com/documentation/services/virtual-machines/windows/).

For more information on Linux virtual machines, see [Linux Virtual Machines documentation](https://azure.microsoft.com/documentation/services/virtual-machines/linux/).

For more information on using applications on virtual machines, see [Microsoft applications on Virtual Machines](https://azure.microsoft.com/services/virtual-machines/microsoft-apps/).

For a directory of directory of integrated Azure services, features, and bundled suites, see [Azure Products](https://azure.microsoft.com/services/?filter=intelligence-analytics).

