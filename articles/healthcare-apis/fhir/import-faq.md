---
title: $import FAQ for FHIR service
description: Learn how to interpret FHIR $import diagnostics and locate the source NDJSON record that caused an import error.
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: faq
ms.date: 10/23/2026
ms.author: kesheth
---

# $import FAQ for the FHIR service

Use this FAQ to interpret `$import` diagnostics and locate the NDJSON record that caused an import error.

## How do I locate the NDJSON record identified by a stream start offset and line number?

An import error can include diagnostics similar to the following example:

```text
Failed to process resource at line: 54 with stream start offset: 60000000
```

The `stream start offset` is the byte position in the source input file where the FHIR service started processing a data unit. The `line` value is the one-based line number within that data unit, not the absolute line number in the source file. The FHIR service splits input files into data units that it processes independently and in parallel. For more information, see [Performance considerations](import-data.md#performance-considerations).

To locate the record:

1. Use the exact source blob that the import operation processed. Verify its ETag against the ETag in the import request, if you provided one. Don't change its encoding or line endings before you locate the record.
1. Seek to the reported byte position in the source file. Use a byte-aware tool; don't use a character position because multibyte characters can cause character positions to differ from byte positions.
1. If the offset is in the middle of a line, skip the remaining bytes in that line. The next complete NDJSON line is stream line `1`.
1. Count complete NDJSON lines until you reach the reported stream line. For example, at offset `60000000`, stream line `54` is the 54th complete NDJSON line after the remainder of any partial line at that offset.
1. To determine the absolute source line, count the NDJSON lines from the beginning of the file to the record you found. The absolute line number equals the number of complete lines before stream line `1`, plus the reported stream line.

The following Python example locates a record and returns its byte position and absolute line number. Use the original file bytes, and provide the offset and line number from the diagnostic.

```python
from pathlib import Path


def locate_ndjson_record(path, stream_offset, stream_line):
    with Path(path).open("rb") as source:
        if stream_offset == 0:
            record_start = 0
        else:
            source.seek(stream_offset - 1)
            if source.read(1) == b"\n":
                record_start = stream_offset
            else:
                source.seek(stream_offset)
                source.readline()
                record_start = source.tell()

        source.seek(record_start)
        for _ in range(stream_line - 1):
            if not source.readline():
                raise ValueError("The stream line is outside the source file.")

        record_start = source.tell()
        record = source.readline()
        if not record:
            raise ValueError("The stream line is outside the source file.")

        source.seek(0)
        absolute_line = 1
        while source.tell() < record_start:
            source.readline()
            absolute_line += 1

    return record_start, absolute_line, record.decode("utf-8").rstrip("\r\n")


byte_position, absolute_line, record = locate_ndjson_record(
    "input.ndjson", 60000000, 54
)
print(f"Byte position: {byte_position}")
print(f"Absolute line: {absolute_line}")
print(record)
```

Use the resource `id` in the error as an additional check. An ID alone might not uniquely identify the source record if the file contains multiple versions of that resource, so also compare the record's `meta.versionId` and `meta.lastUpdated` values when present.

## Does the stream start offset always point to the beginning of an NDJSON line?

No. The stream start offset can point to the middle of an NDJSON line. When that happens, the first full NDJSON line after the offset is stream line `1`. Don't treat the offset as the start of the failing resource; use the offset and stream line together to locate the record.

## What should I do when an incremental import reports a version conflict?

A version conflict can occur when multiple import jobs, or an import job and an API write, attempt to update the same resource at the same time. To reduce conflicts, combine small input files where appropriate and limit the number of parallel import jobs. Use the byte position and stream line from the diagnostic to identify the affected source record, then use its ID and version metadata to investigate competing updates.

For more information, see [Import FHIR data](import-data.md).

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
