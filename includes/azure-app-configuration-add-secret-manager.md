## Add Secret Manager

A tool called Secret Manager stores sensitive data for development work outside of your project tree. This approach helps prevent the accidental sharing of app secrets within source code. Complete the following steps to enable the use of Secret Manager in the ASP.NET Core project:

#### [.NET 5.x](#tab/core5x)

Navigate to the project's root directory, and run the following command to enable secrets storage in the project:

```dotnetcli
dotnet user-secrets init
```

A `UserSecretsId` element containing a GUID is added to the *.csproj* file:

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
    
    <PropertyGroup>
        <TargetFramework>net5.0</TargetFramework>
        <UserSecretsId>79a3edd0-2092-40a2-a04d-dcb46d5ca9ed</UserSecretsId>
    </PropertyGroup>

</Project>
```

#### [.NET Core 3.x](#tab/core3x)

Navigate to the project's root directory, and run the following command to enable secrets storage in the project:

```dotnetcli
dotnet user-secrets init
```

A `UserSecretsId` element containing a GUID is added to the *.csproj* file:

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
    
    <PropertyGroup>
        <TargetFramework>netcoreapp3.1</TargetFramework>
        <UserSecretsId>79a3edd0-2092-40a2-a04d-dcb46d5ca9ed</UserSecretsId>
    </PropertyGroup>

</Project>
```

#### [.NET Core 2.x](#tab/core2x)

1. Open the *.csproj* file.

1. Add a `UserSecretsId` element to the *.csproj* file as shown here. You can use the same GUID, or you can replace this value with your own.

    ```xml
    <Project Sdk="Microsoft.NET.Sdk.Web">
    
        <PropertyGroup>
            <TargetFramework>netcoreapp2.1</TargetFramework>
            <UserSecretsId>79a3edd0-2092-40a2-a04d-dcb46d5ca9ed</UserSecretsId>
        </PropertyGroup>
    
        <ItemGroup>
            <PackageReference Include="Microsoft.AspNetCore.App" />
            <PackageReference Include="Microsoft.AspNetCore.Razor.Design" Version="2.1.2" PrivateAssets="All" />
        </ItemGroup>
    
    </Project>
    ```
    
1. Save the *.csproj* file.

---

> [!TIP]
> To learn more about Secret Manager, see [Safe storage of app secrets in development in ASP.NET Core](/aspnet/core/security/app-secrets).
