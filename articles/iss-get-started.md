<properties title="Get started with Intelligent Systems Service" pageTitle="Get started with Intelligent Systems Service" description="Learn how to set up your ISS account and find next steps for connecting devices." metaKeywords="intelligent systems,iss" services="intelligent-systems" solutions="" documentationCenter="" authors="jdecker" videoId="" scriptId="" manager="alanth" />

<tags ms.service="intelligent-systems" ms.devlang="" ms.topic="article" ms.tgt_pltfrm="" ms.workload="tbd" ms.date="11/13/2014" ms.author="jdecker" />

<!--The next line, with one pound sign at the beginning, is the page title--> 
# Get started with Intelligent Systems Service 

<p> Welcome to Azure Intelligent Systems Service (ISS), the cloud-based service that helps you collect data from devices and sensors across a variety of operating system platforms.

<!--Table of contents for topic, the words in brackets must match the heading wording exactly-->

+ [Before you begin] 
+ [Create your ISS account]
+ [Next steps]



## Before you begin

<p>This article explains how to set up your ISS account. If you'd like to learn more about ISS before proceeding, read [the Intelligent Systems Service overview] to understand how ISS works. 



- If you don't have an Azure account yet, [create an Azure account].



- Each Azure account has a default Azure Active Directory (AD) tenant. Azure AD provides authentication for your ISS account. Administrators in your Azure AD tenant can access your ISS account in the Azure portal. Users in your Azure AD tenant can access the ISS management portal. <p>If you don't want to use your existing Azure AD tenant, you can create <a href="http://msdn.microsoft.com/en-us/library/azure/jj573650.aspx">a new Azure AD tenant</a> to use specifically for your ISS account.



- ISS is an Azure preview service. To enable ISS in your Azure portal, sign up at <a href="http://azure.microsoft.com/en-us/services/preview/">Preview features</a>. 




## Create your ISS account

   

1. In the Azure portal, click **NEW** > **APP SERVICES** > **INTELLIGENT SYSTEMS** > **QUICK CREATE**.

2. Enter the following information: 

  + **An account name**. The name of your account is used in the URIs of your account's endpoints. The name must be all lowercase letters or numbers with no spaces, 3 - 24 characters in length, and globally unique within ISS.
  + **A subscription**. This is the Azure subscription you want your ISS account to reside in. If you have multiple Azure subscriptions, you can choose the one you want from the menu.
  + **A region**. This is the data center that your ISS account will reside in. For the preview, you can select West US or North Europe.
  + **Pricing tier**. The pricing tier is how much it will cost for devices to send data to ISS. The tier you select when you create your ISS account will apply to any devices registered unless the device registration specifies a different pricing tier. You can change the default pricing tier and the pricing tier for specific devices in the ISS management portal.
  + **Azure Active Directory Tenant**. This is the Azure AD tenant that will be used to control access to your ISS account.
  
![ISScreateaccount][]


## Next steps

<p>After your ISS account is created, go to your ISS account in the Azure portal and click **Manage** to open your ISS management portal.<p>![manage][] <p><a href="http://go.microsoft.com/fwlink/p/?LinkId=513336">Learn about using the ISS management portal.</a><p>

<p>
 

<!--Anchors-->
[Before you begin]: #before-you-begin
[Create your ISS account]: #create-your-iss-account
[Next steps]: #next-steps

<!--Image references-->
[ISscreateaccount]: ./media/iss-get-started/isscreateaccount.jpg
[manage]: ./media/iss-get-started/manage.png


<!--Link references-->
[create an Azure account]: ../php-create-account/
[the Intelligent Systems Service overview]: ../iss-overview

