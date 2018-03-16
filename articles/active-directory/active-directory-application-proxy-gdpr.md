---
title: GDPR in the Azure Active Directory application proxy | Microsoft Docs
description:  Learn more about GDPR in the Azure Active Directory application proxy.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: mtillman

ms.assetid: c7186f98-dd80-4910-92a4-a7b8ff6272b9
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/16/2018
ms.author: markvi
ms.reviewer: harshja
ms.custom: it-pro

---

# GDPR in the Azure Active Directory application proxy  

Azure Active Directory (Azure AD) Application Proxy is GDPR-compliant along with all other Microsoft services and features. To learn more about Microsoft’s GDPR support, see [Licensing Terms and Documentation](http://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=31).

Because this feature includes connectors on your computers, there are a few events that you need to monitor to stay GDPR compliant. 
Application Proxy creates the following log types, which can contain EUII:

- Connector event logs
- Windows event logs

There are two ways for you to stay GDPR compliant:

- Delete and export requests as they arise

- Turn off logging

For:

- Information on how to configure data retention for the Windows event logs, see [Settings for event logs](https://technet.microsoft.com/library/cc952132.aspx). 
- General information on the Windows Event log, see [Using Windows Event Log](https://msdn.microsoft.com/library/windows/desktop/aa385772.aspx).


You can find the connect event logs at `C:\ProgramData\Microsoft\Microsoft AAD Application Proxy Connector\Trace`. The following sections provide you with the related steps for the connector event logs. You must complete these steps on all connector computers.
 

## Processing Requests

There are three different types of requests you are liable for: 

- Delete
- View
- Export
 
To process view / export requests, you need to go through each of the log files to search for related entries. 

Because the logs are text files, you can search by, for example, using the `findstr` command to find entries related to your user. Search for the following fields because they might be in the logs: 

- UserId
- The username type configured for any applications using Kerberos Constrained Delegation:
    - User principal name
    - On-premises user principal name
    - Username part of user principal name
    - Username part of on-premises user principal name
    - On-premises SAM account name 

 
You can then collect these fields and share them with the user.
To process delete requests, you need to delete the relevant logs. You can restart the connector service (Microsoft Azure AD Application Proxy Connector) to generate a new log file. The new log file enables you to delete the old log files. You can then follow the process for view / export to find all relevant logs, and selectively delete those fields or files. You can also always just delete all old log files if you don’t need them anymore.


## Turn off connector logs

To turn off connector logs, you need to adjust `C:\Program Files\Microsoft AAD App Proxy Connector\ApplicationProxyConnectorService.exe.config` by removing the highlighted line: 


![Configuration](./media/active-directory-application-proxy-gdpr/01.png)


## Next steps

For an overview of the Azure AD application proxy, see [How to provide secure remote access to on-premises applications](active-directory-application-proxy-get-started.md).

