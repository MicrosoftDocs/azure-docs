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

### Run diagnostics

Both [Windows clients](https://github.com/Azure-Samples/azure-files-samples/tree/master/AzFileDiagnostics/Windows) and [Linux clients](https://github.com/Azure-Samples/azure-files-samples/tree/master/AzFileDiagnostics/Linux) can use `AzFileDiagnostics` to ensure that the client environment has the correct prerequisites. `AzFileDiagnostics` automates symptom detection and helps set up your environment to get optimal performance.

### Check if your firewall or ISP is blocking port 445

System error 53 or system error 67 can occur if port 445 outbound communication to an Azure Files datacenter is blocked. Many ISPs and companies block port 445. To see the summary of ISPs that allow or disallow access from port 445, go to [TechNet](https://social.technet.microsoft.com/wiki/contents/articles/32346.azure-summary-of-isps-that-allow-disallow-access-from-port-445.aspx).

To check if your firewall or ISP is blocking port 445, you can run the [`AzFileDiagnostics`](#run-diagnostics) tool or use the `Test-NetConnection` cmdlet.

To use the `Test-NetConnection` cmdlet, the Azure PowerShell module must be installed. See [Install Azure PowerShell module](/powershell/azure/install-Az-ps) for more information. Remember to replace `<your-storage-account-name>` and `<your-resource-group-name>` with the names for your storage account and resource group.

```azurepowershell
$resourceGroupName = "<your-resource-group-name>"
$storageAccountName = "<your-storage-account-name>"

# This command requires you to be logged into your Azure account and set the subscription your storage account is under, run:
# Connect-AzAccount -SubscriptionId ‘xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx’
# if you haven't already logged in.
$storageAccount = Get-AzStorageAccount -ResourceGroupName $resourceGroupName -Name $storageAccountName

# The ComputerName, or host, is <your-storage-account-name>.file.core.windows.net for Azure Public Regions.
# $storageAccount.Context.FileEndpoint is used because non-Public Azure regions, such as sovereign clouds
# or Azure Stack deployments, will have different hosts for Azure file shares (and other storage resources).
Test-NetConnection -ComputerName ([System.Uri]::new($storageAccount.Context.FileEndPoint).Host) -Port 445
```

If the connection was successful, you should see the following output:


```azurepowershell
ComputerName     : <your-storage-account-name>
RemoteAddress    : <storage-account-ip-address>
RemotePort       : 445
InterfaceAlias   : <your-network-interface>
SourceAddress    : <your-ip-address>
TcpTestSucceeded : True
```
 
> [!Note]  
> The above command returns the current IP address of the storage account. This IP address isn't guaranteed to remain the same, and may change at any time. Don't hardcode this IP address into any scripts, or into a firewall configuration.

If you can't open port 445, you can set up a VPN or ExpressRoute connection from on-premises to your Azure storage account, with Azure Files exposed on your internal network using private endpoints. This sends traffic through a secure tunnel as opposed to over the internet. See [Configure a Point-to-Site (P2S) VPN on Windows](storage-files-configure-p2s-vpn-windows.md) to access Azure Files from Windows clients or [Configure a Point-to-Site (P2S) VPN on Linux](storage-files-configure-p2s-vpn-linux.md) for Linux clients.

### Confirm that DNS is working

Run the `Resolve-DnsName` PowerShell cmdlet or use `nslookup` to perform a DNS query for your domain name.

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
