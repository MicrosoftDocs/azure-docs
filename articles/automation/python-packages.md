---
title: Manage Python 2 packages in Azure Automation
description: This article tells how to manage Python 2 packages in Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 08/21/2023
ms.topic: conceptual
ms.custom: devx-track-python
---

# Manage Python 2 packages in Azure Automation

This article describes how to import, manage, and use Python 2 packages in Azure Automation running on the Azure sandbox environment and Hybrid Runbook Workers. To help simplify runbooks, you can use Python packages to import the modules you need.

For information on managing Python 3 packages, see [Manage Python 3 packages](./python-3-packages.md).

## Import packages

1. In your Automation account, select **Python packages** under **Shared Resources**. Select **+ Add a Python package**.

    :::image type="content" source="media/python-packages/add-python-package.png" alt-text="Screenshot of the Python packages page shows Python packages in the left menu and Add a Python package highlighted.":::

2. On the **Add Python Package** page, select a local package to upload. The package can be a **.whl** or **.tar.gz** file. 
3. Enter the name and select the **Runtime version** as 2.x.x
4. Select **Import**.

   :::image type="content" source="media/python-packages/upload-package.png" alt-text="Screenshot shows the Add Python Package page with an uploaded tar.gz file selected.":::

After a package has been imported, it's listed on the **Python packages** page in your Automation account. To remove a package, select the package and select **Delete**.

:::image type="content" source="media/python-packages/package-list.png" alt-text="Screenshot shows the Python 2.7.x packages page after a package has been imported.":::

## Import packages with dependencies

Azure Automation doesn't resolve dependencies for Python packages during the import process. There are two ways to import a package with all its dependencies. Only one of the following steps needs to be used to import the packages into your Automation account.

### Manually download

On a Windows 64-bit machine with [Python2.7](https://www.python.org/downloads/release/latest/python2) and [pip](https://pip.pypa.io/en/stable/) installed, run the following command to download a package and all its dependencies:

```cmd
C:\Python27\Scripts\pip2.7.exe download -d <output dir> <package name>
```

Once the packages are downloaded, you can import them into your automation account.

### Runbook

 To obtain a runbook, [import Python 2 packages from pypi into Azure Automation account](https://github.com/azureautomation/import-python-2-packages-from-pypi-into-azure-automation-account) from the Azure Automation GitHub organization into your Automation account. Make sure the Run Settings are set to **Azure** and start the runbook with the parameters. Ensure that Managed identity is enabled for your Automation account and has Automation Contributor access for successful import of package.  For each parameter make sure you start it with the switch as seen in the following list and image:

* -s \<subscriptionId\>
* -g \<resourceGroup\>
* -a \<automationAccount\>
* -m \<modulePackage\>

:::image type="content" source="media/python-packages/import-python-runbook.png" alt-text="Screenshot shows the Overview page for  import_py2package_from_pypi with the Start Runbook pane on the right side.":::

The runbook allows you to specify what package to download. For example, use of the `Azure` parameter downloads all Azure modules and all dependencies (about 105). After the runbook is complete, you can check the **Python packages** under **Shared Resources** in your Automation account to verify that the package has been imported correctly.

## Use a package in a runbook

With a package imported, you can use it in a runbook. Add the following code to list all the resource groups in an Azure subscription:

```python
#!/usr/bin/env python 
import os 
import requests 
# printing environment variables 
endPoint = os.getenv('IDENTITY_ENDPOINT') + "?resource=https://management.azure.com/" 
identityHeader = os.getenv('IDENTITY_HEADER') 
payload = {} 
headers = { 
    'X-IDENTITY-HEADER': identityHeader, 
    'Metadata': 'True' 
} 
response = requests.request("GET", endPoint, headers=headers, data=payload) 
print response.text 
```

## Develop and test runbooks offline

To develop and test your Python 2 runbooks offline, you can use the [Azure Automation Python emulated assets](https://github.com/azureautomation/python_emulated_assets) module on GitHub. This module allows you to reference your shared resources such as credentials, variables, connections, and certificates.

## Next steps

To prepare a Python runbook, see [Create a Python runbook](./learn/automation-tutorial-runbook-textual-python-3.md).
