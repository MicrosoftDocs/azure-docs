Here are the usage constraints and other service limits for the Azure Active Directory service.

| Category | limits | Conditions |
|---|---|---|
| Directories | A single user can only be associated with a maximum of 20 Azure Active Directory directories | Any one of the following: <br /><br />- If a single user creates 20 directories.<br /><br />- If a single user is added to 20 directories as a member.<br /><br />- If a single user creates 10 directories and later is added by others to 10 different directories. |
|  Objects | No limits | Only for users assigned licenses for Azure Active Directory Premium or Azure Active Directory Basic, Enterprise Mobility Suite, Office 365, Microsoft Intune, or any other Microsoft online service that relies on Azure Active Directory for directory services.
| Objects | A maximum of 500,000 objects can be used in a single directory | Only for users of the Free edition of Azure Active Directory. |
| Objects | A non-admin user can create no more than 250 objects. |  <br /><br /> |
| Objects | The number of objects you can synchronize from your on-premises Active Directory to Azure Active Directory is limited to 15K users.  | Using Azure Active Directory Directory Synchronization (DirSync). |
| Objects | The number of objects you can synchronize from your on-premises Active Directory to Azure Active Directory is limited to 50K users.  | Using Azure AD Connect. |
| Schema extensions | String type extensions can have maximum of 256 characters.<br /><br />Binary type extensions are limited to 256 bytes.<br /><br />100 extension values (across ALL types and ALL applications) can be written to any single object. | Only “User”, “Group”, “TenantDetail”, “Device”, “Application” and “ServicePrincipal” entities can be extended with “String” type or “Binary” type single-valued attributes.<br /><br />Schema extensions are available only in Graph API-version 1.21-preview. The application must be granted write access to register an extension. |
| Applications | A maximum of 10 users can be owners of a single application | <br /><br /> |
| Groups | A maximum of 10 users can be owners of a single group.<br /><br />Any number of objects can be members of a single group in Azure Active Directory. | <br /><br /> |
| Access Panel | There is no limit to the number of applications that can be seen in the Access Panel per end user |  Only for users assigned licenses for Azure AD Premium or the Enterprise Mobility Suite. |
| Access Panel |A maximum of 10 app tiles (examples: Box, Salesforce, or Dropbox) can be seen in the Access Panel for each end user | Only for users assigned licenses for Free or Azure AD Basic editions of Azure Active Directory. This limit does not apply to Administrator accounts. |
| Reports | A maximum of 1,000 rows can be viewed or downloaded in any report. Any additional data is truncated. | <br /><br /> |
