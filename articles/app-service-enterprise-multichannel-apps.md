<properties 
	pageTitle="Enterprise Multichannel Apps" 
	description="Overview of how a multichannel app spans on-premises resources and cloud based software services." 
	services="app-service" 
	documentationCenter="na" 
	authors="stefsch" 
	writer="tdykstra" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/23/2015" 
	ms.author="stefsch"/>

# Create multi-channel applications for the enterprise

## Overview

Enterprise multichannel apps present data to customers using multiple technologies.  Enterprise web, mobile, and API consumers all retrieve and process information from a variety of sources.  These sources span internal systems running on-premises as well
as cloud-based services.  

Enterprise applications also have the requirement for secure access, with employees and business partners connecting to data using secure identities under direct control of the enterprise.

Enterprise applications running on Azure App Service (AAS) can provide all of these capabilities.  

The example employee travel application shown below shows an enterprise multichannel application secured via Azure Active Directory (AAD) that integrates with both on-premises resources as well as Software-as-a-Service (SaaS) services such as Office 365 and 
Salesforce.

## <a name="acceptablefiles"></a>Controlling Access with Azure Active Directory

Users of the travel application must first authenticate against a corporate Active Directory.  A few steps were taken to configure the application to use Azure Active Directory (AAD):

* An Azure Active Directory was created for the enterprise.
* The enterprise's on-premises Active Directory was federated with the Azure Active Directory.
* Finally, the application was registered with AAD using the easy AAD integration feature of Azure App Service. 

The end result is that the application prompts users to login against AAD (and by extension, the corporate AD).
	
![AAD Login][AADLogin]

For more information on setting up AAS integration with AAD, see [AAS Integration with AAD][AASIntegrationwithAAD]. 

## <a name="acceptablefiles"></a>Accessing On-premises Resources

Once a user is logged in against AAD, they see a list of planned corporate travel.  Since the web application is running in Microsoft Azure, it needs a way to access the on-premises SQL Server which contains this information.

![Data from On-premises Sql Server][DatafromOnpremisesSqlServer]

The application is configured with the point-to-site VNET integration feature.  This enables the application to use standard data access logic (in this case Entity Framework) to transparently access a remote SQL Server running inside of the corporation's network.

For more information on point-to-site VNET integration, see [VNET Integration][VNETIntegration].

## <a name="acceptablefiles"></a>Integration with Office 365

Each time an employee creates a travel record, the web application creates a travel request in a SharePoint Online list. There is a link in the application that employees can use to easily access the Sharepoint list:

![SharePoint List Link][SharepointListLink]

Clicking the link will automatically navigate to the SharePoint list.  Because employees are logged in against their corporate AAD, they are transparently authenticated against Office 365 using the security token issued by AAD.

![SharePoint List][SharepointList]

The web application also creates a travel document in a Sharepoint Online document library.

![SharePoint Document Library][SharepointDocumentLibrary]

The assets created in SharePoint Online allow the web application to leverage capabilities in Office 365.  For example a decision/approval workflow could be triggered each time an item is created in the Sharepoint list.

For more information on Office 365 integration, see [Office 365 Integration][Office365Integration]

## <a name="acceptablefiles"></a>Integration with SaaS Services

Companies today use a variety of SaaS services, and need to interact with SaaS data from other applications.  The travel application
shows one example of this scenario.  It updates customer account information in Salesforce each time an employee plans travel to a customer account.

![Salesforce Integration][SalesforceIntegration]

The corporation's Salesforce account is set up with AAD to allow transparent authentication against Salesforce using AAD credentials. As a result, once employees are logged into the travel application using AAD, the application can read and write data stored in Salesforce.

For more information on SaaS integration, see [SaaS Integration][SaaSIntegration]

## <a name="NextSteps"></a>Next Steps

For more information, see [Azure Application Services][AzureApplicationServices]
 
[AASIntegrationwithAAD]:http://azure.microsoft.com/blog/2014/11/13/azure-websites-authentication-authorization/
[VNETIntegration]:http://azure.microsoft.com/blog/2014/09/15/azure-websites-virtual-network-integration/ 
[Office365Integration]: app-service-cloud-app-platform.md
[SaaSIntegration]: app-service-cloud-app-platform.md
[AzureApplicationServices]: app-service-cloud-app-platform.md

[AADLogin]: ./media/app-service-enterprise-multichannel-apps/01aAADLogin.png
[DatafromOnpremisesSqlServer]: ./media/app-service-enterprise-multichannel-apps/02aDatafromOnpremisesSqlServer.png
[SharepointListLink]: ./media/app-service-enterprise-multichannel-apps/03aSharepointListLink.png
[SharepointList]: ./media/app-service-enterprise-multichannel-apps/04aSharepointList.png
[SharepointDocumentLibrary]: ./media/app-service-enterprise-multichannel-apps/05aSharepointDocumentLibrary.png
[SalesforceIntegration]: ./media/app-service-enterprise-multichannel-apps/06aSalesforceIntegration.png