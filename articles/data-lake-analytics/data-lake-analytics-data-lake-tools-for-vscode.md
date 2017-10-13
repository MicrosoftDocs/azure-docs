---
title: 'Azure Data Lake Tools: Use Azure Data Lake Tools for Visual Studio Code | Microsoft Docs'
description: 'Learn how to use Azure Data Lake Tools for Visual Studio Code to create, test, and run U-SQL scripts. '
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

# Use Azure Data Lake Tools for Visual Studio Code

Learn how to use Azure Data Lake Tools for Visual Studio Code (VS Code) to create, test, and run U-SQL scripts. The information is also covered in the following video:

<a href="https://www.youtube.com/watch?v=J_gWuyFnaGA&feature=youtu.be"><img src="./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-video.png"></a>

## Prerequisites

Data Lake Tools can be installed on the platforms supported by VS Code. The supported platforms include Windows, Linux, and MacOS. The different platforms have the following prerequisites:

- Windows

    - [Visual Studio Code]( https://www.visualstudio.com/products/code-vs.aspx).
    - [Java SE Runtime Environment version 8 update 77 or later](https://java.com/download/manual.jsp). Add the java.exe path to the system environment variable path. For configuration instructions, see [How do I set or change the Path system variable?]( https://www.java.com/download/help/path.xml). The path is similar to C:\Program Files\Java\jdk1.8.0_77\jre\bin.
    - [.NET Core SDK 1.0.3 or .NET Core 1.1 runtime](https://www.microsoft.com/net/download).
    
- Linux (We recommend Ubuntu 14.04 LTS)

    - [Visual Studio Code]( https://www.visualstudio.com/products/code-vs.aspx). To install the code, enter the following command:

              sudo dpkg -i code_<version_number>_amd64.deb

    - [Mono 4.2.x](http://www.mono-project.com/docs/getting-started/install/linux/). 

        - To update the deb package source, enter the following commands:

                sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
                echo "deb http://download.mono-project.com/repo/debian wheezy/snapshots 4.2.4.4/main" | sudo tee /etc/apt/sources.list.d/mono-xamarin.list
                sudo apt-get update

        - To install Mono, enter the following command:

                sudo apt-get install mono-complete

		    > [!NOTE] 
            > Mono 4.6 is not supported. Uninstall version 4.6 entirely before you install 4.2.x.  

        - [Java SE Runtime Environment version 8 update 77 or later](https://java.com/download/manual.jsp). For instructions on installation, see the [Linux 64-bit installation instructions for Java]( https://java.com/en/download/help/linux_x64_install.xml) page.
        - [.NET Core SDK 1.0.3 or .NET Core 1.1 runtime](https://www.microsoft.com/net/download).
- MacOS

    - [Visual Studio Code]( https://www.visualstudio.com/products/code-vs.aspx).
    - [Mono 4.2.4](http://download.mono-project.com/archive/4.2.4/macos-10-x86/). 
    - [Java SE Runtime Environment version 8 update 77 or later](https://java.com/download/manual.jsp). For instructions on installation, see the [Linux 64-bit installation instructions for Java](https://java.com/en/download/help/mac_install.xml) page.
    - [.NET Core SDK 1.0.3 or .NET Core 1.1 runtime](https://www.microsoft.com/net/download).

## Install Data Lake Tools

After you install the prerequisites, you can install Data Lake Tools for VS Code.

**To install Data Lake Tools**

1. Open Visual Studio Code.
2. Select Ctrl+P, and then enter the following command:
```
ext install usql-vscode-ext
```
You can see a list of Visual Studio code extensions. One of them is **Azure Data Lake Tools**.

3. Select **Install** next to **Azure Data Lake Tools**. After a few seconds, the **Install** button changes to **Reload**.
4. Select **Reload** to activate the extension.
5. Select **OK** to confirm. You can see Azure Data Lake Tools in the **Extensions** pane.
    ![Data Lake Tools for Visual Studio Code Extensions pane](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-extensions.png)

## Activate Azure Data Lake Tools
Create a new .usql file or open an existing .usql file to activate the extension. 

## Connect to Azure

Before you can compile and run U-SQL scripts in Data Lake Analytics, you must connect to your Azure account.

**To connect to Azure**

1.	Select Ctrl+Shift+P to open the command palette. 
2.  Enter **ADL: Login**. The login information appears in the **Output** pane.

    ![Data Lake Tools for Visual Studio Code command palette](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-extension-login.png)
    ![Data Lake Tools for Visual Studio Code device login information](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-login-info.png)
3. Select Ctrl+click on the login URL: https://aka.ms/devicelogin to open the login webpage. Enter the code **G567LX42V** into the text box, and then select **Continue**.

   ![Data Lake Tools for Visual Studio Code login paste code](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-extension-login-paste-code.png )   
4.  Follow the instructions to sign in from the webpage. When you're connected, your Azure account name appears on the status bar in the lower-left corner of the **VS Code** window. 

    > [!NOTE] 
    > If your account has two factors enabled, we recommend that you use phone authentication rather than using a PIN.

To sign out, enter the command **ADL: Logout**.

## List your Data Lake Analytics accounts

To test the connection, get a list of your Data Lake Analytics accounts.

**To list the Data Lake Analytics accounts under your Azure subscription**

1. Select Ctrl+Shift+P to open the command palette.
2. Enter **ADL: List Accounts**. The accounts appear in the **Output** pane.

## Open the sample script
Open the command palette (Ctrl+Shift+P) and enter **ADL: Open Sample Script**. This opens another instance of this sample. You can also edit, configure, and submit script on this instance.

## Work with U-SQL

You need open either a U-SQL file or a folder to work with U-SQL.

**To open a folder for your U-SQL project**

1. From Visual Studio Code, select the **File** menu, and then select **Open Folder**.
2. Specify a folder, and then select **Select Folder**.
3. Select the **File** menu, and then select **New**. An Untitled-1 file is added to the project.
4. Enter the following code into the Untitled-1 file:

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

5. Save the file as **myUSQL.usql** in the opened folder. A adltools_settings.json configuration file is also added to the project.
4. Open and configure adltools_settings.json with the following properties:

    - Account:  A Data Lake Analytics account under your Azure subscription.
    - Database: A database under your account. The default is **master**.
    - Schema: A schema under your database. The default is **dbo**.
    - Optional settings:
        - Priority: The priority range is from 1 to 1000 with 1 as the highest priority. The default value is **1000**.
        - Parallelism: The parallelism range is from 1 to 150. The default value is the maximum parallelism allowed in your Azure Data Lake Analytics account. 
        
        > [!NOTE] 
        > If the settings are invalid, the default values are used.

    ![Data Lake Tools for Visual Studio Code configuration file](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-configuration-file.png)

    A compute Data Lake Analytics account is needed to compile and run U-SQL jobs. You must configure the computer account before you can compile and run U-SQL jobs.
    
After the configuration is saved, the account, database, and schema information appears on the status bar at the bottom-left corner of the corresponding .usql file. 
 
 
Compared to opening a file, when you open a folder you can:

- Use a code-behind file. In the single-file mode, code-behind is not supported.
- Use a configuration file. When you open a folder, the scripts in the working folder share a single configuration file.


The U-SQL script compiles remotely through the Data Lake Analytics service. When you issue the **compile** command, the U-SQL script is sent to your Data Lake Analytics account. Later, Visual Studio Code receives the compilation result. Due to the remote compilation, Visual Studio Code requires that you list the information to connect to your Data Lake Analytics account in the configuration file.

**To compile a U-SQL script**

1. Select Ctrl+Shift+P to open the command palette. 
2. Enter **ADL: Compile Script**. The compile results appear in the **Output** window. You can also right-click a script file, and then select **ADL: Compile Script** to compile a U-SQL job. The compilation result appears in the **Output** pane.
 

**To submit a U-SQL script**

1. Select Ctrl+Shift+P to open the command palette. 
2. Enter **ADL: Submit Job**.  You can also right-click a script file, and then select **ADL: Submit Job**. 

After you submit a U-SQL job, the submission logs appear in the **Output** window in VS Code. If the submission is successful, the job URL appears as well. You can open the job URL in a web browser to track the real-time job status.

To enable the output of the job details, set **jobInformationOutputPath** in the **vs code for the u-sql_settings.json** file.
 
## Use a code-behind file

A code-behind file is a C# file associated with a single U-SQL script. You can define a script dedicated to UDO, UDA, UDT, and UDF in the code-behind file. The UDO, UDA, UDT, and UDF can be used directly in the script without registering the assembly first. The code-behind file is put in the same folder as its peering U-SQL script file. If the script is named xxx.usql, the code-behind is named as xxx.usql.cs. If you manually delete the code-behind file, the code-behind feature is disabled for its associated U-SQL script. For more information about writing customer code for U-SQL script, see [Writing and Using Custom Code in U-SQL: User-Defined Functions]( https://blogs.msdn.microsoft.com/visualstudio/2015/10/28/writing-and-using-custom-code-in-u-sql-user-defined-functions/).

To support code-behind, you must open a working folder. 

**To generate a code-behind file**

1. Open a source file. 
2. Select Ctrl+Shift+P to open the command palette.
3. Enter **ADL: Generate Code Behind**. A code-behind file is created in the same folder. 

You can also right-click a script file, and then select **ADL: Generate Code Behind**. 

To compile and submit a U-SQL script with a code-behind file is the same as with the standalone U-SQL script file.

The following two screenshots show a code-behind file and its associated U-SQL script file:
 
![Data Lake Tools for Visual Studio Code code-behind](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-code-behind.png)

![Data Lake Tools for Visual Studio Code code-behind script file](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-code-behind-call.png) 

## Use assemblies

For information on developing assemblies, see [Develop U-SQL assemblies for Azure Data Lake Analytics jobs](data-lake-analytics-u-sql-develop-assemblies.md).

You can use Data Lake Tools to register custom code assemblies in the Data Lake Analytics catalog.

**To register an assembly**

You can register the assembly through the **ADL: Register Assembly** or **ADL: Register Assembly through Configuration** commands.

**To register through the ADL: Register Assembly command**
1.	Select Ctrl+Shift+P to open the command palette.
2.	Enter **ADL: Register Assembly**. 
3.	Specify the local assembly path. 
4.	Select a Data Lake Analytics account.
5.	Select a database.

Results: The portal is opened in a browser and displays the assembly registration process.  

Another convenient way to trigger the **ADL: Register Assembly** command is to right-click the .dll file in File Explorer. 

**To register though the ADL: Register Assembly through Configuration command**
1.	Select Ctrl+Shift+P to open the command palette.
2.	Enter **ADL: Register Assembly through Configuration**. 
3.	Specify the local assembly path. 
4.  The JSON file is displayed. Review and edit the assembly dependencies and resource parameters, if needed. Instructions are displayed in the **Output** window. To proceed to the assembly registration, save (Ctrl+S) the JSON file.

![Data Lake Tools for Visual Studio Code code-behind](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-register-assembly-advance.png)
>[!NOTE]
>- Assembly dependencies: Azure Data Lake Tools autodetects whether the DLL has any dependencies. The dependencies are displayed in the JSON file after they are detected. 
>- Resources: You can upload your DLL resources (for example, .txt, .png, and .csv) as part of the assembly registration. 

Another way to trigger the **ADL: Register Assembly through Configuration** command is to right-click the .dll file in File Explorer. 

The following U-SQL code demonstrates how to call an assembly. In the sample, the assembly name is *test*.

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

After you have connected to Azure, you can use the following steps to access the U-SQL catalog.

**To access the Azure Data Lake Analytics metadata**

1.	Select Ctrl+Shift+P, and then enter **ADL: List Tables**.
2.	Select one of the Data Lake Analytics accounts.
3.	Select one of the Data Lake Analytics databases.
4.	Select one of the schemas. You can see the list of tables.

## View Data Lake Analytics jobs

**To view Data Lake Analytics jobs**
1.  Open the command palette (Ctrl+Shift+P) and select **ADL: Show Job**. 
2.	Select a Data Lake Analytics or local account. 
3.  Wait for the jobs list for the account to appear.
4.	Select a job from job list, Data Lake Tools opens the job details in the Azure portal and displays the JobInfo file in VS Code.

![Data Lake Tools for Visual Studio Code IntelliSense object types](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-show-job.png)

## Azure Data Lake Storage integration

You can use Azure Data Lake Storage-related commands to:
 - Browse through the Azure Data Lake Storage resources. 
 - Preview the Azure Data Lake Storage file.  
 - Upload the file directly to Azure Data Lake Storage in VS Code. 

### List the storage path 
You can list the storage path through the command palette or through right-click.

**To list the storage path through the command palette**

1.  Open the command palette (Ctrl+Shift+P) and enter **ADL: List Storage Path**.

    ![Data Lake Tools for Visual Studio Code list storage path](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-storage.png)

2.  Select your preferred way for listing the storage path. This passage uses **Enter a path** as an example.

    ![Data Lake Tools for Visual Studio Code one way to list the storage path](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-account-selectoneway.png)

    > [!NOTE]
    >- VS Code keeps the last-visited path in every Data Lake Analytics account. For example: /tt/ss.
    >- Browser from root path: The list root path from your selected Data Lake Analytics account or a local path.
    >- Enter a path: List a specified path from your selected Data Lake Analytics account or a local path.
    
3. Select an account from the local path or a Data Lake Analytics account.

    ![Data Lake Tools for Visual Studio Code select more](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-account.png)

4. Select **more** to list more Data Lake Analytics accounts, and then select a Data Lake Analytics account.

    ![Data Lake Tools for Visual Studio Code select an account](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-select-adla-account.png)

5.  Enter an Azure storage path. For example, /output.

    ![Data Lake Tools for Visual Studio Code enter storage path](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-input-path.png)

6.  Results: The command palette lists the path information based on your entries.

    ![Data Lake Tools for Visual Studio Code list storage path results](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-path.png)

A more convenient way to list the relative path is through the right-click context menu.

**To list the storage path through right-click**

1.  Right-click the path string to select **List Storage Path**.

       ![Data Lake Tools for Visual Studio Code right-click context menu](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-right-click-path.png)

2. The selected relative path appears in the command palette.

   ![Data Lake Tools for Visual Studio Code selected relative path](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-relative-path.png)

3.  Select an account from the local path or a Data Lake Analytics account.

       ![Data Lake Tools for Visual Studio Code select an account](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-account.png)

4.  Results: The command palette lists the folders and files for the current path.

       ![Data Lake Tools for Visual Studio Code list from the current path](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-current.png)

### Preview the storage file
You can preview the storage file through the command palette or through right-click.

**To preview the storage file through the command palette**

1.  Open the command palette (Ctrl+Shift+P) and enter **ADL: Preview Storage File**.

       ![Data Lake Tools for Visual Studio Code preview storage file](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-preview.png)

2.  Select an account from the local path or a Data Lake Analytics account.

       ![Data Lake Tools for Visual Studio Code list account](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-account.png)

3.  Select **more** to list more Data Lake Analytics accounts, and then select a Data Lake Analytics account.

       ![Data Lake Tools for Visual Studio Code select an account](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-select-adla-account.png)

4.  Enter an Azure storage path or file. For example, /output/SearchLog.txt.

       ![Data Lake Tools for Visual Studio Code enter storage path and file](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-input-preview-file.png)

5.  Results: The command palette lists the path information based on your entries.

       ![Data Lake Tools for Visual Studio Code preview file result](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-preview-results.png)

**To list the storage path through right-click**

1.  To preview a file, right-click the file path.

   ![Data Lake Tools for Visual Studio Code right-click context menu](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-right-click-preview.png) 

2.  Select an account from the local path or a Data Lake Analytics account.

       ![Data Lake Tools for Visual Studio Code select an account](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-account.png)

3.  Results: VS Code displays the preview results of the file.

       ![Data Lake Tools for Visual Studio Code preview file result](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-preview-results.png)

### Upload a file 

You can upload files by entering the commands **ADL: Upload File** or **ADL: Upload File through Configuration**.

**To upload files though the ADL: Upload File command**
1. Select Ctrl+Shift+P to open the command palette or right-click the script editor, and then enter **Upload File**.
2.  To upload the file, enter a local path.

    ![Data Lake Tools for Visual Studio Code enter local path](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-auto-input-local-path.png)

3. Select one of the ways of listing the storage path. This passage uses **Enter a path** as an example.

    ![Data Lake Tools for Visual Studio Code list storage path](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-account-selectoneway.png)
    >[!NOTE]
    >- VS Code keeps the last-visited path in every Data Lake Analytics account. For example: /tt/ss.
    >- Browser from root path: The list root path from your selected Data Lake Analytics account or a local path.
    >- Enter a path: List a specified path from your selected Data Lake Analytics account or a local path.

4. Select an account from the local path or a Data Lake Analytics account.

    ![Data Lake Tools for Visual Studio Code right-click storage](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-list-account.png)

5. Enter an Azure storage path. For example: /output.

       ![Data Lake Tools for Visual Studio Code enter storage path](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-input-preview-file.png)

6. Find your Azure storage path. Select **Choose current folder**.

    ![Data Lake Tools for Visual Studio Code select a folder](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-choose-current-folder.png)

7.  Results: The **Output** window displays the file upload status.

       ![Data Lake Tools for Visual Studio Code upload status](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-upload-status.png)    

**To upload files though the ADL: Upload File through Configuration command**
1.  Select Ctrl+Shift+P to open the command palette or right-click the script editor, and then enter **Upload File through Configuration**.
2.  VS Code displays a JSON file. You can enter file paths and upload multiple files at the same time. Instructions are displayed in the **Output** window. To proceed to upload the file, save (Ctrl+S) the JSON file.

       ![Data Lake Tools for Visual Studio Code file path](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-upload-file.png)

3.  Results: The **Output** window displays the file upload status.

       ![Data Lake Tools for Visual Studio Code upload status](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-upload-status.png)     

Another way to upload a file to storage is through the right-click menu on the file's full path or the file's relative path in the script editor. Enter the local file path, and then select the account. The **Output** window displays the upload status. 

### Open Azure Storage Explorer
You can open **Azure Storage Explorer** by entering the command **ADL: Open Web Azure Storage Explorer** or by selecting it from the right-click context menu.

**To open Azure Storage Explorer**

1. Select Ctrl+Shift+P to open the command palette.
2. Enter **Open Web Azure Storage Explorer** or right-click on a relative path or the full path in the script editor, and then select **Open Web Azure Storage Explorer**.
3. Select a Data Lake Analytics account.

Data Lake Tools opens the Azure storage path in the Azure portal. You can find the path and preview the file from the web.

### Local run and local debug for Windows users
U-SQL local run tests your local data and validates your script locally, before your code is published to Data Lake Analytics. The local debug feature enables you to complete the following tasks before your code is submitted to Data Lake Analytics: 
- Debug your C# code-behind. 
- Step through the code. 
- Validate your script locally.

For instructions on local run and local debug, see [U-SQL local run and local debug with Visual Studio Code](data-lake-tools-for-vscode-local-run-and-debug.md).

## Additional features

Data Lake Tools for VS Code supports the following features:

-	IntelliSense auto-complete: Suggestions appear in pop-up windows around items, such as keywords, methods, and variables. Different icons represent different types of the objects:

    - Scala data type
    - Complex data type
    - Built-in UDTs
    - .NET collection and classes
    - C# expressions
    - Built-in C# UDFs, UDOs, and UDAAGs 
    - U-SQL functions
    - U-SQL windowing function
 
    ![Data Lake Tools for Visual Studio Code IntelliSense object types](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-auto-complete-objects.png)
 
-	IntelliSense auto-complete on Data Lake Analytics metadata: Data Lake Tools downloads the Data Lake Analytics metadata information locally. The IntelliSense feature automatically populates objects, including the database, schema, table, view, table-valued function, procedures, and C# assemblies, from the Data Lake Analytics metadata.
 
    ![Data Lake Tools for Visual Studio Code IntelliSense metadata](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-auto-complete-metastore.png)

-	IntelliSense error marker: Data Lake Tools underlines the editing errors for U-SQL and C#. 
-	Syntax highlights: Data Lake Tools uses different colors to differentiate items, such as variables, keywords, data type, and functions. 

    ![Data Lake Tools for Visual Studio Code syntax highlights](./media/data-lake-analytics-data-lake-tools-for-vscode/data-lake-tools-for-vscode-syntax-highlights.png)

## Next steps

- For U-SQL local run and local debug with Visual Studio Code, see [U-SQL local run and local debug with Visual Studio Code](data-lake-tools-for-vscode-local-run-and-debug.md).
- For getting-started information on Data Lake Analytics, see [Tutorial: Get started with Azure Data Lake Analytics](data-lake-analytics-get-started-portal.md).
- For information about Data Lake Tools for Visual Studio, see [Tutorial: Develop U-SQL scripts by using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
- For information on developing assemblies, see [Develop U-SQL assemblies for Azure Data Lake Analytics jobs](data-lake-analytics-u-sql-develop-assemblies.md).



