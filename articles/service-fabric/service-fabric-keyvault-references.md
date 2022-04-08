---
title: Azure Service Fabric - Using Service Fabric application KeyVault references 
description: This article explains how to use service fabric KeyVaultReference support for application secrets.

ms.topic: article
ms.date: 09/20/2019
---

# KeyVaultReference support for Azure-deployed Service Fabric Applications

A common challenge faced when building cloud applications is figuring out how to securely distribute secrets to your applications. Service Fabric KeyVaultReference support makes it easy to distribute secrets to your applications by simply referencing the URL of the secret that is stored in Key Vault in your application definition. Service Fabric will handle fetching that secret on behalf of your application's Managed Identity and activating your application with the secret. Further, with the introduction of Managed KeyVaultReference support, Service Fabric can monitor your Key Vault and automatically trigger rolling application parameter upgrades as your secrets rotate in the vault.

## Options for delivering secrets to applications in Service Fabric

The classic way of delivering secrets to a Service Fabric application was through the use of [Encrypted Parameters](service-fabric-application-secret-management.md). This involved encrypting secrets against an encryption certificate, and passing those encrypted secrets to your application. This method has a number of downsides, including needing to manage the encryption certificate, exposure of the secrets in the deployment pipeline, and a lack of visibility into the metadata of the secrets attached to a deployed application. Similarly, rotating secrets requires an application deployment. Unless you are running a standalone cluster, we no longer recommend using encrypted parameters.

