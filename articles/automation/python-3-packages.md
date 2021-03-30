---
title: Manage Python 3 packages in Azure Automation
description: This article tells how to manage Python 3 packages (preview) in Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 02/19/2021
ms.topic: conceptual
---

# Manage Python 3 packages (preview) in Azure Automation

Azure Automation allows you to run Python 3 runbooks (preview) on Azure and on Linux Hybrid Runbook Workers. To help in simplification of runbooks, you can use Python packages to import the modules that you need. To import a single package, see [Import a package](#import-a-package). To import a package with multiple packages, see [Import a package with dependencies](#import-a-package-with-dependencies). This article describes how to manage and use Python 3 packages (preview) in Azure Automation.

## Import a package

In your Automation account, select **Python packages** under **Shared Resources**. select **+ Add a Python package**.

:::image type="content" source="media/python-3-packages/add-python-3-package.png" alt-text="Screenshot of the Python 3 packages page shows Python 3 packages in the left menu and Add a Python 2 package highlighted.":::

On the **Add Python Package** page, select **Python 3** for the **Version**, and select a local package to upload. The package can be a **.whl** or **.tar.gz** file. When the package is selected, select **OK** to upload it.

:::image type="content" source="media/python-3-packages/upload-package.png" alt-text="Screenshot shows the Add Python 3 Package page with an uploaded tar.gz file selected.":::

Once a package has been imported, it's listed on the Python packages page in your Automation account, under the **Python 3 packages (preview)** tab. If you need to remove a package, select the package and click **Delete**.

:::image type="content" source="media/python-3-packages/python-3-packages-list.png" alt-text="Screenshot shows the Python 3 packages page after a package has been imported.":::

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

## Next steps

To prepare a Python runbook, see [Create a Python runbook](learn/automation-tutorial-runbook-textual-python-3.md).
