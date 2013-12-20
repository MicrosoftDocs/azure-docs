<properties umbracoNaviHide="0" pageTitle="Windows Azure AD Integration with Google Apps" metaKeywords="Windows Azure Google Apps Integration" description="Learn about integrating Windows Azure AD with Google Apps." linkid="documentation-services-identity-windows-azure-ad-integration-with-google=apps" urlDisplayName="Windows Azure AD Integration with Google Apps" headerExpose="" footerExpose="" disqusComments="0" writer="billmath" editor="lisatoft" manager="terrylan" title="Windows Azure AD Integration with Google Apps"/>

The objective of this tutorial is to show the integration of Windows Azure and Google Apps. The scenario outlined in this tutorial assumes that you already have the following items:

- A valid Windows Azure subscription
- A test tenant in Googe Apps

If you don't have a valid tenant in Google Apps yet, you can, for example, sign up for a trial account at Google Apps for Business web site.

The scenario outlined in this tutorial consists of the following building blocks:

Enabling the application integration for Google Apps
Configuring single sign-on
Enabling Google Apps API Access
Adding custom domains
Configuring user provisioning

# Enabling the application integration for Google Apps #
The objective of this section is to outline how to enable the application integration for Google Apps.

## To enable the application integration for Google Apps, perform the following steps: ##

1.  In the Windows Azure Management Portal, on the left navigation pane, click **Active Directory**.
2.  From the **Directory** list, select the directory for which you want to enable directory integration.
3.  To open the applications view, in the directory view, click **Applications** in the top menu.
4.  Click **Add** at the bottom to open the **Add Application** dialog.
5.  On the **Integrate an app with Windows Azure AD** dialog, click **Manage access to an application**.
6.  On the **Select an application** to manage page, select **Google Apps** from the list of applications.
7.  Click the **Complete** button to add the application and close the dialog.

# Configuring single sign-on #
The objective of this section is to outline how to enable users to authenticate to Google Apps with their account in Windows Azure AD using federation based on the SAML protocol.

## To configure federated single sign-on, perform the following steps: ##
<ol>
<li>In the Windows Azure Management Portal, select <strong>Active Directory</strong> in the left navigation pane to open the active directory dialog page.</li>
<li>In the directory list, select your directory to open your directory's configuration page.</li>
<li>Select <strong>APPLICATIONS</strong> from the top level menu.</li>
<li>From the list of applications, select <strong>Google Apps</strong> to open the google apps configuration dialog.</li>
<li>To open the <strong>CONFIGURE SINGLE SIGN-ON</strong> dialog, click <strong>Configure single sign-on.</strong>

![Google_Tutorial_01](./media/integration-azure-google-apps/Google_Tutorial_01.png)
</li>

<li>On the Select the single sign-on mode for this app dialog page, select Users authenticate with their account in Windows Azure AD as MODE, and then click the Next button.<p></p>
![Google_Tutorial_02](./media/integration-azure-google-apps/Google_Tutorial_02.png)
</li>
<li>On the <strong>Configure App URL</strong> dialog page, in the <strong>GOOGLE APPS TENANT URL</strong> textbox, type the Google Apps tenant URL, and then click the <strong>Next</strong> button.
<p></p>
![Google_Tutorial_03](./media/integration-azure-google-apps/Google_Tutorial_03.png)
</li>
<li>On the <strong>Configure single sign-on at Google Apps</strong> dialog page perform the following steps, and then click the <strong>Complete</strong> button.
		<ul>
 		<li>Click <strong>Download certificate</strong>, and then save the certificate as <strong>c:\googleapps.cer</strong>.</li>
		<li>Open the Google Apps login page, and then sign-on
<p></p>
![Google_Tutorial_04](./media/integration-azure-google-apps/Google_Tutorial_04.png)</li>

		<li>On the <strong>Admin console</strong>, click Security
