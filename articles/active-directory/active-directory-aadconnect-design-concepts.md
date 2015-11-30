<properties
   pageTitle="Azure AD Connect design concepts | Microsoft Azure"
   description="This topic details certain implementation design areas"
   services="active-directory"
   documentationCenter=""
   authors="AndKjell"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="Identity"
   ms.date="10/13/2015"
   ms.author="andkjell"/>

# Design concepts for Azure AD Connect
The purpose of this topic is to describe areas which must be thought through during the implementation design of Azure AD Connect. This is a deep dive on certain areas and these concept are briefly described in other topics as well.

## sourceAnchor
The sourceAnchor attribute is defined as *an attribute immutable during the lifetime of an object*. It uniquely identifies an object as being the same object on-premises and in Azure AD. The attribute is also called **immutableId** and the two names are used interchangeable.

The word immutable, i.e. cannot be changed, is important to this topic. Since this attribute’s value cannot be changed after it has been set it is important to pick a design which will support your scenario.

The attribute is used for the following scenarios:

- When a new sync engine server is built, or rebuilt after a disaster recovery scenario, this attribute will link existing objects in Azure AD with objects on-premises.
- If you move from a cloud-only identity to a synchronized identity model this attribute will allow objects to “hard match” existing objects in Azure AD with on-premises objects.
- If you use federation, this attribute together with the **userPrincipalName** is used in the claim to uniquely identify a user.

This topic will only talk about sourceAnchor as it relates to users. The same rules apply to all object types, but it is only for users this usually is a concern.

### Selecting a good sourceAnchor attribute
The attribute value must follow the following rules:

- Be less than 60 characters in length
- Not contain a special character: &#92; ! # $ % & * + / = ? ^ &#96; { } | ~ < > ( ) ' ; : , [ ] " @ _
- Must be globally unique
- Must be either a string, integer or binary
- Should not be based on user's name, these change
- Should not be case sensitive and avoid values that may vary by case
- Should be assigned when the object is created.


If the selected sourceAnchor is not of type string, Azure AD Connect will Base64Encode the attribute value to ensure no special characters will appear. If you use another federation server than ADFS, make sure your server also has the capability to Base64Encode the attribute.

The sourceAnchor attribute is case sensitive. A value of “JohnDoe” is not the same as “johndoe”.

If you have a single forest on-premises then the attribute you should use is **objectGUID**. This is also the attribute used when you use express settings in Azure AD Connect and also the attribute used by DirSync.

If you have multiple forests and do not move users between forests and between domains in the same forest, then **objectGUID** is a good attribute to use even in this case.

If you move users between forests and domains, then you must find an attribute which will not change or can be moved with the users during the move. A recommended approach is to introduce a synthetic attribute. An attribute which could hold something which looks like a GUID would be suitable. During object creation a new GUID is created and stamped on the user. A custom rule can be created in the sync engine server to create this value based on the **objectGUID** and update the selected attribute in ADDS. When you move the object, make sure to also copy the content of this value.

Another solution is to pick an existing attribute you know will not change. Commonly used attributes include **employeeID**. If you consider an attribute which will contain letters, make sure there is no chance the case (upper case vs. lower case) can change for the attribute's value. Bad attributes which should not be used include those with the name of the user. In a marriage or divorce the name is expected to change, which is not allowed for this attribute. This is also one reason why attributes such as **userPrincipalName**, **mail**, and **targetAddress** are not even possible to select in the Azure AD Connect installation wizard. Those attributes will also contain the @-character, which is not allowed in the sourceAnchor.


### Changing the sourceAnchor attribute
The sourceAnchor attribute value cannot be changed after the object has been created in Azure AD and the identity is synchronized.

For this reason, the following restrictions apply to Azure AD Connect:

- The sourceAnchor attribute can only be set during initial installation. If you re-run the installation wizard this option is read-only. If you need to change this, then you must uninstall and reinstall.
- If you install another Azure AD Connect server, then you must select the same sourceAnchor attribute as previously used. If you have earlier been using DirSync and move to Azure AD Connect, then you must use **objectGUID** since that is the attribute used by DirSync.
- If the value for sourceAnchor is changed after the object has been exported to Azure AD, then Azure AD Connect sync will throw an error and will not allow any more changes on that object before the issue has been fixed and the sourceAnchor is changed back in the source directory.

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).
