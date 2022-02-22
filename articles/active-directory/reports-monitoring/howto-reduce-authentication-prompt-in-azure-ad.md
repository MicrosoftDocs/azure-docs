---

title: How to download logs in Azure Active Directory | Microsoft Docs
description: Learn how to download activity logs in Azure Active Directory.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: karenhoran
editor: ''

ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: report-monitor
ms.date: 05/14/2021
ms.author: markvi
ms.reviewer: cokoopma

ms.collection: M365-identity-device-management
---

# How to: Reduce authentication prompts in Azure AD



We will walk you through the different data sets available to you in this workbook and give you some tips on how to improve your end user experience by reducing extra prompts. 

## Why extra prompts matter

Before we jump into the workbook details, we want to share a customer story who was simulating a cyber-attack in their environment. They started by running a simple password spray attack to find all the weak and easily guessable passwords in their organization. Then these users were bombarded with MFA prompts to see how they would react. I know what you are thinking, don’t worry they had management approval to do this.

To the company’s surprise they found that no users reported these unexpected prompts! To make matters worse, many of the users blindly approved the MFA prompts without understanding they didn’t initiate any of them. One user just completely gave up and uninstalled the Authenticator app entirely! 

When not caused by a cyber-attack simulation, over prompting of users can be caused by a miss configured application or an overly aggressive authentication prompts policy. Over prompting users impacts their productivity and often leads users to approving MFA prompts they didn’t initiate. To be clear, MFA is essential! We are not talking about if you should require MFA but how frequently you should prompt your users.

OK, now let’s dive into our new workbook and how to use it to analyze the prompts in your tenant. We will walk you through a sample customer environment.

## Authentication methods 

First, you’ll want to start with getting an understanding of what types of authentications are taking place in your environment and from what types of devices. You’ll do this by looking at the initial data chart, Authentication Prompts by Authentication Methods. 

 

Start by asking if this is what you’d expect to see in your environment based on what authentication methods you know your users are using. This sample customer tenant, in effort to reduce prompts and improve their end user experience, has been moving their users to use the Authenticator app as a second factor. To understand how the authenticator app can reduce prompts on mobile devices, read this deep dive on the PRT.  

TIP: To move users from telecom-based methods to the Authenticator app, nudge users to set up Microsoft Authenticator. More information: https://aka.ms/nudge 


Another way to reduce MFA prompts is to move to a passwordless authentication method at sign-in such as Hello for Business or FIDO2. To validate what authentication methods users have registered in your tenant, you can use the Authentication Methods insights dashboard. If you see things that are not expected, those are good candidates to investigate further. 


## Devices 

The next two charts focus on devices being used in the environment. The first one is a view of how many authentications per hour are coming from which OS. This should help you determine are people seeing unnecessary prompts on their workstations or their mobile phones so you can start to focus on where we can improve the experience the most. It’s also a good way to see if there are any devices on older OSes that might have gotten missed in previous upgrades. 





 
 

From this data set we can determine that most of our prompts per hour are coming from workstations, not mobile phones. It also looks like a few Windows 8 machines didn’t get upgraded to the correct corporate Windows 10 build. We should also go back and fix that. If you saw a high number of authentications from mobile phones, as we mentioned earlier, the Authenticator app is a great way to cut down on those prompts. But since it’s on Windows workstations, let’s move to the next chart. 

Authentication prompts by device state is a view of how many prompts are devices that either Azure AD joined, Hybrid Azure AD Joined, Azure AD registered, or completely unknown to Azure AD aka ‘unmanaged’. 

 
 

This tells us that the vast majority of prompts are coming from unmanaged devices. Azure AD Join and Hybrid Azure AD Join the current devices is on the next quarter roadmap for this customer and this will drastically cut down on additional MFA prompts because the device will now have the Azure AD Primary Refresh Token (PRT). Similar to how the Authenticator app can reduce prompts on mobile. 

So that’s our overall authentication view and what the authentication experience looks like from a device view. Now let’s take a look at it from a user view in the Authentication Prompts by User data set. 

Users

Similar to the other views this will show us the most prompts during this time span from a user perspective. As we can see some of these numbers are expected. However, we have several users that are doing many more prompts than we’d expect and would be cause for more investigation. 

 

If we scroll down a bit farther, we have a summary of users with the most prompts and additional information for troubleshooting such as application, time stamp and request ID.  For a reference point, you can also see the average and median prompt count across all users. The top users in this list likely are having a bad experience. This is typically because something is misconfigured or maybe the account is under attack. Either way, investigation is warranted and action should be taken. 

 

## Applications

If an application is misconfigured, it may attempt to continuously attempt to authenticate unsuccessfully and ultimately have a very high prompt count.  With that in mind, look out for applications that have a disproportionally high percentage of prompts. For many customers the most used apps will be the business productivity apps. Anything that isn’t expected should be investigated. 


 

## Authentication process detail

With every sign-in, there are authentication process details included such as OAUTH Scope, the type of Authentication Library, IP addresses, legacy TLS, and CAE (Continuous Access Evaluation. It is important to note that one sign-in may have more than one process involved. 

 

This data can be useful when troubleshooting or looking for legacy TLS in your environment once TLS 1.0/1.1 and 3DES is deprecated. To learn more:  Enable TLS 1.2 support as Azure AD TLS 1.0/1.1 is deprecated – Active Directory


## Authentication policy

Azure AD has multiple policies that can require MFA for the user – for example: Conditional Access, Per-user MFA and Security defaults can also require a user to perform MFA. One lesser-known way for a user to be prompted for MFA is if the app requires MFA in order to gain access (enforced by the relying party, instead of the Identity Provider). For example, every time a user goes to update their security information, the user is required to do MFA. This chart will help you identify if there are policies you didn’t expect in your tenant that enforced MFA on your users.

 


## Recommendations and workbook tips

Finally at the bottom we have four big ways to improve your users’ experience and reduce prompts and the relative percentage.  For example, identify authentications prompts on mobile devices that are using any authentication methods other than the Authenticator app.

 

One final workbook tip, at the very top of the workbook you can continue to get more granular in your filtering. 

 

Filtering for a specific user having a lot of authentication requests or only showing applications with sign-in failures can also lead to interesting findings to continue to remediate. 


Additional resources

•	To learn more about the different vulnerabilities of different MFA methods, we recommend checking https://aka.ms/allyourcreds
•	To understand more about the different policies that impact MFA prompts, we recommend reading http://aka.ms/MFAprompts 

Hopefully this workbook will provide some insights and help you reduce prompts in your organization! If you have any feedback on the workbook, please fill out this short survey. 


Inbar Cizer Kobrinsky & Corissa Koopmans 


## Next steps

- [Sign-ins logs in Azure AD](concept-sign-ins.md)
- [Audit logs in Azure AD](concept-audit-logs.md)