<p></p>
![Google_Tutorial_05](./media/integration-azure-google-apps/Google_Tutorial_05.png)</li>
</ul>

<p></p>If the Security icon is not visible, you should click More controls on the bottom of the page.<p></p></li>
<li>On the <strong>Security</strong> page, click <strong>Advanced</strong> settings.
![Google_Tutorial_06](./media/integration-azure-google-apps/Google_Tutorial_06.png)</li>
<li>In the <strong>Advanced</strong> settings section of the page, select <strong>Set up single sign-on</strong>.
![Google_Tutorial_07](./media/integration-azure-google-apps/Google_Tutorial_07.png)</li>
<li>On the Set up single sign-on page, perform the following steps:
![Google_Tutorial_08](./media/integration-azure-google-apps/Google_Tutorial_08.png)
	<ul>
		<li>Select <strong>Enable Single Sign-on</strong>.</li>

		<li>On the <strong>Configure single sign-on at Google Apps</strong> page in the Windows Azure AD Portal, copy the <strong>SINGLE SIGN-ON URL</strong>, and then paste it into the related textbox on the <strong>Security page</strong> in the Google Apps <strong>Admin console</strong>.</li>

		<li>On the <strong>Configure single sign-on at Google Apps</strong> page in the Windows Azure AD Portal, copy the <strong>Single sign-out service URL</strong>, and then paste it into the related textbox on the <strong>Security</strong> page in the Google Apps <strong>Admin console</strong>.</li>

		<li>On the <strong>Configure single sign-on at Google Apps</strong> page in the Windows Azure AD Portal, copy the <strong>Change password URL</strong>, and then paste it into the related textbox on the <strong>Security</strong> page in the Google Apps <strong>Admin console</strong>.</li>

		<li>Click the <strong>Browse</strong> button to locate the <strong>Verification certificate</strong>, and then click Upload.</li>
		<li>Click <strong>Save</strong> changes.</li>
