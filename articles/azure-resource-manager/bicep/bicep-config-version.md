---
title: Configure Bicep compiler version requirements
description: Learn how to specify Bicep compiler versions in bicepconfig.json, use version ranges, and resolve version mismatches across local modules.
ms.topic: concept-article
ms.custom: devx-track-bicep
ms.date: 10/28/2026
#customer intent: As a Bicep author, I want to declare compiler version requirements so that my team uses compatible tooling for our Bicep files.
---

# Configure Bicep compiler version requirements

Use the `bicep.version` property in `bicepconfig.json` to declare which compiler versions your Bicep files support. You can require one exact version or allow a range, helping your team keep local development and automated builds consistent.

Version pinning checks the compiler that's already running. The setting doesn't itself download, install, or switch compiler versions.

## Set a compiler version requirement

Add a `bicep` section to your [Bicep configuration file](bicep-config.md):

```json
{
  "bicep": {
    "version": "1.2.3"
  }
}
```

This example permits only version `1.2.3`. To permit a range instead, use comparison operators:

```json
{
  "bicep": {
    "version": ">=1.2.0, <2.0.0"
  }
}
```

The range permits versions at or above `1.2.0` and below `2.0.0`.

The version numbers in this article illustrate the syntax. They aren't minimum supported versions or a claim that those releases are available. Choose published compiler versions that support the feature and your Bicep files.

If no effective version requirement is configured, Bicep doesn't perform this version check. Adding a requirement doesn't change your template's resource API versions or pin module registry versions.

## Supported version syntax

A version contains one, two, or three numeric components: major, minor, and patch. Bicep compares the components numerically, in that order. For example, `1.10.0` is greater than `1.2.0`.

| Syntax | Meaning |
| --- | --- |
| `1.2.3` or `=1.2.3` | Exactly `1.2.3`. |
| `>1.2.3` | Greater than `1.2.3`, excluding that version. |
| `>=1.2.3` | Greater than or equal to `1.2.3`. |
| `<2.0.0` | Less than `2.0.0`, excluding that version. |
| `<=2.0.0` | Less than or equal to `2.0.0`. |
| `>=1.2.0, <2.0.0` | Both conditions must be satisfied. |

A two-condition range must contain one lower bound (`>` or `>=`) and one upper bound (`<` or `<=`). Separate them with a comma. Either order is accepted: `<2.0.0, >=1.2.0` means the same thing as `>=1.2.0, <2.0.0`. Spaces around conditions and between an operator and its version are accepted.

### Shortened versions are exact, not wildcards

Missing components default to zero:

| Value | Equivalent value |
| --- | --- |
| `1` | `1.0.0` |
| `1.2` | `1.2.0` |
| `>=1.2, <2` | `>=1.2.0, <2.0.0` |

In particular, `"1.2"` doesn't permit every `1.2` patch release. To allow that range, write `">=1.2.0, <1.3.0"`.

### Unsupported syntax

Bicep uses its own numeric version-constraint syntax. Don't assume that expressions accepted by package managers also work here.

| Unsupported form | Examples |
| --- | --- |
| Wildcards | `*`, `1.*`, `1.2.x` |
| Caret or tilde ranges | `^1.2.3`, `~1.2.3` |
| Alternative or not-equal conditions | `1.2.3 || 2.0.0`, `!=1.2.3` |
| Hyphen or interval ranges | `1.2.0 - 2.0.0`, `[1.2.0,2.0.0)` |
| A version prefix | `v1.2.3` |
| Prerelease or build metadata in a constraint | `1.2.3-preview`, `1.2.3+build` |
| Repeated lower or upper bounds | `>=1.0.0, >=1.2.0` |
| An exact version combined with another condition | `=1.2.3, <2.0.0` |
| More than two conditions | `>=1.0.0, <2.0.0, <=1.9.0` |
| Leading zeroes or more than three components | `01.2.3`, `1.2.3.4` |
| An empty string | `""` |

An unsupported `bicep.version` expression causes Bicep to report `BCP273`, the existing error for an invalid Bicep configuration file. This diagnostic isn't specific to version constraints. For example, `"version": "^1.2.3"` produces a message with configuration-level context followed by the specific cause:

```diagnostic
BCP273: Failed to parse the contents of the Bicep configuration file "file:///example/bicepconfig.json": The bicep.version property "^1.2.3" is not a valid Bicep version or version range.
```

In this case, the JSON can be valid even though the version expression isn't supported. Correct the `bicep.version` value.

A range can have valid syntax but permit no version. For example, `>=2.0.0, <1.0.0` parses, but no numeric compiler version satisfies it. Likewise, no version falls strictly between `1.2.3` and `1.2.4`. Valid syntax also doesn't guarantee that a matching Bicep release exists.

## Understand CLI and editor behavior

The compiler checks its running version against the effective requirement for each source file.

| Condition | Bicep CLI | Bicep language server in the editor |
| --- | --- | --- |
| Running version satisfies the requirement | No version-mismatch diagnostic. | No version-mismatch diagnostic. |
| Running version doesn't satisfy the requirement | [BCP456](diagnostics/bcp456.md), an error that prevents successful compilation. | BCP456, a warning. |
| Running version can't be parsed for comparison | [BCP457](diagnostics/bcp457.md), a warning. | BCP457, a warning. |
| Configured requirement is invalid | BCP273, a configuration error. | BCP273, a configuration error. |

An editor warning doesn't mean the same files build successfully with an incompatible CLI. The warning lets you continue editing, but you still need a compatible compiler for the build.

