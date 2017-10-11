---

  title: Reference for products and service plans in Azure AD | Microsoft Docs
  description: Reference for products and service plans
  services: active-directory
  keywords: Azure AD licensing service plans
  documentationcenter: ''
  author: piotrci
  manager: femila
  editor: ''

  ms.assetid:
  ms.service: active-directory
  ms.devlang: na
  ms.topic: article
  ms.tgt_pltfrm: na
  ms.workload: identity
  ms.date: 10/11/2017
  ms.author: piotrci

---

# Reference for products and service plans in Azure AD

This article provides reference information that you may find useful when working on license management for Microsoft Online Services.

## Product names and identifiers used in Azure AD

When managing licenses in [Azure](https://portal.azure.com/#blade/Microsoft_AAD_IAM/LicensesMenuBlade/Products) or Office portals you will see user friendly products names, such as *Office 365 Enterprise E3*. However when you use PowerShell v1.0 cmdlets, the same product will be identified using a less friendly name: *ENTERPRISEPACK*. When using PowerShell v2.0 or Microsoft Graph, the same product is identified using a GUID value: *6fd2c87f-b296-42f0-b197-1e91e994b900*. The same goes for service plans included in the product.

The table below lists the most commonly used Microsoft Online Services products and provides their various ID values.

| Product Name | String Id | Guid Id| Service Plans included | 

## Next steps

To learn more about the feature set for license management through groups, see the following:

* [What is group-based licensing in Azure Active Directory?](active-directory-licensing-whatis-azure-portal.md)
* [Assigning licenses to a group in Azure Active Directory](active-directory-licensing-group-assignment-azure-portal.md)
* [Identifying and resolving license problems for a group in Azure Active Directory](active-directory-licensing-group-problem-resolution-azure-portal.md)
* [How to migrate individual licensed users to group-based licensing in Azure Active Directory](active-directory-licensing-group-migration-azure-portal.md)
* [Azure Active Directory group-based licensing additional scenarios](active-directory-licensing-group-advanced.md)
