---
title: Enable remote access to SharePoint with Azure AD App Proxy | Microsoft Docs
description: Covers the basics about Azure AD Application Proxy connectors.
services: active-directory
documentationcenter: ''
author: kgremban
manager: femila

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/12/2017
ms.author: kgremban

---

# Enable remote access to SharePoint with Azure AD App Proxy

This article discusses how to integrate SharePoint server on-premises to Azure AD application proxy.

> [!NOTE]
> Application Proxy is a feature that is available only if you upgraded to the Premium or Basic edition of Azure Active Directory. For more information, see [Azure Active Directory editions](active-directory-editions.md).
> 

##Prerequisites

This article assumes that you already have SharePoint 2013 or newer already setup and running in your environment. In addition, consider the following prerequisites:

* SharePoint includes native Kerberos support. Therefore, users accessing internal sites remotely through the Azure AD Application Aroxy can assume to have a seamless single sign-on experience.

* You will need to make a few configuration changes to your SharePoint server. We recommend using a staging environment. This way you can make updates to your staging server first, and then facilitate a testing cycle before going into production.

* We assume that you have already setup SSL for SharePoint, as we require SSL on the published URL. You will need to have SSL enabled on your internal site, to ensure that links are sent/mapped correctly. If you haven't configured SSL, then see [Configure SSL for SharePoint 2013](https://blogs.msdn.microsoft.com/fabdulwahab/2013/01/20/configure-ssl-for-sharepoint-2013), which has instructions for setting up SSL. Also, make sure that the connector machine trusts the certificate that you issue. (This does not need to be a publicly issued certificate.)

##Steps to set up SharePoint

Follow these steps to enable remote access to SharePoint with Azure AD App Proxy:

**Part 1: Configure single sign-on (SSO)**

  * Step A. Ensure that SharePoint server is running as a service account.
  * Step B. Configure SharePoint for Kerberos.
  * Step C. Set a service principal name (SPN) for the account that is assigned to SharePoint.
  * Step D. Ensure that the connector is set as a trusted delegate to SharePoint.

**Part 2: Enable secure remote access**

 * Publish the SharePoint farm to Azure AD App Proxy.

**Part 3: Ensure that SharePoint knows about the external URL**

 * Set alternate access mappings in SharePoint.

### Part 1: Set up single sign-on (SSO) to SharePoint

Our customers want the best SSO experience to their backend applications, SharePoint server in this case. In this common Azure AD scenario, the user will authenticate only once, as they will not be prompted for authentication again.

