---
title: Post-deployment configuration with extensions
description: Learn how to use Azure Resource Manager template (ARM template) extensions for post-deployment configurations.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 06/23/2023
---

# Post-deployment configurations by using extensions

Azure Resource Manager template (ARM template) extensions are small applications that provide post-deployment configuration and automation tasks on Azure resources. The most popular one is virtual machine extensions. See [Virtual machine extensions and features for Windows](../../virtual-machines/extensions/features-windows.md), and [Virtual machine extensions and features for Linux](../../virtual-machines/extensions/features-linux.md).

## Extensions

The existing extensions are:

- [Microsoft.Compute/virtualMachines/extensions](/azure/templates/microsoft.compute/virtualmachines/extensions)
- [Microsoft.Compute virtualMachineScaleSets/extensions](/azure/templates/microsoft.compute/virtualmachinescalesets/extensions)
- [Microsoft.HDInsight clusters/extensions](/azure/templates/microsoft.hdinsight/clusters)
- [Microsoft.Sql servers/databases/extensions](/azure/templates/microsoft.sql/servers/databases/extensions)
- [Microsoft.Web/sites/siteextensions](/azure/templates/microsoft.web/sites/siteextensions)

To find out the available extensions, browse to the [template reference](/azure/templates/). In **Filter by title**, enter **extension**.

To learn how to use these extensions, see:

- [Tutorial: Deploy virtual machine extensions with ARM templates](template-tutorial-deploy-vm-extensions.md).
- [Tutorial: Import SQL BACPAC files with ARM templates](template-tutorial-deploy-sql-extensions-bacpac.md)

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Deploy virtual machine extensions with ARM templates](template-tutorial-deploy-vm-extensions.md)
