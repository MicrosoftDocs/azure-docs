---
title: Azure Service Fabric Central Secret Service 
description: This article describes how to use Central Secret Service in Azure Service Fabric.

ms.topic: conceptual 
ms.date: 04/06/2021
---

# Central Secret Service in Azure Service Fabric 
Central Secret Service (CSS), sometimes denoted Central Secret Store, is an optional Service Fabric system service. CSS facilitates new approaches to secret management for applications, and is Service Fabric's recommendation for the in-cluster delivery of application secrets, on and off Azure. The previous recommended approach was the use of encrypted parameters.

Central Secret Service is a durable and replicated in-cluster secret store. Secrets stored in CSS are encrypted while in use, against a customer-provided encryption certificate. CSS provides client APIs for the management of secrets, which are authenticated against admin client/cluster certificates. CSS also provides an application model that allows the declaration of application parameters as CSS secret references. When combined with [Managed Identity for Azure-deployed Service Fabric Applications](concepts-managed-identity.md), applications can declare [secret references that refer to secrets in Azure Key Vault](service-fabric-keyvault-references.md).

Central Secret Service is not designed to be a full Secret Management Service (SMS), such as Azure Key Vault, and should not be the source-of-truth for secrets. In this way, CSS is best thought of as, and treated like, a durable cache.

  > [!NOTE] 
  > When activating CSS for the first time before SF version 7.1. CU3, activation can fail and leave CSS in a permanently unhealthy state if: CSS is activated on a Windows authenticated cluster; CSS is activated on any cluster but `EncryptionCertificateThumbprint` is declared incorrectly or the corresponding certificate is not installed / ACL-ed on nodes. For Windows Auth cluster, please come onto 7.1. CU3 before proceeding. For other clusters, please double check these invariants or come onto 7.1. CU3.
  
## Enable Central Secrets Service

To enable Central Secret Service, please expand your cluster configuration as described below. We recommend that you use an encryption certificate that is different from your cluster certificate. This certificate must be installed on all nodes.
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
  > Prior to Service Fabric 8.0, rather than setting parameter "DeployedState" to "enabled", CSS should be enabled by setting parameter "IsEnabled" to "true". "IsEnabled" is now deprecated, and transitioning to "DeployedState" is described in a later section. Transitioning off "IsEnabled" is only required if you wish to remove Central Secret Service from your cluster.

## Central Secret Service secret model

Central Secret Service provides two types, the first is the secret resource type, and the second is the secret version type. The secret resource type describes the metadata of a lineage of secrets, and includes their kind, their content type, and a description. The secret version type describes an instance of a particular secret, and includes the value.

Every secret version is a child of a particular secret resource. Each secret resource may have 0 or more secret versions. For a secret version to be created, its parent secret resource must already exist. Deletion of a secret resource will cause the deletion of all secret versions under it. The value of a particular secret version cannot be changed in-place.

The full set of REST management APIs for secret resources can be found [here](https://docs.microsoft.com/rest/api/servicefabric/sfclient-index-meshsecrets), and for secret versions, [here](https://docs.microsoft.com/rest/api/servicefabric/sfclient-index-meshsecretvalues).

### Declare a secret resource
You can create a secret resource by using the REST API.
  > [!NOTE] 
  > If the cluster is using windows authentication, the REST request is sent over unsecured HTTP channel. The recommendation is to use a X509-based cluster with secure endpoints.

To create a `supersecret` secret resource by using the REST API, make a PUT request to `https://<clusterfqdn>:19080/Resources/Secrets/supersecret?api-version=6.4-preview`. You need the cluster certificate or admin client certificate to create a secret resource.

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

## Rotating the Central Secret Service Encryption Certificate
It is important to note that certificates remain valid for decryption beyond their expiry. At this time, we recommend to continue to provision past encryption certificates after rotation, to decrease the chance of a lockout. Rotating the encryption certificate used by CSS can be done in two steps:

1. Provision the new certificate onto your compute. It should be placed on all nodes. At this time, do not stop the provisioning of the previous encryption certificate.
2. Start a cluster configuration upgrade to change `"EncryptionCertificateThumbprint"` to the SHA-1 thumbprint of the new certificate.

Once this cluster upgrade has completed, all new secrets that are enrolled in CSS will be encrypted against the new certificate. CSS will begin to goal-chase the re-encryption of its current store to the new target certificate. CSS will eventually converge to a state where its entire store in encrypted against the new certificate. It is important that the previous encryption certificate remains available to CSS for the duration of this transition.

## Removing Central Secret Service from your cluster
Removing Central Secret Service from a deployed cluster can be accomplished in two upgrades. The first upgrade functionally disables CSS, while the second upgrade removes the service from the cluster, including permanent deletion of the underlying replicated store. Two-stage deletion prevents accidental deletion of the service, and helps ensure that there are no orphaned dependencies on CSS during the removal process. This feature is available from SF version 8.0 onward.

### Step 1
Upgrade cluster definition from `"IsEnabled" = "true"` or from `"DeployedState" = "enabled"` to
```json
{
    "name":  "DeployedState",
    "value":  "removing"
}
```
Once Central Secret Service is in deployed state `Removing`, it will reject all secret management calls that come to it via its public APIs, and service activations which include SecretStoreRefs or KeyVaultReferences. If there are still application or components which depend on CSS, it is expected that they will go unhealthy. If this occurs, the upgrade to deployed state `Removing` should be rolled back, or if it has succeeded, a new upgrade to change back to deployed state `Enabled` should be pushed by the operator through the cluster. 

If Central Secret Service receives a request while in deployed state `Removing`, it will return HTTP Code 401 (unauthorized) and put itself in a Warning health state.

### Step 2
Upgrade cluster definition from `"DeployedState" = "removing"` to
```json
{
    "name":  "DeployedState",
    "value":  "disabled"
}
```
At this point, Central Secret Service should no longer be running in the cluster, and will not be in the list of system services. At this point the underlying replicated store no longer exists, and any secrets still enrolled in it are lost.

## Next steps
Learn more about [application and service security](service-fabric-application-and-service-security.md).

Get introduced to [Managed Identity for Service Fabric Applications](concepts-managed-identity.md).

Expand CSS's functionality with [KeyVaultReferences](service-fabric-keyvault-references.md)
