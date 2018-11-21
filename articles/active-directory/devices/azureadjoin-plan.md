---
title: How to plan your Azure Active Directory (Azure AD) join implementation | Microsoft Docs
description: Explains the steps that are required to implement Azure AD joined devices in your environment.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: mtillman
editor: ''

ms.component: devices
ms.assetid: 81d4461e-21c8-4fdd-9076-0e4991979f62
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/20/2018
ms.author: markvi
ms.reviewer: sandeo

---

# How to: Plan your Azure AD join implementation


Azure AD join allows you to join devices directly to Azure AD without the need to join to on-premises Active Directory while keeping your users productive and secure.  

This article assumes you have familiarity with Azure AD and [device states in Azure AD](overview.md). 

 

## Review your scenarios 

While Azure AD join is applicable to most scenarios in an organizational setting, there might be certain use cases where you might want to deploy Hybrid Azure AD join instead. Azure AD join is enterprise-ready for at-scale or scope deployments. 

 
Consider Azure AD join based on the following criteria for your organization:  

- You either plan or have majority of your Windows devices on Windows 10. 

- You plan to move to a cloud-driven deployment and management of Windows devices. 

- You have limited on-premises infrastructure or plan to reduce your on-premises footprint. 

- You do not have a heavy dependency on Group Policies to manage devices. 

- You do not have legacy applications that rely on Active Directory machine authentication. 

- All or selected users in your organization do not have to be on the corporate network to access necessary apps and resources.  

 

Review your scenarios based on the following assessment  

 

## Assess Infrastructure  

 

### Users 

