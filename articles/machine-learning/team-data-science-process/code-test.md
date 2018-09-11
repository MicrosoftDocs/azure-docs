---
title: "Data science code testing on Azure with the UCI adult income prediction dataset - Team Data Science Process and Azure DevOps Services"
description: Data science code testing with UCI adult income prediction data
services: machine-learning, team-data-science-process
documentationcenter: ''
author: weig
manager: deguhath
editor: cgronlun

ms.assetid: b8fbef77-3e80-4911-8e84-23dbf42c9bee
ms.service: machine-learning
ms.component: team-data-science-process
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/19/2018
ms.author: weig
---
# Data science code testing with the UCI adult income prediction dataset
This article gives preliminary guidelines for testing code in a data science workflow. Such testing gives data scientists a systematic and efficient way to check the quality and expected outcome of their code. We use a Team Data Science Process (TDSP) [project that uses the UCI Adult Income dataset](https://github.com/Azure/MachineLearningSamples-TDSPUCIAdultIncome) that we published earlier to show how code testing can be done. 

## Introduction on code testing
"Unit testing" is a longstanding practice for software development. But for data science, it's often not clear what that means and how you should test code for different stages of a data science lifecycle, such as:

* Data preparation
* Data quality examination
* Modeling
* Model deployment 

This article replaces the term "unit testing" with "code testing." It refers to testing as the functions that help to assess if code for a certain step of a data science lifecycle is producing results "as expected." The person who's writing the test defines what's "as expected," depending on the outcome of the function--for example, data quality check or modeling.

This article provides references as useful resources.

## Azure DevOps for the testing framework
This article describes how to perform and automate testing by using Azure DevOps. You might decide to use alternative tools. We also show how to set up an automatic build by using Azure DevOps and build agents. For build agents, we use Azure Data Science Virtual Machines (DSVMs).

## Flow of code testing
The overall workflow of testing code in a data science project looks like this: 

![Flow chart of code testing](./media/code-test/test-flow-chart.PNG)

    
## Detailed steps

Use the following steps to set up and run code testing and an automated build by using a build agent and Azure DevOps:

1. Create a project in the Visual Studio desktop application:

    !["Create new project" screen in Visual Studio](./media/code-test/create_project.PNG)

   After you create your project, you'll find it in Solution Explorer in the right pane:
	
    ![Steps for creating a project](./media/code-test/create_python_project_in_vs.PNG)

    ![Solution Explorer](./media/code-test/solution_explorer_in_vs.PNG)

1. Feed your project code into the Azure DevOps project code repository: 

    ![Project code repository](./media/code-test/create_repo.PNG)

1. Suppose you've done some data preparation work, such as data ingestion, feature engineering, and creating label columns. You want to make sure your code is generating the results that you expect. Here's some code that you can use to test whether the data-processing code is working properly:

	* Check that column names are right:
	
      ![Code for matching column names](./media/code-test/check_column_names.PNG)

	* Check that response levels are right:

      ![Code for matching levels](./media/code-test/check_response_levels.PNG)

	* Check that response percentage is reasonable:

      ![Code for response percentage](./media/code-test/check_response_percentage.PNG)

	* Check the missing rate of each column in the data:
	
      ![Code for missing rate](./media/code-test/check_missing_rate.PNG)


1. After you've done the data processing and feature engineering work, and you've trained a good model, make sure that the model you trained can score new datasets correctly. You can use the following two tests to check the prediction levels and distribution of label values:

	* Check prediction levels:
	
	  ![Code for checking prediction levels](./media/code-test/check_prediction_levels.PNG)

	* Check the distribution of prediction values:

      ![Code for checking prediction values](./media/code-test/check_prediction_values.PNG)

1. Put all test functions together into a Python script called **test_funcs.py**:

    ![Python script for test functions](./media/code-test/create_file_test_func.PNG)


1. After the test codes are prepared, you can set up the testing environment in Visual Studio.

   Create a Python file called **test1.py**. In this file, create a class that includes all the tests you want to do. The following example shows six tests prepared:
	
	![Python file with a list of tests in a class](./media/code-test/create_file_test1_class.PNG)

1. Those tests can be automatically discovered if you put **codetest.testCase** after your class name. Open Test Explorer in the right pane, and select **Run All**. All the tests will run sequentially and will tell you if the test is successful or not.

    ![Running the tests](./media/code-test/run_tests.PNG)

1. Check in your code to the project repository by using Git commands. Your most recent work will be reflected shortly in Azure DevOps.

    ![Git commands for checking in code](./media/code-test/git_check_in.PNG)

    ![Most recent work in Azure DevOps](./media/code-test/git_check_in_most_recent_work.PNG)

1. Set up automatic build and test in Azure DevOps:

	a. In the project repository, select **Build and Release**, and then select **+New** to create a new build process.

       ![Selections for starting a new build process](./media/code-test/create_new_build.PNG)

	b. Follow the prompts to select your source code location, project name, repository, and branch information.
	
       ![Source, name, repository, and branch information](./media/code-test/fill_in_build_info.PNG)

	c. Select a template. Because there's no Python project template, start by selecting **Empty process**. 

       ![List of templates and "Empty process" button](./media/code-test/start_empty_process_template.PNG)

	d. Name the build and select the agent. You can choose the default here if you want to use a DSVM to finish the build process. For more information about setting agents, see [Build and release agents](https://docs.microsoft.com/azure/devops/pipelines/agents/agents?view=vsts).
	
       ![Build and agent selections](./media/code-test/select_agent.PNG)

	e. Select **+** in the left pane, to add a task for this build phase. Because we're going to run the Python script **test1.py** to finish all the checks, this task is using a PowerShell command to run Python code.
	
       !["Add tasks" pane with PowerShell selected](./media/code-test/add_task_powershell.PNG)

	f. In the PowerShell details, fill in the required information, such as the name and version of PowerShell. Choose **Inline Script** as the type. 
    
       In the box under **Inline Script**, you can type **python test1.py**. Make sure the environment variable is set up correctly for Python. If you need a different version or kernel of Python, you can explicitly specify the path as shown in the figure: 
	
       ![PowerShell details](./media/code-test/powershell_scripts.PNG)

	g. Select **Save & queue** to finish the build pipeline process.

       !["Save & queue" button](./media/code-test/save_and_queue_build_definition.PNG)

Now every time a new commit is pushed to the code repository, the build process will start automatically. (Here we use master as the repository, but you can define any branch.) The process runs the **test1.py** file in the agent machine to make sure that everything defined in the code runs correctly. 

If alerts are set up correctly, you'll be notified in email when the build is finished. You can also check the build status in Azure DevOps. If it fails, you can check the details of the build and find out which piece is broken.

![Email notification of build success](./media/code-test/email_build_succeed.PNG)

![Azure DevOps notification of build success](./media/code-test/vs_online_build_succeed.PNG)

## Next steps
* See the [UCI income prediction repository](https://github.com/Azure/MachineLearningSamples-TDSPUCIAdultIncome) for concrete examples of unit tests for data science scenarios.
* Follow the preceding outline and examples from the UCI income prediction scenario in your own data science projects.

## References
* [Team Data Science Process](https://aka.ms/tdsp)
* [Visual Studio Testing Tools](https://www.visualstudio.com/vs/features/testing-tools/)
* [Azure DevOps Testing Resources](https://www.visualstudio.com/team-services/)
* [Data Science Virtual Machines](https://azure.microsoft.com/services/virtual-machines/data-science-virtual-machines/)