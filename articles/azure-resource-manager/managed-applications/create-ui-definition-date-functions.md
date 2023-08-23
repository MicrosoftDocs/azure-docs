---
title: Create UI definition date functions
description: Describes the functions to use when working with date values.
ms.topic: conceptual
ms.date: 07/13/2020
---

# CreateUiDefinition date functions

The functions to use when working with date values.

## addHours

Adds an integral number of hours to the specified timestamp.

The following example returns `"1991-01-01T00:59:59.000Z"`:

```json
"[addHours('1990-12-31T23:59:59Z', 1)]"
```

## addMinutes

Adds an integral number of minutes to the specified timestamp.

The following example returns `"1991-01-01T00:00:59.000Z"`:

```json
"[addMinutes('1990-12-31T23:59:59Z', 1)]"
```

## addSeconds
Adds an integral number of seconds to the specified timestamp.

The following example returns `"1991-01-01T00:00:00.000Z"`:

```json
"[addSeconds('1990-12-31T23:59:60Z', 1)]"
```

## utcNow

Returns a string in ISO 8601 format of the current date and time on the local computer.

The following example could return `"1990-12-31T23:59:59.000Z"`:

```json
"[utcNow()]"
```

## Next steps

* For an introduction to Azure Resource Manager, see [Azure Resource Manager overview](../management/overview.md).
