---
title: Service principal protection with Azure Active Directory Conditional Access
description: Protecting service principal use with Conditional Access policies

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 10/05/2021

ms.author: joflore
author: MicrosoftGuyJFlo
manager: karenhoran
ms.reviewer: dawoo

ms.collection: M365-identity-device-management
---
# Preview: Service principal protection with Conditional Access

Previously, Conditional Access applied only to users when they access apps and services like SharePoint online or the Azure portal and associated APIs. This preview adds support for Conditional Access policies applied to service principals owned by the organization. 

A service principal is an identity created for use with applications, hosted services, and automated tools to access Azure resources.

The preview enables blocking service principals from outside of trusted IP ranges, such as corporate network public IP ranges. 

> ![NOTE]
> Policy can be applied to single tenant service principals that have been registered in your tenant. 
> Third party SaaS and multi-tenanted apps are out of scope. 
> Managed identities are not covered by policy. 

## Implementation

### Step 1

Step 1 is optional, if you already have a test application that makes use of a service principal you can skip this step.

Setup a sample application that, demonstrates how a job or a Windows service can run with an application identity, instead of a user's identity. Follow the instructions in the article [Quickstart: Get a token and call the Microsoft Graph API by using a console app's identity](../develop/quickstart-v2-netcore-daemon.md) to create this application.

### Step 2 

Create a location based Conditional Access policy that applies to the test application's service principal.

1. Sign in to the **Azure portal** as a global administrator, security administrator, or Conditional Access administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users and groups**.
   1. Under **What does this policy apply to?**, select **Workload identities**.
   1. Under **Include**, choose **Select service principals**.
Create a new Conditional Access policy.  

On the user and group condition select ‘Service principals’ from the drop down. 

Select service principals to include. Choose from the following options: 

“All owned service principals” include all service principals for apps created in the tenant (Except for Managed Identities). This does not include apps registered by SaaS providers. 

“Select service principal” pick service principals using dynamic targeting with attributes or individually selecting service principals. 

Graphical user interface, text, application

Description automatically generated 

 

The below screen shows individually selecting a service principal. Details of using the dynamic targeting are in the document titled” Using Dynamic Targeting in CA for Service Principals”. More information about Custom Security Attributes in general can be found in the document titled “Azure AD custom security attributes and ABAC conditions Private Preview”. 

Graphical user interface, application, Word

Description automatically generated 

 

Using the ‘Cloud apps” condition select target resources. Either using ‘All cloud apps’ or individual resources. Policy will apply when a service principal requests a token for one of these target apps. 

Configure the location condition, under ‘Conditions. Apply policy to include “any location” and exclude selected named locations. You can learn more about location policies here.  

Select the Grant control ‘Block’, so access is blocked when a token request is made from outside the allowed range. you There is a known issue where all controls are enabled. Currently only ‘block’ is supported as part of the preview. 

Save policy. Policy can be saved in report-only, so sign-in log can be used to estimate impact, or policy is enforced by turning policy on. 

Page Break
 

Sign-in logs 

The sign-in logs can be used to review how policy is enforced for service principals or expected impact of policy when using report-only mode.  

Navigate to the ‘service principal sign-ins’ section of the sign-in logs 

Graphical user interface, text, application, email

Description automatically generated 

 

Click on the log entry to view Conditional Access evaluation information 

Graphical user interface, text, application

Description automatically generated 

Known limitation. The policy details blade is not yet supported for service principals. It will show the user matched policy, where it will be updated show if the service principal matched policy or not. 

Validation 

Run app, check for expected result. 

Check sign-in log. 

Failure reason when Service Principal is blocked by CA: 

“Access has been blocked due to conditional access policies.” 

Roll back 

If you wish to roll back this feature, you can delete or disable policies  

Support 

Support during private preview is supplied directly by the Azure AD engineering team during the US Pacific Time Zone business hours. 

To report an issue, please email your GTP PM. 

Customer Expectations 

Customers are required to actively test the feature and provide feedback  

If you have any questions, please email your GTP PM. 


 

Appendix 

Microsoft Graph reference 

You need the objectID of the service principal in your tenant. You can get this from Azure AD Enterprise Applications. Note: The Object ID in Azure AD App registrations cannot be used. This is the Object ID of the app registration, not of the service principal.  

Open the ‘Enterprise Applications’ blade in the Azure Portal and find the app you registered.  

Open your app details 

Copy the Object ID of the application. This is the unique identifier for the service principal created in your tenant, so is used by Conditional Access policy to find the calling app. 

 

Text Box 

Text Box 

Sample JSON file for configuration 

Text Box 

 

 