<properties
    pageTitle="Azure Active Directory audit API reference | Microsoft Azure"
    description="How to get started with the Azure Active Directory audit API"
    services="active-directory"
    documentationCenter=""
    authors="dhanyahk"
    manager="femila"
    editor=""/>

<tags
    ms.service="active-directory"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="identity"
    ms.date="09/25/2016"
    ms.author="dhanyahk;markvi"/>

# Azure Active Directory audit API reference

This topic is part of a collection of topics about the Azure Active Directory reporting API.  
Azure AD reporting provides you with an API that enables you to access audit data using code or related tools.
The scope of this topic is to provide you with reference information about the **audit API**.

See:

- [Audit logs](active-directory-reporting-azure-portal.md#audit-logs)  for more conceptual information
- [Getting started with the Azure Active Directory Reporting API](active-directory-reporting-api-getting-started.md) for more information about the reporting API.

For questions, issues or feedback, please contact [AAD Reporting Help](mailto:aadreportinghelp@microsoft.com).


## Who can access the data?

- Users in the Security Admin or Security Reader role

- Global Admins

- Any app that has authorization to access the API (app authorization can be setup only based on Global Admin’s permission)



## Prerequisites

In order to access this report through the Reporting API, you must have:

- An [Azure Active Directory Free or better edition](active-directory-editions.md)

- Completed the [prerequisites to access the Azure AD reporting API](active-directory-reporting-api-prerequisites.md). 
 

##Accessing the API

You can either access this API through the [Graph Explorer](https://graphexplorer2.cloudapp.net) or programmatically using, for example, PowerShell. In order for PowerShell to correctly interpret the OData filter syntax used in AAD Graph REST calls, you must use the backtick (aka: grave accent) character to “escape” the $ character. The backtick character serves as [PowerShell’s escape character](https://technet.microsoft.com/library/hh847755.aspx), allowing PowerShell to do a literal interpretation of the $ character, and avoid confusing it as a PowerShell variable name (ie: $filter).

The focus of this topic is on the Graph Explorer. For a PowerShell example, see this [PowerShell script](active-directory-reporting-api-audit-samples.md#powershell-script).

 
 

## API Endpoint


You can access this API using the following URI:  

	https://graph.windows.net/contoso.com/activities/audit?api-version=beta

There is no limit on the number of records returned by the Azure AD audit API (using OData pagination).
For retention limits on reporting data, check out [Reporting Retention Policies](active-directory-reporting-retention.md).

This call returns the data in batches. Each batch has a maximum of 1000 records.  
To get the next batch of records, use the Next link. Get the skiptoken information from the first set of returned records. The skip token will be at the end of the result set.  

	https://graph.windows.net/contoso.com/activities/audit?api-version=beta&%24skiptoken=-1339686058




## Supported filters

You can narrow down the number of records that are returned by an API call in form of a filter.  
For sign-in API related data, the following filters are supported:

- **$top=\<number of records to be returned\>** - to limit the number of returned records. This is an expensive operation. You should not use this filter if you want to return thousands of objects.     
- **$filter=\<your filter statement\>** - to specify, on the basis of supported filter fields, the type of records you care about



## Supported filter fields and operators

To specify the type of records you care about, you can build a filter statement that can contain either one or a combination of the following filter fields:

- [activityDate](#activitydate)  - defines a date or date range
- [activityType](#activitytype)  - defines the type of an activity
- [activity](#activity) - defines the activity as string  
- [actor/name](#actorname) -   defines the actor in form of the actor's name
- [actor/objectid](#actorobjectid) - defines the actor in form of the actor's ID   
- [actor/upn](#actorupn)  - defines the actor in form of the actor's user principle name (UPN) 
- [target/name](#targetname)  - defines the target in form of the actor's name
- [target/objectid](#targetobjectid) - defines the target in form of the target's ID  
- [target/upn](#targetupn) - defines the actor in form of the actor's user principle name (UPN)   




----------

### activityDate

**Supported operators**: eq, ge, le, gt, lt

**Example**:

	$filter=activityDate ge 2016-01-01T00:00:00Z and activityDate le 2016-01-02T00:00:00Z	

**Notes**:

datetime should be in UTC format

----------

### activityType

**Supported operators**: eq

**Example**:

	$filter=activityType eq 'User'	

**Notes**:

case-sensitive

----------

### activity

**Supported operators**: eq, contains, startsWith

**Example**:

	$filter=activity eq 'Add application' or contains(activity, 'Application') or startsWith(activity, 'Add')	

**Notes**:

case-sensitive

----------

### actor/name

**Supported operators**: eq, contains, startsWith

**Example**:

	$filter=actor/name eq 'test' or contains(actor/name, 'test') or startswith(actor/name, 'test')	

**Notes**:

case-insensitive

	

----------
### actor/objectId

**Supported operators**: eq

**Example**:

	$filter=actor/objectId eq 'e8096343-86a2-4384-b43a-ebfdb17600ba'	

----------
### target/name

**Supported operators**: eq, contains, startsWith

**Example**:

	$filter=target/name eq 'test' or contains(target/name, 'test') or startswith(target/name, 'test')	

**Notes**:

Case-insensitive

----------

### target/upn

**Supported operators**: eq, startsWith

**Example**:

	$filter=targets/any(t: startswith(t/Microsoft.ActiveDirectory.DataService.PublicApi.Model.Reporting.AuditLog.TargetResourceUserEntity/userPrincipalName,'abc'))	

**Notes**:

- Case-insensitive
- You need to add the full namespace when querying  Microsoft.ActiveDirectory.DataService.PublicApi.Model.Reporting.AuditLog.TargetResourceUserEntity

----------

### target/objectId

**Supported operators**: eq

**Example**:

	$filter=target/objectId eq 'e8096343-86a2-4384-b43a-ebfdb17600ba'	

----------

### actor/upn

**Supported operators**: eq, startsWith

**Example**:

	$filter=startswith(actor/Microsoft.ActiveDirectory.DataService.PublicApi.Model.Reporting.AuditLog.ActorUserEntity/userPrincipalName,'abc')	

**Notes**:

- Case-insensitive 
- You need to add the full namespace when querying Microsoft.ActiveDirectory.DataService.PublicApi.Model.Reporting.AuditLog.ActorUserEntity

----------




## Next Steps

- Do you want to see examples for filtered system activities? Check out the [Azure Active Directory audit API samples](active-directory-reporting-api-audit-samples.md).

- Do you want to know more about the Azure AD reporting API? See [Getting started with the Azure Active Directory Reporting API](active-directory-reporting-api-getting-started.md).