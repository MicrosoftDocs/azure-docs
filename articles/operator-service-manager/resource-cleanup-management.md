---
title: Publisher resource clean-up management with Azure Operator Service Manager
description: Learn about best practices to manage publisher resource clean-up with Azure Operator Service Manager.
author: msftadam
ms.author: adamdor
ms.date: 09/08/2025
ms.topic: concept-article
ms.service: azure-operator-service-manager
---

# Publisher resource clean-up management
Managing publisher resources is difficult. It's hard to tell if they're still being used and they take up expensive storage space. This article describes new Azure Operator Service Manager (AOSM) features that detect unused artifacts and automate publisher resource clean-up. These features help to reduce size of resource storage, lowering overall service costs. These features also help to improve security, by purging unnecessary resources, preventing further access or tampering.

## Publisher resource clean-up use-case 
The general best practice to clean-up AOSM publisher resources is to first execute an Azure Resource Graph (ARG) query against a target resource to check for remaining references by any other resources. For example, check to see if a Network Service Design Version (NSDV) is referenced in any Site Network Services (SNS). If the ARG query responds with no references, then second, delete the target resource. While most resource types support discovery of references via querying, before these features artifact references couldn't be determined, making artifact clean-up challenging.

## Publisher resource clean-up issues 
To make artifact clean-up more reliable and less error prone, this new feature looks to address shortcomings identified in resource provider API versions before `2025-03-30`:
* NSDV and NFDV have only artifact-store references, making querying for discovery of artifact references impossible.
* Artifacts that are directly uploaded to artifact-store backing Azure Container Registry (ACR) don't build any references to the artifact-store.  
* Where helm charts reference artifacts in non-Azure ACRs, it's difficult to figure out current references current using queries. 

## Publisher resource clean-up expanded specification
After resource provider API version `2025-03-30`, AOSM will support querying on AOSM artifacts to discover any remaining references, and if none are found, will delete the unused artifacts. The artifacts, including helm charts or images, are easily identifiable as unused, implying they contain no references in any Network Function Design Version (NFDV) or NSDV. The resource type `artifact-manifest` is expanded to promote cohesive grouping of artifacts per version. All images used by one nfApp are kept in one artifact manifest version. This change builds connections between artifacts and nfApps that are used by ARG queries to identify unused resources.

## Artifact manifest resource type changes
In order to support the expanded `artifact-manifest` resource type, changes are introduced in resource provider API version `2025-03-30`. The following sections describe the behavior of AOSM before and after implementing this change. Migration to this new resource type is optional, but all versions after `2025-03-30` include this support.

### Artifact manifest uses strong correlation
The `artifact manifest` resource type has a strong correlation to helm artifacts (images and charts) uploaded into an artifact-store backing ACR. All artifacts used by a nfApp are kept uniquely versioned artifact manifest instances. This builds reference connections between artifacts and nfApps. 

#### Before `2025-03-30` 
No strong correlation exists in the `artifact manifest` resource type.

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
The expanded `artifact manifest` resource type checks artifacts in `artifact manifest` path. No change in `artifact manifest` body. 

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

#### From `2025-03-30`
Scope map tokens are created at the same time as the `artifact manifest`.

### Artifact manifest upload path
All images that belong to an `artifact manifest` are uploaded using the `artifact manifest` name in the target path. For example, given ngnix included in `artifact manifest` 'cnfmanifest' needs to be uploaded using path 'cnfmanifest/ngnix'. 

#### Before `2025-03-30` 
No pathing requirements when uploading artifacts.

#### From `2025-03-30`
Pathing requirements enforced for artifacts in `artifact-manifest` resource type.

### Artifact manifest untag to delete
Deletion of an `artifact manifest` resource type untags all artifacts contained in that manifest version.

#### Before `2025-03-30` 
No changes made in the backing ACR for an artifact-store when deleting an `artifact manifest` resource type. 

#### From `2025-03-30`
Artifacts are untagged in the artifact-store backing ACR when deleting an `artifact manifest` resource type.

### Artifact manifest deletion conditions
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

### NDSV/NFDV updated artifact manifest reference
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

### NDSV/NFDV API version
The NSDV and NFDV referenced `artifact manifest` must be created with `2025-03-30` version or higher.

#### Before `2025-03-30` 
No such restriction.

#### From `2025-03-30`
The proper API version must be used to create the `artifact manifest` resource types.

## Expanded artifact manifest migration steps
Complete the following task to migrate a deployed `artifact manifest` resource, created before API version '20025-03-30', to the new `artifact manifest` resource type, available after API version `2025-03-30` or later:
* Prepare platform by installing network function operator (NFO) extension version, at least 3.0.3131-220 or later.
* For existing resources created with older APIs, the NSDVs, NFDVs, and `artifact-manifest` should be updated to newer API version.
  * First change the artifact store references to `artifact-manifest` references.
  * Then update the `artifact-manifests` with the expanded artifact references.
  * Finally upload the artifacts to the proper `artifact-manifest` path. 
* The publisher clean-up action only supports resources created with API version `2025-03-30`
  * Resources created in older version can be updated to `2025-03-30` version.
  * Only artifacts uploaded after the upgrade are considered for clean-up.
  * Artifacts uploaded before the upgrade aren't considered for clean-up

> [!NOTE]
> Resources created with NSDV and NFDV, which still have reference to artifact stores instead of artifact manifests, can't be used to find out decommissioned artifacts unless they're upgraded.
