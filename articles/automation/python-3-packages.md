---
title: Manage Python 3 packages in Azure Automation
description: This article tells how to manage Python 3 packages  in Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 10/16/2023
ms.topic: conceptual
ms.custom: has-adal-ref, references_regions, devx-track-azurepowershell, devx-track-python
---

# Manage Python 3 packages in Azure Automation

This article describes how to import, manage, and use Python 3 packages in Azure Automation running on the Azure sandbox environment and Hybrid Runbook Workers. Python packages should be downloaded on Hybrid Runbook workers for successful job execution. To help simplify runbooks, you can use Python packages to import the modules you need.

For information on managing Python 2 packages, see [Manage Python 2 packages](./python-packages.md).

## Default Python packages

To support Python 3.8 runbooks in the Automation service, some Python packages are installed by default and a [list of these packages are here](default-python-packages.md). The default version can be overridden by importing Python packages into your Automation account. 

Preference is given to the imported version in your Automation account. To import a single package, see [Import a package](#import-a-package). To import a package with multiple packages, see [Import a package with dependencies](#import-a-package-with-dependencies). 

> [!NOTE]
> There are no default packages installed for Python 3.10 (preview). 

## Packages as source files

Azure Automation supports only a Python package that only contains Python code and doesn't include other language extensions or code in other languages. However, the Azure Sandbox environment might not have the required compilers for C/C++ binaries, so it's recommended to use [wheel files](https://pythonwheels.com/) instead. 

> [!NOTE]
> Currently, Python 3.10 (preview) only supports wheel files.

The [Python Package Index](https://pypi.org/) (PyPI) is a repository of software for the Python programming language. When selecting a Python 3 package to import into your Automation account from PyPI, note the following filename parts:

Select a Python version:

#### [Python 3.8(GA)](#tab/py3)

| Filename part | Description |
|---|---|
|cp38|Automation supports **Python 3.8** for Cloud jobs.|
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

1. On the **Add Python Package** page, select a local package to upload. The package can be **.whl** or **.tar.gz** file for Python 3.8 and **.whl** file for Python 3.10 (preview). 
1. Enter a name and select the **Runtime Version** as Python 3.8 or Python 3.10 (preview).
   > [!NOTE]
   > Currently, Python 3.10 (preview) runtime version is supported for both Cloud and Hybrid jobs in all Public regions except Australia Central2, Korea South, Sweden South, Jio India Central, Brazil Southeast, Central India, West India, UAE Central, and Gov clouds.               
1. Select **Import**.

   :::image type="content" source="media/python-3-packages/upload-package.png" alt-text="Screenshot shows the Add Python 3.8 Package page with an uploaded tar.gz file selected.":::

After a package has been imported, it's listed on the Python packages page in your Automation account. To remove a package, select the package and select **Delete**.

:::image type="content" source="media/python-3-packages/python-3-packages-list.png" alt-text="Screenshot shows the Python 3.8 packages page after a package has been imported.":::

### Import a package with dependencies


You can import a Python 3.8 package and its dependencies by importing the following Python script into a Python 3.8 runbook. Ensure that Managed identity is enabled for your Automation account and has Automation Contributor access for successful import of package.

#### [System assigned managed identity](#tab/sa-mi)

```cmd
https://github.com/azureautomation/runbooks/blob/master/Utility/Python/import_py3package_from_pypi.py
```

#### [User assigned managed identity](#tab/ua-mi)
```cmd
import requests
import sys
import pip
import os
import re
import shutil
import json
import time
import getopt

#region Constants
PYPI_ENDPOINT = "https://pypi.org/simple"
FILENAME_PATTERN = "[\\w]+"
#endregion

def get_automation_usi_token():
    """ Returns a token that can be used to authenticate against Azure resources """
    import json

    # printing environment variables 
    resource = "?resource=https://management.azure.com/" 
    client_id = "&client_id="+client_id_usi 
    endPoint = os.getenv('IDENTITY_ENDPOINT')+ resource +client_id 
    identityHeader = os.getenv('IDENTITY_HEADER') 
    payload={}
    headers = {
      'X-IDENTITY-HEADER': identityHeader,
      'Metadata': 'True' 
    }
    response = requests.request("GET", endPoint, headers=headers, data=payload) 

    # Return the token
    return json.loads(response.text)['access_token']

def get_packagename_from_filename(packagefilename):
    match = re.match(FILENAME_PATTERN, packagefilename)
    return match.group(0)

def resolve_download_url(packagename, packagefilename):
    response = requests.get("%s/%s" % (PYPI_ENDPOINT, packagename))
    urls = re.findall(r'href=[\'"]?([^\'" >]+)', str(response.content))   
    for url in urls:
        if packagefilename in url:
            print ("Detected download uri %s for %s" % (url, packagename))
            return(url)

def send_webservice_import_module_request(packagename, download_uri_for_file):
    request_url = "https://management.azure.com/subscriptions/%s/resourceGroups/%s/providers/Microsoft.Automation/automationAccounts/%s/python3Packages/%s?api-version=2018-06-30" \
                  % (subscription_id, resource_group, automation_account, packagename)

    requestbody = { 'properties': { 'description': 'uploaded via automation', 'contentLink': {'uri': "%s" % download_uri_for_file} } }
    headers = {'Content-Type' : 'application/json', 'Authorization' : "Bearer %s" % token}
    r = requests.put(request_url, data=json.dumps(requestbody), headers=headers)
    print ("Request status for package %s was %s" % (packagename, str(r.status_code)))
    if str(r.status_code) not in ["200", "201"]:
        raise Exception("Error importing package {0} into Automation account. Error code is {1}".format(packagename, str(r.status_code)))

def make_temp_dir():
    destdir = os.path._getfullpathname("tempDownloadDir")
    if os.path.exists(destdir):
        shutil.rmtree(destdir)
    os.makedirs(destdir, 0o755)
    return destdir

def import_package_with_dependencies (packagename):
    # download package with all depeendencies
    download_dir = make_temp_dir()
    pip.main(['download', '-d', download_dir, packagename])
    for file in os.listdir(download_dir):
        pkgname = get_packagename_from_filename(file)
        download_uri_for_file = resolve_download_url(pkgname, file)
        send_webservice_import_module_request(pkgname, download_uri_for_file)
        # Sleep a few seconds so we don't send too many import requests https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits#automation-limits
        time.sleep(10)

if __name__ == '__main__':
    if len(sys.argv) < 11:
        raise Exception("Requires Subscription id -s, Automation resource group name -g, account name -a, module name -g and user-assigned managed identity client id -c as arguments. \
                        Example: -s xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx -g contosogroup -a contosoaccount -m pytz -c clientid")

    # Process any arguments sent in
    subscription_id = None
    resource_group = None
    automation_account = None
    module_name = None
    client_id_usi = None

    opts, args = getopt.getopt(sys.argv[1:], "s:g:a:m:c")
    for o, i in opts:
        if o == '-s':  
            subscription_id = i
        elif o == '-g':  
            resource_group = i
        elif o == '-a': 
            automation_account = i
        elif o == '-m': 
            module_name = i
        elif o == '-c': 
            client_id_usi = i

    # Set Run as token for this automation accounts service principal to be used to import the package into Automation account
    token = get_automation_usi_token()

    # Import package with dependencies from pypi.org
    import_package_with_dependencies(module_name)
    print ("\nCheck the python 3 packages page for import status...")
```
---

#### Importing the script into a runbook
For information on importing the runbook, see [Import a runbook from the Azure portal](manage-runbooks.md#import-a-runbook-from-the-azure-portal). Copy the file from GitHub to storage that the portal can access before you run the import.

> [!NOTE]
> Currently, importing a runbook from Azure Portal isn't supported for Python 3.10 (preview).


The **Import a runbook** page defaults the runbook name to match the name of the script. If you have access to the field, you can change the name. **Runbook type** may default to **Python 2.7**. If it does, make sure to change it to **Python 3.8**.

:::image type="content" source="media/python-3-packages/import-python-3-package.png" alt-text="Screenshot shows the Python 3 runbook import page.":::

#### Executing the runbook to import the package and dependencies

After creating and publishing the runbook, run it to import the package. See [Start a runbook in Azure Automation](start-runbooks.md) for details on executing the runbook.

The script (`import_py3package_from_pypi.py`) requires the following parameters.

| Parameter | Description |
|---------------|-----------------|
| subscription_id | Subscription ID of the Automation account |
| resource_group | Name of the resource group that the Automation account is defined in |
| automation_account | Automation account name |
| module_name | Name of the module to import from `pypi.org` |
| module_version | Version of the module |

Parameter value should be provided as a single string in the below format:

-s <subscription_id> -g <resource_group> -a<automation_account> -m <module_name> -v <module_version>

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

### Python 3.8 PowerShell cmdlets

#### Add new Python 3.8 package

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

#### List all Python 3.8 packages

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

#### Remove Python 3.8 package

```python
Remove-AzAutomationPython3Package -AutomationAccountName tarademo  -ResourceGroupName mahja -Name sockets 
```

#### Update Python 3.8 package

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
