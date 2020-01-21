---
title: Azure Service Fabric - Using Service Fabric application KeyVault references 
description: This article explains how to use service-fabric KeyVaultReference support for application secrets.

ms.topic: article
ms.date: 09/20/2019
---

#  KeyVaultReference support for Service Fabric applications (preview)

A common challenge when building cloud applications is how to securely store secrets required by your application. For example, you might want to store the container repository credentials in keyvault and reference it in application manifest. Service Fabric KeyVaultReference uses Service Fabric Managed Identity and makes it easy to reference keyvault secrets. The remainder of this article details how to use Service Fabric KeyVaultReference and includes some typical usage.

## Prerequisites

- Managed Identity for Application (MIT)
    
    Service Fabric KeyVaultReference support uses application's Managed Identity and therefore applications planing to use KeyVaultReferences should use Managed Identity. Follow this [document](concepts-managed-identity.md) to enable managed identity for your application.

- Central Secrets Store (CSS).

    Central Secrets Store(CSS) is service-fabric's encrypted local secrets cache, KeyVaultReference once fetched are cached in CSS.

    Add the below to your cluster configuration under `fabricSettings` to enable all the required features for KeyVaultReference support.

    ```json
    "fabricSettings": 
    [
        ...
    {
                "name":  "CentralSecretService",
                "parameters":  [
                {
                    "name":  "IsEnabled",
                    "value":  "true"
                },
                {
                    "name":  "MinReplicaSetSize",
                    "value":  "3"
                },
                {
                    "name":  "TargetReplicaSetSize",
                    "value":  "3"
                }
                ]
            },
            {
                "name":  "ManagedIdentityTokenService",
                "parameters":  [
                {
                    "name":  "IsEnabled",
                    "value":  "true"
                }
                ]
            }
            ]
    ```

    > [!NOTE] 
    > It's recommended to use a separate encryption certificate for CSS. You can add it under the "CentralSecretService" section.
    

    ```json
        {
            "name": "EncryptionCertificateThumbprint",
            "value": "<EncryptionCertificateThumbprint for CSS>"
        }
    ```
In order for the changes to take effect, you will also need to change the upgrade policy to specify a forceful restart of the Service Fabric runtime on each node as the upgrade progresses through the cluster. This restart ensures that the newly enabled system service is started and running on each node. In the snippet below, forceRestart is the essential setting; use your existing values for the remainder of the settings.
```json
"upgradeDescription": {
    "forceRestart": true,
    "healthCheckRetryTimeout": "00:45:00",
    "healthCheckStableDuration": "00:05:00",
    "healthCheckWaitDuration": "00:05:00",
    "upgradeDomainTimeout": "02:00:00",
    "upgradeReplicaSetCheckTimeout": "1.00:00:00",
    "upgradeTimeout": "12:00:00"
}
```
- Grant application's managed identity access permission to the keyvault

    Reference this [document](how-to-grant-access-other-resources.md) to see how to grant managed identity access to keyvault. Also note if you are using System Assigned Managed Identity, the managed identity is created only after application deployment.

## Keyvault secret as application parameter
Let's say the application needs to read the backend database password stored in keyvault, Service Fabric KeyVaultReference support makes it easy. Below example reads `DBPassword` secret from keyvault using Service Fabric KeyVaultReference support.

- Add a section to settings.xml

    Define `DBPassword` parameter with Type `KeyVaultReference` and Value `<KeyVaultURL>`

    ```xml
    <Section Name="dbsecrets">
        <Parameter Name="DBPassword" Type="KeyVaultReference" Value="https://vault200.vault.azure.net/secrets/dbpassword/8ec042bbe0ea4356b9b171588a8a1f32"/>
    </Section>
    ```
- Reference the new section in ApplicationManifest.xml in `<ConfigPackagePolicies>`

    ```xml
    <ServiceManifestImport>
        <Policies>
        <IdentityBindingPolicy ServiceIdentityRef="WebAdmin" ApplicationIdentityRef="ttkappuser" />
        <ConfigPackagePolicies CodePackageRef="Code">
            <!--Linux container example-->
            <ConfigPackage Name="Config" SectionName="dbsecrets" EnvironmentVariableName="SecretPath" MountPoint="/var/secrets"/>
            <!--Windows container example-->
            <!-- <ConfigPackage Name="Config" SectionName="dbsecrets" EnvironmentVariableName="SecretPath" MountPoint="C:\secrets"/> -->
        </ConfigPackagePolicies>
        </Policies>
    </ServiceManifestImport>
    ```

- Using KeyVaultReference in your application

    Service Fabric on service instantiation will resolve the KeyVaultReference Parameter using application's managed identity. Each parameter listed under `<Section  Name=dbsecrets>` will be a file under the folder pointed to by EnvironmentVariable SecretPath. Below C# code snippet show how to read DBPassword in your application.

    ```C#
    string secretPath = Environment.GetEnvironmentVariable("SecretPath");
    using (StreamReader sr = new StreamReader(Path.Combine(secretPath, "DBPassword"))) 
    {
        string dbPassword =  sr.ReadToEnd();
        // dbPassword to connect to DB
    }
    ```
    > [!NOTE] 
    > For the container scenario, you can use the MountPoint to control where the `secrets` will be mounted.

## Keyvault secret as environment variable

Service Fabric environment variables now support KeyVaultReference type, below example shows how to bind an environment variable to a secret stored in KeyVault.

```xml
<EnvironmentVariables>
      <EnvironmentVariable Name="EventStorePassword" Type="KeyVaultReference" Value="https://ttkvault.vault.azure.net/secrets/clustercert/e225bd97e203430d809740b47736b9b8"/>
</EnvironmentVariables>
```

```C#
string eventStorePassword =  Environment.GetEnvironmentVariable("EventStorePassword");
```
## Keyvault secret as container repository password
KeyVaultReference is a supported type for container RepositoryCredentials, below example shows how to use a keyvault 
reference as container repository password.
```xml
 <Policies>
      <ContainerHostPolicies CodePackageRef="Code">
        <RepositoryCredentials AccountName="user1" Type="KeyVaultReference" Password="https://ttkvault.vault.azure.net/secrets/containerpwd/e225bd97e203430d809740b47736b9b8"/>
      </ContainerHostPolicies>
```
## FAQ
- Managed identity needs to be enabled for KeyVaultReference support, your application activation will fail if KeyVaultReference is used without enabling Managed Identity.

- If you are using system assigned identity, it's created only after the application is deployed and this creates a circular dependency. Once your application is deployed, you can grant the system assigned identity access permission to keyvault. You can find the system assigned identity by name {cluster}/{application name}/{servicename}

- The keyvault needs to be in the same subscription as your service fabric cluster. 

## Next steps

* [Azure KeyVault Documentation](https://docs.microsoft.com/azure/key-vault/)
