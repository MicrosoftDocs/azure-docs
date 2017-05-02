> [!NOTE]
> We plan to improve this experience and deprecate the following steps.

### Add Signing and Encryption keys to your B2C Tenant for use by Custom Policies

1. Navigate to the Identity Experience Framework blade in you Azure AD B2C tenant settings.
1. Select `Policy Keys` and confirm that a key named `b2c_1a_TokenSigningKeyContainer` does *not* exist. If present, skip to confirm Encryption key.
1. Create `TokenSigningKeyContainer`.  The prefix B2C_1a_ may be added automatically
 * Click on `+Add`
 * Options > `Generate`
 * Name >`TokenSigningKeyContainer`
 * Key type > `RSA`
 * Dates - leave defaults
 * Key usage > `Signature`
1. Click `Create` and confirm creation, note name
1. Confirm that a key named `b2c_1a_TokenEncryptionKeyContainer` does *not* exist. If present, skip to FacebookSecret.
1. Create `TokenEncryptionKeyContainer`.  The prefix b2c_1a_ may be added automatically
 * Options > `Generate`
 * Name >`TokenSigningKeyContainer`
 * Key type > `RSA`
 * Dates - leave defaults
 * Key usage > `Encryption`
1. Click `Create` and confirm creation, note name
1. Create `b2c_1a_FacebookSecret`.  While optional, this step is recommended to readily test your ability to federate externally.  This creates a solid starting point to further develop your policies with other Id Providers
 * Click on `+Add`
 * Options > `Manual`
 * Name > `FacebookSecret`
 * Secret > Enter your FacebookSecret from developers.facebook.com.  *This is not your Facebook App ID*
 * Key usage > Signature
1. Click `Create` and confirm creation, note name
*NOTE: If you are using Azure AD B2C built-in policies, you will typically use the same FacebookSecret for both built-in and custom policies.  The choice is yours.
