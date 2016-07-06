<properties 
	pageTitle="Secure cloud and on-premises resources using Azure MFA Server with Windows Server 2012 R2 AD FS" 
	description="This is the Azure Multi-Factor authentication page that describes how to get started with Azure MFA and AD FS on Windows Server 2012 R2." 
	services="multi-factor-authentication" 
	documentationCenter="" 
	authors="billmath" 
	manager="stevenpo" 
	editor="curtland"/>

<tags 
	ms.service="multi-factor-authentication" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="get-started-article" 
	ms.date="05/12/2016" 
	ms.author="billmath"/>


# Secure cloud and on-premises resources using Azure Multi-Factor Authentication Server with Windows Server 2012 R2 AD FS

If your organization is federated with Azure AD and you have resources that are on-premises or in the cloud that you wish to secure you can do this by using the Azure Multi-Factor Authentication Sever and configuring it to work with AD FS so that multi-factor authentication is triggered for high value end points.

This documentation covers using the Azure Multi-Factor Authentication Server with AD FS in Windows Server 2012 R2.  For infomation on using Azure Multi-Factor Authentication with AD FS 2.0 see [Secure cloud and on-premises resources using Azure Multi-Factor Authentication Server with AD FS 2.0](multi-factor-authentication-get-started-adfs-adfs2.md).

## Securing Windows Server 2012 R2 AD FS with Azure Multi-Factor Authentication Server

When installing the Azure Multi-Factor Authentication Server you have the following two options:

- Install the Azure Multi-Factor Authentication Server locally on the same server as AD FS 
- Install the Azure Multi-Factor Authentication Adapter locally on the AD FS Server and install the MFA Server on a different computer

Before you begin, be aware of the following information:

- It is not a requirement that the Azure Multi-Factor Authentication Server be installed on your AD FS federation server however the Multi-Factor Authentication Adapter for AD FS must be installed on a Windows Server 2012 R2 running AD FS. You can install the server on a different computer, as long as it is a supported version and install the AD FS adapter separately on your AD FS federation server. See the procedure below for instructions on installing the adapter separately.
- When the Multi-Factor Authentication Server's AD FS Adapter was designed, it was anticipated that AD FS could pass the name of the relying party to the adapter which could be used as an application name.  However, this turned out not to be the case.  If using text message or mobile app authentication methods, the strings defined in Company Settings contain a placeholder "<$application_name$>".  This placeholder doesn't get replaced when using the AD FS Adapter.  Because of this, it is recommended to remove the placeholder from the appropriate strings when securing AD FS.

- The signed on account must have privileges to create security groups in Active Directory.

- The Multi-Factor Authentication AD FS Adapter installation wizard creates a security group called PhoneFactor Admins in your Active Directory and then adds the AD FS service account of your federation service to this group.It is recommended that you verify on your domain controller that the PhoneFactor Admins group is indeed created and that the AD FS service account is a member of this group. If necessary, add the AD FS service account to the PhoneFactor Admins group on your domain controller manually.
- For information on installing the Web Service SDK with the user portal see [Deploying the user portal for the Azure Multi-Factor Authentication Server.](multi-factor-authentication-get-started-portal.md)
  

### To install the Azure Multi-Factor Authentication Server locally on the same server as AD FS

1. Download and install the Azure Multi-Factor Authentication Server on your AD FS federation server. For information on installing the Azure Multi-Factor Authentication server see [Getting started with the Azure Multi-Factor Authentication Server](multi-factor-authentication-get-started-server.md)
2. In the Azure Multi-Factor Authentication Server user interface, select the AD FS icon and select options for Allow user enrollement and Allow users to select method.
3. Select any additional options.
4. Click Install AD FS Adapter.
<center>![Cloud](./media/multi-factor-authentication-get-started-adfs-w2k12/server.png)</center>
5. If the computer is joined to a domain and the Active Directory configuration for securing communication between the AD FS Adapter and the Multi-Factor Authentication service is incomplete, the Active Directory step will be displayed.  Click the Next button to automatically complete this configuration or check the Skip automatic Active Directory configuration and configure settings manually checkbox and click Next.
6. If the computer is not joined to a domain and the Local Group configuration for securing communication between the AD FS Adapter and the Multi-Factor Authentication service is incomplete, the Local Group step will be displayed.  Click the Next button to automatically complete this configuration or check the Skip automatic Local Group configuration and configure settings manually checkbox and click Next.
7. This will bring up the installation wizard, click Next to allow the Azure Multi-Factor Authentication Server to create the PhoneFactor Admins group and add the AD FS service account to the PhoneFactor Admins group.
<center>![Cloud](./media/multi-factor-authentication-get-started-adfs-w2k12/adapter.png)</center>
8. On the Launch Installer step, click Next.
9. In the Multi-Factor Authentication AD FS Adapter installer, click Next.
10. Click Close when the installation has completed.
11. Now that the adapter has been installed, it must be registered with the AD FS. Open Windows PowerShell and run the following: 
    C:\Program Files\Multi-Factor Authentication Server\Register-MultiFactorAuthenticationAdfsAdapter.ps1
   <center>![Cloud](./media/multi-factor-authentication-get-started-adfs-w2k12/pshell.png)</center>
