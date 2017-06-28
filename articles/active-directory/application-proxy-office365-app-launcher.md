---
title: Set a custom home page for published apps by using Azure AD Application Proxy | Microsoft Docs
description: Covers the basics about Azure AD Application Proxy connectors
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
ms.date: 04/15/2017
ms.author: kgremban

---

# Set a custom home page for published apps by using Azure AD Application Proxy

This article discusses how to configure apps to direct users to a custom home page when they access the apps from the Azure Active Directory (Azure AD) Access Panel and the Office 365 app launcher.

When users launch the app, they're directed by default to the root domain URL for the published app. The landing page is typically set as the home page URL. For example, for the back-end app http://ExpenseApp, the URL is published as *https://expenseApp-contoso.msappproxy.net*. By default, the home page URL is set as *https://expenseApp-contoso.msappproxy.net*.

By using the Azure AD PowerShell module, you can define custom home page URLs for instances when you want app users to land on a specific page within the app (for example, *https://expenseApp-contoso.msappproxy.net/login/login.aspx*).

>[!NOTE]
>When you give users access to published apps, the apps are displayed in the [Azure AD Access Panel](active-directory-saas-access-panel-introduction.md) and the [Office 365 app launcher](https://blogs.office.com/2016/09/27/introducing-the-new-office-365-app-launcher).

## Before you start

### Determine the home page URL

Before you set the home page URL, keep in mind the following:

* Ensure that the path you specify is a subdomain path of the root domain URL.

  If the root-domain URL is, for example, https://apps.contoso.com/app1/, the home page URL that you configure must start with https://apps.contoso.com/app1/.

* If you make a change to the published app, the change might reset the value of the home page URL. When you update the app in the future, you should recheck and, if necessary, update the home page URL.

### Install the Azure AD PowerShell module

Before you define a custom home page URL by using PowerShell, install a nonstandard package of the Azure AD PowerShell module. You can download the package from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureAD/1.1.23.0), which uses the Graph API endpoint. 

To install the package, follow these steps:

1. Open a standard PowerShell window, and then run the following command:

    ```
     Install-Module -Name AzureAD -RequiredVersion 1.1.23.0
    ```
    If you're running the command as a non-admin, use the `-scope currentuser` option.
2. During the installation, select **Y** to install two packages from Nuget.org. Both packages are required. 

## Step 1: Find the ObjectID of the app

Obtain the ObjectID of the app, and then search for the app by its home page.

1. Open PowerShell and import the Azure AD module.

    ```
    Import-Module AzureAD
    ```

2. Sign in to the Azure AD module as the tenant administrator.

    ```
    Connect-AzureAD
    ```
3. Find the app based on its home page URL. You can find the URL in the portal by going to **Azure Active Directory** > **Enterprise applications** > **All applications**. This example uses *sharepoint-iddemo*.

    ```
    Get-AzureADApplication | where { $_.Homepage -like “sharepoint-iddemo” } | fl DisplayName, Homepage, ObjectID
    ```
4. You should get a result that's similar to the one shown here. Copy the ObjectID GUID to use in the next secion.

    ```
    DisplayName : SharePoint
    Homepage    : https://sharepoint-iddemo.msappproxy.net/
    ObjectId    : 8af89bfa-eac6-40b0-8a13-c2c4e3ee22a4
    ```

## Step 2: Update the home page URL

In the same PowerShell module that you used for step 1, do the following:

1. Confirm that you have the correct app, and replace *8af89bfa-eac6-40b0-8a13-c2c4e3ee22a4* with the GUID (ObjectID) that you copied in the preceding step.

    ```
    Get-AzureADApplication -ObjectId 8af89bfa-eac6-40b0-8a13-c2c4e3ee22a4.
    ```

 Now that you've confirmed the app, you're ready to update the home page, as follows.

2. Create a blank application object to hold the changes that you want to make.  

 >[!NOTE]
 >This is only a variable to hold the values that you want to update, so nothing has actually been created.

    ```
    $appnew = New-Object “Microsoft.Open.AzureAD.Model.Application”
    ```

3. Set the home page URL to the value that you want. The value must be a subdomain path of the published app. For example, if you change the home page URL from *https://sharepoint-iddemo.msappproxy.net/* to *https://sharepoint-iddemo.msappproxy.net/hybrid/*, app users will go directly to the custom home page.

    ```
    $homepage = “https://sharepoint-iddemo.msappproxy.net/hybrid/”
    ```
4. Make the update by using the GUID (ObjectID) that you copied in "Step 1: Find the ObjectID of the app."

    ```
    Set-AzureADApplication -ObjectId 8af89bfa-eac6-40b0-8a13-c2c4e3ee22a4 -Homepage $homepage
    ```
5. To confirm that the change was successful, restart the app.

    ```
    Get-AzureADApplication -ObjectId 8af89bfa-eac6-40b0-8a13-c2c4e3ee22a4
    ```

>[!NOTE]
>Any changes that you make to the app might reset the home page URL. If this happens, repeat step 2.

## Next steps

- [Enable remote access to SharePoint with Azure AD Application Proxy](application-proxy-enable-remote-access-sharepoint.md)
- [Enable Application Proxy in the Azure portal](active-directory-application-proxy-enable.md)
