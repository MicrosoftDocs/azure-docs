<properties
	pageTitle="Active Directory Federation Services Management and customization with Azure AD Connect | Microsoft Azure"
	description="AD FS management using Azure AD Connect and customization of user AD FS sign-in experience using Azure AD Connect and Powershell."
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

This article details the various Active Directory Federation Services (AD FS) related tasks that can be performed using Azure AD Connect and other common AD FS tasks that may be required for a complete configuration of an AD FS farm.

| Topic | What it covers |
|:------|:-------------|
|**AD FS management**|
|[Repairing the trust](#repairthetrust)| Repairing the federation trust with O365. |
|[Adding a new AD FS server](#addadfsserver) | Expanding the AD FS farm with additional AD FS server|
|[Adding a new AD FS web application proxy server](#addwapserver) | Expanding the AD FS farm with additional WAP server|
|[Add a new federated domain](#addfeddomain)| Add a federated domain|
| **AD FS Customization**|
|[Add custom company logo or illustration](#customlogo)| Customize A FS sign-in page with company logo and illustration |
|[Add sign-in description](#addsignindescription) | Add sign-in page description |
|[Modifying AD FS claim rules](#modclaims) | Modify AD FS claims for various federation scenarios |

## AD FS management

Azure AD Connect provides various AD FS related tasks that can be performed using the Azure AD Connect wizard with minimal user intervention. After you have finished installing Azure AD Connect by running the wizard, you can run the wizard again to perform additional tasks.

### Repairing the trust <a name=repairthetrust></a>

Azure AD Connect can check for the current health of the AD FS and Azure ADtrust and take appropriate actions to repair the trust. Follow the below steps to repair your Azure AD and AD FS trust.

Select **Repair AAD and ADFS trust** from the list of tasks available.

![](media\active-directory-aadconnect-federation-management\RepairADTrust1.PNG)

On the **Connect to Azure AD** page provide your global administrator credentials for Azure AD and click Next.

![](media\active-directory-aadconnect-federation-management\RepairADTrust2.PNG)

On the **Remote access credentials** page, give the credentials for the domain administrator

![](media\active-directory-aadconnect-federation-management\RepairADTrust3.PNG)

When you click on next, Azure AD Connect will check for certificate health and will show any issues if they exist.

![](media\active-directory-aadconnect-federation-management\RepairADTrust4.PNG)

**Ready to configure** page will show the list of actions that will be performed in order to repair the trust.

![](media\active-directory-aadconnect-federation-management\RepairADTrust5.PNG)

Click on install to go ahead and repair the trust.

>[AZURE.NOTE] Azure AD Connect can only repair / take action on the certificates that are self signed. Third party certificates cannot be repaired by Azure AD Connect.

### Adding a new AD FS server <a name=addadfsserver></a>

> [AZURE.NOTE] Azure AD Connect requires the PFX certifcate file to add an AD FS server. Therefore, you will be able to perform this operation only if you configured the AD FS farm using Azure AD Connect.

Select **Deploy an additional Federation server** and click Next.

![](media\active-directory-aadconnect-federation-management\AddNewADFSServer1.PNG)

On the **Connect to Azure AD** page provide your global administrator credentials for Azure AD and click Next.

![](media\active-directory-aadconnect-federation-management\AddNewADFSServer2.PNG)

Provide the domain administrator credentials on the next page.

![](media\active-directory-aadconnect-federation-management\AddNewADFSServer3.PNG)

On the next page, Azure AD Connect will ask you for the password of the pfx file that you provided while configuring your new AD FS farm with Azure AD Connect. Click on Enter Password to provide the password for the PFX file.

![](media\active-directory-aadconnect-federation-management\AddNewADFSServer4.PNG)

![](media\active-directory-aadconnect-federation-management\AddNewADFSServer5.PNG)

On the next page, provide the additional server(s) name or IP address to be added to the AD FS farm.

![](media\active-directory-aadconnect-federation-management\AddNewADFSServer6.PNG)

Click on Next and go through the final Configure page. After Azure AD Connect has finished adding the servers to the AD FS farm, you will be given the option to verify the connectivity.

![](media\active-directory-aadconnect-federation-management\AddNewADFSServer7.PNG)

![](media\active-directory-aadconnect-federation-management\AddNewADFSServer8.PNG)

### Adding a new AD FS web application proxy server <a name=addwapserver></a>

> [AZURE.NOTE] Azure AD Connect requires the PFX certifcate file to add a web application proxy server. Therefore, you will be able to perform this operation only if you configured the AD FS farm using Azure AD Connect.

Select **Deploy Web Application Proxy** from the list of available tasks.

![](media\active-directory-aadconnect-federation-management\WapServer1.PNG)

On the next page, provide the Azure global administrator credentials.

![](media\active-directory-aadconnect-federation-management\wapserver2.PNG)

Next, you will be presented with the **Specify SSL certificate** page where you need to provide the password for the PFX file that you provided while configuring the AD FS farm with Azure AD Connect.

![](media\active-directory-aadconnect-federation-management\WapServer3.PNG)

![](media\active-directory-aadconnect-federation-management\WapServer4.PNG)

On the next page, add the server to be added as a web application proxy. Since the web application proxy server may or may not be joined to the domain, the wizard will ask for administrative credentials to the server being added.

![](media\active-directory-aadconnect-federation-management\WapServer5.PNG)

On the **Proxy trust credentials** page, provide administrative credentials to configure the proxy trust and access the primary server in the AD FS farm.

![](media\active-directory-aadconnect-federation-management\WapServer6.PNG)

On the **Ready to configure** page, the wizard shows the list of actions that will be performed.

![](media\active-directory-aadconnect-federation-management\WapServer7.PNG)

Click on Install to finish the configuration. After the configuration is complete, wizard gives you the option to verify the connectivity to the servers. Click on verify to check connectivity.

![](media\active-directory-aadconnect-federation-management\WapServer8.PNG)

### Add a new federated domain <a name=addfeddomain></a>

It is easy to add a new domain to be federated with Azure AD using Azure AD Connect. Azure AD Connect not only adds the new domain for federation but modifies the claim rules in order to correctly reflect the issuer when you have multiple domains federated with Azure AD.

To add a new federated domain, select the task **Add an additional Azure AD domain**.

![](media\active-directory-aadconnect-federation-management\AdditionalDomain1.PNG)

On the next page of the wizard, provide the global administrator credentials for Azure AD.

![](media\active-directory-aadconnect-federation-management\AdditionalDomain2.PNG)

On the remote access credentials provide the domain administrator credentials.

![](media\active-directory-aadconnect-federation-management\additionaldomain3.PNG)

On the next page the wizard will provide a list of Azure AD domains with which you want to federate your on-premises directory. Choose the domain from the list.

![](media\active-directory-aadconnect-federation-management\AdditionalDomain4.PNG)

After you choose the domain, the wizard will provide you with appropriate information regarding further actions that the wizard will take and the impact of the configuration. In some cases, if you select a domain which is not yet verified in Azure AD the wizard will provide you with information to help you verify the domain. See [Add your custom domain name to Azure Active Directory](active-directory-add-domain.md) for more details on how to verify your domain.

Click on next and **Ready to configure** page will show the list of actions that Azure AD Connect will be performing. Click on Install to finish the configuration.

![](media\active-directory-aadconnect-federation-management\AdditionalDomain5.PNG)

## AD FS customization

The following sections provide details on how you can perform some of the common tasks that you may have to do for customizing your AD FS sign-in page. 

### Add custom company logo or illustration <a name=customlogo></a>

To change the logo of the company that is displayed on the sign-in page, use the following PowerShell Windows PowerShell cmdlet and syntax.

> [AZURE.NOTE] The recommended dimensions for the logo are 260x35 @ 96 dpi with a file size of no greater than 10 KB.

    Set-AdfsWebTheme -TargetName default -Logo @{path="c:\Contoso\logo.PNG"}

> [AZURE.NOTE] The TargetName parameter is required. The default theme that is released with AD FS is named default.
 

### Add sign-in description <a name=addsignindescription></a>

To add a sign-in page description to the sign-in page, use the following Windows PowerShell PowerShell cmdlet and syntax.

    Set-AdfsGlobalWebContent -SignInPageDescriptionText "<p>Sign-in to Contoso requires device registration. Click <A href='http://fs1.contoso.com/deviceregistration/'>here</A> for more information.</p>"

### Modifying AD FS claim rules <a name=modclaims></a>

AD FS provides the option to specify custom rules to issue claims. It supports a rich claim language using which you can use to create custom claim rules. For more information you can check the article [here](https://technet.microsoft.com/library/dd807118.aspx). 

Following sections detail how you can write custom rules for some scenarios pertaining to Azure ADand AD FS federation.

#### Immutable ID conditional on value being present in the attribute

Azure AD Connect lets you specify an attribute to be used as source anchor when objects will be synced to Azure AD. It is possible that you might want to issue immutable ID claim depending on the condition if the value in the custom attribute is not empty. For the example, consider that you selected ms-ds-consistencyguid as the attribute for source anchor and want to issue ImmutableID as ms-ds-consistencyguid in case the attribute has a value against it, otherwise issue objectGuid as the immutable ID. You can construct the set of custom claim rules as described below:

**Rule 1  (Query Attributes)**

    c:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname"]
    => add(store = "Active Directory", types = ("http://contoso.com/ws/2016/02/identity/claims/objectguid", "http://contoso.com/ws/2016/02/identity/claims/msdsconcistencyguid"), query = "; objectGuid,ms-ds-consistencyguid;{0}", param = c.Value);

In this rule you are simply querying the values of ms-ds-consistencyguid and objectguid for the user from Active Directory. Please change the store name to appropriate store name as available in your ADFS deployment and the claims type to proper claims type you have in your federation defined for objectGUID and ms-ds-consistencyguid. I defined custom claim types in my test environment.

Also, by using ‘add’ and not ‘issue’ you avoid adding an outgoing issue for the entity and just use the values as intermediate values. You will issue the claim in later rule once you establish which value to use as immutable ID

**Rule 2: (Check if ms-ds-consistencyguid exists for the user)**

    NOT EXISTS([Type == "http://contoso.com/ws/2016/02/identity/claims/msdsconcistencyguid"])
    => add(Type = "urn:anandmsft:tmp/idflag", Value = "useguid");

This rule simply defines a temporary flag “idflag” which is set to “useguid” if there is no ms-ds-concistencyguid populated for the user. The logic behind this is the fact that ADFS does not allow empty claims. So when added claims http://contoso.com/ws/2016/02/identity/claims/objectguid and http://contoso.com/ws/2016/02/identity/claims/msdsconcistencyguid in rule 1, you will end up with msdsconsistencyguid claim ONLY if the value is populated for the user. In case it is not populated, ADFS sees that it will turn up as an empty value and drops it there and then. ObjectGuid as you know all objects will have so that claim will always be there after rule 1 is executed

**Rule 3: Issue ms-ds-consistencyguid as immutable ID if present**

    c:[Type == "http://contoso.com/ws/2016/02/identity/claims/msdsconcistencyguid"]
    => issue(Type = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier", Value = c.Value);

This is an implicit EXIST check. If the value for the claim exists, then issue that as the immutable ID. Note that I am issuing the nameidentifier claim. You will have to change this with appropriate claim type for immutable ID in your environment.

**Rule 4: Issue Object Guid as immutable ID if ms-ds-consistencyGuid is not present**

    c1:[Type == "urn:anandmsft:tmp/idflag", Value =~ "useguid"]
    && c2:[Type == "http://contoso.com/ws/2016/02/identity/claims/objectguid"]
    => issue(Type = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier", Value = c2.Value);

In this rule you are simply checking the temporary flag ‘idflag’ and based on the value decide to issue or not issue the claim.

> [AZURE.NOTE] Sequence of these rules is important.

#### SSO with a sub-domain UPN

You can add more than one domain to be federated using Azure AD Connect ([Add a new federated domain](active-directory-aadconnect-federation-management.md#add-a-new-federated-domain)). The UPN claim will need to be modified so that the issuer ID correponds to the root domain and not the sub-domain because the federated root domain covers the child as well.

By default, the claim rule for issuer ID is set as:

	c:[Type 
	== “http://schemas.xmlsoap.org/claims/UPN“]

	=> issue(Type = “http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid“, Value = regexreplace(c.Value, “.+@(?<domain>.+)“, “http://${domain}/adfs/services/trust/“));

![Default issuer id claim](media\active-directory-aadconnect-federation-management\issuer_id_default.png)

The default rule simply takes the UPN suffix and uses it in the issuer id claim. For example, John is a user in sub.contoso.com and contoso.com is federated with Azure AD. John enters john@sub.contoso.com as the username while signing in to Azure AD, then the default issuer id claim rule in AD FS will handle it in the following manner:

c:[Type 
== “http://schemas.xmlsoap.org/claims/UPN“]

=> issue(Type = “http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid“, Value = regexreplace(john@sub.contoso.com, “.+@(?<domain>.+)“, “http://${domain}/adfs/services/trust/“));

**Claim value:**  http://sub.contoso.com/adfs/services/trust/

In order to just have the root domain in the issuer claim value, change the claim rule to:

	c:[Type == “http://schemas.xmlsoap.org/claims/UPN“]

	=> issue(Type = “http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid“, Value = regexreplace(c.Value, “^((.*)([.|@]))?(?<domain>[^.]*[.].*)$”, “http://${domain}/adfs/services/trust/“));

## Next Steps

Learn more about [user sign-in options](active-directory-aadconnect-user-signin.md)

