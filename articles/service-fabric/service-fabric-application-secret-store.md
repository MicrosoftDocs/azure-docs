---
title: Azure Service Fabric Central Secrets Store 
description: This article describes how to use Central Secrets Store in Azure Service Fabric.

ms.topic: conceptual 
ms.date: 07/25/2019
---

# Central Secrets Store in Azure Service Fabric 
This article describes how to use Central Secrets Store (CSS) in Azure Service Fabric to create secrets in Service Fabric applications. CSS is a local secret store cache that keeps sensitive data, such as a password, tokens, and keys, encrypted in memory.

## Enable Central Secrets Store
Add the following script to your cluster configuration under `fabricSettings` to enable CSS. We recommend that you use a certificate other than a cluster certificate for CSS. Make sure the encryption certificate is installed on all nodes and that `NetworkService` has read permission to the certificate's private key.
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
                },
                 {
                    "name" : "EncryptionCertificateThumbprint",
                    "value": "<thumbprint>"
                 }
                ,
                ],
            },
            ]
     }
        ...
     ]
```
## Declare a secret resource
You can create a secret resource by using either the Azure Resource Manager template or the REST API.

### Use Resource Manager

Use the following template to use Resource Manager to create the secret resource. The template creates a `supersecret` secret resource, but no value is set for the secret resource yet.


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

### Use the REST API

To create a `supersecret` secret resource by using the REST API, make a PUT request to `https://<clusterfqdn>:19080/Resources/Secrets/supersecret?api-version=6.4-preview`. You need the cluster certificate or admin client certificate to create a secret resource.

```powershell
Invoke-WebRequest  -Uri https://<clusterfqdn>:19080/Resources/Secrets/supersecret?api-version=6.4-preview -Method PUT -CertificateThumbprint <CertThumbprint>
```

## Set the secret value

### Use the Resource Manager template

Use the following Resource Manager template to create and set the secret value. This template sets the secret value for the `supersecret` secret resource as version `ver1`.
```json
  {
  "parameters": {
  "supersecret": {
      "type": "string",
      "metadata": {
        "description": "supersecret value"
      }
   }
  },
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
    },
    {
      "apiVersion": "2018-07-01-preview",
      "name": "supersecret/ver1",
      "type": "Microsoft.ServiceFabricMesh/secrets/values",
      "location": "[parameters('location')]",
      "dependsOn": [
        "Microsoft.ServiceFabricMesh/secrets/supersecret"
      ],
      "properties": {
        "value": "[parameters('supersecret')]"
      }
    }
  ],
  ```
### Use the REST API

Use the following script to use the REST API to set the secret value.
```powershell
$Params = @{"properties": {"value": "mysecretpassword"}}
Invoke-WebRequest -Uri https://<clusterfqdn>:19080/Resources/Secrets/supersecret/values/ver1?api-version=6.4-preview -Method PUT -Body $Params -CertificateThumbprint <ClusterCertThumbprint>
```
## Use the secret in your application

Follow these steps to use the secret in your Service Fabric application.

1. Add a section in the **settings.xml** file with the following snippet. Note here that the value is in the format {`secretname:version`}.

   ```xml
     <Section Name="testsecrets">
      <Parameter Name="TopSecret" Type="SecretsStoreRef" Value="supersecret:ver1"/
     </Section>
   ```

1. Import the section in **ApplicationManifest.xml**.
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

   The environment variable `SecretPath` will point to the directory where all secrets are stored. Each parameter listed under the `testsecrets` section is stored in a separate file. The application can now use the secret as follows:
   ```C#
   secretValue = IO.ReadFile(Path.Join(Environment.GetEnvironmentVariable("SecretPath"),  "TopSecret"))
   ```
1. Mount the secrets to a container. The only change required to make the secrets available inside the container is to `specify` a mount point in `<ConfigPackage>`.
The following snippet is the modified **ApplicationManifest.xml**.  

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
   Secrets are available under the mount point inside your container.

1. You can bind a secret to a process environment variable by specifying `Type='SecretsStoreRef`. The following snippet is an example of how to bind the `supersecret` version `ver1` to the environment variable `MySuperSecret` in **ServiceManifest.xml**.

   ```xml
   <EnvironmentVariables>
     <EnvironmentVariable Name="MySuperSecret" Type="SecretsStoreRef" Value="supersecret:ver1"/>
   </EnvironmentVariables>
   ```

## Next steps
Learn more about [application and service security](service-fabric-application-and-service-security.md).
