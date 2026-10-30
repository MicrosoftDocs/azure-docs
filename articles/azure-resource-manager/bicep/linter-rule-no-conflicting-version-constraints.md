---
title: Linter rule - no conflicting version constraints
description: Resolve conflicting compiler version requirements between a Bicep entrypoint and its local modules.
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 10/28/2026
---

# Linter rule - no conflicting version constraints

This rule reports an error when the compiler version requirements for an entrypoint and its local modules have no common allowed version. One compiler handles the compilation, so a version must exist that satisfies all applicable requirements.

## Linter rule code

Use this value in the [Bicep linter configuration](bicep-config-linter.md):

`no-conflicting-version-constraints`

The default level is `error`.

## Solution

Align the requirements so they share at least one version. Checking only that each pair of modules overlaps isn't enough; the complete set needs a common intersection.

Consider this layout:

```text
project\
  bicepconfig.json
  main.bicep
  modules\
    bicepconfig.json
    child.bicep
```

In `main.bicep`, reference the local module:

```bicep
module child './modules/child.bicep' = {
  name: 'child'
}
```

For this example, `modules\child.bicep` contains:

```bicep
output message string = 'Local module'
```

The root `bicepconfig.json` permits versions below `2.0.0`:

```json
{
  "bicep": {
    "version": ">=1.0.0, <2.0.0"
  }
}
```

The `modules\bicepconfig.json` requires versions at or above `2.0.0`:

```json
{
  "bicep": {
    "version": ">=2.0.0, <3.0.0"
  }
}
```

No compiler version satisfies both, so the rule reports an error. If the module also supports the entrypoint's versions, update its requirement to reflect that compatibility:

```json
{
  "bicep": {
    "version": ">=1.0.0, <3.0.0"
  }
}
```

Now every version allowed by the entrypoint is allowed by the module. Change requirements only after verifying that the affected Bicep files support those versions. These numbers illustrate range behavior, not release availability.

## Scope and configuration

The rule includes the entrypoint and follows direct and transitive local `module` references. Files without a version requirement don't narrow the common range. The rule doesn't inspect registry or template-spec module internals or scan unrelated repository files.

It reports the first conflict at the start of the entrypoint, using that file's effective rule level. The diagnostic can describe an accumulated intersection rather than only one file's original range.

To change the level, configure `analyzers.core.rules.no-conflicting-version-constraints.level` as `error`, `warning`, `info`, or `off`. Changing this setting doesn't change [BCP456](diagnostics/bcp456.md), which checks the running compiler.

Passing this rule means the numeric constraints overlap. It doesn't prove that a matching release is published, that the running compiler matches, or that every entrypoint version works for every module. For the last check, see [no-incompatible-entrypoint-version](linter-rule-no-incompatible-entrypoint-version.md).

## Next steps

- [Configure Bicep compiler version requirements](bicep-config-version.md)
- [Use Bicep linter](linter.md)
