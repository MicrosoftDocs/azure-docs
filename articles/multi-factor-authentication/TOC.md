# [Authentication Documentation](index.md)

# Overview

## [What is authentication](../active-directory/authentication/overview-authentication.md)

# Quickstarts

## [Configure password reset](../active-directory/authentication/quickstart-sspr.md)
## [Configure Multi-Factor Authentication](../active-directory/authentication/quickstart-mfa.md)

# Tutorials

## [1 Enable MFA for Applications](../active-directory/authentication/tutorial-mfa-applications.md)
## [2 Enable a SSPR pilot](../active-directory/authentication/tutorial-sspr-pilot.md)
## [Enable SSPR on-premises integration](../active-directory/authentication/tutorial-enable-writeback.md)
## [Enable Windows 10 password reset](../active-directory/authentication/tutorial-sspr-windows.md)
## [Integrate Azure Identity Protection](../active-directory/authentication/tutorial-risk-based-sspr-mfa.md)

# Concepts

## [Authentication methods](../active-directory/authentication/concept-authentication-methods.md)

## Self-service password reset
### [How password reset works](../active-directory/authentication/concept-sspr-howitworks.md)
### [Password reset options](../active-directory/authentication/concept-sspr-customization.md)
### [Password reset policies](../active-directory/authentication/concept-sspr-policy.md)
### [What license do I need](../active-directory/authentication/concept-sspr-licensing.md)
### [On-premises integration](../active-directory/authentication/concept-sspr-writeback.md)

## Multi-Factor Authentication
### [How MFA works](../active-directory/authentication/concept-mfa-howitworks.md)
### [What version is right](../active-directory/authentication/concept-mfa-whichversion.md)
### [License your users](../active-directory/authentication/concept-mfa-licensing.md)
### [Create an Auth Provider](../active-directory/authentication/concept-mfa-authprovider.md)
### [Security guidance](../active-directory/authentication/multi-factor-authentication-security-best-practices.md)
### [MFA for Office 365](https://support.office.com/article/Plan-for-multi-factor-authentication-for-Office-365-Deployments-043807b2-21db-4d5c-b430-c8a6dee0e6ba)
### [MFA FAQ](../active-directory/authentication/multi-factor-authentication-faq.md)

# How-to Guides

## Password reset
### [SSPR Deployment guide](../active-directory/authentication/howto-sspr-deployment.md)
### [SSPR Data requirements](../active-directory/authentication/howto-sspr-authenticationdata.md)
### [Password writeback](../active-directory/authentication/howto-sspr-writeback.md)
### [Troubleshoot SSPR](../active-directory/authentication/active-directory-passwords-troubleshoot.md)
### [SSPR FAQ](../active-directory/authentication/active-directory-passwords-faq.md)

## Cloud-based MFA
### [Deploy cloud-based MFA](../active-directory/authentication/howto-mfa-getstarted.md)
### [Per user MFA](../active-directory/authentication/howto-mfa-userstates.md)
### [User and device settings](../active-directory/authentication/howto-mfa-userdevicesettings.md)
### [Configure settings](../active-directory/authentication/howto-mfa-mfasettings.md)
### Directory Federation
#### [Windows Server 2016 AD FS Adapter](https://docs.microsoft.com/windows-server/identity/ad-fs/operations/configure-ad-fs-and-azure-mfa)
#### [Federation Services](../active-directory/authentication/multi-factor-authentication-get-started-adfs.md)
#### [Use AD FS](../active-directory/authentication/howto-mfa-adfs.md)
### RADIUS Integration
#### [Use existing network policy servers](../active-directory/authentication/howto-mfa-nps-extension.md)
#### [Advanced configuration for NPS extension](../active-directory/authentication/howto-mfa-nps-extension-advanced.md)
#### [Remote Desktop Gateway](../active-directory/authentication/howto-mfa-nps-extension-rdg.md)
#### [VPN](../active-directory/authentication/howto-mfa-nps-extension-vpn.md)

