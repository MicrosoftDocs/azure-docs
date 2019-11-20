---
title: Troubleshoot self-hosted integration runtime in Azure Data Factory
description: Learn how to troubleshoot Self-hosted integration runtime issues in Azure Data Factory. 
services: data-factory
author: nabhishek
ms.service: data-factory
ms.topic: troubleshooting
ms.date: 11/07/2019
ms.author: abnarain
---

# Troubleshoot self-hosted integration runtime

This article explores common troubleshooting methods for self-hosted integration runtime in Azure Data Factory.

## Common errors and resolutions

### Error message: Self-hosted integration runtime is unable to connect to cloud service.

- **Symptom**: 

    ![Self-Hosted IR connection issue](media/self-hosted-integration-runtime-troubleshoot-guide/unable-to-connect-to-cloud-service.png)

- **Cause**: The self-hosted integration runtime isn't able to connect to data factory service (backend). Most often than not it's caused due to network settings in Firewall.

- **Resolution**: 

    1. Check if the windows service "Integration Runtime Service" is running.
    
        ![Self-Hosted IR service running status](media/self-hosted-integration-runtime-troubleshoot-guide/integration-runtime-service-running-status.png)
    
    2. If the windows service as shown in [1] is running, follow below instructions as appropriate:

        1. If "proxy" is not configured on self-hosted integration runtime (default settings is no proxy configuration), run the below PowerShell command on the machine where self-hosted integration runtime is installed: 
            
            ```powershell
            (New-Object System.Net.WebClient).DownloadString("https://wu2.frontend.clouddatahub.net/")
            ```
            > [!NOTE] 
            > The service URL may vary based on your data factory location. You can find the service URL under ADF UI -> Connections -> Integration runtimes -> Edit Self-hosted IR -> Nodes -> View Service URLs.
            
            Below is the expected response:
            
            ![Powershell command response](media/self-hosted-integration-runtime-troubleshoot-guide/powershell-command-response.png)
            
            If the response is different, then follow the below instructions as appropriate:
            
            * If you get error "the remote name could not be resolved", there is an issue with DNS. Please get in touch with network team to get the DNS resolution issue fixed! 
            * If you get error "ssl/tls cert is not trusted", please check if the Certificate for "https://wu2.frontend.clouddatahub.net/" is trusted on the machine, install the public certificate using cert manager, which should mitigate this issue.
            * Check Windows -> Event viewer (logs) -> Applications and Services Logs -> Integration Runtime for any failure, mostly caused by DNS, firewall rule, and network settings of the company (Forcedly close the connection). For this issue, please engage your network team for further troubleshot, because every company has customized network settings.

        2. If "proxy" has been configured on the self-hosted integration runtime, verify whether your proxy server is able to access our service endpoint. For a sample command, refer [this](https://stackoverflow.com/questions/571429/powershell-web-requests-and-proxies).    
                
            ```powershell
            $user = $env:username
            $webproxy = (get-itemproperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet
            Settings').ProxyServer
            $pwd = Read-Host "Password?" -assecurestring
            $proxy = new-object System.Net.WebProxy
            $proxy.Address = $webproxy
            $account = new-object System.Net.NetworkCredential($user,[Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pwd)), "")
            $proxy.credentials = $account
            $url = "https://wu2.frontend.clouddatahub.net/"
            $wc = new-object system.net.WebClient
            $wc.proxy = $proxy
            $webpage = $wc.DownloadData($url)
            $string = [System.Text.Encoding]::ASCII.GetString($webpage)
            $string
            ```

            Below is the expected response:
            
            ![Powershell command response 2](media/self-hosted-integration-runtime-troubleshoot-guide/powershell-command-response.png)

            > [!NOTE] 
            > Proxy considerations:
            > *	Check if the proxy server requires whitelisting. If so, have [these domains](https://docs.microsoft.com/azure/data-factory/data-movement-security-considerations#firewall-requirements-for-on-premisesprivate-network) whitelisted.
            > *	Check TLS/SSL cert for "wu2.frontend.clouddatahub.net/" is trusted on proxy server.
            > *	If you are using active directory authentication in proxy, then change the service account to the user account that can access the proxy as "Integration Runtime Service".

### Error message: Self-hosted integration runtime node/ logical SHIR is in Inactive/ "Running (Limited)" state

- **Cause**: You may see Self-hosted IR node in Inactive status as shown in the screenshot below:

    ![Inactive Self-Hosted IR node](media/self-hosted-integration-runtime-troubleshoot-guide/inactive-self-hosted-ir-node.png)

    It happens so when nodes are not able to communicate with each other. 

- **Resolution**: 

    Log into the node hosted VM, and open Event View, under the Applications and Services Logs -> Integration Runtime, filter all the error logs. 

     1. If the error log contains: 
    
        **Error log**: System.ServiceModel.EndpointNotFoundException: Could not connect to net.tcp://xxxxxxx.bwld.com:8060/ExternalService.svc/WorkerManager. The connection attempt lasted for a time span of 00:00:00.9940994. TCP error code 10061: No connection could be made because the target machine actively refused it 10.2.4.10:8060.  ---> 
        System.Net.Sockets.SocketException: No connection could be made because the target machine actively refused it 10.2.4.10:8060
    
           at System.Net.Sockets.Socket.DoConnect(EndPoint endPointSnapshot, SocketAddress socketAddress)
           
           at System.Net.Sockets.Socket.Connect(EndPoint remoteEP)
           
           at System.ServiceModel.Channels.SocketConnectionInitiator.Connect(Uri uri, TimeSpan timeout)
    
        **Solution:** launch the command line: telnet 10.2.4.10 8060
        
        If you get below error, please contact your IT guys for help with fixing this issue. After you could successfully telnet, contact Microsoft support if you still have issues for the IR node status.
        
        ![Command-line error](media/self-hosted-integration-runtime-troubleshoot-guide/command-line-error.png)
        
     2.	If the error log contains:
     
        **Error log:** Cannot connect to worker manager: net.tcp://xxxxxx:8060/ExternalService.svc/ No DNS entries exist for host azranlcir01r1. No such host is known Exception detail: System.ServiceModel.EndpointNotFoundException: No DNS entries exist for host xxxxx. ---> System.Net.Sockets.SocketException: No such host is known at System.Net.Dns.GetAddrInfo(String name) at System.Net.Dns.InternalGetHostByName(String hostName, Boolean includeIPv6) at System.Net.Dns.GetHostEntry(String hostNameOrAddress) at System.ServiceModel.Channels.DnsCache.Resolve(Uri uri) --- End of inner exception stack trace --- Server stack trace: at System.ServiceModel.Channels.DnsCache.Resolve(Uri uri) 
    
        **Solution:** One of the below two actions can help resolve the issue:
         1. Put all the nodes in the same domain.
         2.	Add IP to host mapping in all the hosted VM's hosts file.


## Next steps

For more troubleshooting help, try these resources:

*  [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
*  [Data Factory feature requests](https://feedback.azure.com/forums/270578-data-factory)
*  [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
*  [MSDN forum](https://social.msdn.microsoft.com/Forums/home?sort=relevancedesc&brandIgnore=True&searchTerm=data+factory)
*  [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
*  [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
*  [ADF mapping data flows Performance Guide](concepts-data-flow-performance.md)
