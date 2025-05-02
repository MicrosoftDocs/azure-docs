---
title: Understand LDAP schemas in Azure NetApp Files
description: This article helps you understand schemas in the lightweight directory access protocol (LDAP).
services: azure-netapp-files
author: whyistheinternetbroken
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 02/18/2025
ms.author: anfdocs
---

# Understand LDAP schemas in Azure NetApp Files

[Lightweight directory access protocol (LDAP)](lightweight-directory-access-protocol.md) schemas are how LDAP servers organize and collect information. LDAP server schemas generally follow the same standards, but different LDAP server providers might have variations on how schemas are presented. 

When Azure NetApp Files queries LDAP, schemas are used to help accelerate name lookups because they enable the use of specific attributes to find information about a user, such as the UID. The schema attributes must exist in the LDAP server for Azure NetApp Files to be able to find the entry. Otherwise, LDAP queries might return no data and authentication requests might fail.

For example, if a UID number (such as root=0) must be queried by Azure NetApp Files, then the schema attribute RFC 2307 `uidNumber Attribute` is used. If no UID number `0` exists in LDAP in the `uidNumber` field, then the lookup request fails.

The schema type currently used by Azure NetApp Files is a form of schema based on RFC 2307bis and can't be modified.

[RFC 2307bis](https://tools.ietf.org/html/draft-howard-rfc2307bis-02) is an extension of RFC 2307 and adds support for `posixGroup`, which enables dynamic lookups for auxiliary groups by using the `uniqueMember` attribute, rather than by using the `memberUid` attribute in the LDAP schema. Instead of using just the name of the user, this attribute contains the full distinguished name (DN) of another object in the LDAP database. Therefore, groups can have other groups as members, which allows nesting of groups. Support for RFC 2307bis also adds support for the object class `groupOfUniqueNames`.

This RFC extension fits nicely into how Microsoft Active Directory manages users and groups through the usual management tools. This is because when you add a Windows user to a group (and if that group has a valid numeric GID) using the standard Windows management methods, LDAP lookups will pull the necessary supplemental group information from the usual Windows attribute and find the numeric GIDs automatically.

When Azure NetApp Files volumes need to perform LDAP lookups for NFS user identities, a series of attributes defined by an LDAP schema based on RFC-2307bis. The following table shows the attributes used by LDAP lookups, which are the defaults defined in Microsoft Active Directory when UNIX attributes are used. For proper functionality, ensure these attributes are properly populated on user and group accounts in LDAP.

| UNIX attribute | LDAP Schema Value | 
| - | - |
| UNIX user name | uid* |
| UNIX user numeric ID | uidNumber* |
| UNIX group name | cn* |
| UNIX group numeric ID | gidNumber* |
| UNIX group membership | member** |
| UNIX user object class | User** |
| UNIX home directory | unixHomeDirectory |
| UNIX display name | gecos |
| UNIX user password | unixUserPassword |
| UNIX login shell | LoginShell |
| Windows account used for name mapping | sAMAccountName** |
| UNIX group object class | Group** |
| UNIX member UID | memberUid*** |
| UNIX group of unique names object class| Group** |


\* Required attribute for proper LDAP functionality

\** Populated in Active Directory by default

\*** Not required

## Understand LDAP attribute indexing

Active Directory LDAP provides an [indexing method for attributes](/windows/win32/adschema/attributes-indexed) that helps speed up lookup requests. This is particularly useful in large directory environments, where an LDAP search can potentially exceed the 10-second time-out value for lookups in Azure NetApp Files. If a search exceeds its time-out value, the LDAP lookup fails, and access won't work properly because the service cannot verify the user or group identity requesting access.

By default, Microsoft Active Directory LDAP will index the following UNIX attributes used by Azure NetApp Files for LDAP lookups:

- [Common Name (CN)](/windows/win32/adschema/a-cn)
- [uidNumber](/windows/win32/adschema/a-uidnumber)
- [gidNumber](/windows/win32/adschema/a-gidnumber)

The uid attribute is not indexed by default. As a result, LDAP queries for the UID take more time than queries for indexed attributes. 

For instance, in the following test of a query in an Active Directory environment with more than 20,000 users and groups, a search for a user with the indexed attribute CN took roughly 0.015 seconds, while a search for the same user with the UID attribute (which isn’t indexed by default) took closer to 0.6 seconds—40 times slower.

In smaller environments, this doesn't cause issues. But in larger environments (or environments where the Active Directory environment is on premises or has high network latency), the difference can be drastic enough to cause access issues for users accessing Azure NetApp Files volumes. As a result, it's a best practice to configure the UID attribute in LDAP to be indexed by Active Directory.

## Configuring the UID attribute to be indexed by Active Directory

Attributes are indexed via [the `searchFlags` value](/openspecs/windows_protocols/ms-adts/7c1cdf82-1ecc-4834-827e-d26ff95fb207) for the attribute object, which is configurable via [ADSI Edit](/windows/win32/adsi/about-adsi) in the Schema naming context. Access to ADSI Edit should be approached with caution and requires at minimum [Schema Admin](/services-hub/unified/health/remediation-steps-ad/remove-all-members-from-the-schema-admins-group-unless-you-are-actively-changing-the-schema) privileges. 

:::image type="content" source="./media/lightweight-directory-access-protocol-schemas/connection-settings.png" alt-text="Screenshot of connection settings menu." lightbox="./media/lightweight-directory-access-protocol-schemas/connection-settings.png":::

By default, the uid attribute object’s `searchFlags` are set to 0x8 (PRESERVE_ON_DELETE). This default setting ensures that even if the object in Active Directory is deleted, the attribute value remains stored in the directory as a historical record of the user’s attribute.

:::image type="content" source="./media/lightweight-directory-access-protocol-schemas/search-flag-no-index.png" alt-text="Screenshot of uid properties menu." lightbox="./media/lightweight-directory-access-protocol-schemas/search-flag-no-index.png":::

In comparison, an attribute that is indexed in Active Directory for LDAP searches would have the value of 0x1 (or some combination including that value), such as the uidNumber:

:::image type="content" source="./media/lightweight-directory-access-protocol-schemas/number-properties.png" alt-text="Screenshot of UiDNumber properties menu." lightbox="./media/lightweight-directory-access-protocol-schemas/number-properties.png":::

Because of this, queries for uidNumber return faster than queries for uid. For consistency and performance, you can adjust the `searchFlags` value for uid to 9 by adding 0x1 along with the existing value of 0x8, which is (INDEX | PRESERVE_ON_DELETE). This addition maintains the default behavior while adding attribute indexing to the directory.

:::image type="content" source="./media/lightweight-directory-access-protocol-schemas/integer-attribute-editor.png" alt-text="Screenshot of integer attribute editor." lightbox="./media/lightweight-directory-access-protocol-schemas/integer-attribute-editor.png":::

:::image type="content" source="./media/lightweight-directory-access-protocol-schemas/search-flag-indexed.png" alt-text="Screenshot of uid properties menu with indexing added." lightbox="./media/lightweight-directory-access-protocol-schemas/search-flag-indexed.png":::

With indexing, searches for user attributes with uid are as fast as searches for other indexed attributes.

## Next steps

- [Understand LDAP basics](lightweight-directory-access-protocol.md)
- [Understand name mapping using LDAP](lightweight-directory-access-protocol-name-mapping.md)
- [Understand allow local NFS users with LDAP option](lightweight-directory-access-protocol-local-users.md)
