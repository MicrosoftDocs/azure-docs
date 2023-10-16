---
title: Manage Spark pool level libraries for Apache Spark
description: Learn how to add and manage libraries on Spark pool level in Azure Synapse Analytics.
author: shuaijunye
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 09/21/2022
ms.author: shuaijunye
ms.subservice: spark
---

# Manage libraries for Apache Spark pools in Azure Synapse Analytics

Once you have identified the Scala, Java, R (Preview), or Python packages that you would like to use or update for your Spark application, you can install or remove them into a Spark pool. Pool-level libraries are available to all notebooks and jobs running on the pool.

There are two primary ways to install a library on a Spark pool:
-  Install a workspace library that has been uploaded as a workspace package.
-  For updating Python libraries, provide a *requirements.txt* or *Conda environment.yml* environment specification to install packages from repositories like PyPI, Conda-Forge, and more. Read the section about [environment specification](#environment-specification-formats) for further information.

After the changes are saved, a Spark job will run the installation and cache the resulting environment for later reuse. Once the job is complete, new Spark jobs or notebook sessions will use the updated pool libraries. 

> [!IMPORTANT]
> - If the package you are installing is large or takes a long time to install, this affects the Spark instance start up time.
> - Altering the PySpark, Python, Scala/Java, .NET, R, or Spark version is not supported.
> - Installing packages from external repositories like PyPI, Conda-Forge, or the default Conda channels is not supported within data exfiltration protection enabled workspaces.

## Manage packages from Synapse Studio or Azure portal
Spark pool libraries can be managed either from the Synapse Studio or Azure portal.

To update or add libraries to a Spark pool:
1. Navigate to your Azure Synapse Analytics workspace from the Azure portal.

    If you are updating from the **Azure portal**:

    - Under the **Synapse resources** section, select the **Apache Spark pools** tab and select a Spark pool from the list.
     
    - Select the **Packages** from the **Settings** section of the Spark pool.
    :::image type="content" source="./media/apache-spark-azure-portal-add-libraries/apache-spark-add-library-azure.png" alt-text="Screenshot that highlights the upload environment configuration file button." lightbox="./media/apache-spark-azure-portal-add-libraries/apache-spark-add-library-azure.png":::
   
    If you are updating from the **Synapse Studio**:
    - Select **Manage** from the main navigation panel and then select **Apache Spark pools**.

    - Select the **Packages** section for a specific Spark pool.
    :::image type="content" source="./media/apache-spark-azure-portal-add-libraries/studio-update-libraries.png" alt-text="Screenshot that highlights the logs of library installation." lightbox="./media/apache-spark-azure-portal-add-libraries/studio-update-libraries.png":::
   
2. For Python feed libraries, upload the environment configuration file using the file selector in the  **Packages** section of the page.
3. You can also select additional **workspace packages** to add Jar, Wheel, or Tar.gz files to your pool.
4. You can also remove the deprecated packages from **Workspace packages** section, your pool will no longer attach these packages.  
5. Once you save your changes, a system job will be triggered to install and cache the specified libraries. This process helps reduce overall session startup time.
6. Once the job has successfully completed, all new sessions will pick up the updated pool libraries.

> [!IMPORTANT]
> By selecting the option to **Force new settings**, you will end the all current sessions for the selected Spark pool. Once the sessions are ended, you will have to wait for the pool to restart.
>
> If this setting is unchecked, then you  will have to wait for the current Spark session to end or stop it manually. Once the session has ended, you will need to let the pool restart.


## Track installation progress  
A system reserved Spark job is initiated each time a pool is updated with a new set of libraries. This Spark job helps monitor the status of the library installation. If the installation fails due to library conflicts or other issues, the Spark pool will revert to its previous or default state. 

In addition, users can also inspect the installation logs to identify dependency conflicts or see which libraries were installed during the pool update.

To view these logs:
1. Navigate to the Spark applications list in the **Monitor** tab. 
2. Select the system Spark application job that corresponds to your pool update. These system jobs run under the *SystemReservedJob-LibraryManagement* title.
  :::image type="content" source="./media/apache-spark-azure-portal-add-libraries/system-reserved-library-job.png" alt-text="Screenshot that highlights system reserved library job." lightbox="./media/apache-spark-azure-portal-add-libraries/system-reserved-library-job.png":::
3. Switch to view the **driver** and **stdout** logs. 
4. Within the results, you will see the logs related to the installation of your dependencies.
  :::image type="content" source="./media/apache-spark-azure-portal-add-libraries/system-reserved-library-job-results.png" alt-text="Screenshot that highlights system reserved library job results." lightbox="./media/apache-spark-azure-portal-add-libraries/system-reserved-library-job-results.png":::



## Environment specification formats

### PIP requirements.txt
A *requirements.txt* file (output from the `pip freeze` command) can be used to upgrade the environment. When a pool is updated, the packages listed in this file are downloaded from PyPI. The full dependencies are then cached and saved for later reuse of the pool. 

The following snippet shows the format for the requirements file. The PyPI package name is listed along with an exact version. This file follows the format described in the [pip freeze](https://pip.pypa.io/en/stable/cli/pip_freeze/) reference documentation. 

This example pins a specific version. 
```
absl-py==0.7.0
adal==1.2.1
alabaster==0.7.10
```
#### YML format
In addition, you can also provide an *environment.yml* file to update the pool environment. The packages listed in this file are downloaded from the default Conda channels, Conda-Forge, and PyPI. You can specify other channels or remove the default channels by using the configuration options.

This example specifies the channels and Conda/PyPI dependencies. 

```
name: stats2
channels:
- defaults
dependencies:
- bokeh
- numpy
- pip:
  - matplotlib
  - koalas==1.7.0
```
For details on creating an environment from this environment.yml file, see [Creating an environment from an environment.yml file](https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#activating-an-environment).

## Next steps
- View the default libraries: [Apache Spark version support](apache-spark-version-support.md)
- Troubleshoot library installation errors: [Troubleshoot library errors](apache-spark-troubleshoot-library-errors.md)

