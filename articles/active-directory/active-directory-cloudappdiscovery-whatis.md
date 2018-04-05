---
title: Find unmanaged cloud applications with Cloud App Discovery in Azure Active Directory | Microsoft Docs
description: Provides information about finding and managing applications with Cloud App Discovery, what are the benefits and how it works.
services: active-directory
keywords: cloud app discovery, managing applications
documentationcenter: ''
author: MarkusVi
manager: mtillman

ms.assetid: db968bf5-22ae-489f-9c3e-14df6e1fef0a
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/05/2018
ms.author: markvi
ms.reviewer: nigu

---
# Find unmanaged cloud applications with Cloud App Discovery
## Summary

Cloud App Discovery in Azure Active Directory now provides an enhanced agentless discovery experience powered by Microsoft Cloud App Security. To use Cloud App Discovery, just sign in with your Azure AD Premium P1 credentials. This update is available at no additional cost to all Azure AD Premium P1 customers. Get started with the article [Set up Cloud App Discovery in Azure AD](https://docs.microsoft.com/azure/active-directory/cloudappdiscovery-get-started), then try out [Microsoft Cloud App Security](https://portal.cloudappsecurity.com/).

> [!IMPORTANT] 
> The current Azure AD Cloud App Discovery experience with agent-based discovery is to be turned off on March 5, 2018, after which the agents will be disabled and data deleted. Please take action before March 5th to get up and running on the new experience to avoid disruption of service.  
 
**With Cloud App Discovery, you can:**

* Find the cloud applications being used and measure that usage by number of users, volume of traffic or number of web requests to the application.
* Identify the users that are using an application.
* Export data for offline analysis.
* Bring these applications under IT control and enable single sign-on for user management.

## How it works
1. Application usage agents are installed on user's computers.
2. The application usage information captured by the agents is sent over a secure, encrypted channel to the cloud app discovery service.
3. The Cloud App Discovery service evaluates the data and generates reports.

![Cloud App Discovery diagram](./media/active-directory-cloudappdiscovery/cad01.png)


## Next steps
* [Cloud App Discovery Security and Privacy Considerations](active-directory-cloudappdiscovery-security-and-privacy-considerations.md)  
* [Cloud App Discovery Registry Settings for Proxy Servers with Custom Ports](active-directory-cloudappdiscovery-registry-settings-for-proxy-services.md)
* [Cloud App Discovery Agent Changelog ](http://social.technet.microsoft.com/wiki/contents/articles/24616.cloud-app-discovery-agent-changelog.aspx)
* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)

