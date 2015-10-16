<properties 
	pageTitle="How can I discover unsanctioned cloud apps that are used within my organization" 
	description="This topic describes what is the Cloud App Discvery is and why you would use it." 
	services="active-directory" 
	documentationCenter="" 
	authors="markusvi" 
	manager="swadhwa" 
	editor="lisatoft"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/23/2015" 
	ms.author="markusvi"/>

# How can I discover unsanctioned cloud apps that are used within my organization

In modern enterprises, IT departments are often not aware of all the cloud applications that are used by the users to do their work.
 As a consequence of this, administrators often have concerns in conjunction with unauthorized access to corporate data, possible data leakage and other security risks inherent in the applications.
 Because they don’t know how many or which apps are used, even getting started building a plan to deal with these risks seems to be daunting.

You can address these concerns by using Cloud App Discovery.
 Cloud App Discovery is a Premium feature of Azure Active Directory that enables you to discover cloud applications that are uses by the employees in your organization. 


**With Cloud App Discovery, you can:**

* Discover applications in use and measure usage by number of users, volume of traffic or number of web requests to the application. 
* Identify the users that are using an application. 
* Export data for addition offline analysis. 
* Prioritize applications to bring under IT control and integrate applications easily to enable Single Sign-on and user management. 

With cloud app discovery, the data retrieval part is accomplished by agents that run on computers in your environments.
The app usage information that is captured by the agents is send over a secure, encrypted channel to the cloud app discovery service.
The cloud app discovery service evaluates the data and generates reports you can use to analyze your environment.


<center>![How Cloud App Discovery Works](./media/active-directory-cloudappdiscovery/cad01.png)</center>

##Next Steps


* To learn more about How Cloud app discovery works, see [Getting Started With Cloud App Discovery](http://social.technet.microsoft.com/wiki/contents/articles/30962.getting-started-with-cloud-app-discovery.aspx) 
* For security and privacy considerations, see [Cloud App Discovery Security and Privacy Considerations](active-directory-cloudappdiscovery-security-and-privacy-considerations.md) 
* For information about deploying the Cloud App Discovery agent in an enterprise environment with: 
 * Active Directory Group Policy Management, see  [Cloud App Discovery Group Policy Deployment Guide](http://social.technet.microsoft.com/wiki/contents/articles/30965.cloud-app-discovery-group-policy-deployment-guide.aspx) 
 * Microsoft System Center Configuration Manager, see [Cloud App Discovery System Center Deployment Guide](http://social.technet.microsoft.com/wiki/contents/articles/30968.cloud-app-discovery-system-center-deployment-guide.aspx) 
 * Proxy servers with custom ports, see [Cloud App Discovery Registry Settings for Proxy Servers with Custom Ports](active-directory-cloudappdiscovery-registry-settings-for-proxy-services.md) 





**Additional Resources**


* [Cloud App Discovery - Agent Changelog ](http://social.technet.microsoft.com/wiki/contents/articles/24616.cloud-app-discovery-agent-changelog.aspx)
* [Cloud App Discovery - Frequently Asked Questions](http://social.technet.microsoft.com/wiki/contents/articles/24037.cloud-app-discovery-frequently-asked-questions.aspx)


