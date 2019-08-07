---
 title: include file
 description: include file
 services: active-directory
 author: curtand
 ms.service: active-directory
 ms.topic: include
 ms.date: 05/22/2019
 ms.author: curtand
 ms.custom: include file
---
Here are the usage constraints and other service limits for the Azure Active Directory (Azure AD) service.

| Category | Limits |
| --- | --- |
| Directories | A single user can belong to a maximum of 500 Azure AD directories as a member or a guest.<br/>A single user can create a maximum of 20 directories. |
| Domains | You can add no more than 900 managed domain names. If you set up all of your domains for federation with on-premises Active Directory, you can add no more than 450 domain names in each directory. |
| Objects |<ul><li>A maximum of 50,000 objects can be created in a single directory by users of the Free edition of Azure Active Directory by default. If you have at least one verified domain, the default directory service quota in Azure AD is extended to 300,000 objects. </li><li>A non-admin user can create no more than 250 objects. Both active objects and deleted objects that are available to restore count toward this quota. Only deleted objects that were deleted fewer than 30 days ago are available to restore. Deleted objects that are no longer available to restore count toward this quota at a value of one-quarter for 30 days. Perhaps [assign an administrator role](../articles/active-directory/users-groups-roles/directory-assign-admin-roles.md) to non-admin users who are likely to repeatedly exceed this quota in the course of their regular duties.</li></ul> |
| Schema extensions |<ul><li>String-type extensions can have a maximum of 256 characters. </li><li>Binary-type extensions are limited to 256 bytes.</li><li>Only 100 extension values, across *all* types and *all* applications, can be written to any single object.</li><li>Only User, Group, TenantDetail, Device, Application, and ServicePrincipal entities can be extended with string-type or binary-type single-valued attributes.</li><li>Schema extensions are available only in the Graph API version 1.21 preview. The application must be granted write access to register an extension.</li></ul> |
| Applications |A maximum of 100 users can be owners of a single application. |
| Groups |<ul><li>A maximum of 100 users can be owners of a single group.</li><li>Any number of objects can be members of a single group.</li><li>A user can be a member of any number of groups.</li><li>The number of members in a group that you can synchronize from your on-premises Active Directory to Azure Active Directory by using Azure AD Connect is limited to 50,000 members.</li></ul> |
| Application Proxy | <ul><li>A maximum of 500 transactions per second per App Proxy application</li><li>A maximum of 750 transactions per second for the tenant</li></ul><br/>A transaction is defined as a single http request and response for a unique resource. When throttled, clients will receive a 429 response (too many requests). |
| Access Panel |<ul><li>There's no limit to the number of applications that can be seen in the Access Panel per user. This applies to users assigned licenses for Azure AD Premium or the Enterprise Mobility Suite.</li><li>A maximum of 10 app tiles can be seen in the Access Panel for each user. This limit applies to users who are assigned licenses for Free or Azure AD Basic editions of Azure Active Directory. Examples of app tiles include Box, Salesforce, or Dropbox. This limit doesn't apply to administrator accounts.</li></ul> |
| Reports | A maximum of 1,000 rows can be viewed or downloaded in any report. Any additional data is truncated. |
| Administrative units | An object can be a member of no more than 30 administrative units. |
| Admin roles and permissions | <ul><li>A group cannot be added as an [owner](https://docs.microsoft.com/azure/active-directory/fundamentals/users-default-permissions?context=azure/active-directory/users-groups-roles/context/ugr-context#object-ownership).</li><li>A group cannot be assigned to a [role](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles).</li><li>Users’ ability to read other users’ directory information cannot be restricted outside of the tenant-wide switch to disable all non-admin users’ access to all directory information (not recommended). More information on default permissions [here](https://docs.microsoft.com/azure/active-directory/fundamentals/users-default-permissions?context=azure/active-directory/users-groups-roles/context/ugr-context#to-restrict-the-default-permissions-for-member-users).</li><li>It may take up to 15 minutes or signing out/signing in before admin role membership additions and revocations take effect.</li></ul> |
