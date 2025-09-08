---
title: Publisher resource clean-up management best practices
description: Learn about best practices to manage publisher resource clean-up with Azure Operator Service Manager.
author: msftadam
ms.author: adamdor
ms.date: 09/08/2025
ms.topic: concept-article
ms.service: azure-operator-service-manager
---

# Publisher resource clean-up management
Managing publisher resources is difficult. It's hard to tell if they're still being used and they take up expensive storage space. This article describes new Azure Operator Service Manager (AOSM) features that detect unused artifacts and automate publisher resource clean-up. These features help to reduce size of resource storage, lowering overall service costs. These features also help to improve security, by purging unnecessary resources, preventing further access or tampering.

## Introduction 
The general best practice to clean-up AOSM publisher resources is to first execute an Azure Resource Graph (ARG) query against a target resource to check for remaining references by any other resources. For example, check to see if a Network Service Design Version (NSDV) is referenced in any Site Network Services (SNS). If the ARG query responds with no references, then second, delete the target resource. While most resource types support discovery of references via querying, before these features artifact references couldn't be determined, making artifact clean-up challenging.

## Problem statement 
To make artifact clean-up more reliable and less error prone, this new feature looks to address shortcomings identified in resource provider API versions before `2025-03-30`:
* NSDV and NFDV have only artifact-store references, making querying for discovery of artifact references impossible.
* Artifacts that are directly uploaded to artifact-store backing Azure Container Registry (ACR) don't build any references to the artifact-store.  
* Where helm charts reference artifacts in non-Azure ACRs, it's difficult to figure out current references current using queries. 

## Solution statement 
After resource provider API version `2025-03-30`, AOSM will support querying on AOSM artifacts to discover any remaining references, and if none are found, will delete the unused artifacts. The artifacts, including helm charts or images, are easily identifiable as unused, implying they contain no references in any Network Function Design Version (NFDV) or NSDV. The resource type `artifact-manifest` is expanded to promote cohesive grouping of artifacts per version. All images used by one nfApp are kept in one artifact manifest version. This change builds connections between artifacts and nfApps that are used by ARG queries to identify unused resources.

## Changes to support Artifact Manifest
In order to support the expanded `artifact-manifest` resource type, changes are introduced in resource provider API version `2025-03-30`. The following sections describe the behavior of AOSM before and after implementing this change. Migration to this new resource type is optional, but all versions after `2025-03-30` will include this support.

### Artifact Manifest strong correlation
The `artifact manifest` resource type has a strong correlation to helm artifact (images and charts) uploaded into an artifact-store backing ACR. All artifacts used by a nfApp are kept in one uniquely versioned artifact manifest. This builds connections between images and chart. 

#### Before `2025-03-30` 
A requirement for the expanded resource type fields wasn't enforced.

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
The expanded `artifact-manifest` resource type fields are supported and enforced by checking for the artifacts in manifest path version repositories. No change in artifact manifest body. 

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

### Artifact Manifest scope map token
The `artifact manifest` resource type supports scope map tokens, created at the same time as the `artifact manifest` and include artifacts names in the path. 

#### Before `2025-03-30` 
No scope map tokens were support.

#### From `2025-03-30`
Scope map tokens now created at the same time as expanded `artifact manifest`.

### Artifact Manifest upload path
All images that belong to an `artifact manifest` need to be uploaded with the `artifact manifest` name and version in path. For example, ngnix under artifact manifest (cnfmanifest) needs to be uploaded as (cnfmanifest/ngnix) 

#### Before `2025-03-30` 
No requirement for pathing of artifacts in `artifact-manifest` resource type.

#### From `2025-03-30`
Pathing required for artifacts in `artifact-manifest` resource type.

### Artifact Manifest untag on delete
Deletion of an `artifact manifest` resource type untags all artifacts contained in that manifest version.

#### Before `2025-03-30` 
No changes made in the backing ACR for an artifact-store when deleting an `artifact manifest` resource type. 

#### From `2025-03-30`
Artifacts are untagged in the backing ACR for an artifact-store when deleting an `artifact manifest` resource type.

### Artifact Manifest untag on delete
The `artifact manifest` resource type can be deleted only if no referring resources remain associated.

#### Before `2025-03-30` 
No such condition was enforced.

#### From `2025-03-30`
Must first delete resource references before deleted an `artifact-manifest` resource type.

### Artifact Manifest purge untagged
Purge untagged artifacts at the appropriate time using Azure CLI command `az acr purge` with the appropriate parameters.

#### Before `2025-03-30` 
The untagged methodology to purge artifacts isn't supported.

#### From `2025-03-30`
The following command is used to purge artifacts:

```azurecli
az acr manifest list-metadata -n myRegistry –r myRepository --query "[?tags[0]==null].digest" -o tsv | %{ az acr repository delete -n myRegistry -image myRepository@$_ --yes }
```

### NDSV/NFDV manifest reference
After resource provider API version `2025-03-30`, NSDV and NFDV will include reference to expanded `artifact-manifest` resource type.

#### Before `2025-03-30` 
The following reference is an example for the old `artifact-manifest` resource type.

```json
 "artifactStore": { 
    "id": "/subscriptions/fb080551f560-461a-9b1107d3738b4f1b/resourceGroups/manifestpoc/providers/Microsoft.HybridNetwork/publishers/PipelineTestPublisher/artifactStores/as "
 }
```

#### From `2025-03-30`
The following reference is an example for the new `artifact-manifest` resource type.

```json
 "artifactStore": { 
    "id": "/subscriptions/fb080551-f560461a-9b1107d3738b4f1b/resourceGroups/manifestpoc/providers/Microsoft.HybridNetwork/publishers/PipelineTestPublisher/artifactStores/as/artifactManifests/cnfmanifest"   } 
```

### NDSV/NFDV API version
After resource provider API version `2025-03-30`, the referred `artifact-manifest` in NSDV or NFDV must be created with `2025-03-30` version or higher.

#### Before `2025-03-30` 
No such restriction.

#### From `2025-03-30`
API version restriction for creation of `artifact-manifest` resource types is enforced.

## Migration to `2025-03-30` and beyond.

In order to migrate to the expanded `artifact manifest` usage available in resource provider API version `2025-03-30` or later, complete the following suggested tasks:
* Prepare platform by installing network function operator (NFO) extension version 3.0.3131-220 or later.
* These changes help to recognize decommissioned artifacts. For existing resources created with older APIs, the NSDVs and NFDVs should be updated to newer API version. First change the artifact store references to `artifact-manifest` references. Then update the `artifact-manifests` withe the required expanded references. 
* The publisher clean-up would only apply to resources created with `2025-03-30` (NSDV, NFDV, artifact manifest). Resources created in older version can be updated to `2025-03-30` version. Only artifacts uploaded after the upgrade are considered for clean-up. Artifacts uploaded before the upgrade aren't considered for clean-up

> [!NOTE]
> Resources created with NSDV and NFDV, which still have reference to artifact stores instead of artifact manifests, can't be used to find out decommissioned artifacts unless they're upgraded.
