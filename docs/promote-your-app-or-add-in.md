# Promote your Office or SharePoint Add-in or Office 365 web app


After you submit your app or add-in to the Seller Dashboard and it is approved for addition to the Office Store, you might want to brand it as an Office Store app or add-in on your webpage. You can use the Office Store badges to promote your app or add-in and drive traffic from your site to the store. To do so:
 


1. Download the  [Office Store Badge zip file](http://download.microsoft.com/download/2/4/D/24D59A35-F3C6-410D-AF29-43C9304631FE/OfficeDownload.zip).
    
 
2. Choose the badge size that best suits your needs. 
    

|**Badge size**|**How it looks**|
|:-----|:-----|
|Small|![Screenshot of the small-sized Office Store badge](../images/60a9da08-8a1c-4b2b-82e6-215e116c7fa3.png)|
|Medium|![Screenshot of the medium-sized Office Store badge](../images/0da977b2-a5f4-43a4-971d-9b4a2b089545.png)|
|Large|![Screenshot of the large-sized Office Store badge](../images/8ae64033-d9b3-43a1-b393-afd2212f52fe.png)|
3. Add the badge to your app or add-in webpage, directly following the link. This will make it clear to your users that they can download your app or add-in from the Office Store. 
    
 

You can also add your Office 365 web app using Azure AD to the Office 365 app launcher. For information, see  [Have your add-in appear in the Office 365 add-in launcher](https://msdn.microsoft.com/en-us/office/office365/howto/connect-your-app-to-o365-app-launcher).
 


## Guidelines for using the Office Store badge

The following guidelines apply to using the Office Store badge on your webpage:
 

 

- Make the Office Store badge visually distinct. Do not overlap it with or incorporate it within any other icon or brand image on your page.
- Do not modify the badge. 
- Do not make the badge the primary element on your webpage. 
- Do not use the badge on any pages that violate laws or regulations or that contain otherwise objectionable content. This includes pages that contain or display adult content, promote gambling, promote violence, or contain hate speech.
- Make sure that when users choose the badge, the link opens your page in the Office Store, and that your app or add-in is available in the Office Store.
    
 
If you need a localized version of the badge, [contact us](http://officespdev.uservoice.com/).
 

 

## Link to the Office Store from your site

When you link from the Office Store badge on your site to your app or add-in in the Office Store, include the following query parameters at the end of the URL:
 

 

- **mktcmpid** - Your marketing campaign ID, which can include up to 16 characters (any letter, number, _, and -). For example, blogpost_12.
- **mktvid** - Your Store Provider ID, which is included in the URL of your Store Provider page. For example, PN102957641.
    
 
The following example shows a URL that includes the two query parameters:
 

``` 
https://store.office.com/app.aspx?assetid=WA102957661&mktcmpid=refexample&mktvid=PN102957641
``` 

 
Adding these parameters to your Office Store URL will enable us to provide more information about where your customers are coming from. In the future, when you include your Store Provider ID, we can provide you counts of the number of customers who go to the Office Store from your webpage.
 

 

## Track your campaign performance and customize your add-in for targeted audiences


 >**Note:**  This currently applies to Word, Excel, and PowerPoint add-ins that are free in the Office Store.
 

When you link from your promotional campaigns to your free Word, Excel, or PowerPoint add-in page in the Office Store, include the following query parameters at the end of the URL: 
 

 

- mktcmpid=Your marketing campaign ID, which can include up to 16 characters (any letter, number, _, and -). For example, blogpost_12. 
- mktvid=Your Store Provider ID, which is included in the URL of your Store Provider page. For example, PN102957641. 
 
The following example shows a URL that includes the two query parameters: 
 

```
https://store.office.com/app.aspx?assetid=WA102957661&mktcmpid=refexample&mktvid=PN102957641 
``` 

 
Adding these parameters to your campaign URL will enable us to provide more information about your campaign's user funnel.
 

 
The  _mktcmpid_ parameter is passed all the way to the launch document. This allows you to customize the first user experience of your free Word, Excel, or PowerPoint add-in to, for example, display a specific splash screen or welcome message to your targeted audience.
 

 
When the document loads for the targeted user, the  _mktcmpid_ parameter is available in the [Settings object](https://dev.office.com/reference/add-ins/shared/settings) of the add-in as a Microsoft.Office.CampaignId, in Office clients where the Settings object is supported. Use the following code to read the Microsoft.Office.CampaignId from the Settings object.
 

 



```
if (Office.context.document.settings) { 
               return Office.context.document.settings.get("Microsoft.Office.CampaignId"); 
                } 

```

The value that is sent to the document is the value of the  _mktcmpid_ parameter.
 

 

## Additional resources
<a name="bk_addresources"> </a>


-  [Submit Office and SharePoint Add-ins and Office 365 web apps to the Office Store](ssubmit-add-ins-and-web-apps-to-the-office-store.md) 
-  [Office Add-ins](https://dev.office.com/docs/add-ins/overview/office-add-ins)  
-  [SharePoint Add-ins](http://msdn.microsoft.com/library/sharepoint-add-ins%28Office.15%29.aspx)
    
 

