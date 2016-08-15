<properties
	pageTitle="Azure AD federation compatibility list"
	description="This page has non-Microsoft identity providers that can be used to implement single sign-on."
	services="active-directory"
	documentationCenter=""
	authors="billmath"
	manager="femila"
	editor="curtand"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/08/2016"
	ms.author="billmath"/>

# Azure AD federation compatibility list
Azure Active Directory provides single-sign on and enhanced application access security for Office 365 and other Microsoft Online services for hybrid and cloud-only implementations without requiring any non-Microsoft solution. Office 365, like most of Microsoft’s Online services, is integrated with Azure Active Directory for directory services, authentication and authorization. Azure Active Directory also provides single sign-on to thousands of SaaS applications and on-premises web applications. Please see the Azure Active Directory application gallery for supported SaaS applications.

For organizations that have invested in non-Microsoft federation solutions, this topic contains guidance for configuring single sign-on for their Windows Server Active Directory users with Microsoft Online services by using non-Microsoft identity providers from the “Azure Active Directory federation compatibility list” below. 


![](./media/active-directory-aadconnect-federation-compatibility/oxford2.jpg)   
[Oxford Computer Group](http://oxfordcomputergroup.com/), a third-party, on behalf of Microsoft, tested these single sign-on experiences using non-Microsoft identity providers against a set of use cases common with Azure Active Directory.

For information on how you can get your third-party identity provider listed here, contact Oxford Computer Group at [idp@oxfordcomputergroup.com](mailto:idp@oxfordcomputergroup.com).

>[AZURE.IMPORTANT] Oxford Computer Group tested only the federation functionality of these single sign-on scenarios. Oxford Computer Group did not perform any testing of the synchronization, two-factor authentication, etc. components of these single sign-on scenarios.

>Use of Sign-in by Alternate ID to UPN is also not tested in this program.



- [Azure Active Directory](#azure-active-directory)
- [Optimal IDM Virtual Identity Server Federation Services](#optimal-idm-virtual-identity-server-federation-services) 
- [PingFederate 6.11](#pingfederate-611) 
- [PingFederate 7.2](#pingfederate-72) 
- [PingFederate 8.x](#pingfederate-8x)
- [Centrify](#centrify) 
- [IBM Tivoli Federated Identity Manager 6.2.2](#ibm-tivoli-federated-identity-manager-622) 
- [SecureAuth IdP 7.2.0](#secureauth-idp-720) 
- [CA SiteMinder 12.52](#ca-siteminder-1252) 
- [RadiantOne CFS 3.0](#radiantone-cfs-30) 
- [Okta](#okta) 
- [OneLogin](#onelogin) 
- [NetIQ Access Manager 4.0.1](#netiq-access-manager-401) 
- [BIG-IP with Access Policy Manager BIG-IP ver. 11.3x – 11.6x](#big-ip-with-access-policy-manager-big-ip-ver-113x-116x) 
- [VMware  Workspace Portal version 2.1](#vmware-workspace-portal-version-21) 
- [Sign&go 5.3](#signampgo-53) 
- [IceWall Federation Version 3.0](#icewall-federation-version-30) 
- [CA Secure Cloud](#ca-secure-cloud) 
- [Dell One Identity Cloud Access Manager v7.1](#dell-one-identity-cloud-access-manager-v71) 
- [AuthAnvil Single Sign On 4.5](#authavil-single-sign-on-45) 

>[AZURE.IMPORTANT] Since these are third-party products, Microsoft does not provide support for the deployment, configuration, troubleshooting, best practices, etc. issues and questions regarding these identity providers. For support and questions regarding these identity providers, contact the supported third-parties directly.

>These third-party identity providers were tested for interoperability with Microsoft cloud services using WS-Federation and WS-Trust protocols only. Testing did not include using the SAML protocol.

## Azure Active Directory 
Azure Active Directory can authenticate users by federating with your on-premises Active-Directory or without an on-premises federation server through the use of password sync. 

The following is the scenario support matrix for this sign-on experience: 


| Client |Support  |Exceptions|
| --------- | --------- |--------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |None|
| Rich client applications such as Lync, Office Subscription, CRM |  Supported |None|
| Email-rich clients such as Outlook and ActiveSync |  Supported |None|
|Modern Applications using ADAL such as Office 2016| Supported|None|

For more information about using Azure Active Directory with AD FS see [Active Directory Federation Services (ADFS)](active-directory-aadconnect-get-started-custom.md#configuring-federation-with-ad-fs)

For more information about using Azure Active Directory with Password sync see [Azure AD Connect](active-directory-aadconnect.md).


## Optimal IDM Virtual Identity Server Federation Services 
Optimal IDM Virtual Identity Server Federation Services can authenticate users that reside in customers’ on-premises Active Directories.

The following is the scenario support matrix this single sign-on experience:


| Client |Support  |Exceptions|
| --------- | --------- |--------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |None|
| Rich client applications such as Lync, Office Subscription, CRM |  Supported |Integrated Windows Authentication|
| Email-rich clients such as Outlook and ActiveSync |  Supported |For more information about client access polices see [Limiting Access to Office 365 Services Based on the Location of the Client.](https://technet.microsoft.com/library/hh526961.aspx)|



## PingFederate 6.11 

PingFederate 6.11 implements the widely used WS Federation identity standard to provide a single sign-on and attribute exchange framework.

The following is the scenario support matrix for this single sign-on experience:


| Client |Support  |Exceptions|
| --------- | --------- |--------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |None|
| Rich client applications such as Lync, Office Subscription, CRM |  Supported |None (earlier versions must upgrade to 6.11|
| Email-rich clients such as Outlook and ActiveSync |  Supported |None|

For the PingFederate instructions on how to configure this STS to provide the single sign-on experience to your Active Directory users, download the pdf [here.](http://go.microsoft.com/fwlink/?LinkID=266321)

## PingFederate 7.2 
PingFederate 7.2 implements the widely used WS Federation/WS-Trust identity standard to provide a single sign-on and attribute exchange framework.

The following is the scenario support matrix for this single sign-on experience:


| Client |Support  |Exceptions|
| --------- | --------- |--------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |None|
| Rich client applications such as Lync, Office Subscription, CRM |  Supported |None|
| Email-rich clients such as Outlook and ActiveSync |  Supported |None|

For the PingFederate instructions on how to configure this STS to provide the single sign-on experience to your Active Directory users, see [here.](http://documentation.pingidentity.com/display/PF72/PingFederate+7.2)

## PingFederate 8.x 
PingFederate 8.x implements the widely used WS Federation/WS-Trust identity standard to provide a single sign-on and attribute exchange framework.

The following is the scenario support matrix for this single sign-on experience:


| Client |Support  |Exceptions|
| --------- | --------- |--------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |None|
| Rich client applications such as Lync, Office Subscription, CRM |  Supported |None|
| Email-rich clients such as Outlook and ActiveSync |  Supported |None|

For the PingFederate instructions on how to configure this STS to provide the single sign-on experience to your Active Directory users, see [here.](http://documentation.pingidentity.com/display/PFS/SSO+to+Office+365+Introduction)

## Centrify 
Centrify helps provide a federated single sign-on experience for Office 365 without the requirement of hosting an on-premises Federation server.

The following is the scenario support matrix for this single sign-on experience:


| Client |Support  |Exceptions|
| --------- | --------- |--------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |None|
| Rich client applications such as Lync, Office Subscription, CRM |  Supported |None|
| Email-rich clients such as Outlook and ActiveSync |  Supported |Client Access Control is not supported 

For more information about Centrify, see [here.](http://www.centrify.com/cloud/apps/single-sign-on-for-office-365.asp)|

## IBM Tivoli Federated Identity Manager 6.2.2 
IBM Tivoli Federated Identity Manager 6.2.2 with IBM Security Access Manager for Microsoft Applications 1.4 implements the widely used WS Federation/WS-Trust identity standard to provide a single sign-on and attribute exchange framework.

The following is the scenario support matrix for this single sign-on experience: 

| Client |Support  |Exceptions|
| --------- | --------- |--------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |None|
| Rich client applications such as Lync, Office Subscription, CRM |  Supported |None|
| Email-rich clients such as Outlook and ActiveSync |  Supported |None|

For more information about IBM Tivoli Federated Identity Manager, see [IBM Security Access Manager for Microsoft Applications.](http://www-01.ibm.com/support/docview.wss?uid=swg24029517)

## SecureAuth IdP 7.2.0 
SecureAuth IdP 7.2.0 implements the widely used WS Federation/WS-Trust identity standard to provide a single sign-on experience and attribute exchange framework.

The following is the scenario support matrix for this single sign-on experience: 

| Client |Support  |Exceptions|
| --------- | --------- |--------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |None|
| Rich client applications such as Lync, Office Subscription, CRM |  Supported |None|
| Email-rich clients such as Outlook and ActiveSync |  Supported |None|

For more information about SecureAuth, see [SecureAuth IdP](http://go.microsoft.com/?linkid=9845293).

## CA SiteMinder 12.52 
CA SiteMinder Federation 12.52 implements the widely used WS Federation/WS-Trust identity standard to provide a single sign-on and attribute exchange framework.

The following is the scenario support matrix for this single sign-on experience: 

| Client |Support  |Exceptions|
| --------- | --------- |--------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |Integrated Windows Authentication|
| Rich client applications such as Lync, Office Subscription, CRM |  Supported |Integrated Windows Authentication|
| Email-rich clients such as Outlook and ActiveSync |  Supported |None|

For more information about CA SiteMinder, see [CA SiteMinder Federation.](http://www.ca.com/us/products/ca-single-sign-on.html) 

## RadiantOne CFS 3.0 
RadiantOne Cloud Federation Service (CFS) 3.0 implements the widely used WS Federation/WS-Trust identity standard to provide a single sign-on and attribute exchange framework.

The following is the scenario support matrix for this single sign-on experience: 

| Client |Support  |Exceptions|
| --------- | --------- |--------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |None|
| Rich client applications such as Lync, Office Subscription, CRM |  Supported |Integrated Windows Authentication|
| Email-rich clients such as Outlook and ActiveSync |  Supported |None|

For more information about RadiantOne CFS, see [RadiantOne CFS.](http://www.radiantlogic.com/products/radiantone-cfs/)


## Okta 
Okta implements the widely used WS Federation/WS-Trust identity standard to provide a single sign-on and attribute exchange framework.

The following is the scenario support matrix for this single sign-on experience: 


| Client |Support  |Exceptions|
| --------- | --------- |--------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |Integrated Windows Authentication requires setup of additional web server and Okta application.|
| Rich client applications such as Lync, Office Subscription, CRM |  Supported |Integrated Windows Authentication|
| Email-rich clients such as Outlook and ActiveSync |  Supported |None|

For more information about Okta, see [Okta.](https://www.okta.com/)
 
## OneLogin 
OneLogin as tested in May 2014 implements the widely used WS Federation/WS-Trust identity standard to provide a single sign-on and attribute exchange framework.

The following is the scenario support matrix for this single sign-on experience: 

| Client |Support  |Exceptions|
| --------- | --------- |--------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |Integrated Windows Authentication|
| Rich client applications such as Lync, Office Subscription, CRM |  Supported |Integrated Windows Authentication|
| Email-rich clients such as Outlook and ActiveSync |  Supported |None|

For more information about OneLogin, see [OneLogin.](https://www.onelogin.com/)

## NetIQ Access Manager 4.0.1 
NetIQ Access Manager 4.0.1 implements the widely used WS Federation/WS-Trust identity standard to provide a single sign-on and attribute exchange framework.

The following is the scenario support matrix for this single sign-on experience:

| Client |Support  |Exceptions|
| --------- | --------- |--------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |*Kerberos Contracts supported|
| Rich client applications such as Lync, Office Subscription, CRM |  Supported |Integrated Windows Authentication is not supported|
| Email-rich clients such as Outlook and ActiveSync |  Supported |None|

*NetIQ support Kerberos authentication via configuration of a Kerberos Contract.  For assistance with this configuration, please contact NetIQ or view the setup guide. For more information about NetIQ Access Manager, see [NetIQ Access Manager.](https://www.netiq.com/documentation/netiqaccessmanager4/identityserverhelp/data/b12iqp0m.html)

## BIG-IP with Access Policy Manager BIG-IP ver. 11.3x – 11.6x 
The BIG-IP with Access Policy Manager, (APM) BIG-IP ver. 11.3x – 11.6x implements the widely used SAML identity standard to provide a single sign-on experience and attribute exchange framework.

The following is the scenario support matrix for this single sign-on experience: 

| Client |Support  |Exceptions|
| --------- | --------- |--------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |None|
| Rich client applications such as Lync, Office Subscription, CRM |  Not Supported |Not Supported|
| Email-rich clients such as Outlook and ActiveSync |  Supported |None|

For more information about BIG-IP Access Policy Manager, see [BIG-IP Access Policy Manager.](https://f5.com/products/modules/access-policy-manager) 

For the BIG-IP Access Policy Manager instructions on how to configure this STS to provide the single sign-on experience to your Active Directory Users, download the pdf [here.](http://www.f5.com/pdf/deployment-guides/microsoft-office-365-idp-dg.pdf)

## VMware  Workspace Portal version 2.1 
VMware  Workspace Portal version 2.1 implements the widely used WS Federation/WS-Trust identity standard to provide a single sign-on and attribute exchange framework.

The following is the scenario support matrix for this single sign-on experience:

| Client |Support  |Exceptions|
| --------- | --------- |--------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |Integrated Windows Authentication is not supported|
| Rich client applications such as Lync, Office Subscription, CRM | Supported |Integrated Windows Authentication is not supported|
| Email-rich clients such as Outlook and ActiveSync |  Supported |None|

For more information about VMware  Workspace Portal version 2.1, download the pdf [here.](http://pubs.vmware.com/workspace-portal-21/topic/com.vmware.ICbase/PDF/workspace-portal-21-resource.pdf)

## Sign&go 5.3 
Sign&go 5.3 implements the widely used WS Federation/WS-Trust identity standard to provide a single sign-on and attribute exchange framework.

The following is the scenario support matrix for this single sign-on experience:

| Client |Support  |Exceptions|
| --------- | --------- |--------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |Kerberos Contracts supported |
| Rich client applications such as Lync, Office Subscription, CRM | Supported |None|
| Email-rich clients such as Outlook and ActiveSync |  Supported |None|


Sign&go 5.3 supports Kerberos authentication via configuration of a Kerberos Contract.  For assistance with this configuration, please contact Ilex or view the setup guide [here.](http://www.ilex-international.com/docs/sign&go_wsfederation_en.pdf)


## IceWall Federation Version 3.0 
IceWall Federation Version 3.0 implements the widely used WS Federation/WS-Trust identity standard to provide a single sign-on and attribute exchange framework.

The following is the scenario support matrix for this single sign-on experience:

| Client |Support  |Exceptions|
| --------- | --------- |--------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |Integrated Windows Authentication is not supported|
| Rich client applications such as Lync, Office Subscription, CRM | Supported |Integrated Windows Authentication is not supported|
| Email-rich clients such as Outlook and ActiveSync |  Supported |None|

For more information about IceWall Federation, see [here](http://h50146.www5.hp.com/products/software/security/icewall/eng/federation/) and [here.](http://h50146.www5.hp.com/products/software/security/icewall/federation/office365.html)

## CA Secure Cloud 

CA Secure Cloud implements the widely used WS Federation/WS-Trust identity standard to provide a single sign-on and attribute exchange framework.

The following is the scenario support matrix for this single sign-on experience:

| Client |Support  |Exceptions|
| --------- | --------- |--------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |Integrated Windows Authentication is not supported|
| Rich client applications such as Lync, Office Subscription, CRM | Supported |Integrated Windows Authentication is not supported|
| Email-rich clients such as Outlook and ActiveSync |  Supported |None|

For more information about CA Secure Cloud, see [CA Secure Cloud.](http://www.ca.com/us/products/security-as-a-service.aspx)

## Dell One Identity Cloud Access Manager v7.1 
Dell One Identity Cloud Access Manager implements the widely used WS Federation/WS-Trust identity standard to provide a single sign-on and attribute exchange framework.

The following is the scenario support matrix for this single sign-on experience:

| Client |Support  |Exceptions|
| --------- | --------- |--------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |None|
| Rich client applications such as Lync, Office Subscription, CRM |  Supported |None|
| Email-rich clients such as Outlook and ActiveSync |  Supported |None|

For more information about Dell One Identity Cloud Access Manager, see [Dell One Identity Cloud Access Manager.](http://software.dell.com/products/cloud-access-manager)

 For the instructions on how to configure this STS to provide the single sign-on experience to your Office 365 Users, see [Configure Office 365 Users.](http://documents.software.dell.com/dell-one-identity-cloud-access-manager/7.1/how-to-configure-microsoft-office-365) 

## AuthAnvil Single Sign On 4.5 
AuthAnvil Single Sign On 4.5 implements the widely used WS Federation/WS-Trust identity standard to provide a single sign-on and attribute exchange framework.

The following is the scenario support matrix for this single sign-on experience:

| Client |Support  |Exceptions|
| --------- | --------- |--------- |
| Web-based clients such as Exchange Web Access and SharePoint Online | Supported |Integrated Windows Authentication is not supported|
| Rich client applications such as Lync, Office Subscription, CRM | Supported |Integrated Windows Authentication is not supported|
| Email-rich clients such as Outlook and ActiveSync |  Supported |None|


For more information, see [AuthAnvil Single Sign On.](https://help.scorpionsoft.com/entries/26538603-How-can-I-Configure-Single-Sign-On-for-Office-365-)
