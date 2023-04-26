---
title: Manage Python 3 packages in Azure Automation
description: This article tells how to manage Python 3 packages (preview) in Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 03/29/2023
ms.topic: conceptual
ms.custom: has-adal-ref, references_regions, devx-track-azurepowershell
---

# Manage Python 3 packages (preview) in Azure Automation

This article describes how to import, manage, and use Python 3 (preview) packages in Azure Automation running on the Azure sandbox environment and Hybrid Runbook Workers. Python packages should be downloaded on Hybrid Runbook workers for successful job execution. To help simplify runbooks, you can use Python packages to import the modules you need.

For information on managing Python 2 packages, see [Manage Python 2 packages](./python-packages.md).

## Default Python packages

To support Python 3.8 (preview) runbooks in the Automation service, Azure package 4.0.0 is installed by default in the Automation account. The default version can be overridden by importing Python packages into your Automation account. 

Preference is given to the imported version in your Automation account. To import a single package, see [Import a package](#import-a-package). To import a package with multiple packages, see [Import a package with dependencies](#import-a-package-with-dependencies). 

There are no default packages installed for Python 3.10 (preview). 

## Packages as source files

Azure Automation supports only a Python package that only contains Python code and doesn't include other language extensions or code in other languages. However, the Azure Sandbox environment might not have the required compilers for C/C++ binaries, so it's recommended to use [wheel files](https://pythonwheels.com/) instead. 

> [!NOTE]
> Currently, Python 3.10 (preview) only supports wheel files.

The [Python Package Index](https://pypi.org/) (PyPI) is a repository of software for the Python programming language. When selecting a Python 3 package to import into your Automation account from PyPI, note the following filename parts:

Select a Python version:

#### [Python 3.8 (preview)](#tab/py3)

| Filename part | Description |
|---|---|
|cp38|Automation supports **Python 3.8 (preview)** for Cloud jobs.|
|amd64|Azure sandbox processes are **Windows 64-bit** architecture.|

For example:
- To import pandas - select a wheel file with a name similar as `pandas-1.2.3-cp38-win_amd64.whl`. 

Some Python packages available on PyPI don't provide a wheel file. In this case, download the source (.zip or .tar.gz file) and generate the wheel file using `pip`.

Perform the following steps using a 64-bit Windows machine with Python 3.8.x and wheel package installed:

1. Download the source file `pandas-1.2.4.tar.gz`.
1. Run pip to get the wheel file with the following command: `pip wheel --no-deps pandas-1.2.4.tar.gz`

#### [Python 3.10 (preview)](#tab/py10)

| Filename part | Description |
|---|---|
|cp310|Automation supports **Python 3.10 (preview)** for Cloud jobs.|
|manylinux_x86_64|Azure sandbox processes are Linux based 64-bit architecture for Python 3.10 (preview) runbooks.


For example: 
- To import pandas - select a wheel file with a name similar as `pandas-1.5.0-cp310-cp310-manylinux_2_17_x86_64.manylinux2014_x86_64.whl`


Some Python packages available on PyPI don't provide a wheel file. In this case, download the source (.zip or .tar.gz file) and generate the wheel file using pip. 

Perform the following steps using a 64-bit Linux machine with Python 3.10.x and wheel package installed:

1.	Download the source file `pandas-1.2.4.tar.gz.`
1. Run pip to get the wheel file with the following command: `pip wheel --no-deps pandas-1.2.4.tar.gz`

---


## Import a package

1. In your Automation account, select **Python packages** under **Shared Resources**. Then select **+ Add a Python package**.

   :::image type="content" source="media/python-3-packages/add-python-3-package.png" alt-text="Screenshot of the Python packages page shows Python packages in the left menu and Add a Python package highlighted.":::

1. On the **Add Python Package** page, select a local package to upload. The package can be a **.whl** or **.tar.gz** file for Python 3.8 (preview) and **.whl** file for Python 3.10 (preview). 
1. Enter a name and select the **Runtime Version** as Python 3.8 (preview) or Python 3.10 (preview).
   > [!NOTE]
   > Currently, Python 3.10 (preview) runtime version is supported for both Cloud and Hybrid jobs in all Public regions except Australia Central2, Korea South, Sweden South, Jio India Central, Brazil Southeast, Central India, West India, UAE Central, and Gov clouds.               
1. Select **Import**.

   :::image type="content" source="media/python-3-packages/upload-package.png" alt-text="Screenshot shows the Add Python 3.8 (preview) Package page with an uploaded tar.gz file selected.":::

After a package has been imported, it's listed on the Python packages page in your Automation account. To remove a package, select the package and click **Delete**.

:::image type="content" source="media/python-3-packages/python-3-packages-list.png" alt-text="Screenshot shows the Python 3.8 (preview) packages page after a package has been imported.":::

### Import a package with dependencies

You can import a Python 3.8 (preview) package and its dependencies by importing the following Python script into a Python 3 runbook, and then running it.

```cmd
https://github.com/azureautomation/runbooks/blob/master/Utility/Python/import_py3package_from_pypi.py
```

#### Importing the script into a runbook
For information on importing the runbook, see [Import a runbook from the Azure portal](manage-runbooks.md#import-a-runbook-from-the-azure-portal). Copy the file from GitHub to storage that the portal can access before you run the import.

> [!NOTE]
> Currently, importing a runbook from Azure Portal isn't supported for Python 3.10 (preview).


The **Import a runbook** page defaults the runbook name to match the name of the script. If you have access to the field, you can change the name. **Runbook type** may default to **Python 2**. If it does, make sure to change it to **Python 3**.

:::image type="content" source="media/python-3-packages/import-python-3-package.png" alt-text="Screenshot shows the Python 3 runbook import page.":::

#### Executing the runbook to import the package and dependencies

After creating and publishing the runbook, run it to import the package. See [Start a runbook in Azure Automation](start-runbooks.md) for details on executing the runbook.

The script (`import_py3package_from_pypi.py`) requires the following parameters.

| Parameter | Description |
|---------------|-----------------|
|subscription_id | Subscription ID of the Automation account |
| resource_group | Name of the resource group that the Automation account is defined in |
| automation_account | Automation account name |
| module_name | Name of the module to import from `pypi.org` |

For more information on using parameters with runbooks, see [Work with runbook parameters](start-runbooks.md#work-with-runbook-parameters).

## Use a package in a runbook

With the package imported, you can use it in a runbook. Add the following code to list all the resource groups in an Azure subscription.

```python
#!/usr/bin/env python3 
import os 
import requests  
# printing environment variables 
endPoint = os.getenv('IDENTITY_ENDPOINT')+"?resource=https://management.azure.com/" 
identityHeader = os.getenv('IDENTITY_HEADER') 
payload={} 
headers = { 
  'X-IDENTITY-HEADER': identityHeader,
  'Metadata': 'True' 
} 
response = requests.request("GET", endPoint, headers=headers, data=payload) 
print(response.text)

```

> [!NOTE]
> The Python `automationassets` package is not available on pypi.org, so it's not available for import on to a Windows hybrid runbook worker.


## Identify available packages in sandbox

Use the following code to list the default installed modules:

```python
#!/usr/bin/env python3

import pkg_resources
installed_packages = pkg_resources.working_set
installed_packages_list = sorted(["%s==%s" % (i.key, i.version)
   for i in installed_packages])

for package in installed_packages_list:
    print(package)
```

### Python 3.8 (preview) PowerShell cmdlets

#### Add new Python 3.8 (preview) package

```python
New-AzAutomationPython3Package -AutomationAccountName tarademo  -ResourceGroupName mahja -Name requires.io -ContentLinkUri https://files.pythonhosted.org/packages/7f/e2/85dfb9f7364cbd7a9213caea0e91fc948da3c912a2b222a3e43bc9cc6432/requires.io-0.2.6-py2.py3-none-any.whl 

Response  
ResourceGroupName     : mahja 
AutomationAccountName : tarademo 
Name                  : requires.io 
IsGlobal              : False 
Version               : 
SizeInBytes           : 0 
ActivityCount         : 0 
CreationTime          : 9/26/2022 1:37:13 PM +05:30 
LastModifiedTime      : 9/26/2022 1:37:13 PM +05:30 
ProvisioningState     : Creating 
```

#### List all Python 3.8 (preview) packages

```python
Get-AzAutomationPython3Package -AutomationAccountName tarademo  -ResourceGroupName mahja 

Response : 
ResourceGroupName     : mahja 
AutomationAccountName : tarademo 
Name                  : cryptography 
IsGlobal              : False 
Version               : 
SizeInBytes           : 0 
ActivityCount         : 0 
CreationTime          : 9/26/2022 11:52:28 AM +05:30 
LastModifiedTime      : 9/26/2022 12:11:00 PM +05:30 
ProvisioningState     : Failed 
ResourceGroupName     : mahja 
AutomationAccountName : tarademo 
Name                  : requires.io 
IsGlobal              : False 
Version               : 
SizeInBytes           : 0 
ActivityCount         : 0 
CreationTime          : 9/26/2022 1:37:13 PM +05:30 
LastModifiedTime      : 9/26/2022 1:39:04 PM +05:30 
ProvisioningState     : ContentValidated 
ResourceGroupName     : mahja 
AutomationAccountName : tarademo 
Name                  : sockets 
IsGlobal              : False 
Version               : 1.0.0 
SizeInBytes           : 4495 
ActivityCount         : 0 
CreationTime          : 9/20/2022 12:46:28 PM +05:30 
LastModifiedTime      : 9/22/2022 5:03:42 PM +05:30 
ProvisioningState     : Succeeded 
```

#### Obtain details about specific package

```python
Get-AzAutomationPython3Package -AutomationAccountName tarademo  -ResourceGroupName mahja -Name sockets 


Response  
ResourceGroupName     : mahja 
AutomationAccountName : tarademo 
Name                  : sockets 
IsGlobal              : False 
Version               : 1.0.0 
SizeInBytes           : 4495 
ActivityCount         : 0 
CreationTime          : 9/20/2022 12:46:28 PM +05:30 
LastModifiedTime      : 9/22/2022 5:03:42 PM +05:30 
ProvisioningState     : Succeeded 
```

#### Remove Python 3.8 (preview) package

```python
Remove-AzAutomationPython3Package -AutomationAccountName tarademo  -ResourceGroupName mahja -Name sockets 
```

#### Update Python 3.8 (preview) package

```python
Set-AzAutomationPython3Package -AutomationAccountName tarademo  -ResourceGroupName mahja -Name requires.io -ContentLinkUri https://files.pythonhosted.org/packages/7f/e2/85dfb9f7364cbd7a9213caea0e91fc948da3c912a2b222a3e43bc9cc6432/requires.io-0.2.6-py2.py3-none-any.whl 


ResourceGroupName     : mahja 
AutomationAccountName : tarademo 
Name                  : requires.io 
IsGlobal              : False 
Version               : 0.2.6 
SizeInBytes           : 10109 
ActivityCount         : 0 
CreationTime          : 9/26/2022 1:37:13 PM +05:30 
LastModifiedTime      : 9/26/2022 1:43:12 PM +05:30 
ProvisioningState     : Creating 
```

## Next steps

To prepare a Python runbook, see [Create a Python runbook](learn/automation-tutorial-runbook-textual-python-3.md).
