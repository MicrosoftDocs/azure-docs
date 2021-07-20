----
----
# Troubleshooting

This article will tell you how to solve commonly encountered issues in the migration module.

## I can't access the tenant

Check that the admin account has required permissions.

Check you can perform a Get-RdsTenant on the tenant.

Additionally, use Set-RdsMigrationContext cmdlet to set the RDS Context and Adal Context to be used for migration         

- Create the RDS Context by running the Add-RdsAccount cmdlet         

- The RDS Context is stored in the global variable \$rdMgmtContext         

- The Adal Context is stored in the global variable \$AdalContext

```powershell
​Set-RdsMigrationContext -RdsContext <rdscontext> -AdalContext <adalcontext>
```