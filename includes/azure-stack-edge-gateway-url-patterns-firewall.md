---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 01/03/2022
ms.author: alkohli
---

|    URL pattern |    Component or functionality  |
|-----------------------------------------------------|-----------------------------------------|
|    https://\*.databoxedge.azure.com/\*<br>https://\*.servicebus.windows.net/\*<br>https://login.microsoftonline.com <br> https://login.microsoftonline.net|    Azure Stack Edge service<br>Azure Service Bus<br>Authentication Service - Azure Active Directory                           |
|    http:\//crl.microsoft.com/pki/\*<br>http:\//www.microsoft.com/pki/\*                                                                                                                                                                                                                                                                                                                                                                                                  |    Certificate revocation                                                                               |
|    https://\*.core.windows.net/\*<br>https://\*.data.microsoft.com<br>http://\*.msftncsi.com<br>https://www.msftconnecttest.com/connecttest.txt<br>https://management.azure.com/ |    Azure storage accounts and monitoring |
|    http:\//windowsupdate.microsoft.com<br>http://\*.windowsupdate.microsoft.com<br>https://\*.windowsupdate.microsoft.com<br>http://\*.update.microsoft.com<br>https://\*.update.microsoft.com<br>http://\*.windowsupdate.com<br>http://download.microsoft.com<br>http://\*.download.windowsupdate.com<br>http://wustat.windows.com<br>http://ntservicepack.microsoft.com<br>http://\*.ws.microsoft.com<br>https://\*.ws.microsoft.com<br>http://\*.mp.microsoft.com |    Microsoft Update servers                                                                             |
|    http://\*.deploy.akamaitechnologies.com                                                                                                                                                                                                                                                                                                                                                                                                                          |    Akamai CDN                                                                                           |
|    `https://azureprofilerfrontdoor.cloudapp.net`     |    Azure Traffic Manager |
|    http://\*.data.microsoft.com     |    Telemetry service in Windows, see the update for customer experience and diagnostic telemetry |
|    `http://<vault-name>.vault.azure.net:443`     |    Key Vault |
<!--|    http://www.msftconnecttest.com/connecttest.txt  |    For diagnostics     ||  |-->   

