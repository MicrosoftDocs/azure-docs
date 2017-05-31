
### Add Signing and Encryption keys to your B2C Tenant for use by Custom Policies

1. Navigate to the Identity Experience Framework blade in you Azure AD B2C tenant settings.
1. Select `Policy Keys` to view the keys available in your tenant. If `B2C_1A_TokenSigningKeyContainer` exists, skip this key.
1. Create `TokenSigningKeyContainer`  
 * Click on `+Add`
 * Options > `Generate`
 * Name >`TokenSigningKeyContainer` The prefix B2C_1A_ may be added automatically.
 * Key type > `RSA`
 * Dates - use defaults
 * Key usage > `Signature`
1. Click `Create`
1. If a key named `B2C_1A_TokenEncryptionKeyContainer` exists, skip this key.
1. Create `TokenEncryptionKeyContainer`.
 * Options > `Generate`
 * Name >`TokenSigningKeyContainer` The prefix B2C_1A_ may be added automatically.
 * Key type > `RSA`
 * Dates - use defaults
 * Key usage > `Encryption`
1. Click `Create`


[!TIP]
The next steps are OPTIONAL if you wish to offer social identity providers or federated identity providers to your end users.  Facebook provides a good starting point to learn about external identity providers with Azure AD B2C using custom policies.

1. Create `FacebookSecret`.  While optional, this step is recommended to readily test your ability to federate externally.  This creates a solid starting point to further develop your policies with other Id Providers
 * Click on `+Add`
 * Options > `Manual`
 * Name > `FacebookSecret` The prefix B2C_1A_ may be added automatically.
 * Secret > Enter your FacebookSecret from developers.facebook.com.  *This is not your Facebook App ID*
 * Key usage > Signature
1. Click `Create` and confirm creation, note name

[!NOTE]
If you are using Azure AD B2C built-in policies, you will typically use the same secret for both built-in and custom policies. 
