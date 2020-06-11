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
The provisioning service generally operates on a [cycle](https://docs.microsoft.com/azure/active-directory/app-provisioning/how-provisioning-works#provisioning-cycles-initial-and-incremental)... 

## How-to use on demand provisioning 

1. Log into the Azure Portal
2. Navigate to enterprise applications
3. Select your application and navigate to the provisioning configuration page
4. Configure provisioning by providing your admin credentials
5. Click provision on demand
6. Search for a user by first name, last name, display name, user principal name, or email
7. Select provision

## Understanding the provisioning steps
A provisioning event is generally broken up into five steps. One or more of the steps below will be shown in the on demand provisioning experience. 

### Test connection
The provisioning service attempts to authorize access to the application by making a request to the target application for a test user. The provisioning service expects a valid response, indicating that it is auhtorized to proceed with the provisioning steps. This shows an [example](https://docs.microsoft.com/azure/active-directory/app-provisioning/use-scim-to-provision-users-and-groups#request-3) request made to a SCIM application. This step is only shown in the on demand provisioning experience when there is a failure in the step. 

**Common failures:**
* Your credentials to the target application or tenant URL are incorrect
* The application does not support filtering on the matching attribute in your provisioning configuration
* The test connection request has timed out

### Import user
First, the provisioning service retrieves the user from the source system. The properties of the user in the source system are retrieved and displayed in the page when clicking view details. 

**Common failures:** 
* Matching attribute is missing for the user. 

### Determine if user is in scope
Next, the service determines if the user is in [scope](https://docs.microsoft.com/azure/active-directory/app-provisioning/how-provisioning-works#scoping). The service will consider aspects such as whether the user is assigned to the application, whether scope is set to sync assigned or sync all, and the scoping filters defined for the application. 

**Common failures:**
* Invalid scoping filter was used

### Match user between source and target
In this step the service attempts to match the user that was retrieved in the import step with a user in the target system. 

**Common failures:**
* Matching attribute is not unique
* Two users in the source or target with the same matching attribute
### Perform action
Finally, the provisioning service takes an action such as creating the user, updating, deleting, or skipping. 

**Common failures:**
* https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-provisioning-logs#error-codes
* 

## Frequently asked questions
* Do you need to tur provisioning off to use on demand provisioning? No. On demand provisioning can be used while the provisioning job is running. However, you may want to turn the provisioning service off before making a change to your attribute mappings or scoping filters and testing the changes with on demand provisioning. 
* How long does on demand provisioning take? It generally takes less than 30 seconds. 

## Known Limitations
There are a few known limitations today. Please post on [UserVoice](aka.ms/applicationprovisioningfeedback) so we can better prioritize what updates to make next. Note that these limitations are specific to the on demand provisioning capability. for specifics about whether an application supports provisioning groups, deletions, etc., check the application tutorial. 

* The applications Box, G Suite, Workday SuccessFactors, AWS, and Slack do not support on demand provisioning
* Provisioning groups is not suppoerd
* Disabling or deleting users and groups is not supported

## Additional Resources

* [Troubleshooting provisioning](https://docs.microsoft.com/azure/active-directory/app-provisioning/application-provisioning-config-problem)