</ul>
</li>
<li>On the <strong>Configure single sign-on at Google Apps</strong> page in the Windows Azure AD Portal, click the Complete button.</li>
</ol>
You can now go to the [Access Panel](https://login.microsoftonline.com/login.srf?wa=wsignin1.0&rpsnv=2&ct=1384289458&rver=6.1.6206.0&wp=MCMBI&wreply=https:%2F%2Faccount.activedirectory.windowsazure.com%2Flanding.aspx%3Ftarget%3D%252fapplications%252fdefault.aspx&lc=1033&id=500633) and test single sign-on to Google Apps.

# Enabling Google Apps API Access #
When integrating Windows Azure Active Directory with Google Apps for user provisioning, you must enable API access for your tenant in Google Apps.

## To enable Google Apps API access ##
<ol>
<li>Sing-on to your Google Apps tenant.</li>
<li>In the <strong>Admin console</strong>, click <strong>Security</strong>.<p></p> 
![Google_Tutorial_05](./media/integration-azure-google-apps/Google_Tutorial_05.png)<p></p>
	If the Security icon is not visible, click More controls at the bottom of the Admin console.</li>
<li>On the Security page, click <strong>API reference</strong> to open the related configuration dialog page.</li>
<li>Select <strong>Enable API access</strong>.
![Google_Tutorial_09](./media/integration-azure-google-apps/Google_Tutorial_09.png)<p></p></li>
</ol>

# Adding custom domains #
Configuring user provisioning with Google Apps requires the Windows Azure AD domain and the Google Apps domain to have the same fully qualified domain name (FQDN). However, when you are, for example, using trial tenants to test the scenario in this tutorial, the FQDNS of your tenants typically don't match. To address this issue, you can configure custom domains in Windows Azure AD and in Google Apps. 
Configuring a custom domain requires access to your public domain's DNS zone file. 

![Google_Tutorial_10](./media/integration-azure-google-apps/Google_Tutorial_10.png)

##To add a custom domain in Windows Azure AD, perform the following steps: ##

<ol>
<li>In the Windows Azure Management Portal, select <strong>Active Directory</strong> in the left navigation pane to open the <strong>active directory</strong> dialog page.</li>
<li>In the directory list, select your directory to open your directory's configuration page.</li>
<li>Select <strong>DOMAINS</strong> from the top level menu.</li>
<li>To open the <strong>ADD DOMAIN NAME</strong> textbox, type your domain name, and then click <strong>add</strong>.</li>
<li>Click <strong>Next</strong> to open the <strong>Verify your domain name</strong> dialog page.
<p></p>![Google_Tutorial_11](./media/integration-azure-google-apps/Google_Tutorial_11.png)</li>
<li>Select a <strong>RECORD TYPE</strong>, and then register the selected record in your DNS zone file.
<p></p>![Google_Tutorial_12](./media/integration-azure-google-apps/Google_Tutorial_12.png)</li>
<li>Using the <strong>nslookup command</strong>, you should verify whether the DNS record has been successfully registered.
<p></p>![Google_Tutorial_13](./media/integration-azure-google-apps/Google_Tutorial_13.png)</li>
</ol>
## To add a custom domain in Google Apps, perform the following steps:##
<ol>
<li>Sing-on to your Google Apps tenant.</li>
<li>In the <strong>Admin console</strong>, click <strong>Domains</strong>. 
<p></p>![Google_Tutorial_14](./media/integration-azure-google-apps/Google_Tutorial_14.png)</li>
<li>Click <strong>Add a custom domain</strong>.
<p></p>![Google_Tutorial_15](./media/integration-azure-google-apps/Google_Tutorial_15.png)</li>
<li>Click <strong>Use a domain you already own</strong>, and then click <strong>Continue</strong>.
<p></p>![Google_Tutorial_16](./media/integration-azure-google-apps/Google_Tutorial_16.png)</li>
<li>Type the name of your custom domain, and then click <strong>Continue</strong>.
<p></p>![Google_Tutorial_17](./media/integration-azure-google-apps/Google_Tutorial_17.png)</li>
<li>Complete the steps to verify ownership of the domain.
	
	<p></p>If you have already federated single sign-on configured, you must update the Google Apps tenant URL in your federated single ign-on configuration.</li>
</ol>



# Configuring user provisioning #
The objective of this section is to outline how to enable provisioning of Active Directory user accounts to Google Apps.

## To configure user provisioning, perform the following steps: ##
<ol>
<li>In the Windows Azure Management Portal, select <strong>Active Directory</strong> in the left navigation pane to open the <strong>active directory</strong> dialog page.</li>
<li>In the directory list, select your directory to open your directory's configuration page.</li>
<li>Select <strong>APPLICATIONS</strong> from the top level menu.</li>
<li>From the list of applications, select <strong>Google Apps</strong> to open the <strong>google apps</strong> configuration dialog.</li>
<li>To open the <strong>CONFIGURE ACCOUNT SYNC</strong> dialog, click <strong>Configure account sync</strong>.</li>
<li>On the <strong>CONFIGURE ACCOUNT SYNC</strong> dialog page, provide the Google Apps domain name, the Google Apps user name and the Google Apps password, and then click the <strong>Next</strong> button.
<p></p>![Google_Tutorial_18](./media/integration-azure-google-apps/Google_Tutorial_18.png)</li>
<li>On the <strong>Confirmation</strong> dialog page, click the <strong>Complete</strong> button to close the <strong>CONFIGURE ACCOUNT SYNC</strong> dialog.</li>
</ol>
You can now create a test account, wait for 10 minutes and verify that the account has been synchronized to Google Apps.

See Also
[Best Practices for Managing the Application access enhancements for Windows Azure Active Directory
Application Access](http://social.technet.microsoft.com/wiki/contents/articles/18409.best-practices-for-managing-the-application-access-enhancements-for-windows-azure-active-directory.aspx)
 
