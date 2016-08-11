<properties
	pageTitle="Active Directory Federation Services Management and customization with Azure AD Connect | Microsoft Azure"
	description="AD FS management with Azure AD Connect and customization of user AD FS sign-in experience with Azure AD Connect and PowerShell."
	keywords="AD FS,ADFS,AD FS management, AAD Connect, Connect, sign-in, AD FS customization, repair trust, O365, federation, relying party"
	services="active-directory"
	documentationCenter=""
	authors="anandyadavmsft"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/01/2016"
	ms.author="anandy"/>

# Active Directory Federation Services management and customization with Azure AD Connect

This article details tasks related to Microsoft Azure Active Directory Federation Services (AD FS) that can be performed by using Microsoft Azure Active Directory Connect, plus other common AD FS tasks that may be required for a complete configuration of an AD FS farm.

| Topic | What it covers |
|:------|:-------------|
|**AD FS management**|
|[Repair the trust](#repairthetrust)| Repairing the federation trust with Office 365 |
|[Add an AD FS server](#addadfsserver) | Expanding the AD FS farm with an additional AD FS server|
|[Add an AD FS web application proxy server](#addwapserver) | Expanding the AD FS farm with an additional WAP server|
|[Add a federated domain](#addfeddomain)| Adding a federated domain|
| **AD FS customization**|
|[Add a custom company logo or illustration](#customlogo)| Customizing an AD FS sign-in page with a company logo and illustration |
|[Add a sign-in description](#addsignindescription) | Adding a sign-in page description |
|[Modify AD FS claim rules](#modclaims) | Modifying AD FS claims for various federation scenarios |

## AD FS management

Azure AD Connect provides various tasks related to AD FS that can be performed by using the Azure AD Connect wizard with minimal user intervention. After you have finished installing Azure AD Connect by running the wizard, you can run the wizard again to perform additional tasks.

### To repair the trust <a name=repairthetrust></a>

Azure AD Connect can check for the current health of the AD FS and Azure Active Directory trust and take appropriate actions to repair the trust. Follow these steps to repair your Azure AD and AD FS trust.

1. Select **Repair AAD and ADFS Trust** from the list of available tasks.
![](media\active-directory-aadconnect-federation-management\RepairADTrust1.PNG)

2. On the **Connect to Azure AD** page, provide your global administrator credentials for Azure AD, and click **Next**.
![](media\active-directory-aadconnect-federation-management\RepairADTrust2.PNG)

3. On the **Remote access credentials** page, enter the credentials for the domain administrator.
![](media\active-directory-aadconnect-federation-management\RepairADTrust3.PNG)

    After you click **Next**, Azure AD Connect will check for certificate health and show any issues.

    ![](media\active-directory-aadconnect-federation-management\RepairADTrust4.PNG)

    The **Ready to configure** page will show the list of actions that will be performed to repair the trust.

    ![](media\active-directory-aadconnect-federation-management\RepairADTrust5.PNG)

4. Click **Install** to repair the trust.

>[AZURE.NOTE] Azure AD Connect can only repair or act on certificates that are self-signed. Azure AD Connect cannot repair third-party certificates.

### To add an AD FS server <a name=addadfsserver></a>

> [AZURE.NOTE] Azure AD Connect requires the PFX certificate file to add an AD FS server. Therefore, you can perform this operation only if you configured the AD FS farm by using Azure AD Connect.

1. Select **Deploy an additional Federation Server** and click **Next**.
![](media\active-directory-aadconnect-federation-management\AddNewADFSServer1.PNG)

2. On the **Connect to Azure AD** page, enter your global administrator credentials for Azure AD and click **Next**.
![](media\active-directory-aadconnect-federation-management\AddNewADFSServer2.PNG)

3. Provide the domain administrator credentials.
![](media\active-directory-aadconnect-federation-management\AddNewADFSServer3.PNG)

4. Azure AD Connect will ask for the password of the PFX file that you provided while configuring your new AD FS farm with Azure AD Connect. Click **Enter Password** to provide the password for the PFX file.
![](media\active-directory-aadconnect-federation-management\AddNewADFSServer4.PNG)

    ![](media\active-directory-aadconnect-federation-management\AddNewADFSServer5.PNG)

5. On the **AD FS Servers** page, enter the server name or IP address to be added to the AD FS farm.
![](media\active-directory-aadconnect-federation-management\AddNewADFSServer6.PNG)

6. Click **Next** and go through the final **Configure** page. After Azure AD Connect has finished adding the servers to the AD FS farm, you will be given the option to verify the connectivity.
![](media\active-directory-aadconnect-federation-management\AddNewADFSServer7.PNG)

    ![](media\active-directory-aadconnect-federation-management\AddNewADFSServer8.PNG)

### To add an AD FS web application proxy server <a name=addwapserver></a>

> [AZURE.NOTE] Azure AD Connect requires the PFX certificate file to add a web application proxy server. Therefore, you will be able to perform this operation only if you configured the AD FS farm by using Azure AD Connect.

1. Select **Deploy Web Application Proxy** from the list of available tasks.
![](media\active-directory-aadconnect-federation-management\WapServer1.PNG)

2. Provide the Azure global administrator credentials.
![](media\active-directory-aadconnect-federation-management\wapserver2.PNG)

3. On the **Specify SSL certificate** page, you need to provide the password for the PFX file that you provided when configuring the AD FS farm with Azure AD Connect.
![](media\active-directory-aadconnect-federation-management\WapServer3.PNG)

    ![](media\active-directory-aadconnect-federation-management\WapServer4.PNG)

4. Add the server to be added as a web application proxy. Because the web application proxy server might not be joined to the domain, the wizard will ask for administrative credentials to the server being added.
![](media\active-directory-aadconnect-federation-management\WapServer5.PNG)

5. On the **Proxy trust credentials** page, provide administrative credentials to configure the proxy trust and access the primary server in the AD FS farm.
![](media\active-directory-aadconnect-federation-management\WapServer6.PNG)

6. On the **Ready to configure** page, the wizard shows the list of actions that will be performed.
![](media\active-directory-aadconnect-federation-management\WapServer7.PNG)

7. Click **Install** to finish the configuration. After the configuration is complete, the wizard gives you the option to verify the connectivity to the servers. Click **Verify** to check connectivity.
![](media\active-directory-aadconnect-federation-management\WapServer8.PNG)

### To add a federated domain <a name=addfeddomain></a>

It's easy to add a domain to be federated with Azure AD by using Azure AD Connect. Azure AD Connect adds the domain for federation and modifies the claim rules to correctly reflect the issuer when you have multiple domains federated with Azure AD.

1. To add a federated domain, select the task **Add an additional Azure AD domain**.
![](media\active-directory-aadconnect-federation-management\AdditionalDomain1.PNG)

2. On the next page of the wizard, provide the global administrator credentials for Azure AD.
![](media\active-directory-aadconnect-federation-management\AdditionalDomain2.PNG)

3. On the **Remote access credentials** page, provide the domain administrator credentials.
![](media\active-directory-aadconnect-federation-management\additionaldomain3.PNG)

4. On the next page, the wizard will provide a list of Azure AD domains with which you can federate your on-premises directory. Choose the domain from the list.
![](media\active-directory-aadconnect-federation-management\AdditionalDomain4.PNG)

    After you choose the domain, the wizard will provide you with appropriate information regarding further actions that the wizard will take and the impact of the configuration. In some cases, if you select a domain that is not yet verified in Azure AD, the wizard will provide you with information to help you verify the domain. See [Add your custom domain name to Azure Active Directory](active-directory-add-domain.md) for more details.

5. Click **Next**, and the **Ready to configure** page will show the list of actions that Azure AD Connect will perform. Click **Install** to finish the configuration.
![](media\active-directory-aadconnect-federation-management\AdditionalDomain5.PNG)

## AD FS customization

The following sections provide details about some of the common tasks that you may have to perform when customizing your AD FS sign-in page.

### To add a custom company logo or illustration <a name=customlogo></a>

To change the logo of the company that is displayed on the **Sign-in** page, use the following Windows PowerShell cmdlet and syntax.

> [AZURE.NOTE] The recommended dimensions for the logo are 260x35 @ 96 dpi with a file size no greater than 10 KB.

    Set-AdfsWebTheme -TargetName default -Logo @{path="c:\Contoso\logo.PNG"}

> [AZURE.NOTE] The *TargetName* parameter is required. The default theme that is released with AD FS is named Default.


### To add a sign-in description <a name=addsignindescription></a>

To add a sign-in page description to the **Sign-in page**, use the following Windows PowerShell cmdlet and syntax.

    Set-AdfsGlobalWebContent -SignInPageDescriptionText "<p>Sign-in to Contoso requires device registration. Click <A href='http://fs1.contoso.com/deviceregistration/'>here</A> for more information.</p>"

### To modify AD FS claim rules <a name=modclaims></a>

AD FS supports a rich claim language that you can use to create custom claim rules. For more information, see [The Role of the Claim Rule Language](https://technet.microsoft.com/library/dd807118.aspx).

The following sections describe how you can write custom rules for some scenarios pertaining to Azure AD and AD FS federation.

#### Immutable ID conditional on a value being present in the attribute

Azure AD Connect lets you specify an attribute to be used as a source anchor when objects are synced to Azure AD. If the value in the custom attribute is not empty, you might want to issue an immutable ID claim. For example, you might select **ms-ds-consistencyguid** as the attribute for the source anchor and want to issue **ImmutableID** as **ms-ds-consistencyguid** in case the attribute has a value against it. If there is no value against the attribute, issue **objectGuid** as the immutable ID.  You can construct the set of custom claim rules as described in the following section.

**Rule 1: Query attributes**

    c:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname"]
    => add(store = "Active Directory", types = ("http://contoso.com/ws/2016/02/identity/claims/objectguid", "http://contoso.com/ws/2016/02/identity/claims/msdsconcistencyguid"), query = "; objectGuid,ms-ds-consistencyguid;{0}", param = c.Value);

In this rule, you are querying the values of **ms-ds-consistencyguid** and **objectguid** for the user from Active Directory. Change the store name to an appropriate store name in your ADFS deployment. Also change the claims type to a proper claims type for your federation as defined for **objectGUID** and **ms-ds-consistencyguid**.

Also, by using **add** and not **issue**, you avoid adding an outgoing issue for the entity and can use the values as intermediate values. You will issue the claim in a later rule once you establish which value to use as the immutable ID.

**Rule 2: Check if ms-ds-consistencyguid exists for the user**

    NOT EXISTS([Type == "http://contoso.com/ws/2016/02/identity/claims/msdsconcistencyguid"])
    => add(Type = "urn:anandmsft:tmp/idflag", Value = "useguid");

This rule defines a temporary flag called **idflag** that is set to **useguid** if there is no **ms-ds-concistencyguid** populated for the user. The logic behind this is the fact that ADFS does not allow empty claims. So when you add claims http://contoso.com/ws/2016/02/identity/claims/objectguid and http://contoso.com/ws/2016/02/identity/claims/msdsconcistencyguid in Rule 1, you end up with an **msdsconsistencyguid** claim only if the value is populated for the user. If it is not populated, ADFS sees that it will have an empty value and drops it immediately. All objects will have **ObjectGuid**, so that claim will always be there after Rule 1 is executed.

**Rule 3: Issue ms-ds-consistencyguid as immutable ID if it's present**

    c:[Type == "http://contoso.com/ws/2016/02/identity/claims/msdsconcistencyguid"]
    => issue(Type = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier", Value = c.Value);

This is an implicit **Exist** check. If the value for the claim exists, then issue that as the immutable ID. The previous example uses the **nameidentifier** claim. You will have to change this to the appropriate claim type for immutable ID in your environment.

**Rule 4: Issue Object Guid as immutable ID if ms-ds-consistencyGuid is not present**

    c1:[Type == "urn:anandmsft:tmp/idflag", Value =~ "useguid"]
    && c2:[Type == "http://contoso.com/ws/2016/02/identity/claims/objectguid"]
    => issue(Type = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier", Value = c2.Value);

In this rule, you are simply checking the temporary flag **idflag**. You decide whether to issue the claim based on its value.

> [AZURE.NOTE] The sequence of these rules is important.

#### SSO with a subdomain UPN

You can add more than one domain to be federated by using Azure AD Connect, as described in [Add a new federated domain](active-directory-aadconnect-federation-management.md#add-a-new-federated-domain). You must modify the UPN claim so that the issuer ID corresponds to the root domain and not the subdomain, because the federated root domain also covers the child.

By default, the claim rule for issuer ID is set as:

	c:[Type
	== “http://schemas.xmlsoap.org/claims/UPN“]

	=> issue(Type = “http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid“, Value = regexreplace(c.Value, “.+@(?<domain>.+)“, “http://${domain}/adfs/services/trust/“));

![Default issuer ID claim](media\active-directory-aadconnect-federation-management\issuer_id_default.png)

The default rule simply takes the UPN suffix and uses it in the issuer ID claim. For example, John is a user in sub.contoso.com, and contoso.com is federated with Azure AD. John enters john@sub.contoso.com as the user name while signing in to Azure AD, and the default issuer ID claim rule in AD FS handles it in the following manner.

    c:[Type
    == “http://schemas.xmlsoap.org/claims/UPN“]

    => issue(Type = “http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid“, Value = regexreplace(john@sub.contoso.com, “.+@(?<domain>.+)“, “http://${domain}/adfs/services/trust/“));

**Claim value:**  http://sub.contoso.com/adfs/services/trust/

To have only the root domain in the issuer claim value, change the claim rule to match the following.

	c:[Type == “http://schemas.xmlsoap.org/claims/UPN“]

	=> issue(Type = “http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid“, Value = regexreplace(c.Value, “^((.*)([.|@]))?(?<domain>[^.]*[.].*)$”, “http://${domain}/adfs/services/trust/“));

## Next steps

Learn more about [user sign-in options](active-directory-aadconnect-user-signin.md).
