---
title: Provision a user on-demand using Azure Active Directory
description: Force sync
services: active-directory
author: msmimart
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: how-to
ms.date: 06/23/2020
ms.author: mimart
ms.reviewer: arvinh
---

# On-demand provisioning
On-demand provisioning allows you to provision a user into an application in seconds. You can use the capability to quickly troubleshoot configuration issues, validate expressions that you have defined, test scoping filters, and much more. 

## How-to use on-demand provisioning 

1. Log into the **Azure portal**.
2. Navigate to **Enterprise applications**.
3. Select your application and navigate to the provisioning configuration page.
4. Configure provisioning by providing your admin credentials.
5. Click **provision on-demand**.
6. Search for a user by first name, last name, display name, user principal name, or email.
7. Select provision at the bottom of the page.

:::image type="content" source="media/provision-on-demand/on-demand-provision-user.jpg" alt-text="On demand provision a user.":::

## Understanding the provisioning steps
The on-demand provisioning capability attempts to show the steps that the provisioning service takes when provisioning a user. There are typically five steps to provisioning a user, and one or more of the steps below will be shown in the on demand provisioning experience.

### Step 1: Test connection
The provisioning service attempts to authorize access to the target application by making a request for a "test user". The provisioning service expects a  response indicating that it's authorized to continue with the provisioning steps. This step is only shown when there is a failure in the step. It's not show in the on-demand provisioning experience when the step is successful. 

**Troubleshooting tips**
* Ensure that you have provided valid credentials to the target application, such as the secret token and tenant URL. The credentials required vary by application. Detailed configuration tutorials can be found [here](https://docs.microsoft.com/azure/active-directory/saas-apps/tutorial-list). 
* Ensure that the target application supports filtering on the matching attribute(s) defined in the attribute mappings blade. You may need to check the API documentation provided by the application developer to understand the filters that they support.  
* For SCIM applications, you can use a tool such as postman to ensure that the application responds to the authorization requests as the Azure AD provisioning service expects. An example request can be found [here](https://docs.microsoft.com/azure/active-directory/app-provisioning/use-scim-to-provision-users-and-groups#request-3).

### Step 2: Import user
Next, the provisioning service retrieves the user from the source system. The user attributes that the service retrieves are later used to evaluate whether the user is in scope for provisioning, checking the target system for an existing user, and for determining what user attributes to export to the target system. 

**View details**

The view details section shows the properties of the user that were imported from the source system (e.g. Azure AD).

**Troubleshooting tips**
* Importing the user can fail when the matching attribute is missing on the user object in the source system. You can resolve this failure by updating the user object with a value for the matching attribute or changing the matching attribute in your provisioning configuration.  
* If an attribute you were expecting is missing from the list that was imported, ensure that the attribute has a value on the user object in the source system. The provisioning service currently doesn't support provisioning null attributes. 
* Ensure that your provisioning configuration attribute mapping page contains the attribute you are expecting. 

### Step 3: Determine if user is in scope
Next, the provisioning service determines if the user is in [scope](https://docs.microsoft.com/azure/active-directory/app-provisioning/how-provisioning-works#scoping) for provisioning. The service will consider aspects such as whether the user is assigned to the application, whether scope is set to sync assigned or sync all, and the scoping filters defined in your provisioning configuration.  

**View details**

The view details section shows the scoping conditions that were evaluated. You may see one of more of the following properties:
* **Active in source system** indicates that the user has the property is active set to true in Azure AD.
* **Assigned to application** indicates that the user is assigned to the application in Azure AD
* **Scope sync all** indicates that the scope setting allows all users and groups in the tenant.
* **User has required role** indicates that the user has the necessary roles to be provisioned into the application. 
* **Scoping filters** will also be shown if you have defined scoping filters for your application. The filter will be displayed with the following format - {scoping filter title} {scoping filter attribute} {scoping filter operator} {scoping filter value}. 

**Troubleshooting tips**
* Ensure that you have defined a valid scoping role. For example, avoid using the ["Greater than"](https://docs.microsoft.com/azure/active-directory/app-provisioning/define-conditional-rules-for-provisioning-user-accounts#create-a-scoping-filter) operator with a non-integer value. 
* If the user does not have the necessary role, review the tips described [here](https://docs.microsoft.com/azure/active-directory/app-provisioning/application-provisioning-config-problem-no-users-provisioned#provisioning-users-assigned-to-the-default-access-role). 

### Step 4: Match user between source and target
In this step. the service attempts to match the user that was retrieved in the import step with a user in the target system. 

**View details**

The view details pages shows the properties of the user(s) that were matched in the target system. The properties you see in the context pane will vary as follows:
* If there are no users matched in the target system, you won't see any properties.
* If there's one user matched in the target system, you will see the properties of that matched user from the target system.
* If multiple users are matched, you will see the properties of both matched users.
* If multiple matching attributes are part of your attribute mappings, each matching attribute will be evaluated sequentially and the matched users shown. 

**Troubleshooting details**
* The provisioning service is unable to uniquely match a user in the source with a user in the target. This can be resolved by ensuring the matching attribute is unique. 
* Ensure that the target application supports filtering on the attribute defined as the matching attribute.  

### Step 5: Perform action
Finally, the provisioning service takes an action such as creating, updating, deleting, or skipping the user. 

:::image type="content" source="media/provision-on-demand/success-on-demand-provision.jpg" alt-text="Successful provision of user.":::

**View details**

The view details section displays the attributes that were modified in the target application. This represents the final output of the provisioning service activity and the attributes that were exported. If this step fails, the attributes displayed represent the attributes that the provisioning service attempted to modify.  

**Troubleshooting tips**
* The failures for exporting changes can vary greatly. Check out the provisioning logs [documentation](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-provisioning-logs#error-codes) for common failures.


## Frequently asked questions
**Do you need to turn provisioning off to use on-demand provisioning?** For applications that use a long-lived bearer token or username and password for authorization, no additional steps are required. Applications that use OAuth for authorization currently require that the provisioning job is stopped before using on-demand provisioning. Applications such as G Suite, Box, Workplace by Facebook, and Slack fall into this category. Work is in progress to allow running on-demand provisioning for all applications, without having to stop provisioning. 

**How long does on-demand provisioning take?** It generally takes less than 30 seconds. 

## Known Limitations
There are a few known limitations today. Please post on [User Voice](https://aka.ms/appprovisioningfeaturerequest) so we can better prioritize what improvements to make next. Note that these limitations are specific to the on-demand provisioning capability. for specifics about whether an application supports provisioning groups, deletions, etc., check the application tutorial. 

* The applications Workday, AWS, and SuccessFactors do not support on-demand provisioning.
* Provisioning groups and roles on-demand isn't supported.
* On-demand provisioning supports disabling users that have been unassigned from the application, but does not support disabling or deleting users that have been disabled or deleted from Azure Active Directory (those users won't appear when searching for a user).

## Next Steps

* [Troubleshooting provisioning](https://docs.microsoft.com/azure/active-directory/app-provisioning/application-provisioning-config-problem)
