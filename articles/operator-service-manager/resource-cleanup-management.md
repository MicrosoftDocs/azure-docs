---
title: Publisher resource cleanup management best practices
description: Learn about best practices to manage publisher resource cleanup with Azure Operator Service Manager.
author: msftadam
ms.author: adamdor
ms.date: 09/08/2025
ms.topic: concept-article
ms.service: azure-operator-service-manager
---

# Publisher resource cleanup management
Managing publisher resources is difficult. It's hard to tell if they are still being used and they take up alot of space. This article describes new Azure Operator Service Manager (AOSM) features which detect unused artifacts and automate publisher resource cleanup. These features help to reduze size of resource storage, lowering overall service costs. These feature also help to improve security, by purging unneccesary resources, preventing further access or tampering.

## Introduction 
The general best practice to cleanup AOSM publisher resources is to first execute an ARG query against a target resource to check for remaining references by any other resources. For example, check to see if a Network Service Design Version (NSDV) is still referenced by any Site Network Services (SNS). If the ARG query responds with no references, then second, delete the target resource. While most resource types support discovery of references via quering, before this feature artifact references could not be determined, making artifact cleanup challenging.

## Problem statement 
To make artifact cleanup more reliable and less error prone, the following shortcomings have been identified in resource provider API versions before 2025-03-30:
* NSDV and NFDV have only artifact-store references, making querying for discovery of artifact references impossible.
* Artifacts which are directly uploaded to artifact-store backing ACR do not build any references to the artifact-store.  
* Where helm charts reference artifacts in non-Azure ACRs, it's difficult to figure out current references current using queries. 

## Solution statement 
After resource provider API version 2025-03-30, AOSM will support quering on AOSM artifacts to discover any remaining references, and if none are found, will delete the unused artifacts. The artifacts, including helm charts or images, are easily identifyable as unused, implying they're not referenced by any NFDVs or NSDVs. The resource type `artifact-manifest` will be expanded to promote cohesive grouping of artifacts per version. All images used by one nfApp are kept in one artifact manifest version. This will build connections between artifacts and nfApps which are used by ARG queries to identify unused  resources.

## Changes to support Artifact Manifest
In order to support the expanded `artifact-manifest` resource type, a number of changes have been introduced in resource provider API version 2025-03-30. The following sections describes the behavior of AOSM before and after implementing this change. Note that migration to this new resource type is optional, but all versions after 2025-03-30 will include this support.

### Artifact Manifest strong correlation
The `artifact manifest` resource type will now have strong correlation to helm artifact (images and charts) uploaded into an artifact-store backing ACR. All artifacts used by a nfAPp will be kept in one uniquely versioned artifact manifest. This will help build connections between images and chart. 

#### Before 2025-03-30 
A requirement for the expanded resource type fields this was not enforced.

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

#### From 2025-03-30
The expanded `artifact-manifest` resource type field are supported and enforced by checking for the artifacts in manifest path version repositories. No change in artifact manifest body. 

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
The `artifact manifest` resource type will now support scope map tokens, created at the same time as the `artifact manifest` and include artifacts names in the path. 

#### Before 2025-03-30 
No scope map tokens were support.

#### From 2025-03-30
Scope map tokens now created at the same time as expanded `artifact manifest`.

### Artifact Manifest upload path
All images which belong to an `artifact manifest` will need to be uploaded with the `artifact manifest` name and verion in path. For example, ngnix under artifact manifest (cnfmanifest) needs to be uploaded as (cnfmanifest/ngnix) 

#### Before 2025-03-30 
No requirement for pathing of artifacts in `artifact-manifest` resource type.

#### From 2025-03-30
Pathing required for artifacts in `artifact-manifest` resource type.

### Artifact Manifest untag on delete
Deletion of an `artifact manifest` resource type will untag all artifacts contained in that manifest version.

#### Before 2025-03-30 
No changes made in the backing ACR for an artifact-store when deleting an `artifact manifest` resource type. 

#### From 2025-03-30
Artifacts will now be untaggeed in the backing ACR for an artifact-store when deleting an `artifact manifest` resource type.

### Artifact Manifest untag on delete
The `artifact manifest` resource type can be deleted only if no refererring resources remain associated.

#### Before 2025-03-30 
No such condition was enforceed.

#### From 2025-03-30
Must first delete resource references before deleted an `artifact-manifest` resource type.

### Artifact Manifest purge untagged
Support the use of AZ CLI command `az acr purge` with appropriate parameters to purge untagged artifacts at the appropriate time. 

#### Before 2025-03-30 
The untagged methodology to purge artifacts is not supported.

#### From 2025-03-30
The following command is used to purge artifacts:

```azurecli
az acr manifest list-metadata -n myRegistry –r myRepository --query "[?tags[0]==null].digest" -o tsv | %{ az acr repository delete -n myRegistry -image myRepository@$_ --yes }
```

### NDSV/NFDV manifest reference
After resource provider API version 2025-03-30, NSDV and NFDV will include reference to expanded `artifact-manifest` resource type.

#### Before 2025-03-30 
The following is an example reference for the old `artifact-manifest` resource type.

```json
 "artifactStore": { 
    "id": "/subscriptions/fb080551f560-461a-9b1107d3738b4f1b/resourceGroups/manifestpoc/providers/Microsoft.HybridNetwork/publishers/PipelineTestPublisher/artifactStores/as "
 }
```

#### From 2025-03-30
The following is an example reference for the new `artifact-manifest` resource type.

```json
 "artifactStore": { 
    "id": "/subscriptions/fb080551-f560461a-9b1107d3738b4f1b/resourceGroups/manifestpoc/providers/Microsoft.HybridNetwork/publishers/PipelineTestPublisher/artifactStores/as/artifactManifests/cnfmanifest"   } 
```

### NDSV/NFDV API version
After resource provider API version 2025-03-30, the referred `artifact-manifest` in NSDV or NFDV must be created with 2025-03-30 version or higher.

#### Before 2025-03-30 
No such restriction.

#### From 2025-03-30
API version restriction for creation of `artifact-manifest` resource types is enforced.

## Migration to 2025-03-30 and beyond.

In order to migrate to the expanded `artifact manifest` usage available in resource provider API version 2025-03-30 or later, complete the following suggested tasks:
* Prepare platform by installing NFO extension version 3.0.3131-220 or later.
* These changes will help to recognize decommissioned artifacts and will be applicable with new API version. For existing resources created with older API’s, the NSDV’s and NFDV’s should be updated to newer API version by changing artifact store references to artifact manifest references and artifact manifests should reference all the related references. 
* The publisher cleanup would only apply to resources created with 2025-03-30(NSDV,NFDV,artifact manifest). Resources created in older version can be updated to 2025-03-30 version. Only artifacts uploaded after the upgrade are considered for cleanup. Artifacts uploaded before the upgrade are not considered for clean-up

> [!NOTE]
> Resources created with NSDV and NFDV, which still have reference to artifact stores instead of artifact manifests, cannot be used to find out decommissioned artifacts unless they are upgraded.
