---
title: Bicep configuration inheritance with extends
description: Learn how the extends property in bicepconfig.json lets a configuration file inherit and override settings across a repository or organization.
ms.topic: concept-article
ms.date: 09/04/2026
#customer intent: As a Bicep author, I want to understand configuration inheritance so that I can share and override bicepconfig.json settings across my repository.
---

# Bicep configuration inheritance with the extends property

Bicep configuration inheritance is a `bicepconfig.json` feature that lets one configuration file build on another instead of duplicating it. A configuration file inherits the settings from a base file and overrides only the values it needs to change.

Without inheritance, each folder that needs a `bicepconfig.json` has to restate the entire file. Sharing linter rules, module aliases, or other settings across a repository or organization means copying the whole configuration into every location. Inheritance replaces that duplication with a chain of small, focused configuration files.

For example, a company-wide `bicepconfig.corp.json` can define strict linter rules for everyone. A single team's `bicepconfig.json` extends that file and turns off one rule it doesn't want, without restating any of the other settings.

## How the extends property inherits configuration

A configuration file inherits from another file through the `extends` property, which points to the base file with a relative path:

```json
{
  "extends": "../corp/bicepconfig.corp.json"
}
```

A base file can extend another file, so configuration can form a chain that's several layers deep, such as a team file that extends an organization file that extends a corporate file. Bicep resolves the chain from the most specific file (the leaf) up to the outermost base.

Bicep enforces a few rules on the shape of the `extends` chain:

| Constraint |                                           Behavior                                            | Diagnostic |
| ---------- | --------------------------------------------------------------------------------------------- | :--------: |
| Path type  | The `extends` value must be a relative path, not an absolute one.                             | `BCP453`   |
| Cycles     | The chain can't form a cycle. Bicep rejects a file that extends back to one of its own bases. | `BCP454`   |
| Depth      | A chain can span up to 64 layers. Bicep rejects a chain that exceeds that maximum depth.      | `BCP455`   |

### How to apply company-wide inheritance

In this example, the configuration inherits the base's `no-unused-params` rule as-is, while overriding `no-hardcoded-env-urls` from warning to error.

```json
// /shared/bicepconfig.base.json (shared org-wide base config)
{
  "analyzers": {
    "core": {
      "rules": {
        "no-hardcoded-env-urls": { "level" : "warning" },
        "no-unused-params": { "level": "warning" }
      }
    }
  }
}

// /team/bicepconfig.json (this team's leaf config - extends the shared base)
{
  "extends" : "../shared/bicepconfig.base.json",
    "analyzers": {
      "core": {
        "rules": {
          "no-hardcoded-env-urls": { "level": "error" }
      }
    }
  }
}

// Effective (merged) result:
{
  "analyzers": {
    "core": {
      "rules": {
        "no-hardcoded-env-urls": { "level": "error" },   // overridden by leaf
        "no-unused-params": { "level": "warning" }      // inherited from base, untouched
      }
    }
  }
}
```

## How Bicep merges inherited settings

Bicep merges the `extends` chain one key at a time, and the more specific layer wins. Each file only needs to specify the keys it wants to change; anything it leaves unset falls through from its base. This behavior is consistent across every configuration section, such as analyzer and linter rules or module aliases.

How a value merges depends on its type:

|            Value type            |                                                         Merge behavior                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Object                           | Keys combine recursively. The more specific file wins on conflicting keys, and the base's other keys remain.                    |
| Array                            | Replaced entirely. Arrays aren't appended, merged element by element, or deduplicated.                                          |
| Scalar (string, number, boolean) | Replaced entirely by the more specific value.                                                                                   |
| Null                             | The exception. A `null` value in the more specific file doesn't replace a non-null base value; the non-null base value remains. |

The value type `null` is the one case where the more specific layer doesn't win. For every other scalar, the more specific value replaces the base, but a `null` in a leaf file is ignored when the base holds a non-null value, so that base value stays in effect.

For example, if a base file sets `"implicitExtensions": ["az", "k8s"]` and a more specific file sets `"implicitExtensions": ["kubernetes"]`, the effective value is `["kubernetes"]`. The base array is discarded rather than combined.

## How Bicep discovers configuration files

Each Bicep file resolves its own configuration independently. Starting from the file's own folder, Bicep walks up the directory tree to find the nearest `bicepconfig.json`, then follows that file's `extends` chain. This nearest-ancestor discovery works the same way it does without inheritance; inheritance only adds the chain that starts at the file it finds.

Independent discovery has two important effects:

- **Local modules resolve their own configuration.** A module referenced from a parent template doesn't inherit the parent's already-resolved settings. It finds its own nearest `bicepconfig.json` and follows its own chain. Two files in different folders can end up with completely different effective settings even when one references the other.
- **`.bicep` and `.bicepparam` files behave the same.** A `.bicepparam` file next to a configuration that extends a shared base gets the same multi-layer chain and merge behavior as a `.bicep` file in that location.

