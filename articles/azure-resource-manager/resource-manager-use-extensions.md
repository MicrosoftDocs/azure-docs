---
title: Provide post-deployment configurations by using extensions | Microsoft Docs
description: Learn how to use extensions to provide post-deployment configurations.
services: azure-resource-manager
documentationcenter: na
author: mumian
editor: ''

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/12/2018
ms.author: jgao

---
# Provide post-deployment configurations by using extensions

Template extensions are small applications that provide post-deployment configuration and automation tasks on Azure resources. The most popular one is virtual machine extensions. For vm extension specific information, see [Virtual machine extensions and features for Windows](../virtual-machines/extensions/features-windows.md), and [Virtual machine extensions and features for Linux](../virtual-machines/extensions/features-linux.md).

To find out the available extensions, browse to the [template reference](https://docs.microsoft.com/azure/templates/). In **Filter by title**, enter **extension**.

To learn how to use these extensions, see:

- [Tutorial: Deploy virtual machine extensions with Azure Resource Manager templates](./resource-manager-tutorial-deploy-vm-extensions.md).
- [Tutorial: Import SQL BACPAC files with Azure Resource Manager templates](./resource-manager-tutorial-deploy-sql-extensions-bacpac.md)

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Deploy virtual machine extensions with Azure Resource Manager templates]](./resource-manager-tutorial-deploy-vm-extensions.md)
