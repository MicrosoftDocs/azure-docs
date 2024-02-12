---
title: azcopy login
description: This article provides reference information for the azcopy login command.
author: normesta
ms.service: azure-storage
ms.topic: reference
ms.date: 03/13/2023
ms.author: normesta
ms.subservice: storage-common-concepts
ms.reviewer: zezha-msft
---

# azcopy login

Logs in to Microsoft Entra ID to access Azure Storage resources.

## Synopsis

Log in to Microsoft Entra ID to access Azure Storage resources.

To be authorized to your Azure Storage account, you must assign the **Storage Blob Data Contributor** role to your user account in the context of either the Storage account, parent resource group, or parent subscription.

This command will cache encrypted login information for current user using the OS built-in mechanisms.

> [!IMPORTANT]
> If you set an environment variable by using the command line, that variable will be readable in your command line history. Consider clearing variables that contain credentials from your command line history. To keep variables from appearing in your history, you can use a script to prompt the user for their credentials, and to set the environment variable.

```azcopy
azcopy login [flags]
```

## Related conceptual articles

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [Tutorial: Migrate on-premises data to cloud storage with AzCopy](storage-use-azcopy-migrate-on-premises-data.md)
- [Transfer data with AzCopy and Blob storage](./storage-use-azcopy-v10.md#transfer-data)
- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)

## Examples

Log in interactively with default Microsoft Entra tenant ID set to common:

`azcopy login`

Log in interactively with a specified tenant ID:

`azcopy login --tenant-id "[TenantID]"`

Log in by using the system-assigned identity of a Virtual Machine (VM):

`azcopy login --identity`

Log in by using the user-assigned identity of a VM and a Client ID of the service identity:

`azcopy login --identity --identity-client-id "[ServiceIdentityClientID]"`

Log in by using the user-assigned identity of a VM and an Object ID of the service identity:

`azcopy login --identity --identity-object-id "[ServiceIdentityObjectID]"`

Log in by using the user-assigned identity of a VM and a Resource ID of the service identity:

`azcopy login --identity --identity-resource-id "/subscriptions/<subscriptionId>/resourcegroups/myRG/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myID"`

Log in as a service principal by using a client secret:

Set the environment variable AZCOPY_SPA_CLIENT_SECRET to the client secret for secret based service principal auth.

`azcopy login --service-principal --application-id <your service principal's application ID>`

Log in as a service principal by using a certificate and it's password:

Set the environment variable `AZCOPY_SPA_CERT_PASSWORD` to the certificate's password for cert based service principal auth

`azcopy login --service-principal --certificate-path /path/to/my/cert --application-id <your service principal's application ID>`

Treat /path/to/my/cert as a path to a PEM or PKCS12 file--. AzCopy doesn't reach into the system cert store to obtain your certificate. `--certificate-path` is mandatory when doing cert-based service principal auth.

Subcommand for login to check the login status of your current session.

`azcopy login status`

## Options

`--aad-endpoint`    (string)    The Microsoft Entra endpoint to use. The default (https://login.microsoftonline.com) is correct for the global Azure cloud. Set this parameter when authenticating in a national cloud. Not needed for Managed Service Identity. To see a list of national cloud Microsoft Entra endpoints, see [Microsoft Entra authentication endpoints](../../active-directory/develop/authentication-national-cloud.md#azure-ad-authentication-endpoints)

`--application-id`    (string)    Application ID of user-assigned identity. Required for service principal auth.

`--certificate-path`    (string)    Path to certificate for SPN authentication. Required for certificate-based service principal auth.

`-h`, `--help`    Help for login

`--identity`    Log in using virtual machine's identity, also known as managed service identity (MSI).

`--identity-client-id`    (string)    Client ID of user-assigned identity.

`--identity-object-id`    (string)    Object ID of user-assigned identity.

`--identity-resource-id`    (string)    Resource ID of user-assigned identity.

`--service-principal`    Log in via Service Principal Name (SPN) by using a certificate or a secret. The client secret or certificate password must be placed in the appropriate environment variable. Type 
AzCopy env to see names and descriptions of environment variables.

`--tenant-id`    (string)    The Microsoft Entra tenant ID to use for OAuth device interactive login.

## Options inherited from parent commands

`--cap-mbps`    (float)    Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it's omitted, the throughput isn't capped.

`--output-type`    (string)    Format of the command's output. The choices include: text, json. The default value is 'text'. (default "text")

`--trusted-microsoft-suffixes`    (string)    Specifies additional domain suffixes where Microsoft Entra login tokens may be sent.  The default is '*.core.windows.net;*.core.chinacloudapi.cn;*.core.cloudapi.de;*.core.usgovcloudapi.net;*.storage.azure.net'. Any listed here are added to the default. For security, you should only put Microsoft Azure domains here. Separate multiple entries with semi-colons.

## See also

- [azcopy](storage-ref-azcopy.md)
