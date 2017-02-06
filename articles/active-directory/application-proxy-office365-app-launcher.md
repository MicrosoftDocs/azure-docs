---
title: Set a custom home page for your published application using Azure AD App Proxy | Microsoft Docs
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
ms.date: 01/25/2017
ms.author: kgremban

---

# Set a custom home page for your published application using Azure AD App Proxy

This article discusses how you can configure your application to direct users to a custom home page, when users access your application from the Azure AD access panel and the Office 365 App Launcher.

>[!NOTE]
>Application Proxy is a feature that is available only if you upgraded to the Premium or Basic edition of Azure Active Directory. For more information, see [Azure Active Directory editions](active-directory-editions.md).
> 
 
Using the Azure AD Powershell module, you can define custom home page URLs, for those instances when you want users to land on a specific page within your application; for example https://expenseApp-contoso.msappproxy.net/login/login.aspx.

>[!NOTE]
>When you provide users access to your published applications, we display your apps in the [Azure AD Access panel](active-directory-saas-access-panel-introduction.md) and the [Office 365 App Launcher](https://blogs.office.com/2016/09/27/introducing-the-new-office-365-app-launcher). 
>

When users launch your apps, by default they're directed to the root domain URL for the published app. The landing page is typically set to the home page URL. For example, for this backend application http://ExpenseApp it is published as https://expenseApp-contoso.msappproxy.net. By default, the home page URL is set to https://expenseApp-contoso.msappproxy.net.

## Determine the home page URL

There are several things you need to be aware of before setting the home page URL:

* You must ensure that the path you specify is a subdomain path of the root domain URL.

 For example, if your published app is accessible from a home page URL https://intranet-contoso.msappproxy.net/, then the home page URL you configure must start with https://intranet-contoso.msappproxy.net/. 
 
* If the home page URL is https://apps.contoso.com/app1/, then the home page URL must start with https://apps.contoso.com/app1/.

* If you make a change to the published application, it may reset the value of the home page URL. Therefore, when you decide to update you application, you should recheck and potentially update the homepage URL.


In the next section, you will walk through how to setup a custom home page URL for your published applications. 

## Install the Azure AD Powershell module

Before you can define a custom home page URL using Powershell, you first need to install a non-standard package of the Azure AD PowerShell module.  You can download this package from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureAD/1.1.23.0), which uses the GRAPH API endpoint. 

**To install the package using Powershell:**

1. Open standard PowerShell.
2. Run the following command:

```
 Install-Module -Name AzureAD -RequiredVersion 1.1.23.0
 ```
 If you are running this as a non Admin, you need to use the _-scope currentuser_ option.
3. During installation, Select "Y" to install two packages from Nuget.org.  These are both needed to use the package. 

##Set a custom home page URL using the Azure AD Powershell module

Now that you have the Azure AD Powershell Module installed, you're ready to set the home page URL using two simple steps.

1. Find the application you want to update.
2. Update the homepage URL for the application.

###Step 1 – Find the ObjectID of the application

First you must obtain the ObjectID of the application, and then search for the application by the homepage.

1. Open PowerShell.
2. Import the Azure AD module.
  
 ```
 Import-Module AzureAD
 ```
3. Log in to the Azure AD module.  Use the cmdlet below, and follow the instructions on the screen. Make sure you log in as the tenant administrator.
 
 ```
 Connect-AzureAD
 ```
4. The cmdlet below finds the applications based on the home page containing _sharepoint-iddemo_. This is the app you want to edit. You will need to replace this value with the value that works for your application.
  
 ```
 Get-AzureADApplications | where { $_.Homepage -like “*sharepoint-iddemo*” } | fl DisplayName, Homepage, ObjectID
 ```
5. You should view a result similar to the response below. The GUID (the ObjectID value below) is the item that you are will need to copy.
 
 ```
 DisplayName : SharePoint
 Homepage    : https://sharepoint-iddemo.msappproxy.net/
 ObjectId    : 8af89bfa-eac6-40b0-8a13-c2c4e3ee22a4
 ```
6. Copy the GUID (ObjectID) value. You will need this for the next step.


###Step 2 – Update the Homepage URL

You use the same PowerShell module to update the home page URL as you did to find the application ID. After logging into PowerShell, follow the steps below:

1. Confirm that you have the correct application, and replace _8af89bfa-eac6-40b0-8a13-c2c4e3ee22a4_ with the ObjectID value from your application that you copied in Step 1 above. 
  
 ```
 Get-AzureADApplication -AppObjectId 8af89bfa-eac6-40b0-8a13-c2c4e3ee22a4.
 ```
 
 Now that you have confirmed the application,  you're ready to update the homepage as follows.
 
2. Create a blank application object to hold the changes you want to make. This is only a variable to hold the values that you want to update, so nothing has actually been created.
  
 ```
 $appnew = New-Object “Microsoft.Open.AzureAD.Model.Application”
 ```
3. Set the home page to the value that you want. Keep in mind that it must be a subdomain path of the published application. For example, if you change the home page from _https://sharepoint-iddemo.msappproxy.net/_ to _https://sharepoint-iddemo.msappproxy.net/hybrid/_, your users will go directly to the custom home page.
  
 ```
 $appnew.Homepage = “https://sharepoint-iddemo.msappproxy.net/hybrid/”
 ```
4. The last thing you need to do is to make the update. Remember to use the GUID that you copied from Step 1 above.
  
 ```
 Set-AzureADApplication -AppObjectId 8af89bfa-eac6-40b0-8a13-c2c4e3ee22a4 - Application $appnew
 ```
5. Now you need to confirm the custom home page by starting the application again, to verify that the change was successful.
  
 ```
 Get-AzureADApplication -AppObjectId 8af89bfa-eac6-40b0-8a13-c2c4e3ee22a4
 ```

>[!NOTE]
>Keep in mind that any changes that you make to your application may reset the Home Page URL. In this case, you will need to repeat this process.

##Next steps

[Enable remote access to SharePoint with Azure AD App Proxy](application-proxy-enable-remote-access-sharepoint.md)<br>
[Enable Application Proxy in the Azure portal](https://github.com/Microsoft/azure-docs-pr/blob/master/articles/active-directory/active-directory-application-proxy-enable.md)
