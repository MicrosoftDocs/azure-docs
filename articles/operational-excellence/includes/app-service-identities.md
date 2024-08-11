
### Identities

- **Recreate App Service Managed Service Identities** in the new target region. 

- **Assign the new MSI credential downstream service access (RBAC)**. Typically, an automatically created Microsoft Entra ID App (one used by EasyAuth) defaults to the App resource name. Consideration may be required here for recreating a new resource in the target region. A user-defined Service Principal would be useful - as it can be applied to both source and target with extra access permissions to target deployment resources.
