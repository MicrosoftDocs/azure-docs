---
title: Manage Python 2 packages in Azure Automation
description: This article tells how to manage Python 2 packages in Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 02/25/2019
ms.topic: conceptual
ms.custom: tracking-python
---
# Manage Python 2 packages in Azure Automation

Azure Automation allows you to run Python 2 runbooks on Azure and on Linux Hybrid Runbook Workers. To help in simplification of runbooks, you can use Python packages to import the modules that you need. This article describes how to manage and use Python packages in Azure Automation.

## Import packages

In your Automation account, select **Python 2 packages** under **Shared Resources**. Click **+ Add a Python 2 package**.

![Add Python package](media/python-packages/add-python-package.png)

On the Add Python 2 Package page, select a local package to upload. The package can be a **.whl** or **.tar.gz** file. When the package is selected, click **OK** to upload it.

![Add Python package](media/python-packages/upload-package.png)

Once a package has been imported, it's listed on the Python 2 packages page in your Automation account. If you need to remove a package, select the package and click **Delete**.

![Package list](media/python-packages/package-list.png)

## Import packages with dependencies

Azure automation doesn't resolve dependencies for Python packages during the import process. There are two ways to import a package with all its dependencies. Only one of the following steps needs to be used to import the packages into your Automation account.

### Manually download

On a Windows 64-bit machine with [Python2.7](https://www.python.org/downloads/release/latest/python2) and [pip](https://pip.pypa.io/en/stable/) installed, run the following command to download a package and all its dependencies:

```cmd
C:\Python27\Scripts\pip2.7.exe download -d <output dir> <package name>
```

Once the packages are downloaded, you can import them into your automation account.

### Runbook

 To obtain a runbook, [import Python 2 packages from pypi into Azure Automation account](https://gallery.technet.microsoft.com/scriptcenter/Import-Python-2-packages-57f7d509) from the gallery into your Automation account. Make sure the Run Settings are set to **Azure** and start the runbook with the parameters. The runbook requires a Run As account for the Automation account to work. For each parameter make sure you start it with the switch as seen in the following list and image:

* -s \<subscriptionId\>
* -g \<resourceGroup\>
* -a \<automationAccount\>
* -m \<modulePackage\>

![Package list](media/python-packages/import-python-runbook.png)

The runbook allows you to specify what package to download. For example, use of the `Azure` parameter downloads all Azure modules and all dependencies (about 105).

Once the runbook is complete, you can check the **Python 2 packages** under **Shared Resources** in your Automation account to verify that the package has been imported correctly.

## Use a package in a runbook

With a package imported, you can use it in a runbook. The following example uses the [Azure Automation utility package](https://github.com/azureautomation/azure_automation_utility). This package makes it easier to use Python with Azure Automation. To use the package, follow the instructions in the GitHub repository and add it to the runbook. For example, you can use `from azure_automation_utility import get_automation_runas_credential` to import the function for retrieving the Run As account.

```python
import azure.mgmt.resource
import automationassets
from azure_automation_utility import get_automation_runas_credential

# Authenticate to Azure using the Azure Automation RunAs service principal
runas_connection = automationassets.get_automation_connection("AzureRunAsConnection")
azure_credential = get_automation_runas_credential()

# Intialize the resource management client with the RunAs credential and subscription
resource_client = azure.mgmt.resource.ResourceManagementClient(
    azure_credential,
    str(runas_connection["SubscriptionId"]))

# Get list of resource groups and print them out
groups = resource_client.resource_groups.list()
for group in groups:
    print group.name
```

## Develop and test runbooks offline

To develop and test your Python 2 runbooks offline, you can use the [Azure Automation Python emulated assets](https://github.com/azureautomation/python_emulated_assets) module on GitHub. This module allows you to reference your shared resources such as credentials, variables, connections, and certificates.

## Next steps

To prepare a Python runbook, see [Create a Python runbook](learn/automation-tutorial-runbook-textual-python2.md).
