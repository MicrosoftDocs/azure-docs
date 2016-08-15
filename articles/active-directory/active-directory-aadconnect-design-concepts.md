<properties
   pageTitle="Azure AD Connect: Design concepts | Microsoft Azure"
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
   ms.date="06/27/2016"
   ms.author="andkjell"/>

# Azure AD Connect: Design concepts
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
    - Characters not being a-z, A-Z, or 0-9 will be encoded and counted as 3 characters
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

## Azure AD sign-in

While integrating your on-premises directory with Azure AD, it is important to understand how the synchronization settings can affect the way user authenticates. Azure AD uses userPrincipalName or UPN to authenticate the user. However, when you synchronize your users you must choose the attribute to be used for value of userPrincipalName carefully.

### Choosing the attribute for userPrincipalName

When you are selecting the attribute for providing the value of UPN to be used in Azure one should ensure

* The attribute values conform to the UPN syntax (RFC 822), i.e. it should be of the format username@domain.
* The suffix in the values matches to one of the verified custom domains in Azure AD

In express settings, the assumed choice for the attribute is userPrincipalName. However, if you believe that userprincipalname attribute does not contain the value that you would want your users to use for logging in to Azure, then you must choose **Custom Installation** and provide appropriate attribute.

### Custom domain state and UPN
It is important to ensure that there is a verified domain for the UPN suffix.

John is a user in contoso.com. You want John to use the on-premises UPN john@contoso.com for logging in to Azure after you have synced users to your Azure AD directory azurecontoso.onmicrosoft.com. In order to do so, you will need to add and verify contoso.com as a custom domain in Azure AD before you can start syncing the users. If the UPN suffix of John, i.e. contoso.com, does not match a verified domain in Azure AD, then Azure AD will replace the UPN suffix with azurecontoso.onmicrosoft.com and John will have to use john@azurecontoso.onmicrosoft.com to sign in to Azure.

### Non-routable on-premises domains and UPN for Azure AD
Some organizations have non-routable domains, like contoso.local or simple single label domains like contoso. In Azure AD you will not be able to verify a non-routable domain. Azure AD Connect can sync to only a verified domain in Azure AD. When you create an Azure AD directory, it creates a routable domain which becomes default domain for your Azure AD for example, contoso.onmicrosoft.com. Therefore, it becomes necessary to verify any other routable domain in such a scenario in case you dont want to sync to the default .onmicrosoft.com domain.

Read [Add your custom domain name to Azure Active Directory](active-directory-add-domain.md) for more info on adding and verifying domains.

Azure AD Connect detects if you are running in a non-routable domain environment and would appropriately warn you from going ahead with express settings. If you are operating in a non-routable domain, then it is likely that the UPN of the users are having non-routable suffix too. For example, if you are running under contoso.local, Azure AD Connect will suggest you to use custom settings rather than using express settings. Using custom settings, you will be able to specify the attribute that should be used as UPN for logging into Azure after the users are synced to Azure AD.
See **Selecting attribute for user principal name in Azure AD** below for more info.

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).
