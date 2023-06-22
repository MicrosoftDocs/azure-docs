---
title: azcopy login status
description: This article provides reference information for the azcopy login status command.
author: normesta
ms.service: azure-storage
ms.topic: reference
ms.date: 05/26/2022
ms.author: normesta
ms.subservice: storage-common-concepts
ms.reviewer: zezha-msft
---

# azcopy login status

Lists the entities in a given resource.

## Synopsis

Prints if you're currently logged in to your Azure Storage account.

```azcopy
azcopy login status [flags]
```

## Related conceptual articles

- [Get started with AzCopy](storage-use-azcopy-v10.md)
- [Transfer data with AzCopy and Blob storage](./storage-use-azcopy-v10.md#transfer-data)
- [Transfer data with AzCopy and file storage](storage-use-azcopy-files.md)

### Options

`--endpoint`    Prints the Azure Active Directory endpoint that is being used in the current session.

`-h`, `--help`    Help for status

`--tenant`    Prints the Azure Active Directory tenant ID that is currently being used in session.

### Options inherited from parent commands

`--aad-endpoint`    (string)    The Azure Active Directory endpoint to use. The default (https://login.microsoftonline.com) is correct for the global Azure cloud. Set this parameter when authenticating in a national cloud. Not needed for Managed Service Identity

`--application-id`    (string)    Application ID of user-assigned identity. Required for service principal auth.

`--cap-mbps`    (float)    Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it is omitted, the throughput isn't capped.

`--certificate-path`    (string)    Path to certificate for SPN authentication. Required for certificate-based service principal auth.

`--identity`    Log in using virtual machine's identity, also known as managed service identity (MSI).

`--identity-client-id`    (string)    Client ID of user-assigned identity.

`--identity-object-id`    (string)    Object ID of user-assigned identity.

`--identity-resource-id`    (string)    Resource ID of user-assigned identity.

`--output-type`    (string)    Format of the command's output. The choices include: text, json. The default value is 'text'. (default "text")

`--service-principal`    Log in via Service Principal Name (SPN) by using a certificate or a secret. The client secret or certificate password must be placed in the appropriate environment variable. 
Type AzCopy env to see names and descriptions of environment variables.

`--tenant-id`    (string)    The Azure Active Directory tenant ID to use for OAuth device interactive login.

`--trusted-microsoft-suffixes`    (string)    Specifies additional domain suffixes where Azure Active Directory login tokens may be sent.  The default is '*.core.windows.net;*.core.chinacloudapi.cn;*.core.cloudapi.de;*.core.usgovcloudapi.net;*.storage.azure.net'. Any listed here are added to the default. For security, you should only put Microsoft Azure domains here. Separate multiple entries with semi-colons.

## See also

- [azcopy](storage-ref-azcopy.md)
