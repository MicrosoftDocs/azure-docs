---
 title: include file
 description: include file
 services: storage
 author: khdownie
 ms.service: azure-file-storage
 ms.topic: include
 ms.date: 07/08/2018
 ms.author: kendownie
 ms.custom: include file
---
This error can occur whenever the Azure File Sync service is inaccessible from the server. You can troubleshoot this error by working through the following steps:

1. Verify the Windows service `FileSyncSvc.exe` is not blocked by your firewall.
2. Verify that port 443 is open to outgoing connections to the Azure File Sync service. You can do this with the `Test-NetConnection` cmdlet. The URL for the `<azure-file-sync-endpoint>` placeholder below can found in the [Azure File Sync proxy and firewall settings](../articles/storage/file-sync/file-sync-firewall-and-proxy.md#firewall) document. 

    ```powershell
    Test-NetConnection -ComputerName <azure-file-sync-endpoint> -Port 443
    ```

3. Ensure that the proxy configuration is set as anticipated. This can be done with the `Get-StorageSyncProxyConfiguration` cmdlet. More information on configuring the proxy configuration for Azure File Sync can be found in the [Azure File Sync proxy and firewall settings](../articles/storage/file-sync/file-sync-firewall-and-proxy.md#firewall).

    ```powershell
    $agentPath = "C:\Program Files\Azure\StorageSyncAgent"
    Import-Module "$agentPath\StorageSync.Management.ServerCmdlets.dll"
    Get-StorageSyncProxyConfiguration
    ```
4. Use the Test-StorageSyncNetworkConnectivity cmdlet to check network connectivity to the service endpoints. To learn more, see [Test network connectivity to service endpoints](../articles/storage/file-sync/file-sync-firewall-and-proxy.md#test-network-connectivity-to-service-endpoints).    

5. Contact your network administrator for additional assistance troubleshooting network connectivity.