For on-premises applications that require or use Windows authentication, this can be achieved using the Kerberos authentication protocol and a feature called Kerberos constrained delegation (KCD). KCD, when configured, allows the application proxy connector to obtain a windows ticket/token for a given user, even if the user hasn’t logged into Windows directly. To learn more about KCD, see [Kerberos Constrained Delegation Overview](https://technet.microsoft.com/en-us/library/jj553400.aspx).

Follow the steps below to set this up for a SharePoint server.

**Step A: Ensure that SharePoint is running under a service account, not local system, local service or network service**

The first thing you need to do is to make sure that SharePoint is running under a defined service account. You need to do this so that we can attach service principal names (SPNs) to a valid account. SPNs are how the Kerberos protocol identifies different services. And you will need it later to configure the KCD.

To ensure that your sites are running under a defined service account, do the following:

1. Open the **SharePoint 2013 Central Administration** site.
2. Go to **Security** and choose **Configure service accounts**.
3. Select **Web Application Pool – SharePoint – 80**. The options may be slightly different based on the name of your Web pool, or if it uses SSL by default.

  ![AzureAD Application Proxy Connectors](./media/application-proxy-remote-sharepoint/remote-sharepoint-service-web-application.png)

4. If the **Select an account for this component** is **Local Service** or **Network Service** then you need to create an account. If not, you're all done and can move to the next step. 
5. Choose **Register new managed account**. Once your account is created, you must set the **Web Application Pool** before you can use the account.

> [!NOTE]
You will need to have a pre-created AD account for the service. We suggest you allow for an automatic password change. For more details about the full set of steps and troubleshooting issue, see [Configure automatic password change in SharePoint 2013](https://technet.microsoft.com/EN-US/library/ff724280.aspx). 

**Step B: Configure SharePoint for Kerberos**

We use KCD to perform single sign-on (SSO) to the SharePoint server, and this only works with Kerberos. 

To configure your SharePoint site for Kerberos authentication:

1. Open the **SharePoint 2013 Central Administration** site.
2. Go to **Application Management**, choose **Manage web applications** and select your SharePoint site. IN this example, it is **SharePoint – 80**.

  ![AzureAD Application Proxy Connectors](./media/application-proxy-remote-sharepoint/remote-sharepoint-manage-web-applications.png)
  
3. Click **Authentication Providers** in the toolbar.
4. In the **Authentication Providers** box, click **Default Zone** to view the settings.
5. In the **Edit Authentication** box, scroll down until you see **Claims Authentication Types** and ensure that both **Enable Windows Authentication** and **Integrated Windows Authentication** are both checked. 
6. In the drop-down box, make sure **Negotiate (Kerberos)** is selected.

  ![AzureAD Application Proxy Connectors](./media/application-proxy-remote-sharepoint/remote-sharepoint-service-edit-authentication.png)

7. At the very bottom of the **Edit Authentication** box, click **Save**.

**Step C: Set an SPN for the SharePoint Service Account**

Before configuring the KCD, we need to identify the SharePoint service running as the service account that you've configured above. We do this by setting a service principal name (SPN). For more information, see [Service Principal Names](https://technet.microsoft.com/en-us/library/cc961723.aspx).

The SPN format is:

```
<service class>/<host>:<port>
```

_service class_ is a unique name for the service. For SharePoint we  use HTTP.

_host_ is the fully qualified domain or Netbios name of the host that the service is running on. In the case of a SharePoint site, this may need to be the URL of the site, depending on the version of IIS that you are using.

_port_ is optional. If the FQDN of the SharePoint server is:

```
sharepoint.demo.o365identity.us
```

Then the SPN would be: 

```
HTTP/ sharepoint.demo.o365identity.us demo
```

In addition to this, you may also need to set SPNs for specific sites on your server. For more details, see [Configure Kerberos authentication](https://technet.microsoft.com/en-us/library/cc263449(v=office.12).aspx). Be sure to pay close attention to the section "Create Service Principal Names for your Web applications using Kerberos authentication". 

The easiest way for you to do this is to follow the SPN formats that may already be present for your site. Copy those SPNs to register against the service account. To do this:

1. Browse to thesite with the SPN from another machine. 
 When you do, the relevant set of Kerberos tickets are cached on the machine. These tickets contain the SPN of the target site that you browsed to. We can pull the SPN for that site using a tool called [Klist](http://web.mit.edu/kerberos/krb5-devel/doc/user/user_commands/klist.html).
 
2. In a command window running in the same context as the user who accessed the site in the browser, run the following command: 
```
Klist
```
3. It will return the set of target service SPNs. In this example, the highlighted value is the SPN needed:

  ![AzureAD Application Proxy Connectors](./media/application-proxy-remote-sharepoint/remote-sharepoint-target-service.png)
  
4. Now that you have the SPN, you need to make sure that it is configured correctly on the service account set up for the Web Application earlier. Follow the steps in the next section.

**Set the SPN**

To set the SPN, run the command below from the command prompt as an Administrator of the domain.

```
setspn -S http/sharepoint.demo.o365identity.us demo\sp_svc
```

This command sets the SPN for the SharePoint service account running as _demo\sp_svc_.

Remember to replace _http/sharepoint.demo.o365identity.us_ with the SPN for your server and _demo\sp_svc_ with the service account in your environment. The setspn command will search for the SPN before it adds it. In this case, you may see a **Duplicate SPN Value** error. If you see this error, make sure that the value is associated with the service account.

You can verify that the SPN was added by running the Setspn command with the -l option. To learn more about the Setspn tool, see [Setspn](https://technet.microsoft.com/en-us/library/cc731241.aspx).

**Step D: Ensure connectors are trusted to delegate to SharePoint**

In this step, you will configure the KCD so that the Azure AD App Proxy service is capable of delegating user identities to the SharePoint service. You do this by enabling the App Proxy connector to be able to retrieve Kerberos tickets for your users who have been authenticated in Azure AD. Then that server will pass the context to the target application, or SharePoint in this case. 

To configure the KCD, you will need to repeat the following steps for each connector machine:

1. Login as a domain Administrator to a DC, and then open **Active Directory Users and Computers**.
2. Find the computer that the connector is running on. In this example, it is the same server SharePoint.
3. Double-click the computer, and then the **Delegation** tab.
4. Ensure that the delegations settings are set to **Trust this computer for delegation to the specified services only**, and then select **Use any authentication protocol**.

  ![AzureAD Application Proxy Connectors](./media/application-proxy-remote-sharepoint/remote-sharepoint-delegation-box.png)
  
5. Now you need to add the SPN that you created earlier for the service account. Clicking the **Add** button, then **Users or Computers**, and locate the account you created earlier.

  ![AzureAD Application Proxy Connectors](./media/application-proxy-remote-sharepoint/remote-sharepoint-users-computers.png)

 You should see a list of SPNs to choose from. You need to add the one that you set above. 
6. Select that item and click **OK**. Click **OK** again to save the change.

### Part 2: Enable remote access to SharePoint

Now that you’ve enabled SharePoint for Kerberos and configured KCD, you're ready to set up single sign-on (SSO) to SharePoint. Then from the connector, you can publish SharePoint for remote access through the Azure AD Application Proxy.

**Publish SharePoint with Azure AD App Proxy**

To perform the steps below, you need to be a mamber of the Global Administrator Role within your organization's Azure Active Directory account.

1. Log in to the Azure Management portal https://manage.windowsazure.com and find your Azure AD Tenant.
2. Click **Applications**, and then click **Add**.
3. Select **Publish an application that will be accessible from outside your network**. If you don’t see this option, make sure that you have Azure AD Basic or Premium set up in the tenant.
4. In the resulting box, complete each of the options as follows: 
 * **Name**: Any value that you want, for example _SharePoint_.
 * **Internal URL**: This is the URL of the SharePoint site internally, such as https://SharePoint/. In this example, make sure to use https.
 * **Pre-authentication Method**: Select _Azure Active Directory_.

  ![AzureAD Application Proxy Connectors](./media/application-proxy-remote-sharepoint/remote-sharepoint-add-application.png)

5. Once the app is published, click the **Configure** tab.
6. Scroll down to the option **Translate URL in Headers**. The default value is _YES_, change this to _NO_. 

 SharePoint uses the _Host Header_ value to lookup the site, and also generates links based on this value. The net effect is that doing this makes sure that any link SharePoint generates is a published URL that is correctly set to use the external URL. Setting the value to _YES_ also enables the connector to forward the request to the backend application. However, setting this to _NO_ means that the connector will not send the internal host name, and instead sends the host header as the published URL to the backend application.

 Also, to ensure that SharePoint accepts this URL, you need to complete one more configuration on the SharePoint server. You'll complete this in the next section.

7. Change the **Internal Authentication Method** to _Windows Integrated_. If your Azure AD tenant uses a different UPN in the cloud to the one on-premises, then remember to update the **Delegated Login Identity** as well.
8. Set the **Internal Application SPN** to the value we set above. For example, _http/sharepoint.demo.o365identity.us_.
9. You can now assign the application to your target users.

Your application should look similar to the following:

  ![AzureAD Application Proxy Connectors](./media/application-proxy-remote-sharepoint/remote-sharepoint-internal-application-spn.png)

###Part 3: Ensure SharePoint knows about the External URL

The last step you need to take is to ensure that SharePoint can find the site based on the external URL, so that it will render links based on that external URL. You do this by configuring alternate access mappings for SharePoint.

**Configure an alternative name for the SharePoint site**

1. Open the **SharePoint 2013 Central Administration** site.
2. Under **System Settings**, select **Configure Alternate Access Mappings**. 

 This opens the **Alternate Access Mappings** box.

  ![AzureAD Application Proxy Connectors](./media/application-proxy-remote-sharepoint/remote-sharepoint-alternate-access1.png)

3. In the drop-down list beside **Alternative Access Mapping Collections**, select **Change Alternative Access Mapping Collection**.
4. Select your site, for example **SharePoint – 80**.

  ![AzureAD Application Proxy Connectors](./media/application-proxy-remote-sharepoint/remote-sharepoint-alternate-access2.png)

5. You can choose to add the published URL as either an internal URL or a public URL. This example uses a **public URL** as the extranet.
6. Click **Edit Public URLs** in the **Extranet** path, and then enter the path that you publish the application, as in the previous step. For example, _https://sharepoint-iddemo.msappproxy.net_.

  ![AzureAD Application Proxy Connectors](./media/application-proxy-remote-sharepoint/remote-sharepoint-alternate-access3.png)

7. Click **Save**. 

 You can now access the SharePoint site externally via the Azure AD Application Proxy.

##Next steps

[How to provide secure remote access to on-premises applications](active-directory-application-proxy-get-started.md)<br>
[Understand Azure AD Application Proxy Connectors](application-proxy-understand-connectors.md)<br>
[Publishing SharePoint 2016 and Office Online Server with Azure AD Application Proxy](https://blogs.technet.microsoft.com/dawiese/2016/06/09/publishing-sharepoint-2016-and-office-online-server-with-azure-ad-application-proxy/)






