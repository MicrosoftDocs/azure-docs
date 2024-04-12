---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 04/13/2023
ms.author: alkohli
---

|    URL pattern |    Component or functionality  |
|-----------------------------------------------------|-----------------------------------------|
|    https://login.microsoftonline.com <br> `https://login.microsoftonline.net`<br>https://pod01-edg1.eus.databoxedge.azure.com/<br>https://pod01-edg1.wus2.databoxedge.azure.com/<br>https://pod01-edg1.sea.databoxedge.azure.com/<br>https://pod01-edg1.we.databoxedge.azure.com/<br>https://\*.databoxedge.azure.com/\*<sup>1</sup><br>https://euspod01edg1sbcnpu53n.servicebus.windows.net/<br>https://wus2pod01edg1sbcnqh26z.servicebus.windows.net/<br>https://seapod01edg1sbcnkw22o.servicebus.windows.net/<br>https://wepod01edg1sbcnhk23j.servicebus.windows.net/<br>https://\*.servicebus.windows.net/\*<sup>2</sup><br><br><sup>1,2</sup>Use the wildcard URL to refer to multiple Azure regions with a single URL, or use a specific URL to refer to an individual Azure region.  |Azure Stack Edge service<br>Azure Service Bus<br>Authentication Service - Microsoft Entra ID                           |
|    http:\//crl.microsoft.com/pki/\*<br>http:\//www.microsoft.com/pki/\*                                                                                                                                                                                                                                                                                                                                                                                                  |    Certificate revocation                                                                               |
|    https://\*.core.windows.net/\*<br>https://\*.data.microsoft.com<br>http://\*.msftncsi.com<br>http://www.msftconnecttest.com/connecttest.txt<br>https://management.azure.com/<br>https://seapod1edg1monsa01kw22o.table.core.windows.net/<br>https://euspod01edg1monsa01pu53n.table.core.windows.net/<br>https://wus2pod1edg1monsa01qh26z.table.core.windows.net/<br>https://wepod01edg1monsa01hk23j.table.core.windows.net/   |Azure storage accounts and monitoring |
|    http:\//windowsupdate.microsoft.com<br>http://\*.windowsupdate.microsoft.com<br>https://\*.windowsupdate.microsoft.com<br>http://\*.update.microsoft.com<br>https://\*.update.microsoft.com<br>http://\*.windowsupdate.com<br>http://download.microsoft.com<br>http://\*.download.windowsupdate.com<br>http://wustat.windows.com<br>http://ntservicepack.microsoft.com<br>http://\*.ws.microsoft.com<br>https://\*.ws.microsoft.com<br>http://\*.mp.microsoft.com |    Microsoft Update servers                                                                             |
|    http://\*.deploy.akamaitechnologies.com                                                                                                                                                                                                                                                                                                                                                                                                                          |    Akamai CDN                                                                                           |
|   `https://azureprofilerfrontdoor.cloudapp.net`<br>https://\*.trafficmanager.net/\*     |    Azure Traffic Manager |
|    http://\*.data.microsoft.com     |    Telemetry service in Windows, see the update for customer experience and diagnostic telemetry |
|    `http://<vault-name>.vault.azure.net:443`     |    Key Vault |
|    `https://azstrpprod.trafficmanager.net/*`    |Remote Management  |
|   `http://www.msftconnecttest.com/connecttest.txt`  |    Required for a web proxy test, this URL is used to validate web connectivity before applying the configuration.  | 
<!--|    http://www.msftconnecttest.com/connecttest.txt  |    For diagnostics     ||  |-->   
