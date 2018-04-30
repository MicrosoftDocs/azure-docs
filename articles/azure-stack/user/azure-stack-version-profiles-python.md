---
title: Using API version profiles with Python in Azure Stack | Microsoft Docs
description: Learn about using API version profiles with Python in Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/30/2018
ms.author: mabrigg
ms.reviewer: sijuman
<!-- dev: viananth -->
---

# Use API version profiles with Python in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

## Python samples for Azure Stack 

You can use the following code samples to perform common management tasks
for virtual machines in your Azure Stack.

The code samples show you to:

- Create virtual machines:
    - Create a Linux virtual machine
    - Create a Windows virtual machine
- Update a virtual machine:
	- Expand a drive
	- Tag a virtual machine
	- Attach data disks
	- Detach data disks
- Operate a virtual machine:
    - Start a virtual machine
    - Stop a virtual machine
    - Restart a virtual machine
- List virtual machines
- Delete a virtual machine

To review the code to perform these operations, check out the **run_example()** function in the Python script **Hybrid/unmanaged-disks/example.py** in the GitHub Repo [virtual-machines-python-manage](https://github.com/viananth/virtual-machines-python-manage/tree/8643ed4bec62aae6fdb81518f68d835452872f88).

Each operation is clearly labeled with a comment and a print function.
The examples are not necessarily in the order shown in the above list.


## Run the Python sample

1.  If you don't already have it, [install Python](https://www.python.org/downloads/).

    This sample (and the SDK) is compatible with Python 2.7, 3.4, 3.5 and 3.6.

2.  General recommendation for Python development is to use a Virtual Environment. 
    For more information, see https://docs.python.org/3/tutorial/venv.html
    
    Install and initialize the virtual environment with the "venv" module on Python 3 (you must install [virtualenv](https://pypi.python.org/pypi/virtualenv) for Python 2.7):

    ````bash
    python -m venv mytestenv # Might be "python3" or "py -3.6" depending on your Python installation
    cd mytestenv
    source bin/activate      # Linux shell (Bash, ZSH, etc.) only
    ./scripts/activate       # PowerShell only
    ./scripts/activate.bat   # Windows CMD only
    ````

3.  Clone the repository.

    ````bash
    git clone https://github.com/Azure-Samples/virtual-machines-python-manage.git
    ````

4.  Install the dependencies using pip.

    ````bash
    cd virtual-machines-python-manage\Hybrid
    pip install -r requirements.txt
    ````

5.  Create a [service principal](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-create-service-principals) to work with Azure Stack. Make sure your service principal has [contributor/owner role](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-create-service-principals#assign-role-to-service-principal) on your subscription.

6.  Set the following variables and export these environment variables into your current shell. 

`Note: provide an explanation of where these variables come from?`

    ````bash
    export AZURE_TENANT_ID={your tenant id}
    export AZURE_CLIENT_ID={your client id}
    export AZURE_CLIENT_SECRET={your client secret}
    export AZURE_SUBSCRIPTION_ID={your subscription id}
    export ARM_ENDPOINT={your AzureStack Resource Manager Endpoint}
    ```

7.  Note that in order to run this sample, Ubuntu 16.04-LTS and WindowsServer 2012-R2-Datacenter images must be present in Azure Stack market place. These can be either [downloaded from Azure](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-download-azure-marketplace-item) or [added to Platform Image Repository](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-add-vm-image).


8. Run the sample.

    ```
    python unmanaged-disks\example.py
    ```

## Notes

You may be tempted to try to retrieve a VM's OS disk by using
`virtual_machine.storage_profile.os_disk`.
In some cases, this may do what you want,
but be aware that it gives you an `OSDisk` object.
In order to update the OS Disk's size, as `example.py` does,
you need not an `OSDisk` object but a `Disk` object.
`example.py` gets the `Disk` object with the following:

```python
os_disk_name = virtual_machine.storage_profile.os_disk.name
os_disk = compute_client.disks.get(GROUP_NAME, os_disk_name)
```

## Next steps

- [Azure Python Development Center](https://azure.microsoft.com/develop/python/)
- [Azure Virtual Machines documentation](https://azure.microsoft.com/services/virtual-machines/)
- [Learning Path for Virtual Machines](https://azure.microsoft.com/documentation/learning-paths/virtual-machines/)
- If you don't have a Microsoft Azure subscription you can get a FREE trial account [here](http://go.microsoft.com/fwlink/?LinkId=330212).
