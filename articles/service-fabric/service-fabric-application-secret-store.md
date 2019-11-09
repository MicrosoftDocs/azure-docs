---
title: Service Fabric Secrets Store | Microsoft Docs
description: This article describes how to use Service Fabric Secrets Store.
services: service-fabric
author: athinanthny 

ms.service: service-fabric
ms.topic: conceptual 
ms.date: 07/25/2019
ms.author: atsenthi 
---

#  Service Fabric Secrets Store
This article describes how to create and use secrets in Service Fabric applications using Service Fabric Secrets Store(CSS). CSS is a local secret store cache, it is used to keep sensitive data such as a password, token, key, etc, encrypted in memory.

## Enabling Secrets Store.
 Add the below to your cluster configuration under `fabricSettings` to enable CSS. It's recommended to use a certificate different from cluster certificate for CSS. Make sure the encryption certificate is installed on all nodes and `NetworkService` has read permission to certificate's private key.
  ```json
    "fabricSettings": 
    [
        ...
    {
        "parameters":  [
            "name":  "CentralSecretService"
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
                },
                 {
                    "name" : "EncryptionCertificateThumbprint",
                    "value": "<thumbprint>"
                 }
                ,
                ],
            },
            ]
```
## Declare secret resource
Secret store secrets are versioned resources, you can create a secret resource either using the ARM template or using the REST API
1. Using ARM template
```json
"resources": [
    {
      "apiVersion": "2018-07-01-preview",
      "name": "supersecret",
      "type": "Microsoft.ServiceFabricMesh/secrets",
      "location": "[parameters('location')]", 
      "dependsOn": [],
      "properties": {
        "kind": "inlinedValue",
        "description": "Application Secret",
        "contentType": "text/plain",
      }
    }
  ]
```
This will create a secret resource named `supersecret`, note that we haven't set the value for the secret yet.

2. Using the REST API

To create secret resource `supersecret` make a PUT request to `https://<clusterfqdn>:19080/Resources/Secrets/supersecret?api-version=6.4-preview`. You need the cluster certificate or admin client certificate to create a secret.

```powershell
Invoke-WebRequest  -Uri https://<clusterfqdn>:19080/Resources/Secrets/supersecret?api-version=6.4-preview -Method PUT -CertificateThumbprint <CertThumbprint>
```

## Set secret value
To set `supersecret` version `v1` value make a PUT request as below.
```powershell
$Params = @{"properties": {"value": "mysecretpassword"}}
Invoke-WebRequest -Uri https://<clusterfqdn>:19080/Resources/Secrets/supersecret/values/v1?api-version=6.4-preview -Method PUT -Body $Params -CertificateThumbprint <ClusterCertThumbprint>
```
## Using the secret in your application

1.  Add a section in settings.xml file with the below content. Note here the Value is of the format {secretname:version}

```xml
  <Section Name="testsecrets">
  <Parameter Name="TopSecret" Type="SecretsStoreRef" Value="supersecret:v1"/
  </Section>
</Settings>
```
2. Now import the section in ApplicationManifest.xml
```xml
<ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="testservicePkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides />
    <Policies>
      <ConfigPackagePolicies CodePackageRef="Code">
        <ConfigPackage Name="Config" SectionName="testsecrets" EnvironmentVariableName="SecretPath" />
      </ConfigPackagePolicies>
    </Policies>
  </ServiceManifestImport>
```

Environment Variable 'SecretPath' will point to the directory where all secrets are stored. Each parameter listed under section `testsecrets` will be stored in a separate file. Application can now use the secret as shown below
```C#
secretValue = IO.ReadFile(Path.Join(Environment.GetEnvironmentVariable("SecretPath"),  "TopSecret"))
```
3. Mounting secrets to a container

Only change required to make the secrets available inside the container is to specify a MountPoint in `<ConfigPackage>`
Here is the modified ApplicationManifest.xml  

```xml
<ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="testservicePkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides />
    <Policies>
      <ConfigPackagePolicies CodePackageRef="Code">
        <ConfigPackage Name="Config" SectionName="testsecrets" MountPoint="C:\secrets" EnvironmentVariableName="SecretPath" />
        <!-- Linux Container
         <ConfigPackage Name="Config" SectionName="testsecrets" MountPoint="/mnt/secrets" EnvironmentVariableName="SecretPath" />
        -->
      </ConfigPackagePolicies>
    </Policies>
  </ServiceManifestImport>
```
Secrets will be available under the mount point inside your container.