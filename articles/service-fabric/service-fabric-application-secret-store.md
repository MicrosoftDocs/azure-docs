---
title: Service Fabric Secrets Store 
description: This article describes how to use Service Fabric Secrets Store.

ms.topic: conceptual 
ms.date: 07/25/2019
---

#  Service Fabric Secrets Store
This article describes how to create and use secrets in Service Fabric applications using Service Fabric Secrets Store(CSS). CSS is a local secret store cache, used to keep sensitive data such as a password, tokens, and keys encrypted in memory.

## Enabling Secrets Store
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
You can create a secret resource either using the Resource Manager template or using the REST API.

* Using Resource Manager template
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
The above template creates `supersecret` secret resource, but no value is set for the secret resource yet.

* Using the REST API

To create secret resource, `supersecret` make a PUT request to `https://<clusterfqdn>:19080/Resources/Secrets/supersecret?api-version=6.4-preview`. You need the cluster certificate or admin client certificate to create a secret.

```powershell
Invoke-WebRequest  -Uri https://<clusterfqdn>:19080/Resources/Secrets/supersecret?api-version=6.4-preview -Method PUT -CertificateThumbprint <CertThumbprint>
```

## Set secret value
* Using Resource Manager template

The below Resource Manager template creates and set value for secret `supersecret` with version `ver1`.
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
* Using the REST API

```powershell
$Params = @{"properties": {"value": "mysecretpassword"}}
Invoke-WebRequest -Uri https://<clusterfqdn>:19080/Resources/Secrets/supersecret/values/ver1?api-version=6.4-preview -Method PUT -Body $Params -CertificateThumbprint <ClusterCertThumbprint>
```
## Using the secret in your application

1.  Add a section in settings.xml file with the below content. Note here the Value is of the format {`secretname:version`}

```xml
  <Section Name="testsecrets">
   <Parameter Name="TopSecret" Type="SecretsStoreRef" Value="supersecret:ver1"/
  </Section>
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

Only change required to make the secrets available inside the container is to specify a MountPoint in `<ConfigPackage>`.
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

4. Binding secret to an environment variable 

You can bind secret to a process environment variable by specifying Type='SecretsStoreRef'. Here is an example of how to bind `supersecret` version `ver1` to environment variable `MySuperSecret` in ServiceManifest.xml.

```xml
<EnvironmentVariables>
  <EnvironmentVariable Name="MySuperSecret" Type="SecretsStoreRef" Value="supersecret:ver1"/>
</EnvironmentVariables>
```
## Next steps
Learn more about [application and service security](service-fabric-application-and-service-security.md)