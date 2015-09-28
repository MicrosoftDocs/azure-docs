
<properties
		pageTitle="Monitoring a Linux VM with a VM extension | Microsoft Azure"
		description="Learn how to use the Linux Diagnostic Extension to monitor performance and diagnostic data of a Linux VM in Azure."
		services="virtual-machines"
		documentationCenter=""
  		authors="NingKuang"
		manager="timlt"
		editor=""
  		tags="azure-service-management"/>

<tags
		ms.service="virtual-machines"
		ms.workload="infrastructure-services"
		ms.tgt_pltfrm="vm-linux"
		ms.devlang="na"
		ms.topic="article"
		ms.date="07/20/2015"
		ms.author="Ning"/>


# Use the Linux Diagnostic Extension to monitor the performance and diagnostic data of a Linux VM

## Introduction

The Linux Diagnostic Extension helps a user monitor the Linux VMs running on Microsoft Azure, with the following functionalities:

- Collects and uploads Linux VM's system performance, diagnostic, and syslog data to user’s storage table.
- Enables user to customize the data metrics that will be collected and uploaded.
- Enables user to upload specified log files to designated storage table.

For version 2.0, the data includes:

- All Linux Rsyslog loggings, including system, security, and application logs.
- All system data specified in this [document](https://scx.codeplex.com/wikipage?title=xplatproviders").
- User specified log files.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-include.md)] This article covers managing a resource with the classic deployment model.

## How to enable the extension
The extension can be enabled through the [Azure portal](https://ms.portal.azure.com/#), Azure PowerShell, or Azure CLI scripts.

To view and configure the system and performance data directly from the Azure portal, follow these [steps](http://azure.microsoft.com/blog/2014/09/02/windows-azure-virtual-machine-monitoring-with-wad-extension/ "URL to the Windows blog").


This article focuses on enabling and configuring the extension through Azure CLI commands.This allows you to read and view the data from the storage table directly.


## Prerequisites
- Microsoft Azure Linux Agent version 2.0.6 or later.
Note that most Azure VM Linux gallery images include version 2.0.6 or later. You can run **WAAgent -version** to confirm the version installed in the VM. If the VM is running a version earlier than 2.0.6 you can follow these [instructions](https://github.com/Azure/WALinuxAgent "instructions") to update it.
- [Azure CLI](./xplat-cli.md). Follow [this guidance](./xplat-cli-install.md) to set up the Azure CLI environment on your machine. After the Azure CLI is installed, you can use the **azure** command from your command-line interface (Bash, Terminal, command prompt) to access the Azure CLI commands. For example, run **azure vm extension set --help** for detailed usage, run **azure login** to log in to Azure, run **azure vm list** to list all the virtual machines you have on Azure.
- A storage account to store the data. You will need a previously created storage account name and access key to upload the data to your storage.


## Use the Azure CLI command to enable Linux Diagnostic Extension

###  Scenario 1. Enable the extension with the default data set
For version 2.0 or later, the default data that will be collected includes:

- All Rsyslog information (including system, security, and application logs).  
- A core set of basis system data, note the full data set is described in this [document](https://scx.codeplex.com/wikipage?title=xplatproviders).
If you want to enable extra data, continue with steps in scenario 2 and 3.

Step 1. Create a file named PrivateConfig.json with the following content.

	{
     	"storageAccountName":"the storage account to receive data",
     	"storageAccountKey":"the key of the account"
	}

Step 2. Run **azure vm extension set vm_name LinuxDiagnostic Microsoft.OSTCExtensions 2.* --private-config-path PrivateConfig.json**.


###   Scenario 2. Customize the performance monitor metric  
This section describes how to customize the performance and diagnostic data table.

Step 1. Create a file named PrivateConfig.json with the content that appears in the next example. Specify the particular data you want to collect.

For all supported providers and variables, reference this [document](https://scx.codeplex.com/wikipage?title=xplatproviders). You can have multiple queries and store them in multiple tables by appending more queries to the script.

By default, the Rsyslog data is always collected.

	{
     	"storageAccountName":"storage account to receive data",
     	"storageAccountKey":"key of the account",
      	"perfCfg":[
           	{"query":"SELECT PercentAvailableMemory, AvailableMemory, UsedMemory ,PercentUsedSwap FROM SCX_MemoryStatisticalInformation","table":"LinuxMemory"
           	}
          ]
	}


Step 2. Run **azure vm extension set vm_name LinuxDiagnostic Microsoft.OSTCExtensions 2.*
--private-config-path PrivateConfig.json**.


###   Scenario 3. Upload your own log files
This section describes how to collect and upload particular log files to your storage account.
You need to specify the path to your log file, and specify the table name to store your log. You can have multiple log files by adding multiple file/table entries to the script.

Step 1. Create a file named PrivateConfig.json with the following content.

	{
     	"storageAccountName":"the storage account to receive data",
     	"storageAccountKey":"key of the account",
      	"fileCfg":[
           	{"file":"/var/log/mysql.err",
             "table":"mysqlerr"
           	}
          ]
	}


Step 2. Run **azure vm extension set vm_name LinuxDiagnostic Microsoft.OSTCExtensions 2.*
--private-config-path PrivateConfig.json**.


###   Scenario 4. Disable the Linux monitor extension
Step 1. Create a file named PrivateConfig.json with the following content.

	{
     	"storageAccountName":"the storage account to receive data",
     	"storageAccountKey":"the key of the account",
     	“perfCfg”:[],
     	“enableSyslog”:”False”
	}


Step 2. Run **azure vm extension set vm_name LinuxDiagnostic Microsoft.OSTCExtensions 2.*
--private-config-path PrivateConfig.json**.


## Review your data
The performance and diagnostic data are stored in an Azure Storage table. Review [this article](storage-ruby-how-to-use-table-storage.md) to learn how to access the data in the storage table using Azure CLI scripts.

In addition, you can use following UI tools to access the data:

1.	Use Visual Studio Server Explorer. Navigate to your storage account. After the VM runs about 5 minutes you should see the four default tables: “LinuxCpu”, ”LinuxDisk”, ”LinuxMemory”, and ”Linuxsyslog”. Double click the table name to view the data.
2.	Use [Azure Storage Explorer](https://azurestorageexplorer.codeplex.com/ "Azure Storage Explorer") to access the data.

![image](./media/virtual-machines-linux-diagnostic-extension/no1.png)

If have enabled fileCfg or perfCfg specified in Scenario 2 and 3, you can use the previous tools to view non-default data.



## Known issues
- For version 2.0, the Rsyslog information and customer specified log file can only be accessed via scripting.
- For version 2.0, if you have enabled the Linux Diagnostic extension via script first, then you cannot view the data from the Azure portal. If you enable the extension from the portal first, then the scripts will still work.
