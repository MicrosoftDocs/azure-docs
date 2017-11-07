---
title: Azure ML Workbench release notes for sprint 1 November 2017
description: This document details the updates for the sprint 1 release of Azure ML 
services: machine-learning
author: hning86
ms.author: haining
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 11/06/2017
---

# Sprint 1 - November 2017 

**Version number: 0.1.1710.04013**

Welcome to the second update of Azure Machine Learning Workbench. We continue to make improvements around security, stability, and maintainability in the workbench app, the CLI and the back-end services layer. Thanks very much for sending us smiles and frowns. Many of the below updates are made as direct results of your feedback. Please keep them coming!

## Notable New Features
- Azure ML is now available in two new Azure regions: **West Europe** and **Southeast Asia**. They join the previous regions of **East US 2**, **West Central US**, and **Australia East**, bringing the total number of deployed regions to five.
- We enabled Python code syntax highlighting in the Workbench app to make it easier to read and edit Python source code. 
- You can now launch your favorite IDE directly from a file, rather than from the whole project.  Opening a file in Workbench and then clicking "Edit" launches your IDE (currently VS Code and PyCharm are supported) to the current file and project.  You can also click the arrow next to the Edit button to edit the file in the Workbench text editor.  Files are read-only until you click Edit, preventing accidental changes.
- The popular plotting library `matplotlib` version 2.1.0 is now shipped with the Workbench app.
- We upgraded the .NET Core version to 2.0 for the data prep engine. This removed the requirement for brew-install openssl during app installation on macOS. It also paves the way for more exciting data prep features to come in the near future. 
- We have enabled a version-specific app homepage, so you get more relevant release notes and update prompts based on your current app version.
- If your local user name has a space in it, the application can now be successfully installed. 

## Detailed Updates
Below is a list of detailed updates in each component area of Azure Machine Learning in this sprint.

### Installer
- App installer now cleans up the install directory created by older version of the app.
- Fixed a bug that leads installer getting stuck at 100% on macOS High Sierra.
- There is now a direct link to the installer directory for user to review installer logs in case installation fails.
- Install now works for users that have space in their user name.

### Workbench Authentication
- Support for authentication in Proxy Manager.
- Logging in now succeeds if user is behind a firewall. 
- If user has experimentation accounts in multiple Azure regions, and if one region happens to be unavailable, the app no longer hangs.
- When authentication is not completed and the authentication dialog box is still visible, app no longer tries to load workspace from local cache.

### Workbench App
- Python code syntax highlighting is enabled in text editor.
- The Edit button in the text editor allows you to edit the file either in an IDE (VS Code and PyCharm are supported) or in the built-in text editor.
- Text editor is in read-only mode by default. 
- Save button visual state now changes to disabled after the current file is saved and hence no longer dirty.
- Workbench saves _all_ unsaved files when you initiate a run.
- Workbench remembers the last used Workspace on the local machine so it opens automatically.
- Only a single instance of Workbench is now permitted to run. Previously multiple instances could be launched which caused issues when operating on the same project.
- Renamed File menu "Open Project..." to "Add Existing Folder as Project..." 
- Tab switching is now a lot quicker.
- Help links are added to the Configuring IDE dialog box.
- The feedback form now remembers the email address you entered last time.
- Smiles and frowns form text area is now bigger, so you can send us more feedback! 
- The `--owner` switch help text in `az ml workspace create` is corrected.
- We added an "About" dialog box to help user easily view and copy version number of the app.
- A "Suggest a feature" menu item is added to the Help menu.
- Experimentation account name is now visible in the app title bar, preceding the app name "Azure Machine Learning Workbench".
- A version-specific app homepage is displayed now based on the version of the app detected.

