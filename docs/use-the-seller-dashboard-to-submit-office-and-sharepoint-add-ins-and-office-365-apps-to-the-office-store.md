---
title: Use the Seller Dashboard to submit Office and SharePoint Add-ins and Office 365 apps to the Office Store
ms.prod: MULTIPLEPRODUCTS
ms.assetid: 260ef238-0be4-42d6-ba15-1249a8e2ff12
ms.locale: en-US
---


# Use the Seller Dashboard to submit Office and SharePoint Add-ins and Office 365 apps to the Office Store







If you want your app or add-in to appear in the Office Store, you need to submit it to the [Seller Dashboard](http://go.microsoft.com/fwlink/?LinkId=248605) for approval. First, prepare the information listed in [Checklist for submitting apps to the Seller Dashboard](Checklist-for-submitting-Office-and-SharePoint-Add-ins-and-Office-365-web-apps-to-the-Seller-Dashboard), and familiarize yourself with the [Office Store validation policies](Validation-policies-for-apps-and-add-ins-submitted-to-the-Office-Store-version-2.0.md). You can add and save your app or add-in as a draft in your Seller Dashboard account until you're ready to submit it for approval.



If your SharePoint Add-in requires an Open Authorization (OAuth) client ID and client secret, you can add a client ID and client secret in the Seller Dashboard before you add your add-in. For more information, see [Create or update client IDs and secrets in the Seller Dashboard](Create-or-update-client-IDs-and-secrets-in-the-Seller-Dashboard.md).



If you're submitting Office 365 web apps to the Seller Dashboard, make sure that you have registered your web app with [Azure Active Directory](https://msdn.microsoft.com/office/office365/HowTo/add-common-consent-manually). The Office Store currently accepts only Azure AD apps that use OAuth 2.0 and OpenID Connect as their authentication method.



For information about the Office Store approval process, see [Submit Office and SharePoint Add-ins and Office 365 web apps to the Office Store](Submit-Office-and-SharePoint-Add-ins-and-Office-365-web-apps-to-the-Office-Store.md).

## Submit an app or add-in and save it as a draft

### 
1. Sign in to the [Seller Dashboard](http://go.microsoft.com/fwlink/?LinkId=248605) with your Microsoft account.
2. On the **Manage** tab, choose **Add a new app**.
3. On the **Listing type** page, choose the item under **App type** that matches your submission.
4. If you are creating an app or add-in for the store for the first time, we recommend that you read the validation policies. Under **Overview**, click [Validation policies](https://msdn.microsoft.com/library/jj220035.aspx) and [Best practices](https://dev.office.com/docs/add-ins/overview/add-in-development-best-practices).**NEXT**.
5. On the **Overview** page:
6. Choose **NEXT**, **SAVE AS DRAFT**, or **cancel**. 
7. On the **Details** page, do the following for **Language** selection (repeat the steps for each language):
To add or remove a language:
    1. Choose the language that your app or add-in supports, and choose **CONFIRM**.
    2. Under **description**, provide your **App name**, **Short description**, and **Long description** in the appropriate language. For example, if you chose English in the previous step, type your **App name**, **Short description**, and **Long description** in English.For guidance for writing descriptions, see [Write compelling descriptions](https://msdn.microsoft.com/EN-US/library/jj635874.aspx#Anchor_1).
    3. Under **Screenshots**, choose **Primary** to upload at least one screenshot. You can upload up to five images. Each screenshot must have file extension .png, jpg, .jpeg, or .gif, must be exactly 512 pixels wide and 384 pixels high, and be no larger than 300 KB.Customers will see your screenshots in the store listing. Do not include any private or personal information that you do not want customers to see.You can add language-specific screenshots to match each language. Adding screenshots that match each language provides the best customer experience.
8. Choose **NEXT**, **SAVE AS DRAFT**, or **cancel**. 
9. On the **Block Access** page, if you do not want your app or add-in to be listed and sold in some countries/regions:
10. Choose **NEXT**, **SAVE AS DRAFT**, or **cancel**. 
11. On the **pricing** page, specify the pricing of your add-in. If you're submitting a web app, leave the default **This app is free** value selected (web apps are always free).
Choose one of the following:
For paid or subscription add-ins, choose whether you want to offer it as a trial. To offer a trial: 
You can also choose **SAVE AS DRAFT** and add your pricing information later. For more information, see [Decide on a pricing model for your Office or SharePoint Add-in or Office 365 web app](Decide-on-a-pricing-model-for-your-Office-or-SharePoint-Add-in-or-Office-365-web-app.md).
    1. Under **Trial support**, select the **My app supports a trial** check box.
    2. In the **Duration of Trial** drop-down list, select the duration of the trial.
    3. In the **Number of Users in Trial** drop-down list, specify the number of trial users you want to allow.
12. Choose **SAVE AS DRAFT** or **cancel**.




## Submit an app or add-in for approval
After your account in the Seller Dashboard is approved, you can submit your  app for approval. To submit an app or for purchase, your payout and tax information must also be validated. Your approved apps and will be listed in product-specific stores.

### To submit a new app that you have added
1. Follow the steps in the previous section.
2.  In the final step of the procedure, choose **SUBMIT FOR APPROVAL** instead of **SAVE AS DRAFT**.


### To submit an app or that you saved to the Seller Dashboard as a draft and need to edit
1. On the **manage** tab, choose the app or add-in you want to edit and submit.
2.  On your summary page, choose **EDIT DRAFT** and make your changes. Choose **SUBMIT FOR APPROVAL**.


### To submit an app or add-in that you saved to the Seller Dashboard as a draft
1. On the **manage** tab, choose the entry that you want to submit. 
2. On your summary page, choose **SUBMIT FOR APPROVAL**.


>**Note:**
>After you submit an app or add-in for approval, you cannot make changes to it during the approval process. When the approval process is complete, you will receive an email message indicating that your app was approved or that you need to make changes before it can be approved. 





## Additional resources
<a name="bk_addresources"></a>

- [Register as an app developer](https://dev.windows.com/en-us/programs/join)
- [Checklist for submitting Office and SharePoint Add-ins and Office 365 web apps to the Seller Dashboard](Checklist-for-submitting-Office-and-SharePoint-Add-ins-and-Office-365-web-apps-to-the-Seller-Dashboard.md)
- [Create effective Office Store apps and add-ins](Create-effective-Office-Store-apps-and-add-ins.md)
- [Have your app appear in the Office 365 App launcher](https://msdn.microsoft.com/en-us/office/office365/howto/connect-your-app-to-o365-app-launcher)






