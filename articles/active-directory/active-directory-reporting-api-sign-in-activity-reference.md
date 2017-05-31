---
title: Azure Active Directory sign-in activity report API reference | Microsoft Docs
description: Reference for the Azure Active Directory sign-in activity report API
services: active-directory
documentationcenter: ''
author: dhanyahk
manager: femila
editor: ''

ms.assetid: ddcd9ae0-f6b7-4f13-a5e1-6cbf51a25634
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/16/2017
ms.author: dhanyahk;markvi

---
# Azure Active Directory sign-in activity report API reference
This topic is part of a collection of topics about the Azure Active Directory reporting API.  
Azure AD reporting provides you with an API that enables you to access sign-in activity report data using code or related tools.
The scope of this topic is to provide you with reference information about the **sign-in activity report API**.

See:

* [Sign-in activities](active-directory-reporting-azure-portal.md#sign-in-activities) for more conceptual information
* [Getting started with the Azure Active Directory Reporting API](active-directory-reporting-api-getting-started.md) for more information about the reporting API.

For questions, issues or feedback, please contact [AAD Reporting Help](mailto:aadreportinghelp@microsoft.com).

## Who can access the API data?
* Users and Service Principals in the Security Admin or Security Reader role
* Global Admins
* Any app that has authorization to access the API (app authorization can be setup only based on Global Admin’s permission)

To configure access for an application to access security APIs such as signin events, use the following PowerShell to add the applications Service Principal into the Security Reader role

```PowerShell
Connect-MsolService
$servicePrincipal = Get-MsolServicePrincipal -AppPrincipalId "<app client id>"
$role = Get-MsolRole | ? Name -eq "Security Reader"
Add-MsolRoleMember -RoleObjectId $role.ObjectId -RoleMemberType ServicePrincipal -RoleMemberObjectId $servicePrincipal.ObjectId
```

## Prerequisites
To access this report through the reporting API, you must have:

* An [Azure Active Directory Premium P1 or P2 edition](active-directory-editions.md)
* Completed the [prerequisites to access the Azure AD reporting API](active-directory-reporting-api-prerequisites.md). 

## Accessing the API
You can either access this API through the [Graph Explorer](https://graphexplorer2.cloudapp.net) or programmatically using, for example, PowerShell. In order for PowerShell to correctly interpret the OData filter syntax used in AAD Graph REST calls, you must use the backtick (aka: grave accent) character to “escape” the $ character. The backtick character serves as [PowerShell’s escape character](https://technet.microsoft.com/library/hh847755.aspx), allowing PowerShell to do a literal interpretation of the $ character, and avoid confusing it as a PowerShell variable name (ie: $filter).

The focus of this topic is on the Graph Explorer. For a PowerShell example, see this [PowerShell script](active-directory-reporting-api-sign-in-activity-samples.md#powershell-script).

## API Endpoint
You can access this API using the following base URI:  

    https://graph.windows.net/contoso.com/activities/signinEvents?api-version=beta  



Due to the volume of data, this API has a limit of one million returned records. 

This call returns the data in batches. Each batch has a maximum of 1000 records.  
To get the next batch of records, use the Next link. Get the [skiptoken](https://msdn.microsoft.com/library/dd942121.aspx) information from the first set of returned records. The skip token will be at the end of the result set.  

    https://graph.windows.net/$tenantdomain/activities/signinEvents?api-version=beta&%24skiptoken=-1339686058


## Supported filters
You can narrow down the number of records that are returned by an API call in form of a filter.  
For sign-in API related data, the following filters are supported:

* **$top=\<number of records to be returned\>** - to limit the number of returned records. This is an expensive operation. You should not use this filter if you want to return thousands of objects.  
* **$filter=\<your filter statement\>** - to specify, on the basis of supported filter fields, the type of records you care about

## Supported filter fields and operators
To specify the type of records you care about, you can build a filter statement that can contain either one or a combination of the following filter fields:

* [signinDateTime](#signindatetime) - defines a date or date range
* [userId](#userid) - defines a specific user based the user's ID.
* [userPrincipalName](#userprincipalname) - defines a specific user based the user's user principal name (UPN)
* [appId](#appid) - defines a specific app based the app's ID
* [appDisplayName](#appdisplayname) - defines a specific app based the app's display name
* [loginStatus](#loginStatus) - defines the status of the logins (success / failure)

> [!NOTE]
> When using Graph Explorer, you the need to use the correct case for each letter is your filter fields.
> 
> 

To narrow down the scope of the returned data, you can build combinations of the supported filters and filter fields. For example, the following statement returns the top 10 records between July 1st 2016 and July 6th 2016:

    https://graph.windows.net/contoso.com/activities/signinEvents?api-version=beta&$top=10&$filter=signinDateTime+ge+2016-07-01T17:05:21Z+and+signinDateTime+le+2016-07-07T00:00:00Z


- - -
### signinDateTime
**Supported operators**: eq, ge, le, gt, lt

**Example**:

Using a specific date

    $filter=signinDateTime+eq+2016-04-25T23:59:00Z    



Using a date range    

    $filter=signinDateTime+ge+2016-07-01T17:05:21Z+and+signinDateTime+le+2016-07-07T17:05:21Z


**Notes**:

The datetime parameter should be in the UTC format 

- - -
### userId
**Supported operators**: eq

**Example**:

    $filter=userId+eq+’00000000-0000-0000-0000-000000000000’

**Notes**:

The value of userId is a string value

- - -
### userPrincipalName
**Supported operators**: eq

**Example**:

    $filter=userPrincipalName+eq+'audrey.oliver@wingtiptoysonline.com' 


**Notes**:

The value of userPrincipalName is a string value

- - -
### appId
**Supported operators**: eq

**Example**:

    $filter=appId+eq+’00000000-0000-0000-0000-000000000000’



**Notes**:

The value of appId is a string value

- - -
### appDisplayName
**Supported operators**: eq

**Example**:

    $filter=appDisplayName+eq+'Azure+Portal' 


**Notes**:

The value of appDisplayName is a string value

- - -
### loginStatus
**Supported operators**: eq

**Example**:

    $filter=loginStatus+eq+'1'  


**Notes**:

There are two options for the loginStatus: 0 - success, 1 - failure

- - -
## Next steps
* Do you want to see examples for filtered sign-in activities? Check out the [Azure Active Directory sign-in activity report API samples](active-directory-reporting-api-sign-in-activity-samples.md).
* Do you want to know more about the Azure AD reporting API? See [Getting started with the Azure Active Directory Reporting API](active-directory-reporting-api-getting-started.md).

