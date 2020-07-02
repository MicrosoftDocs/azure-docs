---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with F5 | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and F5.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 59a87abb-1ec1-4438-be07-5b115676115f
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 11/19/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with F5

In this tutorial, you'll learn how to integrate F5 with Azure Active Directory (Azure AD). When you integrate F5 with Azure AD, you can:

* Control in Azure AD who has access to F5.
* Enable your users to be automatically signed-in to F5 with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with single sign-on in Azure AD, see [Single sign-on to applications in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

* F5 single sign-on (SSO) enabled subscription.

* Deploying the joint solution requires the following license:

	* F5 BIG-IP® Best bundle (or) 

	* F5 BIG-IP Access Policy Manager™ (APM) standalone license 

	* F5 BIG-IP Access Policy Manager™ (APM) add-on license on an existing BIG-IP F5 BIG-IP® Local Traffic Manager™ (LTM).

	* In addition to the above license, the F5 system may also be licensed with: 

		* A URL Filtering subscription to use the URL category database

		* An F5 IP Intelligence subscription to detect and block known attackers and malicious traffic
	 
		* A network hardware security module (HSM) to safeguard and manage digital keys for strong authentication

* F5 BIG-IP system is provisioned with APM modules (LTM is optional)

* Although optional, it is highly recommended to Deploy the F5 systems in a [sync/failover device group](https://techdocs.f5.com/content/techdocs/en-us/bigip-14-1-0/big-ip-device-service-clustering-administration-14-1-0.html) (S/F DG), which includes the active standby pair, with a floating IP address for high availability (HA). Further interface redundancy can be achieved using the Link Aggregation Control Protocol (LACP). LACP manages the connected physical interfaces as a single virtual interface (aggregate group) and detects any interface failures within the group.

* For Kerberos applications, an on-premises AD service account for constrained delegation.  Refer to [F5 Documentation](https://support.f5.com/csp/article/K43063049) for creating a AD delegation account.

## Access guided configuration

* Access guided configuration’ is supported on F5 TMOS version 13.1.0.8 and above. If your BIG-IP system is running a version below 13.1.0.8, please refer to the **Advanced configuration** section.

* Access guided configuration presents a completely new and streamlined user experience. This workflow-based architecture provides intuitive, re-entrant configuration steps tailored to the selected topology.

* Before proceeding to the configuration, upgrade the guided configuration by downloading the latest use case pack from [downloads.f5.com](https://login.f5.com/resource/login.jsp?ctx=719748). To upgrade, follow the below procedure.

	>[!NOTE]
	>The screenshots below are for the latest released version (BIG-IP 15.0 with AGC version 5.0). The configuration steps below are valid for this use case across from 13.1.0.8 to the latest BIG-IP version.

1. On the F5 BIG-IP Web UI, click on **Access >> Guide Configuration**.

1. On the **Guided Configuration** page, click on **Upgrade Guided Configuration** on the top left-hand corner.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure14.png) 

1. On the Upgrade Guide Configuration pop screen, select **Choose File** to upload the downloaded use case pack and click on **Upload and Install** button.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure15.png) 

1. When upgrade is completed, click on the **Continue** button.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure16.png)

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* F5 SSO can be configured in three different ways.

- [Configure F5 single sign-on for Header Based application](#configure-f5-single-sign-on-for-header-based-application)

- [Configure F5 single sign-on for Kerberos application](kerbf5-tutorial.md)

- [Configure F5 single sign-on for Advanced Kerberos application](advance-kerbf5-tutorial.md)

### Key Authentication Scenarios

* Apart from Azure Active Directory native integration support for modern authentication protocols like Open ID Connect, SAML and WS-Fed, F5 extends secure access for legacy-based authentication apps for both internal and external access with Azure AD, enabling modern scenarios (e.g. password-less access) to these applications. This include:

* Header-based authentication apps

* Kerberos authentication apps

* Anonymous authentication or no inbuilt authentication apps

* NTLM authentication apps (protection with dual prompts for the user)

* Forms Based Application (protection with dual prompts for the user)

## Adding F5 from the gallery

To configure the integration of F5 into Azure AD, you need to add F5 from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **F5** in the search box.
1. Select **F5** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for F5

Configure and test Azure AD SSO with F5 using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in F5.

To configure and test Azure AD SSO with F5, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure F5 SSO](#configure-f5-sso)** - to configure the single sign-on settings on application side.
    1. **[Create F5 test user](#create-f5-test-user)** - to have a counterpart of B.Simon in F5 that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **F5** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<YourCustomFQDN>.f5.com/`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<YourCustomFQDN>.f5.com/`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<YourCustomFQDN>.f5.com/`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [F5 Client support team](https://support.f5.com/csp/knowledge-center/software/BIG-IP?module=BIG-IP%20APM45) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up F5** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to F5.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **F5**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.
1. Click on **Conditional Access** .
1. Click on **New Policy**.
1. You can now see your F5 App as a resource for CA Policy and apply any conditional access including Multifactor Auth, Device based access control or Identity Protection Policy.

## Configure F5 SSO

- [Configure F5 single sign-on for Kerberos application](kerbf5-tutorial.md)

- [Configure F5 single sign-on for Advanced Kerberos application](advance-kerbf5-tutorial.md)

### Configure F5 single sign-on for Header Based application

### Guided Configuration

1. Open a new web browser window and sign into your F5 (Header Based) company site as an administrator and perform the following steps:

1. Navigate to **System > Certificate Management > Traffic Certificate Management > SSL Certificate List**. Select **Import** from the right-hand corner. Specify a **Certificate Name** (will be referenced Later in the config). In the **Certificate Source**, select Upload File specify the certificate downloaded from Azure while configuring SAML Single Sign on. Click **Import**.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure12.png)
 
1. Additionally, you will require **SSL Certificate for the Application Hostname. Navigate to System > Certificate Management > Traffic Certificate Management > SSL Certificate List**. Select **Import** from the right-hand corner. **Import Type** will be **PKCS 12(IIS)**. Specify a **Key Name** (will be referenced Later in the config) and the specify the PFX file. Specify the **Password** for the PFX. Click **Import**.

	>[!NOTE]
	>In the example our app name is `Headerapp.superdemo.live`, we are using a Wild Card Certificate our keyname is `WildCard-SuperDemo.live`.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure13.png)

1. We will use the Guided Experience to setup the Azure AD Federation and Application Access. Go to – F5 BIG-IP **Main** and select **Access > Guided Configuration > Federation > SAML Service Provider**. Click **Next** then click **Next** to begin configuration.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure01.png)

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure02.png)
 
