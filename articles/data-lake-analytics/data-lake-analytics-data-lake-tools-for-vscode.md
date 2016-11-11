---
title: Use the Azure Data Lake Tools for Visual Studio Code | Microsoft Docs
description: 'Learn how to use the Azure Data Lake Tools for Visual Studio Code to create, test, and run U-SQL scripts. '
services: data-lake-analytics
documentationcenter: ''
author: mumian
manager: jhubbard
editor: cgronlun

ms.assetid: ad8a6992-02c7-47d4-a108-62fc5a0777a3
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 11/11/2016
ms.author: jgao

---

# Use the Azure Data Lake Tools for VSCode

Learn how to use the Azure Data Lake Tools for VSCode to create and run U-SQL scripts.

The Data Lake Tools for VSCode supports the following features:

-	IntelliSense auto-complete. Suggestions are popped up around keyword, method, variables, etc. Different icons represent different types of the objects:

    - Scala Data Type
    - Complex Data Type
    - Built-in UDTs
    - .Net Collection & Classes
    - C# Expressions
    - Built-in C# UDFs, UDOs, and UDAAGs 
    - U-SQL Functions
    - U-SQL Windowing Function
 
    ![Data Lake Tools for Visual Studio Code IntelliSense object types](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-auto-complete-objects.png)
 
-	IntelliSense auto-complete on the Data Lake Analytics Metadata. The Data Lake Tools download Data Lake Analytics metadata information locally.  The IntelliSense feature automatically populates objects, including Database, Schema, Table, View, TVF, Procedures, C# Assemblies, from the Data Lake Analytics metadata.
 
    ![Data Lake Tools for Visual Studio Code IntelliSense metadata](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-auto-complete-metastore.png)

-	IntelliSense error marker. The Data Lake Tools underline the editing errors for U-SQL and C#. 
-	Syntax highlights. The Data Lake Tools use different color to differentiate variables, keywords, data type, functions, etc. 

    ![Data Lake Tools for Visual Studio Code syntax highlights](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-syntax-highlights.png)

## Prerequisites

The Data Lake Tools can be installed on the platforms supported by VSCode that includes Windows, Linux, and MacOS.

