---
title: Publisher resource clean-up management with Azure Operator Service Manager
description: Learn about best practices to manage publisher resource clean-up with Azure Operator Service Manager.
author: msftadam
ms.author: adamdor
ms.date: 09/19/2025
ms.topic: concept-article
ms.service: azure-operator-service-manager
---

# Publisher resource clean-up management
This article describes a new Azure Operator Service Manager (AOSM) feature that detects unused publisher artifacts and automates resource deletion. This feature helps to reduce the size of resource storage, lowering overall service costs. This feature also improves security, by purging unnecessary resources in a timely manner, preventing further access, or potential tampering.

## Publisher resource clean-up historic approach 
Before this feature, to clean-up AOSM publisher resources a user first executes an Azure Resource Graph (ARG) query to check for in-use references of target resources. For example, check to see if a Network Service Design Version (NSDV) is still used by a Site Network Services (SNS). If the ARG query responds with no references, then the user executes a command to delete the target resource. While most resource types support reference discovery, artifact references in an artfact-store didn't, making safe artifact clean-up challenging. Other historic shortcomings include:
* NSDV and NFDV have only artifact-store references, making querying for discovery of artifact references impossible.
* Artifacts directly uploaded to artifact-store backing Azure Container Registry (ACR) don't build any references.  
* Where helm charts reference artifacts in non-Azure ACRs, it's difficult to figure out references. 

## Publisher resource clean-up new approach
This feature introduces an automated two-step process that first untags, and then later purges, unused artifacts when a `artifact manifest` is deleted. To support this capability, the `artifact-manifest` resource type is expanded to include references between an artifact, such as a helm chart or container image, and other resources, such as Network Function Design Version (NFDV) or NSDV. 

Upon attempted deletion of an `artifact manifest`, these references are checked to ensure the artifact isn't associated to any in-use resources. If this validation passes, artifacts are marked for deletion (untagged) and a success message is returned. If this validation fails, the deletion request results in a failure and returns an error message indicating the artifact found to be in-use, along with the resource which still using it. The following snippet is an example of a failure message:

```azurecli
The resource '<artifactmanifest resourceId>' has some resources attached to it. The dependent resources are :"<NSDV/NFDV resource ids>"
```

To purge the untagged artifacts, an Azure CLI command must be run. This command is administrator executed, automated via a customer pipeline, or time-based scheduled using crontab. This delayed purge operation allows for extra time to manually validate the deletion accuracy or simply creates a buffer for a delete request to be reverted.

## Changes to artifact manifest resource type
In order to support the expanded `artifact-manifest` resource type specifications, changes are introduced to the resource provider API, starting with version `2025-03-30`. The following sections describe the behavior of AOSM before, and after, implementing this feature change. Migration to this new expanded resource type is optional and migration is discussed laster in this article.

### Artifact manifest uses strong correlation
The `artifact manifest` resource type has a strong correlation to helm artifacts (images and charts) uploaded into an artifact-store backing ACR. All artifacts used by a nfApp are kept in uniquely versioned artifact manifest instances. This builds reference connections between artifacts and nfApps. 

#### Before `2025-03-30` 
No strong correlation exists in the `artifact manifest` resource type.

**Repositories**
* nginx
* testapp

```json
"artifacts": [ 
            { 
                "artifactName": "testapp", 
                "artifactType": "OCIArtifact", 
                "artifactVersion": "1.0.0" 
            }, 
            { 
                "artifactName": "nginx", 
                "artifactType": "OCIArtifact", 
                "artifactVersion": "1.0.0" 
            } 
```

#### From `2025-03-30`
The `artifact manifest` resource type checks artifacts in `artifact manifest` path. No change in `artifact manifest` body. 

**Repositories**
* cnfmanifest/nginx
* cnfmanifest/testapp

```json
"artifacts": [ 
            { 
                "artifactName": "testapp", 
                "artifactType": "OCIArtifact", 
                "artifactVersion": "1.0.0" 
            }, 
            { 
                "artifactName": "nginx", 
                "artifactType": "OCIArtifact", 
                "artifactVersion": "1.0.0" 
            } 
        ]
```

### Artifact manifest scope map token
The `artifact manifest` resource type creates scope map tokens with artifact name included in the path. 

#### Before `2025-03-30` 
No scope map tokens were created.

**Repositories**
* nginx
* testapp

#### From `2025-03-30`
Scope map tokens with path are created at the same time as the `artifact manifest`.

**Repositories**
* cnfmanifest/nginx
* cnfmanifest/testapp

### Artifact manifest upload path
All images that belong to an `artifact manifest` are uploaded using the `artifact manifest` name in the target path. 

