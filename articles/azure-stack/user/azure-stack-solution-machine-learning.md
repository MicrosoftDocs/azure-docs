---
title: Create an edge machine learning solution with Azure and Azure Stack | Microsoft Docs
description: Learn how to create an edge machine learning solution using Python with Azure and Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 09/26/2018
ms.author: mabrigg
ms.reviewer: Anjay.Ajodha
---

# Tutorial: Create an edge machine learning solution with Azure and Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Learn how to create an edge machine learning solution with Azure and Azure Stack.

In this tutorial, you will build a sample environment to:

> [!div class="checklist"]
> - Create a storage account and container for clean data to reside.
> - Create an Ubuntu Data Science Virtual Machine (DSVM) in Azure portal.
> - Deploy Azure Machine Learning Services in Azure to build and train models.
> - Create Azure Machine Learning services accounts.
> - Deploy and use Azure Container Registry.
> - Deploy a Kubernetes cluster to Azure Stack.
> - Create an Azure Stack storage account and Storage Queue for data.
> - Create a New Azure Stack function to move the Clean Data from Azure Stack to Azure.

**When to use this solution**

 -  Your organization is using a DevOps approach, or has one planned for the near future.
 -  You want to implement CI/CD practices across your Azure Stack implementation and the public cloud.
 -  You want to consolidate the CI/CD pipeline across cloud and on-premises environments.
 -  You want the ability to develop applications using cloud or on-premises services.
 -  You want to leverage consistent developer skills across cloud and on-premises applications.