If your users are created in on-premises Active Directory, they need to be synced to Azure AD via Azure AD Connect. To learn more about synchronizing users, see [What is Azure AD Connect?](https://docs.microsoft.com/azure/active-directory/hybrid/whatis-hybrid-identity#what-is-azure-ad-connect) 

If your users are created directly in Azure AD, no additional setup is required 

 

Alternate login IDs are not supported on Azure AD joined devices. Users should have a valid UPN in Azure AD.  

 

### Identity infrastructure 

Azure AD join works with both managed and federated environments.  

#### Managed environment 

A managed environment can be deployed either through Password Hash Sync or Pass through Authentication with Seamless Single Sign On. <read more here> 

#### Federated environment  

A federated environment should have an identity provider that supports both WS-Trust and WS-Fed protocols. WS-Fed is required to join a device to Azure AD and WS-Trust is required to sign in to an Azure AD joined device. So, if your identity provider does not support them, Azure AD join cannot work. 


#### Smartcards and certificate-based authentication 

 

Currently smartcards and certificate-based authentication are not supported in Azure AD, so they would not work on Azure AD joined devices 

 

### Devices 

 

#### Supported devices 

Azure AD join is exclusive to Windows 10 devices. It is not applicable to previous versions of Windows or other operating systems. If you still have Windows 7/8.1, you must upgrade to Windows 10 to deploy Azure AD join 

 

Recommendation: Always use the latest Windows 10 release for updated features 

 

### Applications & other resources 

We recommend you migrate your applications from on-premises to cloud for better user experience and access control. However, Azure AD joined devices can seamlessly provide access to both on-premises and cloud applications. For more information, see [How SSO to on-premises resources works on Azure AD joined devices](azuread-join-sso.md).  


Following are considerations for different type of applications and resources 

 

- **Cloud-based applications:** If an application is added to Azure AD app gallery, users get SSO through Azure AD joined devices. No additional configuration is required 

 

- **On-premises web applications:** If your apps are custom built and/or hosted on-premises, you need to add them to your browser’s trusted sites. This will enable Windows-integrated authentication to work and provide a no-prompt SSO experience to users. If you are using AD FS, see [Verify and manage single sign-on with AD FS](https://docs.microsoft.com/en-us/previous-versions/azure/azure-services/jj151809(v%3dazure.100)) for more information. Recommendation: Consider hosting in the cloud (for example, Azure) and integrating with Azure AD for a better experience. 

- **On-premises applications relying on legacy protocols:** Users get SSO from Azure AD joined devices if device has line of sight to the Domain controller. Recommendation: Deploy Azure AD App proxy to enable secure access for these applications. For more information, see [Why is Application Proxy a better solution?](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy#why-is-application-proxy-a-better-solution) 

- **On-premises network shares:** Users get SSO to their network shares from Azure AD joined devices when their device has connectivity to a Domain Controller. For more information, see [How SSO to on-premises resources works on Azure AD joined devices](azuread-join-sso.md).

 

- **Printers:** Deploy Hybrid cloud print for discovering printers from Azure AD joined devices. Alternatively, users can also use the printers’ UNC path to directly add them. Printers can't be automatically discovered in a cloud only environment. 

 

- **On-premises applications relying on machine authentication:** These applications are not supported on Azure AD joined devices. Recommendation: Consider retiring these applications and moving to their modern alternatives.  

 

### Device management  

 

Device management for Azure AD joined devices is primarily through an EMM platform (for example, Intune) and MDM CSPs. Windows 10 has in-built MDM agent that works with all compatible EMM solutions.  

 

Group policies are not supported on Azure AD joined devices as they are not connected to Active Directory.  

 

Evaluate MDM policy parity with Group policies using the [MDM Migration Analysis Tool [MMAT](https://channel9.msdn.com/Events/Ignite/Microsoft-Ignite-Orlando-2017/THR3002R). Review supported and unsupported policies to determine applicability of using an EMM solution instead of Group policies. For unsupported policies, consider:  

- Are the unsupported policies necessary for users or devices Azure AD join is being deployed to? 

- Are the unsupported policies applicable in a cloud driven deployment? 

 

If your EMM solution is not available through the Azure AD app gallery, you can add it following the process outlined in [Azure Active Directory integration with MDM](https://docs.microsoft.com/windows/client-management/mdm/azure-active-directory-integration-with-mdm).

 

Through comanagement, SCCM can be used to manage certain aspects of the devices while policies are delivered through your EMM platform. Microsoft Intune enables comanagement with SCCM. For more information, see [Co-management for Windows 10 devices](https://docs.microsoft.com/sccm/core/clients/manage/co-management-overview). If you are using an EMM product other than Intune, please check with your EMM provider on applicable co-management scenarios.  

 

There are two broad ways of managing Azure AD joined devices: 

 

- **MDM-only** - Device is exclusively managed by an EMM provider like Intune. All policies are delivered as part of the MDM enrollment process. For Azure AD Premium or EMS customers, MDM enrollment is automated as part of Azure AD join. 

- **Co-management** - Device is managed concurrently by the EMM provider and SCCM. In this approach, the SCCM agent is installed on an MDM-managed device to administer certain aspects. 

Recommendation: Consider MDM only management for Azure AD joined devices.  

 

## Configuration 

 

Azure AD join can be configured in the Azure AD portal based on some specific settings. Go to `Devices -> Device settings` and configure the following options:   

- Users may join devices to Azure AD: Set this to “All” or “Selected” based on the scope of your deployment.  

- Additional local administrators on Azure AD joined devices: Set to “Selected” and selects users who you want to add to the local administrators’ group on all Azure AD joined devices deployed in your organization. For more information, see [How to manage the local administrators group on Azure AD joined devices](assign-local-admin.md). 

- Require multi-factor Auth to join devices: Set to “Yes” if you require users to perform MFA while joining devices to Azure AD. For the user who joins device to Azure AD using MFA, the device becomes a 2nd factor. 

If you want to enable state roaming to Azure AD so that devices can sync their settings, see [What is enterprise state roaming?](enterprise-state-roaming-overview.md). We recommend enabling this setting even for Hybrid Azure AD joined devices 

### Deployment options 

 

Azure AD join can be deployed via three different approaches:  

- **Self-service in OOBE/Settings** - In the self-service mode, users go through the Azure AD join process either during Windows Out of Box Experience (OOBE) or from Windows Settings.  

- **Windows Autopilot** - Windows Autopilot enables pre-configuration of devices for a smoother experience in OOBE to perform Azure AD join.   

- **Bulk enrollment** - Bulk enrollment enables an administrator driven Azure AD join by using a bulk provisioning tool to configure devices.  


Here’s a comparison of these three approaches 

 
||Self-service setup|Windows Autopilot|Bulk enrollment|
|---|---|---|---|
|Require user interaction to set up|Yes|Yes|No|
|Require IT effort|No|Yes|Yes|
|Applicable flows|OOBE & Settings|OOBE only|OOBE only|
|Local admin rights to primary user|Yes, by default|Configurable|No|
|Require device OEM support|No|Yes|No|
|Supported versions|1511+|1709+|1703+|
 
Choose your deployment approach or approaches by reviewing the table above and reviewing the following considerations for adopting either approach:  

- Are your users tech savvy to go through the setup themselves? 

    - Self-service can work best for these users. Consider Windows Autopilot to enhance the user experience.  

- Are your users remote or within corporate premises? 

    - Self-service or Autopilot work best for remote users for a hassle-free setup. 
 
- Do you prefer a user driven or an admin-managed configuration? 

    - Bulk enrollment works better for admin driven deployment to set up devices before handing over to users.     

- Do you purchase devices from 1-2 OEMS, or do you have a wide distribution of OEM devices?  

    - If purchasing from limited OEMs who also support Autopilot, you can benefit from tighter integration with Autopilot. 
 

 


## Next steps

- [Device management](overview.md)

