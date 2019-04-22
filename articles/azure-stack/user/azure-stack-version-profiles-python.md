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
ms.date: 01/05/2019
ms.author: sethm
ms.reviewer: sijuman
ms.lastreviewed: 01/05/2019
<!-- dev: viananth -->
---

# Use API version profiles with Python in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

## Python and API version profiles

The Python SDK supports API version profiles to target different cloud platforms such as Azure Stack and global Azure. You can use API profiles in creating solutions for a hybrid cloud. The Python SDK supports the following API profiles:

- **latest**  
    This profile targets the most recent API versions for all service providers in the Azure Platform.
- **2018-03-01-hybrid**     
    This profile targets the latest API versions for all the resource providers in Azure Stack platform.
- **2017-03-09-profile**  
    This profile targets the most compatible API versions of the resource providers supported by Azure Stack.

   For more information about API profiles and Azure Stack, see [Manage API version profiles in Azure Stack](azure-stack-version-profiles.md).

## Install the Azure Python SDK

1. Install Git from [the official site](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
2. For instructions on how install the Python SDK, see [Azure for Python developers](/python/azure/python-sdk-azure-install?view=azure-python).
3. If not available, create a subscription and save the subscription ID to use later. For instructions on creating a subscription, see [Create subscriptions to offers in Azure Stack](../azure-stack-subscribe-plan-provision-vm.md).
4. Create a service principal and save its ID and secret. For instructions on how to create a service principal for Azure Stack, see [Provide applications access to Azure Stack](../azure-stack-create-service-principals.md).
5. Make sure your service principal has the contributor/owner role on your subscription. For instructions on how to assign role to service principal, see [Provide applications access to Azure Stack](../azure-stack-create-service-principals.md).

## Prerequisites

In order to use the Python Azure SDK with Azure Stack, you must supply the following values, and then set values with environment variables. See the instructions after the table for your operating system on setting the environment variables.

| Value | Environment variables | Description |
|---------------------------|-----------------------|-------------------------------------------------------------------------------------------------------------------------|
| Tenant ID | AZURE_TENANT_ID | The value of your Azure Stack [tenant ID](../azure-stack-identity-overview.md). |
| Client ID | AZURE_CLIENT_ID | The service principal application ID saved when service principal was created in the previous section of this article. |
| Subscription ID | AZURE_SUBSCRIPTION_ID | The [subscription ID](../azure-stack-plan-offer-quota-overview.md#subscriptions) is how you access offers in Azure Stack. |
| Client Secret | AZURE_CLIENT_SECRET | The service principal application secret saved when the service principal was created. |
| Resource Manager Endpoint | ARM_ENDPOINT | See the [Azure Stack Resource Manager endpoint](azure-stack-version-profiles-ruby.md#the-azure-stack-resource-manager-endpoint). |
| Resource Location | AZURE_RESOURCE_LOCATION | The resource location of your Azure Stack Environment.

### Trust the Azure Stack CA root certificate

If you are using the ASDK, you will need to trust the CA root certificate on your remote machine. You will not need to do this with the integrated systems.

#### Windows

1. Find the python certificate store location on your machine. The location may vary depending on where you have installed Python. Open a cmd prompt or an elevated PowerShell prompt, and type the following command:

    ```PowerShell  
      python -c "import certifi; print(certifi.where())"
    ```

    Make a note of the certificate store location. For example, *~/lib/python3.5/site-packages/certifi/cacert.pem*. Your particular path will depend on your OS and the version of Python that you have installed.

2. Trust the Azure Stack CA root certificate by appending it to the existing Python certificate.

    ```powershell
    $pemFile = "<Fully qualified path to the PEM certificate Ex: C:\Users\user1\Downloads\root.pem>"

    $root = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
    $root.Import($pemFile)

    Write-Host "Extracting required information from the cert file"
    $md5Hash    = (Get-FileHash -Path $pemFile -Algorithm MD5).Hash.ToLower()
    $sha1Hash   = (Get-FileHash -Path $pemFile -Algorithm SHA1).Hash.ToLower()
    $sha256Hash = (Get-FileHash -Path $pemFile -Algorithm SHA256).Hash.ToLower()

    $issuerEntry  = [string]::Format("# Issuer: {0}", $root.Issuer)
    $subjectEntry = [string]::Format("# Subject: {0}", $root.Subject)
    $labelEntry   = [string]::Format("# Label: {0}", $root.Subject.Split('=')[-1])
    $serialEntry  = [string]::Format("# Serial: {0}", $root.GetSerialNumberString().ToLower())
    $md5Entry     = [string]::Format("# MD5 Fingerprint: {0}", $md5Hash)
    $sha1Entry    = [string]::Format("# SHA1 Fingerprint: {0}", $sha1Hash)
    $sha256Entry  = [string]::Format("# SHA256 Fingerprint: {0}", $sha256Hash)
    $certText = (Get-Content -Path $pemFile -Raw).ToString().Replace("`r`n","`n")

    $rootCertEntry = "`n" + $issuerEntry + "`n" + $subjectEntry + "`n" + $labelEntry + "`n" + `
    $serialEntry + "`n" + $md5Entry + "`n" + $sha1Entry + "`n" + $sha256Entry + "`n" + $certText

    Write-Host "Adding the certificate content to Python Cert store"
    Add-Content "${env:ProgramFiles(x86)}\Python35\Lib\site-packages\certifi\cacert.pem" $rootCertEntry

    Write-Host "Python Cert store was updated to allow the Azure Stack CA root certificate"

    ```

> [!NOTE]  
> If you are using virtualenv for developing with Python SDK as mentioned below, you will need to add the above cert to your virtual environment's cert store as well. The path might look similar to: "..\mytestenv\Lib\site-packages\certifi\cacert.pem"



## Python samples for Azure Stack

Some of the code samples available for Azure Stack using Python SDK are:

- [Manage Resources and Resource Groups](https://azure.microsoft.com/resources/samples/hybrid-resourcemanager-python-manage-resources/).
- [Manage Storage Account](https://azure.microsoft.com/resources/samples/hybrid-storage-python-manage-storage-account/).
- [Manage Virtual Machines](https://azure.microsoft.com/resources/samples/hybrid-compute-python-manage-vm/).

## Python manage virtual machine sample

You can use the following code sample to perform common management tasks for virtual machines in your Azure Stack. The code sample shows you to:

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

To review the code that performs these operations, see the **run_example()** function in the Python script **example.py** in the GitHub repo [Hybrid-Compute-Python-Manage-VM](https://github.com/Azure-Samples/Hybrid-Compute-Python-Manage-VM).

Each operation is clearly labeled with a comment and a print function. The examples are not necessarily in the order shown in this list.

## Run the Python sample

1. If you have not already, [install Python](https://www.python.org/downloads/). This sample (and the SDK) is compatible with Python 2.7, 3.4, 3.5 and 3.6.

2. General recommendation for Python development is to use a Virtual Environment. For more information, see the [Python documentation](https://docs.python.org/3/tutorial/venv.html).

3. Install and initialize the virtual environment with the "venv" module on Python 3 (you must install [virtualenv](https://pypi.python.org/pypi/virtualenv) for Python 2.7):

    ```bash
    python -m venv mytestenv # Might be "python3" or "py -3.6" depending on your Python installation
    cd mytestenv
    source bin/activate      # Linux shell (Bash, ZSH, etc.) only
    ./scripts/activate       # PowerShell only
    ./scripts/activate.bat   # Windows CMD only
    ```

4. Clone the repository:

    ```bash
    git clone https://github.com/Azure-Samples/Hybrid-Compute-Python-Manage-VM.git
    ```

5. Install the dependencies using pip:

    ```bash
    cd Hybrid-Compute-Python-Manage-VM
    pip install -r requirements.txt
    ```

6. Create a [service principal](../azure-stack-create-service-principals.md) to work with Azure Stack. Make sure your service principal has [contributor/owner role](../azure-stack-create-service-principals.md#assign-a-role) on your subscription.

7. Set the following variables and export these environment variables into your current shell:

    ```bash
    export AZURE_TENANT_ID={your tenant id}
    export AZURE_CLIENT_ID={your client id}
    export AZURE_CLIENT_SECRET={your client secret}
    export AZURE_SUBSCRIPTION_ID={your subscription id}
    export ARM_ENDPOINT={your AzureStack Resource Manager Endpoint}
    export AZURE_RESOURCE_LOCATION={your AzureStack Resource location}
    ```

8. In order to run this sample, Ubuntu 16.04-LTS and WindowsServer 2012-R2-DataCenter images must be present in the Azure Stack marketplace. These can be either [downloaded from Azure](../azure-stack-download-azure-marketplace-item.md), or added to the [Platform Image Repository](../azure-stack-add-vm-image.md).

9. Run the sample:

    ```python
    python example.py
    ```


## Next steps

- [Azure Python Development Center](https://azure.microsoft.com/develop/python/)
- [Azure Virtual Machines documentation](https://azure.microsoft.com/services/virtual-machines/)
- [Learning Path for Virtual Machines](/learn/paths/deploy-a-website-with-azure-virtual-machines/)
- If you don't have a Microsoft Azure subscription, you can get a FREE trial account [here](https://go.microsoft.com/fwlink/?LinkId=330212).
