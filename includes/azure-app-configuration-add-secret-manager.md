## Add Secret Manager

A tool called Secret Manager stores sensitive data for development work outside of your project tree. This approach helps prevent the accidental sharing of app secrets within source code. Complete the following steps to enable the use of Secret Manager in the ASP.NET Core project:

Navigate to the project's root directory, and run the following command to enable secrets storage in the project:

```dotnetcli
dotnet user-secrets init
```

A `UserSecretsId` element containing a GUID will be added to the *.csproj* file.

> [!TIP]
> To learn more about Secret Manager, see [Safe storage of app secrets in development in ASP.NET Core](/aspnet/core/security/app-secrets).
