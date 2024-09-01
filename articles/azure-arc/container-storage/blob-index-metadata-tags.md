---
title: Blob index and metadata tags
description: Learn about blob index and metadata tags in Edge Volumes.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.custom: linux-related-content
ms.date: 08/26/2024
---

# Blob index and metadata tags

Cloud Ingest Edge Volumes now supports the ability to generate blob index tags and blob metadata tags directly from Azure Container Storage enabled by Azure Arc. This process involves incorporating extended attributes to the files within your Cloud Ingest Edge Volume, where Edge Volumes translates that into your selected index or metadata tag.

## Blob index tags

To generate a blob index tag, create an extended attribute using the prefix `azindex`, followed by the desired key and its corresponding value for the index tag. Edge Volumes subsequently propagates these values to the blob, appearing as the key matching the value.

> [!NOTE]
> Index tags are only supported for non-hierarchical namespace (HNS) accounts.

### Example 1: index tags

The following example creates the blob index tag `location=chicagoplant2` on `logfile1`:

```bash
$ attr -s azindex.location -V chicagoplant2 logfile1
Attribute "azindex.location" set to a 13 byte value for logfile1:
chicagoplant2
```

### Example 2: index tags

The following example creates the blob index tag `datecreated=1705523841` on `logfile2`:

```bash
$ attr -s azindex.datecreated -V $(date +%s) logfile2
Attribute " azindex.datecreated " set to a 10 byte value for logfile2:
1705523841
```

## Blob metadata tags

To generate a blob metadata tag, create an extended attribute using the prefix `azmeta`, followed by the desired key and its corresponding value for the metadata tag. Edge Volumes subsequently propagates these values to the blob, appearing as the key matching the value.

> [!NOTE]
> Metadata tags are supported for HNS and non-HNS accounts.

> [!NOTE]
> HNS blobs also receive `x-ms-meta-is_adls=true` to indicate that the blob was created with Datalake APIs.

### Example 1: metadata tags

The following example creates the blob metadata tag `x-ms-meta-location=chicagoplant2` on `logfile1`:

```bash
$ attr -s azmeta.location -V chicagoplant2 logfile1
Attribute "azmeta.location" set to a 13 byte value for logfile1:
chicagoplant2
```

### Example 2: metadata tags

The following example creates the blob metadata tag `x-ms-meta-datecreated=1705523841` on `logfile2`:

```bash
$ attr -s azmeta.datecreated -V $(date +%s) logfile2
Attribute " azmeta.datecreated " set to a 10 byte value for logfile2:
1705523841
```

## Next steps

[Azure Container Storage enabled by Azure Arc overview](overview.md)