12. Now we need to edit the Global Authentication Policy in AD FS to use our newly registered adapter. In the AD FS Management Console, navigate to the Authentication Policies node, and under Multi-factor Authentication section, click the Edit link next to the Global Settings sub-section. In the Edit Global Authentication Policy window, select Multi-Factor Authentication as an additional authentication method, and then click OK. The adapter is registered as WindowsAzureMultiFactorAuthentication.  You must restart the AD FS service for the registration to take effect.

<center>![Cloud](./media/multi-factor-authentication-get-started-adfs-w2k12/global.png)</center>

At this point, the Multi-Factor Authentication Server is setup to be an additional authentication provider for use with AD FS.

## To Install the AD FS Adapter standalone using the Web Service SDK
1. Install Web Service SDK on the server running Multi-Factor Authentication Server.
2. Copy MultiFactorAuthenticationAdfsAdapterSetup64.msi, Register-MultiFactorAuthenticationAdfsAdapter.ps1, Unregister-MultiFactorAuthenticationAdfsAdapter.ps1, and MultiFactorAuthenticationAdfsAdapter.config files from the \Program Files\Multi-Factor Authentication Server directory to the server you plan to install the AD FS Adapter on.
3. Run the MultiFactorAuthenticationAdfsAdapterSetup64.msi.
4. In the Multi-Factor Authentication AD FS Adapter installer, click Next to perform the installation.
5. Click the Close button when the installation has completed.
6. Edit the MultiFactorAuthenticationAdfsAdapter.config file by doing the following:

MultiFactorAuthenticationAdfsAdapter.config Step| Sub step
:------------- | :------------- |
Set UseWebServiceSdk node to true.||
Set WebServiceSdkUrl to the URL of the Multi-Factor Authentication Web Service SDK.||
Option 1 - Configure Web Service SDK with a username and password.|<ol><li>Set WebServiceSdkUsername to an account that is a member of the PhoneFactor Admins security group.  Use <domain>\<username> format.<li>Set WebServiceSdkPassword to the appropriate account password.</li></ol>
Option 2 - Configure Web Service SDK with a client certificate.|<ol><li>Obtain a client certificate from a certificate authority for the server running the Web Service SDK.  For information on obtaining a certificate see [Obtain Client Certificate](https://technet.microsoft.com/library/cc770328.aspx).</li><li>Import the client certificate to the local computer Personal certificate store on the server running the Web Service SDK.  Note:  Make sure the certificate authority's public certificate is in Trusted Root Certificates.</li><li>Export the public and private keys of the client certificate to a .pfx file.</li><li>Export the public key in base-64 format to a .cer file.</li><li>In Server Manager, verify that the Web Server (IIS)\Web Server\Security\IIS Client Certificate Mapping Authentication feature is installed.</li><li>If not installed, choose Add Roles and Features to add this feature.</li><li>In IIS Manager, double-click Configuration Editor in the web site that contains the Web Service SDK virtual directory.  Note:  It is very important to do this at the web site level and not the virtual directory level.</li><li>Navigate to the system.webServer/security/authentication/iisClientCertificateMappingAuthentication section.</li><li>Set enabled to true.</li><li>Set oneToOneCertificateMappingsEnabled to true.</li><li>Click the ... button next to oneToOneMappings.</li><li>Click the Add link.</li><li>Open the base-64 .cer file exported earlier.  Remove -----BEGIN CERTIFICATE-----, -----END CERTIFICATE----- and any line breaks.  Copy the resulting string.</li><li>Set certificate to the string copied in the previous step.</li><li>Set enabled to true.</li><li>Set userName to an account that is a member of the PhoneFactor Admins security group.  Use <domain>\<username> format.</li><li>Set password to the appropriate account password.</li><li>Close the Collection Editor.</li><li>Click the Apply link.</li><li>Navigate to the Web Service SDK virtual directory.</li><li>Double-click Authentication.</li><li>Verify that ASP.NET Impersonation and Basic Authentication are Enabled and all other items are Disabled.</li><li>Navigate to the Web Service SDK virtual directory again.</li><li>Double-click SSL Settings.</li><li>Set Client Certificates to Accept and click Apply.</li><li>Copy the .pfx file exported earlier to the server running the AD FS Adapter.</li><li>Import the .pfx file to the local computer Personal certificate store.</li><li>Choose Manage Private Keys from the right-click menu and grant read access to the account the Active Directory Federation Services service is logged on as.</li><li>Open the client certificate and copy the thumbprint from the Details tab.</li><li>In the MultiFactorAuthenticationAdfsAdapter.config file, set WebServiceSdkCertificateThumbprint to the string copied in the previous step.</li></ol>
Edit the Register-MultiFactorAuthenticationAdfsAdapter.ps1 script adding -ConfigurationFilePath <path> to the end of the Register-AdfsAuthenticationProvider command where <path> is the full path to the MultiFactorAuthenticationAdfsAdapter.config file.|


Now Run the \Program Files\Multi-Factor Authentication Server\Register-MultiFactorAuthenticationAdfsAdapter.ps1 script in PowerShell to register the adapter.  The adapter is registered as WindowsAzureMultiFactorAuthentication.  You must restart the AD FS service for the registration to take effect. 




























 

 


 

 


 





 


 

























































































 


 

 






 