
### Identities

- You need to recreate any system assigned managed identities along with your app in the new target region. Typically, an automatically created Microsoft Entra ID app, used by EasyAuth, defaults to the app resource name.

- User-assigned managed identities also can't be moved across regions. To keep user-assigned managed identities in the same resource group with your app, you must recreate them in the new region. For more information, see [Relocate managed identities for Azure resources to another region](relocation-managed-identity.md).

- Grant the managed identities the same permissions in your relocated services as the original identities that they're replacing, including Group memberships. 
