---
title: Azure Service Fabric - Using Service Fabric application KeyVault references 
description: This article explains how to use service-fabric KeyVaultReference support for application secrets.

ms.topic: article
ms.date: 09/20/2019
---

# KeyVaultReference support for Azure-deployed Service Fabric Applications

A common challenge when building cloud applications is how to securely distribute secrets to your applications. For example, you might want to deploy a database key to your application without exposing the key during the pipeline or to the operator. Service Fabric KeyVaultReference support makes it easy to deploy secrets to your applications simply by referencing the URL of the secret that is stored in Key Vault. Service Fabric will handle fetching that secret on behalf of your application's Managed Identity, and activating the application with the secret.

> [!NOTE]
> KeyVaultReference support for Service Fabric Applications is GA (out-of-preview) starting with Service Fabric version 7.2 CU5. It is recommended that you upgrade to this version before using this feature.

> [!NOTE]
> KeyVaultReference support for Service Fabric Applications supports only [versioned](../key-vault/general/about-keys-secrets-certificates.md#objects-identifiers-and-versioning) secrets. Versionless secrets are not supported. The Key Vault needs to be in the same subscription as your service fabric cluster. 

## Prerequisites

- Managed Identity for Service Fabric Applications

    Service Fabric KeyVaultReference support uses an application's Managed Identity to fetch secrets on behalf of the application, so your application must be deployed via 
    and assigned a managed identity. Follow this [document](concepts-managed-identity.md) to enable managed identity for your application.

- Central Secrets Store (CSS).

    Central Secrets Store (CSS) is Service Fabric's encrypted local secrets cache. This feature uses CSS to protect and persist secrets after they are fetched from Key Vault. Enabling this optional system service is also required to consume this feature. Follow this [document](service-fabric-application-secret-store.md) to enable and configure CSS.

- Grant application's managed identity access permission to the keyvault

    Reference this [document](how-to-grant-access-other-resources.md) to see how to grant managed identity access to keyvault. Also note if you are using system assigned managed identity, the managed identity is created only after application deployment. This can create race conditions where the application tries to access the secret before the identity can be given access to the vault. The system assigned identity's name will be `{cluster name}/{application name}/{service name}`.
    
## Use KeyVaultReferences in your application
KeyVaultReferences can be consumed in a number of ways
- [As an environment variable](#as-an-environment-variable)
- [Mounted as a file into your container](#mounted-as-a-file-into-your-container)
- [As a reference to a container repository password](#as-a-reference-to-a-container-repository-password)

### As an environment variable

```xml
<EnvironmentVariables>
      <EnvironmentVariable Name="MySecret" Type="KeyVaultReference" Value="<KeyVaultURL>"/>
</EnvironmentVariables>
```

```C#
string secret =  Environment.GetEnvironmentVariable("MySecret");
```

### Mounted as a file into your container

- Add a section to settings.xml

    Define `MySecret` parameter with Type `KeyVaultReference` and Value `<KeyVaultURL>`

    ```xml
    <Section Name="MySecrets">
        <Parameter Name="MySecret" Type="KeyVaultReference" Value="<KeyVaultURL>"/>
    </Section>
    ```

- Reference the new section in ApplicationManifest.xml in `<ConfigPackagePolicies>`

    ```xml
    <ServiceManifestImport>
        <Policies>
        <IdentityBindingPolicy ServiceIdentityRef="MyServiceMI" ApplicationIdentityRef="MyApplicationMI" />
        <ConfigPackagePolicies CodePackageRef="Code">
            <!--Linux container example-->
            <ConfigPackage Name="Config" SectionName="MySecrets" EnvironmentVariableName="SecretPath" MountPoint="/var/secrets"/>
            <!--Windows container example-->
            <!-- <ConfigPackage Name="Config" SectionName="dbsecrets" EnvironmentVariableName="SecretPath" MountPoint="C:\secrets"/> -->
        </ConfigPackagePolicies>
        </Policies>
    </ServiceManifestImport>
    ```

- Consume the secrets from service code

    Each parameter listed under `<Section  Name=MySecrets>` will be a file under the folder pointed to by EnvironmentVariable SecretPath. The below C# code snippet shows how to read MySecret from your application.

    ```C#
    string secretPath = Environment.GetEnvironmentVariable("SecretPath");
    using (StreamReader sr = new StreamReader(Path.Combine(secretPath, "MySecret"))) 
    {
        string secret =  sr.ReadToEnd();
    }
    ```
    > [!NOTE] 
    > MountPoint controls the folder where the files containing secret values will be mounted.

### As a reference to a container repository password

```xml
 <Policies>
      <ContainerHostPolicies CodePackageRef="Code">
        <RepositoryCredentials AccountName="MyACRUser" Type="KeyVaultReference" Password="<KeyVaultURL>"/>
      </ContainerHostPolicies>
```

## Next steps

* [Azure KeyVault Documentation](../key-vault/index.yml)
* [Learn about Central Secret Store](service-fabric-application-secret-store.md)
* [Learn about Managed identity for Service Fabric Applications](concepts-managed-identity.md)
