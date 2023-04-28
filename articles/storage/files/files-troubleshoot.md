---
title: Troubleshoot Azure Files
description: Troubleshoot issues with Azure file shares. See common issues and explore possible resolutions.
author: khdownie
ms.service: storage
ms.topic: troubleshooting
ms.date: 02/21/2023
ms.author: kendownie
ms.subservice: files 
---

# Troubleshoot Azure Files

This article lists common issues related to Azure Files. It also provides possible causes and resolutions for these problems.

If you can't find an answer to your question, you can contact us through the following channels (in escalating order):

- [Microsoft Q&A question page for Azure Files](/answers/products/azure?product=storage).
- [Azure Community Feedback](https://feedback.azure.com/d365community/forum/a8bb4a47-3525-ec11-b6e6-000d3a4f0f84?c=c860fa6b-3525-ec11-b6e6-000d3a4f0f84).
- Microsoft Support. To create a new support request, sign into the Azure portal, and on the **Help** tab, select the **Help + support** button, and then select **New support request**.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## General troubleshooting first steps
If you encounter problems with Azure Files, start with these steps. You can also use the [Azure file shares troubleshooter](https://support.microsoft.com/help/4022301/troubleshooter-for-azure-files-shares), which can help with problems connecting, mapping, and mounting Azure file shares.

### Check DNS resolution and connectivity to your Azure file share
The most common problem encountered by Azure Files customers is that mounting or accessing the Azure file share fails because of an incorrect networking configuration. This can happen with any of the three file sharing protocols that Azure Files supports: SMB, NFS, and FileREST. 

The following table provides the SMB, NFS, and FileREST requirements for which of the network endpoints of a storage account they can use, and which port that endpoint can be accessed over. To learn more about network endpoints, see [Azure Files networking considerations](storage-files-networking-overview.md).

| Protocol name | Unrestricted public endpoint | Restricted public endpoint | Private endpoint | Required port |
|-|:-:|:-:|:-:|-|
| SMB | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | TCP 445 |
| NFS | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | TCP 2049 |
| FileREST | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | <ul><li>TCP 443 (HTTPS)</li><li>TCP 80 (HTTP)</li></ul> |

To mount or access a file share successfully, your client must:

- Be able to resolve the fully qualified domain name of the storage account (ex. `mystorageaccount.file.core.windows.net`) to the correct IP address for the desired network endpoint of the storage account.

- Establish a successful TCP connection to the correctly resolved IP address on the correct port for the desired protocol. 

> [!Note]  
> You must use the fully qualified domain name (FQDN) for your storage account when mounting/accessing the share. The following commands will let you see the current IP addresses of the network endpoints of your storage account, but you should not hardcode these IP addresses into any scripts, firewall configurations, or other locations. IP addresses aren't guaranteed to remain the same, and may change at any time.

#### Check DNS name resolution
The following command lets you test the DNS name resolution of your storage account.

# [PowerShell](#tab/powershell)
```PowerShell
# If you have changed the DNS configuration in your environment, it may be helpful to clear
# the DNS client cache to ensure you're getting the updated DNS name resolution.
Clear-DnsClientCache

# Replace this value with the fully qualified domain name for your storage account. 
# Different storage accounts, especially in different Azure environments, 
# may have different suffixes than file.core.windows.net, so be sure to use the correct
# suffix for your storage account.
$hostName = "mystorageaccount.file.core.windows.net"

# Do the name resolution. Piping to Format-List is optional.
Resolve-DnsName -Name $hostName | Format-List
```

The output returned by `Resolve-DnsName` may be different depending on your environment and desired networking configuration. For example, if you are trying to access the public endpoint of the storage account that does not have a private endpoint configured, you would see a result that looks like the following, where `x.x.x.x` is the IP address of the cluster `file.phx10prdstf01a.store.core.windows.net` of the Azure storage platform that serves your storage account:

```Output
Name       : mystorageaccount.file.core.windows.net
Type       : CNAME
TTL        : 27
Section    : Answer
NameHost   : file.phx10prdstf01a.store.core.windows.net

Name       : file.phx10prdstf01a.store.core.windows.net
QueryType  : A
TTL        : 60
Section    : Answer
IP4Address : x.x.x.x
```

If you are trying to access the public endpoint of a storage account that has one or more private endpoints configured, you would expect to see a result that looked something like the following. Note that an additional CNAME record for `mystorageaccount.privatelink.file.core.windows.net` has been inserted in between the normal FQDN of the storage account and the name of storage cluster. This enables name resolution to the public endpoint's IP address when the user is accessing from the internet, and resolution to the private endpoint's IP address when the user is accessing from inside of an Azure virtual network (or peered network).

```Output
Name       : mystorageaccount.file.core.windows.net
Type       : CNAME
TTL        : 60
Section    : Answer
NameHost   : mystorageaccount.privatelink.file.core.windows.net

Name       : mystorageaccount.privatelink.file.core.windows.net
Type       : CNAME
TTL        : 60
Section    : Answer
NameHost   : file.phx10prdstf01a.store.core.windows.net


Name       : file.phx10prdstf01a.store.core.windows.net
QueryType  : A
TTL        : 60
Section    : Answer
IP4Address : x.x.x.x
```

If you are resolving to a private endpoint, you would normally expect an A record for `mystorageaccount.privatelink.file.core.windows.net` that maps to your private endpoint's IP address:

```Output
Name                   : mystorageaccount.file.core.windows.net
Type                   : CNAME
TTL                    : 53
Section                : Answer
NameHost               : mystorageaccount.privatelink.file.core.windows.net


Name                   : mystorageaccount.privatelink.file.core.windows.net
QueryType              : A
TTL                    : 10
Section                : Answer
IP4Address             : 10.0.0.5
```

# [Bash](#tab/bash)
```Bash
# Replace this value with the fully qualified domain name for your storage account. 
# Different storage accounts, especially in different Azure environments, 
# may have different suffixes than file.core.windows.net, so be sure to use the correct
# suffix for your storage account.
HOSTNAME="mystorageaccount.file.core.windows.net"

# Do the name resolution.
nslookup $HOSTNAME
```

The output returned by `nslookup` may be different depending on your environment and desired networking configuration. For example, if you are trying to access the public endpoint of the storage account that does not have a private endpoint configured, you would see a result that looks like the following, where `x.x.x.x` is the IP address of the cluster `file.phx10prdstf01a.store.core.windows.net` of the Azure storage platform that serves your storage account:

```Output
Server:         127.0.0.53
Address:        127.0.0.53#53

Non-authoritative answer:
mystorageaccount.file.core.windows.net    canonical name = file.phx10prdstf01a.store.core.windows.net.
Name:   file.phx10prdstf01a.store.core.windows.net
Address: x.x.x.x
```

If you are trying to access the public endpoint of a storage account that has one or more private endpoints configured, you would expect to see a result that looked something like the following. Note that an additional CNAME record for `mystorageaccount.privatelink.file.core.windows.net` has been inserted in between the normal FQDN of the storage account and the name of storage cluster. This enables name resolution to the public endpoint's IP address when the user is accessing from the internet, and resolution to the private endpoint's IP address when the user is accessing from inside of an Azure virtual network (or peered network).

```Output
Server:         127.0.0.53
Address:        127.0.0.53#53

Non-authoritative answer:
mystorageaccount.file.core.windows.net    canonical name = mystorageaccount.privatelink.file.core.windows.net.
mystorageaccount.privatelink.file.core.windows.net        canonical name = file.phx10prdstf01a.store.core.windows.net.
Name:   file.phx10prdstf01a.store.core.windows.net
Address: 20.60.39.8
```

If you are resolving to a private endpoint, you would normally expect an A record for `mystorageaccount.privatelink.file.core.windows.net` that maps to your private endpoint's IP address:

```Output
Server:         127.0.0.53
Address:        127.0.0.53#53

Non-authoritative answer:
mystorageaccount.file.core.windows.net    canonical name = mystorageaccount.privatelink.file.core.windows.net.
Name:   mystorageaccount.privatelink.file.core.windows.net
Address: 10.0.0.5
```
---

#### Check TCP connectivity
The following command lets you test your client's ability to make a TCP connection to the resolved IP address/port number.

# [PowerShell](#tab/powershell)
```PowerShell
# Replace this value with the fully qualified domain name for your storage account. 
# Different storage accounts, especially in different Azure environments, 
# may have different suffixes than file.core.windows.net, so be sure to use the correct
# suffix for your storage account.
$hostName = "mystorageaccount.file.core.windows.net"

# Do the TCP connection test - see the above protocol/port table to figure out which
# port to use for your test. This test uses port 445, the port used by SMB.
Test-NetConnection -ComputerName $hostName -Port 445
```

If the connection was successfully established, you should expect to see the following result:

```Output
ComputerName     : mystorageAccount.file.core.windows.net
RemoteAddress    : x.x.x.x
RemotePort       : 445
InterfaceAlias   : Ethernet
SourceAddress    : y.y.y.y
TcpTestSucceeded : True
```

# [Bash](#tab/bash)
```Bash
# Replace this value with the fully qualified domain name for your storage account. 
# Different storage accounts, especially in different Azure environments, 
# may have different suffixes than file.core.windows.net, so be sure to use the correct
# suffix for your storage account.
HOSTNAME="mystorageaccount.file.core.windows.net"

# Do the TCP connection test - see the above protocol/port table to figure out which
# port to use for your test. This test uses port 445, the port used by SMB.
nc -zvw3 $HOSTNAME 445
```

If the connection was successfully established, you should expect to see the following result:

```Output
Connection to mystorageaccount.file.core.windows.net (10.0.0.5) 445 port [tcp/microsoft-ds] succeeded!
```
---

### Run diagnostics

Both [Windows clients](https://github.com/Azure-Samples/azure-files-samples/tree/master/AzFileDiagnostics/Windows) and [Linux clients](https://github.com/Azure-Samples/azure-files-samples/tree/master/AzFileDiagnostics/Linux) can use `AzFileDiagnostics` to ensure that the client environment has the correct prerequisites. `AzFileDiagnostics` automates symptom detection and helps set up your environment to get optimal performance.

## Common troubleshooting areas

For more detailed information, choose the subject area that you'd like to troubleshoot.

- [Connectivity and access issues (SMB)](files-troubleshoot-smb-connectivity.md)
- [Identity-based authentication and authorization issues (SMB)](files-troubleshoot-smb-authentication.md)
- [Performance issues (SMB/NFS)](files-troubleshoot-performance.md)
- [General issues on Linux (SMB)](files-troubleshoot-linux-smb.md)
- [General issues on Linux (NFS)](files-troubleshoot-linux-nfs.md)
- [Azure File Sync issues](../file-sync/file-sync-troubleshoot.md)

Some issues can be related to more than one subject area (both connectivity and performance, for example).

## Need help?
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved quickly.

## See also
- [Monitor Azure Files](storage-files-monitoring.md)
