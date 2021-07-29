To start using Media Services APIs with .NET, you need to create an `AzureMediaServicesClient` object. The code for this is in the Authentication.cs file under the Common_Utils folder. To create the object, you need to supply credentials for the client to connect to Azure by using Azure Active Directory. Another option is to use interactive authentication, which is implemented in `GetCredentialsInteractiveAuthAsync`.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/Common_Utils/Authentication.cs#CreateMediaServicesClientAsync)]

In the code that you cloned at the beginning of the article, the `GetCredentialsAsync` function creates the `ServiceClientCredentials` object based on the credentials supplied in the local configuration file (*appsettings.json*) or through the *.env* environment variables file in the root of the repository.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/Common_Utils/Authentication.cs#GetCredentialsAsync)]

In the case of interactive authentication, the `GetCredentialsInteractiveAuthAsync` function creates the `ServiceClientCredentials` object based on an interactive authentication and the connection parameters supplied in the local configuration file (*appsettings.json*) or through the *.env* environment variables file in the root of the repository. In that case, AADCLIENTID and AADSECRET are not needed in the configuration or environment variables file.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/Common_Utils/Authentication.cs#GetCredentialsInteractiveAuthAsync)]