#### Before `2025-03-30` 
No pathing requirements when uploading artifacts.

**Repositories**
* nginx
* testapp

#### From `2025-03-30`
Pathing requirements enforced for artifacts in `artifact-manifest` resource type.

**Repositories**
* cnfmanifest/nginx
* cnfmanifest/testapp
  
### Artifact manifest untag to delete
Deletion of an `artifact manifest` resource type untags all artifacts contained in that manifest version.

#### Before `2025-03-30` 
No changes made in the backing ACR for an artifact-store when deleting an `artifact manifest` resource type. 

#### From `2025-03-30`
Artifacts are untagged in the artifact-store backing ACR when deleting an `artifact manifest` resource type.

### Artifact manifest deletion condition
The `artifact manifest` resource type can be deleted only if no referring resources are associated.

#### Before `2025-03-30` 
No condition prevented deletion of `artifact manifest` resource type.

#### From `2025-03-30`
For successful deletion, the `artifact manifest` must not contain any tagged resource references.

### Artifact manifest purge untagged
Purge untagged artifacts using Azure CLI command `az acr purge` given appropriate scheduling parameters.

#### Before `2025-03-30` 
No condition prevented purging of deleted artifacts.

#### From `2025-03-30`
The following Azure CLI command can be used to purge artifacts. The command can be scheduled via crontab or run on-demand.

```azurecli
az acr manifest list-metadata -n myRegistry –r myRepository --query "[?tags[0]==null].digest" -o tsv | %{ az acr repository delete -n myRegistry -image myRepository@$_ --yes }
```

### NSDV/NFDV updated artifact manifest reference
NSDV and NFDV include reference to `artifact manifest` resource type.

#### Before `2025-03-30` 
The NSDV and NFDV reference the artfact-store resource type.

```json
 "artifactStore": { 
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testgroup/providers/Microsoft.HybridNetwork/publishers/testpublisher/artifactStores/as "
 }
```

#### From `2025-03-30`
The NSDV and NFDV reference the `artfact manifest` resource type.

```json
 "artifactStore": { 
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testgroup/providers/Microsoft.HybridNetwork/publishers/testpublisher/artifactStores/as/artifactManifests/cnfmanifest"   } 
```

### NSDV/NFDV API version
The NSDV and NFDV referenced `artifact manifest` must be created with `2025-03-30` version or higher.

#### Before `2025-03-30` 
No such restriction.

#### From `2025-03-30`
The proper API version must be used to create the `artifact manifest` resource types.

## Migrating to the new artifact manifest 
Use the following task list to migrate a deployed `artifact manifest` resource, created before API version `20025-03-30`, to the new `artifact manifest` resource type, available after API version `2025-03-30`:
* Prepare platform by installing network function operator (NFO) extension version `3.0.3131-220` or later.
* For existing resources created with older APIs, the NSDVs, NFDVs, and `artifact manifest` should be updated to newer API version.
  * First change the artifact store references to `artifact manifest` references.
  * Then update the `artifact manifests` with the expanded artifact references.
  * Finally upload the artifacts to the proper `artifact manifest` path. 
* The publisher clean-up action only supports resources created with API version `2025-03-30`
  * Resources created in older version can be updated to `2025-03-30` version.
  * Only artifacts uploaded after the upgrade are considered for clean-up.
  * Artifacts uploaded before the upgrade aren't considered for clean-up

> [!NOTE]
> Resources created with NSDV and NFDV, which still have reference to artifact stores instead of artifact manifests, can't be used to find out decommissioned artifacts unless they're upgraded.

## Query to discover artifact manifest reference
The following ARG query can be used to list all NFDVs or NSDVs which contain artifact-manifest references. If a resource appears in this output, an attempt to delete the artifact manifest fails.
```powershell
resources
 | where type == "microsoft.hybridnetwork/publishers/networkfunctiondefinitiongroups/networkfunctiondefinitionversions" or type  == "microsoft.hybridnetwork/publishers/networkservicedesigngroups/networkservicedesignversions"
 | where properties contains "<artifactmanifestresoruceid>"
 | project id,subscriptionId,resourceGroup
```

Optionally, to query on a specific NFDV or NSDV, insert a reference into the query with the resource ID.
```powershell
resources
 | where type == "microsoft.hybridnetwork/publishers/networkfunctiondefinitiongroups/networkfunctiondefinitionversions" or type  == "microsoft.hybridnetwork/publishers/networkservicedesigngroups/networkservicedesignversions"
 | where id == "nfdv id" or id == "nsdv id"
 | where properties contains "<artifactmanifestresoruceid>"
 | project id,subscriptionId,resourceGroup
```
