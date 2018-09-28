---
 title: include file
 description: include file
 services: active-directory
 author: curtand
 ms.service: active-directory
 ms.topic: include
 ms.date: 07/30/2018
 ms.author: curtand
 ms.custom: include file
---
Here are the usage constraints and other service limits for the Azure Active Directory (Azure AD) service.

| Category | Limits |
| --- | --- |
| Directories | A single user can belong to a maximum of 500 Azure AD directories as a member or a guest.<br/>A single user can create a maximum of 20 directories. |
| Domains | You can add no more than 900 managed domain names. If you're setting up all of your domains for federation with on-premises Active Directory, you can add no more than 450 domain names in each directory. |
| Objects |<ul><li>A maximum of 500,000 objects can be created in a single directory by users of the Free edition of Azure Active Directory.</li><li>A non-admin user can create no more than 250 objects.</li></ul> |
| Schema extensions |<ul><li>String type extensions can have maximum of 256 characters. </li><li>Binary type extensions are limited to 256 bytes.</li><li>100 extension values (across ALL types and ALL applications) can be written to any single object.</li><li>Only “User”, “Group”, “TenantDetail”, “Device”, “Application” and “ServicePrincipal” entities can be extended with “String” type or “Binary” type single-valued attributes.</li><li>Schema extensions are available only in Graph API-version 1.21-preview. The application must be granted write access to register an extension.</li></ul> |
| Applications |A maximum of 100 users can be owners of a single application. |
| Groups |<ul><li>A maximum of 100 users can be owners of a single group.</li><li>Any number of objects can be members of a single group in Azure Active Directory.</li><li>The number of members in a group you can synchronize from your on-premises Active Directory to Azure Active Directory using Azure AD Connect is limited to 50 K members.</li></ul> |
| Access Panel |<ul><li>There is no limit to the number of applications that can be seen in the Access Panel per end user, for users assigned licenses for Azure AD Premium or the Enterprise Mobility Suite.</li><li>A maximum of 10 app tiles (examples: Box, Salesforce, or Dropbox) can be seen in the Access Panel for each end user for users assigned licenses for Free or Azure AD Basic editions of Azure Active Directory. This limit does not apply to Administrator accounts.</li></ul> |
| Reports | A maximum of 1,000 rows can be viewed or downloaded in any report. Any additional data is truncated. |
| Administrative units | An object can be a member of no more than 30 administrative units. |
