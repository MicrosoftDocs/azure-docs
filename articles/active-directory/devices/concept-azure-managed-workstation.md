---
title: Why secure workstations are important - Azure Active Directory
description: Learn why organizations should create secure Azure-managed workstations

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: conceptual
ms.date: 05/28/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: frasim

# Customer intent: As an administrator, I want to provide staff with secured workstations to reduce the risk of breach due to misconfiguration or compromise.

ms.collection: M365-identity-device-management
---
# Building secure workstations

Secured isolated workstations are critically important for the security of sensitive roles like administrators, developers, and operators of critical services. Many other security controls and assurances will fail or have no effect if the underlying client workstation security has been compromised.

This document explains what it takes to build a secure client workstation with detailed step by step instructions, including how to set up starting security controls. This type of workstations at times is called a privileged access workstation (PAW), which this reference is used, and built upon. The guidance however looks to cloud-based technology to manage the service, and introduces security capabilities introduced starting in Windows 10RS5, Microsoft Defender ATP, Azure Active Directory, and Intune.

## Why securing workstation access is important

The rapid adoption of cloud services and the ability to work from anywhere has created a new method for exploitation. Attackers are exploiting weak security controls on devices where administrators work and are able to gain access to privileged resources.

As documented in the [Verizon Threat report](https://enterprise.verizon.com/resources/reports/dbir/), and [Security Intelligence Report](https://aka.ms/sir) privileged misuse, and supply chain attacks are among the top five mechanisms used to breach organizations, and the second most commonly detected tactic in incidents reported in 2018.

Most attackers follow the path below:

* Start with reconnaissance, often specific to an industry, to find a way in
* Analyze collected information to identify the best means to gain access (Infiltration) of a perceived low value workstation
* Persistence and look at means to move [laterally](https://en.wikipedia.org/wiki/Network_Lateral_Movement)
* Exfiltrate confidential and sensitive data

Attackers frequently infiltrate devices that seem low risk or undervalued for reconnaissance. These vulnerable devices are then used to locate an opportunity for lateral movement, find administrative users, and devices and identify high valued data, to  successfully exfiltrate information once they gain these privileged user roles.

![Typical compromise pattern](./media/concept-azure-managed-workstation/typical-timeline.png)

This document provides a solution to help protect your computing devices by isolating management and services to help protect against lateral movement or attacks from less valuable productivity devices. The design helps reduce the ability to successfully execute a breach by breaking the chain prior to infiltration of the device used to manage or access sensitive cloud resources. The solution described will utilize native Azure services that are part of the Microsoft 365 Enterprise stack including:

* Intune for device management, including application and URL whitelisting
* Autopilot for device setup and deployment and refresh 
* Azure AD for user management, conditional access, and multi-factor authentication
* Windows 10 (current version) for device health attestation and user experience
* Microsoft Defender Advanced Threat Protection (ATP) for endpoint protection, detection, and response with cloud management
* Azure AD PIM for managing authorization, including Just In Time (JIT) privileged access to resources

## Who benefit from using a secure workstation

All users, and operators benefit from using a secure workstation. 
An attacker who compromises a PC or device can do several things including impersonate all cached accounts, and use credentials, and tokens used on that device while they are logged on. This risk makes securing the devices used for any privileged role including administrative rights so important as devices where a privileged account is used are targets for lateral movement and privilege escalation attacks. These accounts may be used for a variety of assets such as:

* Administrators of on-premises and cloud-based systems
* Developer workstations for critical systems
* Social media accounts administrator with high exposure
* Highly sensitive workstations like SWIFT payment terminals
* Workstations handling trade secrets

Microsoft recommends implementing elevated security controls for privileged workstations where these accounts are used to reduce risk. Additional guidance can be found in the [Azure Active Directory feature deployment guide](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-deployment-checklist-p2), [Office 365 roadmap](https://aka.ms/o365secroadmap), and [Securing Privileged Access roadmap](https://aka.ms/sparoadmap)).

## Why dedicated workstations

While it is possible to add security to an existing device, it is better to start with a secure foundation. Starting with a known good device and a set of known security controls puts your organization in the best position to maintain that increased level of security. With the ever growing number of attack vectors allowed by casual email and web browsing, it is increasingly hard to ensure a device can be trusted. This guide works under the assumption a dedicated workstation separated from standard productivity, browsing, and email tasks are completed. Removal of productivity, web browsing, and email from a device can have a negative impact on productivity, but this safeguard is typically acceptable for scenarios where the job tasks don’t explicitly require it and risk of a security incident is high.

> [!NOTE]
> Web browsing here refers to general access to arbitrary websites, which is a high risk distinctly different from using a web browser to access a small number of well-known administrative websites for services like Azure, Office 365, other cloud providers, and SaaS applications.

Containment strategies provide increased security assurances by increasing the number and type of controls an adversary has to overcome in order to access sensitive assets. The model developed here provides containment of administrative privileges to specific devices using a tiered privilege model.

## Supply chain management

Essential to a secured workstation is a supply chain solution where the workstation you use is trusted, a 'root of trust'. This solution will address the root of trust using the [Microsoft Autopilot](https://docs.microsoft.com/windows/deployment/windows-autopilot/windows-autopilot) technology. For a secured workstation Microsoft Autopilot provides the ability to leverage Microsoft OEM-optimized Windows 10 devices that provide a known good state from the manufacturer. Instead of reimaging a device that may not be trusted, Microsoft Autopilot can transform a Windows device into a “business-ready” state, applying settings and policies, installing apps, and even changing the edition of Windows 10 being used (for example, from Windows 10 Pro to Windows 10 Enterprise, to support advanced features).

![Secure workstation Levels](./media/concept-azure-managed-workstation/supplychain.png)

## Device roles and profiles

Throughout the guidance, multiple security profiles and roles will be addressed to achieve a more secure solution for users, developers, and IT operations staff. These profiles have been aligned to support common users in organizations that can benefit from an enhanced, or secure workstation, while balancing usability and risk. The guidance will provide configuration of settings based on industry accepted standards. This guidance is used to illustrate a method in hardening Windows 10 and reducing the risks associated with device or user compromise using policy and technology to help manage security features and risks.
![Secure workstation Levels](./media/concept-azure-managed-workstation/seccon-levels.png)

* **Low Security** – A managed standard workstation provides a good starting point for most home, and small business use. These devices are Azure AD registered and Intune managed. The profile permits users to run any applications and browse any website. An antimalware solution like [Microsoft Defender](https://www.microsoft.com/windows/comprehensive-security) should be enabled.
* **Enhanced Security** – Is an entry level protected solution, good for home users, small business users, as well as general developers.
   * The Enhanced workstation provides a policy based means to enhance the security of the Low Security profile. This profile allows for a secure means to work with customer data, and be able to use productivity tools such as checking email and web browsing. An Enhanced workstation can be used to audit user behavior, and profile use of a workstation by enabling audit policies, and logging to Intune. In this profile, the workstation will enable security controls and policies described in the content, and deployed in the Enhanced Workstation - Windows10 (1809) script. The deployment also takes advantage of advanced malware protection using [Advanced Threat Protection (ATP)](https://docs.microsoft.com/office365/securitycompliance/office-365-atp)
* **High Security** – The most effective means to reduce the attack surface of a workstation is to remove the ability to self-administer the workstation. Removing local administrative rights is a step that enhances security and can impact productivity if implemented incorrectly. The High Security profile builds on the enhanced security profile with one considerable change, the removal of the local admin. This profile is designed to help with users that maybe a high profile user such as an executive or users that may have contact with sensitive data such as payroll, or approval of services, and processes.
   * The High Security user profile demands a higher controlled environment while still being able to perform their productivity activity, such as mail, and web browsing while maintaining a simple to use experience. The users expect features such as cookies, favorites, and other shortcuts available to operate. However these users may not require the ability to modify, or debug their device, and will not need to install drivers. The High Security profile is deployed using the High Security - Windows10 (1809) script.
* **Specialized** – Developers and IT administrators are an attractive target to attackers as these roles can alter systems of interest to the attackers. The Specialized workstation takes the effort deployed in the High Security workstation, and further emphases its security by managing local applications, limiting internet web sites, and restricting productivity capabilities that are high risk such as ActiveX, Java, browser plugin's, and several other known high risk controls on a Windows device. In this profile, the workstation will enable security controls and policies described in the content, and deployed in the DeviceConfiguration_NCSC - Windows10 (1803) SecurityBaseline  script.
* **Secured** – An attacker who can compromise an administrative account can typically cause significant business damage by data theft, data alteration, or service disruption. In this hardened state, the workstation will enable all the security controls and policies that restrict direct control of local application management, and productivity tools are removed. As a result, compromising the device is made more difficult as mail and social media are blocked which reflect the most common way phishing attacks can succeed.  The secured workstation can be deployed with the Secure Workstation - Windows10 (1809) SecurityBaseline  script.

   ![Secured workstation](./media/concept-azure-managed-workstation/secure-workstation.png)

   A secure workstation  provides an administrator a hardened workstation that has clear application control, and application guard. The workstation will use credential, device, and exploit guard to protect the host from malicious behavior. Additionally all local disks are encrypted with Bitlocker encryption.

* **Isolated** – This custom offline scenario represents the extreme end of the spectrum (no installation scripts are provided for this case). Organizations may need to manage an isolated business critical function such as a high value production line or life support systems that requires unsupported/unpatched legacy operating systems. Because security is critical and cloud services are unavailable, organizations may either manually manage/update these computers or use an isolated Active Directory forest architecture (like the Enhanced Security Admin Environment (ESAE)) to manage them. In these circumstance removing all access except basic Intune, and ATP health checking should be considered.
   * [Intune network communications requirement](https://docs.microsoft.com/intune/network-bandwidth-use)
   * [ATP network communications requirement](https://docs.microsoft.com/azure-advanced-threat-protection/configure-proxy)

## Next steps

[Deploying a secure Azure-managed workstation](howto-azure-managed-workstation.md)