Because a shared base file can sit at the top of many chains, an edit to that base propagates to every configuration that extends it, including transitive dependents further down the chain. Bicep updates only the chains that depend on the changed file, so you see the new effective settings on the affected files without triggering a full rebuild of every configuration in the workspace.

## How relative paths resolve in inherited bicepconfig.json settings

Some settings contain relative paths, such as a module alias that points to a local folder. When a file inherits a setting like that, its relative path resolves against the file that declares it, not the leaf configuration that pulls it in through `extends`.

Consider a base file that defines a module alias with a path of `../modules`:

```text
/apps/bicepconfig.json          extends ../config/bicepconfig.base.json
/config/bicepconfig.base.json   defines alias "shared" -> ../modules
```

The `shared` alias resolves relative to `/config/`, so it points to `/modules`. It doesn't resolve relative to `/apps/`, even though the leaf configuration is where the alias takes effect. Declaring-file resolution holds no matter how deep the chain is: a relative path always resolves against the file that declares it, whether that file is the immediate base or several layers up. This rule keeps a shared base configuration portable, because aliases and other relative paths mean the same thing no matter which file inherits them.

## Set up configuration inheritance

Put configuration inheritance into practice with a short setup: define a shared base file, extend it from a more specific file, and override only what you need. These steps build a two-layer chain in which a corporate base enforces a linter rule and a team file turns that rule off.

1. **Create the base configuration file.** In a shared folder, add a `bicepconfig.json` that defines the settings every file should inherit. This example enforces a linter rule across the organization.

   ```json
   {
     "analyzers": {
       "core": {
         "rules": {
           "no-hardcoded-env-urls": { "level": "error" }
         }
       }
     }
   }
   ```

1. **Reference the base file from a more specific file.** In the folder that needs different settings, add a `bicepconfig.json` with an `extends` property that points to the base file through a relative path.

   ```json
   {
     "extends": "../corp/bicepconfig.json"
   }
   ```

1. **Override only the settings you need.** Add the keys you want to change to the more specific file. Everything you leave out continues to fall through from the base. This file turns off the inherited rule without restating the rest of the configuration.

   ```json
   {
     "extends": "../corp/bicepconfig.json",
     "analyzers": {
       "core": {
         "rules": {
           "no-hardcoded-env-urls": { "level": "off" }
         }
       }
     }
   }
   ```

1. **Add more layers if you need them.** A base file can extend its own base, so you can insert an organization file between the corporate file and the team file. Each layer overrides only the keys it cares about, up to the 64-layer maximum.

1. **Verify the effective configuration.** Open a `.bicep` file in the folder that holds the more specific configuration. The overridden rule no longer applies there, while files that resolve to the base still enforce it. Edit the base file and confirm the change propagates to the dependent files without a rebuild. Confirm that no `BCP453`, `BCP454`, or `BCP455` diagnostics appear on any file in the chain.

After you verify these results, the team folder inherits every corporate setting except the one rule it overrides, and you maintain that shared baseline in one place instead of copying it into each folder.

## Troubleshoot bicepconfig.json inheritance issues

When any file in the `extends` chain has a problem, Bicep stops resolving the entire chain before it can place or route the editor squiggle to the offending configuration file. Because resolution stops immediately, the diagnostic and its editor squiggle appear on the document you're currently evaluating or have open&mdash;a `.bicep` or `.bicepparam` source file, or a `bicepconfig.json` you opened directly&mdash;not necessarily on the configuration file that caused the problem.

The diagnostic *message* identifies the offending file. Bicep includes the file path inside the diagnostic, so the message text points to the actual source of the problem even when the squiggle sits on a different file. Read the message to find the file to fix, rather than assuming the squiggle marks it.

The most common inheritance issues map to these diagnostics:

|         Diagnostic          |                                                   Cause                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `BCP453`                    | The `extends` path is absolute. Use a relative path instead.                                               |
| `BCP454`                    | The chain forms a cycle. Remove the `extends` reference that points back into the chain.                   |
| `BCP455`                    | The chain is too deep. Reduce the number of layers so the chain stays within the 64-layer maximum.         |
| `UnloadableBicepConfigFile` | An `extends` target doesn't exist or can't be read. Correct the relative path or restore the missing file. |
| `UnparsableBicepConfigFile` | A file in the chain contains malformed JSON. Fix the JSON syntax in the reported file.                     |

The `BCP453`, `BCP454`, and `BCP455` diagnostics are specific to the `extends` chain. The `UnloadableBicepConfigFile` and `UnparsableBicepConfigFile` diagnostics apply to any `bicepconfig.json` file, but they also break inheritance when they occur on a base file: an unreadable target stops the chain from loading, and malformed JSON in any layer stops Bicep from parsing that layer. In every case, the diagnostic message names the file that has the problem, even though the squiggle appears on the document you currently have open.

## Related content

- [Bicep config file](/azure/azure-resource-manager/bicep/bicep-config)
- [Add linter settings in the Bicep config file](/azure/azure-resource-manager/bicep/bicep-config-linter)
- [Add module settings in the Bicep config file](/azure/azure-resource-manager/bicep/bicep-config-modules)