1. Provide a **Configuration Name**. Specify the **Entity ID** (same as what you configured on the Azure AD Application Configuration). Specify the **Host name**. Add a **Description** for reference. Accept the remaining default entries and select and then click **Save & Next**.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure03.png) 

1. In this example we are creating a new Virtual Server as 192.168.30.20 with port 443. Specify the Virtual Server IP address in the **Destination Address**. Select the Client **SSL Profile**, select Create new. Specify previously uploaded application certificate, (the wild card certificate in this example) and the associated key, and then click **Save & Next**.

	>[!NOTE]
	>in this example our Internal webserver is running on port 888 and we want to publish it with 443.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure04.png) 

1. Under **Select method to configure your IdP connector**, specify Metadata, click on Choose File and upload the Metadata XML file downloaded earlier from Azure AD. Specify a unique **Name** for SAML IDP connector. Choose the **Metadata Signing Certificate** which was upload earlier. Click **Save & Next**.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure05.png)
 
1. Under **Select a Pool**, specify **Create New** (alternatively select a pool it already exists). Let other value be default.	Under Pool Servers, type the IP Address under **IP Address/Node Name**. Specify the **Port**. Click **Save & Next**.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure06.png)

1. On the Single Sign-On Settings screen, select **Enable Single Sign-On**. Under Selected Single Sign-On Type choose **HTTP header-based**. Replace **session.saml.last.Identity** with **session.saml.last.attr.name.Identity** under Username Source ( this variable it set using claims mapping in the Azure AD ). Under SSO Headers.

	* **HeaderName  : MyAuthorization**

	* **Header Value : %{session.saml.last.attr.name.Identity}**

	* Click **Save & Next**

	Refer Appendix for complete list of variables and values. You can add more headers as required.

	>[!NOTE]
	>Account Name Is the F5 Delegation Account Created (Check F5 Documentation).

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure07.png) 

