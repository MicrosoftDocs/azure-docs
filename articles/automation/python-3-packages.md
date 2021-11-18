---
title: Manage Python 3 packages in Azure Automation
description: This article tells how to manage Python 3 packages (preview) in Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 11/01/2021
ms.topic: conceptual
ms.custom: has-adal-ref
---

# Manage Python 3 packages (preview) in Azure Automation

This article describes how to import, manage, and use Python 3 (preview) packages in Azure Automation running on the Azure sandbox environment and Hybrid Runbook Workers.To help simplify runbooks, you can use Python packages to import the modules you need. 

To support Python 3 runbooks in the Automation service, Azure package 4.0.0 is installed by default in the Automation account. The default version can be overridden by importing Python packages into your Automation account. 
 Preference is given to the imported version in your Automation account. To import a single package, see [Import a package](#import-a-package). To import a package with multiple packages, see [Import a package with dependencies](#import-a-package-with-dependencies). 

For information on managing Python 2 packages, see [Manage Python 2 packages](./python-packages.md).

## Packages as source files

Azure Automation supports only a Python package that only contains Python code and doesn't include other language extensions or code in other languages. However, the Azure Sandbox environment might not have the required compilers for C/C++ binaries, so it's recommended to use [wheel files](https://pythonwheels.com/) instead. The [Python Package Index](https://pypi.org/) (PyPI) is a repository of software for the Python programming language. When selecting a Python 3 package to import into your Automation account from PyPI, note the following filename parts:

| Filename part | Description |
|---|---|
|cp38|Automation supports **Python 3.8.x** for Cloud Jobs.|
|amd64|Azure sandbox processes are **Windows 64-bit** architecture.|

For example, if you wanted to import pandas, you could select a wheel file with a name similar as `pandas-1.2.3-cp38-win_amd64.whl`.

Some Python packages available on PyPI don't provide a wheel file. In this case, download the source (.zip or .tar.gz file) and generate the wheel file using `pip`. For example, perform the following steps using a 64-bit machine with Python 3.8.x and wheel package installed:

1. Download the source file `pandas-1.2.4.tar.gz`.
1. Run pip to get the wheel file with the following command: `pip wheel --no-deps pandas-1.2.4.tar.gz`.

## Import a package

1. In your Automation account, select **Python packages** under **Shared Resources**. Then select **+ Add a Python package**.

   :::image type="content" source="media/python-3-packages/add-python-3-package.png" alt-text="Screenshot of the Python packages page shows Python packages in the left menu and Add a Python package highlighted.":::

1. On the **Add Python Package** page, select a local package to upload. The package can be a **.whl** or **.tar.gz** file. 
1. Enter a name and select the **Runtime Version** as Python 3.8.x (preview)
1. Select **Import**

   :::image type="content" source="media/python-3-packages/upload-package.png" alt-text="Screenshot shows the Add Python 3.8.x Package page with an uploaded tar.gz file selected.":::

After a package has been imported, it's listed on the Python packages page in your Automation account. To remove a package, select the package and click **Delete**.

:::image type="content" source="media/python-3-packages/python-3-packages-list.png" alt-text="Screenshot shows the Python 3.8.x packages page after a package has been imported.":::

### Import a package with dependencies

You can import a Python 3 package and its dependencies by importing the following Python script into a Python 3 runbook, and then running it.

```cmd
https://github.com/azureautomation/runbooks/blob/master/Utility/Python/import_py3package_from_pypi.py
```

#### Importing the script into a runbook
For information on importing the runbook, see [Import a runbook from the Azure portal](manage-runbooks.md#import-a-runbook-from-the-azure-portal). Copy the file from GitHub to storage that the portal can access before you run the import.

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
import os  
import azure.mgmt.resource  
import automationassets  

def get_automation_runas_credential(runas_connection):  
    from OpenSSL import crypto  
    import binascii  
    from msrestazure import azure_active_directory  
    import adal 

    # Get the Azure Automation RunAs service principal certificate  
    cert = automationassets.get_automation_certificate("AzureRunAsCertificate")  
    pks12_cert = crypto.load_pkcs12(cert)  
    pem_pkey = crypto.dump_privatekey(crypto.FILETYPE_PEM,pks12_cert.get_privatekey())  

    # Get run as connection information for the Azure Automation service principal 
    application_id = runas_connection["ApplicationId"]  
    thumbprint = runas_connection["CertificateThumbprint"]  
    tenant_id = runas_connection["TenantId"]  

    # Authenticate with service principal certificate  
    resource ="https://management.core.windows.net/"  
    authority_url = ("https://login.microsoftonline.com/"+tenant_id)  
    context = adal.AuthenticationContext(authority_url)  
    return azure_active_directory.AdalAuthentication(  
    lambda: context.acquire_token_with_client_certificate(  
            resource,  
            application_id,  
            pem_pkey,  
            thumbprint) 
    ) 

# Authenticate to Azure using the Azure Automation RunAs service principal  
runas_connection = automationassets.get_automation_connection("AzureRunAsConnection")  
azure_credential = get_automation_runas_credential(runas_connection)  

# Intialize the resource management client with the RunAs credential and subscription  
resource_client = azure.mgmt.resource.ResourceManagementClient(  
    azure_credential,  
    str(runas_connection["SubscriptionId"]))  

# Get list of resource groups and print them out  
groups = resource_client.resource_groups.list()  
for group in groups:  
    print(group.name) 
```

> [!NOTE]
> The Python `automationassets` package is not available on pypi.org, so it's not available for import onto a Windows machine.

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

## Next steps

To prepare a Python runbook, see [Create a Python runbook](learn/automation-tutorial-runbook-textual-python-3.md).
