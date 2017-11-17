# Office Store submission FAQ


For the most current version of the validation policies, see  [Validation policies](validation-policies.md).
 


## How can I avoid errors when submitting my app or add-in to the Office Store?
<a name="bk_q2"> </a>

To avoid common submission errors:
 

 

- Make sure that the version number on the submission form matches the version number in the add-in manifest.
    
    > [!NOTE]
    > Specify your add-in version using the following syntax: *a*  . *b*  . *c*  . *d*  Where *a*  is an integer between 1-9999, and each of *b*  , *c*  , *d*  are each integers between 0-9999. For example: 1.0.0.0 6.23.0.1.

- Make sure that all locations are SSL-secured (HTTPS).
    
 
- Make sure you that you specify an icon for your app or add-in in your package or manifest, and that the icon is correctly sized and formatted. 
    
 
- Make sure your ID is unique.
    
    For example, do not create a manifest for a second add-in based on another add-in manifest you submitted without changing the ID in the new manifest.
    
 
- For Office Add-ins, make sure that you are using  [manifest schema version 1.1](http://msdn.microsoft.com/library/7e0cadc3-f613-8eb9-57ef-9032cbb97f92%28Office.15%29.aspx). For information about updating your manifest to version 1.1, see  [Update the version of your JavaScript API for Office and manifest schema files](http://msdn.microsoft.com/library/641dc473-0931-4e00-8164-e7808ceed64d%28Office.15%29.aspx). 
    
 
- For Office Add-ins, make sure that you specify a Support URL in the  **SupportUrl** element of your Office Add-in manifest.
    
 
-  For all add-ins, make sure that your manifest is valid against the schema. For schema validation information, see [Schema reference for Office Add-ins manifests (v1.1)](http://msdn.microsoft.com/library/7e0cadc3-f613-8eb9-57ef-9032cbb97f92%28Office.15%29.aspx) or [Schema reference for manifests of SharePoint Add-ins](http://msdn.microsoft.com/library/1f8c5d44-3b60-0bfe-9069-1df821220691%28Office.15%29.aspx).
    
 
- Make sure your app or add-in is tested and is fully functional.
    
 
- Make sure your SharePoint Add-ins specify their supported locales. 
    
    If you don't specify supported locales, your add-in will not be accepted by the Office Store. For details, see  [Locale support information is required for all add-ins in the Office Store](http://blogs.msdn.com/b/officeapps/archive/2012/10/12/locale-support-information-is-required-for-all-apps-in-the-sharepoint-store.aspx).
    
 
- Make sure your OAuth client IDs match
    
    If your SharePoint Add-in accesses services using OAuth, make sure the OAuth client ID that you created in Seller Dashboard matches the client ID in your add-in manifest.
    
 
- Your SharePoint Add-in package must conform to the Open Packaging Convention.
    
 
- Make sure that you submit a privacy link. 
    
 
- Make sure any video links you submit actually go to a video file or a page that includes a video.
    
 
- If your Office Add-in will be available on iOS, do not include "app" in the  **Add-in Title** or **Add-in Short Description**.
    
 

## If I make updates to my submission, when do I have to resubmit it to the Office Store?
<a name="bk_q3"> </a>

If you make updates to the web service for your add-in, you do not have to resubmit it to the Office Store. However, if you make changes to any items or data you submitted via the Seller Dashboard, such as the manifest, screenshots, icons, or submission form data, you'll need to resubmit so that the Office Store can implement those changes. You must resubmit add-ins with an updated manifest that includes a new version number. You must also make sure to update the version number in the submission form to match the version number of the new manifest.
 

 

## What happens when I update my add-in to a new version in the Office Store?
<a name="bk_q3"> </a>

The following is the update process for Office Add-ins:
 

 

- You submit your revised add-in and add-in manifest to the Office Store via the  [Seller Dashboard](https://sellerdashboard.microsoft.com/Application/Summary). The revised add-in goes through the validation process, and when approved, is made available in the store.
    
 
- You can choose to continue to offer the previous version of your add-in in the store, or you can unpublish the previous version via the Seller Dashboard. For details, see  [Update, unpublish, and view metrics in the Seller Dashboard](update-unpublish-and-view-metrics.md).
    
 
- When an existing customer launches the updated add-in for the first time, a notification appears either in the task pane or the body of the document that prompts the user to update their add-in. When the user chooses  **Update**, the latest version of the add-in launches.
    
    If the updated version includes new permissions, the user must consent to them.
    
 

> [!NOTE]
> You cannot have two or more versions of the same add-in in the store at the same time, because each add-in has a unique asset ID. If you publish an updated version of your add-in without unpublishing a previous version, you will have two Office Store listings and will potentially split your customer base.
 

Updates to SharePoint Add-ins are handled by the license-management tools that are part of the SharePoint Add-in catalog. For more information, see  [SharePoint Add-ins update process](https://msdn.microsoft.com/en-us/library/office/fp179904.aspx).
 

 

## Can I submit a paid app or add-in to the Office Store?
<a name="bk_q4"> </a>

You can now submit paid apps and add-ins to the Office Store through the Seller Dashboard, with the following restrictions:
 

 

- If your SharePoint Add-in contains an Office Add-in, it must be priced as free in the Office Store. Paid SharePoint Add-ins that contain Office Add-ins will not be accepted until these commerce capabilities are enabled.
    
 
- Additional restrictions apply to autohosted add-ins. For information, see  *Can I submit an autohosted SharePoint Add-in to the Office Store?*  and policy 10.2 in the [validation policies](validation-policies.md).
    
 
In addition, consider the following:
 

 

- If you submit a paid app or add-in, you can also choose to offer a trial. If you choose to submit a trial offer, we recommend that you use the Office licensing framework.
    
    For more information, see  [License your Office and SharePoint Add-ins](license-your-office-and-sharepoint-add-ins.md),  [Which business model is right for your add-in?](http://blogs.msdn.com/b/officeapps/archive/2012/09/10/which-business-model-is-right-for-your-app.aspx), and  [Creating and verifying licensing in a paid Office Add-in](http://blogs.msdn.com/b/officeapps/archive/2012/11/01/creating-and-verifying-licensing-in-a-paid-app-for-office.aspx).
    
 

## What percentage of a paid app or add-in in the store goes to Microsoft?
<a name="bk_q4"> </a>

For paid apps and add-ins in the Office Store, 20% goes to Microsoft.
 

 

## Can I submit an autohosted SharePoint Add-in to the Office Store?
<a name="bk_q5"> </a>

The Office 365 Autohosted Add-ins Preview program ended on June 30, 2014. You cannot create new autohosted add-ins in SharePoint. For more information, see  [Update on Autohosted Add-ins Preview program](http://blogs.office.com/2014/05/16/update-on-autohosted-apps-preview-program/). For information about how to convert your autohosted add-in, see  [Convert an autohosted SharePoint Add-in to a provider-hosted add-in](https://msdn.microsoft.com/en-us/library/office/dn722449.aspx).
 

 

## Can I submit Access web apps to the Office Store?
<a name="bk_q55"> </a>

Yes. 
 

 

## How do I reference the JavaScript APIs for Office in my add-ins?
<a name="bk_q6"> </a>

If your add-in uses the JavaScript APIs for Office, you must  [reference the Microsoft-hosted Office.js file from its CDN URL](http://msdn.microsoft.com/library/e76f608d-1900-4911-bd6f-aebe61510c96%28Office.15%29.aspx). Don't include a copy of the Office.js file in your add-in, or reference a copy of the file hosted elsewhere.
 

 

## Why do my apps and add-ins have to be SSL-secured?
<a name="bk_q7"> </a>

Apps and add-ins that are not SSL-secured (HTTPS) generate unsecure content warnings and errors during use. For this reason, all apps and add-ins submitted to the Office Store are required to be SSL-secured.
 

 

## How do I declare language support?
<a name="bk_q8"> </a>

Two aspects of your submission relate to supported languages: 
 

 

1. The languages you declare in your app package or manifest.
    
    You declare which languages your add-in supports differently depending on type:
    
      - For SharePoint Add-ins, declare language support using the  [SupportedLocales element (PropertiesDefinition complexType) (SharePoint Add-in Manifest)](http://msdn.microsoft.com/library/49bde91a-8d7a-be17-4c91-82c9c19f0f61%28Office.15%29.aspx), in the add-in manifest within the add-in package. For more information, see  [Explore the app manifest structure and the package of a SharePoint Add-in](https://docs.microsoft.com/en-us/sharepoint/dev/sp-add-ins/explore-the-app-manifest-structure-and-the-package-of-a-sharepoint-add-in).
    
 
  - For Office Add-ins that aren't dictionaries, declare language support by using the  **DefaultLocale** and **Override** elements in your manifest. For more information, see [Localization for Office Add-ins](http://msdn.microsoft.com/library/5a1a1cd7-b716-4597-b51f-fa70357d0833%28Office.15%29.aspx).
    
 
  - For Office Add-ins that are dictionaries, you can also use the  **TargetDialects** element within the add-in manifest. 
    
 
2. In your Seller Dashboard submission first step, you select a default language. As a second step, you can add additional languages via **Add A Language**.
    
    > [!NOTE]
    > You can declare more languages in your or add-in package than are available for submission in Seller Dashboard.

