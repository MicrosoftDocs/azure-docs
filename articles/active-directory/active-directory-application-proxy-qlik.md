---
title: Azure AD App Proxy and Qlik Sense| Microsoft Docs
description:  Turn on Application Proxy in the Azure  portal, and install the Connectors for the reverse proxy.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.topic: article
ms.date: 03/20/2018
ms.author: markvi
ms.reviewer: harshja
ms.custom: it-pro

---
# Application Proxy and Qlik Sense 
Azure Active Directory Application Proxy and Qlik Sense have partnered together to ensure you are easily able to use Application Proxy to provide remote access for your Qlik Sense deployment.  

## Prerequisites 
The remainder of this scenario assumes you done the following:
 
- Configured [Qlik Sense](https://help.qlik.com/sense/1.1/Content/Introduction.htm). 
- Installed an Application Proxy connector 

## Install an Application Proxy connector 
If you already have Application Proxy enabled, and have a connector installed, you can skip this section and move on to [Add your app to Azure AD with Application Proxy](application-proxy-ping-access.md). 

The Application Proxy connector is a Windows Server service that directs the traffic from your remote employees to your published apps. For more detailed installation instructions, see [Enable Application Proxy in the Azure portal](active-directory-application-proxy-enable.md). 


1. Sign in to the [Azure portal](https://portal.azure.com/) as a global administrator. 
2. Select Azure Active Directory > Application proxy. 
3. Select Download Connector to start the Application Proxy connector download. Follow the installation instructions. 
 
>[!NOTE]
>Downloading the connector should automatically enable Application Proxy for your directory, but if not you can select **Enable Application Proxy**. 
 
## Publish your applications in Azure 
To publish QlikSense, you will need to publish two applications in Azure.  

### Application #1: 
Follow these steps to publish your app. For a more detailed walkthrough of steps 1-8, see [Publish applications using Azure AD Application Proxy](application-proxy-publish-azure-portal.md). 


1. If you didn't in the last section, sign in to the Azure portal as a global administrator. 
2. Select **Azure Active Directory** > **Enterprise applications**. 
3. Select **Add** at the top of the blade. 
4. Select **On-premises application**. 
5.       Fill out the required fields with information about your new app. Use the following guidance for the settings: 
	- **Internal URL**: This application should have an internal URL that is the QlikSense URL itself. For example, **https&#58;//demo.qlikemm.com** 
	- **Pre-authentication method**: Azure Active Directory (Recommended but not required) 
1.       Select **Add** at the bottom of the blade. Your application is added, and the quick start menu opens. 
2.       In the quick start menu, select **Assign a user for testing**, and add at least one user to the application. Make sure this test account has access to the on-premises application. 
3.       Select **Assign** to save the test user assignment. 
4.       (Optional) On the app management blade, select Single sign-on. Choose **Kerberos Constrained Delegation** from the drop-down menu, and fill out the required fields based on your Qlik configuration. Select **Save**. 

### Application #2: 
Follow the same steps as for Application #1, with the following exceptions: 

**Step #5**: The Internal URL should now be the QlikSense URL with the authentication port used by the application. The default is **4244** for HTTPS, and 4248 for HTTP. Ex: **https&#58;//demo.qlik.com:4244** 
**Step #10:** Don’t set up SSO, and leave the **Single sign-on disabled **
 
 
## Testing 
Your application is now ready to test. Access the external URL you used to publish QlikSense in Application #1, and login as a user assigned to both applications.  

## Next Steps

- [Publish applications with Application Proxy](application-proxy-publish-azure-portal.md)
- [Working with Application Proxy connectors](active-directory-application-proxy-connectors-azure-portal.md).