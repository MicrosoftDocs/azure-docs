---
title: Troubleshoot Conditional Access using the What If tool
description: Where to find what Conditional Access policies were applied and why

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: troubleshooting
ms.date: 06/17/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: calebb

ms.collection: M365-identity-device-management
---
# Troubleshooting Conditional Access using the What If tool

The [What If tool](what-if-tool.md) in Conditional Access is powerful when trying to understand why a policy was or wasn't applied to a user in a specific circumstance or if a policy would apply in a known state.

The What If tool is located in the **Azure portal** > **Azure Active Directory** > **Security** > **Conditional Access** > **What If**.

![Conditional Access What If tool at default state](./media/troubleshoot-conditional-access-what-if/conditional-access-what-if-tool.png)

## Gathering information

The What If tool requires only a **User** or **Workload identity** to get started. 

The following additional information is optional but will help to narrow the scope for specific cases.

* Cloud apps, actions, or authentication context
* IP address 
* Country/Region
* Device platform
* Client apps
* Device state
* Sign-in risk
* User risk level
* Service principal risk (Preview)
* Filter for devices

This information can be gathered from the user, their device, or the Azure AD sign-ins log.

## Generating results

Input the criteria gathered in the previous section and select **What If** to generate a list of results. 

At any point, you can select **Reset** to clear any criteria input and return to the default state.

## Evaluating results

### Policies that will apply

This list will show which Conditional Access policies would apply given the conditions. The list will include both the grant and session controls that apply including those from policies in report-only mode. Examples include requiring multifactor authentication to access a specific application. 

### Policies that will not apply

This list will show Conditional Access policies that wouldn't apply if the conditions applied. The list will include any policies and the reason why they don't apply including those from policies in report-only mode. Examples include users and groups that may be excluded from a policy.

## Use case

Many organizations create policies based on network locations, permitting trusted locations and blocking locations where access should not occur.

To validate that a configuration has been made appropriately, an administrator could use the What If tool to mimic access, from a location that should be allowed and from a location that should be denied.

[ ![What If tool showing results with Block access](./media/troubleshoot-conditional-access-what-if/conditional-access-what-if-results.png)](./media/troubleshoot-conditional-access-what-if/conditional-access-what-if-results.png#lightbox)

In this instance, the user would be blocked from accessing any cloud app on their trip to North Korea as Contoso has blocked access from that location.

This test could be expanded to incorporate other data points to narrow the scope.

## Next steps

* [What is Conditional Access report-only mode?](concept-conditional-access-report-only.md)
* [What is Azure Active Directory Identity Protection?](../identity-protection/overview-identity-protection.md)
* [What is a device identity?](../devices/overview.md)
* [How it works: Azure AD Multifactor Authentication](../authentication/concept-mfa-howitworks.md)
