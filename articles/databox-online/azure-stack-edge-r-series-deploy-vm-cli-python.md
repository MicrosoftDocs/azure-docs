---
title: Deploy VMs on your Azure Stack Edge device via Azure CLI and Python
description: Describes how to create and manage virtual machines (VMs) on a Azure Stack Edge device using Azure CLI and Python.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: overview
ms.date: 12/04/2019
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to create and manage virtual machines (VMs) on my Azure Stack Edge device using APIs so that I can efficiently manage my VMs.
---

# Deploy VMs on your Azure Stack Edge device via Azure CLI and Python

[!INCLUDE [azure-stack-edge-gateway-deploy-vm-overview](../../includes/azure-stack-edge-gateway-deploy-vm-overview.md)]

This tutorial describes how to create and manage a VM on your Azure Stack Edge device using Azure Command Line Interface (CLI) and Python.

## VM deployment workflow

<!--insert a diagram here for steps in VM deployment-->

## Prerequisites

[!INCLUDE [azure-stack-edge-gateway-deploy-vm-prerequisites](../../includes/azure-stack-edge-gateway-deploy-vm-prerequisites.md)]

## Step 1: Set up Azure CLI/Python on the client

### Verify profile and install Azure CLI

1. Verify the API profile of the client and identify which version of the modules and libraries to include on your client. In this example, the client system will be running Azure Stack 1904 or later. For more information, see [Azure Resource Manager API profiles](https://docs.microsoft.com/azure-stack/user/azure-stack-version-profiles?view=azs-1908#azure-resource-manager-api-profiles).

2. Install Azure CLI on your client. In this example, Azure CLI 2.0.76 was installed.

    Verify the version of Azure CLI by running the `az --version` command. A sample output is shown below.

    ```powershell
    Windows PowerShell
    Copyright (C) Microsoft Corporation. All rights reserved.
    Try the new cross-platform PowerShell https://aka.ms/pscore6
    
    PS C:\windows\system32> az --version
    azure-cli                         2.0.76
    command-modules-nspkg              2.0.3
    core                              2.0.76
    nspkg                              3.0.4
    telemetry                          1.0.4
    Extensions:
    azure-cli-iot-ext                  0.7.1
    
    Python location 'C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\python.exe'
    Extensions directory 'C:\Users\alkohli\.azure\cliextensions'
    Python (Windows) 3.6.6 (v3.6.6:4cf1f54eb7, Jun 27 2018, 02:47:15) [MSC v.1900 32 bit (Intel)]
    Legal docs and information: aka.ms/AzureCliLegal
    Your CLI is up-to-date.
    PS C:\windows\system32>
    ```

    If you do not have Azure CLI, download and [Install Azure CLI on Windows](https://docs.microsoft.com/cli/azure/install-azure-cli-windows?view=azure-cli-latest). You can run Azure CLI via Windows command prompt or via the PowerShell.

4. Make a note of the CLI's Python location -- to figure out the location of trusted root certificate store for Azure CLI.

### Trust the Azure Stack Edge CA root certificate

1. Find the certificate location on your machine. The location may vary depending on where you\'ve installed Python. Open a cmd prompt or an elevated PowerShell prompt, and type the following command:

    ```
    python -c "import certifi; print(certifi.where())"
    ```
    
    Make a note of the certificate location. For example, \~/lib/python3.5/site-packages/certifi/cacert.pem. Your particular path depends on your OS and the version of Python that you\'ve installed.

2. Trust the Azure Stack Edge CA root certificate by appending it to the existing Python certificate.

    ```
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
    Add-Content "${env:ProgramFiles(x86)}\Microsoft SDKs\Azure\CLI2\Lib\site-packages\certifi\cacert.pem" $rootCertEntry
    
    Write-Host "Python Cert store was updated to allow the Azure Stack Edge CA root certificate"
    ```
    
### Connect to Azure Stack Edge

1. Register your Azure Stack Edge environment by running the az cloud register command.

    In some scenarios, direct outbound internet connectivity is routed through a proxy or firewall, which enforces SSL interception. In these cases, the az cloud register command can fail with an error such as \"Unable to get endpoints from the cloud.\" To work around this error, set the following environment variables:

    ```
    set AZURE_CLI_DISABLE_CONNECTION_VERIFICATION=1 
    set ADAL_PYTHON_SSL_NO_VERIFY=1
    ```

2. Register your environment. Use the following parameters when running az cloud register:

    | Value | Description | Example |
    | --- | --- | --- |
    | Environment name | The name of t | The name of the environment you are trying to connect to |
    | Resource Manager endpoint | [https://management.local.azurestack.external](https://management.local.azurestack.external/) | This URL is https://management.<appliancename><dnsdomain> |
    
    ```azurecli
    az cloud register -n <environmentname> --endpoint-resource-manager "https://management.<appliance name>.<DNS domain>"
    ```
    
3. Set the active environment by using the following commands.

    ```azurecli
    az cloud set -n <EnvironmentName>
    ```
    
4. Change the profile to version 2019-03-01-hybrid. Run the following command:

    ```azurecli
    az cloud update --profile 2019-03-01-hybrid
    ```
    
    Sign in to your Azure Stack Edge environment by using the az login command. You can sign in to the Azure Stack Edge environment either as a user or as a [service principal](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals).

    Sign in as a *user*:

    You can either specify the username and password directly within the az login command, or authenticate by using a browser. You must do the latter if your account has multi-factor authentication enabled:

    ```azurecli
    az cloud register  -n <environmentname>   --endpoint-resource-manager "https://management.local.azurestack.external"  --suffix-storage-endpoint "local.azurestack.external" --suffix-keyvault-dns ".vault.local.azurestack.external" --endpoint-vm-image-alias-doc <URI of the document which contains VM image aliases>   --profile "2019-03-01-hybrid"
    ```
    
    > [!NOTE]
    > If your user account has multi-factor authentication enabled, use the az login command without providing the -u parameter. Running this command gives you a URL and a code that you must use to authenticate.
    
    Sign in as a *service principal*:

    Prepare the .pem file to be used for service principal login.

    On the client machine where the principal was created, export the service principal certificate as a pfx with the private key located at cert:\\CurrentUser\\My. The cert name has the same name as the principal.

    Convert the pfx to pem (use the OpenSSL utility).

    Sign in to the CLI:

    ```azurecli
    az login --service-principal \
    -u <Client ID from the Service Principal details> \
    -p <Certificate's fully qualified name, such as, C:\certs\spn.pem>
    --tenant <Tenant ID> \
    --debug 
    ```
    
## Step 2: Create a VM 

A Python script is provided to you to create a VM. The directions to use the script are also provided with the script.

## Next steps

[Az CLI commands in Azure Resource Manager mode](https://docs.microsoft.com/azure/virtual-machines/azure-cli-arm-commands)