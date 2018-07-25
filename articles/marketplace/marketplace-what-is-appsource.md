---
title: What is AppSource and how does it work with Azure
description: Overview of AppSource, which enables Microsoft partners to make their technology and services discoverable to customers through a Microsoft-supported online storefront.
services: Marketplace, AppSource, Compute, Storage, Networking, Security, SaaS
documentationcenter:
author: ellacroi
manager: 
editor: v-brela

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 04/12/2018
ms.author: ellacroi

---



# What is AppSource
AppSource enables Microsoft partners to make their technology and services discoverable to customers through a Microsoft-supported online storefront. 
As an AppSource publisher, you can engage business users on AppSource to find, try, and get line-of-business SaaS applications as well as implementation services to help drive business results and reduce time-to-value: 

| Customer Need       | AppSource          | 
|:---------------------------------------- |:----------------------------------------------------- |
| **Looking for business solutions that work with Microsoft products they already use**    | Allows partners to use third-party applications and services to extend Microsoft's cloud applications and technologies. |
| **Ability to easily find the right the right solution or implementation service.**     | Provides a one-stop shop to discover, trial, and get applications and services, add-ins, and many more. |
| **Industry-specific line-of-business solution to address their specific business challenges**   | Provides finished end-to-end industry solutions to help address specific requirements across many industries. |
| **Apps to help improve productivity, efficiency, and business insights**       | Provides apps for line of business, including customer service, HR, operations, and many more. |
| **Experienced implementation partner to help adapt apps to their unique situation**     | Provide, a catalog of consulting services offerings for solutions based on Dynamics 365, Power BI, PowerApps, and 3rd-party apps that are available on AppSource to help business users find consulting services designed to deliver predictable outcomes. |

## AppSource Publishing
Through AppSource, you can list an application or consulting offer that assists in meeting customer needs while using Microsoft products such as Office 365, Dynamics 365, Power BI, and Power Apps. The following offerings are available in the AppSource Marketplace: 
*   **Dynamics 365 for Finance and Operations**: An enterprise resource planning (ERP) solution. The differentiated solutions are the Enterprise Edition for medium-to-large companies and the Business Edition for small and medium businesses.
*   **Dynamics 365 for Customer Engagement**: A customer relationship management (CRM) solution that includes Sales, Customer Service, Field Service, and Project Service Automation applications.
*   **Dynamics NAV Managed Service**: Microsoft **Dynamics NAV**   is an enterprise resource planning (ERP) software suite for midsize organizations. The service offers specialized functionality for manufacturing, distribution, government, retail, and other industries.
*   **Power BI**: A business analytics visualization solution.
*   **Consulting Offers**: Services provided by Microsoft partners to help customers understand, try out, and implement specialized technology solutions.
*   **Cortana Intelligence**: The Cortana Intelligence Suite is a collection of independent, but fully-integrated data and analytic platform tools offered by Azure.
*   **Office 365**: The modern workplace in the cloud. Collaborate for free with Microsoft Word, PowerPoint, Excel, and OneNote.

