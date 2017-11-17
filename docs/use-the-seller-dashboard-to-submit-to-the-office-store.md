# Use the Seller Dashboard to submit your solution to the Office Store

If you want your Office Add-in, Office 365 web app, or Power BI custom visual to appear in the Office Store, you need to submit it to the  [Seller Dashboard](http://go.microsoft.com/fwlink/?LinkId=248605) for approval. First,  familiarize yourself with the [Office Store validation policies](validation-policies.md). You can add and save your submission as a draft in your Seller Dashboard account until you're ready to submit it for approval.
 

If your SharePoint Add-in requires an Open Authorization (OAuth) client ID and client secret, you can add a client ID and client secret in the Seller Dashboard before you add your add-in. For more information, see  [Create or update client IDs and secrets in the Seller Dashboard](create-or-update-client-ids-and-secrets.md).
 

If you're submitting Office 365 web apps to the Seller Dashboard, make sure that you have registered your web app with  [Azure Active Directory](https://msdn.microsoft.com/office/office365/HowTo/add-common-consent-manually). The Office Store currently accepts only Azure AD apps that use OAuth 2.0 and OpenID Connect as their authentication method.
 

For information about the Office Store approval process, see  [Submit to the Office Store](submit-to-the-office-store.md).
 

## Submission checklist

This section lists the information that you need to provide when you submit your solution in the Seller Dashboard. 

### Add a new app
Choose **Add a new app**. On the **Listing type** page, choose the type of solution that you are submitting to the store:

- Azure AD web app
- Office add-in
- Outlook add-in
- Power BI custom visual
- SharePoint add-in
- Teams app

### Overview page

|**Field name**|**Notes**|
|:-------------|:-------|
|Manifest|Required (except for web apps using Azure AD)<br/><br/>For more information, see [Upload your submission package](upload-package.md).|
|Submission title|Required|
|Version|Required (autopopulated)|
|Release date (UTC)|Required|
|Category|One required; two optional|
|Testing notes|Optional, but recommended|
|Cryptography and encryption information|Optional|
|Apple developer ID|Optional|
|Logo|Required|
|Support document link|Required|
|Privacy document link|Required|
|Video link|Optional|
|End User License Agreement|Optional|

### Details page

|**Field name**|**Notes**|
|:-------------|:-------|
|App name|Required. One entry per language.|
|Short description|Required. One entry per language.|
|Long description|Required. One entry per language.|
|Screenshots|At least one is required.|

For more information, see [Store listing](office-store-listing.md).

### Block access page

|**Field name**|**Notes**|
|:-------------|:-------|
|Block access for specified countries/regions|By default, available in all countries or regions.|

For more information, see [Regional availability](office-store-listing.md#regional-availability).

### Pricing page

|**Field name**|**Notes**|
|:-------------|:-------|
|Pricing|Required|
|Trial support|By default, no trial support|

For details, see [Decide on a pricing model](decide-on-a-pricing-model.md).


## Submit for approval

After your account in the Seller Dashboard is approved, you can submit your solution for approval. To submit an app for purchase, your payout and tax information must also be validated. Your approved apps and will be listed in product-specific stores.

### To submit a new solution


1. Complete the items listed in the checklist.
    
 
2. Choose **SUBMIT FOR APPROVAL**.
    
 

### To submit a solution that you saved to the Seller Dashboard as a draft and need to edit


1. On the **manage** tab, choose the item you want to edit and submit.
    
 
2.  On your summary page, choose **EDIT DRAFT** and make your changes. Choose **SUBMIT FOR APPROVAL**.
    
 

### To submit a solution that you saved to the Seller Dashboard as a draft


1. On the **manage** tab, choose the entry that you want to submit.
    
 
2. On your summary page, choose  **SUBMIT FOR APPROVAL**.
    
    > [!NOTE]
    > After you submit a solution for approval, you cannot make changes to it during the approval process. When the approval process is complete, you will receive an email message indicating that your app was approved or that you need to make changes before it can be approved. 
 


## Additional resources
<a name="bk_addresources"> </a>


-  [Register as an app developer](https://dev.windows.com/en-us/programs/join)
-  [Create effective Office Store listings](create-effective-office-store-listings.md)
-  [Have your app appear in the Office 365 App launcher](https://msdn.microsoft.com/en-us/office/office365/howto/connect-your-app-to-o365-app-launcher)
-  [Publish Power BI custom visuals to the Office store](https://powerbi.microsoft.com/en-us/documentation/powerbi-developer-office-store/)
    
 

