---
title: Connect to Azure Stack with CLI | Microsoft Docs
description: Learn how to use the cross-platform command-line interface (CLI) to manage and deploy resources on Azure Stack
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/15/2019
ms.author: sethm
ms.reviewer: sijuman
ms.lastreviewed: 01/24/2019

---
# Use API version profiles with Azure CLI in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can follow the steps in this article to set up the Azure Command-Line Interface (CLI) to manage Azure Stack Development Kit resources from Linux, Mac, and Windows client platforms.

## Prepare for Azure CLI

You will need the CA root certificate for Azure Stack sto use Azure CLI on your development machine. You use the certificate to manage resources through the CLI.

 - **The Azure Stack CA root certificate** is required if you are using the CLI from a workstation outside the Azure Stack Development Kit.  

 - **The virtual machine aliases endpoint** provides an alias, like "UbuntuLTS" or "Win2012Datacenter," that references an image publisher, offer, SKU, and version as a single parameter when deploying VMs.  

The following sections describe how to get these values.

### Export the Azure Stack CA root certificate

If you are using an integrated system, you don't need to export the CA root certificate. You will need to export the CA root certificate on an Azure Stack Development Kit (ASDK).

To export the ASDK root certificate in PEM format, create a Windows VM on Azure Stack, sign in, and run the following script:

```powershell
$label = "AzureStackSelfSignedRootCert"
Write-Host "Getting certificate from the current user trusted store with subject CN=$label"
$root = Get-ChildItem Cert:\CurrentUser\Root | Where-Object Subject -eq "CN=$label" | select -First 1
if (-not $root)
{
    Write-Error "Certificate with subject CN=$label not found"
    return
}

Write-Host "Exporting certificate"
Export-Certificate -Type CERT -FilePath root.cer -Cert $root

Write-Host "Converting certificate to PEM format"
certutil -encode root.cer root.pem
```

### Set up the virtual machine aliases endpoint

Azure Stack operators should set up a publicly accessible endpoint that hosts a virtual machine alias file. The virtual machine alias file is a JSON file that provides a common name for an image. You will use the name when you deploy a VM as an Azure CLI parameter.  

Before you add an entry to an alias file, make sure that you [download images from the Azure Marketplace](azure-stack-download-azure-marketplace-item.md) or have [published your own custom image](azure-stack-add-vm-image.md). If you publish a custom image, make note of the publisher, offer, SKU, and version information that you specified during publishing. If it's an image from the marketplace, you can view the information by using the ```Get-AzureVMImage``` cmdlet.  

