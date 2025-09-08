---
title: Publisher resource cleanup management best practices
description: Learn about best practices for resource management cleanup with Azure Operator Service Manager.
author: msftadam
ms.author: adamdor
ms.date: 09/08/2025
ms.topic: concept-article
ms.service: azure-operator-service-manager
---

# Publisher resource cleanup management
Managing publisher resources is difficult. They take up alot of space. It's hard to tell if they are still being used.

## Introduction 
To cleanup AOSM resources, ARG queries are used to find if a target resource is referenced in other resource, E.g., NSDV is referenced in any SNS. When references are none, implies the target resource can be deleted.  As of today, usage of artifacts cannot be determined from AOSM resource references and artifact cleanup becomes a challenge. Rest of the resource-types usage is identifiable. This document describes updates in AOSM service to allow detecting unused artifacts and its cleanup.

## Current Problem: 
• Currently all other unused publisher resource types are identifiable through ARG queries (as shown in appendix below). 
• As NSDV and NFDV have only artifact store references, it becomes difficult to write ARG queries to find out which artifacts are decommissioned. 
• There could also be cases where artifacts are uploaded to backing ACR but does not have any mentionin the artifact store.  
• Helm charts can have references to other images in same ACR which might be difficult to figure out using current structure using ARG queries. 

## Goal 
Allow listing unused AOSM artifacts and support deleting them. Easily identifying “decommissioned” artifacts (helm charts and images), as referred by the NFDVs and NSDVs.

## Recommendation 
Use artifact manifest for cohesive artifacts. Implies, all images used by a chart keep them in one artifact manifest. This will help build connections between images and chart. For identifying unused AOSM resources, use ARG queries as shared ARG query. 

## Changes to support Artifact Manifest

### Artifact Manifest strong correlation
Artifact manifest will have strong correlation to images/charts being uploaded to backing ACR. All images used by a chart keep them in one artifact manifest. This will help build connections between images and chart. 

#### Before 2025-03-30 
A requirement this was not enforced.

```json
artifacts": [ 
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
Enforcement done at download time by checking for images in manifest path repositories. No change in artifact manifest body 

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
Artifact Manifest scope map tokens will be created with artifact manifest name along with images names in the path. 

#### Before 2025-03-30 

#### From 2025-03-30

### Artifact Manifest upload path
All images which belong to an artifact manifest will need to be uploaded with artifact manifest name in path( ex: ngnix under artifact manifest (cnfmanifest)needs to be uploaded as cnfmanifest/ngnix) 

#### Before 2025-03-30 

#### From 2025-03-30

### Artifact Manifest untag on delete
Deletion of artifact manifest will untag the images. 

#### Before 2025-03-30 
No change in the backing ACR 

#### From 2025-03-30
Images/charts/templates will be untagged 

### Artifact Manifest untag on delete
Artifact manifest can be deleted only if there are no referring NSDV/NFDV’s to it

#### Before 2025-03-30 
No such condition. 

#### From 2025-03-30
Cannot delete manifest with NSDV/NFDV’s referring to it. 

### Artifact Manifest purge untagged
Use “az acr purge” with appropriate parameters to delete untagged manifests later. 

#### Before 2025-03-30 
Cannot use untagged methodology to purge images.

#### From 2025-03-30
SP needs to use similar command:

```azurecli
az acr manifest list-metadata -n myRegistry –r myRepository --query "[?tags[0]==null].digest" -o tsv | %{ az acr repository delete -n myRegistry -image myRepository@$_ --yes }
```

### NDSV/NFDV manifest reference
NSDV and NFDV will refer to artifact manifest going forward from 2025-03-30 API version onwards.

#### Before 2025-03-30 

```json
 "artifactStore": { 
    "id": "/subscriptions/fb080551f560-461a-9b1107d3738b4f1b/resourceGroups/manifestpoc/providers/Microsoft.HybridNetwork/publishers/PipelineTestPublisher/artifactStores /as "
 }
```

#### From 2025-03-30
```json
 "artifactStore": { 
    "id": "/subscriptions/fb080551-f560461a-9b1107d3738b4f1b/resourceGroups/ manifestpoc/providers/ Microsoft.HybridNetwork/publishers /PipelineTestPublisher/artifactStores /as/artifactManifests/cnfmanifest"   } 
```

### NDSV/NFDV API version
The artifact manifests referred needs to be created with 2025-03-30 version for it to be referred in the NSDV and NFDV. 

#### Before 2025-03-30 
No such restriction

#### From 2025-03-30
Now supported.

## Migration 
Install new version of compliant NFO 

These changes will help to recognize decommissioned artifacts and will be applicable with new API version. For existing resources created with older API’s, the NSDV’s and NFDV’s should be updated to newer API version by changing artifact store references to artifact manifest references and artifact manifests should reference all the related references. 

The publisher cleanup would only apply to resources created with 2025-03-30(NSDV,NFDV,artifact manifest). Resources created in older version can be updated to 2025-03-30 version. Only artifacts uploaded after the upgrade are considered for cleanup. Artifacts uploaded before the upgrade are not considered for clean-up

## Out Of Scope 
Resources created with NSDV’s and NFDV’s which still have references to artifact stores instead of artifact manifests cannot be used to find out decommissioned artifacts unless they are upgraded to new version. 
 
