---
title: Manage Runtime Environment and Associated Runbooks in Azure Automation
description: This article tells how to manage runbooks in Runtime environment and associated runbooks Azure Automation
services: automation
ms.subservice: process-automation
ms.date: 07/09/2025
ms.topic: how-to
ms.custom: references_regions
ms.service: azure-automation
ms.author: v-jasmineme
author: jasminemehndir
---


# Manage Runtime environment and associated runbooks

This article provides information on how to create Runtime Environment and perform various operations through Azure portal and REST API.  


## Prerequisites

Before you assign permissions to managed identities, ensure you meet these prerequisites:

- An Azure Automation account in all public regions except Brazil Southeast and Gov clouds.


## Switch between Runtime environment and old experience

### Runtime environment experience

To switch to Runtime environment, follow these steps:

1. Select **Overview** and then select **Try Runtime environment experience**.

    :::image type="content" source="./media/manage-runtime-environment/runtime-environment-experience.png" alt-text="Screenshot shows how to try the runtime environment experience." lightbox="./media/manage-runtime-environment/runtime-environment-experience.png":::

1. Under **Process Automation**, you have the **Runtime Environments** and the **Modules** and **Python packages** under **Shared resources** are removed as the Runtime environment allows management of Packages required during Runbook execution.

1. To revert to the old experience for managing Modules and Packages, select **Overview** in the left pane and then select **Switch to Old Experience**.

    :::image type="content" source="./media/manage-runtime-environment/old-experience-view.png" alt-text="Screenshot shows how to navigate to the previous experience." lightbox="./media/manage-runtime-environment/old-experience-view.png":::

### Old experience

To switch to the old experience, follow this step:

1. Go to your Automation account, under **Process Automation**, the **Runtime environments** is removed and under **Shared resources**, **Modules** and **Python packages** can be seen.

    :::image type="content" source="./media/manage-runtime-environment/view-menu-options-old-experience.png" alt-text="Screenshot shows the menu options when the default settings are restored." lightbox="./media/manage-runtime-environment/view-menu-options-old-experience.png":::

> [!NOTE]
> Runbook updates persist between new Runtime environment experience and old experience. Any changes done in the Runtime environment linked to a runbook would persist during runbook execution in old experience.


## Manage Runtime environment

### Create Runtime environment

#### [Azure portal](#tab/create-runtime-portal)

To create a Runtime environment, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and select your Automation account.
1. In the **Overview** page, select **Try Runtime Environment experience**, if not already in the new experience.
1. Under **Process Automation**, select **Runtime Environments** and then select **Create**.
1. On the **Basics** tab, enter the following details:
    1. **Name** for the Runtime environment. It must begin with alphabet and can contain only alphabets, numbers, underscores, and dashes.  
    1. From the **Language** drop-down, select the scripting language for Runtime environment.
        - Choose **PowerShell** for PowerShell scripting language or **Python** for Python scripting language.
    1. Select **Runtime version** for scripting language.
        - For PowerShell - choose 5.1, 7.4
        - For Python - choose 3.10
    1. Enter appropriate **Description**.
    
       :::image type="content" source="./media/manage-runtime-environment/create-runtime-environment.png" alt-text="Screenshot shows the entries in basics tab of create runtime environment.":::

1. Select **Next** and in the **Packages** tab, upload the packages required during the runbook execution. The *Az PowerShell package* is uploaded by default for all PowerShell Runtime environments, which includes all cmdlets for managing Azure resources.

   > [!NOTE]
   > Azure CLI commands are supported in runbooks associated with PowerShell 7.4 Runtime environment. Azure CLI commands version 2.64.0 are available as a default package in PowerShell 7.4 Runtime environment.

1. To upload more Packages required during runbook execution. Select **Add a file** to add the file(s) stored locally on your computer or select **Add from gallery** to upload packages from PowerShell gallery.
      
        
   > [!NOTE]
   > - When you import a package, it might take several minutes. 100MB is the maximum total size of the files that you can import.
   > - Use *.zip* files for PowerShell runbook types as mentioned [here](/powershell/scripting/developer/module/understanding-a-windows-powershell-module).
   > - For Python 3.10 packages, use .whl files targeting cp310 Linux OS.
  
