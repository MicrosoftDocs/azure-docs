<properties title="Get started with Intelligent Systems Service" pageTitle="Get started with Intelligent Systems Service" description="Learn how to set up your ISS account and find next steps for connecting devices." metaKeywords="intelligent systems,iss" services="intelligent-systems" solutions="" documentationCenter="" authors="jdecker" videoId="" scriptId="" manager="alanth" />

<tags ms.service="intelligent-systems" ms.devlang="" ms.topic="article" ms.tgt_pltfrm="" ms.workload="tbd" ms.date="10/01/2014" ms.author="jdecker" />

<!--The next line, with one pound sign at the beginning, is the page title--> 
# Get started with Intelligent Systems Service 

<p> Welcome to Azure Intelligent Systems Service (ISS), the cloud-based service that helps you collect data from devices and sensors across a variety of operating system platforms.

<!--Table of contents for topic, the words in brackets must match the heading wording exactly-->

+ [Before you begin] 
+ [Create your ISS account]
+ [Next steps]



## Before you begin

This article explains how to set up your ISS account. If you'd like to learn more about ISS before proceeding, read [the Intelligent Systems Service overview] to understand how ISS works. 

If you don't have an Azure account yet, [create an Azure account].

Each Azure account has a default Azure Active Directory (AD) tenant. Azure AD provides authentication for your ISS account. Administrators in your Azure AD tenant can access your ISS account in the Azure portal. Users in your Azure AD tenant can access the ISS management portal.

If you don't want to use your existing Azure AD tenant, you can create <a href="http://msdn.microsoft.com/en-us/library/azure/jj573650.aspx">a new Azure AD tenant</a> to use specifically for your ISS account. 




## Create your ISS account

ISS is a preview service in your Azure portal.   

1. In the Azure portal, click **NEW** > **APP SERVICES** > **INTELLIGENT SYSTEMS** > **QUICK CREATE**.

2. Enter the following information: 

  + **An account name**. The name of your account is used in the URIs of your account's endpoints. The name must be all lowercase letters or numbers with no spaces, 3 - 24 characters in length, and globally unique within ISS.
  + **A subscription**. This is the Azure subscription you want your ISS account to reside in. If you have multiple Azure subscriptions, you can choose the one you want from the menu.
  + **A region**. This is the data center that your ISS account will reside in. For the preview, you can select West US or North Europe.
  + **Azure Active Directory Tenant**. This is the Azure AD tenant that will be used to control access to your ISS account. 



## Next steps

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam ultricies, ipsum vitae volutpat hendrerit, purus diam pretium eros, vitae tincidunt nulla lorem sed turpis: [Link 3 to another azure.microsoft.com documentation topic]. 

<!--Anchors-->
[Before you begin]: #before-you-begin
[Create your ISS account]: #create-your-iss-account

[Next steps]: #next-steps

<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png


<!--Link references-->
[create an Azure account]: ../php-create-account/
[the Intelligent Systems Service overview]: ../iss-overview

