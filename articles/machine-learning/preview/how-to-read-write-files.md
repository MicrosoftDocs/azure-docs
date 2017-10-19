---
title: How to read and write large data files | Microsoft Docs
description: How to read and write large files in Azure ML experiments.
services: machine-learning
author: hning86
ms.author: haining
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 09/10/2017
---
# Persisting changes and dealing with large files

## Execution Isolation, Portability, and Reproducibility
Azure ML Experimentation Service allows you to configure different execution targets, some are local -- such as local computer or a Docker container on a local computer, some are remote -- such as a Docker container in a remote machine, or an HDInsight cluster. Reference the [Configuration Experimentation Execution](experiment-execution-configuration.md) article for more details. Before any execution can happen, the project folder is copied into that compute target. This is true even in case of a local execution where a local temp folder is used for this purpose. 

3. Run the **iris_sklearn.py** script by using the **docker-python** environment. 

   - In the left toolbar, click the **Clock** icon to open the **Runs** panel. Click **All Runs**. 
   - On the top of the **All Runs** tab, choose **docker-python** as the targeted environment instead of the default **local**. 
   - Next, move to the right side and choose **iris_sklearn.py** as the script to run. 
   - Leave the **Arguments** field blank because the script specifies a default value. 
   - Click the **Run** button.

4. Observe that a new job starts. It appears in the **Jobs** pane on the right side of the Workbench window.

    When you run against Docker for the first time, it takes a few extra minutes to finish. 
    
    Behind the scenes, Azure Machine Learning Workbench builds a new docker file. 
    The new file references the base Docker image specified in the `docker.compute` file and the dependency Python packages specified in the `conda_dependencies.yml` file. 
    
    The Docker engine does the following:
    
    * Downloads the base image from Azure.
    
    * Installs the Python packages specified in the `conda_dependencies.yml` file.
    
    * Starts a Docker container.
    
    * Copies or references, depending on the run configuration, the local copy of the project folder.
    
    * Executes the `iris_sklearn.py` script.
    
    In the end, you should see the exact same result as you do when you target **local**.

5. Now, let's try Spark. The Docker base image contains a preinstalled and configured Spark instance. Because of this instance, you can execute a PySpark script in it. This is an easy way to develop and test your Spark program, without having to spend the time to install and configure Spark yourself. 

