---
ms.topic: include
ms.date: 08/12/2024
---

### Configuration

- You can capture a snapshot of the existing app settings and connection strings from the Azure portal. Expand **Settings** > **Environment variables**, select **Advanced edit** under either **App settings** or **Connections strings** and save the JSON output that contains the existing settings or connections. You need to recreate these settings in the new region, but the values themselves are likely to change as a result of subsequent region changes in the connected services.

- Existing [Key Vault references](/azure/app-service/app-service-key-vault-references) can't be exported across an Azure geographical boundary. You must recreate any required references in the new region.

- Your app configuration might be managed by [Azure App Configuration](/azure/azure-app-configuration/overview) or from some other central (downstream) database dependency. Review any App Configuration store or similar stores for environment and region-specific settings that might require modifications.