1. For purposes of this guidance, we will skip endpoint checks.  Refer to F5 documentation for details. Select **Save & Next**.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure08.png)

1. Accept the defaults and click **Save & Next**. Refer F5 documentation for details regarding SAML session management settings.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure09.png)

1. Review the summary screen and select **Deploy** to configure the BIG-IP. click on **Finish**.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure10.png)

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure11.png)

## Advanced Configuration

This section is intended to be used if you cannot use the Guided configuration or would like to add/modify additional Parameters. You will require a TLS/SSL certificate for the Application Hostname.

1. Navigate to **System > Certificate Management > Traffic Certificate Management > SSL Certificate List**. Select **Import** from the right-hand corner. **Import Type** will be **PKCS 12(IIS)**. Specify a **Key Name** (will be referenced Later in the config) and the specify the PFX file. Specify the **Password** for the PFX. Click **Import**.

	>[!NOTE]
	>In the example our app name is `Headerapp.superdemo.live`, we are using a Wild Card Certificate our keyname is `WildCard-SuperDemo.live`.
  
	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure17.png)

### Adding a new Web Server to BigIP-F5

1. Click on **Main > IApps > Application Services > Application > Create**.

1. Provide the **Name** and under **Template** choose **f5.http**.
 
	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure18.png)

1. We will publish our HeaderApp2 externally as HTTPS in this case, **how should the BIG-IP system handle SSL Traffic**? we specify **Terminate SSL from Client, Plaintext to servers (SSL Offload)**. Specify your Certificate and Key under **Which SSL certificate do you want to use?** and **Which SSL private key do you want to use?**. Specify the Virtual Server IP under **What IP Address do you want to use for the Virtual Server?**. 

	* **Specify other details**

		* FQDN  

		* Specify exiting app pool or create a new one.

		* If creating a new App Server specify **internal IP Address** and **port number**.

		![F5 (Header Based) configuration](./media/headerf5-tutorial/configure19.png) 

1. Click **Finished**.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure20.png) 

1. Ensure the App Properties can be modified. Click **Main > IApps > Application Services: Applications >> HeaderApp2**. Uncheck **Strict Updates** (we will modify some setting outside of the GUI). Click **Update** button.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure21.png) 

1. At this point you should be able to browse the virtual Server.

### Configuring F5 as SP and Azure as IDP

1.	Click **Access > Federation> SAML Service Provider > Local SP Service > click create or + sign**.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure22.png)

1. Specify Details for the Service Provider Service. Specify **Name** representing F5 SP Configuration. Specify **Entity ID** (generally same as application URL).

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure23.png)

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure24.png)

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure25.png)

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure26.png)

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure27.png)

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure28.png)

### Create Idp Connector

