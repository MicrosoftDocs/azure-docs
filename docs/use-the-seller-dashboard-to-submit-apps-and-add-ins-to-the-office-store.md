
# Use the Seller Dashboard to submit Office and SharePoint Add-ins and Office 365 apps to the Office Store
Use the Seller Dashboard to submit Office Add-ins, SharePoint Add-ins, and Office 365 web apps using Azure AD to the Office Store. 
 

If you want your app or add-in to appear in the Office Store, you need to submit it to the  [Seller Dashboard](http://go.microsoft.com/fwlink/?LinkId=248605) for approval. First, prepare the information listed in [Checklist for submitting apps to the Seller Dashboard](checklist-for-submitting-office-and-sharepoint-add-ins-and-office-365-web-apps-to-the-seller-dashboard.md), and familiarize yourself with the  [Office Store validation policies](validation-policies-for-apps-and-add-ins-submitted-to-the-office-store-version-2.0.md). You can add and save your app or add-in as a draft in your Seller Dashboard account until you're ready to submit it for approval.
 

If your SharePoint Add-in requires an Open Authorization (OAuth) client ID and client secret, you can add a client ID and client secret in the Seller Dashboard before you add your add-in. For more information, see  [Create or update client IDs and secrets in the Seller Dashboard](create-or-update-client-ids-and-secrets-in-the-seller-dashboard.md).
 

If you're submitting Office 365 web apps to the Seller Dashboard, make sure that you have registered your web app with  [Azure Active Directory](https://msdn.microsoft.com/office/office365/HowTo/add-common-consent-manually). The Office Store currently accepts only Azure AD apps that use OAuth 2.0 and OpenID Connect as their authentication method.
 

For information about the Office Store approval process, see  [Submit Office and SharePoint Add-ins and Office 365 web apps to the Office Store](submit-office-and-sharepoint-add-ins-and-office-365-web-apps-to-the-office-store.md).
 

## Submit an app or add-in and save it as a draft


1. Sign in to the  [Seller Dashboard](http://go.microsoft.com/fwlink/?LinkId=248605) with your Microsoft account.
    
 
2. On the  **Manage** tab, choose **Add a new app**.
    
 
3. On the  **Listing type** page, choose the item under **App type** that matches your submission.
    
 
4. If you are creating an app or add-in for the store for the first time, we recommend that you read the validation policies. Under  **Overview**, click  [Validation policies](https://msdn.microsoft.com/library/jj220035.aspx) and [Best practices](https://dev.office.com/docs/add-ins/overview/add-in-development-best-practices). **NEXT**.
    
 
5. On the  **Overview** page:
    
      - Under  **Manifest**, click the + icon to select the App package from the  **Open File** box.
    
 
  - Under  **General info**, provide the required information, including  **App Submission title**,  **Version**, and  **Release Date**. 
    
     **Important**  For Office and SharePoint Add-ins, the  **Version** number is auto-populated from the version number in the manifest file that you submit.

     **Release Date** is the date you want to be displayed as the date your app or add-in is released.
    
     **Important**  If you are submitting an update and you select a release date that is in the future, your app or add-in will not be discoverable in the Office Store until the date you select. If your app or add-in was available in the Office Store, it will be hidden from users until the release date for the updated version.
  - Choose at least one  **Category**. You can choose up to three categories that will help customers filter in the Office Store to find your app.
    
    If you choose the  *Education*  category for your app or add-in, you'll need to comply with policy 7.18 of the [validation policies](validation-policies-for-apps-and-add-ins-submitted-to-the-office-store-version-2.0.md). 
    
 
  - Under  **Testing Notes**, provide instructions, links to resources, or a video demonstrating the app or add-in that will help validation testers validate your submission as part of the approval process. For example, provide valid credentials or a password if required. The credentials or password are not for public use and will only be used by Microsoft. Your  **Testing Notes** are for validation purposes and will not be published in your store listing. If you provide complete **Testing Notes**, they can assist with the approval of your submission.
    
    For web apps, use the  *Testing notes*  to supply the Single Sing-On URL to help the validator find the app.
    
 
  - If your app calls, supports, contains, or uses cryptography or encryption, select the  **My app calls, supports, contains, or uses cryptography or encryption.** check box. Verify the information, and then choose **Yes** or **No**.
    
    For more information about encryption, see  [EAR Controls for Items That Use Encryption](https://www.bis.doc.gov/index.php/policy-guidance/encryption). 
    
 
  - If your add-in is iOS compatible, select the  **Make this app available in the Office App Catalog on iPad** check box. Provide your Apple developer ID in the **Apple ID** box.
    
    Add-ins that are iOS compatible must adhere to additional validation requirements. For more information, see  [Validation policies for apps and add-ins submitted to the Office Store (version 2.0)](validation-policies-for-apps-and-add-ins-submitted-to-the-office-store-version-2.0.md)
    
 
  - Under  **Logo**, choose the  **App Logo** tile, and upload your logo file.
    
     **Note**  For Office Add-ins, one logo is associated with your add-in. If your logo requires localization, submit your localized add-ins separately with separate logos in each language.
  - Do one of the following, depending on the type of your submission:
    
      -  **For Office Add-ins** - Under **app package**, choose the  **app package** tile, and upload the [manifest file](http://msdn.microsoft.com/library/4139ff24-afac-472a-af7d-9d069587ac9b%28Office.15%29.aspx) for your add-in.
    
 
  -  **For SharePoint Add-ins** - Under **app package**, choose the  **app package** tile, and upload your add-in.
    
     **Important**   To submit a SharePoint Add-in that uses OAuth that you want to distribute it to China: Use a separate client ID and client secret for China. Add a separate add-in package specifically for China. Block access for all countries except China. Create a separate add-in listing for China. For more information, see [Submit apps for Office 365 operated by 21Vianet in China](submit-apps-for-office-365-operated-by-21vianet-in-china.md). 

    If your app uses OAuth, select the  **My app is a service and requires server to server authorization** check box. The **OAuth Client ID** drop-down field appears. Select the OAuth client ID that you want your add-in to use.
    
     **Important**   If you are submitting a SharePoint Add-in that uses OAuth and you want to distribute it to China, you must use a separate client ID and client secret for China: Under **Client ID**, choose the dropdown.  Under **Client IDs for Apps in China**, select a client ID. If you don't see this option, you need to add a client ID for China only. For more information, see  [Create or update client IDs and secrets in the Seller Dashboard](create-or-update-client-ids-and-secrets-in-the-seller-dashboard.md). 
  -  **For Office 365 web apps** - Under **app registration**:
    
      - Provide an Azure app ID. When you register your web app with Microsoft Azure Active Directory, an Azure app ID in the form of a GUID is created.
    
 
  - Choose the Azure AD instance that your app uses. The following are the options: 
    
      -  **Azure Active Directory Global** - Use for most Office 365 web apps.
    
 
  -  **Azure Active Directory China** - Use for web apps created with Office 365 in China.
    
 
  -  **Microsoft account** - Not currently available.
    
 
  -  **Microsoft account + Azure Active Directory Global** - Not currently available.
    
 
  - Under  **Support document link**, provide a link to a website where you provide support documentation. Include  `http://` or `https://` in your URL. Optionally, you can provide a **Privacy document link**, a  **Video link**, and a customized  **End-user license agreement**. If you don't have a customized license agreement, the store will provide one.
    
 
6. Choose  **NEXT**,  **SAVE AS DRAFT**, or  **cancel**. 
    
 
7. On the  **Details** page, do the following for **Language** selection (repeat the steps for each language):
    
      1. Choose the language that your app or add-in supports, and choose  **CONFIRM**.
    
 
  2. Under  **description**, provide your  **App name**,  **Short description**, and  **Long description** in the appropriate language. For example, if you chose English in the previous step, type your **App name**,  **Short description**, and  **Long description** in English.
    
    For guidance for writing descriptions, see  [Write compelling descriptions](https://msdn.microsoft.com/EN-US/library/jj635874.aspx#Anchor_1).
    
 
  3. Under  **Screenshots**, choose  **Primary** to upload at least one screenshot. You can upload up to five images. Each screenshot must have file extension .png, jpg, .jpeg, or .gif, must be exactly 512 pixels wide and 384 pixels high, and be no larger than 300 KB.
    
     **Important**   Customers will see your screenshots in the store listing. Do not include any private or personal information that you do not want customers to see. You can add language-specific screenshots to match each language. Adding screenshots that match each language provides the best customer experience.

    To add or remove a language:
    
      - To add another language, choose  **Add A Language** and repeat the previous three steps for each language.
    
 
  - To remove a language that you've added, choose  **Delete** next to that language.
    
 
8. Choose  **NEXT**,  **SAVE AS DRAFT**, or  **cancel**. 
    
 
9. On the  **Block Access** page, if you do not want your app or add-in to be listed and sold in some countries/regions:
    
      - Select the  **Block customers in certain countries/regions from purchasing this app** check box.
    
 
  - Choose  **Select countries/regions**.
    
      - In the  **Select which countries/regions you would like to block** dialog box, choose the countries/regions you want to block from purchasing your app or add-in.
    
 
  - Choose  **Block countries/regtions** or **Cancel** after making your selections. If you block a particular country/region, users in that region will not be able to acquire or use your app or add-in.
    
 

     **Note**  To submit a SharePoint Add-in that uses OAuth and that you want to distribute to China, you must block access for all countries except China. 
10. Choose  **NEXT**,  **SAVE AS DRAFT**, or  **cancel**. 
    
 
11. On the  **pricing** page, specify the pricing of your add-in. If you're submitting a web app, leave the default **This app is free** value selected (web apps are always free).
    
     **Note**  If you don't see the  **pricing** page, your add-in cannot be offered for purchase.To list your add-in for purchase, you must also provide payout and tax information. 

    Choose one of the following:
    
      -  **This app is free** (default).
    
 
  -  **This app is for one-time purchase**, and select the  **Price per user**.
    
 
  -  **This app is will be sold as a subscription**, and select the  **Price per user**.
    
    The price is set at the add-in level. You don't set a price for each language. The price customers will see is in the currency associated with the Office Store in which your app is sold.
    
    If you want to place a limit on the maximum a buyer pays for either a one-time purchase or a subscription, choose a  **Price threshold**. If you choose  **No threshold**, the buyer pays the  **Price per user** for each user. The **Price per user** multiplied by the **Price threshold** equals the maximum a buyer will pay for unlimited users. For example, if the **Price per user** equals $1.99 USD, with a **Price threshold** equal to 10 users, the maximum price for unlimited users equals $19.90. The buyer pays $1.99 for each user up to 10 users, with no additional charge for 11 or more users.
    
     **Note**  After you submit the listing, you can't change the pricing from subscription to one-time charge or vice versa. This includes submissions you made before the subscription pricing option was available.

    For paid or subscription add-ins, choose whether you want to offer it as a trial. To offer a trial: 
    
      1. Under  **Trial support**, select the  **My app supports a trial** check box.
    
 
  2. In the  **Duration of Trial** drop-down list, select the duration of the trial.
    
 
  3. In the  **Number of Users in Trial** drop-down list, specify the number of trial users you want to allow.
    
 

    You can also choose  **SAVE AS DRAFT** and add your pricing information later. For more information, see [Decide on a pricing model for your Office or SharePoint Add-in or Office 365 web app](decide-on-a-pricing-model-for-your-office-or-sharepoint-add-in-or-office-365-web-app.md).
    
 
12. Choose  **SAVE AS DRAFT** or **cancel**.
    
 

## Submit an app or add-in for approval

After your account in the Seller Dashboard is approved, you can submit your app for approval. To submit an app or for purchase, your payout and tax information must also be validated. Your approved apps and will be listed in product-specific stores.
 

 

### To submit a new app that you have added


1. Follow the steps in the previous section.
    
 
2.  In the final step of the procedure, choose **SUBMIT FOR APPROVAL** instead of **SAVE AS DRAFT**.
    
 

### To submit an app or that you saved to the Seller Dashboard as a draft and need to edit


1. On the  **manage** tab, choose the app or add-in you want to edit and submit.
    
 
2.  On your summary page, choose **EDIT DRAFT** and make your changes. Choose **SUBMIT FOR APPROVAL**.
    
 

### To submit an app or add-in that you saved to the Seller Dashboard as a draft


1. On the  **manage** tab, choose the entry that you want to submit.
    
 
2. On your summary page, choose  **SUBMIT FOR APPROVAL**.
    
 

 **Note**  After you submit an app or add-in for approval, you cannot make changes to it during the approval process. When the approval process is complete, you will receive an email message indicating that your app was approved or that you need to make changes before it can be approved. 
 


## Additional resources
<a name="bk_addresources"> </a>


-  [Register as an app developer](https://dev.windows.com/en-us/programs/join)
    
 
-  [Checklist for submitting Office and SharePoint Add-ins and Office 365 web apps to the Seller Dashboard](checklist-for-submitting-office-and-sharepoint-add-ins-and-office-365-web-apps-to-the-seller-dashboard.md)
    
 
-  [Create effective Office Store apps and add-ins](create-effective-office-store-apps-and-add-ins.md)
    
 
-  [Have your app appear in the Office 365 App launcher](https://msdn.microsoft.com/en-us/office/office365/howto/connect-your-app-to-o365-app-launcher)
    
 