## MFA Server
### [Deploy MFA on-premises](../active-directory/authentication/howto-mfaserver-deploy.md)
### [Install the user portal](../active-directory/authentication/howto-mfaserver-deploy-userportal.md)
### [Mobile App Web Service](../active-directory/authentication/howto-mfaserver-deploy-mobileapp.md)
### [Configure high availability](../active-directory/authentication/howto-mfaserver-deploy-ha.md)
### [Upgrade MFA Server](../active-directory/authentication/howto-mfaserver-deploy-upgrade.md)
### [Upgrade from PhoneFactor](../active-directory/authentication/howto-mfaserver-deploy-upgrade-pf.md)
### [Windows Authentication](../active-directory/authentication/howto-mfaserver-windows.md)
### [IIS web apps](../active-directory/authentication/howto-mfaserver-iis.md)
### Directory Integration
#### [LDAP Authentication](../active-directory/authentication/howto-mfaserver-dir-ldap.md)
#### [RADIUS Authentication](../active-directory/authentication/howto-mfaserver-dir-radius.md)
#### [Active Directory](../active-directory/authentication/howto-mfaserver-dir-ad.md)
### Directory Federation
#### [Use AD FS 2.0](../active-directory/authentication/howto-mfaserver-adfs-2.md)
#### [Use Windows Server 2012 R2 AD FS](../active-directory/authentication/howto-mfaserver-adfs-2012.md)
### RADIUS Integration
#### [Remote Desktop Gateway](../active-directory/authentication/howto-mfaserver-nps-rdg.md)
#### [Advanced VPN Configurations](../active-directory/authentication/howto-mfaserver-nps-vpn.md)
#### [NPS extension errors](../active-directory/authentication/howto-mfa-nps-extension-errors.md)

## Certificate-based authentication
### [Get started with certificate auth](../active-directory/active-directory-certificate-based-authentication-get-started.md)
#### [CBA on Android Devices](../active-directory/active-directory-certificate-based-authentication-android.md)
#### [CBA on iOS Devices](../active-directory/active-directory-certificate-based-authentication-ios.md)

## Develop
### [Build MFA into custom apps](../active-directory/authentication/howto-mfa-sdk.md)

## Reporting
### [SSPR Reports](../active-directory/authentication/howto-sspr-reporting.md)
### [MFA Reports](../active-directory/authentication/howto-mfa-reporting.md)
### [Data collection](../active-directory/authentication/howto-mfa-reporting-datacollection.md)

## Troubleshoot
### [FAQ](../active-directory/authentication/multi-factor-authentication-faq.md)
### [NPS extension errors](../active-directory/authentication/howto-mfa-nps-extension-errors.md)
### [Ask a question](https://social.msdn.microsoft.com/Forums/newthread?category=windowsazureplatform&forum=windowsazureactiveauthentication&prof=required)

## [MFA user guide](../active-directory/authentication/end-user/current/multi-factor-authentication-end-user.md)

# Reference
## [Code samples](https://azure.microsoft.com/resources/samples/?service=active-directory)
## [Azure PowerShell cmdlets](/powershell/azure/overview)
## [Java API Reference](/java/api)
## [.NET API](/active-directory/adal/microsoft.identitymodel.clients.activedirectory)
## [Service limits and restrictions](../active-directory/active-directory-service-limits-restrictions.md)

# Resources
## [Azure feedback forum](https://feedback.azure.com/forums/169401-azure-active-directory)
## [Azure Roadmap](https://azure.microsoft.com/roadmap/?category=security-identity)
## [MSDN forum](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=WindowsAzureAD)
## [Pricing](https://azure.microsoft.com/pricing/details/active-directory/)
## [Pricing calculator](https://azure.microsoft.com/pricing/calculator/)
## [Service updates](https://azure.microsoft.com/updates/?product=active-directory)
## [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-active-directory)
## [Videos](https://azure.microsoft.com/documentation/videos/index/?services=active-directory)