### Office 365
Applications for Office are now available in AppSource! Review the [publishing process and guidelines]( https://docs.microsoft.com/office/dev/store/submit-to-the-office-store "Office 365 - AppSource").

### Dynamics 365 for Finance and Operations
When building for Enterprise Edition, review the [publishing process and guidelines](https://docs.microsoft.com/dynamics365/unified-operations/dev-itpro/lcs-solutions/lcs-solutions-app-source "Dynamics 365 Enterprise Edition - AppSource").  

### Dynamics 365 for Customer Engagement
Review the [publishing process and guidelines](https://docs.microsoft.com/dynamics365/customer-engagement/developer/publish-app-appsource "Dynamics 365 - AppSource").

### Power BI
Create custom visuals and make them available via AppSource. Review the [publishing process and guidelines](https://docs.microsoft.com/power-bi/developer/office-store "Power BI - AppSource").

### Consulting Offers
If you offer services to help customers facilitate digital transformation or implement a solution or application, then you can offer this service as a consulting offer on AppSource. 
[Review the guidelines and learn how to submit your offer](https://smp-cdn-prod.azureedge.net/documents/Microsoft%20AppSource%20Partner%20Listing%20Guidelines.pdf "AppSource - Partner Listing Guidelines").

### Cortana Intelligence
[Cortana Intelligence AppSource Publishing guide](https://docs.microsoft.com/azure/machine-learning/team-data-science-process/cortana-intelligence-appsource-publishing-guide "Cortana Intelligence AppSource - Publishing guide")

## Azure Active Directory Integration
Some AppSource storefront applications are required to integrate with Azure Active Directory (Azure AD) to be published. Application integration with Azure AD is well documented; Microsoft provides multiple SDKs and additional resources to meet your requirements. 

| Offering name | Requires Azure AD Integration | Notes |
|:--- |:---:|:--- |
| Dynamics 365 for Operations | No | A license-based offering does not require Azure AD Integration |
| Dynamics 365 for Finance | No | A license-based offering does not require Azure AD Integration |
| Dynamics 365 for Customer Engagement | No | A license-based offering does not require Azure AD Integration |
| Dynamics NAV Managed Service | No | A license-based offering does not require Azure AD Integration |
| Power BI | No | A license-based offering does not require Azure AD Integration |
| Consulting Offers | No | Services are coordinated by the partner, not through a web experience |
| Cortana Intelligence | Yes | Azure AD is a best practice to ensure a seamless customer experience and drives the highest-quality leads |
| SaaS Apps (formerly Web Apps) | Preferred | Azure AD is a best practice to ensure a seamless customer experience and drives the highest-quality leads |
###### Table: AppSource offerings that require Azure Active Directory Integration

Initially, we recommend that **you set up a dedicated subscription for your Azure Marketplace publishing**\* enabling you to isolate your work from your other initiatives. Additionally, if you have not already installed the following tools, then we recommend that the following tools be added to your Development Environment: 
*   [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest "Azure - CLI")
*   [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview?view=azurermps-5.0.0 "PowerShell - Azure")
*   Review the available tools in the [Azure Developer Tools](https://azure.microsoft.com/tools/ "Azure - Developer Tools") page
*   [Visual Studio Code](https://code.visualstudio.com/ "Visual Studio Code - Main")

If you are getting started with Azure AD, then the following links are your best resources: 

**Documentation**
*   [Azure Active Directory developers guide](https://docs.microsoft.com/azure/active-directory/develop/active-directory-developers-guide "Azure AD - developers guide")
*   [Integrating with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/active-directory-how-to-integrate "Integrating - Azure AD")
*   [Integrating applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications "Integrating applications - Azure AD")
*   [Azure Roadmap - Security and Identity](https://azure.microsoft.com/roadmap/?category=security-identity "Azure Roadmap - Security and Identity")

**Videos**
*   [Azure Active Directory Authentication with Vittorio Bertocci](https://channel9.msdn.com/Shows/XamarinShow/Episode-27-Azure-Active-Directory-Authentication-with-Vittorio-Bertocci?term=azure%20active%20directory%20integration "Azure AD Authentication - Vittorio Bertocci")
*   [Azure Active Directory Identity Technical Briefing - Part 1 of 2](https://channel9.msdn.com/Blogs/MVP-Enterprise-Mobility/Azure-Active-Directory-Identity-Technical-Briefing-Part-1-of-2?term=azure%20active%20directory%20integration "Azure AD - Identity Technical Briefing 1/2")
*   [Azure Active Directory Identity Technical Briefing - Part 2 of 2](https://channel9.msdn.com/Blogs/MVP-Azure/Azure-Active-Directory-Identity-Technical-Briefing-Part-2-of-2?term=azure%20active%20directory%20integration "Azure AD - Identity Technical Briefing 2/2")
*   [Building Apps with Microsoft Azure Active Directory](https://channel9.msdn.com/Blogs/Windows-Development-for-the-Enterprise/Building-Apps-with-Microsoft-Azure-Active-Directory?term=azure%20active%20directory%20integration "Building Apps - Azure AD")
*   [Microsoft Azure Videos focused on Active Directory](https://azure.microsoft.com/resources/videos/index/?services=active-directory "Azure AD - Videos")

**Training**
*   [Microsoft Azure for IT Pros Content Series: Azure Active Directory](https://mva.microsoft.com/en-US/training-courses/microsoft-azure-for-it-pros-content-series-azure-active-directory-16754?l=N0e23wtxC_2106218965 "Microsoft Azure for IT Pros Content Series: Azure AD")

**Azure Active Directory Service Updates**
*   [Azure AD Service Updates](https://azure.microsoft.com/updates/?product=active-directory "Azure AD - Service Updates")

For support, the following links are good resources: 
*   MSDN Forms: [Azure Active Directory](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=WindowsAzureAD "Azure AD in the MSDN forums")
*   StackOverflow: [Azure Active Directory](https://stackoverflow.com/questions/tagged/azure-active-directory "Azure AD on stackoverflow")
