---
title: azcopy login | Microsoft Docs
description: This article provides reference information for the azcopy login command.
author: normesta
ms.service: storage
ms.topic: reference
ms.date: 08/26/2019
ms.author: normesta
ms.subservice: common
ms.reviewer: zezha-msft
---

# azcopy login

Log in to Azure Active Directory to access Azure Storage resources.

## Synopsis

Log in to Azure Active Directory to access Azure Storage resources. 
Note that, to be authorized to your Azure Storage account, you must assign your user 'Storage Blob Data Contributor' role on the Storage account.
This command will cache encrypted login information for current user using the OS built-in mechanisms.
Please refer to the examples for more information.

(NOTICE FOR SETTING ENVIRONMENT VARIABLES: Bear in mind that setting an environment variable from the command line will be readable in your command line history. For variables that contain credentials, consider clearing these entries from your history or using a small script of sorts to prompt for and set these variables.)

```azcopy
azcopy login [flags]
```

## Examples

Log in interactively with default AAD tenant ID set to common:

```azcopy
azcopy login
```

Log in interactively with a specified tenant ID:

```azcopy
azcopy login --tenant-id "[TenantID]"
```

Log in using a VM's system-assigned identity:

```azcopy
azcopy login --identity
```

Log in using a VM's user-assigned identity with a Client ID of the service identity:

```azcopy
azcopy login --identity --identity-client-id "[ServiceIdentityClientID]"
```

Log in using a VM's user-assigned identity with an Object ID of the service identity:

```azcopy
azcopy login --identity --identity-object-id "[ServiceIdentityObjectID]"
```

Log in using a VM's user-assigned identity with a Resource ID of the service identity:

```azcopy
azcopy login --identity --identity-resource-id "/subscriptions/<subscriptionId>/resourcegroups/myRG/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myID"
```

Log in as a service principal using a client secret:
Set the environment variable AZCOPY_SPA_CLIENT_SECRET to the client secret for secret based service principal auth

```azcopy
azcopy login --service-principal
```

Log in as a service principal using a certificate & password:

Set the environment variable AZCOPY_SPA_CERT_PASSWORD to the certificate's password for cert based service principal auth

```azcopy
azcopy login --service-principal --certificate-path /path/to/my/cert
```

Please treat /path/to/my/cert as a path to a PEM or PKCS12 file-- AzCopy does not reach into the system cert store to obtain your certificate.

--certificate-path is mandatory when doing cert-based service principal auth.

## Options

|Option|Description|
|--|--|
|--application-id string|application ID of user-assigned identity. Required for service principal auth.|
|--certificate-path string|path to certificate for SPN authentication. Required for certificate-based service principal auth.|
|-h, --help|help for login|
|--identity|log in using virtual machine's identity, also known as managed service identity (MSI)|
|--identity-client-id string|client ID of user-assigned identity|
|--identity-object-id string|object ID of user-assigned identity|
|--identity-resource-id string|resource ID of user-assigned identity|
|--service-principal|log in via SPN (Service Principal Name) using a certificate or a secret. The client secret or certificate password must be placed in the appropriate environment variable. Type AzCopy env to see names and descriptions of environment variables.|
|--tenant-id string| the Azure active directory tenant id to use for OAuth device interactive login|

## Options inherited from parent commands

|Option|Description|
|--|--|
|--cap-mbps uint32|caps the transfer rate, in Mega bits per second. Moment-by-moment throughput may vary slightly from the cap. If zero or omitted, throughput is not capped.|
|--output-type string|format of the command's output, the choices include: text, json. (default "text")|

## See also

- [azcopy](azcopy.md)
