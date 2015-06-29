<properties 
	pageTitle="Monitor your on-premises identity infrastructure in the cloud." 
	description="This is the Azure AD Connect Health page that describes what it is and why you would use it." 
	services="active-directory" 
	documentationCenter="" 
	authors="billmath" 
	manager="swadhwa" 
	editor="curtand"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/28/2015" 
	ms.author="billmath"/>

# Monitor your on-premises identity infrastructure in the cloud

Azure AD Connect Health helps you monitor and gain insight into your on-premises identity infrastructure. It offers you the ability to view alerts, performance, usage patterns, configuration settings, enables you to maintain a reliable connection to Office 365 and much more. This is accomplished using an agent that is installed on the targeted servers.  To learn more see [Azure AD Connect Health on MSDN.](https://msdn.microsoft.com/library/azure/dn906722.aspx)  

![What is Azure AD Connect Health](./media/active-directory-aadconnect-health/aadconnecthealth2.png)


This information is all presented in the Azure AD Connect Health portal.  Using the Azure AD Connect Health portal you can view alerts, performance monitoring, and usage analytics.  This information is presented all in one easy to use place so that you do not have to waste time digging for the information you need.

![What is Azure AD Connect Health](./media/active-directory-aadconnect-health/usage.png)

Future updates to Azure AD Connect Health will include additional monitoring and insight into other identity components and services such as Azure AD Connect Sync services. Thus providing you a single dash board through the lens of identity, enabling you to have an even more robust, healthy, and integrated environment that your users can take advantage of to increase their ability to get things done.

To find out more see [Azure AD Connect Health on MSDN.](https://msdn.microsoft.com/library/azure/dn906722.aspx)


![What is Azure AD Connect Health](./media/active-directory-aadconnect-health/logo1.png)




## Why use Azure AD Connect Health

Integrating your on-premises directories with Azure AD makes your users more productive by providing a common identity for accessing both cloud and on-premises resources. However, with this integration comes the challenges of ensuring that this environment is healthy so that users can reliably access resources both on-premises and in cloud from any device. Azure AD Connect Health provides an easy cloud based approach to monitor and gain insights into your on-premises identity infrastructure is used to access Office 365 or other Azure AD applications. It is as simple as installing an agent on each of your on-premises identity servers. 

Azure AD Connect Health for AD FS supports AD FS 2.0 in Windows Server 2008/2008 R2, AD FS in Windows Server 2012/2012R2. These also include any AD FS Proxy or Web Application Proxy servers that provide authentication support for extranet access. Azure AD Connect Health for AD FS provides the following set of key capabilities:

- View and take action on alerts for reliable access to AD FS protected applications including Azure AD
- Email notifications for critical alerts
- View performance data to determine capacity planning
- Detailed views of your AD FS login patterns to determine anomalies or establish baselines for capacity planning



----------------------------------------------------------------------------------------------------------
## Download the Azure AD Connect Health Agent

To get started using Azure AD Connect Health you can download the latest version of the agent here:  [Download Azure AD Connect Health Agent.](http://go.microsoft.com/fwlink/?LinkID=518973) Ensure that you’ve added the service from Marketplace before installing the agents.

----------------------------------------------------------------------------------------------------------





**Additional Resources**

* [Azure AD Connect Health on MSDN](https://msdn.microsoft.com/library/azure/dn906722.aspx)


 