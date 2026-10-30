---
title: Linter rule - no incompatible entrypoint version
description: Align a Bicep entrypoint's allowed compiler versions with the requirements of its local modules.
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 10/28/2026
---

# Linter rule - no incompatible entrypoint version

This rule warns when an entrypoint allows a compiler version that a referenced local module rejects. The entrypoint is the file you start compiling, such as `main.bicep`. Its allowed versions must be a subset of every constrained local module's allowed versions.

## Linter rule code

Use this value in the [Bicep linter configuration](bicep-config-linter.md):

`no-incompatible-entrypoint-version`

The default level is `warning`.

## Solution

Ensure that every compiler version permitted by the entrypoint also satisfies its local modules. Overlapping ranges aren't enough.

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

The root `bicepconfig.json` permits:

```json
{
  "bicep": {
    "version": ">=1.0.0, <3.0.0"
  }
}
```

The `modules\bicepconfig.json` permits:

```json
{
  "bicep": {
    "version": ">=2.0.0, <3.0.0"
  }
}
```

The ranges overlap, so a compatible compiler can exist. However, the entrypoint also permits versions below `2.0.0`, which the module rejects. The rule warns even if your currently running compiler satisfies both requirements.

Narrow the root requirement:

```json
{
  "bicep": {
    "version": ">=2.0.0, <3.0.0"
  }
}
```

Now every version allowed by the entrypoint also satisfies the module. These numbers illustrate range behavior, not release availability.

If the entrypoint has no version requirement but a referenced local module does, add an entrypoint requirement compatible with the module. A module without a requirement adds no restriction.

## Scope and configuration

The rule follows direct and transitive local `module` references. It doesn't inspect registry or template-spec module internals or scan unrelated repository files.

It reports the first incompatible module at the start of the entrypoint, using that file's effective rule level. This check compares the configured allowed versions, not just the running compiler.

To change the level, configure `analyzers.core.rules.no-incompatible-entrypoint-version.level` as `error`, `warning`, `info`, or `off`. Changing this setting doesn't change [BCP456](diagnostics/bcp456.md).

For requirements that have no common allowed version at all, see [no-conflicting-version-constraints](linter-rule-no-conflicting-version-constraints.md).

## Next steps

- [Configure Bicep compiler version requirements](bicep-config-version.md)
- [Use Bicep linter](linter.md)
