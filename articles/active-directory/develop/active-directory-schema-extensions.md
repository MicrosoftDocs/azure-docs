# Using Directory Schema Extension Attributes in claims

This topic addresses how to use Directory Schema Extension Attributes for sending user data to applications in token claims.

Directory Schema Extension Attributes provide a way to store additional data in Azure Active Directory on user objects and other directory objects such as groups, tenant details, service principals.  Only extension attributes on user objects can be used for emitting claims to applications.

>[!NOTE] Microsoft Graph provides two other extension mechanisms to customize Graph objects.  These are known as Microsoft Graph Open Extensions and Microsoft Graph Schema extensions. See the [Microsoft Graph documentation](/graph/extensibility-overview) for details.  Data stored on Microsoft Graph objects using these capabilities are not available as sources for claims in tokens.

Directory Schema Extension Attributes are always associated with an application in the tenant and are referenced by the application's applicationId in their name.

The identifier for a Directory Schema Extension Attribute is of the form *Extension_xxxxxxxxx_AttributeName*.  Where *xxxxxxxxx* is the applicationId of the application the extension was defined for.

## Registering and using Directory Schema Extensions
Directory Schema Extension Attributes can be registered and populated in one of two ways:
1. By configuring AD Connect to create them and to sync data into them from on premises AD.  See [Azure AD Connect Sync Directory Extensions](/azure/active-directory/hybrid/how-to-connect-sync-feature-directory-extensions).
2. Using Microsoft Graph to register, set the values of, and read from Directory Schema Extension Attributes [Directory schema extensions | Graph API concepts](/previous-versions/azure/ad/graph/howto/azure-ad-graph-api-directory-schema-extensions) and/or PowerShell+ [Managing extension attributes with AzureAD PowerShell cmdlets](/powershell/azure/active-directory/using-extension-attributes-sample?view=azureadps-2.0)

### Emitting claims with data from Directory Schema Extension Attributes created with AD Connect
Directory Schema Extension Attributes created and synced using AD Connect are always associated with the application Id used by AD Connect. They can be used as a source for claims both by configuring them as claims in the Enterprise Applications configuration in the Portal UI for SAML applications registered using the Gallery or the non-Gallery application configuration experience under Enterprise Applications, and via a claims mapping policy for applications registered via the Application registration experience.  Once a directory extension attribute created via AD Connect is in the directory, it will show in the SAML SSO claims configuration UI.

[Add Screenshot of attribute list with extension attributes]

### Emitting claims with data from Directory Schema Extension Attributes created for an application using Graph or PowerShell
If a Directory Schema Extension Attribute is registered for an application using Microsoft Graph or PowerShell (via an applications initial setup or provisioning step for instance), the same application can be configured in Azure Active Directory to receive data in that attribute from a user object in a claim when the user signs in.  The application can be configured to receive data in Directory Schema Extensions that are registered on that same application using [Optional claims](https://docs.microsoft.com/azure/active-directory/develop/active-directory-optional-claims#configuring-directory-extension-optional-claims).  These can be set in the Application Manifest.  This enables a multi-tenant application to register Directory Schema Extension Attributes for it's own use. When the application is provisioned into a tenant the associated directory schema extensions become available to be set on users in that tenant, and to be consumed.  Once it's configured in the tenant and consent granted, it can be used to store and retrieve data via graph and to map to claims in tokes Azure AD emits to applications.

Directory Schema Extension Attributes can be registered and populated for any application

If an application needs to send claims with data from and extension attribute registered on a different application, a [claims mapping policy](active-directory-claims-mapping.md) must be used to map the extension attribute to the claim.  A common pattern for managing Directory Schema Extension Attributes is to create an application specifically to be the point of registration for all the schema extensions you need.  It doesn't have to be a real application and this technique means that all the extensions have the same application id in their name.

For example, here is a claims mapping policy to emit a single claim from a Directory Schema Extension Attribute in an OAuth/OIDC token: 

```json
{
    "ClaimsMappingPolicy": {
        "Version": 1,
        "IncludeBasicClaimSet": "false",
        "ClaimsSchema": [{
                "Source": "User",
                "ExtensionID": "extension_xxxxxxx_test",
                "JWTClaimType": "http://schemas.contoso.com/identity/claims/exampleclaim"
            }, 
        ]
    }
}
```

Where xxxxxxx is the application ID the extension was registered with.

>[!TIP]  Case consistency is important when setting Directory Extension Attributes on objects.  Extension attribute names aren't cases sensitive when being set up, but they are case sensitive when being read from the directory by the token service.  If an extension attribute is set on a user object with the name "LegacyId" and on another user object with the name "legacyid", when the attribute is mapped to a claim using the name "LegacyId" the data will be successfully retrieved and the claim included in the token for the first user but not the second.

The "Id" parameter in the claims schema used for built in directory attributes is "ExtensionID" for directory extension attributes.