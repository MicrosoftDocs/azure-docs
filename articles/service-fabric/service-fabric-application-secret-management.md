
<properties
   pageTitle="Managing secrets in Service Fabric applications | Microsoft Azure"
   description="This article describes how to secure secret values in a Service Fabric application."
   services="service-fabric"
   documentationCenter=".net"
   authors="vturecek"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="08/11/2016"
   ms.author="vturecek"/>

# Managing secrets in Service Fabric applications

This guide walks you through the steps of managing secrets in a Service Fabric application. Secrets can be any sensitive information, such as storage connection strings, passwords, or other values that should not be handled in plain text.

This guide uses Azure Key Vault to manage keys and secrets. However, *using* secrets in an application is cloud platform-agnostic to allow applications to be deployed to a cluster hosted anywhere. 

## Overview

The recommended way to manage service configuration settings is through [service configuration packages][config-package]. Configuration packages are versioned and updateable through managed rolling upgrades with health-validation and auto rollback. This is preferred to global configuration as it reduces the chances of a global service outage. Encrypted secrets are no exception. Service Fabric has built-in features for enrypting and decrypting values in a configuration package Settings.xml file using certificate encryption.

The following diagram illustrates the basic flow for secret management in a Service Fabric application:

![secret management overview][overview]

There are four main steps in this flow:

 1. Obtain a data encipherment certificate.
 2. Install the certificate in your cluster.
 3. Encrypt secret values when deploying an application with the certificate and inject them into a service's Settings.xml configuration file.
 4. Read encrypted values out of Settings.xml by decrypting with the same encipherment certificate. 

[Azure Key Vault][key-vault-get-started] is used here as a safe storage location for certificates and as a way to get certificates installed on Service Fabric clusters in Azure. If you are not deploying to Azure, you do not need to use Key Vault to manage secrets in Service Fabric applications.

## Data encipherment certificate

A data encipherment certificate is used strictly for encryption and decryption of configuration values in a service's Settings.xml and is not used for authentication. The certificate must meet the following requirements:

 - The certificate must contain a private key.
 - The certificate must be created for key exchange, exportable to a Personal Information Exchange (.pfx) file.
 - The certificate key usage must include Data Encipherment (10), and should not include Server Authentication or Client Authentication. 
 
 For example, when creating a self-signed certificate using PowerShell, the KeyUsage flag must indicate DataEncipherment:

 ```powershell
New-SelfSignedCertificate -Type DocumentEncryptionCert -KeyUsage DataEncipherment -Subject mydataenciphermentcert -Provider 'Microsoft Enhanced Cryptographic Provider v1.0'
```


## Install the certificate in your cluster

This certificate must be installed on each node in the cluster. It will be used at runtime to decrypt values stored in a service's Settings.xml. See [how to create a cluster using Azure Resource Manager][service-fabric-cluster-creation-via-arm] for set up instructions. 

## Encrypt application secrets

The Service Fabric SDK has built-in secret encryption and decryption functions. Secret values can be encrypted at built-time and then decrypted and read programmatically in service code. 

The following PowerShell command is used to encrypt a secret. You must use the same encipherment certificate that is installed in your cluster to produce ciphertext for secret values:

```powershell
Invoke-ServiceFabricEncryptText -CertStore -CertThumbprint "<thumbprint>" -Text "mysecret" -StoreLocation CurrentUser -StoreName My
```

The resulting base-64 string contains both the secret ciphertext as well as information about the certificate that was used to encrypt it.  The  base-64 encoded string can be inserted into a parameter in your service's Settings.xml configuration file with the `IsEncrypted` attribute set to `true`:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<Settings xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/2011/01/fabric">
  <Section Name="MySettings">
    <Parameter Name="MySecret" IsEncrypted="true" Value="I6jCCAeYCAxgFhBXABFxzAt ... gNBRyeWFXl2VydmjZNwJIM=" />
  </Section>
</Settings>
```

### Inject application secrets into application instances  

Ideally, deployment to different environments should be as automated as possible. This can be accomplished by performing secret encryption in a build environment and providing the encrypted secrets as parameters when creating application instances.

#### Use overridable parameters in Settings.xml

The Settings.xml configuration file allows overridable parameters that can be provided at application creation time. Use the `MustOverride` attribute instead of providing a value for a parameter:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<Settings xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/2011/01/fabric">
  <Section Name="MySettings">
    <Parameter Name="MySecret" IsEncrypted="true" Value="" MustOverride="true" />
  </Section>
</Settings>
```

To override values in Settings.xml, declare an override parameter for the service in ApplicationManifest.xml:

