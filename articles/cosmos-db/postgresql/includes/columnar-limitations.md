---
author: jonels-msft
ms.author: jonels
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: include
ms.date: 01/25/2023
---

* Compression is on disk, not in memory
* Append-only (no UPDATE/DELETE support)
* No space reclamation (for example, rolled-back transactions may still consume
  disk space)
* No index support, index scans, or bitmap index scans
* No tidscans
* No sample scans
* No TOAST support (large values supported inline)
* No support for ON CONFLICT statements (except DO NOTHING actions with no
  target specified).
* No support for tuple locks (SELECT ... FOR SHARE, SELECT ... FOR UPDATE)
* No support for serializable isolation level
* Support for PostgreSQL server versions 12+ only
* No support for foreign keys, unique constraints, or exclusion constraints
* No support for logical decoding
* No support for intra-node parallel scans
* No support for AFTER ... FOR EACH ROW triggers
* No UNLOGGED columnar tables
* No TEMPORARY columnar tables
