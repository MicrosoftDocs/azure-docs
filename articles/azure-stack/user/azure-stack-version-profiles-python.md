---
title: Using API version profiles with Python in Azure Stack | Microsoft Docs
description: Learn about using API version profiles with Python in Azure Stack.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/15/2018
ms.author: sethm
ms.reviewer: sijuman
<!-- dev: viananth -->
---

# Use API version profiles with Python in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

## Python and API version profiles

The Python SDK supports API version profiles to target different cloud platforms such as Azure Stack and global Azure. You can use API profiles in creating solutions for a hybrid cloud. The Python SDK supports the following API profiles:

1. **latest**  
    The profile targets the most recent API versions for all service providers in the Azure Platform.
2.	**2017-03-09-profile**  
    **2017-03-09-profile**  
    The profile targets the API versions of the resource providers supported by Azure Stack.

    For more information about API profiles and Azure Stack, see [Manage API version profiles in Azure Stack](azure-stack-version-profiles.md).

## Install Azure Python SDK

1.	Install Git from [the official site](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
2.	For Instructions to install the Python SDK, see [Azure for Python developers](https://docs.microsoft.com/python/azure/python-sdk-azure-install?view=azure-python).
3.	If not available, create a subscription and save the Subscription ID to be used later. For Instructions to create a subscription, see [Create subscriptions to offers in Azure Stack](../azure-stack-subscribe-plan-provision-vm.md). 
4.	Create a service principal and save its ID and secret. For instructions to create a service principal for Azure Stack, see [Provide applications access to Azure Stack](../azure-stack-create-service-principals.md). 
5.	Make sure your service principal has contributor/owner role on your subscription. For instructions on how to assign role to service principal, see [Provide applications access to Azure Stack](../azure-stack-create-service-principals.md).

## Prerequisites

In order to use Python Azure SDK with Azure Stack, you must supply the following values, and then set values with environment variables. See the instructions after the table for your operating system on setting the environmental variables. 

| Value | Environment variables | Description |
|---------------------------|-----------------------|-------------------------------------------------------------------------------------------------------------------------|
| Tenant ID | AZURE_TENANT_ID | The value of your Azure Stack [tenant ID](../azure-stack-identity-overview.md). |
| Client ID | AZURE_CLIENT_ID | The service principal application ID saved when service principal was created on the previous section of this document. |
| Subscription ID | AZURE_SUBSCRIPTION_ID | The [subscription ID](../azure-stack-plan-offer-quota-overview.md#subscriptions) is how you access offers in Azure Stack. |
| Client Secret | AZURE_CLIENT_SECRET | The service principal application Secret saved when service principal was created. |
| Resource Manager Endpoint | ARM_ENDPOINT | See [the Azure Stack resource manager endpoint](azure-stack-version-profiles-ruby.md#the-azure-stack-resource-manager-endpoint). |


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

5.  Create a [service principal](https://docs.microsoft.com/azure/azure-stack/azure-stack-create-service-principals) to work with Azure Stack. Make sure your service principal has [contributor/owner role](https://docs.microsoft.com/azure/azure-stack/azure-stack-create-service-principals#assign-role-to-service-principal) on your subscription.

6.  Set the following variables and export these environment variables into your current shell. 

    ```bash
    export AZURE_TENANT_ID={your tenant id}
    export AZURE_CLIENT_ID={your client id}
    export AZURE_CLIENT_SECRET={your client secret}
    export AZURE_SUBSCRIPTION_ID={your subscription id}
    export ARM_ENDPOINT={your AzureStack Resource Manager Endpoint}
    ```

7.  In order to run this sample, Ubuntu 16.04-LTS and WindowsServer 2012-R2-Datacenter images must be present in Azure Stack marketplace. These can be either [downloaded from Azure](https://docs.microsoft.com/azure/azure-stack/azure-stack-download-azure-marketplace-item) or [added to Platform Image Repository](https://docs.microsoft.com/azure/azure-stack/azure-stack-add-vm-image).

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
- If you don't have a Microsoft Azure subscription, you can get a FREE trial account [here](http://go.microsoft.com/fwlink/?LinkId=330212).