> [!Tip]  
> ![hybrid-pillars.png](./media/azure-stack-solution-cloud-burst/hybrid-pillars.png)  
> Microsoft Azure Stack is an extension of Azure. Azure Stack brings the agility and innovation of cloud computing to your on-premises environment and enabling the only hybrid cloud that allows you to build and deploy hybrid apps anywhere.  
> 
> The whitepaper [Design Considerations for Hybrid Applications](https://aka.ms/hybrid-cloud-applications-pillars) reviews pillars of software quality (placement, scalability, availability, resiliency, manageability and security) for designing, deploying, and operating hybrid applications. The design considerations assist in optimizing hybrid application design, minimizing challenges in production environments.

## Prerequisites

A few components are required to build this use case and may take some time to prepare:

 -  An Azure OEM/Hardware Partner may deploy a production Azure Stack and all users may deploy an ASDK

 -  An Azure Stack Operator must also deploy the App Service, create plans and offers, create a tenant subscription, and add the Windows Server 2016 image

 -  A hybrid network and App Service setup is required (Learn more about [App integration with VNets.](https://docs.microsoft.com/azure/app-service/web-sites-integrate-with-vnet))

 -  The Private [Build and Release Agent](https://docs.microsoft.com/vsts/pipelines/agents/agents?view=vsts) for VSTS Integration must be set up prior to deployment (Ensure any existing components used meet the requirements before beginning.)

Prior knowledge of Azure and Azure Stack is required. To learn more before proceeding, start with these topics:

 -  [Introduction to Azure](https://azure.microsoft.com/overview/what-is-azure/)

 -  [Azure Stack Key Concepts](https://docs.microsoft.com/azure/azure-stack/azure-stack-key-features)

 -  [Azure Stack Hybrid CI/CD Solution Guide](/azure/azure-stack/user/azure-stack-solution-pipeline)

**Azure**

 -  An Azure subscription (Create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F))

 -  A new Web App URL created by [Web App](https://docs.microsoft.com/azure/app-service/app-service-web-overview) in Azure

 -  Deployment of [Azure Container Services (ACS) Kubernetes on Azure](https://docs.microsoft.com/azure/azure-stack/user/azure-stack-solution-template-kubernetes-deploy)

 -  Deployment of Azure Machine Learning service (preview) [4-part tutorial](https://docs.microsoft.com/azure/machine-learning/desktop-workbench/tutorial-classifying-iris-part-1)

 -  Azure Machine Learning Experimentation [account](https://docs.microsoft.com/azure/machine-learning/desktop-workbench/experimentation-service-template)

**Azure Stack**

 -  An Azure Stack Integrated System or deployment of Azure Stack Development Kit.

    - You find instructions for installing Azure Stack at [Install the Azure Stack Development Kit](/articles/azure-stack/asdk/asdk-install).
     - [https://github.com/mattmcspirit/azurestack/blob/master/deployment/ConfigASDK.ps1](https://github.com/mattmcspirit/azurestack/blob/master/deployment/ConfigASDK.ps1) This installation may require a few hours to complete.

 -  Deployment of [App Service](https://docs.microsoft.com/azure/azure-stack/azure-stack-app-service-deploy) PaaS services to Azure Stack

 -  A [Plan/Offers](https://docs.microsoft.com/azure/azure-stack/azure-stack-plan-offer-quota-overview) within the Azure Stack environment

 -  A [Tenant subscription](https://docs.microsoft.com/azure/azure-stack/azure-stack-subscribe-plan-provision-vm) within the Azure Stack environment

 -  An Ubuntu Server VM Image (available in [Azure Stack Marketplace](https://buildazure.com/2016/05/04/azure-marketplace-ubuntu-server-16-04-lts/)) This VM will be built in the tenant subscription on the Azure Stack as the private build agent as well as the Kubernetes VMs. If this image is not available, the Azure Stack Operator can assist, to ensure this is added to the environment. (Do not use the 18.04 build of ubuntu, as it is currently not supported.)

 -  A Web App within the tenant subscription (Note the new Web App URL for later use.)

 -  Deployment of VSTS Linux-based Private Build Agent Virtual Machine, within the tenant subscription

 -  Deployment an [Azure Container Services (ACS) Kubernetes on Azure Stack](https://docs.microsoft.com/azure/azure-stack/user/azure-stack-solution-template-kubernetes-deploy)

**Developer tools**

 -  [VSTS workspace](https://www.visualstudio.com/docs/setup-admin/team-services/sign-up-for-visual-studio-team-services) (The sign-up process creates a project named "MyFirstProject")

 -  [Visual Studio 2017](https://docs.microsoft.com/visualstudio/install/install-visual-studio) installation and [VSTS](https://www.visualstudio.com/docs/setup-admin/team-services/connect-to-visual-studio-team-services) sign-on

 -  [Local clone](https://www.visualstudio.com/docs/git/gitquickstart) of project

 -  [Linux Subsystem for Windows 10](https://docs.microsoft.com/windows/wsl/install-win10) installation (for BASH and SSH)

 -  [Docker for Windows](https://download.docker.com/win/stable/Docker%20for%20Windows%20Installer.exe) installation

 -  [Azure Machine Learning Workbench (preview)](https://aka.ms/azureml-wb-msi) installation

 -  [Python](https://www.python.org/ftp/python/3.7.0/python-3.7.0rc1-amd64.exe) environment installation

**VSTS**

 -  **VSTS Account.** Quickly set up continuous integration for build, test, and deployment. For more information about VSTS accounts, see [Create the VSTS Account](https://docs.microsoft.com/vsts/accounts/create-account-msa-or-work-student?view=vsts).

 -  **Code Repository.** Using existing code repositories in GitHub, BitBucket, DropBox, One Drive, and TFS, the VSTS platform can leverage multiple code repositories to streamline the development pipeline. For more information about code repositories see [Get Started with Git and VSTS](https://docs.microsoft.com/vsts/git/gitquickstart?view=vsts&tabs=visual-studio) tutorial.

 -  **Service Connection.** Connect to external and remote services to execute tasks for testing, build or deployment. For more information about VSTS service connections see [Service Endpoints for Build and Release](https://docs.microsoft.com/vsts/build-release/concepts/library/service-endpoints?view=vsts).

 -  **Build Definitions.** Define automated build processes and compose a set of tasks via the task catalog. For more information about build definitions see [Create a Build Definition](https://docs.microsoft.com/vsts/build-release/actions/ci-cd-part-1?view=vsts) documentation.

 -  **Release Definitions.** Define the deployment process for a collection of environments where application artifacts are deployed. For more information about release definitions see [Create a Release Definition](https://docs.microsoft.com/vsts/build-release/actions/ci-cd-part-1?view=vsts) documentation.

 -  **Hosted VSTS Linux Build Agent Pool.** Quickly build, test and deploy applications using a Microsoft managed and maintained hosted agent. For more information about hosted VSTS build agents see [Hosted Agents](https://docs.microsoft.com/vsts/build-release/concepts/agents/hosted?view=vsts) documentation.

## Step 1: Create a storage account

Create a storage account and container for clean data to reside.

1.  Sign in to the [*Azure portal*](https://portal.azure.com/).

2.  In the Azure portal, expand the menu on the left side to open the menu of services and choose **All Services**. Scroll down to **Storage** and choose **Storage accounts**. In the **Storage Accounts **window choose **Add**.

3.  Enter a name for the storage account.

    > [!Note]  
    > Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. The storage account name must be unique within Azure. The Azure portal will indicate if the storage account name selected is already in use.

4.  Specify the deployment model to be used: **Resource Manager**.

5.  Select the type of storage account: **General purpose V1**, then specify the performance tier: **Standard**.

6.  Select the replication option for the storage account: **GRS**.

7.  Select new storage account subscription.

8.  Specify a new resource group or select an existing resource group.

9.  Select the geographic location for the storage account.

10. Select **Create** to create the storage account.

    ![Alt text](\media\azure-stack-solution-machine-learning\image1.png)

11.  Choose the storage account recently created.

12.  Select on **Blobs**.

    ![Alt text](media\azure-stack-solution-machine-learning\image2.png)

13.  Select on **+ Container** and select on **Container**.

    ![Alt text](media\azure-stack-solution-machine-learning\image3.png)

14.  Give the container the name **uploadeddata** and choose the access type **Container**.

15.  Select on **Create**.

    ![Alt text](media\azure-stack-solution-machine-learning\image4.png)

## Step 2: Create a Data Science Virtual Machine

Create an Ubuntu Data Science Virtual Machine (DSVM) in the Azure portal.

1.  Log on to Azure portal from [https://portal.azure.com](https://portal.azure.com/)

2.  Select on the **+NEW** link, and search for "Data Science Virtual Machine for Linux Ubuntu CSP

    ![Alt text](media\azure-stack-solution-machine-learning\image5.png)

1.  Choose **Data Science Virtual Machine for Linux (Ubuntu)** in the list and follow the on-screen instructions to create the DSVM.

    ![Alt text](media\azure-stack-solution-machine-learning\image6.png)

> ![Important]  
> **Choose** Password** as the*Authentication type*.

Place the new DSVM in the same resource group as the newly created storage account. All Edge ML objects are deployed in Azure within this Resource Group.

1.  In the Settings  Configure optional features

    a.  Select the **Storage Account** created earlier.

    b.  Create a new **Virtual Network**, **Subnet**, and **Public IP**  It should by default create a name based on the Resource group name.

    c.  Create a new **NSG**  it should automatically create this with the correct rules already applied.

    d.  For the **Diagnostics Storage Account**, select the storage account created earlier.

    e.  Note: With AAD enabled and configured for the Azure Subscription, managed identities for Azure resources can be enabled as well.

2.  Select **OK**.

### Connect to the DSVM

Once the DSVM has been created, connect to the VM from Windows Subsystem for Linux.

```Bash  
    ssh <user>@<DSVM Public IP>
```

1.  Type YES when prompted to confirm the VM connection.

2.  Enter the password created for the DSVM.

### Update the DSVM 

```Bash  
sudo su 
apt-get update 
apt-get -y upgrade 
apt-get -y dist-upgrade 
apt-get -y autoremove
```

## Step 3: Deploy Azure Machine Learning Services

Deploy Azure Machine Learning Services in Azure.

Azure Machine Learning services (preview) are an integrated, end-to-end data science and advanced analytics solution. It helps professional data scientists prepare data, develop experiments, and deploy models at cloud scale.

This section explains:

> [!div class="checklist"]
> - Create service accounts for Azure Machine Learning services
> - Install and log in to Azure Machine Learning Workbench.
> - Create a project in Workbench
> - Run a script in that project
> - Access the command-line interface (CLI)

As part of the Microsoft Azure portfolio, Azure Machine Learning services require an Azure subscription. To obtain an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

Adequate permissions are required to create assets such as Resource Groups, Virtual Machines, and other assets.

The Azure Machine Learning Workbench application may be installed on the following operating systems:

 -  Windows 10 or Windows Server 2016
 -  macOS Sierra or High Sierra

## Step 4: Create Azure Machine Learning services

Create Azure Machine Learning services accounts.

Use the Azure portal to provision the Azure Machine Learning accounts:

1.  Sign in to the [Azure portal](https://portal.azure.com/) using the credentials for the Azure subscription to be used. To obtain an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

    ![Alt text](media\azure-stack-solution-machine-learning\image7.png)

1.  Select the **Create a resource** button (+) in the upper-left corner of the portal.

    ![Create a resource in Azure portal](media\azure-stack-solution-machine-learning\image8.png)

1.  Enter **Machine Learning** in the search bar. Select the search result named **Machine Learning Experimentation (preview)**.

    ![Azure Machine Learning search](media\azure-stack-solution-machine-learning\image9.png)

1.  In the **Machine Learning Experimentation** pane, scroll to the bottom and select **Create** to begin defining the experimentation account.

    ![Azure Machine Learning - create experimentation account](media\azure-stack-solution-machine-learning\image10.png)

1.  In the **ML Experimentation** pane configure the Machine Learning Experimentation account.

    | Setting | Suggested value for tutorial | Description |
    |---------------------------------------|----------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | Experimentation account name | Unique name | Enter a unique name that identifies the account. Use a department or project name that best identifies the experiment. The name should be 2 to 32 characters. It should include only alphanumeric characters and the dash (-) character. |
    | Subscription | The subscription | Choose the Azure subscription to use for the experiment. If multiple subscriptions exist, choose the appropriate subscription in which the resource is billed. |
    | Resource group | The resource group | Use an existing resource group in the subscription, or enter a name to create a new resource group for this experimentation account. |
    | Location | The region closest to the users | Choose the location closest to the users and the data resources. |
    | Number of seats | 2 | Enter the number of seats. Learn how [seating impacts pricing](https://azure.microsoft.com/pricing/details/machine-learning/).<br><br>For this Quickstart, only two seats are needed. Seats can be added or removed as needed in the Azure portal. |
    | Storage account | Unique name | Select **Create new** and provide a name to create an [Azure storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account?tabs=portal). The name should be 3 to 24 characters, and should include only alphanumeric characters. Alternatively, select **Use existing** and select the existing storage account from the  list. The storage account is required and is used to hold project artifacts and run history data. |
    | Workspace for Experimentation account | IrisGarden<br>(name used in tutorials) | Provide a name for a workspace for this account. The name should be 2 to 32 characters. It should include only alphanumeric characters and the dash (-) character. This workspace contains tools needed to create, manage, and publish experiments. |
    | Assign owner for the workspace | The account | Select the own account as the workspace owner. |
    | Create Model Management account | **check** | Create a Model Management account. This will be used to deploy and manage the models as real-time web services. <br><br>While optional, creating the Model Management account at the same time as the Experimentation account is recommended. |
    | Account name | Unique name | Choose a unique name that identifies the Model Management account. Use the departmental or project name that best identifies the experiment. The name should be 2 to 32 characters. It should include only alphanumeric characters and the dash (-) character. |
    | Model Management pricing tier | **DEVTEST** | Select **No pricing tier selected** to specify the pricing tier for the new Model Management account. For cost savings, select the DEVTEST pricing tier if it's available on the subscription (limited availability). Otherwise, select the S1 pricing tier. Choose Select to save the pricing tier selection. |
    | Pin to dashboard | check | Select the **Pin to dashboard** option to allow easy tracking of the Machine Learning Experimentation account on the front dashboard page of the Azure portal. |

    ![Machine Learning Experimentation account configuration](media\azure-stack-solution-machine-learning\image11.png)

1.  Select **Create** to begin the creation process of the Experimentation account along with the Model Management account.

    ![Machine Learning Experimentation account configuration](media\azure-stack-solution-machine-learning\image12.png)

    It may take a few moments to create an account. Check the status of the deployment process by selecting the Notifications icon (bell) on the Azure portal toolbar.

    ![Azure portal notifications](media\azure-stack-solution-machine-learning\image13.png)

### Install and log in to workbench 

Azure Machine Learning Workbench is available for Windows or macOS. See the list of [supported platforms](https://docs.microsoft.com/azure/machine-learning/service/quickstart-installation).

**Warning:** The installation might take around an hour to complete.

1.  Download and launch the latest Workbench installer.

    > [!Important]  
    > Download the installer fully on disk, and then run it from there. Do not run it directly from the browser's download widget.<br>**On Windows:<br>** a. Download [AmlWorkbenchSetup.msi](https://aka.ms/azureml-wb-msi).<br>b. Double-click on the downloaded installer in File Explorer.

1.  Follow the on-screen instructions in the installer to completion.

    **The installation might take as much as 30 minutes to complete. **
    
    `Windows: C:\\Users\\<user>\\AppData\\Local\\AmlWorkbench`
    
    The installer will download and set up all the necessary dependencies,  such as Python, Miniconda, and other related libraries. This  installation also includes the Azure cross-platform command-line tool,  or Azure CLI.

1.  Launch Workbench by selecting the **Launch Workbench** button on the last screen of the installer.

    If installer is closed, launch using the **Machine Learning  Workbench** desktop shortcut.

1.  Select **Sign in with Microsoft** to authenticate with the Azure Machine Learning Workbench. Use the same credentials used in the Azure portal to create the Experimentation and Model Management accounts.

    Once signed in, Workbench uses the first Experimentation account it finds in the Azure subscriptions, and displays all workspaces and projects associated with that account.

    > [!Tip]  
    > Switch to a different Experimentation account using the icon in the lower-left corner of the Workbench application window.

### Create a new project in workbench

1.  Open the Azure Machine Learning Workbench app and sign in if needed.

    - On Windows, launch using the **Machine Learning Workbench** desktop shortcut.

    - On macOS, select **Azure ML Workbench** in Launchpad.

1.  Select the plus sign (+) in the **PROJECTS** pane and choose **New Project**.

    ![New workspace](media\azure-stack-solution-machine-learning\image14.png)

1.  Fill out of the form fields and select the **Create** button to create a new project in the Workbench.

    | Field | Suggested value for tutorial | Description |
    |-------------------------------------|------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | Project name | myIris | Enter a unique name that identifies the account. Use the departmental or project name that best identifies the experiment. The name should be 2 to 32 characters. It should include only alphanumeric characters and the dash (-) character. |
    | Project directory | c:\Temp\ | Specify the directory in which the project is created. |
    | Project description | leave blank | Optional field useful for describing the projects. |
    | Visualstudio.com GIT Repository URL | leave blank | Optional field. Associate a project with a Git repository on Visual Studio Team Services for source control and collaboration. [Learn how to set up a repository](https://docs.microsoft.com/azure/machine-learning/desktop-workbench/using-git-ml-project). |
    | Selected workspace | IrisGarden (if it exists) | Choose a workspace created for the Experimentation account in the Azure portal. <br>Using Quickstart, the workspace by the name of IrisGarden is listed. Otherwise, use the workspace with the name of the Experimentation account, or a preferred account name. |
    | Project template | Classifying Iris | Templates contain scripts and data used to explore the product. This template contains the scripts and data needed for this quickstart and other tutorials in this documentation site. |

    ![New project](media\azure-stack-solution-machine-learning\image15.png)

1.  A new project is created and the project dashboard opens with that project. Explore the project home page, data sources, notebooks, and source code files.

    ![Open project](media\azure-stack-solution-machine-learning\image16.png)

### Attach a DSVM compute target

Once the DSVM is created, attach it to the Azure ML project.

1.  From within the Azure ML Workbench app, start the Azure ML Workbench CLI by selecting **File**->**Open PowerShell**

    ![Alt text](media\azure-stack-solution-machine-learning\image17.png)

1.  Once the PowerShell prompt has opened use the following command:

    ```PowerShell  
        az login
    ```

1.  Receive the following prompt:

     ![Alt text](media\azure-stack-solution-machine-learning\image18.png)

1.  Browse to the site as detailed in the prompt and enter the code that is provided.

    ![Alt text](media\azure-stack-solution-machine-learning\image19.png)

1.  Select Continue when prompted, then select the Azure account the Azure ML Experimental Account is associated with.

    ![Alt text](media\azure-stack-solution-machine-learning\image20.png)

1.  The Azure ML Workbench CLI will then send the following prompt:

    ![Alt text](media\azure-stack-solution-machine-learning\image21.png)

1.  When ML Account and workspace login is shown as successful, attach the DSVM.

    ```PowerShell  
        az ml computetarget attach remotedocker --name <compute target name> --address <ip address or FQDN> --username <admin username> --password <admin password>
    ```

    The following notification will appear:

    ![Alt text](media\azure-stack-solution-machine-learning\image22.png)

    ```PowerShell  
        # prepare the Docker image on the DSVM 
        az ml experiment prepare -c <compute target name>
    ```

This process will take some time, and will generate a significant amount of text as it pulls various docker images down, registers them, and then applies the needed code and applications to them.

Experiments can now be run on this DSVM.

### Create a data preparation package

Next, start preparing the data in Azure Machine Learning Workbench. Each transformation performed in Workbench is stored in a JSON format in a local data preparation package (\*.dprep file). This data preparation package is the primary container for the data preparation work in Workbench.

This data preparation package can be handed off later to a runtime, such as local-C\#/CoreCLR, Scala/Spark, or Scala/HDI.

1.  Select the folder icon to open the Files view, then select **iris.csv** to open that file.

    This file contains a table with 5 columns and 50 rows. Four columns  are numerical feature columns. The fifth column is a string target  column. None of the columns have header names.

    ![iris.csv](media\azure-stack-solution-machine-learning\image23.png)

1.  In the **Data view**, select the plus sign (**+**) to add a new data source. The **Add Data Source** page opens.

    ![Data view in Azure Machine Learning Workbench](media\azure-stack-solution-machine-learning\image24.png)

1.  Select **Text Files(\*.csv, \*.json, \*.txt., ...)**.

    ![Data Source in Azure Machine Learning Workbench](media\azure-stack-solution-machine-learning\image25.png)

1.  Select **Next**.

2.  Browse to the file **iris.csv**, and select **Finish**. This will use default values for parameters such as the separator and data types.

    > [!Important]  
    > Select the **iris.csv** file from within the current project directory for this exercise. Otherwise, later steps may fail.

    ![Select iris](media\azure-stack-solution-machine-learning\image26.png)

1.  A new file named `*iris-1.dsource` is created. The file is named uniquely with `-1` because the sample project already comes with an unnumbered **iris.dsource** file.

    The file opens, and the data is shown. A series of column headers,  from **Column1** to **Column5**, is automatically added to this data  set. Scroll to the bottom and notice that the last row of the data set  is empty. The row is empty because of the extra line break in the CSV  file.

    ![Iris data view](media\azure-stack-solution-machine-learning\image27.png)

1.  Select the **Metrics** button. Histograms are generated and displayed.

    Switch back to the data view by selecting the **Data** button.

    ![Iris data view](media\azure-stack-solution-machine-learning\image28.png)

1.  Observe the histograms. A complete set of statistics has been calculated for each column.

    ![Iris data view](media\azure-stack-solution-machine-learning\image29.png)

1.  Begin creating a data preparation package by selecting the **Prepare** button. The **Prepare** dialog box opens.

    The sample project contains a **iris.dprep** data preparation file  that is selected by default.

    ![Iris data view](media\azure-stack-solution-machine-learning\image30.png)

1.  Create a new data preparation package by selecting **+ New Data Preparation Package** from the menu.

    ![Iris data view](media\azure-stack-solution-machine-learning\image31.png)

1.  Enter a new value for the package name (use **iris-1**) and then select **OK**.

    A new data preparation package named **iris-1.dprep** is created and  opened in the data preparation editor.

    ![Iris data view](media\azure-stack-solution-machine-learning\image32.png)

    Next, data preparation is needed.

1.  Select each column header to make the header text editable. Then, rename each column as follows:

    In order, enter **Sepal Length**, **Sepal Width**, **Petal  Length**, **Petal Width**, and **Species** for the five columns  respectively.

    ![Rename the columns](media\azure-stack-solution-machine-learning\image33.png)

1.  Count distinct values:

    1.  Select the **Species** column

    2.  Right-click to select it.

    3.  Select **Value Counts** from the menu.

        The **Inspectors** pane opens below the data. A histogram with four  bars appears. The target column has four distinct  values: **Iris-virginica**, **Iris-versicolor**,**Iris-setosa**, and a **(null)** value.

    ![Select Value Counts](media\azure-stack-solution-machine-learning\image34.png)

    ![Value count histogram](media\azure-stack-solution-machine-learning\image35.png)

1.  To filter out the null values, select the "(null)" bar and then select the minus sign (**-**).

    Then, the (null) row turns gray to indicate that it was filtered out.

    ![Filter out nulls](media\azure-stack-solution-machine-learning\image36.png)

1.  Take notice of the individual data preparation steps that are detailed in the **STEPS** pane. As columns are renamed and null value rows are filtered, each action is recorded as a data preparation step. Edit individual steps to adjust their settings, reorder the steps, and remove steps.

    ![Alt text](media\azure-stack-solution-machine-learning\image37.png)

1.  Close the data preparation editor. Select the **x** icon on the **iris-1** tab with the graph icon to close the tab. The work is automatically saved into the **iris-1.dprep** file shown under the **Data Preparations** heading.

    ![Close](media\azure-stack-solution-machine-learning\image38.png)

### Generate Python code to invoke a data preparation package

The output of a data preparation package can be explored directly in Python or in a Jupyter Notebook. The packages can be executed across multiple runtimes including local Python, Spark (including in Docker), and HDInsight.

1.  Find the **iris-1.dprep** file under the Data Preparations tab.

2.  Right-click the **iris-1.dprep** file, and select **Generate Data Access Code File** from the context menu.

    ![Generate code](media\azure-stack-solution-machine-learning\image39.png)

    A new file named **iris-1.py** opens with the following lines of code to invoke the logic created as a data preparation package:

    ```Python
    # Use the Azure Machine Learning data preparation package
    from azureml.dataprep import package

    # Use the Azure Machine Learning data collector to log various metrics
    from azureml.logging import get_azureml_logger
    logger = get_azureml_logger()

    # This call will load the referenced package and return a DataFrame.
    # If run in a PySpark environment, this call returns a
    # Spark DataFrame. If not, it will return a Pandas DataFrame.
    df = package.run('iris-1.dprep', dataflow_idx=0)
    # Remove this line and add code that uses the DataFrame
    df.head(10)
    ```

    Depending on the context in which this code is run, drep represents a different kind of DataFrame:

    -  When executing on a Python runtime, a [pandas DataFrame](https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.html) is used.

    -  When executing in a Spark context, a [Spark DataFrame](https://spark.apache.org/docs/latest/sql-programming-guide.html) is used.

### Review iris_sklearn.py and the configuration files

1.  In the open project, select the **Files** button (the folder icon) on the far-left pane to open the file list in the project folder.

    ![Open the Azure Machine Learning Workbench project](media\azure-stack-solution-machine-learning\image40.png)

1.  Select the **iris_sklearn.py** Python script file.

    ![Choose a script](media\azure-stack-solution-machine-learning\image41.png)

    The code opens in a new text editor tab inside the Workbench.

    > [!Note]  
    > The code displayed may not be exactly the same as the preceding code because this sample project is updated frequently.

    ![Open a file](media\azure-stack-solution-machine-learning\image42.png)

1.  Inspect the Python script code to become familiar with the coding style.

    The script **iris_sklearn.py** performs the following tasks:  

    -  Loads the default data preparation package called **iris.dprep** to create a [pandas DataFrame](https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.html).

    -   Adds random features to make the problem more difficult to solve. Randomness is necessary because Iris is a small data set that is easily classified with nearly 100% accuracy.

    -  Uses thescikit-learnmachine learning library to build a logistic regression model. This library comes with Azure Machine Learning Workbench by default.

    -  Serializes the model using the [pickle](https://docs.python.org/3/library/pickle.html) library into a file in the `outputs` folder.

    -  Loads the serialized model, and then deserializes it back into memory.

    -  Uses the deserialized model to make a prediction on a new record.

    -  Plots two graphs, a confusion matrix and a multi-class receiver operating characteristic (ROC) curve, using the [matplotlib](https://matplotlib.org/) library, and then saves them in theoutputsfolder. Install this library in the environment if not apparent.

    -  Plots the regularization rate and model accuracy in the run history automatically. The `run_logger` object is used throughout to record the regularization rate and the model accuracy into the logs.

### Run iris_sklearn.py in the local environment

1.  Start the Azure Machine Learning command-line interface (CLI):

    1.  Launch the Azure Machine Learning Workbench.

    2.  From the Workbench menu, select **File**> **Open Command Prompt**.

    The Azure Machine Learning command-line interface (CLI) window starts in the project folder `C:\Temp\\myIris\` on Windows. This project is the same as the one created in Part 1 of the tutorial.

    > [!Important]  
    > Use this CLI window to accomplish the next steps.

1.  In the CLI window, install the Python plotting library **matplotlib**, if not already installed.

    The **iris_sklearn.py** script has dependencies on two Python packages: **scikit-learn** and **matplotlib**. The **scikit-learn** package is installed by Azure Machine Learning Workbench for the convenience. Still, installation of **matplotlib** may be required.

    If proceeding without installing **matplotlib**, the code in this tutorial can still run successfully. However, the code will not be able to produce the confusion matrix output and the multi-class ROC curve plots shown in the history visualizations.

    ```CLI
    pip install matplotlib
    python -m pip install --upgrade pip
    ```

    This install takes about a minute.

1.  Return to the Workbench application.

2.  Find the tab called **iris_sklearn.py**.

    ![Find tab with script](media\azure-stack-solution-machine-learning\image43.png)

1.  In the toolbar of that tab, select **local** as the execution environment, andiris_sklearn.pyas the script to run. These may already be selected.

    ![Alt text](media\azure-stack-solution-machine-learning\image44.png)

1.  Move to the right side of the toolbar and enter0.01in the **Arguments** field.

    This value corresponds to the regularization rate of the logistic  regression model.

    ![Local and script choice](media\azure-stack-solution-machine-learning\image45.png)

1.  Select the **Run** button. A job is immediately scheduled. The job is listed in the **Jobs** pane on the right side of the workbench window.

    ![Local and script choice](media\azure-stack-solution-machine-learning\image46.png)

    After a few moments, the status of the job transitions  from **Submitting**, to **Running**, and finally to **Completed**.

1.  Select **Completed** in the job status text in the **Jobs** pane.

    ![Run sklearn](media\azure-stack-solution-machine-learning\image47.png)

    A pop-up window opens and displays the standard output (stdout) text  for the run. To close the stdout text, select the **Close** (**x**)  button on the upper right of the pop-up window.

    ![Standard output](media\azure-stack-solution-machine-learning\image48.png)

1.  In the same job status in the **Jobs** pane, select the blue text **iris_sklearn.py \[n\] **(*n*is the run number) just above the **Completed** status and the start time. The **Run Properties** window opens and shows the following information for that particular run:

    -  **Run Properties** information

    -  **Outputs**

    -  **Metrics**

    -  **Visualizations**, if any

    -  **Logs**

    When the run is finished, the pop-up window shows the following results:

    > [!Note]  
    > Because the tutorial introduced some randomization into the training set earlier, the exact results might vary from the results shown here.

    ```Python  
        Python version: 3.5.2 |Continuum Analytics, Inc.| (default, Jul  5 2016, 11:41:13) [MSC v.1900 64 bit (AMD64)]

        Iris dataset shape: (150, 5)
        Regularization rate is 0.01
        LogisticRegression(C=100.0, class_weight=None, dual=False, fit_intercept=True,
            intercept_scaling=1, max_iter=100, multi_class='ovr', n_jobs=1,
            penalty='l2', random_state=None, solver='liblinear', tol=0.0001,
            verbose=0, warm_start=False)
        Accuracy is 0.6792452830188679

        ==========================================
        Serialize and deserialize using the outputs folder.

        Export the model to model.pkl
        Import the model from model.pkl
        New sample: [[3.0, 3.6, 1.3, 0.25]]
        Predicted class is ['Iris-setosa']
        Plotting confusion matrix...
        Confusion matrix in text:
        [[50  0  0]
        [ 1 37 12]
        [ 0  4 46]]
        Confusion matrix plotted.
        Plotting ROC curve....

        ROC curve plotted.
        Confusion matrix and ROC curve plotted. See them in Run History details pane.

    ```

1.  Close the **Run Properties** tab, and then return to the **iris_sklearn.py** tab.

1.  Repeat for additional runs.

Enter a series of values in the **Arguments** field ranging from `0.001` to `10`. Select **Run** to execute the code a few more times. The argument value changed each time is fed to the logistic regression model in the code, resulting in different findings each time.

### Review the run history in detail

In Azure Machine Learning Workbench every script execution is captured as a run history record. View the run history of a particular script by opening the **Runs** view.

1.  To open the list of **Runs**, select the **Runs** button (clock icon) on the left toolbar. Then select **iris_sklearn.py** to show the **Run Dashboard** ofiris_sklearn.py.

    ![Run view](media\azure-stack-solution-machine-learning\image49.png)

1.  The **Run Dashboard** tab opens.

    Review the statistics captured across the multiple runs. Graphs render  in the top of the tab. Each run has a consecutive number, and the run  details are listed in the table at the bottom of the screen.

    ![Run dashboard](media\azure-stack-solution-machine-learning\image50.png)

1.  Filter the table, and then select any of the graphs to view the status, duration, accuracy, and regularization rate of each run.

2.  Select the checkboxes next to two or more runs in the **Runs** table. Select the **Compare** button to open a detailed comparison pane. Review the side-by-side comparison.

3.  To return to the **Run Dashboard**, select the **Run List** back button on the upper left of the **Comparison** pane.

    ![Return to Run list](media\azure-stack-solution-machine-learning\image51.png)

1.  Select an individual run to see the run detail view. Notice that the statistics for the selected run are listed in the **Run Properties** section. The files written into the output folder are listed in the **Outputs** section, and download the files from there.

    ![Run details](media\azure-stack-solution-machine-learning\image52.png)

The two plots, the confusion matrix and the multi-class ROC curve, are rendered in the **Visualizations** section. All the log files can also be found in the **Logs** section.

### Run scripts in the Azure Machine Learning (ML) Workbench CLI window

1.  Start the Azure Machine Learning command-line interface (CLI):

    1.  Launch the Azure Machine Learning Workbench.

    2.  From the Workbench menu, select **File** > **Open Command Prompt**.

    The CLI prompt starts in the project folder `C:\\Temp\\myIris` on Windows. This is the project created in Part 1 of the tutorial.

    > [!Important]  
    > Use this CLI window to accomplish the next steps.

1.  In the CLI window, log in to Azure. [Learn more about az login](https://docs.microsoft.com/cli/azure/authenticate-azure-cli?view=azure-cli-latest).

    Skip this step if already logged in.

1.  At the command prompt, enter:

    ```CLI
        az login
    ```

    This command returns a code to use in the browser at [https://aka.ms/devicelogin](https://aka.ms/devicelogin).

1.  Go to [https://aka.ms/devicelogin](https://aka.ms/devicelogin) in the browser. Enter the code that you received from the received in the CLI.

    The Workbench app and CLI use independent credential caches when  authenticating against Azure resources. Authentication is not required  again until the cached token expires.

1.  If the organization has multiple Azure subscriptions (enterprise environment), set the subscription to be used. Find the subscription, set it using the subscription ID, and then test it.

1.  List every accessed Azure subscription using this command:

    ```CLI
        az account list -o table 
    ```

    The **az account list** command returns the list of subscriptions  available to the login. If there is more than one, identify the  subscription ID value for the subscription used.

1.  Set the Azure subscription used as the default account:

    ```CLI
        az account set -s <the-subscription-id
    ```

    Where <the-subscription-id> is ID value for the subscription  used. Do not include the brackets.

1.  Confirm the new subscription setting by requesting the details for the current subscription.

    ```CLI
        az account show
    ```

1.  In the CLI window, submit the **iris_sklearn.py** script as an experiment.

    The execution of iris_sklearn.py is run against the local compute  context.

1.  On Windows:

    ```CLI
        az ml experiment submit -c local .\\iris_sklearn.py
    ```

1.  On macOS:

    ```CLI
        az ml experiment submit -c local iris_sklearn.py
    ```

    The output should be similar to: 

    ```
        RunId: myIris_1521077190506

    Executing user inputs .....
    ===========================

    Python version: 3.5.2 |Continuum Analytics, Inc.| (default, Jul  2 2016, 17:52:12) 
    [GCC 4.2.1 Compatible Apple LLVM 4.2 (clang-425.0.28)]

    Iris dataset shape: (150, 5)
    Regularization rate is 0.01
    LogisticRegression(C=100.0, class_weight=None, dual=False, fit_intercept=True,
            intercept_scaling=1, max_iter=100, multi_class='ovr', n_jobs=1,
            penalty='l2', random_state=None, solver='liblinear', tol=0.0001,
            verbose=0, warm_start=False)
    Accuracy is 0.6792452830188679

    ==========================================
    Serialize and deserialize using the outputs folder.

    Export the model to model.pkl
    Import the model from model.pkl
    New sample: [[3.0, 3.6, 1.3, 0.25]]
    Predicted class is ['Iris-setosa']
    Plotting confusion matrix...
    Confusion matrix in text:
    [[50  0  0]
    [ 1 37 12]
    [ 0  4 46]]
    Confusion matrix plotted.
    Plotting ROC curve....
    ROC curve plotted.
    Confusion matrix and ROC curve plotted. See them in Run History details page.

    Execution Details
    =================
    RunId: myIris_1521077190506

    ```

6.  Review the output. All should be the same output and results as when Workbench runs the script.

7.  Go back to the Workbench, and:

    Select the folder icon on the left pane to list the project files.  Open the Python script named **run.py**. This script is useful to loop  over various regularization rates. 

    ![Return to Run  list](media\azure-stack-solution-machine-learning\image53.png)

1.  Run the experiment multiple times with those rates.

    This script starts` aniris_sklearn.pyjob` with a regularization rate  o `10.0` (a ridiculously large number). The script then cuts the rate  to half in the following run, and so on, until the rate is no smaller  than `0.005`. The script contains the following code:

    ![Return to Run list](media\azure-stack-solution-machine-learning\image54.png)

1.  Run the **run.py** script from the command line as follows:

    ```CLI
        python run.py
    ```
This command submits `iris_sklearn.py` multiple times with different regularization rates

When `run.py` finishes, graphs of different metrics are displayed in the run history list view in the workbench.

### Run scripts in an Ubuntu-based Data Science Virtual Machine (DSVM) on Azure

To execute the script in a Docker container on a remote Linux machine, SSH access (username and password) is needed to run that remote machine. In addition, the machine must have a Docker engine installed and running.

1.  Edit the generated<your DSVM Name>.runconfigfile underaml_configand change the framework from the default valuePySparktoPython:

    ```yaml  
    Framework: Python
    ```
1.  Issue the same command as before in the CLI window, using target*<DSVM>*this time to execute iris_sklearn.py in a remote Docker container: (Substitute the <DSVM> with the Data Science VM Name, without the brackets).

    ```CLI
        az ml experiment submit -c <DSVM> iris_sklearn.py
    ```

The command executes as if in adocker-pythonenvironment, except the execution occurs on the remote Linux VM. The CLI window displays the same output information.

### Download the model pickle file

In the previous part of the tutorial, the **iris_sklearn.py** script was run in the Machine Learning Workbench locally. This action serialized the logistic regression model by using the popular Python object-serialization package [pickle](https://docs.python.org/3/library/pickle.html).

1.  Open the Machine Learning Workbench application. Then open the **myIris** project created in the previous parts of the tutorial series.

2.  After the project is open, select the **Files** button (folder icon) on the left pane to open the file list in the project folder.

3.  Select the **iris_sklearn.py** file. The Python code opens in a new text editor tab inside the workbench.

4.  Review the **iris_sklearn.py** file to see where the pickle file was generated. Select Ctrl+F to open the **Find** dialog box, and then find the word **pickle** in the Python code.

This code snippet shows how the pickle output file was generated. The output pickle file is named **model.pkl** on the disk.

    ```Python
        print("Export the model to model.pkl")
        f = open('./outputs/model.pkl', 'wb')
        pickle.dump(clf1, f)
        f.close()

    ```

1.  Locate the model pickle file in the output files of a previous run.

    When the **iris_sklearn.py** script is run, the model file is written  to the **outputs** folder with the name **model.pkl**. This folder  lives in the execution environment chosen to run the script, and not  in the local project folder. 

    1. To locate the file, select the **Runs** button (clock icon) on the  left pane to open the list of **All Runs**.  

    2. The **All Runs** tab opens. In the table of runs, select one of the  recent runs where the target was **local** and the script name  was **iris_sklearn.py**.  

    3. The **Run Properties** pane opens. In the upper-right section of the  pane, notice the **Outputs** section. d\. To download the pickle file, select the check box next to  the **model.pkl** file, and then select **Download**. Save the file to  the root of the project folder. The file is needed in the upcoming  steps.  

    ![Download the pickle file](media\azure-stack-solution-machine-learning\image55.png)

### Get scoring script and schema files

To deploy the web service along with the model file, scoring script is needed. Optionally, a schema for the web service input data is needed. The scoring script loads the **model.pkl** file from the current folder and uses it to produce new predictions.

1.  Open the Machine Learning Workbench application. Then open the **myIris** project created in the previous part of the tutorial series.

2.  After the project is open, select the **Files** button (folder icon) on the left pane to open the file list in the project folder.

3.  Select the **score_iris.py** file. The Python script opens. This file is used as the scoring file.

    ![Scoring file](media\azure-stack-solution-machine-learning\image56.png)

1.  To get the schema file, run the script. Select the **local** environment and the **score_iris.py** script in the command bar, and then select **Run**.

    This script creates a JSON file in the **Outputs** section, which  captures the input data schema required by the model.

1.  Note the **Jobs** pane on the right side of the **Project Dashboard** pane. Wait for the latest** score_iris.py** job to display the green **Completed** status. Then select the hyperlink **score_iris.py** for the latest job run to see the run details.

2.  On the **Run Properties** pane, in the **Outputs** section, select the newly created **service_schema.json** file. Select the check box next to the file name, and then select **Download**. Save the file into the project root folder.

3.  Return to the previous tab and the **score_iris.py** script. By using data collection, model inputs and predictions from the web service can be captured. The following steps are of interest for data collection.

4.  Review the code at the top of the file, which imports class **ModelDataCollector**. It contains the model data collection functionality:

    ```Python  
        from azureml.datacollector import ModelDataCollector
    ```

1.  Review the following lines of code in the **init()** function that instantiates **ModelDataCollector**:

    ```Python  
        global inputs_dc, prediction_dc
        inputs_dc = ModelDataCollector('model.pkl',identifier="inputs")
        prediction_dc = ModelDataCollector('model.pkl', identifier="prediction")
    ```

1.  Review the following lines of code in the **run(input_df)** function as it collects the input and prediction data:

    ```Python  
        inputs_dc.collect(input_df)
        prediction_dc.collect(pred)
    ```

Now, prepare the environment to operationalize the model.

## Step 5: Deploy and use Azure Container Registry

Deploy and use Azure Container Registry.

Create an Azure Container registry with the **az acr create** command. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. The resource group is the same.

    ```CLI
        az acr create --resource-group <ResourceGroup> --name  <acrName> --sku Basic
    ```

### Container registry login

Use the **az acr login** command to log in to the ACR instance. Provide the unique name given to the container registry when it was created.

    ```CLI
        az acr login --name <acrName>
    ```

The command returns a 'Login Succeeded message once completed.

### Prepare to operationalize locally for development and testing the service

Use *local mode* deployment to run in Docker containers on the local computer, and for development and testing.

The Docker engine must be running locally to complete the following steps to operationalize the model. Use the `-h` flag at the end of each command to show the corresponding help message.

    > [!Note]  
    > If Docker engine is not locally available, proceed by creating a cluster in Azure for deployment and keep the cluster for re-use, or delete it after the tutorial to avoid ongoing charges.

    > [!Note]  
    > Web services deployed locally do not appear in Azure Portal's list of services. They will be running in Docker on the local machine.

1.  Open the command-line interface (CLI). In the Machine Learning Workbench application, on the **File** menu, select **Open Command Prompt**.

    The command-line prompt opens in the current project folder location **c:\\temp\\myIris**.

1.  Make sure the Azure resource provider **Microsoft.ContainerRegistry** is registered in the subscription. Register this resource provider before creating an environment in step 3. Check to see if it's already registered by using the following command:

    ```CLI
        az provider list --query "\[\].{Provider:namespace, Status:registrationState}" --out table
    ```

    View this output:

    ```CLI
        Provider                                    Status 
        --------                                    --------
        Microsoft.Authorization                     Registered 
        Microsoft.ContainerRegistry                 Registered 
        microsoft.insights                          Registered 
        Microsoft.MachineLearningExperimentation    Registered 
    ```

    If **Microsoft.ContainerRegistry** is not registered use the following command:

    ```CLI
    az provider register --namespace Microsoft.ContainerRegistry
    ```

    Registration can take a few minutes. Check on registration status using the previous **az provider list** command or the following command:

    ```CLI
    az provider show -n Microsoft.ContainerRegistry
    ```

    The third line of the output displays **"registrationState": "Registering"**. Wait a few moments and repeat the **show** command until the output displays **"registrationState": "Registered.**

1.  Create the environment. Run this step once per environment.

    The following setup command requires Contributor access to the subscription. Contributor access to the resource group deploying to is required. Specify the resource group name as part of the setup command by using the-gflag.

    ```CLI
    az ml env setup -n <new deployment environment name> --location <e.g. eastus2> -g <existing resource group name>
    ```

    Follow the on-screen instructions to provision a storage account for storing Docker images, an Azure container registry that lists the Docker images, and an Azure Application Insights account that gathers telemetry. **If using the-cswitch, the command will additionally create a Container Service cluster**.

    The cluster name is a way to identify the environment. The location should be the same as the location of the Model Management account created from the Azure portal.

    To make sure that the environment is set up successfully, use the following command to check the status:

    ```CLI
    az ml env show -n <deployment environment name> -g <existing resource group name>
    ```

    Make sure that "Provisioning State" has the value "Succeeded", as shown, before setting up the environment in step 5:

    ![Provisioning State](media\azure-stack-solution-machine-learning\image57.png)

1.  Set the environment.

    After the setup finishes, use the following command to set the environment variables required to operationalize the environment. Use the same environment name used previously in step 3. Use the same resource group name that was output in the command window when the setup process finished.

    ```CLI
        az ml env set -n <deployment environment name> -g <existing resource group name>
    ```

1.  To verify proper configuration of the operationalized environment for local web service deployment, enter the following command:

    ```CLI
    az ml env show
    ```

    Now, create the real-time web service.

    > [!Note]  
    > Reuse the Model Management account and environment for subsequent web service deployments. There is no need to create them for each web service. An account or an environment can have multiple web services associated with it.

### Create a real-time web service by using separate commands

As an alternative to the **az ml service create realtime** command previously shown, these steps may also be performed separately.

First, register the model. Then generate the manifest, build the Docker image, and create the web service. This step-by-step approach gives more flexibility at each step. Additionally, the entities generated in previous steps may be reused.

1. Register the model by providing the pickle file name.

    ```CLI
    az ml model register --model model.pkl --name model.pkl
    ```

    This command generates a model ID.

2.  Create a manifest.

    To create a manifest, use the following command and provide the model  ID output from the previous step: 
    
    ```CLI
    az ml manifest create --manifest-name <new manifest name> -f score_iris.py -r python -i <model ID> -s service_schema.json
    ```

    This command generates a manifest ID.

3.  Create a Docker image.

    To create a Docker image, use the following command and provide the  manifest ID value output from the previous step. The conda  dependencies may also be used via the `-c` switch. 
    
    ```CLI
    az ml image create -n irisimage --manifest-id <manifest ID> -c aml_config\conda_dependencies.yml
    ```
    
    This command generates a Docker image ID.

2.  Create the service.

    To create a service, use the following command and provide the image  ID output from the previous step: 
    
    ```CLI
    az ml service create realtime --image-id <image ID> -n irisapp --collect-model-data true
    ```
    
    This command generates a web service ID.
    
    Next, run the web service.

## Step 6: Deploy a Kubernetes cluster to Azure Stack

Deploy a Kubernetes cluster to Azure Stack.

Kubernetes may be installed using Azure Resource Manager templates generated by the Azure Container Services (ACS) Engine on Azure Stack. [*Kubernetes*](https://kubernetes.io/) is an open-source system for automating deployment, scaling, and managing of applications in containers. A [*container*](https://www.docker.com/what-container) is contained in an image, similar to a VM. Unlike a VM, the container image includes the resources it needs to run an application, such as the code, runtime to execute the code, specific libraries, and settings.

Use Kubernetes to:

 -  Develop massively scalable, upgradable, applications that can be deployed in seconds.

 -  Simplify the design of the application and improve its reliability by different Helm applications. [*Helm*](https://github.com/kubernetes/helm) is an open-source packaging tool that helps to install and manage the lifecycle of Kubernetes applications.

 -  Easily monitor and diagnose the health of the applications with scale and upgrade functionality.

> [!Note]  
> Installation of the cluster will take about an hour, please plan appropriately.

### Prerequisites for Kubernetes cluster deployment

To get started, confirm permissions and Azure Stack readiness:

1.  Validate that the **Create Kubernetes Cluster (Preview)** Item is available in the Azure Stack Marketplace. If this item is missing, work with an Azure Stack Operator to add this item into the Azure Stack Environment.

2.  Verify the ability to create applications in the Azure Active Directory (Azure AD) tenant. Permissions are required for Kubernetes deployment.

    For instructions on checking the permissions, see [*Check Azure Active  Directory  permissions*](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-create-service-principal-portal).

3.  Generate an SSH public and private key pair to sign in to the Linux VM on Azure Stack. The public key is needed when creating the cluster. For instruction see [Generate an authentication key for SSH](#generate-an-authenticatio-key-for-ssh).

4.  Check that the subscription in the Azure Stack tenant portal is valid, and there are enough public IP addresses available to add new applications.

    The cluster cannot be deployed to an Azure  Stack **Administrator** subscription. Use a **User** subscription.

###  Generate an authentication key for SSH

From within the Windows Subsystem for Linux Session use the following commands to generate an authentication key: 

1. Type:

    ```Bash  
    ssh-keygen -t rsa
    ```
    
2. Select `id_rsa` when prompted. 
3. Create a passphrase when prompted. It is important to note this  password for later use. 
    The output will look similar to below: 
    
    ```Bash  
    Your identification has been saved in `id_rsa`.
    Your public key has been saved in `id_rsa.pub`. 
    The key fingerprint is: SHA256:lUtUUjzaqWqGeolEPKeBmsnrhcNGM9Dn2OxYatt05SE  <user>@<machine-name>
    The key's randomart image is:  
    ```
    ![Alt text](media\azure-stack-solution-machine-learning\image58.png)

4. After generating the key, paste the key info using the following  commands: 
    ```Bash
    cat id_rsa.pub
    ```
    The output will look similar to below: 
    ```Bash
    ssh-rsa  AAAAB3NzaC1yc2EAAAADAQABAAABAQDHaWrAktR3BlQ356T8Qvv8O2Q/U/hsXQwS9xJbuduuc9lkJwddzgmNCyM9PooZWYtGVXyHU6SC3YH1XkwqGtKhtPb03d24hmhX1euAaqIqHHSp4WgUS5s1gNsp37L8QCSGNCnF31FWavI8bnjOjccUkMowKl8iyGN++5UyQgNuynEVUbFJjrntoDL66HUu88xDxTcVB7rqDr2QKFwYJkg4HSoHYpezJd7W8kcmv33eh0xs8nlDA7Dzu7zXpyVc54bH9XtPR6EUXaQa+UqKaNlQNiJqEs+1X/zNuK9V6NLVNiO0h3jCHI3K8o4VnZyRKHCQProasiiPLUUJ6SF/RTLN  <user>@<machine-name>
    ```
    
5. Copy the generated key into the SSH Public Key Field.

### Create a service principal in Azure AD

1.  Sign in to the global [*Azure portal*](http://www.poartal.azure.com/).

2.  Sign in using the Azure AD tenant associated with the Azure Stack instance.

3.  Create an Azure AD application.

    1. Select **Azure Active Directory** > **+ App  Registrations**> **New Application Registration**.
    2. Enter a **Name** of the application. 
    3. Select **Web app / API**. 
    4. Enter `http://localhost` for the **Sign-on URL**. 
    5. Select **Create**.

1.  Make note of the **Application ID**. This ID is needed when creating the cluster and is referenced as **Service Principal Client ID**.

2.  Select **Settings** > **Keys**.

    1. Enter the **Description**. 
    2. Select **Never expires** for **Expires**. 
    3. Select **Save**. Make note the key string. The key string is needed  when creating the cluster and is referenced as the **Service Principal  Client Secret**.

### Give the service principal access

Give the service principal access to the subscription so it may create resources.

1.  Sign in to the [Administration portal](https://adminportal.local.azurestack.external/).

2.  Select **More services** > **User subscriptions ** > **+ Add**.

3.  Select the subscription created.

4.  Select **Access control (IAM)** > Select **+ Add**.

5.  Select the **Owner** role.

6.  Select the application name created for the service principal. Type the name in the search box if needed.

7.  Select **Save**.

8.  Open the [Azure Stack portal](https://portal.local.azurestack.external).

9.  Select **+New** > **Compute** > **Kubernetes Cluster**. Select **Create**.

    ![Deploy Solution Template](media\azure-stack-solution-machine-learning\image59.png)

10\. Select **Basics** in the Create Kubernetes Cluster.

    ![Deploy Solution Template](media\azure-stack-solution-machine-learning\image60.png)

11. Enter the **Linux VM Admin Username**. User name for the Linux Virtual Machines that are part of the Kubernetes cluster and DVM.

12. Enter the **SSH Public Key** used for authorization to all Linux machines created as part of the Kubernetes cluster and DVM.

13. Enter the **Master Profile DNS Prefix** that is unique to the region. This must be a region-unique name, such `ask8s-12345`. Try to choose it same as the resource group name as best practice.

    > [!Note]  
    > For each cluster, use a new and unique master profile DNS prefix.

14. Enter the **Agent Pool Profile Count**. The count contains the number of agents in the cluster. There can be from 1 to 4.

15. Enter the **Service Principal ClientId** This is used by the Kubernetes Azure cloud provider.

16. Enter the **Service Principal Client Secret** created when creating service principal application.

17. Enter the **Kubernetes Azure Cloud Provider Version**. This is the version for the Kubernetes Azure provider. Azure Stack releases a custom Kubernetes build for each Azure Stack version.

18. Select the **Subscription** ID.

19. Enter the name of a new resource group or select an existing resource group. The resource name needs to be alphanumeric and lowercase.

20. Select the **Location** of the resource group. This is the region chosen for the Azure Stack installation.

### Specify the Azure Stack settings

1.  Select the **Azure Stack Stamp Settings**.

    ![Deploy Solution Template](media\azure-stack-solution-machine-learning\image61.png)

2.  Enter the **Tenant Azure Resource Manager Endpoint**. This is the Azure Resource Manager endpoint to connect to create the resource group for the Kubernetes cluster. The endpoint from the Azure Stack operator is needed for an integrated system. For the Azure Stack Development Kit (ASDK), use `https://management.local.azurestack.external`.

3.  Enter the **Tenant ID** for the tenant. See [*Get tenant ID*](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-create-service-principal-portal) to find the tenant ID value.

### Install kubectl on Windows PowerShell Environment

From within the WSL Environment run the following commands to install kubectl in the WSL Environment.

```PowerShell  
Install-script -name install-kubectl -scope CurrentUser -force
Install-kubectl.ps1 -downloadlocation “C:\Users\<Current User>\Documents\Kube
```

### Install kubectl on the Windows subsystem for Linux Environment

From within the WSL Environment, run the following commands to install kubectl in the WSL Environment.

```Bash  
    apt-get update && apt-get install -y apt-transport-https
    curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
    cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
    deb http://apt.kubernetes.io/ kubernetes-xenial main
    EOF
    apt-get update
    apt-get install -y kubectl
```

### Configure kubectl

In order for kubectl to find and access a Kubernetes cluster, a*kubeconfig file* is needed. This is created automatically when a cluster is created using kube-up.sh or deploying a Minikube cluster. See the [*getting started guides*](https://kubernetes.io/docs/setup/) for more about creating clusters. For access to a cluster created by another user, see the [*Sharing Cluster Access document*](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/). By default, kubectl configuration is located at **~.kube/config**.

### Check the kubectl configuration

Check that kubectl is properly configured by getting the cluster state:

```Bash  
kubectl cluster-info
```

kubectl is correctly configured to access the cluster when the url response is displayed.

kubectl is not correctly configured or not able to connect to a Kubernetes cluster if the following message is displayed:

```Bash  
The connection to the server <server-name:port> was refused -  did you specify the right host or port?
```

For example, when running a Kubernetes cluster on a local laptop, a tool may be needed (minikube or similar) to re-run the commands stated above.

If kubectl cluster-info returns the url response but the cluster is still not accessible, check for proper configuration by using:

```Bash  
> kubectl cluster-info dump
```

### Enable shell autocompletion

kubectl includes autocompletion support, making shell enablement quick and easy.

The completion script itself is generated by kubectl and is accessible from the profile.

### Connect to the Kubernetes Cluster

To connect to the cluster, the Kubernetes command-line client (**kubectl**) is needed. Instructions for connecting to and managing the cluster are found in [Azure Container Services documentation.](https://docs.microsoft.com/azure/container-service/dcos-swarm/)

Any SSH Client can be used for connecting the Kubernetes cluster. Windows Subsystem for Linux (WSL) is recommended. The Machine connecting to the Kubernetes Cluster will be in the Resource Group created for the cluster and will start with the prefix of vmd-edge-ml-stack.

```Bash  
ssh <user>@vmd-edge-ml-stack.<FQDN of Kubernetes Machine in  Azure Stack>
```

Once connected to the Kubernetes Machine, run the following machine to get Kubernetes Configuration file.

```Bash  
sudo find / -name \*kubeconfig\* -type f
```

The Output will looks something like this:

```Bash  
/var/lib/waagent/custom-script/download/0/acs-engine/_output/edgemlstack/kubeconfig/kubeconfig.<regionname>.json
```

Copy this files path info and then run the following command, pasting in the kubeconfig file path copied from above:

```Bash  
sudo cat  /var/lib/waagent/custom-script/download/0/acs-engine/_output/edgemlstack/kubeconfig/kubeconfig.<regionname>.json
```

The output will be a large block of text, which is the raw JSON content. Copy this output text and then paste this code into a Visual Studio file, saving as a JSON file. This results in a locally stored kubeconfig.json file. (save to /mnt/c/users/<current user>/documents/Kube directory as kubeconfig.json)

### Configure the Kubernetes Cluster

Once the local JSON file is obtained, in a new WSL session, use the following commands to configure the Cluster.

```Bash  
    cd /mnt/c/users/<current user>/documents/Kube
    kubectl proxy
    kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml
    kubectl proxy
    set KUBECONFIG=”/mnt/c/users/<current user>/documents/Kube/kubeconfig.json”
    kubectl.exe config view
```

Kubernetes configuration settings will be defined (see output below).

![Alt text](media\azure-stack-solution-machine-learning\image62.png)

Start the local proxy service:

```Bash  
kubectl proxy
```

Browse to the kubernetes cluster UI at the following address: `https://localhost:8001`.

![Alt text](media\azure-stack-solution-machine-learning\image63.png)

You now have a place to deploy container, and a container that lives in the cloud that you can see on premises.

![Alt text](media\azure-stack-solution-machine-learning\image64.png)

Customize the **iris_deployment.yaml** file (located in /*mnt/c/users/<current user>/documents/Kube directory*) so **webservicename** and containers **Image** and **Name** match the deployment, using any code editor of choice.

![Alt text](media\azure-stack-solution-machine-learning\image65.png)

Set the container port to **5001.**

![Alt text](media\azure-stack-solution-machine-learning\image66.png)

And then create the **imagePullSecret**:

### Create a Secret in the cluster that holds the authorization token

A Kubernetes cluster uses the Secret of **docker-registry** type to authenticate with a container registry to pull a private image.

Create this Secret, naming it **azuremlcr**:

```Bash  
kubectl create secret docker-registry azuremlcr --docker-server=<your-registry-server> --docker-username=<your-name> --docker-password= "<your-pword>" --docker-email=<your-email>
```

Find:

- **<your-registry-server>** is the Azure Container Registry **Login Server**.
- **<your-name>** is the Azure Container Registry **Username**.
- **<your-pword>** is the Azure Container Registry **Password**. Please ensure the password is in quotes.
- **<your-email>** is the user that has R/W access to the container.
- Find this information on the **Azure Container** **Registry** under **Access Keys**.
- Docker credentials are now set in the cluster as a Secret called **azuremlcr**.

Save the **iris_deployment.yaml** file (located in /*mnt/c/users/<current user>/documents/Kube directory*).

### Create the Kubernetes Container

```Bash  
kubectl.exe create -f /mnt/c/users/<current  user>/documents/Kube/iris_deployment.yaml
```

    ![Alt text](media\azure-stack-solution-machine-learning\image67.png)

Check the status of deployment:

```Bash  
Kubectl get deployments
```

    ![Alt text](media\azure-stack-solution-machine-learning\image68.png)

The Deployment can take some time.

### Configure Visual Studio Team Services to deploy automatically

#### Create a team project

1.  Ensure [Project Collection Administrators Group membership.](https://docs.microsoft.com/vsts/organizations/security/set-project-collection-level-permissions?view=vsts) To create team projects, **Create new projects** permission must be set to **Allow**.

2.  From the Projects Page, select **New Project**.

    ![Alt text](media\azure-stack-solution-machine-learning\image69.png)

1.  Name the project **HybridMLIris**.

2.  Select its initial source control type as **Git**

3.  Select a process and select **Create**.

    ![Alt text](media\azure-stack-solution-machine-learning\image70.png)

### Import some code  Create Repository

A Git repository for YAML code is needed.

#### Add user to the GIT repo

1.  From the default project dashboard, select Generate Git credentials.

    ![Alt text](media\azure-stack-solution-machine-learning\image71.png)

1.  Enter password where required and Save Git Credentials.

    ![Alt text](media\azure-stack-solution-machine-learning\image72.png)

1.  Initialize the repository by selecting the **Initialize** button and creating a **README** file.

    ![Alt text](media\azure-stack-solution-machine-learning\image73.png)

#### Clone the Git repository locally and upload the code. 

1.  Make a directory in machine at `c:\\users\\<User>\\source\\repos\\hybridMLIris`, and clone the repository

    ```Bash  
    sudo mkdir /mnt/c/users/<User>/source sudo mkdir /mnt/c/users/<User>/source/repos sudo mkdir /mnt/c/users/<User>/source/repos/hybridMLIris cd /mnt/c/users/<User>/source/repos/hybridMLIris sudo git clone  https://<yourvstssite>.visualstudio.com/HybridMLIris/_git/HybridMLIris
    ```

    ![Alt text](media\azure-stack-solution-machine-learning\image74.png)

1.  Navigate to newly cloned repository:

    ```Bash  
    ls
    cd ./HybridMLIris
    ```
    
    ![Alt text](media\azure-stack-solution-machine-learning\image75.png)

1.  Copy the **iris_deployment.yaml** file into the repository.

    ```Bash  
    cp /mnt/c/users/<User>/documents/Kube/iris_deployment.yaml  /mnt/c/users/<User>/source/repos/HybridMLIris/HybridMLIris/iris_deployment.yaml
    ``` 

1.  Commit the change in GIT

    ```Bash  
    git add . git commit -m Added Deployment YAML git push
    ```

    ![Alt text](media\azure-stack-solution-machine-learning\image76.png)

### Prepare the Private Build and Release Agent for VSTS Integration

#### Prerequisites

VSTS authenticates against Azure Resource Manager using a Service Principal. For VSTS to be able to provision resources in an Azure Stack subscription it requires Contributor status.\ **The following are the high-level steps that need to be configured to enable such authentication:**

1.  Service Principal should be created or an existing one may be used.

2.  Authentication keys need to be created for the Service Principal.

3.  Azure Stack Subscription needs to be validated via Role-Based Access Control to allow the SPN be part of the Contributors role.

4.  A new Service Definition in VSTS must be created using the Azure Stack endpoints as well as SPN information.

#### Service Principal Creation

Refer to the [Service Principal Creation  instructions](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications)  to create a service principal, and choose Web App/API for the  Application Type.

**Access Key Creation**

A Service Principal requires a key for authentication, follow the steps in this section to generate a key.

1.  From **App registrations** in Azure Active Directory, select the application.

    ![select application](media\azure-stack-solution-machine-learning\image77.png)

1.  Make note of the value of **Application ID. The value is used when configuring the service endpoint in VSTS.**

    ![Alt text](media\azure-stack-solution-machine-learning\image78.png)

1.  To generate an authentication key, select **Settings**.

    ![select settings](media\azure-stack-solution-machine-learning\image79.png)

1.  Select **Keys**.

    ![select keys](media\azure-stack-solution-machine-learning\image80.png)

1.  Provide a description of the key, and a duration for the key. When done, select **Save**.

    ![save key](media\azure-stack-solution-machine-learning\image81.png)

After saving the key, the value of the key is displayed. Copy this value, as it is needed later. The **key value** with the application ID is required to log in as the application. Store the key value where the application can retrieve it.

![Alt text](media\azure-stack-solution-machine-learning\image82.png)

#### Get Tenant ID

As part of the service endpoint configuration, VSTS requires the **Tenant ID** that corresponds to the AAD Directory the Azure Stack stamp was deployed to. Follow the steps in this section to gather the Tenant Id.

1.  Select **Azure Active Directory**.

    ![select azure active directory](media\azure-stack-solution-machine-learning\image83.png)

1.  To get the tenant ID, select **Properties** for the Azure AD tenant.

    ![select Azure AD properties](media\azure-stack-solution-machine-learning\image84.png)

1.  Copy the **Directory ID**. This value is the tenant ID.

    ![tenant ID](media\azure-stack-solution-machine-learning\image85.png)

Grant the Service Principal rights to deploy resources in the Azure Stack Subscription

To access resources in the subscription, assign the application to a role. Decide which role represents the right permissions for the application. To learn about the available roles, see [RBAC: Built in Roles](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles).

Set the scope at the level of the subscription, resource group, or resource. Permissions are inherited to lower levels of scope. For example, adding an application to the Reader role for a resource group allows it to read the resource group and any resources it contains.

1.  Navigate to the desired level of scope to assign the application. For example, to assign a role at the subscription scope, select **Subscriptions**.

    ![Alt text](media\azure-stack-solution-machine-learning\image86.jpeg)

1.  Select the **subscription** (resource group or resource) to assign the application.

    ![select subscription for assignment](media\azure-stack-solution-machine-learning\image87.png)

1.  Select **Access Control (IAM)**.

    ![select access](media\azure-stack-solution-machine-learning\image88.png)

1.  Select **Add**.

    ![select add](media\azure-stack-solution-machine-learning\image89.png)

1.  Select the role to assign the application. The following image shows the **Owner** role.

    ![Alt text](media\azure-stack-solution-machine-learning\image90.png)

1.  By default, Azure Active Directory applications aren't displayed in the available options. To find the application, **provide the name** in the search field and select it.

    ![Alt text](media\azure-stack-solution-machine-learning\image91.png)

1.  Select **Save** to finish assigning the role. The application is displayed in the list of users assigned to a role for that scope.

### Role-Based Access Control

Azure Role-Based Access Control (RBAC) enables fine-grained access management for Azure and Azure Stack. Using RBAC, only the amount of access that users need to perform their jobs can be granted. For more information about Role-Based Access Control see [Manage Access to Azure Subscription Resources](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal?toc=%252fazure%252factive-directory%252ftoc.json).

**VSTS Agent Pools**

Instead of managing each agent individually, agents are organized into **agent pools**. An agent pool defines the sharing boundary for all agents in that pool. In VSTS, agent pools are scoped to the VSTS account, so can be shared across team projects. For more information and a tutorial on how to create VSTS agent pools see [Create Agent Pools and Queues.](https://docs.microsoft.com/vsts/build-release/concepts/agents/pools-queues?view=vsts)

**Add aPersonal access token (PAT) for Azure Stack**

 -  Log on to VSTS account and select on **account profile** name.

 -  Select **Manage Security** to access token creation page.

![Alt text](media\azure-stack-solution-machine-learning\image92.png)

![Alt text](media\azure-stack-solution-machine-learning\image93.jpeg)

![Alt text](media\azure-stack-solution-machine-learning\image94.jpeg)

> [!Note]  
> Obtain the token information. It will not be shown again after leaving this screen.

1.  Copy the **token**.

    ![Alt text](media\azure-stack-solution-machine-learning\image95.png)

#### Install the VSTS build agent on the Azure Stack hosted Build Server

1.  Connect to the **Build Server** deployed on the Azure Stack host.

    > [!Note]  
    > Please ensure Azure Stack Hosted Build Server is accessible from  the public Internet. If not, work with an Azure Stack Operator to  obtain access.

    ```Bash  
    ssh <user>@<buildserver.publicip>
    ```

2.  Upgrade the Ubuntu Build Server to latest Version (18.04):

    ```Bash  
    sudo su
    apt-get update
    apt-get upgrade
    apt-get dist-upgrade
    apt-get autoremove
    do-release-upgrade -d
    ```

    > [!Note]  
    > This operation will take some time.

2.  Install pre-req applications for the build server. From the bash shell of the Ubuntu based Build Server run the following commands:

    ```Bash  
    wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg
    sudo mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/
    wget -q https://packages.microsoft.com/config/ubuntu/18.04/prod.list 
    sudo mv prod.list /etc/apt/sources.list.d/microsoft-prod.list
    sudo chown root:root /etc/apt/trusted.gpg.d/microsoft.asc.gpg
    sudo chown root:root /etc/apt/sources.list.d/microsoft-prod.list
    sudo apt-get install apt-transport-https
    sudo apt-get update
    sudo apt-get install liblttng-ust0 libcurl3 libssl1.0.0 curl lsb-release libkrb5-3 zlib1g libicu60 aspnetcore-runtime-2.1 dotnet-sdk-2.1
    wget https://github.com/PowerShell/PowerShell/releases/download/v6.1.0-preview.3/powershell-preview_6.1.0-preview.3-1.ubuntu.18.04_amd64.deb
    sudo dpkg -i powershell-preview_6.1.0-preview.3-1.ubuntu.18.04_amd64.deb
    sudo apt-get install -f
    AZ_REPO=$(lsb_release -cs)
    echo "deb [arch=amd64] https://packages.microsoft.com/repos/azure-cli/ $AZ_REPO main" | \
        sudo tee /etc/apt/sources.list.d/azure-cli.list
    curl -L https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add –
    sudo apt-get update && sudo apt-get install azure-cli
    ```

2.  Download and Deploy the build agent as a service using a **personal access token (PAT)** and run as the VM Admin account.

    ![Alt text](media\azure-stack-solution-machine-learning\image96.png)

    ```Bash  
        cd \home\<user>
        sudo mkdir myagent && cd myagent
        wget https://vstsagentpackage.azureedge.net/agent/2.134.2/vsts-agent-linux-x64-2.134.2.tar.gz
        sudo tar zxvf vsts-agent-linux-x64-2.134.2.tar.gz
    ```

2.  Go to extracted build agent folder. Run the following code.

    ```Bash  
        cd ..
        sudo chmod -R 777 myagent
        cd myagent
        ./config.sh
    ```

    ![Alt text](media\azure-stack-solution-machine-learning\image97.png)

2.  After **./config.sh**finished, run the following code to enable the service on server boot, and start the service:

    ```Bash  
    sudo ./svc.sh install
    sudo ./svc.sh start
    ```

The agent is now visible in VSTS folder.

#### Endpoint Creation Permissions

Users can create endpoints so VSTO builds can deploy Azure Service apps to the stack. VSTS connects to the build agent, which then connects with Azure Stack.

![Alt text](media\azure-stack-solution-machine-learning\image98.png)

1.  On the **Settings** menu, select **Security**.

2.  In the **VSTS Groups** list on the left, select **Endpoint Creators**.

    ![Alt text](media\azure-stack-solution-machine-learning\image99.png)

3.  On the **Members tab,** select the **+Add**.

    ![Alt text](media\azure-stack-solution-machine-learning\image100.png)

1.  Type **username** and select the username from the list.

2.  Select **Save changes**.

    ![Alt text](media\azure-stack-solution-machine-learning\image101.png)

3.  In the **VSTS Groups** list on the left, select **Endpoint Administrators**.

4.  On the **Members tab,** select the **+Add**.

5.  Type a **user name** and select that user from the list.

6.  Select **Save Changes.**

    ![buchatech](media\azure-stack-solution-machine-learning\image102.jpeg)

    The build agent in Azure Stack gains instructions from VSTS, which then conveys endpoint information for communication with the Azure Stack.

    VSTS to Azure Stack connection is now ready.

    ![Alt text](media\azure-stack-solution-machine-learning\image103.png)

### Configure Build and Release definitions

Now that the connections are established, you will manually map the created Azure endpoint, AKS and Azure Container Registry to the build and release definitions.

#### Create the Build Definition for The YAML code

1.  Select the Builds Section under the Build and Release hub and create a new definition.

    ![Alt text](media\azure-stack-solution-machine-learning\image104.png)

1.  Select VSTS Git and Select the repository created earlier.

    ![Alt text](media\azure-stack-solution-machine-learning\image105.png)

1.  Select Empty Pipeline as the template

    ![Alt text](media\azure-stack-solution-machine-learning\image106.png)

1.  Name the Build **Copy Artifact** and select the Azure Stack Build Server for the Agent Queue.

    ![Alt text](media\azure-stack-solution-machine-learning\image107.png)

1.  Select Phase 1 in the processes, and rename it to **Copy Artifact**, then **add a task** to the phase:

    ![Alt text](media\azure-stack-solution-machine-learning\image108.png)

1.  Select **Publish Build Artifacts** from the **Utility** list and select **Add**.

    ![Alt text](media\azure-stack-solution-machine-learning\image109.png)

1.  Select the **path to publish** and select the **iris_deployment.yaml** file.

    ![Alt text](media\azure-stack-solution-machine-learning\image110.png)

1.  Name the Artifact **iris_deployment** and select the publish location to be **Visual Studio Team Services/TFS**.

    ![Alt text](media\azure-stack-solution-machine-learning\image111.png)

1.  Select **Save & Queue**.

    ![Alt text](media\azure-stack-solution-machine-learning\image112.png)

1.  Check the status of build by selecting the build ID.

    ![Alt text](media\azure-stack-solution-machine-learning\image113.png)

Success will look similar to this:

![Alt text](media\azure-stack-solution-machine-learning\image114.png)

#### Create the Release Definition for the YAML code

1.  Select the Releases section under the Build and Release hub, a new definition

    ![Alt text](media\azure-stack-solution-machine-learning\image115.png)

1.  Select Empty Pipeline as a template.

    ![Alt text](media\azure-stack-solution-machine-learning\image106.png)

1.  Name the Environment Azure Stack.

    ![Alt text](media\azure-stack-solution-machine-learning\image116.png)

1.  Add a new Artifact by selecting **Artifacts** and **+Add**

2.  Select Build as the source type and **HybridMLIris** as the project.

3.  Then Select the Build definition created earlier for the Source.

4.  Then Select **Add**.

    ![Alt text](media\azure-stack-solution-machine-learning\image117.png)

1.  Select Azure Stack from environments, then Add a new Task to Azure Stack

    ![Alt text](media\azure-stack-solution-machine-learning\image118.png)


1.  On the Agent phase, set the Agent Queue to the Azure Stack Hosted Build Server.

    ![Alt text](media\azure-stack-solution-machine-learning\image119.png)

1.  Add a New Task to this Phase, Select the Deploy to Kubernetes task under Deploy and select Add.

    ![Alt text](media\azure-stack-solution-machine-learning\image120.png)


1.  Name it **Kubectl Apply** (Default name) and select the apply command.

    ![Alt text](media\azure-stack-solution-machine-learning\image121.png)

    Now create a new Kubernetes Service Connection.

#### Create Kubernetes Service Endpoint

1.  Under Kubernetes Service Connection, select the **+ New** button, and select**Kubernetes**from the list. you can use this endpoint to connect the**VSTS**and the**Azure Container Service (AKS)**.

2.  **Connection Name**: Provide the connection name.

3.  **Server URL**: Provide the container service address in the formathttp://{API server address}

4.  **Kubeconfig**: To get the Kubeconfig value, run the following Azure commands in a command prompt launched with the Administrator privilege.

    > [!Important]  
    > Use this CLI window to accomplish the next steps.

6.  In the CLI window, log in to Azure. [Learn more about az login](https://docs.microsoft.com/cli/azure/authenticate-azure-cli?view=azure-cli-latest).

7.  At the command prompt, enter:

    ```CLI
        az login
    ```

10. This command returns a code to use in the browser at <https://aka.ms/devicelogin>.

11. Go to <https://aka.ms/devicelogin> in the browser. When prompted, enter the code, received in the CLI, into the browser.

    ![Kubernetes Service Endpoint](media\azure-stack-solution-machine-learning\image122.png)

1.  Type the following command in the command prompt to get the access credentials for the Kubernetes cluster.

### Azure ML Workbench CLI

az aks get-credentials resource-group <yourResourceGroup> name <yourazurecontainerservice>

![Kubernetes Service Endpoint](media\azure-stack-solution-machine-learning\image123.png)

1.  Navigate to the**.kube**folder under the home directory (eg: C:\\Users\\<user>\\Documents\\Kube)

2.  Copy the contents of the**config**file and paste it in the Kubernetes Connection window. Select the**OK**button.

    ![Kubernetes Service Endpoint](media\azure-stack-solution-machine-learning\image124.png)
    

3.  Once the Kubernetes endpoint is created and selected, select the Use configuration files checkbox to add a configuration file. Then Browse to the iris_deployment.yaml file in the Linked Artifacts.

    ![Alt text](media\azure-stack-solution-machine-learning\image125.png)

    ![Alt text](media\azure-stack-solution-machine-learning\image126.png)

4.  Save the release definition.

#### Check the status of the release definition. 

Once saved, the release definition the VSTS should automatically kick off a release.

Check the status of the deployment by running a quick command in the WSL command prompt, then checking the Kubernetes UI.

```Bash  
kubectl get deployments
```

The output should look similar to this, while in the deploying process.

![Alt text](media\azure-stack-solution-machine-learning\image127.png)

```Bash  
kubectl proxy
```

Once the kubernetes UI is running, browse to the deployment at [**https://localhost:8001/**](https://localhost:8001/) then navigate to **Workloads-> Replica Sets**.

![Alt text](media\azure-stack-solution-machine-learning\image128.png)

### Deploy the YAML Service

#### Upload the iris_service.yaml to the repository and sync changes

1.  Navigate to newly cloned repository:

    ```Bash  
    cd /mnt/c/users/<User>/source/repos/HybridMLIris/HybridMLIris/
    ```

    ![Alt text](media\azure-stack-solution-machine-learning\image75.png)

1.  Copy the **iris_service.yaml** file into the repository.

    ```Bash  
    cp /mnt/c/users/<User>/documents/Kube/iris_service.yaml  /mnt/c/users/<User>/source/repos/HybridMLIris/HybridMLIris/iris_service.yaml
    ```

1.  Commit the change in GIT

    ```Bash  
    git add .
    git commit -m “Added Service YAML” 
    git push
    ```

![Alt text](media\azure-stack-solution-machine-learning\image129.png)

#### Update the Build Definition for The YAML code

1.  Select the Builds Section under the Build and Release hub and select the definition created earlier.

    ![Alt text](media\azure-stack-solution-machine-learning\image130.png)

2.  Select the Edit Button to edit the definition.

    ![Alt text](media\azure-stack-solution-machine-learning\image131.png)

3.  **Add a task** to the phase. Select **Publish Build Artifacts** from the **Utility** list and select **Add**.

    ![Alt text](media\azure-stack-solution-machine-learning\image108.png)

4.	Name it **Kubectl Apply** (Default name) and select the apply command.



#### Update the Release Definition for the YAML code

1.  Select theReleases section under the Build and Release hub and select the release definition created earlier. Then select the Edit Link.

    ![Alt text](media\azure-stack-solution-machine-learning\image132.png)

1.  Select the Environment **Azure Stack** then Add a new Task to Azure Stack.

    ![Alt text](media\azure-stack-solution-machine-learning\image133.png)

1.  Add a **New Task** to this Phase, Select the **Deploy to Kubernetes** task under **Deploy** and select **Add**.

    ![Alt text](media\azure-stack-solution-machine-learning\image134.png)

1.  Name it **Kubectl Apply** (Default name) and select the apply command.

    ![Alt text](media\azure-stack-solution-machine-learning\image109.png)

1.  Set the Kubernates Service connection to the Azure Stack Connection created earlier, and then select the **Use configuration files** checkbox to add a configuration file. Browse to the iris_service.yaml file in the Linked Artifacts.

    ![Alt text](media\azure-stack-solution-machine-learning\image135.png)


    ![Alt text](media\azure-stack-solution-machine-learning\image136.png)

1.  Save the release definition.

#### Check the status of the release definition

Once saved, the release definition the VSTS should automatically kick off a release.

Check the status of the deployment by running a quick command in the WSL command prompt, then checking the Kubernetes UI.

```Bash  
kubectl get deployments
```

The output should look similar to this, while in the deploying process.

![Alt text](media\azure-stack-solution-machine-learning\image127.png)


```Bash  
kubectl proxy
```

Once the kubernetes UI is running, browse to the deployment at [**https://localhost:8001/**](https://localhost:8001/) then navigate to **Workloads-> Replica Sets**.

![Alt text](media\azure-stack-solution-machine-learning\image137.png)


### Kubernetes Scoring and Validation

Start the Kubernetes UI

```Bash  
kubectl proxy
```

Browse to the Kubernetes UI then, go to **Deployments** -> **Iris-Deployment** -> **New Replica Set** -> **Iris-Deployment-xxxxxxxxx** (where the xs are the deployment ID).

![Alt text](media\azure-stack-solution-machine-learning\image138.png)

Then Navigate to **Services** and select the **External endpoint** of the Service to validate it is working.

![Alt text](media\azure-stack-solution-machine-learning\image139.png)

A validation message similar to the one below should be displayed:

![Alt text](media\azure-stack-solution-machine-learning\image140.png)

#### Create Azure Stack Scoring Function App in the Azure Stack Portal

A function app is required to host the execution of each function. A function app allows function grouping as a logic unit for easier management, deployment, and sharing of resources.

1.  From the Azure Stack user portal, select the **+ New** button found on the upper left-hand corner, then select**Web + Mobile** >**Function App**.

    ![Alt text](media\azure-stack-solution-machine-learning\image141.png)

1.  Name the Function **data-functions** and place it in the same resource group with the remaining Machine Learning content. Let the tool auto-create a new app service plan for consumption and use the storage account created earlier for the app storage.

    ![Define new function app  settings](media\azure-stack-solution-machine-learning\image142.png)

1.  Select**Create**to provision and deploy the function app.

2.  Select the Notification icon in the upper-right corner of the portal and watch for the**Deployment succeeded** message.

    ![Define new function app settings](media\azure-stack-solution-machine-learning\image143.png)

1.  Select**Go to resource** to view the new function app.

    ![Alt text](media\azure-stack-solution-machine-learning\image144.png)

1.  Create a new Function by selecting **Functions**, then the **+New Function** button.

    ![Alt text](media\azure-stack-solution-machine-learning\image145.png)

1.  Select HTTP Trigger

    ![Alt text](media\azure-stack-solution-machine-learning\image146.png)

1.  Select **C\#** as the Language and name the Function: **clean-score-data**, and set the Authorization Level to **Anonymous**.

    ![Alt text](media\azure-stack-solution-machine-learning\image147.png)

1.  Copy-Paste the contents of the example code for clean-score-data into the function.

    ![Alt text](media\azure-stack-solution-machine-learning\image148.png)

#### Use Postman to validate Functions

To ensure you have set up your Kbernetes and Functions correctly you can use the free app Postman to test and validate schemas and functions. To start this process, you first need to gather some info from your Kubernetes instance.

1.  Browse to the Kubernetes UI then, go to **Deployments** -> **Iris-Deployment** -> **New Replica Set** -> **Iris-Deployment-xxxxxxxxx** (where the xs are the deployment ID)

    ![Alt text](media\azure-stack-solution-machine-learning\image138.png)

1.  Then Navigate to **Services** and copy the **External endpoint**.

    ![Alt text](media\azure-stack-solution-machine-learning\image149.png)

1.  Download and install the Postman app [here](https://www.getpostman.com/apps) if needed.

2.  Sign in to the Postman App and close the New file dialog.

    ![Alt text](media\azure-stack-solution-machine-learning\image150.png)

1.  From within the postman app, Select POST..

    ![Alt text](media\azure-stack-solution-machine-learning\image151.png)

1.  Paste the **External endpoint** URL into the postman app under the **Request URL** adding **\\score** to the end of the URL as shown below.

    ![Alt text](media\azure-stack-solution-machine-learning\image152.png)

1.  Select the **Body** tab, and then the data type as **raw**, then **JSON**.

    ![Alt text](media\azure-stack-solution-machine-learning\image153.png)

1.  From a web browser, Navigate to **External endpoint**. Adding the following to the URL **/swagger.json** this leads to the Services Swagger file used to test setup.

    ![Alt text](media\azure-stack-solution-machine-learning\image154.png)

1.  Copy the Example listed in the **Swagger.JSON** file.

2.  In the Postman App, Paste the example into the body of the Post, and select **Send**. It should return a value similar to the one shown below.

    ![Alt text](media\azure-stack-solution-machine-learning\image155.png)

## Step 7: Create an Azure Stack storage account and Storage Queue

Create an Azure Stack storage account and Storage Queue for data.

1.  Sign in to the Azure Stack User Portal. (Each Azure Stack has a unique portal URL)

2.  In the Azure Stack User portal, expand the menu on the left side to open the menu of services and choose **All Services**. Scroll down to **Storage** and choose **Storage accounts**. In the **Storage Accounts** window choose **Add**.

3.  Enter a name for the storage account.

4.  Select the replication option for the storage account: **LRS**.

5.  Specify a new resource group or select an existing resource group.

6.  Select **Local** for the location for the storage account.

7.  Select**Create**to create the storage account.

    ![Alt text](media\azure-stack-solution-machine-learning\image156.png)

1.  Choose the storage account recently created.

2.  Select on**Queues**.

    ![Alt text](media\azure-stack-solution-machine-learning\image157.png)

1.  Select on **+ Queue** and Name the Queue and select **OK.**

    ![Alt text](media\azure-stack-solution-machine-learning\image158.png)

1.  Get the **Connection String** for the Storage Queue and copy it.

    ![Alt text](media\azure-stack-solution-machine-learning\image159.png)

1.  Navigate to the Azure Function App, and then select **Application Settings**.

    ![Alt text](media\azure-stack-solution-machine-learning\image160.png)

1.  From within the Application Settings of the Function App, scroll down to Application Settings, and select **+ Add new setting**.

    ![Alt text](media\azure-stack-solution-machine-learning\image161.png)

1.  Enter the name of the storage account in the **Name** field, adding to the end; _STORAGE

This allows the application to understand that this is a storage account endpoint.

1.  Then paste the Connection String into the **value** field.

    ![Alt text](media\azure-stack-solution-machine-learning\image162.png)

1.  Scroll up to the top of Application Settings and select **Save**.

    ![Alt text](media\azure-stack-solution-machine-learning\image163.png)

### Update the Scoring Function to use Storage Queue

1.  Select on **integrate** on the function, and de-select the **GET** option.

2.  Select **Save**.

3.  Then Select **+New Output** from the Outputs.

    ![Alt text](media\azure-stack-solution-machine-learning\image164.png)

1.  Then select **Azure Queue Storage** and choose **Select**.

    ![Alt text](media\azure-stack-solution-machine-learning\image165.png)

1.  Update the **Queue name** to the Storage Queue created earlier, and then set the **Storage Account Connection** to the Storage account connection created earlier and select **Save.**

    ![Alt text](media\azure-stack-solution-machine-learning\image166.png)

## Step 8: Create a function to handle clean data

Create a new Azure Stack function to move the clean data from Azure Stack to Azure.

1.  Create a new Function by selecting **Functions**, then the **+New Function** button.

    ![Alt text](media\azure-stack-solution-machine-learning\image167.png)

1.  Select **Timer Trigger**.

    ![Alt text](media\azure-stack-solution-machine-learning\image168.png)

1.  Select **C\#** as the Language and name the Function: **upload-to-azure** and set the Schedule to **0 0 \*/1 \* \* \*** which in CRON notation is once an hour.

    ![Alt text](media\azure-stack-solution-machine-learning\image169.png)

### Get the Connection String to the Azure Hosted Storage Account

1.  Browse to <https://portal.azure.com> and then select the **Azure Storage Account** created earlier.

2.  Select **Access Keys**, then Copy the **Connection String** for the Storage Account.

    ![Alt text](media\azure-stack-solution-machine-learning\image170.png)

### Update the upload-to-azure Function to use the Azure Hosted Storage

1.  Navigate to the Azure Function App, and then select **Application Settings**.

    ![Alt text](media\azure-stack-solution-machine-learning\image171.png)

1.  From within the Application Settings of the Function App, scroll down to Application Settings, and select **+ Add new setting**.

    ![Alt text](media\azure-stack-solution-machine-learning\image172.png)

1.  Enter the name of the storage account in the **Name** field, adding to the end; _STORAGE

This allows the application to understand that this is a storage account endpoint.

1.  Then paste the Azure Hosted Storage Account Connection String into the **value** field.

    ![Alt text](media\azure-stack-solution-machine-learning\image173.png)

1.  Scroll up to the top of Application Settings and select **Save**.

    ![Alt text](media\azure-stack-solution-machine-learning\image174.png)

1.  Navigate back to the **upload-to-azure** function.

2.  Select on **integrate** on the function.

3.  Then Select **+New Output** from the Outputs.

    ![Alt text](media\azure-stack-solution-machine-learning\image175.png)

1.  Then Select **Azure Blob Storage** and choose **Select**.

    ![Alt text](media\azure-stack-solution-machine-learning\image176.png)

1.  Update the **Path** to storage container created earlier in the following format: **uploadeddata/{rand-guid}.txt**, and then set the **Storage Account Connection** to the Storage account connection to Azure created earlier and select **Save.**

    ![Alt text](media\azure-stack-solution-machine-learning\image177.png)

1.  Copy-Paste the contents of the example code for **upload-to-azure** into the function.

2.  Modify as needed to point to the Storage Accounts Connection String.

3.  Save and Run the Code.

    ![Alt text](media\azure-stack-solution-machine-learning\image178.png)

1.  Check the Azure Hosted Storage account to see the data has been parsed up to the cloud from Azure: Success will look similar to the below.

    ![Alt text](media\azure-stack-solution-machine-learning\image179.png)

The data has been sanitized of sensitive data by the Azure Stack Hosted Kubernetes Machine Learning and uploaded to the Azure Public Cloud from the on-prem Azure Stack, via Azure Stack Hosted Function Apps, and can stage the data for uploads in an edge/disconnected scenario.

## Next steps

 - To learn more about Azure Cloud Patterns, see [Cloud Design Patterns](https://docs.microsoft.com/azure/architecture/patterns).