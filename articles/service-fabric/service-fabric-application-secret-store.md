---
title: Azure Service Fabric Central Secret Service 
description: This article describes how to use Central Secret Service in Azure Service Fabric
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Central Secret Service in Azure Service Fabric 
Central Secret Service (CSS), also known as Central Secret Store, is a Service Fabric system service meant to safeguard secrets within a cluster. CSS eases the management of secrets for SF applications, eliminating the need to rely on encrypted parameters.

Central Secret Service is a durable, replicated in-cluster secret cache; secrets stored in CSS are encrypted at rest to a customer-provided encryption certificate. CSS provides client APIs for secret management, accessible to entities authenticating as the cluster, or a cluster admin user. The Service Fabric runtime application model integrates with CSS, allowing the declaration of application parameters as CSS secret references. 

CSS is also instrumental in provisioning application secrets declared as [KeyVault secret URIs](service-fabric-keyvault-references.md), in combination with [Managed Identity for Azure-deployed Service Fabric Applications](concepts-managed-identity.md).

Central Secret Service is not meant to be a replacement for a dedicated, external secrets management service, such as Azure Key Vault. 

  > [!NOTE] 
  > When activating CSS on an SF cluster running a version earlier than [7.1. CU3](service-fabric-versions.md#service-fabric-version-name-and-number-reference), activation can fail and leave CSS in a permanently unhealthy state if the cluster is configured for Windows authentication or if `EncryptionCertificateThumbprint` is declared incorrectly or the corresponding certificate is not installed. In either case, it is advisable to upgrade the cluster to an SF runtime version newer than 7.1. CU3 before proceeding. 
  
## Enable Central Secrets Service
To enable Central Secret Service, update the cluster configuration as described below. We recommend that you use an encryption certificate that is different from your cluster certificate. This certificate must be installed on all nodes.
```json
{ 
    "fabricSettings": [
        {
            "name":  "CentralSecretService",
            "parameters":  [
                {
                    "name":  "DeployedState",
                    "value":  "enabled"
                },
                {
                    "name" : "EncryptionCertificateThumbprint",
                    "value": "<thumbprint>"
                },
                {
                    "name":  "MinReplicaSetSize",
                    "value":  "1"
                },
                {
                    "name":  "TargetReplicaSetSize",
                    "value":  "3"
                }
            ]
        }
    ]
}
```
  > [!NOTE] 
  > The configuration setting "DeployedState", introduced in Service Fabric [version 8.0](service-fabric-versions.md#service-fabric-version-name-and-number-reference), is the preferred mechanism to enable or disable CSS; this function was served in previous versions by the configuration setting "IsEnabled", which is now considered obsolete.

## Central Secret Service secret model
The Central Secret Service API exposes two types: secret resource, and secret version. The secret resource type represents, conceptually, a family of versions of a single secret used for a specific purpose; examples include: a connection string, a password, an endpoint certificate. An object of the secret resource type contains metadata associated with that secret, specifically kind, content type, and description. The secret version type represents a particular instance of its associated secret, and stores the secret plaintext (encrypted); continuing with the examples above, a secret version contains the current password value, a certificate object valid until the end of the month etc. Upon renewing these secrets, new secret versions should be produced (and added to CSS).

Formalizing the model, the following are the rules implemented and enforced in the CSS implementation:

- A secret resource may have zero or more versions
- Every secret version is a child of a particular secret resource; a version may only have one parent resource
- An individual secret version may be deleted, without affecting other versions of the same secret
- Deleting a secret resource causes the deletion of all its versions  
- The value of a secret version is immutable
	

### Declare a secret resource
You can create a secret resource by using the REST API.

  > [!NOTE] 
  > If the cluster is using Windows authentication without an HttpGateway certificate, the REST request is sent over unsecured HTTP channel. To enable TLS for this channel, the cluster definition should be updated to specify an http gateway server certificate.

To create a `supersecret` secret resource by using the REST API, make a PUT request to `https://<clusterfqdn>:19080/Resources/Secrets/supersecret?api-version=6.4-preview`. You will need to authenticate using a cluster certificate or an admin client certificate to create a secret resource.
```powershell
$json = '{"properties": {"kind": "inlinedValue", "contentType": "text/plain", "description": "supersecret"}}'
Invoke-WebRequest  -Uri https://<clusterfqdn>:19080/Resources/Secrets/supersecret?api-version=6.4-preview -Method PUT -CertificateThumbprint <CertThumbprint> -Body $json
```

### Set the secret value
Use the following script to use the REST API to set the secret value.
```powershell
$Params = '{"properties": {"value": "mysecretpassword"}}'
Invoke-WebRequest -Uri https://<clusterfqdn>:19080/Resources/Secrets/supersecret/values/ver1?api-version=6.4-preview -Method PUT -Body $Params -CertificateThumbprint <ClusterCertThumbprint>
```

### Examine the secret value
```powershell
Invoke-WebRequest -CertificateThumbprint <ClusterCertThumbprint> -Method POST -Uri "https:<clusterfqdn>/Resources/Secrets/supersecret/values/ver1/list_value?api-version=6.4-preview"
```

## Use the secret in your application
An application can consume a secret from CSS by declaring it as an environment variable, or by specifying a path where the secret plaintext shall be serialized. Follow these steps to reference a CSS secret:

1. Add a section in the **settings.xml** file with the following snippet. Note here that the value is in the format {`secretname:version`}.
```xml
     <Section Name="testsecrets">
      <Parameter Name="TopSecret" Type="SecretsStoreRef" Value="supersecret:ver1"/
     </Section>
```

2. Import the section in **ApplicationManifest.xml**.
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
   
Example 1: Mount the secrets to a container. The only change required to make the secrets available inside the container is to `specify` a mount point in `<ConfigPackage>`.
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

Example 2: Bind a secret to a process environment variable by specifying `Type='SecretsStoreRef`. The following snippet is an example of how to bind the `supersecret` version `ver1` to the environment variable `MySuperSecret` in **ServiceManifest.xml**.

```xml
   <EnvironmentVariables>
     <EnvironmentVariable Name="MySuperSecret" Type="SecretsStoreRef" Value="supersecret:ver1"/>
   </EnvironmentVariables>
```

The environment variable `SecretPath` will point to the directory where all secrets are stored. Each parameter listed under the `testsecrets` section is stored in a separate file. The application can now use the secret as follows:
```C#
secretValue = IO.ReadFile(Path.Join(Environment.GetEnvironmentVariable("SecretPath"),  "TopSecret"))
```
   
## Rotating the Central Secret Service Encryption Certificate
It is important to note that certificates remain valid for decryption beyond their expiry. At this time, we recommend continuing to provision past encryption certificates after rotation, to reduce the chance of a lockout. Rotating the CSS encryption certificate requires the following steps:

1. Provision the new certificate to each node of the cluster. At this time, do not remove/continue provisioning the previous encryption certificate.
2. Start a cluster configuration upgrade to change the value of `EncryptionCertificateThumbprint` to the SHA-1 thumbprint of the new certificate.
Upon the completion of the upgrade, CSS will begin re-encrypting its existing content to the new encryption certificate. All secrets added to CSS after this point will be encrypted directly to the new encryption certificate. Since the convergence to having all secrets protected by the new certificate is asynchronous, it is important that the previous encryption certificate remains installed on all nodes, and available to CSS.

## Removing Central Secret Service from your cluster
Safe removal of Central Secret Service from a cluster requires two upgrades. The first upgrade functionally disables CSS, while the second upgrade removes the service from the cluster definition, which includes the permanent deletion of its content. This two-stage process prevents accidental deletion of the service, and helps to ensure that there are no orphaned dependencies on CSS during the removal process. This feature is available from SF version 8.0 onward.

### Step 1: Update CSS DeployedState to removing
Upgrade cluster definition from `"IsEnabled" = "true"` or from `"DeployedState" = "enabled"` to
```json
{
    "name":  "DeployedState",
    "value":  "removing"
}
```
Once Central Secret Service enters the deployed state `Removing`, it will reject all incoming secret API calls, whether direct REST calls or via activations of services that include SecretStoreRefs or KeyVaultReferences. Any applications or components in the cluster which still depend on CSS at this point will go into Warning state. Should this occur, the upgrade to deployed state `Removing` should be rolled back; if that upgrade has already succeeded, a new upgrade should be initiated to change CSS back to DeployedState = `Enabled`. 
If Central Secret Service receives a request while in deployed state `Removing`, it will return HTTP Code 401 (unauthorized) and put itself in a Warning health state.

### Step 2: Update CSS DeployedState to disabled
Upgrade cluster definition from `"DeployedState" = "removing"` to
```json
{
    "name":  "DeployedState",
    "value":  "disabled"
}
```
Central Secret Service should no longer be running in the cluster, and will not be present in the list of system services. The contents of CSS is irretrievably lost. 

## Next steps

- Learn more about [application and service security](service-fabric-application-and-service-security.md).
- Get introduced to [Managed Identity for Service Fabric Applications](concepts-managed-identity.md).
- Expand CSS's functionality with [KeyVaultReferences](service-fabric-keyvault-references.md)
