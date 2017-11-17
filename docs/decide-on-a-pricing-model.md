# Decide on a pricing model for your Office Store submission

The Office Store provides a variety of pricing options. You don't have to set your pricing model until you submit your app or add-in, and you don't have to specify anything in your app or add-in to support the pricing option you choose. However, it's a good idea to decide on your pricing model during your design and development process. The pricing model you choose might influence the features and behavior you include. Also, certain monetizing strategies, such as using the licensing framework, or offering ads or additional purchases, require you to implement custom code.
 


> [!NOTE]
> SharePoint Add-ins that use the subscription model are only available for SharePoint Online users, and will not be shown to SharePoint on-premises users.
 


## Office Store pricing options

When you submit an app or add-in to the Office Store via the Seller Dashboard, on the  **Pricing** page, you choose one of the following pricing options.
 

 


|**Option**|**Description**|
|:-----|:-----|
|Free|The user can download and use at no charge. You can still monetize via advertising or by offering features or content for purchase.|
|One-time payment|The user can download for a one-time charge.|
|Subscription|The user can download and use for a recurring monthly fee. Subscription apps or add-ins are offered on a monthly automatic renewal basis only. Users have to manually cancel their subscriptions|
For details about requirements for advertising and offering features or content for purchase within your add-in or add-in, see sections 2 and 3 of the  [Validation policies](validation-policies.md).
 
> [!NOTE]
> Power BI custom visuals in the Office Store can only be free.
 

## Setting the price

When you set the price, the price tier applies across all currencies. You don't set a specific price for each language. The price tier sets the sales price in all the countries or regions where you choose to distribute your app or add-in. The price tier you select is translated into the appropriate currency for the buyer. Each price tier has a corresponding value in each currency offered by the Office Store. We use these values to help you sell your apps and add-ins at a comparable price point worldwide. However, due to changes in foreign exchange rates, the exact sales amount might vary slightly from one currency to another.
 

 
Keep in mind that the price tier you select might include sales or value-added tax that your customers must pay. For example, if you sell an add-in at 1.19 EUR in Europe, a 15% VAT tax is included. Your add-in proceeds are based on the post-tax amount of 1.03 EUR (1.19 - 0.16).
 

 
For paid and subscription apps and add-ins, you can refine your pricing model by offering a trial, or setting a price threshold. These settings are ignored when you set the pricing to  **Free**.
 

 

 

 
With a  **Trial offer**, the user can download and use the app or add-in for no charge for the preset amount of time you choose. At the end of the trial period, the user must make a purchase or lose access. Trial offers do not automatically convert to purchases. For SharePoint Add-ins, you can also set a limit on the total number of users on a site who can use the add-in as a trial.
 

 
If you want to have more control over the features or functionality that available during the trial, implement licensing checks by using the licensing framework. For more information, see [License your Office and SharePoint Add-ins](license-your-add-ins.md).
 

 
For SharePoint Add-ins, you can also specify a  *price threshold*  . This sets a limit on the amount a single buyer pays for purchasing multiple add-in licenses. For example, if you set the price threshold at 10 users, the user is only charged for the first 10 licenses they purchase. Any licenses they purchase after that are free.
 

 
The price threshold setting lets you specify if and when you want to switch from a  *per-user*  to a *site license*  pricing model. In a per-user model, you charge for each additional user license; in a site license model, you charge a flat fee, regardless of the number of users.
 

 

- If you set the price threshold at  **no threshold**, your add-in won't be offered under a site license pricing model. Each additional user will be charged the full price you set. 
    
 
- If you set the price threshold at one user, you offer your add-in under a site license pricing model. The first user is charged the full price, but each additional user is free.
    
 
You can't have a single listing that is both a one-time charge and a subscription. If you want to offer your app or add-in as both a one-time charge and a subscription, you have to create separate submissions for each. The add-in package you upload for each can be identical, except for the product ID you specify in the manifest. The product ID must be unique for each submission. We recommend that you create unique titles and descriptions for each submission, to make it clear to customers that one is offered as a one-time charge, and the other as a subscription.
 

 
You can't change the pricing from a subscription to a one-time charge, or vice versa, after you submit your listing. 
 

 
The following table lists the options that are available for monetizing for your app or add-in.
 

 


|**Free**|**One-time charge or monthly subscription**|
|:-----|:-----|
| Include custom licensing behavior?<ul><li>Implement custom code to perform [licensing checks](http://msdn.microsoft.com/en-us/library/office/apps/jj163257.aspx).</li></ul>Include ads?<ul><li>Implement custom code to [Create effective ad-supported apps and add-ins](create-effective-office-store-listings.md#bk_ads).</li></ul>Include purchases?<ul><li>Implement custom code to support those features. Be sure to comply with the [Validation policies for apps and add-ins submitted to the Office Store](validation-policies.md).</li></ul> | Set price per user.<br></br>Offer site license? (SharePoint Add-ins only)<ul><li>Set price threshold.</li></ul>Offer add-in as a trial?<ul><li>Set trial duration.</li><li>Set user limit (SharePoint Add-ins only).</li></ul>Include custom licensing behavior?<ul><li>Implement custom code to perform [licensing checks](http://msdn.microsoft.com/en-us/library/office/apps/jj163257.aspx).</li></ul>Include ads?<ul><li>Implement custom code to [create effective ad-supported apps and add-ins](create-effective-office-store-listings.md#bk_ads).</li></ul>Include purchases?<ul><li>Implement custom code to support those features. Be sure to comply with the [validation policies](validation-policies.md).</li></ul>|

## Hosting your apps or add-ins on Microsoft Azure

One important factor to consider when deciding on the pricing for your app or add-in is the cost of hosting. If you offer your app or add-in via a monthly subscription, you'll want to monitor how it is used and how many resources it consumes. Consider hosting your app or add-in on Azure. Hosting in the cloud provides clarity on both usage patterns and costs. This insight can help you determine what limits to set for a free trial or set optimal price thresholds.
 

 
Azure also enables you to scale your app or add-in to match demand and reduce costs. You pay only for what you use, and you can provision resources immediately. You don't have to overprovision for occasional peak loads. 
 

 
For more information, see  [Hosting add-ins on Microsoft Azure](http://www.windowsazure.com/en-us/overview/application-hosting/) or sign up for a [free Azure trial](http://www.windowsazure.com/en-us/pricing/free-trial/).
 

 

