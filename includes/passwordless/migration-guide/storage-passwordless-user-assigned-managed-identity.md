### Update the application code

You need to configure your application code to look for the specific managed identity you created when it's deployed to Azure. In some scenarios, explicitly setting the managed identity for the app also prevents other environment identities from accidentally being detected and used automatically.

1. On the managed identity overview page, copy the client ID value to your clipboard.
1. Update the `DefaultAzureCredential` object to specify this managed identity client ID:

    ## [.NET](#tab/dotnet)
    
    ```csharp
    var credential = new DefaultAzureCredential(
        new DefaultAzureCredentialOptions
        {
            ManagedIdentityClientId = managedIdentityClientId
        });
    ```

    ## [Java](#tab/java)
    
    ```java
    DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
        .managedIdentityClientId(managedIdentityClientId)
        .build();
    ```
    
    ## [Node.js](#tab/nodejs)
    
    ```nodejs
    const credential = new DefaultAzureCredential({
      managedIdentityClientId: managedIdentityClientId
    });
    ```
    
    ## [Python](#tab/python)
    
    ```python
    credential = DefaultAzureCredential(
        managed_identity_client_id = managed_identity_client_id
    )
    ```

    ---

1. Redeploy your code to Azure after making this change in order for the configuration updates to be applied.