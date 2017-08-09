---
title: 'Azure Data Lake Tools: Use the Azure Data Lake Tools for Visual Studio Code | Microsoft Docs'
description: 'Learn how to use the Azure Data Lake Tools for Visual Studio Code to create, test, and run U-SQL scripts. '
Keywords: VScode,Azure Data Lake Tools,Local run,Local debug,Local Debug,preview storage file,upload to storage path
services: data-lake-analytics
documentationcenter: ''
author: jejiang
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: dc9b21d8-c5f4-4f77-bcbc-eff458f48de2
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 07/14/2017
ms.author: jejiang
---

# Use the Azure Data Lake Tools for Visual Studio Code

Learn how to use the Azure Data Lake Tools for Visual Studio Code (VS Code) to create, test, and run U-SQL scripts. The information is also covered in the following video:

<a href="https://www.youtube.com/watch?v=J_gWuyFnaGA&feature=youtu.be"><img src="./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-video.png"></a>

## Prerequisites

The Data Lake Tools can be installed on the platforms supported by VS Code. The supported platforms include Windows, Linux, and MacOS. The following is a list of the prerequisites for the different platforms:

- Windows

    - [Visual Studio Code]( https://www.visualstudio.com/products/code-vs.aspx).
    - [Java SE Runtime Environment version 8 update 77 or later](https://java.com/download/manual.jsp). You need to add the java.exe path to the system environment variable path. For configuration instructions, see [How do I set or change the Path system variable?]( https://www.java.com/download/help/path.xml). The path is similar to C:\Program Files\Java\jdk1.8.0_77\jre\bin.
    - [.NET Core SDK 1.0.3 or .NET Core 1.1 runtime](https://www.microsoft.com/net/download).
    
- Linux (We recommend Ubuntu 14.04 LTS)

    - [Visual Studio Code]( https://www.visualstudio.com/products/code-vs.aspx). Enter the following command to install the code:

        sudo dpkg -i code_<version_number>_amd64.deb

    - [Mono 4.2.x](http://www.mono-project.com/docs/getting-started/install/linux/). 

        - Update the deb package source by executing the following commands:

                sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
                echo "deb http://download.mono-project.com/repo/debian wheezy/snapshots 4.2.4.4/main" | sudo tee /etc/apt/sources.list.d/mono-xamarin.list
                sudo apt-get update

        - Install Mono by running the following command:

                sudo apt-get install mono-complete

		    > [!NOTE] 
            > Mono 4.6 is not supported. You need to uninstall version 4.6 entirely before installing 4.2.x.  

        - [Java SE Runtime Environment version 8 update 77 or later](https://java.com/download/manual.jsp). For instructions on installation, see the [Linux 64-bit installation instructions for Java]( https://java.com/en/download/help/linux_x64_install.xml) page.
        - [.NET Core SDK 1.0.3 or .NET Core 1.1 runtime](https://www.microsoft.com/net/download).
- MacOS

    - [Visual Studio Code]( https://www.visualstudio.com/products/code-vs.aspx).
    - [Mono 4.2.4](http://download.mono-project.com/archive/4.2.4/macos-10-x86/). 
    - [Java SE Runtime Environment version 8 update 77 or later](https://java.com/download/manual.jsp). The instructions on installation see the [Linux 64-bit installation instructions for Java](https://java.com/en/download/help/mac_install.xml) page.
    - [.NET Core SDK 1.0.3 or .NET Core 1.1 runtime](https://www.microsoft.com/net/download).

## Install the Data Lake Tools

After you install the prerequisites, you can install the Data Lake Tools for VS Code.

**To install the Data Lake Tools**

1. Open **Visual Studio Code**.
2. Select **Ctrl+P**, and then enter:
```
ext install usql-vscode-ext
```
You can see a list of Visual Studio code extensions. One of them is **Azure Data Lake Tools**.

3. Select **Install** next to **Azure Data Lake Tools**. After a few seconds, the **Install** button will change to **Reload**.
4. Select **Reload** to activate the extension.
5. Select **OK** to confirm. You can see Azure Data Lake Tools in the **Extensions** pane.
    ![Data Lake Tools for Visual Studio Code Extensions pane](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-extensions.png)

## Activate the Azure Data Lake Tools
Create a new .usql file or open an existing .usql file to activate the extension. 

## Connect to Azure

Before you can compile and run U-SQL scripts in Data Lake Analytics, you must connect to your Azure account.

**To connect to Azure**

1.	Open the command palette by selecting **Ctrl+Shift+P**. 
2.  Enter **ADL: Login**. The login information shows in the output pane.

    ![Data Lake Tools for Visual Studio Code command palette](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-extension-login.png)
    ![Data Lake Tools for Visual Studio Code device login information](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-login-info.png)
3. Select **Ctrl+click** on the login URL: https://aka.ms/devicelogin to open the login webpage. Copy and paste the code **G567LX42V** into the text box, and then select **Continue**.

   ![Data Lake Tools for Visual Studio Code login paste code](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-extension-login-paste-code.png )   
4.  Follow the instructions to sign in from the webpage. Once connected, your Azure account name shows on the status bar in the lower-left corner of the VS Code window. 

    > [!NOTE] 
    > If your account has two factors enabled, we recommended that you use phone authentication instead of using a PIN.

To sign off, enter the command **ADL: Logout**.

## List your Data Lake Analytics accounts

To test the connection, get a list your Data Lake Analytics accounts:

**To list the Data Lake Analytics accounts under your Azure subscription**

1. Open the command palette by selecting **Ctrl+Shift+P**.
2. Enter **ADL: List Accounts**.  The accounts appear in the **Output** pane.

## Open the sample script
Open the command palette (**Ctrl+Shift+P**) and choose **ADL: Open Sample Script**. This opens another instance of this sample. You can also edit, configure, and submit script on this instance.

## Work with U-SQL

You need open either a U-SQL file or a folder to work with U-SQL.

**To open a folder for your U-SQL project**

1. From Visual Studio Code, click the **File** menu, and then click **Open Folder**.
2. Specify a folder, and then click **Select Folder**.
3. Click the **File** menu, and then click **New**. An **Untitled-1** file is added to the project.
4. Copy and paste the following code into Untitled-1 file:

        @departments  = 
            SELECT * FROM 
                (VALUES
                    (31,    "Sales"),
                    (33,    "Engineering"), 
                    (34,    "Clerical"),
                    (35,    "Marketing")
                ) AS 
                      D( DepID, DepName );
         
        OUTPUT @departments
            TO “/Output/departments.csv”

    The script creates a departments.csv file with some data included in the /output folder.

5. Save the file as **myUSQL.usql** in the opened folder. A **adltools_settings.json** configuration file is also added to the project.
4. Open and configure **adltools_settings.json** with the following properties:

    - Account:  A Data Lake Analytics account under your Azure subscription.
    - Database: A database under your account. The default is **master**.
    - Schema: A schema under your database. The default is **dbo**.
    - Optional settings:
        - Priority: The priority range is from 1 to 1000 with 1 as the highest priority. The default value is **1000**.
        - Parallelism: The parallelism range is from 1 to 150. The default value is the maximum parallelism allowed in your Azure Data Lake Analytics (ADLA) account. 
        
        > [!NOTE] 
        > If the settings are invalid, the default values are used.

    ![Data Lake Tools for Visual Studio Code configuration file](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-configuration-file.png)

    A compute Data Lake Analytics account is needed for compiling and running U-SQL jobs. You must configure the computer account before you can compile and run U-SQL jobs.
    
After the configuration saves, the account, database, and schema information is shown on the status bar at the bottom-left corner of the corresponding .usql file. 
 
 

Compared to opening a file, opening a folder allows you to:

- Use a code-behind file. In the single-file mode, code-behind is not supported.
- Use a configuration file. When you open a folder, the scripts in the working folder share a single configuration file.


The U-SQL script compilation is done remotely by the Data Lake Analytics service.  When you issue the **compile** command, the U-SQL script is sent to your Data Lake Analytics account. The compilation result is later received by the Visual Studio Code. Due to the remote compilation, Visual Studio Code requires that you list the information to connect to your Data Lake Analytics account in the configuration file.

**To compile a U-SQL script**

1. Open the command palette by selecting **Ctrl+Shift+P**. 
2. Enter **ADL: Compile Script**. The compile results show in output window. You can also right-click a script file, and then click **ADL: Compile Script** to compile a U-SQL job. The compilation result shows in the **Output** pane.
 

**To submit a U-SQL script**

1. Open the command palette by selecting **Ctrl+Shift+P**. 
2. Enter **ADL: Submit Job**.  You can also right-click a script file, and then click **ADL: Submit Job**. 

After submitting a U-SQL job, submission logs are shown in output window in VS Code. If the submission is successful, the job URL shows as well. You can open the job URL in a web browser to track the real-time job status.

To enable the output of the job details: set the **jobInformationOutputPath** in the **vscode for u-sql_settings.json** file.
 
## Use a code-behind file

A code-behind file is a C# file associated with a single U-SQL script. You can define script dedicated to UDO, UDA, UDT, and UDF in the code-behind file. The UDO, UDA, UDT, and UDF can be used directly in the script without registering the assembly first. The code-behind file is put in the same folder as its peering U-SQL script file. If the script is named xxx.usql, the code-behind is named as xxx.usql.cs. Deleting the code-behind file manually disables the code-behind feature for its associated U-SQL script. For more information about writing customer code for U-SQL script, see [Writing and Using Custom Code in U-SQL--User-Defined Functions]( https://blogs.msdn.microsoft.com/visualstudio/2015/10/28/writing-and-using-custom-code-in-u-sql-user-defined-functions/).

To support code-behind, a working folder must be opened. 

**To generate a code-behind file**

1. Open a source file. 
2. Open the command palette by selecting **Ctrl+Shift+P**.
3. Enter **ADL: Generate Code Behind**. A code-behind file is created in the same folder. 

You can also right-click a script file, and then click **ADL: Generate Code Behind**. 

To compile and submit a U-SQL script with a code-behind file is the same as with the standalone U-SQL script file.

The following two screenshots show a code-behind file and its associated U-SQL script file:
 
![Data Lake Tools for Visual Studio Code code-behind](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-code-behind.png)

![Data Lake Tools for Visual Studio Code code-behind script file](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-code-behind-call.png) 

## Use assemblies

For information on developing assemblies, see [Develop U-SQL assemblies for Azure Data Lake Analytics jobs](data-lake-analytics-u-sql-develop-assemblies.md).

You can use the Data Lake Tools to register custom code assemblies in the Data Lake Analytics catalog.

**To register an assembly**

You can register the assembly through **ADL: Register Assembly** or **ADL: Register Assembly through Configuration**.

**ADL: Register Assembly**
1.	Press **Ctrl+Shift+P** to open the command palette.
2.	Enter **ADL: Register Assembly**. 
3.	Specify the local assembly path. 
4.	Select a Data Lake Analytics account.
5.	Select a database.

Results: The portal is opened in a browser and displays the assembly registration process.  

Another convenient way to trigger the **ADL: Register Assembly** command is to right-click the .dll file in the File Explorer. 

**ADL: Register Assembly through Configuration**
1.	Select **Ctrl+Shift+P** to open the command palette.
2.	Enter **ADL: Register Assembly through Configuration**. 
3.	Specify the local assembly path. 
4.  The JSON file is displayed. Review and edit the assembly dependencies and resource parameters, if needed. Instructions are displayed in the output window. To proceed to the assembly registration, save (**Ctrl+S**) the JSON file.

![Data Lake Tools for Visual Studio Code code behind](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-register-assembly-advance.png)
>[!NOTE]
>- Assembly Dependencies: The Azure Data Lake Tools autodetect whether the DLL has any dependencies. The dependencies are displayed in the JSON file after they are detected. 
>- Resources: You can upload your DLL resources (for example, .txt, .png, and .csv) as part of the assembly registration. 

Another way to trigger the **ADL: Register Assembly through Configuration** command is to right-click the .dll file in the File Explorer. 

The following U-SQL code demonstrates how to call an assembly. In the sample, the assembly name is **test**.

```
REFERENCE ASSEMBLY [test];

@a = 
    EXTRACT 
        Iid int,
	Starts DateTime,
	Region string,
	Query string,
	DwellTime int,
	Results string,
	ClickedUrls string 
    FROM @"Sample/SearchLog.txt" 
    USING Extractors.Tsv();

@d =
    SELECT DISTINCT Region 
    FROM @a;

@d1 = 
    PROCESS @d
    PRODUCE 
        Region string,
	Mkt string
    USING new USQLApplication_codebehind.MyProcessor();

OUTPUT @d1 
    TO @"Sample/SearchLogtest.txt" 
    USING Outputters.Tsv();
```


## Access the Data Lake Analytics catalog

After you have connected to Azure, you can use the following steps to access the U-SQL catalog:

**To access the Azure Data Lake Analytics metadata**

1.	Select **Ctrl+Shift+P**, and then enter **ADL: List Tables**.
2.	Click one of the Data Lake Analytics accounts.
3.	Click one of the Data Lake Analytics databases.
4.	Click one of the schemas. You can see the list of tables.

## Show the Data Lake Analytics Jobs

Use the command palette (**Ctrl+Shift+P**) and choose **ADL: Show Job**. 

1.	Select an ADLA or Local account. 
2.  Wait for the jobs list for the account to be shown.
3.	Select a job from job list, ADL Tools opens the job details in the Azure portal and displays the JobInfo file in VS Code.

![Data Lake Tools for Visual Studio Code IntelliSense object types](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-show-job.png)

## Azure Data Lake Storage integration

You can use Azure Data Lake Storage (ADLS)-related commands to navigate the ADLS resources, preview the ADLS file, and upload the file into the ADLS directly in VS Code.  
### List the storage path

Use the command palette and enter a command.
1.  Open the command palette (**Ctrl+Shift+P**)  and enter **ADL: List Storage Path**.

    ![Data Lake Tools for Visual Studio Code list storage path](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-storage.png)

2.  Select your preferred way for listing the storage path. This passage uses **Enter a path** as an example.

    ![Data Lake Tools for Visual Studio Code one way to list the storage path](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-account-selectoneway.png)

    > [!NOTE]
    >- VS Code keeps the last-visited path in every ADLA account. For example：/tt/ss.
    >- Use the browser from the root path: The list root path from your selected ADLA account or a local path.
    >- Enter a path: List a specified path from your selected ADLA account or a local path.
    
3. Select an account from the local path or an ADLA account.

    ![Data Lake Tools for Visual Studio Code select more](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-account.png)

4.  Click **more** to list more ADLA accounts, and then select an ADLA account.

    ![Data Lake Tools for Visual Studio Code select an account](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-select-adla-account.png)

5.  Enter an Azure storage path. For example, **/output**.

       ![Data Lake Tools for Visual Studio Code input storage path](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-input-path.png)

6.  Results: The command palette lists the path information based on your entries.

    ![Data Lake Tools for Visual Studio Code list storage path results](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-path.png)

A more convenient way to list the relative path is through the right-click context menu.

1.  Right-click the path string to select **List Storage Path**.

       ![Data Lake Tools for Visual Studio Code right-click context menu](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-right-click-path.png)

2. The selected relative path shows in the command palette.

   ![Data Lake Tools for Visual Studio Code selected relative path](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-relative-path.png)

3.  Select an account from the local path or an ADLA account.

       ![Data Lake Tools for Visual Studio Code select an account](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-account.png)

4.  Results: The command palette lists the folders and files for the current path.

       ![Data Lake Tools for Visual Studio Code list from the current path](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-current.png)

### Preview the storage file

Use the command palette and enter a command.
1.  Open the command palette (**Ctrl+Shift+P**) and enter the command **ADL: : Preview Storage File**.

       ![Data Lake Tools for Visual Studio Code preview storage file](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-preview.png)

2.  Select an account from the local path or an ADLA account.

       ![Data Lake Tools for Visual Studio Code list account](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-account.png)

3.  Click **more** to list more ADLA accounts, and then select an ADLA account.

       ![Data Lake Tools for Visual Studio Code select an account](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-select-adla-account.png)

4.  Enter an Azure storage path or file. For example, **/output/SearchLog.txt**.

       ![Data Lake Tools for Visual Studio Code input storage path and file](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-input-preview-file.png)

5.  Results: The command palette lists the path information based on your entries.

       ![Data Lake Tools for Visual Studio Code preview file result](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-preview-results.png)

A more convenient way to preview a file is through the right-click context menu.

1.  To preview a file, right-click a file path.

   ![Data Lake Tools for Visual Studio Code right-click context menu](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-right-click-preview.png) 

2.  Select an account from the local path or an ADLA account.

       ![Data Lake Tools for Visual Studio Code select an account](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-account.png)

3.  Results: The VS Code displays the preview results of the file.

       ![Data Lake Tools for Visual Studio Code preview file result](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-preview-results.png)

### Upload a file 

You can upload files through the commands **ADL: Upload File** or **ADL: Upload File through Configuration**.

**ADL: Upload File**
1. Select **Ctrl+Shift+P** to open the command palette or right-click the script editor, and then enter **Upload File**.
2. Input a local path for to upload the file.

    ![Data Lake Tools for Visual Studio Code input local path](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-auto-input-local-path.png)

3. Select one of the ways of listing the storage path. This passage uses **Enter a path** as an example.

    ![Data Lake Tools for Visual Studio Code list storage path](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-account-selectoneway.png)
    >[!NOTE]
    >- VS Code keeps the last-visited path in every ADLA account. For example：/tt/ss.
    >- Use the browser from the root path: The list root path from your selected ADLA account or a local path.
    >- Enter a path: List a specified path from your selected ADLA account or a local path.

4. Select an account from the local path or an ADLA account.

    ![Data Lake Tools for Visual Studio Code right-click storage](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-account.png)

5. Enter an Azure storage path. For example: **/output/**

       ![Data Lake Tools for Visual Studio Code input storage path](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-input-preview-file.png)

6. List your input the Azure storage path. Select **Choose current folder**.

    ![Data Lake Tools for Visual Studio Code select a folder](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-choose-current-folder.png)

7.  Results: The output window displays the file upload status.

       ![Data Lake Tools for Visual Studio Code upload status](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-upload-status.png)    

**ADL: Upload File through Configuration**
1.  Select **Ctrl+Shift+P** to open the command palette or right-click the script editor, and then enter **Upload File through Configuration**.
2.  VS Code displays a JSON file. You can enter file paths and upload multiple files at the same time. Instructions are displayed in the output window. To proceed to upload the file, save (**Ctrl+S**) the JSON file.

       ![Data Lake Tools for Visual Studio Code input file](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-upload-file.png)

3.  Results: The output window displays the file upload status.

       ![Data Lake Tools for Visual Studio Code upload status](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-upload-status.png)     

Another way to upload file to storage is through the right-click menu on the file's full path or the file's relative path in the script editor. Input the local file path and choose the account. The output window displays the uploading status. 

### Open the Web Azure Storage Explorer
You can open the **Web Azure Storage Explorer** by entering the command: **ADL: Open Web Azure Storage Explorer** or selecting it from the right-click context menu.

1. Select **Ctrl+Shift+P** to open the command palette.
2. Enter **Open Web Azure Storage Explorer** or right-click on a relative path or the full path in the script editor to choose **Open Web Azure Storage Explorer**.
3. Select a Data Lake Analytics account.

The ADL Tools opens the Azure storage path in the Azure portal. You can find the path and preview the file from the web.

### Local run and local debug for Windows users
U-SQL local run has been implemented to test your local data and validate your script locally, before publishing your code to ADLA. The local debug feature enables you to debug your C# code-behind, step through the code, and validate your script locally before submitting it to ADLA. For instructions, see: [U-SQL local run and local debug with Visual Studio Code](data-lake-tools-for-vscode-local-run-and-debug.md).

## Additional features

The Data Lake Tools for VS Code supports the following features:

-	IntelliSense auto-complete: Suggestions are popped up around keyword, method, variables, and so forth. Different icons represent different types of the objects:

    - Scala data type
    - Complex data type
    - Built-in UDTs
    - .NET collection and classes
    - C# expressions
    - Built-in C# UDFs, UDOs, and UDAAGs 
    - U-SQL functions
    - U-SQL windowing function
 
    ![Data Lake Tools for Visual Studio Code IntelliSense object types](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-auto-complete-objects.png)
 
-	IntelliSense auto-complete on the Data Lake Analytics metadata: The Data Lake Tools download the Data Lake Analytics metadata information locally. The IntelliSense feature automatically populates objects, including the database, schema, table, view, TVF, procedures, and C# assemblies, from the Data Lake Analytics metadata.
 
    ![Data Lake Tools for Visual Studio Code IntelliSense metadata](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-auto-complete-metastore.png)

-	IntelliSense error marker: The Data Lake Tools underline the editing errors for U-SQL and C#. 
-	Syntax highlights: The Data Lake Tools use different colors to differentiate variables, keywords, data type, functions, and so forth. 

    ![Data Lake Tools for Visual Studio Code syntax highlights](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-syntax-highlights.png)

## Next steps

- For U-SQL local run and local debug with Visual Studio Code, see [U-SQL local run and local debug with Visual Studio Code](data-lake-tools-for-vscode-local-run-and-debug.md).
- For the getting started information on Data Lake Analytics, see [Tutorial: Get started with Azure Data Lake Analytics](data-lake-analytics-get-started-portal.md).
- For information about Data Lake Tools for Visual Studio, see [Tutorial: Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
- For the information on developing assemblies, see [Develop U-SQL assemblies for Azure Data Lake Analytics jobs](data-lake-analytics-u-sql-develop-assemblies.md).



