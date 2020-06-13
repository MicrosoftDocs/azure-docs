---
title: On demand provisioning
description: On demand provisioning
services: active-directory
author: msmimart
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: conceptual
ms.date: 06/16/2020
ms.author: mimart
ms.reviewer: arvinh
---

# On demand provisioning
On demand provisioning allows you to provision a user into an application in seconds. This capability will allow you to test provisioning for an application and diagnose issues with your configurea

## How-to use on demand provisioning 

1. Log into the **Azure Portal**
2. Navigate to **Enterprise applications**
3. Select your application and navigate to the provisioning configuration page
4. Configure provisioning by providing your admin credentials
5. Click **provision on demand**
6. Search for a user by first name, last name, display name, user principal name, or email
7. Select provision at the bottom of the page

## Understanding the provisioning steps
A provisioning event is generally broken up into five steps. One or more of the steps below will be shown in the on demand provisioning experience to help you understand what is happening. 

### Step 1: Test connection
The provisioning service attempts to authorize access to the target application by making a request application for a test user. The provisioning service expects a  response indicating that it is auhtorized to proceed with the provisioning steps. This shows an [example](https://docs.microsoft.com/azure/active-directory/app-provisioning/use-scim-to-provision-users-and-groups#request-3) request made to a SCIM application. Note, this step is only shown when there is a failure in the step. 

Common failures:
* Your credentials to the target application or tenant URL are incorrect
* The application does not support filtering on the matching attribute in your provisioning configuration
* The test connection request has timed out

### Step 2: Import user
First, the provisioning service retrieves the user from the source system. The properties of the user are displayed on the page when clicking view details. 

Common failures:
* Importing the user can fail when the matching attribute is missing for the user. You can resolve this failure by updating the user object with a value for the matching attribute or changing the matching attribute in your provisioning configuration.  

### Step 3: Determine if user is in scope
Next, the provisioning service determines if the user is in [scope](https://docs.microsoft.com/azure/active-directory/app-provisioning/how-provisioning-works#scoping). for provisioning. The service will consider aspects such as whether the user is assigned to the application, whether scope is set to sync assigned or sync all, and the scoping filters defined in your provisioning configuration.  

Common failures:
* An invalid scoping filter was used, such as using the ["Greater than"](https://docs.microsoft.com/azure/active-directory/app-provisioning/define-conditional-rules-for-provisioning-user-accounts#create-a-scoping-filter) operator with a non-integer value. 

### Step 4: Match user between source and target
In this step the service attempts to match the user that was retrieved in the import step with a user in the target system. 

Common failures:
* The provisioning service is unable to uniquely match a user in the source with a user in the target. This can be resolved by ensuring the matching attribute is unique. 
* The target application does not support filtering on the attribute degined as the matching attribute.  

### Step 5: Perform action
Finally, the provisioning service takes an action such as creating, updating, deleting, or skipping the user. 

Common failures:
* The failures for exporting changes can vary greatly. Check out the provisioning logs [documentation](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-provisioning-logs#error-codes) for common failures.


## Frequently asked questions
* **Do you need to turn provisioning off to use on demand provisioning?** No. On demand provisioning can be used while the provisioning job is running. However, you may want to turn the provisioning service off before making a change to your attribute mappings or scoping filters and testing the changes with on demand provisioning. 
* **How long does on demand provisioning take?** It generally takes less than 30 seconds. 

## Known Limitations
There are a few known limitations today. Please post on [UserVoice](aka.ms/applicationprovisioningfeedback) so we can better prioritize what updates to make next. Note that these limitations are specific to the on demand provisioning capability. for specifics about whether an application supports provisioning groups, deletions, etc., check the application tutorial. 

* The applications Box, G Suite, Workday SuccessFactors, AWS, and Slack do not support on demand provisioning
* Provisioning groups is not suppoerd
* Disabling or deleting users and groups is not supported

## Additional Resources

* [Troubleshooting provisioning](https://docs.microsoft.com/azure/active-directory/app-provisioning/application-provisioning-config-problem)