1. Select **Next** and in the **Review + Create** tab, verify that the settings are correct. When you select **Create**, Azure runs validation on Runtime environment settings that you have chosen. If the validation passes, you can proceed to create Runtime environment else, the portal indicates the settings that you need to modify.

In the **Runtime Environments** page, you can view the newly created  Runtime environment for your Automation account. If you don't find the newly created Runtime environments in the list, select **Refresh**.

#### [REST API](#tab/create-runtime-rest)

You can create a new Runtime environment for PowerShell 7.4 with Az PowerShell module in the Automation.

```REST
PUT 
https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Automation/automationAccounts/<accountName>/runtimeEnvironments/<runtimeEnvironmentName>?api-version=2024-10-23 

{ 
  "properties": { 
    "runtime": { 
        "language": "PowerShell",  
        "version": "7.4" 
        }, 
        "defaultPackages": { 
            "Az": "12.3.0" 
        } 
     }, 
    "name": "<runtimeEnvironmentName>" 
} 
```
Upload a package Az.Accounts to the Runtime environment.  

```REST
PUT 
https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Automation/automationAccounts/<accountName>/runtimeEnvironments/<runtimeEnvironmentName>/packages/Az.Accounts?api-version=2024-10-23

{ 
  "properties": { 
    "contentLink": { 
        "uri": "https://psg-prod-eastus.azureedge.net/packages/az.accounts.2.12.4.nupkg" 
    } 
  } 
} 
```
---

### View Runtime environment

Get the Runtime environment properties from the Automation account.
```REST
GET 
https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Automation/automationAccounts/<accountName>/runtimeEnvironments/<runtimeEnvironmentName>?api-version=2024-10-23 
```

### List Runtime environments

#### [Azure portal](#tab/list-runtime-portal)

To list all the Runtime environments from the Automation account, follow this step:

1. In your Automation account, under **Process Automation**, select **Runtime Environments**.

   :::image type="content" source="./media/manage-runtime-environment/list-runtime-environment.png" alt-text="Screenshot shows how to view the list of all runtime environments." lightbox="./media/manage-runtime-environment/list-runtime-environment.png":::

#### [REST API](#tab/list-runtime-rest) 

```REST
GET 
https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Automation/automationAccounts/<accountName>/runtimeEnvironments?api-version=2024-10-23
```
---

### View components of Az PowerShell package

To view all the component packages of *Az PowerShell package*, run `Get-Module -ListAvailable` cmdlet in a PowerShell runbook. 

Job output would show all the component packages and their versions.

:::image type="content" source="./media/manage-runtime-environment/view-components-powershell-package.png" alt-text="Screenshot shows the components of PowerShell package." lightbox="./media/manage-runtime-environment/view-components-powershell-package.png":::


### Delete Runtime environment

#### [Azure portal](#tab/delete-runtime-portal)

To delete the Runtime environment from the Automation account, follow these steps:

1. In your Automation account, under **Process Automation**, select **Runtime Environments**.
1. Select the runtime environment that you want to delete.
1. Select **Delete** to delete the Runtime environment.

   :::image type="content" source="./media/manage-runtime-environment/delete-runtime-environment.png" alt-text="Screenshot shows how to delete the runtime environment." lightbox="./media/manage-runtime-environment/delete-runtime-environment.png":::

#### [REST API](#tab/delete-runtime-rest)

```REST
DELETE  
https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Automation/automationAccounts/<accountName>/runtimeEnvironments/<runtimeEnvironmentName>?api-version=2024-10-23
```
---

### Update Runtime environment

Runtime language and Runtime version are immutable properties. However, you can update the version of modules and add or remove packages in the Runtime environment. Runbooks linked to the Runtime environment are automatically updated with the new settings.

#### [Azure portal](#tab/update-runtime-portal)

To update a Runtime environment, follow these steps:

