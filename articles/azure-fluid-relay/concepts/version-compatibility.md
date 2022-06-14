---
title: Version compatibility with Fluid Framework releases
description: |
  How to determine what versions of the Fluid Framework releases are compatible with Azure Fluid Relay service.
services: azure-fluid
author: tylerbutler
ms.author: tylerbu
ms.date: 09/28/2021
ms.topic: article
ms.service: azure-fluid
---

# Version compatibility with Fluid Framework releases

> [!NOTE]
> This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.

To connect your application to Azure Fluid Relay service,
you'll use the **@fluidframework/azure-client** library. You'll also use the **fluid-framework** library to use the core
data structures and provided by the Fluid Framework.

Since you are using Azure Fluid Relay, you should first install the latest available version of
@fluidframework/azure-client and use that version to determine what version of the fluid-framework library to use. The library expresses a *peer dependency* on the version of the fluid-framework package on
which it depends.

You can use the [install-peerdeps](https://www.npmjs.com/package/install-peerdeps) tool to install both
@fluidframework/azure-client and the compatible version of fluid-framework using the following command:

```bash
npx install-peerdeps @fluidframework/azure-client
```

> [!TIP]
> We strongly recommend that you update to the latest version of **@fluidframework/azure-client** and **fluid-framework**. Earlier versions will not be
> supported heading into General Availability of Azure Fluid Relay. With this upgrade, you’ll make use of our new multi-region routing capability where
> Azure Fluid Relay will host your session closer to your end users to improve customer experience. In the latest package, you will need to update your
> serviceConfig object in app.js to the new Azure Fluid Relay service endpoint instead of the storage and orderer endpoints. These values can be found
> in the "Access Key" section of the Fluid Relay resource in the Azure portal. The orderer and storage endpoints will be deprecated soon.


> [!TIP]
> During Public Preview, the versions of **@fluidframework/azure-client** and **fluid-framework** will match. That is, if
> the current release of **@fluidframework/azure-client** is 0.52, then it will be compatible with **fluid-framework** 0.52. The inverse is also true.

## Compatibility table

| npm package                         | Minimum version | API                                                              |
| ----------------------------------  | :-------------- | :--------------------------------------------------------------- |
| @fluidframework/azure-client        | [0.52][]      | [API](https://fluidframework.com/docs/apis/azure-client/)        |
| fluid-framework                     | [0.52][]      | [API](https://fluidframework.com/docs/apis/fluid-framework/)     |
| @fluidframework/azure-service-utils | [0.52][]      | [API](https://fluidframework.com/docs/apis/azure-service-utils/) |
| @fluidframework/test-client-utils   | [0.52][]      | [API](https://fluidframework.com/docs/apis/test-client-utils/)   |

[0.52]: https://fluidframework.com/docs/updates/v0.52/

## Next steps

- [Provision an Azure Fluid Relay service](../how-tos/connect-fluid-azure-service.md)
- [Connect to an Azure Fluid Relay service](../how-tos/connect-fluid-azure-service.md)
- [Use AzureClient for local testing](../how-tos/local-mode-with-azure-client.md)
