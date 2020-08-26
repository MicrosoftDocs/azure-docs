---
title: Azure AD Connect - AD FS management and customization | Microsoft Docs
description: AD FS management with Azure AD Connect and customization of user AD FS sign-in experience with Azure AD Connect and PowerShell.
keywords: AD FS, ADFS, AD FS management, AAD Connect, Connect, sign-in, AD FS customization, repair trust, O365, federation, relying party
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
editor: ''

ms.assetid: 2593b6c6-dc3f-46ef-8e02-a8e2dc4e9fb9
ms.service: active-directory    
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 07/18/2017
ms.subservice: hybrid
ms.author: billmath
ms.custom: seohack1
ms.collection: M365-identity-device-management
---
# Manage and customize Active Directory Federation Services by using Azure AD Connect
This article describes how to manage and customize Active Directory Federation Services (AD FS) by using Azure Active Directory (Azure AD) Connect. It also includes other common AD FS tasks that you might need to do for a complete configuration of an AD FS farm.

| Topic | What it covers |
|:--- |:--- |
| **Manage AD FS** | |
| [Repair the trust](#repairthetrust) |How to repair the federation trust with Office 365. |
| [Federate with Azure AD using alternate login ID](#alternateid) | Configure federation using alternate login ID  |
| [Add an AD FS server](#addadfsserver) |How to expand an AD FS farm with an additional AD FS server. |
| [Add an AD FS Web Application Proxy server](#addwapserver) |How to expand an AD FS farm with an additional Web Application Proxy (WAP) server. |
| [Add a federated domain](#addfeddomain) |How to add a federated domain. |
| [Update the TLS/SSL certificate](how-to-connect-fed-ssl-update.md)| How to update the TLS/SSL certificate for an AD FS farm. |
| **Customize AD FS** | |
| [Add a custom company logo or illustration](#customlogo) |How to customize an AD FS sign-in page with a company logo and illustration. |
| [Add a sign-in description](#addsignindescription) |How to add a sign-in page description. |
| [Modify AD FS claim rules](#modclaims) |How to modify AD FS claims for various federation scenarios. |

## Manage AD FS
You can perform various AD FS-related tasks in Azure AD Connect with minimal user intervention by using the Azure AD Connect wizard. After you've finished installing Azure AD Connect by running the wizard, you can run the wizard again to perform additional tasks.

## <a name="repairthetrust"></a>Repair the trust 
You can use Azure AD Connect to check the current health of the AD FS and Azure AD trust and take appropriate actions to repair the trust. Follow these steps to repair your Azure AD and AD FS trust.

1. Select **Repair AAD and ADFS Trust** from the list of additional tasks.
   ![Repair AAD and ADFS Trust](./media/how-to-connect-fed-management/RepairADTrust1.PNG)

2. On the **Connect to Azure AD** page, provide your global administrator credentials for Azure AD, and click **Next**.
   ![Connect to Azure AD](./media/how-to-connect-fed-management/RepairADTrust2.PNG)

3. On the **Remote access credentials** page, enter the credentials for the domain administrator.

   ![Remote access credentials](./media/how-to-connect-fed-management/RepairADTrust3.PNG)

    After you click **Next**, Azure AD Connect checks for certificate health and shows any issues.

    ![State of certificates](./media/how-to-connect-fed-management/RepairADTrust4.PNG)

    The **Ready to configure** page shows the list of actions that will be performed to repair the trust.

    ![Ready to configure](./media/how-to-connect-fed-management/RepairADTrust5.PNG)

4. Click **Install** to repair the trust.

> [!NOTE]
> Azure AD Connect can only repair or act on certificates that are self-signed. Azure AD Connect can't repair third-party certificates.

## <a name="alternateid"></a>Federate with Azure AD using AlternateID 
It is recommended that the on-premises User Principal Name(UPN) and the cloud User Principal Name are kept the same. If the on-premises UPN uses a non-routable domain (ex. Contoso.local) or cannot be changed due to local application dependencies, we recommend setting up alternate login ID. Alternate login ID allows you to configure a sign-in experience where users can sign in with an attribute other than their UPN, such as mail. The choice for User Principal Name in Azure AD Connect defaults to the userPrincipalName attribute in Active Directory. If you choose any other attribute for User Principal Name and are federating using AD FS, then Azure AD Connect will configure AD FS for alternate login ID. An example of choosing a different attribute for User Principal Name is shown below:

![Alternate ID attribute selection](./media/how-to-connect-fed-management/attributeselection.png)

Configuring alternate login ID for AD FS consists of two main steps:
1. **Configure the right set of issuance claims**: The issuance claim rules in the Azure AD relying party trust are modified to use the selected UserPrincipalName attribute as the alternate ID of the user.
2. **Enable alternate login ID in the AD FS configuration**: The AD FS configuration is updated so that AD FS can look up users in the appropriate forests using the alternate ID. This configuration is supported for AD FS on Windows Server 2012 R2 (with KB2919355) or later. If the AD FS servers are 2012 R2, Azure AD Connect checks for the presence of the required KB. If the KB is not detected, a warning will be displayed after configuration completes, as shown below:

    ![Warning for missing KB on 2012R2](./media/how-to-connect-fed-management/kbwarning.png)

    To rectify the configuration in case of missing KB, install the required [KB2919355](https://go.microsoft.com/fwlink/?LinkID=396590) and then repair the trust using [Repair AAD and AD FS Trust](#repairthetrust).

> [!NOTE]
> For more information on alternateID and steps to manually configure, read [Configuring Alternate Login ID](https://technet.microsoft.com/windows-server-docs/identity/ad-fs/operations/configuring-alternate-login-id)

## <a name="addadfsserver"></a>Add an AD FS server 

> [!NOTE]
> To add an AD FS server, Azure AD Connect requires the PFX certificate. Therefore, you can perform this operation only if you configured the AD FS farm by using Azure AD Connect.

1. Select **Deploy an additional Federation Server**, and click **Next**.

   ![Additional federation server](./media/how-to-connect-fed-management/AddNewADFSServer1.PNG)

2. On the **Connect to Azure AD** page, enter your global administrator credentials for Azure AD, and click **Next**.

   ![Connect to Azure AD](./media/how-to-connect-fed-management/AddNewADFSServer2.PNG)

3. Provide the domain administrator credentials.

   ![Domain administrator credentials](./media/how-to-connect-fed-management/AddNewADFSServer3.PNG)

4. Azure AD Connect asks for the password of the PFX file that you provided while configuring your new AD FS farm with Azure AD Connect. Click **Enter Password** to provide the password for the PFX file.

   ![Certificate password](./media/how-to-connect-fed-management/AddNewADFSServer4.PNG)

    ![Specify TLS/SSL certificate](./media/how-to-connect-fed-management/AddNewADFSServer5.PNG)

5. On the **AD FS Servers** page, enter the server name or IP address to be added to the AD FS farm.

   ![AD FS servers](./media/how-to-connect-fed-management/AddNewADFSServer6.PNG)

6. Click **Next**, and go through the final **Configure** page. After Azure AD Connect has finished adding the servers to the AD FS farm, you will be given the option to verify the connectivity.

   ![Ready to configure](./media/how-to-connect-fed-management/AddNewADFSServer7.PNG)

    ![Installation complete](./media/how-to-connect-fed-management/AddNewADFSServer8.PNG)

## <a name="addwapserver"></a>Add an AD FS WAP server 

> [!NOTE]
> To add a WAP server, Azure AD Connect requires the PFX certificate. Therefore, you can only perform this operation if you configured the AD FS farm by using Azure AD Connect.

1. Select **Deploy Web Application Proxy** from the list of available tasks.

   ![Deploy Web Application Proxy](./media/how-to-connect-fed-management/WapServer1.PNG)

2. Provide the Azure global administrator credentials.

   ![Connect to Azure AD](./media/how-to-connect-fed-management/wapserver2.PNG)

3. On the **Specify SSL certificate** page, provide the password for the PFX file that you provided when you configured the AD FS farm with Azure AD Connect.
   ![Certificate password](./media/how-to-connect-fed-management/WapServer3.PNG)

    ![Specify TLS/SSL certificate](./media/how-to-connect-fed-management/WapServer4.PNG)

4. Add the server to be added as a WAP server. Because the WAP server might not be joined to the domain, the wizard asks for administrative credentials to the server being added.

   ![Administrative server credentials](./media/how-to-connect-fed-management/WapServer5.PNG)

5. On the **Proxy trust credentials** page, provide administrative credentials to configure the proxy trust and access the primary server in the AD FS farm.

   ![Proxy trust credentials](./media/how-to-connect-fed-management/WapServer6.PNG)

6. On the **Ready to configure** page, the wizard shows the list of actions that will be performed.

   ![Ready to configure](./media/how-to-connect-fed-management/WapServer7.PNG)

7. Click **Install** to finish the configuration. After the configuration is complete, the wizard gives you the option to verify the connectivity to the servers. Click **Verify** to check connectivity.

   ![Installation complete](./media/how-to-connect-fed-management/WapServer8.PNG)

## <a name="addfeddomain"></a>Add a federated domain 

It's easy to add a domain to be federated with Azure AD by using Azure AD Connect. Azure AD Connect adds the domain for federation and modifies the claim rules to correctly reflect the issuer when you have multiple domains federated with Azure AD.

1. To add a federated domain, select the task **Add an additional Azure AD domain**.

   ![Additional Azure AD domain](./media/how-to-connect-fed-management/AdditionalDomain1.PNG)

2. On the next page of the wizard, provide the global administrator credentials for Azure AD.

   ![Connect to Azure AD](./media/how-to-connect-fed-management/AdditionalDomain2.PNG)

3. On the **Remote access credentials** page, provide the domain administrator credentials.

   ![Remote access credentials](./media/how-to-connect-fed-management/additionaldomain3.PNG)

4. On the next page, the wizard provides a list of Azure AD domains that you can federate your on-premises directory with. Choose the domain from the list.

   ![Azure AD domain](./media/how-to-connect-fed-management/AdditionalDomain4.PNG)

    After you choose the domain, the wizard provides you with appropriate information about further actions that the wizard will take and the impact of the configuration. In some cases, if you select a domain that isn't yet verified in Azure AD, the wizard provides you with information to help you verify the domain. See [Add your custom domain name to Azure Active Directory](../active-directory-domains-add-azure-portal.md) for more details.

5. Click **Next**. The **Ready to configure** page shows the list of actions that Azure AD Connect will perform. Click **Install** to finish the configuration.

   ![Ready to configure](./media/how-to-connect-fed-management/AdditionalDomain5.PNG)

> [!NOTE]
> Users from the added federated domain must be synchronized before they will be able to login to Azure AD.

## AD FS customization
The following sections provide details about some of the common tasks that you might have to perform when you customize your AD FS sign-in page.

## <a name="customlogo"></a>Add a custom company logo or illustration 
To change the logo of the company that's displayed on the **Sign-in** page, use the following Windows PowerShell cmdlet and syntax.

> [!NOTE]
> The recommended dimensions for the logo are 260 x 35 \@ 96 dpi with a file size no greater than 10 KB.

```azurepowershell-interactive
Set-AdfsWebTheme -TargetName default -Logo @{path="c:\Contoso\logo.PNG"}
```

> [!NOTE]
> The *TargetName* parameter is required. The default theme that's released with AD FS is named Default.

## <a name="addsignindescription"></a>Add a sign-in description 
To add a sign-in page description to the **Sign-in page**, use the following Windows PowerShell cmdlet and syntax.

```azurepowershell-interactive
Set-AdfsGlobalWebContent -SignInPageDescriptionText "<p>Sign-in to Contoso requires device registration. Click <A href='http://fs1.contoso.com/deviceregistration/'>here</A> for more information.</p>"
```

## <a name="modclaims"></a>Modify AD FS claim rules 
AD FS supports a rich claim language that you can use to create custom claim rules. For more information, see [The Role of the Claim Rule Language](https://technet.microsoft.com/library/dd807118.aspx).

The following sections describe how you can write custom rules for some scenarios that relate to Azure AD and AD FS federation.

### Immutable ID conditional on a value being present in the attribute
Azure AD Connect lets you specify an attribute to be used as a source anchor when objects are synced to Azure AD. If the value in the custom attribute is not empty, you might want to issue an immutable ID claim.

For example, you might select **ms-ds-consistencyguid** as the attribute for the source anchor and issue **ImmutableID** as **ms-ds-consistencyguid** in case the attribute has a value against it. If there's no value against the attribute, issue **objectGuid** as the immutable ID. You can construct the set of custom claim rules as described in the following section.

**Rule 1: Query attributes**

```claim-rule-language
c:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname"]
=> add(store = "Active Directory", types = ("http://contoso.com/ws/2016/02/identity/claims/objectguid", "http://contoso.com/ws/2016/02/identity/claims/msdsconsistencyguid"), query = "; objectGuid,ms-ds-consistencyguid;{0}", param = c.Value);
```

In this rule, you're querying the values of **ms-ds-consistencyguid** and **objectGuid** for the user from Active Directory. Change the store name to an appropriate store name in your AD FS deployment. Also change the claims type to a proper claims type for your federation, as defined for **objectGuid** and **ms-ds-consistencyguid**.

Also, by using **add** and not **issue**, you avoid adding an outgoing issue for the entity, and can use the values as intermediate values. You will issue the claim in a later rule after you establish which value to use as the immutable ID.

**Rule 2: Check if ms-ds-consistencyguid exists for the user**

```claim-rule-language
NOT EXISTS([Type == "http://contoso.com/ws/2016/02/identity/claims/msdsconsistencyguid"])
=> add(Type = "urn:anandmsft:tmp/idflag", Value = "useguid");
```

This rule defines a temporary flag called **idflag** that is set to **useguid** if there's no **ms-ds-consistencyguid** populated for the user. The logic behind this is the fact that AD FS doesn't allow empty claims. So when you add claims `http://contoso.com/ws/2016/02/identity/claims/objectguid` and `http://contoso.com/ws/2016/02/identity/claims/msdsconsistencyguid` in Rule 1, you end up with an **msdsconsistencyguid** claim only if the value is populated for the user. If it isn't populated, AD FS sees that it will have an empty value and drops it immediately. All objects will have **objectGuid**, so that claim will always be there after Rule 1 is executed.

**Rule 3: Issue ms-ds-consistencyguid as immutable ID if it's present**

```claim-rule-language
c:[Type == "http://contoso.com/ws/2016/02/identity/claims/msdsconsistencyguid"]
=> issue(Type = "http://schemas.microsoft.com/LiveID/Federation/2008/05/ImmutableID", Value = c.Value);
```

This is an implicit **Exist** check. If the value for the claim exists, then issue that as the immutable ID. The previous example uses the **nameidentifier** claim. You'll have to change this to the appropriate claim type for the immutable ID in your environment.

**Rule 4: Issue objectGuid as immutable ID if ms-ds-consistencyGuid is not present**

```claim-rule-language
c1:[Type == "urn:anandmsft:tmp/idflag", Value =~ "useguid"]
&& c2:[Type == "http://contoso.com/ws/2016/02/identity/claims/objectguid"]
=> issue(Type = "http://schemas.microsoft.com/LiveID/Federation/2008/05/ImmutableID", Value = c2.Value);
```

In this rule, you're simply checking the temporary flag **idflag**. You decide whether to issue the claim based on its value.

> [!NOTE]
> The sequence of these rules is important.

### SSO with a subdomain UPN

You can add more than one domain to be federated by using Azure AD Connect, as described in [Add a new federated domain](how-to-connect-fed-management.md#addfeddomain). Azure AD Connect version 1.1.553.0 and latest creates the correct claim rule for issuerID automatically. If you cannot use Azure AD Connect version 1.1.553.0 or latest, it is recommended that [Azure AD RPT Claim Rules](https://aka.ms/aadrptclaimrules) tool is used to generate and set correct claim rules for the Azure AD relying party trust.

## Next steps
Learn more about [user sign-in options](plan-connect-user-signin.md).
