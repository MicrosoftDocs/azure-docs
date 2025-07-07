---
title: Linter rule - no unused imports
description: Linter rule - no unused imports
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 06/06/2025
---

# Linter rule - no unused imports

This rule finds [import alias](./bicep-import.md#import-variables-types-and-functions) that aren't referenced anywhere in the Bicep file.

## Linter rule code

Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:

`no-unused-imports`

## Solution

To reduce confusion in your Bicep file, delete any imports that are defined but not used. This test finds all imports that aren't used anywhere in the template.

The following example fails this test because `myImports` and `myObjectType` are not used in the Bicep file:

```bicep
import * as myImports from 'exports.bicep'
import {myObjectType, sayHello} from 'exports.bicep'

output greeting string = sayHello('Bicep user')
```

You can fix it by removing and updating the `import` statements.

```bicep
import {sayHello} from 'exports.bicep'

output greeting string = sayHello('Bicep user')
```

Use **Quick Fix** to remove the unused imports:

:::image type="content" source="./media/linter-rule-no-unused-imports/linter-rule-no-unused-imports-quick-fix.png" alt-text="A screenshot of using Quick Fix for the no-unused-variables linter rule.":::

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).