A [sample alias file](https://raw.githubusercontent.com/Azure/azure-rest-api-specs/master/arm-compute/quickstart-templates/aliases.json) with many common image aliases is available. You can use that as a starting point. Host this file in a space where your CLI clients can reach it. One way is to host the file in a blob storage account and share the URL with your users:

1. Download the [sample file](https://raw.githubusercontent.com/Azure/azure-rest-api-specs/master/arm-compute/quickstart-templates/aliases.json) from GitHub.
2. Create a storage account in Azure Stack. When that's done, create a blob container. Set the access policy to "public."  
3. Upload the JSON file to the new container. When that's done, you can view the URL of the blob. Select the blob name and then selecting the URL from the blob properties.

### Install CLI

Sign in to your development workstation and install CLI. Azure Stack requires version 2.0 or later of Azure CLI. You can install that version by using the steps described in the [Install the Azure CLI](/cli/azure/install-azure-cli) article. To verify whether the installation was successful, open a terminal or command prompt window, and run the following command:

```azurecli
az --version
```

You should see the version of Azure CLI and other dependent libraries that are installed on your computer.

## Windows (Azure AD)

### Trust the Azure Stack CA root certificate

Trust the Azure Stack CA root certificate by appending it to the existing Python certificate.

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
Add-Content "${env:ProgramFiles(x86)}\Microsoft SDKs\Azure\CLI2\Lib\site-packages\certifi\cacert.pem" $rootCertEntry

Write-Host "Python Cert store was updated to allow the Azure Stack CA root certificate"
```

### Get the virtual machine aliases endpoint

Before you can create virtual machines by using CLI, you must contact the Azure Stack operator and get the virtual machine aliases endpoint URI. For example, Azure uses the following URI: 
`https://raw.githubusercontent.com/Azure/azure-rest-api-specs/master/arm-compute/quickstart-templates/aliases.json`. The cloud administrator should set up a similar endpoint for Azure Stack with the images that are available in the Azure Stack marketplace. You must pass the endpoint URI of the `endpoint-vm-image-alias-doc` parameter to the `az cloud register` command, as shown in the next section. 

### Connect to Azure Stack

1. Register your Azure Stack environment by running the `az cloud register` command. In some scenarios, direct outbound internet connectivity is routed through a proxy or firewall, which enforces SSL interception. In these cases, the `az cloud register` command can fail with an error such as "Unable to get endpoints from the cloud." To work around this error, you can set the following environment variables:

      ```azurecli
      az cloud register -n AzureStackUser --endpoint-resource-manager "https://management.local.azurestack.external" --suffix-storage-endpoint "local.azurestack.external" --suffix-keyvault-dns ".vault.local.azurestack.external" --endpoint-vm-image-alias-doc <URI of the document which contains virtual machine image aliases>
      ```

1. Set the active environment by using the following commands.

      ```azurecli
      az cloud set -n AzureStackUser
      ```

1. Update your environment configuration to use the Azure Stack specific API version profile. To update the configuration, run the following command:

    ```azurecli
    az cloud update --profile 2018-03-01-hybrid
   ```

    >[!NOTE]  
    >If you are running a version of Azure Stack before the 1808 build, you must use the API version profile **2017-03-09-profile** rather than the API version profile **2018-03-01-hybrid**.

1. Sign in to your Azure Stack environment by using the `az login` command. You can sign in to the Azure Stack environment either as a user or as a [service principal](../../active-directory/develop/app-objects-and-service-principals.md). 

    - Sign in as a *user*: 
    
      You can either specify the username and password directly within the `az login` command, or authenticate by using a browser. You must do the latter if your account has multi-factor authentication enabled:

      ```azurecli
      az login -u <Active directory global administrator or user account. For example: username@<aadtenant>.onmicrosoft.com> --tenant <Azure Active Directory Tenant name. For example: myazurestack.onmicrosoft.com>
      ```

      > [!NOTE]
      > If your user account has multi-factor authentication enabled, you can use the `az login` command without providing the `-u` parameter. Running this command gives you a URL and a code that you must use to authenticate.

    - Sign in as a *service principal*: 
      
      Before you sign in, [create a service principal through the Azure portal](azure-stack-create-service-principals.md) or CLI and assign it a role. Now, sign in by using the following command:

      ```azurecli  
      az login --tenant <Azure Active Directory Tenant name. For example: myazurestack.onmicrosoft.com> --service-principal -u <Application Id of the Service Principal> -p <Key generated for the Service Principal>
      ```

### Test the connectivity

With everything set up, use CLI to create resources within Azure Stack. For example, you can create a resource group for an application and add a virtual machine. Use the following command to create a resource group named "MyResourceGroup":

```azurecli
az group create \
  -n MyResourceGroup -l local
```

If the resource group is created successfully, the previous command outputs the following properties of the newly created resource:

![Resource group create output](media/azure-stack-connect-cli/image1.png)

## Windows (AD FS)

### Trust the Azure Stack CA root certificate

### Get the virtual machine aliases endpoint

### Connect to Azure Stack

Register the user in an AD FS environment, use:

```azurecli
az cloud register  -n AzureStack   --endpoint-resource-manager "https://management.local.azurestack.external"  --suffix-storage-endpoint "local.azurestack.external" --suffix-keyvault-dns ".vault.local.azurestack.external" --endpoint-active-directory-resource-id "https://management.adfs.azurestack.local/<tenantID>" --endpoint-active-directory-graph-resource-id "https://graph.local.azurestack.external/" --endpoint-active-directory "https://adfs.local.azurestack.external/adfs/" --endpoint-vm-image-alias-doc <URI of the document which contains virtual machine image aliases>   --profile "2018-03-01-hybrid"
```

Azure AD environments
* Sign in as a *user*: You can either specify the username and password directly within the `az login` command, or authenticate by using a browser. You must do the latter if your account has multi-factor authentication enabled:

```azurecli
az login -u <Active directory global administrator or user account. For example: username@<aadtenant>.onmicrosoft.com> --tenant <Azure Active Directory Tenant name. For example: myazurestack.onmicrosoft.com>
```

* Sign in as a user using a web browser with a device code:  
```azurecli  
az login --use-device-code
```

> [!NOTE]  
>Running the command gives you a URL and a code that you must use to authenticate.

 Sign in as a *service principal*:

* Sign in as a service principal:
        
1. Prepare the .pem file to be used for service principal login.

* On the client machine where the principal was created, export the service principal certificate as a pfx with the private key located at `cert:\CurrentUser\My`; the cert name has the same name as the principal.

* Convert the pfx to pem (use the OpenSSL utility).

2.  Sign in to the CLI:
  ```azurecli  
  az login --service-principal \
    -u <Client ID from the Service Principal details> \
    -p <Certificate's fully qualified name, such as, C:\certs\spn.pem>
    --tenant <Tenant ID> \
    --debug 
  ```

## Linux (Azure AD)

### Trust the Azure Stack CA root certificate

Trust the Azure Stack CA root certificate by appending it to the existing Python certificate.

Find the certificate location on your machine. The location may vary depending on where you have installed Python. You will need to have [pip](https://pip.pypa.io) and the [certifi](https://pypi.org/project/certifi/) module installed. You can use the following Python command from the bash prompt:

    ```bash  
    python -c "import certifi; print(certifi.where())"
    ```

    Make a note of the certificate location; for example, `~/lib/python3.5/site-packages/certifi/cacert.pem`. Your specific path depends on your operating system and the version of Python that you have installed.

#### Set the path for a development machine inside the cloud

If you are running CLI from a Linux machine that is created within the Azure Stack environment, run the following bash command with the path to your certificate.

```bash
sudo cat /var/lib/waagent/Certificates.pem >> ~/<yourpath>/cacert.pem
```

#### Set the path for a development machine outside the cloud

If you are running CLI from a machine outside the Azure Stack environment:  

1. Set up [VPN connectivity to Azure Stack](azure-stack-connect-azure-stack.md).
1. Copy the PEM certificate that you got from the Azure Stack operator, and make a note of the location of the file (PATH_TO_PEM_FILE).
1. Run the commands in the following sections, depending on the operating system on your development workstation.

##### Linux

```bash
sudo cat PATH_TO_PEM_FILE >> ~/<yourpath>/cacert.pem
```

##### macOS

```bash
sudo cat PATH_TO_PEM_FILE >> ~/<yourpath>/cacert.pem
```

### Get the virtual machine aliases endpoint

Before you can create virtual machines by using CLI, you must contact the Azure Stack operator and get the virtual machine aliases endpoint URI. For example, Azure uses the following URI: 
`https://raw.githubusercontent.com/Azure/azure-rest-api-specs/master/arm-compute/quickstart-templates/aliases.json`. The cloud administrator should set up a similar endpoint for Azure Stack with the images that are available in the Azure Stack marketplace. You must pass the endpoint URI of the `endpoint-vm-image-alias-doc` parameter to the `az cloud register` command, as shown in the next section. 

### Connect to Azure Stack

Use the following steps to connect to Azure Stack:

1. Register your Azure Stack environment by running the `az cloud register` command. In some scenarios, direct outbound internet connectivity is routed through a proxy or firewall, which enforces SSL interception. In these cases, the `az cloud register` command can fail with an error such as "Unable to get endpoints from the cloud." To work around this error, you can set the following environment variables:

   ```shell
   set AZURE_CLI_DISABLE_CONNECTION_VERIFICATION=1 
   set ADAL_PYTHON_SSL_NO_VERIFY=1
   ```

To register the *user* environment, use:

      ```azurecli
      az cloud register \ 
        -n AzureStackUser \ 
        --endpoint-resource-manager "https://management.local.azurestack.external" \ 
        --suffix-storage-endpoint "local.azurestack.external" \ 
        --suffix-keyvault-dns ".vault.local.azurestack.external" \ 
        --endpoint-vm-image-alias-doc <URI of the document which contains virtual machine image aliases>
      ```

Set the active environment 

      ```azurecli
      az cloud set \
        -n AzureStackUser
      ```

Set the active environment by using the following commands.
   
    a. For the *cloud administrative* environment, use:

      ```azurecli
      az cloud set \
        -n AzureStackAdmin
      ```

    b. For the *user* environment, use:

      ```azurecli
      az cloud set \
        -n AzureStackUser
      ```

1. Update your environment configuration to use the Azure Stack specific API version profile. To update the configuration, run the following command:

    ```azurecli
    az cloud update \
      --profile 2018-03-01-hybrid
   ```

    >[!NOTE]  
    >If you are running a version of Azure Stack before the 1808 build, you must use the API version profile **2017-03-09-profile** rather than the API version profile **2018-03-01-hybrid**.

1. Sign in to your Azure Stack environment by using the `az login` command. You can sign in to the Azure Stack environment either as a user or as a [service principal](../../active-directory/develop/app-objects-and-service-principals.md). 

    * Azure AD environments
      * Sign in as a *user*: You can either specify the username and password directly within the `az login` command, or authenticate by using a browser. You must do the latter if your account has multi-factor authentication enabled:

      ```azurecli
      az login \
        -u <Active directory global administrator or user account. For example: username@<aadtenant>.onmicrosoft.com> \
        --tenant <Azure Active Directory Tenant name. For example: myazurestack.onmicrosoft.com>
      ```

      > [!NOTE]
      > If your user account has multi-factor authentication enabled, you can use the `az login` command without providing the `-u` parameter. Running this command gives you a URL and a code that you must use to authenticate.
   
      * Sign in as a *service principal*: Before you sign in, [create a service principal through the Azure portal](azure-stack-create-service-principals.md) or CLI and assign it a role. Now, sign in by using the following command:

      ```azurecli  
      az login \
        --tenant <Azure Active Directory Tenant name. For example: myazurestack.onmicrosoft.com> \
        --service-principal \
        -u <Application Id of the Service Principal> \
        -p <Key generated for the Service Principal>
      ```
    * AD FS environments

        * Sign in as a user using a web browser with a device code:  
           ```azurecli  
           az login --use-device-code
           ```

           > [!NOTE]  
           >Running the command gives you a URL and a code that you must use to authenticate.

        * Sign in as a service principal:
        
          1. Prepare the .pem file to be used for service principal login.

            * On the client machine where the principal was created, export the service principal certificate as a pfx with the private key located at `cert:\CurrentUser\My`; the cert name has the same name as the principal.
        
            * Convert the pfx to pem (use the OpenSSL utility).

          2.  Sign in to the CLI:
            ```azurecli  
            az login --service-principal \
              -u <Client ID from the Service Principal details> \
              -p <Certificate's fully qualified name, such as, C:\certs\spn.pem>
              --tenant <Tenant ID> \
              --debug 
            ```

### Test the connectivity

With everything set up, use CLI to create resources within Azure Stack. For example, you can create a resource group for an application and add a virtual machine. Use the following command to create a resource group named "MyResourceGroup":

```azurecli
az group create \
  -n MyResourceGroup -l local
```

If the resource group is created successfully, the previous command outputs the following properties of the newly created resource:

![Resource group create output](media/azure-stack-connect-cli/image1.png)

## Linux (AD FS)

### Trust the Azure Stack CA root certificate

### Get the virtual machine aliases endpoint

### Connect to Azure Stack


## Known issues

There are known issues when using CLI in Azure Stack:

 - The CLI interactive mode; for example, the `az interactive` command, is not yet supported in Azure Stack.
 - To get the list of virtual machine images available in Azure Stack, use the `az vm image list --all` command instead of the `az vm image list` command. Specifying the `--all` option ensures that the response returns only the images that are available in your Azure Stack environment.
 - Virtual machine image aliases that are available in Azure may not be applicable to Azure Stack. When using virtual machine images, you must use the entire URN parameter (Canonical:UbuntuServer:14.04.3-LTS:1.0.0) instead of the image alias. This URN must match the image specifications as derived from the `az vm images list` command.

## Next steps

- [Deploy templates with Azure CLI](azure-stack-deploy-template-command-line.md)
- [Enable Azure CLI for Azure Stack users (Operator)](../azure-stack-cli-admin.md)
- [Manage user permissions](azure-stack-manage-permissions.md) 
