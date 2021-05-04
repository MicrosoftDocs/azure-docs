---
title: 'App Service on Azure Arc'
description: An introduction to App Service integration with Azure Arc for Azure operators.
ms.date: 05/03/2021
---

# App Service on Azure Arc (Preview)

Azure App Service can be run on an Azure Arc-enabled Kubernetes cluster. The Kubernetes cluster can be on-premises or hosted in a third-party cloud. This approach lets app developers take advantage of the features of App Service. At the same time, it lets their IT administrators maintain corporate compliance by hosting the App Service apps on internal infrastructure. It also lets other IT operators safeguard their prior investments in other cloud providers by running App Service on existing Kubernetes clusters.

> [!NOTE]
> To learn how to set up your Kubernetes cluster for App Service, see [Create an App Service Kubernetes environment (Preview)](manage-create-arc-environment.md).

[!INCLUDE[appliesto-adf-asa-md](../../includes/app-service-arc-overview-shared.md)]

## Frequently Asked Questions

### Are both Windows and Linux apps supported?

Only Linux-based apps are supported, both code and custom containers. Windows apps are not supported.

### Which built-in application stacks are supported?

All built-in Linux stacks are supported.

### Are all app deployment types supported?

FTP deployment is not supported. Currently `az webapp up` is also not supported. Other deployment methods are supported, including Git, ZIP, CI/CD, Visual Studio, and Visual Studio Code.

### Which App Service features are supported?

During the preview period, certain App Service features are being validated. When they're supported, their left navigation options in the Azure portal will be activated. Features that are not yet supported remain grayed out.

## Next steps

[Create an App Service Kubernetes environment (Preview)](manage-create-arc-environment.md)