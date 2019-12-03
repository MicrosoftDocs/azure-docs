---
title: Tutorial to transfer data to storage account with Azure Stack Edge | Microsoft Docs
description: Learn how to add and connect to storage accounts on Azure Stack Edge device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: tutorial
ms.date: 12/03/2019
ms.author: alkohli
Customer intent: As an IT admin, I need to understand how to add and connect to storage accounts on Azure Stack Edge so I can use it to transfer data to Azure.
---
# Tutorial: Transfer data via storage accounts with Azure Stack Edge

This tutorial describes how to add and connect to storage accounts on your Azure Stack Edge device. After you've added the storage accounts, Azure Stack Edge can transfer data to Azure.

This procedure can take around 30 minutes to complete.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add a storage account
> * Connect to the storage account

 
## Prerequisites

Before you add storage accounts to Azure Stack Edge, make sure that:

- You've installed your physical device as described in [Install Azure Stack Edge](azure-stack-edge-r-series-deploy-install.md).

- You've activated the physical device as described in [Connect, set up, and activate Azure Stack Edge](azure-stack-edge-r-series-deploy-connect-setup-activate.md).


## Add an Edge storage account

To create an Edge storage account, do the following procedure:

[!INCLUDE [Add an Edge storage account](../../includes/azure-stack-edge-gateway-add-storage-account.md)]


## Connect to the Edge storage account

You can now connect to Edge storage REST APIs over *http* or *https*.

- *Https* is the secure and recommended way.
- *Http* is used when connecting over trusted networks.

## Connect via http

Connection to Edge storage REST APIs over http requires the following steps:

- Add the Azure consistent service VIP and blob service endpoint to the remote host
- Verify the connection 

Each of these steps is described in the following sections.

### Add Azure consistent services VIP address and blob service endpoint to the remote client

[!INCLUDE [Add Azure consistent services VIP and blob service endpoint to host file](../../includes/azure-stack-edge-gateway-add-device-ip-address-blob-service-endpoint.md)]


### Verify connection

To verify the connection, you would typically need the following information (may vary) you gathered in the previous step:

- Storage account name.
- Storage account access key.
- Blob service endpoint.

You already have the storage account name and the blob service endpoint. You can get the storage account access key by connecting to the device via the Azure Resource Manager using an Azure PowerShell client.

Follow the steps in [Connect to the device via Azure Resource Manager](azure-stack-edge-r-series-placeholder.md). Once you have signed into the local device APIs via the Azure Resource Manager, get the list of storage accounts on the device. Run the following cmdlet:

`Get-AzureRMStorageAccount`

From the list of the storage accounts on the device, identify the storage account for which you need the access key. Note the storage account name and resource group.

A sample output is shown below:

```azurepowershell
PS C:\windows\system32> Get-AzureRmStorageAccount

StorageAccountName ResourceGroupName Location SkuName     Kind    AccessTier CreationTime          ProvisioningState EnableHttpsTrafficOnly
------------------ ----------------- -------- -------     ----    ---------- ------------          ----------------- ----------------------
myasetiered1       myasetiered1      DBELocal StandardLRS Storage            11/27/2019 7:10:12 PM Succeeded         False
```

To get the access key, run the following cmdlet:

`Get-AzureRmStorageAccountAccessKey`

A sample output is shown below:

```azurepowershell
PS C:\windows\system32> Get-AzureRmStorageAccountKey

cmdlet Get-AzureRmStorageAccountKey at command pipeline position 1
Supply values for the following parameters:
(Type !? for Help.)
ResourceGroupName: myasetiered1
Name: myasetiered1

KeyName Value    Permissions                                                                                
------- -----    -----------                                                                                
key1    Jb2brrNjRNmArFcDWvL4ufspJjlo+Nie1uh8Mp4YUOVQNbirA1uxEdHeV8Z0dXbsG7emejFWI9hxyR1T93ZncA==        Full
key2    6VANuHzHcJV04EFeyPiWRsFWnHPkgmX1+a3bt5qOQ2qIzohyskIF/2gfNMqp9rlNC/w+mBqQ2mI42QgoJSmavg==        Full
```

Copy and save this key. You will use this key to verify the connection using Azure Storage Explorer.

To verify that the connection is successfully established, use Storage Explorer to attach to an external storage account. If you do not have Storage Explorer, [download Storage Explorer](https://go.microsoft.com/fwlink/?LinkId=708343&clcid=0x409).

[!INCLUDE [Verify connection using Storage Explorer](../../includes/azure-stack-edge-gateway-verify-connection-storage-explorer.md)]


## Connect via https

Connection to Azure Blob storage REST APIs over https requires the following steps:

- Download the certificate from Azure portal
- Import the certificate on the client or remote host
- Add the Azure consistent services VIP and blob service endpoint to the client or remote host
- Configure and verify the connection

Each of these steps is described in the following sections.

### Get certificate

Accessing Blob storage over HTTPS requires an SSL certificate for the device. You need to get the certificate in *.pem* format. In Windows environment, the *.pem* format is the same as Base-64 encoded *.cer* certificate.

You will install this certificate on the client or host computer that you will use to connect to the device. You will also upload this certificate to your Azure Stack Edge device.
 
### Import certificate

Accessing Blob storage over HTTPS requires an SSL certificate for the device. The way in which this certificate is made available to the client application varies from application to application and across operating systems and distributions. Some applications can access the certificate after it is imported into the system’s certificate store, while other applications do not make use of that mechanism.

Specific information for some applications is mentioned in this section. For more information on other applications, consult the documentation for the application and the operating system used.

Follow these steps to import the `.cer` file into the root store of a Windows or Linux client. On a Windows system, you can use Windows PowerShell or the Windows Server UI to import and install the certificate on your system.


#### Use Windows PowerShell

1. Start a Windows PowerShell session as an administrator.
2. At the command prompt, type:

    ```
    Import-Certificate -FilePath C:\temp\localuihttps.cer -CertStoreLocation Cert:\LocalMachine\Root
    ```

#### Use Windows Server UI

[!INCLUDE [Import certificate on Windows client](../../includes/azure-stack-edge-gateway-import-certificate-windows.md)]

#### Use a Linux system

The method to import a certificate varies by distribution.

Several, such as Ubuntu and Debian, use the `update-ca-certificates` command.  

- Rename the Base64-encoded certificate file to have a `.crt` extension and copy it into the `/usr/local/share/ca-certificates directory`.
- Run the command `update-ca-certificates`.

Recent versions of RHEL, Fedora, and CentOS use the `update-ca-trust` command.

- Copy the certificate file into the `/etc/pki/ca-trust/source/anchors` directory.
- Run `update-ca-trust`.

Consult the documentation specific to your distribution for details.

### Add device IP address and blob service endpoint

Follow the same steps to [add device IP address and blob service endpoint when connecting over *http*](#add-device-ip-address-and-blob-service-endpoint-to-the-remote-client).

### Configure and verify connection

Follow the steps to [Configure and verify connection that you used while connecting over *http*](#verify-connection). The only difference is that you should leave the *Use http option* unchecked.


## Next steps

In this tutorial, you learned about the following Azure Stack Edge topics:

> [!div class="checklist"]
> * Add a storage account
> * Connect to a storage account

To learn how to transform your data by using Azure Stack Edge, advance to the next tutorial:

> [!div class="nextstepaction"]
> [Transform data with Azure Stack Edge](./azure-stack-edge-r-series-deploy-configure-compute.md)