### Data preparation 
- External web site can no longer be loaded from Map Inspector to prevent potential security problems.
- Histogram and Value Count inspectors now has option to show graph in logarithmic scale.
- When a calculation is ongoing, data quality bar now shows a different color to signal the "calculating" state.
- Column metrics now show statistics for categorical value columns.
- The last character in the data source name is no longer truncated.
- Data prep package now remains open when switching tabs, resulting noticeable performance gains.
- In data source, when switching between data view and metric view, the order of columns now longer changes.
- Opening an invalid `.dprep` or `.dsource` file no longer causes Workbench to crash.
- Data prep package can now uses relative path for output in _Write to CSV_ transform.
- _Keep Column_ transform now allows user to add additional columns when edited.
- _Replace this_ menu now actually launches _Replace Value_ dialog box.
- _Replace Value_ transform now functions as expected instead of throwing error.
- Data prep package now uses absolute path when referencing data files outside of the project folder, making it possible to run the package in local context with absolute path to the data file.
- _Full file_ as a sampling strategy is now supported when using Azure blob as data source.
- Generated Python code (from data prep package) now carries both CR and LF, making it friendly in Windows.
- _Choose Metrics_ dropdown now hides property when switching to the Data view.
- Workbench can now process parquet files even when it is using Python runtime. Previously only Spark can be used when processing parquet files. 
- Filtering out values in a column with _date_ data type no longer causes data prep engine to crash.
- Metric view now respects sampling strategy updates.
- Remote sampling jobs now functions properly.

### Job execution
- Argument is now included in run history record.
- Jobs kicked off in CLI now shows up in Run history Job panel automatically.
- Job panel now shows jobs created by guest users added to the AAD tenant.
- Job panel cancel and delete actions are more stable.
- When clicking on Run button, error message is triggered now if the configuration files are in bad format.
- Terminating app no longer interferes with jobs kicked off in CLI.
- Jobs kicked off in CLI now continues to spit out standard-out even after one hour of execution.
- Better error messages are shown when data prep package run fails in Python/PySpark.
- `az ml experiment clean` now cleans up Docker images in remote VM as well.
- `az ml experiment clean` now works properly for local target on macOS.
- Error messages when targeting local or remote Docker runs are cleaned up and easier to read.
- Better error message is displayed when HDInsight cluster head node name is not properly formatted when attached as an execution target.
- Better error message is shown when secret is not found in the credential service. 
- MMLSpark library is upgraded to support Apache Spark 2.2.
- MMLSpark now include subject encoding transform (Mesh encoding) for medical documents.
- `matplotlib` version 2.1.0 is now shipped out-of-the box with Workbench.

### Jupyter Notebook
- Notebook name search now works properly in the Notebooks view.
- You can now delete a Notebook in the Notebooks view.
- New magic `%upload_artifact` is added for uploading files produced in the Notebook execution environment into run history data store.
- Kernel errors are now surfaced in Notebook job status for easier debugging.
- Jupyter server now properly shuts down when user logs out of the app.

### Azure portal
- Experimentation account and Model Management account can now be created in two new Azure regions: West Europe and Southeast Asia.
- Model Management account DevTest plan now is only available when it is the first one to be created in the subscription. 
- Help link in the Azure portal is updated to point to the correct documentation page.
- Description field is removed from Docker image details page since it is not applicable.
- Details including AppInsights and auto-scale settings are added to the web service detail page.
- Model management page now renders even if third party cookies are disabled in the browser. 

### Operationalization
- Web service with "score" in its name no longer fails.
- User can now create a deployment environment with just Owner access to an Azure resource group. Owner access to the entire subscription is no longer needed.
- Operationalization CLI now enjoys tab auto-completion on Linux.
- Image construction service now supports building images for Azure IoT services/devices.

### Sample projects
- _Classifying Iris_ sample project:
    - `iris_pyspark.py` is renamed to `iris_spark.py`.
    - `iris_score.py` is renamed to `iris-score.py`.
    - `iris.dprep` and `iris.dsource` are updated to reflect the latest data prep engine updates.
    - `iris.ipynb` Notebook is amended to work in HDInsight cluster.
    - Run history is turned on in `iris.ipynb` Notebook cell.
- _Advanced Data Prep using Bike Share Data_ sample project "Handle Error Value" step fixed.
- _MMLSpark on Adult Census Data_ sample project `docker.runconfig` format updated from JSON to YAML.
- Distributed Hyperparameter Tuning sample project`docker.runconfig` format updated from JSON to YAML.
- New sample project _Image Classification using CNTK_.