1. In your Automation account, under **Process Automation**, select **Runtime Environments**.
1. Select the Runtime environment that you want to update.
1. Select the version from dropdown to update the version of existing packages.
1. Select **Save**.
   
   :::image type="content" source="./media/manage-runtime-environment/update-runtime-environment.png" alt-text="Screenshot shows how to update the runtime environment." lightbox="./media/manage-runtime-environment/update-runtime-environment.png":::

1. Select **Add a file** to upload packages from your local computer or **Add from gallery** to upload packages from PowerShell Gallery.

   > [!NOTE]
   > You can add up to 10 packages at a time to Runtime environment. Ensure that you **Save** after adding 10 packages.

#### [REST API](#tab/update-runtime-rest)

Update the Az module version of an existing Runtime environment.

```REST
PATCH 
https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Automation/automationAccounts/<accountName>/runtimeEnvironments/<runtimeEnvironmentName>?api-version=2024-10-23
{ 

  "properties": { 

        "defaultPackages": { 

            "Az": "12.3.0" 

        } 

     } 

} 
```
---
## Manage Runbooks linked to Runtime environment

### Create Runbook

You can create a new PowerShell runbook configured with Runtime environment.

#### [Azure portal](#tab/create-runbook-portal)

**Prerequisite**
- Ensure that you have created a Runtime environment before creating a runbook.

To create a new runbook linked to the Runtime environment, follow these steps:

1. In your Automation account, under **Process Automation**, select **Runbooks**.
1. Select **Create**.
1. On the **Basics** tab, you can either create a new runbook or upload a file from your local computer or from PowerShell gallery.
   1. Enter a **Name** for the runbook. It must begin with a letter and can contain only letters, numbers, underscores, and dashes.
   1. From the **Runbook type** dropdown, select the type of runbook that you want to create.
   1. Select **Runtime environment** to be configured for the runbook. You can either **Select from existing** Runtime environments or **Create new** Runtime environment and link it to the Runbook. The list of runtime environments is populated based on the *Runbook type* selected in step b.
   1. Enter appropriate **Description**.
  
      :::image type="content" source="./media/manage-runtime-environment/create-runbook.png" alt-text="Screenshot shows how to create runbook in runtime environment." lightbox="./media/manage-runtime-environment/create-runbook.png":::

   > [!NOTE]
   > For **PowerShell Runbook Type**, only the PowerShell Runtime environment would be listed for selection.
   > For **Python Runbook Type**, only the Python Runtime environments would be listed for selection.
 
1. Add **Tags** to the runbook, review the settings and select **Create** to create a new runbook.

This runbook is linked to the selected Runtime environment. All the packages in the chosen Runtime environment would be available during execution of the runbook.

#### [REST API](#tab/create-runbook-rest)

**Prerequisite**
- Configure a PowerShell Runtime environment and provide it as an input for runbook creation. 

```REST
PUT 
https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Automation/automationAccounts/<accountName>/runbooks/<runbookName>?api-version=2024-10-23

{ 
  "properties": { 
        "runbookType": "PowerShell", 
        "runtimeEnvironment": <runtimeEnvironmentName>, 
        "publishContentLink": { 
            "uri": "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-automation-runbook-getvms/Runbooks/Get-AzureVMTutorial.ps1" 
        } 
    }, 
   "location": "East US"
} 
```
> [!NOTE]
> Similar APIs also work for Python runbook type.

---

### Update Runbook

You can update runbook by changing the Runtime environment linked to the runbook. You can choose single or multiple runbooks for update. Runbook in running status would not be impacted by changing the Runtime environment linked to that runbook.

#### [Azure portal](#tab/update-runbook-portal)

To update a runbook, follow these steps:

1. In your Automation account, under **Process Automation**, select **Runbooks**.
1. Select the checkbox for the runbook(s) that you want to update.
1. Select **Update Runtime Environment**.

   :::image type="content" source="./media/manage-runtime-environment/update-runbook.png" alt-text="Screenshot shows how to update runbook in runtime environment." lightbox="./media/manage-runtime-environment/update-runbook.png":::

1. Select the Runtime environment from the dropdown to which you want to link the runbook(s).

