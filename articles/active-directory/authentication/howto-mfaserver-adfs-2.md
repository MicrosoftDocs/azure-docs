---
title: Use Azure Multi-Factor Authentication Server with AD FS 2.0
description: Describes how to get started with Microsoft Entra multifactor authentication and AD FS 2.0.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 09/13/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: jpettere

ms.collection: M365-identity-device-management
---
# Configure Azure Multi-Factor Authentication Server to work with AD FS 2.0

This article is for organizations that are federated with Microsoft Entra ID, and want to secure resources that are on-premises or in the cloud. Protect your resources by using the Azure Multi-Factor Authentication Server and configuring it to work with AD FS so that two-step verification is triggered for high-value end points.

This documentation covers using the Azure Multi-Factor Authentication Server with AD FS 2.0. For information about AD FS, see [Securing cloud and on-premises resources using Azure Multi-Factor Authentication Server with Windows Server](howto-mfaserver-adfs-windows-server.md).

> [!IMPORTANT]
> In September 2022, Microsoft announced deprecation of Azure Multi-Factor Authentication Server. Beginning September 30, 2024, Azure Multi-Factor Authentication Server deployments will no longer service multifactor authentication requests, which could cause authentications to fail for your organization. To ensure uninterrupted authentication services and to remain in a supported state, organizations should [migrate their users’ authentication data](how-to-migrate-mfa-server-to-mfa-user-authentication.md) to the cloud-based Microsoft Entra multifactor authentication service by using the latest Migration Utility included in the most recent [Azure Multi-Factor Authentication Server update](https://www.microsoft.com/download/details.aspx?id=55849). For more information, see [Azure Multi-Factor Authentication Server Migration](how-to-migrate-mfa-server-to-azure-mfa.md).
>
> To get started with cloud-based MFA, see [Tutorial: Secure user sign-in events with Azure multifactor authentication](tutorial-enable-azure-mfa.md).
>
> If you use cloud-based MFA, see [Securing cloud resources with Azure multifactor authentication and AD FS](howto-mfa-adfs.md).
>
> Existing customers that activated MFA Server before July 1, 2019 can download the latest version, future updates, and generate activation credentials as usual.

## Secure AD FS 2.0 with a proxy

To secure AD FS 2.0 with a proxy, install the Azure Multi-Factor Authentication Server on the AD FS proxy server.

### Configure IIS authentication

1. In the Azure Multi-Factor Authentication Server, click the **IIS Authentication** icon in the left menu.
2. Click the **Form-Based** tab.
3. Click **Add**.

   ![MFA Server IIS Authentication window](./media/howto-mfaserver-adfs-2/setup1.png)

4. To detect username, password, and domain variables automatically, enter the login URL (like `https://sso.contoso.com/adfs/ls`) within the Auto-Configure Form-Based Website dialog box and click **OK**.
5. Check the **Require Azure multifactor authentication user match** box if all users have been or will be imported into the Server and subject to two-step verification. If a significant number of users haven't yet been imported into the Server and/or will be exempt from two-step verification, leave the box unchecked.
6. If the page variables can't be detected automatically, click the **Specify Manually…** button in the Auto-Configure Form-Based Website dialog box.
7. In the Add Form-Based Website dialog box, enter the URL to the AD FS login page in the Submit URL field (like `https://sso.contoso.com/adfs/ls`) and enter an Application name (optional). The Application name appears in Azure multifactor authentication reports and may be displayed within SMS or Mobile App authentication messages.
8. Set the Request format to **POST or GET**.
9. Enter the Username variable (ctl00$ContentPlaceHolder1$UsernameTextBox) and Password variable (ctl00$ContentPlaceHolder1$PasswordTextBox). If your form-based login page displays a domain textbox, enter the Domain variable as well. To find the names of the input boxes on the login page, go to the login page in a web browser, right-click on the page and select **View Source**.
10. Check the **Require Azure multifactor authentication user match** box if all users have been or will be imported into the Server and subject to two-step verification. If a significant number of users haven't yet been imported into the Server and/or will be exempt from two-step verification, leave the box unchecked.

    ![Add form-based website to MFA Server](./media/howto-mfaserver-adfs-2/manual.png)

11. Click **Advanced…** to review advanced settings. Settings that you can configure include:

    - Select a custom denial page file
    - Cache successful authentications to the website using cookies
    - Select how to authenticate the primary credentials

12. Since the AD FS proxy server isn't likely to be joined to the domain, you can use LDAP to connect to your domain controller for user import and pre-authentication. In the Advanced Form-Based Website dialog box, click the **Primary Authentication** tab and select **LDAP Bind** for the Pre-authentication Authentication type.
13. When complete, click **OK** to return to the Add Form-Based Website dialog box.
14. Click **OK** to close the dialog box.
15. Once the URL and page variables have been detected or entered, the website data displays in the Form-Based panel.
16. Click the **Native Module** tab and select the server, the website that the AD FS proxy is running under (like "Default Web Site"), or the AD FS proxy application (like "ls" under "adfs") to enable the IIS plug-in at the desired level.
17. Click the **Enable IIS authentication** box at the top of the screen.

The IIS authentication is now enabled.

### Configure directory integration

You enabled IIS authentication, but to perform the pre-authentication to your Active Directory (AD) via LDAP you must configure the LDAP connection to the domain controller.

1. Click the **Directory Integration** icon.
2. On the Settings tab, select the **Use specific LDAP configuration** radio button.

   ![Configure LDAP settings for specific LDAP settings](./media/howto-mfaserver-adfs-2/ldap1.png)

3. Click **Edit**.
4. In the Edit LDAP Configuration dialog box, populate the fields with the information required to connect to the AD domain controller. 
5. Test the LDAP connection by clicking the **Test** button.

   ![Test LDAP Configuration in MFA Server](./media/howto-mfaserver-adfs-2/ldap2.png)

6. If the LDAP connection test was successful, click **OK**.

### Configure company settings

1. Next, click the **Company Settings** icon and select the **Username Resolution** tab.
2. Select the **Use LDAP unique identifier attribute for matching usernames** radio button.
3. If users enter their username in "domain\username" format, the Server needs to be able to strip the domain off the username when it creates the LDAP query, which can be done through a registry setting.
4. Open the registry editor and go to HKEY_LOCAL_MACHINE/SOFTWARE/Wow6432Node/Positive Networks/PhoneFactor on a 64-bit server. If you use a 32-bit server, remove **/Wow6432Node** from the path. Create a DWORD registry key called "UsernameCxz_stripPrefixDomain" and set the value to 1. Azure multifactor authentication is now securing the AD FS proxy.

Make sure users are imported from Active Directory into the Server. To allow users to skip two-step verification from internal IP addresses, see the [Trusted IPs](#trusted-ips).

![Registry editor to configure company settings](./media/howto-mfaserver-adfs-2/reg.png)

## AD FS 2.0 Direct without a proxy

You can secure AD FS when the AD FS proxy isn't used. Install the Azure Multi-Factor Authentication Server on the AD FS server and configure the Server per the following steps:

1. Within the Azure Multi-Factor Authentication Server, click the **IIS Authentication** icon in the left menu.
2. Click the **HTTP** tab.
3. Click **Add**.
4. In the Add Base URL dialogue box, enter the URL for the AD FS website where HTTP authentication is performed (like `https://sso.domain.com/adfs/ls/auth/integrated`) into the Base URL field. Then, enter an Application name (optional). The Application name appears in Azure multifactor authentication reports and may be displayed within SMS or Mobile App authentication messages.
5. If desired, adjust the Idle timeout and Maximum session times.
6. Check the **Require Azure multifactor authentication user match** box if all users have been or will be imported into the Server and subject to two-step verification. If a significant number of users haven't yet been imported into the Server and/or will be exempt from two-step verification, leave the box unchecked.
7. Check the cookie cache box if desired.

   ![AD FS 2.0 Direct without a proxy](./media/howto-mfaserver-adfs-2/noproxy.png)

8. Click **OK**.
9. Click the **Native Module** tab and select the server, the website (like "Default Web Site"), or the AD FS application (like "ls" under "adfs") to enable the IIS plug-in at the desired level.
10. Click the **Enable IIS authentication** box at the top of the screen.

Azure multifactor authentication is now securing AD FS.

Ensure that users have been imported from Active Directory into the Server. See the next section if you would like to allow internal IP addresses so that two-step verification isn't required when signing in to the website from those locations.

## Trusted IPs

Trusted IPs allow users to bypass Azure multifactor authentication for website requests originating from specific IP addresses or subnets. For example, you may want to exempt users from two-step verification when they sign in from the office. For this, you would specify the office subnet as a Trusted IPs entry.

### To configure trusted IPs

1. In the IIS Authentication section, click the **Trusted IPs** tab.
2. Click the **Add…** button.
3. When the Add Trusted IPs dialog box appears, select one of the **Single IP**, **IP range**, or **Subnet** radio buttons.
4. Enter the IP address, range of IP addresses, or subnet that should be allowed. If entering a subnet, select the appropriate Netmask and click the **OK** button.

![Configure trusted IPs to MFA Server](./media/howto-mfaserver-adfs-2/trusted.png)