- Windows

    - [Visual Studio Code]( https://www.visualstudio.com/products/code-vs.aspx)
    - [Java SE Runtime Environment version 8 update 77 or later](https://java.com/download/manual.jsp)
    - Add the java.exe path to the system environment variable path.  For the instructions, see [how do I set or change the Path system variable?]( https://www.java.com/download/help/path.xml) The path is similar to C:\Program Files\Java\jdk1.8.0_77\jre\bin
    - [.NET Core SDK 1.0.1-preview 2 or .NET Core 1.0.1 runtime]( https://www.microsoft.com/net/download).
    
- Linux (We recommend Ubuntu 14.04 LTS)

    - [Visual Studio Code]( https://www.visualstudio.com/products/code-vs.aspx). Use the following command to install:
        sudo dpkg -i code_<version_number>_amd64.deb
    - [Mono 4.2.x](http://www.mono-project.com/docs/getting-started/install/linux/). 

        - Update the deb package source by executing following commands:

            sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
            echo "deb http://download.mono-project.com/repo/debian wheezy/snapshots 4.2.4.4/main" | sudo tee /etc/apt/sources.list.d/mono-xamarin.list
            sudo apt-get update
        - Install mono by running the command:

            sudo apt-get install mono-complete

		    >[AZURE.NOTE] Mono 4.6 is not supported.  You must uninstall version 4.6 entirely before installing 4.2.x.  

        - [Java SE Runtime Environment version 8 update 77 or later](https://java.com/download/manual.jsp). The instruction can be found [here]( https://java.com/en/download/help/linux_x64_install.xml).
        - [.NET Core SDK 1.0.1-preview 2 or .NET Core 1.0.1 runtime]( https://www.microsoft.com/net/download).
- MacOS

    - [Visual Studio Code]( https://www.visualstudio.com/products/code-vs.aspx)
    - [Mono 4.2.4](http://download.mono-project.com/archive/4.2.4/macos-10-x86/). 
    - [Java SE Runtime Environment version 8 update 77 or later](https://java.com/download/manual.jsp). The instruction can be found [here](https://java.com/en/download/help/mac_install.xml).
    - [.NET Core SDK 1.0.1-preview 2 or .NET Core 1.0.1 runtime]( https://www.microsoft.com/net/download).

## Install the Data Lake Tools

After you have installed the prerequisites, you can install the Data Lake Tools for VSCode.

**To install the Data Lake Tools**

1.	Open **Visual Studio Code**.
2.	Click **Extensions** from the left menu, or press **CTRL+SHIFT+X**, to open the Extensions pane. 
3.	Click **…**, and then click **Install from **VSIX**.
4.	Specify the Data Lake Tools for VSCode file, and then click **Open**. Wait a couple of minutes, you shall see a tip asking you to restart.   
5.	Click **Restart Now**. You shall see **USQL-Language-Support** in the Extensions pane.

## Connect to Azure

Before you can compile and run U-SQL scripts, you must connect to your Azure.

**To connect to Azure**

1.	Press **CTRL+SHIFT+P** to open the command palette, and then type **USQL:Login**.
2.	Follow the instructions to sign in from the web page. Once connected, your account name is shown on the Status bar on the bottom of the window.

>[AZURE.NOTE] If your account has two factors enabled, it is recommended to use phone authentication instead of Pin.
To sign off, use the command **USQL:Logout**

## List Data Lake Analytics accounts

To list the Data Lake Analytics accounts under your Azure subscription, press **CTRL+SHIFT+P**, and then type **USQL:List Accounts**.  The accounts appear in the **Output** pane.

## Work with U-SQL

### Open/create U-SQL scripts

To open a script file, click the **File** menu, and then click **Open File**. In the single-file mode, code-behind is not supported, and no dedicated configuration file will be created.
You can also open a working folder that contains U-SQL script files by clicking the **File** menu, and then click **Open Folder**.  In this mode, the scripts in the working folder share one configuration file.

### Configure computer account

A compute Data Lake Analytics account is needed for compiling and running U-SQL jobs.  You must configure the computer account before you can compile and run U-SQL jobs.

**To set up the compute account**

1.	Open the command palette by pressing **CTRL+SHIFT+P**.
2.	Enter **USQL:Set Script Parameters**. By doing so, you create a configuration file called *usqlscript_settings.json* in the working folder.  
3.	From **Explorer**, double-click **vscode for u-sql_settings.json** to open it.
4.	Configure the following:

    - Account:  A Data Lake Analytics account under your Azure subscription.
    - Optional settings:

        - Priority: The priority range is from 1 to 1000 with 1 the highest priority. The default value is 1000.
        - Parallelism: The parallelism range is from 1 to 150. The default value is 150. 

        >[AZURE.NOTE] If the settings are invalid, the default values are used.

     ![Data Lake Tools for Visual Studio Code configuration file](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-configuration-file.png)



### Use code-behind file

Code-behind file is a CSharp file associate with one U-SQL script. Code-behind file is put in the same folder as its peering U-SQL script file. If the script is named xxx.usql, the code-behind will be named as xxx.usql.cs. Deleting the code-behind file manually disables the code-behind feature for its associated U-SQL script. User can define script dedicated UDO/UDA/UDT/UDF in the code-behind file, the UDO/UDA/UDT/UDF can be directly used in the script without register the assembly first. For more information about writing customer code for U-SQL script, see [Writing and Using Custom Code in U-SQL – User-Defined Functions]( https://blogs.msdn.microsoft.com/visualstudio/2015/10/28/writing-and-using-custom-code-in-u-sql-user-defined-functions/).
To support the code-behind, a working folder must be opened. To generate a code-behind file, use Command Palette (Ctrl+Shift+P) and choose USQL: Generate Code Behind (ctrl+q ctrl+c). Right click on the scripts then select ‘Generate Code Behind’ will perform the same actions.
Compile and submit a U-SQL script with code-behind is the same as the standalone U-SQL script.

The following two screenshots show a code-behind file and its associated U-SQL script file:
 
     ![Data Lake Tools for Visual Studio Code code behind](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-code-behind.png)
     ![Data Lake Tools for Visual Studio Code code behind](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-code-behind-call.png) 

### Compile U-SQL jobs

The U-SQL script compilation is done remotely by the Data Lake Analytics service.  When you issue the compile command, the U-SQL script is sent to your Data Lake Analytics account. The compilation result is late received by the Visual Studio Code. Because of the remote compilation, Visual Studio code requires the information to connect to your Data Lake Analytics account in the configuration file.

**To compile a U-SQL script**

1.	Press **CTRL+SHIFT+P** to open Command Palette.
2.	Enter **USQL: Compile Script**
3.	Right-click the scripts, and then click **Compile script**. Compile results show in output window.
 

 

### Submit U-SQL jobs

Use Command Palette (Ctrl+Shift+P) and choose USQL: Submit Job (ctrl+q ctrl+s). Right click on the scripts then select ‘Submit Job’ will perform the same actions. 

After submitting a U-SQL job, submission logs is shown in output window in VSCode. If the submission is successful, the job URL is shown as well. You can open the job URL in a web browser to track real-time job status.

To enable output job details: set ‘jobInformationOutputPath’ in script parameters.

 

 

## Register assemblies

Using the Data Lake Tools, you can register custom code assemblies to the Data Lake Analytics metastore.

**To register an assembly**

1.	Press **CTRL+SHIFT+P** to open Command Palette.
2.	Enter **USQL:Register Assembly.
3.	Select aData Lake Analytics account.
4.	Select a database.
5.	Specify the local assembly path.





## Access Data Lake Analytics Metadata

After you have connected to Azure, you can use the following steps to access the U-SQL metadata:

**To access U-SQL metadata**

1.	Press **CTRL+SHIFT+P**, and then type **USQL:List Tables**.
2.	Click one of the Data Lake Analytics accounts.
3.	Click one of the Data Lake Analytics databases.
4.	Click one of the schemas. You shall see the tables.

[jgao: list other commands in addition to USQL:List Tables]


##Next steps:

- For the getting started information on Data Lake Analytics, see [Tutorial: get started with Azure Data Lake Analytics](data-lake-analytics-get-started-portal.md).
- For information on using Data Lake Tools for Visual Studio, see [Tutorial: develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).



