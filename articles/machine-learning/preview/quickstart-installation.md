---
title: Installation Quickstart for Azure Machine Learning services | Microsoft Docs
description: Learn how to create Azure Machine Learning resources, and how to install and get started with Azure Machine Learning Workbench.
services: machine-learning
author: hning86
ms.author: haining, raymondl, chhavib, j-martens
manager: mwinkle
ms.reviewer: jmartens, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: quickstart
ms.date: 2/22/2018
---

# Quickstart: Create Azure Machine Learning accounts and install Azure Machine Learning Workbench
Azure Machine Learning services (preview) are an integrated, end-to-end data science and advanced analytics solution. It helps professional data scientists prepare data, develop experiments, and deploy models at cloud scale.

This quickstart shows you how to:

* Create experimentation and model management accounts for Azure Machine Learning services
* Install the Azure Machine Learning Workbench desktop application
* Log into Workbench with your experimentation account
* Create a project
* Run a script in that project  
* Access the command-line interface


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

<a name="prerequisites"></a>You can install the Azure Machine Learning Workbench application on the following operating systems:
- Windows 10 or Windows Server 2016
- macOS Sierra or High Sierra

## Create Azure Machine Learning accounts
Use the Azure portal to provision your Azure Machine Learning accounts: 
1. Sign in to the [Azure portal](https://portal.azure.com/) using the credentials for the Azure subscription you'll use. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now. 

   ![Azure portal](media/quickstart-installation/portal-dashboard.png)

1. Select the **Create a resource** button (+) in the upper-left corner of the portal.

   ![Create a resource in Azure portal](media/quickstart-installation/portal-create-a-resource.png)

1. Enter **Machine Learning** in the search bar. Select the search result named **Machine Learning Experimentation**. 

   ![Azure Machine Learning search](media/quickstart-installation/portal-more-services.png)

1. In the **Machine Learning Experimentation** pane, scroll to the bottom and select **Create** to begin defining your experimentation account.  

   ![Azure Machine Learning - create experimentation account](media/quickstart-installation/portal-create-account.png)

1. In the **ML Experimentation** pane, configure your Machine Learning Experimentation account. 

   Setting|Suggested value|Description
   ---|---|---
   Experimentation account name | _Unique name_ |Enter a unique name that identifies your account. You can use your own name, or a departmental or project name that best identifies the experiment. The name should be 2 to 32 characters. It should include only alphanumeric characters and the dash (-) character. 
   Subscription | _Your subscription_ |Choose the Azure subscription that you want to use for your experiment. If you have multiple subscriptions, choose the appropriate subscription in which the resource is billed.
   Resource group | _Your resource group_ | Use an existing resource group in your subscription, or enter a name to create a new resource group for this experimentation account. 
   Location | _The region closest to your users_ | Choose the location closest to your users and the data resources.
   Number of seats | 2 | Enter the number of seats. Learn how [seating impacts pricing](https://azure.microsoft.com/pricing/details/machine-learning/).<br/><br/>For this Quickstart, you only need two seats. Seats can be added or removed as needed in the Azure portal.
   Storage account | _Unique name_ | Select **Create new** and provide a name to create an [Azure storage account](https://docs.microsoft.com/en-us/azure/storage/common/storage-quickstart-create-account?tabs=portal). Or, select **Use existing** and select your existing storage account from the drop-down list. The storage account is required and is used to hold project artifacts and run history data. 
   Workspace for Experimentation account | _Unique name_ | Provide a name for a workspace for this account. The name should be 2 to 32 characters. It should include only alphanumeric characters and the dash (-) character. This workspace contains the tools you need to create, manage, and publish experiments.
   Assign owner for the workspace | _Your account_ | Select your own account as the workspace owner.
   Create Model Management account | **check** |Create a Model Management account now so that this resource is available when you want to deploy and manage your models as real-time web services. <br/><br/>While optional, we recommend creating the Model Management account at the same time as the Experimentation account.
   Account name | _Unique name_ | Choose a unique name that identifies your Model Management account. You can use your own name, or a departmental or project name that best identifies the experiment. The name should be 2 to 32 characters. It should include only alphanumeric characters and the dash (-) character. 
   Model Management pricing tier | **DEVTEST** | Select **No pricing tier selected** to specify the pricing tier for your new Model Management account. For cost savings, select the **DEVTEST** pricing tier if it's available on your subscription (limited availability). Otherwise, select the S1 pricing tier for cost savings. Click **Select** to save the pricing tier selection. 
   Pin to dashboard | _check_ | Select the **Pin to dashboard** option to allow easy tracking of your Machine Learning Experimentation account on the front dashboard page of the Azure portal.

   ![Machine Learning Experimentation account configuration](media/quickstart-installation/portal-create-experimentation.png)

5. Select **Create** to begin the creation process of the Experimentation account along with the Model Management account.

   ![Machine Learning Experimentation account configuration](media/quickstart-installation/portal-create-experimentation-button.png)

   It can take a few moments to create an account. You can check on the status of the deployment process by clicking the bell on the Azure portal toolbar.
   
   ![Azure portal notifications](media/quickstart-installation/portal-notification.png)


## Install Azure Machine Learning Workbench

Azure Machine Learning Workbench is available for Windows or macOS. See the list of [supported platforms](#prerequisites).

1. Download and launch the latest Azure Machine Learning Workbench installer. 
   >[!IMPORTANT]
   >Download the installer fully on disk, and then run it from there. Do not run it directly from your browser's download widget.

   **On Windows:** 

   &nbsp;&nbsp;&nbsp;&nbsp;A. Download [AmlWorkbenchSetup.msi](https://aka.ms/azureml-wb-msi).  <br/>
   &nbsp;&nbsp;&nbsp;&nbsp;B. Double-click on the downloaded installer in File Explorer.

   **On macOS:** 

   &nbsp;&nbsp;&nbsp;&nbsp;A. Download [AmlWorkbench.dmg](https://aka.ms/azureml-wb-dmg). <br/>
   &nbsp;&nbsp;&nbsp;&nbsp;B. Double-click on the downloaded installer in Finder.

1. Follow the on-screen instructions in your installer to completion.
   
   >[!IMPORTANT]
   >The installation might take around 30 minutes to complete. 
   
   | |Workbench installation path|
   |--------|------------------------------------------------|
   |Windows|C:\Users\<user>\AppData\Local\AmlWorkbench|
   |macOS|/Applications/Azure ML Workbench.app|

   The installer downloaded and setup all the necessary dependencies, such as Python, Miniconda, and other related libraries. 
  
## Start and sign into Azure Machine Learning Workbench

1. Launch Workbench by selecting the **Launch Workbench** button on the last screen of the installer. 

   If you closed the installer, it's no problem. On Windows, just launch it using the **Machine Learning Workbench** desktop shortcut. For macOS users, select **Azure ML Workbench** in your Launchpad.

2. On the first screen, select **Sign in** to authenticate with the Azure Machine Learning Workbench. Use the same credentials you used in the Azure portal to create the Experimentation and Model Management accounts. 

   Once you are signed in, Workbench uses the first Experimentation account it finds in your Azure subscriptions.  Workbench uses the first Experimentation account it finds and displays all workspaces and projects associated with that account. 

   >[!TIP]
   > You can switch to a different Experimentation account using the icon in the lower-left corner of the Workbench application window.

## Create a project in Workbench

In Azure Machine Learning, a project is the logical container for all the work being done to solve a problem. It maps to a single file folder on your local disk, and you can add any files or sub folders to it. 

Here, we are creating a new Workbench project using a template that includes the [Iris flower dataset](https://en.wikipedia.org/wiki/iris_flower_data_set). The tutorials that follow this quickstart depend on this data to build a model that predicts the type of iris based on some of its physical characteristics.  

1. With Azure Machine Learning Workbench open, select **File** > **New Project** from the toolbar. 

1. Enter a name for your project in the **Project name** field.

1. Specify to choose the directory for your project in the **Project directory** field.

1. You can leave **Project description** and **Visualstudio.com GIT Repository URL** blank for now.
   >[!TIP]
   >A project can optionally be associated with a Git repository for source control and collaboration. [Learn how to set that up.](https://docs.microsoft.com/en-us/azure/machine-learning/preview/using-git-ml-project#step-3-set-up-a-machine-learning-project-and-git-repo).

1. Choose a workspace.

1. Select **Classifying Iris** as the project template. This template contains the scripts and data you need for this quickstart and other tutorials in this documentation site. 

1. Select **Create** to create the project. A new project is created and the project dashboard opens with that project. At this point, you can explore the project home page, data sources, notebooks, and source code files. 

   >[!TIP]
   >You can configure Workbench to work with a Python IDE for a smooth data science development experience. Then, you can interact with your project in the IDE. [Learn how](how-to-configure-your-IDE.md). 

## Run a Python script

Now, you can run the **iris_sklearn.py** script on your local computer. This script is included by default with the **Classifying Iris** project template. The script builds a model with the [logistic regression](https://en.wikipedia.org/wiki/logistic_regression) algorithm from the popular Python [scikit-learn](http://scikit-learn.org/stable/index.html) library.

1. In the command bar at the top of the **Project Dashboard** page, select **local** as the execution target and select **iris_sklearn.py** as the script to run. These values are preselected by default. 

   There are other files included in the sample that you can check out later, but for this quickstart we are only interested in **iris_sklearn.py**. 

   ![Command bar](media/quickstart-installation/run_control.png)

1. In the **Arguments** text box, enter **0.01**. This number is used in the script code to set the regularization rate. This value is used to configure how the linear regression model is trained. 

1. Select **Run** to start the execution of the script on your computer. The **iris_sklearn** job immediately appears in the **Jobs** panel on the right so you can monitor the script's execution.

   Congratulations! You've successfully run a Python script in Azure Machine Learning Workbench.

1. Repeat steps 2 - 3 several times using different argument values ranging from **0.001** to **10**. Each  execution job appears in the **Jobs** pane.

1. Inspect the run history by selecting the **Runs** view and then **iris_sklearn.py** in the Runs list to display the run history for this script. 

   ![Run history dashboard](media/quickstart-installation/run_view.png)

   It shows every run that was executed on **iris_sklearn.py**. The run history dashboard also displays the top metrics, a set of default graphs, and a list of metrics for each run. 

1. You can customize this view by sorting, filtering, and adjusting the configurations using the gear or filter icons.

   ![Metrics and graphs](media/quickstart-installation/run_dashboard.png)

3. Select a completed run in the Jobs pane to see a detailed view for that specific execution. Details include additional metrics, the files that it produced, and other potentially useful logs.

## Start the command-line interface (CLI)

The Azure command-line interface (CLI) 2.0 is also installed. The CLI interface allows you to access and interact with your Azure services using the `az` commands.  Specifically, there are commands Azure Machine Learning services users can use to perform all tasks required for an end-to-end data science workflow. [Learn more.](tutorial-iris-azure-cli.md)

You can launch this CLI from the Workbench's toolbar using **File --> Open Command Prompt**.

You can get help on commands in the CLI using the --help argument.

```az ml --help```

## Clean up resources

[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]

## Next steps
You have now created the necessary an Azure Machine Learning accounts and installed the Azure Machine Learning Workbench application. In that application, you have created a project, ran a script, and explored the run history of the script.

For a more in-depth experience of this workflow, including how to deploy your Iris model as a web service, follow the full-length *Classifying Iris* tutorial. The tutorial contains detailed steps for [data preparation](tutorial-classifying-iris-part-1.md), [experimentation](tutorial-classifying-iris-part-2.md), and [model management](tutorial-classifying-iris-part-3.md). 

> [!div class="nextstepaction"]
> [Classifying Iris tutorial (Part 1)](tutorial-classifying-iris-part-1.md)

>[!NOTE]
> While you have your model management account, your environment is not set up for deploying web services yet.  Learn how to set up your [deployment environment](deployment-setup-configuration.md).