1. Click **Bind/Unbind IdP Connectors** button, select **Create New IdP Connector** and choose From **Metadata** option then perform the following steps:
 
	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure29.png)

	a. Browse to metadata.xml file downloaded from Azure AD and specify an **Identity Provider Name**.

	b. Click **ok**.

	c. The connector is created, and certificate is ready automatically from the metadata xml file.
	
	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure30.png)

	d. Configure F5BIG-IP to send all request to Azure AD.

	e. Click **Add New Row**, choose **AzureIDP** (as created in previous steps, specify 

	f. **Matching Source   =  %{session.server.landinguri}** 

	g. **Matching Value     = /***

	h. Click **update**

	i. Click **OK**

	j. **SAML IDP setup is completed**
	
	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure31.png)

### Configure F5 Policy to redirect users to Azure SAML IDP

1. To configure F5 Policy to redirect users to Azure SAML IDP, perform the following steps:

	a. Click **Main > Access > Profile/Policies > Access Profiles**.

	b. Click on the **Create** button.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure32.png)
 
	c. Specify **Name** (HeaderAppAzureSAMLPolicy in the example).

	d. You can customize other settings please refer to F5 Documentation.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure33.png)

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure34.png) 

	e. Click **Finished**.

	f. Once the Policy creation is completed, click on the Policy and go to the **Access Policy** Tab.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure35.png)
 
	g. Click on the **Visual Policy editor**, edit **Access Policy for Profile** link.

	h. Click on the + Sign in the Visual Policy editor and choose **SAML Auth**.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure36.png)

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure37.png)
 
	i. Click **Add Item**.

	j. Under **Properties** specify **Name** and under **AAA Server** select the previously configured SP, click **SAVE**.
 
	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure38.png)

	k. The basic Policy is ready you can customize the policy to incorporate additional sources/attribute stores.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure39.png)
 
	l. Ensure you click on the **Apply Access Policy** link on the top.

### Apply Access Profile to the Virtual Server

1. Assign the access profile to the Virtual Server in order for F5 BIG-IP APM to apply the profile settings to incoming traffic and run the previously defined access policy.

	a. Click **Main** > **Local Traffic** > **Virtual Servers**.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure40.png)
 
	b. Click on the virtual server, scroll to **Access Policy** section, in the **Access Profile** drop down and select the SAML Policy created (in the example HeaderAppAzureSAMLPolicy)

	c. Click **update**
 
	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure41.png)

	d. create an F5 BIG-IP iRule® to extract the custom SAML attributes from the incoming assertion and pass them as HTTP headers to the backend test application. Click **Main > Local Traffic > iRules > iRule List > click create**

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure42.png)
 
	e. Paste the F5 BIG-IP iRule text below into the Definition window.

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure43.png)
 
	when RULE_INIT {
 	set static::debug 0
	}
	when ACCESS_ACL_ALLOWED {

 	set AZUREAD_USERNAME [ACCESS::session data get "session.saml.last.attr.name.http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
 	if { $static::debug } { log local0. "AZUREAD_USERNAME = $AZUREAD_USERNAME" }
 	if { !([HTTP::header exists "AZUREAD_USERNAME"]) } {
 	HTTP::header insert "AZUREAD_USERNAME" $AZUREAD_USERNAME
 	}

 	set AZUREAD_DISPLAYNAME [ACCESS::session data get "session.saml.last.attr.name.http://schemas.microsoft.com/identity/claims/displayname"]
 	if { $static::debug } { log local0. "AZUREAD_DISPLAYNAME = $AZUREAD_DISPLAYNAME" }
 	if { !([HTTP::header exists "AZUREAD_DISPLAYNAME"]) } {
 	HTTP::header insert "AZUREAD_DISPLAYNAME" $AZUREAD_DISPLAYNAME
 	}

 	set AZUREAD_EMAILADDRESS [ACCESS::session data get "session.saml.last.attr.name.http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]
 	if { $static::debug } { log local0. "AZUREAD_EMAILADDRESS = $AZUREAD_EMAILADDRESS" }
 	if { !([HTTP::header exists "AZUREAD_EMAILADDRESS"]) } {
 	HTTP::header insert "AZUREAD_EMAILADDRESS" $AZUREAD_EMAILADDRESS }}

	**Sample output below**

	![F5 (Header Based) configuration](./media/headerf5-tutorial/configure44.png)
 
### Create F5 test user

In this section, you create a user called B.Simon in F5. Work with [F5 Client support team](https://support.f5.com/csp/knowledge-center/software/BIG-IP?module=BIG-IP%20APM45) to add the users in the F5 platform. Users must be created and activated before you use single sign-on. 

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the F5 tile in the Access Panel, you should be automatically signed in to the F5 for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try F5 with Azure AD](https://aad.portal.azure.com/)

- [Configure F5 single sign-on for Kerberos application](kerbf5-tutorial.md)

- [Configure F5 single sign-on for Advanced Kerberos application](advance-kerbf5-tutorial.md)

