### Update the application code

You need to configure your application code to look for the specific managed identity you created when it's deployed to Azure. In some scenarios, explicitly setting the managed identity for the app also prevents other environment identities from accidentally being detected and used automatically.

1. On the managed identity overview page, copy the client ID value to your clipboard.
1. Update the `DefaultAzureCredential` object to specify this managed identity client ID:

    ## [.NET](#tab/dotnet)
    
    ```csharp
    // TODO: Update the <managed-identity-client-id> placeholder.
    var credential = new DefaultAzureCredential(
        new DefaultAzureCredentialOptions
        {
            ManagedIdentityClientId = "<managed-identity-client-id>"
        });
    ```

    ## [Java](#tab/java)
    
    ```java
    // TODO: Update the <managed-identity-client-id> placeholder.
    DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
        .managedIdentityClientId("<managed-identity-client-id>")
        .build();
    ```
    
    ## [Node.js](#tab/nodejs)
    
    ```nodejs
    // TODO: Update the <managed-identity-client-id> placeholder.
    const credential = new DefaultAzureCredential({
      managedIdentityClientId: "<managed-identity-client-id>"
    });
    ```
    
    ## [Python](#tab/python)
    
    ```python
    # TODO: Update the <managed-identity-client-id> placeholder.
    credential = DefaultAzureCredential(
        managed_identity_client_id = "<managed-identity-client-id>"
    )
    ```

    ---

1. Redeploy your code to Azure after making this change in order for the configuration updates to be applied.