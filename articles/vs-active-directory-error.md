<properties title="Error During Authentication Detection" pageTitle="Error During Authentication Detection" metaKeywords="" description="" services="active-directory" documentationCenter="" authors="ghogen, kempb" />
  
<tags ms.service="active-directory" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/8/2014" ms.author="ghogen, kempb" />

####Error During Authentication Detection 
While detecting previous authentication code, the wizard detected an incompatible authentication type.   

######What is being checked?

The wizard attempts to detect versions of authentication code that have been configured with previous versions of Visual Studio.  If you received this error, it means an incompatible authentication type.  The wizard detects the following types of authentication from previous versions of Visual Studio:
 
* Windows Authentication 
* Individual User Accounts 
* Organizational Accounts 

For more information, see [Authentication Scenarios for Azure AD](http://msdn.microsoft.com/library/azure/dn499820.aspx).