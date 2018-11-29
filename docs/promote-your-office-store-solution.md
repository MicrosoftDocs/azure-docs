---
title: Promote your AppSource solution
description: Use AppSource badges to promote your solution and drive traffic from your site to AppSource.
ms.date: 1/11/2018
---

# Promote your AppSource solution

After you submit your solution to the Seller Dashboard and it is approved for addition to AppSource, you might want to brand it as an AppSource solution on your webpage. You can use the AppSource badges to promote your solution and drive traffic from your site to AppSource. To do so:

1. Download the [AppSource Badge zip file](http://download.microsoft.com/download/A/1/F/A1F9C6C4-3543-4E4A-A4D1-76ED58EBDF6C/Microsoft_App_Source_Badges_EN_US.zip).

2. Select the badge size that best suits your needs. 

   |**Badge size**|**How it looks**|
   |:-----|:-----|
   |Small|![Screenshot of the small-sized AppSource badge](images/appsource-badge-small.png)|
   |Medium|![Screenshot of the medium-sized AppSource badge](images/appsource-badge-medium.png)|
   |Large|![Screenshot of the large-sized AppSource badge](images/appsource-badge-large.png)|

3. Add the badge to your app or add-in webpage, directly following the link. This makes it clear to your users that they can download your app or add-in from AppSource. 

You can also add your Office 365 web app using Azure AD to the Office 365 app launcher. For information, see [Have your add-in appear in the Office 365 add-in launcher](https://msdn.microsoft.com/en-us/office/office365/howto/connect-your-app-to-o365-app-launcher).

## Guidelines for using the AppSource badge

The following guidelines apply to using the AppSource badge on your webpage:

- Make the AppSource badge visually distinct. Do not overlap it with or incorporate it within any other icon or brand image on your page.
- Do not modify the badge. 
- Do not make the badge the primary element on your webpage. 
- Do not use the badge on any pages that violate laws or regulations or that contain otherwise objectionable content. This includes pages that contain or display adult content, promote gambling, promote violence, or contain hate speech.
- Make sure that when users choose the badge, the link opens your page in AppSource, and that your app or add-in is available in AppSource.

If you need a localized version of the badge, [contact us](http://officespdev.uservoice.com/).


## Track your campaign performance and customize your add-in for targeted audiences

> [!NOTE]
> Campaign tracking is enabled for all Office 365 listings on AppSource. Currently, activation data is only provided for Word, Excel, and PowerPoint add-ins currently.

When you link from your promotional campaigns to your free Word, Excel, or PowerPoint add-in page in AppSource, include the following query parameters at the end of the URL: 

- **mktcmpid** - Your marketing campaign ID, which can include up to 16 characters (any letter, number, \_, and -). For example, blogpost_12. This value will be used to provide a breakdown in the Acquisitions report.
- **src** - This is an optional parameter that declares the source of the user traffic.

The following example shows a URL that includes the two query parameters: 

```
https://appsource.microsoft.com/product/office/WA102957661?src=website&mktcmpid=blogpost_12
``` 

Adding these parameters to your campaign URL enables us to provide more information about your campaign's user funnel. The [Acquisitions report](https://partner.microsoft.com/en-us/dashboard/analytics/office/acquisitions) in the Partner Dashboard will provide you a breakdown of your AppSource campaign results. 

The  _mktcmpid_ parameter is passed all the way to the launch document. This allows you to customize the first user experience of your free Word, Excel, or PowerPoint add-in to, for example, display a specific splash screen or welcome message to your targeted audience.

When the document loads for the targeted user, the  _mktcmpid_ parameter is available in the [Settings object](https://dev.office.com/reference/add-ins/shared/settings) of the add-in as a Microsoft.Office.CampaignId, in Office clients where the Settings object is supported. Use the following code to read the Microsoft.Office.CampaignId from the Settings object.

```json
if (Office.context.document.settings) { 
               return Office.context.document.settings.get("Microsoft.Office.CampaignId"); 
                } 
```

The value that is sent to the document is the value of the  _mktcmpid_ parameter.

## See also
<a name="bk_addresources"> </a>

- [Make your solutions available in AppSource and within Office](submit-to-the-office-store.md)
- [Office Add-ins](https://docs.microsoft.com/en-us/office/dev/add-ins/overview/office-add-ins)  
- [SharePoint Add-ins](https://docs.microsoft.com/en-us/sharepoint/dev/sp-add-ins/sharepoint-add-ins)



