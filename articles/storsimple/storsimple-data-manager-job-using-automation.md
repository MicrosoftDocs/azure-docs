---
title: Use Azure Automation to trigger a job | Microsoft Docs
description: Learn how to use Azure Automation for triggering StorSimple Data Manager Jobs (private preview)
services: storsimple
documentationcenter: NA
author: vidarmsft
manager: syadav
editor: ''

ms.assetid:
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 03/16/2017
ms.author: vidarmsft
---

# Use Azure Automation to trigger a job (Private Preview)

This articles describes how to use Azure Automation to trigger a StorSimple Data Manager job.

## Prerequisites

Before you begin, ensure that you have:

*	Azure Powershell installed. [Download Azure Powershell](https://azure.microsoft.com/documentation/articles/powershell-install-configure/).
*	Configuration settings to initialize the Data Transformation job (instructions to obtain these settings are included here).
*	A job definition that has been correctly configured in a Hybrid Data Resource within a resource group.
*	Download `DataTransformationApp.zip` [zip](https://github.com/Azure-Samples/storsimple-dotnet-data-manager-get-started/raw/master/Azure%20Automation%20For%20Data%20Manager/DataTransformationApp.zip) file from the github repository.
*	Download `Get-ConfigurationParams.ps1` [script](https://github.com/Azure-Samples/storsimple-dotnet-data-manager-get-started/blob/master/Azure%20Automation%20For%20Data%20Manager/Get-ConfigurationParams.ps1) from the github repository.
*	Download `Trigger-DataTransformation-Job.ps1` [script](https://github.com/Azure-Samples/storsimple-dotnet-data-manager-get-started/blob/master/Azure%20Automation%20For%20Data%20Manager/Trigger-DataTransformation-Job.ps1) from the github repository.

## Step-by-step

### Get Azure Active Directory permissions for the automation job to run the job definition

1. To retrieve the configuration parameters for Active Directory, do the following steps:

    1. Open Windows PowerShell in your local machine. Ensure that [Azure PowerShell](https://azure.microsoft.com/downloads/) is installed.
    1. Run the `Get-ConfigurationParams.ps1` script (in the folder you downloaded above). Type the following command in the PowerShell window:

        ```
        .\Get-ConfigurationParams.ps1 -SubscriptionName "AzureSubscriptionName" -ActiveDirectoryKey "AnyRandomPassword" -AppName "ApplicationName"
         ```

        The ActiveDirectoryKey is a password that you use later. Enter a password of your choice. AppName can be any string.

2. This script outputs the following values that should be used while triggering the automation runbook. Make a note of these values.

    - Client ID
    - Tenant ID
    - Active Directory key (same as the one entered above)
    - Subscription ID

### Set up the Automation Account

1. Log on to Azure and open your Automation account.
2. Click **Assets** tile to open the list of assets.
3. Click **Modules** tile to open the list of modules.
4. Click **+ Add a module** button and the Add module blade is launched.

    ![Automation account settings](./media/storsimple-data-manager-job-using-automation/add-module1m.png)

5. After you have selected the `DataTransformationApp.zip` file from your local computer, click **OK** to import the module.

   When Azure Automation imports a module to your account, it extracts metadata about the module. This operation may take a couple of minutes.

   ![Automation account settings](./media/storsimple-data-manager-job-using-automation/add-module2m.png)

   

6. You receive a notification that the module is being deployed and another notification when the process is complete.  You can also check the status in **Modules** tile.

### To import the runbook that triggers the job definition

1. In the Azure portal, open your Automation account.
2. Click **Runbooks** tile to open the list of runbooks.
3. Click **+ Add a runbook** and then **Import an existing runbook**.

   ![Import an existing runbook](./media/storsimple-data-manager-job-using-automation/import-a-runbook.png)

4. Click **Runbook file** and select the file to import `Trigger-DataTransformation-Job.ps1`.
5. Click **Create** to import the runbook. The new runbook appears in the list of runbooks for the Automation account.
7. Click **Trigger-DataTransformation-Job** runbook and then click **Edit**.
8. Click **Publish** and then **Yes** when prompted for confirmation.


### To run the runbook:
1. In the Azure portal, open your Automation account.
2. Click the **Runbooks** tile to open the list of runbooks.
3. Click **Trigger-DataTransformation-Job**.
4. Click **Start** to start the runbook.

   ![Start runbook](./media/storsimple-data-manager-job-using-automation/run-runbook1m.png)

5. In the **Start runbook** blade, enter all the parameters. Click **OK** to submit the Data Transformation job.

   ![Start runbook](./media/storsimple-data-manager-job-using-automation/run-runbook2m.png)


## Next steps

[Use StorSimple Data Manager UI to transform your data](storsimple-data-manager-ui.md).