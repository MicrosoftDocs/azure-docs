---
author: jiec
ms.author: jiec
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 04/02/2022
---

<!-- 
Use the following line at the end of the Prerequisites section, where relevant. Note that the bullet point is NOT included in the include itself, but should be included on the line you paste in, exactly as shown below. The Prerequisites list should not have any line breaks between bullet points, including this one. These specific instructions are necessary so that the Prerequisites list will build as a single-spaced list, without extra blank spaces.

- [!INCLUDE [install-app-user-identity-extension](includes/install-app-user-identity-extension.md)]

-->

The Azure Spring Apps extension for Azure CLI supports app user-assigned managed identity with version 1.0.0 or later. Use the following command to remove previous versions and install the latest extension:

   ```azurecli
   az extension remove --name spring
   az extension add --name spring
   ```