BCP457 means the requirement couldn't be checked, not that it passed. Other compiler errors and linter diagnostics still apply, regardless of the version-check result.


## Use version requirements across folders and modules

Each `.bicep` or `.bicepparam` file finds its own nearest `bicepconfig.json`, starting in the source file's folder and searching parent folders. Discovery doesn't start in your shell's current folder.

A local module uses its own nearest configuration, not its parent's already-resolved settings. One compiler handles the compilation, so that compiler must satisfy all applicable requirements. Bicep doesn't select a different executable for each module.

For example:

```text
project\
  bicepconfig.json
  main.bicep
  modules\
    bicepconfig.json
    storage.bicep
```

If the root configuration requires `>=1.0.0, <2.0.0` and the module configuration requires `>=1.5.0, <2.0.0`, versions in `>=1.5.0, <2.0.0` satisfy both. However, the entrypoint still permits older versions that the module rejects.

Two new linter rules help identify these differences:

| Rule | Default level | What it checks |
| --- | --- | --- |
| [no-conflicting-version-constraints](linter-rule-no-conflicting-version-constraints.md) | Error | Whether the entrypoint and its local modules have a common allowed version. |
| [no-incompatible-entrypoint-version](linter-rule-no-incompatible-entrypoint-version.md) | Warning | Whether every version allowed by the entrypoint is also allowed by each constrained local module. |

These are different checks. Overlapping ranges can pass the conflict rule but fail the entrypoint-compatibility rule, as in the preceding example. Narrowing the root requirement to `>=1.5.0, <2.0.0` resolves that incompatibility.

The rules follow direct and transitive local `module` references. They don't scan every file in your repository or inspect registry and template-spec module internals. They aren't a general traversal of `import` or `.bicepparam` `using` references. Each rule reports its first finding at the entrypoint's document start and uses the entrypoint's effective rule settings.

If the entrypoint has no requirement but a local module does, the entrypoint-compatibility rule warns: the entrypoint might otherwise allow a compiler that the module rejects. A module with no requirement adds no restriction.

### Inherit a shared requirement

Parent-folder configuration files don't merge automatically. To share settings while keeping a nearer configuration, use [configuration inheritance](bicep-config-inheritance.md).

For example, create `shared\bicepconfig.json`:

```json
{
  "bicep": {
    "version": ">=1.2.0, <2.0.0"
  }
}
```

In `app\bicepconfig.json`, extend that file:

```json
{
  "extends": "../shared/bicepconfig.json"
}
```

The app inherits the shared requirement. If the app supplies its own non-null `bicep.version` string, that string replaces the inherited requirement; Bicep doesn't intersect the two strings:

```json
{
  "extends": "../shared/bicepconfig.json",
  "bicep": {
    "version": "1.5.0"
  }
}
```

The effective requirement is exactly `1.5.0`. Omitting the property preserves the inherited value. Setting it to `null` doesn't clear an inherited non-null requirement. To remove an inherited requirement, change the base configuration or the inheritance structure.

## Try a version check

The following steps use the standalone Bicep CLI, not Azure CLI or Azure PowerShell.

1. Check the compiler you invoke directly:

   ```console
   bicep --version
   ```

1. Create a `bicepconfig.json` file next to your test file and set `bicep.version` to the numeric version reported by your installed compiler. The compiler must support this configuration setting.

1. Create `main.bicep`:

   ```bicep
   output message string = 'Version requirement example'
   ```

1. Compile the file:

   ```console
   bicep build .\main.bicep
   ```

   A matching version produces no BCP456 diagnostic. The output is `main.json`.

1. Change the configured requirement to exclude your running version, and then run the build again.

   The build reports BCP456 as an error. When the editor's language-server compiler doesn't satisfy the requirement, it reports BCP456 as a warning.

Check the compiler used by the tool that reports the diagnostic. Your editor and command-line tools can use different Bicep installations. The `bicep --version` command describes the executable resolved by that command, not every tool on your computer.

## Configure the compatibility rules

Use the existing [linter configuration](bicep-config-linter.md) to change the level for each rule:

```json
{
  "analyzers": {
    "core": {
      "rules": {
        "no-conflicting-version-constraints": {
          "level": "error"
        },
        "no-incompatible-entrypoint-version": {
          "level": "warning"
        }
      }
    }
  }
}
```

Supported levels are `error`, `warning`, `info`, and `off`. These settings control the severity of the two compatibility rules.

## Troubleshoot version requirements

| Diagnostic or symptom | Action |
| --- | --- |
| BCP273 | Read the detailed configuration error. If it identifies `bicep.version`, correct the constraint by using a supported numeric version or range. BCP273 can also report other configuration problems. |
| BCP456 | Use a compiler that satisfies the requirement, or deliberately update the requirement after checking compatibility. Read the message to locate its declaring configuration. |
| BCP457 | Use a compiler whose reported version can be parsed. Don't treat the warning as a successful compatibility check. |
| Conflicting version constraints | Align the entry point and local-module requirements so that a common version exists. |
| Incompatible entry point requirement | Narrow the entry point's range, or update module requirements after verifying compatibility, so every allowed entry point version works for the modules. |
| Editor and CLI disagree | Check the compiler versions used by each tool and the nearest configuration for the affected file. |

If constraints conflict, installing another compiler alone can't solve the problem: no single version meets all the stated requirements.

## Related content

- [Configure your Bicep environment](bicep-config.md)
- [Bicep configuration inheritance](bicep-config-inheritance.md)
- [Install Bicep tools](install.md)
- [Use Bicep linter](linter.md)
