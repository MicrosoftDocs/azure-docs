---
title: Secure access to assets and asset endpoints
description: Use the Azure portal or CLI to secure access to your assets and asset endpoints by using Azure role-based access control.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 07/11/2024

#CustomerIntent: As an IT administrator, I want configure Azure RBAC on my assets and asset endpoints to control access to them.
---

# Secure access to assets and asset endpoints

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Assets and asset endpoints in Azure IoT Operations Preview have representations in both the Kubernetes cluster and the Azure portal. You can use Azure role-based access control (Azure RBAC) to secure access to these resources. Azure RBAC is an authorization system that enables you to manage access to Azure resources. You can use Azure RBAC to grant permissions to users, groups, and applications at a certain scope.

OT users can use the operations experience to create and manage assets and asset endpoints. IT administrators can use the Azure portal or the Azure CLI to manage access to these resources.

This article describes how to use the Azure portal and the Azure CLI to configure Azure RBAC on assets and asset endpoints.

## Prerequisites

To configure Azure RBAC on assets and asset endpoints, you need access to the Azure subscription where Azure IoT Operations Preview is deployed.

## Configure Azure RBAC on assets and asset endpoints

The Azure resources that represent assets and asset endpoints are created in the Azure subscription where Azure IoT Operations Preview is deployed. You can view these resources in the Azure portal and configure Azure RBAC on them. By default, asset endpoint resources are hidden in the Azure portal. To view asset endpoint resources, enable the **Show hidden types** option in the Azure portal. The following screenshot shows the **thermostat** asset and **op-cua-connector-0** asset endpoint from the quickstarts:

:::image type="content" source="media/howto-secure-assets/portal-resources.png" alt-text="Screenshot of the Azure portal that shows an asset and asset endpoint.":::

To configure access to an asset or asset endpoint in the Azure portal, select the resource and then select **Access control (IAM)**:

:::image type="content" source="media/howto-secure-assets/access-control.png" alt-text="Screenshot of the Azure portal that shows how to access the Azure RBAC configuration settings.":::

To learn how to configure Azure RBAC on Azure resources such as assets and asset endpoints, see [What is Azure role-based access control?](../../role-based-access-control/overview.md).

You can also use the following tools to configure RBAC on your resources:

- [PowerShell](../../role-based-access-control/tutorial-role-assignments-user-powershell.md)
- [Azure CLI](../../role-based-access-control/role-assignments-cli.md)
- [Azure Resource Manager templates](../../role-based-access-control/quickstart-role-assignments-template.md)
- [Bicep](../../role-based-access-control/quickstart-role-assignments-bicep.md)

## Related content

- [Connector for OPC UA overview](overview-opcua-broker.md)
- [Akri services overview](overview-akri.md)
- [az iot ops asset](/cli/azure/iot/ops/asset)
- [az iot ops asset endpoint](/cli/azure/iot/ops/asset/endpoint)