```xml
<ApplicationManifest ... >
  <Parameters>
    <Parameter Name="MySecret" DefaultValue="" />
  </Parameters>
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="Stateful1Pkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides>
      <ConfigOverride Name="Config">
        <Settings>
          <Section Name="MySettings">
            <Parameter Name="MySecret" Value="[MySecret]" IsEncrypted="true" />
          </Section>
        </Settings>
      </ConfigOverride>
    </ConfigOverrides>
  </ServiceManifestImport>
 ```

Now the value can be specified as an *application parameter* when creating an instance of the application. Creating an application instance can be scripted using PowerShell, or written in C#, for easy integration in a build process.

Using PowerShell, the parameter is supplied to the `New-ServiceFabricApplication` command as a [hash table](https://technet.microsoft.com/library/ee692803.aspx):

```powershell
PS C:\Users\vturecek> New-ServiceFabricApplication -ApplicationName fabric:/MyApp -ApplicationTypeName MyAppType -ApplicationTypeVersion 1.0.0 -ApplicationParameter @{"MySecret" = "I6jCCAeYCAxgFhBXABFxzAt ... gNBRyeWFXl2VydmjZNwJIM="}
```

Using C#, application parameters are specified in an `ApplicationDescription` as a `NameValueCollection`:

```csharp
FabricClient fabricClient = new FabricClient();

NameValueCollection applicationParameters = new NameValueCollection();
applicationParameters["MySecret"] = "I6jCCAeYCAxgFhBXABFxzAt ... gNBRyeWFXl2VydmjZNwJIM=";

ApplicationDescription applicationDescription = new ApplicationDescription(
    applicationName: new Uri("fabric:/MyApp"),
    applicationTypeName: "MyAppType",
    applicationTypeVersion: "1.0.0",
    applicationParameters: applicationParameters)
);

await fabricClient.ApplicationManager.CreateApplicationAsync(applicationDescription);
```

## Decrypt secrets from service code

Services in Service Fabric run under NETWORK SERVICE by default on Windows and don't have access to certificates installed on the node without some extra setup.

When using a data encipherment certificate, you need to make sure NETWORK SERVICE or whatever user account the service is running under has access to the private key. Service Fabric will handle granting access for your service automatically if you configure it to do so. This configuration can be done in ApplicationManifest.xml by defining users and security policies for certificates. In the following example, the NETWORK SERVICE account is given read access to a certificate defined by its thumbprint:

```xml
<ApplicationManifest … >
    <Principals>
        <Users>
            <User Name="Service1" AccountType="NetworkService" />
        </Users>
    </Principals>
  <Policies>
    <SecurityAccessPolicies>
      <SecurityAccessPolicy GrantRights=”Read” PrincipalRef="Service1" ResourceRef="MyCert" ResourceType="Certificate"/>
    </SecurityAccessPolicies>
  </Policies>
  <Certificates>
    <SecretsCertificate Name="MyCert" X509FindType="FindByThumbprint" X509FindValue="[YourCertThumbrint]"/>
  </Certificates>
</ApplicationManifest>
```

> [AZURE.NOTE] When copying a certificate thumbprint from the certificate store snap-in on Windows, an invisible character is placed at the beginning of the thumbprint string. This invisible character can cause an error when trying to locate a certificate by thumbprint, so be sure to delete this extra character.

### Use application secrets in service code

The API for accessing configuration values from Settings.xml in a configuration package allows for easy decrypting of values that have the `IsEncrypted` attribute set to `true`. Since the encrypted text contains information about the certificate used for encryption, you do not need to manually find the certificate. The certificate just needs to be installed on the node that the service is running on. Simply call the `DecryptValue()` method to retreive the original secret value:

```csharp
ConfigurationPackage configPackage = this.Context.CodePackageActivationContext.GetConfigurationPackageObject("Config");
SecureString mySecretValue = configPackage.Settings.Sections["MySettings"].Parameters["MySecret"].DecryptValue()
```

## Next Steps

At this point, you should have a secured cluster using Azure Active Directory for management authentication, certificates installed on the cluster nodes for application secret decryption, and Key Vault set up for key and secret management. 

Learn more about [running applications with different security permissions](https://azure.microsoft.com/en-us/documentation/articles/service-fabric-application-runas-security/)

<!-- Links -->
[key-vault-get-started]:../key-vault/key-vault-get-started.md
[config-package]: service-fabric-application-model.md
[service-fabric-cluster-creation-via-arm]: service-fabric-cluster-creation-via-arm.md

<!-- Images -->
[overview]:./media/service-fabric-application-secret-management/overview.png