1. Select **Update** to update selected runbook(s) with new Runtime environment.
   
Check if the runbook executes as expected after update. If the runbook fails to provide the expected outcome, you can again update the Runtime environment to the old experience by following the steps 1-4.

> [!NOTE]
> Runbook updates persist between new Runtime environment experience and old experience. Any changes done in Runtime environment linked to a runbook would persist during runbook execution in old experience. 

#### [REST API](#tab/update-runbook-rest)

Update Runtime environment linked to a runbook.  

```REST
PATCH 
https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Automation/automationAccounts/<accountName>/runbooks/<runbookName>?api-version=2024-10-23
{ 
  "properties": { 
    "type": "PowerShell",
    "runtimeEnvironment": "<runtimeEnvironmentName>" 
  } 
} 
```
> [!NOTE]
> The View/Delete calls for runbook remains same and can be referenced [Runbook - REST API Azure Automation | Microsoft Learn](/rest/api/automation/runbook).

---

### Test Runbook update

Run a test job for a runbook with a different Runtime environment. This scenario is useful when a runbook needs to be tested with a Runtime environment before update.  

#### [Azure portal](#tab/test-update-portal)

You can update runbooks by changing the Runtime environment linked to that runbook. We recommend that you test runbook execution before publishing the changes. It's to ensure the runbook works as expected. 

To test runbook execution before publishing Runtime environment changes, follow these steps:

1. Go to the **Runbooks** page and select runbook for which you want to update the Runtime environment.

   :::image type="content" source="./media/manage-runtime-environment/access-runbook.png" alt-text="Screenshot shows how to go to Runbooks page to select runbook." lightbox="./media/manage-runtime-environment/access-runbook.png":::

1. In the **Edit runbook** page, select **Edit in Portal** to open the text editor.
1. The Runtime environment field shows the existing configuration. Select the new Runtime environment from the dropdown list.
1. Select **Test pane** to test runbook execution with the updated Runtime environment. Select **Start** to begin the test run.
1. Close the test pane and make the required changes in Runbook code or Runtime environment if necessary.
1. Select **Publish** to update the Runtime environment linked to the runbook. 
1. Select **Yes** to override the previously published version and confirm the changes.


#### [REST API](#tab/test-update-api)

Run a test job for a runbook with a different Runtime environment. This scenario is useful when a runbook needs to be tested with a Runtime environment before update.

```REST
PUT 
https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Automation/automationAccounts/<accountName>/runbooks/<runbookName>/draft/testJob?api-version=2024-10-23
{ 
  "properties": { 
    "runtimeEnvironment": "<runtimeEnvironmentName>" 
    "runOn": "" 
  } 
} 
```
---

### Create Cloud Job

#### [Azure portal](#tab/create-cloud-job-portal)

You can execute runbooks linked to Runtime Environment both on Azure and Hybrid Worker.

#### [REST API](#tab/create-cloud-job-rest)
Jobs inherit the Runtime environment from the runbook. Run a cloud job for a published runbook.

```REST
PUT
https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Automation/automationAccounts/<accountName>/jobs/<jobName>?api-version=2024-10-23
{
  "properties": {
    "runbook": {
      "name": "<runbookName>" 
    }, 
    "runOn": "" 
  } 
} 
```
> [!NOTE]
> Create/View calls for job remains same and can be referenced from [Job-REST API (Azure Automation) | Microsoft Learn](/rest/api/automation/job).

---

### Link existing runbooks to System-generated Runtime environments

All existing runbooks in your Azure Automation account would be automatically linked to System-generated Runtime environments. These system-generated Runtime environments are created based on Runtime language, version and Modules/Packages present in your respective Azure Automation account. [Learn more](runtime-environment-overview.md#system-generated-runtime-environments). To update existing runbooks, change the Runtime environment by following the steps mentioned [here](#test-runbook-update).

   
## Next steps

* For an overview [Runtime Environment](runtime-environment-overview.md).
* To troubleshoot issues with runbook execution, see [Troubleshoot runbook issues](troubleshoot/runbooks.md).
