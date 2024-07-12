### Update the application code

You need to configure your application code to look for the specific managed identity you created when it's deployed to Azure. In some scenarios, explicitly setting the managed identity for the app also prevents other environment identities from accidentally being detected and used automatically.

1. On the managed identity overview page, copy the client ID value to your clipboard.
1. Apply the following language-specific changes:

    ## [.NET](#tab/dotnet)
    
    Create a `DefaultAzureCredentialOptions` object and pass it to `DefaultAzureCredential`. Set the [ManagedIdentityClientId](/dotnet/api/azure.identity.defaultazurecredentialoptions.managedidentityclientid?view=azure-dotnet&preserve-view=true) property to the client ID.

    ```csharp
    DefaultAzureCredential credential = new(
        new DefaultAzureCredentialOptions
        {
            ManagedIdentityClientId = managedIdentityClientId
        });
    ```

    ## [Go](#tab/go)

    Set the `AZURE_CLIENT_ID` environment variable to the managed identity client ID. `DefaultAzureCredential` reads this environment variable.

    ## [Java](#tab/java)
    
    Call the [managedIdentityClientId](/java/api/com.azure.identity.defaultazurecredentialbuilder?view=azure-java-stable&preserve-view=true#com-azure-identity-defaultazurecredentialbuilder-managedidentityclientid(java-lang-string)) method. Pass the client ID to it.

    ```java
    DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
        .managedIdentityClientId(managedIdentityClientId)
        .build();
    ```
    
    ## [Node.js](#tab/nodejs)
    
    Create a `DefaultAzureCredentialClientIdOptions` object with its [managedIdentityClientId](/javascript/api/@azure/identity/defaultazurecredentialclientidoptions?view=azure-node-latest&preserve-view=true#@azure-identity-defaultazurecredentialclientidoptions-managedidentityclientid) property set to the client ID. Pass that object to the `DefaultAzureCredential` constructor.

    ```nodejs
    const credential = new DefaultAzureCredential({
      managedIdentityClientId
    });
    ```
    
    ## [Python](#tab/python)
    
    Set the `DefaultAzureCredential` constructor's [managed_identity_client_id](/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python&preserve-view=true#parameters) parameter to the client ID.

    ```python
    credential = DefaultAzureCredential(
        managed_identity_client_id = managed_identity_client_id
    )
    ```

    ---

1. Redeploy your code to Azure after making this change in order for the configuration updates to be applied.