Another option is the use of [Secret Store References](service-fabric-application-secret-store.md#use-the-secret-in-your-application). This experience allows for central management of your application secrets, better visibility into the metadata of deployed secrets, and allows for central management of the encryption certificate. Some may prefer this style of secret management when running standalone Service Fabric clusters.

The recommendation today is to reduce the reliance on secrets wherever possible by leveraging [Managed Identities for Service Fabric applications](concepts-managed-identity.md). Managed identities can be used to authenticate directly to Azure Storage, Azure SQL, and more, meaning that there is no need to manage a credential when accessing [Azure services which support Azure AD authentication](../active-directory/managed-identities-azure-resources/services-azure-active-directory-support.md).

When it is not possible to use Managed Identity as a client, we recommend using KeyVaultReferences when running your cluster on Azure. You should use KeyVaultReferences rather than using Managed Identity to go directly to Key Vault. This helps increase availability of your application by enforcing rolling upgrades between secret versions, and scales better as secrets are cached and served from within the cluster. Also, if your application uses Encrypted Parameters today, there are only minimal changes needed in your application code, which can continue to expect to come up with a single secret, and for that secret to be the same for the lifetime of the process.

> [!NOTE]
> KeyVaultReference support for Service Fabric Applications is Generally Available starting with Service Fabric version 7.2 CU5. It is recommended that you upgrade to this version before using this feature.

> [!NOTE]
> Managed KeyVaultReference support for Service Fabric Applications is Generally Available starting with Service Fabric version 9.0. 

## Prerequisites

- Managed Identity for Service Fabric Applications

    Service Fabric KeyVaultReference support uses an application's Managed Identity to fetch secrets on behalf of the application, so your application must be deployed via ARM and be assigned a managed identity. Follow this [document](concepts-managed-identity.md) to enable managed identity for your application.

- Central Secrets Store (CSS).

    Central Secrets Store (CSS) is Service Fabric's encrypted local secrets cache. This feature uses CSS to protect and persist secrets after they are fetched from Key Vault. Enabling this system service is required to use KeyVaultReferences. Follow this [document](service-fabric-application-secret-store.md) to enable and configure CSS.

- Grant application's managed identity access permission to the Key Vault

    Reference this [document](how-to-grant-access-other-resources.md) to see how to grant managed identity access to Key Vault. Also note if you are using system assigned managed identity, the managed identity is created only after application deployment. This can create race conditions where the application tries to access the secret before the identity can be given access to the vault. The system assigned identity's name will be `{cluster name}/{application name}/{service name}`.

## KeyVaultReferences vs. Managed KeyVaultReferences

The basic idea of KeyVaultReferences is rather than setting the value of your application parameter as your secret, you set it to the Key Vault URL, which will then be resolved to the secret value upon activation of your application. In Key Vault, a single secret, e.g. `https://my.vault.azure.net/secrets/MySecret/` can have multiple versions, e.g. `https://my.vault.azure.net/secrets/MySecret/<oid1>` and `<oid2>`. When using a KeyVaultReference, the value should be a versioned reference (`https://my.vault.azure.net/secrets/MySecret/<oid1>`). If you rotate that secret in the vault, e.g. to `<oid2>`, you should trigger an application upgrade to the new reference. When using a ManagedKeyVaultReference, the value should be a versionless reference (`https://my.vault.azure.net/secrets/MySecret/`). Service Fabric will resolve the latest instance `<oid1>` and activate the application with that secret. If you rotate the secret in the vault to `<oid2>`, Service Fabric will automatically trigger an application upgrade to move to `<oid2>` on your behalf.

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

## Use Managed KeyVaultReferences in your application

First, you must enable secret monitoring by upgrading your cluster definition:

```json
"fabricSettings": [
    {
        "name": "CentralSecretService",     
        "parameters": [
            {
                "name": "EnableSecretMonitoring",
                "value": "true"
            }
        ]
    }
],
```

> [!NOTE]
> The default may become `true` in the future

Anywhere a KeyVaultReference can be used, a ManagedKeyVaultReference can also be used, e.g.

```xml
    <Section Name="MySecrets">
        <Parameter Name="MySecret" Type="ManagedKeyVaultReference" Value="[MySecretReference]"/>
    </Section>
```

The primary difference in specifying ManagedKeyVaultReferences is that they *cannot* be hardcoded in your application type manifest. They must be declared as Application-level parameters, and further they must be overridden in your ARM application definition.

Here is an excerpt from a well-formed manifest

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest ApplicationTypeName="MyAppType" ApplicationTypeVersion="1.0.0">
  <Parameters>
    <Parameter Name="MySecretReference" DefaultValue="" />
  </Parameters>
  <ServiceManifestImport>
    <EnvironmentOverrides CodePackageRef="Code">
      <EnvironmentVariable Name="MySecret" Value="[MySecretReference]" Type="ManagedKeyVaultReference" />
    </EnvironmentOverrides>
    <Policies>
      <IdentityBindingPolicy ServiceIdentityRef="MySvcIdentity" ApplicationIdentityRef="MyAppIdentity" />
    </Policies>
  </ServiceManifestImport>
  <Principals>
    <ManagedIdentities>
      <ManagedIdentity Name="MyAppIdentity" />
    </ManagedIdentities>
  </Principals>
</ApplicationManifest>
```

and an excerpt of the application resource definition:

```json
{
    "type": "Microsoft.ServiceFabric/clusters/applications",
    "name": "MyApp",
    "identity": {
        "type" : "userAssigned",
        "userAssignedIdentities": {
            "[variables('userAssignedIdentityResourceId')]": {}
        }
    },
    "properties": {
        "parameters": {
            "MySecretReference": "https://my.vault.azure.net/secrets/MySecret/"
        },
        "managedIdentities": [
            {
            "name" : "MyAppIdentity",
            "principalId" : "<guid>"
            }
        ]
    }
}
```

Both declaring the ManagedKeyVaultReference as an application parameter, as well as overriding that parameter at deployment is needed for Service Fabric to successfully manage the lifecycle of the deployed secret.

## Next steps

- [Azure KeyVault Documentation](../key-vault/index.yml)
- [Learn about Central Secret Store](service-fabric-application-secret-store.md)
- [Learn about Managed identity for Service Fabric Applications](concepts-managed-identity.md)
